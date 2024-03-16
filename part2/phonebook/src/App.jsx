import { useState } from 'react'
import Person from './components/Person'

const App = () => {
  //Estados
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phone: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phone: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phone: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newsearch, setNewSearch] = useState('')
  const [filterState, setFilterState] = useState(false)

  //Handle Events
  const addContact = (event) => {
    event.preventDefault()

    const newContact = { name: newName, phone: newPhone, id:persons.length+1 }

    console.log("Array: ", persons)
    console.log("Nuevo contacto ", newContact)

    if (persons.some(i => i.name.includes(newContact.name)))
    {
      alert(`El contacto ${newName} ya está en la agenda`)
    }else{
      setPersons(persons.concat(newContact))
      setNewName('')
      setNewPhone('')
      setNewSearch('')
      setFilterState(false)
    }
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    //console.log(event.target.value)
    setNewPhone(event.target.value)
  }

  const handleSearchChange = (event) => {
    //console.log(event.target.value)
    setNewSearch(event.target.value)
    setFilterState(true)
  }

  
  const contactsToShow = filterState
  ? persons.filter(person => person.name.includes(newsearch))
  : persons
  
  
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={newsearch} onChange={handleSearchChange} /> 
      </div>
      <br></br>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          phone: <input value={newPhone} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {contactsToShow.map(person =>
          <Person key={person.phone} person={person} />
        )}
      </ul>
    </div>
  )
}

export default App