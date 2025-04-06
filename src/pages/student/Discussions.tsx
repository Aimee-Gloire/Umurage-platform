import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, Clock, ThumbsUp, Reply, X, Send, Search, Tag, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock discussion data with nested replies
const initialDiscussions = [
  {
    id: 1,
    title: 'Traditional Wedding Customs',
    course: 'Rwanda Cultural Heritage',
    author: {
      name: 'Jean Mugisha',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Student'
    },
    content: 'Can someone explain the significance of the Gusaba ceremony in traditional Rwandan weddings? I understand it is one of the most important steps in the marriage process, but I would like to know more about its cultural importance and how it is conducted.',
    replies: [
      {
        id: 101,
        author: {
          name: 'Marie Uwimana',
          avatar: 'https://i.pravatar.cc/150?img=5',
          role: 'Teacher'
        },
        content: 'Gusaba is indeed one of the most important ceremonies in traditional Rwandan weddings. It literally means "to ask" in Kinyarwanda. During this ceremony, the groom\'s family visits the bride\'s family to formally request her hand in marriage. It involves cultural rituals, traditional speeches, and symbolic gift exchanges.',
        timestamp: '1 hour ago',
        likes: 7
      },
      {
        id: 102,
        author: {
          name: 'Patrick Niyonzima',
          avatar: 'https://i.pravatar.cc/150?img=8',
          role: 'Student'
        },
        content: 'To add to what Marie said, the ceremony typically involves eloquent speeches from representatives of both families. The groom\'s family brings gifts like traditional beer (Urwagwa) and sometimes a cow as a sign of respect and honor to the bride\'s family.',
        timestamp: '45 minutes ago',
        likes: 5
      }
    ],
    replyCount: 2,
    likes: 12,
    userLiked: false,
    timestamp: '2 hours ago',
    tags: ['traditions', 'weddings', 'culture']
  },
  {
    id: 2,
    title: 'Kinyarwanda Proverbs',
    course: 'Kinyarwanda Language Essentials',
    author: {
      name: 'Alice Uwase',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Student'
    },
    content: 'What are some common Kinyarwanda proverbs and their meanings in daily life? I\'m particularly interested in those that teach about patience and wisdom.',
    replies: [
      {
        id: 201,
        author: {
          name: 'Emmanuel Habimana',
          avatar: 'https://i.pravatar.cc/150?img=6',
          role: 'Teacher'
        },
        content: '"Ibitekerezo ni umutungo" (Ideas are wealth) - This proverb emphasizes the value of knowledge and creative thinking in Rwandan culture.',
        timestamp: '4 hours ago',
        likes: 8
      },
      {
        id: 202,
        author: {
          name: 'Diane Mukasine',
          avatar: 'https://i.pravatar.cc/150?img=7',
          role: 'Student'
        },
        content: 'One of my favorites is "Akanyoni katagurutse ntikamenya iyo bweze" (A bird that doesn\'t fly doesn\'t know where the millet is ripe) - This teaches us about the importance of exploring and gaining experience.',
        timestamp: '3 hours ago',
        likes: 6
      },
      {
        id: 203,
        author: {
          name: 'Jean Mugisha',
          avatar: 'https://i.pravatar.cc/150?img=1',
          role: 'Student'
        },
        content: 'For patience specifically, we have "Uko umuntu ahinga niko azasarura" (You reap what you sow) - This reminds us that good results require time and effort.',
        timestamp: '2 hours ago',
        likes: 4
      }
    ],
    replyCount: 3,
    likes: 15,
    userLiked: false,
    timestamp: '5 hours ago',
    tags: ['language', 'proverbs', 'wisdom']
  },
  {
    id: 3,
    title: 'Imigongo Art Patterns',
    course: 'Traditional Rwandan Art & Crafts',
    author: {
      name: 'Bob Kamanzi',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'Student'
    },
    content: 'Looking for guidance on creating traditional geometric patterns in Imigongo art. Are there specific rules for the designs or can I experiment with new patterns while still respecting the tradition?',
    replies: [
      {
        id: 301,
        author: {
          name: 'Claire Mutesi',
          avatar: 'https://i.pravatar.cc/150?img=9',
          role: 'Teacher'
        },
        content: 'Traditional Imigongo art uses specific geometric patterns with cultural significance. The most common include zigzags, spirals, and concentric circles. While there are traditional patterns, artists often create variations and new designs, so feel free to experiment while respecting the core techniques.',
        timestamp: '18 hours ago',
        likes: 9
      }
    ],
    replyCount: 1,
    likes: 20,
    userLiked: true,
    timestamp: '1 day ago',
    tags: ['art', 'crafts', 'traditions']
  }
];

