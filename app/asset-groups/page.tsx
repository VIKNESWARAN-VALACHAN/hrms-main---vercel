'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, API_ROUTES } from '../config';

interface Asset {
  id: number;
  serial_number: string;
  brand: string;
  model: string;
  status_id: number;
  location: string;
  purchase_date: string;
  warranty_expiry: string;
  assigned_to: string | null;
  assigned_department: string | null;
}

interface AssetGroup {
  id: number;
  name: string;
  asset_count: number;
  assets: Asset[];
}

export default function AssetGroupListPage() {
  const [groups, setGroups] = useState<AssetGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      //http://localhost:5001/api/inventory/asset-groups
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.assets}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      console.error('Error fetching asset groups:', err);
      setError('Failed to load asset groups');
      toast.error('Failed to load asset groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset group?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/asset-groups/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete group');
      }
      
      toast.success('Asset group deleted successfully');
      fetchGroups(); // Refresh the list
    } catch (err) {
      console.error('Error deleting asset group:', err);
      toast.error('Failed to delete asset group');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedGroup(expandedGroup === id ? null : id);
  };

  const getStatusBadge = (statusId: number) => {
    const statusMap = {
      1: { label: 'In Use', className: 'badge-success' },
      2: { label: 'In Stock', className: 'badge-primary' },
      3: { label: 'Under Repair', className: 'badge-warning' },
      4: { label: 'Scrapped', className: 'badge-error' },
    };
    
    const status = statusMap[statusId as keyof typeof statusMap] || { label: 'Unknown', className: 'badge-ghost' };
    return <span className={`badge ${status.className}`}>{status.label}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button className="btn btn-sm" onClick={fetchGroups}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li className="font-semibold">Asset Groups</li>
        </ul>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Asset Groups</h1>
        <Link href="/asset-groups/add" className="btn btn-primary">
          Create Group
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading asset groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-10">
          <p>No asset groups found.</p>
          <button className="btn btn-sm mt-4" onClick={fetchGroups}>
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="card bg-base-100 shadow-lg">
              <div 
                className="card-body p-4 hover:bg-base-200 cursor-pointer transition-colors"
                onClick={() => toggleExpand(group.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-lg">{group.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-outline">
                        {group.asset_count} {group.asset_count === 1 ? 'asset' : 'assets'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/asset-groups/${group.id}`}
                      className="btn btn-sm btn-info"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details
                    </Link>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(group.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {expandedGroup === group.id && (
                  <div className="mt-4">
                    <div className="divider my-2"></div>
                    <h3 className="font-semibold mb-2">Assets in this group:</h3>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Serial</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Status</th>
                            <th>Warranty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.assets.map((asset) => (
                            <tr key={asset.id}>
                              <td>{asset.serial_number}</td>
                              <td>{asset.brand}</td>
                              <td>{asset.model}</td>
                              <td>{getStatusBadge(asset.status_id)}</td>
                              <td>
                                <div className="flex items-center gap-2">
                                  {formatDate(asset.warranty_expiry)}
                                  {new Date(asset.warranty_expiry) < new Date() && (
                                    <span className="badge badge-error">Expired</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}