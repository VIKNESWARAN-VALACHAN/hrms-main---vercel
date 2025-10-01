'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { API_BASE_URL, API_ROUTES } from '../config';
import { format, parseISO, differenceInMilliseconds, differenceInHours, differenceInMinutes, addDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import React from 'react';
import { CiFaceFrown } from 'react-icons/ci';
import { id } from 'date-fns/locale';
import { useSearchParams,useRouter } from 'next/navigation';
import WorkingTimeCounter from '../components/WorkingTimeCounter';
import { useTheme } from '../components/ThemeProvider';
import ConfirmationModal from '../components/Modal';
//import { downloadAttendanceReport } from '../utils/exportAttendanceReport';
import { downloadAttendanceReport, type LeaveRow } from '../utils/exportAttendanceReport';

import { formatInTimeZone } from 'date-fns-tz';

const SG_TZ = 'Asia/Singapore';

// Always produce a YYYY-MM-DD key in Singapore time
const ymdSG = (d: Date | string) => {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return formatInTimeZone(dateObj, SG_TZ, 'yyyy-MM-dd');
};

// Singapore timezone
const timeZone = 'Asia/Singapore';

// Function to convert date to Singapore timezone
const toSingaporeTime = (date: Date): Date => {
  return toZonedTime(date, timeZone);
};



type EventType = 'holiday' | 'event';

type PublicHoliday = {
  id: number;
  holiday_date: string;         // YYYY-MM-DD
  title: string;
  description?: string | null;
  is_global: boolean | number;  // 0/1 or boolean
  company_ids?: number[];       // optional from API
  company_names?: string;       
  event_type?: EventType;
};

enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  PARTIAL = 'PARTIAL',
  OFFDAY = 'OFFDAY'
}

enum AppealStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}


interface AttendanceRecord {
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'partial' | 'offday';
  attendanceDayId: number;
  adminComment?: string;
  first_checkIn?: string;
  last_checkOut?: string;
  appealStatus?: string;
}

// Custom date range interface
interface DateRangeState {
  startDate: Date;
  endDate: Date;
  key: string;
}

// Today's attendance interface
interface TodayAttendance {
  isCheckedIn: boolean;
  checkInTime: Date | null;
  checkOutTime: Date | null;
}

// Attendance session interface for multiple sessions
interface AttendanceSession {
  id: string;
  checkIn: Date | null;
  checkOut: Date | null;
}

// Attendance statistics interfaces
interface EmployeeAttendance {
  id: number;
  first_name: string;
  last_name: string;
  present_days: number;
  total_days: number;
  attendance_rate: number;
  working_days: number;
}

interface MonthlyTrend {
  month: string;
  present_days: number;
  total_days: number;
  monthly_rate: number;
}

interface DepartmentComparison {
  department_name: string;
  present_days: number;
  total_days: number;
  dept_rate: number;
}

interface TodayStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  partial: number;
}

interface DailyAttendanceStats {
  date: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  rate: number;
}

interface AmendAttendanceData {
  id: string;
  employee_name: string;
  department_name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  company_name: string;
  _justAmended?: boolean;  // Track if this row was just amended
  attendance_day_id: number;
  employee_id: number;
  amend_date?: string;
  amend_by?: string;
}

// Add Appeal interface
interface AppealData {
  id: string;
  employee_name: string;
  department_name: string;
  employee_no: string;
  date: string;
  status: string;
  company_name: string;
  reason: string;
  appeal_date: string;
  attendance_date: string;
  appeal_status: 'pending' | 'approved' | 'rejected' | 'cancel';
  original_check_in?: Date;
  original_check_out?: Date;
  requested_check_in?: Date;
  requested_check_out?: Date;
  requested_status: 'present' | 'late' | 'absent' | 'offday' | 'partial';
  _justUpdated?: boolean;  // Track if this row was just updated
  admin_comment?: string;  // Admin's response to the appeal
  attendance_day_id: number;
}

interface AttendanceStats {
  overallAttendanceRate: number;
  topEmployees: EmployeeAttendance[];
  monthlyTrend: MonthlyTrend[];
  departmentComparison: DepartmentComparison[];
  today: TodayStats;
  dailyStats: DailyAttendanceStats[];
}

// Add a new interface for department statistics
interface DepartmentStat {
  department_id: number;
  department_name: string;
  total_employees: number;
  present_days: number;
  late_days: number;
  total_attendance: number;
  total_attendance_records: number;
  attendance_percentage: number;
}

