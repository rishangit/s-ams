import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { CustomGrid, RowAction } from '../../shared'
import ProductForm from './ProductForm'
import ProductsListview from './ProductsListview'
import ProductsCardview from './ProductsCardview'
import {
  getProductsRequest,
  deleteProductRequest,
  clearProductsMessages,
  getProductCategoriesRequest
} from '../../../store/actions/productsActions'
import { useTheme } from '../../../hooks/useTheme'
import { Edit, Delete, Add, Inventory as ProductIcon, Warning as WarningIcon, ViewModule as GridViewIcon, ViewList as ListViewIcon, ViewComfy as CardViewIcon } from '@mui/icons-material'
import { Button, Box, Dialog, DialogTitle, DialogContent, Typography, Chip, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import { Product } from '../../../types/product'

const Products: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { products, loading, error, success, categories } = useSelector((state: RootState) => state.products)
  const { theme } = useTheme()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'card'>('grid')
  const [userSelectedView, setUserSelectedView] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Load products when component mounts
  useEffect(() => {
    if (user && parseInt(String(user.role)) === 1) {
      dispatch(getProductsRequest())
      dispatch(getProductCategoriesRequest())
    }
  }, [user?.role, dispatch])

  // Auto-switch to card view on mobile (only if user hasn't manually selected a view)
  useEffect(() => {
    if (!userSelectedView) {
      if (isMobile && viewMode !== 'card') {
        setViewMode('card')
      } else if (!isMobile && viewMode === 'card') {
        setViewMode('grid')
      }
    }
  }, [isMobile, viewMode, userSelectedView])

  // Reset user selection when screen size changes significantly
  useEffect(() => {
    setUserSelectedView(false)
  }, [isMobile])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearProductsMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success, dispatch])

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProductRequest(productId))
    }
  }

  const handleEditProduct = (productId: number) => {
    setEditingProductId(productId)
    setIsEditModalOpen(true)
  }

  const handleAddProduct = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseModals = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setEditingProductId(null)
  }

  // Handle view mode change
  const handleViewModeChange = (newViewMode: 'grid' | 'list' | 'card') => {
    setViewMode(newViewMode)
    setUserSelectedView(true)
  }


  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    if (!products) return []
    
    return products.filter(product => {
      const matchesStatus = !statusFilter || product.status === statusFilter
      const matchesCategory = !categoryFilter || product.category === categoryFilter
      const matchesSearch = !searchFilter || 
        product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (product.sku && product.sku.toLowerCase().includes(searchFilter.toLowerCase()))
      
      return matchesStatus && matchesCategory && matchesSearch
    })
  }, [products, statusFilter, categoryFilter, searchFilter])

  // Product Cell Renderer Component
  const ProductCellRenderer = (props: ICellRendererParams) => {
    const product = props.data as Product
    
    return (
      <Box className="flex items-center gap-3">
        <Box
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: theme.primary + '20' }}
        >
          <ProductIcon style={{ color: theme.primary }} />
        </Box>
        <Box className="flex flex-col">
          <Typography variant="body2" className="font-medium">
            {product.name}
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            {product.category || 'No category'}
          </Typography>
        </Box>
      </Box>
    )
  }

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const product = props.data as Product
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active':
          return '#10b981' // Green
        case 'inactive':
          return '#6b7280' // Gray
        case 'discontinued':
          return '#ef4444' // Red
        default:
          return '#6b7280' // Gray
      }
    }
    
    return (
      <Chip
        label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        size="small"
        style={{
          backgroundColor: getStatusColor(product.status),
          color: '#fff',
          fontWeight: 'bold'
        }}
      />
    )
  }

  // Quantity Cell Renderer Component
  const QuantityCellRenderer = (props: ICellRendererParams) => {
    const product = props.data as Product
    const isLowStock = product.quantity <= product.minQuantity
    
    return (
      <Box className="flex items-center gap-2">
        <Typography 
          variant="body2" 
          className={isLowStock ? 'text-red-600 font-semibold' : ''}
        >
          {product.quantity}
        </Typography>
        {isLowStock && (
          <WarningIcon style={{ color: '#ef4444', fontSize: 16 }} />
        )}
      </Box>
    )
  }

  // Price Cell Renderer Component
  const PriceCellRenderer = (props: ICellRendererParams) => {
    const product = props.data as Product
    
    // Ensure unitPrice is a number
    const unitPrice = typeof product.unitPrice === 'number' 
      ? product.unitPrice 
      : parseFloat(product.unitPrice) || 0
    
    return (
      <Typography variant="body2" className="font-medium">
        ${unitPrice.toFixed(2)}
        {product.unit && (
          <span className="text-gray-500 text-xs ml-1">/ {product.unit}</span>
        )}
      </Typography>
    )
  }

  // Row Actions Configuration
  const rowActions: RowAction[] = [
    {
      id: 'edit',
      label: 'Edit Product',
      icon: <Edit fontSize="small" />,
      onClick: (rowData) => handleEditProduct(rowData.id),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Product',
      icon: <Delete fontSize="small" />,
      onClick: (rowData) => handleDeleteProduct(rowData.id),
      color: 'error'
    }
  ]

  const columnDefs: ColDef[] = [
    {
      headerName: 'Product',
      field: 'name',
      cellRenderer: ProductCellRenderer,
      flex: 2,
      minWidth: 250
    },
    {
      headerName: 'Category',
      field: 'category',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.data.category || 'No category'
    },
    {
      headerName: 'Unit Price',
      field: 'unitPrice',
      cellRenderer: PriceCellRenderer,
      flex: 1,
      minWidth: 120
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      cellRenderer: QuantityCellRenderer,
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Min Qty',
      field: 'minQuantity',
      flex: 0.8,
      minWidth: 80
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusCellRenderer,
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Supplier',
      field: 'supplier',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.data.supplier || 'N/A'
    },
    {
      headerName: 'SKU',
      field: 'sku',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.data.sku || 'N/A'
    }
  ]

  // Show loading while user is being loaded
  if (!user) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: theme.text }}
        >
          Loading user data...
        </Typography>
      </Box>
    )
  }

  // Show access denied if user is not a company owner
  if (parseInt(String(user.role)) !== 1) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: theme.text }}
        >
          Access denied. This page is only available for company owners.
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="h-full md:p-6">
      {/* Header Section */}
      <Box className="mb-6">
        <Box className="flex items-center justify-between mb-4">
          <Box>
            <Typography 
              variant="h4" 
              className="font-bold mb-2"
              style={{ color: theme.text }}
            >
              <Box className="flex items-center gap-2">
                <ProductIcon />
                Products Management
              </Box>
            </Typography>
            <Typography 
              variant="body1"
              style={{ color: theme.textSecondary }}
            >
              Manage your inventory and product catalog
            </Typography>
          </Box>
          <Box className="flex items-center gap-4">
            {/* View Switcher */}
            <Box className="flex items-center gap-1 border rounded-lg p-1" style={{ borderColor: theme.border }}>
              {!isMobile && (
                <Tooltip title="Grid View">
                  <IconButton
                    size="small"
                    onClick={() => handleViewModeChange('grid')}
                    style={{
                      backgroundColor: viewMode === 'grid' ? theme.primary : 'transparent',
                      color: viewMode === 'grid' ? '#ffffff' : theme.text
                    }}
                  >
                    <GridViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {!isMobile && (
                <Tooltip title="List View">
                  <IconButton
                    size="small"
                    onClick={() => handleViewModeChange('list')}
                    style={{
                      backgroundColor: viewMode === 'list' ? theme.primary : 'transparent',
                      color: viewMode === 'list' ? '#ffffff' : theme.text
                    }}
                  >
                    <ListViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Card View">
                <IconButton
                  size="small"
                  onClick={() => handleViewModeChange('card')}
                  style={{
                    backgroundColor: viewMode === 'card' ? theme.primary : 'transparent',
                    color: viewMode === 'card' ? '#ffffff' : theme.text
                  }}
                >
                  <CardViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddProduct}
              style={{ backgroundColor: theme.primary }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box className="flex flex-wrap gap-4 mb-4">
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ minWidth: 200 }}
          />
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="discontinued">Discontinued</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Conditional Rendering of Grid, List, or Card View */}
      {viewMode === 'grid' ? (
        <CustomGrid
          title="Products"
          data={filteredProducts || []}
          columnDefs={columnDefs}
          loading={loading}
          error={error}
          success={success}
          theme={theme}
          height="calc(100vh - 280px)"
          showTitle={false}
          showAlerts={true}
          rowActions={rowActions}
          rowHeight={70}
        />
      ) : viewMode === 'list' ? (
        <ProductsListview
          filteredProducts={filteredProducts || []}
          loading={loading}
          error={error}
          success={success}
          theme={theme}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      ) : (
        <ProductsCardview
          filteredProducts={filteredProducts || []}
          loading={loading}
          error={error}
          success={success}
          theme={theme}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Add Product Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: theme.surface,
            color: theme.text
          }
        }}
      >
        <DialogTitle style={{ color: theme.text }}>
          Add New Product
        </DialogTitle>
        <DialogContent>
          <ProductForm
            isOpen={isAddModalOpen}
            onClose={handleCloseModals}
            productId={null}
            onSuccess={() => {
              handleCloseModals()
              dispatch(getProductsRequest()) // Refresh the list
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: theme.surface,
            color: theme.text
          }
        }}
      >
        <DialogTitle style={{ color: theme.text }}>
          Edit Product
        </DialogTitle>
        <DialogContent>
          <ProductForm
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            productId={editingProductId}
            onSuccess={() => {
              handleCloseModals()
              dispatch(getProductsRequest()) // Refresh the list
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Products
