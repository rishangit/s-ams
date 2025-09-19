import React, { useState, useMemo } from 'react'
import {
  CircularProgress,
  Alert
} from '@mui/material'
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  ServiceName, 
  ServiceDescription, 
  ServiceDuration, 
  ServicePrice, 
  ServiceStatusChip
} from './utils/serviceComponents'
import { 
  generateServiceRowActions, 
  getServiceTableHeaders
} from './utils/serviceUtils'

interface ServicesListviewProps {
  filteredServices: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onEditService: (serviceId: number) => void
  onDeleteService: (serviceId: number) => void
}

const ServicesListview: React.FC<ServicesListviewProps> = ({
  filteredServices,
  loading,
  error,
  success,
  uiTheme,
  onEditService,
  onDeleteService
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateServiceRowActions(onEditService, onDeleteService)
  }, [onEditService, onDeleteService])

  // Get table headers
  const tableHeaders = useMemo(() => {
    return getServiceTableHeaders()
  }, [])

  // Pagination handlers
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get paginated data
  const paginatedServices = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredServices?.slice(startIndex, endIndex) || []
  }, [filteredServices, page, rowsPerPage])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert severity="success" className="mb-4">
        {success}
      </Alert>
    )
  }

  return (
    <div 
      className="rounded-lg shadow-sm overflow-visible flex flex-col h-auto min-h-0"
      style={{ 
        backgroundColor: uiTheme.surface,
        border: `1px solid ${uiTheme.border}`
      }}
    >
      {/* Modern Table Container */}
      <div className="overflow-x-auto overflow-visible flex-1 min-h-0">
        <table className="w-full">
          {/* Table Header */}
          <thead style={{ backgroundColor: uiTheme.background, borderBottom: `1px solid ${uiTheme.border}` }}>
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded focus:ring-2"
                    style={{ 
                      accentColor: uiTheme.primary,
                      backgroundColor: uiTheme.surface,
                      borderColor: uiTheme.border
                    }}
                  />
                </div>
              </th>
              {tableHeaders.map((header, index) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: uiTheme.textSecondary }}>
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    {index === 1 && <ArrowUpwardIcon className="w-4 h-4" style={{ color: uiTheme.textSecondary }} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody style={{ backgroundColor: uiTheme.surface }}>
            {paginatedServices.map((service) => (
              <tr 
                key={service.id} 
                className="transition-colors duration-150 hover:opacity-80"
                style={{ 
                  borderBottom: `1px solid ${uiTheme.border}`
                }}
              >
                {/* Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded focus:ring-2"
                    style={{ 
                      accentColor: uiTheme.primary,
                      backgroundColor: uiTheme.surface,
                      borderColor: uiTheme.border
                    }}
                  />
                </td>

                {/* Service Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <ServiceName name={service.name} variant="body2" />
                </td>

                {/* Description */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <ServiceDescription description={service.description} />
                </td>

                {/* Duration */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <ServiceDuration duration={service.duration} />
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <ServicePrice price={service.price} />
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <ServiceStatusChip status={service.status} />
                </td>

                {/* Created */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span style={{ color: uiTheme.text }}>
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end">
                    <RowActionsMenu
                      rowData={service}
                      actions={rowActions}
                      theme={uiTheme}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modern Pagination */}
      <div 
        className="px-6 py-4 flex items-center justify-end flex-shrink-0"
        style={{ 
          backgroundColor: uiTheme.surface,
          borderTop: `1px solid ${uiTheme.border}`
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm" style={{ color: uiTheme.text }}>Rows per page:</span>
            <select 
              value={rowsPerPage}
              onChange={(e) => handleChangeRowsPerPage(e)}
              className="rounded px-2 py-1 text-sm focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: uiTheme.surface,
                border: `1px solid ${uiTheme.border}`,
                color: uiTheme.text
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm" style={{ color: uiTheme.text }}>
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredServices?.length || 0)} of {filteredServices?.length || 0}
            </span>
            
            <div className="flex space-x-1">
              <button
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:opacity-80"
                style={{ 
                  color: uiTheme.text
                }}
              >
                <ArrowDownwardIcon className="w-4 h-4 rotate-90" style={{ color: uiTheme.textSecondary }} />
              </button>
              <button
                onClick={() => handleChangePage(null, page + 1)}
                disabled={page >= Math.ceil((filteredServices?.length || 0) / rowsPerPage) - 1}
                className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:opacity-80"
                style={{ 
                  color: uiTheme.text
                }}
              >
                <ArrowUpwardIcon className="w-4 h-4 rotate-90" style={{ color: uiTheme.textSecondary }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesListview
