import React from 'react';
import './PublicPage.css';

const moreDetails = [
  {
    title: 'Research at IIT Ropar',
    body: `IIT Ropar promotes cutting-edge research over pure quantity. The Mathematics Department now flaunts around 570+ PhD scholars,
      with 102 defenses completed in the past cycle and rapid growth in publications (APPA 3.9, ACPP 22.45, H-index 62 as of Feb 2020).`,
  },
  {
    title: 'Shortlisting Criteria & Shortlisted Students',
    body: `Clear criteria cover academic profile, research fit, and completeness of documents. Shortlisted names are shared via the portal, and the full list is mirrored
      on the IIT Ropar PhD admissions page (https://www.iitrpr.ac.in/phd-list-shortlisted-candidates).`,
  },
  {
    title: 'Financial Assistance',
    body: `Tuition fee exemption is available for SC/ST scholars irrespective of parental income. SC/ST gatekeepers can also claim
      Rs. 300 stipend per month plus room rent waiver under the merit-cum-means scholarship, and Rs. 250 pocket allowance in lieu of the scholarship.`,
  },
  {
    title: 'Additional Financial Support',
    body: `Economically weaker students may receive full tuition remission, partial support for mess charges, and subsidized housing. Merit-cum-Means scholarships
      extend to deserving applicants from other categories as per Government guidelines.`,
  },
  {
    title: 'Reservation of Seats',
    body: `All Government of India reservation categories (SC/ST/OBC-non creamy, EWS, PwD) are honored. The Mathematics Department displays
      seat allocation per category alongside the shortlist.`,
  },
  {
    title: 'Final Authority',
    body: `Dean (Research) is the final approving authority for each Doctoral Committee. Decisions are communicated within 15 days of joining.`,
  },
  {
    title: 'Information Brochure',
    body: `Download the latest IIT Ropar Mathematics PhD admission brochure for timelines, document checklists, and evaluation rubrics.`,
    linkLabel: 'Open brochure (PDF)',
    linkHref: 'https://www.iitrpr.ac.in/admissions/2026-brochure.pdf',
  },
];

export default function MoreInfo() {
  return (
    <div className="public-page">
      <section className="public-hero public-hero-simple">
        <div className="public-hero-content">
          <p className="public-eye">Program Details</p>
          <h1>More Info</h1>
          <p>
            Delve deeper into the IIT Ropar Department of Mathematics environment, labs, fellowships, and research culture.
          </p>
        </div>
      </section>

      <div className="public-panel-grid">
        {moreDetails.map((detail) => (
          <article key={detail.title} className="public-card">
            <h3>{detail.title}</h3>
            <p>{detail.body}</p>
            {detail.linkHref && (
              <a href={detail.linkHref} target="_blank" rel="noreferrer" className="public-cta-link">
                {detail.linkLabel}
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="public-page-footer">
        <p>Explore the brochures and faculty profiles to envision your future research workspace at IIT Ropar.</p>
      </div>
    </div>
  );
}
