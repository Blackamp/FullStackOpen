import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setLogIn } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'

const LoginForm = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    await dispatch(setLogIn(username, password))
    navigate('/')
  }
  
  return (
    <div>
      <h2>Credentials</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
