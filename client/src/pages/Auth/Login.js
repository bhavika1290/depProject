import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

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
    setError(null);

    try {
      const signedInUser = await login(email, password);
      const from = location.state?.from?.pathname ||
        (signedInUser.role === 'admin' || signedInUser.role === 'superadmin' ? '/admin' :
          signedInUser.role === 'faculty' ? '/faculty' : '/student');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-shell animate-fade-in">
      <div className="login-card">
        <section className="login-brand-panel">
          <span className="login-kicker">Admissions Portal</span>
          <h2>Welcome Back</h2>
          <p>
            Access your application dashboard, profile progress, and admission updates in one place.
          </p>
          <ul className="login-points">
            <li>Track application status in real time</li>
            <li>Manage profile and documents securely</li>
            <li>Get institute communication quickly</li>
          </ul>
        </section>

        <section className="login-form-panel">
          <h3>Sign in to continue</h3>
          <p className="login-form-subtitle">Use your registered email and password.</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group login-password-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary login-submit-btn">
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer-link">
            New applicant? <Link to="/register">Create your account</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
