'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '../../config';

function getCurrentUser() {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem('hrms_user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  }
  return null;
}

export default function TransferAssetPage() {
  const user = getCurrentUser();
  const router = useRouter();
  const params = useSearchParams();
  const assetId = params.get('id');

  const [employees, setEmployees] = useState<any[]>([]);
  const [toEmployee, setToEmployee] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/employees`)
      .then(res => res.json())
      .then(data => setEmployees(data.filter((e: any) => user && e.id !== user.id)));
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    if (!assetId || !toEmployee) {
      setError('Please select the new owner.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_employee: user.id,
          to_employee: toEmployee,
          remarks
        })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to request transfer');
      router.push('/my-assets');
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <div className="p-10 text-center text-red-500">Not logged in.</div>;
  if (!assetId) return <div className="p-10 text-center text-red-500">No asset specified.</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Request Asset Transfer</h2>
      <form className="bg-white dark:bg-[#181f2a] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col gap-4"
            onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1">Transfer To *</label>
          <select className="select select-bordered w-full" value={toEmployee} onChange={e => setToEmployee(e.target.value)} required>
            <option value="">-- Select Employee --</option>
            {employees.map((emp: any) =>
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            )}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Remarks</label>
          <textarea className="textarea textarea-bordered w-full" value={remarks} onChange={e => setRemarks(e.target.value)} rows={2}/>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-4 justify-end">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Submitting..." : "Submit Transfer"}</button>
        </div>
      </form>
    </div>
  );
}
