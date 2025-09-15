
//-------------
//INTERFACES
//-------------
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseExt extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBaseExt {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBaseExt {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartBaseExt {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface ContentProps {
  parts: CoursePart[];
}



//-------------
//COMPONENTS
//-------------
const Header = (props: {name: string}) => {
  return (
    <>
      <h1>
        {props.name}
      </h1>
    </>
  )
  
}


/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};


//Al indicar que los props es de CoursePart, el componente espera recibir cada elemento de CoursePart como props individuales.
const Part  = (props: CoursePart) => {

  switch (props.kind) {
    case "basic":
      return (
        <div>
          <p><strong>{props.name} {props.exerciseCount}</strong></p>
          <p><i>{props.description}</i></p>
        </div>
      );
    case "group":
      return (
        <div>
          <p><strong>{props.name} {props.exerciseCount}</strong></p>
          <p>Project exercises {props.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <p><strong>{props.name} {props.exerciseCount}</strong></p>
          <p><i>{props.description}</i></p>
          <p>Background material: {props.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <p><strong>{props.name} {props.exerciseCount}</strong></p>
          <p><i>{props.description}</i></p>
          <p>Required Skils: {props.requirements.join(", ")}</p>
        </div>
      );
    default:
      return assertNever(props);
  }
}


const Content = ({ parts }: ContentProps) => {
  //El spread operator {...} desempaqueta todas las propiedades del objeto y las pasa como props individuales.
  return(
    <div>
      {parts.map(part => (
        <Part key={part.name} {...part} />))} 
    </div>    
  )
}

const Total = ( props: {totalExercises: number }) => {
  //console.log("Total "+props)
  return(
    <>
      <p>Number of exercises {props.totalExercises}</p>
    </>
  )  
}


//-------------
// APP
//-------------
const App = () => {

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];
  const courseName = "Half Stack application development";


  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

    return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <br />
      <Total totalExercises={totalExercises} />
    </div>
  );

};

export default App;