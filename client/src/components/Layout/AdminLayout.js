import React from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

const AdminLayout = () => {
    const { logoutContext, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logoutContext();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <MdDashboard /> },
        { name: 'Admissions', path: '/admin/admissions', icon: <MdCalendarToday /> },
        { name: 'Audit Results', path: '/admin/audit', icon: <MdArchive /> },
        { name: 'Faculties', path: '/admin/faculties', icon: <MdPeople /> },
        { name: 'SendMail', path: '/admin/send-mail', icon: <MdEmail /> },
        { name: 'Templates', path: '/admin/templates', icon: <MdLibraryAdd /> },
        { name: 'Profile', path: '/admin/profile', icon: <MdAccountCircle /> },
        { name: 'How To Use?', path: '/admin/how-to-use', icon: <MdHelpOutline /> },
        { name: 'Archive', path: '/admin/archive', icon: <MdArchive /> },
    ];

    const getPageTitle = () => {
        const current = navItems.find(item => {
            if (item.path === '/admin') return location.pathname === '/admin';
            return location.pathname.startsWith(item.path);
        });
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
                        <button
                            onClick={handleLogout}
                            className="btn-icon"
                            title="Logout"
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.8rem', display: 'flex', alignItems: 'center' }}
                        >
                            <MdPowerSettingsNew />
                        </button>
                    </div>
                </header>
                <section className="admin-content">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminLayout;
