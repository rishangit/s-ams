import { UserHistory, Appointment, Company, Product } from '../models/index.js'

// Create user history record
export const createUserHistory = async (req, res) => {
  try {
    const currentUserId = req.user.id
    const {
      appointmentId,
      productsUsed = [],
      totalCost = 0.00,
      notes = ''
    } = req.body

    // Get the appointment to extract required data
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      })
    }

    // Check if user has permission to create history for this appointment
    const company = await Company.findByUserId(currentUserId)
    if (!company || company.id !== appointment.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create history for this appointment'
      })
    }

    // Check if history already exists for this appointment
    const existingHistory = await UserHistory.existsByAppointmentId(appointmentId)
    if (existingHistory) {
      return res.status(400).json({
        success: false,
        message: 'History already exists for this appointment'
      })
    }

    // Validate products if provided
    if (productsUsed && productsUsed.length > 0) {
      for (const product of productsUsed) {
        const productExists = await Product.findById(product.productId)
        if (!productExists || productExists.companyId !== company.id) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${product.productId} not found or does not belong to your company`
          })
        }
      }
    }

    // Create user history
    const historyData = {
      appointmentId,
      userId: appointment.userId,
      companyId: appointment.companyId,
      staffId: appointment.staffId,
      serviceId: appointment.serviceId,
      productsUsed,
      totalCost,
      notes
    }

    const userHistory = await UserHistory.create(historyData)

    // Update appointment status to completed
    await Appointment.updateStatusAndStaff(appointmentId, 'completed', appointment.staffId)

    res.status(201).json({
      success: true,
      message: 'User history created successfully',
      data: userHistory
    })
  } catch (error) {
    console.error('Error creating user history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create user history',
      error: error.message
    })
  }
}

// Get user history by ID
export const getUserHistoryById = async (req, res) => {
  try {
    const { id } = req.params
    const currentUserId = req.user.id

    const userHistory = await UserHistory.findById(id)
    if (!userHistory) {
      return res.status(404).json({
        success: false,
        message: 'User history not found'
      })
    }

    // Check if user has permission to view this history
    const company = await Company.findByUserId(currentUserId)
    if (!company || company.id !== userHistory.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this history'
      })
    }

    res.json({
      success: true,
      data: userHistory
    })
  } catch (error) {
    console.error('Error getting user history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user history',
      error: error.message
    })
  }
}

// Get user history by appointment ID
export const getUserHistoryByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params
    const currentUserId = req.user.id

    const userHistory = await UserHistory.findByAppointmentId(appointmentId)
    if (!userHistory) {
      return res.status(404).json({
        success: false,
        message: 'User history not found for this appointment'
      })
    }

    // Check if user has permission to view this history
    const company = await Company.findByUserId(currentUserId)
    if (!company || company.id !== userHistory.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this history'
      })
    }

    res.json({
      success: true,
      data: userHistory
    })
  } catch (error) {
    console.error('Error getting user history by appointment ID:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user history',
      error: error.message
    })
  }
}

// Get user history for a company
export const getCompanyUserHistory = async (req, res) => {
  try {
    const currentUserId = req.user.id
    const { limit = 50, offset = 0 } = req.query

    // Get user's company
    const company = await Company.findByUserId(currentUserId)
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a registered company'
      })
    }

    const userHistory = await UserHistory.findByCompanyId(company.id, parseInt(limit), parseInt(offset))

    res.json({
      success: true,
      data: userHistory
    })
  } catch (error) {
    console.error('Error getting company user history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user history',
      error: error.message
    })
  }
}

// Get user history for a specific user
export const getUserHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user.id
    const { limit = 50, offset = 0 } = req.query

    // Check if user is requesting their own history or if they're a company owner
    const company = await Company.findByUserId(currentUserId)
    const isOwnHistory = parseInt(userId) === currentUserId
    const isCompanyOwner = company && company.userId === currentUserId

    if (!isOwnHistory && !isCompanyOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this user\'s history'
      })
    }

    const userHistory = await UserHistory.findByUserId(parseInt(userId), parseInt(limit), parseInt(offset))

    res.json({
      success: true,
      data: userHistory
    })
  } catch (error) {
    console.error('Error getting user history by user ID:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user history',
      error: error.message
    })
  }
}

// Update user history
export const updateUserHistory = async (req, res) => {
  try {
    const { id } = req.params
    const currentUserId = req.user.id
    const { productsUsed, totalCost, notes } = req.body

    const userHistory = await UserHistory.findById(id)
    if (!userHistory) {
      return res.status(404).json({
        success: false,
        message: 'User history not found'
      })
    }

    // Check if user has permission to update this history
    const company = await Company.findByUserId(currentUserId)
    if (!company || company.id !== userHistory.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this history'
      })
    }

    // Validate products if provided
    if (productsUsed && productsUsed.length > 0) {
      for (const product of productsUsed) {
        const productExists = await Product.findById(product.productId)
        if (!productExists || productExists.companyId !== company.id) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${product.productId} not found or does not belong to your company`
          })
        }
      }
    }

    const updatedHistory = await UserHistory.update(id, {
      productsUsed,
      totalCost,
      notes
    })

    res.json({
      success: true,
      message: 'User history updated successfully',
      data: updatedHistory
    })
  } catch (error) {
    console.error('Error updating user history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user history',
      error: error.message
    })
  }
}

// Delete user history
export const deleteUserHistory = async (req, res) => {
  try {
    const { id } = req.params
    const currentUserId = req.user.id

    const userHistory = await UserHistory.findById(id)
    if (!userHistory) {
      return res.status(404).json({
        success: false,
        message: 'User history not found'
      })
    }

    // Check if user has permission to delete this history
    const company = await Company.findByUserId(currentUserId)
    if (!company || company.id !== userHistory.companyId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this history'
      })
    }

    await UserHistory.delete(id)

    res.json({
      success: true,
      message: 'User history deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user history',
      error: error.message
    })
  }
}

// Get company statistics
export const getCompanyStats = async (req, res) => {
  try {
    const currentUserId = req.user.id

    // Get user's company
    const company = await Company.findByUserId(currentUserId)
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a registered company'
      })
    }

    const stats = await UserHistory.getCompanyStats(company.id)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error getting company stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get company statistics',
      error: error.message
    })
  }
}

