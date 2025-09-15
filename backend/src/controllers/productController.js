import { Product } from '../models/index.js'
import { Company } from '../models/index.js'

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      unit, 
      unitPrice, 
      quantity, 
      minQuantity, 
      maxQuantity, 
      status,
      supplier,
      sku,
      barcode
    } = req.body
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
    if (!name || !unitPrice) {
      return res.status(400).json({
        success: false,
        message: 'Name and unit price are required'
      })
    }

    // Create product
    const productData = {
      name,
      description,
      category,
      unit,
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity) || 0,
      minQuantity: parseInt(minQuantity) || 0,
      maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
      status: status || 'active',
      supplier,
      sku,
      barcode,
      companyId: company.id
    }

    const product = await Product.create(productData)

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          unit: product.unit,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          status: product.status,
          supplier: product.supplier,
          sku: product.sku,
          barcode: product.barcode,
          companyId: product.companyId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    })
  }
}

// Get products by company (for the company owner)
export const getProductsByCompany = async (req, res) => {
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

    const { status, category, search, limit = 50, offset = 0 } = req.query

    const options = {
      companyId: company.id,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }

    if (status) {
      options.status = status
    }

    if (category) {
      options.category = category
    }

    if (search) {
      options.search = search
    }

    const products = await Product.findAll(options)

    res.json({
      success: true,
      data: {
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          unit: product.unit,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          status: product.status,
          supplier: product.supplier,
          sku: product.sku,
          barcode: product.barcode,
          companyId: product.companyId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get products by company error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    })
  }
}

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const userId = req.user.id

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== product.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view products from your company.'
      })
    }

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          unit: product.unit,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          status: product.status,
          supplier: product.supplier,
          sku: product.sku,
          barcode: product.barcode,
          companyId: product.companyId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Get product by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    })
  }
}

// Update product
export const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { 
      name, 
      description, 
      category, 
      unit, 
      unitPrice, 
      quantity, 
      minQuantity, 
      maxQuantity, 
      status,
      supplier,
      sku,
      barcode
    } = req.body
    const userId = req.user.id

    // Get product to check ownership
    const existingProduct = await Product.findById(productId)
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== existingProduct.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update products from your company.'
      })
    }

    // Validate required fields
    if (!name || !unitPrice) {
      return res.status(400).json({
        success: false,
        message: 'Name and unit price are required'
      })
    }

    // Update product
    const productData = {
      name,
      description,
      category,
      unit,
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity) || existingProduct.quantity,
      minQuantity: parseInt(minQuantity) || existingProduct.minQuantity,
      maxQuantity: maxQuantity ? parseInt(maxQuantity) : existingProduct.maxQuantity,
      status: status || existingProduct.status,
      supplier,
      sku,
      barcode
    }

    const updatedProduct = await Product.update(productId, productData)

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          description: updatedProduct.description,
          category: updatedProduct.category,
          unit: updatedProduct.unit,
          unitPrice: updatedProduct.unitPrice,
          quantity: updatedProduct.quantity,
          minQuantity: updatedProduct.minQuantity,
          maxQuantity: updatedProduct.maxQuantity,
          status: updatedProduct.status,
          supplier: updatedProduct.supplier,
          sku: updatedProduct.sku,
          barcode: updatedProduct.barcode,
          companyId: updatedProduct.companyId,
          createdAt: updatedProduct.createdAt,
          updatedAt: updatedProduct.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    })
  }
}

// Update product quantity
export const updateProductQuantity = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { quantity } = req.body
    const userId = req.user.id

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      })
    }

    // Get product to check ownership
    const existingProduct = await Product.findById(productId)
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== existingProduct.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update products from your company.'
      })
    }

    const updatedProduct = await Product.updateQuantity(productId, parseInt(quantity))

    res.json({
      success: true,
      message: 'Product quantity updated successfully',
      data: {
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          quantity: updatedProduct.quantity,
          minQuantity: updatedProduct.minQuantity,
          maxQuantity: updatedProduct.maxQuantity,
          status: updatedProduct.status
        }
      }
    })
  } catch (error) {
    console.error('Update product quantity error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update product quantity',
      error: error.message
    })
  }
}

// Update product status
export const updateProductStatus = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { status } = req.body
    const userId = req.user.id

    if (!status || !['active', 'inactive', 'discontinued'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or discontinued'
      })
    }

    // Get product to check ownership
    const existingProduct = await Product.findById(productId)
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== existingProduct.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update products from your company.'
      })
    }

    const updatedProduct = await Product.updateStatus(productId, status)

    res.json({
      success: true,
      message: `Product status updated to ${status}`,
      data: {
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          status: updatedProduct.status
        }
      }
    })
  } catch (error) {
    console.error('Update product status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update product status',
      error: error.message
    })
  }
}

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const userId = req.user.id

    // Get product to check ownership
    const existingProduct = await Product.findById(productId)
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get user's company to verify ownership
    const company = await Company.findByUserId(userId)
    if (!company || company.id !== existingProduct.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete products from your company.'
      })
    }

    await Product.delete(productId)

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    })
  }
}

// Get low stock products
export const getLowStockProducts = async (req, res) => {
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

    const lowStockProducts = await Product.getLowStockProducts(company.id)

    res.json({
      success: true,
      data: {
        products: lowStockProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          unit: product.unit,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          status: product.status,
          supplier: product.supplier,
          sku: product.sku,
          barcode: product.barcode,
          companyId: product.companyId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get low stock products error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get low stock products',
      error: error.message
    })
  }
}

// Get product categories
export const getProductCategories = async (req, res) => {
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

    const categories = await Product.getCategories(company.id)

    res.json({
      success: true,
      data: {
        categories
      }
    })
  } catch (error) {
    console.error('Get product categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get product categories',
      error: error.message
    })
  }
}
