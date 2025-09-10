import React from 'react'
import {
  Tooltip,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack
} from '@mui/material'
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Build as ServiceIcon
} from '@mui/icons-material'

interface CalendarEventTooltipProps {
  children: React.ReactElement
  appointment: {
    userName?: string
    companyName?: string
    serviceName?: string
    servicePrice?: number
    status?: string
    appointmentTime?: string
    notes?: string
    profilePicture?: string
  }
  userRole?: string
}

const CalendarEventTooltip: React.FC<CalendarEventTooltipProps> = ({
  children,
  appointment,
  userRole
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'confirmed': return '#3b82f6'
      case 'completed': return '#10b981'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'Time not available'
    
    // If time is in HHMM format, convert to HH:MM
    if (timeStr.length === 4 && !timeStr.includes(':')) {
      return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`
    }
    
    // If time is in HH:MM:SS format, remove seconds
    if (timeStr.includes(':') && timeStr.split(':').length === 3) {
      return timeStr.slice(0, 5)
    }
    
    // If time is already in HH:MM format, return as is
    if (timeStr.includes(':') && timeStr.split(':').length === 2) {
      return timeStr
    }
    
    return timeStr
  }

  const tooltipContent = (
    <Box sx={{ p: 2, maxWidth: 300 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Appointment Details
        </Typography>

        {/* Status */}
        {appointment.status && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Chip
              label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              size="small"
              sx={{
                backgroundColor: getStatusColor(appointment.status),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        )}

        {/* User Avatar and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            src={appointment.profilePicture} 
            sx={{ 
              bgcolor: appointment.profilePicture ? 'transparent' : 'primary.main', 
              width: 32, 
              height: 32,
              border: appointment.profilePicture ? '2px solid rgba(255,255,255,0.2)' : 'none'
            }}
          >
            {!appointment.profilePicture && <PersonIcon fontSize="small" />}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
              {appointment.userName || 'Unknown User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Customer
            </Typography>
          </Box>
        </Box>

        {/* Service Information */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ServiceIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
          <Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
              {appointment.serviceName || 'Unknown Service'}
            </Typography>
            {appointment.servicePrice && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                ${appointment.servicePrice}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Company Information (for regular users) */}
        {userRole === '3' && appointment.companyName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                {appointment.companyName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Company
              </Typography>
            </Box>
          </Box>
        )}

        {/* Time Information */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScheduleIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
          <Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
              {formatTime(appointment.appointmentTime || '')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Appointment Time
            </Typography>
          </Box>
        </Box>

        {/* Notes (if available) */}
        {appointment.notes && (
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Notes:
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
              {appointment.notes}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  )

  return (
    <Tooltip
      title={tooltipContent}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            maxWidth: 'none'
          }
        },
        arrow: {
          sx: {
            color: 'rgba(0, 0, 0, 0.9)'
          }
        }
      }}
    >
      {children}
    </Tooltip>
  )
}

export default CalendarEventTooltip
