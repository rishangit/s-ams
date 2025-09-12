import { Company } from '../models/index.js'
import { User } from '../models/index.js'
import { validateCompanyData } from '../middleware/companyValidation.js'

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const { name, address, phoneNumber, landPhone, geoLocation } = req.body
    const userId = req.user.id

    // Validate input data
    const validation = validateCompanyData(req.body)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', ')
      })
    }

    // Check if user already has a company
    const existingCompany = await Company.existsByUserId(userId)
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'User already has a registered company'
      })
    }

    // Create company
    const companyData = {
      name,
      address,
      phoneNumber,
      landPhone,
      geoLocation,
      userId
    }

    const company = await Company.create(companyData)

    // Update user role to owner when company request is sent
    await User.updateRole(userId, 'owner')

    res.status(201).json({
      success: true,
      message: 'Company registration request submitted successfully. Your role has been updated to Owner.',
      data: {
        company: {
          id: company.id,
          name: company.name,
          address: company.address,
          phoneNumber: company.phoneNumber,
          landPhone: company.landPhone,
          geoLocation: company.geoLocation,
          status: company.status,
          userId: company.userId,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Create company error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create company',
      error: error.message
    })
  }
}

// Get company by user ID
export const getCompanyByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)

    // Check if user is requesting their own company or is admin
    if (req.user.id !== userId && req.user.role !== 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    const company = await Company.findByUserId(userId)

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }
    res.json({
      success: true,
      data: {
        company: {
          id: company.id,
          name: company.name,
          address: company.address,
          phoneNumber: company.phoneNumber,
          landPhone: company.landPhone,
          geoLocation: company.geoLocation,
          status: company.status,
          userId: company.userId,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Get company by user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get company',
      error: error.message
    })
  }
}

// Update company
export const updateCompany = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id)
    const { name, address, phoneNumber, landPhone, geoLocation } = req.body

    // Validate input data
    const validation = validateCompanyData(req.body)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', ')
      })
    }

    // Get company to check ownership
    const existingCompany = await Company.findById(companyId)
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    // Check if user owns the company or is admin
    if (existingCompany.userId !== req.user.id && req.user.role !== 0 && req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Update company
    const companyData = {
      name,
      address,
      phoneNumber,
      landPhone,
      geoLocation
    }

    const updatedCompany = await Company.update(companyId, companyData)

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: {
        company: {
          id: updatedCompany.id,
          name: updatedCompany.name,
          address: updatedCompany.address,
          phoneNumber: updatedCompany.phoneNumber,
          landPhone: updatedCompany.landPhone,
          geoLocation: updatedCompany.geoLocation,
          status: updatedCompany.status,
          userId: updatedCompany.userId,
          createdAt: updatedCompany.createdAt,
          updatedAt: updatedCompany.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Update company error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update company',
      error: error.message
    })
  }
}

// Get company by ID (users can view their own company, admins can view any company)
export const getCompanyById = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id)

    const company = await Company.findById(companyId)

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    // Check if user is requesting their own company or is admin
    if (req.user.id !== company.userId && req.user.role !== 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own company.'
      })
    }
    res.json({
      success: true,
      data: {
        company: {
          id: company.id,
          name: company.name,
          address: company.address,
          phoneNumber: company.phoneNumber,
          landPhone: company.landPhone,
          geoLocation: company.geoLocation,
          status: company.status,
          userId: company.userId,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Get company by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get company',
      error: error.message
    })
  }
}

// Get all companies for appointment booking (authenticated users)
export const getCompaniesForBooking = async (req, res) => {
  try {
    const { status = 'active' } = req.query

    const options = {
      status,
      limit: 100, // Reasonable limit for dropdown
      offset: 0
    }

    const companies = await Company.findAll(options)

    res.json({
      success: true,
      data: {
        companies: companies.map(company => ({
          id: company.id,
          name: company.name,
          address: company.address,
          phoneNumber: company.phoneNumber,
          landPhone: company.landPhone,
          status: company.status,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get companies for booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get companies',
      error: error.message
    })
  }
}

// Get all companies (admin only)
export const getAllCompanies = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query

    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    }

    if (status) {
      options.status = status
    }

    const companies = await Company.findAll(options)

    res.json({
      success: true,
      data: {
        companies: companies.map(company => ({
          id: company.id,
          name: company.name,
          address: company.address,
          phoneNumber: company.phoneNumber,
          landPhone: company.landPhone,
          geoLocation: company.geoLocation,
          status: company.status,
          userId: company.userId,
          userFirstName: company.userFirstName,
          userLastName: company.userLastName,
          userEmail: company.userEmail,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get all companies error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get companies',
      error: error.message
    })
  }
}

// Update company status (admin only)
export const updateCompanyStatus = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id)
    const { status } = req.body

    if (!status || !['pending', 'active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, active, or inactive'
      })
    }

    const existingCompany = await Company.findById(companyId)
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    const updatedCompany = await Company.updateStatus(companyId, status)

    // Update user role to owner when company becomes active
    if (status === 'active') {
      await User.updateRole(existingCompany.userId, 'owner')
    }

    res.json({
      success: true,
      message: `Company status updated to ${status}${status === 'active' ? '. User role has been updated to Owner.' : ''}`,
      data: {
        company: {
          id: updatedCompany.id,
          name: updatedCompany.name,
          address: updatedCompany.address,
          phoneNumber: updatedCompany.phoneNumber,
          landPhone: updatedCompany.landPhone,
          geoLocation: updatedCompany.geoLocation,
          status: updatedCompany.status,
          userId: updatedCompany.userId,
          createdAt: updatedCompany.createdAt,
          updatedAt: updatedCompany.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Update company status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update company status',
      error: error.message
    })
  }
}

// Delete company (admin only)
export const deleteCompany = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id)

    const existingCompany = await Company.findById(companyId)
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    await Company.delete(companyId)

    res.json({
      success: true,
      message: 'Company deleted successfully'
    })
  } catch (error) {
    console.error('Delete company error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      error: error.message
    })
  }
}

// Get companies that a user has appointments with
export const getCompaniesByUserAppointments = async (req, res) => {
  try {
    console.log('getCompaniesByUserAppointments called:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      userRoleType: typeof req.user?.role
    })
    
    const userId = req.user.id
    const userRole = req.user.role

    // Only allow role 3 users to access this endpoint
    if (parseInt(userRole) !== 3) {
      console.log('Access denied - user role is not 3:', userRole, 'parsed:', parseInt(userRole))
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only regular users can access this endpoint.'
      })
    }

    console.log('Fetching companies for user:', userId)
    // Get companies with appointment statistics
    const companies = await Company.findByUserAppointments(userId)
    console.log('Companies found:', companies.length)
    console.log('First company data:', companies[0])

    res.json({
      success: true,
      message: 'Companies retrieved successfully',
      data: companies
    })
  } catch (error) {
    console.error('Error getting companies by user appointments:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
