'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import RequestStatusTimeline, { TimelineItem } from '../../components/assets/RequestStatusTimeline';
import { API_BASE_URL } from '../../config';

// You may want to use a proper context/auth
function getCurrentUser() {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem('hrms_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  return null;
}

export default function AssetRequestDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const user = getCurrentUser();

  const [request, setRequest] = useState<any>(null);
  const [history, setHistory] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');

  // Load request + timeline
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`).then(res => res.json()),
    ]).then(([req, hist]) => {
      setRequest(req);
      setHistory(
        hist.map((h: any) => ({
          status: h.status_name,
          changedAt: h.changed_at,
          changedBy: h.changed_by_name,
          remarks: h.remarks ?? h.notes,
        }))
      );
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  // Cancellation (if allowed)
  const canCancel =
    request &&
    user &&
    String(request.employee_id) === String(user.id) &&
    (!request.status_name || String(request.status_name).toLowerCase() === 'pending');

  const handleCancel = async () => {
    if (!confirm('Cancel this request?')) return;
    setCancelLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/requests/${id}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status_id: 4,
    changed_by: user.id,    // <-- This is now required!
    remarks: 'Cancelled by requester'
  }),
});
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to cancel');
      // Reload data after cancel
      const reqRes = await fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`);
      setRequest(await reqRes.json());
      const histRes = await fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`);
      setHistory(
        (await histRes.json()).map((h: any) => ({
          status: h.status_name,
          changedAt: h.changed_at,
          changedBy: h.changed_by_name,
          remarks: h.remarks ?? h.notes,
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to cancel');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!request) return <div className="p-10 text-center text-red-500">Request not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        className="mb-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
        onClick={() => router.back()}
      >← Back</button>

      <h2 className="text-2xl font-bold mb-4">Asset Request #{id}</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 bg-white dark:bg-[#181f2a] p-6 rounded-xl shadow border border-gray-300 dark:border-gray-700">
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

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="flex gap-4">
        <Link href="/assets">
          <span className="btn btn-outline">Back to My Requests</span>
        </Link>
        {canCancel && (
          <button
            className="btn btn-error"
            disabled={cancelLoading}
            onClick={handleCancel}
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel Request'}
          </button>
        )}
      </div>
    </div>
  );
}
