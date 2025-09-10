import React from 'react'
import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

interface CustomAlertProps {
  severity: 'success' | 'info' | 'warning' | 'error'
  message: string
  onClose?: () => void
  show?: boolean
}

const CustomAlert: React.FC<CustomAlertProps> = ({ 
  severity, 
  message, 
  onClose, 
  show = true 
}) => {
  const theme = useSelector((state: RootState) => state.ui.theme)

  const getAlertStyle = (severity: 'success' | 'info' | 'warning' | 'error') => {
    const colors = {
      success: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
      info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
      warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
      error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
    }
    
    const darkColors = {
      success: { bg: '#064e3b', border: '#10b981', text: '#6ee7b7' },
      info: { bg: '#1e3a8a', border: '#3b82f6', text: '#93c5fd' },
      warning: { bg: '#78350f', border: '#f59e0b', text: '#fcd34d' },
      error: { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5' }
    }
    
    const colorScheme = theme.mode === 'dark' ? darkColors : colors
    return colorScheme[severity] || colorScheme.error // Fallback to error style if severity is invalid
  }

  if (!show) return null

  // Validate severity and provide fallback
  const validSeverities = ['success', 'info', 'warning', 'error'] as const
  const validSeverity = validSeverities.includes(severity as any) ? severity : 'error'
  
  const alertStyle = getAlertStyle(validSeverity)

  return (
    <Alert 
      severity={validSeverity} 
      onClose={onClose}
      className="border rounded-lg transition-all duration-200 w-full"
      style={{
        backgroundColor: alertStyle.bg,
        borderColor: alertStyle.border,
        color: alertStyle.text
      }}
    >
      {message}
    </Alert>
  )
}

export default CustomAlert
