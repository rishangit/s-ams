import React from 'react'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { NavigateNext, Home } from '@mui/icons-material'

const CustomBreadcrumbs: React.FC = () => {
  return (
    <Breadcrumbs 
      separator={<NavigateNext fontSize="small" className="text-gray-400" />}
      className="bg-white p-2 rounded-md shadow-sm"
    >
      <Link 
        color="inherit" 
        href="#" 
        className="text-blue-600 hover:text-blue-800 flex items-center"
      >
        <Home fontSize="small" className="mr-1" />
        Home
      </Link>
      <Link 
        color="inherit" 
        href="#" 
        className="text-gray-600 hover:text-gray-800"
      >
        Dashboard
      </Link>
      <Typography color="text.primary" className="text-gray-800">
        Components
      </Typography>
    </Breadcrumbs>
  )
}

export default CustomBreadcrumbs
