import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, PlusCircle, FileText, MessageSquare, 
  Award, Clock, Calendar, BarChart3, Scroll,
  History, BookOpen, Star, CheckCircle, X, Eye,
  ChevronRight, Edit, Send, Trash2, AlertTriangle,
  TrendingUp, Bookmark, Activity, UserCheck, CircleCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { toast } from 'react-hot-toast';

const mockStories = [
  {
    id: 1,
    title: 'The Legend of Nyirabukara',
    status: 'pending',
    author: 'Mutesi Alice',
    submitted: '2 hours ago',
    content: 'This traditional Rwandan folklore tells the story of Nyirabukara, a legendary female figure known for her wisdom and courage. The tale highlights important cultural values like community support, bravery, and the passing of knowledge through generations.'
  },
  {
    id: 2,
    title: 'Traditional Wedding Customs in Rwanda',
    status: 'published',
    author: 'Mugisha Bob',
    submitted: '1 day ago',
    content: 'Rwandan traditional weddings, known as "Gusaba" and "Gukwa," involve elaborate ceremonies with specific customs and rituals. This story details the process from proposal to celebration, showcasing the cultural significance of marriage in Rwandan society.'
  },
  {
    id: 3,
    title: 'The Significance of Imigongo Art',
    status: 'pending',
    author: 'Uwase Sarah',
    submitted: '3 hours ago',
    content: 'Imigongo is a traditional Rwandan art form characterized by geometric patterns. This story explores its historical origins in the eastern province, the creation process using cow dung, and its cultural symbolism in Rwandan homes and modern adaptations.'
  }
];

const mockAnnouncements = [
  { 
    id: 1, 
    course: 'Kinyarwanda Language Essentials', 
    message: 'New cultural context materials added for Week 3', 
    time: '2 hours ago' 
  },
  { 
    id: 2, 
    course: 'Traditional Rwandan Art & Crafts', 
    message: 'Upcoming Imigongo art workshop next week', 
    time: '5 hours ago' 
  },
  {
    id: 3,
    course: 'Rwanda History & Cultural Heritage',
    message: 'New module on traditional ceremonies released',
    time: '1 day ago'
  }
];

const stats = [
  { label: 'Total Students', value: '133', icon: Users },
  { label: 'Cultural Stories', value: '25', icon: Scroll },
  { label: 'Avg. Engagement', value: '85%', icon: BarChart3 },
  { label: 'Stories to Review', value: '12', icon: Clock },
];

const upcomingReviews = [
  {
    id: 1,
    title: 'Review: Traditional Wedding Customs',
    type: 'review',
    time: 'Today, 2:00 PM',
    icon: Calendar,
    link: '/teacher/courses/2'
  },
  {
    id: 2,
    title: 'Cultural Heritage Meeting',
    type: 'meeting',
    time: 'Tomorrow, 11:00 AM',
    icon: History,
    link: '/teacher/meetings'
  },
  {
    id: 3,
    title: 'Kinyarwanda Lesson Review',
    type: 'lesson',
    time: 'Wednesday, 10:00 AM',
    icon: BookOpen,
    link: '/teacher/courses/1/lessons'
  }
];

// Analytics mock data
const detailedAnalytics = {
  publishedStories: [
    { week: 'Week 1', count: 4 },
    { week: 'Week 2', count: 7 },
    { week: 'Week 3', count: 5 },
    { week: 'Week 4', count: 12 },
    { week: 'Week 5', count: 8 },
    { week: 'Week 6', count: 9 }
  ],
  topContributors: [
    { name: 'Mugisha Bob', count: 14 },
    { name: 'Mutesi Alice', count: 11 },
    { name: 'Uwase Sarah', count: 9 },
    { name: 'Nshimiye Jean', count: 7 },
    { name: 'Gahigi Paul', count: 6 }
  ],
  engagementByContent: [
    { category: 'Traditional Folklore', engagement: 92 },
    { category: 'Cultural Customs', engagement: 87 },
    { category: 'Historical Events', engagement: 78 },
    { category: 'Traditional Practices', engagement: 83 },
    { category: 'Traditional Art', engagement: 90 }
  ],
  completionRates: [
    { course: 'Kinyarwanda Language Essentials', rate: 76 },
    { course: 'Traditional Rwandan Art & Crafts', rate: 82 },
    { course: 'Rwanda History & Cultural Heritage', rate: 68 },
    { course: 'Rwandan Cuisine & Culinary Traditions', rate: 73 },
    { course: 'Traditional Music & Dance', rate: 79 }
  ]
};

function TeacherDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showDeleteStoryModal, setShowDeleteStoryModal] = useState(false);
  const [showDeleteAnnouncementModal, setShowDeleteAnnouncementModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [stories, setStories] = useState(mockStories);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [announcementFormData, setAnnouncementFormData] = useState({
    course: '',
    message: ''
  });
  const [storyFormData, setStoryFormData] = useState({ 
    title: '', 
    category: '', 
    content: '' 
  });
  const [allReviews, setAllReviews] = useState([
    ...upcomingReviews,
    {
      id: 4,
      title: 'Rwandan Folklore Module Review',
      type: 'lesson',
      time: 'Next Monday, 9:00 AM',
      icon: BookOpen,
      link: '/teacher/courses/3/lessons'
    },
    {
      id: 5,
      title: 'Traditional Instruments Course Revision',
      type: 'review',
      time: 'Next Tuesday, 2:30 PM',
      icon: Calendar,
      link: '/teacher/courses/4'
    },
    {
      id: 6,
      title: 'Rwandan Cultural Heritage Committee',
      type: 'meeting',
      time: 'Next Friday, 11:00 AM',
      icon: History,
      link: '/teacher/meetings/committee'
    }
  ]);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState('stories');
  
  const { user } = useAuthStore();

  // Handle view/edit story
  const handleViewStory = (story: any) => {
    setSelectedStory(story);
    setShowStoryModal(true);
  };

  // Handle adding comment to story
  const handleCommentStory = (story: any) => {
    setSelectedStory(story);
    setShowCommentModal(true);
  };

  // Submit comment
  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    toast.success(`Comment added to "${selectedStory.title}"`);
    setComment('');
    setShowCommentModal(false);
  };

  // Submit new story form
  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyFormData.title || !storyFormData.category || !storyFormData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Create new story
    const newStory = {
      id: stories.length + 1,
      title: storyFormData.title,
      status: 'pending',
      author: user?.name || 'Teacher',
      submitted: 'Just now',
      content: storyFormData.content
    };
    
    // Update stories
    setStories([newStory, ...stories]);
    
    // Reset form and close modal
    setStoryFormData({ title: '', category: '', content: '' });
    setShowCreateModal(false);
    
    toast.success('Cultural story created successfully!');
  };

  // Handle story form input changes
  const handleStoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStoryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle approve/publish story
  const handleApproveStory = (storyId: number) => {
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        return { ...story, status: 'published' };
      }
      return story;
    });
    
    setStories(updatedStories);
    setShowStoryModal(false);
    toast.success('Story approved and published!');
  };

  // Handle announcement form input changes
  const handleAnnouncementInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAnnouncementFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit announcement form
  const handleSubmitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!announcementFormData.course || !announcementFormData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Create new announcement
    const newAnnouncement = {
      id: announcements.length + 1,
      course: announcementFormData.course,
      message: announcementFormData.message,
      time: 'Just now'
    };
    
    // Update announcements
    setAnnouncements([newAnnouncement, ...announcements]);
    
    // Reset form and close modal
    setAnnouncementFormData({ course: '', message: '' });
    setShowAnnouncementModal(false);
    
    toast.success('Announcement created successfully!');
  };

  // Handle upcoming review click
  const handleReviewClick = (review: any) => {
    // In a real app, you would navigate to the specific route
    console.log(`Navigating to: ${review.link}`);
    
    // For demonstration, we'll show details for this review
    switch (review.type) {
      case 'review':
        toast.success(`Opening course review: ${review.title}`);
        break;
      case 'meeting':
        toast.success(`Opening meeting details: ${review.title}`);
        break;
      case 'lesson':
        toast.success(`Opening lesson review: ${review.title}`);
        break;
      default:
        toast.success(`Opening ${review.title}`);
    }
  };

  // Handle delete story
  const handleDeleteStory = (e: React.MouseEvent, storyId: number) => {
    e.stopPropagation();
    const storyToDelete = stories.find(story => story.id === storyId);
    setSelectedStory(storyToDelete);
    setShowDeleteStoryModal(true);
  };

  // Confirm delete story
  const confirmDeleteStory = () => {
    if (!selectedStory) return;
    
    const updatedStories = stories.filter(story => story.id !== selectedStory.id);
    setStories(updatedStories);
    setShowDeleteStoryModal(false);
    toast.success(`Story "${selectedStory.title}" deleted successfully`);
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = (e: React.MouseEvent, announcementId: number) => {
    e.stopPropagation();
    const announcementToDelete = announcements.find(announcement => announcement.id === announcementId);
    setSelectedAnnouncement(announcementToDelete);
    setShowDeleteAnnouncementModal(true);
  };

  // Confirm delete announcement
  const confirmDeleteAnnouncement = () => {
    if (!selectedAnnouncement) return;
    
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== selectedAnnouncement.id);
    setAnnouncements(updatedAnnouncements);
    setShowDeleteAnnouncementModal(false);
    toast.success(`Announcement deleted successfully`);
  };

  // Filter reviews by type
  const filterReviews = (type: string) => {
    setReviewFilter(type);
  };

  // Get filtered reviews
  const getFilteredReviews = () => {
    if (reviewFilter === 'all') return allReviews;
    return allReviews.filter(review => review.type === reviewFilter);
  };

  // Handle analytics tab change
  const handleAnalyticsTabChange = (tab: string) => {
    setAnalyticsTab(tab);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Murakaza neza, {user?.name}</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Create Cultural Story</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => toast.success(`Viewing ${stat.label} details`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-black" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cultural Stories</h2>
            <div className="space-y-4">
              {stories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{story.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-600">By {story.author}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          story.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {story.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleViewStory(story)}
                      >
                        <FileText className="h-5 w-5" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleCommentStory(story)}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500"
                        onClick={(e) => handleDeleteStory(e, story.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Submitted: {story.submitted}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Recent Activity</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAnnouncementModal(true)}
                className="text-sm font-medium text-black hover:underline"
              >
                + Add Announcement
              </motion.button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative group"
                >
                  <MessageSquare className="h-5 w-5 text-gray-600 mt-1" />
                  <div className="flex-1" onClick={() => toast.success(`Opening announcement for ${announcement.course}`)}>
                    <p className="font-medium">{announcement.course}</p>
                    <p className="text-gray-600">{announcement.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{announcement.time}</p>
                  </div>
                  <button 
                    className="p-2 rounded-full hover:bg-gray-200 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"
                    onClick={(e) => handleDeleteAnnouncement(e, announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Reviews</h2>
            <div className="space-y-4">
              {upcomingReviews.map((review) => (
                <div 
                  key={review.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleReviewClick(review)}
                >
                  <review.icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{review.title}</p>
                    <p className="text-sm text-gray-600">{review.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button 
                className="text-sm font-medium text-black hover:underline w-full text-center"
                onClick={() => setShowReviewsModal(true)}
              >
                View All Scheduled Reviews
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Cultural Content Stats</h2>
            <div className="space-y-4">
              <motion.div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => toast.success('Viewing published stories')}
              >
                <span className="text-gray-600">Stories Published</span>
                <span className="font-semibold">45</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => toast.success('Viewing cultural lessons')}
              >
                <span className="text-gray-600">Cultural Lessons</span>
                <span className="font-semibold">28</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => toast.success('Viewing student contributions')}
              >
                <span className="text-gray-600">Student Contributions</span>
                <span className="font-semibold">89</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => toast.success('Viewing active discussions')}
              >
                <span className="text-gray-600">Active Discussions</span>
                <span className="font-semibold">34</span>
              </motion.div>
            </div>
            <div className="mt-4">
              <button 
                className="text-sm font-medium text-black hover:underline w-full text-center"
                onClick={() => setShowAnalyticsModal(true)}
              >
                View Detailed Analytics
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Create Story Modal */}
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
              <h2 className="text-2xl font-bold mb-4">Create New Cultural Story</h2>
              <form className="space-y-4" onSubmit={handleSubmitStory}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Story Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={storyFormData.title}
                    onChange={handleStoryInputChange}
                    className="input" 
                    placeholder="Enter story title" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    className="input" 
                    name="category"
                    value={storyFormData.category}
                    onChange={handleStoryInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="folklore">Traditional Folklore</option>
                    <option value="customs">Cultural Customs</option>
                    <option value="history">Historical Events</option>
                    <option value="traditions">Traditional Practices</option>
                    <option value="art">Traditional Art</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    className="input"
                    rows={5}
                    name="content"
                    value={storyFormData.content}
                    onChange={handleStoryInputChange}
                    placeholder="Enter story content"
                    required
                  ></textarea>
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
                    Create Story
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Story Modal */}
      <AnimatePresence>
        {showStoryModal && selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowStoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStory.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">By {selectedStory.author}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      selectedStory.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedStory.status}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStoryModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="prose max-w-none mb-8">
                <p>{selectedStory.content}</p>
              </div>
              
              {selectedStory.status === 'pending' && (
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleApproveStory(selectedStory.id)}
                    className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve & Publish</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowStoryModal(false);
                      handleCommentStory(selectedStory);
                    }}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Add Feedback</span>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2">Add Feedback</h2>
              <p className="text-gray-600 mb-4">For: {selectedStory.title}</p>
              
              <form onSubmit={submitComment} className="space-y-4">
                <div>
                  <textarea
                    className="input"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your feedback or comments here..."
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCommentModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Modal */}
      <AnimatePresence>
        {showAnnouncementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAnnouncementModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Create New Announcement</h2>
                <button 
                  onClick={() => setShowAnnouncementModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmitAnnouncement}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    className="input"
                    name="course"
                    value={announcementFormData.course}
                    onChange={handleAnnouncementInputChange}
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
                  <label className="block text-sm font-medium text-gray-700">Announcement Message</label>
                  <textarea
                    className="input"
                    rows={4}
                    name="message"
                    value={announcementFormData.message}
                    onChange={handleAnnouncementInputChange}
                    placeholder="Enter announcement message"
                    required
                  ></textarea>
                </div>
                <div className="flex items-center mt-2">
                  <input 
                    type="checkbox" 
                    id="sendEmail" 
                    className="h-4 w-4 text-primary rounded border-gray-300"
                  />
                  <label htmlFor="sendEmail" className="ml-2 text-sm text-gray-700">
                    Also send as email to enrolled students
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex items-center space-x-2">
                    <Send size={16} />
                    <span>Publish Announcement</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Reviews Modal */}
      <AnimatePresence>
        {showReviewsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReviewsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Scheduled Reviews</h2>
                <button 
                  onClick={() => setShowReviewsModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex">
                  <button 
                    className={`inline-flex items-center justify-center py-1 px-3 rounded-full text-sm mr-2 ${
                      reviewFilter === 'all' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => filterReviews('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`inline-flex items-center justify-center py-1 px-3 rounded-full text-sm mr-2 ${
                      reviewFilter === 'review' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => filterReviews('review')}
                  >
                    Reviews
                  </button>
                  <button 
                    className={`inline-flex items-center justify-center py-1 px-3 rounded-full text-sm mr-2 ${
                      reviewFilter === 'meeting' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => filterReviews('meeting')}
                  >
                    Meetings
                  </button>
                  <button 
                    className={`inline-flex items-center justify-center py-1 px-3 rounded-full text-sm ${
                      reviewFilter === 'lesson' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => filterReviews('lesson')}
                  >
                    Lessons
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {getFilteredReviews().length > 0 ? (
                  <>
                    {getFilteredReviews().some(review => ['Today', 'Tomorrow', 'Wednesday'].includes(review.time.split(',')[0])) && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-700">This Week</h3>
                        {getFilteredReviews()
                          .filter(review => ['Today', 'Tomorrow', 'Wednesday'].includes(review.time.split(',')[0]))
                          .map((review) => (
                            <div 
                              key={review.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => {
                                handleReviewClick(review);
                                setShowReviewsModal(false);
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <review.icon className="h-5 w-5 text-gray-700" />
                                </div>
                                <div>
                                  <p className="font-medium">{review.title}</p>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                      review.type === 'review' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : review.type === 'meeting'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-green-100 text-green-800'
                                    }`}>
                                      {review.type === 'review' ? 'Course Review' : 
                                       review.type === 'meeting' ? 'Meeting' : 'Lesson Review'}
                                    </span>
                                    <span className="text-sm text-gray-600">{review.time}</span>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          ))
                        }
                      </>
                    )}
                    
                    {getFilteredReviews().some(review => review.time.startsWith('Next')) && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-700 mt-6">Next Week</h3>
                        {getFilteredReviews()
                          .filter(review => review.time.startsWith('Next'))
                          .map((review) => (
                            <div 
                              key={review.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => {
                                handleReviewClick(review);
                                setShowReviewsModal(false);
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <review.icon className="h-5 w-5 text-gray-700" />
                                </div>
                                <div>
                                  <p className="font-medium">{review.title}</p>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                      review.type === 'review' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : review.type === 'meeting'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-green-100 text-green-800'
                                    }`}>
                                      {review.type === 'review' ? 'Course Review' : 
                                       review.type === 'meeting' ? 'Meeting' : 'Lesson Review'}
                                    </span>
                                    <span className="text-sm text-gray-600">{review.time}</span>
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          ))
                        }
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No {reviewFilter === 'all' ? '' : reviewFilter} reviews scheduled</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowReviewsModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Story Confirmation Modal */}
      <AnimatePresence>
        {showDeleteStoryModal && selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteStoryModal(false)}
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
                <h2 className="text-xl font-bold">Delete Cultural Story</h2>
              </div>
              
              <p className="mb-6">
                Are you sure you want to delete "{selectedStory.title}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteStoryModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={confirmDeleteStory}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Story
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Announcement Confirmation Modal */}
      <AnimatePresence>
        {showDeleteAnnouncementModal && selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteAnnouncementModal(false)}
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
                <h2 className="text-xl font-bold">Delete Announcement</h2>
              </div>
              
              <p className="mb-6">
                Are you sure you want to delete the announcement for "{selectedAnnouncement.course}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteAnnouncementModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={confirmDeleteAnnouncement}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Announcement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Analytics Modal */}
      <AnimatePresence>
        {showAnalyticsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAnalyticsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Content Analytics Dashboard</h2>
                <button 
                  onClick={() => setShowAnalyticsModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex space-x-4 border-b">
                  <button 
                    className={`px-4 py-2 focus:outline-none ${
                      analyticsTab === 'stories' 
                        ? 'border-b-2 border-black font-medium' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                    onClick={() => handleAnalyticsTabChange('stories')}
                  >
                    <div className="flex items-center space-x-2">
                      <Scroll className="h-4 w-4" />
                      <span>Published Stories</span>
                    </div>
                  </button>
                  <button 
                    className={`px-4 py-2 focus:outline-none ${
                      analyticsTab === 'contributors' 
                        ? 'border-b-2 border-black font-medium' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                    onClick={() => handleAnalyticsTabChange('contributors')}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Top Contributors</span>
                    </div>
                  </button>
                  <button 
                    className={`px-4 py-2 focus:outline-none ${
                      analyticsTab === 'engagement' 
                        ? 'border-b-2 border-black font-medium' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                    onClick={() => handleAnalyticsTabChange('engagement')}
                  >
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Engagement</span>
                    </div>
                  </button>
                  <button 
                    className={`px-4 py-2 focus:outline-none ${
                      analyticsTab === 'completion' 
                        ? 'border-b-2 border-black font-medium' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                    onClick={() => handleAnalyticsTabChange('completion')}
                  >
                    <div className="flex items-center space-x-2">
                      <CircleCheck className="h-4 w-4" />
                      <span>Completion Rates</span>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                {analyticsTab === 'stories' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Cultural Stories Published</h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span>Total:</span>
                        <span className="font-bold text-black">45</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-medium mb-4">Weekly Publication Trend</h4>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="h-64 flex items-end space-x-6">
                          {detailedAnalytics.publishedStories.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-black bg-opacity-80 rounded-t-md" 
                                style={{ height: `${(item.count / 12) * 100}%` }}
                              ></div>
                              <div className="mt-2 text-sm text-gray-600">{item.week}</div>
                              <div className="text-sm font-medium">{item.count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between mb-4">
                        <h4 className="text-lg font-medium">Categories Breakdown</h4>
                        <button className="text-sm text-gray-600 hover:text-black">View All</button>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Traditional Folklore</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-black bg-opacity-80 rounded-full" style={{ width: '35%' }}></div>
                              </div>
                              <span className="text-sm">16 stories</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Cultural Customs</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-black bg-opacity-80 rounded-full" style={{ width: '27%' }}></div>
                              </div>
                              <span className="text-sm">12 stories</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Historical Events</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-black bg-opacity-80 rounded-full" style={{ width: '18%' }}></div>
                              </div>
                              <span className="text-sm">8 stories</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Traditional Art</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-black bg-opacity-80 rounded-full" style={{ width: '20%' }}></div>
                              </div>
                              <span className="text-sm">9 stories</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {analyticsTab === 'contributors' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Top Content Contributors</h3>
                      <button className="text-sm px-3 py-1 bg-black text-white rounded-full">Export</button>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium">Contributor</th>
                            <th className="text-left py-3 px-4 font-medium">Stories</th>
                            <th className="text-left py-3 px-4 font-medium">Engagement</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedAnalytics.topContributors.map((contributor, index) => (
                            <tr key={index} className="border-t border-gray-100">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserCheck className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">{contributor.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">{contributor.count}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-black" style={{ width: `${(contributor.count / 15) * 100}%` }}></div>
                                  </div>
                                  <span className="ml-2 text-sm">{Math.round((contributor.count / 15) * 100)}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-medium mb-4">Contribution Breakdown</h4>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Stories</span>
                            <div className="text-2xl font-bold mt-1">47</div>
                            <div className="flex items-center mt-1 text-sm text-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span>+12% this month</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Comments</span>
                            <div className="text-2xl font-bold mt-1">124</div>
                            <div className="flex items-center mt-1 text-sm text-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span>+8% this month</span>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Active Contributors</span>
                            <div className="text-2xl font-bold mt-1">12</div>
                            <div className="flex items-center mt-1 text-sm text-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span>+2 new this month</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {analyticsTab === 'engagement' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Content Engagement Analytics</h3>
                      <div className="flex space-x-2">
                        <select className="px-3 py-1 bg-white border rounded-md text-sm">
                          <option>Last 30 days</option>
                          <option>Last 60 days</option>
                          <option>Last 90 days</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-medium mb-4">Engagement by Content Type</h4>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          {detailedAnalytics.engagementByContent.map((item, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{item.category}</span>
                                <span className="text-sm">{item.engagement}%</span>
                              </div>
                              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-black bg-opacity-80 rounded-full" 
                                  style={{ width: `${item.engagement}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium mb-4">Interaction Statistics</h4>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-black bg-opacity-10 flex items-center justify-center">
                                  <Bookmark className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Saved Stories</span>
                                  <div className="text-xl font-bold">247</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-black bg-opacity-10 flex items-center justify-center">
                                  <MessageSquare className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Comments</span>
                                  <div className="text-xl font-bold">386</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-black bg-opacity-10 flex items-center justify-center">
                                  <Users className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Unique Readers</span>
                                  <div className="text-xl font-bold">512</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-black bg-opacity-10 flex items-center justify-center">
                                  <BarChart3 className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Avg. Time</span>
                                  <div className="text-xl font-bold">6:32</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {analyticsTab === 'completion' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Course Completion Rates</h3>
                      <button className="text-sm px-3 py-1 bg-black text-white rounded-full">Download Report</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-gray-600">Average Completion</span>
                          <div className="text-3xl font-bold mt-1">76%</div>
                          <div className="mt-2 text-sm text-green-600">+4% from last month</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-gray-600">Total Completed</span>
                          <div className="text-3xl font-bold mt-1">386</div>
                          <div className="mt-2 text-sm text-green-600">+24 from last month</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-gray-600">Ongoing Courses</span>
                          <div className="text-3xl font-bold mt-1">152</div>
                          <div className="mt-2 text-sm text-green-600">+8 from last month</div>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-medium mb-4">Completion by Course</h4>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium">Course</th>
                            <th className="text-left py-3 px-4 font-medium">Students</th>
                            <th className="text-left py-3 px-4 font-medium">Completion Rate</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedAnalytics.completionRates.map((course, index) => (
                            <tr key={index} className="border-t border-gray-100">
                              <td className="py-3 px-4">
                                <div className="font-medium">{course.course}</div>
                              </td>
                              <td className="py-3 px-4">
                                {Math.round(20 + Math.random() * 30)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        course.rate > 80 ? 'bg-green-500' : 
                                        course.rate > 70 ? 'bg-yellow-500' : 
                                        'bg-orange-500'
                                      }`} 
                                      style={{ width: `${course.rate}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm">{course.rate}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  course.rate > 80 ? 'bg-green-100 text-green-800' : 
                                  course.rate > 70 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {course.rate > 80 ? 'Excellent' : 
                                   course.rate > 70 ? 'Good' : 
                                   'Needs Attention'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowAnalyticsModal(false)}
                >
                  Close
                </button>
                <button 
                  className="btn btn-primary flex items-center space-x-2"
                  onClick={() => {
                    toast.success('Generating full analytics report');
                    setShowAnalyticsModal(false);
                  }}
                >
                  <TrendingUp size={16} />
                  <span>Generate Full Report</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeacherDashboard;