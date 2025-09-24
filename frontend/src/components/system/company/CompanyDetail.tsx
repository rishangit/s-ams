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
import { useParams } from 'react-router-dom'
import { RootState } from '../../../store'
import {
  updateCompanyRequest,
  getCompanyByIdRequest,
  clearCompanyError,
  clearCompanySuccess
} from '../../../store/actions/companyActions'
import { CompanyFormData, CompanyStatus, getCompanyStatusDisplayName, getCompanyStatusColor } from '../../../constants/company'
import FormInput from '../../shared/FormInput'
import FormButton from '../../shared/FormButton'
import CategorySelector from '../../shared/CategorySelector'
import { useCategories } from '../../../hooks/useCategories'

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

const CompanyDetail: React.FC = () => {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { company, loading, error, success, updateLoading } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)
  const { getAllCategories, categoriesWithSubcategories } = useCategories()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)

  // Check if current user can edit this company
  const canEditCompany = () => {
    if (!user || !company) return false
    
    // Admin (role 0) can edit any company
    if (parseInt(String(user.role)) === 0) return true
    
    // Company owner can edit their own company
    if (user.id === company.userId) return true
    
    // All other users (including role 3) cannot edit
    return false
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema) as any,
    defaultValues: {
      name: '',
      address: '',
      phoneNumber: '',
      landPhone: '',
      geoLocation: '',
      categoryId: undefined,
      subcategoryId: undefined
    }
  })

  // Load company data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getCompanyByIdRequest(parseInt(id)))
    }
  }, [id]) // Removed dispatch from dependencies as it's stable

  // Load categories when component mounts
  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

  // Initialize form data when company data is available
  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        address: company.address || '',
        phoneNumber: company.phoneNumber || '',
        landPhone: company.landPhone || '',
        geoLocation: company.geoLocation || '',
        categoryId: company.categoryId || undefined,
        subcategoryId: company.subcategoryId || undefined
      })
      
      // Set category selection state
      setSelectedCategoryId(company.categoryId || null)
      setSelectedSubcategoryId(company.subcategoryId || null)
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
  }, [error]) // Removed dispatch from dependencies as it's stable

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearCompanySuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success]) // Removed dispatch from dependencies as it's stable

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
        geoLocation: company.geoLocation || '',
        categoryId: company.categoryId || undefined,
        subcategoryId: company.subcategoryId || undefined
      })
      
      // Reset category selection state
      setSelectedCategoryId(company.categoryId || null)
      setSelectedSubcategoryId(company.subcategoryId || null)
    }
  }

  const onSubmit = async (data: CompanyFormData) => {
    if (company?.id) {
      // The form data already includes categoryId and subcategoryId from setValue calls
      dispatch(updateCompanyRequest({ id: company.id, data }))
      setIsEditing(false)
    }
  }

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId)
    setSelectedSubcategoryId(null) // Reset subcategory when category changes
    setValue('categoryId', categoryId || undefined, { shouldDirty: true })
    setValue('subcategoryId', undefined, { shouldDirty: true })
  }

  const handleSubcategoryChange = (subcategoryId: number | null) => {
    setSelectedSubcategoryId(subcategoryId)
    setValue('subcategoryId', subcategoryId || undefined, { shouldDirty: true })
  }



  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  if (!company) {
    return (
      <Box className="mx-auto p-0 md:p-6">
        <Alert severity="error" className="mb-4">
          Company not found
        </Alert>
      </Box>
    )
  }

  return (
    <Box className="mx-auto p-0 md:p-6">
      <Box className="flex items-center justify-between mb-4">
        <Typography
          variant="h6"
          className="font-bold text-xl md:text-3xl"
          style={{ color: uiTheme.text }}
        >
          Company Details
        </Typography>
      </Box>

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
                <Box>
                  <Typography
                    variant="h6"
                    className="font-semibold"
                    style={{ color: uiTheme.text }}
                  >
                    {company.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: uiTheme.textSecondary }}
                  >
                    Company ID: {company.id}
                  </Typography>
                  {company.categoryName && (
                    <Typography
                      variant="body2"
                      style={{ color: uiTheme.textSecondary }}
                    >
                      Category: {company.categoryName}
                      {company.subcategoryName && ` - ${company.subcategoryName}`}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Chip
                label={getCompanyStatusDisplayName(company.status as CompanyStatus)}
                style={{
                  backgroundColor: getCompanyStatusColor(company.status as CompanyStatus),
                  color: '#ffffff',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Company Form Card */}
        <Grid item xs={12}>
          <Paper
            className="p-6"
            style={{ backgroundColor: uiTheme.surface }}
          >
            <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <Box>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  style={{ color: uiTheme.text }}
                >
                  Company Information
                </Typography>
                {!canEditCompany() && (
                  <Typography
                    variant="body2"
                    style={{ color: uiTheme.textSecondary, fontStyle: 'italic' }}
                  >
                    View-only mode - Only company owners can edit details
                  </Typography>
                )}
              </Box>
              {canEditCompany() && (
                <>
                  {!isEditing ? (
                    <FormButton
                      type="button"
                      onClick={handleEdit}
                    >
                      <Box className="flex items-center space-x-2">
                        <EditIcon />
                        <span>Edit Company</span>
                      </Box>
                    </FormButton>
                  ) : (
                    <Box className="flex flex-col md:flex-row gap-2">
                      <FormButton
                        type="button"
                        variant="outlined"
                        onClick={handleCancel}
                      >
                        Cancel
                      </FormButton>
                      <FormButton
                        type="submit"
                        disabled={updateLoading || !isDirty}
                        onClick={handleSubmit(onSubmit)}
                      >
                        {updateLoading ? (
                          <CircularProgress size={20} style={{ color: '#fff' }} />
                        ) : (
                          <Box className="flex items-center space-x-2">
                            <SaveIcon />
                            <span>Save Changes</span>
                          </Box>
                        )}
                      </FormButton>
                    </Box>
                  )}
                </>
              )}
            </Box>
            
            {/* Category Information Display */}
            {company.categoryName && (
              <Box className="mb-4 p-4 rounded-lg" style={{ backgroundColor: uiTheme.background, border: `1px solid ${uiTheme.border}` }}>
                <Typography
                  variant="h6"
                  className="font-semibold mb-2"
                  style={{ color: uiTheme.text }}
                >
                  Business Category
                </Typography>
                <Box className="flex items-center gap-2">
                  <Chip
                    label={company.categoryName}
                    size="small"
                    style={{
                      backgroundColor: uiTheme.primary,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  {company.subcategoryName && (
                    <>
                      <Typography variant="body2" style={{ color: uiTheme.textSecondary }}>
                        →
                      </Typography>
                      <Chip
                        label={company.subcategoryName}
                        size="small"
                        variant="outlined"
                        style={{
                          borderColor: uiTheme.primary,
                          color: uiTheme.primary
                        }}
                      />
                    </>
                  )}
                </Box>
              </Box>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="name"
                    label="Company Name"
                    type="text"
                    control={control}
                    error={errors.name}
                    required
                    disabled={!isEditing || !canEditCompany()}
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
                    disabled={!isEditing || !canEditCompany()}
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
                    disabled={!isEditing || !canEditCompany()}
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
                    disabled={!isEditing || !canEditCompany()}
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
                    disabled={!isEditing || !canEditCompany()}
                  />
                </Grid>
                
                {/* Category Selection - Only show for role 1 (Owner) */}
                {user && parseInt(String(user.role)) === 1 && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        className="font-semibold mb-3"
                        style={{ color: uiTheme.text }}
                      >
                        Business Category
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CategorySelector
                        selectedCategoryId={selectedCategoryId}
                        selectedSubcategoryId={selectedSubcategoryId}
                        onCategoryChange={handleCategoryChange}
                        onSubcategoryChange={handleSubcategoryChange}
                        disabled={!isEditing || !canEditCompany()}
                        label="Category"
                        subcategoryLabel="Subcategory"
                        theme={uiTheme}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* Display current category info when not editing */}
                      {!isEditing && company && (
                        <Box className="p-4 rounded-lg" style={{ backgroundColor: uiTheme.background }}>
                          <Typography variant="body2" style={{ color: uiTheme.textSecondary }} className="mb-2">
                            Current Category:
                          </Typography>
                          {company.categoryName && (
                            <Typography variant="body1" style={{ color: uiTheme.text }} className="font-medium">
                              {company.categoryName}
                            </Typography>
                          )}
                          {company.subcategoryName && (
                            <Typography variant="body2" style={{ color: uiTheme.textSecondary }}>
                              {company.subcategoryName}
                            </Typography>
                          )}
                          {!company.categoryName && (
                            <Typography variant="body2" style={{ color: uiTheme.textSecondary, fontStyle: 'italic' }}>
                              No category selected
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Grid>
                  </>
                )}
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CompanyDetail
