'use client';
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useHomeNotifications } from '../user-home-dashboard/contexts/HomeNotificationContext';

export const ToastCenter = () => {
    const { toasts, dismissToast } = useHomeNotifications();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        relative flex items-center justify-between
                        min-w-[300px] p-4 rounded-lg shadow-lg
                        ${toast.type === 'success' ? 'bg-green-100 text-green-800' : ''}
                        ${toast.type === 'error' ? 'bg-red-100 text-red-800' : ''}
                        ${toast.type === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                        ${toast.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}
                >
                    <div>
                        {toast.title && <h4 className="font-semibold">{toast.title}</h4>}
                        <p>{toast.message}</p>
                    </div>
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="ml-4 p-1 hover:bg-black/10 rounded"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

interface ToastProps {
    toast: {
        id: string;
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        duration?: number;
    };
    onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isExiting, setIsExiting] = React.useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const enterTimer = setTimeout(() => setIsVisible(true), 10);

        return () => clearTimeout(enterTimer);
    }, []);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    const getToastStyles = () => {
        const baseStyles = "transform transition-all duration-300 ease-in-out";

        if (isExiting) {
            return `${baseStyles} translate-x-full opacity-0`;
        }

        if (isVisible) {
            return `${baseStyles} translate-x-0 opacity-100`;
        }

        return `${baseStyles} translate-x-full opacity-0`;
    };

    const getToastConfig = () => {
        switch (toast.type) {
            case 'success':
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconColor: 'text-green-600',
                    titleColor: 'text-green-800',
                    messageColor: 'text-green-700',
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconColor: 'text-red-600',
                    titleColor: 'text-red-800',
                    messageColor: 'text-red-700',
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconColor: 'text-yellow-600',
                    titleColor: 'text-yellow-800',
                    messageColor: 'text-yellow-700',
                };
            default:
                return {
                    icon: Info,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconColor: 'text-blue-600',
                    titleColor: 'text-blue-800',
                    messageColor: 'text-blue-700',
                };
        }
    };

    const config = getToastConfig();
    const Icon = config.icon;

    return (
        <div className={`${getToastStyles()}`}>
            <div className={`max-w-sm w-full ${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg pointer-events-auto`}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Icon className={`h-5 w-5 ${config.iconColor}`} />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            <p className={`text-sm font-medium ${config.titleColor}`}>
                                {toast.title}
                            </p>
                            <p className={`mt-1 text-sm ${config.messageColor}`}>
                                {toast.message}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className={`inline-flex ${config.iconColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md`}
                                onClick={handleDismiss}
                            >
                                <span className="sr-only">Close</span>
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};