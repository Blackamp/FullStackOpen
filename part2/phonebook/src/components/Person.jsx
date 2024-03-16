const Person = (props) => {

  //console.log("Component Person ", props)

    return (
      <div>
        <li>{props.person.name} / {props.person.phone} |  <button onClick={props.handleDelete}>deleteContact</button></li>
      </div>

     
    )
  }
  
  export default Person