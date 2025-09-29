'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

interface Brand {
  id: number;
  name: string;
}

export default function BrandConfigPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrand, setNewBrand] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/master/brands`);
      const data = await res.json();
      setBrands(data);
    } catch {
      toast.error('Failed to load brands');
    }
  };

  const handleAdd = async () => {
    if (!newBrand.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/master/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrand.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success('Brand added');
      setNewBrand('');
      fetchBrands();
    } catch {
      toast.error('Failed to add brand');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/inventory/master/brands/${id}`, {
        method: 'DELETE',
      });
      toast.success('Deleted');
      fetchBrands();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/master/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success('Updated');
      setEditingId(null);
      fetchBrands();
    } catch {
      toast.error('Update failed');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Manage Brands</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="input input-bordered flex-1"
          placeholder="New brand name"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Add
        </button>
      </div>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
<tbody>
  {brands.map((brand, index) => (
    <tr key={`brand-${index}`}>
      <td>{index + 1}</td> {/* Show index as ID */}
      <td>
        {editingId === index ? (
          <input
            className="input input-sm"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
        ) : (
          brand.name
        )}
      </td>
      <td>
        {editingId === index ? (
          <>
            <button
              className="btn btn-sm btn-success mr-2"
              onClick={() => handleEdit(index)}
            >
              Save
            </button>
            <button
              className="btn btn-sm"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-sm btn-info mr-2"
              onClick={() => {
                setEditingId(index);
                setEditingName(brand.name);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>


      </table>
    </div>
  );
}
