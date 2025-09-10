import React, { useState } from 'react'
import { Slider, Typography, Box, Stack } from '@mui/material'

const CustomSlider: React.FC = () => {
  const [value, setValue] = useState<number>(30)
  const [range, setRange] = useState<number[]>([20, 37])

  return (
    <Stack spacing={4} className="w-full max-w-md">
      <Box>
        <Typography variant="body2" className="text-gray-700 mb-2">
          Volume: {value}
        </Typography>
        <Slider
          value={value}
          onChange={(_, newValue) => setValue(newValue as number)}
          className="text-blue-600"
        />
      </Box>
      
      <Box>
        <Typography variant="body2" className="text-gray-700 mb-2">
          Range: {range[0]} - {range[1]}
        </Typography>
        <Slider
          value={range}
          onChange={(_, newValue) => setRange(newValue as number[])}
          className="text-green-600"
        />
      </Box>
    </Stack>
  )
}

export default CustomSlider
