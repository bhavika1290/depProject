import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/apiCore';
import './CreateOpening.css';

const RESEARCH_AREAS = [
    'Algebra', 'Real Analysis', 'Functional Analysis', 'Number Theory', 'Topology',
    'Differential Geometry', 'Partial Differential Equations', 'Probability Theory', 
    'Statistics', 'Mathematical Physics', 'Numerical Analysis', 'Combinatorics',
    'Graph Theory', 'Operations Research', 'Mathematical Biology'
];

const FUNDING_OPTIONS = [
    'Institute Fellowship (HTRA)',
    'UGC-JRF',
    'CSIR-JRF',
    'DST-INSPIRE',
    'NBHM Fellowship',
    'Visvesvaraya PhD Scheme',
    'Project Funded (JRF/SRF)',
    'Self-Sponsored / Part-Time'
];

/**
 * Helper component to handle validation errors and scroll to them.
 * This is a child of Formik so it can use useFormikContext.
 */
function FormErrorManager() {
    const { errors, submitCount } = useFormikContext();

    useEffect(() => {
        if (submitCount > 0 && Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            toast.error(`Please fix: ${errors[firstErrorField]}`, { 
                toastId: 'form-val-err',
                position: "top-center"
            });
            
            // Scroll to the first error field
            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
        }
    }, [submitCount, errors]);

    return null;
}

export default function CreateOpening() {
    const navigate = useNavigate();
    const [projectFile, setProjectFile] = useState(null);
    const [eligibilityFile, setEligibilityFile] = useState(null);
    const [activeCycle, setActiveCycle] = useState(null);

    useEffect(() => {
        // Fetch the active admission cycle
        api.get('/admission-cycles/active')
            .then(res => {
                if (res.data?.success && res.data?.data) {
                    setActiveCycle(res.data.data);
                }
            })
            .catch(err => {
                console.error('Error fetching active cycle:', err);
                toast.warning('Warning: No active admission cycle found. You may not be able to publish.');
            });
    }, []);

    const initialValues = {
        // Section 1: Basic Information
        researchArea: '',
        projectTitle: '',
        department: '',
        numberOfPositions: 1,
        fundingType: '',
        applicationDeadline: '',

        // Section 2: Eligibility Criteria
        minMscCgpa: '',
        minBscCgpa: '',
        gateScore: '',
        csirNet: false,
        nbhm: false,
        allowedCategories: [],
        minResearchExperience: '',

        // Section 3: Additional Requirements
        keywords: ''
    };

    const validationSchema = Yup.object({
        researchArea: Yup.string().required('Research Area is required'),
        projectTitle: Yup.string().required('Project Title is required'),
        department: Yup.string().required('Department is required'),
        numberOfPositions: Yup.number().min(1, 'At least 1 position required').required('Number of positions is required'),
        fundingType: Yup.string().required('Funding Type is required'),
        applicationDeadline: Yup.date().required('Application Deadline is required'),
        // Eligibility
        minMscCgpa: Yup.number().min(0, 'Min MSc Math CGPA must be positive').max(10, 'Max CGPA is 10').required('Min MSc Math CGPA is required'),
        minBscCgpa: Yup.number().min(0, 'Min BSc Math CGPA must be positive').max(10, 'Max CGPA is 10').required('Min BSc Math CGPA is required'),
        gateScore: Yup.number().min(0, 'Score cannot be negative').max(1000, 'Max score is 1000').nullable(),
        csirNet: Yup.boolean(),
        nbhm: Yup.boolean(),
        allowedCategories: Yup.array().min(1, 'Select at least one category'),
        minResearchExperience: Yup.number().min(0, 'Experience Cannot be negative').nullable(),
        keywords: Yup.string().required('At least one keyword is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (!activeCycle) {
                toast.error('Cannot create offering without an active admission cycle.');
                setSubmitting(false);
                return;
            }

            // Map form values to the Offering schema
            const payload = {
                admissionCycleId: activeCycle._id,
                department: values.department,
                specialization: values.researchArea,
                offeringType: values.fundingType,
                deadline: values.applicationDeadline,
                description: values.projectTitle,
                numberOfSeats: values.numberOfPositions,
                researchAreas: values.keywords ? values.keywords.split(',').map(k => k.trim()) : [],
                minimumQualification: JSON.stringify({
                    minMscCgpa: values.minMscCgpa,
                    minBscCgpa: values.minBscCgpa,
                    gateScore: values.gateScore,
                    csirNet: values.csirNet,
                    nbhm: values.nbhm,
                    allowedCategories: values.allowedCategories,
                    minResearchExperience: values.minResearchExperience
                })
            };

            console.log('Publishing Offering Payload:', payload);
            
            // Send API Request
            await api.post('/offerings', payload);

            toast.success('Opening successfully created and published!');
            navigate('/faculty/openings');
        } catch (error) {
            console.error('Submission failed', error);
            toast.error(error.response?.data?.message || 'Failed to create opening. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveDraft = (values) => {
        console.log('Saving Draft...', values);
        toast.info('Draft saved successfully!');
        // Normally sending to endpoint with draft status
    };

    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

    return (
        <div className="create-opening-container">
            <div className="page-header">
                <h2>Create PhD Opening</h2>
                <p>Fill in the details to publish a new PhD position or save as draft.</p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className="create-opening-form">
                        <FormErrorManager />
                        
                        {/* Section 1: Basic Information */}
                        <section className="form-section">
                            <h3 className="section-title">1. Basic Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Research Area <span className="required">*</span></label>
                                    <Field as="select" name="researchArea" className="form-input">
                                        <option value="">Select Research Area</option>
                                        {RESEARCH_AREAS.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="researchArea" component="div" className="error-text" />
                                </div>

                                <div className="form-group">
                                    <label>Project Title <span className="required">*</span></label>
                                    <Field type="text" name="projectTitle" placeholder="e.g. Advancements in Deep Learning" className="form-input" />
                                    <ErrorMessage name="projectTitle" component="div" className="error-text" />
                                </div>

                                <div className="form-group">
                                    <label>Department <span className="required">*</span></label>
                                    <Field as="select" name="department" className="form-input">
                                        <option value="">Select Department</option>
                                        <option value="Biomedical Engineering">Biomedical Engineering</option>
                                        <option value="Chemical Engineering">Chemical Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                                        <option value="Electrical Engineering">Electrical Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Humanities and Social Sciences">Humanities and Social Sciences</option>
                                        <option value="Metallurgical and Material Engineering">Metallurgical and Material Engineering</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Mathematics and Computing">Mathematics and Computing</option>
                                    </Field>
                                    <ErrorMessage name="department" component="div" className="error-text" />
                                </div>

                                <div className="form-group">
                                    <label>Number of Positions <span className="required">*</span></label>
                                    <Field type="number" name="numberOfPositions" min="1" className="form-input" />
                                    <ErrorMessage name="numberOfPositions" component="div" className="error-text" />
                                </div>

                                <div className="form-group">
                                    <label>Funding Type <span className="required">*</span></label>
                                    <Field as="select" name="fundingType" className="form-input">
                                        <option value="">Select Funding Type</option>
                                        <option value="Regular">Institute Fellowship (HTRA)</option>
                                        <option value="External">External Fellowship (UGC-JRF, CSIR-JRF, etc.)</option>
                                        <option value="Project Staff">Project Funded (JRF/SRF)</option>
                                        <option value="Part-Time">Self-Sponsored / Part-Time</option>
                                        <option value="Direct">Direct Admission</option>
                                    </Field>
                                    <ErrorMessage name="fundingType" component="div" className="error-text" />
                                </div>

                                <div className="form-group">
                                    <label>Application Deadline <span className="required">*</span></label>
                                    <Field type="date" name="applicationDeadline" className="form-input" />
                                    <ErrorMessage name="applicationDeadline" component="div" className="error-text" />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Eligibility Criteria */}
                        <section className="form-section">
                            <h3 className="section-title">2. Eligibility Criteria</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Minimum MSc Mathematics CGPA (out of 10) <span className="required">*</span></label>
                                    <Field type="number" step="0.1" max="10" name="minMscCgpa" placeholder="e.g. 7.5" className="form-input" />
                                    <ErrorMessage name="minMscCgpa" component="div" className="error-text" />
                                </div>

                                <div className="form-group">
                                    <label>Minimum BSc Mathematics CGPA (out of 10) <span className="required">*</span></label>
                                    <Field type="number" step="0.1" max="10" name="minBscCgpa" placeholder="e.g. 7.0" className="form-input" />
                                    <ErrorMessage name="minBscCgpa" component="div" className="error-text" />
                                </div>

                                <div className="form-group">
                                    <label>GATE Mathematics Score</label>
                                    <Field name="gateScore" type="number" className="form-input" placeholder="e.g. 600" />
                                    <ErrorMessage name="gateScore" component="div" className="error-text" />
                                </div>
                                
                                <div className="form-group checkbox-group-inline">
                                    <label className="checkbox-label">
                                        <Field type="checkbox" name="csirNet" />
                                        CSIR-NET Mathematical Sciences Qualified
                                    </label>
                                    <ErrorMessage name="csirNet" component="div" className="error-text" />
                                </div>
                                
                                <div className="form-group checkbox-group-inline">
                                    <label className="checkbox-label">
                                        <Field type="checkbox" name="nbhm" />
                                        NBHM Qualified
                                    </label>
                                    <ErrorMessage name="nbhm" component="div" className="error-text" />
                                </div>

                                <div className="form-group full-width">
                                    <label>Allowed Categories <span className="required">*</span></label>
                                    <div className="checkbox-group">
                                        {categories.map(cat => (
                                            <label key={cat} className="checkbox-label">
                                                <Field type="checkbox" name="allowedCategories" value={cat} />
                                                <span>{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <ErrorMessage name="allowedCategories" component="div" className="error-text" />
                                </div>

                                <div className="form-group full-width">
                                    <label>Minimum Research Experience (in months, if applicable)</label>
                                    <Field type="number" min="0" name="minResearchExperience" placeholder="e.g. 12" className="form-input" />
                                    <ErrorMessage name="minResearchExperience" component="div" className="error-text" />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Additional Requirements */}
                        <section className="form-section">
                            <h3 className="section-title">3. Additional Requirements</h3>
                            
                            <div className="form-group full-width">
                                <label>Keywords (comma separated) <span className="required">*</span></label>
                                <Field type="text" name="keywords" placeholder="e.g. Deep Learning, NLP, Healthcare" className="form-input" />
                                <span className="input-hint">Help applicants find your opening more easily.</span>
                                <ErrorMessage name="keywords" component="div" className="error-text" />
                            </div>

                            <div className="file-uploads-grid">
                                <div className="form-group file-upload-group">
                                    <label>Upload Project Description</label>
                                    <div className="file-upload-wrapper">
                                        <input 
                                            type="file" 
                                            id="projectDesc" 
                                            className="file-input-hidden" 
                                            onChange={(e) => setProjectFile(e.target.files[0])}
                                            accept=".pdf,.doc,.docx"
                                        />
                                        <label htmlFor="projectDesc" className="file-upload-btn">
                                            <span>📤</span> {projectFile ? projectFile.name : 'Choose File...'}
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group file-upload-group">
                                    <label>Upload Detailed Eligibility (PDF)</label>
                                    <div className="file-upload-wrapper">
                                        <input 
                                            type="file" 
                                            id="eligibilityPdf" 
                                            className="file-input-hidden"
                                            onChange={(e) => setEligibilityFile(e.target.files[0])}
                                            accept=".pdf"
                                        />
                                        <label htmlFor="eligibilityPdf" className="file-upload-btn">
                                            <span>📤</span> {eligibilityFile ? eligibilityFile.name : 'Choose PDF...'}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => handleSaveDraft(values)}
                                disabled={isSubmitting}
                            >
                                Save Draft
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Opening'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
