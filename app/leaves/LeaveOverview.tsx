// // 'use client';

// // import { useState, useEffect, useCallback } from 'react';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../config';
// // import { Calendar } from 'react-date-range';
// // import 'react-date-range/dist/styles.css';
// // import 'react-date-range/dist/theme/default.css';
// // import InfoBoxes from './InfoBoxes';
// // import LeaveBalanceSummary from './LeaveBalanceSummary';
// // import RecentLeaveRequests from './RecentLeaveRequests';
// // import CalendarAndRecentRequests from './CalendarAndRecentRequests';
// // import { FaRegCalendarCheck } from "react-icons/fa";
// // import { FaRegHourglass } from "react-icons/fa";
// // import { LiaUserSlashSolid } from "react-icons/lia";
// // import { addDays, eachDayOfInterval, isSameDay } from 'date-fns';
// // import { formatInTimeZone,toZonedTime } from 'date-fns-tz';
// // import { fileURLToPath } from 'url';
// // import EmployeeDocumentManager, { EmployeeDocument } from '../components/EmployeeDocumentManager';
// // import { calculateDateInUTC, calculateDuration, getBadgeClass } from '../utils/utils';
// // import NotificationToast from '../components/NotificationToast';
// // import { useNotification } from '../hooks/useNotification';
// // import { useTheme } from '../components/ThemeProvider';
// // import ConvertToSingaporeTimeZone from '../components/ConvertToSingaporeTimeZone';
// // import {format } from 'date-fns'


// // interface RecentLeaveRequest {
// //   id: number;
// //   employee_id: number;
// //   employee_name: string;
// //   department_name: string;
// //   department_id: number;
// //   leave_type_id: number;
// //   leave_type_name: string;
// //   start_date: string;
// //   end_date: string;
// //   duration: number;
// //   reason: string;
// //   status: 'PENDING' | 'FIRST_APPROVED' | 'APPROVED' | 'REJECTED';
// //   approver_id?: number;
// //   approval_date?: string;
// //   approval_comment?: string;
// //   rejection_reason?: string;
// //   created_at: string;
// //   document_url?: string;
// //   file_name?: string;
// //   first_approver_name?: string;
// //   second_approver_name?: string;
// //   updated_at: string;
// // }

// // interface LeaveRequest {
// //   id: string;
// //   type: string;
// //   startDate: Date;
// //   endDate: Date;
// //   reason: string;
// //   status: 'pending' | 'approved' | 'rejected';
// // }

// // interface LeaveType {
// //   id: number;
// //   leave_type_name: string;
// //   description: string;
// //   max_days: number;
// //   is_paid: boolean;
// //   is_active: boolean;
// //   requires_documentation: boolean;
// // }

// // interface LeaveBalance {
// //   id: number;
// //   employee_id: string;
// //   leave_type_id: string;
// //   leave_type_name: string;
// //   year: number;
// //   total_days: number;
// //   used_days: number;
// //   remaining_days: number;
// //   accrual_days: number;
// //   accrual_remaining_days: number;
// //   is_total: boolean;
// //   total_type: string;
// //   is_divident: boolean;
// // }

// // interface User {
// //   id: number;
// //   name: string;
// //   email: string;
// //   role: string;
// //   company_id: number;
// //   department_id: number;
// //   gender?: string;
// // }

// // interface FormErrors {
// //   type: string;
// //   reason: string;
// //   startDate: string;
// //   endDate: string;
// //   attachment: string;
// // }

// // // Alternative helper function for UTC to Singapore timezone conversion
// // const convertUTCToSingapore = (utcDateString: string, formatStr: string = 'dd MMM yyyy hh:mm a'): string => {
// //   try {
// //     // Parse the UTC date string manually
// //     let utcDate: Date;
    
// //     if (utcDateString.includes('T')) {
// //       // Already in ISO format
// //       utcDate = new Date(utcDateString);
// //     } else {
// //       // Convert "YYYY-MM-DD HH:mm:ss" to ISO format
// //       const isoString = utcDateString.replace(' ', 'T') + '.000Z';
// //       utcDate = new Date(isoString);
// //     }
    
// //     // If date is invalid, try parsing differently
// //     if (isNaN(utcDate.getTime())) {
// //       utcDate = new Date(utcDateString);
// //     }
    
// //     // Manually add 8 hours for Singapore timezone (GMT+8)
// //     const singaporeTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
    
// //     // Format the result
// //     return format(singaporeTime, formatStr);
// //   } catch (error) {
// //     console.error('Error in convertUTCToSingapore:', error);
// //     return 'Invalid date';
// //   }
// // };

// // // Helper function to properly parse UTC datetime and convert to Singapore timezone
// // const formatUTCToSingapore = (utcDateString: string, formatStr: string = 'dd MMM yyyy hh:mm a'): string => {
// //   try {
// //     // Debug: Log the original string
// //     console.log('Original datetime string:', utcDateString);
    
// //     let utcDate: Date;
    
// //     // Handle different possible UTC datetime formats
// //     if (utcDateString.includes('T')) {
// //       // ISO format: "2024-01-15T10:30:00.000Z" or "2024-01-15T10:30:00"
// //       utcDate = new Date(utcDateString.endsWith('Z') ? utcDateString : utcDateString + 'Z');
// //     } else {
// //       // MySQL format: "2024-01-15 10:30:00"
// //       utcDate = new Date(utcDateString.replace(' ', 'T') + 'Z');
// //     }
    
// //     // Debug: Log the parsed UTC date
// //     console.log('Parsed UTC date:', utcDate);
    
// //     // Convert to Singapore timezone
// //     const singaporeFormatted = formatInTimeZone(utcDate, 'Asia/Singapore', formatStr);
    
// //     // Debug: Log the Singapore formatted result
// //     console.log('Singapore formatted:', singaporeFormatted);
    
// //     return singaporeFormatted;
// //   } catch (error) {
// //     console.error('Error formatting datetime:', error, 'Original string:', utcDateString);
// //     // Fallback to original behavior
// //     return format(new Date(utcDateString), formatStr);
// //   }
// // };

// // const LeaveOverview = () => {
// //   const { theme } = useTheme();
// //   const { notification, showNotification } = useNotification();
// //   const [requests, setRequests] = useState<LeaveRequest[]>([]);
// //   const [formData, setFormData] = useState<{
// //     type: string;
// //     startDate: Date | undefined;
// //     endDate: Date | undefined;
// //     reason: string;
// //     attachment: File | null;
// //     isHalfDay: boolean;
// //   }>({
// //     type: '',
// //     startDate: undefined,
// //     endDate: undefined,
// //     reason: '',
// //     attachment: null,
// //     isHalfDay: false
// //   });
// //   const [showRequestModal, setShowRequestModal] = useState(false);
// //   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
// //   const [leaveTypesByEmployeeId, setLeaveTypesByEmployeeId] = useState<LeaveType[]>([]);
// //   const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [recentLeaveRequests, setRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
// //   const [myRecentLeaveRequests, setMyRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
// //   const [allRecentLeaveRequests, setAllRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
// //   const [role, setRole] = useState<string>('');
// //   const [user, setUser] = useState<User | null>(null);
// //   const [token, setToken] = useState<string>('');
// //   const [errors, setErrors] = useState<FormErrors>({
// //     type: '',
// //     reason: '',
// //     startDate: '',
// //     endDate: '',
// //     attachment: ''
// //   });
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
// //   const [editingRequestAttachment, setEditingRequestAttachment] = useState<{ url: string, name: string } | null>(null);
// //   const [selectedLeaveDocuments, setSelectedLeaveDocuments] = useState<any[]>([]);
// //   const [editingRequestDocuments, setEditingRequestDocuments] = useState<any[]>([]);
// //   const [documentManagerKey, setDocumentManagerKey] = useState(0);
// //   const [showAllLeaveHistory, setShowAllLeaveHistory] = useState(false);
// //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
// //   const [selectedRequest, setSelectedRequest] = useState<RecentLeaveRequest | null>(null);
// //   const [showCancelConfirm, setShowCancelConfirm] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;

// //   useEffect(() => {
// //     // Get user role from localStorage
// //     const userRole = localStorage.getItem('hrms_role');
// //     if (userRole) {
// //       setRole(userRole);
// //     }

// //     const token = localStorage.getItem('hrms_token');
// //     if (token) {
// //       setToken(token);
// //     }

// //     // Get user data from localStorage
// //     const userData = localStorage.getItem('hrms_user');
// //     if (userData) {
// //       try {
// //         const parsedUser = JSON.parse(userData);
// //         setUser(parsedUser);
// //       } catch (err) {
// //         console.error('Error parsing user data:', err);
// //       }
// //     }
// //   }, []);

// //   // Filter leave types based on user gender
// //   const getFilteredLeaveTypes = () => {
// //     // Don't apply gender filtering for admin users
// //     if (user?.role?.toLowerCase() === 'admin') {
// //       return leaveTypesByEmployeeId;
// //     }

// //     // Get gender from localStorage
// //     const userFromStorage = localStorage.getItem('hrms_user');
// //     if (!userFromStorage) return leaveTypesByEmployeeId;
    
// //     try {
// //       const parsedUser = JSON.parse(userFromStorage);
// //       const gender = parsedUser?.gender;
      
// //       if (!gender) return leaveTypesByEmployeeId;

// //       return leaveTypesByEmployeeId.filter(type => {
// //         const leaveTypeName = type.leave_type_name.toLowerCase();
        
// //         // Hide paternity leave for non-male users
// //         if (leaveTypeName.includes('paternity') && gender !== 'Male') {
// //           return false;
// //         }
        
// //         // Hide maternity leave for non-female users
// //         if (leaveTypeName.includes('maternity') && gender !== 'Female') {
// //           return false;
// //         }
        
// //         // If gender is 'Other', hide both paternity and maternity
// //         if (gender === 'Other' && 
// //             (leaveTypeName.includes('paternity') || leaveTypeName.includes('maternity'))) {
// //           return false;
// //         }
        
// //         return true;
// //       });
// //     } catch (error) {
// //       console.error('Error parsing user from localStorage:', error);
// //       return leaveTypesByEmployeeId;
// //     }
// //   };

// //   const fetchLeaveData = useCallback(async () => {//async () => {
// //     try {
// //       setIsLoading(true);
// //       if (!user?.id) {
// //         console.error('No user ID available');
// //         return;
// //       }

// //       const [typesResponse, balancesResponse, recentLeavesResponse, myRecentLeavesResponse, leaveTypesByEmployeeResponse] = await Promise.all([
// //         axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           },
// //           params: {
// //             employeeId: user.id
// //           }
// //         }),
// //         axios.get(`${API_BASE_URL}/api/v1/leaves/balance`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           },
// //           params: {
// //             employeeId: user.id,
// //             year: new Date().getFullYear()
// //           }
// //         }),
// //         axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           }
// //         }),
// //         axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           },
// //           params: {
// //             employeeId: user.id
// //           }
// //         }),
// //         axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           },
// //           params: {
// //             employeeId: user.id
// //           }
// //         })
// //       ]);
// //       setLeaveTypes(typesResponse.data);
// //       setLeaveTypesByEmployeeId(leaveTypesByEmployeeResponse.data);
// //       console.log(balancesResponse.data);
// //       setLeaveBalances(balancesResponse.data);
// //       setRecentLeaveRequests(recentLeavesResponse.data.filter((request: RecentLeaveRequest) => request.employee_id.toString() !== user?.id.toString()));
// //       setMyRecentLeaveRequests(recentLeavesResponse.data.filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString()));
// //       setAllRecentLeaveRequests(recentLeavesResponse.data);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'An error occurred');
// //       console.error('Error fetching leave data:', err);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [user?.id]);//};

// //   // Fetch leave types and balances
// //   useEffect(() => {
// //     if (user?.id) {
// //       fetchLeaveData();
// //     }
// //   }, [user?.id, fetchLeaveData]);

// //   const openEditModal = async (request: RecentLeaveRequest) => {
// //     setFormData({
// //       type: request.leave_type_name.toLowerCase(),
// //       startDate: new Date(request.start_date),
// //       endDate: new Date(request.end_date),
// //       reason: request.reason,
// //       attachment: null,
// //       isHalfDay: request.duration === 0.5
// //     });
// //     setIsEditing(true);
// //     setEditingRequestId(request.id);
// //     setShowRequestModal(true);
// //     // If the request has an attachment, set it for download
// //     if (request.document_url && request.file_name) {
// //       setEditingRequestAttachment({ url: request.document_url, name: request.file_name });
// //     } else {
// //       setEditingRequestAttachment(null);
// //     }
// //     // Fetch all documents for this leave application
// //     try {
// //       const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       setEditingRequestDocuments(res.data);
// //     } catch (err) {
// //       setEditingRequestDocuments([]);
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (validateForm()) {
// //       const startDate = new Date(Date.UTC(
// //         formData.startDate?.getFullYear() || 0,
// //         formData.startDate?.getMonth() || 0,
// //         formData.startDate?.getDate() || 0)
// //       ).toISOString().split('T')[0];
// //       const endDate = new Date(Date.UTC(
// //         formData.endDate?.getFullYear() || 0,
// //         formData.endDate?.getMonth() || 0,
// //         formData.endDate?.getDate() || 0)
// //       ).toISOString().split('T')[0];
// //       try {
// //         const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
// //         if (!selectedType) {
// //           throw new Error('Invalid leave type');
// //         }
// //         let response;
// //         if (isEditing && editingRequestId) {
// //           // Update existing leave request
// //           const updateFormData = new FormData();
// //           updateFormData.append("leave_type_id", selectedType.id.toString());
// //           updateFormData.append("start_date", startDate);
// //           updateFormData.append("end_date", endDate);
// //           updateFormData.append("reason", formData.reason);
// //           if (formData.isHalfDay) {
// //             updateFormData.append("is_half_day", "1");
// //             updateFormData.append("duration", "0.5");
// //           } 
// //           // Add multiple attachments from EmployeeDocumentManager
// //           if (selectedLeaveDocuments.length > 0) {
// //             selectedLeaveDocuments.forEach((doc, idx) => {
// //               if (doc.file) {
// //                 updateFormData.append('attachments[]', doc.file);
// //               }
// //             });
// //           } else if (formData.attachment) {
// //             updateFormData.append("attachment", formData.attachment);
// //           }
// //           response = await axios.put(`${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, updateFormData, {
// //             headers: {
// //               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
// //               'Content-Type': 'multipart/form-data'
// //             }
// //           });
// //         } else {
// //           // Create new leave request
// //           const formDataToSend = new FormData();
// //           formDataToSend.append("employee_id", user?.id?.toString() || '');
// //           formDataToSend.append("leave_type_id", selectedType.id.toString());
// //           formDataToSend.append("start_date", startDate);
// //           formDataToSend.append("end_date", endDate);
// //           formDataToSend.append("reason", formData.reason);
// //           if (formData.isHalfDay) {
// //             formDataToSend.append("is_half_day", "1");
// //             formDataToSend.append("duration", "0.5");
// //           } 
// //           formDataToSend.append("status", 'PENDING');
// //           // Add multiple attachments from EmployeeDocumentManager
// //           if (selectedLeaveDocuments.length > 0) {
// //             selectedLeaveDocuments.forEach((doc, idx) => {
// //               if (doc.file) {
// //                 formDataToSend.append('attachments[]', doc.file);
// //               }
// //             });
// //           } else if (formData.attachment) {
// //             formDataToSend.append("attachment", formData.attachment);
// //           }
// //           response = await axios.post(`${API_BASE_URL}/api/v1/leaves`, formDataToSend, {
// //             headers: {
// //               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
// //               'Content-Type': 'multipart/form-data'
// //             }
// //           });
// //         }
// //         if (response.status === 201 || response.status === 200) {
// //           showNotification(isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 'success');
// //           setFormData({
// //             type: '',
// //             startDate: undefined,
// //             endDate: undefined,
// //             reason: '',
// //             attachment: null,
// //             isHalfDay: false
// //           });
// //           resetLeaveAttachment();
// //           setShowRequestModal(false);
// //           setIsEditing(false);
// //           setEditingRequestId(null);
// //           setEditingRequestAttachment(null);
// //           fetchLeaveData();
// //         }
// //       } catch (err) {
// //         console.error('Error submitting leave request:', err);
// //         if (axios.isAxiosError(err) && err.response?.data?.message) {
// //           showNotification(err.response.data.message, 'error');
// //         } else {
// //           showNotification('Failed to submit leave request. Please try again.', 'error');
// //         }
// //       }
// //     }
// //   };

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0] || null;
// //     setFormData({ ...formData, attachment: file });
// //   };

// //   // Add function to check for conflicting dates
// //   const hasDateConflict = (startDate: Date, endDate: Date): boolean => {
// //     // Get all approved and pending leave requests
// //     const existingRequests = myRecentLeaveRequests.filter(
// //       request => {
// //         // When editing, exclude the current request from conflict check
// //         if (isEditing && editingRequestId === request.id) {
// //           return false;
// //         }
// //         return request.status === 'APPROVED' || request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
// //       }
// //     );

// //     // Check each existing request for overlap
// //     return existingRequests.some(request => {
// //       const requestStart = calculateDateInUTC(new Date(request.start_date));
// //       const requestEnd = calculateDateInUTC(new Date(request.end_date));
// //       const checkStart = calculateDateInUTC(startDate);
// //       const checkEnd = calculateDateInUTC(endDate);
      
// //       // Check if the new date range overlaps with any existing request
// //       return (
// //         (checkStart <= requestEnd && checkEnd >= requestStart) || // New request overlaps with existing request
// //         (checkStart >= requestStart && checkStart <= requestEnd) || // New start date falls within existing request
// //         (checkEnd >= requestStart && checkEnd <= requestEnd) // New end date falls within existing request
// //       );
// //     });
// //   };

// //   // Update handleDateChange to check for conflicts
// //   const handleDateChange = (value: string, isStartDate: boolean) => {
// //     const date = new Date(value);
// //     const newFormData = { ...formData };
    
// //     if (isStartDate) {
// //       newFormData.startDate = date;
// //     } else {
// //       newFormData.endDate = date;
// //     }

// //     // Reset isHalfDay if dates don't match
// //     if (newFormData.startDate && newFormData.endDate && 
// //         calculateDateInUTC(newFormData.startDate).toISOString().split('T')[0] !== calculateDateInUTC(newFormData.endDate).toISOString().split('T')[0]) {
// //       newFormData.isHalfDay = false;
// //     }

// //     // Get emergency leave type and balance
// //     const emergencyLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'emergency leave');
// //     const emergencyBalance = emergencyLeave ? leaveBalances.find(b => b.leave_type_id === emergencyLeave.id.toString()) : null;
// //     const hasEmergencyLeaveRemaining = emergencyBalance && emergencyBalance.remaining_days > 0;

// //     // Get unpaid leave type
// //     const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');

// //     // Check if current type is emergency leave and has 0 remaining days
// //     if (formData.type.toLowerCase() === 'emergency leave' && emergencyBalance && emergencyBalance.remaining_days === 0) {
// //       if (unpaidLeave) {
// //         newFormData.type = 'unpaid leave';
// //         showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
// //         setFormData(newFormData);
// //         return;
// //       }
// //     }

// //     // Check if annual leave and within 5 days
// //     if (formData.type.toLowerCase() === 'annual leave' && isLessThan5Days(date)) {
// //       if (!hasEmergencyLeaveRemaining) {
// //         // If no emergency leave remaining, convert to unpaid leave
// //         if (unpaidLeave) {
// //           newFormData.type = 'unpaid leave';
// //           showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
// //         }
// //       } else {
// //         // Convert to emergency leave if there are remaining days
// //         newFormData.type = 'emergency leave';
// //         showNotification('Leave type changed to Emergency Leave as the date is less than 5 days from today', 'error');
// //       }
// //     }

// //     // Check for date conflicts
// //     if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
// //       showNotification('This date range conflicts with an existing leave request', 'error');
// //       return;
// //     }

// //     setFormData(newFormData);
// //   };

// //   // Update validateForm to include date conflict check
// //   const validateForm = () => {
// //     let isValid = true;
// //     const newErrors = { 
// //       type: '',
// //       reason: '',
// //       startDate: '',
// //       endDate: '',
// //       attachment: ''
// //     };

// //     if (!formData.type || formData.type === 'Select') {
// //       newErrors.type = 'Please select a leave type';
// //       isValid = false;
// //     }

// //     if (!formData.reason.trim()) {
// //       newErrors.reason = 'Please provide a reason for your leave request';
// //       isValid = false;
// //     }

// //     if (!formData.startDate) {
// //       newErrors.startDate = 'Please select a start date';
// //       isValid = false;
// //     }

// //     if (!formData.endDate) {
// //       newErrors.endDate = 'Please select an end date';
// //       isValid = false;
// //     }

// //     if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
// //       newErrors.endDate = 'End date cannot be before start date';
// //       isValid = false;
// //     }

// //     // Check for date conflicts
// //     if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
// //       newErrors.startDate = 'This date range conflicts with an existing leave request';
// //       isValid = false;
// //     }

// //     // Check if documentation is required based on leave type
// //     const selectedLeaveType = leaveTypesByEmployeeId.find(type => 
// //       type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
// //     );

// //     if (selectedLeaveType?.requires_documentation && 
// //         !formData.attachment && 
// //         (!selectedLeaveDocuments || selectedLeaveDocuments.length === 0)) {
// //       // Skip attachment validation if editing and documents already exist
// //       if (!(isEditing && editingRequestDocuments && editingRequestDocuments.length > 0)) {
// //         newErrors.attachment = 'Please provide an attachment for your leave request';
// //         isValid = false;
// //       }
// //     }

// //     // Check if request duration exceeds remaining balance
// //     if (formData.type !== 'unpaid leave') {
// //       const requestDuration = getRequestDuration();
// //       const remainingDays = getRemainingDays();
// //       if (requestDuration > remainingDays) {
// //         const message = `Request duration (${requestDuration} days) exceeds remaining balance (${remainingDays} days)`;
// //         showNotification(message, 'error');
// //         isValid = false;
// //       }
// //     }

// //     setErrors(newErrors);
// //     return isValid;
// //   };

// //   // Get remaining days for selected leave type
// //   const getRemainingDays = () => {
// //     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
// //     if (!selectedType) return 0;

// //     const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
// //     let remainingDays = 0;
// //     if (balance?.is_total) {
// //       remainingDays = balance?.remaining_days ?? 0;
// //     } else if (balance?.is_divident) {
// //       remainingDays = balance?.accrual_remaining_days ?? 0;
// //     } else {
// //       remainingDays = balance?.remaining_days ?? 0;
// //     }

// //     // If remaining days is 0, convert to unpaid leave
// //     if (remainingDays === 0 && selectedType.leave_type_name.toLowerCase() !== 'unpaid leave') {
// //       const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
// //       if (unpaidLeave) {
// //         setFormData({ ...formData, type: 'unpaid leave' });
// //         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
// //       }
// //     }

// //     return remainingDays;
// //   };

// //   // Get total days for selected leave type
// //   const getTotalDays = () => {
// //     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
// //     if (!selectedType) return 0;

// //     const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
// //     return balance?.total_days ?? 0;
// //   };

// //   // Get used days for selected leave type
// //   const getUsedDays = () => {
// //     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
// //     if (!selectedType) return 0;

// //     const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
// //     return balance?.used_days ?? 0;
// //   };

// //   // Get current request duration
// //   const getRequestDuration = () => {
// //     if (!formData.startDate || !formData.endDate) {
// //       return 0;
// //     }
// //     return calculateDuration(formData.startDate, formData.endDate);
// //   };

// //   // Check if request duration exceeds remaining days
// //   const isDurationExceeded = () => {
// //     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
// //     if (!selectedType || !selectedType.is_paid) return false;
// //     const remainingDays = getRemainingDays();
// //     const requestDuration = getRequestDuration();
// //     return requestDuration > remainingDays;
// //   };

// //   const getRejectedLeaves = () => {
// //     if (user?.role === 'employee') {
// //       const rejectedLeave = allRecentLeaveRequests
// //         .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
// //         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
// //         .length;

// //       return rejectedLeave;
// //     } else if (user?.role === 'supervisor' || user?.role === 'manager') {
// //       const rejectedLeave = allRecentLeaveRequests
// //         .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
// //         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
// //         .length;

// //       return rejectedLeave;
// //     } else if (user?.role === 'admin') {
// //       const rejectedLeave = allRecentLeaveRequests
// //         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
// //         .length;

// //       return rejectedLeave;
// //     } else {
// //       return 0;
// //     }
// //   };

// //   const getPendingLeaves = () => {
// //     if (user?.role === 'employee') {
// //       const rejectedLeave = allRecentLeaveRequests
// //         .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
// //         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
// //         .length;

// //       return rejectedLeave;
// //     } else if (user?.role === 'supervisor') {
// //       const rejectedLeave = allRecentLeaveRequests
// //         .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
// //         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING')
// //         .length;

// //       return rejectedLeave;
// //   } else if (user?.role === 'manager') {
// //     const rejectedLeave = allRecentLeaveRequests
// //       .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
// //       .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
// //       .length;

// //     return rejectedLeave;
// //   } else if (user?.role === 'admin') {
// //       const rejectedLeave = allRecentLeaveRequests
// //         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
// //         .length;

// //       return rejectedLeave;
// //     } else {
// //       return 0;
// //     }
// //   };  

// //   // Get current request duration
// //   const getOnLeaveToday = () => {
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);

// //     if (user?.role === 'employee') {
// //       const onLeaveToday = allRecentLeaveRequests
// //       .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
// //       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
// //       .filter((request: RecentLeaveRequest) => {
// //         const startDate = new Date(request.start_date);
// //         const endDate = new Date(request.end_date);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate.setHours(0, 0, 0, 0);
// //         return today >= startDate && today <= endDate;
// //       })
// //       .length;
// //       return onLeaveToday;

// //     } else if (user?.role === 'supervisor' || user?.role === 'manager') {
// //       const onLeaveToday = allRecentLeaveRequests
// //       .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
// //       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
// //       .filter((request: RecentLeaveRequest) => {
// //         const startDate = new Date(request.start_date);
// //         const endDate = new Date(request.end_date);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate.setHours(0, 0, 0, 0);
// //         return today >= startDate && today <= endDate;
// //       })
// //       .length;
// //       return onLeaveToday;

// //     } else if (user?.role === 'admin') {
// //       const onLeaveToday = allRecentLeaveRequests
// //       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
// //       .filter((request: RecentLeaveRequest) => {
// //         const startDate = new Date(request.start_date);
// //         const endDate = new Date(request.end_date);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate.setHours(0, 0, 0, 0);
// //         return today >= startDate && today <= endDate;
// //       })
// //       .length;
// //       return onLeaveToday;

// //     } else {
// //       return 0;
// //     }

// //     const onLeaveToday = recentLeaveRequests
// //       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
// //       .filter((request: RecentLeaveRequest) => {
// //         const startDate = new Date(request.start_date);
// //         const endDate = new Date(request.end_date);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate.setHours(0, 0, 0, 0);
// //         return today >= startDate && today <= endDate;
// //       })
// //       .length;

// //     return onLeaveToday;
// //   };

// //   const getApprovedLeaveDates = () => {
// //     if (!myRecentLeaveRequests) return [];

// //     return myRecentLeaveRequests
// //       .filter(request => request.status === 'APPROVED')
// //       .flatMap(request => {
// //         const start = new Date(request.start_date);
// //         const end = new Date(request.end_date);
// //         return eachDayOfInterval({ start, end });
// //       });
// //   };

// //   const getPendingLeaveDates = () => {
// //     if (!myRecentLeaveRequests) return [];

// //     return myRecentLeaveRequests
// //       .filter(request => request.status === 'PENDING')
// //       .flatMap(request => {
// //         const start = new Date(request.start_date);
// //         const end = new Date(request.end_date);
// //         return eachDayOfInterval({ start, end });
// //       });
// //   };

// //   const renderDayContents = (day: Date) => {
// //     const approvedDates = getApprovedLeaveDates();
// //     const pendingDates = getPendingLeaveDates();
// //     const isOnLeave = approvedDates.some(date => isSameDay(date, day));
// //     const isPending = pendingDates.some(date => isSameDay(date, day));
// //     const isToday = isSameDay(day, new Date());

// //     return (
// //       <div className={`h-full w-full flex items-center justify-center ${isOnLeave ? 'bg-green-500 text-white rounded-full' :
// //           isPending ? 'bg-yellow-500 text-white rounded-full' :
// //             isToday ? 'bg-blue-500 text-white rounded-full' : ''
// //         }`}>
// //         {day.getDate()}
// //       </div>
// //     );
// //   };

// //   const resetLeaveAttachment = () => {
// //     setSelectedLeaveDocuments([]);
// //     setFormData(prev => ({
// //       ...prev,
// //       attachment: null
// //     }));
// //     setEditingRequestAttachment(null);
// //     setDocumentManagerKey(prev => prev + 1);
// //   }

// //   const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
// //     if (removedFile) {
// //       setSelectedLeaveDocuments(prev => 
// //         prev.filter(file => 
// //           !(file.name === removedFile.name && 
// //             file.documentType === removedFile.documentType && 
// //             file.file === removedFile.file)
// //         )
// //       );
// //     }
// //   };

// //   function getAttachmentIdFromUrl(url: string) {
// //     const parts = url.split('/');
// //     return parts.length >= 2 ? parts[parts.length - 2] : null;
// //   }

// //   // Add function to check if dates are less than 14 days from today
// //   const isLessThan14Days = (date: Date) => {
// //     const today = new Date();
// //     const diffTime = date.getTime() - today.getTime();
// //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //     return diffDays < 14;
// //   };

// //   // Add function to check if dates are less than 5 days from today
// //   const isLessThan5Days = (date: Date) => {
// //     const today = new Date();
// //     const diffTime = date.getTime() - today.getTime();
// //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //     return diffDays < 5;
// //   };

// //   // Add function to handle leave type change
// //   const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newType = e.target.value;
    
// //     // Skip check if "Select" is chosen
// //     if (newType === 'Select') {
// //       setFormData({ ...formData, type: newType });
// //       return;
// //     }

// //     // Find the selected leave type
// //     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === newType.toLowerCase());
// //     if (!selectedType) return;

// //     // Check remaining days
// //     const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
// //     const remainingDays = balance?.remaining_days ?? 0;

// //     // If remaining days is 0, convert to unpaid leave
// //     if (remainingDays === 0 && newType.toLowerCase() !== 'unpaid leave') {
// //       const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
// //       if (unpaidLeave) {
// //         setFormData({ ...formData, type: 'unpaid leave' });
// //         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
// //         return;
// //       }
// //     }

// //     // If no conversion needed, set the selected type
// //     setFormData({ ...formData, type: newType });
// //   };

// //   const handleCancelLeave = async (requestId: number) => {
// //     try {
// //       await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/cancel`, {
// //         employee_id: user?.id
// //       }, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       showNotification('Leave request cancelled successfully', 'success');
// //       setShowCancelConfirm(false);
// //       setIsViewModalOpen(false);
// //       fetchLeaveData();
// //     } catch (err) {
// //       console.error('Error cancelling leave request:', err);
// //       showNotification('Failed to cancel leave request', 'error');
// //     }
// //   };

// //   const handleViewRequest = async (request: RecentLeaveRequest) => {
// //     try {
// //       // Fetch leave documents
// //       const documentsResponse = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       const documents = documentsResponse.data;
      
// //       // If there are documents, update the request with the first document's info
// //       if (documents && documents.length > 0) {
// //         const firstDocument = documents[0];
// //         request.document_url = firstDocument.document_url;
// //         request.file_name = firstDocument.file_name;
// //       }
      
