require('dotenv').config() //Importamos las variables de entorno definidas en el archivo .env
const express = require('express')
const app = express()
app.use(express.json()) // Necesario para express use y trabaje con JSON
app.use(express.static('dist')) // Necesario para express sirva contenido estático

//Middleware para permitir Cross-Origin Resource Sharing
const cors = require('cors')
app.use(cors())

/* *** MORGAN *** */
var morgan = require('morgan')
morgan.token('data', function (req, res) { return JSON.stringify(req.body)})

//Morgan logger para el método POST
app.use(morgan(':method :url :status :res[content-length] - :response-time ms / :data',{
  skip: function (req,res) { return req.method !== 'POST'}
}))

//Morgan logger para el resto de métodos
app.use(morgan('tiny',{
  skip: function (req,res) { return req.method === 'POST'}
}))


//Importamos el modelo para acceder a la base de datos MongoDB
const Person = require('./models/person')



// ****** SERVICES ******

// Default
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// GET /info
app.get('/info', (request, response) => {
  const hfActual = new Date ()
  hfActual.toUTCString()
  Person.find({}).then(persons => {
    const resume = '<p>Phonebook has info for ' +persons.length+ ' people.</p><p>'+ hfActual + '</p>'
    response.send(resume)
  })
})

// GET /api/persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// GET /api/persons/id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST /api/person
app.post('/api/persons', (request, response,next) => {
  const body = request.body
  //console.log(body)

  /*if (!body.name || !body.phone) {
    return response.status(400).json({
      error: 'content missing'
    })
  }else if(persons.some(i => i.name === body.name)) {
      return response.status(400).json({
          error: 'name must be unique'
        })
  }*/

  const newContact = new Person({
    name: body.name,
    phone: body.phone,
  })

  newContact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

// UPDATE /api/persons/id
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  console.log('Update: ', body)

  const contact ={
    name: body.name,
    phone: body.phone,
  }

  Person.findByIdAndUpdate(request.params.id, contact, { phone: body.phone, runValidators: true, context: 'query' })
    .then(updateContact => {
      updateContact.phone = body.phone
      response.json(updateContact)
    })
    .catch(error => next(error))
})

// DELETE /api/persons/id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: 'Sintax Error' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// controlador de solicitudes que resulten en errores
app.use(errorHandler)


//Levantamos el servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})