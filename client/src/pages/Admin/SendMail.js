import React, { useState, useEffect } from 'react';
import { MdSend, MdPreview, MdCheck, MdEmail } from 'react-icons/md';
import api from '../../services/apiCore';
import { toast } from 'react-toastify';

export default function SendMail() {
    // Selection state
    const [recipientType, setRecipientType] = useState('students_selected'); // students_selected, students_all, faculty_selected, faculty_all
    const [templates, setTemplates] = useState([]);
    
    // Data state
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // Selected recipients state
    const [selectedIds, setSelectedIds] = useState([]);

    // Form state
    const [emailData, setEmailData] = useState({
        templateId: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTemplates();
        fetchFaculties();
        fetchStudents();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/templates');
            setTemplates(res.data.data);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoadingData(true);
            const res = await api.get('/applications');
            setStudents(res.data.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchFaculties = async () => {
        try {
            const res = await api.get('/users?role=faculty');
            setFaculties(res.data.data);
        } catch (error) {
            console.error('Failed to fetch faculties:', error);
        }
    };

    const handleRecipientTypeChange = (e) => {
        setRecipientType(e.target.value);
        setSelectedIds([]); // Reset selections on type change
    };

    const handleTemplateChange = (e) => {
        const tId = e.target.value;
        const template = templates.find(t => t._id === tId);
        
        if (template) {
            setEmailData({
                templateId: tId,
                subject: template.subject || '',
                message: template.emailBody || template.content || ''
            });
        } else {
            setEmailData({ ...emailData, templateId: tId });
        }
    };

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            if (recipientType.includes('students')) {
                setSelectedIds(students.map(s => s._id));
            } else {
                setSelectedIds(faculties.map(f => f._id));
            }
        } else {
            setSelectedIds([]);
        }
    };

    const getRecipientsPayload = () => {
        let recipientList = [];
        
        if (recipientType === 'students_all') {
            recipientList = students;
        } else if (recipientType === 'students_selected') {
            recipientList = students.filter(s => selectedIds.includes(s._id));
        } else if (recipientType === 'faculty_all') {
            recipientList = faculties;
        } else if (recipientType === 'faculty_selected') {
            recipientList = faculties.filter(f => selectedIds.includes(f._id));
        }

        // Map internal models to recipient format { email, name }
        return recipientList.map(item => {
            if (item.applicationId) { 
                // Student Application format
                return {
                    email: item.userId?.email || '',
                    name: item.personalDetails?.fullName || 'Applicant'
                };
            } else {
                // Faculty User format
                return {
                    email: item.email,
                    name: item.name || 'Faculty Member'
                };
            }
        }).filter(r => r.email); // Ensure email exists
    };

    const handleSendEmail = async () => {
        const recipients = getRecipientsPayload();

        if (recipients.length === 0) {
            toast.error('Please select at least one recipient.');
            return;
        }
        if (!emailData.subject || !emailData.message) {
            toast.error('Subject and message cannot be empty.');
            return;
        }

        if (!window.confirm(`Are you sure you want to send this email to ${recipients.length} recipients?`)) {
            return;
        }

        try {
            setSending(true);
            const payload = {
                recipients,
                subject: emailData.subject,
                html: emailData.message
            };

            const res = await api.post('/emails/send-custom', payload);
            toast.success(res.data?.message || 'Emails sent successfully!');
            
            // Reset form optionally
            setEmailData({ templateId: '', subject: '', message: '' });
            if (recipientType.includes('selected')) {
                setSelectedIds([]);
            }
        } catch (error) {
            console.error('Email send error:', error);
            toast.error(error.response?.data?.message || 'Failed to send emails.');
        } finally {
            setSending(false);
        }
    };

    const showTable = recipientType === 'students_selected' || recipientType === 'faculty_selected';
    const isStudentMode = recipientType.includes('students');
    const displayList = isStudentMode ? students : faculties;

    return (
        <div className="sendmail-container animate-fade-in" style={{ paddingBottom: '40px' }}>
            <h2 className="section-title" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdEmail color="var(--premium-blue)" /> Send Custom Email
            </h2>

            <div className="premium-table-wrapper" style={{ marginBottom: '24px', padding: '24px' }}>
                <h4 style={{ marginBottom: '16px', color: '#1e293b' }}>1. Select Recipients</h4>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="recipientType" value="students_selected" checked={recipientType === 'students_selected'} onChange={handleRecipientTypeChange} />
                        Selected Students
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="recipientType" value="students_all" checked={recipientType === 'students_all'} onChange={handleRecipientTypeChange} />
                        All Students ({students.length})
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="recipientType" value="faculty_selected" checked={recipientType === 'faculty_selected'} onChange={handleRecipientTypeChange} />
                        Selected Faculty
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="recipientType" value="faculty_all" checked={recipientType === 'faculty_all'} onChange={handleRecipientTypeChange} />
                        All Faculty ({faculties.length})
                    </label>
                </div>

                {showTable && (
                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <table className="premium-table" style={{ width: '100%', margin: 0 }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1 }}>
                                <tr>
                                    <th style={{ width: '40px', textAlign: 'center' }}>
                                        <input 
                                            type="checkbox" 
                                            onChange={handleSelectAll}
                                            checked={displayList.length > 0 && selectedIds.length === displayList.length}
                                        />
                                    </th>
                                    {isStudentMode ? (
                                        <>
                                            <th>APP ID</th>
                                            <th>NAME</th>
                                            <th>EMAIL</th>
                                            <th>STATUS</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>NAME</th>
                                            <th>EMAIL</th>
                                            <th>RESEARCH AREA</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {loadingData ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                                ) : displayList.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No records found.</td></tr>
                                ) : (
                                    displayList.map(item => (
                                        <tr key={item._id} onClick={() => handleCheckboxChange(item._id)} style={{ cursor: 'pointer' }}>
                                            <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(item._id)}
                                                    onChange={() => handleCheckboxChange(item._id)}
                                                />
                                            </td>
                                            {isStudentMode ? (
                                                <>
                                                    <td style={{ fontWeight: 500 }}>{item.applicationId}</td>
                                                    <td>{item.personalDetails?.fullName || 'N/A'}</td>
                                                    <td style={{ color: '#64748b' }}>{item.userId?.email}</td>
                                                    <td>
                                                        <span className={`role-badge ${item.status?.toLowerCase().replace(' ', '-')}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td style={{ fontWeight: 500 }}>
                                                        <div>{item.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.designation}</div>
                                                    </td>
                                                    <td style={{ color: '#64748b' }}>{item.email}</td>
                                                    <td>{item.researchArea || 'N/A'}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {showTable && (
                    <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#64748b' }}>
                        {selectedIds.length} recipient(s) selected
                    </div>
                )}
            </div>

            <div className="premium-table-wrapper" style={{ padding: '24px' }}>
                <h4 style={{ marginBottom: '16px', color: '#1e293b' }}>2. Compose Email</h4>
                
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="form-group">
                        <label className="form-label">Use a Template (Optional)</label>
                        <select className="form-input" value={emailData.templateId} onChange={handleTemplateChange}>
                            <option value="">-- Select Template --</option>
                            {templates.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subject</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter email subject" 
                            value={emailData.subject} 
                            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Message Area (HTML supported)</label>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                            You can use `{'{{name}}'}` as a variable to inject the recipient's name dynamically.
                        </p>
                        <textarea 
                            className="form-input" 
                            style={{ minHeight: '250px', resize: 'vertical', fontFamily: 'monospace' }}
                            placeholder="<p>Dear {{name}},</p>&#10;<p>Your message here...</p>"
                            value={emailData.message}
                            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                        <button 
                            className="btn-primary" 
                            onClick={handleSendEmail} 
                            disabled={sending}
                            style={{ width: '200px', justifyContent: 'center', padding: '14px', backgroundColor: sending ? '#94a3b8' : 'var(--premium-blue)' }}
                        >
                            {sending ? 'Sending...' : <><MdSend style={{ marginRight: '8px' }} /> Send Email</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
