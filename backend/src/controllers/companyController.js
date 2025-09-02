import Company from '../models/Company.js'
import { validateCompanyData } from '../middleware/companyValidation.js'

class CompanyController {
  // Create a new company
  static async createCompany(req, res) {
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
        data: company
      })
    } catch (error) {
      console.error('Error creating company:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create company'
      })
    }
  }

  // Get company by user ID
  static async getCompanyByUser(req, res) {
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
        data: company
      })
    } catch (error) {
      console.error('Error getting company by user:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get company'
      })
    }
  }

  // Update company
  static async updateCompany(req, res) {
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
        data: updatedCompany
      })
    } catch (error) {
      console.error('Error updating company:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update company'
      })
    }
  }

  // Get company by ID (admin only)
  static async getCompanyById(req, res) {
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
        data: company
      })
    } catch (error) {
      console.error('Error getting company by ID:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get company'
      })
    }
  }

  // Get all companies (admin only)
  static async getAllCompanies(req, res) {
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
        data: companies
      })
    } catch (error) {
      console.error('Error getting all companies:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get companies'
      })
    }
  }

  // Update company status (admin only)
  static async updateCompanyStatus(req, res) {
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
        data: updatedCompany
      })
    } catch (error) {
      console.error('Error updating company status:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update company status'
      })
    }
  }

  // Delete company (admin only)
  static async deleteCompany(req, res) {
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
      console.error('Error deleting company:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to delete company'
      })
    }
  }
}

export default CompanyController
