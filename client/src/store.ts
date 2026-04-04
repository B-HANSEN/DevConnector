import { configureStore } from '@reduxjs/toolkit'
import alertReducer from './slices/alertSlice'
import authReducer from './slices/authSlice'
import profileReducer from './slices/profileSlice'
import postReducer from './slices/postSlice'
import setAuthToken from './utils/setAuthToken'

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    profile: profileReducer,
    post: postReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// keep axios headers and localStorage in sync whenever the token changes
let currentState = store.getState()

store.subscribe(() => {
  const previousState = currentState
  currentState = store.getState()
  if (previousState.auth.token !== currentState.auth.token) {
    setAuthToken(currentState.auth.token)
  }
})

export default store
