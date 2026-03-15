import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import campusHero from '../../assets/images/ropar-iit (1).png';

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* Background aesthetic blobs */}
      <div className="bg-circle-1"></div>
      <div className="bg-circle-2"></div>

      <div className="home-container fade-in">
        <section className="hero-section">
          <div className="hero-columns">
            <div className="hero-left">
              <p className="hero-eyebrow">Department of Mathematics</p>
              <h1 className="hero-title">
                PhD Admissions <span className="highlight">Portal</span>
              </h1>
              <p className="hero-subtitle">
                A bespoke application experience for IIT Ropar's Mathematics Department. Complete registration,
                verify documents, and track your shortlisting within a single modern portal.
              </p>
              <div className="hero-cta">
                <Link to="/login" className="btn-hero-secondary">Login</Link>
                <Link to="/register" className="btn-hero-primary">Sign Up</Link>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-image-wrapper">
                <img src={campusHero} alt="IIT Ropar campus" className="hero-campus" />
              </div>
            </div>
          </div>
        </section>

        <section className="info-intro">
          <p>
            Explore the How to Apply guide, current Openings, FAQs, and Contact page via the navigation bar above.
            Everything you need for the IIT Ropar Mathematics PhD journey lives inside this portal.
          </p>
        </section>

        <section className="campus-photo-section">
          <div className="campus-photo-card">
            <img src={campusHero} alt="IIT Ropar campus" className="campus-photo" />
            <span className="campus-photo-label">IIT Ropar Entrance</span>
          </div>
          <div className="campus-photo-text">
            <h2>Gateway to a modern legacy</h2>
            <p>
              The four 41-foot stone pillars carved with Indus Valley motifs are crowned by floating molecular forms,
              symbolizing how IIT Ropar builds modern science on a timeless heritage.
            </p>
            <p>
              Use this view as a reminder of the institute’s architectural statement while you track your PhD application
              milestones on this portal.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
