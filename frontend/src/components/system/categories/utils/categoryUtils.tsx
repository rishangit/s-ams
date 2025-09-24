import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'

// Generate row actions for categories
export const generateCategoryRowActions = (
  onViewSubcategories: (categoryId: number) => void,
  onEditCategory: (categoryId: number) => void,
  onDeleteCategory: (categoryId: number) => void
) => {
  const actions = []

  // Add View Subcategories
  actions.push({
    id: 'view-subcategories',
    label: 'Show Subcategories',
    icon: <ViewIcon fontSize="small" />,
    onClick: (rowData: any) => onViewSubcategories(rowData.id),
    color: 'primary'
  })

  // Add Edit Category
  actions.push({
    id: 'edit',
    label: 'Edit Category',
    icon: <EditIcon fontSize="small" />,
    onClick: (rowData: any) => onEditCategory(rowData.id),
    color: 'info'
  })

  // Add Delete Category
  actions.push({
    id: 'delete',
    label: 'Delete Category',
    icon: <DeleteIcon fontSize="small" />,
    onClick: (rowData: any) => onDeleteCategory(rowData.id),
    color: 'error'
  })

  return actions
}

// Get table headers for categories
export const getCategoryTableHeaders = () => {
  return ['Category', 'Description', 'Color', 'Icon', 'Sort Order', 'Subcategories', 'Status', 'Actions']
}

// Format description display
export const formatCategoryDescription = (description?: string): string => {
  return description || 'No description available'
}

// Format icon display
export const formatCategoryIcon = (icon?: string): string => {
  return icon || 'N/A'
}

// Format sort order display
export const formatCategorySortOrder = (sortOrder?: number): string => {
  return sortOrder?.toString() || '0'
}

// Format subcategories count display
export const formatSubcategoriesCount = (count?: number): string => {
  return count?.toString() || '0'
}

// Format status display
export const formatCategoryStatus = (isActive?: boolean): string => {
  return isActive ? 'Active' : 'Inactive'
}

// Get status color
export const getCategoryStatusColor = (isActive?: boolean): string => {
  return isActive ? '#10b981' : '#ef4444'
}
