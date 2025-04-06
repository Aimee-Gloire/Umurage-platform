import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Award, Clock, Brain, Target, Zap, 
  BookMarked, Star, Trophy, MessageSquare, Scroll,
  History, Bookmark, Heart, ChevronRight, ChevronLeft,
  Check
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const mockCourses = [
  { 
    id: 1, 
    title: 'Kinyarwanda Language Essentials', 
    progress: 60, 
    instructor: 'Dr. Uwimana Marie', 
    nextLesson: 'Advanced Greetings and Expressions',
    achievements: 3,
    totalAchievements: 5,
    image: 'https://images.unsplash.com/photo-1489367874814-f5d040621dd8?q=80&w=2946&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: 'Rwanda Cultural Heritage', 
    progress: 30, 
    instructor: 'Prof. Gahima Paul', 
    nextLesson: 'Traditional Wedding Ceremonies',
    achievements: 2,
    totalAchievements: 5,
    image: 'https://images.unsplash.com/photo-1523365280197-f1783db9bbdc?q=80&w=2942&auto=format&fit=crop'
  },
  { 
    id: 3, 
    title: 'Traditional Rwandan Art & Crafts', 
    progress: 85, 
    instructor: 'Jane Mutesi', 
    nextLesson: 'Imigongo Art Techniques',
    achievements: 4,
    totalAchievements: 5,
    image: 'https://images.unsplash.com/photo-1578927291781-7833dbcbdfa9?q=80&w=2940&auto=format&fit=crop'
  },
];

const mockStories = [
  {
    id: 1,
    title: 'The Legend of Nyirabukara',
    category: 'Folklore',
    likes: 45,
    comments: 12,
    timeAgo: '2 hours ago',
    isLiked: false,
    isBookmarked: false,
    content: 'Nyirabukara was a legendary queen in Rwandan history known for her wisdom and strength. She ruled with compassion but was fierce in protecting her people...'
  },
  {
    id: 2,
    title: 'Traditional Wedding Customs',
    category: 'Cultural Practices',
    likes: 38,
    comments: 8,
    timeAgo: '5 hours ago',
    isLiked: false,
    isBookmarked: false,
    content: 'In traditional Rwandan weddings, the ceremony called "Gusaba" is where the groom\'s family formally asks for the bride\'s hand in marriage. This involves bringing gifts including traditional beer (urwagwa) and sometimes a cow...'
  }
];

const mockTimeline = [
  {
    id: 1,
    title: 'Kingdom of Rwanda',
    date: '1500-1800',
    description: 'Early history and formation of the Rwandan Kingdom, ruled by the Mwami (King).'
  },
  {
    id: 2,
    title: 'Colonial Period',
    date: '1884-1962',
    description: 'German and Belgian colonial rule that changed social structures and administration.'
  },
  {
    id: 3,
    title: 'Independence',
    date: '1962',
    description: 'Rwanda gained independence on July 1, 1962, marking the end of colonial rule.'
  },
  {
    id: 4,
    title: 'Modern Rwanda',
    date: '1994-Present',
    description: 'Post-genocide rebuilding and development into one of Africa\'s fastest-growing economies.'
  }
];

const achievements = [
  { 
    id: 1, 
    title: 'Story Collector', 
    description: 'Read 10 cultural stories', 
    icon: Scroll,
    level: 'gold'
  },
  { 
    id: 2, 
    title: 'History Explorer', 
    description: 'Completed historical timeline', 
    icon: History,
    level: 'gold'
  },
  { 
    id: 3, 
    title: 'Cultural Scholar', 
    description: '7-day learning streak', 
    icon: Trophy,
    level: 'silver'
  },
];

const stats = [
  { label: 'Study Streak', value: '7 days', icon: Zap },
  { label: 'Stories Read', value: '15', icon: Scroll },
  { label: 'Avg. Quiz Score', value: '92%', icon: Target },
  { label: 'Achievements', value: '15/25', icon: Trophy },
];

