import express from 'express'
import {
  createStaff,
  getStaffByCompany,
  getStaffById,
  updateStaff,
  deleteStaff,
  getAvailableUsers,
  getAllStaff,
  getStaffByCompanyId
} from '../controllers/staffController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateCompanyOwner } from '../middleware/companyValidation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Company owner routes (role 1)
router.post('/', validateCompanyOwner, createStaff)
router.get('/', validateCompanyOwner, getStaffByCompany)
router.get('/available-users', validateCompanyOwner, getAvailableUsers)
router.get('/:id', validateCompanyOwner, getStaffById)
router.put('/:id', validateCompanyOwner, updateStaff)
router.delete('/:id', validateCompanyOwner, deleteStaff)

// Public route for role 3 users to get staff by company ID
router.get('/company/:companyId', getStaffByCompanyId)

// Admin only routes (role 0)
router.get('/admin/all', (req, res, next) => {
  if (req.user.role !== 0) {
    return res.status(403).json({ error: 'Access denied. Admin role required.' })
  }
  next()
}, getAllStaff)

export default router

