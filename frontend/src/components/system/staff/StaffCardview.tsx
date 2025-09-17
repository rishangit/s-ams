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
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  Work as SkillsIcon,
  People as PeopleIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  StaffInfo, 
  StaffStatusChip
} from './utils/staffComponents'
import { 
  generateStaffRowActions
} from './utils/staffUtils'

interface StaffCardviewProps {
  filteredStaff: any[]
  loading: boolean
  error: string | null
  success: string | null
  theme: any
  onEditStaff: (staffId: number) => void
  onDeleteStaff: (staffId: number) => void
}

const StaffCardview: React.FC<StaffCardviewProps> = ({
  filteredStaff,
  loading,
  error,
  success,
  theme,
  onEditStaff,
  onDeleteStaff
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateStaffRowActions(onEditStaff, onDeleteStaff)
  }, [onEditStaff, onDeleteStaff])

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
        {filteredStaff?.map((staff) => (
          <Grid item xs={12} sm={6} lg={4} key={staff.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                  borderColor: theme.primary
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
                  backgroundColor: theme.background,
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <RowActionsMenu
                  rowData={staff}
                  actions={rowActions}
                  theme={theme}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3, pt: 4 }}>
                {/* Header with Staff Info and Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1, pr: 1 }}>
                    <StaffInfo staff={staff} />
                  </Box>
                  <StaffStatusChip status={staff.status} />
                </Box>

                {/* Contact Information Section */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: `${theme.primary}08`,
                    border: `1px solid ${theme.primary}20`,
                    borderRadius: 2,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EmailIcon sx={{ color: theme.primary, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: '600', color: theme.text }}>
                        {staff.email}
                      </Typography>
                    </Box>
                    {staff.phoneNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PhoneIcon sx={{ color: theme.primary, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: '600', color: theme.text }}>
                          {staff.phoneNumber}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>

                {/* Working Hours Section */}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <TimeIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: '600', color: '#0ea5e9' }}>
                      {staff.workingHoursStart && staff.workingHoursEnd 
                        ? `${staff.workingHoursStart} - ${staff.workingHoursEnd}`
                        : staff.workingHoursStart 
                        ? `From ${staff.workingHoursStart}`
                        : staff.workingHoursEnd
                        ? `Until ${staff.workingHoursEnd}`
                        : 'Not set'
                      }
                    </Typography>
                  </Box>
                </Paper>

                {/* Skills Section */}
                {staff.skills && (
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
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <SkillsIcon sx={{ color: '#16a34a', fontSize: 20, mt: 0.5 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: '600', 
                          color: '#16a34a',
                          wordBreak: 'break-word'
                        }}
                      >
                        {staff.skills.length > 100 
                          ? `${staff.skills.substring(0, 100)}...` 
                          : staff.skills
                        }
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredStaff?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            backgroundColor: `${theme.primary}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <PeopleIcon sx={{ fontSize: 40, color: theme.primary }} />
          </Box>
          <Typography variant="h6" sx={{ color: theme.text, mb: 1, fontWeight: '600' }}>
            No staff members found
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Try adjusting your filters or add a new staff member
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default StaffCardview
