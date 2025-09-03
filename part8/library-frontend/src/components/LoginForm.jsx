import { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'


const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
      onError: (error) => {
        console.log("ERROR LOGIN")
        console.log(error)
        const message =
          error.graphQLErrors?.[0]?.message ||
          error.networkError?.result?.errors?.[0]?.message ||
          error.message;
        console.log("Error message:", message);
        props.setError(message)
      }
    })

  useEffect(() => {
    if ( result.data ) {
    const token = result.data.login.value
    props.setToken(token)
    props.setPage("authors")
    localStorage.setItem('phonenumbers-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

    if (!props.show) {
    return null
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    await login({variables: {username: username, password: password}})

  }
  
  return (
    <div>
      <h2>Credentials</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
