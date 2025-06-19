const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = (state = initialState, action) => {
  //console.log('state now: ', state)
  //console.log('action', action)

  switch(action.type) {
    case 'NEW_ANECDOTE':
      return [...state, action.payload]

    case 'VOTE_ANECD':
      {const id = action.payload.id
      const AnecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = { 
        ...AnecdoteToChange, 
        votes: AnecdoteToChange.votes+1
      }
      return state.map(anecd =>
        anecd.id !== id ? anecd : changedAnecdote 
      )}
    default:
      return state
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content,
      votes: 0,
      id: getId()
    }
  }
}

export const voteAnecdote  = (id) => {
  return {
    type: 'VOTE_ANECD',
    payload: { id }
  }
}  


export default anecdoteReducer