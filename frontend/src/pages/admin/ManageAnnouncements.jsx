import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/api';

const emptyAnn = { title: '', content: '', category: 'general' };

export default function ManageAnnouncements() {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyAnn);

  const load = () => getAnnouncements().then(r => setList(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openNew = () => { setEditing(null); setForm(emptyAnn); setShowModal(true); };
  const openEdit = (a) => { setEditing(a.id); setForm({ title: a.title, content: a.content, category: a.category || 'general' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateAnnouncement(editing, form);
      } else {
        await createAnnouncement(form);
      }
      setShowModal(false);
      load();
    } catch {
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await deleteAnnouncement(id).catch(() => {});
    load();
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Manage Announcements</h2>
          <button className="btn btn-primary" onClick={openNew}>+ New Announcement</button>
        </div>

        {list.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No announcements yet.</p>
        ) : (
          list.map(a => (
            <div key={a.id} style={{ padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <strong style={{ fontSize: '1rem' }}>{a.title}</strong>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: '#e3f2fd', padding: '0.15rem 0.5rem', borderRadius: '10px', color: '#1565c0' }}>
                    {a.category}
                  </span>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>{a.content}</p>
                  <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {a.createdAt && new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="btn-group">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Announcement' : 'New Announcement'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="general">General</option>
                  <option value="exam">Exam</option>
                  <option value="event">Event</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} required rows="5" />
              </div>
              <div className="btn-group" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Post'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
