import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { 
  registerRequest, 
  loginRequest, 
  logout, 
  getProfileRequest, 
  updateProfileRequest 
} from '../store/actions'
import { clearError } from '../store/reducers/authSlice'
import { RegisterRequest, LoginRequest, User } from '../services/api'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,

    // Actions
    register: (data: RegisterRequest) => dispatch(registerRequest(data)),
    login: (data: LoginRequest) => dispatch(loginRequest(data)),
    logout: () => dispatch(logout()),
    getProfile: () => dispatch(getProfileRequest()),
    updateProfile: (data: Partial<User>) => dispatch(updateProfileRequest(data)),
    clearError: () => dispatch(clearError()),
  }
}
