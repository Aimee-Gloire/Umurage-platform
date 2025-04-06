import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Calendar, Clock, PlusCircle, 
  Users, CheckCircle, XCircle, Search, Filter,
  Edit, Trash2, Eye, AlertTriangle, X, Download, Paperclip
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockAssignments = [
  {
    id: 1,
    title: 'Kinyarwanda Dialogue Writing',
    course: 'Kinyarwanda Language Essentials',
    dueDate: '2024-03-25',
    submissionsCount: 35,
    totalStudents: 45,
    averageScore: 85,
    status: 'active',
    description: 'Create a dialogue in Kinyarwanda about a traditional family gathering, incorporating cultural greetings and customs.',
    points: 100,
  },
  {
    id: 2,
    title: 'Imigongo Art Project',
    course: 'Traditional Rwandan Art & Crafts',
    dueDate: '2024-03-28',
    submissionsCount: 28,
    totalStudents: 32,
    averageScore: 78,
    status: 'active',
    description: 'Design and create an Imigongo art piece incorporating traditional geometric patterns and explaining their cultural significance.',
    points: 150,
  },
  {
    id: 3,
    title: 'Historical Research Essay',
    course: 'Rwanda History & Cultural Heritage',
    dueDate: '2024-03-20',
    submissionsCount: 56,
    totalStudents: 56,
    averageScore: 92,
    status: 'completed',
    description: 'Write a comprehensive essay about the significance of Ubwiru in ancient Rwandan kingdom administration.',
    points: 120,
  },
];

// Mock submissions for assignments
const mockSubmissions = [
  {
    id: 101,
    assignmentId: 1,
    studentName: 'Uwimana Jean',
    submittedAt: '2024-03-20',
    status: 'graded',
    score: 89,
    feedback: 'Excellent work on incorporating traditional Rwandan greetings. Your dialogue feels authentic and demonstrates a good grasp of Kinyarwanda conversation flow.',
    attachmentUrl: 'kinyarwanda_dialogue_uwimana.pdf'
  },
  {
    id: 102,
    assignmentId: 1,
    studentName: 'Mukamana Claire',
    submittedAt: '2024-03-19',
    status: 'graded',
    score: 95,
    feedback: 'Outstanding dialogue with proper use of cultural references. Your incorporation of traditional sayings added depth to the conversation.',
    attachmentUrl: 'kinyarwanda_dialogue_mukamana.pdf'
  },
  {
    id: 103,
    assignmentId: 2,
    studentName: 'Habimana Eric',
    submittedAt: '2024-03-22',
    status: 'ungraded',
    score: null,
    feedback: '',
    attachmentUrl: 'imigongo_project_habimana.jpg'
  },
  {
    id: 104,
    assignmentId: 3,
    studentName: 'Murekatete Sarah',
    submittedAt: '2024-03-18',
    status: 'graded',
    score: 92,
    feedback: 'Comprehensive research with excellent historical sources. Your analysis of Ubwiru\'s role in governance shows deep understanding.',
    attachmentUrl: 'history_essay_murekatete.pdf'
  }
];

