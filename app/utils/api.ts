import { API_BASE_URL } from '../config';

/**
 * API utility functions with JWT token authentication
 */

/**
 * Get the authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hrms_token');
};

/**
 * Get the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hrms_refresh_token');
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('hrms_authenticated') && !!getAuthToken();
};

/**
 * Get the user role from localStorage
 */
export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hrms_role');
};

/**
 * Check if the token is expired
 * This is a basic check - for more accurate checking, decode the token and check its exp claim
 */
export const isTokenExpired = (): boolean => {
  return false; // Implement proper token expiration check if needed
};

/**
 * Get the authenticated user from localStorage
 */
export const getAuthUser = (): any => {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('hrms_user');
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Save auth data to localStorage
 */
export const saveAuthData = (data: any): void => {
  if (typeof window === 'undefined') return;
  
  if (data.user) localStorage.setItem('hrms_user', JSON.stringify(data.user));
  if (data.token) localStorage.setItem('hrms_token', data.token);
  if (data.refreshToken) localStorage.setItem('hrms_refresh_token', data.refreshToken);
  if (data.role) localStorage.setItem('hrms_role', data.role);
  
  localStorage.setItem('hrms_authenticated', 'true');
};

/**
 * Logout the user by clearing localStorage
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('hrms_token');
  localStorage.removeItem('hrms_refresh_token');
  localStorage.removeItem('hrms_authenticated');
  localStorage.removeItem('hrms_user');
  localStorage.removeItem('hrms_role');
  window.location.href = '/auth/login';
};

/**
 * Refresh the authentication token
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = getRefreshToken();
    
    if (!token) return false;
    
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token }),
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('hrms_token', data.token);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

/**
 * Make an authenticated API request with the JWT token
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Prepare headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // If the token is expired or invalid
    if (response.status === 401) {
      // Try to refresh the token if the response indicates token expiration
      const data = await response.json().catch(() => ({}));
      
      if (data.expired) {
        // Token is expired, try to refresh it
        const refreshed = await refreshToken();
        
        if (refreshed) {
          // Retry the request with the new token
          return apiRequest(endpoint, options);
        } else {
          // If refresh failed, log out
          logout();
          throw new Error('Session expired. Please login again.');
        }
      } else {
        // Other authentication error
        logout();
        throw new Error('Authentication failed. Please login again.');
      }
    }
    
    // Parse the response based on content type
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      throw new Error(
        typeof data === 'object' && data.message
          ? data.message
          : `Request failed with status ${response.status}`
      );
    }
    
    return data;
  } catch (error) {
    // Re-throw the error for handling in the component
    throw error;
  }
};

/**
 * Verify if the current token is valid
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    await apiRequest('/api/auth/verify');
    return true;
  } catch (error) {
    return false;
  }
};

// Convenience methods for common HTTP verbs
export const api = {
  get: (endpoint: string, options: RequestInit = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data: any, options: RequestInit = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  put: (endpoint: string, data: any, options: RequestInit = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  patch: (endpoint: string, data: any, options: RequestInit = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: (endpoint: string, options: RequestInit = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
}; 