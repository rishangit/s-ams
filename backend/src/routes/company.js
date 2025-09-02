import express from 'express'
import CompanyController from '../controllers/companyController.js'
import { authenticateToken } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Company routes for all authenticated users
router.post('/', CompanyController.createCompany) // Create company
router.get('/user/:userId', CompanyController.getCompanyByUser) // Get company by user ID
router.put('/:id', CompanyController.updateCompany) // Update company

// Admin-only routes
router.get('/', requireAdmin, CompanyController.getAllCompanies) // Get all companies
router.get('/:id', requireAdmin, CompanyController.getCompanyById) // Get company by ID
router.put('/:id/status', requireAdmin, CompanyController.updateCompanyStatus) // Update company status
router.delete('/:id', requireAdmin, CompanyController.deleteCompany) // Delete company

export default router
