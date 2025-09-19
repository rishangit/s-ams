import React, { useState } from 'react'
import { TextField, Stack, InputAdornment } from '@mui/material'
import { Email, Lock, Person, Search } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const CustomInput: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const theme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Stack spacing={3} className="w-full max-w-md">
      <TextField
        label="Full Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person style={{ color: theme.textSecondary }} />
            </InputAdornment>
          ),
        }}
        className="rounded-md transition-all duration-200"
        style={{
          backgroundColor: theme.surface,
        }}
      />
      
      <TextField
        label="Email Address"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email style={{ color: theme.textSecondary }} />
            </InputAdornment>
          ),
        }}
        className="rounded-md transition-all duration-200"
        style={{
          backgroundColor: theme.surface,
        }}
      />
      
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock style={{ color: theme.textSecondary }} />
            </InputAdornment>
          ),
        }}
        className="rounded-md transition-all duration-200"
        style={{
          backgroundColor: theme.surface,
        }}
      />
      
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search style={{ color: theme.textSecondary }} />
            </InputAdornment>
          ),
        }}
        className="rounded-md transition-all duration-200"
        style={{
          backgroundColor: theme.surface,
        }}
      />
    </Stack>
  )
}

export default CustomInput
