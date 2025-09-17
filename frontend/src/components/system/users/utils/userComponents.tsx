import {
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
    className="bg-indigo-500"
    style={{ 
      width: size, 
      height: size
    }}
    src={getProfileImageUrl(user.profileImage)}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement
      console.error('User Avatar image failed to load:', target.src)
    }}
  >
    <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
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
  <div>
    <Typography variant={variant} className="font-bold">
      {user.firstName} {user.lastName}
    </Typography>
    <Typography variant="caption" className="text-gray-600">
      ID: {user.id}
    </Typography>
  </div>
)

// User Info Component (for cards)
export const UserInfo = ({ 
  user 
}: { 
  user: any
}) => (
  <div className="flex items-center gap-4">
    <UserAvatar user={user} size={48} />
    <UserName user={user} variant="h6" />
  </div>
)

// User Email Component
export const UserEmail = ({ email }: { email: string }) => (
  <div className="flex items-center gap-2">
    <EmailIcon className="w-4 h-4 text-gray-600" />
    <Typography 
      variant="body2" 
      className="text-gray-600 max-w-48 truncate"
    >
      {email}
    </Typography>
  </div>
)

// User Phone Component
export const UserPhone = ({ phone }: { phone?: string }) => (
  <div className="flex items-center gap-2">
    <PhoneIcon className="w-4 h-4 text-gray-600" />
    <Typography variant="body2" className="text-gray-600">
      {formatUserPhone(phone)}
    </Typography>
  </div>
)

// User Role Chip Component
export const UserRoleChip = ({ role }: { role: number }) => {
  const roleColor = getUserRoleColor(role)
  const roleDisplayName = getUserRoleDisplayName(role)

  return (
    <Chip
      label={roleDisplayName}
      size="small"
      className="text-white font-bold"
      style={{
        backgroundColor: roleColor
      }}
    />
  )
}

// User Date Component
export const UserDate = ({ date }: { date: string }) => (
  <div className="flex items-center gap-2">
    <DateIcon className="w-4 h-4 text-gray-600" />
    <Typography variant="body2" className="text-gray-600">
      {formatUserDate(date)}
    </Typography>
  </div>
)
