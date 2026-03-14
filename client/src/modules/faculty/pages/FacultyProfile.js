import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './FacultyProfile.css';

const initialProfile = {
    name: 'Prof. Amitabh Mathur',
    email: 'a.mathur@iitrpr.ac.in',
    department: 'Department of Mathematics, IIT Ropar',
    officeLocation: 'Room 204, Academic Block – 1, IIT Ropar',
    designation: 'Professor',
    contactNumber: '+91-9876543210',

    // Research
    researchAreas: ['Algebraic Topology', 'Differential Geometry', 'Number Theory', 'Functional Analysis'],
    googleScholar: 'https://scholar.google.com/citations?user=dummy-math-prof',
    orcidId: '0000-0002-1234-5678',
    facultyWebsite: 'https://www.iitrpr.ac.in/maths/amathur',

    // Academic Activity
    currentPhdStudents: ['Vikram Sharma', 'Sneha Gupta', 'Amit Singh'],
    pastPhdStudents: ['Dr. Ravi Kumar (Graduated 2023)', 'Dr. Priya Patel (Graduated 2021)'],
    researchProjects: [
        'Topology of Manifolds (DST funded)',
        'Riemannian Geometry Applications (NBHM funded)'
    ],
    publications: 58,

    // Account
    newPassword: '',
    confirmPassword: ''
};

