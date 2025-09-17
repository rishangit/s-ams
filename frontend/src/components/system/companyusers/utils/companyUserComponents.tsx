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
    className="bg-indigo-500"
    style={{ 
      width: size, 
      height: size
    }}
    src={getProfileImageUrl(user.profileImage)}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement
      console.error('Company User Avatar image failed to load:', target.src)
    }}
  >
    <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
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
    <Typography variant={variant} className="font-bold">
      {user.firstName} {user.lastName}
    </Typography>
    <Typography variant="caption" className="text-gray-600">
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
  <Box className="flex items-center gap-4">
    <CompanyUserAvatar user={user} size={48} />
    <CompanyUserName user={user} variant="h6" />
  </Box>
)

// Company User Email Component
export const CompanyUserEmail = ({ email }: { email: string }) => (
  <Box className="flex items-center gap-2">
    <EmailIcon className="text-gray-600" style={{ fontSize: 16 }} />
    <Typography 
      variant="body2" 
      className="text-gray-600 max-w-[200px] truncate"
    >
      {email}
    </Typography>
  </Box>
)

// Company User Phone Component
export const CompanyUserPhone = ({ phone }: { phone?: string }) => (
  <Box className="flex items-center gap-2">
    <PhoneIcon className="text-gray-600" style={{ fontSize: 16 }} />
    <Typography variant="body2" className="text-gray-600">
      {formatCompanyUserPhone(phone)}
    </Typography>
  </Box>
)

// Company User Total Appointments Component
export const CompanyUserTotalAppointments = ({ count }: { count: number }) => (
  <Box className="flex items-center gap-2">
    <EventIcon className="text-indigo-500" style={{ fontSize: 16 }} />
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
  <Box className="flex items-center gap-2">
    <DateIcon className="text-gray-600" style={{ fontSize: 16 }} />
    <Typography variant="body2" className="text-gray-600">
      {label}: {formatCompanyUserDate(date)}
    </Typography>
  </Box>
)

// Company User Member Since Component
export const CompanyUserMemberSince = ({ date }: { date: string }) => (
  <Box className="flex items-center gap-2">
    <PersonIcon className="text-gray-600" style={{ fontSize: 16 }} />
    <Typography variant="body2" className="text-gray-600">
      Member since: {formatCompanyUserDate(date)}
    </Typography>
  </Box>
)
