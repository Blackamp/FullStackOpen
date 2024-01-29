import { useState } from 'react'

//Button Component
const Button = ({ handleClick, text })  => {
  return (
  <button onClick={handleClick}> {text} </button>
  )
}

//StadisticsLine Component
const StatisticLine  = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td><td>{value}</td>
    </tr>
  )
}

//StadisticsComments Component 
const StadisticsComments = (props) => {

  console.log ("props", props)
  const [good, neutral, bad] = props.states;
  const all = good + neutral + bad

  if (all > 0){
    return (
      <table>
        <tbody>
          <StatisticLine text="Good" value={good}/>
          <StatisticLine text="Neutral" value={neutral}/>
          <StatisticLine text="Bad" value={bad}/>
          <StatisticLine text="All" value={all}/>
          <StatisticLine text="Average" value={(good*1 + neutral*0 + bad*-1)/all}/>
          <StatisticLine text="Positive" value={(good/all)*100+"%"}/>
        </tbody>
      </table>
    )
  }else{
    return (
      <div>
        <p> No feedback given </p>
      </div>
    )
  }
}

const App = () => {

  console.log("Versión 1.10")

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
