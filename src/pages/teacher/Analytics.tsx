import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Users, BookOpen, Award, Clock, Brain, Target, 
  Download, Calendar, Filter, ChevronDown, X, 
  TrendingUp, Share2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockData = {
  studentEngagement: [
    { date: '2024-03-10', activeStudents: 85, completedLessons: 120, avgScore: 88 },
    { date: '2024-03-11', activeStudents: 92, completedLessons: 145, avgScore: 85 },
    { date: '2024-03-12', activeStudents: 78, completedLessons: 98, avgScore: 92 },
    { date: '2024-03-13', activeStudents: 95, completedLessons: 156, avgScore: 87 },
    { date: '2024-03-14', activeStudents: 88, completedLessons: 134, avgScore: 90 },
    { date: '2024-03-15', activeStudents: 91, completedLessons: 142, avgScore: 89 },
    { date: '2024-03-16', activeStudents: 86, completedLessons: 128, avgScore: 91 },
  ],
  studentEngagementWeekly: [
    { date: 'Week 1', activeStudents: 82, completedLessons: 110, avgScore: 84 },
    { date: 'Week 2', activeStudents: 88, completedLessons: 125, avgScore: 86 },
    { date: 'Week 3', activeStudents: 90, completedLessons: 138, avgScore: 89 },
    { date: 'Week 4', activeStudents: 93, completedLessons: 150, avgScore: 91 },
  ],
  studentEngagementMonthly: [
    { date: 'Jan', activeStudents: 75, completedLessons: 95, avgScore: 82 },
    { date: 'Feb', activeStudents: 80, completedLessons: 120, avgScore: 85 },
    { date: 'Mar', activeStudents: 88, completedLessons: 140, avgScore: 90 },
  ],
  coursePerformance: [
    { name: 'Kinyarwanda Language', students: 45, avgScore: 88, completion: 75 },
    { name: 'Traditional Art', students: 32, avgScore: 82, completion: 68 },
    { name: 'Cultural Heritage', students: 56, avgScore: 90, completion: 82 },
  ],
  studentDistribution: [
    { name: 'Beginner', value: 30, color: '#94A3B8' },
    { name: 'Intermediate', value: 45, color: '#64748B' },
    { name: 'Advanced', value: 25, color: '#1E293B' },
  ],
  timeSpent: [
    { activity: 'Language Practice', hours: 45 },
    { activity: 'Cultural Projects', hours: 32 },
    { activity: 'Historical Studies', hours: 28 },
    { activity: 'Cultural Discussions', hours: 25 },
  ],
  studentProgress: [
    { student: 'Mutesi Alice', progress: 85, avgScore: 88, completion: 75 },
    { student: 'Mugisha Bob', progress: 75, avgScore: 82, completion: 68 },
    { student: 'Uwase Carol', progress: 92, avgScore: 94, completion: 90 },
    { student: 'Ntwari David', progress: 60, avgScore: 75, completion: 55 },
    { student: 'Isimbi Eva', progress: 88, avgScore: 90, completion: 82 },
  ],
};

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.stroke }}>
            {entry.name}: {entry.value} {entry.name === 'hours' ? 'hrs' : entry.name === 'avgScore' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function TeacherAnalytics() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [highlightedChart, setHighlightedChart] = useState<string | null>(null);
  
  // Get the appropriate data based on selected time range
  const getStudentEngagementData = useCallback(() => {
    switch (timeRange) {
      case 'daily':
        return mockData.studentEngagement;
      case 'weekly':
        return mockData.studentEngagementWeekly;
      case 'monthly':
        return mockData.studentEngagementMonthly;
      default:
        return mockData.studentEngagement;
    }
  }, [timeRange]);
  
  // Calculate averages and totals
  const calculateStatistics = () => {
    const engagementData = getStudentEngagementData();
    
    const avgActiveStudents = Math.round(
      engagementData.reduce((acc, curr) => acc + curr.activeStudents, 0) / engagementData.length
    );
    
    const avgScore = Math.round(
      engagementData.reduce((acc, curr) => acc + curr.avgScore, 0) / engagementData.length
    );
    
    const totalCompletedLessons = engagementData.reduce(
      (acc, curr) => acc + curr.completedLessons, 0
    );
    
    return { avgActiveStudents, avgScore, totalCompletedLessons };
  };
  
  const { avgActiveStudents, avgScore, totalCompletedLessons } = calculateStatistics();
  
  // Filter course performance data
  const filteredCoursePerformance = selectedCourse === 'all' 
    ? mockData.coursePerformance 
    : mockData.coursePerformance.filter(course => 
        course.name.toLowerCase().includes(selectedCourse.toLowerCase())
      );
  
  // Export analytics data
  const exportAnalytics = (format: 'csv' | 'pdf' | 'image') => {
    setShowExportMenu(false);
    
    switch (format) {
      case 'csv':
        const engagementData = getStudentEngagementData();
        const headers = Object.keys(engagementData[0]).join(',');
        const csvData = engagementData.map(item => Object.values(item).join(',')).join('\n');
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${csvData}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `teacher_analytics_${timeRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Analytics exported as CSV');
        break;
        
      case 'pdf':
        toast.success('Analytics exported as PDF');
        break;
        
      case 'image':
        toast.success('Analytics exported as Image');
        break;
    }
  };
  
  // Handle chart interaction
  const handleChartMouseEnter = (chartId: string) => {
    setHighlightedChart(chartId);
  };
  
  const handleChartMouseLeave = () => {
    setHighlightedChart(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cultural Education Analytics</h1>
        <p className="text-gray-600 mt-1">Track student engagement and cultural learning progress</p>
      </div>

        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 flex items-center space-x-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Download size={18} />
              <span>Export</span>
              <ChevronDown size={16} />
            </button>
            
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10"
                >
                  <button
                    onClick={() => exportAnalytics('csv')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center"
                  >
                    <Download size={16} className="mr-2" /> Export as CSV
                  </button>
                  <button
                    onClick={() => exportAnalytics('pdf')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center"
                  >
                    <Download size={16} className="mr-2" /> Export as PDF
                  </button>
                  <button
                    onClick={() => exportAnalytics('image')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center"
                  >
                    <Share2 size={16} className="mr-2" /> Share as Image
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3">
            <Calendar size={18} className="text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border-0 py-2 focus:ring-0 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Students', value: avgActiveStudents.toString(), icon: Users, trend: '+12% this month' },
          { label: 'Cultural Proficiency', value: `${avgScore}%`, icon: Target, trend: '+5% vs last month' },
          { label: 'Completed Lessons', value: totalCompletedLessons.toString(), icon: Brain, trend: '+3% this week' },
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
                <stat.icon className="h-6 w-6 text-black" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl p-6 shadow-lg ${highlightedChart === 'engagement' ? 'ring-2 ring-black ring-opacity-10' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('engagement')}
          onMouseLeave={handleChartMouseLeave}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Student Engagement</h2>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <TrendingUp size={16} />
              <span>+15% vs previous {timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month'}</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getStudentEngagementData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="activeStudents"
                  stroke="#000000"
                  strokeWidth={2}
                  name="Active Students"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#64748B"
                  strokeWidth={2}
                  name="Average Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl p-6 shadow-lg ${highlightedChart === 'courses' ? 'ring-2 ring-black ring-opacity-10' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('courses')}
          onMouseLeave={handleChartMouseLeave}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Course Performance</h2>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="text-sm border-0 py-1 focus:ring-0"
              >
                <option value="all">All Courses</option>
                <option value="kinyarwanda">Kinyarwanda Language</option>
                <option value="art">Traditional Art</option>
                <option value="heritage">Cultural Heritage</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredCoursePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="students" fill="#000000" name="Students" />
                <Bar dataKey="avgScore" fill="#64748B" name="Average Score" />
                <Bar dataKey="completion" fill="#94A3B8" name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl p-6 shadow-lg ${highlightedChart === 'levels' ? 'ring-2 ring-black ring-opacity-10' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('levels')}
          onMouseLeave={handleChartMouseLeave}
        >
          <h2 className="text-xl font-semibold mb-6">Cultural Proficiency Levels</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.studentDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockData.studentDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl p-6 shadow-lg ${highlightedChart === 'activity' ? 'ring-2 ring-black ring-opacity-10' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('activity')}
          onMouseLeave={handleChartMouseLeave}
        >
          <h2 className="text-xl font-semibold mb-6">Learning Activity Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.timeSpent}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.1}
                  name="Hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-6">Top Student Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.studentProgress.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.student}`} 
                          alt={student.student} 
                          className="h-10 w-10" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.student}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-black h-2.5 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{student.progress}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.avgScore}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.completion}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default TeacherAnalytics;