import express from 'express'
import {
  getCompanyUsers,
  getUserAppointments
} from '../controllers/companyUsersController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateCompanyOwner } from '../middleware/companyValidation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Company owner routes (role 1) - Company Users Management
router.get('/:userId/appointments', validateCompanyOwner, getUserAppointments)
router.get('/', validateCompanyOwner, getCompanyUsers)

export default router
