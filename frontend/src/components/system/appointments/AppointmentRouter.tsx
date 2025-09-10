import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import Appointments from './Appointments'
import AppointmentForm from './AppointmentForm'

const AppointmentRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check if user has access to appointments (roles 0, 1, 3)
    if (!user || ![0, 1, 3].includes(parseInt(user.role))) {
      navigate('/system/dashboard', { replace: true })
      return
    }

    // If ID is provided and it's not 'new' or a valid number, redirect to appointments list
    if (id && id !== 'new') {
      const numericId = parseInt(id)
      if (isNaN(numericId)) {
        // Invalid ID, redirect to appointments list
        navigate('/system/appointments', { replace: true })
        return
      }
    }
  }, [id, navigate, user])

  // Check if user has access to appointments (roles 0, 1, 3)
  if (!user || ![0, 1, 3].includes(parseInt(user.role))) {
    return null // Will be redirected by useEffect
  }

  // Show appointments list for no ID
  if (!id) {
    return <Appointments />
  }

  // Show appointment creation form for 'new'
  if (id === 'new') {
    return <AppointmentForm />
  }

  // Show appointment edit form for valid numeric ID
  if (id) {
    const numericId = parseInt(id)
    if (!isNaN(numericId)) {
      return <AppointmentForm appointmentId={numericId} />
    }
  }

  // Fallback - should not reach here due to useEffect redirects
  return null
}

export default AppointmentRouter
