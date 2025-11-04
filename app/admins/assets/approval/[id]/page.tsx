// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import RequestStatusTimeline, { TimelineItem } from '../../../../components/assets/RequestStatusTimeline';
// import { API_BASE_URL } from '../../../../config';

// // You should replace this with your own session or auth context.
// function getCurrentUser() {
//   // Example only; use your real auth/session logic
//   if (typeof window !== "undefined") {
//     // You could also use Context or cookies, etc.
//     const user = localStorage.getItem('hrms_user');
//     if (user) return JSON.parse(user);
//   }
//   // Fallback, or redirect to login
//   return null;
// }

// export default function RequestApprovalDetail() {
//   const router = useRouter();
//   const { id } = useParams() as { id: string };

//   const [request, setRequest] = useState<any>(null);
//   const [history, setHistory] = useState<TimelineItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [remarks, setRemarks] = useState('');
//   const [actionLoading, setActionLoading] = useState<false | 'approve' | 'reject'>(false);
//   const [error, setError] = useState<string | null>(null);

//   const currentUser = getCurrentUser(); // Should have .id or .employee_id

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`).then(res => res.json()),
//       fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`).then(res => res.json()),
//     ]).then(([req, hist]) => {
//       setRequest(req);
//       setHistory(hist.map((h: any) => ({
//         status: h.status_name,
//         changedAt: h.changed_at,
//         changedBy: h.changed_by_name,
//         remarks: h.notes || h.remarks, // Fallback to .notes for history
//       })));
//       setLoading(false);
//     });
//   }, [id]);

//   const doAction = async (status_id: number, action: 'approve' | 'reject') => {
//     if (!currentUser?.id && !currentUser?.employee_id) {
//       setError("Session expired. Please login again.");
//       return;
//     }
//     setActionLoading(action);
//     setError(null);

//     const employeeId = currentUser.employee_id || currentUser.id;
//     const response = await fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/approve`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status_id, remarks, changed_by: employeeId }),
//     });
//     if (!response.ok) {
//       const err = await response.json().catch(() => ({}));
//       setError(err?.error || 'Approval failed.');
//       setActionLoading(false);
//       return;
//     }
//     // Refetch details and history
//     Promise.all([
//         fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`).then(res => res.json()),
//         fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`).then(res => res.json()),
//     ]).then(([req, hist]) => {
//         setRequest(req);
//         setHistory(hist.map((h: any) => ({
//           status: h.status_name,
//           changedAt: h.changed_at,
//           changedBy: h.changed_by_name,
//           remarks: h.notes || h.remarks,
//         })));
//         setRemarks('');
//         setActionLoading(false);
//     });
//   };

//   if (loading) return <div className="p-10 text-center">Loading...</div>;
//   if (!request) return <div className="p-10 text-center text-red-500">Request not found.</div>;

//   // Fallback for pending if null or case-insensitive
//   const isPending = !request.status_name || String(request.status_name).toLowerCase() === 'pending';

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* Back Button */}
//       <button
//         className="mb-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
//         onClick={() => router.back()}
//       >← Back</button>
//       <h2 className="text-2xl font-bold mb-4">Asset Request #{id}</h2>
//       <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 bg-white/95 dark:bg-[#181f2a] p-6 rounded-xl shadow border border-gray-300 dark:border-gray-700">
//         <div className="min-w-[220px] flex-1">
//           <div className="font-semibold text-gray-700 dark:text-gray-200">Serial No</div>
//           <div className="text-base font-mono">{request.serial_no}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">On Behalf</div>
//           <div>{request.behalf_name || '-'}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Asset Type</div>
//           <div>{request.asset_type_name}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Model</div>
//           <div>{request.model_name}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Quantity</div>
//           <div>{request.quantity}</div>
//         </div>
//         <div className="min-w-[220px] flex-1">
//           <div className="font-semibold text-gray-700 dark:text-gray-200">Requested By</div>
//           <div>{request.employee_name} (ID: {request.employee_id})</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Purpose</div>
//           <div>{request.purpose}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Brand</div>
//           <div>{request.brand_name}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Category</div>
//           <div>{request.category}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Remarks</div>
//           <div>{request.remarks || '-'}</div>
//         </div>
//       </div>

//       <div className="mb-8">
//         <h3 className="font-semibold mb-2">Status Timeline</h3>
//         <RequestStatusTimeline history={history} />
//       </div>

//       {error && (
//         <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-3 mb-4 border border-red-300 dark:border-red-700">
//           {error}
//         </div>
//       )}

