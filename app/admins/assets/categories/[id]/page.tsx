'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { useTheme } from '../../../../components/ThemeProvider';

export default function EditCategory() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const catId = params?.id as string;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/inventory/categories/${catId}`)
      .then(res => {
        if (!res.ok) throw new Error('Category not found');
        return res.json();
      })
      .then((data) => {
        setName(data.name ?? '');
        setDescription(data.description ?? '');
      })
      .catch(() => setError('Failed to load category details'))
      .finally(() => setLoading(false));
  }, [catId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/categories/${catId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim()
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/admins/assets/categories'), 1200);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update category');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="max-w-xl mx-auto bg-base-100 rounded-lg shadow p-8">
        <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Edit Category
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1 font-medium">Category Name <span className="text-error">*</span></label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">Category updated successfully!</div>}
          <div className="flex gap-3 justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Category'}
            </button>
            <button type="button" className="btn" onClick={() => router.push('/admins/assets/categories')} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
