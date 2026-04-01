import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from './pages/Public/Home';
// Auth Module Pages
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import FAQs from './pages/Public/FAQs';
import HowToApply from './pages/Public/HowToApply';
import MoreInfo from './pages/Public/MoreInfo';
import Openings from './pages/Public/Openings';
import Contact from './pages/Public/Contact';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import Profile from './pages/Student/Profile';
import MyApplications from './pages/Student/MyApplications';
import ApplicationForm from './pages/Student/ApplicationForm';

// Admin Pages
import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Admissions from './pages/Admin/Admissions';
import AuditResults from './pages/Admin/AuditResults';
import Templates from './pages/Admin/Templates';
import Faculties from './pages/Admin/Faculties';
// Faculty Pages
import FacultyLayout from './modules/faculty/components/FacultyLayout';
import FacultyDashboard from './modules/faculty/pages/FacultyDashboard';
import CreateOpening from './modules/faculty/pages/CreateOpening';
import MyOpenings from './modules/faculty/pages/MyOpenings';
import Applicants from './modules/faculty/pages/Applicants';
import FilterSortApplicants from './modules/faculty/pages/FilterSortApplicants';
import ShortlistedCandidates from './modules/faculty/pages/ShortlistedCandidates';
import FinalRecommendations from './modules/faculty/pages/FinalRecommendations';
import FacultyProfile from './modules/faculty/pages/FacultyProfile';

export default function App() {
  const location = useLocation();
  // Faculty and Admin have their own navbars – hide the global header/footer for them
  const hideGlobalNav = location.pathname.startsWith('/faculty') || location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="app-root">
        {!hideGlobalNav && <Header />}
        <main style={{ padding: hideGlobalNav ? '0' : '20px', minHeight: '80vh' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/how-to-apply" element={<HowToApply />} />
            <Route path="/more-info" element={<MoreInfo />} />
            <Route path="/openings" element={<Openings />} />
            <Route path="/contact" element={<Contact />} />

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/student/applications" element={
              <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
                <MyApplications />
              </ProtectedRoute>
            } />
            <Route path="/student/apply/:id" element={
              <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
                <ApplicationForm />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="admissions" element={<Admissions />} />
              <Route path="audit" element={<AuditResults />} />
              <Route path="faculties" element={<Faculties />} />
              <Route path="send-mail" element={<div>Send Mail</div>} />
              <Route path="templates" element={<Templates />} />
              <Route path="profile" element={<Profile />} />
              <Route path="how-to-use" element={<div>How to Use</div>} />
              <Route path="archive" element={<div>Archive</div>} />
            </Route>

            {/* Faculty Routes */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['faculty', 'admin', 'superadmin']}>
                <FacultyLayout />
              </ProtectedRoute>
            }>
              <Route index element={<FacultyDashboard />} />
              <Route path="openings" element={<MyOpenings />} />
              <Route path="openings/create" element={<CreateOpening />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="applicants/filter" element={<FilterSortApplicants />} />
              <Route path="shortlisted" element={<ShortlistedCandidates />} />
              <Route path="recommendations" element={<FinalRecommendations />} />
              <Route path="profile" element={<FacultyProfile />} />
              {/* Add remaining Faculty Module sub-routes here later */}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        {!hideGlobalNav && <Footer />}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </AuthProvider>
  );
}
