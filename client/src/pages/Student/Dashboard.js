import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/apiCore';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    submittedCount: 0,
    acceptedCount: 0,
    shortlistedCount: 0,
    openOfferings: 0
  });
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
      navigate('/admin');
    } else if (currentUser?.role === 'faculty') {
      navigate('/faculty');
    } else {
      fetchDashboardData();
    }
  }, [currentUser, navigate]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/dashboard/student-stats');
      setStats(statsRes.data.data);

      const offeringsRes = await api.get('/offerings/open');
      setOfferings(offeringsRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Student Dashboard</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Welcome back, <strong>{currentUser?.name || currentUser?.email}</strong>!</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <Link to="/student/profile" style={{ flex: 1, textDecoration: 'none' }}>
          <div className="page-card" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--primary-color)', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>My Profile</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Update your personal and educational details</p>
          </div>
        </Link>
        <Link to="/student/applications" style={{ flex: 1, textDecoration: 'none' }}>
          <div className="page-card" style={{ padding: '30px', textAlign: 'center', borderTop: '4px solid var(--success)', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
            <h3 style={{ color: 'var(--success)', marginBottom: '10px' }}>My Applications</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Submitted: <strong style={{ color: 'var(--text-primary)' }}>{stats.submittedCount}</strong></p>
          </div>
        </Link>
      </div>

      <div className="page-card" style={{ padding: 0, overflow: 'hidden', marginTop: '30px' }}>
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Open Positions</h3>
        </div>
        <div style={{ padding: '0' }}>
          {offerings.length === 0 ? (
            <p style={{ padding: '24px 30px' }}>No open offerings available at the moment.</p>
          ) : (
            <div className="premium-table-wrapper" style={{ boxShadow: 'none', borderRadius: 0 }}>
              <table className="premium-table">
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>DEPARTMENT</th>
                    <th style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>SPECIALIZATION</th>
                    <th style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>OFFERING TYPE</th>
                    <th style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>ELIGIBILITY</th>
                    <th style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>DEADLINE</th>
                    <th style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {offerings.map(offering => (
                    <tr key={offering._id}>
                      <td style={{ color: '#475569', fontWeight: 500 }}>{offering.department}</td>
                      <td style={{ color: '#475569' }}>{offering.specialization}</td>
                      <td style={{ color: '#64748b' }}>{offering.offeringType}</td>
                      <td style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }} title={offering.eligibility}>View</td>
                      <td style={{ color: '#64748b' }}>{new Date(offering.deadline).toLocaleDateString('en-GB')}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                          <span className="status-pill status-open" style={{ backgroundColor: '#ccfbf1', color: '#0f766e', fontWeight: 600, fontSize: '0.75rem', padding: '4px 12px' }}>
                            Open
                          </span>
                          <Link to={`/student/apply/${offering._id}`} style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.875rem' }}>
                            Apply
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