//       {isPending && (
//         <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-3 border mt-8 max-w-xl mx-auto">
//           <textarea
//             className="textarea textarea-bordered w-full"
//             placeholder="Remarks (optional)"
//             value={remarks}
//             onChange={e => setRemarks(e.target.value)}
//             rows={2}
//           />
//           <div className="flex gap-3 justify-end">
//             <button
//               className="btn btn-success px-6"
//               onClick={() => doAction(2, 'approve')}
//               disabled={actionLoading === 'approve'}
//             >
//               {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
//             </button>
//             <button
//               className="btn btn-error px-6"
//               onClick={() => doAction(3, 'reject')}
//               disabled={actionLoading === 'reject'}
//             >
//               {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


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

  const currentUser = getCurrentUser();

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
        remarks: h.notes || h.remarks,
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

  if (loading) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg">Loading request details...</p>
      </div>
    </div>
  );

  if (!request) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl max-w-md text-center">
        <div className="card-body">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="card-title justify-center text-error">Request Not Found</h2>
          <p className="py-4">The asset request you're looking for doesn't exist or you don't have permission to view it.</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={() => router.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const isPending = !request.status_name || String(request.status_name).toLowerCase() === 'pending';

  return (
    <div className="min-h-screen bg-base-200 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            className="btn btn-ghost btn-sm mb-4"
            onClick={() => router.back()}
          >
            ← Back to Requests
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-base-content">Asset Request Review</h1>
              <p className="text-base-content/70 mt-1">Request #{request.serial_no}</p>
            </div>
            <div className="badge badge-lg badge-primary font-semibold">
              {request.status_name || 'Pending'}
            </div>
          </div>
        </div>

        {/* Request Details Card */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Request Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="label label-text font-semibold">Serial Number</label>
                  <div className="font-mono text-lg bg-base-200 px-3 py-2 rounded-lg">{request.serial_no}</div>
                </div>
                
                <div>
                  <label className="label label-text font-semibold">Requested By</label>
                  <div className="text-lg">{request.employee_name}</div>
                  <div className="text-sm text-base-content/70">Employee ID: {request.employee_id}</div>
                </div>

                <div>
                  <label className="label label-text font-semibold">On Behalf Of</label>
                  <div className={request.behalf_name ? "text-lg" : "text-base-content/70"}>
                    {request.behalf_name || 'Not specified'}
                  </div>
                </div>

                <div>
                  <label className="label label-text font-semibold">Asset Type</label>
                  <div className="text-lg">{request.asset_type_name}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="label label-text font-semibold">Purpose</label>
                  <div className="bg-base-200 px-3 py-2 rounded-lg min-h-[60px]">
                    {request.purpose}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label label-text font-semibold">Brand</label>
                    <div>{request.brand_name}</div>
                  </div>
                  <div>
                    <label className="label label-text font-semibold">Model</label>
                    <div>{request.model_name}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label label-text font-semibold">Category</label>
                    <div>{request.category}</div>
                  </div>
                  <div>
                    <label className="label label-text font-semibold">Quantity</label>
                    <div className="text-lg font-semibold">{request.quantity}</div>
                  </div>
                </div>

                <div>
                  <label className="label label-text font-semibold">Initial Remarks</label>
                  <div className={request.remarks ? "bg-base-200 px-3 py-2 rounded-lg" : "text-base-content/70"}>
                    {request.remarks || 'No remarks provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Status Timeline</h2>
            <RequestStatusTimeline history={history} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Approval Actions */}
        {isPending && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Review & Decision</h2>
              <div className="space-y-4">
                <div>
                  <label className="label label-text font-semibold">Your Remarks</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Add your review comments or remarks (optional)"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  <button
                    className="btn btn-success btn-lg flex-1 sm:flex-none"
                    onClick={() => doAction(2, 'approve')}
                    disabled={actionLoading === 'approve'}
                  >
                    {actionLoading === 'approve' ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Approving...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Approve Request
                      </>
                    )}
                  </button>
                  
                  <button
                    className="btn btn-error btn-lg flex-1 sm:flex-none"
                    onClick={() => doAction(3, 'reject')}
                    disabled={actionLoading === 'reject'}
                  >
                    {actionLoading === 'reject' ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reject Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Non-pending state message */}
        {!isPending && (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>This request has already been processed and is currently <strong>{request.status_name}</strong>.</span>
          </div>
        )}
      </div>
    </div>
  );
}// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import RequestStatusTimeline, { TimelineItem } from '../../../../components/assets/RequestStatusTimeline';
// import { API_BASE_URL } from '../../../../config';

