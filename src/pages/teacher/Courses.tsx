import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Users, Clock, PlusCircle, 
  Settings, Trash2, Edit, Eye, Search, Filter,
  ChevronLeft, Globe, Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const mockCourses = [
  {
    id: 1,
    title: 'Kinyarwanda Language Essentials',
    description: 'Master the fundamentals of Kinyarwanda language, including basic conversation, grammar, and cultural context',
    students: 45,
    duration: '12 weeks',
    status: 'published',
    lastUpdated: '2 days ago',
    image_url: 'https://images.unsplash.com/photo-1517842264405-72bb906a1936?auto=format&fit=crop&q=80&w=800&h=500'
  },
  {
    id: 2,
    title: 'Traditional Rwandan Art & Crafts',
    description: 'Explore the rich artistic heritage of Rwanda through traditional crafts, including Imigongo art and basket weaving',
    students: 32,
    duration: '8 weeks',
    status: 'draft',
    lastUpdated: '5 days ago',
    image_url: 'https://cdn.pixabay.com/photo/2016/11/19/15/03/baskets-1839691_1280.jpg'
  },
  {
    id: 3,
    title: 'Rwanda History & Cultural Heritage',
    description: 'Comprehensive study of Rwandan history, from ancient kingdoms to modern times, including cultural traditions',
    students: 56,
    duration: '10 weeks',
    status: 'published',
    lastUpdated: '1 week ago',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Rwanda.svg/800px-Flag_of_Rwanda.svg.png'
  }
];

