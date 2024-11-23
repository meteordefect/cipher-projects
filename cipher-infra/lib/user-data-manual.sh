#!/bin/bash
set -ex

# Define variables
BUCKET_NAME="cipher-deployment-ap-southeast-2-285572126612"
DEPLOY_FILE="deploy.zip"
DEPLOY_DIR="/var/www/nextjs"

# Logging
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1
echo "=== Starting deployment at $(date) ==="

# Ensure directory exists and is clean
sudo rm -rf ${DEPLOY_DIR}/*
mkdir -p ${DEPLOY_DIR}
cd ${DEPLOY_DIR}

# Download the deployment package
echo "Downloading deployment package from S3 bucket: ${BUCKET_NAME}"
aws s3 cp "s3://${BUCKET_NAME}/${DEPLOY_FILE}" .
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to download deployment package!"
    exit 1
fi

# Extract the deployment package
echo "Extracting deployment package..."
unzip -o ${DEPLOY_FILE}
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to extract deployment package!"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
sudo npm ci
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

# Clear caches
echo "Clearing caches..."
sudo npm cache clean --force
sudo rm -rf /var/cache/nginx/*

# Restart services
echo "Restarting services..."
sudo systemctl restart nextjs
sudo systemctl restart nginx

# Verify deployment
echo "Verifying deployment..."
curl -I http://localhost:3000
if [ $? -ne 0 ]; then
    echo "ERROR: Application is not running properly!"
    exit 1
fi

echo "=== Deployment completed successfully at $(date) ==="
