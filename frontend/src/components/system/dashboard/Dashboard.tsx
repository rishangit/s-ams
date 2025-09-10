import React from 'react'
import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const Dashboard: React.FC = () => {
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Box className="mx-auto p-0 md:p-6">
      <Typography
        variant="h6"
        className="mb-6 font-bold text-lg md:text-3xl"
        style={{ color: uiTheme.text }}
      >
        Dashboard
      </Typography>
      
      <Box className="flex justify-center items-center h-64">
        <Typography
          variant="h6"
          className="text-base md:text-xl"
          style={{ color: uiTheme.textSecondary }}
        >
          Dashboard content will be added here...
        </Typography>
      </Box>
    </Box>
  )
}

export default Dashboard
