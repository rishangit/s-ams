import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { ColDef } from 'ag-grid-community'
import CustomGrid from '../../shared/CustomGrid'
import CompanyUsersListview from './CompanyUsersListview'
import CompanyUsersCardview from './CompanyUsersCardview'
import { Box, Typography, Chip, Avatar, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import { Visibility as ViewIcon, ViewModule as GridViewIcon, ViewList as ListViewIcon, ViewComfy as CardViewIcon } from '@mui/icons-material'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { getRoleDisplayName } from '../../../constants/roles'
import { format } from 'date-fns'
import { apiService } from '../../../services/api'
import { RowAction } from '../../shared/RowActionsMenu'

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

  // Column definitions for the grid
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Name',
      field: 'name',
      width: 250,
      valueGetter: (params: any) => {
        const user = params.data as CompanyUser
        return `${user.firstName} ${user.lastName}`
      },
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center gap-3">
            <Avatar
              src={getProfileImageUrl(user.profileImage)}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 40, height: 40 }}
            />
            <Box className="flex flex-col">
              <Typography variant="body2" className="font-medium">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {getRoleDisplayName(user.role as any)}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 250,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2" className="truncate">
            {user.email}
          </Typography>
        )
      }
    },
    {
      headerName: 'Phone',
      field: 'phoneNumber',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {user.phoneNumber || 'N/A'}
          </Typography>
        )
      }
    },
    {
      headerName: 'Total Appointments',
      field: 'totalAppointments',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Chip
            label={user.totalAppointments}
            size="small"
            color="primary"
            variant="outlined"
          />
        )
      }
    },
    {
      headerName: 'First Appointment',
      field: 'firstAppointmentDate',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {user.firstAppointmentDate 
              ? format(new Date(user.firstAppointmentDate), 'MMM dd, yyyy')
              : 'N/A'
            }
          </Typography>
        )
      }
    },
    {
      headerName: 'Last Appointment',
      field: 'lastAppointmentDate',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {user.lastAppointmentDate 
              ? format(new Date(user.lastAppointmentDate), 'MMM dd, yyyy')
              : 'N/A'
            }
          </Typography>
        )
      }
    },
    {
      headerName: 'Member Since',
      field: 'createdAt',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
          </Typography>
        )
      }
    }
  ], [])

  // Handle view mode change
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }

  // Handle view appointments
  const handleViewAppointments = (userId: number) => {
    navigate(`/system/company-users/${userId}`)
  }

  // Row Actions Configuration
  const rowActions = useMemo<RowAction[]>(() => [
    {
      id: 'viewAppointments',
      label: 'View All Appointments',
      icon: <ViewIcon fontSize="small" />,
      onClick: (rowData: CompanyUser) => handleViewAppointments(rowData.id),
      color: 'primary'
    }
  ], [])

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
        <CustomGrid
          title="Company Users"
          data={users}
          columnDefs={columnDefs}
          loading={loading}
          error={error}
          success={success}
          theme={uiTheme}
          height="calc(100vh - 280px)"
          showTitle={false}
          showAlerts={true}
          rowActions={rowActions}
          rowHeight={70}
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
