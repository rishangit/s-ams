import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { 
  getAllCategoriesRequest,
  getCategoriesRequest,
  getCategoryByIdRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
  getSubcategoriesByCategoryRequest,
  createSubcategoryRequest,
  updateSubcategoryRequest,
  deleteSubcategoryRequest,
  clearCategoriesError,
  clearCategoriesSuccess
} from '../store/actions/categoryActions'
import { useEffect, useCallback } from 'react'

export const useCategories = () => {
  const dispatch = useDispatch()
  const categoriesState = useSelector((state: RootState) => state.categories)

  // Load all categories with subcategories on mount
  useEffect(() => {
    if (categoriesState.categoriesWithSubcategories.length === 0 && !categoriesState.loading) {
      dispatch(getAllCategoriesRequest())
    }
  }, [dispatch, categoriesState.categoriesWithSubcategories.length, categoriesState.loading])

  // Memoized actions to prevent infinite re-renders
  const getAllCategories = useCallback(() => dispatch(getAllCategoriesRequest()), [dispatch])
  const getCategories = useCallback((options?: { search?: string; limit?: number; offset?: number }) => 
    dispatch(getCategoriesRequest(options || {})), [dispatch])
  const getCategoryById = useCallback((id: number) => dispatch(getCategoryByIdRequest(id)), [dispatch])
  const createCategory = useCallback((data: any) => dispatch(createCategoryRequest(data)), [dispatch])
  const updateCategory = useCallback((data: any) => dispatch(updateCategoryRequest(data)), [dispatch])
  const deleteCategory = useCallback((id: number) => dispatch(deleteCategoryRequest(id)), [dispatch])
  const getSubcategoriesByCategory = useCallback((categoryId: number) => 
    dispatch(getSubcategoriesByCategoryRequest(categoryId)), [dispatch])
  const createSubcategory = useCallback((data: any) => dispatch(createSubcategoryRequest(data)), [dispatch])
  const updateSubcategory = useCallback((data: any) => dispatch(updateSubcategoryRequest(data)), [dispatch])
  const deleteSubcategory = useCallback((id: number) => dispatch(deleteSubcategoryRequest(id)), [dispatch])
  const clearError = useCallback(() => dispatch(clearCategoriesError()), [dispatch])
  const clearSuccess = useCallback(() => dispatch(clearCategoriesSuccess()), [dispatch])

  // Memoized helper functions
  const getSubcategoriesForCategory = useCallback((categoryId: number) => {
    return categoriesState.subcategoriesByCategory[categoryId] || []
  }, [categoriesState.subcategoriesByCategory])
  
  const getCategoryByIdHelper = useCallback((categoryId: number) => {
    return categoriesState.categoriesWithSubcategories.find(cat => cat.id === categoryId)
  }, [categoriesState.categoriesWithSubcategories])
  
  const getSubcategoryById = useCallback((categoryId: number, subcategoryId: number) => {
    const subcategories = categoriesState.subcategoriesByCategory[categoryId] || []
    return subcategories.find(sub => sub.id === subcategoryId)
  }, [categoriesState.subcategoriesByCategory])

  return {
    // State
    categoriesWithSubcategories: categoriesState.categoriesWithSubcategories,
    categories: categoriesState.categories,
    currentCategory: categoriesState.currentCategory,
    subcategoriesByCategory: categoriesState.subcategoriesByCategory,
    
    // Loading states
    loading: categoriesState.loading,
    loadingCategories: categoriesState.loadingCategories,
    loadingCategory: categoriesState.loadingCategory,
    loadingSubcategories: categoriesState.loadingSubcategories,
    creating: categoriesState.creating,
    updating: categoriesState.updating,
    deleting: categoriesState.deleting,
    
    // Error and success states
    error: categoriesState.error,
    success: categoriesState.success,
    
    // Actions
    getAllCategories,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Subcategory actions
    getSubcategoriesByCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    
    // Utility actions
    clearError,
    clearSuccess,
    
    // Helper functions
    getSubcategoriesForCategory,
    getCategoryById: getCategoryByIdHelper,
    getSubcategoryById
  }
}
