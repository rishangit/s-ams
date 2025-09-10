import React, { useState } from 'react'
import { FormControlLabel, Checkbox, Stack } from '@mui/material'

const CustomCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false)
  const [checked2, setChecked2] = useState(true)

  return (
    <Stack spacing={2} className="w-full max-w-md">
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="text-blue-600"
          />
        }
        label="Accept terms and conditions"
      />
      
      <FormControlLabel
        control={
          <Checkbox
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
            className="text-green-600"
          />
        }
        label="Subscribe to newsletter"
      />
      
      <FormControlLabel
        control={
          <Checkbox
            disabled
            className="text-gray-400"
          />
        }
        label="Disabled checkbox"
      />
    </Stack>
  )
}

export default CustomCheckbox
