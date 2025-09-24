import React, { useMemo } from 'react'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material'
import { Avatar, Chip } from '@mui/material'
import { getRoleDisplayName } from '../../../constants/roles'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface UsersGridviewProps {
  filteredUsers: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  currentUserId?: number
  onViewUser: (userId: number) => void
  onEditUser: (userId: number) => void
  onDeleteUser: (userId: number) => void
}

const UsersGridview: React.FC<UsersGridviewProps> = ({
  filteredUsers,
  loading,
  error,
  success,
  uiTheme,
  currentUserId,
  onViewUser,
  onEditUser,
  onDeleteUser
}) => {
  const getRoleColor = (role: number) => {
    switch (role) {
      case 0: // Admin
        return '#d32f2f' // Red
      case 1: // Owner
        return '#1976d2' // Blue
      case 2: // Staff
        return '#388e3c' // Green
      case 3: // User
        return '#f57c00' // Orange
      default:
        return '#757575' // Grey
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // User Cell Renderer Component
  const UserCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    return (
      <div className="flex items-center gap-3 h-full" style={{ minWidth: 0, overflow: 'hidden' }}>
        <Avatar
          className="w-10 h-10 border-2 border-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: uiTheme.primary }}
          src={getProfileImageUrl(data.profileImage)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            console.error('User Avatar image failed to load:', target.src)
            console.error('User profile image path:', data.profileImage)
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

  // Role Cell Renderer Component
  const RoleCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    return (
      <div className="flex items-center h-full justify-center">
        <Chip
          label={getRoleDisplayName(value as any)}
          size="small"
          className="text-white font-bold"
          style={{
            backgroundColor: getRoleColor(value)
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
  const rowActions = useMemo<RowAction[]>(() => {
    const actions: RowAction[] = [
      {
        id: 'view',
        label: 'View User',
        icon: <ViewIcon fontSize="small" />,
        onClick: (rowData) => onViewUser(rowData.id),
        color: 'primary'
      },
      {
        id: 'edit',
        label: 'Edit User',
        icon: <EditIcon fontSize="small" />,
        onClick: (rowData) => onEditUser(rowData.id),
        color: 'info'
      },
      {
        id: 'delete',
        label: 'Delete User',
        icon: <DeleteIcon fontSize="small" />,
        onClick: (rowData) => onDeleteUser(rowData.id),
        color: 'error',
        disabled: (rowData) => rowData.id === currentUserId // Can't delete self
      }
    ]

    return actions
  }, [currentUserId, onViewUser, onEditUser, onDeleteUser])

  // Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'User',
      field: 'firstName',
      cellRenderer: UserCellRenderer,
      valueFormatter: (params) => params.value || '',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 2,
      minWidth: 200,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center'
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
        alignItems: 'center'
      }
    },
    {
      headerName: 'Phone',
      field: 'phoneNumber',
      cellRenderer: TextCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.data.phoneNumber || 'N/A',
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center'
      }
    },
    {
      headerName: 'Role',
      field: 'role',
      cellRenderer: RoleCellRenderer,
      valueFormatter: (params) => String(params.value || ''),
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
      headerName: 'Created',
      field: 'createdAt',
      cellRenderer: TextCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => formatDate(params.data.createdAt),
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center'
      }
    }
  ], [uiTheme, currentUserId])

  return (
    <CustomGrid
      title="Users Management"
      data={filteredUsers || []}
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

export default UsersGridview
