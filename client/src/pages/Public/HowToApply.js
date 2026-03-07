import React from 'react';
import { Link } from 'react-router-dom';
import './PublicPage.css';

const steps = [
  {
    title: 'Sign Up',
    detail: 'Create your IIT Ropar Mathematics profile with a valid email and verify via OTP.',
  },
  {
    title: 'Upload Documents',
    detail: 'Add transcripts, awards, SOP, CV, and any supporting certificates directly into the portal.',
  },
  {
    title: 'Track Review',
    detail: 'Watch the status of each document, respond to reviewer notes, and accept interview invitations.',
  },
  {
    title: 'Finalize Admission',
    detail: 'Receive the final offer once the doctoral committee signs off and pay the admission fee online.',
  },
];

export default function HowToApply() {
  return (
    <div className="public-page">
      <section className="public-hero public-hero-simple">
        <div className="public-hero-content">
          <p className="public-eye">Step-by-step</p>
          <h1>How To Apply</h1>
          <p>
            The IIT Ropar Mathematics admissions portal keeps every step digital. Follow the guided workflow
            to submit a complete and competitive application for the PhD programs.
          </p>
        </div>
      </section>

      <section className="public-panel-grid">
        <article className="public-card">
          <h3>Portal Workflow</h3>
          <ul className="public-steps">
            {steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="public-card">
          <h3>Checklist</h3>
          <p>Before sending your application, confirm all of the following:</p>
          <ul>
            <li>Master's degree marksheet and provisional certificate</li>
            <li>Statement of Purpose outlining research interests in Mathematics</li>
            <li>Two faculty recommendations (preferably from mathematicians)</li>
            <li>Passport-sized photo and government-issued ID copy</li>
          </ul>
          <Link to="/register" className="public-cta-link">Begin application</Link>
        </article>
      </section>
    </div>
  );
}
