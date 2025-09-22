import React, { useEffect, useState } from 'react'
import {
  Box,
  useMediaQuery
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import {
  getAllCompaniesRequest,
  clearCompanyError,
  clearCompanySuccess
} from '../../../store/actions/companyActions'
import { isAdminOnlyRole } from '../../../constants/roles'
import { ViewMode } from '../../../components/shared'
import ViewModeSelector from '../../../components/shared/ViewModeSelector'
import { useViewMode } from '../../../hooks/useViewMode'
import { useTheme } from '../../../hooks/useTheme'
import { getUserSettingsRequest } from '../../../store/actions/userSettingsActions'
import CompaniesListview from './CompaniesListview'
import CompaniesCardview from './CompaniesCardview'
import CompaniesGridview from './CompaniesGridview'

const Companies: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { companies, loading, error, success } = useSelector((state: RootState) => state.company)
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.userSettings)
  const { theme: uiTheme } = useTheme()
  const { companiesView } = useViewMode()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<ViewMode>('grid') // Default, will be updated when settings load
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)

  // Load companies when component mounts
  useEffect(() => {
    if (user && isAdminOnlyRole(parseInt(String(user.role)) as any)) {
      dispatch(getAllCompaniesRequest())
      
      // Load user settings if not already loaded
      if (!settings && !settingsLoading) {
        dispatch(getUserSettingsRequest())
      }
    }
  }, [user?.role, dispatch, settings, settingsLoading])

  // Sync view mode with user settings
  useEffect(() => {
    // Only update if settings are loaded and user hasn't manually selected a view
    if (settings && !settingsLoading && !userSelectedView && !settingsLoaded) {
      console.log('Companies: Setting view mode from settings:', companiesView)
      setViewMode(companiesView as ViewMode)
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoading, companiesView, userSelectedView, settingsLoaded])

  // Auto-switch to card view on mobile (only if user hasn't manually selected a view and no saved settings)
  useEffect(() => {
    if (!userSelectedView && !settings) {
      if (isMobile && viewMode !== 'card') {
        console.log('Companies: Auto-switching to card view for mobile')
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        console.log('Companies: Auto-switching to grid view for desktop')
        setViewMode('grid')
      }
    }
  }, [isMobile, viewMode, userSelectedView, settings])

  // Reset user selection when screen size changes significantly (only if no saved settings)
  useEffect(() => {
    if (!settings) {
      setUserSelectedView(false)
    }
  }, [isMobile, settings])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearCompanyError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearCompanySuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  // Company action handlers
  const handleViewCompany = (companyId: number) => {
    navigate(`/system/companies/${companyId}`)
  }

  const handleEditCompany = (companyId: number) => {
    navigate(`/system/companies/${companyId}/edit`)
  }

  const handleDeleteCompany = (_companyId: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      // TODO: Implement delete company functionality
    }
  }


  if (!user || !isAdminOnlyRole(parseInt(String(user.role)) as any)) {
    return (
      <Box className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Access Denied. Admin privileges required.
        </div>
      </Box>
    )
  }

  return (
    <Box className="h-full p-0 sm:p-6">
      {/* Header Section */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Companies Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage all companies in the system
          </p>
        </Box>
        
        {/* View Mode Selector */}
        <ViewModeSelector
          section="companies"
          currentView={viewMode}
          onViewChange={(newView) => {
            setViewMode(newView as ViewMode)
            setUserSelectedView(true)
          }}
        />
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <CompaniesGridview
          filteredCompanies={companies || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
        />
      ) : viewMode === 'list' ? (
        <CompaniesListview
          filteredCompanies={companies || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
        />
      ) : (
        <CompaniesCardview
          filteredCompanies={companies || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
        />
      )}
    </Box>
  )
}

export default Companies
