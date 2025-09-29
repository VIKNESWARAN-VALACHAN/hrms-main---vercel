'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../../config';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    sku: '',
    name: '',
    category_id: '',
    brand_id: '',
    model_id: '',
    unit_id: '',
    location_id: '',
    min_stock: '',
    max_stock: '',
    description: '',
    status_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Dropdown master data
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  // Load master data
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory/categories`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/inventory/brands`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/inventory/models`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/inventory/units`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/inventory/locations`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/inventory/statuses`).then(res => res.json()).catch(() => []),
    ]).then(([cats, brands, models, units, locs, statuses]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setBrands(Array.isArray(brands) ? brands : []);
      setModels(Array.isArray(models) ? models : []);
      setUnits(Array.isArray(units) ? units : []);
      setLocations(Array.isArray(locs) ? locs : []);
      setStatuses(Array.isArray(statuses) ? statuses : []);
    });
  }, []);

  // Filter models by selected brand if needed
  const filteredModels = form.brand_id
    ? models.filter((m) => String(m.brand_id) === String(form.brand_id))
    : models;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'brand_id' ? { model_id: '' } : {}), // reset model if brand changes
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError(null);
    // Validate required
    if (!form.sku || !form.name || !form.category_id || !form.unit_id) {
      setFormError('SKU, Name, Category, and Unit are required.');
      return;
    }
    setLoading(true);
    const body = {
      ...form,
      min_stock: form.min_stock ? Number(form.min_stock) : 0,
      max_stock: form.max_stock ? Number(form.max_stock) : 0,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Product added!');
      router.push('/admins/assets/products');
    } catch {
      setFormError('Add product failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-base-100 rounded p-6 shadow">
        <div>
          <label className="block font-semibold mb-1">SKU *</label>
          <input
            className="input input-bordered w-full"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Name *</label>
          <input
            className="input input-bordered w-full"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category *</label>
          <select
            className="select select-bordered w-full"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Brand</label>
          <select
            className="select select-bordered w-full"
            name="brand_id"
            value={form.brand_id}
            onChange={handleChange}
          >
            <option value="">Select Brand</option>
            {brands.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Model</label>
          <select
            className="select select-bordered w-full"
            name="model_id"
            value={form.model_id}
            onChange={handleChange}
          >
            <option value="">Select Model</option>
            {filteredModels.map((m: any) => (
              <option key={m.id} value={m.id}>{m.model_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Unit *</label>
          <select
            className="select select-bordered w-full"
            name="unit_id"
            value={form.unit_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Unit</option>
            {units.map((u: any) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <select
            className="select select-bordered w-full"
            name="location_id"
            value={form.location_id}
            onChange={handleChange}
          >
            <option value="">Select Location</option>
            {locations.map((l: any) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Min Stock</label>
            <input
              className="input input-bordered w-full"
              name="min_stock"
              type="number"
              min={0}
              value={form.min_stock}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Max Stock</label>
            <input
              className="input input-bordered w-full"
              name="max_stock"
              type="number"
              min={0}
              value={form.max_stock}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <input
            className="input input-bordered w-full"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select
            className="select select-bordered w-full"
            name="status_id"
            value={form.status_id}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            {statuses.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        {formError && <div className="alert alert-error">{formError}</div>}
        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/admins/assets/products')}
            disabled={loading}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
