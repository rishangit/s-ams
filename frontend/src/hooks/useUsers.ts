import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from '../store'
import {
  getAllUsersRequest,
  updateUserRoleRequest,
  getUsersByRoleRequest,
  clearUsersError,
  clearUsersSuccess
} from '../store/actions/userActions'

export const useUsers = () => {

  const dispatch = useDispatch()
  const { users, loading, error, success, updateLoading, updateError, updateSuccess } = useSelector(
    (state: RootState) => state.users
  )

  const fetchAllUsers = useCallback(() => {
    dispatch(getAllUsersRequest())
  }, [dispatch])

  const updateUserRole = useCallback((userId: number, role: string) => {
    dispatch(updateUserRoleRequest({ userId, role }))
  }, [dispatch])

  const fetchUsersByRole = useCallback((role: string) => {
    dispatch(getUsersByRoleRequest(role))
  }, [dispatch])

  const clearError = useCallback(() => {
    dispatch(clearUsersError())
  }, [dispatch])

  const clearSuccess = useCallback(() => {
    dispatch(clearUsersSuccess())
  }, [dispatch])

  return {
    users,
    loading,
    error,
    success,
    updateLoading,
    updateError,
    updateSuccess,
    fetchAllUsers,
    updateUserRole,
    fetchUsersByRole,
    clearError,
    clearSuccess
  }
}
