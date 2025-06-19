import { createSlice } from '@reduxjs/toolkit'

const initialState = null


const notificacionSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    sendNotification(state, action) {
      return action.payload
    },
    deleteNotification() {
      return null
    },
  },
})

export const { sendNotification, deleteNotification } = notificacionSlice.actions
export default notificacionSlice.reducer