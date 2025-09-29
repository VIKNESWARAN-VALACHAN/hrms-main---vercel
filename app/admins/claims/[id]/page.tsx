'use client';

import { useEffect, useState , useCallback} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';
import { API_BASE_URL } from '../../../config';

interface ClaimDetail {
  id: number;
  employee_id: number;
  employee_name: string;
  benefit_type_id: number;
  benefit_type_name: string;
  company_id: number;
  company_name: string;
  claim_date: string;
  amount: string;
  approved_amount: string | null;
  employee_remark: string;
  admin_remark: string | null;
  status: string;
  final_approval_level: number;
  created_at: string;
  updated_at: string;
}

export default function AdminClaimDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: '',
    admin_remark: '',
    status: '',
  });


  
  const fetchClaim = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/api/claims/details/${id}`);
      const data: ClaimDetail[] = response;

      if (data && data.length > 0) {
        const claimData = data[0];
        setClaim(claimData);
        setForm({
          amount: claimData.amount ?? '',
          admin_remark: claimData.admin_remark ?? '',
          status: claimData.status ?? '',
        });
      } else {
        toast.error('Claim not found');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load claim details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchClaim1 = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/api/claims/details/${id}`);
      const data: ClaimDetail[] = response;

      if (data && data.length > 0) {
        const claimData = data[0];
        setClaim(claimData);
        setForm({
          amount: claimData.amount ?? '',
          admin_remark: claimData.admin_remark ?? '',
          status: claimData.status ?? '',
        });
      } else {
        toast.error('Claim not found');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load claim details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.put(`${API_BASE_URL}/api/claims/${id}`, {
        ...form,
        amount: parseFloat(form.amount),
      });
      toast.success('Claim updated successfully!');
      router.push('/admins/claims');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update claim.');
    }
  };

  useEffect(() => {
    if (id) fetchClaim();
  }, [id, fetchClaim]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <span className="loading loading-spinner text-primary"></span>
        <p className="mt-2">Loading claim details...</p>
      </div>
    );
  }

  if (!claim) {
    return <p className="text-center py-8 text-gray-500">Claim not found.</p>;
  }

  const isApproved = claim.status === 'Approved';

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Claim</h1>

      {isApproved && (
        <div className="alert alert-info text-sm mb-4">
          This claim has already been <strong>Approved</strong> and cannot be edited.
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded border text-sm space-y-2">
          <div><strong>Employee:</strong> {claim.employee_name || '-'}</div>
          <div><strong>Company:</strong> {claim.company_name || '-'}</div>
          <div><strong>Benefit Type:</strong> {claim.benefit_type_name || '-'}</div>
          <div><strong>Claim Date:</strong> {claim.claim_date ? new Date(claim.claim_date).toLocaleDateString() : '-'}</div>
          <div><strong>Employee Remark:</strong> {claim.employee_remark || '-'}</div>
        </div>

        <div>
          <label className="block font-medium">Amount (RM)</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="e.g. 100.00"
            disabled={isApproved}
          />
        </div>

        <div>
          <label className="block font-medium">Admin Remark</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={form.admin_remark}
            onChange={(e) => setForm({ ...form, admin_remark: e.target.value })}
            placeholder="Add optional notes or justification"
            disabled={isApproved}
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            className="select select-bordered w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            disabled={isApproved}
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-error"
            onClick={() => router.push('/admins/claims')}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!form.amount || !form.status || isApproved}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
