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
  Stack,
  Avatar
} from '@mui/material'
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  CompanyInfo, 
  CompanyStatusChip
} from './utils/companyComponents'
import { 
  generateCompanyRowActions
} from './utils/companyUtils'

interface CompaniesCardviewProps {
  filteredCompanies: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onViewCompany: (companyId: number) => void
  onEditCompany: (companyId: number) => void
  onDeleteCompany: (companyId: number) => void
}

const CompaniesCardview: React.FC<CompaniesCardviewProps> = ({
  filteredCompanies,
  loading,
  error,
  success,
  uiTheme,
  onViewCompany,
  onEditCompany,
  onDeleteCompany
}) => {
  // Generate row actions
  const rowActions = useMemo(() => {
    return generateCompanyRowActions(onViewCompany, onEditCompany, onDeleteCompany)
  }, [onViewCompany, onEditCompany, onDeleteCompany])

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
        {filteredCompanies?.map((company) => (
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
                {/* Header with Company Info and Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1, pr: 1 }}>
                    <CompanyInfo company={company} />
                  </Box>
                  <CompanyStatusChip status={company.status} />
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

                {/* Owner Section */}
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
                    <PersonIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: '600', color: '#16a34a' }}>
                      Owner
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 4 }}>
                    <Avatar
                      sx={{ 
                        width: 32, 
                        height: 32,
                        backgroundColor: '#16a34a'
                      }}
                    >
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                        {company.userFirstName?.charAt(0)}{company.userLastName?.charAt(0)}
                      </span>
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: '600', color: '#16a34a' }}>
                        {company.userFirstName} {company.userLastName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon sx={{ color: '#16a34a', fontSize: 14 }} />
                        <Typography variant="caption" sx={{ color: '#16a34a' }}>
                          {company.userEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCompanies?.length === 0 && (
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
            Companies will appear here once they are registered in the system
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default CompaniesCardview
