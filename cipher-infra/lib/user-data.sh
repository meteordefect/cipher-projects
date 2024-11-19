#!/bin/bash

# Enable error handling and logging
set -ex
exec > >(tee /var/log/user-data.log) 2>&1

echo "Starting deployment at $(date)"

# Verify deployment bucket is set
if [ -z "${DEPLOYMENT_BUCKET}" ]; then
    echo "Error: DEPLOYMENT_BUCKET environment variable is not set!"
    exit 1
fi
echo "Using deployment bucket: ${DEPLOYMENT_BUCKET}"

# Update system and install dependencies
echo "Updating system and installing dependencies..."
dnf update -y --skip-broken
dnf install -y nodejs nginx unzip

# Configure nginx
echo "Configuring nginx..."
cat > /etc/nginx/conf.d/nextjs.conf << 'EOL'
server {
    listen 80 default_server;
    server_name _;

    # Root directory for Next.js app
    root /var/www/nextjs;

    # Handle static files
    location /_next/static {
        alias /var/www/nextjs/.next/static;
        expires 365d;
        access_log off;
    }

    # Proxy all other requests to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    error_log /var/log/nginx/nextjs_error.log;
    access_log /var/log/nginx/nextjs_access.log;
}
EOL

# Create systemd service for Next.js
echo "Creating systemd service..."
cat > /etc/systemd/system/nextjs.service << 'EOL'
[Unit]
Description=Next.js Application
After=network.target

[Service]
Type=simple
User=ec2-user
Environment=NODE_ENV=production
WorkingDirectory=/var/www/nextjs
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

# Setup application directory
echo "Setting up application directory..."
mkdir -p /var/www/nextjs
cd /var/www/nextjs

# Get deployment package from S3
echo "Downloading deployment package from s3://${DEPLOYMENT_BUCKET}/deploy.zip"
aws s3 cp "s3://${DEPLOYMENT_BUCKET}/deploy.zip" . || {
    echo "Failed to download deployment package!"
    exit 1
}

# Unzip and setup application
echo "Unpacking deployment package..."
unzip -o deploy.zip || {
    echo "Failed to unzip deployment package!"
    exit 1
}

# Fix permissions
chown -R ec2-user:ec2-user /var/www/nextjs

# Install dependencies as ec2-user
echo "Installing dependencies..."
sudo -u ec2-user bash -c 'cd /var/www/nextjs && npm ci'
echo "Building application..."
sudo -u ec2-user bash -c 'cd /var/www/nextjs && npm run build'

# Start services
echo "Starting services..."
systemctl daemon-reload
systemctl enable nginx
systemctl enable nextjs
systemctl start nginx
systemctl start nextjs

echo "Deployment completed at $(date)"