const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export interface Employee {
  id: number;
  name: string;
  employee_no: string;
  department: string;
  position: string;
  salary: number;
  currency: string;
  email?: string;
  status?: string;
}

export interface Increment {
  id: number;
  employee_id: number;
  increment_type: string;
  increment_value: number;
  previous_salary: number;
  new_salary: number;
  increment_date: string;
  effective_date: string;
  reason: string;
  created_at: string;
  updated_at: string;
  employee_name?: string;
}

export interface IncrementStats {
  total_increments: number;
  recent_increments: number;
  total_budget_impact: number;
  increment_types: Array<{ increment_type: string; count: number }>;
  average_increments: Array<{ type: string; avg_value: number }>;
}

export interface CreateIncrementData {
  increment_type: string;
  increment_value: number;
  increment_date: string;
  effective_date: string;
  reason?: string;
  new_position_id?: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }
      throw new ApiError(response.status, errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const employeeApi = {
  // Get all employees with optional filtering
  async getEmployees(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    department?: string;
    status?: string;
  }): Promise<{
    employees: Employee[];
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/api/employees${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<{
      employees: Employee[];
      total: number;
      pages: number;
      current_page: number;
      per_page: number;
    }>(endpoint);
  },

  // Get a specific employee by ID
  async getEmployee(id: number): Promise<Employee> {
    return apiRequest<Employee>(`/api/employees/${id}`);
  },

  // Create a new employee
  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    return apiRequest<Employee>('/api/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  },

  // Update an existing employee
  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee> {
    return apiRequest<Employee>(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  },

  // Delete an employee
  async deleteEmployee(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/admin/employees/${id}`, {
      method: 'DELETE',
    });
  },

  // Get all increments for a specific employee
  async getEmployeeIncrements(employeeId: number): Promise<{
    employee: Employee;
    increments: Increment[];
  }> {
    return apiRequest<{
      employee: Employee;
      increments: Increment[];
    }>(`/api/admin/employees/${employeeId}/increments`);
  },

  // Create a new increment for an employee
  async createEmployeeIncrement(employeeId: number, incrementData: CreateIncrementData): Promise<{
    message: string;
    increment: Increment;
    updated_employee: { id: number; salary: number };
  }> {
    return apiRequest<{
      message: string;
      increment: Increment;
      updated_employee: { id: number; salary: number };
    }>(`/api/admin/employees/${employeeId}/increments`, {
      method: 'POST',
      body: JSON.stringify(incrementData),
    });
  },
};

export const incrementApi = {
  // Get all increments with optional filtering
  async getAllIncrements(params?: {
    employee_id?: number;
    increment_type?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    increments: Increment[];
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/api/increments${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<{
      increments: Increment[];
      total: number;
      pages: number;
      current_page: number;
      per_page: number;
    }>(endpoint);
  },

  // Get a specific increment by ID
  async getIncrement(id: number): Promise<Increment> {
    return apiRequest<Increment>(`/api/increments/${id}`);
  },

  // Update an existing increment
  async updateIncrement(id: number, incrementData: Partial<Increment>): Promise<{
    message: string;
    increment: Increment;
  }> {
    return apiRequest<{
      message: string;
      increment: Increment;
    }>(`/api/increments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(incrementData),
    });
  },

  // Delete an increment
  async deleteIncrement(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/increments/${id}`, {
      method: 'DELETE',
    });
  },

  // Get increment statistics
  async getIncrementStats(): Promise<IncrementStats> {
    return apiRequest<IncrementStats>('/api/increments/stats');
  },
};

export { ApiError };

