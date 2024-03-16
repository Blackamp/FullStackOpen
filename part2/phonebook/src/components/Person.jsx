const Person = ({ person }) => {

  //console.log("Component Person ", person)
    return (
      <li>{person.name} | {person.phone}</li>
    )
  }
  
  export default Person