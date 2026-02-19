import axios from 'axios';

// In production (Vercel), VITE_API_URL points to Render backend. In dev, proxy handles /api.
const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth (admin only)
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Students (admin)
export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Results (admin for CRUD, public for lookup by roll+dob)
// Use plain axios for public lookup (no auth token/interceptor needed)
export const lookupResults = (rollNumber, dob) => axios.get(`${API_BASE}/results/lookup?rollNumber=${encodeURIComponent(rollNumber)}&dob=${encodeURIComponent(dob)}`);
export const getResultsByStudent = (studentId) => api.get(`/results/student/${studentId}`);
export const getAllResults = () => api.get('/results/admin/all');
export const addResult = (data) => api.post('/results', data);
export const updateResult = (id, data) => api.put(`/results/${id}`, data);
export const deleteResult = (id) => api.delete(`/results/${id}`);
export const saveStudentExamResults = (studentId, examType, academicYear, results) =>
  api.post('/results/admin/save', { studentId, examType, academicYear, results });

// Teachers (public GET, admin CRUD)
export const getTeachers = () => api.get('/teachers');
export const createTeacher = (data) => api.post('/teachers', data);
export const updateTeacher = (id, data) => api.put(`/teachers/${id}`, data);
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`);

// Announcements (admin for CRUD, public for GET)
export const getAnnouncements = () => api.get('/announcements');
export const createAnnouncement = (data) => api.post('/announcements', data);
export const updateAnnouncement = (id, data) => api.put(`/announcements/${id}`, data);
export const deleteAnnouncement = (id) => api.delete(`/announcements/${id}`);

export default api;
