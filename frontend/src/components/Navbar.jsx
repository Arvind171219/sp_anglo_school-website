import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <div className="brand-icon">&#127891;</div>
            S P Anglo Academy
          </Link>

          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            <NavLink to="/academics" onClick={closeMenu}>Academics</NavLink>
            <NavLink to="/gallery" onClick={closeMenu}>Gallery</NavLink>
            <NavLink to="/activities" onClick={closeMenu}>Activities</NavLink>
            <NavLink to="/faculty" onClick={closeMenu}>Faculty</NavLink>
            <NavLink to="/announcements" onClick={closeMenu}>News</NavLink>
            <NavLink to="/results" onClick={closeMenu}>Results</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

            {user ? (
              <>
                <NavLink to="/admin/dashboard" onClick={closeMenu}>Dashboard</NavLink>
                <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <NavLink to="/login" className="nav-login-btn" onClick={closeMenu}>Login</NavLink>
            )}
          </div>
        </div>
      </nav>
      <div className={`mobile-overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu} />
    </>
  );
}
