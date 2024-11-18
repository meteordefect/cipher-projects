exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

# Set up error handling
function handle_error {
    echo "Error occurred in script at line: $1"
    echo "Last command: $2"
    journalctl -xe --no-pager | tail -n 50
    exit 1
}

trap 'handle_error ${LINENO} "${BASH_COMMAND}"' ERR

echo "Starting deployment at $(date)"

# Fetch bucket name from instance tags or environmen variable
if [[ -n "$DEPLOYMENT_BUCKET" ]]; then
    bucket_name=$DEPLOYMENT_BUCKET
else
    TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
    bucket_name=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/tags/instance/DeploymentBucketName)
fi

if [[ -z "$bucket_name" ]]; then
    echo "Error: Deployment bucket name not found."
    exit 1
fi

# Optimize package installation
echo "Optimizing dnf..."
echo 'max_parallel_downloads=20' >> /etc/dnf/dnf.conf
echo 'fastestmirror=true' >> /etc/dnf/dnf.conf

echo "Updating system packages..."
dnf update -y --best --allowerasing
dnf clean all

# Install Node.js repository properly first
echo "Setting up Node.js repository..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -

echo "Installing Node.js and dependencies..."
dnf install -y nodejs nginx git unzip jq gcc gcc-c++ make

# Configure npm for faster installs
echo "Configuring npm for performance..."
npm config set progress=false
npm config set fund=false
npm config set audit=false
npm config set update-notifier=false

echo "Installing global packages..."
# Install latest npm with specific version to avoid issues
npm install -g npm@10.2.4
npm install -g pm2@latest

echo "Setting up application user..."
useradd -m -s /bin/bash webadmin || echo "User already exists"
chown -R webadmin:webadmin /home/webadmin

echo "Setting up application directory..."
mkdir -p /var/www/cipher-projects
chown -R webadmin:webadmin /var/www/cipher-projects

# Configure nginx
[... rest of nginx config ...]

echo "Deploying application..."
cd /var/www/cipher-projects

echo "Downloading deployment package..."
aws s3 cp s3://${bucket_name}/deploy.zip ./deploy.zip
unzip -o deploy.zip
rm deploy.zip

# Set ownership and permissions
chown -R webadmin:webadmin /var/www/cipher-projects

# Switch to webadmin user for npm operations with optimizations
echo "Installing npm dependencies as webadmin..."
su - webadmin << 'EOUSER'
cd /var/www/cipher-projects
export NODE_ENV=production
export PATH=$PATH:/usr/bin

# Configure npm for faster installs in user context
npm config set progress=false
npm config set fund=false
npm config set audit=false
npm config set update-notifier=false

echo "Running npm ci with increased network timeout..."
# Use npm ci with optimizations
npm ci --prefer-offline --no-audit --no-fund --network-timeout=100000

echo "Building application..."
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'cipher-projects',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    exec_mode: 'cluster',
    instances: '1',
    max_memory_restart: '500M'
  }]
}
EOL

echo "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
EOUSER

# Set up PM2 startup script
env PATH=$PATH:/usr/bin /usr/local/bin/pm2 startup systemd -u webadmin --hp /home/webadmin
systemctl enable pm2-webadmin

# Configure SELinux if enabled
if command -v setsebool >/dev/null 2>&1; then
    setsebool -P httpd_can_network_connect 1
fi

# Start and enable nginx
systemctl enable nginx
systemctl start nginx

# Verify deployment
echo "Verifying deployment..."
for i in {1..30}; do
    if curl -s http://localhost > /dev/null; then
        echo "Application successfully deployed"
        pm2 list
        exit 0
    fi
    echo "Waiting for application to start... (attempt $i/30)"
    sleep 10
done

echo "Error: Application failed to start within timeout"
pm2 logs cipher-projects --lines 100
exit 1