import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const CustomModal: React.FC = () => {
  const [open, setOpen] = useState(false)
  const theme = useSelector((state: RootState) => state.ui.theme)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={handleOpen}
        className="transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.primary,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: 'none'
        }}
      >
        Open Modal
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        className="backdrop-blur-sm"
        PaperProps={{
          style: {
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <DialogTitle 
          className="border-b"
          style={{ 
            backgroundColor: theme.surface,
            borderBottomColor: theme.divider,
            color: theme.text
          }}
        >
          <Typography variant="h6" className="font-semibold">
            Sample Modal
          </Typography>
        </DialogTitle>
        
        <DialogContent 
          className="p-6"
          style={{ backgroundColor: theme.surface }}
        >
          <Typography 
            variant="body1" 
            style={{ color: theme.textSecondary }}
          >
            This is a sample modal dialog. You can put any content here.
          </Typography>
        </DialogContent>
        
        <DialogActions 
          className="p-4 border-t"
          style={{ 
            backgroundColor: theme.surface,
            borderTopColor: theme.divider
          }}
        >
          <Button 
            onClick={handleClose}
            className="transition-colors duration-200"
            style={{
              color: theme.textSecondary,
              backgroundColor: 'transparent'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClose} 
            variant="contained"
            className="transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: theme.primary,
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CustomModal
