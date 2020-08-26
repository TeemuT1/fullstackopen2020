import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Filter = (props) => {
  const { countryFilter, handleCountryFilterChange } = props
return(
  <input value = {countryFilter}
      onChange= {handleCountryFilterChange}
  />)

}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Country = (props) => {
  const { country, fullInfo, setCountryFilter } = props
  if(fullInfo) {
    return(
      <div>
        <h1>{country.name}</h1>

          <div>capital {country.capital}</div>
          <div>population {country.population}</div>

        <h2>languages</h2>
        <ul>
          {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
        </ul>
        <div>
          <img src={country.flag} alt={country.name} width={150}/>
        </div>
      </div>
    )
  }
  return(
    <div>
      {country.name}
      <Button handleClick={() => setCountryFilter(country.name)} text="show"/>
    </div>
  )
}

const Countries = (props) => {
  const { countries, countryFilter, setCountryFilter } = props

  const filterCountries = (country) => {
    return (country.name.toLowerCase().indexOf(countryFilter.toLowerCase()) !== -1)
  }
  const filteredCountries = countries.filter(filterCountries)
  
  if(filteredCountries.length > 10) {
    return(
      <div>Too many matches, specify another filter</div>
    )
  } else if(filteredCountries.length === 1) {
    return(
      <Country country={filteredCountries[0]} fullInfo={true} />
    )
  } else {
  return(
    <div>
      {filteredCountries.map(country => 
      <Country key={country.name} country={country} setCountryFilter={setCountryFilter}/>
    )}
    </div>
  )
  }
}

const App = () => {
  const [ countries, setCountries ] = useState([]) 
  const [ countryFilter, setCountryFilter ] = useState('')

  const handleCountryFilterChange = (event) => {
    setCountryFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <p>
        find countries
        <Filter countryFilter={countryFilter} handleCountryFilterChange={handleCountryFilterChange} />
      </p>
        <Countries countries={countries} countryFilter={countryFilter} setCountryFilter={setCountryFilter}/>

    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
