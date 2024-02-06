import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({courses}) => {

  console.log("Component Course: ",courses) 

  const courseGroup = courses.map (function(item) {
    return (
      <div>
        <Header course={item.name} />
        <Content parts={item.parts} />
        <Total parts={item.parts} />
      </div>
    )
  })

  return (
    <>
      {courseGroup}
    </>
  )
}

export default Course

