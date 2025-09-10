import React, { useEffect, useMemo } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Avatar
} from '@mui/material'
import {
  Business as BusinessIcon,
  // Person,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../../store'
import {
  getAllCompaniesRequest,
  updateCompanyStatusRequest,
  clearCompanyError,
  clearCompanySuccess
} from '../../../store/actions/companyActions'
import { CompanyStatus, getCompanyStatusDisplayName, getCompanyStatusColor } from '../../../constants/company'
import { isAdminOnlyRole } from '../../../constants/roles'
import { CustomGrid } from '../../../components/shared'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { getProfileImageUrl } from '../../../utils/fileUtils'

const Companies: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { companies, loading, error, success } = useSelector((state: RootState) => state.company)
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  // Load companies when component mounts
  useEffect(() => {
    if (user && isAdminOnlyRole(parseInt(user.role) as any)) {
      dispatch(getAllCompaniesRequest())
    }
  }, [user?.role, dispatch])

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

  const handleStatusChange = (companyId: number, newStatus: CompanyStatus) => {
    dispatch(updateCompanyStatusRequest({ id: companyId, status: newStatus }))
  }



  // Status Cell Renderer Component
  const StatusCellRenderer = (props: ICellRendererParams) => {
    const { value } = props
    const statusColor = getCompanyStatusColor(value)
    const statusText = getCompanyStatusDisplayName(value)
    
    return (
      <Chip
        label={statusText}
        size="small"
        style={{
          backgroundColor: statusColor,
          color: '#fff',
          fontWeight: 'bold'
        }}
      />
    )
  }

  // Actions Cell Renderer Component
  const ActionsCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex gap-2">
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => navigate(`/system/companies/${data.id}`)}
            style={{ color: uiTheme.primary }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Status">
          <FormControl size="small" style={{ minWidth: 120 }}>
            <Select
              value={data.status}
              onChange={(e) => handleStatusChange(data.id, e.target.value as CompanyStatus)}
              style={{ fontSize: '0.875rem' }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Tooltip>
      </Box>
    )
  }

  // Company Name Cell Renderer Component
  const CompanyNameCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-2">
        <BusinessIcon style={{ color: uiTheme.primary }} />
        <Box>
          <div className="font-semibold text-sm" style={{ color: uiTheme.text }}>
            {data.name}
          </div>
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
            ID: {data.id}
          </div>
        </Box>
      </Box>
    )
  }

  // Contact Info Cell Renderer Component
  const ContactInfoCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box>
        <Box className="flex items-center gap-1 mb-1">
          <PhoneIcon fontSize="small" style={{ color: uiTheme.primary }} />
          <div className="text-sm" style={{ color: uiTheme.text }}>
            {data.phoneNumber}
          </div>
        </Box>
        {data.landPhone && (
          <Box className="flex items-center gap-1">
            <PhoneIcon fontSize="small" style={{ color: uiTheme.primary }} />
            <div className="text-sm" style={{ color: uiTheme.textSecondary }}>
              {data.landPhone}
            </div>
          </Box>
        )}
      </Box>
    )
  }

  // Location Cell Renderer Component
  const LocationCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box>
        <Box className="flex items-center gap-1 mb-1">
          <LocationIcon fontSize="small" style={{ color: uiTheme.primary }} />
          <div className="text-sm" style={{ color: uiTheme.text }}>
            {data.address}
          </div>
        </Box>
        {data.geoLocation && (
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
            {data.geoLocation}
          </div>
        )}
      </Box>
    )
  }

  // Owner Cell Renderer Component
  const OwnerCellRenderer = (props: ICellRendererParams) => {
    const { data } = props
    
    return (
      <Box className="flex items-center gap-3">
        <Avatar
          className="w-8 h-8 border-2 border-white shadow-sm"
          style={{ backgroundColor: uiTheme.primary }}
          src={getProfileImageUrl(data.userProfileImage)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            console.error('Owner Avatar image failed to load:', target.src)
            console.error('Owner profile image path:', data.userProfileImage)
          }}
        >
          <span className="text-white font-semibold text-xs">
            {data.userFirstName?.charAt(0)}{data.userLastName?.charAt(0)}
          </span>
        </Avatar>
        <Box>
          <div className="font-semibold text-sm" style={{ color: uiTheme.text }}>
            {data.userFirstName} {data.userLastName}
          </div>
          <div className="text-xs" style={{ color: uiTheme.textSecondary }}>
            {data.userEmail}
          </div>
        </Box>
      </Box>
    )
  }

  // Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Company',
      field: 'name',
      cellRenderer: CompanyNameCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200
    },
    {
      headerName: 'Contact Info',
      field: 'phoneNumber',
      cellRenderer: ContactInfoCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150
    },
    {
      headerName: 'Location',
      field: 'address',
      cellRenderer: LocationCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 250,
      minWidth: 200
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 120,
      minWidth: 100
    },
    {
      headerName: 'Owner',
      field: 'userFirstName',
      cellRenderer: OwnerCellRenderer,
      sortable: true,
      filter: true,
      resizable: true,
      width: 200,
      minWidth: 150
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
      width: 150,
      minWidth: 120
    }
  ], [uiTheme])

  if (!user || !isAdminOnlyRole(parseInt(user.role) as any)) {
    return (
      <Box className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold" style={{ color: uiTheme.text }}>
          Access Denied. Admin privileges required.
        </div>
      </Box>
    )
  }

  return (
    <Box className="h-full p-6">
      <CustomGrid
        title="Companies Management"
        data={companies || []}
        columnDefs={columnDefs}
        loading={loading}
        error={error}
        success={success}
        theme={uiTheme}
        height="calc(100vh - 120px)"
        showTitle={true}
        showAlerts={true}
      />
    </Box>
  )
}

export default Companies
