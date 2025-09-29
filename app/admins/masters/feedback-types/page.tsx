'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface FeedbackType {
  id: number;
  name: string;
}

export default function FeedbackTypesMasterPage() {
  const [types, setTypes] = useState<FeedbackType[]>([]);
  const [newType, setNewType] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/feedback-types`);
      const data = await res.json();
      setTypes(data);
    } catch (err) {
      toast.error('Failed to load feedback types');
    } finally {
      setLoading(false);
    }
  };

  const createType = async () => {
    if (!newType.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/feedback-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: newType })
      });
      if (res.ok) {
        toast.success('Type added');
        setNewType('');
        fetchTypes();
      } else {
        toast.error('Failed to add type');
      }
    } catch (err) {
      toast.error('Failed to add type');
    }
  };

  const updateType = async () => {
    if (!editingName.trim() || editingId === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/feedback-types/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: editingName })
      });
      if (res.ok) {
        toast.success('Type updated');
        setEditingId(null);
        setEditingName('');
        fetchTypes();
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteType = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/feedback-types/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      if (res.ok) {
        toast.success('Deleted');
        fetchTypes();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Manage Feedback Types</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New type name"
          className="input input-bordered"
          value={newType}
          onChange={e => setNewType(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createType}>Add</button>
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
          {types.map(type => (
            <tr key={type.id}>
              <td>{type.id}</td>
              <td>
                {editingId === type.id ? (
                  <input
                    className="input input-sm"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                ) : (
                  type.name
                )}
              </td>
              <td className="text-right">
                {editingId === type.id ? (
                  <>
                    <button className="btn btn-sm btn-success mr-2" onClick={updateType}>Save</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline mr-2" onClick={() => { setEditingId(type.id); setEditingName(type.name); }}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => deleteType(type.id)}>Delete</button>
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
