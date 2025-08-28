import { useState, useEffect } from 'react'
import userService from '../services/users'
import { initializeUsers } from '../reducers/usersReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom'


const User = () => {

  const users = useSelector((state) => state.users) // obtenemos blogs del store
  const useriD = useParams().id
  const userSeleted = users.find((u) => u.id === useriD)
  
  if (!userSeleted) {
    return <p>Usuario no encontrado...</p>
  }

  return (
    <div>
      <h2>{userSeleted.name || userSeleted.username}</h2>
      <h3>Blogs creados</h3>
      {userSeleted.blogs.length === 0 ? (
        <p>No ha creado blogs</p>
      ) : (
        <ul>
          {userSeleted.blogs.map(b => (
            <li key={b.id}>{b.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default User
