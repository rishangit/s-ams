import { combineEpics } from 'redux-observable'
import { loginEpic, registerEpic, getProfileEpic, updateProfileEpic, loadUserSettingsAfterLoginEpic } from './authEpics'
import { getAllUsersEpic, updateUserRoleEpic, getUsersByRoleEpic } from './usersEpics'
import { 
  createCompanyEpic, 
  updateCompanyEpic, 
  getCompanyByUserEpic, 
  getCompanyByIdEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic,
  getCompaniesByUserAppointmentsEpic
} from './companyEpics'
import {
  getStaffEpic,
  getStaffByCompanyIdEpic,
  getStaffByIdEpic,
  createStaffEpic,
  updateStaffEpic,
  deleteStaffEpic,
  getAvailableUsersEpic
} from './staffEpics'
import {
  getUserSettingsEpic,
  updateUserSettingsEpic,
  resetUserSettingsEpic
} from './userSettingsEpics'

export const rootEpic = combineEpics(
  loginEpic,
  registerEpic,
  getProfileEpic,
  updateProfileEpic,
  loadUserSettingsAfterLoginEpic,
  getAllUsersEpic,
  updateUserRoleEpic,
  getUsersByRoleEpic,
  createCompanyEpic,
  updateCompanyEpic,
  getCompanyByUserEpic,
  getCompanyByIdEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic,
  getCompaniesByUserAppointmentsEpic,
  getStaffEpic,
  getStaffByCompanyIdEpic,
  getStaffByIdEpic,
  createStaffEpic,
  updateStaffEpic,
  deleteStaffEpic,
  getAvailableUsersEpic,
  getUserSettingsEpic,
  updateUserSettingsEpic,
  resetUserSettingsEpic
)

// Export all epics from this central location
export { authEpics } from './authEpics'
