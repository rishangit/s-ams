import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  UserInfo, 
  UserEmail, 
  UserPhone, 
  UserRoleChip,
  UserDate
} from './utils/userComponents'
import { 
  generateUserRowActions, 
  getUserTableHeaders
} from './utils/userUtils'
import UserPagination from './utils/UserPagination'

interface UsersListviewProps {
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

const UsersListview: React.FC<UsersListviewProps> = ({
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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateUserRowActions(onViewUser, onEditUser, onDeleteUser, currentUserId)
  }, [onViewUser, onEditUser, onDeleteUser, currentUserId])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getUserTableHeaders()
  }, [])

  // Pagination handlers
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get paginated data
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredUsers?.slice(startIndex, endIndex) || []
  }, [filteredUsers, page, rowsPerPage])

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
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 'none', minHeight: '400px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    backgroundColor: uiTheme.background,
                    color: uiTheme.text,
                    fontWeight: 'bold',
                    borderBottom: `2px solid ${uiTheme.primary}`
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} hover>
                {/* User */}
                <TableCell>
                  <UserInfo user={user} />
                </TableCell>

                {/* Email */}
                <TableCell>
                  <UserEmail email={user.email} />
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <UserPhone phone={user.phoneNumber} />
                </TableCell>

                {/* Role */}
                <TableCell>
                  <UserRoleChip role={user.role} />
                </TableCell>

                {/* Created */}
                <TableCell>
                  <UserDate date={user.createdAt} />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={user}
                    actions={rowActions}
                    theme={uiTheme}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <UserPagination
        count={filteredUsers?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        uiTheme={uiTheme}
      />
    </Box>
  )
}

export default UsersListview
