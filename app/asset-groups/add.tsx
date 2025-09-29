'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, API_ROUTES } from '../config';

interface Asset {
  id: number;
  serial_number: string;
  brand: string;
  model: string;
  location: string;
}

export default function AddAssetGroupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [owner, setOwner] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnassignedAssets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/assets/unassigned`);
      const data = await res.json();
      setAssets(data);
    } catch {
      toast.error('Failed to load assets');
    }
  };

  const toggleAsset = (id: number) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Group name is required');

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/asset-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          owner,
          department,
          asset_ids: selectedAssetIds,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success('Group created');
      router.push('/asset-groups');
    } catch {
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnassignedAssets();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/asset-groups">Asset Groups</Link></li>
          <li className="font-semibold">Add</li>
        </ul>
      </nav>

      <h1 className="text-2xl font-bold mb-4">Create Asset Group</h1>

      <div className="grid gap-4 max-w-xl mb-6">
        <input
          className="input input-bordered"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <textarea
          className="textarea textarea-bordered"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <h2 className="text-lg font-semibold mb-2">Assign Assets</h2>

      <div className="overflow-x-auto mb-6">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Serial</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={5}>No available assets.</td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAssetIds.includes(asset.id)}
                      onChange={() => toggleAsset(asset.id)}
                      className="checkbox"
                    />
                  </td>
                  <td>{asset.serial_number}</td>
                  <td>{asset.brand}</td>
                  <td>{asset.model}</td>
                  <td>{asset.location}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        className={`btn btn-primary ${loading ? 'loading' : ''}`}
        onClick={handleSubmit}
        disabled={loading}
      >
        Create Group
      </button>
    </div>
  );
}
