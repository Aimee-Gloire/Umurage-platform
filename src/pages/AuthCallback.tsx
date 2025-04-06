import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSession } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/';

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // Check the session and update auth state
          await checkSession();

          // Get the user's role from the auth store
          const user = useAuthStore.getState().user;
          
          // Redirect based on role
          if (user?.role === 'student') {
            navigate('/student/dashboard');
          } else if (user?.role === 'teacher') {
            navigate('/teacher/dashboard');
          } else {
            navigate(next);
          }
        } catch (error) {
          console.error('Error during auth callback:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, checkSession]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white">Completing authentication...</p>
      </div>
    </div>
  );
} 