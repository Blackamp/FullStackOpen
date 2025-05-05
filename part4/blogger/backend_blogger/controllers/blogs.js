
const blogsRouter = require('express').Router()
const Blog = require('./../models/blog') //Importamos el modelo para acceder a la base de datos MongoDB

// **************** API SERVICES **********************

// GET /api/blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// POST /api/blogs
blogsRouter.post('/', async (request, response) => {

  const blogData = {
    ...request.body,
    likes: request.body.likes ?? 0,
  }

  if(blogData.title == undefined || blogData.url == undefined) {
    return response.status(400).json({ error: 'Title or URL missing' })
  }

  const blog = new Blog(blogData)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

//PUT /api/blogs/:id
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: request.body.likes ?? 0
  }

  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }

})

// DELETE /api/blogs/:id
blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})



module.exports = blogsRouter