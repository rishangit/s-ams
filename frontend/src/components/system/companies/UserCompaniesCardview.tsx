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
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  generateUserCompanyRowActions
} from './utils/userCompanyUtils'

interface UserCompaniesCardviewProps {
  filteredUserCompanies: any[]
  loading: boolean
  error: string | null
  uiTheme: any
  onViewCompany: (companyId: number) => void
  onViewAppointments: (companyId: number) => void
  onBookAppointment: (companyId: number) => void
}

const UserCompaniesCardview: React.FC<UserCompaniesCardviewProps> = ({
  filteredUserCompanies,
  loading,
  error,
  uiTheme,
  onViewCompany,
  onViewAppointments,
  onBookAppointment
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateUserCompanyRowActions(onViewCompany, onViewAppointments, onBookAppointment)
  }, [onViewCompany, onViewAppointments, onBookAppointment])

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

  return (
    <div className="p-0 overflow-visible">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-visible">
        {filteredUserCompanies?.map((company) => (
          <div key={company.id} className="col-span-1 overflow-visible">
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
                  rowData={company}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </div>

              {/* Full-width Image Section with Blurred Background */}
              <div
                className="h-48 relative overflow-hidden rounded-t-xl"
                style={{
                  '--bg-image': 'none',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                } as React.CSSProperties}
              >
                {/* Blurred background with company theme */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 scale-110 blur-sm"
                />
                {/* Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30"
                />
                {/* Company Icon centered over blurred background */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <Avatar
                    className="w-30 h-30 border-4 border-white shadow-lg"
                    style={{ 
                      backgroundColor: uiTheme.primary,
                      width: 120,
                      height: 120
                    }}
                  >
                    <BusinessIcon className="text-white text-5xl" />
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
                {/* Title and Company Info */}
                <div className="mb-4">
                  <Typography 
                    variant="h6" 
                    className="font-bold mb-1 leading-tight"
                    style={{ color: uiTheme.text }}
                  >
                    {company.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    className="text-sm"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    ID: {company.id} • {new Date(company.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </div>

                {/* Status Category Tag */}
                <div className="flex justify-start mb-4">
                  <Chip
                    label={company.status?.charAt(0).toUpperCase() + company.status?.slice(1)}
                    size="small"
                    className="text-white font-bold text-xs h-6 px-3"
                    style={{
                      backgroundColor: company.status === 'active' ? '#16a34a' : 
                                      company.status === 'pending' ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>

                {/* Additional Info - Simplified */}
                <div className="flex flex-col gap-2">
                  {company.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                        {company.phoneNumber}
                      </Typography>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-center gap-2">
                      <LocationIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                      <Typography variant="body2" className="text-xs truncate" style={{ color: uiTheme.textSecondary }}>
                        {company.address}
                      </Typography>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                    <Typography variant="body2" className="text-xs" style={{ color: uiTheme.textSecondary }}>
                      {company.totalAppointments || 0} appointments
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredUserCompanies?.length === 0 && (
        <div className="text-center py-16">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${uiTheme.primary}10` }}
          >
            <BusinessIcon className="text-4xl" style={{ color: uiTheme.primary }} />
          </div>
          <Typography variant="h6" className="mb-2 font-semibold" style={{ color: uiTheme.text }}>
            No companies found
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Companies will appear here once you book appointments with them
          </Typography>
        </div>
      )}
    </div>
  )
}

export default UserCompaniesCardview