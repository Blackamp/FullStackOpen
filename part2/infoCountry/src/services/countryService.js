import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getAll = () => {
  console.log("getAll AXIOS")
  const request = axios.get(`${baseUrl}/all/`)
  return request.then(response => response.data)
}

const getCountry = (nameCountry) => {
  console.log("getCountry AXIOS")
  const request = axios.get(`${baseUrl}/name/${nameCountry}`)
  return request.then(response => response.data)
}

const getWeather = (nameCountry) => {
  console.log("getWeather ",nameCountry)
  const api_key = import.meta.env.VITE_SOME_KEY
  console.log("API ",api_key)
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${nameCountry}&appid=${api_key}&&units=metric`)
  return request.then(response => response.data)
}

export default { getAll, getCountry, getWeather }