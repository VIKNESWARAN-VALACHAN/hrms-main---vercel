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
import { parse, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const SG_TZ = 'Asia/Kuala_Lumpur';



// Always produce a YYYY-MM-DD key in Singapore time
const ymdSG = (d: Date | string) => {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return formatInTimeZone(dateObj, SG_TZ, 'yyyy-MM-dd');
};

function makeDateAt(ymd: string, hm?: string): Date | undefined {
  if (!hm) return undefined;
  const d = parse(hm, 'HH:mm', new Date(`${ymd}T00:00:00`));
  return isValid(d) ? d : undefined;
}

// Singapore timezone
const timeZone = 'Asia/Kuala_Lumpur';


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

// Add to your existing interfaces
enum OvertimeStatus {
  PENDING = 'pending',
  PENDING_SUPERVISOR = 'pending_supervisor',
  PENDING_MANAGER = 'pending_manager', 
  PENDING_ADMIN = 'pending_admin',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}
enum OvertimeType {
  WEEKDAY = 'weekday',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday',
  PUBLIC_HOLIDAY = 'public_holiday'
}



interface OvertimeRequest {
  ot_request_id: number;
  employee_id: number;
  attendance_day_id: number;
  ot_date: string;
  total_worked_minutes: number;
  regular_minutes: number;
  ot_minutes: number;
  ot_type: OvertimeType;
  calculated_ot_hours: string;
  calculated_amount: string;
  status: OvertimeStatus;
  first_approver_id: number | null;
  first_approval_date: string | null;
  first_approval_comment: string | null;
  second_approver_id: number | null;
  second_approval_date: string | null;
  second_approval_comment: string | null;
  third_approver_id: number | null;
  third_approval_date: string | null;
  third_approval_comment: string | null;
  rejection_reason: string | null;
  rejected_by: number | null;
  rejected_at: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  attendance_date: string;
  first_approver_name: string | null;
  second_approver_name: string | null;
  third_approver_name: string | null;
  breakdown: OvertimeBreakdownItem[];
  // Additional fields for display
  employee_name?: string;
  department_name?: string;
  company_name?: string;
  current_approver?: string;
    _justUpdated?: boolean; 
    approval_history?: ApprovalHistoryItem[];
      // NEW: Add these missing properties
  employee_no?: string;
  current_approval_level?: string;
  user_contribution?: string;
  user_action?: string;
  requester_name?: string;
  requester_employee_no?: string;
}

interface ApprovalHistoryItem {
  level: string;
  approver: string;
  date: string | null;
  status: 'approved' | 'rejected' | 'pending';
  comment?: string;
}
interface OvertimeBreakdownItem {
  breakdown_id: number;
  rate_type: string;
  rate_multiplier: string;
  minutes: number;
  hours: string;
  amount: string;
  time_period: string;
}

interface OvertimeFormData {
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
  type: OvertimeType;
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
  employee_timezone?: string | null;
  worked_hours?: string;
  check_in_ip?: string;
  check_in_public_ip?: string;
  check_in_ip_match_status?: string;
  check_in_ip_policy_mode?: string;
  check_out_ip?: string;
  check_out_public_ip?: string;
  check_out_ip_match_status?: string;
  check_out_ip_policy_mode?: string;
  office_name?: string;
  whitelisted_cidr?: string;
  
  // Export-related fields
  amended_status?: string;
  amended_by?: string;
  amended_date?: string;
  
  // Raw data for debugging
  _raw?: any;
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
interface AppealRequestData1 {
  employeeId: number | null;
  attendanceDayId: number | null;
  date: string;
  originalCheckIn: string | null;
  originalCheckOut: string | null;
  originalCheckInFormatted: string | null;
  originalCheckOutFormatted: string | null;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: string;
}

// Update your AppealRequestData interface
interface AppealRequestData {
  employeeId: number | null;
  attendanceDayId: number | null;
  date: string;
  originalCheckIn: Date | null;
  originalCheckOut: Date | null;
  originalCheckInFormatted?: string | null; // Make optional or remove if not needed
  originalCheckOutFormatted?: string | null; // Make optional or remove if not needed
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: string;
}

type Employee = { time_zone: string };


export default function AttendancePage() { 

// Add these loading states
const [isLoading, setIsLoading] = useState(false);
const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
const [isAppealLoading, setIsAppealLoading] = useState(false);
const [isAmendLoading, setIsAmendLoading] = useState(false);
const [isFilterLoading, setIsFilterLoading] = useState(false);
const [isExportLoading, setIsExportLoading] = useState(false);
// ==================== LOADING COMPONENTS ====================


// Spinner Loading Component
const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...',
  theme = 'light'
}: {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  theme?: 'light' | 'dark';
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-6">
      <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${
        theme === 'light' ? 'border-blue-600' : 'border-blue-400'
      }`}></div>
      {text && (
        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Button Loading Component
const LoadingButton = ({ 
  loading, 
  children, 
  ...props 
}: any) => (
  <button {...props} disabled={loading}>
    {loading ? (
      <>
        <span className="loading loading-spinner loading-sm mr-2"></span>
        Loading...
      </>
    ) : (
      children
    )}
  </button>
);

// Add these states to your existing useState declarations
const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([]);
const [selectedOvertime, setSelectedOvertime] = useState<OvertimeRequest | null>(null);
const [overtimeBreakdown, setOvertimeBreakdown] = useState<OvertimeBreakdownItem[] | null>(null);

const [isOvertimeApplyModalOpen, setIsOvertimeApplyModalOpen] = useState(false);
const [selectedOvertimeForApply, setSelectedOvertimeForApply] = useState<OvertimeRequest | null>(null);
const [isApplyingOvertime, setIsApplyingOvertime] = useState(false);

const DEBUG = true;
const log = (...a: any[]) => DEBUG && console.log('[attHist]', ...a);

 const [employee, setEmployee] = useState<Employee | null>(null);
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
  // const [activeTab, setActiveTab] = useState(() => {
  //   const tabParam = searchParams.get('tab');
  //   return tabParam === 'attendance' ? 'attendance' : tabParam === 'appeal' ? 'appeal' : tabParam === 'amend' ? 'amend' : 'overview';
  // });
  const [activeTab, setActiveTab] = useState(() => {
  const tabParam = searchParams.get('tab');
  return tabParam === 'attendance' ? 'attendance' : 
         tabParam === 'appeal' ? 'appeal' : 
         tabParam === 'amend' ? 'amend' : 
         tabParam === 'overtime' ? 'overtime' : 'overview';
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
  const [filters, setFilters] = useState<Record<string, string>>(() => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return {
    fromDate: today,
    toDate: today
  };
});
  //const [filters, setFilters] = useState<Record<string, string>>({});
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
  
// Add these states for overtime approval workflow
const [pendingApprovals, setPendingApprovals] = useState<OvertimeRequest[]>([]);
const [approvalHistory, setApprovalHistory] = useState<OvertimeRequest[]>([]);
//const [overtimeView, setOvertimeView] = useState<'myRecords' | 'pendingApprovals' | 'approvalHistory'>('myRecords');
const [isProcessingApproval, setIsProcessingApproval] = useState(false);
const [approvalComment, setApprovalComment] = useState('');
const [selectedOvertimeForApproval, setSelectedOvertimeForApproval] = useState<OvertimeRequest | null>(null);


// Add to your existing overtime states
const [overtimeView, setOvertimeView] = useState<'myRecords' | 'pendingApprovals' | 'approvalHistory'>('myRecords');
const [approvalHistoryType, setApprovalHistoryType] = useState<'all' | 'approved' | 'rejected'>('all');
const [isLoadingOvertime, setIsLoadingOvertime] = useState(false);
const [overtimePagination, setOvertimePagination] = useState({
  page: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 10
});
// Add these states for overtime pagination
const [overtimePage, setOvertimePage] = useState(1);
const [overtimeFilter, setOvertimeFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
const [overtimeRecordsPerPage] = useState(10);

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


  useEffect(() => {
  if (!employeeId) return;
  (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.employees}/${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch employee');
      const data = await res.json();
      setEmployee({ time_zone: data.time_zone || timeZone });
    } catch (e) {
      console.error('Error fetching employee for timezone:', e);
      setEmployee({ time_zone: timeZone }); // fallback
    }
  })();
  }, [employeeId]);

  const fetchTodayAttendanceWORK = async () => {
    try {
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      const res = await fetch(`${API_BASE_URL}${API_ROUTES.todayAttendance}?employee_id=${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch today attendance');

      const payload = await res.json();

      // Normalize shape (array | object)
      const root = Array.isArray(payload) ? payload[0] : payload;
      const rows: any[] = Array.isArray(root?.attendanceDayRows) ? root.attendanceDayRows : [];

      // Convert rows into sessions using UTC parsing
      const mapped = rows.map((r: any) => {
        const id = String(r.id ?? r.attendance_day_id ?? Math.random().toString(36).slice(2));

        // Use the local ISO fields from backend
        const ci = parseApiDateUTC(
          r.first_check_in_time_local_iso ?? 
          r.first_check_in_time ?? 
          r.clock_in ?? 
          null
        );

        const co = parseApiDateUTC(
          r.last_check_out_time_local_iso ?? 
          r.last_check_out_time ?? 
          r.clock_out ?? 
          null
        );

        return { id, checkIn: ci, checkOut: co };
      }).filter(s => s.checkIn); // keep only sessions with a check-in

      setSessions(mapped);

      // Determine checked-in status
      const inferred = rows.some((r: any) => {
        const ci = r.first_check_in_time_local_iso ?? r.first_check_in_time ?? r.clock_in;
        const co = r.last_check_out_time_local_iso ?? r.last_check_out_time ?? r.clock_out;
        return ci && !co;
      });
      
      const isCheckedIn = typeof root?.isCheckedIn === 'boolean' ? root.isCheckedIn : inferred;

      // Latest session to show in the header card
      const last = mapped.length ? mapped[mapped.length - 1] : null;

      setTodayAttendance({
        isCheckedIn,
        checkInTime: last?.checkIn ?? null,
        checkOutTime: last?.checkOut ?? null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance');
      console.error('Error fetching today attendance:', err);
    }
  };

  
  const fetchTodayAttendance = async () => {
    try {
      // 1) Guard
      if (!employeeId) {
        const msg = 'Employee ID is not available. Please refresh the page or log in again.';
        log('no employeeId');
        setError(msg);
        return;
      }

      // 2) Request
      const url = `${API_BASE_URL}${API_ROUTES.todayAttendance}?employee_id=${employeeId}`;
      log('GET', url);
      const res = await fetch(url);
      log('status', res.status, res.ok ? 'OK' : 'NOT OK');
      if (!res.ok) throw new Error('Failed to fetch today attendance');

      // 3) Parse + shape
      const payload = await res.json();
      const root = Array.isArray(payload) ? payload[0] : payload;
      const rowsFromDay = Array.isArray(root?.attendanceDayRows) ? root.attendanceDayRows : null;
      const rowsFromSessions = Array.isArray(root?.sessions) ? root.sessions : null;
      const rows: any[] = rowsFromDay ?? rowsFromSessions ?? [];

      log('payload type:', Array.isArray(payload) ? 'array' : typeof payload);
      log('rows source:', rowsFromDay ? 'attendanceDayRows' : rowsFromSessions ? 'sessions' : 'none');
      log('rows count:', rows.length);
      if (rows.length) log('first row keys:', Object.keys(rows[0]));

      // 4) Map rows -> sessions
      const mapped = rows
        .map((r: any) => {
          const id = String(r.id ?? r.attendance_day_id ?? Math.random().toString(36).slice(2));
          const ci = parseApiDateUTC(
            r.first_check_in_time_local_iso ?? r.first_check_in_time ?? r.clock_in ?? null
          );
          const co = parseApiDateUTC(
            r.last_check_out_time_local_iso ?? r.last_check_out_time ?? r.clock_out ?? null
          );
          return { id, checkIn: ci, checkOut: co };
        })
        .filter(s => s.checkIn);

      setSessions(mapped);
      log('mapped sessions:', mapped.length);
      if (mapped.length) {
        console.table(
          mapped.slice(0, 5).map(s => ({
            id: s.id,
            checkIn: s.checkIn ? s.checkIn.toISOString() : '',
            checkOut: s.checkOut ? s.checkOut.toISOString() : '',
          }))
        );
      }

      // 5) Determine check-in status
      const inferred = rows.some((r: any) => {
        const ci = r.first_check_in_time_local_iso ?? r.first_check_in_time ?? r.clock_in;
        const co = r.last_check_out_time_local_iso ?? r.last_check_out_time ?? r.clock_out;
        return ci && !co;
      });
      const isCheckedIn = typeof root?.isCheckedIn === 'boolean' ? root.isCheckedIn : inferred;

      const last = mapped.length ? mapped[mapped.length - 1] : null;
      setTodayAttendance({
        isCheckedIn,
        checkInTime: last?.checkIn ?? null,
        checkOutTime: last?.checkOut ?? null,
      });

      log('isCheckedIn:', isCheckedIn, 'last ci/co:', {
        ci: last?.checkIn?.toISOString() ?? '',
        co: last?.checkOut?.toISOString() ?? '',
      });
    } catch (err: any) {
      log('caught error:', err?.message || err);
      setError(err instanceof Error ? err.message : 'Failed to load attendance');
      console.error('Error fetching today attendance:', err);
    }
  };

  // Robust UTC date parser for API responses
  function parseApiDateUTC(input: Date | string | null | undefined): Date | null {
    if (!input) return null;
    if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

    const s = String(input).trim();
    
    // Already has timezone info? (Z or +HH:MM / -HH:MM)
    if (/Z$|[+\-]\d\d:?\d\d$/.test(s)) {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    
    // Treat naive "YYYY-MM-DD HH:mm:ss" as UTC
    const isoUtc = s.replace(' ', 'T') + 'Z';
    const d = new Date(isoUtc);
    return isNaN(d.getTime()) ? null : d;
  }

  // Consistent time display function - uses employee's timezone
  const displayTime = (date: Date | string | null): string => {
    if (!date) return '--:--';
   
    const d = parseApiDateUTC(date);
     console.warn("OK : " + d);
    if (!d) return '--:--';
    
    // Get employee timezone or fallback to Singapore
    const employeeTimezone = employee?.time_zone || timeZone;
   
    // Format in the employee's timezone
    return formatInTimeZone(d, employeeTimezone, 'hh:mm a');
  };

const displayTimeTZ = (date: Date | string | null, timezone?: string | null): string => {
  if (!date) return '--:--';
  
  try {
    const d = parseApiDateUTC(date);
    if (!d) return '--:--';
    
    // Use provided timezone or fallback to employee timezone or Singapore
    const targetTimezone = timezone || employee?.time_zone || timeZone;
    
    // Ensure targetTimezone is always a valid string
    const validTimezone = targetTimezone || timeZone;
    
    // Format in the specified timezone
    return formatInTimeZone(d, validTimezone, 'hh:mm a');
  } catch (error) {
    console.error('Error formatting time with timezone:', error);
    return '--:--';
  }
};

// Add these helper functions to show raw UTC times
const displayRawTime = (datetime: Date | string | null) => {
  if (!datetime) return '--:--';
  
  try {
    // If it's a Date object, convert to ISO string first
    const dateString = typeof datetime === 'string' ? datetime : datetime.toISOString();
    
    // Extract just the time part from "YYYY-MM-DD HH:MM:SS" or ISO string
    if (dateString.includes('T')) {
      // ISO format: "2025-10-02T08:00:00.000Z"
      return dateString.split('T')[1]?.substring(0, 5) || '--:--';
    } else {
      // Database format: "2025-10-02 08:00:00"
      return dateString.split(' ')[1]?.substring(0, 5) || '--:--';
    }
  } catch (error) {
    console.error('Error extracting raw time:', error);
    return '--:--';
  }
};

const displayRawDateOnly = (datetimeString: string) => {
  if (!datetimeString) return '';
  // Extract just the date part from "YYYY-MM-DD HH:MM:SS"
  return datetimeString.split(' ')[0] || '';
};

  // Date display function
  const displayDateTime = (date: Date | string | null): string => {
    if (!date) return '--';
    
    const d = parseApiDateUTC(date);
    if (!d) return '--';
    
    const employeeTimezone = employee?.time_zone || timeZone;
    return formatInTimeZone(d, employeeTimezone, 'dd/MM/yyyy hh:mm a');
  };


  async function getPublicIpClientSide(opts?: { timeoutMs?: number }): Promise<string | null> {
  const timeoutMs = opts?.timeoutMs ?? 3000;

  // ✅ IPv4-ONLY providers (no CORS proxies needed)
  const providers: Array<{
    url: string;
    parse: (r: any) => string | null;
  }> = [
    // IPv4-specific providers (most reliable)
    {
      url: 'https://api4.ipify.org?format=json',
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
    {
      url: 'https://ipv4.icanhazip.com/',
      parse: (j) => (typeof j === 'string' ? j.trim() : null),
    },
    {
      url: 'https://checkip.amazonaws.com/',
      parse: (j) => (typeof j === 'string' ? j.trim() : null),
    },
    // Fallback providers
    {
      url: 'https://api.ipify.org?format=json',
      parse: (j) => (typeof j?.ip === 'string' ? j.ip : null),
    },
  ];

  // ✅ STRICT IPv4 validation only
  const isValidIPv4 = (ip: string) => {
    if (!ip || typeof ip !== 'string') return false;
    
    const cleanIp = ip.trim();
    const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    
    if (!ipv4Pattern.test(cleanIp)) {
      console.warn(`[public-ip] Not IPv4: ${cleanIp}`);
      return false;
    }
    
    // Validate each octet is between 0-255
    const octets = cleanIp.split('.');
    const isValid = octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255 && octet === num.toString();
    });
    
    if (!isValid) {
      console.warn(`[public-ip] Invalid IPv4 octets: ${cleanIp}`);
    }
    
    return isValid;
  };

  const fetchWithTimeout = async (url: string): Promise<any | null> => {
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { 
        signal: ctrl.signal, 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        }
      });
      
      if (!res.ok) {
        console.warn(`[public-ip] HTTP ${res.status} from: ${url}`);
        return null;
      }
      
      const ct = res.headers.get('content-type') || '';
      
      // Handle text responses (like icanhazip, checkip.amazonaws.com)
      if (ct.includes('text/plain')) {
        const text = (await res.text()).trim();
        console.log(`[public-ip] Text response from ${url}: "${text}"`);
        return text;
      }
      
      // Handle JSON responses
      if (ct.includes('application/json')) {
        const data = await res.json();
        console.log(`[public-ip] JSON response from ${url}:`, data);
        return data;
      }
      
      // Fallback: try to parse as text
      const text = (await res.text()).trim();
      console.log(`[public-ip] Fallback text from ${url}: "${text}"`);
      return text;
      
    } catch (err: any) {
      console.warn(`[public-ip] Failed to fetch from ${url}:`, err.message);
      return null;
    } finally {
      clearTimeout(tm);
    }
  };

  console.log('[public-ip] Starting IPv4 detection...');
  
  for (const p of providers) {
    try {
      console.log(`[public-ip] Trying provider: ${p.url}`);
      const payload = await fetchWithTimeout(p.url);
      const ip = payload ? p.parse(payload) : null;
      
      if (ip && isValidIPv4(ip)) {
        console.log(`[public-ip] ✅ SUCCESS - IPv4 found: ${ip} from ${p.url}`);
        return ip;
      } else if (ip) {
        console.warn(`[public-ip] ❌ Not IPv4 from ${p.url}: ${ip}`);
      } else {
        console.warn(`[public-ip] ❌ No IP from ${p.url}`);
      }
    } catch (err) {
      console.warn(`[public-ip] ❌ Provider failed: ${p.url}`, err);
    }
  }

  console.error('[public-ip] ❌ All IPv4 providers failed');
  return null;
}

  

  async function getPublicIpClientSide2511(opts?: { timeoutMs?: number }): Promise<string | null> {
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

  const displayDateOnly = (date: Date | string | null): string => {
    if (!date) return '--';
    
    const d = parseApiDateUTC(date);
    if (!d) return '--';
    
    const employeeTimezone = employee?.time_zone || timeZone;
    return formatInTimeZone(d, employeeTimezone, 'dd/MM/yyyy');
  };

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


  const applyAttendanceFilters_1 = async (filter: Record<string, string>) => {
    const filtersQuery = filter || filters;

  const finalFilters = { ...filtersQuery };
  if (!finalFilters.fromDate && !finalFilters.toDate && activeTab === 'attendance') {
    const today = format(new Date(), 'yyyy-MM-dd');
    finalFilters.fromDate = today;
    finalFilters.toDate = today;
  }

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
    await fetchAttendanceFilterData(activeTab, finalFilters);
    //await fetchAttendanceFilterData(activeTab, filtersQuery);
    // Fetch appeal data if on appeal tab
    if (activeTab === 'appeal') {
      await fetchAppealData(filtersQuery);
    }
  };

  const applyAttendanceFilters = async (filter: Record<string, string>) => {
  const filtersQuery = filter || filters;
  
  // Set default to today if no dates provided
  const finalFilters = { ...filtersQuery };
  if (!finalFilters.fromDate && !finalFilters.toDate && activeTab === 'attendance') {
    const today = format(new Date(), 'yyyy-MM-dd');
    finalFilters.fromDate = today;
    finalFilters.toDate = today;
  }

  // Validate search term
  if (searchTerm && searchTerm.length === 1) {
    setError('Please enter at least 2 characters for search');
    return;
  }

  // Basic date validation
  if (filtersQuery.fromDate && filtersQuery.toDate) {
    const startDate = new Date(filtersQuery.fromDate);
    const endDate = new Date(filtersQuery.toDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Please enter valid dates');
      return;
    }

    if (startDate > endDate) {
      setError('Start date cannot be after end date');
      return;
    }
  }

  // Set loading states
  setIsFilterLoading(true);
  setIsLoading(true);
  
  // Set specific tab loading state
  if (activeTab === 'attendance') {
    setIsAttendanceLoading(true);
  } else if (activeTab === 'appeal') {
    setIsAppealLoading(true);
  } else if (activeTab === 'amend') {
    setIsAmendLoading(true);
  }

  // Clear any previous errors before fetching
  setError('');
  
  try {
    await fetchAttendanceFilterData(activeTab, finalFilters);
    
    // Fetch appeal data if on appeal tab
    if (activeTab === 'appeal') {
      await fetchAppealData(filtersQuery);
    }
  } catch (error) {
    console.error('Error applying filters:', error);
    setError('Failed to apply filters');
  } finally {
    setIsFilterLoading(false);
    setIsLoading(false);
    setIsAttendanceLoading(false);
    setIsAppealLoading(false);
    setIsAmendLoading(false);
  }
};

  // Update the fetchAttendanceFilterData function to include company filter
  const fetchAttendanceFilterData1 = async (currentTab = activeTab, filters: Record<string, string> | any) => {
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
        amended_status: item.amend_by ? 'Amended' : 'Original',
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


const fetchAttendanceFilterData = async (currentTab = activeTab, filters: Record<string, string> | any) => {
  if (role !== 'admin') {
    return;
  }

  try {
    setIsLoading(true);
    if (currentTab === 'attendance') {
      setIsAttendanceLoading(true);
    } else if (currentTab === 'amend') {
      setIsAmendLoading(true);
    }

    let queryParams = new URLSearchParams();

    // Add search field for employee name if at least 2 characters
    if (searchTerm && searchTerm.length >= 2) {
      queryParams.append('employee_name', searchTerm);
    }

    // Add company filter
    if (filters.company && filters.company !== '') {
      queryParams.append('company_id', filters.company);
    }

    // Add status filter if provided
    if (filters.status && filters.status !== '') {
      queryParams.append('status', filters.status);
    }

    // Add date filters (today by default)
    if (filters.fromDate && filters.toDate) {
      queryParams.append('start_date', filters.fromDate);
      queryParams.append('end_date', filters.toDate);
    } else {
      // Default to today if no dates provided
      const today = new Date().toISOString().split('T')[0];
      queryParams.append('start_date', today);
      queryParams.append('end_date', today);
    }

    if(filters.department && filters.department !== ''){
      queryParams.append('department_id', filters.department);
    }

    // Build URL with query parameters
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${API_BASE_URL}${API_ROUTES.attendanceData}${queryString}`;

    const response = await fetch(url);
    console.log("URL - " + url);
    const data = await response.json();

    console.log('Today\'s attendance data with IP:', data);


    let amendedData = data.map((item: any) => {
      // Always prefer the ISO times if available
      const checkInTime = item.first_check_in_time_local_iso || item.check_in_time;
      const checkOutTime = item.last_check_out_time_local_iso || item.check_out_time;
      
    console.log('Raw API response item with IP:', {
      employee: item.employee_name,
      date: item.attendance_date,
      check_in_ip: item.check_in_ip, // This should show internal IP
      check_in_public_ip: item.check_in_public_ip, // This should show public IP
      check_out_ip: item.check_out_ip, // This should show internal IP
      check_out_public_ip: item.check_out_public_ip, // This should show public IP
    });

      return {
        id: item.employee_no,
        employee_name: item.employee_name,
        company_name: item.company_name,
        department_name: item.department,
        date: item.attendance_date,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        status: item.status.toLowerCase(),
        attendance_day_id: item.attendance_day_id,
        employee_id: item.employee_id,
        amend_date: item.amend_date,
        amend_by: item.amend_by,
        employee_timezone: item.employee_timezone || timeZone,
        // Add worked hours
        worked_hours: item.worked_hours || '0.00',
        // Add amended status field for export
        amended_status: item.amend_date ? 'Amended' : 'Original',
        amended_by: item.amend_by || '',
        amended_date: item.amend_date || '',
        // FIX: Store internal and public IPs separately
        check_in_ip: item.check_in_ip || '', // Internal IP
        check_in_public_ip: item.check_in_public_ip || '', // Public IP
        check_out_ip: item.check_out_ip || '', // Internal IP  
        check_out_public_ip: item.check_out_public_ip || '', // Public IP
        check_in_ip_match_status: item.check_in_ip_match_status || '',
        check_in_ip_policy_mode: item.check_in_ip_policy_mode || '',
        check_out_ip_match_status: item.check_out_ip_match_status || '',
        check_out_ip_policy_mode: item.check_out_ip_policy_mode || '',
        office_name: item.office_name || '',
        // Keep raw data for debugging
        _raw: item
      };
    });

    if(currentTab === 'amend'){
      amendedData = amendedData.filter((item: any) => item.status.toLowerCase() === 'absent' || item.status.toLowerCase() === 'offday');
    }

    setAmendAttendanceData(amendedData);
  } catch (err) {
    console.error('Error fetching attendance filter data:', err);
  } finally {
    setIsLoading(false);
    setIsAttendanceLoading(false);
    setIsAmendLoading(false);
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
  const fetchAttendanceHistoryWORK = async (start?: Date, end?: Date) => {
    try {
      // Check if we have the employee ID before making the request
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      // Use the employee ID from state
      let url = `${API_BASE_URL}${API_ROUTES.attendanceHistory}?employee_id=${employeeId}`;

      // if (start && end) {
      //   const startDate = format(toSingaporeTime(start!), 'yyyy-MM-dd');
      //   const endDate = format(toSingaporeTime(end!), 'yyyy-MM-dd');
      //   url += `&start_date=${startDate}&end_date=${endDate}`;
      // }
          if (start && end) {
      const employeeTimezone = employee?.time_zone || timeZone;
      const startDate = formatInTimeZone(start, employeeTimezone, 'yyyy-MM-dd');
      const endDate = formatInTimeZone(end, employeeTimezone, 'yyyy-MM-dd');
      url += `&start_date=${startDate}&end_date=${endDate}`;
    }

    console.log("URL : "+ url);
      const response = await fetch(url);


      if (!response.ok) throw new Error('Failed to fetch attendance history');

      const data = await response.json();

      console.log("TEST : "+ data);
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
          const employeeTimezone = employee?.time_zone || timeZone;
          const zonedCheckInDate = toZonedTime(checkInDate, employeeTimezone);
          date = parseISO(formatInTimeZone(zonedCheckInDate, employeeTimezone, 'yyyy-MM-dd'));
          
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
        first_checkIn: record.first_check_in_day ? displayTime(record.first_check_in_day) : '',
        last_checkOut: record.last_check_out_day ? displayTime(record.last_check_out_day) : '',
        appealStatus: record.appeal_status || ''
      };
    });

      setAttendanceRecords(formattedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance history');
      console.error('Error fetching attendance history:', err);
    }
  };

const fetchAttendanceHistory = async (start?: Date, end?: Date) => {
  try {
    // 1) Guard
    if (!employeeId) {
      const msg = 'Employee ID is not available. Please refresh the page or log in again.';
      log('no employeeId');
      setError(msg);
      return;
    }

    // 2) Build URL + date range (in employee TZ)
    const tz = employee?.time_zone || timeZone || 'Asia/Singapore';
    let url = `${API_BASE_URL}${API_ROUTES.attendanceHistory}?employee_id=${employeeId}`;

    if (start && end) {
      try {
        const startDate = formatInTimeZone(start, tz, 'yyyy-MM-dd');
        const endDate = formatInTimeZone(end, tz, 'yyyy-MM-dd');
        url += `&start_date=${startDate}&end_date=${endDate}`;
        log('range', { tz, start: startDate, end: endDate });
      } catch (e) {
        log('range format failed; continuing without range', e);
      }
    } else {
      log('no range provided');
    }

    log('GET', url);

    // 3) Request
    const res = await fetch(url);
    log('status', res.status, res.ok ? 'OK' : 'NOT OK');

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      log('error body (first 300):', body.slice(0, 300));
      throw new Error(`Failed to fetch attendance history (${res.status})`);
    }

    // 4) Parse + shape check
    const data = await res.json();
    if (!Array.isArray(data)) {
      log('unexpected payload (not array):', data);
      setError('Unexpected response format from server');
      return;
    }

    log('rows:', data.length);
    if (data.length) log('first row keys:', Object.keys(data[0]));

    // 5) Map records (keep logic same, just tidy)
    // const formatted: AttendanceRecord[] = data.map((rec: any) => {
    //   let date: Date;
    //   let checkIn: Date | undefined;
    //   let checkOut: Date | undefined;

    //   if (rec.attendance_date || rec.first_check_in_time) {
    //     // new format
    //     date = new Date(rec.attendance_date || rec.first_check_in_time);
    //     checkIn = rec.first_check_in_time ? new Date(rec.first_check_in_time) : undefined;
    //     checkOut = rec.last_check_out_time ? new Date(rec.last_check_out_time) : undefined;
    //   } else {
    //     // old format
    //     const ci = rec.clock_in ? new Date(rec.clock_in) : undefined;
    //     const dayStr = ci ? formatInTimeZone(ci, tz, 'yyyy-MM-dd') : undefined;
    //     date = dayStr ? new Date(dayStr) : new Date();
    //     checkIn = ci;
    //     checkOut = rec.clock_out ? new Date(rec.clock_out) : undefined;
    //   }

    //   const status =
    //     rec.status_name?.toLowerCase?.() ??
    //     ({ 1: 'present', 2: 'absent', 3: 'late', 4: 'partial', 5: 'offday' } as any)[rec.status_id] ??
    //     (typeof determineStatus === 'function'
    //       ? determineStatus(rec.first_check_in_time ?? rec.clock_in, rec.last_check_out_time ?? rec.clock_out)
    //       : 'partial');

    //   return {
    //     date,
    //     checkIn,
    //     checkOut,
    //     status,
    //     // (optional extras you already use)
    //     // @ts-ignore
    //     attendanceDayId: rec.attendance_day_id,
    //     // @ts-ignore
    //     first_checkIn: rec.first_check_in_day ? displayTime(rec.first_check_in_day) : '',
    //     // @ts-ignore
    //     last_checkOut: rec.last_check_out_day ? displayTime(rec.last_check_out_day) : '',
    //     // @ts-ignore
    //     appealStatus: rec.appeal_status || ''
    //   };
    // });

    // In fetchAttendanceHistory, replace the mapping section with:
const formatted: AttendanceRecord[] = data.map((rec: any) => {
  // Use local ISO times which are already timezone-correct
  const date = new Date(rec.attendance_date || rec.first_check_in_time_local_iso);
  const checkIn = rec.first_check_in_time_local_iso ? new Date(rec.first_check_in_time_local_iso) : undefined;
  const checkOut = rec.last_check_out_time_local_iso ? new Date(rec.last_check_out_time_local_iso) : undefined;

  const status = rec.status_name?.toLowerCase() || 'partial';

  return {
    date,
    checkIn,
    checkOut,
    status,
    attendanceDayId: rec.attendance_day_id,
    appealStatus: rec.appeal_status || ''
  };
});

    // 6) Quick peek (first 5 only)
    log('sample:');
    console.table(
      formatted.slice(0, 5).map(r => ({
        date: r.date?.toISOString()?.slice(0, 10),
        checkIn: r.checkIn ? r.checkIn.toISOString() : '',
        checkOut: r.checkOut ? r.checkOut.toISOString() : '',
        status: r.status
      }))
    );

    setAttendanceRecords(formatted);
    log('done; set records:', formatted.length);
  } catch (err: any) {
    log('caught error:', err?.message || err);
    setError(err instanceof Error ? err.message : 'Failed to load attendance history');
  }
};

  // Helper to determine status based on check-in and check-out times
  const determineStatus = (checkInTime: string, checkOutTime: string | null): 'present' | 'absent' | 'late' | 'partial' => {
    if (!checkInTime) return 'absent';

    const checkIn = parseISO(checkInTime);
    const employeeTimezone = employee?.time_zone || timeZone;
    const zonedCheckIn = toZonedTime(checkIn, employeeTimezone);
    const workStartHour = 9; // Assuming work starts at 9 AM

    // Consider late if checked in after 9:15 AM
    const hours = parseInt(format(zonedCheckIn, 'H'));
    const minutes = parseInt(format(zonedCheckIn, 'mm'));
    const isLate = hours > workStartHour || (hours === workStartHour && minutes > 15);

    if (!checkOutTime) return 'partial';

    return isLate ? 'late' : 'present';
  };

  // Update initial data fetching to wait for employeeId
  // useEffect(() => {
  //   // Only fetch data if employeeId is available
  //   if (employeeId) {
  //     fetchTodayAttendance();
  //     fetchAttendanceHistory();
  //     fetchAppealData(filters);
  //     if (role === 'admin' || role === 'manager') {
  //       fetchAttendanceStats();
  //       if (role === 'admin') {
  //         fetchCompanies(); // Fetch companies for dropdown
  //         //fetchAttendanceStatuses(); // Fetch attendance statuses
  //         applyAttendanceFilters(filters); // Load initial attendance data
  //         // Load appeal data
  //       }
  //     }
  //   }
  // }, [employeeId]); // Depend on employeeId to re-fetch when it's set

// Add to your useEffect to fetch overtime data
// In the useEffect


useEffect(() => {
  if (employeeId && activeTab === 'overtime') {
    fetchOvertimeData(1);
  }
}, [employeeId, activeTab, overtimeView, approvalHistoryType]);


// useEffect(() => {
//   if (employeeId) {
//     fetchTodayAttendance();
//     fetchAttendanceHistory();
//     fetchAppealData(filters);
//     fetchEmployeeOvertime();
//     fetchOvertimeData(); 
    
//     // Load approval data if user is an approver - UPDATED
//     if (role === 'admin' || role === 'manager' || role === 'supervisor') {
//       loadPendingApprovals();
//       loadApprovalHistory();
//     }
    
//     // UPDATED: Include supervisors in analytics access
//     if (role === 'admin' || role === 'manager' || role === 'supervisor') {
//       fetchAttendanceStats();
//       if (role === 'admin') {
//         fetchCompanies();
//         applyAttendanceFilters(filters);
//       }
//     }
//   }
// }, [employeeId]);

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
      setIsAppealLoading(true);
      setIsLoading(true);
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
     } finally {
      setIsAppealLoading(false);
      setIsLoading(false);
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

  const hasAppealForRecord = (record: AttendanceRecord): AppealData | null => {
  const employeeTimezone = employee?.time_zone || timeZone;
  const recordDate = formatInTimeZone(record.date, employeeTimezone, 'yyyy-MM-dd');
  
  return appealData.find(appeal => {
    const appealDate = new Date(appeal.attendance_date);
    const appealDateFormatted = formatInTimeZone(appealDate, employeeTimezone, 'yyyy-MM-dd');
    return appealDateFormatted === recordDate && appeal.attendance_day_id === record.attendanceDayId;
  }) || null;
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
    setEditedAppealData({
      requestedCheckIn: appeal.requested_check_in ? displayTime(appeal.requested_check_in).split(' ')[0] + ' ' + displayTime(appeal.requested_check_in).split(' ')[1] : '',
      requestedCheckOut: appeal.requested_check_out ? displayTime(appeal.requested_check_out).split(' ')[0] + ' ' + displayTime(appeal.requested_check_out).split(' ')[1] : '',
      reason: appeal.reason || ''
    });
  };

  // Function to handle edit mode toggle
  const toggleEditMode1 = () => {
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

// Function to handle edit mode toggle
// Function to handle edit mode toggle
const toggleEditModework = () => {
  if (selectedEmployeeAppeal) {
    if (!isEditingAppeal) {
      console.log('DEBUG - toggleEditMode - Entering edit mode:');
      console.log('Raw requested_check_in:', selectedEmployeeAppeal.requested_check_in);
      console.log('Raw requested_check_out:', selectedEmployeeAppeal.requested_check_out);
      
      const employeeTimezone = employee?.time_zone || timeZone;
      
      // Convert UTC times to employee timezone for editing
      let requestedCheckIn = '';
      let requestedCheckOut = '';

      if (selectedEmployeeAppeal.requested_check_in) {
        const utcDate = new Date(selectedEmployeeAppeal.requested_check_in);
        console.log('UTC date for check-in:', utcDate.toISOString());
        
        // Convert UTC to employee timezone and extract HH:mm
        requestedCheckIn = formatInTimeZone(utcDate, employeeTimezone, 'HH:mm');
        console.log('Converted to employee timezone:', requestedCheckIn);
      }

      if (selectedEmployeeAppeal.requested_check_out) {
        const utcDate = new Date(selectedEmployeeAppeal.requested_check_out);
        console.log('UTC date for check-out:', utcDate.toISOString());
        
        // Convert UTC to employee timezone and extract HH:mm
        requestedCheckOut = formatInTimeZone(utcDate, employeeTimezone, 'HH:mm');
        console.log('Converted to employee timezone:', requestedCheckOut);
      }

      console.log('Final values for inputs:', { requestedCheckIn, requestedCheckOut });

      setEditedAppealData({
        requestedCheckIn,
        requestedCheckOut,
        reason: selectedEmployeeAppeal.reason || ''
      });
    }
    setIsEditingAppeal(!isEditingAppeal);
  }
};

// Function to handle edit mode toggle
const toggleEditMode = () => {
  if (selectedEmployeeAppeal) {
    if (!isEditingAppeal) {
      // Entering edit mode - use raw times for requested times
      setEditedAppealData({
        requestedCheckIn: selectedEmployeeAppeal.requested_check_in ?
          format(new Date(selectedEmployeeAppeal.requested_check_in), 'HH:mm') : '', // displayRawTime(selectedEmployeeAppeal.requested_check_in) : '', // Use raw time
        requestedCheckOut: selectedEmployeeAppeal.requested_check_out ?
          format(new Date(selectedEmployeeAppeal.requested_check_out), 'HH:mm') : '', //displayRawTime(selectedEmployeeAppeal.requested_check_out) : '', // Use raw time
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
        const ymd = selectedEmployeeAppeal.attendance_date;
        const requestedCheckOutDate = makeDateAt(ymd, editedAppealData.requestedCheckOut);
        const requestedCheckInDate  = makeDateAt(ymd, editedAppealData.requestedCheckIn);
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

      //console.error("TET : "+ requestedCheckOut);
      // Update the local state with edited values
      // if (selectedEmployeeAppeal) {
      //   setSelectedEmployeeAppeal({
      //     ...selectedEmployeeAppeal,
      //     requested_check_in: requestedCheckInDate, //requestedCheckIn as Date | undefined,
      //     requested_check_out: requestedCheckOutDate,
      //     reason:editedAppealData.reason
      //   });
      // }
      // // Update the local state with edited values
      if (selectedEmployeeAppeal) {
        setSelectedEmployeeAppeal({
          ...selectedEmployeeAppeal,
          requested_check_in: requestedCheckIn  as Date , //requestedCheckIn as Date | undefined,
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

  // Function to save appeal changes
// Function to save appeal changes
const saveAppealChangescurrent = async () => {
  if (!selectedEmployeeAppeal) return;

  try {
    const employeeTimezone = employee?.time_zone || timeZone;
    const appealDate = new Date(selectedEmployeeAppeal.attendance_date);
    
    // Convert the edited times to proper Date objects in the employee's timezone
    const requestedCheckIn = editedAppealData.requestedCheckIn ?
      toZonedTime(new Date(`${format(appealDate, 'yyyy-MM-dd')}T${editedAppealData.requestedCheckIn}`), employeeTimezone) : 
      undefined;
    
    const requestedCheckOut = editedAppealData.requestedCheckOut ?
      toZonedTime(new Date(`${format(appealDate, 'yyyy-MM-dd')}T${editedAppealData.requestedCheckOut}`), employeeTimezone) : 
      undefined;

      

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
        requested_check_in: requestedCheckIn,
        requested_check_out: requestedCheckOut,
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
  // const openAppealRequestModal1 = (record: AttendanceRecord) => {
  

  //     const employeeTimezone = employee?.time_zone || timeZone;
  // const date = formatInTimeZone(record.date, employeeTimezone, 'yyyy-MM-dd');

  // // Format check-in/out times for form
  // const originalCheckIn = record.checkIn
  //   ? formatInTimeZone(record.checkIn, employeeTimezone, 'HH:mm')
  //   : null;

  // const originalCheckOut = record.checkOut
  //   ? formatInTimeZone(record.checkOut, employeeTimezone, 'HH:mm')
  //   : null;

  //   // Initialize form with current values
  //   setAppealRequestData({
  //     employeeId: employeeId,
  //     attendanceDayId: record.attendanceDayId,
  //     date: date,
  //     originalCheckIn: originalCheckIn,
  //     originalCheckOut: originalCheckOut,
  //     requestedCheckIn: originalCheckIn || '',
  //     requestedCheckOut: originalCheckOut || '',
  //     reason: '',
  //     status: record.status
  //   });

  //   // Reset errors
  //   setAppealRequestErrors({
  //     requestedCheckIn: '',
  //     requestedCheckOut: '',
  //     reason: ''
  //   });

  //   setIsAppealRequestModalOpen(true);
  // };

const openAppealRequestModal = (record: AttendanceRecord) => {
  const employeeTimezone = employee?.time_zone || timeZone;
  const date = formatInTimeZone(record.date, employeeTimezone, 'yyyy-MM-dd');

  // Store the original Date objects for display
  const originalCheckIn = record.checkIn || null;
  const originalCheckOut = record.checkOut || null;

  // Format times for the time inputs (HH:mm)
  const requestedCheckIn = record.checkIn
    ? formatInTimeZone(record.checkIn, employeeTimezone, 'HH:mm')
    : '';

  const requestedCheckOut = record.checkOut
    ? formatInTimeZone(record.checkOut, employeeTimezone, 'HH:mm')
    : '';

  // Initialize form with current values
  setAppealRequestData({
    employeeId: employeeId,
    attendanceDayId: record.attendanceDayId,
    date: date,
    originalCheckIn: originalCheckIn, // Date object for display
    originalCheckOut: originalCheckOut, // Date object for display
    requestedCheckIn: requestedCheckIn, // Formatted string for input
    requestedCheckOut: requestedCheckOut, // Formatted string for input
    reason: '',
    status: record.status
    // Remove originalCheckInFormatted and originalCheckOutFormatted if not needed
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
  const submitAppealRequest1 = async () => {
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
      // Replace the toSingaporeTime calls in the payload:
      const payload = {
        employee_id: appealRequestData.employeeId,
        attendance_day_id: appealRequestData.attendanceDayId,
        appeal_reason: appealRequestData.reason,
        status: statusId,
        request_check_in: appealRequestData.requestedCheckIn ? new Date(`${appealRequestData.date}T${appealRequestData.requestedCheckIn}`) : null,
        request_check_out: appealRequestData.requestedCheckOut ? new Date(`${appealRequestData.date}T${appealRequestData.requestedCheckOut}`) : null,
        original_check_in: appealRequestData.originalCheckIn ? new Date(`${appealRequestData.date}T${appealRequestData.originalCheckIn}`) : null,
        original_check_out: appealRequestData.originalCheckOut ? new Date(`${appealRequestData.date}T${appealRequestData.originalCheckOut}`) : null
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
      const employeeTimezone = employee?.time_zone || timeZone;
      
      // Convert time strings to UTC datetime strings (like check-in does)
      let requestedCheckInUTC = null;
      let requestedCheckOutUTC = null;

      if (appealRequestData.requestedCheckIn) {
        // Create datetime in employee's timezone, then convert to UTC
        const localDateTime = toZonedTime(
          new Date(`${appealRequestData.date}T${appealRequestData.requestedCheckIn}`), 
          employeeTimezone
        );
        requestedCheckInUTC = format(localDateTime, "yyyy-MM-dd'T'HH:mm:ss"); // UTC format
      }
      
      if (appealRequestData.requestedCheckOut) {
        const localDateTime = toZonedTime(
          new Date(`${appealRequestData.date}T${appealRequestData.requestedCheckOut}`), 
          employeeTimezone
        );
        requestedCheckOutUTC = format(localDateTime, "yyyy-MM-dd'T'HH:mm:ss"); // UTC format
      }

      // Convert original times to UTC format
      const originalCheckInUTC = appealRequestData.originalCheckIn 
        ? format(new Date(appealRequestData.originalCheckIn), "yyyy-MM-dd'T'HH:mm:ss") 
        : null;
      
      const originalCheckOutUTC = appealRequestData.originalCheckOut 
        ? format(new Date(appealRequestData.originalCheckOut), "yyyy-MM-dd'T'HH:mm:ss") 
        : null;

      const payload = {
        employee_id: appealRequestData.employeeId,
        attendance_day_id: appealRequestData.attendanceDayId,
        appeal_reason: appealRequestData.reason,
        status: statusId,
        request_check_in: requestedCheckInUTC, // UTC datetime
        request_check_out: requestedCheckOutUTC, // UTC datetime
        original_check_in: originalCheckInUTC, // UTC datetime
        original_check_out: originalCheckOutUTC // UTC datetime
      };

      console.log('Submitting appeal with UTC payload:', payload);

      // Make API call
      const response = await fetch(`${API_BASE_URL}/api/attendance/appeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit appeal request');
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
  const employeeTimezone = employee?.time_zone || timeZone;
  const today = new Date();
  const recordDate = formatInTimeZone(record.date, employeeTimezone, 'yyyy-MM-dd');
  const todayFormatted = formatInTimeZone(today, employeeTimezone, 'yyyy-MM-dd');
  
  return recordDate !== todayFormatted;
}).slice(indexOfFirstRecord, indexOfLastRecord);
  
  

const totalRecords = attendanceRecords.filter(record => {
  const employeeTimezone = employee?.time_zone || timeZone;
  const today = new Date();
  const recordDate = formatInTimeZone(record.date, employeeTimezone, 'yyyy-MM-dd');
  const todayFormatted = formatInTimeZone(today, employeeTimezone, 'yyyy-MM-dd');
  return recordDate !== todayFormatted;
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

async function handleExportWithLeaves1211() {
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

async function handleExportWithLeaves(exportData = amendAttendanceData) {
  try {
    setIsExporting(true);
    setIsExportLoading(true);
    const API = `${API_BASE_URL}/api/v1`;

    // date range
    const range = (() => {
      if (filters?.fromDate && filters?.toDate) {
        return { startDate: fmtLocal(filters.fromDate), endDate: fmtLocal(filters.toDate) };
      }
      const dates = (exportData ?? []).map((r: any) => r.date).filter(Boolean).sort();
      if (dates.length) return { startDate: dates[0], endDate: dates[dates.length - 1] };
      const n = new Date(), y = n.getFullYear(), m = n.getMonth();
      const last = new Date(y, m + 1, 0).getDate();
      return { startDate: `${y}-${String(m+1).padStart(2,'0')}-01`, endDate: `${y}-${String(m+1).padStart(2,'0')}-${last}` };
    })();

    // employee IDs from current table
    const empIds = Array.from(new Set(
      (exportData || []).map((r: any) => r.employee_id).filter((x: any) => Number.isFinite(x))
    ));

    const qs = new URLSearchParams();
    append(qs, 'startDate', range.startDate);
    append(qs, 'endDate', range.endDate);
    if (empIds.length) append(qs, 'employeeIds', empIds.join(','));
    append(qs, 'departmentId', filters?.department);
    append(qs, 'companyId', filters?.company);
    append(qs, 'status', filters?.status);

    const url = `${API}/leaves/history/range?${qs.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const leaves: LeaveRow[] = await res.json();

    downloadAttendanceReport(exportData, {
      includeLeaves: true,
      leaves,
      fileName: `Attendance_with_Leaves_${range.startDate}_${range.endDate}.xlsx`,
    });
  } catch (e) {
    console.error('Export with leaves failed:', e);
    downloadAttendanceReport(exportData); // fallback
    showNotification('Failed to fetch leave data. Exported attendance only.', 'error');
  } finally {
    setIsExporting(false);
    setIsExportLoading(false);
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


//*********Over time */

// Update fetchEmployeeOvertime function
// AFTER
const fetchEmployeeOvertime = async () => {
  try {
    if (!employeeId) return;

    // Admin sees all requests; others see their own
    const url = (role === 'admin')
      ? `${API_BASE_URL}/api/attendance/overtime`       // backend: getAllOvertimeRequests
      : `${API_BASE_URL}${API_ROUTES.employeeOvertime}/${employeeId}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // Both endpoints return { data: [...] }
      setOvertimeRequests(data.data || []);
    } else {
      console.error('Failed to fetch overtime data');
    }
  } catch (err) {
    console.error('Error fetching overtime data:', err);
  }
};



// Add this function to handle overtime application
const applyForOvertime = async (overtimeRequest: OvertimeRequest) => {
  try {
    
    if (!canApplyOvertimeForDate(overtimeRequest.ot_date)) {
      showNotification('Overtime applications are only allowed from the next day onwards', 'error');
      return;
    }
    setIsApplyingOvertime(true);
    
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.submitOvertime}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ot_request_id: overtimeRequest.ot_request_id,
        employee_id: employeeId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to apply for overtime');
    }

    const data = await response.json();
    
    // Update the local state to reflect the application
    setOvertimeRequests(prev => 
      prev.map(req => 
        req.ot_request_id === overtimeRequest.ot_request_id 
          ? { 
              ...req, 
              status: OvertimeStatus.PENDING,
              _justUpdated: true,
              // Update with actual approver data from response if available
              ...data.updated_request
            } 
          : req
      )
    );

    showNotification('Overtime application submitted successfully!', 'success');
    setIsOvertimeApplyModalOpen(false);
    
    // Remove highlight after delay
    setTimeout(() => {
      setOvertimeRequests(prev => 
        prev.map(req => 
          req.ot_request_id === overtimeRequest.ot_request_id 
            ? { ...req, _justUpdated: false } 
            : req
        )
      );
    }, 3000);

  } catch (error) {
    console.error('Error applying for overtime:', error);
    showNotification('Failed to apply for overtime', 'error');
  } finally {
    setIsApplyingOvertime(false);
  }
};

const canApplyOvertimeForDate = (otDate: string): boolean => {
  try {
    const employeeTimezone = employee?.time_zone || timeZone;
    const today = new Date();
    const overtimeDate = new Date(otDate);
    
    // Convert both dates to the employee's timezone for accurate comparison
    const todayInTZ = toZonedTime(today, employeeTimezone);
    const otDateInTZ = toZonedTime(overtimeDate, employeeTimezone);
    
    // Format dates to compare only the date part (without time)
    const todayFormatted = formatInTimeZone(todayInTZ, employeeTimezone, 'yyyy-MM-dd');
    const otDateFormatted = formatInTimeZone(otDateInTZ, employeeTimezone, 'yyyy-MM-dd');
    
    // Get yesterday's date in employee timezone
    const yesterday = new Date(todayInTZ);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = formatInTimeZone(yesterday, employeeTimezone, 'yyyy-MM-dd');
    
    console.log('Date check:', {
      today: todayFormatted,
      yesterday: yesterdayFormatted,
      otDate: otDateFormatted,
      canApply: otDateFormatted <= yesterdayFormatted
    });
    
    // Allow application only if overtime date is yesterday or earlier
    return otDateFormatted <= yesterdayFormatted;
  } catch (error) {
    console.error('Error checking overtime date:', error);
    return false;
  }
};

const canApplyForOvertime = (request: OvertimeRequest): boolean => {
  // First check if it's already applied or in any status
  const appliedOrFinal = new Set<OvertimeStatus>([
    OvertimeStatus.PENDING,
    OvertimeStatus.PENDING_SUPERVISOR,
    OvertimeStatus.PENDING_MANAGER,
    OvertimeStatus.PENDING_ADMIN,
    OvertimeStatus.APPROVED,
    OvertimeStatus.REJECTED,
    OvertimeStatus.CANCELLED,
  ]);
  
  // If already applied or in process, cannot apply again
  if (request.status && appliedOrFinal.has(request.status)) {
    return false;
  }
  
  // Additional check: only allow application from next day onwards
  return canApplyOvertimeForDate(request.ot_date);
};

const fetchOvertimeData = async (page = overtimePagination.page, forceRefresh = false) => {
  if (!employeeId) return;

  setIsLoadingOvertime(true);
  try {
    let url = '';
    let data = [];
    let paginationData = null;

    const limit = overtimePagination.limit;

    switch (overtimeView) {
      case 'myRecords':
        url = `${API_BASE_URL}${API_ROUTES.employeeOvertime}/${employeeId}?page=${page}&limit=${limit}`;
        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          data = result.data || [];
          paginationData = result.pagination;
        }
        setOvertimeRequests(data);
        break;

      case 'pendingApprovals':
        url = `${API_BASE_URL}/api/attendance/overtime/approval/${employeeId}?type=pending&page=${page}&limit=${limit}`;
        const pendingResponse = await fetch(url);
        if (pendingResponse.ok) {
          const pendingResult = await pendingResponse.json();
          data = pendingResult.data || [];
          paginationData = pendingResult.pagination;
        }
        setPendingApprovals(data);
        break;

        case 'approvalHistory':
          // ENSURE the action_type parameter is properly included
          url = `${API_BASE_URL}/api/attendance/overtime/approval/${employeeId}?type=history&page=${page}&limit=${overtimePagination.limit}&action_type=${approvalHistoryType}`;
          
          console.log('🔍 Fetching approval history with filter:', { 
            action_type: approvalHistoryType,
            url: url
          });
          
          const historyResponse = await fetch(url);
          if (historyResponse.ok) {
            const historyResult = await historyResponse.json();
            data = historyResult.data || [];
            paginationData = historyResult.pagination;
            
            console.log('📊 Approval history response:', {
              filter: approvalHistoryType,
              items: data.length,
              pagination: paginationData
            });
          } else {
            console.error('❌ Failed to fetch approval history:', historyResponse.status);
          }
          setApprovalHistory(data);
          break;
    }

    // Update pagination state
    if (paginationData) {
      setOvertimePagination(prev => ({
        ...prev,
        page: paginationData.page || page,
        totalPages: paginationData.pages || paginationData.totalPages || 1,
        totalItems: paginationData.total || 0
      }));
    }

  } catch (error) {
    console.error('Error fetching overtime data:', error);
    showNotification('Failed to load overtime data', 'error');
  } finally {
    setIsLoadingOvertime(false);
  }
};

// Function to handle view changes
const handleOvertimeViewChange = (view: 'myRecords' | 'pendingApprovals' | 'approvalHistory') => {
  setOvertimeView(view);
  setOvertimePagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  fetchOvertimeData(1, true);
};

// Function to handle approval history filter changes
const handleApprovalHistoryFilter = (type: 'all' | 'approved' | 'rejected') => {
  setApprovalHistoryType(type);
  setOvertimePagination(prev => ({ ...prev, page: 1 }));
  fetchOvertimeData(1, true);
};

const getOvertimeForApproval = async (employeeId: string, status?: string) => {
  const response = await fetch(`${API_BASE_URL}/api/attendance/approval/pending/${employeeId}${status ? `?status=${status}` : ''}`);
  if (!response.ok) throw new Error('Failed to fetch OT for approval');
  return response.json();
};

const getOvertimeApprovalHistory = async (employeeId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/attendance/approval/history/${employeeId}`);
  if (!response.ok) throw new Error('Failed to fetch OT approval history');
  return response.json();
};

// Get combined overtime data for display
const getCombinedOvertimeData = () => {
  let allData: OvertimeRequest[] = [];
  
  // Add employee's own overtime records
  allData = [...overtimeRequests];
  
  // Add pending approvals (for approvers)
  if (role === 'admin' || role === 'manager' || role === 'supervisor') {
    allData = [...allData, ...pendingApprovals];
  }
  
  // Remove duplicates based on ot_request_id
  const uniqueData = allData.reduce((acc: OvertimeRequest[], current) => {
    const exists = acc.find(item => item.ot_request_id === current.ot_request_id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // Apply filters
  let filteredData = uniqueData;
  
  switch (overtimeFilter) {
    case 'pending':
      filteredData = uniqueData.filter(item => 
        item.status === OvertimeStatus.PENDING ||
        item.status === OvertimeStatus.PENDING_SUPERVISOR ||
        item.status === OvertimeStatus.PENDING_MANAGER ||
        item.status === OvertimeStatus.PENDING_ADMIN
      );
      break;
    case 'approved':
      filteredData = uniqueData.filter(item => item.status === OvertimeStatus.APPROVED);
      break;
    case 'rejected':
      filteredData = uniqueData.filter(item => item.status === OvertimeStatus.REJECTED);
      break;
    case 'all':
    default:
      filteredData = uniqueData;
  }
  
  // Sort by date (newest first)
  filteredData.sort((a, b) => new Date(b.ot_date).getTime() - new Date(a.ot_date).getTime());
  
  return filteredData;
};

const combinedOvertimeData = getCombinedOvertimeData();

const [selectedOvertimeDetails, setSelectedOvertimeDetails] = useState<OvertimeRequest | null>(null);


const processOvertimeApproval = async (approvalData: {
  ot_request_id: number;
  employee_id: string;
  action: 'approve' | 'reject';
  comment?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/attendance/approval/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(approvalData)
  });
  if (!response.ok) throw new Error('Failed to process OT approval');
  return response.json();
};

// Add function to calculate display values
const calculateDisplayTimes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
};

// Add function to get status display
// Update getOvertimeStatusDisplay function to handle new statuses
const getOvertimeStatusDisplay = (status: OvertimeStatus) => {
  const statusMap = {
    [OvertimeStatus.PENDING]: { label: 'Pending', class: 'badge-warning' },
    [OvertimeStatus.PENDING_SUPERVISOR]: { label: 'Pending Supervisor', class: 'badge-warning' },
    [OvertimeStatus.PENDING_MANAGER]: { label: 'Pending Manager', class: 'badge-warning' },
    [OvertimeStatus.PENDING_ADMIN]: { label: 'Pending Admin', class: 'badge-warning' },
    [OvertimeStatus.APPROVED]: { label: 'Approved', class: 'badge-success' },
    [OvertimeStatus.REJECTED]: { label: 'Rejected', class: 'badge-error' },
    [OvertimeStatus.CANCELLED]: { label: 'Cancelled', class: 'badge-neutral' }
  };
  return statusMap[status] || { label: status, class: 'badge-neutral' };
};

// Add function to get overtime type display
const getOvertimeTypeDisplay = (type: OvertimeType) => {
  const typeMap = {
    [OvertimeType.WEEKDAY]: { label: 'Weekday', class: 'badge-info' },
    [OvertimeType.WEEKEND]: { label: 'Weekend', class: 'badge-warning' },
    [OvertimeType.HOLIDAY]: { label: 'Holiday', class: 'badge-error' },
    [OvertimeType.PUBLIC_HOLIDAY]: { label: 'Public Holiday', class: 'badge-secondary' }
  };
  return typeMap[type] || { label: type, class: 'badge-neutral' };
};

// Load pending approvals for current user
const loadPendingApprovals = async () => {
  if (!employeeId) return;
  
  try {
    const data = await getOvertimeForApproval(employeeId.toString());
    setPendingApprovals(data.data || []);
  } catch (error) {
    console.error('Failed to load pending approvals:', error);
    showNotification('Failed to load pending approvals', 'error');
  }
};

// Load approval history
const loadApprovalHistory = async () => {
  if (!employeeId) return;
  
  try {
    const data = await getOvertimeApprovalHistory(employeeId.toString());
    setApprovalHistory(data.data || []);
  } catch (error) {
    console.error('Failed to load approval history:', error);
    showNotification('Failed to load approval history', 'error');
  }
};

const fetchOvertimeDetails = async (overtimeId: number) => {
  try {
    console.log('🔍 Fetching overtime details for ID:', overtimeId);
    
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.overtimeDetails}/${overtimeId}`);
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📦 Raw API response:', data);
      
      // FIX: data.data is already the object, not an array
      const overtimeDetails = data.data; // Remove the [0]
      console.log('📦 Overtime details:', overtimeDetails);
      
      if (overtimeDetails) {
        console.log('💾 Setting overtimeDetails:', overtimeDetails);
        setSelectedOvertimeDetails(overtimeDetails);
        setOvertimeBreakdown(overtimeDetails?.breakdown || []);
        console.log('✅ State updated successfully');
      } else {
        console.error('❌ No overtime details found in response');
        showNotification('No overtime details found', 'error');
      }
    } else {
      console.error('❌ API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      showNotification('Failed to load overtime details', 'error');
    }
  } catch (err) {
    console.error('💥 Error fetching overtime details:', err);
    showNotification('Failed to load overtime details', 'error');
  }
};


