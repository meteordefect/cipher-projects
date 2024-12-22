#!/bin/bash


#This is for manually fixing the server manual running

# Set error handling
set -e

echo "Starting deployment..."

# Navigate to application directory (adjust path as needed)
cd /var/www/nextjs

# Download latest deployment
echo "Downloading latest deployment..."
aws s3 cp s3://cipher-deployment-ap-southeast-2-285572126612/deploy.zip .

# Backup environment files
echo "Backing up environment files..."
if [ -f .env.production ]; then
    cp .env.production .env.production.backup
fi

# Clean old files (preserving env files and the new deploy.zip)
echo "Cleaning old files..."
find . -mindepth 1 -maxdepth 1 ! -name 'deploy.zip' ! -name '.env*' ! -name '.' ! -name '..' -exec rm -rf {} +

# Unzip new deployment
echo "Unzipping new deployment..."
unzip -o deploy.zip

# Restore environment files
echo "Restoring environment files..."
if [ -f .env.production.backup ]; then
    mv .env.production.backup .env.production
fi

# Clean up
echo "Cleaning up..."
rm deploy.zip

# Install dependencies
echo "Installing dependencies..."
npm ci

systemctl restart nextjs.service

echo "Deployment complete!"