import { User, Company, Appointment } from '../models/index.js'

// Get all users who received services from the shop owner's company
export const getCompanyUsers = async (req, res) => {
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

    const companyId = company.id

    // Get all unique users who have appointments with this company
    const users = await User.findUsersByCompanyId(companyId)

    res.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error getting company users:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

// Get all appointments for a specific user in the shop owner's company
export const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user.id

    // Get user's company
    const company = await Company.findByUserId(currentUserId)
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a registered company'
      })
    }

    const companyId = company.id

    // Get all appointments for this user in this company
    const appointments = await Appointment.findByUserIdAndCompanyId(parseInt(userId), companyId)

    res.json({
      success: true,
      data: appointments
    })
  } catch (error) {
    console.error('Error getting user appointments:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

// Get all appointments for the current user with a specific company (for role 3 users)
export const getUserAppointmentsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params
    const currentUserId = req.user.id
    const userRole = req.user.role

    // Only allow role 3 users to access this endpoint
    if (parseInt(userRole) !== 3) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only regular users can access this endpoint.'
      })
    }

    // Verify that the user has appointments with this company
    const hasAppointments = await Company.hasUserAppointments(currentUserId, parseInt(companyId))
    if (!hasAppointments) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have appointments with this company.'
      })
    }

    // Get all appointments for this user with this company
    const appointments = await Appointment.findByUserIdAndCompanyId(currentUserId, parseInt(companyId))

    res.json({
      success: true,
      data: appointments
    })
  } catch (error) {
    console.error('Error getting user appointments by company:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}