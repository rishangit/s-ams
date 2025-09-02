import React, { useState, useEffect } from 'react'
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
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { getRoleDisplayName } from '../../../constants/roles'
import { useUsers } from '../../../hooks/useUsers'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: number
  profileImage?: string
  createdAt: string
  updatedAt: string
}

const Users: React.FC = () => {

  const { user: currentUser } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { 
    users, 
    loading, 
    error, 
    success, 
    fetchAllUsers, 
    clearError, 
    clearSuccess 
  } = useUsers()
  

  
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearSuccess()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, clearSuccess])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getRoleColor = (role: number) => {
    switch (role) {
      case 0: // Admin
        return '#d32f2f' // Red
      case 1: // Owner
        return '#1976d2' // Blue
      case 2: // Staff
        return '#388e3c' // Green
      case 3: // User
        return '#f57c00' // Orange
      default:
        return '#757575' // Grey
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress style={{ color: uiTheme.primary }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="mx-auto p-6">
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box className="mx-auto p-6">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography
          variant="h4"
          className="font-bold"
          style={{ color: uiTheme.text }}
        >
          Users Management
        </Typography>
        <Tooltip title="Refresh Users">
          <IconButton
            onClick={fetchAllUsers}
            disabled={loading}
            style={{ color: uiTheme.primary }}
            className="hover:bg-opacity-10"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

             {/* Success/Error Messages */}
       {success && (
         <Alert severity="success" className="mb-4">
           {success}
         </Alert>
       )}

      {/* Users Table */}
      <Paper 
        className="overflow-hidden shadow-lg"
        style={{ backgroundColor: uiTheme.surface }}
      >
        <TableContainer>
          <Table>
                                                   <TableHead>
                <TableRow style={{ backgroundColor: uiTheme.background }}>
                  <TableCell 
                    style={{ color: uiTheme.text, fontWeight: 'bold' }}
                    className="font-semibold"
                  >
                    User
                  </TableCell>
                  <TableCell 
                    style={{ color: uiTheme.text, fontWeight: 'bold' }}
                    className="font-semibold"
                  >
                    ID
                  </TableCell>
                  <TableCell 
                    style={{ color: uiTheme.text, fontWeight: 'bold' }}
                    className="font-semibold"
                  >
                    Email
                  </TableCell>
                  <TableCell 
                    style={{ color: uiTheme.text, fontWeight: 'bold' }}
                    className="font-semibold"
                  >
                    Phone
                  </TableCell>
                  <TableCell 
                    style={{ color: uiTheme.text, fontWeight: 'bold' }}
                    className="font-semibold"
                  >
                    Role
                  </TableCell>
                  <TableCell 
                    style={{ color: uiTheme.text, fontWeight: 'bold' }}
                    className="font-semibold"
                  >
                    Created
                  </TableCell>
                </TableRow>
              </TableHead>
                                                   <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user: User) => (
                    <TableRow 
                      key={user.id}
                      className="hover:bg-opacity-50 transition-colors"
                      style={{ 
                        backgroundColor: user.id === currentUser?.id 
                          ? `${uiTheme.primary}20` 
                          : 'transparent'
                      }}
                    >
                      <TableCell>
                        <Box className="flex items-center space-x-3">
                                                                               <Avatar
                            className="w-10 h-10 border-2 border-white shadow-sm"
                            style={{ backgroundColor: uiTheme.primary }}
                            src={user.profileImage ? `/uploads/${user.profileImage}` : undefined}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement
                              console.error('User Avatar image failed to load:', target.src)
                              console.error('User profile image path:', user.profileImage)
                            }}
                            
                          >
                            <span className="text-white font-semibold text-sm">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              className="font-semibold"
                              style={{ color: uiTheme.text }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          style={{ color: uiTheme.text }}
                          className="font-semibold"
                        >
                          {user.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          style={{ color: uiTheme.text }}
                        >
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          style={{ color: uiTheme.text }}
                        >
                          {user.phoneNumber || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleDisplayName(user.role as any)}
                          size="small"
                          style={{
                            backgroundColor: getRoleColor(user.role),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          style={{ color: uiTheme.textSecondary }}
                        >
                          {formatDate(user.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ 
            backgroundColor: uiTheme.background,
            color: uiTheme.text 
          }}
        />
      </Paper>

      {/* Summary */}
      <Box className="mt-4 p-4 rounded-lg" style={{ backgroundColor: uiTheme.background }}>
        <Typography variant="body2" style={{ color: uiTheme.textSecondary }}>
          Total Users: {users.length} | Current Page: {page + 1} of {Math.ceil(users.length / rowsPerPage)}
        </Typography>
      </Box>
    </Box>
  )
}

export default Users 