import React, { useEffect, useState } from 'react'
import {
  Box,
  useMediaQuery
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { isAdminOnlyRole } from '../../../constants/roles'
import { ViewSwitcher, ViewMode } from '../../../components/shared'
import { useViewMode } from '../../../hooks/useViewMode'
import ViewModeSelector from '../../../components/shared/ViewModeSelector'
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
  const { usersView } = useViewMode()
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

  const [viewMode, setViewMode] = useState<ViewMode>(usersView as ViewMode)
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)

  useEffect(() => {
    if (currentUser && isAdminOnlyRole(currentUser.role as any)) {
      fetchAllUsers()
    }
  }, [fetchAllUsers, currentUser])

  // Sync view mode with user settings
  useEffect(() => {
    if (usersView && !userSelectedView) {
      setViewMode(usersView as ViewMode)
    }
  }, [usersView, userSelectedView])

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



  // User action handlers
  const handleViewUser = (_userId: number) => {
    // TODO: Implement view user functionality
  }

  const handleEditUser = (_userId: number) => {
    // TODO: Implement edit user functionality
  }

  const handleDeleteUser = (_userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
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