'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, API_ROUTES } from '../config';

interface ProductFormData {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  storage_location: string;
  description: string;
  unit: string;
  min_stock: string;
  max_stock: string;
  reorder_level: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    brand: '',
    model: '',
    category: '',
    storage_location: '',
    description: '',
    unit: '',
    min_stock: '',
    max_stock: '',
    reorder_level: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.products}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          min_stock: Number(formData.min_stock),
          max_stock: Number(formData.max_stock),
          reorder_level: Number(formData.reorder_level)
        }),
      });
      if (!response.ok) throw new Error();
      toast.success('Product added');
      router.push('/products');
    } catch {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li className="font-semibold">Add Product</li>
        </ul>
      </nav>

      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-6 rounded-lg shadow-lg">
        <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="input input-bordered" required />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input input-bordered" required />
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="input input-bordered" />
        <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model" className="input input-bordered" />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input input-bordered" />
        <input type="text" name="storage_location" value={formData.storage_location} onChange={handleChange} placeholder="Storage Location" className="input input-bordered" />
        <input type="text" name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit (e.g. pcs)" className="input input-bordered" />
        <input type="number" name="min_stock" value={formData.min_stock} onChange={handleChange} placeholder="Min Stock" className="input input-bordered" />
        <input type="number" name="max_stock" value={formData.max_stock} onChange={handleChange} placeholder="Max Stock" className="input input-bordered" />
        <input type="number" name="reorder_level" value={formData.reorder_level} onChange={handleChange} placeholder="Reorder Level" className="input input-bordered" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="textarea textarea-bordered md:col-span-2"></textarea>

        <div className="md:col-span-2 flex justify-end gap-3">
          <Link href="/products" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}