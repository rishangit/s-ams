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
  StaffInfo, 
  StaffEmail, 
  StaffPhone, 
  StaffWorkingHours, 
  StaffSkills, 
  StaffStatusChip
} from './utils/staffComponents'
import { 
  generateStaffRowActions, 
  getStaffTableHeaders
} from './utils/staffUtils'
import StaffPagination from './utils/StaffPagination'

interface StaffListviewProps {
  filteredStaff: any[]
  loading: boolean
  error: string | null
  success: string | null
  theme: any
  onEditStaff: (staffId: number) => void
  onDeleteStaff: (staffId: number) => void
}

const StaffListview: React.FC<StaffListviewProps> = ({
  filteredStaff,
  loading,
  error,
  success,
  theme,
  onEditStaff,
  onDeleteStaff
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateStaffRowActions(onEditStaff, onDeleteStaff)
  }, [onEditStaff, onDeleteStaff])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getStaffTableHeaders()
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
  const paginatedStaff = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredStaff?.slice(startIndex, endIndex) || []
  }, [filteredStaff, page, rowsPerPage])

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
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 350px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    backgroundColor: theme.background,
                    color: theme.text,
                    fontWeight: 'bold',
                    borderBottom: `2px solid ${theme.primary}`
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStaff.map((staff) => (
              <TableRow key={staff.id} hover>
                {/* Staff Member */}
                <TableCell>
                  <StaffInfo staff={staff} />
                </TableCell>

                {/* Email */}
                <TableCell>
                  <StaffEmail email={staff.email} />
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <StaffPhone phone={staff.phoneNumber} />
                </TableCell>

                {/* Working Hours */}
                <TableCell>
                  <StaffWorkingHours 
                    start={staff.workingHoursStart} 
                    end={staff.workingHoursEnd} 
                  />
                </TableCell>

                {/* Skills */}
                <TableCell>
                  <StaffSkills skills={staff.skills} />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StaffStatusChip status={staff.status} />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={staff}
                    actions={rowActions}
                    theme={theme}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <StaffPagination
        count={filteredStaff?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        theme={theme}
      />
    </Box>
  )
}

export default StaffListview
