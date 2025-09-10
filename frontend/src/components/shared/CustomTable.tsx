import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const CustomTable: React.FC = () => {
  const rows = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ]

  return (
    <TableContainer component={Paper} className="max-w-md shadow-md">
      <Table>
        <TableHead className="bg-gray-50">
          <TableRow>
            <TableCell className="font-semibold text-gray-700">Name</TableCell>
            <TableCell className="font-semibold text-gray-700">Email</TableCell>
            <TableCell className="font-semibold text-gray-700">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50">
              <TableCell className="text-gray-800">{row.name}</TableCell>
              <TableCell className="text-gray-600">{row.email}</TableCell>
              <TableCell className="text-gray-600">{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CustomTable
