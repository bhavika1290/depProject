import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdClose
} from 'react-icons/md';
import api from '../../services/apiCore';
import { toast } from 'react-toastify';

export default function Faculties() {
  const [showModal, setShowModal] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: 'Assistant Professor',
    researchArea: '',
    status: 'Active'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users?role=faculty');
      setFaculties(res.data.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      toast.error('Failed to load faculties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const payload = {
        ...formData,
        role: 'faculty',
        departments: ['Mathematics'] // Default for this portal
      };
      await api.post('/users', payload);
      toast.success('Faculty added successfully!');
      setShowModal(false);
      setFormData({
        name: '', email: '', password: '', designation: 'Assistant Professor', researchArea: '', status: 'Active'
      });
      fetchFaculties();
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error(error.response?.data?.message || 'Failed to add faculty');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('Faculty deleted successfully');
        fetchFaculties();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete faculty');
      }
    }
  };

  return (
    <div className="admins-container animate-fade-in">
      <div className="premium-table-wrapper">
        <div className="table-toolbar">
          <h3 className="section-title">Faculty List</h3>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <MdAdd style={{ marginRight: '8px' }} /> Add New Faculty
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading faculty data...</div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>DEPARTMENT</th>
                <th>RESEARCH AREA</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map(faculty => (
                <tr key={faculty._id}>
                  <td style={{ fontWeight: 500 }}>
                    <div>{faculty.name || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{faculty.designation || 'Faculty'}</div>
                  </td>
                  <td style={{ color: '#64748b' }}>{faculty.email}</td>
                  <td>{(faculty.departments && faculty.departments.join(', ')) || 'Mathematics'}</td>
                  <td>{faculty.researchArea || 'Not Specified'}</td>
                  <td>
                    <span className={`role-badge ${faculty.status === 'Inactive' ? 'inactive' : 'active'}`} style={{ backgroundColor: faculty.status === 'Inactive' ? '#f1f5f9' : '#dcfce3', color: faculty.status === 'Inactive' ? '#64748b' : '#16a34a' }}>
                      {faculty.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="cycle-btn" style={{ backgroundColor: '#0ea5e9', color: 'white' }} title="View Details">
                        <MdVisibility />
                      </button>
                      <button className="cycle-btn" style={{ backgroundColor: '#10b981', color: 'white' }} title="Edit">
                        <MdEdit />
                      </button>
                      <button className="cycle-btn" style={{ backgroundColor: '#f43f5e', color: 'white' }} title="Delete" onClick={() => handleDelete(faculty._id)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {faculties.length === 0 && (
                <tr>
                   <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No faculty members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD FACULTY MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>Add New Faculty</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" placeholder="Dr. John Doe" value={formData.name} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" placeholder="email@iitrpr.ac.in" value={formData.email} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input type="password" name="password" className="form-input" placeholder="Enter generic password" value={formData.password} onChange={handleInputChange} required minLength="6" />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <select name="designation" className="form-input" value={formData.designation} onChange={handleInputChange} required>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Guest Faculty">Guest Faculty</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-input" value={formData.status} onChange={handleInputChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Research Area</label>
                  <input type="text" name="researchArea" className="form-input" placeholder="e.g. Algebra, Topology, Machine Learning..." value={formData.researchArea} onChange={handleInputChange} />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '14px', width: '100%' }} disabled={formLoading}>
                    {formLoading ? 'Adding...' : 'Add Faculty'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
