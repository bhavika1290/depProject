import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/applications/my-applications');
            setApplications(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading applications...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Applications</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Track the status of your submitted PhD applications.</p>
                </div>
                <Link to="/student" className="btn-primary" style={{ textDecoration: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid #e5e7eb' }}>&larr; Back to Dashboard</Link>
            </div>

            {error && <div style={{
                backgroundColor: 'var(--danger-light)', color: 'var(--danger)',
                padding: '12px', borderRadius: 'var(--border-radius)', marginBottom: '20px'
            }}>{error}</div>}

            <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Submission History</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    {applications.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: '1.1rem' }}>You have not submitted any applications yet.</p>
                            <Link to="/student" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Browse Open Offerings</Link>
                        </div>
                    ) : (
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>App ID</th>
                                    <th>Department</th>
                                    <th>Specialization</th>
                                    <th>Status</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app._id}>
                                        <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{app.applicationId || 'Pending'}</td>
                                        <td>{app.offeringId?.department}</td>
                                        <td>{app.offeringId?.specialization}</td>
                                        <td>
                                            <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <strong style={{ color: app.result === 'Accepted' ? 'var(--success)' : app.result === 'Rejected' ? 'var(--danger)' : 'var(--text-primary)' }}>
                                                {app.result || 'Pending'}
                                            </strong>
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
