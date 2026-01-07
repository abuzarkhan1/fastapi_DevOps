import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-white/10 backdrop-blur-md transition-all duration-300 animate-fade-in
                            ${toast.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                            ${toast.type === 'info' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                        `}
                        role="alert"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {toast.type === 'success' && 'check_circle'}
                            {toast.type === 'error' && 'error'}
                            {toast.type === 'info' && 'info'}
                        </span>
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
