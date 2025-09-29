'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

// Get user from localStorage/session (replace with your real auth logic)
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

export default function AddAssetRequest() {
  const router = useRouter();
  const user = getCurrentUser();

  const [types, setTypes] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const [typeId, setTypeId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [category, setCategory] = useState('');
  const [onBehalf, setOnBehalf] = useState('');
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load dropdowns
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/inventory/types`).then(r => r.json()).then(setTypes);
    fetch(`${API_BASE_URL}/api/inventory/brands`).then(r => r.json()).then(setBrands);
    fetch(`${API_BASE_URL}/api/inventory/categories`).then(r => r.json()).then(setCategories);
    fetch(`${API_BASE_URL}/api/admin/employees`).then(r => r.json()).then(setEmployees);
  }, []);

  // Load models for brand
  useEffect(() => {
    if (!brandId) { setModels([]); setModelId(''); return; }
    fetch(`${API_BASE_URL}/api/inventory/master/models/${brandId}`)
      .then(r => r.json())
      .then(data => { setModels(data || []); setModelId(''); });
  }, [brandId]);

  if (!user) return <div className="p-10 text-center text-red-500">Not logged in.</div>;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!typeId || !brandId || !modelId || !category || !purpose || !quantity) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      let attachmentUrl = null;
      if (attachment) {
        const formData = new FormData();
        formData.append('file', attachment);
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) attachmentUrl = data.url;
      }

      const res = await fetch(`${API_BASE_URL}/api/inventory/asset-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: user.id,
          submitted_on_behalf: onBehalf || null,
          category,
          asset_type_id: typeId,
          brand_id: brandId,
          model_id: modelId,
          purpose,
          remarks,
          quantity,
          attachment: attachmentUrl
        })
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create request');
      setSuccess('Asset request submitted successfully!');
      setTimeout(() => router.push('/assets'), 1500);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">New Asset Request</h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#181f2a] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1">Category *</label>
          <select className="select select-bordered w-full" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">-- Select Category --</option>
            {categories.map((cat: any) => <option value={cat.name} key={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Asset Type *</label>
            <select className="select select-bordered w-full" value={typeId} onChange={e => setTypeId(e.target.value)} required>
              <option value="">-- Select Type --</option>
              {types.map((t: any) => <option value={t.id} key={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Brand *</label>
            <select className="select select-bordered w-full" value={brandId} onChange={e => setBrandId(e.target.value)} required>
              <option value="">-- Select Brand --</option>
              {brands.map((b: any) => <option value={b.id} key={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Model *</label>
            <select className="select select-bordered w-full" value={modelId} onChange={e => setModelId(e.target.value)} required>
              <option value="">-- Select Model --</option>
              {models.map((m: any) => <option value={m.id} key={m.id}>{m.model_name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Purpose *</label>
          <input type="text" className="input input-bordered w-full" value={purpose} onChange={e => setPurpose(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Remarks</label>
          <textarea className="textarea textarea-bordered w-full" rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Quantity *</label>
            <input type="number" className="input input-bordered w-full" value={quantity} min={1} onChange={e => setQuantity(Number(e.target.value))} required />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">On Behalf Of</label>
            <select className="select select-bordered w-full" value={onBehalf} onChange={e => setOnBehalf(e.target.value)}>
              <option value="">-- Self --</option>
              {employees.filter(emp => emp.id !== user.id).map((emp: any) =>
                <option value={emp.id} key={emp.id}>{emp.name}</option>
              )}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Attachment (optional)</label>
          <input type="file" className="file-input file-input-bordered w-full" onChange={e => setAttachment(e.target.files?.[0] || null)} />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <div className="flex gap-4 justify-end">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Submitting..." : "Submit Request"}</button>
        </div>
      </form>
    </div>
  );
}
