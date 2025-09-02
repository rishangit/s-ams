# S-AMS System

A full-stack application with React frontend and Express backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up the database:**
   ```bash
   npm run db:migrate
   ```

3. **Start both frontend and backend in development mode:**
   ```bash
   npm run dev
   ```

## 📋 Available Commands

### Development
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:backend` - Start only backend in development mode
- `npm run dev:frontend` - Start only frontend in development mode

### Production
- `npm run start` - Start both frontend and backend in production mode
- `npm run start:backend` - Start only backend in production mode
- `npm run start:frontend` - Start only frontend in production mode

### Build
- `npm run build` - Build the frontend for production
- `npm run build:frontend` - Build only the frontend

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database with initial data

### Testing
- `npm run test` - Run tests for both frontend and backend
- `npm run test:backend` - Run only backend tests
- `npm run test:frontend` - Run only frontend tests

## 🌐 Access Points

After running `npm run dev`:

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:5001 (Express server)

## 📁 Project Structure

```
S-AMS/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express + SQLite + JWT
├── package.json       # Root package.json with unified commands
└── README.md         # This file
```

## 🔧 Configuration

### Backend Configuration
The backend configuration is in `backend/config.js`. Make sure to set up your environment variables if needed.

### Frontend Configuration
The frontend uses Vite for development. Configuration is in `frontend/vite.config.ts`.

## 🛠️ Development Workflow

1. **Start development servers:**
   ```bash
   npm run dev
   ```

2. **Make changes to your code** - Both servers will automatically reload

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

4. **Stop the servers:** Press `Ctrl+C` in the terminal

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Servers
```bash
npm run start
```

## 📝 Notes

- The frontend runs on port 5173 (Vite default)
- The backend runs on port 5000 (Express default)
- Both servers run concurrently using the `concurrently` package
- Database migrations should be run before starting the application
- The backend includes role-based authentication with integer-based enums for efficiency

## 🐛 Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
1. Check if another process is using the port
2. Kill the process or change the port in the configuration

### Database Issues
If you encounter database issues:
1. Run `npm run db:migrate` to ensure the database is properly set up
2. Check the database file in `backend/database/s-ams.db`

### Installation Issues
If you have dependency issues:
1. Delete `node_modules` folders in root, frontend, and backend
2. Run `npm run install:all` to reinstall all dependencies
