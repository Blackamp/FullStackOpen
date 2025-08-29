import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, TextField } from '@mui/material'


const BlogForm = ({ handleFormCreate }) => {
  const [newBTitle, setNewBTitle] = useState('')
  const [newBAuthor, setNewBAuthor] = useState('')
  const [newBUrl, setNewBNUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlogAdd = {
      title: newBTitle,
      author: newBAuthor,
      url: newBUrl,
    }
    console.log('Handle Blog Form: ' + JSON.stringify(newBlogAdd))
    handleFormCreate(newBlogAdd)

    setNewBTitle('')
    setNewBAuthor('')
    setNewBNUrl('')
  }

  return (
    <div className="formDiv">
      <h3>Create a new Blog</h3>
      <form onSubmit={addBlog}>
        <div>
          <TextField label="Title" variant="outlined" margin="dense"  size='small' fullWidth 
            id="inputTitle"
            value={newBTitle}
            onChange={(event) => setNewBTitle(event.target.value)}
          />
        </div>
        <div>
          <TextField label="Author" variant="outlined"  margin="dense" size='small' fullWidth 
            id="inputAuthor"
            value={newBAuthor}
            onChange={(event) => setNewBAuthor(event.target.value)}
          />
        </div>
        <div>
          <TextField label="Url" variant="outlined" margin="dense"  size='small' fullWidth 
            id="inputUrl"
            value={newBUrl}
            onChange={(event) => setNewBNUrl(event.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">save</Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleFormCreate: PropTypes.func.isRequired,
}

export default BlogForm
