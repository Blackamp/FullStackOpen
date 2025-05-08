const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
  //Elimino todos los usuarios de la bbdd
  await User.deleteMany({})
  //Creo un usuario de pruebas
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'userTest', passwordHash })
  await user.save()

  //Obtengo el token del usuario
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  //Inicializo de 0 la BBDD con los blogs iniciales y su usuario
  await Blog.deleteMany({})
  const blogsWithUser = helper.initialBlogs.map( blog => new Blog({...blog, user:user.id}))
  await Blog.insertMany(blogsWithUser)
})

//Test BLOG GET
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

//Test BLOG POST
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    // Test sin URL
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    // Verificar que la base de datos no cambió
    const blogAtEnd = await helper.blogsInDb()
    //console.log(blogAtEnd)  
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
  })


  test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: "Discover IA",
      author: "Blackamp",
      url: "www.blackAI.es",
      likes: 8790
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer 4783y8gfh3yrgfyg3ryugvf34ygfy3g68yg34f8fg83g4f`)
      .send(newBlog)
      .expect(401)

    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)

  })
})

//Test BLOG PUT
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
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    //console.log(updatedBlog)  
    assert.strictEqual(updatedBlog.likes,updatedData.likes)
  })
})

//Test BLOG DELETE
describe('deletion of a note: ', () => {
  test('a blog can be deleted (204)', async () => {

    const blogAtStart = await helper.blogsInDb()
    //console.log(blogAtStart) 
    const blogToDelete = blogAtStart[0]
    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
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