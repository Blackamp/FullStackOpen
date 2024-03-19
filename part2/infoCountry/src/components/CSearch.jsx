const CSearch = (props) => {

  console.log("COMPONENT CSearch", props.dataSearch)

  const countrySearch = props.dataSearch

 if(countrySearch.control === 1){
    return (
      <p>
        {countrySearch.message}
      </p>
    )
  }
  else if(countrySearch.control === 2)
  {
    console.log("CS lista", countrySearch.namesSearch)
    return (
        <div>
          {countrySearch.namesSearch.map(nc => <div key={nc}>{nc}  <button onClick={() => props.handleClick(nc)}>Show</button></div>)}
        </div>
      )
  
  }
  else if(countrySearch.control === 3)
  {
      console.log("Response Country ", countrySearch.responseCountry)
      console.log("Response Weather ", props.weatherCity)
      const languagesCountry = Object.values(countrySearch.responseCountry.languages)

      if(props.weatherCity !== null)
      {
        console.log(countrySearch.responseCountry.capital + "===" + props.weatherCity.name)

        if(countrySearch.responseCountry.capital == props.weatherCity.name) 
        {
          return(
              <div>
                  <h1>{countrySearch.responseCountry.name.common}</h1>
                  <p>Capital: {countrySearch.responseCountry.capital} </p>
                  <p>Area: {countrySearch.responseCountry.area} </p>
                  <h3>Languages:</h3>
                  {languagesCountry.map( l => <li key={l}>{l}</li> )}
                  <br></br>
                  <img src={countrySearch.responseCountry.flags.png}/>

                  <h3>Weather in {countrySearch.responseCountry.capital}</h3>

                  <p> Temperature: {props.weatherCity.main.temp}</p>
                  <img src={`https://openweathermap.org/img/wn/${props.weatherCity.weather[0].icon}@2x.png`}/>
                  <p> Wind: {props.weatherCity.wind.speed}m/s</p>
              </div>
          )
        } else {
          return(
            <div>
                <h1>{countrySearch.responseCountry.name.common}</h1>
                <p>Capital: {countrySearch.responseCountry.capital} </p>
                <p>Area: {countrySearch.responseCountry.area} </p>
                <h3>Languages:</h3>
                {languagesCountry.map( l => <li key={l}>{l}</li> )}
                <br></br>
                <img src={countrySearch.responseCountry.flags.png}/>

                <p>Loading weather...</p>
            </div>
          )
        }
      }
  }

}

export default CSearch