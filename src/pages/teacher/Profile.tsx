import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, BookOpen, Award, Clock, Users, Star, Edit, Camera } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const mockProfile = {
  bio: "Experienced cultural educator specializing in Rwandan language, traditions, and arts. Passionate about preserving and sharing Rwanda's rich cultural heritage.",
  phone: "+250 788 123 456",
  location: "Kigali, Rwanda",
  joinDate: "January 2024",
  education: [
    { degree: "Ph.D. in Cultural Studies", institution: "University of Rwanda", year: "2018" },
    { degree: "M.A. in Rwandan Literature", institution: "INES-Ruhengeri", year: "2015" },
  ],
  expertise: [
    "Kinyarwanda Language",
    "Traditional Arts",
    "Cultural Heritage",
    "Traditional Music",
    "Rwandan History"
  ],
  stats: {
    coursesCreated: 8,
    totalStudents: 450,
    avgRating: 4.8,
    teachingHours: 1200
  },
  recentAchievements: [
    { id: 1, title: "Excellence in Cultural Education", date: "March 15, 2024" },
    { id: 2, title: "Best Traditional Arts Course", date: "March 1, 2024" },
    { id: 3, title: "Cultural Heritage Preservation Award", date: "February 15, 2024" }
  ]
};

function TeacherProfile() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-700 relative">
          <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
            <Camera className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <div className="px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white -mt-16 mb-4 sm:mb-0"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={user?.name}
              />
              <button className="absolute bottom-4 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4 text-gray-700" />
              </button>
            </div>
            <div className="sm:ml-6 text-center sm:text-left flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-gray-600">{mockProfile.bio}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
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

              <div>
                <h2 className="text-lg font-semibold mb-3">Education</h2>
                <div className="space-y-3">
                  {mockProfile.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-600">Courses</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{mockProfile.stats.coursesCreated}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-600">Students</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{mockProfile.stats.totalStudents}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-600">Rating</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{mockProfile.stats.avgRating}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-600">Hours</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{mockProfile.stats.teachingHours}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Recent Achievements</h2>
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
      </div>
    </div>
  );
}

export default TeacherProfile;