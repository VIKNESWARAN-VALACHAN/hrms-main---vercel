'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
}

export default function CategoryMasterPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: newCategory })
      });
      if (res.ok) {
        toast.success('Category added');
        setNewCategory('');
        fetchCategories();
      } else {
        toast.error('Failed to add category');
      }
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const updateCategory = async () => {
    if (!editingName.trim() || editingId === null) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/categories/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ name: editingName })
      });
      if (res.ok) {
        toast.success('Category updated');
        setEditingId(null);
        setEditingName('');
        fetchCategories();
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback/master/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      if (res.ok) {
        toast.success('Deleted');
        fetchCategories();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Manage Categories</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New category name"
          className="input input-bordered"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createCategory}>Add</button>
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
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>
                {editingId === category.id ? (
                  <input
                    className="input input-sm"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                ) : (
                  category.name
                )}
              </td>
              <td className="text-right">
                {editingId === category.id ? (
                  <>
                    <button className="btn btn-sm btn-success mr-2" onClick={updateCategory}>Save</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline mr-2" onClick={() => { setEditingId(category.id); setEditingName(category.name); }}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => deleteCategory(category.id)}>Delete</button>
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
