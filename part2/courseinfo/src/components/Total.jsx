const Total = ({parts}) => {
    
    console.log("Total ",parts)
    /*var totalExercise = 0
    parts.forEach(element => { totalExercise += element.exercises});
    */
    const totalExercise = parts.reduce((count, value) => count + value.exercises, 0)


    return(
      <>
        <p>Number of exercises {totalExercise}</p>
      </>
    )
    
  }

  export default Total
