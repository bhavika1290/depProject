import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/apiCore';
import { Navigate } from 'react-router-dom';

export default function FacultyDashboard() {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalApplications: 0,
        totalOfferings: 0,
        totalCycles: 0,
        recentApplications: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/dashboard/stats');
            setStats(res.data.data);
        } catch (error) {
            console.error('Failed to load faculty dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading faculty dashboard...</div>;

    // Safety checks
    if (!currentUser) return <Navigate to="/login" replace />;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Section 1: Welcome Area */}
            <div style={{
                backgroundColor: 'white', borderRadius: '12px', padding: '32px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                borderLeft: '4px solid var(--primary-color)'
            }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', color: '#1e293b' }}>
                    Welcome Dr. {currentUser.name || currentUser.email} 👋
                </h2>
                <div style={{ color: '#475569', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>Department of Mathematics</span>
                    <span>Indian Institute of Technology Ropar</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Admission Cycle: PhD 2026</span>
                </div>
                
                <div style={{ marginTop: '16px', display: 'flex', gap: '24px', fontSize: '0.9rem', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔬 Research Area: Algebra</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🕒 Last Login: Today 10:15 AM</span>
                </div>
            </div>

            {/* Section 2: Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Openings</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '2.5rem', color: '#0f172a' }}>{stats.totalOfferings || 0}</h3>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Applicants</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '2.5rem', color: '#0f172a' }}>{stats.totalApplications || 0}</h3>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Reviews</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '2.5rem', color: '#eab308' }}>0</h3>
                </div>
            </div>

            {/* Section 3: Recent Applications Data Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Recent Applications</h3>
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}>View All →</button>
                </div>
                <div style={{ overflowX: 'auto', padding: '0 24px 24px 24px' }}>
                     {/* Placeholder for table styling */}
                     <p style={{color: '#64748b', marginTop: '20px'}}>No recent applications to review.</p>
                </div>
            </div>
            
        </div>
    );
}
