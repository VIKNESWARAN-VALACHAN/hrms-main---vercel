'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';

interface Product {
  id: number;
  sku: string;
  name: string;
  category_name?: string;
  brand_name?: string;
  model_name?: string;
  unit_name?: string;
  location_name?: string;
  min_stock?: number;
  max_stock?: number;
  description?: string;
  status_name?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/inventory/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!keyword) {
      setFiltered(products);
    } else {
      const k = keyword.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.name?.toLowerCase().includes(k) ||
            p.sku?.toLowerCase().includes(k)
        )
      );
    }
  }, [keyword, products]);

  const handleExport = () => {
    window.open(`${API_BASE_URL}/api/inventory/stock/export`, '_blank');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/stock/import`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Import failed');
      toast.success('Import successful');
      // re-fetch products after import
      const data = await fetch(`${API_BASE_URL}/api/inventory/products`).then(r=>r.json());
      setProducts(Array.isArray(data) ? data : []);
      setFiltered(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Import failed');
    }
    setImporting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`${API_BASE_URL}/api/inventory/products/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('Deleted');
      setProducts(products.filter((p) => p.id !== id));
      setFiltered(filtered.filter((p) => p.id !== id));
    } else {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admins/assets/products/add" className="btn btn-primary">
          + Add Product
        </Link>
      </div>
      <div className="flex items-center mb-4 gap-2">
        <input
          className="input input-bordered w-full max-w-xs"
          placeholder="Search product name or SKU..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn btn-outline" onClick={() => setKeyword('')}>
          Clear
        </button>
        <button className="btn btn-outline ml-2" onClick={handleExport}>
          Export
        </button>
        <label className="btn btn-outline ml-2">
          Import
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            disabled={importing}
            onChange={handleImport}
          />
        </label>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Unit</th>
                <th>Location</th>
                <th>Min</th>
                <th>Max</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-8">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.category_name}</td>
                    <td>{p.brand_name}</td>
                    <td>{p.model_name}</td>
                    <td>{p.unit_name}</td>
                    <td>{p.location_name}</td>
                    <td>{p.min_stock}</td>
                    <td>{p.max_stock}</td>
                    <td className="max-w-xs truncate">{p.description}</td>
                    <td>{p.status_name}</td>
                    <td className="flex gap-1 justify-center">
                      <Link
                        href={`/admins/assets/products/${p.id}`}
                        className="btn btn-xs btn-info"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
