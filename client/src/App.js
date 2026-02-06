import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Public/Home'
import Login from './pages/Auth/Login'
import StudentDashboard from './pages/Student/Dashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<StudentDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
