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
  ProductName, 
  ProductCategory, 
  ProductPrice, 
  ProductQuantity, 
  ProductSupplier,
  ProductSKU,
  ProductStatusChip
} from './utils/productComponents'
import { 
  generateProductRowActions, 
  getProductTableHeaders
} from './utils/productUtils'
import ProductPagination from './utils/ProductPagination'

interface ProductsListviewProps {
  filteredProducts: any[]
  loading: boolean
  error: string | null
  success: string | null
  theme: any
  onEditProduct: (productId: number) => void
  onDeleteProduct: (productId: number) => void
}

const ProductsListview: React.FC<ProductsListviewProps> = ({
  filteredProducts,
  loading,
  error,
  success,
  theme,
  onEditProduct,
  onDeleteProduct
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateProductRowActions(onEditProduct, onDeleteProduct)
  }, [onEditProduct, onDeleteProduct])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getProductTableHeaders()
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
  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredProducts?.slice(startIndex, endIndex) || []
  }, [filteredProducts, page, rowsPerPage])

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
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} hover>
                {/* Product */}
                <TableCell>
                  <ProductName 
                    name={product.name} 
                    category={product.category} 
                    variant="body2" 
                  />
                </TableCell>

                {/* Category */}
                <TableCell>
                  <ProductCategory category={product.category} />
                </TableCell>

                {/* Unit Price */}
                <TableCell>
                  <ProductPrice price={product.unitPrice} unit={product.unit} />
                </TableCell>

                {/* Quantity */}
                <TableCell>
                  <ProductQuantity 
                    quantity={product.quantity} 
                    minQuantity={product.minQuantity} 
                  />
                </TableCell>

                {/* Min Qty */}
                <TableCell>
                  <Typography variant="body2">
                    {product.minQuantity}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <ProductStatusChip status={product.status} />
                </TableCell>

                {/* Supplier */}
                <TableCell>
                  <ProductSupplier supplier={product.supplier} />
                </TableCell>

                {/* SKU */}
                <TableCell>
                  <ProductSKU sku={product.sku} />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <RowActionsMenu
                    rowData={product}
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
      <ProductPagination
        count={filteredProducts?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        theme={theme}
      />
    </Box>
  )
}

export default ProductsListview
