import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const heroImage = 'https://upload.wikimedia.org/wikipedia/commons/6/68/IIT_Ropar_entrance_modern.jpg';

export default function Home() {
  return (
    <div className="home-container fade-in">
      <section className="hero-section math-hero">
        <div className="hero-columns">
          <div className="hero-left">
            <p className="hero-eyebrow">Department of Mathematics</p>
            <h1 className="hero-title">PhD Admissions Portal</h1>
            <p className="hero-subtitle">
              A bespoke application experience for IIT Ropar's Mathematics Department. Complete registration,
              verify documents, and track your shortlisting within a single modern portal.
            </p>
            <div className="hero-cta single-line">
              <Link to="/login" className="btn-hero-secondary">Login</Link>
              <Link to="/register" className="btn-hero-primary">Sign Up</Link>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-wrapper">
              <img src={heroImage} alt="IIT Ropar campus" className="hero-campus" />
              <span className="hero-caption">IIT Ropar</span>
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
    </div>
  );
}
