import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock assignments data with status management
const initialAssignments = [
  {
    id: 1,
    title: 'Kinyarwanda Dialogue Writing',
    course: 'Kinyarwanda Language Essentials',
    dueDate: '2024-03-15',
    status: 'pending',
    description: 'Write a dialogue in Kinyarwanda about a traditional family gathering, incorporating cultural greetings and customs.',
    points: 100,
    instructions: 'Ensure your dialogue includes traditional greetings, kinship terms, and at least one cultural practice. Minimum length: 500 words.'
  },
  {
    id: 2,
    title: 'Imigongo Art Project',
    course: 'Traditional Rwandan Art & Crafts',
    dueDate: '2024-03-20',
    status: 'submitted',
    description: 'Create a detailed sketch of an Imigongo pattern and explain its cultural significance and symbolism.',
    points: 150,
    submissionDate: '2024-03-19',
    instructions: 'Your submission should include both the sketch and a 300-word explanation of the cultural significance of your chosen pattern.'
  },
  {
    id: 3,
    title: 'Historical Analysis',
    course: 'Rwanda History & Cultural Heritage',
    dueDate: '2024-03-25',
    status: 'graded',
    grade: 95,
    description: 'Write an essay about the significance of Ubwiru in ancient Rwandan kingdom administration.',
    points: 120,
    submissionDate: '2024-03-18',
    feedback: 'Excellent analysis of the historical context and cultural implications. Your research on the secretive rituals was particularly insightful.',
    instructions: 'Research and write a 1000-word essay on the role and significance of Ubwiru in governance structures of ancient Rwanda.'
  },
];

function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [activeAssignment, setActiveAssignment] = useState<null | typeof assignments[0]>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Function to handle viewing assignment details
  const handleViewDetails = (assignment: typeof assignments[0]) => {
    setActiveAssignment(assignment);
    setShowModal(true);
  };

  // Function to handle opening the submission modal
  const handleSubmitAssignment = (assignment: typeof assignments[0]) => {
    setActiveAssignment(assignment);
    setShowSubmissionModal(true);
  };

  // Function to handle actual submission
  const submitAssignment = () => {
    if (!activeAssignment || !selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    // Update assignment in state
    const updatedAssignments = assignments.map(a => 
      a.id === activeAssignment.id 
        ? { 
            ...a, 
            status: 'submitted', 
            submissionDate: new Date().toISOString().split('T')[0]
          } 
        : a
    );

    setAssignments(updatedAssignments);
    setShowSubmissionModal(false);
    setSelectedFile(null);
    toast.success('Assignment submitted successfully!');
  };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cultural Assignments</h1>
        <p className="mt-2 text-gray-600">Track and manage your learning journey through Rwandan culture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                  <p className="text-gray-600 mt-1">{assignment.course}</p>
                </div>
                <div className="flex items-center">
                  {assignment.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  )}
                  {assignment.status === 'submitted' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Submitted
                    </span>
                  )}
                  {assignment.status === 'graded' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Graded: {assignment.grade}%
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4">{assignment.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{assignment.points} points</span>
                  </div>
                </div>

                <button 
                  onClick={() => 
                    assignment.status === 'pending' 
                      ? handleSubmitAssignment(assignment) 
                      : handleViewDetails(assignment)
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {assignment.status === 'pending' ? 'Submit Assignment' : 'View Details'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Assignment Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Assignments</span>
                <span className="font-semibold">{assignments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold">
                  {assignments.filter(a => a.status !== 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold">
                  {assignments.filter(a => a.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Grade</span>
                <span className="font-semibold">
                  {assignments
                    .filter(a => a.status === 'graded' && 'grade' in a)
                    .reduce((acc, curr) => acc + (curr.grade || 0), 0) / 
                    assignments.filter(a => a.status === 'graded' && 'grade' in a).length || 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {assignments
                .filter(a => a.status === 'pending')
                .map(assignment => (
                  <div
                    key={assignment.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div className="ml-3">
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Details Modal */}
      {showModal && activeAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{activeAssignment.title}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mt-2">{activeAssignment.course}</p>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p>{activeAssignment.description}</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Instructions</h3>
              <p>{activeAssignment.instructions}</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span>{new Date(activeAssignment.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Points:</span>
                <span>{activeAssignment.points}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${activeAssignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    activeAssignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}
                >
                  {activeAssignment.status.charAt(0).toUpperCase() + activeAssignment.status.slice(1)}
                </span>
              </div>
              {activeAssignment.submissionDate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span>{new Date(activeAssignment.submissionDate).toLocaleDateString()}</span>
                </div>
              )}
              {activeAssignment.grade && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-semibold">{activeAssignment.grade}%</span>
                </div>
              )}
            </div>
            
            {activeAssignment.feedback && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">Feedback</h3>
                <p>{activeAssignment.feedback}</p>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              {activeAssignment.status === 'pending' && (
                <button 
                  onClick={() => {
                    setShowModal(false);
                    handleSubmitAssignment(activeAssignment);
                  }} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Assignment
                </button>
              )}
              {activeAssignment.status === 'submitted' && (
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  disabled
                >
                  Awaiting Grade
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {showSubmissionModal && activeAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">Submit Assignment</h2>
              <button 
                onClick={() => setShowSubmissionModal(false)}
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mt-2">{activeAssignment.title}</p>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Upload Your Submission</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop or click to browse
                </p>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="mt-4 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
              
              {selectedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <button 
                onClick={() => setShowSubmissionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={submitAssignment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={!selectedFile}
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Assignments;