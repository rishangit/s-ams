import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createProductRequest,
  createProductSuccess,
  createProductFailure,
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  getProductByIdRequest,
  getProductByIdSuccess,
  getProductByIdFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  updateProductQuantityRequest,
  updateProductQuantitySuccess,
  updateProductQuantityFailure,
  updateProductStatusRequest,
  updateProductStatusSuccess,
  updateProductStatusFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure,
  getLowStockProductsRequest,
  getLowStockProductsSuccess,
  getLowStockProductsFailure,
  getProductCategoriesRequest,
  getProductCategoriesSuccess,
  getProductCategoriesFailure,
  clearProductsMessages,
  Product
} from '../actions/productsActions'

interface ProductsState {
  products: Product[] | null
  currentProduct: Product | null
  lowStockProducts: Product[] | null
  categories: string[]
  loading: boolean
  getProductByIdLoading: boolean
  error: string | null
  success: string | null
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
}

const initialState: ProductsState = {
  products: null,
  currentProduct: null,
  lowStockProducts: null,
  categories: [],
  loading: false,
  getProductByIdLoading: false,
  error: null,
  success: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create product
    builder
      .addCase(createProductRequest, (state) => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createProductSuccess, (state, action: PayloadAction<Product>) => {
        state.createLoading = false
        state.currentProduct = action.payload
        state.success = 'Product created successfully!'
        // Add the product to the list if it exists
        if (state.products) {
          state.products.unshift(action.payload)
        }
      })
      .addCase(createProductFailure, (state, action: PayloadAction<string>) => {
        state.createLoading = false
        state.error = action.payload
      })

    // Get products
    builder
      .addCase(getProductsRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProductsSuccess, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(getProductsFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get product by ID
    builder
      .addCase(getProductByIdRequest, (state) => {
        state.getProductByIdLoading = true
        state.error = null
      })
      .addCase(getProductByIdSuccess, (state, action: PayloadAction<Product>) => {
        state.getProductByIdLoading = false
        state.currentProduct = action.payload
      })
      .addCase(getProductByIdFailure, (state, action: PayloadAction<string>) => {
        state.getProductByIdLoading = false
        state.error = action.payload
      })

    // Update product
    builder
      .addCase(updateProductRequest, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateProductSuccess, (state, action: PayloadAction<Product>) => {
        state.updateLoading = false
        state.currentProduct = action.payload
        state.success = 'Product updated successfully!'
        // Update the product in the list if it exists
        if (state.products) {
          const index = state.products.findIndex(p => p.id === action.payload.id)
          if (index !== -1) {
            state.products[index] = action.payload
          }
        }
      })
      .addCase(updateProductFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Update product quantity
    builder
      .addCase(updateProductQuantityRequest, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateProductQuantitySuccess, (state, action: PayloadAction<Product>) => {
        state.updateLoading = false
        state.success = 'Product quantity updated successfully!'
        // Update the product in the list if it exists
        if (state.products) {
          const index = state.products.findIndex(p => p.id === action.payload.id)
          if (index !== -1) {
            state.products[index] = action.payload
          }
        }
        // Update current product if it's the same
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload
        }
      })
      .addCase(updateProductQuantityFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Update product status
    builder
      .addCase(updateProductStatusRequest, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateProductStatusSuccess, (state, action: PayloadAction<Product>) => {
        state.updateLoading = false
        state.success = `Product status updated to ${action.payload.status}!`
        // Update the product in the list if it exists
        if (state.products) {
          const index = state.products.findIndex(p => p.id === action.payload.id)
          if (index !== -1) {
            state.products[index] = action.payload
          }
        }
        // Update current product if it's the same
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload
        }
      })
      .addCase(updateProductStatusFailure, (state, action: PayloadAction<string>) => {
        state.updateLoading = false
        state.error = action.payload
      })

    // Delete product
    builder
      .addCase(deleteProductRequest, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteProductSuccess, (state, action: PayloadAction<number>) => {
        state.deleteLoading = false
        state.success = 'Product deleted successfully!'
        // Remove the product from the list if it exists
        if (state.products) {
          state.products = state.products.filter(p => p.id !== action.payload)
        }
        // Clear current product if it's the deleted one
        if (state.currentProduct && state.currentProduct.id === action.payload) {
          state.currentProduct = null
        }
        // Clear form product if it's the deleted one
      })
      .addCase(deleteProductFailure, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false
        state.error = action.payload
      })

    // Get low stock products
    builder
      .addCase(getLowStockProductsRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLowStockProductsSuccess, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.lowStockProducts = action.payload
      })
      .addCase(getLowStockProductsFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Get product categories
    builder
      .addCase(getProductCategoriesRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProductCategoriesSuccess, (state, action: PayloadAction<string[]>) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(getProductCategoriesFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })

    // Clear messages
    builder
      .addCase(clearProductsMessages, (state) => {
        state.error = null
        state.success = null
      })

  }
})

export default productsSlice.reducer
