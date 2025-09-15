import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { switchMap, catchError, map } from 'rxjs/operators'
import { apiService } from '../../services/api'
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
  getProductCategoriesFailure
} from '../actions/productsActions'

// Create Product Epic
export const createProductEpic = (action$: any) =>
  action$.pipe(
    ofType(createProductRequest.type),
    switchMap((action: any) =>
      from(apiService.createProduct(action.payload)).pipe(
        map((response: any) => {
          if (response.success) {
            return createProductSuccess(response.data.product)
          } else {
            return createProductFailure(response.message || 'Failed to create product')
          }
        }),
        catchError((error: any) => of(createProductFailure(error.message || 'Failed to create product')))
      )
    )
  )

// Get Products Epic
export const getProductsEpic = (action$: any) =>
  action$.pipe(
    ofType(getProductsRequest.type),
    switchMap((action: any) =>
      from(apiService.getProducts(action.payload)).pipe(
        map((response: any) => {
          if (response.success) {
            return getProductsSuccess(response.data.products)
          } else {
            return getProductsFailure(response.message || 'Failed to get products')
          }
        }),
        catchError((error: any) => of(getProductsFailure(error.message || 'Failed to get products')))
      )
    )
  )

// Get Product by ID Epic
export const getProductByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getProductByIdRequest.type),
    switchMap((action: any) =>
      from(apiService.getProductById(action.payload)).pipe(
        map((response: any) => {
          if (response.success) {
            return getProductByIdSuccess(response.data.product)
          } else {
            return getProductByIdFailure(response.message || 'Failed to get product')
          }
        }),
        catchError((error: any) => of(getProductByIdFailure(error.message || 'Failed to get product')))
      )
    )
  )

// Update Product Epic
export const updateProductEpic = (action$: any) =>
  action$.pipe(
    ofType(updateProductRequest.type),
    switchMap((action: any) =>
      from(apiService.updateProduct(action.payload.id, action.payload.productData)).pipe(
        map((response: any) => {
          if (response.success) {
            return updateProductSuccess(response.data.product)
          } else {
            return updateProductFailure(response.message || 'Failed to update product')
          }
        }),
        catchError((error: any) => of(updateProductFailure(error.message || 'Failed to update product')))
      )
    )
  )

// Update Product Quantity Epic
export const updateProductQuantityEpic = (action$: any) =>
  action$.pipe(
    ofType(updateProductQuantityRequest.type),
    switchMap((action: any) =>
      from(apiService.updateProductQuantity(action.payload.id, action.payload.quantity)).pipe(
        map((response: any) => {
          if (response.success) {
            return updateProductQuantitySuccess(response.data.product)
          } else {
            return updateProductQuantityFailure(response.message || 'Failed to update product quantity')
          }
        }),
        catchError((error: any) => of(updateProductQuantityFailure(error.message || 'Failed to update product quantity')))
      )
    )
  )

// Update Product Status Epic
export const updateProductStatusEpic = (action$: any) =>
  action$.pipe(
    ofType(updateProductStatusRequest.type),
    switchMap((action: any) =>
      from(apiService.updateProductStatus(action.payload.id, action.payload.status)).pipe(
        map((response: any) => {
          if (response.success) {
            return updateProductStatusSuccess(response.data.product)
          } else {
            return updateProductStatusFailure(response.message || 'Failed to update product status')
          }
        }),
        catchError((error: any) => of(updateProductStatusFailure(error.message || 'Failed to update product status')))
      )
    )
  )

// Delete Product Epic
export const deleteProductEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteProductRequest.type),
    switchMap((action: any) =>
      from(apiService.deleteProduct(action.payload)).pipe(
        map((response: any) => {
          if (response.success) {
            return deleteProductSuccess(action.payload)
          } else {
            return deleteProductFailure(response.message || 'Failed to delete product')
          }
        }),
        catchError((error: any) => of(deleteProductFailure(error.message || 'Failed to delete product')))
      )
    )
  )

// Get Low Stock Products Epic
export const getLowStockProductsEpic = (action$: any) =>
  action$.pipe(
    ofType(getLowStockProductsRequest.type),
    switchMap(() =>
      from(apiService.getLowStockProducts()).pipe(
        map((response: any) => {
          if (response.success) {
            return getLowStockProductsSuccess(response.data.products)
          } else {
            return getLowStockProductsFailure(response.message || 'Failed to get low stock products')
          }
        }),
        catchError((error: any) => of(getLowStockProductsFailure(error.message || 'Failed to get low stock products')))
      )
    )
  )

// Get Product Categories Epic
export const getProductCategoriesEpic = (action$: any) =>
  action$.pipe(
    ofType(getProductCategoriesRequest.type),
    switchMap(() =>
      from(apiService.getProductCategories()).pipe(
        map((response: any) => {
          if (response.success) {
            return getProductCategoriesSuccess(response.data.categories)
          } else {
            return getProductCategoriesFailure(response.message || 'Failed to get product categories')
          }
        }),
        catchError((error: any) => of(getProductCategoriesFailure(error.message || 'Failed to get product categories')))
      )
    )
  )
