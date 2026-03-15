import React, { useState, useEffect, useRef } from 'react';
import { MdSend, MdEmail, MdUploadFile, MdClose, MdPeople, MdCheckCircle } from 'react-icons/md';
import * as XLSX from 'xlsx';
import api from '../../services/apiCore';
import { toast } from 'react-toastify';

export default function SendMail() {
    // Selection state
    const [recipientType, setRecipientType] = useState('students_selected'); // students_selected, students_all, faculty_selected, faculty_all, csv_upload
    const [templates, setTemplates] = useState([]);

    // Data state
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // CSV upload state
    const [csvRecipients, setCsvRecipients] = useState([]); // [{name, email, interviewDate, ...}]
    const [csvFileName, setCsvFileName] = useState('');
    const csvInputRef = useRef(null);

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
            setTemplates(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoadingData(true);
            const res = await api.get('/applications');
            setStudents(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchFaculties = async () => {
        try {
            const res = await api.get('/users?role=faculty');
            setFaculties(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch faculties:', error);
        }
    };

    const handleRecipientTypeChange = (e) => {
        setRecipientType(e.target.value);
        setSelectedIds([]);
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

    // Handle CSV file upload
    const handleCsvUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
            toast.error('Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)');
            return;
        }

        setCsvFileName(file.name);
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

                if (rows.length === 0) {
                    toast.error('The uploaded file appears to be empty.');
                    return;
                }

                // Normalize headers (case-insensitive)
                const normalized = rows.map(row => {
                    const lower = {};
                    Object.keys(row).forEach(k => { lower[k.toLowerCase().trim().replace(/\s+/g, '')] = row[k]; });
                    return {
                        name: lower['studentname'] || lower['name'] || lower['applicantname'] || '',
                        email: lower['email'] || '',
                        interviewDate: lower['interviewdate&time'] || lower['interviewdate'] || lower['interviewdatetime'] || lower['scheduledtime'] || '',
                        applicationId: lower['applicationid'] || '',
                        researchArea: lower['researcharea'] || '',
                        department: lower['department'] || '',
                        interviewStatus: lower['interviewstatus'] || '',
                    };
                }).filter(r => r.email);

                if (normalized.length === 0) {
                    toast.error('No valid email addresses found. Ensure your file has an "Email" or "Student Name" column.');
                    return;
                }

                setCsvRecipients(normalized);
                toast.success(`✅ Loaded ${normalized.length} recipients from "${file.name}"`);
            } catch (err) {
                console.error('CSV parse error:', err);
                toast.error('Failed to parse the file. Please check the format.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleRemoveCsv = () => {
        setCsvRecipients([]);
        setCsvFileName('');
        if (csvInputRef.current) csvInputRef.current.value = '';
    };

    const getRecipientsPayload = () => {
        if (recipientType === 'csv_upload') {
            return csvRecipients.map(r => ({
                email: r.email,
                name: r.name || 'Applicant',
                interviewDate: r.interviewDate,
                applicationId: r.applicationId,
                researchArea: r.researchArea,
                department: r.department,
            }));
        }

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

        return recipientList.map(item => {
            if (item.applicationId) {
                return {
                    email: item.userId?.email || '',
                    name: item.personalDetails?.fullName || 'Applicant',
                    interviewDate: item.interviewDate,
                    applicationId: item.applicationId,
                    researchArea: item.offeringId?.researchArea || '',
                    department: item.offeringId?.department || ''
                };
            } else {
                return {
                    email: item.email,
                    name: item.name || 'Faculty Member'
                };
            }
        }).filter(r => r.email);
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
            toast.success(res.data?.message || `Emails sent to ${recipients.length} recipients!`);

            setEmailData({ templateId: '', subject: '', message: '' });
            if (recipientType.includes('selected')) setSelectedIds([]);
            if (recipientType === 'csv_upload') handleRemoveCsv();
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

            {/* Step 1: Recipients */}
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: recipientType === 'csv_upload' ? '#eff6ff' : 'transparent', padding: '4px 12px', borderRadius: '8px', border: recipientType === 'csv_upload' ? '1.5px solid #3b82f6' : '1.5px solid transparent' }}>
                        <input type="radio" name="recipientType" value="csv_upload" checked={recipientType === 'csv_upload'} onChange={handleRecipientTypeChange} />
                        <MdUploadFile size={18} color="#3b82f6" />
                        <strong style={{ color: '#3b82f6' }}>Upload CSV / Excel</strong>
                    </label>
                </div>

                {/* CSV Upload Panel */}
                {recipientType === 'csv_upload' && (
                    <div style={{ marginTop: '8px' }}>
                        {csvRecipients.length === 0 ? (
                            <div
                                onClick={() => csvInputRef.current?.click()}
                                style={{
                                    border: '2px dashed #94a3b8',
                                    borderRadius: '12px',
                                    padding: '40px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: '#f8fafc',
                                    transition: 'border-color 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#94a3b8'}
                            >
                                <MdUploadFile size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
                                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                                    Click to upload your CSV or Excel file
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    Accepted: .csv, .xlsx, .xls — Columns: <strong>Student Name</strong>, <strong>Email</strong>, <strong>Interview Date &amp; Time</strong>, Application ID, Research Area, etc.
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
                                    💡 Tip: Use the "Export Shortlisted CSV" button in Admissions to get a pre-filled file.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <MdCheckCircle size={22} color="#16a34a" />
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#15803d' }}>{csvFileName}</div>
                                            <div style={{ fontSize: '0.82rem', color: '#4ade80' }}>{csvRecipients.length} valid recipients loaded</div>
                                        </div>
                                    </div>
                                    <button onClick={handleRemoveCsv} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} title="Remove CSV">
                                        <MdClose size={20} />
                                    </button>
                                </div>
                                <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <table className="premium-table" style={{ width: '100%', margin: 0 }}>
                                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1 }}>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Interview Date & Time</th>
                                                <th>Research Area</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {csvRecipients.map((r, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{idx + 1}</td>
                                                    <td style={{ fontWeight: 500 }}>{r.name || '—'}</td>
                                                    <td style={{ color: '#64748b' }}>{r.email}</td>
                                                    <td style={{ color: r.interviewDate ? '#0369a1' : '#94a3b8' }}>
                                                        {r.interviewDate || 'Not Scheduled'}
                                                    </td>
                                                    <td style={{ color: '#64748b' }}>{r.researchArea || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <input
                            ref={csvInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            style={{ display: 'none' }}
                            onChange={handleCsvUpload}
                        />
                    </div>
                )}

                {/* Existing Table for student/faculty selection */}
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

                {(showTable || recipientType === 'csv_upload') && (
                    <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MdPeople size={16} />
                        {recipientType === 'csv_upload'
                            ? `${csvRecipients.length} recipient(s) from CSV`
                            : `${selectedIds.length} recipient(s) selected`}
                    </div>
                )}
            </div>

            {/* Step 2: Compose Email */}
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
                            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Message Body (HTML supported)</label>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', background: '#f1f5f9', padding: '8px 12px', borderRadius: '6px' }}>
                            💡 Available variables: <code>{'{{name}}'}</code> — recipient's name &nbsp;|&nbsp; <code>{'{{interviewDate}}'}</code> — scheduled interview date/time (from CSV)
                        </p>
                        <textarea
                            className="form-input"
                            style={{ minHeight: '250px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                            placeholder="<p>Dear {{name}},</p>&#10;<p>Your message here...</p>"
                            value={emailData.message}
                            onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                        <button
                            className="btn-primary"
                            onClick={handleSendEmail}
                            disabled={sending}
                            style={{
                                width: '220px',
                                justifyContent: 'center',
                                padding: '14px',
                                backgroundColor: sending ? '#94a3b8' : 'var(--premium-blue)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {sending ? 'Sending...' : <><MdSend /> Send Email</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
