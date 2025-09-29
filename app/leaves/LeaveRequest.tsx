'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Link from 'next/link';
import { FaChevronDown } from "react-icons/fa";
import { FaRegCalendarTimes } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { calculateDuration, getBadgeClass, getDateAndTime } from '../utils/utils';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../hooks/useNotification';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../components/ThemeProvider';

interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  manager_id: number;
  superior: string;
  department_name: string;
  department_id: number;
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
  company_id: number;
  department_id: number;
}

const LeaveRequest = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { notification, showNotification } = useNotification();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectAllConfirmModalOpen, setIsRejectAllConfirmModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState<string>('');
  const [approveComment, setApproveComment] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [allLeaveRequests, setAllLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [approvedCurrentPage, setApprovedCurrentPage] = useState(1);
  const [rejectedCurrentPage, setRejectedCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // For form fields (unapplied filters)
  const [form, setForm] = useState({
    status: 'All',
    startDate: '',
    endDate: '',
    department: 'All'
  });

  // For applied filters (used for filtering)
  const [filters, setFilters] = useState({
    status: 'All',
    startDate: '',
    endDate: '',
    department: 'All'
  });

  // First load user data
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



  const fetchLeaveRequests = useCallback(async () => {//async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/leaves-by-employee-id`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        },
        params: {
          employeeId: user?.id
        }
      });
      setLeaveRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      showNotification('Failed to load leave requests. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, showNotification]); //}, [user?.id]);//};

  const fetchAllLeaveRequests =  useCallback(async () => {//async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/leaves/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setAllLeaveRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching all leave requests:', err);
      showNotification('Failed to load all leave requests. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]); //}, []);//};

  // Then fetch leave requests only after user data is loaded
  useEffect(() => {
    if (user) {
      fetchLeaveRequests();
      fetchAllLeaveRequests();
    }
  }, [user, fetchLeaveRequests, fetchAllLeaveRequests]); //}, [user]);

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

  const handleRejectRequest = async (request: LeaveRequest) => {
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
      setIsRejectModalOpen(true);
    } catch (err) {
      console.error('Error fetching leave documents:', err);
      // Still show the modal even if document fetch fails
      setSelectedRequest(request);
      setIsRejectModalOpen(true);
    }
  };

  const handleApproveRequest = async (request: LeaveRequest) => {
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
      setIsApproveModalOpen(true);
    } catch (err) {
      console.error('Error fetching leave documents:', err);
      // Still show the modal even if document fetch fails
      setSelectedRequest(request);
      setIsApproveModalOpen(true);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateRejectForm()) {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(form);
  };

  const getDays = (start: string, end: string) => {
    const daylist = [];
    for (const dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      daylist.push(new Date(dt));
    }
    daylist.map((v) => v.toISOString().slice(0, 10)).join("")
    return daylist;
  }

  const isDateBetween = (dateToCheck: Date, startDate: Date, endDate: Date) => {
    const dateToCheckMs = new Date(dateToCheck);
    const startDateMs = new Date(startDate);
    const endDateMs = new Date(endDate);

    // Check if the date is within the range (inclusive)
    return dateToCheckMs >= startDateMs && dateToCheckMs <= endDateMs;
  }

  const filteredData = leaveRequests.filter((item) => {
    // Status filter
    const statusMatch = filters.status === 'All' ||
      item.status.toLowerCase() === filters.status.toLowerCase();

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
        dateMatch = isDateBetween(
          new Date(days[i].toDateString()), 
          new Date(startDate.toDateString()), 
          new Date(endDate.toDateString()));
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

    return statusMatch && departmentMatch && dateMatch;
  });

  // Calculate total pages for main table
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current page items
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePendingPageChange = (page: number) => {
    setPendingCurrentPage(page);
  };

  const handleApprovedPageChange = (page: number) => {
    setApprovedCurrentPage(page);
  };

  const handleRejectedPageChange = (page: number) => {
    setRejectedCurrentPage(page);
  };

  const getPendingLeaves = () => {
    if (user?.role === 'employee') {
      return allLeaveRequests
        .filter((request: LeaveRequest) => request.employee_id.toString() === user?.id.toString())
        .filter((request: LeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED');
    } else if (user?.role === 'supervisor') {
      return allLeaveRequests
        .filter((request: LeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
        .filter((request: LeaveRequest) => request.status.toString() === 'PENDING');
  } else if (user?.role === 'manager') {
    return allLeaveRequests
      .filter((request: LeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
      .filter((request: LeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED');
  } else if (user?.role === 'admin') {
    return allLeaveRequests
      .filter((request: LeaveRequest) => request.status.toString() === 'PENDING' || request.status.toString() === 'FIRST_APPROVED');
    } else {
      return [];
    }
  };  

  const pendingFiltered = getPendingLeaves();
  const pendingTotalPages = Math.ceil(pendingFiltered.length / itemsPerPage);
  const currentPendingRequests = pendingFiltered.slice(
    (pendingCurrentPage - 1) * itemsPerPage,
    pendingCurrentPage * itemsPerPage
  );  

  const getApprovedLeaves = () => {
    if (user?.role === 'employee') {
      return allLeaveRequests
        .filter((request: LeaveRequest) => request.employee_id.toString() === user?.id.toString())
        .filter((request: LeaveRequest) => request.status.toString() === 'APPROVED');
    } else if (user?.role === 'supervisor') {
      return allLeaveRequests
        .filter((request: LeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
        .filter((request: LeaveRequest) => request.status.toString() === 'APPROVED');
  } else if (user?.role === 'manager') {
    return allLeaveRequests
      .filter((request: LeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
      .filter((request: LeaveRequest) => request.status.toString() === 'APPROVED');
  } else if (user?.role === 'admin') {
    return allLeaveRequests
      .filter((request: LeaveRequest) => request.status.toString() === 'APPROVED');
    } else {
      return [];
    }
  };  

  const approveFiltered = getApprovedLeaves();
  const approvedTotalPages = Math.ceil(approveFiltered.length / itemsPerPage);
  const currentApprovedRequests = approveFiltered.slice(
    (approvedCurrentPage - 1) * itemsPerPage,
    approvedCurrentPage * itemsPerPage
  );

  const getRejectedLeaves = () => {
    if (user?.role === 'employee') {
      return allLeaveRequests
        .filter((request: LeaveRequest) => request.employee_id.toString() === user?.id.toString())
        .filter((request: LeaveRequest) => request.status.toString() === 'REJECTED');
    } else if (user?.role === 'supervisor') {
      return allLeaveRequests
        .filter((request: LeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
        .filter((request: LeaveRequest) => request.status.toString() === 'REJECTED');
  } else if (user?.role === 'manager') {
    return allLeaveRequests
      .filter((request: LeaveRequest) => request.department_id?.toString() === user?.department_id.toString())
      .filter((request: LeaveRequest) => request.status.toString() === 'REJECTED');
  } else if (user?.role === 'admin') {
    return allLeaveRequests
      .filter((request: LeaveRequest) => request.status.toString() === 'REJECTED');
    } else {
      return [];
    }
  };  

  const rejectFiltered = getRejectedLeaves();
  const rejectedTotalPages = Math.ceil(rejectFiltered.length / itemsPerPage);
  const currentRejectedRequests = rejectFiltered.slice(
    (rejectedCurrentPage - 1) * itemsPerPage,
    rejectedCurrentPage * itemsPerPage
  );

  const departments = [...new Set(leaveRequests.filter(request => request.department_name !== null).map(request => request.department_name).sort())]

  const handleApprove = async (requestId: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/leaves/${requestId}/approve`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      if (response.status === 200) {
        showNotification('Leave request approved successfully', 'success');
        fetchLeaveRequests();
      }
    } catch (error) {
      console.error('Error approving leave request:', error);
      showNotification('Failed to approve leave request', 'error');
    }
  };

  const validateRejectForm = () => {
    let isValid = true;

    if (rejectReason.trim() === '') {
      setRejectError('Please provide a reason for rejection');
      isValid = false;
    }

    return isValid;
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
        approver_id: user?.id,
        reason: 'All approved leave days rejected by manager',
        approval_level: approvalLevel
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });

      // Refresh the leave requests list
      await fetchLeaveRequests();
      await fetchAllLeaveRequests();
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
    if (pageType === 'main' && pageNumber >= 1 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    } else if (pageType === 'pending' && pageNumber >= 1 && pageNumber <= Math.ceil(getPendingLeaves().length / itemsPerPage)) {
      setPendingCurrentPage(pageNumber);
    } else if (pageType === 'approved' && pageNumber >= 1 && pageNumber <= Math.ceil(getApprovedLeaves().length / itemsPerPage)) {
      setApprovedCurrentPage(pageNumber);
    } else if (pageType === 'rejected' && pageNumber >= 1 && pageNumber <= Math.ceil(getRejectedLeaves().length / itemsPerPage)) {
      setRejectedCurrentPage(pageNumber);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification Toast */}
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      
      <div className="mt-6 sm:mt-8 flow-root">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="form-control">
              <label htmlFor="status" className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-slate-300'}`}>
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleStatusChange}
                  className={`w-full appearance-none rounded-md py-2 sm:py-1.5 pr-8 pl-3 text-sm sm:text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-400'}`}
                >
                  <option value="All">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <FaChevronDown
                  aria-hidden="true"
                  className={`pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="startDate" className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-slate-300'}`}>
                <span className="hidden sm:inline">Date Range (Start)</span>
                <span className="sm:hidden">Start Date</span>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleDateChange}
                className={`block w-full rounded-md px-3 py-2 sm:py-1.5 text-sm sm:text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 placeholder:text-slate-400 focus:outline-blue-400'}`}
              />
            </div>

            <div className="form-control">
              <label htmlFor="endDate" className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-slate-300'}`}>
                <span className="hidden sm:inline">Date Range (End)</span>
                <span className="sm:hidden">End Date</span>
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleDateChange}
                className={`block w-full rounded-md px-3 py-2 sm:py-1.5 text-sm sm:text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${theme === 'light' ? 'bg-white text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600' : 'bg-slate-700 text-slate-100 outline-slate-600 placeholder:text-slate-400 focus:outline-blue-400'}`}
              />
            </div>

            <div className="form-control col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
              <button 
                type="submit" 
                className={`btn btn-sm sm:btn-md w-full ${theme === 'light' ? 'btn-primary' : 'btn-primary'} mt-0 lg:mt-6`}
              >
                <span className="hidden sm:inline">Apply Filters</span>
                <span className="sm:hidden">Apply</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8 flow-root">
        {/* Leave Request */}
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold flex items-center gap-2 mb-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Leave Request
            </h2>

            <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
              <table className="table w-full">
                <thead>
                  <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Type</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Duration</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((request, index) => (
                    <tr 
                      key={request.id}
                      className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentItems.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                    >
                      <td>
                        <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {request.leave_type_name}
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
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
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                      </td>
                      <td>
                        <span className={`badge ${getBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-end gap-2">
                          {user?.role === 'employee' && (
                            <>
                            </>
                          )}
                          {user?.role === 'supervisor' && request.status === 'PENDING' && request.employee_id?.toString() === user?.id?.toString() && (
                            <>
                            </>
                          )}
                          {user?.role === 'supervisor' && request.status === 'PENDING' && request.employee_id?.toString() !== user?.id?.toString() && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user?.role === 'supervisor' && request.status === 'FIRST_APPROVED' && request.employee_id?.toString() === user?.id?.toString() && (
                            <>
                            </>
                          )}
                          {user?.role === 'supervisor' && request.status === 'FIRST_APPROVED' && request.employee_id?.toString() !== user?.id?.toString() && (
                            <>
                            </>
                          )}
                          {user?.role === 'manager' && request.status === 'PENDING' && request.employee_id?.toString() === user?.id?.toString() && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user?.role === 'manager' && request.status === 'PENDING' && request.manager_id?.toString() === user?.id?.toString() && request.superior?.toString() === user?.id?.toString() && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user?.role === 'manager' && request.status === 'PENDING' && request.first_approver_id?.toString() === user?.id?.toString() && (
                            <>
                            </>
                          )}
                          {user?.role === 'manager' && request.status === 'FIRST_APPROVED' && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request)}
                                className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleViewRequest(request)}
                            className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results Counter */}
            <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} requests
            </div>

            {/* Employee Page Pagination */}
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

      <div className="mt-8 flow-root">
        {/* Pending Approval */}
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold flex items-center gap-2 mb-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Approval ({pendingFiltered.length})
            </h2>

            <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
              <table className="table w-full">
                <thead>
                  <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Type</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Duration</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPendingRequests.map((request, index) => {
                    // Calculate duration in days
                    const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <tr 
                        key={request.id}
                        className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentPendingRequests.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                      >
                        <td>
                          <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {request.leave_type_name}
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
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
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            {user?.role !== 'employee' && (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(request)}
                                  className={`btn btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request)}
                                  className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleViewRequest(request)}
                              className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
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

            {/* Results Counter */}
            <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Showing {((pendingCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(pendingCurrentPage * itemsPerPage, pendingFiltered.length)} of {pendingFiltered.length} requests
            </div>

            {/* Employee Page Pagination for Pending Approval */}
            {pendingTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handlePendingPageChange(1)}
                    disabled={pendingCurrentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handlePendingPageChange(pendingCurrentPage - 1)}
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
                      onClick={() => handlePendingPageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handlePendingPageChange(pendingCurrentPage + 1)}
                    disabled={pendingCurrentPage === pendingTotalPages}
                  >
                    »
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handlePendingPageChange(pendingTotalPages)}
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

      <div className="mt-8 flow-root">
        {/* Recently Approved  */}
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold flex items-center gap-2 mb-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recently Approved ({approveFiltered.length})
            </h2>

            <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
              <table className="table w-full">
                <thead>
                  <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Type</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Duration</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentApprovedRequests.map((request, index) => {
                    // Calculate duration in days
                    const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <tr 
                        key={request.id} 
                        className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentApprovedRequests.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                      >
                        <td>
                          <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {request.leave_type_name}
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
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
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewRequest(request)}
                              className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
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

            {/* Results Counter */}
            <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Showing {((approvedCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(approvedCurrentPage * itemsPerPage, approveFiltered.length)} of {approveFiltered.length} requests
            </div>

            {/* Employee Page Pagination for Approved */}
            {approvedTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleApprovedPageChange(1)}
                    disabled={approvedCurrentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleApprovedPageChange(approvedCurrentPage - 1)}
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
                      onClick={() => handleApprovedPageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleApprovedPageChange(approvedCurrentPage + 1)}
                    disabled={approvedCurrentPage === approvedTotalPages}
                  >
                    »
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleApprovedPageChange(approvedTotalPages)}
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

      <div className="mt-8 flow-root">
        {/* Rejected Requests */}
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold flex items-center gap-2 mb-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rejected Requests ({rejectFiltered.length})
            </h2>

            <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
              <table className="table w-full">
                <thead>
                  <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Type</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Duration</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRejectedRequests.map((request, index) => {
                    // Calculate duration in days
                    const duration = Math.ceil((new Date(request.end_date).getTime() - new Date(request.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <tr 
                        key={request.id}
                        className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentRejectedRequests.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                      >
                        <td>
                          <div className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{request.employee_name}</div>
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {request.leave_type_name}
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
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
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                        </td>
                        <td>
                          <span className={`badge ${getBadgeClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewRequest(request)}
                              className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
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

            {/* Results Counter */}
            <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Showing {((rejectedCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(rejectedCurrentPage * itemsPerPage, rejectFiltered.length)} of {rejectFiltered.length} requests
            </div>

            {/* Employee Page Pagination for Rejected */}
            {rejectedTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleRejectedPageChange(1)}
                    disabled={rejectedCurrentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleRejectedPageChange(rejectedCurrentPage - 1)}
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
                      onClick={() => handleRejectedPageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleRejectedPageChange(rejectedCurrentPage + 1)}
                    disabled={rejectedCurrentPage === rejectedTotalPages}
                  >
                    »
                  </button>
                  <button 
                    className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                    onClick={() => handleRejectedPageChange(rejectedTotalPages)}
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
        <div className="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-base-100 shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-base-200 px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 flex justify-between items-center z-10">
            <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">Leave Request Details</span>
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => setIsViewModalOpen(false)}
            >✕</button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            {selectedRequest && (
              <div className="space-y-4 sm:space-y-5">
                {/* Status Badge */}
                <div className="flex justify-end mb-2">
                  <span className={`badge ${selectedRequest.status === 'APPROVED' ? 'badge-success' :
                      selectedRequest.status === 'REJECTED' ? 'badge-error' :
                        selectedRequest.status === 'FIRST_APPROVED' ? 'badge-warning' : 'badge-info'
                    } text-white py-2 sm:py-3 px-3 sm:px-4 text-sm font-medium`}>
                    {selectedRequest.status}
                  </span>
                </div>

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
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Reason for Rejection</h4>
                        <p className="p-2 sm:p-3 bg-error/5 rounded-md text-sm sm:text-base border border-error/20">
                          {selectedRequest.rejection_reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-base-200 px-4 sm:px-6 py-2 sm:py-3 border-t border-base-300 flex justify-between mt-auto z-10">           
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
              className="btn btn-sm sm:btn-md btn-primary"
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
        <div className="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-base-100 shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-base-200 px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 flex justify-between items-center z-10">
            <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">Reject Leave Request</span>
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason('');
              }}
            >✕</button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            {selectedRequest && (
              <form onSubmit={handleRejectSubmit} className="space-y-4 sm:space-y-5">
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
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Leave Type</h4>
                    <p className="text-sm sm:text-base font-semibold">{selectedRequest.leave_type_name}</p>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Request Date</h4>
                    <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
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
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Date Range</h4>
                        <p className="text-sm sm:text-base font-semibold">
                          {getDateAndTime(selectedRequest.start_date)} - {getDateAndTime(selectedRequest.end_date)}
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

                {/* First Approval Information (if applicable) */}
                {selectedRequest.status === 'FIRST_APPROVED' && (
                  <div className="border border-base-300 rounded-lg">
                    <h4 className="text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg">
                      First Approval Information
                    </h4>
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
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
                    </div>
                  </div>
                )}

                {/* Rejection Reason Input */}
                <div className="border border-error/20 rounded-lg">
                  <h4 className="text-sm sm:text-base font-semibold bg-error/10 px-3 sm:px-4 py-2 rounded-t-lg text-error flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Reason for Rejection
                  </h4>
                  <div className="p-3 sm:p-4">
                    <div className="space-y-2">
                      <textarea
                        className={`textarea w-full rounded-md border-2 ${rejectError ? 'border-error focus:border-error' : 'border-base-300 focus:border-primary'}`}
                        placeholder="Please provide a detailed reason for rejection"
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      {rejectError && <p className="text-error text-xs sm:text-sm">{rejectError}</p>}
                    </div>
                  </div>
                </div>

                {/* Footer buttons moved to fixed footer */}
              </form>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-base-200 px-4 sm:px-6 py-2 sm:py-3 border-t border-base-300 flex justify-end mt-auto z-10">
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-sm sm:btn-md btn-ghost"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm sm:btn-md btn-error"
                onClick={(e) => {
                  if (selectedRequest) {
                    e.preventDefault();
                    handleRejectSubmit(e as React.FormEvent);
                  }
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {
            setIsRejectModalOpen(false);
            setRejectReason('');
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
              <form onSubmit={handleApproveSubmit} className="space-y-4 sm:space-y-5">
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
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Leave Type</h4>
                    <p className="text-sm sm:text-base font-semibold">{selectedRequest.leave_type_name}</p>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Request Date</h4>
                    <p className="text-sm sm:text-base font-semibold">{new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
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
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Date Range</h4>
                        <p className="text-sm sm:text-base font-semibold">
                          {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })} - {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
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

                {/* First Approval Information (if applicable) */}
                {selectedRequest.status === 'FIRST_APPROVED' && (
                  <div className="border border-base-300 rounded-lg">
                    <h4 className="text-sm sm:text-base font-semibold bg-base-200 px-3 sm:px-4 py-2 rounded-t-lg">
                      First Approval Information
                    </h4>
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
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
                    </div>
                  </div>
                )}

                {/* Approval Comment Input */}
                <div className="border border-success/20 rounded-lg">
                  <h4 className="text-sm sm:text-base font-semibold bg-success/10 px-3 sm:px-4 py-2 rounded-t-lg text-success flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Approval Comment (Optional)
                  </h4>
                  <div className="p-3 sm:p-4">
                    <div className="space-y-2">
                      <textarea
                        className="textarea w-full rounded-md border-2 border-base-300 focus:border-success text-sm sm:text-base"
                        placeholder="Add a comment (optional)"
                        rows={3}
                        value={approveComment}
                        onChange={(e) => setApproveComment(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer buttons moved to fixed footer */}
              </form>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-base-200 px-4 sm:px-6 py-2 sm:py-3 border-t border-base-300 flex justify-end mt-auto z-10">
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-sm sm:btn-md btn-ghost"
                onClick={() => {
                  setIsApproveModalOpen(false);
                  setApproveComment('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm sm:btn-md btn-success"
                onClick={(e) => {
                  if (selectedRequest) {
                    e.preventDefault();
                    handleApproveSubmit(e as React.FormEvent);
                  }
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {
            setIsApproveModalOpen(false);
            setApproveComment('');
          }}>close</button>
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

export default LeaveRequest