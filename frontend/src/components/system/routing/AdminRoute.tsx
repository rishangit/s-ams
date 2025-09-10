import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { getProfileRequest } from '../../../store/actions'
import { isAdminRole } from '../../../constants/roles'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, profileRequestInProgress } = useSelector((state: RootState) => state.auth)
  
  // Load user profile if authenticated but user data is missing
  useEffect(() => {
    if (isAuthenticated && !user && !loading && !profileRequestInProgress) {
      dispatch(getProfileRequest())
    }
  }, [isAuthenticated, user, loading, profileRequestInProgress, dispatch])

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/system/login" replace />
  }
  
  // Show loading while fetching user profile or if user data is not yet loaded
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    )
  }

  // If not admin, redirect to dashboard
  if (user && !isAdminRole(user.role as any)) {
    return <Navigate to="/system/dashboard" replace />
  }

  // If admin, render the children
  return <>{children}</>
}

export default AdminRoute 