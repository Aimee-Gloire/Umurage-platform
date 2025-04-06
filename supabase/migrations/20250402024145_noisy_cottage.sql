/*
  # Add demo users and profiles

  1. New Data
    - Create demo student user
    - Create demo teacher user
    - Add corresponding profiles in students/teachers tables
  
  2. Changes
    - Insert demo users into auth.users
    - Insert profiles into students and teachers tables
*/

-- Create demo student user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at
) VALUES (
  'demo-student-id',
  'student@example.com',
  crypt('password', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"student"}',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create demo teacher user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at
) VALUES (
  'demo-teacher-id',
  'teacher@example.com',
  crypt('password', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"teacher"}',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create student profile
INSERT INTO students (
  id,
  user_id,
  name,
  bio,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'demo-student-id',
  'John Student',
  'Computer Science student passionate about web development and machine learning.',
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Create teacher profile
INSERT INTO teachers (
  id,
  user_id,
  name,
  bio,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'demo-teacher-id',
  'Dr. Smith',
  'Experienced computer science professor with a passion for teaching and research in web development and artificial intelligence.',
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;