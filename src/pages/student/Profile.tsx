import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Book, Award, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const mockProfile = {
  bio: "Passionate learner exploring Rwandan culture, traditions, and language. Currently focused on mastering Kinyarwanda and traditional arts.",
  phone: "+250 788 123 456",
  location: "Kigali, Rwanda",
  joinDate: "January 2024",
  stats: {
    coursesCompleted: 12,
    certificatesEarned: 5,
    hoursLearned: 156,
    averageScore: 92
  },
  recentAchievements: [
    { id: 1, title: "Kinyarwanda Proficiency Level 1", date: "March 15, 2024" },
    { id: 2, title: "Imigongo Art Master", date: "March 10, 2024" },
    { id: 3, title: "Cultural Heritage Scholar", date: "March 5, 2024" }
  ]
};

function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-700"></div>
        <div className="px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <img
              className="h-24 w-24 rounded-full ring-4 ring-white -mt-16 mb-4 sm:mb-0"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt={user?.name}
            />
            <div className="sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{mockProfile.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{mockProfile.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{mockProfile.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>Joined {mockProfile.joinDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-600">Cultural Courses</span>
                </div>
                <p className="text-2xl font-bold mt-2">{mockProfile.stats.coursesCompleted}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-600">Certificates</span>
                </div>
                <p className="text-2xl font-bold mt-2">{mockProfile.stats.certificatesEarned}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-600">Learning Hours</span>
                </div>
                <p className="text-2xl font-bold mt-2">{mockProfile.stats.hoursLearned}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-600">Avg. Score</span>
                </div>
                <p className="text-2xl font-bold mt-2">{mockProfile.stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Cultural Achievements</h2>
            <div className="space-y-3">
              {mockProfile.recentAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-gray-700" />
                    <span className="font-medium">{achievement.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{achievement.date}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;