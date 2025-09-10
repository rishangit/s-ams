import { createAction } from '@reduxjs/toolkit'

// Action types
export const GET_ALL_USERS_REQUEST = 'users/getAllUsersRequest'
export const GET_ALL_USERS_SUCCESS = 'users/getAllUsersSuccess'
export const GET_ALL_USERS_FAILURE = 'users/getAllUsersFailure'

export const UPDATE_USER_ROLE_REQUEST = 'users/updateUserRoleRequest'
export const UPDATE_USER_ROLE_SUCCESS = 'users/updateUserRoleSuccess'
export const UPDATE_USER_ROLE_FAILURE = 'users/updateUserRoleFailure'

export const GET_USERS_BY_ROLE_REQUEST = 'users/getUsersByRoleRequest'
export const GET_USERS_BY_ROLE_SUCCESS = 'users/getUsersByRoleSuccess'
export const GET_USERS_BY_ROLE_FAILURE = 'users/getUsersByRoleFailure'

export const CLEAR_USERS_ERROR = 'users/clearError'
export const CLEAR_USERS_SUCCESS = 'users/clearSuccess'

// Action creators
export const getAllUsersRequest = createAction(GET_ALL_USERS_REQUEST)

export const getAllUsersSuccess = createAction<{ users: any[] }>(GET_ALL_USERS_SUCCESS)

export const getAllUsersFailure = createAction<string>(GET_ALL_USERS_FAILURE)

export const updateUserRoleRequest = createAction<{ userId: number; role: string }>(UPDATE_USER_ROLE_REQUEST)

export const updateUserRoleSuccess = createAction<{ user: any }>(UPDATE_USER_ROLE_SUCCESS)

export const updateUserRoleFailure = createAction<string>(UPDATE_USER_ROLE_FAILURE)

export const getUsersByRoleRequest = createAction<string>(GET_USERS_BY_ROLE_REQUEST)

export const getUsersByRoleSuccess = createAction<{ users: any[] }>(GET_USERS_BY_ROLE_SUCCESS)

export const getUsersByRoleFailure = createAction<string>(GET_USERS_BY_ROLE_FAILURE)

export const clearUsersError = createAction(CLEAR_USERS_ERROR)

export const clearUsersSuccess = createAction(CLEAR_USERS_SUCCESS)
