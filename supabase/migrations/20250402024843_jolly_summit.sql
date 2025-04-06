/*
  # Add Cultural Archive & Storytelling Features

  1. New Tables
    - `stories`
      - Cultural stories and folktales
      - Support for text content
      - Categorization and metadata
      - Moderation status tracking
    
    - `artifacts`
      - Historical records and cultural artifacts
      - Metadata and descriptions
      - Categorization support
    
    - `categories`
      - Hierarchical categories for stories and artifacts
      - Support for themes, time periods, and regions
    
    - `comments`
      - User comments on stories and artifacts
      - Support for threaded discussions
    
    - `likes`
      - Track user likes on stories and artifacts
    
    - `story_contributions`
      - Track user-submitted stories
      - Moderation workflow
    
    - `timelines`
      - Historical events and timelines
      - Support for cultural milestones

  2. Security
    - Enable RLS on all tables
    - Add policies for content access and moderation
*/

-- Create enum types
CREATE TYPE content_status AS ENUM ('draft', 'pending', 'published', 'rejected');
CREATE TYPE content_type AS ENUM ('story', 'artifact', 'timeline');
CREATE TYPE category_type AS ENUM ('theme', 'period', 'region');

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type category_type NOT NULL,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users NOT NULL,
  category_id uuid REFERENCES categories NOT NULL,
  status content_status DEFAULT 'pending',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  source text,
  region text,
  time_period text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  moderated_by uuid REFERENCES auth.users,
  moderated_at timestamptz
);

-- Create artifacts table
CREATE TABLE artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES categories NOT NULL,
  contributor_id uuid REFERENCES auth.users NOT NULL,
  status content_status DEFAULT 'pending',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  source text,
  origin text,
  date_period text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  moderated_by uuid REFERENCES auth.users,
  moderated_at timestamptz
);

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  parent_id uuid REFERENCES comments(id),
  content_type content_type NOT NULL,
  content_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT content_reference CHECK (
    (content_type = 'story' AND content_id IN (SELECT id FROM stories)) OR
    (content_type = 'artifact' AND content_id IN (SELECT id FROM artifacts))
  )
);

-- Create likes table
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content_type content_type NOT NULL,
  content_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, content_id),
  CONSTRAINT content_reference CHECK (
    (content_type = 'story' AND content_id IN (SELECT id FROM stories)) OR
    (content_type = 'artifact' AND content_id IN (SELECT id FROM artifacts))
  )
);

-- Create story contributions table
CREATE TABLE story_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  contributor_id uuid REFERENCES auth.users NOT NULL,
  status content_status DEFAULT 'pending',
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users,
  reviewed_at timestamptz
);

-- Create timelines table
CREATE TABLE timelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  created_by uuid REFERENCES auth.users NOT NULL,
  status content_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create timeline events table
CREATE TABLE timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timeline_id uuid REFERENCES timelines NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  importance integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only administrators can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM teachers
      WHERE role = 'admin'
    )
  );

-- Stories policies
CREATE POLICY "Published stories are viewable by everyone"
  ON stories FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Users can view their own stories"
  ON stories FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can create stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Artifacts policies
CREATE POLICY "Published artifacts are viewable by everyone"
  ON artifacts FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Users can view their own artifacts"
  ON artifacts FOR SELECT
  TO authenticated
  USING (contributor_id = auth.uid());

CREATE POLICY "Users can create artifacts"
  ON artifacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = contributor_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON likes FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Story contributions policies
CREATE POLICY "Users can view their own contributions"
  ON story_contributions FOR SELECT
  TO authenticated
  USING (contributor_id = auth.uid());

CREATE POLICY "Users can create contributions"
  ON story_contributions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = contributor_id);

-- Timelines policies
CREATE POLICY "Published timelines are viewable by everyone"
  ON timelines FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Users can view their own timelines"
  ON timelines FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX stories_category_id_idx ON stories(category_id);
CREATE INDEX stories_status_idx ON stories(status);
CREATE INDEX artifacts_category_id_idx ON artifacts(category_id);
CREATE INDEX artifacts_status_idx ON artifacts(status);
CREATE INDEX comments_content_type_id_idx ON comments(content_type, content_id);
CREATE INDEX likes_content_type_id_idx ON likes(content_type, content_id);
CREATE INDEX timeline_events_timeline_id_idx ON timeline_events(timeline_id);
CREATE INDEX timeline_events_date_idx ON timeline_events(event_date);

-- Add trigger to update stories likes count
CREATE OR REPLACE FUNCTION update_stories_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.content_type = 'story' THEN
    UPDATE stories SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_OP = 'DELETE' AND OLD.content_type = 'story' THEN
    UPDATE stories SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_likes_count_trigger
AFTER INSERT OR DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION update_stories_likes_count();

-- Add trigger to update stories comments count
CREATE OR REPLACE FUNCTION update_stories_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.content_type = 'story' THEN
    UPDATE stories SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_OP = 'DELETE' AND OLD.content_type = 'story' THEN
    UPDATE stories SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_comments_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_stories_comments_count();