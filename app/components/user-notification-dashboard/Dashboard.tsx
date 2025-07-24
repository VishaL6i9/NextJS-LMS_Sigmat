'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, TrendingUp, Clock, CheckCircle, AlertTriangle, BookOpen, Trophy, Megaphone, Plus, X, Send } from 'lucide-react';
import { useNotifications } from './contexts/NotificationContext';
import SendNotificationForm from './SendNotificationForm';
import ApiDiagnostics from './ApiDiagnostics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeInOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const Dashboard: React.FC = () => {
  const { state, addBulkNotifications, addToast } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const hasFetchedUsers = useRef(false);

  useEffect(() => {
    if (hasFetchedUsers.current) {
      return;
    }

    const fetchUsersWithRetry = async (retryCount = 0) => {
      try {
        console.log('Fetching users from:', `${base_url}/api/public/users`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`${base_url}/api/public/users`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text();
          console.error('Non-JSON response:', responseText.substring(0, 1000));
          
          // Check if it's an HTML error page
          if (responseText.trim().toLowerCase().startsWith('<!doctype html') || 
              responseText.trim().toLowerCase().startsWith('<html')) {
            throw new Error('Server returned HTML error page instead of JSON. Check if the API server is running correctly.');
          }
          
          throw new Error(`Expected JSON response, got ${contentType || 'unknown'}. Response: ${responseText.substring(0, 200)}...`);
        }
        
        // Get response text first to check for issues
        const responseText = await response.text();
        console.log('Response length:', responseText.length, 'characters');
        
        // Check if response is empty
        if (!responseText.trim()) {
          throw new Error('Empty response from server');
        }
        
        // Log large responses
        if (responseText.length > 100000) { // 100KB
          console.warn('Large response detected:', responseText.length, 'characters');
        }
        
        // Try to parse JSON with better error handling
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Successfully parsed JSON. Users count:', Array.isArray(data) ? data.length : 'Not an array');
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response text (first 1000 chars):', responseText.substring(0, 1000));
          console.error('Response text (around error position):', responseText.substring(Math.max(0, 102200), 102300));
          console.error('Response text (last 1000 chars):', responseText.substring(Math.max(0, responseText.length - 1000)));
          
          // Try to find the issue in the JSON
          const lines = responseText.split('\n');
          console.error('Response has', lines.length, 'lines');
          
          throw new Error(`JSON Parse Error at position ~102203: ${parseError.message}`);
        }
        
        // Validate the data structure
        if (!Array.isArray(data)) {
          console.warn('Expected array of users, got:', typeof data);
          throw new Error('Invalid response format: expected array of users');
        }
        
        setUsers(data);
        hasFetchedUsers.current = true;
        console.log('Successfully loaded', data.length, 'users');
        
      } catch (error) {
        console.error('Error fetching users:', error);
        
        // Provide fallback empty array to prevent UI issues
        setUsers([]);
        
        let errorMessage = 'Failed to fetch users';
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out - server may be slow';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // Retry logic for network errors
        if (retryCount < 2 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
          console.log(`Retrying fetch users (attempt ${retryCount + 2}/3)...`);
          setTimeout(() => fetchUsersWithRetry(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }
        
        addToast({ 
          title: 'Error', 
          message: errorMessage, 
          type: 'ERROR' 
        });
      }
    };

    const fetchUsers = () => fetchUsersWithRetry();
    fetchUsers();
  }, [base_url, addToast]);

  const getCategoryStats = () => {
    const categories = state.notifications.reduce((acc, notification) => {
      const category = notification.category || 'other';
      if (!acc[category]) acc[category] = { total: 0, unread: 0 };
      acc[category].total++;
      if (!notification.isRead) acc[category].unread++;
      return acc;
    }, {} as Record<string, { total: number; unread: number }>);
    return Object.entries(categories).map(([category, stats]) => ({ category, ...stats }));
  };

  const categoryStats = getCategoryStats();
  const recentNotifications = state.notifications.slice(0, 5);

  const statsCards = [
      { title: 'Total Notifications', value: state.stats.total, icon: Bell, color: 'from-blue-500 to-cyan-500' },
      { title: 'Unread', value: state.stats.unread, icon: AlertTriangle, color: 'from-red-500 to-orange-500' },
      { title: 'Sent Today', value: state.stats.today, icon: Clock, color: 'from-green-500 to-emerald-500' },
      { title: 'Sent This Week', value: state.stats.thisWeek, icon: CheckCircle, color: 'from-purple-500 to-violet-500' }
  ];

  const getCategoryVisuals = (category: string) => {
    switch (category) {
      case 'assignment': return { icon: BookOpen, color: 'from-sky-500 to-blue-600' };
      case 'grade': return { icon: Trophy, color: 'from-amber-500 to-orange-600' };
      case 'announcement': return { icon: Megaphone, color: 'from-indigo-500 to-purple-600' };
      case 'system': return { icon: AlertTriangle, color: 'from-rose-500 to-red-600' };
      case 'reminder': return { icon: Clock, color: 'from-yellow-500 to-amber-600' };
      default: return { icon: Bell, color: 'from-slate-500 to-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12" variants={fadeInUp} initial="initial" animate="animate">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Notification Hub
                    </h1>
                    <p className="text-xl text-gray-600">Broadcast messages and manage system alerts.</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={() => setShowForm(prev => !prev)}
                        className="mt-4 md:mt-0 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                    >
                        {showForm ? <X className="mr-2 h-5 w-5" /> : <Send className="mr-2 h-5 w-5" />}
                        {showForm ? 'Close Composer' : 'Create Notification'}
                    </Button>
                </motion.div>
            </motion.div>

            {/* API Diagnostics - Temporary for debugging */}
            <ApiDiagnostics />

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="mb-12 overflow-hidden"
                    >
                        <SendNotificationForm users={users} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Grid */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" variants={staggerContainer} initial="initial" animate="animate">
                {statsCards.map((stat) => (
                    <motion.div key={stat.title} variants={fadeInUp}>
                        <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                                    <stat.icon className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Breakdown */}
                <motion.div className="lg:col-span-1" variants={fadeInUp} initial="initial" animate="animate">
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-900">By Category</CardTitle>
                            <CardDescription>Breakdown of all notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {categoryStats.map(({ category, total, unread }) => {
                                const { icon: Icon, color } = getCategoryVisuals(category);
                                return (
                                    <div key={category} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${color} mr-4`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900 capitalize">{category}</p>
                                            <p className="text-sm text-gray-500">{total} total</p>
                                        </div>
                                        <div className="text-right">
                                            {unread > 0 && (
                                                <Badge variant="destructive">{unread} unread</Badge>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Notifications */}
                <motion.div className="lg:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-900">Recent Activity</CardTitle>
                            <CardDescription>The latest notifications sent out.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recentNotifications.map((notification) => {
                                    const { icon: Icon, color } = getCategoryVisuals(notification.category || 'other');
                                    return (
                                        <motion.div key={notification.id} whileHover={{ scale: 1.02 }} className="flex items-start space-x-4 p-3 -m-3 rounded-lg hover:bg-gray-500/10 transition-colors">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${color} mt-1`}>
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && <Badge variant="default">New</Badge>}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 truncate">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(notification.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