function TeacherCourses() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courses, setCourses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    image_url: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // For now, we'll just use a fake URL
      setFormData(prev => ({
        ...prev,
        image_url: URL.createObjectURL(e.target.files[0])
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new course
      const newCourse = {
        id: courses.length + 1,
        title: formData.title,
        description: formData.description,
        students: 0,
        duration: formData.duration,
        status: 'draft',
        lastUpdated: 'Just now',
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800&h=500'
      };
      
      // Add the new course to the courses array
      setCourses([newCourse, ...courses]);
      
      // Close the modal and reset form
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        duration: '',
        image_url: ''
      });
      
      toast.success('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter courses based on search query and status filter
  const filteredCourses = courses.filter(course => {
    const matchesQuery = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  });

  // View course details
  const handleViewCourse = (course: any) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };
  
  // Edit course
  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category || 'language', // Default if not present
      duration: course.duration,
      image_url: course.image_url
    });
    setShowEditModal(true);
  };
  
  // Settings for a course
  const handleCourseSettings = (course: any) => {
    setSelectedCourse(course);
    setShowSettingsModal(true);
  };
  
  // Delete course
  const handleDeleteCourse = (course: any) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };
  
  // Confirm delete course
  const confirmDeleteCourse = () => {
    if (!selectedCourse) return;
    
    try {
      // Filter out the course with the selected ID
      const updatedCourses = courses.filter(course => course.id !== selectedCourse.id);
      setCourses(updatedCourses);
      toast.success(`Course "${selectedCourse.title}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };
  
  // Update course status (publish/unpublish)
  const updateCourseStatus = (courseId: number, newStatus: 'published' | 'draft') => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return { ...course, status: newStatus, lastUpdated: 'Just now' };
      }
      return course;
    });
    
    setCourses(updatedCourses);
    
    const statusText = newStatus === 'published' ? 'published' : 'set to draft';
    toast.success(`Course ${statusText} successfully`);
    setShowSettingsModal(false);
  };
  
  // Save edited course
  const saveEditedCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse || !formData.title || !formData.description || !formData.category || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      // Update the selected course with new data
      const updatedCourses = courses.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            title: formData.title,
            description: formData.description,
            duration: formData.duration,
            image_url: formData.image_url || course.image_url,
            lastUpdated: 'Just now'
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
      setShowEditModal(false);
      toast.success('Course updated successfully');
      
      // Reset form data
      setFormData({
        title: '',
        description: '',
        category: '',
        duration: '',
        image_url: ''
      });
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Courses</h1>
          <p className="text-gray-600 mt-1">Manage and create your cultural education courses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Create Course</span>
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={course.image_url || 'https://via.placeholder.com/800x400?text=Course+Image'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
              <p className="text-gray-600 mt-2">{course.description}</p>
              
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Updated {course.lastUpdated}
                </span>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleViewCourse(course)}
                    title="View course"
                  >
                    <Eye className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleEditCourse(course)}
                    title="Edit course"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleCourseSettings(course)}
                    title="Course settings"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleDeleteCourse(course)}
                    title="Delete course"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input" 
                    placeholder="Enter course title" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input" 
                    rows={3} 
                    placeholder="Enter course description"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="language">Language & Communication</option>
                    <option value="culture">Culture & Traditions</option>
                    <option value="history">History & Heritage</option>
                    <option value="arts">Arts & Crafts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input 
                    type="text" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input" 
                    placeholder="e.g., 8 weeks" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                  <input 
                    type="file" 
                    name="image"
                    onChange={handleFileChange}
                    className="input" 
                    accept="image/*" 
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Course Modal */}
      <AnimatePresence>
        {showViewModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Course Preview</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={selectedCourse.image_url} 
                      alt={selectedCourse.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold">{selectedCourse.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCourse.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedCourse.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-3">{selectedCourse.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Course Curriculum</h4>
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <p className="text-center text-gray-500 italic">Course curriculum preview not available</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Learning Objectives</h4>
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <p className="text-center text-gray-500 italic">Learning objectives preview not available</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Course Details</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{selectedCourse.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Students Enrolled</p>
                        <p className="font-medium">{selectedCourse.students}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">{selectedCourse.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditCourse(selectedCourse);
                      }}
                      className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        handleCourseSettings(selectedCourse);
                      }}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Course Settings
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Course Modal */}
      <AnimatePresence>
        {showEditModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
              <form className="space-y-4" onSubmit={saveEditedCourse}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input" 
                    placeholder="Enter course title" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input" 
                    rows={3} 
                    placeholder="Enter course description"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="language">Language & Communication</option>
                    <option value="culture">Culture & Traditions</option>
                    <option value="history">History & Heritage</option>
                    <option value="arts">Arts & Crafts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input 
                    type="text" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="input" 
                    placeholder="e.g., 8 weeks" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                  <input 
                    type="file" 
                    name="image"
                    onChange={handleFileChange}
                    className="input" 
                    accept="image/*" 
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Course Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Course Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Visibility</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => updateCourseStatus(selectedCourse.id, 'published')}
                      className={`w-full flex items-center p-4 border rounded-xl ${
                        selectedCourse.status === 'published' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Globe className={`h-5 w-5 mr-3 ${
                        selectedCourse.status === 'published' ? 'text-green-500' : 'text-gray-500'
                      }`} />
                      <div className="text-left">
                        <p className="font-medium">Publish</p>
                        <p className="text-sm text-gray-600">Course is visible to all students</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => updateCourseStatus(selectedCourse.id, 'draft')}
                      className={`w-full flex items-center p-4 border rounded-xl ${
                        selectedCourse.status === 'draft' 
                          ? 'border-yellow-500 bg-yellow-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Lock className={`h-5 w-5 mr-3 ${
                        selectedCourse.status === 'draft' ? 'text-yellow-500' : 'text-gray-500'
                      }`} />
                      <div className="text-left">
                        <p className="font-medium">Draft</p>
                        <p className="text-sm text-gray-600">Hidden from students</p>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Advanced Options</h3>
                  <button 
                    onClick={() => {
                      setShowSettingsModal(false);
                      handleDeleteCourse(selectedCourse);
                    }}
                    className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Course
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Delete Course</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{selectedCourse.title}"? This action cannot be undone.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCourse}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeacherCourses;