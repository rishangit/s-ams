import React, { useMemo } from 'react'
import { ColDef } from 'ag-grid-community'
import CustomGrid from '../../shared/CustomGrid'
import { Box, Typography, Chip, Avatar } from '@mui/material'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { getRoleDisplayName } from '../../../constants/roles'
import { format } from 'date-fns'
import { RowAction } from '../../shared/RowActionsMenu'

interface CompanyUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: number
  profileImage?: string
  createdAt: string
  updatedAt: string
  totalAppointments: number
  lastAppointmentDate?: string
  firstAppointmentDate?: string
}

interface CompanyUsersGridviewProps {
  filteredUsers: CompanyUser[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onViewAppointments: (userId: number) => void
}

const CompanyUsersGridview: React.FC<CompanyUsersGridviewProps> = ({
  filteredUsers,
  loading,
  error,
  success,
  uiTheme,
  onViewAppointments
}) => {
  // Column definitions for the grid
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Name',
      field: 'name',
      width: 250,
      valueGetter: (params: any) => {
        const user = params.data as CompanyUser
        return `${user.firstName} ${user.lastName}`
      },
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center gap-3">
            <Avatar
              src={getProfileImageUrl(user.profileImage)}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 40, height: 40 }}
            />
            <Box className="flex flex-col">
              <Typography variant="body2" className="font-medium">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {getRoleDisplayName(user.role as any)}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 250,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2" className="truncate">
            {user.email}
          </Typography>
        )
      }
    },
    {
      headerName: 'Phone',
      field: 'phoneNumber',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {user.phoneNumber || 'N/A'}
          </Typography>
        )
      }
    },
    {
      headerName: 'Total Appointments',
      field: 'totalAppointments',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Chip
            label={user.totalAppointments}
            size="small"
            color="primary"
            variant="outlined"
          />
        )
      }
    },
    {
      headerName: 'First Appointment',
      field: 'firstAppointmentDate',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {user.firstAppointmentDate 
              ? format(new Date(user.firstAppointmentDate), 'MMM dd, yyyy')
              : 'N/A'
            }
          </Typography>
        )
      }
    },
    {
      headerName: 'Last Appointment',
      field: 'lastAppointmentDate',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {user.lastAppointmentDate 
              ? format(new Date(user.lastAppointmentDate), 'MMM dd, yyyy')
              : 'N/A'
            }
          </Typography>
        )
      }
    },
    {
      headerName: 'Member Since',
      field: 'createdAt',
      width: 150,
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Typography variant="body2">
            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
          </Typography>
        )
      }
    }
  ], [])

  // Row Actions Configuration
  const rowActions = useMemo<RowAction[]>(() => [
    {
      id: 'viewAppointments',
      label: 'View All Appointments',
      icon: <Box component="span" className="text-blue-600">👁</Box>,
      onClick: (rowData: CompanyUser) => onViewAppointments(rowData.id),
      color: 'primary'
    }
  ], [onViewAppointments])

  return (
    <CustomGrid
      title="Company Users"
      data={filteredUsers}
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

export default CompanyUsersGridview
