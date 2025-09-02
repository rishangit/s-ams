import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from '../auth/register'
import Login from '../auth/login'
import { Dashboard, UserProfile, SystemLayout, Users } from '../'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AdminRoute from './AdminRoute'

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
