const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

//Test GET
describe('when there is initially some notes saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('all blogs have \'id\' property', async () => {
    const response = await api.get('/api/blogs')
    /*console.log(response._body)
    delete response._body[0].id
    console.log(response._body)*/

    const result = (response._body).every(blog => 'id' in blog)
    //console.log(result)
    assert(result)
  })
})

//Test POST
describe('addition of a new note', () => {

  test('a valid blog can be added: succeeds with valid data', async () => {
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
    //console.log(blogAtEnd)  
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
  })

})

//Test POST
describe('Modification of a note: ', () => {
  test('a blog can be updated with a PUT request (Update Likes)', async () => {

    const blogAtStart = await helper.blogsInDb()
    //console.log(blogAtStart) 
    const blogToUpdate = blogAtStart[0]

    const updatedData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 5555,  // aumentamos los likes
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    //console.log(updatedBlog)  
    assert.strictEqual(updatedBlog.likes,updatedData.likes)
  })
})

//Test DELETE
describe('deletion of a note: ', () => {
  test('a blog can be deleted (204)', async () => {

    const blogAtStart = await helper.blogsInDb()
    //console.log(blogAtStart) 
    const blogToDelete = blogAtStart[0]
    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    // Verificar que la base de datos cambió
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(blogToDelete.content))
  })
})

after(async () => {
  await mongoose.connection.close()
})