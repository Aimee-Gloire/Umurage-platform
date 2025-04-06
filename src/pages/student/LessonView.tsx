import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheck, 
  FiClock, 
  FiVideo,
  FiFileText,
  FiList
} from 'react-icons/fi';
import { useCourseStore } from '../../store/courses';
import { toast } from 'react-hot-toast';

const LessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { 
    courses, 
    fetchCourses, 
    currentCourse, 
    setCourse, 
    setLesson, 
    currentLesson, 
    completeLesson,
    loading 
  } = useCourseStore();
  
  const [lessonComplete, setLessonComplete] = useState(false);

  useEffect(() => {
    if (!courses.length) {
      fetchCourses();
    }
  }, [fetchCourses, courses.length]);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      console.log('[LessonView] Setting current course:', courseId);
      setCourse(courseId);
    }
  }, [courseId, courses, setCourse]);

  useEffect(() => {
    if (lessonId && currentCourse) {
      console.log('[LessonView] Setting current lesson:', lessonId);
      setLesson(lessonId);
    }
  }, [lessonId, currentCourse, setLesson]);

  const handleGoBack = () => {
    console.log('[LessonView] Navigating back to course view');
    navigate(`/student/courses/${courseId}`);
  };

  const handleCompleteLesson = () => {
    if (currentLesson && !currentLesson.completed) {
      console.log('[LessonView] Marking lesson as completed:', currentLesson.id);
      completeLesson(currentLesson.id);
      setLessonComplete(true);
      toast.success('Lesson completed!');
    }
  };

  const handleNext = () => {
    if (!currentCourse || !currentLesson) return;
    
    const currentIndex = currentCourse.lessons.findIndex(lesson => lesson.id === currentLesson.id);
    
    if (currentIndex < currentCourse.lessons.length - 1) {
      // Go to next lesson
      const nextLesson = currentCourse.lessons[currentIndex + 1];
      console.log('[LessonView] Navigating to next lesson:', nextLesson.id);
      navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`);
    } else {
      // Go to quiz if exists, else back to course
      if (currentCourse.quizzes && currentCourse.quizzes.length > 0) {
        const nextQuiz = currentCourse.quizzes.find(quiz => !quiz.completed);
        if (nextQuiz) {
          console.log('[LessonView] Navigating to quiz:', nextQuiz.id);
          navigate(`/student/courses/${courseId}/quiz/${nextQuiz.id}`);
        } else {
          console.log('[LessonView] No more lessons or quizzes, navigating back to course');
          navigate(`/student/courses/${courseId}`);
        }
      } else {
        console.log('[LessonView] No quizzes, navigating back to course');
        navigate(`/student/courses/${courseId}`);
      }
    }
  };

  const handlePrevious = () => {
    if (!currentCourse || !currentLesson) return;
    
    const currentIndex = currentCourse.lessons.findIndex(lesson => lesson.id === currentLesson.id);
    
    if (currentIndex > 0) {
      // Go to previous lesson
      const prevLesson = currentCourse.lessons[currentIndex - 1];
      console.log('[LessonView] Navigating to previous lesson:', prevLesson.id);
      navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`);
    } else {
      // Go back to course
      console.log('[LessonView] At first lesson, navigating back to course');
      navigate(`/student/courses/${courseId}`);
    }
  };

  if (loading || !currentCourse || !currentLesson) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isCompleted = lessonComplete || currentLesson.completed;
  const lessonIndex = currentCourse.lessons.findIndex(lesson => lesson.id === currentLesson.id);
  const isPreviousLesson = lessonIndex > 0;
  const isNextLesson = lessonIndex < currentCourse.lessons.length - 1;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button 
        onClick={handleGoBack} 
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to Course
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
            <div className="flex items-center mt-2 md:mt-0">
              <FiClock className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">{currentLesson.duration}</span>
            </div>
          </div>

          {currentLesson.video_url && (
            <div className="aspect-w-16 aspect-h-9 mb-8">
              <iframe
                src={currentLesson.video_url}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          )}

          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-4">Lesson Content</h2>
            <div className="whitespace-pre-line">
              {currentLesson.content}
            </div>
          </div>
                    </div>
                  </div>

      <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow-lg p-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Lesson {lessonIndex + 1} of {currentCourse.lessons.length}</h3>
          <p className="text-sm text-gray-500">From {currentCourse.title}</p>
          </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={handlePrevious}
            disabled={!isPreviousLesson}
            className={`flex items-center px-4 py-2 rounded-lg 
              ${isPreviousLesson 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <FiArrowLeft className="mr-2" />
            Previous
          </button>
          
          {!isCompleted ? (
            <button
              onClick={handleCompleteLesson}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FiCheck className="mr-2" />
              Mark as Completed
            </button>
          ) : (
            <button
              className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg cursor-default"
            >
              <FiCheck className="mr-2" />
              Completed
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {isNextLesson ? 'Next Lesson' : 'Finish Course'}
            <FiArrowRight className="ml-2" />
                </button>
          </div>
        </div>

      {currentCourse.lessons.length > 1 && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Course Outline</h3>
          <div className="space-y-2">
            {currentCourse.lessons.map((lesson, index) => (
              <div 
                key={lesson.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
                  ${lesson.id === currentLesson.id 
                    ? 'bg-indigo-50 border border-indigo-100' 
                    : 'hover:bg-gray-50'
                  }`}
                onClick={() => navigate(`/student/courses/${courseId}/lessons/${lesson.id}`)}
                >
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {lesson.completed ? <FiCheck className="h-3 w-3" /> : <span className="text-xs">{index + 1}</span>}
                </div>
                <span className={`ml-3 ${lesson.id === currentLesson.id ? 'font-medium' : ''}`}>
                  {lesson.title}
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  {lesson.duration}
                </span>
                  </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonView;