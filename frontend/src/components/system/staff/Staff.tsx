import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { ViewSwitcher, ViewMode } from '../../shared'
import { useViewMode } from '../../../hooks/useViewMode'
import ViewModeSelector from '../../shared/ViewModeSelector'
import StaffForm from './StaffForm'
import StaffGridview from './StaffGridview'
import StaffListview from './StaffListview'
import StaffCardview from './StaffCardview'
import {
  getStaffRequest,
  deleteStaffRequest,
  clearStaffMessages
} from '../../../store/actions/staffActions'
import { useTheme } from '../../../hooks/useTheme'
import { Add, People as PeopleIcon } from '@mui/icons-material'
import { Button, Box, Dialog, DialogTitle, DialogContent, Typography, useMediaQuery } from '@mui/material'

const Staff: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { staff, loading, error, success } = useSelector((state: RootState) => state.staff)
  const { theme: uiTheme } = useTheme()
  const { staffView } = useViewMode()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<ViewMode>(staffView as ViewMode)
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null)

  // Load staff when component mounts
  useEffect(() => {
    if (user && parseInt(String(user.role)) === 1) {
      dispatch(getStaffRequest())
    }
  }, [user?.role, dispatch])

  // Sync view mode with user settings
  useEffect(() => {
    if (staffView && !userSelectedView) {
      setViewMode(staffView as ViewMode)
    }
  }, [staffView, userSelectedView])

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
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearStaffMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success, dispatch])

  const handleDeleteStaff = (staffId: number) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      dispatch(deleteStaffRequest(staffId))
    }
  }

  const handleEditStaff = (staffId: number) => {
    setEditingStaffId(staffId)
    setIsEditModalOpen(true)
  }

  const handleAddStaff = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseModals = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setEditingStaffId(null)
  }



  // Show loading while user is being loaded
  if (!user) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: uiTheme.text }}
        >
          Loading user data...
        </Typography>
      </Box>
    )
  }

  // Show access denied if user is not a company owner
  if (parseInt(String(user.role)) !== 1) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: uiTheme.text }}
        >
          Access denied. This page is only available for company owners.
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
          Staff Members
        </Typography>
      </Box>

      {/* Controls Section - All on the right */}
      <Box className="flex justify-end mb-6 flex-shrink-0">
        <Box className="flex flex-row items-center gap-4">
          {/* View Mode Selector */}
          <ViewModeSelector
            section="staff"
            currentView={viewMode}
            onViewChange={(newView) => {
              setViewMode(newView as ViewMode)
              setUserSelectedView(true)
            }}
          />

          {/* Add Button */}
          <Button
            variant="contained"
            onClick={handleAddStaff}
            style={{ backgroundColor: uiTheme.primary, color: '#ffffff' }}
            startIcon={<Add />}
            className="w-auto"
          >
            <span>Add Staff Member</span>
          </Button>
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      <Box className="flex-1 min-h-0">
        {viewMode === 'grid' ? (
          <StaffGridview
            filteredStaff={staff || []}
            loading={loading}
            error={error}
            success={success}
            uiTheme={uiTheme}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        ) : viewMode === 'list' ? (
          <StaffListview
            filteredStaff={staff || []}
            loading={loading}
            error={error}
            success={success}
            uiTheme={uiTheme}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        ) : (
          <StaffCardview
            filteredStaff={staff || []}
            loading={loading}
            error={error}
            success={success}
            uiTheme={uiTheme}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        )}
      </Box>

      {/* Add Staff Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: uiTheme.surface,
            color: uiTheme.text
          }
        }}
      >
        <DialogTitle style={{ color: uiTheme.text }}>
          Add New Staff Member
        </DialogTitle>
        <DialogContent>
          <StaffForm
            onClose={handleCloseModals}
            onSuccess={() => {
              handleCloseModals()
              dispatch(getStaffRequest()) // Refresh the list
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Staff Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: uiTheme.surface,
            color: uiTheme.text
          }
        }}
      >
        <DialogTitle style={{ color: uiTheme.text }}>
          Edit Staff Member
        </DialogTitle>
        <DialogContent>
          <StaffForm
            staffId={editingStaffId}
            onClose={handleCloseModals}
            onSuccess={() => {
              handleCloseModals()
              dispatch(getStaffRequest()) // Refresh the list
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Staff

