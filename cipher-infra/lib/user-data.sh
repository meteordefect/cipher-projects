#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

# Set up error handling
function handle_error {
    echo "Error occurred in script at line: $1"
    echo "Last command: $2"
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
    journalctl -xe --no-pager | tail -n 50
    exit 1
}

trap 'handle_error ${LINENO} "${BASH_COMMAND}"' ERR

echo "Starting deployment at $(date)"

# Get IMDSv2 token with error handling
echo "Getting IMDSv2 token..."
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" 2>/dev/null) || {
    echo "Failed to get IMDSv2 token"
    exit 1
}

echo "Getting AWS Region..."
AWS_REGION=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/placement/region) || {
    echo "Failed to get AWS region"
    exit 1
}
echo "AWS Region: ${AWS_REGION}"

# Get the bucket name with error handling
if [[ -n "$DEPLOYMENT_BUCKET" ]]; then
    bucket_name=$DEPLOYMENT_BUCKET
else
    echo "Getting bucket name from instance tag..."
    bucket_name=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/tags/instance/DeploymentBucketName)
fi

if [[ -z "$bucket_name" ]]; then
    echo "Error: Could not determine bucket name"
    exit 1
fi

echo "Using deployment bucket: ${bucket_name}"

# Optimize package installation
echo "Optimizing dnf..."
echo 'max_parallel_downloads=20' >> /etc/dnf/dnf.conf
echo 'fastestmirror=true' >> /etc/dnf/dnf.conf

echo "Updating system packages..."
dnf update -y --best --allowerasing || {
    echo "Failed to update system packages"
    exit 1
}
dnf clean all

# Install Node.js repository properly first
echo "Setting up Node.js repository..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - || {
    echo "Failed to set up Node.js repository"
    exit 1
}

echo "Installing Node.js and dependencies..."
dnf install -y nodejs nginx git unzip jq gcc gcc-c++ make || {
    echo "Failed to install required packages"
    exit 1
}

# Verify Node.js installation
echo "Verifying Node.js installation..."
command -v node >/dev/null 2>&1 || { 
    echo "Error: Node.js installation failed" 
    exit 1
}
node -v || { 
    echo "Error: Node.js is not working properly"
    exit 1
}

# Configure npm for faster installs
echo "Configuring npm for performance..."
npm config set progress=false
npm config set fund=false
npm config set audit=false
npm config set update-notifier=false

echo "Installing global packages..."
npm install -g npm@10.2.4 || {
    echo "Failed to install npm"
    exit 1
}
npm install -g pm2@latest || {
    echo "Failed to install pm2"
    exit 1
}
node -v
npm -v

echo "Setting up application user..."
useradd -m -s /bin/bash webadmin || echo "User already exists"
chown -R webadmin:webadmin /home/webadmin

echo "Setting up application directory..."
mkdir -p /var/www/cipher-projects
chown -R webadmin:webadmin /var/www/cipher-projects

# Configure nginx
echo "Configuring nginx..."
cat > /etc/nginx/conf.d/nextjs.conf << 'EOL'
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types
        application/javascript
        application/json
        application/x-javascript
        text/css
        text/javascript
        text/plain;

    # Next.js static files
    location /_next/static/ {
        alias /var/www/cipher-projects/.next/static/;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, no-transform";
    }

    # Next.js application
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
}
EOL

# Verify nginx configuration
echo "Verifying nginx configuration..."
nginx -t || {
    echo "Error: Invalid nginx configuration"
    exit 1
}

# Change to the application directory
echo "Setting working directory to /var/www/cipher-projects"
cd /var/www/cipher-projects || { 
    echo "Failed to change directory to /var/www/cipher-projects"
    exit 1
}

# Check existing deployment and clean if necessary
if [ -d ".next" ] || [ -f "package.json" ]; then
    echo "Found existing deployment, checking structure..."
    echo "Current directory contents before cleanup:"
    ls -la
    echo "Cleaning up existing deployment..."
    cd /var/www/cipher-projects
    pwd
    find . -mindepth 1 -delete
    echo "Directory contents after cleanup:"
    ls -la
