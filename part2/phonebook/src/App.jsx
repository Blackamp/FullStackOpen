import { useState, useEffect} from 'react'
import contactService from './services/contacts'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
  //Estados
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newsearch, setNewSearch] = useState('')
  const [filterState, setFilterState] = useState(false)

  //Get Data with Axios
  useEffect(() => {
    console.log('effect')
    contactService
      .getAll()
      .then(initialContacts => {
        console.log('promise fulfilled:', initialContacts)
        setPersons(initialContacts)
      })
  }, [])

  //Handle Events
  const addContact = (event) => {
    event.preventDefault()

    const newContact = { name: newName, phone: newPhone}

    console.log("Array: ", persons)
    console.log("Nuevo contacto ", newContact)

    if (persons.some(i => i.name.includes(newContact.name)))
        alert(`El contacto ${newName} ya está en la agenda`)
    else{
      contactService
      .create(newContact)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        setNewName('')
        setNewPhone('')
        setNewSearch('')
        setFilterState(false)
      })

    }
  }

  const handleDeleteContact = id => {
    console.log(`handleDelete`)

    const contactToDelete = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${contactToDelete.name} ?`)) {
      console.log(`Delete ${id} now!!!!!!`)
      contactService
        .deleteContact(id)
        .then(returnedContactDeleted => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`The contact '${contactToDelete.name}' couldn't be deleted from server`)
        })
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
      <Filter value={newsearch} handleEvent={handleSearchChange}/>

      <h3>Add a new</h3>
      <PersonForm valueName={newName} handleEventName={handleNameChange} valuePhone={newPhone} handleEventPhone={handlePhoneChange} handleForm={addContact}/>
      
      <h2>Numbers</h2>
      <Persons handleFilter={contactsToShow} handleDelete={handleDeleteContact} />
      
    </div>
  )
}

export default App