import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import Company from './Company'
import CompanyDetail from './CompanyDetail'
import { isAdminOnlyRole } from '../../../constants/roles'

const CompanyRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // If no ID is provided, redirect based on user role
    if (!id) {
      if (user && isAdminOnlyRole(parseInt(user.role) as any)) {
        // Admin users should see companies list
        navigate('/system/companies', { replace: true })
      } else {
        // Regular users and owners should see company registration form
        navigate('/system/companies/new', { replace: true })
      }
      return
    }

    // If ID is 'new', show company registration form
    if (id === 'new') {
      return
    }

    // If ID is a number, show company details (for both admin and regular users)
    const numericId = parseInt(id)
    if (isNaN(numericId)) {
      // Invalid ID, redirect to companies list for admin, or new for regular users and owners
      if (user && isAdminOnlyRole(parseInt(user.role) as any)) {
        navigate('/system/companies', { replace: true })
      } else {
        navigate('/system/companies/new', { replace: true })
      }
      return
    }
  }, [id, navigate, user])

  // Show company registration form for 'new'
  if (id === 'new') {
    return <Company />
  }

  // Show company details for valid numeric ID
  if (id) {
    const numericId = parseInt(id)
    if (!isNaN(numericId)) {
      return <CompanyDetail />
    }
  }

  // Fallback - should not reach here due to useEffect redirects
  return null
}

export default CompanyRouter
