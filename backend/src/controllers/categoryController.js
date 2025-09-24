import { Category, Subcategory } from '../models/index.js'

// Get all categories with subcategories
export const getAllCategories = async (req, res) => {
  try {
    const { search, limit, offset } = req.query
    
    const options = {}
    if (search) options.search = search
    if (limit) options.limit = parseInt(limit)
    if (offset) options.offset = parseInt(offset)
    
    const categories = await Category.getAllWithSubcategories()
    
    res.json({
      success: true,
      data: {
        categories
      }
    })
  } catch (error) {
    console.error('Get all categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    })
  }
}

// Get categories only (without subcategories)
export const getCategories = async (req, res) => {
  try {
    const { search, limit, offset } = req.query
    
    const options = {}
    if (search) options.search = search
    if (limit) options.limit = parseInt(limit)
    if (offset) options.offset = parseInt(offset)
    
    const categories = await Category.findAll(options)
    
    res.json({
      success: true,
      data: {
        categories
      }
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    })
  }
}

// Get category by ID with subcategories
export const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      })
    }
    
    const category = await Category.getWithSubcategories(categoryId)
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    res.json({
      success: true,
      data: {
        category
      }
    })
  } catch (error) {
    console.error('Get category by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get category',
      error: error.message
    })
  }
}

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color, sortOrder } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
    }
    
    const categoryData = {
      name: name.trim(),
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      color: color || '#6366f1',
      sortOrder: sortOrder || 0
    }
    
    const category = await Category.create(categoryData)
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category
      }
    })
  } catch (error) {
    console.error('Create category error:', error)
    
    if (error.message.includes('Duplicate entry')) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    })
  }
}

// Update category
export const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    const { name, description, icon, color, sortOrder, isActive } = req.body
    
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      })
    }
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
    }
    
    const categoryData = {
      name: name.trim(),
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      color: color || '#6366f1',
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    }
    
    const category = await Category.update(categoryId, categoryData)
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category
      }
    })
  } catch (error) {
    console.error('Update category error:', error)
    
    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    if (error.message.includes('Duplicate entry')) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    })
  }
}

// Delete category (soft delete)
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      })
    }
    
    await Category.delete(categoryId)
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Delete category error:', error)
    
    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    })
  }
}

// Get subcategories by category ID
export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId)
    
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      })
    }
    
    const subcategories = await Subcategory.findByCategoryId(categoryId)
    
    res.json({
      success: true,
      data: {
        subcategories
      }
    })
  } catch (error) {
    console.error('Get subcategories by category error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get subcategories',
      error: error.message
    })
  }
}

// Create new subcategory
export const createSubcategory = async (req, res) => {
  try {
    const { categoryId, name, description, icon, color, sortOrder } = req.body
    
    if (!categoryId || !name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category ID and subcategory name are required'
      })
    }
    
    // Check if category exists
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    // Check if subcategory name already exists in this category
    const exists = await Subcategory.existsByCategoryAndName(categoryId, name.trim())
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name already exists in this category'
      })
    }
    
    const subcategoryData = {
      categoryId,
      name: name.trim(),
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      color: color || '#6366f1',
      sortOrder: sortOrder || 0
    }
    
    const subcategory = await Subcategory.create(subcategoryData)
    
    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: {
        subcategory
      }
    })
  } catch (error) {
    console.error('Create subcategory error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error.message
    })
  }
}

// Update subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const subcategoryId = parseInt(req.params.id)
    const { categoryId, name, description, icon, color, sortOrder, isActive } = req.body
    
    if (isNaN(subcategoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subcategory ID'
      })
    }
    
    if (!categoryId || !name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category ID and subcategory name are required'
      })
    }
    
    // Check if category exists
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    // Check if subcategory name already exists in this category (excluding current subcategory)
    const exists = await Subcategory.existsByCategoryAndName(categoryId, name.trim(), subcategoryId)
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name already exists in this category'
      })
    }
    
    const subcategoryData = {
      categoryId,
      name: name.trim(),
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      color: color || '#6366f1',
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    }
    
    const subcategory = await Subcategory.update(subcategoryId, subcategoryData)
    
    res.json({
      success: true,
      message: 'Subcategory updated successfully',
      data: {
        subcategory
      }
    })
  } catch (error) {
    console.error('Update subcategory error:', error)
    
    if (error.message === 'Subcategory not found') {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update subcategory',
      error: error.message
    })
  }
}

// Delete subcategory (soft delete)
export const deleteSubcategory = async (req, res) => {
  try {
    const subcategoryId = parseInt(req.params.id)
    
    if (isNaN(subcategoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subcategory ID'
      })
    }
    
    await Subcategory.delete(subcategoryId)
    
    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    })
  } catch (error) {
    console.error('Delete subcategory error:', error)
    
    if (error.message === 'Subcategory not found') {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory',
      error: error.message
    })
  }
}
