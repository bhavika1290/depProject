import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import FacultyNavbar from './FacultyNavbar';
import FacultySidebar from './FacultySidebar';
import './FacultyLayout.css';

export default function FacultyLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                sidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target) &&
                !e.target.closest('.fn-hamburger')
            ) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    // Close sidebar on Escape key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div className="fl-root">
            <FacultyNavbar
                sidebarOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />

            <div className="fl-body">
                {/* Overlay behind sidebar on mobile */}
                {sidebarOpen && (
                    <div className="fl-overlay" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Collapsible sidebar */}
                <div ref={sidebarRef} className={`fl-sidebar ${sidebarOpen ? 'fl-sidebar--open' : ''}`}>
                    <FacultySidebar onNavigate={() => setSidebarOpen(false)} />
                </div>

                {/* Main content – always full width (sidebar floats over) */}
                <main className="fl-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
