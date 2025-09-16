import express from 'express'
import {
  createUserHistory,
  getUserHistoryById,
  getUserHistoryByAppointmentId,
  getCompanyUserHistory,
  getUserHistoryByUserId,
  updateUserHistory,
  deleteUserHistory,
  getCompanyStats
} from '../controllers/userHistoryController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateCompanyOwner } from '../middleware/companyValidation.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Company owner routes (role 1) - User History Management
router.post('/', validateCompanyOwner, createUserHistory)
router.get('/company', validateCompanyOwner, getCompanyUserHistory)
router.get('/company/stats', validateCompanyOwner, getCompanyStats)

// General routes - accessible by all authenticated users
router.get('/appointment/:appointmentId', getUserHistoryByAppointmentId)
router.get('/user/:userId', getUserHistoryByUserId)
router.get('/:id', getUserHistoryById)
router.put('/:id', validateCompanyOwner, updateUserHistory)
router.delete('/:id', validateCompanyOwner, deleteUserHistory)

export default router

