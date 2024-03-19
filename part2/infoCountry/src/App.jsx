import { useState, useEffect } from 'react'
import countryService from './services/countryService'
import CSearch from './components/CSearch'

function App() {
  const [countrySearch, setCountrySearch] = useState({
    control: 0,
    message: '',
    namesSearch: [],
    responseCountry: null
  })
  const [allCountry, setAllCountry] = useState(null)

  useEffect(() => {
    console.log('effect')
    countryService
    .getAll()
    .then(infoCountries => {
      console.log("Info de países obtenida")
      setAllCountry(infoCountries)
    })
  }, [])

  console.log('Countries: ', allCountry)

    // no renderizar nada si allCountry aún es null
    if (!allCountry) { 
      return null 
    }


  //Handle events
  const handleCountryChange = (event) => {

    const countriesfiltered = allCountry.filter(c => c.name.common.toLowerCase().includes(event.target.value.toLowerCase()))

    if(countriesfiltered.length > 10){
      console.log("+10")
      
      const newCountrySearch ={
        control: 1,
        message: "Too many matches, specify another filter",
        namesSearch: [],
        responseCountry: null
      }
      setCountrySearch(newCountrySearch)
      
    }else if(countriesfiltered.length > 1 && countriesfiltered.length < 11){
      console.log("1-10")
      const namesCountry = []
      countriesfiltered.map(c => namesCountry.push(c.name.common))
      console.log("NAMES", namesCountry)

      const newCountrySearch ={
        control: 2,
        message: '',
        namesSearch: namesCountry,
        responseCountry: null
      }
      setCountrySearch(newCountrySearch)

    }else if(countriesfiltered.length == 1 ){
      console.log("1: ", countriesfiltered[0].name.common)
      countryService
        .getCountry(countriesfiltered[0].name.common)
        .then(response => {
          console.log("Respuesta país recibida", response)
          const newCountrySearch ={
            control: 3,
            message: '',
            namesSearch: [],
            responseCountry: response
          }
          setCountrySearch(newCountrySearch)
        })
    }    
  }

  const handleClickShow = (nameCountrySelected) => {

    console.log("Click: ", nameCountrySelected)
    countryService
      .getCountry(nameCountrySelected)
      .then(response => {
        console.log("Respuesta país recibida", response)
        const newCountrySearch ={
          control: 3,
          message: '',
          namesSearch: [],
          responseCountry: response
        }
        setCountrySearch(newCountrySearch)
      })   
  }

  return (
    <div>
      <div>
        Find countries <input onChange={handleCountryChange} />  
      </div>
        <CSearch dataSearch={countrySearch} handleClick={handleClickShow}/>
    </div>
  )
}

export default App