fi

# Check for and download deploy.zip
echo "Checking for deploy.zip in ${bucket_name}..."
if aws s3 ls "s3://${bucket_name}/deploy.zip" --region="${AWS_REGION}" 2>/dev/null; then
    echo "deploy.zip found, downloading..."
    if aws s3 cp "s3://${bucket_name}/deploy.zip" ./deploy.zip --region="${AWS_REGION}"; then
        echo "Successfully downloaded deploy.zip"
        echo "Extracting deploy.zip..."
        if unzip -o deploy.zip; then
            echo "Successfully extracted deploy.zip"
            echo "Contents of extracted files:"
            ls -la
            pwd

            echo "Checking Next.js project structure..."
            if [ ! -f "package.json" ]; then
                echo "Error: Missing package.json"
                exit 1
            fi

            if [ ! -d "pages" ] && [ ! -d "app" ]; then
                echo "Error: Missing required Next.js directory structure (need either 'pages' or 'app' directory)"
                echo "Current directory structure:"
                find . -type d
                exit 1
            fi

            echo "Checking package.json for Next.js..."
            if ! grep -q '"next":' package.json; then
                echo "Error: Not a Next.js project (next.js not found in package.json)"
                cat package.json
                exit 1
            fi

            rm deploy.zip
        else
            echo "Error: Failed to extract deploy.zip"
            exit 1
        fi
    else
        echo "Error: Failed to download deploy.zip"
        exit 1
    fi
else
    echo "Error: deploy.zip not found in bucket ${bucket_name}"
    echo "Available files in bucket:"
    aws s3 ls "s3://${bucket_name}" --region="${AWS_REGION}" || echo "Could not list bucket contents"
    exit 1
fi

# Set ownership and permissions
chown -R webadmin:webadmin /var/www/cipher-projects

# Switch to webadmin user for npm operations with optimizations
echo "Installing npm dependencies as webadmin..."
su - webadmin << 'EOUSER'
cd /var/www/cipher-projects || exit 1
export NODE_ENV=production
export PATH=$PATH:/usr/bin

# Configure npm for faster installs in user context
npm config set progress=false
npm config set fund=false
npm config set audit=false
npm config set update-notifier=false

echo "Running npm ci with increased network timeout..."
echo "Current directory: $(pwd)"
echo "Directory contents before npm ci:"
ls -la

npm ci --prefer-offline --no-audit --no-fund --network-timeout=100000 || {
    echo "npm ci failed"
    echo "package.json contents:"
    cat package.json
    echo "Directory contents:"
    ls -la
    exit 1
}

echo "Building application..."
echo "Current directory: $(pwd)"
echo "Directory contents before build:"
ls -la

npm run build || {
    echo "Build failed"
    echo "package.json contents:"
    cat package.json
    echo "Directory contents:"
    ls -la
    exit 1
}

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
pm2 start ecosystem.config.js || exit 1
pm2 save || exit 1
EOUSER

# Set up PM2 startup script with full path
echo "Setting up PM2 startup..."
export PM2_HOME="/home/webadmin/.pm2"
sudo -u webadmin env PATH=$PATH:/usr/bin:/usr/local/bin /usr/local/bin/pm2 startup systemd -u webadmin --hp /home/webadmin || {
    echo "Failed to set up PM2 startup"
    exit 1
}
systemctl enable pm2-webadmin || echo "Warning: Failed to enable pm2-webadmin service"

# Configure SELinux if enabled
if command -v setsebool >/dev/null 2>&1; then
    setsebool -P httpd_can_network_connect 1 || {
        echo "Warning: Failed to set SELinux boolean"
    }
fi

# Start and enable nginx
systemctl enable nginx
systemctl start nginx

# Verify nginx status
echo "Verifying nginx status..."
systemctl is-active nginx || {
    echo "Error: nginx is not running"
    systemctl status nginx
    exit 1
}

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