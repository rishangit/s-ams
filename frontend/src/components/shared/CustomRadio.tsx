import React, { useState } from 'react'
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material'

const CustomRadio: React.FC = () => {
  const [value, setValue] = useState('female')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  return (
    <FormControl className="w-full max-w-md">
      <FormLabel className="text-gray-700 font-medium mb-2">Gender</FormLabel>
      <RadioGroup
        value={value}
        onChange={handleChange}
        className="bg-white p-4 rounded-md border border-gray-200"
      >
        <FormControlLabel value="female" control={<Radio className="text-blue-600" />} label="Female" />
        <FormControlLabel value="male" control={<Radio className="text-blue-600" />} label="Male" />
        <FormControlLabel value="other" control={<Radio className="text-blue-600" />} label="Other" />
      </RadioGroup>
    </FormControl>
  )
}

export default CustomRadio
