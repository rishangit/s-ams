import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { getCompaniesByUserAppointmentsRequest } from '../../../store/actions/companyActions'
import { 
  Box, 
  Typography, 
  useMediaQuery
} from '@mui/material'
import UserCompaniesListview from './UserCompaniesListview'
import UserCompaniesCardview from './UserCompaniesCardview'
import UserCompaniesGridview from './UserCompaniesGridview'
import { ViewSwitcher, ViewMode } from '../../../components/shared'

const UserCompanies: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { userCompanies, loading, error } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
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
  const handleViewModeChange = (newViewMode: ViewMode) => {
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
        <ViewSwitcher
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          theme={uiTheme}
        />
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
