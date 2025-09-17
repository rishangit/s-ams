import React, { useMemo } from 'react'
import { Box } from '@mui/material'
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
      <Box sx={{ padding: '12px 0', height: '100%', display: 'flex', alignItems: 'center' }}>
        <UserAvatar userName={userName} userProfileImage={userProfileImage} />
      </Box>
    )
  }

  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props

    return (
      <Box sx={{ padding: '12px 0', height: '100%', display: 'flex', alignItems: 'center' }}>
        <StatusChip status={value} />
      </Box>
    )
  }

  // Staff Assignment Cell Renderer
  const StaffAssignmentCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box sx={{ padding: '12px 0', height: '100%', display: 'flex', alignItems: 'center' }}>
        <StaffAssignment appointment={data} />
      </Box>
    )
  }

  // Service Cell Renderer
  const ServiceCellRenderer = (props: ICellRendererParams) => {
    const { value, data } = props
    const serviceName = value || 'Unknown Service'
    const servicePrice = data?.servicePrice
    
    return (
      <Box sx={{ padding: '12px 0', height: '100%', display: 'flex', alignItems: 'center' }}>
        <ServiceInfo serviceName={serviceName} servicePrice={servicePrice} />
      </Box>
    )
  }

  // Notes Cell Renderer
  const NotesCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    
    return (
      <Box sx={{ padding: '12px 0', height: '100%', display: 'flex', alignItems: 'center' }}>
        <NotesDisplay notes={value} />
      </Box>
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
        sortable: true,
        filter: 'agDateColumnFilter',
        resizable: true,
        width: 120,
        minWidth: 100
      },
      {
        headerName: 'Time',
        field: 'appointmentTime',
        sortable: true,
        filter: true,
        resizable: true,
        width: 100,
        minWidth: 80
      },
      {
        headerName: 'Service',
        field: 'serviceName',
        cellRenderer: ServiceCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 150
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: StatusCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 120,
        minWidth: 100
      },
      {
        headerName: 'Staff Assignment',
        field: 'staffAssignment',
        cellRenderer: StaffAssignmentCellRenderer,
        sortable: true,
        filter: true,
        resizable: true,
        width: 200,
        minWidth: 180
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
          minWidth: 180
        },
        {
          headerName: 'Company',
          field: 'companyName',
          sortable: true,
          filter: true,
          resizable: true,
          width: 150,
          minWidth: 120
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
        minWidth: 180
      })
    } else if (shouldShowCompanyColumn(user)) {
      // Regular user sees company column
      baseColumns.unshift({
        headerName: 'Company',
        field: 'companyName',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        minWidth: 120
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
        minWidth: 150
      },
      {
        headerName: 'Created',
        field: 'createdAt',
        sortable: true,
        filter: 'agDateColumnFilter',
        resizable: true,
        width: 120,
        minWidth: 100,
        valueGetter: (params) => new Date(params.data.createdAt).toLocaleDateString()
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
      height="calc(100vh - 280px)"
      showTitle={false}
      showAlerts={true}
      rowActions={rowActions}
      rowHeight={70}
    />
  )
}

export default AppointmentsGridview
