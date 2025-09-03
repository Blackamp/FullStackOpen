import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";

import { useApolloClient, useSubscription } from '@apollo/client';
import { BOOK_ADDED, ALL_BOOKS } from './queries'



const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState("");
  const client = useApolloClient()

  
 const updateCacheBooksWith = (addedBook) => {
  const includedIn = (set, object) => 
    set.map(b => b.id).includes(object.id)

  // cache global de Apollo
  const cache = client.cache

  // Actualizamos caché de ALL_BOOKS sin variables (todos)
  try {
    cache.updateQuery({ query: ALL_BOOKS, variables: { genre: null } }, (data) => {
      if (!data) throw new Error("Cache empty")
      if (includedIn(data.allBooks, addedBook)) return data
      return { allBooks: data.allBooks.concat(addedBook) }
    })
  } catch (e) { // Si la query no estaba en caché, la refetcheamos
    client.refetchQueries({
      include: [{ query: ALL_BOOKS, variables: { genre: null } }]
    })
  }

  // Actualizamos caché para cada género
  addedBook.genres.forEach(g => {
    try {
      cache.updateQuery({ query: ALL_BOOKS, variables: { genre: g } }, (data) => {
        if (!data) throw new Error("Cache empty")
        if (includedIn(data.allBooks, addedBook)) return data
        return { allBooks: data.allBooks.concat(addedBook) }
      })
    } catch (e) { // Si la query no estaba en caché, la refetcheamos
      client.refetchQueries({
        include: [{ query: ALL_BOOKS, variables: { genre: g } }]
      })
    }
  })
}

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data.data.bookAdded)
      const newBook = data.data.bookAdded
      notify(`${newBook.title} added`)
      updateCacheBooksWith(newBook)
    },
    onError: (error) => {
      console.log(error)
    }
  })


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }




  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
            <>
              <button onClick={() => setPage("add")}>add book</button>
              <button onClick={() => setPage("recommend")}>recommend</button>
              <button onClick={logout}>logout</button>
            </>
          ) : (
            <button onClick={() => setPage("login")}>login</button>
          )}

      </div>

      <br></br>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === "authors"} token={token} setError={notify}  />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} updateCacheBooksWith={updateCacheBooksWith} setError={notify} />
      <Recommend show={page === "recommend"} setError={notify} />      
      {!token && (
        <LoginForm show={page === "login"} setPage={setPage} setToken={setToken} setError={notify} />  
      )} 
    </div>
  );
};

export default App;