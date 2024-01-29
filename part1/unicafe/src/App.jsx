import { useState } from 'react'

//Button Component
const Button = ({ handleClick, text })  => {
  return (
  <button onClick={handleClick}> {text} </button>
  )
}

//StadisticsClick Component
const StadisticsClick = (props) => {

  console.log ("props", props)
  const [good, neutral, bad] = props.states;

  return (
    <div>
      <p> Good {good} </p>
      <p> Neutral {neutral} </p>
      <p> Bad {bad} </p>
    </div>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  //Handler
  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral +1 )
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }


  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={handleGoodClick} text="Good" />
      <Button handleClick={handleNeutralClick} text="Neutral" />
      <Button handleClick={handleBadClick} text="Bad" />

      <h1>Stadistics</h1>
      <StadisticsClick states={[good,neutral,bad]} />

    </div>
  )
}

export default App
