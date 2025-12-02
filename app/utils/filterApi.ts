// utils/filterApi.ts
import { API_BASE_URL, API_ROUTES } from '../config';

export interface FilterOptions {
  search?: string;
  ids?: string[];
  company_ids?: string[];
  department_ids?: string[];
  position_ids?: string[];
  limit?: number;
  status?: string;
}

// Cache to prevent duplicate API calls
const apiCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const generateCacheKey = (endpoint: string, filters: FilterOptions): string => {
  return `${endpoint}:${JSON.stringify(filters)}`;
};

// Helper function to get auth token
const getAuthToken = (): string => {
  if (typeof window === 'undefined') return '';
  
  try {
    const user = localStorage.getItem('hrms_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData?.token || userData?.access_token || '';
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  
  return '';
};

// Enhanced API functions with caching and better error handling
export const filterApi = {
  // Get companies with filtering
  getCompanies: async (filters: FilterOptions = {}) => {
    const cacheKey = generateCacheKey('companies', filters);
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached companies data');
      return cached.data;
    }

    const { search, ids, limit } = filters;
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (ids && ids.length > 0) params.append('ids', ids.join(','));
    if (limit) params.append('limit', limit.toString());
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('🌐 Fetching companies from API...');
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.filteredCompanies}?${params}`, {
        headers
      });
      
      if (!response.ok) throw new Error(`Failed to fetch companies: ${response.status}`);
      const result = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Get departments with filtering
  getDepartments: async (filters: FilterOptions = {}) => {
    const cacheKey = generateCacheKey('departments', filters);
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached departments data');
      return cached.data;
    }

    const { search, company_ids, ids, limit } = filters;
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (company_ids && company_ids.length > 0) params.append('company_ids', company_ids.join(','));
    if (ids && ids.length > 0) params.append('ids', ids.join(','));
    if (limit) params.append('limit', limit.toString());
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('🌐 Fetching departments from API...');
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.filteredDepartments}?${params}`, {
        headers
      });
      
      if (!response.ok) throw new Error(`Failed to fetch departments: ${response.status}`);
      const result = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  // Get positions with filtering
  getPositions: async (filters: FilterOptions = {}) => {
    const cacheKey = generateCacheKey('positions', filters);
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached positions data');
      return cached.data;
    }

    const { search, department_ids, company_ids, ids, limit } = filters;
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (department_ids && department_ids.length > 0) params.append('department_ids', department_ids.join(','));
    if (company_ids && company_ids.length > 0) params.append('company_ids', company_ids.join(','));
    if (ids && ids.length > 0) params.append('ids', ids.join(','));
    if (limit) params.append('limit', limit.toString());
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('🌐 Fetching positions from API...');
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.filteredPositions}?${params}`, {
        headers
      });
      
      if (!response.ok) throw new Error(`Failed to fetch positions: ${response.status}`);
      const result = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  },

  // Get employees with filtering
  getEmployees: async (filters: FilterOptions = {}) => {
    const cacheKey = generateCacheKey('employees', filters);
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached employees data');
      return cached.data;
    }

    const { search, position_ids, department_ids, company_ids, ids, limit, status } = filters;
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (position_ids && position_ids.length > 0) params.append('position_ids', position_ids.join(','));
    if (department_ids && department_ids.length > 0) params.append('department_ids', department_ids.join(','));
    if (company_ids && company_ids.length > 0) params.append('company_ids', company_ids.join(','));
    if (ids && ids.length > 0) params.append('ids', ids.join(','));
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('🌐 Fetching employees from API...');
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.filteredEmployees}?${params}`, {
        headers
      });
      
      if (!response.ok) throw new Error(`Failed to fetch employees: ${response.status}`);
      const result = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Get all data in one request for efficient loading
  getAllFilterData: async (filters: FilterOptions = {}) => {
    const cacheKey = generateCacheKey('allData', filters);
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached all data');
      return cached.data;
    }

    const { company_ids, department_ids, position_ids } = filters;
    const params = new URLSearchParams();
    
    if (company_ids && company_ids.length > 0) params.append('company_ids', company_ids.join(','));
    if (department_ids && department_ids.length > 0) params.append('department_ids', department_ids.join(','));
    if (position_ids && position_ids.length > 0) params.append('position_ids', position_ids.join(','));
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('🌐 Fetching all data from API...');
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.allFilterData}?${params}`, {
        headers
      });
      
      if (!response.ok) throw new Error(`Failed to fetch all filter data: ${response.status}`);
      const result = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching all filter data:', error);
      throw error;
    }
  },

  // Clear cache manually if needed
  clearCache: () => {
    apiCache.clear();
    console.log('🧹 API cache cleared');
  }
};
