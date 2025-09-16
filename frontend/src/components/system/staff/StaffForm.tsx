import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material'
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import FormInput from '../../shared/FormInput'
import FormSelect from '../../shared/FormSelect'
import FormButton from '../../shared/FormButton'
import {
  createStaffRequest,
  updateStaffRequest,
  getStaffByIdRequest,
  getAvailableUsersRequest,
  clearStaffMessages
} from '../../../store/actions/staffActions'
import { getAllUsersRequest } from '../../../store/actions/userActions'
import { STAFF_STATUS, getStatusDisplayName } from '../../../constants/staffStatus'

// Validation schema
const staffSchema = yup.object({
  userId: yup
    .mixed()
    .required('Please select a staff member')
    .test('is-valid-user', 'Please select a valid staff member', function(value) {
      if (!value || value === '') return false
      const numValue = typeof value === 'string' ? parseInt(value) : Number(value)
      return !isNaN(numValue) && numValue > 0
    }),
  workingHoursStart: yup
    .string()
    .optional()
    .test('valid-time', 'Please enter a valid time (HH:MM)', function(value) {
      if (!value || value === '') return true
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
    }),
  workingHoursEnd: yup
    .string()
    .optional()
    .test('valid-time', 'Please enter a valid time (HH:MM)', function(value) {
      if (!value || value === '') return true
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
    })
    .test('end-after-start', 'End time must be after start time', function(value) {
      const { workingHoursStart } = this.parent
      if (!value || !workingHoursStart || value === '' || workingHoursStart === '') return true
      
      const startTime = new Date(`2000-01-01T${workingHoursStart}`)
      const endTime = new Date(`2000-01-01T${value}`)
      
      return endTime > startTime
    }),
  skills: yup
    .string()
    .optional()
    .max(1000, 'Skills description must be less than 1000 characters'),
  professionalQualifications: yup
    .string()
    .optional()
    .max(1000, 'Professional qualifications must be less than 1000 characters'),
  status: yup
    .number()
    .required('Status is required')
    .oneOf(Object.values(STAFF_STATUS), 'Please select a valid status')
})

interface StaffFormData {
  userId: number | string
  workingHoursStart: string
  workingHoursEnd: string
  skills: string
  professionalQualifications: string
  status: number
}

interface StaffFormProps {
  staffId?: number | null
  onClose: () => void
  onSuccess: () => void
}

