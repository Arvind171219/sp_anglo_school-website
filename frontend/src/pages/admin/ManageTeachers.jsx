import { useState, useEffect } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../../services/api';

const emptyTeacher = {
  name: '', designation: '', subject: '', qualification: '',
  phone: '', email: '', photoUrl: '', section: '', joiningYear: ''
};

const placeholderPhotos = [
  'https://api.dicebear.com/7.x/initials/svg?seed=Teacher&backgroundColor=1a237e&textColor=ffffff',
];

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTeacher);
  const [error, setError] = useState('');

  const load = () => getTeachers().then(r => setTeachers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openNew = () => { setEditing(null); setForm(emptyTeacher); setError(''); setShowModal(true); };
  const openEdit = (t) => { setEditing(t.id); setForm(t); setError(''); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...form,
        joiningYear: form.joiningYear ? parseInt(form.joiningYear) : null,
        photoUrl: form.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.name)}&backgroundColor=1a237e&textColor=ffffff`
      };
      if (editing) {
        await updateTeacher(editing, data);
      } else {
        await createTeacher(data);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    await deleteTeacher(id).catch(() => {});
    load();
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Manage Teachers ({teachers.length})</h2>
          <button className="btn btn-primary" onClick={openNew}>+ Add Teacher</button>
        </div>

        {teachers.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            No teachers added yet. Click "+ Add Teacher" to add one.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {teachers.map(t => (
              <div key={t.id} style={{
                border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden',
                background: 'white', transition: 'box-shadow 0.2s',
              }}>
                <div style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center' }}>
                  <img
                    src={t.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}&backgroundColor=1a237e&textColor=ffffff`}
                    alt={t.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--primary)' }}>{t.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: '0.15rem 0' }}>{t.designation || 'Teacher'}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{t.subject} | {t.qualification}</p>
                  </div>
                </div>
                <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Teacher' : 'Add New Teacher'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g., Rajesh Kumar" />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <select name="designation" value={form.designation || ''} onChange={handleChange}>
                    <option value="">-- Select --</option>
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Assistant Teacher">Assistant Teacher</option>
                    <option value="Pre-Primary Teacher">Pre-Primary Teacher</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <input name="subject" value={form.subject || ''} onChange={handleChange} placeholder="e.g., Mathematics, Hindi" />
                </div>
                <div className="form-group">
                  <label>Qualification</label>
                  <input name="qualification" value={form.qualification || ''} onChange={handleChange} placeholder="e.g., B.Ed, M.A." />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Section</label>
                  <select name="section" value={form.section || ''} onChange={handleChange}>
                    <option value="">-- Select --</option>
                    <option value="Pre-Primary">Pre-Primary (Nursery-UKG)</option>
                    <option value="Primary">Primary (Class 1-5)</option>
                    <option value="Upper Primary">Upper Primary (Class 6-8)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Joining Year</label>
                  <input name="joiningYear" type="number" value={form.joiningYear || ''} onChange={handleChange} placeholder="e.g., 2015" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={form.phone || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Photo URL (leave blank for auto-generated)</label>
                <input name="photoUrl" value={form.photoUrl || ''} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
              </div>
              <div className="btn-group" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Teacher' : 'Add Teacher'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
