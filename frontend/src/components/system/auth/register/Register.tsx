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

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
}).required()

const Register: React.FC = () => {
  const theme = useSelector((state: RootState) => state.ui.theme)
  const { register, loading, error, isAuthenticated, user, clearError } = useAuth()
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState<string>('')
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    }
  })

  // Clear messages when component mounts
  useEffect(() => {
    setSuccessMessage('')
  }, [])

  // Navigate to login on successful registration
  useEffect(() => {
    if (isAuthenticated && user) {
      setSuccessMessage('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/system/login')
      }, 2000)
    }
  }, [isAuthenticated, user, navigate])

  // Clear success message when there's an error
  useEffect(() => {
    if (error) {
      setSuccessMessage('')
    }
  }, [error])

  const onSubmit = (data: RegisterFormData) => {
    // Register with default user role (backend will set to 'user')
    register(data)
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
              Create Account
            </Typography>
            <Typography 
              variant="body1" 
              style={{ color: theme.textSecondary }}
            >
              Sign up for your S-AMS account
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Box className="grid grid-cols-2 gap-3">
                <FormInput
                  name="firstName"
                  label="First Name"
                  control={control}
                  error={errors.firstName}
                  required
                />
                <FormInput
                  name="lastName"
                  label="Last Name"
                  control={control}
                  error={errors.lastName}
                  required
                />
              </Box>

              <FormInput
                name="email"
                label="Email Address"
                type="email"
                control={control}
                error={errors.email}
                required
              />

              <FormInput
                name="phoneNumber"
                label="Phone Number"
                control={control}
                error={errors.phoneNumber}
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

              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                control={control}
                error={errors.confirmPassword}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </FormButton>

              <Box className="text-center">
                <Typography 
                  variant="body2" 
                  style={{ color: theme.textSecondary }}
                >
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/system/login"
                    style={{ 
                      color: theme.primary,
                      textDecoration: 'none'
                    }}
                    className="hover:underline"
                  >
                    Sign in here
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

export default Register
