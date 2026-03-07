import React from 'react';
import './PublicPage.css';

const faqList = [
  {
    question: 'What is the eligibility criteria for applying for PhD programmes?',
    answer: 'Applicants require a Master\'s degree (or equivalent) in Mathematics or adjacent fields with a strong academic record and two recommendation letters.',
  },
  {
    question: 'What are the requirements during the course of the PhD programme?',
    answer: 'Students must complete the coursework assigned by their Doctoral Committee, submit progress reports, publish research, and finish a thesis defense.',
  },
  {
    question: 'How will students be evaluated during the course of the PhD programme?',
    answer: 'Evaluation includes course grades, seminar presentations, departmental exams, and annual reviews by the Doctoral Committee.',
  },
  {
    question: 'In what fields can a PhD be pursued?',
    answer: 'IIT Ropar Mathematics offers PhDs in Pure Mathematics, Applied Mathematics (fluid mechanics, optimization), Data Science, and interdisciplinary collaborations with engineering labs.',
  },
  {
    question: 'From where can I access the courses provided by the respective departments?',
    answer: 'The departments publish course lists, curricula, and faculty guides on the IIT Ropar website and within the portal\'s Resources tab.',
  },
  {
    question: 'Under what categories can we be admitted into the PhD programme?',
    answer: 'Admissions follow GOI norms, so SC, ST, OBC (non-creamy), EWS, Open, and PwD categories are all considered.',
  },
  {
    question: 'What is the maximum period of registration?',
    answer: 'The maximum registration duration is six years, with yearly reviews to extend the candidature as needed.',
  },
  {
    question: 'Can economically weaker candidates get financial relief?',
    answer: 'Yes, EW and SC/ST scholars can receive tuition remission, stipends, and housing/mess support as outlined in the admissions brochure.',
  },
];

export default function FAQs() {
  return (
    <div className="public-page">
      <section className="public-hero public-hero-simple">
        <div className="public-hero-content">
          <p className="public-eye">FAQs & Insights</p>
          <h1>Frequently Asked Questions</h1>
          <p>
            Everything you want to know about IIT Ropar Mathematics admissions, shortlisting,
            and life on campus. If you still need help, reach out through the contact section.
          </p>
        </div>
      </section>

      <section className="public-panel-grid">
        {faqList.map((faq) => (
          <article key={faq.question} className="public-card public-panel-board">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>

      <div className="public-page-footer">
        <p>Still have a question? The admissions cell is just an email away.</p>
      </div>
    </div>
  );
}
