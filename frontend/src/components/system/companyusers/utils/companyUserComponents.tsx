import {
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { getProfileImageUrl } from '../../../../utils/fileUtils'
import { getCompanyUserRoleDisplayName, formatCompanyUserDate, formatCompanyUserPhone, formatTotalAppointments } from './companyUserUtils'

// Company User Avatar Component
export const CompanyUserAvatar = ({ 
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
      console.error('Company User Avatar image failed to load:', target.src)
    }}
  >
    <span style={{ color: 'white', fontWeight: 'bold', fontSize: size * 0.4 }}>
      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
    </span>
  </Avatar>
)

// Company User Name Component
export const CompanyUserName = ({ 
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
      {getCompanyUserRoleDisplayName(user.role)}
    </Typography>
  </Box>
)

// Company User Info Component (for cards)
export const CompanyUserInfo = ({ 
  user 
}: { 
  user: any
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <CompanyUserAvatar user={user} size={48} />
    <CompanyUserName user={user} variant="h6" />
  </Box>
)

// Company User Email Component
export const CompanyUserEmail = ({ email }: { email: string }) => (
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

// Company User Phone Component
export const CompanyUserPhone = ({ phone }: { phone?: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <PhoneIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {formatCompanyUserPhone(phone)}
    </Typography>
  </Box>
)

// Company User Total Appointments Component
export const CompanyUserTotalAppointments = ({ count }: { count: number }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <EventIcon sx={{ color: '#6366f1', fontSize: 16 }} />
    <Chip
      label={formatTotalAppointments(count)}
      size="small"
      color="primary"
      variant="outlined"
    />
  </Box>
)

// Company User Date Component
export const CompanyUserDate = ({ 
  date, 
  label 
}: { 
  date?: string
  label: string
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <DateIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      {label}: {formatCompanyUserDate(date)}
    </Typography>
  </Box>
)

// Company User Member Since Component
export const CompanyUserMemberSince = ({ date }: { date: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <PersonIcon sx={{ color: '#666', fontSize: 16 }} />
    <Typography variant="body2" sx={{ color: '#666' }}>
      Member since: {formatCompanyUserDate(date)}
    </Typography>
  </Box>
)
