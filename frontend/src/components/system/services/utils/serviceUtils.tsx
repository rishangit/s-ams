import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'

// Generate row actions for services
export const generateServiceRowActions = (
  onEditService: (serviceId: number) => void,
  onDeleteService: (serviceId: number) => void
) => {
  const actions = []

  // Add Edit Service
  actions.push({
    id: 'edit',
    label: 'Edit Service',
    icon: <EditIcon fontSize="small" />,
    onClick: (rowData: any) => onEditService(rowData.id),
    color: 'primary'
  })

  actions.push({
    id: 'delete',
    label: 'Delete Service',
    icon: <DeleteIcon fontSize="small" />,
    onClick: (rowData: any) => onDeleteService(rowData.id),
    color: 'error'
  })

  return actions
}

// Get table headers for services
export const getServiceTableHeaders = () => {
  return ['Name', 'Description', 'Duration', 'Price', 'Status', 'Created', 'Actions']
}

// Format price display
export const formatPrice = (price: string | number): string => {
  const numericValue = typeof price === 'string' ? parseFloat(price) : price
  const formattedPrice = !isNaN(numericValue) ? numericValue.toFixed(2) : '0.00'
  return `$${formattedPrice}`
}

// Get status color
export const getServiceStatusColor = (status: string): string => {
  return status === 'active' ? '#10b981' : '#ef4444'
}

// Get status display name
export const getServiceStatusDisplayName = (status: string): string => {
  return status === 'active' ? 'Active' : 'Inactive'
}
