import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Clock, Award, Target, BookOpen, Download, 
  Calendar, TrendingUp, ChevronDown 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockAnalyticsData = {
  dailyStudyTime: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 1.5 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 2.7 },
  ],
  weeklyStudyTime: [
    { week: 'Week 1', hours: 12.5 },
    { week: 'Week 2', hours: 15.8 },
    { week: 'Week 3', hours: 10.2 },
    { week: 'Week 4', hours: 18.1 },
  ],
  monthlyStudyTime: [
    { month: 'Jan', hours: 45.5 },
    { month: 'Feb', hours: 52.3 },
    { month: 'Mar', hours: 38.7 },
  ],
  quizScores: [
    { quiz: 'Quiz 1', score: 85 },
    { quiz: 'Quiz 2', score: 92 },
    { quiz: 'Quiz 3', score: 78 },
    { quiz: 'Quiz 4', score: 95 },
    { quiz: 'Quiz 5', score: 88 },
  ],
  weeklyQuizScores: [
    { week: 'Week 1', score: 82 },
    { week: 'Week 2', score: 88 },
    { week: 'Week 3', score: 85 },
    { week: 'Week 4', score: 91 },
  ],
  monthlyQuizScores: [
    { month: 'Jan', score: 84 },
    { month: 'Feb', score: 87 },
    { month: 'Mar', score: 92 },
  ],
  completedLessons: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 14 },
  ],
  weeklyCompletedLessons: [
    { week: 'Week 1', count: 3 },
    { week: 'Week 2', count: 5 },
    { week: 'Week 3', count: 4 },
    { week: 'Week 4', count: 6 },
  ],
  categoryBreakdown: [
    { name: 'Language', value: 45 },
    { name: 'Culture', value: 30 },
    { name: 'History', value: 15 },
    { name: 'Arts', value: 10 },
  ],
  learningFocus: [
    { area: 'Reading', percentage: 35 },
    { area: 'Listening', percentage: 25 },
    { area: 'Writing', percentage: 20 },
    { area: 'Speaking', percentage: 20 },
  ],
};

