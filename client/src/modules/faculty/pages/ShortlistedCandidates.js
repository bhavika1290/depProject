import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import './ShortlistedCandidates.css'; // Will create this

// Dummy candidates strictly for the Shortlisted phase
const initialShortlisted = [
    {
        id: 'APP2026-002',
        name: 'Sneha Patel',
        email: 'patel.s@example.com',
        phone: '+91 8765432109',
        category: 'OBC',
        mscCgpa: 9.1,
        bscCgpa: 8.8,
        gateScore: 720,
        csirNetQualified: 'Yes',
        nbhmQualified: 'No',
        researchArea: 'Topology',
        researchExperience: 12,
        universityRanking: 25,
        hasPublications: 'Yes',
        interviewStatus: 'Scheduled',
        interviewDate: '2026-03-20T10:00',
        university: 'IIT Bombay',
        sop: 'Masters thesis focused on Knot invariants.',
        documents: [{ name: 'SOP.pdf', type: 'SOP' }, { name: 'Gate_Scorecard.pdf', type: 'Scorecard' }]
    },
    {
        id: 'APP2026-004',
        name: 'Priya Mehta',
        email: 'p.mehta99@example.com',
        phone: '+91 6543210987',
        category: 'General',
        mscCgpa: 8.6,
        bscCgpa: 8.3,
        gateScore: 610,
        csirNetQualified: 'No',
        nbhmQualified: 'Yes',
        researchArea: 'Probability Theory',
        researchExperience: 6,
        universityRanking: 5,
        hasPublications: 'Yes',
        interviewStatus: 'Pending Scheduling',
        interviewDate: null,
        university: 'IISER Pune',
        sop: 'Stochastic Processes in Financial Markets.',
        documents: [{ name: 'SOP.pdf', type: 'SOP' }]
    },
    {
        id: 'APP2026-008',
        name: 'Rahul Gupta',
        email: 'rahul.g@example.com',
        phone: '+91 9111222333',
        category: 'General',
        mscCgpa: 9.3,
        bscCgpa: 9.0,
        gateScore: 780,
        csirNetQualified: 'Yes (JRF)',
        nbhmQualified: 'Yes',
        researchArea: 'Algebra',
        researchExperience: 24,
        universityRanking: 2,
        hasPublications: 'Yes',
        interviewStatus: 'Selected',
        interviewDate: '2026-03-15T14:30',
        university: 'TIFR Mumbai',
        sop: 'Interested in Algebraic K-theory...',
        documents: [{ name: 'CV_Rahul.pdf', type: 'Resume' }]
    }
];

export default function ShortlistedCandidates() {
    const [candidates, setCandidates] = useState(initialShortlisted);
    
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
    const handleRemove = (id) => {
        if(window.confirm('Are you sure you want to remove this candidate from the Shortlist? They will be demoted back to Applied status.')) {
            setCandidates(prev => prev.filter(c => c.id !== id));
            toast.info(`Candidate ${id} removed from shortlist.`);
        }
    };

    const handleUpdateStatus = (id, newStatus) => {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, interviewStatus: newStatus } : c));
        let type = newStatus === 'Selected' ? toast.success : newStatus === 'Rejected' ? toast.error : toast.info;
        type(`Candidate marked as ${newStatus}.`);
    };

    const openScheduleModal = (candidate) => {
        setCandidateToSchedule(candidate);
        setScheduleDate('');
        setScheduleTime('');
        setIsScheduleModalOpen(true);
    };

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        if(!scheduleDate || !scheduleTime) {
            toast.error('Date and time are required.');
            return;
        }
        
        const datetime = `${scheduleDate}T${scheduleTime}`;
        
        setCandidates(prev => prev.map(c => 
            c.id === candidateToSchedule.id 
                ? { ...c, interviewStatus: 'Scheduled', interviewDate: datetime } 
                : c
        ));
        
        toast.success(`Interview scheduled for ${candidateToSchedule.name}`);
        setIsScheduleModalOpen(false);
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
