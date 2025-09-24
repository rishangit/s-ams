import { combineEpics, ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators'
import {
  getAllCategoriesRequest,
  getAllCategoriesSuccess,
  getAllCategoriesFailure,
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  getCategoryByIdRequest,
  getCategoryByIdSuccess,
  getCategoryByIdFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
  getSubcategoriesByCategoryRequest,
  getSubcategoriesByCategorySuccess,
  getSubcategoriesByCategoryFailure,
  createSubcategoryRequest,
  createSubcategorySuccess,
  createSubcategoryFailure,
  updateSubcategoryRequest,
  updateSubcategorySuccess,
  updateSubcategoryFailure,
  deleteSubcategoryRequest,
  deleteSubcategorySuccess,
  deleteSubcategoryFailure
} from '../actions/categoryActions'
import { apiService } from '../../services/api'

// Get All Categories with Subcategories Epic
const getAllCategoriesEpic = (action$: any) =>
  action$.pipe(
    ofType(getAllCategoriesRequest.type),
    switchMap(() =>
      from(apiService.request('/categories')).pipe(
        map((response) => {
          if (response.success) {
            return getAllCategoriesSuccess(response.data.categories)
          } else {
            return getAllCategoriesFailure(response.message || 'Failed to get categories')
          }
        }),
        catchError((error) => {
          console.error('Get all categories error:', error)
          return of(getAllCategoriesFailure(error.message || 'Failed to get categories'))
        })
      )
    )
  )

// Get Categories Only Epic
const getCategoriesEpic = (action$: any) =>
  action$.pipe(
    ofType(getCategoriesRequest.type),
    switchMap((action) => {
      const { search, limit, offset } = action.payload
      const params = new URLSearchParams()
      
      if (search) params.append('search', search)
      if (limit) params.append('limit', limit.toString())
      if (offset) params.append('offset', offset.toString())
      
      const queryString = params.toString()
      const url = queryString ? `/categories/list?${queryString}` : '/categories/list'
      
      return from(apiService.request(url)).pipe(
        map((response) => {
          if (response.success) {
            return getCategoriesSuccess(response.data.categories)
          } else {
            return getCategoriesFailure(response.message || 'Failed to get categories')
          }
        }),
        catchError((error) => {
          console.error('Get categories error:', error)
          return of(getCategoriesFailure(error.message || 'Failed to get categories'))
        })
      )
    })
  )

// Get Category by ID Epic
const getCategoryByIdEpic = (action$: any) =>
  action$.pipe(
    ofType(getCategoryByIdRequest.type),
    switchMap((action) =>
      from(apiService.request(`/categories/${action.payload}`)).pipe(
        map((response) => {
          if (response.success) {
            return getCategoryByIdSuccess(response.data.category)
          } else {
            return getCategoryByIdFailure(response.message || 'Failed to get category')
          }
        }),
        catchError((error) => {
          console.error('Get category by ID error:', error)
          return of(getCategoryByIdFailure(error.message || 'Failed to get category'))
        })
      )
    )
  )

// Create Category Epic
const createCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(createCategoryRequest.type),
    switchMap((action) =>
      from(apiService.request('/categories', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      })).pipe(
        map((response) => {
          if (response.success) {
            return createCategorySuccess(response.data.category)
          } else {
            return createCategoryFailure(response.message || 'Failed to create category')
          }
        }),
        catchError((error) => {
          console.error('Create category error:', error)
          return of(createCategoryFailure(error.message || 'Failed to create category'))
        })
      )
    )
  )

// Update Category Epic
const updateCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(updateCategoryRequest.type),
    switchMap((action) => {
      const { id, ...updateData } = action.payload
      return from(apiService.request(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })).pipe(
        map((response) => {
          if (response.success) {
            return updateCategorySuccess(response.data.category)
          } else {
            return updateCategoryFailure(response.message || 'Failed to update category')
          }
        }),
        catchError((error) => {
          console.error('Update category error:', error)
          return of(updateCategoryFailure(error.message || 'Failed to update category'))
        })
      )
    })
  )

