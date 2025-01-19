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



//Contactos iniciales
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]


/* *** SERVICES *** */

  //Default
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  // GET /info
  app.get('/info', (request, response) => {
    const hfActual = new Date ()
    hfActual.toUTCString()
    const resume = "<p>Phonebook has info for " +persons.length+ " people.</p><p>"+ hfActual + "</p>"
    response.send(resume)
  })

  // GET /api/persons
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  // GET /api/persons/id
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.find(p => p.id === id)
    console.log("ID:", id, " Contact:", contact)
    if (contact) {
      response.json(contact)
    } else {
      response.status(404).end()
    }
  })

  // POST /api/person
  const generateId = () => {
    const newId = Math.floor(Math.random()* (9999999 - 1) + 1);
    return newId
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log(body)
  
    if (!body.name || !body.phone) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }else if(persons.some(i => i.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const newContact = {
      name: body.name,
      phone: body.phone,
      id: generateId(),
    }
  
    persons = persons.concat(newContact)
    response.json(newContact)
  })

  // DELETE /api/persons/id
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

  app.use(unknownEndpoint)


//Levantamos el servidor
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })