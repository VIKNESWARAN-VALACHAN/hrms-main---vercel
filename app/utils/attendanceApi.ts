// // import { QueryClient } from "@tanstack/react-query";
// // import { API_BASE_URL } from '@/app/config';
// // export const queryClient = new QueryClient();

// // async function handleResponse(response) {
// //     if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
// //         throw new Error(errorData.error || `Request failed with status ${response.status}`);
// //     }
// //     return response.json();
// // }

// // export async function fetchData(tab, filters, page, limit) {
// //     const params = new URLSearchParams({
// //         tab,
// //         page: page.toString(),
// //         limit: limit.toString(),
// //         ...filters
// //     });

// //     // Clean up empty filters
// //     Object.keys(filters).forEach(key => {
// //         if (!filters[key]) {
// //             params.delete(key);
// //         }
// //     });

// //     const response = await fetch(`${API_BASE_URL}/api/attendance/data?${params.toString()}`);
// //     return handleResponse(response);
// // }

// // export async function fetchFilterOptions() {
// //     const response = await fetch(`${API_BASE_URL}/api/attendance/filter-options`);
// //     const data = await handleResponse(response);
// //     return data.options;
// // }

// // // You can add other API functions here, e.g., for POST/PATCH requests
// // export async function updateAttendanceStatus(payload) {
// //     const response = await fetch(`${API_BASE_URL}/api/attendance/amendment`, {
// //         method: 'PATCH',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload),
// //     });
// //     return handleResponse(response);
// // }


// import { QueryClient } from '@tanstack/react-query';
// import { API_BASE_URL } from '@/app/config';

// export const queryClient = new QueryClient();

// // type JsonValue = string | number | boolean | null;
// // type Filters = Record<string, JsonValue | undefined>;
// // type AttendanceTab = 'overview' | 'overtime' | 'attendance' | 'amend' | 'appeal';

// type JsonValue = string | number | boolean | null;

// export type Filters = Record<string, JsonValue | undefined>;
// export type AttendanceTab = 'overview' | 'overtime' | 'attendance' | 'amend' | 'appeal';


// async function handleResponse<T = unknown>(response: Response): Promise<T> {
//   if (!response.ok) {
//     const errorData = (await response.json().catch(() => ({
//       error: 'Failed to parse error response',
//     }))) as { error?: string };

//     throw new Error(errorData.error || `Request failed with status ${response.status}`);
//   }

//   // In case any endpoint returns 204
//   if (response.status === 204) return undefined as T;

//   return (await response.json()) as T;
// }

// export async function fetchData<TData = unknown>(
//   tab: AttendanceTab,
//   filters: Filters,
//   page: number,
//   limit: number
// ): Promise<TData> {
//   const params = new URLSearchParams({
//     tab,
//     page: String(page),
//     limit: String(limit),
//   });

//   // Add filters safely (skip empty)
//   Object.keys(filters).forEach((key) => {
//     const val = filters[key];
//     if (val === undefined || val === null || val === '') return;
//     params.set(key, String(val));
//   });

//   const response = await fetch(`${API_BASE_URL}/api/attendance/data?${params.toString()}`);
//   return handleResponse<TData>(response);
// }

// export async function fetchFilterOptions<TOptions = Record<string, unknown>>(): Promise<TOptions> {
//   const response = await fetch(`${API_BASE_URL}/api/attendance/filter-options`);
//   const data = await handleResponse<{ options: TOptions }>(response);
//   return data.options;
// }

// export async function updateAttendanceStatus<TRes = unknown>(
//   payload: Record<string, unknown>
// ): Promise<TRes> {
//   const response = await fetch(`${API_BASE_URL}/api/attendance/amendment`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });

//   return handleResponse<TRes>(response);
// }



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
}

export interface PaginationParams {
  page?: number;
  limit?: number;
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
 * Fetch attendance records
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
      }
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
 * Fetch amend records
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
      }
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
 * Fetch appeal records
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
      }
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
 * Fetch overview statistics
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
      }
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
 * Fetch filter options
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
