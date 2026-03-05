import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const { login } = useContext(AuthContext); // Re-use login mechanism to set token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      // Force trigger the AuthContext user reload by reloading the window, redirecting to /student
      window.location.href = '/student';
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);
    try {
      await api.post('/auth/resend-otp', { email });
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  if (!email) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>No email provided for verification. Please register first or sign in.</p>
        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div className="page-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Verify Your Email</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
          We sent a verification code to <strong>{email}</strong>
        </p>

        {error && <div style={{
          backgroundColor: 'var(--danger-light)', color: 'var(--danger)',
          padding: '12px', borderRadius: 'var(--border-radius)', marginBottom: '20px',
          fontSize: '0.9rem', textAlign: 'center'
        }}>{error}</div>}

        {success && <div style={{
          backgroundColor: 'var(--success-light)', color: 'var(--success)',
          padding: '12px', borderRadius: 'var(--border-radius)', marginBottom: '20px',
          fontSize: '0.9rem', textAlign: 'center'
        }}>&#10003; {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label>6-Digit OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              placeholder="Enter OTP"
              style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
            />
          </div>
          <button type="submit" disabled={loading || !otp} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Didn't receive the code? <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Resend OTP</button>
        </div>
      </div>
    </div>
  );
}
