import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdClose,
  MdEmail,
  MdContentCopy
} from 'react-icons/md';
import api from '../../services/apiCore';
import { toast } from 'react-toastify';

export default function Templates() {
  const [showModal, setShowModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', scope: 'CUSTOM', type: 'EMAIL', subject: '', emailBody: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      if (response.data.success) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.post('/templates', formData);
      if (res.data.success) {
        setTemplates(prev => [res.data.data, ...prev]);
        setShowModal(false);
        setFormData({ name: '', scope: 'CUSTOM', type: 'EMAIL', subject: '', emailBody: '' });
        toast.success('Template created successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create template.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, scope) => {
    if (scope === 'DEFAULT') {
      toast.error('Cannot delete DEFAULT templates.');
      return;
    }
    if (!window.confirm('Delete this template?')) return;
    try {
      await api.delete(`/templates/${id}`);
      setTemplates(prev => prev.filter(t => t._id !== id));
      toast.success('Template deleted.');
    } catch (err) {
      toast.error('Failed to delete template.');
    }
  };

  const handleCopyBody = (template) => {
    const text = template.emailBody || template.content || '';
    navigator.clipboard.writeText(text);
    toast.info('Template body copied to clipboard!');
  };

  const getBadgeStyle = (type) => {
    if (type === 'EMAIL') return { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' };
    if (type === 'APPLICANT LIST') return { backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' };
    return { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
  };

  return (
    <div className="templates-container animate-fade-in">
      <div className="premium-table-wrapper">
        <div className="table-toolbar">
          <h3 className="section-title">Email & Document Templates</h3>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <MdAdd /> Add Template
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading templates...</div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>TEMPLATE NAME</th>
                <th style={{ textAlign: 'center' }}>SCOPE</th>
                <th style={{ textAlign: 'center' }}>TYPE</th>
                <th>SUBJECT</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{template.name}</div>
                    {template.variables?.length > 0 && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Variables: {template.variables.map(v => `{{${v.name}}}`).join(', ')}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: template.scope === 'DEFAULT' ? '#f0fdf4' : '#f8fafc',
                      color: template.scope === 'DEFAULT' ? '#16a34a' : '#64748b',
                      border: template.scope === 'DEFAULT' ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                    }}>
                      {template.scope || 'DEFAULT'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="role-badge" style={getBadgeStyle(template.type)}>
                      {template.type === 'EMAIL' ? <><MdEmail size={12} style={{ marginRight: 4 }} /></> : null}
                      {template.type || 'APPLICANT LIST'}
                    </span>
                  </td>
                  <td style={{ color: '#475569', fontSize: '13px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {template.subject || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="cycle-btn"
                        style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                        title="Preview template"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <MdVisibility />
                      </button>
                      <button
                        className="cycle-btn"
                        style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                        title="Copy body to clipboard"
                        onClick={() => handleCopyBody(template)}
                      >
                        <MdContentCopy />
                      </button>
                      <button
                        className="cycle-btn"
                        style={{ backgroundColor: template.scope === 'DEFAULT' ? '#94a3b8' : '#f43f5e', color: 'white', cursor: template.scope === 'DEFAULT' ? 'not-allowed' : 'pointer' }}
                        title={template.scope === 'DEFAULT' ? "Cannot delete default templates" : "Delete template"}
                        onClick={() => handleDelete(template._id, template.scope)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD TEMPLATE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h2>Add Email Template</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleCreate} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label className="form-label">Template Name *</label>
                <input type="text" className="form-input" placeholder="e.g. Interview Confirmation" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Scope</label>
                  <select className="form-input" value={formData.scope} onChange={e => setFormData({ ...formData, scope: e.target.value })}>
                    <option value="CUSTOM">CUSTOM</option>
                    <option value="DEFAULT">DEFAULT</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="EMAIL">EMAIL</option>
                    <option value="APPLICANT LIST">APPLICANT LIST</option>
                    <option value="DOCUMENT">DOCUMENT</option>
                  </select>
                </div>
              </div>
              {formData.type === 'EMAIL' && (
                <div className="form-group">
                  <label className="form-label">Email Subject *</label>
                  <input type="text" className="form-input" placeholder="e.g. Your Interview Schedule — IIT Ropar" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required={formData.type === 'EMAIL'} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Body / Content (HTML supported)</label>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  Use <code>{'{{name}}'}</code>, <code>{'{{interviewDate}}'}</code>, <code>{'{{applicationId}}'}</code>, <code>{'{{year}}'}</code> as variables.
                </p>
                <textarea className="form-input" style={{ minHeight: '180px', fontFamily: 'monospace', fontSize: '13px' }} placeholder="<p>Dear {{name}},</p><p>Your interview is on {{interviewDate}}.</p>" value={formData.emailBody} onChange={e => setFormData({ ...formData, emailBody: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginTop: '8px' }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: 'center', padding: '14px', width: '100%' }}>
                  {saving ? 'Creating...' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewTemplate && (
        <div className="modal-overlay" onClick={() => setPreviewTemplate(null)}>
          <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 style={{ margin: 0 }}>{previewTemplate.name}</h2>
                {previewTemplate.subject && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Subject: {previewTemplate.subject}</p>}
              </div>
              <button onClick={() => setPreviewTemplate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}><MdClose /></button>
            </div>
            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '8px', margin: '16px 0' }}>
              {previewTemplate.emailBody ? (
                <div dangerouslySetInnerHTML={{ __html: previewTemplate.emailBody }} />
              ) : (
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#334155' }}>{previewTemplate.content || 'No content.'}</pre>
              )}
            </div>
            {previewTemplate.variables?.length > 0 && (
              <div style={{ padding: '0 0 8px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Available Variables:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {previewTemplate.variables.map((v, i) => (
                    <span key={i} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 10px', fontSize: '12px' }}>
                      {`{{${v.name}}}`} — {v.description}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
