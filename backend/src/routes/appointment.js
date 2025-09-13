import express from 'express'
import { 
  createAppointment, 
  getAppointments,
  getAppointmentById, 
  updateAppointment, 
  updateAppointmentStatus, 
  deleteAppointment,
  getAppointmentStats
} from '../controllers/appointmentController.js'
import { authenticateToken, requireAdmin, requireAnyRole } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Unified appointments endpoint - returns different data based on user role
router.get('/', getAppointments)

// Create appointment (role 0 - admin, role 1 - company owners, role 3 - users)
router.post('/', requireAnyRole([0, 1, 3]), createAppointment)

// Get appointment statistics (role 0 - admin, role 1 - company owners)
router.get('/stats', requireAnyRole([0, 1]), getAppointmentStats)

// Get appointment by ID (accessible by appointment owner, company owner, or admin)
router.get('/:id', getAppointmentById)

// Update appointment (accessible by appointment owner, company owner, or admin)
router.put('/:id', updateAppointment)

// Update appointment status (accessible by company owner or admin)
router.put('/:id/status', updateAppointmentStatus)

// Delete appointment (accessible by appointment owner, company owner, or admin)
router.delete('/:id', deleteAppointment)

export default router

