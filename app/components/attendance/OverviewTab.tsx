
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { format, parseISO, differenceInMilliseconds, differenceInHours, differenceInMinutes, addDays, isToday, isSameDay } from 'date-fns';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';//import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { useTheme } from '../../components/ThemeProvider';
import WorkingTimeCounter from '../../components/WorkingTimeCounter';
import { API_BASE_URL } from '@/app/config';

// Interfaces
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
  REJECTED = 'REJECTED',
  CANCEL = 'CANCEL'
}

interface AttendanceRecord {
  date: Date;
  checkIn?: Date | null;
  checkOut?: Date | null;
  status: 'present' | 'absent' | 'late' | 'partial' | 'offday';
  attendanceDayId: number;
  adminComment?: string;
  first_checkIn?: string;
  last_checkOut?: string;
  appealStatus?: string;
}

interface TodayAttendance {
  isCheckedIn: boolean;
  checkInTime: Date | null;
  checkOutTime: Date | null;
}

interface AttendanceSession {
  id: string;
  checkIn: Date | null;
  checkOut: Date | null;
}

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

interface AttendanceStats {
  overallAttendanceRate: number;
  topEmployees: EmployeeAttendance[];
  monthlyTrend: MonthlyTrend[];
  departmentComparison: DepartmentComparison[];
  today: TodayStats;
  dailyStats: DailyAttendanceStats[];
}

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

interface Company {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: number;
  start_work_time: string;
  end_work_time: string;
  time_zone: string;
  schedule_date?: string | null;
  work_status?: string | null;
  leave_status_today?: string | null;
  public_holiday_titles?: string | null;
  template_name?: string | null;
  work_break?: number | string | null;
}

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
  original_check_in?: Date | null;
  original_check_out?: Date | null;
  requested_check_in?: Date | null;
  requested_check_out?: Date | null;
  attendance_status: string; // Fixed: Added missing property
  requested_status: 'present' | 'late' | 'absent' | 'offday' | 'partial';
  attendance_day_id: number;
  admin_comment?: string;
  reviewed_at?: string | Date | null; // Fixed: Added missing property
}

interface Employee {
  time_zone: string;
}

// Appeal Request Form Data Interface
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

interface EditedAppealData {
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
}

interface OverviewTabProps {
  user: any;
  role: string;
  onShowNotification?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function OverviewTab({ user, role, onShowNotification }: OverviewTabProps) {
  const { theme } = useTheme();
  
  // State variables
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>({
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null
  });

  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  // Department stats states
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
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appealData, setAppealData] = useState<AppealData[]>([]);
  
  // Pagination states
  const [attendanceRecordsPage, setAttendanceRecordsPage] = useState<number>(1);
  const recordsPerPage = 10;
  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);

  // Appeal-related states
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

  // Employee appeal view modal states
  const [isEmployeeAppealViewModalOpen, setIsEmployeeAppealViewModalOpen] = useState(false);
  const [selectedEmployeeAppeal, setSelectedEmployeeAppeal] = useState<AppealData | null>(null);
  const [isEditingAppeal, setIsEditingAppeal] = useState(false);
  const [editedAppealData, setEditedAppealData] = useState<EditedAppealData>({
    requestedCheckIn: '',
    requestedCheckOut: '',
    reason: ''
  });

  const allSessionsCompleted = useMemo(() => {
    return sessions.length > 0 && sessions.every(s => s.checkIn && s.checkOut);
  }, [sessions]);

  // ========== TIMEZONE FUNCTIONS ==========
  
const parseApiDateUTC = (date: Date | string | null): Date | null => {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
};

// Special display function for appeal times in modal
const displayAppealTimework = (date: Date | string | null): string => {
  if (!date) return '--:--';
  
  let dateObj: Date;
  
  try {
    // Parse using our improved function
    dateObj = parseApiDateUTC(date) as Date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '--:--';
    }
    
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    
    // Use formatInTimeZone for consistent timezone conversion
    return formatInTimeZone(dateObj, tz, 'hh:mm a');
  } catch (error) {
    console.error('Error formatting appeal time:', error, date);
    return '--:--';
  }
};

// Update displayAppealTime function to accept timezone parameter
const displayAppealTime = (date: Date | string | null, timezone?: string): string => {
  if (!date) return '--:--';
  
  let dateObj: Date;
  
  try {
    // Parse using our improved function
    dateObj = parseApiDateUTC(date) as Date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '--:--';
    }
    
    // Use provided timezone or fall back to current employee's timezone
    const tz = timezone || employee?.time_zone || 'Asia/Kuala_Lumpur';
    
    // Use formatInTimeZone for consistent timezone conversion
    return formatInTimeZone(dateObj, tz, 'hh:mm a');
  } catch (error) {
    console.error('Error formatting appeal time:', error, date);
    return '--:--';
  }
};

// Also update the appealTimeToLocalInput function similarly if needed
const appealTimeToLocalInput = (date: Date | string | null, timezone?: string): string => {
  if (!date) return '';
  
  try {
    const dateObj = parseApiDateUTC(date) as Date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }
    
    // Use provided timezone or fall back to current employee's timezone
    const tz = timezone || employee?.time_zone || 'Asia/Kuala_Lumpur';
    // Format as HH:mm for time input
    return formatInTimeZone(dateObj, tz, 'HH:mm');
  } catch (error) {
    console.error('Error converting appeal time for input:', error);
    return '';
  }
};

// For time inputs in modal (editing mode)
const appealTimeToLocalInputwork = (date: Date | string | null): string => {
  if (!date) return '';
  
  try {
    const dateObj = parseApiDateUTC(date) as Date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }
    
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    // Format as HH:mm for time input
    return formatInTimeZone(dateObj, tz, 'HH:mm');
  } catch (error) {
    console.error('Error converting appeal time for input:', error);
    return '';
  }
};

  const toEmployeeTimezone = (utcDate: Date | string | null): Date | null => {
    if (!utcDate) return null;
    
    const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
    
    try {
      const employeeTime = new Date(date.toLocaleString('en-US', { 
        timeZone: employee?.time_zone || 'Asia/Kuala_Lumpur' 
      }));
      
      return employeeTime;
    } catch (error) {
      console.error("Error converting to employee timezone:", error);
      return date;
    }
  };

  const utcToLocalTimeString = (utcDateString: string | null): string => {
  if (!utcDateString) return '';
  
  try {
    const date = new Date(utcDateString);
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    return formatInTimeZone(date, tz, 'HH:mm');
  } catch (error) {
    console.error('Error converting UTC to local time:', error);
    return '';
  }
};

const displayTime = (date: Date | string | null): string => {
  if (!date) return '--:--';
  
  let dateObj: Date;
  
  try {
    // If it's already a Date object
    if (date instanceof Date) {
      if (isNaN(date.getTime())) return '--:--';
      dateObj = date;
    } 
    // If it's a string
    else if (typeof date === 'string') {
      // Try parsing as ISO string first
      let parsedDate = new Date(date);
      
      // If not a valid ISO date, try to parse it
      if (isNaN(parsedDate.getTime())) {
        // Try to parse as local date string
        const timeString = date.split(' ')[0]; // Get time part if exists
        const [hours, minutes] = timeString.split(':');
        if (hours && minutes) {
          parsedDate = new Date();
          parsedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          return '--:--';
        }
      }
      
      dateObj = parsedDate;
    } else {
      return '--:--';
    }
    
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    
    // Format time in employee's timezone
    return formatInTimeZone(dateObj, tz, 'hh:mm a');
  } catch (error) {
    console.error('Error formatting time:', error, date);
    return '--:--';
  }
};

const utcToLocalTimeInput = (utcDateString: string | null): string => {
  if (!utcDateString) return '';
  
  try {
    const date = new Date(utcDateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid UTC date:', utcDateString);
      return '';
    }
    
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    // Convert to employee's timezone and format as HH:mm for time input
    return formatInTimeZone(date, tz, 'HH:mm');
  } catch (error) {
    console.error('Error converting UTC to local time input:', error);
    return '';
  }
};

const localTimeToUTC = (dateStr: string, timeStr: string): string => {
  if (!dateStr || !timeStr) return '';
  
  try {
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    
    // Create a date string in the employee's local timezone
    const localDateTimeStr = `${dateStr}T${timeStr}:00`;
    
    // Parse this as local time in the specified timezone
    const localDate = toZonedTime(localDateTimeStr, tz);
    
    // Get UTC time
    const utcDate = fromZonedTime(localDate, tz);
    
    // Return ISO string (already in UTC)
    return utcDate.toISOString();
  } catch (error) {
    console.error('Error converting local time to UTC:', error);
    return '';
  }
};

// const localTimeToUTC00 = (dateStr: string, timeStr: string): string => {
//   if (!dateStr || !timeStr) return '';
  
//   try {
//     // Create date string in employee's timezone
//     const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
//     const localDateTimeStr = `${dateStr}T${timeStr}:00`;
    
//     // Parse as local time in employee's timezone
//     const localDate = toZonedTime(localDateTimeStr, tz);
    
//     // Convert to UTC
//     const utcDate = utcToZonedTime(localDate, tz);
    
//     // Format as ISO string with Z
//     return utcDate.toISOString();
//   } catch (error) {
//     console.error('Error converting local time to UTC:', error);
//     return '';
//   }
// };

  const displayTime0201 = (date: Date | string | null): string => {
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    const d = parseApiDateUTC(date);
    if (!d) return '--:--';
    return formatInTimeZone(d, tz, 'hh:mm a');
  };

  const formatTime0201 = (date: Date | null) => {
    return displayTime(date);
  };

  const formatTime = (date: Date | string | null) => {
  if (!date) return '--:--';
  
  // Convert to Date object if string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format in employee's timezone
  const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
  return formatInTimeZone(dateObj, tz, 'HH:mm');
};

  const formatDateInEmployeeTZ = (date: Date | null): string => {
    if (!date) return '';
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    return formatInTimeZone(date, tz, 'dd/MM/yyyy');
  };

  const formatDayInEmployeeTZ = (date: Date | null): string => {
    if (!date) return '';
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    return formatInTimeZone(date, tz, 'EEEE');
  };

  // Helper function to check if date is today
  const isRecordToday = (recordDate: Date): boolean => {
    return isToday(recordDate);
  };

  // Helper function to check if date is past date (not today or future)
  const isPastDate = (recordDate: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(recordDate);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // ========== IP DETECTION & ATTENDANCE ==========

  async function getPublicIpClientSide(): Promise<string | null> {
    const providers = [
      'https://checkip.amazonaws.com/',
    ];

    const isValidIPv4 = (ip: string) => {
      if (!ip || typeof ip !== 'string') return false;
      const cleanIp = ip.trim();
      return /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(cleanIp);
    };

    for (const url of providers) {
      try {
        const response = await fetch(url, { 
          signal: AbortSignal.timeout(3000),
          cache: 'no-store',
          headers: {
            'Accept': 'text/plain, */*',
          }
        });
        
        if (!response.ok) {
          continue;
        }
        
        let ip = (await response.text()).trim();
        
        if (ip && isValidIPv4(ip)) {
          return ip;
        }
        
      } catch (err: any) {
        continue;
      }
    }
    
    return null;
  }

  async function postAttendanceWithIp(url: string, payload: any) {
    const publicIp = await getPublicIpClientSide();
    
    const requestPayload = {
      ...payload,
      client_public_ip: publicIp
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
      },
      body: JSON.stringify(requestPayload)
    });
  }

  // Initialize employeeId from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userString = localStorage.getItem('hrms_user');
        if (userString) {
          const userData = JSON.parse(userString);
          if (userData && userData.id) {
            setEmployeeId(userData.id);
            fetchEmployeeData(userData.id);
          }
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
      }
    }
  }, []);

  // Update current time every second when checked in
  useEffect(() => {
    if (todayAttendance.isCheckedIn) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      setTimerInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
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
    
    let badgeClass = 'badge-warning';
    if (status === 'approved') badgeClass = 'badge-success';
    if (status === 'rejected' || status === 'cancel') badgeClass = 'badge-error';
    
    return {
      display: displayText,
      className: `badge ${badgeClass}`,
      isBadge: true
    };
  };

  // Fetch employee data
  const fetchEmployeeData = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/${id}`);
      if (!response.ok) throw new Error('Failed to fetch employee data');
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  }, []);

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    try {
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      const url = `${API_BASE_URL}/api/attendance/today?employee_id=${employeeId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch today attendance');

      const payload = await res.json();
      
      const root = Array.isArray(payload) ? payload[0] : payload;
      const rows: any[] =
        Array.isArray(root?.attendanceDayRows) ? root.attendanceDayRows :
        Array.isArray(root?.sessions) ? root.sessions : [];

      const mappedSessions: AttendanceSession[] = rows.map((r: any) => {
        const id = String(r.id ?? r.attendance_day_id ?? Math.random().toString(36).slice(2));
        
        const ci = parseApiDateUTC(r.first_check_in_time_local_iso ?? r.first_check_in_time ?? r.clock_in);
        const co = parseApiDateUTC(r.last_check_out_time_local_iso ?? r.last_check_out_time ?? r.clock_out);
        
        return { 
          id, 
          checkIn: ci || null, 
          checkOut: co || null 
        };
      }).filter(s => s.checkIn);

      setSessions(mappedSessions);

      const isCurrentlyCheckedIn = rows.some((r: any) => {
        const hasCheckIn = r.first_check_in_time_local_iso ?? r.first_check_in_time ?? r.clock_in;
        const hasCheckOut = r.last_check_out_time_local_iso ?? r.last_check_out_time ?? r.clock_out;
        return !!hasCheckIn && !hasCheckOut;
      });

      const allSessionsCompleted = rows.length > 0 && rows.every((r: any) => {
        const hasCheckIn = r.first_check_in_time_local_iso ?? r.first_check_in_time ?? r.clock_in;
        const hasCheckOut = r.last_check_out_time_local_iso ?? r.last_check_out_time ?? r.clock_out;
        return !!hasCheckIn && !!hasCheckOut;
      });

      let finalIsCheckedIn = isCurrentlyCheckedIn;
      
      if (allSessionsCompleted) {
        finalIsCheckedIn = false;
      }

      const last = mappedSessions.length ? mappedSessions[mappedSessions.length - 1] : null;

      const newAttendanceState = {
        isCheckedIn: finalIsCheckedIn,
        checkInTime: last?.checkIn ?? null,
        checkOutTime: last?.checkOut ?? null
      };

      setTodayAttendance(newAttendanceState);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance');
      console.error('Error fetching today attendance:', err);
    }
  };

  // Handle attendance action (check-in/out) with IP
  const handleAttendanceAction = async () => {
    try {
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      const endpoint = todayAttendance.isCheckedIn ? 
        `${API_BASE_URL}/api/attendance/check-out` : 
        `${API_BASE_URL}/api/attendance/check-in`;

      const response = await postAttendanceWithIp(endpoint, { employee_id: employeeId });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Attendance action failed');
      }

      await fetchTodayAttendance();
      if (onShowNotification) {
        onShowNotification(
          todayAttendance.isCheckedIn ? 'Checked out successfully!' : 'Checked in successfully!',
          'success'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Attendance action failed');
      console.error('Error with attendance action:', err);
      if (onShowNotification) {
        onShowNotification(err instanceof Error ? err.message : 'Attendance action failed', 'error');
      }
    }
  };

  // Fetch attendance statistics
  const fetchAttendanceStats = async () => {
    try {
      setIsStatsLoading(true);

      if (!employeeId && role !== 'admin') {
        console.error('Employee ID is not available for stats');
        return;
      }

      const url = `${API_BASE_URL}/api/attendance/stats?${role === 'admin' ? 'isAdmin=true' : `employee_id=${employeeId}`}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance statistics');
      }

      const data = await response.json();

      const topEmployees = data.top_performers.employees.map((employee: any) => ({
        id: employee.id,
        first_name: employee.name.split(' ')[0] || '',
        last_name: employee.name.split(' ')[1] || '',
        present_days: employee.days_present,
        total_days: 20,
        attendance_rate: employee.attendance_percentage,
        working_days: data.top_performers.working_days
      }));

      const dailyStatsData = data.daily_stats.map((day: any) => ({
        date: format(day.date, 'yyyy-MM-dd'),
        total: day.total_employees,
        present: day.present,
        absent: day.absent,
        late: day.late,
        rate: day.present_rate.toFixed(2)
      }));

      setAttendanceStats({
        ...data,
        overallAttendanceRate: ((data.today.present_count + data.today.late_count) / data.today.total_employees) * 100,
        topEmployees: topEmployees,
        today: {
          present: data.today.present_count,
          total: data.today.total_employees,
          absent: data.today.absent_count,
          late: data.today.late_count,
          partial: data.today.partial_count
        },
        dailyStats: dailyStatsData
      });
    } catch (err) {
      console.error('Error fetching attendance statistics:', err);
      if (onShowNotification) {
        onShowNotification('Failed to load attendance statistics', 'error');
      }
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Fetch attendance history with appeal status
  const fetchAttendanceHistory = async (start?: Date, end?: Date) => {
    try {
      if (!employeeId) {
        setError('Employee ID is not available. Please refresh the page or log in again.');
        return;
      }

      let url = `${API_BASE_URL}/api/attendance/history?employee_id=${employeeId}`;

      if (start && end) {
        const startDate = format(start, 'yyyy-MM-dd');
        const endDate = format(end, 'yyyy-MM-dd');
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

      // First, fetch fresh appeal data to ensure we have latest statuses
      await fetchAppealData();

      // Then process attendance records
      const formattedRecords: AttendanceRecord[] = data.map((record: any) => {
        let date: Date;
        let checkIn: Date | undefined;
        let checkOut: Date | undefined;
        let status: 'present' | 'absent' | 'late' | 'partial' | 'offday';

        date = parseApiDateUTC(record.attendance_date || record.first_check_in_time) || new Date();
        checkIn = record.first_check_in_time ? parseApiDateUTC(record.first_check_in_time) || undefined : undefined;
        checkOut = record.last_check_out_time ? parseApiDateUTC(record.last_check_out_time) || undefined : undefined;

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
          status = 'present';
        }

        // Find appeal for this record
        const recordDateStr = format(date, 'yyyy-MM-dd');
        const appeal = appealData.find(appeal => {
          const appealDateStr = format(new Date(appeal.attendance_date), 'yyyy-MM-dd');
          return appealDateStr === recordDateStr && appeal.attendance_day_id === record.attendance_day_id;
        });

        return {
          date,
          checkIn,
          checkOut,
          status,
          attendanceDayId: record.attendance_day_id,
          first_checkIn: checkIn ? displayTime(checkIn) : '',
          last_checkOut: checkOut ? displayTime(checkOut) : '',
          appealStatus: appeal ? appeal.appeal_status : ''
        };
      });

      setAttendanceRecords(formattedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance history');
      console.error('Error fetching attendance history:', err);
    }
  };

  // Fetch companies
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

  // Fetch departments based on selected company
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedCompany) return;
        
      try {
        const id = selectedCompany;
        const response = await fetch(`${API_BASE_URL}/api/companies/${id}/departments`);

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

  // Fetch department attendance statistics
  const fetchDepartmentAttendance = async (companyId = 0, page = 1, startDate = '', endDate = '') => {
    try {
      let url = `${API_BASE_URL}/api/attendance/department?page=${page}`;

      if (companyId !== 0) {
        url += `&company_id=${companyId}`;
      }

      if (startDate !== '' && endDate !== '') {
        url += `&start_date=${startDate}&end_date=${endDate}`;
      }

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
      });
    } catch (error) {
      console.error('Error fetching department statistics:', error);
    }
  };

  // Fetch appeal data with proper error handling
const fetchAppealData0201 = async () => {
  try {
    console.log('Fetching appeal data...');
    const url = `${API_BASE_URL}/api/attendance/appeal`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Raw appeal data from API:', data);
      
      const formattedAppeals = data.map((item: any) => ({
        ...item,
        id: item.id || item.appeal_id,
        date: item.submitted_date || item.appeal_date,
        attendance_date: item.attendance_date,
        appeal_date: item.requested_check_in || item.appeal_date,
        requested_status: item.requested_status || item.status,
        status: item.attendance_status,
        original_check_in: parseApiDateUTC(item.attendance_check_in || item.original_check_in),
        original_check_out: parseApiDateUTC(item.attendance_check_out || item.original_check_out),
        requested_check_in: parseApiDateUTC(item.requested_check_in),
        requested_check_out: parseApiDateUTC(item.requested_check_out),
        // Handle both 'appeal_status' and 'status' fields from backend
        appeal_status: (item.appeal_status || item.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected' | 'cancel',
        reason: item.appeal_reason || item.reason,
        attendance_day_id: item.attendance_day_id,
        admin_comment: item.admin_comment
      }));
      
      console.log('Formatted appeal data:', formattedAppeals);
      setAppealData(formattedAppeals);
      return formattedAppeals;
    } else {
      console.error('Error fetching appeal data:', response.statusText);
      return [];
    }
  } catch (err) {
    console.error('Error fetching appeal data:', err);
    return [];
  }
};



const fetchAppealData = async () => {
  try {
    console.log('Fetching appeal data...');
    const url = `${API_BASE_URL}/api/attendance/appeal`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Raw appeal API response:', result);
      
      // Handle both response formats
      let appealsArray = [];
      if (result.success && Array.isArray(result.data)) {
        // New format: { success: true, data: [...] }
        appealsArray = result.data;
        console.log('Using success.data format, found', appealsArray.length, 'appeals');
      } else if (Array.isArray(result)) {
        // Old format: direct array
        appealsArray = result;
        console.log('Using direct array format, found', appealsArray.length, 'appeals');
      } else if (result.data && Array.isArray(result.data)) {
        // Alternative format
        appealsArray = result.data;
        console.log('Using result.data format, found', appealsArray.length, 'appeals');
      }
      
      // DEBUG: Log the first appeal to see actual field names
      if (appealsArray.length > 0) {
        console.log('DEBUG - First appeal object keys:', Object.keys(appealsArray[0]));
        console.log('DEBUG - First appeal data:', {
          id: appealsArray[0].id,
          original_check_in: appealsArray[0].original_check_in,
          original_check_out: appealsArray[0].original_check_out,
          requested_check_in: appealsArray[0].requested_check_in,
          requested_check_out: appealsArray[0].requested_check_out,
          attendance_date: appealsArray[0].attendance_date
        });
      }
      
      const formattedAppeals = appealsArray.map((item: any) => {
        // Create the formatted appeal object
        const formattedAppeal = {
          ...item,
          id: item.id || item.appeal_id,
          date: item.submitted_date || item.created_at || item.appeal_date,
          attendance_date: item.attendance_date,
          appeal_date: item.requested_check_in || item.submitted_date || item.appeal_date,
          requested_status: item.requested_status || item.status_name,
          status: item.attendance_status || item.original_status,
          // IMPORTANT: Use the correct field names from backend
          original_check_in: parseApiDateUTC(item.original_check_in),
          original_check_out: parseApiDateUTC(item.original_check_out),
          requested_check_in: parseApiDateUTC(item.requested_check_in),
          requested_check_out: parseApiDateUTC(item.requested_check_out),
          // Handle both 'appeal_status' and 'status' fields
          appeal_status: (item.appeal_status || item.status || 'pending').toLowerCase(),
          reason: item.appeal_reason || item.reason,
          attendance_day_id: item.attendance_day_id,
          admin_comment: item.admin_comment,
          employee_name: item.employee_name,
          employee_no: item.employee_no,
          department_name: item.department_name,
          company_name: item.company_name
        };
        
        // Debug log for each appeal
        console.log('Mapping appeal:', {
          id: formattedAppeal.id,
          original_check_in_raw: item.original_check_in,
          original_check_in_parsed: formattedAppeal.original_check_in,
          original_check_out_raw: item.original_check_out,
          original_check_out_parsed: formattedAppeal.original_check_out
        });
        
        return formattedAppeal;
      });
      
      console.log('Formatted appeal data:', formattedAppeals);
      setAppealData(formattedAppeals);
      return formattedAppeals;
    } else {
      console.error('Error fetching appeal data:', response.statusText);
      return [];
    }
  } catch (err) {
    console.error('Error fetching appeal data:', err);
    return [];
  }
};


  // Handle pagination for departments
  const changeDepartmentPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= departmentStats.pagination.total_pages) {
      setDepartmentPage(newPage);
    }
  };

  // Handle quick date selection for department stats
  const handleQuickDateSelect = (option: string) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (option) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(new Date().setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(today);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        const dayOfWeek = today.getDay();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastWeek':
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        
        startDate = new Date(lastWeekEnd);
        startDate.setDate(lastWeekEnd.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = lastWeekEnd;
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        setActiveQuickDate(null);
        return;
    }
    
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    
    fetchDepartmentAttendance(selectedCompany, departmentPage, formattedStartDate, formattedEndDate);
    setDepartmentDate({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
    
    setActiveQuickDate(option);
  };

// Add this useEffect for debugging appeal data
useEffect(() => {
  console.log('Appeal data updated:', {
    totalAppeals: appealData.length,
    appeals: appealData.map(a => ({
      date: a.attendance_date,
      dayId: a.attendance_day_id,
      status: a.appeal_status
    }))
  });
}, [appealData]);

// Add this useEffect for debugging attendance records
useEffect(() => {
  console.log('Attendance records updated:', {
    totalRecords: attendanceRecords.length,
    records: attendanceRecords.map(r => ({
      date: format(r.date, 'yyyy-MM-dd'),
      dayId: r.attendanceDayId,
      appealStatus: r.appealStatus
    }))
  });
}, [attendanceRecords]);

  // ========== APPEAL FUNCTIONS ==========

  // Function to check if an appeal exists for a record (UPDATED)
// Fix the hasAppealForRecord function to properly match appeals
const hasAppealForRecord0201 = useCallback((record: AttendanceRecord): AppealData | null => {
  if (!record || !appealData || appealData.length === 0) return null;
  
  // Log for debugging
  console.log('Checking appeal for record:', {
    recordDate: format(record.date, 'yyyy-MM-dd'),
    recordId: record.attendanceDayId,
    totalAppeals: appealData.length,
    appeals: appealData.map(a => ({
      appealDate: a.attendance_date ? format(new Date(a.attendance_date), 'yyyy-MM-dd') : 'No date',
      appealDayId: a.attendance_day_id,
      status: a.appeal_status
    }))
  });
  
  const recordDateStr = format(record.date, 'yyyy-MM-dd');
  
  // Find appeal with matching date AND attendanceDayId
  const appeal = appealData.find(appeal => {
    if (!appeal.attendance_date) return false;
    
    const appealDate = new Date(appeal.attendance_date);
    const appealDateStr = format(appealDate, 'yyyy-MM-dd');
    const hasMatchingDate = appealDateStr === recordDateStr;
    const hasMatchingId = appeal.attendance_day_id === record.attendanceDayId;
    
    console.log('Appeal comparison:', {
      appealDateStr,
      recordDateStr,
      hasMatchingDate,
      hasMatchingId,
      appealDayId: appeal.attendance_day_id,
      recordDayId: record.attendanceDayId
    });
    
    return hasMatchingDate && hasMatchingId;
  });
  
  console.log('Found appeal?', appeal ? 'Yes' : 'No');
  return appeal || null;
}, [appealData]);

const hasAppealForRecord = useCallback((record: AttendanceRecord): AppealData | null => {
  if (!record || !appealData || appealData.length === 0) return null;
  
  const recordDateStr = format(record.date, 'yyyy-MM-dd');
  
  console.log('Checking appeal for record:', {
    recordDate: recordDateStr,
    recordId: record.attendanceDayId,
    totalAppeals: appealData.length
  });
  
  // Find appeal with matching date AND attendanceDayId
  const appeal = appealData.find(appeal => {
    if (!appeal.attendance_date) return false;
    
    try {
      const appealDate = new Date(appeal.attendance_date);
      const appealDateStr = format(appealDate, 'yyyy-MM-dd');
      const hasMatchingDate = appealDateStr === recordDateStr;
      const hasMatchingId = appeal.attendance_day_id === record.attendanceDayId;
      
      if (hasMatchingDate && hasMatchingId) {
        console.log('Found matching appeal:', {
          appealDateStr,
          appealDayId: appeal.attendance_day_id,
          appealStatus: appeal.appeal_status
        });
      }
      
      return hasMatchingDate && hasMatchingId;
    } catch (error) {
      console.error('Error parsing appeal date:', error);
      return false;
    }
  });
  
  console.log('Found appeal?', appeal ? 'Yes' : 'No');
  return appeal || null;
}, [appealData]);

const debugAppealData = () => {
  console.log('=== DEBUG APPEAL DATA ===');
  console.log('Appeal Data:', appealData);
  console.log('Attendance Records:', attendanceRecords.map(r => ({
    date: format(r.date, 'yyyy-MM-dd'),
    dayId: r.attendanceDayId,
    appealStatus: r.appealStatus
  })));
  
  // Check for a specific record
  if (attendanceRecords.length > 0) {
    const testRecord = attendanceRecords[0];
    const appeal = hasAppealForRecord(testRecord);
    console.log('Test record appeal check:', {
      record: format(testRecord.date, 'yyyy-MM-dd'),
      dayId: testRecord.attendanceDayId,
      foundAppeal: appeal,
      appealStatus: appeal?.appeal_status
    });
  }
};

  // Function to check if a record can have an appeal (only past dates)
const canHaveAppeal = (record: AttendanceRecord): boolean => {
  if (!record) return false;
  
  console.log('Checking if record can have appeal:', {
    recordDate: format(record.date, 'yyyy-MM-dd'),
    recordId: record.attendanceDayId,
    isPastDate: isPastDate(record.date)
  });
  
  // Only allow appeals for past dates, not today or future
  if (!isPastDate(record.date)) {
    console.log('Cannot appeal: Date is not past');
    return false;
  }
  
  // Check if an appeal already exists
  const existingAppeal = hasAppealForRecord(record);
  
  console.log('Existing appeal check:', existingAppeal ? {
    status: existingAppeal.appeal_status,
    canAppeal: existingAppeal.appeal_status === 'cancel'
  } : 'No existing appeal');
  
  // Can submit appeal if no appeal exists OR if existing appeal is cancelled
  if (!existingAppeal) {
    console.log('Can appeal: No existing appeal');
    return true;
  }
  
  // Can submit new appeal if previous one was cancelled
  if (existingAppeal.appeal_status === 'cancel') {
    console.log('Can appeal: Previous appeal was cancelled');
    return true;
  }
  
  // Cannot submit appeal if pending, approved, or rejected appeal exists
  console.log('Cannot appeal: Existing appeal with status', existingAppeal.appeal_status);
  return false;
};

  // Function to get action button text and handler for a record
  const getAppealActionForRecord = (record: AttendanceRecord): {
    text: string;
    handler: () => void;
    disabled: boolean;
    variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  } => {
    const existingAppeal = hasAppealForRecord(record);
    const canAppeal = canHaveAppeal(record);
    
    if (existingAppeal) {
      return {
        text: 'View Appeal',
        handler: () => openEmployeeAppealViewModal(existingAppeal),
        disabled: false,
        variant: 'outline'
      };
    } else if (canAppeal) {
      return {
        text: 'Submit Appeal',
        handler: () => openAppealRequestModal(record),
        disabled: false,
        variant: 'primary'
      };
    } else {
      return {
        text: 'No Appeal',
        handler: () => {},
        disabled: true,
        variant: 'ghost'
      };
    }
  };

  // Function to open appeal request modal
  const openAppealRequestModal0201 = (record: AttendanceRecord) => {
    // Check if appeal is allowed for this record
    if (!canHaveAppeal(record)) {
      if (onShowNotification) {
        onShowNotification('Appeals can only be submitted for past attendance records', 'error');
      }
      return;
    }

    const date = format(record.date, 'yyyy-MM-dd');

    // Format check-in/out times for form
    const originalCheckIn = record.checkIn
      ? format(record.checkIn, 'HH:mm')
      : null;

    const originalCheckOut = record.checkOut
      ? format(record.checkOut, 'HH:mm')
      : null;

    // Initialize form with current values
    setAppealRequestData({
      employeeId: employeeId,
      attendanceDayId: record.attendanceDayId,
      date: date,
      originalCheckIn: originalCheckIn,
      originalCheckOut: originalCheckOut,
      requestedCheckIn: originalCheckIn || '09:00',
      requestedCheckOut: originalCheckOut || '18:00',
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

const openAppealRequestModal = (record: AttendanceRecord) => {
  // Check if appeal is allowed for this record
  if (!canHaveAppeal(record)) {
    if (onShowNotification) {
      onShowNotification('Appeals can only be submitted for past attendance records', 'error');
    }
    return;
  }

  const date = format(record.date, 'yyyy-MM-dd');

  // Get check-in/out times FROM THE ATTENDANCE RECORD
  // These are already displayed correctly in the table
  const originalCheckIn = record.checkIn
    ? displayTime(record.checkIn).replace(/[^0-9:APM ]/g, '')
    : null;

  const originalCheckOut = record.checkOut
    ? displayTime(record.checkOut).replace(/[^0-9:APM ]/g, '')
    : null;

  console.log('Opening appeal modal:', {
    recordDate: date,
    originalCheckIn: originalCheckIn,
    originalCheckOut: originalCheckOut,
    checkInRaw: record.checkIn,
    checkOutRaw: record.checkOut
  });

  // Initialize form with current values
  // For requested times, use the same as original or default work hours
  setAppealRequestData({
    employeeId: employeeId,
    attendanceDayId: record.attendanceDayId,
    date: date,
    originalCheckIn: originalCheckIn,
    originalCheckOut: originalCheckOut,
    // Use the same times as original for consistency
    requestedCheckIn: originalCheckIn ? originalCheckIn.split(' ')[0] : '09:00',
    requestedCheckOut: originalCheckOut ? originalCheckOut.split(' ')[0] : '18:00',
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

  // Function to handle form input changes
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

  // Function to validate form
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
    } else if (appealRequestData.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
      isValid = false;
    }

    setAppealRequestErrors(errors);
    return isValid;
  };

  // Function to submit appeal request (UPDATED to refresh data properly)
const submitAppealRequest0201 = async () => {
  // Validate form
  if (!validateAppealForm()) {
    return;
  }

  try {
    setIsAppealSubmitting(true);

    // Prepare data for API
    const payload = {
      employee_id: appealRequestData.employeeId,
      attendance_day_id: appealRequestData.attendanceDayId,
      appeal_reason: appealRequestData.reason,
      request_check_in: `${appealRequestData.date}T${appealRequestData.requestedCheckIn}:00`,
      request_check_out: `${appealRequestData.date}T${appealRequestData.requestedCheckOut}:00`,
      original_check_in: appealRequestData.originalCheckIn ? 
        `${appealRequestData.date}T${appealRequestData.originalCheckIn}:00` : null,
      original_check_out: appealRequestData.originalCheckOut ? 
        `${appealRequestData.date}T${appealRequestData.originalCheckOut}:00` : null
    };

    console.log('Submitting appeal with payload:', payload);

    // Make API call
    const response = await fetch(`${API_BASE_URL}/api/attendance/appeal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to submit appeal request');
    }

    console.log('Appeal submission response:', responseData);

    // Close modal
    setIsAppealRequestModalOpen(false);
    
    // Show success notification
    if (onShowNotification) {
      onShowNotification('Appeal request submitted successfully! It will be reviewed by admin.', 'success');
    }
    
    // CRITICAL: Refresh appeal data first, then attendance
    await fetchAppealData();
    
    // Force immediate re-evaluation by updating the appealData reference
    setAppealData(prev => {
      // Create a new array to trigger re-render
      const newArray = [...prev];
      console.log('Updating appealData array, length:', newArray.length);
      return newArray;
    });
    
    // Refresh attendance history with a small delay to ensure appeal data is loaded
    setTimeout(async () => {
      await fetchAttendanceHistory();
    }, 500);

  } catch (error) {
    console.error('Error submitting appeal request:', error);
    if (onShowNotification) {
      onShowNotification(
        error instanceof Error ? error.message : 'Failed to submit appeal request. Please try again.',
        'error'
      );
    }
  } finally {
    setIsAppealSubmitting(false);
  }
};

