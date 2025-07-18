import React, { useState } from 'react';
import { apiService, ApiError } from '@/app/components/services/api';
import { useCourses } from '../hooks/useCourses';
import { useCourse } from '../hooks/useCourse';

export const ApiTestPage: React.FC = () => {
  const [courseId, setCourseId] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { courses, loading: coursesLoading, error: coursesError, refetch } = useCourses();
  const { course, loading: courseLoading, error: courseError, refetchById, refetchByCourseCode } = useCourse();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGetAllCourses = async () => {
    setLoading(true);
    try {
      const courses = await apiService.getAllCourses();
      addResult(`✅ getAllCourses: Found ${courses.length} courses`);
    } catch (error) {
      addResult(`❌ getAllCourses: ${error instanceof ApiError ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const testGetCourseById = async () => {
    if (!courseId.trim()) {
      addResult('❌ getCourseById: Please enter a course ID');
      return;
    }

    setLoading(true);
    try {
      const course = await apiService.getCourseById(courseId);
      addResult(`✅ getCourseById: Found course "${course.name}"`);
    } catch (error) {
      addResult(`❌ getCourseById: ${error instanceof ApiError ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const testGetCourseIdByCourseCode = async () => {
    if (!courseCode.trim()) {
      addResult('❌ getCourseIdByCourseCode: Please enter a course code');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.getCourseIdByCourseCode(courseCode);
      addResult(`✅ getCourseIdByCourseCode: Found ID "${result.id}" for course code "${courseCode}"`);
    } catch (error) {
      addResult(`❌ getCourseIdByCourseCode: ${error instanceof ApiError ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const testGetCourseByCourseCode = async () => {
    if (!courseCode.trim()) {
      addResult('❌ getCourseByCourseCode: Please enter a course code');
      return;
    }

    setLoading(true);
    try {
      const course = await apiService.getCourseByCourseCode(courseCode);
      addResult(`✅ getCourseByCourseCode: Found course "${course.name}" for code "${courseCode}"`);
    } catch (error) {
      addResult(`❌ getCourseByCourseCode: ${error instanceof ApiError ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">API Testing Dashboard</h1>
        
        {/* API Endpoints Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Available Endpoints:</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <code className="bg-gray-200 px-2 py-1 rounded">GET /api/courses</code> - Get all courses</li>
            <li>• <code className="bg-gray-200 px-2 py-1 rounded">GET /api/courses/{'{courseId}'}</code> - Get course by ID</li>
            <li>• <code className="bg-gray-200 px-2 py-1 rounded">GET /api/courses/{'{courseCode}'}/id</code> - Get course ID by course code</li>
          </ul>
        </div>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Get All Courses */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Get All Courses</h3>
            <button
              onClick={testGetAllCourses}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              Test getAllCourses()
            </button>
          </div>

          {/* Get Course by ID */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Get Course by ID</h3>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Enter course ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={testGetCourseById}
              disabled={loading || !courseId.trim()}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              Test getCourseById()
            </button>
          </div>

          {/* Get Course ID by Course Code */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Get Course ID by Course Code</h3>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter course code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={testGetCourseIdByCourseCode}
              disabled={loading || !courseCode.trim()}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
            >
              Test getCourseIdByCourseCode()
            </button>
          </div>

          {/* Get Course by Course Code */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Get Course by Course Code</h3>
            <button
              onClick={testGetCourseByCourseCode}
              disabled={loading || !courseCode.trim()}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              Test getCourseByCourseCode()
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Test Results</h3>
            <button
              onClick={clearResults}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear Results
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">No test results yet. Click a test button to start.</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hooks Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">React Hooks Demo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* useCourses Hook */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">useCourses Hook</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Loading: {coursesLoading ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-gray-600">
                Courses: {courses.length}
              </p>
              {coursesError && (
                <p className="text-sm text-red-600">Error: {coursesError}</p>
              )}
              <button
                onClick={refetch}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Refetch Courses
              </button>
            </div>
          </div>

          {/* useCourse Hook */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">useCourse Hook</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Loading: {courseLoading ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-gray-600">
                Course: {course ? course.title : 'None'}
              </p>
              {courseError && (
                <p className="text-sm text-red-600">Error: {courseError}</p>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => courseId && refetchById(courseId)}
                  disabled={!courseId}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  Fetch by ID
                </button>
                <button
                  onClick={() => courseCode && refetchByCourseCode(courseCode)}
                  disabled={!courseCode}
                  className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  Fetch by Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};