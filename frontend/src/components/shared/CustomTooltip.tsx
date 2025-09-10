import React from 'react'
import { Tooltip, Button, Stack } from '@mui/material'
import { Info, Help, Warning } from '@mui/icons-material'

const CustomTooltip: React.FC = () => {
  return (
    <Stack direction="row" spacing={2} className="items-center">
      <Tooltip title="This is a helpful tooltip" arrow>
        <Button variant="outlined" startIcon={<Info />}>
          Info
        </Button>
      </Tooltip>
      
      <Tooltip title="Need help? Click here for more information" arrow>
        <Button variant="text" startIcon={<Help />}>
          Help
        </Button>
      </Tooltip>
      
      <Tooltip title="Warning: This action cannot be undone" arrow>
        <Button variant="contained" color="warning" startIcon={<Warning />}>
          Warning
        </Button>
      </Tooltip>
    </Stack>
  )
}

export default CustomTooltip
