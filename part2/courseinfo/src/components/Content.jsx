import Part from './Part'

const Content = ({ parts }) =>  {

  

  const contentPart = parts.map (part => {return <Part key={part.id} part={part}/>})
  console.log(contentPart)

  return (
    <>
      {contentPart}
    </>
  )
}
 

export default Content
