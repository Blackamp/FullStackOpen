import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, deleteThisBlog } from './reducers/blogsReducer'
import { checkLoginUser, setLogIn, setLogOut } from './reducers/userReducer'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material';



const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs) // obtenemos blogs del store
  const user = useSelector((state) => state.user) // obtenemos blogs del store

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 1,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  //Effect-hook para la solicitud y carga inicial de las notasy para obtener el token de usuario si está logado
  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(checkLoginUser())
  }, [])


  /**** BLOGS FUNCTIONS ****/
  //Create new Blogs
  const addBlog = async (newBlogAdd) => {
    console.log('New BLOG: ' + JSON.stringify(newBlogAdd))
    await dispatch(createBlog(newBlogAdd))
    blogFormRef.current.toggleVisibility()
  }

  /*** APP ***/
  const Menu = () => {
    const padding = { paddingRight: 5 }
    const navigate = useNavigate()

    const handleLogout = () => {
      dispatch(setLogOut())
      navigate('/login') // redirige a /login
    }

    return (
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/" sx={padding}>
              Blogger
            </Button>
            <Button color="inherit" component={Link} to="/users" sx={padding}>
              Users
            </Button>
          </Box>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {user.name} logged-in
          </Typography>
          <Button  variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
     
    )
  }

  const BlogList = ({ blogsList }) => (
  <div>
    <h2>Blogs</h2>
    <Togglable buttonLabel="Create Blog" ref={blogFormRef}>
      <BlogForm handleFormCreate={addBlog} />
    </Togglable>
    <br></br>
  
    <h3>List</h3>
    {[...blogsList]
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <div style={blogStyle} key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} of {blog.author}</Link>
        </div>
      ))
    }

  </div>
)

  //Comprobamos si estamos logados para mostrar pantalla de login o la aplicación
  if (user === null) {
    return (
      <Container>
        <div>
          <h2>Log in to application</h2>
          <Notification />
          <Togglable buttonLabel="Log-in">
            <LoginForm />
          </Togglable>
        </div>  
      </Container>

    )
  }

  return (
    <Container>
      <div>
        <h2>Blogger Application</h2>
        <Notification />

        <Menu />

        <br></br>
        <Routes>
          <Route path="/" element={<BlogList blogsList={blogs} />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App
