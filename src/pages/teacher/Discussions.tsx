import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Filter, User, 
  Clock, ThumbsUp, Reply, Pin, Edit, 
  Trash2, AlertCircle, PlusCircle, X, Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const initialDiscussions = [
  {
    id: 1,
    title: 'Understanding Kinyarwanda Proverbs',
    course: 'Kinyarwanda Language Essentials',
    author: 'Mutesi Alice',
    content: 'Can someone explain the meaning and cultural context of "Inkingi imwe ntigera inzu"?',
    replies: 8,
    likes: 15,
    timestamp: '2 hours ago',
    tags: ['proverbs', 'language', 'culture'],
    pinned: true,
    status: 'active'
  },
  {
    id: 2,
    title: 'Imigongo Art Patterns',
    course: 'Traditional Rwandan Art & Crafts',
    author: 'Mugisha Bob',
    content: 'What are the traditional geometric patterns used in Imigongo art and their significance?',
    replies: 12,
    likes: 20,
    timestamp: '5 hours ago',
    tags: ['art', 'tradition', 'patterns'],
    pinned: false,
    status: 'active'
  },
  {
    id: 3,
    title: 'Traditional Wedding Customs',
    course: 'Rwanda History & Cultural Heritage',
    author: 'Uwase Carol',
    content: 'Looking for insights about the significance of Gusaba ceremony in traditional Rwandan weddings.',
    replies: 6,
    likes: 10,
    timestamp: '1 day ago',
    tags: ['wedding', 'traditions', 'ceremonies'],
    pinned: false,
    status: 'resolved'
  }
];

