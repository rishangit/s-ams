import React, { useState, useMemo } from 'react'
import {
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material'
import { RowActionsMenu } from '../../../components/shared'
import { 
  CompanyUserInfo, 
  CompanyUserEmail, 
  CompanyUserPhone, 
  CompanyUserTotalAppointments,
  CompanyUserDate,
  CompanyUserMemberSince
} from './utils/companyUserComponents'
import { 
  generateCompanyUserRowActions
} from './utils/companyUserUtils'

interface CompanyUsersListviewProps {
  filteredUsers: any[]
  loading: boolean
  error: string | null
  success: string | null
  uiTheme: any
  onViewAppointments: (userId: number) => void
}

const CompanyUsersListview: React.FC<CompanyUsersListviewProps> = ({
  filteredUsers,
  loading,
  error,
  success,
  uiTheme,
  onViewAppointments
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // Generate row actions
  const rowActions = useMemo(() => {
    return generateCompanyUserRowActions(onViewAppointments)
  }, [onViewAppointments])

  // Get table headers (customized to combine columns)
  const tableHeaders = useMemo(() => {
    return ['Name', 'Contacts', 'Total Appointments', 'Appointments', 'Member Since', 'Actions']
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
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredUsers?.slice(startIndex, endIndex) || []
  }, [filteredUsers, page, rowsPerPage])

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-48">
        <CircularProgress />
      </Box>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full min-h-0">
      {/* Modern Table Container */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
              </th>
              {tableHeaders.map((header, index) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    {index === 1 && <ArrowUpwardIcon className="w-4 h-4 text-gray-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white">
            {paginatedUsers.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200"
              >
                {/* Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>

                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <CompanyUserInfo user={user} />
                </td>

                {/* Contacts (Email + Phone combined) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <CompanyUserEmail email={user.email} />
                    <CompanyUserPhone phone={user.phoneNumber} />
                  </div>
                </td>

                {/* Total Appointments */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <CompanyUserTotalAppointments count={user.totalAppointments} />
                </td>

                {/* Appointments (First + Last combined) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <CompanyUserDate date={user.firstAppointmentDate} label="First" />
                    <CompanyUserDate date={user.lastAppointmentDate} label="Last" />
                  </div>
                </td>

                {/* Member Since */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <CompanyUserMemberSince date={user.createdAt} />
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end">
                    <RowActionsMenu
                      rowData={user}
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
      <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-end">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select 
              value={rowsPerPage}
              onChange={(e) => handleChangeRowsPerPage(e)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredUsers?.length || 0)} of {filteredUsers?.length || 0}
            </span>
            
            <div className="flex space-x-1">
              <button
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownwardIcon className="w-4 h-4 text-gray-400 rotate-90" />
              </button>
              <button
                onClick={() => handleChangePage(null, page + 1)}
                disabled={page >= Math.ceil((filteredUsers?.length || 0) / rowsPerPage) - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpwardIcon className="w-4 h-4 text-gray-400 rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyUsersListview
