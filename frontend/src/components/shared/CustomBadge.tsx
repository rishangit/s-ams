import React from 'react'
import { Badge, Stack, Avatar } from '@mui/material'
import { Notifications, Mail, ShoppingCart } from '@mui/icons-material'

const CustomBadge: React.FC = () => {
  return (
    <Stack direction="row" spacing={3} className="items-center">
      <Badge badgeContent={4} color="primary">
        <Notifications className="text-gray-600" />
      </Badge>
      
      <Badge badgeContent={99} color="secondary">
        <Mail className="text-gray-600" />
      </Badge>
      
      <Badge badgeContent={12} color="error">
        <ShoppingCart className="text-gray-600" />
      </Badge>
      
      <Badge badgeContent="New" color="success">
        <Avatar className="bg-blue-500">U</Avatar>
      </Badge>
    </Stack>
  )
}

export default CustomBadge
