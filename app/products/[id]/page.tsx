'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, API_ROUTES } from '../../config';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}${API_ROUTES.products}/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch(() => toast.error('Failed to load product'));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}${API_ROUTES.products}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      toast.success('Product updated');
      router.push('/products');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
    try {
      await fetch(`${API_BASE_URL}${API_ROUTES.products}/${id}`, {
        method: 'DELETE',
      });
      toast.success('Product deleted');
      router.push('/products');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li className="font-semibold">Edit Product</li>
        </ul>
      </nav>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-6 rounded-lg shadow">
        <input name="sku" value={product.sku} onChange={handleChange} className="input input-bordered" placeholder="SKU" required />
        <input name="name" value={product.name} onChange={handleChange} className="input input-bordered" placeholder="Name" required />
        <input name="category" value={product.category} onChange={handleChange} className="input input-bordered" placeholder="Category" />
        <input name="brand" value={product.brand} onChange={handleChange} className="input input-bordered" placeholder="Brand" />
        <input name="model" value={product.model} onChange={handleChange} className="input input-bordered" placeholder="Model" />
        <input name="unit" value={product.unit} onChange={handleChange} className="input input-bordered" placeholder="Unit (e.g. pcs)" />
        <input type="number" name="min_stock" value={product.min_stock} onChange={handleChange} className="input input-bordered" placeholder="Min Stock" />
        <input type="number" name="max_stock" value={product.max_stock} onChange={handleChange} className="input input-bordered" placeholder="Max Stock" />
        <input type="number" name="reorder_level" value={product.reorder_level} onChange={handleChange} className="input input-bordered" placeholder="Reorder Level" />
        <input name="storage_location" value={product.storage_location} onChange={handleChange} className="input input-bordered" placeholder="Storage Location" />
        <textarea name="description" value={product.description} onChange={handleChange} className="textarea textarea-bordered md:col-span-2" placeholder="Description" />

        <div className="md:col-span-2 flex justify-between gap-4">
          <Link href="/products" className="btn btn-ghost">Back</Link>
          <div className="flex gap-2">
            <button type="button" onClick={handleDelete} className="btn btn-error">Delete</button>
            <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`}>Update Product</button>
          </div>
        </div>
      </form>
    </div>
  );
}
