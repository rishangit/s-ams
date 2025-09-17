import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material'
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as CardViewIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { getRoleDisplayName, isAdminOnlyRole } from '../../../constants/roles'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { useUsers } from '../../../hooks/useUsers'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material'
import UsersListview from './UsersListview'
import UsersCardview from './UsersCardview'

// interface User {
//   id: number
//   firstName: string
//   lastName: string
//   email: string
//   phoneNumber?: string
//   role: number
//   profileImage?: string
//   createdAt: string
//   updatedAt: string
// }

const Users: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { 
    users, 
    loading, 
    error, 
    success, 
    fetchAllUsers, 
    clearError, 
    clearSuccess 
  } = useUsers()

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)

  useEffect(() => {
    if (currentUser && isAdminOnlyRole(currentUser.role as any)) {
      fetchAllUsers()
    }
  }, [fetchAllUsers, currentUser])

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
        clearError()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearSuccess()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, clearSuccess])

  const getRoleColor = (role: number) => {
    switch (role) {
      case 0: // Admin
        return '#d32f2f' // Red
      case 1: // Owner
        return '#1976d2' // Blue
      case 2: // Staff
        return '#388e3c' // Green
      case 3: // User
        return '#f57c00' // Orange
      default:
        return '#757575' // Grey
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Handle view mode change
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }

  // User action handlers
  const handleViewUser = (userId: number) => {
    console.log('View user:', userId)
    // TODO: Implement view user functionality
  }

  const handleEditUser = (userId: number) => {
    console.log('Edit user:', userId)
    // TODO: Implement edit user functionality
  }

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user:', userId)
      // TODO: Implement delete user functionality
    }
  }

  // User Cell Renderer Component
  const UserCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    return (
      <Box className="flex items-center gap-3">
        <Avatar
          className="w-10 h-10 border-2 border-white shadow-sm"
          style={{ backgroundColor: uiTheme.primary }}
          src={getProfileImageUrl(data.profileImage)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            console.error('User Avatar image failed to load:', target.src)
            console.error('User profile image path:', data.profileImage)
          }}
        >
          <span className="text-white font-semibold text-sm">
            {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
          </span>
        </Avatar>
        <Box>
          <div className="font-semibold text-sm" style={{ color: uiTheme.text }}>
            {data.firstName} {data.lastName}
          </div>
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
            ID: {data.id}
          </div>
        </Box>
      </Box>
    )
  }

  // Role Cell Renderer Component
  const RoleCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    return (
      <Chip
        label={getRoleDisplayName(value as any)}
        size="small"
        style={{
          backgroundColor: getRoleColor(value),
          color: '#ffffff',
          fontWeight: 'bold'
        }}
      />
    )
  }

  // Row Actions Configuration
  const rowActions = useMemo<RowAction[]>(() => {
    const actions: RowAction[] = [
      {
        id: 'view',
        label: 'View User',
        icon: <ViewIcon fontSize="small" />,
        onClick: (rowData) => handleViewUser(rowData.id),
        color: 'primary'
      },
      {
        id: 'edit',
        label: 'Edit User',
        icon: <EditIcon fontSize="small" />,
        onClick: (rowData) => handleEditUser(rowData.id),
        color: 'info'
      },
      {
        id: 'delete',
        label: 'Delete User',
        icon: <DeleteIcon fontSize="small" />,
        onClick: (rowData) => handleDeleteUser(rowData.id),
        color: 'error',
        disabled: (rowData) => rowData.id === currentUser?.id // Can't delete self
      }
    ]

    return actions
  }, [currentUser])



  // Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'User',
      field: 'firstName',
      cellRenderer: UserCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200
    },
    {
      headerName: 'Email',
      field: 'email',
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150
    },
    {
      headerName: 'Phone',
      field: 'phoneNumber',
      sortable: true,
      filter: true,
      resizable: true,
      width: 150,
      minWidth: 120,
      valueGetter: (params) => params.data.phoneNumber || 'N/A'
    },
    {
      headerName: 'Role',
      field: 'role',
      cellRenderer: RoleCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100
    },

    {
      headerName: 'Created',
      field: 'createdAt',
      sortable: true,
      filter: true,
      resizable: true,
      width: 150,
      minWidth: 120,
      valueGetter: (params) => formatDate(params.data.createdAt)
    }
  ], [uiTheme, currentUser])

  // Access control check
  if (!currentUser || !isAdminOnlyRole(currentUser.role as any)) {
    return (
      <Box className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold" style={{ color: uiTheme.text }}>
          Access Denied. Admin privileges required.
        </div>
      </Box>
    )
  }

  return (
    <Box className="h-full p-6">
      {/* Header Section */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <h1 className="text-2xl font-bold" style={{ color: uiTheme.text }}>
            Users Management
          </h1>
          <p className="text-sm" style={{ color: uiTheme.textSecondary }}>
            Manage system users and their roles
          </p>
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

      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <CustomGrid
          title="Users Management"
          data={users || []}
          columnDefs={columnDefs}
          loading={loading}
          error={error}
          success={success}
          theme={uiTheme}
          height="calc(100vh - 200px)"
          showTitle={false}
          showAlerts={true}
          rowActions={rowActions}
        />
      ) : viewMode === 'list' ? (
        <UsersListview
          filteredUsers={users || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          currentUserId={currentUser?.id}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      ) : (
        <UsersCardview
          filteredUsers={users || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          currentUserId={currentUser?.id}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </Box>
  )
}

export default Users 