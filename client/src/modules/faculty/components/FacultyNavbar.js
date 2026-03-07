import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function FacultyNavbar({ activeCycle = "PhD 2026" }) {
    const { currentUser, logoutContext } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutContext();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0',
            position: 'sticky', top: 0, zIndex: 100, height: '64px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--primary-color)', fontWeight: 600 }}>
                    IIT Ropar PhD Admission Portal
                </h1>
                <div style={{ padding: '4px 12px', backgroundColor: '#f1f5f9', borderRadius: '16px', fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
                    Cycle: {activeCycle}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', position: 'relative' }}>
                    🔔
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', height: '8px', width: '8px', borderRadius: '50%' }}></span>
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>Dr. {currentUser?.name || "Faculty Member"}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{currentUser?.role || "Faculty"}</span>
                    </div>
                    <div style={{ 
                        height: '36px', width: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', 
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
                    }}>
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
                    </div>
                </div>

                <button onClick={handleLogout} style={{
                    background: 'transparent', border: '1px solid #cbd5e1', color: '#475569',
                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem',
                    fontWeight: 500, transition: 'all 0.2s', marginLeft: '8px'
                }}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
