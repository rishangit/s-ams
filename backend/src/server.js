import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { config } from '../config.js'
import { initializeDatabase } from './database/index.js'
import authRoutes from './routes/auth.js'
import fileUploadRoutes from './routes/fileUpload.js'
import companyRoutes from './routes/company.js'

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
})
app.use(limiter)

// Logging middleware
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'))
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'S-AMS Backend API is running',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv
  })
})

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  // Add CORS headers for static files
  const origin = req.headers.origin
  if (config.cors.origin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  next()
}, express.static(path.join(process.cwd(), 'uploads')))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/files', fileUploadRoutes)
app.use('/api/company', companyRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(config.server.nodeEnv === 'development' && { stack: error.stack })
  })
})

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase()
    
    // Start listening
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port}`)
      console.log(`📊 Environment: ${config.server.nodeEnv}`)
      console.log(`🔗 Health check: http://localhost:${config.server.port}/health`)
      console.log(`📚 API Documentation: http://localhost:${config.server.port}/api`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})
