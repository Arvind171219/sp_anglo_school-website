import { useState, useEffect } from 'react';
import { getStudents, getAllResults, saveStudentExamResults } from '../../services/api';

// Subject lists per class - Hindi medium school (S P Anglo Academy)
const SUBJECTS = {
  'Nursery': ['Hindi', 'English', 'Mathematics', 'Drawing'],
  'LKG': ['Hindi', 'English', 'Mathematics', 'Drawing'],
  'UKG': ['Hindi', 'English', 'Mathematics', 'GK', 'Drawing'],
  'Class 1': ['Hindi', 'English', 'Mathematics', 'EVS', 'GK', 'Drawing'],
  'Class 2': ['Hindi', 'English', 'Mathematics', 'EVS', 'GK', 'Drawing'],
  'Class 3': ['Hindi', 'English', 'Mathematics', 'EVS', 'GK', 'Computer', 'Drawing'],
  'Class 4': ['Hindi', 'English', 'Mathematics', 'EVS', 'GK', 'Computer', 'Drawing'],
  'Class 5': ['Hindi', 'English', 'Mathematics', 'EVS', 'GK', 'Computer', 'Drawing'],
  'Class 6': ['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'Computer'],
  'Class 7': ['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'Computer'],
  'Class 8': ['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Sanskrit', 'Computer'],
};

const CLASSES = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
const EXAM_TYPES = ['Unit Test 1', 'Unit Test 2', 'Unit Test 3', 'Half Yearly', 'Annual'];

export default function ManageResults() {
  const [allStudents, setAllStudents] = useState([]);
  const [allResults, setAllResults] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [loaded, setLoaded] = useState(false);

  const [activeStudent, setActiveStudent] = useState(null);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastSavedId, setLastSavedId] = useState(null);

  const loadData = async () => {
    try {
      const [studRes, resRes] = await Promise.all([getStudents(), getAllResults()]);
      setAllStudents(studRes.data);
      setAllResults(resRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Available sections for selected class
  const sections = [...new Set(
    allStudents
      .filter(s => s.className === selectedClass)
      .map(s => s.section)
      .filter(Boolean)
  )].sort();

  // Subjects for selected class
  const subjects = SUBJECTS[selectedClass] || [];

  // Students in selected class/section
  const filteredStudents = allStudents.filter(s => {
    if (s.className !== selectedClass) return false;
    if (selectedSection && s.section !== selectedSection) return false;
    return true;
  });

  // Results for current exam + year
  const examResults = allResults.filter(r =>
    r.examType === selectedExam && r.academicYear === academicYear
  );

  const getStudentExamResults = (studentId) =>
    examResults.filter(r => r.student?.id === studentId);

  const isComplete = (studentId) => {
    const results = getStudentExamResults(studentId);
    return subjects.length > 0 && results.length >= subjects.length;
  };

  const pendingStudents = filteredStudents.filter(s => !isComplete(s.id));
  const completedStudents = filteredStudents.filter(s => isComplete(s.id));

  const handleLoad = () => {
    if (!selectedClass || !selectedExam || !academicYear) return;
    setLoaded(true);
    setActiveStudent(null);
    setError('');
    setSuccess('');
    setLastSavedId(null);
  };

  const handleEnterMarks = (student) => {
    setActiveStudent(student);
    setError('');
    setSuccess('');
    const existing = getStudentExamResults(student.id);
    const m = {};
    subjects.forEach(sub => {
      const found = existing.find(r => r.subject === sub);
      m[sub] = found ? String(found.marksObtained) : '';
    });
    setMarks(m);
  };

  const handleSave = async () => {
    for (const sub of subjects) {
      if (marks[sub] === '' || marks[sub] === undefined) {
        setError(`Please enter marks for ${sub}`);
        return;
      }
      const val = parseFloat(marks[sub]);
      if (isNaN(val) || val < 0 || val > 100) {
        setError(`Invalid marks for ${sub} (must be 0-100)`);
        return;
      }
    }

    setSaving(true);
    setError('');
    try {
      const resultData = subjects.map(sub => ({
        subject: sub,
        marksObtained: parseFloat(marks[sub]),
        totalMarks: 100.0,
      }));

      await saveStudentExamResults(activeStudent.id, selectedExam, academicYear, resultData);

      // Reload all results
      const resRes = await getAllResults();
      setAllResults(resRes.data);

      setLastSavedId(activeStudent.id);
      setSuccess(`Results saved successfully for ${activeStudent.firstName} ${activeStudent.lastName}!`);
      setActiveStudent(null);

      // Clear success after 4 seconds
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save results. Please try again.';
      setError(msg);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const getTotalMarks = (studentId) => {
    const results = getStudentExamResults(studentId);
    const obtained = results.reduce((sum, r) => sum + r.marksObtained, 0);
    const total = results.reduce((sum, r) => sum + r.totalMarks, 0);
    const percentage = total > 0 ? ((obtained / total) * 100).toFixed(1) : 0;
    return { obtained, total, percentage };
  };

  // Calculate live total while entering marks
  const liveTotal = subjects.reduce((sum, sub) => {
    const val = parseFloat(marks[sub]);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
  const liveMax = subjects.length * 100;
  const livePercentage = liveMax > 0 ? ((liveTotal / liveMax) * 100).toFixed(1) : 0;

  return (
    <div>
      {/* Selection Panel */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header"><h2>Manage Results</h2></div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Class *</label>
            <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSection(''); setLoaded(false); }}>
              <option value="">-- Select Class --</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Section</label>
            <select value={selectedSection} onChange={e => { setSelectedSection(e.target.value); setLoaded(false); }}>
              <option value="">All Sections</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Exam Type *</label>
            <select value={selectedExam} onChange={e => { setSelectedExam(e.target.value); setLoaded(false); }}>
              <option value="">-- Select Exam --</option>
              {EXAM_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Academic Year *</label>
            <select value={academicYear} onChange={e => { setAcademicYear(e.target.value); setLoaded(false); }}>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLoad}
          disabled={!selectedClass || !selectedExam || !academicYear}
        >
          Load Students
        </button>
      </div>

      {/* Success Alert */}
      {success && (
        <div style={{
          padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1rem',
          background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          border: '1px solid #a5d6a7', color: '#1b5e20',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontWeight: 600, fontSize: '0.9rem',
          animation: 'fadeInDown 0.3s ease',
        }}>
          <span style={{ fontSize: '1.2rem' }}>&#9989;</span>
          {success}
        </div>
      )}

      {loaded && (
        <>
          {/* Subjects info bar */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Subjects ({subjects.length}):</strong>
              {subjects.map(s => (
                <span key={s} style={{
                  background: 'var(--bg)', padding: '0.2rem 0.6rem', borderRadius: '12px',
                  fontSize: '0.8rem', color: 'var(--text-light)'
                }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {filteredStudents.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.82rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-light)' }}>Progress</span>
                <span style={{ color: 'var(--primary)' }}>{completedStudents.length} / {filteredStudents.length} completed</span>
              </div>
              <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '4px', transition: 'width 0.5s ease',
                  width: `${(completedStudents.length / filteredStudents.length) * 100}%`,
                  background: completedStudents.length === filteredStudents.length
                    ? 'linear-gradient(90deg, #2e7d32, #43a047)'
                    : 'linear-gradient(90deg, #1565c0, #42a5f5)',
                }} />
              </div>
            </div>
          )}

          {filteredStudents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <span style={{ fontSize: '3rem' }}>&#128237;</span>
              <p style={{ color: '#888', marginTop: '0.5rem' }}>
                No students found in {selectedClass}{selectedSection ? ` - ${selectedSection}` : ''}.
                <br />Please add students first from Manage Students.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: activeStudent ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
              {/* Student Lists */}
              <div>
                {/* Pending Students */}
                <div className="card" style={{
                  marginBottom: '1.5rem',
                  borderLeft: '4px solid #e65100',
                  borderTop: 'none',
                }}>
                  <div className="card-header" style={{ borderBottom: '1px solid #fff3e0' }}>
                    <h2 style={{ color: '#e65100', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>&#9203;</span> Pending ({pendingStudents.length})
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {filteredStudents.length} total
                    </span>
                  </div>
                  {pendingStudents.length === 0 ? (
                    <div style={{
                      textAlign: 'center', padding: '1.5rem',
                      background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                      borderRadius: '10px', margin: '0.5rem 0',
                    }}>
                      <span style={{ fontSize: '2rem' }}>&#127881;</span>
                      <p style={{ color: '#1b5e20', fontWeight: 700, marginTop: '0.25rem' }}>
                        All students have been updated!
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {pendingStudents.map(s => (
                        <div key={s.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: activeStudent?.id === s.id ? '#e3f2fd' : '#fff8e1',
                          borderRadius: '10px', transition: '0.2s',
                          border: activeStudent?.id === s.id ? '2px solid #1565c0' : '1px solid #ffe0b2',
                        }}>
                          <div>
                            <strong style={{ fontSize: '0.9rem' }}>{s.firstName} {s.lastName}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                              Roll: {s.rollNumber} {s.section && `| Sec: ${s.section}`}
                            </div>
                          </div>
                          <button className="btn btn-primary btn-sm" onClick={() => handleEnterMarks(s)}>
                            Enter Marks
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Students */}
                {completedStudents.length > 0 && (
                  <div className="card" style={{
                    borderLeft: '4px solid #2e7d32',
                    borderTop: 'none',
                  }}>
                    <div className="card-header" style={{ borderBottom: '1px solid #e8f5e9' }}>
                      <h2 style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>&#9989;</span> Completed ({completedStudents.length})
                      </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {completedStudents.map(s => {
                        const { obtained, total, percentage } = getTotalMarks(s.id);
                        const isJustSaved = lastSavedId === s.id;
                        return (
                          <div key={s.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.75rem 1rem', borderRadius: '10px',
                            background: isJustSaved ? '#c8e6c9' : '#e8f5e9',
                            border: isJustSaved ? '2px solid #2e7d32' : '1px solid #c8e6c9',
                            transition: 'all 0.3s ease',
                          }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <strong style={{ fontSize: '0.9rem' }}>{s.firstName} {s.lastName}</strong>
                                {isJustSaved && (
                                  <span style={{
                                    background: '#2e7d32', color: 'white', padding: '0.1rem 0.4rem',
                                    borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700,
                                  }}>JUST SAVED</span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#2e7d32', fontWeight: 600 }}>
                                Roll: {s.rollNumber} | {obtained}/{total} ({percentage}%)
                              </div>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEnterMarks(s)}>
                              Edit
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Marks Entry Panel */}
              {activeStudent && (
                <div className="card" style={{
                  borderTop: '4px solid var(--primary)',
                  position: 'sticky', top: '80px', alignSelf: 'start',
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1a237e, #283593)',
                    color: 'white', padding: '1rem 1.25rem', borderRadius: '10px',
                    marginBottom: '1.25rem',
                  }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>
                      {activeStudent.firstName} {activeStudent.lastName}
                    </h3>
                    <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>
                      Roll: {activeStudent.rollNumber} {activeStudent.section && `| Sec: ${activeStudent.section}`}
                      <br />{selectedExam} &mdash; {academicYear}
                    </div>
                  </div>

                  {error && <div className="alert alert-error">{error}</div>}

                  <table className="data-table" style={{ marginBottom: '1rem' }}>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Marks</th>
                        <th style={{ width: '60px', textAlign: 'center' }}>/ 100</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map(sub => {
                        const val = parseFloat(marks[sub]);
                        const hasValue = marks[sub] !== '' && !isNaN(val);
                        return (
                          <tr key={sub} style={{
                            background: hasValue ? (val >= 33 ? '#f0fff4' : '#fff5f5') : 'transparent',
                          }}>
                            <td><strong>{sub}</strong></td>
                            <td style={{ textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={marks[sub] || ''}
                                onChange={e => setMarks({ ...marks, [sub]: e.target.value })}
                                style={{
                                  width: '80px', padding: '0.4rem 0.5rem',
                                  border: `2px solid ${hasValue ? (val >= 33 ? '#a5d6a7' : '#ef9a9a') : '#e8e8e8'}`,
                                  borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center',
                                  fontFamily: 'inherit', fontWeight: hasValue ? 700 : 400,
                                }}
                                placeholder="0"
                              />
                            </td>
                            <td style={{ color: 'var(--text-light)', textAlign: 'center' }}>/ 100</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Live total */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1rem',
                    fontWeight: 700, fontSize: '0.95rem',
                    background: livePercentage >= 60 ? '#e8f5e9' : livePercentage >= 33 ? '#fff3e0' : '#fce4ec',
                    border: `1px solid ${livePercentage >= 60 ? '#a5d6a7' : livePercentage >= 33 ? '#ffcc80' : '#ef9a9a'}`,
                  }}>
                    <span>Total: {liveTotal} / {liveMax}</span>
                    <span style={{
                      color: livePercentage >= 60 ? '#2e7d32' : livePercentage >= 33 ? '#e65100' : '#c62828',
                      fontSize: '1.1rem',
                    }}>
                      {livePercentage}%
                    </span>
                  </div>

                  <div className="btn-group">
                    <button className="btn btn-success" onClick={handleSave} disabled={saving}
                      style={{ flex: 1 }}>
                      {saving ? 'Saving...' : 'Save All Marks'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => { setActiveStudent(null); setError(''); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
