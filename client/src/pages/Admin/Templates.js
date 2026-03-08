import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdClose,
  MdSearch,
  MdMoreVert
} from 'react-icons/md';
import api from '../../services/apiCore';

export default function Templates() {
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState([
    { _id: '1', name: 'REGULAR', scope: 'DEFAULT', type: 'APPLICANT LIST' },
    { _id: '2', name: 'EXTERNAL', scope: 'DEFAULT', type: 'APPLICANT LIST' },
    { _id: '3', name: 'PART-TIME', scope: 'DEFAULT', type: 'APPLICANT LIST' },
    { _id: '4', name: 'DIRECT', scope: 'DEFAULT', type: 'APPLICANT LIST' },
    { _id: '5', name: 'STAFF MEMBER', scope: 'DEFAULT', type: 'APPLICANT LIST' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      if (response.data.success && response.data.data.length > 0) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="templates-container animate-fade-in">
      <div className="premium-table-wrapper">
        <div className="table-toolbar">
          <h3 className="section-title">List of Templates</h3>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <MdAdd /> Add template
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading templates...</div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>TEMPLATE NAME</th>
                <th style={{ textAlign: 'center' }}>TEMPLATE SCOPE</th>
                <th style={{ textAlign: 'center' }}>TEMPLATE TYPE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template._id}>
                  <td style={{ fontWeight: 500, color: '#475569' }}>{template.name}</td>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>{template.scope || 'DEFAULT'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="role-badge" style={{ backgroundColor: '#fff1f2', color: '#fb7185', border: '1px solid #ffe4e6' }}>
                      {template.type || 'APPLICANT LIST'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="cycle-btn" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                        <MdVisibility />
                      </button>
                      <button className="cycle-btn" style={{ backgroundColor: '#10b981', color: 'white' }}>
                        <MdEdit />
                      </button>
                      <button className="cycle-btn" style={{ backgroundColor: '#f43f5e', color: 'white' }}>
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
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Add Template</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label className="form-label">Template Name</label>
                <input type="text" className="form-input" placeholder="e.g. M.Tech Offer" />
              </div>
              <div className="form-group">
                <label className="form-label">Template Scope</label>
                <select className="form-input">
                  <option>DEFAULT</option>
                  <option>SPECIFIC</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Template Type</label>
                <select className="form-input">
                  <option>APPLICANT LIST</option>
                  <option>EMAIL CONTENT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea className="form-input" style={{ minHeight: '150px' }} placeholder="Enter template content..."></textarea>
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <button className="btn-primary" style={{ justifyContent: 'center', padding: '14px', width: '100%' }}>Create Template</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
