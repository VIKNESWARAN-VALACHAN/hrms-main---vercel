'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../../../config';

interface Brand {
  name: string;
  description?: string;
  is_active: boolean;
}

export default function AddBrand() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>({ 
    name: '', 
    description: '', 
    is_active: true 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/brands`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: brand.name.trim(),
          description: (brand.description || '').trim() || null,
          is_active: brand.is_active
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create brand');
      }

      router.push('/admins/assets/brands');
      router.refresh();
    } catch (err) {
      console.error('Error creating brand:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Brand</h1>
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
            minLength={2}
            maxLength={50}
            value={brand.name}
            onChange={(e) => setBrand({ ...brand, name: e.target.value })}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Description</span>
            <span className="label-text-alt">Optional</span>
          </label>
          <textarea
            placeholder="Enter description"
            className="textarea textarea-bordered w-full"
            rows={3}
            maxLength={255}
            value={brand.description || ''}
            onChange={(e) => setBrand({ ...brand, description: e.target.value })}
          />
        </div>

        <div className="form-control mb-6">
          <label className="label cursor-pointer">
            <span className="label-text">Active Status</span>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={brand.is_active}
              onChange={(e) => setBrand({ ...brand, is_active: e.target.checked })}
            />
          </label>
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
            disabled={loading || !brand.name.trim()}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Saving...
              </>
            ) : (
              'Save Brand'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}