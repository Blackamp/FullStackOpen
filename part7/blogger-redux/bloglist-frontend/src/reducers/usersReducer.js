import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
import { setNotification } from '../reducers/notificationReducer'

const usersSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    getAllUsers(state, action) {
      return action.payload
    },
  },
})

export const { getAllUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getUsers()
    dispatch(getAllUsers(users))
  }
}

export default usersSlice.reducer
