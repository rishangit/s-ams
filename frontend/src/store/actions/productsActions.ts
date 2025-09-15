import { createAction } from '@reduxjs/toolkit'
import { ProductFormData, ProductFilters } from '../../types/product'

// Product interface (re-exported for consistency with servicesActions pattern)
export interface Product {
  id: number
  name: string
  description?: string
  category?: string
  unit?: string
  unitPrice: number
  quantity: number
  minQuantity: number
  maxQuantity?: number
  status: 'active' | 'inactive' | 'discontinued'
  supplier?: string
  sku?: string
  barcode?: string
  companyId: number
  createdAt: string
  updatedAt: string
}

// Create Product Actions
export const createProductRequest = createAction<ProductFormData>('products/createProductRequest')
export const createProductSuccess = createAction<Product>('products/createProductSuccess')
export const createProductFailure = createAction<string>('products/createProductFailure')

// Get Products Actions
export const getProductsRequest = createAction<ProductFilters | undefined>('products/getProductsRequest')
export const getProductsSuccess = createAction<Product[]>('products/getProductsSuccess')
export const getProductsFailure = createAction<string>('products/getProductsFailure')

// Get Product by ID Actions
export const getProductByIdRequest = createAction<number>('products/getProductByIdRequest')
export const getProductByIdSuccess = createAction<Product>('products/getProductByIdSuccess')
export const getProductByIdFailure = createAction<string>('products/getProductByIdFailure')

// Update Product Actions
export const updateProductRequest = createAction<{ id: number; productData: Partial<ProductFormData> }>('products/updateProductRequest')
export const updateProductSuccess = createAction<Product>('products/updateProductSuccess')
export const updateProductFailure = createAction<string>('products/updateProductFailure')

// Update Product Quantity Actions
export const updateProductQuantityRequest = createAction<{ id: number; quantity: number }>('products/updateProductQuantityRequest')
export const updateProductQuantitySuccess = createAction<Product>('products/updateProductQuantitySuccess')
export const updateProductQuantityFailure = createAction<string>('products/updateProductQuantityFailure')

// Update Product Status Actions
export const updateProductStatusRequest = createAction<{ id: number; status: 'active' | 'inactive' | 'discontinued' }>('products/updateProductStatusRequest')
export const updateProductStatusSuccess = createAction<Product>('products/updateProductStatusSuccess')
export const updateProductStatusFailure = createAction<string>('products/updateProductStatusFailure')

// Delete Product Actions
export const deleteProductRequest = createAction<number>('products/deleteProductRequest')
export const deleteProductSuccess = createAction<number>('products/deleteProductSuccess')
export const deleteProductFailure = createAction<string>('products/deleteProductFailure')

// Get Low Stock Products Actions
export const getLowStockProductsRequest = createAction('products/getLowStockProductsRequest')
export const getLowStockProductsSuccess = createAction<Product[]>('products/getLowStockProductsSuccess')
export const getLowStockProductsFailure = createAction<string>('products/getLowStockProductsFailure')

// Get Product Categories Actions
export const getProductCategoriesRequest = createAction('products/getProductCategoriesRequest')
export const getProductCategoriesSuccess = createAction<string[]>('products/getProductCategoriesSuccess')
export const getProductCategoriesFailure = createAction<string>('products/getProductCategoriesFailure')

// Clear Messages Actions
export const clearProductsMessages = createAction('products/clearMessages')

// Set Form Product Actions (for editing)
export const setFormProduct = createAction<Product | null>('products/setFormProduct')

// Clear Form Product Actions
export const clearFormProduct = createAction('products/clearFormProduct')

