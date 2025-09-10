import React from 'react'
import { useParams } from 'react-router-dom'
import SystemLayout from '../SystemLayout'
import CompanyRouter from './CompanyRouter'

const CompanyRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // Determine title based on route
  const getTitle = () => {
    if (id === 'new') {
      return 'Company Registration'
    }
    return 'Company Details'
  }

  return (
    <SystemLayout title={getTitle()}>
      <CompanyRouter />
    </SystemLayout>
  )
}

export default CompanyRouteWrapper
