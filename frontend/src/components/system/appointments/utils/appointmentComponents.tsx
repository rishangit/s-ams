import {
  Box,
  Avatar,
  Typography,
  Chip
} from '@mui/material'
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { getProfileImageUrl } from '../../../../utils/fileUtils'
import { getStatusId, getStatusDisplayName, getStatusColor } from './appointmentUtils'

// User Avatar Component
export const UserAvatar = ({ 
  userName, 
  userProfileImage, 
  size = 32 
}: { 
  userName: string
  userProfileImage?: string
  size?: number
}) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5,
    minWidth: 0,
    overflow: 'hidden'
  }}>
    <Avatar
      sx={{ width: size, height: size, backgroundColor: '#1976d2', flexShrink: 0 }}
      src={getProfileImageUrl(userProfileImage)}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement
        console.error('User Avatar image failed to load:', target.src)
      }}
    >
      <span style={{ fontSize: `${size * 0.4}px`, fontWeight: 'bold', color: 'white' }}>
        {userName.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2)}
      </span>
    </Avatar>
    <Typography 
      variant="body2" 
      sx={{ 
        fontWeight: '500',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: 0
      }}
    >
      {userName}
    </Typography>
  </Box>
)

// Staff Assignment Component
export const StaffAssignment = ({ 
  appointment, 
  showLabel = false 
}: { 
  appointment: any
  showLabel?: boolean
}) => {
  const { staffId, staffPreferences, staffName, staffProfileImage } = appointment
  
  if (staffId && staffName) {
    // Staff is assigned - show avatar
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <Avatar
          sx={{ width: 32, height: 32, backgroundColor: '#10b981', flexShrink: 0 }}
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
        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {staffName}
          </Typography>
          {showLabel && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Assigned Staff
            </Typography>
          )}
        </Box>
      </Box>
    )
  } else if (staffPreferences && staffPreferences.length > 0) {
    // Has preferred staff but not assigned
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <ScheduleIcon sx={{ color: 'orange', fontSize: 16, flexShrink: 0 }} />
        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'orange', 
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {staffPreferences.length} preferred staff
          </Typography>
          {showLabel && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Pending assignment
            </Typography>
          )}
        </Box>
      </Box>
    )
  } else {
    // No staff preferences
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <PersonIcon sx={{ color: '#666', fontSize: 16, flexShrink: 0 }} />
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          No staff assigned
        </Typography>
      </Box>
    )
  }
}

// Service Info Component
export const ServiceInfo = ({ 
  serviceName, 
  servicePrice, 
  variant = 'body2' 
}: { 
  serviceName: string
  servicePrice?: number
  variant?: 'h6' | 'body2'
}) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden'
  }}>
    <Typography 
      variant={variant} 
      sx={{ 
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
    >
      {serviceName || 'Unknown Service'}
    </Typography>
    {servicePrice && (
      <Typography 
        variant="caption" 
        sx={{ 
          color: '#666',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        ${servicePrice}
      </Typography>
    )}
  </Box>
)

// Status Chip Component
export const StatusChip = ({ status }: { status: string | number }) => {
  const statusId = getStatusId(status)
  const displayName = getStatusDisplayName(statusId)
  const statusColor = getStatusColor(statusId)

  return (
    <Chip
      label={displayName}
      size="small"
      style={{
        backgroundColor: statusColor,
        color: '#fff',
        fontWeight: 'bold'
      }}
    />
  )
}

// Notes Component
export const NotesDisplay = ({ 
  notes, 
  maxWidth = 200 
}: { 
  notes?: string
  maxWidth?: number
}) => (
  <Typography 
    variant="body2" 
    sx={{ 
      maxWidth,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}
  >
    {notes || 'No notes'}
  </Typography>
)
