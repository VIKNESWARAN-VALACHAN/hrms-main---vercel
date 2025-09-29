//new  code

'use client';

import { useEffect, useState } from 'react';
import { DollarSign, BarChart, Info } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast'; 
import NewClaimModal from '../components/claims/NewClaimModal';

// Re-defining interfaces to match the comprehensive backend response for a single claim
interface Claim {
  id: number;
  benefit_type_name: string;
  amount: number;
  approved_amount: number | null;
  claim_date: string;
  status: string;
  employee_remark: string;
  admin_remark: string | null;
  company_name: string;
  current_approval_level: number;
  final_approval_level: number;
  created_at: string;
  // Added fields that come from the comprehensive claim details endpoint
  employee_id: number;
  employee_name?: string; // From backend's getClaimDetails
  department_name?: string; // From backend's getClaimDetails
}

interface BenefitSummary {
  id: number;
  employee_id: number;
  benefit_type: string;
  description: string;
  frequency: string;
  entitled: string;
  claimed: string;
  balance: string;
  effective_from: string;
  effective_to: string;
  status: 'Active' | 'Expired' | 'Upcoming' | 'Unknown';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// New interfaces for the detailed claim view
interface ApprovalHistoryItem {
  id: number;
  module: string;
  record_id: number;
  company_id: number;
  level: number;
  approver_id: number;
  approver_name: string; // Assuming approver_name is part of the history object now
  status: string;
  remark: string;
  approved_at: string;
}

interface CurrentApprovalItem {
  level: number;
  approver_id: number;
  status: string;
  remark: string | null;
  action_date: string | null; // This is the date field for CurrentApprovalItem
  approver_name: string; // Assuming approver_name is part of the current approval object
}

// Interface for the full response from /api/claims/:id
interface FullClaimDetailsResponse {
  claimDetails: Claim;
  approvalHistory: ApprovalHistoryItem[];
  currentApprovals: CurrentApprovalItem[];
}


export default function ClaimHistoryPage() {

  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [benefits, setBenefits] = useState<BenefitSummary[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    amount: '',
    employee_remark: '',
  });

  // State to hold comprehensive claim details for the view modal
  const [fetchedClaimDetails, setFetchedClaimDetails] = useState<FullClaimDetailsResponse | null>(null);


  
  // Fetch data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('hrms_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Fetch benefit entitlement summary
      fetch(`${API_BASE_URL}/api/employee-benefits/summary/${parsedUser.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          const formattedData = Array.isArray(data) ? data.map(item => ({
            ...item,
            entitled: item.entitled || "0.00",
            claimed: item.claimed || "0.00",
            balance: item.balance || "0.00"
          })) : [];
          setBenefits(formattedData);
        })
        .catch((err) => {
          console.error('Error loading benefit summary:', err);
          toast.error('Failed to load benefit summary.');
        });

      // Fetch claim history
      fetch(`${API_BASE_URL}/api/claims/${parsedUser.id}`) // Assuming this endpoint gets claims for an employee
        .then((res) => {
          if (!res.ok) {
            if (res.status === 404) { // Handle "Claim not found" more gracefully
                return []; // Return empty array if no claims
            }
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setClaims(data);
          } else if (typeof data === 'object' && data !== null) {
            setClaims([data]); // If a single object is returned (e.g., one claim)
          } else {
            console.warn('Unexpected claims data format:', data);
            setClaims([]);
          }
        })
        .catch((err) => {
          console.error('Error loading claims:', err);
          toast.error('Failed to load claims history.');
          setClaims([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      toast.error('User data not found. Please log in.');
    }
  }, []);

  // Open view modal - MODIFIED TO FETCH COMPREHENSIVE DATA
  const openViewModal = async (claim: Claim) => {
    setSelectedClaim(claim); // Set the basic claim data immediately for loading state
    setFetchedClaimDetails(null); // Clear previous details
    setIsViewModalOpen(true); // Open the modal

    try {
      // Fetch comprehensive claim details from the backend
      const res = await fetch(`${API_BASE_URL}/api/approval/claims/${claim.id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: FullClaimDetailsResponse = await res.json();
      setFetchedClaimDetails(data);
    } catch (err: any) {
      console.error('Error fetching comprehensive claim details:', err);
      toast.error(err.message || 'Failed to load claim details for view.');
      setIsViewModalOpen(false); // Close modal on error
    }
  };

