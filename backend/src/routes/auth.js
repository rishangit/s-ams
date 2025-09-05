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
import { authenticateToken, requireAdmin, requireAdminOnly, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

// Protected routes
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, updateProfile)

// Admin routes (admin only, excludes owners)
router.get('/users', authenticateToken, requireAdminOnly, getAllUsers)
router.get('/users/role/:role', authenticateToken, requireAdminOnly, getUsersByRole)
router.put('/users/:id/role', authenticateToken, requireAdminOnly, updateUserRole)

export default router
