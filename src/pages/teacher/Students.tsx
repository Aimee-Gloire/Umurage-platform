import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Users, Mail, Phone, 
  Calendar, BookOpen, Award, BarChart, 
  MessageSquare, Eye, Ban, X, CheckCircle,
  ChevronRight, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockStudents = [
  {
    id: 1,
    name: 'Mutesi Alice',
    email: 'alice.m@example.com',
    phone: '+250 788 123 456',
    enrollmentDate: '2024-01-15',
    courses: ['Kinyarwanda Language Essentials', 'Traditional Rwandan Art & Crafts'],
    progress: 85,
    attendance: 92,
    avgScore: 88,
    status: 'active',
    bio: 'A dedicated student with a passion for Rwandan art and traditional designs. Has shown exceptional progress in learning Kinyarwanda phrases and cultural contexts.',
    level: 'Intermediate',
    certificates: [
      { name: 'Kinyarwanda Basics', date: '2024-02-15' }
    ],
    submissions: [
      { title: 'Traditional Family Gathering Dialogue', grade: 'A', date: '2024-02-12' },
      { title: 'Imigongo Art Pattern Design', grade: 'B+', date: '2024-03-05' }
    ]
  },
  {
    id: 2,
    name: 'Mugisha Bob',
    email: 'bob.m@example.com',
    phone: '+250 788 234 567',
    enrollmentDate: '2024-01-20',
    courses: ['Rwanda History & Cultural Heritage', 'Traditional Rwandan Art & Crafts'],
    progress: 75,
    attendance: 88,
    avgScore: 82,
    status: 'active',
    bio: 'History enthusiast focused on pre-colonial Rwandan kingdom structures. Shows great interest in traditional art forms and their historical significance.',
    level: 'Advanced',
    certificates: [
      { name: 'Rwandan History Fundamentals', date: '2024-02-28' }
    ],
    submissions: [
      { title: 'Essay on Ubwiru in Ancient Rwanda', grade: 'A-', date: '2024-02-20' },
      { title: 'Traditional Symbols Research', grade: 'B', date: '2024-03-10' }
    ]
  },
  {
    id: 3,
    name: 'Uwase Carol',
    email: 'carol.u@example.com',
    phone: '+250 788 345 678',
    enrollmentDate: '2024-02-01',
    courses: ['Kinyarwanda Language Essentials'],
    progress: 92,
    attendance: 95,
    avgScore: 94,
    status: 'active',
    bio: 'Exceptional language learner with a natural ability to grasp Kinyarwanda pronunciation and grammar. Has family roots in Rwanda and is eager to connect with her heritage.',
    level: 'Beginner',
    certificates: [],
    submissions: [
      { title: 'Kinyarwanda Conversation Practice', grade: 'A+', date: '2024-02-25' },
      { title: 'Cultural Phrases Collection', grade: 'A', date: '2024-03-15' }
    ]
  }
];

function TeacherStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [students, setStudents] = useState(mockStudents);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Handle view student profile
  const handleViewStudent = (student: any) => {
    setCurrentStudent(student);
    setShowViewModal(true);
    setActiveTab('overview');
  };

  // Handle message to student
  const handleMessageOpen = (student: any) => {
    setCurrentStudent(student);
    setShowMessageModal(true);
    setMessage('');
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    toast.success(`Message sent to ${currentStudent.name}`);
    setMessage('');
    setShowMessageModal(false);
  };

  // Handle deactivate student modal
  const handleDeactivateOpen = (student: any) => {
    setCurrentStudent(student);
    setShowDeactivateModal(true);
  };

  // Handle deactivate student
  const handleDeactivateStudent = () => {
    const updatedStudents = students.map(student => {
      if (student.id === currentStudent.id) {
        return {
          ...student,
          status: student.status === 'active' ? 'inactive' : 'active'
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    setShowDeactivateModal(false);
    toast.success(`${currentStudent.name}'s account has been ${currentStudent.status === 'active' ? 'deactivated' : 'activated'}`);
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || 
                         student.courses.some(course => 
                           course.toLowerCase().includes(courseFilter.toLowerCase()));
    
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-1">Monitor student progress in cultural education</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: students.length.toString(), icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Cultural Proficiency', value: `${Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length)}%`, icon: BarChart, color: 'bg-green-50 text-green-600' },
          { label: 'Average Score', value: `${Math.round(students.reduce((sum, student) => sum + student.avgScore, 0) / students.length)}%`, icon: Award, color: 'bg-yellow-50 text-yellow-600' },
          { 
            label: 'Active Courses', 
            value: [...new Set(students.flatMap(student => student.courses))].length.toString(), 
            icon: BookOpen, 
            color: 'bg-purple-50 text-purple-600' 
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-full ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="all">All Courses</option>
            <option value="Kinyarwanda Language Essentials">Kinyarwanda Language Essentials</option>
            <option value="Traditional Rwandan Art & Crafts">Traditional Rwandan Art & Crafts</option>
            <option value="Rwanda History & Cultural Heritage">Rwanda History & Cultural Heritage</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Courses</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Performance</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full bg-gray-200"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`}
                        alt={student.name}
                      />
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">
                          Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {student.email}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {student.courses.map((course, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black rounded-full h-2"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {student.progress}% Complete
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Attendance:</span>
                        <span className="font-medium">{student.attendance}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Avg. Score:</span>
                        <span className="font-medium">{student.avgScore}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => handleViewStudent(student)}
                      >
                        <Eye className="h-5 w-5 text-gray-600" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => handleMessageOpen(student)}
                      >
                        <MessageSquare className="h-5 w-5 text-gray-600" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => handleDeactivateOpen(student)}
                      >
                        <Ban className="h-5 w-5 text-red-500" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Student Modal */}
      <AnimatePresence>
        {showViewModal && currentStudent && (
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
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 rounded-full bg-gray-200"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStudent.email}`}
                    alt={currentStudent.name}
                  />
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{currentStudent.name}</h2>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        currentStudent.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {currentStudent.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">Level: {currentStudent.level}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex space-x-4">
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'progress' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('progress')}
                  >
                    Progress
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'courses' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('courses')}
                  >
                    Courses
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'submissions' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('submissions')}
                  >
                    Submissions
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-500 mr-2" />
                            <span>{currentStudent.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-500 mr-2" />
                            <span>{currentStudent.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <span>Enrolled: {new Date(currentStudent.enrollmentDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Performance Summary</h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Progress:</span>
                            <div className="flex items-center">
                              <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                                <div
                                  className="bg-black rounded-full h-2"
                                  style={{ width: `${currentStudent.progress}%` }}
                                />
                              </div>
                              <span>{currentStudent.progress}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Attendance:</span>
                            <span className="font-medium">{currentStudent.attendance}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Average Score:</span>
                            <span className="font-medium">{currentStudent.avgScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Biography</h3>
                      <p className="bg-gray-50 rounded-xl p-4">{currentStudent.bio}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Enrolled Courses</h3>
                      <div className="space-y-2">
                        {currentStudent.courses.map((course: string, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                            <span>{course}</span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'progress' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Learning Progress</h3>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="mb-6">
                          <h4 className="text-sm text-gray-500 mb-2">Overall Progress</h4>
                          <div className="h-4 bg-gray-200 rounded-full">
                            <div 
                              className="h-4 bg-black rounded-full"
                              style={{ width: `${currentStudent.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-sm">
                            <span>0%</span>
                            <span className="font-medium">{currentStudent.progress}%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold">{currentStudent.avgScore}%</div>
                            <div className="text-sm text-gray-500">Average Score</div>
                          </div>
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold">{currentStudent.attendance}%</div>
                            <div className="text-sm text-gray-500">Attendance Rate</div>
                          </div>
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold">{currentStudent.submissions?.length || 0}</div>
                            <div className="text-sm text-gray-500">Submissions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Certificates</h3>
                      {currentStudent.certificates.length > 0 ? (
                        <div className="space-y-2">
                          {currentStudent.certificates.map((cert: any, index: number) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                                <div>
                                  <div className="font-medium">{cert.name}</div>
                                  <div className="text-sm text-gray-500">Awarded: {new Date(cert.date).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <button 
                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center space-x-1 hover:bg-gray-200 transition-colors"
                                onClick={() => toast.success(`Viewing ${cert.name} certificate`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                <span>View</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500">
                          No certificates awarded yet
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Enrolled Courses</h3>
                      {currentStudent.courses.map((course: string, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">{course}</h4>
                            <span className="px-2 py-1 bg-black text-white rounded-full text-xs">
                              In Progress
                            </span>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{60 + Math.floor(Math.random() * 30)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-black rounded-full"
                                style={{ width: `${60 + Math.floor(Math.random() * 30)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Last activity: {new Date().toLocaleDateString()}</span>
                            <button 
                              className="text-black hover:underline"
                              onClick={() => toast.success(`Viewing details for ${course}`)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'submissions' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recent Submissions</h3>
                      {currentStudent.submissions?.length > 0 ? (
                        <div className="space-y-4">
                          {currentStudent.submissions.map((submission: any, index: number) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{submission.title}</h4>
                                <div className={`px-2 py-1 rounded-full text-xs ${
                                  submission.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                                  submission.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  Grade: {submission.grade}
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">
                                Submitted: {new Date(submission.date).toLocaleDateString()}
                              </div>
                              <div className="flex justify-end mt-2">
                                <button 
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                                  onClick={() => toast.success(`Viewing submission: ${submission.title}`)}
                                >
                                  View Submission
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500">
                          No submissions yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
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
                    handleMessageOpen(currentStudent);
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Message Student</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Student Modal */}
      <AnimatePresence>
        {showMessageModal && currentStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Message to {currentStudent.name}</h2>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={5}
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deactivate Student Modal */}
      <AnimatePresence>
        {showDeactivateModal && currentStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeactivateModal(false)}
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
                <h2 className="text-xl font-bold">
                  {currentStudent.status === 'active' ? 'Deactivate' : 'Activate'} Student Account
                </h2>
              </div>
              
              <p className="mb-6">
                Are you sure you want to {currentStudent.status === 'active' ? 'deactivate' : 'activate'} {currentStudent.name}'s account? 
                {currentStudent.status === 'active' 
                  ? ' They will no longer be able to access the platform until reactivated.' 
                  : ' They will regain access to the platform and all their previous data.'}
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeactivateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleDeactivateStudent}
                  className={`btn ${currentStudent.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {currentStudent.status === 'active' ? 'Deactivate' : 'Activate'} Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeacherStudents;