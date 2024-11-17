exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1
set -e

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

# Basic system setup
apt-get update
apt-get install -y curl unzip nginx awscli

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip ./aws

# Create and configure application directory
mkdir -p /var/www/cipher-projects
chown -R ec2-user:ec2-user /var/www/cipher-projects
sudo -u ec2-user npm install -g pm2

# Deploy application
cd /var/www/cipher-projects
aws s3 cp s3://${DEPLOYMENT_BUCKET}/deploy.zip ./deploy.zip
unzip -o deploy.zip
rm deploy.zip

# Install dependencies and build
npm install
npm run build

# Setup PM2 with proper user
sudo -u ssm-user npm install -g pm2
sudo -u ssm-user pm2 start npm --name "cipher-projects" -- start
sudo -u ssm-user pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ssm-user --hp /home/ssm-user

# Configure nginx with optimized settings
cat > /etc/nginx/sites-available/default << 'EOL'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # Optimize for t3.micro
    worker_connections 1024;
    keepalive_timeout 65;
    client_max_body_size 10M;
    
    # Gzip settings
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static file caching
    location /_next/static/ {
        proxy_cache_bypass $http_upgrade;
        proxy_pass http://localhost:3000;
        expires 365d;
        access_log off;
    }
}
EOL

# Start services
systemctl enable nginx
systemctl restart nginx

# Verify the setup
for i in {1..30}; do
    if curl -s http://localhost > /dev/null; then
        echo "Application successfully deployed"
        exit 0
    fi
    echo "Waiting for application to start... (attempt $i/30)"
    sleep 10
done

echo "Error: Application failed to start within timeout"
pm2 logs cipher-projects --lines 100
exit 1