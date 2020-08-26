import React from 'react'

const Course = (props) => {
    const {course} = props
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
  const Header = (props) => {
    return (
      <div>
        <h3>
          {props.course}
        </h3>
      </div>
    )
  }
  
  const Content = (props) => {
    const { parts } = props
    return (
      <div>
          {parts.map(part =>
            <Part key={part.id} part={part} />
          )}
  
      </div>
    )
  }
  
  const Total = (props) => {
    const { parts } = props
    const total = parts.reduce((sum, part) => {
      return sum + part.exercises
    },0)
    return (
      <div>
        <p>
          <b>total of {total} exercises</b>
        </p>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>
          {props.part.name} {props.part.exercises}
        </p>
      </div>
    )
  }

  export default Course
  