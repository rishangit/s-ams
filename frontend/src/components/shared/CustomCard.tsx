import React from 'react'
import { Card, CardContent, CardActions, Typography, Button, Avatar } from '@mui/material'
import { Person, Email, Phone } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const CustomCard: React.FC = () => {
  const theme = useSelector((state: RootState) => state.ui.theme)

  return (
    <Card 
      className="max-w-sm shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`
      }}
    >
      <div 
        className="p-4"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
        }}
      >
        <div className="flex items-center space-x-3">
          <Avatar 
            style={{ 
              backgroundColor: theme.surface, 
              color: theme.primary 
            }}
          >
            <Person />
          </Avatar>
          <div>
            <Typography 
              variant="h6" 
              className="font-semibold"
              style={{ color: '#fff' }}
            >
              John Doe
            </Typography>
            <Typography 
              variant="body2" 
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Software Developer
            </Typography>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Email 
              className="text-sm" 
              style={{ color: theme.textSecondary }}
            />
            <Typography 
              variant="body2" 
              style={{ color: theme.textSecondary }}
            >
              john.doe@example.com
            </Typography>
          </div>
          <div className="flex items-center space-x-2">
            <Phone 
              className="text-sm" 
              style={{ color: theme.textSecondary }}
            />
            <Typography 
              variant="body2" 
              style={{ color: theme.textSecondary }}
            >
              +1 (555) 123-4567
            </Typography>
          </div>
        </div>
      </CardContent>
      
      <CardActions className="p-4 pt-0">
        <Button 
          size="small" 
          color="primary"
          className="transition-colors duration-200"
          style={{ 
            color: theme.primary,
            backgroundColor: 'transparent'
          }}
        >
          View Profile
        </Button>
        <Button 
          size="small" 
          color="secondary"
          className="transition-colors duration-200"
          style={{ 
            color: theme.secondary,
            backgroundColor: 'transparent'
          }}
        >
          Contact
        </Button>
      </CardActions>
    </Card>
  )
}

export default CustomCard