const StaffForm: React.FC<StaffFormProps> = ({ staffId, onClose, onSuccess }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  
  // Determine if this is a modal (always true for StaffForm as it's used in modals)
  const isModal = true
  const { 
    currentStaff, 
    availableUsers, 
    createLoading, 
    updateLoading, 
    loading,
    error, 
    success 
  } = useSelector((state: RootState) => state.staff)
  const { users } = useSelector((state: RootState) => state.users)

  const [isEditing] = useState(!!staffId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<StaffFormData>({
    resolver: yupResolver(staffSchema) as any,
    defaultValues: {
      userId: '',
      workingHoursStart: '',
      workingHoursEnd: '',
      skills: '',
      professionalQualifications: '',
      status: STAFF_STATUS.ACTIVE
    }
  })

  // Load available users for selection
  useEffect(() => {
    if (!isEditing) {
      // Load all users for company owners (role 1) or available users for others
      if (user && parseInt(String(user.role)) === 1) {
        dispatch(getAllUsersRequest())
      } else {
        dispatch(getAvailableUsersRequest())
      }
    }
  }, [dispatch, isEditing, user])

  // Load staff data for editing
  useEffect(() => {
    if (isEditing && staffId) {
      dispatch(getStaffByIdRequest(staffId))
    }
  }, [isEditing, staffId, dispatch])

  // Populate form when staff data is loaded
  useEffect(() => {
    if (currentStaff && isEditing) {
      reset({
        userId: currentStaff.userId || '',
        workingHoursStart: currentStaff.workingHoursStart || '',
        workingHoursEnd: currentStaff.workingHoursEnd || '',
        skills: currentStaff.skills || '',
        professionalQualifications: currentStaff.professionalQualifications || '',
        status: currentStaff.status !== undefined ? currentStaff.status : STAFF_STATUS.ACTIVE
      })
    }
  }, [currentStaff, isEditing, reset])

  // Handle success
  useEffect(() => {
    if (success) {
      onSuccess()
    }
  }, [success, onSuccess])

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearStaffMessages())
    }
  }, [dispatch])

  const onSubmit = (data: StaffFormData) => {
    if (isEditing && staffId) {
      // Update existing staff
      dispatch(updateStaffRequest({
        id: staffId,
        data: {
          workingHoursStart: data.workingHoursStart || undefined,
          workingHoursEnd: data.workingHoursEnd || undefined,
          skills: data.skills || undefined,
          professionalQualifications: data.professionalQualifications || undefined,
          status: data.status
        }
      }))
    } else {
      // Create new staff
      dispatch(createStaffRequest({
        userId: parseInt(data.userId as string),
        workingHoursStart: data.workingHoursStart || undefined,
        workingHoursEnd: data.workingHoursEnd || undefined,
        skills: data.skills || undefined,
        professionalQualifications: data.professionalQualifications || undefined,
        status: data.status
      }))
    }
  }

  const handleCancel = () => {
    onClose()
  }

  // Prepare user options for select - use all users for company owners, available users for others
  const userOptions = (user && parseInt(String(user.role)) === 1 ? users : availableUsers)
    ?.filter(userItem => userItem?.id)
    .map(userItem => ({
      value: userItem.id || '',
      label: `${userItem.firstName} ${userItem.lastName} (${userItem.email})`
    })) || []

  // Prepare status options
  const statusOptions = [
    { value: STAFF_STATUS.ACTIVE, label: getStatusDisplayName(STAFF_STATUS.ACTIVE) },
    { value: STAFF_STATUS.INACTIVE, label: getStatusDisplayName(STAFF_STATUS.INACTIVE) },
    { value: STAFF_STATUS.SUSPENDED, label: getStatusDisplayName(STAFF_STATUS.SUSPENDED) },
    { value: STAFF_STATUS.TERMINATED, label: getStatusDisplayName(STAFF_STATUS.TERMINATED) }
  ]

  if (loading && isEditing) {
    return (
      <Box className="flex justify-center items-center p-4 md:p-8">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className={`${isModal ? 'p-4 px-0 sm:p-6 sm:px-0' : 'p-6'}`}>
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Help text for company owners */}
      {user && parseInt(String(user.role)) === 1 && !isEditing && (
        <Alert severity="info" className="mb-4">
          As a company owner, you can add any user as staff to your company. Select the user you want to add as a staff member.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* User Selection - Only show for new staff */}
          {!isEditing && (
            <Grid item xs={12}>
              <FormSelect
                name="userId"
                control={control}
                label="Select Staff Member"
                options={userOptions}
                error={errors.userId}
                disabled={createLoading}
                required
              />
            </Grid>
          )}

          {/* Working Hours */}
          <Grid item xs={12} sm={6}>
            <FormInput
              name="workingHoursStart"
              control={control}
              label="Start Time"
              type="time"
              error={errors.workingHoursStart}
              disabled={createLoading || updateLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormInput
              name="workingHoursEnd"
              control={control}
              label="End Time"
              type="time"
              error={errors.workingHoursEnd}
              disabled={createLoading || updateLoading}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <FormSelect
              name="status"
              control={control}
              label="Status"
              options={statusOptions}
              error={errors.status}
              disabled={createLoading || updateLoading}
              required
            />
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <FormInput
              name="skills"
              control={control}
              label="Skills"
              multiline
              rows={4}
              placeholder="Enter staff member's skills and expertise..."
              error={errors.skills}
              disabled={createLoading || updateLoading}
            />
          </Grid>

          {/* Professional Qualifications */}
          <Grid item xs={12}>
            <FormInput
              name="professionalQualifications"
              control={control}
              label="Professional Qualifications"
              multiline
              rows={4}
              placeholder="Enter professional qualifications, certifications, etc..."
              error={errors.professionalQualifications}
              disabled={createLoading || updateLoading}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <Box className="w-full sm:w-auto">
                <FormButton
                  type="button"
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={createLoading || updateLoading}
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
                  variant="contained"
                  disabled={createLoading || updateLoading || !isDirty}
                  fullWidth
                >
                  {(createLoading || updateLoading) ? (
                    <CircularProgress size={20} style={{ color: '#fff' }} />
                  ) : (
                    <Box className="flex items-center justify-center space-x-2">
                      <SaveIcon />
                      <span>
                        {isEditing ? 'Update Staff' : 'Add Staff'}
                      </span>
                    </Box>
                  )}
                </FormButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default StaffForm

