'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface CurrencyCode {
  id: number;
  code: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export default function CurrencyCodePage() {
  const [codes, setCodes] = useState<CurrencyCode[]>([]);
  const [newCode, setNewCode] = useState({
    code: '',
    name: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCode, setEditingCode] = useState(newCode);

  const fetchCodes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/currencies`);
      const data = await res.json();
      setCodes(data);
    } catch {
      toast.error('Failed to load currency codes');
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/currencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCode),
      });
      if (!res.ok) throw new Error();
      toast.success('Currency code added');
      setNewCode({ code: '', name: '', status: 'Active' });
      fetchCodes();
    } catch {
      toast.error('Add failed');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/currencies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCode),
      });
      if (!res.ok) throw new Error();
      toast.success('Updated');
      setEditingId(null);
      fetchCodes();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this currency code?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/bank-currency/currencies/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchCodes();
    } catch {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Currency Codes</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        <input
          className="input input-bordered"
          placeholder="Code (e.g., MYR)"
          value={newCode.code}
          onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
        />
        <input
          className="input input-bordered"
          placeholder="Currency Name"
          value={newCode.name}
          onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
        />
        <select
          className="select select-bordered"
          value={newCode.status}
          onChange={(e) => setNewCode({ ...newCode, status: e.target.value as 'Active' | 'Inactive' })}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button className="btn btn-primary col-span-full" onClick={handleAdd}>Add Currency Code</button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((c) => (
            <tr key={`code-${c.id}`}>
              <td>{editingId === c.id ? (
                <input className="input input-sm" value={editingCode.code} onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value })} />
              ) : c.code}</td>
              <td>{editingId === c.id ? (
                <input className="input input-sm" value={editingCode.name} onChange={(e) => setEditingCode({ ...editingCode, name: e.target.value })} />
              ) : c.name}</td>
              <td>{editingId === c.id ? (
                <select className="select select-sm" value={editingCode.status} onChange={(e) => setEditingCode({ ...editingCode, status: e.target.value as 'Active' | 'Inactive' })}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              ) : c.status}</td>
              <td>
                {editingId === c.id ? (
                  <>
                    <button className="btn btn-sm btn-success mr-2" onClick={() => handleUpdate(c.id)}>Save</button>
                    <button className="btn btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-info mr-2" onClick={() => { setEditingId(c.id); setEditingCode(c); }}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDelete(c.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
