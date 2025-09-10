# S-AMS Backend API

A Node.js Express backend with SQLite database for the S-AMS (Student Attendance Management System) project.

## 🚀 Features

- **Authentication System**: JWT-based authentication with register/login
- **User Management**: Create, read, update user profiles
- **Security**: Password hashing, rate limiting, CORS protection
- **Validation**: Request validation using express-validator
- **Database**: SQLite with proper indexing and relationships
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development

   # Database Configuration
   DB_PATH=./database/s-ams.db

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173,http://localhost:3001,http://localhost:3002,http://localhost:3003

   # File Upload Configuration
   UPLOAD_MAX_SIZE=5242880
   UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp
   UPLOAD_PATH=./uploads

   # Security Configuration
   BCRYPT_SALT_ROUNDS=12

   # Application Configuration
   APP_NAME=S-AMS Backend
   APP_VERSION=1.0.0
   APP_DESCRIPTION=Student Attendance Management System Backend API
   ```

   ### Environment Variable Descriptions

   - **PORT**: Server port number (default: 5001)
   - **NODE_ENV**: Environment mode (development/production)
   - **DB_PATH**: SQLite database file path
   - **JWT_SECRET**: Secret key for JWT token signing (change in production!)
   - **JWT_EXPIRES_IN**: JWT token expiration time
   - **RATE_LIMIT_WINDOW_MS**: Rate limiting window in milliseconds (15 minutes)
   - **RATE_LIMIT_MAX_REQUESTS**: Maximum requests per window
   - **CORS_ORIGIN**: Comma-separated list of allowed origins
   - **UPLOAD_MAX_SIZE**: Maximum file upload size in bytes (5MB)
   - **UPLOAD_ALLOWED_TYPES**: Comma-separated list of allowed file types
   - **UPLOAD_PATH**: Directory for file uploads
   - **BCRYPT_SALT_ROUNDS**: Number of salt rounds for password hashing
   - **APP_NAME**: Application name
   - **APP_VERSION**: Application version
   - **APP_DESCRIPTION**: Application description

3. **Initialize database:**
   ```bash
   npm run db:migrate
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📚 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}
```

### Health Check
```http
GET /health
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## 🔧 Configuration

The application uses a centralized configuration system. Key configuration options:

- **Server**: Port, environment
- **Database**: SQLite file path
- **JWT**: Secret key, expiration time
- **Rate Limiting**: Window size, max requests
- **CORS**: Allowed origins

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries

## 📝 Validation Rules

### Registration
- First Name: 2-50 characters
- Last Name: 2-50 characters
- Email: Valid email format
- Phone Number: Valid phone format
- Password: 8+ characters, uppercase, lowercase, number, special character
- Confirm Password: Must match password

### Login
- Email: Valid email format
- Password: Required

## 🧪 Testing

```bash
npm test
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js
│   ├── database/
│   │   ├── database.js
│   │   └── migrate.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   └── server.js
├── config.js
├── package.json
└── README.md
```

## 🔄 Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests
- `npm run db:migrate`: Run database migrations
- `npm run db:seed`: Seed database with sample data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
