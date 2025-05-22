import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBTitle, setNewBTitle] = useState('')
  const [newBAuthor, setNewBAuthor] = useState('')
  const [newBUrl, setNewBNUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)


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
        const user = await loginService.login({username, password,})
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
    console.log("Log out")
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
    setNotificationMessage('You\'ve been logged out. See you soon!')
    setTimeout(() => {setNotificationMessage(null)}, 3500)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>Username: <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/></div>
      <div>Password: <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/></div>
      <button type="submit">login</button>
    </form>
  )

  //Create new Blogs
  const addBlog = event => {
    event.preventDefault()

    const newBlogAdd = {
      title: newBTitle,
      author: newBAuthor,
      url: newBUrl
    }
    console.log("New BLOG: " + JSON.stringify(newBlogAdd))

    blogService
      .create(newBlogAdd)
      .then(returnedBlog => {
        setNotificationMessage(`A new blog ${returnedBlog.title} added`)
        setTimeout(() => {setNotificationMessage(null)}, 7000)  
        setBlogs(blogs.concat(returnedBlog))
        setNewBTitle('')
        setNewBAuthor('')
        setNewBNUrl('')
    })      
    .catch(error => {
      console.log(error.response.data.error)
      setNotificationMessage("Err new blog: " + error.response.data.error)
      setTimeout(() => {setNotificationMessage(null)}, 7000)
    })
  }

  const handleBTitleChange = event => {
    setNewBTitle(event.target.value)
  }
  const handleBAuthorChange = event => {
    setNewBAuthor(event.target.value)
  }
  const handleBUrlChange = event => {
    setNewBNUrl(event.target.value)
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
      <h3>Add a new Blog</h3>
      <BlogForm handleForm={addBlog} titleBlog={newBTitle} handleEventTitle={handleBTitleChange} authorBlog={newBAuthor} handleEventAuthor={handleBAuthorChange} urlBlog={newBUrl} handleEventUrl={handleBUrlChange} />
      <br></br>
      <h3>Blogs</h3>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App