export default function FacultyProfile() {
    const [profile, setProfile] = useState(initialProfile);
    const [draft, setDraft] = useState(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [newResearchArea, setNewResearchArea] = useState('');
    const [newProject, setNewProject] = useState('');

    const startEditing = () => {
        setDraft({ ...profile, newPassword: '', confirmPassword: '' });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setDraft(profile);
        setIsEditing(false);
        setNewResearchArea('');
        setNewProject('');
    };

    const handleDraftChange = (field, value) => {
        setDraft(prev => ({ ...prev, [field]: value }));
    };

    const addArrayItem = (field, valueStr, resetFunc) => {
        const val = valueStr.trim();
        if (!val) return;
        if ((draft[field] || []).includes(val)) { toast.warning('Already exists.'); return; }
        setDraft(prev => ({ ...prev, [field]: [...(prev[field] || []), val] }));
        resetFunc('');
    };

    const removeArrayItem = (field, idx) => {
        setDraft(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
    };

    const saveChanges = () => {
        if (draft.newPassword || draft.confirmPassword) {
            if (draft.newPassword !== draft.confirmPassword) { toast.error('Passwords do not match!'); return; }
            if (draft.newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
        }
        const updated = { ...draft };
        delete updated.newPassword;
        delete updated.confirmPassword;
        setProfile(updated);
        setIsEditing(false);
        setNewResearchArea('');
        setNewProject('');
        toast.success(draft.newPassword ? 'Profile and password updated!' : 'Profile updated successfully!');
    };

    return (
        <div className="fp-container">

            {/* ── Faculty Identity Card ── */}
            <div className="fp-identity-card">
                <div className="fp-identity-left">
                    <div className="fp-avatar-xl">{profile.name.charAt(0)}</div>
                    <div className="fp-identity-info">
                        <h1 className="fp-name">{profile.name}</h1>
                        <p className="fp-designation">{profile.designation} – {profile.department}</p>
                        <div className="fp-tags">
                            {profile.researchAreas.slice(0, 3).map((area, i) => (
                                <span key={i} className="fp-tag">{area}</span>
                            ))}
                            {profile.researchAreas.length > 3 && (
                                <span className="fp-tag fp-tag-more">+{profile.researchAreas.length - 3} more</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="fp-identity-actions">
                    {!isEditing ? (
                        <button className="btn btn-primary edit-profile-btn" onClick={startEditing}>
                            ✏️ Edit Profile
                        </button>
                    ) : (
                        <div className="fp-edit-group">
                            <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
                            <button className="btn btn-success" onClick={saveChanges}>💾 Save Changes</button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Three Card Grid ── */}
            <div className="fp-cards-grid">

                {/* Card 1 – Personal Information */}
                <div className="fp-card">
                    <div className="fp-card-header">
                        <span className="fp-card-icon">👤</span>
                        <h3>Personal Information</h3>
                    </div>
                    <div className="fp-card-body">
                        <Field label="Full Name" editMode={isEditing}
                            view={<span className="fv">{profile.name}</span>}
                            edit={<input className="fp-input" value={draft.name} onChange={e => handleDraftChange('name', e.target.value)} />}
                        />
                        <Field label="Email Address" editMode={isEditing}
                            view={<span className="fv fv-muted">{profile.email}</span>}
                            edit={<input className="fp-input fv-muted" value={draft.email} readOnly />}
                        />
                        <Field label="Department" editMode={isEditing}
                            view={<span className="fv">{profile.department}</span>}
                            edit={<input className="fp-input" value={draft.department} onChange={e => handleDraftChange('department', e.target.value)} />}
                        />
                        <Field label="Office Location" editMode={isEditing}
                            view={<span className="fv">{profile.officeLocation}</span>}
                            edit={<input className="fp-input" value={draft.officeLocation} onChange={e => handleDraftChange('officeLocation', e.target.value)} />}
                        />
                        <Field label="Contact Number" editMode={isEditing}
                            view={<span className="fv">{profile.contactNumber}</span>}
                            edit={<input className="fp-input" value={draft.contactNumber} onChange={e => handleDraftChange('contactNumber', e.target.value)} />}
                        />

                        {isEditing && (
                            <div className="fp-password-section">
                                <div className="fp-section-divider">Account Security</div>
                                <Field label="New Password" editMode={true}
                                    edit={<input type="password" className="fp-input" placeholder="Leave blank to keep current" value={draft.newPassword} onChange={e => handleDraftChange('newPassword', e.target.value)} />}
                                />
                                <Field label="Confirm Password" editMode={true}
                                    edit={
                                        <>
                                            <input type="password" className="fp-input" placeholder="Repeat new password" value={draft.confirmPassword} onChange={e => handleDraftChange('confirmPassword', e.target.value)} />
                                            {draft.newPassword && draft.newPassword !== draft.confirmPassword &&
                                                <span className="fp-pass-err">Passwords do not match.</span>}
                                        </>
                                    }
                                />
                            </div>
                        )}
                        {!isEditing && (
                            <div className="fp-secure-badge">🔒 Account Secured</div>
                        )}
                    </div>
                </div>

                {/* Card 2 – Research Information */}
                <div className="fp-card">
                    <div className="fp-card-header">
                        <span className="fp-card-icon">🔭</span>
                        <h3>Research Information</h3>
                    </div>
                    <div className="fp-card-body">
                        <div className="fp-field">
                            <label className="fp-label">Research Areas</label>
                            <div className="fp-chips">
                                {(isEditing ? draft.researchAreas : profile.researchAreas).map((area, idx) => (
                                    <span key={idx} className="fp-chip">
                                        {area}
                                        {isEditing && (
                                            <button className="fp-chip-del" onClick={() => removeArrayItem('researchAreas', idx)}>&times;</button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {isEditing && (
                                <div className="fp-add-row mt-2">
                                    <input className="fp-input" placeholder="Add area (press Enter)" value={newResearchArea}
                                        onChange={e => setNewResearchArea(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addArrayItem('researchAreas', newResearchArea, setNewResearchArea)} />
                                    <button className="btn btn-secondary btn-sm" onClick={() => addArrayItem('researchAreas', newResearchArea, setNewResearchArea)}>Add</button>
                                </div>
                            )}
                        </div>

                        <Field label="Google Scholar" editMode={isEditing}
                            view={<a href={profile.googleScholar} target="_blank" rel="noopener noreferrer" className="fp-link">{profile.googleScholar}</a>}
                            edit={<input className="fp-input" value={draft.googleScholar} onChange={e => handleDraftChange('googleScholar', e.target.value)} />}
                        />
                        <Field label="ORCID ID" editMode={isEditing}
                            view={<span className="fv fp-mono">{profile.orcidId}</span>}
                            edit={<input className="fp-input fp-mono" placeholder="e.g. 0000-0001-2345-6789" value={draft.orcidId} onChange={e => handleDraftChange('orcidId', e.target.value)} />}
                        />
                        <Field label="Faculty Website" editMode={isEditing}
                            view={<a href={profile.facultyWebsite} target="_blank" rel="noopener noreferrer" className="fp-link">{profile.facultyWebsite}</a>}
                            edit={<input className="fp-input" value={draft.facultyWebsite} onChange={e => handleDraftChange('facultyWebsite', e.target.value)} />}
                        />
                    </div>
                </div>

                {/* Card 3 – Academic Activity */}
                <div className="fp-card fp-card-wide">
                    <div className="fp-card-header">
                        <span className="fp-card-icon">🎓</span>
                        <h3>Academic Activity</h3>
                    </div>
                    <div className="fp-card-body fp-activity-grid">

                        {/* Publications */}
                        <div className="fp-stat-block">
                            <span className="fp-stat-num">{profile.publications}</span>
                            <span className="fp-stat-label">Total Publications</span>
                            {isEditing && (
                                <input type="number" className="fp-input mt-2 w-half" value={draft.publications}
                                    onChange={e => handleDraftChange('publications', parseInt(e.target.value) || 0)} />
                            )}
                        </div>

                        {/* Current PhD Students */}
                        <div className="fp-field">
                            <label className="fp-label">Current PhD Students ({profile.currentPhdStudents.length})</label>
                            <ul className="fp-student-list fp-list-current">
                                {profile.currentPhdStudents.map((s, i) => <li key={i}>👨‍🎓 {s}</li>)}
                                {profile.currentPhdStudents.length === 0 && <li className="fp-muted">No active students.</li>}
                            </ul>
                        </div>

                        {/* Past PhD Students */}
                        <div className="fp-field">
                            <label className="fp-label">Past PhD Students ({profile.pastPhdStudents.length})</label>
                            <ul className="fp-student-list fp-list-past">
                                {profile.pastPhdStudents.map((s, i) => <li key={i}>🎓 {s}</li>)}
                                {profile.pastPhdStudents.length === 0 && <li className="fp-muted">None.</li>}
                            </ul>
                        </div>

                        {/* Ongoing Projects */}
                        <div className="fp-field">
                            <label className="fp-label">Ongoing Research Projects</label>
                            <ul className="fp-proj-list">
                                {(isEditing ? draft.researchProjects : profile.researchProjects).map((p, i) => (
                                    <li key={i} className="fp-proj-item">
                                        <span>📄 {p}</span>
                                        {isEditing && <button className="fp-del-link" onClick={() => removeArrayItem('researchProjects', i)}>Remove</button>}
                                    </li>
                                ))}
                            </ul>
                            {isEditing && (
                                <div className="fp-add-row mt-2">
                                    <input className="fp-input" placeholder="Project name (funder)" value={newProject}
                                        onChange={e => setNewProject(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addArrayItem('researchProjects', newProject, setNewProject)} />
                                    <button className="btn btn-secondary btn-sm" onClick={() => addArrayItem('researchProjects', newProject, setNewProject)}>Add</button>
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="fp-info-notice">
                                ℹ️ Student rosters are managed via the admin panel and require coordinator approval to update.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Small helper component ── */
function Field({ label, view, edit, editMode }) {
    return (
        <div className="fp-field">
            <label className="fp-label">{label}</label>
            {editMode ? edit : (view || null)}
        </div>
    );
}
