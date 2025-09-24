import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Edit, Delete, Inventory as ProductIcon, Warning as WarningIcon } from '@mui/icons-material'
import { Product } from '../../../types/product'

interface ProductsGridviewProps {
  filteredProducts: Product[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditProduct: (productId: number) => void
  onDeleteProduct: (productId: number) => void
}

const ProductsGridview: React.FC<ProductsGridviewProps> = ({
  filteredProducts,
  loading,
  error,
  success,
  uiTheme,
  onEditProduct,
  onDeleteProduct
}) => {
  // Product Cell Renderer Component
  const ProductCellRenderer = (props: ICellRendererParams) => {
    const product = props.data as Product
    
    return (
      <div className="flex items-center gap-3 h-full" style={{ minWidth: 0, overflow: 'hidden' }}>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: uiTheme.primary + '20' }}
        >
          <ProductIcon style={{ color: uiTheme.primary }} />
        </div>
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <div 
            className="font-semibold text-sm" 
            style={{ 
              color: uiTheme.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {product.name}
          </div>
          <div 
            className="text-xs" 
            style={{ 
              color: uiTheme.textSecondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {product.category || 'No category'}
          </div>
        </div>
      </div>
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
      <div className="flex items-center h-full justify-center">
        <Chip
          label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          size="small"
          style={{
            backgroundColor: getStatusColor(product.status),
            color: '#fff',
            fontWeight: 'bold'
          }}
        />
      </div>
    )
  }

  // Quantity Cell Renderer Component
  const QuantityCellRenderer = (props: ICellRendererParams) => {
    const product = props.data as Product
    const isLowStock = product.quantity <= product.minQuantity
    
    return (
      <div className="flex items-center gap-2 h-full justify-center">
        <span 
          className={`text-sm ${isLowStock ? 'text-red-600 font-semibold' : ''}`}
          style={{ 
            color: isLowStock ? '#ef4444' : uiTheme.text,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0
          }}
        >
          {product.quantity}
        </span>
        {isLowStock && (
          <WarningIcon style={{ color: '#ef4444', fontSize: 16, flexShrink: 0 }} />
        )}
      </div>
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
      <div 
        className="flex items-center h-full" 
        style={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}
      >
        <span 
          className="text-sm font-medium" 
          style={{ 
            color: uiTheme.text,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          ${unitPrice.toFixed(2)}
          {product.unit && (
            <span className="text-xs ml-1" style={{ color: uiTheme.textSecondary }}>/ {product.unit}</span>
          )}
        </span>
      </div>
    )
  }

  // Text Cell Renderer Component for simple text content
  const TextCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    return (
      <div 
        className="flex items-center h-full" 
        style={{ 
          color: uiTheme.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}
      >
        {value}
      </div>
    )
  }

  // Row Actions Configuration
  const rowActions: RowAction[] = useMemo(() => [
    {
      id: 'edit',
      label: 'Edit Product',
      icon: <Edit fontSize="small" />,
      onClick: (rowData) => onEditProduct(rowData.id),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Product',
      icon: <Delete fontSize="small" />,
      onClick: (rowData) => onDeleteProduct(rowData.id),
      color: 'error'
    }
  ], [onEditProduct, onDeleteProduct])

  // Column Definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Product',
      field: 'name',
      cellRenderer: ProductCellRenderer,
      valueFormatter: (params) => params.value || '',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 2,
      minWidth: 200,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Category',
      field: 'category',
      cellRenderer: TextCellRenderer,
      valueFormatter: (params) => params.value || 'No category',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Unit Price',
      field: 'unitPrice',
      cellRenderer: PriceCellRenderer,
      valueFormatter: (params) => {
        const unitPrice = typeof params.value === 'number' ? params.value : parseFloat(params.value) || 0
        return `$${unitPrice.toFixed(2)}`
      },
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      cellRenderer: QuantityCellRenderer,
      valueFormatter: (params) => String(params.value || 0),
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 80,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Min Qty',
      field: 'minQuantity',
      cellRenderer: TextCellRenderer,
      valueFormatter: (params) => String(params.value || 0),
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 70,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusCellRenderer,
      valueFormatter: (params) => params.value || '',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 80,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Supplier',
      field: 'supplier',
      cellRenderer: TextCellRenderer,
      valueFormatter: (params) => params.value || 'N/A',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'SKU',
      field: 'sku',
      cellRenderer: TextCellRenderer,
      valueFormatter: (params) => params.value || 'N/A',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }
  ], [uiTheme])

  return (
    <CustomGrid
      title="Products Management"
      data={filteredProducts || []}
      columnDefs={columnDefs}
      loading={loading}
      error={error}
      success={success}
      theme={uiTheme}
      height="auto"
      showTitle={false}
      showAlerts={true}
      rowActions={rowActions}
    />
  )
}

export default ProductsGridview
