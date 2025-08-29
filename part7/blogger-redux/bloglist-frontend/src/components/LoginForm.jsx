import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setLogIn } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { Box, FormControl, InputLabel, Input, InputAdornment, Button } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';



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

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300, margin: 'auto', mt: 10 }}
      >
        <FormControl variant="standard">
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </div>
  )
}

export default LoginForm
