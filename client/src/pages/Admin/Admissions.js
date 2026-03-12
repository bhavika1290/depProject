import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdArchive,
  MdDelete,
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdClose,
  MdVisibility,
  MdCalendarToday,
  MdPeople,
  MdMoreVert
} from 'react-icons/md';
import api from '../../services/apiCore';

export default function Admissions() {
  const [view, setView] = useState('list'); // 'list' or 'details'
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [showOfferingModal, setShowOfferingModal] = useState(false);

  const [cycles, setCycles] = useState([
    { _id: '1', name: 'Admission Cycles for 2022-23', startDate: 'Apr 2023', endDate: 'Jun 2023' }
  ]);
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Form State
  const [offeringForm, setOfferingForm] = useState({
    department: '',
    specialization: '',
    offeringType: 'Regular',
    deadline: '',
    eligibility: '',
    admissionCycleId: '64d1f5e8e4b0a1a2b3c4d5e6' // Placeholder cycle ID
  });

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const res = await api.get('/offerings');
      if (res.data.success) {
        setOfferings(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
    }
  };

  const fetchOfferingApplicants = async (offeringId) => {
    try {
      setApplicantsLoading(true);
      setShowApplicantsModal(true);
      const res = await api.get(`/applications?offeringId=${offeringId}`);
      if (res.data.success) {
        setApplicants(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      alert('Failed to load applications for this offering');
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleCycleClick = (cycle) => {
    setSelectedCycle(cycle);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedCycle(null);
  };

  const handleOfferingChange = (e) => {
    setOfferingForm({ ...offeringForm, [e.target.name]: e.target.value });
  };

  const handleAddOfferingSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/offerings', offeringForm);
      if (res.data.success) {
        setOfferings([...offerings, res.data.data]);
        setShowOfferingModal(false);
        setOfferingForm({ department: '', specialization: '', offeringType: 'Regular', deadline: '', eligibility: '', admissionCycleId: '64d1f5e8e4b0a1a2b3c4d5e6' });
      }
    } catch (error) {
      console.error('Failed to create offering:', error);
      alert(error.response?.data?.message || 'Failed to add offering');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffering = async (id) => {
    if (window.confirm('Are you sure you want to delete this offering?')) {
      try {
        const res = await api.delete(`/offerings/${id}`);
        if (res.data.success) {
          setOfferings(offerings.filter(off => off._id !== id));
        }
      } catch (error) {
        console.error('Failed to delete offering:', error);
        alert('Failed to delete. Make sure you are an admin.');
      }
    }
  };

  return (
    <div className="admissions-container animate-fade-in">
      {view === 'list' ? (
        <>
          {/* List View */}
          <div className="section-header">
            <h3 className="section-title">Current Admission Cycles</h3>
          </div>

          <div className="admissions-grid">
            <div className="admission-cycle-card add-new" onClick={() => setShowCycleModal(true)}>
              <MdAdd size={32} color="#718096" />
              <div style={{ textAlign: 'left' }}>
                <div className="cycle-name" style={{ color: '#4a5568' }}>Add New</div>
                <div className="cycle-duration">Click to add a new admission cycle</div>
              </div>
            </div>

            {cycles.map(cycle => (
              <div key={cycle._id} className="admission-cycle-card" onClick={() => handleCycleClick(cycle)}>
                <div className="cycle-icon">
                  <MdCalendarToday />
                </div>
                <div className="cycle-info">
                  <div className="cycle-name">{cycle.name}</div>
                  <div className="cycle-duration">{cycle.startDate} - {cycle.endDate}</div>
                </div>
                <div className="cycle-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="cycle-btn" onClick={() => { setSelectedCycle(cycle); setShowCycleModal(true); }}>
                    <MdEdit />
                  </button>
                  <button className="cycle-btn">
                    <MdArchive />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Details View (Selected Cycle) */}
          <div className="admission-cycle-card" style={{ marginBottom: '32px', cursor: 'default' }}>
            <div className="cycle-icon" style={{ backgroundColor: '#f1f5f9', color: '#1a202c' }}>
              <MdCalendarToday />
            </div>
            <div className="cycle-info">
              <div className="cycle-name">{selectedCycle?.name}</div>
              <div className="cycle-duration">{selectedCycle?.startDate} - {selectedCycle?.endDate}</div>
            </div>
            <div className="cycle-actions">
              <button className="cycle-btn" onClick={() => setShowCycleModal(true)}>
                <MdEdit />
              </button>
              <button className="cycle-btn">
                <MdArchive />
              </button>
              <button className="cycle-btn" onClick={handleBackToList}>
                <MdClose />
              </button>
            </div>
          </div>

          <div className="premium-table-wrapper">
            <div className="table-toolbar">
              <div className="table-actions-left">
                <select className="toolbar-select">
                  <option>Default</option>
                </select>
                <div style={{ position: 'relative' }}>
                  <MdSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" placeholder="Search" className="toolbar-search" style={{ paddingLeft: '40px' }} />
                </div>
                <select className="toolbar-select">
                  <option>Department</option>
                </select>
                <button className="btn-primary" style={{ backgroundColor: '#006680' }}>
                  <MdFileDownload /> Brochure
                </button>
              </div>
              <button className="btn-primary" onClick={() => setShowOfferingModal(true)}>
                <MdAdd /> Add Offering
              </button>
            </div>

            <table className="premium-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Offering Type</th>
                  <th>Eligibility</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Results</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offerings.map(off => (
                  <tr key={off._id}>
                    <td style={{ fontWeight: 600 }}>{off.department}</td>
                    <td>{off.specialization}</td>
                    <td>{off.offeringType}</td>
                    <td style={{ color: '#0070f3', cursor: 'pointer', fontWeight: 500 }} title={off.eligibility}>{off.eligibility?.substring(0, 15)}...</td>
                    <td>{new Date(off.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-pill status-${off.status?.toLowerCase()}`}>
                        {off.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>Not Published</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="cycle-btn" style={{ width: '32px', height: '32px' }} title="View Applicants" onClick={() => fetchOfferingApplicants(off._id)}><MdPeople /></button>
                        <button className="cycle-btn" style={{ width: '32px', height: '32px' }} title="Edit"><MdEdit /></button>
                        <button className="cycle-btn" style={{ width: '32px', height: '32px', color: '#f59e0b' }} title="Archive"><MdArchive /></button>
                        <button className="cycle-btn" style={{ width: '32px', height: '32px', color: '#ef4444' }} title="Delete" onClick={() => handleDeleteOffering(off._id)}><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* NEW/EDIT CYCLE MODAL */}
      {showCycleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCycle ? 'Edit Admission Cycle' : 'New Admission Cycle'}</h2>
              <button onClick={() => setShowCycleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Admissions for AY 2022-23" defaultValue={selectedCycle?.name} />
              </div>

              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-input" />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Category-wise Application Fees</label>
                <div className="fee-inputs-grid">
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>GEN</label>
                    <input type="number" className="form-input" defaultValue="500" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>OBC</label>
                    <input type="number" className="form-input" defaultValue="500" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>EWS</label>
                    <input type="number" className="form-input" defaultValue="500" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>SC</label>
                    <input type="number" className="form-input" defaultValue="250" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>ST</label>
                    <input type="number" className="form-input" defaultValue="250" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>PWD</label>
                    <input type="number" className="form-input" defaultValue="250" />
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Brochure for PhD Admissions</label>
                <input type="text" className="form-input" placeholder="Public URL of the brochure PDF" />
              </div>

              <div className="form-group full-width" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                <input type="checkbox" id="current-cycle" style={{ width: '20px', height: '20px' }} />
                <label htmlFor="current-cycle" className="form-label">Make Current Admission Cycle</label>
              </div>

              <div className="form-group full-width" style={{ marginTop: '20px' }}>
                <button className="btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD OFFERING MODAL */}
      {showOfferingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add offering</h2>
              <button onClick={() => setShowOfferingModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleAddOfferingSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input" name="department" value={offeringForm.department} onChange={handleOfferingChange} required>
                  <option value="">- Select -</option>
                  <option value="Biomedical Engineering">Biomedical Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input type="text" className="form-input" name="specialization" value={offeringForm.specialization} onChange={handleOfferingChange} placeholder="e.g. Bio" required />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Offering Type</label>
                <select className="form-input" name="offeringType" value={offeringForm.offeringType} onChange={handleOfferingChange} required>
                  <option value="Regular">Regular</option>
                  <option value="External">External</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Direct">Direct</option>
                  <option value="Staff Member">Staff Member</option>
                  <option value="Project Staff">Project Staff</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Deadline</label>
                <input type="date" className="form-input" name="deadline" value={offeringForm.deadline} onChange={handleOfferingChange} required />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Eligibility</label>
                <textarea className="form-input" style={{ minHeight: '120px' }} name="eligibility" value={offeringForm.eligibility} onChange={handleOfferingChange} placeholder="Enter eligibility criteria..." required></textarea>
              </div>

              <div className="form-group full-width">
                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>{loading ? 'Adding...' : 'Add Offering'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW APPLICANTS MODAL */}
      {showApplicantsModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Applications</h2>
              <button onClick={() => setShowApplicantsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>

            <div style={{ marginTop: '20px' }}>
              {applicantsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading applications...</div>
              ) : applicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No applications received for this offering yet.</div>
              ) : (
                <div className="premium-table-wrapper">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Applicant Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map(app => (
                        <tr key={app._id}>
                          <td style={{ fontWeight: 500 }}>{app.userId?.name || 'N/A'}</td>
                          <td>{app.userId?.email || 'N/A'}</td>
                          <td>
                            <span className={`status-pill status-${app.status?.toLowerCase().replace(' ', '-')}`}>
                              {app.status}
                            </span>
                          </td>
                          <td>{new Date(app.submittedAt || app.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
