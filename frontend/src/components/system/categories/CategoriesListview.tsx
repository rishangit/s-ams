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
  CategoryInfo, 
  CategoryDescription, 
  CategoryColor, 
  CategoryIconDisplay,
  CategorySortOrder,
  CategorySubcategoriesCount,
  CategoryStatusChip
} from './utils/categoryComponents'
import { 
  generateCategoryRowActions, 
  getCategoryTableHeaders
} from './utils/categoryUtils'
import CategoryPagination from './utils/CategoryPagination'

interface CategoriesListviewProps {
  categories: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onViewSubcategories: (categoryId: number) => void
  onEditCategory: (categoryId: number) => void
  onDeleteCategory: (categoryId: number) => void
}

const CategoriesListview: React.FC<CategoriesListviewProps> = ({
  categories,
  loading,
  error,
  success,
  uiTheme,
  onViewSubcategories,
  onEditCategory,
  onDeleteCategory
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateCategoryRowActions(onViewSubcategories, onEditCategory, onDeleteCategory)
  }, [onViewSubcategories, onEditCategory, onDeleteCategory])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getCategoryTableHeaders()
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
  const paginatedCategories = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return categories?.slice(startIndex, endIndex) || []
  }, [categories, page, rowsPerPage])

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
            {paginatedCategories.map((category) => (
              <TableRow key={category.id} hover>
                {/* Category */}
                <TableCell>
                  <CategoryInfo category={category} />
                </TableCell>

                {/* Description */}
                <TableCell>
                  <CategoryDescription description={category.description} />
                </TableCell>

                {/* Color */}
                <TableCell>
                  <CategoryColor color={category.color} />
                </TableCell>

                {/* Icon */}
                <TableCell>
                  <CategoryIconDisplay icon={category.icon} />
                </TableCell>

                {/* Sort Order */}
                <TableCell>
                  <CategorySortOrder sortOrder={category.sortOrder} />
                </TableCell>

                {/* Subcategories Count */}
                <TableCell>
                  <CategorySubcategoriesCount count={category.subcategories?.length} />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <CategoryStatusChip isActive={category.isActive} />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={category}
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
      <CategoryPagination
        count={categories?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        uiTheme={uiTheme}
      />
    </Box>
  )
}

export default CategoriesListview