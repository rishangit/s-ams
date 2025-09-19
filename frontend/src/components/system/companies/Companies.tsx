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
import { ViewSwitcher, ViewMode } from '../../../components/shared'
import CompaniesListview from './CompaniesListview'
import CompaniesCardview from './CompaniesCardview'
import CompaniesGridview from './CompaniesGridview'

const Companies: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { companies, loading, error, success } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)

  // Load companies when component mounts
  useEffect(() => {
    if (user && isAdminOnlyRole(parseInt(String(user.role)) as any)) {
      dispatch(getAllCompaniesRequest())
    }
  }, [user?.role, dispatch])

  // Auto-switch to card view on mobile (only if user hasn't manually selected a view)
  useEffect(() => {
    if (!userSelectedView) {
      if (isMobile && viewMode !== 'card') {
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        setViewMode('grid')
      }
    }
  }, [isMobile, viewMode, userSelectedView])

  // Reset user selection when screen size changes significantly
  useEffect(() => {
    setUserSelectedView(false)
  }, [isMobile])

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


  // Handle view mode change
  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }

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
        
        {/* View Switcher */}
        <ViewSwitcher
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          theme={uiTheme}
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