// Colors for charts
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];
const RADIAN = Math.PI / 180;

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.name === 'hours' ? 'hrs' : entry.name === 'score' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Pie chart custom label
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [highlightedChart, setHighlightedChart] = useState<string | null>(null);
  
  // Get the appropriate data based on selected time range
  const getStudyTimeData = useCallback(() => {
    switch (timeRange) {
      case 'daily':
        return mockAnalyticsData.dailyStudyTime;
      case 'weekly':
        return mockAnalyticsData.weeklyStudyTime;
      case 'monthly':
        return mockAnalyticsData.monthlyStudyTime;
      default:
        return mockAnalyticsData.dailyStudyTime;
    }
  }, [timeRange]);

  const getQuizScoreData = useCallback(() => {
    switch (timeRange) {
      case 'daily':
        return mockAnalyticsData.quizScores;
      case 'weekly':
        return mockAnalyticsData.weeklyQuizScores;
      case 'monthly':
        return mockAnalyticsData.monthlyQuizScores;
      default:
        return mockAnalyticsData.quizScores;
    }
  }, [timeRange]);

  const getLessonData = useCallback(() => {
    switch (timeRange) {
      case 'weekly':
        return mockAnalyticsData.weeklyCompletedLessons;
      case 'monthly':
      case 'daily':
      default:
        return mockAnalyticsData.completedLessons;
    }
  }, [timeRange]);
  
  // Calculate averages and totals
  const averageStudyTime = getStudyTimeData().reduce((acc, curr) => {
    const hoursProp = 'hours' in curr ? 'hours' : Object.keys(curr)[1];
    return acc + (curr as any)[hoursProp];
  }, 0) / getStudyTimeData().length;
  
  const averageQuizScore = getQuizScoreData().reduce((acc, curr) => {
    const scoreProp = 'score' in curr ? 'score' : Object.keys(curr)[1];
    return acc + (curr as any)[scoreProp];
  }, 0) / getQuizScoreData().length;
  
  const totalLessonsCompleted = getLessonData().reduce((acc, curr) => {
    const countProp = 'count' in curr ? 'count' : Object.keys(curr)[1];
    return acc + (curr as any)[countProp];
  }, 0);
  
  // Export analytics data to CSV
  const exportAnalytics = (format: 'csv' | 'pdf' | 'image') => {
    setShowExportMenu(false);
    
    switch (format) {
      case 'csv':
        const studyTimeData = getStudyTimeData();
        const headers = Object.keys(studyTimeData[0]).join(',');
        const csvData = studyTimeData.map(item => Object.values(item).join(',')).join('\n');
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${csvData}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `learning_analytics_${timeRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Analytics exported as CSV');
        break;
        
      case 'pdf':
        toast.success('Analytics exported as PDF');
        break;
        
      case 'image':
        toast.success('Analytics exported as image');
        break;
        
      default:
        break;
    }
  };
  
  // Highlight a chart section when hovering
  const handleChartMouseEnter = (chartId: string) => {
    setHighlightedChart(chartId);
  };
  
  const handleChartMouseLeave = () => {
    setHighlightedChart(null);
  };

  // Helper function to get correct time period name
  const getTimePeriodName = useCallback((range: string) => {
    switch(range) {
      case 'daily':
        return 'day';
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      default:
        return 'period';
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        
        <div className="flex space-x-4">
          {/* Time range filter */}
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
              <Calendar className="h-5 w-5 text-gray-500" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="appearance-none bg-transparent pr-8 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          {/* Export button */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <button 
                  onClick={() => exportAnalytics('csv')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                >
                  Export as CSV
                </button>
                <button 
                  onClick={() => exportAnalytics('pdf')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button 
                  onClick={() => exportAnalytics('image')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                >
                  Export as Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Study Time</p>
              <p className="text-2xl font-bold mt-1">{averageStudyTime.toFixed(1)} hrs</p>
              <p className="text-xs text-green-500 mt-1">+12% from last {getTimePeriodName(timeRange)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>
        
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
          <div className="flex items-center justify-between">
                <div>
              <p className="text-sm text-gray-600">Average Quiz Score</p>
              <p className="text-2xl font-bold mt-1">{averageQuizScore.toFixed(1)}%</p>
              <p className="text-xs text-green-500 mt-1">+5% from last {getTimePeriodName(timeRange)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lessons Completed</p>
              <p className="text-2xl font-bold mt-1">{totalLessonsCompleted}</p>
              <p className="text-xs text-green-500 mt-1">+3 from last {getTimePeriodName(timeRange)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
        </div>
        </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Course Progress</p>
              <p className="text-2xl font-bold mt-1">68%</p>
              <p className="text-xs text-green-500 mt-1">+8% from last {getTimePeriodName(timeRange)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Study Time Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`bg-white rounded-2xl p-6 shadow-lg transition-shadow ${highlightedChart === 'studyTime' ? 'shadow-xl ring-2 ring-indigo-200' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('studyTime')}
          onMouseLeave={handleChartMouseLeave}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Study Time</h2>
            <div className="text-sm text-gray-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>+15% from previous period</span>
            </div>
          </div>
          
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getStudyTimeData()}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis 
                  dataKey={timeRange === 'daily' ? 'day' : timeRange === 'weekly' ? 'week' : 'month'} 
                  stroke="#888"
                />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                  dataKey="hours"
                  name="Study Hours"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        {/* Quiz Performance Chart */}
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`bg-white rounded-2xl p-6 shadow-lg transition-shadow ${highlightedChart === 'quizPerformance' ? 'shadow-xl ring-2 ring-indigo-200' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('quizPerformance')}
          onMouseLeave={handleChartMouseLeave}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Quiz Performance</h2>
            <div className="text-sm text-gray-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>+8% from previous period</span>
            </div>
          </div>
          
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getQuizScoreData()}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis 
                  dataKey={timeRange === 'daily' ? 'quiz' : timeRange === 'weekly' ? 'week' : 'month'} 
                  stroke="#888"
                />
                <YAxis stroke="#888" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                  dataKey="score"
                  name="Quiz Score"
                  stroke="#4ade80"
                    strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Focus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`bg-white rounded-2xl p-6 shadow-lg transition-shadow ${highlightedChart === 'learningFocus' ? 'shadow-xl ring-2 ring-indigo-200' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('learningFocus')}
          onMouseLeave={handleChartMouseLeave}
        >
          <h2 className="text-xl font-semibold mb-6">Learning Focus</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalyticsData.learningFocus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="area"
                >
                  {mockAnalyticsData.learningFocus.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        {/* Monthly Progress */}
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`bg-white rounded-2xl p-6 shadow-lg transition-shadow ${highlightedChart === 'monthlyProgress' ? 'shadow-xl ring-2 ring-indigo-200' : ''}`}
          onMouseEnter={() => handleChartMouseEnter('monthlyProgress')}
          onMouseLeave={handleChartMouseLeave}
        >
          <h2 className="text-xl font-semibold mb-6">Completed Lessons</h2>
          
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getLessonData()}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis 
                  dataKey={timeRange === 'weekly' ? 'week' : 'month'} 
                  stroke="#888"
                />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  name="Lessons Completed"
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
      </div>
      
      {/* Topic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-lg mt-8"
      >
        <h2 className="text-xl font-semibold mb-6">Topic Distribution</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {mockAnalyticsData.categoryBreakdown.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.name}</span>
                  <span>{category.value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${category.value}%`,
                      backgroundColor: COLORS[index % COLORS.length] 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalyticsData.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {mockAnalyticsData.categoryBreakdown.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      </motion.div>
    </div>
  );
}

export default AnalyticsPage;