// Handle approval action
const handleOvertimeApproval = async (action: 'approve' | 'reject') => {
  if (!selectedOvertimeForApproval || !employeeId) return;
  
  setIsProcessingApproval(true);
  try {
    await processOvertimeApproval({
      ot_request_id: selectedOvertimeForApproval.ot_request_id,
      employee_id: employeeId.toString(),
      action,
      comment: approvalComment
    });
    
    showNotification(`Overtime ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'success');
    setSelectedOvertimeForApproval(null);
    setApprovalComment('');
    
    // Refresh data
    await loadPendingApprovals();
    await fetchEmployeeOvertime();
    
  } catch (error) {
    console.error(`Failed to ${action} overtime:`, error);
    showNotification(`Failed to ${action} overtime`, 'error');
  } finally {
    setIsProcessingApproval(false);
  }
};

// Helper function to format IP status display
const formatIPStatus = (status: string) => {
  return status?.replace(/_/g, ' ').toLowerCase() || 'unknown';
};

// Helper function to get IP status display text
const getIPStatusDisplay = (status: string) => {
  if (!status) return 'Unknown';
  
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'in_whitelist':
      return 'Matched';
    case 'not_in_whitelist':
      return 'Not Matched';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

// Only ONE main data loading effect
useEffect(() => {
  if (employeeId) {
    const fetchAllData = async () => {
      try {
        // Common data fetching for all users
        await Promise.all([
          fetchTodayAttendance(),
          fetchAttendanceHistory(),
          fetchAppealData(filters),
          fetchEmployeeOvertime(),
          fetchOvertimeData()
        ]);
        
        // Role-based data fetching
        if (role === 'admin' || role === 'manager' || role === 'supervisor') {
          await Promise.all([
            fetchAttendanceStats(),
            loadPendingApprovals(),
            loadApprovalHistory()
          ]);
          
          // Admin-only functions
          if (role === 'admin') {
            await Promise.all([
              fetchCompanies(),
              applyAttendanceFilters(filters)
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchAllData();
  }
}, [employeeId]);

// Separate effect for filter changes
useEffect(() => {
  if (employeeId && role === 'admin' && filters.fromDate && filters.toDate) {
    applyAttendanceFilters(filters);
  }
}, [filters.fromDate, filters.toDate]);

// Set default dates on component mount
useEffect(() => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  setFilters(prev => ({
    ...prev,
    fromDate: today,
    toDate: today
  }));
}, []);

// Apply default filters when tab changes
useEffect(() => {
  if ((activeTab === 'attendance' || activeTab === 'amend' || activeTab === 'appeal') && employeeId) {
    applyAttendanceFilters(filters);
  }
}, [activeTab, employeeId]);
// // Add to your useEffect to fetch overtime data
// useEffect(() => {
//   if (employeeId) {
//     fetchTodayAttendance();
//     fetchAttendanceHistory();
//     fetchAppealData(filters);
//     fetchEmployeeOvertime(); // Add this line
    
//     if (role === 'admin' || role === 'manager') {
//       fetchAttendanceStats();
//       if (role === 'admin') {
//         fetchCompanies();
//         applyAttendanceFilters(filters);
//       }
//     }
//   }
// }, [employeeId]);
  
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

        {/* Add Overtime Tab for all employees */}
        <button
          onClick={() => handleActiveTabChange('overtime')}
          className={`py-3 px-4 sm:px-6 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'overtime'
              ? theme === 'light' 
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-blue-400 text-blue-400'
              : theme === 'light'
                ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                : 'text-slate-400 hover:text-slate-300 hover:border-slate-500'
            }`}
        >
          Overtime
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
                    <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                      {/* {formatTime(todayAttendance.checkInTime)} */}
                      {displayTime(todayAttendance.checkInTime)}
                    </span>
                  </div>
                  <div className="flex flex-col">                  
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check Out Time</span>     
                    <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                      {displayTime(todayAttendance.checkOutTime)}
                      {/* {formatTime(todayAttendance.checkOutTime)} */}
                    </span>               
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
                          
                      
                          // In calendar date comparisons, use:
                          const employeeTimezone = employee?.time_zone || timeZone;
                          //console.warn("Check 1 : "+ employeeTimezone);
                          const formattedDate = formatInTimeZone(currentDate, employeeTimezone, 'yyyy-MM-dd');
                          const record = attendanceRecords.find(r => {
                            const recordDateZoned = toZonedTime(r.date, employeeTimezone);
                            //console.warn("Check 2 : "+ formatInTimeZone(recordDateZoned, employeeTimezone, 'yyyy-MM-dd'));
                            return formatInTimeZone(recordDateZoned, employeeTimezone, 'yyyy-MM-dd') === formattedDate;
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
                            >
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
                    {/* {(() => {
                      const employeeTimezone = employee?.time_zone || timeZone;
                      const formattedSelectedDate = formatInTimeZone(calendarDate, employeeTimezone, 'yyyy-MM-dd');
                      //const formattedSelectedDate = ymdSG(calendarDate);
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
                    })()} */}

                    {(() => {
  const employeeTimezone = employee?.time_zone || timeZone;
  const formattedSelectedDate = formatInTimeZone(calendarDate, employeeTimezone, 'yyyy-MM-dd');
  const selectedRecord = attendanceRecords.find(r => ymdSG(r.date) === formattedSelectedDate);
  //console.log("Check 4 : "+ selectedRecord);
  if (selectedRecord) {
    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-in:</span>
          <span className={`ml-2 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
            {selectedRecord.checkIn 
              ? displayTime(selectedRecord.checkIn)  // Use displayTime instead of first_checkIn
              : '--:--'}
          </span>
        </div>
        <div>
          <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out:</span>
          <span className={`ml-2 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
            {selectedRecord.checkOut 
              ? displayTime(selectedRecord.checkOut)  // Use displayTime instead of last_checkOut
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
                                   {(() => {
                                      const employeeTimezone = employee?.time_zone || timeZone;
                                      const today = new Date();
                                      return formatInTimeZone(today, employeeTimezone, 'EEEE');
                                    })()}
                                  </div>
                                </>
                              )}
                            </td>
                            <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                              {/* {session.checkIn
                                ? format(toSingaporeTime(session.checkIn) as Date, 'hh:mm a')
                                : '--'} */}
                                {session.checkIn ? displayTime(session.checkIn) : '--'}
                            </td>
                            <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                              {/* {session.checkOut
                                ? format(toSingaporeTime(session.checkOut) as Date, 'hh:mm a')
                                : '--'} */}
                                {session.checkOut ? displayTime(session.checkOut) : '--'}
                            </td>
                            <td className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                               {(() => {
                              if (!session.checkIn) return '--';

                              const employeeTimezone = employee?.time_zone || timeZone;
                              const checkInZoned = toZonedTime(session.checkIn, employeeTimezone);
                              const endTime = session.checkOut
                                ? toZonedTime(session.checkOut, employeeTimezone)
                                : todayAttendance.isCheckedIn && idx === sessions.length - 1
                                  ? toZonedTime(currentTime, employeeTimezone)
                                  : checkInZoned;

                              const diffHrs = differenceInHours(endTime, checkInZoned);
                              const diffMins = differenceInMinutes(endTime, checkInZoned) % 60;

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
                           const employeeTimezone = employee?.time_zone || timeZone;
                          const checkInZoned = toZonedTime(record.checkIn, employeeTimezone);
                          const checkOutZoned = toZonedTime(record.checkOut, employeeTimezone);

                            // Calculate hours and minutes using date-fns
                            const diffHrs = differenceInHours(checkOutZoned, checkInZoned);
                            const diffMins = differenceInMinutes(checkOutZoned, checkInZoned) % 60;

                            workingHours = `${diffHrs}h ${diffMins}m`;
                          }

                          //const singaporeRecordDate = toSingaporeTime(record.date) as Date;

                          const employeeTimezone = employee?.time_zone || timeZone;
                          const recordDateZoned = toZonedTime(record.date, employeeTimezone);


                          return (
                            <tr key={index} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentAttendanceRecords.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
                              <td>
                                <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatInTimeZone(recordDateZoned, employeeTimezone, 'dd/MM/yyyy')}</div>
                                <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                  {formatInTimeZone(recordDateZoned, employeeTimezone, 'EEEE')}{/* {format(singaporeRecordDate, 'EEEE')} */}
                                </div>
                              </td>
                              <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                                {/* {record.checkIn
                                  ? format(toSingaporeTime(record.checkIn) as Date, 'hh:mm a')
                                  : '--'} */}
                                  {record.checkIn ? displayTime(record.checkIn) : '--'}
                              </td>
                              <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                                {/* {record.checkOut
                                  ? format(toSingaporeTime(record.checkOut) as Date, 'hh:mm a')
                                  : '--'} */}
                                  {record.checkOut ? displayTime(record.checkOut) : '--'}
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
                <div className="form-control flex items-end">
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isFilterLoading ? 'loading' : ''}`}
              onClick={() => applyAttendanceFilters(filters)}
              disabled={isFilterLoading || isAttendanceLoading}
            >
              {isFilterLoading ? 'Applying...' : 'Apply Filter'}
            </button>

            <button
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white ${isFilterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={resetAttendanceFilters}
              disabled={isFilterLoading || isAttendanceLoading}
            >
              Reset
            </button>

            <button
              type="button"
              className={`btn w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isExportLoading ? 'loading' : ''}`}
              onClick={() => handleExportWithLeaves(amendAttendanceData)}
              disabled={isExportLoading || isAttendanceLoading}
            >
              {isExportLoading ? 'Exporting...' : 'Export'}
            </button>
                </div>
              </div>

            </div>
          </div>

{/* Results table */}
  <div className={`overflow-x-auto rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
      {isAttendanceLoading || isFilterLoading ? (
        // Show loading state
        <div className="p-6">
          <LoadingSpinner 
            size="md" 
            text="Loading attendance data..." 
            theme={theme}
          />
          {/* Or use skeleton loader */}
          {/* <TableLoadingSkeleton rows={8} columns={7} theme={theme} /> */}
        </div>
      ) : amendAttendanceData.length === 0 ? (
        // Show empty state
        <div className="text-center py-8">
          <CiFaceFrown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
            No attendance records found.
          </p>
        </div>
      ) : (
  <table className="table w-full">
    <thead>
      <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Company</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Department</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check In</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check Out</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Working Hours</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-in IP Details</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-out IP Details</th>
        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
      </tr>
    </thead>
    <tbody>
            {currentAmendItems.map((item, idx) => (
              <tr
                key={`${item.id}-${idx}`}
                className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${idx !== currentAmendItems.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
              >
          {/* Employee */}
          <td>
            <div className="flex items-center gap-3">
              <div>
                <div className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.employee_name ?? ''}</div>
                <div className="text-xs opacity-70">{item.id}</div>
              </div>
            </div>
          </td>
          {/* Company */}
          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.company_name}</td>
          {/* Department */}
          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{item.department_name}</td>
          {/* Date */}
          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
            {displayDateOnly(item.date)}
          </td>
          {/* Check In */}
          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
            {item.checkIn && item.checkIn !== '--' ? displayTimeTZ(item.checkIn, item.employee_timezone) : '--:--'}
          </td>
          {/* Check Out */}
          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
            {item.checkOut && item.checkOut !== '--' ? displayTimeTZ(item.checkOut, item.employee_timezone) : '--:--'}
          </td>
          {/* Working Hours */}
          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
            {(item as any).worked_hours || '0.00'}
          </td>
 {/* Check-in IP Details */}
<td>
  {(item as any).check_in_ip || (item as any).check_in_public_ip ? (
    <div className="text-xs space-y-1">
      {/* Internal IP */}
      {/*  {(item as any).check_in_ip && (
        <div>
          <span className="font-medium">Internal: </span>
          <span className="font-mono">{(item as any).check_in_ip}</span>
        </div>
      )} */}
      {/* Public IP */}
      {(item as any).check_in_public_ip && (
        <div>
          <span className="font-medium">Public: </span>
          <span className="font-mono">{(item as any).check_in_public_ip}</span>
        </div>
      )}
{/* IP Status */}
{(item as any).check_in_ip_match_status && (
  <div className="flex items-center gap-1 mt-1">
    <span className={`badge badge-xs ${
      (item as any).check_in_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
      (item as any).check_in_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
      'badge-warning'
    }`}>
      {getIPStatusDisplay((item as any).check_in_ip_match_status)}
    </span>
  </div>
)}
      {/* Policy Mode */}
      {(item as any).check_in_ip_policy_mode && (
        <div className="text-xs opacity-70">
          Policy: {(item as any).check_in_ip_policy_mode}
        </div>
      )}
    </div>
  ) : (
    <span className="text-xs text-gray-500">No IP data</span>
  )}
</td>

{/* Check-out IP Details */}
<td>
  {(item as any).check_out_ip || (item as any).check_out_public_ip ? (
    <div className="text-xs space-y-1">
      {/* Internal IP */}
      {/* {(item as any).check_out_ip && (
        <div>
          <span className="font-medium">Internal: </span>
          <span className="font-mono">{(item as any).check_out_ip}</span>
        </div>
      )} */}
      {/* Public IP */}
      {(item as any).check_out_public_ip && (
        <div>
          <span className="font-medium">Public: </span>
          <span className="font-mono">{(item as any).check_out_public_ip}</span>
        </div>
      )}
{/* IP Status */}
{(item as any).check_out_ip_match_status && (
  <div className="flex items-center gap-1 mt-1">
    <span className={`badge badge-xs ${
      (item as any).check_out_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
      (item as any).check_out_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
      'badge-warning'
    }`}>
      {getIPStatusDisplay((item as any).check_out_ip_match_status)}
    </span>
  </div>
)}
      {/* Policy Mode */}
      {(item as any).check_out_ip_policy_mode && (
        <div className="text-xs opacity-70">
          Policy: {(item as any).check_out_ip_policy_mode}
        </div>
      )}
    </div>
  ) : (
    <span className="text-xs text-gray-500">No IP data</span>
  )}
</td>
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
      )}
</div>

           {/* Pagination - Updated with loading state */}
    {!isAttendanceLoading && !isFilterLoading && totalItems > 0 && (
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
           )}
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
          disabled={isAppealLoading || isFilterLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
            </div>
          </div>

          {/* Filtering section  */}
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
              className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isFilterLoading ? 'loading' : ''}`}
              onClick={() => applyAttendanceFilters(filters)}
              disabled={isFilterLoading || isAppealLoading}
            >
              {isFilterLoading ? 'Applying...' : 'Apply Filter'}
            </button>
            <button
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white ${isFilterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={resetAttendanceFilters}
              disabled={isFilterLoading || isAppealLoading}
            >
              Reset
            </button>
                </div>
              </div>
            </div>
          </div>

    {/* Results Table with Loading State */}
    <div className={`overflow-x-auto rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
      {isAmendLoading || isFilterLoading ? (
        <div className="p-6">
          <LoadingSpinner 
            size="md" 
            text="Loading amendment data..." 
            theme={theme}
          />
        </div>
      ) : amendAttendanceData.length === 0 ? (
        <div className="text-center py-8">
          <CiFaceFrown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
            No amendment records found.
          </p>
        </div>
      ) : (
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
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                      {displayDateOnly(item.date)}{/* {item.date ? new Date(item.date).toLocaleDateString() : ''} */}
                    </td>
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
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                      {item.amend_date ? displayDateTime(item.amend_date) : ''}
                    </td>
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
      )}
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
          disabled={isAppealLoading || isFilterLoading}
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
              className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isFilterLoading ? 'loading' : ''}`}
              onClick={() => applyAttendanceFilters(filters)}
              disabled={isFilterLoading || isAppealLoading}
            >
              {isFilterLoading ? 'Applying...' : 'Apply Filter'}
            </button>
            <button
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white ${isFilterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={resetAttendanceFilters}
              disabled={isFilterLoading || isAppealLoading}
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
          className={`btn btn-outline ${isBulkMode ? 'btn-primary' : ''} ${isAppealLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={toggleBulkMode}
          disabled={isAppealLoading || isFilterLoading}
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
            disabled={bulkLoading || isAppealLoading}
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
            disabled={bulkLoading || isAppealLoading}
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
             {isAppealLoading || isFilterLoading ? (
        <div className="p-6">
          <LoadingSpinner 
            size="md" 
            text="Loading appeal data..." 
            theme={theme}
          />
        </div>
      ) : appealData.length === 0 ? (
        <div className="text-center py-8">
          <CiFaceFrown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
            No appeal records found.
          </p>
        </div>
      ) : (
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
      )}
          </div>

          {/* Pagination - same as in amend tab */}
          {!isAppealLoading && !isFilterLoading && totalItems > 0 && (
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
           )}
        </div>
      )}

{activeTab === 'overtime' && (
  <div className={`p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
    {/* Header with View Toggles */}
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
      <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
        Overtime Management
      </h2>
      
      {/* View Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
        <div className={`tabs tabs-boxed p-1 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
          <button
            className={`tab ${overtimeView === 'myRecords' ? 
              `${theme === 'light' ? 'tab-active bg-white shadow-sm text-slate-900' : 'tab-active bg-slate-600 shadow-sm text-slate-100'}` : 
              `${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`
            }`}
            onClick={() => handleOvertimeViewChange('myRecords')}
          >
            My Overtime Records
          </button>
          
          {/* Show approval tabs only for approvers */}
          {(role === 'admin' || role === 'manager' || role === 'supervisor') && (
            <>
              <button
                className={`tab ${overtimeView === 'pendingApprovals' ? 
                  `${theme === 'light' ? 'tab-active bg-white shadow-sm text-slate-900' : 'tab-active bg-slate-600 shadow-sm text-slate-100'}` : 
                  `${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`
                }`}
                onClick={() => handleOvertimeViewChange('pendingApprovals')}
              >
                Pending Approvals
                {pendingApprovals.length > 0 && (
                  <span className="badge badge-primary badge-sm ml-2">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
              
              <button
                className={`tab ${overtimeView === 'approvalHistory' ? 
                  `${theme === 'light' ? 'tab-active bg-white shadow-sm text-slate-900' : 'tab-active bg-slate-600 shadow-sm text-slate-100'}` : 
                  `${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`
                }`}
                onClick={() => handleOvertimeViewChange('approvalHistory')}
              >
                Approval History
              </button>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Approval History Filters */}
    {overtimeView === 'approvalHistory' && (
      <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
        <div className="flex flex-wrap items-center gap-4">
          <span className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            Filter by action:
          </span>
          <div className="join">
            <button
              className={`join-item btn btn-sm ${approvalHistoryType === 'all' ? 
                `${theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white'}` : 
                `${theme === 'light' ? 'btn-ghost border-slate-300' : 'bg-slate-600 border-slate-500 text-slate-300'}`
              }`}
              onClick={() => handleApprovalHistoryFilter('all')}
            >
              All Actions
            </button>
            <button
              className={`join-item btn btn-sm ${approvalHistoryType === 'approved' ? 
                `${theme === 'light' ? 'btn-success' : 'bg-green-600 text-white'}` : 
                `${theme === 'light' ? 'btn-ghost border-slate-300' : 'bg-slate-600 border-slate-500 text-slate-300'}`
              }`}
              onClick={() => handleApprovalHistoryFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`join-item btn btn-sm ${approvalHistoryType === 'rejected' ? 
                `${theme === 'light' ? 'btn-error' : 'bg-red-600 text-white'}` : 
                `${theme === 'light' ? 'btn-ghost border-slate-300' : 'bg-slate-600 border-slate-500 text-slate-300'}`
              }`}
              onClick={() => handleApprovalHistoryFilter('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Loading State */}
    {isLoadingOvertime && (
      <div className="flex justify-center items-center py-10">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'light' ? 'border-blue-700' : 'border-blue-400'}`}></div>
      </div>
    )}

    {/* Overtime Content Based on View */}
    {!isLoadingOvertime && (
      <div className="space-y-6">
        {/* My Overtime Records View */}
        {overtimeView === 'myRecords' && (
          <div>
            {overtimeRequests.length === 0 ? (
              <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                <CiFaceFrown className="mx-auto h-12 w-12 mb-4" />
                <p>No overtime records found.</p>
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                <table className="table w-full">
                  <thead>
                    <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}>
                      <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Date</th>
                      <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Total Hours</th>
                      <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>OT Hours</th>
                      <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Type</th>
                      <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Status</th>
                      <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Amount</th>
                      <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overtimeRequests.map((record) => {
                      const statusDisplay = getOvertimeStatusDisplay(record.status);
                      const typeDisplay = getOvertimeTypeDisplay(record.ot_type);
                      
                      return (
                        <tr 
                          key={record.ot_request_id}
                          className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-600'} ${
                            record._justUpdated ? (theme === 'light' ? 'bg-green-100' : 'bg-green-900') + ' animate-pulse' : ''
                          }`}
                        >
                          <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                            {displayDateOnly(record.ot_date)}
                          </td>
                          <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                            {(record.total_worked_minutes / 60).toFixed(1)}h
                          </td>
                          <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                            {(record.ot_minutes / 60).toFixed(1)}h
                          </td>
                          <td>
                            <span className={`badge ${typeDisplay.class}`}>
                              {typeDisplay.label}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${statusDisplay.class}`}>
                              {statusDisplay.label}
                            </span>
                          </td>
                          <td className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                            RM {record.calculated_amount || '0.00'}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                className={`btn btn-xs ${theme === 'light' ? 'btn-info' : 'bg-blue-600 border-blue-600 text-white'}`}
                                onClick={() => fetchOvertimeDetails(record.ot_request_id)}
                              >
                                Details
                              </button>
                              {canApplyForOvertime(record) && (
                                <button
                                  className={`btn btn-xs ${theme === 'light' ? 'btn-success' : 'bg-green-600 border-green-600 text-white'}`}
                                  onClick={() => {
                                    setSelectedOvertimeForApply(record);
                                    setIsOvertimeApplyModalOpen(true);
                                  }}
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pending Approvals View */}
        {overtimeView === 'pendingApprovals' && (
          <div>
            {pendingApprovals.length === 0 ? (
              <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                <CiFaceFrown className="mx-auto h-12 w-12 mb-4" />
                <p>No pending approvals found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900 border border-blue-700'}`}>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className={`font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}>
                      You have {pendingApprovals.length} overtime request(s) waiting for your approval
                    </span>
                  </div>
                </div>

                <div className={`overflow-x-auto rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                  <table className="table w-full">
                    <thead>
                      <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Employee</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Department</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Date</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>OT Hours</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Type</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Current Level</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Amount</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApprovals.map((record) => {
                        const typeDisplay = getOvertimeTypeDisplay(record.ot_type);
                        
                        return (
                          <tr 
                            key={record.ot_request_id}
                            className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-600'}
                          >
                            <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                              <div>
                                <div className="font-bold">{record.employee_name || 'Unknown'}</div>
                                <div className="text-sm opacity-70">{record.employee_no || record.employee_id}</div>
                              </div>
                            </td>
                            <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>{record.department_name || 'N/A'}</td>
                            <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>{displayDateOnly(record.ot_date)}</td>
                            <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>{(record.ot_minutes / 60).toFixed(1)}h</td>
                            <td>
                              <span className={`badge ${typeDisplay.class}`}>
                                {typeDisplay.label}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${theme === 'light' ? 'badge-info' : 'bg-blue-600 text-white'}`}>
                                {record.current_approval_level || record.current_approver || 'Pending'}
                              </span>
                            </td>
                            <td className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                              RM {record.calculated_amount || '0.00'}
                            </td>
                            <td>
                              <div className="flex gap-2">
                                <button
                                  className={`btn btn-xs ${theme === 'light' ? 'btn-success' : 'bg-green-600 border-green-600 text-white'}`}
                                  onClick={() => {
                                    setSelectedOvertimeForApproval(record);
                                    setApprovalComment('');
                                    setConfirmAction('approve');
                                    setShowConfirmModal(true);
                                  }}
                                  disabled={isProcessingApproval}
                                >
                                  {isProcessingApproval ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                  ) : (
                                    'Approve'
                                  )}
                                </button>
                                <button
                                  className={`btn btn-xs ${theme === 'light' ? 'btn-error' : 'bg-red-600 border-red-600 text-white'}`}
                                  onClick={() => {
                                    setSelectedOvertimeForApproval(record);
                                    setApprovalComment('');
                                    setConfirmAction('reject');
                                    setShowConfirmModal(true);
                                  }}
                                  disabled={isProcessingApproval}
                                >
                                  {isProcessingApproval ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                  ) : (
                                    'Reject'
                                  )}
                                </button>
                                <button
                                  className={`btn btn-xs ${theme === 'light' ? 'btn-info' : 'bg-blue-600 border-blue-600 text-white'}`}
                                  onClick={() => fetchOvertimeDetails(record.ot_request_id)}
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Approval History View */}
        {overtimeView === 'approvalHistory' && (
          <div>
            {approvalHistory.length === 0 ? (
              <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                <CiFaceFrown className="mx-auto h-12 w-12 mb-4" />
                <p>No approval history found.</p>
                <p className="text-sm mt-2">
                  {approvalHistoryType !== 'all' 
                    ? `No ${approvalHistoryType} records found.` 
                    : 'You have not processed any overtime requests yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-green-50 border border-green-200' : 'bg-green-900 border border-green-700'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`font-medium ${theme === 'light' ? 'text-green-800' : 'text-green-200'}`}>
                        Showing {approvalHistory.length} historical approval(s)
                      </span>
                    </div>
                    <div className="text-sm opacity-70">
                      Filter: <span className="font-medium capitalize">{approvalHistoryType}</span>
                    </div>
                  </div>
                </div>

                <div className={`overflow-x-auto rounded-lg shadow ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
                  <table className="table w-full">
                    <thead>
                      <tr className={theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Employee</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Date</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>OT Hours</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Type</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Your Action</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Final Status</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Amount</th>
                        <th className={theme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvalHistory.map((record) => {
                        const typeDisplay = getOvertimeTypeDisplay(record.ot_type);
                        const finalStatusDisplay = getOvertimeStatusDisplay(record.status);
                        
                        // Fixed user action detection
                        const getUserAction = () => {
                          if (record.status === OvertimeStatus.APPROVED) return 'Approved';
                          if (record.status === OvertimeStatus.REJECTED) return 'Rejected';
                          return 'Processed';
                        };

                        const userAction = getUserAction();
                        
                        return (
                          <tr 
                            key={record.ot_request_id}
                            className={theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-600'}
                          >
                            <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
                              <div>
                                <div className="font-bold">{record.employee_name || 'Unknown'}</div>
                                <div className="text-sm opacity-70">{record.employee_no || record.employee_id}</div>
                              </div>
                            </td>
                            <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>{displayDateOnly(record.ot_date)}</td>
                            <td className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>{(record.ot_minutes / 60).toFixed(1)}h</td>
                            <td>
                              <span className={`badge ${typeDisplay.class}`}>
                                {typeDisplay.label}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                userAction?.toLowerCase().includes('approved') ? 
                                `${theme === 'light' ? 'badge-success' : 'bg-green-600 text-white'}` : 
                                userAction?.toLowerCase().includes('rejected') ? 
                                `${theme === 'light' ? 'badge-error' : 'bg-red-600 text-white'}` : 
                                `${theme === 'light' ? 'badge-info' : 'bg-blue-600 text-white'}`
                              }`}>
                                {userAction}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${finalStatusDisplay.class}`}>
                                {finalStatusDisplay.label}
                              </span>
                            </td>
                            <td className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                              RM {record.calculated_amount || '0.00'}
                            </td>
                            <td>
                              <button
                                className={`btn btn-xs ${theme === 'light' ? 'btn-info' : 'bg-blue-600 border-blue-600 text-white'}`}
                                onClick={() => fetchOvertimeDetails(record.ot_request_id)}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )}

{overtimePagination.totalPages > 1 && (
  <div className="flex justify-center mt-6">
    <div className="join">
      <button
        className={`join-item btn btn-sm ${
          overtimePagination.page === 1 ? 'btn-disabled' : 
          theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
        }`}
        onClick={() => fetchOvertimeData(overtimePagination.page - 1)}
        disabled={overtimePagination.page === 1}
      >
        «
      </button>
      
      {Array.from({ length: overtimePagination.totalPages }, (_, i) => i + 1)
        .filter(page => 
          page === 1 || 
          page === overtimePagination.totalPages || 
          Math.abs(page - overtimePagination.page) <= 1
        )
        .map((page, index, array) => (
          <React.Fragment key={page}>
            {index > 0 && array[index - 1] !== page - 1 && (
              <button className="join-item btn btn-sm btn-disabled">...</button>
            )}
            <button
              className={`join-item btn btn-sm ${
                overtimePagination.page === page ? 
                  `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                  `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
              }`}
              onClick={() => fetchOvertimeData(page)}
            >
              {page}
            </button>
          </React.Fragment>
        ))
      }
      
      <button
        className={`join-item btn btn-sm ${
          overtimePagination.page === overtimePagination.totalPages ? 'btn-disabled' : 
          theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
        }`}
        onClick={() => fetchOvertimeData(overtimePagination.page + 1)}
        disabled={overtimePagination.page === overtimePagination.totalPages}
      >
        »
      </button>
    </div>
    
    {/* Add items per page selector */}
    <div className="ml-4 flex items-center">
      <span className={`text-sm mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
        Show:
      </span>
      <select
        className={`select select-bordered select-sm ${
          theme === 'light' ? 'bg-white' : 'bg-slate-700'
        }`}
        value={overtimePagination.limit}
        onChange={(e) => {
          setOvertimePagination(prev => ({
            ...prev,
            limit: parseInt(e.target.value),
            page: 1
          }));
          setTimeout(() => fetchOvertimeData(1), 100);
        }}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
)}
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
                                  {selectedAppeal.original_check_in ? displayTime(selectedAppeal.original_check_in) : 'No check-in recorded'}{/* {selectedAppeal.original_check_in ? format(toSingaporeTime(new Date(selectedAppeal.original_check_in)), 'HH:mm a') : 'No check-in recorded'} */}
                              </td>
                              <td className={selectedAppeal.original_check_out ? '' : 'text-error'}>
                                   {selectedAppeal.original_check_out ? displayTime(selectedAppeal.original_check_out) : 'No check-out recorded'}{/* {selectedAppeal.original_check_out ? format(toSingaporeTime(new Date(selectedAppeal.original_check_out)), 'HH:mm a') : 'No check-out recorded'} */}
                              </td>
                            </tr>
                            <tr>
                              <th className="font-medium text-sm bg-base-200">Requested Change</th>
                              <td className="font-medium text-success">
                                {selectedAppeal.requested_check_in ? displayRawTime(selectedAppeal.requested_check_in) : 'Not specified'} {/* {selectedAppeal.requested_check_in ? format(toSingaporeTime(new Date(selectedAppeal.requested_check_in)), 'HH:mm a') : 'Not specified'} */}
                              </td>
                              <td className="font-medium text-success">
                                 {selectedAppeal.requested_check_out ? displayRawTime(selectedAppeal.requested_check_out) : 'Not specified'}{/* {selectedAppeal.requested_check_out ? format(toSingaporeTime(new Date(selectedAppeal.requested_check_out)), 'HH:mm a') : 'Not specified'} */}
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
                            ? displayTime(appealRequestData.originalCheckIn)
                            : '--:--'}
                        </div>
                      </div>
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out</label>
                        <div className={`border rounded px-2 py-1 text-sm ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}>
                          {appealRequestData.originalCheckOut
                            ? displayTime(appealRequestData.originalCheckOut)
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



      {/* Add this modal to your JSX */}
      {isOvertimeApplyModalOpen && selectedOvertimeForApply && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Apply for Overtime</h3>
            
                  {/* Add date validation warning */}
      {!canApplyOvertimeForDate(selectedOvertimeForApply.ot_date) && (
        <div className="alert alert-warning mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            Overtime applications are only available from the next day onwards. 
            Please check back tomorrow to apply for {displayDateOnly(selectedOvertimeForApply.ot_date)}.
          </span>
        </div>
      )}
      
            <div className="mb-4">
              <p>Are you sure you want to apply for overtime on <strong>{displayDateOnly(selectedOvertimeForApply.ot_date)}</strong>?</p>
              
              <div className="mt-3 p-3 bg-base-200 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Total Worked:</div>
                  <div className="font-medium">
                    {calculateDisplayTimes(selectedOvertimeForApply.total_worked_minutes).hours}h 
                    {calculateDisplayTimes(selectedOvertimeForApply.total_worked_minutes).minutes}m
                  </div>
                  
                  <div>Overtime Hours:</div>
                  <div className="font-medium">
                    {calculateDisplayTimes(selectedOvertimeForApply.ot_minutes).hours}h 
                    {calculateDisplayTimes(selectedOvertimeForApply.ot_minutes).minutes}m
                  </div>
                  
                  <div>Calculated Amount:</div>
                  <div className="font-medium text-green-600">
                    RM {selectedOvertimeForApply.calculated_amount}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setIsOvertimeApplyModalOpen(false)}
                disabled={isApplyingOvertime}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => applyForOvertime(selectedOvertimeForApply)}
                disabled={isApplyingOvertime}
              >
                {isApplyingOvertime ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Applying...
                  </>
                ) : (
                  'Confirm Apply'
                )}
              </button>
            </div>
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
                      displayDateOnly(selectedEmployeeAppeal.attendance_date) : ''}
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
                          displayTime(selectedEmployeeAppeal.original_check_in) :
                          'Not recorded'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Original Check-out</p>
                      <p className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {selectedEmployeeAppeal.original_check_out ?
                          displayTime(selectedEmployeeAppeal.original_check_out) :
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
                      displayRawTime(selectedEmployeeAppeal.requested_check_in) : // Use raw time
                      '--:--'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${theme === 'light' ? 'opacity-70' : 'text-slate-400'}`}>Requested Check-out</p>
                  <p className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                    {selectedEmployeeAppeal.requested_check_out ?
                      displayRawTime(selectedEmployeeAppeal.requested_check_out) : // Use raw time
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

      {/* Overtime Approval Modal */}
      {selectedOvertimeForApproval && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Review Overtime Request</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-semibold">Employee:</label>
                  <div>{selectedOvertimeForApproval.employee_name}</div>
                </div>
                <div>
                  <label className="font-semibold">Date:</label>
                  <div>{displayDateOnly(selectedOvertimeForApproval.ot_date)}</div>
                </div>
                <div>
                  <label className="font-semibold">OT Hours:</label>
                  <div>{calculateDisplayTimes(selectedOvertimeForApproval.ot_minutes).hours}h {calculateDisplayTimes(selectedOvertimeForApproval.ot_minutes).minutes}m</div>
                </div>
                <div>
                  <label className="font-semibold">Amount:</label>
                  <div className="font-semibold text-green-600">RM {selectedOvertimeForApproval.calculated_amount}</div>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Comment (Optional)</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered"
                  placeholder="Add a comment for the employee..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={() => {
                    setSelectedOvertimeForApproval(null);
                    setApprovalComment('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-error"
                  onClick={() => handleOvertimeApproval('reject')}
                  disabled={isProcessingApproval}
                >
                  {isProcessingApproval ? 'Rejecting...' : 'Reject'}
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => handleOvertimeApproval('approve')}
                  disabled={isProcessingApproval}
                >
                  {isProcessingApproval ? 'Approving...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

{/* Overtime Details Modal */}
{selectedOvertimeDetails && (
  <dialog open className="modal modal-bottom sm:modal-middle">
    <div className={`modal-box relative max-w-4xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
      <form method="dialog">
        <button 
          onClick={() => {
            setSelectedOvertimeDetails(null);
            setOvertimeBreakdown(null);
          }}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>
      
      <h3 className="font-bold text-lg mb-2">Overtime Details</h3>
      <div className={`text-sm mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
        Date: {displayDateOnly(selectedOvertimeDetails.ot_date)}
        {selectedOvertimeDetails.employee_name && (
          <> • Employee: {selectedOvertimeDetails.employee_name}</>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`stat ${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'} rounded-lg`}>
          <div className="stat-title">Total Worked</div>
          <div className="stat-value text-lg">
            {calculateDisplayTimes(selectedOvertimeDetails.total_worked_minutes).hours}h
          </div>
          <div className="stat-desc">
            {calculateDisplayTimes(selectedOvertimeDetails.total_worked_minutes).minutes}m
          </div>
        </div>
        
        <div className={`stat ${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'} rounded-lg`}>
          <div className="stat-title">Regular Hours</div>
          <div className="stat-value text-lg">
            {calculateDisplayTimes(selectedOvertimeDetails.regular_minutes).hours}h
          </div>
          <div className="stat-desc">
            {calculateDisplayTimes(selectedOvertimeDetails.regular_minutes).minutes}m
          </div>
        </div>
        
        <div className={`stat ${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'} rounded-lg`}>
          <div className="stat-title">OT Hours</div>
          <div className="stat-value text-lg text-warning">
            {calculateDisplayTimes(selectedOvertimeDetails.ot_minutes).hours}h
          </div>
          <div className="stat-desc">
            {selectedOvertimeDetails.calculated_ot_hours} payable
          </div>
        </div>
        
        <div className={`stat ${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'} rounded-lg`}>
          <div className="stat-title">Amount</div>
          <div className="stat-value text-lg text-success">
            RM {selectedOvertimeDetails.calculated_amount || '0.00'}
          </div>
          <div className="stat-desc capitalize">{selectedOvertimeDetails.ot_type}</div>
        </div>
      </div>

      {/* Breakdown Section */}
      {overtimeBreakdown && overtimeBreakdown.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Overtime Breakdown</h4>
          <div className={`overflow-x-auto ${theme === 'light' ? 'bg-base-100' : 'bg-slate-700'} rounded-lg`}>
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Time Period</th>
                  <th>Rate Type</th>
                  <th>Rate Multiplier</th>
                  <th>Minutes</th>
                  <th>Hours</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {overtimeBreakdown.map((item: OvertimeBreakdownItem) => (
                  <tr key={item.breakdown_id}>
                    <td>{item.time_period}</td>
                    <td>
                      <span className={`badge badge-sm ${
                        item.rate_type === 'weekday' ? 'badge-info' :
                        item.rate_type === 'weekend' ? 'badge-warning' :
                        'badge-error'
                      }`}>
                        {item.rate_type}
                      </span>
                    </td>
                    <td>{item.rate_multiplier}x</td>
                    <td>{item.minutes}m</td>
                    <td>{item.hours}h</td>
                    <td className="font-medium">RM {item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

{/* Approval Timeline */}
{/* Approval Timeline */}
<div className="mb-6">
  <h4 className="font-semibold mb-3">Approval Status</h4>
  <div className="flex flex-col space-y-3">
    
    {/* First Approval */}
    {selectedOvertimeDetails.first_approver_name ? (
      <div className={`flex items-center p-3 rounded-lg ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'}`}>
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
          ✓
        </div>
        <div>
          <div className="font-medium">First Approval</div>
          <div className="text-sm opacity-70">
            {selectedOvertimeDetails.first_approver_name} • 
            {selectedOvertimeDetails.first_approval_date ? 
              ` ${displayDateTime(selectedOvertimeDetails.first_approval_date)}` : 
              ' Pending'
            }
          </div>
          {selectedOvertimeDetails.first_approval_comment && (
            <div className="text-sm mt-1">{selectedOvertimeDetails.first_approval_comment}</div>
          )}
        </div>
      </div>
    ) : (
      <div className={`flex items-center p-3 rounded-lg ${
        selectedOvertimeDetails.status === 'pending_supervisor' ? 
        (theme === 'light' ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-700') :
        (theme === 'light' ? 'bg-gray-100' : 'bg-slate-700')
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${
          selectedOvertimeDetails.status === 'pending_supervisor' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
        }`}>
          {selectedOvertimeDetails.status === 'pending_supervisor' ? '!' : '1'}
        </div>
        <div>
          <div className="font-medium">First Approval</div>
          <div className="text-sm opacity-70">
            {selectedOvertimeDetails.first_approver_name || 'Pending Assignment'} • 
            {selectedOvertimeDetails.status === 'pending_supervisor' ? ' Awaiting Approval' : ' Pending'}
          </div>
          {selectedOvertimeDetails.status === 'pending_supervisor' && (
            <div className="text-xs mt-1 text-yellow-600 dark:text-yellow-400">
              Currently waiting for supervisor approval
            </div>
          )}
        </div>
      </div>
    )}

    {/* Second Approval */}
    {selectedOvertimeDetails.second_approver_name && selectedOvertimeDetails.second_approval_date ? (
      <div className={`flex items-center p-3 rounded-lg ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'}`}>
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
          ✓
        </div>
        <div>
          <div className="font-medium">Second Approval</div>
          <div className="text-sm opacity-70">
            {selectedOvertimeDetails.second_approver_name} • {displayDateTime(selectedOvertimeDetails.second_approval_date)}
          </div>
          {selectedOvertimeDetails.second_approval_comment && (
            <div className="text-sm mt-1">{selectedOvertimeDetails.second_approval_comment}</div>
          )}
        </div>
      </div>
    ) : (
      <div className={`flex items-center p-3 rounded-lg ${
        ['pending_manager', 'pending_admin'].includes(selectedOvertimeDetails.status) ? 
        (theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700') :
        (theme === 'light' ? 'bg-gray-100' : 'bg-slate-700')
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${
          ['pending_manager', 'pending_admin'].includes(selectedOvertimeDetails.status) ? 'bg-blue-500' : 'bg-gray-400'
        }`}>
          2
        </div>
        <div>
          <div className="font-medium">Second Approval</div>
          <div className="text-sm opacity-70">
            {selectedOvertimeDetails.second_approver_name || 'Pending Assignment'} • 
            {selectedOvertimeDetails.status === 'pending_manager' ? ' Next for Approval' : ' Pending'}
          </div>
          {selectedOvertimeDetails.status === 'pending_manager' && (
            <div className="text-xs mt-1 text-blue-600 dark:text-blue-400">
              Will be routed to manager after supervisor approval
            </div>
          )}
        </div>
      </div>
    )}

    {/* Third Approval */}
    {selectedOvertimeDetails.third_approver_name && selectedOvertimeDetails.third_approval_date ? (
      <div className={`flex items-center p-3 rounded-lg ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'}`}>
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
          ✓
        </div>
        <div>
          <div className="font-medium">Third Approval</div>
          <div className="text-sm opacity-70">
            {selectedOvertimeDetails.third_approver_name} • {displayDateTime(selectedOvertimeDetails.third_approval_date)}
          </div>
          {selectedOvertimeDetails.third_approval_comment && (
            <div className="text-sm mt-1">{selectedOvertimeDetails.third_approval_comment}</div>
          )}
        </div>
      </div>
    ) : (
      <div className={`flex items-center p-3 rounded-lg ${
        selectedOvertimeDetails.status === 'pending_admin' ? 
        (theme === 'light' ? 'bg-purple-50 border border-purple-200' : 'bg-purple-900/20 border border-purple-700') :
        (theme === 'light' ? 'bg-gray-100' : 'bg-slate-700')
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${
          selectedOvertimeDetails.status === 'pending_admin' ? 'bg-purple-500' : 'bg-gray-400'
        }`}>
          3
        </div>
        <div>
          <div className="font-medium">Third Approval</div>
          <div className="text-sm opacity-70">
            {selectedOvertimeDetails.third_approver_name || 'Pending Assignment'} • 
            {selectedOvertimeDetails.status === 'pending_admin' ? ' Final Approval' : ' Pending'}
          </div>
          {selectedOvertimeDetails.status === 'pending_admin' && (
            <div className="text-xs mt-1 text-purple-600 dark:text-purple-400">
              Final approval required from admin
            </div>
          )}
        </div>
      </div>
    )}

    {/* Current Status Summary */}
    <div className={`mt-4 p-3 rounded-lg ${
      selectedOvertimeDetails.status.includes('pending') ? 
      (theme === 'light' ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-700') :
      selectedOvertimeDetails.status === 'approved' ?
      (theme === 'light' ? 'bg-green-50 border border-green-200' : 'bg-green-900/20 border border-green-700') :
      (theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-700')
    }`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          selectedOvertimeDetails.status.includes('pending') ? 'bg-yellow-500' :
          selectedOvertimeDetails.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <div className="text-sm font-medium">
          Current Status: 
          <span className={`ml-1 ${
            selectedOvertimeDetails.status.includes('pending') ? 'text-yellow-700 dark:text-yellow-300' :
            selectedOvertimeDetails.status === 'approved' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {getOvertimeStatusDisplay(selectedOvertimeDetails.status).label}
          </span>
        </div>
      </div>
      {selectedOvertimeDetails.submitted_at && (
        <div className="text-xs mt-1 opacity-70">
          Submitted: {displayDateTime(selectedOvertimeDetails.submitted_at)}
        </div>
      )}
    </div>
  </div>
</div>

      <div className="modal-action">
        <button
          className="btn btn-ghost"
          onClick={() => {
            setSelectedOvertimeDetails(null);
            setOvertimeBreakdown(null);
          }}
        >
          Close
        </button>
      </div>
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
