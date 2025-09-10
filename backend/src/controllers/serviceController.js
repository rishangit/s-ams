import { Service } from '../models/index.js'
import { Company } from '../models/index.js'

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, description, duration, price, status } = req.body
    const userId = req.user.id

    // Get user's company
    const company = await Company.findByUserId(userId)
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a registered company'
      })
    }

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      })
    }

    // Create service
    const serviceData = {
      name,
      description,
      duration,
      price: parseFloat(price),
      status: status || 'active',
      companyId: company.id
    }

    const service = await Service.create(serviceData)

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        service: {
          id: service.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          status: service.status,
          companyId: service.companyId,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Create service error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    })
  }
}

// Get services by company (for the company owner)
export const getServicesByCompany = async (req, res) => {
  try {
    const userId = req.user.id

    // Get user's company
    const company = await Company.findByUserId(userId)
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a registered company'
      })
    }

    const { status, limit = 50, offset = 0 } = req.query

    const options = {
      companyId: company.id,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }

    if (status) {
      options.status = status
    }

    const services = await Service.findAll(options)

    res.json({
      success: true,
      data: {
        services: services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          status: service.status,
          companyId: service.companyId,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get services by company error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get services',
      error: error.message
    })
  }
}

// Get services by company ID (for appointment booking)
export const getServicesByCompanyId = async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId)
    
    if (isNaN(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
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

    // Get active services for the company
    const services = await Service.findByCompanyId(companyId)
    const activeServices = services.filter(service => service.status === 'active')

    res.json({
      success: true,
      data: {
        services: activeServices.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          status: service.status,
          companyId: service.companyId,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get services by company ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get services',
      error: error.message
    })
  }
}

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id)
    const userId = req.user.id

    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== service.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view services from your company.'
      })
    }

    res.json({
      success: true,
      data: {
        service: {
          id: service.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          status: service.status,
          companyId: service.companyId,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Get service by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get service',
      error: error.message
    })
  }
}

// Update service
export const updateService = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id)
    const { name, description, duration, price, status } = req.body
    const userId = req.user.id

    // Get service to check ownership
    const existingService = await Service.findById(serviceId)
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== existingService.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update services from your company.'
      })
    }

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      })
    }

    // Update service
    const serviceData = {
      name,
      description,
      duration,
      price: parseFloat(price),
      status: status || existingService.status
    }

    const updatedService = await Service.update(serviceId, serviceData)

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: {
        service: {
          id: updatedService.id,
          name: updatedService.name,
          description: updatedService.description,
          duration: updatedService.duration,
          price: updatedService.price,
          status: updatedService.status,
          companyId: updatedService.companyId,
          createdAt: updatedService.createdAt,
          updatedAt: updatedService.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Update service error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    })
  }
}

// Update service status
export const updateServiceStatus = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id)
    const { status } = req.body
    const userId = req.user.id

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or inactive'
      })
    }

    // Get service to check ownership
    const existingService = await Service.findById(serviceId)
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== existingService.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update services from your company.'
      })
    }

    const updatedService = await Service.updateStatus(serviceId, status)

    res.json({
      success: true,
      message: `Service status updated to ${status}`,
      data: {
        service: {
          id: updatedService.id,
          name: updatedService.name,
          description: updatedService.description,
          duration: updatedService.duration,
          price: updatedService.price,
          status: updatedService.status,
          companyId: updatedService.companyId,
          createdAt: updatedService.createdAt,
          updatedAt: updatedService.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Update service status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update service status',
      error: error.message
    })
  }
}

// Delete service
export const deleteService = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id)
    const userId = req.user.id

    // Get service to check ownership
    const existingService = await Service.findById(serviceId)
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== existingService.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete services from your company.'
      })
    }

    await Service.delete(serviceId)

    res.json({
      success: true,
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Delete service error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    })
  }
}