// //       setSelectedRequest(request);
// //       setIsViewModalOpen(true);
// //     } catch (err) {
// //       console.error('Error fetching leave documents:', err);
// //       // Still show the request even if document fetch fails
// //       setSelectedRequest(request);
// //       setIsViewModalOpen(true);
// //     }
// //   };

// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString('en-GB', {
// //       day: 'numeric',
// //       month: 'numeric',
// //       year: 'numeric'
// //     });
// //   };

// //   const downloadAttachment = async (requestId: number, fileName: string) => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/download-attachment/${requestId}`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         },
// //         responseType: 'blob'
// //       });

// //       // Create a blob from the response data
// //       const blob = new Blob([response.data]);
// //       const url = window.URL.createObjectURL(blob);
      
// //       // Create a temporary link element and trigger the download
// //       const link = document.createElement('a');
// //       link.href = url;
// //       link.download = requestId + '-' + fileName;
// //       document.body.appendChild(link);
// //       link.click();
      
// //       // Clean up
// //       link.parentNode?.removeChild(link);
// //       window.URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error('Error downloading attachment:', err);
// //       showNotification('Failed to download attachment. Please try again.', 'error');
// //     }
// //   };

// //   const totalPages = Math.ceil(myRecentLeaveRequests.length / itemsPerPage);
// //   const paginatedRequests = myRecentLeaveRequests.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   const handlePageChange = (page: number) => {
// //     setCurrentPage(page);
// //   };

// //   const calculateRemainingDaysStat = () => {
// //     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
// //     return calculateLeaveStat(leave);
// //   }

// //   const setRemainingDaysStat = () => {
// //     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
// //     return setLeaveStat(leave);
// //   }

// //   const calculateMedicalLeaveStat = () => {
// //     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
// //     return calculateLeaveStat(leave);
// //   }

// //   const setMedicalLeaveStat = () => {
// //     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
// //     return setLeaveStat(leave);
// //   }

// //   const calculateEmergencyLeaveStat = () => {
// //     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
// //     return calculateLeaveStat(leave);
// //   }

// //   const setEmergencyLeaveStat = () => {
// //     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
// //     return setLeaveStat(leave);
// //   }   

// //   const calculateLeaveStat = (leave: LeaveBalance | undefined) => {
// //     return leave?.remaining_days;
// //   }

// //   const setLeaveStat = (leave: LeaveBalance | undefined) => {
// //     return `${leave?.used_days} used / ${leave?.total_days} total`;
// //   }
  
// //   // Smart pagination functions
// //   const getPageNumbers = () => {
// //     const pageNumbers = [];
// //     const maxPageButtons = 3;

// //     if (totalPages <= maxPageButtons) {
// //       for (let i = 1; i <= totalPages; i++) {
// //         pageNumbers.push(i);
// //       }
// //     } else {
// //       let startPage = Math.max(1, currentPage - 1);
// //       let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

// //       if (endPage === totalPages) {
// //         startPage = Math.max(1, endPage - maxPageButtons + 1);
// //       }

// //       for (let i = startPage; i <= endPage; i++) {
// //         pageNumbers.push(i);
// //       }
// //     }

// //     return pageNumbers;
// //   };

// //   const goToPage = (pageNumber: number) => {
// //     if (pageNumber >= 1 && pageNumber <= totalPages) {
// //       setCurrentPage(pageNumber);
// //     }
// //   };

// //   const handleWithdrawLeaveRequest = async (requestId: number) => {
// //     try {
// //       await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/withdraw`, {
// //         employee_id: user?.id
// //       }, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       showNotification('Leave request withdrawn successfully', 'success');
// //       setShowCancelConfirm(false);
// //       setIsViewModalOpen(false);
// //       fetchLeaveData();
// //     } catch (err) {
// //       console.error('Error withdrawing leave request:', err);
// //       showNotification('Failed to withdraw leave request. Please try again.', 'error');
// //     }
// //   };

// //   // Check if the start date has passed
// //   const isStartDatePassed = (startDate: string) => {
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0); // Set to start of day
// //     const start = new Date(startDate);
// //     start.setHours(0, 0, 0, 0); // Set to start of day
// //     return start < today;
// //   };

// //   return (
// //     <div className={`container mx-auto p-3 sm:p-4 lg:p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
// //       {/* Notification Toast */}
// //       <NotificationToast
// //         show={notification.show}
// //         message={notification.message}
// //         type={notification.type}
// //       />
      
// //       {/* Header with stats cards */}
// //       <div className="flex flex-col">
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
// //           <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// //             Manage your leave requests and view your leave balance
// //           </p>
// //           {role !== 'admin' && (
// //             <button
// //               className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //               onClick={() => setShowRequestModal(true)}
// //             >
// //               Request Leave
// //             </button>
// //           )}
// //         </div>

// //         {/* Leave balance summary */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
// //           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
// //             <div className="stat-figure text-white">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //               </svg>
// //             </div>
// //             <div className="stat-title text-white text-sm sm:text-base">Annual Leave</div>
// //             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateRemainingDaysStat()}</div>
// //             <div className="stat-desc text-white text-xs sm:text-sm">{setRemainingDaysStat()}</div>
// //           </div>

// //           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
// //             <div className="stat-figure text-white">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
// //               </svg>
// //             </div>
// //             <div className="stat-title text-white text-sm sm:text-base">Medical Leave</div>
// //             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateMedicalLeaveStat()}</div>
// //             <div className="stat-desc text-white text-xs sm:text-sm">{setMedicalLeaveStat()}</div>
// //           </div>

// //           <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
// //             <div className="stat-figure text-white">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
// //               </svg>
// //             </div>
// //             <div className="stat-title text-white text-sm sm:text-base">Emergency Leave</div>
// //             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateEmergencyLeaveStat()}</div>
// //             <div className="stat-desc text-white text-xs sm:text-sm">{setEmergencyLeaveStat()}</div>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
// //           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
// //             <div className="stat-figure text-white">
// //               <FaRegCalendarCheck className="h-8 w-8 sm:h-10 sm:w-10" />
// //             </div>
// //             <div className="stat-title text-white text-sm sm:text-base">Rejected Leaves</div>
// //             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getRejectedLeaves()}</div>
// //             <div className="stat-desc text-white text-xs sm:text-sm">{getRejectedLeaves()} request{getRejectedLeaves() !== 1 ? 's' : ''} rejected</div>
// //           </div>

// //           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
// //             <div className="stat-figure text-white">
// //               <FaRegHourglass className="h-8 w-8 sm:h-10 sm:w-10" />
// //             </div>
// //             <div className="stat-title text-white text-sm sm:text-base">Pending Requests</div>
// //             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getPendingLeaves()}</div>
// //             <div className="stat-desc text-white text-xs sm:text-sm">{getPendingLeaves()} request{getPendingLeaves() !== 1 ? 's' : ''} pending</div>
// //           </div>

// //           <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
// //             <div className="stat-figure text-white">
// //               <LiaUserSlashSolid className="h-8 w-8 sm:h-10 sm:w-10" />
// //             </div>
// //             <div className="stat-title text-white text-sm sm:text-base">On Leave Today</div>
// //             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getOnLeaveToday()}</div>
// //             <div className="stat-desc text-white text-xs sm:text-sm">{getOnLeaveToday()} employee{getOnLeaveToday() !== 1 ? 's' : ''}</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="grid grid-cols-1 gap-6 sm:gap-8">
// //         {/* Calendar and Recent Requests */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
// //           {/* Calendar */}
// //           <div className={`card shadow-lg lg:col-span-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //             <div className="card-body p-3 sm:p-4 lg:p-6">
// //               <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                 </svg>
// //                 Leave Calendar
// //               </h2>
// //               <div className={`p-2 sm:p-4 rounded-lg flex justify-center ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-800'}`}>
// //                 <Calendar
// //                   date={new Date()}
// //                   onChange={() => { }}
// //                   className="custom-calendar"
// //                   dayContentRenderer={renderDayContents}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Recent Requests */}
// //           <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //             <div className="card-body p-3 sm:p-4 lg:p-6">
// //               <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// //                 </svg>
// //                 <span className="hidden sm:inline">My Recent Requests</span>
// //                 <span className="sm:hidden">Recent Requests</span>
// //               </h2>
// //               <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
// //                 <table className="table w-full text-sm">
// //                   <thead>
// //                     <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //                       <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Type</th>
// //                       <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Status</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {myRecentLeaveRequests.slice(0, 4).map((request, index) => (
// //                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== myRecentLeaveRequests.slice(0, 4).length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
// //                         <td>
// //                           <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
// //                           <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                             {new Date(request.start_date).toLocaleDateString('en-GB', {
// //                               day: 'numeric',
// //                               month: 'numeric',
// //                               year: 'numeric'
// //                             })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
// //                               day: 'numeric',
// //                               month: 'numeric',
// //                               year: 'numeric'
// //                             })}
// //                           </div>
// //                         </td>
// //                         <td>
// //                           <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
// //                             {request.status}
// //                           </span>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <LeaveBalanceSummary leaveBalances={leaveBalances} />


// //         {/* Leave History */}
// //         <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //           <div className="card-body p-3 sm:p-4 lg:p-6">
// //             <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //               My Leave History
// //             </h2>

// //             <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
// //               <table className="table w-full min-w-full">
// //                 <thead>
// //                   <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Type</th>
// //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[140px]`}>Dates</th>
// //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[80px]`}>Duration</th>
// //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Reason</th>
// //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Status</th>
// //                     <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {paginatedRequests.map(request => {
// //                     // Calculate duration in days
// //                     const duration = Math.ceil(
// //                       (new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)
// //                     ) + 1;
// //                     const canEdit = request.status === 'PENDING';
// //                     const canCancel = request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
// //                     return (
// //                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}`}>
// //                         <td>
// //                           <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
// //                         </td>
// //                         <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>
// //                           <div className="break-words">
// //                             {new Date(request.start_date).toLocaleDateString('en-GB', {
// //                               day: 'numeric',
// //                               month: 'numeric',
// //                               year: 'numeric'
// //                             })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
// //                               day: 'numeric',
// //                               month: 'numeric',
// //                               year: 'numeric'
// //                             })}
// //                           </div>
// //                         </td>
// //                         <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>{request.duration} day{request.duration !== 1 ? 's' : ''}</td>
// //                         <td>
// //                           <div className={`whitespace-normal break-words max-w-xs text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.reason}</div>
// //                         </td>
// //                         <td>
// //                           <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
// //                             {request.status}
// //                           </span>
// //                         </td>
// //                         <td className="text-right">
// //                           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
// //                             {canEdit && (
// //                               <button
// //                                 className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-slate-600 hover:bg-slate-700' : 'bg-slate-400 hover:bg-slate-500'} text-white border-0`}
// //                                 onClick={() => openEditModal(request)}
// //                                 type="button"
// //                               >
// //                                 Edit
// //                               </button>
// //                             )}
// //                             <button
// //                               className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //                               onClick={() => handleViewRequest(request)}
// //                               type="button"
// //                             >
// //                               View
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //             {/* Pagination */}
// //             {totalPages > 1 && (
// //               <div className="flex justify-center mt-4 sm:mt-6">
// //                 <div className="btn-group flex-wrap gap-1">
// //                   <button 
// //                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
// //                     onClick={() => goToPage(1)}
// //                     disabled={currentPage === 1}
// //                   >
// //                     First
// //                   </button>
// //                   <button 
// //                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
// //                     onClick={() => goToPage(currentPage - 1)}
// //                     disabled={currentPage === 1}
// //                   >
// //                     «
// //                   </button>
// //                   {getPageNumbers().map(page => (
// //                     <button 
// //                       key={page}
// //                       className={`btn btn-xs sm:btn-sm ${currentPage === page ? 
// //                         `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
// //                         `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
// //                       }`}
// //                       onClick={() => goToPage(page)}
// //                     >
// //                       {page}
// //                     </button>
// //                   ))}
// //                   <button 
// //                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
// //                     onClick={() => goToPage(currentPage + 1)}
// //                     disabled={currentPage === totalPages}
// //                   >
// //                     »
// //                   </button>
// //                   <button 
// //                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
// //                     onClick={() => goToPage(totalPages)}
// //                     disabled={currentPage === totalPages}
// //                   >
// //                     Last
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Leave Request Modal */}
// //       <dialog
// //         id="leave_request_modal"
// //         className={`modal ${showRequestModal ? 'modal-open' : ''}`}
// //       >
// //         <div className={`modal-box max-w-3xl p-0 overflow-hidden max-h-[90vh] ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //           {/* Modal Header */}
// //           <div className={`px-6 py-4 border-b ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
// //             <h3 className={`font-bold text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //               </svg>
// //               {isEditing ? 'Edit Leave Request' : 'New Leave Request'}
// //             </h3>
// //             <form method="dialog">
// //               <button
// //                 className={`btn btn-sm btn-circle btn-ghost absolute right-4 top-4 ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
// //                 onClick={() => {
// //                   setShowRequestModal(false);
// //                   setIsEditing(false);
// //                   setEditingRequestId(null);
// //                   setEditingRequestAttachment(null);
// //                   setErrors({
// //                     type: '',
// //                     reason: '',
// //                     startDate: '',
// //                     endDate: '',
// //                     attachment: ''
// //                   });
// //                 }}
// //               >✕</button>
// //             </form>
// //           </div>

// //           {/* Modal Content */}
// //           <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type</span>
// //                   </label>
// //                   <select
// //                     className={`select select-bordered w-full ${
// //                       errors.type 
// //                         ? 'border-red-500 focus:border-red-500' 
// //                         : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
// //                     }`}
// //                     id="leave_type"
// //                     name="leave_type"
// //                     value={formData.type}
// //                     onChange={handleLeaveTypeChange}
// //                     disabled={isLoading}
// //                   >
// //                     <option>Select</option>
// //                     {getFilteredLeaveTypes()
// //                       .filter(type => type.is_active)
// //                       .map((type) => (
// //                         <option key={type.id} value={type.leave_type_name.toLowerCase()}>
// //                           {type.leave_type_name}
// //                         </option>
// //                     ))}
// //                   </select>
// //                   {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
// //                 </div>

// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Reason</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     className={`input input-bordered w-full ${
// //                       errors.reason 
// //                         ? 'border-red-500 focus:border-red-500' 
// //                         : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
// //                     }`}
// //                     placeholder="Brief reason for leave"
// //                     value={formData.reason}
// //                     onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
// //                   />
// //                   {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 {formData.type !== 'unpaid leave' && (
// //                   <div className="col-span-1 md:col-span-2 mb-1">
// //                     <div className="text-sm flex justify-center gap-8">
// //                       <div>
// //                         <span className={`${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Request Duration: </span>
// //                         <span className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{getRequestDuration()} days</span>
// //                       </div>
// //                       <div>
// //                         <span className={`${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Remaining Balance: </span>
// //                         {(() => {
// //                           let remainingDays = getRemainingDays();
// //                           return remainingDays > 0 ? (
// //                             <span className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>{remainingDays} days</span>
// //                           ) : (
// //                             <span className="font-medium text-red-600">{remainingDays} days</span>
// //                           );
// //                         })()}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}
// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Start Date </span> 
// //                   </label>
// //                   <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.startDate ? 'border border-red-500' : ''}`}>                  
// //                     <input
// //                       type="date"
// //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
// //                       value={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : ''}
// //                       onChange={(e) => handleDateChange(e.target.value, true)}
// //                     />
// //                   </div>
// //                   {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
// //                 </div>
                
// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>End Date</span>
// //                   </label>
// //                   <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.endDate ? 'border border-red-500' : ''}`}>                  
// //                     <input
// //                       type="date"
// //                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
// //                       value={formData.endDate ? calculateDateInUTC(formData.endDate).toISOString().split('T')[0] : ''}
// //                       onChange={(e) => handleDateChange(e.target.value, false)}
// //                       min={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : calculateDateInUTC(new Date()).toISOString().split('T')[0]}
// //                     />
// //                   </div>
// //                   {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
// //                 </div>
// //               </div>

// //                 {/* Balance Warning - Only show when needed */}
// //                 {isDurationExceeded() && (
// //                   <div className={`p-3 sm:p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'}`}>
// //                     <div className="text-red-600 text-xs sm:text-sm">
// //                       Warning: Your request duration exceeds your remaining leave balance.
// //                     </div>
// //                   </div>
// //                 )}

// //               {/* Add Half Day Checkbox - Only show when start and end dates are the same */}
// //               {formData.startDate && formData.endDate && 
// //                calculateDateInUTC(formData.startDate).toISOString().split('T')[0] === calculateDateInUTC(formData.endDate).toISOString().split('T')[0] && (
// //                 <div className="form-control">
// //                   <label className="label cursor-pointer">
// //                     <input
// //                       type="checkbox"
// //                       className={`checkbox ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
// //                       checked={formData.isHalfDay}
// //                       onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
// //                     />
// //                     <span className={`label-text ml-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Half Day Leave</span>
// //                   </label>
// //                 </div>
// //               )}

// //               {/* Show existing documents if editing and any exist */}
// //               {isEditing && editingRequestDocuments && editingRequestDocuments.length > 0 && (
// //                 <div className="mb-2">
// //                   <label className="label">
// //                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Existing Documents</span>
// //                   </label>
// //                   <ul className="space-y-1">
// //                     {editingRequestDocuments.map((doc, idx) => (
// //                       <li key={doc.id || idx} className={`flex items-center gap-2 text-xs rounded p-2 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// //                         {doc.document_url && (
// //                         <>
// //                         <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
// //                           <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
// //                             </svg>
// //                             <a
// //                               href="#"
// //                               onClick={(e) => {
// //                                 e.preventDefault();
// //                                 downloadAttachment(editingRequestId || 0, doc.file_name || 'attachment');
// //                               }}
// //                               className={`text-xs sm:text-sm hover:underline font-medium truncate flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}
// //                             >
// //                               Download {doc.file_name}
// //                             </a>
// //                         </>
// //                         )}
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>

// //               )}

// //               {/* Attachment Upload */}
// //               <div className="form-control">
// //                 <label className="label">
// //                   {(formData.type && leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase())?.requires_documentation == true) && (
// //                     <span className="label-text-alt text-red-500">* Required</span>
// //                   )}
// //                 </label>
// //                 <div className="flex flex-col gap-2 w-full">
// //                   {/* EmployeeDocumentManager for leave documents */}
// //                   <div className={`${errors.attachment ? 'border-1 border-red-500 rounded-lg p-2' : ''}`}>
// //                     <EmployeeDocumentManager
// //                       key={documentManagerKey}
// //                       employeeId={user?.id || null}
// //                       mode={isEditing ? 'add' : 'add'}
// //                       documentTypes={[
// //                         {
// //                           type: 'Medical',
// //                           label: 'Attachment',
// //                           description: 'Upload medical certificate or supporting document'
// //                         }
// //                       ]}
// //                       moduleName="leave"
// //                       onFilesSelected={setSelectedLeaveDocuments}
// //                       initialDocuments={selectedLeaveDocuments}
// //                       onDocumentDeleted={handleDocumentDeleted}
// //                     />
// //                   </div>
// //                   {errors.attachment && <p className="text-red-500 text-sm mt-1">{errors.attachment}</p>}
// //                 </div>
// //               </div>

// //               {/* Modal Footer */}
// //               <div className="flex justify-end gap-4 mt-6 pt-4">
// //                 <button
// //                   type="button"
// //                   className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white`}
// //                   onClick={() => {
// //                     setShowRequestModal(false);
// //                     setErrors({
// //                       type: '',
// //                       reason: '',
// //                       startDate: '',
// //                       endDate: '',
// //                       attachment: ''
// //                     });
// //                     setFormData({
// //                       type: '',
// //                       startDate: undefined,
// //                       endDate: undefined,
// //                       reason: '',
// //                       attachment: null,
// //                       isHalfDay: false
// //                     });
// //                     setIsEditing(false);
// //                     setEditingRequestId(null);
// //                     setEditingRequestAttachment(null);
// //                     setSelectedLeaveDocuments([]);
// //                     resetLeaveAttachment();
// //                   }}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //                 >
// //                   {isEditing ? 'Update Request' : 'Submit Request'}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //         <form method="dialog" className="modal-backdrop">
// //           <button onClick={() => setShowRequestModal(false)}>close</button>
// //         </form>
// //       </dialog>

// //       {/* View Leave Request Modal */}
// //       <dialog id="view_modal" className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
// //         <div className={`modal-box w-full max-w-sm sm:max-w-lg lg:max-w-4xl xl:max-w-5xl p-0 overflow-hidden shadow-lg mx-2 sm:mx-auto h-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //           {/* Modal Header */}
// //           <div className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
// //             <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
// //               </svg>
// //               <span className="truncate">Leave Request Details</span>
// //             </h3>
// //             <button
// //               className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
// //               onClick={() => setIsViewModalOpen(false)}
// //             >✕</button>
// //           </div>

// //           {/* Modal Content - Scrollable */}
// //           <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto">
// //             {selectedRequest && (
// //               <div className="space-y-4 sm:space-y-6">
// //                 {/* Basic Information */}
// //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
// //                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
// //                   </div>
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Status</h4>
// //                     <p className="text-sm sm:text-base font-medium">
// //                       <span className={`badge ${getBadgeClass(selectedRequest.status)}`}>
// //                         {selectedRequest.status}
// //                       </span>
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
// //                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.start_date)}</p>
// //                   </div>
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
// //                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.end_date)}</p>
// //                   </div>
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Duration</h4>
// //                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.duration} day{selectedRequest.duration !== 1 ? 's' : ''}</p>
// //                   </div>
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Applied On</h4>
// //                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// //                       {convertUTCToSingapore(selectedRequest.created_at)}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {/* Reason */}
// //                 <div>
// //                   <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason</h4>
// //                   <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'}`}>
// //                     {selectedRequest.reason}
// //                   </p>
// //                 </div>

// //                 {/* Attachment */}
// //                 {selectedRequest.document_url && (
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Attachment</h4>
// //                     <div className="flex items-center gap-2">
// //                       <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
// //                         <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
// //                       </svg>
// //                       <a
// //                         href="#"
// //                         onClick={(e) => {
// //                           e.preventDefault();
// //                           downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
// //                         }}
// //                         className={`text-xs sm:text-sm hover:underline font-medium truncate flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}
// //                       >
// //                         Download {selectedRequest.file_name}
// //                       </a>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Approval Information */}
// //                 {selectedRequest.status === 'APPROVED' && selectedRequest.approval_comment && (
// //                   <div>
// //                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Approval Comment</h4>
// //                     <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-green-50 text-slate-900 border border-green-200' : 'bg-green-900/20 text-slate-100 border border-green-800'}`}>
// //                       {selectedRequest.approval_comment}
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* Rejection Information */}
// //                 {selectedRequest.status === 'REJECTED' && (
// //                   <div className="p-3 sm:p-4 space-y-3">
// //                     <div>
// //                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejected By</h4>
// //                       <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// //                         {selectedRequest.second_approver_name || selectedRequest.first_approver_name}
// //                       </p>
// //                     </div>
// //                     <div>
// //                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejection Date</h4>
// //                       <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
// //                         {convertUTCToSingapore(selectedRequest.updated_at)}
// //                       </p>
// //                     </div>
// //                     <div>
// //                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason for Rejection</h4>
// //                       <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-red-50 text-slate-900 border border-red-200' : 'bg-red-900/20 text-slate-100 border border-red-800'}`}>
// //                         {selectedRequest.rejection_reason}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>

// //           {/* Modal Footer */}
// //           <div className={`px-4 sm:px-6 py-2 sm:py-3 border-t flex justify-end gap-2 mt-auto z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
// //             {selectedRequest && (selectedRequest.status === 'PENDING' || selectedRequest.status === 'FIRST_APPROVED') && (
// //               <button
// //                 className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
// //                 onClick={() => setShowCancelConfirm(true)}
// //               >
// //                 Cancel Request
// //               </button>
// //             )}
// //             {selectedRequest && (selectedRequest.status === 'APPROVED') && !isStartDatePassed(selectedRequest.start_date) && (
// //               <button
// //                 className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
// //                 onClick={() => handleWithdrawLeaveRequest(selectedRequest.id)}
// //               >
// //                 Withdraw Request
// //               </button>
// //             )}
// //             <button
// //               className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
// //               onClick={() => setIsViewModalOpen(false)}
// //             >
// //               Close
// //             </button>
// //           </div>
// //         </div>
// //         <form method="dialog" className="modal-backdrop">
// //           <button onClick={() => setIsViewModalOpen(false)}>close</button>
// //         </form>
// //       </dialog>

// //       {/* Cancel Confirmation Modal */}
// //       <dialog id="cancel_confirm_modal" className={`modal ${showCancelConfirm ? 'modal-open' : ''}`}>
// //         <div className={`modal-box ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //           <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Confirm Cancellation</h3>
// //           <p className={`py-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Are you sure you want to cancel this leave request? This action cannot be undone.</p>
// //           <div className="modal-action">
// //             <button
// //               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
// //               onClick={() => setShowCancelConfirm(false)}
// //             >
// //               No, Keep Request
// //             </button>
// //             <button
// //               className={`btn ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
// //               onClick={() => selectedRequest && handleCancelLeave(selectedRequest.id)}
// //             >
// //               Yes, Cancel Request
// //             </button>
// //           </div>
// //         </div>
// //         <form method="dialog" className="modal-backdrop">
// //           <button onClick={() => setShowCancelConfirm(false)}>close</button>
// //         </form>
// //       </dialog>
// //     </div>
// //   )
// // }

// // export default LeaveOverview


// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { Calendar } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import InfoBoxes from './InfoBoxes';
// import LeaveBalanceSummary from './LeaveBalanceSummary';
// import RecentLeaveRequests from './RecentLeaveRequests';
// import CalendarAndRecentRequests from './CalendarAndRecentRequests';
// import { FaRegCalendarCheck } from "react-icons/fa";
// import { FaRegHourglass } from "react-icons/fa";
// import { LiaUserSlashSolid } from "react-icons/lia";
// import { addDays, eachDayOfInterval, isSameDay } from 'date-fns';
// import { formatInTimeZone,toZonedTime } from 'date-fns-tz';
// import { fileURLToPath } from 'url';
// import EmployeeDocumentManager, { EmployeeDocument } from '../components/EmployeeDocumentManager';
// import { calculateDateInUTC, calculateDuration, getBadgeClass } from '../utils/utils';
// import NotificationToast from '../components/NotificationToast';
// import { useNotification } from '../hooks/useNotification';
// import { useTheme } from '../components/ThemeProvider';
// import ConvertToSingaporeTimeZone from '../components/ConvertToSingaporeTimeZone';
// import {format } from 'date-fns'
// import { useLeavePreview } from '../hooks/useLeavePreview';
// import { employeeApi } from '../utils/test';

// interface RecentLeaveRequest {
//   id: number;
//   employee_id: number;
//   employee_name: string;
//   department_name: string;
//   department_id: number;
//   leave_type_id: number;
//   leave_type_name: string;
//   start_date: string;
//   end_date: string;
//   duration: number;
//   reason: string;
//   status: 'PENDING' | 'FIRST_APPROVED' | 'APPROVED' | 'REJECTED';
//   approver_id?: number;
//   approval_date?: string;
//   approval_comment?: string;
//   rejection_reason?: string;
//   created_at: string;
//   document_url?: string;
//   document_id?: number;
//   file_name?: string;
//   first_approver_name?: string;
//   second_approver_name?: string;
//   updated_at: string;
// }

// interface LeaveRequest {
//   id: string;
//   type: string;
//   startDate: Date;
//   endDate: Date;
//   reason: string;
//   status: 'pending' | 'approved' | 'rejected';
// }

// interface LeaveType {
//   id: number;
//   leave_type_name: string;
//   description: string;
//   max_days: number;
//   is_paid: boolean;
//   is_active: boolean;
//   requires_documentation: boolean;
// }

// interface LeaveBalance {
//   id: number;
//   employee_id: string;
//   leave_type_id: string;
//   leave_type_name: string;
//   year: number;
//   total_days: number;
//   used_days: number;
//   remaining_days: number;
//   accrual_days: number;
//   accrual_remaining_days: number;
//   is_total: boolean;
//   total_type: string;
//   is_divident: boolean;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   company_id: number;
//   department_id: number;
//   gender?: string;
// }

// interface FormData {
//   type: string;
//   startDate: Date | undefined;
//   endDate: Date | undefined;
//   reason: string;
//   attachment: File | null;
//   employee_id: number | undefined;
//   isHalfDay: boolean;
// }

// interface FormErrors {
//   type: string;
//   reason: string;
//   startDate: string;
//   endDate: string;
//   attachment: string;
//   employee_id: string;
//   general: string;
// }

// // Alternative helper function for UTC to Singapore timezone conversion
// const convertUTCToSingapore = (utcDateString: string, formatStr: string = 'dd MMM yyyy hh:mm a'): string => {
//   try {
//     // Parse the UTC date string manually
//     let utcDate: Date;
    
//     if (utcDateString.includes('T')) {
//       // Already in ISO format
//       utcDate = new Date(utcDateString);
//     } else {
//       // Convert "YYYY-MM-DD HH:mm:ss" to ISO format
//       const isoString = utcDateString.replace(' ', 'T') + '.000Z';
//       utcDate = new Date(isoString);
//     }
    
//     // If date is invalid, try parsing differently
//     if (isNaN(utcDate.getTime())) {
//       utcDate = new Date(utcDateString);
//     }
    
//     // Manually add 8 hours for Singapore timezone (GMT+8)
//     const singaporeTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
    
//     // Format the result
//     return format(singaporeTime, formatStr);
//   } catch (error) {
//     console.error('Error in convertUTCToSingapore:', error);
//     return 'Invalid date';
//   }
// };

// const LeaveOverview = () => {
//   const { theme } = useTheme();
//   const { notification, showNotification } = useNotification();
//   const [requests, setRequests] = useState<LeaveRequest[]>([]);

//   const [formData, setFormData] = useState<FormData>({
//   type: '',
//   startDate: undefined,
//   endDate: undefined,
//   reason: '',
//   attachment: null,
//   employee_id: undefined,
//   isHalfDay: false
// });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
//   const [leaveTypesByEmployeeId, setLeaveTypesByEmployeeId] = useState<LeaveType[]>([]);
//   const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [recentLeaveRequests, setRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
//   const [myRecentLeaveRequests, setMyRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
//   const [allRecentLeaveRequests, setAllRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
//   const [role, setRole] = useState<string>('');
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string>('');
//   // const [errors, setErrors] = useState<FormErrors>({
//   //   type: '',
//   //   reason: '',
//   //   startDate: '',
//   //   endDate: '',
//   //   attachment: ''
//   // });

//   const [errors, setErrors] = useState<FormErrors>({
//   type: '',
//   reason: '',
//   startDate: '',
//   endDate: '',
//   attachment: '',
//   employee_id: '',
//   general: ''
// });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
//   const [editingRequestAttachment, setEditingRequestAttachment] = useState<{ url: string, name: string } | null>(null);
//   const [selectedLeaveDocuments, setSelectedLeaveDocuments] = useState<any[]>([]);
//   const [editingRequestDocuments, setEditingRequestDocuments] = useState<any[]>([]);
//   const [documentManagerKey, setDocumentManagerKey] = useState(0);
//   const [showAllLeaveHistory, setShowAllLeaveHistory] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<RecentLeaveRequest | null>(null);
//   const [showCancelConfirm, setShowCancelConfirm] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [selectedRequestDocuments, setSelectedRequestDocuments] = useState<any[]>([]);
//   const { 
//       previewData, 
//       isLoadingPreview, 
//       previewError, 
//       calculateLeavePreview, 
//       clearPreview 
//     } = useLeavePreview();

//   useEffect(() => {
//     // Get user role from localStorage
//     const userRole = localStorage.getItem('hrms_role');
//     if (userRole) {
//       setRole(userRole);
//     }

