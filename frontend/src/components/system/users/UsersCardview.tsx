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
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  generateUserRowActions,
  getUserRoleColor,
  getUserRoleDisplayName
} from './utils/userUtils'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface UsersCardviewProps {
  filteredUsers: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  currentUserId?: number
  onViewUser: (userId: number) => void
  onEditUser: (userId: number) => void
  onDeleteUser: (userId: number) => void
}

const UsersCardview: React.FC<UsersCardviewProps> = ({
  filteredUsers,
  loading,
  error,
  success,
  uiTheme,
  currentUserId,
  onViewUser,
  onEditUser,
  onDeleteUser
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateUserRowActions(onViewUser, onEditUser, onDeleteUser, currentUserId)
  }, [onViewUser, onEditUser, onDeleteUser, currentUserId])

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
        {filteredUsers?.map((user) => (
          <div key={user.id} className="col-span-1 overflow-visible">
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
                  rowData={user}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </div>

              {/* Full-width Image Section with Blurred Background */}
              <div
                className="h-48 relative overflow-hidden rounded-t-xl"
                style={{
                  '--bg-image': user.profileImage 
                    ? `url(${getProfileImageUrl(user.profileImage)})`
                    : 'none',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                } as React.CSSProperties}
              >
                {/* Blurred background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
                  style={{
                    backgroundImage: user.profileImage 
                      ? `url(${getProfileImageUrl(user.profileImage)})`
                      : 'none'
                  }}
                />
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: user.profileImage 
                      ? 'rgba(0, 0, 0, 0.3)'
                      : '#f5f5f5'
                  }}
                />
                {/* Avatar centered over blurred background */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <Avatar
                    className="w-30 h-30 border-4 border-white shadow-lg"
                    style={{ 
                      backgroundColor: uiTheme.primary,
                      width: 120,
                      height: 120
                    }}
                    src={getProfileImageUrl(user.profileImage)}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      console.error('User Avatar image failed to load:', target.src)
                    }}
                  >
                    <span className="text-white font-bold text-5xl">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
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
                {/* Title and Author */}
                <div className="mb-4">
                  <Typography 
                    variant="h6" 
                    className="font-bold mb-1 leading-tight"
                    style={{ color: uiTheme.text }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="text-sm"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    By {user.email} • {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </div>

                {/* Role Category Tag */}
                <div className="flex justify-start mb-4">
                  <Chip
                    label={getUserRoleDisplayName(user.role)}
                    size="small"
                    className="text-white font-bold text-xs h-6 px-3"
                    style={{
                      backgroundColor: getUserRoleColor(user.role)
                    }}
                  />
                </div>

                {/* Additional Info - Simplified */}
                <div className="flex flex-col gap-2">
                  {user.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                        {user.phoneNumber}
                      </Typography>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <PersonIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                    <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                      ID: {user.id}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredUsers?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${uiTheme.primary}10` }}
          >
            <PersonIcon className="text-4xl" style={{ color: uiTheme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: uiTheme.text }}>
            No users found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Try adjusting your filters or add a new user
          </Typography>
        </div>
      )}
    </div>
  )
}

export default UsersCardview
