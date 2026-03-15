import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { 
    MdSearch, 
    MdFilterList, 
    MdCheckCircle, 
    MdError, 
    MdHistory,
    MdCloudUpload,
    MdDownload
} from 'react-icons/md';
import api from '../../services/apiCore';
import './AuditResults.css';

export default function AuditResults() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDept, setFilterDept] = useState('All');

    useEffect(() => {
        fetchAppliedApplications();
    }, []);

    const fetchAppliedApplications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/applications');
            setApplications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch audit pool', err);
            toast.error('Audit pool failed to load.');
        } finally {
            setLoading(false);
        }
    };

    const departments = useMemo(() => {
        const depts = new Set(applications.map(app => app.offeringId?.department).filter(Boolean));
        return ['All', ...Array.from(depts)];
    }, [applications]);

    const filteredApps = useMemo(() => {
        return applications.filter(app => {
            const matchesSearch = 
                (app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = filterStatus === 'All' || app.status === filterStatus || app.result === filterStatus;
            const matchesDept = filterDept === 'All' || app.offeringId?.department === filterDept;
            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [applications, searchTerm, filterStatus, filterDept]);

    const handlePublishResults = () => {
        toast.info("Result publication process initiated. This would typically trigger emails to all selected candidates.");
    };

    if (loading) return <div className="audit-loading">Loading audit records...</div>;

    return (
        <div className="audit-container">
            <div className="audit-header">
                <div className="header-info">
                    <h1>Governance: Result Audit</h1>
                    <p>Review final recommendations from all departments before publishing the master list.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => toast.success("Exporting data to Excel...")}>
                        <MdDownload /> Export Audit Trail
                    </button>
                    <button className="btn-primary publish-btn" onClick={handlePublishResults}>
                        <MdCloudUpload /> Publish Master Cycle
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="audit-controls">
                <div className="search-wrap">
                    <MdSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Name..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-group">
                    <div className="filter-item">
                        <label>Status</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="All">All Applications</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Selected">Selected (Faculty Recommended)</option>
                            <option value="Waitlisted">Waitlisted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Department</label>
                        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Audit Table */}
            <div className="audit-table-card">
                <table className="audit-table">
                    <thead>
                        <tr>
                            <th>Application ID</th>
                            <th>Applicant</th>
                            <th>Department & Project</th>
                            <th>Metrics (GATE/CGPA)</th>
                            <th>Interview Score</th>
                            <th>Faculty Decision</th>
                            <th>Audit Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.map(app => (
                            <tr key={app._id}>
                                <td className="bold">{app.applicationId || 'N/A'}</td>
                                <td>
                                    <div className="user-cell">
                                        <span className="user-name">{app.userId?.name}</span>
                                        <span className="user-email">{app.userId?.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="project-cell">
                                        <span className="dept">{app.offeringId?.department}</span>
                                        <span className="spec">{app.offeringId?.specialization}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="metrics-cell">
                                        <span>CGPA: {app.educationalDetails?.pg?.cgpa || 'N/A'}</span>
                                        <span>GATE: {app.qualifyingExams?.find(ex => ex.examName === 'GATE')?.score || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={`score-chip ${app.interviewScore >= 80 ? 'high' : ''}`}>
                                        {app.interviewScore || '--'} / 100
                                    </div>
                                </td>
                                <td>
                                    <span className={`decision-pill status-${app.result?.toLowerCase() || 'pending'}`}>
                                        {app.result || 'No Decision'}
                                    </span>
                                </td>
                                <td>
                                    {app.result ? (
                                        <div className="audit-ok"><MdCheckCircle /> Ready</div>
                                    ) : (
                                        <div className="audit-wait"><MdHistory /> Pending</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredApps.length === 0 && (
                    <div className="empty-state">No matching audit records found.</div>
                )}
            </div>
        </div>
    );
}
