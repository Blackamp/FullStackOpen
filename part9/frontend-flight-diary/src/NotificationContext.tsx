import { createContext, useReducer, useContext } from 'react'
import type { ReactNode, Dispatch } from 'react'

interface MessageAction {
  type: 'message'
  payload: string
}

interface DeleteNotificationAction {
  type: 'deleteNotification'
}

type NotificationAction = MessageAction | DeleteNotificationAction
type NotificationState = string | null // El estado es un string o null (mensaje de notificación o nada)

// Props del Provider
interface NotificationProviderProps {
  children: ReactNode
}

const  notificationReducer = (_state: NotificationState, action: NotificationAction) : NotificationState => {
  switch (action.type) {
    case "message":
        return action.payload
    case "deleteNotification":
        return null
    default:
      throw new Error('Unknown action type')
  }
}

//const NotificationContext = createContext()
// Context tipado
const NotificationContext = createContext<[NotificationState, Dispatch<NotificationAction>] | null>(null)

export const NotificationContextProvider = (props: NotificationProviderProps) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  if (!notificationAndDispatch) throw new Error('useNotificationValue must be used within a NotificationContextProvider')
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  if (!notificationAndDispatch) throw new Error('useNotificationDispatch must be used within a NotificationContextProvider')
  return notificationAndDispatch[1]
}

export default NotificationContext