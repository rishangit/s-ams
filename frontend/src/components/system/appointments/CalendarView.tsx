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
    Button
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import {
  getAppointmentsRequest
} from '../../../store/actions/appointmentsActions'
import { useViewMode } from '../../../hooks/useViewMode'
import ViewModeSelector from '../../shared/ViewModeSelector'
import { getUserSettingsRequest } from '../../../store/actions/userSettingsActions'
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
  const { calendarView } = useViewMode()
  const { settings, loading: settingsLoading } = useSelector((state: RootState) => state.userSettings)

  const calendarRef = useRef<FullCalendar>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Convert calendar view preference to FullCalendar view
  const getFullCalendarView = (view: string) => {
    switch (view) {
      case 'month': return 'dayGridMonth'
      case 'week': return 'timeGridWeek'
      case 'day': return 'timeGridDay'
      default: return 'dayGridMonth'
    }
  }
  
  // Initialize with default view, will be updated when settings load
  const [currentView, setCurrentView] = useState('dayGridMonth')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)

  // Add custom CSS for mobile calendar toolbar and full height
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @media (max-width: 768px) {
        .fc-toolbar {
          flex-direction: row !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        
        .fc-toolbar-chunk {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          flex: 1 !important;
        }
        
        .fc-toolbar-chunk:first-child {
          justify-content: flex-end !important;
          flex: 0 0 auto !important;
          order: 2 !important;
        }
        
        .fc-toolbar-chunk:nth-child(2) {
          justify-content: center !important;
          flex: 1 !important;
          order: 1 !important;
          width: 100% !important;
          margin-bottom: 8px !important;
        }
        
        .fc-toolbar-chunk:last-child {
          justify-content: flex-end !important;
          flex: 0 0 auto !important;
          order: 2 !important;
        }
        
        .fc-toolbar-title {
          font-size: 1.125rem !important;
          margin: 0 !important;
          text-align: center !important;
        }
        
        .fc-button-group {
          display: flex !important;
          gap: 2px !important;
        }
        
        .fc-button {
          font-size: 0.75rem !important;
          padding: 4px 8px !important;
          min-width: auto !important;
        }
        
        .fc-button-group .fc-button {
          font-size: 0.75rem !important;
          padding: 4px 6px !important;
        }
      }
      
      /* Remove background colors and borders from navigation buttons */
      .fc-button {
        background: transparent !important;
        border: none !important;
        color: #374151 !important;
        box-shadow: none !important;
        border-radius: 6px !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      }
      
      .fc-button:hover {
        background: #f9fafb !important;
        transform: translateY(-1px) !important;
      }
      
      .fc-button:focus {
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
      }
      
      .fc-button:active {
        transform: translateY(0) !important;
      }
      
      /* Active/selected button styling */
      .fc-button-active {
        background: #3b82f6 !important;
        color: white !important;
      }
      
      .fc-button-active:hover {
        background: #2563eb !important;
      }
      
      /* Simplify day labels */
      .fc-col-header-cell {
        background: transparent !important;
        border: none !important;
        border-bottom: 1px solid #e5e7eb !important;
        padding: 12px 8px !important;
        font-weight: 600 !important;
        font-size: 0.875rem !important;
        color: #374151 !important;
      }
      
      .fc-col-header-cell-cushion {
        color: inherit !important;
        text-decoration: none !important;
        font-weight: inherit !important;
      }
      
      /* Simplify toolbar */
      .fc-toolbar {
        background: transparent !important;
        border: none !important;
        padding: 16px 0 !important;
        margin-bottom: 0 !important;
      }
      
      .fc-toolbar-chunk {
        background: transparent !important;
      }
      
      /* Simplify title */
      .fc-toolbar-title {
        font-size: 1.5rem !important;
        font-weight: 700 !important;
        color: #111827 !important;
        margin: 0 !important;
      }
      
      /* Dark mode adjustments */
      .dark-calendar .fc-button {
        border: none !important;
        color: #d1d5db !important;
      }
      
      .dark-calendar .fc-button:hover {
        background: #374151 !important;
      }
      
      .dark-calendar .fc-button-active {
        background: #3b82f6 !important;
        color: white !important;
      }
      
      .dark-calendar .fc-col-header-cell {
        border-bottom-color: #4b5563 !important;
        color: #d1d5db !important;
      }
      
      .dark-calendar .fc-toolbar-title {
        color: #f9fafb !important;
      }
      
       /* Auto-adjusting calendar height */
       .fc {
         height: auto !important;
         min-height: 600px !important;
       }
       
       .fc-view-harness {
         height: auto !important;
       }
       
       .fc-daygrid-body {
         height: auto !important;
       }
       
       .fc-timegrid-body {
         height: auto !important;
       }
       
       /* Allow scrolling for time grid */
       .fc-timegrid {
         overflow: visible !important;
       }
       
       .fc-timegrid-slot-table {
         overflow: visible !important;
       }
       
       /* Auto-adjust appointment card height */
       .fc-event {
         height: auto !important;
         min-height: 20px !important;
         padding: 2px 4px !important;
         font-size: 12px !important;
         line-height: 1.2 !important;
         white-space: normal !important;
         word-wrap: break-word !important;
         overflow: visible !important;
       }
       
       .fc-event-title {
         white-space: normal !important;
         word-wrap: break-word !important;
         overflow: visible !important;
       }
      
      /* Ensure scrollable content maintains borders */
      .fc-timegrid-body .fc-timegrid-slot-table {
        border-collapse: separate !important;
        border-spacing: 0 !important;
      }
      
      .fc-timegrid-body .fc-timegrid-slot-table td {
        border-right: 1px solid #e5e7eb !important;
        vertical-align: top !important;
      }
      
      .fc-timegrid-body .fc-timegrid-slot-table td:last-child {
        border-right: none !important;
      }
      
      /* Dark mode for scrollable content */
      .dark-calendar .fc-timegrid-body .fc-timegrid-slot-table td {
        border-right: 1px solid #374151 !important;
      }
      
      /* Fix day separator lines to extend to full height in week view */
      .fc-timegrid-slot {
        border-right: 1px solid #e5e7eb !important;
        min-height: 2.5em !important;
      }
      
      .fc-timegrid-slot:last-child {
        border-right: none !important;
      }
      
      /* Target all time slots including those below 11:00 AM */
      .fc-timegrid-slot-lane {
        border-right: 1px solid #e5e7eb !important;
      }
      
      .fc-timegrid-slot-lane:last-child {
        border-right: none !important;
      }
      
      /* Ensure day columns have borders throughout */
      .fc-timegrid-day {
        border-right: 1px solid #d1d5db !important;
        position: relative !important;
      }
      
      .fc-timegrid-day:last-child {
        border-right: none !important;
      }
      
      /* Add borders to day column content */
      .fc-timegrid-day-events {
        border-right: 1px solid #d1d5db !important;
      }
      
      .fc-timegrid-day-events:last-child {
        border-right: none !important;
      }
      
      /* Ensure day headers have proper borders */
      .fc-col-header-cell {
        border-right: 1px solid #d1d5db !important;
      }
      
      .fc-col-header-cell:last-child {
        border-right: none !important;
      }
      
      /* Force borders on all time grid elements */
      .fc-timegrid-body .fc-timegrid-slot {
        border-right: 1px solid #e5e7eb !important;
      }
      
      .fc-timegrid-body .fc-timegrid-slot:last-child {
        border-right: none !important;
      }
      
      /* Ensure week view day separators extend to full scrollable height */
      .fc-timegrid-body .fc-timegrid-slot-table {
        border-collapse: separate !important;
        border-spacing: 0 !important;
      }
      
      .fc-timegrid-body .fc-timegrid-slot-table td {
        border-right: 1px solid #e5e7eb !important;
        vertical-align: top !important;
        position: relative !important;
      }
      
      .fc-timegrid-body .fc-timegrid-slot-table td:last-child {
        border-right: none !important;
      }
      
      /* Ensure day separators are visible in scrollable content */
      .fc-timegrid-body .fc-timegrid-slot-table tr td {
        border-right: 1px solid #e5e7eb !important;
      }
      
      .fc-timegrid-body .fc-timegrid-slot-table tr td:last-child {
        border-right: none !important;
      }
      
      /* Force day column borders in week view */
      .fc-timegrid-day-frame {
        border-right: 1px solid #d1d5db !important;
      }
      
      .fc-timegrid-day-frame:last-child {
        border-right: none !important;
      }
      
      /* Dark mode adjustments */
      .dark-calendar .fc-timegrid-slot {
        border-right: 1px solid #374151 !important;
      }
      
      .dark-calendar .fc-timegrid-slot-lane {
        border-right: 1px solid #374151 !important;
      }
      
      .dark-calendar .fc-timegrid-day {
        border-right: 1px solid #4b5563 !important;
      }
      
      .dark-calendar .fc-timegrid-day-events {
        border-right: 1px solid #4b5563 !important;
      }
      
      .dark-calendar .fc-col-header-cell {
        border-right: 1px solid #4b5563 !important;
      }
      
      .dark-calendar .fc-timegrid-body .fc-timegrid-slot {
        border-right: 1px solid #374151 !important;
      }
      
      /* Dark mode for week view day separators */
      .dark-calendar .fc-timegrid-body .fc-timegrid-slot-table td {
        border-right: 1px solid #374151 !important;
      }
      
      .dark-calendar .fc-timegrid-body .fc-timegrid-slot-table tr td {
        border-right: 1px solid #374151 !important;
      }
      
      .dark-calendar .fc-timegrid-day-frame {
        border-right: 1px solid #4b5563 !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])


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

  // Load appointments and user settings when component mounts
  useEffect(() => {
    if (user) {
      // Use unified appointments endpoint for all roles
      dispatch(getAppointmentsRequest())
      
      // Load user settings if not already loaded
      if (!settings && !settingsLoading) {
        dispatch(getUserSettingsRequest())
      }
    }
  }, [user, dispatch, settings, settingsLoading])

  // Sync view mode with user settings
  useEffect(() => {
    // Only update if settings are loaded and user hasn't manually selected a view
    if (settings && !settingsLoading && !userSelectedView && !settingsLoaded) {
      console.log('Calendar: Setting view mode from settings:', calendarView)
      setCurrentView(getFullCalendarView(calendarView))
      setSettingsLoaded(true)
    }
  }, [settings, settingsLoading, calendarView, userSelectedView, settingsLoaded])

  // Handle view changes when currentView state changes
  useEffect(() => {
    if (calendarRef.current && settingsLoaded) {
      console.log('Calendar: Changing view to:', currentView)
      calendarRef.current.getApi().changeView(currentView)
    }
  }, [currentView, settingsLoaded])

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
          if (parseInt(String(user?.role || '3')) === 1) {
            // Company owner sees: "Service - User Name"
            title = `${appointment.serviceName} - ${appointment.userName}`
          } else if (parseInt(String(user?.role || '3')) === 2) {
            // Staff member sees: "Service - Customer Name"
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
      // Use unified appointments endpoint for all roles
      dispatch(getAppointmentsRequest())
    }
  }

  // Custom toolbar handlers
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev()
      setCurrentDate(calendarRef.current.getApi().getDate())
    }
  }

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next()
      setCurrentDate(calendarRef.current.getApi().getDate())
    }
  }

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today()
      setCurrentDate(calendarRef.current.getApi().getDate())
    }
  }

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress style={{ color: theme.primary }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="p-0 md:p-6">
        <Alert 
          severity="error" 
          className="bg-red-600 text-white"
        >
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box className="flex flex-col min-h-full">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6 flex-shrink-0">
        <CalendarIcon className="text-3xl" style={{ color: theme.primary }} />
          <Typography 
            variant="h6" 
            className="text-xl md:text-3xl font-bold"
            style={{ color: theme.text }}
          >
            Appointment Calendar
          </Typography>
      </Box>

      {/* Calendar Content */}
      <Box className="flex-1">
        <Paper className="p-4 flex flex-col" style={{ backgroundColor: theme.surface }}>
        {calendarEvents.length === 0 ? (
          <Box className="flex flex-col items-center justify-center flex-1">
             <CalendarIcon className="text-6xl mb-4" style={{ color: theme.textSecondary }} />
            <Typography 
              variant="h6" 
               className="text-base md:text-xl mb-2" 
               style={{ color: theme.textSecondary }}
            >
              No Appointments Found
            </Typography>
             <Typography variant="body2" className="text-sm" style={{ color: theme.textSecondary }}>
              {parseInt(String(user?.role || '3')) === 1
                ? 'No appointments have been booked for your company yet.'
                : parseInt(String(user?.role || '3')) === 2
                ? 'You don\'t have any appointments assigned to you yet.'
                : 'You don\'t have any appointments scheduled yet.'
              }
            </Typography>
          </Box>
        ) : (
           <Box className={`flex-1 ${isDarkMode ? 'dark-calendar' : 'light-calendar'}`}>
             {/* Custom Toolbar */}
             <Box className="mb-4">
               {/* Row 1: Title */}
               <Box className="flex justify-center mb-3">
                 <Typography
                   variant="h5"
                   className="text-xl md:text-2xl font-bold"
                   style={{ color: theme.text }}
                 >
                   {currentDate.toLocaleDateString('en-US', { 
                     month: 'long', 
                     year: 'numeric' 
                   })}
                 </Typography>
               </Box>
               
               {/* Row 2: Navigation and View Controls */}
               <Box className="flex justify-between items-center">
                 {/* Left: Navigation and Today */}
                 <Box className="flex items-center gap-1">
                   <Button
                     variant="text"
                     size="large"
                     onClick={handlePrev}
                     className="min-w-0 px-1.5 py-2 transition-all duration-200 hover:scale-110 border-none focus:outline-none focus:ring-0 focus:border-none"
                     sx={{
                       color: theme.text,
                       border: 'none !important',
                       '&:focus': {
                         outline: 'none !important',
                         border: 'none !important',
                         boxShadow: 'none !important'
                       },
                       '&:active': {
                         border: 'none !important',
                         boxShadow: 'none !important'
                       }
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = `${theme.primary}15`
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = 'transparent'
                     }}
                   >
                     <ChevronLeftIcon className="text-2xl" />
                   </Button>
                   <Button
                     variant="text"
                     size="large"
                     onClick={handleNext}
                     className="min-w-0 px-1.5 py-2 transition-all duration-200 hover:scale-110 border-none focus:outline-none focus:ring-0 focus:border-none"
                     sx={{
                       color: theme.text,
                       border: 'none !important',
                       '&:focus': {
                         outline: 'none !important',
                         border: 'none !important',
                         boxShadow: 'none !important'
                       },
                       '&:active': {
                         border: 'none !important',
                         boxShadow: 'none !important'
                       }
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = `${theme.primary}15`
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = 'transparent'
                     }}
                   >
                     <ChevronRightIcon className="text-2xl" />
                   </Button>
                   <Button
                     variant="text"
                     size="small"
                     onClick={handleToday}
                     className="ml-2 border-none focus:outline-none focus:ring-0 focus:border-none"
                     sx={{
                       color: theme.text,
                       border: 'none !important',
                       '&:focus': {
                         outline: 'none !important',
                         border: 'none !important',
                         boxShadow: 'none !important'
                       },
                       '&:active': {
                         border: 'none !important',
                         boxShadow: 'none !important'
                       }
                     }}
                   >
                     Today
                   </Button>
                 </Box>
                 
                 {/* Right: View Mode Selector */}
                 <ViewModeSelector
                   section="calendar"
                   currentView={calendarView}
                   onViewChange={(newView) => {
                     const fullCalendarView = getFullCalendarView(newView)
                     setCurrentView(fullCalendarView)
                     setUserSelectedView(true)
                   }}
                 />
               </Box>
             </Box>

            {/* @ts-ignore */}
            <FullCalendar
              ref={calendarRef}
              key={`calendar-${isDarkMode ? 'dark' : 'light'}-${currentView}`}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={false}
              events={calendarEvents}
              eventClick={handleEventClick}
              datesSet={(dateInfo: any) => {
                setCurrentDate(dateInfo.start)
              }}
              height="auto"
              themeSystem="standard"
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
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
                     <div className="px-1 py-0.5 rounded text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                      {eventInfo.event.title}
                    </div>
                  </CalendarEventTooltip>
                )
              }}
            />
          </Box>
        )}
      </Paper>
      </Box>

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