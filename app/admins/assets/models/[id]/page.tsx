'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { useTheme } from '../../../../components/ThemeProvider';

interface Brand {
  id: number;
  name: string;
}

interface AssetModel {
  id: number;
  model_name: string;
  brand_id: number;
  description?: string | null;
  is_active?: boolean | number | null;
}

export default function EditModel() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const modelId = params?.id as string;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [brandId, setBrandId] = useState<number | ''>('');
  const [modelName, setModelName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load brands and model data
  useEffect(() => {
    // Fetch brands
    fetch(`${API_BASE_URL}/api/inventory/brands`)
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(() => setBrands([]))
      .finally(() => setLoadingBrands(false));

    // Fetch model details
    fetch(`${API_BASE_URL}/api/inventory/models/${modelId}`)
      .then(res => {
        if (!res.ok) throw new Error('Model not found');
        return res.json();
      })
      .then((data: AssetModel) => {
        setModelName(data.model_name ?? '');
        setBrandId(data.brand_id ?? '');
        setDescription(data.description ?? '');
        setIsActive(data.is_active === 1 || data.is_active === true);
      })
      .catch(() => setError('Failed to load model details'))
      .finally(() => setLoading(false));
  }, [modelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!modelName.trim()) {
      setError('Model name is required');
      return;
    }
    if (!brandId) {
      setError('Please select a brand');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/models/${modelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modelName.trim(),
          brand_id: brandId,
          description: description.trim() || null,
          is_active: isActive ? 1 : 0
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/admins/assets/models'), 1200);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update model');
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
          Edit Model
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1 font-medium">Brand <span className="text-error">*</span></label>
            <select
              className="input input-bordered w-full"
              value={brandId}
              onChange={e => setBrandId(Number(e.target.value))}
              required
              disabled={loadingBrands}
            >
              <option value="">Select a brand</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Model Name <span className="text-error">*</span></label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={modelName}
              onChange={e => setModelName(e.target.value)}
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
          {error && (
            <div className="alert alert-error">{error}</div>
          )}
          {success && (
            <div className="alert alert-success">Model updated successfully!</div>
          )}
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update Model'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => router.push('/admins/assets/models')}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
