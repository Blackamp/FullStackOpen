const PersonForm = (props) => {

    return (
        <form onSubmit={props.handleForm}>
            <div>
                name: <input value={props.valueName} onChange={props.handleEventName} />
            </div>
            <div>
                phone: <input value={props.valuePhone} onChange={props.handleEventPhone} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
  }
  
  export default PersonForm



