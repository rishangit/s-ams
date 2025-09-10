import React, { useState } from 'react'
import { Switch, FormControlLabel, Stack } from '@mui/material'

const CustomSwitch: React.FC = () => {
  const [checked, setChecked] = useState(false)
  const [checked2, setChecked2] = useState(true)

  return (
    <Stack spacing={3} className="w-full max-w-md">
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="text-blue-600"
          />
        }
        label="Dark mode"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
            className="text-green-600"
          />
        }
        label="Notifications"
      />
      
      <FormControlLabel
        control={
          <Switch
            disabled
            className="text-gray-400"
          />
        }
        label="Disabled switch"
      />
    </Stack>
  )
}

export default CustomSwitch
