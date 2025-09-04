import express from 'express'
import { 
  createCompany, 
  getCompanyByUser, 
  updateCompany, 
  getAllCompanies, 
  getCompanyById, 
  updateCompanyStatus, 
  deleteCompany 
} from '../controllers/companyController.js'
import { authenticateToken } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Company routes for all authenticated users
router.post('/', createCompany) // Create company
router.get('/user/:userId', getCompanyByUser) // Get company by user ID
router.put('/:id', updateCompany) // Update company

// Admin-only routes
router.get('/', requireAdmin, getAllCompanies) // Get all companies
router.get('/:id', getCompanyById) // Get company by ID (users can view their own company)
router.put('/:id/status', requireAdmin, updateCompanyStatus) // Update company status
router.delete('/:id', requireAdmin, deleteCompany) // Delete company

export default router
