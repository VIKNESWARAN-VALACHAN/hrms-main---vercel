// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import Link from 'next/link';
// import { FaChevronDown } from "react-icons/fa";
// import { FaRegCalendarTimes } from "react-icons/fa";
// import { BsCheckCircle } from "react-icons/bs";
// import { BsXCircle } from "react-icons/bs";
// import { BsEye } from "react-icons/bs";
// import { calculateDateInUTC, calculateDuration, getBadgeClass, getDateAndTime } from '../utils/utils';
// import EmployeeDocumentManager from '../components/EmployeeDocumentManager';
// import NotificationToast from '../components/NotificationToast';
// import { useNotification } from '../hooks/useNotification';
// import { useTheme } from '../components/ThemeProvider';

// interface LeaveRequest {
//   id: number;
//   employee_id: number;
//   employee_name: string;
//   company_id: number;
//   company_name: string;
//   department_name: string;
//   leave_type_id: number;
//   leave_type_name: string;
//   start_date: string;
//   end_date: string;
//   duration: number;
//   reason: string;
//   status: 'PENDING' | 'FIRST_APPROVED' | 'APPROVED' | 'REJECTED';
//   first_approver_id?: number;
//   first_approver_name?: string;
//   first_approval_date?: string;
//   first_approval_comment?: string;
//   second_approver_id?: number;
//   second_approver_name?: string;
//   second_approval_date?: string;
//   second_approval_comment?: string;
//   rejection_reason?: string;
//   created_at: string;
//   updated_at: string;
//   document_url?: string;
//   document_type?: string;
//   file_name?: string;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

// interface LeaveType {
//   id: number;
//   leave_type_name: string;
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

// const AdminLeaveRequest = () => {  
//   const { notification, showNotification } = useNotification();
//   const { theme } = useTheme();
//   const router = useRouter();
//   const displayRow = 10;
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
//   const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
//   const [rejectReason, setRejectReason] = useState('');
//   const [rejectError, setRejectError] = useState<string>('');
//   const [approveComment, setApproveComment] = useState('');
//   const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
//   const [employeeLeaveApplications, setEmployeeLeaveApplications] = useState<LeaveRequest[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [user, setUser] = useState<User | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
//   const [approvedCurrentPage, setApprovedCurrentPage] = useState(1);
//   const [rejectedCurrentPage, setRejectedCurrentPage] = useState(1);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [isRejectAllConfirmModalOpen, setIsRejectAllConfirmModalOpen] = useState(false);
  
//   const [formData, setFormData] = useState({
//     type: '',
//     startDate: undefined as Date | undefined,
//     endDate: undefined as Date | undefined,
//     reason: '',
//     attachment: null as File | null,
//     employee_id: undefined as number | undefined,
//     isHalfDay: false
//   });
//   const [errors, setErrors] = useState({
//     type: '',
//     reason: '',
//     startDate: '',
//     endDate: '',
//     attachment: '',
//     employee_id: ''
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
//   const [editingRequestAttachment, setEditingRequestAttachment] = useState<{ url: string, name: string } | null>(null);
//   const [selectedLeaveDocuments, setSelectedLeaveDocuments] = useState<any[]>([]);
//   const [editingRequestDocuments, setEditingRequestDocuments] = useState<any[]>([]);
//   const [documentManagerKey, setDocumentManagerKey] = useState(0);
//   const [leaveTypesByEmployeeId, setLeaveTypesByEmployeeId] = useState<LeaveType[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [employees, setEmployees] = useState<Array<{id: number; name: string; email: string; employee_no: string}>>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<Array<{id: number; name: string; email: string; employee_no: string}>>([]);
//   const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);

//   // For form fields (unapplied filters)
//   const [form, setForm] = useState({ 
//     status: 'All', 
//     startDate: '', 
//     endDate: '', 
//     company: 'All',
//     department: 'All' 
//   });

//   // For applied filters (used for filtering)
//   const [filters, setFilters] = useState({ 
//     status: 'All', 
//     startDate: '', 
//     endDate: '', 
//     company: 'All',
//     department: 'All' 
//   });

//   const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);

//   // Function to handle quick date selection
//   const handleQuickDateSelect = (option: string) => {
//     const today = new Date();
//     let startDate = new Date();
//     let endDate = new Date();
    
//     switch (option) {
//       case 'today':
//         // Start and end are both today
//         startDate = new Date(today.setHours(0, 0, 0, 0));
//         endDate = new Date(new Date().setHours(23, 59, 59, 999));
//         break;
//       case 'yesterday':
//         // Set to yesterday
//         startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 1);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(today);
//         endDate.setDate(endDate.getDate() - 1);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'thisWeek':
//         // Start of current week (Sunday) to today
//         const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
//         startDate = new Date(today);
//         startDate.setDate(today.getDate() - dayOfWeek);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(today.setHours(23, 59, 59, 999));
//         break;
//       case 'lastWeek':
//         // Last week (Sunday to Saturday)
//         const lastWeekEnd = new Date(today);
//         lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
//         lastWeekEnd.setHours(23, 59, 59, 999);
        
//         startDate = new Date(lastWeekEnd);
//         startDate.setDate(lastWeekEnd.getDate() - 6);
//         startDate.setHours(0, 0, 0, 0);
        
//         endDate = lastWeekEnd;
//         break;
//       case 'thisMonth':
//         // Start of current month to today
//         startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(today.setHours(23, 59, 59, 999));
//         break;
//       case 'lastMonth':
//         // Last month (1st to last day)
//         startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         startDate.setHours(0, 0, 0, 0);
        
//         endDate = new Date(today.getFullYear(), today.getMonth(), 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       default:
//         setActiveQuickDate(null);
//         return;
//     }
    
//     // Format dates for display and filter
//     const formattedStartDate = startDate.toISOString().split('T')[0];
//     const formattedEndDate = endDate.toISOString().split('T')[0];
    
//     // Update form state with new date filters
//     const updatedForm = {
//       ...form,
//       startDate: formattedStartDate,
//       endDate: formattedEndDate
//     };
    
//     setForm(updatedForm);
    
//     // Set the active quick date filter
//     setActiveQuickDate(option);

//     // Reset pagination states
//     setCurrentPage(1);
//     setPendingCurrentPage(1);
//     setApprovedCurrentPage(1);
//     setRejectedCurrentPage(1);

//     // Apply the filters immediately
//     setFilters(updatedForm);
//   };

//   // Fetch leave requests on component mount
//   useEffect(() => {
//     fetchLeaveRequests();
//   }, []);

//   useEffect(() => {
//     const userData = localStorage.getItem('hrms_user');
//     if (userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (err) {
//         console.error('Error parsing user data:', err);
//       }
//     }
//   }, []);

//   const fetchLeaveRequests = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveRequests(response.data);
//       setError('');
//     } catch (err) {
//       console.error('Error fetching leave requests:', err);
//       setError('Failed to load leave requests. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchLeaveTypes = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveTypesByEmployeeId(response.data);
//     } catch (err) {
//       console.error('Error fetching leave types:', err);
//       showNotification('Failed to load leave types. Please try again.', 'error');
//     }
//   };

//   const fetchLeaveTypesByEmployeeId = async (employeeId: number) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         },
//         params: {
//           employeeId: employeeId
//         }
//       });
//       setLeaveTypesByEmployeeId(response.data);
//     } catch (err) {
//       console.error('Error fetching leave types:', err);
//       showNotification('Failed to load leave types. Please try again.', 'error');
//     }
//   };

//   const fetchLeaveBalances = async (employeeId: number) => {
//     const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/balance`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//       },
//       params: {
//         employeeId: employeeId,
//         year: new Date().getFullYear()
//       }
//     });
//     setLeaveBalances(response.data);
//   };

//   const handleViewRequest = async (request: LeaveRequest) => {
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

//   const handleRejectRequest = (request: LeaveRequest) => {
//     setSelectedRequest(request);
//     setIsRejectModalOpen(true);
//   };

//   const handleApproveRequest = (request: LeaveRequest) => {
//     setSelectedRequest(request);
//     setIsApproveModalOpen(true);
//   };

//   const handleRejectSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if(validateRejectForm()) {
//       if (!selectedRequest) return;
      
//       try {
//         const approvalLevel = selectedRequest.status === 'PENDING' ? 'FIRST' : 'FINAL';
        
//         await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/reject`, {
//           approver_id: user?.id,
//           reason: rejectReason,
//           approval_level: approvalLevel
//         }, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         });

//         // Refresh the leave requests list
//         await fetchLeaveRequests();
//         showNotification('Leave request rejected successfully', 'success');
        
//         setIsRejectModalOpen(false);
//         setRejectReason('');
//         setSelectedRequest(null);
//       } catch (err) {
//         console.error('Error rejecting leave request:', err);
//         showNotification('Failed to reject leave request. Please try again.', 'error');
//       }
//     }
//   };

//   const handleApproveSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedRequest) return;

//     try {
//       const approvalLevel = selectedRequest.status === 'PENDING' ? 'FIRST' : 'FINAL';
      
//       await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/approve`, {
//         approver_id: user?.id,
//         comment: approveComment,
//         approval_level: approvalLevel
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });

//       // Refresh the leave requests list
//       await fetchLeaveRequests();
//       showNotification('Leave request approved successfully', 'success');

//       setIsApproveModalOpen(false);
//       setApproveComment('');
//       setSelectedRequest(null);
//     } catch (err) {
//       console.error('Error approving leave request:', err);
//       showNotification('Failed to approve leave request. Please try again.', 'error');
//     }
//   };

//   const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, company: e.target.value });
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setFilters(form);
//   };

//   const resetLeaveFilters = () => {
//     // Reset form state
//     setForm({
//       status: 'All',
//       startDate: '',
//       endDate: '',
//       company: 'All',
//       department: 'All'
//     });

//     // Reset filters state
//     setFilters({
//       status: 'All',
//       startDate: '',
//       endDate: '',
//       company: 'All',
//       department: 'All'
//     });

//     // Reset active quick date
//     setActiveQuickDate(null);
//   };

//   const getDays = (start: string, end: string) => {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const days = [];
//     for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
//       days.push(new Date(dt));
//     }
//     return days;
//   };

//   const isDateBetween = (dateToCheck: Date, startDate: Date, endDate: Date) => {
//     return dateToCheck >= startDate && dateToCheck <= endDate;
//   };

//   const filteredData = leaveRequests.filter((item) => {
//     // Status filter
//     const statusMatch = filters.status === 'All' || 
//       item.status.toLowerCase() === filters.status.toLowerCase();

//     // Company filter
//     const companyMatch = filters.company === 'All' || 
//       (item.company_name !== undefined && item.company_name !== null && item.company_name.toLowerCase() === filters.company.toLowerCase());

//     // Department filter
//     const departmentMatch = filters.department === 'All' || 
//       (item.department_name !== undefined && item.department_name !== null && item.department_name.toLowerCase() === filters.department.toLowerCase());

//     // Date range filter
//     const startDate = filters.startDate ? new Date(filters.startDate) : null;
//     const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
//     let dateMatch = true;    
//     const days = getDays(item.start_date, item.end_date);
//     if (startDate && endDate) {
//       for (let i = 0; i < days.length; i++) {
//         dateMatch = isDateBetween(days[i], new Date(startDate), new Date(endDate));
//         if (dateMatch) break;
//       }
//     } else if (startDate) {
//       for (let i = 0; i < days.length; i++) {
//         dateMatch = new Date(item.start_date) >= startDate;
//       }
//     } else if (endDate) {
//       for (let i = 0; i < days.length; i++) {
//         dateMatch = new Date(item.end_date) <= endDate;
//       }
//     }

//     return statusMatch && companyMatch && departmentMatch && dateMatch;
//   });  

//   // Calculate paginated data for main table
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const paginatedRequests = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   // Pending pagination logic
//   const pendingRequests = leaveRequests.filter(item => item.status === 'PENDING' || item.status === 'FIRST_APPROVED');
//   const pendingTotalPages = Math.ceil(pendingRequests.length / itemsPerPage);
//   const paginatedPendingRequests = pendingRequests.slice((pendingCurrentPage - 1) * itemsPerPage, pendingCurrentPage * itemsPerPage);

//   // Approved pagination logic
//   const approvedRequests = leaveRequests.filter(item => item.status === 'APPROVED');
//   const approvedTotalPages = Math.ceil(approvedRequests.length / itemsPerPage);
//   const paginatedApprovedRequests = approvedRequests.slice((approvedCurrentPage - 1) * itemsPerPage, approvedCurrentPage * itemsPerPage);

//   // Rejected pagination logic
//   const rejectedRequests = leaveRequests.filter(item => item.status === 'REJECTED');
//   const rejectedTotalPages = Math.ceil(rejectedRequests.length / itemsPerPage);
//   const paginatedRejectedRequests = rejectedRequests.slice((rejectedCurrentPage - 1) * itemsPerPage, rejectedCurrentPage * itemsPerPage);

//   const companies = [...new Set(leaveRequests.filter(request => request.company_name !== null).map(request => request.company_name).sort())]

//   const departments = [...new Set(leaveRequests.filter(request => request.department_name !== null).map(request => request.department_name).sort())]

//   const validateRejectForm = () => {
//     if (!rejectReason.trim()) {
//       setRejectError('Please provide a reason for rejection');
//       return false;
//     }
//     setRejectError('');
//     return true;
//   };

//   const resetLeaveAttachment = () => {
//     setSelectedLeaveDocuments([]);
//     setFormData(prev => ({
//       ...prev,
//       attachment: null,
//       startDate: undefined,
//       endDate: undefined
//     }));
//     setEditingRequestAttachment(null);
//     setDocumentManagerKey(prev => prev + 1);
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const startDate = new Date(Date.UTC(
//         formData.startDate!.getFullYear(),
//         formData.startDate!.getMonth(),
//         formData.startDate!.getDate())
//       ).toISOString().split('T')[0];
//       const endDate = new Date(Date.UTC(
//         formData.endDate!.getFullYear(),
//         formData.endDate!.getMonth(),
//         formData.endDate!.getDate())
//       ).toISOString().split('T')[0];
//       try {
//         const selectedType = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type);
//         if (!selectedType) {
//           throw new Error('Invalid leave type');
//         }
//         let response;
//         if (isEditing && editingRequestId) {
//           // Update existing leave request
//           const updateFormData = new FormData();
//           updateFormData.append("leave_type_id", selectedType.id.toString());
//           updateFormData.append("start_date", startDate);
//           updateFormData.append("end_date", endDate);
//           updateFormData.append("reason", formData.reason);
//           if (formData.isHalfDay) {
//             updateFormData.append("is_half_day", "1");
//             updateFormData.append("duration", "0.5");
//           } 
//           // Add multiple attachments from EmployeeDocumentManager
//           if (selectedLeaveDocuments.length > 0) {
//             selectedLeaveDocuments.forEach((doc, idx) => {
//               if (doc.file) {
//                 updateFormData.append('attachments[]', doc.file);
//               }
//             });
//           } else if (formData.attachment) {
//             updateFormData.append("attachment", formData.attachment);
//           }
//           response = await axios.put(`${API_BASE_URL}/api/v1/leaves/admin/${editingRequestId}`, updateFormData, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           });
//         } else {
//           // Create new leave request
//           const formDataToSend = new FormData();
//           formDataToSend.append("employee_id", formData.employee_id?.toString() || '');
//           formDataToSend.append("leave_type_id", selectedType.id.toString());
//           formDataToSend.append("start_date", startDate);
//           formDataToSend.append("end_date", endDate);
//           formDataToSend.append("reason", formData.reason);          
//           if (formData.isHalfDay) {
//             formDataToSend.append("is_half_day", "1");
//             formDataToSend.append("duration", "0.5");
//           } 
//           formDataToSend.append("status", 'PENDING');
//           formDataToSend.append("admin_id", user?.id?.toString() || '');
//           // Add multiple attachments from EmployeeDocumentManager
//           if (selectedLeaveDocuments.length > 0) {
//             selectedLeaveDocuments.forEach((doc, idx) => {
//               if (doc.file) {
//                 formDataToSend.append('attachments[]', doc.file);
//               }
//             });
//           } else if (formData.attachment) {
//             formDataToSend.append("attachment", formData.attachment);
//           }
//           response = await axios.post(`${API_BASE_URL}/api/v1/leaves/admin`, formDataToSend, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           });
//         }
//         if (response.status === 201 || response.status === 200) {
//           showNotification(isEditing ? 'Leave request updated successfully!' : 'Leave request submitted successfully!', 'success');
//           setFormData({
//             type: '',
//             startDate: undefined,
//             endDate: undefined,
//             reason: '',
//             attachment: null,
//             employee_id: undefined,
//             isHalfDay: false
//           });
//           resetLeaveAttachment();
//           setShowRequestModal(false);
//           setIsEditing(false);
//           setEditingRequestId(null);
//           setEditingRequestAttachment(null);
//           fetchLeaveRequests();
//         }
//       } catch (err) {
//         console.error('Error submitting leave request:', err);
//         if (axios.isAxiosError(err) && err.response?.data?.message) {
//           showNotification(err.response.data.message, 'error');
//         } else {
//           showNotification('Failed to submit leave request. Please try again.', 'error');
//         }
//       }
//     }
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { 
//       employee_id: '',
//       type: '',
//       reason: '',
//       startDate: '',
//       endDate: '',
//       attachment: ''
//     };

//     if (!formData.type || formData.type === 'Select') {
//       newErrors.type = 'Please select a leave type';
//       isValid = false;
//     }

//     if (!formData.employee_id) {
//       newErrors.employee_id = 'Please select an employee';
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

//     // Check if attachment is required based on leave type
//     const selectedLeaveType = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase());
//     if (selectedLeaveType?.requires_documentation && selectedLeaveDocuments.length === 0) {
//       newErrors.attachment = 'Please upload required documentation';
//       isValid = false;
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

//   const handleLeaveRequestDateChange = (value: string, isStartDate: boolean) => {
//     const date = value ? new Date(value) : undefined;
//     const newFormData = { ...formData };
    
//     if (isStartDate) {
//       newFormData.startDate = date;
//     } else {
//       newFormData.endDate = date;
//     }

//     // Get emergency leave type and balance
//     const emergencyLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'emergency leave');
//     const emergencyBalance = emergencyLeave ? leaveBalances.find((b: LeaveBalance) => b.leave_type_id === emergencyLeave.id.toString()) : null;
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
//     if (formData.type.toLowerCase() === 'annual leave' && date && isLessThan5Days(date)) {
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
//     if (newFormData.startDate && newFormData.endDate && hasDateConflict(newFormData.startDate, newFormData.endDate)) {
//       showNotification('This date range conflicts with an existing leave request', 'error');
//       return;
//     }

//     setFormData(newFormData);
//   };

//   // Add function to check if dates are less than 5 days from today
//   const isLessThan5Days = (date: Date) => {
//     const today = new Date();
//     const diffTime = date.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays < 5;
//   };

//   // Add function to check for date conflicts
//   const hasDateConflict = (startDate: Date, endDate: Date): boolean => {
//     // Get all approved and pending leave requests for the selected employee
//     const existingRequests = employeeLeaveApplications.filter(
//       request => {
//         // When editing, exclude the current request from conflict check
//         if (isEditing && editingRequestId === request.id) {
//           return false;
//         }
//         return request.status === 'APPROVED' || request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
//       }
//     );

//     // Create array of dates between start and end date
//     const datesToCheck: Date[] = [];
//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       datesToCheck.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     // Check each date against existing requests
//     return datesToCheck.some(dateToCheck => {
//       return existingRequests.some(request => {
//         const requestStart = calculateDateInUTC(new Date(request.start_date));
//         const requestEnd = calculateDateInUTC(new Date(request.end_date));
//         return dateToCheck >= requestStart && dateToCheck <= requestEnd;
//       });
//     });
//   };

//   const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFormData({ ...formData, type: e.target.value });
//   };

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/admin/employees`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setEmployees(response.data);
//       setFilteredEmployees(response.data);
//     } catch (err) {
//       console.error('Error fetching employees:', err);
//       showNotification('Failed to load employees. Please try again.', 'error');
//     }
//   };

//   // Filter employees based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredEmployees(employees);
//       return;
//     }

//     const filtered = employees.filter(employee => 
//       employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.employee_no.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredEmployees(filtered);
//   }, [searchTerm, employees]);

//   const fetchEmployeeLeaveApplications = async (employeeId: number) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         },
//         params: {
//           employeeId: employeeId
//         }
//       });
//       setEmployeeLeaveApplications(response.data);
//     } catch (err) {
//       console.error('Error fetching employee leave applications:', err);
//       showNotification('Failed to load employee leave applications', 'error');
//     }
//   };

//   const handleEmployeeSelect = (employee: { id: number; name: string; email: string; employee_no: string }) => {
//     setFormData(prev => ({
//       ...prev,
//       employee_id: employee.id
//     }));
//     setSearchTerm(employee.name);
//     fetchLeaveTypesByEmployeeId(employee.id);
//     fetchEmployeeLeaveApplications(employee.id);
//     fetchLeaveBalances(employee.id);
//   };

//   const getRequestDuration = () => {
//     if (formData.isHalfDay) {
//       return 0.5;
//     }
//     if (!formData.startDate || !formData.endDate) return 0;
//     return calculateDuration(formData.startDate, formData.endDate);
//   };

//   const getRemainingDays = () => {
//     if (!formData.type) return 0;
//     const selectedType = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase());
//     if (!selectedType) return 0;
    
//     const leaveBalance = leaveBalances.find(balance => balance.leave_type_id === selectedType.id.toString());
//     if (!leaveBalance) return 0;
//     console.log(leaveBalance);
//     // For total days calculation
//     if (leaveBalance.is_total) {
//       return leaveBalance.total_days - leaveBalance.used_days;
//     }
    
//     // For dividend-based calculation
//     if (leaveBalance.is_divident) {
//       return leaveBalance.accrual_remaining_days;
//     }

//     // Default case: return total days minus used days
//     return leaveBalance.total_days - leaveBalance.used_days;
//   };

//   const downloadAttachment = async (requestId: number, fileName: string) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/download-attachment/${requestId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         },
//         responseType: 'blob'
//       });

//       // Create a blob from the response data
//       const blob = new Blob([response.data]);
//       const url = window.URL.createObjectURL(blob);
      
//       // Create a temporary link element and trigger the download
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = requestId + '-' + fileName;
//       document.body.appendChild(link);
//       link.click();
      
//       // Clean up
//       link.parentNode?.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error('Error downloading attachment:', err);
//       showNotification('Failed to download attachment. Please try again.', 'error');
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`${theme === 'light' ? 'bg-red-50 border-red-400' : 'bg-red-900/20 border-red-500'} border-l-4 p-4`}>
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg className={`h-5 w-5 ${theme === 'light' ? 'text-red-400' : 'text-red-300'}`} viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <p className={`text-sm ${theme === 'light' ? 'text-red-700' : 'text-red-200'}`}>{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const openEditModal = async (request: LeaveRequest) => {
//     setFormData({
//       type: request.leave_type_name.toLowerCase(),
//       startDate: new Date(request.start_date),
//       endDate: new Date(request.end_date),
//       reason: request.reason,
//       attachment: null,
//       employee_id: request.employee_id,
//       isHalfDay: request.duration === 0.5
//     });
//     setIsEditing(true);
//     setEditingRequestId(request.id);
//     setShowRequestModal(true);
//     // If the request has an attachment, set it for download
//     if (request.document_url && request.file_name) {
//       setEditingRequestAttachment({ url: request.document_url, name: request.file_name });
//     } else {
//       setEditingRequestAttachment(null);
//     }
//     // Fetch all documents for this leave application
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setEditingRequestDocuments(res.data);
//     } catch (err) {
//       setEditingRequestDocuments([]);
//     }
//   };

//   const handleRejectAllApproved = () => {
//     if (!selectedRequest) return;
//     setIsRejectAllConfirmModalOpen(true);
//   };

//   const confirmRejectAllApproved = async () => {
//     if (!selectedRequest) return;

//     try {
//       const approvalLevel = 'FINAL';

//       await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/reject`, {
//         approver_id: 1,
//         reason: 'All approved leave days rejected by admin',
//         approval_level: approvalLevel
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });

//       // Refresh the leave requests list
//       await fetchLeaveRequests();
//       showNotification('All approved leave days rejected successfully', 'success');

//       setIsRejectAllConfirmModalOpen(false);
//       setIsViewModalOpen(false);
//       setSelectedRequest(null);
//     } catch (err) {
//       console.error('Error rejecting all approved leave:', err);
//       showNotification('Failed to reject all approved leave. Please try again.', 'error');
//     }
//   };

//   // Smart pagination functions
//   const getPageNumbers = (currentPage: number, totalPages: number) => {
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

//   const goToPage = (pageNumber: number, pageType: 'main' | 'pending' | 'approved' | 'rejected') => {
//     if (pageType === 'main' && pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     } else if (pageType === 'pending' && pageNumber >= 1 && pageNumber <= pendingTotalPages) {
//       setPendingCurrentPage(pageNumber);
//     } else if (pageType === 'approved' && pageNumber >= 1 && pageNumber <= approvedTotalPages) {
//       setApprovedCurrentPage(pageNumber);
//     } else if (pageType === 'rejected' && pageNumber >= 1 && pageNumber <= rejectedTotalPages) {
//       setRejectedCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <>
//       {/* Notification Toast */}
//       <NotificationToast
//         show={notification.show}
//         message={notification.message}
//         type={notification.type}
//       />

//       <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
//           <div className="join shadow-sm overflow-x-auto w-full sm:w-auto">
//             <div className="flex gap-1 sm:gap-0">
//               <button 
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'today' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
//                 onClick={() => handleQuickDateSelect('today')}
//               >
//                 Today
//               </button>
//               <button 
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'yesterday' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
//                 onClick={() => handleQuickDateSelect('yesterday')}
//               >
//                 Yesterday
//               </button>
//               <button 
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'thisWeek' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
//                 onClick={() => handleQuickDateSelect('thisWeek')}
//               >
//                 <span className="hidden sm:inline">This Week</span>
//                 <span className="sm:hidden">Week</span>
//               </button>
//               <button 
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'lastWeek' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
//                 onClick={() => handleQuickDateSelect('lastWeek')}
//               >
//                 <span className="hidden sm:inline">Last Week</span>
//                 <span className="sm:hidden">L.Week</span>
//               </button>
//               <button 
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'thisMonth' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
//                 onClick={() => handleQuickDateSelect('thisMonth')}
//               >
//                 <span className="hidden sm:inline">This Month</span>
//                 <span className="sm:hidden">Month</span>
//               </button>
//               <button 
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'lastMonth' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
//                 onClick={() => handleQuickDateSelect('lastMonth')}
//               >
//                 <span className="hidden sm:inline">Last Month</span>
//                 <span className="sm:hidden">L.Month</span>
//               </button>
//             </div>
//           </div>
//           <button
//             onClick={() => setShowRequestModal(true)}
//             className={`btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             <span className="hidden sm:inline">Create Leave Request</span>
//             <span className="sm:hidden">Create Request</span>
//           </button>
//         </div>
//         <form onSubmit={handleSearch}>
//           <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
//             <div className="sm:col-span-1">
//               <div className="sm:col-span-3">
//                 <label htmlFor="status" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                   Status
//                 </label>
//                 <div className="mt-2 grid grid-cols-1">
//                   <select
//                     id="status"
//                     name="status"
//                     value={form.status}
//                     onChange={handleStatusChange}
//                     className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-sm outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
//                   >
//                     <option value="All">All</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                   <FaChevronDown
//                     aria-hidden="true"
//                     className={`pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="sm:col-span-1">
//               <label htmlFor="startDate" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                 <span className="hidden sm:inline">Date Range (Start)</span>
//                 <span className="sm:hidden">Start Date</span>
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="startDate"
//                   name="startDate"
//                   type="date"
//                   value={form.startDate}
//                   onChange={handleDateChange}
//                   className={`block w-full rounded-md px-3 py-1.5 text-sm outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
//                 />
//               </div>
//             </div>

//             <div className="sm:col-span-1">
//               <label htmlFor="endDate" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                 <span className="hidden sm:inline">Date Range (End)</span>
//                 <span className="sm:hidden">End Date</span>
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="endDate"
//                   name="endDate"
//                   type="date"
//                   value={form.endDate}
//                   onChange={handleDateChange}
//                   className={`block w-full rounded-md px-3 py-1.5 text-sm outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
//                 />
//               </div>
//             </div>

//             <div className="sm:col-span-1">
//               <div className="sm:col-span-3">
//                 <label htmlFor="company" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                   Company
//                 </label>
//                 <div className="mt-2 grid grid-cols-1">
//                   <select
//                     id="company"
//                     name="company"
//                     value={form.company}
//                     onChange={handleCompanyChange}
//                     className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-sm outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
//                   >
//                     <option value="All">All</option>
//                     {companies.map(company => (
//                       <option key={company} value={company}>{company}</option>
//                     ))}
//                   </select>
//                   <FaChevronDown
//                     aria-hidden="true"
//                     className={`pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="sm:col-span-1">
//               <div className="sm:col-span-3">
//                 <label htmlFor="department" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                   Department
//                 </label>
//                 <div className="mt-2 grid grid-cols-1">
//                   <select
//                     id="department"
//                     name="department"
//                     value={form.department}
//                     onChange={handleDepartmentChange}
//                     className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-sm outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
//                   >
//                     <option value="All">All</option>
//                     {departments.map(dept => (
//                       <option key={dept} value={dept}>{dept}</option>
//                     ))}
//                   </select>
//                   <FaChevronDown
//                     aria-hidden="true"
//                     className={`pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="sm:col-span-2 xl:col-span-1">
//               <div className="card-actions justify-end align-bottom">
//                 <div className="flex flex-col sm:flex-row gap-2 w-full">
//                   <button type="submit" className={`mt-0 sm:mt-7 btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}>
//                     <span className="hidden sm:inline">Apply Filter</span>
//                     <span className="sm:hidden">Apply</span>
//                   </button>
//                   <button
//                     type="button"
//                     className={`mt-0 sm:mt-7 btn btn-sm sm:btn-md btn-outline w-full sm:w-auto ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
//                     onClick={resetLeaveFilters}
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
      
//       <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
//         {/* Leave Request */}
//         <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <div className="card-body p-3 sm:p-4 lg:p-6">
//             <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Leave Request
//             </h2>

//             <div className="overflow-x-auto">
//               <table className="table table-zebra w-full min-w-full">
//                 <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
//                   <tr>
//                     <th>Employee</th>
//                     <th>Type</th>
//                     <th>Date</th>
//                     <th>Duration</th>
//                     <th>Status</th>                    
//                     <th className='text-center'>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedRequests.map(request => (
//                     <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
//                       <td>
//                         <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
//                       </td>
//                       <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {request.leave_type_name}
//                       </td>
//                       <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {new Date(request.start_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })}
//                       </td>
//                       <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
//                       </td>
//                       <td>
//                           <span className={`badge ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                       </td>
//                       <td className="text-right flex justify-end">
//                         {request.status === 'PENDING' && user?.role !== 'employee' && (
//                           <>
//                             <button 
//                               onClick={() => handleApproveRequest(request)}
//                               className={`btn btn-sm mr-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
//                             >
//                               Approve
//                             </button>
//                             <button 
//                               onClick={() => handleRejectRequest(request)}
//                               className="btn btn-sm btn-error mr-2"
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}
//                         {request.status === 'FIRST_APPROVED' && user?.role !== 'employee' && (
//                           <>
//                             <button 
//                               onClick={() => handleApproveRequest(request)}
//                               className={`btn btn-sm mr-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
//                             >
//                               Approve
//                             </button>
//                             <button 
//                               onClick={() => handleRejectRequest(request)}
//                               className="btn btn-sm btn-error mr-2"
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}
//                         <button 
//                           onClick={() => handleViewRequest(request)}
//                           className="btn btn-sm btn-info mr-2"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {filteredData.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No leave requests found.</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-6">
//                 <div className="btn-group">
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(1, 'main')}
//                     disabled={currentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(currentPage - 1, 'main')}
//                     disabled={currentPage === 1}
//                   >
//                     «
//                   </button>
//                   {getPageNumbers(currentPage, totalPages).map(page => (
//                     <button 
//                       key={page}
//                       className={`btn btn-sm ${currentPage === page ? 
//                         `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
//                         `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
//                       }`}
//                       onClick={() => goToPage(page, 'main')}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(currentPage + 1, 'main')}
//                     disabled={currentPage === totalPages}
//                   >
//                     »
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(totalPages, 'main')}
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
      
//       <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
//         {/* Pending Approval */}
//         <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <div className="card-body p-3 sm:p-4 lg:p-6">
//             <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Pending Approval ({pendingRequests.length})
//             </h2>

//             <div className="overflow-x-auto">
//               <table className="table table-zebra w-full min-w-full">
//                 <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
//                   <tr>
//                     <th>Employee</th>
//                     <th>Type</th>
//                     <th>Date</th>
//                     <th>Duration</th>
//                     <th>Status</th>
//                     <th className='text-center'>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedPendingRequests.map(request => {
//                     // Calculate duration in days
//                     const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

//                     return (
//                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
//                         <td>
//                         <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {request.leave_type_name}
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {new Date(request.start_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })}
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {duration} day{duration !== 1 ? 's' : ''}
//                         </td>
//                         <td>
//                           <span className={`badge ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                         </td>
//                         <td className="text-right flex justify-end">
//                           {user?.role !== 'employee' && (
//                             <>
//                               <button 
//                                 onClick={() => handleApproveRequest(request)}
//                                 className={`btn btn-sm mr-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
//                               >
//                                 Approve
//                               </button>
//                               <button 
//                                 onClick={() => handleRejectRequest(request)}
//                                 className="btn btn-sm btn-error mr-2"
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}
//                           <button 
//                             onClick={() => handleViewRequest(request)}
//                             className="btn btn-sm btn-info mr-2"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   {pendingRequests.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No pending leave requests found.</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination Controls for Pending */}
//             {pendingTotalPages > 1 && (
//               <div className="flex justify-center mt-6">
//                 <div className="btn-group">
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(1, 'pending')}
//                     disabled={pendingCurrentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(pendingCurrentPage - 1, 'pending')}
//                     disabled={pendingCurrentPage === 1}
//                   >
//                     «
//                   </button>
//                   {getPageNumbers(pendingCurrentPage, pendingTotalPages).map(page => (
//                     <button 
//                       key={page}
//                       className={`btn btn-sm ${pendingCurrentPage === page ? 
//                         `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
//                         `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
//                       }`}
//                       onClick={() => goToPage(page, 'pending')}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(pendingCurrentPage + 1, 'pending')}
//                     disabled={pendingCurrentPage === pendingTotalPages}
//                   >
//                     »
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(pendingTotalPages, 'pending')}
//                     disabled={pendingCurrentPage === pendingTotalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
//         {/* Recently Approved  */}
//         <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <div className="card-body p-3 sm:p-4 lg:p-6">
//             <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Recently Approved ({approvedRequests.length})
//             </h2>

//             <div className="overflow-x-auto">
//               <table className="table table-zebra w-full min-w-full">
//                 <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
//                   <tr>
//                     <th>Employee</th>
//                     <th>Type</th>
//                     <th>Date</th>
//                     <th>Duration</th>
//                     <th>Status</th>
//                     <th className='text-center'>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedApprovedRequests.map(request => {
//                     // Calculate duration in days
//                     const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

//                     return (
//                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
//                         <td>
//                         <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {request.leave_type_name}
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {new Date(request.start_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })}
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
//                         </td>
//                         <td>
//                           <span className={`badge ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                         </td>
//                         <td className="text-right">
//                           <button 
//                             onClick={() => handleViewRequest(request)}
//                             className="btn btn-sm btn-info mr-2"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   {approvedRequests.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No approved leave requests found.</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination Controls for Approved */}
//             {approvedTotalPages > 1 && (
//               <div className="flex justify-center mt-6">
//                 <div className="btn-group">
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(1, 'approved')}
//                     disabled={approvedCurrentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(approvedCurrentPage - 1, 'approved')}
//                     disabled={approvedCurrentPage === 1}
//                   >
//                     «
//                   </button>
//                   {getPageNumbers(approvedCurrentPage, approvedTotalPages).map(page => (
//                     <button 
//                       key={page}
//                       className={`btn btn-sm ${approvedCurrentPage === page ? 
//                         `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
//                         `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
//                       }`}
//                       onClick={() => goToPage(page, 'approved')}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(approvedCurrentPage + 1, 'approved')}
//                     disabled={approvedCurrentPage === approvedTotalPages}
//                   >
//                     »
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(approvedTotalPages, 'approved')}
//                     disabled={approvedCurrentPage === approvedTotalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
//         {/* Rejected */}
//         <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <div className="card-body p-3 sm:p-4 lg:p-6">
//             <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Rejected ({rejectedRequests.length})
//             </h2>

//             <div className="overflow-x-auto">
//               <table className="table table-zebra w-full min-w-full">
//                 <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
//                   <tr>
//                     <th>Employee</th>
//                     <th>Type</th>
//                     <th>Date</th>
//                     <th>Duration</th>
//                     <th>Status</th>
//                     <th className='text-center'>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedRejectedRequests.map(request => {
//                     // Calculate duration in days
//                     const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

//                     return (
//                       <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
//                         <td>
//                         <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {request.leave_type_name}
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {new Date(request.start_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'numeric',
//                             year: 'numeric'
//                           })}
//                         </td>
//                         <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
//                         </td>
//                         <td>
//                           <span className={`badge ${getBadgeClass(request.status)}`}>
//                             {request.status}
//                           </span>
//                         </td>
//                         <td className="text-right">
//                           <button 
//                             onClick={() => handleViewRequest(request)}
//                             className="btn btn-sm btn-info mr-2"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   {rejectedRequests.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No rejected leave requests found.</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination Controls for Rejected */}
//             {rejectedTotalPages > 1 && (
//               <div className="flex justify-center mt-6">
//                 <div className="btn-group">
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(1, 'rejected')}
//                     disabled={rejectedCurrentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(rejectedCurrentPage - 1, 'rejected')}
//                     disabled={rejectedCurrentPage === 1}
//                   >
//                     «
//                   </button>
//                   {getPageNumbers(rejectedCurrentPage, rejectedTotalPages).map(page => (
//                     <button 
//                       key={page}
//                       className={`btn btn-sm ${rejectedCurrentPage === page ? 
//                         `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
//                         `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
//                       }`}
//                       onClick={() => goToPage(page, 'rejected')}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(rejectedCurrentPage + 1, 'rejected')}
//                     disabled={rejectedCurrentPage === rejectedTotalPages}
//                   >
//                     »
//                   </button>
//                   <button 
//                     className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
//                     onClick={() => goToPage(rejectedTotalPages, 'rejected')}
//                     disabled={rejectedCurrentPage === rejectedTotalPages}
//                   >
//                     Last
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* View Modal */}
//       <dialog id="view_modal" className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
//         <div className={`modal-box w-11/12 max-w-5xl p-0 overflow-hidden shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'}`}>
//           {/* Modal Header */}
//           <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-base-200 border-base-300' : 'bg-slate-700 border-slate-600'}`}>
//             <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <span className="truncate">Leave Request Details</span>
//             </h3>
//             <button 
//               className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-600'}`}
//               onClick={() => setIsViewModalOpen(false)}
//             >✕</button>
//           </div>

//           {/* Modal Content - Scrollable */}
//           <div className="p-4 sm:p-6 overflow-y-auto">
//             {selectedRequest && (
//               <div className="space-y-4 sm:space-y-5">
//                 {/* Status Badge */}
//                 <div className="flex justify-end mb-2">
//                   <span className={`badge ${
//                     selectedRequest.status === 'APPROVED' ? 'badge-success' :
//                     selectedRequest.status === 'REJECTED' ? 'badge-error' :
//                     selectedRequest.status === 'FIRST_APPROVED' ? 'badge-warning' : 'badge-info'
//                   } text-white py-2 sm:py-3 px-3 sm:px-4 text-sm font-medium`}>
//                     {selectedRequest.status}
//                   </span>
//                 </div>

//                 {/* Main Info Section */}
//                 <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4 p-3 sm:p-4 rounded-lg ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Employee</h4>
//                     <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.employee_name}</p>
//                   </div>
                  
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Department</h4>
//                     <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.department_name}</p>
//                   </div>
                  
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Company</h4>
//                     <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.company_name}</p>
//                   </div>
                  
//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
//                     <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
//                   </div>

//                   <div>
//                     <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Request Date</h4>
//                     <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
//                       day: 'numeric',
//                       month: 'long',
//                       year: 'numeric'
//                     })}</p>
//                   </div>
//                 </div>

//                 {/* Leave Details */}
//                 <div className={`border rounded-lg ${theme === 'light' ? 'border-base-300' : 'border-slate-600'}`}>
//                   <h4 className={`text-sm sm:text-base font-semibold px-3 sm:px-4 py-2 rounded-t-lg ${theme === 'light' ? 'bg-base-200 text-gray-900' : 'bg-slate-700 text-slate-100'}`}>Leave Details</h4>
//                   <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//                     <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
//                       <div className="flex-1">
//                         <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
//                         <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
//                           day: 'numeric',
//                           month: 'short',
//                           year: 'numeric'
//                         })}</p>
//                       </div>
//                       <div className="flex-1">
//                         <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
//                         <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
//                           day: 'numeric',
//                           month: 'short',
//                           year: 'numeric'
//                         })}</p>
//                       </div>
//                       <div className="flex-1">
//                         <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Duration</h4>
//                         <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason</h4>
//                       <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-base-200/40 text-gray-900' : 'bg-slate-700/40 text-slate-100'}`}>{selectedRequest.reason}</p>
//                     </div>

//                     {selectedRequest.document_url && (
//                       <div>
//                         <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Attachment</h4>
//                         <div className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
//                           <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//                           </svg>
//                           <a
//                             href="#"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
//                             }}
//                             className={`text-xs sm:text-sm font-medium truncate flex items-center gap-2 ${theme === 'light' ? 'text-primary hover:text-primary-focus' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
//                             style={{ cursor: 'pointer' }}
//                           >
//                             Download {selectedRequest.file_name}
//                           </a>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Approval Section */}
//                 {(selectedRequest.status === 'FIRST_APPROVED' || selectedRequest.status === 'APPROVED') && (
//                   <div className="border border-base-300 rounded-lg">
//                     <h4 className="text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg">
//                       Approval Information
//                     </h4>
//                     <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//                       {/* First Approval */}
//                       <div className="bg-base-200/40 p-2 sm:p-3 rounded-md">
//                         <div className="flex items-center gap-2 mb-2">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                           </svg>
//                           <h5 className="text-sm sm:text-base font-medium">First Approval</h5>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-6 sm:pl-7">
//                           <div>
//                             <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approved By</h4>
//                             <p className="text-sm sm:text-base">{selectedRequest.first_approver_name}</p>
//                           </div>
//                           <div>
//                             <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approval Date</h4>
//                             <p className="text-sm sm:text-base">
//                               {selectedRequest.first_approval_date ? getDateAndTime(selectedRequest.first_approval_date) : 'N/A'}
//                             </p>
//                           </div>
//                           <div className="sm:col-span-2">
//                             <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Comments</h4>
//                             <p className="text-sm sm:text-base">{selectedRequest.first_approval_comment || 'No comments'}</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Second Approval (if available) */}
//                       {selectedRequest.status === 'APPROVED' && (
//                         <div className="bg-base-200/40 p-2 sm:p-3 rounded-md">
//                           <div className="flex items-center gap-2 mb-2">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                             </svg>
//                             <h5 className="text-sm sm:text-base font-medium">Final Approval</h5>
//                           </div>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-6 sm:pl-7">
//                             <div>
//                               <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approved By</h4>
//                               <p className="text-sm sm:text-base">{selectedRequest.second_approver_name}</p>
//                             </div>
//                             <div>
//                               <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approval Date</h4>
//                               <p className="text-sm sm:text-base">
//                                 {selectedRequest.second_approval_date ? getDateAndTime(selectedRequest.second_approval_date) : 'N/A'}
//                               </p>
//                             </div>
//                             <div className="sm:col-span-2">
//                               <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Comments</h4>
//                               <p className="text-sm sm:text-base">{selectedRequest.second_approval_comment || 'No comments'}</p>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Rejection Section */}
//                 {selectedRequest.status === 'REJECTED' && (
//                   <div className="border border-error/20 rounded-lg">
//                     <h4 className="text-sm sm:text-base font-semibold bg-error/10 px-3 sm:px-4 py-2 rounded-t-lg text-error flex items-center gap-2">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                       </svg>
//                       Rejection Information
//                     </h4>
//                     <div className="p-3 sm:p-4 space-y-3">
//                       <div>
//                         <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Rejected By</h4>
//                         <p className="text-sm sm:text-base font-medium">
//                           {selectedRequest.second_approver_name || selectedRequest.first_approver_name}
//                         </p>
//                       </div>
//                       <div>
//                         <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Rejection Date</h4>
//                         <p className="text-sm sm:text-base font-medium">
//                           {getDateAndTime(selectedRequest.updated_at)}
//                         </p>
//                       </div>
//                       <div>
//                         <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Rejection Reason</h4>
//                         <p className="p-2 sm:p-3 bg-error/5 rounded-md text-sm sm:text-base">
//                           {selectedRequest.rejection_reason || 'No reason provided'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Modal Footer */}
//           <div className={`modal-action flex justify-between z-10 px-4 sm:px-6 py-3 sm:py-4 border-t mt-auto ${theme === 'light' ? 'border-base-300 bg-base-100' : 'border-slate-600 bg-slate-800'}`}>
//             <div className="flex gap-2">
//                 {selectedRequest?.status === 'APPROVED' && user?.role !== 'employee' && (
//                   <>                 
//                     <button
//                       className="btn btn-sm sm:btn-md btn-error"
//                       onClick={handleRejectAllApproved}
//                     >
//                       Reject Approved Leave
//                     </button>
//                   </>
//                 )}
//               </div>
            
//             <button
//               className={`btn ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
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

//       {/* Reject Modal */}
//       <dialog id="reject_modal" className={`modal ${isRejectModalOpen ? 'modal-open' : ''}`}>
//         <div className={`modal-box w-11/12 max-w-5xl p-0 overflow-hidden shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'}`}>
//           {/* Modal Header */}
//           <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-base-200 border-base-300' : 'bg-slate-700 border-slate-600'}`}>
//             <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-error">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="truncate">Reject Leave Request</span>
//             </h3>
//             <button 
//               className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-600'}`}
//               onClick={() => {
//                 setIsRejectModalOpen(false);
//                 setRejectReason('');
//                 setRejectError('');
//               }}
//             >✕</button>
//           </div>

//           {/* Modal Content - Scrollable */}
//           <div className="p-4 sm:p-6 overflow-y-auto">
//             {selectedRequest && (
//               <div className="space-y-5">

//               {/* Main Info Section */}
//               <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4 p-3 sm:p-4 rounded-lg ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
//                 <div>
//                   <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Employee</h4>
//                   <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.employee_name}</p>
//                 </div>
                
//                 <div>
//                   <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Department</h4>
//                   <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.department_name}</p>
//                 </div>
                
//                 <div>
//                   <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Company</h4>
//                   <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.company_name}</p>
//                 </div>
                
//                 <div>
//                   <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
//                   <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
//                 </div>

//                 <div>
//                   <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Request Date</h4>
//                   <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                   })}</p>
//                 </div>
//               </div>

//               {/* Leave Details */}
//               <div className={`border rounded-lg ${theme === 'light' ? 'border-base-300' : 'border-slate-600'}`}>
//                 <h4 className={`text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg ${theme === 'light' ? 'bg-base-200 text-gray-900' : 'bg-slate-700 text-slate-100'}`}>Leave Details</h4>
//                 <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//                   <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
//                     <div className="flex-1">
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
//                       <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })}</p>
//                     </div>
//                     <div className="flex-1">
//                       <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
//                       <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })}</p>
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Duration</h4>
//                       <p className="text-sm sm:text-base font-semibold">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Reason</h4>
//                     <p className="p-2 sm:p-3 bg-base-200/40 rounded-md text-sm sm:text-base">{selectedRequest.reason}</p>
//                   </div>

//                   {selectedRequest.document_url && (
//                     <div>
//                       <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Attachment</h4>
//                       <div className="flex items-center gap-2 p-2 bg-base-200/40 rounded-md">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//                         </svg>
//                         <a
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
//                           }}
//                           className="text-xs sm:text-sm text-primary hover:text-primary-focus hover:underline font-medium truncate flex items-center gap-2"
//                           style={{ cursor: 'pointer' }}
//                         >
//                           Download {selectedRequest.file_name}
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//                 {/* Rejection Form */}
//                 <form onSubmit={handleRejectSubmit}>
//                   <div className="form-control">
//                     <label className="label">
//                       <span className="label-text text-sm sm:text-base font-medium">Rejection Reason <span className="text-error">*</span></span>
//                     </label>
//                     <textarea
//                       className={`textarea textarea-bordered h-24 sm:h-32 w-full ${rejectError ? 'textarea-error' : ''}`}
//                       placeholder="Please provide a reason for rejecting this leave request"
//                       value={rejectReason}
//                       onChange={(e) => setRejectReason(e.target.value)}
//                     ></textarea>
//                     {rejectError && (
//                       <div className="text-error text-sm mt-1">
//                         {rejectError}
//                       </div>
//                     )}
//                   </div>

//                   <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 sm:p-4 mt-5 sm:mt-6">
//                     <div className="flex items-start gap-3">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                       </svg>
//                       <div>
//                         <h4 className="text-sm sm:text-base font-medium text-warning">Important Note</h4>
//                         <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
//                           Rejecting this leave request cannot be undone. The employee will be notified of your decision and the reason provided.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Submit Error */}
//                   {error && (
//                     <div className="alert alert-error mt-5">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span>{error}</span>
//                     </div>
//                   )}
//                 </form>
//               </div>
//             )}
//           </div>

//           {/* Modal Footer */}
//           <div className="modal-action px-4 sm:px-6 py-3 sm:py-4 border-t border-base-300 bg-base-100 mt-auto">
//             <button
//               className="btn btn-ghost"
//               onClick={() => {
//                 setIsRejectModalOpen(false);
//                 setRejectReason('');
//                 setRejectError('');
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               className="btn btn-error"
//               onClick={handleRejectSubmit}
//             >
//               Reject Leave
//             </button>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => {
//             setIsRejectModalOpen(false);
//             setRejectReason('');
//             setRejectError('');
//           }}>close</button>
//         </form>
//       </dialog>

//       {/* Approve Modal */}
//       <dialog id="approve_modal" className={`modal ${isApproveModalOpen ? 'modal-open' : ''}`}>
//         <div className="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-base-100 shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col">
//           {/* Modal Header */}
//           <div className="bg-base-200 px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 flex justify-between items-center z-10">
//             <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-success">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="truncate">Approve Leave Request</span>
//             </h3>
//             <button 
//               className="btn btn-sm btn-circle btn-ghost"
//               onClick={() => {
//                 setIsApproveModalOpen(false);
//                 setApproveComment('');
//               }}
//             >✕</button>
//           </div>

//           {/* Modal Content - Scrollable */}
//           <div className="p-4 sm:p-6 overflow-y-auto">
//             {selectedRequest && (
//               <div className="space-y-5">

//               {/* Main Info Section */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4 bg-base-200/40 p-3 sm:p-4 rounded-lg">
//                 <div>
//                   <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Employee</h4>
//                   <p className="text-sm sm:text-base font-semibold">{selectedRequest.employee_name}</p>
//                 </div>
                
//                 <div>
//                   <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Department</h4>
//                   <p className="text-sm sm:text-base font-semibold">{selectedRequest.department_name}</p>
//                 </div>
                
//                 <div>
//                   <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Company</h4>
//                   <p className="text-sm sm:text-base font-semibold">{selectedRequest.company_name}</p>
//                 </div>
                
//                 <div>
//                   <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Leave Type</h4>
//                   <p className="text-sm sm:text-base font-semibold">{selectedRequest.leave_type_name}</p>
//                 </div>

//                 <div>
//                   <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Request Date</h4>
//                   <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                   })}</p>
//                 </div>
//               </div>

//               {/* Leave Details */}
//               <div className="border border-base-300 rounded-lg">
//                 <h4 className="text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg">Leave Details</h4>
//                 <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//                   <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
//                     <div className="flex-1">
//                       <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Start Date</h4>
//                       <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })}</p>
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">End Date</h4>
//                       <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })}</p>
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Duration</h4>
//                       <p className="text-sm sm:text-base font-semibold">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Reason</h4>
//                     <p className="p-2 sm:p-3 bg-base-200/40 rounded-md text-sm sm:text-base">{selectedRequest.reason}</p>
//                   </div>

//                   {selectedRequest.document_url && (
//                     <div>
//                       <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Attachment</h4>
//                       <div className="flex items-center gap-2 p-2 bg-base-200/40 rounded-md">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
//                         </svg>
//                         <a
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
//                           }}
//                           className="text-xs sm:text-sm text-primary hover:text-primary-focus hover:underline font-medium truncate flex items-center gap-2"
//                           style={{ cursor: 'pointer' }}
//                         >
//                           Download {selectedRequest.file_name}
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//                 {/* Approval Form */}
//                 <form onSubmit={handleApproveSubmit}>
//                   <div className="form-control">
//                     <label className="label">
//                       <span className="label-text text-sm sm:text-base font-medium">Approval Comment (Optional)</span>
//                     </label>
//                     <textarea
//                       className="textarea textarea-bordered h-24 sm:h-32 w-full"
//                       placeholder="Add any comments regarding this approval (optional)"
//                       value={approveComment}
//                       onChange={(e) => setApproveComment(e.target.value)}
//                     ></textarea>
//                   </div>

//                   <div className="bg-success/10 border border-success/20 rounded-lg p-3 sm:p-4 mt-5 sm:mt-6">
//                     <div className="flex items-start gap-3">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <div>
//                         <h4 className="text-sm sm:text-base font-medium text-success">Approval Confirmation</h4>
//                         <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
//                           By approving this leave request, you confirm that the employee is eligible for this leave and their absence has been accounted for.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Submit Error */}
//                   {error && (
//                     <div className="alert alert-error mt-5">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span>{error}</span>
//                     </div>
//                   )}
//                 </form>
//               </div>
//             )}
//           </div>

//           {/* Modal Footer */}
//           <div className="modal-action px-4 sm:px-6 py-3 sm:py-4 border-t border-base-300 bg-base-100 mt-auto">
//             <button
//               className="btn btn-ghost"
//               onClick={() => {
//                 setIsApproveModalOpen(false);
//                 setApproveComment('');
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               className="btn btn-success text-white"
//               onClick={handleApproveSubmit}
//             >
//               Approve Leave
//             </button>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => {
//             setIsApproveModalOpen(false);
//             setApproveComment('');
//           }}>close</button>
//         </form>
//       </dialog>

//       {/* Leave Request Modal */}
//       <dialog
//         id="leave_request_modal"
//         className={`modal ${showRequestModal ? 'modal-open' : ''}`}
//       >
//         <div className="modal-box max-w-3xl p-0 overflow-hidden max-h-[90vh]">
//           {/* Modal Header */}
//           <div className="bg-base-200 px-6 py-4 border-b border-base-300">
//             <h3 className="font-bold text-xl flex items-center gap-2">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//               {isEditing ? 'Edit Leave Request' : 'New Leave Request'}
//             </h3>
//             <form method="dialog">
//               <button
//                 className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
//                 onClick={() => {
//                   setShowRequestModal(false);
//                   setIsEditing(false);
//                   setEditingRequestId(null);
//                   setEditingRequestAttachment(null);
//                 }}
//               >✕</button>
//             </form>
//           </div>

//           {/* Modal Content */}
//           <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
//             <form onSubmit={handleSubmit} className="space-y-6">
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-medium">Employee</span>
//                   </label>
//                   <div className="input-group flex space-x-2">
//                     <input
//                       type="text"
//                       placeholder="Search by name, email or employee number..."
//                       className={`input input-bordered w-full ${errors.employee_id ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <button 
//                       type="button"
//                       className="btn btn-square" 
//                       onClick={(e) => {
//                         e.preventDefault();
//                         fetchEmployees();
//                       }}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                       </svg>
//                     </button>
//                   </div>
//                   {filteredEmployees.length > 0 && searchTerm && (
//                     <div className="mt-2 max-h-48 overflow-y-auto bg-base-100 rounded-lg shadow-lg">
//                       {filteredEmployees.map((employee) => (
//                         <div
//                           key={employee.id}
//                           className="p-2 hover:bg-base-200 cursor-pointer"
//                           onClick={() => handleEmployeeSelect(employee)}
//                         >
//                           <div className="font-medium">{employee.name}</div>
//                           <div className="text-sm opacity-70">{employee.email}</div>
//                           <div className="text-sm opacity-70">Employee No: {employee.employee_no}</div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 {errors.employee_id && <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>}
//                 </div>                

//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-medium">Leave Type</span>
//                   </label>
//                   <select
//                     className={`select select-bordered w-full ${errors.type ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
//                     id="leave_type"
//                     name="leave_type"
//                     value={formData.type}
//                     onChange={handleLeaveTypeChange}
//                     disabled={isLoading}
//                   >
//                     <option>Select</option>
//                     {leaveTypesByEmployeeId
//                       .filter((type: { is_active: boolean }) => type.is_active)
//                       .map((type: { id: number, leave_type_name: string }) => (
//                         <option key={type.id} value={type.leave_type_name.toLowerCase()}>
//                           {type.leave_type_name}
//                         </option>
//                     ))}
//                   </select>
//                   {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-medium">Reason</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`input input-bordered w-full ${errors.reason ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
//                     placeholder="Brief reason for leave"
//                     value={formData.reason}
//                     onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                   />
//                   {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {formData.type !== 'unpaid leave' && (
//                   <div className="col-span-1 md:col-span-2 mb-1">
//                     <div className="text-sm flex justify-center gap-8">
//                       <div>
//                         <span className="text-gray-600">Request Duration: </span>
//                         <span className="font-medium text-blue-600">{getRequestDuration()} days</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Remaining Balance: 
//                         {(() => {
//                           let remainingDays = getRemainingDays();
//                           return remainingDays > 0 ? (
//                             <span className="font-medium text-blue-600">{remainingDays} days</span>
//                           ) : (
//                             <span className="font-medium text-red-600">{remainingDays} days</span>
//                           );
//                         })()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Start Date</span>
//                   </label>
//                   <div className={`${theme === 'light' ? 'bg-white' : 'oklch(0 0 0 / 0.4)'} p-3 rounded-lg ${errors.startDate ? 'border border-red-500' : ''}`}>
//                     <input
//                       type="date"
//                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white text-gray-900 border-blue-300 focus:border-blue-500' : 'oklch(0 0 0 / 0.4) text-slate-100 border-slate-600 focus:border-blue-500'}`}
//                       value={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => handleLeaveRequestDateChange(e.target.value, true)}
//                     />
//                   </div>
//                   {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>End Date</span>
//                   </label>
//                   <div className={`${theme === 'light' ? 'bg-white' : 'oklch(0 0 0 / 0.4)'} p-3 rounded-lg ${errors.endDate ? 'border border-red-500' : ''}`}>
//                     <input
//                       type="date"
//                       className={`input input-bordered w-full ${theme === 'light' ? 'bg-white text-gray-900 border-blue-300 focus:border-blue-500' : 'oklch(0 0 0 / 0.4) text-slate-100 border-slate-600 focus:border-blue-500'}`}
//                       value={formData.endDate ? calculateDateInUTC(formData.endDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => handleLeaveRequestDateChange(e.target.value, false)}
//                       min={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : calculateDateInUTC(new Date()).toISOString().split('T')[0]}
//                     />
//                   </div>
//                   {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
//                 </div>
//               </div>

//               {/* Add Half Day Checkbox - Only show when start and end dates are the same */}
//               {formData.startDate && formData.endDate && 
//                formData.startDate.toISOString().split('T')[0] === formData.endDate.toISOString().split('T')[0] && (
//                 <div className="form-control">
//                   <label className="label cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="checkbox checkbox-primary"
//                       checked={formData.isHalfDay}
//                       onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
//                     />
//                     <span className="label-text ml-2">Half Day Leave</span>
//                   </label>
//                 </div>
//               )}

//               {/* Attachment Upload */}
//               <div className="form-control">
//                 <label className="label">
//                   {(formData.type && leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase())?.requires_documentation == true) && (
//                     <span className="label-text-alt text-red-500">* Required</span>
//                   )}
//                 </label>
//                 <div className="flex flex-col gap-2 w-full">
//                   {/* EmployeeDocumentManager for leave documents */}
//                   <div className={`${errors.attachment ? 'border-1 border-red-500 rounded-lg p-2' : ''}`}>
//                     <EmployeeDocumentManager
//                       key={documentManagerKey}
//                       employeeId={user?.id || null}
//                       mode={isEditing ? 'add' : 'add'}
//                       documentTypes={[
//                         {
//                           type: 'Medical',
//                           label: 'Attachment',
//                           description: 'Upload medical certificate or supporting document'
//                         }
//                       ]}
//                       moduleName="leave"
//                       onFilesSelected={setSelectedLeaveDocuments}
//                     />
//                   </div>
//                   {errors.attachment && <p className="text-red-500 text-sm mt-1">{errors.attachment}</p>}
//                 </div>
//               </div>

//               {/* Modal Footer */}
//               <div className="flex justify-end gap-4 mt-6 pt-4">
//                 <button
//                   type="button"
//                   className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
//                   onClick={() => {
//                     setShowRequestModal(false);
//                     setErrors({
//                       type: '',
//                       reason: '',
//                       startDate: '',
//                       endDate: '',
//                       attachment: '',
//                       employee_id: ''
//                     });
//                     setFormData({
//                       type: '',
//                       startDate: undefined,
//                       endDate: undefined,
//                       reason: '',
//                       attachment: null,
//                       employee_id: undefined,
//                       isHalfDay: false
//                     });
//                     setIsEditing(false);
//                     setEditingRequestId(null);
//                     setEditingRequestAttachment(null);
//                     setSelectedLeaveDocuments([]);
//                     resetLeaveAttachment();
//                     setSearchTerm('');
//                     setFilteredEmployees([]);
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                 >
//                   {isEditing ? 'Update Request' : 'Submit Request'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setShowRequestModal(false)}>close</button>
//         </form>
//       </dialog>

//       {/* Reject All Approved Leave Confirmation Modal */}
//       <dialog id="reject_all_confirm_modal" className={`modal ${isRejectAllConfirmModalOpen ? 'modal-open' : ''}`}>
//         <div className="modal-box w-11/12 max-w-md p-0 overflow-hidden bg-base-100 shadow-lg mx-auto">
//           {/* Modal Header */}
//           <div className="bg-error/10 px-4 sm:px-6 py-3 sm:py-4 border-b border-error/20 flex justify-between items-center">
//             <h3 className="font-bold text-lg flex items-center gap-2 text-error">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//               Confirm Rejection
//             </h3>
//             <button
//               className="btn btn-sm btn-circle btn-ghost text-error"
//               onClick={() => setIsRejectAllConfirmModalOpen(false)}
//             >✕</button>
//           </div>

//           {/* Modal Content */}
//           <div className="p-4 sm:p-6">
//             {selectedRequest && (
//               <div className="space-y-4">
//                 {/* Warning Message */}
//                 <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-lg">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                   <div>
//                     <h4 className="font-semibold text-error text-sm sm:text-base mb-1">
//                       Warning: This action cannot be undone
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       You are about to reject all approved leave days for <span className="font-semibold">{selectedRequest.employee_name}</span>.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Leave Details */}
//                 <div className="bg-base-200/40 p-3 rounded-lg space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Employee:</span>
//                     <span className="font-medium">{selectedRequest.employee_name}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Leave Type:</span>
//                     <span className="font-medium">{selectedRequest.leave_type_name}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Duration:</span>
//                     <span className="font-medium">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Dates:</span>
//                     <span className="font-medium">
//                       {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })} - {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Confirmation Question */}
//                 <div className="text-center">
//                   <p className="text-sm sm:text-base font-medium text-gray-700">
//                     Are you sure you want to reject all approved leave days?
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Modal Footer */}
//           <div className="bg-base-200 px-4 sm:px-6 py-3 border-t border-base-300 flex justify-end gap-2">
//             <button
//               className="btn btn-sm sm:btn-md btn-ghost"
//               onClick={() => setIsRejectAllConfirmModalOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="btn btn-sm sm:btn-md btn-error"
//               onClick={confirmRejectAllApproved}
//             >
//               Yes, Reject All Leave
//             </button>
//           </div>
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setIsRejectAllConfirmModalOpen(false)}>close</button>
//         </form>
//       </dialog>
//     </>
//   )
// }

// export default AdminLeaveRequest

'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Link from 'next/link';
import { FaChevronDown } from "react-icons/fa";
import { FaRegCalendarTimes } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { calculateDateInUTC, calculateDuration, getBadgeClass, formatToMalaysiaTime ,formatDateOnly ,formatDateDDMMMYYYY  } from '../utils/utils';
import EmployeeDocumentManager from '../components/EmployeeDocumentManager';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../hooks/useNotification';
import { useTheme } from '../components/ThemeProvider';
import { useLeavePreview } from '../hooks/useLeavePreview';


interface LeavePreviewData {
  calculation?: {
    duration: number;
    breakdown?: {
      total_work_days: number;
      holidays_excluded: number;
      actual_working_days: number;
    };
  };
  balance?: {
    available: number;
    sufficient: boolean;
  };
  validation?: {
    has_sufficient_balance: boolean;
    has_overlapping_leaves: boolean;
    requires_documentation: boolean;
  };
  can_proceed: boolean;
}

interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  company_id: number;
  company_name: string;
  department_name: string;
  leave_type_id: number;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string;
  status: 'PENDING' | 'FIRST_APPROVED' | 'APPROVED' | 'REJECTED';
  first_approver_id?: number;
  first_approver_name?: string;
  first_approval_date?: string;
  first_approval_comment?: string;
  second_approver_id?: number;
  second_approver_name?: string;
  second_approval_date?: string;
  second_approval_comment?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  document_url?: string;
  document_type?: string;
  file_name?: string;
  document_id?: number; 
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LeaveType {
  id: number;
  leave_type_name: string;
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

interface Employee {
  id: number;
  name: string;
  email: string;
  employee_no: string;
  status: string; // Add status property
  company_id?: string;
  department_id?: string;
  position?: string;
  employment_type?: string;
  nationality?: string;
  job_level?: string;
}

const AdminLeaveRequest = () => {  
  const { notification, showNotification } = useNotification();
  const { theme } = useTheme();
  const router = useRouter();
  const displayRow = 10;
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState<string>('');
  const [approveComment, setApproveComment] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employeeLeaveApplications, setEmployeeLeaveApplications] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [approvedCurrentPage, setApprovedCurrentPage] = useState(1);
  const [rejectedCurrentPage, setRejectedCurrentPage] = useState(1);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isRejectAllConfirmModalOpen, setIsRejectAllConfirmModalOpen] = useState(false);
  const [selectedRequestDocuments, setSelectedRequestDocuments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    reason: '',
    attachment: null as File | null,
    employee_id: undefined as number | undefined,
    isHalfDay: false
  });
  const [errors, setErrors] = useState({
    type: '',
    reason: '',
    startDate: '',
    endDate: '',
    attachment: '',
    employee_id: '',
    general: ''
  });
  const { 
    previewData, 
    isLoadingPreview, 
    previewError, 
    calculateLeavePreview, 
    clearPreview 
} = useLeavePreview();
  const [isEditing, setIsEditing] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [editingRequestAttachment, setEditingRequestAttachment] = useState<{ url: string, name: string } | null>(null);
  const [selectedLeaveDocuments, setSelectedLeaveDocuments] = useState<any[]>([]);
  const [editingRequestDocuments, setEditingRequestDocuments] = useState<any[]>([]);
  const [documentManagerKey, setDocumentManagerKey] = useState(0);
  const [leaveTypesByEmployeeId, setLeaveTypesByEmployeeId] = useState<LeaveType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);//const [employees, setEmployees] = useState<Array<{id: number; name: string; email: string; employee_no: string}>>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Array<{id: number; name: string; email: string; employee_no: string}>>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);

  // Advanced Filters State
  const [filters, setFilters] = useState({
    department_id: '',
    position: '',
    type: '',
    nationality: '',
    jobLevel: '',
    company_id: '',
    documentExpiry: '',
    dateRangeStart: '',
    dateRangeEnd: '',
    leaveStatus: ''
  });

  
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);

  // Filter options - RENAMED to avoid conflicts
  const [filterCompanies, setFilterCompanies] = useState<string[]>([]);
  const [filterDepartments, setFilterDepartments] = useState<string[]>([]);
  const [filterPositions, setFilterPositions] = useState<string[]>([]);
  const [filterEmploymentTypes, setFilterEmploymentTypes] = useState<string[]>([]);
  const [filterNationalities, setFilterNationalities] = useState<string[]>([]);
  const [filterJobLevels, setFilterJobLevels] = useState<string[]>([]);

  
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
    
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    setFilters(prev => ({
      ...prev,
      dateRangeStart: formattedStartDate,
      dateRangeEnd: formattedEndDate
    }));
    
    setActiveQuickDate(option);
    setCurrentPage(1);
  };

  const fetchAllEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  // Fetch leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests();
    fetchFilterOptions();
    fetchAllEmployees();
    fetchEmployeeBasedFilters();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('hrms_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);
// Add these useEffect hooks to watch for company/department/position changes
useEffect(() => {
  console.log('🔄 Filter change detected:', {
    company: filters.company_id,
    department: filters.department_id,
    position: filters.position
  });
  
  if (filters.company_id || filters.department_id || filters.position) {
    console.log('🚀 Triggering employee-based filters refresh...');
    fetchEmployeeBasedFilters(filters.company_id, filters.department_id, filters.position);
  } else {
    // If no filters are selected, fetch all data
    console.log('🔄 No specific filters, fetching all employee-based filters');
    fetchEmployeeBasedFilters();
  }
}, [filters.company_id, filters.department_id, filters.position]);

// Optional: Individual effects for detailed debugging
useEffect(() => {
  if (filters.company_id) {
    console.log('🏢 Company changed to:', filters.company_id);
  }
}, [filters.company_id]);

useEffect(() => {
  if (filters.department_id) {
    console.log('🏛️ Department changed to:', filters.department_id);
  }
}, [filters.department_id]);

useEffect(() => {
  if (filters.position) {
    console.log('💼 Position changed to:', filters.position);
  }
}, [filters.position]);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/leaves`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setLeaveRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to load leave requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

const fetchFilterOptions = async () => {
  try {
    console.log('Fetching filter options...');
    
    // Fetch companies with departments in a single call
    let companiesWithDepartmentsData: any[] = [];
    try {
      const companiesRes = await axios.get(`${API_BASE_URL}/api/admin/companies-with-departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      companiesWithDepartmentsData = companiesRes.data;
      console.log('Companies with departments data:', companiesWithDepartmentsData);
    } catch (error) {
      console.error('Error fetching companies with departments:', error);
      // Fallback to separate API calls
      await fetchCompaniesAndDepartmentsSeparately();
      return;
    }

    // Extract companies
    const companyNames = companiesWithDepartmentsData.map((company: any) => {
      return company.name || company.company_name || String(company);
    }).filter(Boolean);
    
    setFilterCompanies([...new Set(companyNames)].sort());
    console.log('Filter companies set:', companyNames);

    // Initially set departments as empty - they will be loaded when company is selected
    setFilterDepartments([]);
    console.log('Initial departments set to empty - will load when company is selected');

    // Store the full companies data for later use
    setCompaniesWithDepartmentsData(companiesWithDepartmentsData);

    // Fetch employees for positions, employment types, etc.
    await fetchEmployeeBasedFilters();

  } catch (error) {
    console.error('Error in fetchFilterOptions:', error);
    // Initialize with empty arrays to avoid runtime errors
    setFilterCompanies([]);
    setFilterDepartments([]);
    setFilterPositions([]);
    setFilterEmploymentTypes([]);
    setFilterNationalities([]);
    setFilterJobLevels([]);
  }
};

const fetchEmployeeBasedFilters = async (company?: string, department?: string, position?: string) => {
  try {
    console.log('🔍 Fetching employee-based filters with:', { 
      company: company || 'None', 
      department: department || 'None', 
      position: position || 'None' 
    });

    // Reset current filter selections when underlying data changes
    setFilters(prev => ({
      ...prev,
      type: '',
      nationality: '',
      jobLevel: ''
    }));

    // Build query parameters based on current selections
    const params: any = {};
    if (company && company !== '') params.company = company;
    if (department && department !== '') params.department = department;
    if (position && position !== '') params.position = position;

    console.log('📤 Sending API request with params:', params);

    // Use Promise.all to fetch all three endpoints in parallel with filters
    const [employmentTypesRes, nationalitiesRes, jobLevelsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/admin/employment-types`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` },
        params: params,
        timeout: 10000
      }).catch(error => {
        console.error('❌ Employment Types API Error:', error.response?.data || error.message);
        throw error;
      }),
      axios.get(`${API_BASE_URL}/api/admin/nationalities`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` },
        params: params,
        timeout: 10000
      }).catch(error => {
        console.error('❌ Nationalities API Error:', error.response?.data || error.message);
        throw error;
      }),
      axios.get(`${API_BASE_URL}/api/admin/job-levels`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` },
        params: params,
        timeout: 10000
      }).catch(error => {
        console.error('❌ Job Levels API Error:', error.response?.data || error.message);
        throw error;
      })
    ]);

    console.log('📥 API Responses received:', {
      employmentTypes: employmentTypesRes?.data,
      nationalities: nationalitiesRes?.data,
      jobLevels: jobLevelsRes?.data
    });

    // Extract and set employment types
    if (employmentTypesRes.data?.success && employmentTypesRes.data.employment_types) {
      const employmentTypes = employmentTypesRes.data.employment_types
        .map((type: any) => type.value || type.label || String(type))
        .filter(Boolean)
        .sort();
      setFilterEmploymentTypes(employmentTypes);
      console.log('✅ Updated employment types:', employmentTypes);
    } else {
      console.warn('⚠️ No employment types data found in response');
      setFilterEmploymentTypes([]);
    }

    // Extract nationalities
    if (nationalitiesRes.data?.success && nationalitiesRes.data.nationalities) {
      const nationalities = nationalitiesRes.data.nationalities
        .map((nationality: any) => nationality.value || nationality.label || String(nationality))
        .filter(Boolean)
        .sort();
      setFilterNationalities(nationalities);
      console.log('✅ Updated nationalities:', nationalities);
    } else {
      console.warn('⚠️ No nationalities data found in response');
      setFilterNationalities([]);
    }

    // Extract job levels
    if (jobLevelsRes.data?.success && jobLevelsRes.data.job_levels) {
      const jobLevels = jobLevelsRes.data.job_levels
        .map((level: any) => level.value || level.label || String(level))
        .filter(Boolean)
        .sort();
      setFilterJobLevels(jobLevels);
      console.log('✅ Updated job levels:', jobLevels);
    } else {
      console.warn('⚠️ No job levels data found in response');
      setFilterJobLevels([]);
    }

    console.log('🎉 All filters updated based on current selections');

  } catch (error) {
    console.error('❌ Error fetching filtered employee data:', error);
    
    // Show error notification to user
    showNotification('Failed to load filter options. Please try again.', 'error');
    
    // Reset to empty arrays on error
    setFilterEmploymentTypes([]);
    setFilterNationalities([]);
    setFilterJobLevels([]);
  }
};


// Add this state to store the full companies data
const [companiesWithDepartmentsData, setCompaniesWithDepartmentsData] = useState<any[]>([]);

// Fallback function if companies-with-departments fails
const fetchCompaniesAndDepartmentsSeparately = async () => {
  try {
    // Fetch companies
    const companiesRes = await axios.get(`${API_BASE_URL}/api/admin/allcompanies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    
    const companyNames = companiesRes.data.map((c: any) => {
      return c.name || c.company_name || String(c);
    }).filter(Boolean);
    
    setFilterCompanies([...new Set(companyNames)].sort() as string[]);
    setFilterDepartments([]);
    
  } catch (error) {
    console.error('Error in fallback company fetch:', error);
    setFilterCompanies([]);
    setFilterDepartments([]);
  }
};
// Updated function to fetch departments when company is selected
const fetchDepartmentsForCompany = async (companyName: string) => {
  try {
    if (!companyName) {
      setFilterDepartments([]);
      setFilterPositions([]); // Also clear positions when company is cleared
      return;
    }

    console.log(`Fetching departments for company: ${companyName}`);
    
    // Find the company from our stored data
    const selectedCompany = companiesWithDepartmentsData.find((company: any) => 
      company.name === companyName || 
      company.company_name === companyName
    );

    if (!selectedCompany || !selectedCompany.departments) {
      console.error('Company not found or no departments available');
      setFilterDepartments([]);
      setFilterPositions([]);
      return;
    }

    // Extract department names
    const departmentNames = selectedCompany.departments.map((dept: any) => {
      return dept.name || dept.department_name || String(dept);
    }).filter(Boolean);
    
    setFilterDepartments([...new Set(departmentNames)].sort() as string[]);
    console.log(`Departments for company ${companyName}:`, departmentNames);

    // Clear positions when company changes (department might change)
    setFilterPositions([]);
    setFilters(prev => ({ ...prev, position: '' }));

  } catch (error) {
    console.error(`Error fetching departments for company ${companyName}:`, error);
    setFilterDepartments([]);
    setFilterPositions([]);
  }
};

// New function to fetch positions when department is selected
const fetchPositionsForDepartment = async (departmentName: string) => {
  try {
    if (!departmentName || !filters.company_id) {
      setFilterPositions([]);
      return;
    }

    console.log(`Fetching positions for department: ${departmentName}`);
    
    // Find the company and department from our stored data
    const selectedCompany = companiesWithDepartmentsData.find((company: any) => 
      company.name === filters.company_id || 
      company.company_name === filters.company_id
    );

    if (!selectedCompany || !selectedCompany.departments) {
      console.error('Company not found');
      setFilterPositions([]);
      return;
    }

    const selectedDepartment = selectedCompany.departments.find((dept: any) => 
      dept.name === departmentName || 
      dept.department_name === departmentName
    );

    if (!selectedDepartment || !selectedDepartment.id) {
      console.error('Department not found or no ID available');
      setFilterPositions([]);
      return;
    }

    // Fetch positions for the selected department
    const positionsRes = await axios.get(`${API_BASE_URL}/api/admin/departments/${selectedDepartment.id}/positions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });

    let positionsData: any[] = [];
    if (positionsRes.data.success && positionsRes.data.positions) {
      positionsData = positionsRes.data.positions;
    } else {
      positionsData = positionsRes.data;
    }

    // Extract position titles
    const positionTitles = positionsData.map((pos: any) => {
      return pos.title || pos.position_name || pos.name || String(pos);
    }).filter(Boolean);
    
    setFilterPositions([...new Set(positionTitles)].sort());
    console.log(`Positions for department ${departmentName}:`, positionTitles);

  } catch (error) {
    console.error(`Error fetching positions for department ${departmentName}:`, error);
    setFilterPositions([]);
  }
};

const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  
  console.log(`🔄 Filter change: ${name} = ${value}`);
  
  // If company is being changed, clear dependent filters
  if (name === 'company_id') {
    setFilters(prev => ({ 
      ...prev, 
      [name]: value,
      department_id: '',
      position: '',
      type: '',
      nationality: '',
      jobLevel: ''
    }));
    
    if (value) {
      console.log('🔄 Fetching departments for company:', value);
      fetchDepartmentsForCompany(value);
    } else {
      // If company is cleared, clear departments and positions
      console.log('🔄 Company cleared, resetting departments and positions');
      setFilterDepartments([]);
      setFilterPositions([]);
    }
  }
  // If department is being changed, clear dependent filters
  else if (name === 'department_id') {
    setFilters(prev => ({ 
      ...prev, 
      [name]: value,
      position: '',
      type: '',
      nationality: '',
      jobLevel: ''
    }));
    
    if (value) {
      console.log('🔄 Fetching positions for department:', value);
      fetchPositionsForDepartment(value);
    } else {
      // If department is cleared, clear positions
      console.log('🔄 Department cleared, resetting positions');
      setFilterPositions([]);
    }
  }
  // If position is being changed, clear dependent employee-based filters
  else if (name === 'position') {
    setFilters(prev => ({ 
      ...prev, 
      [name]: value,
      type: '',
      nationality: '',
      jobLevel: ''
    }));
  }
  // For other filters, just update the value
  else {
    setFilters(prev => ({ ...prev, [name]: value }));
  }
  
  setCurrentPage(1);
};

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      department_id: '',
      position: '',
      type: '',
      nationality: '',
      jobLevel: '',
      company_id: '',
      documentExpiry: '',
      dateRangeStart: '',
      dateRangeEnd: '',
      leaveStatus: ''
    });
    setFilterStatus('All');
    setSearchTerm('');
    setCurrentPage(1);
    setActiveQuickDate(null);
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setLeaveTypesByEmployeeId(response.data);
    } catch (err) {
      console.error('Error fetching leave types:', err);
      showNotification('Failed to load leave types. Please try again.', 'error');
    }
  };

  const fetchLeaveTypesByEmployeeId = async (employeeId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types/leave-types-by-employee-id`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        },
        params: {
          employeeId: employeeId
        }
      });
      setLeaveTypesByEmployeeId(response.data);
    } catch (err) {
      console.error('Error fetching leave types:', err);
      showNotification('Failed to load leave types. Please try again.', 'error');
    }
  };

  const fetchLeaveBalances = async (employeeId: number) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/balance`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      },
      params: {
        employeeId: employeeId,
        year: new Date().getFullYear()
      }
    });
    setLeaveBalances(response.data);
  };


const handleViewRequest3011 = async (request: LeaveRequest) => {
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
    
    const requestWithDocuments = { ...request };
    
    if (documents && documents.length > 0) {
      const firstDocument = documents[0];
      requestWithDocuments.document_url = firstDocument.document_url;
      requestWithDocuments.file_name = firstDocument.file_name;
      requestWithDocuments.document_id = firstDocument.id; // Make sure this is set
    } else {
      requestWithDocuments.document_url = undefined;
      requestWithDocuments.file_name = undefined;
      requestWithDocuments.document_id = undefined;
    }
    
    setSelectedRequest(requestWithDocuments);
    setIsViewModalOpen(true);
  } catch (err) {
    console.error('Error in handleViewRequest:', err);
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  }
};

const handleViewRequest = async (request: LeaveRequest) => {
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

  const handleRejectRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleApproveRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsApproveModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(validateRejectForm()) {
      if (!selectedRequest) return;
      
      try {
        const approvalLevel = selectedRequest.status === 'PENDING' ? 'FIRST' : 'FINAL';
        
        await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/reject`, {
          approver_id: user?.id,
          reason: rejectReason,
          approval_level: approvalLevel
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        });

        // Refresh the leave requests list
        await fetchLeaveRequests();
        showNotification('Leave request rejected successfully', 'success');
        
        setIsRejectModalOpen(false);
        setRejectReason('');
        setSelectedRequest(null);
      } catch (err) {
        console.error('Error rejecting leave request:', err);
        showNotification('Failed to reject leave request. Please try again.', 'error');
      }
    }
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const approvalLevel = selectedRequest.status === 'PENDING' ? 'FIRST' : 'FINAL';
      
      await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/approve`, {
        approver_id: user?.id,
        comment: approveComment,
        approval_level: approvalLevel
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });

      // Refresh the leave requests list
      await fetchLeaveRequests();
      showNotification('Leave request approved successfully', 'success');

      setIsApproveModalOpen(false);
      setApproveComment('');
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error approving leave request:', err);
      showNotification('Failed to approve leave request. Please try again.', 'error');
    }
  };

  const getDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = [];
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      days.push(new Date(dt));
    }
    return days;
  };

  const isDateBetween = (dateToCheck: Date, startDate: Date, endDate: Date) => {
    return dateToCheck >= startDate && dateToCheck <= endDate;
  };

const filteredData = useMemo(() => {
  return leaveRequests.filter(request => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      request.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leave_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.employee_name && request.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.employee_name && request.employee_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Employee status filter - Find the employee and check their status
    const employee = employees.find(emp => emp.id === request.employee_id);
    const matchesEmployeeStatus = filterStatus === 'All' || 
      (employee?.status && employee.status.toLowerCase() === filterStatus.toLowerCase());

    // Leave status filter
    const matchesLeaveStatus = !filters.leaveStatus || 
      request.status.toLowerCase() === filters.leaveStatus.toLowerCase();

    // Date range filter
    const matchesDateRange = () => {
      if (!filters.dateRangeStart && !filters.dateRangeEnd) return true;
      
      const startDate = filters.dateRangeStart ? new Date(filters.dateRangeStart) : null;
      const endDate = filters.dateRangeEnd ? new Date(filters.dateRangeEnd) : null;
      const requestStartDate = new Date(request.start_date);
      
      if (startDate && requestStartDate < startDate) return false;
      if (endDate && requestStartDate > endDate) return false;
      
      return true;
    };

    // Company filter
    const matchesCompany = !filters.company_id || 
      (request.company_name && request.company_name.toLowerCase() === filters.company_id.toLowerCase());

    // Department filter
    const matchesDepartment = !filters.department_id || 
      (request.department_name && request.department_name.toLowerCase() === filters.department_id.toLowerCase());

    // For other filters, we would need additional employee data
    // These are simplified for now - you can enhance them later
    const employeeForFilters = employees.find(emp => emp.id === request.employee_id);
    const matchesPosition = !filters.position || 
      (employeeForFilters?.position && employeeForFilters.position.toLowerCase() === filters.position.toLowerCase());
    
    const matchesEmploymentType = !filters.type || 
      (employeeForFilters?.employment_type && employeeForFilters.employment_type.toLowerCase() === filters.type.toLowerCase());
    
    const matchesNationality = !filters.nationality || 
      (employeeForFilters?.nationality && employeeForFilters.nationality.toLowerCase() === filters.nationality.toLowerCase());
    
    const matchesJobLevel = !filters.jobLevel || 
      (employeeForFilters?.job_level && employeeForFilters.job_level.toLowerCase() === filters.jobLevel.toLowerCase());

    return matchesSearch && matchesEmployeeStatus && matchesLeaveStatus && matchesDateRange() && 
           matchesCompany && matchesDepartment && matchesPosition && 
           matchesEmploymentType && matchesNationality && matchesJobLevel;
  });
}, [leaveRequests, searchTerm, filterStatus, filters, employees]);
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedRequests = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pending pagination logic
  const pendingRequests = leaveRequests.filter(item => item.status === 'PENDING' || item.status === 'FIRST_APPROVED');
  const pendingTotalPages = Math.ceil(pendingRequests.length / itemsPerPage);
  const paginatedPendingRequests = pendingRequests.slice((pendingCurrentPage - 1) * itemsPerPage, pendingCurrentPage * itemsPerPage);

  // Approved pagination logic
  const approvedRequests = leaveRequests.filter(item => item.status === 'APPROVED');
  const approvedTotalPages = Math.ceil(approvedRequests.length / itemsPerPage);
  const paginatedApprovedRequests = approvedRequests.slice((approvedCurrentPage - 1) * itemsPerPage, approvedCurrentPage * itemsPerPage);

  // Rejected pagination logic
  const rejectedRequests = leaveRequests.filter(item => item.status === 'REJECTED');
  const rejectedTotalPages = Math.ceil(rejectedRequests.length / itemsPerPage);
  const paginatedRejectedRequests = rejectedRequests.slice((rejectedCurrentPage - 1) * itemsPerPage, rejectedCurrentPage * itemsPerPage);

  const companies = [...new Set(leaveRequests.filter(request => request.company_name !== null).map(request => request.company_name).sort())]

  const departments = [...new Set(leaveRequests.filter(request => request.department_name !== null).map(request => request.department_name).sort())]

  const validateRejectForm = () => {
    if (!rejectReason.trim()) {
      setRejectError('Please provide a reason for rejection');
      return false;
    }
    setRejectError('');
    return true;
  };

  const resetLeaveAttachment = () => {
    setSelectedLeaveDocuments([]);
    setFormData(prev => ({
      ...prev,
      attachment: null,
      startDate: undefined,
      endDate: undefined
    }));
    setEditingRequestAttachment(null);
    setDocumentManagerKey(prev => prev + 1);
  }

  const handleSubmit2911 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
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
        const selectedType = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type);
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
          response = await axios.put(`${API_BASE_URL}/api/v1/leaves/admin/${editingRequestId}`, updateFormData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          // Create new leave request
          const formDataToSend = new FormData();
          formDataToSend.append("employee_id", formData.employee_id?.toString() || '');
          formDataToSend.append("leave_type_id", selectedType.id.toString());
          formDataToSend.append("start_date", startDate);
          formDataToSend.append("end_date", endDate);
          formDataToSend.append("reason", formData.reason);          
          if (formData.isHalfDay) {
            formDataToSend.append("is_half_day", "1");
            formDataToSend.append("duration", "0.5");
          } 
          formDataToSend.append("status", 'PENDING');
          formDataToSend.append("admin_id", user?.id?.toString() || '');
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
          response = await axios.post(`${API_BASE_URL}/api/v1/leaves/admin`, formDataToSend, {
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
            employee_id: undefined,
            isHalfDay: false
          });
          resetLeaveAttachment();
          setShowRequestModal(false);
          setIsEditing(false);
          setEditingRequestId(null);
          setEditingRequestAttachment(null);
          fetchLeaveRequests();
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

const handleSubmit0112 = async (e: React.FormEvent) => {
  e.preventDefault();


  if (validateForm()) {
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

      // Step 1: Create leave application first (without files)
      const leaveData = {
        employee_id: formData.employee_id?.toString() || '', // 🔴 FIX: Ensure string
        leave_type_id: selectedType.id.toString(), // 🔴 FIX: Ensure string
        start_date: startDate,
        end_date: endDate,
        reason: formData.reason,
        is_half_day: formData.isHalfDay ? "1" : "0"
      };

      console.log('📝 Creating leave application:', leaveData);

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
      fetchLeaveRequests();

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
    }
  }
};

const handleSubmit0112_ = async (e: React.FormEvent) => {
  e.preventDefault();

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

      // Step 1: Create leave application first (without files)
      const leaveData = {
        employee_id: formData.employee_id?.toString() || '',
        leave_type_id: selectedType.id.toString(),
        start_date: startDate,
        end_date: endDate,
        reason: formData.reason,
        is_half_day: formData.isHalfDay ? "1" : "0"
      };

      console.log('📝 Creating leave application:', leaveData);

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

      // Get the leave ID properly
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
      fetchLeaveRequests();

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
    }
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

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

      // Step 1: Create leave application first (without files)
      const leaveData = {
        employee_id: formData.employee_id?.toString() || '',
        leave_type_id: selectedType.id.toString(),
        start_date: startDate,
        end_date: endDate,
        reason: formData.reason,
        is_half_day: formData.isHalfDay
      };

      console.log('📝 Creating leave application:', leaveData);

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
      fetchLeaveRequests();

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
    }
  }
};

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      employee_id: '',
      type: '',
      reason: '',
      startDate: '',
      endDate: '',
      attachment: '',
      general: ''
    };

    if (!formData.type || formData.type === 'Select') {
      newErrors.type = 'Please select a leave type';
      isValid = false;
    }

    if (!formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
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

    // Check if attachment is required based on leave type
    const selectedLeaveType = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase());
    if (selectedLeaveType?.requires_documentation && selectedLeaveDocuments.length === 0) {
      newErrors.attachment = 'Please upload required documentation';
      isValid = false;
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

  const handleLeaveRequestDateChange0112 = (value: string, isStartDate: boolean) => {
    const date = value ? new Date(value) : undefined;
    const newFormData = { ...formData };
    
    if (isStartDate) {
      newFormData.startDate = date;
    } else {
      newFormData.endDate = date;
    }

    // Get emergency leave type and balance
    const emergencyLeave = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === 'emergency leave');
    const emergencyBalance = emergencyLeave ? leaveBalances.find((b: LeaveBalance) => b.leave_type_id === emergencyLeave.id.toString()) : null;
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
    if (formData.type.toLowerCase() === 'annual leave' && date && isLessThan5Days(date)) {
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
    if (newFormData.startDate && newFormData.endDate && hasDateConflict(newFormData.startDate, newFormData.endDate)) {
      showNotification('This date range conflicts with an existing leave request', 'error');
      return;
    }

    setFormData(newFormData);
  };

  const handleLeaveRequestDateChange = async (date: string, isStartDate: boolean) => {
      const newFormData = { ...formData };
      const dateObj = date ? new Date(date) : undefined;
      
      if (isStartDate) {
          newFormData.startDate = dateObj;
          // Auto-set end date to start date if not set
          if (!newFormData.endDate || (dateObj && dateObj > newFormData.endDate)) {
              newFormData.endDate = dateObj;
          }
      } else {
          newFormData.endDate = dateObj;
      }

      setFormData(newFormData);

      // Auto-calculate preview when all required fields are filled
      if (newFormData.employee_id && newFormData.type && newFormData.startDate && newFormData.endDate) {
          const selectedLeaveType = leaveTypesByEmployeeId.find(
              type => type.leave_type_name.toLowerCase() === newFormData.type.toLowerCase()
          );
          
          if (selectedLeaveType) {
              try {
                  await calculateLeavePreview({
                      employee_id: newFormData.employee_id,
                      leave_type_id: selectedLeaveType.id,
                      start_date: newFormData.startDate.toISOString().split('T')[0],
                      end_date: newFormData.endDate.toISOString().split('T')[0],
                      is_half_day: newFormData.isHalfDay
                  });
              } catch (error) {
                  console.error('Failed to calculate preview:', error);
              }
          }
      }
  };

  // Add function to check if dates are less than 5 days from today
  const isLessThan5Days = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 5;
  };

  // Add function to check for date conflicts
  const hasDateConflict = (startDate: Date, endDate: Date): boolean => {
    // Get all approved and pending leave requests for the selected employee
    const existingRequests = employeeLeaveApplications.filter(
      request => {
        // When editing, exclude the current request from conflict check
        if (isEditing && editingRequestId === request.id) {
          return false;
        }
        return request.status === 'APPROVED' || request.status === 'PENDING' || request.status === 'FIRST_APPROVED';
      }
    );

    // Create array of dates between start and end date
    const datesToCheck: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      datesToCheck.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check each date against existing requests
    return datesToCheck.some(dateToCheck => {
      return existingRequests.some(request => {
        const requestStart = calculateDateInUTC(new Date(request.start_date));
        const requestEnd = calculateDateInUTC(new Date(request.end_date));
        return dateToCheck >= requestStart && dateToCheck <= requestEnd;
      });
    });
  };

  const handleLeaveTypeChange0112 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleHalfDayToggle = async (isHalfDay: boolean) => {
      const newFormData = { ...formData, isHalfDay };
      setFormData(newFormData);

      if (formData.employee_id && formData.type && formData.startDate && formData.endDate) {
          const selectedLeaveType = leaveTypesByEmployeeId.find(
              type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase()
          );
          
          if (selectedLeaveType) {
              try {
                  await calculateLeavePreview({
                      employee_id: formData.employee_id,
                      leave_type_id: selectedLeaveType.id,
                      start_date: formData.startDate.toISOString().split('T')[0],
                      end_date: formData.endDate.toISOString().split('T')[0],
                      is_half_day: isHalfDay
                  });
              } catch (error) {
                  console.error('Failed to calculate preview:', error);
              }
          }
      }
  };

  const handleLeaveTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      setFormData({ ...formData, type: newType });
      clearPreview();

      // Auto-calculate preview if dates are already selected
      if (formData.employee_id && formData.startDate && formData.endDate && newType) {
          const selectedLeaveType = leaveTypesByEmployeeId.find(
              type => type.leave_type_name.toLowerCase() === newType.toLowerCase()
          );
          
          if (selectedLeaveType) {
              try {
                  await calculateLeavePreview({
                      employee_id: formData.employee_id,
                      leave_type_id: selectedLeaveType.id,
                      start_date: formData.startDate.toISOString().split('T')[0],
                      end_date: formData.endDate.toISOString().split('T')[0],
                      is_half_day: formData.isHalfDay
                  });
              } catch (error) {
                  console.error('Failed to calculate preview:', error);
              }
          }
      }
  };


  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      showNotification('Failed to load employees. Please try again.', 'error');
    }
  };

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const fetchEmployeeLeaveApplications = async (employeeId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        },
        params: {
          employeeId: employeeId
        }
      });
      setEmployeeLeaveApplications(response.data);
    } catch (err) {
      console.error('Error fetching employee leave applications:', err);
      showNotification('Failed to load employee leave applications', 'error');
    }
  };

  const handleEmployeeSelect = (employee: { id: number; name: string; email: string; employee_no: string }) => {
    setFormData(prev => ({
      ...prev,
      employee_id: employee.id
    }));
    setSearchTerm(employee.name);
    fetchLeaveTypesByEmployeeId(employee.id);
    fetchEmployeeLeaveApplications(employee.id);
    fetchLeaveBalances(employee.id);
  };

  const getRequestDuration = () => {
    if (formData.isHalfDay) {
      return 0.5;
    }
    if (!formData.startDate || !formData.endDate) return 0;
    return calculateDuration(formData.startDate, formData.endDate);
  };

  const getRemainingDays = () => {
    if (!formData.type) return 0;
    const selectedType = leaveTypesByEmployeeId.find(type => type.leave_type_name.toLowerCase() === formData.type.toLowerCase());
    if (!selectedType) return 0;
    
    const leaveBalance = leaveBalances.find(balance => balance.leave_type_id === selectedType.id.toString());
    if (!leaveBalance) return 0;
    console.log(leaveBalance);
    // For total days calculation
    if (leaveBalance.is_total) {
      return leaveBalance.total_days - leaveBalance.used_days;
    }
    
    // For dividend-based calculation
    if (leaveBalance.is_divident) {
      return leaveBalance.accrual_remaining_days;
    }

    // Default case: return total days minus used days
    return leaveBalance.total_days - leaveBalance.used_days;
  };

  const downloadAttachment = async (documentId: number, fileName: string) => {
  try {
    console.log(`📥 Downloading leave attachment: ${fileName}`);
    
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
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${theme === 'light' ? 'bg-red-50 border-red-400' : 'bg-red-900/20 border-red-500'} border-l-4 p-4`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className={`h-5 w-5 ${theme === 'light' ? 'text-red-400' : 'text-red-300'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className={`text-sm ${theme === 'light' ? 'text-red-700' : 'text-red-200'}`}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

const openEditModal = async (request: LeaveRequest) => {
  setFormData({
    type: request.leave_type_name.toLowerCase(),
    startDate: new Date(request.start_date),
    endDate: new Date(request.end_date),
    reason: request.reason,
    attachment: null,
    employee_id: request.employee_id,
    isHalfDay: request.duration === 0.5
  });
  setIsEditing(true);
  setEditingRequestId(request.id);
  setShowRequestModal(true);
  
  // Fetch all documents for this leave application
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/leaves/${request.id}/documents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    const documents = res.data;
    setEditingRequestDocuments(documents);
    setSelectedRequestDocuments(documents); // Set for view modal consistency
    
    // If the request has attachments, set the first one for backward compatibility
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
    setSelectedRequestDocuments([]);
    setEditingRequestAttachment(null);
  }
};

  const openEditModal3011 = async (request: LeaveRequest) => {
    setFormData({
      type: request.leave_type_name.toLowerCase(),
      startDate: new Date(request.start_date),
      endDate: new Date(request.end_date),
      reason: request.reason,
      attachment: null,
      employee_id: request.employee_id,
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

  const handleRejectAllApproved = () => {
    if (!selectedRequest) return;
    setIsRejectAllConfirmModalOpen(true);
  };

  const confirmRejectAllApproved = async () => {
    if (!selectedRequest) return;

    try {
      const approvalLevel = 'FINAL';

      await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/reject`, {
        approver_id: 1,
        reason: 'All approved leave days rejected by admin',
        approval_level: approvalLevel
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });

      // Refresh the leave requests list
      await fetchLeaveRequests();
      showNotification('All approved leave days rejected successfully', 'success');

      setIsRejectAllConfirmModalOpen(false);
      setIsViewModalOpen(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error rejecting all approved leave:', err);
      showNotification('Failed to reject all approved leave. Please try again.', 'error');
    }
  };

  // Smart pagination functions
  const getPageNumbers = (currentPage: number, totalPages: number) => {
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

  const goToPage = (pageNumber: number, pageType: 'main' | 'pending' | 'approved' | 'rejected') => {
    if (pageType === 'main' && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else if (pageType === 'pending' && pageNumber >= 1 && pageNumber <= pendingTotalPages) {
      setPendingCurrentPage(pageNumber);
    } else if (pageType === 'approved' && pageNumber >= 1 && pageNumber <= approvedTotalPages) {
      setApprovedCurrentPage(pageNumber);
    } else if (pageType === 'rejected' && pageNumber >= 1 && pageNumber <= rejectedTotalPages) {
      setRejectedCurrentPage(pageNumber);
    }
  };

  return (
    <>
      {/* Notification Toast */}
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />

      <div className={`container mx-auto p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>


      {/* Search and Filter Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group flex space-x-2">
            <input 
              type="text" 
              placeholder="Search by employee name, number, email, or leave type..." 
              className={`input input-bordered flex-1 ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters {Object.values(filters).filter(Boolean).length > 0 || filterStatus !== 'All' ? `(${Object.values(filters).filter(Boolean).length + (filterStatus !== 'All' ? 1 : 0)})` : ''}
            </button>
          </div>
        </div>
      </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
          <div className="join shadow-sm overflow-x-auto w-full sm:w-auto">
            <div className="flex gap-1 sm:gap-0">
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'today' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect('today')}
              >
                Today
              </button>
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'yesterday' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect('yesterday')}
              >
                Yesterday
              </button>
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'thisWeek' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect('thisWeek')}
              >
                <span className="hidden sm:inline">This Week</span>
                <span className="sm:hidden">Week</span>
              </button>
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'lastWeek' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect('lastWeek')}
              >
                <span className="hidden sm:inline">Last Week</span>
                <span className="sm:hidden">L.Week</span>
              </button>
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'thisMonth' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect('thisMonth')}
              >
                <span className="hidden sm:inline">This Month</span>
                <span className="sm:hidden">Month</span>
              </button>
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === 'lastMonth' ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect('lastMonth')}
              >
                <span className="hidden sm:inline">Last Month</span>
                <span className="sm:hidden">L.Month</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className={`btn btn-sm sm:btn-md w-full sm:w-auto flex items-center gap-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Create Leave Request</span>
            <span className="sm:hidden">Create Request</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'} p-4 rounded-lg mb-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Advanced Filters</h3>
              <button 
                className={`btn btn-sm btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-700'}`}
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Leave Status */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Status</span>
                  </label>
                  <select
                    name="leaveStatus"
                    value={filters.leaveStatus}
                    onChange={handleFilterChange}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Employee Status */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Employee Status</span>
                  </label>
                  <select 
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                    value={filterStatus} 
                    onChange={handleStatusChange}
                  >
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="resigned">Resigned</option>
                  </select>
                </div>

                {/* Date Range Start */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Date Range (Start)</span>
                  </label>
                  <input
                    type="date"
                    name="dateRangeStart"
                    value={filters.dateRangeStart}
                    onChange={handleFilterChange}
                    className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  />
                </div>

                {/* Date Range End */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Date Range (End)</span>
                  </label>
                  <input
                    type="date"
                    name="dateRangeEnd"
                    value={filters.dateRangeEnd}
                    onChange={handleFilterChange}
                    className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  />
                </div>

                {/* Company */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
                  </label>
                  <select
                    name="company_id"
                    value={filters.company_id}
                    onChange={handleFilterChange}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="">All Companies</option>
                    {filterCompanies.map((company: string) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Department</span>
                  </label>
                  <select
                    name="department_id"
                    value={filters.department_id}
                    onChange={handleFilterChange}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="">All Departments</option>
                    {filterDepartments.map((dept: string) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Position</span>
                  </label>
                  <select
                    name="position"
                    value={filters.position}
                    onChange={handleFilterChange}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="">All Positions</option>
                    {filterPositions.map((position: string) => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                {/* Employment Type */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Employment Type</span>
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="">All Types</option>
                    {filterEmploymentTypes.map((type: string) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Nationality */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Nationality</span>
                  </label>
                  <select
                    name="nationality"
                    value={filters.nationality}
                    onChange={handleFilterChange}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="">All Nationalities</option>
                    {filterNationalities.map((nationality: string) => (
                      <option key={nationality} value={nationality}>{nationality}</option>
                    ))}
                  </select>
                </div>

                {/* Job Level */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Job Level</span>
                  </label>
                  <select
                    name="jobLevel"
                    value={filters.jobLevel}
                    onChange={handleFilterChange}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="">All Job Levels</option>
                    {filterJobLevels.map((level: string) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Results Count */}
        <div className={`mb-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
          Showing {filteredData.length} leave requests
          {(searchTerm || Object.values(filters).some(Boolean) || filterStatus !== 'All') && (
            <span className={`${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              {' '}(filtered)
            </span>
          )}
        </div>
      </div>
      
      <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        {/* Leave Request Table */}
        <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
          <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="card-body p-3 sm:p-4 lg:p-6">
              <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Leave Request
              </h2>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full min-w-full">
                  <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Duration</th>
                      <th>Status</th>                    
                      <th className='text-center'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map(request => (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
                        <td>
                          <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {request.leave_type_name}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {new Date(request.start_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric'
                            })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'numeric',
                              year: 'numeric'
                            })}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                        </td>
                        <td>
                            <span className={`badge ${getBadgeClass(request.status)}`}>
                              {request.status}
                            </span>
                        </td>
                        <td className="text-right flex justify-end">
                          {request.status === 'PENDING' && user?.role !== 'employee' && (
                            <>
                              <button 
                                onClick={() => handleApproveRequest(request)}
                                className={`btn btn-sm mr-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(request)}
                                className="btn btn-sm btn-error mr-2"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {request.status === 'FIRST_APPROVED' && user?.role !== 'employee' && (
                            <>
                              <button 
                                onClick={() => handleApproveRequest(request)}
                                className={`btn btn-sm mr-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
                                >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(request)}
                                className="btn btn-sm btn-error mr-2"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleViewRequest(request)}
                            className="btn btn-sm btn-info mr-2"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No leave requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="btn-group">
                    <button 
                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                      onClick={() => goToPage(1, 'main')}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                    <button 
                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                      onClick={() => goToPage(currentPage - 1, 'main')}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>
                    {getPageNumbers(currentPage, totalPages).map(page => (
                      <button 
                        key={page}
                        className={`btn btn-sm ${currentPage === page ? 
                          `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                          `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                        }`}
                        onClick={() => goToPage(page, 'main')}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                      onClick={() => goToPage(currentPage + 1, 'main')}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                    <button 
                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                      onClick={() => goToPage(totalPages, 'main')}
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
      </div>
      
      <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        {/* Pending Approval */}
        <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Approval ({pendingRequests.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full min-w-full">
                <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPendingRequests.map(request => {
                    // Calculate duration in days
                    const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
                        <td>
                        <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {request.leave_type_name}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {new Date(request.start_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                          })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {duration} day{duration !== 1 ? 's' : ''}
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="text-right flex justify-end">
                          {user?.role !== 'employee' && (
                            <>
                              <button 
                                onClick={() => handleApproveRequest(request)}
                                className={`btn btn-sm mr-2 ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(request)}
                                className="btn btn-sm btn-error mr-2"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleViewRequest(request)}
                            className="btn btn-sm btn-info mr-2"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {pendingRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No pending leave requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls for Pending */}
            {pendingTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(1, 'pending')}
                    disabled={pendingCurrentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(pendingCurrentPage - 1, 'pending')}
                    disabled={pendingCurrentPage === 1}
                  >
                    «
                  </button>
                  {getPageNumbers(pendingCurrentPage, pendingTotalPages).map(page => (
                    <button 
                      key={page}
                      className={`btn btn-sm ${pendingCurrentPage === page ? 
                        `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                        `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                      }`}
                      onClick={() => goToPage(page, 'pending')}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(pendingCurrentPage + 1, 'pending')}
                    disabled={pendingCurrentPage === pendingTotalPages}
                  >
                    »
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(pendingTotalPages, 'pending')}
                    disabled={pendingCurrentPage === pendingTotalPages}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        {/* Recently Approved  */}
        <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recently Approved ({approvedRequests.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full min-w-full">
                <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApprovedRequests.map(request => {
                    // Calculate duration in days
                    const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
                        <td>
                        <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {request.leave_type_name}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {new Date(request.start_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                          })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button 
                            onClick={() => handleViewRequest(request)}
                            className="btn btn-sm btn-info mr-2"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {approvedRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No approved leave requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls for Approved */}
            {approvedTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(1, 'approved')}
                    disabled={approvedCurrentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(approvedCurrentPage - 1, 'approved')}
                    disabled={approvedCurrentPage === 1}
                  >
                    «
                  </button>
                  {getPageNumbers(approvedCurrentPage, approvedTotalPages).map(page => (
                    <button 
                      key={page}
                      className={`btn btn-sm ${approvedCurrentPage === page ? 
                        `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                        `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                      }`}
                      onClick={() => goToPage(page, 'approved')}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(approvedCurrentPage + 1, 'approved')}
                    disabled={approvedCurrentPage === approvedTotalPages}
                  >
                    »
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(approvedTotalPages, 'approved')}
                    disabled={approvedCurrentPage === approvedTotalPages}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        {/* Rejected */}
        <div className={`card shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <div className="card-body p-3 sm:p-4 lg:p-6">
            <h2 className={`card-title flex items-center gap-2 mb-4 sm:mb-6 text-lg sm:text-xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rejected ({rejectedRequests.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full min-w-full">
                <thead className={`${theme === 'light' ? 'bg-blue-50 text-gray-700' : 'bg-slate-700 text-slate-100'}`}>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRejectedRequests.map(request => {
                    // Calculate duration in days
                    const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <tr key={request.id} className={`${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-slate-700'}`}>
                        <td>
                        <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {request.leave_type_name}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {new Date(request.start_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                          })} - {new Date(request.end_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className={`${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button 
                            onClick={() => handleViewRequest(request)}
                            className="btn btn-sm btn-info mr-2"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {rejectedRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className={`text-center ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>No rejected leave requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls for Rejected */}
            {rejectedTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(1, 'rejected')}
                    disabled={rejectedCurrentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(rejectedCurrentPage - 1, 'rejected')}
                    disabled={rejectedCurrentPage === 1}
                  >
                    «
                  </button>
                  {getPageNumbers(rejectedCurrentPage, rejectedTotalPages).map(page => (
                    <button 
                      key={page}
                      className={`btn btn-sm ${rejectedCurrentPage === page ? 
                        `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                        `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                      }`}
                      onClick={() => goToPage(page, 'rejected')}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(rejectedCurrentPage + 1, 'rejected')}
                    disabled={rejectedCurrentPage === rejectedTotalPages}
                  >
                    »
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => goToPage(rejectedTotalPages, 'rejected')}
                    disabled={rejectedCurrentPage === rejectedTotalPages}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      <dialog id="view_modal" className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box w-11/12 max-w-5xl p-0 overflow-hidden shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'}`}>
          {/* Modal Header */}
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-base-200 border-base-300' : 'bg-slate-700 border-slate-600'}`}>
            <h3 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${theme === 'light' ? 'text-primary' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">Leave Request Details</span>
            </h3>
            <button 
              className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-600'}`}
                onClick={() => {
    setIsViewModalOpen(false);
    setSelectedRequestDocuments([]); 
  }}
  // onClick={() => setIsViewModalOpen(false)}
            >✕</button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            {selectedRequest && (
              <div className="space-y-4 sm:space-y-5">
                {/* Status Badge */}
                <div className="flex justify-end mb-2">
                  <span className={`badge ${
                    selectedRequest.status === 'APPROVED' ? 'badge-success' :
                    selectedRequest.status === 'REJECTED' ? 'badge-error' :
                    selectedRequest.status === 'FIRST_APPROVED' ? 'badge-warning' : 'badge-info'
                  } text-white py-2 sm:py-3 px-3 sm:px-4 text-sm font-medium`}>
                    {selectedRequest.status}
                  </span>
                </div>

                {/* Main Info Section */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4 p-3 sm:p-4 rounded-lg ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Employee</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.employee_name}</p>
                  </div>
                  
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Department</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.department_name}</p>
                  </div>
                  
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Company</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.company_name}</p>
                  </div>
                  
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
                  </div>

                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Request Date</h4>
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                      {/* {new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })} */}
                    {formatToMalaysiaTime(selectedRequest.created_at)}
                    </p>
                  </div>
                </div>

                {/* Leave Details */}
                <div className={`border rounded-lg ${theme === 'light' ? 'border-base-300' : 'border-slate-600'}`}>
                  <h4 className={`text-sm sm:text-base font-semibold px-3 sm:px-4 py-2 rounded-t-lg ${theme === 'light' ? 'bg-base-200 text-gray-900' : 'bg-slate-700 text-slate-100'}`}>Leave Details</h4>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          
                          {/* {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })} */}
                        {formatDateDDMMMYYYY(selectedRequest.start_date)}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {/* {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })} */}

                        {formatDateDDMMMYYYY(selectedRequest.end_date)}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Duration</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Reason</h4>
                      <p className={`p-2 sm:p-3 rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-base-200/40 text-gray-900' : 'bg-slate-700/40 text-slate-100'}`}>{selectedRequest.reason}</p>
                    </div>
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
{/* Replace the single attachment section with this multiple attachments section */}
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

{/* Keep the single attachment section as fallback for backward compatibility */}
{selectedRequestDocuments.length === 0 && selectedRequest?.document_url && (
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
)}
                  </div>
                </div>

                {/* Approval Section */}
                {(selectedRequest.status === 'FIRST_APPROVED' || selectedRequest.status === 'APPROVED') && (
                  <div className="border border-base-300 rounded-lg">
                    <h4 className="text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg">
                      Approval Information
                    </h4>
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                      {/* First Approval */}
                      <div className="bg-base-200/40 p-2 sm:p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <h5 className="text-sm sm:text-base font-medium">First Approval</h5>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-6 sm:pl-7">
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approved By</h4>
                            <p className="text-sm sm:text-base">{selectedRequest.first_approver_name}</p>
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approval Date</h4>
                            <p className="text-sm sm:text-base">
                              {/* {selectedRequest.first_approval_date ? getDateAndTime(selectedRequest.first_approval_date) : 'N/A'} */}
                               {selectedRequest.first_approval_date ? formatToMalaysiaTime(selectedRequest.first_approval_date) : 'N/A'}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Comments</h4>
                            <p className="text-sm sm:text-base">{selectedRequest.first_approval_comment || 'No comments'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Second Approval (if available) */}
                      {selectedRequest.status === 'APPROVED' && (
                        <div className="bg-base-200/40 p-2 sm:p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <h5 className="text-sm sm:text-base font-medium">Final Approval</h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-6 sm:pl-7">
                            <div>
                              <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approved By</h4>
                              <p className="text-sm sm:text-base">{selectedRequest.second_approver_name}</p>
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Approval Date</h4>
                              <p className="text-sm sm:text-base">
                                {/* {selectedRequest.second_approval_date ? getDateAndTime(selectedRequest.second_approval_date) : 'N/A'} */}
                                 {selectedRequest.second_approval_date ? formatToMalaysiaTime(selectedRequest.second_approval_date) : 'N/A'}
                              </p>
                            </div>
                            <div className="sm:col-span-2">
                              <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Comments</h4>
                              <p className="text-sm sm:text-base">{selectedRequest.second_approval_comment || 'No comments'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rejection Section */}
                {selectedRequest.status === 'REJECTED' && (
                  <div className="border border-error/20 rounded-lg">
                    <h4 className="text-sm sm:text-base font-semibold bg-error/10 px-3 sm:px-4 py-2 rounded-t-lg text-error flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Rejection Information
                    </h4>
                    <div className="p-3 sm:p-4 space-y-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Rejected By</h4>
                        <p className="text-sm sm:text-base font-medium">
                          {selectedRequest.second_approver_name || selectedRequest.first_approver_name}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Rejection Date</h4>
                        <p className="text-sm sm:text-base font-medium">
                          {formatToMalaysiaTime(selectedRequest.updated_at)}{/* {getDateAndTime(selectedRequest.updated_at)} */}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Rejection Reason</h4>
                        <p className="p-2 sm:p-3 bg-error/5 rounded-md text-sm sm:text-base">
                          {selectedRequest.rejection_reason || 'No reason provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className={`modal-action flex justify-between z-10 px-4 sm:px-6 py-3 sm:py-4 border-t mt-auto ${theme === 'light' ? 'border-base-300 bg-base-100' : 'border-slate-600 bg-slate-800'}`}>
            <div className="flex gap-2">
                {selectedRequest?.status === 'APPROVED' && user?.role !== 'employee' && (
                  <>                 
                    <button
                      className="btn btn-sm sm:btn-md btn-error"
                      onClick={handleRejectAllApproved}
                    >
                      Reject Approved Leave
                    </button>
                  </>
                )}
              </div>
            
            <button
              className={`btn ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}
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

      {/* Reject Modal */}
      <dialog id="reject_modal" className={`modal ${isRejectModalOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box w-11/12 max-w-5xl p-0 overflow-hidden shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col ${theme === 'light' ? 'bg-base-100' : 'bg-slate-800'}`}>
          {/* Modal Header */}
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center z-10 ${theme === 'light' ? 'bg-base-200 border-base-300' : 'bg-slate-700 border-slate-600'}`}>
            <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">Reject Leave Request</span>
            </h3>
            <button 
              className={`btn btn-sm btn-circle btn-ghost ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-600'}`}
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason('');
                setRejectError('');
              }}
            >✕</button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            {selectedRequest && (
              <div className="space-y-5">

              {/* Main Info Section */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4 p-3 sm:p-4 rounded-lg ${theme === 'light' ? 'bg-base-200/40' : 'bg-slate-700/40'}`}>
                <div>
                  <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Employee</h4>
                  <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.employee_name}</p>
                </div>
                
                <div>
                  <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Department</h4>
                  <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.department_name}</p>
                </div>
                
                <div>
                  <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Company</h4>
                  <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.company_name}</p>
                </div>
                
                <div>
                  <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Leave Type</h4>
                  <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{selectedRequest.leave_type_name}</p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Request Date</h4>
                  <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                    {/* {new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })} */}
                    {formatToMalaysiaTime(selectedRequest.created_at)}
                  </p>
                </div>
              </div>

              {/* Leave Details */}
              <div className={`border rounded-lg ${theme === 'light' ? 'border-base-300' : 'border-slate-600'}`}>
                <h4 className={`text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg ${theme === 'light' ? 'bg-base-200 text-gray-900' : 'bg-slate-700 text-slate-100'}`}>Leave Details</h4>
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
                      <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {/* {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} */}
                      {formatDateDDMMMYYYY(selectedRequest.start_date)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
                      <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {/* {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} */}
                       {formatDateDDMMMYYYY(selectedRequest.end_date)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Duration</h4>
                      <p className="text-sm sm:text-base font-semibold">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Reason</h4>
                    <p className="p-2 sm:p-3 bg-base-200/40 rounded-md text-sm sm:text-base">{selectedRequest.reason}</p>
                  </div>

                  {selectedRequest.document_url && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Attachment</h4>
                      <div className="flex items-center gap-2 p-2 bg-base-200/40 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
                          }}
                          className="text-xs sm:text-sm text-primary hover:text-primary-focus hover:underline font-medium truncate flex items-center gap-2"
                          style={{ cursor: 'pointer' }}
                        >
                          Download {selectedRequest.file_name}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                {/* Rejection Form */}
                <form onSubmit={handleRejectSubmit}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm sm:text-base font-medium">Rejection Reason <span className="text-error">*</span></span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered h-24 sm:h-32 w-full ${rejectError ? 'textarea-error' : ''}`}
                      placeholder="Please provide a reason for rejecting this leave request"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                    {rejectError && (
                      <div className="text-error text-sm mt-1">
                        {rejectError}
                      </div>
                    )}
                  </div>

                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 sm:p-4 mt-5 sm:mt-6">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-warning">Important Note</h4>
                        <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
                          Rejecting this leave request cannot be undone. The employee will be notified of your decision and the reason provided.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Error */}
                  {error && (
                    <div className="alert alert-error mt-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-action px-4 sm:px-6 py-3 sm:py-4 border-t border-base-300 bg-base-100 mt-auto">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason('');
                setRejectError('');
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleRejectSubmit}
            >
              Reject Leave
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {
            setIsRejectModalOpen(false);
            setRejectReason('');
            setRejectError('');
          }}>close</button>
        </form>
      </dialog>

      {/* Approve Modal */}
      <dialog id="approve_modal" className={`modal ${isApproveModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-base-100 shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-base-200 px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 flex justify-between items-center z-10">
            <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">Approve Leave Request</span>
            </h3>
            <button 
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => {
                setIsApproveModalOpen(false);
                setApproveComment('');
              }}
            >✕</button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            {selectedRequest && (
              <div className="space-y-5">

              {/* Main Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4 bg-base-200/40 p-3 sm:p-4 rounded-lg">
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Employee</h4>
                  <p className="text-sm sm:text-base font-semibold">{selectedRequest.employee_name}</p>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Department</h4>
                  <p className="text-sm sm:text-base font-semibold">{selectedRequest.department_name}</p>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Company</h4>
                  <p className="text-sm sm:text-base font-semibold">{selectedRequest.company_name}</p>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Leave Type</h4>
                  <p className="text-sm sm:text-base font-semibold">{selectedRequest.leave_type_name}</p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Request Date</h4>
                  <p className="text-sm sm:text-base font-semibold">
                    {/* {new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} */}
                    {formatToMalaysiaTime(selectedRequest.created_at)}
                  </p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="border border-base-300 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg">Leave Details</h4>
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Start Date</h4>
                      <p className="text-sm sm:text-base font-semibold">
                        {/* {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} */}
                       {formatDateDDMMMYYYY(selectedRequest.start_date)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">End Date</h4>
                      <p className="text-sm sm:text-base font-semibold">
                        {/* {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} */}
                       {formatDateDDMMMYYYY(selectedRequest.end_date)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Duration</h4>
                      <p className="text-sm sm:text-base font-semibold">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Reason</h4>
                    <p className="p-2 sm:p-3 bg-base-200/40 rounded-md text-sm sm:text-base">{selectedRequest.reason}</p>
                  </div>

                  {selectedRequest.document_url && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Attachment</h4>
                      <div className="flex items-center gap-2 p-2 bg-base-200/40 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
                          }}
                          className="text-xs sm:text-sm text-primary hover:text-primary-focus hover:underline font-medium truncate flex items-center gap-2"
                          style={{ cursor: 'pointer' }}
                        >
                          Download {selectedRequest.file_name}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                {/* Approval Form */}
                <form onSubmit={handleApproveSubmit}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm sm:text-base font-medium">Approval Comment (Optional)</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24 sm:h-32 w-full"
                      placeholder="Add any comments regarding this approval (optional)"
                      value={approveComment}
                      onChange={(e) => setApproveComment(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="bg-success/10 border border-success/20 rounded-lg p-3 sm:p-4 mt-5 sm:mt-6">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-success">Approval Confirmation</h4>
                        <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
                          By approving this leave request, you confirm that the employee is eligible for this leave and their absence has been accounted for.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Error */}
                  {error && (
                    <div className="alert alert-error mt-5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-action px-4 sm:px-6 py-3 sm:py-4 border-t border-base-300 bg-base-100 mt-auto">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setIsApproveModalOpen(false);
                setApproveComment('');
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-success text-white"
              onClick={handleApproveSubmit}
            >
              Approve Leave
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {
            setIsApproveModalOpen(false);
            setApproveComment('');
          }}>close</button>
        </form>
      </dialog>

      {/* Leave Request Modal */}
      <dialog
        id="leave_request_modal"
        className={`modal ${showRequestModal ? 'modal-open' : ''}`}
      >
        <div className="modal-box max-w-3xl p-0 overflow-hidden max-h-[90vh]">
          {/* Modal Header */}
          <div className="bg-base-200 px-6 py-4 border-b border-base-300">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {isEditing ? 'Edit Leave Request' : 'New Leave Request'}
            </h3>
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                onClick={() => {
                  setShowRequestModal(false);
                  setIsEditing(false);
                  setEditingRequestId(null);
                  setEditingRequestAttachment(null);
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
                    <span className="label-text font-medium">Employee</span>
                  </label>
                  <div className="input-group flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search by name, email or employee number..."
                      className={`input input-bordered w-full ${errors.employee_id ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                      type="button"
                      className="btn btn-square" 
                      onClick={(e) => {
                        e.preventDefault();
                        fetchEmployees();
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                  {filteredEmployees.length > 0 && searchTerm && (
                    <div className="mt-2 max-h-48 overflow-y-auto bg-base-100 rounded-lg shadow-lg">
                      {filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className="p-2 hover:bg-base-200 cursor-pointer"
                          onClick={() => handleEmployeeSelect(employee)}
                        >
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm opacity-70">{employee.email}</div>
                          <div className="text-sm opacity-70">Employee No: {employee.employee_no}</div>
                        </div>
                      ))}
                    </div>
                  )}
                {errors.employee_id && <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>}
                </div>                

              </div>

              {(previewData || isLoadingPreview || previewError) && (
    <div className="bg-base-200 rounded-lg p-4 mt-4">
        {/* <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Leave Calculation
        </h4> */}
        
        {isLoadingPreview && (
            <div className="flex items-center gap-2 text-blue-600">
                <div className="loading loading-spinner loading-sm"></div>
                Calculating leave duration...
            </div>
        )}

        {previewError && (
            <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{previewError}</span>
            </div>
        )}

        {previewData && (
            <div className="space-y-3">
                {/* Duration Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Calculated Duration:</span>
                        <div className="font-semibold text-lg text-blue-600">
                            {previewData.calculation?.duration ?? 0} day(s)
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-600">Available Balance:</span>
                        <div className={`font-semibold text-lg ${
                            previewData.balance?.sufficient ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {previewData.balance?.available ?? 0} day(s)
                        </div>
                    </div>
                </div>

                {/* Breakdown Details */}
                {previewData.calculation?.breakdown && (
                    <div className="text-xs bg-base-100 rounded p-3">
                        <div className="font-medium mb-2">Calculation Breakdown:</div>
                        <div className="grid grid-cols-2 gap-2">
                            <span>Total Work Days:</span>
                            <span>{previewData.calculation.breakdown.total_work_days}</span>
                            
                            <span>Holidays Excluded:</span>
                            <span>{previewData.calculation.breakdown.holidays_excluded}</span>
                            
                            <span>Actual Working Days:</span>
                            <span>{previewData.calculation.breakdown.actual_working_days}</span>
                        </div>
                    </div>
                )}

                {/* Validation Status */}
                <div className="text-xs">
                    {previewData.validation?.has_sufficient_balance === false && (
                        <div className="text-red-600 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Insufficient leave balance
                        </div>
                    )}
                    
                    {previewData.validation?.has_overlapping_leaves && (
                        <div className="text-red-600 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Overlapping leave exists
                        </div>
                    )}

                    {previewData.validation?.requires_documentation && (
                        <div className="text-amber-600 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Documentation required for this leave type
                        </div>
                    )}

                    {previewData.can_proceed && (
                        <div className="text-green-600 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ready to submit leave application
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
)}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Leave Type</span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${errors.type ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
                    id="leave_type"
                    name="leave_type"
                    value={formData.type}
                    onChange={handleLeaveTypeChange}
                    disabled={isLoading}
                  >
                    <option>Select</option>
                    {leaveTypesByEmployeeId
                      .filter((type: { is_active: boolean }) => type.is_active)
                      .map((type: { id: number, leave_type_name: string }) => (
                        <option key={type.id} value={type.leave_type_name.toLowerCase()}>
                          {type.leave_type_name}
                        </option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Reason</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.reason ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
                    placeholder="Brief reason for leave"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                  {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* {formData.type !== 'unpaid leave' && (
                  <div className="col-span-1 md:col-span-2 mb-1">
                    <div className="text-sm flex justify-center gap-8">
                      <div>
                        <span className="text-gray-600">Request Duration: </span>
                        <span className="font-medium text-blue-600">{getRequestDuration()} days</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Remaining Balance: 
                        {(() => {
                          let remainingDays = getRemainingDays();
                          return remainingDays > 0 ? (
                            <span className="font-medium text-blue-600">{remainingDays} days</span>
                          ) : (
                            <span className="font-medium text-red-600">{remainingDays} days</span>
                          );
                        })()}
                        </span>
                      </div>
                    </div>
                  </div>
                )} */}
                {/* Enhanced Preview Section */}

                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>Start Date</span>
                  </label>
                  <div className={`${theme === 'light' ? 'bg-white' : 'oklch(0 0 0 / 0.4)'} p-3 rounded-lg ${errors.startDate ? 'border border-red-500' : ''}`}>
                    <input
                      type="date"
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white text-gray-900 border-blue-300 focus:border-blue-500' : 'oklch(0 0 0 / 0.4) text-slate-100 border-slate-600 focus:border-blue-500'}`}
                      value={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleLeaveRequestDateChange(e.target.value, true)}
                    />
                  </div>
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className={`label-text font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>End Date</span>
                  </label>
                  <div className={`${theme === 'light' ? 'bg-white' : 'oklch(0 0 0 / 0.4)'} p-3 rounded-lg ${errors.endDate ? 'border border-red-500' : ''}`}>
                    <input
                      type="date"
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white text-gray-900 border-blue-300 focus:border-blue-500' : 'oklch(0 0 0 / 0.4) text-slate-100 border-slate-600 focus:border-blue-500'}`}
                      value={formData.endDate ? calculateDateInUTC(formData.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleLeaveRequestDateChange(e.target.value, false)}
                      min={formData.startDate ? calculateDateInUTC(formData.startDate).toISOString().split('T')[0] : calculateDateInUTC(new Date()).toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              {/* Add Half Day Checkbox - Only show when start and end dates are the same */}
              {formData.startDate && formData.endDate && 
               formData.startDate.toISOString().split('T')[0] === formData.endDate.toISOString().split('T')[0] && (
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={formData.isHalfDay}
                      onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
                    />
                    <span className="label-text ml-2">Half Day Leave</span>
                  </label>
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
                    />
                  </div>
                  {errors.attachment && <p className="text-red-500 text-sm mt-1">{errors.attachment}</p>}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-4 mt-6 pt-4">
                <button
                  type="button"
                  className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
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
                    setSearchTerm('');
                    setFilteredEmployees([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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

      {/* Reject All Approved Leave Confirmation Modal */}
      <dialog id="reject_all_confirm_modal" className={`modal ${isRejectAllConfirmModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-md p-0 overflow-hidden bg-base-100 shadow-lg mx-auto">
          {/* Modal Header */}
          <div className="bg-error/10 px-4 sm:px-6 py-3 sm:py-4 border-b border-error/20 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2 text-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Confirm Rejection
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost text-error"
              onClick={() => setIsRejectAllConfirmModalOpen(false)}
            >✕</button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6">
            {selectedRequest && (
              <div className="space-y-4">
                {/* Warning Message */}
                <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-error text-sm sm:text-base mb-1">
                      Warning: This action cannot be undone
                    </h4>
                    <p className="text-sm text-gray-600">
                      You are about to reject all approved leave days for <span className="font-semibold">{selectedRequest.employee_name}</span>.
                    </p>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="bg-base-200/40 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Employee:</span>
                    <span className="font-medium">{selectedRequest.employee_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Leave Type:</span>
                    <span className="font-medium">{selectedRequest.leave_type_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dates:</span>
                    <span className="font-medium">
                      {/* {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} */}
                       {formatDateDDMMMYYYY(selectedRequest.start_date)}
                       - 
                       {formatDateDDMMMYYYY(selectedRequest.end_date)}
                       {/* {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} */}

                      
                    </span>
                  </div>
                </div>

                {/* Confirmation Question */}
                <div className="text-center">
                  <p className="text-sm sm:text-base font-medium text-gray-700">
                    Are you sure you want to reject all approved leave days?
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-base-200 px-4 sm:px-6 py-3 border-t border-base-300 flex justify-end gap-2">
            <button
              className="btn btn-sm sm:btn-md btn-ghost"
              onClick={() => setIsRejectAllConfirmModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm sm:btn-md btn-error"
              onClick={confirmRejectAllApproved}
            >
              Yes, Reject All Leave
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsRejectAllConfirmModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  )
}

export default AdminLeaveRequest

