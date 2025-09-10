# Complete S-AMS Deployment Guide

## 🚀 Full Stack Deployment to AWS EC2

This guide covers deploying both frontend and backend to AWS EC2 Amazon Linux.

## Prerequisites

- ✅ AWS EC2 Linux instance running
- ✅ WinSCP installed on your Windows machine
- ✅ SSH access to your EC2 instance
- ✅ Your EC2 IP address (e.g., 51.20.8.10)
- ✅ MySQL database set up (local or cloud)

## Step 1: Prepare Your Local Files

### 1.1 Build the Frontend
```bash
cd frontend
npm run build
```

### 1.2 Create Deployment Packages

**Frontend Package:**
```bash
mkdir s-ams-frontend-deploy
cp -r frontend/dist s-ams-frontend-deploy/
cp deploy/frontend/deploy-ec2.sh s-ams-frontend-deploy/
cp deploy/frontend/production.env s-ams-frontend-deploy/
```

**Backend Package:**
```bash
mkdir s-ams-backend-deploy
cp -r backend/src s-ams-backend-deploy/
cp -r backend/scripts s-ams-backend-deploy/
cp backend/package.json s-ams-backend-deploy/
cp backend/package-lock.json s-ams-backend-deploy/
cp deploy/backend/ecosystem.config.cjs s-ams-backend-deploy/
cp deploy/backend/production.env s-ams-backend-deploy/
cp deploy/backend/deploy-backend-ec2.sh s-ams-backend-deploy/
```

## Step 2: Upload Files Using WinSCP

### 2.1 Connect to Your EC2 Instance
1. Open WinSCP
2. Create a new session with these settings:
   - **File protocol**: SFTP
   - **Host name**: Your EC2 IP address (e.g., 51.20.8.10)
   - **Port number**: 22
   - **User name**: ec2-user
   - **Password**: (Leave empty if using key pair)
   - **Private key file**: Select your .pem key file

### 2.2 Upload Files
1. Navigate to `/home/ec2-user/` on the remote server
2. Upload your deployment packages:
   - Upload `s-ams-frontend-deploy/` to `/home/ec2-user/s-ams-frontend/`
   - Upload `s-ams-backend-deploy/` to `/home/ec2-user/s-ams-backend/`

## Step 3: Deploy Backend First

### 3.1 SSH to Your EC2 Instance
```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
```

### 3.2 Deploy Backend
```bash
cd /home/ec2-user/s-ams-backend
chmod +x deploy-backend-ec2.sh
sudo ./deploy-backend-ec2.sh
```

### 3.3 Verify Backend is Running
```bash
pm2 status
curl http://localhost:5001/health
```

## Step 4: Deploy Frontend

### 4.1 Deploy Frontend
```bash
cd /home/ec2-user/s-ams-frontend
chmod +x deploy-ec2.sh
sudo ./deploy-ec2.sh
```

### 4.2 Verify Frontend is Running
```bash
sudo systemctl status nginx
curl http://localhost
```

## Step 5: Access Your Application

Open browser: `http://YOUR_EC2_IP`

## 🔧 Management Commands

### Backend Management
```bash
# Check backend status
pm2 status

# View backend logs
pm2 logs s-ams-backend

# Restart backend
pm2 restart s-ams-backend

# Stop backend
pm2 stop s-ams-backend

# Start backend
pm2 start s-ams-backend
```

### Frontend Management
```bash
# Check nginx status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Test nginx config
sudo nginx -t
```

## 🆘 Troubleshooting

### Backend Issues
1. **Backend not starting:**
   ```bash
   pm2 logs s-ams-backend
   cd /var/www/s-ams/backend
   npm start
   ```

2. **Database connection issues:**
   - Check `production.env` file
   - Verify MySQL is running: `sudo systemctl status mysqld`
   - Test database connection

3. **Port 5001 not accessible:**
   - Check if backend is running: `pm2 status`
   - Check firewall: `sudo firewall-cmd --list-all`

### Frontend Issues
1. **Frontend not loading:**
   ```bash
   sudo systemctl status nginx
   sudo tail -f /var/log/nginx/error.log
   ```

2. **API calls failing:**
   - Check if backend is running on port 5001
   - Verify nginx proxy configuration
   - Check browser network tab for errors

3. **Images not loading:**
   - Check nginx CORS configuration
   - Verify uploads directory permissions
   - Check backend file upload endpoint

## 📁 File Structure After Deployment

```
/var/www/s-ams/
├── frontend/           # Frontend files served by nginx
│   ├── index.html
│   └── assets/
└── backend/            # Backend API
    ├── src/
    ├── logs/
    ├── uploads/
    ├── package.json
    └── ecosystem.config.cjs

/etc/nginx/conf.d/
└── s-ams.conf          # Nginx configuration

/home/ec2-user/
├── s-ams-frontend/     # Frontend deployment files
└── s-ams-backend/      # Backend deployment files
```

## 🔄 Updates

### Update Frontend
1. Build new frontend: `npm run build`
2. Upload new `dist/` folder
3. Copy to web directory: `sudo cp -r dist/* /var/www/s-ams/frontend/`
4. Restart nginx: `sudo systemctl restart nginx`

### Update Backend
1. Upload new backend files
2. Copy to app directory: `sudo cp -r * /var/www/s-ams/backend/`
3. Install dependencies: `cd /var/www/s-ams/backend && npm ci --only=production`
4. Restart backend: `pm2 restart s-ams-backend`

---

**🎉 Your S-AMS application is now fully deployed!**
