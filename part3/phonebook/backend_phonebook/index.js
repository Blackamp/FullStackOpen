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
    skip: function (req,res) { return req.method !== "POST"}
}))

//Morgan logger para el resto de métodos
app.use(morgan('tiny',{
    skip: function (req,res) { return req.method == "POST"}
}))


//Importamos el modelo para acceder a la base de datos MongoDB
const Person = require('./models/person')



/* *** SERVICES *** */

  //Default
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  // GET /info
  app.get('/info', (request, response) => {
    /*const hfActual = new Date ()
    hfActual.toUTCString()
    const resume = "<p>Phonebook has info for " +persons.length+ " people.</p><p>"+ hfActual + "</p>"
    response.send(resume)*/
  })

  // GET /api/persons
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

  // GET /api/persons/id
  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  // POST /api/person
  app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log(body)
  
    if (!body.name || !body.phone) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }/*else if(persons.some(i => i.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }*/
  
    const newContact = new Person({
      name: body.name,
      phone: body.phone,
    })
  
    newContact.save().then(savedContact => {
      response.json(savedContact)
    })
  })

  // DELETE /api/persons/id
  app.delete('/api/persons/:id', (request, response) => {
    /*const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()*/
  })

  app.use(unknownEndpoint)


//Levantamos el servidor

const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })