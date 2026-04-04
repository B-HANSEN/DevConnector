import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { AlertItem } from '../types'
import type { AppDispatch } from '../store'

const alertSlice = createSlice({
  name: 'alert',
  initialState: [] as AlertItem[],
  reducers: {
    addAlert: (state, action: PayloadAction<AlertItem>) => {
      state.push(action.payload)
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      return state.filter((alert) => alert.id !== action.payload)
    },
  },
})

const { addAlert, removeAlert } = alertSlice.actions

export const setAlert =
  (msg: string, alertType: string, timeout = 5000) =>
  (dispatch: AppDispatch) => {
    const id = uuidv4()
    dispatch(addAlert({ msg, alertType, id }))
    setTimeout(() => dispatch(removeAlert(id)), timeout)
  }

export default alertSlice.reducer
