import React, { useEffect, useMemo } from 'react'
import {
  Box,
  Avatar,
  Chip,
  // IconButton,
  // Tooltip
} from '@mui/material'
// import {
//   Refresh as RefreshIcon
// } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { getRoleDisplayName, isAdminOnlyRole } from '../../../constants/roles'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { useUsers } from '../../../hooks/useUsers'
import { CustomGrid } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'

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
  const { 
    users, 
    loading, 
    error, 
    success, 
    fetchAllUsers, 
    clearError, 
    clearSuccess 
  } = useUsers()

  useEffect(() => {
    if (currentUser && isAdminOnlyRole(currentUser.role as any)) {
      fetchAllUsers()
    }
  }, [fetchAllUsers, currentUser])

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
      <CustomGrid
        title="Users Management"
        data={users || []}
        columnDefs={columnDefs}
        loading={loading}
        error={error}
        success={success}
        theme={uiTheme}
        height="calc(100vh - 120px)"
        showTitle={true}
        showAlerts={true}
      />
    </Box>
  )
}

export default Users 