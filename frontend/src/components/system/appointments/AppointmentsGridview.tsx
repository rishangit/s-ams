import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { CustomGrid, RowAction } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { 
  UserAvatar, 
  StaffAssignment, 
  ServiceInfo, 
  StatusChip, 
  NotesDisplay 
} from './utils/appointmentComponents'
import { 
  generateRowActions, 
  shouldShowCustomerColumn, 
  shouldShowCompanyColumn 
} from './utils/appointmentUtils'

interface AppointmentsGridviewProps {
  filteredAppointments: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onStatusChange: (appointmentId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled', appointmentData?: any) => void
  onEditAppointment: (appointmentId: number) => void
  onDeleteAppointment: (appointmentId: number) => void
}

const AppointmentsGridview: React.FC<AppointmentsGridviewProps> = ({
  filteredAppointments,
  loading,
  error,
  success,
  uiTheme,
  onStatusChange,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const { user } = useSelector((state: RootState) => state.auth)

  // User Avatar Cell Renderer
  const UserAvatarCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    const userName = data?.userName || 'Unknown User'
    const userProfileImage = data?.userProfileImage
    
    return (
      <div className="flex items-center h-full">
        <UserAvatar userName={userName} userProfileImage={userProfileImage} />
      </div>
    )
  }

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props

    return (
      <div className="flex items-center h-full">
        <StatusChip status={value} />
      </div>
    )
  }

  // Staff Assignment Cell Renderer
  const StaffAssignmentCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <div className="flex items-center h-full">
        <StaffAssignment appointment={data} />
      </div>
    )
  }

  // Service Cell Renderer
  const ServiceCellRenderer = (props: ICellRendererParams) => {
    const { value, data } = props
    const serviceName = value || 'Unknown Service'
    const servicePrice = data?.servicePrice
    
    return (
      <div className="flex items-center h-full">
        <ServiceInfo serviceName={serviceName} servicePrice={servicePrice} />
      </div>
    )
  }

  // Notes Cell Renderer
  const NotesCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    
    return (
      <div className="flex items-center h-full">
        <NotesDisplay notes={value} />
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

  // Generate row actions
  const rowActions = useMemo<RowAction[]>(() => {
    return generateRowActions(user, onStatusChange, onEditAppointment, onDeleteAppointment)
  }, [user, onStatusChange, onEditAppointment, onDeleteAppointment])

  // Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: 'Date',
        field: 'appointmentDate',
        cellRenderer: TextCellRenderer,
        sortable: true,
        filter: 'agDateColumnFilter',
        resizable: true,
        width: 110,
        minWidth: 100,
        maxWidth: 130,
        valueGetter: (params) => new Date(params.data.appointmentDate).toLocaleDateString(),
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      },
      {
        headerName: 'Time',
        field: 'appointmentTime',
        cellRenderer: TextCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 90,
        minWidth: 80,
        maxWidth: 110,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      },
      {
        headerName: 'Service',
        field: 'serviceName',
        cellRenderer: ServiceCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 220,
        minWidth: 180,
        maxWidth: 300,
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
        sortable: true,
        filter: true,
        resizable: true,
        width: 120,
        minWidth: 100,
        maxWidth: 140,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      {
        headerName: 'Staff Assignment',
        field: 'staffAssignment',
        cellRenderer: StaffAssignmentCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 180,
        maxWidth: 250,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }
    ]

    // Add role-specific columns
    if (shouldShowCustomerColumn(user) && shouldShowCompanyColumn(user)) {
      // Admin sees all columns
      baseColumns.unshift(
        {
          headerName: 'Customer',
          field: 'userName',
          cellRenderer: UserAvatarCellRenderer,
          sortable: true,
          filter: true,
          resizable: true,
          width: 200,
          minWidth: 180,
          maxWidth: 250,
          cellStyle: { 
            display: 'flex', 
            alignItems: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        },
        {
          headerName: 'Company',
          field: 'companyName',
          cellRenderer: TextCellRenderer,
          sortable: true,
          filter: true,
          resizable: true,
          width: 150,
          minWidth: 120,
          maxWidth: 200,
          cellStyle: { 
            display: 'flex', 
            alignItems: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }
      )
    } else if (shouldShowCustomerColumn(user)) {
      // Company owner sees user column
      baseColumns.unshift({
        headerName: 'Customer',
        field: 'userName',
        cellRenderer: UserAvatarCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 180,
        maxWidth: 250,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      })
    } else if (shouldShowCompanyColumn(user)) {
      // Regular user sees company column
      baseColumns.unshift({
        headerName: 'Company',
        field: 'companyName',
        cellRenderer: TextCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        minWidth: 120,
        maxWidth: 200,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      })
    }

    // Add common columns
    baseColumns.push(
      {
        headerName: 'Notes',
        field: 'notes',
        cellRenderer: NotesCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 150,
        maxWidth: 300,
        cellStyle: { 
          display: 'flex', 
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
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
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }
    )

    return baseColumns
  }, [user, uiTheme])

  return (
    <CustomGrid
      title="Appointments"
      data={filteredAppointments || []}
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

export default AppointmentsGridview
