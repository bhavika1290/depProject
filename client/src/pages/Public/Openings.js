import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/apiCore';
import './PublicPage.css';

export default function Openings() {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const offeringsRes = await api.get('/offerings/open');
      setOfferings(offeringsRes.data.data);
    } catch (error) {
      console.error('Failed to load open offerings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page">
      <section className="public-hero public-hero-simple">
        <div className="public-hero-content">
          <p className="public-eye">Current Listings</p>
          <h1>Openings</h1>
          <p>
            PhD seats are open in high-growth research areas. Each opening includes mentorship and research funding.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Open Positions</h3>
          </div>
          <div style={{ padding: '0' }}>
            {loading ? (
              <p style={{ padding: '24px 30px' }}>Loading open offerings...</p>
            ) : offerings.length === 0 ? (
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
    </div>
  );
}
