const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('./../models/blog') //Importamos el modelo para acceder a la base de datos MongoDB
const User = require('../models/user')



// **************** API SERVICES **********************

// GET /api/blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// POST /api/blogs
blogsRouter.post('/', async (request, response) => {

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogData = {
    ...request.body,
    likes: request.body.likes ?? 0,
    user: user.id,
    comments: []
  }

  if(blogData.title == undefined || blogData.url == undefined || blogData.title == '' || blogData.url == '' || blogData.title == null || blogData.url == null) {
    return response.status(400).json({ error: 'Title or Url missing' })
  }

  const blog = new Blog(blogData)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
    // Poblamos el usuario con solo el campo username
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(savedBlog)
})

//PUT /api/blogs/:id
blogsRouter.put('/:id', async (request, response, next) => {
  
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).json({ error: 'blog not found' })
  }

  /*
  // Comprobar si el usuario actual es el creador del blog
  if (blogToUpdate.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized to update this blog' })
  }*/

  const updatedData  = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user, // Asegúrate de mantener la referencia
  }

  if (body.comments) {
    updatedData.comments = body.comments
  }

    updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedData , { new: true }).populate('user', { username: 1, name: 1 })
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
})

// DELETE /api/blogs/:id
blogsRouter.delete('/:id', async (request, response, next) => {

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogDelete = await Blog.findById(request.params.id)
  if (!blogDelete) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blogDelete.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(blogDelete.id)
    response.status(204).end()
  }else{
    return response.status(401).json({ error: 'unauthorized to delete this blog' })
  }
})



module.exports = blogsRouter