import jwt from 'jsonwebtoken'
import { config } from '../../config.js'
import { User } from '../models/index.js'
import { isAdminRole } from '../constants/roles.js'

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    
    // Get user from database
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      })
    }

    // Handle role switching
    if (decoded.switchedRole !== undefined) {
      // User is temporarily using a different role
      user.originalRole = user.role
      user.role = decoded.switchedRole
      user.isRoleSwitched = true
    } else {
      user.isRoleSwitched = false
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      })
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    })
  }
}

export const generateToken = (userId, switchedRole = null) => {
  const payload = { userId }
  if (switchedRole !== null) {
    payload.switchedRole = switchedRole
  }
  return jwt.sign(payload, config.jwt.secret, { 
    expiresIn: config.jwt.expiresIn 
  })
}

// Role-based authorization middleware
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }

    if (!User.hasRole(req.user, requiredRole)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. ${requiredRole} role required.` 
      })
    }

    next()
  }
}

// Middleware to require any of the specified roles
export const requireAnyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const hasRole = User.hasAnyRole(req.user, roles)

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. One of the following roles required: ${roles.join(', ')}`
      })
    }

    next()
  }
}

// Middleware to require admin privileges (admin or owner)
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    })
  }

  // Check if user has admin role (0) or owner role (1)
  if (req.user.role !== 0 && req.user.role !== 1) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    })
  }

  next()
}

// Middleware to require admin role only (excludes owners)
export const requireAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    })
  }

  // Check if user has admin role (0) only
  if (req.user.role !== 0) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin role required.' 
    })
  }

  next()
}