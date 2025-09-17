import {
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material'
import { getProfileImageUrl } from '../../../../utils/fileUtils'
import { getUserRoleColor, getUserRoleDisplayName, formatUserDate, formatUserPhone } from './userUtils'

// User Avatar Component
export const UserAvatar = ({ 
  user, 
  size = 40 
}: { 
  user: any
  size?: number
}) => (
  <Avatar
    sx={{ 
      width: size, 
      height: size,
      backgroundColor: '#6366f1'
    }}
    src={getProfileImageUrl(user.profileImage)}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement
      console.error('User Avatar image failed to load:', target.src)
    }}
  >
    <span style={{ color: 'white', fontWeight: 'bold', fontSize: size * 0.4 }}>
      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
    </span>
  </Avatar>
)

// User Name Component
export const UserName = ({ 
  user, 
  variant = 'h6' 
}: { 
  user: any
  variant?: 'h6' | 'body2'
}) => (
  <Box>
    <Typography variant={variant} sx={{ fontWeight: 'bold' }}>
      {user.firstName} {user.lastName}
    </Typography>
    <Typography variant="caption" sx={{ color: '#666' }}>
      ID: {user.id}
    </Typography>
  </Box>
)

// User Info Component (for cards)
export const UserInfo = ({ 
  user 
}: { 
  user: any
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <UserAvatar user={user} size={48} />
    <UserName user={user} variant="h6" />
  </Box>
)

// User Email Component
export const UserEmail = ({ email }: { email: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <EmailIcon sx={{ color: '#666', fontSize: 16 }} />
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
      {email}
    </Typography>
  </Box>
)

// User Phone Component
export const UserPhone = ({ phone }: { phone?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <PhoneIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {formatUserPhone(phone)}
    </Typography>
  </Box>
)

// User Role Chip Component
export const UserRoleChip = ({ role }: { role: number }) => {
  const roleColor = getUserRoleColor(role)
  const roleDisplayName = getUserRoleDisplayName(role)

  return (
    <Chip
      label={roleDisplayName}
      size="small"
      style={{
        backgroundColor: roleColor,
        color: '#ffffff',
        fontWeight: 'bold'
      }}
    />
  )
}

// User Date Component
export const UserDate = ({ date }: { date: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <DateIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {formatUserDate(date)}
    </Typography>
  </Box>
)
