'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, API_ROUTES } from '@/app/config';
import { saveAuthData } from '@/app/utils/api';
import { useTheme } from '@/app/components/ThemeProvider';

export default function LoginPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Prevent scrolling on this page
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      // Call login API
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.auth}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data using the utility function
      saveAuthData(data);

      router.push('/');
    } catch (error) {
      //console.log('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen overflow-hidden flex flex-col items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-slate-900'} p-2`}>
      <div className="w-full max-w-md px-4">
        {/* Card with shadow */}
        <div className={`card ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-xl ${theme === 'light' ? 'border border-blue-100' : 'border border-slate-600'} overflow-hidden`}>
          {/* Blue header bar */}
          <div className={`bg-gradient-to-r ${theme === 'light' ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-blue-500'} h-3`}></div>
          
          {/* Logo and title section */}
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'} mb-1`}>HRMS</h1>
            <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Sign in to access your HRMS account</p>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="mx-8 mb-4">
              <div className={`alert shadow-sm text-sm ${theme === 'light' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-red-900 border-red-700 text-red-200'} border rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="mb-5">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-1`} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={`input input-bordered w-full ${theme === 'light' ? 'bg-slate-50 focus:bg-white border-blue-100 focus:border-blue-300 text-slate-900' : 'bg-slate-700 focus:bg-slate-600 border-slate-600 focus:border-blue-400 text-slate-100'} transition-colors duration-200 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-1`} htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-slate-50 focus:bg-white border-blue-100 focus:border-blue-300 text-slate-900' : 'bg-slate-700 focus:bg-slate-600 border-slate-600 focus:border-blue-400 text-slate-100'} transition-colors duration-200 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pr-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 ${theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'} hover:cursor-pointer`}
                >
                  {showPassword ? (
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
            </div>
            
            <button 
              type="submit" 
              className={`btn w-full ${theme === 'light' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600'} border-none text-white`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
            
          </form>
        </div>
      </div>
        
      {/* Footer - positioned at bottom */}
      <div className={`text-center mt-4 text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
        © {new Date().getFullYear()} HRMS System. All rights reserved.
      </div>
    </div>
  );
}
