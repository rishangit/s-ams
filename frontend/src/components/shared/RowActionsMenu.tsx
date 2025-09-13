import React, { useState } from 'react'
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip
} from '@mui/material'
import { MoreVert } from '@mui/icons-material'

export interface RowAction {
  id: string
  label: string | ((rowData: any) => string)
  icon: React.ReactNode
  onClick: (rowData: any) => void
  disabled?: boolean | ((rowData: any) => boolean)
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | string | ((rowData: any) => 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | string)
}

interface RowActionsMenuProps {
  rowData: any
  actions: RowAction[]
  theme: {
    mode: 'light' | 'dark'
    primary: string
    surface: string
    text: string
    textSecondary: string
  }
  onMenuClick?: (rowData: any) => void
}

const RowActionsMenu: React.FC<RowActionsMenuProps> = ({ 
  rowData, 
  actions, 
  theme,
  onMenuClick
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    // Trigger row highlighting when menu button is clicked
    if (onMenuClick) {
      onMenuClick(rowData)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleActionClick = (action: RowAction) => {
    // Trigger row highlighting when menu item is clicked
    if (onMenuClick) {
      onMenuClick(rowData)
    }
    action.onClick(rowData)
    handleClose()
  }

  const getActionColor = (color?: string | ((rowData: any) => string)) => {
    const resolvedColor = typeof color === 'function' ? color(rowData) : color
    
    // Check if it's an appointment status color (hex color)
    if (typeof resolvedColor === 'string' && resolvedColor.startsWith('#')) {
      return resolvedColor
    }
    
    switch (resolvedColor) {
      case 'error':
        return '#ef4444'
      case 'warning':
        return '#f59e0b'
      case 'success':
        return '#10b981'
      case 'info':
        return '#3b82f6'
      case 'secondary':
        return '#6b7280'
      default:
        return theme.primary
    }
  }

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={handleClick}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ 
            color: theme.textSecondary,
            padding: '4px',
            border: 'none',
            outline: 'none',
            boxShadow: 'none'
          }}
          sx={{
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
              border: 'none'
            },
            '&:active': {
              outline: 'none',
              boxShadow: 'none',
              border: 'none'
            },
            '&:hover': {
              outline: 'none',
              boxShadow: 'none',
              border: 'none'
            }
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            backgroundColor: theme.surface,
            border: `1px solid ${theme.mode === 'dark' ? '#334155' : '#e5e7eb'}`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            minWidth: '160px'
          }
        }}
      >
        {actions.map((action) => {
          const isDisabled = typeof action.disabled === 'function' 
            ? action.disabled(rowData) 
            : action.disabled || false

          const actionLabel = typeof action.label === 'function' 
            ? action.label(rowData) 
            : action.label

          return (
            <MenuItem
              key={action.id}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
              style={{
                color: isDisabled ? theme.textSecondary : theme.text,
                opacity: isDisabled ? 0.5 : 1
              }}
            >
              <ListItemIcon
                style={{
                  color: isDisabled ? theme.textSecondary : getActionColor(action.color),
                  minWidth: '32px'
                }}
              >
                {action.icon}
              </ListItemIcon>
              <ListItemText 
                primary={actionLabel}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 500
                }}
              />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default RowActionsMenu
