import React from 'react';
import './PublicPage.css';

export default function Contact() {
  return (
    <div className="public-page">
      <section className="public-hero public-hero-simple">
        <div className="public-hero-content">
          <p className="public-eye">Reach Us</p>
          <h1>Contact</h1>
          <p>
            The IIT Ropar Mathematics admissions cell is available for clarifications and guidance. Drop a note and we will respond promptly.
          </p>
        </div>
      </section>

      <article className="public-card">
        <h3>Send us a message</h3>
        <form className="public-contact-form">
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Phone" />
          <textarea placeholder="How can we help you?"></textarea>
        </form>
        <a href="mailto:coapcell@iitrpr.ac.in" className="public-cta-link">Email the cell</a>
      </article>

      <article className="public-card public-contact-info">
        <h3>Department of Mathematics</h3>
        <p>Indian Institute of Technology Ropar</p>
        <p>Rupnagar, Punjab 140001</p>
        <p>Admissions email: coapcell@iitrpr.ac.in</p>
        <p>Phone: +91-183-1234567</p>
        <p>Office hours: Monday to Friday, 9:00 AM to 5:00 PM</p>
      </article>
    </div>
  );
}
