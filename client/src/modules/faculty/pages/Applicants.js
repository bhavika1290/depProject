import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/apiCore';
import './Applicants.css';

export default function Applicants() {
    const { currentUser } = useAuth();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch real applications on mount
    useEffect(() => {
        const fetchApplications = async () => {
            if (!currentUser) return;
            try {
                setLoading(true);
                const res = await api.get(`/applications?facultyId=${currentUser.id}`);
                const data = res.data.data;
                
                // Map API payload back to the rich dummy structure UI expects
                const mappedApplicants = data.map(app => {
                    const gateExam = app.qualifyingExams?.find(e => e.examName === 'GATE');
                    const netExam = app.qualifyingExams?.find(e => e.examName === 'CSIR-NET' || e.examName === 'UGC-NET');
                    const nbhmExam = app.qualifyingExams?.find(e => e.examName === 'NBHM');

                    // Best effort mapping to documents visually
                    const mappedDocs = [];
                    if (app.documents?.marksheets) mappedDocs.push({ name: 'Marksheets.zip', type: 'Transcript' });
                    if (app.documents?.certificates) mappedDocs.push({ name: 'Certificates.zip', type: 'Other' });
                    app.documents?.other?.forEach((doc, i) => mappedDocs.push({ name: `Other_Doc_${i+1}.pdf`, type: 'Other' }));
                    if (mappedDocs.length === 0) mappedDocs.push({ name: 'Application_Snapshot.pdf', type: 'System Generated' });

                    return {
                        _id: app._id, // Raw backend ID for updates
                        id: app.applicationId || 'N/A',
                        name: app.personalDetails?.fullName || app.userId?.name || 'N/A',
                        category: app.personalDetails?.category || 'General',
                        mscCgpa: parseFloat(app.educationalDetails?.pg?.cgpa) || 0,
                        bscCgpa: parseFloat(app.educationalDetails?.ug?.cgpa) || 0,
                        gateScore: parseInt(gateExam?.score) || 0,
                        csirNet: !!netExam,
                        nbhm: !!nbhmExam,
                        researchArea: app.offeringId?.specialization || 'Not Specified',
                        status: app.status || 'Draft',
                        applicationDate: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Unknown',
                        phone: app.communicationDetails?.phone || 'Not Provided',
                        email: app.userId?.email || 'No Email',
                        college: app.educationalDetails?.pg?.college || app.educationalDetails?.ug?.college || 'Not Specified',
                        sop: app.generalApplicationDetails?.specificAreaOfResearch || 'N/A',
                        publications: app.publications?.length || 0,
                        documents: mappedDocs
                    };
                });
                
                setApplicants(mappedApplicants);
            } catch (err) {
                console.error('Failed to fetch applications', err);
                toast.error('Failed to load real applicants data');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [currentUser]);

    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [areaFilter, setAreaFilter] = useState('All');

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Shown more for this table

    // Modal state
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Helper sorting function
    const handleSort = (key) => {
        let direction = 'desc'; // Default to descending for things like scores
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Derived States
    const filteredAndSortedApplicants = useMemo(() => {
        let result = applicants.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  app.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesArea = areaFilter === 'All' || app.researchArea === areaFilter;
            return matchesSearch && matchesArea;
        });

        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return result;
    }, [applicants, searchTerm, areaFilter, sortConfig]);

    const totalPages = Math.ceil(filteredAndSortedApplicants.length / itemsPerPage);
    const currentApplicants = filteredAndSortedApplicants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Extract unique research areas for filter dropdown
    const researchAreas = useMemo(() => {
        const areas = new Set(applicants.map(app => app.researchArea));
        return ['All', ...Array.from(areas)];
    }, [applicants]);

    // Handlers
    // handleSort is already defined above the useMemo block, moving it here for consistency
    // const handleSort = (key) => {
    //     let direction = 'desc'; // Default to descending for things like scores
    //     if (sortConfig.key === key && sortConfig.direction === 'desc') {
    //         direction = 'asc';
    //     }
    //     setSortConfig({ key, direction });
    // };

    const handleViewProfile = (applicant) => {
        setSelectedApplicant(applicant);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        // Find the raw _id for the API call
        const applicantToUpdate = applicants.find(app => app.id === id);
        if (!applicantToUpdate || !applicantToUpdate._id) return;

        try {
            await api.put(`/applications/${applicantToUpdate._id}/status`, { status: newStatus });

            setApplicants(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
            if (newStatus === 'Shortlisted') {
                toast.success(`Applicant ${id} successfully shortlisted!`);
            } else if (newStatus === 'Rejected') {
                toast.info(`Applicant ${id} moved to rejected list.`);
            }

            // Update modal state if it's currently open
            if (selectedApplicant && selectedApplicant.id === id) {
                setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Status update failed', error);
            toast.error('Failed to update applicant status');
        }
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="applicants-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="header-title">
                    <h2>Applicants List</h2>
                    <p>Review, filter, and shortlist students who have applied to your openings.</p>
                </div>
                <Link to="/faculty/applicants/filter" className="btn-advanced-screening" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '12px 20px', 
                    backgroundColor: '#4f46e5', 
                    color: 'white', 
                    borderRadius: '10px', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                    fontSize: '0.95rem'
                }}>
                    <span className="icon">🎯</span> Advanced Smart Filter
                </Link>
            </div>

            {/* Controls */}
            <div className="controls-container">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by Applicant Name or ID..."
                        value={searchTerm}
                        onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                        className="control-input"
                    />
                </div>

                <div className="filter-box">
                    <label>Research Area:</label>
                    <select
                        value={areaFilter}
                        onChange={(e) => {setAreaFilter(e.target.value); setCurrentPage(1);}}
                        className="control-input select-input"
                    >
                        {researchAreas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                {filteredAndSortedApplicants.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📂</div>
                        <h3>No Applicants Found</h3>
                        <p>No records match your current criteria.</p>
                        <button className="btn btn-secondary mt-3" onClick={() => { setSearchTerm(''); setAreaFilter('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <table className="applicants-table">
                            <thead>
                                <tr>
                                    <th>ID / Name</th>
                                    <th>Category</th>
                                    <th className="sortable-header" onClick={() => handleSort('bscCgpa')}>
                                        BSc CGPA <span className="sort-icon">{getSortIndicator('bscCgpa')}</span>
                                    </th>
                                    <th className="sortable-header" onClick={() => handleSort('mscCgpa')}>
                                        MSc CGPA <span className="sort-icon">{getSortIndicator('mscCgpa')}</span>
                                    </th>
                                    <th className="sortable-header" onClick={() => handleSort('gateScore')}>
                                        GATE Score <span className="sort-icon">{getSortIndicator('gateScore')}</span>
                                    </th>
                                    <th>CSIR/NBHM</th>
                                    <th>Research Area</th>
                                    <th>Status</th>
                                    <th className="actions-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentApplicants.map(app => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className="cell-title">{app.name}</div>
                                            <div className="cell-subtitle">{app.id}</div>
                                        </td>
                                        <td>{app.category}</td>
                                        <td><span className="highlight-stat">{app.bscCgpa}</span></td>
                                        <td><span className="highlight-stat">{app.mscCgpa}</span></td>
                                        <td><span className="highlight-stat gate-stat">{app.gateScore || 'N/A'}</span></td>
                                        <td>
                                            <div style={{display:'flex', flexDirection:'column', gap:'4px', fontSize:'0.85rem'}}>
                                                <span className={app.csirNet ? "text-success" : "text-muted"}>CSIR: {app.csirNet ? 'Yes' : 'No'}</span>
                                                <span className={app.nbhm ? "text-success" : "text-muted"}>NBHM: {app.nbhm ? 'Yes' : 'No'}</span>
                                            </div>
                                        </td>
                                        <td>{app.researchArea}</td>
                                        <td>
                                            <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button className="btn-action view-btn tooltip-trigger" onClick={() => handleViewProfile(app)} title="View Profile">
                                                    👁️
                                                </button>
                                                <button
                                                    className="btn-action shortlist-btn tooltip-trigger"
                                                    onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                                                    title="Shortlist"
                                                    disabled={app.status === 'Shortlisted'}
                                                >
                                                    ✅
                                                </button>
                                                <button
                                                    className="btn-action reject-btn tooltip-trigger"
                                                    onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                                    title="Reject"
                                                    disabled={app.status === 'Rejected'}
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <span className="pagination-info">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedApplicants.length)} of {filteredAndSortedApplicants.length} applicants
                                </span>
                                <div className="pagination-controls">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* View Full Profile Modal */}
            {isModalOpen && selectedApplicant && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>

                        {/* Modal Header inside Profile format */}
                        <div className="profile-header">
                            <div className="profile-header-info">
                                <div className="profile-avatar">{selectedApplicant.name.charAt(0)}</div>
                                <div>
                                    <h3 className="profile-name">{selectedApplicant.name}</h3>
                                    <div className="profile-id">{selectedApplicant.id} | {selectedApplicant.email} | {selectedApplicant.phone}</div>
                                </div>
                            </div>
                            <div className="profile-header-actions">
                                <span className={`status-badge status-${selectedApplicant.status.toLowerCase()} large-badge`}>
                                    {selectedApplicant.status}
                                </span>
                                <button className="close-profile-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                        </div>

                        <div className="profile-body">
                            {/* Row 1: Split into Academics & Tests */}
                            <div className="profile-grid-2">
                                <div className="profile-card">
                                    <h4 className="card-title">Academic Background</h4>
                                    <div className="card-row"><strong>College/University:</strong> {selectedApplicant.college}</div>
                                    <div className="card-row"><strong>MSc Mathematics CGPA:</strong> <span className="highlight-stat">{selectedApplicant.mscCgpa}</span></div>
                                    <div className="card-row"><strong>BSc Mathematics CGPA:</strong> <span className="highlight-stat">{selectedApplicant.bscCgpa}</span></div>
                                </div>

                                <div className="profile-card">
                                    <h4 className="card-title">Test Scores & Details</h4>
                                    <div className="card-row"><strong>GATE Math Score:</strong> {selectedApplicant.gateScore}</div>
                                    <div className="card-row"><strong>CSIR-NET Math Sciences:</strong> {selectedApplicant.csirNet ? 'Yes' : 'No'}</div>
                                    <div className="card-row"><strong>NBHM Qualification:</strong> {selectedApplicant.nbhm ? 'Yes' : 'No'}</div>
                                    <div className="card-row"><strong>Category:</strong> {selectedApplicant.category}</div>
                                </div>
                            </div>

                            {/* Row 2: Application Details */}
                            <div className="profile-card full-width mt-4">
                                <h4 className="card-title">Application Details</h4>
                                <div className="profile-grid-2 nested">
                                    <div className="card-row"><strong>Date Applied:</strong> {selectedApplicant.applicationDate}</div>
                                    <div className="card-row"><strong>Research Area:</strong> {selectedApplicant.researchArea}</div>
                                    <div className="card-row full-width"><strong>Publications:</strong> {selectedApplicant.publications} Publications</div>
                                </div>
                                <div className="card-row full-width sop-box mt-3">
                                    <strong>Statement of Purpose Snippet:</strong>
                                    <p className="sop-text">"{selectedApplicant.sop}"</p>
                                </div>
                            </div>

                            {/* Row 3: Documents */}
                            <div className="profile-card full-width mt-4">
                                <h4 className="card-title">Uploaded Documents</h4>
                                <div className="documents-grid">
                                    {selectedApplicant.documents.map((doc, idx) => (
                                        <div key={idx} className="document-item">
                                            <span className="doc-icon">📄</span>
                                            <div className="doc-info">
                                                <span className="doc-name">{doc.name}</span>
                                                <span className="doc-type">{doc.type}</span>
                                            </div>
                                            <button className="doc-download" title="Download">⬇️</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="profile-footer">
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close Menu</button>
                            <div className="footer-actions">
                                {selectedApplicant.status !== 'Rejected' && (
                                    <button 
                                        className="btn btn-outline-danger" 
                                        onClick={() => handleStatusUpdate(selectedApplicant.id, 'Rejected')}
                                    >
                                        Reject Candidate
                                    </button>
                                )}
                                {selectedApplicant.status !== 'Shortlisted' && (
                                    <button 
                                        className="btn btn-success" 
                                        onClick={() => handleStatusUpdate(selectedApplicant.id, 'Shortlisted')}
                                    >
                                        Shortlist Candidate
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
