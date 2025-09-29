'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserRole, verifyToken } from '../utils/api';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

/**
 * ProtectedRoute component for handling authentication and authorization
 * 
 * @param children - The components to render if the user is authenticated
 * @param requiredRoles - Optional array of roles allowed to access the route
 */
export default function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      // First check local storage for authentication
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }
      
      // Verify the token with the server
      try {
        const isValid = await verifyToken();
        
        if (!isValid) {
          // Token is invalid, redirect to login
          router.push('/auth/login');
          return;
        }
        
        // If specific roles are required, check if the user has the necessary role
        if (requiredRoles.length > 0) {
          const userRole = getUserRole();
          
          if (!userRole || !requiredRoles.includes(userRole)) {
            // Redirect to unauthorized page or dashboard
            router.push('/unauthorized');
            return;
          }
        }
        
        // Authentication and authorization successful
        setIsVerified(true);
      } catch (error) {
        console.error('Authentication verification failed:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router, requiredRoles]);
  
  // Show loading state while verifying
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>;
  }
  
  // Return the children components if authentication checks pass
  return isVerified ? <>{children}</> : null;
} 