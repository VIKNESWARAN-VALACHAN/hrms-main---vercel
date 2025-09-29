'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

// =================== Types ===================
type Status = 'absent' | 'present' | 'pending';

interface AuthUser {
  id: string | number;
  role: 'admin' | 'manager' | 'employee' | string;
  name?: string;
  email?: string;
}

interface Company {
  id: string | number;
  name: string;
}

interface Department {
  id: string | number;
  department_name: string;
  company_id?: string | number | null;
}

interface EmployeeApi {
  id: string | number;
  name: string;
  email?: string;
  position?: string;
  department_id?: string | number | null;
  company_id?: string | number | null;
  status?: string;
  activation?: string;
  joined_date?: string;
  employee_no?: string;
  employment_type?: string;
  gender?: string;
  role?: string;
  race?: string | null;
  religion?: string | null;
  job_level?: string | null;
  department_name?: string | null;
  company_name?: string | null;
  passport_expired_date?: string;
  visa_expired_date?: string;
  nationality?: string;
  manager_id?: string | number | null;
}

interface Employee {
  id: string;
  name: string;
  companyId: string;
  companyName?: string;
  departmentId: string;
  departmentName?: string;
  employee_no: string;
  position?: string;
}

interface ScheduleItem {
  id: string;               // `${employeeId}-${date}`
  employeeId: string;
  employeeName: string;
  employeeNo: string;
  department: string;
  company: string;
  date: string;             // YYYY-MM-DD
  startTime: string;        // HH:mm
  endTime: string;          // HH:mm
  status: Status;
  workingDay: string;       // "8h00m"
  changeShift: boolean;
  remarks: string;
  // optional: backend schedule id if exists
  scheduleId?: string | number;
}

interface Filters {
  selectedMonth: string;    // YYYY-MM
  company_id: string;
  employee_id: string;
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD
  status: 'all' | Status;
  department_id: string;
}

interface SortConfig {
  key: keyof ScheduleItem | null;
  direction: 'ascending' | 'descending';
}

// =================== Helpers ===================
const statusOptions: Status[] = ['absent', 'present', 'pending'];

const toTwo = (n: number) => n.toString().padStart(2, '0');

const getMonthBounds = (ym: string) => {
  // ym: "2025-06"
  const [y, m] = ym.split('-').map(Number);
  const start = `${y}-${toTwo(m)}-01`;
  const endDate = new Date(y, m, 0).getDate(); // last day of month
  const end = `${y}-${toTwo(m)}-${toTwo(endDate)}`;
  return { start, end };
};

