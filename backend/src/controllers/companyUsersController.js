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
