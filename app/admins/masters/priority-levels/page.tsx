'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface Item {
  id: number;
  name: string;
}

export default function PriorityLevelsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  const endpoint = 'priority-levels';

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/${endpoint}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async () => {
    if (!newItem.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: newItem })
      });
      if (res.ok) {
        toast.success('Added');
        setNewItem('');
        fetchItems();
      } else {
        toast.error('Add failed');
      }
    } catch (err) {
      toast.error('Add failed');
    }
  };

  const updateItem = async () => {
    if (!editingName.trim() || editingId === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/${endpoint}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: editingName })
      });
      if (res.ok) {
        toast.success('Updated');
        setEditingId(null);
        setEditingName('');
        fetchItems();
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      if (res.ok) {
        toast.success('Deleted');
        fetchItems();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold capitalize">Manage {endpoint.replace('-', ' ')}</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={`New ${endpoint.replace('-', ' ')}`}
          className="input input-bordered"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createItem}>Add</button>
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
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {editingId === item.id ? (
                  <input
                    className="input input-sm"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="text-right">
                {editingId === item.id ? (
                  <>
                    <button className="btn btn-sm btn-success mr-2" onClick={updateItem}>Save</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline mr-2" onClick={() => { setEditingId(item.id); setEditingName(item.name); }}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => deleteItem(item.id)}>Delete</button>
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
