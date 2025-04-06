export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          role: 'student' | 'teacher'
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name: string
          role: 'student' | 'teacher'
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          role?: 'student' | 'teacher'
          avatar_url?: string | null
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          instructor_id: string
          price: number
          published: boolean
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          instructor_id: string
          price: number
          published?: boolean
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          instructor_id?: string
          price?: number
          published?: boolean
          thumbnail_url?: string | null
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          created_at: string
          course_id: string
          title: string
          content: string
          order: number
          duration: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          course_id: string
          title: string
          content: string
          order: number
          duration?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          course_id?: string
          title?: string
          content?: string
          order?: number
          duration?: number | null
          updated_at?: string | null
        }
      }
      enrollments: {
        Row: {
          id: string
          created_at: string
          student_id: string
          course_id: string
          status: 'active' | 'completed' | 'dropped'
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          student_id: string
          course_id: string
          status?: 'active' | 'completed' | 'dropped'
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          student_id?: string
          course_id?: string
          status?: 'active' | 'completed' | 'dropped'
          updated_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          created_at: string
          student_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          student_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          student_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
          updated_at?: string | null
        }
      }
      quizzes: {
        Row: {
          id: string
          created_at: string
          lesson_id: string
          title: string
          questions: Json
          passing_score: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          lesson_id: string
          title: string
          questions: Json
          passing_score: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          lesson_id?: string
          title?: string
          questions?: Json
          passing_score?: number
          updated_at?: string | null
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          created_at: string
          student_id: string
          quiz_id: string
          score: number
          answers: Json
          passed: boolean
          updated_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          student_id: string
          quiz_id: string
          score: number
          answers: Json
          passed: boolean
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          student_id?: string
          quiz_id?: string
          score?: number
          answers?: Json
          passed?: boolean
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}