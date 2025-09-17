import {
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  Work as SkillsIcon
} from '@mui/icons-material'
import { getProfileImageUrl } from '../../../../utils/fileUtils'
import { getStaffStatusColor, getStaffStatusDisplayName, formatWorkingHours, formatSkills } from './staffUtils'

// Staff Avatar Component
export const StaffAvatar = ({ 
  staff, 
  size = 40 
}: { 
  staff: any
  size?: number
}) => (
  <Avatar
    sx={{ 
      width: size, 
      height: size,
      backgroundColor: '#6366f1'
    }}
    src={getProfileImageUrl(staff.profileImage)}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement
      console.error('Staff Avatar image failed to load:', target.src)
    }}
  >
    <span style={{ color: 'white', fontWeight: 'bold', fontSize: size * 0.4 }}>
      {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
    </span>
  </Avatar>
)

// Staff Name Component
export const StaffName = ({ 
  staff, 
  variant = 'h6' 
}: { 
  staff: any
  variant?: 'h6' | 'body2'
}) => (
  <Box>
    <Typography variant={variant} sx={{ fontWeight: 'bold' }}>
      {staff.firstName} {staff.lastName}
    </Typography>
    <Typography variant="caption" sx={{ color: '#666' }}>
      ID: {staff.id}
    </Typography>
  </Box>
)

// Staff Info Component (for cards)
export const StaffInfo = ({ 
  staff 
}: { 
  staff: any
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <StaffAvatar staff={staff} size={48} />
    <StaffName staff={staff} variant="h6" />
  </Box>
)

// Staff Email Component
export const StaffEmail = ({ email }: { email: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <EmailIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {email}
    </Typography>
  </Box>
)

// Staff Phone Component
export const StaffPhone = ({ phone }: { phone?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <PhoneIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {phone || 'Not provided'}
    </Typography>
  </Box>
)

// Staff Working Hours Component
export const StaffWorkingHours = ({ 
  start, 
  end 
}: { 
  start?: string
  end?: string
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <TimeIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {formatWorkingHours(start, end)}
    </Typography>
  </Box>
)

// Staff Skills Component
export const StaffSkills = ({ skills }: { skills?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <SkillsIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography 
      variant="body2" 
      sx={{ 
        color: '#666',
        maxWidth: 200,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
    >
      {formatSkills(skills)}
    </Typography>
  </Box>
)

// Staff Status Chip Component
export const StaffStatusChip = ({ status }: { status: number }) => {
  const statusColor = getStaffStatusColor(status)
  const statusDisplayName = getStaffStatusDisplayName(status)

  return (
    <Chip
      label={statusDisplayName}
      size="small"
      style={{
        backgroundColor: statusColor,
        color: '#ffffff',
        fontWeight: 'bold'
      }}
    />
  )
}
