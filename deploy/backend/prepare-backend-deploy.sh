#!/bin/bash

# S-AMS Backend Deployment Preparation Script
# Run this script locally to prepare backend files for deployment

set -e  # Exit on any error

echo "📦 Preparing S-AMS Backend for Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_SOURCE="backend"
DEPLOY_DIR="s-ams-backend-deploy"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "Backend Source: $BACKEND_SOURCE"
echo "Deploy Directory: $DEPLOY_DIR"
echo ""

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Step 1: Clean up old deployment directory
if [ -d "$DEPLOY_DIR" ]; then
    log "🧹 Cleaning up old deployment directory..."
    rm -rf $DEPLOY_DIR
fi

# Step 2: Create deployment directory
log "📁 Creating deployment directory..."
mkdir -p $DEPLOY_DIR

# Step 3: Copy source code
log "📋 Copying source code..."
cp -r $BACKEND_SOURCE/src $DEPLOY_DIR/
cp -r $BACKEND_SOURCE/scripts $DEPLOY_DIR/

# Step 4: Copy package files
log "📦 Copying package files..."
cp $BACKEND_SOURCE/package.json $DEPLOY_DIR/
cp $BACKEND_SOURCE/package-lock.json $DEPLOY_DIR/

# Step 5: Copy deployment files
log "🚀 Copying deployment files..."
cp deploy/backend/ecosystem.config.cjs $DEPLOY_DIR/
cp deploy/backend/production.env $DEPLOY_DIR/
cp deploy/backend/deploy-backend-ec2.sh $DEPLOY_DIR/

# Step 6: Create uploads directory structure
log "📁 Creating uploads directory structure..."
mkdir -p $DEPLOY_DIR/uploads/general
mkdir -p $DEPLOY_DIR/uploads/profile

# Step 7: Create logs directory
log "📁 Creating logs directory..."
mkdir -p $DEPLOY_DIR/logs

# Step 8: Set permissions
log "🔐 Setting permissions..."
chmod +x $DEPLOY_DIR/deploy-backend-ec2.sh

log "✅ Backend deployment package created successfully!"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Upload the '$DEPLOY_DIR' folder to your EC2 instance"
echo "2. SSH to your EC2 instance"
echo "3. Run: cd s-ams-backend && sudo ./deploy-backend-ec2.sh"
echo ""
echo -e "${YELLOW}📁 Deployment package contents:${NC}"
ls -la $DEPLOY_DIR/
echo ""
echo "🎉 Backend deployment package is ready!"
