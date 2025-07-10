import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { CourseCard } from '../components/Courses/CourseCard';
import { StripeCheckout } from '../components/Payment/StripeCheckout';
import { useData } from '../hooks/useData';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, Plus } from 'lucide-react';
import { Course } from '../types';

export const Courses: React.FC = () => {
  const { courses } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setShowCheckout(true);
    }
  };

  const handleEnrollmentSuccess = () => {
    setShowCheckout(false);
    setSelectedCourse(null);
    // In a real app, update the course enrollment
    alert('Successfully enrolled in the course!');
  };

  const isEnrolled = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.students.includes(user?.id || '') || false;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-1">Discover and enroll in amazing courses</p>
          </div>
          
          {user?.role === 'instructor' && (
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors">
              <Plus size={20} />
              <span>Create Course</span>
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              isEnrolled={isEnrolled(course.id)}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Stripe Checkout Modal */}
        {showCheckout && selectedCourse && (
          <StripeCheckout
            course={selectedCourse}
            onSuccess={handleEnrollmentSuccess}
            onCancel={() => {
              setShowCheckout(false);
              setSelectedCourse(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};