
const blogsRouter = require('express').Router()
const Blog = require('./../models/blog') //Importamos el modelo para acceder a la base de datos MongoDB

// **************** API SERVICES **********************

// GET /api/blogs
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
      response.json(blogs)
    })
})

// POST /api/blogs
blogsRouter.post('/', (request, response) => {

  const blog = new Blog(request.body)

  blog.save().then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})


module.exports = blogsRouter