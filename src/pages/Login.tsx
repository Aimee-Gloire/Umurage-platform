import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRound, School, KeyRound, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/auth';

type AuthMode = 'login' | 'signup' | 'reset';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Validate email and password
        if (!email || !password) {
          toast.error('Please enter both email and password');
          return;
        }

        console.log('Attempting login with:', { email, password }); // Debug log
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Sign in error:', error); // Debug log
          toast.error(typeof error === 'string' ? error : 'Failed to sign in');
          return;
        }
        
        // Wait for the user state to be updated
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = useAuthStore.getState().user;
        console.log('Login - User state:', user); // Debug log

        if (!user) {
          toast.error('Failed to get user information');
          return;
        }

        toast.success('Successfully signed in!');
        // Let the AppRoutes component handle navigation
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success('Account created successfully!');
        // Navigate based on role instead of going back to login screen
        navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
      } else if (mode === 'reset') {
        // Handle password reset
        toast.success('Password reset instructions have been sent to your email.');
        setMode('login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h1>
            <p className="mt-2 text-gray-600">
              {mode === 'login' 
                ? 'Sign in to continue learning'
                : mode === 'signup'
                ? 'Join our learning platform'
                : 'Enter your email to reset your password'}
            </p>
            {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          </div>

          {mode !== 'reset' && (
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole('student')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                role === 'student'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <School size={20} />
              <span>Student</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                role === 'teacher'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <UserRound size={20} />
              <span>Teacher</span>
            </motion.button>
          </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition"
                    required
                    placeholder="John Doe"
                  />
                  <UserRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition"
                required
                placeholder="student@example.com"
              />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition"
                  required
                    placeholder="••••••••"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || loading}
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
            >
              {isLoading || loading
                ? 'Processing...' 
                : mode === 'login' 
                  ? 'Sign In'
                  : mode === 'signup'
                    ? 'Create Account'
                    : 'Reset Password'}
            </motion.button>
            
            {mode === 'login' && (
              <>
                {/* Quick login buttons removed */}
              </>
            )}
          </form>

          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-black font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-sm text-gray-600">
                  <button
                    onClick={() => setMode('reset')}
                    className="text-black font-medium hover:underline"
                  >
                    Forgot your password?
                  </button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-black font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-black font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}