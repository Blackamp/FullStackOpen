
import Notification from './components/Notification'
import DiaryFlightEntryForm from './components/DiaryFlightEntryForm'
import DiaryFlightList from './components/DiaryFlightList'



function App() {

  return (
    <div>
      <h1>Flight Diary App</h1>
      <h2>Add new entry</h2>
      <Notification />
      <DiaryFlightEntryForm />
      <br />
      <br />
      <h2>Diary Entries</h2>
      <DiaryFlightList />
    </div>

  )
}

export default App
