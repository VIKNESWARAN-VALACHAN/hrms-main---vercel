"use client";

import { useState, useEffect, FormEvent } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { API_ROUTES } from '../config';
import { API_BASE_URL } from '../config';
import { getAuthToken } from '../utils/api';
import { useTheme } from './ThemeProvider';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear fields and errors when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Toggle visibility functions
  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // if(formData.currentPassword === formData.newPassword) {
    //   newErrors.newPassword = 'New password cannot be the same as the current password';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(errors.currentPassword || errors.newPassword || errors.confirmPassword, {
        position: 'top-center',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get user info from localStorage
      const userString = localStorage.getItem('hrms_user');
      if (!userString) {
        toast.error('User information not found', {
          position: 'top-center',
        });
        setIsLoading(false);
        return;
      }
      
      const user = JSON.parse(userString);
      
      const token = localStorage.getItem('hrms_token');
      
      if (!token) {
        toast.error('Token not found', {
          position: 'top-center',
        });
        setIsLoading(false);
        return;
      }
      // Make API call to change password
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.auth}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }
      
      toast.success('Password changed successfully');
      onClose();
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error: any) {
      toast.error(error.message || 'An error occurred', {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open z-50">
      <div className={`modal-box max-w-md ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} relative`}>
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-blue-500' : 'from-blue-400 to-blue-500'} text-white px-6 py-4 rounded-t-box -mt-6 -mx-6 mb-6`}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </h3>
          <p className="text-sm opacity-90 mt-1">Update your account password</p>
        </div>
        
        {/* Close button */}
        <button 
          onClick={() => {
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({});
            onClose();
          }} 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
          aria-label="Close"
        >
          ✕
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
          {/* Password fields with icons */}
          <div className="form-control">
            <label className="label">
              <span className={`label-text font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Current Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`input input-bordered w-full pr-10 ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${
                  errors.currentPassword 
                    ? `${theme === 'light' ? 'border-red-500' : 'border-red-400'}` 
                    : `focus:${theme === 'light' ? 'border-blue-600' : 'border-blue-400'}`
                }`}
                placeholder="Enter current password"
              />
              <button 
                type="button"
                className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer ${theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                onClick={toggleCurrentPasswordVisibility}
                tabIndex={-1}
              >
                {showCurrentPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <div className={`alert py-2 mt-1 text-xs ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{errors.currentPassword}</span>
              </div>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className={`label-text font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                New Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`input input-bordered w-full pr-10 ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${
                  errors.newPassword 
                    ? `${theme === 'light' ? 'border-red-500' : 'border-red-400'}` 
                    : `focus:${theme === 'light' ? 'border-blue-600' : 'border-blue-400'}`
                }`}
                placeholder="Enter new password"
              />
              <button 
                type="button"
                className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer ${theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                onClick={toggleNewPasswordVisibility}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.newPassword ? (
              <div className={`alert py-2 mt-1 text-xs ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{errors.newPassword}</span>
              </div>
            ) : (
              <div className={`alert py-2 mt-1 text-xs ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Password must be at least 8 characters</span>
              </div>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className={`label-text font-medium flex items-center gap-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Confirm New Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input input-bordered w-full pr-10 ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${
                  errors.confirmPassword 
                    ? `${theme === 'light' ? 'border-red-500' : 'border-red-400'}` 
                    : `focus:${theme === 'light' ? 'border-blue-600' : 'border-blue-400'}`
                }`}
                placeholder="Confirm new password"
              />
              <button 
                type="button"
                className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer ${theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                onClick={toggleConfirmPasswordVisibility}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className={`alert py-2 mt-1 text-xs ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="modal-action mt-6 flex justify-between items-center">
            <div className="flex-1">
              {isLoading && <span className={`loading loading-spinner loading-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>}
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => {
                  setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setErrors({});
                  onClose();
                }}
                className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isLoading ? 'loading' : ''}`} 
                disabled={isLoading}
              >
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className={`modal-backdrop ${theme === 'light' ? 'bg-slate-900' : 'bg-black'} opacity-50`} onClick={onClose}></div>
    </div>
    
  );
} 