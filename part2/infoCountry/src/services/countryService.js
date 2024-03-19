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

export default { getAll, getCountry }