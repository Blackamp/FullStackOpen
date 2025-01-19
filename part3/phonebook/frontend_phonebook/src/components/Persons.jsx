const Persons = (props) => {

      return (
        <ul>
            {props.persons.map(person =>
              <li key={person.id}> {person.name} / {person.phone} |  <button onClick={() => props.handleDelete(person.id)}>deleteContact</button></li>
            )}
            
        </ul>
      )
    }
    
    export default Persons