const submitAppealRequest = async () => {
  // Validate form
  if (!validateAppealForm()) {
    return;
  }

  try {
    setIsAppealSubmitting(true);

    // Convert local times to UTC
    const requestedCheckInUTC = localTimeToUTC(appealRequestData.date, appealRequestData.requestedCheckIn);
    const requestedCheckOutUTC = localTimeToUTC(appealRequestData.date, appealRequestData.requestedCheckOut);
    
    console.log('Time conversion for appeal:', {
      date: appealRequestData.date,
      requestedCheckInLocal: appealRequestData.requestedCheckIn,
      requestedCheckOutLocal: appealRequestData.requestedCheckOut,
      requestedCheckInUTC: requestedCheckInUTC,
      requestedCheckOutUTC: requestedCheckOutUTC
    });

    // Prepare data for API
    const payload = {
      employee_id: appealRequestData.employeeId,
      attendance_day_id: appealRequestData.attendanceDayId,
      appeal_reason: appealRequestData.reason,
      request_check_in: requestedCheckInUTC,
      request_check_out: requestedCheckOutUTC,
      original_check_in: null, // These will be fetched from attendance_days by backend
      original_check_out: null
    };

    console.log('Submitting appeal with payload:', payload);

    // Make API call
    const response = await fetch(`${API_BASE_URL}/api/attendance/appeal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to submit appeal request');
    }

    console.log('Appeal submission response:', responseData);

    // Close modal
    setIsAppealRequestModalOpen(false);
    
    // Show success notification
    if (onShowNotification) {
      onShowNotification('Appeal request submitted successfully! It will be reviewed by admin.', 'success');
    }
    
    // Refresh all data
    await Promise.all([
      fetchAppealData(),
      fetchAttendanceHistory(),
      fetchTodayAttendance()
    ]);

  } catch (error) {
    console.error('Error submitting appeal request:', error);
    if (onShowNotification) {
      onShowNotification(
        error instanceof Error ? error.message : 'Failed to submit appeal request. Please try again.',
        'error'
      );
    }
  } finally {
    setIsAppealSubmitting(false);
  }
};

  // Function to open employee appeal view modal
  const openEmployeeAppealViewModal0201 = (appeal: AppealData) => {
    setIsEmployeeAppealViewModalOpen(true);

    setSelectedEmployeeAppeal({
      ...appeal,
      admin_comment: appeal.admin_comment || '',
      appeal_status: appeal.appeal_status.toLowerCase() as "pending" | "approved" | "rejected" | "cancel"
    });

    // Reset edit mode and populate edit data
    setIsEditingAppeal(false);
    setEditedAppealData({
      requestedCheckIn: appeal.requested_check_in ? format(new Date(appeal.requested_check_in), 'HH:mm') : '',
      requestedCheckOut: appeal.requested_check_out ? format(new Date(appeal.requested_check_out), 'HH:mm') : '',
      reason: appeal.reason || ''
    });
  };

  
const openEmployeeAppealViewModal = (appeal: AppealData) => {
  setIsEmployeeAppealViewModalOpen(true);

  setSelectedEmployeeAppeal({
    ...appeal,
    admin_comment: appeal.admin_comment || '',
    appeal_status: appeal.appeal_status.toLowerCase() as "pending" | "approved" | "rejected" | "cancel"
  });

  // Use the new dedicated function for converting appeal times
  const requestedCheckInLocal = appeal.requested_check_in ? 
    appealTimeToLocalInput(appeal.requested_check_in) : '';
  
  const requestedCheckOutLocal = appeal.requested_check_out ? 
    appealTimeToLocalInput(appeal.requested_check_out) : '';

  // Also get the original times converted to local
  const originalCheckInLocal = appeal.original_check_in ? 
    appealTimeToLocalInput(appeal.original_check_in) : '';
  
  const originalCheckOutLocal = appeal.original_check_out ? 
    appealTimeToLocalInput(appeal.original_check_out) : '';

  console.log('Opening appeal view modal with times:', {
    appealId: appeal.id,
    // Original times
    originalCheckInUTC: appeal.original_check_in,
    originalCheckOutUTC: appeal.original_check_out,
    originalCheckInLocal,
    originalCheckOutLocal,
    // Requested times
    requestedCheckInUTC: appeal.requested_check_in,
    requestedCheckOutUTC: appeal.requested_check_out,
    requestedCheckInLocal,
    requestedCheckOutLocal,
    // Raw data for debugging
    appealData: {
      original_check_in: appeal.original_check_in,
      original_check_out: appeal.original_check_out,
      requested_check_in: appeal.requested_check_in,
      requested_check_out: appeal.requested_check_out
    }
  });

  // Reset edit mode and populate edit data with local times
  setIsEditingAppeal(false);
  setEditedAppealData({
    requestedCheckIn: requestedCheckInLocal,
    requestedCheckOut: requestedCheckOutLocal,
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

  // Function to save appeal changes (UPDATED to refresh data)
  const saveAppealChanges0201 = async () => {
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appeal');
      }

      // Update the local state with edited values
      const updatedAppeal = {
        ...selectedEmployeeAppeal,
        requested_check_in: requestedCheckIn || undefined,
        requested_check_out: requestedCheckOut || undefined,
        reason: editedAppealData.reason
      };
      setSelectedEmployeeAppeal(updatedAppeal);

      // Update appeal data array
      setAppealData(prevData =>
        prevData.map(item =>
          item.id === selectedEmployeeAppeal.id ? updatedAppeal : item
        )
      );

      // Exit edit mode
      setIsEditingAppeal(false);

      // Show success notification
      if (onShowNotification) {
        onShowNotification('Appeal updated successfully', 'success');
      }

      // Refresh attendance history to update appeal status in records
      await fetchAttendanceHistory();

    } catch (error) {
      console.error('Error updating appeal:', error);
      if (onShowNotification) {
        onShowNotification('Failed to update appeal', 'error');
      }
    }
  };

const saveAppealChanges = async () => {
  if (!selectedEmployeeAppeal) return;

  try {
    // Convert local times to UTC
    const appealDate = new Date(selectedEmployeeAppeal.attendance_date);
    const dateStr = format(appealDate, 'yyyy-MM-dd');
    
    const requestedCheckInUTC = localTimeToUTC(dateStr, editedAppealData.requestedCheckIn);
    const requestedCheckOutUTC = localTimeToUTC(dateStr, editedAppealData.requestedCheckOut);

    console.log('Updating appeal times:', {
      dateStr,
      requestedCheckInLocal: editedAppealData.requestedCheckIn,
      requestedCheckOutLocal: editedAppealData.requestedCheckOut,
      requestedCheckInUTC,
      requestedCheckOutUTC
    });

    const payload = {
      appeal_id: selectedEmployeeAppeal.id,
      request_check_in: requestedCheckInUTC,
      request_check_out: requestedCheckOutUTC,
      appeal_reason: editedAppealData.reason
    };

    console.log('Updating appeal with payload:', payload);

    const response = await fetch(`${API_BASE_URL}/api/attendance/appeal/edit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update appeal');
    }

    const responseData = await response.json();
    console.log('Update appeal response:', responseData);

    // Refresh appeal data
    await fetchAppealData();
    
    // Refresh attendance history
    await fetchAttendanceHistory();

    // Exit edit mode
    setIsEditingAppeal(false);

    // Show success notification
    if (onShowNotification) {
      onShowNotification('Appeal updated successfully', 'success');
    }

  } catch (error) {
    console.error('Error updating appeal:', error);
    if (onShowNotification) {
      onShowNotification('Failed to update appeal', 'error');
    }
  }
};

  // Function to cancel an appeal (FIXED function name and logic)
  const cancelEmployeeAppeal = async () => {
    if (!selectedEmployeeAppeal) return;

    if (!window.confirm('Are you sure you want to cancel this appeal? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/appeal/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
        },
        body: JSON.stringify({ appeal_id: selectedEmployeeAppeal.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel appeal');
      }

      // Update the appeal status locally
      const updatedAppeal = {
        ...selectedEmployeeAppeal,
        appeal_status: 'cancel' as const
      };
      setSelectedEmployeeAppeal(updatedAppeal);

      // Update appeal data array
      setAppealData(prevData =>
        prevData.map(item =>
          item.id === selectedEmployeeAppeal.id ? updatedAppeal : item
        )
      );

      // Close the modal
      setIsEmployeeAppealViewModalOpen(false);

      // Show success notification
      if (onShowNotification) {
        onShowNotification('Appeal cancelled successfully', 'success');
      }

      // Refresh attendance history to update appeal status in records
      await fetchAttendanceHistory();

    } catch (error) {
      console.error('Error cancelling appeal:', error);
      if (onShowNotification) {
        onShowNotification('Failed to cancel appeal', 'error');
      }
    }
  };

  // ========== PAGINATION FUNCTIONS ==========

  // Function to handle attendance records page navigation
  const goToRecordsPage = (pageNumber: number) => {
    const totalRecordPages = Math.ceil(totalRecords / recordsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalRecordPages) {
      setAttendanceRecordsPage(pageNumber);
    }
  };

  // Calculate pagination for attendance records
  const indexOfLastRecord = attendanceRecordsPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  
  const currentAttendanceRecords = attendanceRecords
    .filter(record => {
      const today = new Date();
      const recordDate = record.date;
      return format(recordDate, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
    })
    .slice(indexOfFirstRecord, indexOfLastRecord);

  const totalRecords = attendanceRecords.filter(record => {
    const today = new Date();
    const recordDate = record.date;
    return format(recordDate, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
  }).length;

  const totalRecordPages = Math.ceil(totalRecords / recordsPerPage);

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

  // Calculate working hours for a session
  const calculateWorkingHours = (checkIn: Date | null, checkOut: Date | null, isActiveSession: boolean = false): string => {
    if (!checkIn) return '--';
    
    const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
    const start = toZonedTime(checkIn, tz);
    const end = checkOut 
      ? toZonedTime(checkOut, tz)
      : (isActiveSession && todayAttendance.isCheckedIn) 
        ? toZonedTime(currentTime, tz)
        : start;
    
    const diffHrs = differenceInHours(end, start);
    const diffMins = differenceInMinutes(end, start) % 60;
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // Initial data fetching
  useEffect(() => {
    if (employeeId) {
      fetchTodayAttendance();
      fetchAttendanceHistory();
      fetchAppealData();
      if (role === 'admin' || role === 'manager') {
        fetchAttendanceStats();
        if (role === 'admin') {
          fetchCompanies();
        }
      }
    }
  }, [employeeId, role]);

  // Fetch department statistics when company or page changes
  useEffect(() => {
    if ((role === 'admin' || role === 'manager') && companies.length > 0) {
      fetchDepartmentAttendance(selectedCompany, departmentPage, departmentDate.startDate, departmentDate.endDate);
    }
  }, [selectedCompany, departmentPage, role, companies.length]);

  // Listen for appeal data changes to refresh attendance records
  useEffect(() => {
    // When appeal data changes, refresh attendance history to update appeal statuses
    if (appealData.length > 0 || appealData.length === 0) {
      // This will cause attendance records to re-evaluate appeal status
      const refreshAttendance = async () => {
        if (employeeId) {
          await fetchAttendanceHistory();
        }
      };
      refreshAttendance();
    }
  }, [appealData.length]); // Trigger when appeal data changes

  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-900'} p-6`}>
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

      {/* Header with stats for non-admin users */}
      {role !== 'admin' && (
        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
              Attendance Management
            </h1>

            {/* Timezone info */}
            {employee?.time_zone && (
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                Timezone: {employee.time_zone.replace('_', ' ')}
              </div>
            )}

            {/* Check-in/out action button */}
            {allSessionsCompleted && !todayAttendance.isCheckedIn ? (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-md ${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900/30 text-blue-300'}`}>
                <span className="text-sm font-medium">Attendance Completed</span>
              </div>
            ) : (
              <button
                onClick={handleAttendanceAction}
                className={`btn ${todayAttendance.isCheckedIn ? 'btn-error' : 'btn-success'} text-white px-6 py-2 rounded-md`}
              >
                {todayAttendance.isCheckedIn ? 'Check Out' : 'Check In'}
              </button>
            )}
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
                <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{displayTime(todayAttendance.checkInTime)}</span>
              </div>
              <div className="flex flex-col">                  
                <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check Out Time</span>     
                <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{displayTime(todayAttendance.checkOutTime)}</span>               
              </div>             
              <div className="flex flex-col">            
                <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Working Hours</span>                
                <WorkingTimeCounter 
                  sessions={sessions.map(s => ({ 
                    id: s.id, 
                    checkIn: s.checkIn || null, 
                    checkOut: s.checkOut || null 
                  }))} 
                  isCheckedIn={todayAttendance.isCheckedIn} 
                  className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`} 
                  displayFormat="digital" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content for non-admin users */}
      {role !== 'admin' && (
        <div className="grid grid-cols-1 gap-8">
          {/* Calendar */}
          <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="card-body">
              <header className={`flex flex-col sm:flex-row items-center sm:justify-between py-4 mb-4 gap-3 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-slate-600'}`}>
                <h2 className={`text-lg sm:text-xl font-semibold flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap">Attendance Calendar</span>
                </h2>

                <div className="flex items-center">
{/* <button 
  onClick={debugAppealData}
  className="btn btn-sm btn-warning"
>
  Debug Appeals
</button> */}

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
                    const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
                    const firstDayToShow = new Date(firstDayOfMonth);
                    firstDayToShow.setDate(firstDayToShow.getDate() - firstDayToShow.getDay());
                    
                    const days = [];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    for (let i = 0; i < 42; i++) {
                      const currentDate = new Date(firstDayToShow);
                      currentDate.setDate(currentDate.getDate() + i);
                      
                      const isCurrentMonth = currentDate.getMonth() === calendarDate.getMonth();
                      const isToday = format(currentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                      const isSelected = format(calendarDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
                      
                      const formattedDate = format(currentDate, 'yyyy-MM-dd');
                      const record = attendanceRecords.find(r => {
                        const recordDate = r.date;
                        return format(recordDate, 'yyyy-MM-dd') === formattedDate;
                      });
                      
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
                      
                      days.push(
                        <div
                          key={formattedDate}
                          className={`
                            relative px-3 py-2 cursor-pointer h-16 w-full
                            ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-600'}
                            ${bgClass} ${statusClass} 
                            ${isSelected ? `ring-2 ${theme === 'light' ? 'ring-indigo-600' : 'ring-blue-400'}` : ''}
                          `}
                          onClick={() => {
                            setCalendarDate(currentDate);
                          }}
                        >
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
                          </div>
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
              
              {/* Selected date details - WITH FIXED APPEAL BUTTONS */}
              <div className={`mt-4 p-4 rounded-lg shadow-sm ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-slate-700 border border-slate-600'}`}>
                <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  {format(calendarDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {(() => {
                  const formattedSelectedDate = format(calendarDate, 'yyyy-MM-dd');
                  const selectedRecord = attendanceRecords.find(r => {
                    const recordDate = r.date;
                    return format(recordDate, 'yyyy-MM-dd') === formattedSelectedDate;
                  });
                  
                  if (selectedRecord) {
                    const appealAction = getAppealActionForRecord(selectedRecord);
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Status:</span>
                            <span className={`ml-2 badge ${getStatusBadgeClass(selectedRecord.status)}`}>
                              {selectedRecord.status}
                            </span>
                          </div>
                          <div>
                            <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Action:</span>
                            <span className="ml-2">

                              
                              {!appealAction.disabled ? (
                                <button
                                  className={`btn btn-xs btn-${appealAction.variant}`}
                                  onClick={appealAction.handler}
                                  disabled={appealAction.disabled}
                                >
                                  {appealAction.text}
                                </button>

                                
                              ) : (
                                <span className="text-xs text-gray-500">{appealAction.text}</span>
                              )}
                            </span>
                          </div>
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

          {/* Attendance Records Table - WITH FIXED APPEAL BUTTONS */}
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
                      <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Today's sessions - NO APPEAL BUTTONS FOR TODAY */}
                    {(sessions || []).map((session, idx) => (
                      <tr key={session.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${idx === 0 ? 'border-l-4 border-green-400' : ''} ${idx !== (sessions || []).length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
                        <td>
                          <>
                            <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Today</div>
                            <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                              {format(new Date(), 'EEEE')}
                            </div>
                          </>
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {session.checkIn
                            ? displayTime(session.checkIn)
                            : '--'}
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {session.checkOut
                            ? displayTime(session.checkOut)
                            : '--'}
                        </td>
                        <td className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {calculateWorkingHours(session.checkIn, session.checkOut, idx === sessions.length - 1 && todayAttendance.isCheckedIn)}
                        </td>
                        <td>
                          <span className={`badge ${!session.checkOut && idx === sessions.length - 1 && todayAttendance.isCheckedIn ? 'badge-success animate-pulse' : 'badge-info'}`}>
                            {!session.checkOut && idx === sessions.length - 1 && todayAttendance.isCheckedIn ? 'Active' : 'Complete'}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-success">Present</span>
                        </td>
                        <td>
                          <span className="text-gray-500 text-sm">-</span>
                        </td>
                        <td>
                          <span className="text-gray-500 text-sm">Not allowed</span>
                        </td>
                      </tr>
                    ))}

                    {/* Previous records */}
                    {currentAttendanceRecords.map((record, index) => {
                      const workingHours = calculateWorkingHours(record.checkIn || null, record.checkOut || null, false);
                      const appealAction = getAppealActionForRecord(record);
                      const appealStatus = getAppealStatusDisplay(record.appealStatus);

                      return (
                        <tr key={index} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentAttendanceRecords.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
                          <td>
                            <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDateInEmployeeTZ(record.date)}</div>
                            <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                              {formatDayInEmployeeTZ(record.date)}
                            </div>
                          </td>
                          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                            {record.checkIn
                              ? displayTime(record.checkIn)
                              : '--'}
                          </td>
                          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                            {record.checkOut
                              ? displayTime(record.checkOut)
                              : '--'}
                          </td>
                          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{workingHours}</td>
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
                            {appealStatus.isBadge ? (
                              <span className={appealStatus.className}>
                                {appealStatus.display}
                              </span>
                            ) : (
                              <span className={appealStatus.className}>
                                {appealStatus.display}
                              </span>
                            )}
                          </td>
                          <td>
                            {!appealAction.disabled ? (
                              <button
                                className={`btn btn-xs btn-${appealAction.variant}`}
                                onClick={appealAction.handler}
                                disabled={appealAction.disabled}
                              >
                                {appealAction.text}
                              </button>
                            ) : (
                              <span className="text-xs text-gray-500">{appealAction.text}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Pagination for attendance records */}
                    {totalRecords > 0 && (
                      <tr>
                        <td colSpan={8}>
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

      {/* Show analytics for manager role only */}
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
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eee" strokeWidth="3.8"></circle>
                          {(function CircleSegments() {
                            const selectedDayData = attendanceStats.dailyStats.find(d => d.date === selectedDay);
                            if (!selectedDayData) return null;

                            const total = selectedDayData.total || 1;
                            const presentPercentage = Math.round((selectedDayData.present - selectedDayData.late) / total * 100);
                            const latePercentage = Math.round(selectedDayData.late / total * 100);

                            const circumference = 2 * Math.PI * 15.9;
                            const offset = circumference * 0.25;

                            const presentLength = circumference * (presentPercentage / 100);
                            const lateLength = circumference * (latePercentage / 100);

                            return (
                              <>
                                <circle
                                  cx="18" cy="18" r="15.9"
                                  fill="none"
                                  stroke="#4ade80"
                                  strokeWidth="3.8"
                                  strokeDasharray={`${presentLength} ${circumference - presentLength}`}
                                  strokeDashoffset={offset}
                                  className="transform -rotate-90 origin-center"
                                />
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

                {/* Department Comparison for admin */}
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
                                  onClick={() => handleQuickDateSelect('yesterday')}
                                >
                                  Yesterday
                                </button>
                                <button 
                                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'today' ? 'btn-primary' : ''}`}
                                  onClick={() => handleQuickDateSelect('today')}
                                >
                                  Today
                                </button>
                                <button 
                                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastWeek' ? 'btn-primary' : ''}`}
                                  onClick={() => handleQuickDateSelect('lastWeek')}
                                >
                                  Last Week
                                </button>
                                <button 
                                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisWeek' ? 'btn-primary' : ''}`}
                                  onClick={() => handleQuickDateSelect('thisWeek')}
                                >
                                  This Week
                                </button>
                                <button 
                                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'lastMonth' ? 'btn-primary' : ''}`}
                                  onClick={() => handleQuickDateSelect('lastMonth')}
                                >
                                  Last Month
                                </button>
                                <button 
                                  className={`join-item btn btn-sm whitespace-nowrap ${activeQuickDate === 'thisMonth' || activeQuickDate === null ? 'btn-primary' : ''}`}
                                  onClick={() => handleQuickDateSelect('thisMonth')}
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
                            onChange={(e) => setSelectedCompany(parseInt(e.target.value))}
                          >
                            <option value={0}>All Companies</option>
                            {companies.map((company) => (
                              <option key={company.id} value={parseInt(company.id)}>
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
                              <>
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
                              </>
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

      {/* Appeal Request Modal */}
      {isAppealRequestModalOpen && (
        <div className="modal modal-open">
          <div className={`modal-box relative max-w-xl rounded-lg shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className={`flex justify-between items-center border-b pb-3 mb-4 ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
              <h3 className={`font-bold text-lg flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Submit Attendance Appeal
              </h3>
              <button
                className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-700'}`}
                onClick={() => setIsAppealRequestModalOpen(false)}
                disabled={isAppealSubmitting}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className={`flex flex-wrap justify-between items-center p-3 rounded-md ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'}`}>
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

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Time Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'}`}>
                    <h5 className={`text-xs font-medium mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>Original Records</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-in</label>
                        <div className={`border rounded px-3 py-2 ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}>
                          {/* {appealRequestData.originalCheckIn
                            ? format(parseISO(appealRequestData.date + 'T' + appealRequestData.originalCheckIn), 'hh:mm a')
                            : '--:--'} */}
                            {appealRequestData.originalCheckIn || '--:--'}
                        </div>
                      </div>
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out</label>
                        <div className={`border rounded px-3 py-2 ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}>
                          {/* {appealRequestData.originalCheckOut
                            ? format(parseISO(appealRequestData.date + 'T' + appealRequestData.originalCheckOut), 'hh:mm a')
                            : '--:--'} */}
                            {appealRequestData.originalCheckOut || '--:--'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/30'}`}>
                    <h5 className={`text-xs font-medium mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>Requested Changes</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-in</label>
                        <input
                          type="time"
                          name="requestedCheckIn"
                          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${appealRequestErrors.requestedCheckIn ? 'input-error' : ''
                            }`}
                          value={appealRequestData.requestedCheckIn}
                          onChange={handleAppealInputChange}
                        />
                        {appealRequestErrors.requestedCheckIn && (
                          <div className="text-xs text-error mt-1">
                            {appealRequestErrors.requestedCheckIn}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out</label>
                        <input
                          type="time"
                          name="requestedCheckOut"
                          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${appealRequestErrors.requestedCheckOut ? 'input-error' : ''
                            }`}
                          value={appealRequestData.requestedCheckOut}
                          onChange={handleAppealInputChange}
                        />
                        {appealRequestErrors.requestedCheckOut && (
                          <div className="text-xs text-error mt-1">
                            {appealRequestErrors.requestedCheckOut}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Reason for Appeal</h4>
                </div>
                <textarea
                  name="reason"
                  className={`textarea textarea-bordered w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-700 border-slate-600 text-slate-100'} ${appealRequestErrors.reason ? 'textarea-error' : ''
                    }`}
                  placeholder="Please provide a detailed reason for your appeal request. Minimum 10 characters required."
                  value={appealRequestData.reason}
                  onChange={handleAppealInputChange}
                  rows={3}
                ></textarea>
                {appealRequestErrors.reason && (
                  <div className="text-xs text-error mt-1">
                    {appealRequestErrors.reason}
                  </div>
                )}
                <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                  Provide specific details about why you need to appeal your attendance
                </div>
              </div>
            </div>

            <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
              <button
                type="button"
                className={`btn btn-outline ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                onClick={() => setIsAppealRequestModalOpen(false)}
                disabled={isAppealSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'} ${isAppealSubmitting ? 'loading' : ''}`}
                onClick={submitAppealRequest}
                disabled={isAppealSubmitting}
              >
                {isAppealSubmitting ? 'Submitting...' : 'Submit Appeal'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !isAppealSubmitting && setIsAppealRequestModalOpen(false)}></div>
        </div>
      )}

{isEmployeeAppealViewModalOpen && selectedEmployeeAppeal && (
  <div className="modal modal-open">
    <div className={`modal-box relative max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
      <button 
        onClick={() => setIsEmployeeAppealViewModalOpen(false)} 
        className={`btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-700'}`}
      >
        ✕
      </button>

      <h3 className="font-bold text-lg mb-4">
        Appeal Details
        <span className={`badge badge-lg ml-3 ${selectedEmployeeAppeal.appeal_status === 'approved' ? 'badge-success' :
            selectedEmployeeAppeal.appeal_status === 'rejected' ? 'badge-error' :
              selectedEmployeeAppeal.appeal_status === 'cancel' ? 'badge-neutral' :
              'badge-warning'
          }`}>
          {selectedEmployeeAppeal.appeal_status.toUpperCase()}
        </span>
      </h3>

      <div className="space-y-4">
        {/* Header Information */}
        <div className={`stats stats-vertical lg:stats-horizontal shadow w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
          <div className="stat">
            <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Employee</div>
            <div className={`stat-value text-base ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
              {selectedEmployeeAppeal.employee_name}
            </div>
            <div className={`stat-desc ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
              {selectedEmployeeAppeal.employee_no} • {selectedEmployeeAppeal.department_name}
            </div>
          </div>
          <div className="stat">
            <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Attendance Date</div>
            <div className={`stat-value text-base ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
              {selectedEmployeeAppeal.attendance_date ?
                format(new Date(selectedEmployeeAppeal.attendance_date), 'dd/MM/yyyy') : ''}
            </div>
            <div className={`stat-desc ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
              {selectedEmployeeAppeal.attendance_date ?
                format(new Date(selectedEmployeeAppeal.attendance_date), 'EEEE') : ''}
            </div>
          </div>
          <div className="stat">
            <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Requested Status</div>
            <div className={`stat-value text-base capitalize ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
              {selectedEmployeeAppeal.requested_status}
            </div>
            <div className={`stat-desc ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
              {/* Use original attendance status if available, otherwise show static text */}
              {selectedEmployeeAppeal.attendance_date ? 'Date: ' + format(new Date(selectedEmployeeAppeal.attendance_date), 'dd/MM') : 'Appeal'}
            </div>
          </div>
        </div>

        {/* Time Details Section */}
        <div className={`collapse collapse-arrow border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-600 bg-slate-700'}`}>
          <input type="checkbox" defaultChecked />
          <div className={`collapse-title font-medium flex items-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Details
          </div>
          <div className="collapse-content">
            {/* Original Attendance Records */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                Original Attendance Records
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-slate-600 border border-slate-500'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-in</p>
                      <p className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {selectedEmployeeAppeal.original_check_in ?
                          displayAppealTime(selectedEmployeeAppeal.original_check_in) :
                          'Not recorded'}
                      </p>
                    </div>
                    {selectedEmployeeAppeal.original_check_in && (
                      <span className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-slate-500 text-slate-300'}`}>
                        {/* Safe date formatting with null check */}
                        UTC: {selectedEmployeeAppeal.original_check_in ? format(new Date(selectedEmployeeAppeal.original_check_in), 'HH:mm') : '--:--'}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-slate-600 border border-slate-500'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Check-out</p>
                      <p className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {selectedEmployeeAppeal.original_check_out  ?
                          format(new Date(selectedEmployeeAppeal.original_check_out), 'HH:mm') :
                          'Not recorded'}
                      </p>
                    </div>
                    {selectedEmployeeAppeal.original_check_out && (
                      <span className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-slate-500 text-slate-300'}`}>
                        UTC: {selectedEmployeeAppeal.original_check_out ? format(new Date(selectedEmployeeAppeal.original_check_out), 'HH:mm') : '--:--'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`divider ${theme === 'light' ? '' : 'divider-neutral'}`}>
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                Requested Changes
              </span>
            </div>

            {/* Requested Changes */}
            {isEditingAppeal ? (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                      Requested Check-in
                    </label>
                    <input
                      type="time"
                      name="requestedCheckIn"
                      value={editedAppealData.requestedCheckIn}
                      onChange={handleEditChange}
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                    />
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                      Local time: {editedAppealData.requestedCheckIn || '--:--'}
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                      Requested Check-out
                    </label>
                    <input
                      type="time"
                      name="requestedCheckOut"
                      value={editedAppealData.requestedCheckOut}
                      onChange={handleEditChange}
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                    />
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                      Local time: {editedAppealData.requestedCheckOut || '--:--'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/30 border border-blue-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Requested Check-in</p>
                        <p className={`text-lg font-semibold ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                          {selectedEmployeeAppeal.requested_check_in ?
                            displayAppealTime(selectedEmployeeAppeal.requested_check_in) :
                            '--:--'}
                        </p>
                      </div>
                      {selectedEmployeeAppeal.requested_check_in && (
                        <span className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-800 text-blue-300'}`}>
                          UTC: {selectedEmployeeAppeal.requested_check_in ? format(new Date(selectedEmployeeAppeal.requested_check_in), 'HH:mm') : '--:--'}
                        </span>
                      )}
                    </div>
                    {selectedEmployeeAppeal.original_check_in && selectedEmployeeAppeal.requested_check_in && (
                      <div className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                        Change: {(() => {
                          try {
                            const original = new Date(selectedEmployeeAppeal.original_check_in);
                            const requested = new Date(selectedEmployeeAppeal.requested_check_in);
                            const diffMinutes = Math.round((requested.getTime() - original.getTime()) / (1000 * 60));
                            return diffMinutes > 0 ? `+${diffMinutes} minutes` : 
                                   diffMinutes < 0 ? `${diffMinutes} minutes` : 
                                   'No change';
                          } catch (e) {
                            return 'Time change';
                          }
                        })()}
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/30 border border-blue-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Requested Check-out</p>
                        <p className={`text-lg font-semibold ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                          {selectedEmployeeAppeal.requested_check_out ?
                            displayAppealTime(selectedEmployeeAppeal.requested_check_out) :
                            '--:--'}
                        </p>
                      </div>
                      {selectedEmployeeAppeal.requested_check_out && (
                        <span className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-800 text-blue-300'}`}>
                          UTC: {selectedEmployeeAppeal.requested_check_out ? format(new Date(selectedEmployeeAppeal.requested_check_out), 'HH:mm') : '--:--'}
                        </span>
                      )}
                    </div>
                    {selectedEmployeeAppeal.original_check_out && selectedEmployeeAppeal.requested_check_out && (
                      <div className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                        Change: {(() => {
                          try {
                            const original = new Date(selectedEmployeeAppeal.original_check_out);
                            const requested = new Date(selectedEmployeeAppeal.requested_check_out);
                            const diffMinutes = Math.round((requested.getTime() - original.getTime()) / (1000 * 60));
                            return diffMinutes > 0 ? `+${diffMinutes} minutes` : 
                                   diffMinutes < 0 ? `${diffMinutes} minutes` : 
                                   'No change';
                          } catch (e) {
                            return 'Time change';
                          }
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reason for Appeal Section */}
        <div className={`collapse collapse-arrow border ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-600 bg-slate-700'}`}>
          <input type="checkbox" defaultChecked />
          <div className={`collapse-title font-medium flex items-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Reason for Appeal
          </div>
          <div className="collapse-content">
            {isEditingAppeal ? (
              <div>
                <label className={`text-sm font-medium mb-2 block ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                  Reason (minimum 10 characters)
                </label>
                <textarea
                  name="reason"
                  value={editedAppealData.reason}
                  onChange={handleEditChange}
                  className={`textarea textarea-bordered w-full ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                  rows={3}
                  placeholder="Please provide a detailed reason for your appeal..."
                ></textarea>
                <div className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                  {editedAppealData.reason.length}/10 characters
                </div>
              </div>
            ) : (
              <div>
                <p className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  {selectedEmployeeAppeal.reason || 'No reason provided'}
                </p>
                {/* Use date instead of reviewed_at */}
                {selectedEmployeeAppeal.date && (
                  <div className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                    Submitted on: {selectedEmployeeAppeal.date ?
                      format(new Date(selectedEmployeeAppeal.date), 'dd/MM/yyyy HH:mm') : ''}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Admin Response Section (only for approved/rejected appeals) */}
        {selectedEmployeeAppeal.appeal_status !== 'pending' && selectedEmployeeAppeal.admin_comment && (
          <div className={`collapse collapse-arrow border ${selectedEmployeeAppeal.appeal_status === 'approved' 
            ? (theme === 'light' ? 'border-green-200 bg-green-50' : 'border-green-700 bg-green-900/20') 
            : (theme === 'light' ? 'border-red-200 bg-red-50' : 'border-red-700 bg-red-900/20')
            }`}>
            <input type="checkbox" defaultChecked />
            <div className={`collapse-title font-medium flex items-center ${selectedEmployeeAppeal.appeal_status === 'approved' 
              ? (theme === 'light' ? 'text-green-700' : 'text-green-400')
              : (theme === 'light' ? 'text-red-700' : 'text-red-400')
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Admin Response
            </div>
            <div className="collapse-content">
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                    {selectedEmployeeAppeal.admin_comment}
                  </p>
                </div>
                {/* Use date instead of reviewed_at */}
                {selectedEmployeeAppeal.date && (
                  <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                    {/* Show appeal date instead of review date */}
                    Appeal date: {format(new Date(selectedEmployeeAppeal.date), 'dd/MM/yyyy HH:mm')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timezone Information */}
        {employee?.time_zone && (
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
            ⏰ Times displayed in {employee.time_zone.replace('_', ' ')} timezone
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex justify-between items-center pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
          <div className="flex gap-2">
            {selectedEmployeeAppeal.appeal_status === 'pending' && (
              <>
                {isEditingAppeal ? (
                  <>
                    <button
                      onClick={() => setIsEditingAppeal(false)}
                      className={`btn btn-outline ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                    >
                      Cancel Edit
                    </button>
                    <button
                      onClick={saveAppealChanges}
                      className={`btn ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
                      disabled={!editedAppealData.reason || editedAppealData.reason.length < 10}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={cancelEmployeeAppeal}
                      className="btn btn-error"
                    >
                      Cancel Appeal
                    </button>
                    <button
                      onClick={toggleEditMode}
                      className="btn btn-warning"
                    >
                      Edit Appeal
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEmployeeAppealViewModalOpen(false)} 
              className={`btn ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop" onClick={() => setIsEmployeeAppealViewModalOpen(false)}></div>
  </div>
)}

    </div>
  );
}
