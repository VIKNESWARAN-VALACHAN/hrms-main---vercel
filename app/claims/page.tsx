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

interface ClaimAttachment {
  id: number;
  file_name: string;
  file_url: string;
  mime_type: string;
  uploaded_at: string;
  s3_key: string;
  uploaded_by_name: string;
  file_size?: number;
}

interface PendingApproval {
  id: number;
  claim_id: number;
  benefit_type_name: string;
  employee_name: string;
  company_name: string;
  amount: number;
  claim_date: string;
  approval_level: number;
  employee_remark: string;
  status: string;
}

interface ApprovalHistory {
  id: number;
  claim_id: number;
  benefit_type_name: string;
  employee_name: string;
  company_name: string;
  amount: number;
  approval_level: number;
  approval_status: string;
  approval_remark: string;
  action_date: string;
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

interface ApproverStatus {
  isApprover: boolean;
  pendingCount: number;
  historyCount: number;
}

export default function ClaimHistoryPage() {
  // Add these new states
  const [approverStatus, setApproverStatus] = useState<ApproverStatus | null>(null);
  const [checkingApproverStatus, setCheckingApproverStatus] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
// Update the shouldShowApprovalTables condition
const shouldShowApprovalTables = approverStatus?.isApprover;
const [claimAttachments, setClaimAttachments] = useState<ClaimAttachment[]>([]);
const [loadingAttachments, setLoadingAttachments] = useState(false);
const [downloadingAttachment, setDownloadingAttachment] = useState<number | null>(null);
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

  // Add these to your existing state declarations
const [showActionModal, setShowActionModal] = useState(false);
const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
const [actionRemark, setActionRemark] = useState('');
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

// Add this function to handle file downloads
const downloadAttachment = async (attachment: ClaimAttachment) => {
  try {
    setDownloadingAttachment(attachment.id);
    console.log(`📥 Downloading attachment: ${attachment.file_name}`);
    
    // Open download URL in new tab
    const downloadUrl = `${API_BASE_URL}/api/claims/attachments/${attachment.id}/download`;
    window.open(downloadUrl, '_blank');
    
    toast.success(`Downloading ${attachment.file_name}`);
    
  } catch (error: any) {
    console.error('❌ Download error:', error);
    toast.error(`Failed to download: ${attachment.file_name}`);
  } finally {
    setDownloadingAttachment(null);
  }
};
  
const canUserApproveClaim = async (claimId: number, level: number): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/approval/check-approval-authorization?claim_id=${claimId}&user_id=${user.id}`
    );
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.canApprove;
  } catch (error) {
    console.error('Error checking approval authorization:', error);
    return false;
  }
};

const PendingApprovalRow = ({ approval }: { approval: PendingApproval }) => {
  const [canApprove, setCanApprove] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [authReason, setAuthReason] = useState('');

  useEffect(() => {
    const checkAuthorization = async () => {
      if (user) {
        setCheckingAuth(true);
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/approval/check-approval-authorization?claim_id=${approval.claim_id}&user_id=${user.id}`
          );
          
