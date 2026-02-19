import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Activities() {
  useScrollAnimation();

  const activities = [
    { img: '/images/gallery/school_building.webp', tag: 'National Day', title: 'Republic Day Celebration', desc: 'Annual Republic Day celebration with flag hoisting, patriotic songs, speeches, and march past by students of all classes.' },
    { img: '/images/gallery/building.webp', tag: 'National Day', title: 'Independence Day', desc: 'Grand celebration of Independence Day with cultural programs, flag hoisting ceremony, and sweet distribution.' },
    { img: '/images/gallery/game.webp', tag: 'Sports', title: 'Annual Sports Day', desc: 'Sports competitions including running races, sack race, lemon-spoon race, and other fun activities for all age groups.' },
    { img: '/images/gallery/classroom.webp', tag: 'Academic', title: 'Annual Examination', desc: 'Well-organized annual examinations for all classes with proper evaluation and result declaration.' },
    { img: '/images/gallery/activity.webp', tag: 'Cultural', title: 'Saraswati Puja Celebration', desc: 'Celebrating Basant Panchami with Saraswati Puja, cultural programs, and blessings for academic success.' },
    { img: '/images/gallery/students.webp', tag: 'Academic', title: 'Hindi Diwas Celebration', desc: 'Special activities on Hindi Diwas including essay writing, poem recitation, and speech competitions in Hindi.' },
    { img: '/images/gallery/guest.jpg', tag: 'Cultural', title: 'Annual Function', desc: 'Grand annual function with dance, drama, singing performances by students. Prize distribution ceremony for achievers.' },
    { img: '/images/gallery/playground.webp', tag: 'Sports', title: 'Outdoor Games', desc: 'Regular outdoor games and physical activities on our school playground to keep students fit and active.' },
    { img: '/images/gallery/parents.jpg', tag: 'Academic', title: 'Drawing Competition', desc: 'Inter-class drawing and painting competitions to encourage creativity and artistic expression among students.' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Activities & Events</h1>
        <p>Beyond academics - developing well-rounded personalities</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Activities</div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>School Activities</h2>
            <p>Events and activities that make our school vibrant</p>
          </div>
          <div className="activities-grid">
            {activities.map((a, i) => (
              <div className={`activity-card animate-on-scroll animate-delay-${i % 5 + 1}`} key={i}>
                <img className="activity-img" src={a.img} alt={a.title} loading="lazy" />
                <div className="activity-content">
                  <span className="activity-tag">{a.tag}</span>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Activities */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Regular School Activities</h2>
            <p>Activities that happen throughout the academic year</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '&#128249;', name: 'Morning Assembly', desc: 'Daily prayer, news, and motivational talks' },
              { icon: '&#127947;', name: 'Physical Education', desc: 'Regular sports and exercise on playground' },
              { icon: '&#128214;', name: 'Library Reading', desc: 'Scheduled reading time in our 500+ book library' },
              { icon: '&#128187;', name: 'Computer Lab Sessions', desc: 'Regular computer education classes' },
              { icon: '&#127912;', name: 'Drawing & Art', desc: 'Creative activities and art classes' },
              { icon: '&#128221;', name: 'Class Tests', desc: 'Regular assessments to track progress' },
              { icon: '&#128172;', name: 'Poem Recitation', desc: 'Hindi and English poem recitation activities' },
              { icon: '&#127926;', name: 'Songs & Rhymes', desc: 'Music activities especially for pre-primary' },
            ].map((c, i) => (
              <div
                className={`animate-on-scroll animate-delay-${i % 5 + 1}`}
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  background: 'var(--bg)',
                  borderRadius: '16px',
                }}
              >
                <span style={{ fontSize: '2rem' }} dangerouslySetInnerHTML={{ __html: c.icon }} />
                <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginTop: '0.5rem' }}>{c.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Give Your Child a Vibrant School Life</h2>
          <p>Academics plus activities for complete personality development</p>
          <Link to="/admissions" className="btn btn-accent btn-lg">Join Our School</Link>
        </div>
      </section>
    </div>
  );
}
