import React from 'react';
import { Outlet } from 'react-router-dom';
import FacultyNavbar from './FacultyNavbar';
import FacultySidebar from './FacultySidebar';

export default function FacultyLayout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            <FacultyNavbar />
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <FacultySidebar />
                
                <main style={{
                    flex: 1,
                    padding: '32px 40px',
                    overflowY: 'auto',
                    height: 'calc(100vh - 64px)'
                }}>
                    {/* The specific page content (Dashboard, Openings, etc.) will render here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
