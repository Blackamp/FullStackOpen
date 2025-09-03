import { useState } from 'react'
import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from '../queries'
import {  useQuery, useMutation, useApolloClient } from '@apollo/client'


const Books = (props) => {

  const [filterGenre, setFilterGenre] = useState(null)

  const resultBooks =  useQuery(ALL_BOOKS, {
    variables: { genre: filterGenre }
  })
  const resultGenres =  useQuery(ALL_GENRES);

  if (!props.show) return null
  if (resultBooks.loading || resultGenres.loading) return <div>Loading...</div>;
  if (resultBooks.error) return <div>Error loading books: {resultBooks.error.message}</div>;
  if (resultGenres.error) return <div>Error loading genres: {resultGenres.error.message}</div>;


  
  const books = resultBooks.data.allBooks
  const uniqueGenres = resultGenres.data.allGenres
  //console.log(uniqueGenres)

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      {uniqueGenres.map((g) =>(
        <button key={g} onClick={() => setFilterGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setFilterGenre(null)}>All</button>
    </div>
  )
}

export default Books
