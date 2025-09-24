import React, { useEffect, useState } from 'react'
import {
  Box,
  useMediaQuery,
  Typography,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material'
import {
  ArrowBack as BackIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import {
  getSubcategoriesByCategoryRequest,
  clearCategoriesError,
  clearCategoriesSuccess
} from '../../../store/actions/categoryActions'
import { ViewMode } from '../../../components/shared'
import ViewModeSelector from '../../../components/shared/ViewModeSelector'
import { useViewMode } from '../../../hooks/useViewMode'
import { useTheme } from '../../../hooks/useTheme'
import { getUserSettingsRequest } from '../../../store/actions/userSettingsActions'
import SubcategoriesListview from './SubcategoriesListview'
import SubcategoriesCardview from './SubcategoriesCardview'
import SubcategoriesGridview from './SubcategoriesGridview'

const Subcategories: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { 
    subcategoriesByCategory, 
    categoriesWithSubcategories,
    loading, 
    error, 
    success 
  } = useSelector((state: RootState) => state.categories)
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.userSettings)
  const { theme: uiTheme } = useTheme()
  const { categoriesView } = useViewMode()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<ViewMode>('grid') // Default, will be updated when settings load
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)

  // Get current category info
  const currentCategory = categoriesWithSubcategories.find(cat => cat.id === parseInt(id || '0'))
  const subcategories = subcategoriesByCategory[parseInt(id || '0')] || []

  // Load subcategories when component mounts
  useEffect(() => {
    if (user && user.role === 0 && id) {
      dispatch(getSubcategoriesByCategoryRequest(parseInt(id)))
      
      // Load user settings if not already loaded
      if (!settings && !settingsLoading) {
        dispatch(getUserSettingsRequest())
      }
    }
  }, [user?.role, dispatch, id, settings, settingsLoading])

  // Sync view mode with user settings
  useEffect(() => {
    if (settings && !settingsLoading && !userSelectedView && !settingsLoaded) {
      console.log('Subcategories: Setting view mode from settings:', categoriesView)
      setViewMode(categoriesView as ViewMode)
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoading, categoriesView, userSelectedView, settingsLoaded])

  // Auto-switch to card view on mobile if user hasn't manually selected a view
  useEffect(() => {
    if (!userSelectedView && !settings) {
      if (isMobile && viewMode !== 'card') {
        console.log('Subcategories: Auto-switching to card view for mobile')
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        console.log('Subcategories: Auto-switching to grid view for desktop')
        setViewMode('grid')
      }
    }
  }, [isMobile, viewMode, userSelectedView, settings])

  // Reset user selected view when screen size changes (only if no settings saved)
  useEffect(() => {
    if (!settings) {
      setUserSelectedView(false)
    }
  }, [isMobile, settings])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearCategoriesError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearCategoriesSuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  // Check if user has admin access
  if (!user || user.role !== 0) {
    return (
      <Box className="mx-auto p-0 md:p-6">
        <Box className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: uiTheme.text }}>
            Access Denied
          </h2>
          <p style={{ color: uiTheme.textSecondary }}>
            Only system administrators can access subcategories management.
          </p>
        </Box>
      </Box>
    )
  }

  const handleBack = () => {
    navigate('/system/categories')
  }

  return (
    <Box className="mx-auto p-0 md:p-6">
      {/* Header with Back Button and Breadcrumbs */}
      <Box className="flex items-center justify-between mb-4">
        <Box className="flex items-center gap-4">
          <IconButton
            onClick={handleBack}
            style={{ color: uiTheme.primary }}
            title="Back to Categories"
          >
            <BackIcon />
          </IconButton>
          
          <Box>
            <Breadcrumbs aria-label="breadcrumb" style={{ color: uiTheme.textSecondary }}>
              <Link
                underline="hover"
                color="inherit"
                href="/system/categories"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/system/categories')
                }}
                style={{ color: uiTheme.textSecondary }}
              >
                Categories
              </Link>
              <Typography style={{ color: uiTheme.text }}>
                {currentCategory?.name || 'Subcategories'}
              </Typography>
            </Breadcrumbs>
            
            <h1
              className="font-bold text-xl md:text-3xl mt-2"
              style={{ color: uiTheme.text }}
            >
              {currentCategory?.name ? `${currentCategory.name} - Subcategories` : 'Subcategories'}
            </h1>
          </Box>
        </Box>
        
        <ViewModeSelector
          section="categories"
          currentView={viewMode}
          onViewChange={(newView) => {
            console.log('Subcategories: User selected view:', newView)
            setViewMode(newView as ViewMode)
            setUserSelectedView(true)
          }}
        />
      </Box>

      {/* Category Info */}
      {currentCategory && (
        <Box className="mb-4 p-4 rounded-lg" style={{ backgroundColor: uiTheme.background, border: `1px solid ${uiTheme.border}` }}>
          <Typography
            variant="body2"
            style={{ color: uiTheme.textSecondary }}
            className="mb-2"
          >
            Category Information:
          </Typography>
          <Typography
            variant="body1"
            style={{ color: uiTheme.text }}
            className="font-medium"
          >
            {currentCategory.name}
          </Typography>
          {currentCategory.description && (
            <Typography
              variant="body2"
              style={{ color: uiTheme.textSecondary }}
              className="mt-1"
            >
              {currentCategory.description}
            </Typography>
          )}
        </Box>
      )}

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: uiTheme.primary }}></div>
        </Box>
      ) : (
        <>
          {viewMode === 'list' && (
            <SubcategoriesListview
              subcategories={subcategories}
              loading={loading}
              error={error}
              success={success}
              uiTheme={uiTheme}
              onEditSubcategory={(subcategoryId) => {
                console.log('Edit subcategory:', subcategoryId)
                // TODO: Implement edit functionality
              }}
              onDeleteSubcategory={(subcategoryId) => {
                console.log('Delete subcategory:', subcategoryId)
                // TODO: Implement delete functionality
              }}
            />
          )}
          {viewMode === 'card' && (
            <SubcategoriesCardview
              subcategories={subcategories}
              loading={loading}
              error={error}
              success={success}
              theme={uiTheme}
              onEditSubcategory={(subcategoryId) => {
                console.log('Edit subcategory:', subcategoryId)
                // TODO: Implement edit functionality
              }}
              onDeleteSubcategory={(subcategoryId) => {
                console.log('Delete subcategory:', subcategoryId)
                // TODO: Implement delete functionality
              }}
            />
          )}
          {viewMode === 'grid' && (
            <SubcategoriesGridview
              subcategories={subcategories}
              loading={loading}
              error={error}
              success={success}
              theme={uiTheme}
              onEditSubcategory={(subcategoryId) => {
                console.log('Edit subcategory:', subcategoryId)
                // TODO: Implement edit functionality
              }}
              onDeleteSubcategory={(subcategoryId) => {
                console.log('Delete subcategory:', subcategoryId)
                // TODO: Implement delete functionality
              }}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default Subcategories

