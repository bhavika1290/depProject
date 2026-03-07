import React, { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    MdDashboard,
    MdCalendarToday,
    MdPeople,
    MdEmail,
    MdLibraryAdd,
    MdAccountCircle,
    MdHelpOutline,
    MdArchive,
    MdPowerSettingsNew
} from 'react-icons/md';
import '../../styles/Admin.css';

const AdminLayout = ({ children }) => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <MdDashboard /> },
        { name: 'Admissions', path: '/admin/admissions', icon: <MdCalendarToday /> },
        { name: 'Admins', path: '/admin/admins', icon: <MdPeople /> },
        { name: 'SendMail', path: '/admin/send-mail', icon: <MdEmail /> },
        { name: 'Templates', path: '/admin/templates', icon: <MdLibraryAdd /> },
        { name: 'Profile', path: '/admin/profile', icon: <MdAccountCircle /> },
        { name: 'How To Use?', path: '/admin/how-to-use', icon: <MdHelpOutline /> },
        { name: 'Archive', path: '/admin/archive', icon: <MdArchive /> },
    ];

    const getPageTitle = () => {
        const current = navItems.find(item => item.path === location.pathname);
        return current ? current.name : 'Admin Portal';
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    Admin Portal
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            end={item.path === '/admin'}
                        >
                            <span className="nav-item-icon">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-title">{getPageTitle()}</div>
                    <div className="header-actions">
                        <span>Welcome, {user?.name || user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="btn-icon"
                            title="Logout"
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}
                        >
                            <MdPowerSettingsNew />
                        </button>
                    </div>
                </header>
                <section className="admin-content">
                    <div className="admin-content-bg"></div>
                    {children}
                </section>

            </main>
        </div>
    );
};

export default AdminLayout;
