import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendOneBlog(state, action) {
      state.push(action.payload) // Puedo cambiarlo directamente por la librería immer de Redux Toolkit
    },
    getAllBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const changedblog = action.payload
      return state.map((blog) =>
        blog.id !== changedblog.id ? blog : changedblog,
      )
    },
    deleteBlog(state, action) {
      const deletedBlog = action.payload
      return state.filter((blog) => blog.id !== deletedBlog.id)
    },
  },
})

export const { appendOneBlog, getAllBlogs, updateBlog, deleteBlog } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    dispatch(getAllBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogsService.create(content)
      dispatch(appendOneBlog(newBlog))
      dispatch(setNotification(`A new blog created '${newBlog.title}'`, 5))
    } catch (error) {
      console.log('Err new blog:' + error.response.data.error)
      dispatch(setNotification('Err new blog: ' + error.response.data.error, 6))
    }
  }
}

export const likeBlog = (blogToUpdate) => {
  return async (dispatch) => {
    try {
      const updated = await blogsService.update(blogToUpdate.id, blogToUpdate)
      dispatch(updateBlog(updated))
      dispatch(
        setNotification(`The blog ‘${updated.title}’ received a like!`, 6),
      )
    } catch (error) {
      console.log('Axios error object:', error)
      console.log('Axios error response:', error.response)
      dispatch(
        setNotification('Err update blog: ' + error.response.data.error, 6),
      )
    }
  }
}

export const deleteThisBlog = (blogToDelete) => {
  return async (dispatch) => {
    try {
      await blogsService.deleteBlog(blogToDelete.id)
      dispatch(deleteBlog(blogToDelete))
      dispatch(
        setNotification(
          `The blog ‘${blogToDelete.title}’ by ${blogToDelete.author} has been deleted on the server`,
          6,
        ),
      )
    } catch (error) {
      console.log('Axios error response:', error)
      dispatch(
        setNotification(
          `Err: The blog ‘${blogToDelete.title}’ couldn't be deleted from server - ` +
            error.response.data.error,
          8,
        ),
      )
    }
  }
}

export default blogsSlice.reducer
