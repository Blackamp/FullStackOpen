const Notification = ({ message }) => {

    //console.log("Component notification: ", message)
    
    if (message === null) {
      return null
    
    }else if (message.includes("Err")) {
        return (
            <div className="error">
                {message}
            </div>
            )

    }else{
        return (
        <div className="notificationSuccess">
            {message}
        </div>
        )
    }
  }
  
  export default Notification