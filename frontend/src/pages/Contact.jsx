import { useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Contact() {
  useScrollAnimation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Reach out to S P Anglo Academy, Noniya</p>
        <div className="breadcrumb"><Link to="/">Home</Link> / Contact</div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 800 }}>
                Get in Touch
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                Have questions about admissions, academics, or anything else? Visit our school
                campus or reach out to us. We'd love to hear from you.
              </p>

              {[
                { icon: '&#128205;', title: 'School Address', desc: 'Noniya, Paharpur Block, Purba Champaran District, Bihar' },
                { icon: '&#127968;', title: 'Cluster', desc: 'GMS Nonea, Paharpur' },
                { icon: '&#9993;', title: 'Email', desc: 'spangloacademy@gmail.com' },
                { icon: '&#128338;', title: 'School Hours', desc: 'Monday - Saturday: 8:00 AM - 2:00 PM' },
                { icon: '&#128197;', title: 'Academic Session', desc: 'April to March (Admissions open Jan-Mar)' },
                { icon: '&#128196;', title: 'UDISE Code', desc: '10021700117' },
              ].map((c, i) => (
                <div className={`contact-info-card animate-on-scroll animate-delay-${i + 1}`} key={i}>
                  <div className="ci-icon" dangerouslySetInnerHTML={{ __html: c.icon }} />
                  <div>
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-form animate-on-scroll animate-delay-2">
              <h3>Send Us a Message</h3>

              {sent && <div className="alert alert-success">Thank you! Your message has been sent successfully.</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email (optional)</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Select a subject</option>
                    <option value="admission">Admission Inquiry</option>
                    <option value="academic">Academic Query</option>
                    <option value="fee">Fee Related</option>
                    <option value="tc">Transfer Certificate</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows="5" placeholder="Write your message here..." />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Find Us on Map</h2>
            <p>S P Anglo Academy, Noniya - Paharpur, Purba Champaran, Bihar</p>
          </div>
          <div className="contact-map animate-on-scroll">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57100!2d84.75!3d26.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39930e!2sPaharpur%2C+Purba+Champaran%2C+Bihar!5e0!3m2!1sen!2sin!4v1700000000000"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="S P Anglo Academy Location"
            />
          </div>
          <div className="animate-on-scroll" style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '2rem' }}>&#128506;</span>
            <p style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.5rem' }}>How to Reach Us</p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
              Located in Noniya village, Paharpur block. Accessible via all-weather road.
              Ask for S P Anglo Academy at Noniya village.
            </p>
          </div>
        </div>
      </section>

      {/* Nearby Reference */}
      <section className="section" style={{ background: 'white', paddingTop: 0 }}>
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Nearby Landmarks & Schools</h2>
            <p>Schools and villages near S P Anglo Academy, Noniya</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {[
              'GMS Chatia', 'GMS Dubaha', 'GMS Dubey Tola', 'GMS Malahi Boys',
              'GMS Manguraha', 'GMS Nauadih', 'GMS Nonea', 'GMS Paharpur Boys',
              'GMS Pakadia', 'GMS Sareya Bajar', 'GMS Siswa Bajar'
            ].map((name, i) => (
              <span key={i} style={{
                padding: '0.4rem 1rem',
                background: 'var(--bg)',
                borderRadius: '20px',
                fontSize: '0.85rem',
                color: 'var(--text-light)',
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Visit Our Campus</h2>
          <p>Come see our facilities and meet our teachers in person</p>
          <Link to="/admissions" className="btn btn-accent btn-lg">Apply for Admission</Link>
        </div>
      </section>
    </div>
  );
}
