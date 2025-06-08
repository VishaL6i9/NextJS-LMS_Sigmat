import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '@/app/components/instructor-home-dashboard/contexts/NotificationContext';

const ToastCenter: React.FC = () => {
  const { state, removeToast } = useNotifications();

  useEffect(() => {
    state.toasts.forEach(toast => {
      if (toast.autoClose && toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [state.toasts, removeToast]);

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} border rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-right-2 duration-300`}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${getIconStyles(toast.type)}`}>
                {getToastIcon(toast.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{toast.title}</h4>
                <p className="text-sm opacity-90 mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {toast.autoClose && toast.duration && (
            <div className="h-1 bg-black/10 rounded-b-lg overflow-hidden">
              <div 
                className="h-full bg-current opacity-50 animate-pulse"
                style={{
                  animation: `shrink ${toast.duration}ms linear forwards`
                }}
              />
            </div>
          )}
        </div>
      ))}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ToastCenter;