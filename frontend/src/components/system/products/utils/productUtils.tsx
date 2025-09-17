import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'

// Generate row actions for products
export const generateProductRowActions = (
  onEditProduct: (productId: number) => void,
  onDeleteProduct: (productId: number) => void
) => {
  const actions = []

  // Add Edit Product
  actions.push({
    id: 'edit',
    label: 'Edit Product',
    icon: <EditIcon fontSize="small" />,
    onClick: (rowData: any) => onEditProduct(rowData.id),
    color: 'primary'
  })

  actions.push({
    id: 'delete',
    label: 'Delete Product',
    icon: <DeleteIcon fontSize="small" />,
    onClick: (rowData: any) => onDeleteProduct(rowData.id),
    color: 'error'
  })

  return actions
}

// Get table headers for products
export const getProductTableHeaders = () => {
  return ['Product', 'Category', 'Unit Price', 'Quantity', 'Min Qty', 'Status', 'Supplier', 'SKU', 'Actions']
}

// Get status color for products
export const getProductStatusColor = (status: string): string => {
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

// Get status display name
export const getProductStatusDisplayName = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Format price display
export const formatProductPrice = (price: string | number, unit?: string): string => {
  const numericValue = typeof price === 'string' ? parseFloat(price) : price
  const formattedPrice = !isNaN(numericValue) ? numericValue.toFixed(2) : '0.00'
  return unit ? `$${formattedPrice} / ${unit}` : `$${formattedPrice}`
}

// Check if product is low stock
export const isLowStock = (quantity: number, minQuantity: number): boolean => {
  return quantity <= minQuantity
}

// Format category display
export const formatCategory = (category?: string): string => {
  return category || 'No category'
}

// Format supplier display
export const formatSupplier = (supplier?: string): string => {
  return supplier || 'N/A'
}

// Format SKU display
export const formatSKU = (sku?: string): string => {
  return sku || 'N/A'
}
