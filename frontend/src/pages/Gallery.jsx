import { useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

const galleryData = [
  { id: 1, src: '/images/gallery/building.webp', title: 'S P Anglo Academy - Main Building', category: 'campus' },
  { id: 2, src: '/images/gallery/school_building.webp', title: 'School Building with National Flag', category: 'campus' },
  { id: 3, src: '/images/gallery/classroom.webp', title: 'Classroom - Students During Examination', category: 'campus' },
  { id: 4, src: '/images/gallery/playground.webp', title: 'School Playground - Volleyball Court', category: 'sports' },
  { id: 5, src: '/images/gallery/playground1.webp', title: 'Playground - Students & Staff', category: 'sports' },
  { id: 6, src: '/images/gallery/students.webp', title: 'Students with Medals - Prize Distribution', category: 'events' },
  { id: 7, src: '/images/gallery/activity.webp', title: 'Cultural Activity - Student Performance', category: 'events' },
  { id: 8, src: '/images/gallery/game.webp', title: 'Outdoor Games on School Ground', category: 'sports' },
  { id: 9, src: '/images/gallery/guest.jpg', title: 'Guest Visit - School Function', category: 'events' },
  { id: 10, src: '/images/gallery/parents.jpg', title: 'Parent-Teacher Interaction', category: 'events' },
];

const categories = ['all', 'campus', 'events', 'sports'];

export default function Gallery() {
  useScrollAnimation();
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filtered = filter === 'all' ? galleryData : galleryData.filter(g => g.category === filter);

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prevImage = (e) => { e.stopPropagation(); setLightbox((prev) => (prev > 0 ? prev - 1 : filtered.length - 1)); };
  const nextImage = (e) => { e.stopPropagation(); setLightbox((prev) => (prev < filtered.length - 1 ? prev + 1 : 0)); };

  return (
    <div>
      <div className="page-header">
        <h1>Photo Gallery</h1>
        <p>Glimpses of life at S P Anglo Academy, Noniya</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Gallery</div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Our School in Pictures</h2>
            <p>Real moments from S P Anglo Academy campus life</p>
          </div>

          <div className="gallery-filters animate-on-scroll">
            {categories.map(c => (
              <button
                key={c}
                className={`gallery-filter-btn ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filtered.map((img, i) => (
              <div
                className={`gallery-item animate-on-scroll animate-delay-${i % 5 + 1}`}
                key={img.id}
                onClick={() => openLightbox(i)}
              >
                <img src={img.src} alt={img.title} loading="lazy" />
                <div className="gallery-overlay">
                  <span>{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && filtered[lightbox] && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&#10005;</button>
          <button className="lightbox-nav lightbox-prev" onClick={prevImage}>&#10094;</button>
          <img src={filtered[lightbox].src} alt={filtered[lightbox].title} onClick={e => e.stopPropagation()} />
          <button className="lightbox-nav lightbox-next" onClick={nextImage}>&#10095;</button>
        </div>
      )}

      <section className="cta-section">
        <div className="container">
          <h2>Visit Our Campus in Person</h2>
          <p>See our facilities and meet our teachers at Noniya, Paharpur</p>
          <Link to="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
