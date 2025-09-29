'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { toast } from 'react-hot-toast';

export default function AssignAssetPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params?.id;

  // Master data
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Asset info (optional, show serial/brand/model)
  const [asset, setAsset] = useState<any>(null);

  // Form state
  const [form, setForm] = useState({
    assigned_to: '',
    assigned_department: '',
    assignment_start_date: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load data
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [employees, departments, asset] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/employees`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/admin/departments`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`).then(r => r.json())
        ]);
        setEmployees(employees);
        setDepartments(departments);
        setAsset(asset);

        setForm({
          assigned_to: asset?.assigned_to?.toString() ?? '',
          assigned_department: asset?.assigned_department?.toString() ?? '',
          assignment_start_date: asset?.assignment_start_date ? asset.assignment_start_date.slice(0,10) : ''
        });
      } catch (e) {
        setError('Failed to load master data or asset.');
      } finally {
        setLoading(false);
      }
    }
    if (assetId) fetchAll();
  }, [assetId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.assigned_to || !form.assigned_department) {
      setError('Please select both employee and department.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        assigned_to: form.assigned_to,
        assigned_department: form.assigned_department,
        assignment_start_date: form.assignment_start_date || null
      };
      const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to assign asset');
      }
      toast.success('Asset assigned successfully!');
      router.push('/admins/assets');
    } catch (e: any) {
      setError(e.message || 'Failed to assign asset');
      toast.error(e.message || 'Failed to assign asset');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Assign Asset</h1>
      {asset && (
        <div className="mb-4 p-3 bg-base-200 rounded shadow">
          <div className="font-semibold">Serial No:</div> {asset.serial_number}<br/>
          <div className="font-semibold">Product:</div> {asset.product_name}<br/>
          <div className="font-semibold">Brand:</div> {asset.brand_name}<br/>
          <div className="font-semibold">Model:</div> {asset.model_name}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold">Assign To (Employee) *</label>
          <select
            name="assigned_to"
            className="select select-bordered w-full"
            value={form.assigned_to}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Assign Department *</label>
          <select
            name="assigned_department"
            className="select select-bordered w-full"
            value={form.assigned_department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.department_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Assignment Start Date</label>
          <input
            type="date"
            name="assignment_start_date"
            className="input input-bordered w-full"
            value={form.assignment_start_date}
            onChange={handleChange}
          />
        </div>
        {error && (
          <div className="alert alert-error">
            <div>{error}</div>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Assign'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/admins/assets')} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
