import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Real school images

export default function About() {
  useScrollAnimation();

  return (
    <div>
      <div className="page-header">
        <h1>About Our School</h1>
        <p>S P Anglo Academy, Noniya - Serving since 2011</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / About Us</div>
      </div>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image animate-on-scroll">
              <img src="/images/gallery/school_building.webp" alt="S P Anglo Academy building" />
              <div className="experience-badge">
                <span className="number">13+</span>
                <span className="label">Years of Service</span>
              </div>
            </div>
            <div className="animate-on-scroll animate-delay-2">
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 800 }}>
                Welcome to S P Anglo Academy, Noniya
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                S P Anglo Academy was established in <strong>2011</strong> with a vision to provide quality
                Hindi-medium education to children in Noniya village and surrounding areas of Paharpur block,
                Purba Champaran district, Bihar. Our school is a <strong>co-educational</strong> institution
                offering education from Pre-Primary to Class 8.
              </p>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Located in the rural heart of Purba Champaran, we are committed to providing accessible
                education with proper infrastructure. Our private pucca building with 13 well-equipped
                classrooms, a library with 500+ books, a playground, and computer-aided learning facilities
                ensures a complete learning environment.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { n: '21', l: 'Total Teachers' },
                  { n: '13', l: 'Classrooms' },
                  { n: '500+', l: 'Library Books' },
                  { n: '2011', l: 'Established' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{s.n}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header animate-on-scroll"><h2>Our Vision & Mission</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="animate-on-scroll animate-delay-1" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', borderRadius: '20px', color: 'white' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>&#128065; Our Vision</h3>
              <p style={{ opacity: 0.9, lineHeight: 1.8 }}>
                To be a leading educational institution in Purba Champaran that empowers rural children
                with quality education, strong moral values, and the skills needed to succeed.
                Every child deserves access to good education regardless of location.
              </p>
            </div>
            <div className="animate-on-scroll animate-delay-2" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', borderRadius: '20px', color: 'white' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>&#127919; Our Mission</h3>
              <p style={{ opacity: 0.9, lineHeight: 1.8 }}>
                To provide affordable, quality Hindi-medium education with modern teaching methods.
                To create a safe, nurturing environment where every student can grow academically,
                physically, and morally. To bridge the urban-rural education gap in Bihar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Our Infrastructure</h2>
            <p>Well-equipped campus for quality learning</p>
          </div>
          <div className="values-grid">
            {[
              { icon: '&#127968;', title: 'Pucca Building', desc: 'Private pucca building with proper boundary wall ensuring safety and security of students.' },
              { icon: '&#128218;', title: '13 Classrooms', desc: 'All 13 classrooms are in good condition with proper ventilation and seating.' },
              { icon: '&#128214;', title: 'Library (500+ Books)', desc: 'School library with over 500 books covering academic subjects, stories, and general knowledge.' },
              { icon: '&#9917;', title: 'Playground', desc: 'Dedicated playground for sports, physical education, and recreational activities.' },
              { icon: '&#128187;', title: 'Computer Lab', desc: 'Computer-aided learning lab to introduce students to digital literacy.' },
              { icon: '&#9889;', title: 'Electricity', desc: 'Electric connection ensuring fans, lights, and computer lab operation.' },
              { icon: '&#128688;', title: 'Toilets', desc: 'Separate functional toilets for boys (2) and girls (1).' },
              { icon: '&#128167;', title: 'Drinking Water', desc: 'Functional hand pump providing clean drinking water.' },
              { icon: '&#128739;', title: 'All-Weather Road', desc: 'School is accessible via all-weather road in all seasons.' },
            ].map((v, i) => (
              <div className={`value-card animate-on-scroll animate-delay-${i % 5 + 1}`} key={i}>
                <div className="v-icon" dangerouslySetInnerHTML={{ __html: v.icon }} />
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header animate-on-scroll"><h2>School Details</h2></div>
          <div className="card animate-on-scroll" style={{ maxWidth: '700px', margin: '0 auto', overflow: 'hidden' }}>
            <table className="data-table">
              <tbody>
                {[
                  ['School Name', 'S P Anglo Academy, Noniya'],
                  ['UDISE Code', '10021700117'],
                  ['Established', '2011'],
                  ['Village / Town', 'Noniya'],
                  ['Cluster', 'GMS Nonea'],
                  ['Block', 'Paharpur'],
                  ['District', 'Purba Champaran'],
                  ['State', 'Bihar'],
                  ['School Area', 'Rural'],
                  ['School Type', 'Co-educational'],
                  ['Medium of Instruction', 'Hindi'],
                  ['Classes', 'Pre-Primary + Class 1 to 8'],
                  ['Building', 'Private Pucca'],
                  ['Total Classrooms', '13 (all in good condition)'],
                  ['Other Rooms', '2 (non-teaching activities)'],
                  ['Head Master Room', 'Yes (separate room)'],
                  ['Boundary Wall', 'Pucca'],
                  ['Academic Session', 'April to March'],
                  ['Residential School', 'No'],
                ].map(([key, val], i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, width: '40%', color: 'var(--primary)' }}>{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Want to Know More?</h2>
          <p>Visit us at Noniya, Paharpur or contact the school office</p>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <Link to="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
            <Link to="/admissions" className="btn btn-outline btn-lg">Apply for Admission</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
