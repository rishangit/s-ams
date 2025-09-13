import React, { useState, useEffect, memo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Event as AppointmentIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RootState } from '../../../store'
import FormInput from '../../shared/FormInput'
import FormSelect from '../../shared/FormSelect'
import FormMultiSelect from '../../shared/FormMultiSelect'
import FormButton from '../../shared/FormButton'
import {
  createAppointmentRequest,
  updateAppointmentRequest,
  getAppointmentByIdRequest,
  clearAppointmentsMessages
} from '../../../store/actions/appointmentsActions'
import { getServicesByCompanyIdRequest, getServicesByCompanyIdSuccess } from '../../../store/actions/servicesActions'
import { getCompaniesForBookingRequest, getCompanyByUserRequest } from '../../../store/actions/companyActions'
import { getAllUsersRequest } from '../../../store/actions/userActions'
import { getStaffByCompanyIdRequest, getStaffByCompanyIdSuccess } from '../../../store/actions/staffActions'

// Validation schema
const appointmentSchema = yup.object({
  userId: yup
    .mixed()
    .optional()
    .test('is-valid-user', 'Please select a valid user', function(value) {
      if (!value || value === '') return true // Optional field
      const numValue = typeof value === 'string' ? parseInt(value) : Number(value)
      return !isNaN(numValue) && numValue > 0
    }),
  companyId: yup
    .mixed()
    .required('Company is required')
    .test('is-valid-company', 'Please select a valid company', function(value) {
      if (!value || value === '') return false
      const numValue = typeof value === 'string' ? parseInt(value) : Number(value)
      return !isNaN(numValue) && numValue > 0
    }),
  serviceId: yup
    .mixed()
    .required('Service is required')
    .test('is-valid-service', 'Please select a valid service', function(value) {
      if (!value || value === '') return false
      const numValue = typeof value === 'string' ? parseInt(value) : Number(value)
      return !isNaN(numValue) && numValue > 0
    }),
  appointmentDate: yup 
    .string()
    .required('Appointment date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  appointmentTime: yup
    .string()
    .required('Appointment time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  notes: yup
    .string()
    .optional()
    .max(500, 'Notes must be less than 500 characters'),
  status: yup
    .string()
    .optional()
    .oneOf(['pending', 'confirmed', 'completed', 'cancelled'], 'Invalid status'),
  staffId: yup
    .mixed()
    .optional()
    .test('is-valid-staff', 'Please select a valid staff member', function(value) {
      if (!value || value === '') return true // Optional field
      const numValue = typeof value === 'string' ? parseInt(value) : Number(value)
      return !isNaN(numValue) && numValue > 0
    }),
  staffPreferences: yup
    .array()
    .of(yup.number().positive())
    .max(3, 'You can select up to 3 preferred staff members')
    .optional()
})

interface AppointmentFormData {
  userId?: number | string
  companyId: number | string
  serviceId: number | string
  staffId?: number | string
  staffPreferences?: number[]
  appointmentDate: string
  appointmentTime: string
  notes: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

interface AppointmentFormProps {
  isOpen?: boolean
  onClose?: () => void
  appointmentId?: number | null
  onSuccess?: () => void
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  isOpen = false, 
  onClose, 
  appointmentId = null,
  onSuccess
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  // Determine if this is a modal or standalone form
  const isModal = isOpen !== false
  const isEditAppointment = id && id !== 'new'
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { user } = useSelector((state: RootState) => state.auth)
  const { 
    currentAppointment,
    error, 
    success, 
    createLoading, 
    updateLoading 
  } = useSelector((state: RootState) => state.appointments)
  const { services } = useSelector((state: RootState) => state.services)
  const { companies, company } = useSelector((state: RootState) => state.company)
  const { users } = useSelector((state: RootState) => state.users)
  const { staff } = useSelector((state: RootState) => state.staff)

  const [isEditMode, setIsEditMode] = useState(false)
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentSchema) as any,
    defaultValues: {
      userId: '',
      companyId: '',
      serviceId: '',
      staffId: '',
      staffPreferences: [],
      appointmentDate: '',
      appointmentTime: '',
      notes: '',
      status: 'pending'
    }
  })

  const watchedCompanyId = watch('companyId')

  // Load users and company for company owners when creating new appointments
  useEffect(() => {
    if (user && parseInt(user.role) === 1 && !isEditMode && isOpen) {
      dispatch(getAllUsersRequest())
      // Load the company owner's company
      dispatch(getCompanyByUserRequest(user.id))
    }
  }, [user?.id, user?.role, isEditMode, isOpen, dispatch])

  // Determine if this is edit mode
  useEffect(() => {
    const currentAppointmentId = appointmentId || (isEditAppointment ? parseInt(id) : null)
    setIsEditMode(!!currentAppointmentId)
    setHasHandledSuccess(false)
  }, [appointmentId, id, isEditAppointment])

  // Reset form when modal opens for new appointment
  useEffect(() => {
    if (isOpen && !isEditMode) {
      reset({
        userId: '',
        companyId: '',
        serviceId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
        status: 'pending'
      })
    }
  }, [isOpen, isEditMode, reset])

  // Set company owner's company as default when loaded
  useEffect(() => {
    if (user && parseInt(user.role) === 1 && !isEditMode && company && isOpen) {
      const currentValues = watch()
      reset({
        ...currentValues,
        companyId: company.id
      })
    }
  }, [user, isEditMode, company, isOpen, reset, watch])

  // Load staff when company changes (same pattern as services)
  useEffect(() => {
    console.log('Staff loading effect triggered:', {
      watchedCompanyId,
      userRole: user?.role,
      companyIdParsed: watchedCompanyId ? parseInt(watchedCompanyId as string) : null
    })
    
    if (watchedCompanyId && watchedCompanyId !== '' && parseInt(watchedCompanyId as string) > 0) {
      // Reset staff preferences when company changes
      const currentValues = watch()
      reset({ ...currentValues, staffPreferences: [] })
      
      // Load staff for the selected company (same for all roles)
      console.log('Dispatching getStaffByCompanyIdRequest for companyId:', parseInt(watchedCompanyId as string))
      dispatch(getStaffByCompanyIdRequest(parseInt(watchedCompanyId as string)))
    } else {
      // Clear staff when no company is selected
      console.log('Clearing staff data - no company selected')
      dispatch(getStaffByCompanyIdSuccess([]))
    }
  }, [watchedCompanyId, dispatch, reset, watch])

  // Debug staff data for role 3
  useEffect(() => {
    if (user && parseInt(user.role) === 3) {
      console.log('Staff data for role 3:', { staff, staffLength: staff?.length, watchedCompanyId })
    }
  }, [staff, watchedCompanyId, user])

  // Debug appointment data for role 1
  useEffect(() => {
    if (user && parseInt(user.role) === 1 && currentAppointment) {
      console.log('Current appointment data for role 1:', {
        appointment: currentAppointment,
        staffPreferences: currentAppointment.staffPreferences,
        staffId: currentAppointment.staffId
      })
    }
  }, [currentAppointment, user])

  // Load appointment data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const currentAppointmentId = appointmentId || (id ? parseInt(id) : null)
      if (currentAppointmentId) {
        dispatch(getAppointmentByIdRequest(currentAppointmentId))
      }
    }
  }, [isEditMode, appointmentId, id, isEditAppointment, dispatch])

  // Load companies when component mounts
  useEffect(() => {
    dispatch(getCompaniesForBookingRequest())
  }, [dispatch])

  // Load services when company changes
  useEffect(() => {
    if (watchedCompanyId && watchedCompanyId !== '' && parseInt(watchedCompanyId as string) > 0) {
      // Reset service selection when company changes
      const currentValues = watch()
      reset({ ...currentValues, serviceId: '' })
      // Load services for the selected company
      dispatch(getServicesByCompanyIdRequest(parseInt(watchedCompanyId as string)))
    } else {
      // Clear services when no company is selected
      dispatch(getServicesByCompanyIdSuccess([]))
    }
  }, [watchedCompanyId, dispatch, reset])

  // Populate form when appointment data is loaded
  useEffect(() => {
    if (currentAppointment && isEditMode) {
      // First load services for the company
      dispatch(getServicesByCompanyIdRequest(currentAppointment.companyId))
      
      // Populate the form with basic data (without serviceId for now)
      const formData = {
        userId: currentAppointment.userId || '',
        companyId: currentAppointment.companyId,
        serviceId: '', // Set to empty string initially
        staffId: currentAppointment.staffId || '',
        staffPreferences: currentAppointment.staffPreferences || [],
        appointmentDate: currentAppointment.appointmentDate ? new Date(currentAppointment.appointmentDate).toISOString().split('T')[0] : '',
        appointmentTime: currentAppointment.appointmentTime ? 
          (currentAppointment.appointmentTime.includes('T') ? 
            new Date(currentAppointment.appointmentTime).toTimeString().slice(0, 5) : 
            currentAppointment.appointmentTime) : '',
        notes: currentAppointment.notes || '',
        status: currentAppointment.status || 'pending'
      }
      reset(formData)
    }
  }, [currentAppointment, isEditMode, reset, dispatch])

  // Update serviceId after services are loaded for edit mode
  useEffect(() => {
    if (currentAppointment && isEditMode && services && services.length > 0) {
      // Check if the current serviceId exists in the loaded services
      const serviceExists = services.some(service => service.id === currentAppointment.serviceId)
      if (serviceExists) {
        // Update the form with the correct serviceId
        const currentValues = watch()
        reset({
          ...currentValues,
          serviceId: currentAppointment.serviceId
        })
      }
    }
  }, [currentAppointment, isEditMode, services, reset, watch])

  const onSubmit = (data: AppointmentFormData) => {
    if (isEditMode) {
      const updateData: any = {
        id: appointmentId || parseInt(id || '0'),
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes
      }
      
      // Add status field for admins (role: 0) and company owners (role: 1)
      if (user && (parseInt(user.role) === 0 || parseInt(user.role) === 1) && data.status) {
        updateData.status = data.status
      }
      
      // Add staffId for admins (role: 0) and company owners (role: 1)
      if (user && (parseInt(user.role) === 0 || parseInt(user.role) === 1) && data.staffId) {
        updateData.staffId = parseInt(data.staffId as string)
      }
      
      // Add staffPreferences for admins (role: 0) and company owners (role: 1)
      if (user && (parseInt(user.role) === 0 || parseInt(user.role) === 1) && data.staffPreferences) {
        updateData.staffPreferences = data.staffPreferences
      }
      
      dispatch(updateAppointmentRequest(updateData))
    } else {
      const createData: any = {
        companyId: parseInt(data.companyId as string),
        serviceId: parseInt(data.serviceId as string),
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes
      }
      
      // Add userId for company owners (role: 1) when creating appointments
      if (user && parseInt(user.role) === 1 && data.userId) {
        createData.userId = parseInt(data.userId as string)
      } else if (user && parseInt(user.role) !== 1) {
        // For regular users, use their own ID
        createData.userId = user.id
      }
      
      // Add staffId for company owners (role: 1)
      if (user && parseInt(user.role) === 1 && data.staffId) {
        createData.staffId = parseInt(data.staffId as string)
      }
      
      // Add staffPreferences for regular users (role: 3) or company owners (role: 1)
      if (data.staffPreferences && data.staffPreferences.length > 0) {
        createData.staffPreferences = data.staffPreferences
      }
      dispatch(createAppointmentRequest(createData))
    }
  }

  const handleCancel = () => {
    reset()
    if (isModal && onClose) {
      onClose()
    } else {
      navigate('/system/appointments')
    }
  }

  // Handle success
  useEffect(() => {
    if (success && !hasHandledSuccess) {
      setHasHandledSuccess(true)
      reset()
      if (onClose) {
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setTimeout(() => {
          navigate('/system/appointments')
        }, 1500)
      }
    }
  }, [success, hasHandledSuccess, reset, onClose, navigate])

  // Clear messages when component unmounts or form closes
  useEffect(() => {
    return () => {
      dispatch(clearAppointmentsMessages())
    }
  }, [dispatch])

  // Handle successful save operations
  useEffect(() => {
    if (success && onSuccess) {
      onSuccess()
    }
  }, [success, onSuccess])

  const formContent = (
    <Box className={`${isModal ? 'p-4 px-0 sm:p-6 sm:px-0' : 'p-6'}`}>
      {!isModal && (
        <Box className="flex items-center space-x-3 mb-6">
          <AppointmentIcon style={{ color: uiTheme.primary, fontSize: '2rem' }} />
          <Typography
            variant="h4"
            className="font-bold"
            style={{ color: uiTheme.text }}
          >
            {isEditMode 
              ? 'Edit Appointment' 
              : 'New Appointment'
            }
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* Help text for company owners */}
      {user && parseInt(user.role) === 1 && !isEditMode && (
        <Alert severity="info" className="mb-4">
          As a company owner, you can book appointments for any user. Your company has been automatically selected. Choose the user, service, date, and time for the appointment.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* User selection for company owners when creating new appointments */}
          {user && parseInt(user.role) === 1 && !isEditMode && (
            <Grid item xs={12}>
              <FormSelect
                name="userId"
                label="Select User to Book For"
                control={control}
                options={users?.filter(user => user?.id).map(user => ({
                  value: user.id || '',
                  label: `${user.firstName} ${user.lastName} (${user.email})`
                })) || []}
                error={errors.userId}
                required
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <FormSelect
              name="companyId"
              label="Company"
              control={control}
              options={companies?.filter(company => company?.id).map(company => ({
                value: company.id || '',
                label: company.name || 'Unknown Company'
              })) || []}
              error={errors.companyId}
              required
              disabled={isEditMode || Boolean(user && parseInt(user.role) === 1 && company)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormSelect
              name="serviceId"
              label="Service"
              control={control}
              options={services && services.length > 0 
                ? services.map(service => ({
                    value: service.id,
                    label: `${service.name} - $${service.price}`
                  }))
                : watchedCompanyId && watchedCompanyId !== '' && parseInt(watchedCompanyId as string) > 0 
                  ? [{ value: '', label: 'No active services available for this company' }]
                  : [{ value: '', label: 'Please select a company first' }]
              }
              error={errors.serviceId}
              required
              disabled={isEditMode || !watchedCompanyId || watchedCompanyId === '' || !services || services.length === 0}
            />
          </Grid>
          
          {/* Staff selection for company owners */}
          {user && parseInt(user.role) === 1 && (
            <Grid item xs={12}>
              <FormSelect
                name="staffId"
                label={
                  isEditMode && currentAppointment?.staffPreferences && currentAppointment.staffPreferences.length > 0
                    ? "Assign to Staff Member (From Preferred Staff)"
                    : "Assign to Staff Member (Optional)"
                }
                control={control}
                options={(() => {
                  if (!staff || staff.length === 0) {
                    return watchedCompanyId && watchedCompanyId !== '' && parseInt(watchedCompanyId as string) > 0 
                      ? [{ value: '', label: 'No staff members available for this company' }]
                      : [{ value: '', label: 'Please select a company first' }]
                  }

                  // If editing and there are preferred staff, prioritize them
                  if (isEditMode && currentAppointment?.staffPreferences && currentAppointment.staffPreferences.length > 0) {
                    const preferredStaffIds = currentAppointment.staffPreferences
                    const preferredStaff = staff.filter(s => preferredStaffIds.includes(s.id))
                    const otherStaff = staff.filter(s => !preferredStaffIds.includes(s.id))
                    
                    const options = []
                    
                    // Add preferred staff first
                    if (preferredStaff.length > 0) {
                      options.push({ value: '', label: '--- Preferred Staff ---' })
                      preferredStaff.forEach(staffMember => {
                        options.push({
                          value: staffMember.id,
                          label: `⭐ ${staffMember.firstName} ${staffMember.lastName} (${staffMember.email})`
                        })
                      })
                    }
                    
                    // Add other staff
                    if (otherStaff.length > 0) {
                      options.push({ value: '', label: '--- Other Staff ---' })
                      otherStaff.forEach(staffMember => {
                        options.push({
                          value: staffMember.id,
                          label: `${staffMember.firstName} ${staffMember.lastName} (${staffMember.email})`
                        })
                      })
                    }
                    
                    return options
                  }
                  
                  // Default: show all staff
                  return staff.map(staffMember => ({
                    value: staffMember.id,
                    label: `${staffMember.firstName} ${staffMember.lastName} (${staffMember.email})`
                  }))
                })()}
                error={errors.staffId}
                disabled={!watchedCompanyId || watchedCompanyId === '' || !staff || staff.length === 0}
              />
              {isEditMode && currentAppointment?.staffPreferences && currentAppointment.staffPreferences.length > 0 && (
                <Box sx={{ mt: 1, p: 2, backgroundColor: uiTheme.mode === 'dark' ? '#1e293b' : '#f8fafc', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: uiTheme.textSecondary, mb: 1 }}>
                    <strong>Preferred Staff by User:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {currentAppointment.staffPreferences.map((staffId) => {
                      const staffMember = staff?.find(s => s.id === staffId)
                      return staffMember ? (
                        <Box
                          key={staffId}
                          sx={{
                            px: 2,
                            py: 1,
                            backgroundColor: uiTheme.primary,
                            color: '#ffffff',
                            borderRadius: 1,
                            fontSize: '0.875rem'
                          }}
                        >
                          {staffMember.firstName} {staffMember.lastName}
                        </Box>
                      ) : null
                    })}
                  </Box>
                </Box>
              )}
            </Grid>
          )}
          
          {/* Staff preferences for regular users */}
          {user && parseInt(user.role) === 3 && (
            <Grid item xs={12}>
              <FormMultiSelect
                name="staffPreferences"
                label="Preferred Staff Members (Select up to 3)"
                control={control}
                options={staff && staff.length > 0 
                  ? staff.map(staffMember => ({
                      value: staffMember.id,
                      label: `${staffMember.firstName} ${staffMember.lastName} (${staffMember.email})`
                    }))
                  : watchedCompanyId && watchedCompanyId !== '' && parseInt(watchedCompanyId as string) > 0 
                    ? [{ value: '', label: 'No active staff members available for this company' }]
                    : [{ value: '', label: 'Please select a company first' }]
                }
                error={errors.staffPreferences as any}
                maxSelections={3}
                disabled={!watchedCompanyId || watchedCompanyId === '' || !staff || staff.length === 0}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <FormInput
              name="appointmentDate"
              label="Appointment Date"
              type="date"
              control={control}
              error={errors.appointmentDate}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormInput
              name="appointmentTime"
              label="Appointment Time"
              type="time"
              control={control}
              error={errors.appointmentTime}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              name="notes"
              label="Notes (Optional)"
              type="description"
              control={control}
              error={errors.notes}
            />
          </Grid>
          
          {/* Status dropdown for company owners in edit mode */}
          {user && parseInt(user.role) === 1 && isEditMode && (
            <Grid item xs={12}>
              <FormSelect
                name="status"
                label="Status"
                control={control}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                error={errors.status}
              />
            </Grid>
          )}
        </Grid>

        {/* Action Buttons */}
        <Box className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
          <Box className="w-full sm:w-auto">
            <FormButton
              type="button"
              variant="outlined"
              onClick={handleCancel}
              fullWidth
            >
              <Box className="flex items-center justify-center space-x-2">
                <CancelIcon />
                <span>Cancel</span>
              </Box>
            </FormButton>
          </Box>
          <Box className="w-full sm:w-auto">
            <FormButton
              type="submit"
              disabled={createLoading || updateLoading || !isDirty}
              fullWidth
            >
              {(createLoading || updateLoading) ? (
                <CircularProgress size={20} style={{ color: '#fff' }} />
              ) : (
                <Box className="flex items-center justify-center space-x-2">
                  <SaveIcon />
                  <span>
                    {isEditMode 
                      ? 'Update Appointment' 
                      : 'Book Appointment'
                    }
                  </span>
                </Box>
              )}
            </FormButton>
          </Box>
        </Box>
      </form>
    </Box>
  )


  // If used as modal
  if (isOpen) {
    return (
      <Dialog 
        open={isOpen} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={false}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: uiTheme.surface,
            color: uiTheme.text,
            zIndex: 1300,
            position: 'relative',
            margin: { xs: '16px', sm: '32px' },
            maxHeight: { xs: 'calc(100vh - 32px)', sm: 'calc(100vh - 64px)' }
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1299
          },
          '& .MuiDialogTitle-root': {
            padding: { xs: '16px 16px 8px 16px', sm: '24px 24px 16px 24px' },
            borderBottom: `1px solid ${uiTheme.border || '#e0e0e0'}`
          },
          '& .MuiDialogContent-root': {
            padding: { xs: '8px 16px 16px 16px', sm: '16px 24px 24px 24px' }
          }
        }}
      >
        <DialogTitle style={{ color: uiTheme.text }}>
          {isEditMode 
            ? 'Edit Appointment' 
            : 'New Appointment'
          }
        </DialogTitle>
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  // Return null when not open to prevent rendering below other components
  return null
}

export default memo(AppointmentForm)

