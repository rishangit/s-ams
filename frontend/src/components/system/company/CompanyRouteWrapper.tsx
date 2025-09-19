import React from 'react'
import SystemLayout from '../SystemLayout'
import CompanyRouter from './CompanyRouter'

const CompanyRouteWrapper: React.FC = () => {
  return (
    <SystemLayout>
      <CompanyRouter />
    </SystemLayout>
  )
}

export default CompanyRouteWrapper