// // You should replace this with your own session or auth context.
// function getCurrentUser() {
//   // Example only; use your real auth/session logic
//   if (typeof window !== "undefined") {
//     // You could also use Context or cookies, etc.
//     const user = localStorage.getItem('hrms_user');
//     if (user) return JSON.parse(user);
//   }
//   // Fallback, or redirect to login
//   return null;
// }

// export default function RequestApprovalDetail() {
//   const router = useRouter();
//   const { id } = useParams() as { id: string };

//   const [request, setRequest] = useState<any>(null);
//   const [history, setHistory] = useState<TimelineItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [remarks, setRemarks] = useState('');
//   const [actionLoading, setActionLoading] = useState<false | 'approve' | 'reject'>(false);
//   const [error, setError] = useState<string | null>(null);

//   const currentUser = getCurrentUser(); // Should have .id or .employee_id

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`).then(res => res.json()),
//       fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`).then(res => res.json()),
//     ]).then(([req, hist]) => {
//       setRequest(req);
//       setHistory(hist.map((h: any) => ({
//         status: h.status_name,
//         changedAt: h.changed_at,
//         changedBy: h.changed_by_name,
//         remarks: h.notes || h.remarks, // Fallback to .notes for history
//       })));
//       setLoading(false);
//     });
//   }, [id]);

//   const doAction = async (status_id: number, action: 'approve' | 'reject') => {
//     if (!currentUser?.id && !currentUser?.employee_id) {
//       setError("Session expired. Please login again.");
//       return;
//     }
//     setActionLoading(action);
//     setError(null);

//     const employeeId = currentUser.employee_id || currentUser.id;
//     const response = await fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/approve`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status_id, remarks, changed_by: employeeId }),
//     });
//     if (!response.ok) {
//       const err = await response.json().catch(() => ({}));
//       setError(err?.error || 'Approval failed.');
//       setActionLoading(false);
//       return;
//     }
//     // Refetch details and history
//     Promise.all([
//         fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}`).then(res => res.json()),
//         fetch(`${API_BASE_URL}/api/inventory/asset-requests/${id}/history`).then(res => res.json()),
//     ]).then(([req, hist]) => {
//         setRequest(req);
//         setHistory(hist.map((h: any) => ({
//           status: h.status_name,
//           changedAt: h.changed_at,
//           changedBy: h.changed_by_name,
//           remarks: h.notes || h.remarks,
//         })));
//         setRemarks('');
//         setActionLoading(false);
//     });
//   };

//   if (loading) return <div className="p-10 text-center">Loading...</div>;
//   if (!request) return <div className="p-10 text-center text-red-500">Request not found.</div>;

//   // Fallback for pending if null or case-insensitive
//   const isPending = !request.status_name || String(request.status_name).toLowerCase() === 'pending';

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* Back Button */}
//       <button
//         className="mb-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
//         onClick={() => router.back()}
//       >← Back</button>
//       <h2 className="text-2xl font-bold mb-4">Asset Request #{id}</h2>
//       <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 bg-white/95 dark:bg-[#181f2a] p-6 rounded-xl shadow border border-gray-300 dark:border-gray-700">
//         <div className="min-w-[220px] flex-1">
//           <div className="font-semibold text-gray-700 dark:text-gray-200">Serial No</div>
//           <div className="text-base font-mono">{request.serial_no}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">On Behalf</div>
//           <div>{request.behalf_name || '-'}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Asset Type</div>
//           <div>{request.asset_type_name}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Model</div>
//           <div>{request.model_name}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Quantity</div>
//           <div>{request.quantity}</div>
//         </div>
//         <div className="min-w-[220px] flex-1">
//           <div className="font-semibold text-gray-700 dark:text-gray-200">Requested By</div>
//           <div>{request.employee_name} (ID: {request.employee_id})</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Purpose</div>
//           <div>{request.purpose}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Brand</div>
//           <div>{request.brand_name}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Category</div>
//           <div>{request.category}</div>
//           <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">Remarks</div>
//           <div>{request.remarks || '-'}</div>
//         </div>
//       </div>

//       <div className="mb-8">
//         <h3 className="font-semibold mb-2">Status Timeline</h3>
//         <RequestStatusTimeline history={history} />
//       </div>

//       {error && (
//         <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-3 mb-4 border border-red-300 dark:border-red-700">
//           {error}
//         </div>
//       )}

//       {isPending && (
//         <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-3 border mt-8 max-w-xl mx-auto">
//           <textarea
//             className="textarea textarea-bordered w-full"
//             placeholder="Remarks (optional)"
//             value={remarks}
//             onChange={e => setRemarks(e.target.value)}
//             rows={2}
//           />
//           <div className="flex gap-3 justify-end">
//             <button
//               className="btn btn-success px-6"
//               onClick={() => doAction(2, 'approve')}
//               disabled={actionLoading === 'approve'}
//             >
//               {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
//             </button>
//             <button
//               className="btn btn-error px-6"
//               onClick={() => doAction(3, 'reject')}
//               disabled={actionLoading === 'reject'}
//             >
//               {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


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

  const currentUser = getCurrentUser();

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
        remarks: h.notes || h.remarks,
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

  if (loading) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg">Loading request details...</p>
      </div>
    </div>
  );

  if (!request) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl max-w-md text-center">
        <div className="card-body">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="card-title justify-center text-error">Request Not Found</h2>
          <p className="py-4">The asset request you're looking for doesn't exist or you don't have permission to view it.</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={() => router.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const isPending = !request.status_name || String(request.status_name).toLowerCase() === 'pending';

  return (
    <div className="min-h-screen bg-base-200 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            className="btn btn-ghost btn-sm mb-4"
            onClick={() => router.back()}
          >
            ← Back to Requests
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-base-content">Asset Request Review</h1>
              <p className="text-base-content/70 mt-1">Request #{request.serial_no}</p>
            </div>
            <div className="badge badge-lg badge-primary font-semibold">
              {request.status_name || 'Pending'}
            </div>
          </div>
        </div>

        {/* Request Details Card */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Request Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="label label-text font-semibold">Serial Number</label>
                  <div className="font-mono text-lg bg-base-200 px-3 py-2 rounded-lg">{request.serial_no}</div>
                </div>
                
                <div>
                  <label className="label label-text font-semibold">Requested By</label>
                  <div className="text-lg">{request.employee_name}</div>
                  <div className="text-sm text-base-content/70">Employee ID: {request.employee_id}</div>
                </div>

                <div>
                  <label className="label label-text font-semibold">On Behalf Of</label>
                  <div className={request.behalf_name ? "text-lg" : "text-base-content/70"}>
                    {request.behalf_name || 'Not specified'}
                  </div>
                </div>

                <div>
                  <label className="label label-text font-semibold">Asset Type</label>
                  <div className="text-lg">{request.asset_type_name}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="label label-text font-semibold">Purpose</label>
                  <div className="bg-base-200 px-3 py-2 rounded-lg min-h-[60px]">
                    {request.purpose}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label label-text font-semibold">Brand</label>
                    <div>{request.brand_name}</div>
                  </div>
                  <div>
                    <label className="label label-text font-semibold">Model</label>
                    <div>{request.model_name}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label label-text font-semibold">Category</label>
                    <div>{request.category}</div>
                  </div>
                  <div>
                    <label className="label label-text font-semibold">Quantity</label>
                    <div className="text-lg font-semibold">{request.quantity}</div>
                  </div>
                </div>

                <div>
                  <label className="label label-text font-semibold">Initial Remarks</label>
                  <div className={request.remarks ? "bg-base-200 px-3 py-2 rounded-lg" : "text-base-content/70"}>
                    {request.remarks || 'No remarks provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Status Timeline</h2>
            <RequestStatusTimeline history={history} />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Approval Actions */}
        {isPending && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Review & Decision</h2>
              <div className="space-y-4">
                <div>
                  <label className="label label-text font-semibold">Your Remarks</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Add your review comments or remarks (optional)"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  <button
                    className="btn btn-success btn-lg flex-1 sm:flex-none"
                    onClick={() => doAction(2, 'approve')}
                    disabled={actionLoading === 'approve'}
                  >
                    {actionLoading === 'approve' ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Approving...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Approve Request
                      </>
                    )}
                  </button>
                  
                  <button
                    className="btn btn-error btn-lg flex-1 sm:flex-none"
                    onClick={() => doAction(3, 'reject')}
                    disabled={actionLoading === 'reject'}
                  >
                    {actionLoading === 'reject' ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reject Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Non-pending state message */}
        {!isPending && (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>This request has already been processed and is currently <strong>{request.status_name}</strong>.</span>
          </div>
        )}
      </div>
    </div>
  );
}
