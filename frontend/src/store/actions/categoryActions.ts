import { createAction } from '@reduxjs/toolkit'

// Category and Subcategory interfaces
export interface Category {
  id: number
  name: string
  description?: string
  icon?: string
  color: string
  sortOrder: number
  subcategoryCount?: number
  createdAt: string
  updatedAt: string
}

export interface Subcategory {
  id: number
  categoryId: number
  name: string
  description?: string
  icon?: string
  color: string
  sortOrder: number
  categoryName?: string
  createdAt: string
  updatedAt: string
}

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[]
}

// Create Category/Subcategory interfaces
export interface CreateCategoryPayload {
  name: string
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
}

export interface CreateSubcategoryPayload {
  categoryId: number
  name: string
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
}

// Update Category/Subcategory interfaces
export interface UpdateCategoryPayload {
  id: number
  name: string
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
  isActive?: boolean
}

export interface UpdateSubcategoryPayload {
  id: number
  categoryId: number
  name: string
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
  isActive?: boolean
}

// Get Categories Actions
export const getAllCategoriesRequest = createAction('categories/getAllCategoriesRequest')
export const getAllCategoriesSuccess = createAction<CategoryWithSubcategories[]>('categories/getAllCategoriesSuccess')
export const getAllCategoriesFailure = createAction<string>('categories/getAllCategoriesFailure')

export const getCategoriesRequest = createAction<{ search?: string; limit?: number; offset?: number }>('categories/getCategoriesRequest')
export const getCategoriesSuccess = createAction<Category[]>('categories/getCategoriesSuccess')
export const getCategoriesFailure = createAction<string>('categories/getCategoriesFailure')

export const getCategoryByIdRequest = createAction<number>('categories/getCategoryByIdRequest')
export const getCategoryByIdSuccess = createAction<CategoryWithSubcategories>('categories/getCategoryByIdSuccess')
export const getCategoryByIdFailure = createAction<string>('categories/getCategoryByIdFailure')

// Create Category Actions
export const createCategoryRequest = createAction<CreateCategoryPayload>('categories/createCategoryRequest')
export const createCategorySuccess = createAction<Category>('categories/createCategorySuccess')
export const createCategoryFailure = createAction<string>('categories/createCategoryFailure')

// Update Category Actions
export const updateCategoryRequest = createAction<UpdateCategoryPayload>('categories/updateCategoryRequest')
export const updateCategorySuccess = createAction<Category>('categories/updateCategorySuccess')
export const updateCategoryFailure = createAction<string>('categories/updateCategoryFailure')

// Delete Category Actions
export const deleteCategoryRequest = createAction<number>('categories/deleteCategoryRequest')
export const deleteCategorySuccess = createAction<number>('categories/deleteCategorySuccess')
export const deleteCategoryFailure = createAction<string>('categories/deleteCategoryFailure')

// Get Subcategories Actions
export const getSubcategoriesByCategoryRequest = createAction<number>('categories/getSubcategoriesByCategoryRequest')
export const getSubcategoriesByCategorySuccess = createAction<{ categoryId: number; subcategories: Subcategory[] }>('categories/getSubcategoriesByCategorySuccess')
export const getSubcategoriesByCategoryFailure = createAction<string>('categories/getSubcategoriesByCategoryFailure')

// Create Subcategory Actions
export const createSubcategoryRequest = createAction<CreateSubcategoryPayload>('categories/createSubcategoryRequest')
export const createSubcategorySuccess = createAction<Subcategory>('categories/createSubcategorySuccess')
export const createSubcategoryFailure = createAction<string>('categories/createSubcategoryFailure')

// Update Subcategory Actions
export const updateSubcategoryRequest = createAction<UpdateSubcategoryPayload>('categories/updateSubcategoryRequest')
export const updateSubcategorySuccess = createAction<Subcategory>('categories/updateSubcategorySuccess')
export const updateSubcategoryFailure = createAction<string>('categories/updateSubcategoryFailure')

// Delete Subcategory Actions
export const deleteSubcategoryRequest = createAction<number>('categories/deleteSubcategoryRequest')
export const deleteSubcategorySuccess = createAction<{ categoryId: number; subcategoryId: number }>('categories/deleteSubcategorySuccess')
export const deleteSubcategoryFailure = createAction<string>('categories/deleteSubcategoryFailure')

// Clear Categories Actions
export const clearCategoriesError = createAction('categories/clearCategoriesError')
export const clearCategoriesSuccess = createAction('categories/clearCategoriesSuccess')
