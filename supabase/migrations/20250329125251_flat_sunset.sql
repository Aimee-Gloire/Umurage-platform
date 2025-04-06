/*
  # Create teacher-related tables

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `courses`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references teachers)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `status` (enum: draft, published, archived)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `lessons`
      - `id` (uuid, primary key)
      - `module_id` (uuid, references modules)
      - `title` (text)
      - `content` (text)
      - `type` (enum: video, reading, quiz)
      - `duration` (integer, in minutes)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for teachers to manage their own data
    - Add policies for students to read published courses
*/

-- Create enum types
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lesson_type AS ENUM ('video', 'reading', 'quiz');

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  status course_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  type lesson_type NOT NULL,
  duration integer, -- in minutes
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Policies for teachers table
CREATE POLICY "Teachers can view their own profile"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can update their own profile"
  ON teachers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for courses table
CREATE POLICY "Teachers can manage their own courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view published courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Policies for modules table
CREATE POLICY "Teachers can manage their own modules"
  ON modules
  FOR ALL
  TO authenticated
  USING (course_id IN (
    SELECT id FROM courses 
    WHERE teacher_id IN (
      SELECT id FROM teachers WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Anyone can view modules of published courses"
  ON modules
  FOR SELECT
  TO authenticated
  USING (course_id IN (
    SELECT id FROM courses WHERE status = 'published'
  ));

-- Policies for lessons table
CREATE POLICY "Teachers can manage their own lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING (module_id IN (
    SELECT id FROM modules 
    WHERE course_id IN (
      SELECT id FROM courses 
      WHERE teacher_id IN (
        SELECT id FROM teachers WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (module_id IN (
    SELECT id FROM modules 
    WHERE course_id IN (
      SELECT id FROM courses WHERE status = 'published'
    )
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS teachers_user_id_idx ON teachers(user_id);
CREATE INDEX IF NOT EXISTS courses_teacher_id_idx ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS courses_status_idx ON courses(status);
CREATE INDEX IF NOT EXISTS modules_course_id_idx ON modules(course_id);
CREATE INDEX IF NOT EXISTS modules_order_idx ON modules("order");
CREATE INDEX IF NOT EXISTS lessons_module_id_idx ON lessons(module_id);
CREATE INDEX IF NOT EXISTS lessons_order_idx ON lessons("order");