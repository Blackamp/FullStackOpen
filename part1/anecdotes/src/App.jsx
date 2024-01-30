import { useState } from 'react'


//Button Component
const Button = ({ handleClick, text })  => {
  return (
  <button onClick={handleClick}> {text} </button>
  )
}

//DisplayAnecdote Component
const DisplayAnecdote = (props)  => {
  return (
    <div>
      <p>{props.arrayAnecdotes[props.index]}</p> 
      <p>This anecdote has {props.arrayVotes[props.index]} votes</p> 
    </div>
  )
}



const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]


  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))


    //Handler
    const handleAnecdoteClick = (selectedNow,max) => {

      var randomAnecdote = 0

      do{
         randomAnecdote = Math.floor(Math.random() * max)
         //console.log("Número anécdota anterior:"+selectedNow)
         //console.log("Número aleatorio:"+randomAnecdote)
      }while (selectedNow ==randomAnecdote )
  
      setSelected(randomAnecdote)
    }

    //Handler
    const handleVote = (selectedNow,arrayVotes) => {
      const copyVotes = [...arrayVotes]
      copyVotes[selectedNow] += 1
      setVotes(copyVotes)
    }

    console.log(votes)

  return (
    <div>
      <DisplayAnecdote arrayAnecdotes={anecdotes} index={selected} arrayVotes={votes}/>
      <Button handleClick={() => handleVote(selected,votes)} text="Vote"/>
      <Button handleClick={() => handleAnecdoteClick(selected,anecdotes.length)} text="Next anecdote"/>
    </div>
  )
}

export default App