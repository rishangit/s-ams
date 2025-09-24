import React, { useMemo } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Typography
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as SubcategoryIcon
} from '@mui/icons-material'
import { ColDef } from 'ag-grid-community'
import CustomGrid from '../../../components/shared/custom/CustomGrid'
import { RowAction } from '../../../components/shared/RowActionsMenu'
import { Subcategory } from '../../../store/actions/categoryActions'

interface SubcategoriesGridviewProps {
  subcategories: Subcategory[]
  loading: boolean
  error: string | null
  success: string | null
  theme: any
  onEditSubcategory: (subcategoryId: number) => void
  onDeleteSubcategory: (subcategoryId: number) => void
}

const SubcategoriesGridview: React.FC<SubcategoriesGridviewProps> = ({
  subcategories,
  loading,
  error,
  success,
  theme,
  onEditSubcategory,
  onDeleteSubcategory
}) => {
  // Subcategory Cell Renderer Component
  const SubcategoryCellRenderer = (props: any) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-2 h-full" sx={{ minWidth: 0, overflow: 'hidden' }}>
        <Box
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: data.color || theme.primary }}
        >
          <SubcategoryIcon
            style={{ color: 'white', fontSize: '1.25rem' }}
          />
        </Box>
        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
          <div 
            className="font-semibold text-sm"
            style={{ 
              color: theme.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {data.name}
          </div>
          <div 
            className="text-xs"
            style={{ 
              color: theme.textSecondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            ID: {data.id}
          </div>
        </Box>
      </Box>
    )
  }

  // Description Cell Renderer Component
  const DescriptionCellRenderer = (props: any) => {
    const { value } = props
    const description = value || 'No description available'
    
    return (
      <div 
        className="flex items-center h-full" 
        style={{ 
          color: theme.textSecondary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}
      >
        {description}
      </div>
    )
  }

  // Color Cell Renderer Component
  const ColorCellRenderer = (props: any) => {
    const { value } = props
    const color = value || theme.primary
    
    return (
      <Box className="flex items-center gap-2 h-full">
        <Box
          className="w-4 h-4 rounded border flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <Typography
          variant="caption"
          style={{ color: theme.text }}
          className="font-mono"
        >
          {color}
        </Typography>
      </Box>
    )
  }

  // Icon Cell Renderer Component
  const IconCellRenderer = (props: any) => {
    const { value } = props
    const icon = value || 'N/A'
    
    return (
      <div 
        className="flex items-center h-full" 
        style={{ 
          color: theme.textSecondary,
          fontFamily: 'monospace',
          minWidth: 0
        }}
      >
        {icon}
      </div>
    )
  }

  // Sort Order Cell Renderer Component
  const SortOrderCellRenderer = (props: any) => {
    const { value } = props
    const sortOrder = value || 0
    
    return (
      <div className="flex items-center h-full justify-center">
        <Chip
          label={sortOrder}
          size="small"
          variant="outlined"
          style={{
            borderColor: theme.primary,
            color: theme.primary,
            fontSize: '0.75rem'
          }}
        />
      </div>
    )
  }

  // Category ID Cell Renderer Component
  const CategoryIdCellRenderer = (props: any) => {
    const { value } = props
    
    return (
      <div className="flex items-center h-full justify-center">
        <Chip
          label={value}
          size="small"
          style={{
            backgroundColor: theme.primary,
            color: 'white',
            fontSize: '0.75rem'
          }}
        />
      </div>
    )
  }

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: any) => {
    const { value } = props
    const isActive = value
    
    return (
      <div className="flex items-center h-full justify-center">
        <Chip
          label={isActive ? 'Active' : 'Inactive'}
          size="small"
          style={{
            backgroundColor: isActive ? '#10b981' : '#ef4444',
            color: 'white',
            fontSize: '0.75rem'
          }}
        />
      </div>
    )
  }

  // Define column definitions for the grid
  const columnDefs = useMemo((): ColDef[] => [
    {
      headerName: 'Subcategory',
      field: 'name',
      cellRenderer: SubcategoryCellRenderer,
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
      headerName: 'Description',
      field: 'description',
      cellRenderer: DescriptionCellRenderer,
      valueFormatter: (params) => params.value || 'No description available',
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
      headerName: 'Color',
      field: 'color',
      cellRenderer: ColorCellRenderer,
      valueFormatter: (params) => params.value || theme.primary,
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center'
      }
    },
    {
      headerName: 'Icon',
      field: 'icon',
      cellRenderer: IconCellRenderer,
      valueFormatter: (params) => params.value || 'N/A',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center'
      }
    },
    {
      headerName: 'Sort Order',
      field: 'sortOrder',
      cellRenderer: SortOrderCellRenderer,
      valueFormatter: (params) => String(params.value || 0),
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    {
      headerName: 'Category ID',
      field: 'categoryId',
      cellRenderer: CategoryIdCellRenderer,
      valueFormatter: (params) => String(params.value || ''),
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    {
      headerName: 'Status',
      field: 'isActive',
      cellRenderer: StatusCellRenderer,
      valueFormatter: (params) => params.value ? 'Active' : 'Inactive',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  ], [theme])

  // Define row actions
  const rowActions = useMemo((): RowAction[] => [
    {
      id: 'edit',
      label: 'Edit Subcategory',
      icon: <EditIcon fontSize="small" />,
      onClick: (rowData: Subcategory) => onEditSubcategory(rowData.id),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Subcategory',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (rowData: Subcategory) => onDeleteSubcategory(rowData.id),
      color: 'error'
    }
  ], [onEditSubcategory, onDeleteSubcategory])

  return (
    <CustomGrid
      title="Subcategories"
      data={subcategories || []}
      columnDefs={columnDefs}
      loading={loading}
      error={error}
      success={success}
      theme={theme}
      height="auto"
      showTitle={false}
      showAlerts={true}
      rowActions={rowActions}
    />
  )
}

export default SubcategoriesGridview

