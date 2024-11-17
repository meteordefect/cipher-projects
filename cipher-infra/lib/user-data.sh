#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

# Fetch deployment configuration
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
bucket_name=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/tags/instance/DeploymentBucketName)

if [[ -z "$bucket_name" ]]; then
    echo "Error: Deployment bucket name not found."
    exit 1
fi

# System Updates and Dependencies
yum update -y
yum install -y gcc-c++ make git unzip nginx jq

# Install Node.js 18
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 18
nvm use 18
nvm alias default 18

# Install PM2 globally
npm install -g pm2

# Configure NGINX
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
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;";

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
        text/plain
        text/xml;

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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOL

# Create application directory
mkdir -p /var/www/cipher-projects
cd /var/www/cipher-projects

# Deploy application
aws s3 cp s3://${bucket_name}/deploy.zip ./deploy.zip
unzip -o deploy.zip
rm deploy.zip

# Install dependencies and build
npm ci --production
npm run build

# Configure PM2
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
    instances: 'max',
    max_memory_restart: '500M'
  }]
}
EOL

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup amazon -u ec2-user

# Configure NGINX and start services
systemctl enable nginx
systemctl start nginx

# Verify deployment
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