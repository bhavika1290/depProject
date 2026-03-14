import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import './FilterSortApplicants.css';

// Extended Dummy Data for strict screening
const initialApplicants = [
    {
        id: 'APP2026-001', name: 'Ravi Kumar', email: 'ravi.k@example.com', phone: '+91 9876543210',
        category: 'General', mscCgpa: 8.9, bscCgpa: 8.5, gateScore: 650, 
        csirNetQualified: 'Yes', nbhmQualified: 'Yes', researchArea: 'Algebra', 
        researchExperience: 18, universityRanking: 15, hasPublications: 'Yes',
        status: 'Applied', gateYear: 2026, university: 'Delhi University', graduationYear: 2025,
        sop: 'Deeply interested in Group Theory. Proficient in GAP and MAGMA.',
        documents: [{ name: 'SOP.pdf', type: 'SOP' }, { name: 'MSc_Transcript.pdf', type: 'Transcript' }]
    },
    {
        id: 'APP2026-002', name: 'Sneha Patel', email: 'patel.s@example.com', phone: '+91 8765432109',
        category: 'OBC', mscCgpa: 9.1, bscCgpa: 8.8, gateScore: 720, 
        csirNetQualified: 'Yes', nbhmQualified: 'No', researchArea: 'Topology', 
        researchExperience: 12, universityRanking: 25, hasPublications: 'Yes',
        status: 'Applied', gateYear: 2026, university: 'IIT Bombay', graduationYear: 2025,
        sop: 'Masters thesis focused on Knot invariants. Published 2 papers.',
        documents: [{ name: 'SOP.pdf', type: 'SOP' }, { name: 'Gate_Scorecard.pdf', type: 'Scorecard' }]
    },
    {
        id: 'APP2026-003', name: 'Amit Singh', email: 'amit.math@example.com', phone: '+91 7654321098',
        category: 'SC', mscCgpa: 8.2, bscCgpa: 7.9, gateScore: 580, 
        csirNetQualified: 'No', nbhmQualified: 'No', researchArea: 'Numerical Analysis', 
        researchExperience: 0, universityRanking: 18, hasPublications: 'No',
        status: 'Applied', gateYear: 2025, university: 'Panjab University', graduationYear: 2025,
        sop: 'Eager to work on computational scaling of nonlinear PDEs. Strong programming skills.',
        documents: [{ name: 'SOP.pdf', type: 'SOP' }, { name: 'MSc_Transcript.pdf', type: 'Transcript' }]
    },
    {
        id: 'APP2026-004', name: 'Priya Mehta', email: 'p.mehta99@example.com', phone: '+91 6543210987',
        category: 'General', mscCgpa: 8.6, bscCgpa: 8.3, gateScore: 610, 
        csirNetQualified: 'No', nbhmQualified: 'Yes', researchArea: 'Probability Theory', 
        researchExperience: 6, universityRanking: 5, hasPublications: 'Yes',
        status: 'Applied', gateYear: 2026, university: 'IISER Pune', graduationYear: 2025,
        sop: 'Looking to dive deep into Stochastic Processes in Financial Markets.',
        documents: [{ name: 'SOP.pdf', type: 'SOP' }]
    },
    {
        id: 'APP2026-005', name: 'Vikram Sharma', email: 'vikram.s@example.com', phone: '+91 5432109876',
        category: 'EWS', mscCgpa: 7.5, bscCgpa: 7.2, gateScore: 490, 
        csirNetQualified: 'No', nbhmQualified: 'No', researchArea: 'Differential Geometry', 
        researchExperience: 0, universityRanking: 45, hasPublications: 'No',
        status: 'Applied', gateYear: 2024, university: 'NIT Kurukshetra', graduationYear: 2024,
        sop: 'Interested in Riemannian manifolds.',
        documents: [{ name: 'SOP.pdf', type: 'SOP' }]
    }
];

// Initial Filter States
const defaultFilters = {
    minMscCgpa: 0,
    minBscCgpa: 0,
    minGateScore: 0,
    csirNetQualified: 'All',
    nbhmQualified: 'All',
    category: 'All',
    researchArea: 'All',
    relevantExperience: 'All', // 'All', 'Yes', 'No'
    maxUniversityRanking: 100, // lower is better, 100 basically means no limit
    hasPublications: 'All',
    customKeywords: [] // custom typed criteria
};

