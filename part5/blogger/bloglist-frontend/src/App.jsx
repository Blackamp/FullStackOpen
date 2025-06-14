import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const blogFormRef = useRef()



  //Effect-hook para la solicitud y carga inicial de las notas
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  //Effect-hook obtener el token de usuario si está logado
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
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
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      //console.log("EXCEPTION: "+exception.response.data.error)
      setNotificationMessage('Err: '+ exception.response.data.error)
      setTimeout(() => {setNotificationMessage(null)}, 5000)
    }
  }

  const handleLogOut = event => {
    console.log('Log out')
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
    setNotificationMessage('You\'ve been logged out. See you soon!')
    setTimeout(() => {setNotificationMessage(null)}, 3500)
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel='Log-in'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  //Create new Blogs
  const addBlog = (newBlogAdd) => {
    blogFormRef.current.toggleVisibility()

    console.log('New BLOG: ' + JSON.stringify(newBlogAdd))

    blogService
      .create(newBlogAdd)
      .then(returnedBlog => {
        setNotificationMessage(`A new blog ${returnedBlog.title} added`)
        setTimeout(() => {setNotificationMessage(null)}, 7000)
        setBlogs(blogs.concat(returnedBlog))
      })
      .catch(error => {
        console.log('Err new blog:'+error.response.data.error)
        setNotificationMessage('Err new blog: ' + error.response.data.error)
        setTimeout(() => {setNotificationMessage(null)}, 7000)
      })
  }

  //Update likes Blog
  const updateBlog = (blogToUpdate) => {

    console.log('Update blog: ' + JSON.stringify(blogToUpdate))

    blogService
      .update(blogToUpdate.id, blogToUpdate)
      .then(returnedBlog => {
        setNotificationMessage(`The blog ‘${returnedBlog.title}’ received a like!`)
        setTimeout(() => {setNotificationMessage(null)}, 7000)
        setBlogs(blogs.map(b => b.id !== blogToUpdate.id ? b : returnedBlog))
      })
      .catch(error => {
        console.log('Axios error object:', error)
        console.log('Axios error response:', error.response)
        //console.log("Err update contact: "+ console.log(error.response.data.error))
        setNotificationMessage('Err update contact: '+error.response.data.error)
        setTimeout(() => {setNotificationMessage(null)}, 7000)
      })
  }

  //Delete blog
  const deleteContact = id => {
    console.log('handleDelete')

    const blogToDelete = blogs.find(b => b.id === id)

    if (window.confirm(`Remove blog ‘${blogToDelete.title}’ by ${blogToDelete.author}?`)) {
      console.log(`Delete ${blogToDelete.id} now!!!!!!`)
      blogService
        .deleteBlog(blogToDelete.id)
        .then(() => {
          setNotificationMessage(`The blog ‘${blogToDelete.title}’ by ${blogToDelete.author} has been deleted on the server`)
          setTimeout(() => {setNotificationMessage(null)}, 7000)
          setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNotificationMessage(`Err: The blog ‘${blogToDelete.title}’ couldn't be deleted from server - ` + error.response.data.error)
          setTimeout(() => {setNotificationMessage(null)}, 10000)
        })
    }
  }

  //Comprobamos si estamos logados para mostrar pantalla de login o la aplicación
  if (user === null){
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage}/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>Blogger Application</h2>
      <Notification message={notificationMessage}/>

      <div>
        {user.name} logged-in <button onClick={handleLogOut}>logout</button>
      </div>

      <br></br>
      <Togglable buttonLabel="Create Blog" ref={blogFormRef}>
        <BlogForm handleFormCreate={addBlog}/>
      </Togglable>
      <br></br>
      <h3>Blogs</h3>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} userid={user.id} handleUpdate={updateBlog} handleDelete={deleteContact} />
        )}
    </div>
  )
}

export default App