import express from 'express'
import { 
  createProduct, 
  getProductsByCompany,
  getProductById, 
  updateProduct, 
  updateProductQuantity,
  updateProductStatus, 
  deleteProduct,
  getLowStockProducts,
  getProductCategories
} from '../controllers/productController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateCompanyOwner } from '../middleware/companyValidation.js'

const router = express.Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Company owner routes (role 1)
router.post('/', validateCompanyOwner, createProduct)
router.get('/', validateCompanyOwner, getProductsByCompany)
router.get('/low-stock', validateCompanyOwner, getLowStockProducts)
router.get('/categories', validateCompanyOwner, getProductCategories)
router.get('/:id', validateCompanyOwner, getProductById)
router.put('/:id', validateCompanyOwner, updateProduct)
router.put('/:id/quantity', validateCompanyOwner, updateProductQuantity)
router.put('/:id/status', validateCompanyOwner, updateProductStatus)
router.delete('/:id', validateCompanyOwner, deleteProduct)

export default router
