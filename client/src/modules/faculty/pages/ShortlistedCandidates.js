import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/apiCore';
import './ShortlistedCandidates.css';

export default function ShortlistedCandidates() {
    const { currentUser } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch live shortlisted candidates
    useEffect(() => {
        const fetchShortlisted = async () => {
            if (!currentUser) return;
            try {
                setLoading(true);
                // Status is hardcoded to 'Shortlisted' for this view
                const res = await api.get(`/applications?facultyId=${currentUser.id}&status=Shortlisted`);
                const data = res.data.data;

                const mapped = data.map(app => {
                    const gateExam = app.qualifyingExams?.find(e => e.examName === 'GATE');
                    const netExam = app.qualifyingExams?.find(e => e.examName === 'CSIR-NET' || e.examName === 'UGC-NET');
                    const nbhmExam = app.qualifyingExams?.find(e => e.examName === 'NBHM');

                    return {
                        _id: app._id,
                        id: app.applicationId || 'N/A',
                        name: app.personalDetails?.fullName || app.userId?.name || 'N/A',
                        email: app.userId?.email || 'N/A',
                        phone: app.communicationDetails?.phone || 'N/A',
                        category: app.personalDetails?.category || 'General',
                        mscCgpa: parseFloat(app.educationalDetails?.pg?.cgpa) || 0,
                        bscCgpa: parseFloat(app.educationalDetails?.ug?.cgpa) || 0,
                        gateScore: parseInt(gateExam?.score) || 0,
                        csirNetQualified: netExam ? 'Yes' : 'No',
                        nbhmQualified: nbhmExam ? 'Yes' : 'No',
                        researchArea: app.offeringId?.specialization || 'Not Specified',
                        researchExperience: 0, // Simplified aggregator if needed later
                        universityRanking: 0, 
                        hasPublications: app.publications?.length > 0 ? 'Yes' : 'No',
                        interviewStatus: app.interviewStatus || 'Pending Scheduling',
                        interviewDate: app.interviewDate || null,
                        university: app.educationalDetails?.pg?.college || 'Not Specified',
                        sop: app.generalApplicationDetails?.sop || 'N/A',
                        documents: (app.documents?.other || []).map((doc, i) => ({ name: `Doc_${i+1}.pdf`, type: 'Other' }))
                    };
                });
                setCandidates(mapped);
            } catch (err) {
                console.error('Failed to fetch shortlisted candidates', err);
                toast.error('Failed to load live data.');
            } finally {
                setLoading(false);
            }
        };
        fetchShortlisted();
    }, [currentUser]);
    
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'cgpa', direction: 'desc' });
    
    // Modal States
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    const [candidateToSchedule, setCandidateToSchedule] = useState(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    // Derived State
    const filteredAndSorted = useMemo(() => {
        let result = candidates.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  c.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || c.interviewStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });

        if (sortConfig.key) {
            result.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                
                // Handle nulls in sorting
                if (valA === null) valA = '';
                if (valB === null) valB = '';

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [candidates, searchTerm, statusFilter, sortConfig]);

    // Handlers
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        // default numbers to desc
        if (sortConfig.key !== key && (key === 'cgpa' || key === 'gateScore')) direction = 'desc';
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    // Actions
    const handleRemove = async (appId) => {
        const candidate = candidates.find(c => c.id === appId);
        if(!candidate || !candidate._id) return;

        if(window.confirm('Are you sure you want to remove this candidate from the Shortlist? They will be demoted back to Applied status.')) {
            try {
                // Change status back to 'Submitted'
                await api.put(`/applications/${candidate._id}/status`, { status: 'Submitted' });
                setCandidates(prev => prev.filter(c => c.id !== appId));
                toast.info(`Candidate ${appId} removed from shortlist.`);
            } catch (err) {
                toast.error('Failed to remove candidate.');
            }
        }
    };

    const handleUpdateStatus = async (appId, newStatus) => {
        const candidate = candidates.find(c => c.id === appId);
        if(!candidate || !candidate._id) return;

        try {
            await api.put(`/applications/${candidate._id}/status`, { interviewStatus: newStatus });
            setCandidates(prev => prev.map(c => c.id === appId ? { ...c, interviewStatus: newStatus } : c));
            let type = newStatus === 'Selected' ? toast.success : newStatus === 'Rejected' ? toast.error : toast.info;
            type(`Candidate marked as ${newStatus}.`);
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };

    const openScheduleModal = (candidate) => {
        setCandidateToSchedule(candidate);
        setScheduleDate('');
        setScheduleTime('');
        setIsScheduleModalOpen(true);
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if(!scheduleDate || !scheduleTime) {
            toast.error('Date and time are required.');
            return;
        }
        
        const datetime = `${scheduleDate}T${scheduleTime}`;
        
        try {
            await api.put(`/applications/${candidateToSchedule._id}/status`, { 
                interviewStatus: 'Scheduled', 
                interviewDate: datetime 
            });

            setCandidates(prev => prev.map(c => 
                c.id === candidateToSchedule.id 
                    ? { ...c, interviewStatus: 'Scheduled', interviewDate: datetime } 
                    : c
            ));
            
            toast.success(`Interview scheduled for ${candidateToSchedule.name}`);
            setIsScheduleModalOpen(false);
        } catch (err) {
            toast.error('Failed to schedule interview.');
        }
    };

    const handleViewProfile = (candidate) => {
        setSelectedProfile(candidate);
        setIsProfileModalOpen(true);
    };

    // Helper to format date
    const formatDateTime = (isoString) => {
        if(!isoString) return 'Not set';
        const d = new Date(isoString);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748b' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }}></div>
                <p>Loading your shortlisted candidates...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="shortlisted-container">
            <div className="page-header">
                <div className="header-title">
                    <h2>Shortlisted Candidates</h2>
                    <p>Manage interview scheduling and track final admissions selection.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-panel">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search by Name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="control-input"
                    />
                </div>
                
                <div className="filter-box">
                    <label>Interview Status:</label>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)} 
                        className="control-input status-select"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending Scheduling">Pending Scheduling</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Selected">Selected</option>
                        <option value="Waitlisted">Waitlisted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive short-table-wrap">
                {filteredAndSorted.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No Candidates Found</h3>
                        <p>There are no candidates matching the current criteria in the shortlist.</p>
                    </div>
                ) : (
                    <table className="shortlist-table">
                        <thead>
                            <tr>
                                <th className="sortable-header" onClick={() => handleSort('mscCgpa')}>
                                    MSc CGPA <span className="sort-icon">{getSortIndicator('mscCgpa')}</span>
                                </th>
                                <th>Academic Fit</th>
                                <th>Research Area</th>
                                <th>Interview Status</th>
                                <th className="actions-header text-right">Actions / Results</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSorted.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        <div className="cell-title name-col">{c.name}</div>
                                        <div className="cell-subtitle">{c.id} • {c.category}</div>
                                    </td>
                                    <td>
                                        <div className="academic-badges">
                                            <span className="acad-badge cgpa-badge">MSc: {c.mscCgpa}</span>
                                            {c.nbhmQualified === 'Yes' && <span className="acad-badge net-badge">NBHM</span>}
                                            {c.csirNetQualified !== 'No' && <span className="acad-badge net-badge">NET</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="area-text">{c.researchArea}</span>
                                    </td>
                                    <td>
                                        <div className="status-col">
                                            <span className={`inter-badge badge-${c.interviewStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {c.interviewStatus}
                                            </span>
                                            {c.interviewDate && (
                                                <span className="date-subtext">📅 {formatDateTime(c.interviewDate)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="action-buttons short-actions">
                                            
                                            {/* Pre-Interview Workflow */}
                                            {c.interviewStatus === 'Pending Scheduling' && (
                                                <button className="btn btn-primary btn-sm schedule-btn" onClick={() => openScheduleModal(c)}>
                                                    🗓️ Schedule
                                                </button>
                                            )}

                                            {/* Post-Interview Workflow */}
                                            {c.interviewStatus === 'Scheduled' && (
                                                <div className="result-actions">
                                                    <button className="btn btn-success btn-sm icon-btn" title="Mark Selected" onClick={() => handleUpdateStatus(c.id, 'Selected')}>✅</button>
                                                    <button className="btn btn-warning btn-sm icon-btn" title="Mark Waitlisted" onClick={() => handleUpdateStatus(c.id, 'Waitlisted')}>⏳</button>
                                                    <button className="btn btn-danger btn-sm icon-btn" title="Mark Rejected" onClick={() => handleUpdateStatus(c.id, 'Rejected')}>❌</button>
                                                </div>
                                            )}

                                            {/* Utilities */}
                                            {c.interviewStatus !== 'Selected' && c.interviewStatus !== 'Waitlisted' && c.interviewStatus !== 'Rejected' && (
                                                <button className="btn btn-outline-danger btn-sm remove-btn tooltip-trigger" title="Remove from Shortlist" onClick={() => handleRemove(c.id)}>
                                                    🗑️
                                                </button>
                                            )}
                                            <button className="btn btn-secondary btn-sm view-btn" onClick={() => handleViewProfile(c)}>
                                                View Profile
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Schedule Modal */}
            {isScheduleModalOpen && candidateToSchedule && (
                <div className="modal-overlay" onClick={() => setIsScheduleModalOpen(false)}>
                    <div className="modal-content schedule-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Schedule Interview</h3>
                            <button className="close-btn" onClick={() => setIsScheduleModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Scheduling interview for <strong>{candidateToSchedule.name}</strong> ({candidateToSchedule.id})</p>
                            <form onSubmit={handleScheduleSubmit} className="schedule-form">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={scheduleDate} 
                                        onChange={e => setScheduleDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time *</label>
                                    <input 
                                        type="time" 
                                        className="form-control" 
                                        value={scheduleTime} 
                                        onChange={e => setScheduleTime(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-footer mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Confirm Schedule</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Full Profile Modal (Reused) */}
            {isProfileModalOpen && selectedProfile && (
                <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
                    <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>
                        <div className="profile-header">
                            <div className="profile-header-info">
                                <div className="profile-avatar">{selectedProfile.name.charAt(0)}</div>
                                <div>
                                    <h3 className="profile-name">{selectedProfile.name}</h3>
                                    <div className="profile-id">{selectedProfile.id} | {selectedProfile.email}</div>
                                </div>
                            </div>
                            <div className="profile-header-actions">
                                <span className={`inter-badge large-badge badge-${selectedProfile.interviewStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {selectedProfile.interviewStatus}
                                </span>
                                <button className="close-profile-btn" onClick={() => setIsProfileModalOpen(false)}>&times;</button>
                            </div>
                        </div>

                        <div className="profile-body">
                            <div className="profile-grid-2">
                                <div className="profile-card">
                                    <h4 className="card-title">Academic & Tests</h4>
                                    <div className="card-row"><strong>University:</strong> {selectedProfile.university}</div>
                                    <div className="card-row"><strong>MSc Math CGPA:</strong> <span className="highlight-stat">{selectedProfile.mscCgpa}</span></div>
                                    <div className="card-row"><strong>BSc Math CGPA:</strong> <span className="highlight-stat">{selectedProfile.bscCgpa}</span></div>
                                    <div className="card-row"><strong>GATE Score:</strong> {selectedProfile.gateScore || 'N/A'}</div>
                                    <div className="card-row"><strong>CSIR-NET:</strong> {selectedProfile.csirNetQualified}</div>
                                    <div className="card-row"><strong>NBHM:</strong> {selectedProfile.nbhmQualified === 'Yes' ? 'Qualified' : 'Not Qualified'}</div>
                                </div>
                                
                                <div className="profile-card">
                                    <h4 className="card-title">Research Fit</h4>
                                    <div className="card-row"><strong>Area:</strong> {selectedProfile.researchArea}</div>
                                    <div className="card-row"><strong>Experience:</strong> {selectedProfile.researchExperience} months</div>
                                    <div className="card-row"><strong>Publications:</strong> {selectedProfile.hasPublications}</div>
                                    <div className="card-row"><strong>Category:</strong> {selectedProfile.category}</div>
                                </div>
                            </div>
                            
                            <div className="profile-card full-width mt-4">
                                <h4 className="card-title">SOP & Documents</h4>
                                <div className="sop-box">"{selectedProfile.sop}"</div>
                                <div className="documents-grid mt-3">
                                    {selectedProfile.documents.map((doc, idx) => (
                                        <div key={idx} className="document-item">
                                            <span className="doc-icon">📄</span>
                                            <div className="doc-info">
                                                <span className="doc-name">{doc.name}</span>
                                            </div>
                                            <button className="doc-download" title="Download">⬇️</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="profile-footer" style={{justifyContent: 'flex-end'}}>
                            <button className="btn btn-secondary" onClick={() => setIsProfileModalOpen(false)}>Close View</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
