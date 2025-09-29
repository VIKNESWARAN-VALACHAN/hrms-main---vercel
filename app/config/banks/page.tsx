'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface Bank {
  id: number;
  name: string; // normalized
  currency_code: string;
  type: string;
  status: 'Active' | 'Inactive';
}

export default function BankListPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [newBank, setNewBank] = useState<Bank>({
    id: 0,
    name: '',
    currency_code: 'MYR',
    type: 'Bank',
    status: 'Active',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingBank, setEditingBank] = useState<Bank>(newBank);

  const fetchBanks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks`);
      const data = await res.json();

      const normalized = data.map((b: any) => ({
        id: b.id,
        name: b.bank_name,
        currency_code: b.currency_code,
        type: b.type,
        status: b.status,
      }));
      setBanks(normalized);
    } catch {
      toast.error('Failed to load banks');
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBank.name,
          currency_code: newBank.currency_code,
          type: newBank.type,
          status: newBank.status,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Bank added');
      setNewBank({ ...newBank, name: '' });
      fetchBanks();
    } catch {
      toast.error('Add failed');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingBank.name,
          currency_code: editingBank.currency_code,
          type: editingBank.type,
          status: editingBank.status,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Updated');
      setEditingId(null);
      fetchBanks();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this bank?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/bank-currency/banks/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
      fetchBanks();
    } catch {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Bank Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        <input
          className="input input-bordered"
          placeholder="Bank Name"
          value={newBank.name}
          onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
        />
        <select
          className="select select-bordered"
          value={newBank.currency_code}
          onChange={(e) => setNewBank({ ...newBank, currency_code: e.target.value })}
        >
          <option value="MYR">MYR</option>
          <option value="USD">USD</option>
          <option value="THB">THB</option>
        </select>
        <input
          className="input input-bordered"
          placeholder="Type"
          value={newBank.type}
          onChange={(e) => setNewBank({ ...newBank, type: e.target.value })}
        />
        <select
          className="select select-bordered"
          value={newBank.status}
          onChange={(e) => setNewBank({ ...newBank, status: e.target.value as 'Active' | 'Inactive' })}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button className="btn btn-primary col-span-full" onClick={handleAdd}>
          Add Bank
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Currency</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => (
            <tr key={`bank-${bank.id}`}>
              <td>
                {editingId === bank.id ? (
                  <input
                    className="input input-sm"
                    value={editingBank.name}
                    onChange={(e) => setEditingBank({ ...editingBank, name: e.target.value })}
                  />
                ) : (
                  bank.name
                )}
              </td>
              <td>
                {editingId === bank.id ? (
                  <select
                    className="select select-sm"
                    value={editingBank.currency_code}
                    onChange={(e) => setEditingBank({ ...editingBank, currency_code: e.target.value })}
                  >
                    <option>MYR</option>
                    <option>USD</option>
                    <option>THB</option>
                  </select>
                ) : (
                  bank.currency_code
                )}
              </td>
              <td>
                {editingId === bank.id ? (
                  <input
                    className="input input-sm"
                    value={editingBank.type}
                    onChange={(e) => setEditingBank({ ...editingBank, type: e.target.value })}
                  />
                ) : (
                  bank.type
                )}
              </td>
              <td>
                {editingId === bank.id ? (
                  <select
                    className="select select-sm"
                    value={editingBank.status}
                    onChange={(e) =>
                      setEditingBank({ ...editingBank, status: e.target.value as 'Active' | 'Inactive' })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                ) : (
                  bank.status
                )}
              </td>
              <td>
                {editingId === bank.id ? (
                  <>
                    <button className="btn btn-sm btn-success mr-2" onClick={() => handleUpdate(bank.id)}>
                      Save
                    </button>
                    <button className="btn btn-sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-info mr-2"
                      onClick={() => {
                        setEditingId(bank.id);
                        setEditingBank(bank);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDelete(bank.id)}>
                      Delete
                    </button>
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
