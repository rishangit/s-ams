import React from 'react'
import { Pagination, Stack } from '@mui/material'

const CustomPagination: React.FC = () => {
  return (
    <Stack spacing={2} className="items-center">
      <Pagination 
        count={10} 
        color="primary"
        className="bg-white p-2 rounded-md shadow-sm"
      />
    </Stack>
  )
}

export default CustomPagination
