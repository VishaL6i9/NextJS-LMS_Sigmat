'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,  
  BookOpen, 
  Award, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Activity, 
  Target,
  Clock,
  Star,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  GraduationCap,
  Crown,
  Zap
} from 'lucide-react';
import { Download } from '@/components/ui/Download';
import { Users } from '@/components/ui/Users';
import { 
  getInstituteByAdminId, 
  getInstituteStatistics,
  getInstituteStudents,
  getInstituteCourses,
  getInstituteSubscriptions,
  getUserId,
  InstituteDTO,
  InstituteStatistics,
  UserDTO,
  CourseDTO,
  InstituteSubscriptionDTO
} from '@/app/components/services/api';

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    activeSubscriptions: number;
    studentGrowth: number;
    courseCompletionRate: number;
    averageRating: number;
    monthlyRevenue: number;
  };
  studentMetrics: {
    newEnrollments: number[];
    activeStudents: number[];
    completionRates: number[];
    months: string[];
  };
  courseMetrics: {
    topCourses: Array<{
      name: string;
      enrollments: number;
      rating: number;
      completion: number;
    }>;
    categoryDistribution: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
  };
  performanceMetrics: {
    avgSessionTime: string;
    bounceRate: number;
    retentionRate: number;
    satisfactionScore: number;
  };
}

const InstitutionAnalytics = () => {
  const [institute, setInstitute] = useState<InstituteDTO | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('students');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const instituteData = await getInstituteByAdminId(parseInt(userId));
      setInstitute(instituteData);

      const [statistics, students, courses, subscriptions] = await Promise.all([
        getInstituteStatistics(instituteData.instituteId),
        getInstituteStudents(instituteData.instituteId),
        getInstituteCourses(instituteData.instituteId),
        getInstituteSubscriptions(instituteData.instituteId)
      ]);

      // Generate mock analytics data
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalStudents: statistics.totalStudents,
          totalInstructors: statistics.totalInstructors,
          totalCourses: statistics.totalCourses,
          activeSubscriptions: subscriptions.filter(s => s.isActive).length,
          studentGrowth: 12.5,
          courseCompletionRate: 87.3,
          averageRating: 4.6,
          monthlyRevenue: 125000
        },
        studentMetrics: {
          newEnrollments: [45, 52, 48, 61, 55, 67, 73, 69, 78, 82, 89, 95],
          activeStudents: [320, 335, 342, 358, 365, 378, 392, 405, 418, 432, 445, 458],
          completionRates: [78, 82, 85, 87, 89, 91, 88, 90, 92, 89, 91, 93],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        courseMetrics: {
          topCourses: courses.slice(0, 5).map((course, index) => ({
            name: course.courseName,
            enrollments: course.studentsEnrolled,
            rating: course.rating,
            completion: Math.floor(Math.random() * 30) + 70
          })),
          categoryDistribution: [
            { category: 'Programming', count: 12, percentage: 35 },
            { category: 'Data Science', count: 8, percentage: 23 },
            { category: 'Web Development', count: 6, percentage: 18 },
            { category: 'Mobile Development', count: 4, percentage: 12 },
            { category: 'Others', count: 4, percentage: 12 }
          ]
        },
        performanceMetrics: {
          avgSessionTime: '2h 34m',
          bounceRate: 23.5,
          retentionRate: 89.2,
          satisfactionScore: 4.7
        }
      };

      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    color, 
    index 
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    changeType?: 'increase' | 'decrease' | 'neutral'; 
    icon: any; 
    color: string; 
    index: number;
  }) => {
    const getChangeIcon = () => {
      switch (changeType) {
        case 'increase': return <ArrowUp className="w-4 h-4" />;
        case 'decrease': return <ArrowDown className="w-4 h-4" />;
        default: return <Minus className="w-4 h-4" />;
      }
    };

    const getChangeColor = () => {
      switch (changeType) {
        case 'increase': return 'text-green-400';
        case 'decrease': return 'text-red-400';
        default: return 'text-slate-400';
      }
    };

    return (
      <div 
        className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl group animate-fade-in-up`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center ${getChangeColor()} text-sm font-medium`}>
              {getChangeIcon()}
              <span className="ml-1">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-slate-300 text-sm">{title}</p>
        </div>
      </div>
    );
  };

  const ChartCard = ({ 
    title, 
    children, 
    actions 
  }: { 
    title: string; 
    children: React.ReactNode; 
    actions?: React.ReactNode;
  }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );

  const SimpleBarChart = ({ data, labels, color }: { data: number[]; labels: string[]; color: string }) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className="space-y-3">
        {data.map((value, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 text-slate-300 text-sm">{labels[index]}</div>
            <div className="flex-1 bg-white/10 rounded-full h-3 relative overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
                style={{ 
                  width: `${(value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              ></div>
            </div>
            <div className="w-12 text-white text-sm font-medium text-right">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  const DonutChart = ({ data }: { data: Array<{ category: string; percentage: number; count: number }> }) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-rose-500'
    ];

    return (
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Simplified donut representation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
          <div className="absolute inset-4 rounded-full bg-slate-900"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{data.length}</div>
              <div className="text-slate-300 text-sm">Categories</div>
            </div>
          </div>
        </div>
        <div className="ml-8 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index % colors.length]}`}></div>
              <div className="flex-1">
                <div className="text-white font-medium">{item.category}</div>
                <div className="text-slate-300 text-sm">{item.count} courses ({item.percentage}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-slate-300 mt-1">
                Comprehensive insights into your institute's performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl text-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button 
                onClick={loadAnalyticsData}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Students"
            value={analyticsData.overview.totalStudents.toLocaleString()}
            change={analyticsData.overview.studentGrowth}
            changeType="increase"
            icon={Users}
            color="from-blue-500 to-cyan-500"
            index={0}
          />
          <MetricCard
            title="Course Completion"
            value={`${analyticsData.overview.courseCompletionRate}%`}
            change={5.2}
            changeType="increase"
            icon={Award}
            color="from-green-500 to-emerald-500"
            index={1}
          />
          <MetricCard
            title="Average Rating"
            value={analyticsData.overview.averageRating}
            change={2.1}
            changeType="increase"
            icon={Star}
            color="from-yellow-500 to-orange-500"
            index={2}
          />
          <MetricCard
            title="Monthly Revenue"
            value={`₹${(analyticsData.overview.monthlyRevenue / 1000).toFixed(0)}K`}
            change={18.7}
            changeType="increase"
            icon={TrendingUp}
            color="from-purple-500 to-pink-500"
            index={3}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Student Growth Chart */}
          <ChartCard 
            title="Student Enrollment Trends"
            actions={
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <BarChart3 className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <PieChart className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Filter className="w-4 h-4 text-white" />
                </button>
              </div>
            }
          >
            <SimpleBarChart 
              data={analyticsData.studentMetrics.newEnrollments}
              labels={analyticsData.studentMetrics.months}
              color="from-blue-500 to-cyan-500"
            />
          </ChartCard>

          {/* Course Distribution */}
          <ChartCard 
            title="Course Category Distribution"
            actions={
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Target className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Calendar className="w-4 h-4 text-white" />
                </button>
              </div>
            }
          >
            <DonutChart data={analyticsData.courseMetrics.categoryDistribution} />
          </ChartCard>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Courses */}
          <div className="lg:col-span-2">
            <ChartCard title="Top Performing Courses">
              <div className="space-y-4">
                {analyticsData.courseMetrics.topCourses.map((course, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{course.name}</h4>
                        <p className="text-slate-300 text-sm">{course.enrollments} students enrolled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-400 mb-1">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="text-white">{course.rating}</span>
                      </div>
                      <div className="text-slate-300 text-sm">{course.completion}% completion</div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Key Performance Indicators */}
          <ChartCard title="Key Performance Indicators">
            <div className="space-y-6">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {analyticsData.performanceMetrics.avgSessionTime}
                </div>
                <div className="text-slate-300 text-sm">Avg. Session Time</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {analyticsData.performanceMetrics.retentionRate}%
                </div>
                <div className="text-slate-300 text-sm">Student Retention</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {analyticsData.performanceMetrics.satisfactionScore}
                </div>
                <div className="text-slate-300 text-sm">Satisfaction Score</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {analyticsData.performanceMetrics.bounceRate}%
                </div>
                <div className="text-slate-300 text-sm">Bounce Rate</div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Additional Insights */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Growth Opportunity</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Your student enrollment is growing 12.5% month-over-month. Consider expanding course offerings in high-demand categories.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 mr-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Retention Focus</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Course completion rate is excellent at 87.3%. Focus on maintaining quality while scaling your programs.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Performance Boost</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Consider subscribing to more global courses in Data Science and AI to meet growing student demand.
              </p>
            </div>
            
            {/* Additional Insights */}
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mr-3">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Premium Features</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Upgrade to premium to unlock advanced analytics, custom reports, and AI-powered insights.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 mr-3">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Activity Trends</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Peak activity hours are 2-4 PM. Schedule important announcements during these times for maximum engagement.
              </p>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 mr-3">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Instructor Excellence</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Your instructors maintain a 4.6/5 average rating. Consider implementing instructor recognition programs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default InstitutionAnalytics;