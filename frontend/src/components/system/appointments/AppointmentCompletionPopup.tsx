import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Chip,
  Button
} from '@mui/material'
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { RootState } from '../../../store'
import { getProductsRequest } from '../../../store/actions/productsActions'
import { createUserHistoryRequest, updateUserHistoryRequest } from '../../../store/actions/userHistoryActions'
import { Product } from '../../../types/product'
import { UserHistoryFormData, ProductUsed } from '../../../types/userHistory'
import { FormInput, FormSelect, FormButton, CustomGrid } from '../../shared'
import { RowAction } from '../../shared/RowActionsMenu'

interface AppointmentCompletionPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (appointment?: any) => void
  appointment: {
    id: number
    userId: number
    companyId: number
    staffId?: number
    serviceId: number
    userName?: string
    serviceName?: string
    staffName?: string
  }
  mode?: 'create' | 'view' | 'edit'
  existingHistory?: any
}

// Validation schema for single product form
const productSchema = yup.object({
  productId: yup.mixed().test('required', 'Product is required', (value) => {
    return value !== '' && value !== undefined && value !== null
  }).test('min', 'Please select a product', (value) => {
    return value === '' || value === undefined || value === null || (typeof value === 'number' && value >= 1)
  }),
  quantityUsed: yup.number().min(0.001, 'Quantity must be greater than 0').required('Quantity is required'),
  unitCost: yup.number().min(0, 'Unit cost must be 0 or greater').required('Unit cost is required'),
  notes: yup.string().optional()
})

// Validation schema for completion
const completionSchema = yup.object({
  notes: yup.string().optional()
})

const AppointmentCompletionPopup: React.FC<AppointmentCompletionPopupProps> = ({
  isOpen,
  onClose,
  onSuccess,
  appointment,
  mode = 'create',
  existingHistory
}) => {
  const dispatch = useDispatch()
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.products)
  const { createLoading, updateLoading, success, error } = useSelector((state: RootState) => state.userHistory)
  const { theme } = useSelector((state: RootState) => state.ui)

  // State for products grid
  const [productsUsed, setProductsUsed] = useState<ProductUsed[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Form for adding/editing single product
  const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProductUsed>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      productId: '' as any, // Use empty string instead of undefined to keep it controlled
      productName: '',
      quantityUsed: 1,
      unitCost: 0,
      notes: ''
    }
  })

  // Form for completion notes
  const { control: notesControl, handleSubmit: handleNotesSubmit, setValue: setNotesValue, watch: watchNotes } = useForm<{ notes: string }>({
    resolver: yupResolver(completionSchema),
    defaultValues: {
      notes: ''
    }
  })

  const watchedProduct = watch()
  const watchedNotes = watchNotes('notes')

  // Load products when popup opens
  useEffect(() => {
    if (isOpen && appointment.companyId) {
      dispatch(getProductsRequest())
    }
  }, [isOpen, appointment.companyId, dispatch])

  // Initialize data based on mode
  useEffect(() => {
    console.log('=== AppointmentCompletionPopup useEffect ===')
    console.log('isOpen:', isOpen)
    console.log('existingHistory:', existingHistory)
    console.log('mode:', mode)
    
    if (isOpen && existingHistory && (mode === 'view' || mode === 'edit')) {
      console.log('Existing history data:', existingHistory)
      console.log('ProductsUsed type:', typeof existingHistory.productsUsed)
      console.log('ProductsUsed value:', existingHistory.productsUsed)
      
      // Parse productsUsed if it's a string (from database JSON)
      let productsData = []
      if (existingHistory.productsUsed) {
        if (typeof existingHistory.productsUsed === 'string') {
          try {
            productsData = JSON.parse(existingHistory.productsUsed)
            console.log('Parsed products data:', productsData)
          } catch (error) {
            console.error('Error parsing productsUsed JSON:', error)
            productsData = []
          }
        } else if (Array.isArray(existingHistory.productsUsed)) {
          productsData = existingHistory.productsUsed
          console.log('Products data (array):', productsData)
        }
      }
      
      // Ensure each product has the required fields and calculate total
      productsData = productsData.map(product => ({
        ...product,
        total: (product.quantityUsed || 0) * (product.unitCost || 0)
      }))
      
      console.log('Final products data for grid:', productsData)
      
      // Populate with existing history data
      setProductsUsed(productsData)
      setNotesValue('notes', existingHistory.notes || '')
      setIsEditMode(mode === 'edit')
    } else if (isOpen && mode === 'create') {
      // Reset for new completion
      setProductsUsed([])
      setNotesValue('notes', '')
      setIsEditMode(false)
    }
  }, [isOpen, existingHistory, mode])

  // Debug productsUsed state changes
  useEffect(() => {
    console.log('ProductsUsed state changed:', productsUsed)
  }, [productsUsed])

  // Calculate total cost
  const totalCost = productsUsed.reduce((sum, product) => {
    return sum + (product.quantityUsed * product.unitCost)
  }, 0)

  // Get available products (not already added)
  const availableProducts = products?.filter(product => 
    product.status === 'active' && !productsUsed.some(p => p.productId === product.id)
  ) || []

  // Handle product selection to auto-populate unit cost
  useEffect(() => {
    if (watchedProduct.productId && watchedProduct.productId !== '') {
      const selectedProduct = availableProducts.find(p => p.id === watchedProduct.productId)
      if (selectedProduct) {
        setValue('unitCost', selectedProduct.unitPrice)
        setValue('productName', selectedProduct.name)
      }
    }
  }, [watchedProduct.productId, availableProducts, setValue])

  // Handle success
  useEffect(() => {
    if (success && createLoading === false && updateLoading === false) {
      handleSuccess()
    }
  }, [success, createLoading, updateLoading])

  const handleSuccess = () => {
    setProductsUsed([])
    setEditingIndex(null)
    reset({
      productId: '',
      productName: '',
      quantityUsed: 1,
      unitCost: 0,
      notes: ''
    })
    setNotesValue('notes', '')
    // Pass the appointment data to the parent component
    onSuccess(appointment)
  }

  const handleClose = () => {
    setProductsUsed([])
    setEditingIndex(null)
    reset({
      productId: '',
      productName: '',
      quantityUsed: 1,
      unitCost: 0,
      notes: ''
    })
    setNotesValue('notes', '')
    onClose()
  }

  // Add or update product
  const onProductSubmit = (data: ProductUsed) => {
    // Convert empty string to undefined for productId
    const productId = data.productId === '' ? undefined : data.productId
    
    if (!productId) {
      return // Don't submit if no product selected
    }
    
    const productData = {
      ...data,
      productId: productId,
      id: editingIndex !== null ? productsUsed[editingIndex].id : Date.now() + Math.random(), // Add unique ID
      productName: data.productName || availableProducts.find(p => p.id === productId)?.name || 'Unknown Product'
    }
    
    if (editingIndex !== null) {
      // Update existing product
      const updatedProducts = [...productsUsed]
      updatedProducts[editingIndex] = productData
      setProductsUsed(updatedProducts)
      setEditingIndex(null)
    } else {
      // Add new product
      setProductsUsed([...productsUsed, productData])
    }
    reset({
      productId: '',
      productName: '',
      quantityUsed: 1,
      unitCost: 0,
      notes: ''
    })
  }

  // Handle edit
  const handleEdit = (rowData: ProductUsed, index: number) => {
    setEditingIndex(index)
    setValue('productId', rowData.productId || '') // Ensure controlled value
    setValue('productName', rowData.productName)
    setValue('quantityUsed', rowData.quantityUsed)
    setValue('unitCost', rowData.unitCost)
    setValue('notes', rowData.notes || '')
  }

  // Handle delete
  const handleDelete = (index: number) => {
    const updatedProducts = productsUsed.filter((_, i) => i !== index)
    setProductsUsed(updatedProducts)
  }

  // Handle completion
  const onCompletionSubmit = (data: { notes: string }) => {
    const historyData = {
      appointmentId: appointment.id,
      productsUsed: productsUsed, // Can be empty array
      totalCost: totalCost, // Will be 0 if no products
      notes: data.notes || '' // Can be empty string
    }

    console.log('=== onCompletionSubmit Debug ===')
    console.log('mode:', mode)
    console.log('isEditMode:', isEditMode)
    console.log('existingHistory:', existingHistory)
    console.log('historyData:', historyData)

    if ((mode === 'edit' || isEditMode) && existingHistory) {
      // Update existing history
      console.log('Dispatching updateUserHistoryRequest with ID:', existingHistory.id)
      dispatch(updateUserHistoryRequest({ 
        id: existingHistory.id, 
        data: historyData 
      }))
    } else {
      // Create new history
      console.log('Dispatching createUserHistoryRequest')
      dispatch(createUserHistoryRequest(historyData))
    }
  }

  // Grid column definitions - simplified to match appointments grid pattern
  const columnDefs = [
    {
      headerName: 'Product',
      field: 'productName',
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150
    },
    {
      headerName: 'Quantity',
      field: 'quantityUsed',
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100,
      valueFormatter: (params: any) => params.value?.toFixed(3) || '0.000'
    },
    {
      headerName: 'Unit Cost',
      field: 'unitCost',
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100,
      valueFormatter: (params: any) => `$${params.value?.toFixed(2) || '0.00'}`
    },
    {
      headerName: 'Total',
      field: 'total',
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100,
      valueGetter: (params: any) => {
        const quantity = params.data?.quantityUsed || 0
        const unitCost = params.data?.unitCost || 0
        return quantity * unitCost
      },
      valueFormatter: (params: any) => `$${params.value?.toFixed(2) || '0.00'}`
    },
    {
      headerName: 'Notes',
      field: 'notes',
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150,
      valueFormatter: (params: any) => params.value || '-'
    }
  ]

  // Row actions
  const rowActions: RowAction[] = (mode === 'create' || isEditMode) ? [
    {
      id: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      onClick: (rowData: ProductUsed, rowIndex?: number) => {
        const index = rowIndex !== undefined ? rowIndex : productsUsed.findIndex(p => p.id === rowData.id)
        handleEdit(rowData, index)
      }
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />,
      onClick: (rowData: ProductUsed, rowIndex?: number) => {
        const index = rowIndex !== undefined ? rowIndex : productsUsed.findIndex(p => p.id === rowData.id)
        handleDelete(index)
      },
      color: 'error'
    }
  ] : []

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
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" component="div">
              {mode === 'view' ? 'View Appointment Details' : 
               mode === 'edit' ? 'Edit Appointment Details' : 
               'Complete Appointment'}
            </Typography>
            {mode === 'view' && existingHistory && (
              <Chip
                label="View Mode"
                size="small"
                color="info"
              />
            )}
            {mode === 'edit' && (
              <Chip
                label="Edit Mode"
                size="small"
                color="warning"
              />
            )}
          </Box>
          <Box display="flex" gap={1}>
            {mode === 'view' && existingHistory && (
              <Button
                startIcon={<EditIcon />}
                onClick={() => setIsEditMode(true)}
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
        {/* Appointment Info */}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Appointment Details
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label={`Customer: ${appointment.userName || 'Unknown'}`} variant="outlined" />
            <Chip label={`Service: ${appointment.serviceName || 'Unknown'}`} variant="outlined" />
            {appointment.staffName && (
              <Chip label={`Staff: ${appointment.staffName}`} variant="outlined" />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>
            {success}
          </Alert>
        )}

        {/* Product Form */}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            {editingIndex !== null ? 'Edit Product' : 'Add Product (Optional)'}
          </Typography>
          {(mode === 'create' || isEditMode) && (
            <form onSubmit={handleSubmit(onProductSubmit)}>
            <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
              {/* Product Selection */}
              <Box flex={1} minWidth={200}>
                <FormSelect
                  name="productId"
                  label="Select Product"
                  control={control}
                  options={availableProducts.map(product => ({
                    value: product.id,
                    label: `${product.name} - $${product.unitPrice.toFixed(2)}/${product.unit}`
                  }))}
                  error={errors.productId}
                  required
                />
              </Box>

              {/* Quantity */}
              <Box minWidth={120}>
                <FormInput
                  name="quantityUsed"
                  label="Quantity"
                  type="text"
                  control={control}
                  error={errors.quantityUsed}
                  required
                  placeholder="1.000"
                />
              </Box>

              {/* Unit Cost - Disabled */}
              <Box minWidth={120}>
                <FormInput
                  name="unitCost"
                  label="Unit Cost"
                  type="price"
                  control={control}
                  error={errors.unitCost}
                  disabled={true}
                  placeholder="Auto-filled"
                />
              </Box>

              {/* Add/Update Button */}
              <Box>
                <FormButton
                  type="submit"
                  variant="contained"
                  disabled={productsLoading || availableProducts.length === 0}
                >
                  <AddIcon style={{ marginRight: 8 }} />
                  {editingIndex !== null ? 'Update Product' : 'Add Product'}
                </FormButton>
              </Box>
            </Box>

            {/* Product Notes */}
            <Box mt={2}>
              <FormInput
                name="notes"
                label="Product Notes (Optional)"
                type="description"
                control={control}
                placeholder="Add notes about this product usage..."
              />
            </Box>
          </form>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Products Grid */}
        <Box mb={3} sx={{ minHeight: '200px' }}>
          <Typography variant="subtitle1" gutterBottom>
            Products Used ({productsUsed.length}) - Optional
          </Typography>
          {productsUsed.length > 0 ? (
            <Box sx={{ height: '300px', width: '100%' }}>
              <CustomGrid
                key={`products-grid-${productsUsed.length}`}
                data={productsUsed}
                columnDefs={columnDefs}
                theme={theme}
                height="100%"
                rowActions={rowActions}
                showTitle={false}
                showAlerts={false}
                rowHeight={50}
              />
            </Box>
          ) : (
            <Box textAlign="center" py={3} color="text.secondary">
              <Typography variant="body2">
                No products added yet. You can add products using the form above, or complete the appointment without products.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Total Cost */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Total Cost: ${totalCost.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Completion Notes */}
        <Box mb={3}>
          {(mode === 'create' || isEditMode) ? (
            <form onSubmit={handleNotesSubmit(onCompletionSubmit)}>
              <FormInput
                name="notes"
                label="Completion Notes (Optional)"
                type="description"
                control={notesControl}
                multiline={true}
                rows={3}
                placeholder="Add any additional notes about the appointment completion (optional)..."
              />
            </form>
          ) : (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Completion Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {watchedNotes || 'No completion notes'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.border}` }}>
        {mode === 'view' && !isEditMode ? (
          <FormButton
            type="button"
            variant="contained"
            onClick={handleClose}
          >
            Close
          </FormButton>
        ) : (
          <>
            <FormButton
              type="button"
              variant="outlined"
              onClick={handleClose}
              disabled={createLoading || updateLoading}
            >
              Cancel
            </FormButton>
            <FormButton
              type="submit"
              variant="contained"
              onClick={handleNotesSubmit(onCompletionSubmit)}
              disabled={createLoading || updateLoading}
            >
              {(createLoading || updateLoading) ? (
                <>
                  <CircularProgress size={16} style={{ marginRight: 8 }} />
                  {mode === 'edit' ? 'Updating...' : 'Completing...'}
                </>
              ) : (
                <>
                  <CheckCircleIcon style={{ marginRight: 8 }} />
                  {mode === 'edit' ? 'Update Appointment' : 'Complete Appointment'}
                </>
              )}
            </FormButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AppointmentCompletionPopup