//     const token = localStorage.getItem('hrms_token');
//     if (token) {
//       setToken(token);
//     }

//     // Get user data from localStorage
//     const userData = localStorage.getItem('hrms_user');
//     if (userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//       } catch (err) {
//         console.error('Error parsing user data:', err);
//       }
//     }
//   }, []);

// // Filter leave types based on user gender
// const getFilteredLeaveTypes = () => {
//   // Don't apply gender filtering for admin users
//   if (user?.role?.toLowerCase() === 'admin') {
//     return leaveTypesByEmployeeId; // Use leaveTypesByEmployeeId
//   }

//   // Get gender from localStorage
//   const userFromStorage = localStorage.getItem('hrms_user');
//   if (!userFromStorage) return leaveTypesByEmployeeId;
  
//   try {
//     const parsedUser = JSON.parse(userFromStorage);
//     const gender = parsedUser?.gender;
    
//     if (!gender) return leaveTypesByEmployeeId;

//     return leaveTypesByEmployeeId.filter(type => {
//       const leaveTypeName = type.leave_type_name.toLowerCase();
      
//       // Hide paternity leave for non-male users
//       if (leaveTypeName.includes('paternity') && gender !== 'Male') {
//         return false;
//       }
      
//       // Hide maternity leave for non-female users
//       if (leaveTypeName.includes('maternity') && gender !== 'Female') {
//         return false;
//       }
      
//       // If gender is 'Other', hide both paternity and maternity
//       if (gender === 'Other' && 
//           (leaveTypeName.includes('paternity') || leaveTypeName.includes('maternity'))) {
//         return false;
//       }
      
//       return true;
//     });
//   } catch (error) {
//     console.error('Error parsing user from localStorage:', error);
//     return leaveTypesByEmployeeId;
//   }
// };

//   // Filter leave types based on user gender
//   const getFilteredLeaveTypes0812 = () => {
//     // Don't apply gender filtering for admin users
//     if (user?.role?.toLowerCase() === 'admin') {
//       return leaveTypesByEmployeeId;
//     }

//     // Get gender from localStorage
//     const userFromStorage = localStorage.getItem('hrms_user');
//     if (!userFromStorage) return leaveTypesByEmployeeId;
    
//     try {
//       const parsedUser = JSON.parse(userFromStorage);
//       const gender = parsedUser?.gender;
      
//       if (!gender) return leaveTypesByEmployeeId;

//       return leaveTypesByEmployeeId.filter(type => {
//         const leaveTypeName = type.leave_type_name.toLowerCase();
        
//         // Hide paternity leave for non-male users
//         if (leaveTypeName.includes('paternity') && gender !== 'Male') {
//           return false;
//         }
        
//         // Hide maternity leave for non-female users
//         if (leaveTypeName.includes('maternity') && gender !== 'Female') {
//           return false;
//         }
        
//         // If gender is 'Other', hide both paternity and maternity
//         if (gender === 'Other' && 
//             (leaveTypeName.includes('paternity') || leaveTypeName.includes('maternity'))) {
//           return false;
//         }
        
//         return true;
//       });
//     } catch (error) {
//       console.error('Error parsing user from localStorage:', error);
//       return leaveTypesByEmployeeId;
//     }
//   };

//   const fetchLeaveData = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       if (!user?.id) {
//         console.error('No user ID available');
//         return;
//       }

//       const [typesResponse, balancesResponse, recentLeavesResponse, myRecentLeavesResponse, leaveTypesByEmployeeResponse] = await Promise.all([
//         axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leaves/balance`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id,
//             year: new Date().getFullYear()
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id
//           }
//         })
//       ]);
//       setLeaveTypes(typesResponse.data);
//       setLeaveTypesByEmployeeId(leaveTypesByEmployeeResponse.data);
//       console.log(balancesResponse.data);
//       setLeaveBalances(balancesResponse.data);
//       setRecentLeaveRequests(recentLeavesResponse.data.filter((request: RecentLeaveRequest) => request.employee_id.toString() !== user?.id.toString()));
//       setMyRecentLeaveRequests(recentLeavesResponse.data.filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString()));
//       setAllRecentLeaveRequests(recentLeavesResponse.data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//       console.error('Error fetching leave data:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user?.id]);

//   // Fetch leave types and balances
//   useEffect(() => {
//     if (user?.id) {
//       fetchLeaveData();

//        setFormData(prev => ({
//       ...prev,
//       employee_id: user.id
//     }));
//     }
//   }, [user?.id, fetchLeaveData]);

// const openEditModal0112 = async (request: RecentLeaveRequest) => {
//   setFormData({
//     type: request.leave_type_name.toLowerCase(),
//     startDate: new Date(request.start_date),
//     endDate: new Date(request.end_date),
//     reason: request.reason,
//     attachment: null,
//     employee_id: request.employee_id, // Add this
//     isHalfDay: request.duration === 0.5
//   });
//   setIsEditing(true);
//   setEditingRequestId(request.id);
//   setShowRequestModal(true);
//   clearPreview();
  
  
//   // Fetch all documents for this leave application
//   try {
//     const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//       }
//     });
//     const documents = res.data;
//     setEditingRequestDocuments(documents);
    
//     // If the request has an attachment, set it for download
//     if (documents && documents.length > 0) {
//       const firstDocument = documents[0];
//       setEditingRequestAttachment({ 
//         url: firstDocument.document_url, 
//         name: firstDocument.file_name 
//       });
//     } else {
//       setEditingRequestAttachment(null);
//     }
//   } catch (err) {
//     console.error('Error fetching documents for editing:', err);
//     setEditingRequestDocuments([]);
//     setEditingRequestAttachment(null);
//   }
// };

// const openEditModal = async (request: RecentLeaveRequest) => {
//   // First, clear any existing preview
//   clearPreview();
  
//   const formDataForEdit = {
//     type: request.leave_type_name.toLowerCase(),
//     startDate: new Date(request.start_date),
//     endDate: new Date(request.end_date),
//     reason: request.reason,
//     attachment: null,
//     employee_id: request.employee_id,
//     isHalfDay: request.duration === 0.5
//   };

//   setFormData(formDataForEdit);
//   setIsEditing(true);
//   setEditingRequestId(request.id);
//   setShowRequestModal(true);
  
//   // Find the selected leave type
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === formDataForEdit.type.toLowerCase()
//   );
  
//   if (selectedType) {
//     try {
//       // Trigger preview calculation WITH exclude_leave_id parameter
//       await calculateLeavePreview({
//         employee_id: formDataForEdit.employee_id,
//         leave_type_id: selectedType.id,
//         start_date: calculateDateInUTC(formDataForEdit.startDate).toISOString().split('T')[0],
//         end_date: calculateDateInUTC(formDataForEdit.endDate).toISOString().split('T')[0],
//         is_half_day: formDataForEdit.isHalfDay,
//         exclude_leave_id: request.id // Pass the current leave ID to exclude
//       });
//     } catch (error) {
//       console.error('Failed to calculate preview for edit:', error);
//     }
//   }

//   // Fetch all documents for this leave application
//   try {
//     const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//       }
//     });
//     const documents = res.data;
//     setEditingRequestDocuments(documents);
    
//     // If the request has an attachment, set it for download
//     if (documents && documents.length > 0) {
//       const firstDocument = documents[0];
//       setEditingRequestAttachment({ 
//         url: firstDocument.document_url, 
//         name: firstDocument.file_name 
//       });
//     } else {
//       setEditingRequestAttachment(null);
//     }
//   } catch (err) {
//     console.error('Error fetching documents for editing:', err);
//     setEditingRequestDocuments([]);
//     setEditingRequestAttachment(null);
//   }
// };

// const handleSubmit0112 = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (isSubmitting) return; // Prevent multiple submissions
  
//   if (validateForm()) {
//     setIsSubmitting(true); // Start loading
    
//     const startDate = new Date(Date.UTC(
//       formData.startDate!.getFullYear(),
//       formData.startDate!.getMonth(),
//       formData.startDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     const endDate = new Date(Date.UTC(
//       formData.endDate!.getFullYear(),
//       formData.endDate!.getMonth(),
//       formData.endDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     try {
//       const selectedType = leaveTypes.find(type => 
//         type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//       );
      
//       if (!selectedType) {
//         throw new Error('Invalid leave type');
//       }

//       console.log('🔄 LEAVE SUBMISSION PROCESS STARTED');

//       // Step 1: Create/Update leave application first (without files)
//       const leaveData = {
//         employee_id: user?.id?.toString() || '',
//         leave_type_id: selectedType.id.toString(),
//         start_date: startDate,
//         end_date: endDate,
//         reason: formData.reason,
//         is_half_day: formData.isHalfDay ? "1" : "0"
//       };

//       console.log('📝 Creating/Updating leave application:', leaveData);

//       let leaveResponse;
//       const leaveId = isEditing ? editingRequestId : null;

//       if (isEditing && editingRequestId) {
//         // Update existing leave
//         leaveResponse = await axios.put(
//           `${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application updated:', editingRequestId);
//       } else {
//         // Create new leave
//         leaveResponse = await axios.post(
//           `${API_BASE_URL}/api/v1/leaves`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application created');
//       }

//       // 🔴 FIX: Get the leave ID properly
//       const finalLeaveId = isEditing ? editingRequestId : leaveResponse.data.leaveId;
//       console.log('🎯 Leave ID for document upload:', finalLeaveId);

//       if (!finalLeaveId) {
//         throw new Error('Could not determine leave ID');
//       }

//       // Step 2: Upload files separately if any
//       const hasDocuments = selectedLeaveDocuments.length > 0 || formData.attachment;
      
//       if (hasDocuments) {
//         console.log('📎 Starting document upload process...');
        
//         const uploadFormData = new FormData();
        
//         // 🔴 FIX: Ensure uploaded_by is always a string
//         const uploaded_by = (user?.id?.toString() || '');
//         if (!uploaded_by) {
//           throw new Error('Could not determine user ID for upload');
//         }
        
//         uploadFormData.append('uploaded_by', uploaded_by);
        
//         // Add files to FormData - Use 'attachments' field name
//         if (selectedLeaveDocuments.length > 0) {
//           selectedLeaveDocuments.forEach((doc, idx) => {
//             if (doc.file) {
//               console.log(`📎 Appending file to FormData: ${doc.file.name}`);
//               uploadFormData.append('attachments', doc.file);
//             }
//           });
//         } else if (formData.attachment) {
//           console.log(`📎 Appending single file to FormData: ${formData.attachment.name}`);
//           uploadFormData.append('attachments', formData.attachment);
//         }

//         // Debug FormData contents
//         console.log('📤 FormData contents for upload:');
//         for (let [key, value] of (uploadFormData as any).entries()) {
//           if (value instanceof File) {
//             console.log(`📁 ${key}:`, value.name, value.size, value.type);
//           } else {
//             console.log(`📝 ${key}:`, value);
//           }
//         }

//         try {
//           // Upload files to the separate endpoint
//           const uploadResponse = await axios.post(
//             `${API_BASE_URL}/api/v1/leaves/${finalLeaveId}/documents`,
//             uploadFormData,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//                 'Content-Type': 'multipart/form-data'
//               },
//               // Add timeout and progress for large files
//               timeout: 60000, // 60 seconds timeout
//               onUploadProgress: (progressEvent) => {
//                 const percentCompleted = Math.round(
//                   (progressEvent.loaded * 100) / (progressEvent.total || 1)
//                 );
//                 console.log(`📤 Upload Progress: ${percentCompleted}%`);
//                 // You can also update a progress state here if you want to show progress bar
//               }
//             }
//           );
          
//           console.log('✅ Documents uploaded successfully:', uploadResponse.data);
//         } catch (uploadError) {
//           console.error('❌ Document upload failed:', uploadError);
//           // Don't fail the entire request if document upload fails
//           showNotification('Leave created but document upload failed', 'error');
//         }
//       } else {
//         console.log('📭 No documents to upload');
//       }

//       // Success
//       console.log('🎉 Leave submission completed successfully');
//       showNotification(
//         isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 
//         'success'
//       );
      
//       // Reset form
//       setFormData({
//         type: '',
//         startDate: undefined,
//         endDate: undefined,
//         reason: '',
//         attachment: null,
//         employee_id: undefined,
//         isHalfDay: false
//       });
//       resetLeaveAttachment();
//       setShowRequestModal(false);
//       setIsEditing(false);
//       setEditingRequestId(null);
//       setEditingRequestAttachment(null);
//       fetchLeaveData();

//     } catch (err) {
//       console.error('❌ LEAVE SUBMISSION ERROR:', err);
//       if (axios.isAxiosError(err)) {
//         console.error('❌ Axios error details:', {
//           status: err.response?.status,
//           data: err.response?.data,
//           message: err.response?.data?.message,
//           error: err.response?.data?.error
//         });
        
//         const errorMessage = err.response?.data?.message || 
//                            err.response?.data?.error || 
//                            'Failed to submit leave request. Please try again.';
//         showNotification(errorMessage, 'error');
//       } else {
//         console.error('❌ Non-Axios error:', err);
//         showNotification('Failed to submit leave request. Please try again.', 'error');
//       }
//     } finally {
//       setIsSubmitting(false); // End loading regardless of success/error
//     }
//   }
// };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (isSubmitting) return; // Prevent multiple submissions
  
//   // Use preview data for validation if available
//   if (previewData && previewData.can_proceed === false) {
//     setErrors(prev => ({
//       ...prev,
//       general: 'Cannot submit leave due to validation issues. Please check the preview details.'
//     }));
//     showNotification('Cannot submit leave due to validation issues. Please check the preview details.', 'error');
//     return;
//   }

//   if (validateForm()) {
//     setIsSubmitting(true); // Start loading
    
//     const startDate = new Date(Date.UTC(
//       formData.startDate!.getFullYear(),
//       formData.startDate!.getMonth(),
//       formData.startDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     const endDate = new Date(Date.UTC(
//       formData.endDate!.getFullYear(),
//       formData.endDate!.getMonth(),
//       formData.endDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     try {
//       const selectedType = leaveTypesByEmployeeId.find(type => 
//         type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//       );
      
//       if (!selectedType) {
//         throw new Error('Invalid leave type');
//       }

//       console.log('🔄 LEAVE SUBMISSION PROCESS STARTED');

//       // Step 1: Create/Update leave application first (without files)
//       const leaveData = {
//         employee_id: formData.employee_id?.toString() || user?.id?.toString() || '',
//         leave_type_id: selectedType.id.toString(),
//         start_date: startDate,
//         end_date: endDate,
//         reason: formData.reason,
//         is_half_day: formData.isHalfDay
//       };

//       console.log('📝 Creating/Updating leave application:', leaveData);

//       let leaveResponse;
//       const leaveId = isEditing ? editingRequestId : null;

//       if (isEditing && editingRequestId) {
//         // Update existing leave
//         leaveResponse = await axios.put(
//           `${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application updated:', editingRequestId);
//         console.log('📋 Update Response:', leaveResponse.data);
//       } else {
//         // Create new leave
//         leaveResponse = await axios.post(
//           `${API_BASE_URL}/api/v1/leaves`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application created');
//         console.log('📋 Create Response:', leaveResponse.data);
//         console.log('📋 Response keys:', Object.keys(leaveResponse.data));
//       }

//       // Get the leave ID properly - check multiple possible response formats
//       let finalLeaveId;
//       const responseData = leaveResponse.data;
      
//       if (isEditing && editingRequestId) {
//         finalLeaveId = editingRequestId;
//       } else {
//         // Try different possible field names for the leave ID
//         finalLeaveId = responseData.id || 
//                       responseData.leaveId || 
//                       responseData.leave_id || 
//                       responseData.data?.id || 
//                       responseData.data?.leaveId;
        
//         console.log('🎯 Extracted Leave ID:', finalLeaveId);
//         console.log('🎯 Full response for debugging:', responseData);
        
//         // If we still can't find it, check the data property
//         if (!finalLeaveId && responseData.data) {
//           console.log('🔍 Checking data property:', responseData.data);
//           finalLeaveId = responseData.data.id || responseData.data.leaveId;
//         }
//       }

//       if (!finalLeaveId) {
//         console.error('❌ Could not find leave ID in response:', responseData);
//         throw new Error('Could not determine leave ID from server response');
//       }

//       console.log('🎯 Final Leave ID for document upload:', finalLeaveId);

//       // Step 2: Upload files separately if any
//       const hasDocuments = selectedLeaveDocuments.length > 0 || formData.attachment;
      
//       if (hasDocuments) {
//         console.log('📎 Starting document upload process...');
        
//         const uploadFormData = new FormData();
        
//         // Ensure uploaded_by is always a string
//         const uploaded_by = (user?.id?.toString() || formData.employee_id?.toString() || '');
//         if (!uploaded_by) {
//           throw new Error('Could not determine user ID for upload');
//         }
        
//         uploadFormData.append('uploaded_by', uploaded_by);
        
//         // Add files to FormData - Use 'attachments' field name
//         if (selectedLeaveDocuments.length > 0) {
//           selectedLeaveDocuments.forEach((doc, idx) => {
//             if (doc.file) {
//               console.log(`📎 Appending file to FormData: ${doc.file.name}`);
//               uploadFormData.append('attachments', doc.file);
//             }
//           });
//         } else if (formData.attachment) {
//           console.log(`📎 Appending single file to FormData: ${formData.attachment.name}`);
//           uploadFormData.append('attachments', formData.attachment);
//         }

//         try {
//           // Upload files to the separate endpoint
//           const uploadResponse = await axios.post(
//             `${API_BASE_URL}/api/v1/leaves/${finalLeaveId}/documents`,
//             uploadFormData,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//                 'Content-Type': 'multipart/form-data'
//               },
//               timeout: 60000,
//               onUploadProgress: (progressEvent) => {
//                 const percentCompleted = Math.round(
//                   (progressEvent.loaded * 100) / (progressEvent.total || 1)
//                 );
//                 console.log(`📤 Upload Progress: ${percentCompleted}%`);
//               }
//             }
//           );
          
//           console.log('✅ Documents uploaded successfully:', uploadResponse.data);
//         } catch (uploadError) {
//           console.error('❌ Document upload failed:', uploadError);
//           // Don't fail the entire request if document upload fails
//           showNotification('Leave created but document upload failed', 'error');
//         }
//       } else {
//         console.log('📭 No documents to upload');
//       }

//       // Success
//       console.log('🎉 Leave submission completed successfully');
//       showNotification(
//         isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 
//         'success'
//       );
      
//       // Reset form and preview
//       setFormData({
//         type: '',
//         startDate: undefined,
//         endDate: undefined,
//         reason: '',
//         attachment: null,
//         employee_id: undefined,
//         isHalfDay: false
//       });
//       resetLeaveAttachment();
//       clearPreview(); // Clear preview data
//       setShowRequestModal(false);
//       setIsEditing(false);
//       setEditingRequestId(null);
//       setEditingRequestAttachment(null);
//       fetchLeaveData();

//     //} catch (err) {
//       // console.error('❌ LEAVE SUBMISSION ERROR:', err);
//       // if (axios.isAxiosError(err)) {
//       //   console.error('❌ Axios error details:', {
//       //     status: err.response?.status,
//       //     data: err.response?.data,
//       //     message: err.response?.data?.message,
//       //     error: err.response?.data?.error
//       //   });
        
//       //   const errorMessage = err.response?.data?.message || 
//       //                      err.response?.data?.error || 
//       //                      'Failed to submit leave request. Please try again.';
//       //   showNotification(errorMessage, 'error');
//       // } else {
//       //   console.error('❌ Non-Axios error:', err);
//       //   showNotification('Failed to submit leave request. Please try again.', 'error');
//       // }.
//       } catch (updateError) {
//       if (axios.isAxiosError(updateError) && updateError.response?.status === 400) {
//             const errorMessage = updateError.response?.data?.error || 'Failed to update leave request';
            
//             // Check for specific error messages
//             if (errorMessage.includes('No working days found') || 
//                 errorMessage.includes('contains only weekends')) {
//               showNotification(
//                 `Cannot update leave: ${errorMessage}. Please select dates that include weekdays.`,
//                 'error'
//               );
//               return;
//             } else {
//               showNotification(errorMessage, 'error');
//             }
//                       } else {
//             throw updateError;
//           }
//     } finally {
//       setIsSubmitting(false); // End loading regardless of success/error
//     }
//   }
// };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setFormData({ ...formData, attachment: file });
//   };

//   // Add function to check for conflicting dates
//   const hasDateConflict = (startDate: Date, endDate: Date): boolean => {
//     // Get all approved and pending leave requests
//     const existingRequests = myRecentLeaveRequests.filter(
//       request => {
//         // When editing, exclude the current request from conflict check
//         if (isEditing && editingRequestId === request.id) {
//           return false;
//         }
//         return request.status === 'APPROVED' || request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
//       }
//     );

//     // Check each existing request for overlap
//     return existingRequests.some(request => {
//       const requestStart = calculateDateInUTC(new Date(request.start_date));
//       const requestEnd = calculateDateInUTC(new Date(request.end_date));
//       const checkStart = calculateDateInUTC(startDate);
//       const checkEnd = calculateDateInUTC(endDate);
      
//       // Check if the new date range overlaps with any existing request
//       return (
//         (checkStart <= requestEnd && checkEnd >= requestStart) || // New request overlaps with existing request
//         (checkStart >= requestStart && checkStart <= requestEnd) || // New start date falls within existing request
//         (checkEnd >= requestStart && checkEnd <= requestEnd) // New end date falls within existing request
//       );
//     });
//   };

//   // Update handleDateChange to check for conflicts
//   const handleDateChange = (value: string, isStartDate: boolean) => {
//     const date = new Date(value);
//     const newFormData = { ...formData };
    
//     if (isStartDate) {
//       newFormData.startDate = date;
//     } else {
//       newFormData.endDate = date;
//     }

//     // Reset isHalfDay if dates don't match
//     if (newFormData.startDate && newFormData.endDate && 
//         calculateDateInUTC(newFormData.startDate).toISOString().split('T')[0] !== calculateDateInUTC(newFormData.endDate).toISOString().split('T')[0]) {
//       newFormData.isHalfDay = false;
//     }

//     // Get emergency leave type and balance
//     const emergencyLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'emergency leave');
//     const emergencyBalance = emergencyLeave ? leaveBalances.find(b => b.leave_type_id === emergencyLeave.id.toString()) : null;
//     const hasEmergencyLeaveRemaining = emergencyBalance && emergencyBalance.remaining_days > 0;

//     // Get unpaid leave type
//     const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');

//     // Check if current type is emergency leave and has 0 remaining days
//     if (formData.type.toLowerCase() === 'emergency leave' && emergencyBalance && emergencyBalance.remaining_days === 0) {
//       if (unpaidLeave) {
//         newFormData.type = 'unpaid leave';
//         showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
//         setFormData(newFormData);
//         return;
//       }
//     }

//     // Check if annual leave and within 5 days
//     if (formData.type.toLowerCase() === 'annual leave' && isLessThan5Days(date)) {
//       if (!hasEmergencyLeaveRemaining) {
//         // If no emergency leave remaining, convert to unpaid leave
//         if (unpaidLeave) {
//           newFormData.type = 'unpaid leave';
//           showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
//         }
//       } else {
//         // Convert to emergency leave if there are remaining days
//         newFormData.type = 'emergency leave';
//         showNotification('Leave type changed to Emergency Leave as the date is less than 5 days from today', 'error');
//       }
//     }

//     // Check for date conflicts
//     if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
//       showNotification('This date range conflicts with an existing leave request', 'error');
//       return;
//     }

//     setFormData(newFormData);
//       // Pass exclude_leave_id when in edit mode
//     if (isEditing && editingRequestId) {
//       triggerPreviewCalculation(newFormData, editingRequestId);
//     } else {
//       triggerPreviewCalculation(newFormData);
//     }
//   //triggerPreviewCalculation(newFormData);
//   };

// const triggerPreviewCalculation0112 = async (formDataToCheck: typeof formData) => {
//   // Check each required field individually with type safety
//   const missingFields = [];
  
//   if (!formDataToCheck.startDate) missingFields.push('startDate');
//   if (!formDataToCheck.endDate) missingFields.push('endDate');
//   if (!formDataToCheck.type) missingFields.push('type');
//   if (!formDataToCheck.employee_id) missingFields.push('employee_id');
  
//   // Log missing fields if any
//   if (missingFields.length > 0) {
//     console.log(`Missing or empty fields: ${missingFields.join(', ')}`);
//     return; // Not enough data yet
//   }

//   // At this point, TypeScript knows these values exist, but we need to assert them
//   const employeeId = formDataToCheck.employee_id!;
//   const startDate = formDataToCheck.startDate!;
//   const endDate = formDataToCheck.endDate!;
//   const leaveType = formDataToCheck.type!;
  
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === leaveType.toLowerCase()
//   );
  
//   if (!selectedType) {
//     console.log('No matching leave type found for:', leaveType);
//     return;
//   }

//   try {
//     await calculateLeavePreview({
//       employee_id: employeeId, // Now guaranteed to be a number
//       leave_type_id: selectedType.id,
//       start_date: calculateDateInUTC(startDate).toISOString().split('T')[0], // Now guaranteed to be a Date
//       end_date: calculateDateInUTC(endDate).toISOString().split('T')[0], // Now guaranteed to be a Date
//       is_half_day: formDataToCheck.isHalfDay
//     });
//   } catch (error) {
//     console.error('Failed to calculate preview:', error);
//   }
// };

// // In your LeaveOverview component
// const triggerPreviewCalculation = async (formDataToCheck: typeof formData, excludeLeaveId?: number) => {
//   // Check each required field individually with type safety
//   const missingFields = [];
  
//   if (!formDataToCheck.startDate) missingFields.push('startDate');
//   if (!formDataToCheck.endDate) missingFields.push('endDate');
//   if (!formDataToCheck.type) missingFields.push('type');
  
//   // Get employee_id from user if not in formData
//   const employeeId = formDataToCheck.employee_id || user?.id;
//   if (!employeeId) missingFields.push('employee_id');
  
//   // Log missing fields if any
//   if (missingFields.length > 0) {
//     console.log(`Missing or empty fields: ${missingFields.join(', ')}`);
//     return; // Not enough data yet
//   }

//   // At this point, TypeScript knows these values exist
//   const startDate = formDataToCheck.startDate!;
//   const endDate = formDataToCheck.endDate!;
//   const leaveType = formDataToCheck.type!;
  
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === leaveType.toLowerCase()
//   );
  
//   if (!selectedType) {
//     console.log('No matching leave type found for:', leaveType);
//     return;
//   }

//   try {
//     await calculateLeavePreview({
//       employee_id: employeeId!,
//       leave_type_id: selectedType.id,
//       start_date: calculateDateInUTC(startDate).toISOString().split('T')[0],
//       end_date: calculateDateInUTC(endDate).toISOString().split('T')[0],
//       is_half_day: formDataToCheck.isHalfDay,
//       exclude_leave_id: excludeLeaveId // Pass the exclude parameter
//     });
//   } catch (error) {
//     console.error('Failed to calculate preview:', error);
//   }
// };

//   // Update validateForm to include date conflict check
//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { 
//       type: '',
//       reason: '',
//       startDate: '',
//       endDate: '',
//       attachment: '',
//       employee_id: '',
//       general: ''
//     };

//     if (!formData.type || formData.type === 'Select') {
//       newErrors.type = 'Please select a leave type';
//       isValid = false;
//     }

//     if (!formData.reason.trim()) {
//       newErrors.reason = 'Please provide a reason for your leave request';
//       isValid = false;
//     }

//     if (!formData.startDate) {
//       newErrors.startDate = 'Please select a start date';
//       isValid = false;
//     }

//     if (!formData.endDate) {
//       newErrors.endDate = 'Please select an end date';
//       isValid = false;
//     }

//     if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
//       newErrors.endDate = 'End date cannot be before start date';
//       isValid = false;
//     }

//     // Check for date conflicts
//     if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
//       newErrors.startDate = 'This date range conflicts with an existing leave request';
//       isValid = false;
//     }

//     // Check if documentation is required based on leave type
//     const selectedLeaveType = leaveTypesByEmployeeId.find(type => 
//       type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//     );

//     if (selectedLeaveType?.requires_documentation && 
//         !formData.attachment && 
//         (!selectedLeaveDocuments || selectedLeaveDocuments.length === 0)) {
//       // Skip attachment validation if editing and documents already exist
//       if (!(isEditing && editingRequestDocuments && editingRequestDocuments.length > 0)) {
//         newErrors.attachment = 'Please provide an attachment for your leave request';
//         isValid = false;
//       }
//     }

//     // Check if request duration exceeds remaining balance
//     if (formData.type !== 'unpaid leave') {
//       const requestDuration = getRequestDuration();
//       const remainingDays = getRemainingDays();
//       if (requestDuration > remainingDays) {
//         const message = `Request duration (${requestDuration} days) exceeds remaining balance (${remainingDays} days)`;
//         showNotification(message, 'error');
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Get remaining days for selected leave type
//   const getRemainingDays_0812 = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType) return 0;

//     const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
//     let remainingDays = 0;
//     if (balance?.is_total) {
//       remainingDays = balance?.remaining_days ?? 0;
//     } else if (balance?.is_divident) {
//       remainingDays = balance?.accrual_remaining_days ?? 0;
//     } else {
//       remainingDays = balance?.remaining_days ?? 0;
//     }

//     // If remaining days is 0, convert to unpaid leave
//     if (remainingDays === 0 && selectedType.leave_type_name.toLowerCase() !== 'unpaid leave') {
//       const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
//       if (unpaidLeave) {
//         setFormData({ ...formData, type: 'unpaid leave' });
//         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
//       }
//     }

//     return remainingDays;
//   };

//   // Get remaining days for selected leave type
// const getRemainingDays = () => {
//   if (!formData.type || formData.type === 'Select') return 0;
  
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//   );
  
//   if (!selectedType) return 0;

//   // Find the balance using leave_type_name instead of ID
//   const balance = leaveBalances.find(b => 
//     b.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//   );
  
//   if (!balance) {
//     // If no balance found, it might be unpaid leave or a type without balance
//     return formData.type.toLowerCase() === 'unpaid leave' ? 999 : 0;
//   }

//   // Calculate remaining days based on balance type
//   let remainingDays = 0;
//   if (balance.is_total) {
//     remainingDays = balance.remaining_days ?? 0;
//   } else if (balance.is_divident) {
//     remainingDays = balance.accrual_remaining_days ?? 0;
//   } else {
//     remainingDays = balance.remaining_days ?? 0;
//   }

//   // Remove the auto-conversion logic from here
//   // This should only be done in handleLeaveTypeChange
//   return remainingDays;
// };

//   // Get total days for selected leave type
//   const getTotalDays = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType) return 0;

//     const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
//     return balance?.total_days ?? 0;
//   };

//   // Get used days for selected leave type
//   const getUsedDays = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType) return 0;

//     const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
//     return balance?.used_days ?? 0;
//   };

//   // Get current request duration
//   const getRequestDuration = () => {
//     if (!formData.startDate || !formData.endDate) {
//       return 0;
//     }
//     return calculateDuration(formData.startDate, formData.endDate);
//   };

//   // Check if request duration exceeds remaining days
//   const isDurationExceeded = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType || !selectedType.is_paid) return false;
//     const remainingDays = getRemainingDays();
//     const requestDuration = getRequestDuration();
//     return requestDuration > remainingDays;
//   };

//   const getRejectedLeaves = () => {
//     if (user?.role === 'employee') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
//         .length;

//       return rejectedLeave;
//     } else if (user?.role === 'supervisor' || user?.role === 'manager') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
//         .length;

//       return rejectedLeave;
//     } else if (user?.role === 'admin') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
//         .length;

//       return rejectedLeave;
//     } else {
//       return 0;
//     }
//   };

//   const getPendingLeaves = () => {
//     if (user?.role === 'employee') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
//         .length;

//       return rejectedLeave;
//     } else if (user?.role === 'supervisor') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING')
//         .length;

//       return rejectedLeave;
//   } else if (user?.role === 'manager') {
//     const rejectedLeave = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
//       .length;

//     return rejectedLeave;
//   } else if (user?.role === 'admin') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
//         .length;

//       return rejectedLeave;
//     } else {
//       return 0;
//     }
//   };  

//   // Get current request duration
//   const getOnLeaveToday = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (user?.role === 'employee') {
//       const onLeaveToday = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;
//       return onLeaveToday;

//     } else if (user?.role === 'supervisor' || user?.role === 'manager') {
//       const onLeaveToday = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;
//       return onLeaveToday;

//     } else if (user?.role === 'admin') {
//       const onLeaveToday = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;
//       return onLeaveToday;

//     } else {
//       return 0;
//     }

//     const onLeaveToday = recentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;

//     return onLeaveToday;
//   };

//   const getApprovedLeaveDates = () => {
//     if (!myRecentLeaveRequests) return [];

//     return myRecentLeaveRequests
//       .filter(request => request.status === 'APPROVED')
//       .flatMap(request => {
//         const start = new Date(request.start_date);
//         const end = new Date(request.end_date);
//         return eachDayOfInterval({ start, end });
//       });
//   };

//   const getPendingLeaveDates = () => {
//     if (!myRecentLeaveRequests) return [];

//     return myRecentLeaveRequests
//       .filter(request => request.status === 'PENDING')
//       .flatMap(request => {
//         const start = new Date(request.start_date);
//         const end = new Date(request.end_date);
//         return eachDayOfInterval({ start, end });
//       });
//   };

//   const renderDayContents = (day: Date) => {
//     const approvedDates = getApprovedLeaveDates();
//     const pendingDates = getPendingLeaveDates();
//     const isOnLeave = approvedDates.some(date => isSameDay(date, day));
//     const isPending = pendingDates.some(date => isSameDay(date, day));
//     const isToday = isSameDay(day, new Date());

//     return (
//       <div className={`h-full w-full flex items-center justify-center ${isOnLeave ? 'bg-green-500 text-white rounded-full' :
//           isPending ? 'bg-yellow-500 text-white rounded-full' :
//             isToday ? 'bg-blue-500 text-white rounded-full' : ''
//         }`}>
//         {day.getDate()}
//       </div>
//     );
//   };

//   const resetLeaveAttachment = () => {
//     setSelectedLeaveDocuments([]);
//     setFormData(prev => ({
//       ...prev,
//       attachment: null
//     }));
//     setEditingRequestAttachment(null);
//     setDocumentManagerKey(prev => prev + 1);
//   }

//   const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
//     if (removedFile) {
//       setSelectedLeaveDocuments(prev => 
//         prev.filter(file => 
//           !(file.name === removedFile.name && 
//             file.documentType === removedFile.documentType && 
//             file.file === removedFile.file)
//         )
//       );
//     }
//   };

//   function getAttachmentIdFromUrl(url: string) {
//     const parts = url.split('/');
//     return parts.length >= 2 ? parts[parts.length - 2] : null;
//   }

//   // Add function to check if dates are less than 14 days from today
//   const isLessThan14Days = (date: Date) => {
//     const today = new Date();
//     const diffTime = date.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays < 14;
//   };

//   // Add function to check if dates are less than 5 days from today
//   const isLessThan5Days = (date: Date) => {
//     const today = new Date();
//     const diffTime = date.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays < 5;
//   };


// const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   const newType = e.target.value;
  
//   // Skip check if "Select" is chosen
//   if (newType === 'Select') {
//     setFormData(prev => ({ ...prev, type: newType }));
//     clearPreview();
//     return;
//   }

//   // Find the selected leave type using leaveTypesByEmployeeId
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === newType.toLowerCase()
//   );
  
//   if (!selectedType) return;

//   // Find the corresponding balance
//   const balance = leaveBalances.find(b => 
//     b.leave_type_name.toLowerCase() === newType.toLowerCase()
//   );

//   // IMPORTANT: Only auto-convert to unpaid leave when there are actually 0 remaining days
//   // Check if this leave type has a balance (might not exist for unpaid leave)
//   if (balance) {
//     let remainingDays = 0;
    
//     // Calculate remaining days based on balance type
//     if (balance.is_total) {
//       remainingDays = balance.remaining_days ?? 0;
//     } else if (balance.is_divident) {
//       remainingDays = balance.accrual_remaining_days ?? 0;
//     } else {
//       remainingDays = balance.remaining_days ?? 0;
//     }

//     // Only convert to unpaid leave if there are 0 remaining days AND it's not already unpaid leave
//     if (remainingDays === 0 && newType.toLowerCase() !== 'unpaid leave') {
//       const unpaidLeave = leaveTypesByEmployeeId.find(type => 
//         type.leave_type_name.toLowerCase() === 'unpaid leave'
//       );
      
//       if (unpaidLeave) {
//         // Update form data with unpaid leave
//         const updatedFormData = { 
//           ...formData, 
//           type: 'unpaid leave',
//           // Also clear preview since we're changing type
//         };
//         setFormData(updatedFormData);
//         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
//         clearPreview();
//         return;
//       }
//     }
//   }

//   // If no conversion needed, set the selected type
//   const updatedFormData = { ...formData, type: newType };
//   setFormData(updatedFormData);
  
//   // Only trigger preview if we have all required data
//   if (formData.employee_id && formData.startDate && formData.endDate) {
//     triggerPreviewCalculation(updatedFormData);
//   }
// };

//   // Add function to handle leave type change
//   const handleLeaveTypeChange0812 = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newType = e.target.value;
    
//     // Skip check if "Select" is chosen
//     if (newType === 'Select') {
//       setFormData({ ...formData, type: newType });
//       return;
//     }

//     // Find the selected leave type
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === newType.toLowerCase());
//     if (!selectedType) return;

//     // Check remaining days
//     const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
//     const remainingDays = balance?.remaining_days ?? 0;

//     // If remaining days is 0, convert to unpaid leave
//     if (remainingDays === 0 && newType.toLowerCase() !== 'unpaid leave') {
//       const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
//       if (unpaidLeave) {
//         setFormData({ ...formData, type: 'unpaid leave' });
//         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
//         return;
//       }
//     }

//     // If no conversion needed, set the selected type
//     setFormData({ ...formData, type: newType });
//     const updatedFormData = { ...formData, type: newType };
//     setFormData(updatedFormData);
//     triggerPreviewCalculation(updatedFormData);
//   };

//   const handleCancelLeave = async (requestId: number) => {
//     try {
//       await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/cancel`, {
//         employee_id: user?.id
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       showNotification('Leave request cancelled successfully', 'success');
//       setShowCancelConfirm(false);
//       setIsViewModalOpen(false);
//       fetchLeaveData();
//     } catch (err) {
//       console.error('Error cancelling leave request:', err);
//       showNotification('Failed to cancel leave request', 'error');
//     }
//   };

//   const handleViewRequest3011 = async (request: RecentLeaveRequest) => {
//     try {
//       // Fetch leave documents
//       const documentsResponse = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       const documents = documentsResponse.data;
      
//       // If there are documents, update the request with the first document's info
//       if (documents && documents.length > 0) {
//         const firstDocument = documents[0];
//         request.document_url = firstDocument.document_url;
//         request.file_name = firstDocument.file_name;
//       }
      
//       setSelectedRequest(request);
//       setIsViewModalOpen(true);
//     } catch (err) {
//       console.error('Error fetching leave documents:', err);
//       // Still show the request even if document fetch fails
//       setSelectedRequest(request);
//       setIsViewModalOpen(true);
//     }
//   };


//   // Add this function in your component, after other handler functions
// const handleHalfDayToggle0112 = (isHalfDay: boolean) => {
//   const newFormData = { ...formData, isHalfDay };
//   setFormData(newFormData);

//   // Trigger preview calculation if all required fields are filled
//   if (formData.employee_id && formData.type && formData.startDate && formData.endDate) {
//     const selectedLeaveType = leaveTypes.find(
//       (type) => type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//     );
    
//     if (selectedLeaveType) {
//       // Trigger preview calculation
//       calculateLeavePreview({
//         employee_id: formData.employee_id,
//         leave_type_id: selectedLeaveType.id,
//         start_date: formData.startDate.toISOString().split('T')[0],
//         end_date: formData.endDate.toISOString().split('T')[0],
//         is_half_day: isHalfDay
//       }).catch((error) => {
//         console.error('Failed to calculate preview:', error);
//       });
//     }
//   }
// };

// const handleHalfDayToggle = (isHalfDay: boolean) => {
//   const newFormData = { ...formData, isHalfDay };
//   setFormData(newFormData);

//   // Trigger preview calculation with exclude_leave_id when editing
//   if (formData.employee_id && formData.type && formData.startDate && formData.endDate) {
//     const selectedLeaveType = leaveTypesByEmployeeId.find(
//       (type) => type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//     );
    
//     if (selectedLeaveType) {
//       // Pass exclude_leave_id when in edit mode
//       const excludeId = isEditing && editingRequestId ? editingRequestId : undefined;
      
//       calculateLeavePreview({
//         employee_id: formData.employee_id,
//         leave_type_id: selectedLeaveType.id,
//         start_date: formData.startDate.toISOString().split('T')[0],
//         end_date: formData.endDate.toISOString().split('T')[0],
//         is_half_day: isHalfDay,
//         exclude_leave_id: excludeId
//       }).catch((error) => {
//         console.error('Failed to calculate preview:', error);
//       });
//     }
//   }
// };

// const handleViewRequest = async (request: RecentLeaveRequest) => {
//   try {
//     let documents = [];
//     try {
//       const documentsResponse = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       documents = documentsResponse.data;
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 404) {
//         console.log('No documents found for this leave application');
//         documents = [];
//       } else {
//         console.error('Error fetching leave documents:', err);
//       }
//     }
    
//     // Store all documents separately
//     setSelectedRequestDocuments(documents);
    
//     // For backward compatibility, still set the first document on selectedRequest
//     const requestWithFirstDocument = { 
//       ...request,
//       document_url: documents && documents.length > 0 ? documents[0].document_url : undefined,
//       file_name: documents && documents.length > 0 ? documents[0].file_name : undefined,
//       document_id: documents && documents.length > 0 ? documents[0].id : undefined
//     };
    
//     setSelectedRequest(requestWithFirstDocument);
//     setIsViewModalOpen(true);
//   } catch (err) {
//     console.error('Error in handleViewRequest:', err);
//     setSelectedRequest(request);
//     setSelectedRequestDocuments([]);
//     setIsViewModalOpen(true);
//   }
// };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const downloadAttachment = async (documentId: number, fileName: string) => {
//     try {
//       console.log(`📥 Downloading leave attachment: ${fileName} with ID: ${documentId}`);
      
//       // Use the backend endpoint that redirects to S3 presigned URL
//       const downloadUrl = `${API_BASE_URL}/api/v1/leaves/attachments/${documentId}/download`;
      
//       // Open in new tab - this will follow the redirect to the S3 presigned URL
//       window.open(downloadUrl, '_blank');
      
//       showNotification(`Downloading ${fileName}`, 'success');
      
//     } catch (error: any) {
//       console.error('❌ Download error:', error);
//       showNotification(`Failed to download: ${fileName}`, 'error');
//     }
//   };

//   const totalPages = Math.ceil(myRecentLeaveRequests.length / itemsPerPage);
//   const paginatedRequests = myRecentLeaveRequests.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const calculateRemainingDaysStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
//     return calculateLeaveStat(leave);
//   }

//   const setRemainingDaysStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
//     return setLeaveStat(leave);
//   }

//   const calculateMedicalLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
//     return calculateLeaveStat(leave);
//   }

//   const setMedicalLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
//     return setLeaveStat(leave);
//   }

//   const calculateEmergencyLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
//     return calculateLeaveStat(leave);
//   }

//   const setEmergencyLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
//     return setLeaveStat(leave);
//   }   

//   const calculateLeaveStat = (leave: LeaveBalance | undefined) => {
//     return leave?.remaining_days;
//   }

//   const setLeaveStat = (leave: LeaveBalance | undefined) => {
//     return `${leave?.used_days} used / ${leave?.total_days} total`;
//   }
  
//   // Smart pagination functions
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPageButtons = 3;

//     if (totalPages <= maxPageButtons) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       let startPage = Math.max(1, currentPage - 1);
//       let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

//       if (endPage === totalPages) {
//         startPage = Math.max(1, endPage - maxPageButtons + 1);
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
//     }

//     return pageNumbers;
//   };

//   const goToPage = (pageNumber: number) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleWithdrawLeaveRequest = async (requestId: number) => {
//     try {
//       await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/withdraw`, {
//         employee_id: user?.id
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       showNotification('Leave request withdrawn successfully', 'success');
//       setShowCancelConfirm(false);
//       setIsViewModalOpen(false);
//       fetchLeaveData();
//     } catch (err) {
//       console.error('Error withdrawing leave request:', err);
//       showNotification('Failed to withdraw leave request. Please try again.', 'error');
//     }
//   };

//   // Check if the start date has passed
//   const isStartDatePassed = (startDate: string) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to start of day
//     const start = new Date(startDate);
//     start.setHours(0, 0, 0, 0); // Set to start of day
//     return start < today;
//   };

//   return (
//     <div className={`container mx-auto p-3 sm:p-4 lg:p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
//       {/* Notification Toast */}
//       <NotificationToast
//         show={notification.show}
//         message={notification.message}
//         type={notification.type}
//       />
      
//       {/* Header with stats cards */}
//       <div className="flex flex-col">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//             Manage your leave requests and view your leave balance
//           </p>
//           {role !== 'admin' && (
//             <button
//               className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//               onClick={() => setShowRequestModal(true)}
//             >
//               Request Leave
//             </button>
//           )}
//         </div>

//         {/* Leave balance summary */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Annual Leave</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateRemainingDaysStat()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{setRemainingDaysStat()}</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Medical Leave</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateMedicalLeaveStat()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{setMedicalLeaveStat()}</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Emergency Leave</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateEmergencyLeaveStat()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{setEmergencyLeaveStat()}</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <FaRegCalendarCheck className="h-8 w-8 sm:h-10 sm:w-10" />
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Rejected Leaves</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getRejectedLeaves()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{getRejectedLeaves()} request{getRejectedLeaves() !== 1 ? 's' : ''} rejected</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <FaRegHourglass className="h-8 w-8 sm:h-10 sm:w-10" />
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Pending Requests</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getPendingLeaves()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{getPendingLeaves()} request{getPendingLeaves() !== 1 ? 's' : ''} pending</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <LiaUserSlashSolid className="h-8 w-8 sm:h-10 sm:w-10" />
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">On Leave Today</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getOnLeaveToday()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{getOnLeaveToday()} employee{getOnLeaveToday() !== 1 ? 's' : ''}</div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 gap-6 sm:gap-8">
//         {/* Calendar and Recent Requests */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//           {/* Calendar */}
//           <div className={`card shadow-lg lg:col-span-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//             <div className="card-body p-3 sm:p-4 lg:p-6">
//               <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 Leave Calendar
//               </h2>
//               <div className={`p-2 sm:p-4 rounded-lg flex justify-center ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-800'}`}>
//                 <Calendar
//                   date={new Date()}
//                   onChange={() => { }}
//                   className="custom-calendar"
//                   dayContentRenderer={renderDayContents}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Recent Requests */}
//           <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//             <div className="card-body p-3 sm:p-4 lg:p-6">
//               <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <span className="hidden sm:inline">My Recent Requests</span>
//                 <span className="sm:hidden">Recent Requests</span>
//               </h2>
//               <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//                 <table className="table w-full text-sm">
//                   <thead>
//                     <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                       <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Type</th>
//                       <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {myRecentLeaveRequests.slice(0, 4).map((request, index) => (
//                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== myRecentLeaveRequests.slice(0, 4).length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
//                         <td>
//                           <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
//                           <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                             {new Date(request.start_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })}
//                           </div>
//                         </td>
//                         <td>
//                           <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>

//         <LeaveBalanceSummary leaveBalances={leaveBalances} />

//         {/* Leave History */}
//         <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <div className="card-body p-3 sm:p-4 lg:p-6">
//             <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               My Leave History
//             </h2>

//             <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//               <table className="table w-full min-w-full">
//                 <thead>
//                   <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Type</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[140px]`}>Dates</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[80px]`}>Duration</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Reason</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Status</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedRequests.map(request => {
//                     // Calculate duration in days
//                     const duration = Math.ceil(
//                       (new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)
//                     ) + 1;
//                     const canEdit = request.status === 'PENDING';
//                     const canCancel = request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
//                     return (
//                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}`}>
//                         <td>
//                           <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>
//                           <div className="break-words">
//                             {new Date(request.start_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })}
//                           </div>
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>{request.duration} day{request.duration !== 1 ? 's' : ''}</td>
//                         <td>
//                           <div className={`whitespace-normal break-words max-w-xs text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.reason}</div>
//                         </td>
//                         <td>
//                           <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                         </td>
//                         <td className="text-right">
//                           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
//                             {canEdit && (
//                               <button
//                                 className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-slate-600 hover:bg-slate-700' : 'bg-slate-400 hover:bg-slate-500'} text-white border-0`}
//                                 onClick={() => openEditModal(request)}
//                                 type="button"
//                               >
//                                 Edit
//                               </button>
//                             )}
//                             <button
//                               className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//                               onClick={() => handleViewRequest(request)}
//                               type="button"
//                             >
//                               View
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-4 sm:mt-6">
//                 <div className="btn-group flex-wrap gap-1">
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(1)}
//                     disabled={currentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                   >
//                     «
//                   </button>
//                   {getPageNumbers().map(page => (
//                     <button 
//                       key={page}
//                       className={`btn btn-xs sm:btn-sm ${currentPage === page ? 
//                         `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
//                         `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
//                       }`}
//                       onClick={() => goToPage(page)}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                   >
//                     »
//                   </button>
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Leave Request Modal */}
// <dialog
//   id="leave_request_modal"
//   className={`modal ${showRequestModal ? 'modal-open' : ''}`}
// >
//   <div className={`modal-box max-w-4xl p-0 overflow-hidden max-h-[90vh] ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} relative`}>
//     {/* Loading Overlay */}
//     {isSubmitting && (
//       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
//         <div className={`p-6 rounded-lg flex flex-col items-center ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
//           <span className="loading loading-spinner loading-lg text-primary mb-2"></span>
//           <p className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//             {isEditing ? 'Updating leave request...' : 'Submitting leave request...'}
//           </p>
//           <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//             Please wait while we process your request
//           </p>
//         </div>
//       </div>
//     )}
    
//     {/* Modal Header */}
//     <div className={`px-6 py-4 border-b ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
//       <h3 className={`font-bold text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//         </svg>
//         {isEditing ? 'Edit Leave Request' : 'New Leave Request'}
//       </h3>
//       <form method="dialog">
//         <button
//           className={`btn btn-sm btn-circle btn-ghost absolute right-4 top-4 ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
//           onClick={() => {
//             setShowRequestModal(false);
//             setIsEditing(false);
//             setEditingRequestId(null);
//             setEditingRequestAttachment(null);
//             clearPreview(); // Clear preview when modal closes
//             setErrors({
//               type: '',
//               reason: '',
//               startDate: '',
//               endDate: '',
//               attachment: '',
//               employee_id: '',
//               general: ''
//             });
//           }}
//         >✕</button>
//       </form>
//     </div>

//     {/* Modal Content */}
//     <div className={`p-6 overflow-y-auto max-h-[calc(90vh-4rem)] ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Two Column Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column: Form Inputs */}
//           <div className="space-y-6">
//             {/* Leave Type & Reason */}
//             <div className="space-y-6">
//               <div className="form-control">
//                 <label className="label">
//                   <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type</span>
//                   <span className="label-text-alt text-red-500">*</span>
//                 </label>
//                 <select
//                   className={`select select-bordered w-full ${
//                     errors.type 
//                       ? 'border-red-500 focus:border-red-500' 
//                       : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
//                   }`}
//                   id="leave_type"
//                   name="leave_type"
//                   value={formData.type}
//                   onChange={handleLeaveTypeChange}
//                   disabled={isLoading || isSubmitting}
//                 >
//                   <option>Select</option>
//                   {getFilteredLeaveTypes()
//                     .filter(type => type.is_active)
//                     .map((type) => (
//                       <option key={type.id} value={type.leave_type_name.toLowerCase()}>
//                         {type.leave_type_name}
//                       </option>
//                   ))}
//                 </select>
//                 {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Reason</span>
//                   <span className="label-text-alt text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`input input-bordered w-full ${
//                     errors.reason 
//                       ? 'border-red-500 focus:border-red-500' 
//                       : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
//                   }`}
//                   placeholder="Brief reason for leave"
//                   value={formData.reason}
//                   onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//                 {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
//               </div>
//             </div>

//             {/* Date Selection */}
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Start Date</span>
//                     <span className="label-text-alt text-red-500">*</span>
//                   </label>
//                   <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.startDate ? 'border border-red-500' : ''}`}>
//                     <input
//                       type="date"
//                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
//                       value={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => handleDateChange(e.target.value, true)}
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
//                 </div>
                
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>End Date</span>
//                     <span className="label-text-alt text-red-500">*</span>
//                   </label>
//                   <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.endDate ? 'border border-red-500' : ''}`}>
//                     <input
//                       type="date"
//                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
//                       value={formData.endDate ? calculateDateInUTC(formData.endDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => handleDateChange(e.target.value, false)}
//                       min={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : calculateDateInUTC(new Date()).toISOString().split('T')[0]}
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
//                 </div>
//               </div>

//               {/* Balance Warning */}
//               {isDurationExceeded() && (
//                 <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-800'}`}>
//                   <div className="flex items-start gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                     </svg>
//                     <span className="text-red-600 text-sm">
//                       Warning: Your request duration exceeds your remaining leave balance.
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Half Day Toggle - Only show when dates are same */}
//               {formData.startDate && formData.endDate && 
//                calculateDateInUTC(formData.startDate).toISOString().split('T')[0] === calculateDateInUTC(formData.endDate).toISOString().split('T')[0] && (
//                 <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Half Day Leave</h4>
//                       <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         Select if you're taking only half a day off
//                       </p>
//                     </div>
//                     <label className="cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className={`toggle toggle-lg ${formData.isHalfDay ? (theme === 'light' ? 'toggle-primary' : 'toggle-accent') : ''}`}
//                         checked={formData.isHalfDay}
//                         onChange={(e) => {
//                           setFormData({ ...formData, isHalfDay: e.target.checked });
//                           handleHalfDayToggle(e.target.checked);
//                         }}
//                         disabled={isSubmitting}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Documents Section */}
//             <div className="space-y-6">
//               {/* Show existing documents if editing */}
//               {isEditing && editingRequestDocuments && editingRequestDocuments.length > 0 && (
//                 <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Existing Documents</span>
//                   </label>
//                   <ul className="space-y-2">
//                     {editingRequestDocuments.map((doc, idx) => (
//                       <li key={doc.id || idx} className={`flex items-center justify-between p-3 rounded ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
//                         <div className="flex items-center gap-3">
//                           <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
//                           </svg>
//                           <span className={`text-sm truncate max-w-[200px] ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{doc.file_name}</span>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             if (doc.id) {
//                               downloadAttachment(doc.id, doc.file_name || 'attachment');
//                             }
//                           }}
//                           className={`btn btn-xs ${theme === 'light' ? 'btn-outline btn-primary' : 'btn-outline btn-accent'}`}
//                           disabled={isSubmitting}
//                         >
//                           Download
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Attachment Upload */}
//               <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
//                 <label className="label mb-2">
//                   <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                     Supporting Documents
//                     {/* {formData.type && leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase())?.requires_documentation && (
//                       <span className="text-red-500 ml-2">* Required</span>
//                     )}
//                   </span> */}
// {(() => {
//         if (!formData.type || formData.type === 'Select') return null;
        
//         // Clean and normalize the type name
//         const selectedTypeName = formData.type.toLowerCase().trim();
//         const leaveType = leaveTypesByEmployeeId.find(type => 
//           type.leave_type_name.toLowerCase().trim() === selectedTypeName
//         );
        
//         console.log('Selected Type:', selectedTypeName);
//         console.log('Found Leave Type:', leaveType);
//         console.log('Requires Docs:', leaveType?.requires_documentation);
        
//         if (leaveType?.requires_documentation) {
//           return <span className="text-red-500 ml-2">* Required</span>;
//         }
        
//         return null;
//       })()}
//     </span>
//                 </label>
//                 <div className={`${errors.attachment ? 'border border-red-500 rounded-lg p-3' : ''}`}>
//                   <EmployeeDocumentManager
//                     key={documentManagerKey}
//                     employeeId={user?.id || null}
//                     mode={isEditing ? 'add' : 'add'}
//                     documentTypes={[
//                       {
//                         type: 'Medical',
//                         label: 'Attachment',
//                         description: 'Upload medical certificate or supporting document'
//                       }
//                     ]}
//                     moduleName="leave"
//                     onFilesSelected={setSelectedLeaveDocuments}
//                     initialDocuments={selectedLeaveDocuments}
//                     onDocumentDeleted={handleDocumentDeleted}
//                   />
//                 </div>
//                 {errors.attachment && <p className="text-red-500 text-sm mt-2">{errors.attachment}</p>}
//                 <div className="label-text-alt mt-3">
//                   <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                     Supported formats: PDF, JPG, PNG, DOC, DOCX • Max size: 10MB
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* <button 
//   type="button" 
//   onClick={() => triggerPreviewCalculation(formData)}
//   className="btn btn-sm btn-outline"
// >
//   Test Preview
// </button> */}

//           {/* Right Column: Leave Calculation Preview */}
//           <div>
//             {/* Leave Calculation Preview Card */}
//             <div className={`sticky top-0 rounded-lg ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200' : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600'}`}>
//               <div className="p-4 border-b border-blue-200 dark:border-slate-600">
//                 <h4 className={`font-bold text-lg flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Leave Calculation
//                   {isLoadingPreview && (
//                     <div className="loading loading-spinner loading-xs ml-2"></div>
//                   )}
//                 </h4>
//               </div>

//               <div className="p-4">
//                 {/* When preview is loading */}
//                 {isLoadingPreview && (
//                   <div className="space-y-4">
//                     <div className="skeleton h-8 w-full"></div>
//                     <div className="skeleton h-16 w-full"></div>
//                     <div className="skeleton h-24 w-full"></div>
//                   </div>
//                 )}

//                 {/* When there's an error */}
//                 {previewError && !isLoadingPreview && (
//                   <div className={`alert alert-error ${theme === 'light' ? '' : 'bg-red-900/20'}`}>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <span className="text-sm">{previewError}</span>
//                   </div>
//                 )}

//                 {/* When preview data is available */}
//                 {previewData && !isLoadingPreview && !previewError && (
//                   <div className="space-y-6">
//                     {/* Summary Cards */}
//                     <div className="grid grid-cols-2 gap-3">
//                       <div className={`p-3 rounded-lg text-center ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
//                         <div className={`text-xs mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                           Calculated Duration
//                           {formData.isHalfDay && <span className="block text-amber-600">(Half Day)</span>}
//                         </div>
//                         <div className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                           {previewData.calculation?.duration ?? 0} {formData.isHalfDay ? '½' : ''} day{previewData.calculation?.duration !== 1 ? 's' : ''}
//                         </div>
//                       </div>
                      
//                       <div className={`p-3 rounded-lg text-center ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
//                         <div className={`text-xs mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Available Balance</div>
//                         <div className={`text-2xl font-bold ${
//                           previewData.balance?.sufficient 
//                             ? (theme === 'light' ? 'text-green-600' : 'text-green-400') 
//                             : 'text-red-600'
//                         }`}>
//                           {previewData.balance?.available ?? 0}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Status Badge */}
//                     {/* <div className="flex justify-center">
//                       <div className={`badge badge-lg ${previewData.can_proceed ? 'badge-success' : 'badge-error'} gap-2`}>
//                         {previewData.can_proceed ? (
//                           <>
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Ready to Submit
//                           </>
//                         ) : (
//                           <>
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Issues Found
//                           </>
//                         )}
//                       </div>
//                     </div> */}

//                     {/* Breakdown Section */}
//                     {/* {previewData.calculation?.breakdown && (
//                       <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
//                         <h5 className={`font-medium mb-3 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Calculation Breakdown</h5>
//                         <div className="space-y-2">
//                           <div className="flex justify-between">
//                             <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Total Work Days:</span>
//                             <span className="font-semibold">{previewData.calculation.breakdown.total_work_days}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Holidays Excluded:</span>
//                             <span className="font-semibold">{previewData.calculation.breakdown.holidays_excluded}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Actual Working Days:</span>
//                             <span className={`font-semibold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                               {previewData.calculation.breakdown.actual_working_days}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     )} */}

//                     {/* Validation Messages */}
//                     <div className="space-y-2">
//                       {previewData.validation?.has_sufficient_balance === false && (
//                         <div className={`alert alert-warning py-2 ${theme === 'light' ? '' : 'bg-amber-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                           </svg>
//                           <span className="text-xs">Insufficient leave balance</span>
//                         </div>
//                       )}
                      
//                       {previewData.validation?.has_overlapping_leaves && (
//                         <div className={`alert alert-warning py-2 ${theme === 'light' ? '' : 'bg-amber-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                           </svg>
//                           <span className="text-xs">Overlapping leave exists</span>
//                         </div>
//                       )}

//                       {previewData.validation?.requires_documentation && (
//                         <div className={`alert alert-info py-2 ${theme === 'light' ? '' : 'bg-blue-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                           <span className="text-xs">Documentation required</span>
//                         </div>
//                       )}

//                       {previewData.can_proceed && !previewError && (
//                         <div className={`alert alert-success py-2 ${theme === 'light' ? '' : 'bg-green-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           <span className="text-xs">All checks passed! Ready to submit.</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Quick Stats */}
//                     {/* <div className={`text-center pt-4 border-t ${theme === 'light' ? 'border-blue-100' : 'border-slate-600'}`}>
//                       <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         Preview updates automatically as you fill the form
//                       </p>
//                     </div> */}
//                   </div>
//                 )}

//                 {/* Default message when no preview yet */}
//                 {!previewData && !isLoadingPreview && !previewError && (
//                   <div className="text-center py-8">
//                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto mb-3 ${theme === 'light' ? 'text-slate-300' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <h5 className={`font-medium mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Preview Will Appear Here</h5>
//                     <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
//                       Fill in the leave details to see calculation preview
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

          
//         </div>

//         {/* Modal Footer */}
//         <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
//           <button
//             type="button"
//             className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white`}
//             onClick={() => {
//               setShowRequestModal(false);
//               setErrors({
//                 type: '',
//                 reason: '',
//                 startDate: '',
//                 endDate: '',
//                 attachment: '',
//                 employee_id: '',
//                 general: ''
//               });
//               setFormData({
//                 type: '',
//                 startDate: undefined,
//                 endDate: undefined,
//                 reason: '',
//                 attachment: null,
//                 employee_id: undefined,
//                 isHalfDay: false
//               });
//               setIsEditing(false);
//               setEditingRequestId(null);
//               setEditingRequestAttachment(null);
//               setSelectedLeaveDocuments([]);
//               resetLeaveAttachment();
//               clearPreview();
//             }}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 {isEditing ? 'Updating...' : 'Submitting...'}
//               </>
//             ) : (
//               isEditing ? 'Update Request' : 'Submit Request'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
//   <form method="dialog" className="modal-backdrop">
//     <button onClick={() => setShowRequestModal(false)} disabled={isSubmitting}>close</button>
//   </form>
// </dialog>

//       {/* View Leave Request Modal */}
//       <dialog id="view_modal" className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
//         <div className={`modal-box w-full max-w-sm sm:max-w-lg lg:max-w-4xl xl:max-w-5xl p-0 overflow-hidden shadow-lg mx-2 sm:mx-auto h-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           {/* Modal Header */}
//           <div className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
//             <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <span className="truncate">Leave Request Details</span>
//             </h3>
//             <button
//               className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
//               onClick={() => setIsViewModalOpen(false)}
//             >✕</button>
//           </div>

//           {/* Modal Content - Scrollable */}
//           <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto">
//             {selectedRequest && (
//               <div className="space-y-4 sm:space-y-6">
//                 {/* Basic Information */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Status</h4>
//                     <p className="text-sm sm:text-base font-medium">
//                       <span className={`badge ${getBadgeClass(selectedRequest.status)}`}>
//                         {selectedRequest.status}
//                       </span>
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.start_date)}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.end_date)}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Duration</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.duration} day{selectedRequest.duration !== 1 ? 's' : ''}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Applied On</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//                       {convertUTCToSingapore(selectedRequest.created_at)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Reason */}
//                 <div>
//                   <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason</h4>
//                   <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'}`}>
//                     {selectedRequest.reason}
//                   </p>
//                 </div>

//                 {/* Attachment */}
//                 {/* {selectedRequest.document_url && (
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Attachment</h4>
//                     <div className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
//                       <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//                       </svg>
//                       <a
//                         href="#"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           if (selectedRequest.document_id) {
//                             downloadAttachment(selectedRequest.document_id, selectedRequest.file_name || 'attachment');
//                           } else {
//                             showNotification('Document ID not found', 'error');
//                           }
//                         }}
//                         className={`text-xs sm:text-sm font-medium truncate flex items-center gap-2 ${theme === 'light' ? 'text-primary hover:text-primary-focus' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         Download {selectedRequest.file_name}
//                       </a>
//                     </div>
//                   </div>
//                 )} */}
// {selectedRequestDocuments && selectedRequestDocuments.length > 0 && (
//   <div>
//     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
//       Attachments ({selectedRequestDocuments.length})
//     </h4>
//     <div className="space-y-2">
//       {selectedRequestDocuments.map((doc, index) => (
//         <div 
//           key={doc.id || index} 
//           className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//           </svg>
//           <a
//             href="#"
//             onClick={(e) => {
//               e.preventDefault();
//               if (doc.id) {
//                 downloadAttachment(doc.id, doc.file_name || `attachment-${index + 1}`);
//               } else {
//                 showNotification('Document ID not found', 'error');
//               }
//             }}
//             className={`text-xs sm:text-sm font-medium truncate flex items-center gap-2 ${theme === 'light' ? 'text-primary hover:text-primary-focus' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
//             style={{ cursor: 'pointer' }}
//           >
//             Download {doc.file_name || `Attachment ${index + 1}`}
//           </a>
//         </div>
//       ))}
//     </div>
//   </div>
// )}


//                 {/* Approval Information */}
//                 {selectedRequest.status === 'APPROVED' && selectedRequest.approval_comment && (
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Approval Comment</h4>
//                     <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-green-50 text-slate-900 border border-green-200' : 'bg-green-900/20 text-slate-100 border border-green-800'}`}>
//                       {selectedRequest.approval_comment}
//                     </p>
//                   </div>
//                 )}

//                 {/* Rejection Information */}
//                 {selectedRequest.status === 'REJECTED' && (
//                   <div className="p-3 sm:p-4 space-y-3">
//                     <div>
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejected By</h4>
//                       <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//                         {selectedRequest.second_approver_name || selectedRequest.first_approver_name}
//                       </p>
//                     </div>
//                     <div>
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejection Date</h4>
//                       <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//                         {convertUTCToSingapore(selectedRequest.updated_at)}
//                       </p>
//                     </div>
//                     <div>
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason for Rejection</h4>
//                       <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-red-50 text-slate-900 border border-red-200' : 'bg-red-900/20 text-slate-100 border border-red-800'}`}>
//                         {selectedRequest.rejection_reason}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Modal Footer */}
//           <div className={`px-4 sm:px-6 py-2 sm:py-3 border-t flex justify-end gap-2 mt-auto z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
//             {selectedRequest && (selectedRequest.status === 'PENDING' || selectedRequest.status === 'FIRST_APPROVED') && (
//               <button
//                 className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
//                 onClick={() => setShowCancelConfirm(true)}
//               >
//                 Cancel Request
//               </button>
//             )}
//             {selectedRequest && (selectedRequest.status === 'APPROVED') && !isStartDatePassed(selectedRequest.start_date) && (
//               <button
//                 className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
//                 onClick={() => handleWithdrawLeaveRequest(selectedRequest.id)}
//               >
//                 Withdraw Request
//               </button>
//             )}
//             <button
//               className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//               onClick={() => setIsViewModalOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setIsViewModalOpen(false)}>close</button>
//         </form>
//       </dialog>

//       {/* Cancel Confirmation Modal */}
//       <dialog id="cancel_confirm_modal" className={`modal ${showCancelConfirm ? 'modal-open' : ''}`}>
//         <div className={`modal-box ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Confirm Cancellation</h3>
//           <p className={`py-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Are you sure you want to cancel this leave request? This action cannot be undone.</p>
//           <div className="modal-action">
//             <button
//               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
//               onClick={() => setShowCancelConfirm(false)}
//             >
//               No, Keep Request
//             </button>
//             <button
//               className={`btn ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
//               onClick={() => selectedRequest && handleCancelLeave(selectedRequest.id)}
//             >
//               Yes, Cancel Request
//             </button>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setShowCancelConfirm(false)}>close</button>
//         </form>
//       </dialog>
//     </div>
//   )
// }

// export default LeaveOverview



// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { Calendar } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import InfoBoxes from './InfoBoxes';
// import LeaveBalanceSummary from './LeaveBalanceSummary';
// import RecentLeaveRequests from './RecentLeaveRequests';
// import CalendarAndRecentRequests from './CalendarAndRecentRequests';
// import { FaRegCalendarCheck } from "react-icons/fa";
// import { FaRegHourglass } from "react-icons/fa";
// import { LiaUserSlashSolid } from "react-icons/lia";
// import { addDays, eachDayOfInterval, isSameDay } from 'date-fns';
// import { formatInTimeZone,toZonedTime } from 'date-fns-tz';
// import { fileURLToPath } from 'url';
// import EmployeeDocumentManager, { EmployeeDocument } from '../components/EmployeeDocumentManager';
// import { calculateDateInUTC, calculateDuration, getBadgeClass } from '../utils/utils';
// import NotificationToast from '../components/NotificationToast';
// import { useNotification } from '../hooks/useNotification';
// import { useTheme } from '../components/ThemeProvider';
// import ConvertToSingaporeTimeZone from '../components/ConvertToSingaporeTimeZone';
// import {format } from 'date-fns'
// import { useLeavePreview } from '../hooks/useLeavePreview';
// import { employeeApi } from '../utils/test';

//   const extractArrayData = (response: any) => {
//     if (Array.isArray(response)) return response;
//     if (response && response.data && Array.isArray(response.data)) return response.data;
//     if (response && response.success && Array.isArray(response.data)) return response.data;
//     return [];
//   };


// interface RecentLeaveRequest {
//   id: number;
//   employee_id: number;
//   employee_name: string;
//   department_name: string;
//   department_id: number;
//   leave_type_id: number;
//   leave_type_name: string;
//   start_date: string;
//   end_date: string;
//   duration: number;
//   reason: string;
//   status: 'PENDING' | 'FIRST_APPROVED' | 'APPROVED' | 'REJECTED';
//   approver_id?: number;
//   approval_date?: string;
//   approval_comment?: string;
//   rejection_reason?: string;
//   created_at: string;
//   document_url?: string;
//   document_id?: number;
//   file_name?: string;
//   first_approver_name?: string;
//   second_approver_name?: string;
//   updated_at: string;
// }

// interface LeaveRequest {
//   id: string;
//   type: string;
//   startDate: Date;
//   endDate: Date;
//   reason: string;
//   status: 'pending' | 'approved' | 'rejected';
// }

// interface LeaveType {
//   id: number;
//   leave_type_name: string;
//   description: string;
//   max_days: number;
//   is_paid: boolean;
//   is_active: boolean;
//   requires_documentation: boolean;
// }

// interface LeaveBalance {
//   id: number;
//   employee_id: string;
//   leave_type_id: string;
//   leave_type_name: string;
//   year: number;
//   total_days: number;
//   used_days: number;
//   remaining_days: number;
//   accrual_days: number;
//   accrual_remaining_days: number;
//   is_total: boolean;
//   total_type: string;
//   is_divident: boolean;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   company_id: number;
//   department_id: number;
//   gender?: string;
// }

// interface FormData {
//   type: string;
//   startDate: Date | undefined;
//   endDate: Date | undefined;
//   reason: string;
//   attachment: File | null;
//   employee_id: number | undefined;
//   isHalfDay: boolean;
// }

// interface FormErrors {
//   type: string;
//   reason: string;
//   startDate: string;
//   endDate: string;
//   attachment: string;
//   employee_id: string;
//   general: string;
// }

// // Alternative helper function for UTC to Singapore timezone conversion
// const convertUTCToSingapore = (utcDateString: string, formatStr: string = 'dd MMM yyyy hh:mm a'): string => {
//   try {
//     // Parse the UTC date string manually
//     let utcDate: Date;
    
//     if (utcDateString.includes('T')) {
//       // Already in ISO format
//       utcDate = new Date(utcDateString);
//     } else {
//       // Convert "YYYY-MM-DD HH:mm:ss" to ISO format
//       const isoString = utcDateString.replace(' ', 'T') + '.000Z';
//       utcDate = new Date(isoString);
//     }
    
//     // If date is invalid, try parsing differently
//     if (isNaN(utcDate.getTime())) {
//       utcDate = new Date(utcDateString);
//     }
    
//     // Manually add 8 hours for Singapore timezone (GMT+8)
//     const singaporeTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
    
//     // Format the result
//     return format(singaporeTime, formatStr);
//   } catch (error) {
//     console.error('Error in convertUTCToSingapore:', error);
//     return 'Invalid date';
//   }
// };

// const LeaveOverview = () => {
//   const { theme } = useTheme();
//   const { notification, showNotification } = useNotification();
//   const [requests, setRequests] = useState<LeaveRequest[]>([]);

//   const [formData, setFormData] = useState<FormData>({
//   type: '',
//   startDate: undefined,
//   endDate: undefined,
//   reason: '',
//   attachment: null,
//   employee_id: undefined,
//   isHalfDay: false
// });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
//   const [leaveTypesByEmployeeId, setLeaveTypesByEmployeeId] = useState<LeaveType[]>([]);
//   const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [recentLeaveRequests, setRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
//   const [myRecentLeaveRequests, setMyRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
//   const [allRecentLeaveRequests, setAllRecentLeaveRequests] = useState<RecentLeaveRequest[]>([]);
//   const [role, setRole] = useState<string>('');
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string>('');
//   // const [errors, setErrors] = useState<FormErrors>({
//   //   type: '',
//   //   reason: '',
//   //   startDate: '',
//   //   endDate: '',
//   //   attachment: ''
//   // });

//   const [errors, setErrors] = useState<FormErrors>({
//   type: '',
//   reason: '',
//   startDate: '',
//   endDate: '',
//   attachment: '',
//   employee_id: '',
//   general: ''
// });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
//   const [editingRequestAttachment, setEditingRequestAttachment] = useState<{ url: string, name: string } | null>(null);
//   const [selectedLeaveDocuments, setSelectedLeaveDocuments] = useState<any[]>([]);
//   const [editingRequestDocuments, setEditingRequestDocuments] = useState<any[]>([]);
//   const [documentManagerKey, setDocumentManagerKey] = useState(0);
//   const [showAllLeaveHistory, setShowAllLeaveHistory] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<RecentLeaveRequest | null>(null);
//   const [showCancelConfirm, setShowCancelConfirm] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [selectedRequestDocuments, setSelectedRequestDocuments] = useState<any[]>([]);
//   const { 
//       previewData, 
//       isLoadingPreview, 
//       previewError, 
//       calculateLeavePreview, 
//       clearPreview 
//     } = useLeavePreview();

//   useEffect(() => {
//     // Get user role from localStorage
//     const userRole = localStorage.getItem('hrms_role');
//     if (userRole) {
//       setRole(userRole);
//     }

//     const token = localStorage.getItem('hrms_token');
//     if (token) {
//       setToken(token);
//     }

//     // Get user data from localStorage
//     const userData = localStorage.getItem('hrms_user');
//     if (userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//       } catch (err) {
//         console.error('Error parsing user data:', err);
//       }
//     }
//   }, []);

// // Filter leave types based on user gender
// const getFilteredLeaveTypes = () => {
//   // Don't apply gender filtering for admin users
//   if (user?.role?.toLowerCase() === 'admin') {
//     return leaveTypesByEmployeeId; // Use leaveTypesByEmployeeId
//   }

//   // Get gender from localStorage
//   const userFromStorage = localStorage.getItem('hrms_user');
//   if (!userFromStorage) return leaveTypesByEmployeeId;
  
//   try {
//     const parsedUser = JSON.parse(userFromStorage);
//     const gender = parsedUser?.gender;
    
//     if (!gender) return leaveTypesByEmployeeId;

//     return (leaveTypesByEmployeeId || []).filter(type => {
//       const leaveTypeName = type.leave_type_name.toLowerCase();
      
//       // Hide paternity leave for non-male users
//       if (leaveTypeName.includes('paternity') && gender !== 'Male') {
//         return false;
//       }
      
//       // Hide maternity leave for non-female users
//       if (leaveTypeName.includes('maternity') && gender !== 'Female') {
//         return false;
//       }
      
//       // If gender is 'Other', hide both paternity and maternity
//       if (gender === 'Other' && 
//           (leaveTypeName.includes('paternity') || leaveTypeName.includes('maternity'))) {
//         return false;
//       }
      
//       return true;
//     });
//   } catch (error) {
//     console.error('Error parsing user from localStorage:', error);
//     return leaveTypesByEmployeeId;
//   }
// };

//   // Filter leave types based on user gender
//   const getFilteredLeaveTypes0812 = () => {
//     // Don't apply gender filtering for admin users
//     if (user?.role?.toLowerCase() === 'admin') {
//       return leaveTypesByEmployeeId;
//     }

//     // Get gender from localStorage
//     const userFromStorage = localStorage.getItem('hrms_user');
//     if (!userFromStorage) return leaveTypesByEmployeeId;
    
//     try {
//       const parsedUser = JSON.parse(userFromStorage);
//       const gender = parsedUser?.gender;
      
//       if (!gender) return leaveTypesByEmployeeId;

//       return (leaveTypesByEmployeeId || []).filter(type => {
//         const leaveTypeName = type.leave_type_name.toLowerCase();
        
//         // Hide paternity leave for non-male users
//         if (leaveTypeName.includes('paternity') && gender !== 'Male') {
//           return false;
//         }
        
//         // Hide maternity leave for non-female users
//         if (leaveTypeName.includes('maternity') && gender !== 'Female') {
//           return false;
//         }
        
//         // If gender is 'Other', hide both paternity and maternity
//         if (gender === 'Other' && 
//             (leaveTypeName.includes('paternity') || leaveTypeName.includes('maternity'))) {
//           return false;
//         }
        
//         return true;
//       });
//     } catch (error) {
//       console.error('Error parsing user from localStorage:', error);
//       return leaveTypesByEmployeeId;
//     }
//   };

//   const fetchLeaveData = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       if (!user?.id) {
//         console.error('No user ID available');
//         return;
//       }

//       const [typesResponse, balancesResponse, recentLeavesResponse, myRecentLeavesResponse, leaveTypesByEmployeeResponse] = await Promise.all([
//         axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leaves/balance`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id,
//             year: new Date().getFullYear()
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id
//           }
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: {
//             employeeId: user.id
//           }
//         })
//       ]);
//       setLeaveTypes(extractArrayData(typesResponse.data));
//       setLeaveTypesByEmployeeId(extractArrayData(leaveTypesByEmployeeResponse.data));
//       console.log(balancesResponse.data);
//       setLeaveBalances(extractArrayData(balancesResponse.data));
//       const recentLeavesData = extractArrayData(recentLeavesResponse.data);
//       setRecentLeaveRequests(recentLeavesData.filter((request: RecentLeaveRequest) => request.employee_id.toString() !== user?.id.toString()));
//       setMyRecentLeaveRequests(recentLeavesData.filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString()));
//       setAllRecentLeaveRequests(recentLeavesData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//       console.error('Error fetching leave data:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user?.id]);

//   // Fetch leave types and balances
//   useEffect(() => {
//     if (user?.id) {
//       fetchLeaveData();

//        setFormData(prev => ({
//       ...prev,
//       employee_id: user.id
//     }));
//     }
//   }, [user?.id, fetchLeaveData]);

// const openEditModal0112 = async (request: RecentLeaveRequest) => {
//   setFormData({
//     type: request.leave_type_name.toLowerCase(),
//     startDate: new Date(request.start_date),
//     endDate: new Date(request.end_date),
//     reason: request.reason,
//     attachment: null,
//     employee_id: request.employee_id, // Add this
//     isHalfDay: request.duration === 0.5
//   });
//   setIsEditing(true);
//   setEditingRequestId(request.id);
//   setShowRequestModal(true);
//   clearPreview();
  
  
//   // Fetch all documents for this leave application
//   try {
//     const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//       }
//     });
//     const documents = res.data;
//     setEditingRequestDocuments(documents);
    
//     // If the request has an attachment, set it for download
//     if (documents && documents.length > 0) {
//       const firstDocument = documents[0];
//       setEditingRequestAttachment({ 
//         url: firstDocument.document_url, 
//         name: firstDocument.file_name 
//       });
//     } else {
//       setEditingRequestAttachment(null);
//     }
//   } catch (err) {
//     console.error('Error fetching documents for editing:', err);
//     setEditingRequestDocuments([]);
//     setEditingRequestAttachment(null);
//   }
// };

// const openEditModal = async (request: RecentLeaveRequest) => {
//   // First, clear any existing preview
//   clearPreview();
  
//   const formDataForEdit = {
//     type: request.leave_type_name.toLowerCase(),
//     startDate: new Date(request.start_date),
//     endDate: new Date(request.end_date),
//     reason: request.reason,
//     attachment: null,
//     employee_id: request.employee_id,
//     isHalfDay: request.duration === 0.5
//   };

//   setFormData(formDataForEdit);
//   setIsEditing(true);
//   setEditingRequestId(request.id);
//   setShowRequestModal(true);
  
//   // Find the selected leave type
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === formDataForEdit.type.toLowerCase()
//   );
  
//   if (selectedType) {
//     try {
//       // Trigger preview calculation WITH exclude_leave_id parameter
//       await calculateLeavePreview({
//         employee_id: formDataForEdit.employee_id,
//         leave_type_id: selectedType.id,
//         start_date: calculateDateInUTC(formDataForEdit.startDate).toISOString().split('T')[0],
//         end_date: calculateDateInUTC(formDataForEdit.endDate).toISOString().split('T')[0],
//         is_half_day: formDataForEdit.isHalfDay,
//         exclude_leave_id: request.id // Pass the current leave ID to exclude
//       });
//     } catch (error) {
//       console.error('Failed to calculate preview for edit:', error);
//     }
//   }

//   // Fetch all documents for this leave application
//   try {
//     const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//       }
//     });
//     const documents = res.data;
//     setEditingRequestDocuments(documents);
    
//     // If the request has an attachment, set it for download
//     if (documents && documents.length > 0) {
//       const firstDocument = documents[0];
//       setEditingRequestAttachment({ 
//         url: firstDocument.document_url, 
//         name: firstDocument.file_name 
//       });
//     } else {
//       setEditingRequestAttachment(null);
//     }
//   } catch (err) {
//     console.error('Error fetching documents for editing:', err);
//     setEditingRequestDocuments([]);
//     setEditingRequestAttachment(null);
//   }
// };

// const handleSubmit0112 = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (isSubmitting) return; // Prevent multiple submissions
  
//   if (validateForm()) {
//     setIsSubmitting(true); // Start loading
    
//     const startDate = new Date(Date.UTC(
//       formData.startDate!.getFullYear(),
//       formData.startDate!.getMonth(),
//       formData.startDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     const endDate = new Date(Date.UTC(
//       formData.endDate!.getFullYear(),
//       formData.endDate!.getMonth(),
//       formData.endDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     try {
//       const selectedType = leaveTypes.find(type => 
//         type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//       );
      
//       if (!selectedType) {
//         throw new Error('Invalid leave type');
//       }

//       console.log('🔄 LEAVE SUBMISSION PROCESS STARTED');

//       // Step 1: Create/Update leave application first (without files)
//       const leaveData = {
//         employee_id: user?.id?.toString() || '',
//         leave_type_id: selectedType.id.toString(),
//         start_date: startDate,
//         end_date: endDate,
//         reason: formData.reason,
//         is_half_day: formData.isHalfDay ? "1" : "0"
//       };

//       console.log('📝 Creating/Updating leave application:', leaveData);

//       let leaveResponse;
//       const leaveId = isEditing ? editingRequestId : null;

//       if (isEditing && editingRequestId) {
//         // Update existing leave
//         leaveResponse = await axios.put(
//           `${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application updated:', editingRequestId);
//       } else {
//         // Create new leave
//         leaveResponse = await axios.post(
//           `${API_BASE_URL}/api/v1/leaves`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application created');
//       }

//       // 🔴 FIX: Get the leave ID properly
//       const finalLeaveId = isEditing ? editingRequestId : leaveResponse.data.leaveId;
//       console.log('🎯 Leave ID for document upload:', finalLeaveId);

//       if (!finalLeaveId) {
//         throw new Error('Could not determine leave ID');
//       }

//       // Step 2: Upload files separately if any
//       const hasDocuments = selectedLeaveDocuments.length > 0 || formData.attachment;
      
//       if (hasDocuments) {
//         console.log('📎 Starting document upload process...');
        
//         const uploadFormData = new FormData();
        
//         // 🔴 FIX: Ensure uploaded_by is always a string
//         const uploaded_by = (user?.id?.toString() || '');
//         if (!uploaded_by) {
//           throw new Error('Could not determine user ID for upload');
//         }
        
//         uploadFormData.append('uploaded_by', uploaded_by);
        
//         // Add files to FormData - Use 'attachments' field name
//         if (selectedLeaveDocuments.length > 0) {
//           selectedLeaveDocuments.forEach((doc, idx) => {
//             if (doc.file) {
//               console.log(`📎 Appending file to FormData: ${doc.file.name}`);
//               uploadFormData.append('attachments', doc.file);
//             }
//           });
//         } else if (formData.attachment) {
//           console.log(`📎 Appending single file to FormData: ${formData.attachment.name}`);
//           uploadFormData.append('attachments', formData.attachment);
//         }

//         // Debug FormData contents
//         console.log('📤 FormData contents for upload:');
//         for (let [key, value] of (uploadFormData as any).entries()) {
//           if (value instanceof File) {
//             console.log(`📁 ${key}:`, value.name, value.size, value.type);
//           } else {
//             console.log(`📝 ${key}:`, value);
//           }
//         }

//         try {
//           // Upload files to the separate endpoint
//           const uploadResponse = await axios.post(
//             `${API_BASE_URL}/api/v1/leaves/${finalLeaveId}/documents`,
//             uploadFormData,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//                 'Content-Type': 'multipart/form-data'
//               },
//               // Add timeout and progress for large files
//               timeout: 60000, // 60 seconds timeout
//               onUploadProgress: (progressEvent) => {
//                 const percentCompleted = Math.round(
//                   (progressEvent.loaded * 100) / (progressEvent.total || 1)
//                 );
//                 console.log(`📤 Upload Progress: ${percentCompleted}%`);
//                 // You can also update a progress state here if you want to show progress bar
//               }
//             }
//           );
          
//           console.log('✅ Documents uploaded successfully:', uploadResponse.data);
//         } catch (uploadError) {
//           console.error('❌ Document upload failed:', uploadError);
//           // Don't fail the entire request if document upload fails
//           showNotification('Leave created but document upload failed', 'error');
//         }
//       } else {
//         console.log('📭 No documents to upload');
//       }

//       // Success
//       console.log('🎉 Leave submission completed successfully');
//       showNotification(
//         isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 
//         'success'
//       );
      
//       // Reset form
//       setFormData({
//         type: '',
//         startDate: undefined,
//         endDate: undefined,
//         reason: '',
//         attachment: null,
//         employee_id: undefined,
//         isHalfDay: false
//       });
//       resetLeaveAttachment();
//       setShowRequestModal(false);
//       setIsEditing(false);
//       setEditingRequestId(null);
//       setEditingRequestAttachment(null);
//       fetchLeaveData();

//     } catch (err) {
//       console.error('❌ LEAVE SUBMISSION ERROR:', err);
//       if (axios.isAxiosError(err)) {
//         console.error('❌ Axios error details:', {
//           status: err.response?.status,
//           data: err.response?.data,
//           message: err.response?.data?.message,
//           error: err.response?.data?.error
//         });
        
//         const errorMessage = err.response?.data?.message || 
//                            err.response?.data?.error || 
//                            'Failed to submit leave request. Please try again.';
//         showNotification(errorMessage, 'error');
//       } else {
//         console.error('❌ Non-Axios error:', err);
//         showNotification('Failed to submit leave request. Please try again.', 'error');
//       }
//     } finally {
//       setIsSubmitting(false); // End loading regardless of success/error
//     }
//   }
// };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (isSubmitting) return; // Prevent multiple submissions
  
//   // Use preview data for validation if available
//   if (previewData && previewData.can_proceed === false) {
//     setErrors(prev => ({
//       ...prev,
//       general: 'Cannot submit leave due to validation issues. Please check the preview details.'
//     }));
//     showNotification('Cannot submit leave due to validation issues. Please check the preview details.', 'error');
//     return;
//   }

//   if (validateForm()) {
//     setIsSubmitting(true); // Start loading
    
//     const startDate = new Date(Date.UTC(
//       formData.startDate!.getFullYear(),
//       formData.startDate!.getMonth(),
//       formData.startDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     const endDate = new Date(Date.UTC(
//       formData.endDate!.getFullYear(),
//       formData.endDate!.getMonth(),
//       formData.endDate!.getDate())
//     ).toISOString().split('T')[0];
    
//     try {
//       const selectedType = leaveTypesByEmployeeId.find(type => 
//         type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//       );
      
//       if (!selectedType) {
//         throw new Error('Invalid leave type');
//       }

//       console.log('🔄 LEAVE SUBMISSION PROCESS STARTED');

//       // Step 1: Create/Update leave application first (without files)
//       const leaveData = {
//         employee_id: formData.employee_id?.toString() || user?.id?.toString() || '',
//         leave_type_id: selectedType.id.toString(),
//         start_date: startDate,
//         end_date: endDate,
//         reason: formData.reason,
//         is_half_day: formData.isHalfDay
//       };

//       console.log('📝 Creating/Updating leave application:', leaveData);

//       let leaveResponse;
//       const leaveId = isEditing ? editingRequestId : null;

//       if (isEditing && editingRequestId) {
//         // Update existing leave
//         leaveResponse = await axios.put(
//           `${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application updated:', editingRequestId);
//         console.log('📋 Update Response:', leaveResponse.data);
//       } else {
//         // Create new leave
//         leaveResponse = await axios.post(
//           `${API_BASE_URL}/api/v1/leaves`, 
//           leaveData, 
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('✅ Leave application created');
//         console.log('📋 Create Response:', leaveResponse.data);
//         console.log('📋 Response keys:', Object.keys(leaveResponse.data));
//       }

//       // Get the leave ID properly - check multiple possible response formats
//       let finalLeaveId;
//       const responseData = leaveResponse.data;
      
//       if (isEditing && editingRequestId) {
//         finalLeaveId = editingRequestId;
//       } else {
//         // Try different possible field names for the leave ID
//         finalLeaveId = responseData.id || 
//                       responseData.leaveId || 
//                       responseData.leave_id || 
//                       responseData.data?.id || 
//                       responseData.data?.leaveId;
        
//         console.log('🎯 Extracted Leave ID:', finalLeaveId);
//         console.log('🎯 Full response for debugging:', responseData);
        
//         // If we still can't find it, check the data property
//         if (!finalLeaveId && responseData.data) {
//           console.log('🔍 Checking data property:', responseData.data);
//           finalLeaveId = responseData.data.id || responseData.data.leaveId;
//         }
//       }

//       if (!finalLeaveId) {
//         console.error('❌ Could not find leave ID in response:', responseData);
//         throw new Error('Could not determine leave ID from server response');
//       }

//       console.log('🎯 Final Leave ID for document upload:', finalLeaveId);

//       // Step 2: Upload files separately if any
//       const hasDocuments = selectedLeaveDocuments.length > 0 || formData.attachment;
      
//       if (hasDocuments) {
//         console.log('📎 Starting document upload process...');
        
//         const uploadFormData = new FormData();
        
//         // Ensure uploaded_by is always a string
//         const uploaded_by = (user?.id?.toString() || formData.employee_id?.toString() || '');
//         if (!uploaded_by) {
//           throw new Error('Could not determine user ID for upload');
//         }
        
//         uploadFormData.append('uploaded_by', uploaded_by);
        
//         // Add files to FormData - Use 'attachments' field name
//         if (selectedLeaveDocuments.length > 0) {
//           selectedLeaveDocuments.forEach((doc, idx) => {
//             if (doc.file) {
//               console.log(`📎 Appending file to FormData: ${doc.file.name}`);
//               uploadFormData.append('attachments', doc.file);
//             }
//           });
//         } else if (formData.attachment) {
//           console.log(`📎 Appending single file to FormData: ${formData.attachment.name}`);
//           uploadFormData.append('attachments', formData.attachment);
//         }

//         try {
//           // Upload files to the separate endpoint
//           const uploadResponse = await axios.post(
//             `${API_BASE_URL}/api/v1/leaves/${finalLeaveId}/documents`,
//             uploadFormData,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//                 'Content-Type': 'multipart/form-data'
//               },
//               timeout: 60000,
//               onUploadProgress: (progressEvent) => {
//                 const percentCompleted = Math.round(
//                   (progressEvent.loaded * 100) / (progressEvent.total || 1)
//                 );
//                 console.log(`📤 Upload Progress: ${percentCompleted}%`);
//               }
//             }
//           );
          
//           console.log('✅ Documents uploaded successfully:', uploadResponse.data);
//         } catch (uploadError) {
//           console.error('❌ Document upload failed:', uploadError);
//           // Don't fail the entire request if document upload fails
//           showNotification('Leave created but document upload failed', 'error');
//         }
//       } else {
//         console.log('📭 No documents to upload');
//       }

//       // Success
//       console.log('🎉 Leave submission completed successfully');
//       showNotification(
//         isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 
//         'success'
//       );
      
//       // Reset form and preview
//       setFormData({
//         type: '',
//         startDate: undefined,
//         endDate: undefined,
//         reason: '',
//         attachment: null,
//         employee_id: undefined,
//         isHalfDay: false
//       });
//       resetLeaveAttachment();
//       clearPreview(); // Clear preview data
//       setShowRequestModal(false);
//       setIsEditing(false);
//       setEditingRequestId(null);
//       setEditingRequestAttachment(null);
//       fetchLeaveData();

//     //} catch (err) {
//       // console.error('❌ LEAVE SUBMISSION ERROR:', err);
//       // if (axios.isAxiosError(err)) {
//       //   console.error('❌ Axios error details:', {
//       //     status: err.response?.status,
//       //     data: err.response?.data,
//       //     message: err.response?.data?.message,
//       //     error: err.response?.data?.error
//       //   });
        
//       //   const errorMessage = err.response?.data?.message || 
//       //                      err.response?.data?.error || 
//       //                      'Failed to submit leave request. Please try again.';
//       //   showNotification(errorMessage, 'error');
//       // } else {
//       //   console.error('❌ Non-Axios error:', err);
//       //   showNotification('Failed to submit leave request. Please try again.', 'error');
//       // }.
//       } catch (updateError) {
//       if (axios.isAxiosError(updateError) && updateError.response?.status === 400) {
//             const errorMessage = updateError.response?.data?.error || 'Failed to update leave request';
            
//             // Check for specific error messages
//             if (errorMessage.includes('No working days found') || 
//                 errorMessage.includes('contains only weekends')) {
//               showNotification(
//                 `Cannot update leave: ${errorMessage}. Please select dates that include weekdays.`,
//                 'error'
//               );
//               return;
//             } else {
//               showNotification(errorMessage, 'error');
//             }
//                       } else {
//             throw updateError;
//           }
//     } finally {
//       setIsSubmitting(false); // End loading regardless of success/error
//     }
//   }
// };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setFormData({ ...formData, attachment: file });
//   };

//   // Add function to check for conflicting dates
//   const hasDateConflict = (startDate: Date, endDate: Date): boolean => {
//     // Get all approved and pending leave requests
//     const existingRequests = myRecentLeaveRequests.filter(
//       request => {
//         // When editing, exclude the current request from conflict check
//         if (isEditing && editingRequestId === request.id) {
//           return false;
//         }
//         return request.status === 'APPROVED' || request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
//       }
//     );

//     // Check each existing request for overlap
//     return existingRequests.some(request => {
//       const requestStart = calculateDateInUTC(new Date(request.start_date));
//       const requestEnd = calculateDateInUTC(new Date(request.end_date));
//       const checkStart = calculateDateInUTC(startDate);
//       const checkEnd = calculateDateInUTC(endDate);
      
//       // Check if the new date range overlaps with any existing request
//       return (
//         (checkStart <= requestEnd && checkEnd >= requestStart) || // New request overlaps with existing request
//         (checkStart >= requestStart && checkStart <= requestEnd) || // New start date falls within existing request
//         (checkEnd >= requestStart && checkEnd <= requestEnd) // New end date falls within existing request
//       );
//     });
//   };

//   // Update handleDateChange to check for conflicts
//   const handleDateChange = (value: string, isStartDate: boolean) => {
//     const date = new Date(value);
//     const newFormData = { ...formData };
    
//     if (isStartDate) {
//       newFormData.startDate = date;
//     } else {
//       newFormData.endDate = date;
//     }

//     // Reset isHalfDay if dates don't match
//     if (newFormData.startDate && newFormData.endDate && 
//         calculateDateInUTC(newFormData.startDate).toISOString().split('T')[0] !== calculateDateInUTC(newFormData.endDate).toISOString().split('T')[0]) {
//       newFormData.isHalfDay = false;
//     }

//     // Get emergency leave type and balance
//     const emergencyLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'emergency leave');
//     const emergencyBalance = emergencyLeave ? leaveBalances.find(b => b.leave_type_id === emergencyLeave.id.toString()) : null;
//     const hasEmergencyLeaveRemaining = emergencyBalance && emergencyBalance.remaining_days > 0;

//     // Get unpaid leave type
//     const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');

//     // Check if current type is emergency leave and has 0 remaining days
//     if (formData.type.toLowerCase() === 'emergency leave' && emergencyBalance && emergencyBalance.remaining_days === 0) {
//       if (unpaidLeave) {
//         newFormData.type = 'unpaid leave';
//         showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
//         setFormData(newFormData);
//         return;
//       }
//     }

//     // Check if annual leave and within 5 days
//     if (formData.type.toLowerCase() === 'annual leave' && isLessThan5Days(date)) {
//       if (!hasEmergencyLeaveRemaining) {
//         // If no emergency leave remaining, convert to unpaid leave
//         if (unpaidLeave) {
//           newFormData.type = 'unpaid leave';
//           showNotification('Leave type changed to Unpaid Leave as you have no remaining Emergency Leave days', 'error');
//         }
//       } else {
//         // Convert to emergency leave if there are remaining days
//         newFormData.type = 'emergency leave';
//         showNotification('Leave type changed to Emergency Leave as the date is less than 5 days from today', 'error');
//       }
//     }

//     // Check for date conflicts
//     if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
//       showNotification('This date range conflicts with an existing leave request', 'error');
//       return;
//     }

//     setFormData(newFormData);
//       // Pass exclude_leave_id when in edit mode
//     if (isEditing && editingRequestId) {
//       triggerPreviewCalculation(newFormData, editingRequestId);
//     } else {
//       triggerPreviewCalculation(newFormData);
//     }
//   //triggerPreviewCalculation(newFormData);
//   };

// const triggerPreviewCalculation0112 = async (formDataToCheck: typeof formData) => {
//   // Check each required field individually with type safety
//   const missingFields = [];
  
//   if (!formDataToCheck.startDate) missingFields.push('startDate');
//   if (!formDataToCheck.endDate) missingFields.push('endDate');
//   if (!formDataToCheck.type) missingFields.push('type');
//   if (!formDataToCheck.employee_id) missingFields.push('employee_id');
  
//   // Log missing fields if any
//   if (missingFields.length > 0) {
//     console.log(`Missing or empty fields: ${missingFields.join(', ')}`);
//     return; // Not enough data yet
//   }

//   // At this point, TypeScript knows these values exist, but we need to assert them
//   const employeeId = formDataToCheck.employee_id!;
//   const startDate = formDataToCheck.startDate!;
//   const endDate = formDataToCheck.endDate!;
//   const leaveType = formDataToCheck.type!;
  
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === leaveType.toLowerCase()
//   );
  
//   if (!selectedType) {
//     console.log('No matching leave type found for:', leaveType);
//     return;
//   }

//   try {
//     await calculateLeavePreview({
//       employee_id: employeeId, // Now guaranteed to be a number
//       leave_type_id: selectedType.id,
//       start_date: calculateDateInUTC(startDate).toISOString().split('T')[0], // Now guaranteed to be a Date
//       end_date: calculateDateInUTC(endDate).toISOString().split('T')[0], // Now guaranteed to be a Date
//       is_half_day: formDataToCheck.isHalfDay
//     });
//   } catch (error) {
//     console.error('Failed to calculate preview:', error);
//   }
// };

// // In your LeaveOverview component
// const triggerPreviewCalculation = async (formDataToCheck: typeof formData, excludeLeaveId?: number) => {
//   // Check each required field individually with type safety
//   const missingFields = [];
  
//   if (!formDataToCheck.startDate) missingFields.push('startDate');
//   if (!formDataToCheck.endDate) missingFields.push('endDate');
//   if (!formDataToCheck.type) missingFields.push('type');
  
//   // Get employee_id from user if not in formData
//   const employeeId = formDataToCheck.employee_id || user?.id;
//   if (!employeeId) missingFields.push('employee_id');
  
//   // Log missing fields if any
//   if (missingFields.length > 0) {
//     console.log(`Missing or empty fields: ${missingFields.join(', ')}`);
//     return; // Not enough data yet
//   }

//   // At this point, TypeScript knows these values exist
//   const startDate = formDataToCheck.startDate!;
//   const endDate = formDataToCheck.endDate!;
//   const leaveType = formDataToCheck.type!;
  
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === leaveType.toLowerCase()
//   );
  
//   if (!selectedType) {
//     console.log('No matching leave type found for:', leaveType);
//     return;
//   }

//   try {
//     await calculateLeavePreview({
//       employee_id: employeeId!,
//       leave_type_id: selectedType.id,
//       start_date: calculateDateInUTC(startDate).toISOString().split('T')[0],
//       end_date: calculateDateInUTC(endDate).toISOString().split('T')[0],
//       is_half_day: formDataToCheck.isHalfDay,
//       exclude_leave_id: excludeLeaveId // Pass the exclude parameter
//     });
//   } catch (error) {
//     console.error('Failed to calculate preview:', error);
//   }
// };

//   // Update validateForm to include date conflict check
//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { 
//       type: '',
//       reason: '',
//       startDate: '',
//       endDate: '',
//       attachment: '',
//       employee_id: '',
//       general: ''
//     };

//     if (!formData.type || formData.type === 'Select') {
//       newErrors.type = 'Please select a leave type';
//       isValid = false;
//     }

//     if (!formData.reason.trim()) {
//       newErrors.reason = 'Please provide a reason for your leave request';
//       isValid = false;
//     }

//     if (!formData.startDate) {
//       newErrors.startDate = 'Please select a start date';
//       isValid = false;
//     }

//     if (!formData.endDate) {
//       newErrors.endDate = 'Please select an end date';
//       isValid = false;
//     }

//     if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
//       newErrors.endDate = 'End date cannot be before start date';
//       isValid = false;
//     }

//     // Check for date conflicts
//     if (formData.startDate && formData.endDate && hasDateConflict(formData.startDate, formData.endDate)) {
//       newErrors.startDate = 'This date range conflicts with an existing leave request';
//       isValid = false;
//     }

//     // Check if documentation is required based on leave type
//     const selectedLeaveType = leaveTypesByEmployeeId.find(type => 
//       type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//     );

//     if (selectedLeaveType?.requires_documentation && 
//         !formData.attachment && 
//         (!selectedLeaveDocuments || selectedLeaveDocuments.length === 0)) {
//       // Skip attachment validation if editing and documents already exist
//       if (!(isEditing && editingRequestDocuments && editingRequestDocuments.length > 0)) {
//         newErrors.attachment = 'Please provide an attachment for your leave request';
//         isValid = false;
//       }
//     }

//     // Check if request duration exceeds remaining balance
//     if (formData.type !== 'unpaid leave') {
//       const requestDuration = getRequestDuration();
//       const remainingDays = getRemainingDays();
//       if (requestDuration > remainingDays) {
//         const message = `Request duration (${requestDuration} days) exceeds remaining balance (${remainingDays} days)`;
//         showNotification(message, 'error');
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Get remaining days for selected leave type
//   const getRemainingDays_0812 = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType) return 0;

//     const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
//     let remainingDays = 0;
//     if (balance?.is_total) {
//       remainingDays = balance?.remaining_days ?? 0;
//     } else if (balance?.is_divident) {
//       remainingDays = balance?.accrual_remaining_days ?? 0;
//     } else {
//       remainingDays = balance?.remaining_days ?? 0;
//     }

//     // If remaining days is 0, convert to unpaid leave
//     if (remainingDays === 0 && selectedType.leave_type_name.toLowerCase() !== 'unpaid leave') {
//       const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
//       if (unpaidLeave) {
//         setFormData({ ...formData, type: 'unpaid leave' });
//         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
//       }
//     }

//     return remainingDays;
//   };

//   // Get remaining days for selected leave type
// const getRemainingDays = () => {
//   if (!formData.type || formData.type === 'Select') return 0;
  
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//   );
  
//   if (!selectedType) return 0;

//   // Find the balance using leave_type_name instead of ID
//   const balance = leaveBalances.find(b => 
//     b.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//   );
  
//   if (!balance) {
//     // If no balance found, it might be unpaid leave or a type without balance
//     return formData.type.toLowerCase() === 'unpaid leave' ? 999 : 0;
//   }

//   // Calculate remaining days based on balance type
//   let remainingDays = 0;
//   if (balance.is_total) {
//     remainingDays = balance.remaining_days ?? 0;
//   } else if (balance.is_divident) {
//     remainingDays = balance.accrual_remaining_days ?? 0;
//   } else {
//     remainingDays = balance.remaining_days ?? 0;
//   }

//   // Remove the auto-conversion logic from here
//   // This should only be done in handleLeaveTypeChange
//   return remainingDays;
// };

//   // Get total days for selected leave type
//   const getTotalDays = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType) return 0;

//     const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
//     return balance?.total_days ?? 0;
//   };

//   // Get used days for selected leave type
//   const getUsedDays = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType) return 0;

//     const balance = leaveBalances.find(b => b.leave_type_id === selectedType.id.toString());
//     return balance?.used_days ?? 0;
//   };

//   // Get current request duration
//   const getRequestDuration = () => {
//     if (!formData.startDate || !formData.endDate) {
//       return 0;
//     }
//     return calculateDuration(formData.startDate, formData.endDate);
//   };

//   // Check if request duration exceeds remaining days
//   const isDurationExceeded = () => {
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === formData.type);
//     if (!selectedType || !selectedType.is_paid) return false;
//     const remainingDays = getRemainingDays();
//     const requestDuration = getRequestDuration();
//     return requestDuration > remainingDays;
//   };

//   const getRejectedLeaves = () => {
//     if (user?.role === 'employee') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
//         .length;

//       return rejectedLeave;
//     } else if (user?.role === 'supervisor' || user?.role === 'manager') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
//         .length;

//       return rejectedLeave;
//     } else if (user?.role === 'admin') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'REJECTED')
//         .length;

//       return rejectedLeave;
//     } else {
//       return 0;
//     }
//   };

//   const getPendingLeaves = () => {
//     if (user?.role === 'employee') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
//         .length;

//       return rejectedLeave;
//     } else if (user?.role === 'supervisor') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING')
//         .length;

//       return rejectedLeave;
//   } else if (user?.role === 'manager') {
//     const rejectedLeave = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
//       .length;

//     return rejectedLeave;
//   } else if (user?.role === 'admin') {
//       const rejectedLeave = allRecentLeaveRequests
//         .filter((request: RecentLeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED')
//         .length;

//       return rejectedLeave;
//     } else {
//       return 0;
//     }
//   };  

//   // Get current request duration
//   const getOnLeaveToday = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (user?.role === 'employee') {
//       const onLeaveToday = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString())
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;
//       return onLeaveToday;

//     } else if (user?.role === 'supervisor' || user?.role === 'manager') {
//       const onLeaveToday = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;
//       return onLeaveToday;

//     } else if (user?.role === 'admin') {
//       const onLeaveToday = allRecentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;
//       return onLeaveToday;

//     } else {
//       return 0;
//     }

//     const onLeaveToday = recentLeaveRequests
//       .filter((request: RecentLeaveRequest) => request.status.toString() === 'APPROVED')
//       .filter((request: RecentLeaveRequest) => {
//         const startDate = new Date(request.start_date);
//         const endDate = new Date(request.end_date);
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(0, 0, 0, 0);
//         return today >= startDate && today <= endDate;
//       })
//       .length;

//     return onLeaveToday;
//   };

//   const getApprovedLeaveDates = () => {
//     if (!myRecentLeaveRequests) return [];

//     return myRecentLeaveRequests
//       .filter(request => request.status === 'APPROVED')
//       .flatMap(request => {
//         const start = new Date(request.start_date);
//         const end = new Date(request.end_date);
//         return eachDayOfInterval({ start, end });
//       });
//   };

//   const getPendingLeaveDates = () => {
//     if (!myRecentLeaveRequests) return [];

//     return myRecentLeaveRequests
//       .filter(request => request.status === 'PENDING')
//       .flatMap(request => {
//         const start = new Date(request.start_date);
//         const end = new Date(request.end_date);
//         return eachDayOfInterval({ start, end });
//       });
//   };

//   const renderDayContents = (day: Date) => {
//     const approvedDates = getApprovedLeaveDates();
//     const pendingDates = getPendingLeaveDates();
//     const isOnLeave = approvedDates.some(date => isSameDay(date, day));
//     const isPending = pendingDates.some(date => isSameDay(date, day));
//     const isToday = isSameDay(day, new Date());

//     return (
//       <div className={`h-full w-full flex items-center justify-center ${isOnLeave ? 'bg-green-500 text-white rounded-full' :
//           isPending ? 'bg-yellow-500 text-white rounded-full' :
//             isToday ? 'bg-blue-500 text-white rounded-full' : ''
//         }`}>
//         {day.getDate()}
//       </div>
//     );
//   };

//   const resetLeaveAttachment = () => {
//     setSelectedLeaveDocuments([]);
//     setFormData(prev => ({
//       ...prev,
//       attachment: null
//     }));
//     setEditingRequestAttachment(null);
//     setDocumentManagerKey(prev => prev + 1);
//   }

//   const handleDocumentDeleted = (removedFile?: EmployeeDocument) => {
//     if (removedFile) {
//       setSelectedLeaveDocuments(prev => 
//         prev.filter(file => 
//           !(file.name === removedFile.name && 
//             file.documentType === removedFile.documentType && 
//             file.file === removedFile.file)
//         )
//       );
//     }
//   };

//   function getAttachmentIdFromUrl(url: string) {
//     const parts = url.split('/');
//     return parts.length >= 2 ? parts[parts.length - 2] : null;
//   }

//   // Add function to check if dates are less than 14 days from today
//   const isLessThan14Days = (date: Date) => {
//     const today = new Date();
//     const diffTime = date.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays < 14;
//   };

//   // Add function to check if dates are less than 5 days from today
//   const isLessThan5Days = (date: Date) => {
//     const today = new Date();
//     const diffTime = date.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays < 5;
//   };


// const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   const newType = e.target.value;
  
//   // Skip check if "Select" is chosen
//   if (newType === 'Select') {
//     setFormData(prev => ({ ...prev, type: newType }));
//     clearPreview();
//     return;
//   }

//   // Find the selected leave type using leaveTypesByEmployeeId
//   const selectedType = leaveTypesByEmployeeId.find(type => 
//     type.leave_type_name.toLowerCase() === newType.toLowerCase()
//   );
  
//   if (!selectedType) return;

//   // Find the corresponding balance
//   const balance = leaveBalances.find(b => 
//     b.leave_type_name.toLowerCase() === newType.toLowerCase()
//   );

//   // IMPORTANT: Only auto-convert to unpaid leave when there are actually 0 remaining days
//   // Check if this leave type has a balance (might not exist for unpaid leave)
//   if (balance) {
//     let remainingDays = 0;
    
//     // Calculate remaining days based on balance type
//     if (balance.is_total) {
//       remainingDays = balance.remaining_days ?? 0;
//     } else if (balance.is_divident) {
//       remainingDays = balance.accrual_remaining_days ?? 0;
//     } else {
//       remainingDays = balance.remaining_days ?? 0;
//     }

//     // Only convert to unpaid leave if there are 0 remaining days AND it's not already unpaid leave
//     if (remainingDays === 0 && newType.toLowerCase() !== 'unpaid leave') {
//       const unpaidLeave = leaveTypesByEmployeeId.find(type => 
//         type.leave_type_name.toLowerCase() === 'unpaid leave'
//       );
      
//       if (unpaidLeave) {
//         // Update form data with unpaid leave
//         const updatedFormData = { 
//           ...formData, 
//           type: 'unpaid leave',
//           // Also clear preview since we're changing type
//         };
//         setFormData(updatedFormData);
//         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
//         clearPreview();
//         return;
//       }
//     }
//   }

//   // If no conversion needed, set the selected type
//   const updatedFormData = { ...formData, type: newType };
//   setFormData(updatedFormData);
  
//   // Only trigger preview if we have all required data
//   if (formData.employee_id && formData.startDate && formData.endDate) {
//     triggerPreviewCalculation(updatedFormData);
//   }
// };

//   // Add function to handle leave type change
//   const handleLeaveTypeChange0812 = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newType = e.target.value;
    
//     // Skip check if "Select" is chosen
//     if (newType === 'Select') {
//       setFormData({ ...formData, type: newType });
//       return;
//     }

//     // Find the selected leave type
//     const selectedType = leaveTypes.find(type => type.leave_type_name.toLowerCase() === newType.toLowerCase());
//     if (!selectedType) return;

//     // Check remaining days
//     const balance = leaveBalances.find(b => b.employee_id === user?.id.toString() && b.leave_type_id === selectedType.id.toString());
//     const remainingDays = balance?.remaining_days ?? 0;

//     // If remaining days is 0, convert to unpaid leave
//     if (remainingDays === 0 && newType.toLowerCase() !== 'unpaid leave') {
//       const unpaidLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'unpaid leave');
//       if (unpaidLeave) {
//         setFormData({ ...formData, type: 'unpaid leave' });
//         showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
//         return;
//       }
//     }

//     // If no conversion needed, set the selected type
//     setFormData({ ...formData, type: newType });
//     const updatedFormData = { ...formData, type: newType };
//     setFormData(updatedFormData);
//     triggerPreviewCalculation(updatedFormData);
//   };

//   const handleCancelLeave = async (requestId: number) => {
//     try {
//       await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/cancel`, {
//         employee_id: user?.id
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       showNotification('Leave request cancelled successfully', 'success');
//       setShowCancelConfirm(false);
//       setIsViewModalOpen(false);
//       fetchLeaveData();
//     } catch (err) {
//       console.error('Error cancelling leave request:', err);
//       showNotification('Failed to cancel leave request', 'error');
//     }
//   };

//   const handleViewRequest3011 = async (request: RecentLeaveRequest) => {
//     try {
//       // Fetch leave documents
//       const documentsResponse = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       const documents = documentsResponse.data;
      
//       // If there are documents, update the request with the first document's info
//       if (documents && documents.length > 0) {
//         const firstDocument = documents[0];
//         request.document_url = firstDocument.document_url;
//         request.file_name = firstDocument.file_name;
//       }
      
//       setSelectedRequest(request);
//       setIsViewModalOpen(true);
//     } catch (err) {
//       console.error('Error fetching leave documents:', err);
//       // Still show the request even if document fetch fails
//       setSelectedRequest(request);
//       setIsViewModalOpen(true);
//     }
//   };


//   // Add this function in your component, after other handler functions
// const handleHalfDayToggle0112 = (isHalfDay: boolean) => {
//   const newFormData = { ...formData, isHalfDay };
//   setFormData(newFormData);

//   // Trigger preview calculation if all required fields are filled
//   if (formData.employee_id && formData.type && formData.startDate && formData.endDate) {
//     const selectedLeaveType = leaveTypes.find(
//       (type) => type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//     );
    
//     if (selectedLeaveType) {
//       // Trigger preview calculation
//       calculateLeavePreview({
//         employee_id: formData.employee_id,
//         leave_type_id: selectedLeaveType.id,
//         start_date: formData.startDate.toISOString().split('T')[0],
//         end_date: formData.endDate.toISOString().split('T')[0],
//         is_half_day: isHalfDay
//       }).catch((error) => {
//         console.error('Failed to calculate preview:', error);
//       });
//     }
//   }
// };

// const handleHalfDayToggle = (isHalfDay: boolean) => {
//   const newFormData = { ...formData, isHalfDay };
//   setFormData(newFormData);

//   // Trigger preview calculation with exclude_leave_id when editing
//   if (formData.employee_id && formData.type && formData.startDate && formData.endDate) {
//     const selectedLeaveType = leaveTypesByEmployeeId.find(
//       (type) => type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
//     );
    
//     if (selectedLeaveType) {
//       // Pass exclude_leave_id when in edit mode
//       const excludeId = isEditing && editingRequestId ? editingRequestId : undefined;
      
//       calculateLeavePreview({
//         employee_id: formData.employee_id,
//         leave_type_id: selectedLeaveType.id,
//         start_date: formData.startDate.toISOString().split('T')[0],
//         end_date: formData.endDate.toISOString().split('T')[0],
//         is_half_day: isHalfDay,
//         exclude_leave_id: excludeId
//       }).catch((error) => {
//         console.error('Failed to calculate preview:', error);
//       });
//     }
//   }
// };

// const handleViewRequest = async (request: RecentLeaveRequest) => {
//   try {
//     let documents = [];
//     try {
//       const documentsResponse = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       documents = documentsResponse.data;
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 404) {
//         console.log('No documents found for this leave application');
//         documents = [];
//       } else {
//         console.error('Error fetching leave documents:', err);
//       }
//     }
    
//     // Store all documents separately
//     setSelectedRequestDocuments(documents);
    
//     // For backward compatibility, still set the first document on selectedRequest
//     const requestWithFirstDocument = { 
//       ...request,
//       document_url: documents && documents.length > 0 ? documents[0].document_url : undefined,
//       file_name: documents && documents.length > 0 ? documents[0].file_name : undefined,
//       document_id: documents && documents.length > 0 ? documents[0].id : undefined
//     };
    
//     setSelectedRequest(requestWithFirstDocument);
//     setIsViewModalOpen(true);
//   } catch (err) {
//     console.error('Error in handleViewRequest:', err);
//     setSelectedRequest(request);
//     setSelectedRequestDocuments([]);
//     setIsViewModalOpen(true);
//   }
// };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const downloadAttachment = async (documentId: number, fileName: string) => {
//     try {
//       console.log(`📥 Downloading leave attachment: ${fileName} with ID: ${documentId}`);
      
//       // Use the backend endpoint that redirects to S3 presigned URL
//       const downloadUrl = `${API_BASE_URL}/api/v1/leaves/attachments/${documentId}/download`;
      
//       // Open in new tab - this will follow the redirect to the S3 presigned URL
//       window.open(downloadUrl, '_blank');
      
//       showNotification(`Downloading ${fileName}`, 'success');
      
//     } catch (error: any) {
//       console.error('❌ Download error:', error);
//       showNotification(`Failed to download: ${fileName}`, 'error');
//     }
//   };

//   const totalPages = Math.ceil(myRecentLeaveRequests.length / itemsPerPage);
//   const paginatedRequests = myRecentLeaveRequests.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const calculateRemainingDaysStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
//     return calculateLeaveStat(leave);
//   }

//   const setRemainingDaysStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'annual leave');
    
//     return setLeaveStat(leave);
//   }

//   const calculateMedicalLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
//     return calculateLeaveStat(leave);
//   }

//   const setMedicalLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'sick leave');
    
//     return setLeaveStat(leave);
//   }

//   const calculateEmergencyLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
//     return calculateLeaveStat(leave);
//   }

//   const setEmergencyLeaveStat = () => {
//     const leave = leaveBalances.find(b => b.leave_type_name.toLowerCase() === 'emergency leave');
    
//     return setLeaveStat(leave);
//   }   

//   const calculateLeaveStat = (leave: LeaveBalance | undefined) => {
//     return leave?.remaining_days;
//   }

//   const setLeaveStat = (leave: LeaveBalance | undefined) => {
//     return `${leave?.used_days} used / ${leave?.total_days} total`;
//   }
  
//   // Smart pagination functions
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPageButtons = 3;

//     if (totalPages <= maxPageButtons) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       let startPage = Math.max(1, currentPage - 1);
//       let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

//       if (endPage === totalPages) {
//         startPage = Math.max(1, endPage - maxPageButtons + 1);
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
//     }

//     return pageNumbers;
//   };

//   const goToPage = (pageNumber: number) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleWithdrawLeaveRequest = async (requestId: number) => {
//     try {
//       await axios.post(`${API_BASE_URL}/api/v1/leaves/${requestId}/withdraw`, {
//         employee_id: user?.id
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       showNotification('Leave request withdrawn successfully', 'success');
//       setShowCancelConfirm(false);
//       setIsViewModalOpen(false);
//       fetchLeaveData();
//     } catch (err) {
//       console.error('Error withdrawing leave request:', err);
//       showNotification('Failed to withdraw leave request. Please try again.', 'error');
//     }
//   };

//   // Check if the start date has passed
//   const isStartDatePassed = (startDate: string) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to start of day
//     const start = new Date(startDate);
//     start.setHours(0, 0, 0, 0); // Set to start of day
//     return start < today;
//   };

//   return (
//     <div className={`container mx-auto p-3 sm:p-4 lg:p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
//       {/* Notification Toast */}
//       <NotificationToast
//         show={notification.show}
//         message={notification.message}
//         type={notification.type}
//       />
      
//       {/* Header with stats cards */}
//       <div className="flex flex-col">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//             Manage your leave requests and view your leave balance
//           </p>
//           {role !== 'admin' && (
//             <button
//               className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//               onClick={() => setShowRequestModal(true)}
//             >
//               Request Leave
//             </button>
//           )}
//         </div>

//         {/* Leave balance summary */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Annual Leave</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateRemainingDaysStat()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{setRemainingDaysStat()}</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Medical Leave</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateMedicalLeaveStat()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{setMedicalLeaveStat()}</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Emergency Leave</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{calculateEmergencyLeaveStat()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{setEmergencyLeaveStat()}</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <FaRegCalendarCheck className="h-8 w-8 sm:h-10 sm:w-10" />
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Rejected Leaves</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getRejectedLeaves()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{getRejectedLeaves()} request{getRejectedLeaves() !== 1 ? 's' : ''} rejected</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <FaRegHourglass className="h-8 w-8 sm:h-10 sm:w-10" />
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">Pending Requests</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getPendingLeaves()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{getPendingLeaves()} request{getPendingLeaves() !== 1 ? 's' : ''} pending</div>
//           </div>

//           <div className={`stat shadow rounded-lg p-3 sm:p-4 sm:col-span-2 xl:col-span-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
//             <div className="stat-figure text-white">
//               <LiaUserSlashSolid className="h-8 w-8 sm:h-10 sm:w-10" />
//             </div>
//             <div className="stat-title text-white text-sm sm:text-base">On Leave Today</div>
//             <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{getOnLeaveToday()}</div>
//             <div className="stat-desc text-white text-xs sm:text-sm">{getOnLeaveToday()} employee{getOnLeaveToday() !== 1 ? 's' : ''}</div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 gap-6 sm:gap-8">
//         {/* Calendar and Recent Requests */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//           {/* Calendar */}
//           <div className={`card shadow-lg lg:col-span-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//             <div className="card-body p-3 sm:p-4 lg:p-6">
//               <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 Leave Calendar
//               </h2>
//               <div className={`p-2 sm:p-4 rounded-lg flex justify-center ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-800'}`}>
//                 <Calendar
//                   date={new Date()}
//                   onChange={() => { }}
//                   className="custom-calendar"
//                   dayContentRenderer={renderDayContents}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Recent Requests */}
//           <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//             <div className="card-body p-3 sm:p-4 lg:p-6">
//               <h2 className={`card-title flex items-center gap-2 mb-3 sm:mb-4 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <span className="hidden sm:inline">My Recent Requests</span>
//                 <span className="sm:hidden">Recent Requests</span>
//               </h2>
//               <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//                 <table className="table w-full text-sm">
//                   <thead>
//                     <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                       <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Type</th>
//                       <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm`}>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {myRecentLeaveRequests.slice(0, 4).map((request, index) => (
//                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== myRecentLeaveRequests.slice(0, 4).length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}>
//                         <td>
//                           <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
//                           <div className={`text-xs opacity-70 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                             {new Date(request.start_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })}
//                           </div>
//                         </td>
//                         <td>
//                           <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>

//         <LeaveBalanceSummary leaveBalances={leaveBalances} />

//         {/* Leave History */}
//         <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <div className="card-body p-3 sm:p-4 lg:p-6">
//             <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               My Leave History
//             </h2>

//             <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//               <table className="table w-full min-w-full">
//                 <thead>
//                   <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Type</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[140px]`}>Dates</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[80px]`}>Duration</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Reason</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[100px]`}>Status</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-xs sm:text-sm min-w-[120px]`}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedRequests.map(request => {
//                     // Calculate duration in days
//                     const duration = Math.ceil(
//                       (new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)
//                     ) + 1;
//                     const canEdit = request.status === 'PENDING';
//                     const canCancel = request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
//                     return (
//                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}`}>
//                         <td>
//                           <div className={`font-medium text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.leave_type_name}</div>
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>
//                           <div className="break-words">
//                             {new Date(request.start_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                               day: 'numeric',
//                               month: 'numeric',
//                               year: 'numeric'
//                             })}
//                           </div>
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-xs sm:text-sm`}>{request.duration} day{request.duration !== 1 ? 's' : ''}</td>
//                         <td>
//                           <div className={`whitespace-normal break-words max-w-xs text-xs sm:text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.reason}</div>
//                         </td>
//                         <td>
//                           <span className={`badge badge-sm ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                         </td>
//                         <td className="text-right">
//                           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
//                             {canEdit && (
//                               <button
//                                 className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-slate-600 hover:bg-slate-700' : 'bg-slate-400 hover:bg-slate-500'} text-white border-0`}
//                                 onClick={() => openEditModal(request)}
//                                 type="button"
//                               >
//                                 Edit
//                               </button>
//                             )}
//                             <button
//                               className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//                               onClick={() => handleViewRequest(request)}
//                               type="button"
//                             >
//                               View
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-4 sm:mt-6">
//                 <div className="btn-group flex-wrap gap-1">
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(1)}
//                     disabled={currentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                   >
//                     «
//                   </button>
//                   {getPageNumbers().map(page => (
//                     <button 
//                       key={page}
//                       className={`btn btn-xs sm:btn-sm ${currentPage === page ? 
//                         `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
//                         `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
//                       }`}
//                       onClick={() => goToPage(page)}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                   >
//                     »
//                   </button>
//                   <button 
//                     className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Leave Request Modal */}
// <dialog
//   id="leave_request_modal"
//   className={`modal ${showRequestModal ? 'modal-open' : ''}`}
// >
//   <div className={`modal-box max-w-4xl p-0 overflow-hidden max-h-[90vh] ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} relative`}>
//     {/* Loading Overlay */}
//     {isSubmitting && (
//       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
//         <div className={`p-6 rounded-lg flex flex-col items-center ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
//           <span className="loading loading-spinner loading-lg text-primary mb-2"></span>
//           <p className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//             {isEditing ? 'Updating leave request...' : 'Submitting leave request...'}
//           </p>
//           <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//             Please wait while we process your request
//           </p>
//         </div>
//       </div>
//     )}
    
//     {/* Modal Header */}
//     <div className={`px-6 py-4 border-b ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
//       <h3 className={`font-bold text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//         </svg>
//         {isEditing ? 'Edit Leave Request' : 'New Leave Request'}
//       </h3>
//       <form method="dialog">
//         <button
//           className={`btn btn-sm btn-circle btn-ghost absolute right-4 top-4 ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
//           onClick={() => {
//             setShowRequestModal(false);
//             setIsEditing(false);
//             setEditingRequestId(null);
//             setEditingRequestAttachment(null);
//             clearPreview(); // Clear preview when modal closes
//             setErrors({
//               type: '',
//               reason: '',
//               startDate: '',
//               endDate: '',
//               attachment: '',
//               employee_id: '',
//               general: ''
//             });
//           }}
//         >✕</button>
//       </form>
//     </div>

//     {/* Modal Content */}
//     <div className={`p-6 overflow-y-auto max-h-[calc(90vh-4rem)] ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Two Column Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column: Form Inputs */}
//           <div className="space-y-6">
//             {/* Leave Type & Reason */}
//             <div className="space-y-6">
//               <div className="form-control">
//                 <label className="label">
//                   <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type</span>
//                   <span className="label-text-alt text-red-500">*</span>
//                 </label>
//                 <select
//                   className={`select select-bordered w-full ${
//                     errors.type 
//                       ? 'border-red-500 focus:border-red-500' 
//                       : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
//                   }`}
//                   id="leave_type"
//                   name="leave_type"
//                   value={formData.type}
//                   onChange={handleLeaveTypeChange}
//                   disabled={isLoading || isSubmitting}
//                 >
//                   <option>Select</option>
//                   {getFilteredLeaveTypes()
//                     .filter(type => type.is_active)
//                     .map((type) => (
//                       <option key={type.id} value={type.leave_type_name.toLowerCase()}>
//                         {type.leave_type_name}
//                       </option>
//                   ))}
//                 </select>
//                 {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Reason</span>
//                   <span className="label-text-alt text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`input input-bordered w-full ${
//                     errors.reason 
//                       ? 'border-red-500 focus:border-red-500' 
//                       : `${theme === 'light' ? 'border-slate-300 focus:border-blue-500 bg-white text-slate-900' : 'border-slate-600 focus:border-blue-400 bg-slate-700 text-slate-100'}`
//                   }`}
//                   placeholder="Brief reason for leave"
//                   value={formData.reason}
//                   onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//                 {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
//               </div>
//             </div>

//             {/* Date Selection */}
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Start Date</span>
//                     <span className="label-text-alt text-red-500">*</span>
//                   </label>
//                   <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.startDate ? 'border border-red-500' : ''}`}>
//                     <input
//                       type="date"
//                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
//                       value={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => handleDateChange(e.target.value, true)}
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
//                 </div>
                
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>End Date</span>
//                     <span className="label-text-alt text-red-500">*</span>
//                   </label>
//                   <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.endDate ? 'border border-red-500' : ''}`}>
//                     <input
//                       type="date"
//                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
//                       value={formData.endDate ? calculateDateInUTC(formData.endDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => handleDateChange(e.target.value, false)}
//                       min={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : calculateDateInUTC(new Date()).toISOString().split('T')[0]}
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
//                 </div>
//               </div>

//               {/* Balance Warning */}
//               {isDurationExceeded() && (
//                 <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-800'}`}>
//                   <div className="flex items-start gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                     </svg>
//                     <span className="text-red-600 text-sm">
//                       Warning: Your request duration exceeds your remaining leave balance.
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Half Day Toggle - Only show when dates are same */}
//               {formData.startDate && formData.endDate && 
//                calculateDateInUTC(formData.startDate).toISOString().split('T')[0] === calculateDateInUTC(formData.endDate).toISOString().split('T')[0] && (
//                 <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Half Day Leave</h4>
//                       <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         Select if you're taking only half a day off
//                       </p>
//                     </div>
//                     <label className="cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className={`toggle toggle-lg ${formData.isHalfDay ? (theme === 'light' ? 'toggle-primary' : 'toggle-accent') : ''}`}
//                         checked={formData.isHalfDay}
//                         onChange={(e) => {
//                           setFormData({ ...formData, isHalfDay: e.target.checked });
//                           handleHalfDayToggle(e.target.checked);
//                         }}
//                         disabled={isSubmitting}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Documents Section */}
//             <div className="space-y-6">
//               {/* Show existing documents if editing */}
//               {isEditing && editingRequestDocuments && editingRequestDocuments.length > 0 && (
//                 <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Existing Documents</span>
//                   </label>
//                   <ul className="space-y-2">
//                     {editingRequestDocuments.map((doc, idx) => (
//                       <li key={doc.id || idx} className={`flex items-center justify-between p-3 rounded ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
//                         <div className="flex items-center gap-3">
//                           <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
//                           </svg>
//                           <span className={`text-sm truncate max-w-[200px] ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{doc.file_name}</span>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             if (doc.id) {
//                               downloadAttachment(doc.id, doc.file_name || 'attachment');
//                             }
//                           }}
//                           className={`btn btn-xs ${theme === 'light' ? 'btn-outline btn-primary' : 'btn-outline btn-accent'}`}
//                           disabled={isSubmitting}
//                         >
//                           Download
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Attachment Upload */}
//               <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
//                 <label className="label mb-2">
//                   <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                     Supporting Documents
//                     {/* {formData.type && leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase())?.requires_documentation && (
//                       <span className="text-red-500 ml-2">* Required</span>
//                     )}
//                   </span> */}
// {(() => {
//         if (!formData.type || formData.type === 'Select') return null;
        
//         // Clean and normalize the type name
//         const selectedTypeName = formData.type.toLowerCase().trim();
//         const leaveType = leaveTypesByEmployeeId.find(type => 
//           type.leave_type_name.toLowerCase().trim() === selectedTypeName
//         );
        
//         console.log('Selected Type:', selectedTypeName);
//         console.log('Found Leave Type:', leaveType);
//         console.log('Requires Docs:', leaveType?.requires_documentation);
        
//         if (leaveType?.requires_documentation) {
//           return <span className="text-red-500 ml-2">* Required</span>;
//         }
        
//         return null;
//       })()}
//     </span>
//                 </label>
//                 <div className={`${errors.attachment ? 'border border-red-500 rounded-lg p-3' : ''}`}>
//                   <EmployeeDocumentManager
//                     key={documentManagerKey}
//                     employeeId={user?.id || null}
//                     mode={isEditing ? 'add' : 'add'}
//                     documentTypes={[
//                       {
//                         type: 'Medical',
//                         label: 'Attachment',
//                         description: 'Upload medical certificate or supporting document'
//                       }
//                     ]}
//                     moduleName="leave"
//                     onFilesSelected={setSelectedLeaveDocuments}
//                     initialDocuments={selectedLeaveDocuments}
//                     onDocumentDeleted={handleDocumentDeleted}
//                   />
//                 </div>
//                 {errors.attachment && <p className="text-red-500 text-sm mt-2">{errors.attachment}</p>}
//                 <div className="label-text-alt mt-3">
//                   <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                     Supported formats: PDF, JPG, PNG, DOC, DOCX • Max size: 10MB
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* <button 
//   type="button" 
//   onClick={() => triggerPreviewCalculation(formData)}
//   className="btn btn-sm btn-outline"
// >
//   Test Preview
// </button> */}

//           {/* Right Column: Leave Calculation Preview */}
//           <div>
//             {/* Leave Calculation Preview Card */}
//             <div className={`sticky top-0 rounded-lg ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200' : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600'}`}>
//               <div className="p-4 border-b border-blue-200 dark:border-slate-600">
//                 <h4 className={`font-bold text-lg flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Leave Calculation
//                   {isLoadingPreview && (
//                     <div className="loading loading-spinner loading-xs ml-2"></div>
//                   )}
//                 </h4>
//               </div>

//               <div className="p-4">
//                 {/* When preview is loading */}
//                 {isLoadingPreview && (
//                   <div className="space-y-4">
//                     <div className="skeleton h-8 w-full"></div>
//                     <div className="skeleton h-16 w-full"></div>
//                     <div className="skeleton h-24 w-full"></div>
//                   </div>
//                 )}

//                 {/* When there's an error */}
//                 {previewError && !isLoadingPreview && (
//                   <div className={`alert alert-error ${theme === 'light' ? '' : 'bg-red-900/20'}`}>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <span className="text-sm">{previewError}</span>
//                   </div>
//                 )}

//                 {/* When preview data is available */}
//                 {previewData && !isLoadingPreview && !previewError && (
//                   <div className="space-y-6">
//                     {/* Summary Cards */}
//                     <div className="grid grid-cols-2 gap-3">
//                       <div className={`p-3 rounded-lg text-center ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
//                         <div className={`text-xs mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                           Calculated Duration
//                           {formData.isHalfDay && <span className="block text-amber-600">(Half Day)</span>}
//                         </div>
//                         <div className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                           {previewData.calculation?.duration ?? 0} {formData.isHalfDay ? '½' : ''} day{previewData.calculation?.duration !== 1 ? 's' : ''}
//                         </div>
//                       </div>
                      
//                       <div className={`p-3 rounded-lg text-center ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
//                         <div className={`text-xs mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Available Balance</div>
//                         <div className={`text-2xl font-bold ${
//                           previewData.balance?.sufficient 
//                             ? (theme === 'light' ? 'text-green-600' : 'text-green-400') 
//                             : 'text-red-600'
//                         }`}>
//                           {previewData.balance?.available ?? 0}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Status Badge */}
//                     {/* <div className="flex justify-center">
//                       <div className={`badge badge-lg ${previewData.can_proceed ? 'badge-success' : 'badge-error'} gap-2`}>
//                         {previewData.can_proceed ? (
//                           <>
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Ready to Submit
//                           </>
//                         ) : (
//                           <>
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Issues Found
//                           </>
//                         )}
//                       </div>
//                     </div> */}

//                     {/* Breakdown Section */}
//                     {/* {previewData.calculation?.breakdown && (
//                       <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
//                         <h5 className={`font-medium mb-3 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Calculation Breakdown</h5>
//                         <div className="space-y-2">
//                           <div className="flex justify-between">
//                             <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Total Work Days:</span>
//                             <span className="font-semibold">{previewData.calculation.breakdown.total_work_days}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Holidays Excluded:</span>
//                             <span className="font-semibold">{previewData.calculation.breakdown.holidays_excluded}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Actual Working Days:</span>
//                             <span className={`font-semibold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                               {previewData.calculation.breakdown.actual_working_days}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     )} */}

//                     {/* Validation Messages */}
//                     <div className="space-y-2">
//                       {previewData.validation?.has_sufficient_balance === false && (
//                         <div className={`alert alert-warning py-2 ${theme === 'light' ? '' : 'bg-amber-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                           </svg>
//                           <span className="text-xs">Insufficient leave balance</span>
//                         </div>
//                       )}
                      
//                       {previewData.validation?.has_overlapping_leaves && (
//                         <div className={`alert alert-warning py-2 ${theme === 'light' ? '' : 'bg-amber-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                           </svg>
//                           <span className="text-xs">Overlapping leave exists</span>
//                         </div>
//                       )}

//                       {previewData.validation?.requires_documentation && (
//                         <div className={`alert alert-info py-2 ${theme === 'light' ? '' : 'bg-blue-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                           <span className="text-xs">Documentation required</span>
//                         </div>
//                       )}

//                       {previewData.can_proceed && !previewError && (
//                         <div className={`alert alert-success py-2 ${theme === 'light' ? '' : 'bg-green-900/20'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           <span className="text-xs">All checks passed! Ready to submit.</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Quick Stats */}
//                     {/* <div className={`text-center pt-4 border-t ${theme === 'light' ? 'border-blue-100' : 'border-slate-600'}`}>
//                       <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         Preview updates automatically as you fill the form
//                       </p>
//                     </div> */}
//                   </div>
//                 )}

//                 {/* Default message when no preview yet */}
//                 {!previewData && !isLoadingPreview && !previewError && (
//                   <div className="text-center py-8">
//                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto mb-3 ${theme === 'light' ? 'text-slate-300' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <h5 className={`font-medium mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Preview Will Appear Here</h5>
//                     <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
//                       Fill in the leave details to see calculation preview
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

          
//         </div>

//         {/* Modal Footer */}
//         <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
//           <button
//             type="button"
//             className={`btn btn-outline ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600' : 'border-blue-400 text-blue-400 hover:bg-blue-400'} hover:text-white`}
//             onClick={() => {
//               setShowRequestModal(false);
//               setErrors({
//                 type: '',
//                 reason: '',
//                 startDate: '',
//                 endDate: '',
//                 attachment: '',
//                 employee_id: '',
//                 general: ''
//               });
//               setFormData({
//                 type: '',
//                 startDate: undefined,
//                 endDate: undefined,
//                 reason: '',
//                 attachment: null,
//                 employee_id: undefined,
//                 isHalfDay: false
//               });
//               setIsEditing(false);
//               setEditingRequestId(null);
//               setEditingRequestAttachment(null);
//               setSelectedLeaveDocuments([]);
//               resetLeaveAttachment();
//               clearPreview();
//             }}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 {isEditing ? 'Updating...' : 'Submitting...'}
//               </>
//             ) : (
//               isEditing ? 'Update Request' : 'Submit Request'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
//   <form method="dialog" className="modal-backdrop">
//     <button onClick={() => setShowRequestModal(false)} disabled={isSubmitting}>close</button>
//   </form>
// </dialog>

//       {/* View Leave Request Modal */}
//       <dialog id="view_modal" className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
//         <div className={`modal-box w-full max-w-sm sm:max-w-lg lg:max-w-4xl xl:max-w-5xl p-0 overflow-hidden shadow-lg mx-2 sm:mx-auto h-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           {/* Modal Header */}
//           <div className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
//             <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <span className="truncate">Leave Request Details</span>
//             </h3>
//             <button
//               className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'}`}
//               onClick={() => setIsViewModalOpen(false)}
//             >✕</button>
//           </div>

//           {/* Modal Content - Scrollable */}
//           <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto">
//             {selectedRequest && (
//               <div className="space-y-4 sm:space-y-6">
//                 {/* Basic Information */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Status</h4>
//                     <p className="text-sm sm:text-base font-medium">
//                       <span className={`badge ${getBadgeClass(selectedRequest.status)}`}>
//                         {selectedRequest.status}
//                       </span>
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.start_date)}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{formatDate(selectedRequest.end_date)}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Duration</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedRequest.duration} day{selectedRequest.duration !== 1 ? 's' : ''}</p>
//                   </div>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Applied On</h4>
//                     <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//                       {convertUTCToSingapore(selectedRequest.created_at)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Reason */}
//                 <div>
//                   <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason</h4>
//                   <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'}`}>
//                     {selectedRequest.reason}
//                   </p>
//                 </div>

//                 {/* Attachment */}
//                 {/* {selectedRequest.document_url && (
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Attachment</h4>
//                     <div className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
//                       <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//                       </svg>
//                       <a
//                         href="#"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           if (selectedRequest.document_id) {
//                             downloadAttachment(selectedRequest.document_id, selectedRequest.file_name || 'attachment');
//                           } else {
//                             showNotification('Document ID not found', 'error');
//                           }
//                         }}
//                         className={`text-xs sm:text-sm font-medium truncate flex items-center gap-2 ${theme === 'light' ? 'text-primary hover:text-primary-focus' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         Download {selectedRequest.file_name}
//                       </a>
//                     </div>
//                   </div>
//                 )} */}
// {selectedRequestDocuments && selectedRequestDocuments.length > 0 && (
//   <div>
//     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
//       Attachments ({selectedRequestDocuments.length})
//     </h4>
//     <div className="space-y-2">
//       {selectedRequestDocuments.map((doc, index) => (
//         <div 
//           key={doc.id || index} 
//           className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//           </svg>
//           <a
//             href="#"
//             onClick={(e) => {
//               e.preventDefault();
//               if (doc.id) {
//                 downloadAttachment(doc.id, doc.file_name || `attachment-${index + 1}`);
//               } else {
//                 showNotification('Document ID not found', 'error');
//               }
//             }}
//             className={`text-xs sm:text-sm font-medium truncate flex items-center gap-2 ${theme === 'light' ? 'text-primary hover:text-primary-focus' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
//             style={{ cursor: 'pointer' }}
//           >
//             Download {doc.file_name || `Attachment ${index + 1}`}
//           </a>
//         </div>
//       ))}
//     </div>
//   </div>
// )}


//                 {/* Approval Information */}
//                 {selectedRequest.status === 'APPROVED' && selectedRequest.approval_comment && (
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Approval Comment</h4>
//                     <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-green-50 text-slate-900 border border-green-200' : 'bg-green-900/20 text-slate-100 border border-green-800'}`}>
//                       {selectedRequest.approval_comment}
//                     </p>
//                   </div>
//                 )}

//                 {/* Rejection Information */}
//                 {selectedRequest.status === 'REJECTED' && (
//                   <div className="p-3 sm:p-4 space-y-3">
//                     <div>
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejected By</h4>
//                       <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//                         {selectedRequest.second_approver_name || selectedRequest.first_approver_name}
//                       </p>
//                     </div>
//                     <div>
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Rejection Date</h4>
//                       <p className={`text-sm sm:text-base font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//                         {convertUTCToSingapore(selectedRequest.updated_at)}
//                       </p>
//                     </div>
//                     <div>
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason for Rejection</h4>
//                       <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-red-50 text-slate-900 border border-red-200' : 'bg-red-900/20 text-slate-100 border border-red-800'}`}>
//                         {selectedRequest.rejection_reason}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Modal Footer */}
//           <div className={`px-4 sm:px-6 py-2 sm:py-3 border-t flex justify-end gap-2 mt-auto z-10 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}>
//             {selectedRequest && (selectedRequest.status === 'PENDING' || selectedRequest.status === 'FIRST_APPROVED') && (
//               <button
//                 className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
//                 onClick={() => setShowCancelConfirm(true)}
//               >
//                 Cancel Request
//               </button>
//             )}
//             {selectedRequest && (selectedRequest.status === 'APPROVED') && !isStartDatePassed(selectedRequest.start_date) && (
//               <button
//                 className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
//                 onClick={() => handleWithdrawLeaveRequest(selectedRequest.id)}
//               >
//                 Withdraw Request
//               </button>
//             )}
//             <button
//               className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//               onClick={() => setIsViewModalOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setIsViewModalOpen(false)}>close</button>
//         </form>
//       </dialog>

//       {/* Cancel Confirmation Modal */}
//       <dialog id="cancel_confirm_modal" className={`modal ${showCancelConfirm ? 'modal-open' : ''}`}>
//         <div className={`modal-box ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Confirm Cancellation</h3>
//           <p className={`py-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Are you sure you want to cancel this leave request? This action cannot be undone.</p>
//           <div className="modal-action">
//             <button
//               className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
//               onClick={() => setShowCancelConfirm(false)}
//             >
//               No, Keep Request
//             </button>
//             <button
//               className={`btn ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
//               onClick={() => selectedRequest && handleCancelLeave(selectedRequest.id)}
//             >
//               Yes, Cancel Request
//             </button>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setShowCancelConfirm(false)}>close</button>
//         </form>
//       </dialog>
//     </div>
//   )
// }

// export default LeaveOverview


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
import { useLeavePreview } from '../hooks/useLeavePreview';
import { employeeApi } from '../utils/test';

  const extractArrayData = (response: any) => {
    if (Array.isArray(response)) return response;
    if (response && response.data && Array.isArray(response.data)) return response.data;
    if (response && response.success && Array.isArray(response.data)) return response.data;
    return [];
  };


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
  document_id?: number;
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

interface FormData {
  type: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  reason: string;
  attachment: File | null;
  employee_id: number | undefined;
  isHalfDay: boolean;
}

interface FormErrors {
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  attachment: string;
  employee_id: string;
  general: string;
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

const LeaveOverview = () => {
  const { theme } = useTheme();
  const { notification, showNotification } = useNotification();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  const [formData, setFormData] = useState<FormData>({
  type: '',
  startDate: undefined,
  endDate: undefined,
  reason: '',
  attachment: null,
  employee_id: undefined,
  isHalfDay: false
});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  // const [errors, setErrors] = useState<FormErrors>({
  //   type: '',
  //   reason: '',
  //   startDate: '',
  //   endDate: '',
  //   attachment: ''
  // });

  const [errors, setErrors] = useState<FormErrors>({
  type: '',
  reason: '',
  startDate: '',
  endDate: '',
  attachment: '',
  employee_id: '',
  general: ''
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
  const [selectedRequestDocuments, setSelectedRequestDocuments] = useState<any[]>([]);
  const { 
      previewData, 
      isLoadingPreview, 
      previewError, 
      calculateLeavePreview, 
      clearPreview 
    } = useLeavePreview();

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
    return leaveTypesByEmployeeId; // Use leaveTypesByEmployeeId
  }

  // Get gender from localStorage
  const userFromStorage = localStorage.getItem('hrms_user');
  if (!userFromStorage) return leaveTypesByEmployeeId;
  
  try {
    const parsedUser = JSON.parse(userFromStorage);
    const gender = parsedUser?.gender;
    
    if (!gender) return leaveTypesByEmployeeId;

    return (leaveTypesByEmployeeId || []).filter(type => {
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

  // Filter leave types based on user gender
  const getFilteredLeaveTypes0812 = () => {
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

      return (leaveTypesByEmployeeId || []).filter(type => {
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

  const fetchLeaveData = useCallback(async () => {
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
      setLeaveTypes(extractArrayData(typesResponse.data));
      setLeaveTypesByEmployeeId(extractArrayData(leaveTypesByEmployeeResponse.data));
      console.log(balancesResponse.data);
      setLeaveBalances(extractArrayData(balancesResponse.data));
      const recentLeavesData = extractArrayData(recentLeavesResponse.data);
      setRecentLeaveRequests(recentLeavesData.filter((request: RecentLeaveRequest) => request.employee_id.toString() !== user?.id.toString()));
      setMyRecentLeaveRequests(recentLeavesData.filter((request: RecentLeaveRequest) => request.employee_id.toString() === user?.id.toString()));
      setAllRecentLeaveRequests(recentLeavesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching leave data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch leave types and balances
  useEffect(() => {
    if (user?.id) {
      fetchLeaveData();

       setFormData(prev => ({
      ...prev,
      employee_id: user.id
    }));
    }
  }, [user?.id, fetchLeaveData]);

const openEditModal0112 = async (request: RecentLeaveRequest) => {
  setFormData({
    type: request.leave_type_name.toLowerCase(),
    startDate: new Date(request.start_date),
    endDate: new Date(request.end_date),
    reason: request.reason,
    attachment: null,
    employee_id: request.employee_id, // Add this
    isHalfDay: request.duration === 0.5
  });
  setIsEditing(true);
  setEditingRequestId(request.id);
  setShowRequestModal(true);
  clearPreview();
  
  
  // Fetch all documents for this leave application
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    const documents = res.data;
    setEditingRequestDocuments(documents);
    
    // If the request has an attachment, set it for download
    if (documents && documents.length > 0) {
      const firstDocument = documents[0];
      setEditingRequestAttachment({ 
        url: firstDocument.document_url, 
        name: firstDocument.file_name 
      });
    } else {
      setEditingRequestAttachment(null);
    }
  } catch (err) {
    console.error('Error fetching documents for editing:', err);
    setEditingRequestDocuments([]);
    setEditingRequestAttachment(null);
  }
};

const openEditModal = async (request: RecentLeaveRequest) => {
  // First, clear any existing preview
  clearPreview();
  
  const formDataForEdit = {
    type: request.leave_type_name.toLowerCase(),
    startDate: new Date(request.start_date),
    endDate: new Date(request.end_date),
    reason: request.reason,
    attachment: null,
    employee_id: request.employee_id,
    isHalfDay: request.duration === 0.5
  };

  setFormData(formDataForEdit);
  setIsEditing(true);
  setEditingRequestId(request.id);
  setShowRequestModal(true);
  
  // Find the selected leave type
  const selectedType = leaveTypesByEmployeeId.find(type => 
    type.leave_type_name.toLowerCase() === formDataForEdit.type.toLowerCase()
  );
  
  if (selectedType) {
    try {
      // Trigger preview calculation WITH exclude_leave_id parameter
      await calculateLeavePreview({
        employee_id: formDataForEdit.employee_id,
        leave_type_id: selectedType.id,
        start_date: calculateDateInUTC(formDataForEdit.startDate).toISOString().split('T')[0],
        end_date: calculateDateInUTC(formDataForEdit.endDate).toISOString().split('T')[0],
        is_half_day: formDataForEdit.isHalfDay,
        exclude_leave_id: request.id // Pass the current leave ID to exclude
      });
    } catch (error) {
      console.error('Failed to calculate preview for edit:', error);
    }
  }

  // Fetch all documents for this leave application
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    const documents = res.data;
    setEditingRequestDocuments(documents);
    
    // If the request has an attachment, set it for download
    if (documents && documents.length > 0) {
      const firstDocument = documents[0];
      setEditingRequestAttachment({ 
        url: firstDocument.document_url, 
        name: firstDocument.file_name 
      });
    } else {
      setEditingRequestAttachment(null);
    }
  } catch (err) {
    console.error('Error fetching documents for editing:', err);
    setEditingRequestDocuments([]);
    setEditingRequestAttachment(null);
  }
};

const handleSubmit0112 = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isSubmitting) return; // Prevent multiple submissions
  
  if (validateForm()) {
    setIsSubmitting(true); // Start loading
    
    const startDate = new Date(Date.UTC(
      formData.startDate!.getFullYear(),
      formData.startDate!.getMonth(),
      formData.startDate!.getDate())
    ).toISOString().split('T')[0];
    
    const endDate = new Date(Date.UTC(
      formData.endDate!.getFullYear(),
      formData.endDate!.getMonth(),
      formData.endDate!.getDate())
    ).toISOString().split('T')[0];
    
    try {
      const selectedType = leaveTypes.find(type => 
        type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
      );
      
      if (!selectedType) {
        throw new Error('Invalid leave type');
      }

      console.log('🔄 LEAVE SUBMISSION PROCESS STARTED');

      // Step 1: Create/Update leave application first (without files)
      const leaveData = {
        employee_id: user?.id?.toString() || '',
        leave_type_id: selectedType.id.toString(),
        start_date: startDate,
        end_date: endDate,
        reason: formData.reason,
        is_half_day: formData.isHalfDay ? "1" : "0"
      };

      console.log('📝 Creating/Updating leave application:', leaveData);

      let leaveResponse;
      const leaveId = isEditing ? editingRequestId : null;

      if (isEditing && editingRequestId) {
        // Update existing leave
        leaveResponse = await axios.put(
          `${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, 
          leaveData, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Leave application updated:', editingRequestId);
      } else {
        // Create new leave
        leaveResponse = await axios.post(
          `${API_BASE_URL}/api/v1/leaves`, 
          leaveData, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Leave application created');
      }

      // 🔴 FIX: Get the leave ID properly
      const finalLeaveId = isEditing ? editingRequestId : leaveResponse.data.leaveId;
      console.log('🎯 Leave ID for document upload:', finalLeaveId);

      if (!finalLeaveId) {
        throw new Error('Could not determine leave ID');
      }

      // Step 2: Upload files separately if any
      const hasDocuments = selectedLeaveDocuments.length > 0 || formData.attachment;
      
      if (hasDocuments) {
        console.log('📎 Starting document upload process...');
        
        const uploadFormData = new FormData();
        
        // 🔴 FIX: Ensure uploaded_by is always a string
        const uploaded_by = (user?.id?.toString() || '');
        if (!uploaded_by) {
          throw new Error('Could not determine user ID for upload');
        }
        
        uploadFormData.append('uploaded_by', uploaded_by);
        
        // Add files to FormData - Use 'attachments' field name
        if (selectedLeaveDocuments.length > 0) {
          selectedLeaveDocuments.forEach((doc, idx) => {
            if (doc.file) {
              console.log(`📎 Appending file to FormData: ${doc.file.name}`);
              uploadFormData.append('attachments', doc.file);
            }
          });
        } else if (formData.attachment) {
          console.log(`📎 Appending single file to FormData: ${formData.attachment.name}`);
          uploadFormData.append('attachments', formData.attachment);
        }

        // Debug FormData contents
        console.log('📤 FormData contents for upload:');
        for (let [key, value] of (uploadFormData as any).entries()) {
          if (value instanceof File) {
            console.log(`📁 ${key}:`, value.name, value.size, value.type);
          } else {
            console.log(`📝 ${key}:`, value);
          }
        }

        try {
          // Upload files to the separate endpoint
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/v1/leaves/${finalLeaveId}/documents`,
            uploadFormData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
                'Content-Type': 'multipart/form-data'
              },
              // Add timeout and progress for large files
              timeout: 60000, // 60 seconds timeout
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total || 1)
                );
                console.log(`📤 Upload Progress: ${percentCompleted}%`);
                // You can also update a progress state here if you want to show progress bar
              }
            }
          );
          
          console.log('✅ Documents uploaded successfully:', uploadResponse.data);
        } catch (uploadError) {
          console.error('❌ Document upload failed:', uploadError);
          // Don't fail the entire request if document upload fails
          showNotification('Leave created but document upload failed', 'error');
        }
      } else {
        console.log('📭 No documents to upload');
      }

      // Success
      console.log('🎉 Leave submission completed successfully');
      showNotification(
        isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 
        'success'
      );
      
      // Reset form
      setFormData({
        type: '',
        startDate: undefined,
        endDate: undefined,
        reason: '',
        attachment: null,
        employee_id: undefined,
        isHalfDay: false
      });
      resetLeaveAttachment();
      setShowRequestModal(false);
      setIsEditing(false);
      setEditingRequestId(null);
      setEditingRequestAttachment(null);
      fetchLeaveData();

    } catch (err) {
      console.error('❌ LEAVE SUBMISSION ERROR:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Axios error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.response?.data?.message,
          error: err.response?.data?.error
        });
        
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           'Failed to submit leave request. Please try again.';
        showNotification(errorMessage, 'error');
      } else {
        console.error('❌ Non-Axios error:', err);
        showNotification('Failed to submit leave request. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false); // End loading regardless of success/error
    }
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isSubmitting) return; // Prevent multiple submissions
  
  // Use preview data for validation if available
  if (previewData && previewData.can_proceed === false) {
    setErrors(prev => ({
      ...prev,
      general: 'Cannot submit leave due to validation issues. Please check the preview details.'
    }));
    showNotification('Cannot submit leave due to validation issues. Please check the preview details.', 'error');
    return;
  }

  if (validateForm()) {
    setIsSubmitting(true); // Start loading
    
    const startDate = new Date(Date.UTC(
      formData.startDate!.getFullYear(),
      formData.startDate!.getMonth(),
      formData.startDate!.getDate())
    ).toISOString().split('T')[0];
    
    const endDate = new Date(Date.UTC(
      formData.endDate!.getFullYear(),
      formData.endDate!.getMonth(),
      formData.endDate!.getDate())
    ).toISOString().split('T')[0];
    
    try {
      const selectedType = leaveTypesByEmployeeId.find(type => 
        type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
      );
      
      if (!selectedType) {
        throw new Error('Invalid leave type');
      }

      console.log('🔄 LEAVE SUBMISSION PROCESS STARTED');

      // Step 1: Create/Update leave application first (without files)
      const leaveData = {
        employee_id: formData.employee_id?.toString() || user?.id?.toString() || '',
        leave_type_id: selectedType.id.toString(),
        start_date: startDate,
        end_date: endDate,
        reason: formData.reason,
        is_half_day: formData.isHalfDay
      };

      console.log('📝 Creating/Updating leave application:', leaveData);

      let leaveResponse;
      const leaveId = isEditing ? editingRequestId : null;

      if (isEditing && editingRequestId) {
        // Update existing leave
        leaveResponse = await axios.put(
          `${API_BASE_URL}/api/v1/leaves/${editingRequestId}`, 
          leaveData, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Leave application updated:', editingRequestId);
        console.log('📋 Update Response:', leaveResponse.data);
      } else {
        // Create new leave
        leaveResponse = await axios.post(
          `${API_BASE_URL}/api/v1/leaves`, 
          leaveData, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Leave application created');
        console.log('📋 Create Response:', leaveResponse.data);
        console.log('📋 Response keys:', Object.keys(leaveResponse.data));
      }

      // Get the leave ID properly - check multiple possible response formats
      let finalLeaveId;
      const responseData = leaveResponse.data;
      
      if (isEditing && editingRequestId) {
        finalLeaveId = editingRequestId;
      } else {
        // Try different possible field names for the leave ID
        finalLeaveId = responseData.id || 
                      responseData.leaveId || 
                      responseData.leave_id || 
                      responseData.data?.id || 
                      responseData.data?.leaveId;
        
        console.log('🎯 Extracted Leave ID:', finalLeaveId);
        console.log('🎯 Full response for debugging:', responseData);
        
        // If we still can't find it, check the data property
        if (!finalLeaveId && responseData.data) {
          console.log('🔍 Checking data property:', responseData.data);
          finalLeaveId = responseData.data.id || responseData.data.leaveId;
        }
      }

      if (!finalLeaveId) {
        console.error('❌ Could not find leave ID in response:', responseData);
        throw new Error('Could not determine leave ID from server response');
      }

      console.log('🎯 Final Leave ID for document upload:', finalLeaveId);

      // Step 2: Upload files separately if any
      const hasDocuments = selectedLeaveDocuments.length > 0 || formData.attachment;
      
      if (hasDocuments) {
        console.log('📎 Starting document upload process...');
        
        const uploadFormData = new FormData();
        
        // Ensure uploaded_by is always a string
        const uploaded_by = (user?.id?.toString() || formData.employee_id?.toString() || '');
        if (!uploaded_by) {
          throw new Error('Could not determine user ID for upload');
        }
        
        uploadFormData.append('uploaded_by', uploaded_by);
        
        // Add files to FormData - Use 'attachments' field name
        if (selectedLeaveDocuments.length > 0) {
          selectedLeaveDocuments.forEach((doc, idx) => {
            if (doc.file) {
              console.log(`📎 Appending file to FormData: ${doc.file.name}`);
              uploadFormData.append('attachments', doc.file);
            }
          });
        } else if (formData.attachment) {
          console.log(`📎 Appending single file to FormData: ${formData.attachment.name}`);
          uploadFormData.append('attachments', formData.attachment);
        }

        try {
          // Upload files to the separate endpoint
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/v1/leaves/${finalLeaveId}/documents`,
            uploadFormData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
                'Content-Type': 'multipart/form-data'
              },
              timeout: 60000,
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total || 1)
                );
                console.log(`📤 Upload Progress: ${percentCompleted}%`);
              }
            }
          );
          
          console.log('✅ Documents uploaded successfully:', uploadResponse.data);
        } catch (uploadError) {
          console.error('❌ Document upload failed:', uploadError);
          // Don't fail the entire request if document upload fails
          showNotification('Leave created but document upload failed', 'error');
        }
      } else {
        console.log('📭 No documents to upload');
      }

      // Success
      console.log('🎉 Leave submission completed successfully');
      showNotification(
        isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 
        'success'
      );
      
      // Reset form and preview
      setFormData({
        type: '',
        startDate: undefined,
        endDate: undefined,
        reason: '',
        attachment: null,
        employee_id: undefined,
        isHalfDay: false
      });
      resetLeaveAttachment();
      clearPreview(); // Clear preview data
      setShowRequestModal(false);
      setIsEditing(false);
      setEditingRequestId(null);
      setEditingRequestAttachment(null);
      fetchLeaveData();

    //} catch (err) {
      // console.error('❌ LEAVE SUBMISSION ERROR:', err);
      // if (axios.isAxiosError(err)) {
      //   console.error('❌ Axios error details:', {
      //     status: err.response?.status,
      //     data: err.response?.data,
      //     message: err.response?.data?.message,
      //     error: err.response?.data?.error
      //   });
        
      //   const errorMessage = err.response?.data?.message || 
      //                      err.response?.data?.error || 
      //                      'Failed to submit leave request. Please try again.';
      //   showNotification(errorMessage, 'error');
      // } else {
      //   console.error('❌ Non-Axios error:', err);
      //   showNotification('Failed to submit leave request. Please try again.', 'error');
      // }.
      } catch (updateError) {
      if (axios.isAxiosError(updateError) && updateError.response?.status === 400) {
            const errorMessage = updateError.response?.data?.error || 'Failed to update leave request';
            
            // Check for specific error messages
            if (errorMessage.includes('No working days found') || 
                errorMessage.includes('contains only weekends')) {
              showNotification(
                `Cannot update leave: ${errorMessage}. Please select dates that include weekdays.`,
                'error'
              );
              return;
            } else {
              showNotification(errorMessage, 'error');
            }
                      } else {
            throw updateError;
          }
    } finally {
      setIsSubmitting(false); // End loading regardless of success/error
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
      // Pass exclude_leave_id when in edit mode
    if (isEditing && editingRequestId) {
      triggerPreviewCalculation(newFormData, editingRequestId);
    } else {
      triggerPreviewCalculation(newFormData);
    }
  //triggerPreviewCalculation(newFormData);
  };

const triggerPreviewCalculation0112 = async (formDataToCheck: typeof formData) => {
  // Check each required field individually with type safety
  const missingFields = [];
  
  if (!formDataToCheck.startDate) missingFields.push('startDate');
  if (!formDataToCheck.endDate) missingFields.push('endDate');
  if (!formDataToCheck.type) missingFields.push('type');
  if (!formDataToCheck.employee_id) missingFields.push('employee_id');
  
  // Log missing fields if any
  if (missingFields.length > 0) {
    console.log(`Missing or empty fields: ${missingFields.join(', ')}`);
    return; // Not enough data yet
  }

  // At this point, TypeScript knows these values exist, but we need to assert them
  const employeeId = formDataToCheck.employee_id!;
  const startDate = formDataToCheck.startDate!;
  const endDate = formDataToCheck.endDate!;
  const leaveType = formDataToCheck.type!;
  
  const selectedType = leaveTypesByEmployeeId.find(type => 
    type.leave_type_name.toLowerCase() === leaveType.toLowerCase()
  );
  
  if (!selectedType) {
    console.log('No matching leave type found for:', leaveType);
    return;
  }

  try {
    await calculateLeavePreview({
      employee_id: employeeId, // Now guaranteed to be a number
      leave_type_id: selectedType.id,
      start_date: calculateDateInUTC(startDate).toISOString().split('T')[0], // Now guaranteed to be a Date
      end_date: calculateDateInUTC(endDate).toISOString().split('T')[0], // Now guaranteed to be a Date
      is_half_day: formDataToCheck.isHalfDay
    });
  } catch (error) {
    console.error('Failed to calculate preview:', error);
  }
};

// In your LeaveOverview component
const triggerPreviewCalculation = async (formDataToCheck: typeof formData, excludeLeaveId?: number) => {
  // Check each required field individually with type safety
  const missingFields = [];
  
  if (!formDataToCheck.startDate) missingFields.push('startDate');
  if (!formDataToCheck.endDate) missingFields.push('endDate');
  if (!formDataToCheck.type) missingFields.push('type');
  
  // Get employee_id from user if not in formData
  const employeeId = formDataToCheck.employee_id || user?.id;
  if (!employeeId) missingFields.push('employee_id');
  
  // Log missing fields if any
  if (missingFields.length > 0) {
    console.log(`Missing or empty fields: ${missingFields.join(', ')}`);
    return; // Not enough data yet
  }

  // At this point, TypeScript knows these values exist
  const startDate = formDataToCheck.startDate!;
  const endDate = formDataToCheck.endDate!;
  const leaveType = formDataToCheck.type!;
  
  const selectedType = leaveTypesByEmployeeId.find(type => 
    type.leave_type_name.toLowerCase() === leaveType.toLowerCase()
  );
  
  if (!selectedType) {
    console.log('No matching leave type found for:', leaveType);
    return;
  }

  try {
    await calculateLeavePreview({
      employee_id: employeeId!,
      leave_type_id: selectedType.id,
      start_date: calculateDateInUTC(startDate).toISOString().split('T')[0],
      end_date: calculateDateInUTC(endDate).toISOString().split('T')[0],
      is_half_day: formDataToCheck.isHalfDay,
      exclude_leave_id: excludeLeaveId // Pass the exclude parameter
    });
  } catch (error) {
    console.error('Failed to calculate preview:', error);
  }
};

  // Update validateForm to include date conflict check
  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      type: '',
      reason: '',
      startDate: '',
      endDate: '',
      attachment: '',
      employee_id: '',
      general: ''
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
  const getRemainingDays_0812 = () => {
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

  // Get remaining days for selected leave type
const getRemainingDays = () => {
  if (!formData.type || formData.type === 'Select') return 0;
  
  const selectedType = leaveTypesByEmployeeId.find(type => 
    type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
  );
  
  if (!selectedType) return 0;

  // Find the balance using leave_type_name instead of ID
  const balance = leaveBalances.find(b => 
    b.leave_type_name.toLowerCase() === formData.type.toLowerCase()
  );
  
  if (!balance) {
    // If no balance found, it might be unpaid leave or a type without balance
    return formData.type.toLowerCase() === 'unpaid leave' ? 999 : 0;
  }

  // Calculate remaining days based on balance type
  let remainingDays = 0;
  if (balance.is_total) {
    remainingDays = balance.remaining_days ?? 0;
  } else if (balance.is_divident) {
    remainingDays = balance.accrual_remaining_days ?? 0;
  } else {
    remainingDays = balance.remaining_days ?? 0;
  }

  // Remove the auto-conversion logic from here
  // This should only be done in handleLeaveTypeChange
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


const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newType = e.target.value;
  
  // Skip check if "Select" is chosen
  if (newType === 'Select') {
    setFormData(prev => ({ ...prev, type: newType }));
    clearPreview();
    return;
  }

  // Find the selected leave type using leaveTypesByEmployeeId
  const selectedType = leaveTypesByEmployeeId.find(type => 
    type.leave_type_name.toLowerCase() === newType.toLowerCase()
  );
  
  if (!selectedType) return;

  // Find the corresponding balance
  const balance = leaveBalances.find(b => 
    b.leave_type_name.toLowerCase() === newType.toLowerCase()
  );

  // IMPORTANT: Only auto-convert to unpaid leave when there are actually 0 remaining days
  // Check if this leave type has a balance (might not exist for unpaid leave)
  if (balance) {
    let remainingDays = 0;
    
    // Calculate remaining days based on balance type
    if (balance.is_total) {
      remainingDays = balance.remaining_days ?? 0;
    } else if (balance.is_divident) {
      remainingDays = balance.accrual_remaining_days ?? 0;
    } else {
      remainingDays = balance.remaining_days ?? 0;
    }

    // Only convert to unpaid leave if there are 0 remaining days AND it's not already unpaid leave
    if (remainingDays === 0 && newType.toLowerCase() !== 'unpaid leave') {
      const unpaidLeave = leaveTypesByEmployeeId.find(type => 
        type.leave_type_name.toLowerCase() === 'unpaid leave'
      );
      
      if (unpaidLeave) {
        // Update form data with unpaid leave
        const updatedFormData = { 
          ...formData, 
          type: 'unpaid leave',
          // Also clear preview since we're changing type
        };
        setFormData(updatedFormData);
        showNotification(`Leave type changed to Unpaid Leave as you have no remaining ${selectedType.leave_type_name} days`, 'error');
        clearPreview();
        return;
      }
    }
  }

  // If no conversion needed, set the selected type
  const updatedFormData = { ...formData, type: newType };
  setFormData(updatedFormData);
  
  // Only trigger preview if we have all required data
  if (formData.employee_id && formData.startDate && formData.endDate) {
    triggerPreviewCalculation(updatedFormData);
  }
};

  // Add function to handle leave type change
  const handleLeaveTypeChange0812 = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    const updatedFormData = { ...formData, type: newType };
    setFormData(updatedFormData);
    triggerPreviewCalculation(updatedFormData);
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

  const handleViewRequest3011 = async (request: RecentLeaveRequest) => {
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


  // Add this function in your component, after other handler functions
const handleHalfDayToggle0112 = (isHalfDay: boolean) => {
  const newFormData = { ...formData, isHalfDay };
  setFormData(newFormData);

  // Trigger preview calculation if all required fields are filled
  if (formData.employee_id && formData.type && formData.startDate && formData.endDate) {
    const selectedLeaveType = leaveTypes.find(
      (type) => type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
    );
    
    if (selectedLeaveType) {
      // Trigger preview calculation
      calculateLeavePreview({
        employee_id: formData.employee_id,
        leave_type_id: selectedLeaveType.id,
        start_date: formData.startDate.toISOString().split('T')[0],
        end_date: formData.endDate.toISOString().split('T')[0],
        is_half_day: isHalfDay
      }).catch((error) => {
        console.error('Failed to calculate preview:', error);
      });
    }
  }
};

const handleHalfDayToggle = (isHalfDay: boolean) => {
  const newFormData = { ...formData, isHalfDay };
  setFormData(newFormData);

  // Trigger preview calculation with exclude_leave_id when editing
  if (formData.employee_id && formData.type && formData.startDate && formData.endDate) {
    const selectedLeaveType = leaveTypesByEmployeeId.find(
      (type) => type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
    );
    
    if (selectedLeaveType) {
      // Pass exclude_leave_id when in edit mode
      const excludeId = isEditing && editingRequestId ? editingRequestId : undefined;
      
      calculateLeavePreview({
        employee_id: formData.employee_id,
        leave_type_id: selectedLeaveType.id,
        start_date: formData.startDate.toISOString().split('T')[0],
        end_date: formData.endDate.toISOString().split('T')[0],
        is_half_day: isHalfDay,
        exclude_leave_id: excludeId
      }).catch((error) => {
        console.error('Failed to calculate preview:', error);
      });
    }
  }
};

const handleViewRequest = async (request: RecentLeaveRequest) => {
  try {
    let documents = [];
    try {
      const documentsResponse = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      documents = documentsResponse.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.log('No documents found for this leave application');
        documents = [];
      } else {
        console.error('Error fetching leave documents:', err);
      }
    }
    
    // Store all documents separately
    setSelectedRequestDocuments(documents);
    
    // For backward compatibility, still set the first document on selectedRequest
    const requestWithFirstDocument = { 
      ...request,
      document_url: documents && documents.length > 0 ? documents[0].document_url : undefined,
      file_name: documents && documents.length > 0 ? documents[0].file_name : undefined,
      document_id: documents && documents.length > 0 ? documents[0].id : undefined
    };
    
    setSelectedRequest(requestWithFirstDocument);
    setIsViewModalOpen(true);
  } catch (err) {
    console.error('Error in handleViewRequest:', err);
    setSelectedRequest(request);
    setSelectedRequestDocuments([]);
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

  const downloadAttachment = async (documentId: number, fileName: string) => {
    try {
      console.log(`📥 Downloading leave attachment: ${fileName} with ID: ${documentId}`);
      
      // Use the backend endpoint that redirects to S3 presigned URL
      const downloadUrl = `${API_BASE_URL}/api/v1/leaves/attachments/${documentId}/download`;
      
      // Open in new tab - this will follow the redirect to the S3 presigned URL
      window.open(downloadUrl, '_blank');
      
      showNotification(`Downloading ${fileName}`, 'success');
      
    } catch (error: any) {
      console.error('❌ Download error:', error);
      showNotification(`Failed to download: ${fileName}`, 'error');
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

  // Get top 3 leave balances
  const getTopLeaveBalances = () => {
    if (!leaveBalances || leaveBalances.length === 0) {
      return [];
    }

    // Filter out total balances if needed
    const filteredBalances = leaveBalances.filter(balance => 
      !balance.is_total && balance.leave_type_name.toLowerCase() !== 'unpaid leave'
    );

    // Sort by remaining_days descending, then by leave_type_name if equal
    const sortedBalances = [...filteredBalances].sort((a, b) => {
      const aRemaining = a.is_divident ? a.accrual_remaining_days : a.remaining_days;
      const bRemaining = b.is_divident ? b.accrual_remaining_days : b.remaining_days;
      
      if (bRemaining !== aRemaining) {
        return bRemaining - aRemaining;
      }
      
      return a.leave_type_name.localeCompare(b.leave_type_name);
    });

    // Return top 3
    return sortedBalances.slice(0, 3);
  };

  // Get icon for leave type (reuse existing SVG icons)
  const getLeaveIcon = (index: number) => {
    const icons = [
      <svg key={0} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      <svg key={1} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>,
      <svg key={2} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ];
    
    return icons[index % icons.length];
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

        {/* Dynamic Leave Balance Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`skeleton-${index}`} className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
                <div className="stat-figure text-white">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20 rounded-full animate-pulse"></div>
                </div>
                <div className="stat-title text-white text-sm sm:text-base">
                  <div className="h-4 w-24 bg-white/20 rounded animate-pulse mb-1"></div>
                </div>
                <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">
                  <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div>
                </div>
                <div className="stat-desc text-white text-xs sm:text-sm">
                  <div className="h-3 w-32 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : leaveBalances.length === 0 ? (
            // No data placeholder
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`empty-${index}`} className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
                <div className="stat-figure text-white">
                  {getLeaveIcon(index)}
                </div>
                <div className="stat-title text-white text-sm sm:text-base">No Data</div>
                <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">0</div>
                <div className="stat-desc text-white text-xs sm:text-sm">0 used / 0 total</div>
              </div>
            ))
          ) : (
            // Dynamic leave balance cards
            getTopLeaveBalances().map((balance, index) => {
              const remainingDays = balance.is_divident ? balance.accrual_remaining_days : balance.remaining_days;
              const usedDays = balance.used_days || 0;
              const totalDays = balance.total_days || 0;
              
              return (
                <div key={balance.id} className={`stat shadow rounded-lg p-3 sm:p-4 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-700 to-blue-600'} text-white`}>
                  <div className="stat-figure text-white">
                    {getLeaveIcon(index)}
                  </div>
                  <div className="stat-title text-white text-sm sm:text-base">{balance.leave_type_name}</div>
                  <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">
                    {remainingDays ?? 0}
                  </div>
                  <div className="stat-desc text-white text-xs sm:text-sm">
                    {usedDays} used / {totalDays} total
                  </div>
                </div>
              );
            })
          )}
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
  <div className={`modal-box max-w-4xl p-0 overflow-hidden max-h-[90vh] ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} relative`}>
    {/* Loading Overlay */}
    {isSubmitting && (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
        <div className={`p-6 rounded-lg flex flex-col items-center ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}>
          <span className="loading loading-spinner loading-lg text-primary mb-2"></span>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            {isEditing ? 'Updating leave request...' : 'Submitting leave request...'}
          </p>
          <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
            Please wait while we process your request
          </p>
        </div>
      </div>
    )}
    
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
            clearPreview(); // Clear preview when modal closes
            setErrors({
              type: '',
              reason: '',
              startDate: '',
              endDate: '',
              attachment: '',
              employee_id: '',
              general: ''
            });
          }}
        >✕</button>
      </form>
    </div>

    {/* Modal Content */}
    <div className={`p-6 overflow-y-auto max-h-[calc(90vh-4rem)] ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Form Inputs */}
          <div className="space-y-6">
            {/* Leave Type & Reason */}
            <div className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type</span>
                  <span className="label-text-alt text-red-500">*</span>
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
                  disabled={isLoading || isSubmitting}
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
                  <span className="label-text-alt text-red-500">*</span>
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
                  disabled={isSubmitting}
                />
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Start Date</span>
                    <span className="label-text-alt text-red-500">*</span>
                  </label>
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.startDate ? 'border border-red-500' : ''}`}>
                    <input
                      type="date"
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                      value={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDateChange(e.target.value, true)}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>End Date</span>
                    <span className="label-text-alt text-red-500">*</span>
                  </label>
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-slate-700'} ${errors.endDate ? 'border border-red-500' : ''}`}>
                    <input
                      type="date"
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                      value={formData.endDate ? calculateDateInUTC(formData.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDateChange(e.target.value, false)}
                      min={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : calculateDateInUTC(new Date()).toISOString().split('T')[0]}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              {/* Balance Warning */}
              {isDurationExceeded() && (
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-800'}`}>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-600 text-sm">
                      Warning: Your request duration exceeds your remaining leave balance.
                    </span>
                  </div>
                </div>
              )}

              {/* Half Day Toggle - Only show when dates are same */}
              {formData.startDate && formData.endDate && 
               calculateDateInUTC(formData.startDate).toISOString().split('T')[0] === calculateDateInUTC(formData.endDate).toISOString().split('T')[0] && (
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Half Day Leave</h4>
                      <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        Select if you're taking only half a day off
                      </p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        className={`toggle toggle-lg ${formData.isHalfDay ? (theme === 'light' ? 'toggle-primary' : 'toggle-accent') : ''}`}
                        checked={formData.isHalfDay}
                        onChange={(e) => {
                          setFormData({ ...formData, isHalfDay: e.target.checked });
                          handleHalfDayToggle(e.target.checked);
                        }}
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="space-y-6">
              {/* Show existing documents if editing */}
              {isEditing && editingRequestDocuments && editingRequestDocuments.length > 0 && (
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Existing Documents</span>
                  </label>
                  <ul className="space-y-2">
                    {editingRequestDocuments.map((doc, idx) => (
                      <li key={doc.id || idx} className={`flex items-center justify-between p-3 rounded ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <span className={`text-sm truncate max-w-[200px] ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{doc.file_name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (doc.id) {
                              downloadAttachment(doc.id, doc.file_name || 'attachment');
                            }
                          }}
                          className={`btn btn-xs ${theme === 'light' ? 'btn-outline btn-primary' : 'btn-outline btn-accent'}`}
                          disabled={isSubmitting}
                        >
                          Download
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Attachment Upload */}
              <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-700 border border-slate-600'}`}>
                <label className="label mb-2">
                  <span className={`label-text font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Supporting Documents
                    {/* {formData.type && leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase())?.requires_documentation && (
                      <span className="text-red-500 ml-2">* Required</span>
                    )}
                  </span> */}
{(() => {
        if (!formData.type || formData.type === 'Select') return null;
        
        // Clean and normalize the type name
        const selectedTypeName = formData.type.toLowerCase().trim();
        const leaveType = leaveTypesByEmployeeId.find(type => 
          type.leave_type_name.toLowerCase().trim() === selectedTypeName
        );
        
        console.log('Selected Type:', selectedTypeName);
        console.log('Found Leave Type:', leaveType);
        console.log('Requires Docs:', leaveType?.requires_documentation);
        
        if (leaveType?.requires_documentation) {
          return <span className="text-red-500 ml-2">* Required</span>;
        }
        
        return null;
      })()}
    </span>
                </label>
                <div className={`${errors.attachment ? 'border border-red-500 rounded-lg p-3' : ''}`}>
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
                {errors.attachment && <p className="text-red-500 text-sm mt-2">{errors.attachment}</p>}
                <div className="label-text-alt mt-3">
                  <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Supported formats: PDF, JPG, PNG, DOC, DOCX • Max size: 10MB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <button 
  type="button" 
  onClick={() => triggerPreviewCalculation(formData)}
  className="btn btn-sm btn-outline"
>
  Test Preview
</button> */}

          {/* Right Column: Leave Calculation Preview */}
          <div>
            {/* Leave Calculation Preview Card */}
            <div className={`sticky top-0 rounded-lg ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200' : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600'}`}>
              <div className="p-4 border-b border-blue-200 dark:border-slate-600">
                <h4 className={`font-bold text-lg flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Leave Calculation
                  {isLoadingPreview && (
                    <div className="loading loading-spinner loading-xs ml-2"></div>
                  )}
                </h4>
              </div>

              <div className="p-4">
                {/* When preview is loading */}
                {isLoadingPreview && (
                  <div className="space-y-4">
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-16 w-full"></div>
                    <div className="skeleton h-24 w-full"></div>
                  </div>
                )}

                {/* When there's an error */}
                {previewError && !isLoadingPreview && (
                  <div className={`alert alert-error ${theme === 'light' ? '' : 'bg-red-900/20'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{previewError}</span>
                  </div>
                )}

                {/* When preview data is available */}
                {previewData && !isLoadingPreview && !previewError && (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-lg text-center ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
                        <div className={`text-xs mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                          Calculated Duration
                          {formData.isHalfDay && <span className="block text-amber-600">(Half Day)</span>}
                        </div>
                        <div className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                          {previewData.calculation?.duration ?? 0} {formData.isHalfDay ? '½' : ''} day{previewData.calculation?.duration !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-lg text-center ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
                        <div className={`text-xs mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Available Balance</div>
                        <div className={`text-2xl font-bold ${
                          previewData.balance?.sufficient 
                            ? (theme === 'light' ? 'text-green-600' : 'text-green-400') 
                            : 'text-red-600'
                        }`}>
                          {previewData.balance?.available ?? 0}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {/* <div className="flex justify-center">
                      <div className={`badge badge-lg ${previewData.can_proceed ? 'badge-success' : 'badge-error'} gap-2`}>
                        {previewData.can_proceed ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ready to Submit
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Issues Found
                          </>
                        )}
                      </div>
                    </div> */}

                    {/* Breakdown Section */}
                    {/* {previewData.calculation?.breakdown && (
                      <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-white border border-blue-100' : 'bg-slate-800 border border-slate-600'}`}>
                        <h5 className={`font-medium mb-3 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Calculation Breakdown</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Total Work Days:</span>
                            <span className="font-semibold">{previewData.calculation.breakdown.total_work_days}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Holidays Excluded:</span>
                            <span className="font-semibold">{previewData.calculation.breakdown.holidays_excluded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Actual Working Days:</span>
                            <span className={`font-semibold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                              {previewData.calculation.breakdown.actual_working_days}
                            </span>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* Validation Messages */}
                    <div className="space-y-2">
                      {previewData.validation?.has_sufficient_balance === false && (
                        <div className={`alert alert-warning py-2 ${theme === 'light' ? '' : 'bg-amber-900/20'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-xs">Insufficient leave balance</span>
                        </div>
                      )}
                      
                      {previewData.validation?.has_overlapping_leaves && (
                        <div className={`alert alert-warning py-2 ${theme === 'light' ? '' : 'bg-amber-900/20'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-xs">Overlapping leave exists</span>
                        </div>
                      )}

                      {previewData.validation?.requires_documentation && (
                        <div className={`alert alert-info py-2 ${theme === 'light' ? '' : 'bg-blue-900/20'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-xs">Documentation required</span>
                        </div>
                      )}

                      {previewData.can_proceed && !previewError && (
                        <div className={`alert alert-success py-2 ${theme === 'light' ? '' : 'bg-green-900/20'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs">All checks passed! Ready to submit.</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    {/* <div className={`text-center pt-4 border-t ${theme === 'light' ? 'border-blue-100' : 'border-slate-600'}`}>
                      <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        Preview updates automatically as you fill the form
                      </p>
                    </div> */}
                  </div>
                )}

                {/* Default message when no preview yet */}
                {!previewData && !isLoadingPreview && !previewError && (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto mb-3 ${theme === 'light' ? 'text-slate-300' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h5 className={`font-medium mb-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Preview Will Appear Here</h5>
                    <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                      Fill in the leave details to see calculation preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
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
                attachment: '',
                employee_id: '',
                general: ''
              });
              setFormData({
                type: '',
                startDate: undefined,
                endDate: undefined,
                reason: '',
                attachment: null,
                employee_id: undefined,
                isHalfDay: false
              });
              setIsEditing(false);
              setEditingRequestId(null);
              setEditingRequestAttachment(null);
              setSelectedLeaveDocuments([]);
              resetLeaveAttachment();
              clearPreview();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {isEditing ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              isEditing ? 'Update Request' : 'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button onClick={() => setShowRequestModal(false)} disabled={isSubmitting}>close</button>
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
                {/* {selectedRequest.document_url && (
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Attachment</h4>
                    <div className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (selectedRequest.document_id) {
                            downloadAttachment(selectedRequest.document_id, selectedRequest.file_name || 'attachment');
                          } else {
                            showNotification('Document ID not found', 'error');
                          }
                        }}
                        className={`text-xs sm:text-sm font-medium truncate flex items-center gap-2 ${theme === 'light' ? 'text-primary hover:text-primary-focus' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
                        style={{ cursor: 'pointer' }}
                      >
                        Download {selectedRequest.file_name}
                      </a>
                    </div>
                  </div>
                )} */}
{selectedRequestDocuments && selectedRequestDocuments.length > 0 && (
  <div>
    <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
      Attachments ({selectedRequestDocuments.length})
    </h4>
    <div className="space-y-2">
      {selectedRequestDocuments.map((doc, index) => (
        <div 
          key={doc.id || index} 
          className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
          </svg>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (doc.id) {
                downloadAttachment(doc.id, doc.file_name || `attachment-${index + 1}`);
              } else {
                showNotification('Document ID not found', 'error');
              }
            }}
            className={`text-xs sm:text-sm font-medium truncate flex items-center gap-2 ${theme === 'light' ? 'text-primary hover:text-primary-focus' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
            style={{ cursor: 'pointer' }}
          >
            Download {doc.file_name || `Attachment ${index + 1}`}
          </a>
        </div>
      ))}
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
