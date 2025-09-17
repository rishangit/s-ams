import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { RowActionsMenu } from '../../../components/shared'
import { 
  UserAvatar, 
  StaffAssignment, 
  ServiceInfo, 
  StatusChip, 
  NotesDisplay 
} from './utils/appointmentComponents'
import { 
  generateRowActions, 
  getTableHeaders, 
  shouldShowCustomerColumn, 
  shouldShowCompanyColumn 
} from './utils/appointmentUtils'
import AppointmentPagination from './utils/AppointmentPagination'

interface AppointmentsListviewProps {
  filteredAppointments: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onStatusChange: (appointmentId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled', appointmentData?: any) => void
  onEditAppointment: (appointmentId: number) => void
  onDeleteAppointment: (appointmentId: number) => void
}

const AppointmentsListview: React.FC<AppointmentsListviewProps> = ({
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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateRowActions(user, onStatusChange, onEditAppointment, onDeleteAppointment)
  }, [user, onStatusChange, onEditAppointment, onDeleteAppointment])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getTableHeaders(user)
  }, [user])

  // Pagination handlers
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get paginated data
  const paginatedAppointments = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredAppointments?.slice(startIndex, endIndex) || []
  }, [filteredAppointments, page, rowsPerPage])

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
            {paginatedAppointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                {/* Customer Column */}
                {shouldShowCustomerColumn(user) && (
                  <TableCell>
                    <UserAvatar 
                      userName={appointment.userName || 'Unknown User'} 
                      userProfileImage={appointment.userProfileImage} 
                    />
                  </TableCell>
                )}

                {/* Company Column */}
                {shouldShowCompanyColumn(user) && (
                  <TableCell>
                    <Typography variant="body2">
                      {appointment.companyName}
                    </Typography>
                  </TableCell>
                )}

                {/* Date */}
                <TableCell>
                  <Typography variant="body2">
                    {appointment.appointmentDate}
                  </Typography>
                </TableCell>

                {/* Time */}
                <TableCell>
                  <Typography variant="body2">
                    {appointment.appointmentTime}
                  </Typography>
                </TableCell>

                {/* Service */}
                <TableCell>
                  <ServiceInfo 
                    serviceName={appointment.serviceName} 
                    servicePrice={appointment.servicePrice} 
                  />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusChip status={appointment.status} />
                </TableCell>

                {/* Staff Assignment */}
                <TableCell>
                  <StaffAssignment appointment={appointment} />
                </TableCell>

                {/* Notes */}
                <TableCell>
                  <NotesDisplay notes={appointment.notes} />
                </TableCell>

                {/* Created */}
                <TableCell>
                  <Typography variant="body2">
                    {new Date(appointment.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={appointment}
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
      <AppointmentPagination
        count={filteredAppointments?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        uiTheme={uiTheme}
      />
    </Box>
  )
}

export default AppointmentsListview
