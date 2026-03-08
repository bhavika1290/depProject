import React, { useState } from 'react';
import {
  MdFileUpload,
  MdSearch,
  MdMoreVert,
  MdCloudUpload,
  MdClose
} from 'react-icons/md';

export default function SendMail() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="sendmail-container animate-fade-in">
      <div className="premium-table-wrapper">
        <div className="table-toolbar">
          <h3 className="section-title">List of Excels</h3>
          <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
            <MdFileUpload /> Upload Excel
          </button>
        </div>

        <div className="empty-state-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="illustration-wrapper" style={{ marginBottom: '32px' }}>
            <svg width="300" height="200" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%' }}>
              <rect x="50" y="50" width="300" height="200" rx="20" fill="#f8fafc" />
              <path d="M100 120H300" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
              <path d="M100 160H250" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
              <path d="M100 200H200" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
              <circle cx="300" cy="200" r="40" fill="#0070f3" fillOpacity="0.1" />
              <MdCloudUpload x="280" y="180" size={40} color="#0070f3" />
              <rect x="330" y="80" width="40" height="60" rx="4" fill="#60a5fa" fillOpacity="0.2" />
              <rect x="20" y="100" width="60" height="40" rx="4" fill="#34d399" fillOpacity="0.2" />
            </svg>
          </div>
          <table className="premium-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', paddingLeft: '40px' }}>FILE NAME</th>
              </tr>
            </thead>
          </table>
          <div style={{ padding: '40px', color: '#94a3b8', fontStyle: 'italic' }}>
            No Excel files uploaded yet.
          </div>
        </div>
      </div>

      {/* UPLOAD FILE MODAL */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>Upload File</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <MdClose />
              </button>
            </div>

            <div className="upload-modal-body" style={{ textAlign: 'center', padding: '20px 0' }}>
              <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 600 }}>Upload Excel file</h3>

              <div className="file-input-wrapper" style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '32px',
                marginBottom: '24px',
                backgroundColor: '#f8fafc'
              }}>
                <button className="btn-secondary" style={{ backgroundColor: '#1e293b', color: 'white', border: 'none' }}>
                  Choose File
                </button>
                <span style={{ marginLeft: '12px', color: '#64748b' }}>No file chosen</span>
              </div>

              <div className="upload-instructions" style={{ textAlign: 'left', backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px', fontSize: '0.9rem' }}>
                <p style={{ color: '#475569', marginBottom: '12px', textAlign: 'center', fontWeight: 500 }}>
                  Allowed file formats: .xls, .xlsx
                </p>
                <p style={{ color: '#64748b', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Note:</span> The uploaded excel file should necessarily contain the following fields, besides other fields(if any). Moreover the result can only have two options "Yes" or "No".
                </p>
                <div style={{ color: '#64748b', marginLeft: '10px' }}>
                  <p>- Name</p>
                  <p>- Email_ID</p>
                  <p>- Result</p>
                  <p>- Remarks</p>
                </div>
              </div>

              <button className="btn-primary" style={{ marginTop: '32px', width: '200px', justifyContent: 'center', padding: '14px' }}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
