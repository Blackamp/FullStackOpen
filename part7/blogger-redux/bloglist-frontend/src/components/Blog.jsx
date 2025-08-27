import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, userid, handleUpdate, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [blogVisible, setBlogVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const updateBlog = (event) => {
    console.log('+1 like -' + blog)

    const blogMoreLikes = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    console.log('Handle update: ' + JSON.stringify(blogMoreLikes))
    handleUpdate(blogMoreLikes)
  }

  const showButtonDelete = () => (
    <button onClick={deleteBlog}>Remove blog</button>
  )

  const deleteBlog = (event) => {
    console.log('To Delete: ' + blog)
    handleDelete(blog.id)
  }

  console.log('userid ' + userid + ' = Userblog' + blog.user.id)

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="blog-summary">
        <div>
          {blog.title} of {blog.author}
          <button onClick={() => setBlogVisible(true)}>View</button>
        </div>
      </div>

      <div style={showWhenVisible} className="blog-details">
        <div>
          {blog.title} of {blog.author}{' '}
          <button onClick={() => setBlogVisible(false)}>Hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          Likes ♡ - {blog.likes} <button onClick={updateBlog}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {userid === blog.user.id && showButtonDelete()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  userid: PropTypes.string.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default Blog
