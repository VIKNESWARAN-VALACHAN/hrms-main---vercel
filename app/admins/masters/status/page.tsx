'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface Status {
  id: number;
  name: string;
}

export default function StatusMasterPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/status`);
      const data = await res.json();
      setStatuses(data);
    } catch (err) {
      toast.error('Failed to load statuses');
    } finally {
      setLoading(false);
    }
  };

  const createStatus = async () => {
    if (!newStatus.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: newStatus })
      });
      if (res.ok) {
        toast.success('Status added');
        setNewStatus('');
        fetchStatuses();
      } else {
        toast.error('Failed to add status');
      }
    } catch (err) {
      toast.error('Failed to add status');
    }
  };

  const updateStatus = async () => {
    if (!editingName.trim() || editingId === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/status/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: editingName })
      });
      if (res.ok) {
        toast.success('Status updated');
        setEditingId(null);
        setEditingName('');
        fetchStatuses();
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteStatus = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/status/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      if (res.ok) {
        toast.success('Deleted');
        fetchStatuses();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Manage Status</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New status name"
          className="input input-bordered"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createStatus}>Add</button>
      </div>

      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map(status => (
            <tr key={status.id}>
              <td>{status.id}</td>
              <td>
                {editingId === status.id ? (
                  <input
                    className="input input-sm"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                ) : (
                  status.name
                )}
              </td>
              <td className="text-right">
                {editingId === status.id ? (
                  <>
                    <button className="btn btn-sm btn-success mr-2" onClick={updateStatus}>Save</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline mr-2" onClick={() => { setEditingId(status.id); setEditingName(status.name); }}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => deleteStatus(status.id)}>Delete</button>
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
