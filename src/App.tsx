import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { testDatabaseConnection } from './lib/supabase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';

// Use lazy loading to make sure module loading errors don't crash the app
const StudentLayout = lazy(() => import('./layouts/StudentLayout'));
const TeacherLayout = lazy(() => import('./layouts/TeacherLayout'));
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StudentCourses = lazy(() => import('./pages/student/Courses'));
const CourseView = lazy(() => import('./pages/student/CourseView'));
const LessonView = lazy(() => import('./pages/student/LessonView'));
const Quiz = lazy(() => import('./pages/student/Quiz'));
const Assignments = lazy(() => import('./pages/student/Assignments'));
const Certificate = lazy(() => import('./pages/student/Certificate'));
const Analytics = lazy(() => import('./pages/student/Analytics'));
const Discussions = lazy(() => import('./pages/student/Discussions'));
const Profile = lazy(() => import('./pages/student/Profile'));
const Settings = lazy(() => import('./pages/student/Settings'));
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'));
const TeacherCourses = lazy(() => import('./pages/teacher/Courses'));
const TeacherAssignments = lazy(() => import('./pages/teacher/Assignments'));
const TeacherStudents = lazy(() => import('./pages/teacher/Students'));
const TeacherAnalytics = lazy(() => import('./pages/teacher/Analytics'));
const TeacherDiscussions = lazy(() => import('./pages/teacher/Discussions'));
const TeacherProfile = lazy(() => import('./pages/teacher/Profile'));
const TeacherSettings = lazy(() => import('./pages/teacher/Settings'));

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-6 max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">We encountered an error loading this page. Please try refreshing.</p>
            <button 
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppRoutes() {
  const { user, profile, loading } = useAuthContext();
  const [isInitialized, setIsInitialized] = React.useState(false);
  const navigate = useNavigate();

  // Add console logging for debugging
  console.log('AppRoutes - Auth State:', { user, profile, loading });
  console.log('AppRoutes - Current Path:', window.location.pathname);

  // Handle initial loading state
  React.useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
        console.log('AppRoutes - Initialization complete');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Handle navigation based on auth state
  React.useEffect(() => {
    if (isInitialized && !loading && user) {
      const currentPath = window.location.pathname;
      const targetPath = user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard';
      
      console.log('AppRoutes - Navigation check:', { currentPath, targetPath, userRole: user.role });
      
      // Only navigate if we're at the root or login page
      if (currentPath === '/' || currentPath === '/login') {
        console.log('AppRoutes - Navigating to dashboard:', targetPath);
        navigate(targetPath, { replace: true });
      }
    }
  }, [user, loading, isInitialized, navigate]);

  if (loading || !isInitialized) {
    return <LoadingComponent />;
  }

  return (
      <AnimatePresence mode="wait">
      <ErrorBoundary>
        <Suspense fallback={<LoadingComponent />}>
        <Routes>
          <Route 
            path="/" 
            element={
              !user ? (
                <Landing />
              ) : (
                <Navigate 
                    to={user?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'} 
                  replace 
                />
              )
            } 
          />
          
          <Route 
            path="/login" 
            element={
              !user ? (
                <Login />
              ) : (
                <Navigate 
                    to={user?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'} 
                  replace 
                />
              )
            } 
          />

            {/* Auth Callback Route */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Teacher Routes */}
            <Route
              path="/teacher/*"
              element={
                user?.role === 'teacher' ? (
                  <TeacherLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses" element={<TeacherCourses />} />
              <Route path="students" element={<TeacherStudents />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="analytics" element={<TeacherAnalytics />} />
              <Route path="discussions" element={<TeacherDiscussions />} />
              <Route path="profile" element={<TeacherProfile />} />
              <Route path="settings" element={<TeacherSettings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          
          {/* Student Routes */}
            <Route
              path="/student/*"
              element={
                user?.role === 'student' ? (
                  <StudentLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="courses/:courseId" element={<CourseView />} />
            <Route path="courses/:courseId/lessons/:lessonId" element={<LessonView />} />
            <Route path="courses/:courseId/quiz/:quizId" element={<Quiz />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="certificates" element={<Certificate />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="discussions" element={<Discussions />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

            {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </ErrorBoundary>
      </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    // Initialize course store
    const initializeApp = async () => {
      try {
        // Test database connection on app start
        const success = await testDatabaseConnection();
        if (success) {
          toast.success('Connected to database successfully!');
        } else {
          toast.error('Failed to connect to database. Please check your configuration.');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        toast.error('Application initialization error. Please refresh the page.');
      }
    };

    initializeApp();
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <AuthProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;