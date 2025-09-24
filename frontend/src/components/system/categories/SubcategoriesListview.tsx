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
  SubcategoryInfo, 
  SubcategoryDescription, 
  SubcategoryColor, 
  SubcategoryIconDisplay,
  SubcategorySortOrder,
  SubcategoryCategoryId,
  SubcategoryStatusChip
} from './utils/subcategoryComponents'
import { 
  generateSubcategoryRowActions, 
  getSubcategoryTableHeaders
} from './utils/subcategoryUtils'
import SubcategoryPagination from './utils/SubcategoryPagination'

interface SubcategoriesListviewProps {
  subcategories: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditSubcategory: (subcategoryId: number) => void
  onDeleteSubcategory: (subcategoryId: number) => void
}

const SubcategoriesListview: React.FC<SubcategoriesListviewProps> = ({
  subcategories,
  loading,
  error,
  success,
  uiTheme,
  onEditSubcategory,
  onDeleteSubcategory
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateSubcategoryRowActions(onEditSubcategory, onDeleteSubcategory)
  }, [onEditSubcategory, onDeleteSubcategory])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getSubcategoryTableHeaders()
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
  const paginatedSubcategories = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return subcategories?.slice(startIndex, endIndex) || []
  }, [subcategories, page, rowsPerPage])

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
            {paginatedSubcategories.length > 0 ? paginatedSubcategories.map((subcategory) => (
              <TableRow key={subcategory.id} hover>
                {/* Subcategory */}
                <TableCell>
                  <SubcategoryInfo subcategory={subcategory} />
                </TableCell>

                {/* Description */}
                <TableCell>
                  <SubcategoryDescription description={subcategory.description} />
                </TableCell>

                {/* Color */}
                <TableCell>
                  <SubcategoryColor color={subcategory.color} themePrimary={uiTheme.primary} />
                </TableCell>

                {/* Icon */}
                <TableCell>
                  <SubcategoryIconDisplay icon={subcategory.icon} />
                </TableCell>

                {/* Sort Order */}
                <TableCell>
                  <SubcategorySortOrder sortOrder={subcategory.sortOrder} />
                </TableCell>

                {/* Category ID */}
                <TableCell>
                  <SubcategoryCategoryId categoryId={subcategory.categoryId} />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <SubcategoryStatusChip isActive={subcategory.isActive} />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={subcategory}
                    actions={rowActions}
                    theme={uiTheme}
                  />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Typography
                    variant="h6"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    No subcategories found
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: uiTheme.textSecondary }}
                    className="mt-2"
                  >
                    Subcategories will appear here once they are created.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <SubcategoryPagination
        count={subcategories?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        uiTheme={uiTheme}
      />
    </Box>
  )
}

export default SubcategoriesListview
