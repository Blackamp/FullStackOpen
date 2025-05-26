import { useState } from 'react'

const BlogForm = ({handleFormCreate}) => {

    const [newBTitle, setNewBTitle] = useState('')
    const [newBAuthor, setNewBAuthor] = useState('')
    const [newBUrl, setNewBNUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()

        const newBlogAdd = {
            title: newBTitle,
            author: newBAuthor,
            url: newBUrl
          }
        console.log("Handle Blog Form: " + JSON.stringify(newBlogAdd))
        handleFormCreate(newBlogAdd)

        setNewBTitle('')
        setNewBAuthor('')
        setNewBNUrl('')
    }
        

    return (
        <div>
            <h3>Create a new Blog</h3>
            <form onSubmit={addBlog}>
                <div>Title: <input value={newBTitle} onChange={event => setNewBTitle(event.target.value)}/></div>
                <div>Author: <input value={newBAuthor} onChange={event => setNewBAuthor(event.target.value)} /></div>
                <div>Url: <input value={newBUrl} onChange={event => setNewBNUrl(event.target.value)}/></div>
                <button type="submit">save</button>
            </form>
        </div>
    )
}
  
export default BlogForm