import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import anecdotesService from './services/anecdotes'
import { setAllAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {

  const dispatch = useDispatch()
    useEffect(() => {
      anecdotesService.getAll().then(anecdotes => dispatch(setAllAnecdotes(anecdotes)))
      console.log("UseEffect()")
    }, [])


  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter/>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App