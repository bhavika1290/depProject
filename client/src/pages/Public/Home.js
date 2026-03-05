import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container fade-in">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">IIT Ropar Maths Dept</h1>
          <p className="hero-subtitle">
            Pushing the boundaries of mathematical research and education.
            Join our vibrant academic community and shape the future of science.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn-hero-primary">Apply Now</Link>
            <Link to="/login" className="btn-hero-secondary">Check Status</Link>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">∑</div>
          <h3>Advanced Research</h3>
          <p>Cutting-edge research in Pure & Applied Mathematics, including Fluid Dynamics, Analysis, and Algebra.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">∫</div>
          <h3>World-Class Faculty</h3>
          <p>Learn from distinguished professors and researchers with extensive international experience and expertise.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">λ</div>
          <h3>Interdisciplinary Focus</h3>
          <p>Collaboration with multiple engineering and science departments for real-world mathematical applications.</p>
        </div>
      </section>

      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Join Our PhD Program</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto 30px' }}>
          We offer a dynamic research environment, state-of-the-art facilities,
          and competitive fellowships for motivated students.
        </p>
      </div>
    </div>
  );
}
