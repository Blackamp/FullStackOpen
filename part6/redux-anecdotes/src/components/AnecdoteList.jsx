import { voteAnecdote } from '../reducers/anecdoteReducer'
import { sendNotification, deleteNotification  } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () =>{

  const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) =>
    filter === ''
        ? anecdotes
        : anecdotes.filter(a =>
            a.content.toLowerCase().includes(filter.toLowerCase())
        )
    )


  const vote = (id, content) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))
    //dispatch({ type: 'anecdotes/voteAnecdote', payload: id })
    const message = "You voted '" +content+"'"
    dispatch(sendNotification(message))
    setTimeout(() => {dispatch(deleteNotification())}, 5000)  
  }

  return(
    <div>
      {[...anecdotes] // Para que el array del estado permanezca inmutable, creamos una copia y la ordenamos
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
            </div>
          </div>
      )}
    </div>
  )
}

export default AnecdoteList