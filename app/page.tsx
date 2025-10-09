'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { API_BASE_URL, API_ROUTES } from './config';
import AnnouncementsPage from './announcements/page';
import { format, parseISO, differenceInMilliseconds, differenceInHours, differenceInMinutes, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import WorkingTimeCounter from './components/WorkingTimeCounter';
import { useTheme } from './components/ThemeProvider';
import { DocumentTextIcon, ExclamationTriangleIcon, CalendarDaysIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatInTimeZone } from 'date-fns-tz'; // add this import
import { useTodayStatus } from './hooks/useTodayStatus';      
import { EmployeeClock } from './components/EmployeeClock';  
import { InformationCircleIcon } from '@heroicons/react/24/outline'; 


// -------- PATCH: helpers to render announcement.content nicely --------

// Try to parse JSON safely
function tryParseJson(input: unknown): unknown {
  if (typeof input !== 'string') return input;
  const s = input.trim();
  // quick heuristic — Slate values are arrays (usually) but support objects just in case
  if (!s.startsWith('[') && !s.startsWith('{')) return input;
  try { return JSON.parse(s); } catch { return input; }
}

// Type guard for a Slate Value (very minimal)
type SlateNode = { type?: string; children?: SlateNode[]; text?: string; bold?: boolean; italic?: boolean; underline?: boolean };
function isSlateArray(val: unknown): val is SlateNode[] {
  return Array.isArray(val) && val.every(n => n && typeof n === 'object' && 'children' in (n as any));
}

// Convert a Slate Value (array) into HTML (supports bold/italic/underline + paragraphs)
function slateToHtml(value: SlateNode[]): string {
  const serialize = (node: SlateNode): string => {
    if (node.children && Array.isArray(node.children)) {
      const inner = node.children.map(serialize).join('');
      // Treat unknown block types as paragraphs by default
      if (node.type === 'paragraph' || !node.type) return `<p>${inner}</p>`;
      return inner;
    }
    // leaf
    let t = node.text ?? '';
    if (!t) return '';
    if (node.bold) t = `<strong>${t}</strong>`;
    if (node.italic) t = `<em>${t}</em>`;
    if (node.underline) t = `<u>${t}</u>`;
    return t;
  };
  return value.map(serialize).join('');
}

// Convert Slate Value to plain text (for previews)
function slateToPlainText(value: SlateNode[]): string {
  const walk = (node: SlateNode): string => {
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(walk).join('');
    }
    return node.text ?? '';
  };
  return value.map(walk).join('\n').replace(/\n{2,}/g, '\n').trim();
}

// Strip HTML tags to plain text (for previews of HTML content)
function stripHtml(html: string): string {
  // very light stripping; good enough for previews
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n').trim();
}

