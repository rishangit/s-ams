import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Button
} from '@mui/material'
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Notes as NotesIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { getProfileImageUrl } from '../../../utils/fileUtils'
import { format } from 'date-fns'
import { apiService } from '../../../services/api'
import { getStatusDisplayName, getStatusColor } from '../../../constants/appointmentStatus'
import { getProductsRequest } from '../../../store/actions/productsActions'
import { updateUserHistoryRequest } from '../../../store/actions/userHistoryActions'
import { FormInput, FormSelect, FormButton, CustomGrid } from '../../shared'

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

interface UserHistory {
  id: number
  appointmentId: number
  userId: number
  companyId: number
  staffId?: number
  serviceId: number
  productsUsed: Array<{
    id: string | number
    productId: number
    productName: string
    quantityUsed: number
    unitCost: number
    total: number
    notes?: string
  }>
  totalCost: number
  notes?: string
  completionDate: string
  createdAt: string
  updatedAt: string
  // Joined data
  userName?: string
  userEmail?: string
  companyName?: string
  staffName?: string
  staffEmail?: string
  serviceName?: string
  servicePrice?: number
}

interface AppointmentHistoryPopupProps {
  isOpen: boolean
  onClose: () => void
  appointment: UserAppointment
}

// Validation schema for single product form
const productSchema = yup.object({
  productId: yup.mixed().test('required', 'Product is required', (value) => {
    return value !== '' && value !== undefined && value !== null
  }),
  quantityUsed: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  unitCost: yup.number().min(0, 'Unit cost must be non-negative').required('Unit cost is required'),
  notes: yup.string().optional()
})

// Validation schema for completion notes
const notesSchema = yup.object({
  notes: yup.string().optional()
})

