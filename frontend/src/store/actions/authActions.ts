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
