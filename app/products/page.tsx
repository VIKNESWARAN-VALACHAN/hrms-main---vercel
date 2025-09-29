// app/products/page.tsx
'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  unit: string;
  min_stock: number;
  max_stock: number;
  reorder_level: number;
  description: string;
  storage_location: string;
  created_at: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/inventory/products`);
      const data = await res.json();
      setProducts(data || []);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
    try {
      await fetch(`${API_BASE_URL}/api/inventory/products/${id}`, { method: 'DELETE' });
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(p => 
    (p.name + p.sku + p.brand + p.model).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>
        <div className="flex gap-2">
          <Link href="/products/add" className="btn btn-primary">Add Product</Link>
          <Link href="/inventory/import-export" className="btn btn-outline">Import/Export</Link>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered w-full mb-4"
      />

      {loading ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Stock Levels</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center">No products found.</td></tr>
              ) : (
                filtered.map(p => (
                  <Fragment key={p.id}>
                    <tr className="hover cursor-pointer" onClick={() => toggleExpand(p.id)}>
                      <td>{p.sku}</td>
                      <td>{p.name}</td>
                      <td>{p.brand}</td>
                      <td>{p.model}</td>
                      <td>{p.category}</td>
                      <td>{p.unit}</td>
                      <td>
                        <div className="flex flex-col">
                          <span>Min: {p.min_stock}</span>
                          <span>Max: {p.max_stock}</span>
                          <span>Reorder: {p.reorder_level}</span>
                        </div>
                      </td>
                      <td className="text-right space-x-2">
                        <Link href={`/products/${p.id}`} className="btn btn-sm btn-info">View</Link>
                        <Link href={`/products/${p.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                        <button className="btn btn-sm btn-error" onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}>Delete</button>
                      </td>
                    </tr>
                    {expandedProduct === p.id && (
                      <tr>
                        <td colSpan={8}>
                          <div className="bg-base-200 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-bold">Description</h3>
                                <p>{p.description}</p>
                              </div>
                              <div>
                                <h3 className="font-bold">Storage Location</h3>
                                <p>{p.storage_location}</p>
                                <h3 className="font-bold mt-2">Created At</h3>
                                <p>{new Date(p.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}