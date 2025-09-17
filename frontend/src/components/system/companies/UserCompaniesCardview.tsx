import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Stack
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  UserCompanyInfo, 
  UserCompanyTotalAppointments
} from './utils/userCompanyComponents'
import { 
  generateUserCompanyRowActions
} from './utils/userCompanyUtils'

interface UserCompaniesCardviewProps {
  filteredUserCompanies: any[]
  loading: boolean
  error: string | null
  uiTheme: any
  onViewCompany: (companyId: number) => void
  onBookAppointment: (companyId: number) => void
}

const UserCompaniesCardview: React.FC<UserCompaniesCardviewProps> = ({
  filteredUserCompanies,
  loading,
  error,
  uiTheme,
  onViewCompany,
  onBookAppointment
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateUserCompanyRowActions(onViewCompany, onBookAppointment)
  }, [onViewCompany, onBookAppointment])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {filteredUserCompanies?.map((company) => (
          <Grid item xs={12} sm={6} lg={4} key={company.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: uiTheme.background,
                border: `1px solid ${uiTheme.border}`,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                  borderColor: uiTheme.primary
                }
              }}
            >
              {/* 3-Dot Menu in Top Right Corner */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  zIndex: 1,
                  backgroundColor: uiTheme.background,
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <RowActionsMenu
                  rowData={company}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3, pt: 4 }}>
                {/* Header with Company Info */}
                <Box sx={{ mb: 3 }}>
                  <UserCompanyInfo company={company} />
                </Box>

                {/* Contact Information Section */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: `${uiTheme.primary}08`,
                    border: `1px solid ${uiTheme.primary}20`,
                    borderRadius: 2,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PhoneIcon sx={{ color: uiTheme.primary, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: '600', color: uiTheme.text }}>
                        {company.phoneNumber || 'N/A'}
                      </Typography>
                    </Box>
                    {company.landPhone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PhoneIcon sx={{ color: uiTheme.primary, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: '600', color: uiTheme.text }}>
                          {company.landPhone}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>

                {/* Location Section */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #e0f2fe',
                    borderRadius: 2,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <LocationIcon sx={{ color: '#0ea5e9', fontSize: 20, mt: 0.5 }} />
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: '600', 
                          color: '#0ea5e9',
                          wordBreak: 'break-word'
                        }}
                      >
                        {company.address || 'N/A'}
                      </Typography>
                      {company.geoLocation && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#0ea5e9',
                            display: 'block',
                            mt: 0.5
                          }}
                        >
                          {company.geoLocation}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>

                {/* Total Appointments Section */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #dcfce7',
                    borderRadius: 2,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <CalendarIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: '600', color: '#16a34a' }}>
                      Total Appointments
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                      {company.totalAppointments || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#16a34a' }}>
                      appointments booked
                    </Typography>
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredUserCompanies?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            backgroundColor: `${uiTheme.primary}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <BusinessIcon sx={{ fontSize: 40, color: uiTheme.primary }} />
          </Box>
          <Typography variant="h6" sx={{ color: uiTheme.text, mb: 1, fontWeight: '600' }}>
            No companies found
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Companies will appear here once you book appointments with them
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default UserCompaniesCardview
