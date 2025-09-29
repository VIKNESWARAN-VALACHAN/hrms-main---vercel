'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { toast } from 'react-hot-toast';

export default function ReturnAssetPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params?.id;

  const [asset, setAsset] = useState<any>(null);
  const [returnDate, setReturnDate] = useState('');
  const [condition, setCondition] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [returnReasons, setReturnReasons] = useState<any[]>([]);
  const [returnConditions, setReturnConditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load asset and return master data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [asset, reasons, conditions] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/asset-return-reasons`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE_URL}/api/inventory/asset-return-conditions`).then(r => r.json()).catch(() => []),
        ]);
        setAsset(asset);
        setReturnReasons(reasons);
        setReturnConditions(conditions);
      } catch (e) {
        setError('Failed to load asset data.');
      } finally {
        setLoading(false);
      }
    }
    if (assetId) fetchData();
  }, [assetId]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!returnDate || !condition) {
      setError('Return date and condition are required.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          return_date: returnDate,
          condition,
          reason,
          note,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to return asset');
      }
      toast.success('Asset returned successfully!');
      router.push('/admins/assets');
    } catch (e: any) {
      setError(e.message || 'Failed to return asset');
      toast.error(e.message || 'Failed to return asset');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Return Asset</h1>
      {asset && (
        <div className="mb-4 p-4 bg-base-100 rounded shadow">
          <div className="font-semibold">Asset: {asset.serial_number} {asset.product_name && `(${asset.product_name})`}</div>
          {asset.description && <div className="text-sm text-gray-600">{asset.description}</div>}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold">Return Date *</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={returnDate}
            onChange={e => setReturnDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Condition *</label>
          <select
            className="select select-bordered w-full"
            value={condition}
            onChange={e => setCondition(e.target.value)}
            required
          >
            <option value="">Select Condition</option>
            {returnConditions.length > 0
              ? returnConditions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
              : <>
                  <option value="Good">Good</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Needs Repair">Needs Repair</option>
                </>
            }
          </select>
        </div>
        <div>
          <label className="block font-semibold">Reason</label>
          <select
            className="select select-bordered w-full"
            value={reason}
            onChange={e => setReason(e.target.value)}
          >
            <option value="">Select Reason</option>
            {returnReasons.length > 0
              ? returnReasons.map(r => <option key={r.id} value={r.reason_text}>{r.reason_text}</option>)
              : <>
                  <option value="Routine Return">Routine Return</option>
                  <option value="Replacement">Replacement</option>
                  <option value="End of Life">End of Life</option>
                </>
            }
          </select>
        </div>
        <div>
          <label className="block font-semibold">Note</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Any additional note"
          />
        </div>
        {error && <div className="alert alert-error"><div>{error}</div></div>}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Returning...' : 'Return Asset'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/admins/assets')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
