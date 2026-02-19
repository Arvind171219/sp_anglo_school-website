import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const slides = [
  { src: '/images/gallery/building.webp', title: 'S P Anglo Academy, Noniya', sub: 'Quality Hindi-Medium Education since 2011' },
  { src: '/images/gallery/school_building.webp', title: 'Our School Campus', sub: 'Pucca building with 13 classrooms & national flag' },
  { src: '/images/gallery/classroom.webp', title: 'Learning in Action', sub: 'Dedicated teachers guiding every student' },
  { src: '/images/gallery/students.webp', title: 'Our Achievers', sub: 'Students excelling in academics & activities' },
  { src: '/images/gallery/playground.webp', title: 'Sports & Fitness', sub: 'Playground for holistic development' },
  { src: '/images/gallery/activity.webp', title: 'Cultural Programs', sub: 'Celebrating traditions and creativity' },
];

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [current, setCurrent] = useState(0);
  useScrollAnimation();

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    getAnnouncements().then(r => setAnnouncements(r.data.slice(0, 3))).catch(() => {});
    if (!sessionStorage.getItem('popupShown')) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem('popupShown', 'true');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div>
      {/* Announcement Ticker - Top of page */}
      <div className="announcement-ticker">
        <span className="ticker-label">&#128227; NOTICE</span>
        <div className="ticker-wrap">
          <div className="ticker-content">
            <span className="ticker-item">&#11088; Admissions Open for 2025-26 Academic Session (April Start) - Class 1 to 8 &amp; Pre-Primary!</span>
            <span className="ticker-item">&#127942; S P Anglo Academy - Quality Hindi Medium Education in Paharpur, Purba Champaran</span>
            <span className="ticker-item">&#128218; New Academic Session Begins in April - Register Your Child Today!</span>
            <span className="ticker-item">&#128197; UDISE Code: 10021700117 | Established: 2011</span>
            <span className="ticker-item">&#11088; Admissions Open for 2025-26 Academic Session (April Start) - Class 1 to 8 &amp; Pre-Primary!</span>
            <span className="ticker-item">&#127942; S P Anglo Academy - Quality Hindi Medium Education in Paharpur, Purba Champaran</span>
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <section className="hero-carousel">
        {slides.map((slide, i) => (
          <div className={`carousel-slide ${i === current ? 'active' : ''}`} key={i}>
            <img src={slide.src} alt={slide.title} />
            <div className="carousel-overlay" />
          </div>
        ))}

        <div className="carousel-content">
          <span className="hero-badge">&#127891; Established 2011 | Purba Champaran, Bihar</span>
          <h1 className="carousel-title" key={`t-${current}`}>{slides[current].title}</h1>
          <p className="carousel-sub" key={`s-${current}`}>{slides[current].sub}</p>
          <div className="hero-buttons">
            <Link to="/admissions" className="btn btn-accent btn-lg pulse-btn">Apply for Admission</Link>
            <Link to="/about" className="btn btn-outline btn-lg">Know More About Us</Link>
          </div>
        </div>

        <button className="carousel-btn carousel-prev" onClick={prevSlide}>&#10094;</button>
        <button className="carousel-btn carousel-next" onClick={nextSlide}>&#10095;</button>

        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button key={i} className={`carousel-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>

        <div className="hero-stats-bar">
          <div className="hero-stats-inner">
            <div>
              <div className="hero-stat-number">13+</div>
              <div className="hero-stat-label">Years of Service</div>
            </div>
            <div>
              <div className="hero-stat-number">21</div>
              <div className="hero-stat-label">Dedicated Teachers</div>
            </div>
            <div>
              <div className="hero-stat-number">13</div>
              <div className="hero-stat-label">Classrooms</div>
            </div>
            <div>
              <div className="hero-stat-number">1-8</div>
              <div className="hero-stat-label">Classes Offered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Why Choose S P Anglo Academy</h2>
            <p>Providing quality education in the heart of Paharpur, Purba Champaran</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '&#128218;', title: 'Hindi Medium Education', desc: 'Strong foundation in Hindi medium instruction with focus on understanding and communication skills.', color: '#e3f2fd' },
              { icon: '&#128187;', title: 'Computer Aided Learning', desc: 'Computer aided learning lab available to give students exposure to modern technology.', color: '#e8f5e9' },
              { icon: '&#127968;', title: 'Pucca Infrastructure', desc: 'Private pucca building with 13 well-maintained classrooms, boundary wall, and all-weather road access.', color: '#fff3e0' },
              { icon: '&#128214;', title: 'Library with 500+ Books', desc: 'Well-stocked library with 500+ books to encourage reading habits and knowledge beyond textbooks.', color: '#fce4ec' },
              { icon: '&#9917;', title: 'Playground & Sports', desc: 'Dedicated playground for physical activities, games, and sports to ensure holistic development.', color: '#f3e5f5' },
              { icon: '&#128118;', title: 'Pre-Primary Section', desc: 'Attached pre-primary section with 4 dedicated teachers for your child\'s earliest learning years.', color: '#e0f7fa' },
            ].map((f, i) => (
              <div className={`feature-card animate-on-scroll animate-delay-${i % 5 + 1}`} key={i}>
                <div className="card-icon" style={{ background: f.color }} dangerouslySetInnerHTML={{ __html: f.icon }} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Strip */}
      <section className="gallery-strip">
        <div className="gallery-strip-inner">
          {[
            { src: '/images/gallery/building.webp', title: 'Main Building' },
            { src: '/images/gallery/school_building.webp', title: 'School Campus' },
            { src: '/images/gallery/classroom.webp', title: 'Classroom' },
            { src: '/images/gallery/playground.webp', title: 'Playground' },
            { src: '/images/gallery/students.webp', title: 'Students' },
            { src: '/images/gallery/activity.webp', title: 'Activities' },
            { src: '/images/gallery/game.webp', title: 'Sports' },
            { src: '/images/gallery/guest.jpg', title: 'Events' },
            { src: '/images/gallery/building.webp', title: 'Main Building' },
            { src: '/images/gallery/school_building.webp', title: 'School Campus' },
            { src: '/images/gallery/classroom.webp', title: 'Classroom' },
            { src: '/images/gallery/playground.webp', title: 'Playground' },
          ].map((img, i) => (
            <div className="gallery-strip-item" key={i}>
              <img src={img.src} alt={img.title} />
              <span>{img.title}</span>
            </div>
          ))}
        </div>
        <div className="gallery-strip-overlay">
          <Link to="/gallery" className="btn btn-white btn-lg">View Full Gallery</Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: '&#128101;', number: '500+', label: 'Students Enrolled' },
              { icon: '&#128104;&#8205;&#127979;', number: '21', label: 'Total Teachers' },
              { icon: '&#128218;', number: '500+', label: 'Library Books' },
              { icon: '&#127891;', number: '2011', label: 'Established Since' },
            ].map((s, i) => (
              <div className="stat-card animate-on-scroll" key={i}>
                <div className="stat-icon" dangerouslySetInnerHTML={{ __html: s.icon }} />
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Latest News & Updates</h2>
            <p>Stay informed about school activities and events</p>
          </div>
          <div className="announcement-list">
            {announcements.length > 0 ? announcements.map((a, i) => (
              <div className={`announcement-item animate-on-scroll animate-delay-${i + 1}`} key={a.id}>
                <span className={`ann-category ann-${a.category || 'general'}`}>{a.category || 'general'}</span>
                <h3>{a.title}</h3>
                <p>{a.content}</p>
                {a.createdAt && <p className="ann-date">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
              </div>
            )) : (
              <>
                {[
                  { cat: 'general', title: 'New Academic Session 2025-26 Starting April', desc: 'Admissions open for Pre-Primary to Class 8. Contact the school office for registration forms and details.' },
                  { cat: 'exam', title: 'Annual Examination Schedule Released', desc: 'Annual exams for Class 1-8 will begin from March. Students are advised to start preparation.' },
                  { cat: 'event', title: 'Republic Day Celebration at School', desc: 'All students and parents are invited to join the Republic Day celebration. Flag hoisting at 8:00 AM.' },
                ].map((a, i) => (
                  <div className={`announcement-item animate-on-scroll animate-delay-${i + 1}`} key={i}>
                    <span className={`ann-category ann-${a.cat}`}>{a.cat}</span>
                    <h3>{a.title}</h3>
                    <p>{a.desc}</p>
                  </div>
                ))}
              </>
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/announcements" className="btn btn-primary">View All Announcements</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>What Parents Say</h2>
            <p>Trusted by families across Paharpur and surrounding villages</p>
          </div>
          <div className="testimonials-grid">
            {[
              { text: 'S P Anglo Academy has given my children a strong foundation. The teachers are caring and the school environment is very positive. I am happy with their Hindi medium education.', name: 'Rajesh Yadav', role: 'Parent, Noniya Village' },
              { text: 'The school has good facilities for a rural area. My son enjoys the playground and library. The teachers give personal attention because the class size is manageable.', name: 'Sunita Devi', role: 'Parent, Paharpur' },
              { text: 'I am glad there is a good school near our village. The pre-primary section is excellent and my daughter has learned so much in just one year.', name: 'Mohammad Iqbal', role: 'Parent, Nearby Village' },
            ].map((t, i) => (
              <div className={`testimonial-card animate-on-scroll animate-delay-${i + 1}`} key={i}>
                <span className="quote-icon">"</span>
                <p>{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{t.name.charAt(0)}</div>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Give Your Child the Best Start in Education</h2>
          <p>Admissions open for Pre-Primary to Class 8 - Academic Session starts April</p>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <Link to="/admissions" className="btn btn-accent btn-lg pulse-btn">Apply for Admission</Link>
            <Link to="/contact" className="btn btn-outline btn-lg">Visit Our School</Link>
          </div>
        </div>
      </section>

      {/* Admission Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)}>&#10005;</button>
            <div className="popup-ribbon">Limited Seats!</div>
            <div className="popup-img">
              <img src="/images/gallery/building.webp" alt="S P Anglo Academy" />
            </div>
            <div className="popup-body">
              <span className="popup-badge">&#11088; 2025-26 Session</span>
              <h2>Admissions Open!</h2>
              <p>Pre-Primary to Class 8 | Hindi Medium</p>
              <ul className="popup-features">
                <li>&#10003; 21 Experienced Teachers</li>
                <li>&#10003; Computer Lab & Library</li>
                <li>&#10003; Playground & Sports</li>
                <li>&#10003; Safe Pucca Building</li>
              </ul>
              <Link to="/admissions" className="btn btn-accent btn-lg" style={{ width: '100%' }} onClick={() => setShowPopup(false)}>
                Apply Now
              </Link>
              <p className="popup-footer-text">S P Anglo Academy, Noniya, Paharpur, Purba Champaran</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
