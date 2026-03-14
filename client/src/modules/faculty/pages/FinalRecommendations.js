import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import './FinalRecommendations.css';

// Dummy candidates representing the final pool post-interview
const initialCandidates = [
    {
        id: 'APP2026-008',
        name: 'Rahul Gupta',
        category: 'General',
        mscCgpa: 9.3,
        gateScore: 780,
        interviewScore: 92, // out of 100
        researchArea: 'Algebra',
        status: 'Pending', // Pending, Recommended, Waitlisted, Rejected
        rank: '',
        remarks: ''
    },
    {
        id: 'APP2026-002',
        name: 'Sneha Patel',
        category: 'OBC',
        mscCgpa: 9.1,
        gateScore: 720,
        interviewScore: 88,
        researchArea: 'Topology',
        status: 'Pending',
        rank: '',
        remarks: ''
    },
    {
        id: 'APP2026-004',
        name: 'Priya Mehta',
        category: 'General',
        mscCgpa: 8.6,
        gateScore: 610,
        interviewScore: 85,
        researchArea: 'Probability Theory',
        status: 'Pending',
        rank: '',
        remarks: ''
    },
    {
        id: 'APP2026-005',
        name: 'Vikram Sharma',
        category: 'EWS',
        mscCgpa: 7.5,
        gateScore: 490,
        interviewScore: 65,
        researchArea: 'Differential Geometry',
        status: 'Pending',
        rank: '',
        remarks: ''
    },
    {
        id: 'APP2026-003',
        name: 'Amit Singh',
        category: 'SC',
        mscCgpa: 8.2,
        gateScore: 580,
        interviewScore: 78,
        researchArea: 'Numerical Analysis',
        status: 'Pending',
        rank: '',
        remarks: ''
    }
];

