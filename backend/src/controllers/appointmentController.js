import { Appointment, User, Company, Service, Staff } from '../models/index.js'
import { APPOINTMENT_STATUS, isValidStatusName } from '../constants/appointmentStatus.js'

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { companyId, serviceId, staffId, staffPreferences, appointmentDate, appointmentTime, notes, userId: requestUserId } = req.body
    const currentUserId = req.user.id
    const userRole = req.user.role
    
    // For company owners (role: 1), allow them to specify userId, otherwise use current user's ID
    const appointmentUserId = (userRole === 1 && requestUserId) ? requestUserId : currentUserId

    // Validate required fields
    if (!companyId || !serviceId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Company ID, Service ID, appointment date and time are required'
      })
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(appointmentDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      })
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(appointmentTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Use HH:MM'
      })
    }

    // Check if appointment date is not in the past
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`)
    const now = new Date()
    if (appointmentDateTime <= now) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date and time must be in the future'
      })
    }

    // Verify company exists and is active
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    if (company.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointment with inactive company'
      })
    }

    // Verify service exists and is active
    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    if (service.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot book inactive service'
      })
    }

    // Verify service belongs to the company
    if (service.companyId !== parseInt(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Service does not belong to the specified company'
      })
    }

    // Check if time slot is available
    const isAvailable = await Appointment.isTimeSlotAvailable(
      companyId, serviceId, appointmentDate, appointmentTime
    )

    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is not available'
      })
    }

    // Create appointment
    const appointmentData = {
      userId: appointmentUserId,
      companyId,
      serviceId,
      staffId: staffId || null,
      staffPreferences: staffPreferences || null,
      appointmentDate,
      appointmentTime,
      notes: notes || null
    }
    
    const appointment = await Appointment.create(appointmentData)

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    })
  }
}




// Unified appointments endpoint - returns different data based on user role
export const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    
    let appointments = []
    
    if (userRole === 0) {
      // Admin - get all appointments
      appointments = await Appointment.findAll()
    } else if (userRole === 1) {
      // Company owner - get company appointments
      const company = await Company.findByUserId(userId)
      
      if (!company) {
        return res.json({
          success: true,
          data: [],
          message: 'No company found for this user'
        })
      }
      
      appointments = await Appointment.findByCompanyId(company.id)
    } else if (userRole === 2) {
      // Staff member - get staff appointments
      const staffRecords = await Staff.findByUserId(userId)
      
      if (!staffRecords || staffRecords.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: 'No staff records found for this user'
        })
      }
      
      // Get all staff IDs for this user (in case they work for multiple companies)
      const staffIds = staffRecords.map(staff => staff.id)
      
      // Get appointments for all staff IDs
      for (const staffId of staffIds) {
        const staffAppointments = await Appointment.findByStaffId(staffId)
        appointments = appointments.concat(staffAppointments)
      }
    } else if (userRole === 3) {
      // Regular user - get user appointments
      appointments = await Appointment.findByUserId(userId)
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role'
      })
    }

    res.json({
      success: true,
      data: appointments
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    })
  }
}

// Get all appointments (for admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll()

    res.json({
      success: true,
      data: appointments
    })
  } catch (error) {
    console.error('Error fetching all appointments:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    })
  }
}

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      })
    }

    // Check if user has access to this appointment
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Allow access if user is admin, appointment owner, company owner, or assigned staff
    const company = await Company.findByUserId(userId)
    let hasAccess = user.role === 0 || // Admin
                   appointment.userId === userId || // Appointment owner
                   (company && appointment.companyId === company.id) // Company owner
    
    // Check if user is assigned staff member
    if (!hasAccess && user.role === 2) {
      const staffRecords = await Staff.findByUserId(userId)
      if (staffRecords && staffRecords.length > 0) {
        const staffIds = staffRecords.map(staff => staff.id)
        hasAccess = staffIds.includes(appointment.staffId)
      }
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    res.json({
      success: true,
      data: appointment
    })
  } catch (error) {
    console.error('Error fetching appointment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    })
  }
}

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const { appointmentDate, appointmentTime, notes, status, staffId, staffPreferences } = req.body
    const userId = req.user.id

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      })
    }

    // Check if user has permission to update
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Allow update if user is admin, appointment owner, company owner, or assigned staff
    const company = await Company.findByUserId(userId)
    let hasPermission = user.role === 0 || // Admin
                       appointment.userId === userId || // Appointment owner
                       (company && appointment.companyId === company.id) // Company owner
    
    // Check if user is assigned staff member
    if (!hasPermission && user.role === 2) {
      const staffRecords = await Staff.findByUserId(userId)
      if (staffRecords && staffRecords.length > 0) {
        const staffIds = staffRecords.map(staff => staff.id)
        hasPermission = staffIds.includes(appointment.staffId)
      }
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      })
    }

    // Validate date and time if provided
    if (appointmentDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(appointmentDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        })
      }
    }

    if (appointmentTime) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(appointmentTime)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format. Use HH:MM'
        })
      }
    }

    // Check if new time slot is available (if date/time is being changed)
    if (appointmentDate || appointmentTime) {
      const newDate = appointmentDate || appointment.appointmentDate
      const newTime = appointmentTime || appointment.appointmentTime

      const isAvailable = await Appointment.isTimeSlotAvailable(
        appointment.companyId,
        appointment.serviceId,
        newDate,
        newTime,
        appointment.id
      )

      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: 'Time slot is not available'
        })
      }
    }

    // Update appointment
    const updatedAppointment = await Appointment.update(appointment.id, {
      appointmentDate,
      appointmentTime,
      status: status || null, // Use provided status or null
      notes,
      staffId,
      staffPreferences
    })

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    })
  }
}

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user.id

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      })
    }

    // Validate status
    if (!isValidStatusName(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, completed, cancelled'
      })
    }

    // Check if user has permission to update status
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Allow status update if user is admin or company owner
    const company = await Company.findByUserId(userId)
    const hasPermission = user.role === 0 || // Admin
                         (company && appointment.companyId === company.id) // Company owner

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied. Only company owners can update appointment status'
      })
    }

    // Update status
    const updatedAppointment = await Appointment.updateStatus(appointment.id, status)

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: updatedAppointment
    })
  } catch (error) {
    console.error('Error updating appointment status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message
    })
  }
}

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      })
    }

    // Check if user has permission to delete
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Allow delete if user is admin, appointment owner, company owner, or assigned staff
    const company = await Company.findByUserId(userId)
    let hasPermission = user.role === 0 || // Admin
                       appointment.userId === userId || // Appointment owner
                       (company && appointment.companyId === company.id) // Company owner
    
    // Check if user is assigned staff member
    if (!hasPermission && user.role === 2) {
      const staffRecords = await Staff.findByUserId(userId)
      if (staffRecords && staffRecords.length > 0) {
        const staffIds = staffRecords.map(staff => staff.id)
        hasPermission = staffIds.includes(appointment.staffId)
      }
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      })
    }

    // Delete appointment
    await Appointment.delete(appointment.id)

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    })
  }
}

// Get appointment statistics
export const getAppointmentStats = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    let stats
    if (user.role === 0) {
      // Admin - get all stats
      stats = await Appointment.getStats()
    } else if (user.role === 1) {
      // Company owner - get company stats
      const company = await Company.findByUserId(userId)
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found for this user'
        })
      }
      stats = await Appointment.getStats(company.id)
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching appointment stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment statistics',
      error: error.message
    })
  }
}


