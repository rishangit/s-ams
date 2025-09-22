import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Add as AddIcon,
  Schedule as ScheduleIcon
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
import { ViewSwitcher, ViewMode } from '../../../components/shared'
import { useViewMode } from '../../../hooks/useViewMode'
import ViewModeSelector from '../../../components/shared/ViewModeSelector'
import { getUserSettingsRequest } from '../../../store/actions/userSettingsActions'

const Appointments: React.FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const { appointments, loading, error, success } = useSelector((state: RootState) => state.appointments)
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.userSettings)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { appointmentsView } = useViewMode()

  const [viewMode, setViewMode] = useState<ViewMode>('grid') // Default, will be updated when settings load
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)
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
      
      // Load user settings if not already loaded
      if (!settings && !settingsLoading) {
        dispatch(getUserSettingsRequest())
      }
    }
  }, [user?.role, dispatch, settings, settingsLoading])

  // Sync view mode with user settings
  useEffect(() => {
    // Only update if settings are loaded and user hasn't manually selected a view
    if (settings && !settingsLoading && !userSelectedView && !settingsLoaded) {
      setViewMode(appointmentsView as ViewMode)
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoading, appointmentsView, userSelectedView, settingsLoaded])

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




  // Filter appointments based on status
  const filteredAppointments = useMemo(() => {
    if (!appointments) return []
    return appointments
  }, [appointments])


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
    <Box className="flex flex-col h-full">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6 flex-shrink-0">
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
      <Box className="flex justify-end mb-6 flex-shrink-0">
        <Box className="flex flex-row items-center gap-4">
          {/* View Mode Selector */}
          <ViewModeSelector
            section="appointments"
            currentView={viewMode}
            onViewChange={(newView) => {
              setViewMode(newView as ViewMode)
              setUserSelectedView(true)
            }}
          />

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
      <Box className="flex-1 min-h-0">
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
      </Box>

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