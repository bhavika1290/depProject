import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/apiCore';
import './FinalRecommendations.css';

export default function FinalRecommendations() {
    const { currentUser } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch live pool for recommendations
    useEffect(() => {
        const fetchFinalPool = async () => {
            if (!currentUser) return;
            try {
                setLoading(true);
                // Status 'Shortlisted' candidates are the ones to be recommended
                const res = await api.get(`/applications?facultyId=${currentUser.id}&status=Shortlisted`);
                const data = res.data.data;

                const mapped = data.map(app => {
                    const gateExam = app.qualifyingExams?.find(e => e.examName === 'GATE');
                    return {
                        _id: app._id,
                        id: app.applicationId || 'N/A',
                        name: app.personalDetails?.fullName || app.userId?.name || 'N/A',
                        category: app.personalDetails?.category || 'General',
                        mscCgpa: parseFloat(app.educationalDetails?.pg?.cgpa) || 0,
                        gateScore: parseInt(gateExam?.score) || 0,
                        interviewScore: app.interviewScore || 0,
                        researchArea: app.offeringId?.specialization || 'Not Specified',
                        status: app.result || 'Pending', // Selected, Rejected, Waitlisted, Pending
                        rank: app.admissionRank || '',
                        remarks: app.facultyRemarks || ''
                    };
                });
                setCandidates(mapped);
            } catch (err) {
                console.error('Failed to fetch final pool', err);
                toast.error('Failed to load live data.');
            } finally {
                setLoading(false);
            }
        };
        fetchFinalPool();
    }, [currentUser]);
    
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

    // Added Score Change handler since it's present in the table
    const handleScoreChange = (id, newScore) => {
        if (hasSubmitted) return;
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, interviewScore: newScore === '' ? 0 : parseFloat(newScore) } : c));
    };

    const attemptSubmit = () => {
        if (summaryStats.pending > 0) {
            toast.warn(`You still have ${summaryStats.pending} pending candidate(s). Please classify all candidates before submitting.`);
            return;
        }
        setIsConfirmOpen(true);
    };

    const commitSubmission = async () => {
        setIsConfirmOpen(false);
        try {
            setLoading(true);
            const updates = candidates.map(c => {
                // Map local status (Recommended/Rejected/Waitlisted) to backend 'result' and 'status'
                let finalResult = c.status;
                let finalStatus = c.status;

                if (c.status === 'Recommended') {
                    finalResult = 'Selected';
                    finalStatus = 'Accepted';
                }

                return api.put(`/applications/${c._id}/status`, {
                    result: finalResult,
                    status: finalStatus,
                    interviewStatus: 'Completed',
                    interviewScore: c.interviewScore,
                    admissionRank: c.rank || undefined,
                    facultyRemarks: c.remarks
                });
            });

            const results = await Promise.allSettled(updates);
            const rejected = results.filter(r => r.status === 'rejected');

            if (rejected.length > 0) {
                console.error('Some updates failed:', rejected);
                toast.error(`Failed to update ${rejected.length} candidates. Please try again.`);
                return;
            }

            setHasSubmitted(true);
            toast.success('Final Recommendations successfully submitted to the Department Committee!');
        } catch (err) {
            console.error('Final submission failed', err);
            toast.error('Failed to submit final recommendations.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748b' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }}></div>
                <p>Loading final recommendation pool...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

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
                                            <div className="score-input-wrap">
                                                <input 
                                                    type="number" 
                                                    className="score-input" 
                                                    min="0" 
                                                    max="100" 
                                                    value={c.interviewScore} 
                                                    onChange={e => handleScoreChange(c.id, e.target.value)}
                                                />
                                                <span className="score-max">/ 100</span>
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