// Convert any backend content (stringified Slate JSON, HTML, or plain text) to HTML string
function contentToHtml(content: string): string {
  const parsed = tryParseJson(content);
  if (isSlateArray(parsed)) {
    return slateToHtml(parsed);
  }
  const s = String(content ?? '').trim();
  if (!s) return '';
  // looks like HTML already
  if (s.startsWith('<')) return s;
  // plain text -> wrap as paragraphs, preserve newlines
  return s
    .split(/\r?\n/)
    .map(line => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
    .join('');
}

// Convert any backend content to plain text (for list previews)
function contentToPlainText(content: string): string {
  const parsed = tryParseJson(content);
  if (isSlateArray(parsed)) return slateToPlainText(parsed);
  const s = String(content ?? '').trim();
  if (!s) return '';
  if (s.startsWith('<')) return stripHtml(s);
  return s;
}

// --------------------------------------------------------------------

// Singapore timezone
const timeZone = 'Asia/Singapore';

// Function to convert date to Singapore timezone

// Helper function to format work time strings (e.g., "09:00:00") to "9:00 AM"
const formatWorkTime = (timeString: string): string => {
  if (!timeString) return '';
  try {
    const today = new Date();
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const dateWithTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
    return format(dateWithTime, 'h:mm a');
  } catch (error) {
    console.error("Error formatting work time:", timeString, error);
    return timeString;
  }
};

// Define types for our data
interface StatData {
  todayAttendances: number;
  pendingLeaves: number;
  pendingAppeals: number;
  totalEmployees: number;
}

type StatusMeta = {
  label: string;
  document: 'visa' | 'passport';
};

interface AffectedEmployee {
  id: number;
  name: string;
  company_name: string;
  department: string;
  position: string;
  visa_expired_date: string | null;
  passport_expired_date: string | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string; // may be HTML, plain text, or stringified Slate JSON
  created_at: string;
  is_posted: boolean;
  is_active: boolean;
  is_acknowledgement: boolean;
  is_force_login: boolean;
  is_read: boolean;
  attachments?: {
    id: number;
    original_filename: string;
    file_size: number;
    content_type: string;
    download_url: string;
    uploaded_at: string;
  }[];
  updated_at: string;
}

interface PendingRequest {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AttendanceRecord {
  id?: string;
  date?: Date;
  checkIn?: Date | null;
  checkOut?: Date | null;
  status?: string;
}

// Today's attendance interface
interface TodayAttendance {
  isCheckedIn: boolean;
  checkInTime: Date | string | null; 
  checkOutTime: Date | string | null;
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
  public_holidays_today_json?: any[] | string | null;
  events_today_json?: any[] | string | null;
  work_break?: number | string | null;
  event_titles_today?: string | null; 
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Add this interface near your other interfaces
interface DocumentStatusSummary {
  expiredVisas: number;
  visaExpiringSoon: number;
  expiredPassports: number;
  passportExpiringSoon: number;
}

export default function AdminDashboard() {
  // Use theme system
  const { theme } = useTheme();



  // State for dashboard data
  const [stats, setStats] = useState<StatData>({
    todayAttendances: 0,
    totalEmployees: 0,
    pendingLeaves: 0,
    pendingAppeals: 0
  });

  const [role, setRole] = useState<string>('');
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [user_id, setUserId] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [employee, setEmployee] = useState<Employee>({
    id: 0,
    start_work_time: '9:00:00',
    end_work_time: '18:00:00',
    time_zone:'Asia/Singapore',
  });

    // ─── Holiday / Leave / Off-day logic ─────────────────────────────
const todayMeta = useTodayStatus(
  employee.schedule_date ?? null,
  employee.work_status ?? null,
  employee.leave_status_today ?? null,
  employee.public_holiday_titles ?? null,
  employee.public_holidays_today_json ?? null,
  employee.events_today_json ?? null,
  (Number(employee.work_break) || 0)
);
  

  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  //const [workingTime, setWorkingTime] = useState<string>('00:00:00');
  //const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Check-in/check-out state
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>({
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null
  });
  
  // Multiple sessions state for attendance
  const [sessions, setSessions] = useState<AttendanceRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Announcement popup state
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const [totalStatsEmployees, setTotalStatsEmployees] = useState({
    totalEmployees: 0,
    activeEmployees: 0
  });

  // New state for announcement modal
  const [newAnnouncementModalOpen, setNewAnnouncementModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [popupAnnouncements, setPopupAnnouncements] = useState<Announcement[]>([]);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<StatusMeta | null>(null);
  const [affectedEmployees, setAffectedEmployees] = useState<AffectedEmployee[]>([]);

  // New state for image gallery
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageAttachments, setImageAttachments] = useState<any[]>([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);


// Add this IP fetcher function (same as in first page)
async function getPublicIpClientSide(opts?: { timeoutMs?: number }): Promise<string | null> {
  const timeoutMs = opts?.timeoutMs ?? 3000;

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
          return JSON.parse(txt);
        } catch {
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

// Add this API wrapper function for check-in/check-out
async function postAttendanceWithIp(url: string, payload: any) {
  const publicIp = await getPublicIpClientSide();
  console.log('[public-ip] fetched:', publicIp || 'Not available');
  
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('hrms_token') || ''}`,
      ...(publicIp ? { 'x-client-public-ip': publicIp } : {})
    },
    body: JSON.stringify(payload)
  });
}


  const openStatusModal = async (
    documentType: 'visa' | 'passport',
    statusType: 'expired' | 'expiring',
    label: string
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/document-status/details?document=${documentType}&type=${statusType}`);
    const data = await response.json();
    setAffectedEmployees(data);
    setSelectedStatus({ label, document: documentType });
    setIsModalOpen(true);
  };

  // Add this state near your other state declarations
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusSummary>({
    expiredVisas: 0,
    visaExpiringSoon: 0,
    expiredPassports: 0,
    passportExpiringSoon: 0
  });

  // Add state and logic:
  const [sortField, setSortField] = useState<SortField>('name');
const handleSort = (field: SortField) => {
  if (sortField === field) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortField(field);
    setSortDirection('asc');
  }
};
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;


const toEmployeeTimezone = (utcDate: Date | string | null): Date | null => {
  if (!utcDate) return null;
  //console.error("TEST "+ utcDate);
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  
  try {
    // Create a date in the employee's timezone
    const employeeTime = new Date(date.toLocaleString('en-US', { 
      timeZone: employee.time_zone || 'Asia/Kuala_Lumpur' 
    }));
    
    //console.error("TEST 1 "+ employeeTime);
    return employeeTime;
  } catch (error) {
    console.error("Error converting to employee timezone:", error);
    return date; // fallback to original date
  }
};

type SortField = 'name' | 'company_name' | 'department' | 'position' | 'expired_date';


const fieldValue = (obj: AffectedEmployee, field: SortField): number | string => {
  if (field === 'expired_date') {
    const dateStr =
      selectedStatus?.document === 'visa'
        ? obj.visa_expired_date
        : obj.passport_expired_date;
    return dateStr ? new Date(dateStr).getTime() : 0;
  }

  switch (field) {
    case 'name':
      return (obj.name ?? '').toLowerCase();
    case 'company_name':
      return (obj.company_name ?? '').toLowerCase();
    case 'department':
      return (obj.department ?? '').toLowerCase();
    case 'position':
      return (obj.position ?? '').toLowerCase();
  }
};



const sortedEmployees = [...affectedEmployees].sort((a, b) => {
  const A = fieldValue(a, sortField);
  const B = fieldValue(b, sortField);
  if (A < B) return sortDirection === 'asc' ? -1 : 1;
  if (A > B) return sortDirection === 'asc' ? 1 : -1;
  return 0;
});

  useEffect(() => {
    if (isModalOpen) setCurrentPage(1);
  }, [isModalOpen]);

  // // Clean up interval on component unmount
  // useEffect(() => {
  //   return () => {
  //     if (timerInterval) {
  //       clearInterval(timerInterval);
  //     }
  //   };
  // }, [timerInterval]);

  // Function to check for new announcements
  const checkForNewAnnouncements = useCallback(async (announcements: Announcement[]) => {
    if (announcements.length === 0 || role === 'admin') return;

    const unviewedAnnouncements = announcements.filter(a => !hasAnnouncementBeenViewed(a.id) && !a.is_read);

    if (unviewedAnnouncements.length > 0) {
      const populatedAnnouncements = await Promise.all(
        unviewedAnnouncements.map(async (announcement) => {
          if (!announcement.attachments) {
            try {
              const response = await fetch(`${API_BASE_URL}/api/announcement/announcements/${announcement.id}/documents`);
              if (response.ok) {
                const data = await response.json();
                return { ...announcement, attachments: data.documents || [] };
              }
            } catch (error) {
              console.error(`Error fetching attachments for announcement ${announcement.id}:`, error);
            }
          }
          return announcement;
        })
      );

      if (populatedAnnouncements.length > 0) {
        setCurrentAnnouncement(populatedAnnouncements[0]);
        setNewAnnouncementModalOpen(true);
        setIsAcknowledged(false);
        setPopupAnnouncements(populatedAnnouncements);
      }
    }
  }, [role]);

  // New function to fetch announcements separately
  const fetchAnnouncementsData = useCallback(async (user_id: number) => {
    try {
      if (user_id === 0 && role !== 'admin') return;
      
      const announcementsResponse = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}${user_id && role !== 'admin' ? `?employee_id=${user_id}` : ''}`);
      if (!announcementsResponse.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const announcementsData = await announcementsResponse.json();

      const recentAnnouncementsData = announcementsData.filter((announcement: any) => announcement.is_posted === 1 && announcement.is_active === 1)
        .sort((a: Announcement, b: Announcement) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

      const processedAnnouncements = recentAnnouncementsData.map((announcement: any) => ({
        ...announcement,
        is_posted: announcement.is_posted === 1 ? true : false,
        is_active: announcement.is_active === 1 ? true : false,
        is_read: announcement.is_read === 1 ? true : false
      }));

      setRecentAnnouncements(processedAnnouncements);

      checkForNewAnnouncements(
        announcementsData
          .filter((a: any) => a.is_posted === 1 && a.is_active === 1)
          .sort((a: Announcement, b: Announcement) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      );
      setSelectedAnnouncement(processedAnnouncements[0] ?? null);
      //setSelectedAnnouncement(processedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  }, [role, checkForNewAnnouncements]);

  const fetchEmployeeData = useCallback(async () => {
    try {
      if(user_id === 0 && role === 'admin') return;

      const id = user_id;

      const response = await fetch(`${API_BASE_URL}${API_ROUTES.employees}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }
      const data = await response.json();
      console.log('API Response Data:', data);
         setEmployee({
          id: data.id,
          start_work_time: data.start_work_time,
          end_work_time: data.end_work_time,
          time_zone: data.time_zone,
          work_break: data.work_break,
          leave_status_today: data.leave_status_today,
          public_holiday_titles: data.public_holiday_titles,
          public_holidays_today_json: data.public_holidays_today_json,
          events_today_json: data.events_today_json,
          event_titles_today: data.event_titles_today, // Add this
          schedule_date: data.schedule_date,
          work_status: data.work_status,
          template_name: data.template_name
        });
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  }, [user_id, role]);

  // Fetch dashboard data
  useEffect(() => {
    const role = localStorage.getItem('hrms_role');
    if (role) {
      setRole(role);
    }

    // Get user role from localStorage
    const getUserRole = () => {
      const directRole = localStorage.getItem('hrms_role');
      const user = localStorage.getItem('hrms_user');
      if (user) {
        const userData = JSON.parse(user);
        if (userData && userData.id) {
          setUserId(userData.id);
          
          if (userData.name) {
            setUserName(userData.name);
          } else if (userData.first_name) {
            setUserName(`${userData.first_name} ${userData.last_name || ''}`);
          }  
        }
        if (userData && userData.is_superadmin === 1) {
          setIsSuperAdmin(true);
        }
        if (directRole) {
          setRole(directRole);
          return;
        }
        else {
          try {
            const userData = JSON.parse(user);
            if (userData && userData.role) {
              setRole(userData.role);
            }
            if (userData && userData.is_superadmin === 1) {
              setIsSuperAdmin(true);
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }
    };

    getUserRole();

    const fetchTotalEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/employees`);
        if (!response.ok) {
          throw new Error('Failed to fetch total employees');
        }
        const data = await response.json();

        if (role === 'manager') {
          setTotalStatsEmployees({
            totalEmployees: data.filter((employee: any) => employee.manager_id === user_id).length,
            activeEmployees: data.filter((employee: any) => employee.status === 'Active' && employee.manager_id === user_id).length
          });
        } else {
          setTotalStatsEmployees({
            totalEmployees: data.length,
            activeEmployees: data.filter((employee: any) => employee.status === 'Active').length
          });
        }
      } catch (error) {
        console.error('Error fetching total employees:', error);
      }
    };

    fetchTotalEmployees();

    const fetchDashboardData = async (user_id: number) => {
      if(user_id === 0 && role !== 'admin') return;
      
      try {
        setLoading(true);
        
        await fetchAnnouncementsData(user_id);

        const pendingLeavesResponse = await fetch(
          `${API_BASE_URL}/api/dashboard/pending-leaves?user_id=${user_id}&role=${role}`
        );
        let pendingLeavesCount = 0;
        
        if (pendingLeavesResponse.ok) {
          const pendingLeavesData = await pendingLeavesResponse.json();
          pendingLeavesCount = pendingLeavesData.pendingLeaves;
        }

        const attendanceResponse = await fetch(`${API_BASE_URL}/api/dashboard/today-count?user_id=${user_id}&role=${role}`);
        let todayAttendanceData = { todayAttendances: 0, totalEmployees: 0 };
        
        if (attendanceResponse.ok) {
          todayAttendanceData = await attendanceResponse.json();
        }

        const pendingAppealsResponse = await fetch(
          `${API_BASE_URL}/api/dashboard/pending-appeals?user_id=${user_id}&role=${role}`
        );
        let pendingAppealsCount = 0;
        
        if (pendingAppealsResponse.ok) {
          const pendingAppealsData = await pendingAppealsResponse.json();
          pendingAppealsCount = pendingAppealsData.pendingAppeals;
        }

        setStats({
          totalEmployees: todayAttendanceData.totalEmployees,
          todayAttendances: todayAttendanceData.todayAttendances,
          pendingLeaves: pendingLeavesCount,
          pendingAppeals: pendingAppealsCount
        });

        setPendingRequests([
          {
            id: "1",
            employee: "John Smith",
            type: "Annual Leave",
            startDate: "2023-06-15",
            endDate: "2023-06-20",
            reason: "Family vacation",
            status: "pending"
          },
          {
            id: "2",
            employee: "Sarah Johnson",
            type: "Medical Leave",
            startDate: "2023-06-12",
            endDate: "2023-06-14",
            reason: "Doctor's appointment",
            status: "pending"
          },
          {
            id: "3",
            employee: "Michael Brown",
            type: "Unpaid Leave",
            startDate: "2023-06-25",
            endDate: "2023-06-30",
            reason: "Personal matter",
            status: "pending"
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData(user_id);
    if (user_id) {
      setEmployeeId(user_id);
      fetchEmployeeData();
    }
  }, [role, user_id, isSuperAdmin,fetchAnnouncementsData, fetchEmployeeData]);

  // Fetch today's attendance data
const parseApiDate = (v: unknown): Date | null => {
  if (!v) return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
};

// Display a time without extra TZ conversion (as-is)
const fetchTodayAttendance1 = useCallback(async () => {
  try {
    if (!employeeId) {
      showNotification('Employee ID is not available. Please refresh the page or log in again.', 'error');
      return;
    }

    const url = `${API_BASE_URL}${API_ROUTES.todayAttendance}?employee_id=${employeeId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch today attendance');
    const payload = await res.json();

    // Normalize possible shapes into rows[]
    const rows: any[] = Array.isArray(payload)
      ? (Array.isArray(payload[0]?.attendanceDayRows) ? payload[0].attendanceDayRows : payload)
      : Array.isArray(payload?.attendanceDayRows)
        ? payload.attendanceDayRows
        : Array.isArray(payload?.[0]?.attendanceDayRows)
          ? payload[0].attendanceDayRows
          : [];

    // Map to sessions (as local Date objects; no extra TZ conversion)
    const mappedSessions: AttendanceRecord[] = rows.map((r: any) => {
      const id = String(r.id ?? r.attendance_day_id ?? Math.random().toString(36).slice(2));
      const checkIn = parseApiDate(r.first_check_in_time ?? r.clock_in ?? null);
      const checkOut = parseApiDate(r.last_check_out_time ?? r.clock_out ?? null);
      return { id, checkIn, checkOut };
    }).filter(s => s.checkIn);

    setSessions(mappedSessions);

    // Derive isCheckedIn and last session
    const inferredIsCheckedInFromRows = rows.some((r: any) => {
      if (typeof r.isCheckedIn === 'boolean') return r.isCheckedIn;
      // consider checked-in if there is a check-in and no checkout yet
      const ci = r.first_check_in_time ?? r.clock_in;
      const co = r.last_check_out_time ?? r.clock_out;
      return ci && !co;
    });

    const payloadIsChecked = typeof payload?.isCheckedIn === 'boolean' ? payload.isCheckedIn : undefined;
    const isCheckedIn = typeof payloadIsChecked === 'boolean' ? payloadIsChecked : inferredIsCheckedInFromRows;

    const last = mappedSessions.length > 0 ? mappedSessions[mappedSessions.length - 1] : null;

    setTodayAttendance({
      isCheckedIn,
      checkInTime: last?.checkIn ?? null,
      checkOutTime: last?.checkOut ?? null
    });
  } catch (err) {
    showNotification(err instanceof Error ? err.message : 'Failed to load attendance', 'error');
    console.error('Error fetching today attendance:', err);
  }
}, [employeeId]);

const fetchTodayAttendancework = useCallback(async () => {
  try {
    if (!employeeId) {
      showNotification('Employee ID is not available. Please refresh the page or log in again.', 'error');
      return;
    }

    const url = `${API_BASE_URL}${API_ROUTES.todayAttendance}?employee_id=${employeeId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch today attendance');
    const payload = await res.json();

    console.log('Attendance API response:', payload); // Debug log

    // Handle different response formats
    let attendanceData = null;
    let isCheckedIn = false;
    
    if (Array.isArray(payload) && payload.length > 0) {
      // Handle array response format
      attendanceData = payload[0];
    } else if (typeof payload === 'object') {
      // Handle object response format
      attendanceData = payload;
    }

    if (attendanceData) {
      // Extract isCheckedIn from the response
      isCheckedIn = attendanceData.isCheckedIn || 
                   (attendanceData.attendanceDayRows && 
                    attendanceData.attendanceDayRows.some((row: any) => 
                      row.first_check_in_time && !row.last_check_out_time
                    ));

      // Extract sessions from the response
      const sessionsData = attendanceData.attendanceDayRows || attendanceData.sessions || [];
      const mappedSessions: AttendanceRecord[] = sessionsData.map((r: any) => {
        const id = String(r.id ?? r.attendance_day_id ?? Math.random().toString(36).slice(2));
        const checkIn = parseApiDate(r.first_check_in_time ?? r.clock_in ?? null);
        const checkOut = parseApiDate(r.last_check_out_time ?? r.clock_out ?? null);
        return { id, checkIn, checkOut };
      }).filter((s: AttendanceRecord) => s.checkIn);

      setSessions(mappedSessions);

      // Get the latest session for display
      const lastSession = mappedSessions.length > 0 ? mappedSessions[mappedSessions.length - 1] : null;

      setTodayAttendance({
        isCheckedIn,
        checkInTime: lastSession?.checkIn ?? null,
        checkOutTime: lastSession?.checkOut ?? null
      });
    }
  } catch (err) {
    showNotification(err instanceof Error ? err.message : 'Failed to load attendance', 'error');
    console.error('Error fetching today attendance:', err);
  }
}, [employeeId]);


function parseApiDateUTC(input: Date | string | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  //console.error("parseApiDateUTC time 1 - "+ input);
  const s = input.trim();
  // already has zone info? (Z or +08:00 etc)
  if (/Z$|[+\-]\d\d:?\d\d$/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  // treat "YYYY-MM-DD HH:mm:ss" as UTC
  const isoUtc = s.replace(' ', 'T') + 'Z';
  const d = new Date(isoUtc);

  //console.error("parseApiDateUTC time 2 - "+ d.getTime());
  return isNaN(d.getTime()) ? null : d;
}

const displayTime = (date: Date | string | null): string => {
 //console.error("employee time - "+ date);
  const tz = employee?.time_zone || 'Asia/Kuala_Lumpur';
  const d = parseApiDateUTC(date);
  //console.error("parseApiDateUTC - "+ d);
  if (!d) return '--:--';
  return formatInTimeZone(d, tz, 'hh:mm a');
};


const fetchTodayAttendance = useCallback(async () => {
  try {
    if (!employeeId) {
      showNotification('Employee ID is not available. Please refresh the page or log in again.', 'error');
      return;
    }

    const url = `${API_BASE_URL}${API_ROUTES.todayAttendance}?employee_id=${employeeId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch today attendance');

    const payload = await res.json();
    console.log('Attendance API response:', payload);

    // Normalize shape
    const root = Array.isArray(payload) ? payload[0] : payload;
    const rows: any[] =
      Array.isArray(root?.attendanceDayRows) ? root.attendanceDayRows :
      Array.isArray(root?.sessions) ? root.sessions : [];

    // Map rows -> sessions with proper date validation
    const mappedSessions: AttendanceRecord[] = rows.map((r: any) => {
      const id = String(r.id ?? r.attendance_day_id ?? Math.random().toString(36).slice(2));
      
      // Parse dates with validation
      const parseDate = (dateStr: any): Date | null => {
        if (!dateStr) return null;
        try {
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? null : date;
        } catch {
          return null;
        }
      };

      const ci = parseDate(r.first_check_in_time_local_iso ?? r.first_check_in_time ?? r.clock_in);
      const co = parseDate(r.last_check_out_time_local_iso ?? r.last_check_out_time ?? r.clock_out);
      
      return { id, checkIn: ci, checkOut: co };
    }).filter(s => s.checkIn); // Only include sessions with valid check-in

    console.log('Mapped sessions for timer:', mappedSessions);
    setSessions(mappedSessions);

    // Rest of your existing code...
    const inferred = rows.some((r: any) => {
      const ci = r.first_check_in_time ?? r.clock_in ?? r.first_check_in_time_local_iso;
      const co = r.last_check_out_time ?? r.clock_out ?? r.last_check_out_time_local_iso;
      return ci && !co;
    });
    const isCheckedIn = typeof root?.isCheckedIn === 'boolean' ? root.isCheckedIn : inferred;

    const last = mappedSessions.length ? mappedSessions[mappedSessions.length - 1] : null;

    setTodayAttendance({
      isCheckedIn,
      checkInTime: last?.checkIn ?? null,
      checkOutTime: last?.checkOut ?? null
    });

  } catch (err) {
    showNotification(err instanceof Error ? err.message : 'Failed to load attendance', 'error');
    console.error('Error fetching today attendance:', err);
  }
}, [employeeId]);

const handleAttendanceToggle = async () => {
  try {
    if (!employeeId) {
      showNotification(
        'Employee ID is not available. Please refresh the page or log in again.',
        'error'
      );
      return;
    }

    const endpoint = todayAttendance.isCheckedIn
      ? API_ROUTES.checkOut
      : API_ROUTES.checkIn;

    const res = await postAttendanceWithIp(
      `${API_BASE_URL}${endpoint}`,
      { employee_id: employeeId }
    );

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      // Prefer server message over generic
      const serverMsg = payload?.message || payload?.error || `HTTP ${res.status}`;

      // New: hard ENFORCE block (standardized 403 + code=IP_BLOCKED)
      if (res.status === 403 && payload?.code === 'IP_BLOCKED') {
        showNotification(serverMsg, 'error'); // or 'warning' if you prefer
        return;
      }

      // Legacy: soft block/info path your UI used before
      if (res.status === 701) {
        showNotification(serverMsg, 'info');
        return;
      }

      throw new Error(serverMsg);
    }

    // Success
    showNotification(
      `Successfully ${todayAttendance.isCheckedIn ? 'checked out' : 'checked in'}!`,
      'success'
    );

    // If backend flagged the IP in FLAG_ONLY mode, surface that to the user
    if (payload?.ipFlag) {
      showNotification(
        payload?.ipMessage || 'Outside allowed IP (flagged).',
        'error'
      );
    }

    // Refresh data
    await fetchTodayAttendance();
    setTimeout(() => { fetchTodayAttendance(); }, 500);

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Attendance action failed';
    showNotification(msg, 'error');
    console.error('Error with attendance action:', err);
  }
};

  useEffect(() => {
    if (employeeId && role !== 'admin') {
      fetchTodayAttendance();
    }
  }, [employeeId,role, fetchTodayAttendance]);

  const handleLeaveAction = (id: string, action: 'approve' | 'reject') => {
    const request = pendingRequests.find(req => req.id === id);

    setPendingRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
          : request
      )
    );

    setStats(prev => ({
      ...prev,
      pendingLeaves: prev.pendingLeaves - 1
    }));

    if (request) {
      showNotification(
        action === 'approve'
          ? `${request.employee}'s ${request.type} request approved.`
          : `${request.employee}'s ${request.type} request rejected.`,
        action === 'approve' ? 'success' : 'error'
      );
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);

    if (type === 'error') setError(message);

    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      if (type === 'error') setError('');
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  useEffect(() => {
    const fetchDocumentStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/document-status`);
        if (!response.ok) {
          throw new Error('Failed to fetch document status');
        }
        const data = await response.json();
        setDocumentStatus(data);
      } catch (error) {
        console.error('Error fetching document status:', error);
      }
    };

    fetchDocumentStatus();
  }, []);

  const openAnnouncementModal = async (announcement: Announcement) => {
    try {
      if (!announcement.attachments) {
        const response = await fetch(`${API_BASE_URL}/api/announcement/announcements/${announcement.id}/documents`);
        if (response.ok) {
          const data = await response.json();
          announcement.attachments = data.documents || [];
        }
      }
      
      setSelectedAnnouncement(announcement);
      setShowAnnouncementModal(true);
    } catch (error) {
      console.error('Error fetching announcement documents:', error);
      setSelectedAnnouncement(announcement);
      setShowAnnouncementModal(true);
    }
  };

  const hasAnnouncementBeenViewed = (id: string) => {
    const viewedAnnouncements = JSON.parse(localStorage.getItem('viewedAnnouncements') || '[]');
    return viewedAnnouncements.includes(id);
  };

  const markAnnouncementAsViewed = (id: string) => {
    const viewedAnnouncements = JSON.parse(localStorage.getItem('viewedAnnouncements') || '[]');
    if (!viewedAnnouncements.includes(id)) {
      viewedAnnouncements.push(id);
      localStorage.setItem('viewedAnnouncements', JSON.stringify(viewedAnnouncements));
    }
  };

  const handleSubmitAnnouncementRead = async (isRead: boolean) => {
    if (!currentAnnouncement) return;

    if (currentAnnouncement.is_force_login && !isAcknowledged) {
      showNotification(
        "This announcement requires your acknowledgment before proceeding", 
        "error"
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.announcements}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          announcement_id: currentAnnouncement.id,
          employee_id: user_id,
          is_read: !currentAnnouncement.is_acknowledgement ? true : isRead
        }),
      });
      
      const data = await response.json();

      if(response.ok) {
        if(isAcknowledged){
          markAnnouncementAsViewed(currentAnnouncement.id);
        }
        
        const updatedAnnouncements = popupAnnouncements.filter(a => a.id !== currentAnnouncement.id);
        setPopupAnnouncements(updatedAnnouncements);
        
        if (updatedAnnouncements.length > 0) {
          const nextAnnouncement = updatedAnnouncements[0];
          setCurrentAnnouncement(nextAnnouncement);
          setIsAcknowledged(false);
        } else {
          setNewAnnouncementModalOpen(false);
          setCurrentAnnouncement(null);
        }
      } else {
        console.error("Error fetching announcement read:", data);
      }
    } catch (error) {
      console.error("Error fetching announcement read:", error);
    }
  };

  const formatAnnouncementDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const canPreviewFile = (contentType: string) => {
    return contentType.startsWith('image/') || contentType === 'application/pdf';
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (contentType === 'application/pdf') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // Function to open image gallery
  const openImageGallery = (announcement: Announcement, index: number = 0) => {
    const images = announcement.attachments?.filter(att => 
      att.content_type.startsWith('image/')
    ) || [];
    
    if (images.length > 0) {
      setImageAttachments(images);
      setCurrentImageIndex(index);
      setShowImageModal(true);
    }
  };

  // Function to navigate images
  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? imageAttachments.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === imageAttachments.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      navigateImage('next');
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      navigateImage('prev');
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showImageModal) {
        if (e.key === 'ArrowLeft') {
          navigateImage('prev');
        } else if (e.key === 'ArrowRight') {
          navigateImage('next');
        } else if (e.key === 'Escape') {
          setShowImageModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showImageModal, imageAttachments]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
      {/* Notifications */}
      <div className="toast toast-middle toast-center z-[9999] max-w-xs sm:max-w-md">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`alert shadow-lg ${
              notification.type === 'success' 
                ? `${theme === 'light' ? 'bg-green-600' : 'bg-green-600'} text-white border-green-600` 
                : notification.type === 'error' 
                ? `${theme === 'light' ? 'bg-red-600' : 'bg-red-600'} text-white border-red-600`
                : `${theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'} text-white ${theme === 'light' ? 'border-blue-600' : 'border-blue-400'}`
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <span className="text-xs sm:text-sm">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className={`flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'} shadow-lg rounded-lg p-4 sm:p-6 ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-600'}`}>
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
          Welcome, {userName || 'to HRMS Dashboard'} {isSuperAdmin && <span className="text-xl text-red-500">(Super Admin)</span>}
        </h1>
      </div>


       {/* Check-In/Check-Out Section */}
{role !== 'admin' && (
  <div className={`card ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'} shadow-xl mb-6 sm:mb-10 overflow-hidden ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-600'}`}>
    <div className="card-body p-3 sm:p-4">
      <h2 className={`card-title flex items-center gap-2 mb-2 sm:mb-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} text-lg sm:text-xl`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Today's Attendance Status
      </h2>
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-700'} p-3 sm:p-5 rounded-xl shadow-sm ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-500'}`}>
        
        {/* Header section with date and status badges */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-600">
<div className="mb-3 sm:mb-0">
  {/* Date display  CHECK 1*/}
  <div className={`text-lg font-semibold tracking-wide ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} mb-1`}>
    {format(toEmployeeTimezone(new Date()) as Date, 'EEEE, d MMM yyyy')} 
  </div>
  
  {/* Time display */}
  <div className="flex items-baseline gap-2">
<div className={`text-2xl font-mono font-bold tracking-tight ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
  <EmployeeClock 
    showDate={false} 
    timeZone={employee.time_zone} // Pass the employee's timezone
  />
</div>
<div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
  {employee.time_zone ? employee.time_zone.replace('_', ' ') : 'Singapore'} Time
</div>
  </div>
</div>
          
          {/* Status badges - right side */}
          <div className="flex flex-wrap gap-2">
            {/* Holiday badge */}
            {todayMeta.kind === 'holiday' && (
              <div className="badge badge-lg gap-2 bg-amber-100 text-amber-800 border-amber-200 py-3 px-4">
                <span className="text-lg">🎉</span>
                Holiday
                {employee.public_holiday_titles && (
                  <span className="ml-1 font-normal">({employee.public_holiday_titles.split(',')[0].trim()})</span>
                )}
              </div>
            )}
            
            {/* Leave badge */}
            {employee.leave_status_today === 'APPROVED' && (
              <div className="badge badge-lg gap-2 bg-emerald-100 text-emerald-800 border-emerald-200 py-3 px-4">
                <span className="text-lg">🌴</span>
                On Leave
              </div>
            )}
            
            {/* Event badge */}
            {employee.event_titles_today && (
              <div className="badge badge-lg gap-2 bg-purple-100 text-purple-800 border-purple-200 py-3 px-4">
                <span className="text-lg">📅</span>
                Event
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Attendance status and actions */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md ${
                todayAttendance.isCheckedIn 
                  ? "bg-gradient-to-br from-green-500 to-green-600 animate-pulse" 
                  : todayAttendance.checkInTime
                    ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                    : "bg-gradient-to-br from-yellow-500 to-yellow-600"
              }`}>
                {todayAttendance.isCheckedIn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : todayAttendance.checkInTime ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <div className={`text-xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'} mb-1`}>
                  {todayAttendance.isCheckedIn 
                    ? "Currently Working" 
                    : todayAttendance.checkInTime
                      ? "Checked Out" 
                      : "Not Checked In"}
                </div>
                
                {/* Working/Off day status */}
                <div className="flex items-center gap-2">
                  {employee.work_status === 'off' ? (
                    <div className="badge gap-2 bg-sky-100 text-sky-800 border-sky-200">
                      <span>🏖️</span>
                      Off Day
                    </div>
                  ) : (
                    <div className="badge gap-2 bg-blue-100 text-blue-800 border-blue-200">
                      <span>💼</span>
                      Working Day
                    </div>
                  )}
                  
                  {/* Fixed break time display - convert minutes to hours if needed */}
                  {employee.work_break && Number(employee.work_break) > 0 && (
                    <div className="badge gap-2 bg-gray-100 text-gray-800 border-gray-200">
                      <ClockIcon className="w-3 h-3" />
                      {Number(employee.work_break) >= 60 
                        ? `${(Number(employee.work_break) / 60).toFixed(1)}h break` 
                        : `${employee.work_break}min break`}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Working hours info */}
            {(employee.template_name || employee.start_work_time || employee.end_work_time) && (
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Working Hours</div>
                <div className="flex items-center gap-3">
                  {employee.template_name && (
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {employee.template_name}
                    </div>
                  )}
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatWorkTime(employee.start_work_time ?? '09:00:00')}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatWorkTime(employee.end_work_time ?? '17:00:00')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Check in/out times */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-600'}`}>
                <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'} mb-1`}>Check In</div>
                <div className={`text-xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                {/* {todayAttendance.checkInTime
                    ? format(toEmployeeTimezone(todayAttendance.checkInTime) as Date, 'hh:mm a')
                    : '--:--'} */}

                    {displayTime(todayAttendance.checkInTime)} 
                </div>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-600'}`}>
                <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'} mb-1`}>Check Out</div>
                <div className={`text-xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                    {displayTime(todayAttendance.checkOutTime)}
                   {/*{todayAttendance.checkOutTime
                    ? format(toEmployeeTimezone(todayAttendance.checkOutTime) as Date, 'hh:mm a')
                    : '--:--'}*/}
                </div>
              </div>
            </div>

             {/* Working time counter */}
              <div className="mb-6">
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Total Working Time Today
                </div>
{/* <WorkingTimeCounter
  sessions={sessions.map(s => ({
    id: s.id,
    checkIn: s.checkIn ?? null,   // ← force undefined → null
    checkOut: s.checkOut ?? null, // ← force undefined → null
  }))}
  isCheckedIn={todayAttendance.isCheckedIn}
  className="font-mono text-2xl font-bold"
  displayFormat="digital"
  timeZone={employee.time_zone || 'Asia/Singapore'}
/> */}

<WorkingTimeCounter
  sessions={sessions.map(s => ({
    id: s.id || `session-${Math.random()}`,
    checkIn: s.checkIn ? new Date(s.checkIn) : null,
    checkOut: s.checkOut ? new Date(s.checkOut) : null,
  }))}
  isCheckedIn={todayAttendance.isCheckedIn}
  className="font-mono text-2xl font-bold"
  displayFormat="digital"
/>
              </div>

            {/* Check in/out button */}
            <button 
              onClick={handleAttendanceToggle}
              className={`btn w-full py-4 text-lg font-semibold ${
                todayAttendance.isCheckedIn 
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 border-0 hover:from-yellow-600 hover:to-yellow-700" 
                  : "bg-gradient-to-r from-green-600 to-green-700 border-0 hover:from-green-700 hover:to-green-800"
              } text-white shadow-md hover:shadow-lg transition-all duration-300`}
            >
              {todayAttendance.isCheckedIn 
                ? "Check Out Now" 
                : "Check In Now"}
            </button>
          </div>

          {/* Right side - Additional info panel */}
          <div className="md:w-1/3">
            <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'} h-full`}>
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Today's Information</h3>
              
              {/* Holiday details */}
              {todayMeta.kind === 'holiday' && employee.public_holiday_titles && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                    <span className="text-lg">🎉</span>
                    <span className="font-medium">Public Holiday</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {employee.public_holiday_titles}
                  </p>
                </div>
              )}
              
              {/* Event details */}
              {employee.event_titles_today && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                    <span className="text-lg">📅</span>
                    <span className="font-medium">Company Event</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {employee.event_titles_today}
                  </p>
                </div>
              )}
              
              {/* Leave details */}
              {employee.leave_status_today === 'APPROVED' && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                    <span className="text-lg">🌴</span>
                    <span className="font-medium">Approved Leave</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your leave request has been approved for today.
                  </p>
                </div>
              )}
              
              {/* Schedule info */}
              <div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <ClockIcon className="w-4 h-4" />
                  <span className="font-medium">Schedule</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {employee.work_status === 'off' 
                    ? "Today is your scheduled day off." 
                    : "You are scheduled to work today."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

       {/* Stats Overview Cards */}
      {(role === 'admin' || role === 'manager' )&& (

      <div className="space-y-8">
   <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Key Metrics</h2>
      <div className={`grid grid-cols-1 ${role === 'admin' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6 mb-10`}>
        <Link href="/attendance" className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all">
          <div className="stat-figure text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title font-medium text-white text-opacity-90">Today Attendance</div>
          <div className="stat-value text-white drop-shadow-sm">{stats.todayAttendances}</div>
          <div className="stat-desc text-white text-opacity-90">employees present</div>
        </Link>

         <Link href="/leaves" className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all">
           <div className="stat-figure text-white">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
           </div>
           <div className="stat-title font-medium text-white text-opacity-90">Leave Requests</div>
           <div className="stat-value text-white drop-shadow-sm">{stats.pendingLeaves}</div>
           <div className="stat-desc text-white text-opacity-90">pending actions</div>
         </Link>

         {role === 'admin' && (
          <Link href="/attendance?tab=appeal" className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all">
            <div className="stat-figure text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="stat-title font-medium text-white text-opacity-90">Appeal Requests</div>
            <div className="stat-value text-white drop-shadow-sm">{stats.pendingAppeals}</div>
            <div className="stat-desc text-white text-opacity-90">pending actions</div>
          </Link>
        )}

        <Link href="/employees" className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all">
          <div className="stat-figure text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="stat-title font-medium text-white text-opacity-90">Total Employees</div>
          <div className="stat-value text-white drop-shadow-sm">{totalStatsEmployees.totalEmployees}</div>
          <div className="stat-desc text-white text-opacity-90">people</div>
        </Link>
      </div>
      </div>
      )}



      {/* Document Status Overview Cards */}
{role === 'admin' && (
        <div>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
            Document Status
          </h2>

          <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-4 gap-6 mb-10">

            {/* Expired Visas */}
            <div
              onClick={() => openStatusModal('visa', 'expired', 'Expired Visas')}
              className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all"
            >
              <div className="stat-figure text-white"><ExclamationTriangleIcon className="h-10 w-10" /></div>
              <div className="stat-title text-white">Expired Visas</div>
              <div className="stat-value text-white">{documentStatus.expiredVisas}</div>
              <div className="stat-desc text-white">employees affected</div>
            </div>

            {/* Visas Expiring */}
            <div
              onClick={() => openStatusModal('visa', 'expiring', 'Visas Expiring')}
              className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all"
            >
              <div className="stat-figure text-white"><ClockIcon className="h-10 w-10" /></div>
              <div className="stat-title text-white">Visas Expiring</div>
              <div className="stat-value text-white">{documentStatus.visaExpiringSoon}</div>
              <div className="stat-desc text-white">in next 30 days</div>
            </div>

            {/* Expired Passports */}
            <div
              onClick={() => openStatusModal('passport', 'expired', 'Expired Passports')}
              className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all"
            >
              <div className="stat-figure text-white"><DocumentTextIcon className="h-10 w-10" /></div>
              <div className="stat-title text-white">Expired Passports</div>
              <div className="stat-value text-white">{documentStatus.expiredPassports}</div>
              <div className="stat-desc text-white">employees affected</div>
            </div>

            {/* Passports Expiring */}
            <div
              onClick={() => openStatusModal('passport', 'expiring', 'Passports Expiring')}
              className="stat bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow rounded-lg cursor-pointer hover:brightness-105 transition-all"
            >
              <div className="stat-figure text-white"><CalendarDaysIcon className="h-10 w-10" /></div>
              <div className="stat-title text-white">Passports Expiring</div>
              <div className="stat-value text-white">{documentStatus.passportExpiringSoon}</div>
              <div className="stat-desc text-white">in next 30 days</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
         {/* Quick Access Panel */}
         <div className={`card ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'} shadow-xl hover:shadow-2xl transition-shadow duration-300 ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-600'}`}>
           <div className="card-body">
             <h2 className={`card-title text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'} pb-3 mb-4`}>Quick Access</h2>
             <div className="grid grid-cols-3 gap-4">
               {(role === 'admin' || role === 'manager' )&& (
              <Link href="/employees" className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white btn-lg h-24 flex flex-col items-center justify-center gap-2`} tabIndex={0} aria-label="Manage employees">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm">Employees</span>
              </Link>
              )}

              <Link href="/attendance" className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white btn-lg h-24 flex flex-col items-center justify-center gap-2`} tabIndex={0} aria-label="Manage attendance">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm">Attendance</span>
              </Link>

              <Link href="/leaves" className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white btn-lg h-24 flex flex-col items-center justify-center gap-2`} tabIndex={0} aria-label="Manage leave">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Leave</span>
              </Link>

              {role === 'admin' && (
                <>
                  <Link href="/companies" className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white btn-lg h-24 flex flex-col items-center justify-center gap-2`} tabIndex={0} aria-label="Manage companies">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm">Companies</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Announcements Panel */}
        <div className={`card ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'} shadow-xl hover:shadow-2xl transition-shadow duration-300 ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-600'}`}>
          <div className="card-body">
            <div className={`flex justify-between items-center border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'} pb-3 mb-4`}>
              <h2 className={`card-title text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Recent Announcements</h2>
              <Link href="/announcements" className={`btn btn-sm ${theme === 'light' ? 'bg-transparent hover:bg-slate-100 text-slate-600' : 'bg-transparent hover:bg-slate-700 text-slate-300'}`} tabIndex={0} aria-label="View all announcements">
                View all
              </Link>
            </div>

            {recentAnnouncements.length > 0 ? (
              <div className="space-y-5">
                {recentAnnouncements.map(announcement => {
                  const preview = contentToPlainText(announcement.content);
                  const short = preview.length > 150 ? `${preview.slice(0, 150)}…` : preview;
                  
                  // Check if announcement has image attachments
                  const imageAttachments = announcement.attachments?.filter(att => 
                    att.content_type.startsWith('image/')
                  ) || [];
                  
                  return (
                    <div key={announcement.id} className={`${theme === 'light' ? 'bg-white' : 'bg-slate-700'} border-l-4 ${theme === 'light' ? 'border-blue-600' : 'border-blue-400'} rounded-r-lg pl-4 pr-3 py-3 hover:shadow-md transition-shadow ${theme === 'light' ? 'border border-slate-200' : 'border border-slate-600'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>{announcement.title}</h3>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'} mb-3`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(announcement.created_at)}
                      </div>

                      {/* Render excerpt as plain text */}
                      <div className={`prose prose-sm max-w-none mb-3 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        <p className="whitespace-pre-wrap">{short}</p>
                      </div>
                      
                      {/* Image attachments preview */}
                      {imageAttachments.length > 0 && (
                        <div className="mb-3">
                          <div className="grid grid-cols-3 gap-2">
                            {imageAttachments.slice(0, 3).map((attachment, index) => (
                              <div 
                                key={attachment.id} 
                                className="relative aspect-square cursor-pointer overflow-hidden rounded-md border border-slate-200"
                                onClick={() => openImageGallery(announcement, index)}
                              >
                                <img 
                                  src={attachment.download_url} 
                                  alt={attachment.original_filename}
                                  className="h-full w-full object-cover"
                                />
                                {index === 2 && imageAttachments.length > 3 && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold">
                                    +{imageAttachments.length - 3}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Attachments indicator */}
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className={`flex items-center gap-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} text-sm mt-1 mb-2`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {announcement.attachments.length} {announcement.attachments.length === 1 ? 'attachment' : 'attachments'}
                        </div>
                      )}

                      <div>
                        <button
                          onClick={() => openAnnouncementModal(announcement)}
                          className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white`}
                          tabIndex={0}
                          aria-label={`Read more about ${announcement.title}`}
                        >
                          Read more
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`alert ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={`${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} shrink-0 w-6 h-6 stroke-current`}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>No announcements at this time</span>
              </div>
            )}
            {role === 'admin' && (
              <div className="card-actions justify-end mt-6">
                <Link
                  href="/announcements/create"
                  className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                  tabIndex={0}
                  aria-label="Create new announcement"
                >
                  Create Announcement
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Announcement Modal */}
      <dialog id="announcement_modal" className={`modal ${showAnnouncementModal ? 'modal-open' : ''}`}>
        <div className={`modal-box w-11/12 max-w-4xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          {/* Header */}
          <div className={`${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'} px-6 py-4 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'}`}>
            {selectedAnnouncement && (
              <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>{selectedAnnouncement.title}</h3>
            )}
            <form method="dialog">
              <button
                className={`btn btn-sm btn-circle btn-ghost absolute right-4 top-4 ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-600'}`}
                onClick={() => setShowAnnouncementModal(false)}
              >✕</button>
            </form>
          </div>

          {/* Content */}
          {selectedAnnouncement && (
            <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
              <div className={`flex items-center gap-2 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'} mb-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(selectedAnnouncement.created_at)}
              </div>

              {/* PATCH: Render announcement content as HTML (supports Slate JSON) */}
              <div
                className={`prose max-w-none mb-6 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
                dangerouslySetInnerHTML={{ __html: contentToHtml(selectedAnnouncement.content) }}
              />

              {/* Attachments Section (unchanged) */}
              {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                <div className={`mt-6 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'} pt-4`}>
                  <h4 className={`font-medium text-base mb-3 flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Attachments ({selectedAnnouncement.attachments.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedAnnouncement.attachments.map(attachment => (
                      <a 
                        key={attachment.id} 
                        href={attachment.download_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50 hover:bg-slate-100' : 'border-slate-600 bg-slate-700 hover:bg-slate-600'} transition-colors flex items-center gap-3`}
                      >
                        <div className={`${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-400'} p-2 rounded-md`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>{attachment.original_filename}</p>
                          <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Click to view</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className={`modal-action px-6 py-4 border-t ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'} m-0`}>
            <form method="dialog">
              <button
                className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                onClick={() => setShowAnnouncementModal(false)}
              >Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowAnnouncementModal(false)}>close</button>
        </form>
      </dialog>

      {/* Announcement Read Modal (auto-popup) */}
      {newAnnouncementModalOpen && currentAnnouncement && role !== 'admin' &&
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className={`relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden`}>

              {/* Header */}
              <div className={`bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-blue-25' : 'from-slate-700 to-slate-600'} p-6 relative overflow-hidden`}>
                <div className={`absolute -right-16 -top-16 w-32 h-32 ${theme === 'light' ? 'bg-blue-600/20' : 'bg-blue-400/20'} rounded-full`}></div>
                <div className={`absolute right-20 -top-8 w-24 h-24 ${theme === 'light' ? 'bg-blue-600/15' : 'bg-blue-400/15'} rounded-full`}></div>
                <div className={`absolute left-10 -bottom-8 w-16 h-16 ${theme === 'light' ? 'bg-blue-600/10' : 'bg-blue-400/10'} rounded-full`}></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`badge ${theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'} text-white border-0`}>New</div>
                    <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-300'}`}>{formatAnnouncementDate(currentAnnouncement.created_at)}</p>
                  </div>
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{currentAnnouncement.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* PATCH: render popup content as HTML (handles Slate JSON) */}
                <div
                  className="prose prose-sm sm:prose max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: contentToHtml(currentAnnouncement.content) }}
                />

                {/* Attachments Section (unchanged) */}
                {currentAnnouncement.attachments && currentAnnouncement.attachments.length > 0 && (
                  <div className={`mt-6 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'} pt-4`}>
                    <h4 className={`font-medium text-base mb-3 flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attachments ({currentAnnouncement.attachments.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {currentAnnouncement.attachments.map(attachment => (
                        <div key={attachment.id} className={`${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-700 border-slate-600'} border rounded-lg overflow-hidden hover:shadow-md transition-shadow`}>
                          {/* ... attachment tile unchanged ... */}
                          <div className="aspect-square relative">
                            {canPreviewFile(attachment.content_type) ? (
                              attachment.content_type.startsWith('image/') ? (
                                <img 
                                  src={attachment.download_url} 
                                  alt={attachment.original_filename}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'bg-red-50 text-red-600' : 'bg-red-900 text-red-400'}`}>
                                  <div className="text-center">
                                    {/* PDF icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs mt-1 font-medium">PDF</p>
                                  </div>
                                </div>
                              )
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-600 text-slate-300'}`}>
                                <div className="text-center">
                                  {getFileIcon(attachment.content_type)}
                                  <p className="text-xs mt-1 font-medium">FILE</p>
                                </div>
                              </div>
                            )}
                            <a
                              href={attachment.download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"
                            >
                              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} p-2 rounded-full shadow-lg`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </a>
                          </div>
                          <div className="p-2">
                            <p className={`text-xs font-medium truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`} title={attachment.original_filename}>
                              {attachment.original_filename}
                            </p>
                            <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                              {(attachment.file_size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with acknowledgment */}
              <div className={`${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'} p-4 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                {currentAnnouncement.is_acknowledgement ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={isAcknowledged}
                      onChange={(e) => setIsAcknowledged(e.target.checked)}
                    />
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>I acknowledge that I have read this announcement</span>
                  </label>
                ) : (
                  <span></span>
                )}

                <button
                  className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${!isAcknowledged && currentAnnouncement.is_force_login ? 'btn-disabled' : ''}`}
                  onClick={() => handleSubmitAnnouncementRead(isAcknowledged)}
                  disabled={!isAcknowledged && currentAnnouncement.is_force_login}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      }


{/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-50">
    {/* Light backdrop (click to close) */}
    <div
      className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"
      onClick={() => setIsModalOpen(false)}
    />

    {/* Modal card */}
    <div className="relative z-10 flex min-h-full items-center justify-center px-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">📋</span>
            {selectedStatus?.label} — Affected Employees
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Table */}
          {affectedEmployees.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No employees affected.</p>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-700 text-left text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                      Name{' '}
                      <span className="inline-block text-xs">
                        {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('company_name')}>
                      Company{' '}
                      <span className="inline-block text-xs">
                        {sortField === 'company_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('department')}>
                      Department{' '}
                      <span className="inline-block text-xs">
                        {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('position')}>
                      Position{' '}
                      <span className="inline-block text-xs">
                        {sortField === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('expired_date')}>
                      Expired Date{' '}
                      <span className="inline-block text-xs">
                        {sortField === 'expired_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </span>
                    </th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedEmployees
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((emp: any) => (
                      <tr key={emp.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-medium text-slate-900">{emp.name}</td>
                        <td className="px-4 py-3 text-slate-700">{emp.company_name}</td>
                        <td className="px-4 py-3 text-slate-700">{emp.department}</td>
                        <td className="px-4 py-3 text-slate-700">{emp.position}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {selectedStatus?.document === 'visa'
                            ? emp.visa_expired_date
                              ? new Date(emp.visa_expired_date).toLocaleDateString()
                              : '-'
                            : emp.passport_expired_date
                            ? new Date(emp.passport_expired_date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/employees/${emp.id}`}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Inline Pagination (no separate component) */}
          {affectedEmployees.length > 0 && (() => {
            const totalItems = affectedEmployees.length;
            const pageSize = itemsPerPage;
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            const startItem = (currentPage - 1) * pageSize + 1;
            const endItem = Math.min(startItem + pageSize - 1, totalItems);

            // windowed pages like 1 2 3
            const windowSize = 3;
            const half = Math.floor(windowSize / 2);
            let start = Math.max(1, currentPage - half);
            let end = start + windowSize - 1;
            if (end > totalPages) {
              end = totalPages;
              start = Math.max(1, end - windowSize + 1);
            }
            const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            const baseBtn =
              'inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition';
            const ghost =
              'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white';
            const active =
              'border-blue-600 bg-blue-600 text-white hover:bg-blue-700';

            return (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
                  <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
                  <span className="font-semibold text-slate-800">{totalItems}</span> employees on this page
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={`${baseBtn} ${ghost}`}
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button
                    className={`${baseBtn} ${ghost}`}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    «
                  </button>

                  {pages.map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`${baseBtn} ${pageNum === currentPage ? active : ghost}`}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={pageNum === currentPage ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    className={`${baseBtn} ${ghost}`}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    »
                  </button>
                  <button
                    className={`${baseBtn} ${ghost}`}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => setIsModalOpen(false)}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Image Gallery Modal */}
      {showImageModal && imageAttachments.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-50 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
              onClick={() => setShowImageModal(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            {/* Navigation buttons */}
            {imageAttachments.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}
            
            {/* Image display */}
            <div 
              className="max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={imageAttachments[currentImageIndex].download_url}
                alt={imageAttachments[currentImageIndex].original_filename}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Image counter */}
            {imageAttachments.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                  {currentImageIndex + 1} / {imageAttachments.length}
                </div>
              </div>
            )}
            
            {/* Thumbnail navigation */}
            {imageAttachments.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4">
                {imageAttachments.map((img, index) => (
                  <button
                    key={img.id}
                    className={`w-12 h-12 rounded overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={img.download_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>  
  );
}
