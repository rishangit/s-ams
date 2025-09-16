import React from 'react'
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Box,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Controller, Control, FieldError } from 'react-hook-form'

interface SelectOption {
  value: string | number
  label: string
}

interface FormMultiSelectProps {
  name: string
  label: string
  control: Control<any>
  options: SelectOption[]
  error?: FieldError
  required?: boolean
  disabled?: boolean
  maxSelections?: number
  placeholder?: string
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  name,
  label,
  control,
  options,
  error,
  required = false,
  disabled = false,
  maxSelections = 3,
  placeholder = "Select options..."
}) => {
  const theme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        // Ensure field value is always an array
        const fieldValue = Array.isArray(field.value) ? field.value : []
        
        return (
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
            value={fieldValue}
            multiple
            label={label}
            required={required}
            disabled={disabled}
            input={<OutlinedInput label={label} />}
            renderValue={(selected) => {
              const selectedArray = Array.isArray(selected) ? selected : []
              
              if (selectedArray.length === 0) {
                return (
                  <Box sx={{ color: theme.textSecondary }}>
                    {placeholder}
                  </Box>
                )
              }
              
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedArray.map((value) => {
                    const option = options.find(opt => opt.value === value)
                    return (
                      <Chip
                        key={value}
                        label={option?.label || value}
                        size="small"
                        sx={{
                          backgroundColor: theme.primary,
                          color: '#ffffff',
                          '& .MuiChip-deleteIcon': {
                            color: '#ffffff',
                          },
                        }}
                      />
                    )
                  })}
                </Box>
              )
            }}
            onChange={(event: SelectChangeEvent<(string | number)[]>) => {
              const value = event.target.value
              const selectedValues = typeof value === 'string' ? value.split(',') : value
              
              // Ensure we always have an array
              const safeValues = Array.isArray(selectedValues) ? selectedValues : []
              
              // Limit selections
              if (safeValues.length <= maxSelections) {
                field.onChange(safeValues)
              }
            }}
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
                disabled={
                  !fieldValue.includes(option.value) && 
                  fieldValue.length >= maxSelections
                }
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
                  '&.Mui-disabled': {
                    color: theme.mode === 'dark' ? '#64748b' : '#9ca3af',
                    backgroundColor: theme.mode === 'dark' ? '#1e293b' : '#f9fafb',
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <Box sx={{ mt: 1, color: 'error.main', fontSize: '0.75rem' }}>
              {error.message}
            </Box>
          )}
          {fieldValue && fieldValue.length > 0 && (
            <Box sx={{ mt: 1, fontSize: '0.75rem', color: theme.textSecondary }}>
              {fieldValue.length} of {maxSelections} selected
            </Box>
          )}
        </FormControl>
        )
      }}
    />
  )
}

export default FormMultiSelect
