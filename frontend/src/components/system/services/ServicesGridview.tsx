import React, { useMemo } from 'react'
import { Chip } from '@mui/material'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface ServicesGridviewProps {
  filteredServices: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditService: (serviceId: number) => void
  onDeleteService: (serviceId: number) => void
}

const ServicesGridview: React.FC<ServicesGridviewProps> = ({
  filteredServices,
  loading,
  error,
  success,
  uiTheme,
  onEditService,
  onDeleteService
}) => {
  // Status Cell Renderer
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    return (
      <div className="flex items-center h-full justify-center">
        <Chip
          label={value}
          size="small"
          style={{
            backgroundColor: value === 'active' ? '#10b981' : '#ef4444',
            color: '#ffffff',
            fontWeight: 'bold'
          }}
        />
      </div>
    )
  }

  // Price Cell Renderer
  const PriceCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    const formattedPrice = !isNaN(numericValue) ? numericValue.toFixed(2) : '0.00'
    return (
      <div 
        className="flex items-center h-full" 
        style={{ 
          fontWeight: 'bold', 
          color: uiTheme.primary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0
        }}
      >
        ${formattedPrice}
      </div>
    )
  }

  // Duration Cell Renderer
  const DurationCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
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
        {data.duration || 'Not specified'}
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
      label: 'Edit Service',
      icon: <EditIcon fontSize="small" />,
      onClick: (rowData) => onEditService(rowData.id),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Service',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (rowData) => onDeleteService(rowData.id),
      color: 'error'
    }
  ], [onEditService, onDeleteService])

  // Column Definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Service Name',
      field: 'name',
      cellRenderer: TextCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150,
      maxWidth: 300,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Description',
      field: 'description',
      cellRenderer: TextCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200,
      maxWidth: 400,
      valueGetter: (params) => params.data.description || 'No description',
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Duration',
      field: 'duration',
      cellRenderer: DurationCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100,
      maxWidth: 150,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Price',
      field: 'price',
      cellRenderer: PriceCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      resizable: true,
      width: 100,
      minWidth: 80,
      maxWidth: 120,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 100,
      minWidth: 80,
      maxWidth: 120,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      cellRenderer: TextCellRenderer,
      sortable: true,
      filter: 'agDateColumnFilter',
      resizable: true,
      width: 110,
      minWidth: 100,
      maxWidth: 130,
      valueGetter: (params) => new Date(params.data.createdAt).toLocaleDateString(),
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center'
        }
    }
  ], [uiTheme])

  return (
    <CustomGrid
      title="Services"
      data={filteredServices || []}
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

export default ServicesGridview