          if (response.ok) {
            const data = await response.json();
            setCanApprove(data.canApprove);
            setAuthReason(data.reason || '');
          }
        } catch (error) {
          console.error('Authorization check failed:', error);
          setCanApprove(false);
          setAuthReason('Check failed');
        } finally {
          setCheckingAuth(false);
        }
      }
    };

    checkAuthorization();
  }, [approval, user]);

  return (
    <tr key={approval.id} className="hover:bg-base-200">
      <td>{approval.employee_name}</td>
      <td>{approval.benefit_type_name}</td>
      <td>RM {parseFloat(approval.amount.toString()).toFixed(2)}</td>
      <td>{approval.company_name}</td>
      <td>
        <span className="badge badge-info">Level {approval.approval_level}</span>
      </td>
      <td>
        <div className="max-w-xs">
          <div className="text-sm">{approval.employee_remark}</div>
        </div>
      </td>
      <td>{new Date(approval.claim_date).toLocaleDateString()}</td>
      <td>
        <div className="flex gap-2 items-center">
          {checkingAuth ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              <span className="text-xs text-gray-500">Checking...</span>
            </>
          ) : (
            <>
              <button
                onClick={() => handleViewPendingClaim(approval.claim_id)}
                className="btn btn-ghost btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              {canApprove ? (
                <>
                  <button
                    onClick={() => openActionModal(approval.claim_id, approval.approval_level, 'approve')}
                    className="btn btn-success btn-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openActionModal(approval.claim_id, approval.approval_level, 'reject')}
                    className="btn btn-error btn-sm"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span className="text-xs text-gray-500">
                  {authReason || 'Not authorized'}
                </span>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

   useEffect(() => {
    if (user) {
      checkApproverStatus();
      fetchApprovalData();
    }
  }, [user]);
// Update the checkApproverStatus function
const checkApproverStatus = async () => {
  if (!user) return;
  setCheckingApproverStatus(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/approval/check-approver-status?user_id=${user.id}`);
    
    if (res.ok) {
      const status = await res.json();
      console.log('Approver Status:', status);
      setApproverStatus(status);
    } else {
      console.warn('User is not an approver');
      setApproverStatus({ isApprover: false, pendingCount: 0, historyCount: 0 });
    }
  } catch (err) {
    console.error('Error checking approver status:', err);
    setApproverStatus({ isApprover: false, pendingCount: 0, historyCount: 0 });
  } finally {
    setCheckingApproverStatus(false);
  }
};


// Update the fetchApprovalData function
const fetchApprovalData = async () => {
  if (!user) return;
  
  setApprovalsLoading(true);
  try {
    // Fetch pending approvals
    const pendingRes = await fetch(`${API_BASE_URL}/api/approval/pending-approvals?user_id=${user.id}`);
    if (pendingRes.ok) {
      const pendingData = await pendingRes.json();
      console.log('Pending Approvals:', pendingData);
      setPendingApprovals(pendingData);
    } else {
      console.warn('No pending approvals found');
      setPendingApprovals([]);
    }

    // Fetch approval history
    const historyRes = await fetch(`${API_BASE_URL}/api/approval/my-approval-history?user_id=${user.id}`);
    if (historyRes.ok) {
      const historyData = await historyRes.json();
      console.log('Approval History:', historyData);
      setApprovalHistory(historyData);
    } else {
      console.warn('No approval history found');
      setApprovalHistory([]);
    }
  } catch (err) {
    console.error('Error fetching approval data:', err);
    toast.error('Failed to load approval data');
    setPendingApprovals([]);
    setApprovalHistory([]);
  } finally {
    setApprovalsLoading(false);
  }
};

// Replace the existing view button handler in the pending approvals table
const handleViewPendingClaim = async (claimId: number) => {
  try {
    // Fetch claim details directly from API
    const res = await fetch(`${API_BASE_URL}/api/approval/claims/${claimId}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
   if (data.claimDetails) {
      // Set the claim details
      setSelectedClaim(data.claimDetails);
      setFetchedClaimDetails(data);
      
      // 🆕 Fetch attachments for this claim
      setLoadingAttachments(true);
      const attachmentsRes = await fetch(`${API_BASE_URL}/api/claims/${claimId}/attachments`);
      if (attachmentsRes.ok) {
        const attachments = await attachmentsRes.json();
        setClaimAttachments(attachments);
        console.log(`✅ Loaded ${attachments.length} attachments for claim ${claimId}`);
      } else {
        console.log('No attachments found for this claim');
        setClaimAttachments([]);
      }
      
      setIsViewModalOpen(true);
    } else {
      toast.error('Failed to load claim details');
    }
  } catch (err: any) {
    console.error('Error fetching claim details:', err);
    toast.error(err.message || 'Failed to load claim details');
  }
};

// Replace the existing handleApprove and handleReject functions with these:

const openActionModal = (claimId: number, level: number, type: 'approve' | 'reject') => {
  // Find the claim from pending approvals
  const claim = pendingApprovals.find(pa => pa.claim_id === claimId);
  if (claim) {
    setSelectedClaim({
      id: claim.claim_id,
      benefit_type_name: claim.benefit_type_name,
      amount: claim.amount,
      approved_amount: null,
      claim_date: claim.claim_date,
      status: claim.status,
      employee_remark: claim.employee_remark,
      admin_remark: null,
      company_name: claim.company_name,
      current_approval_level: claim.approval_level,
      final_approval_level: 3, // You might need to adjust this based on your data
      created_at: new Date().toISOString(),
      employee_id: 0, // You might need to get this from the claim data
      employee_name: claim.employee_name
    });
    setActionType(type);
    setActionRemark('');
    setShowActionModal(true);
  }
};

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return 'RM 0.00';
  return `RM ${num.toFixed(2)}`;
};

const handleApprove = async () => {
  if (!selectedClaim || !user) {
    toast.error('No claim selected or user not logged in.');
    return;
  }
  
  // Check authorization first
  const authorized = await canUserApproveClaim(selectedClaim.id, selectedClaim.current_approval_level);
  if (!authorized) {
    toast.error('You are not authorized to approve this claim at the current level');
    setShowActionModal(false);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/approval/claims/${selectedClaim.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approver_id: user.id,
        approver_name: user.name,
        remark: actionRemark
      })
    });

    if (res.ok) {
      toast.success('Claim approved successfully');
      setShowActionModal(false);
      setActionRemark('');
      fetchApprovalData(); // Refresh the approval data
    } else {
      const error = await res.json();
      toast.error(error.error || 'Failed to approve claim');
    }
  } catch (err) {
    console.error('Error approving claim:', err);
    toast.error('Failed to approve claim');
  }
};

