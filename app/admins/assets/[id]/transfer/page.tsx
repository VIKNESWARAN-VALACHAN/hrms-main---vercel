'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { toast } from 'react-hot-toast';

export default function TransferAssetPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params?.id;

  const [asset, setAsset] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load asset, employees, and departments
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [assetData, emps, depts] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/admin/employees`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE_URL}/api/admin/departments`).then(r => r.json()).catch(() => [])
        ]);
        setAsset(assetData);
        setEmployees(emps);
        setDepartments(depts);

        setNewAssignedTo(assetData.assigned_to?.toString() || '');
        setNewDepartment(assetData.assigned_department?.toString() || '');
      } catch (e) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    if (assetId) fetchAll();
  }, [assetId]);

  // Helper to resolve names from IDs
  const getEmployeeName = (id: any) =>
    employees.find(e => String(e.id) === String(id))?.name || '';
  const getDepartmentName = (id: any) =>
    departments.find(d => String(d.id) === String(id))?.department_name || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newAssignedTo || !newDepartment || !transferDate) {
      setError('Please select all required fields.');
      return;
    }
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assigned_to: newAssignedTo,
          assigned_department: newDepartment,
          transfer_date: transferDate,
          reason,
          note
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to transfer asset');
      }
      toast.success('Asset transferred successfully!');
      router.push('/admins/assets');
    } catch (e: any) {
      setError(e.message || 'Failed to transfer asset');
      toast.error(e.message || 'Failed to transfer asset');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;

  // Current names
  const currentEmpName =
    asset?.assigned_to_name ||
    (asset?.assigned_to ? getEmployeeName(asset.assigned_to) : '-');
  const currentDeptName =
    asset?.assigned_department_name ||
    (asset?.assigned_department ? getDepartmentName(asset.assigned_department) : '-');

  const newEmpName = getEmployeeName(newAssignedTo);
  const newDeptName = getDepartmentName(newDepartment);

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Transfer Asset</h1>
      {asset && (
          <div className="mb-4 p-4 bg-base-100 rounded shadow">
            <div className="font-semibold">Serial No: {asset.serial_number}</div>
            <div>Product: {asset.product_name || '-'}</div>
            <div>Brand: {asset.brand_name || '-'}</div>
            <div>Model: {asset.model_name || '-'}</div>
            <div>Type: {asset.type_name || '-'}</div>
            <div>Status: {asset.status_name || '-'}</div>
            <div>Location: {asset.location_name || '-'}</div>
            <div>Category: {asset.category_name || '-'}</div>
            <div>Unit: {asset.unit_name || '-'}</div>
            <div>
              <b>Current Assignment:</b>
              <div>Employee: {asset.assigned_to_name || '-'}</div>
              <div>Department: {asset.assigned_department_name || '-'}</div>
            </div>
            {asset.description && <div className="text-sm text-gray-600">{asset.description}</div>}
          </div>
      )}
      <h2 className="font-bold mb-2 mt-4">Transfer to:</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold">Assign To (Employee) *</label>
          <select
            className="select select-bordered w-full"
            value={newAssignedTo}
            onChange={e => setNewAssignedTo(e.target.value)}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp: any) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Department *</label>
          <select
            className="select select-bordered w-full"
            value={newDepartment}
            onChange={e => setNewDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.department_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Transfer Date *</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={transferDate}
            onChange={e => setTransferDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Reason</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason (optional)"
          />
        </div>
        <div>
          <label className="block font-semibold">Note</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Additional note"
          />
        </div>
        {/* Transfer summary */}
        {newAssignedTo && newDepartment && (
          <div className="bg-gray-100 p-2 rounded mt-4 text-sm">
            <b>Will transfer asset from</b> <u>{currentEmpName || '-'}</u> (<u>{currentDeptName || '-'}</u>)
            <b> to </b>
            <u>{newEmpName || '-'}</u> (<u>{newDeptName || '-'}</u>)
          </div>
        )}
        {error && <div className="alert alert-error"><div>{error}</div></div>}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Transferring...' : 'Transfer Asset'}
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
