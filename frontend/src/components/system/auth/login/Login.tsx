import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Stack, Typography, Link, Box, Container, Paper } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { FormInput, FormButton, CustomAlert } from '../../../shared'
import { useAuth } from '../../../../hooks/useAuth'


interface LoginFormData {
  email: string
  password: string
}

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
}).required()

const Login: React.FC = () => {
  const theme = useSelector((state: RootState) => state.ui.theme)
  const { login, loading, error, isAuthenticated, user, clearError } = useAuth()
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState<string>('')
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Clear messages when component mounts
  useEffect(() => {
    setSuccessMessage('')
  }, [])

  // Handle successful login and redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      setSuccessMessage(`Login successful! Welcome back, ${user.firstName}. Redirecting to dashboard...`)
      
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        navigate('/system/dashboard')
      }, 2000)
    }
  }, [isAuthenticated, user, navigate])

  // Clear success message when there's an error
  useEffect(() => {
    if (error) {
      setSuccessMessage('')
    }
  }, [error])

  const onSubmit = (data: LoginFormData) => {
    // Login with the provided credentials
    login(data)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3}
          className="p-8 rounded-lg shadow-lg"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`
          }}
        >
          <Box className="text-center mb-6">
            <Typography 
              variant="h4" 
              className="font-bold mb-2"
              style={{ color: theme.text }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body1" 
              style={{ color: theme.textSecondary }}
            >
              Sign in to your account
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                control={control}
                error={errors.email}
                required
              />

              <FormInput
                name="password"
                label="Password"
                type="password"
                control={control}
                error={errors.password}
                required
              />

              <CustomAlert
                severity="error"
                message={error || ''}
                onClose={clearError}
                show={!!error}
              />

              <CustomAlert
                severity="success"
                message={successMessage}
                onClose={() => setSuccessMessage('')}
                show={!!successMessage}
              />

              <FormButton
                type="submit"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </FormButton>

              <Box className="text-center">
                <Typography 
                  variant="body2" 
                  style={{ color: theme.textSecondary }}
                >
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/system/register"
                    style={{ 
                      color: theme.primary,
                      textDecoration: 'none'
                    }}
                    className="hover:underline"
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  )
}

export default Login
