import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{
      backgroundColor: '#ffffff',
      padding: '15px 40px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img
          src="https://www.uxdt.nic.in/wp-content/uploads/2024/06/iit-ropar-01.jpg"
          alt="IIT Ropar official logo"
          style={{ width: '44px', height: '44px', objectFit: 'contain' }}
        />
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
          IIT Ropar Maths Dept
        </Link>
      </div>

      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Home</Link>

        {user ? (
          <>
            <Link to={user.role === 'student' ? '/student' : user.role === 'faculty' ? '/faculty' : '/admin'} style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Dashboard
            </Link>
            <button onClick={logout} style={{
              background: 'transparent', border: '1px solid var(--primary-color)',
              color: 'var(--primary-color)', padding: '8px 16px', borderRadius: '4px',
              cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s'
            }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary-color)'; }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Login</Link>
            <Link to="/register" style={{
              background: 'var(--primary-color)', color: 'white',
              padding: '8px 16px', borderRadius: '4px', textDecoration: 'none',
              fontWeight: 500
            }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
