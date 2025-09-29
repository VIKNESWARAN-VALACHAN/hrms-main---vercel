'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = () => {
      const auth = localStorage.getItem('hrms_authenticated');
      setIsAuthenticated(auth === 'true');

      // If not authenticated and not on login page, redirect to login
      if (auth !== 'true' && pathname !== '/auth/login') {
        router.push('/auth/login');
      }
      
      setIsLoading(false);
    };

    // Run the auth check
    checkAuth();

    // Listen for storage events (in case another tab logs out)
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Allow access to login page regardless of auth status
  const isLoginPage = pathname === '/auth/login';
  
  // Return the children if authenticated or if trying to access the login page
  return (
    <>
      {(isAuthenticated || isLoginPage) ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="mb-4">Please login to access this content</p>
            <button 
              onClick={() => router.push('/auth/login')} 
              className="btn btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
} 