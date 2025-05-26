import PropTypes from 'prop-types'

const Notification = ({ message }) => {

  //console.log("Component notification: ", message)

  if (message === null) {
    return null

  }else if (message.includes('Err')) {
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

Notification.propTypes = {
  message: PropTypes.string
}


export default Notification