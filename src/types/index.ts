export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  imageUrl: string;
  createdAt: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  type: 'video' | 'reading' | 'quiz';
}

export interface Quiz {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  completed: boolean;
  startedAt: string;
  completedAt: string | null;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  correct: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  userId: string;
  issuedAt: string;
  grade: string;
  completionDate: string;
}

export interface Progress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  completedQuizzes: string[];
  lastAccessed: string;
  overallProgress: number;
}

export interface Analytics {
  daily: {
    date: string;
    studyTime: number;
    completedLessons: number;
    quizScores: number[];
  }[];
  weekly: {
    week: string;
    avgStudyTime: number;
    totalCompletedLessons: number;
    avgQuizScore: number;
  }[];
  monthly: {
    month: string;
    totalStudyTime: number;
    coursesProgress: {
      courseId: string;
      progress: number;
    }[];
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'quiz' | 'course' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  type: 'progress' | 'quiz' | 'streak' | 'special';
}