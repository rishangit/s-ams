import React, { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material'

const CustomSelect: React.FC = () => {
  const [age, setAge] = useState('')
  const [category, setCategory] = useState('')

  return (
    <Stack spacing={3} className="w-full max-w-md">
      <FormControl fullWidth>
        <InputLabel>Age</InputLabel>
        <Select
          value={age}
          label="Age"
          onChange={(e) => setAge(e.target.value)}
          className="bg-white"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white"
        >
          <MenuItem value="electronics">Electronics</MenuItem>
          <MenuItem value="clothing">Clothing</MenuItem>
          <MenuItem value="books">Books</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}

export default CustomSelect
