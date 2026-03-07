import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/apiCore';
import '../components/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { loginContext } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (res.data.success) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await api.post('/auth/register-verify', {
        email: formData.email,
        otp
      });
      
      if (res.data.success) {
        loginContext(res.data.token, res.data.data);
        // Redirect to their specific dashboard based on role
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
        <h3>Create an Account</h3>
        
        {error && <div className="auth-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleStep1Submit}>
            <div className="form-group role-selector">
              <label>I am registering as a:</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} /> Student
                </label>
                <label>
                  <input type="radio" name="role" value="faculty" checked={formData.role === 'faculty'} onChange={handleChange} /> Faculty
                </label>
                <label>
                  <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} /> Admin
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Register'}
            </button>
            <p className="auth-link">Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit}>
            <p>An OTP has been sent to <strong>{formData.email}</strong></p>
            <div className="form-group">
              <label>Enter OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP & Complete'}
            </button>
            <p className="auth-link" onClick={() => setStep(1)}>Back to Details</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
