import { useState } from 'react';
import { Link } from 'react-router-dom';
import { lookupResults } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getGradeColor = (grade) => {
  if (!grade) return '#888';
  if (grade === 'A+') return '#1b5e20';
  if (grade === 'A') return '#2e7d32';
  if (grade === 'B+') return '#1565c0';
  if (grade === 'B') return '#1976d2';
  if (grade === 'C') return '#e65100';
  if (grade === 'D') return '#f57f17';
  return '#c62828';
};

const getGradeBg = (grade) => {
  if (!grade) return '#f5f5f5';
  if (grade.startsWith('A')) return '#e8f5e9';
  if (grade.startsWith('B')) return '#e3f2fd';
  if (grade === 'C') return '#fff3e0';
  if (grade === 'D') return '#fffde7';
  return '#fce4ec';
};

const calcOverallGrade = (pct) => {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

export default function CheckResults() {
  const [rollNumber, setRollNumber] = useState('');
  const [dob, setDob] = useState('');
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedExam, setSelectedExam] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    setSelectedExam('');
    setStudent(null);
    setResults([]);
    try {
      const res = await lookupResults(rollNumber.trim(), dob);
      if (res.data && res.data.student) {
        setStudent(res.data.student);
        setResults(res.data.results || []);
        const exams = [...new Set((res.data.results || []).map(r => `${r.examType}||${r.academicYear}`))];
        if (exams.length > 0) setSelectedExam(exams[0]);
      } else {
        setError('No student found. Please check your roll number and date of birth.');
      }
    } catch (err) {
      setStudent(null);
      setResults([]);
      if (err.response?.status === 404) {
        setError('No student found with this roll number and date of birth. Please verify and try again.');
      } else if (err.response?.status === 400) {
        setError('Invalid input. Please check the date format and try again.');
      } else {
        setError('Unable to fetch results. Please check your internet connection and try again.');
      }
      console.error('Lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group results by exam type + academic year
  const examGroups = {};
  results.forEach(r => {
    const key = `${r.examType}||${r.academicYear}`;
    if (!examGroups[key]) examGroups[key] = [];
    examGroups[key].push(r);
  });
  const examKeys = Object.keys(examGroups);

  const currentResults = selectedExam ? (examGroups[selectedExam] || []) : [];
  const currentExamType = selectedExam ? selectedExam.split('||')[0] : '';
  const currentAcademicYear = selectedExam ? selectedExam.split('||')[1] : '';

  const totalObtained = currentResults.reduce((sum, r) => sum + r.marksObtained, 0);
  const totalMax = currentResults.reduce((sum, r) => sum + r.totalMarks, 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;
  const overallGrade = calcOverallGrade(parseFloat(percentage));
  const passStatus = parseFloat(percentage) >= 33 ? 'PASS' : 'FAIL';

  const downloadPDF = () => {
    if (!student || currentResults.length === 0) return;

    try {
      const doc = new jsPDF();

      // Double border
      doc.setDrawColor(26, 35, 126);
      doc.setLineWidth(1.5);
      doc.rect(8, 8, 194, 281);
      doc.setLineWidth(0.5);
      doc.rect(11, 11, 188, 275);

      // School Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 35, 126);
      doc.text('S P ANGLO ACADEMY', 105, 28, { align: 'center' });

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Noniya, Purba Champaran, Bihar', 105, 35, { align: 'center' });

      // Decorative lines
      doc.setDrawColor(255, 111, 0);
      doc.setLineWidth(1);
      doc.line(35, 39, 175, 39);
      doc.setDrawColor(26, 35, 126);
      doc.setLineWidth(0.3);
      doc.line(35, 41, 175, 41);

      // Report Card Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 35, 126);
      doc.text('REPORT CARD', 105, 50, { align: 'center' });

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`${currentExamType} - Academic Year ${currentAcademicYear}`, 105, 57, { align: 'center' });

      // Student Info Box
      doc.setFillColor(245, 247, 255);
      doc.setDrawColor(200, 200, 220);
      doc.roundedRect(18, 63, 174, 35, 3, 3, 'FD');

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);

      doc.setFont('helvetica', 'bold');
      doc.text('Student Name:', 24, 73);
      doc.text('Class:', 24, 81);
      doc.text("Father's Name:", 24, 89);
      doc.text('Roll Number:', 115, 73);
      doc.text('Date of Birth:', 115, 81);

      doc.setFont('helvetica', 'normal');
      doc.text(`${student.firstName} ${student.lastName}`, 60, 73);
      doc.text(`${student.className}${student.section ? ' - ' + student.section : ''}`, 46, 81);
      doc.text(`${student.guardianName || '-'}`, 62, 89);
      doc.text(`${student.rollNumber}`, 148, 73);
      doc.text(`${student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : '-'}`, 148, 81);

      // Results Table
      const tableData = currentResults.map((r, i) => [
        i + 1,
        r.subject,
        r.marksObtained,
        r.totalMarks,
        r.grade,
        r.marksObtained >= 33 ? 'Pass' : 'Fail',
      ]);

      // Add total row
      tableData.push(['', 'TOTAL', totalObtained, totalMax, overallGrade, passStatus]);

      autoTable(doc, {
        startY: 104,
        head: [['S.No', 'Subject', 'Marks', 'Out Of', 'Grade', 'Status']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 4, lineColor: [200, 200, 220], lineWidth: 0.3 },
        headStyles: { fillColor: [26, 35, 126], textColor: 255, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: [50, 50, 50] },
        columnStyles: {
          0: { halign: 'center', cellWidth: 16 },
          1: { cellWidth: 50 },
          2: { halign: 'center', cellWidth: 28 },
          3: { halign: 'center', cellWidth: 25 },
          4: { halign: 'center', cellWidth: 22 },
          5: { halign: 'center', cellWidth: 22 },
        },
        margin: { left: 18, right: 18 },
        didParseCell: function (data) {
          if (data.section === 'body' && data.row.index === tableData.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [232, 234, 255];
          }
          if (data.section === 'body' && data.column.index === 4) {
            const grade = data.cell.raw;
            if (grade === 'A+' || grade === 'A') data.cell.styles.textColor = [46, 125, 50];
            else if (grade === 'B+' || grade === 'B') data.cell.styles.textColor = [21, 101, 192];
            else if (grade === 'C') data.cell.styles.textColor = [230, 81, 0];
            else if (grade === 'D') data.cell.styles.textColor = [245, 127, 23];
            else if (grade === 'F') data.cell.styles.textColor = [198, 40, 40];
            data.cell.styles.fontStyle = 'bold';
          }
          if (data.section === 'body' && data.column.index === 5) {
            if (data.cell.raw === 'Pass' || data.cell.raw === 'PASS') data.cell.styles.textColor = [46, 125, 50];
            else if (data.cell.raw === 'Fail' || data.cell.raw === 'FAIL') data.cell.styles.textColor = [198, 40, 40];
            data.cell.styles.fontStyle = 'bold';
          }
        },
      });

      const finalY = doc.lastAutoTable.finalY + 8;

      // Summary Box
      doc.setFillColor(245, 247, 255);
      doc.setDrawColor(200, 200, 220);
      doc.roundedRect(18, finalY, 174, 28, 3, 3, 'FD');

      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Marks: ${totalObtained} / ${totalMax}`, 28, finalY + 10);
      doc.text(`Percentage: ${percentage}%`, 28, finalY + 20);
      doc.text(`Overall Grade: ${overallGrade}`, 105, finalY + 10);

      const resultColor = passStatus === 'PASS' ? [46, 125, 50] : [198, 40, 40];
      doc.setTextColor(...resultColor);
      doc.setFontSize(13);
      doc.text(`Result: ${passStatus}`, 105, finalY + 21);

      // Grade scale note
      doc.setTextColor(130, 130, 130);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Grade: A+ (90%+)  A (80%+)  B+ (70%+)  B (60%+)  C (50%+)  D (40%+)  F (Below 40%)', 105, finalY + 35, { align: 'center' });

      // Signature area
      const sigY = finalY + 48;
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.line(25, sigY, 80, sigY);
      doc.line(130, sigY, 185, sigY);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Class Teacher', 52, sigY + 6, { align: 'center' });
      doc.text('Principal', 157, sigY + 6, { align: 'center' });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('This is a computer-generated report card from S P Anglo Academy.', 105, 282, { align: 'center' });

      doc.save(`Report_Card_${student.rollNumber}_${currentExamType.replace(/\s/g, '_')}_${currentAcademicYear}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Check Results</h1>
        <p>Enter your roll number and date of birth to view your results</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Results</div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          {/* Search Form */}
          <div className="card result-search-card" style={{ borderTop: '4px solid var(--primary)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="result-icon" style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a237e, #3949ab)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.75rem',
              }}>
                <span style={{ fontSize: '1.8rem', filter: 'brightness(0) invert(1)' }}>&#128202;</span>
              </div>
              <h2 style={{ color: 'var(--primary)', margin: '0.25rem 0' }}>Student Result Portal</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>S P Anglo Academy, Noniya</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    placeholder="e.g. LKG-001"
                    required
                    style={{ fontSize: '1rem' }}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    required
                    style={{ fontSize: '1rem' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`btn btn-primary btn-lg${loading ? ' result-loading-btn' : ''}`}
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? <><span className="spinner" /> Searching...</> : 'View My Results'}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="card result-error-card" style={{
              marginTop: '1.5rem', textAlign: 'center', padding: '2rem',
              borderLeft: '4px solid #c62828', background: '#fff5f5',
            }}>
              <span className="error-icon" style={{ fontSize: '2.5rem' }}>&#9888;</span>
              <p style={{ color: '#c62828', marginTop: '0.5rem', fontWeight: 600, fontSize: '1rem' }}>{error}</p>
              <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                If you think this is an error, please contact the school office.
              </p>
            </div>
          )}

          {/* Results Found */}
          {student && results.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>

              {/* ===== REPORT CARD ===== */}
              <div className="card report-card-enter" style={{
                padding: 0, overflow: 'hidden',
                border: '2px solid #1a237e', borderRadius: '12px',
              }}>

                {/* School Header */}
                <div className="report-card-header" style={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
                  color: 'white', textAlign: 'center',
                }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px', margin: 0 }}>
                    S P ANGLO ACADEMY
                  </h1>
                  <p style={{ fontSize: '0.88rem', opacity: 0.85, marginTop: '0.25rem' }}>
                    Noniya, Purba Champaran, Bihar
                  </p>
                  <div style={{
                    width: '60%', height: '2px', margin: '0.75rem auto',
                    background: 'linear-gradient(90deg, transparent, #ff6f00, #ffab00, #ff6f00, transparent)',
                  }} />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.5rem 0 0', letterSpacing: '3px' }}>
                    REPORT CARD
                  </h2>
                </div>

                {/* Exam Info Bar */}
                <div style={{
                  background: '#f5f7ff', padding: '0.6rem 1.5rem',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                  flexWrap: 'wrap',
                }}>
                  {examKeys.length > 1 ? (
                    examKeys.map(key => {
                      const [exam, year] = key.split('||');
                      const isActive = selectedExam === key;
                      return (
                        <button
                          key={key}
                          className="exam-tab-btn"
                          onClick={() => setSelectedExam(key)}
                          style={{
                            padding: '0.35rem 1rem', borderRadius: '20px', border: 'none',
                            cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                            background: isActive ? '#1a237e' : 'white',
                            color: isActive ? 'white' : '#1a237e',
                            boxShadow: isActive ? '0 2px 8px rgba(26,35,126,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          {exam} ({year})
                        </button>
                      );
                    })
                  ) : (
                    <span style={{ fontWeight: 700, color: '#1a237e', fontSize: '0.92rem' }}>
                      {currentExamType} &mdash; Academic Year {currentAcademicYear}
                    </span>
                  )}
                </div>

                {/* Student Info */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e8e8e8', background: '#fafbff' }}>
                  <div className="result-student-info">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#666', minWidth: '95px' }}>Student Name</span>
                      <strong>: {student.firstName} {student.lastName}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#666', minWidth: '95px' }}>Roll Number</span>
                      <strong>: {student.rollNumber}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#666', minWidth: '95px' }}>Class</span>
                      <strong>: {student.className}{student.section ? ` - ${student.section}` : ''}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#666', minWidth: '95px' }}>Date of Birth</span>
                      <strong>: {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : '-'}</strong>
                    </div>
                    {student.guardianName && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: '#666', minWidth: '95px' }}>Father's Name</span>
                        <strong>: {student.guardianName}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Marks Table */}
                {currentResults.length > 0 && (
                  <div className="report-card-body">
                    <div className="result-table-wrap">
                    <table style={{
                      width: '100%', borderCollapse: 'collapse',
                      fontSize: '0.9rem', minWidth: '500px',
                    }}>
                      <thead>
                        <tr style={{ background: '#1a237e' }}>
                          <th style={{ padding: '0.7rem 0.5rem', color: 'white', textAlign: 'center', width: '50px', fontWeight: 700 }}>S.No</th>
                          <th style={{ padding: '0.7rem 0.75rem', color: 'white', textAlign: 'left', fontWeight: 700 }}>Subject</th>
                          <th style={{ padding: '0.7rem 0.5rem', color: 'white', textAlign: 'center', fontWeight: 700 }}>Marks</th>
                          <th style={{ padding: '0.7rem 0.5rem', color: 'white', textAlign: 'center', fontWeight: 700 }}>Out Of</th>
                          <th style={{ padding: '0.7rem 0.5rem', color: 'white', textAlign: 'center', fontWeight: 700 }}>Grade</th>
                          <th style={{ padding: '0.7rem 0.5rem', color: 'white', textAlign: 'center', fontWeight: 700 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentResults.map((r, i) => (
                          <tr key={r.id} className="result-table-row" style={{
                            background: i % 2 === 0 ? 'white' : '#f8f9ff',
                            borderBottom: '1px solid #e8e8e8',
                          }}>
                            <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', color: '#888' }}>{i + 1}</td>
                            <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{r.subject}</td>
                            <td style={{
                              padding: '0.65rem 0.5rem', textAlign: 'center',
                              fontWeight: 800, fontSize: '1rem',
                              color: r.marksObtained >= 33 ? '#2e7d32' : '#c62828',
                            }}>
                              {r.marksObtained}
                            </td>
                            <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', color: '#666' }}>{r.totalMarks}</td>
                            <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block', padding: '0.15rem 0.6rem',
                                borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem',
                                background: getGradeBg(r.grade),
                                color: getGradeColor(r.grade),
                              }}>
                                {r.grade}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                              <span style={{
                                fontWeight: 700, fontSize: '0.8rem',
                                color: r.marksObtained >= 33 ? '#2e7d32' : '#c62828',
                              }}>
                                {r.marksObtained >= 33 ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {/* Total Row */}
                        <tr className="result-total-row" style={{
                          background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
                          borderTop: '2px solid #1a237e',
                        }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}></td>
                          <td style={{ padding: '0.75rem 0.75rem', fontWeight: 800, fontSize: '0.95rem', color: '#1a237e' }}>TOTAL</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#1a237e' }}>{totalObtained}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: 700, color: '#444' }}>{totalMax}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block', padding: '0.2rem 0.7rem',
                              borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem',
                              background: getGradeBg(overallGrade),
                              color: getGradeColor(overallGrade),
                            }}>
                              {overallGrade}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <span style={{
                              fontWeight: 800, fontSize: '0.9rem',
                              color: passStatus === 'PASS' ? '#1b5e20' : '#b71c1c',
                            }}>
                              {passStatus}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>

                    {/* Result Summary */}
                    <div className="result-summary-grid">
                      <div className="summary-card" style={{
                        textAlign: 'center', padding: '1rem 0.5rem', borderRadius: '10px',
                        background: '#e3f2fd', border: '1px solid #bbdefb',
                      }}>
                        <div className="num" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1565c0' }}>{currentResults.length}</div>
                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.15rem' }}>Subjects</div>
                      </div>
                      <div className="summary-card" style={{
                        textAlign: 'center', padding: '1rem 0.5rem', borderRadius: '10px',
                        background: '#e8f5e9', border: '1px solid #c8e6c9',
                      }}>
                        <div className="num" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2e7d32' }}>{totalObtained}/{totalMax}</div>
                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.15rem' }}>Total Marks</div>
                      </div>
                      <div className="summary-card" style={{
                        textAlign: 'center', padding: '1rem 0.5rem', borderRadius: '10px',
                        background: percentage >= 60 ? '#e8f5e9' : percentage >= 33 ? '#fff3e0' : '#fce4ec',
                        border: `1px solid ${percentage >= 60 ? '#c8e6c9' : percentage >= 33 ? '#ffe0b2' : '#f8bbd0'}`,
                      }}>
                        <div className="num" style={{
                          fontSize: '1.4rem', fontWeight: 900,
                          color: percentage >= 60 ? '#2e7d32' : percentage >= 33 ? '#e65100' : '#c62828',
                        }}>{percentage}%</div>
                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.15rem' }}>Percentage</div>
                      </div>
                      <div className="summary-card" style={{
                        textAlign: 'center', padding: '1rem 0.5rem', borderRadius: '10px',
                        background: passStatus === 'PASS'
                          ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)'
                          : 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
                        border: `1px solid ${passStatus === 'PASS' ? '#a5d6a7' : '#ef9a9a'}`,
                      }}>
                        <div className="num" style={{
                          fontSize: '1.4rem', fontWeight: 900,
                          color: passStatus === 'PASS' ? '#1b5e20' : '#b71c1c',
                        }}>{passStatus}</div>
                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.15rem' }}>Result</div>
                      </div>
                    </div>

                    {/* Grade Scale */}
                    <div className="grade-scale-bar" style={{
                      marginTop: '1rem', padding: '0.6rem 1rem', background: '#f5f5f5',
                      borderRadius: '8px', fontSize: '0.75rem', color: '#888', textAlign: 'center',
                    }}>
                      <strong>Grade Scale:</strong> A+ (90%+) | A (80%+) | B+ (70%+) | B (60%+) | C (50%+) | D (40%+) | F (Below 40%)
                    </div>

                    {/* Download Button */}
                    <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingBottom: '0.5rem' }}>
                      <button onClick={downloadPDF} className="result-download-btn">
                        <span className="dl-icon" style={{ fontSize: '1.1rem' }}>&#128196;</span>
                        Download Report Card (PDF)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Student found but no results */}
          {searched && !loading && !error && student && results.length === 0 && (
            <div className="card result-no-data" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '2.5rem' }}>
              <span className="no-data-icon" style={{ fontSize: '3rem' }}>&#128196;</span>
              <h3 style={{ color: '#555', marginTop: '0.75rem' }}>No Results Published Yet</h3>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>
                Results for <strong>{student.firstName} {student.lastName}</strong> ({student.rollNumber}) have not been published yet.
                <br />Please check back later or contact the school office.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