  // Open edit modal and initialize form data
  const openEditModal = (claim: Claim) => {
    setSelectedClaim(claim);
    setEditFormData({
      amount: claim.amount.toString(),
      employee_remark: claim.employee_remark
    });
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (claim: Claim) => {
    setSelectedClaim(claim);
    setIsDeleteModalOpen(true);
  };

  // Handle form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit edited claim
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClaim) return;

    // Validate inputs
    if (!editFormData.amount || isNaN(parseFloat(editFormData.amount))) {
      toast.error('Please enter a valid amount'); // Use toast instead of alert
      return;
    }

    if (!editFormData.employee_remark) {
      toast.error('Please enter a remark'); // Use toast instead of alert
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/claims/${selectedClaim.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(editFormData.amount),
          employee_remark: editFormData.employee_remark,
          status: selectedClaim.status // Ensure status is sent if backend requires it
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update claim');
      }

      const data = await res.json();
      // Assuming data.claim contains the updated claim object
      setClaims(prev => prev.map(c => c.id === selectedClaim.id ? data.claim : c));
      setIsEditModalOpen(false);
      toast.success('Claim updated successfully!'); // Use toast

    } catch (err: any) { // Type err as any for now
      console.error('Error updating claim:', err);
      toast.error(`Error: ${err.message || 'An unknown error occurred'}`); // Use toast
    }
  };

  // Delete claim
  const handleDelete = async () => {
    if (!selectedClaim) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/claims/${selectedClaim.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setClaims(prev => prev.filter(c => c.id !== selectedClaim.id));
        setIsDeleteModalOpen(false);
        toast.success('Claim deleted successfully.'); // Use toast
      } else {
        toast.error('Failed to delete claim.'); // Use toast
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('An error occurred while deleting.'); // Use toast
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-success badge-xs"></span>;
      case 'Expired':
        return <span className="badge badge-error badge-xs"></span>;
      case 'Upcoming':
        return <span className="badge badge-warning badge-xs"></span>;
      default:
        return <span className="badge badge-neutral badge-xs"></span>;
    }
  };

  // Filter approval history for 'Approved' or 'Rejected' statuses
  const getFilteredApprovalHistory = (history: ApprovalHistoryItem[]) => {
    return history.filter(item => item.status === 'Approved' || item.status === 'Rejected');
  };

  // Process current approvals to get the latest status for each level
  const getProcessedCurrentApprovals = (current: CurrentApprovalItem[]) => {
    const latestApprovalsMap = new Map<number, CurrentApprovalItem>();

    current.forEach(item => {
      // If an item for this level already exists in the map
      if (latestApprovalsMap.has(item.level)) {
        const existingItem = latestApprovalsMap.get(item.level)!;
        // Keep the one with the latest action_date, or if action_date is null for both, prefer Pending
        const existingDate = existingItem.action_date ? new Date(existingItem.action_date).getTime() : 0;
        const newItemDate = item.action_date ? new Date(item.action_date).getTime() : 0;

        if (newItemDate > existingDate) {
          latestApprovalsMap.set(item.level, item);
        } else if (newItemDate === existingDate && item.status === 'Pending' && existingItem.status !== 'Pending') {
          // If dates are same, and new item is pending while existing is not, prefer pending
          latestApprovalsMap.set(item.level, item);
        }
      } else {
        latestApprovalsMap.set(item.level, item);
      }
    });

    // Convert map values back to an array and sort by level
    return Array.from(latestApprovalsMap.values()).sort((a, b) => a.level - b.level);
  };

  // Check if all current approvals are 'Approved' or 'Rejected'
  const areAllCurrentApprovalsFinal = (current: CurrentApprovalItem[]) => {
    if (current.length === 0) return true; // If no current approvals, consider it final (nothing pending)
    return current.every(item => item.status === 'Approved' || item.status === 'Rejected');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-base-100 min-h-screen">
      
      {/* View Claim Modal */}
      {isViewModalOpen && selectedClaim && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl p-0"> {/* Remove padding and control it internally */}
            <div className="bg-base-200 px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-xl font-bold">Claim Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="btn btn-sm btn-circle bg-transparent border-none text-gray-500 hover:bg-gray-200">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!fetchedClaimDetails ? (
                <div className="text-center py-10">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-2">Loading claim details...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Benefit Type</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-base-100"
                        value={fetchedClaimDetails.claimDetails.benefit_type_name}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Amount</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-base-100"
                        value={`RM ${parseFloat(fetchedClaimDetails.claimDetails.amount.toString()).toFixed(2)}`}
                        disabled
                      />
                    </div>
                    {fetchedClaimDetails.claimDetails.approved_amount !== null && (
                      <div>
                        <label className="label">
                          <span className="label-text">Approved Amount</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full bg-base-100"
                          value={`RM ${parseFloat(fetchedClaimDetails.claimDetails.approved_amount.toString()).toFixed(2)}`}
                          disabled
                        />
                      </div>
                    )}
                    <div>
                      <label className="label">
                        <span className="label-text">Company</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-base-100"
                        value={fetchedClaimDetails.claimDetails.company_name}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Claim Date</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-base-100"
                        value={new Date(fetchedClaimDetails.claimDetails.claim_date).toLocaleDateString()}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Status</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-base-100"
                        value={fetchedClaimDetails.claimDetails.status}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Created At</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-base-100"
                        value={new Date(fetchedClaimDetails.claimDetails.created_at).toLocaleString()}
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Employee Remark</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full bg-base-100"
                      rows={3}
                      value={fetchedClaimDetails.claimDetails.employee_remark}
                      disabled
                    />
                  </div>

                  {fetchedClaimDetails.claimDetails.admin_remark && (
                    <div>
                      <label className="label">
                        <span className="label-text">Admin Remark</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full bg-base-100"
                        rows={3}
                        value={fetchedClaimDetails.claimDetails.admin_remark}
                        disabled
                      />
                    </div>
                  )}

                  {/* Section for Approval History (Approved/Rejected only) */}
                  <h4 className="text-lg font-bold mt-6 mb-3 border-t pt-4">Approval History</h4>
                  {getFilteredApprovalHistory(fetchedClaimDetails.approvalHistory).length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table w-full text-sm">
                        <thead>
                          <tr className="bg-base-200">
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Approver</th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Remark</th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredApprovalHistory(fetchedClaimDetails.approvalHistory)
                            .sort((a, b) => new Date(a.approved_at).getTime() - new Date(b.approved_at).getTime()) // Sort by date
                            .map((historyItem, index) => (
                            <tr key={historyItem.id}>
                              <td className="py-2">{historyItem.level}</td>
                              <td className="py-2">{historyItem.approver_name}</td>
                              <td className="py-2">
                                <span className={`badge ${
                                  historyItem.status === 'Approved' ? 'badge-success' :
                                  historyItem.status === 'Rejected' ? 'badge-error' : ''
                                }`}>
                                  {historyItem.status}
                                </span>
                              </td>
                              <td className="py-2">{historyItem.remark || '-'}</td>
                              <td className="py-2">{historyItem.approved_at ? new Date(historyItem.approved_at).toLocaleString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No approved or rejected history found.</p>
                  )}

                  {/* Section for Current Approval Status (only if not all are final) */}
                  {!areAllCurrentApprovalsFinal(getProcessedCurrentApprovals(fetchedClaimDetails.currentApprovals)) && (
                    <>
                      <h4 className="text-lg font-bold mt-6 mb-3 border-t pt-4">Current Approval Status</h4>
                      {getProcessedCurrentApprovals(fetchedClaimDetails.currentApprovals).length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="table w-full text-sm">
                            <thead>
                              <tr className="bg-base-200">
                                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Approver</th>
                                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Remark</th>
                                <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Action Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getProcessedCurrentApprovals(fetchedClaimDetails.currentApprovals)
                                .map((currentItem, index) => (
                                <tr key={currentItem.approver_id || index}>
                                  <td className="py-2">{currentItem.level}</td>
                                  <td className="py-2">{currentItem.approver_name}</td>
                                  <td className="py-2">
                                    <span className={`badge ${
                                      currentItem.status === 'Approved' ? 'badge-success' :
                                      currentItem.status === 'Rejected' ? 'badge-error' :
                                      'badge-warning' // Pending status
                                    }`}>
                                      {currentItem.status}
                                    </span>
                                  </td>
                                  <td className="py-2">{currentItem.remark || '-'}</td>
                                  <td className="py-2">{currentItem.action_date ? new Date(currentItem.action_date).toLocaleString() : '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No current approval status data available.</p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div className="modal-action bg-base-200 px-6 py-4 rounded-b-lg mt-0 justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="btn">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Claim Modal */}{/* Edit Claim Modal */}
{isEditModalOpen && selectedClaim && (
  <div className="modal modal-open">
    <div className="modal-box max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Edit Claim</h3>
        <button 
          onClick={() => setIsEditModalOpen(false)} 
          className="btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleEditSubmit}>
        <div className="space-y-6">
          {/* Basic Claim Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Benefit Type</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-base-200"
                value={selectedClaim.benefit_type_name}
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Company</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-base-200"
                value={selectedClaim.company_name}
                readOnly
              />
            </div>
          </div>

          {/* Entitlement Information */}
          {(() => {
            const relevantBenefit = benefits.find(
              b => b.benefit_type === selectedClaim.benefit_type_name
            );

            if (!relevantBenefit) {
              return (
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Benefit information not available</span>
                </div>
              );
            }

            // Helper function to safely parse numbers
            const parseSafe = (value: any): number => {
              const num = typeof value === 'string' ? parseFloat(value) : Number(value);
              return isNaN(num) ? 0 : num;
            };
            
            // Calculate values
            const entitled = parseSafe(relevantBenefit.entitled);
            const balance = parseSafe(relevantBenefit.balance);
            const currentAmount = parseSafe(editFormData.amount);
            const originalAmount = parseSafe(selectedClaim.amount);
            const maxAllowed = Math.min(entitled, balance + originalAmount);
            const isAmountValid = currentAmount > 0 && currentAmount <= maxAllowed;

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title text-sm">Total Entitled</div>
                    <div className="stat-value text-primary text-lg">
                      RM {entitled.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title text-sm">Remaining Balance</div>
                    <div className="stat-value text-lg">
                      RM {balance.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title text-sm">Max Allowed</div>
                    <div className="stat-value text-lg">
                      RM {maxAllowed.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Claim Amount (RM)</span>
                    {!isAmountValid && editFormData.amount && (
                      <span className="label-text-alt text-error">
                        {currentAmount <= 0 ? 'Must be greater than 0' : 'Exceeds maximum allowed'}
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="amount"
                    className={`input input-bordered w-full ${
                      !isAmountValid && editFormData.amount ? 'input-error' : ''
                    }`}
                    value={editFormData.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                        setEditFormData({...editFormData, amount: value});
                      }
                    }}
                    min="0.01"
                    max={maxAllowed}
                    step="0.01"
                    required
                  />
                  <div className="text-sm mt-2">
                    <span className="font-medium">Original amount:</span> RM {originalAmount.toFixed(2)}
                    {currentAmount !== originalAmount && (
                      <span className={`ml-2 ${
                        currentAmount > originalAmount ? 'text-error' : 'text-success'
                      }`}>
                        ({currentAmount > originalAmount ? '+' : ''}
                        {(currentAmount - originalAmount).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>
              </>
            );
          })()}

          {/* Employee Remark */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Employee Remark</span>
              {editFormData.employee_remark && editFormData.employee_remark.trim().length < 10 && (
                <span className="label-text-alt text-error">
                  Minimum 10 characters required
                </span>
              )}
            </label>
            <textarea
              name="employee_remark"
              className="textarea textarea-bordered"
              rows={3}
              value={editFormData.employee_remark}
              onChange={(e) => setEditFormData({
                ...editFormData,
                employee_remark: e.target.value
              })}
              required
              minLength={10}
            />
          </div>
        </div>

        <div className="modal-action mt-8">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !editFormData.amount ||
              editFormData.amount.trim() === '' ||
              isNaN(Number(editFormData.amount)) ||
              Number(editFormData.amount) <= 0 ||
              !editFormData.employee_remark ||
              editFormData.employee_remark.trim().length < 10 ||
              (() => {
                const relevantBenefit = benefits.find(
                  b => b.benefit_type === selectedClaim.benefit_type_name
                );
                if (!relevantBenefit) return true;
                
                const entitled = Number(relevantBenefit.entitled) || 0;
                const balance = Number(relevantBenefit.balance) || 0;
                const originalAmount = Number(selectedClaim.amount) || 0;
                const maxAllowed = Math.min(entitled, balance + originalAmount);
                const currentAmount = Number(editFormData.amount) || 0;

                return currentAmount > maxAllowed;
              })()
            }
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedClaim && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-sm btn-circle">
                ✕
              </button>
            </div>

            <p className="py-4">Are you sure you want to delete this claim for <strong>{selectedClaim.benefit_type_name}</strong> (RM {parseFloat(selectedClaim.amount.toString()).toFixed(2)})?</p>
            <p className="text-sm text-warning mb-4">This action cannot be undone.</p>

            <div className="modal-action">
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Claim Dashboard</h1>
        {/* <Link href="/claims/new" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Claim
        </Link> */}
    <button 
        onClick={() => setIsNewClaimModalOpen(true)}
        className="btn btn-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        New Claim
      </button>

      {/* Add the modal at the bottom of your return statement */}
      <NewClaimModal
        isOpen={isNewClaimModalOpen}
        onClose={() => setIsNewClaimModalOpen(false)}
        benefits={benefits}
      />
      </div>

{/* Benefit Summary Cards */}
<div className="mb-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">My Benefit Entitlements</h2>
  </div>

  {loading ? (
    <div className="flex justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ) : benefits.length === 0 ? (
    <div className="alert alert-info shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>No benefit entitlements found.</span>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* {benefits.map((summary, index) => (
        <EmployeeSummaryCard key={index} summary={summary} />
      ))} */}
      {benefits.map((summary, index) => {
  const entitled = parseFloat(summary.entitled);
  const claimed = parseFloat(summary.claimed);
  const balance = parseFloat(summary.balance);
  const utilization = entitled > 0 ? (claimed / entitled) * 100 : 0;

  return (
    <div
      key={index}
      className="relative bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group"
    >
      {/* ℹ️ Tooltip icon with pure CSS (no useState) */}
      {summary.description && (
        <div className="absolute top-4 right-4 z-10">
          <Info className="w-6 h-6 cursor-pointer transition-transform duration-200 text-gray-400 group-hover:text-blue-600 group-hover:scale-110" />
          <div className="absolute top-8 right-0 w-64 text-sm bg-white border border-gray-300 shadow-lg rounded-md p-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-gray-700 italic">{summary.description}</p>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-8">{summary.benefit_type}</h3>

      <div className="space-y-3 text-sm text-gray-700 mb-4">
        <div className="flex justify-between">
          <span className="flex items-center">
            <DollarSign size={16} className="mr-2 text-green-500" />
            Entitled
          </span>
          <span className="font-semibold text-green-600">{`RM ${entitled.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center">
            <BarChart size={16} className="mr-2 text-orange-500" />
            Claimed
          </span>
          <span className="font-semibold text-orange-600">{`RM ${claimed.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center">
            <DollarSign size={16} className="mr-2 text-blue-500" />
            Balance
          </span>
          <span className="font-semibold text-blue-600">{`RM ${balance.toFixed(2)}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
        <div>
          <span className="text-gray-500 block">Frequency</span>
          <span className="font-medium text-gray-800">{summary.frequency || '-'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Status</span>
          <span className={`font-semibold ${
            summary.status === 'Active' ? 'text-green-600' :
            summary.status === 'Expired' ? 'text-red-500' :
            summary.status === 'Upcoming' ? 'text-yellow-500' :
            'text-gray-500'
          }`}>
            {summary.status || '-'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Effective From</span>
          <span className="text-gray-800">
            {summary.effective_from ? new Date(summary.effective_from).toLocaleDateString() : '-'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Effective To</span>
          <span className="text-gray-800">
            {summary.effective_to ? new Date(summary.effective_to).toLocaleDateString() : '-'}
          </span>
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-gray-500">Utilization</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${utilization}%` }}
          ></div>
        </div>
        <p className="text-right text-xs font-semibold text-blue-700 mt-1">
          {utilization.toFixed(2)}%
        </p>
      </div>
    </div>
  );
})}

    </div>
  )}
</div>


      {/* Claim History Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Claim History</h2>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : claims.length === 0 ? (
          <div className="alert alert-info shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No claims submitted yet.</span>
          </div>
        ) : (
          <div className="bg-base-100 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200">
                  <tr>
                    <th>Benefit</th>
                    <th>Amount</th>
                    <th>Company</th>
                    <th>Remarks</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-base-200">
                      <td>{claim.benefit_type_name}</td>
                      <td>RM {parseFloat(claim.amount.toString()).toFixed(2)}</td>
                      <td>{claim.company_name}</td>
                      <td>
                        <div className="max-w-xs">
                          <div className="text-sm"><span className="font-medium">Employee:</span> {claim.employee_remark}</div>
                          {claim.admin_remark && (
                            <div className="text-sm mt-1"><span className="font-medium">Admin:</span> {claim.admin_remark}</div>
                          )}
                        </div>
                      </td>
                      <td>{new Date(claim.claim_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          claim.status === 'Approved' ? 'badge-success' :
                          claim.status === 'Rejected' ? 'badge-error' :
                          'badge-warning'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openViewModal(claim)}
                            className="btn btn-sm btn-ghost"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {/* Conditional rendering for Edit and Delete buttons */}
                          {claim.status !== 'Approved' && claim.status !== 'Rejected' && (
                            <>
                              <button
                                onClick={() => openEditModal(claim)}
                                className="btn btn-sm btn-ghost"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openDeleteModal(claim)}
                                className="btn btn-sm btn-ghost text-error"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
