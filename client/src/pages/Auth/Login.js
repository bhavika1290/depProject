import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname ||
        (user.role === 'admin' || user.role === 'superadmin' ? '/admin' :
          user.role === 'faculty' ? '/faculty' : '/student');
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      // Redirect based on role or to intended location
      const from = location.state?.from?.pathname ||
        (user.role === 'admin' || user.role === 'superadmin' ? '/admin' :
          user.role === 'faculty' ? '/faculty' : '/student');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div className="page-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>Log in to your account to continue</p>

        {error && <div style={{
          backgroundColor: 'var(--danger-light)', color: 'var(--danger)',
          padding: '12px', borderRadius: 'var(--border-radius)', marginBottom: '20px',
          fontSize: '0.9rem', textAlign: 'center'
        }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create one here</Link>
        </div>
      </div>
    </div>
  );
}
