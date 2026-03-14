
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './MyOpenings.css';

// Dummy data for initial visualization
const initialOpenings = [
    {
        id: 'OPN-2026-001',
        researchArea: 'Algebra',
        projectTitle: 'Representations of Finite Groups',
        department: 'Mathematics',
        positions: 2,
        fundingType: 'Institute Fellowship',
        deadline: '2026-04-15',
        status: 'Active',
        applicantsCount: 45,
        eligibility: {
            minMscCgpa: 7.5,
            minBscCgpa: 7.0,
            gateRequired: true,
            csirNetRequired: false,
            nbhmRequired: true
        },
        categories: ['General', 'OBC'],
        experience: 0,
        descriptionFile: 'algebra_project.pdf',
        eligibilityFile: 'algebra_eligibility.pdf',
        keywords: 'Group Theory, Representation Theory'
    },
    {
        id: 'OPN-2026-002',
        researchArea: 'Topology',
        projectTitle: 'Algebraic Topology and Knot Theory',
        department: 'Mathematics',
        positions: 1,
        fundingType: 'Project Funded',
        deadline: '2026-05-01',
        status: 'Active',
        applicantsCount: 12,
        eligibility: {
            minMscCgpa: 8.0,
            minBscCgpa: 7.5,
            gateRequired: true,
            csirNetRequired: true,
            nbhmRequired: false
        },
        categories: ['General', 'SC'],
        experience: 0,
        descriptionFile: 'topology_project.pdf',
        eligibilityFile: 'topology_eligibility.pdf',
        keywords: 'Algebraic Topology, Knot Theory, Manifolds'
    },
    {
        id: 'OPN-2026-003',
        researchArea: 'Numerical Analysis',
        projectTitle: 'Numerical Methods for PDEs',
        department: 'Mathematics',
        positions: 3,
        fundingType: 'External Fellowship',
        deadline: '2026-03-01',
        status: 'Closed',
        applicantsCount: 85,
        eligibility: {
            minMscCgpa: 7.0,
            minBscCgpa: 6.5,
            gateRequired: false,
            csirNetRequired: true,
            nbhmRequired: false
        },
        categories: ['General', 'OBC', 'EWS'],
        experience: 6,
        descriptionFile: 'numerical_pde.pdf',
        eligibilityFile: 'numerical_eligibility.pdf',
        keywords: 'PDEs, Finite Elements, Computational Mathematics'
    },
    {
        id: 'OPN-2026-004',
        researchArea: 'Probability and Statistics',
        projectTitle: 'Stochastic Processes in Finance',
        department: 'Mathematics',
        positions: 2,
        fundingType: 'Institute Fellowship',
        deadline: '2026-06-20',
        status: 'Active',
        applicantsCount: 30,
        eligibility: {
            minMscCgpa: 7.8,
            minBscCgpa: 7.2,
            gateRequired: true,
            csirNetRequired: false,
            nbhmRequired: false
        },
        categories: ['General'],
        experience: 12,
        descriptionFile: 'stochastic_finance.pdf',
        eligibilityFile: 'stochastic_eligibility.pdf',
        keywords: 'Stochastic Calculus, Financial Modeling, Time Series'
    },
    {
        id: 'OPN-2026-005',
        researchArea: 'Differential Geometry',
        projectTitle: 'Geometric Flows and Minimal Surfaces',
        department: 'Mathematics',
        positions: 1,
        fundingType: 'Project Funded',
        deadline: '2026-07-15',
        status: 'Active',
        applicantsCount: 5,
        eligibility: {
            minMscCgpa: 8.5,
            minBscCgpa: 8.0,
            gateRequired: true,
            csirNetRequired: true,
            nbhmRequired: true
        },
        categories: ['General', 'ST'],
        experience: 0,
        descriptionFile: 'geometric_flows.pdf',
        eligibilityFile: 'geometric_eligibility.pdf',
        keywords: 'Riemannian Geometry, Minimal Surfaces, Curvature'
    }
];

