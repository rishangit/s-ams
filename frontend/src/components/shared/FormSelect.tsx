import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Controller, Control, FieldError } from 'react-hook-form'

interface SelectOption {
  value: string | number
  label: string
}

interface FormSelectProps {
  name: string
  label: string
  control: Control<any>
  options: SelectOption[]
  error?: FieldError
  required?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  control,
  options,
  error,
  required = false,
  disabled = false,
  icon
}) => {
  const theme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel 
            style={{ 
              color: disabled ? (theme.mode === 'dark' ? '#64748b' : '#9ca3af') : theme.textSecondary 
            }}
          >
            {label}
          </InputLabel>
          <Select
            {...field}
            label={label}
            required={required}
            disabled={disabled}
            startAdornment={icon ? (
              <InputAdornment position="start">
                {icon}
              </InputAdornment>
            ) : undefined}
            sx={{
              backgroundColor: disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f9fafb') : theme.surface,
              color: disabled ? (theme.mode === 'dark' ? '#64748b' : '#9ca3af') : theme.text,
              '& .MuiSelect-icon': {
                color: disabled ? (theme.mode === 'dark' ? '#64748b' : '#9ca3af') : theme.textSecondary
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.mode === 'dark' ? '#334155' : '#e5e7eb',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f1f5f9') : (theme.mode === 'dark' ? '#475569' : '#cbd5e1'),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: disabled ? (theme.mode === 'dark' ? '#1e293b' : '#f1f5f9') : theme.primary,
              },
              '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.mode === 'dark' ? '#1e293b' : '#f1f5f9',
              },
              '& .MuiSelect-select': {
                color: disabled ? (theme.mode === 'dark' ? '#64748b' : '#9ca3af') : theme.text,
                cursor: disabled ? 'not-allowed' : 'pointer',
              },
              '&.Mui-disabled': {
                backgroundColor: theme.mode === 'dark' ? '#1e293b' : '#f9fafb',
                cursor: 'not-allowed',
              },
            }}
          >
            {options.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{
                  color: theme.text,
                  backgroundColor: theme.surface,
                  '&:hover': {
                    backgroundColor: theme.mode === 'dark' ? '#374151' : '#f3f4f6',
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.primary,
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: theme.primary,
                    },
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  )
}

export default FormSelect