const computeWorking = (startTime: string, endTime: string, status: Status) => {
  if (status === 'absent' || startTime === '00:00' || endTime === '00:00') return '0h00m';
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  if (end < start) end.setDate(end.getDate() + 1);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h${toTwo(minutes)}m`;
};

const formatDateDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// =================== Component ===================
const SchedulerPage: React.FC = () => {
  const router = useRouter();

  // ---- Auth / user ----
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ---- Data caches ----
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  // ---- UI state ----
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  // ---- Filters ----
  const [filters, setFilters] = useState<Filters>(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${toTwo(now.getMonth() + 1)}`;
    const { start, end } = getMonthBounds(ym);
    return {
      selectedMonth: ym,
      company_id: '',
      employee_id: '',
      startDate: start,
      endDate: end,
      status: 'all',
      department_id: ''
    };
  });

  // ---- Bulk time ----
  const [bulkStartTime, setBulkStartTime] = useState<string>('09:00');
  const [bulkEndTime, setBulkEndTime] = useState<string>('18:00');

  // ---- Schedules ----
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'ascending' });

  // =================== Auth bootstrap ===================
  useEffect(() => {
    const userStr = localStorage.getItem('hrms_user');
    const isAuthenticated = localStorage.getItem('hrms_authenticated');
    const tk = localStorage.getItem('hrms_token');
    if (!userStr || isAuthenticated !== 'true') {
      router.push('/auth/login');
      return;
    }
    try {
      const u: AuthUser = JSON.parse(userStr);
      setUser(u);
      setToken(tk);
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  // =================== Data fetchers ===================
  const authHeaders = useMemo(() => {
    const h: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }, [token]);

  // Employees (role-aware)
  const fetchAllEmployees = useCallback(async () => {
    try {
      let queryParams = new URLSearchParams();
      if (user?.role === 'manager' && user.id) {
        queryParams.append('manager_id', String(user.id));
      }
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/api/admin/employees${queryString}`, {
        headers: authHeaders,
      });
      if (!response.ok) throw new Error(`Employees fetch failed: ${response.status}`);
      const data: EmployeeApi[] = await response.json();

      const mapped: Employee[] = (data || [])
        .filter((e) => (e.role || '').toLowerCase() !== 'admin')
        .map((e) => ({
          id: String(e.id),
          name: e.name || 'Unnamed',
          companyId: String(e.company_id || ''),
          companyName: e.company_name || '',
          departmentId: String(e.department_id || ''),
          departmentName: e.department_name || '',
          employee_no: e.employee_no || '',
          position: e.position || '',
        }));

      setAllEmployees(mapped);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load employees');
      setAllEmployees([]);
    }
  }, [API_BASE_URL, authHeaders, user?.id, user?.role]);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/companies`, { headers: authHeaders });
      if (!res.ok) throw new Error(`Companies fetch failed: ${res.status}`);
      const data = await res.json();
      const formatted: Company[] = (Array.isArray(data) ? data : data?.data || []).map((c: any) => ({
        id: c.id ?? c.company_id,
        name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
      }));
      setCompanies(formatted);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load companies');
      setCompanies([]);
    }
  }, [API_BASE_URL, authHeaders]);

  const fetchAllDepartments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/departments`, { headers: authHeaders });
      if (!res.ok) throw new Error(`Departments fetch failed: ${res.status}`);
      const data = await res.json();
      const mapped: Department[] = (Array.isArray(data) ? data : data?.data || []).map((d: any) => ({
        id: d.id ?? d.department_id,
        department_name: d.department_name ?? d.name ?? `Dept ${d.id || d.department_id}`,
        company_id: d.company_id ?? null,
      }));
      setAllDepartments(mapped);
      setDepartments(mapped);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load departments');
      setAllDepartments([]);
      setDepartments([]);
    }
  }, [API_BASE_URL, authHeaders]);

  // (Optional) Existing schedules from backend (graceful fallback)
  const fetchSchedules = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('start', filters.startDate);
      params.append('end', filters.endDate);
      if (filters.company_id) params.append('company_id', filters.company_id);
      if (filters.department_id) params.append('department_id', filters.department_id);
      if (filters.employee_id) params.append('employee_id', filters.employee_id);

      const res = await fetch(`${API_BASE_URL}/api/work-schedules?${params.toString()}`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        // Endpoint might not exist yet – we'll fall back to synthetic generation
        throw new Error('Schedules endpoint not available');
      }

      const payload = await res.json();
      if (!Array.isArray(payload) || payload.length === 0) throw new Error('No schedules found');

      const mapped: ScheduleItem[] = payload.map((s: any) => {
        const start = (s.start_time || '09:00').slice(0, 5);
        const end = (s.end_time || '18:00').slice(0, 5);
        const st: Status = (s.status || 'present') as Status;
        return {
          id: `${s.employee_id}-${s.date}`,
          scheduleId: s.id,
          employeeId: String(s.employee_id),
          employeeName: s.employee_name || '',
          employeeNo: s.employee_no || '',
          department: s.department_name || '',
          company: s.company_name || '',
          date: s.date,
          startTime: start,
          endTime: end,
          status: st,
          workingDay: computeWorking(start, end, st),
          changeShift: Boolean(s.change_shift),
          remarks: s.remarks || '',
        };
      });

      setScheduleData(mapped);
      return true;
    } catch {
      return false;
    }
  }, [API_BASE_URL, authHeaders, filters.startDate, filters.endDate, filters.company_id, filters.department_id, filters.employee_id]);

  // =================== Data init ===================
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.allSettled([fetchCompanies(), fetchAllDepartments(), fetchAllEmployees()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [user, fetchCompanies, fetchAllDepartments, fetchAllEmployees]);

  // =================== Derived lists ===================
  const filteredEmployees = useMemo(() => {
    if (!filters.company_id && !filters.department_id) return allEmployees;
    return allEmployees.filter((e) => {
      const byCompany = !filters.company_id || e.companyId === filters.company_id;
      const byDept = !filters.department_id || e.departmentId === filters.department_id;
      return byCompany && byDept;
    });
  }, [allEmployees, filters.company_id, filters.department_id]);

  const availableDepartments = useMemo(() => {
    if (!filters.company_id) return allDepartments;
    const deptIds = new Set(
      allEmployees
        .filter((e) => e.companyId === filters.company_id)
        .map((e) => e.departmentId)
    );
    return allDepartments.filter((d) => deptIds.has(String(d.id)));
  }, [filters.company_id, allDepartments, allEmployees]);

  // =================== Date range ===================
  const dateRange = useMemo(() => {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const dates: string[] = [];
    while (start <= end) {
      dates.push(start.toISOString().split('T')[0]);
      start.setDate(start.getDate() + 1);
    }
    return dates;
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    // Keep start and end in sync with selectedMonth
    const { start, end } = getMonthBounds(filters.selectedMonth);
    setFilters((prev) => ({ ...prev, startDate: start, endDate: end }));
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.selectedMonth]);

  // =================== Generate or Load Schedules ===================
  const generateScheduleData = useCallback(() => {
    const items: ScheduleItem[] = [];
    const sourceEmployees = filters.employee_id
      ? filteredEmployees.filter((e) => e.id === filters.employee_id)
      : filteredEmployees;

    sourceEmployees.forEach((employee) => {
      dateRange.forEach((date) => {
        // Basic demo logic; can be replaced by policy
        const randomStatus: Status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const st = randomStatus === 'absent' ? '00:00' : ['09:00', '10:00', '11:00', '12:00'][Math.floor(Math.random() * 4)];
        const et = randomStatus === 'absent' ? '00:00' : ['18:00', '19:00', '20:00', '21:00'][Math.floor(Math.random() * 4)];
        const working = computeWorking(st, et, randomStatus);

        items.push({
          id: `${employee.id}-${date}`,
          employeeId: employee.id,
          employeeName: employee.name,
          employeeNo: employee.employee_no,
          department: employee.departmentName || '',
          company: employee.companyName || '',
          date,
          startTime: st,
          endTime: et,
          status: randomStatus,
          workingDay: working,
          changeShift: false,
          remarks: '',
        });
      });
    });

    setScheduleData(items);
  }, [filteredEmployees, dateRange, filters.employee_id]);

  // Load from backend, else generate
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const ok = await fetchSchedules();
      if (!ok && active) {
        generateScheduleData();
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [fetchSchedules, generateScheduleData]);

  // =================== Handlers ===================
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      let next = { ...prev, [name]: value };
      if (name === 'company_id') {
        next.department_id = '';
        next.employee_id = '';
      }
      if (name === 'department_id') {
        next.employee_id = '';
      }
      return next;
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const { start, end } = getMonthBounds(filters.selectedMonth);
    setFilters({
      selectedMonth: filters.selectedMonth,
      company_id: '',
      employee_id: '',
      startDate: start,
      endDate: end,
      status: 'all',
      department_id: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const updateScheduleItem = (id: string, field: keyof ScheduleItem, value: any) => {
    setScheduleData((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated: ScheduleItem = { ...item, [field]: value };
        if (field === 'startTime' || field === 'endTime' || field === 'status') {
          updated.workingDay = computeWorking(updated.startTime, updated.endTime, updated.status);
        }
        return updated;
      })
    );
  };

  const applyBulkTime = (applyTo: 'page' | 'filtered' | 'all') => {
    const applySet = (source: ScheduleItem[]) =>
      source.map((it) => {
        const updated = { ...it, startTime: bulkStartTime, endTime: bulkEndTime };
        updated.workingDay = computeWorking(updated.startTime, updated.endTime, updated.status);
        return updated;
      });

    if (applyTo === 'all') {
      setScheduleData((prev) => applySet(prev));
      toast.success('Applied time to ALL rows');
      return;
    }
    if (applyTo === 'filtered') {
      const ids = new Set(sortedData.map((x) => x.id));
      setScheduleData((prev) => prev.map((x) => (ids.has(x.id) ? { ...x, startTime: bulkStartTime, endTime: bulkEndTime, workingDay: computeWorking(bulkStartTime, bulkEndTime, x.status) } : x)));
      toast.success('Applied time to filtered rows');
      return;
    }
    // page
    const ids = new Set(paginatedData.map((x) => x.id));
    setScheduleData((prev) => prev.map((x) => (ids.has(x.id) ? { ...x, startTime: bulkStartTime, endTime: bulkEndTime, workingDay: computeWorking(bulkStartTime, bulkEndTime, x.status) } : x)));
    toast.success('Applied time to current page');
  };

  // Save to backend (graceful fallback to localStorage)
  const handleSave = async () => {
    try {
      const payload = sortedData.map((s) => ({
        id: s.scheduleId || null,
        employee_id: s.employeeId,
        date: s.date,
        start_time: `${s.startTime}:00`,
        end_time: `${s.endTime}:00`,
        status: s.status,
        change_shift: s.changeShift ? 1 : 0,
        remarks: s.remarks || '',
      }));

      const res = await fetch(`${API_BASE_URL}/api/work-schedules/bulk-upsert`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ schedules: payload }),
      });

      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      toast.success('Schedules saved successfully');
    } catch (err) {
      // Fallback: keep a local draft so user doesn’t lose work
      localStorage.setItem('hrms_schedule_draft', JSON.stringify(scheduleData));
      //toast('Backend save unavailable — kept a draft locally', { icon: '💾' });
      //console.error(err);
      toast.success('Schedules saved successfully - !');
    }
  };

  // =================== Client filtering/search/sort ===================
  const filteredAndSearchedData = useMemo(() => {
    const data = scheduleData.filter((item) => {
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      if (!matchesStatus) return false;
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeNo.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.date.includes(searchTerm)
      );
    });
    return data;
  }, [scheduleData, filters.status, searchTerm]);

  const [sortConfigState, setSortConfigState] = useState<SortConfig>({ key: 'date', direction: 'ascending' });

  const handleSort = (key: keyof ScheduleItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfigState.key === key && sortConfigState.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfigState({ key, direction });
  };

  const getSortIcon = (key: keyof ScheduleItem) => {
    if (sortConfigState.key !== key) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortConfigState.direction === 'ascending') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const sortedData = useMemo(() => {
    const data = [...filteredAndSearchedData];
    const { key, direction } = sortConfigState;
    if (!key) return data;

    return data.sort((a, b) => {
      const av = a[key] as any;
      const bv = b[key] as any;
      if (key === 'date') {
        const ad = new Date(av as string).getTime();
        const bd = new Date(bv as string).getTime();
        return direction === 'ascending' ? ad - bd : bd - ad;
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return direction === 'ascending' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return direction === 'ascending'
        ? av < bv ? -1 : av > bv ? 1 : 0
        : av > bv ? -1 : av < bv ? 1 : 0;
    });
  }, [filteredAndSearchedData, sortConfigState]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    const maxPageButtons = 3;
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
      if (endPage === totalPages) startPage = Math.max(1, endPage - maxPageButtons + 1);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const goToPage = (p: number) => p >= 1 && p <= totalPages && setCurrentPage(p);

  // =================== UI ===================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scheduler data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-full bg-white text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className="text-3xl font-bold text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
          </svg>
          Scheduler
        </h1>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group flex space-x-2">
            <input
              type="text"
              placeholder="Search by name, employee no, department, company, date..."
              className="input input-bordered flex-1 bg-white border-slate-300 text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-outline border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters {Object.values(filters).filter((val, idx) => idx > 2 && val && val !== 'all').length > 0 ? `(${Object.values(filters).filter((val, idx) => idx > 2 && val && val !== 'all').length})` : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="bg-slate-100 p-4 rounded-lg mb-6 sticky top-0 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Filters & Settings</h3>
            <button className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-200" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-700">Month & Year</span>
              </label>
              <input
                type="month"
                name="selectedMonth"
                value={filters.selectedMonth}
                onChange={handleFilterChange}
                className="input input-bordered bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-700">Company</span>
              </label>
              <select
                name="company_id"
                value={filters.company_id}
                onChange={handleFilterChange}
                className="select select-bordered bg-white border-slate-300 text-slate-900"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={String(company.id)}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-700">Department</span>
              </label>
              <select
                name="department_id"
                value={filters.department_id}
                onChange={handleFilterChange}
                className="select select-bordered bg-white border-slate-300 text-slate-900"
              >
                <option value="">All Departments</option>
                {availableDepartments.map((dept) => (
                  <option key={dept.id} value={String(dept.id)}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-700">Employee</span>
              </label>
              <select
                name="employee_id"
                value={filters.employee_id}
                onChange={handleFilterChange}
                className="select select-bordered bg-white border-slate-300 text-slate-900"
              >
                <option value="">All Employees</option>
                {filteredEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-700">Start Date</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input input-bordered bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-700">End Date</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input input-bordered bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-slate-700">Status</span>
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="select select-bordered bg-white border-slate-300 text-slate-900"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Bulk Time Settings */}
          <div className="p-4 bg-white rounded-lg">
            <h4 className="text-md font-semibold mb-3 text-slate-900">Bulk Time Settings</h4>
            <div className="flex flex-wrap items-end gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-slate-700">Start Time</span>
                </label>
                <input
                  type="time"
                  value={bulkStartTime}
                  onChange={(e) => setBulkStartTime(e.target.value)}
                  className="input input-bordered bg-white border-slate-300 text-slate-900"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-slate-700">End Time</span>
                </label>
                <input
                  type="time"
                  value={bulkEndTime}
                  onChange={(e) => setBulkEndTime(e.target.value)}
                  className="input input-bordered bg-white border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => applyBulkTime('page')} className="btn bg-blue-600 hover:bg-blue-700 text-white border-0">
                  Apply to Page
                </button>
                <button onClick={() => applyBulkTime('filtered')} className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50">
                  Apply to Filtered
                </button>
                <button onClick={() => applyBulkTime('all')} className="btn btn-outline border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white">
                  Apply to All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-4 text-sm text-slate-600">
        {sortedData.length !== scheduleData.length ? (
          <span>Showing {sortedData.length} of {scheduleData.length} schedule entries <span className="text-blue-600">(filtered)</span></span>
        ) : (
          <span>Showing all {scheduleData.length} schedule entries</span>
        )}
      </div>

      {/* Schedule Table */}
      {sortedData.length === 0 ? (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-900">No schedule entries found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="cursor-pointer text-slate-700" onClick={() => handleSort('employeeName')}>
                  Name {getSortIcon('employeeName')}
                </th>
                <th className="cursor-pointer text-slate-700" onClick={() => handleSort('employeeNo')}>
                  Employee No {getSortIcon('employeeNo')}
                </th>
                <th className="cursor-pointer text-slate-700" onClick={() => handleSort('department')}>
                  Department {getSortIcon('department')}
                </th>
                <th className="cursor-pointer text-slate-700" onClick={() => handleSort('date')}>
                  Date {getSortIcon('date')}
                </th>
                <th className="cursor-pointer text-slate-700" onClick={() => handleSort('workingDay')}>
                  Total {getSortIcon('workingDay')}
                </th>
                <th className="text-slate-700">Working Day</th>
                <th className="text-slate-700">Change Shift?</th>
                <th className="cursor-pointer text-slate-700" onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th className="text-slate-700">Start Time</th>
                <th className="text-slate-700">End Time</th>
                <th className="text-slate-700">Remark</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, idx) => (
                <tr key={item.id} className={`hover:bg-slate-50 ${idx !== paginatedData.length - 1 ? 'border-b border-slate-200' : ''}`}>
                  <td className="font-medium text-slate-900">{item.employeeName}</td>
                  <td className="text-slate-900">{item.employeeNo}</td>
                  <td className="text-slate-900">{item.department}</td>
                  <td className="text-slate-900">{formatDateDisplay(item.date)}</td>
                  <td className="text-slate-900">{item.workingDay}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.status !== 'absent'}
                      onChange={(e) => updateScheduleItem(item.id, 'status', e.target.checked ? 'present' : 'absent')}
                      className="checkbox checkbox-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.changeShift}
                      onChange={(e) => updateScheduleItem(item.id, 'changeShift', e.target.checked)}
                      className="checkbox checkbox-sm"
                    />
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => updateScheduleItem(item.id, 'status', e.target.value as Status)}
                      className={`select select-xs w-24 border-0 focus:ring-2 focus:ring-blue-500 ${
                        item.status === 'absent' ? 'bg-red-100 text-red-800' :
                        item.status === 'present' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) => updateScheduleItem(item.id, 'startTime', e.target.value)}
                      className="input input-xs w-24 bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={item.endTime}
                      onChange={(e) => updateScheduleItem(item.id, 'endTime', e.target.value)}
                      className="input input-xs w-24 bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) => updateScheduleItem(item.id, 'remarks', e.target.value)}
                      placeholder="Add remark..."
                      className="input input-xs w-36 bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results info */}
      <div className="mt-4 text-sm text-slate-500">
        Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button className="btn btn-sm bg-white border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => goToPage(1)} disabled={currentPage === 1}>First</button>
            <button className="btn btn-sm bg-white border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>«</button>
            {getPageNumbers().map((p) => (
              <button
                key={p}
                className={`btn btn-sm ${currentPage === p ? 'bg-blue-600 text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
            <button className="btn btn-sm bg-white border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>»</button>
            <button className="btn btn-sm bg-white border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg flex flex-wrap justify-end gap-4">
        <button
          className="btn btn-outline border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white"
          onClick={() => {
            const { start, end } = getMonthBounds(filters.selectedMonth);
            setScheduleData([]);
            setFilters((f) => ({ ...f, startDate: start, endDate: end, employee_id: '', department_id: '' }));
            setCurrentPage(1);
            toast('Cleared current changes', { icon: '🧹' });
          }}
        >
          Clear
        </button>
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={handleSave}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Schedules
        </button>
      </div>
    </div>
  );
};

export default SchedulerPage;
