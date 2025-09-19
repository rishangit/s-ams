import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { getStaffByCompanyIdRequest } from '../../../store/actions/staffActions'
import { updateAppointmentStatusRequest } from '../../../store/actions/appointmentsActions'
import { getProfileImageUrl } from '../../../utils/fileUtils'

interface StaffAssignmentPopupProps {
  isOpen: boolean
  onClose: () => void
  appointment: {
    id: number
    companyId: number
    companyName: string
    serviceName: string
    userName: string
    appointmentDate: string
    appointmentTime: string
    staffPreferences?: number[]
    staffId?: number
    staffName?: string
  }
  onSuccess?: () => void
}

const StaffAssignmentPopup: React.FC<StaffAssignmentPopupProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess
}) => {
  const dispatch = useDispatch()
  // const { user } = useSelector((state: RootState) => state.auth) // Not used in this component
  const { staff, loading: staffLoading } = useSelector((state: RootState) => state.staff)
  const { loading: appointmentLoading } = useSelector((state: RootState) => state.appointments)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  const [selectedStaffId, setSelectedStaffId] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)

  // Load staff when popup opens
  useEffect(() => {
    if (isOpen && appointment?.companyId) {
      dispatch(getStaffByCompanyIdRequest(appointment.companyId))
    }
  }, [isOpen, appointment?.companyId, dispatch])

  // Set initial staff selection - only when staff data is loaded
  useEffect(() => {
    if (staff && staff.length > 0) {
      if (appointment.staffId) {
        // Check if the staffId exists in the loaded staff array
        const staffExists = staff.some(s => s.id === appointment.staffId)
        if (staffExists) {
          setSelectedStaffId(appointment.staffId)
        } else {
          setSelectedStaffId('')
        }
      } else if (appointment.staffPreferences && appointment.staffPreferences.length > 0) {
        // If there are staff preferences, select the first one that exists in the staff array
        const firstPreferredStaff = appointment.staffPreferences.find(prefId => 
          staff.some(s => s.id === prefId)
        )
        if (firstPreferredStaff) {
          setSelectedStaffId(firstPreferredStaff)
        } else {
          setSelectedStaffId('')
        }
      } else {
        setSelectedStaffId('')
      }
    }
  }, [appointment.staffId, appointment.staffPreferences, staff])

  const handleConfirm = () => {
    if (!selectedStaffId) {
      setError('Please select a staff member')
      return
    }

    setError(null)
    
    // Update appointment status to confirmed and assign staff
    dispatch(updateAppointmentStatusRequest({
      id: appointment.id,
      status: 'confirmed',
      staffId: selectedStaffId
    }))
    
    // Close popup after successful assignment
    setTimeout(() => {
      if (onSuccess) {
        onSuccess()
      }
      handleClose()
    }, 1000)
  }

  const handleClose = () => {
    setSelectedStaffId('')
    setError(null)
    onClose()
  }

  // No automatic closing - let the user control when to close the popup

  const getStaffDisplayName = (staffMember: any) => {
    return `${staffMember.firstName} ${staffMember.lastName}`
  }

  const getStaffEmail = (staffMember: any) => {
    return staffMember.email || ''
  }

  const isPreferredStaff = (staffId: number) => {
    return appointment.staffPreferences?.includes(staffId) || false
  }

  const preferredStaff = staff?.filter(s => isPreferredStaff(s.id)) || []
  const otherStaff = staff?.filter(s => !isPreferredStaff(s.id)) || []

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: uiTheme.surface,
          color: uiTheme.text,
          border: `1px solid ${uiTheme.border}`
        }
      }}
    >
      <DialogTitle style={{ color: uiTheme.text, borderBottom: `1px solid ${uiTheme.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div">
            Assign Staff Member
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Appointment Info */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: uiTheme.surface, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: uiTheme.textSecondary, mb: 1 }}>
            <strong>Appointment Details:</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: uiTheme.text }}>
            <strong>Service:</strong> {appointment.serviceName}
          </Typography>
          <Typography variant="body2" sx={{ color: uiTheme.text }}>
            <strong>Customer:</strong> {appointment.userName}
          </Typography>
          <Typography variant="body2" sx={{ color: uiTheme.text }}>
            <strong>Date & Time:</strong> {appointment.appointmentDate} at {appointment.appointmentTime}
          </Typography>
        </Box>

        {/* Staff Preferences Display */}
        {appointment.staffPreferences && appointment.staffPreferences.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: uiTheme.textSecondary, mb: 1 }}>
              <strong>Customer's Preferred Staff:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {preferredStaff.map((staffMember) => (
                <Chip
                  key={staffMember.id}
                  avatar={
                    <Avatar
                      src={getProfileImageUrl(staffMember.profileImage)}
                      sx={{ width: 24, height: 24 }}
                    />
                  }
                  label={getStaffDisplayName(staffMember)}
                  size="small"
                  style={{
                    backgroundColor: uiTheme.primary,
                    color: '#ffffff'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Staff Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel style={{ color: uiTheme.textSecondary }}>
            Select Staff Member
          </InputLabel>
          <Select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value as number)}
            label="Select Staff Member"
            style={{ color: uiTheme.text }}
            disabled={staffLoading}
          >
            {/* Preferred Staff First */}
            {preferredStaff.length > 0 && (
              <MenuItem disabled>
                <Typography variant="body2" sx={{ color: uiTheme.textSecondary, fontWeight: 'bold' }}>
                  Preferred Staff
                </Typography>
              </MenuItem>
            )}
            {preferredStaff.map((staffMember) => (
              <MenuItem key={staffMember.id} value={staffMember.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar
                    src={getProfileImageUrl(staffMember.profileImage)}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: uiTheme.text, fontWeight: 'bold' }}>
                      {getStaffDisplayName(staffMember)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: uiTheme.textSecondary }}>
                      {getStaffEmail(staffMember)}
                    </Typography>
                  </Box>
                  <Chip
                    label="Preferred"
                    size="small"
                    style={{
                      backgroundColor: uiTheme.primary,
                      color: '#ffffff',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              </MenuItem>
            ))}

            {/* Other Staff */}
            {otherStaff.length > 0 && (
              <MenuItem disabled>
                <Typography variant="body2" sx={{ color: uiTheme.textSecondary, fontWeight: 'bold' }}>
                  Other Staff Members
                </Typography>
              </MenuItem>
            )}
            {otherStaff.map((staffMember) => (
              <MenuItem key={staffMember.id} value={staffMember.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar
                    src={getProfileImageUrl(staffMember.profileImage)}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: uiTheme.text }}>
                      {getStaffDisplayName(staffMember)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: uiTheme.textSecondary }}>
                      {getStaffEmail(staffMember)}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {staffLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} style={{ color: uiTheme.primary }} />
            <Typography variant="body2" sx={{ color: uiTheme.textSecondary, ml: 2 }}>
              Loading staff members...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${uiTheme.border}` }}>
        <Button
          onClick={handleClose}
          disabled={appointmentLoading}
          style={{ color: uiTheme.textSecondary }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedStaffId || appointmentLoading || staffLoading}
          style={{
            backgroundColor: uiTheme.primary,
            color: '#ffffff'
          }}
        >
          {appointmentLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} style={{ color: '#ffffff' }} />
              Confirming...
            </Box>
          ) : (
            'Confirm & Assign Staff'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StaffAssignmentPopup
