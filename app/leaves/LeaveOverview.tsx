'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import InfoBoxes from './InfoBoxes';
import LeaveBalanceSummary from './LeaveBalanceSummary';
import RecentLeaveRequests from './RecentLeaveRequests';
import CalendarAndRecentRequests from './CalendarAndRecentRequests';
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegHourglass } from "react-icons/fa";
import { LiaUserSlashSolid } from "react-icons/lia";
import { addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { formatInTimeZone,toZonedTime } from 'date-fns-tz';
import { fileURLToPath } from 'url';
import EmployeeDocumentManager, { EmployeeDocument } from '../components/EmployeeDocumentManager';
import { calculateDateInUTC, calculateDuration, getBadgeClass } from '../utils/utils';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../hooks/useNotification';
import { useTheme } from '../components/ThemeProvider';
import ConvertToSingaporeTimeZone from '../components/ConvertToSingaporeTimeZone';
import {format } from 'date-fns'


interface RecentLeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  department_name: string;
  department_id: number;
  leave_type_id: number;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string;
  status: 'PENDING' | 'FIRST_APPROVED' | 'APPROVED' | 'REJECTED';
  approver_id?: number;
  approval_date?: string;
  approval_comment?: string;
  rejection_reason?: string;
  created_at: string;
  document_url?: string;
  file_name?: string;
  first_approver_name?: string;
  second_approver_name?: string;
  updated_at: string;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface LeaveType {
  id: number;
  leave_type_name: string;
  description: string;
  max_days: number;
  is_paid: boolean;
  is_active: boolean;
  requires_documentation: boolean;
}

interface LeaveBalance {
  id: number;
  employee_id: string;
  leave_type_id: string;
  leave_type_name: string;
  year: number;
  total_days: number;
  used_days: number;
  remaining_days: number;
  accrual_days: number;
  accrual_remaining_days: number;
  is_total: boolean;
  total_type: string;
  is_divident: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id: number;
  department_id: number;
  gender?: string;
}

interface FormErrors {
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  attachment: string;
}

// Alternative helper function for UTC to Singapore timezone conversion
const convertUTCToSingapore = (utcDateString: string, formatStr: string = 'dd MMM yyyy hh:mm a'): string => {
  try {
    // Parse the UTC date string manually
    let utcDate: Date;
    
    if (utcDateString.includes('T')) {
      // Already in ISO format
      utcDate = new Date(utcDateString);
    } else {
      // Convert "YYYY-MM-DD HH:mm:ss" to ISO format
      const isoString = utcDateString.replace(' ', 'T') + '.000Z';
      utcDate = new Date(isoString);
    }
    
    // If date is invalid, try parsing differently
    if (isNaN(utcDate.getTime())) {
      utcDate = new Date(utcDateString);
    }
    
    // Manually add 8 hours for Singapore timezone (GMT+8)
    const singaporeTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
    
    // Format the result
    return format(singaporeTime, formatStr);
  } catch (error) {
    console.error('Error in convertUTCToSingapore:', error);
    return 'Invalid date';
  }
};

// Helper function to properly parse UTC datetime and convert to Singapore timezone
const formatUTCToSingapore = (utcDateString: string, formatStr: string = 'dd MMM yyyy hh:mm a'): string => {
  try {
    // Debug: Log the original string
    console.log('Original datetime string:', utcDateString);
    
    let utcDate: Date;
    
    // Handle different possible UTC datetime formats
    if (utcDateString.includes('T')) {
      // ISO format: "2024-01-15T10:30:00.000Z" or "2024-01-15T10:30:00"
      utcDate = new Date(utcDateString.endsWith('Z') ? utcDateString : utcDateString + 'Z');
    } else {
      // MySQL format: "2024-01-15 10:30:00"
      utcDate = new Date(utcDateString.replace(' ', 'T') + 'Z');
    }
    
    // Debug: Log the parsed UTC date
    console.log('Parsed UTC date:', utcDate);
    
    // Convert to Singapore timezone
    const singaporeFormatted = formatInTimeZone(utcDate, 'Asia/Singapore', formatStr);
    
    // Debug: Log the Singapore formatted result
    console.log('Singapore formatted:', singaporeFormatted);
    
    return singaporeFormatted;
  } catch (error) {
    console.error('Error formatting datetime:', error, 'Original string:', utcDateString);
    // Fallback to original behavior
    return format(new Date(utcDateString), formatStr);
  }
};

const LeaveOverview = () => {
  const { theme } = useTheme();
  const { notification, showNotification } = useNotification();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [formData, setFormData] = useState<{
    type: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    reason: string;
    attachment: File | null;
    isHalfDay: boolean;
  }>({
    type: '',
    startDate: undefined,
    endDate: undefined,
    reason: '',
    attachment: null,
    isHalfDay: false
  });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveTypesByEmployeeId, setLeaveTypesByEmployeeId] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentLeaveRequests, setRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
  const [myRecentLeaveRequests, setMyRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
  const [allRecentLeaveRequests, setAllRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
  const [role, setRole] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({
    type: '',
    reason: '',
    startDate: '',
    endDate: '',
    attachment: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [editingRequestAttachment, setEditingRequestAttachment] = useState<{ url: string, name: string } | null>(null);
  const [selectedLeaveDocuments, setSelectedLeaveDocuments] = useState<any[]>([]);
  const [editingRequestDocuments, setEditingRequestDocuments] = useState<any[]>([]);
  const [documentManagerKey, setDocumentManagerKey] = useState(0);
  const [showAllLeaveHistory, setShowAllLeaveHistory] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RecentLeaveRequest | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Get user role from localStorage
    const userRole = localStorage.getItem('hrms_role');
    if (userRole) {
      setRole(userRole);
    }

    const token = localStorage.getItem('hrms_token');
    if (token) {
      setToken(token);
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('hrms_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  // Filter leave types based on user gender
  const getFilteredLeaveTypes = () => {
    // Don't apply gender filtering for admin users
    if (user?.role?.toLowerCase() === 'admin') {
      return leaveTypesByEmployeeId;
    }

    // Get gender from localStorage
    const userFromStorage = localStorage.getItem('hrms_user');
    if (!userFromStorage) return leaveTypesByEmployeeId;
    
    try {
      const parsedUser = JSON.parse(userFromStorage);
      const gender = parsedUser?.gender;
      
      if (!gender) return leaveTypesByEmployeeId;

      return leaveTypesByEmployeeId.filter(type => {
        const leaveTypeName = type.leave_type_name.toLowerCase();
        
        // Hide paternity leave for non-male users
        if (leaveTypeName.includes('paternity') && gender !== 'Male') {
          return false;
        }
        
        // Hide maternity leave for non-female users
        if (leaveTypeName.includes('maternity') && gender !== 'Female') {
          return false;
        }
        
        // If gender is 'Other', hide both paternity and maternity
        if (gender === 'Other' && 
            (leaveTypeName.includes('paternity') || leaveTypeName.includes('maternity'))) {
          return false;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return leaveTypesByEmployeeId;
    }
  };

  const fetchLeaveData = useCallback(async () => {//async () => {
    try {
      setIsLoading(true);
      if (!user?.id) {
        console.error('No user ID available');
        return;
      }

      const [typesResponse, balancesResponse, recentLeavesResponse, myRecentLeavesResponse, leaveTypesByEmployeeResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          },
          params: {
            employeeId: user.id
          }
        }),
        axios.get(`${API_BASE_URL}/api/v1/leaves/balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          },
          params: {
            employeeId: user.id,
            year: new Date().getFullYear()
          }
        }),
        axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }),
        axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          },
          params: {
            employeeId: user.id
          }
        }),
        axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          },
          params: {
            employeeId: user.id
          }
        })
      ]);
      setLeaveTypes(typesResponse.data);
      setLeaveTypesByEmployeeId(leaveTypesByEmployeeResponse.data);
      console.log(balancesResponse.data);
      setLeaveBalances(balancesResponse.data);
      setRecentLeaveRequests(recentLeavesResponse.data.filter((request: RecentLeaveRequest) => request.employee_id.toString() !== user?.id.toString()));
      setMyRecentLeaveRequests(recentLeavesResponse.data.filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString()));
      setAllRecentLeaveRequests(recentLeavesResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching leave data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);//};

  // Fetch leave types and balances
  useEffect(() => {
    if (user?.id) {
      fetchLeaveData();
    }
  }, [user?.id, fetchLeaveData]);

  const openEditModal = async (request: RecentLeaveRequest) => {
    setFormData({
      type: request.leave_type_name.toLowerCase(),
      startDate: new Date(request.start_date),
      endDate: new Date(request.end_date),
      reason: request.reason,
      attachment: null,
      isHalfDay: request.duration === 0.5
    });
    setIsEditing(true);
    setEditingRequestId(request.id);
    setShowRequestModal(true);
    // If the request has an attachment, set it for download
    if (request.document_url && request.file_name) {
      setEditingRequestAttachment({ url: request.document_url, name: request.file_name });
    } else {
      setEditingRequestAttachment(null);
    }
    // Fetch all documents for this leave application
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setEditingRequestDocuments(res.data);
    } catch (err) {
      setEditingRequestDocuments([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const startDate = new Date(Date.UTC(
        formData.startDate?.getFullYear() || 0,
        formData.startDate?.getMonth() || 0,
        formData.startDate?.getDate() || 0)
      ).toISOString().split('T')[0];
      const endDate = new Date(Date.UTC(
        formData.endDate?.getFullYear() || 0,
        formData.endDate?.getMonth() || 0,
        formData.endDate?.getDate() || 0)
      ).toISOString().split('T')[0];
      try {
        const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
        if (!selectedType) {
          throw new Error('Invalid leave type');
        }
        let response;
        if (isEditing && editingRequestId) {
          // Update existing leave request
          const updateFormData = new FormData();
          updateFormData.append("leave_type_id", selectedType.id.toString());
          updateFormData.append("start_date", startDate);
          updateFormData.append("end_date", endDate);
          updateFormData.append("reason", formData.reason);
          if (formData.isHalfDay) {
            updateFormData.append("is_half_day", "1");
            updateFormData.append("duration", "0.5");
          } 
          // Add multiple attachments from EmployeeDocumentManager
          if (selectedLeaveDocuments.length > 0) {
            selectedLeaveDocuments.forEach((doc, idx) => {
              if (doc.file) {
                updateFormData.append('attachments[]', doc.file);
              }
            });
          } else if (formData.attachment) {
            updateFormData.append("attachment", formData.attachment);
          }
          response = await axios.put(`${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, updateFormData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          // Create new leave request
          const formDataToSend = new FormData();
          formDataToSend.append("employee_id", user?.id?.toString() || '');
          formDataToSend.append("leave_type_id", selectedType.id.toString());
          formDataToSend.append("start_date", startDate);
          formDataToSend.append("end_date", endDate);
          formDataToSend.append("reason", formData.reason);
          if (formData.isHalfDay) {
            formDataToSend.append("is_half_day", "1");
            formDataToSend.append("duration", "0.5");
          } 
          formDataToSend.append("status", 'PENDING');
          // Add multiple attachments from EmployeeDocumentManager
          if (selectedLeaveDocuments.length > 0) {
            selectedLeaveDocuments.forEach((doc, idx) => {
              if (doc.file) {
                formDataToSend.append('attachments[]', doc.file);
              }
            });
          } else if (formData.attachment) {
            formDataToSend.append("attachment", formData.attachment);
          }
          response = await axios.post(`${API_BASE_URL}/api/v1/leaves`, formDataToSend, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        if (response.status === 201 || response.status === 200) {
          showNotification(isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 'success');
          setFormData({
            type: '',
            startDate: undefined,
            endDate: undefined,
            reason: '',
            attachment: null,
            isHalfDay: false
          });
          resetLeaveAttachment();
          setShowRequestModal(false);
          setIsEditing(false);
          setEditingRequestId(null);
          setEditingRequestAttachment(null);
          fetchLeaveData();
        }
      } catch (err) {
        console.error('Error submitting leave request:', err);
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          showNotification(err.response.data.message, 'error');
        } else {
          showNotification('Failed to submit leave request. Please try again.', 'error');
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, attachment: file });
  };

  // Add function to check for conflicting dates
  const hasDateConflict = (startDate: Date, endDate: Date): boolean => {
    // Get all approved and pending leave requests
    const existingRequests = myRecentLeaveRequests.filter(
      request => {
        // When editing, exclude the current request from conflict check
        if (isEditing && editingRequestId === request.id) {
          return false;
        }
        return request.status === 'APPROVED' || request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
      }
    );

    // Check each existing request for overlap
    return existingRequests.some(request => {
      const requestStart = calculateDateInUTC(new Date(request.start_date));
      const requestEnd = calculateDateInUTC(new Date(request.end_date));
      const checkStart = calculateDateInUTC(startDate);
      const checkEnd = calculateDateInUTC(endDate);
      
      // Check if the new date range overlaps with any existing request
      return (
        (checkStart <= requestEnd && checkEnd >= requestStart) || // New request overlaps with existing request
        (checkStart >= requestStart && checkStart <= requestEnd) || // New start date falls within existing request
        (checkEnd >= requestStart && checkEnd <= requestEnd) // New end date falls within existing request
      );
    });
  };

  // Update handleDateChange to check for conflicts
  const handleDateChange = (value: string, isStartDate: boolean) => {
    const date = new Date(value);
    const newFormData = { ...formData };
    
    if (isStartDate) {
      newFormData.startDate = date;
    } else {
      newFormData.endDate = date;
    }

    // Reset isHalfDay if dates don't match
    if (newFormData.startDate && newFormData.endDate && 
        calculateDateInUTC(newFormData.startDate).toISOString().split('T')[0] !== calculateDateInUTC(newFormData.endDate).toISOString().split('T')[0]) {
      newFormData.isHalfDay = false;
    }

    // Get emergency leave type and balance
    const emergencyLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'emergency leave');
    const emergencyBalance = emergencyLeave ? leaveBalances.find(b => b.leave_type_id === emergencyLeave.id.toString()) : null;
    const hasEmergencyLeaveRemaining = emergencyBalance && emergencyBalance.remaining_days > 0;

    // Get unpaid leave type
    const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');

    // Check if current type is emergency leave and has 0 remaining days
    if (formData.type.toLowerCase() === 'emergency leave' && emergencyBalance && emergencyBalance.remaining_days === 0) {
      if (unpaidLeave) {
        newFormData.type = 'unpaid leave';
        showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
        setFormData(newFormData);
        return;
      }
    }

    // Check if annual leave and within 5 days
    if (formData.type.toLowerCase() === 'annual leave' && isLessThan5Days(date)) {
      if (!hasEmergencyLeaveRemaining) {
        // If no emergency leave remaining, convert to unpaid leave
        if (unpaidLeave) {
          newFormData.type = 'unpaid leave';
          showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
        }
      } else {
        // Convert to emergency leave if there are remaining days
        newFormData.type = 'emergency leave';
        showNotification('Leave type changed to Emergency Leave as the date is less than 5 days from today', 'error');
      }
    }

    // Check for date conflicts
    if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
      showNotification('This date range conflicts with an existing leave request', 'error');
      return;
    }

    setFormData(newFormData);
  };

  // Update validateForm to include date conflict check
  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      type: '',
      reason: '',
      startDate: '',
      endDate: '',
      attachment: ''
    };

    if (!formData.type || formData.type === 'Select') {
      newErrors.type = 'Please select a leave type';
      isValid = false;
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a reason for your leave request';
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date';
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Please select an end date';
      isValid = false;
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date cannot be before start date';
      isValid = false;
    }

    // Check for date conflicts
    if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
      newErrors.startDate = 'This date range conflicts with an existing leave request';
      isValid = false;
    }

    // Check if documentation is required based on leave type
    const selectedLeaveType = leaveTypesByEmployeeId.find(type => 
      type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
    );

    if (selectedLeaveType?.requires_documentation && 
        !formData.attachment && 
        (!selectedLeaveDocuments || selectedLeaveDocuments.length === 0)) {
      // Skip attachment validation if editing and documents already exist
      if (!(isEditing && editingRequestDocuments && editingRequestDocuments.length > 0)) {
        newErrors.attachment = 'Please provide an attachment for your leave request';
        isValid = false;
      }
    }

    // Check if request duration exceeds remaining balance
    if (formData.type !== 'unpaid leave') {
      const requestDuration = getRequestDuration();
      const remainingDays = getRemainingDays();
      if (requestDuration > remainingDays) {
        const message = `Request duration (${requestDuration} days) exceeds remaining balance (${remainingDays} days)`;
        showNotification(message, 'error');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Get remaining days for selected leave type
  const getRemainingDays = () => {
    const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
    if (!selectedType) return 0;

    const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
    let remainingDays = 0;
    if (balance?.is_total) {
      remainingDays = balance?.remaining_days ?? 0;
    } else if (balance?.is_divident) {
      remainingDays = balance?.accrual_remaining_days ?? 0;
    } else {
      remainingDays = balance?.remaining_days ?? 0;
    }

    // If remaining days is 0, convert to unpaid leave
    if (remainingDays === 0 && selectedType.leave_type_name.toLowerCase() !== 'unpaid leave') {
      const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
      if (unpaidLeave) {
        setFormData({ ...formData, type: 'unpaid leave' });
        showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
      }
    }

    return remainingDays;
  };

  // Get total days for selected leave type
  const getTotalDays = () => {
    const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
    if (!selectedType) return 0;

    const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
    return balance?.total_days ?? 0;
  };

  // Get used days for selected leave type
  const getUsedDays = () => {
    const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
    if (!selectedType) return 0;

    const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
    return balance?.used_days ?? 0;
  };

  // Get current request duration
  const getRequestDuration = () => {
    if (!formData.startDate || !formData.endDate) {
      return 0;
    }
    return calculateDuration(formData.startDate, formData.endDate);
  };

  // Check if request duration exceeds remaining days
  const isDurationExceeded = () => {
    const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
    if (!selectedType || !selectedType.is_paid) return false;
    const remainingDays = getRemainingDays();
    const requestDuration = getRequestDuration();
    return requestDuration > remainingDays;
  };

  const getRejectedLeaves = () => {
    if (user?.role === 'employee') {
      const rejectedLeave = allRecentLeaveRequests
        .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
        .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
        .length;

      return rejectedLeave;
    } else if (user?.role === 'supervisor' || user?.role === 'manager') {
      const rejectedLeave = allRecentLeaveRequests
        .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
        .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
        .length;

      return rejectedLeave;
    } else if (user?.role === 'admin') {
      const rejectedLeave = allRecentLeaveRequests
        .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
        .length;

      return rejectedLeave;
    } else {
      return 0;
    }
  };

  const getPendingLeaves = () => {
    if (user?.role === 'employee') {
      const rejectedLeave = allRecentLeaveRequests
        .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
        .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
        .length;

      return rejectedLeave;
    } else if (user?.role === 'supervisor') {
      const rejectedLeave = allRecentLeaveRequests
        .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
        .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING')
        .length;

      return rejectedLeave;
  } else if (user?.role === 'manager') {
    const rejectedLeave = allRecentLeaveRequests
      .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
      .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
      .length;

    return rejectedLeave;
  } else if (user?.role === 'admin') {
      const rejectedLeave = allRecentLeaveRequests
        .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
        .length;

      return rejectedLeave;
    } else {
      return 0;
    }
  };  

  // Get current request duration
  const getOnLeaveToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user?.role === 'employee') {
      const onLeaveToday = allRecentLeaveRequests
      .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
      .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
      .filter((request: RecentLeaveRequest) => {
        const startDate = new Date(request.start_date);
        const endDate = new Date(request.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today >= startDate && today <= endDate;
      })
      .length;
      return onLeaveToday;

    } else if (user?.role === 'supervisor' || user?.role === 'manager') {
      const onLeaveToday = allRecentLeaveRequests
      .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
      .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
      .filter((request: RecentLeaveRequest) => {
        const startDate = new Date(request.start_date);
        const endDate = new Date(request.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today >= startDate && today <= endDate;
      })
      .length;
      return onLeaveToday;

    } else if (user?.role === 'admin') {
      const onLeaveToday = allRecentLeaveRequests
      .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
      .filter((request: RecentLeaveRequest) => {
        const startDate = new Date(request.start_date);
        const endDate = new Date(request.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today >= startDate && today <= endDate;
      })
      .length;
      return onLeaveToday;

    } else {
      return 0;
    }

    const onLeaveToday = recentLeaveRequests
      .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
      .filter((request: RecentLeaveRequest) => {
        const startDate = new Date(request.start_date);
        const endDate = new Date(request.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return today >= startDate && today <= endDate;
      })
      .length;

    return onLeaveToday;
  };

  const getApprovedLeaveDates = () => {
    if (!myRecentLeaveRequests) return [];

    return myRecentLeaveRequests
      .filter(request => request.status === 'APPROVED')
      .flatMap(request => {
        const start = new Date(request.start_date);
        const end = new Date(request.end_date);
        return eachDayOfInterval({ start, end });
      });
  };

  const getPendingLeaveDates = () => {
    if (!myRecentLeaveRequests) return [];

    return myRecentLeaveRequests
      .filter(request => request.status === 'PENDING')
      .flatMap(request => {
        const start = new Date(request.start_date);
        const end = new Date(request.end_date);
        return eachDayOfInterval({ start, end });
      });
  };

  const renderDayContents = (day: Date) => {
    const approvedDates = getApprovedLeaveDates();
    const pendingDates = getPendingLeaveDates();
    const isOnLeave = approvedDates.some(date => isSameDay(date, day));
    const isPending = pendingDates.some(date => isSameDay(date, day));
    const isToday = isSameDay(day, new Date());

    return (
      <div className={`h-full w-full flex items-center justify-center ${isOnLeave ? 'bg-green-500 text-white rounded-full' :
          isPending ? 'bg-yellow-500 text-white rounded-full' :
            isToday ? 'bg-blue-500 text-white rounded-full' : ''
        }`}>
        {day.getDate()}
      </div>
    );
  };

  const resetLeaveAttachment = () => {
    setSelectedLeaveDocuments([]);
    setFormData(prev => ({
      ...prev,
      attachment: null
    }));
    setEditingRequestAttachment(null);
    setDocumentManagerKey(prev => prev + 1);
  }

  const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
    if (removedFile) {
      setSelectedLeaveDocuments(prev => 
        prev.filter(file => 
          !(file.name === removedFile.name && 
            file.documentType === removedFile.documentType && 
            file.file === removedFile.file)
        )
      );
    }
  };

  function getAttachmentIdFromUrl(url: string) {
    const parts = url.split('/');
    return parts.length >= 2 ? parts[parts.length - 2] : null;
  }

  // Add function to check if dates are less than 14 days from today
  const isLessThan14Days = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 14;
  };

  // Add function to check if dates are less than 5 days from today
  const isLessThan5Days = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 5;
  };

  // Add function to handle leave type change
  const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    
    // Skip check if "Select" is chosen
    if (newType === 'Select') {
      setFormData({ ...formData, type: newType });
      return;
    }

    // Find the selected leave type
    const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === newType.toLowerCase());
    if (!selectedType) return;

    // Check remaining days
    const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
    const remainingDays = balance?.remaining_days ?? 0;

    // If remaining days is 0, convert to unpaid leave
    if (remainingDays === 0 && newType.toLowerCase() !== 'unpaid leave') {
      const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
      if (unpaidLeave) {
        setFormData({ ...formData, type: 'unpaid leave' });
        showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
        return;
      }
    }

    // If no conversion needed, set the selected type
    setFormData({ ...formData, type: newType });
  };

  const handleCancelLeave = async (requestId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/cancel`, {
        employee_id: user?.id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      showNotification('Leave request cancelled successfully', 'success');
      setShowCancelConfirm(false);
      setIsViewModalOpen(false);
      fetchLeaveData();
    } catch (err) {
      console.error('Error cancelling leave request:', err);
      showNotification('Failed to cancel leave request', 'error');
    }
  };

  const handleViewRequest = async (request: RecentLeaveRequest) => {
    try {
      // Fetch leave documents
      const documentsResponse = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      const documents = documentsResponse.data;
      
      // If there are documents, update the request with the first document's info
      if (documents && documents.length > 0) {
        const firstDocument = documents[0];
        request.document_url = firstDocument.document_url;
        request.file_name = firstDocument.file_name;
      }
      
      setSelectedRequest(request);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error('Error fetching leave documents:', err);
      // Still show the request even if document fetch fails
      setSelectedRequest(request);
      setIsViewModalOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const downloadAttachment = async (requestId: number, fileName: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/download-attachment/${requestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        },
        responseType: 'blob'
      });

      // Create a blob from the response data
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = requestId + '-' + fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading attachment:', err);
      showNotification('Failed to download attachment. Please try again.', 'error');
    }
  };

  const totalPages = Math.ceil(myRecentLeaveRequests.length / itemsPerPage);
  const paginatedRequests = myRecentLeaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const calculateRemainingDaysStat = () => {
    const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
    return calculateLeaveStat(leave);
  }

  const setRemainingDaysStat = () => {
    const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
    return setLeaveStat(leave);
  }

  const calculateMedicalLeaveStat = () => {
    const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
    return calculateLeaveStat(leave);
  }

  const setMedicalLeaveStat = () => {
    const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
    return setLeaveStat(leave);
  }

  const calculateEmergencyLeaveStat = () => {
    const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
    return calculateLeaveStat(leave);
  }

  const setEmergencyLeaveStat = () => {
    const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
    return setLeaveStat(leave);
  }   

  const calculateLeaveStat = (leave: LeaveBalance | undefined) => {
    return leave?.remaining_days;
  }

  const setLeaveStat = (leave: LeaveBalance | undefined) => {
    return `${leave?.used_days} used / ${leave?.total_days} total`;
  }
  
  // Smart pagination functions
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleWithdrawLeaveRequest = async (requestId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/withdraw`, {
        employee_id: user?.id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      showNotification('Leave request withdrawn successfully', 'success');
      setShowCancelConfirm(false);
      setIsViewModalOpen(false);
      fetchLeaveData();
    } catch (err) {
      console.error('Error withdrawing leave request:', err);
      showNotification('Failed to withdraw leave request. Please try again.', 'error');
    }
  };

  // Check if the start date has passed
  const isStartDatePassed = (startDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Set to start of day
    return start < today;
  };

  return (
    <div className={`container mx-auto p-3 sm:p-4 lg:p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
      {/* Notification Toast */}
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      
      {/* Header with stats cards */}
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
            Manage your leave requests and view your leave balance
          </p>
          {role !== 'admin' && (
            <button
              className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
              onClick={() => setShowRequestModal(true)}
            >
              Request Leave
            </button>
          )}
        </div>

        {/* Leave balance summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
            <div className="stat-figure text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-title text-white text-sm sm:text-base">Annual Leave</div>
            <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateRemainingDaysStat()}</div>
            <div className="stat-desc text-white text-xs sm:text-sm">{setRemainingDaysStat()}</div>
          </div>

          <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
            <div className="stat-figure text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="stat-title text-white text-sm sm:text-base">Medical Leave</div>
            <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateMedicalLeaveStat()}</div>
            <div className="stat-desc text-white text-xs sm:text-sm">{setMedicalLeaveStat()}</div>
          </div>

          <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
            <div className="stat-figure text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="stat-title text-white text-sm sm:text-base">Emergency Leave</div>
            <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateEmergencyLeaveStat()}</div>
            <div className="stat-desc text-white text-xs sm:text-sm">{setEmergencyLeaveStat()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
            <div className="stat-figure text-white">
              <FaRegCalendarCheck className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="stat-title text-white text-sm sm:text-base">Rejected Leaves</div>
            <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getRejectedLeaves()}</div>
            <div className="stat-desc text-white text-xs sm:text-sm">{getRejectedLeaves()} request{getRejectedLeaves() !== 1 ? 's' : ''} rejected</div>
          </div>

          <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
            <div className="stat-figure text-white">
              <FaRegHourglass className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="stat-title text-white text-sm sm:text-base">Pending Requests</div>
            <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getPendingLeaves()}</div>
            <div className="stat-desc text-white text-xs sm:text-sm">{getPendingLeaves()} request{getPendingLeaves() !== 1 ? 's' : ''} pending</div>
          </div>

          <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
            <div className="stat-figure text-white">
              <LiaUserSlashSolid className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="stat-title text-white text-sm sm:text-base">On Leave Today</div>
            <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getOnLeaveToday()}</div>
            <div className="stat-desc text-white text-xs sm:text-sm">{getOnLeaveToday()} employee{getOnLeaveToday() !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Calendar and Recent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar */}
          <div className={`card shadow-lg lg:col-span-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="card-body p-3 sm:p-4 lg:p-6">
              <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Leave Calendar
              </h2>
              <div className={`p-2 sm:p-4 rounded-lg flex justify-center ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-800'}`}>
                <Calendar
                  date={new Date()}
                  onChange={() => { }}
                  className="custom-calendar"
                  dayContentRenderer={renderDayContents}
                />
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="card-body p-3 sm:p-4 lg:p-6">
              <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden sm:inline">My Recent Requests</span>
                <span className="sm:hidden">Recent Requests</span>
              </h2>
              <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
                <table className="table w-full text-sm">
                  <thead>
                    <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                      <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Type</th>
                      <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecentLeaveRequests.slice(0, 4).map((request, index) => (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== myRecentLeaveRequests.slice(0, 4).length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
                        <td>
                          <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
                          <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {new Date(request.start_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric'
                            })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <LeaveBalanceSummary leaveBalances={leaveBalances} />


        {/* Leave History */}
        <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              My Leave History
            </h2>

            <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
              <table className="table w-full min-w-full">
                <thead>
                  <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Type</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[140px]`}>Dates</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[80px]`}>Duration</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Reason</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map(request => {
                    // Calculate duration in days
                    const duration = Math.ceil(
                      (new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)
                    ) + 1;
                    const canEdit = request.status === 'PENDING';
                    const canCancel = request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
                    return (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}`}>
                        <td>
                          <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>
                          <div className="break-words">
                            {new Date(request.start_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric'
                            })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>{request.duration} day{request.duration !== 1 ? 's' : ''}</td>
                        <td>
                          <div className={`whitespace-normal break-words max-w-xs text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.reason}</div>
                        </td>
                        <td>
                          <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                            {canEdit && (
                              <button
                                className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-slate-600 hover:bg-slate-700' : 'bg-slate-400 hover:bg-slate-500'} text-white border-0`}
                                onClick={() => openEditModal(request)}
                                type="button"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                              onClick={() => handleViewRequest(request)}
                              type="button"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <div className="btn-group flex-wrap gap-1">
                  <button 
                    className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  {getPageNumbers().map(page => (
                    <button 
                      key={page}
                      className={`btn btn-xs sm:btn-sm ${currentPage === page ? 
                        `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                        `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                      }`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                  <button 
                    className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      <dialog
        id="leave_request_modal"
        className={`modal ${showRequestModal ? 'modal-open' : ''}`}
      >
        <div className={`modal-box max-w-3xl p-0 overflow-hidden max-h-[90vh] ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          {/* Modal Header */}
          <div className={`px-6 py-4 border-b ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
            <h3 className={`font-bold text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {isEditing ? 'Edit Leave Request' : 'New Leave Request'}
            </h3>
            <form method="dialog">
              <button
                className={`btn btn-sm btn-circle btn-ghost absolute right-4 top-4 ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
                onClick={() => {
                  setShowRequestModal(false);
                  setIsEditing(false);
                  setEditingRequestId(null);
                  setEditingRequestAttachment(null);
                  setErrors({
                    type: '',
                    reason: '',
                    startDate: '',
                    endDate: '',
                    attachment: ''
                  });
                }}
              >✕</button>
            </form>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.type 
                        ? 'border-red-500 focus:border-red-500' 
                        : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
                    }`}
                    id="leave_type"
                    name="leave_type"
                    value={formData.type}
                    onChange={handleLeaveTypeChange}
                    disabled={isLoading}
                  >
                    <option>Select</option>
                    {getFilteredLeaveTypes()
                      .filter(type => type.is_active)
                      .map((type) => (
                        <option key={type.id} value={type.leave_type_name.toLowerCase()}>
                          {type.leave_type_name}
                        </option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Reason</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${
                      errors.reason 
                        ? 'border-red-500 focus:border-red-500' 
                        : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
                    }`}
                    placeholder="Brief reason for leave"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                  {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.type !== 'unpaid leave' && (
                  <div className="col-span-1 md:col-span-2 mb-1">
                    <div className="text-sm flex justify-center gap-8">
                      <div>
                        <span className={`${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Request Duration: </span>
                        <span className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{getRequestDuration()} days</span>
                      </div>
                      <div>
                        <span className={`${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Remaining Balance: </span>
                        {(() => {
                          let remainingDays = getRemainingDays();
                          return remainingDays > 0 ? (
                            <span className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{remainingDays} days</span>
                          ) : (
                            <span className="font-medium text-red-600">{remainingDays} days</span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Start Date </span> 
                  </label>
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.startDate ? 'border border-red-500' : ''}`}>                  
                    <input
                      type="date"
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                      value={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDateChange(e.target.value, true)}
                    />
                  </div>
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>End Date</span>
                  </label>
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.endDate ? 'border border-red-500' : ''}`}>                  
                    <input
                      type="date"
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                      value={formData.endDate ? calculateDateInUTC(formData.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDateChange(e.target.value, false)}
                      min={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : calculateDateInUTC(new Date()).toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

                {/* Balance Warning - Only show when needed */}
                {isDurationExceeded() && (
                  <div className={`p-3 sm:p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'}`}>
                    <div className="text-red-600 text-xs sm:text-sm">
                      Warning: Your request duration exceeds your remaining leave balance.
                    </div>
                  </div>
                )}

              {/* Add Half Day Checkbox - Only show when start and end dates are the same */}
              {formData.startDate && formData.endDate && 
               calculateDateInUTC(formData.startDate).toISOString().split('T')[0] === calculateDateInUTC(formData.endDate).toISOString().split('T')[0] && (
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
                      checked={formData.isHalfDay}
                      onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
                    />
                    <span className={`label-text ml-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Half Day Leave</span>
                  </label>
                </div>
              )}

              {/* Show existing documents if editing and any exist */}
              {isEditing && editingRequestDocuments && editingRequestDocuments.length > 0 && (
                <div className="mb-2">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Existing Documents</span>
                  </label>
                  <ul className="space-y-1">
                    {editingRequestDocuments.map((doc, idx) => (
                      <li key={doc.id || idx} className={`flex items-center gap-2 text-xs rounded p-2 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                        {doc.document_url && (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                            </svg>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                downloadAttachment(editingRequestId || 0, doc.file_name || 'attachment');
                              }}
                              className={`text-xs sm:text-sm hover:underline font-medium truncate flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}
                            >
                              Download {doc.file_name}
                            </a>
                        </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

              )}

              {/* Attachment Upload */}
              <div className="form-control">
                <label className="label">
                  {(formData.type && leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase())?.requires_documentation == true) && (
                    <span className="label-text-alt text-red-500">* Required</span>
                  )}
                </label>
                <div className="flex flex-col gap-2 w-full">
                  {/* EmployeeDocumentManager for leave documents */}
                  <div className={`${errors.attachment ? 'border-1 border-red-500 rounded-lg p-2' : ''}`}>
                    <EmployeeDocumentManager
                      key={documentManagerKey}
                      employeeId={user?.id || null}
                      mode={isEditing ? 'add' : 'add'}
                      documentTypes={[
                        {
                          type: 'Medical',
                          label: 'Attachment',
                          description: 'Upload medical certificate or supporting document'
                        }
                      ]}
                      moduleName="leave"
                      onFilesSelected={setSelectedLeaveDocuments}
                      initialDocuments={selectedLeaveDocuments}
                      onDocumentDeleted={handleDocumentDeleted}
                    />
                  </div>
                  {errors.attachment && <p className="text-red-500 text-sm mt-1">{errors.attachment}</p>}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-4 mt-6 pt-4">
                <button
                  type="button"
                  className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white`}
                  onClick={() => {
                    setShowRequestModal(false);
                    setErrors({
                      type: '',
                      reason: '',
                      startDate: '',
                      endDate: '',
                      attachment: ''
                    });
                    setFormData({
                      type: '',
                      startDate: undefined,
                      endDate: undefined,
                      reason: '',
                      attachment: null,
                      isHalfDay: false
                    });
                    setIsEditing(false);
                    setEditingRequestId(null);
                    setEditingRequestAttachment(null);
                    setSelectedLeaveDocuments([]);
                    resetLeaveAttachment();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                >
                  {isEditing ? 'Update Request' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowRequestModal(false)}>close</button>
        </form>
      </dialog>

      {/* View Leave Request Modal */}
      <dialog id="view_modal" className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box w-full max-w-sm sm:max-w-lg lg:max-w-4xl xl:max-w-5xl p-0 overflow-hidden shadow-lg mx-2 sm:mx-auto h-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          {/* Modal Header */}
          <div className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
            <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">Leave Request Details</span>
            </h3>
            <button
              className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
              onClick={() => setIsViewModalOpen(false)}
            >✕</button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto">
            {selectedRequest && (
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
                    <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Status</h4>
                    <p className="text-sm sm:text-base font-medium">
                      <span className={`badge ${getBadgeClass(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
                    <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.start_date)}</p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
                    <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.end_date)}</p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Duration</h4>
                    <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.duration} day{selectedRequest.duration !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Applied On</h4>
                    <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                      {convertUTCToSingapore(selectedRequest.created_at)}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason</h4>
                  <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'}`}>
                    {selectedRequest.reason}
                  </p>
                </div>

                {/* Attachment */}
                {selectedRequest.document_url && (
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Attachment</h4>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
                        }}
                        className={`text-xs sm:text-sm hover:underline font-medium truncate flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}
                      >
                        Download {selectedRequest.file_name}
                      </a>
                    </div>
                  </div>
                )}

                {/* Approval Information */}
                {selectedRequest.status === 'APPROVED' && selectedRequest.approval_comment && (
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Approval Comment</h4>
                    <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-green-50 text-slate-900 border border-green-200' : 'bg-green-900/20 text-slate-100 border border-green-800'}`}>
                      {selectedRequest.approval_comment}
                    </p>
                  </div>
                )}

                {/* Rejection Information */}
                {selectedRequest.status === 'REJECTED' && (
                  <div className="p-3 sm:p-4 space-y-3">
                    <div>
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejected By</h4>
                      <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {selectedRequest.second_approver_name || selectedRequest.first_approver_name}
                      </p>
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejection Date</h4>
                      <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {convertUTCToSingapore(selectedRequest.updated_at)}
                      </p>
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason for Rejection</h4>
                      <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-red-50 text-slate-900 border border-red-200' : 'bg-red-900/20 text-slate-100 border border-red-800'}`}>
                        {selectedRequest.rejection_reason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className={`px-4 sm:px-6 py-2 sm:py-3 border-t flex justify-end gap-2 mt-auto z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
            {selectedRequest && (selectedRequest.status === 'PENDING' || selectedRequest.status === 'FIRST_APPROVED') && (
              <button
                className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel Request
              </button>
            )}
            {selectedRequest && (selectedRequest.status === 'APPROVED') && !isStartDatePassed(selectedRequest.start_date) && (
              <button
                className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                onClick={() => handleWithdrawLeaveRequest(selectedRequest.id)}
              >
                Withdraw Request
              </button>
            )}
            <button
              className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsViewModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Cancel Confirmation Modal */}
      <dialog id="cancel_confirm_modal" className={`modal ${showCancelConfirm ? 'modal-open' : ''}`}>
        <div className={`modal-box ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Confirm Cancellation</h3>
          <p className={`py-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Are you sure you want to cancel this leave request? This action cannot be undone.</p>
          <div className="modal-action">
            <button
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
              onClick={() => setShowCancelConfirm(false)}
            >
              No, Keep Request
            </button>
            <button
              className={`btn ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
              onClick={() => selectedRequest && handleCancelLeave(selectedRequest.id)}
            >
              Yes, Cancel Request
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowCancelConfirm(false)}>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default LeaveOverview