function Discussions() {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [activeDiscussion, setActiveDiscussion] = useState<null | typeof discussions[0]>(null);
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false);
  const [showDiscussionView, setShowDiscussionView] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [newDiscussionCourse, setNewDiscussionCourse] = useState('');
  const [newDiscussionTags, setNewDiscussionTags] = useState('');
  const [newReply, setNewReply] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // All available courses for dropdown
  const courses = [
    'Rwanda Cultural Heritage',
    'Kinyarwanda Language Essentials',
    'Traditional Rwandan Art & Crafts',
    'Rwandan History & Politics',
    'Rwandan Music & Dance'
  ];

  // All tags across discussions
  const allTags = Array.from(
    new Set(discussions.flatMap(discussion => discussion.tags))
  );

  // Function to handle viewing a discussion
  const handleViewDiscussion = (discussion: typeof discussions[0]) => {
    setActiveDiscussion(discussion);
    setShowDiscussionView(true);
  };

  // Function to handle creating a new discussion
  const handleCreateDiscussion = () => {
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim() || !newDiscussionCourse) {
      toast.error('Please fill all required fields');
      return;
    }

    const tags = newDiscussionTags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag);

    const newDiscussion = {
      id: Date.now(),
      title: newDiscussionTitle,
      course: newDiscussionCourse,
      author: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Student'
      },
      content: newDiscussionContent,
      replies: [],
      replyCount: 0,
      likes: 0,
      userLiked: false,
      timestamp: 'Just now',
      tags: tags.length > 0 ? tags : ['general']
    };

    setDiscussions([newDiscussion, ...discussions]);
    setShowNewDiscussionModal(false);
    clearNewDiscussionForm();
    toast.success('Discussion created successfully!');
  };

  // Function to handle adding a reply to a discussion
  const handleAddReply = () => {
    if (!activeDiscussion || !newReply.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    const reply = {
      id: Date.now(),
      author: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Student'
      },
      content: newReply,
      timestamp: 'Just now',
      likes: 0
    };

    const updatedDiscussion = {
      ...activeDiscussion,
      replies: [...activeDiscussion.replies, reply],
      replyCount: activeDiscussion.replyCount + 1
    };

    setDiscussions(
      discussions.map(d => (d.id === activeDiscussion.id ? updatedDiscussion : d))
    );
    
    setActiveDiscussion(updatedDiscussion);
    setNewReply('');
    toast.success('Reply added successfully!');
  };

  // Function to handle liking a discussion
  const handleLikeDiscussion = (discussionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setDiscussions(
      discussions.map(d => {
        if (d.id === discussionId) {
          const liked = !d.userLiked;
          return {
            ...d,
            likes: liked ? d.likes + 1 : d.likes - 1,
            userLiked: liked
          };
        }
        return d;
      })
    );

    // Also update active discussion if it's the one being liked
    if (activeDiscussion && activeDiscussion.id === discussionId) {
      const liked = !activeDiscussion.userLiked;
      setActiveDiscussion({
        ...activeDiscussion,
        likes: liked ? activeDiscussion.likes + 1 : activeDiscussion.likes - 1,
        userLiked: liked
      });
    }
  };

  // Function to handle liking a reply
  const handleLikeReply = (replyId: number) => {
    if (!activeDiscussion) return;

    const updatedReplies = activeDiscussion.replies.map(reply => {
      if (reply.id === replyId) {
        // Toggle like status and update count
        return {
          ...reply,
          likes: reply.likes + 1
        };
      }
      return reply;
    });

    const updatedDiscussion = {
      ...activeDiscussion,
      replies: updatedReplies
    };

    setActiveDiscussion(updatedDiscussion);
    setDiscussions(
      discussions.map(d => (d.id === activeDiscussion.id ? updatedDiscussion : d))
    );
  };

  // Function to clear new discussion form
  const clearNewDiscussionForm = () => {
    setNewDiscussionTitle('');
    setNewDiscussionContent('');
    setNewDiscussionCourse('');
    setNewDiscussionTags('');
  };

  // Filter discussions based on search query and selected tag
  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = searchQuery 
      ? discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesTag = selectedTag
      ? discussion.tags.includes(selectedTag)
      : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {!showDiscussionView ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Cultural Discussions</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowNewDiscussionModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
          <MessageSquare className="h-5 w-5" />
          <span>New Discussion</span>
        </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedTag || ''}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All topics</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
            {filteredDiscussions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-800">No discussions found</h3>
                <p className="text-gray-600 mt-2">
                  {searchQuery || selectedTag 
                    ? 'Try adjusting your filters or search query' 
                    : 'Be the first to start a discussion'}
                </p>
                <button 
                  onClick={() => setShowNewDiscussionModal(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start a new discussion
                </button>
              </div>
            ) : (
              filteredDiscussions.map((discussion) => (
          <motion.div
            key={discussion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleViewDiscussion(discussion)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{discussion.title}</h3>
                <p className="text-sm text-gray-600">in {discussion.course}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{discussion.timestamp}</span>
              </div>
            </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{discussion.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {discussion.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                        <div className="relative">
                          <img 
                            src={discussion.author.avatar} 
                            alt={discussion.author.name}
                            className="h-6 w-6 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-gray-600">{discussion.author.name}</span>
                </div>
                      <button 
                        className={`flex items-center space-x-1 ${discussion.userLiked ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={(e) => handleLikeDiscussion(discussion.id, e)}
                      >
                  <ThumbsUp className="h-5 w-5" />
                  <span>{discussion.likes}</span>
                </button>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Reply className="h-5 w-5" />
                        <span>{discussion.replyCount} replies</span>
                      </div>
                    </div>
                    <button 
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDiscussion(discussion);
                      }}
                    >
                      Join Discussion
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <button 
            onClick={() => setShowDiscussionView(false)}
            className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to all discussions
          </button>

          {activeDiscussion && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeDiscussion.title}</h1>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={activeDiscussion.author.avatar} 
                        alt={activeDiscussion.author.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{activeDiscussion.author.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        {activeDiscussion.author.role}
                      </span>
                    </div>
                    <span>{activeDiscussion.timestamp}</span>
                  </div>
                  <span>in {activeDiscussion.course}</span>
                </div>
                <p className="text-gray-700 mb-4">{activeDiscussion.content}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {activeDiscussion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <button 
                    className={`flex items-center space-x-1 ${activeDiscussion.userLiked ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={(e) => handleLikeDiscussion(activeDiscussion.id, e)}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>{activeDiscussion.likes} likes</span>
                  </button>
                  <div className="flex items-center space-x-1 text-gray-500">
                  <Reply className="h-5 w-5" />
                    <span>{activeDiscussion.replyCount} replies</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Replies</h2>
                <div className="space-y-6">
                  {activeDiscussion.replies.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No replies yet. Be the first to reply!</p>
                  ) : (
                    activeDiscussion.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={reply.author.avatar} 
                              alt={reply.author.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{reply.author.name}</span>
                                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                                  {reply.author.role}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">{reply.timestamp}</span>
                            </div>
                          </div>
                          <button 
                            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600"
                            onClick={() => handleLikeReply(reply.id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">Add Your Reply</h2>
                <div className="space-y-4">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleAddReply}
                      disabled={!newReply.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="h-5 w-5" />
                      <span>Submit Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* New Discussion Modal */}
      <AnimatePresence>
        {showNewDiscussionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Start a New Discussion</h2>
                <button 
                  onClick={() => setShowNewDiscussionModal(false)}
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discussion Title *</label>
                  <input
                    type="text"
                    value={newDiscussionTitle}
                    onChange={(e) => setNewDiscussionTitle(e.target.value)}
                    placeholder="Enter a clear, specific title"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                  <select
                    value={newDiscussionCourse}
                    onChange={(e) => setNewDiscussionCourse(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discussion Content *</label>
                  <textarea
                    value={newDiscussionContent}
                    onChange={(e) => setNewDiscussionContent(e.target.value)}
                    placeholder="Describe your question or topic in detail"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      value={newDiscussionTags}
                      onChange={(e) => setNewDiscussionTags(e.target.value)}
                      placeholder="Enter tags separated by commas (e.g. traditions, language, history)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">* Tags help others find your discussion</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    onClick={() => setShowNewDiscussionModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateDiscussion}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Post Discussion
              </button>
                </div>
            </div>
          </motion.div>
      </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Discussions;