import express from 'express'
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  getUsersByRole, 
  updateUserRole 
} from '../controllers/authController.js'
import { registerValidation, loginValidation } from '../middleware/validation.js'
import { authenticateToken, requireAdmin, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

// Protected routes
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, updateProfile)

// Admin routes
router.get('/users', authenticateToken, requireAdmin, getAllUsers)
router.get('/users/role/:role', authenticateToken, requireAdmin, getUsersByRole)
router.put('/users/:id/role', authenticateToken, requireAdmin, updateUserRole)

export default router
