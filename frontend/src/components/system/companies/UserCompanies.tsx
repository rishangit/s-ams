import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { getCompaniesByUserAppointmentsRequest } from '../../../store/actions/companyActions'
import { 
  Box, 
  Typography, 
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material'
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as CardViewIcon
} from '@mui/icons-material'
import UserCompaniesListview from './UserCompaniesListview'
import UserCompaniesCardview from './UserCompaniesCardview'
import UserCompaniesGridview from './UserCompaniesGridview'

const UserCompanies: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { userCompanies, loading, error } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)


  // Load companies when component mounts
  useEffect(() => {
    if (user && parseInt(String(user.role)) === 3) {
      dispatch(getCompaniesByUserAppointmentsRequest())
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


  // Handle view mode change
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }

  // Company action handlers
  const handleViewCompany = (companyId: number) => {
    navigate(`/system/companies/${companyId}`)
  }

  const handleBookAppointment = (_companyId: number) => {
    // TODO: Implement book appointment functionality
  }

  const handleViewAppointments = (companyId: number) => {
    navigate(`/system/my-companies/${companyId}/appointments`)
  }


  if (loading) {
    return (
      <Box className="flex justify-center items-center h-96">
        <Typography variant="h6" className="text-gray-900 dark:text-gray-100">
          Loading companies...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-96">
        <Typography variant="h6" className="text-red-600">
          Error: {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="h-full p-0 sm:p-6">
      {/* Header Section */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Companies
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Companies where you have booked appointments
          </p>
        </Box>
        
        {/* View Switcher */}
        {!isMobile && (
          <Box className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <Tooltip title="Grid View">
              <IconButton
                size="small"
                onClick={() => handleViewModeChange('grid')}
                className={`transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="List View">
              <IconButton
                size="small"
                onClick={() => handleViewModeChange('list')}
                className={`transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ListViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Card View">
              <IconButton
                size="small"
                onClick={() => handleViewModeChange('card')}
                className={`transition-colors ${
                  viewMode === 'card' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <CardViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>


      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <UserCompaniesGridview
          filteredUserCompanies={userCompanies || []}
          loading={loading}
          error={error}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onViewAppointments={handleViewAppointments}
          onBookAppointment={handleBookAppointment}
        />
      ) : viewMode === 'list' ? (
        <UserCompaniesListview
          filteredUserCompanies={userCompanies || []}
          loading={loading}
          error={error}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onViewAppointments={handleViewAppointments}
          onBookAppointment={handleBookAppointment}
        />
      ) : (
        <UserCompaniesCardview
          filteredUserCompanies={userCompanies || []}
          loading={loading}
          error={error}
          uiTheme={uiTheme}
          onViewCompany={handleViewCompany}
          onViewAppointments={handleViewAppointments}
          onBookAppointment={handleBookAppointment}
        />
      )}
    </Box>
  )
}

export default UserCompanies
