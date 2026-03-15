import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css'; // We will create this

export default function Header() {
  const { currentUser, logoutContext } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo-section">
          <img
            src="https://www.uxdt.nic.in/wp-content/uploads/2024/06/iit-ropar-01.jpg"
            alt="IIT Ropar official logo"
            className="header-logo-img"
          />
          <Link to="/" className="header-brand">
            <span className="brand-title">IIT Ropar</span>
            <span className="brand-subtitle">Department of Mathematics</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/how-to-apply" className={`nav-link ${location.pathname === '/how-to-apply' ? 'active' : ''}`}>How to Apply</Link>
          <Link to="/openings" className={`nav-link ${location.pathname === '/openings' ? 'active' : ''}`}>Openings</Link>
          <Link to="/more-info" className={`nav-link ${location.pathname === '/more-info' ? 'active' : ''}`}>More Info</Link>
          <Link to="/faqs" className={`nav-link ${location.pathname === '/faqs' ? 'active' : ''}`}>FAQs</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>

          <div className="header-actions">
            {currentUser ? (
              <>
                <Link to={currentUser.role === 'student' ? '/student' : currentUser.role === 'faculty' ? '/faculty' : '/admin'} className="btn-modern-outline">
                  Dashboard
                </Link>
                <button onClick={logoutContext} className="btn-modern-outline logout-btn">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-modern-outline">Login</Link>
                <Link to="/register" className="btn-modern-solid">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
