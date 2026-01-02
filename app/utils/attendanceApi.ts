

import { QueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/app/config';

export type AttendanceTab = 'attendance' | 'amend' | 'appeal' | 'overview';

export interface Filters {
  company_id?: number | string;
  department_id?: number | string;
  employee_id?: number | string;
  status?: string;
  start_date?: string;
  end_date?: string;
  position?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export interface FilterOptions {
  companies?: Array<{ id: number; name: string }>;
  departments?: Array<{ id: number; department_name: string }>;
  employees?: Array<{ id: number; name: string; employee_no: string }>;
  statuses?: Array<{ id: number; name: string }>;
}


/**
 * Build query string from filters and pagination params
 */
function buildQueryString(filters: Filters, pagination: PaginationParams): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  if (pagination.page) {
    params.append('page', String(pagination.page));
  }
  if (pagination.limit) {
    params.append('limit', String(pagination.limit));
  }

  return params.toString();
}

/**
 * Fetch attendance records with pagination and filtering
 */
export async function fetchAttendanceRecords(
  filters: Filters = {},
  pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<ApiResponse<any>> {
  const queryString = buildQueryString(filters, pagination);
  const url = `${API_BASE_URL}/api/attendance/records?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      signal: pagination.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

/**
 * Fetch amend records with pagination and filtering
 */
export async function fetchAmendRecords(
  filters: Filters = {},
  pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<ApiResponse<any>> {
  const queryString = buildQueryString(filters, pagination);
  const url = `${API_BASE_URL}/api/attendance/amend?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      signal: pagination.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching amend records:', error);
    throw error;
  }
}

/**
 * Fetch appeal records with pagination and filtering
 */
export async function fetchAppealRecords(
  filters: Filters = {},
  pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<ApiResponse<any>> {
  const queryString = buildQueryString(filters, pagination);
  const url = `${API_BASE_URL}/api/attendance/appeal?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      signal: pagination.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching appeal records:', error);
    throw error;
  }
}

/**
 * Fetch overview statistics with pagination and filtering
 * Returns department-level attendance statistics
 */
export async function fetchOverviewStats(
  filters: Filters = {},
  pagination: PaginationParams = { page: 1, limit: 20 }
): Promise<ApiResponse<any>> {
  const queryString = buildQueryString(filters, pagination);
  const url = `${API_BASE_URL}/api/attendance/overview?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      signal: pagination.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching overview statistics:', error);
    throw error;
  }
}

/**
 * Fetch filter options for dropdowns and selects
 */
export async function fetchFilterOptions(
  type: string = 'all',
  companyId?: number | string
): Promise<FilterOptions> {
  const params = new URLSearchParams();
  params.append('type', type);
  if (companyId) {
    params.append('company_id', String(companyId));
  }

  const url = `${API_BASE_URL}/api/attendance/filter-options?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || {};
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
}

/**
 * Approve an amendment
 */
export async function approveAmend(
  amendId: number | string,
  comment?: string
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE_URL}/api/attendance/amend/${amendId}/approve`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      body: JSON.stringify({ comment })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving amendment:', error);
    throw error;
  }
}

/**
 * Reject an amendment
 */
export async function rejectAmend(
  amendId: number | string,
  comment?: string
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE_URL}/api/attendance/amend/${amendId}/reject`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      body: JSON.stringify({ comment })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error rejecting amendment:', error);
    throw error;
  }
}

/**
 * Approve an appeal
 */
export async function approveAppeal(
  appealId: number | string,
  comment?: string
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE_URL}/api/attendance/appeal/${appealId}/approve`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      body: JSON.stringify({ comment })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving appeal:', error);
    throw error;
  }
}

/**
 * Reject an appeal
 */
export async function rejectAppeal(
  appealId: number | string,
  comment?: string
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE_URL}/api/attendance/appeal/${appealId}/reject`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      },
      body: JSON.stringify({ comment })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error rejecting appeal:', error);
    throw error;
  }
}

/**
 * Get the appropriate fetch function based on tab
 */
export function getTabFetchFunction(tab: AttendanceTab) {
  switch (tab) {
    case 'attendance':
      return fetchAttendanceRecords;
    case 'amend':
      return fetchAmendRecords;
    case 'appeal':
      return fetchAppealRecords;
    case 'overview':
      return fetchOverviewStats;
    default:
      throw new Error(`Unknown tab: ${tab}`);
  }
}


