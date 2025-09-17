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
  Person as PersonIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  UserInfo, 
  UserRoleChip
} from './utils/userComponents'
import { 
  generateUserRowActions
} from './utils/userUtils'

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
        {filteredUsers?.map((user) => (
          <Grid item xs={12} sm={6} lg={4} key={user.id}>
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
                  rowData={user}
                  actions={rowActions}
                  theme={uiTheme}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3, pt: 4 }}>
                {/* Header with User Info and Role */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1, pr: 1 }}>
                    <UserInfo user={user} />
                  </Box>
                  <UserRoleChip role={user.role} />
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
                      <EmailIcon sx={{ color: uiTheme.primary, fontSize: 20 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: '600', 
                          color: uiTheme.text,
                          wordBreak: 'break-word'
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                    {user.phoneNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PhoneIcon sx={{ color: uiTheme.primary, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: '600', color: uiTheme.text }}>
                          {user.phoneNumber}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>

                {/* Created Date Section */}
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
                    <DateIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: '600', color: '#0ea5e9' }}>
                      Joined: {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Paper>

                {/* User ID Section */}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: '600', color: '#16a34a' }}>
                      User ID: {user.id}
                    </Typography>
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredUsers?.length === 0 && (
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
            <PersonIcon sx={{ fontSize: 40, color: uiTheme.primary }} />
          </Box>
          <Typography variant="h6" sx={{ color: uiTheme.text, mb: 1, fontWeight: '600' }}>
            No users found
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Try adjusting your filters or add a new user
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default UsersCardview
