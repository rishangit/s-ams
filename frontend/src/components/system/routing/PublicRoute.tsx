import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  
  if (isAuthenticated) {
    return <Navigate to="/system/dashboard" replace />
  }
  
  return <>{children}</>
}

export default PublicRoute
