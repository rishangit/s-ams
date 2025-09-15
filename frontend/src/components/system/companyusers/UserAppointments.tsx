import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { ColDef } from 'ag-grid-community'
import CustomGrid from '../../shared/CustomGrid'
import { Box, Typography, Avatar, Chip } from '@mui/material'
import { ArrowBack as BackIcon } from '@mui/icons-material'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { format } from 'date-fns'
import { apiService } from '../../../services/api'
import { 
  getStatusDisplayName, 
  getStatusColor 
} from '../../../constants/appointmentStatus'

interface UserAppointment {
  id: number
  userId: number
  companyId: number
  serviceId: number
  staffId?: number
  staffPreferences?: number[]
  appointmentDate: string
  appointmentTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
  // Joined data
  userName?: string
  userEmail?: string
  userProfileImage?: string
  companyName?: string
  serviceName?: string
  servicePrice?: number
  staffName?: string
  staffEmail?: string
  staffProfileImage?: string
}

const UserAppointments: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  
  const [appointments, setAppointments] = useState<UserAppointment[]>([])
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; profileImage?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch user appointments
  const fetchUserAppointments = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const response = await apiService.getUserAppointments(parseInt(userId))

      if (response.success) {
        setAppointments(response.data || [])
        if (response.data && response.data.length > 0) {
          // Get user info from first appointment
          const firstAppointment = response.data[0]
          setUserInfo({
            firstName: firstAppointment.userName?.split(' ')[0] || 'Unknown',
            lastName: firstAppointment.userName?.split(' ').slice(1).join(' ') || 'User',
            profileImage: firstAppointment.userProfileImage
          })
        }
      } else {
        throw new Error(response.message || 'Failed to fetch user appointments')
      }
    } catch (err) {
      console.error('Error fetching user appointments:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch user appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === 1 && userId) { // Only for shop owners
      fetchUserAppointments()
    }
  }, [user, userId])

  // Column definitions for the grid
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Date',
      field: 'appointmentDate',
      width: 120,
      cellRenderer: (params: any) => {
        const appointment = params.data as UserAppointment
        return (
          <Typography variant="body2">
            {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
          </Typography>
        )
      }
    },
    {
      headerName: 'Time',
      field: 'appointmentTime',
      width: 100,
      cellRenderer: (params: any) => {
        const appointment = params.data as UserAppointment
        return (
          <Typography variant="body2">
            {appointment.appointmentTime}
          </Typography>
        )
      }
    },
    {
      headerName: 'Service',
      field: 'serviceName',
      width: 200,
      cellRenderer: (params: any) => {
        const appointment = params.data as UserAppointment
        return (
          <Box className="flex flex-col">
            <Typography variant="body2" className="font-medium">
              {appointment.serviceName || 'N/A'}
            </Typography>
            {appointment.servicePrice && (
              <Typography variant="caption" className="text-gray-500">
                ${appointment.servicePrice}
              </Typography>
            )}
          </Box>
        )
      }
    },
    {
      headerName: 'Staff',
      field: 'staffName',
      width: 180,
      cellRenderer: (params: any) => {
        const appointment = params.data as UserAppointment
        if (!appointment.staffName) {
          return (
            <Typography variant="body2" className="text-gray-500">
              Not assigned
            </Typography>
          )
        }
        return (
          <Box className="flex items-center gap-2">
            <Avatar
              src={getProfileImageUrl(appointment.staffProfileImage)}
              alt={appointment.staffName}
              sx={{ width: 32, height: 32 }}
            />
            <Typography variant="body2">
              {appointment.staffName}
            </Typography>
          </Box>
        )
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      cellRenderer: (params: any) => {
        const appointment = params.data as UserAppointment
        const statusColor = getStatusColor(appointment.status as any)
        return (
          <Chip
            label={getStatusDisplayName(appointment.status as any)}
            size="small"
            style={{
              backgroundColor: statusColor,
              color: '#ffffff',
              fontWeight: 'bold'
            }}
          />
        )
      }
    },
    {
      headerName: 'Notes',
      field: 'notes',
      width: 200,
      cellRenderer: (params: any) => {
        const appointment = params.data as UserAppointment
        return (
          <Typography variant="body2" className="truncate">
            {appointment.notes || 'No notes'}
          </Typography>
        )
      }
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      width: 120,
      cellRenderer: (params: any) => {
        const appointment = params.data as UserAppointment
        return (
          <Typography variant="body2">
            {format(new Date(appointment.createdAt), 'MMM dd, yyyy')}
          </Typography>
        )
      }
    }
  ], [])

  // Show loading state
  if (authLoading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  // Show error if user is not a shop owner
  if (!user || user.role !== 1) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography color="error">
          Access denied. This page is only available for shop owners.
        </Typography>
      </Box>
    )
  }

  // Show error if no userId
  if (!userId) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography color="error">
          Invalid user ID.
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="h-full flex flex-col">
      {/* Header Section */}
      <Box className="mb-6">
        <Box className="flex items-center gap-4 mb-4">
          <Box
            onClick={() => navigate('/system/company-users')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: uiTheme.primary }}
          >
            <BackIcon />
            <Typography variant="body2">Back to Users</Typography>
          </Box>
        </Box>
        
        <Box className="flex items-center gap-4 mb-2">
          {userInfo && (
            <Avatar
              src={getProfileImageUrl(userInfo.profileImage)}
              alt={`${userInfo.firstName} ${userInfo.lastName}`}
              sx={{ width: 48, height: 48 }}
            />
          )}
          <Box>
            <Typography 
              variant="h4" 
              className="font-bold"
              style={{ color: uiTheme.text }}
            >
              {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'User'} Appointments
            </Typography>
            <Typography 
              variant="body1"
              style={{ color: uiTheme.textSecondary }}
            >
              All appointments made by this user in your company
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Grid Section */}
      <CustomGrid
        title="User Appointments"
        data={appointments}
        columnDefs={columnDefs}
        loading={loading}
        error={error}
        success={success}
        theme={uiTheme}
        height="calc(100vh - 280px)"
        showTitle={false}
        showAlerts={true}
        rowHeight={70}
      />
    </Box>
  )
}

export default UserAppointments
