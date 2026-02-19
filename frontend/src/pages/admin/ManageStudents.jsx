import { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../services/api';

const classes = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];

const emptyStudent = {
  rollNumber: '', firstName: '', lastName: '', dateOfBirth: '', gender: '',
  email: '', phone: '', address: '', className: '', section: '',
  guardianName: '', guardianPhone: '', admissionYear: ''
};

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyStudent);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const load = () => getStudents().then(r => setStudents(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openNew = () => { setEditing(null); setForm(emptyStudent); setError(''); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s.id);
    setForm({ ...s, dateOfBirth: s.dateOfBirth || '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = { ...form, admissionYear: form.admissionYear ? parseInt(form.admissionYear) : null };
      if (editing) {
        await updateStudent(editing, data);
      } else {
        await createStudent(data);
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      load();
    } catch {
      alert('Failed to delete. Student may have results linked.');
    }
  };

  const filtered = students.filter(s => {
    const matchSearch = !search || `${s.firstName} ${s.lastName} ${s.rollNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchClass = !filterClass || s.className === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Manage Students ({students.length})</h2>
          <button className="btn btn-primary" onClick={openNew}>+ Add Student</button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or roll number..."
            style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}
          />
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}>
            <option value="">All Classes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            {students.length === 0 ? 'No students found. Click "+ Add Student" to add one.' : 'No students match your search.'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>DOB</th>
                  <th>Guardian</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.rollNumber}</strong></td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.className} {s.section && `- ${s.section}`}</td>
                    <td>{s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString('en-IN') : '-'}</td>
                    <td>{s.guardianName || '-'}</td>
                    <td>{s.phone || s.guardianPhone || '-'}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Student' : 'Add New Student'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input name="rollNumber" value={form.rollNumber} onChange={handleChange} required disabled={!!editing} placeholder="e.g., 2025001" />
                </div>
                <div className="form-group">
                  <label>Class *</label>
                  <select name="className" value={form.className || ''} onChange={handleChange} required>
                    <option value="">-- Select Class --</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input name="dateOfBirth" type="date" value={form.dateOfBirth || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={form.gender || ''} onChange={handleChange}>
                    <option value="">-- Select --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Section</label>
                  <input name="section" value={form.section || ''} onChange={handleChange} placeholder="e.g., A, B" />
                </div>
                <div className="form-group">
                  <label>Admission Year</label>
                  <input name="admissionYear" type="number" value={form.admissionYear || ''} onChange={handleChange} placeholder="e.g., 2024" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Guardian Name *</label>
                  <input name="guardianName" value={form.guardianName || ''} onChange={handleChange} required placeholder="Father/Mother name" />
                </div>
                <div className="form-group">
                  <label>Guardian Phone *</label>
                  <input name="guardianPhone" value={form.guardianPhone || ''} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Student Phone</label>
                  <input name="phone" value={form.phone || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={form.address || ''} onChange={handleChange} rows="2" placeholder="Village, Block, District" />
              </div>
              <div className="btn-group" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Student' : 'Add Student'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