export default function FilterSortApplicants() {
    const [applicants, setApplicants] = useState(initialApplicants);
    
    // Draft filters are bound to inputs. They don't affect table until "Apply" is clicked.
    const [draftFilters, setDraftFilters] = useState(defaultFilters);
    // Active filters are what the table uses to render.
    const [activeFilters, setActiveFilters] = useState(defaultFilters);
    
    // Sort Config
    const [sortConfig, setSortConfig] = useState({ key: 'matchingScore', direction: 'desc' });

    // Custom Keyword Draft Input String
    const [newKeyword, setNewKeyword] = useState('');

    // Modal state
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Scoring Engine (Dummy implementation) ---
    // Generates a dynamic matching score based on active filters and hardcoded logic.
    // In a real app, this might come from the backend.
    const calculateMatchingScore = (app, filters) => {
        let score = 0;
        
        // Base points
        score += (app.mscCgpa / 10) * 15; // Max 15 points for MSc CGPA 10.0
        score += (app.bscCgpa / 10) * 15; // Max 15 points for BSc CGPA 10.0
        
        // Tests
        if (app.gateScore) score += Math.min((app.gateScore / 1000) * 15, 15);
        if (app.csirNetQualified === 'Yes') score += 10;
        if (app.nbhmQualified === 'Yes') score += 10;
        
        // Experience / Pubs
        if (app.hasPublications === 'Yes') score += 10;
        
        if (app.researchExperience > 0) {
            score += Math.min((app.researchExperience / 24) * 10, 10); // Max 10 pts for 2 yrs exp
        }
        
        // University ranking (lower rank gets more points)
        if (app.universityRanking <= 10) score += 10;
        else if (app.universityRanking <= 30) score += 5;

        // Add contextual points based on filters
        if (filters.researchArea !== 'All' && filters.researchArea === app.researchArea) score += 10;
        
        // Add points for matching custom keywords
        if (filters.customKeywords && filters.customKeywords.length > 0) {
            const sopText = (app.sop || '').toLowerCase();
            let matchCount = 0;
            filters.customKeywords.forEach(kw => {
                if (sopText.includes(kw.toLowerCase())) matchCount++;
            });
            score += (matchCount / filters.customKeywords.length) * 15; // up to 15 bonus points
        }
        
        return Math.min(Math.round(score), 100);
    };

    // Derived States
    // We compute the arrays purely based on `activeFilters` so typing in inputs doesn't cause jitter
    const filteredAndSortedApplicants = useMemo(() => {
        // 1. Calculate scores and map
        let processed = applicants.map(app => ({
            ...app,
            matchingScore: calculateMatchingScore(app, activeFilters)
        }));

        // 2. Filter dynamically based on active filters
        processed = processed.filter(app => {
            if (activeFilters.minMscCgpa > 0 && app.mscCgpa < activeFilters.minMscCgpa) return false;
            if (activeFilters.minBscCgpa > 0 && app.bscCgpa < activeFilters.minBscCgpa) return false;
            if (activeFilters.minGateScore > 0 && (app.gateScore || 0) < activeFilters.minGateScore) return false;
            if (activeFilters.csirNetQualified !== 'All' && app.csirNetQualified !== activeFilters.csirNetQualified) return false;
            if (activeFilters.nbhmQualified !== 'All' && app.nbhmQualified !== activeFilters.nbhmQualified) return false;
            if (activeFilters.category !== 'All' && app.category !== activeFilters.category) return false;
            if (activeFilters.researchArea !== 'All' && app.researchArea !== activeFilters.researchArea) return false;
            
            if (activeFilters.relevantExperience === 'Yes' && app.researchExperience <= 0) return false;
            if (activeFilters.relevantExperience === 'No' && app.researchExperience > 0) return false;
            
            if (app.universityRanking > activeFilters.maxUniversityRanking) return false;
            if (activeFilters.hasPublications !== 'All' && app.hasPublications !== activeFilters.hasPublications) return false;
            
            // Custom Strict Keywords check (Must exist in SOP)
            if (activeFilters.customKeywords && activeFilters.customKeywords.length > 0) {
                const sopText = (app.sop || '').toLowerCase();
                const missingKeyword = activeFilters.customKeywords.find(kw => !sopText.includes(kw.toLowerCase()));
                if (missingKeyword) return false;
            }

            // Only hide people who are already shortlisted or rejected from this view to keep it clean, 
            // but for this demo standard "Applied" is default
            if (app.status === 'Shortlisted') return false; 
            
            return true;
        });

        // 3. Sort
        if (sortConfig.key) {
            processed.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return processed;
    }, [applicants, activeFilters, sortConfig]);

    // Handlers
    const handleDraftChange = (field, value) => {
        setDraftFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        setActiveFilters({ ...draftFilters, customKeywords: [...(draftFilters.customKeywords || [])] });
        setNewKeyword('');
        toast.info('Filters applied. Refreshing results...');
    };

    const handleResetFilters = () => {
        setDraftFilters(defaultFilters);
        setActiveFilters(defaultFilters);
        setNewKeyword('');
        toast.info('Filters cleared.');
    };

    const handleSort = (key) => {
        let direction = 'desc'; // Default descending for scores
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handleViewProfile = (applicant) => {
        setSelectedApplicant(applicant);
        setIsModalOpen(true);
    };

    const handleShortlist = (id) => {
        setApplicants(prev => prev.map(app => app.id === id ? { ...app, status: 'Shortlisted' } : app));
        toast.success(`Applicant successfully sent to "Shortlisted Candidates".`);
    };

    // Dropdown population
    const researchAreas = [
        'All', 'Algebra', 'Topology', 'Numerical Analysis', 'Probability Theory', 
        'Differential Geometry', 'Statistics', 'Mathematical Physics'
    ];
    const categories = ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'];

    // Keyword Handlers
    const handleAddKeyword = () => {
        if (!newKeyword.trim()) return;
        const kw = newKeyword.trim();
        if (!(draftFilters.customKeywords || []).includes(kw)) {
            setDraftFilters(prev => ({
                ...prev,
                customKeywords: [...(prev.customKeywords || []), kw]
            }));
        }
        setNewKeyword('');
    };

    const handleRemoveKeyword = (kwToRemove) => {
        setDraftFilters(prev => ({
            ...prev,
            customKeywords: (prev.customKeywords || []).filter(kw => kw !== kwToRemove)
        }));
    };

    return (
        <div className="filter-sort-container">
            <div className="page-header">
                <div className="header-title">
                    <h2>Filter and Sort Applicants</h2>
                    <p>Smart Screening System: Apply strict parameters to auto-generate matching scores and find top candidates.</p>
                </div>
            </div>

            <div className="split-layout">
                {/* LEFT PANEL: FILTERS */}
                <aside className="filters-panel">
                    <div className="panel-header">
                        <h3>Screening Parameters</h3>
                        <span className="draft-indicator">Draft Mode</span>
                    </div>
                    
                    <div className="filters-body">
                        {/* 1. Academic Filters */}
                        <div className="filter-group">
                            <h4 className="group-title">🎓 Academic Fit</h4>
                            <div className="filter-item">
                                <label>Min MSc Math CGPA: <span className="val-display">{draftFilters.minMscCgpa}</span></label>
                                <input 
                                    type="range" min="0" max="10" step="0.1" 
                                    value={draftFilters.minMscCgpa} 
                                    onChange={(e) => handleDraftChange('minMscCgpa', parseFloat(e.target.value))}
                                    className="range-slider"
                                />
                            </div>
                            <div className="filter-item mt-3">
                                <label>Min BSc Math CGPA: <span className="val-display">{draftFilters.minBscCgpa}</span></label>
                                <input 
                                    type="range" min="0" max="10" step="0.1" 
                                    value={draftFilters.minBscCgpa} 
                                    onChange={(e) => handleDraftChange('minBscCgpa', parseFloat(e.target.value))}
                                    className="range-slider"
                                />
                            </div>
                        </div>

                        {/* 2. Exam Filters */}
                        <div className="filter-group">
                            <h4 className="group-title">📝 Standardized Tests</h4>
                            <div className="filter-item">
                                <label>Minimum GATE Score: <span className="val-display">{draftFilters.minGateScore}</span></label>
                                <input 
                                    type="range" min="0" max="1000" step="10" 
                                    value={draftFilters.minGateScore} 
                                    onChange={(e) => handleDraftChange('minGateScore', parseInt(e.target.value))}
                                    className="range-slider gate-slider"
                                />
                            </div>
                            <div className="filter-item mt-3">
                                <label>CSIR-NET Mathematical Sciences</label>
                                <select 
                                    value={draftFilters.csirNetQualified} 
                                    onChange={(e) => handleDraftChange('csirNetQualified', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="All">Any Status</option>
                                    <option value="Yes">Qualified Only</option>
                                    <option value="No">Not Qualified</option>
                                </select>
                            </div>
                            <div className="filter-item mt-3">
                                <label>NBHM Qualified</label>
                                <select 
                                    value={draftFilters.nbhmQualified} 
                                    onChange={(e) => handleDraftChange('nbhmQualified', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="All">Any Status</option>
                                    <option value="Yes">Qualified Only</option>
                                    <option value="No">Not Qualified</option>
                                </select>
                            </div>
                        </div>

                        {/* 3. Research & Fit */}
                        <div className="filter-group">
                            <h4 className="group-title">🔬 Research & Category</h4>
                            <div className="filter-item">
                                <label>Research Area Match</label>
                                <select 
                                    value={draftFilters.researchArea} 
                                    onChange={(e) => handleDraftChange('researchArea', e.target.value)}
                                    className="filter-select"
                                >
                                    {researchAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="filter-item">
                                <label>Category Requirement</label>
                                <select 
                                    value={draftFilters.category} 
                                    onChange={(e) => handleDraftChange('category', e.target.value)}
                                    className="filter-select"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            
                            <div className="filter-item toggle-item mt-2">
                                <label>Relevant Research Experience Required?</label>
                                <div className="toggle-group">
                                    <button className={`toggle-btn ${draftFilters.relevantExperience === 'All' ? 'active' : ''}`} onClick={() => handleDraftChange('relevantExperience', 'All')}>Any</button>
                                    <button className={`toggle-btn ${draftFilters.relevantExperience === 'Yes' ? 'active' : ''}`} onClick={() => handleDraftChange('relevantExperience', 'Yes')}>Yes</button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Additional Metrics */}
                        <div className="filter-group">
                            <h4 className="group-title">⭐ Additional Metrics</h4>
                            <div className="filter-item toggle-item">
                                <label>Publications Required?</label>
                                <div className="toggle-group">
                                    <button className={`toggle-btn ${draftFilters.hasPublications === 'All' ? 'active' : ''}`} onClick={() => handleDraftChange('hasPublications', 'All')}>Any</button>
                                    <button className={`toggle-btn ${draftFilters.hasPublications === 'Yes' ? 'active' : ''}`} onClick={() => handleDraftChange('hasPublications', 'Yes')}>Yes</button>
                                </div>
                            </div>
                            <div className="filter-item">
                                <label>Max University Ranking Rank: <span className="val-display">{draftFilters.maxUniversityRanking === 100 ? 'Any' : `<= ${draftFilters.maxUniversityRanking}`}</span></label>
                                <input 
                                    type="range" min="1" max="100" step="1" 
                                    value={draftFilters.maxUniversityRanking} 
                                    onChange={(e) => handleDraftChange('maxUniversityRanking', parseInt(e.target.value))}
                                    className="range-slider rank-slider"
                                />
                            </div>
                        </div>

                        {/* 5. Custom Criteria */}
                        <div className="filter-group last-group">
                            <h4 className="group-title">➕ Custom Criteria (Text Match)</h4>
                            <div className="filter-item">
                                <label>Must appear in SOP / Resume</label>
                                <div className="custom-keyword-input-group mt-1">
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Python, MATLAB..." 
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddKeyword();
                                        }}
                                        className="control-input keyword-input"
                                    />
                                    <button className="btn btn-primary add-kw-btn" onClick={handleAddKeyword}>Add</button>
                                </div>
                                {draftFilters.customKeywords && draftFilters.customKeywords.length > 0 && (
                                    <div className="keywords-list mt-2">
                                        {draftFilters.customKeywords.map((kw, idx) => (
                                            <span key={idx} className="keyword-tag">
                                                {kw}
                                                <button className="remove-kw" onClick={() => handleRemoveKeyword(kw)}>&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="panel-footer">
                        <button className="btn btn-secondary w-full mb-2" onClick={handleResetFilters}>Reset Fields</button>
                        <button className="btn btn-primary w-full" onClick={handleApplyFilters}>Apply Filters</button>
                    </div>
                </aside>

                {/* RIGHT PANEL: RESULTS */}
                <main className="results-panel">
                    <div className="results-header">
                        <h3>Match Results <span className="results-count">({filteredAndSortedApplicants.length} found)</span></h3>
                        <p className="results-sub">Only showing candidates matching the strictly applied filters.</p>
                    </div>

                    {filteredAndSortedApplicants.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎯</div>
                            <h3>No Perfect Matches</h3>
                            <p>Try loosening your filter constraints in the left panel to see more candidates.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="screening-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th className="sortable-header" onClick={() => handleSort('mscCgpa')}>
                                            MSc CGPA <span className="sort-icon">{getSortIndicator('mscCgpa')}</span>
                                        </th>
                                        <th className="sortable-header" onClick={() => handleSort('gateScore')}>
                                            GATE Math <span className="sort-icon">{getSortIndicator('gateScore')}</span>
                                        </th>
                                        <th>Exams & Exp</th>
                                        <th className="sortable-header" onClick={() => handleSort('matchingScore')}>
                                            Match <span className="sort-icon">{getSortIndicator('matchingScore')}</span>
                                        </th>
                                        <th className="actions-header">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedApplicants.map(app => (
                                        <tr key={app.id}>
                                            <td>
                                                <div className="cell-title">{app.name}</div>
                                                <div className="cell-subtitle">{app.category}</div>
                                            </td>
                                            <td><span className="highlight-stat">{app.mscCgpa}</span></td>
                                            <td><span className="gate-stat highlight-stat">{app.gateScore || '-'}</span></td>
                                            <td>
                                                <div className="tags-col">
                                                    {app.csirNetQualified === 'Yes' && <span className="mini-tag test-tag">NET</span>}
                                                    {app.nbhmQualified === 'Yes' && <span className="mini-tag test-tag">NBHM</span>}
                                                    {app.researchExperience > 0 && <span className="mini-tag exp-tag">{app.researchExperience}m Exp</span>}
                                                    {app.hasPublications === 'Yes' && <span className="mini-tag pub-tag">Pubs</span>}
                                                    {app.csirNetQualified === 'No' && app.nbhmQualified === 'No' && app.researchExperience === 0 && app.hasPublications === 'No' && <span className="text-gray">-</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="score-wrapper">
                                                    <div className={`score-ring ${app.matchingScore >= 80 ? 'high' : app.matchingScore >= 50 ? 'med' : 'low'}`}>
                                                        {app.matchingScore}%
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="actions-cell">
                                                <div className="action-buttons vertical-layout">
                                                    <button className="btn btn-success btn-sm w-full" onClick={() => handleShortlist(app.id)}>
                                                        Shortlist
                                                    </button>
                                                    <button className="btn btn-secondary btn-sm w-full mt-1" onClick={() => handleViewProfile(app)}>
                                                        View Profile
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {/* View Full Profile Modal (Reused Logic Structure) */}
            {isModalOpen && selectedApplicant && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>
                        <div className="profile-header">
                            <div className="profile-header-info">
                                <div className="profile-avatar">{selectedApplicant.name.charAt(0)}</div>
                                <div>
                                    <h3 className="profile-name">{selectedApplicant.name}</h3>
                                    <div className="profile-id">{selectedApplicant.id} | {selectedApplicant.email}</div>
                                </div>
                            </div>
                            <div className="profile-header-actions">
                                <div className="large-score-display">
                                    <span className="val">{selectedApplicant.matchingScore}%</span>
                                    <span className="lbl">Match Score</span>
                                </div>
                                <button className="close-profile-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                        </div>

                        <div className="profile-body">
                            <div className="profile-grid-2">
                                <div className="profile-card">
                                    <h4 className="card-title">Academic & Tests</h4>
                                    <div className="card-row"><strong>University:</strong> {selectedApplicant.university} (Rank: {selectedApplicant.universityRanking})</div>
                                    <div className="card-row"><strong>MSc Math CGPA:</strong> <span className="highlight-stat">{selectedApplicant.mscCgpa}</span></div>
                                    <div className="card-row"><strong>BSc Math CGPA:</strong> <span className="highlight-stat">{selectedApplicant.bscCgpa}</span></div>
                                    <div className="card-row"><strong>GATE Score:</strong> {selectedApplicant.gateScore || 'N/A'}</div>
                                    <div className="card-row"><strong>CSIR-NET:</strong> {selectedApplicant.csirNetQualified === 'Yes' ? 'Qualified' : 'Not Qualified'}</div>
                                    <div className="card-row"><strong>NBHM:</strong> {selectedApplicant.nbhmQualified === 'Yes' ? 'Qualified' : 'Not Qualified'}</div>
                                </div>
                                
                                <div className="profile-card">
                                    <h4 className="card-title">Research Fit</h4>
                                    <div className="card-row"><strong>Area:</strong> {selectedApplicant.researchArea}</div>
                                    <div className="card-row"><strong>Experience:</strong> {selectedApplicant.researchExperience} months</div>
                                    <div className="card-row"><strong>Publications:</strong> {selectedApplicant.hasPublications}</div>
                                    <div className="card-row"><strong>Category:</strong> {selectedApplicant.category}</div>
                                </div>
                            </div>
                            
                            <div className="profile-card full-width mt-4">
                                <h4 className="card-title">SOP & Documents</h4>
                                <div className="sop-box">"{selectedApplicant.sop}"</div>
                                <div className="documents-grid mt-3">
                                    {selectedApplicant.documents.map((doc, idx) => (
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

                        <div className="profile-footer">
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close View</button>
                            <button className="btn btn-success" onClick={() => { handleShortlist(selectedApplicant.id); setIsModalOpen(false); }}>
                                Confirm Shortlist
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
