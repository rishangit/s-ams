import { combineEpics } from 'redux-observable'
import { loginEpic, registerEpic, getProfileEpic, updateProfileEpic } from './authEpics'
import { getAllUsersEpic, updateUserRoleEpic, getUsersByRoleEpic } from './usersEpics'
import { 
  createCompanyEpic, 
  updateCompanyEpic, 
  getCompanyByUserEpic, 
  getCompanyByIdEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic
} from './companyEpics'

export const rootEpic = combineEpics(
  loginEpic,
  registerEpic,
  getProfileEpic,
  updateProfileEpic,
  getAllUsersEpic,
  updateUserRoleEpic,
  getUsersByRoleEpic,
  createCompanyEpic,
  updateCompanyEpic,
  getCompanyByUserEpic,
  getCompanyByIdEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic
)

// Export all epics from this central location
export { authEpics } from './authEpics'
