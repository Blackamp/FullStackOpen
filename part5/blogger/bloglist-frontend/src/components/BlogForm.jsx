const BlogForm = (props) => {

    return (
        <form onSubmit={props.handleForm}>
            <div>Title: <input value={props.titleBlog} onChange={props.handleEventTitle}/></div>
            <div>Author: <input value={props.authorBlog} onChange={props.handleEventAuthor} /></div>
            <div>Url: <input value={props.urlBlog} onChange={props.handleEventUrl}/></div>
            <button type="submit">save</button>
        </form>
    )
  }
  
  export default BlogForm