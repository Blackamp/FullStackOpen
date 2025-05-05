const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObject = helper.initialBlogs
    .map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)
    //const results = await Promise.all(promiseArray)
    //console.log(results)
})

//Test: type response JSON
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

//Test: get all blogs
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

//Test: All blogs have 'id' property
test('all blogs have \'id\' property', async () => {
  const response = await api.get('/api/blogs')
  /*console.log(response._body)
  delete response._body[0].id
  console.log(response._body)*/

  const result = (response._body).every(blog => 'id' in blog)
  //console.log(result)
  assert(result)
})

//Test: Post new blog
test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Discover IA",
    author: "Blackamp",
    url: "www.blackAI.es",
    likes: 8790
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogAtEnd.map(n => n.title)
  assert(contents.includes('Discover IA'))
})

//Test: Likes is missing, default 0
test('if likes is missing from the request, it defaults to 0', async () => {
  
  const newBlog = {
    title: "No Likes",
    author: "Blackamp",
    url: "www.nolikesnoparty.es",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)

  const blog = blogAtEnd.find(b => b.title === "No Likes")
  assert.strictEqual(blog.likes, 0)  // Aquí verificamos que likes sea 0
})

//Test: title or URL is missing - 400 bad request
test('a new blog without title or url returns 400 Bad Request', async () => {

  const newBlogWithoutTitle = {
    author: "Blackamp",
    url: "www.noparty.es"
  }

  const newBlogWithoutUrl = {
    title: "No URL",
    author: "Blackamp"
  }

  // Test sin título
  await api
   .post('/api/blogs')
   .send(newBlogWithoutTitle)
   .expect(400)
   .expect('Content-Type', /application\/json/)

  // Test sin URL
  await api
   .post('/api/blogs')
   .send(newBlogWithoutUrl)
   .expect(400)
   .expect('Content-Type', /application\/json/)

  // Verificar que la base de datos no cambió
  const blogAtEnd = await helper.blogsInDb()
  console.log(blogAtEnd)  
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
})


after(async () => {
  await mongoose.connection.close()
})