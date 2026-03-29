import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import { setAlert } from './alertSlice'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  },
  reducers: {
    userLoaded: (state, action) => {
      state.isAuthenticated = true
      state.loading = false
      // payload includes user: name, email, avatar (-password)
      state.user = action.payload
    },
    loginSuccess: (state, action) => {
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
    // used by logout and account deletion to wipe auth state
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

// load user from token
export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/auth')
    // res.data is the user from that router
    dispatch(userLoaded(res.data))
  } catch {
    dispatch(authFailed())
  }
}

// register user
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    try {
      const res = await axios.post(
        '/api/users',
        JSON.stringify({ name, email, password }),
        { headers: { 'Content-Type': 'application/json' } },
      )
      setAuthToken(res.data.token)
      dispatch(loginSuccess(res.data))
      dispatch(loadUser())
    } catch (err) {
      err.response.data.errors?.forEach((error) =>
        dispatch(setAlert(error.msg, 'danger')),
      )
      dispatch(authFailed())
    }
  }

// login user
export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post(
      '/api/auth',
      JSON.stringify({ email, password }),
      { headers: { 'Content-Type': 'application/json' } },
    )
    setAuthToken(res.data.token)
    dispatch(loginSuccess(res.data))
    dispatch(loadUser())
  } catch (err) {
    err.response.data.errors?.forEach((error) =>
      dispatch(setAlert(error.msg, 'danger')),
    )
    dispatch(authFailed())
  }
}

// logout user — profileSlice listens to clearAuth to also wipe profile state
export const logout = () => (dispatch) => {
  dispatch(clearAuth())
}

export default authSlice.reducer
