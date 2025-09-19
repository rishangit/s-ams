import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import CompanyUsersGridview from './CompanyUsersGridview'
import CompanyUsersListview from './CompanyUsersListview'
import CompanyUsersCardview from './CompanyUsersCardview'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { People as PeopleIcon } from '@mui/icons-material'
import { apiService } from '../../../services/api'
import { ViewSwitcher, ViewMode } from '../../../components/shared'

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
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
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
    }
  }, [user])

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
          {/* View Switcher */}
          <ViewSwitcher
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            theme={uiTheme}
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
