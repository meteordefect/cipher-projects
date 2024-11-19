# Enable error handling and enhanced logging
set -ex
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "=== Starting deployment at $(date) ==="
echo "Deployment bucket: ${DEPLOYMENT_BUCKET}"

# Enhanced S3 checking function
check_s3_access() {
    echo "=== Testing S3 Access ==="
    echo "1. Testing AWS CLI..."
    aws --version
    
    echo "2. Testing bucket existence..."
    if aws s3api head-bucket --bucket "${DEPLOYMENT_BUCKET}" 2>/dev/null; then
        echo "Bucket exists and is accessible"
    else
        echo "Failed to access bucket!"
        return 1
    fi
    
    echo "3. Testing bucket listing..."
    aws s3 ls "s3://${DEPLOYMENT_BUCKET}"
    
    echo "S3 Access Tests Complete"
    return 0
}

# Run S3 access check
if ! check_s3_access; then
    echo "Failed S3 access checks!"
    exit 1
fi

# Update system and install dependencies
echo "Updating system and installing dependencies..."
yum update -y
amazon-linux-extras enable nginx1
yum clean metadata
yum install -y nginx unzip

while pgrep -f yum > /dev/null; do
    echo "Waiting for other yum processes to finish..."
    sleep 5
done

mkdir -p /etc/nginx/conf.d

# Configure nginx
echo "Configuring nginx..."
cat > /etc/nginx/conf.d/nextjs.conf << 'EOL'
server {
    listen 80 default_server;
    server_name _;
    root /var/www/nextjs;

    location /_next/static {
        alias /var/www/nextjs/.next/static;
        expires 365d;
        access_log off;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

# Create systemd service
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

[Install]
WantedBy=multi-user.target
EOL

# Setup application directory
mkdir -p /var/www/nextjs
cd /var/www/nextjs

# Download and unzip deployment package
echo "Downloading deployment package..."
aws s3 cp "s3://${DEPLOYMENT_BUCKET}/deploy.zip" . || {
    echo "Failed to download deployment package!"
    exit 1
}

unzip -o deploy.zip || {
    echo "Failed to unzip deployment package!"
    exit 1
}

# Fix permissions
chown -R ec2-user:ec2-user /var/www/nextjs

# Install dependencies and build
echo "Installing dependencies..."
sudo -u ec2-user bash -c 'cd /var/www/nextjs && npm ci'

# Start services
systemctl daemon-reload
systemctl enable nginx
systemctl enable nextjs
systemctl start nginx
systemctl start nextjs

echo "Deployment completed at $(date)"