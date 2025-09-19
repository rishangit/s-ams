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
  AccessTime as TimeIcon,
  Work as SkillsIcon,
  People as PeopleIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  generateStaffRowActions,
  getStaffStatusColor,
  getStaffStatusDisplayName
} from './utils/staffUtils'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface StaffCardviewProps {
  filteredStaff: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditStaff: (staffId: number) => void
  onDeleteStaff: (staffId: number) => void
}

const StaffCardview: React.FC<StaffCardviewProps> = ({
  filteredStaff,
  loading,
  error,
  success,
  uiTheme,
  onEditStaff,
  onDeleteStaff
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateStaffRowActions(onEditStaff, onDeleteStaff)
  }, [onEditStaff, onDeleteStaff])

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
        {filteredStaff?.map((staff) => (
          <div key={staff.id} className="col-span-1 overflow-visible">
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
                  rowData={staff}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </div>

              {/* Staff Image Section */}
              <div
                className="h-48 relative overflow-hidden rounded-t-xl"
                style={{
                  '--bg-image': staff.profileImage 
                    ? `url(${getProfileImageUrl(staff.profileImage)})`
                    : 'none',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                } as React.CSSProperties}
              >
                {/* Blurred background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
                  style={{
                    backgroundImage: staff.profileImage 
                      ? `url(${getProfileImageUrl(staff.profileImage)})`
                      : 'none'
                  }}
                />
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: staff.profileImage 
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
                    src={getProfileImageUrl(staff.profileImage)}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      console.error('Staff Avatar image failed to load:', target.src)
                    }}
                  >
                    <span className="text-white font-bold text-5xl">
                      {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
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
                {/* Title and Email */}
                <div className="mb-4">
                  <Typography 
                    variant="h6" 
                    className="font-bold mb-1 leading-tight"
                    style={{ color: uiTheme.text }}
                  >
                    {staff.firstName} {staff.lastName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="text-sm"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    {staff.email} • ID: {staff.id}
                  </Typography>
                </div>

                {/* Status Chip */}
                <div className="flex justify-start mb-4">
                  <Chip
                    label={getStaffStatusDisplayName(staff.status)}
                    size="small"
                    className="text-white font-bold text-xs h-6 px-3"
                    style={{
                      backgroundColor: getStaffStatusColor(staff.status)
                    }}
                  />
                </div>

                {/* Additional Info - Simplified */}
                <div className="flex flex-col gap-2">
                  {staff.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                        {staff.phoneNumber}
                      </Typography>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <TimeIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                    <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                      {staff.workingHoursStart && staff.workingHoursEnd 
                        ? `${staff.workingHoursStart} - ${staff.workingHoursEnd}`
                        : staff.workingHoursStart 
                        ? `From ${staff.workingHoursStart}`
                        : staff.workingHoursEnd
                        ? `Until ${staff.workingHoursEnd}`
                        : 'Hours not set'
                      }
                    </Typography>
                  </div>
                  {staff.skills && (
                    <div className="flex items-center gap-2">
                      <SkillsIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                        {staff.skills.length > 30 
                          ? `${staff.skills.substring(0, 30)}...` 
                          : staff.skills
                        }
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredStaff?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${uiTheme.primary}10` }}
          >
            <PeopleIcon className="text-4xl" style={{ color: uiTheme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: uiTheme.text }}>
            No staff members found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Try adjusting your filters or add a new staff member
          </Typography>
        </div>
      )}
    </div>
  )
}

export default StaffCardview
