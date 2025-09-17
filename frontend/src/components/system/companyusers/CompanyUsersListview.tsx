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
  CompanyUserInfo, 
  CompanyUserEmail, 
  CompanyUserPhone, 
  CompanyUserTotalAppointments,
  CompanyUserDate,
  CompanyUserMemberSince
} from './utils/companyUserComponents'
import { 
  generateCompanyUserRowActions, 
  getCompanyUserTableHeaders
} from './utils/companyUserUtils'
import CompanyUserPagination from './utils/CompanyUserPagination'

interface CompanyUsersListviewProps {
  filteredUsers: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onViewAppointments: (userId: number) => void
}

const CompanyUsersListview: React.FC<CompanyUsersListviewProps> = ({
  filteredUsers,
  loading,
  error,
  success,
  uiTheme,
  onViewAppointments
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateCompanyUserRowActions(onViewAppointments)
  }, [onViewAppointments])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getCompanyUserTableHeaders()
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
      <Box className="flex justify-center items-center h-48">
        <CircularProgress />
      </Box>
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
    <Box>
      <TableContainer component={Paper} className="max-h-[calc(100vh-350px)]">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell
                  key={header}
                  className="font-bold"
                  style={{
                    backgroundColor: uiTheme.background,
                    color: uiTheme.text,
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
                {/* Name */}
                <TableCell>
                  <CompanyUserInfo user={user} />
                </TableCell>

                {/* Email */}
                <TableCell>
                  <CompanyUserEmail email={user.email} />
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <CompanyUserPhone phone={user.phoneNumber} />
                </TableCell>

                {/* Total Appointments */}
                <TableCell>
                  <CompanyUserTotalAppointments count={user.totalAppointments} />
                </TableCell>

                {/* First Appointment */}
                <TableCell>
                  <CompanyUserDate date={user.firstAppointmentDate} label="First" />
                </TableCell>

                {/* Last Appointment */}
                <TableCell>
                  <CompanyUserDate date={user.lastAppointmentDate} label="Last" />
                </TableCell>

                {/* Member Since */}
                <TableCell>
                  <CompanyUserMemberSince date={user.createdAt} />
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
      <CompanyUserPagination
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

export default CompanyUsersListview
