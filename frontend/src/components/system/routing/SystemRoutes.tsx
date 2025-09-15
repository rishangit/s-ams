import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from '../auth/register'
import Login from '../auth/login'
import { Dashboard, UserProfile, SystemLayout, Users, Companies, Appointments, Staff } from '../'
import CompanyUsers from '../companyusers/CompanyUsers'
import UserAppointments from '../companyusers/UserAppointments'
import UserCompanies from '../companies/UserCompanies'
import AppointmentForm from '../appointments/AppointmentForm'
import CalendarView from '../appointments/CalendarView'
import CompanyRouteWrapper from '../company/CompanyRouteWrapper'
import ServiceRouter from '../services/ServiceRouter'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AdminRoute from './AdminRoute'
import OwnerRoute from './OwnerRoute'

const SystemRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes - redirect to dashboard if authenticated */}
      <Route path="register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      {/* Protected routes with SystemLayout wrapper */}
      <Route path="dashboard" element={
        <ProtectedRoute>
          <SystemLayout title="Dashboard">
            <Dashboard />
          </SystemLayout>
        </ProtectedRoute>
      } />
      <Route path="profile" element={
        <ProtectedRoute>
          <SystemLayout title="User Profile">
            <UserProfile />
          </SystemLayout>
        </ProtectedRoute>
      } />
      <Route path="users" element={
        <AdminRoute>
          <SystemLayout title="Users Management">
            <Users />
          </SystemLayout>
        </AdminRoute>
      } />
      <Route path="companies" element={
        <AdminRoute>
          <SystemLayout title="Companies Management">
            <Companies />
          </SystemLayout>
        </AdminRoute>
      } />
      <Route path="companies/:id" element={
        <ProtectedRoute>
          <CompanyRouteWrapper />
        </ProtectedRoute>
      } />
      <Route path="services/*" element={
        <OwnerRoute>
          <SystemLayout title="Services Management">
            <ServiceRouter />
          </SystemLayout>
        </OwnerRoute>
      } />
      <Route path="staff" element={
        <OwnerRoute>
          <SystemLayout title="Staff Management">
            <Staff />
          </SystemLayout>
        </OwnerRoute>
      } />
      <Route path="company-users" element={
        <OwnerRoute>
          <SystemLayout title="Company Users">
            <CompanyUsers />
          </SystemLayout>
        </OwnerRoute>
      } />
      <Route path="company-users/:userId" element={
        <OwnerRoute>
          <SystemLayout title="User Appointments">
            <UserAppointments />
          </SystemLayout>
        </OwnerRoute>
      } />
      <Route path="appointments" element={
        <ProtectedRoute>
          <SystemLayout title="Appointments">
            <Appointments />
          </SystemLayout>
        </ProtectedRoute>
      } />
      <Route path="appointments/new" element={
        <ProtectedRoute>
          <SystemLayout title="Book New Appointment">
            <AppointmentForm />
          </SystemLayout>
        </ProtectedRoute>
      } />
      <Route path="appointments/:id" element={
        <ProtectedRoute>
          <SystemLayout title="Edit Appointment">
            <AppointmentForm />
          </SystemLayout>
        </ProtectedRoute>
      } />
      <Route path="calendar" element={
        <ProtectedRoute>
          <SystemLayout title="Appointment Calendar">
            <CalendarView />
          </SystemLayout>
        </ProtectedRoute>
      } />
      <Route path="my-companies" element={
        <ProtectedRoute>
          <SystemLayout title="My Companies">
            <UserCompanies />
          </SystemLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="" element={
        <ProtectedRoute>
          <Navigate to="dashboard" replace />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default SystemRoutes
