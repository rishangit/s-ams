import { createAction } from '@reduxjs/toolkit'
import { RegisterRequest, LoginRequest, AuthResponse, User } from '../../services/api'

// Action Types
export const REGISTER_REQUEST = 'auth/registerRequest'
export const REGISTER_SUCCESS = 'auth/registerSuccess'
export const REGISTER_FAILURE = 'auth/registerFailure'

export const LOGIN_REQUEST = 'auth/loginRequest'
export const LOGIN_SUCCESS = 'auth/loginSuccess'
export const LOGIN_FAILURE = 'auth/loginFailure'

export const LOGOUT = 'auth/logout'

export const GET_PROFILE_REQUEST = 'auth/getProfileRequest'
export const GET_PROFILE_SUCCESS = 'auth/getProfileSuccess'
export const GET_PROFILE_FAILURE = 'auth/getProfileFailure'

export const UPDATE_PROFILE_REQUEST = 'auth/updateProfileRequest'
export const UPDATE_PROFILE_SUCCESS = 'auth/updateProfileSuccess'
export const UPDATE_PROFILE_FAILURE = 'auth/updateProfileFailure'

export const GET_AVAILABLE_ROLES_REQUEST = 'auth/getAvailableRolesRequest'
export const GET_AVAILABLE_ROLES_SUCCESS = 'auth/getAvailableRolesSuccess'
export const GET_AVAILABLE_ROLES_FAILURE = 'auth/getAvailableRolesFailure'

export const SWITCH_ROLE_REQUEST = 'auth/switchRoleRequest'
export const SWITCH_ROLE_SUCCESS = 'auth/switchRoleSuccess'
export const SWITCH_ROLE_FAILURE = 'auth/switchRoleFailure'

export const SWITCH_BACK_REQUEST = 'auth/switchBackRequest'
export const SWITCH_BACK_SUCCESS = 'auth/switchBackSuccess'
export const SWITCH_BACK_FAILURE = 'auth/switchBackFailure'

// Action Creators
export const registerRequest = createAction<RegisterRequest>(REGISTER_REQUEST)
export const registerSuccess = createAction<AuthResponse>(REGISTER_SUCCESS)
export const registerFailure = createAction<string>(REGISTER_FAILURE)

export const loginRequest = createAction<LoginRequest>(LOGIN_REQUEST)
export const loginSuccess = createAction<AuthResponse>(LOGIN_SUCCESS)
export const loginFailure = createAction<string>(LOGIN_FAILURE)

export const logout = createAction(LOGOUT)

export const getProfileRequest = createAction(GET_PROFILE_REQUEST)
export const getProfileSuccess = createAction<{ user: User }>(GET_PROFILE_SUCCESS)
export const getProfileFailure = createAction<string>(GET_PROFILE_FAILURE)

export const updateProfileRequest = createAction<Partial<User>>(UPDATE_PROFILE_REQUEST)
export const updateProfileSuccess = createAction<{ user: User }>(UPDATE_PROFILE_SUCCESS)
export const updateProfileFailure = createAction<string>(UPDATE_PROFILE_FAILURE)

export const getAvailableRolesRequest = createAction(GET_AVAILABLE_ROLES_REQUEST)
export const getAvailableRolesSuccess = createAction<{ currentRole: any, availableRoles: any[] }>(GET_AVAILABLE_ROLES_SUCCESS)
export const getAvailableRolesFailure = createAction<string>(GET_AVAILABLE_ROLES_FAILURE)

export const switchRoleRequest = createAction<number>(SWITCH_ROLE_REQUEST)
export const switchRoleSuccess = createAction<AuthResponse>(SWITCH_ROLE_SUCCESS)
export const switchRoleFailure = createAction<string>(SWITCH_ROLE_FAILURE)

export const switchBackRequest = createAction(SWITCH_BACK_REQUEST)
export const switchBackSuccess = createAction<AuthResponse>(SWITCH_BACK_SUCCESS)
export const switchBackFailure = createAction<string>(SWITCH_BACK_FAILURE)
