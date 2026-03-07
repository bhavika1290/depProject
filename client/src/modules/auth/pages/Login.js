import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/apiCore';
import '../components/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { loginContext } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // Default dropdown selection
  });
  
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (res.data.success) {
        setStep(2); // Move to OTP input
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await api.post('/auth/login-verify', {
        email: formData.email,
        otp
      });
      
      if (res.data.success) {
        loginContext(res.data.token, res.data.data);
        navigate(`/${formData.role}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>PhD Admission Portal</h2>
        <h3>Welcome Back</h3>
        
        {error && <div className="auth-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleStep1Submit}>
            <div className="form-group role-selector">
              <label>Login As:</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-control">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Login'}
            </button>
            <p className="auth-link">Don't have an account? <span onClick={() => navigate('/register')}>Sign Up</span></p>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit}>
            <p>A verification OTP has been sent to your email.</p>
            <div className="form-group">
              <label>Enter OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            <p className="auth-link" onClick={() => setStep(1)}>Cancel</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
