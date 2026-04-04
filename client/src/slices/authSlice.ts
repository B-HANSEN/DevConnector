import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios, { type AxiosError } from 'axios'
import setAuthToken from '../utils/setAuthToken'
import { setAlert } from './alertSlice'
import type { User } from '../types'
import type { AppDispatch } from '../store'

interface AuthState {
  token: string | null
  isAuthenticated: boolean | null
  loading: boolean
  user: User | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoaded: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.loading = false
      state.user = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
    },
    authFailed: (state) => {
      localStorage.removeItem('token')
      state.token = null
      state.isAuthenticated = false
      state.loading = false
    },
    clearAuth: (state) => {
      localStorage.removeItem('token')
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.user = null
    },
  },
})

export const { userLoaded, loginSuccess, authFailed, clearAuth } =
  authSlice.actions

export const loadUser = () => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get<User>('/api/auth')
    dispatch(userLoaded(res.data))
  } catch {
    dispatch(authFailed())
  }
}

export const register =
  ({ name, email, password }: { name: string; email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post<{ token: string }>('/api/users', {
        name,
        email,
        password,
      })
      setAuthToken(res.data.token)
      dispatch(loginSuccess(res.data))
      dispatch(loadUser())
    } catch (err) {
      const error = err as AxiosError<{ errors?: { msg: string }[] }>
      error.response?.data.errors?.forEach((e) =>
        dispatch(setAlert(e.msg, 'danger')),
      )
      dispatch(authFailed())
    }
  }

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post<{ token: string }>('/api/auth', {
        email,
        password,
      })
      setAuthToken(res.data.token)
      dispatch(loginSuccess(res.data))
      dispatch(loadUser())
    } catch (err) {
      const error = err as AxiosError<{ errors?: { msg: string }[] }>
      error.response?.data.errors?.forEach((e) =>
        dispatch(setAlert(e.msg, 'danger')),
      )
      dispatch(authFailed())
    }
  }

export const logout = () => (dispatch: AppDispatch) => {
  dispatch(clearAuth())
}

export default authSlice.reducer
