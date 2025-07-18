import React, {useEffect, useRef, useState} from 'react';
import {Bell, BookOpen, LogOut, Menu, Plus, Search, Settings, User} from 'lucide-react';
import {useInstructor} from '../contexts/InstructorContext';

const InstructorHeader: React.FC = () => {
    const { state } = useInstructor();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Instructor Portal</h1>
                        </div>

                        <nav className="hidden md:flex space-x-6">
                            <a href="#" className="text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2 border-indigo-600">
                                Dashboard
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Courses
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Students
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Assignments
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Analytics
                            </a>
                        </nav>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <div className="hidden md:flex relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses, students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Quick Actions */}
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:block">New Course</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {state.stats.pendingGrades}
              </span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-700">Dr. Sarah Wilson</span>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">Dr. Sarah Wilson</p>
                                        <p className="text-xs text-gray-500">Computer Science Department</p>
                                    </div>
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <User className="w-4 h-4 mr-3" />
                                        Profile
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Settings className="w-4 h-4 mr-3" />
                                        Settings
                                    </a>
                                    <hr className="my-1" />
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Sign out
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default InstructorHeader;