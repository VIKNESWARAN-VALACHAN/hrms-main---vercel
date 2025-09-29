import React from 'react';

interface NotificationToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const NotificationToast: React.FC<NotificationToastProps> = ({ show, message, type }) => {
  if (!show) return null;

  return (
    <div className="toast toast-middle toast-center z-[9999]">
      <div className={`alert ${
        type === 'success' ? 'alert-success' :
        type === 'error' ? 'alert-error' :
        'alert-info'
      } shadow-lg`}>
        <div className="flex items-center">
          {type === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast; 