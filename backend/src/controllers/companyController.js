import { Company } from '../models/index.js'
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

    res.status(201).json({
      success: true,
      message: 'Company registration request submitted successfully',
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
    if (req.user.id !== userId && req.user.role !== 0 && req.user.role !== 1) {
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

// Get company by ID (admin only)
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

    res.json({
      success: true,
      message: `Company status updated to ${status}`,
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
