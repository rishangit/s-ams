import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Button,
  Typography
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
import { CustomGrid } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import AppointmentForm from './AppointmentForm'

const Appointments: React.FC = () => {
  const dispatch = useDispatch()
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const { appointments, loading, error, success } = useSelector((state: RootState) => state.appointments)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)



  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null)

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

  const handleStatusChange = (appointmentId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
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

  // Filter appointments based on status
  const filteredAppointments = useMemo(() => {
    if (!appointments) return []
    if (!statusFilter) return appointments
    return appointments.filter(appointment => appointment.status === statusFilter)
  }, [appointments, statusFilter])

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props

    // Convert integer status to string if needed
    const getStatusString = (status: any) => {
      if (typeof status === 'number') {
        switch (status) {
          case 0: return 'pending'
          case 1: return 'confirmed'
          case 2: return 'completed'
          case 3: return 'cancelled'
          default: return 'pending'
        }
      }
      return status || 'pending'
    }

    const statusString = getStatusString(value)

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return '#f59e0b'    // Orange
        case 'confirmed': return '#3b82f6'  // Blue
        case 'completed': return '#10b981'  // Green
        case 'cancelled': return '#ef4444'  // Red
        default: return '#6b7280'
      }
    }

    return (
      <Chip
        label={statusString?.charAt(0).toUpperCase() + statusString?.slice(1)}
        size="small"
        style={{
          backgroundColor: getStatusColor(statusString),
          color: '#fff',
          fontWeight: 'bold'
        }}
      />
    )
  }

  // Actions Cell Renderer Component
  const ActionsCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    const isAdmin = user && parseInt(user.role) === 0
    const isOwner = user && parseInt(user.role) === 1

    return (
      <Box className="flex gap-1">
        <Tooltip title="Edit Appointment">
          <IconButton
            size="small"
            onClick={() => handleEditAppointment(data.id)}
            style={{ color: uiTheme.primary }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {(isAdmin || isOwner) && data.status === 'pending' && (
          <Tooltip title="Confirm Appointment">
            <IconButton
              size="small"
              onClick={() => handleStatusChange(data.id, 'confirmed')}
              style={{ color: '#10b981' }}
            >
              <CheckCircle fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {(isAdmin || isOwner) && data.status === 'confirmed' && (
          <Tooltip title="Mark as Completed">
            <IconButton
              size="small"
              onClick={() => handleStatusChange(data.id, 'completed')}
              style={{ color: '#3b82f6' }}
            >
              <CheckCircle fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Delete Appointment">
          <IconButton
            size="small"
            onClick={() => handleDeleteAppointment(data.id)}
            style={{ color: '#ef4444' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

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
            <Box>
              <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                {serviceName}
              </Typography>
              {servicePrice && (
                <Typography variant="caption" style={{ color: '#666' }}>
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
          
          if (staffId && staffName) {
            // Staff is assigned
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'green', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: 'green' }}>
                  {staffName}
                </Typography>
              </Box>
            )
          } else if (staffPreferences && staffPreferences.length > 0) {
            // Has preferred staff but not assigned
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ color: 'orange', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: 'orange' }}>
                  {staffPreferences.length} preferred
                </Typography>
              </Box>
            )
          } else {
            // No staff preferences
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        width: 150,
        minWidth: 120
      }
    ]

    // Add role-specific columns
    if (user && parseInt(user.role) === 0) {
      // Admin sees all columns
      baseColumns.unshift(
        {
          headerName: 'User',
          field: 'userName',
          sortable: true,
          filter: true,
          resizable: true,
          width: 150,
          minWidth: 120
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
    } else if (user && parseInt(user.role) === 1) {
      // Company owner sees user column
      baseColumns.unshift({
        headerName: 'Customer',
        field: 'userName',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        minWidth: 120
      })
    } else if (user && parseInt(user.role) === 2) {
      // Staff member sees customer and company columns
      baseColumns.unshift(
        {
          headerName: 'Customer',
          field: 'userName',
          sortable: true,
          filter: true,
          resizable: true,
          width: 150,
          minWidth: 120
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
    } else if (user && parseInt(user.role) === 3) {
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
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
            maxWidth: '100%'
          }}>
            {params.value || 'No notes'}
          </span>
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
      },
      {
        headerName: 'Actions',
        field: 'actions',
        cellRenderer: ActionsCellRenderer,
        sortable: false,
        filter: false,
        resizable: false,
        width: 150,
        minWidth: 150
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
          {user && (parseInt(user.role) === 0 || parseInt(user.role) === 1 || parseInt(user.role) === 2 || parseInt(user.role) === 3) && (
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
    </Box>
  )
}

export default Appointments