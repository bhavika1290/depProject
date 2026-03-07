import React from 'react';
import './PublicPage.css';

const openingList = [
  {
    area: 'Algebra & Number Theory',
    description: 'Professors exploring structural and analytic algebra, representations, and arithmetic geometry.',
  },
  {
    area: 'Analysis & PDEs',
    description: 'Research on real/complex analysis, fluid mechanics, and nonlinear partial differential equations.',
  },
  {
    area: 'Data Science & Computation',
    description: 'Interdisciplinary work linking mathematics, statistics, and computational modeling with engineering labs.',
  },
];

export default function Openings() {
  return (
    <div className="public-page">
      <section className="public-hero public-hero-simple">
        <div className="public-hero-content">
          <p className="public-eye">Current Listings</p>
          <h1>Openings</h1>
          <p>
            Mathematics PhD seats are open in high-growth research areas. Each opening includes mentorship and research funding.
          </p>
        </div>
      </section>

      <div className="public-panel-grid">
        {openingList.map((opening) => (
          <article key={opening.area} className="public-card public-panel-board">
            <h3>{opening.area}</h3>
            <p>{opening.description}</p>
            <p>
              <strong>Faculty mentors:</strong> Search the portal for faculty alignment and doctoral committee membership.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
