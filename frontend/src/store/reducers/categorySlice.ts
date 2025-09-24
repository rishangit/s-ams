import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
  deleteSubcategoryFailure,
  clearCategoriesError,
  clearCategoriesSuccess,
  Category,
  CategoryWithSubcategories,
  Subcategory
} from '../actions/categoryActions'

interface CategoryState {
  // Categories with subcategories
  categoriesWithSubcategories: CategoryWithSubcategories[]
  
  // Categories only (without subcategories)
  categories: Category[]
  
  // Current category details
  currentCategory: CategoryWithSubcategories | null
  
  // Subcategories by category
  subcategoriesByCategory: { [categoryId: number]: Subcategory[] }
  
  // Loading states
  loading: boolean
  loadingCategories: boolean
  loadingCategory: boolean
  loadingSubcategories: boolean
  
  // Creating/Updating states
  creating: boolean
  updating: boolean
  deleting: boolean
  
  // Error and success states
  error: string | null
  success: string | null
}

const initialState: CategoryState = {
  categoriesWithSubcategories: [],
  categories: [],
  currentCategory: null,
  subcategoriesByCategory: {},
  loading: false,
  loadingCategories: false,
  loadingCategory: false,
  loadingSubcategories: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: null
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Categories with Subcategories
      .addCase(getAllCategoriesRequest, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllCategoriesSuccess, (state, action: PayloadAction<CategoryWithSubcategories[]>) => {
        state.loading = false
        state.categoriesWithSubcategories = action.payload
        state.error = null
      })
      .addCase(getAllCategoriesFailure, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Get Categories Only
      .addCase(getCategoriesRequest, (state) => {
        state.loadingCategories = true
        state.error = null
      })
      .addCase(getCategoriesSuccess, (state, action: PayloadAction<Category[]>) => {
        state.loadingCategories = false
        state.categories = action.payload
        state.error = null
      })
      .addCase(getCategoriesFailure, (state, action: PayloadAction<string>) => {
        state.loadingCategories = false
        state.error = action.payload
      })
      
      // Get Category by ID
      .addCase(getCategoryByIdRequest, (state) => {
        state.loadingCategory = true
        state.error = null
      })
      .addCase(getCategoryByIdSuccess, (state, action: PayloadAction<CategoryWithSubcategories>) => {
        state.loadingCategory = false
        state.currentCategory = action.payload
        state.error = null
      })
      .addCase(getCategoryByIdFailure, (state, action: PayloadAction<string>) => {
        state.loadingCategory = false
        state.error = action.payload
      })
      
      // Create Category
      .addCase(createCategoryRequest, (state) => {
        state.creating = true
        state.error = null
        state.success = null
      })
      .addCase(createCategorySuccess, (state, action: PayloadAction<Category>) => {
        state.creating = false
        state.categories.push(action.payload)
        state.success = 'Category created successfully'
        state.error = null
      })
      .addCase(createCategoryFailure, (state, action: PayloadAction<string>) => {
        state.creating = false
        state.error = action.payload
      })
      
      // Update Category
      .addCase(updateCategoryRequest, (state) => {
        state.updating = true
        state.error = null
        state.success = null
      })
      .addCase(updateCategorySuccess, (state, action: PayloadAction<Category>) => {
        state.updating = false
        const index = state.categories.findIndex(cat => cat.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
        state.success = 'Category updated successfully'
        state.error = null
      })
      .addCase(updateCategoryFailure, (state, action: PayloadAction<string>) => {
        state.updating = false
        state.error = action.payload
      })
      
      // Delete Category
      .addCase(deleteCategoryRequest, (state) => {
        state.deleting = true
        state.error = null
        state.success = null
      })
      .addCase(deleteCategorySuccess, (state, action: PayloadAction<number>) => {
        state.deleting = false
        state.categories = state.categories.filter(cat => cat.id !== action.payload)
        state.success = 'Category deleted successfully'
        state.error = null
      })
      .addCase(deleteCategoryFailure, (state, action: PayloadAction<string>) => {
        state.deleting = false
        state.error = action.payload
      })
      
      // Get Subcategories by Category
      .addCase(getSubcategoriesByCategoryRequest, (state) => {
        state.loadingSubcategories = true
        state.error = null
      })
      .addCase(getSubcategoriesByCategorySuccess, (state, action: PayloadAction<{ categoryId: number; subcategories: Subcategory[] }>) => {
        state.loadingSubcategories = false
        state.subcategoriesByCategory[action.payload.categoryId] = action.payload.subcategories
        state.error = null
      })
      .addCase(getSubcategoriesByCategoryFailure, (state, action: PayloadAction<string>) => {
        state.loadingSubcategories = false
        state.error = action.payload
      })
      
      // Create Subcategory
      .addCase(createSubcategoryRequest, (state) => {
        state.creating = true
        state.error = null
        state.success = null
      })
      .addCase(createSubcategorySuccess, (state, action: PayloadAction<Subcategory>) => {
        state.creating = false
        const categoryId = action.payload.categoryId
        if (!state.subcategoriesByCategory[categoryId]) {
          state.subcategoriesByCategory[categoryId] = []
        }
        state.subcategoriesByCategory[categoryId].push(action.payload)
        state.success = 'Subcategory created successfully'
        state.error = null
      })
      .addCase(createSubcategoryFailure, (state, action: PayloadAction<string>) => {
        state.creating = false
        state.error = action.payload
      })
      
      // Update Subcategory
      .addCase(updateSubcategoryRequest, (state) => {
        state.updating = true
        state.error = null
        state.success = null
      })
      .addCase(updateSubcategorySuccess, (state, action: PayloadAction<Subcategory>) => {
        state.updating = false
        const categoryId = action.payload.categoryId
        if (state.subcategoriesByCategory[categoryId]) {
          const index = state.subcategoriesByCategory[categoryId].findIndex(sub => sub.id === action.payload.id)
          if (index !== -1) {
            state.subcategoriesByCategory[categoryId][index] = action.payload
          }
        }
        state.success = 'Subcategory updated successfully'
        state.error = null
      })
      .addCase(updateSubcategoryFailure, (state, action: PayloadAction<string>) => {
        state.updating = false
        state.error = action.payload
      })
      
      // Delete Subcategory
      .addCase(deleteSubcategoryRequest, (state) => {
        state.deleting = true
        state.error = null
        state.success = null
      })
      .addCase(deleteSubcategorySuccess, (state, action: PayloadAction<{ categoryId: number; subcategoryId: number }>) => {
        state.deleting = false
        const { categoryId, subcategoryId } = action.payload
        if (state.subcategoriesByCategory[categoryId]) {
          state.subcategoriesByCategory[categoryId] = state.subcategoriesByCategory[categoryId].filter(
            sub => sub.id !== subcategoryId
          )
        }
        state.success = 'Subcategory deleted successfully'
        state.error = null
      })
      .addCase(deleteSubcategoryFailure, (state, action: PayloadAction<string>) => {
        state.deleting = false
        state.error = action.payload
      })
      
      // Clear Error and Success
      .addCase(clearCategoriesError, (state) => {
        state.error = null
      })
      .addCase(clearCategoriesSuccess, (state) => {
        state.success = null
      })
  }
})

export default categorySlice.reducer
