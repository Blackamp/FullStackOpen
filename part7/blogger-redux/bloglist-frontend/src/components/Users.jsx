import { useState, useEffect } from 'react'
import userService from '../services/users'
import { initializeUsers } from '../reducers/usersReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'


const Users = () => {

  const users = useSelector((state) => state.users) // obtenemos blogs del store
  const dispatch = useDispatch()
  
  //Effect-hook obtener la lista de usuarios
  useEffect(() => {
    dispatch(initializeUsers())
  }, [])


  return (
    <div>
      <h3>Users</h3>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}>
              User
            </th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: "8px" }}>
              blogs created
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                <Link to={`/users/${u.id}`}>{u.name || u.username}</Link>
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                {Array.isArray(u.blogs) ? u.blogs.length : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
