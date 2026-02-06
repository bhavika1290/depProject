import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  return (
    <div className="page-card">
      <h2>Student Dashboard</h2>
      <p>Signed in as: {user?.email || 'Unknown'}</p>
      <button onClick={logout}>Sign out</button>
    </div>
  )
}
