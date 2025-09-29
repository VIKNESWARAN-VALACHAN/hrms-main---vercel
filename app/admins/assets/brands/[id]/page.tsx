'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../../../config';

interface Brand {
  id?: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export default function EditBrand() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [brand, setBrand] = useState<Brand>({ 
    name: '', 
    description: null, 
    is_active: true 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/inventory/brands/${params.id}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to fetch brand');
          }
          return res.json();
        })
        .then((data) => {
          setBrand({
            ...data,
            description: data.description || null,
            is_active: data.is_active !== false // Convert to boolean
          });
        })
        .catch((err) => {
          setError(err.message);
          console.error('Fetch error:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/brands/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brand.name,
          description: brand.description || null, // Send null if empty
          is_active: brand.is_active !== false // Ensure boolean
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update brand');
      }

      router.push('/admins/assets/brands');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !brand.id) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Brand</h1>
        <Link 
          href="/admins/assets/brands" 
          className="btn btn-ghost"
        >
          Back to List
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6 max-w-2xl mx-auto">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Brand Name</span>
            <span className="label-text-alt text-error">* Required</span>
          </label>
          <input
            type="text"
            placeholder="Enter brand name"
            className="input input-bordered w-full"
            required
            value={brand.name}
            onChange={(e) => setBrand({ ...brand, name: e.target.value })}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            placeholder="Enter description (optional)"
            className="textarea textarea-bordered w-full"
            rows={3}
            value={brand.description || ''}
            onChange={(e) => setBrand({ 
              ...brand, 
              description: e.target.value || null 
            })}
          />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={brand.is_active ? '1' : '0'}
            onChange={(e) => setBrand({ 
              ...brand, 
              is_active: e.target.value === '1' 
            })}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/admins/assets/brands')}
            className="btn btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Updating...
              </>
            ) : (
              'Update Brand'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}