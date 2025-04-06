import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Award,
  BarChart,
  MessageSquare,
  User,
  Settings,
  Search,
  Menu,
  X,
  Bell,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', path: '/student/dashboard', icon: GraduationCap },
  { name: 'Courses', path: '/student/courses', icon: BookOpen },
  { name: 'Assignments', path: '/student/assignments', icon: FileText },
  { name: 'Certificates', path: '/student/certificates', icon: Award },
  { name: 'Analytics', path: '/student/analytics', icon: BarChart },
  { name: 'Discussions', path: '/student/discussions', icon: MessageSquare },
];

const userNavigation = [
  { name: 'Profile', path: '/student/profile', icon: User },
  { name: 'Settings', path: '/student/settings', icon: Settings },
];

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    title: 'New Kinyarwanda Lesson Available',
    message: 'A new lesson on traditional greetings has been added to your course.',
    time: '2 hours ago',
    read: false,
    type: 'course'
  },
  {
    id: 2,
    title: 'Upcoming Cultural Event',
    message: 'Join us for a virtual Kwita Izina ceremony this Friday at 3 PM.',
    time: '1 day ago',
    read: false,
    type: 'event'
  },
  {
    id: 3,
    title: 'Quiz Results',
    message: 'You scored 92% on your Rwandan History quiz. Congratulations!',
    time: '3 days ago',
    read: true,
    type: 'quiz'
  },
  {
    id: 4,
    title: 'Igitaramo Community Discussion',
    message: 'Your discussion post about traditional Rwandan music received 5 replies.',
    time: '5 days ago',
    read: true,
    type: 'discussion'
  }
];

function StudentLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-black text-white shadow-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Floating Sidebar */}
      <motion.aside
        initial={{ x: -320, opacity: 0 }}
        animate={{
          x: isMobileMenuOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -320),
          opacity: 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="fixed left-6 top-6 bottom-6 z-40 w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm bg-opacity-95"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-100">
            <GraduationCap className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Umurage
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Account
                </p>
              </div>
              {userNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="lg:pl-96">
        <header className="bg-white shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="relative hover:text-gray-600 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications(notifications.map(n => ({ ...n, read: true })));
                          }}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start">
                            <p className="font-medium text-sm">{notification.title}</p>
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button 
                        onClick={() => navigate('/student/notifications')}
                        className="text-xs text-indigo-600 hover:underline w-full text-center"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;