const handleReject = async () => {
  if (!selectedClaim || !user) {
    toast.error('No claim selected or user not logged in.');
    return;
  }
  
  if (!actionRemark.trim()) {
    toast.error('Rejection reason is required.');
    return;
  }

  // Check authorization first
  const authorized = await canUserApproveClaim(selectedClaim.id, selectedClaim.current_approval_level);
  if (!authorized) {
    toast.error('You are not authorized to reject this claim at the current level');
    setShowActionModal(false);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/approval/claims/${selectedClaim.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approver_id: user.id,
        approver_name: user.name,
        remark: actionRemark
      })
    });

    if (res.ok) {
      toast.success('Claim rejected successfully');
      setShowActionModal(false);
      setActionRemark('');
      fetchApprovalData(); // Refresh the approval data
    } else {
      const error = await res.json();
      toast.error(error.error || 'Failed to reject claim');
    }
  } catch (err) {
    console.error('Error rejecting claim:', err);
    toast.error('Failed to reject claim');
  }
};



// Update your existing openViewModal function
const openViewModal = async (claim: Claim) => {
  setSelectedClaim(claim);
  setFetchedClaimDetails(null);
  setClaimAttachments([]); // Clear previous attachments
  setIsViewModalOpen(true);

  try {
    // Fetch comprehensive claim details
    const res = await fetch(`${API_BASE_URL}/api/approval/claims/${claim.id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: FullClaimDetailsResponse = await res.json();
    setFetchedClaimDetails(data);

    // 🆕 Fetch attachments for this claim
    setLoadingAttachments(true);
    const attachmentsRes = await fetch(`${API_BASE_URL}/api/claims/${claim.id}/attachments`);
    if (attachmentsRes.ok) {
      const attachments = await attachmentsRes.json();
      setClaimAttachments(attachments);
      console.log(`✅ Loaded ${attachments.length} attachments for claim ${claim.id}`);
    } else {
      console.log('No attachments found for this claim');
      setClaimAttachments([]);
    }
  } catch (err: any) {
    console.error('Error fetching comprehensive claim details:', err);
    toast.error(err.message || 'Failed to load claim details for view.');
    setIsViewModalOpen(false);
  } finally {
    setLoadingAttachments(false);
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

  const refreshClaims = async () => {
  if (!user) return;
  
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/claims/${user.id}`);
    if (!res.ok) {
      if (res.status === 404) {
        setClaims([]);
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setClaims(data);
    } else if (typeof data === 'object' && data !== null) {
      setClaims([data]);
    } else {
      setClaims([]);
    }
  } catch (err) {
    console.error('Error refreshing claims:', err);
    toast.error('Failed to refresh claims.');
    setClaims([]);
  } finally {
    setLoading(false);
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
    <div className="modal-box max-w-4xl p-0">
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
            {/* Basic Claim Information */}
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

            {/* 🆕 Attachments Section */}
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-3 border-t pt-4">Supporting Documents</h4>
              {loadingAttachments ? (
                <div className="text-center py-4">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="ml-2 text-gray-600">Loading attachments...</span>
                </div>
              ) : claimAttachments.length > 0 ? (
                <div className="space-y-2">
                  {claimAttachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          attachment.mime_type?.startsWith('image/') ? 'bg-blue-100 text-blue-600' :
                          attachment.mime_type === 'application/pdf' ? 'bg-red-100 text-red-600' :
                          attachment.mime_type?.startsWith('application/') ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {attachment.mime_type?.startsWith('image/') ? '🖼️' : 
                           attachment.mime_type === 'application/pdf' ? '📄' : 
                           '📎'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{attachment.file_name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded by {attachment.uploaded_by_name} • 
                            {new Date(attachment.uploaded_at).toLocaleDateString()} • 
                            {attachment.file_size ? ` ${(attachment.file_size / 1024).toFixed(1)} KB` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadAttachment(attachment)}
                        disabled={downloadingAttachment === attachment.id}
                        className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
                      >
                        {downloadingAttachment === attachment.id ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No supporting documents attached</p>
                </div>
              )}
            </div>

            {/* Existing Approval History Section */}
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
                      .sort((a, b) => new Date(a.approved_at).getTime() - new Date(b.approved_at).getTime())
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

            {/* Existing Current Approval Status Section */}
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
                                'badge-warning'
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
      
       {/* ======================== Approve / Reject Modal ======================== */}
    {showActionModal && selectedClaim && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-base-300/40 backdrop-blur-[2px]" role="dialog" aria-modal="true">
        <div className="bg-base-100 rounded-lg max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
          <h2 className={`text-xl font-bold mb-4 ${actionType === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
            {actionType === 'approve' ? '✅ Approve Claim Request' : '❌ Reject Claim Request'}
          </h2>
          
          {/* Close button */}
          <button 
            onClick={() => setShowActionModal(false)} 
            className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4"
          >
            ✕
          </button>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
            <div><strong>Employee:</strong> {selectedClaim.employee_name}</div>
            <div><strong>Company:</strong> {selectedClaim.company_name}</div>
            <div><strong>Benefit Type:</strong> {selectedClaim.benefit_type_name}</div>
            <div><strong>Date:</strong> {new Date(selectedClaim.claim_date).toLocaleDateString()}</div>
            <div><strong>Amount:</strong> {formatCurrency(selectedClaim.amount)}</div>
            <div><strong>Status:</strong> {selectedClaim.status}</div>
            <div className="col-span-2">
              <strong>Employee Remark:</strong> 
              <span className="italic text-gray-600 ml-1">{selectedClaim.employee_remark}</span>
            </div>
          </div>

          <label className="block font-medium text-sm text-gray-700 mb-1">
            {actionType === 'approve' ? 'Approval Comment (Optional)' : 'Rejection Reason'} 
            {actionType === 'reject' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            className="textarea textarea-bordered w-full mb-4"
            value={actionRemark}
            onChange={(e) => setActionRemark(e.target.value)}
            placeholder={actionType === 'approve' ? 'Add comment (optional)' : 'Please provide a reason'}
            required={actionType === 'reject'}
            rows={4}
          />
          
          {actionType === 'approve' ? (
            <div className="bg-green-50 text-green-800 text-sm border border-green-200 rounded-md p-3 mb-4">
              <strong>Approval Confirmation:</strong> By approving this claim, you confirm the request is valid and processed.
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-800 text-sm border border-yellow-300 rounded-md p-3 mb-4">
              <strong>Important Note:</strong> This action cannot be undone. The employee will be notified.
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button 
              className="btn btn-ghost" 
              onClick={() => setShowActionModal(false)}
            >
              Cancel
            </button>
            <button
              className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-error'}`}
              onClick={actionType === 'approve' ? handleApprove : handleReject}
              disabled={actionType === 'reject' && actionRemark.trim() === ''}
            >
              {actionType === 'approve' ? 'Approve Claim' : 'Reject Claim'}
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
        onClaimSubmitted={refreshClaims}
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
    {/* Conditional rendering for Edit and Delete buttons - Hide when Under Review */}
    {claim.status === 'Pending' && (
      <>
        <button
          onClick={() => openEditModal(claim)}
          className="btn btn-sm btn-ghost"
          title="Edit Claim"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => openDeleteModal(claim)}
          className="btn btn-sm btn-ghost text-error"
          title="Delete Claim"
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

      
       {/* Pending Approvals Table - Only show for approvers */}
{/* Pending Approvals Table - Only show for approvers */}
{shouldShowApprovalTables && (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Pending Approvals</h2>
      <span className="badge badge-warning badge-lg">
        {pendingApprovals.length} Pending
      </span>
    </div>

    {approvalsLoading ? (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    ) : pendingApprovals.length === 0 ? (
      <div className="alert alert-info shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>No pending approvals requiring your action.</span>
      </div>
    ) : (
      <div className="bg-base-100 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>Employee</th>
                <th>Benefit</th>
                <th>Amount</th>
                <th>Company</th>
                <th>Level</th>
                <th>Remarks</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {pendingApprovals.map((approval) => (
                <PendingApprovalRow key={approval.id} approval={approval} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)}

      {/* Approval History Table - Only show for approvers */}
      {shouldShowApprovalTables && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Approval History</h2>
            <span className="badge badge-info badge-lg">
              {approvalHistory.length} Decisions
            </span>
          </div>

          {approvalsLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : approvalHistory.length === 0 ? (
            <div className="alert alert-info shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>No approval history found.</span>
            </div>
          ) : (
            <div className="bg-base-100 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Employee</th>
                      <th>Benefit</th>
                      <th>Amount</th>
                      <th>Company</th>
                      <th>Level</th>
                      <th>Decision</th>
                      <th>Your Remark</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300">
                    {approvalHistory.map((history) => (
                      <tr key={history.id} className="hover:bg-base-200">
                        <td>{history.employee_name}</td>
                        <td>{history.benefit_type_name}</td>
                        <td>RM {parseFloat(history.amount.toString()).toFixed(2)}</td>
                        <td>{history.company_name}</td>
                        <td>
                          <span className="badge badge-info">Level {history.approval_level}</span>
                        </td>
                        <td>
                          <span className={`badge ${
                            history.approval_status === 'Approved' ? 'badge-success' : 'badge-error'
                          }`}>
                            {history.approval_status}
                          </span>
                        </td>
                        <td>
                          <div className="max-w-xs">
                            <div className="text-sm">{history.approval_remark || '-'}</div>
                          </div>
                        </td>
                        <td>{new Date(history.action_date).toLocaleDateString()}</td>
                        <td>
<button
  onClick={() => handleViewPendingClaim(history.claim_id)}
  className="btn btn-ghost btn-sm"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
