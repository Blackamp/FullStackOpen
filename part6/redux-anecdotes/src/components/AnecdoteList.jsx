import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
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


  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You voted '${anecdote.content}'`,5))
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
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
      )}
    </div>
  )
}

export default AnecdoteList