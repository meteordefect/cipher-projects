exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

# Set up error handling
function handle_error {
    echo "An error occurred on line $1"
    exit 1
}

trap 'handle_error $LINENO' ERR

# Fetch bucket name from instance tags or environment variable
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

# System Updates with best and allowerasing to handle dracut conflicts
dnf update -y --best --allowerasing
dnf clean all

# Install Node.js repo and Node.js
dnf install -y nodejs

# Install other required packages
dnf install -y nginx git unzip jq gcc gcc-c++ make

# Create application user
useradd -m -s /bin/bash webadmin || echo "User already exists"

# Set correct ownership
chown -R webadmin:webadmin /home/webadmin

# Install npm and PM2 globally
npm install -g npm@latest
npm install -g pm2

# Create application directories with correct permissions
mkdir -p /var/www/cipher-projects
chown -R webadmin:webadmin /var/www/cipher-projects

# Configure nginx
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

# Deploy application as webadmin user
cd /var/www/cipher-projects

echo "Downloading deployment package..."
aws s3 cp s3://${bucket_name}/deploy.zip ./deploy.zip
unzip -o deploy.zip
rm deploy.zip

# Set ownership and permissions
chown -R webadmin:webadmin /var/www/cipher-projects

# Switch to webadmin user for npm operations
su - webadmin << 'EOUSER'
cd /var/www/cipher-projects
export NODE_ENV=production
export PATH=$PATH:/usr/bin

echo "Installing dependencies..."
npm ci

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