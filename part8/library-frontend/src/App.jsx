import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";

import { useApolloClient } from '@apollo/client';



const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState("");
  const client = useApolloClient()

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
      <NewBook show={page === "add"} setError={notify} />
      <Recommend show={page === "recommend"} setError={notify} />      
      {!token && (
        <LoginForm show={page === "login"} setPage={setPage} setToken={setToken} setError={notify} />  
      )} 
    </div>
  );
};

export default App;