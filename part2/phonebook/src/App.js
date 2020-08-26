import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import personService from './services/persons'

const Filter = (props) => {
  const { nameFilter, handleNameFilterChange } = props
  return(
    <input value = {nameFilter}
      onChange= {handleNameFilterChange}
  />
  )
}

const Person = (props) => {
  const { person, nameFilter, deletePerson } = props
  if(person.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1){
  return(
    <div>
      {person.name} {person.number} 
      <button onClick={() => 
        {if(window.confirm(`Delete ${person.name}?`))deletePerson(person.id)}}>delete
      </button>
    </div>
  )
  } else {
    return(<></>)
  }
}

const Persons = (props) => {
  const { persons, nameFilter, deletePerson} = props
  return(
    <div>
      {persons.map(person => 
    <Person key={person.name} person={person} nameFilter={nameFilter} deletePerson={deletePerson}/>
    )}
    </div>
  )
}

const PersonForm = (props) => {
  const { addPerson, newName, handleNameChange, newNumber, handleNumberChange } = props
  return(
    <form onSubmit={addPerson}>
      <div>
        name: 
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: 
        <input 
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ nameFilter, setNameFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    //if person exists, ask if update number
    if(person) {
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {       
        const personObject = { ...person, number: newNumber }
        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(per => per.name !== person.name ? per : returnedPerson))
            setNewName('')
            setNewNumber('')

            setMessageType('success')
            setErrorMessage(
              `Updated the phone number of '${person.name}'`
            )
            
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)   
          })
          .catch(error => {
            setMessageType('error')
            setErrorMessage(
              `Information of '${person.name}' has already been removed from the server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)   
          })
      } 
      
    }
    //if person does not exist yet, create a new person
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')

          setMessageType('success')
          setErrorMessage(
            `Added '${returnedPerson.name}'`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)   
        })
    }
  }

  const deletePerson = (id) => {
      personService
        .del(id)
        .then(() =>  {
          setPersons(persons.filter(p => p.id !== id))
          setMessageType('success')
          setErrorMessage(
            `Deleted successfully`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)   
        })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleNameFilterChange = (event) => {
    console.log(event.target.value)
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} messageType={messageType} />
      filter shown with
      <Filter nameFilter={nameFilter} handleNameFilterChange={handleNameFilterChange} />
      
      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={persons} nameFilter={nameFilter} deletePerson ={deletePerson} />
    </div>
  )
}

export default App
