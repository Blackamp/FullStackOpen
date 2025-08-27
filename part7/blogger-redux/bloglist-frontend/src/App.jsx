import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteThisBlog,
} from './reducers/blogsReducer'
import { checkLoginUser, setLogIn, setLogOut } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs) // obtenemos blogs del store
  const user = useSelector((state) => state.user) // obtenemos blogs del store

  //Effect-hook para la solicitud y carga inicial de las notas
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  //Effect-hook obtener el token de usuario si está logado
  useEffect(() => {
    dispatch(checkLoginUser())
  }, [])

  //Login
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    await dispatch(setLogIn(username, password))
    //setUsername('')
    //setPassword('')
  }

  const handleLogOut = (event) => {
    //console.log('Log out')
    dispatch(setLogOut())
  }

  //Create new Blogs
  const addBlog = async (newBlogAdd) => {
    console.log('New BLOG: ' + JSON.stringify(newBlogAdd))
    await dispatch(createBlog(newBlogAdd))
    blogFormRef.current.toggleVisibility()
  }

  //Update likes Blog
  const updateBlog = async (blogToUpdate) => {
    console.log('Update blog: ' + JSON.stringify(blogToUpdate))
    await dispatch(likeBlog(blogToUpdate))
  }

  //Delete blog
  const deleteBlog = async (id) => {
    console.log('handleDelete')
    const blogToDelete = blogs.find((b) => b.id === id)

    if (
      window.confirm(
        `Remove blog ‘${blogToDelete.title}’ by ${blogToDelete.author}?`,
      )
    ) {
      console.log(`Delete ${blogToDelete.id} now!!!!!!`)
      await dispatch(deleteThisBlog(blogToDelete))
    }
  }

  //Comprobamos si estamos logados para mostrar pantalla de login o la aplicación
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <Togglable buttonLabel="Log-in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogger Application</h2>
      <Notification />

      <div>
        {user.name} logged-in <button onClick={handleLogOut}>logout</button>
      </div>

      <br></br>
      <Togglable buttonLabel="Create Blog" ref={blogFormRef}>
        <BlogForm handleFormCreate={addBlog} />
      </Togglable>
      <br></br>
      <h3>Blogs</h3>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            userid={user.id}
            handleUpdate={updateBlog}
            handleDelete={deleteBlog}
          />
        ))}
    </div>
  )
}

export default App
