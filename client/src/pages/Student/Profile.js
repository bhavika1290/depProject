<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '', fatherName: '', dateOfBirth: '', gender: '',
      nationality: '', category: '', aadhaarNumber: '', maritalStatus: '', isPWD: false
    },
    communicationDetails: {
      addressForCommunication: '', city: '', state: '', pinCode: '',
      permanentAddress: '', permanentCity: '', permanentState: '', permanentPinCode: ''
    },
    educationalDetails: {
      tenthSchool: '', tenthBoard: '', tenthYear: '', tenthPercentage: '',
      twelfthSchool: '', twelfthBoard: '', twelfthYear: '', twelfthPercentage: '',
      ugCollege: '', ugUniversity: '', ugDegree: '', ugSpecialization: '', ugYear: '', ugCGPA: ''
    }
  });

<<<<<<< HEAD
  const fetchProfile = useCallback(async () => {
=======
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9
    try {
      const res = await api.get('/users/profile');
      if (res.data.data) {
        const pInfo = res.data.data.personalInfo || {};
        if (pInfo.dateOfBirth) pInfo.dateOfBirth = pInfo.dateOfBirth.substring(0, 10);

<<<<<<< HEAD
        setFormData((prev) => ({
          personalInfo: { ...prev.personalInfo, ...pInfo },
          communicationDetails: { ...prev.communicationDetails, ...(res.data.data.communicationDetails || {}) },
          educationalDetails: { ...prev.educationalDetails, ...(res.data.data.educationalDetails || {}) }
        }));
=======
        setFormData({
          personalInfo: { ...formData.personalInfo, ...pInfo },
          communicationDetails: { ...formData.communicationDetails, ...(res.data.data.communicationDetails || {}) },
          educationalDetails: { ...formData.educationalDetails, ...(res.data.data.educationalDetails || {}) }
        });
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        setErrorMsg('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
=======
  };
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9

  const handlePersonalChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, personalInfo: { ...formData.personalInfo, [e.target.name]: value } });
  };

  const handleCommChange = (e) => {
    setFormData({ ...formData, communicationDetails: { ...formData.communicationDetails, [e.target.name]: e.target.value } });
  };

  const handleEduChange = (e) => {
    setFormData({ ...formData, educationalDetails: { ...formData.educationalDetails, [e.target.name]: e.target.value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.put('/users/profile', formData);
      setSuccessMsg('Profile saved successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to save profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading profile...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Profile</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Manage your personal, communication, and educational details.</p>
        </div>
        <Link to="/student" className="btn-primary" style={{ textDecoration: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid #e5e7eb' }}>&larr; Dashboard</Link>
      </div>

      {successMsg && <div style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', padding: '16px', borderRadius: 'var(--border-radius)', marginBottom: '20px', fontWeight: 500 }}>&#10003; {successMsg}</div>}
      {errorMsg && <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: '16px', borderRadius: 'var(--border-radius)', marginBottom: '20px', fontWeight: 500 }}>{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="page-card" style={{ marginBottom: '30px', padding: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" value={formData.personalInfo.fullName} onChange={handlePersonalChange} required placeholder="As per records" />
            </div>
            <div className="form-group">
              <label>Father's Name</label>
              <input name="fatherName" value={formData.personalInfo.fatherName} onChange={handlePersonalChange} />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.personalInfo.dateOfBirth} onChange={handlePersonalChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.personalInfo.gender} onChange={handlePersonalChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.personalInfo.category} onChange={handlePersonalChange} required>
                <option value="">Select Category</option>
                <option value="GEN">General (GEN)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="OBC">Other Backward Class (OBC)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Aadhaar Number</label>
              <input name="aadhaarNumber" value={formData.personalInfo.aadhaarNumber} onChange={handlePersonalChange} placeholder="12-digit format" />
            </div>
          </div>
        </div>

        <div className="page-card" style={{ marginBottom: '30px', padding: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Communication Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Address for Communication</label>
              <input name="addressForCommunication" value={formData.communicationDetails.addressForCommunication} onChange={handleCommChange} required />
            </div>
            <div className="form-group"><label>City</label><input name="city" value={formData.communicationDetails.city} onChange={handleCommChange} /></div>
            <div className="form-group"><label>State</label><input name="state" value={formData.communicationDetails.state} onChange={handleCommChange} /></div>
            <div className="form-group"><label>Pin Code</label><input name="pinCode" value={formData.communicationDetails.pinCode} onChange={handleCommChange} /></div>
          </div>
        </div>

        <div className="page-card" style={{ marginBottom: '30px', padding: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Educational Details (Undergraduate)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="form-group"><label>College / Institute</label><input name="ugCollege" value={formData.educationalDetails.ugCollege} onChange={handleEduChange} required /></div>
            <div className="form-group"><label>University</label><input name="ugUniversity" value={formData.educationalDetails.ugUniversity} onChange={handleEduChange} required /></div>
            <div className="form-group"><label>Degree</label><input name="ugDegree" value={formData.educationalDetails.ugDegree} onChange={handleEduChange} required placeholder="e.g. B.Tech, B.Sc" /></div>
            <div className="form-group"><label>Specialization / Branch</label><input name="ugSpecialization" value={formData.educationalDetails.ugSpecialization} onChange={handleEduChange} required /></div>
            <div className="form-group"><label>Year of Passing</label><input type="number" name="ugYear" value={formData.educationalDetails.ugYear} onChange={handleEduChange} required min="1980" max={new Date().getFullYear() + 1} /></div>
            <div className="form-group"><label>CGPA / Percentage</label><input type="number" step="0.01" name="ugCGPA" value={formData.educationalDetails.ugCGPA} onChange={handleEduChange} required /></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '50px' }}>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            {saving ? 'Saving...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
}
