// components/ui/toaster.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastMessage
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastMessage = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between min-w-[200px]`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        &times;
      </button>
    </div>
  );
};

// Create a reference to store our toast functions
let toastFunctions: Omit<ToastContextType, 'toasts'> | null = null;

// This component will set the toast functions reference
export const ToastSetter = () => {
  const { addToast, removeToast } = useContext(ToastContext)!;
  
  // Set the reference once when component mounts
  React.useEffect(() => {
    toastFunctions = { addToast, removeToast };
    return () => {
      toastFunctions = null;
    };
  }, [addToast, removeToast]);

  return null;
};

// Export the toaster object that uses the reference
export const _rht_toaster = {
  success: (message: string) => toastFunctions?.addToast(message, 'success'),
  error: (message: string) => toastFunctions?.addToast(message, 'error'),
  warning: (message: string) => toastFunctions?.addToast(message, 'warning'),
  info: (message: string) => toastFunctions?.addToast(message, 'info'),
};

// Hook for direct usage in components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};