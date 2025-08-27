import { useNotificationValue } from '../context/NotificationContext'

const Notification = () => {
  //console.log("Component notification: ", message)

  const message = useNotificationValue()

  if (message === null) {
    return null
  } else if (message.includes('Err')) {
    return <div className="error">{message}</div>
  } else {
    return <div className="notificationSuccess">{message}</div>
  }
}

export default Notification
