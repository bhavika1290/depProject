import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#111827',
      color: '#9ca3af',
      padding: '30px 40px',
      textAlign: 'center',
      marginTop: 'auto',
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Indian Institute of Technology Ropar</strong><br />
          <span>Rupnagar, Punjab - 140001, India</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} IIT Ropar Admissions. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="#" style={{ color: '#9ca3af' }}>Help Desk</a>
          <a href="#" style={{ color: '#9ca3af' }}>Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
