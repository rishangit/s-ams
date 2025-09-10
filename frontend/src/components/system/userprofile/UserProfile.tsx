import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Send as SendIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { updateProfileRequest } from '../../../store/actions'
import { getCompanyByUserRequest } from '../../../store/actions/companyActions'
import FormInput from '../../shared/FormInput'
import FormSelect from '../../shared/FormSelect'
import FormButton from '../../shared/FormButton'
import FileUpload from '../../shared/FileUpload'
import { getRoleDisplayName, isValidRole, ROLES, DEFAULT_USER_ROLE } from '../../../constants/roles'
import { getProfileImageUrl } from '../../../utils/fileUtils'

// Validation schema
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phoneNumber: yup
    .string()
    .optional()
    .test('phone-format', 'Please enter a valid phone number', (value) => {
      if (!value) return true // Allow empty values
      return /^[+]?[\d\s\-\(\)]+$/.test(value) && value.length >= 10 && value.length <= 15
    }),
  role: yup
    .number()
    .required('Role is required'),
  profileImage: yup
    .string()
    .optional()
})

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: number
  profileImage?: string
}

const UserProfile: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state: RootState) => state.auth)
  const { company } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [imageUploadMessage, setImageUploadMessage] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: DEFAULT_USER_ROLE, // Default to USER role
      profileImage: ''
    }
  })

  // Watch the profileImage field to track changes
  const watchedProfileImage = watch('profileImage')

  // Load company data when user data is available
  useEffect(() => {
    if (user?.id) {
      dispatch(getCompanyByUserRequest(user.id))
    }
  }, [user?.id, dispatch])

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      const userImage = user.profileImage || ''
      setOriginalImage(userImage)
      setPreviewImage(userImage)
      
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        role: parseInt(user.role) || DEFAULT_USER_ROLE,
        profileImage: userImage
      })
    }
  }, [user, reset])

  // Monitor auth state changes for profile updates
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (hasSubmitted && !loading) {
      if (!error && user) {
        // Profile update was successful
        setIsEditing(false)
        setSuccessMessage('Profile updated successfully!')
        setPreviewImage(null) // Clear preview after successful save
        setOriginalImage(user.profileImage || null) // Update original image
        setTimeout(() => setSuccessMessage(''), 3000)
        setHasSubmitted(false)
      } else if (error) {
        // Profile update failed
        setSuccessMessage(`Failed to update profile: ${error}`)
        setTimeout(() => setSuccessMessage(''), 3000)
        setHasSubmitted(false)
      }
    }
  }, [loading, error, user, hasSubmitted])

  const handleEdit = () => {
    setIsEditing(true)
    setSuccessMessage('')
    setImageUploadMessage('')
    setPreviewImage(originalImage) // Reset preview to original
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSuccessMessage('')
    setImageUploadMessage('')
    setPreviewImage(originalImage) // Reset preview to original
    
    // Reset form data to original user data
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        role: parseInt(user.role) || DEFAULT_USER_ROLE,
        profileImage: user.profileImage || ''
      })
    }
  }

  const handleFileUploaded = (filePath: string, _fileUrl: string) => {
    // Update the form value for profileImage
    setValue('profileImage', filePath, { shouldDirty: true, shouldValidate: true })
    
    // Update preview image to show the uploaded image
    setPreviewImage(filePath)
    
    // Show success message for image upload
    setImageUploadMessage('Profile image uploaded successfully! Click "Save Changes" to update your profile.')
    setTimeout(() => setImageUploadMessage(''), 5000)
  }

  const handleFileDeleted = () => {
    // Update the form value for profileImage
    setValue('profileImage', '', { shouldDirty: true, shouldValidate: true })
    
    // Clear preview image
    setPreviewImage('')
    
    // Show success message for image deletion
    setImageUploadMessage('Profile image removed successfully! Click "Save Changes" to update your profile.')
    setTimeout(() => setImageUploadMessage(''), 5000)
  }

  const onSubmit = async (data: ProfileFormData) => {
    setHasSubmitted(true)
    dispatch(updateProfileRequest({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      profileImage: data.profileImage
    }))
  }

  // Check if there are any changes including image changes
  const hasChanges = isDirty || watchedProfileImage !== originalImage

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
        User Profile
      </Typography>

      {successMessage && (
        <Alert severity="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      {imageUploadMessage && (
        <Alert severity="info" className="mb-4">
          {imageUploadMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Image Card */}
        <Grid item xs={12} md={4}>
          <Paper
            className="p-6"
            style={{ 
              backgroundColor: uiTheme.surface,
              border: `1px solid ${uiTheme.mode === 'dark' ? '#334155' : '#e5e7eb'}`
            }}
          >
            <Box className="flex flex-col items-center text-center">
              {/* Show preview image if available, otherwise show current avatar */}
              <Avatar
                className="w-64 h-64 mb-6"
                style={{ backgroundColor: uiTheme.primary }}
                src={previewImage ? getProfileImageUrl(previewImage) : getProfileImageUrl(user.profileImage)}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  console.error('Avatar image failed to load:', target.src)
                }}
              >
                <span className="text-white font-semibold text-7xl">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
              </Avatar>
              
              {/* Show file upload only in edit mode */}
              {isEditing && (
                <FileUpload
                  key={watchedProfileImage || 'no-image'} // Force re-render when image changes
                  onFileUploaded={handleFileUploaded}
                  onFileDeleted={handleFileDeleted}
                  currentImagePath={watchedProfileImage}
                  folderPath="profile"
                  label="Upload New Profile Image"
                  className="mb-4"
                />
              )}
              
              <Typography
                variant="h5"
                className="font-semibold mb-2"
                style={{ color: uiTheme.text }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              
              <Typography
                variant="body1"
                className="mb-4"
                style={{ color: uiTheme.textSecondary }}
              >
                {isValidRole(parseInt(user.role)) ? getRoleDisplayName(parseInt(user.role) as any) : 'User'}
              </Typography>
              
              <Typography
                variant="body2"
                style={{ color: uiTheme.textSecondary }}
              >
                {user.email}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Form Card */}
        <Grid item xs={12} md={8}>
          <Paper
            className="p-6"
            style={{ 
              backgroundColor: uiTheme.surface,
              border: `1px solid ${uiTheme.mode === 'dark' ? '#334155' : '#e5e7eb'}`
            }}
          >
            <Typography
              variant="h6"
              className="mb-4 font-semibold"
              style={{ color: uiTheme.text }}
            >
              Profile Information
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="firstName"
                    label="First Name"
                    type="text"
                    control={control}
                    error={errors.firstName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="lastName"
                    label="Last Name"
                    type="text"
                    control={control}
                    error={errors.lastName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    control={control}
                    error={errors.email}
                    required
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    control={control}
                    error={errors.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormSelect
                    name="role"
                    label="Role"
                    control={control}
                    options={[
                      { value: ROLES.ADMIN, label: 'Administrator' },
                      { value: ROLES.OWNER, label: 'Owner' },
                      { value: ROLES.STAFF, label: 'Staff' },
                      { value: ROLES.USER, label: 'User' }
                    ]}
                    required
                    disabled={true}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box className="flex justify-end space-x-3 mt-6">
                {!isEditing ? (
                  <FormButton
                    type="button"
                    onClick={handleEdit}
                  >
                    <Box className="flex items-center space-x-2">
                      <PersonIcon />
                      <span>Edit Profile</span>
                    </Box>
                  </FormButton>
                ) : (
                  <>
                    <FormButton
                      type="button"
                      variant="outlined"
                      onClick={handleCancel}
                    >
                      <Box className="flex items-center space-x-2">
                        <CancelIcon />
                        <span>Cancel</span>
                      </Box>
                    </FormButton>
                    <FormButton
                      type="submit"
                      disabled={loading || !hasChanges}
                    >
                      {loading ? (
                        <CircularProgress size={20} style={{ color: '#fff' }} />
                      ) : (
                        <Box className="flex items-center space-x-2">
                          <SaveIcon />
                          <span>Save Changes</span>
                        </Box>
                      )}
                    </FormButton>
                  </>
                )}
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Company Registration Request Card - For Users and Owners (role USER and OWNER) */}
        {(parseInt(user.role) === ROLES.USER || parseInt(user.role) === ROLES.OWNER) && (
          <Grid item xs={12}>
            <Paper
              className="p-6"
              style={{ 
                backgroundColor: uiTheme.surface,
                border: `1px solid ${uiTheme.mode === 'dark' ? '#334155' : '#e5e7eb'}`
              }}
            >
              <Box className="flex items-center mb-4">
                <BusinessIcon 
                  className="mr-3" 
                  style={{ color: uiTheme.primary, fontSize: '2rem' }}
                />
                <Typography
                  variant="h6"
                  className="font-semibold"
                  style={{ color: uiTheme.text }}
                >
                  Company Registration Request
                </Typography>
              </Box>
              
              <Typography
                variant="body1"
                className="mb-4"
                style={{ color: uiTheme.textSecondary }}
              >
                {company ? 
                  `Your company "${company.name}" is registered with status: ${company.status}. You can edit your company details or view the current status.` :
                  'You can request to register your company with our system. This will allow you to access additional features and manage your organization\'s data.'
                }
              </Typography>

              <Box 
                className="p-4 rounded-lg mb-4"
                style={{ 
                  backgroundColor: uiTheme.mode === 'dark' ? '#1e3a8a20' : '#dbeafe',
                  border: `1px solid ${uiTheme.mode === 'dark' ? '#3b82f620' : '#93c5fd'}`
                }}
              >
                <Typography
                  variant="body2"
                  className="font-medium mb-2"
                  style={{ color: uiTheme.text }}
                >
                  Benefits of Company Registration:
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  <li style={{ color: uiTheme.textSecondary }}>
                    Access to company-specific features and data
                  </li>
                  <li style={{ color: uiTheme.textSecondary }}>
                    Ability to manage team members and permissions
                  </li>
                  <li style={{ color: uiTheme.textSecondary }}>
                    Enhanced reporting and analytics
                  </li>
                  <li style={{ color: uiTheme.textSecondary }}>
                    Priority support and assistance
                  </li>
                </ul>
              </Box>

              <Box className="flex justify-end">
                <FormButton
                  type="button"
                  variant="contained"
                  onClick={() => {
                    if (company?.id) {
                      navigate(`/system/companies/${company.id}`)
                    } else {
                      navigate('/system/companies/new')
                    }
                  }}
                >
                  <Box className="flex items-center space-x-2">
                    <SendIcon />
                    <span>{company ? 'View Company Details' : 'Request Company Registration'}</span>
                  </Box>
                </FormButton>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default UserProfile
