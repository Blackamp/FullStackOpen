import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import loginService from '../services/login'
import { setNotification } from '../reducers/notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser(state, action) {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const checkLoginUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogsService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const setLogIn = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      console.log(user)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogsService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(setNotification('Err: ' + exception.response.data.error, 5))
    }
  }
}

export const setLogOut = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedNoteappUser')
    dispatch(clearUser())
    dispatch(setNotification("You've been logged out. See you soon!", 3))
  }
}

export default userSlice.reducer
