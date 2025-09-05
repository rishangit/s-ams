import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { rootReducer } from './reducers'
import { authEpics } from './epics'
import { getAllUsersEpic, updateUserRoleEpic, getUsersByRoleEpic } from './epics/usersEpics'
import { 
  createCompanyEpic, 
  updateCompanyEpic, 
  getCompanyByUserEpic,
  getCompanyByIdEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic
} from './epics/companyEpics'
import {
  createServiceEpic,
  getServicesEpic,
  getServiceByIdEpic,
  updateServiceEpic,
  updateServiceStatusEpic,
  deleteServiceEpic
} from './epics/servicesEpics'

const epicMiddleware = createEpicMiddleware()

// Combine all epics into a root epic
const rootEpic = combineEpics(
  ...authEpics,
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
  createServiceEpic,
  getServicesEpic,
  getServiceByIdEpic,
  updateServiceEpic,
  updateServiceStatusEpic,
  deleteServiceEpic
)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(epicMiddleware),
  devTools: true,
})



// Run the root epic
epicMiddleware.run(rootEpic)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
