import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import {
  createCompanyRequest,
  updateCompanyRequest,
  getCompanyByUserRequest,
  clearCompanyError,
  clearCompanySuccess
} from '../../../store/actions/companyActions'
import { CompanyFormData, CompanyStatus, getCompanyStatusDisplayName, getCompanyStatusColor } from '../../../constants/company'
import FormInput from '../../shared/FormInput'
import FormButton from '../../shared/FormButton'

// Validation schema
const companySchema = yup.object({
  name: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .test('phone-format', 'Please enter a valid phone number', (value) => {
      if (!value) return false
      return /^[+]?[\d\s\-\(\)]+$/.test(value) && value.length >= 10 && value.length <= 15
    }),
  landPhone: yup
    .string()
    .required('Land phone is required')
    .test('phone-format', 'Please enter a valid land phone number', (value) => {
      if (!value) return false
      return /^[+]?[\d\s\-\(\)]+$/.test(value) && value.length >= 10 && value.length <= 15
    }),
  geoLocation: yup
    .string()
    .required('Geo location is required')
    .min(5, 'Geo location must be at least 5 characters')
    .max(100, 'Geo location must be less than 100 characters')
})

const Company: React.FC = () => {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { company, error, success, createLoading, updateLoading } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  const [isEditing, setIsEditing] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema) as any,
    defaultValues: {
      name: '',
      address: '',
      phoneNumber: '',
      landPhone: '',
      geoLocation: ''
    }
  })

  // Load company data when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(getCompanyByUserRequest(user.id))
    }
  }, [user?.id, dispatch])

  // Initialize form data when company data is available
  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        address: company.address || '',
        phoneNumber: company.phoneNumber || '',
        landPhone: company.landPhone || '',
        geoLocation: company.geoLocation || ''
      })
    }
  }, [company, reset])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearCompanyError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearCompanySuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original company data
    if (company) {
      reset({
        name: company.name || '',
        address: company.address || '',
        phoneNumber: company.phoneNumber || '',
        landPhone: company.landPhone || '',
        geoLocation: company.geoLocation || ''
      })
    }
  }

  const onSubmit = async (data: CompanyFormData) => {
    console.log('Company form submitted:', data)
    console.log('Current user:', user)
    
    if (company?.id) {
      // Update existing company
      console.log('Updating existing company:', company.id)
      dispatch(updateCompanyRequest({ id: company.id, data }))
    } else {
      // Create new company
      console.log('Creating new company')
      dispatch(createCompanyRequest(data))
    }
    setIsEditing(false)
  }

  if (!user) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="mx-auto p-6">
      <Typography
        variant="h4"
        className="mb-6 font-bold"
        style={{ color: uiTheme.text }}
      >
        Company Registration
      </Typography>

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

      <Grid container spacing={3}>
        {/* Company Status Card */}
        {company && (
          <Grid item xs={12}>
            <Paper
              className="p-6"
              style={{ backgroundColor: uiTheme.surface }}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center">
                  <BusinessIcon 
                    className="mr-3" 
                    style={{ color: uiTheme.primary, fontSize: '2rem' }}
                  />
                  <Typography
                    variant="h6"
                    className="font-semibold"
                    style={{ color: uiTheme.text }}
                  >
                    Company Status
                  </Typography>
                </Box>
                <Chip
                  label={getCompanyStatusDisplayName(company.status)}
                  style={{
                    backgroundColor: getCompanyStatusColor(company.status),
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Typography
                variant="body1"
                className="mt-4"
                style={{ color: uiTheme.textSecondary }}
              >
                {company.status === CompanyStatus.PENDING && 
                  'Your company registration request is currently under review. You will be notified once it is approved.'
                }
                {company.status === CompanyStatus.ACTIVE && 
                  'Your company is active and you have access to all features.'
                }
                {company.status === CompanyStatus.INACTIVE && 
                  'Your company is currently inactive. Please contact support for assistance.'
                }
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Company Form Card */}
        <Grid item xs={12}>
          <Paper
            className="p-6"
            style={{ backgroundColor: uiTheme.surface }}
          >
            <Box className="flex items-center justify-between mb-4">
              <Typography
                variant="h6"
                className="font-semibold"
                style={{ color: uiTheme.text }}
              >
                Company Information
              </Typography>
              {company && !isEditing && (
                <FormButton
                  type="button"
                  variant="outlined"
                  onClick={handleEdit}
                >
                  <Box className="flex items-center space-x-2">
                    <EditIcon />
                    <span>Edit Details</span>
                  </Box>
                </FormButton>
              )}
            </Box>
            
                         <form onSubmit={handleSubmit((data) => {
               console.log('Form submitted with data:', data)
               console.log('Form errors:', errors)
               console.log('Form is dirty:', isDirty)
               onSubmit(data)
             })}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="name"
                    label="Company Name"
                    type="text"
                    control={control}
                    error={errors.name}
                    required
                    disabled={!isEditing && !!company}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    control={control}
                    error={errors.phoneNumber}
                    required
                    disabled={!isEditing && !!company}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="landPhone"
                    label="Land Phone"
                    type="tel"
                    control={control}
                    error={errors.landPhone}
                    required
                    disabled={!isEditing && !!company}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="geoLocation"
                    label="Geo Location"
                    type="text"
                    control={control}
                    error={errors.geoLocation}
                    required
                    disabled={!isEditing && !!company}
                    placeholder="e.g., Latitude, Longitude or City, Country"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    name="address"
                    label="Address"
                    type="text"
                    control={control}
                    error={errors.address}
                    required
                    disabled={!isEditing && !!company}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              {isEditing && (
                <Box className="flex justify-end space-x-3 mt-6">
                  <FormButton
                    type="button"
                    variant="outlined"
                    onClick={handleCancel}
                  >
                    Cancel
                  </FormButton>
                  <FormButton
                    type="submit"
                    disabled={createLoading || updateLoading || !isDirty}
                  >
                    {createLoading || updateLoading ? (
                      <CircularProgress size={20} style={{ color: '#fff' }} />
                    ) : (
                      <Box className="flex items-center space-x-2">
                        <SaveIcon />
                        <span>{company ? 'Update Company' : 'Register Company'}</span>
                      </Box>
                    )}
                  </FormButton>
                </Box>
              )}

              {/* Register Button for new companies */}
              {!company && !isEditing && (
                <Box className="flex justify-end mt-6">
                  <FormButton
                    type="button"
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
                    <Box className="flex items-center space-x-2">
                      <BusinessIcon />
                      <span>Register Company</span>
                    </Box>
                  </FormButton>
                </Box>
              )}
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Company
