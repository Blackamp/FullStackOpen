const express = require('express')
const app = express()

//E3.2


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

// GET /api/persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})


//Levantamos el servidor

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})