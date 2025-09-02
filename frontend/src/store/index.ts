import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { rootReducer } from './reducers'
import { authEpics } from './epics'
import { getAllUsersEpic, updateUserRoleEpic, getUsersByRoleEpic } from './epics/usersEpics'
import { 
  createCompanyEpic, 
  updateCompanyEpic, 
  getCompanyByUserEpic,
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic
} from './epics/companyEpics'

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
  getAllCompaniesEpic,
  updateCompanyStatusEpic,
  deleteCompanyEpic
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

// Add logging middleware for debugging
const originalDispatch = store.dispatch
store.dispatch = (action: any) => {
  console.log('Dispatching action:', action)
  return originalDispatch(action)
}

// Run the root epic
epicMiddleware.run(rootEpic)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
