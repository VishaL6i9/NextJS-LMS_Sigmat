import React from 'react';
import { Bell, TrendingUp, Clock, CheckCircle, AlertTriangle, BookOpen, Trophy, Megaphone, Plus } from 'lucide-react';
import { useNotifications } from './contexts/NotificationContext';

const Dashboard: React.FC = () => {
  const { state, addNotification, addToast } = useNotifications();

  const handleAddSampleNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      const notification = {
        title: 'New Course Available',
        message: 'Advanced React Patterns course is now available for enrollment.',
        type: 'info' as const,
        category: 'announcement' as const,
        priority: 'medium' as const,
        isRead: false
      };

      await addNotification(notification);
      
      addToast({
        title: 'Success',
        message: 'New notification has been added!',
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to add notification',
        type: 'error'
      });
    }
  };

  const getCategoryStats = () => {
    const categories = state.notifications.reduce((acc, notification) => {
      const category = notification.category || 'other';
      if (!acc[category]) {
        acc[category] = { total: 0, unread: 0 };
      }
      acc[category].total++;
      if (!notification.isRead) {
        acc[category].unread++;
      }
      return acc;
    }, {} as Record<string, { total: number; unread: number }>);

    return Object.entries(categories).map(([category, stats]) => ({
      category,
      ...stats
    }));
  };

  const categoryStats = getCategoryStats();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assignment':
        return <BookOpen className="w-5 h-5" />;
      case 'grade':
        return <Trophy className="w-5 h-5" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5" />;
      case 'system':
        return <AlertTriangle className="w-5 h-5" />;
      case 'reminder':
        return <Clock className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assignment':
        return 'bg-blue-100 text-blue-700';
      case 'grade':
        return 'bg-green-100 text-green-700';
      case 'announcement':
        return 'bg-purple-100 text-purple-700';
      case 'system':
        return 'bg-red-100 text-red-700';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const recentNotifications = state.notifications.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your learning notifications and stay updated</p>
          </div>
          <button
            onClick={handleAddSampleNotification}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sample</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{state.stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{state.stats.unread}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Needs attention</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{state.stats.today}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Received today</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{state.stats.thisWeek}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-500">Past 7 days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications by Category</h2>
          <div className="space-y-4">
            {categoryStats.map(({ category, total, unread }) => (
              <div key={category} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{category}</p>
                    <p className="text-sm text-gray-500">{total} total notifications</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{total}</p>
                  {unread > 0 && (
                    <p className="text-sm text-red-600 font-medium">{unread} unread</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Notifications</h2>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${getCategoryColor(notification.category || 'other')}`}>
                  {getCategoryIcon(notification.category || 'other')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleDateString()} at{' '}
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;