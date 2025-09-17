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
  UserCompanyInfo, 
  UserCompanyContactInfo, 
  UserCompanyLocation, 
  UserCompanyTotalAppointments
} from './utils/userCompanyComponents'
import { 
  generateUserCompanyRowActions, 
  getUserCompanyTableHeaders
} from './utils/userCompanyUtils'
import UserCompanyPagination from './utils/UserCompanyPagination'

interface UserCompaniesListviewProps {
  filteredUserCompanies: any[]
  loading: boolean
  error: string | null
  uiTheme: any
  onViewCompany: (companyId: number) => void
  onViewAppointments: (companyId: number) => void
  onBookAppointment: (companyId: number) => void
}

const UserCompaniesListview: React.FC<UserCompaniesListviewProps> = ({
  filteredUserCompanies,
  loading,
  error,
  uiTheme,
  onViewCompany,
  onViewAppointments,
  onBookAppointment
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateUserCompanyRowActions(onViewCompany, onViewAppointments, onBookAppointment)
  }, [onViewCompany, onViewAppointments, onBookAppointment])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getUserCompanyTableHeaders()
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
  const paginatedUserCompanies = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredUserCompanies?.slice(startIndex, endIndex) || []
  }, [filteredUserCompanies, page, rowsPerPage])

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
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 350px)' }}>
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
            {paginatedUserCompanies.map((company) => (
              <TableRow key={company.id} hover>
                {/* Company */}
                <TableCell>
                  <UserCompanyInfo company={company} />
                </TableCell>

                {/* Contact Info */}
                <TableCell>
                  <UserCompanyContactInfo 
                    phoneNumber={company.phoneNumber} 
                    landPhone={company.landPhone} 
                  />
                </TableCell>

                {/* Location */}
                <TableCell>
                  <UserCompanyLocation 
                    address={company.address} 
                    geoLocation={company.geoLocation} 
                  />
                </TableCell>

                {/* Total Appointments */}
                <TableCell>
                  <UserCompanyTotalAppointments totalAppointments={company.totalAppointments} />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={company}
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
      <UserCompanyPagination
        count={filteredUserCompanies?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        uiTheme={uiTheme}
      />
    </Box>
  )
}

export default UserCompaniesListview
