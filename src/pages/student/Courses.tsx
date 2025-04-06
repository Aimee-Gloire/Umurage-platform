import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiBook, FiClock, FiUser, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/courses';

const Courses = () => {
  const navigate = useNavigate();
  const { 
    courses, 
    fetchCourses, 
    loading, 
    filterOptions,
    filters,
    applyFilters,
    resetFilters 
  } = useCourseStore();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    applyFilters({ search: searchTerm });
  }, [searchTerm, applyFilters]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const applyFiltersHandler = () => {
    applyFilters({
      category: selectedCategory === 'All' ? null : selectedCategory,
      level: selectedLevel === 'All' ? null : selectedLevel,
      duration: selectedDuration === 'All' ? null : selectedDuration
    });
    setIsFilterOpen(false);
  };

  const resetFiltersHandler = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSelectedDuration(null);
    resetFilters();
    setIsFilterOpen(false);
  };

  const viewCourse = (courseId: string) => {
    console.log('[Courses] Navigating to course:', courseId);
    navigate(`/student/courses/${courseId}`);
  };

  const filteredCourses = courses.filter(course => {
    let matches = true;
    
    // Search term filter
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      matches = matches && (
        searchRegex.test(course.title) || 
        searchRegex.test(course.description) || 
        searchRegex.test(course.instructor)
      );
    }
    
    // Category filter
    if (filters.category) {
      matches = matches && course.category === filters.category;
    }
    
    // Level filter
    if (filters.level) {
      matches = matches && course.level === filters.level;
    }
    
    // Duration filter
    if (filters.duration) {
      matches = matches && course.duration.includes(filters.duration);
    }
    
    return matches;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">My Courses</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={toggleFilter}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiFilter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Filter Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {filterOptions.category.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel || ''}
                onChange={(e) => setSelectedLevel(e.target.value || null)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                {filterOptions.level.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={selectedDuration || ''}
                onChange={(e) => setSelectedDuration(e.target.value || null)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Duration</option>
                {filterOptions.duration.map((duration) => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={resetFiltersHandler}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={applyFiltersHandler}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-xl font-medium text-gray-800">No courses found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer"
                  onClick={() => viewCourse(course.id)}
          >
                  <div className="h-48 relative">
              <img
                      src={course.image_url || 'https://via.placeholder.com/800x400?text=Course+Image'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center text-white">
                        <span className="text-xs font-medium bg-indigo-500 rounded-full px-2 py-1">
                          {course.level}
                        </span>
                        <span className="ml-2 text-xs">{course.category}</span>
                      </div>
                    </div>
            </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FiUser className="mr-1" />
                      <span>{course.instructor}</span>
                      <FiClock className="ml-3 mr-1" />
                <span>{course.duration}</span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{course.progress}% complete</span>
                        <span>{course.completed_lessons}/{course.total_lessons} lessons</span>
                      </div>
              </div>
                    
                    <div className="flex justify-between items-center">
                      <button
                        className="text-sm flex items-center text-indigo-600 hover:text-indigo-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Courses] Continue Learning clicked for course:', course.id);
                          viewCourse(course.id);
                        }}
                      >
                        <span>Continue Learning</span>
                        <FiChevronRight className="ml-1" />
                      </button>
                <div className="flex items-center">
                        <FiBook className="text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{course.total_lessons} lessons</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;