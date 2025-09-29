'use client';

import { useEffect, useState, useCallback  } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { API_BASE_URL, API_ROUTES } from '../../config';

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
  assigned_at?: string;
}

interface AssetGroup {
  id: number;
  name: string;
  description: string;
  created_at: string;
  asset_count: number;
  assets: Asset[];
}

export default function AssetGroupDetailPage() {
  const params = useParams();
  const groupId = params?.id;
  const [group, setGroup] = useState<AssetGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupDetails = useCallback(async () => {//async () => {
    if (!groupId) {
      setError('Group ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.assetGroups}/${groupId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error('No data received');
      }
      
      setGroup(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load group details');
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [groupId]);
    //};

  const handleReturn = async (assetId: number) => {
    if (!groupId) return;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.assetGroups}/${groupId}/return/${assetId}`, 
        { method: 'POST' }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to return asset: ${response.status}`);
      }
      
      toast.success('Asset returned successfully');
      fetchGroupDetails(); // Refresh the data
    } catch (err) {
      console.error('Return error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to return asset');
    }
  };

  const getStatusBadge = (statusId: number) => {
    const statusMap = {
      1: { label: 'In Use', className: 'badge-success' },
      2: { label: 'In Stock', className: 'badge-primary' },
      3: { label: 'Under Repair', className: 'badge-warning' },
      4: { label: 'Scrapped', className: 'badge-error' },
    };
    
    return (
      <span className={`badge ${statusMap[statusId as keyof typeof statusMap]?.className || 'badge-ghost'}`}>
        {statusMap[statusId as keyof typeof statusMap]?.label || 'Unknown'}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);
    //}, [groupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button className="btn btn-sm" onClick={fetchGroupDetails}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Group not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/asset-groups">Asset Groups</Link></li>
          <li className="font-semibold">{group.name}</li>
        </ul>
      </nav>

      <div className="mb-6">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            {group.description && <p className="text-gray-600 mt-1">{group.description}</p>}
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <span className="badge badge-outline">
                {group.asset_count} {group.asset_count === 1 ? 'asset' : 'assets'}
              </span>
              <span className="text-sm text-gray-500">
                Created: {formatDate(group.created_at)}
              </span>
            </div>
          </div>
          <Link 
            href={`/asset-groups/${groupId}/assign`} 
            className="btn btn-primary"
          >
            Assign Asset
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Status</th>
              <th>Warranty</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {group.assets.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No assets assigned to this group
                </td>
              </tr>
            ) : (
              group.assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.serial_number}</td>
                  <td>{asset.brand}</td>
                  <td>{asset.model}</td>
                  <td>{getStatusBadge(asset.status_id)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      {formatDate(asset.warranty_expiry)}
                      {asset.warranty_expiry && new Date(asset.warranty_expiry) < new Date() && (
                        <span className="badge badge-error">Expired</span>
                      )}
                    </div>
                  </td>
                  <td className="text-right">
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleReturn(asset.id)}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}