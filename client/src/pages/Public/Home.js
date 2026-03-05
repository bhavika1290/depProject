import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container fade-in">
      <section className="hero-section">
        <div className="hero-content">
<<<<<<< HEAD
          <span className="hero-eyebrow">IIT Ropar Department of Mathematics</span>
          <h1 className="hero-title">PhD Admissions 2026</h1>
          <p className="hero-subtitle">
            Build rigorous research in analysis, algebra, fluid mechanics, data science,
            and interdisciplinary mathematics with expert mentorship and funded opportunities.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn-hero-primary">Apply Now</Link>
            <Link to="/login" className="btn-hero-secondary">Applicant Login</Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">4+</span>
              <span className="hero-stat-label">Research Areas</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">25+</span>
              <span className="hero-stat-label">Faculty Collaborators</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">Digital Application Flow</span>
            </div>
=======
          <h1 className="hero-title">IIT Ropar Maths Dept</h1>
          <p className="hero-subtitle">
            Pushing the boundaries of mathematical research and education.
            Join our vibrant academic community and shape the future of science.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn-hero-primary">Apply Now</Link>
            <Link to="/login" className="btn-hero-secondary">Check Status</Link>
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
<<<<<<< HEAD
          <div className="feature-icon">R</div>
          <h3>Advanced Research</h3>
          <p>Research pathways in pure and applied mathematics with computational and theoretical depth.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">F</div>
          <h3>World-Class Faculty</h3>
          <p>Work with faculty actively publishing in top journals and collaborating across global institutes.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">I</div>
          <h3>Interdisciplinary Focus</h3>
          <p>Connect mathematics with engineering, science, and data-intensive domains to solve real problems.</p>
        </div>
      </section>

      <section className="home-callout">
        <h2>Ready to Begin Your Research Journey?</h2>
        <p>
          Start your application, upload documents, track review progress, and receive
          notifications in one streamlined portal.
        </p>
        <Link to="/register" className="callout-link">Create Your Application</Link>
      </section>
=======
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
>>>>>>> 0e70fe0c9339ff6d34303b93472382c209daf5e9
    </div>
  );
}
