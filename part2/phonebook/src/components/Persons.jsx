import Person from './Person'

const Persons = (props) => {

      return (
        <ul>
            {props.handleFilter.map(person =>
            <Person key={person.phone} person={person} />
            )}
        </ul>
      )
    }
    
    export default Persons






