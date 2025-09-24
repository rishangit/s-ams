import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { Subcategory } from '../../../../store/actions/categoryActions'
import { RowAction } from '../../../shared/RowActionsMenu'

export const generateSubcategoryRowActions = (
  onEditSubcategory: (subcategoryId: number) => void,
  onDeleteSubcategory: (subcategoryId: number) => void
): RowAction[] => {
  return [
    {
      id: 'edit',
      label: 'Edit Subcategory',
      icon: <EditIcon fontSize="small" />,
      onClick: (rowData: Subcategory) => onEditSubcategory(rowData.id!),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Subcategory',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (rowData: Subcategory) => onDeleteSubcategory(rowData.id!),
      color: 'error'
    }
  ]
}

export const getSubcategoryTableHeaders = () => {
  return ['Subcategory', 'Description', 'Color', 'Icon', 'Sort Order', 'Category ID', 'Status', 'Actions']
}

export const getSubcategoryStatusColor = (isActive: boolean) => {
  return isActive ? '#10b981' : '#ef4444' // Green for active, Red for inactive
}

export const getSubcategoryStatusDisplayName = (isActive: boolean) => {
  return isActive ? 'Active' : 'Inactive'
}