interface DepartmentStatsData {
  departments: DepartmentStat[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

// Add this interface for appeal request form data
interface AppealRequestData {
  employeeId: number | null;
  attendanceDayId: number | null;
  date: string;
  originalCheckIn: string | null;
  originalCheckOut: string | null;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: string;
}

export default function AttendancePage() { 

  // Theme hook for light/dark mode support
  const { theme } = useTheme();
  
  // Add useSearchParams to get tab from URL
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  // Check-in state
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>({
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null
  });

  const [isExporting, setIsExporting] = useState(false);


  // Multiple sessions state (keeps track of all sessions for the day)
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);

  // Current time state for updating the working hours in real-time
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Attendance statistics state
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Attendance records state
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Add role state
  const [role, setRole] = useState<string>('');

  // Keep error state
  const [error, setError] = useState<string>('');

  // Add a state to store the employee ID
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  const [calendarDate, setCalendarDate] = useState<Date>(toZonedTime(new Date(), timeZone));

  // State for selected day in daily attendance stats
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Add tab state - initialize from URL parameter if available
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    return tabParam === 'attendance' ? 'attendance' : tabParam === 'appeal' ? 'appeal' : tabParam === 'amend' ? 'amend' : 'overview';
  });

  // Add state for amendment modal
  const [isAmendModalOpen, setIsAmendModalOpen] = useState(false);
  const [amendEmployee, setAmendEmployee] = useState<AmendAttendanceData>(
    {
      id: '',
      employee_name: '',
      company_name: '',
      department_name: '',
      date: '',
      checkIn: '',
      checkOut: '',
      status: '',
      attendance_day_id: 0,
      employee_id: 0,
      amend_date: '',
      amend_by: ''
    }
  );

  const [amendAttendanceData, setAmendAttendanceData] = useState<AmendAttendanceData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AmendAttendanceData[]>([]);

  // Add appeal data state
  const [appealData, setAppealData] = useState<AppealData[]>([]);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealData | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [applyFilters, setApplyFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<{ id: string; display_name: string }[]>([]);

  const [newStatus, setNewStatus] = useState<string>('');

  // Add new states for appeal confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [confirmReason, setConfirmReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [appealToAction, setAppealToAction] = useState<AppealData | null>(null);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed at 10 items per page

  // Add notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Employee appeal view state
  const [isEmployeeAppealViewModalOpen, setIsEmployeeAppealViewModalOpen] = useState(false);
  const [selectedEmployeeAppeal, setSelectedEmployeeAppeal] = useState<AppealData | null>(null);
  const [isEditingAppeal, setIsEditingAppeal] = useState(false);
  const [editedAppealData, setEditedAppealData] = useState<{
    requestedCheckIn: string;
    requestedCheckOut: string;
    reason: string;
  }>({
    requestedCheckIn: '',
    requestedCheckOut: '',
    reason: ''
  });

  // Bulk edit states for appeals
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedAppeals, setSelectedAppeals] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Confirmation modal states
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);
  const [pendingBulkAction, setPendingBulkAction] = useState<'approve' | 'reject' | null>(null);

  // Add these states to the existing useState declarations at the top of the component
  const [selectedCompany, setSelectedCompany] = useState<number>(0);
  const [departmentPage, setDepartmentPage] = useState<number>(1);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStatsData>({
    departments: [],
    pagination: { total: 0, per_page: 5, current_page: 1, total_pages: 1 }
  });

  const [departmentDate, setDepartmentDate] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: ''
  });

  // Add state for appeal request modal and form
  const [isAppealRequestModalOpen, setIsAppealRequestModalOpen] = useState(false);
  const [appealRequestData, setAppealRequestData] = useState<AppealRequestData>({
    employeeId: null,
    attendanceDayId: null,
    date: '',
    originalCheckIn: null,
    originalCheckOut: null,
    requestedCheckIn: '',
    requestedCheckOut: '',
    reason: '',
    status: ''
  });
  const [appealRequestErrors, setAppealRequestErrors] = useState({
    requestedCheckIn: '',
    requestedCheckOut: '',
    reason: ''
  });
  const [isAppealSubmitting, setIsAppealSubmitting] = useState(false);

  // Add state for attendance records pagination
  const [attendanceRecordsPage, setAttendanceRecordsPage] = useState<number>(1);
  const recordsPerPage = 10; // Number of attendance records per page

  // Add state to track active quick date filter
  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);
  const router = useRouter();
  
  // Add state for filter toggle (responsive filters)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Initialize employeeId from localStorage on component mount
  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== 'undefined') {
      try {
        const userString = localStorage.getItem('hrms_user');
        if (userString) {
          const userData = JSON.parse(userString);
          if (userData && userData.id) {
            setEmployeeId(userData.id);
          } else {
            console.error("User data or ID is missing");
          }
        } else {
          console.error("hrms_user not found in localStorage");
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
      }
    }

    // Also set role as before
    const role = localStorage.getItem('hrms_role');
    if (role) {
      setRole(role);
    }
  }, []);

  // Effect to handle tab changes from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'appeal') {
      setActiveTab('appeal');
    } else if (tabParam === 'amend') {
      setActiveTab('amend');
    } else if (tabParam === 'attendance') {
      setActiveTab('attendance');
    }
  }, [searchParams, activeTab]);

  // Update current time every second when checked in
  useEffect(() => {
    if (todayAttendance.isCheckedIn) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000); // update every second

      setTimerInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      // Clear interval when checked out
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  }, [todayAttendance.isCheckedIn]);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Update fetchTodayAttendance to use the state variable
  const fetchTodayAttendance = async () => {
    try {
      // Check if we have the employee ID before making the request
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      // Use the employee ID from state
      const url = `${API_BASE_URL}${API_ROUTES.todayAttendance}?employee_id=${employeeId}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch today attendance');

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("Unexpected response format:", data);
        setError("Unexpected response format from server");
        return;
      }

      if (data[0].length === 0) {
        // No attendance records today
        setSessions([]);
        setTodayAttendance({
          isCheckedIn: false,
          checkInTime: null,
          checkOutTime: null
        });
        return;
      }

      // Safely determine if checked in based on either data format
      const isCheckedIn = data.some((session: any) => {
        // New format (using attendance_days)
        if (session.hasOwnProperty('isCheckedIn')) {
          return session.isCheckedIn;
        }
        // Old format (using attendance table)
        return session.hasOwnProperty('clock_out') && !session.clock_out;
      });

      const attendanceDayRows = data[0].attendanceDayRows;


      // Map API data to our interface format, handling both data structures
      const formattedSessions = attendanceDayRows.map((session: any) => {
        // Handle ID safely
        const sessionId = session.id || session.attendance_day_id || Math.random().toString(36).substr(2, 9);

        // Handle check-in time
        let checkInTime = null;
        if (session.first_check_in_time) {
          checkInTime = new Date(session.first_check_in_time);  // New format
        } else if (session.clock_in) {
          checkInTime = new Date(session.clock_in);  // Old format
        }

        // Handle check-out time
        let checkOutTime = null;
        if (session.last_check_out_time) {
          checkOutTime = new Date(session.last_check_out_time);  // New format
        } else if (session.clock_out) {
          checkOutTime = new Date(session.clock_out);  // Old format
        }

        return {
          id: sessionId.toString(),
          checkIn: checkInTime ,
          checkOut: checkOutTime
        };
      });

      setSessions(formattedSessions.filter((session: AttendanceRecord) => session.checkIn !== null) as AttendanceSession[]);

      setSessions(formattedSessions.filter((session: AttendanceRecord) => session.checkIn !== null) as AttendanceSession[]);

      // Find the most recent check-in and check-out times
      const lastSession = formattedSessions.find((session: AttendanceRecord) => session.checkIn !== null) || null;

      setTodayAttendance({
        isCheckedIn,
        checkInTime: lastSession ? lastSession.checkIn : null,
        checkOutTime: lastSession?.checkOut || null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance');
      console.error('Error fetching today attendance:', err);
    }
  };

// --- helper to fetch client public IP and POST with header ---
// Robust public IP fetcher for the browser
// Usage: const ip = await getPublicIpClientSide(); // string | null
async function getPublicIpClientSide1(opts?: { timeoutMs?: number }): Promise<string | null> {
  const timeoutMs = opts?.timeoutMs ?? 3000;

  // Providers to try in order (all CORS-friendly for browsers)
  const providers: Array<{
    url: string;
    parse: (r: any) => string | null;
  }> = [
    {
      url: 'https://api.ipify.org?format=json',
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
    {
      url: 'https://ifconfig.co/json',
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
    {
      url: 'https://ipapi.co/json',
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
  ];

  const isValidIp = (ip: string) => {
    // Basic IPv4/IPv6 sanity (not exhaustive, but good enough for logging)
    const ipv4 =
      /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    const ipv6 =
      /^(([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|::1|::)$/; // simplified
    return ipv4.test(ip) || ipv6.test(ip);
  };

  const fetchWithTimeout = async (url: string): Promise<any | null> => {
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
      if (!res.ok) return null;
      const ct = res.headers.get('content-type') || '';
      // Some endpoints can return plain text; handle both JSON and text.
      if (ct.includes('application/json')) {
        return await res.json();
      } else {
        const txt = (await res.text()).trim();
        // Normalize to a JSON-like object for parsers that expect { ip: ... }
        return { ip: txt };
      }
    } catch (err: any) {
       console.warn('ERROR');
      return null;
    } finally {
      clearTimeout(tm);
    }
  };

  for (const p of providers) {
    const payload = await fetchWithTimeout(p.url);
    const ip = payload ? p.parse(payload) : null;
    if (ip && isValidIp(ip.trim())) {
      return ip.trim();
    } else if (ip) {
      // Got something but it didn't validate—log once and continue.
      console.warn('[public-ip] invalid format from provider:', p.url, ip);
    }
  }

  // All providers failed; log a single warning for diagnostics and return null.
  console.warn('[public-ip] unable to resolve public IP from all providers');
  return null;
}

async function getPublicIpClientSide(opts?: { timeoutMs?: number }): Promise<string | null> {
  const timeoutMs = opts?.timeoutMs ?? 3000;

  // Use CORS proxies for the providers
  const providers: Array<{
    url: string;
    parse: (r: any) => string | null;
  }> = [
    {
      url: 'https://corsproxy.io/?https://api.ipify.org?format=json',
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
    {
      url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.ipify.org?format=json'),
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
    {
      url: 'https://corsproxy.io/?https://ifconfig.co/json',
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
  ];

  const isValidIp = (ip: string) => {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    const ipv6 = /^(([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|::1|::)$/;
    return ipv4.test(ip) || ipv6.test(ip);
  };

  const fetchWithTimeout = async (url: string): Promise<any | null> => {
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { 
        signal: ctrl.signal, 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (!res.ok) return null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        return await res.json();
      } else {
        const txt = (await res.text()).trim();
        try {
          // Try to parse as JSON if it's JSON
          return JSON.parse(txt);
        } catch {
          // If not JSON, assume it's just the IP
          return { ip: txt };
        }
      }
    } catch (err: any) {
      console.warn('ERROR fetching IP from provider:', url, err.message);
      return null;
    } finally {
      clearTimeout(tm);
    }
  };

  for (const p of providers) {
    try {
      const payload = await fetchWithTimeout(p.url);
      const ip = payload ? p.parse(payload) : null;
      if (ip && isValidIp(ip.trim())) {
        return ip.trim();
      } else if (ip) {
        console.warn('[public-ip] invalid format from provider:', p.url, ip);
      }
    } catch (err) {
      console.warn('[public-ip] failed to fetch from provider:', p.url, err);
    }
  }

  console.warn('[public-ip] unable to resolve public IP from all providers');
  return null;
}

// useEffect(() => {
//   (async () => {
//     const ip = await getPublicIpClientSide({ timeoutMs: 3000 });
//     console.log('[public-ip] fetched:', ip);
//   })();
// }, []);


async function postAttendance(url: string, payload: any) {
   console.log('[public-ip] fetched:', 'TEST');
  const publicIp = await getPublicIpClientSide();
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(publicIp ? { 'x-client-public-ip': publicIp } : {})
    },
    body: JSON.stringify(payload)
  });
}
// --- end helper ---


  // Update handleAttendanceAction to use the state variable
  const handleAttendanceAction = async () => {
    try {
      // Check if we have the employee ID before making the request
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      const endpoint = todayAttendance.isCheckedIn ?
        API_ROUTES.checkOut :
        API_ROUTES.checkIn;

      // const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   // Include employee_id in request body
      //   body: JSON.stringify({ employee_id: employeeId })
      // });
      const response = await postAttendance(
        `${API_BASE_URL}${endpoint}`,
        { employee_id: employeeId }
      );


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Attendance action failed');
      }

      // Refresh data after successful action
      await fetchTodayAttendance();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Attendance action failed');
      console.error('Error with attendance action:', err);
    }
  };

  // Update applyAttendanceFilters to include company info in logs
  const applyAttendanceFilters = async (filter: Record<string, string>) => {
    const filtersQuery = filter || filters;
    // Get company name for logging if selected
    const selectedCompany = filtersQuery?.company ?
      companies.find(c => c.id === filtersQuery.company) : null;

    // Validate search term
    if (searchTerm && searchTerm.length === 1) {
      setError('Please enter at least 2 characters for search');
      return;
    }

    // Basic date validation
    if (filtersQuery.fromDate && filtersQuery.toDate) {
      const startDate = new Date(filtersQuery.fromDate);
      const endDate = new Date(filtersQuery.toDate);

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError('Please enter valid dates');
        return;
      }

      // Check if start date is after end date
      if (startDate > endDate) {
        setError('Start date cannot be after end date');
        return;
      }
    }

    // Clear any previous errors before fetching
    setError('');
    await fetchAttendanceFilterData(activeTab, filtersQuery);
    // Fetch appeal data if on appeal tab
    if (activeTab === 'appeal') {
      await fetchAppealData(filtersQuery);
    }
  };

  // Update the fetchAttendanceFilterData function to include company filter
  const fetchAttendanceFilterData = async (currentTab = activeTab, filters: Record<string, string> | any) => {
    if (role !== 'admin') {
      return;
    }


    try {

      // Build query parameters similar to employee page
      let queryParams = new URLSearchParams();

      // Add search field for employee name if at least 2 characters
      if (searchTerm && searchTerm.length >= 2) {
        queryParams.append('employee_name', searchTerm);
      }

      // Add company filter - ensure we're using the ID
      if (filters.company && filters.company !== '') {
        queryParams.append('company_id', filters.company);
        // Log the company name for better readability
        const companyName = companies.find(c => c.id === filters.company)?.name || filters.company;
      }

      // Add status filter if provided
      if (filters.status && filters.status !== '') {
        queryParams.append('status', filters.status);
        // Log the status for better readability
        const statusName = attendanceStatuses.find(s => s.id === filters.status)?.display_name || filters.status;
      }

      // Only add date filters - as requested
      if (filters.fromDate && filters.toDate) {
        queryParams.append('start_date', filters.fromDate);
        queryParams.append('end_date', filters.toDate);
      }

      if(filters.department && filters.department !== ''){
        queryParams.append('department_id', filters.department);
      }

      // Build URL with query parameters
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const url = `${API_BASE_URL}${API_ROUTES.attendanceData}${queryString}`;

      const response = await fetch(url);
      const data = await response.json();

      let amendedData = data.map((item: any) => ({
        id: item.employee_no,
        employee_name: item.employee_name,
        company_name: item.company_name,
        department_name: item.department,
        date: item.attendance_date,
        checkIn: item.check_in_time,
        checkOut: item.check_out_time,
        status: item.status.toLowerCase(),
        attendance_day_id: item.attendance_day_id,
        employee_id: item.employee_id,
        amend_date: item.amend_date,
        amend_by: item.amend_by
      }));

      if(currentTab === 'amend'){
        amendedData = amendedData.filter((item: any) => item.status.toLowerCase() === 'absent' || item.status.toLowerCase() === 'offday');
      }

      setAmendAttendanceData(amendedData);
    } catch (err) {
      console.error('Error fetching attendance filter data:', err);
    }
  };

  // Update the resetAttendanceFilters function to also reset company filter
  const resetAttendanceFilters = () => {
    // Reset filters
    setFilters(prev => ({
      ...prev,
      fromDate: '',
      toDate: '',
      company: '',
      status: '',
      department: ''
    }));
    // Clear search term
    setSearchTerm('');
    // Clear active quick date filter
    setActiveQuickDate(null);

    // Re-fetch data without filters
    fetchAttendanceFilterData(activeTab, filters);
    if (activeTab === 'appeal') {
      fetchAppealData(filters);
    }
    if (activeTab === 'amend') {
      fetchAttendanceFilterData(activeTab, filters);
    }
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Add handleFilterChange function for company filter
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    if (key === 'company') {
      setSelectedCompany(parseInt(value));
    }
  };

  const handleAmendment = async (amendEmployee: AmendAttendanceData, newStatus: string) => {
    try {
      const { attendance_day_id, employee_id, status } = amendEmployee;
      const statusId = newStatus.toLowerCase() === 'absent' ? 2 : newStatus.toLowerCase() === 'offday' ? 5 : 0;

      if (statusId === 0) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ROUTES.attendanceAmendment}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attendance_day_id: attendance_day_id,
          employee_id: employee_id,
          status_id: statusId,
          amended_by: employeeId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance status');
      }

      const data = await response.json();

      // Update the local state to reflect the change
      setAmendAttendanceData(prevData =>
        prevData.map(item =>
          item.attendance_day_id === amendEmployee.attendance_day_id
            ? { ...item, status: newStatus.toLowerCase(), amend_date: data.data.amend_date, amend_by: data.data.amend_by }
            : item
        )
      );

      setAmendEmployee({
        ...amendEmployee,
        status: newStatus.toLowerCase(),
        amend_date: data.amend_date,
        amend_by: data.amend_by
      }
      );

      setIsAmendModalOpen(false)
    } catch (err) {
      console.error('Error updating attendance status:', err);
      setIsAmendModalOpen(false)
    }
  };

  // Update fetchAttendanceStats to use the state variable
  const fetchAttendanceStats = async () => {
    try {
      setIsStatsLoading(true);

      // Check if we have the employee ID before making the request
      if (!employeeId && role !== 'admin') {
        console.error('Employee ID is not available for stats');
        // Continue with mock data as fallback
      } else {
        // Use the employee ID from state
        const url = `${API_BASE_URL}${API_ROUTES.attendanceStats}?${role === 'admin' ? 'isAdmin=true' : `employee_id=${employeeId}`}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch attendance statistics');
        }

        const data = await response.json();


        const topEmployees = data.top_performers.employees.map((employee: any) => (
          {
            id: employee.id,
            first_name: employee.name.split(' ')[0] || '',
            last_name: employee.name.split(' ')[1] || '',
            present_days: employee.days_present,
            total_days: 20,
            attendance_rate: employee.attendance_percentage,
            working_days: data.top_performers.working_days
          }));


        const dailyStatsData = data.daily_stats.map((day: any) => {
          return {
            date: format(day.date, 'yyyy-MM-dd'),
            total: day.total_employees,
            present: day.present,
            absent: day.absent,
            late: day.late,
            rate: day.present_rate.toFixed(2)
          };
        });

        setAttendanceStats({
          ...data,
          overallAttendanceRate: ((data.today.present_count + data.today.late_count) / data.today.total_employees) * 100,
          topEmployees: topEmployees,
          workingDays: data.top_performers.working_days,
          today: {
            present: data.today.present_count,//data.today.present_count,
            // Add other properties if needed
            total: data.today.total_employees,
            absent: data.today.absent_count,
            late: data.today.late_count,
            partial: data.today.partial_count
          },
          dailyStats: dailyStatsData
        });
      }
    } catch (err) {
      console.error('Error fetching attendance statistics:', err);
      // Fallback to mock data if API fails (keep existing fallback data)
      
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Update fetchAttendanceHistory to use the state variable
  const fetchAttendanceHistory = async (start?: Date, end?: Date) => {
    try {
      // Check if we have the employee ID before making the request
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      // Use the employee ID from state
      let url = `${API_BASE_URL}${API_ROUTES.attendanceHistory}?employee_id=${employeeId}`;

      if (start && end) {
        const startDate = format(toSingaporeTime(start!), 'yyyy-MM-dd');
        const endDate = format(toSingaporeTime(end!), 'yyyy-MM-dd');
        url += `&start_date=${startDate}&end_date=${endDate}`;
      }

      const response = await fetch(url);


      if (!response.ok) throw new Error('Failed to fetch attendance history');

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("Unexpected response format:", data);
        setError("Unexpected response format from server");
        return;
      }

      // Map API data to our interface format, handling both data formats
      const formattedRecords: AttendanceRecord[] = data.map((record: any) => {
        // Determine which date format to use
        let date: Date;
        let checkIn: Date | undefined;
        let checkOut: Date | undefined;
        let status: 'present' | 'absent' | 'late' | 'partial' | 'offday';

        // New format (using attendance_days)
        if (record.attendance_date || record.first_check_in_time) {
          date = new Date(record.attendance_date || record.first_check_in_time);
          checkIn = record.first_check_in_time ? new Date(record.first_check_in_time) : undefined;
          checkOut = record.last_check_out_time ? new Date(record.last_check_out_time) : undefined;

          // Determine status based on status_id or status_name if available
          if (record.status_name) {
            switch (record.status_name.toLowerCase()) {
              case 'present': status = 'present'; break;
              case 'absent': status = 'absent'; break;
              case 'late': status = 'late'; break;
              case 'offday': status = 'offday'; break;
              default: status = 'partial';
            }
          } else if (record.status_id) {
            switch (record.status_id) {
              case 1: status = 'present'; break;
              case 2: status = 'absent'; break;
              case 3: status = 'late'; break;
              case 4: status = 'partial'; break;
              case 5: status = 'offday'; break;
              default: status = 'partial';
            }
          } else {
            status = determineStatus(
              record.first_check_in_time,
              record.last_check_out_time
            );
          }
        }
        // Old format (using attendance table)
        else {
          const checkInDate = record.clock_in ? parseISO(record.clock_in) : new Date();
          const singaporeCheckInDate = toSingaporeTime(checkInDate) as Date;
          date = parseISO(format(singaporeCheckInDate, 'yyyy-MM-dd'));
          checkIn = record.clock_in ? parseISO(record.clock_in) : undefined;
          checkOut = record.clock_out ? parseISO(record.clock_out) : undefined;
          status = determineStatus(
            record.clock_in,
            record.clock_out
          );
        }

        return {
          date,
          checkIn,
          checkOut,
          status,
          attendanceDayId: record.attendance_day_id,
          first_checkIn: format(toSingaporeTime(new Date(record.first_check_in_day)), 'HH:mm a'),
          last_checkOut: format(toSingaporeTime(new Date(record.last_check_out_day)), 'HH:mm a'),
          appealStatus: record.appeal_status || ''
        };
      });

      setAttendanceRecords(formattedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance history');
      console.error('Error fetching attendance history:', err);
    }
  };

  // Helper to determine status based on check-in and check-out times
  const determineStatus = (checkInTime: string, checkOutTime: string | null): 'present' | 'absent' | 'late' | 'partial' => {
    if (!checkInTime) return 'absent';

    const checkIn = parseISO(checkInTime);
    const singaporeCheckIn = toSingaporeTime(checkIn) as Date;
    const workStartHour = 9; // Assuming work starts at 9 AM

    // Consider late if checked in after 9:15 AM
    const hours = parseInt(format(singaporeCheckIn, 'H'));
    const minutes = parseInt(format(singaporeCheckIn, 'mm'));
    const isLate = hours > workStartHour || (hours === workStartHour && minutes > 15);

    if (!checkOutTime) return 'partial';

    return isLate ? 'late' : 'present';
  };

  // Update initial data fetching to wait for employeeId
  useEffect(() => {
    // Only fetch data if employeeId is available
    if (employeeId) {
      fetchTodayAttendance();
      fetchAttendanceHistory();
      fetchAppealData(filters);
      if (role === 'admin' || role === 'manager') {
        fetchAttendanceStats();
        if (role === 'admin') {
          fetchCompanies(); // Fetch companies for dropdown
          fetchAttendanceStatuses(); // Fetch attendance statuses
          applyAttendanceFilters(filters); // Load initial attendance data
          // Load appeal data
        }
      }
    }
  }, [employeeId]); // Depend on employeeId to re-fetch when it's set

  // Format time to human readable format using date-fns
  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    const singaporeTime = toSingaporeTime(date);
    return format(singaporeTime as Date, 'hh:mm a');
  };

  // Helper function for status badge
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'present': return 'badge-success';
      case 'late': return 'badge-warning';
      case 'partial': return 'badge-info';
      case 'offday': return 'badge-neutral';
      default: return 'badge-error';
    }
  };

  // Helper function for appeal status badge
  const getAppealStatusDisplay = (appealStatus?: string) => {
    if (!appealStatus || appealStatus === '') {
      return {
        display: '-',
        className: 'text-gray-500',
        isBadge: false
      };
    }



    const status = appealStatus.toLowerCase();
    const displayText = appealStatus.charAt(0).toUpperCase() + appealStatus.slice(1).toLowerCase();
    
    let badgeClass = 'badge-warning'; // Default for pending
    if (status === 'approved') badgeClass = 'badge-success';
    if (status === 'rejected') badgeClass = 'badge-error';
    
    return {
      display: displayText,
      className: `badge ${badgeClass}`,
      isBadge: true
    };
  };


  

  // Pagination logic
  const getDataForCurrentView = () => {
    if (activeTab === 'amend') {
      return amendAttendanceData;
    } else if (activeTab === 'appeal') {
      return appealData;
    }else if (activeTab === 'attendance') {
      return amendAttendanceData;
    }
    return [];
  };

  const totalItems = getDataForCurrentView().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get current items based on active tab
  const currentAmendItems = amendAttendanceData.slice(indexOfFirstItem, indexOfLastItem);
  const currentAppealItems = appealData.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page navigation
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset currentPage when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);


  // Reset currentPage when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Function to get array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Handle cases where we have many pages by showing at most 3 page numbers
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons) {
      // If we have 3 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise show current page and neighbors
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Function to show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Function to open amendment modal
  const openAmendModal = (employee: { id: string, name: string, currentStatus: string, date: string, department: string, attendanceDayId: number, employeeId: number, companyName: string }) => {
    // Store the status in lowercase for consistency
    const currentStatusLower = employee.currentStatus.toLowerCase();

    // Find the attendance record to get company data
    const attendanceRecord = amendAttendanceData.find(item =>
      item.id === employee.id &&
      item.date === employee.date &&
      item.status.toLowerCase() === currentStatusLower
    );

    setAmendEmployee({
      ...employee,
      status: currentStatusLower, // Store lowercase version
      company_name: employee.companyName,
      employee_name: employee.name,
      department_name: employee.department,
      id: employee.id,
      checkIn: '--',
      checkOut: '--',
      attendance_day_id: employee.attendanceDayId,
      employee_id: employee.employeeId,
      amend_date: attendanceRecord?.amend_date || '',
      amend_by: attendanceRecord?.amend_by || ''
    });

    // Set the new status based on the current status (in lowercase)
    setNewStatus(currentStatusLower === 'absent' ? 'absent' : 'offday');
    setIsAmendModalOpen(true);
  };

  // Add fetchCompanies function to get company data from the database
  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/companies`);

      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.statusText}`);
      }

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

