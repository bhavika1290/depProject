import React from 'react';
import { NavLink } from 'react-router-dom';

export default function FacultySidebar() {
    const navItems = [
        { path: '/faculty', label: 'Dashboard', icon: '📊' },
        { path: '/faculty/openings/create', label: 'Create Opening', icon: '➕' },
        { path: '/faculty/openings', label: 'My Openings', icon: '📋' },
        { path: '/faculty/applicants', label: 'Applicants', icon: '🧑‍🎓' },
        { path: '/faculty/applicants/filter', label: 'Filter & Sort', icon: '🔍' },
        { path: '/faculty/shortlisted', label: 'Shortlisted Candidates', icon: '⭐' },
        { path: '/faculty/recommendations', label: 'Final Recommendations', icon: '✅' },
        { path: '/faculty/profile', label: 'Profile', icon: '⚙️' }
    ];

    return (
        <aside style={{
            width: '260px',
            backgroundColor: '#f8fafc',
            borderRight: '1px solid #e2e8f0',
            height: 'calc(100vh - 64px)', // Account for Navbar height
            position: 'sticky',
            top: '64px',
            overflowY: 'auto',
            padding: '24px 0',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '0 24px', marginBottom: '16px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Operations Menu
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/faculty'}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary-color)' : '#475569',
                            backgroundColor: isActive ? '#eff6ff' : 'transparent',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all 0.2s ease',
                            fontSize: '0.95rem'
                        })}
                    >
                        <span style={{ fontSize: '1.2rem', filter: 'grayscale(0.2)' }}>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
