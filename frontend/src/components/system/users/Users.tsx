import React, { useEffect, useState } from 'react'
import {
  Box,
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
import { isAdminOnlyRole } from '../../../constants/roles'
import { useUsers } from '../../../hooks/useUsers'
import UsersListview from './UsersListview'
import UsersCardview from './UsersCardview'
import UsersGridview from './UsersGridview'

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
    <Box className="h-full p-1 sm:p-6">
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
          {!isMobile && (
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
          )}
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <UsersGridview
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