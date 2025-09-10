import React, { useEffect, useState, useMemo, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  Event as EventIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import {
  getAppointmentsByUserRequest,
  getAppointmentsByCompanyRequest,
  getAllAppointmentsRequest
} from '../../../store/actions/appointmentsActions'
import AppointmentForm from './AppointmentForm'
import { CalendarEventTooltip } from '../../shared'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  extendedProps: {
    appointmentId: number
    userName: string | undefined
    companyName: string | undefined
    serviceName: string | undefined
    servicePrice: number | undefined
    status: string
    notes?: string
  }
}

const CalendarView: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { appointments, loading, error } = useSelector((state: RootState) => state.appointments)
  const theme = useSelector((state: RootState) => state.ui.theme)
  const isDarkMode = useSelector((state: RootState) => state.ui.theme.mode === 'dark')

  const calendarRef = useRef<FullCalendar>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)


  // Force calendar re-render when theme changes
  useEffect(() => {
    // Small delay to ensure CSS is applied
    const timer = setTimeout(() => {
      if (calendarRef.current) {
        // Force calendar to re-render
        calendarRef.current.render()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [isDarkMode])

  // Load appointments based on user role
  useEffect(() => {
    if (user) {
      if (parseInt(user.role) === 0) {
        // Admin - get all appointments
        dispatch(getAllAppointmentsRequest())
      } else if (parseInt(user.role) === 1) {
        // Company owner - get company appointments
        dispatch(getAppointmentsByCompanyRequest())
      } else if (parseInt(user.role) === 3) {
        // Regular user - get user appointments
        dispatch(getAppointmentsByUserRequest())
      }
    }
  }, [user, dispatch])

  // Convert appointments to FullCalendar events
  const calendarEvents = useMemo((): CalendarEvent[] => {
    if (!appointments || appointments.length === 0) return []


    return appointments
      .filter((appointment) => {
        // Filter out appointments with invalid dates
        const hasValidDate = appointment.appointmentDate && appointment.appointmentTime
        return hasValidDate
      })
      .map((appointment) => {
        try {
          // Create start datetime with validation
          const dateStr = appointment.appointmentDate
          const timeStr = appointment.appointmentTime
          
          let startDate: Date

          // Check if dateStr is already a full datetime (contains 'T' or 'Z')
          if (dateStr.includes('T') || dateStr.includes('Z')) {
            // appointmentDate is already a full datetime, but we need to use the time from appointmentTime
            // Extract just the date part and combine with the actual time
            const dateOnly = dateStr.split('T')[0] // Get just the date part (YYYY-MM-DD)
            
            // Ensure time format is correct (HH:MM)
            let formattedTime = timeStr
            if (!timeStr.includes(':')) {
              // If time is in HHMM format, convert to HH:MM
              if (timeStr.length === 4) {
                formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`
              } else {
                return null
              }
            }
            
            // Parse date and time components separately to avoid timezone issues
            const [year, month, day] = dateOnly.split('-').map(Number)
            const [hours, minutes] = formattedTime.split(':').map(Number)
            
            // Create date using Date constructor with individual components (local time)
            startDate = new Date(year, month - 1, day, hours, minutes, 0)
            
          } else {
            // appointmentDate is just a date, need to combine with time
            // Ensure time format is correct (HH:MM)
            let formattedTime = timeStr
            if (!timeStr.includes(':')) {
              // If time is in HHMM format, convert to HH:MM
              if (timeStr.length === 4) {
                formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`
              } else {
                return null
              }
            }
            
            // Create date in local timezone to avoid timezone conversion issues
            // Parse date and time components separately to avoid timezone issues
            const [year, month, day] = dateStr.split('-').map(Number)
            const [hours, minutes] = formattedTime.split(':').map(Number)
            
            // Create date using Date constructor with individual components (local time)
            startDate = new Date(year, month - 1, day, hours, minutes, 0)
            
            // Fallback: if the above fails, try string parsing
            if (isNaN(startDate.getTime())) {
              const dateTimeString = `${dateStr}T${formattedTime}:00`
              startDate = new Date(dateTimeString)
              
              // If still invalid, try without seconds
              if (isNaN(startDate.getTime())) {
                const dateTimeStringNoSeconds = `${dateStr}T${formattedTime}`
                startDate = new Date(dateTimeStringNoSeconds)
              }
            }
          }
          
          // Validate the date
          if (isNaN(startDate.getTime())) {
            return null
          }
        
          // Create end datetime (assuming 1 hour duration)
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

          // Determine event color based on status
          let colors = {}
          switch (appointment.status) {
            case 'pending':
              colors = {
                backgroundColor: '#f59e0b',  // Orange - matches appointments list
                borderColor: '#d97706',
                textColor: '#ffffff'
              }
              break
            case 'confirmed':
              colors = {
                backgroundColor: '#3b82f6',  // Blue - matches appointments list
                borderColor: '#2563eb',
                textColor: '#ffffff'
              }
              break
            case 'completed':
              colors = {
                backgroundColor: '#10b981',  // Green - matches appointments list
                borderColor: '#059669',
                textColor: '#ffffff'
              }
              break
            case 'cancelled':
              colors = {
                backgroundColor: '#ef4444',  // Red - matches appointments list
                borderColor: '#dc2626',
                textColor: '#ffffff'
              }
              break
            default:
              colors = {
                backgroundColor: '#6b7280',  // Gray - matches appointments list
                borderColor: '#4b5563',
                textColor: '#ffffff'
              }
          }

          // Create event title based on user role
          let title = ''
          if (parseInt(user?.role || '3') === 1) {
            // Company owner sees: "Service - User Name"
            title = `${appointment.serviceName} - ${appointment.userName}`
          } else {
            // Regular user sees: "Service - Company"
            title = `${appointment.serviceName} - ${appointment.companyName}`
          }

          const event = {
            id: `appointment-${appointment.id}`,
            title,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            ...colors,
            extendedProps: {
              appointmentId: appointment.id,
              userName: appointment.userName,
              companyName: appointment.companyName,
              serviceName: appointment.serviceName,
              servicePrice: appointment.servicePrice,
              status: appointment.status,
              notes: appointment.notes,
              appointmentTime: appointment.appointmentTime,
              profilePicture: getProfileImageUrl(appointment.userProfileImage)
            }
          }
          
          return event
        } catch (error) {
          return null
        }
      })
      .filter((event) => event !== null) // Remove null events
  }, [appointments, user?.role])

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event
    const props = event.extendedProps
    
    // Set the selected appointment ID and open the form
    setSelectedAppointmentId(props.appointmentId)
    setIsFormOpen(true)
  }

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedAppointmentId(null)
  }

  // Handle successful save
  const handleFormSuccess = () => {
    // Refresh appointments data only when form is successfully saved
    if (user) {
      if (parseInt(user.role) === 0) {
        dispatch(getAllAppointmentsRequest())
      } else if (parseInt(user.role) === 1) {
        dispatch(getAppointmentsByCompanyRequest())
      } else if (parseInt(user.role) === 3) {
        dispatch(getAppointmentsByUserRequest())
      }
    }
  }


  // Calculate status counts
  const statusCounts = useMemo(() => {
    if (!appointments) return { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    
    return appointments.reduce((counts, appointment) => {
      switch (appointment.status) {
        case 'pending':
          counts.pending++
          break
        case 'confirmed':
          counts.confirmed++
          break
        case 'completed':
          counts.completed++
          break
        case 'cancelled':
          counts.cancelled++
          break
      }
      return counts
    }, { pending: 0, confirmed: 0, completed: 0, cancelled: 0 })
  }, [appointments])

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress style={{ color: theme.primary }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="p-6">
        <Alert severity="error" style={{ backgroundColor: '#f44336', color: '#ffffff' }}>
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box className="p-6">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box className="flex items-center space-x-3">
          <CalendarIcon style={{ fontSize: '2rem', color: theme.primary }} />
          <Typography variant="h4" style={{ color: theme.text }}>
            Appointment Calendar
          </Typography>
        </Box>

      </Box>

      {/* Status Summary */}
      <Paper className="p-4 mb-6" style={{ backgroundColor: theme.surface }}>
        <Typography variant="h6" className="mb-3" style={{ color: theme.text }}>
          Appointment Summary
        </Typography>
        <Box className="flex flex-wrap gap-3">
          <Tooltip title="Pending appointments">
            <Chip
              icon={<EventIcon />}
              label={`Pending: ${statusCounts.pending}`}
              style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}
            />
          </Tooltip>
          <Tooltip title="Confirmed appointments">
            <Chip
              icon={<EventIcon />}
              label={`Confirmed: ${statusCounts.confirmed}`}
              style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
            />
          </Tooltip>
          <Tooltip title="Completed appointments">
            <Chip
              icon={<EventIcon />}
              label={`Completed: ${statusCounts.completed}`}
              style={{ backgroundColor: '#10b981', color: '#ffffff' }}
            />
          </Tooltip>
          <Tooltip title="Cancelled appointments">
            <Chip
              icon={<EventIcon />}
              label={`Cancelled: ${statusCounts.cancelled}`}
              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
            />
          </Tooltip>
        </Box>
      </Paper>

      {/* Calendar */}
      <Paper className="p-4" style={{ backgroundColor: theme.surface }}>
        {calendarEvents.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-12">
            <CalendarIcon style={{ fontSize: '4rem', color: theme.textSecondary, marginBottom: '1rem' }} />
            <Typography variant="h6" style={{ color: theme.textSecondary, marginBottom: '0.5rem' }}>
              No Appointments Found
            </Typography>
            <Typography variant="body2" style={{ color: theme.textSecondary }}>
              {parseInt(user?.role || '3') === 1
                ? 'No appointments have been booked for your company yet.'
                : 'You don\'t have any appointments scheduled yet.'
              }
            </Typography>
          </Box>
        ) : (
          <Box className={isDarkMode ? 'dark-calendar' : 'light-calendar'}>
            {/* @ts-ignore */}
            <FullCalendar
              ref={calendarRef}
              key={`calendar-${isDarkMode ? 'dark' : 'light'}`}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              height="auto"
              themeSystem="standard"
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day'
              }}
              eventContent={(eventInfo: any) => {
                const appointment = eventInfo.event.extendedProps
                return (
                  <CalendarEventTooltip
                    appointment={appointment}
                    userRole={user?.role}
                  >
                    <div
                      style={{
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: '500',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {eventInfo.event.title}
                    </div>
                  </CalendarEventTooltip>
                )
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Appointment Form Popup */}
      <AppointmentForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        appointmentId={selectedAppointmentId}
        onSuccess={handleFormSuccess}
      />
    </Box>
  )
}

export default CalendarView