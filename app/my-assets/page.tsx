'use client';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

export default function MyAssetsPage() {
  const [user, setUser] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Only run once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = localStorage.getItem('hrms_user');
        if (u) setUser(JSON.parse(u));
      } catch { setUser(null); }
    }
  }, []);

  // Fetch assets when user, page, or limit changes
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/inventory/assets-paging?assigned_to=${user.id}&page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setAssets(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [user, page, limit]);

  if (!user) return <div className="p-10 text-center text-red-500">Not logged in.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Assigned Assets</h2>
      {loading ? <div>Loading...</div> : (
        assets.length === 0 ? <div>No assets assigned to you.</div> : (
          <table className="table w-full border mb-6">
            <thead>
              <tr>
                <th>ID</th>
                <th>Serial</th>
                <th>Product</th>
                <th>Status</th>
                <th>Assigned Dept</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id}>
                  <td>{asset.id}</td>
                  <td>{asset.serial_number || '-'}</td>
                  <td>{asset.product_name || '-'}</td>
                  <td>{asset.status_id || '-'}</td>
                  <td>{asset.assigned_department_name || '-'}</td>
                  <td>
                    <a className="btn btn-xs btn-primary" href={`/my-assets/${asset.id}`}>View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      <div className="flex gap-2 justify-end">
        <button className="btn btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}
