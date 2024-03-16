import { useState } from 'react'
import Person from './components/Person'

const App = () => {
  //Estados
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      phone: '667889112' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  //Handle Events
  const addContact = (event) => {
    event.preventDefault()

    const newContact = { name: newName, phone: newPhone }

    console.log("Array: ", persons)
    console.log("Nuevo contacto ", newContact)

    if (persons.some(i => i.name.includes(newContact.name)))
    {
      alert(`El contacto ${newName} ya está en la agenda`)
    }else{
      setPersons(persons.concat(newContact))
      setNewName('')
      setNewPhone('')
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

  return (
    <div>
      <h2>Phonebook</h2>
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
        {persons.map(person =>
          <Person key={person.phone} person={person} />
        )}
      </ul>
    </div>
  )
}

export default App