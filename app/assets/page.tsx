'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../config';

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

interface AssetRequest {
  id: number;
  serial_no: string;
  category: string;
  asset_type_name: string;
  brand_name: string;
  model_name: string;
  purpose: string;
  quantity: number;
  created_at: string;
  status_name: string;
  behalf_name: string;
}

function formatDate(dt: string) {
  if (!dt) return '';
  const d = new Date(dt);
  return d.toLocaleString('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).replace(',', '');
}

const pageSize = 10;

export default function MyAssetRequests() {
  const user = getCurrentUser();
  const [requests, setRequests] = useState<AssetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    let url = `${API_BASE_URL}/api/inventory/my-asset-requests?employee_id=${user.id}&page=${page}&pageSize=${pageSize}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setRequests(data.rows || data); // support both raw array or {rows, total}
        setTotal(data.total ?? data.length ?? 0);
        setLoading(false);
      });
  }, [user?.id, page, status]);

  if (!user) {
    return <div className="p-10 text-center text-red-500">Not logged in.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Asset Requests</h1>
        <Link href="/assets/add">
          <span className="btn btn-primary">+ New Request</span>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <select
          className="select select-bordered"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No asset requests found.</div>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="table w-full border">
            <thead>
              <tr>
                <th>ID</th>
                <th>Serial No</th>
                <th>Category</th>
                <th>Asset Type</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Purpose</th>
                <th>Qty</th>
                <th>For</th>
                <th>Created At</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.serial_no}</td>
                  <td>{r.category}</td>
                  <td>{r.asset_type_name}</td>
                  <td>{r.brand_name}</td>
                  <td>{r.model_name}</td>
                  <td>{r.purpose}</td>
                  <td>{r.quantity}</td>
                  <td>{r.behalf_name || '-'}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <span className={`badge 
                      ${r.status_name === 'Pending' ? 'badge-warning' :
                        r.status_name === 'Approved' ? 'badge-success' :
                        r.status_name === 'Rejected' ? 'badge-error' : ''}`}>
                      {r.status_name || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <Link href={`/assets/${r.id}`}>
                      <span className="btn btn-xs btn-outline btn-info">View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-2 justify-center mt-6">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
        >Prev</button>
        <span>Page {page}</span>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setPage(p => p + 1)}
          disabled={requests.length < pageSize}
        >Next</button>
      </div>
    </div>
  );
}
