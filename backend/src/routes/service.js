import express from 'express'
import { 
  createService, 
  getServicesByCompany, 
  getServicesByCompanyId,
  getServiceById, 
  updateService, 
  updateServiceStatus, 
  deleteService 
} from '../controllers/serviceController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Service routes for company owners (role 1)
router.post('/', createService) // Create service
router.get('/', getServicesByCompany) // Get services by company
router.get('/company/:companyId', getServicesByCompanyId) // Get services by company ID (for appointment booking)
router.get('/:id', getServiceById) // Get service by ID
router.put('/:id', updateService) // Update service
router.put('/:id/status', updateServiceStatus) // Update service status
router.delete('/:id', deleteService) // Delete service

export default router
