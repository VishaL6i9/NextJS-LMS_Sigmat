'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Filter, 
  Star,  
  Clock, 
  BookOpen, 
  Crown, 
  Zap, 
  Shield, 
  ChevronRight,
  Play,
  Award,
  TrendingUp,
  Heart,
  Share2,
  ShoppingCart,
  X,
  Calendar,
  DollarSign,
  Target
} from 'lucide-react';
import { Users } from '@/components/ui/Users';
import { Check } from '@/components/ui/Check';
import { Sparkles } from '@/components/ui/Sparkles';
import { 
  getAllCourses,
  getInstituteByAdminId,
  subscribeInstituteToGlobalCourse,
  getInstituteSubscriptions,
  getUserId,
  CourseDTO,
  InstituteDTO,
  CourseSubscriptionRequestDTO,
  InstituteSubscriptionDTO,
  COURSE_SCOPE,
  getCourseAccessBadgeText,
  getCourseAccessBadgeColor
} from '@/app/components/services/api';

interface GlobalCourse extends CourseDTO {
  instructor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isSubscribed: boolean;
  subscriptionExpiry?: string;
  tags: string[];
  preview: string;
}

const GlobalCoursesMarketplace = () => {
  const [institute, setInstitute] = useState<InstituteDTO | null>(null);
  const [courses, setCourses] = useState<GlobalCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<GlobalCourse[]>([]);
  const [subscriptions, setSubscriptions] = useState<InstituteSubscriptionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<GlobalCourse | null>(null);

  const categories = [
    'All Categories',
    'Programming',
    'Data Science',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Cybersecurity',
    'UI/UX Design',
    'Business',
    'Marketing'
  ];

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedDifficulty, priceRange, sortBy]);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const instituteData = await getInstituteByAdminId(parseInt(userId));
      setInstitute(instituteData);

      const [allCourses, instituteSubscriptions] = await Promise.all([
        getAllCourses(),
        getInstituteSubscriptions(instituteData.instituteId)
      ]);

      // Filter only global courses and add mock data
      const globalCourses: GlobalCourse[] = allCourses
        .filter(course => course.courseScope === COURSE_SCOPE.GLOBAL)
        .map((course, index) => ({
          ...course,
          instructor: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][index % 5]}`,
          difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as 'Beginner' | 'Intermediate' | 'Advanced',
          duration: `${Math.floor(Math.random() * 12) + 4} weeks`,
          price: Math.floor(Math.random() * 5000) + 1000,
          originalPrice: Math.floor(Math.random() * 2000) + 6000,
          discount: Math.floor(Math.random() * 50) + 10,
          isSubscribed: instituteSubscriptions.some(sub => sub.courseId === parseInt(course.courseId) && sub.isActive),
          subscriptionExpiry: instituteSubscriptions.find(sub => sub.courseId === parseInt(course.courseId))?.expiryDate,
          tags: ['JavaScript', 'React', 'Node.js', 'Python', 'AI', 'ML'].slice(0, Math.floor(Math.random() * 4) + 2),
          preview: 'https://example.com/preview'
        }));

      setCourses(globalCourses);
      setSubscriptions(instituteSubscriptions);
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.courseCategory === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(course => course.price >= min && course.price <= max);
    }

    // Sort courses
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredCourses(filtered);
  };

  const handleSubscribe = async (course: GlobalCourse) => {
    if (!institute) return;

    try {
      const subscriptionData: CourseSubscriptionRequestDTO = {
        instituteId: institute.instituteId,
        courseId: parseInt(course.courseId),
        autoEnrollStudents: true,
        autoEnrollInstructors: false
      };

      await subscribeInstituteToGlobalCourse(subscriptionData);
      
      // Update local state
      setCourses(prev => prev.map(c => 
        c.courseId === course.courseId 
          ? { ...c, isSubscribed: true }
          : c
      ));

      setShowSubscribeModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Failed to subscribe to course:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-500';
      case 'Intermediate': return 'from-yellow-500 to-orange-500';
      case 'Advanced': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const CourseCard = ({ course, index }: { course: GlobalCourse; index: number }) => (
    <div 
      className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl group animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Course Header */}
      <div className="relative mb-6">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <Play className="w-12 h-12 text-white z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(course.difficulty)} text-white text-xs font-medium`}>
              {course.difficulty}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Heart className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        {course.isSubscribed && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Crown className="w-3 h-3" />
            <span>Subscribed</span>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
            {course.courseName}
          </h3>
          <p className="text-slate-300 text-sm line-clamp-2">
            {course.courseDescription}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-slate-300">
            <Users className="w-4 h-4 mr-1" />
            {course.studentsEnrolled.toLocaleString()} students
          </div>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 mr-1 fill-current" />
            {course.rating}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-slate-300">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center text-slate-300">
            <Calendar className="w-4 h-4 mr-1" />
            <span>by {course.instructor}</span>
          </div>
        </div>
        
        {/* Additional Course Info */}
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center text-slate-300">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Trending</span>
          </div>
          <div className="flex items-center text-slate-300">
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Premium</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {course.tags.slice(0, 3).map((tag, tagIndex) => (
            <span 
              key={tagIndex}
              className="px-2 py-1 bg-white/10 rounded-lg text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">₹{course.price.toLocaleString()}</span>
              {course.originalPrice && (
                <span className="text-slate-400 line-through text-sm">₹{course.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {course.discount && (
              <div className="flex items-center text-green-400 text-xs font-medium">
                <Zap className="w-3 h-3 mr-1" />
                <span>{course.discount}% OFF</span>
              </div>
            )}
          </div>
          
          {course.isSubscribed ? (
            <div className="flex items-center space-x-2 text-green-400 text-sm font-medium bg-green-500/20 px-3 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              <span>Active</span>
            </div>
          ) : (
            <button 
              onClick={() => {
                setSelectedCourse(course);
                setShowSubscribeModal(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Subscribe</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading global courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 mr-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Global Courses Marketplace
              </h1>
            </div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Discover and subscribe to premium courses from top institutions worldwide. 
              Expand your institute's offerings with cutting-edge content.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-blue-400 mr-2" />
                <div className="text-3xl font-bold text-white">{courses.length}</div>
              </div>
              <div className="text-slate-300 text-sm">Global Courses</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-green-400 mr-2" />
                <div className="text-3xl font-bold text-white">{subscriptions.filter(s => s.isActive).length}</div>
              </div>
              <div className="text-slate-300 text-sm">Active Subscriptions</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-purple-400 mr-2" />
                <div className="text-3xl font-bold text-white">50+</div>
              </div>
              <div className="text-slate-300 text-sm">Partner Institutions</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-yellow-400 mr-2" />
                <div className="text-3xl font-bold text-white">4.8</div>
              </div>
              <div className="text-slate-300 text-sm">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Prices</option>
              <option value="0-2000">₹0 - ₹2,000</option>
              <option value="2000-5000">₹2,000 - ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="10000-999999">₹10,000+</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl text-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.courseId} course={course} index={index} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 w-fit mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Subscribe to Course</h3>
              <p className="text-slate-300">
                Subscribe your institute to "{selectedCourse.courseName}"
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-slate-300">Course Price</span>
                <span className="text-white font-bold">₹{selectedCourse.price.toLocaleString()}</span>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/30 bg-white/10 text-blue-500" />
                  <span className="text-white">Auto-enroll current students</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-white/30 bg-white/10 text-blue-500" />
                  <span className="text-white">Auto-enroll current instructors</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowSubscribeModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSubscribe(selectedCourse)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GlobalCoursesMarketplace;