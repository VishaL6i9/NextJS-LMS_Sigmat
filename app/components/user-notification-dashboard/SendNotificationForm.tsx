import React, { useState } from 'react';
import { Send, Users, CheckCircle, Bell } from 'lucide-react';
import { useNotifications } from './contexts/NotificationContext';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const typeOptions = [
  { value: 'INFO', label: 'Information', color: 'bg-blue-100 text-blue-800', icon: '💡' },
  { value: 'SUCCESS', label: 'Success', color: 'bg-green-100 text-green-800', icon: '✅' },
  { value: 'WARNING', label: 'Warning', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
  { value: 'ERROR', label: 'Error', color: 'bg-red-100 text-red-800', icon: '❌' }
];

const categoryOptions = [
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'GRADE', label: 'Grade' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'REMINDER', label: 'Reminder' }
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
];

const SendNotificationForm: React.FC<{ users: User[] }> = ({ users }) => {
  const { addNotification, addBulkNotifications, addToast, state } = useNotifications();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'>('INFO');
  const [category, setCategory] = useState<'ANNOUNCEMENT' | 'ASSIGNMENT' | 'GRADE' | 'SYSTEM' | 'REMINDER'>('ANNOUNCEMENT');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [isGlobal, setIsGlobal] = useState(true);
  const [targetUserId, setTargetUserId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const notificationPayload = {
        title,
        message,
        type: type.toUpperCase(),
        category: category.toUpperCase(),
        priority: priority.toUpperCase(),
        isRead: false,
      };
      if (isGlobal) {
        // Send to all users
        const userIds = users.map(u => u.id);
        await addBulkNotifications(notificationPayload, userIds);
        addToast({
          title: 'Success',
          message: `Notification sent to all users!`,
          type: 'success',
        });
      } else {
        if (!targetUserId) throw new Error('User ID required');
        await addBulkNotifications(notificationPayload, [Number(targetUserId)]);
        addToast({
          title: 'Success',
          message: `Notification sent to user ${targetUserId}!`,
          type: 'success',
        });
      }
      setTitle('');
      setMessage('');
      setType('INFO');
      setCategory('ANNOUNCEMENT');
      setPriority('MEDIUM');
      setIsGlobal(true);
      setTargetUserId('');
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (err: any) {
      addToast({
        title: 'Error',
        message: err.message || 'Failed to send notification',
        type: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-10">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Notifications</h1>
        <p className="text-gray-600">Send announcements and updates to your users</p>
      </div>

      {/* Success Message */}
      {sendSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="text-green-500" size={20} />
          <p className="text-green-800 font-medium">Notification sent successfully!</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notification Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {typeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    type === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={type === option.value}
                    onChange={(e) => setType(e.target.value as any)}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${option.color} mt-1`}>
                      {option.value}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Send To
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="audience"
                  checked={isGlobal}
                  onChange={() => setIsGlobal(true)}
                  className="mr-3"
                />
                <Users className="mr-2 text-blue-500" size={20} />
                <div>
                  <div className="font-medium">All Users</div>
                  <div className="text-sm text-gray-600">Send to everyone on the platform</div>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="audience"
                  checked={!isGlobal}
                  onChange={() => setIsGlobal(false)}
                  className="mr-3"
                />
                <Users className="mr-2 text-purple-500" size={20} />
                <div>
                  <div className="font-medium">Specific User</div>
                  <div className="text-sm text-gray-600">Send to a specific user by ID</div>
                </div>
              </label>
            </div>

            {!isGlobal && (
              <div className="mt-3">
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Enter user ID..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isGlobal}
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">Preview</h3>
            <div className={`p-3 rounded-lg border-l-4 ${
              type === 'INFO' ? 'bg-blue-50 border-blue-500' :
              type === 'SUCCESS' ? 'bg-green-50 border-green-500' :
              type === 'WARNING' ? 'bg-yellow-50 border-yellow-500' :
              'bg-red-50 border-red-500'
            }`}>
              <div className="font-medium text-gray-900">
                {title || 'Notification Title'}
              </div>
              <div className="text-gray-700 mt-1">
                {message || 'Your message will appear here...'}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Category: {category}
                <br />Priority: {priority}
                <br />{isGlobal ? 'Sent to all users' : `Sent to user: ${targetUserId || 'N/A'}`}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            <span>{isSending ? 'Sending...' : 'Send Notification'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationForm; 