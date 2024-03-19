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
        console.log("Response ", countrySearch.responseCountry)
        const languagesCountry = Object.values(countrySearch.responseCountry.languages)
        return(
            <div>
                <h1>{countrySearch.responseCountry.name.common}</h1>
                <p>Capital: {countrySearch.responseCountry.capital} </p>
                <p>Area: {countrySearch.responseCountry.area} </p>
                <h3>Languages:</h3>
                {languagesCountry.map( l => <li key={l}>{l}</li> )}
                <br></br>
                <img src={countrySearch.responseCountry.flags.png}/>

            </div>
        )
    }

  }
  
  export default CSearch