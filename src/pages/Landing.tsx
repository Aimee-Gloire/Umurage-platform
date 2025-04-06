import React, { useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Users,
  BarChart,
  MessageSquare,
  Award,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Laptop,
  Brain,
  Target,
  TrendingUp,
  Heart,
  FileText,
  Coffee,
  Map
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Kinyarwanda Excellence',
    description: 'Master Rwanda\'s official language with interactive lessons designed by native speakers'
  },
  {
    icon: Heart,
    title: 'Cultural Immersion',
    description: 'Explore Rwandan traditions, art, and heritage through comprehensive learning experiences'
  },
  {
    icon: Coffee,
    title: 'Integrated Learning',
    description: 'Blend modern education with Rwanda\'s rich wisdom and traditional knowledge systems'
  },
  {
    icon: Award,
    title: 'Recognized Certifications',
    description: 'Earn certificates valued by Rwandan institutions and international organizations'
  },
  {
    icon: Brain,
    title: 'Adaptive Methodology',
    description: 'Experience personalized learning paths that adapt to your knowledge of Rwandan subjects'
  },
  {
    icon: Map,
    title: 'National Accessibility',
    description: 'Learn from anywhere in Rwanda with our mobile-optimized platform that works even with limited connectivity'
  }
];

const courses = [
  {
    title: 'Kinyarwanda Language Essentials',
    image: 'https://images.unsplash.com/photo-1517842264405-72bb906a1936?auto=format&fit=crop&q=80&w=800&h=500',
    category: 'Language',
    rating: 4.9,
    students: 1200
  },
  {
    title: 'Rwandan History & Culture',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Rwanda.svg/800px-Flag_of_Rwanda.svg.png',
    category: 'History',
    rating: 4.7,
    students: 850
  }
];

const testimonials = [
  {
    name: 'Mutesi Grace',
    role: 'Primary School Teacher, Kigali',
    image: 'https://i.ibb.co/MkzYsZm/rwanda-teacher.jpg',
    content: 'The Kinyarwanda courses have transformed how I teach language to my students, incorporating both tradition and modern methods.'
  },
  {
    name: 'Olivier Mugabo',
    role: 'University Student, Butare',
    image: 'https://i.ibb.co/hgnPVwS/rwanda-student.jpg',
    content: 'As a student of history, these courses have deepened my understanding of Rwanda\'s past and helped me connect with our cultural identity.'
  },
  {
    name: 'Uwase Diana',
    role: 'Entrepreneur, Musanze',
    image: 'https://i.ibb.co/K2JQZw2/rwanda-entrepreneur.jpg',
    content: 'The business courses with a Rwandan perspective have been invaluable for developing my craft business while honoring our traditions.'
  }
];

function Landing() {
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  }, [controls]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, scale, y }}
          className="absolute inset-0 bg-gradient-to-br from-black to-gray-900"
        />
        <motion.div
          style={{ opacity }}
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('https://cdn.pixabay.com/photo/2018/08/15/19/05/rwanda-3609225_1280.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <GraduationCap className="h-20 w-20 text-white mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Elevating Rwanda<br />Through Education
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience learning that celebrates Rwandan culture, language, and wisdom while preparing you for future success
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/login"
              className="btn btn-primary px-8 py-4 text-lg flex items-center justify-center space-x-2 bg-white text-black hover:bg-gray-100"
            >
              <span>Begin Learning</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-sm flex flex-col items-center"
            >
              <span className="mb-2">Explore Umurage</span>
              <ArrowRight className="h-5 w-5 transform rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Authentic Rwandan Learning
            </h2>
            <p className="text-xl text-gray-600">
              Discover why Rwandans choose our platform for preserving and sharing knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-2xl p-8 transform transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-black rounded-xl p-3">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600">
              Start your journey with our most sought-after courses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="relative h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                    {course.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1">{course.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-1" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: '25K+', label: 'Active Rwandan Learners', icon: Users },
              { value: '200+', label: 'Rwandan Educators', icon: GraduationCap },
              { value: '300+', label: 'Cultural Lessons', icon: BookOpen },
              { value: '96%', label: 'Completion Rate', icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: index * 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <div className="bg-white bg-opacity-10 rounded-full p-4">
                    <stat.icon className="h-8 w-8" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3 }}
                >
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our community of learners and educators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-full ring-4 ring-gray-100"
                  />
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Rwanda's Premier Learning Community
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Become part of Umurage - preserving and sharing Rwanda's knowledge, culture, and innovation for future generations
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="btn btn-primary px-8 py-4 text-lg inline-flex items-center bg-white text-black hover:bg-gray-100"
              >
                <span>Begin Your Journey</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Landing;