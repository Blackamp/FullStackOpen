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
  const handleAddContact = (event) => {
    event.preventDefault()

    const newContact = { name: newName, phone: newPhone}

    console.log("Array: ", persons)
    console.log("Nuevo contacto ", newContact)

    if (persons.some(i => i.name === newContact.name) && persons.some(i => i.phone === newContact.phone)){
      alert(`El contacto ${newName} ya está en la agenda`)

    }
    else if (persons.some(i => i.name === newContact.name))
    {
      console.log("Update number")
      const contactToUpdate = persons.find(n => n.name === newContact.name)
       
      if (window.confirm(`${contactToUpdate.name} is already added to phonebook, replace the old number with a new one?`)) 
      {
        console.log(`Update ${contactToUpdate.id} now!!!!!!`)

        const changedContact = {...contactToUpdate, phone: newContact.phone}
        
        contactService
          .update(changedContact.id, changedContact)
          .then(returnedContactUpdated => {
            setPersons(persons.map(p => p.id !== changedContact.id ? p : returnedContactUpdated))
          })
          .catch(error => {
            alert(`The contact '${changedContact.name}' was already deleted from server`)
            setPersons(persons.filter(p => p.id !== changedContact.id))
          })
      }
    }
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
      <PersonForm valueName={newName} handleEventName={handleNameChange} valuePhone={newPhone} handleEventPhone={handlePhoneChange} handleForm={handleAddContact}/>
      
      <h2>Numbers</h2>
      <Persons handleFilter={contactsToShow} handleDelete={handleDeleteContact} />
      
    </div>
  )
}

export default App