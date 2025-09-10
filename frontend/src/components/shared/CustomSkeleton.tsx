import React from 'react'
import { Skeleton, Stack } from '@mui/material'

const CustomSkeleton: React.FC = () => {
  return (
    <Stack spacing={2} className="w-full max-w-md">
      <Skeleton variant="text" width="60%" height={32} className="bg-gray-200" />
      <Skeleton variant="circular" width={40} height={40} className="bg-gray-200" />
      <Skeleton variant="rectangular" width="100%" height={118} className="bg-gray-200 rounded-md" />
      <Skeleton variant="text" width="80%" className="bg-gray-200" />
      <Skeleton variant="text" width="40%" className="bg-gray-200" />
    </Stack>
  )
}

export default CustomSkeleton
