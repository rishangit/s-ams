import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Button,
  Typography,
  Avatar
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import {
  getAppointmentsRequest,
  updateAppointmentStatusRequest,
  deleteAppointmentRequest,
  clearAppointmentsMessages
} from '../../../store/actions/appointmentsActions'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import AppointmentForm from './AppointmentForm'
import StaffAssignmentPopup from './StaffAssignmentPopup'
import { 
  APPOINTMENT_STATUS, 
  getStatusDisplayName, 
  getStatusColor, 
  getNextStatus, 
  getNextStatusLabel, 
  getNextStatusColor 
} from '../../../constants/appointmentStatus'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { isOwnerRole, isAdminRole, isStaffRole, isUserRole } from '../../../constants/roles'

const Appointments: React.FC = () => {
  const dispatch = useDispatch()
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const { appointments, loading, error, success } = useSelector((state: RootState) => state.appointments)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)



  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null)
  const [isStaffAssignmentOpen, setIsStaffAssignmentOpen] = useState(false)
  const [selectedAppointmentForStaff, setSelectedAppointmentForStaff] = useState<any>(null)

  // Load appointments when component mounts
  useEffect(() => {
    if (user) {
      // Use unified appointments endpoint for all roles
      dispatch(getAppointmentsRequest())
    }
  }, [user?.role, dispatch])

  // Clear error and success messages after 3 seconds and refresh grid on success
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearAppointmentsMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success, dispatch])

  const handleStatusChange = (appointmentId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled', appointmentData?: any) => {
    // For company owners (role 1) confirming appointments, show staff assignment popup
    if (user && isOwnerRole(user.role as any) && newStatus === 'confirmed') {
      // Use the appointment data passed from the row action, or try to find it in state
      const appointment = appointmentData || filteredAppointments?.find(apt => apt.id === appointmentId)
      
      if (appointment) {
        setSelectedAppointmentForStaff(appointment)
        setIsStaffAssignmentOpen(true)
        return
      }
    }
    
    // For other cases, update status directly
    dispatch(updateAppointmentStatusRequest({ id: appointmentId, status: newStatus }))
  }

  const handleDeleteAppointment = (appointmentId: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      dispatch(deleteAppointmentRequest(appointmentId))
    }
  }


  const handleEditAppointment = (appointmentId: number) => {
    setEditingAppointmentId(appointmentId)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingAppointmentId(null)
    // No need to refresh - Redux automatically updates the state
  }

  const handleAddAppointment = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    // No need to refresh - Redux automatically updates the state
  }

  const handleCloseStaffAssignment = () => {
    setIsStaffAssignmentOpen(false)
    setSelectedAppointmentForStaff(null)
  }

  const handleStaffAssignmentSuccess = () => {
    // No need to refresh - Redux epic and slice automatically update the appointment in state
    // The appointment will be updated in the grid without a full page refresh
  }

  // Helper function to convert status to number
  const getStatusId = (status: string | number): number => {
    if (typeof status === 'number') return status
    switch (status) {
      case 'pending': return APPOINTMENT_STATUS.PENDING
      case 'confirmed': return APPOINTMENT_STATUS.CONFIRMED
      case 'completed': return APPOINTMENT_STATUS.COMPLETED
      case 'cancelled': return APPOINTMENT_STATUS.CANCELLED
      default: return APPOINTMENT_STATUS.PENDING
    }
  }

  // User Avatar Cell Renderer
  const UserAvatarCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    const userName = data?.userName || 'Unknown User'
    const userProfileImage = data?.userProfileImage
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, padding: '12px 0', height: '100%' }}>
        <Avatar
          sx={{ width: 32, height: 32, backgroundColor: '#1976d2' }}
          src={getProfileImageUrl(userProfileImage)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            console.error('User Avatar image failed to load:', target.src)
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
            {userName.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2)}
          </span>
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: '500' }}>
          {userName}
        </Typography>
      </Box>
    )
  }


  // Filter appointments based on status
  const filteredAppointments = useMemo(() => {
    if (!appointments) return []
    if (!statusFilter) return appointments
    return appointments.filter(appointment => appointment.status === statusFilter)
  }, [appointments, statusFilter])

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props

    const statusId = getStatusId(value)
    const displayName = getStatusDisplayName(statusId)
    const statusColor = getStatusColor(statusId)

    return (
      <Box sx={{ padding: '12px 0', height: '100%', display: 'flex', alignItems: 'center' }}>
        <Chip
          label={displayName}
          size="small"
          style={{
            backgroundColor: statusColor,
            color: '#fff',
            fontWeight: 'bold'
          }}
        />
      </Box>
    )
  }

  // Row Actions Configuration
  const rowActions = useMemo<RowAction[]>(() => {
    const isAdmin = user && isAdminRole(user.role as any)
    const isOwner = user && isOwnerRole(user.role as any)

    const actions: RowAction[] = []

    // Add dynamic next status action for admin/owner (first)
    if (isAdmin || isOwner) {
      actions.push({
        id: 'nextStatus',
        label: (rowData) => {
          const statusId = getStatusId(rowData.status)
          return getNextStatusLabel(statusId)
        },
        icon: <CheckCircle fontSize="small" />,
        onClick: (rowData) => {
          const statusId = getStatusId(rowData.status)
          const nextStatus = getNextStatus(statusId)
          if (nextStatus !== null) {
            const nextStatusName = nextStatus === APPOINTMENT_STATUS.CONFIRMED ? 'confirmed' : 'completed'
            handleStatusChange(rowData.id, nextStatusName as 'confirmed' | 'completed', rowData)
          }
        },
        color: (rowData) => {
          const statusId = getStatusId(rowData.status)
          return getNextStatusColor(statusId)
        },
        disabled: (rowData) => {
          const statusId = getStatusId(rowData.status)
          return statusId === APPOINTMENT_STATUS.COMPLETED || statusId === APPOINTMENT_STATUS.CANCELLED
        }
      })
    }

    // Add Edit Appointment (second)
    actions.push({
      id: 'edit',
      label: 'Edit Appointment',
      icon: <EditIcon fontSize="small" />,
      onClick: (rowData) => handleEditAppointment(rowData.id),
      color: 'primary'
    })

    actions.push({
      id: 'delete',
      label: 'Delete Appointment',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (rowData) => handleDeleteAppointment(rowData.id),
      color: 'error'
    })

    return actions
  }, [user])

  // Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: 'Date',
        field: 'appointmentDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        resizable: true,
        width: 120,
        minWidth: 100
      },
      {
        headerName: 'Time',
        field: 'appointmentTime',
        sortable: true,
        filter: true,
        resizable: true,
        width: 100,
        minWidth: 80
      },
      {
        headerName: 'Service',
        field: 'serviceName',
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          const serviceName = params.value || 'Unknown Service'
          const servicePrice = params.data?.servicePrice
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '12px 0', height: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {serviceName}
              </Typography>
              {servicePrice && (
                <Typography variant="caption" sx={{ color: '#666' }}>
                  ${servicePrice}
                </Typography>
              )}
            </Box>
          )
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: StatusCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 120,
        minWidth: 100
      },
      {
        headerName: 'Staff Assignment',
        field: 'staffAssignment',
        cellRenderer: (params: ICellRendererParams) => {
          const data = params.data
          const staffId = data?.staffId
          const staffPreferences = data?.staffPreferences
          const staffName = data?.staffName
          const staffProfileImage = data?.staffProfileImage
          
          if (staffId && staffName) {
            // Staff is assigned - show avatar
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, padding: '12px 0', height: '100%' }}>
                <Avatar
                  sx={{ width: 32, height: 32, backgroundColor: '#10b981' }}
                  src={getProfileImageUrl(staffProfileImage)}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    console.error('Staff Avatar image failed to load:', target.src)
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
                    {staffName.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2)}
                  </span>
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {staffName}
                </Typography>
              </Box>
            )
          } else if (staffPreferences && staffPreferences.length > 0) {
            // Has preferred staff but not assigned
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '12px 0', height: '100%' }}>
                <ScheduleIcon sx={{ color: 'orange', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: 'orange' }}>
                  {staffPreferences.length} preferred
                </Typography>
              </Box>
            )
          } else {
            // No staff preferences
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '12px 0', height: '100%' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  No staff
                </Typography>
              </Box>
            )
          }
        },
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 180
      }
    ]

    // Add role-specific columns
    if (user && isAdminRole(user.role as any)) {
      // Admin sees all columns
      baseColumns.unshift(
        {
          headerName: 'Customer',
          field: 'userName',
          cellRenderer: UserAvatarCellRenderer,
          sortable: true,
          filter: true,
          resizable: true,
          width: 200,
          minWidth: 180
        },
        {
          headerName: 'Company',
          field: 'companyName',
          sortable: true,
          filter: true,
          resizable: true,
          width: 150,
          minWidth: 120
        }
      )
    } else if (user && isOwnerRole(user.role as any)) {
      // Company owner sees user column
      baseColumns.unshift({
        headerName: 'Customer',
        field: 'userName',
        cellRenderer: UserAvatarCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 180
      })
    } else if (user && isStaffRole(user.role as any)) {
      // Staff member sees customer and company columns
      baseColumns.unshift(
        {
          headerName: 'Customer',
          field: 'userName',
          cellRenderer: UserAvatarCellRenderer,
          sortable: true,
          filter: true,
          resizable: true,
          width: 200,
          minWidth: 180
        },
        {
          headerName: 'Company',
          field: 'companyName',
          sortable: true,
          filter: true,
          resizable: true,
          width: 150,
          minWidth: 120
        }
      )
    } else if (user && isUserRole(user.role as any)) {
      // Regular user sees company column
      baseColumns.unshift({
        headerName: 'Company',
        field: 'companyName',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        minWidth: 120
      })
    }

    // Add common columns
    baseColumns.push(
      {
        headerName: 'Notes',
        field: 'notes',
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => (
          <Box sx={{ padding: '12px 0', height: '100%', display: 'flex', alignItems: 'center' }}>
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              maxWidth: '100%'
            }}>
              {params.value || 'No notes'}
            </span>
          </Box>
        )
      },
      {
        headerName: 'Created',
        field: 'createdAt',
        sortable: true,
        filter: 'agDateColumnFilter',
        resizable: true,
        width: 120,
        minWidth: 100,
        valueGetter: (params) => new Date(params.data.createdAt).toLocaleDateString()
      }
    )

    return baseColumns
  }, [user, uiTheme])

  // Show loading while user is being loaded
  if (authLoading || !user) {
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

  return (
    <Box className="h-full md:p-6">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6">
        <ScheduleIcon style={{ color: uiTheme.primary, fontSize: 32 }} />
        <Typography
          variant="h6"
          className="text-xl md:text-3xl font-bold"
          style={{ color: uiTheme.text }}
        >
          Appointments
        </Typography>
      </Box>

      {/* Controls Section - All on the right */}
      <Box className="flex justify-end mb-6">
        <Box className="flex flex-row items-center gap-4">
          {/* Status Filter */}
          <FormControl size="small" style={{ minWidth: 120 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

          {/* Add Button */}
          {user && (isAdminRole(user.role as any) || isOwnerRole(user.role as any) || isStaffRole(user.role as any) || isUserRole(user.role as any)) && (
            <Button
              variant="contained"
              onClick={handleAddAppointment}
              style={{ backgroundColor: uiTheme.primary, color: '#ffffff' }}
              startIcon={<AddIcon />}
              className="w-auto"
            >
              <span>Book Appointment</span>
            </Button>
          )}
        </Box>
      </Box>


      <CustomGrid
        title="Appointments"
        data={filteredAppointments || []}
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

      {/* Add Appointment Modal */}
      <AppointmentForm
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        appointmentId={null}
      />

      {/* Edit Appointment Modal */}
      <AppointmentForm
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        appointmentId={editingAppointmentId}
      />

      {/* Staff Assignment Popup */}
      {selectedAppointmentForStaff && (
        <StaffAssignmentPopup
          isOpen={isStaffAssignmentOpen}
          onClose={handleCloseStaffAssignment}
          appointment={selectedAppointmentForStaff}
          onSuccess={handleStaffAssignmentSuccess}
        />
      )}
    </Box>
  )
}

export default Appointments