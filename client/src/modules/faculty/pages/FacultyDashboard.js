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
        // Simulating fetch of Math specific stats
        setLoading(true);
        setTimeout(() => {
            setStats({
                totalApplications: 142,
                totalOfferings: 3,
                totalCycles: 1,
                recentApplications: [
                    { id: 'APP1001', name: 'Ravi Kumar', area: 'Algebra', cgpaModel: 'MSc', cgpa: 8.9, gate: 650, status: 'Applied' },
                    { id: 'APP1002', name: 'Sneha Patel', area: 'Topology', cgpaModel: 'MSc', cgpa: 9.1, gate: 720, status: 'Applied' },
                    { id: 'APP1003', name: 'Amit Singh', area: 'Numerical Analysis', cgpaModel: 'BSc', cgpa: 8.5, gate: 610, status: 'Shortlisted' },
                    { id: 'APP1004', name: 'Priya Mehta', area: 'Probability Theory', cgpaModel: 'MSc', cgpa: 8.7, gate: 590, status: 'Applied' }
                ]
            });
            setLoading(false);
        }, 600);
    }, []);

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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔬 Specialization: Algebra</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🕒 Last Login: Today 10:15 AM</span>
                </div>
            </div>

            {/* Section 2: Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Openings Created</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '2.5rem', color: '#0f172a' }}>{stats.totalOfferings || 0}</h3>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Applicants</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '2.5rem', color: '#0f172a' }}>{stats.totalApplications || 0}</h3>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Shortlisted Candidates</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '2.5rem', color: '#3b82f6' }}>24</h3>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Final Recommendations</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '2.5rem', color: '#10b981' }}>5</h3>
                </div>
            </div>

            {/* Section 3: Recent Applications Data Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Recent Applications</h3>
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}>View All →</button>
                </div>
                <div style={{ overflowX: 'auto', padding: '0' }}>
                     {!stats.recentApplications || stats.recentApplications.length === 0 ? (
                         <div style={{ padding: '24px', color: '#64748b' }}>No recent applications to review.</div>
                     ) : (
                         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                             <thead>
                                 <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                     <th style={{ padding: '12px 24px', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>Name</th>
                                     <th style={{ padding: '12px 24px', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>Area Match</th>
                                     <th style={{ padding: '12px 24px', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>CGPA</th>
                                     <th style={{ padding: '12px 24px', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>GATE Math</th>
                                     <th style={{ padding: '12px 24px', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {stats.recentApplications.map((app, i) => (
                                     <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                         <td style={{ padding: '12px 24px', fontWeight: 500, color: '#0f172a' }}>{app.name}</td>
                                         <td style={{ padding: '12px 24px', color: '#334155' }}>{app.area}</td>
                                         <td style={{ padding: '12px 24px', color: '#334155' }}>{app.cgpa} <span style={{fontSize: '0.8rem', color:'#64748b'}}>({app.cgpaModel})</span></td>
                                         <td style={{ padding: '12px 24px', color: '#334155' }}>{app.gate}</td>
                                         <td style={{ padding: '12px 24px' }}>
                                             <span style={{
                                                 padding: '4px 10px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600,
                                                 backgroundColor: app.status === 'Shortlisted' ? '#dcfce7' : '#f1f5f9',
                                                 color: app.status === 'Shortlisted' ? '#166534' : '#475569'
                                             }}>
                                                 {app.status}
                                             </span>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     )}
                </div>
            </div>
            
        </div>
    );
}