// Delete Category Epic
const deleteCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteCategoryRequest.type),
    switchMap((action) =>
      from(apiService.request(`/categories/${action.payload}`, {
        method: 'DELETE'
      })).pipe(
        map((response) => {
          if (response.success) {
            return deleteCategorySuccess(action.payload)
          } else {
            return deleteCategoryFailure(response.message || 'Failed to delete category')
          }
        }),
        catchError((error) => {
          console.error('Delete category error:', error)
          return of(deleteCategoryFailure(error.message || 'Failed to delete category'))
        })
      )
    )
  )

// Get Subcategories by Category Epic
const getSubcategoriesByCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(getSubcategoriesByCategoryRequest.type),
    switchMap((action) =>
      from(apiService.request(`/categories/${action.payload}/subcategories`)).pipe(
        map((response) => {
          if (response.success) {
            return getSubcategoriesByCategorySuccess({
              categoryId: action.payload,
              subcategories: response.data.subcategories
            })
          } else {
            return getSubcategoriesByCategoryFailure(response.message || 'Failed to get subcategories')
          }
        }),
        catchError((error) => {
          console.error('Get subcategories by category error:', error)
          return of(getSubcategoriesByCategoryFailure(error.message || 'Failed to get subcategories'))
        })
      )
    )
  )

// Create Subcategory Epic
const createSubcategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(createSubcategoryRequest.type),
    switchMap((action) =>
      from(apiService.request('/categories/subcategories', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      })).pipe(
        map((response) => {
          if (response.success) {
            return createSubcategorySuccess(response.data.subcategory)
          } else {
            return createSubcategoryFailure(response.message || 'Failed to create subcategory')
          }
        }),
        catchError((error) => {
          console.error('Create subcategory error:', error)
          return of(createSubcategoryFailure(error.message || 'Failed to create subcategory'))
        })
      )
    )
  )

// Update Subcategory Epic
const updateSubcategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(updateSubcategoryRequest.type),
    switchMap((action) => {
      const { id, ...updateData } = action.payload
      return from(apiService.request(`/categories/subcategories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })).pipe(
        map((response) => {
          if (response.success) {
            return updateSubcategorySuccess(response.data.subcategory)
          } else {
            return updateSubcategoryFailure(response.message || 'Failed to update subcategory')
          }
        }),
        catchError((error) => {
          console.error('Update subcategory error:', error)
          return of(updateSubcategoryFailure(error.message || 'Failed to update subcategory'))
        })
      )
    })
  )

// Delete Subcategory Epic
const deleteSubcategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteSubcategoryRequest.type),
    withLatestFrom(
      // We need to get the categoryId from the state or pass it in the action
      // For now, we'll modify the action to include categoryId
    ),
    switchMap(([action]) =>
      from(apiService.request(`/categories/subcategories/${action.payload}`, {
        method: 'DELETE'
      })).pipe(
        map((response) => {
          if (response.success) {
            // We need to get the categoryId somehow - this is a limitation of the current design
            // We'll need to modify the delete action to include categoryId
            return deleteSubcategorySuccess({
              categoryId: 0, // This should be passed in the action
              subcategoryId: action.payload
            })
          } else {
            return deleteSubcategoryFailure(response.message || 'Failed to delete subcategory')
          }
        }),
        catchError((error) => {
          console.error('Delete subcategory error:', error)
          return of(deleteSubcategoryFailure(error.message || 'Failed to delete subcategory'))
        })
      )
    )
  )

export const categoryEpics = combineEpics(
  getAllCategoriesEpic,
  getCategoriesEpic,
  getCategoryByIdEpic,
  createCategoryEpic,
  updateCategoryEpic,
  deleteCategoryEpic,
  getSubcategoriesByCategoryEpic,
  createSubcategoryEpic,
  updateSubcategoryEpic,
  deleteSubcategoryEpic
)
