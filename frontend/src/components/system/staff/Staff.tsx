import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { CustomGrid, RowAction } from '../../shared'
import StaffForm from './StaffForm'
import {
  getStaffRequest,
  deleteStaffRequest,
  clearStaffMessages
} from '../../../store/actions/staffActions'
import { useTheme } from '../../../hooks/useTheme'
import { Edit, Delete, Add, People as PeopleIcon } from '@mui/icons-material'
import { Button, Box, Dialog, DialogTitle, DialogContent, Typography, Avatar } from '@mui/material'
import { STAFF_STATUS, getStatusDisplayName } from '../../../constants/staffStatus'
import { getProfileImageUrl } from '../../../utils/fileUtils'

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
    if (user && parseInt(String(user.role)) === 1) {
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

  // Staff Cell Renderer Component
  const StaffCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    return (
      <Box className="flex items-center gap-3">
        <Avatar
          className="w-10 h-10 border-2 border-white shadow-sm"
          style={{ backgroundColor: theme.primary }}
          src={getProfileImageUrl(data.profileImage)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            console.error('Staff Avatar image failed to load:', target.src)
            console.error('Staff profile image path:', data.profileImage)
          }}
        >
          <span className="text-white font-semibold text-sm">
            {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
          </span>
        </Avatar>
        <Box>
          <div className="font-semibold text-sm" style={{ color: theme.text }}>
            {data.firstName} {data.lastName}
          </div>
          <div className="text-xs" style={{ color: theme.textSecondary }}>
            ID: {data.id}
          </div>
        </Box>
      </Box>
    )
  }

  // Row Actions Configuration
  const rowActions: RowAction[] = [
    {
      id: 'edit',
      label: 'Edit Staff',
      icon: <Edit fontSize="small" />,
      onClick: (rowData) => handleEditStaff(rowData.id),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Staff',
      icon: <Delete fontSize="small" />,
      onClick: (rowData) => handleDeleteStaff(rowData.id),
      color: 'error'
    }
  ]

  const columnDefs: ColDef[] = [
    {
      headerName: 'Staff Member',
      field: 'firstName',
      cellRenderer: StaffCellRenderer,
      flex: 1,
      minWidth: 200
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
          {user && parseInt(String(user.role)) === 1 && (
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
        rowActions={rowActions}
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

