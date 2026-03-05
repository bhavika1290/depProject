import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

export default function FacultyDashboard() {
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
            console.error('Failed to load faculty dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading faculty dashboard...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Faculty Dashboard</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Welcome back, <strong>{user?.name || user?.email}</strong>!</p>
                </div>
            </div>

            <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Department Applications Overview</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Applicant</th>
                                <th>Specialization</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentApplications.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No applications to review yet.</td></tr>
                            ) : (
                                stats.recentApplications.map(app => (
                                    <tr key={app._id}>
                                        <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{app.applicationId}</td>
                                        <td>{app.userId?.name || app.userId?.email}</td>
                                        <td>{app.offeringId?.specialization || 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => alert('View Application details')}>View</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
