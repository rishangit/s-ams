import React from 'react'
import { Button, Stack } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../../store/reducers/uiSlice'
import { RootState } from '../../../store'

const CustomButton: React.FC = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.ui.theme)

  const handleClick = () => {
    dispatch(setLoading(true))
  }

  return (
    <Stack direction="row" spacing={2} className="flex-wrap">
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleClick}
        className="px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.primary,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: 'none'
        }}
      >
        Primary
      </Button>
      <Button 
        variant="outlined" 
        color="secondary"
        className="px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
        style={{
          borderColor: theme.secondary,
          color: theme.secondary,
          backgroundColor: 'transparent',
          borderWidth: '2px'
        }}
      >
        Secondary
      </Button>
      <Button 
        variant="text" 
        color="success"
        className="px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
        style={{
          color: theme.text,
          backgroundColor: 'transparent',
          border: `1px solid ${theme.border}`
        }}
      >
        Success
      </Button>
    </Stack>
  )
}

export default CustomButton
