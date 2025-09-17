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
import { RowActionsMenu } from '../../../components/shared'
import { 
  ServiceName, 
  ServiceDescription, 
  ServiceDuration, 
  ServicePrice, 
  ServiceStatusChip
} from './utils/serviceComponents'
import { 
  generateServiceRowActions, 
  getServiceTableHeaders
} from './utils/serviceUtils'
import ServicePagination from './utils/ServicePagination'

interface ServicesListviewProps {
  filteredServices: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditService: (serviceId: number) => void
  onDeleteService: (serviceId: number) => void
}

const ServicesListview: React.FC<ServicesListviewProps> = ({
  filteredServices,
  loading,
  error,
  success,
  uiTheme,
  onEditService,
  onDeleteService
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateServiceRowActions(onEditService, onDeleteService)
  }, [onEditService, onDeleteService])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getServiceTableHeaders()
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
  const paginatedServices = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredServices?.slice(startIndex, endIndex) || []
  }, [filteredServices, page, rowsPerPage])

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
            {paginatedServices.map((service) => (
              <TableRow key={service.id} hover>
                {/* Name */}
                <TableCell>
                  <ServiceName name={service.name} variant="body2" />
                </TableCell>

                {/* Description */}
                <TableCell>
                  <ServiceDescription description={service.description} />
                </TableCell>

                {/* Duration */}
                <TableCell>
                  <ServiceDuration duration={service.duration} />
                </TableCell>

                {/* Price */}
                <TableCell>
                  <ServicePrice price={service.price} />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <ServiceStatusChip status={service.status} />
                </TableCell>

                {/* Created */}
                <TableCell>
                  <Typography variant="body2">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={service}
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
      <ServicePagination
        count={filteredServices?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        uiTheme={uiTheme}
      />
    </Box>
  )
}

export default ServicesListview
