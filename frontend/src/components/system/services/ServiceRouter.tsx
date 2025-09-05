import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import Services from './Services'
import ServiceForm from './ServiceForm'

const ServiceRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check if user has access to services (role 1 - owner)
    if (!user || parseInt(user.role) !== 1) {
      navigate('/system/dashboard', { replace: true })
      return
    }

    // If ID is provided and it's not 'new' or a valid number, redirect to services list
    if (id && id !== 'new') {
      const numericId = parseInt(id)
      if (isNaN(numericId)) {
        // Invalid ID, redirect to services list
        navigate('/system/services', { replace: true })
        return
      }
    }
  }, [id, navigate, user])

  // Check if user has access to services (role 1 - owner)
  if (!user || parseInt(user.role) !== 1) {
    return null // Will be redirected by useEffect
  }

  // Show services list for no ID
  if (!id) {
    return <Services />
  }

  // Show service creation form for 'new'
  if (id === 'new') {
    return <ServiceForm />
  }

  // Show service edit form for valid numeric ID
  if (id) {
    const numericId = parseInt(id)
    if (!isNaN(numericId)) {
      return <ServiceForm serviceId={numericId} />
    }
  }

  // Fallback - should not reach here due to useEffect redirects
  return null
}

export default ServiceRouter
