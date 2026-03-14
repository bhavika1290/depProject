import React from 'react';
import { NavLink } from 'react-router-dom';
import './FacultySidebar.css';

export default function FacultySidebar({ onNavigate }) {
    const navItems = [
        { path: '/faculty', label: 'Dashboard', icon: '📊' },
        { path: '/faculty/openings/create', label: 'Create Opening', icon: '➕' },
        { path: '/faculty/openings', label: 'My Openings', icon: '📋' },
        { path: '/faculty/applicants', label: 'Applicants', icon: '🧑‍🎓' },
        { path: '/faculty/applicants/filter', label: 'Filter & Sort', icon: '🔍' },
        { path: '/faculty/shortlisted', label: 'Shortlisted Candidates', icon: '⭐' },
        { path: '/faculty/recommendations', label: 'Final Recommendations', icon: '✅' },
        { path: '/faculty/profile', label: 'Faculty Profile', icon: '👤' }
    ];

    return (
        <aside className="fs-aside">
            <div className="fs-menu-label">Operations Menu</div>

            <nav className="fs-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/faculty'}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `fs-link${isActive ? ' fs-link--active' : ''}`
                        }
                    >
                        <span className="fs-icon">{item.icon}</span>
                        <span className="fs-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="fs-footer">
                <span className="fs-dept">Dept. of Mathematics</span>
                <span className="fs-inst">IIT Ropar</span>
            </div>
        </aside>
    );
}
