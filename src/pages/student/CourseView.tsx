import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiBook, 
  FiClock, 
  FiUser, 
  FiCalendar, 
  FiCheck, 
  FiPlay, 
  FiFileText,
  FiChevronRight,
  FiArrowLeft
} from 'react-icons/fi';
import { useCourseStore } from '../../store/courses';

const CourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { 
    courses, 
    fetchCourses, 
    currentCourse, 
    setCourse, 
    currentLesson,
    setLesson,
    loading 
  } = useCourseStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'quizzes'>('overview');

  useEffect(() => {
    if (!courses.length) {
      fetchCourses();
    }
  }, [fetchCourses, courses.length]);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      console.log('[CourseView] Setting current course:', courseId);
      setCourse(courseId);
    }
  }, [courseId, courses, setCourse]);

  const handleLessonClick = (lessonId: string) => {
    console.log('[CourseView] Navigating to lesson:', lessonId);
    navigate(`/student/courses/${courseId}/lessons/${lessonId}`);
  };

  const handleQuizClick = (quizId: string) => {
    console.log('[CourseView] Navigating to quiz:', quizId);
    navigate(`/student/courses/${courseId}/quiz/${quizId}`);
  };

  const goBack = () => {
    console.log('[CourseView] Navigating back to courses list');
    navigate('/student/courses');
  };

  if (loading || !currentCourse) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button 
        onClick={goBack} 
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to Courses
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src={currentCourse.image_url || 'https://via.placeholder.com/1200x400?text=Course+Image'}
            alt={currentCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentCourse.title}</h1>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">{currentCourse.description}</p>
            </div>
          </div>
        </div>

        <div className="border-b">
          <div className="flex flex-wrap">
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'lessons' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('lessons')}
            >
              Lessons ({currentCourse.lessons.length})
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'quizzes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes ({currentCourse.quizzes.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <FiUser className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Instructor</h3>
                    <p className="text-lg font-medium text-gray-900">{currentCourse.instructor}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <FiClock className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="text-lg font-medium text-gray-900">{currentCourse.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <FiBook className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Level</h3>
                    <p className="text-lg font-medium text-gray-900">{currentCourse.level}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-600 h-4 rounded-full"
                    style={{ width: `${currentCourse.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{currentCourse.progress}% complete</span>
                  <span>{currentCourse.completed_lessons} of {currentCourse.total_lessons} lessons completed</span>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{currentCourse.description}</p>
                
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setActiveTab('lessons');
                      // Find first uncompleted lesson
                      const nextLesson = currentCourse.lessons.find(lesson => !lesson.completed);
                      if (nextLesson) {
                        handleLessonClick(nextLesson.id);
                      } else if (currentCourse.lessons.length > 0) {
                        // If all completed, go to first lesson
                        handleLessonClick(currentCourse.lessons[0].id);
                      }
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FiPlay className="mr-2" />
                    {currentCourse.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Lessons</h2>
              <div className="space-y-3">
                {currentCourse.lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleLessonClick(lesson.id)}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center ${lesson.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {lesson.completed ? <FiCheck className="h-5 w-5" /> : <span>{index + 1}</span>}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${lesson.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {lesson.completed ? 'Completed' : 'Not completed'}
                          </span>
                          <button 
                            className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('[CourseView] Lesson button clicked:', lesson.id);
                              handleLessonClick(lesson.id);
                            }}
                          >
                            {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
                            <FiChevronRight className="ml-1" />
              </button>
            </div>
          </div>
          </div>
                  </motion.div>
                ))}
            </div>
            </div>
          )}

          {activeTab === 'quizzes' && (
          <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Quizzes</h2>
            <div className="space-y-3">
                {currentCourse.quizzes.map((quiz, index) => (
                <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleQuizClick(quiz.id)}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 rounded-full h-10 w-10 flex items-center justify-center ${quiz.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <FiFileText className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{quiz.total_questions} questions</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          {quiz.completed ? (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Score: {quiz.score}%
                            </span>
                    ) : (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              Not attempted
                            </span>
                    )}
                          <button 
                            className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('[CourseView] Quiz button clicked:', quiz.id);
                              handleQuizClick(quiz.id);
                            }}
                          >
                            {quiz.completed ? 'Review Quiz' : 'Start Quiz'}
                            <FiChevronRight className="ml-1" />
                          </button>
                  </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;