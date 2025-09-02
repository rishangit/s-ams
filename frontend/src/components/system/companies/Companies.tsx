import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import {
  getAllCompaniesRequest,
  updateCompanyStatusRequest,
  deleteCompanyRequest,
  clearCompanyError,
  clearCompanySuccess
} from '../../../store/actions/companyActions'
import { CompanyStatus, getCompanyStatusDisplayName, getCompanyStatusColor } from '../../../constants/company'
import { isAdminRole } from '../../../constants/roles'

const Companies: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { companies, loading, error, success } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load companies when component mounts
  useEffect(() => {
    console.log('User role:', user?.role, typeof user?.role)
    if (user && isAdminRole(parseInt(user.role) as any)) {
      dispatch(getAllCompaniesRequest())
    }
  }, [user?.role, dispatch])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearCompanyError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearCompanySuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  const handleStatusChange = (companyId: number, newStatus: CompanyStatus) => {
    dispatch(updateCompanyStatusRequest({ id: companyId, status: newStatus }))
  }

  const handleDeleteCompany = (companyId: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      dispatch(deleteCompanyRequest(companyId))
    }
  }

  const filteredCompanies = companies?.filter(company => {
    if (statusFilter === 'all') return true
    return company.status === statusFilter
  }) || []

  if (!user || !isAdminRole(parseInt(user.role) as any)) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography variant="h6" style={{ color: uiTheme.text }}>
          Access Denied. Admin privileges required. User role: {user?.role} (type: {typeof user?.role})
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="mx-auto p-6">
      <Typography
        variant="h4"
        className="mb-6 font-bold"
        style={{ color: uiTheme.text }}
      >
        Companies Management
      </Typography>

      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Filter Section */}
      <Box className="mb-6">
        <FormControl className="min-w-48">
          <InputLabel style={{ color: uiTheme.textSecondary }}>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ color: uiTheme.text }}
          >
            <MenuItem value="all">All Companies</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Companies Table */}
      <Paper
        className="overflow-hidden"
        style={{ backgroundColor: uiTheme.surface }}
      >
        {loading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: uiTheme.primary }}>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Company
                  </TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Contact Info
                  </TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Location
                  </TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Owner
                  </TableCell>
                  <TableCell style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Typography style={{ color: uiTheme.textSecondary }}>
                        No companies found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow
                      key={company.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {/* Company Info */}
                      <TableCell>
                        <Box className="flex items-center space-x-3">
                          <Avatar
                            style={{ backgroundColor: uiTheme.primary }}
                            className="w-12 h-12"
                          >
                            <BusinessIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              className="font-semibold"
                              style={{ color: uiTheme.text }}
                            >
                              {company.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-600 dark:text-gray-400"
                              style={{ color: uiTheme.textSecondary }}
                            >
                              ID: {company.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell>
                        <Box className="space-y-1">
                          <Box className="flex items-center space-x-2">
                            <PhoneIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                            <Typography
                              variant="body2"
                              style={{ color: uiTheme.text }}
                            >
                              {company.phoneNumber}
                            </Typography>
                          </Box>
                          <Box className="flex items-center space-x-2">
                            <PhoneIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                            <Typography
                              variant="body2"
                              style={{ color: uiTheme.text }}
                            >
                              {company.landPhone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <Box className="flex items-center space-x-2">
                          <LocationIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />
                          <Box>
                            <Typography
                              variant="body2"
                              className="font-medium"
                              style={{ color: uiTheme.text }}
                            >
                              {company.geoLocation}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-sm"
                              style={{ color: uiTheme.textSecondary }}
                            >
                              {company.address}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Select
                          value={company.status}
                          onChange={(e) => handleStatusChange(company.id!, e.target.value as CompanyStatus)}
                          size="small"
                          style={{ 
                            color: '#ffffff',
                            backgroundColor: getCompanyStatusColor(company.status),
                            minWidth: '100px'
                          }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </TableCell>

                      {/* Owner */}
                      <TableCell>
                        <Box className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              className="font-medium"
                              style={{ color: uiTheme.text }}
                            >
                              {company.userFirstName} {company.userLastName}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-sm"
                              style={{ color: uiTheme.textSecondary }}
                            >
                              {company.userEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Box className="flex space-x-1">
                          <Tooltip title="Edit Company">
                            <IconButton
                              size="small"
                              style={{ color: uiTheme.primary }}
                              onClick={() => {
                                // TODO: Implement edit functionality
                                console.log('Edit company:', company.id)
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Company">
                            <IconButton
                              size="small"
                              style={{ color: '#ef4444' }}
                              onClick={() => handleDeleteCompany(company.id!)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Summary */}
      <Box className="mt-4 p-4 rounded-lg" style={{ backgroundColor: uiTheme.surface }}>
        <Typography
          variant="h6"
          className="mb-2"
          style={{ color: uiTheme.text }}
        >
          Summary
        </Typography>
        <Box className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Box className="text-center p-3 rounded-lg" style={{ backgroundColor: uiTheme.primary }}>
            <Typography variant="h4" style={{ color: '#ffffff' }}>
              {companies?.length || 0}
            </Typography>
            <Typography variant="body2" style={{ color: '#ffffff' }}>
              Total Companies
            </Typography>
          </Box>
          <Box className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f59e0b' }}>
            <Typography variant="h4" style={{ color: '#ffffff' }}>
              {companies?.filter(c => c.status === 'pending').length || 0}
            </Typography>
            <Typography variant="body2" style={{ color: '#ffffff' }}>
              Pending
            </Typography>
          </Box>
          <Box className="text-center p-3 rounded-lg" style={{ backgroundColor: '#10b981' }}>
            <Typography variant="h4" style={{ color: '#ffffff' }}>
              {companies?.filter(c => c.status === 'active').length || 0}
            </Typography>
            <Typography variant="body2" style={{ color: '#ffffff' }}>
              Active
            </Typography>
          </Box>
          <Box className="text-center p-3 rounded-lg" style={{ backgroundColor: '#ef4444' }}>
            <Typography variant="h4" style={{ color: '#ffffff' }}>
              {companies?.filter(c => c.status === 'inactive').length || 0}
            </Typography>
            <Typography variant="body2" style={{ color: '#ffffff' }}>
              Inactive
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Companies