const AppointmentHistoryPopup: React.FC<AppointmentHistoryPopupProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.ui)
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.products)
  const { updateLoading, success } = useSelector((state: RootState) => state.userHistory)
  
  const [userHistory, setUserHistory] = useState<UserHistory | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [productsUsed, setProductsUsed] = useState<any[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form for adding/editing products
  const productForm = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      productId: '',
      quantityUsed: 1,
      unitCost: 0,
      notes: ''
    }
  })

  // Form for completion notes
  const notesForm = useForm({
    resolver: yupResolver(notesSchema),
    defaultValues: {
      notes: ''
    }
  })

  // Fetch appointment history when popup opens
  useEffect(() => {
    if (isOpen && appointment.id) {
      fetchAppointmentHistory()
      dispatch(getProductsRequest())
    }
  }, [isOpen, appointment.id, dispatch])

  // Handle success from update
  useEffect(() => {
    if (success && updateLoading === false) {
      setIsEditMode(false)
      fetchAppointmentHistory() // Refresh data
    }
  }, [success, updateLoading])

  const fetchAppointmentHistory = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)
      
      const response = await apiService.getUserHistoryByAppointmentId(appointment.id)
      
      if (response.success) {
        setUserHistory(response.data)
        // Set products used and notes for editing
        setProductsUsed(response.data?.productsUsed || [])
        notesForm.setValue('notes', response.data?.notes || '')
      } else {
        setUserHistory(null) // No history found
        setProductsUsed([])
        notesForm.setValue('notes', '')
      }
    } catch (err) {
      console.error('Error fetching appointment history:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch appointment history')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setUserHistory(null)
    setErrorMessage(null)
    setIsEditMode(false)
    setProductsUsed([])
    setEditingIndex(null)
    productForm.reset()
    notesForm.reset()
    onClose()
  }

  const handleEditMode = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditingIndex(null)
    // Reset to original data
    if (userHistory) {
      setProductsUsed(userHistory.productsUsed || [])
      notesForm.setValue('notes', userHistory.notes || '')
    }
  }

  const handleSaveChanges = () => {
    if (!userHistory) return

    const updateData = {
      productsUsed,
      notes: notesForm.getValues('notes'),
      totalCost: productsUsed.reduce((total, product) => total + (product.quantityUsed * product.unitCost), 0)
    }

    dispatch(updateUserHistoryRequest({ id: userHistory.id, data: updateData }))
  }

  // Product management functions
  const onProductSubmit = (data: any) => {
    if (!products) return
    const selectedProduct = products.find(p => p.id === data.productId)
    if (!selectedProduct) return

    const productData = {
      id: editingIndex !== null ? productsUsed[editingIndex].id : Date.now(),
      productId: data.productId,
      productName: selectedProduct.name,
      quantityUsed: data.quantityUsed,
      unitCost: data.unitCost,
      total: data.quantityUsed * data.unitCost,
      notes: data.notes || ''
    }

    if (editingIndex !== null) {
      const updatedProducts = [...productsUsed]
      updatedProducts[editingIndex] = productData
      setProductsUsed(updatedProducts)
      setEditingIndex(null)
    } else {
      setProductsUsed([...productsUsed, productData])
    }

    productForm.reset()
  }

  const handleEditProduct = (index: number) => {
    const product = productsUsed[index]
    productForm.setValue('productId', product.productId)
    productForm.setValue('quantityUsed', product.quantityUsed)
    productForm.setValue('unitCost', product.unitCost)
    productForm.setValue('notes', product.notes || '')
    setEditingIndex(index)
  }

  const handleDeleteProduct = (index: number) => {
    const updatedProducts = productsUsed.filter((_, i) => i !== index)
    setProductsUsed(updatedProducts)
  }

  // Column definitions for products grid
  const productColumnDefs = [
    {
      headerName: 'Product',
      field: 'productName',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Quantity',
      field: 'quantityUsed',
      width: 100
    },
    {
      headerName: 'Unit Cost',
      field: 'unitCost',
      width: 100,
      cellRenderer: (params: any) => `$${params.value.toFixed(2)}`
    },
    {
      headerName: 'Total',
      field: 'total',
      width: 100,
      cellRenderer: (params: any) => `$${params.value.toFixed(2)}`
    },
    {
      headerName: 'Notes',
      field: 'notes',
      flex: 1,
      minWidth: 150
    },
    ...(isEditMode ? [{
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      cellRenderer: (params: any) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => handleEditProduct(params.rowIndex)}
            sx={{ color: theme.primary }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteProduct(params.rowIndex)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }] : [])
  ]

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.surface,
          color: theme.text,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: `1px solid ${theme.border}` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Appointment History Details
            {userHistory && (
              <Chip
                label={isEditMode ? 'Edit Mode' : 'View Mode'}
                size="small"
                color={isEditMode ? 'warning' : 'info'}
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <Box display="flex" gap={1}>
            {userHistory && !isEditMode && (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditMode}
                variant="outlined"
                size="small"
              >
                Edit
              </Button>
            )}
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        {/* Appointment Information */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Appointment Information
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
            <Chip
              icon={<CalendarIcon />}
              label={format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
              variant="outlined"
            />
            <Chip
              icon={<TimeIcon />}
              label={appointment.appointmentTime}
              variant="outlined"
            />
            <Chip
              label={getStatusDisplayName(appointment.status as any)}
              size="small"
              style={{
                backgroundColor: getStatusColor(appointment.status as any),
                color: '#ffffff',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Service Information */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Service Details
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <BusinessIcon color="primary" />
            <Typography variant="body1" className="font-medium">
              {appointment.serviceName || 'N/A'}
            </Typography>
            {appointment.servicePrice && (
              <Chip
                icon={<MoneyIcon />}
                label={`$${appointment.servicePrice}`}
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Staff Information */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Staff Assignment
          </Typography>
          {appointment.staffName ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={getProfileImageUrl(appointment.staffProfileImage)}
                alt={appointment.staffName}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="body1" className="font-medium">
                  {appointment.staffName}
                </Typography>
                {appointment.staffEmail && (
                  <Typography variant="body2" color="text.secondary">
                    {appointment.staffEmail}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No staff assigned
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Appointment Notes */}
        {appointment.notes && (
          <>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Appointment Notes
              </Typography>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <NotesIcon color="primary" />
                <Typography variant="body1">
                  {appointment.notes}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Completion History */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Completion History
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : errorMessage ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          ) : userHistory ? (
            <Box>
              {/* Completion Date */}
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Completed on: {format(new Date(userHistory.completionDate), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>

              {/* Products Used Section */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Products Used ({productsUsed.length})
                </Typography>
                
                {/* Products Grid */}
                <Box sx={{ height: '300px', width: '100%', mb: 2 }}>
                  <CustomGrid
                    data={productsUsed}
                    columnDefs={productColumnDefs}
                    loading={false}
                    theme={theme}
                    height="100%"
                    showTitle={false}
                    showAlerts={false}
                    rowHeight={50}
                  />
                </Box>

                {/* Add/Edit Product Form (only in edit mode) */}
                {isEditMode && (
                  <Box sx={{ p: 2, border: `1px solid ${theme.border}`, borderRadius: 1, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {editingIndex !== null ? 'Edit Product' : 'Add Product'}
                    </Typography>
                    <Box component="form" onSubmit={productForm.handleSubmit(onProductSubmit)}>
                      <Box display="flex" gap={2} mb={2}>
                        <Box flex={1}>
                          <FormSelect
                            control={productForm.control}
                            name="productId"
                            label="Product"
                            options={products?.map(product => ({
                              value: product.id,
                              label: product.name
                            })) || []}
                            disabled={productsLoading}
                          />
                        </Box>
                        <Box width={120}>
                          <FormInput
                            control={productForm.control}
                            name="quantityUsed"
                            label="Quantity"
                            type="text"
                          />
                        </Box>
                        <Box width={120}>
                          <FormInput
                            control={productForm.control}
                            name="unitCost"
                            label="Unit Cost"
                            type="price"
                          />
                        </Box>
                      </Box>
                      <Box mb={2}>
                        <FormInput
                          control={productForm.control}
                          name="notes"
                          label="Product Notes"
                          multiline
                          rows={2}
                        />
                      </Box>
                      <Box display="flex" gap={1}>
                        <FormButton
                          type="submit"
                          variant="contained"
                        >
                          {editingIndex !== null ? 'Update Product' : 'Add Product'}
                        </FormButton>
                        {editingIndex !== null && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setEditingIndex(null)
                              productForm.reset()
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Total Cost */}
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    Total Cost: ${productsUsed.reduce((total, product) => total + (product.quantityUsed * product.unitCost), 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Completion Notes */}
              <Box mb={2}>
                <Typography variant="h6" gutterBottom>
                  Completion Notes
                </Typography>
                {isEditMode ? (
                  <Box component="form" onSubmit={notesForm.handleSubmit(() => {})}>
                    <FormInput
                      control={notesForm.control}
                      name="notes"
                      label="Completion Notes"
                      multiline
                      rows={4}
                      placeholder="Add any additional notes about the appointment completion..."
                    />
                  </Box>
                ) : (
                  <Typography variant="body2">
                    {userHistory.notes || 'No completion notes'}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              This appointment has not been completed yet.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.border}` }}>
        <Box sx={{ flex: 1 }} />
        {isEditMode ? (
          <Box display="flex" gap={1}>
            <Button
              startIcon={<CancelIcon />}
              onClick={handleCancelEdit}
              variant="outlined"
            >
              Cancel
            </Button>
            <FormButton
              onClick={handleSaveChanges}
              variant="contained"
            >
              Save Changes
            </FormButton>
          </Box>
        ) : (
          <Button
            onClick={handleClose}
            variant="contained"
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AppointmentHistoryPopup
