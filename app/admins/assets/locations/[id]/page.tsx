'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { useTheme } from '../../../../components/ThemeProvider';

export default function EditLocation() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const locationId = params?.id as string;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/inventory/locations/${locationId}`)
      .then(res => {
        if (!res.ok) throw new Error('Location not found');
        return res.json();
      })
      .then((data) => {
        setName(data.name ?? '');
        setDescription(data.description ?? '');
        setIsActive(data.is_active === 1 || data.is_active === true);
      })
      .catch(() => setError('Failed to load location details'))
      .finally(() => setLoading(false));
  }, [locationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Location name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/locations/${locationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          is_active: isActive ? 1 : 0
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/admins/assets/locations'), 1200);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update location');
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
          Edit Location
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1 font-medium">Location Name <span className="text-error">*</span></label>
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
          {success && <div className="alert alert-success">Location updated successfully!</div>}
          <div className="flex gap-3 justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Location'}
            </button>
            <button type="button" className="btn" onClick={() => router.push('/admins/assets/locations')} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
