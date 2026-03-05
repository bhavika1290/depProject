import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
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
            console.error('Failed to load admin dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading admin dashboard...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Admin Dashboard</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Welcome back, <strong>{user?.name || user?.email}</strong>!</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="page-card" style={{ padding: '30px 20px', textAlign: 'center', borderTop: '4px solid var(--primary-light)' }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '0 0 10px 0' }}>{stats.totalApplications}</h3>
                    <p style={{ margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Applications</p>
                </div>
                <div className="page-card" style={{ padding: '30px 20px', textAlign: 'center', borderTop: '4px solid var(--accent-color)' }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-dark)', margin: '0 0 10px 0' }}>{stats.totalOfferings}</h3>
                    <p style={{ margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Offerings</p>
                </div>
                <div className="page-card" style={{ padding: '30px 20px', textAlign: 'center', borderTop: '4px solid var(--success)' }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--success)', margin: '0 0 10px 0' }}>{stats.totalCycles}</h3>
                    <p style={{ margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Admission Cycles</p>
                </div>
            </div>

            <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Applications</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Applicant</th>
                                <th>Department</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentApplications.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>No applications yet.</td></tr>
                            ) : (
                                stats.recentApplications.map(app => (
                                    <tr key={app._id}>
                                        <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{app.applicationId}</td>
                                        <td>{app.userId?.name || app.userId?.email}</td>
                                        <td>{app.offeringId?.department || 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="page-card" style={{ padding: '24px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s', border: '1px solid transparent' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'} onClick={() => alert('Navigate to Offerings')}>
                    <h4 style={{ margin: 0 }}>Manage Offerings</h4>
                </div>
                <div className="page-card" style={{ padding: '24px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s', border: '1px solid transparent' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'} onClick={() => alert('Navigate to Applications')}>
                    <h4 style={{ margin: 0 }}>Review Applications</h4>
                </div>
                <div className="page-card" style={{ padding: '24px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s', border: '1px solid transparent' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'} onClick={() => alert('Navigate to Emails')}>
                    <h4 style={{ margin: 0 }}>Bulk Emails</h4>
                </div>
                <div className="page-card" style={{ padding: '24px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s', border: '1px solid transparent' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'} onClick={() => alert('Navigate to Templates')}>
                    <h4 style={{ margin: 0 }}>Template Manager</h4>
                </div>
            </div>
        </div>
    );
}
