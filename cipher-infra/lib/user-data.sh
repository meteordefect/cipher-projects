# Update system and install dependencies
dnf update -y
dnf install -y nodejs nginx unzip

# Configure nginx
cat > /etc/nginx/conf.d/nextjs.conf << 'EOL'
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

# Start and enable nginx
systemctl start nginx
systemctl enable nginx

# Create app directory
mkdir -p /var/www/nextjs
cd /var/www/nextjs

# Get deployment package from S3
aws s3 cp s3://${DEPLOYMENT_BUCKET}/deploy.zip .
unzip deploy.zip

# Install dependencies and build
npm ci
npm run build

# Start the application
nohup npm run start > app.log 2>&1 &