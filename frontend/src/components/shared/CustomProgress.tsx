import React from 'react'
import { LinearProgress, CircularProgress, Box, Typography, Stack } from '@mui/material'

const CustomProgress: React.FC = () => {
  return (
    <Stack spacing={4} className="w-full max-w-md">
      <Box>
        <Typography variant="body2" className="text-gray-700 mb-2">
          Linear Progress
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={75} 
          className="h-2 rounded-full bg-gray-200"
        />
        <Typography variant="caption" className="text-gray-500 mt-1">
          75% Complete
        </Typography>
      </Box>
      
      <Box className="flex justify-center">
        <Box className="relative inline-flex">
          <CircularProgress 
            variant="determinate" 
            value={80} 
            size={60}
            className="text-blue-600"
          />
          <Box className="absolute inset-0 flex items-center justify-center">
            <Typography variant="caption" className="text-gray-700 font-medium">
              80%
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Box>
        <Typography variant="body2" className="text-gray-700 mb-2">
          Indeterminate Progress
        </Typography>
        <LinearProgress className="h-2 rounded-full bg-gray-200" />
      </Box>
    </Stack>
  )
}

export default CustomProgress
