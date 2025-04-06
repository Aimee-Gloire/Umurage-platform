import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseWithRelations = Course & {
  profiles: Database['public']['Tables']['profiles']['Row'];
  lessons: Array<Database['public']['Tables']['lessons']['Row'] & {
    quizzes: Database['public']['Tables']['quizzes']['Row'][];
  }>;
};

// Mock data with Rwandan themes
const mockCourses = [
  {
    id: 'course-1',
    title: 'Kinyarwanda for Beginners',
    description: 'Learn the basics of Kinyarwanda language with interactive lessons.',
    image_url: 'https://images.unsplash.com/photo-1578450671530-5b6a7c9f32a8?w=800&auto=format&fit=crop',
    progress: 30,
    total_lessons: 12,
    completed_lessons: 4,
    level: 'Beginner',
    instructor: 'Mugisha Jean',
    category: 'Language',
    duration: '8 weeks',
    created_at: '2023-08-15T10:00:00Z',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Introduction to Kinyarwanda',
        description: 'Get familiar with Kinyarwanda sounds and greetings.',
        duration: '45 min',
        completed: true,
        content: 'Welcome to your first Kinyarwanda lesson! In this lesson, you will learn basic greetings:\n\n- Muraho (Hello)\n- Amakuru? (How are you?)\n- Ni meza (I am fine)\n- Murakoze (Thank you)\n\nPractice these phrases by speaking them out loud.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-1-2',
        title: 'Basic Conversations',
        description: 'Learn to introduce yourself and have basic conversations.',
        duration: '50 min',
        completed: true,
        content: 'In this lesson, you will learn how to introduce yourself:\n\n- Nitwa... (My name is...)\n- Nkomoka... (I am from...)\n- Mfite imyaka... (I am ... years old)\n\nTry to create your own introduction using these phrases.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-1-3',
        title: 'Numbers and Counting',
        description: 'Learn to count in Kinyarwanda from 1 to 20.',
        duration: '40 min',
        completed: true,
        content: 'Let\'s learn numbers in Kinyarwanda:\n\n1 - Rimwe\n2 - Kabiri\n3 - Gatatu\n4 - Kane\n5 - Gatanu\n6 - Gatandatu\n7 - Karindwi\n8 - Umunani\n9 - Icyenda\n10 - Icumi\n\nPractice counting from 1 to 10 out loud.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-1-4',
        title: 'Family Vocabulary',
        description: 'Learn vocabulary related to family members.',
        duration: '55 min',
        completed: true,
        content: 'Family vocabulary in Kinyarwanda:\n\n- Umuryango (Family)\n- Mama/Nyina (Mother)\n- Papa/Se (Father)\n- Mukuru wanjye (My older sibling)\n- Murumuna wanjye (My younger sibling)\n- Sogokuru (Grandfather)\n- Nyogokuru (Grandmother)\n\nTry to describe your family using these terms.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-1-5',
        title: 'Common Phrases',
        description: 'Learn everyday phrases used in Rwanda.',
        duration: '60 min',
        completed: false,
        content: 'Common phrases in Kinyarwanda:\n\n- Urakoze cyane (Thank you very much)\n- Yego/Oya (Yes/No)\n- Mwirirwe (Good afternoon)\n- Muramuke (Good morning)\n- Murabeho (Goodbye)\n- Ni angahe? (How much is it?)\n\nPractice these phrases in everyday situations.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      }
    ],
    quizzes: [
      {
        id: 'quiz-1-1',
        title: 'Greetings and Introduction Quiz',
        description: 'Test your knowledge of basic Kinyarwanda greetings.',
        completed: true,
        score: 80,
        total_questions: 10,
        questions: [
          {
            id: 'q1-1',
            question: 'How do you say "Hello" in Kinyarwanda?',
            options: ['Murakoze', 'Muraho', 'Murabeho', 'Amakuru'],
            correct_answer: 'Muraho'
          },
          {
            id: 'q1-2',
            question: 'How do you say "Thank you" in Kinyarwanda?',
            options: ['Muraho', 'Murabeho', 'Murakoze', 'Yego'],
            correct_answer: 'Murakoze'
          },
          {
            id: 'q1-3',
            question: '"Nitwa John" means:',
            options: ['I am fine', 'I am from John', 'My name is John', 'I like John'],
            correct_answer: 'My name is John'
          }
        ]
      },
      {
        id: 'quiz-1-2',
        title: 'Numbers and Family Quiz',
        description: 'Test your knowledge of numbers and family vocabulary.',
        completed: false,
        score: 0,
        total_questions: 10,
        questions: [
          {
            id: 'q2-1',
            question: 'What is the Kinyarwanda word for "five"?',
            options: ['Gatanu', 'Gatandatu', 'Kane', 'Gatatu'],
            correct_answer: 'Gatanu'
          },
          {
            id: 'q2-2',
            question: 'What does "Umuryango" mean?',
            options: ['Village', 'Friend', 'Family', 'House'],
            correct_answer: 'Family'
          },
          {
            id: 'q2-3',
            question: 'The term for "Mother" in Kinyarwanda is:',
            options: ['Se', 'Nyina', 'Sogokuru', 'Papa'],
            correct_answer: 'Nyina'
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Traditional Rwandan Art & Crafts',
    description: 'Explore the rich artistic heritage of Rwanda through traditional crafts, including Imigongo art and basket weaving',
    image_url: "https://cdn.pixabay.com/photo/2016/11/19/15/03/baskets-1839691_1280.jpg",
    progress: 60,
    total_lessons: 10,
    completed_lessons: 6,
    level: 'Intermediate',
    instructor: 'Uwase Marie',
    category: 'History',
    duration: '6 weeks',
    created_at: '2023-09-10T14:30:00Z',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Pre-Colonial Rwanda',
        description: 'Learn about Rwanda before European colonization.',
        duration: '50 min',
        completed: true,
        content: 'Pre-colonial Rwanda was organized as a monarchy headed by a king (Mwami). The kingdom was well-structured with a complex political system. This lesson explores the social and political organization of Rwanda before colonization.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-2-2',
        title: 'Colonial Period',
        description: 'Understand the impact of colonialism on Rwanda.',
        duration: '55 min',
        completed: true,
        content: 'Rwanda was colonized first by Germany (1884-1916) and then by Belgium (1916-1962). This lesson examines the colonial policies and their long-term effects on Rwandan society and politics.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-2-3',
        title: 'Independence and Early Republic',
        description: 'Explore Rwanda\'s journey to independence and the early republic years.',
        duration: '45 min',
        completed: true,
        content: 'Rwanda gained independence on July 1, 1962. This lesson covers the independence movement and the challenges faced by the newly formed republic during its early years.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-2-4',
        title: 'Traditional Arts and Crafts',
        description: 'Discover Rwanda\'s rich tradition of arts and crafts.',
        duration: '40 min',
        completed: true,
        content: 'Rwanda has a rich tradition of arts and crafts, including Imigongo (geometric art), pottery, basketry, and woodcarving. This lesson explores these traditional art forms and their cultural significance.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-2-5',
        title: 'Rwandan Music and Dance',
        description: 'Experience the vibrant music and dance traditions of Rwanda.',
        duration: '60 min',
        completed: true,
        content: 'Rwandan music and dance are integral parts of the culture. This lesson covers traditional instruments, songs, and dances such as Intore, Amaraba, and Ikembe performances.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-2-6',
        title: 'Modern Rwanda',
        description: 'Understand contemporary Rwanda and its development.',
        duration: '65 min',
        completed: true,
        content: 'This lesson focuses on modern Rwanda, its governance, economic development, and vision for the future. Learn about Rwanda\'s remarkable recovery and progress in recent decades.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      }
    ],
    quizzes: [
      {
        id: 'quiz-2-1',
        title: 'Pre-Colonial and Colonial Rwanda Quiz',
        description: 'Test your knowledge of Rwanda\'s history before independence.',
        completed: true,
        score: 90,
        total_questions: 10,
        questions: [
          {
            id: 'q3-1',
            question: 'What was the title of the Rwandan king?',
            options: ['Sultan', 'Mwami', 'Emperor', 'Chief'],
            correct_answer: 'Mwami'
          },
          {
            id: 'q3-2',
            question: 'Which European country first colonized Rwanda?',
            options: ['France', 'Britain', 'Germany', 'Belgium'],
            correct_answer: 'Germany'
          },
          {
            id: 'q3-3',
            question: 'When did Rwanda gain independence?',
            options: ['July 1, 1960', 'July 1, 1962', 'August 4, 1963', 'June 27, 1959'],
            correct_answer: 'July 1, 1962'
          }
        ]
      },
      {
        id: 'quiz-2-2',
        title: 'Rwandan Culture and Modern Rwanda Quiz',
        description: 'Test your knowledge of Rwandan cultural traditions and contemporary Rwanda.',
        completed: false,
        score: 0,
        total_questions: 10,
        questions: [
          {
            id: 'q4-1',
            question: 'What is Imigongo?',
            options: ['A traditional dance', 'A traditional food', 'Geometric art', 'A musical instrument'],
            correct_answer: 'Geometric art'
          },
          {
            id: 'q4-2',
            question: 'Which traditional dance was performed by warriors?',
            options: ['Intore', 'Ikembe', 'Amaraba', 'Ingoma'],
            correct_answer: 'Intore'
          },
          {
            id: 'q4-3',
            question: 'Rwanda is known as the "Land of a Thousand _____"',
            options: ['Lakes', 'Mountains', 'Hills', 'Rivers'],
            correct_answer: 'Hills'
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Rwandan Cuisine',
    description: 'Learn to prepare traditional Rwandan dishes and understand food culture.',
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop',
    progress: 10,
    total_lessons: 8,
    completed_lessons: 1,
    level: 'Beginner',
    instructor: 'Hakizimana Claude',
    category: 'Culinary Arts',
    duration: '4 weeks',
    created_at: '2023-10-05T09:15:00Z',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Introduction to Rwandan Cuisine',
        description: 'Overview of Rwandan food culture and common ingredients.',
        duration: '45 min',
        completed: true,
        content: 'Rwandan cuisine is based on local staple foods like plantains, sweet potatoes, beans, and cassava. This lesson introduces you to the food culture of Rwanda and the common ingredients used in traditional cooking.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-3-2',
        title: 'Cooking Isombe',
        description: 'Learn to prepare Isombe, a popular Rwandan dish made with cassava leaves.',
        duration: '55 min',
        completed: false,
        content: 'Isombe is a traditional dish made from cassava leaves cooked with onions, eggplant, and spices. This lesson will guide you through the process of preparing authentic Isombe step by step.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'lesson-3-3',
        title: 'Preparing Ugali',
        description: 'Learn to cook Ugali, a staple starch dish in Rwanda.',
        duration: '35 min',
        completed: false,
        content: 'Ugali (also known as Ubugali in Kinyarwanda) is a staple food made from maize flour and water. This lesson teaches you how to prepare the perfect Ugali with the right consistency.',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      }
    ],
    quizzes: [
      {
        id: 'quiz-3-1',
        title: 'Rwandan Food Basics Quiz',
        description: 'Test your knowledge of Rwandan cuisine fundamentals.',
        completed: false,
        score: 0,
        total_questions: 10,
        questions: [
          {
            id: 'q5-1',
            question: 'What are the main ingredients of Isombe?',
            options: ['Rice and beans', 'Cassava leaves and spices', 'Maize flour and water', 'Plantains and meat'],
            correct_answer: 'Cassava leaves and spices'
          },
          {
            id: 'q5-2',
            question: 'What is Ubugali made from?',
            options: ['Cassava leaves', 'Sweet potatoes', 'Maize flour', 'Plantains'],
            correct_answer: 'Maize flour'
          },
          {
            id: 'q5-3',
            question: 'Which beverage is traditionally made from bananas in Rwanda?',
            options: ['Urwagwa', 'Ikivuguto', 'Umutobe', 'Ikigage'],
            correct_answer: 'Urwagwa'
          }
        ]
      }
    ]
  }
];

interface CourseState {
  courses: any[];
  currentCourse: any | null;
  currentLesson: any | null;
  currentQuiz: any | null;
  loading: boolean;
  error: string | null;
  filterOptions: {
    category: string[];
    level: string[];
    duration: string[];
  };
  filters: {
    category: string | null;
    level: string | null;
    duration: string | null;
    search: string;
  };
  fetchCourses: () => Promise<void>;
  setCourse: (courseId: string) => void;
  setLesson: (lessonId: string) => void;
  setQuiz: (quizId: string) => void;
  completeLesson: (lessonId: string) => void;
  submitQuiz: (quizId: string, answers: Record<string, string>) => Promise<number>;
  applyFilters: (filters: Partial<CourseState['filters']>) => void;
  resetFilters: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  currentLesson: null,
  currentQuiz: null,
  loading: false,
  error: null,
  filterOptions: {
    category: ['All', 'Language', 'History', 'Culinary Arts', 'Technology', 'Business'],
    level: ['All', 'Beginner', 'Intermediate', 'Advanced'],
    duration: ['All', '1-4 weeks', '4-8 weeks', '8+ weeks'],
  },
  filters: {
    category: null,
    level: null,
    duration: null,
    search: '',
  },

  fetchCourses: async () => {
    try {
      console.log('[CourseStore] Starting to fetch courses');
      set({ loading: true, error: null });
      
      // In a real app, we would fetch from Supabase
      // const { data, error } = await supabase.from('courses').select('*');
      
      // Using mock data for now
      console.log('[CourseStore] Using mock data, courses count:', mockCourses.length);
      setTimeout(() => {
        set({ courses: mockCourses, loading: false });
        console.log('[CourseStore] Courses loaded successfully', mockCourses);
      }, 1000);
      
    } catch (error) {
      console.error('[CourseStore] Error fetching courses:', error);
      set({ error: 'Failed to fetch courses', loading: false });
    }
  },

  setCourse: (courseId) => {
    const { courses } = get();
    const course = courses.find(c => c.id === courseId);
    set({ currentCourse: course });
  },

  setLesson: (lessonId) => {
    const { currentCourse } = get();
    if (currentCourse) {
      const lesson = currentCourse.lessons.find((l: any) => l.id === lessonId);
      set({ currentLesson: lesson });
    }
  },

  setQuiz: (quizId) => {
    const { currentCourse } = get();
    if (currentCourse) {
      const quiz = currentCourse.quizzes.find((q: any) => q.id === quizId);
      set({ currentQuiz: quiz });
    }
  },

  completeLesson: (lessonId) => {
    const { courses, currentCourse } = get();
    
    if (!currentCourse) return;

    // Update the lesson completion status
    const updatedCourses = courses.map(course => {
      if (course.id === currentCourse.id) {
        const updatedLessons = course.lessons.map((lesson: any) => {
          if (lesson.id === lessonId && !lesson.completed) {
            return { ...lesson, completed: true };
          }
          return lesson;
        });
        
        const completedLessons = updatedLessons.filter((l: any) => l.completed).length;
        
        return { 
          ...course, 
          lessons: updatedLessons,
          completed_lessons: completedLessons,
          progress: Math.round((completedLessons / course.total_lessons) * 100)
        };
      }
      return course;
    });

    // Update the current course as well
    const updatedCurrentCourse = updatedCourses.find(c => c.id === currentCourse.id);
    
    set({ 
      courses: updatedCourses, 
      currentCourse: updatedCurrentCourse,
      currentLesson: { ...get().currentLesson, completed: true }
    });
  },

  submitQuiz: async (quizId, answers) => {
    const { courses, currentCourse, currentQuiz } = get();
    
    if (!currentCourse || !currentQuiz) return 0;

    // Calculate score
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question: any) => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

    // Update quiz completion status
    const updatedCourses = courses.map(course => {
      if (course.id === currentCourse.id) {
        const updatedQuizzes = course.quizzes.map((quiz: any) => {
          if (quiz.id === quizId) {
            return { ...quiz, completed: true, score };
          }
          return quiz;
        });
        
        return { ...course, quizzes: updatedQuizzes };
      }
      return course;
    });

    // Update the current course and quiz
    const updatedCurrentCourse = updatedCourses.find(c => c.id === currentCourse.id);
    const updatedCurrentQuiz = updatedCurrentCourse.quizzes.find((q: any) => q.id === quizId);
    
    set({ 
      courses: updatedCourses, 
      currentCourse: updatedCurrentCourse,
      currentQuiz: updatedCurrentQuiz
    });

    return score;
  },

  applyFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  resetFilters: () => {
    set({
      filters: {
        category: null,
        level: null,
        duration: null,
        search: '',
      }
    });
  }
})); 