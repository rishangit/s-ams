import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { ColDef } from 'ag-grid-community'
import CustomGrid from '../../shared/CustomGrid'
import StaffForm from './StaffForm'
import {
  getStaffRequest,
  deleteStaffRequest,
  clearStaffMessages
} from '../../../store/actions/staffActions'
import { useTheme } from '../../../hooks/useTheme'
import { Edit, Delete, Add, People as PeopleIcon } from '@mui/icons-material'
import { Button, Box, Dialog, DialogTitle, DialogContent, IconButton, Tooltip, Typography } from '@mui/material'
import { STAFF_STATUS, getStatusDisplayName } from '../../../constants/staffStatus'

const Staff: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { staff, loading, error, success } = useSelector((state: RootState) => state.staff)
  const { theme } = useTheme()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null)

  // Load staff when component mounts
  useEffect(() => {
    if (user && parseInt(user.role) === 1) {
      dispatch(getStaffRequest())
    }
  }, [user?.role, dispatch])

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

  const columnDefs: ColDef[] = [
    {
      headerName: 'Name',
      field: 'firstName',
      valueGetter: (params) => {
        const data = params.data
        return data ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : ''
      },
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Email',
      field: 'email',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Phone',
      field: 'phoneNumber',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Working Hours',
      field: 'workingHours',
      valueGetter: (params) => {
        const data = params.data
        if (!data) return ''
        const start = data.workingHoursStart || ''
        const end = data.workingHoursEnd || ''
        if (start && end) {
          return `${start} - ${end}`
        } else if (start) {
          return `From ${start}`
        } else if (end) {
          return `Until ${end}`
        }
        return 'Not set'
      },
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Skills',
      field: 'skills',
      valueGetter: (params) => {
        const skills = params.data?.skills
        return skills ? (skills.length > 50 ? skills.substring(0, 50) + '...' : skills) : 'None'
      },
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        const status = params.value
        const isActive = status === STAFF_STATUS.ACTIVE
        const displayName = getStatusDisplayName(status)
        
        // Color mapping for different statuses
        const getStatusColor = (status: number) => {
          switch (status) {
            case STAFF_STATUS.ACTIVE:
              return '#10b981' // Green
            case STAFF_STATUS.INACTIVE:
              return '#6b7280' // Gray
            case STAFF_STATUS.SUSPENDED:
              return '#f59e0b' // Orange
            case STAFF_STATUS.TERMINATED:
              return '#ef4444' // Red
            default:
              return '#6b7280' // Gray
          }
        }
        
        return (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: getStatusColor(status),
              color: 'white'
            }}
          >
            {displayName}
          </span>
        )
      },
      flex: 0.8,
      minWidth: 100
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: any) => {
        const staffId = params.data?.id
        return (
          <Box className="flex gap-1">
            <Tooltip title="Edit Staff Member">
              <IconButton
                size="small"
                onClick={() => handleEditStaff(staffId)}
                style={{ color: theme.primary }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Remove Staff Member">
              <IconButton
                size="small"
                onClick={() => handleDeleteStaff(staffId)}
                style={{ color: '#ef4444' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      filter: false
    }
  ]

  // Show loading while user is being loaded
  if (!user) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: theme.text }}
        >
          Loading user data...
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="h-full md:p-6">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6">
        <PeopleIcon style={{ color: theme.primary, fontSize: 32 }} />
        <Typography
          variant="h6"
          className="text-xl md:text-3xl font-bold"
          style={{ color: theme.text }}
        >
          Staff Members
        </Typography>
      </Box>

      {/* Controls Section - All on the right */}
      <Box className="flex justify-end mb-6">
        <Box className="flex flex-row items-center gap-4">
          {/* Add Button */}
          {user && parseInt(user.role) === 1 && (
            <Button
              variant="contained"
              onClick={handleAddStaff}
              style={{ backgroundColor: theme.primary, color: '#ffffff' }}
              startIcon={<Add />}
              className="w-auto"
            >
              <span>Add Staff Member</span>
            </Button>
          )}
        </Box>
      </Box>

      {/* Staff Grid */}
      <CustomGrid
        title="Staff Members"
        data={staff || []}
        columnDefs={columnDefs}
        loading={loading}
        error={error}
        success={success}
        theme={theme}
        height="calc(100vh - 280px)"
        showTitle={false}
        showAlerts={true}
      />

      {/* Add Staff Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: theme.surface,
            color: theme.text
          }
        }}
      >
        <DialogTitle style={{ color: theme.text }}>
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
            backgroundColor: theme.surface,
            color: theme.text
          }
        }}
      >
        <DialogTitle style={{ color: theme.text }}>
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

