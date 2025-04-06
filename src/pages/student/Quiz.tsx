import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft,
  FiCheck,
  FiAward,
  FiX,
  FiAlertCircle,
  FiClock
} from 'react-icons/fi';
import { useCourseStore } from '../../store/courses';
import { toast } from 'react-hot-toast';

interface QuizAnswers {
  [questionId: string]: string;
}

const Quiz = () => {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  const { 
    courses, 
    fetchCourses, 
    currentCourse, 
    setCourse, 
    currentQuiz, 
    setQuiz, 
    submitQuiz,
    loading 
  } = useCourseStore();
  
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!courses.length) {
      fetchCourses();
    }
  }, [fetchCourses, courses.length]);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      console.log('[Quiz] Setting current course:', courseId);
      setCourse(courseId);
    }
  }, [courseId, courses, setCourse]);

  useEffect(() => {
    if (quizId && currentCourse) {
      console.log('[Quiz] Setting current quiz:', quizId);
      setQuiz(quizId);
    }
  }, [quizId, currentCourse, setQuiz]);

  useEffect(() => {
    // Start timer when quiz is loaded
    if (currentQuiz && !currentQuiz.completed && !timer) {
      console.log('[Quiz] Starting quiz timer');
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      setTimer(interval);
    }

    // Clear timer when component unmounts or quiz is submitted
    return () => {
      if (timer) {
        console.log('[Quiz] Clearing quiz timer');
        clearInterval(timer);
      }
    };
  }, [currentQuiz, timer]);

  const handleGoBack = () => {
    console.log('[Quiz] Navigating back to course');
    navigate(`/student/courses/${courseId}`);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    console.log('[Quiz] Selected answer for question:', questionId, answer);
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;
    
    // Check if all questions are answered
    const unansweredCount = currentQuiz.questions.filter(q => !answers[q.id]).length;

    if (unansweredCount > 0) {
      toast.error(`Please answer all questions. ${unansweredCount} remaining.`);
      return;
    }
    
    // Stop timer
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    // Submit quiz
    console.log('[Quiz] Submitting quiz answers:', answers);
    const quizScore = await submitQuiz(currentQuiz.id, answers);
    console.log('[Quiz] Quiz submitted, score:', quizScore);
    setScore(quizScore);
    setQuizSubmitted(true);
    toast.success('Quiz submitted successfully!');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading || !currentCourse || !currentQuiz) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If quiz is already completed and we're not in results view
  if (currentQuiz.completed && !quizSubmitted) {
    setScore(currentQuiz.score);
    setQuizSubmitted(true);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={handleGoBack} 
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to Course
      </button>

      {!quizSubmitted ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h1>
                <p className="text-gray-600 mt-1">{currentQuiz.description}</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <FiClock className="mr-2 text-gray-500" />
                <span className="text-gray-500">Time: {formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {currentQuiz.questions.map((question, index) => (
              <div key={question.id} className="mb-8 last:mb-0">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">{question.question}</h3>
            </div>

                <div className="ml-11 space-y-3">
                  {question.options.map((option) => (
                    <div 
                      key={option}
                      onClick={() => handleAnswerSelect(question.id, option)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        answers[question.id] === option
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border ${
                          answers[question.id] === option
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-gray-400'
                        } flex items-center justify-center`}>
                          {answers[question.id] === option && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="ml-3">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
                  </div>

          <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
            <div>
              <span className="text-gray-600">{Object.keys(answers).length} of {currentQuiz.questions.length} answered</span>
            </div>
              <button
              onClick={handleSubmitQuiz}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
              Submit Quiz
              </button>
            </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              {score >= 70 ? (
                <div className="h-24 w-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <FiAward className="h-12 w-12" />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FiAlertCircle className="h-12 w-12" />
                </div>
              )}
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {score >= 70 ? 'Congratulations!' : 'Almost there!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {score >= 70 
                ? 'You\'ve successfully completed this quiz.' 
                : 'Keep practicing and try again to improve your score.'
              }
            </p>
            
            <div className="flex justify-center mb-6">
              <div className="h-36 w-36 relative">
                <div className="h-full w-full rounded-full bg-gray-100"></div>
                <div 
                  className="absolute top-0 left-0 h-full w-full"
                  style={{ 
                    background: `conic-gradient(${score >= 70 ? '#10B981' : '#F59E0B'} ${score}%, transparent 0)`,
                    borderRadius: '100%',
                    clipPath: 'circle(50% at 50% 50%)',
                  }}
                ></div>
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                    <span className="text-3xl font-bold">{score}%</span>
                  </div>
                </div>
            </div>
          </div>

          <div className="mb-8">
              <p className="text-gray-600 text-lg">
                {score >= 70 ? 'Great job!' : 'You can do better!'}
              </p>
              <p className="text-gray-500">
                You completed the quiz in {formatTime(timeElapsed)}
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Course
              </button>
              {score < 70 && (
                <button
                  onClick={() => {
                    setAnswers({});
                    setQuizSubmitted(false);
                    setTimeElapsed(0);
                    console.log('[Quiz] Retrying quiz:', currentQuiz?.id);
                    const interval = setInterval(() => {
                      setTimeElapsed(prev => prev + 1);
                    }, 1000);
                    setTimer(interval);
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>

          <div className="p-6 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Results</h2>
          <div className="space-y-6">
              {currentQuiz.questions.map((question, index) => (
                <div key={question.id} className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-start mb-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center font-medium text-sm">
                      {index + 1}
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">{question.question}</h3>
                  </div>

                  <div className="ml-10 space-y-2">
                    {question.options.map((option) => (
                      <div 
                        key={option}
                        className={`p-3 rounded-lg border ${
                          option === question.correct_answer && answers[question.id] === option
                            ? 'bg-green-50 border-green-200'
                            : option === question.correct_answer
                            ? 'bg-green-50 border-green-200'
                            : answers[question.id] === option
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          {option === question.correct_answer ? (
                            <FiCheck className="h-5 w-5 text-green-500" />
                          ) : answers[question.id] === option ? (
                            <FiX className="h-5 w-5 text-red-500" />
                          ) : (
                            <div className="h-5 w-5" />
                          )}
                          <span className="ml-3">{option}</span>
                        </div>
                      </div>
                ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;