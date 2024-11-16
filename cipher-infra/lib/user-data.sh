exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

# Fetch bucket name from instance tags
bucket_name=$(curl -s http://169.254.169.254/latest/meta-data/tags/instance/DeploymentBucketName)
echo "Bucket name fetched: $bucket_name"

# Update and install dependencies
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# Prepare application directory
mkdir -p /var/www/cipher-projects

# Download and unzip application package
aws s3 cp s3://${DEPLOYMENT_BUCKET}/deploy.zip /var/www/cipher-projects/deploy.zip
unzip -o /var/www/cipher-projects/deploy.zip -d /var/www/cipher-projects
cd /var/www/cipher-projects
npm ci --production
npm install -g pm2
pm2 start npm --name "cipher-projects" -- start
pm2 startup
pm2 save

cat > /etc/nginx/conf.d/default.conf << 'EOL'
server {
    listen 80;
    server_name _;

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
systemctl restart nginx || {
    echo "Error: Failed to restart Nginx."
    exit 1
}

# Verify application
curl -f http://localhost:3000 || {
    echo "Error: Node.js application is not running on port 3000."
    exit 1
}