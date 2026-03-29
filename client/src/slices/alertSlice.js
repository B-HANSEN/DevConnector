import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const alertSlice = createSlice({
  name: 'alert',
  initialState: [],
  reducers: {
    addAlert: (state, action) => {
      state.push(action.payload)
    },
    removeAlert: (state, action) => {
      return state.filter((alert) => alert.id !== action.payload)
    },
  },
})

const { addAlert, removeAlert } = alertSlice.actions

// create a random id, dispatch addAlert, then remove it after timeout
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuidv4()
  dispatch(addAlert({ msg, alertType, id }))
  setTimeout(() => dispatch(removeAlert(id)), timeout)
}

export default alertSlice.reducer
