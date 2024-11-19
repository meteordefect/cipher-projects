set -ex
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "=== Starting deployment at $(date) ==="

if [ -z "${DEPLOYMENT_BUCKET}" ]; then
    echo "ERROR: DEPLOYMENT_BUCKET environment variable is not set!"
    echo "Current environment variables:"
    printenv
    exit 1
fi

echo "Deployment bucket: ${DEPLOYMENT_BUCKET}"

# Enhanced S3 checking function
check_s3_access() {
    echo "=== Testing S3 Access ==="
    echo "1. Testing AWS CLI..."
    aws --version
    
    echo "2. Testing bucket existence..."
    if ! aws s3api head-bucket --bucket "${DEPLOYMENT_BUCKET}" 2>/dev/null; then
        echo "Failed to access bucket!"
        return 1
    fi
    echo "Bucket exists and is accessible"
    
    echo "3. Testing bucket listing..."
    aws s3 ls "s3://${DEPLOYMENT_BUCKET}"
    
    echo "S3 Access Tests Complete"
    return 0
}

# Install AWS CLI if not present
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    apt-get update
    apt-get install -y unzip
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    ./aws/install
fi

# Run S3 access check
if ! check_s3_access; then
    echo "Failed S3 access checks!"
    exit 1
fi

# Wait for apt locks
while fuser /var/lib/apt/lists/lock >/dev/null 2>&1 || fuser /var/lib/dpkg/lock >/dev/null 2>&1 || fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
    echo "Waiting for apt locks to be released..."
    sleep 5
done

# Update system and install dependencies
echo "Updating system and installing dependencies..."
apt-get update
apt-get upgrade -y

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install nginx
echo "Installing nginx..."
apt-get install -y nginx

# Configure nginx

# Configure nginx
echo "Configuring nginx..."

# Stop nginx first
systemctl stop nginx

# Remove ALL default configurations
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-available/default  # Found this one!
rm -f /etc/nginx/conf.d/default.conf
rm -f /etc/nginx/conf.d/*.conf

# Ensure directory structure
mkdir -p /etc/nginx/conf.d
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Create clean nginx.conf
cat > /etc/nginx/nginx.conf << 'EOL'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Only include conf.d - we'll put everything there
    include /etc/nginx/conf.d/*.conf;
}
EOL


cat > /etc/nginx/conf.d/nextjs.conf << 'EOL'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Access and error logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Root directory for Next.js app
    root /var/www/nextjs;

    # Static files
    location /_next/static/ {
        # Adjust this path to match your Next.js static files location
        alias /var/www/nextjs/.next/static/;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Important for WebSockets
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOL

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Create systemd service
cat > /etc/systemd/system/nextjs.service << 'EOL'
[Unit]
Description=Next.js Application
After=network.target

[Service]
Type=simple
User=ubuntu
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
chown -R ubuntu:ubuntu /var/www/nextjs

# Install dependencies
echo "Installing dependencies..."
sudo -u ubuntu bash -c 'cd /var/www/nextjs && npm ci'

# Start services
systemctl daemon-reload
systemctl enable nginx
systemctl enable nextjs
systemctl start nginx
systemctl start nextjs

# Output important information
echo "=== Installation Complete ==="
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Nginx version: $(nginx -v 2>&1)"
echo "Deployment completed at $(date)"