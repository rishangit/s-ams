#!/bin/bash

# S-AMS Backend Deployment Script for AWS EC2 Amazon Linux
# This script deploys the backend API to EC2 Amazon Linux server

set -e  # Exit on any error

echo "🚀 Starting S-AMS Backend Deployment on Amazon Linux EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="/home/ec2-user/s-ams-backend"
APP_DIR="/var/www/s-ams/backend"
LOG_DIR="/var/log/s-ams-backend"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "Backend Directory: $BACKEND_DIR"
echo "App Directory: $APP_DIR"
echo "Log Directory: $LOG_DIR"
echo ""

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    error "Please run this script with sudo privileges"
fi

# Step 1: Update system packages
log "📦 Updating system packages..."
sudo yum update -y

# Step 2: Install Node.js (if not already installed)
log "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
    log "✅ Node.js installed successfully"
else
    log "✅ Node.js already installed"
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js version 18+ is required. Current version: $(node -v)"
fi

# Step 3: Install PM2 (if not already installed)
log "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    log "✅ PM2 installed successfully"
else
    log "✅ PM2 already installed"
fi

# Step 4: Install MySQL (if not already installed)
log "📦 Installing MySQL..."
if ! command -v mysql &> /dev/null; then
    sudo yum install -y mysql-server
    sudo systemctl start mysqld
    sudo systemctl enable mysqld
    log "✅ MySQL installed and started"
else
    log "✅ MySQL already installed"
fi

# Step 5: Create application directories
log "📁 Creating application directories..."
sudo mkdir -p $APP_DIR
sudo mkdir -p $APP_DIR/logs
sudo mkdir -p $APP_DIR/uploads/general
sudo mkdir -p $APP_DIR/uploads/profile
sudo mkdir -p $LOG_DIR

# Step 6: Stop existing application if running
log "🛑 Stopping existing application..."
pm2 stop s-ams-backend 2>/dev/null || warning "Application was not running"

# Step 7: Copy application files
log "📁 Copying application files..."
sudo cp -r $BACKEND_DIR/* $APP_DIR/
cd $APP_DIR

# Step 8: Set proper permissions
log "🔐 Setting permissions..."
sudo chown -R ec2-user:ec2-user $APP_DIR
sudo chmod -R 755 $APP_DIR
sudo chmod -R 777 $APP_DIR/logs
sudo chmod -R 777 $APP_DIR/uploads

# Step 9: Install dependencies
log "📦 Installing dependencies..."
npm ci --only=production

# Step 10: Run database migrations
log "🗄️ Running database migrations..."
npm run db:migrate

# Step 11: Start application with PM2
log "🚀 Starting application with PM2..."
pm2 start ecosystem.config.cjs --env production

# Step 12: Save PM2 configuration
log "💾 Saving PM2 configuration..."
pm2 save

# Step 13: Setup PM2 startup script
log "🔄 Setting up PM2 startup script..."
pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Step 14: Health check
log "🏥 Performing health check..."
sleep 10

if curl -f http://localhost:5001/health > /dev/null 2>&1; then
    log "✅ Backend application is running successfully!"
    log "Health check endpoint: http://localhost:5001/health"
else
    error "❌ Backend health check failed. Application may not be running properly."
fi

# Step 15: Show application status
log "📊 Application status:"
pm2 status

# Step 16: Show logs
log "📋 Recent application logs:"
pm2 logs s-ams-backend --lines 20

log "🎉 Backend deployment completed successfully!"
log "Backend API is running on port 5001"
log "Logs are available at: $APP_DIR/logs"
log "PM2 status: pm2 status"
log "PM2 logs: pm2 logs s-ams-backend"
log "PM2 restart: pm2 restart s-ams-backend"
