import React from 'react'
import { Box, Typography } from '@mui/material'
import { Dashboard as DashboardIcon } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const Dashboard: React.FC = () => {
  const uiTheme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Box className="flex flex-col h-full">
      {/* Header Section */}
      <Box className="flex items-center gap-3 mb-6 flex-shrink-0">
        <DashboardIcon style={{ color: uiTheme.primary, fontSize: 32 }} />
        <Typography
          variant="h6"
          className="text-xl md:text-3xl font-bold"
          style={{ color: uiTheme.text }}
        >
          Dashboard
        </Typography>
      </Box>
      
      {/* Content Section */}
      <Box className="flex-1 min-h-0">
        <Box className="flex justify-center items-center h-full">
          <Typography
            variant="h6"
            className="text-base md:text-xl"
            style={{ color: uiTheme.textSecondary }}
          >
            Dashboard content will be added here...
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
