const express = require('express')
const app = express()
app.use(express.json()) // Necesario para express use y trabaje con JSON


//E3.5 & E3.6


//Contactos iniciales
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


/* *** SERVICES *** */

// GET /info
app.get('/info', (request, response) => {
  const hfActual = new Date ()
  hfActual.toUTCString()
  const resume = "<p>Phonebook has info for " +persons.length+ " people.</p><p>"+ hfActual + "</p>"
  response.send(resume)
})

// GET /api/persons (ALL)
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// POST /api/person
const generateId = () => {
  const newId = Math.floor(Math.random()* (9999999 - 1) + 1);
  return newId
}
  
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log("",body)
 
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


//GET /api/persons/id 
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.find(p => p.id === id)
    
    if (contact) {
      response.json(contact)
    } else {
      response.status(404).end()
    }
  })


// DELETE /api/persons/id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  })



//Levantamos el servidor
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})