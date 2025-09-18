import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Button,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  ViewComfy as CardViewIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import {
  getAppointmentsRequest,
  updateAppointmentStatusRequest,
  updateAppointmentStatusSuccess,
  deleteAppointmentRequest,
  clearAppointmentsMessages
} from '../../../store/actions/appointmentsActions'
import AppointmentForm from './AppointmentForm'
import StaffAssignmentPopup from './StaffAssignmentPopup'
import AppointmentCompletionPopup from './AppointmentCompletionPopup'
import AppointmentsGridview from './AppointmentsGridview'
import AppointmentsListview from './AppointmentsListview'
import AppointmentsCardview from './AppointmentsCardview'
import { isOwnerRole, isAdminRole, isStaffRole, isUserRole } from '../../../constants/roles'

const Appointments: React.FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const { appointments, loading, error, success } = useSelector((state: RootState) => state.appointments)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)



  const [statusFilter, setStatusFilter] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null)
  const [isStaffAssignmentOpen, setIsStaffAssignmentOpen] = useState(false)
  const [selectedAppointmentForStaff, setSelectedAppointmentForStaff] = useState<any>(null)
  const [isCompletionPopupOpen, setIsCompletionPopupOpen] = useState(false)
  const [selectedAppointmentForCompletion, setSelectedAppointmentForCompletion] = useState<any>(null)

  // Load appointments when component mounts
  useEffect(() => {
    if (user) {
      // Use unified appointments endpoint for all roles
      dispatch(getAppointmentsRequest())
    }
  }, [user?.role, dispatch])

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
    // For company owners confirming appointments, show staff assignment popup
    if (user && isOwnerRole(user.role as any) && newStatus === 'confirmed') {
      // Use the appointment data passed from the row action, or try to find it in state
      const appointment = appointmentData || filteredAppointments?.find(apt => apt.id === appointmentId)
      
      if (appointment) {
        setSelectedAppointmentForStaff(appointment)
        setIsStaffAssignmentOpen(true)
        return
      }
    }
    
    // For company owners completing appointments, show completion popup
    if (user && isOwnerRole(user.role as any) && newStatus === 'completed') {
      // Use the appointment data passed from the row action, or try to find it in state
      const appointment = appointmentData || filteredAppointments?.find(apt => apt.id === appointmentId)
      
      if (appointment) {
        setSelectedAppointmentForCompletion(appointment)
        setIsCompletionPopupOpen(true)
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

  const handleCloseCompletionPopup = () => {
    setIsCompletionPopupOpen(false)
    setSelectedAppointmentForCompletion(null)
  }

  const handleCompletionSuccess = (appointment?: any) => {
    // Update appointment status to completed in state without API call
    const appointmentToUpdate = appointment || selectedAppointmentForCompletion
    if (appointmentToUpdate) {
      const updatedAppointment = {
        ...appointmentToUpdate,
        status: 'completed'
      }
      dispatch(updateAppointmentStatusSuccess(updatedAppointment))
    }
    handleCloseCompletionPopup()
  }

  // Handle view mode change
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }



  // Filter appointments based on status
  const filteredAppointments = useMemo(() => {
    if (!appointments) return []
    if (!statusFilter) return appointments
    return appointments.filter(appointment => appointment.status === statusFilter)
  }, [appointments, statusFilter])


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
          {/* View Switcher */}
          {!isMobile && (
            <Box className="flex items-center gap-1 border rounded-lg p-1" style={{ borderColor: uiTheme.border }}>
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
          )}

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


      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <AppointmentsGridview
          filteredAppointments={filteredAppointments || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onStatusChange={handleStatusChange}
          onEditAppointment={handleEditAppointment}
          onDeleteAppointment={handleDeleteAppointment}
        />
      ) : viewMode === 'list' ? (
        <AppointmentsListview
          filteredAppointments={filteredAppointments || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onStatusChange={handleStatusChange}
          onEditAppointment={handleEditAppointment}
          onDeleteAppointment={handleDeleteAppointment}
        />
      ) : (
        <AppointmentsCardview
          filteredAppointments={filteredAppointments || []}
          loading={loading}
          error={error}
          success={success}
          uiTheme={uiTheme}
          onStatusChange={handleStatusChange}
          onEditAppointment={handleEditAppointment}
          onDeleteAppointment={handleDeleteAppointment}
        />
      )}

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

      {/* Appointment Completion Popup */}
      {selectedAppointmentForCompletion && (
        <AppointmentCompletionPopup
          isOpen={isCompletionPopupOpen}
          onClose={handleCloseCompletionPopup}
          appointment={selectedAppointmentForCompletion}
          onSuccess={handleCompletionSuccess}
        />
      )}
    </Box>
  )
}

export default Appointments