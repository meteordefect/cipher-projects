#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

# Fetch bucket name from instance tags or environment variable
if [[ -n "$DEPLOYMENT_BUCKET" ]]; then
    bucket_name=$DEPLOYMENT_BUCKET
else
    # Using IMDSv2 token for enhanced security
    TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
    bucket_name=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/tags/instance/DeploymentBucketName)
fi

if [[ -z "$bucket_name" ]]; then
    echo "Error: Deployment bucket name not found in instance tags or environment variable."
    exit 1
fi

# Update and install dependencies
apt-get update
apt-get install -y curl unzip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Prepare application directory
mkdir -p /var/www/cipher-projects

# Install AWS CLI if not present
if ! command -v aws &> /dev/null; then
    apt-get install -y awscli
fi

# Download and unzip application package
aws s3 cp s3://${DEPLOYMENT_BUCKET}/deploy.zip /var/www/cipher-projects/deploy.zip
unzip -o /var/www/cipher-projects/deploy.zip -d /var/www/cipher-projects
cd /var/www/cipher-projects

# Install dependencies and build
export NODE_ENV=production
npm ci
npm run build

# Install and setup PM2
npm install -g pm2

# Stop any existing PM2 processes
pm2 kill || true

# Start the Next.js application with PM2
pm2 start npm --name "cipher-projects" -- start
pm2 startup ubuntu
pm2 save

# Wait for the application to start
echo "Waiting for Next.js application to start..."
sleep 10

# Verify application is running before configuring nginx
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "Error: Node.js application failed to start on port 3000."
    pm2 logs cipher-projects
    exit 1
fi

# Install and configure nginx only after application is confirmed running
apt-get install -y nginx

# Stop nginx if it's running
systemctl stop nginx || true

# Configure nginx
cat > /etc/nginx/sites-available/default << 'EOL'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOL

# Start nginx
systemctl enable nginx
systemctl start nginx

# Final verification
if ! curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "Error: Application is not accessible through nginx."
    systemctl status nginx
    exit 1
fi

echo "Deployment completed successfully!"