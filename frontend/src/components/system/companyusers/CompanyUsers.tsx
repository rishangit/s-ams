import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import CompanyUsersGridview from './CompanyUsersGridview'
import CompanyUsersListview from './CompanyUsersListview'
import CompanyUsersCardview from './CompanyUsersCardview'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { People as PeopleIcon } from '@mui/icons-material'
import { apiService } from '../../../services/api'
import { ViewMode } from '../../../components/shared'
import ViewModeSelector from '../../../components/shared/ViewModeSelector'
import { useViewMode } from '../../../hooks/useViewMode'
import { useTheme } from '../../../hooks/useTheme'
import { getUserSettingsRequest } from '../../../store/actions/userSettingsActions'

interface CompanyUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: number
  profileImage?: string
  createdAt: string
  updatedAt: string
  totalAppointments: number
  lastAppointmentDate?: string
  firstAppointmentDate?: string
}

const CompanyUsers: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.userSettings)
  const { theme: uiTheme } = useTheme()
  const { usersView } = useViewMode()
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid') // Default, will be updated when settings load
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)
  const [users, setUsers] = useState<CompanyUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch company users
  const fetchCompanyUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const response = await apiService.getCompanyUsers()

      if (response.success) {
        setUsers(response.data || [])
      } else {
        throw new Error(response.message || 'Failed to fetch company users')
      }
    } catch (err) {
      console.error('Error fetching company users:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch company users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === 1) { // Only for shop owners
      fetchCompanyUsers()
      
      // Load user settings if not already loaded
      if (!settings && !settingsLoading) {
        dispatch(getUserSettingsRequest())
      }
    }
  }, [user, dispatch, settings, settingsLoading])

  // Sync view mode with user settings
  useEffect(() => {
    // Only update if settings are loaded and user hasn't manually selected a view
    if (settings && !settingsLoading && !userSelectedView && !settingsLoaded) {
      console.log('CompanyUsers: Setting view mode from settings:', usersView)
      setViewMode(usersView as ViewMode)
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoading, usersView, userSelectedView, settingsLoaded])

  // Auto-switch to card view on mobile (only if user hasn't manually selected a view and no saved settings)
  useEffect(() => {
    if (!userSelectedView && !settings) {
      if (isMobile && viewMode !== 'card') {
        console.log('CompanyUsers: Auto-switching to card view for mobile')
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        console.log('CompanyUsers: Auto-switching to grid view for desktop')
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

  // Handle view appointments
  const handleViewAppointments = (userId: number) => {
    navigate(`/system/company-users/${userId}`)
  }


  // Show loading state
  if (authLoading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  // Show error if user is not a shop owner
  if (!user || user.role !== 1) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography color="error">
          Access denied. This page is only available for shop owners.
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="flex flex-col h-full">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6 flex-shrink-0">
        <PeopleIcon style={{ color: uiTheme.primary, fontSize: 32 }} />
        <Typography
          variant="h6"
          className="text-xl md:text-3xl font-bold"
          style={{ color: uiTheme.text }}
        >
          Company Users
        </Typography>
      </Box>

      {/* Controls Section - All on the right */}
      <Box className="flex justify-end mb-6 flex-shrink-0">
        <Box className="flex flex-row items-center gap-4">
          {/* View Mode Selector */}
          <ViewModeSelector
            section="users"
            currentView={viewMode}
            onViewChange={(newView) => {
              setViewMode(newView as ViewMode)
              setUserSelectedView(true)
            }}
          />
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      <Box className="flex-1 min-h-0">
        {viewMode === 'grid' ? (
          <CompanyUsersGridview
            filteredUsers={users}
            loading={loading}
            error={error}
            success={success}
            uiTheme={uiTheme}
            onViewAppointments={handleViewAppointments}
          />
        ) : viewMode === 'list' ? (
          <CompanyUsersListview
            filteredUsers={users}
            loading={loading}
            error={error}
            success={success}
            uiTheme={uiTheme}
            onViewAppointments={handleViewAppointments}
          />
        ) : (
          <CompanyUsersCardview
            filteredUsers={users}
            loading={loading}
            error={error}
            success={success}
            uiTheme={uiTheme}
            onViewAppointments={handleViewAppointments}
          />
        )}
      </Box>
    </Box>
  )
}

export default CompanyUsers
