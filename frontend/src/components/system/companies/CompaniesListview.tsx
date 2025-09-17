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
  CompanyInfo, 
  CompanyContactInfo, 
  CompanyLocation, 
  CompanyStatusChip,
  CompanyOwner
} from './utils/companyComponents'
import { 
  generateCompanyRowActions, 
  getCompanyTableHeaders
} from './utils/companyUtils'
import CompanyPagination from './utils/CompanyPagination'

interface CompaniesListviewProps {
  filteredCompanies: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onViewCompany: (companyId: number) => void
  onEditCompany: (companyId: number) => void
  onDeleteCompany: (companyId: number) => void
}

const CompaniesListview: React.FC<CompaniesListviewProps> = ({
  filteredCompanies,
  loading,
  error,
  success,
  uiTheme,
  onViewCompany,
  onEditCompany,
  onDeleteCompany
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateCompanyRowActions(onViewCompany, onEditCompany, onDeleteCompany)
  }, [onViewCompany, onEditCompany, onDeleteCompany])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getCompanyTableHeaders()
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
  const paginatedCompanies = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredCompanies?.slice(startIndex, endIndex) || []
  }, [filteredCompanies, page, rowsPerPage])

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
            {paginatedCompanies.map((company) => (
              <TableRow key={company.id} hover>
                {/* Company */}
                <TableCell>
                  <CompanyInfo company={company} />
                </TableCell>

                {/* Contact Info */}
                <TableCell>
                  <CompanyContactInfo 
                    phoneNumber={company.phoneNumber} 
                    landPhone={company.landPhone} 
                  />
                </TableCell>

                {/* Location */}
                <TableCell>
                  <CompanyLocation 
                    address={company.address} 
                    geoLocation={company.geoLocation} 
                  />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <CompanyStatusChip status={company.status} />
                </TableCell>

                {/* Owner */}
                <TableCell>
                  <CompanyOwner owner={company} />
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
      <CompanyPagination
        count={filteredCompanies?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        uiTheme={uiTheme}
      />
    </Box>
  )
}

export default CompaniesListview
