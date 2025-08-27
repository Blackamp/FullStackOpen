import { createSlice } from '@reduxjs/toolkit'

const initialState = null
let timeoutID

const notificacionSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    sendNotification(state, action) {
      return action.payload
    },
    deleteNotification() {
      return null
    },
  },
})

export const { sendNotification, deleteNotification } =
  notificacionSlice.actions

export const setNotification = (message, seconds) => {
  return (dispatch) => {
    dispatch(sendNotification(message))

    if (timeoutID) {
      clearTimeout(timeoutID)
    }

    timeoutID = setTimeout(() => {
      dispatch(deleteNotification())
    }, seconds * 1000)
  }
}

export default notificacionSlice.reducer
