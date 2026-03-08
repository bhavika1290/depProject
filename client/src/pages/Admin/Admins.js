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

export default function Admins() {
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      // Fetch both admin and faculty roles
      const [adminsRes, facultyRes] = await Promise.all([
        api.get('/users?role=admin'),
        api.get('/users?role=faculty')
      ]);

      setAdmins([...adminsRes.data.data, ...facultyRes.data.data]);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admins-container animate-fade-in">
      <div className="premium-table-wrapper">
        <div className="table-toolbar">
          <h3 className="section-title">List of Admins</h3>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <MdAdd /> Add admin
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading database data...</div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL ADDRESS</th>
                <th style={{ textAlign: 'center' }}>ADMIN ROLE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id}>
                  <td style={{ fontWeight: 500 }}>{admin.name || 'N/A'}</td>
                  <td style={{ color: '#64748b' }}>{admin.email}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`role-badge ${admin.role.toLowerCase()}`}>
                      {admin.role}
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

      {/* ADD ADMIN MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Add Admin</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Full Name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="email@iitrpr.ac.in" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input">
                  <option>ADMIN</option>
                  <option>FACULTY</option>
                </select>
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <button className="btn-primary" style={{ justifyContent: 'center', padding: '14px', width: '100%' }}>Add Admin</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
