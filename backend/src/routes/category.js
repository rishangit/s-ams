import express from 'express'
import {
  getAllCategories,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/categoryController.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public routes (no authentication required)
router.get('/', getAllCategories) // Get all categories with subcategories
router.get('/list', getCategories) // Get categories only (without subcategories)
router.get('/:id', getCategoryById) // Get category by ID with subcategories
router.get('/:categoryId/subcategories', getSubcategoriesByCategory) // Get subcategories by category

// Admin routes (require admin authentication)
router.post('/', authenticateToken, requireAdmin, createCategory) // Create new category
router.put('/:id', authenticateToken, requireAdmin, updateCategory) // Update category
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory) // Delete category

// Subcategory admin routes
router.post('/subcategories', authenticateToken, requireAdmin, createSubcategory) // Create new subcategory
router.put('/subcategories/:id', authenticateToken, requireAdmin, updateSubcategory) // Update subcategory
router.delete('/subcategories/:id', authenticateToken, requireAdmin, deleteSubcategory) // Delete subcategory

export default router
