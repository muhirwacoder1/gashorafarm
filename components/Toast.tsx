import React, { useEffect } from 'react';
import { CheckCircle, X, Clock } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'info' | 'error';
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="h-6 w-6 text-lime-600" />,
        info: <Clock className="h-6 w-6 text-blue-600" />,
        error: <X className="h-6 w-6 text-red-600" />,
    };

    const styles = {
        success: 'bg-lime-50 border-lime-200',
        info: 'bg-blue-50 border-blue-200',
        error: 'bg-red-50 border-red-200',
    };

    return (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
            <div className={`flex items-start gap-4 p-6 rounded-2xl border-2 shadow-2xl max-w-md ${styles[type]}`}>
                <div className="flex-shrink-0">{icons[type]}</div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-900 leading-relaxed">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

// Toast container for managing multiple toasts
interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type?: 'success' | 'info' | 'error' }>;
    removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-24 right-4 z-50 space-y-4">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};
