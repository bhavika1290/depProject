import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/apiCore';
import './ApplicationForm.css';

const steps = [
    'General Application Details',
    'Qualifying Exam Details',
    'Experiences and Publications',
    'Application Fee Details',
    'Declaration',
    'Review'
];

export default function ApplicationForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offering, setOffering] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [requirements, setRequirements] = useState(null);
    const [profile, setProfile] = useState(null);

    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        generalApplicationDetails: {
            interdisciplinaryProgram: false,
            interdisciplinaryDepartment: '',
            modeOfApplication: '',
            areaOfResearchPrefs: ['', '', '', ''],
            specificAreaOfResearch: '',
            sop: '',
            keywords: ''
        },
        educationalDetails: {
            ug: { degree: '', university: '', cgpa: '', year: '' },
            pg: { degree: '', university: '', cgpa: '', year: '' }
        },
        qualifyingExams: [],
        experienceDetails: [],
        publications: [],
        paymentDetails: {
            category: '',
            amount: '',
            transactionId: '',
            bank: '',
            paymentDate: ''
        },
        declarationAccepted: false,
    });

    const [transactionSlip, setTransactionSlip] = useState(null);

    const fetchOffering = useCallback(async () => {
        try {
            const [offerRes, profileRes] = await Promise.all([
                api.get(`/offerings/${id}`),
                api.get('/users/profile').catch(() => ({ data: { data: null } }))
            ]);

            const offData = offerRes.data.data;
            setOffering(offData);

            if (offData.minimumQualification) {
                try {
                    const reqs = typeof offData.minimumQualification === 'string' 
                        ? JSON.parse(offData.minimumQualification) 
                        : offData.minimumQualification;
                    setRequirements(reqs);
                } catch (e) {
                    console.error('Failed to parse requirements', e);
                }
            }

            const profData = profileRes.data.data;
            if (profData) {
                setProfile(profData);
                // Pre-fill educational details from profile
                setFormData(prev => ({
                    ...prev,
                    educationalDetails: {
                        ug: {
                            degree: profData.educationalDetails?.ugDegree || '',
                            university: profData.educationalDetails?.ugUniversity || '',
                            cgpa: profData.educationalDetails?.ugCGPA || '',
                            year: profData.educationalDetails?.ugYear || ''
                        },
                        pg: {
                            degree: profData.educationalDetails?.pgDegree || '',
                            university: profData.educationalDetails?.pgUniversity || '',
                            cgpa: profData.educationalDetails?.pgCGPA || '',
                            year: profData.educationalDetails?.pgYear || ''
                        }
                    }
                }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch offering');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOffering();
    }, [fetchOffering]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setFormData(prev => {
            const arr = [...prev[section]];
            arr[index][field] = value;
            return { ...prev, [section]: arr };
        });
    };

    const addArrayItem = (section, template) => {
        setFormData(prev => ({ ...prev, [section]: [...prev[section], template] }));
    };

    const removeArrayItem = (section, index) => {
        setFormData(prev => {
            const arr = [...prev[section]];
            arr.splice(index, 1);
            return { ...prev, [section]: arr };
        });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const submitData = new FormData();
            submitData.append('offeringId', id);
            
            const acId = offering?.admissionCycleId?._id || offering?.admissionCycleId;
            if (acId) {
                submitData.append('admissionCycleId', acId);
            }

            // Stringify complex objects for FormData
            const generalDetails = {
                ...formData.generalApplicationDetails,
                keywords: formData.generalApplicationDetails.keywords ? formData.generalApplicationDetails.keywords.split(',').map(k => k.trim()) : []
            };
            submitData.append('generalApplicationDetails', JSON.stringify(generalDetails));
            submitData.append('educationalDetails', JSON.stringify(formData.educationalDetails));
            submitData.append('qualifyingExams', JSON.stringify(formData.qualifyingExams));
            submitData.append('experienceDetails', JSON.stringify(formData.experienceDetails));
            submitData.append('publications', JSON.stringify(formData.publications));
            submitData.append('paymentDetails', JSON.stringify(formData.paymentDetails));
            submitData.append('declarationAccepted', formData.declarationAccepted);

            if (transactionSlip) {
                submitData.append('transactionSlip', transactionSlip);
            }

            await api.post('/applications', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
            window.scrollTo(0, 0);
        } finally {
            setSubmitting(false);
        }
    };

    // --- RENDER STEPS ---
    
    const renderStep1General = () => {
        const meetsMsc = !requirements?.minMscCgpa || Number(formData.educationalDetails.pg?.cgpa) >= Number(requirements.minMscCgpa);
        const meetsBsc = !requirements?.minBscCgpa || Number(formData.educationalDetails.ug?.cgpa) >= Number(requirements.minBscCgpa);
        
        return (
            <div className="wizard-step-card animate-fade-in">
                {/* Faculty Requirements Summary */}
                {requirements && (
                    <div className="requirements-summary-card">
                        <div className="req-header">
                            <h4>Faculty Screening Criteria</h4>
                            <span className="req-badge">Opening Specific</span>
                        </div>
                        <div className="req-grid">
                            {requirements.minMscCgpa && (
                                <div className={`req-item ${meetsMsc ? 'ok' : 'warn'}`}>
                                    <span className="req-label">Min MSc CGPA:</span>
                                    <span className="req-val">{requirements.minMscCgpa}</span>
                                </div>
                            )}
                            {requirements.minBscCgpa && (
                                <div className={`req-item ${meetsBsc ? 'ok' : 'warn'}`}>
                                    <span className="req-label">Min BSc CGPA:</span>
                                    <span className="req-val">{requirements.minBscCgpa}</span>
                                </div>
                            )}
                            {requirements.gateScore && (
                                <div className="req-item info">
                                    <span className="req-label">Min GATE Score:</span>
                                    <span className="req-val">{requirements.gateScore}</span>
                                </div>
                            )}
                            {requirements.minResearchExperience && (
                                <div className="req-item info">
                                    <span className="req-label">Min Experience:</span>
                                    <span className="req-val">{requirements.minResearchExperience} Months</span>
                                </div>
                            )}
                        </div>
                        {!meetsMsc || !meetsBsc ? (
                            <div className="req-warning">
                                ⚠️ Your current profile scores appear to be below the requested minimum. Please ensure your details are accurate below.
                            </div>
                        ) : (
                            <div className="req-success">
                                ✓ You appear to meet the primary academic criteria for this opening.
                            </div>
                        )}
                    </div>
                )}

                <h3>1. Academic Eligibility Verification</h3>
                <p className="step-intro">Since faculty use these scores for initial screening, please confirm your CGPA details for this application.</p>
                <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                    <div className="form-group">
                        <label>Post-Graduate (M.Sc/M.Tech) CGPA *</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            required 
                            value={formData.educationalDetails.pg?.cgpa} 
                            onChange={(e) => handleNestedChange('educationalDetails', 'pg', { ...formData.educationalDetails.pg, cgpa: e.target.value })}
                            className={!meetsMsc ? 'input-error' : ''}
                        />
                    </div>
                    <div className="form-group">
                        <label>Undergraduate (B.Sc/B.Tech) CGPA *</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            required 
                            value={formData.educationalDetails.ug?.cgpa} 
                            onChange={(e) => handleNestedChange('educationalDetails', 'ug', { ...formData.educationalDetails.ug, cgpa: e.target.value })}
                            className={!meetsBsc ? 'input-error' : ''}
                        />
                    </div>
                </div>

                <h3>2. General Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Department *</label>
                    <input type="text" value={offering.department} disabled className="disabled-input" />
                </div>
                <div className="form-group">
                    <label>Specialization *</label>
                    <input type="text" value={offering.specialization} disabled className="disabled-input" />
                </div>

                <div className="form-group">
                    <label>Whether you want to apply for interdisciplinary program? *</label>
                    <select 
                        required 
                        value={formData.generalApplicationDetails.interdisciplinaryProgram}
                        onChange={(e) => handleNestedChange('generalApplicationDetails', 'interdisciplinaryProgram', e.target.value === 'true')}
                    >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>

                {formData.generalApplicationDetails.interdisciplinaryProgram && (
                    <div className="form-group">
                        <label>Name of interdisciplinary department</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="e.g. Department of Bio-Medical Engineering"
                            value={formData.generalApplicationDetails.interdisciplinaryDepartment} 
                            onChange={(e) => handleNestedChange('generalApplicationDetails', 'interdisciplinaryDepartment', e.target.value)}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Mode of Application *</label>
                    <select 
                        required 
                        value={formData.generalApplicationDetails.modeOfApplication}
                        onChange={(e) => handleNestedChange('generalApplicationDetails', 'modeOfApplication', e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Regular">Regular</option>
                        <option value="External">External</option>
                        <option value="Part-Time">Part-Time</option>
                    </select>
                </div>
            </div>

            <h4 style={{ marginTop: '30px', marginBottom: '15px' }}>Area of research (as per advertisement)</h4>
            <div className="form-grid">
                {[0, 1, 2, 3].map(i => (
                    <div className="form-group" key={i}>
                        <label>{i + 1}{i===0?'st':i===1?'nd':i===2?'rd':'th'} Preference {i === 0 ? '*' : ''}</label>
                        <input 
                            type="text" 
                            required={i === 0}
                            value={formData.generalApplicationDetails.areaOfResearchPrefs[i]}
                            onChange={(e) => {
                                const newPrefs = [...formData.generalApplicationDetails.areaOfResearchPrefs];
                                newPrefs[i] = e.target.value;
                                handleNestedChange('generalApplicationDetails', 'areaOfResearchPrefs', newPrefs);
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Specific area of research (if known):</label>
                <textarea 
                    rows="2" 
                    value={formData.generalApplicationDetails.specificAreaOfResearch}
                    onChange={(e) => handleNestedChange('generalApplicationDetails', 'specificAreaOfResearch', e.target.value)}
                />
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Statement of Purpose (SOP) / Cover Letter: *</label>
                <textarea 
                    rows="4" 
                    required
                    placeholder="Briefly describe your research interests, background, and motivation..."
                    value={formData.generalApplicationDetails.sop}
                    onChange={(e) => handleNestedChange('generalApplicationDetails', 'sop', e.target.value)}
                />
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Keywords / Tags (Comma separated): *</label>
                <input 
                    type="text" 
                    required
                    placeholder="e.g. Python, Topology, Data Analysis"
                    value={formData.generalApplicationDetails.keywords}
                    onChange={(e) => handleNestedChange('generalApplicationDetails', 'keywords', e.target.value)}
                />
            </div>
        </div>
        );
    };

    const renderStep2Exams = () => {
        const hasGateReq = !!requirements?.gateScore;
        const hasNetReq = !!requirements?.csirNet;
        const hasNbhmReq = !!requirements?.nbhm;

        return (
            <div className="wizard-step-card animate-fade-in">
                <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Mandatory Screening Exams</h4>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>Faculty for this opening prioritize the following exams for initial screening.</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <button type="button" className={`btn-secondary ${hasGateReq ? 'btn-highlight' : ''}`} onClick={() => addArrayItem('qualifyingExams', { examName:'GATE', subject:'Mathematics', yearOfPassing:'', score:'', rank:'', validUpTo:'' })}>
                            {hasGateReq && <span className="mini-badge">Required</span>} + Add GATE
                        </button>
                        <button type="button" className={`btn-secondary ${hasNetReq ? 'btn-highlight' : ''}`} onClick={() => addArrayItem('qualifyingExams', { examName:'CSIR-NET', subject:'Mathematical Sciences', yearOfPassing:'', score:'', rank:'', validUpTo:'' })}>
                            {hasNetReq && <span className="mini-badge">Required</span>} + Add CSIR-NET
                        </button>
                        <button type="button" className={`btn-secondary ${hasNbhmReq ? 'btn-highlight' : ''}`} onClick={() => addArrayItem('qualifyingExams', { examName:'NBHM', subject:'Mathematics', yearOfPassing:'', score:'', rank:'', validUpTo:'' })}>
                            {hasNbhmReq && <span className="mini-badge">Required</span>} + Add NBHM
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="section-title-wrap">
                        <h3>Qualifying Exams</h3>
                        <p className="sub-instruction">Provide details for all relevant national level exams.</p>
                    </div>
                    <button type="button" className="btn-secondary" onClick={() => addArrayItem('qualifyingExams', { examName:'', subject:'', yearOfPassing:'', score:'', rank:'', validUpTo:'' })}>+ Add Other Exam</button>
                </div>
                
                {formData.qualifyingExams.length === 0 ? (
                    <div className="empty-array-state">
                        No qualifying exams added yet. Click a button above to add details.
                    </div>
                ) : (
                    formData.qualifyingExams.map((exam, i) => (
                        <div key={i} className={`exam-card ${['GATE', 'CSIR-NET', 'NBHM'].includes(String(exam.examName).toUpperCase()) ? 'priority-card' : ''}`}>
                            <button type="button" onClick={() => removeArrayItem('qualifyingExams', i)} className="remove-item-btn">✕ Remove</button>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Exam Name (GATE/NET/etc)</label>
                                    <input type="text" value={exam.examName} onChange={(e) => handleArrayChange('qualifyingExams', i, 'examName', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input type="text" value={exam.subject} onChange={(e) => handleArrayChange('qualifyingExams', i, 'subject', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Year of Passing</label>
                                    <input type="number" value={exam.yearOfPassing} onChange={(e) => handleArrayChange('qualifyingExams', i, 'yearOfPassing', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Score/Percentile</label>
                                    <input type="text" value={exam.score} onChange={(e) => handleArrayChange('qualifyingExams', i, 'score', e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Rank</label>
                                    <input type="text" value={exam.rank} onChange={(e) => handleArrayChange('qualifyingExams', i, 'rank', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Valid Up To</label>
                                    <input type="date" value={exam.validUpTo} onChange={(e) => handleArrayChange('qualifyingExams', i, 'validUpTo', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    };

    const renderStep3Experience = () => (
        <div className="wizard-step-card animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Experience Details</h3>
                <button type="button" className="btn-secondary" onClick={() => addArrayItem('experienceDetails', { organization:'', designation:'', startDate:'', endDate:'', responsibilities:'' })}>+ Add Experience</button>
            </div>
            
            {formData.experienceDetails.map((exp, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
                    <button type="button" onClick={() => removeArrayItem('experienceDetails', i)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕ Remove</button>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Organization</label>
                            <input type="text" value={exp.organization} onChange={(e) => handleArrayChange('experienceDetails', i, 'organization', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Designation</label>
                            <input type="text" value={exp.designation} onChange={(e) => handleArrayChange('experienceDetails', i, 'designation', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={exp.startDate} onChange={(e) => handleArrayChange('experienceDetails', i, 'startDate', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" value={exp.endDate} onChange={(e) => handleArrayChange('experienceDetails', i, 'endDate', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '40px' }}>
                <h3>Publications</h3>
                <button type="button" className="btn-secondary" onClick={() => addArrayItem('publications', { title:'', journal:'', year:'', status:'' })}>+ Add Publication</button>
            </div>
            
            {formData.publications.map((pub, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
                    <button type="button" onClick={() => removeArrayItem('publications', i)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕ Remove</button>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={pub.title} onChange={(e) => handleArrayChange('publications', i, 'title', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Journal/Conference</label>
                            <input type="text" value={pub.journal} onChange={(e) => handleArrayChange('publications', i, 'journal', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <input type="number" value={pub.year} onChange={(e) => handleArrayChange('publications', i, 'year', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select value={pub.status} onChange={(e) => handleArrayChange('publications', i, 'status', e.target.value)} required>
                                <option value="">Select</option>
                                <option value="Published">Published</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Under Review">Under Review</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderStep4Fee = () => (
        <div className="wizard-step-card animate-fade-in">
            <div style={{ marginBottom: '20px' }}>
                <h3>Application Fee Details</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Submit your application fee through <a href="#" style={{ color: '#4f46e5', textDecoration: 'underline' }}>SB Collect</a>.</p>
            </div>
            
            <div className="form-grid">
                <div className="form-group">
                    <label>Category *</label>
                    <select value={formData.paymentDetails.category} onChange={(e) => handleNestedChange('paymentDetails', 'category', e.target.value)} required>
                        <option value="">Select Category</option>
                        <option value="GEN/OBC">GEN/OBC</option>
                        <option value="SC/ST/PWD/Women">SC/ST/PWD/Women</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Amount *</label>
                    <select value={formData.paymentDetails.amount} onChange={(e) => handleNestedChange('paymentDetails', 'amount', Number(e.target.value))} required>
                        <option value="">Select Amount</option>
                        <option value="500">₹ 500</option>
                        <option value="250">₹ 250</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Transaction ID *</label>
                    <input type="text" value={formData.paymentDetails.transactionId} onChange={(e) => handleNestedChange('paymentDetails', 'transactionId', e.target.value)} required placeholder="e.g. 12312412411413" />
                </div>
                <div className="form-group">
                    <label>Bank *</label>
                    <input type="text" value={formData.paymentDetails.bank} onChange={(e) => handleNestedChange('paymentDetails', 'bank', e.target.value)} required />
                </div>
                
                <div className="form-group">
                    <label>Transaction Slip *</label>
                    <input type="file" onChange={(e) => setTransactionSlip(e.target.files[0])} required={!transactionSlip} style={{ border: '1px solid #d1d5db', padding: '10px', borderRadius: '4px', backgroundColor: '#f9fafb' }} />
                    <small style={{ color: '#94a3b8', display: 'block', marginTop: '4px' }}>Max: 2MB. Allow: .pdf, .jpg, .jpeg</small>
                </div>
                <div className="form-group">
                    <label>Date of Transaction *</label>
                    <input type="date" value={formData.paymentDetails.paymentDate} onChange={(e) => handleNestedChange('paymentDetails', 'paymentDate', e.target.value)} required />
                </div>
            </div>
        </div>
    );

    const renderStep5Declaration = () => (
        <div className="wizard-step-card animate-fade-in">
            <h3>Declaration</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                <p style={{ lineHeight: '1.6', color: '#334155' }}>
                    I hereby declare that all the information provided by me in this application is true, complete, and correct to the best of my knowledge and belief. 
                    I understand that in the event of any information being found false or incorrect at any stage, my candidature/admission is liable to be cancelled/terminated.
                </p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <input 
                        type="checkbox" 
                        id="declaration" 
                        checked={formData.declarationAccepted} 
                        onChange={(e) => setFormData(prev => ({ ...prev, declarationAccepted: e.target.checked }))} 
                        style={{ marginTop: '5px', width: '20px', height: '20px' }} 
                        required
                    />
                    <label htmlFor="declaration" style={{ fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                        I agree to the above declaration
                    </label>
                </div>
            </div>
        </div>
    );

    const renderStep6Review = () => (
        <div className="wizard-step-card animate-fade-in">
            <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>Application Review</h3>
            
            <div className="review-section">
                <h4>General Details</h4>
                <div className="review-grid">
                    <div><strong>Department:</strong> {offering.department}</div>
                    <div><strong>Specialization:</strong> {offering.specialization}</div>
                    <div><strong>Applying For (Mode):</strong> {formData.generalApplicationDetails.modeOfApplication}</div>
                    <div><strong>Interdisciplinary:</strong> {formData.generalApplicationDetails.interdisciplinaryProgram ? 'Yes' : 'No'}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Preferences:</strong> {formData.generalApplicationDetails.areaOfResearchPrefs.filter(Boolean).join(', ')}</div>
                </div>
            </div>

            <div className="review-section">
                <h4>Fee Details</h4>
                <div className="review-grid">
                    <div><strong>Amount:</strong> ₹{formData.paymentDetails.amount}</div>
                    <div><strong>Transaction ID:</strong> {formData.paymentDetails.transactionId}</div>
                    <div><strong>Bank:</strong> {formData.paymentDetails.bank}</div>
                    <div><strong>Date:</strong> {formData.paymentDetails.paymentDate}</div>
                    <div><strong>Slip Uploaded:</strong> {transactionSlip ? 'Yes' : 'No'}</div>
                </div>
            </div>

            <div className="review-section" style={{ borderBottom: 'none' }}>
                <h4>Declaration</h4>
                <div className="review-grid">
                    <div style={{ color: formData.declarationAccepted ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                        {formData.declarationAccepted ? '✓ Accepted' : '✗ Not Accepted'}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER ---

    if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Loading application wizard...</div>;
    if (!offering) return <div style={{ textAlign: 'center', padding: '60px' }}>Offering not found.</div>;

    if (success) {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '80px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px' }}>
                    ✓
                </div>
                <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '10px' }}>Your application has been successfully submitted</h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>You will be notified regarding further instructions through email.</p>
                <Link to="/student" className="btn-primary" style={{ textDecoration: 'none' }}>Continue to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #ef4444' }}>{error}</div>}
            
            <div className="wizard-container">
                {/* Top Navigation Bar */}
                <div className="wizard-nav">
                    {steps.map((stepLabel, index) => (
                        <div 
                            key={index} 
                            className={`wizard-nav-step ${currentStep === index ? 'active' : ''} ${currentStep > index ? 'completed' : ''}`}
                            onClick={() => index <= currentStep && setCurrentStep(index)}
                        >
                            <div className="step-circle">{currentStep > index ? '✓' : ''}</div>
                            <span className="step-label">{stepLabel}</span>
                        </div>
                    ))}
                </div>

                {/* Progress Bar Line */}
                <div className="wizard-progress-track">
                    <div className="wizard-progress-fill" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
                </div>

                <div className="wizard-content">
                    <form onSubmit={(e) => { e.preventDefault(); if(currentStep === steps.length - 1) handleSubmit(); else handleNext(); }}>
                        
                        {currentStep === 0 && renderStep1General()}
                        {currentStep === 1 && renderStep2Exams()}
                        {currentStep === 2 && renderStep3Experience()}
                        {currentStep === 3 && renderStep4Fee()}
                        {currentStep === 4 && renderStep5Declaration()}
                        {currentStep === 5 && renderStep6Review()}

                        <div className="wizard-footer">
                            {currentStep > 0 ? (
                                <button type="button" className="btn-secondary" onClick={handleBack} disabled={submitting}>Back</button>
                            ) : (
                                <Link to="/student" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', boxSizing: 'border-box' }}>Cancel</Link>
                            )}
                            
                            <button type="submit" className="btn-primary" disabled={submitting || (currentStep === 4 && !formData.declarationAccepted)}>
                                {submitting ? 'Submitting...' : currentStep === steps.length - 1 ? 'Submit Final Application' : 'Save & Next'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
