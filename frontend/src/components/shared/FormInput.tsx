import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { 
  Email, 
  Lock, 
  Person, 
  Phone, 
  Visibility, 
  VisibilityOff,
  Build,
  AttachMoney,
  Description,
  Schedule,
  Event,
  AccessTime
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Controller, Control, FieldError } from 'react-hook-form'

interface FormInputProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'service' | 'price' | 'description' | 'duration' | 'date' | 'time'
  control: Control<any>
  error?: FieldError
  required?: boolean
  disabled?: boolean
  placeholder?: string
  multiline?: boolean
  rows?: number
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  control,
  error,
  required = false,
  disabled = false,
  placeholder,
  multiline = false,
  rows = 1
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
      case 'service':
        return <Build style={{ color: theme.textSecondary }} />
      case 'price':
        return <AttachMoney style={{ color: theme.textSecondary }} />
      case 'description':
        return <Description style={{ color: theme.textSecondary }} />
      case 'duration':
        return <Schedule style={{ color: theme.textSecondary }} />
      case 'date':
        return <Event style={{ color: theme.textSecondary }} />
      case 'time':
        return <AccessTime style={{ color: theme.textSecondary }} />
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
          placeholder={placeholder}
          multiline={multiline}
          rows={multiline ? rows : undefined}
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
            backgroundColor: disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f9fafb') : theme.surface,
          }}
          sx={{
            '& .MuiInputBase-input': {
              color: theme.text,
              '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 100px ${disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f9fafb') : theme.surface} inset`,
                WebkitTextFillColor: disabled ? (theme.mode === 'dark' ? '#64748b' : '#9ca3af') : theme.text,
              },
              '&:-webkit-autofill:hover': {
                WebkitBoxShadow: `0 0 0 100px ${disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f9fafb') : theme.surface} inset`,
              },
              '&:-webkit-autofill:focus': {
                WebkitBoxShadow: `0 0 0 100px ${disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f9fafb') : theme.surface} inset`,
              },
              '&:disabled': {
                color: theme.mode === 'dark' ? '#64748b' : '#9ca3af',
                WebkitTextFillColor: theme.mode === 'dark' ? '#64748b' : '#9ca3af',
                cursor: 'not-allowed',
              },
            },
            '& .MuiInputLabel-root': {
              color: theme.textSecondary,
              '&.Mui-focused': {
                color: disabled ? (theme.mode === 'dark' ? '#64748b' : '#9ca3af') : theme.primary,
              },
              '&.Mui-disabled': {
                color: theme.mode === 'dark' ? '#64748b' : '#9ca3af',
              },
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f9fafb') : theme.surface,
              '& fieldset': {
                borderColor: theme.mode === 'dark' ? '#334155' : '#e5e7eb',
              },
              '&:hover fieldset': {
                borderColor: disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f1f5f9') : (theme.mode === 'dark' ? '#475569' : '#cbd5e1'),
              },
              '&.Mui-focused fieldset': {
                borderColor: disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f1f5f9') : theme.primary,
              },
              '&.Mui-disabled fieldset': {
                borderColor: theme.mode === 'dark' ? '#1e293b' : '#f1f5f9',
              },
              '&.Mui-disabled': {
                backgroundColor: theme.mode === 'dark' ? '#1e293b' : '#f9fafb',
                cursor: 'not-allowed',
              },
            },
            '& .MuiFormHelperText-root': {
              color: error ? '#ef4444' : theme.textSecondary,
              '&.Mui-disabled': {
                color: theme.mode === 'dark' ? '#64748b' : '#9ca3af',
              },
            },
            '& .MuiInputAdornment-root': {
              '& .MuiSvgIcon-root': {
                color: disabled ? (theme.mode === 'dark' ? '#64748b' : '#9ca3af') : theme.textSecondary,
              },
            },
            '& .MuiIconButton-root': {
              '&:disabled': {
                color: theme.mode === 'dark' ? '#64748b' : '#9ca3af',
              },
            },
          }}
        />
      )}
    />
  )
}

export default FormInput
