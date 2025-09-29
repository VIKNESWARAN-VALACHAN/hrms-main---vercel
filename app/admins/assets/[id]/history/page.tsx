'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';

interface HistoryRecord {
  id: number | string;
  action: string;
  performed_by: string;
  from_employee?: string;
  to_employee?: string;
  from_department?: string;
  to_department?: string;
  timestamp: string;
  note?: string;
}

export default function AssetHistoryPage() {
  const params = useParams();
  const assetId = params?.id;
  const router = useRouter();

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const [histRes, assetRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}/history`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`).then(r => r.json())
        ]);
        setHistory(Array.isArray(histRes) ? histRes : []);
        setAsset(assetRes || null);
      } catch {
        setError('Failed to load asset history');
      } finally {
        setLoading(false);
      }
    }
    if (assetId) fetchHistory();
  }, [assetId]);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => router.push(`/admins/assets/${assetId}`)}
        >Back</button>
        <h1 className="text-2xl font-bold">Asset History</h1>
      </div>
      {asset && (
        <div className="mb-4 p-4 bg-base-100 rounded shadow">
          <div className="font-semibold">Asset: {asset.serial_number} {asset.product_name && `(${asset.product_name})`}</div>
          {asset.description && <div className="text-sm text-gray-600">{asset.description}</div>}
        </div>
      )}
      {loading && <div className="p-8 text-center text-lg">Loading...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Action</th>
                <th>Performed By</th>
                <th>Details</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">No history found.</td>
                </tr>
              ) : history.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.timestamp ? new Date(rec.timestamp).toLocaleString() : '-'}</td>
                  <td>{rec.action}</td>
                  <td>{rec.performed_by}</td>
                  <td>
                    {/* Show assignment or transfer details */}
                    {rec.from_employee && rec.to_employee &&
                      <span>From <b>{rec.from_employee}</b> to <b>{rec.to_employee}</b></span>}
                    {rec.from_department && rec.to_department &&
                      <span>Dept: <b>{rec.from_department}</b> → <b>{rec.to_department}</b></span>}
                  </td>
                  <td>{rec.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
