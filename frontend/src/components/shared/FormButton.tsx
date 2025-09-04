import React from 'react'
import { Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

interface FormButtonProps {
  type?: 'submit' | 'button'
  variant?: 'contained' | 'outlined' | 'text'
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  fullWidth?: boolean
}

const FormButton: React.FC<FormButtonProps> = ({
  type = 'button',
  variant = 'contained',
  children,
  disabled = false,
  onClick,
  fullWidth = false
}) => {
  const theme = useSelector((state: RootState) => state.ui.theme)

  const getButtonStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          color: theme.primary,
          backgroundColor: 'transparent',
          border: `1px solid ${theme.primary}`,
          '&:hover': {
            backgroundColor: `${theme.primary}10`,
            borderColor: theme.primary,
          },
        }
      case 'text':
        return {
          color: theme.text,
          backgroundColor: 'transparent',
          border: `1px solid ${theme.border}`,
          '&:hover': {
            backgroundColor: theme.mode === 'dark' ? '#334155' : '#f8fafc',
          },
        }
      default:
        return {
          backgroundColor: theme.primary,
          color: '#fff',
          boxShadow: theme.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
          border: 'none',
          '&:hover': {
            backgroundColor: theme.mode === 'dark' ? '#1e40af' : '#1565c0',
            boxShadow: theme.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.2)',
          },
        }
    }
  }

  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      className="px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
      sx={getButtonStyle()}
    >
      {children}
    </Button>
  )
}

export default FormButton
