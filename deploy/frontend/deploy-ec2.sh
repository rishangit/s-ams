#!/bin/bash

# S-AMS Frontend Deployment Script for AWS EC2 Amazon Linux
# This script sets up the frontend on EC2 Amazon Linux server

set -e  # Exit on any error

echo "🚀 Starting S-AMS Frontend Deployment on Amazon Linux EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="/home/ec2-user/s-ams-frontend"
NGINX_CONF_DIR="/etc/nginx/conf.d"
WEB_ROOT="/var/www/s-ams"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "Frontend Directory: $FRONTEND_DIR"
echo "Web Root: $WEB_ROOT"
echo "Nginx Config Directory: $NGINX_CONF_DIR"
echo ""

# Step 1: Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo yum update -y

# Step 2: Install Node.js (if not already installed)
echo -e "${YELLOW}📦 Installing Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
    echo -e "${GREEN}✅ Node.js installed successfully${NC}"
else
    echo -e "${GREEN}✅ Node.js already installed${NC}"
fi

# Step 3: Install Nginx (if not already installed)
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo yum install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo -e "${GREEN}✅ Nginx installed and started${NC}"
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
fi

# Step 4: Create web directory structure
echo -e "${YELLOW}📁 Creating web directory structure...${NC}"
sudo mkdir -p $WEB_ROOT/frontend
sudo chown -R ec2-user:ec2-user $WEB_ROOT

# Step 5: Copy frontend files to web directory
echo -e "${YELLOW}📁 Copying frontend files...${NC}"
if [ -d "$FRONTEND_DIR/dist" ]; then
    sudo cp -r $FRONTEND_DIR/dist/* $WEB_ROOT/frontend/
    sudo chown -R nginx:nginx $WEB_ROOT/frontend
    echo -e "${GREEN}✅ Frontend files copied successfully${NC}"
else
    echo -e "${RED}❌ Frontend dist directory not found at $FRONTEND_DIR/dist${NC}"
    echo "Please ensure you have uploaded the frontend files to $FRONTEND_DIR"
    exit 1
fi

# Step 6: Configure Nginx for Amazon Linux
echo -e "${YELLOW}⚙️  Configuring Nginx for Amazon Linux...${NC}"

# Backup existing nginx.conf
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# Create nginx configuration for Amazon Linux
sudo tee /etc/nginx/conf.d/s-ams.conf > /dev/null << 'EOF'
# Nginx Configuration for S-AMS Application
server {
    listen 80;
    server_name _;
    
    # CORRECT ROOT DIRECTORY
    root /var/www/s-ams/frontend;
    index index.html;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Frontend (React App)
    location / {
        try_files $uri $uri/ @fallback;
    }
    
    # Fallback for React Router
    location @fallback {
        rewrite ^.*$ /index.html last;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://51.20.8.10:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # File uploads - proxy to backend server
    location /uploads/ {
        proxy_pass http://51.20.8.10:5001/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers for uploads
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*" always;
            add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Remove default nginx configuration if it exists
sudo rm -f /etc/nginx/conf.d/default.conf

# Test nginx configuration
echo -e "${YELLOW}🔍 Testing Nginx configuration...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration test failed${NC}"
    echo "Restoring backup configuration..."
    sudo cp /etc/nginx/nginx.conf.backup.* /etc/nginx/nginx.conf
    exit 1
fi

# Step 7: Start/Restart Nginx
echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager

# Step 8: Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo yum install -y firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Step 9: Set up log rotation
echo -e "${YELLOW}📝 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/s-ams > /dev/null << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
EOF

echo ""
echo -e "${GREEN}🎉 Frontend deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Your frontend is now accessible at: http://YOUR_EC2_IP_ADDRESS"
echo "2. Make sure your backend is running on 51.20.8.10:5001"
echo "3. API calls are proxied to: http://51.20.8.10:5001/api/"
echo "4. File uploads are proxied to: http://51.20.8.10:5001/uploads/"
echo "5. Consider setting up SSL/HTTPS for production"
echo ""
echo -e "${YELLOW}🔧 Useful Commands:${NC}"
echo "• Check Nginx status: sudo systemctl status nginx"
echo "• Restart Nginx: sudo systemctl restart nginx"
echo "• View Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "• Test configuration: sudo nginx -t"
echo "• View configuration: sudo cat /etc/nginx/conf.d/s-ams.conf"
echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"

