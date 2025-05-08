const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')


//Test USER
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  
  test('fails with status code 400 if username is shorter than 3 characters', async () => {
    const newUser = {
        username: '12',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    assert(result.body.error.includes('username must be at least 3 characters long'))

  })

  test('fails with status code 400 if username is missing', async () => {
    const newUser = {
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    assert(result.body.error.includes('username missing'))

  })

 test('fails with status code 400 if username already exists', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'User1',
      name: 'Usuario 1',
      password: 'prueba',
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))

    const newUserRepeat = {
        username: 'User1',
        name: 'USUARIO REPETIDO',
        password: 'prueba',
      }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('username must be unique'))

  })

  test('fails with status code 400 if password is shorter than 3 characters', async () => {
    const newUser = {
        username: 'Luukkainen',
        name: 'Matti Luukkainen',
        password: 'sa',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    assert(result.body.error.includes('password must be at least 3 characters long'))
  })

  test('fails with status code 400 if password is missing', async () => {
    const newUser = {
        username: 'Luukkainen',
        name: 'Matti Luukkainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    assert(result.body.error.includes('password missing'))

  })


  
  
  
}) 
  

after(async () => {
  await mongoose.connection.close()
})