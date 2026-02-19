import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Admissions() {
  useScrollAnimation();

  return (
    <div>
      <div className="page-header">
        <h1>Admissions</h1>
        <p>Join S P Anglo Academy, Noniya - Pre-Primary to Class 8</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Admissions</div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Admission Process</h2>
            <p>Simple steps to enroll your child at S P Anglo Academy</p>
          </div>
          <div className="process-steps">
            {[
              { title: 'Visit the School', desc: 'Visit our campus at Noniya, Paharpur to meet the teachers and see the facilities.' },
              { title: 'Collect Form', desc: 'Collect the admission form from the school office. Available during school hours (Mon-Sat, 8 AM - 2 PM).' },
              { title: 'Fill Application', desc: 'Complete the form with student details, parent/guardian information, and previous school records (if any).' },
              { title: 'Submit Documents', desc: 'Submit the filled form along with required documents like birth certificate and photographs.' },
              { title: 'Interaction', desc: 'Brief interaction with the student to assess their current level and readiness for the class.' },
              { title: 'Admission Confirmed', desc: 'Pay the admission fee and receive the admission confirmation. Your child is now part of our family!' },
            ].map((s, i) => (
              <div className={`process-step animate-on-scroll animate-delay-${i % 5 + 1}`} key={i}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="about-grid">
            <div className="animate-on-scroll">
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1.25rem', fontWeight: 800 }}>
                Required Documents
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  'Birth Certificate (original + photocopy)',
                  'Aadhar Card of student',
                  'Aadhar Card of parent/guardian',
                  'Passport size photographs (4 copies)',
                  'Previous school Transfer Certificate (if applicable)',
                  'Previous class marksheet (for Class 2 and above)',
                  'Address proof (ration card / voter ID)',
                  'Caste certificate (if applicable)',
                ].map((d, i) => (
                  <li key={i} style={{ padding: '0.5rem 0', fontSize: '0.92rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>&#10003;</span> {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="animate-on-scroll animate-delay-2">
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1.25rem', fontWeight: 800 }}>
                Classes Available
              </h2>
              <div style={{ background: 'var(--bg)', borderRadius: '12px', overflow: 'hidden' }}>
                <table className="data-table" style={{ marginBottom: 0 }}>
                  <thead>
                    <tr><th>Level</th><th>Classes</th><th>Medium</th></tr>
                  </thead>
                  <tbody>
                    {[
                      ['Pre-Primary', 'Nursery, LKG, UKG', 'Hindi'],
                      ['Primary', 'Class 1, 2, 3, 4, 5', 'Hindi'],
                      ['Upper Primary', 'Class 6, 7, 8', 'Hindi'],
                    ].map(([level, cls, medium], i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{level}</td>
                        <td>{cls}</td>
                        <td>{medium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3e0', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)' }}>&#128197; Academic Session</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                  New session starts in <strong>April</strong> every year. Admissions are usually open from
                  <strong> January to March</strong>. Contact the school office for current availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll"><h2>Why Choose Us for Your Child</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '&#128218;', title: 'Quality Education', desc: 'Strong Hindi-medium education with 21 dedicated teachers.' },
              { icon: '&#127968;', title: 'Good Infrastructure', desc: '13 classrooms, library, playground, computer lab in a pucca building.' },
              { icon: '&#128176;', title: 'Affordable Fees', desc: 'Quality education at affordable fees accessible to rural families.' },
              { icon: '&#128205;', title: 'Convenient Location', desc: 'Located in Noniya village, accessible via all-weather road.' },
            ].map((f, i) => (
              <div className={`feature-card animate-on-scroll animate-delay-${i + 1}`} key={i}>
                <div className="card-icon" style={{ background: '#f0f4ff', margin: '0 auto 1rem' }} dangerouslySetInnerHTML={{ __html: f.icon }} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Enroll Your Child?</h2>
          <p>Visit S P Anglo Academy, Noniya or contact us for more details</p>
          <Link to="/contact" className="btn btn-accent btn-lg">Contact School Office</Link>
        </div>
      </section>
    </div>
  );
}
