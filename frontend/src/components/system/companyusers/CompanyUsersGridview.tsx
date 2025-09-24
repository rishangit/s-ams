import React, { useMemo } from 'react'
import { ColDef } from 'ag-grid-community'
import CustomGrid from '../../shared/custom/CustomGrid'
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
      flex: 2,
      minWidth: 200,
      valueGetter: (params: any) => {
        const user = params.data as CompanyUser
        return `${user.firstName} ${user.lastName}`
      },
      valueFormatter: (params) => {
        const user = params.data as CompanyUser
        return `${user.firstName} ${user.lastName}`
      },
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center gap-3 h-full" sx={{ minWidth: 0, overflow: 'hidden' }}>
            <Avatar
              src={getProfileImageUrl(user.profileImage)}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 40, height: 40, flexShrink: 0 }}
            />
            <Box className="flex flex-col" sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography 
                variant="body2" 
                className="font-medium"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Typography 
                variant="caption" 
                style={{ color: uiTheme.textSecondary }}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {getRoleDisplayName(user.role as any)}
              </Typography>
            </Box>
          </Box>
        )
      },
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
      flex: 2,
      minWidth: 150,
      valueFormatter: (params) => params.value || '',
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center h-full">
            <Typography 
              variant="body2" 
              style={{ 
                color: uiTheme.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              {user.email}
            </Typography>
          </Box>
        )
      },
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
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || 'N/A',
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center h-full">
            <Typography 
              variant="body2" 
              style={{ 
                color: uiTheme.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              {user.phoneNumber || 'N/A'}
            </Typography>
          </Box>
        )
      },
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Total Appointments',
      field: 'totalAppointments',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => String(params.value || 0),
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center h-full justify-center">
            <Chip
              label={user.totalAppointments}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )
      },
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'First Appointment',
      field: 'firstAppointmentDate',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        if (!params.value) return 'N/A'
        try {
          return format(new Date(params.value), 'MMM dd, yyyy')
        } catch {
          return 'Invalid Date'
        }
      },
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center h-full">
            <Typography 
              variant="body2" 
              style={{ 
                color: uiTheme.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              {user.firstAppointmentDate 
                ? format(new Date(user.firstAppointmentDate), 'MMM dd, yyyy')
                : 'N/A'
              }
            </Typography>
          </Box>
        )
      },
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Last Appointment',
      field: 'lastAppointmentDate',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        if (!params.value) return 'N/A'
        try {
          return format(new Date(params.value), 'MMM dd, yyyy')
        } catch {
          return 'Invalid Date'
        }
      },
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center h-full">
            <Typography 
              variant="body2" 
              style={{ 
                color: uiTheme.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              {user.lastAppointmentDate 
                ? format(new Date(user.lastAppointmentDate), 'MMM dd, yyyy')
                : 'N/A'
              }
            </Typography>
          </Box>
        )
      },
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    {
      headerName: 'Member Since',
      field: 'createdAt',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        try {
          return format(new Date(params.value), 'MMM dd, yyyy')
        } catch {
          return 'Invalid Date'
        }
      },
      cellRenderer: (params: any) => {
        const user = params.data as CompanyUser
        return (
          <Box className="flex items-center h-full">
            <Typography 
              variant="body2" 
              style={{ 
                color: uiTheme.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
            >
              {format(new Date(user.createdAt), 'MMM dd, yyyy')}
            </Typography>
          </Box>
        )
      },
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }
  ], [uiTheme])

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
      height="auto"
      showTitle={false}
      showAlerts={true}
      rowActions={rowActions}
      rowHeight={70}
    />
  )
}

export default CompanyUsersGridview
