import {
    BookOpen,
    Megaphone,
    Trophy,
    Settings,
    Clock,
    AlertCircle,
    CheckCircle,
    Info,
    AlertTriangle
} from 'lucide-react';

export const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'success':
            return CheckCircle;
        case 'warning':
            return AlertTriangle;
        case 'error':
            return AlertCircle;
        case 'info':
        default:
            return Info;
    }
};

export const getNotificationColor = (type: string) => {
    switch (type) {
        case 'success':
            return {
                bg: 'bg-green-100',
                text: 'text-green-600',
                border: 'border-green-300'
            };
        case 'warning':
            return {
                bg: 'bg-yellow-100',
                text: 'text-yellow-600',
                border: 'border-yellow-300'
            };
        case 'error':
            return {
                bg: 'bg-red-100',
                text: 'text-red-600',
                border: 'border-red-300'
            };
        case 'info':
        default:
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-600',
                border: 'border-blue-300'
            };
    }
};

export const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'assignment':
            return BookOpen;
        case 'announcement':
            return Megaphone;
        case 'grade':
            return Trophy;
        case 'system':
            return Settings;
        case 'reminder':
            return Clock;
        default:
            return Info;
    }
};

export const getCategoryColor = (category: string) => {
    switch (category) {
        case 'assignment':
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-600',
                border: 'border-blue-300'
            };
        case 'announcement':
            return {
                bg: 'bg-purple-100',
                text: 'text-purple-600',
                border: 'border-purple-300'
            };
        case 'grade':
            return {
                bg: 'bg-green-100',
                text: 'text-green-600',
                border: 'border-green-300'
            };
        case 'system':
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-600',
                border: 'border-gray-300'
            };
        case 'reminder':
            return {
                bg: 'bg-orange-100',
                text: 'text-orange-600',
                border: 'border-orange-300'
            };
        default:
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-600',
                border: 'border-blue-300'
            };
    }
};