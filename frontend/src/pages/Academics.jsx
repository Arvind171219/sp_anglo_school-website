import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Academics() {
  useScrollAnimation();

  const subjects = [
    { icon: '&#128210;', title: 'Hindi', desc: 'Primary medium of instruction. Grammar, literature, comprehension, and creative writing skills.' },
    { icon: '&#128202;', title: 'Mathematics', desc: 'Arithmetic, algebra basics, geometry, and mental math for building strong logical thinking.' },
    { icon: '&#128300;', title: 'Science', desc: 'General science covering environment, basic physics, chemistry, and biology concepts.' },
    { icon: '&#127758;', title: 'Social Studies', desc: 'History, geography, civics, and understanding of Indian culture and society.' },
    { icon: '&#128214;', title: 'English', desc: 'Basic English reading, writing, and speaking skills as an additional language.' },
    { icon: '&#128187;', title: 'Computer Education', desc: 'Basic computer literacy and digital skills through our computer-aided learning lab.' },
    { icon: '&#127912;', title: 'Drawing & Art', desc: 'Creative arts, drawing, painting, and craft activities for artistic expression.' },
    { icon: '&#127947;', title: 'Physical Education', desc: 'Sports, yoga, physical fitness activities on our school playground.' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Academics</h1>
        <p>Hindi medium education from Pre-Primary to Class 8</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Academics</div>
      </div>

      {/* Academic Programs */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Our Academic Programs</h2>
            <p>Structured learning for every stage of your child's growth</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { level: 'Pre-Primary', grades: 'Nursery, LKG, UKG', color: '#e8f5e9', border: '#4caf50',
                desc: 'Play-based learning for young children. Introduction to alphabets (Hindi & English), numbers, rhymes, drawing, and basic motor skill development. 4 dedicated pre-primary teachers.',
                teachers: '4 Teachers' },
              { level: 'Primary', grades: 'Class 1 - 5', color: '#e3f2fd', border: '#2196f3',
                desc: 'Foundation building in Hindi, Mathematics, Environmental Science, English basics, and General Knowledge. Activity-based learning with regular assessments.',
                teachers: 'Dedicated Faculty' },
              { level: 'Upper Primary', grades: 'Class 6 - 8', color: '#fff3e0', border: '#ff9800',
                desc: 'Advanced learning in Hindi, English, Mathematics, Science, Social Studies, and Computer basics. Preparation for higher education with focus on conceptual understanding.',
                teachers: 'Specialized Teachers' },
            ].map((p, i) => (
              <div
                className={`animate-on-scroll animate-delay-${i + 1}`}
                key={i}
                style={{
                  padding: '2rem', borderRadius: '16px', background: p.color,
                  borderLeft: `4px solid ${p.border}`,
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: p.border, letterSpacing: '1px' }}>{p.grades}</div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text)', margin: '0.35rem 0 0.5rem' }}>{p.level}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>{p.desc}</p>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: p.border }}>&#128104;&#8205;&#127979; {p.teachers}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Subjects We Teach</h2>
            <p>Comprehensive curriculum covering all essential subjects</p>
          </div>
          <div className="dept-grid">
            {subjects.map((d, i) => (
              <div className={`dept-card animate-on-scroll animate-delay-${i % 5 + 1}`} key={i}>
                <div className="dept-icon" dangerouslySetInnerHTML={{ __html: d.icon }} />
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: '&#128104;&#8205;&#127979;', number: '12', label: 'Male Teachers' },
              { icon: '&#128105;&#8205;&#127979;', number: '5', label: 'Female Teachers' },
              { icon: '&#128118;', number: '4', label: 'Pre-Primary Teachers' },
              { icon: '&#128101;', number: '21', label: 'Total Teaching Staff' },
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

      {/* Facilities */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Learning Facilities</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '&#128218;', name: '13 Classrooms' },
              { icon: '&#128187;', name: 'Computer Lab' },
              { icon: '&#128214;', name: 'Library (500+ Books)' },
              { icon: '&#9917;', name: 'Playground' },
              { icon: '&#9889;', name: 'Electricity' },
              { icon: '&#128167;', name: 'Drinking Water' },
            ].map((f, i) => (
              <div
                className={`animate-on-scroll animate-delay-${i % 5 + 1}`}
                key={i}
                style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
              >
                <span style={{ fontSize: '2rem' }} dangerouslySetInnerHTML={{ __html: f.icon }} />
                <p style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar Info */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header animate-on-scroll"><h2>Academic Calendar</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { month: 'April', event: 'New Session Begins', color: '#e8f5e9', icon: '&#127793;' },
              { month: 'August', event: 'Independence Day & Half-Yearly Prep', color: '#e3f2fd', icon: '&#127470;&#127475;' },
              { month: 'October', event: 'Half-Yearly Examinations', color: '#fff3e0', icon: '&#128221;' },
              { month: 'January', event: 'Republic Day Celebration', color: '#fce4ec', icon: '&#127891;' },
              { month: 'March', event: 'Annual Examinations & Results', color: '#f3e5f5', icon: '&#127942;' },
            ].map((d, i) => (
              <div className={`animate-on-scroll animate-delay-${i + 1}`} key={i} style={{ padding: '1.5rem', background: d.color, borderRadius: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }} dangerouslySetInnerHTML={{ __html: d.icon }} />
                <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>{d.month}</p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{d.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Enroll Your Child Today</h2>
          <p>Admissions open for Pre-Primary to Class 8</p>
          <Link to="/admissions" className="btn btn-accent btn-lg">Apply for Admission</Link>
        </div>
      </section>
    </div>
  );
}
