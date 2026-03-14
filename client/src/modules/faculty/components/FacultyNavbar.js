import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './FacultyNavbar.css';

export default function FacultyNavbar({ activeCycle = "PhD 2026", sidebarOpen = false, onToggleSidebar }) {
    const { currentUser, logoutContext } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutContext();
        navigate('/login');
    };

    return (
        <nav className="faculty-navbar">
            {/* Left: Hamburger + Logo + Title */}
            <div className="fn-left">
                {/* ☰ Hamburger */}
                <button
                    className={`fn-hamburger ${sidebarOpen ? 'fn-hamburger--open' : ''}`}
                    onClick={onToggleSidebar}
                    title={sidebarOpen ? 'Close menu' : 'Open menu'}
                    aria-label="Toggle navigation"
                >
                    <span /><span /><span />
                </button>

                <img
                    src="https://www.uxdt.nic.in/wp-content/uploads/2024/06/iit-ropar-01.jpg"
                    alt="IIT Ropar Logo"
                    className="fn-logo"
                />
                <div className="fn-title-group">
                    <h1 className="fn-title">PhD Admission Portal</h1>
                    <p className="fn-subtitle">Department of Mathematics, IIT Ropar</p>
                </div>
                <div className="fn-cycle-badge">Cycle: {activeCycle}</div>

                {/* ← Back to Home */}
                <Link to="/" className="fn-back-home">
                    ← Back to Home
                </Link>
            </div>

            {/* Right: Controls */}
            <div className="fn-right">
                {/* Notification bell */}
                <button className="fn-icon-btn" title="Notifications">
                    🔔
                    <span className="fn-notif-dot" />
                </button>

                {/* Faculty avatar + name */}
                <div className="fn-user">
                    <div className="fn-user-text">
                        <span className="fn-user-name">{currentUser?.name ? `Dr. ${currentUser.name}` : 'Faculty Member'}</span>
                        <span className="fn-user-role">{currentUser?.role || 'Faculty'}</span>
                    </div>
                    <div className="fn-avatar">
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
                    </div>
                </div>

                {/* Single logout button */}
                <button className="fn-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
