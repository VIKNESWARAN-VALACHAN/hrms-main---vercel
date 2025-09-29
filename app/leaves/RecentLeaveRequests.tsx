'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import toast, { Toaster } from 'react-hot-toast';

interface RecentLeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  department_name: string;
  leave_type_id: number;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approver_id?: number;
  approval_date?: string;
  approval_comment?: string;
  rejection_reason?: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface RecentLeaveRequestsProps {
  title: string;
  recentLeaveRequests: RecentLeaveRequest[];
  isLoading: boolean;
  error: string | null;
  onUpdate?: () => void;
}

const RecentLeaveRequests = ({ 
  title,
  recentLeaveRequests, 
  isLoading, 
  error,
  onUpdate 
}: RecentLeaveRequestsProps) => {
  const displayRow = 5;
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RecentLeaveRequest | null>(null);
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [displayCount, setDisplayCount] = useState(displayRow);

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

  const handleApproveRequest = (request: RecentLeaveRequest) => {
    setSelectedRequest(request);
    setIsApproveModalOpen(true);
  };

  const handleRejectRequest = (request: RecentLeaveRequest) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleViewRequest = (request: RecentLeaveRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/approve`, {
        approver_id: user?.id,
        comment: approveComment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      setIsApproveModalOpen(false);
      setApproveComment('');
      setSelectedRequest(null);
      toast.success('Leave request approved successfully');
      onUpdate?.();
    } catch (err) {
      console.error('Error approving leave request:', err);
      toast.error('Failed to approve leave request');
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(validateRejectForm()) {
      if (!selectedRequest) return;

      try {
        await axios.post(`${API_BASE_URL}/api/v1/leaves/${selectedRequest.id}/reject`, {
          approver_id: user?.id,
          reason: rejectReason
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        });
        
        setIsRejectModalOpen(false);
        setRejectReason('');
        setSelectedRequest(null);
        toast.success('Leave request rejected successfully');
        onUpdate?.();
      } catch (err) {
        console.error('Error rejecting leave request:', err);
        toast.error('Failed to reject leave request');
      }
    }
  };

  const validateRejectForm = () => {
    let isValid = true;

    if (rejectReason.trim() === '') {
      setRejectError('Please provide reject reason');
      isValid = false;
    }

    return isValid;
  };

  const handleViewMore = () => {
    setDisplayCount(prev => prev + displayRow);
  };

  const displayedRequests = recentLeaveRequests.slice(0, displayCount);
  const hasMore = recentLeaveRequests.length > displayCount;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      <Toaster position="top-right" />
      <div className="mt-8 flow-root">
        {/* Recent Leave Requests */}
        <div className="card bg-white shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 mb-6 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              { title }
            </h2>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-blue-50 text-gray-700">
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.map(request => (
                    <tr key={request.id} className="hover:bg-blue-50">
                      <td>
                        <div className="font-medium">{request.employee_name}</div>
                      </td>
                      <td>
                        {request.leave_type_name}
                      </td>
                      <td>
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
                      <td>
                        {request.duration === 0.5 ? '0.5 day' : `${request.duration} day${request.duration !== 1 ? 's' : ''}`}
                      </td>
                      <td>
                        <div className="whitespace-normal max-w-xs">{request.reason}</div>
                      </td>
                      <td>
                        <span className="badge badge-warning">
                          {request.status}
                        </span>
                      </td>
                      <td className="text-right">
                        {request.status === 'PENDING' && (
                          <button 
                            onClick={() => handleApproveRequest(request)}
                            className="btn btn-sm btn-primary mr-2"
                          >
                            Approve
                          </button>
                        )}
                        <button 
                          onClick={() => handleRejectRequest(request)}
                          className="btn btn-sm btn-error mr-2"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleViewRequest(request)}
                          className="btn btn-sm btn-info mr-2"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={handleViewMore}
                    className="btn btn-outline btn-primary"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Approve Modal */}
      <dialog id="approve_modal" className={`modal ${isApproveModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Approve Leave Request</h3>
          {selectedRequest && (
            <form onSubmit={handleApproveSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Employee Name</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.employee_name}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Department</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.department_name}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Apply on</span>
                  </label>
                  <p className="text-gray-700">
                    {new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Leave Type</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.leave_type_name}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Date Range</span>
                  </label>
                  <p className="text-gray-700">
                    {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })} - {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Duration</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Reason</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.reason}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Approval Comment (Optional)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Enter any additional comments"
                    value={approveComment}
                    onChange={(e) => setApproveComment(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-action">
                <button 
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsApproveModalOpen(false);
                    setApproveComment('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Approve Request
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {
            setIsApproveModalOpen(false);
            setApproveComment('');
          }}>close</button>
        </form>
      </dialog>

      {/* Reject Modal */}
      <dialog id="reject_modal" className={`modal ${isRejectModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Reject Leave Request</h3>
          {selectedRequest && (
            <form onSubmit={handleRejectSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Employee Name</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.employee_name}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Department</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.department_name}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Apply on</span>
                  </label>
                  <p className="text-gray-700">
                    {new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Leave Type</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.leave_type_name}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Date Range</span>
                  </label>
                  <p className="text-gray-700">
                    {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })} - {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Duration</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Reason for Rejection</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered w-full ${rejectError ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
                    placeholder="Enter reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  {rejectError && <p className="text-red-500 text-sm mt-1">{rejectError}</p>}
                </div>
              </div>
              <div className="modal-action">
                <button 
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-error"
                >
                  Reject Request
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {
            setIsRejectModalOpen(false);
            setRejectReason('');
          }}>close</button>
        </form>
      </dialog>

      {/* View Modal */}
      <dialog id="view_modal" className={`modal ${isViewModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Leave Request Details</h3>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Employee Name</span>
                </label>
                <p className="text-gray-700">{selectedRequest.employee_name}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Department</span>
                </label>
                <p className="text-gray-700">{selectedRequest.department_name}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Apply on</span>
                </label>
                <p className="text-gray-700">
                  {new Date(selectedRequest.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Leave Type</span>
                </label>
                <p className="text-gray-700">{selectedRequest.leave_type_name}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Date Range</span>
                </label>
                <p className="text-gray-700">
                  {new Date(selectedRequest.start_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })} - {new Date(selectedRequest.end_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Duration</span>
                </label>
                <p className="text-gray-700">{selectedRequest.duration === 0.5 ? '0.5 day' : `${selectedRequest.duration} day${selectedRequest.duration !== 1 ? 's' : ''}`}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Reason</span>
                </label>
                <p className="text-gray-700">{selectedRequest.reason}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <p className={`text-${selectedRequest.status === 'APPROVED' ? 'green' : selectedRequest.status === 'REJECTED' ? 'red' : 'yellow'}-600`}>
                  {selectedRequest.status}
                </p>
              </div>
              {selectedRequest.approval_comment && (
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Approval Comment</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.approval_comment}</p>
                </div>
              )}
              {selectedRequest.rejection_reason && (
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Rejection Reason</span>
                  </label>
                  <p className="text-gray-700">{selectedRequest.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
          <div className="modal-action">
            <button 
              className="btn btn-primary"
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
    </>
  )
}

export default RecentLeaveRequests