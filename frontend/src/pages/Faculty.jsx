import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeachers } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Faculty() {
  useScrollAnimation();
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getTeachers().then(r => setTeachers(r.data)).catch(() => {});
  }, []);

  const filtered = filter ? teachers.filter(t => t.section === filter) : teachers;

  const sectionCounts = {
    'Pre-Primary': teachers.filter(t => t.section === 'Pre-Primary').length,
    'Primary': teachers.filter(t => t.section === 'Primary').length,
    'Upper Primary': teachers.filter(t => t.section === 'Upper Primary').length,
  };

  return (
    <div>
      <div className="page-header">
        <h1>Our Teachers</h1>
        <p>Dedicated educators shaping young minds at S P Anglo Academy</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Faculty</div>
      </div>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: '&#128101;', number: teachers.length || '0', label: 'Total Staff' },
              { icon: '&#128118;', number: sectionCounts['Pre-Primary'] || '0', label: 'Pre-Primary' },
              { icon: '&#128218;', number: sectionCounts['Primary'] || '0', label: 'Primary' },
              { icon: '&#128300;', number: sectionCounts['Upper Primary'] || '0', label: 'Upper Primary' },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon" dangerouslySetInnerHTML={{ __html: s.icon }} />
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Cards */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Meet Our Teaching Team</h2>
            <p>Experienced and dedicated teachers committed to student success</p>
          </div>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'All', value: '' },
              { label: 'Pre-Primary', value: 'Pre-Primary' },
              { label: 'Primary', value: 'Primary' },
              { label: 'Upper Primary', value: 'Upper Primary' },
            ].map(f => (
              <button key={f.value}
                className={`btn ${filter === f.value ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {teachers.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <span style={{ fontSize: '3rem' }}>&#128104;&#8205;&#127979;</span>
              <h3 style={{ marginTop: '1rem', color: 'var(--primary)' }}>Teacher Profiles Coming Soon</h3>
              <p style={{ color: 'var(--text-light)' }}>
                Our team of 21 dedicated teachers is being added to the portal.
                Check back soon for individual profiles with qualifications and subjects.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((t, i) => (
                <div key={t.id} className={`animate-on-scroll animate-delay-${(i % 4) + 1}`} style={{
                  background: 'white', borderRadius: '16px', overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.3s, box-shadow 0.3s',
                  textAlign: 'center', padding: '2rem 1.5rem 1.5rem',
                }}>
                  <img
                    src={t.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}&backgroundColor=1a237e&textColor=ffffff`}
                    alt={t.name}
                    style={{
                      width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover',
                      border: '4px solid var(--bg)', margin: '0 auto 1rem',
                    }}
                  />
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{t.name}</h3>
                  <p style={{
                    fontSize: '0.8rem', color: 'white', background: 'var(--secondary)',
                    display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '20px', marginBottom: '0.75rem',
                  }}>
                    {t.designation || 'Teacher'}
                  </p>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                    {t.subject && <p><strong>Subject:</strong> {t.subject}</p>}
                    {t.qualification && <p><strong>Qualification:</strong> {t.qualification}</p>}
                    {t.section && (
                      <span style={{
                        fontSize: '0.75rem', background: 'var(--bg)', padding: '0.2rem 0.6rem',
                        borderRadius: '12px', color: 'var(--text-light)',
                      }}>
                        {t.section}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What makes our teachers special */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header animate-on-scroll"><h2>What Makes Our Teachers Special</h2></div>
          <div className="values-grid">
            {[
              { icon: '&#128153;', title: 'Dedicated', desc: 'Our teachers are passionate about education and committed to every student\'s growth.' },
              { icon: '&#128101;', title: 'Personal Attention', desc: 'With manageable class sizes, teachers give individual attention to each child.' },
              { icon: '&#128218;', title: 'Subject Experts', desc: 'Specialized knowledge in their subjects with regular updates on teaching methods.' },
              { icon: '&#127968;', title: 'Local Community', desc: 'Many teachers are from the local community, understanding students\' backgrounds and needs.' },
            ].map((v, i) => (
              <div className={`value-card animate-on-scroll animate-delay-${i + 1}`} key={i}>
                <div className="v-icon" dangerouslySetInnerHTML={{ __html: v.icon }} />
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Want to Join Our Teaching Team?</h2>
          <p>Contact the school office for teaching opportunities</p>
          <Link to="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
