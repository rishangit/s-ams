import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Chip
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { RowActionsMenu } from '../../../components/shared'
import { 
  generateRowActions, 
  shouldShowCompanyColumn 
} from './utils/appointmentUtils'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { 
  getStatusDisplayName, 
  getStatusColor,
  getStatusId
} from '../../../constants/appointmentStatus'

interface AppointmentsCardviewProps {
  filteredAppointments: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onStatusChange: (appointmentId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled', appointmentData?: any) => void
  onEditAppointment: (appointmentId: number) => void
  onDeleteAppointment: (appointmentId: number) => void
}

// Helper function to calculate and format remaining time
const getRemainingTime = (appointmentDate: string, appointmentTime: string): string => {
  try {
    // Debug logging to see what we're receiving
    console.log('getRemainingTime inputs:', { appointmentDate, appointmentTime })
    
    if (!appointmentDate || !appointmentTime) {
      return 'No time set'
    }
    
    let appointmentDateTime: Date
    
    // Try different date parsing approaches
    try {
      // First, try if appointmentDate is already a full datetime string
      if (appointmentDate.includes('T') || appointmentDate.includes(' ')) {
        appointmentDateTime = new Date(appointmentDate)
      } else {
        // Handle separate date and time
        // Ensure time format includes seconds if not present
        const timeWithSeconds = appointmentTime.includes(':') && appointmentTime.split(':').length === 2 
          ? `${appointmentTime}:00` 
          : appointmentTime
        
        // Try different date formats
        const dateTimeString = `${appointmentDate}T${timeWithSeconds}`
        appointmentDateTime = new Date(dateTimeString)
        
        // If that fails, try with space separator
        if (isNaN(appointmentDateTime.getTime())) {
          appointmentDateTime = new Date(`${appointmentDate} ${timeWithSeconds}`)
        }
      }
    } catch (parseError) {
      console.error('Date parsing error:', parseError)
      return 'Parse error'
    }
    
    // Check if the date is valid
    if (isNaN(appointmentDateTime.getTime())) {
      console.error('Invalid date result:', appointmentDateTime)
      return 'Invalid date'
    }
    
    const now = new Date()
    const diffMs = appointmentDateTime.getTime() - now.getTime()
    
    if (diffMs <= 0) {
      return 'Past due'
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    // Less than 1 hour: show in minutes
    if (diffHours < 1) {
      return `${diffMinutes}m`
    }
    // Less than 5 hours: show hours and minutes
    else if (diffHours < 5) {
      const remainingMinutes = diffMinutes % 60
      return remainingMinutes > 0 ? `${diffHours}h ${remainingMinutes}m` : `${diffHours}h`
    }
    // Less than 1 day: show in hours
    else if (diffDays < 1) {
      return `${diffHours}h`
    }
    // More than 1 day: show in days
    else {
      return `${diffDays}d`
    }
  } catch (error) {
    console.error('Error calculating remaining time:', error)
    return 'Calculation error'
  }
}

const AppointmentsCardview: React.FC<AppointmentsCardviewProps> = ({
  filteredAppointments,
  loading,
  error,
  success,
  uiTheme,
  onStatusChange,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const { user } = useSelector((state: RootState) => state.auth)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateRowActions(user, onStatusChange, onEditAppointment, onDeleteAppointment)
  }, [user, onStatusChange, onEditAppointment, onDeleteAppointment])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert severity="success" className="mb-4">
        {success}
      </Alert>
    )
  }

  return (
    <div className="p-0 overflow-visible">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-visible">
        {filteredAppointments?.map((appointment) => (
          <div key={appointment.id} className="col-span-1 overflow-visible">
            <Card 
              elevation={0}
              className="h-full flex flex-col relative overflow-visible rounded-xl transition-all duration-300 ease-out shadow-md hover:shadow-lg hover:-translate-y-1 group"
              style={{ 
                backgroundColor: uiTheme.background,
                border: `1px solid ${uiTheme.border}`,
                '--hover-border-color': uiTheme.primary,
                transformOrigin: 'center center',
                willChange: 'transform, box-shadow'
              } as React.CSSProperties}
            >
              {/* 3-Dot Menu in Top Right Corner */}
              <div 
                className="absolute top-2 right-2 z-20 rounded-full shadow-md"
                style={{ 
                  backgroundColor: uiTheme.background,
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <RowActionsMenu
                  rowData={appointment}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </div>

              {/* Full-width Image Section with Blurred Background */}
              <div
                className="h-48 relative overflow-hidden rounded-t-xl"
                style={{
                  '--bg-image': appointment.userProfileImage 
                    ? `url(${getProfileImageUrl(appointment.userProfileImage)})`
                    : 'none',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                } as React.CSSProperties}
              >
                {/* Blurred background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
                  style={{
                    backgroundImage: appointment.userProfileImage 
                      ? `url(${getProfileImageUrl(appointment.userProfileImage)})`
                      : 'none'
                  }}
                />
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: appointment.userProfileImage 
                      ? 'rgba(0, 0, 0, 0.3)'
                      : '#f5f5f5'
                  }}
                />
                {/* User Avatar centered over blurred background */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <Avatar
                    className="w-30 h-30 border-4 border-white shadow-lg"
                    style={{ 
                      backgroundColor: uiTheme.primary,
                      width: 120,
                      height: 120
                    }}
                    src={getProfileImageUrl(appointment.userProfileImage)}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      console.error('User Avatar image failed to load:', target.src)
                    }}
                  >
                    <span className="text-white font-bold text-5xl">
                      {appointment.userName?.charAt(0) || 'U'}
                    </span>
                  </Avatar>
                </div>
              </div>

              {/* Content Section */}
              <CardContent 
                className="flex-grow p-5 rounded-t-xl"
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Title and User Info */}
                <div className="mb-4">
                  <Typography 
                    variant="h6" 
                    className="font-bold mb-1 leading-tight"
                    style={{ color: uiTheme.text }}
                  >
                    {appointment.userName || 'Unknown User'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="text-sm"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    {appointment.serviceName} • {new Date(appointment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </div>

                {/* Status Category Tag */}
                <div className="flex justify-start mb-4">
                  <Chip
                    label={getStatusDisplayName(getStatusId(appointment.status))}
                    size="small"
                    className="text-white font-bold text-xs h-6 px-3"
                    style={{
                      backgroundColor: getStatusColor(getStatusId(appointment.status))
                    }}
                  />
                </div>

                 {/* Additional Info - Simplified */}
                 <div className="flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <CalendarIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                       <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                         {new Date(appointment.appointmentDate).toLocaleDateString()}
                       </Typography>
                     </div>
                     <div className="flex items-center gap-1">
                       <ScheduleIcon className="w-3 h-3" style={{ color: uiTheme.primary }} />
                       <Typography variant="body2" className="text-xs font-semibold" style={{ color: uiTheme.primary }}>
                         {getRemainingTime(appointment.appointmentDate, appointment.appointmentTime)}
                       </Typography>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <TimeIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                     <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                       {appointment.appointmentTime}
                     </Typography>
                   </div>
                  {shouldShowCompanyColumn(user) && appointment.companyName && (
                    <div className="flex items-center gap-2">
                      <BusinessIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs truncate" style={{ color: uiTheme.textSecondary }}>
                        {appointment.companyName}
                      </Typography>
                    </div>
                  )}
                  {appointment.staffName && (
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={getProfileImageUrl(appointment.staffProfileImage)}
                        className="w-4 h-4"
                        style={{ backgroundColor: uiTheme.primary }}
                      >
                        <PersonIcon className="w-3 h-3" />
                      </Avatar>
                      <Typography variant="body2" className="text-xs truncate" style={{ color: uiTheme.textSecondary }}>
                        {appointment.staffName}
                      </Typography>
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="flex items-center gap-2">
                      <NotesIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs truncate" style={{ color: uiTheme.textSecondary }}>
                        {appointment.notes}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredAppointments?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${uiTheme.primary}10` }}
          >
            <CalendarIcon className="text-4xl" style={{ color: uiTheme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: uiTheme.text }}>
            No appointments found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Try adjusting your filters or create a new appointment
          </Typography>
        </div>
      )}
    </div>
  )
}

export default AppointmentsCardview