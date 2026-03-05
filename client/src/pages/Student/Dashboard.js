import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
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
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      navigate('/admin');
    } else if (user?.role === 'faculty') {
      navigate('/faculty');
    } else {
      fetchDashboardData();
    }
  }, [user, navigate]);

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
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Welcome back, <strong>{user?.name || user?.email}</strong>!</p>
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

      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Open Offerings ({stats.openOfferings})</h3>
        </div>
        <div style={{ padding: '24px' }}>
          {offerings.length === 0 ? (
            <p>No open offerings available at the moment.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {offerings.map(offering => (
                <li key={offering._id} style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: 'var(--border-radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s' }} onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{offering.department} - {offering.specialization}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'inline-block', marginRight: '15px' }}><strong>Type:</strong> {offering.offeringType}</span>
                      <span><strong>Cycle:</strong> {offering.admissionCycleId?.name}</span>
                    </p>
                  </div>
                  <Link to={`/student/apply/${offering._id}`} className="btn-primary" style={{ textDecoration: 'none' }}>
                    Apply Now
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
