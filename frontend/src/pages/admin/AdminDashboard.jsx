import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStudents, getAllResults, getAnnouncements, getTeachers } from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, results: 0, announcements: 0, teachers: 0 });

  useEffect(() => {
    Promise.all([
      getStudents().catch(() => ({ data: [] })),
      getAllResults().catch(() => ({ data: [] })),
      getAnnouncements().catch(() => ({ data: [] })),
      getTeachers().catch(() => ({ data: [] })),
    ]).then(([s, r, a, t]) => {
      setStats({
        students: s.data.length,
        results: r.data.length,
        announcements: a.data.length,
        teachers: t.data.length,
      });
    });
  }, []);

  const cards = [
    { icon: '&#128101;', label: 'Total Students', value: stats.students, accent: '#1565c0', link: '/admin/students' },
    { icon: '&#128202;', label: 'Results Published', value: stats.results, accent: '#2e7d32', link: '/admin/results' },
    { icon: '&#128104;&#8205;&#127979;', label: 'Teachers', value: stats.teachers, accent: '#6a1b9a', link: '/admin/teachers' },
    { icon: '&#128227;', label: 'Announcements', value: stats.announcements, accent: '#e65100', link: '/admin/announcements' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-light)' }}>Welcome back, {user?.fullName}!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map((c, i) => (
          <Link to={c.link} key={i} className="card" style={{
            textAlign: 'center', borderTop: `4px solid ${c.accent}`,
            textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            <span style={{ fontSize: '1.8rem' }} dangerouslySetInnerHTML={{ __html: c.icon }} />
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: c.accent, margin: '0.25rem 0' }}>{c.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h2>Quick Actions</h2></div>
        <div className="btn-group" style={{ flexWrap: 'wrap' }}>
          <Link to="/admin/students" className="btn btn-primary">Manage Students</Link>
          <Link to="/admin/results" className="btn btn-success">Manage Results</Link>
          <Link to="/admin/teachers" className="btn btn-secondary">Manage Teachers</Link>
          <Link to="/admin/announcements" className="btn btn-accent">Post Announcement</Link>
        </div>
      </div>
    </div>
  );
}
