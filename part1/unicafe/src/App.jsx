import { useState } from 'react'

//Button Component
const Button = ({ handleClick, text })  => {
  return (
  <button onClick={handleClick}> {text} </button>
  )
}

//StadisticsComments Component 
const StadisticsComments = (props) => {

  console.log ("props", props)
  const [good, neutral, bad] = props.states;
  const all = good + neutral + bad

  return (
    <div>
      <p> Good {good} </p>
      <p> Neutral {neutral} </p>
      <p> Bad {bad} </p>
      <p> All {all} </p>
      <p> Average {(good*1 + neutral*0 + bad*-1)/all} </p>
      <p> Average {(good/all)*100} %</p>
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
      <StadisticsComments states={[good,neutral,bad]} />

    </div>
  )
}

export default App
