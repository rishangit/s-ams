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
  AccessTime as TimeIcon,
  Notes as NotesIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { RowActionsMenu } from '../../../components/shared'
import { 
  UserAvatar, 
  StaffAssignment, 
  ServiceInfo, 
  StatusChip
} from './utils/appointmentComponents'
import { 
  generateRowActions, 
  shouldShowCustomerColumn, 
  shouldShowCompanyColumn 
} from './utils/appointmentUtils'

interface AppointmentsCardviewProps {
  filteredAppointments: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onStatusChange: (appointmentId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled', appointmentData?: any) => void
  onEditAppointment: (appointmentId: number) => void
  onDeleteAppointment: (appointmentId: number) => void
}

const AppointmentsCardview: React.FC<AppointmentsCardviewProps> = ({
  filteredAppointments,
  loading,
  error,
  success,
  uiTheme,
  onStatusChange,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const { user } = useSelector((state: RootState) => state.auth)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateRowActions(user, onStatusChange, onEditAppointment, onDeleteAppointment)
  }, [user, onStatusChange, onEditAppointment, onDeleteAppointment])

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

  if (success) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        {success}
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {filteredAppointments?.map((appointment) => (
          <Grid item xs={12} sm={6} lg={4} key={appointment.id}>
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
                  rowData={appointment}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3, pt: 4 }}>
                {/* Header with Service and Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1, pr: 1 }}>
                    <ServiceInfo 
                      serviceName={appointment.serviceName} 
                      servicePrice={appointment.servicePrice}
                      variant="h6"
                    />
                  </Box>
                  <StatusChip status={appointment.status} />
                </Box>

                {/* Date and Time Section */}
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
                      <CalendarIcon sx={{ color: uiTheme.primary, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: '600', color: uiTheme.text }}>
                        {appointment.appointmentDate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <TimeIcon sx={{ color: uiTheme.primary, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: '600', color: uiTheme.text }}>
                        {appointment.appointmentTime}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Customer Info */}
                {shouldShowCustomerColumn(user) && (
                  <Box sx={{ mb: 2 }}>
                    <UserAvatar 
                      userName={appointment.userName || 'Unknown User'} 
                      userProfileImage={appointment.userProfileImage}
                      size={36}
                    />
                  </Box>
                )}

                {/* Company Info */}
                {shouldShowCompanyColumn(user) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <BusinessIcon sx={{ color: uiTheme.primary, fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: '600', color: uiTheme.text }}>
                        {appointment.companyName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Company
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Staff Assignment */}
                <Box sx={{ mb: 2 }}>
                  <StaffAssignment appointment={appointment} showLabel={true} />
                </Box>

                {/* Notes */}
                {appointment.notes && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: 2,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <NotesIcon sx={{ color: '#6c757d', fontSize: 18, mt: 0.2 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#495057',
                          fontStyle: 'italic',
                          lineHeight: 1.5
                        }}
                      >
                        {appointment.notes}
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Created Date */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  pt: 1,
                  borderTop: `1px solid ${uiTheme.border}`
                }}>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    Created: {new Date(appointment.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAppointments?.length === 0 && (
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
            <CalendarIcon sx={{ fontSize: 40, color: uiTheme.primary }} />
          </Box>
          <Typography variant="h6" sx={{ color: uiTheme.text, mb: 1, fontWeight: '600' }}>
            No appointments found
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Try adjusting your filters or create a new appointment
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default AppointmentsCardview