function TeacherAssignments() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentAssignment, setCurrentAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [newAssignmentData, setNewAssignmentData] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    points: ''
  });
  const [editAssignmentData, setEditAssignmentData] = useState({
    id: 0,
    title: '',
    course: '',
    description: '',
    dueDate: '',
    points: ''
  });

  // Handle input change for new assignment
  const handleNewAssignmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAssignmentData({
      ...newAssignmentData,
      [name]: value
    });
  };

  // Handle input change for edit assignment
  const handleEditAssignmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditAssignmentData({
      ...editAssignmentData,
      [name]: value
    });
  };

  // Create new assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAssignmentData.title || !newAssignmentData.course || !newAssignmentData.description || !newAssignmentData.dueDate || !newAssignmentData.points) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newAssignment = {
      id: assignments.length + 1,
      title: newAssignmentData.title,
      course: newAssignmentData.course,
      description: newAssignmentData.description,
      dueDate: newAssignmentData.dueDate,
      points: parseInt(newAssignmentData.points),
      status: 'active',
      submissionsCount: 0,
      totalStudents: 45, // Default value
      averageScore: 0
    };
    
    setAssignments([...assignments, newAssignment]);
    setNewAssignmentData({
      title: '',
      course: '',
      description: '',
      dueDate: '',
      points: ''
    });
    setShowCreateModal(false);
    toast.success('New assignment created successfully!');
  };

  // Open edit modal with assignment data
  const handleOpenEditModal = (assignment: any) => {
    setEditAssignmentData({
      id: assignment.id,
      title: assignment.title,
      course: assignment.course,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points.toString()
    });
    setCurrentAssignment(assignment);
    setShowEditModal(true);
  };

  // Update assignment
  const handleUpdateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editAssignmentData.title || !editAssignmentData.course || !editAssignmentData.description || !editAssignmentData.dueDate || !editAssignmentData.points) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.id === editAssignmentData.id) {
        return {
          ...assignment,
          title: editAssignmentData.title,
          course: editAssignmentData.course,
          description: editAssignmentData.description,
          dueDate: editAssignmentData.dueDate,
          points: parseInt(editAssignmentData.points)
        };
      }
      return assignment;
    });
    
    setAssignments(updatedAssignments);
    setShowEditModal(false);
    toast.success('Assignment updated successfully!');
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (assignment: any) => {
    setCurrentAssignment(assignment);
    setShowDeleteModal(true);
  };

  // Delete assignment
  const handleDeleteAssignment = () => {
    if (!currentAssignment) return;
    
    const updatedAssignments = assignments.filter(assignment => assignment.id !== currentAssignment.id);
    setAssignments(updatedAssignments);
    setShowDeleteModal(false);
    toast.success('Assignment deleted successfully!');
  };

  // Open view assignment details modal
  const handleViewAssignment = (assignment: any) => {
    setCurrentAssignment(assignment);
    setShowViewModal(true);
  };

  // Filter assignments based on search query and status filter
  const filteredAssignments = assignments.filter(assignment => {
    const matchesQuery = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesQuery && matchesStatus;
  });

  // Get submissions for current assignment
  const getCurrentAssignmentSubmissions = () => {
    if (!currentAssignment) return [];
    return submissions.filter(submission => submission.assignmentId === currentAssignment.id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cultural Assignments</h1>
          <p className="text-gray-600 mt-1">Create and manage cultural learning assignments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Create Assignment</span>
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search assignments..."
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No assignments found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAssignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{assignment.course}</p>
                  <p className="text-gray-600 mt-2">{assignment.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{assignment.submissionsCount}/{assignment.totalStudents} Submissions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{assignment.points} Points</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span>Avg. Score: {assignment.averageScore}%</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => handleViewAssignment(assignment)}
                >
                  <Eye className="h-5 w-5 text-gray-600" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => handleOpenEditModal(assignment)}
                >
                  <Edit className="h-5 w-5 text-gray-600" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => handleOpenDeleteModal(assignment)}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
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
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Create New Assignment</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleCreateAssignment}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={newAssignmentData.title}
                    onChange={handleNewAssignmentChange}
                    className="input" 
                    placeholder="Enter assignment title" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select 
                    className="input"
                    name="course"
                    value={newAssignmentData.course}
                    onChange={handleNewAssignmentChange}
                    required
                  >
                    <option value="">Select a course</option>
                    <option value="Kinyarwanda Language Essentials">Kinyarwanda Language Essentials</option>
                    <option value="Traditional Rwandan Art & Crafts">Traditional Rwandan Art & Crafts</option>
                    <option value="Rwanda History & Cultural Heritage">Rwanda History & Cultural Heritage</option>
                    <option value="Rwandan Cuisine & Culinary Traditions">Rwandan Cuisine & Culinary Traditions</option>
                    <option value="Traditional Music & Dance">Traditional Music & Dance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    className="input" 
                    rows={3} 
                    name="description"
                    value={newAssignmentData.description}
                    onChange={handleNewAssignmentChange}
                    placeholder="Enter assignment description"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input 
                      type="date" 
                      className="input"
                      name="dueDate"
                      value={newAssignmentData.dueDate}
                      onChange={handleNewAssignmentChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <input 
                      type="number" 
                      className="input" 
                      placeholder="100"
                      name="points"
                      value={newAssignmentData.points}
                      onChange={handleNewAssignmentChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Assignment Modal */}
      <AnimatePresence>
        {showEditModal && currentAssignment && (
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Edit Assignment</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleUpdateAssignment}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={editAssignmentData.title}
                    onChange={handleEditAssignmentChange}
                    className="input" 
                    placeholder="Enter assignment title" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select 
                    className="input"
                    name="course"
                    value={editAssignmentData.course}
                    onChange={handleEditAssignmentChange}
                    required
                  >
                    <option value="">Select a course</option>
                    <option value="Kinyarwanda Language Essentials">Kinyarwanda Language Essentials</option>
                    <option value="Traditional Rwandan Art & Crafts">Traditional Rwandan Art & Crafts</option>
                    <option value="Rwanda History & Cultural Heritage">Rwanda History & Cultural Heritage</option>
                    <option value="Rwandan Cuisine & Culinary Traditions">Rwandan Cuisine & Culinary Traditions</option>
                    <option value="Traditional Music & Dance">Traditional Music & Dance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    className="input" 
                    rows={3} 
                    name="description"
                    value={editAssignmentData.description}
                    onChange={handleEditAssignmentChange}
                    placeholder="Enter assignment description"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input 
                      type="date" 
                      className="input"
                      name="dueDate"
                      value={editAssignmentData.dueDate}
                      onChange={handleEditAssignmentChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <input 
                      type="number" 
                      className="input" 
                      placeholder="100"
                      name="points"
                      value={editAssignmentData.points}
                      onChange={handleEditAssignmentChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Assignment Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && currentAssignment && (
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
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Delete Assignment</h2>
              </div>
              
              <p className="mb-6">
                Are you sure you want to delete "{currentAssignment.title}"? This action cannot be undone and will remove all associated submissions.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleDeleteAssignment}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Assignment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Assignment Details Modal */}
      <AnimatePresence>
        {showViewModal && currentAssignment && (
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
              className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold">{currentAssignment.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentAssignment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentAssignment.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{currentAssignment.course}</p>
                </div>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p>{currentAssignment.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Due Date</span>
                  </div>
                  <p className="font-medium">{new Date(currentAssignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Points</span>
                  </div>
                  <p className="font-medium">{currentAssignment.points}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Submissions</span>
                  </div>
                  <p className="font-medium">{currentAssignment.submissionsCount}/{currentAssignment.totalStudents}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Student Submissions</h3>
                
                {getCurrentAssignmentSubmissions().length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getCurrentAssignmentSubmissions().map(submission => (
                      <div key={submission.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h4 className="font-medium">{submission.studentName}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full ${
                                submission.status === 'graded'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {submission.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 flex items-center space-x-1 hover:bg-gray-200 transition-colors"
                              onClick={() => toast.success(`Downloading ${submission.attachmentUrl}`)}
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </button>
                            {submission.status === 'ungraded' && (
                              <button 
                                className="px-3 py-1 bg-black text-white rounded-lg text-sm flex items-center space-x-1 hover:bg-opacity-80 transition-colors"
                                onClick={() => toast.success(`Grading submission from ${submission.studentName}`)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Grade</span>
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {submission.status === 'graded' && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium">Score: {submission.score}/{currentAssignment.points}</span>
                            </div>
                            <p className="text-sm text-gray-600">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button 
                  className="btn btn-primary flex items-center space-x-2"
                  onClick={() => {
                    setShowViewModal(false);
                    handleOpenEditModal(currentAssignment);
                  }}
                >
                  <Edit size={16} />
                  <span>Edit Assignment</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeacherAssignments;