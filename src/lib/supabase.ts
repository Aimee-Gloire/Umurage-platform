import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, metadata: { role: 'student' | 'teacher' }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helper functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*');
  if (error) throw error;
  return data;
};

export const getEnrollments = async (userId: string) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('student_id', userId);
  if (error) throw error;
  return data;
};

export const enrollInCourse = async (studentId: string, courseId: string) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert([
      {
        student_id: studentId,
        course_id: courseId,
        status: 'active'
      }
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const createCourse = async (courseData: any) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([courseData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCourse = async (courseId: string, updates: any) => {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteCourse = async (courseId: string) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);
  if (error) throw error;
};

// Course functions
export const getCourseById = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        profiles:instructor_id (
          full_name,
          avatar_url
        ),
        lessons (
          *,
          quizzes (*)
        )
      `)
      .eq('id', courseId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get course error:', error);
    throw error;
  }
};

// Lesson functions
export const getLessonById = async (lessonId: string) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        quizzes (*)
      `)
      .eq('id', lessonId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get lesson error:', error);
    throw error;
  }
};

export const createLesson = async (lesson: Database['public']['Tables']['lessons']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create lesson error:', error);
    throw error;
  }
};

// Progress tracking functions
export const updateLessonProgress = async (
  studentId: string,
  lessonId: string,
  completed: boolean
) => {
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        student_id: studentId,
        lesson_id: lessonId,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update lesson progress error:', error);
    throw error;
  }
};

// Quiz functions
export const submitQuizAttempt = async (
  studentId: string,
  quizId: string,
  answers: Json,
  score: number,
  passed: boolean
) => {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        student_id: studentId,
        quiz_id: quizId,
        answers,
        score,
        passed
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    throw error;
  }
};

export const getQuizAttempts = async (studentId: string, quizId: string) => {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    throw error;
  }
};

// Test connection and database access
export const testDatabaseConnection = async () => {
  try {
    // Test profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) throw profilesError;

    // Test courses table
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('count')
      .limit(1);
    
    if (coursesError) throw coursesError;

    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};