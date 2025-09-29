'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { useTheme } from '../../../../components/ThemeProvider';

export default function AddType() {
  const { theme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Type name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          is_active: isActive ? 1 : 0
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/admins/assets/types'), 1200);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add type');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className="max-w-xl mx-auto bg-base-100 rounded-lg shadow p-8">
        <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Add Type
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1 font-medium">Type Name <span className="text-error">*</span></label>
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
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              className="input input-bordered w-full"
              value={isActive ? '1' : '0'}
              onChange={e => setIsActive(e.target.value === '1')}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">Type added successfully!</div>}
          <div className="flex gap-3 justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Add Type'}
            </button>
            <button type="button" className="btn" onClick={() => router.push('/admins/assets/types')} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
