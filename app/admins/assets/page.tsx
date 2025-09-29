'use client';

import { useEffect, useState, useMemo,useCallback  } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../components/ThemeProvider';

interface Asset {
  id: number;
  serial_number: string;
  product_name?: string;
  brand_name?: string;
  model_name?: string;
  type_name?: string;
  status_name?: string;
  location_name?: string;
  category_name?: string;
  unit_name?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  description?: string;
  color?: string;
  supplier?: string;
  invoice_ref?: string;
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  assigned_department?: number | null;
  assigned_department_name?: string | null;
  assignment_start_date?: string | null;
  qr_code_url?: string | null;
}

export default function AssetList() {
  const { theme } = useTheme();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch assets
  const fetchAssets = useCallback(async () => {//async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/api/inventory/assets`;
      if (searchTerm.trim().length >= 2) {
        url += `?keyword=${encodeURIComponent(searchTerm.trim())}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch assets');
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
    }, [searchTerm]);

  //};

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAssets();
  };

  // Paging and filter logic
  const filteredAssets = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return assets.filter(a =>
      (a.serial_number || '').toLowerCase().includes(term) ||
      (a.product_name || '').toLowerCase().includes(term) ||
      (a.brand_name || '').toLowerCase().includes(term) ||
      (a.model_name || '').toLowerCase().includes(term) ||
      (a.status_name || '').toLowerCase().includes(term) ||
      (a.location_name || '').toLowerCase().includes(term) ||
      (a.description || '').toLowerCase().includes(term) ||
      (a.assigned_to_name || '').toLowerCase().includes(term) ||
      (a.assigned_department_name || '').toLowerCase().includes(term)
    );
  }, [assets, searchTerm]);
  const sortedAssets = useMemo(() => [...filteredAssets], [filteredAssets]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = sortedAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage);

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchAssets();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete asset');
    }
  };

  // Bulk Export (CSV)
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/assets`);
      if (!res.ok) throw new Error('Failed to export');
      const data: Asset[] = await res.json();
      const csv = [
        [
          'ID','Serial No','Product','Brand','Model','Type','Status','Location','Category','Unit',
          'Purchase Date','Warranty Expiry','Description','Supplier','Color','Invoice Ref',
          'Assigned To','Assigned To Name','Assigned Dept','Assigned Dept Name','Assignment Start Date'
        ].join(','),
        ...data.map(a =>
          [
            a.id, a.serial_number, a.product_name, a.brand_name, a.model_name, a.type_name,
            a.status_name, a.location_name, a.category_name, a.unit_name,
            a.purchase_date?.slice(0, 10), a.warranty_expiry?.slice(0, 10), `"${a.description ?? ''}"`,
            a.supplier, a.color, a.invoice_ref,
            a.assigned_to, a.assigned_to_name, a.assigned_department, a.assigned_department_name, a.assignment_start_date?.slice(0, 10)
          ].map(x => (x ?? '').toString().replace(/"/g, '""')).join(',')
        )
      ].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assets_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to export');
    }
    setExporting(false);
  };

  // Bulk Import Placeholder (redirect to import page)
  const handleImport = () => {
    window.location.href = '/admins/assets/import';
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      {/* Header with all links */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Asset Management</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/admins/assets/add" className="btn btn-info">+ Add Asset</Link>
          <Link href="/admins/assets/import" className="btn btn-info">Bulk Import</Link>
          <Link href="/admins/assets/export" className="btn btn-info">Export Excel</Link>
          <Link href="/admins/assets/reports" className="btn btn-info">Reports</Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search assets by serial, product, brand, model, etc."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-info" disabled={loading}>Search</button>
      </form>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Serial No</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Purchase Date</th>
              <th>Warranty Expiry</th>
              <th>Description</th>
              <th>Supplier</th>
              <th>Color</th>
              <th>Invoice Ref</th>
              <th>Assigned To</th>
              <th>Assigned To Name</th>
              <th>Assigned Dept</th>
              <th>Assigned Dept Name</th>
              <th>Assignment Start</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAssets.length > 0 ? currentAssets.map(asset => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.serial_number}</td>
                <td>{asset.product_name}</td>
                <td>{asset.brand_name}</td>
                <td>{asset.model_name}</td>
                <td>{asset.type_name}</td>
                <td>{asset.status_name}</td>
                <td>{asset.location_name}</td>
                <td>{asset.category_name}</td>
                <td>{asset.unit_name}</td>
                <td>{asset.purchase_date?.slice(0,10)}</td>
                <td>{asset.warranty_expiry?.slice(0,10)}</td>
                <td>{asset.description}</td>
                <td>{asset.supplier}</td>
                <td>{asset.color}</td>
                <td>{asset.invoice_ref}</td>
                <td>{asset.assigned_to ?? '-'}</td>
                <td>{asset.assigned_to_name ?? '-'}</td>
                <td>{asset.assigned_department ?? '-'}</td>
                <td>{asset.assigned_department_name ?? '-'}</td>
                <td>{asset.assignment_start_date ? asset.assignment_start_date.slice(0, 10) : '-'}</td>
                {/* <td className="flex flex-wrap gap-1">
                  <Link href={`/admins/assets/${asset.id}`} className="btn btn-xs btn-primary">Edit</Link>
                  <Link href={`/admins/assets/${asset.id}/assign`} className="btn btn-xs btn-info">Assign</Link>
                  <Link href={`/admins/assets/${asset.id}/return`} className="btn btn-xs btn-warning">Return</Link>
                  <Link href={`/admins/assets/${asset.id}/transfer`} className="btn btn-xs btn-accent">Transfer</Link>
                  <Link href={`/admins/assets/${asset.id}/history`} className="btn btn-xs btn-neutral">History</Link>
                  <Link href={`/admins/assets/barcode?id=${asset.id}`} className="btn btn-xs btn-success">Barcode</Link>
                  <button onClick={() => handleDelete(asset.id)} className="btn btn-xs btn-error">Delete</button>
                </td> */}
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-xs btn-info">Actions</label>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href={`/admins/assets/${asset.id}`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Edit</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/assign`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Assign</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/return`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Return</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/transfer`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Transfer</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/history`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">History</Link></li>
                        <li><Link href={`/admins/assets/barcode?id=${asset.id}`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Barcode</Link></li>
                        <li><button onClick={() => handleDelete(asset.id)} className="btn btn-xs btn-warninfoing w-full text-left justify-start">Delete</button></li>
                      </ul>
                    </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={22} className="text-center py-8">
                  {searchTerm ? 'No matching assets found' : 'No assets available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button className="join-item btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>«</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >{i + 1}</button>
            ))}
            <button className="join-item btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}
