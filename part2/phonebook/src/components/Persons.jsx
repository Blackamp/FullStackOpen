import Person from './Person'

const Persons = (props) => {

      return (
        <ul>
            {props.handleFilter.map(person =>
            <Person key={person.id} person={person} handleDelete={() => props.handleDelete(person.id)} />
            )}
        </ul>
      )
    }
    
    export default Persons






