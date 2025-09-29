'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RequestStatusTimeline, { TimelineItem } from '../../../../components/assets/RequestStatusTimeline';
import { API_BASE_URL } from '../../../../config';

// You should replace this with your own session or auth context.
function getCurrentUser() {
  // Example only; use your real auth/session logic
  if (typeof window !== "undefined") {
    // You could also use Context or cookies, etc.
    const user = localStorage.getItem('hrms_user');
    if (user) return JSON.parse(user);
  }
  // Fallback, or redirect to login
  return null;
}

export default function RequestApprovalDetail() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [request, setRequest] = useState<any>(null);
  const [history, setHistory] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState<false | 'approve' | 'reject'>(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getCurrentUser(); // Should have .id or .employee_id

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`).then(res => res.json()),
    ]).then(([req, hist]) => {
      setRequest(req);
      setHistory(hist.map((h: any) => ({
        status: h.status_name,
        changedAt: h.changed_at,
        changedBy: h.changed_by_name,
        remarks: h.notes || h.remarks, // Fallback to .notes for history
      })));
      setLoading(false);
    });
  }, [id]);

  const doAction = async (status_id: number, action: 'approve' | 'reject') => {
    if (!currentUser?.id && !currentUser?.employee_id) {
      setError("Session expired. Please login again.");
      return;
    }
    setActionLoading(action);
    setError(null);

    const employeeId = currentUser.employee_id || currentUser.id;
    const response = await fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_id, remarks, changed_by: employeeId }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      setError(err?.error || 'Approval failed.');
      setActionLoading(false);
      return;
    }
    // Refetch details and history
    Promise.all([
        fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`).then(res => res.json()),
        fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`).then(res => res.json()),
    ]).then(([req, hist]) => {
        setRequest(req);
        setHistory(hist.map((h: any) => ({
          status: h.status_name,
          changedAt: h.changed_at,
          changedBy: h.changed_by_name,
          remarks: h.notes || h.remarks,
        })));
        setRemarks('');
        setActionLoading(false);
    });
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!request) return <div className="p-10 text-center text-red-500">Request not found.</div>;

  // Fallback for pending if null or case-insensitive
  const isPending = !request.status_name || String(request.status_name).toLowerCase() === 'pending';

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
        onClick={() => router.back()}
      >← Back</button>
      <h2 className="text-2xl font-bold mb-4">Asset Request #{id}</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 bg-white/95 dark:bg-[#181f2a] p-6 rounded-xl shadow border border-gray-300 dark:border-gray-700">
        <div className="min-w-[220px] flex-1">
          <div className="font-semibold text-gray-700 dark:text-gray-200">Serial No</div>
          <div className="text-base font-mono">{request.serial_no}</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">On Behalf</div>
          <div>{request.behalf_name || '-'}</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Asset Type</div>
          <div>{request.asset_type_name}</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Model</div>
          <div>{request.model_name}</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Quantity</div>
          <div>{request.quantity}</div>
        </div>
        <div className="min-w-[220px] flex-1">
          <div className="font-semibold text-gray-700 dark:text-gray-200">Requested By</div>
          <div>{request.employee_name} (ID: {request.employee_id})</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Purpose</div>
          <div>{request.purpose}</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Brand</div>
          <div>{request.brand_name}</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Category</div>
          <div>{request.category}</div>
          <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Remarks</div>
          <div>{request.remarks || '-'}</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-2">Status Timeline</h3>
        <RequestStatusTimeline history={history} />
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-3 mb-4 border border-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      {isPending && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-3 border mt-8 max-w-xl mx-auto">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Remarks (optional)"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={2}
          />
          <div className="flex gap-3 justify-end">
            <button
              className="btn btn-success px-6"
              onClick={() => doAction(2, 'approve')}
              disabled={actionLoading === 'approve'}
            >
              {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
            </button>
            <button
              className="btn btn-error px-6"
              onClick={() => doAction(3, 'reject')}
              disabled={actionLoading === 'reject'}
            >
              {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
