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
          // Let MUI handle the outlined styling completely
        }
      case 'text':
        return {
          color: theme.text,
          backgroundColor: 'transparent',
          border: `1px solid ${theme.border}`
        }
      default:
        return {
          backgroundColor: theme.primary,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: 'none'
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
      style={getButtonStyle()}
    >
      {children}
    </Button>
  )
}

export default FormButton
