import React, { useMemo } from 'react'
import { Avatar, Chip } from '@mui/material'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Edit, Delete } from '@mui/icons-material'
import { STAFF_STATUS, getStatusDisplayName } from '../../../constants/staffStatus'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface StaffGridviewProps {
  filteredStaff: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditStaff: (staffId: number) => void
  onDeleteStaff: (staffId: number) => void
}

const StaffGridview: React.FC<StaffGridviewProps> = ({
  filteredStaff,
  loading,
  error,
  success,
  uiTheme,
  onEditStaff,
  onDeleteStaff
}) => {
  // Staff Cell Renderer Component
  const StaffCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    return (
      <div className="flex items-center gap-3 h-full" style={{ minWidth: 0, overflow: 'hidden' }}>
        <Avatar
          className="w-10 h-10 border-2 border-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: uiTheme.primary }}
          src={getProfileImageUrl(data.profileImage)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            console.error('Staff Avatar image failed to load:', target.src)
            console.error('Staff profile image path:', data.profileImage)
          }}
        >
          <span className="text-white font-semibold text-sm">
            {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
          </span>
        </Avatar>
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
            {data.firstName} {data.lastName}
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
            ID: {data.id}
          </div>
        </div>
      </div>
    )
  }

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const status = props.value
    const displayName = getStatusDisplayName(status)
    
    // Color mapping for different statuses
    const getStatusColor = (status: number) => {
      switch (status) {
        case STAFF_STATUS.ACTIVE:
          return '#10b981' // Green
        case STAFF_STATUS.INACTIVE:
          return '#6b7280' // Gray
        case STAFF_STATUS.SUSPENDED:
          return '#f59e0b' // Orange
        case STAFF_STATUS.TERMINATED:
          return '#ef4444' // Red
        default:
          return '#6b7280' // Gray
      }
    }
    
    return (
      <div className="flex items-center h-full justify-center">
        <Chip
          label={displayName}
          size="small"
          style={{
            backgroundColor: getStatusColor(status),
            color: '#fff',
            fontWeight: 'bold'
          }}
        />
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
      label: 'Edit Staff',
      icon: <Edit fontSize="small" />,
      onClick: (rowData) => onEditStaff(rowData.id),
      color: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Staff',
      icon: <Delete fontSize="small" />,
      onClick: (rowData) => onDeleteStaff(rowData.id),
      color: 'error'
    }
  ], [onEditStaff, onDeleteStaff])

  // Column Definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Staff Member',
      field: 'firstName',
      cellRenderer: StaffCellRenderer,
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
      headerName: 'Email',
      field: 'email',
      cellRenderer: TextCellRenderer,
      valueFormatter: (params) => params.value || '',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 2,
      minWidth: 150,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Phone',
      field: 'phoneNumber',
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
      headerName: 'Working Hours',
      field: 'workingHours',
      cellRenderer: TextCellRenderer,
      valueFormatter: (params) => {
        const data = params.data
        if (!data) return ''
        const start = data.workingHoursStart || ''
        const end = data.workingHoursEnd || ''
        if (start && end) {
          return `${start} - ${end}`
        } else if (start) {
          return `From ${start}`
        } else if (end) {
          return `Until ${end}`
        }
        return 'Not set'
      },
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
      headerName: 'Skills',
      field: 'skills',
      cellRenderer: TextCellRenderer,
      valueFormatter: (params) => {
        const skills = params.data?.skills
        return skills ? (skills.length > 50 ? skills.substring(0, 50) + '...' : skills) : 'None'
      },
      sortable: true,
      filter: true,
      resizable: true,
      flex: 2,
      minWidth: 150,
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
      valueFormatter: (params) => String(params.value || ''),
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
      title="Staff Members"
      data={filteredStaff || []}
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

export default StaffGridview