useEffect(() => {
  const fetchDepartments = async () => {
    if (!selectedCompany) return;
      
    try {
      const id = selectedCompany;
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.companies}/${id}/departments`);

      if (!response.ok) {
        throw new Error('Failed to fetch department attendance');
      }
      const data = await response.json();
      setDepartments(data.departments.map((item: any) => ({
        id: item.id,
        name: item.department_name
      })));
    }
    catch (error) {
      console.error('Error fetching department attendance:', error);
    }
  };
  fetchDepartments();
}, [selectedCompany]);

  // Add fetchAttendanceStatuses function
  const fetchAttendanceStatuses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/statuses`);

      if (!response.ok) {
        // If endpoint doesn't exist yet, use default statuses
        console.warn("Could not fetch attendance statuses, using defaults");
        setAttendanceStatuses([
          { id: "1", display_name: "Present" },
          { id: "2", display_name: "Absent" },
          { id: "3", display_name: "Late" },
          { id: "4", display_name: "Partial" },
          { id: "5", display_name: "Offday" }
        ]);
        return;
      }

      const data = await response.json();
      setAttendanceStatuses(data);
    } catch (error) {
      console.error('Error fetching attendance statuses:', error);
      // Fallback to defaults if API fails
      setAttendanceStatuses([
        { id: "1", display_name: "Present" },
        { id: "2", display_name: "Absent" },
        { id: "3", display_name: "Late" },
        { id: "4", display_name: "Partial" },
        { id: "5", display_name: "Offday" }
      ]);
    }
  };

  // Add this function to fetch department attendance data by company
  const fetchDepartmentAttendance = async (companyId = 0, page = 1,startDate = '',endDate = '') => {

    try {
      let url = `${API_BASE_URL}${API_ROUTES.departmentAttendance}?page=${page}`;

      // Add company filter if not 'all'
      if (companyId !== 0) {
        url += `&company_id=${companyId}`;
      }

      if(startDate !== '' && endDate !== ''){
        url += `&start_date=${startDate}&end_date=${endDate}`;
      }
      // Add date filters if available
      // if (filters.fromDate && filters.toDate) {
      //   url += `&start_date=${filters.fromDate}&end_date=${filters.toDate}`;
      // }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch department attendance statistics');
      }

      const data = await response.json();
      setDepartmentStats({
        departments: data.departments.map((item: any) => ({
          ...item,
          attendance_percentage: item.attendance_percentage.toFixed(2),
          total_attendance_records: item.total_potential_days,
          total_attendance: item.total_days_present,
        })),
        pagination: {
          total: data.pagination.total,
          per_page: data.pagination.per_page,
          current_page: data.pagination.current_page,
          total_pages: data.pagination.total_pages
        }
      })
    } catch (error) {
      console.error('Error fetching department statistics:', error);
    }
  };

  // Add useEffect to fetch department statistics when the component mounts or when company/page changes
  useEffect(() => {
    if ((role === 'admin' || role === 'manager') && companies.length > 0) {
      fetchDepartmentAttendance(selectedCompany, departmentPage,departmentDate.startDate,departmentDate.endDate);
    }
  }, [selectedCompany, departmentPage, role, companies.length]);

  // Add this function to handle company change
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;

    setSelectedCompany(Number(companyId));
    setDepartmentPage(1); // Reset to first page when company changes
  };

  // Add this function to handle pagination
  const changeDepartmentPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= departmentStats.pagination.total_pages) {
      setDepartmentPage(newPage);
    }
  };

  // Add function to fetch appeal data
  const fetchAppealData = async (filter: Record<string, string>) => {

    const filtersQuery =  filter || filters;
    try {
      // Build query parameters similar to employee page
      let queryParams = new URLSearchParams();

      // Add search field for employee name if at least 2 characters
      if (searchTerm && searchTerm.length >= 2) {
        queryParams.append('employee_name', searchTerm);
     }

      // Add company filter - ensure we're using the ID
      if (filtersQuery.company && filtersQuery.company !== '') {
        queryParams.append('company_id', filtersQuery.company);
        // Log the company name for better readability
        const companyName = companies.find(c => c.id === filtersQuery.company)?.name || filtersQuery.company;
      }

      // Add status filter if provided
      if (filtersQuery.status && filtersQuery.status !== '') {
        queryParams.append('status', filtersQuery.status);
        // Log the status for better readability
        const statusName = attendanceStatuses.find(s => s.id === filtersQuery.status)?.display_name || filtersQuery.status;
     }

      // Only add date filters - as requested
      if (filtersQuery.fromDate && filtersQuery.toDate) {
        queryParams.append('start_date', filtersQuery.fromDate);
        queryParams.append('end_date', filtersQuery.toDate);
      }

      // Build URL with query parameters
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const url = `${API_BASE_URL}/api/attendance/appeal${queryString}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setAppealData(data.map((item: any) => ({
          ...item,
          date: item.submitted_date,
          attendance_date: item.attendance_date,
          appeal_date: item.requested_check_in,
          requested_status: item.requested_status,
          status: item.attendance_status,
          original_check_in: item.attendance_check_in,
          original_check_out: item.attendance_check_out,
          requested_check_in: item.requested_check_in,
          requested_check_out: item.requested_check_out,
          appeal_status: item.appeal_status,
          reason: item.appeal_reason,
          attendance_id: item.attendance_id,
          admin_comment: item.admin_comment
        })));

      } else {
        console.error('Error fetching appeal data:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching appeal data:', err);
    }
  };

  // Add function to handle appeal actions
  const handleAppealAction = (appeal: AppealData, action: 'approve' | 'reject') => {
    // Show confirmation modal instead of immediately executing the action
    setAppealToAction(appeal);
    setConfirmAction(action);
    setConfirmReason('');
    setReasonError('');
    setShowConfirmModal(true);
  };

  // New function to execute appeal action after confirmation
  const executeAppealAction = async () => {
    // Don't proceed if no appeal is selected
    if (!appealToAction || !confirmAction) return;

    // Validate reason for rejection
    if (confirmAction === 'reject' && !confirmReason.trim()) {
      setReasonError('Reason is required for rejection');
      return;
    }

    try {
      
      // Get the admin user ID from localStorage
      const userString = localStorage.getItem('hrms_user');
      const adminId = userString ? JSON.parse(userString).id : null;

      if (!adminId) {
        throw new Error('Admin ID not found. Please refresh the page or log in again.');
      }

      // Make API call to update appeal
      const response = await fetch(`${API_BASE_URL}/api/attendance/appeal`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appeal_id: appealToAction.id,
          status: confirmAction === 'approve' ? 'APPROVED' : 'REJECTED',
          admin_comment: confirmReason,
          admin_employee_id: adminId,
          original_check_in: appealToAction.original_check_in,
          original_check_out: appealToAction.original_check_out,
          original_status: appealToAction.status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appeal');
      }

      const data = await response.json();


      // Update the local state to reflect the change
      setAppealData(prevData =>
        prevData.map(item => {
          if (item.id === appealToAction.id && item.date === appealToAction.date) {
            return {
              ...item,
              appeal_status: confirmAction === 'approve' ? 'approved' : 'rejected',
              _justUpdated: true
            };
          }
          return item;
        })
      );

      // Close the modals
      setShowConfirmModal(false);
      setIsAppealModalOpen(false);
      setSelectedAppeal(null);

      // Show success message
      showNotification(`Successfully ${confirmAction === 'approve' ? 'approved' : 'rejected'} appeal for ${appealToAction.employee_name}`);

      // Remove the highlight after a short delay
      setTimeout(() => {
        setAppealData(prevData =>
          prevData.map(item => {
            if (item.id === appealToAction.id && item.date === appealToAction.date) {
              return { ...item, _justUpdated: false };
            }
            return item;
          })
        );
      }, 3000);

    } catch (error) {
      console.error('Error updating appeal:', error);
      setError(error instanceof Error ? error.message : 'Failed to update appeal status');
    } finally {

    }
  };

  // Add function to open appeal detail modal
  const openAppealModal = (appeal: AppealData) => {
    setSelectedAppeal(appeal);
    setIsAppealModalOpen(true);
  };

  // Function to check if an appeal exists for a record
  const hasAppealForRecord = (record: AttendanceRecord): AppealData | null => {
    const recordDate = format(toSingaporeTime(record.date) as Date, 'yyyy-MM-dd');

    return appealData.find(appeal =>
      format(toSingaporeTime(new Date(appeal.attendance_date)) as Date, 'yyyy-MM-dd') === recordDate
      && appeal.attendance_day_id === record.attendanceDayId
    ) || null;
  };

  // Function to open employee appeal view modal
  const openEmployeeAppealViewModal = (appeal: AppealData) => {
    setIsEmployeeAppealViewModalOpen(true);

    setSelectedEmployeeAppeal({
      ...appeal,
      admin_comment: appeal.admin_comment || '',
      appeal_status: appeal.appeal_status.toLowerCase() as "pending" | "approved" | "rejected" | "cancel"
    });

    // Reset edit mode and populate edit data
    setIsEditingAppeal(false);
    setEditedAppealData({
      requestedCheckIn: appeal.requested_check_in ? format(toSingaporeTime(new Date(appeal.requested_check_in)), 'HH:mm') : '',
      requestedCheckOut: appeal.requested_check_out ? format(toSingaporeTime(new Date(appeal.requested_check_out)), 'HH:mm') : '',
      reason: appeal.reason || ''
    });
  };

  // Function to handle edit mode toggle
  const toggleEditMode = () => {
    if (selectedEmployeeAppeal) {
      if (!isEditingAppeal) {
        // Entering edit mode - ensure data is populated
        setEditedAppealData({
          requestedCheckIn: selectedEmployeeAppeal.requested_check_in ?
            format(new Date(selectedEmployeeAppeal.requested_check_in), 'HH:mm') : '',
          requestedCheckOut: selectedEmployeeAppeal.requested_check_out ?
            format(new Date(selectedEmployeeAppeal.requested_check_out), 'HH:mm') : '',
          reason: selectedEmployeeAppeal.reason || ''
        });
      }
      setIsEditingAppeal(!isEditingAppeal);
    }
  };

  // Function to handle edit field changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAppealData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to save appeal changes
  const saveAppealChanges = async () => {
    if (!selectedEmployeeAppeal) return;

    try {
      const appealDate = new Date(selectedEmployeeAppeal.attendance_date);
      const requestedCheckIn = editedAppealData.requestedCheckIn ?
        new Date(`${format(appealDate, 'yyyy-MM-dd')}T${editedAppealData.requestedCheckIn}`) : undefined;
      const requestedCheckOut = editedAppealData.requestedCheckOut ?
        new Date(`${format(appealDate, 'yyyy-MM-dd')}T${editedAppealData.requestedCheckOut}`) : undefined;

      const payload = {
        appeal_id: selectedEmployeeAppeal.id,
        request_check_in: requestedCheckIn,
        request_check_out: requestedCheckOut,
        appeal_reason: editedAppealData.reason
      };

      const response = await fetch(`${API_BASE_URL}/api/attendance/appeal/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to update appeal');
      }

      // Update the local state with edited values
      if (selectedEmployeeAppeal) {
        setSelectedEmployeeAppeal({
          ...selectedEmployeeAppeal,
          requested_check_in: requestedCheckIn as Date | undefined,
          requested_check_out: requestedCheckOut as Date | undefined,
          reason: editedAppealData.reason
        });
      }

      // Exit edit mode
      setIsEditingAppeal(false);

      // Show success notification
      showNotification('Appeal updated successfully', 'success');

      // Refresh appeal data
      await fetchAppealData(filters);
      await fetchAttendanceHistory();

    } catch (error) {
      console.error('Error updating appeal:', error);
      showNotification('Failed to update appeal', 'error');
    }
  };

  // Function to cancel an appeal
  const cancelAppeal = async () => {
    if (!selectedEmployeeAppeal) return;

    if (!confirm('Are you sure you want to cancel this appeal? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/appeal/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appeal_id: selectedEmployeeAppeal.id })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appeal');
      }

      // Close modal
      setIsEmployeeAppealViewModalOpen(false);

      // Show success notification
      showNotification('Appeal cancelled successfully', 'success');

      // Refresh appeal data
      await fetchAppealData(filters);

    } catch (error) {
      console.error('Error cancelling appeal:', error);
      showNotification('Failed to cancel appeal', 'error');
    }
  };

  // Add function to open appeal request modal
  const openAppealRequestModal = (record: AttendanceRecord) => {
    const date = format(toSingaporeTime(record.date) as Date, 'yyyy-MM-dd');

    // Format check-in/out times for form
    const originalCheckIn = record.checkIn
      ? format(toSingaporeTime(record.checkIn) as Date, 'HH:mm')
      : null;

    const originalCheckOut = record.checkOut
      ? format(toSingaporeTime(record.checkOut) as Date, 'HH:mm')
      : null;

    // Initialize form with current values
    setAppealRequestData({
      employeeId: employeeId,
      attendanceDayId: record.attendanceDayId,
      date: date,
      originalCheckIn: originalCheckIn,
      originalCheckOut: originalCheckOut,
      requestedCheckIn: originalCheckIn || '',
      requestedCheckOut: originalCheckOut || '',
      reason: '',
      status: record.status
    });

    // Reset errors
    setAppealRequestErrors({
      requestedCheckIn: '',
      requestedCheckOut: '',
      reason: ''
    });

    setIsAppealRequestModalOpen(true);
  };

  // Add function to handle form input changes
  const handleAppealInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update form data
    setAppealRequestData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (name in appealRequestErrors) {
      setAppealRequestErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Add function to validate form
  const validateAppealForm = (): boolean => {
    let isValid = true;
    const errors = {
      requestedCheckIn: '',
      requestedCheckOut: '',
      reason: ''
    };

    // Validate check-in time
    if (!appealRequestData.requestedCheckIn) {
      errors.requestedCheckIn = 'Check-in time is required';
      isValid = false;
    }

    // Validate check-out time
    if (!appealRequestData.requestedCheckOut) {
      errors.requestedCheckOut = 'Check-out time is required';
      isValid = false;
    } else if (
      appealRequestData.requestedCheckIn &&
      appealRequestData.requestedCheckOut &&
      appealRequestData.requestedCheckOut < appealRequestData.requestedCheckIn
    ) {
      errors.requestedCheckOut = 'Check-out time cannot be before check-in time';
      isValid = false;
    }

    // Validate reason
    if (!appealRequestData.reason.trim()) {
      errors.reason = 'Reason is required';
      isValid = false;
    } /*else if (appealRequestData.reason.length < 10) {
      errors.reason = 'Please provide a more detailed reason (at least 10 characters)';
      isValid = false;
    }*/

    setAppealRequestErrors(errors);
    return isValid;
  };

  // Add function to submit appeal request
  const submitAppealRequest = async () => {
    // Validate form
    if (!validateAppealForm()) {
      if (appealRequestErrors) {
        showNotification(appealRequestErrors.requestedCheckIn || appealRequestErrors.requestedCheckOut || appealRequestErrors.reason, 'error');
      }
      return;
    }

    try {
      setIsAppealSubmitting(true);


      const statusId = AttendanceStatus[appealRequestData.status as keyof typeof AttendanceStatus];
      // Prepare data for API
      const payload = {
        employee_id: appealRequestData.employeeId,
        attendance_day_id: appealRequestData.attendanceDayId,
        appeal_reason: appealRequestData.reason,
        status: statusId,
        request_check_in: toSingaporeTime(new Date(`${appealRequestData.date}T${appealRequestData.requestedCheckIn}`)),
        request_check_out: toSingaporeTime(new Date(`${appealRequestData.date}T${appealRequestData.requestedCheckOut}`)),
        original_check_in: toSingaporeTime(new Date(`${appealRequestData.date}T${appealRequestData.originalCheckIn}`)),
        original_check_out: toSingaporeTime(new Date(`${appealRequestData.date}T${appealRequestData.originalCheckOut}`))
      };


      // Make API call
      const response = await fetch(`${API_BASE_URL}/api/attendance/appeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit appeal request');
      }

      // Close modal and show success notification
      setIsAppealRequestModalOpen(false);
      showNotification('Appeal request submitted successfully!', 'success');
      
      // Refresh attendance records to show updated appeal status
      await fetchAttendanceHistory();

    } catch (error) {
      console.error('Error submitting appeal request:', error);
      showNotification('Failed to submit appeal request. Please try again.', 'error');
    } finally {
      setIsAppealSubmitting(false);
    }
  };

  // Bulk edit functions
  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedAppeals([]);
  };

  const handleSelectAllAppeals = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pendingAppeals = currentAppealItems
        .filter(appeal => appeal.appeal_status.toLowerCase() === 'pending')
        .map(appeal => appeal.id);
      setSelectedAppeals(pendingAppeals);
    } else {
      setSelectedAppeals([]);
    }
  };

  const handleSelectAppeal = (appealId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppeals(prev => [...prev, appealId]);
    } else {
      setSelectedAppeals(prev => prev.filter(id => id !== appealId));
    }
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedAppeals.length === 0) {
      showNotification('Please select at least one appeal', 'error');
      return;
    }

    setPendingBulkAction(action);
    setShowBulkConfirmModal(true);
  };

  const executeBulkAction = async () => {
    if (!pendingBulkAction) return;

    setBulkLoading(true);
    setShowBulkConfirmModal(false);

    try {
      // Get the admin user ID from localStorage
      const userString = localStorage.getItem('hrms_user');
      const adminId = userString ? JSON.parse(userString).id : null;

      if (!adminId) {
        throw new Error('Admin ID not found. Please refresh the page or log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/api/attendance/appeals/bulk`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appeal_ids: selectedAppeals,
          status: pendingBulkAction.toUpperCase() === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          admin_comment: `Bulk ${pendingBulkAction} by admin`,
          admin_employee_id: adminId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to bulk ${pendingBulkAction} appeals`);
      }

      const data = await response.json();

      // Update the local state to reflect the changes for successful updates
      const successfulAppealIds = data.results.successful_appeals.map((result: any) => result.appeal_id);
      setAppealData(prevData =>
        prevData.map(item => {
          if (successfulAppealIds.includes(item.id)) {
            return {
              ...item,
              appeal_status: pendingBulkAction === 'approve' ? 'approved' : 'rejected',
              _justUpdated: true
            };
          }
          return item;
        })
      );

      // Show success message
      const successMessage = `Successfully ${pendingBulkAction === 'approve' ? 'approved' : 'rejected'} ${data.results.processed} appeal(s)`;
      if (data.results.failed > 0) {
        showNotification(`${successMessage}. ${data.results.failed} appeals failed to process.`, 'info');
      } else {
        showNotification(successMessage, 'success');
      }

      // Clear selections and exit bulk mode
      setSelectedAppeals([]);
      setIsBulkMode(false);

      // Remove the highlight after a short delay
      setTimeout(() => {
        setAppealData(prevData =>
          prevData.map(item => {
            if (successfulAppealIds.includes(item.id)) {
              return { ...item, _justUpdated: false };
            }
            return item;
          })
        );
      }, 3000);

    } catch (error) {
      console.error(`Error during bulk ${pendingBulkAction}:`, error);
      setError(error instanceof Error ? error.message : `Failed to bulk ${pendingBulkAction} appeals`);
    } finally {
      setBulkLoading(false);
      setPendingBulkAction(null);
    }
  };

  const cancelBulkAction = () => {
    setShowBulkConfirmModal(false);
    setPendingBulkAction(null);
  };

  // Calculate pagination for attendance records
  const indexOfLastRecord = attendanceRecordsPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentAttendanceRecords = attendanceRecords.filter(record => {
    // Filter out today's records which are shown separately
    const singaporeToday = toSingaporeTime(new Date()) as Date;
    const singaporeRecordDate = toSingaporeTime(record.date) as Date;
    return format(singaporeRecordDate, 'yyyy-MM-dd') !== format(singaporeToday, 'yyyy-MM-dd');
  }).slice(indexOfFirstRecord, indexOfLastRecord);

  const totalRecords = attendanceRecords.filter(record => {
    const singaporeToday = toSingaporeTime(new Date()) as Date;
    const singaporeRecordDate = toSingaporeTime(record.date) as Date;
    return format(singaporeRecordDate, 'yyyy-MM-dd') !== format(singaporeToday, 'yyyy-MM-dd');
  }).length;
  const totalRecordPages = Math.ceil(totalRecords / recordsPerPage);

  // Function to handle attendance records page navigation
  const goToRecordsPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalRecordPages) {
      setAttendanceRecordsPage(pageNumber);
    }
  };

  // Function to get array of page numbers to display for records pagination
  const getRecordsPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;

    if (totalRecordPages <= maxPageButtons) {
      for (let i = 1; i <= totalRecordPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, attendanceRecordsPage - 1);
      let endPage = Math.min(startPage + maxPageButtons - 1, totalRecordPages);

      if (endPage === totalRecordPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  
// in your page/component
// build yyyy-MM-dd in LOCAL time (don’t use toISOString)

// helpers (local yyyy-MM-dd; don’t use toISOString)
const fmtLocal = (d: Date | string) => {
  const x = new Date(d);
  const y = x.getFullYear(), m = String(x.getMonth()+1).padStart(2,'0'), day = String(x.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};
function append(qs: URLSearchParams, k: string, v?: string | number | null) {
  if (v !== undefined && v !== null && v !== '' && v !== 'undefined' && v !== 'null') qs.append(k, String(v));
}

async function handleExportWithLeaves() {
  try {
    setIsExporting(true);
    const API = `${API_BASE_URL}/api/v1`;

    // date range
    const range = (() => {
      if (filters?.fromDate && filters?.toDate) {
        return { startDate: fmtLocal(filters.fromDate), endDate: fmtLocal(filters.toDate) };
      }
      const dates = (amendAttendanceData ?? []).map((r:any)=>r.date).filter(Boolean).sort();
      if (dates.length) return { startDate: dates[0], endDate: dates[dates.length - 1] };
      const n = new Date(), y = n.getFullYear(), m = n.getMonth();
      const last = new Date(y, m + 1, 0).getDate();
      return { startDate: `${y}-${String(m+1).padStart(2,'0')}-01`, endDate: `${y}-${String(m+1).padStart(2,'0')}-${last}` };
    })();

    // employee IDs from current table
    const empIds = Array.from(new Set(
      (amendAttendanceData||[]).map((r:any)=>r.employee_id).filter((x:any)=>Number.isFinite(x))
    ));

    const qs = new URLSearchParams();
    append(qs, 'startDate', range.startDate);
    append(qs, 'endDate',   range.endDate);
    if (empIds.length) append(qs, 'employeeIds', empIds.join(','));
    append(qs, 'departmentId', filters?.department);
    append(qs, 'companyId',    filters?.company);
    append(qs, 'status',       filters?.status);

    const url = `${API}/leaves/history/range?${qs.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }//credentials: 'include', // keep if cookie/session auth; otherwise remove
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const leaves: LeaveRow[] = await res.json();

    downloadAttendanceReport(amendAttendanceData, {
      includeLeaves: true,
      leaves,
      fileName: `Attendance_with_Leaves_${range.startDate}_${range.endDate}.xlsx`,
    });
  } catch (e) {
    console.error('Export with leaves failed:', e);
    downloadAttendanceReport(amendAttendanceData); // fallback
    showNotification('Failed to fetch leave data. Exported attendance only.', 'error');
  } finally {
    setIsExporting(false);
  }
}

async function handleExportWithLeavesok() {
  const API = `${API_BASE_URL}/api/v1`; 
  const range = (() => {
    if (filters?.startDate && filters?.endDate) {
      return { startDate: fmtLocal(filters.startDate), endDate: fmtLocal(filters.endDate) };
    }
    const dates = (amendAttendanceData ?? []).map((r:any)=>r.date).filter(Boolean).sort();
    if (dates.length) return { startDate: dates[0], endDate: dates[dates.length - 1] };
    const n = new Date(), y=n.getFullYear(), m=n.getMonth();
    const last = new Date(y, m+1, 0).getDate();
    return { startDate: `${y}-${String(m+1).padStart(2,'0')}-01`, endDate: `${y}-${String(m+1).padStart(2,'0')}-${last}` };
  })();

  const empIds = Array.from(new Set((amendAttendanceData||[]).map((r:any)=>r.employee_id).filter((x:any)=>Number.isFinite(x))));
  const qs = new URLSearchParams();
  append(qs, 'startDate', range.startDate);
  append(qs, 'endDate',   range.endDate);
  if (empIds.length) append(qs, 'employeeIds', empIds.join(','));
  append(qs, 'departmentId', filters?.departmentId);
  append(qs, 'companyId',    filters?.companyId);
  append(qs, 'status',       filters?.status);

  const url = `${API}/leaves/history/range?${qs.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      //credentials: 'include', // if cookie auth; otherwise remove and send Authorization header
      // headers: { Authorization: `Bearer ${token}` },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const leaves = await res.json();
    downloadAttendanceReport(amendAttendanceData, {
      includeLeaves: true,
      leaves,
      fileName: `Attendance_with_Leaves_${range.startDate}_${range.endDate}.xlsx`,
    });
  } catch (e) {
    console.error('Fetch error', e);
    downloadAttendanceReport(amendAttendanceData); // fallback
  }
}


  // Function to handle quick date selection
  const handleQuickDateSelect = (option: string, tab: string = '') => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (option) {
      case 'today':
        // Start and end are both today
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(new Date().setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        // Set to yesterday
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(today);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        // Start of current week (Sunday) to today
        const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastWeek':
        // Last week (Sunday to Saturday)
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        
        startDate = new Date(lastWeekEnd);
        startDate.setDate(lastWeekEnd.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = lastWeekEnd;
        break;
      case 'thisMonth':
        // Start of current month to today
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastMonth':
        // Last month (1st to last day)
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        setActiveQuickDate(null);
        return;
    }
    
    // Format dates for display and filter
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    
    // Update state with new date filters

    if(tab !== 'overview'){
      setFilters({
        ...filters,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
      });

      applyAttendanceFilters({
        ...filters,
        fromDate: formattedStartDate,
        toDate: formattedEndDate
      });
    }else{
      fetchDepartmentAttendance(selectedCompany, departmentPage,formattedStartDate,formattedEndDate);
      setDepartmentDate({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
    }
    
    // Set the active quick date filter
    setActiveQuickDate(option);
  };


  const handleActiveTabChange = (tab: string) => {
    router.push(`/attendance?tab=${tab}`);
    setActiveTab(tab);
    setActiveQuickDate(null);
    handleQuickDateSelect('');
    setFilters({
      ...filters,
      fromDate: '',
      toDate: '',
      department: '',
      company: ''
    });

    setSelectedCompany(0);
    
    // Close filters when switching tabs
    setIsFilterOpen(false);

    if(tab === 'amend'){
      fetchAttendanceFilterData(tab,filters); // Pass the new tab value directly
    }
    if(tab === 'attendance'){
      fetchAttendanceFilterData(tab,filters); // Pass the new tab value directly
    }
  };



const [holidaysByDate, setHolidaysByDate] = useState<Record<string, PublicHoliday[]>>({});

const latestFetchRef = useRef<AbortController | null>(null);
useEffect(() => () => { latestFetchRef.current?.abort(); }, []);

// 3) The function you asked for: fetchHolidaysForEmployeeMonth (FULL CODE)
const fetchHolidaysForEmployeeMonth = useCallback(
  async (year: number, month: number) => {
    try {
      // Require an employee to be known
      if (!employeeId) return;

      // Cancel any in-flight request
      latestFetchRef.current?.abort();
      const ctrl = new AbortController();
      latestFetchRef.current = ctrl;

      const qs = new URLSearchParams({
        year: String(year),
        month: String(month),
        employee_id: String(employeeId), // backend filters to global + this employee's companies
        include_global: '1',             // explicit (default true)
      });

      const res = await fetch(`${API_BASE_URL}/api/holiday/holidays?${qs.toString()}`, {
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: PublicHoliday[] = await res.json();

      // Build map keyed by SG date; dedupe by id within each day
      const map: Record<string, PublicHoliday[]> = {};
      for (const h of data || []) {
        const key = ymdSG(h.holiday_date);
        if (!key) continue;

        const bucket = (map[key] ||= []);
        if (!bucket.some(x => x.id === h.id)) {
          bucket.push({
            ...h,
            is_global: !!h.is_global,
            holiday_date: key,
            event_type: (h as any).event_type || 'holiday',
          } as PublicHoliday);
        }
      }

      setHolidaysByDate(map);
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        console.error('Failed to load holidays for calendar:', e);
      }
    } finally {
      latestFetchRef.current = null;
    }
  },
  [employeeId] // include whatever else you reference from closure
);


// Re-fetch whenever month changes or the employee's companies change
useEffect(() => {
  const y = calendarDate.getFullYear();
  const m = calendarDate.getMonth() + 1;
  fetchHolidaysForEmployeeMonth(y, m);
}, [calendarDate, fetchHolidaysForEmployeeMonth]);

// Helper: get holidays for a Date -> array
const getHolidaysForDate = (d: Date) => {
  const k = format(d, 'yyyy-MM-dd');
  return holidaysByDate[k] || [];
};

  
  return (
    <div className={`container mx-auto p-6 max-w-7xl ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
      {/* Error display */}
      {error && (
        <div className="alert alert-error mb-4 flex items-center p-4 bg-red-100 text-red-800 rounded">
          <svg xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24">
            <path strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="ml-2">{error}</span>
          <button
            className="ml-auto text-red-600 hover:text-red-800"
            onClick={() => setError('')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={`flex flex-wrap mb-6 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-slate-600'}`}>
        <button
          onClick={() => handleActiveTabChange('overview')}
          className={`py-3 px-4 sm:px-6 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'overview'
              ? theme === 'light' 
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-blue-400 text-blue-400'
              : theme === 'light'
                ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                : 'text-slate-400 hover:text-slate-300 hover:border-slate-500'
            }`}
        >
          Overview
        </button>
        {role === 'admin' && (
          <>
            <button
              onClick={() => handleActiveTabChange('attendance')}
              className={`py-3 px-4 sm:px-6 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'attendance'
                  ? theme === 'light' 
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-blue-400 text-blue-400'
                  : theme === 'light'
                    ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'text-slate-400 hover:text-slate-300 hover:border-slate-500'
                }`}
            >
              Attendance
            </button>
            <button
              onClick={() => handleActiveTabChange('amend')}
              className={`py-3 px-4 sm:px-6 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'amend'
                  ? theme === 'light' 
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-blue-400 text-blue-400'
                  : theme === 'light'
                    ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'text-slate-400 hover:text-slate-300 hover:border-slate-500'
                }`}
            >
              Amend
            </button>
            <button
              onClick={() => handleActiveTabChange('appeal')}
              className={`py-3 px-4 sm:px-6 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'appeal'
                  ? theme === 'light' 
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-blue-400 text-blue-400'
                  : theme === 'light'
                    ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'text-slate-400 hover:text-slate-300 hover:border-slate-500'
                }`}
            >
              Appeal
            </button>
          </>
        )}
      </div>


      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <>
          {/* Header with stats */}
          {role !== 'admin' && (
            <div className="flex flex-col mb-8">
              <div className="flex justify-between items-center mb-2">
                <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
                  Attendance Management
                </h1>

                {/* NEW: Check-in/out action button */}
                <button
                  onClick={handleAttendanceAction}
                  className={`btn ${todayAttendance.isCheckedIn ? 'btn-error' : 'btn-success'} text-white px-6 py-2 rounded-md`}
                >
                  {todayAttendance.isCheckedIn ? 'Check Out' : 'Check In'}
                </button>
              </div>
              <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                Track your daily attendance and view attendance history
              </p>

              {/* Today's Working Hours */}
              <div className={`p-4 rounded-lg shadow mb-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                <h2 className={`text-xl font-semibold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Today's Working Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check In Time</span>
                    <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{formatTime(todayAttendance.checkInTime)}</span>
                  </div>
                  <div className="flex flex-col">                  
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check Out Time</span>     
                    <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{formatTime(todayAttendance.checkOutTime)}</span>               
                  </div>             
                  <div className="flex flex-col">            
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Working Hours</span>                
                    <WorkingTimeCounter sessions={sessions.map(s => ({ id: s.id, checkIn: s.checkIn, checkOut: s.checkOut }))} 
                    isCheckedIn={todayAttendance.isCheckedIn } 
                     className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`} displayFormat="digital" />           
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {role !== 'admin' && (
            <div className="grid grid-cols-1 gap-8">
              {/* Calendar */}
              <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                <div className="card-body">
                  <header className={`flex flex-col sm:flex-row items-center sm:justify-between py-4 mb-4 gap-3 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-slate-600'}`}>
                    {/* Left side - Title */}
                    <h2 className={`text-lg sm:text-xl font-semibold flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="whitespace-nowrap">Attendance Calendar</span>
                    </h2>

                    {/* Right side - Month selector with arrows */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md mr-2 ${theme === 'light' ? 'border border-gray-300 text-gray-400 hover:text-gray-500 hover:bg-gray-50' : 'border border-slate-600 text-slate-400 hover:text-slate-300 hover:bg-slate-700'}`}
                        onClick={() => {
                          const prevMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
                          setCalendarDate(prevMonth);
                        }}
                      >
                        <span className="sr-only">Previous month</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="w-32 sm:w-40 text-center">
                        <time 
                          dateTime={format(calendarDate, 'yyyy-MM')}
                          className={`text-base sm:text-lg font-medium whitespace-nowrap ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}
                        >
                          {format(calendarDate, 'MMMM yyyy')}
                        </time>
                      </div>
                      
                      <button
                        type="button"
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md ml-2 ${theme === 'light' ? 'border border-gray-300 text-gray-400 hover:text-gray-500 hover:bg-gray-50' : 'border border-slate-600 text-slate-400 hover:text-slate-300 hover:bg-slate-700'}`}
                        onClick={() => {
                          const nextMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
                          setCalendarDate(nextMonth);
                        }}
                      >
                        <span className="sr-only">Next month</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </header>

                  {/* Legend */}
                  <div className="mb-4 flex flex-wrap gap-3 justify-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 ${theme === 'light' ? 'bg-green-100 border border-green-500' : 'bg-green-900 border border-green-400'}`}></div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Present</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 ${theme === 'light' ? 'bg-yellow-100 border border-yellow-500' : 'bg-yellow-900 border border-yellow-400'}`}></div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Late</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 ${theme === 'light' ? 'bg-blue-100 border border-blue-500' : 'bg-blue-900 border border-blue-400'}`}></div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Partial</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 ${theme === 'light' ? 'bg-red-100 border border-red-500' : 'bg-red-900 border border-red-400'}`}></div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Absent</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 ${theme === 'light' ? 'bg-gray-100 border border-gray-500' : 'bg-slate-600 border border-slate-400'}`}></div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Off-day</span>
                    </div>
                    {/* NEW: Public Holiday */}
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 ${theme === 'light' ? 'bg-pink-100 border border-pink-500' : 'bg-pink-900 border border-pink-400'}`}></div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Public Holiday</span>
                    </div>
                    {/* NEW: Event */}
                    <div className="flex items-center">
                      <div className={`w-3 h-3 mr-2 ${theme === 'light' ? 'bg-violet-100 border border-violet-500' : 'bg-violet-900 border border-violet-400'}`}></div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Event</span>
                    </div>

                  </div>
                  
                  <div className="shadow-sm ring-1 ring-black/5">
                    <div className={`grid grid-cols-7 gap-px text-center text-xs font-semibold ${theme === 'light' ? 'border-b border-gray-300 bg-gray-200 text-gray-700' : 'border-b border-slate-600 bg-slate-600 text-slate-200'}`}>
                      <div className={`py-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>S<span className="sr-only sm:not-sr-only">un</span></div>
                      <div className={`py-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>M<span className="sr-only sm:not-sr-only">on</span></div>
                      <div className={`py-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>T<span className="sr-only sm:not-sr-only">ue</span></div>
                      <div className={`py-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>W<span className="sr-only sm:not-sr-only">ed</span></div>
                      <div className={`py-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>T<span className="sr-only sm:not-sr-only">hu</span></div>
                      <div className={`py-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>F<span className="sr-only sm:not-sr-only">ri</span></div>
                      <div className={`py-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>S<span className="sr-only sm:not-sr-only">at</span></div>
                    </div>
                    
                    <div className={`grid grid-cols-7 grid-rows-6 gap-px ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-600'}`}>
                      {(() => {
                        // Generate calendar days for the current month view
                        const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
                        
                        // Calculate the first day to show (might be from previous month)
                        const firstDayToShow = new Date(firstDayOfMonth);
                        firstDayToShow.setDate(firstDayToShow.getDate() - firstDayToShow.getDay());
                        
                        // Generate 42 days (6 weeks)
                        const days = [];
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        for (let i = 0; i < 42; i++) {
                          const currentDate = new Date(firstDayToShow);
                          currentDate.setDate(currentDate.getDate() + i);
                          
                          const isCurrentMonth = currentDate.getMonth() === calendarDate.getMonth();
                          const isToday = format(currentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                          const isSelected = format(calendarDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
                          
                          // Find attendance record for this date
                          // const formattedDate = format(currentDate, 'yyyy-MM-dd');
                          // const record = attendanceRecords.find(r => {
                          //   const recordDate = toSingaporeTime(r.date) as Date;
                          //   return format(recordDate, 'yyyy-MM-dd') === formattedDate;
                          // });

                          const formattedDate = format(toSingaporeTime(currentDate) as Date, 'yyyy-MM-dd');
                          const record = attendanceRecords.find(r => {
                            const recordDate = toSingaporeTime(r.date) as Date;
                            return format(recordDate, 'yyyy-MM-dd') === formattedDate;
                          });


                          // Holidays for this date (already filtered to this employee via fetch)
                          //const holidays = getHolidaysForDate(currentDate);
                          //const isHoliday = isCurrentMonth && holidays.length > 0;
                          // NEW: Holidays & Events for this date (already filtered to this employee via fetch)
                          const dayItems = getHolidaysForDate(currentDate);
                          const hasHoliday = isCurrentMonth && dayItems.some(x => (x.event_type || 'holiday') === 'holiday');
                          const hasEvent   = isCurrentMonth && dayItems.some(x => (x.event_type || 'holiday') === 'event');


                          // Determine style based on attendance status
                          let bgClass = isCurrentMonth ? 
                            (theme === 'light' ? 'bg-white' : 'bg-slate-800') : 
                            (theme === 'light' ? 'bg-gray-50 text-gray-500' : 'bg-slate-700 text-slate-400');
                          let statusClass = '';

                          if (record && isCurrentMonth) {
                            switch(record.status) {
                              case 'present':
                                statusClass = theme === 'light' ? 'bg-green-50' : 'bg-green-900';
                                break;
                              case 'late':
                                statusClass = theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900';
                                break;
                              case 'partial':
                                statusClass = theme === 'light' ? 'bg-blue-50' : 'bg-blue-900';
                                break;
                              case 'absent':
                                statusClass = theme === 'light' ? 'bg-red-50' : 'bg-red-900';
                                break;
                              case 'offday':
                                statusClass = theme === 'light' ? 'bg-gray-100' : 'bg-slate-600';
                                break;
                            }
                          }

                          // Add a subtle ring for public holiday (so it doesn't fight status colors)
                          // const holidayRingClass = isHoliday
                          //   ? (theme === 'light' ? 'ring-1 ring-pink-300' : 'ring-1 ring-pink-600/60')
                          //   : '';
                          // NEW: Subtle markers so they don't fight status colors
                          const holidayRingClass = hasHoliday
                            ? (theme === 'light' ? 'ring-1 ring-pink-300' : 'ring-1 ring-pink-600/60')
                            : '';
                          const eventOutlineClass = hasEvent
                            ? (theme === 'light' ? 'outline outline-1 outline-violet-300' : 'outline outline-1 outline-violet-600/60')
                            : '';


                          days.push(
                            <div
                              key={formattedDate}
                              className={`
                                relative px-3 py-2 cursor-pointer h-16 w-full
                                ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-600'}
                                ${bgClass} ${statusClass} ${holidayRingClass}
                                ${isSelected ? `ring-2 ${theme === 'light' ? 'ring-indigo-600' : 'ring-blue-400'}` : ''}
                              `}
                              onClick={() => {
                                setCalendarDate(currentDate);
                                // Don't filter attendance records when date is clicked
                              }}
                              title={ (hasHoliday || hasEvent)
                                ? dayItems.map(h =>
                                    `${(h.event_type || 'holiday') === 'event' ? 'Event' : 'PH'}: ${h.title}`
                                  ).join(', ')
                                : undefined
                              }

                              //title={isHoliday ? holidays.map(h => h.title).join(', ') : undefined}
                            >
                              {/* PH badge */}
                              {/* {isHoliday && (
                                <div className={`absolute top-1 right-1 text-[10px] px-1 py-0.5 rounded
                                  ${theme === 'light' ? 'bg-pink-100 text-pink-700 border border-pink-300' : 'bg-pink-800 text-pink-100 border border-pink-600'}`}>
                                  PH
                                </div>
                              )} */}

                              {/* NEW: PH/EV badges */}
                              {(hasHoliday || hasEvent) && (
                                <div className="absolute top-1 right-1 flex flex-col items-end gap-1">
                                  {hasHoliday && (
                                    <div className={`text-[10px] px-1 py-0.5 rounded
                                      ${theme === 'light' ? 'bg-pink-100 text-pink-700 border border-pink-300' : 'bg-pink-800 text-pink-100 border border-pink-600'}`}>
                                      PH
                                    </div>
                                  )}
                                  {hasEvent && (
                                    <div className={`text-[10px] px-1 py-0.5 rounded
                                      ${theme === 'light' ? 'bg-violet-100 text-violet-700 border border-violet-300' : 'bg-violet-800 text-violet-100 border border-violet-600'}`}>
                                      EV
                                    </div>
                                  )}
                                </div>
                              )}


                              <div className="flex flex-col h-full">
                                <time
                                  dateTime={formattedDate}
                                  className={`
                                    block mb-1
                                    ${isToday 
                                      ? `flex h-6 w-6 items-center justify-center rounded-full font-semibold text-white ${theme === 'light' ? 'bg-indigo-600' : 'bg-blue-500'}` 
                                      : ''}
                                  `}
                                >
                                  {format(currentDate, 'd')}
                                </time>
                                
                                {record && isCurrentMonth && (
                                  <div className="flex-grow flex items-center justify-center">
                                    <div className={`h-2 w-2 rounded-full
                                      ${record.status === 'present' ? 'bg-green-500' :
                                        record.status === 'late' ? 'bg-yellow-500' :
                                        record.status === 'partial' ? 'bg-blue-500' :
                                        record.status === 'absent' ? 'bg-red-500' : 'bg-gray-500'}
                                    `}></div>
                                  </div>
                                )}

                                {/* Tiny holiday label at bottom */}
                                {/* {isHoliday && (
                                  <div className="absolute bottom-1 left-1 right-1">
                                    <div className={`text-[10px] truncate ${theme === 'light' ? 'text-pink-700' : 'text-pink-200'}`}>
                                      {holidays[0]?.title}{holidays.length > 1 ? ` +${holidays.length - 1}` : ''}
                                    </div>
                                  </div>
                                )} */}
                                {/* NEW: Tiny label at bottom (uses first item type for color) */}
                                {(hasHoliday || hasEvent) && (
                                  <div className="absolute bottom-1 left-1 right-1">
                                    {(() => {
                                      const first = dayItems[0];
                                      const firstIsEvent = (first?.event_type || 'holiday') === 'event';
                                      const labelColor = firstIsEvent
                                        ? (theme === 'light' ? 'text-violet-700' : 'text-violet-200')
                                        : (theme === 'light' ? 'text-pink-700' : 'text-pink-200');
                                      return (
                                        <div className={`text-[10px] truncate ${labelColor}`}>
                                          {first?.title}{dayItems.length > 1 ? ` +${dayItems.length - 1}` : ''}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}

                              </div>
                            </div>
                          );
                        }
                        
                        return days;
                      })()}
                    </div>
                  </div>
                  
                  {/* Selected date details */}
                  <div className={`mt-4 p-4 rounded-lg shadow-sm ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-slate-700 border border-slate-600'}`}>
                    <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                      {format(calendarDate, 'EEEE, MMMM d, yyyy')}
                    </h3>

                    {/* NEW: public holiday list for selected date */}
                    {/* {(() => {
                      const dayHolidays = getHolidaysForDate(calendarDate);
                      if (dayHolidays.length) {
                        return (
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                ${theme === 'light' ? 'bg-pink-100 text-pink-700 border border-pink-300' : 'bg-pink-800 text-pink-100 border border-pink-600'}`}>
                                Public Holiday
                              </span>
                              <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
                                {dayHolidays.length} {dayHolidays.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                            <ul className="list-disc pl-5 text-sm">
                              {dayHolidays.map(h => (
                                <li key={h.id} className={`${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
                                  <span className="font-medium">{h.title}</span>
                                  {h.description ? <span className={`ml-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>— {h.description}</span> : null}
                                  {!h.is_global && h.company_names ? (
                                    <span className={`ml-2 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-300'}`}>({h.company_names})</span>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return null;
                    })()} */}

                    {/* UPDATED: day items (Public Holidays + Events) */}
{(() => {
  const items = getHolidaysForDate(calendarDate);
  if (!items.length) return null;

  const ph = items.filter(h => (h.event_type || 'holiday') === 'holiday');
  const ev = items.filter(h => (h.event_type || 'holiday') === 'event');

  return (
    <div className="mb-3 space-y-3">
      {ph.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
              ${theme === 'light' ? 'bg-pink-100 text-pink-700 border border-pink-300' : 'bg-pink-800 text-pink-100 border border-pink-600'}`}>
              Public Holiday
            </span>
            <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
              {ph.length} {ph.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <ul className="list-disc pl-5 text-sm">
            {ph.map(h => (
              <li key={`ph-${h.id}`} className={`${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
                <span className="font-medium">{h.title}</span>
                {h.description ? <span className={`ml-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>— {h.description}</span> : null}
                {!h.is_global && h.company_names ? (
                  <span className={`ml-2 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-300'}`}>({h.company_names})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ev.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
              ${theme === 'light' ? 'bg-violet-100 text-violet-700 border border-violet-300' : 'bg-violet-800 text-violet-100 border border-violet-600'}`}>
              Event
            </span>
            <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
              {ev.length} {ev.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <ul className="list-disc pl-5 text-sm">
            {ev.map(h => (
              <li key={`ev-${h.id}`} className={`${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
                <span className="font-medium">{h.title}</span>
                {h.description ? <span className={`ml-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>— {h.description}</span> : null}
                {!h.is_global && h.company_names ? (
                  <span className={`ml-2 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-300'}`}>({h.company_names})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
})()}

                    
                    {(() => {
                      const formattedSelectedDate = ymdSG(calendarDate);
                      const selectedRecord = attendanceRecords.find(r => ymdSG(r.date) === formattedSelectedDate);
                      
                      if (selectedRecord) {
                        return (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-in:</span>
                              <span className={`ml-2 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                                {selectedRecord.checkIn 
                                  ? selectedRecord.first_checkIn
                                  : '--:--'}
                              </span>
                            </div>
                            <div>
                              <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out:</span>
                              <span className={`ml-2 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                                {selectedRecord.checkOut 
                                  ? selectedRecord.last_checkOut
                                  : '--:--'}
                              </span>
                            </div>
                            <div>
                              <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Status:</span>
                              <span className={`ml-2 badge ${getStatusBadgeClass(selectedRecord.status)}`}>
                                {selectedRecord.status}
                              </span>
                            </div>
                            <div>
                              <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Action:</span>
                              <span className="ml-2">
                                {hasAppealForRecord(selectedRecord) ? (
                                  <button
                                    className="btn btn-xs btn-outline"
                                    onClick={() => openEmployeeAppealViewModal(hasAppealForRecord(selectedRecord) as AppealData)}
                                  >
                                    View Appeal
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-xs btn-outline"
                                    onClick={() => openAppealRequestModal(selectedRecord)}
                                  >
                                    Submit Appeal
                                  </button>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className={`flex flex-col items-center py-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>No attendance record found for this date</span>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>

              {/* Attendance Records */}
              <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                <div className="card-body">
                  <h2 className={`card-title flex items-center gap-2 mb-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Attendance Records
                  </h2>

                  <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
                    <table className="table w-full">
                      <thead className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                        <tr>
                          <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                          <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check In</th>
                          <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check Out</th>
                          <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Working Hours</th>
                          <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Working Status</th>
                          <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                          <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Appeal Status</th>
                          {/* <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Today's sessions */}
                        {(sessions || []).map((session, idx) => (
                          <tr key={session.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${idx === 0 ? 'border-l-4 border-green-400' : ''} ${idx !== (sessions || []).length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
                            <td>
                              {(
                                <>
                                  <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Today</div>
                                  <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {format(toSingaporeTime(new Date()) as Date, 'EEEE')}
                                  </div>
                                </>
                              )}
                            </td>
                            <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                              {session.checkIn
                                ? format(toSingaporeTime(session.checkIn) as Date, 'hh:mm a')
                                : '--'}
                            </td>
                            <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                              {session.checkOut
                                ? format(toSingaporeTime(session.checkOut) as Date, 'hh:mm a')
                                : '--'}
                            </td>
                            <td className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                              {(() => {
                                // Skip calculation if checkIn is null
                                if (!session.checkIn) return '--';

                                const singaporeCheckIn = toSingaporeTime(session.checkIn) as Date;

                                const endTime = session.checkOut
                                  ? toSingaporeTime(session.checkOut) as Date
                                  : todayAttendance.isCheckedIn && idx === sessions.length - 1
                                    ? toSingaporeTime(currentTime) as Date
                                    : singaporeCheckIn;

                                // Calculate hours and minutes using date-fns
                                const diffHrs = differenceInHours(endTime, singaporeCheckIn);
                                const diffMins = differenceInMinutes(endTime, singaporeCheckIn) % 60;

                                return `${diffHrs}h ${diffMins}m`;
                              })()}
                            </td>
                            <td>
                              <span className={`badge ${!session.checkOut && idx === sessions.length - 1 && todayAttendance.isCheckedIn ? 'badge-success animate-pulse' : 'badge-info'}`}>
                                {!session.checkOut && idx === sessions.length - 1 && todayAttendance.isCheckedIn ? 'Active' : 'Complete'}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-success">
                                Present
                              </span>
                            </td>
                            <td>
                              {/* Disabled for today's active session */}
                              <span className="badge badge-success">
                                -
                              </span>
                            </td>
                          </tr>
                        ))}

                        {/* Previous records */}
                        {currentAttendanceRecords.map((record, index) => {
                          // Calculate working hours if both check-in and check-out exist
                          let workingHours = '';
                          if (record.checkIn && record.checkOut) {
                            const singaporeCheckIn = toSingaporeTime(record.checkIn) as Date;
                            const singaporeCheckOut = toSingaporeTime(record.checkOut) as Date;

                            // Calculate hours and minutes using date-fns
                            const diffHrs = differenceInHours(singaporeCheckOut, singaporeCheckIn);
                            const diffMins = differenceInMinutes(singaporeCheckOut, singaporeCheckIn) % 60;

                            workingHours = `${diffHrs}h ${diffMins}m`;
                          }

                          const singaporeRecordDate = toSingaporeTime(record.date) as Date;

                          return (
                            <tr key={index} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentAttendanceRecords.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
                              <td>
                                <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{format(singaporeRecordDate, 'dd/MM/yyyy')}</div>
                                <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                  {format(singaporeRecordDate, 'EEEE')}
                                </div>
                              </td>
                              <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                                {record.checkIn
                                  ? format(toSingaporeTime(record.checkIn) as Date, 'hh:mm a')
                                  : '--'}
                              </td>
                              <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                                {record.checkOut
                                  ? format(toSingaporeTime(record.checkOut) as Date, 'hh:mm a')
                                  : '--'}
                              </td>
                              <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{workingHours || '--'}</td>
                              <td>
                                {record.checkIn && record.checkOut ? (
                                  <span className="badge badge-info">Complete</span>
                                ) : record.checkIn ? (
                                  <span className="badge badge-warning">Incomplete</span>
                                ) : (
                                  <span className="badge badge-error">No Check-in</span>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadgeClass(record.status)}`}>
                                  {record.status}
                                </span>
                              </td>
                              <td>
                                {(() => {
                                  const statusDisplay = getAppealStatusDisplay(record.appealStatus);
                                  return statusDisplay.isBadge ? (
                                    <span className={statusDisplay.className}>
                                      {statusDisplay.display}
                                    </span>
                                  ) : (
                                    <span className={statusDisplay.className}>
                                      {statusDisplay.display}
                                    </span>
                                  );
                                })()}
                              </td>
                              {/* <td>
                                {hasAppealForRecord(record) ? (
                                  <button
                                    className="btn btn-xs btn-outline btn-primary"
                                    onClick={() => openEmployeeAppealViewModal(hasAppealForRecord(record) as AppealData)}
                                    title="View appeal details"
                                  >
                                    View
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-xs btn-outline btn-primary"
                                    onClick={() => openAppealRequestModal(record)}
                                  >
                                    Appeal
                                  </button>
                                )}
                              </td> */}
                            </tr>
                          );
                        })}

                        {/* Add pagination for attendance records */}
                        {totalRecords > 0 && (
                          <tr>
                            <td colSpan={7}>
                              <div className="flex justify-center mt-4 mb-2">
                                <div className="btn-group">

                                  <button
                                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                      onClick={() => goToRecordsPage(1)}
                                      disabled={attendanceRecordsPage === 1}
                                    >
                                      First
                                  </button>
                                  <button
                                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                    onClick={() => goToRecordsPage(attendanceRecordsPage - 1)}
                                    disabled={attendanceRecordsPage === 1}
                                  >
                                    «
                                  </button>
                                  {getRecordsPageNumbers().map(pageNumber => (
                                    <button
                                      key={pageNumber}
                                      className={`btn btn-sm ${attendanceRecordsPage === pageNumber ? 
                                        `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                                        `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                                      }`}
                                      onClick={() => goToRecordsPage(pageNumber)}
                                    >
                                      {pageNumber}
                                    </button>
                                  ))}
                                  <button
                                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                    onClick={() => goToRecordsPage(attendanceRecordsPage + 1)}
                                    disabled={attendanceRecordsPage === totalRecordPages}
                                  >
                                    »
                                  </button>
                                  <button
                                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                      onClick={() => goToRecordsPage(totalRecordPages)}
                                      disabled={attendanceRecordsPage === totalRecordPages}
                                    >
                                      Last
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show analytics for manager role only - restoring original logic yes */}
          {(role === 'manager' || role === 'admin') && (
            <div className={`mt-8 mb-2 p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-blue-800' : 'text-blue-400'}`}>Attendance Analytics</h2>

              {isStatsLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                </div>
              ) : attendanceStats ? (
                <div>
                  {/* Today's Attendance Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Present Today */}
                    <div className={`rounded-lg shadow-sm p-4 border-l-4 border-green-500 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${theme === 'light' ? 'bg-green-100' : 'bg-green-900'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Present Today</p>
                          <div className="flex items-end">
                            <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>{attendanceStats?.today?.present || 0}</p>
                            <p className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                              ({Math.round(((attendanceStats?.today?.present || 0) / (attendanceStats?.today?.total || 1)) * 100)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-3 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                        Out of {attendanceStats?.today?.total || 0} total employees
                      </div>
                    </div>

                    {/* Absent Today */}
                    <div className={`rounded-lg shadow-sm p-4 border-l-4 border-red-500 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${theme === 'light' ? 'bg-red-100' : 'bg-red-900'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Absent/Offday Today</p>
                          <div className="flex items-end">
                            <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>{attendanceStats?.today?.absent || 0}</p>
                            <p className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                              ({Math.round(((attendanceStats?.today?.absent || 0) / (attendanceStats?.today?.total || 1)) * 100)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-3 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                        Out of {attendanceStats?.today?.total || 0} total employees
                      </div>
                    </div>

                    {/* Late Check-ins Today */}
                    <div className={`rounded-lg shadow-sm p-4 border-l-4 border-yellow-500 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Late Check-ins</p>
                          <div className="flex items-end">
                            <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>{attendanceStats?.today?.late || 0}</p>
                            <p className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                              ({Math.round(((attendanceStats?.today?.late || 0) / (attendanceStats?.today?.total || 1)) * 100)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-3 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                        Out of {attendanceStats?.today?.total || 0} total employees
                      </div>
                    </div>

                    {/* Partial Today */}
                    <div className={`rounded-lg shadow-sm p-4 border-l-4 border-yellow-500 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                      <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Partial</p>
                          <div className="flex items-end">
                            <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>{attendanceStats?.today?.partial || 0}</p>
                            <p className={`text-sm ml-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                              ({Math.round(((attendanceStats?.today?.partial || 0) / (attendanceStats?.today?.total || 1)) * 100)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-3 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                        Out of {attendanceStats?.today?.total || 0} total employees
                      </div>
                    </div>
                  </div>

                  {/* Daily Attendance Rate */}
                  <div className={`p-6 rounded-lg shadow-sm mb-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                    <div className="flex flex-col mb-4">
                      <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Daily Attendance Rate</h3>

                      {/* Date selection carousel */}
                      <div className="w-full">
                        <div className="grid grid-cols-8 gap-1 w-full">
                          {(attendanceStats?.dailyStats || []).map((day, index) => {
                            const dayDate = parseISO(day.date);
                            const isToday = day.date === format(new Date(), 'yyyy-MM-dd');
                            const isYesterday = day.date === format(addDays(new Date(), -1), 'yyyy-MM-dd');

                            return (
                              <div
                                key={day.date}
                                onClick={() => setSelectedDay(day.date)}
                                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all duration-200 
                                ${selectedDay === day.date
                                    ? theme === 'light'
                                      ? 'bg-blue-100 border-blue-500 border-2'
                                      : 'bg-blue-900 border-blue-400 border-2'
                                    : theme === 'light'
                                      ? 'hover:bg-gray-50 border border-gray-200'
                                      : 'hover:bg-slate-700 border border-slate-600'}`}
                              >
                                <div className={`text-xs font-semibold ${isToday 
                                    ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                                    : theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                                  {isToday ? 'Today' : isYesterday ? 'Yesterday' : format(dayDate, 'EEE')}
                                </div>
                                <div className={`text-lg font-bold ${theme === 'light' ? 'text-gray-700' : 'text-slate-200'}`}>
                                  {format(dayDate, 'd')}
                                </div>
                                <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                                  {format(dayDate, 'MMM')}
                                </div>
                                <div className={`mt-1 h-1.5 w-1.5 rounded-full ${selectedDay === day.date ? theme === 'light' ? 'bg-blue-600' : 'bg-blue-400' : 'bg-transparent'
                                  }`}></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Date tag */}
                      <div className="flex justify-center mt-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900 text-blue-300'}`}>
                          {selectedDay === format(new Date(), 'yyyy-MM-dd')
                            ? 'Today\'s Attendance'
                            : `Attendance for ${format(parseISO(selectedDay), 'EEEE, dd MMM yyyy')}`}
                        </span>
                      </div>
                    </div>

                    {attendanceStats?.dailyStats && (
                      <div className="flex flex-col">
                        {/* Circular progress indicator */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-40 h-40">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                              {/* Background circle */}
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eee" strokeWidth="3.8"></circle>

                              {/* Calculate percentages and angles for the circle segments */}
                              {(function CircleSegments() {
                                const selectedDayData = attendanceStats.dailyStats.find(d => d.date === selectedDay);
                                if (!selectedDayData) return null;

                                const total = selectedDayData.total || 1;
                                const presentPercentage = Math.round((selectedDayData.present - selectedDayData.late) / total * 100);
                                const latePercentage = Math.round(selectedDayData.late / total * 100);

                                // SVG circle circumference is 2πr where r=15.9
                                const circumference = 2 * Math.PI * 15.9;
                                const offset = circumference * 0.25; // 25% offset to start at the top

                                // Calculate stroke-dasharray and stroke-dashoffset
                                const presentLength = circumference * (presentPercentage / 100);
                                const lateLength = circumference * (latePercentage / 100);

                                return (
                                  <>
                                    {/* Present circle segment (green) */}
                                    <circle
                                      cx="18" cy="18" r="15.9"
                                      fill="none"
                                      stroke="#4ade80"
                                      strokeWidth="3.8"
                                      strokeDasharray={`${presentLength} ${circumference - presentLength}`}
                                      strokeDashoffset={offset}
                                      className="transform -rotate-90 origin-center"
                                    />

                                    {/* Late circle segment (yellow) */}
                                    <circle
                                      cx="18" cy="18" r="15.9"
                                      fill="none"
                                      stroke="#facc15"
                                      strokeWidth="3.8"
                                      strokeDasharray={`${lateLength} ${circumference - lateLength}`}
                                      strokeDashoffset={offset - presentLength}
                                      className="transform -rotate-90 origin-center"
                                    />
                                  </>
                                );
                              })()}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-200'}`}>
                                {attendanceStats.dailyStats.find(d => d.date === selectedDay)?.rate || 0}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={`text-center mt-4 text-sm flex flex-col items-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                          <div>
                            Total of {attendanceStats.dailyStats.find(d => d.date === selectedDay)?.present || 0} employees present
                            out of {attendanceStats.dailyStats.find(d => d.date === selectedDay)?.total || 0}
                          </div>

                          {/* Legend */}
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
                              <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>On Time: {
                                (attendanceStats.dailyStats.find(d => d.date === selectedDay)?.present || 0) -
                                (attendanceStats.dailyStats.find(d => d.date === selectedDay)?.late || 0)
                              }</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                              <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Late: {attendanceStats.dailyStats.find(d => d.date === selectedDay)?.late || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Top Employees by Attendance */}
                  <div className="grid grid-cols-1 gap-6 mb-6 w-full">
                    <div className={`p-6 rounded-lg shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                      <h3 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                        Top 5 Attendance Performers (<span className="font-bold">{new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'long' })}</span>)
                      </h3>
                      <div className="overflow-x-auto">
                        <table className={`min-w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                          <thead className={theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'}>
                            <tr>
                              <th className={`py-2 px-4 text-left ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Rank</th>
                              <th className={`py-2 px-4 text-left ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Employee</th>
                              <th className={`py-2 px-4 text-center ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Rate</th>
                              <th className={`py-2 px-4 text-center ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Days Present</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(attendanceStats?.topEmployees || []).map((employee, index) => (
                              <tr key={employee.id} className={index % 2 === 0 
                                ? theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'
                                : theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
                                <td className={`py-3 px-4 border-b ${theme === 'light' ? 'border-gray-200 text-gray-900' : 'border-slate-600 text-slate-100'}`}>
                                  {index + 1}
                                </td>
                                <td className={`py-3 px-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
                                  <div className="flex items-center">
                                    <span className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{employee.first_name} {employee.last_name}</span>
                                  </div>
                                </td>
                                <td className={`py-3 px-4 text-center border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-300'}`}>
                                    {employee.attendance_rate ? employee.attendance_rate : 0}%
                                  </span>
                                </td>
                                <td className={`py-3 px-4 text-center border-b ${theme === 'light' ? 'border-gray-200 text-gray-900' : 'border-slate-600 text-slate-100'}`}>
                                  {employee.present_days}/{employee.working_days}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Department Comparison */}
                    {role === 'admin' && (
                      <div className={`p-6 rounded-lg shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
                          <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Department Attendance</h3>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className={`p-4 rounded-lg lg:p-0 lg:shadow-none ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                                <div className="flex justify-center items-center">
                                   <div>
                                    <div className="join flex flex-wrap gap-y-2 justify-center md:justify-start">
                                    <button 
                                        className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'yesterday' ? 'btn-primary' : ''}`}
                                        onClick={() => handleQuickDateSelect('yesterday',"overview")}
                                      >
                                        Yesterday
                                      </button>
                                      <button 
                                        className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'today' ? 'btn-primary' : ''}`}
                                        onClick={() => handleQuickDateSelect('today',"overview")}
                                      >
                                        Today
                                      </button>
                                      <button 
                                        className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastWeek' ? 'btn-primary' : ''}`}
                                        onClick={() => handleQuickDateSelect('lastWeek',"overview")}
                                      >
                                        Last Week
                                      </button>
                                      <button 
                                        className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisWeek' ? 'btn-primary' : ''}`}
                                        onClick={() => handleQuickDateSelect('thisWeek',"overview")}
                                      >
                                        This Week
                                      </button>
                                      <button 
                                        className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastMonth' ? 'btn-primary' : ''}`}
                                        onClick={() => handleQuickDateSelect('lastMonth',"overview")}
                                      >
                                        Last Month
                                      </button>
                                      <button 
                                        className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisMonth' || activeQuickDate === null ? 'btn-primary' : ''}`}
                                        onClick={() => handleQuickDateSelect('thisMonth',"overview")}
                                      >
                                        This Month
                                      </button>
                                    </div>
                                  </div>
                                </div>
                          </div>
                          
                          <div className="flex justify-center sm:justify-end">
                            <select
                              className="select select-bordered select-sm w-full max-w-xs sm:w-48"
                              value={selectedCompany}
                              onChange={handleCompanyChange}
                            >
                              <option value="0">All Companies</option>
                              {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.name}
                                </option>
                              ))}
                            </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {departmentStats.departments.length > 0 ? (
                            departmentStats.departments.map((dept) => (
                              <div key={dept.department_id} className="mb-2">
                                <div className="flex justify-between mb-1">
                                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>{dept.department_name}</span>
                                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>{dept.attendance_percentage || 0}%</span>
                                </div>
                                <div className={`w-full rounded-full h-2.5 ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-600'}`}>
                                  <div
                                    className={`h-2.5 rounded-full ${theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'}`}
                                    style={{ width: `${dept.attendance_percentage}%` }}
                                  ></div>
                                </div>
                                <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                                  {dept.total_attendance} present out of {dept.total_attendance_records || 0} attendance records
                                  ({dept.total_employees} employees)
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={`text-center py-6 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No department data available</div>
                          )}
                        </div>

                        {/* Pagination for departments */}
                        {departmentStats.pagination && departmentStats.pagination.total_pages > 1 && (
                          <div className="flex justify-center mt-6">
                            <div className="btn-group">
                            <button
                                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                onClick={() => changeDepartmentPage(1)}
                                disabled={departmentPage === 1}
                              >
                                First
                              </button>
                              <button
                                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                onClick={() => changeDepartmentPage(departmentPage - 1)}
                                disabled={departmentPage === 1}
                              >
                                «
                              </button>

                              {Array.from({ length: departmentStats.pagination.total_pages }, (_, i) => i + 1)
                                .filter(p => (
                                  p === 1 ||
                                  p === departmentStats.pagination.total_pages ||
                                  Math.abs(p - departmentStats.pagination.current_page) <= 1
                                ))
                                .map((page, i, arr) => (
                                  <React.Fragment key={page}>
                                    {i > 0 && arr[i - 1] !== page - 1 && (
                                      <button className={`btn btn-sm btn-disabled ${theme === 'light' ? 'bg-white border-slate-300 text-slate-400' : 'bg-slate-700 border-slate-600 text-slate-500'}`}>...</button>
                                    )}
                                    <button
                                      className={`btn btn-sm ${departmentPage === page ? 
                                        `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                                        `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                                      }`}
                                      onClick={() => changeDepartmentPage(page)}
                                    >
                                      {page}
                                    </button>
                                  </React.Fragment>
                                ))}

                              <button
                                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                onClick={() => changeDepartmentPage(departmentPage + 1)}
                                disabled={departmentPage === departmentStats.pagination.total_pages}
                              >
                                »
                              </button>
                              <button
                                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                onClick={() => changeDepartmentPage(departmentStats.pagination.total_pages)}
                                disabled={departmentPage === departmentStats.pagination.total_pages}
                              >
                                Last
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                  Failed to load attendance statistics
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'attendance' && (
        <div className={`p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Attendance</h2>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
              <div className="join flex flex-wrap gap-y-2 justify-center md:justify-start">
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'today' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('today')}
                >
                  Today
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'yesterday' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('yesterday')}
                >
                  Yesterday
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisWeek' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('thisWeek')}
                >
                  This Week
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastWeek' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('lastWeek')}
                >
                  Last Week
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisMonth' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('thisMonth')}
                >
                  This Month
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastMonth' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('lastMonth')}
                >
                  Last Month
                </button>
              </div>
              {/* Filter toggle button - visible on smaller screens */}
              <button
                className={`btn btn-outline lg:hidden ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                onClick={toggleFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Filtering section - responsive with conditional rendering */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Filter Attendance Records</h3>
              <button 
                className={`btn btn-sm btn-ghost lg:hidden ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-700'}`}
                onClick={toggleFilters}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by employee name"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
                </label>
                <select
                  className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.company || ''}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                >
                  <option value="">All Companies</option>
                  {companies.length > 0 ? (
                    companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))
                  ) : (
                    // Fallback options if companies haven't loaded
                    <>
                      <option value="ABC Corporation">ABC Corporation</option>
                      <option value="XYZ Enterprises">XYZ Enterprises</option>
                      <option value="Tech Solutions Inc.">Tech Solutions Inc.</option>
                      <option value="Global Ventures Ltd.">Global Ventures Ltd.</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Department</span>
                </label>
                <select className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.department || ''}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  disabled={!selectedCompany || selectedCompany === 0}
                >
                  <option value="">All Departments</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Status</span>
                </label>
                <select className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Partial">Partial</option>
                  <option value="Offday">Offday</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>From Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.fromDate || ''}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>To Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.toDate || ''}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                />
              </div>

              {/* <div className="form-control flex items-end">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                    onClick={() => applyAttendanceFilters(filters)}
                  >
                    Apply Filter
                  </button>
                  <button
                    className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                    onClick={resetAttendanceFilters}
                  >
                    Reset
                  </button>

                  <button
  className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
  onClick={() => downloadAttendanceReport(amendAttendanceData)}
>
  Export Excel
</button>
                </div>
              </div> */}
              <div className="form-control">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
    <button
      type="button"
      className={`btn w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
      onClick={() => applyAttendanceFilters(filters)}
    >
      Apply Filter
    </button>

    <button
      type="button"
      className={`btn w-full btn-outline ${
        theme === 'light'
          ? 'border-slate-600 text-slate-600 hover:bg-slate-600'
          : 'border-slate-400 text-slate-400 hover:bg-slate-400'
      } hover:text-white`}
      onClick={resetAttendanceFilters}
    >
      Reset
    </button>

    {/* <button
      type="button"
      className={`btn w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
      onClick={() => downloadAttendanceReport(amendAttendanceData)}
    >
      Export Excel
    </button> */}

<button
  type="button"
  className={`btn w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isExporting ? 'loading' : ''}`}
  onClick={handleExportWithLeaves}
  disabled={isExporting}
>
  {isExporting ? 'Exporting...' : 'Export Excel with Leaves'}
</button>
  </div>
</div>

            </div>
          </div>

          {/* Results table */}
          <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
            <table className="table w-full">
              <thead>
                <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Company</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Department</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check In</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check Out</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAmendItems.map((item, idx) => (
                  <tr
                    key={`${item.id}-${idx}`}
                    className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${idx !== currentAmendItems.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''} ${item._justAmended ? `${theme === 'light' ? 'bg-green-100' : 'bg-green-900'} animate-pulse` : ''}`}
                  >
                    {/*Employee */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.employee_name ?? ''}</div>
                        </div>
                      </div>
                    </td>
                    {/*Company */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.company_name}</td>
                    {/*Department */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.department_name}</td>
                    {/*Date */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.date ? new Date(item.date).toLocaleDateString() : ''}</td>
                    {/*Check In */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.checkIn && item.checkIn !== '--' ?
                      new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                      item.checkIn}</td>
                    {/*Check Out */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.checkOut && item.checkOut !== '--' ?
                      new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                      item.checkOut}</td>
                    {/*Status */}
                    <td>
                      <span className={`badge ${item.status === 'present' ? 'badge-success' :
                          item.status === 'late' ? 'badge-warning' :
                            item.status === 'absent' ? 'badge-error' :
                              item.status === 'partial' ? 'badge-info' :
                                'badge-neutral'
                        }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="btn-group">

                <button
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>

              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {getPageNumbers().map(pageNumber => (
                <button
                  key={pageNumber}
                  className={`btn btn-sm ${currentPage === pageNumber ? 
                    `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                    `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                  }`}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>

              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'amend' && (
        <div className={`p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Attendance Amendment</h2>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
              <div className="join flex flex-wrap gap-y-2 justify-center md:justify-start">
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'today' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('today')}
                >
                  Today
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'yesterday' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('yesterday')}
                >
                  Yesterday
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisWeek' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('thisWeek')}
                >
                  This Week
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastWeek' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('lastWeek')}
                >
                  Last Week
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisMonth' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('thisMonth')}
                >
                  This Month
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastMonth' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('lastMonth')}
                >
                  Last Month
                </button>
              </div>
              {/* Filter toggle button - visible on smaller screens */}
              <button
                className={`btn btn-outline lg:hidden ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                onClick={toggleFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Filtering section - responsive with conditional rendering */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Filter Amend Records</h3>
              <button 
                className={`btn btn-sm btn-ghost lg:hidden ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-700'}`}
                onClick={toggleFilters}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by employee name"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
                </label>
                <select
                  className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.company || ''}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                >
                  <option value="">All Companies</option>
                  {companies.length > 0 ? (
                    companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))
                  ) : (
                    // Fallback options if companies haven't loaded
                    <>
                      <option value="ABC Corporation">ABC Corporation</option>
                      <option value="XYZ Enterprises">XYZ Enterprises</option>
                      <option value="Tech Solutions Inc.">Tech Solutions Inc.</option>
                      <option value="Global Ventures Ltd.">Global Ventures Ltd.</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Department</span>
                </label>
                <select className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.department || ''}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  disabled={!selectedCompany || selectedCompany === 0}
                >
                  <option value="">All Departments</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Status</span>
                </label>
                <select className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Absent">Absent</option>
                  <option value="Offday">Offday</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>From Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.fromDate || ''}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>To Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.toDate || ''}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                />
              </div>

              <div className="form-control flex items-end">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                    onClick={() => applyAttendanceFilters(filters)}
                  >
                    Apply Filter
                  </button>
                  <button
                    className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                    onClick={resetAttendanceFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
            <table className="table w-full">
              <thead>
                <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Company</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Department</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Amended By</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Amended Date</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAmendItems.map((item, idx) => (
                  <tr
                    key={`${item.id}-${idx}`}
                    className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${idx !== currentAmendItems.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''} ${item._justAmended ? `${theme === 'light' ? 'bg-green-100' : 'bg-green-900'} animate-pulse` : ''}`}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.employee_name ?? ''}</div>
                        </div>
                      </div>
                    </td>
                    {/*Company */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.company_name}</td>
                    {/*Department */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.department_name}</td>
                    {/*Date */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.date ? new Date(item.date).toLocaleDateString() : ''}</td>
                    {/*Status */}
                    <td>
                      <span className={`badge ${item.status === 'present' ? 'badge-success' :
                          item.status === 'late' ? 'badge-warning' :
                            item.status === 'absent' ? 'badge-error' :
                              item.status === 'partial' ? 'badge-info' :
                                'badge-neutral'
                        }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    {/*Amended By */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.amend_by}</td>
                    {/*Amended Date */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.amend_date ? format(toSingaporeTime(new Date(item.amend_date)), 'MM/dd/yyyy HH:mm') : ''}</td>
                    {/*Actions */}
                    <td>
                      {(item.status.toLowerCase() === 'offday' ||
                        item.status.toLowerCase() === 'absent') && (
                          <button
                            className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                            onClick={() => openAmendModal({
                              id: item.id,
                              name: item.employee_name ?? '',
                              currentStatus: item.status,
                              date: item.date,
                              department: item.department_name,
                              attendanceDayId: item.attendance_day_id,
                              employeeId: item.employee_id,
                              companyName: item.company_name
                            })}
                          >
                            Amend
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="btn-group">
            <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {getPageNumbers().map(pageNumber => (
                <button
                  key={pageNumber}
                  className={`btn btn-sm ${currentPage === pageNumber ? 
                    `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                    `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                  }`}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appeal' && (
        <div className={`p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Attendance Appeals</h2>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
              <div className="join flex flex-wrap gap-y-2 justify-center md:justify-start">
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'today' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('today')}
                >
                  Today
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'yesterday' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('yesterday')}
                >
                  Yesterday
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisWeek' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('thisWeek')}
                >
                  This Week
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastWeek' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('lastWeek')}
                >
                  Last Week
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisMonth' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('thisMonth')}
                >
                  This Month
                </button>
                <button 
                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastMonth' ? `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}`}
                  onClick={() => handleQuickDateSelect('lastMonth')}
                >
                  Last Month
                </button>
              </div>
              {/* Filter toggle button - visible on smaller screens */}
              <button
                className={`btn btn-outline lg:hidden ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                onClick={toggleFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Filtering section - responsive with conditional rendering */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block p-4 rounded-lg mb-6 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Filter Appeal Records</h3>
              <button 
                className={`btn btn-sm btn-ghost lg:hidden ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-700'}`}
                onClick={toggleFilters}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by employee name"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
                </label>
                <select
                  className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.company || ''}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                >
                  <option value="">All Companies</option>
                  {companies.length > 0 ? (
                    companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))
                  ) : (
                    // Fallback options if companies haven't loaded
                    <>
                      <option value="ABC Corporation">ABC Corporation</option>
                      <option value="XYZ Enterprises">XYZ Enterprises</option>
                      <option value="Tech Solutions Inc.">Tech Solutions Inc.</option>
                      <option value="Global Ventures Ltd.">Global Ventures Ltd.</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Department</span>
                </label>
                <select className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.department || ''}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  disabled={!selectedCompany || selectedCompany === 0}
                >
                  <option value="">All Departments</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Appeal Status</span>
                </label>
                <select className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>From Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.fromDate || ''}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>To Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  value={filters.toDate || ''}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                />
              </div>

              <div className="form-control flex items-end">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                    onClick={() => applyAttendanceFilters(filters)}
                  > 
                    Apply Filter
                  </button>
                  <button
                    className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                    onClick={resetAttendanceFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk edit controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                className={`btn btn-outline ${isBulkMode ? 'btn-primary' : ''}`}
                onClick={toggleBulkMode}
              >
                {isBulkMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Bulk Edit
                  </>
                )}
              </button>
              
              {isBulkMode && (
                <div className="text-sm text-gray-600">
                  {selectedAppeals.length} appeal(s) selected
                </div>
              )}
            </div>

            {isBulkMode && selectedAppeals.length > 0 && (
              <div className="flex gap-2">
                <button
                  className={`btn btn-success btn-sm ${bulkLoading ? 'loading' : ''}`}
                  onClick={() => handleBulkAction('approve')}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Selected
                    </>
                  )}
                </button>
                <button
                  className={`btn btn-error btn-sm ${bulkLoading ? 'loading' : ''}`}
                  onClick={() => handleBulkAction('reject')}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject Selected
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Appeals table */}
          <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
            <table className="table w-full">
              <thead>
                <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                  {isBulkMode && (
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} w-12`}>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        onChange={handleSelectAllAppeals}
                        checked={selectedAppeals.length > 0 && selectedAppeals.length === currentAppealItems.filter(appeal => appeal.appeal_status.toLowerCase() === 'pending').length}
                      />
                    </th>
                  )}
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Company</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Department</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Submitted Date</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Attendance Status</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Appeal Date</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Appeal Status</th>
                  <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAppealItems.map((appeal, idx) => (
                  <tr
                    key={`${appeal.id}-${idx}`}
                    className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${idx !== currentAppealItems.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''} ${appeal._justUpdated ? `${theme === 'light' ? 'bg-green-100' : 'bg-green-900'} animate-pulse` : ''}`}
                  >
                    {isBulkMode && (
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selectedAppeals.includes(appeal.id)}
                          onChange={(e) => handleSelectAppeal(appeal.id, e.target.checked)}
                          disabled={appeal.appeal_status.toLowerCase() !== 'pending'}
                        />
                      </td>
                    )}
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{appeal.employee_name}</div>
                        </div>
                      </div>
                    </td>
                    {/*Company */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{appeal.company_name}</td>
                    {/*Department */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{appeal.department_name}</td>
                    {/*Submitted Date */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{appeal.date ? new Date(appeal.date).toLocaleDateString() : ''}</td>
                    {/*Attendance Status */}
                    <td>
                      <span className={`badge ${appeal.status.toLowerCase() === 'present' ? 'badge-success' :
                          appeal.status.toLowerCase() === 'late' ? 'badge-warning' :
                            appeal.status.toLowerCase() === 'absent' ? 'badge-error' :
                              appeal.status.toLowerCase() === 'partial' ? 'badge-info' :
                                'badge-neutral'
                        }`}>
                        {appeal.status}
                      </span>
                    </td>
                    {/*Appeal Date */}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{appeal.appeal_date ? new Date(appeal.appeal_date).toLocaleDateString() : ''}</td>
                    {/*Appeal Status */}
                    <td>
                      <span className={`badge ${appeal.appeal_status.toLowerCase() === 'approved' ? 'badge-success' :
                          appeal.appeal_status.toLowerCase() === 'rejected' ? 'badge-error' :
                            appeal.appeal_status.toLowerCase() === 'cancel' ? 'bg-gray-400' :
                            'badge-warning'
                        }`}>
                        {appeal.appeal_status.toUpperCase()}
                      </span>
                    </td>
                    {/*Actions */}
                    <td>
                      {!isBulkMode && appeal.appeal_status.toLowerCase() === 'pending' && appeal.appeal_status.toLowerCase() !== 'cancel' ? (
                        <div className="flex gap-2">
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => handleAppealAction(appeal, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() => handleAppealAction(appeal, 'reject')}
                          >
                            Reject
                          </button>
                          <button
                            className="btn btn-xs btn-info"
                            onClick={() => openAppealModal(appeal)}
                          >
                            View
                          </button>
                        </div>
                      ) : !isBulkMode ? (
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => openAppealModal(appeal)}
                        >
                          View
                        </button>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {appeal.appeal_status.toLowerCase() === 'pending' ? 'Use bulk actions above' : 'Cannot bulk edit'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - same as in amend tab */}
          <div className="flex justify-center mt-6">
            <div className="btn-group">
            <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {getPageNumbers().map(pageNumber => (
                <button
                  key={pageNumber}
                  className={`btn btn-sm ${currentPage === pageNumber ? 
                    `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                    `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                  }`}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amendment Modal */}
      {isAmendModalOpen && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative">
            <div className="card bg-base-100">
              <div className="card-body p-0">
                <h3 className="card-title font-bold text-lg border-b pb-3">
                  Amend Attendance Status
                </h3>

                <div className="py-4">
                  {/* Employee Info with Avatar */}
                  <div className="flex items-center mb-4">
                    <div>
                      <div className="font-semibold text-lg">{amendEmployee.employee_name}</div>
                      <div className="text-sm opacity-75">ID: {amendEmployee.id}</div>
                      <div className="text-sm opacity-75 flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {amendEmployee.company_name}
                      </div>
                      <div className="text-sm opacity-75 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {amendEmployee.department_name}
                      </div>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Current Status */}
                  <div className="mb-4">
                    <span className="text-sm font-medium opacity-75">Current Status</span>
                    <div className="mt-1">
                      <span className={`badge ${amendEmployee.status === 'absent' ? 'badge-error' :
                          amendEmployee.status === 'offday' ? 'badge-neutral' :
                            'badge-ghost'
                        }`}>
                        {amendEmployee.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* New Status Selection */}
                  <div>
                    <span className="text-sm font-medium opacity-75 block mb-3">Select New Status</span>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex flex-col items-center gap-3 p-3 border rounded-lg cursor-pointer ${newStatus === 'absent' ? 'border-primary bg-primary/10' : 'border-base-300 hover:bg-base-200'
                        }`}>
                        <input
                          type="radio"
                          className="radio radio-primary radio-sm"
                          name="status"
                          checked={newStatus === 'absent'}
                          onChange={() => setNewStatus('absent')}
                        />
                        <div className="flex items-center gap-2 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="font-medium">Absent</span>
                        </div>
                      </label>
                      <label className={`flex flex-col items-center gap-3 p-3 border rounded-lg cursor-pointer ${newStatus === 'offday' ? 'border-primary bg-primary/10' : 'border-base-300 hover:bg-base-200'
                        }`}>
                        <input
                          type="radio"
                          className="radio radio-primary radio-sm"
                          name="status"
                          checked={newStatus === 'offday'}
                          onChange={() => setNewStatus('offday')}
                        />
                        <div className="flex items-center gap-2 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Off-day</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-action border-t pt-3">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsAmendModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAmendment(amendEmployee, newStatus)}
                  >
                    Submit Amendment
                  </button>
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setIsAmendModalOpen(false)}>close</button>
            </form>
          </div>
        </dialog>
      )}

      {/* Appeal Detail Modal */}
      {isAppealModalOpen && selectedAppeal && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative max-w-2xl">
            <div className="card bg-base-100">
              <div className="card-body p-0">
                <h3 className="card-title font-bold text-lg border-b pb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Appeal Details
                  <span className={`badge badge-sm ml-3 ${selectedAppeal.appeal_status === 'approved' ? 'badge-success' :
                      selectedAppeal.appeal_status === 'rejected' ? 'badge-error' :
                        'badge-warning'
                    }`}>
                    {selectedAppeal.appeal_status.toUpperCase()}
                  </span>
                </h3>

                <div className="py-4">
                  {/* Employee Info Card */}
                  <div className="card card-compact bg-base-200 mb-4">
                    <div className="card-body">
                      <div className="flex items-center gap-4">
                        <div>
                          <h2 className="card-title text-lg font-bold">{selectedAppeal.employee_name}</h2>
                          <div className="">ID: {selectedAppeal.employee_no}</div>
                          <div className="text-sm mt-1 flex flex-col">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="opacity-75">{selectedAppeal.company_name}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="opacity-75">{selectedAppeal.department_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appeal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="stats shadow">
                      <div className="stat">
                        <div className="stat-title">Attendance Date</div>
                        <div className="stat-value text-lg">
                          {selectedAppeal.attendance_date ? new Date(selectedAppeal.attendance_date).toLocaleDateString() : ''}
                        </div>
                        <div className="stat-desc flex items-center mt-1">
                          <span className={`badge ${selectedAppeal.status.toLowerCase() === 'present' ? 'badge-success' :
                              selectedAppeal.status.toLowerCase() === 'late' ? 'badge-warning' :
                                selectedAppeal.status.toLowerCase() === 'absent' ? 'badge-error' :
                                  selectedAppeal.status.toLowerCase() === 'offday' ? 'badge-neutral' :
                                  selectedAppeal.status.toLowerCase() === 'partial' ? 'badge-info' :
                                    'badge-neutral'
                            }`}>
                            {selectedAppeal.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="stats shadow">
                      <div className="stat">
                        <div className="stat-title">Appeal Date</div>
                        <div className="stat-value text-lg">
                          {selectedAppeal.appeal_date ? new Date(selectedAppeal.appeal_date).toLocaleDateString() : ''}
                        </div>
                        <div className="stat-desc flex items-center mt-1">
                          <span className={`badge ${selectedAppeal.requested_status.toLowerCase() === 'present' ? 'badge-success' :
                              selectedAppeal.requested_status.toLowerCase() === 'late' ? 'badge-warning' :
                                selectedAppeal.requested_status.toLowerCase() === 'absent' ? 'badge-error' :
                                  selectedAppeal.requested_status.toLowerCase() === 'offday' ? 'badge-neutral' :
                                    selectedAppeal.requested_status.toLowerCase() === 'partial' ? 'badge-info' :
                                      'badge-neutral'
                            }`}>
                            {selectedAppeal.requested_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Check-in/Check-out Times Comparison */}
                  <div className="card bg-base-100 border border-base-300 mb-4">
                    <div className="card-body">
                      <h3 className="card-title text-base flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Attendance Time Details
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                              <th></th>
                              <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-in Time</th>
                              <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-out Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th className="font-medium text-sm">Original Record</th>
                              <td className={selectedAppeal.original_check_in ? '' : 'text-error'}>
                                {selectedAppeal.original_check_in ? format(toSingaporeTime(new Date(selectedAppeal.original_check_in)), 'HH:mm a') : 'No check-in recorded'}
                              </td>
                              <td className={selectedAppeal.original_check_out ? '' : 'text-error'}>
                                {selectedAppeal.original_check_out ? format(toSingaporeTime(new Date(selectedAppeal.original_check_out)), 'HH:mm a') : 'No check-out recorded'}
                              </td>
                            </tr>
                            <tr>
                              <th className="font-medium text-sm bg-base-200">Requested Change</th>
                              <td className="font-medium text-success">
                                {selectedAppeal.requested_check_in ? format(toSingaporeTime(new Date(selectedAppeal.requested_check_in)), 'HH:mm a') : 'Not specified'}
                              </td>
                              <td className="font-medium text-success">
                                {selectedAppeal.requested_check_out ? format(toSingaporeTime(new Date(selectedAppeal.requested_check_out)), 'HH:mm a') : 'Not specified'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Time Change Summary */}
                      <div className="mt-2 text-sm">
                        {(() => {
                          if (!selectedAppeal.original_check_in && selectedAppeal.requested_check_in) {
                            return (
                              <div className="alert alert-info text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Employee is requesting to create a new attendance record.</span>
                              </div>
                            );
                          } else if (selectedAppeal.original_check_in !== selectedAppeal.requested_check_in && selectedAppeal.requested_check_in) {
                            return (
                              <div className="alert alert-warning text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Employee is requesting to modify their check-in time.</span>
                              </div>
                            );
                          } else if (selectedAppeal.original_check_out !== selectedAppeal.requested_check_out && selectedAppeal.requested_check_out) {
                            return (
                              <div className="alert alert-warning text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Employee is requesting to modify their check-out time.</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="alert alert-warning text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Employee is requesting attendance time modification.</span>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Reason for Appeal */}
                  <div className="card bg-base-100 border border-base-300 mb-4">
                    <div className="card-body">
                      <h3 className="card-title text-base flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Reason for Appeal
                      </h3>
                      <div className="rounded-lg bg-base-200 p-4 text-sm whitespace-pre-wrap">
                        {selectedAppeal.reason}
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline 
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-base flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Appeal Status
                </h3>
                <ul className="steps steps-vertical">
                  <li className="step step-primary">Appeal Submitted</li>
                  <li className={`step ${['approved', 'rejected'].includes(selectedAppeal.appeal_status) ? 'step-primary' : ''}`}>Under Review</li>
                  <li className={`step ${selectedAppeal.appeal_status === 'approved' ? 'step-success' : selectedAppeal.appeal_status === 'rejected' ? 'step-error' : ''}`}>
                    {selectedAppeal.appeal_status === 'approved' ? 'Approved' : 
                     selectedAppeal.appeal_status === 'rejected' ? 'Rejected' : 'Decision Pending'}
                  </li>
                </ul>
              </div>
            </div>*/}
                </div>

                <div className="modal-action border-t pt-3">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsAppealModalOpen(false)}
                  >
                    Close
                  </button>

                  {selectedAppeal.appeal_status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={() => handleAppealAction(selectedAppeal, 'reject')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject Appeal
                      </button>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleAppealAction(selectedAppeal, 'approve')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve Appeal
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setIsAppealModalOpen(false)}>close</button>
            </form>
          </div>
        </dialog>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="toast toast-middle toast-center z-50">
          <div className={`alert ${notification.type === 'success' ? 'alert-success' :
              notification.type === 'error' ? 'alert-error' :
                'alert-info'
            } shadow-lg`}>
            <div className="flex items-center">
              {notification.type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {notification.type === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {notification.type === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add the Confirmation Modal */}
      {showConfirmModal && appealToAction && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <div className={`p-3 rounded-full ${confirmAction === 'approve' ? 'bg-success/20' : 'bg-error/20'}`}>
                {confirmAction === 'approve' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-lg">
                {confirmAction === 'approve' ? 'Approve Appeal Request' : 'Reject Appeal Request'}
              </h3>
            </div>

            {/* Appeal Details Card */}
            <div className="card bg-base-200 shadow-sm mb-4">
              <div className="card-body p-4">
                <h4 className="card-title text-md flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Appeal Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Employee:</span>
                    <span>{appealToAction.employee_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Date:</span>
                    <span>{appealToAction.date ? new Date(appealToAction.date).toLocaleDateString('en-US') : '-'}</span>
                  </div>
                </div>

                <div className="divider my-1"></div>

                <div>
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span className="font-medium">Appeal Reason:</span>
                  </div>
                  <div className="p-2 bg-base-100 rounded-lg text-sm whitespace-pre-wrap">
                    {appealToAction.reason}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Form */}
            <div className="card bg-base-100 border border-base-300 mb-4">
              <div className="card-body p-4">
                <h4 className="card-title text-md flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {confirmAction === 'approve' ? 'Provide Approval Comments' : 'Provide Rejection Reason'}
                </h4>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {confirmAction === 'approve'
                        ? 'Approval Comments (Optional)'
                        : 'Rejection Reason'}
                    </span>
                    {confirmAction === 'reject' && (
                      <span className="label-text-alt text-error">(Required)</span>
                    )}
                  </label>
                  <textarea
                    className={`textarea textarea-bordered ${reasonError ? 'textarea-error' : ''} focus:outline-none focus:border-primary`}
                    placeholder={confirmAction === 'approve'
                      ? "Enter any comments or notes about this approval..."
                      : "Please explain why this appeal is being rejected..."}
                    value={confirmReason}
                    onChange={(e) => {
                      setConfirmReason(e.target.value);
                      if (e.target.value.trim()) {
                        setReasonError('');
                      }
                    }}
                    rows={3}
                  ></textarea>
                  {reasonError && (
                    <label className="label">
                      <span className="label-text-alt text-error">{reasonError}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-action items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-500">
                {confirmAction === 'approve'
                  ? 'Approving will update the attendance record.'
                  : 'Rejection requires a valid reason.'}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn btn-sm ${confirmAction === 'approve' ? 'btn-success' : 'btn-error'}`}
                  onClick={executeAppealAction}
                >
                  {confirmAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowConfirmModal(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Appeal Request Modal */}
      {isAppealRequestModalOpen && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className={`modal-box relative max-w-xl rounded-lg shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center border-b pb-2 mb-3 ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
              <h3 className={`font-semibold text-lg flex items-center ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Submit Attendance Appeal
              </h3>
              <button
                className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-700'}`}
                onClick={() => setIsAppealRequestModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Appeal Form */}
            <div className="space-y-3">
              {/* Date and Status */}
              <div className={`flex flex-wrap justify-between items-center p-2 rounded-md ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'}`}>
                <div>
                  <span className={`text-xs font-medium block ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Date</span>
                  <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                    {appealRequestData.date
                      ? format(parseISO(appealRequestData.date), 'EEE, MMM d, yyyy')
                      : ''}
                  </span>
                </div>
                <div>
                  <span className={`text-xs font-medium block ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Current Status</span>
                  <span className={`badge badge-sm ${appealRequestData.status === 'present' ? 'badge-success' :
                      appealRequestData.status === 'late' ? 'badge-warning' :
                        appealRequestData.status === 'absent' ? 'badge-error' :
                          'badge-info'
                    }`}>
                    {appealRequestData.status}
                  </span>
                </div>
              </div>

              {/* Time Information Section */}
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 mb-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className={`font-medium text-sm ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Time Information</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Original Records */}
                  <div className={`p-2 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'}`}>
                    <h5 className={`text-xs font-medium mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>Original Records</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-in</label>
                        <div className={`border rounded px-2 py-1 text-sm ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}>
                          {appealRequestData.originalCheckIn
                            ? format(parseISO(appealRequestData.date + 'T' + appealRequestData.originalCheckIn), 'hh:mm a')
                            : '--:--'}
                        </div>
                      </div>
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out</label>
                        <div className={`border rounded px-2 py-1 text-sm ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}>
                          {appealRequestData.originalCheckOut
                            ? format(parseISO(appealRequestData.date + 'T' + appealRequestData.originalCheckOut), 'hh:mm a')
                            : '--:--'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requested Changes */}
                  <div className={`p-2 rounded-md ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/30'}`}>
                    <h5 className={`text-xs font-medium mb-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>Requested Changes</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-in</label>
                        <input
                          type="time"
                          name="requestedCheckIn"
                          className={`input input-bordered input-xs w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${appealRequestErrors.requestedCheckIn ? 'input-error' : ''
                            }`}
                          value={appealRequestData.requestedCheckIn}
                          onChange={handleAppealInputChange}
                        />
                        {appealRequestErrors.requestedCheckIn && (
                          <div className="text-xs text-error mt-0.5">
                            {appealRequestErrors.requestedCheckIn}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out</label>
                        <input
                          type="time"
                          name="requestedCheckOut"
                          className={`input input-bordered input-xs w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${appealRequestErrors.requestedCheckOut ? 'input-error' : ''
                            }`}
                          value={appealRequestData.requestedCheckOut}
                          onChange={handleAppealInputChange}
                        />
                        {appealRequestErrors.requestedCheckOut && (
                          <div className="text-xs text-error mt-0.5">
                            {appealRequestErrors.requestedCheckOut}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason for Appeal */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h4 className={`font-medium text-sm ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Reason for Appeal</h4>
                </div>
                <textarea
                  name="reason"
                  className={`textarea textarea-bordered textarea-sm w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${appealRequestErrors.reason ? 'textarea-error' : ''
                    }`}
                  placeholder="Please provide a detailed reason for your appeal request..."
                  value={appealRequestData.reason}
                  onChange={handleAppealInputChange}
                  rows={2}
                ></textarea>
                {appealRequestErrors.reason && (
                  <div className="text-xs text-error mt-0.5">
                    {appealRequestErrors.reason}
                  </div>
                )}
                <div className={`text-xs mt-0.5 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                  Provide specific details
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex justify-end gap-2 mt-4 pt-2 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
              <button
                type="button"
                className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                onClick={() => setIsAppealRequestModalOpen(false)}
                disabled={isAppealSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'} ${isAppealSubmitting ? 'loading' : ''}`}
                onClick={submitAppealRequest}
                disabled={isAppealSubmitting}
              >
                {isAppealSubmitting ? 'Submitting...' : 'Submit Appeal'}
              </button>
            </div>

            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setIsAppealRequestModalOpen(false)}>close</button>
            </form>
          </div>
        </dialog>
      )}

      {/* Employee Appeal View Modal with transparent background */}
      {isEmployeeAppealViewModalOpen && selectedEmployeeAppeal && (
        <dialog open className="modal">
          <div className={`modal-box ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <form method="dialog">
              <button onClick={() => setIsEmployeeAppealViewModalOpen(false)} className={`btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-700'}`}>✕</button>
            </form>

            {/* Modal header with status */}
            <h3 className={`font-bold text-lg mb-4 flex items-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
              Appeal Status:
              <span className={`badge ml-2 ${selectedEmployeeAppeal.appeal_status === 'approved' ? 'badge-success' :
                  selectedEmployeeAppeal.appeal_status === 'rejected' ? 'badge-error' :
                    'badge-warning'
                }`}>
                {selectedEmployeeAppeal.appeal_status.toUpperCase()}
              </span>
            </h3>

            {/* Main content */}
            <div className="space-y-4">
              {/* Basic Details */}
              <div className={`stats stats-vertical lg:stats-horizontal shadow w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                <div className="stat">
                  <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Attendance Date</div>
                  <div className={`stat-value text-base ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                    {selectedEmployeeAppeal.attendance_date ?
                      new Date(selectedEmployeeAppeal.attendance_date).toLocaleDateString() : ''}
                  </div>
                </div>
                <div className="stat">
                  <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Requested Status</div>
                  <div className={`stat-value text-base capitalize ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                    {selectedEmployeeAppeal.requested_status}
                  </div>
                </div>
              </div>

              {/* Time Details */}
              <div className={`collapse collapse-arrow ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`}>
                <input type="checkbox" defaultChecked />
                <div className={`collapse-title font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  Time Details
                </div>
                <div className="collapse-content">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Original Check-in</p>
                      <p className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {selectedEmployeeAppeal.original_check_in ?
                          new Date(selectedEmployeeAppeal.original_check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                          'Not recorded'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Original Check-out</p>
                      <p className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {selectedEmployeeAppeal.original_check_out ?
                          new Date(selectedEmployeeAppeal.original_check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                          'Not recorded'}
                      </p>
                    </div>
                  </div>

                  <div className={`divider ${theme === 'light' ? '' : 'divider-neutral'}`}></div>

                  <div className="grid grid-cols-2 gap-3">
                    {isEditingAppeal ? (
                      <>
                        <div>
                          <label className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Requested Check-in</label>
                          <input
                            type="time"
                            name="requestedCheckIn"
                            value={editedAppealData.requestedCheckIn}
                            onChange={handleEditChange}
                            className={`input input-bordered input-sm w-full mt-1 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                          />
                        </div>
                        <div>
                          <label className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Requested Check-out</label>
                          <input
                            type="time"
                            name="requestedCheckOut"
                            value={editedAppealData.requestedCheckOut}
                            onChange={handleEditChange}
                            className={`input input-bordered input-sm w-full mt-1 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Requested Check-in</p>
                          <p className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            {selectedEmployeeAppeal.requested_check_in ?
                               format(new Date(selectedEmployeeAppeal.requested_check_in), 'hh:mm a') :
                              '--:--'}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Requested Check-out</p>
                          <p className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            {selectedEmployeeAppeal.requested_check_out ?
                              format(new Date(selectedEmployeeAppeal.requested_check_out), 'hh:mm a') :
                              '--:--'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason for Appeal */}
              <div className={`collapse collapse-arrow ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`}>
                <input type="checkbox" defaultChecked />
                <div className={`collapse-title font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  Reason for Appeal
                </div>
                <div className="collapse-content">
                  {isEditingAppeal ? (
                    <div>
                      <label className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Reason</label>
                      <textarea
                        name="reason"
                        value={editedAppealData.reason}
                        onChange={handleEditChange}
                        className={`textarea textarea-bordered w-full mt-1 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                        rows={3}
                      ></textarea>
                    </div>
                  ) : (
                    <p className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedEmployeeAppeal.reason}</p>
                  )}
                </div>
              </div>

              {/* Admin Response - Only show if not pending */}
              {selectedEmployeeAppeal.appeal_status !== 'pending' && (
                <div className={`collapse collapse-arrow ${selectedEmployeeAppeal.appeal_status === 'approved' 
                  ? (theme === 'light' ? 'bg-green-50' : 'bg-green-900/20') 
                  : (theme === 'light' ? 'bg-red-50' : 'bg-red-900/20')
                  }`}>
                  <input type="checkbox" defaultChecked />
                  <div className={`collapse-title font-medium ${selectedEmployeeAppeal.appeal_status === 'approved' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    Admin Response
                  </div>
                  <div className="collapse-content">
                    <p className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                      {selectedEmployeeAppeal.admin_comment ?
                        selectedEmployeeAppeal.admin_comment :
                        (selectedEmployeeAppeal.appeal_status === 'approved'
                          ? 'Your appeal has been approved.'
                          : selectedEmployeeAppeal.appeal_status === 'rejected'
                            ? 'Your appeal has been rejected.'
                            : 'Your appeal has been cancelled.')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - with edit/cancel options for pending appeals */}
            <div className="modal-action">
              {selectedEmployeeAppeal.appeal_status === 'pending' && (
                <>
                  {isEditingAppeal ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditingAppeal(false)}
                        className={`btn btn-outline btn-sm ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Cancel Edit
                      </button>
                      <button
                        onClick={saveAppealChanges}
                        className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={cancelAppeal}
                        className="btn btn-error btn-sm"
                      >
                        Request Cancellation
                      </button>
                      <button
                        onClick={toggleEditMode}
                        className="btn btn-warning btn-sm"
                      >
                        Edit Appeal
                      </button>
                    </div>
                  )}
                </>
              )}
              <form method="dialog">
                <button onClick={() => setIsEmployeeAppealViewModalOpen(false)} className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}>
                  {selectedEmployeeAppeal.appeal_status === 'pending' && isEditingAppeal ? 'Close Without Saving' : 'Close'}
                </button>
              </form>
            </div>
          </div>
          <div className="modal-backdrop" onClick={(e) => e.preventDefault()}>
            {/* Prevent closing when clicking backdrop */}
          </div>
        </dialog>
      )}

      {/* Bulk Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkConfirmModal}
        title={`Bulk ${pendingBulkAction === 'approve' ? 'Approve' : 'Reject'} Appeals`}
        message={`Are you sure you want to ${pendingBulkAction} ${selectedAppeals.length} appeal(s)? This action cannot be undone.`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={executeBulkAction}
        onCancel={cancelBulkAction}
        isLoading={bulkLoading}
        confirmButtonClass={pendingBulkAction === 'approve' ? 'btn-success' : 'btn-error'}
      />
    </div>
  );
} 
