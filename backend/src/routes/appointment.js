import express from 'express'
import { 
  createAppointment, 
  getAppointmentsByUser, 
  getAppointmentsByCompany,
  getAllAppointments,
  getAppointmentById, 
  updateAppointment, 
  updateAppointmentStatus, 
  deleteAppointment,
  getAppointmentStats
} from '../controllers/appointmentController.js'
import { authenticateToken, requireAdmin, requireRole, requireAnyRole } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Create appointment (role 0 - admin, role 1 - company owners, role 3 - users)
router.post('/', requireAnyRole([0, 1, 3]), createAppointment)

// Get appointments by user (role 3 - users)
router.get('/user', requireAnyRole([3]), getAppointmentsByUser)

// Get appointments by company (role 1 - company owners)
router.get('/company', requireAnyRole([1]), getAppointmentsByCompany)

// Get all appointments (role 0 - admin)
router.get('/all', requireAdmin, getAllAppointments)

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