function StarRating({ filled }: { filled: number }) {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < filled
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stories, setStories] = useState(mockStories);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);
  const [expandedStoryId, setExpandedStoryId] = useState<number | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<typeof achievements[0] | null>(null);
  
  // Function to handle liking a story
  const handleLikeStory = (storyId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setStories(stories.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          likes: story.isLiked ? story.likes - 1 : story.likes + 1,
          isLiked: !story.isLiked
        };
      }
      return story;
    }));
    
    toast.success(stories.find(s => s.id === storyId)?.isLiked 
      ? 'Removed from liked stories' 
      : 'Added to liked stories');
  };

  // Function to handle bookmarking a story
  const handleBookmarkStory = (storyId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setStories(stories.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          isBookmarked: !story.isBookmarked
        };
      }
      return story;
    }));
    
    toast.success(stories.find(s => s.id === storyId)?.isBookmarked 
      ? 'Removed from bookmarks' 
      : 'Added to bookmarks');
  };

  // Function to navigate to a course
  const handleCourseClick = (courseId: number) => {
    navigate(`/student/courses/${courseId}`);
  };

  // Function to navigate to next/previous timeline entry
  const handleTimelineNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentTimelineIndex > 0) {
      setCurrentTimelineIndex(currentTimelineIndex - 1);
    } else if (direction === 'next' && currentTimelineIndex < mockTimeline.length - 1) {
      setCurrentTimelineIndex(currentTimelineIndex + 1);
    }
  };

  // Function to toggle story expansion
  const toggleStoryExpansion = (storyId: number) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };

  // Function to show achievement details
  const showAchievementDetails = (achievement: typeof achievements[0]) => {
    setSelectedAchievement(achievement);
    setShowAchievementModal(true);
  };

  // Function to view all achievements
  const viewAllAchievements = () => {
    navigate('/student/profile');
    toast.success('Navigating to profile to view all achievements');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <div className="h-12 w-12 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-black" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cultural Stories Section */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Recent Cultural Stories</h2>
            <div className="space-y-4">
              {stories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => toggleStoryExpansion(story.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{story.title}</h3>
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mt-2">
                        {story.category}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${story.isLiked ? 'text-red-500' : ''}`}
                        onClick={(e) => handleLikeStory(story.id, e)}
                      >
                        <Heart className={`h-5 w-5 ${story.isLiked ? 'fill-red-500' : ''}`} />
                      </button>
                      <button 
                        className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${story.isBookmarked ? 'text-indigo-500' : ''}`}
                        onClick={(e) => handleBookmarkStory(story.id, e)}
                      >
                        <Bookmark className={`h-5 w-5 ${story.isBookmarked ? 'fill-indigo-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  {expandedStoryId === story.id && (
                    <div className="mb-4">
                      <p className="text-gray-700">{story.content}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {story.likes} likes
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {story.comments} comments
                      </span>
                    </div>
                    <span>{story.timeAgo}</span>
                  </div>
                </motion.div>
              ))}
              
              <div className="text-center mt-4">
                <button 
                  onClick={() => navigate('/student/discussions')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
                >
                  <span>More Stories</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Historical Timeline</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => handleTimelineNavigation('prev')}
                    disabled={currentTimelineIndex === 0}
                    className={`p-2 rounded-full ${currentTimelineIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{mockTimeline[currentTimelineIndex].title}</h3>
                    <div className="text-sm text-gray-600">{mockTimeline[currentTimelineIndex].date}</div>
                  </div>
                  <button 
                    onClick={() => handleTimelineNavigation('next')}
                    disabled={currentTimelineIndex === mockTimeline.length - 1}
                    className={`p-2 rounded-full ${currentTimelineIndex === mockTimeline.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700">{mockTimeline[currentTimelineIndex].description}</p>
                </div>
                
                <div className="mt-6 flex">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-black h-2.5 rounded-full" style={{ width: `${((currentTimelineIndex + 1) / mockTimeline.length) * 100}%` }}></div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <button 
                    onClick={() => navigate('/student/discussions')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors inline-flex items-center"
                  >
                    <span>Explore Full Timeline</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar - Now only Achievements section (removed My Courses) */}
        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Achievements</h2>
              <button 
                onClick={viewAllAchievements}
                className="text-sm text-indigo-600 hover:underline flex items-center"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => showAchievementDetails(achievement)}
                  >
                    <div className={`p-3 rounded-full ${
                      achievement.level === 'gold' ? 'bg-yellow-100' : 
                      achievement.level === 'silver' ? 'bg-gray-100' : 
                      'bg-orange-100'
                    }`}>
                      <achievement.icon className={`h-6 w-6 ${
                        achievement.level === 'gold' ? 'text-yellow-600' : 
                        achievement.level === 'silver' ? 'text-gray-600' : 
                        'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Recent Activities Section (Added to fill space) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent Activities</h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="space-y-4">
                <div className="flex items-center p-3">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed Imigongo Art lesson</p>
                    <p className="text-sm text-gray-600">Traditional Rwandan Art Course</p>
                    <p className="text-xs text-gray-500 mt-1">Today, 10:45 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Scored 92% on Kinyarwanda Quiz</p>
                    <p className="text-sm text-gray-600">Language Essentials</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday, 4:20 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Joined Discussion</p>
                    <p className="text-sm text-gray-600">Traditional Wedding Customs</p>
                    <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Achievement Modal */}
      {showAchievementModal && selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-4">
              <div className={`mx-auto p-4 rounded-full inline-block ${
                selectedAchievement.level === 'gold' ? 'bg-yellow-100' : 
                selectedAchievement.level === 'silver' ? 'bg-gray-100' : 
                'bg-orange-100'
              }`}>
                <selectedAchievement.icon className={`h-10 w-10 ${
                  selectedAchievement.level === 'gold' ? 'text-yellow-600' : 
                  selectedAchievement.level === 'silver' ? 'text-gray-600' : 
                  'text-orange-600'
                }`} />
              </div>
              <h2 className="text-xl font-bold mt-4">{selectedAchievement.title}</h2>
              <p className="text-gray-600">{selectedAchievement.description}</p>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">Achievement unlocked on March 15, 2024</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAchievementModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;