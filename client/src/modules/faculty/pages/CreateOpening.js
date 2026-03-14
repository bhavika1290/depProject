import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

export default function CreateOpening() {
    const navigate = useNavigate();
    const [projectFile, setProjectFile] = useState(null);
    const [eligibilityFile, setEligibilityFile] = useState(null);

    const initialValues = {
        // Section 1: Basic Information
        researchArea: '',
        projectTitle: '',
        department: '',
        numberOfPositions: 1,
        fundingType: '',
        applicationDeadline: '',

        // Section 2: Eligibility Criteria
        minCgpa: '',
        requiredDegree: '',
        gateRequired: 'No',
        csirNetRequired: 'No',
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
            // Here you would normally create FormData to upload files along with JSON data
            // const formData = new FormData();
            // Object.keys(values).forEach(key => formData.append(key, values[key]));
            // if (projectFile) formData.append('projectDescription', projectFile);
            // if (eligibilityFile) formData.append('eligibilityPdf', eligibilityFile);

            console.log('Form Submitted (Publish)', values);
            if (projectFile) console.log('Project File:', projectFile.name);
            if (eligibilityFile) console.log('Eligibility File:', eligibilityFile.name);

            toast.success('Opening successfully created and published!');
            navigate('/faculty/openings');
        } catch (error) {
            console.error('Submission failed', error);
            toast.error('Failed to create opening. Please try again.');
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
                                        <option value="Computer Science">Computer Science and Engineering</option>
                                        <option value="Electrical">Electrical Engineering</option>
                                        <option value="Mechanical">Mechanical Engineering</option>
                                        <option value="Civil">Civil Engineering</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
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
                                        {FUNDING_OPTIONS.map(option => (
                                            <option key={option} value={option.split(' ')[0]}>{option}</option>
                                        ))}
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