export default function MyOpenings() {
    const navigate = useNavigate();
    const [openings, setOpenings] = useState(initialOpenings);
    
    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Modal state
    const [selectedOpening, setSelectedOpening] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Derived State (Filtering and Sorting)
    const filteredOpenings = useMemo(() => {
        return openings.filter(opening => {
            const matchesSearch = 
                opening.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opening.researchArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opening.id.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || opening.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [openings, searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOpenings.length / itemsPerPage);
    const currentOpenings = filteredOpenings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to first page on filter
    };

    const handleViewDetails = (opening) => {
        setSelectedOpening(opening);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOpening(null);
    };

    const handleEditOpening = (id) => {
        // Normally this would navigate to a pre-filled create/edit form
        toast.info(`Edit functionality for ${id} coming soon.`);
    };

    const handleToggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
        setOpenings(prev => prev.map(op => op.id === id ? { ...op, status: newStatus } : op));
        toast.success(`Opening ${id} is now ${newStatus}`);
    };

    const handleDeleteOpening = (id) => {
        setOpenings(prev => prev.filter(op => op.id !== id));
        toast.success(`Opening ${id} deleted successfully.`);
        if (currentOpenings.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="my-openings-container">
            <div className="page-header">
                <div className="header-title">
                    <h2>My Openings</h2>
                    <p>Manage and view the status of all your PhD openings.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/faculty/openings/create')}>
                    <span className="icon">➕</span> Create New Opening
                </button>
            </div>

            {/* Controls Row (Search and Filter) */}
            <div className="controls-container">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search by ID, Title, or Research Area..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="control-input"
                    />
                </div>
                
                <div className="filter-box">
                    <label>Status:</label>
                    <select value={statusFilter} onChange={handleStatusFilterChange} className="control-input select-input">
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                {filteredOpenings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No Openings Found</h3>
                        <p>No openings match your current search and filter criteria.</p>
                        <button className="btn btn-secondary mt-3" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <table className="openings-table">
                            <thead>
                                <tr>
                                    <th>Opening ID</th>
                                    <th>Project Title</th>
                                    <th>Positions</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Applicants</th>
                                    <th className="actions-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOpenings.map(opening => (
                                    <tr key={opening.id}>
                                        <td className="font-medium text-slate-700">{opening.id}</td>
                                        <td>
                                            <div className="cell-title">{opening.projectTitle}</div>
                                            <div className="cell-subtitle">{opening.researchArea}</div>
                                        </td>
                                        <td className="text-center">{opening.positions}</td>
                                        <td>{new Date(opening.deadline).toLocaleDateString('en-GB')}</td>
                                        <td>
                                            <span className={`status-badge ${opening.status.toLowerCase()}`}>
                                                {opening.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="applicant-count" title="Click to view applicants" onClick={() => navigate('/faculty/applicants')}>
                                                {opening.applicantsCount}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button className="icon-btn tooltip-trigger" onClick={() => handleViewDetails(opening)} title="View Details">
                                                    👁️
                                                </button>
                                                <button className="icon-btn tooltip-trigger" onClick={() => handleEditOpening(opening.id)} title="Edit Opening" disabled={opening.status === 'Closed'}>
                                                    ✏️
                                                </button>
                                                <button className="icon-btn tooltip-trigger" onClick={() => handleToggleStatus(opening.id, opening.status)} title={opening.status === 'Active' ? 'Close Opening' : 'Reactivate Opening'}>
                                                    {opening.status === 'Active' ? '⛔' : '🔄'}
                                                </button>
                                                <button className="icon-btn delete-btn tooltip-trigger" onClick={() => handleDeleteOpening(opening.id)} title="Delete Opening">
                                                    🗑️
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
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOpenings.length)} of {filteredOpenings.length} results
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

            {/* View Details Modal */}
            {isModalOpen && selectedOpening && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Opening Details: {selectedOpening.id}</h3>
                            <button className="close-modal-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4>Basic Information</h4>
                                <div className="detail-grid">
                                    <div className="detail-item"><strong>Title:</strong> <br/>{selectedOpening.projectTitle}</div>
                                    <div className="detail-item"><strong>Research Area:</strong> <br/>{selectedOpening.researchArea}</div>
                                    <div className="detail-item"><strong>Department:</strong> <br/>{selectedOpening.department}</div>
                                    <div className="detail-item"><strong>Funding:</strong> <br/>{selectedOpening.fundingType}</div>
                                    <div className="detail-item"><strong>Positions:</strong> <br/>{selectedOpening.positions}</div>
                                    <div className="detail-item"><strong>Deadline:</strong> <br/>{new Date(selectedOpening.deadline).toLocaleDateString('en-GB')}</div>
                                </div>
                            </div>
                            
                            <hr className="detail-divider" />
                            
                            <div className="detail-section">
                                <h4>Eligibility Criteria</h4>
                                <div className="detail-grid">
                                    <p><strong>Min MSc Math CGPA:</strong> {selectedOpening.eligibility.minMscCgpa}</p>
                                    <p><strong>Min BSc Math CGPA:</strong> {selectedOpening.eligibility.minBscCgpa}</p>
                                    <p><strong>GATE Math Required:</strong> {selectedOpening.eligibility.gateRequired ? 'Yes' : 'No'}</p>
                                    <p><strong>CSIR-NET Mathematical Sciences:</strong> {selectedOpening.eligibility.csirNetRequired ? 'Yes' : 'No'}</p>
                                    <p><strong>NBHM Qualified:</strong> {selectedOpening.eligibility.nbhmRequired ? 'Yes' : 'No'}</p>
                                    <div className="detail-item"><strong>Categories:</strong> {selectedOpening.categories.join(', ')}</div>
                                    <div className="detail-item"><strong>Min Experience:</strong> {selectedOpening.experience} months</div>
                                </div>
                            </div>

                            <hr className="detail-divider" />

                            <div className="detail-section">
                                <h4>Additional Info</h4>
                                <div className="detail-grid">
                                    <div className="detail-item full-width"><strong>Keywords:</strong> {selectedOpening.keywords}</div>
                                    {selectedOpening.descriptionFile && (
                                        <div className="detail-item"><strong>Project File:</strong> <span className="doc-link">📄 {selectedOpening.descriptionFile}</span></div>
                                    )}
                                    {selectedOpening.eligibilityFile && (
                                        <div className="detail-item"><strong>Eligibility PDF:</strong> <span className="doc-link">📄 {selectedOpening.eligibilityFile}</span></div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            <button className="btn btn-primary" onClick={() => { handleCloseModal(); navigate('/faculty/applicants'); }}>View Applicants</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
