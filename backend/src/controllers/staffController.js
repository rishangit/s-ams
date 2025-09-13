import { Staff, User, Company } from '../models/index.js'
import { ROLES } from '../constants/roles.js'
import { STAFF_STATUS, getStatusDisplayName } from '../constants/staffStatus.js'

export const createStaff = async (req, res) => {
  try {
    const { userId, workingHoursStart, workingHoursEnd, skills, professionalQualifications, status } = req.body
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

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if user is already staff for this company
    const isAlreadyStaff = await Staff.isUserStaffForCompany(userId, companyId)
    if (isAlreadyStaff) {
      return res.status(400).json({ error: 'User is already a staff member for this company' })
    }

    const staffData = {
      userId,
      companyId,
      workingHoursStart,
      workingHoursEnd,
      skills,
      professionalQualifications,
      status: status !== undefined ? status : STAFF_STATUS.ACTIVE
    }

    const staff = await Staff.create(staffData)
    
    // Update user role to STAFF (2) when assigned as staff, but only if current role is USER (3)
    if (user.role === ROLES.USER) {
      await User.updateRole(userId, 'staff')
    }
    
    const staffWithDetails = await Staff.findById(staff.id)

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      data: staffWithDetails
    })
  } catch (error) {
    console.error('Error creating staff:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getStaffByCompany = async (req, res) => {
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
    const staff = await Staff.findAllByCompanyId(companyId)

    res.json({
      success: true,
      message: 'Staff retrieved successfully',
      data: staff
    })
  } catch (error) {
    console.error('Error getting staff:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params
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
    const staff = await Staff.findById(id)
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' })
    }

    // Check if staff belongs to the company
    if (staff.companyId !== companyId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json({
      success: true,
      message: 'Staff member retrieved successfully',
      data: staff
    })
  } catch (error) {
    console.error('Error getting staff member:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params
    const currentUserId = req.user.id
    const { workingHoursStart, workingHoursEnd, skills, professionalQualifications, status } = req.body

    // Get user's company
    const company = await Company.findByUserId(currentUserId)
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a registered company'
      })
    }

    const companyId = company.id

    // Check if staff exists and belongs to company
    const existingStaff = await Staff.findById(id)
    if (!existingStaff) {
      return res.status(404).json({ error: 'Staff member not found' })
    }

    if (existingStaff.companyId !== companyId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const updateData = {
      workingHoursStart,
      workingHoursEnd,
      skills,
      professionalQualifications,
      status
    }

    const updatedStaff = await Staff.update(id, updateData)

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: updatedStaff
    })
  } catch (error) {
    console.error('Error updating staff:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params
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

    // Check if staff exists and belongs to company
    const existingStaff = await Staff.findById(id)
    if (!existingStaff) {
      return res.status(404).json({ error: 'Staff member not found' })
    }

    if (existingStaff.companyId !== companyId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Get the user ID before deleting staff record
    const userId = existingStaff.userId
    
    await Staff.delete(id)
    
    // Check if user has any other staff positions
    const remainingStaffPositions = await Staff.findByUserId(userId)
    
    // Only revert user role back to USER (3) if they have no other staff positions
    if (!remainingStaffPositions || remainingStaffPositions.length === 0) {
      await User.updateRole(userId, 'user')
    }

    res.json({
      success: true,
      message: 'Staff member removed successfully'
    })
  } catch (error) {
    console.error('Error deleting staff:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getAvailableUsers = async (req, res) => {
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
    const users = await Staff.findAvailableUsersForCompany(companyId)

    res.json({
      success: true,
      message: 'Available users retrieved successfully',
      data: users
    })
  } catch (error) {
    console.error('Error getting available users:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

// Get staff for a specific company (for role 3 users booking appointments)
export const getStaffByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params
    const userRole = req.user.role

    // Allow all authenticated users to access this endpoint
    // Role 1 (company owners) and Role 3 (regular users) can both access staff for any company

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      })
    }

    // Verify company exists
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    const staff = await Staff.findByCompanyId(parseInt(companyId))

    res.json({
      success: true,
      message: 'Staff retrieved successfully',
      data: staff
    })
  } catch (error) {
    console.error('Error getting staff by company ID:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

// Admin only - get all staff across all companies
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll()

    res.json({
      success: true,
      message: 'All staff retrieved successfully',
      data: staff
    })
  } catch (error) {
    console.error('Error getting all staff:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