function TeacherDiscussions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDiscussion, setCurrentDiscussion] = useState<any>(null);
  const [discussions, setDiscussions] = useState(initialDiscussions);
  
  // New discussion form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  
  // Filter discussions based on search query and status filter
  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || discussion.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle discussion actions
  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle.trim() || !newCourse || !newContent.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const tagsArray = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const newDiscussion = {
      id: discussions.length + 1,
      title: newTitle,
      course: newCourse,
      author: 'Teacher',
      content: newContent,
      replies: 0,
      likes: 0,
      timestamp: 'Just now',
      tags: tagsArray,
      pinned: false,
      status: 'active'
    };
    
    setDiscussions([newDiscussion, ...discussions]);
    toast.success('Discussion created successfully');
    
    // Reset form
    setNewTitle('');
    setNewCourse('');
    setNewContent('');
    setNewTags('');
    setShowCreateModal(false);
  };
  
  const handleEditDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentDiscussion) return;
    
    if (!newTitle.trim() || !newCourse || !newContent.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const tagsArray = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === currentDiscussion.id) {
        return {
          ...discussion,
          title: newTitle,
          course: newCourse,
          content: newContent,
          tags: tagsArray
        };
      }
      return discussion;
    });
    
    setDiscussions(updatedDiscussions);
    toast.success('Discussion updated successfully');
    setShowEditModal(false);
  };
  
  const handlePinDiscussion = (id: number) => {
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === id) {
        const newPinnedStatus = !discussion.pinned;
        toast.success(newPinnedStatus 
          ? 'Discussion pinned successfully' 
          : 'Discussion unpinned successfully');
        return { ...discussion, pinned: newPinnedStatus };
      }
      return discussion;
    });
    
    setDiscussions(updatedDiscussions);
  };
  
  const handleDeleteDiscussion = () => {
    if (!currentDiscussion) return;
    
    const updatedDiscussions = discussions.filter(
      discussion => discussion.id !== currentDiscussion.id
    );
    
    setDiscussions(updatedDiscussions);
    toast.success('Discussion deleted successfully');
    setShowDeleteModal(false);
  };
  
  const handleStatusChange = (id: number) => {
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === id) {
        const newStatus = discussion.status === 'active' ? 'resolved' : 'active';
        toast.success(`Discussion marked as ${newStatus}`);
        return { ...discussion, status: newStatus };
      }
      return discussion;
    });
    
    setDiscussions(updatedDiscussions);
  };
  
  const openEditModal = (discussion: any) => {
    setCurrentDiscussion(discussion);
    setNewTitle(discussion.title);
    setNewCourse(discussion.course);
    setNewContent(discussion.content);
    setNewTags(discussion.tags.join(', '));
    setShowEditModal(true);
  };
  
  const openDeleteModal = (discussion: any) => {
    setCurrentDiscussion(discussion);
    setShowDeleteModal(true);
  };
  
  const handleLike = (id: number) => {
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === id) {
        return { ...discussion, likes: discussion.likes + 1 };
      }
      return discussion;
    });
    
    setDiscussions(updatedDiscussions);
    toast.success('Liked the discussion');
  };
  
  const handleViewReplies = (discussion: any) => {
    toast.success(`Viewing ${discussion.replies} replies to: ${discussion.title}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cultural Discussions</h1>
          <p className="text-gray-600 mt-1">Manage cultural learning discussions and interactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Create Discussion</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Total Discussions', 
            value: discussions.length.toString(), 
            trend: `+${discussions.filter(d => d.timestamp.includes('hour') || d.timestamp.includes('Just')).length} today` 
          },
          { 
            label: 'Active Threads', 
            value: discussions.filter(d => d.status === 'active').length.toString(), 
            trend: '+3 today' 
          },
          { 
            label: 'Student Participation', 
            value: '85%', 
            trend: '+5% vs last week' 
          },
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
                <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-black" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search discussions..."
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
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {discussion.pinned && (
                      <Pin className="h-5 w-5 text-yellow-500" />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {discussion.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      discussion.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {discussion.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">in {discussion.course}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => openEditModal(discussion)}
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handlePinDiscussion(discussion.id)}
                  >
                    <Pin className={`h-5 w-5 ${discussion.pinned ? 'text-yellow-500' : 'text-gray-600'}`} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => openDeleteModal(discussion)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </motion.button>
                </div>
              </div>

              <p className="text-gray-700 mt-4">{discussion.content}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {discussion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{discussion.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{discussion.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(discussion.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>{discussion.likes}</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewReplies(discussion)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                  >
                    <Reply className="h-5 w-5" />
                    <span>{discussion.replies} replies</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(discussion.id)}
                    className={`px-3 py-1 rounded-lg text-xs flex items-center space-x-1 ${
                      discussion.status === 'active'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    <span>{discussion.status === 'active' ? 'Mark Resolved' : 'Reopen'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'Create your first discussion to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Create Discussion Modal */}
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Create New Discussion</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter discussion title" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    required
                  >
                    <option value="">Select a course</option>
                    <option value="Kinyarwanda Language Essentials">Kinyarwanda Language Essentials</option>
                    <option value="Traditional Rwandan Art & Crafts">Traditional Rwandan Art & Crafts</option>
                    <option value="Rwanda History & Cultural Heritage">Rwanda History & Cultural Heritage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={4}
                    placeholder="Enter discussion content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter tags separated by commas"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Create Discussion
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Discussion Modal */}
      <AnimatePresence>
        {showEditModal && currentDiscussion && (
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Edit Discussion</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleEditDiscussion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter discussion title" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    required
                  >
                    <option value="">Select a course</option>
                    <option value="Kinyarwanda Language Essentials">Kinyarwanda Language Essentials</option>
                    <option value="Traditional Rwandan Art & Crafts">Traditional Rwandan Art & Crafts</option>
                    <option value="Rwanda History & Cultural Heritage">Rwanda History & Cultural Heritage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={4}
                    placeholder="Enter discussion content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter tags separated by commas"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Update Discussion
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && currentDiscussion && (
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Delete Discussion</h2>
              </div>
              
              <p className="mb-6">
                Are you sure you want to delete the discussion "{currentDiscussion.title}"? This action cannot be undone and will remove all associated replies.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleDeleteDiscussion}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeacherDiscussions;