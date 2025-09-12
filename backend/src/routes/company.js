import express from 'express'
import { 
  createCompany, 
  getCompanyByUser, 
  updateCompany, 
  getCompaniesForBooking,
  getAllCompanies, 
  getCompanyById, 
  updateCompanyStatus, 
  deleteCompany,
  getCompaniesByUserAppointments
} from '../controllers/companyController.js'
import { authenticateToken } from '../middleware/auth.js'
import { requireAdmin, requireAdminOnly } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Company routes for all authenticated users
router.post('/', createCompany) // Create company
router.get('/user/:userId', getCompanyByUser) // Get company by user ID
router.put('/:id', updateCompany) // Update company
router.get('/booking', getCompaniesForBooking) // Get companies for appointment booking (authenticated users)
router.get('/user-appointments', getCompaniesByUserAppointments) // Get companies user has appointments with (role 3 only)

// Admin-only routes
router.get('/', requireAdminOnly, getAllCompanies) // Get all companies (admin only, excludes owners)
router.get('/:id', getCompanyById) // Get company by ID (users can view their own company)
router.put('/:id/status', requireAdmin, updateCompanyStatus) // Update company status
router.delete('/:id', requireAdmin, deleteCompany) // Delete company

export default router
