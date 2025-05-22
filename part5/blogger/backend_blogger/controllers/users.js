const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


// **************** API SERVICES **********************

// GET /api/users
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users)
  })


// POST /api/users
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username == undefined || !username ) {
    return response.status(400).json({error: 'username missing'})
  }else if(username.length < 3) {
      return response.status(400).json({error: 'username must be at least 3 characters long'})
  }

  if (password == undefined || !password ) {
    return response.status(400).json({error: 'password missing'})
  }else if(password.length < 3) {
      return response.status(400).json({error: 'password must be at least 3 characters long'})
  }

  const usersGet = await User.find({})
  const usersDB = usersGet.map(u => u.toJSON())

  if(usersDB.some(i => i.username === username)) {
    return response.status(400).json({error: 'username must be unique'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter