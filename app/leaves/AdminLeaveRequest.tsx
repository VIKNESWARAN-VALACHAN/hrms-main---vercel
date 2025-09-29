'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Link from 'next/link';
import { FaChevronDown } from "react-icons/fa";
import { FaRegCalendarTimes } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { calculateDateInUTC, calculateDuration, getBadgeClass, getDateAndTime } from '../utils/utils';
import EmployeeDocumentManager from '../components/EmployeeDocumentManager';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../hooks/useNotification';
import { useTheme } from '../components/ThemeProvider';

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
    employee_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [editingRequestAttachment, setEditingRequestAttachment] = useState<{ url: string, name: string } | null>(null);
  const [selectedLeaveDocuments, setSelectedLeaveDocuments] = useState<any[]>([]);
  const [editingRequestDocuments, setEditingRequestDocuments] = useState<any[]>([]);
  const [documentManagerKey, setDocumentManagerKey] = useState(0);
  const [leaveTypesByEmployeeId, setLeaveTypesByEmployeeId] = useState<LeaveType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Array<{id: number; name: string; email: string; employee_no: string}>>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Array<{id: number; name: string; email: string; employee_no: string}>>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);

  // For form fields (unapplied filters)
  const [form, setForm] = useState({ 
    status: 'All', 
    startDate: '', 
    endDate: '', 
    company: 'All',
    department: 'All' 
  });

  // For applied filters (used for filtering)
  const [filters, setFilters] = useState({ 
    status: 'All', 
    startDate: '', 
    endDate: '', 
    company: 'All',
    department: 'All' 
  });

  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);

  // Function to handle quick date selection
  const handleQuickDateSelect = (option: string) => {
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
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Update form state with new date filters
    const updatedForm = {
      ...form,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };
    
    setForm(updatedForm);
    
    // Set the active quick date filter
    setActiveQuickDate(option);

    // Reset pagination states
    setCurrentPage(1);
    setPendingCurrentPage(1);
    setApprovedCurrentPage(1);
    setRejectedCurrentPage(1);

    // Apply the filters immediately
    setFilters(updatedForm);
  };

  // Fetch leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests();
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

  const handleViewRequest = async (request: LeaveRequest) => {
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, company: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(form);
  };

  const resetLeaveFilters = () => {
    // Reset form state
    setForm({
      status: 'All',
      startDate: '',
      endDate: '',
      company: 'All',
      department: 'All'
    });

    // Reset filters state
    setFilters({
      status: 'All',
      startDate: '',
      endDate: '',
      company: 'All',
      department: 'All'
    });

    // Reset active quick date
    setActiveQuickDate(null);
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

  const filteredData = leaveRequests.filter((item) => {
    // Status filter
    const statusMatch = filters.status === 'All' || 
      item.status.toLowerCase() === filters.status.toLowerCase();

    // Company filter
    const companyMatch = filters.company === 'All' || 
      (item.company_name !== undefined && item.company_name !== null && item.company_name.toLowerCase() === filters.company.toLowerCase());

    // Department filter
    const departmentMatch = filters.department === 'All' || 
      (item.department_name !== undefined && item.department_name !== null && item.department_name.toLowerCase() === filters.department.toLowerCase());

    // Date range filter
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
    let dateMatch = true;    
    const days = getDays(item.start_date, item.end_date);
    if (startDate && endDate) {
      for (let i = 0; i < days.length; i++) {
        dateMatch = isDateBetween(days[i], new Date(startDate), new Date(endDate));
        if (dateMatch) break;
      }
    } else if (startDate) {
      for (let i = 0; i < days.length; i++) {
        dateMatch = new Date(item.start_date) >= startDate;
      }
    } else if (endDate) {
      for (let i = 0; i < days.length; i++) {
        dateMatch = new Date(item.end_date) <= endDate;
      }
    }

    return statusMatch && companyMatch && departmentMatch && dateMatch;
  });  

  // Calculate paginated data for main table
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      employee_id: '',
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

  const handleLeaveRequestDateChange = (value: string, isStartDate: boolean) => {
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

  const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, type: e.target.value });
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

      <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
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
        <form onSubmit={handleSearch}>
          <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            <div className="sm:col-span-1">
              <div className="sm:col-span-3">
                <label htmlFor="status" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  Status
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleStatusChange}
                    className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-sm outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
                  >
                    <option value="All">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <FaChevronDown
                    aria-hidden="true"
                    className={`pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="startDate" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                <span className="hidden sm:inline">Date Range (Start)</span>
                <span className="sm:hidden">Start Date</span>
              </label>
              <div className="mt-2">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleDateChange}
                  className={`block w-full rounded-md px-3 py-1.5 text-sm outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="endDate" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                <span className="hidden sm:inline">Date Range (End)</span>
                <span className="sm:hidden">End Date</span>
              </label>
              <div className="mt-2">
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleDateChange}
                  className={`block w-full rounded-md px-3 py-1.5 text-sm outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <div className="sm:col-span-3">
                <label htmlFor="company" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  Company
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleCompanyChange}
                    className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-sm outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
                  >
                    <option value="All">All</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  <FaChevronDown
                    aria-hidden="true"
                    className={`pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <div className="sm:col-span-3">
                <label htmlFor="department" className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                  Department
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleDepartmentChange}
                    className={`col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-sm outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-500'}`}
                  >
                    <option value="All">All</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <FaChevronDown
                    aria-hidden="true"
                    className={`pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 xl:col-span-1">
              <div className="card-actions justify-end align-bottom">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button type="submit" className={`mt-0 sm:mt-7 btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'btn-primary' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}`}>
                    <span className="hidden sm:inline">Apply Filter</span>
                    <span className="sm:hidden">Apply</span>
                  </button>
                  <button
                    type="button"
                    className={`mt-0 sm:mt-7 btn btn-sm sm:btn-md btn-outline w-full sm:w-auto ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                    onClick={resetLeaveFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div className={`mt-6 sm:mt-8 flow-root ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        {/* Leave Request */}
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
              onClick={() => setIsViewModalOpen(false)}
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
                    <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                </div>

                {/* Leave Details */}
                <div className={`border rounded-lg ${theme === 'light' ? 'border-base-300' : 'border-slate-600'}`}>
                  <h4 className={`text-sm sm:text-base font-semibold px-3 sm:px-4 py-2 rounded-t-lg ${theme === 'light' ? 'bg-base-200 text-gray-900' : 'bg-slate-700 text-slate-100'}`}>Leave Details</h4>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}</p>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
                        <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}</p>
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

                    {selectedRequest.document_url && (
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
                              downloadAttachment(selectedRequest.id, selectedRequest.file_name || 'attachment');
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
                              {selectedRequest.first_approval_date ? getDateAndTime(selectedRequest.first_approval_date) : 'N/A'}
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
                                {selectedRequest.second_approval_date ? getDateAndTime(selectedRequest.second_approval_date) : 'N/A'}
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
                          {getDateAndTime(selectedRequest.updated_at)}
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
                  <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>

              {/* Leave Details */}
              <div className={`border rounded-lg ${theme === 'light' ? 'border-base-300' : 'border-slate-600'}`}>
                <h4 className={`text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg ${theme === 'light' ? 'bg-base-200 text-gray-900' : 'bg-slate-700 text-slate-100'}`}>Leave Details</h4>
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Start Date</h4>
                      <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>End Date</h4>
                      <p className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
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
                  <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="border border-base-300 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg">Leave Details</h4>
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Start Date</h4>
                      <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">End Date</h4>
                      <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
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
                {formData.type !== 'unpaid leave' && (
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
                )}
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
                      employee_id: ''
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
                      {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} - {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
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