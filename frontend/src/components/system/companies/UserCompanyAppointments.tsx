import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { ColDef } from 'ag-grid-community'
import CustomGrid from '../../shared/custom/CustomGrid'
import { RowAction } from '../../shared/RowActionsMenu'
import { Box, Typography, Avatar, Chip } from '@mui/material'
import { ArrowBack as BackIcon, Visibility as ViewIcon } from '@mui/icons-material'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { format } from 'date-fns'
import { apiService } from '../../../services/api'
import { 
  getStatusDisplayName, 
  getStatusColor,
  isCompletedStatus
} from '../../../constants/appointmentStatus'
import AppointmentCompletionPopup from '../appointments/AppointmentCompletionPopup'

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

const UserCompanyAppointments: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  
  const [appointments, setAppointments] = useState<UserAppointment[]>([])
  const [companyInfo, setCompanyInfo] = useState<{ name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<UserAppointment | null>(null)
  const [isCompletionPopupOpen, setIsCompletionPopupOpen] = useState(false)
  const [existingHistory, setExistingHistory] = useState<any>(null)

  // Fetch user appointments with specific company
  const fetchUserCompanyAppointments = useCallback(async () => {
    if (!companyId) return

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const response = await apiService.getUserAppointmentsByCompany(parseInt(companyId))

      if (response.success) {
        setAppointments(response.data || [])
        if (response.data && response.data.length > 0) {
          // Get company info from first appointment
          const firstAppointment = response.data[0]
          setCompanyInfo({
            name: firstAppointment.companyName || 'Unknown Company'
          })
        }
      } else {
        throw new Error(response.message || 'Failed to fetch appointments')
      }
    } catch (err) {
      console.error('Error fetching user company appointments:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    if (user && parseInt(String(user.role)) === 3 && companyId) { // Only for role 3 users
      fetchUserCompanyAppointments()
    }
  }, [user, companyId, fetchUserCompanyAppointments])

  // Handle view details
  const handleViewDetails = useCallback(async (appointment: UserAppointment) => {
    setSelectedAppointment(appointment)

    // Fetch existing history data if appointment is completed
    const statusNumber = typeof appointment.status === 'string' ? parseInt(appointment.status) : appointment.status

    if (isCompletedStatus(statusNumber)) {
      try {
        const response = await apiService.getUserHistoryByAppointmentId(appointment.id)
        if (response.success) {
          setExistingHistory(response.data)
        } else {
          setExistingHistory(null)
        }
      } catch (error) {
        console.error('Error fetching appointment history:', error)
        setExistingHistory(null)
      }
    } else {
      setExistingHistory(null)
    }

    setIsCompletionPopupOpen(true)
  }, [])

  // Handle close completion popup
  const handleCloseCompletionPopup = useCallback(() => {
    setIsCompletionPopupOpen(false)
    setSelectedAppointment(null)
    setExistingHistory(null)
  }, [])

  // Handle completion success
  const handleCompletionSuccess = useCallback((shouldRefreshGrid = true) => {
    // Only refresh appointments list if needed (e.g., when completing new appointment)
    if (shouldRefreshGrid) {
      fetchUserCompanyAppointments()
    }
    
    // Close the popup - the existingHistory will be refreshed when user opens it again
    handleCloseCompletionPopup()
  }, [fetchUserCompanyAppointments, handleCloseCompletionPopup])

  // Row actions for the grid - memoized to prevent recreation on every render
  const rowActions: RowAction[] = useMemo(() => [
    {
      id: 'view-details',
      label: 'View Details',
      icon: <ViewIcon />,
      onClick: (appointment: UserAppointment) => handleViewDetails(appointment)
    }
  ], [handleViewDetails])

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

  // Show error if user is not a role 3 user
  if (!user || parseInt(String(user.role)) !== 3) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography color="error">
          Access denied. This page is only available for regular users.
        </Typography>
      </Box>
    )
  }

  // Show error if no companyId
  if (!companyId) {
    return (
      <Box className="flex items-center justify-center h-64">
        <Typography color="error">
          Invalid company ID.
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
            onClick={() => navigate('/system/my-companies')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: uiTheme.primary }}
          >
            <BackIcon />
            <Typography variant="body2">Back to My Companies</Typography>
          </Box>
        </Box>
        
        <Box className="flex items-center gap-4 mb-2">
          <Box>
            <Typography 
              variant="h4" 
              className="font-bold"
              style={{ color: uiTheme.text }}
            >
              My Appointments with {companyInfo?.name || 'Company'}
            </Typography>
            <Typography 
              variant="body1"
              style={{ color: uiTheme.textSecondary }}
            >
              All appointments you have made with this company
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Grid Section */}
      <CustomGrid
        title="My Appointments"
        data={appointments}
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

      {/* Appointment Completion Popup */}
        {selectedAppointment && (
          <AppointmentCompletionPopup
            isOpen={isCompletionPopupOpen}
            onClose={handleCloseCompletionPopup}
            onSuccess={handleCompletionSuccess}
            appointment={selectedAppointment}
            mode={existingHistory ? 'view' : 'create'}
            existingHistory={existingHistory}
          />
        )}
    </Box>
  )
}

export default UserCompanyAppointments
