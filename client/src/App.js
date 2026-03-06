import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Public/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyOTP from './pages/Auth/VerifyOTP';
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
import AdminDashboard from './pages/Admin/AdminDashboard';
// Faculty Pages
import FacultyDashboard from './pages/Faculty/FacultyDashboard';

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <main style={{ padding: '20px', minHeight: '80vh' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
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
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Faculty Routes */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['faculty', 'admin', 'superadmin']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
