'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../../../config';

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [form, setForm] = useState({
    sku: '',
    name: '',
    category_id: '',
    brand_id: '',
    model_id: '',
    unit_id: '',
    min_stock: '',
    max_stock: '',
    reorder_level: '',
    description: '',
    location_id: ''
  });

  const [masters, setMasters] = useState({
    categories: [],
    brands: [],
    models: [],
    units: [],
    locations: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load master data and product details
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [
          categories,
          brands,
          models,
          units,
          locations,
          product
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/categories`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/inventory/brands`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/inventory/models`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/inventory/units`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/inventory/locations`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/inventory/products/${productId}`).then(res => res.json())
        ]);
        setMasters({ categories, brands, models, units, locations });
        setForm({
          sku: product.sku || '',
          name: product.name || '',
          category_id: product.category_id ? String(product.category_id) : '',
          brand_id: product.brand_id ? String(product.brand_id) : '',
          model_id: product.model_id ? String(product.model_id) : '',
          unit_id: product.unit_id ? String(product.unit_id) : '',
          min_stock: product.min_stock !== undefined ? String(product.min_stock) : '',
          max_stock: product.max_stock !== undefined ? String(product.max_stock) : '',
          reorder_level: product.reorder_level !== undefined ? String(product.reorder_level) : '',
          description: product.description || '',
          location_id: product.location_id ? String(product.location_id) : ''
        });
      } catch (err) {
        setError('Failed to load product or master data');
      }
      setLoading(false);
    }
    if (productId) fetchData();
  }, [productId]);

  // Form handler
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    // Simple validation
    if (!form.sku || !form.name || !form.category_id) {
      setError('SKU, Name, and Category are required.');
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          min_stock: form.min_stock ? Number(form.min_stock) : null,
          max_stock: form.max_stock ? Number(form.max_stock) : null,
          reorder_level: form.reorder_level ? Number(form.reorder_level) : null
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || 'Update failed');
        setSaving(false);
        return;
      }
      router.push('/admins/assets/products');
    } catch (err) {
      setError('Network error');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold">SKU</label>
          <input className="input input-bordered w-full" name="sku" value={form.sku} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-semibold">Name</label>
          <input className="input input-bordered w-full" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-semibold">Category</label>
          <select className="select select-bordered w-full" name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">Select</option>
            {masters.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Brand</label>
          <select className="select select-bordered w-full" name="brand_id" value={form.brand_id} onChange={handleChange}>
            <option value="">(None)</option>
            {masters.brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Model</label>
          <select className="select select-bordered w-full" name="model_id" value={form.model_id} onChange={handleChange}>
            <option value="">(None)</option>
            {masters.models.map((m: any) => <option key={m.id} value={m.id}>{m.model_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Unit</label>
          <select className="select select-bordered w-full" name="unit_id" value={form.unit_id} onChange={handleChange}>
            <option value="">(None)</option>
            {masters.units.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Min Stock</label>
          <input className="input input-bordered w-full" type="number" min={0} name="min_stock" value={form.min_stock} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-semibold">Max Stock</label>
          <input className="input input-bordered w-full" type="number" min={0} name="max_stock" value={form.max_stock} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-semibold">Reorder Level</label>
          <input className="input input-bordered w-full" type="number" min={0} name="reorder_level" value={form.reorder_level} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea className="textarea textarea-bordered w-full" name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-semibold">Location</label>
          <select className="select select-bordered w-full" name="location_id" value={form.location_id} onChange={handleChange}>
            <option value="">(None)</option>
            {masters.locations.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Link href="/admins/assets/products" className="btn btn-secondary">Cancel</Link>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
