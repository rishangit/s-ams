import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  // Typography,
  // Paper,
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
  ToggleOn
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RootState } from '../../../store'
import FormInput from '../../shared/FormInput'
import FormSelect from '../../shared/FormSelect'
import FormButton from '../../shared/FormButton'
import { 
  createServiceRequest, 
  updateServiceRequest,
  getServiceByIdRequest
} from '../../../store/actions/servicesActions'

// Validation schema
const serviceSchema = yup.object({
  name: yup
    .string()
    .required('Service name is required')
    .min(2, 'Service name must be at least 2 characters')
    .max(100, 'Service name must be less than 100 characters'),
  description: yup
    .string()
    .optional()
    .max(500, 'Description must be less than 500 characters'),
  duration: yup
    .string()
    .optional()
    .max(50, 'Duration must be less than 50 characters'),
  price: yup
    .number()
    .required('Price is required')
    .min(0.01, 'Price must be at least $0.01')
    .max(99999.99, 'Price must be less than $100,000'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive')
})

interface ServiceFormData {
  name: string
  description: string
  duration: string
  price: number
  status: string
}

interface ServiceFormProps {
  isOpen?: boolean
  onClose?: () => void
  serviceId?: number | null
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  isOpen = false, 
  onClose, 
  serviceId = null 
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useSelector((state: RootState) => state.auth)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { 
    currentService, 
    error, 
    success, 
    createLoading, 
    updateLoading 
  } = useSelector((state: RootState) => state.services)

  const [isEditMode, setIsEditMode] = useState(false)
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ServiceFormData>({
    resolver: yupResolver(serviceSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      duration: '',
      price: 0,
      status: 'active'
    }
  })

  // Determine if this is edit mode
  useEffect(() => {
    const currentServiceId = serviceId || (id && id !== 'new' ? parseInt(id) : null)
    setIsEditMode(!!currentServiceId)
    // Reset success flag when form opens
    setHasHandledSuccess(false)
  }, [serviceId, id])

  // Load service data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const currentServiceId = serviceId || (id ? parseInt(id) : null)
      if (currentServiceId) {
        dispatch(getServiceByIdRequest(currentServiceId))
      }
    }
  }, [isEditMode, serviceId, id, dispatch])

  // Populate form when service data is loaded
  useEffect(() => {
    if (currentService && isEditMode) {
      reset({
        name: currentService.name,
        description: currentService.description,
        duration: currentService.duration,
        price: currentService.price,
        status: currentService.status
      })
    }
  }, [currentService, isEditMode, reset])


  const onSubmit = (data: ServiceFormData) => {
    if (isEditMode) {
      dispatch(updateServiceRequest({
        id: serviceId || parseInt(id || '0'),
        ...data
      }))
    } else {
      dispatch(createServiceRequest(data))
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
          navigate('/system/services')
        }, 1500)
      }
    }
  }, [success, hasHandledSuccess, reset, onClose, navigate])

  const handleCancel = () => {
    if (onClose) {
      onClose()
      reset()
    } else {
      navigate('/system/services')
    }
  }

  // Access control check
  if (!user || parseInt(String(user.role)) !== 1) {
    return (
      <Box className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold" style={{ color: uiTheme.text }}>
          Access Denied. Owner privileges required.
        </div>
      </Box>
    )
  }

  const isModal = isOpen && onClose
  
  const formContent = (
    <Box className={`${isModal ? 'p-4 px-0 sm:p-6 sm:px-0' : 'p-6'}`}>
      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12}>
            <FormInput
              name="name"
              label="Service Name"
              type="service"
              control={control}
              error={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormInput
              name="price"
              label="Price ($)"
              type="price"
              control={control}
              error={errors.price}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              name="description"
              label="Description"
              type="description"
              control={control}
              error={errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              name="duration"
              label="Duration"
              type="duration"
              control={control}
              error={errors.duration}
            />
          </Grid>
          <Grid item xs={12}>
            <FormSelect
              name="status"
              label="Status"
              control={control}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              icon={<ToggleOn style={{ color: uiTheme.textSecondary }} />}
              required
            />
          </Grid>
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
                  <span>{isEditMode ? 'Update Service' : 'Create Service'}</span>
                </Box>
              )}
            </FormButton>
          </Box>
        </Box>
      </form>
    </Box>
  )


  // If used as modal
  if (isOpen && onClose) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
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
          {isEditMode ? 'Edit Service' : 'Add New Service'}
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

export default ServiceForm
