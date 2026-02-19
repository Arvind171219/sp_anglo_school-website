import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3>S P Anglo Academy</h3>
          <p>
            Providing quality Hindi-medium education from Pre-Primary to Class 8 since 2011.
            Located in Noniya village, Paharpur block, Purba Champaran, Bihar.
            Building strong foundations for rural children's bright futures.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', opacity: 0.5 }}>
            UDISE Code: 10021700117
          </p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <Link to="/about">About Us</Link>
          <Link to="/academics">Academics</Link>
          <Link to="/admissions">Admissions</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/activities">Activities</Link>
          <Link to="/faculty">Our Teachers</Link>
        </div>

        <div className="footer-col">
          <h3>Resources</h3>
          <Link to="/announcements">Announcements</Link>
          <Link to="/login">Student Portal</Link>
          <Link to="/login">Admin Login</Link>
          <Link to="/contact">Contact Us</Link>
          <a href="#">Academic Calendar</a>
          <a href="#">Results</a>
        </div>

        <div className="footer-col">
          <h3>Contact Info</h3>
          <div className="footer-contact-item">
            <span className="fc-icon">&#128205;</span>
            <span>Noniya, Paharpur, Purba Champaran, Bihar</span>
          </div>
          <div className="footer-contact-item">
            <span className="fc-icon">&#128222;</span>
            <span>Contact the school office</span>
          </div>
          <div className="footer-contact-item">
            <span className="fc-icon">&#9993;</span>
            <span>spangloacademy@gmail.com</span>
          </div>
          <div className="footer-contact-item">
            <span className="fc-icon">&#128338;</span>
            <span>Mon - Sat: 8:00 AM - 2:00 PM</span>
          </div>
          <div className="footer-contact-item">
            <span className="fc-icon">&#128197;</span>
            <span>Academic Session: April - March</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} S P Anglo Academy, Noniya. All rights reserved.</span>
        <span>Purba Champaran, Bihar</span>
      </div>
    </footer>
  );
}
