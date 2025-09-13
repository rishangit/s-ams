import express from 'express'
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  getUsersByRole, 
  updateUserRole,
  switchRole,
  switchBackToOriginalRole,
  getAvailableRoles
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

// Role switching routes
router.get('/available-roles', authenticateToken, getAvailableRoles)
router.post('/switch-role', authenticateToken, switchRole)
router.post('/switch-back', authenticateToken, switchBackToOriginalRole)

// Admin routes (admin and owners)
router.get('/users', authenticateToken, requireAdmin, getAllUsers)
router.get('/users/role/:role', authenticateToken, requireAdmin, getUsersByRole)
router.put('/users/:id/role', authenticateToken, requireAdminOnly, updateUserRole)

export default router
