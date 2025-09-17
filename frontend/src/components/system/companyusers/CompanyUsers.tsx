import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import CompanyUsersGridview from './CompanyUsersGridview'
import CompanyUsersListview from './CompanyUsersListview'
import CompanyUsersCardview from './CompanyUsersCardview'
import { Box, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import { ViewModule as GridViewIcon, ViewList as ListViewIcon, ViewComfy as CardViewIcon } from '@mui/icons-material'
import { apiService } from '../../../services/api'

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
  
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
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
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
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
    <Box className="h-full flex flex-col">
      {/* Header Section */}
      <Box className="mb-6">
        <Box className="flex items-center justify-between mb-4">
          <Box>
            <Typography 
              variant="h4" 
              className="font-bold mb-2"
              style={{ color: uiTheme.text }}
            >
              Company Users
            </Typography>
            <Typography 
              variant="body1"
              style={{ color: uiTheme.textSecondary }}
            >
              View all users who have received services from your company
            </Typography>
          </Box>
          
          {/* View Switcher */}
          <Box className="flex items-center gap-1 border rounded-lg p-1" style={{ borderColor: uiTheme.border }}>
            {!isMobile && (
              <Tooltip title="Grid View">
                <IconButton
                  size="small"
                  onClick={() => handleViewModeChange('grid')}
                  style={{
                    backgroundColor: viewMode === 'grid' ? uiTheme.primary : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : uiTheme.text
                  }}
                >
                  <GridViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {!isMobile && (
              <Tooltip title="List View">
                <IconButton
                  size="small"
                  onClick={() => handleViewModeChange('list')}
                  style={{
                    backgroundColor: viewMode === 'list' ? uiTheme.primary : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : uiTheme.text
                  }}
                >
                  <ListViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Card View">
              <IconButton
                size="small"
                onClick={() => handleViewModeChange('card')}
                style={{
                  backgroundColor: viewMode === 'card' ? uiTheme.primary : 'transparent',
                  color: viewMode === 'card' ? '#ffffff' : uiTheme.text
                }}
              >
                <CardViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
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
  )
}

export default CompanyUsers
