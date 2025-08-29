import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
  //console.log("Component notification: ", message)

  const message = useSelector((state) => state.notification)

  if (message === null) {
    return null
  } else if (message.includes('Err')) {
    return <Alert severity="error">{message}</Alert >
  } else {
    return <Alert severity="success">{message}</Alert >
  }
}

Notification.propTypes = {
  message: PropTypes.string,
}

export default Notification
