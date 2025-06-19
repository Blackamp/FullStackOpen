import { createAnecdote } from '../reducers/anecdoteReducer'
import { sendNotification, deleteNotification  } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const AnecdoteForm = () =>{

  const dispatch = useDispatch()
  
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    const message = "A new anecdoted created '" +content+"'"
    dispatch(sendNotification(message))
    setTimeout(() => {dispatch(deleteNotification())}, 5000)  
  }

  return (
      <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
            <div><input name="anecdote"/></div>
            <button type="submit">create</button>
        </form>
      </div>
    )
}

export default AnecdoteForm