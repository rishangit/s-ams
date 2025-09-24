import React, { useEffect, useState } from 'react'
import {
  Box,
  useMediaQuery
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import {
  getAllCategoriesRequest,
  clearCategoriesError,
  clearCategoriesSuccess
} from '../../../store/actions/categoryActions'
import { ViewMode } from '../../../components/shared'
import ViewModeSelector from '../../../components/shared/ViewModeSelector'
import { useViewMode } from '../../../hooks/useViewMode'
import { useTheme } from '../../../hooks/useTheme'
import { getUserSettingsRequest } from '../../../store/actions/userSettingsActions'
import CategoriesListview from './CategoriesListview'
import CategoriesCardview from './CategoriesCardview'
import CategoriesGridview from './CategoriesGridview'

const Categories: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { categoriesWithSubcategories, loading, error, success } = useSelector((state: RootState) => state.categories)
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.userSettings)
  const { theme: uiTheme } = useTheme()
  const { categoriesView } = useViewMode()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<ViewMode>('grid') // Default, will be updated when settings load
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)

  // Load categories when component mounts
  useEffect(() => {
    if (user && user.role === 0) {
      dispatch(getAllCategoriesRequest())
      
      // Load user settings if not already loaded
      if (!settings && !settingsLoading) {
        dispatch(getUserSettingsRequest())
      }
    }
  }, [user?.role, dispatch, settings, settingsLoading])

  // Sync view mode with user settings
  useEffect(() => {
    if (settings && !settingsLoading && !userSelectedView && !settingsLoaded) {
      console.log('Categories: Setting view mode from settings:', categoriesView)
      setViewMode(categoriesView as ViewMode)
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoading, categoriesView, userSelectedView, settingsLoaded])

  // Auto-switch to card view on mobile if user hasn't manually selected a view
  useEffect(() => {
    if (!userSelectedView && !settings) {
      if (isMobile && viewMode !== 'card') {
        console.log('Categories: Auto-switching to card view for mobile')
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        console.log('Categories: Auto-switching to grid view for desktop')
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
            Only system administrators can access categories management.
          </p>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="mx-auto p-0 md:p-6">
      <Box className="flex items-center justify-between mb-4">
        <h1
          className="font-bold text-xl md:text-3xl"
          style={{ color: uiTheme.text }}
        >
          Categories Management
        </h1>
        <ViewModeSelector
          section="categories"
          currentView={viewMode}
          onViewChange={(newView) => {
            console.log('Categories: User selected view:', newView)
            setViewMode(newView as ViewMode)
            setUserSelectedView(true)
          }}
        />
      </Box>

      {error && (
        <Box className="mb-4 p-4 rounded-lg bg-red-100 border border-red-300">
          <p className="text-red-700">{error}</p>
        </Box>
      )}

      {success && (
        <Box className="mb-4 p-4 rounded-lg bg-green-100 border border-green-300">
          <p className="text-green-700">{success}</p>
        </Box>
      )}

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: uiTheme.primary }}></div>
        </Box>
      ) : (
        <>
          {viewMode === 'list' && (
            <CategoriesListview
              categories={categoriesWithSubcategories}
              loading={loading}
              error={error}
              success={success}
              uiTheme={uiTheme}
              onViewSubcategories={(categoryId) => {
                window.location.href = `/system/categories/${categoryId}`
              }}
              onEditCategory={(categoryId) => {
                console.log('Edit category:', categoryId)
                // TODO: Implement edit functionality
              }}
              onDeleteCategory={(categoryId) => {
                console.log('Delete category:', categoryId)
                // TODO: Implement delete functionality
              }}
            />
          )}
          {viewMode === 'card' && (
            <CategoriesCardview
              categories={categoriesWithSubcategories}
              loading={loading}
              error={error}
              success={success}
              theme={uiTheme}
              onViewSubcategories={(categoryId) => {
                window.location.href = `/system/categories/${categoryId}`
              }}
              onEditCategory={(categoryId) => {
                console.log('Edit category:', categoryId)
                // TODO: Implement edit functionality
              }}
              onDeleteCategory={(categoryId) => {
                console.log('Delete category:', categoryId)
                // TODO: Implement delete functionality
              }}
            />
          )}
          {viewMode === 'grid' && (
            <CategoriesGridview
              categories={categoriesWithSubcategories}
              loading={loading}
              error={error}
              success={success}
              theme={uiTheme}
              onViewSubcategories={(categoryId) => {
                window.location.href = `/system/categories/${categoryId}`
              }}
              onEditCategory={(categoryId) => {
                console.log('Edit category:', categoryId)
                // TODO: Implement edit functionality
              }}
              onDeleteCategory={(categoryId) => {
                console.log('Delete category:', categoryId)
                // TODO: Implement delete functionality
              }}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default Categories
