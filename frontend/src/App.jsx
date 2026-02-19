import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Gallery from './pages/Gallery';
import Activities from './pages/Activities';
import Faculty from './pages/Faculty';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import CheckResults from './pages/CheckResults';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageResults from './pages/admin/ManageResults';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageTeachers from './pages/admin/ManageTeachers';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>Loading...</div>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<><Home /><Footer /></>} />
        <Route path="/about" element={<><About /><Footer /></>} />
        <Route path="/academics" element={<><Academics /><Footer /></>} />
        <Route path="/admissions" element={<><Admissions /><Footer /></>} />
        <Route path="/gallery" element={<><Gallery /><Footer /></>} />
        <Route path="/activities" element={<><Activities /><Footer /></>} />
        <Route path="/faculty" element={<><Faculty /><Footer /></>} />
        <Route path="/contact" element={<><Contact /><Footer /></>} />
        <Route path="/announcements" element={<><Announcements /><Footer /></>} />
        <Route path="/results" element={<><CheckResults /><Footer /></>} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><div style={{ marginTop: '72px', padding: '2rem', maxWidth: '1200px', margin: '72px auto 0' }}><AdminDashboard /></div></ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute><div style={{ marginTop: '72px', padding: '2rem', maxWidth: '1200px', margin: '72px auto 0' }}><ManageStudents /></div></ProtectedRoute>
        } />
        <Route path="/admin/results" element={
          <ProtectedRoute><div style={{ marginTop: '72px', padding: '2rem', maxWidth: '1200px', margin: '72px auto 0' }}><ManageResults /></div></ProtectedRoute>
        } />
        <Route path="/admin/teachers" element={
          <ProtectedRoute><div style={{ marginTop: '72px', padding: '2rem', maxWidth: '1200px', margin: '72px auto 0' }}><ManageTeachers /></div></ProtectedRoute>
        } />
        <Route path="/admin/announcements" element={
          <ProtectedRoute><div style={{ marginTop: '72px', padding: '2rem', maxWidth: '1200px', margin: '72px auto 0' }}><ManageAnnouncements /></div></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <WhatsAppButton />
    </div>
  );
}
