import { useState } from 'react'
import PropTypes from 'prop-types'

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
          Title:{' '}
          <input
            id="inputTitle"
            value={newBTitle}
            onChange={(event) => setNewBTitle(event.target.value)}
          />
        </div>
        <div>
          Author:{' '}
          <input
            id="inputAuthor"
            value={newBAuthor}
            onChange={(event) => setNewBAuthor(event.target.value)}
          />
        </div>
        <div>
          Url:{' '}
          <input
            id="inputUrl"
            value={newBUrl}
            onChange={(event) => setNewBNUrl(event.target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleFormCreate: PropTypes.func.isRequired,
}

export default BlogForm
