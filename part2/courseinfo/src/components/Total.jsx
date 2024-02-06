const Total = ({parts}) => {
    
    console.log("Total ",parts)
    var totalExercise = 0
    parts.forEach(element => { totalExercise += element.exercises});

    return(
      <>
        <p>Number of exercises {totalExercise}</p>
      </>
    )
    
  }

  export default Total
