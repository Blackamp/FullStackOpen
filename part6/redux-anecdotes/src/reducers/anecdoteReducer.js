import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

/*const anecdotesAtStart = [
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

const initialState = anecdotesAtStart.map(asObject)*/

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendOneAnecdote(state, action) {
      state.push(action.payload)
    },
    setAllAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      const changedAnecdote = action.payload
      return state.map(anecd =>
        anecd.id !== changedAnecdote.id ? anecd : changedAnecdote 
      )  
    }
  },
})


export const { appendOneAnecdote, setAllAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAllAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendOneAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) =>  {
  return async dispatch => {
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const updated = await anecdotesService.updateAnecd(changedAnecdote)
    dispatch(updateAnecdote(updated))
  }
}

export default anecdoteSlice.reducer