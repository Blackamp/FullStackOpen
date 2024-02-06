import Header from './Header'
import Content from './Content'

const Course = ({course}) => {

  console.log("Component Course: ",course)  

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

export default Course