export default function FinalRecommendations() {
    const [candidates, setCandidates] = useState(initialCandidates);
    
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'interviewScore', direction: 'desc' });
    
    // Submission State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Derived States
    const filteredAndSorted = useMemo(() => {
        let result = candidates.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key) {
            result.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                
                // For Status formatting we'll just alpha sort
                // For rankings we need to handle empty strings
                if (sortConfig.key === 'rank') {
                    valA = valA === '' ? 999 : parseInt(valA);
                    valB = valB === '' ? 999 : parseInt(valB);
                }

                if (valA === null) valA = '';
                if (valB === null) valB = '';

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [candidates, searchTerm, sortConfig]);

    const summaryStats = useMemo(() => {
        return {
            total: candidates.length,
            recommended: candidates.filter(c => c.status === 'Recommended').length,
            waitlisted: candidates.filter(c => c.status === 'Waitlisted').length,
            rejected: candidates.filter(c => c.status === 'Rejected').length,
            pending: candidates.filter(c => c.status === 'Pending').length,
        };
    }, [candidates]);

    // Handlers
    const handleSort = (key) => {
        let direction = 'desc'; // Default numericals to desc
        if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
        if (key === 'name' && sortConfig.key !== key) direction = 'asc';
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handleStatusUpdate = (id, newStatus) => {
        if (hasSubmitted) return;
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    const handleRankChange = (id, newRank) => {
        if (hasSubmitted) return;
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, rank: newRank } : c));
    };

    const handleRemarkChange = (id, newRemark) => {
        if (hasSubmitted) return;
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, remarks: newRemark } : c));
    };

    const attemptSubmit = () => {
        if (summaryStats.pending > 0) {
            toast.warn(`You still have ${summaryStats.pending} pending candidate(s). Please classify all candidates before submitting.`);
            return;
        }
        setIsConfirmOpen(true);
    };

    const commitSubmission = () => {
        setIsConfirmOpen(false);
        setHasSubmitted(true);
        toast.success('Final Recommendations successfully submitted to the Department Committee!');
    };

    return (
        <div className="recommendations-container">
            <div className="page-header">
                <div className="header-title">
                    <h2>Final Recommendations</h2>
                    <p>Classify post-interview candidates, attach your rankings/remarks, and submit to the admissions committee.</p>
                </div>
            </div>

            {hasSubmitted ? (
                <div className="success-banner fade-in">
                    <div className="success-icon">🎉</div>
                    <h3>Submission Complete</h3>
                    <p>Your recommendations have been locked and dispatched to the Core Committee for final review.</p>
                    <div className="summary-pills mt-3">
                        <span className="pill pill-green">{summaryStats.recommended} Recommended</span>
                        <span className="pill pill-yellow">{summaryStats.waitlisted} Waitlisted</span>
                        <span className="pill pill-red">{summaryStats.rejected} Rejected</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Controls & Summary Bar */}
                    <div className="top-action-bar">
                        <div className="stats-group">
                            <div className="stat-item">
                                <span className="stat-val">{summaryStats.total}</span>
                                <span className="stat-lbl">Total</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-val text-pending">{summaryStats.pending}</span>
                                <span className="stat-lbl">Pending</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-val text-success">{summaryStats.recommended}</span>
                                <span className="stat-lbl">Recommended</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-val text-warning">{summaryStats.waitlisted}</span>
                                <span className="stat-lbl">Waitlisted</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-val text-danger">{summaryStats.rejected}</span>
                                <span className="stat-lbl">Rejected</span>
                            </div>
                        </div>

                        <div className="search-box rec-search">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search Name..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="control-input"
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="table-responsive">
                        <table className="rec-table">
                            <thead>
                                <tr>
                                    <th className="sortable-header" onClick={() => handleSort('name')}>
                                        Candidate <span className="sort-icon">{getSortIndicator('name')}</span>
                                    </th>
                                    <th>Metrics</th>
                                    <th className="sortable-header" onClick={() => handleSort('interviewScore')}>
                                        Inter. Score <span className="sort-icon">{getSortIndicator('interviewScore')}</span>
                                    </th>
                                    <th className="sortable-header" onClick={() => handleSort('rank')}>
                                        Rank <span className="sort-icon">{getSortIndicator('rank')}</span>
                                    </th>
                                    <th>Faculty Remarks</th>
                                    <th className="actions-header text-right">Final Decision</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSorted.map(c => (
                                    <tr key={c.id} className={`row-status-${c.status.toLowerCase()}`}>
                                        <td>
                                            <div className="cell-title">{c.name}</div>
                                            <div className="cell-subtitle">{c.id}</div>
                                        </td>
                                        <td>
                                            <div className="metric-line">
                                                <span className="m-lbl">MSc Math CGPA:</span> <span className="m-val">{c.mscCgpa}</span>
                                            </div>
                                            {c.gateScore && (
                                                <div className="metric-line">
                                                    <span className="m-lbl">GATE:</span> <span className="m-val">{c.gateScore}</span>
                                                </div>
                                            )}
                                            <div className="metric-line">
                                                <span className="m-lbl">Area:</span> <span className="m-val limit-text" title={c.researchArea}>{c.researchArea}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="score-badge">
                                                {c.interviewScore} / 100
                                            </div>
                                        </td>
                                        <td>
                                            {c.status === 'Recommended' || c.status === 'Waitlisted' ? (
                                                <input 
                                                    type="number" 
                                                    className="rank-input" 
                                                    min="1" 
                                                    max="99" 
                                                    placeholder="#"
                                                    value={c.rank} 
                                                    onChange={e => handleRankChange(c.id, e.target.value)}
                                                />
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td className="remarks-cell">
                                            <input 
                                                type="text" 
                                                className="remarks-input" 
                                                placeholder="Add notes for committee..." 
                                                value={c.remarks} 
                                                onChange={e => handleRemarkChange(c.id, e.target.value)}
                                            />
                                        </td>
                                        <td className="decision-cell">
                                            <div className="decision-group">
                                                <button 
                                                    className={`d-btn d-rec ${c.status === 'Recommended' ? 'active' : ''}`}
                                                    onClick={() => handleStatusUpdate(c.id, 'Recommended')}
                                                    title="Recommend for Admission"
                                                >
                                                    REC
                                                </button>
                                                <button 
                                                    className={`d-btn d-wait ${c.status === 'Waitlisted' ? 'active' : ''}`}
                                                    onClick={() => handleStatusUpdate(c.id, 'Waitlisted')}
                                                    title="Waitlist"
                                                >
                                                    WL
                                                </button>
                                                <button 
                                                    className={`d-btn d-rej ${c.status === 'Rejected' ? 'active' : ''}`}
                                                    onClick={() => handleStatusUpdate(c.id, 'Rejected')}
                                                    title="Reject"
                                                >
                                                    REJ
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Floating Submit Bar */}
                    <div className="bottom-submit-bar">
                        <div className="submit-info">
                            <span className="info-icon">ℹ️</span>
                            Ensure all {candidates.length} candidates are classified before submitting. Rankings are optional but helpful.
                        </div>
                        <button 
                            className={`btn btn-primary submit-committee-btn ${summaryStats.pending > 0 ? 'disabled' : ''}`}
                            onClick={attemptSubmit}
                        >
                            📤 Submit Recommendations to Committee
                        </button>
                    </div>
                </>
            )}

            {/* Confirmation Modal */}
            {isConfirmOpen && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <div className="modal-header">
                            <h3>Confirm Final Submission</h3>
                            <button className="close-btn" onClick={() => setIsConfirmOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body text-center">
                            <div className="warning-icon">⚠️</div>
                            <h4 className="mt-3 mb-2">Are you completely sure?</h4>
                            <p className="text-muted mb-4">You are about to submit the following candidate distributions to the Department Committee. This action cannot be undone.</p>
                            
                            <div className="confirm-stats-box">
                                <div className="c-stat">
                                    <span className="c-val text-success">{summaryStats.recommended}</span>
                                    <span className="c-lbl">Recommended</span>
                                </div>
                                <div className="c-stat">
                                    <span className="c-val text-warning">{summaryStats.waitlisted}</span>
                                    <span className="c-lbl">Waitlisted</span>
                                </div>
                                <div className="c-stat">
                                    <span className="c-val text-danger">{summaryStats.rejected}</span>
                                    <span className="c-lbl">Rejected</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-between mt-4">
                            <button className="btn btn-secondary w-half" onClick={() => setIsConfirmOpen(false)}>Back to Editing</button>
                            <button className="btn btn-primary w-half" onClick={commitSubmission}>Confirm & Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
