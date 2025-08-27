import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationDispatch, setNotification } from './context/NotificationContext'
import { useUserValue, useUserDispatch } from './context/UserContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const notificDispatch = useNotificationDispatch()
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  const queryClient = useQueryClient()
  const blogFormRef = useRef()


  //Obtención de las blogs del servidor mediante React Query
  const resultBlog = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry:1
  })
  console.log(JSON.parse(JSON.stringify(resultBlog)))
  const blogs = resultBlog.data


  //Obtener el token de usuario si está logado
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [])


  //Login
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password })
      console.log(user)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
      setUsername('')
      setPassword('')
    } catch (exception) {
      //console.log("EXCEPTION: "+exception.response.data.error)
      setNotification(notificDispatch,'Err: ' + exception.response.data.error,5)
    }
  }

  const handleLogOut = (event) => {
    console.log('Log out')
    userDispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('loggedNoteappUser')
    setNotification(notificDispatch,'You\'ve been logged out. See you soon!',3)
  }


  //BLOGS - Operaciones MUTATE
  const newNoteMutation = useMutation({ 
    mutationFn: blogService.create,
    onSuccess: (newNote) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) => oldBlogs.concat(newNote))
      setNotification(notificDispatch,`A new blog ${newNote.title} added`,7)
    },
    onError: (error)=> {
      console.log('Err new blog:' + error.response.data.error)
      setNotification(notificDispatch,'Err new blog: ' + error.response.data.error,7)
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: (blog) => blogService.update(blog.id, blog),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog))
      ) 
      setNotification(notificDispatch,`The blog ‘${updatedBlog.title}’ received a like!`,7)
    },
    onError: (error)=> {
      console.log('Axios error object:', error)
      console.log('Axios error response:', error.response)
      setNotification(notificDispatch,'Err update blog: ' + error.response.data.error,7)
    }  
  })
  
  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => blogService.deleteBlog(blog.id),
    onSuccess: (_,blogToDelete) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.filter((b) => b.id !== blogToDelete.id)
      )
      setNotification(notificDispatch, `The blog ‘${blogToDelete.title}’ by ${blogToDelete.author} has been deleted on the server`,7)
    },
    onError: (error, blogToDelete) => {
      console.log(error.response.data.error)
      setNotification(notificDispatch, `Err: The blog ‘${blogToDelete.title}’ couldn't be deleted from server - ` + error.response.data.error,7)
    }
  })


  //Create new Blogs
  const addBlog = (newBlogAdd) => {
    blogFormRef.current.toggleVisibility()
    console.log('New BLOG: ' + JSON.stringify(newBlogAdd))
    newNoteMutation.mutate(newBlogAdd)
  }

  //Update likes Blog
  const updateBlog = (blogToUpdate) => {
    console.log('Update blog: ' + JSON.stringify(blogToUpdate))
    updateBlogMutation.mutate(blogToUpdate)
  }

  //Delete blog
  const deleteBlog = (id) => {
    console.log('handleDelete')
    const blogToDelete = blogs.find((b) => b.id === id)
    if (window.confirm(`Remove blog ‘${blogToDelete.title}’ by ${blogToDelete.author}?`,)) 
    {
      console.log(`Delete ${blogToDelete.id} now!!!!!!`)
      deleteBlogMutation.mutate(blogToDelete)
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

  //Si estamos logados pero estamos cargando los blogs o hay error
  if (resultBlog.isLoading ) return <div>loading data...</div>
  if (resultBlog.isError) {
    return (
      <div>
        <span>Anecdote service not available due to problems in server</span>
        <br></br>
        <span>Error: {resultBlog.error.message}</span>
      </div>
    )
  }

  //Si estamos logados y hemos obtenido los blogs
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
      {blogs
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
