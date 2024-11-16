#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

yum update -y
curl -sL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs unzip
amazon-linux-extras install -y nginx1
systemctl start nginx
systemctl enable nginx

mkdir -p /var/www/cipher-projects
aws s3 cp s3://<your-deployment-bucket-name>/deploy.zip /var/www/cipher-projects/deploy.zip
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
systemctl restart nginx