import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const Notification = () => {
  //console.log("Component notification: ", message)

  const message = useSelector((state) => state.notification)

  if (message === null) {
    return null
  } else if (message.includes('Err')) {
    return <div className="error">{message}</div>
  } else {
    return <div className="notificationSuccess">{message}</div>
  }
}

Notification.propTypes = {
  message: PropTypes.string,
}

export default Notification
