# Enable error handling and logging
set -ex
exec > >(tee /var/log/user-data.log) 2>&1

echo "Starting deployment at $(date)"

# Update system and install dependencies
echo "Updating system and installing dependencies..."
dnf update -y
dnf install -y nodejs nginx unzip

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Remove default nginx config and configure for Next.js
echo "Configuring nginx..."
rm -f /etc/nginx/conf.d/default.conf
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

    location /static {
        alias /var/www/nextjs/public;
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
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }

    # Detailed error log
    error_log /var/log/nginx/nextjs_error.log debug;
    access_log /var/log/nginx/nextjs_access.log;
}
EOL

# Test and restart nginx
echo "Testing and restarting nginx..."
nginx -t
systemctl restart nginx
systemctl enable nginx

# Setup application directory
echo "Setting up application directory..."
mkdir -p /var/www/nextjs
cd /var/www/nextjs

# Get deployment package from S3
echo "Downloading deployment package..."
aws s3 cp s3://${DEPLOYMENT_BUCKET}/deploy.zip .
unzip -o deploy.zip

# Install dependencies and build
echo "Installing dependencies..."
npm ci
echo "Building application..."
npm run build

# Start application with PM2
echo "Starting application with PM2..."
# Stop any existing processes
pm2 stop nextjs 2>/dev/null || true
pm2 delete nextjs 2>/dev/null || true

# Start new process
pm2 start npm --name "nextjs" -- start
pm2 startup
pm2 save

# Verify application is running
echo "Verifying application status..."
sleep 10

if pm2 list | grep -q "nextjs.*online"; then
    echo "Application started successfully!"
else
    echo "Failed to start application. Checking logs..."
    pm2 logs nextjs --lines 50
    exit 1
fi

# Final verification
echo "Testing application endpoint..."
curl -f http://localhost:3000 || {
    echo "Application not responding on port 3000"
    pm2 logs nextjs --lines 50
    exit 1
}

echo "Deployment completed successfully at $(date)"