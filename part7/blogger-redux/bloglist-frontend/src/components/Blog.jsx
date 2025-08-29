import { useSelector, useDispatch } from 'react-redux'
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom'
import { addCommentBlog, likeBlog, deleteThisBlog } from '../reducers/blogsReducer'
import { useState } from 'react'
import { Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';




const Blog = () => {
  const blogs = useSelector((state) => state.blogs)// obtenemos blogs del store
  const userId = useSelector((state) => state.user?.id)
  const [newComment, setNewComment] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blogiD = useParams().id
  const blog = blogs.find((u) => u.id === blogiD)


  if (!blog) {
    return <p>Blog no encontrado...</p>
  }

  //CSS
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 15,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const updateLikesBlog = async (event) => {
    console.log('+1 like -' + blog)

    const blogMoreLikes = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    console.log('Handle update: ' + JSON.stringify(blogMoreLikes))
    await dispatch(likeBlog(blogMoreLikes))
  }

  const updateAddCommentBlog = async (event) => {
    event.preventDefault()
    console.log('Add comment -' +  JSON.stringify(blog))

    const blogWithNewComment = {
      ...blog,
      user: blog.user.id, //Necesario porque sino falla
      comments: blog.comments.concat(newComment),
    }

    console.log('Handle update: ' + JSON.stringify(blogWithNewComment))
    await dispatch(addCommentBlog(blogWithNewComment))
    setNewComment('')
  }

  const showButtonDelete = () => (
    <Button variant="outlined" color='error' startIcon={<DeleteIcon />} onClick={deleteBlog}>Remove blog</Button>
  )

  const deleteBlog = async (event) => {
    console.log('To Delete: ' + JSON.stringify(blog))
    const blogToDelete = blog

    if (window.confirm(`Remove blog ‘${blogToDelete.title}’ by ${blogToDelete.author}?`,))
    {
      console.log(`Delete ${blogToDelete.id} now!!!!!!`)
      await dispatch(deleteThisBlog(blogToDelete))
      navigate('/')
    }
  }

  console.log('userid ' + userId + ' = Userblog' + blog.user.id)
  console.log(blog)


  return (
    <div style={blogStyle}>
      <h2>{blog.title}</h2>
      <h3>{blog.author}</h3>
      <p></p>
      <div>{blog.url}</div>
      <div>
        Likes ♡ - {blog.likes} <Button variant="contained" color="success" size='small' onClick={updateLikesBlog}>like</Button>
      </div>
      <div>added by {blog.user.name}</div>
      <br></br>
      {userId === blog.user.id && showButtonDelete()}
      <br></br>
      <div>
        <h4>Comments</h4>
        <form onSubmit={updateAddCommentBlog}>
          <TextField variant='outlined' label='Comment' size='small'
            id="addComment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <Button variant="contained"  type="submit">Add comment</Button>
        </form>

        {(!blog.comments || blog.comments.length === 0) ? (
          <p> + There aren't comments</p>
        ) : (
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Blog
