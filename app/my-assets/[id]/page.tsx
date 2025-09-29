'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

export default function MyAssetDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [asset, setAsset] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory/assets/${id}`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/inventory/assets/${id}/history`).then(res => res.json())
    ]).then(([assetData, histData]) => {
      setAsset(assetData);
      setHistory(histData);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!asset) return <div className="p-10 text-center text-red-500">Asset not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        className="mb-4 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
        onClick={() => router.back()}
      >← Back</button>
      <h2 className="text-2xl font-bold mb-4">Asset #{asset.id} Details</h2>
      <div className="bg-white dark:bg-[#181f2a] p-6 rounded-xl shadow border border-gray-300 dark:border-gray-700 mb-8 flex flex-wrap gap-8">
        <div className="flex-1 min-w-[240px]">
          <div className="font-semibold">Serial Number:</div>
          <div className="mb-2">{asset.serial_number || '-'}</div>
          <div className="font-semibold">Product:</div>
          <div className="mb-2">{asset.product_name || '-'}</div>
          <div className="font-semibold">Type:</div>
          <div className="mb-2">{asset.type_name || '-'}</div>
          <div className="font-semibold">Brand:</div>
          <div className="mb-2">{asset.brand_name || '-'}</div>
          <div className="font-semibold">Model:</div>
          <div className="mb-2">{asset.model_name || '-'}</div>
        </div>
        <div className="flex-1 min-w-[240px]">
          <div className="font-semibold">Status:</div>
          <div className="mb-2">{asset.status_name || '-'}</div>
          <div className="font-semibold">Assigned To:</div>
          <div className="mb-2">{asset.assigned_to_name || '-'}</div>
          <div className="font-semibold">Assigned Dept:</div>
          <div className="mb-2">{asset.assigned_department_name || '-'}</div>
          <div className="font-semibold">Location:</div>
          <div className="mb-2">{asset.location_name || '-'}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          className="btn btn-info"
          onClick={() => router.push(`/my-assets/transfer?id=${asset.id}`)}
        >
          Request Transfer
        </button>
        <button
          className="btn btn-warning"
          onClick={() => router.push(`/my-assets/return?id=${asset.id}`)}
        >
          Request Return
        </button>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-lg">Assignment/Movement History</h3>
        {history.length === 0 ? (
          <div className="text-gray-500">No movement or transfer records for this asset.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Time</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td>{h.action}</td>
                    <td>{h.from_employee || '-'}</td>
                    <td>{h.to_employee || '-'}</td>
                    <td>{h.timestamp ? new Date(h.timestamp).toLocaleString('en-GB') : '-'}</td>
                    <td>{h.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
