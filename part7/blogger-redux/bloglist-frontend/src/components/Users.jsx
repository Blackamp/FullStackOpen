import { useState, useEffect } from 'react'
import userService from '../services/users'
import { initializeUsers } from '../reducers/usersReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { Container, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'


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
      <TableContainer component={Paper}>
        <Table style={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}>
                User
              </TableCell>
              <TableCell style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: "8px" }}>
                blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                  <Link to={`/users/${u.id}`}>{u.name || u.username}</Link>
                </TableCell>
                <TableCell style={{ padding: "8px", borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                  {Array.isArray(u.blogs) ? u.blogs.length : 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
