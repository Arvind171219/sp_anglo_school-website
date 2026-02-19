import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const defaultAnnouncements = [
  { id: 1, title: 'Admissions Open for 2025-26 Session', content: 'S P Anglo Academy is accepting applications for Pre-Primary to Class 8 for the new academic session starting April 2025. Contact school office for details.', category: 'general', createdAt: '2025-01-15T10:00:00' },
  { id: 2, title: 'Annual Examination Schedule', content: 'Annual examinations for Class 1-8 will begin in March. Detailed timetable will be shared with students. Parents are requested to ensure regular attendance.', category: 'exam', createdAt: '2025-02-01T09:00:00' },
  { id: 3, title: 'Republic Day Celebration', content: 'Republic Day will be celebrated on 26th January. Flag hoisting at 8:00 AM followed by cultural programs. All students must attend in proper uniform.', category: 'event', createdAt: '2025-01-20T08:00:00' },
  { id: 4, title: 'Half-Yearly Results Declared', content: 'Results for half-yearly examinations are available. Parents can collect report cards from the school office or check through student portal.', category: 'exam', createdAt: '2024-11-15T10:00:00' },
  { id: 5, title: 'Winter Vacation Notice', content: 'School will remain closed from 25th December to 1st January for winter vacation. Classes will resume from 2nd January 2025.', category: 'holiday', createdAt: '2024-12-20T10:00:00' },
  { id: 6, title: 'Parent-Teacher Meeting', content: 'PTM for all classes scheduled for the last Saturday of every month. Parents are requested to attend to discuss their child\'s progress.', category: 'general', createdAt: '2025-01-25T10:00:00' },
  { id: 7, title: 'Drawing Competition Results', content: 'Results of the inter-class drawing competition have been announced. Winners will receive prizes during the morning assembly.', category: 'event', createdAt: '2025-01-18T11:00:00' },
  { id: 8, title: 'Saraswati Puja Celebration', content: 'Saraswati Puja will be celebrated in the school premises on Basant Panchami. Students should come in yellow/white attire.', category: 'event', createdAt: '2025-01-28T09:00:00' },
  { id: 9, title: 'Chhath Puja Holiday', content: 'School will remain closed on Chhath Puja days. Wishing all families a blessed Chhath celebration.', category: 'holiday', createdAt: '2024-11-05T10:00:00' },
  { id: 10, title: 'New Books Added to Library', content: '100 new books have been added to the school library including story books, science encyclopedias, and Hindi literature for all classes.', category: 'general', createdAt: '2024-12-10T10:00:00' },
];

export default function Announcements() {
  useScrollAnimation();
  const [announcements, setAnnouncements] = useState([]);
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => {
    getAnnouncements()
      .then(r => setAnnouncements(r.data.length > 0 ? r.data : defaultAnnouncements))
      .catch(() => setAnnouncements(defaultAnnouncements));
  }, []);

  const filtered = filterCat === 'all' ? announcements : announcements.filter(a => a.category === filterCat);

  return (
    <div>
      <div className="page-header">
        <h1>News & Announcements</h1>
        <p>Latest updates from S P Anglo Academy, Noniya</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Announcements</div>
      </div>

      <section className="section">
        <div className="container">
          <div className="gallery-filters animate-on-scroll" style={{ marginBottom: '2rem' }}>
            {['all', 'general', 'exam', 'event', 'holiday'].map(c => (
              <button
                key={c}
                className={`gallery-filter-btn ${filterCat === c ? 'active' : ''}`}
                onClick={() => setFilterCat(c)}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="announcement-list">
            {filtered.map((a, i) => (
              <div className={`announcement-item animate-on-scroll animate-delay-${i % 5 + 1}`} key={a.id || i}>
                <span className={`ann-category ann-${a.category || 'general'}`}>{a.category || 'general'}</span>
                <h3>{a.title}</h3>
                <p>{a.content}</p>
                {a.createdAt && (
                  <p className="ann-date">
                    {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No announcements found in this category.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
