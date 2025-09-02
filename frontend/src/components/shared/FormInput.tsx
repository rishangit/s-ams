import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Email, Lock, Person, Phone, Visibility, VisibilityOff } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Controller, Control, FieldError } from 'react-hook-form'

interface FormInputProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'tel'
  control: Control<any>
  error?: FieldError
  required?: boolean
  disabled?: boolean
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  control,
  error,
  required = false,
  disabled = false
}) => {
  const theme = useSelector((state: RootState) => state.ui.theme)
  const [showPassword, setShowPassword] = useState(false)

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Email style={{ color: theme.textSecondary }} />
      case 'password':
        return <Lock style={{ color: theme.textSecondary }} />
      case 'tel':
        return <Phone style={{ color: theme.textSecondary }} />
      default:
        return <Person style={{ color: theme.textSecondary }} />
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password'
    }
    return type
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          type={getInputType()}
          variant="outlined"
          required={required}
          disabled={disabled}
          error={!!error}
          helperText={error?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {getIcon()}
              </InputAdornment>
            ),
            endAdornment: type === 'password' ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  style={{ color: theme.textSecondary }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          className="w-full rounded-md transition-all duration-200"
          style={{
            backgroundColor: theme.surface,
          }}
          sx={{
            '& .MuiInputBase-input': {
              '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 100px ${theme.surface} inset`,
                WebkitTextFillColor: theme.text,
              },
              '&:-webkit-autofill:hover': {
                WebkitBoxShadow: `0 0 0 100px ${theme.surface} inset`,
              },
              '&:-webkit-autofill:focus': {
                WebkitBoxShadow: `0 0 0 100px ${theme.surface} inset`,
              },
            },
          }}
        />
      )}
    />
  )
}

export default FormInput
