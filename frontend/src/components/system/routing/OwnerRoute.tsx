import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../../store'
import { ROLES } from '../../../constants/roles'

interface OwnerRouteProps {
  children: React.ReactNode
}

const OwnerRoute: React.FC<OwnerRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth)

  // Check if user is authenticated and has owner role (role 1)
  if (!user || parseInt(user.role) !== ROLES.OWNER) {
    return <Navigate to="/system/dashboard" replace />
  }

  return <>{children}</>
}

export default OwnerRoute
