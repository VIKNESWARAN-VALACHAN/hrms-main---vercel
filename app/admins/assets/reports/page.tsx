'use client';

import { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '../../../config';
import { saveAs } from 'file-saver'; // npm i file-saver
import { Bar, Pie } from 'react-chartjs-2'; // npm i chart.js react-chartjs-2
import 'chart.js/auto';

interface Asset {
  id: number;
  serial_number: string;
  product_name?: string;
  asset_type_name?: string;
  status_name?: string;
  category_name?: string;
  assigned_to_name?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  [key: string]: any;
}

export default function AssetReportsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    category: '',
    from: '',
    to: ''
  });

  // For dropdown filters
  const [statuses, setStatuses] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        // Load all assets
        const [assetsRes, statsRes, statuses, types, categories] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/assets`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/assets/stats`).then(r => r.json()).catch(() => ({})),
          fetch(`${API_BASE_URL}/api/inventory/statuses`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/types`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/categories`).then(r => r.json())
        ]);
        setAssets(Array.isArray(assetsRes) ? assetsRes : []);
        setStats(statsRes || {});
        setStatuses(Array.isArray(statuses) ? statuses : []);
        setTypes(Array.isArray(types) ? types : []);
        setCategories(Array.isArray(categories) ? categories : []);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // Filtered assets by filters
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (filters.status && String(asset.status_id) !== filters.status) return false;
      if (filters.type && String(asset.asset_type_id) !== filters.type) return false;
      if (filters.category && String(asset.category_id) !== filters.category) return false;
      if (filters.from && asset.purchase_date && asset.purchase_date < filters.from) return false;
      if (filters.to && asset.purchase_date && asset.purchase_date > filters.to) return false;
      return true;
    });
  }, [assets, filters]);

  // Grouped for chart (by type)
  const chartDataByType = useMemo(() => {
    const group: Record<string, number> = {};
    filteredAssets.forEach(a => {
      const key = a.asset_type_name || 'Unknown';
      group[key] = (group[key] || 0) + 1;
    });
    return {
      labels: Object.keys(group),
      datasets: [{ label: 'Count', data: Object.values(group) }]
    };
  }, [filteredAssets]);

  // Pie by status
  const chartDataByStatus = useMemo(() => {
    const group: Record<string, number> = {};
    filteredAssets.forEach(a => {
      const key = a.status_name || 'Unknown';
      group[key] = (group[key] || 0) + 1;
    });
    return {
      labels: Object.keys(group),
      datasets: [{ data: Object.values(group) }]
    };
  }, [filteredAssets]);

  // CSV Export
  const handleExport = () => {
    const headers = [
      'Serial Number',
      'Product Name',
      'Type',
      'Status',
      'Category',
      'Assigned To',
      'Purchase Date',
      'Warranty Expiry'
    ];
    const rows = filteredAssets.map(a => [
      a.serial_number,
      a.product_name,
      a.asset_type_name,
      a.status_name,
      a.category_name,
      a.assigned_to_name,
      a.purchase_date,
      a.warranty_expiry
    ]);
    const csv =
      [headers, ...rows]
        .map(r => r.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'asset_report.csv');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Asset Reports</h1>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-base-100 p-4 rounded shadow">
          <div className="font-bold text-lg">{stats.total_assets ?? assets.length}</div>
          <div className="text-gray-500">Total Assets</div>
        </div>
        <div className="bg-base-100 p-4 rounded shadow">
          <div className="font-bold text-lg">{stats.assigned_assets ?? assets.filter(a => a.assigned_to_name).length}</div>
          <div className="text-gray-500">Assigned</div>
        </div>
        <div className="bg-base-100 p-4 rounded shadow">
          <div className="font-bold text-lg">{stats.unassigned_assets ?? assets.filter(a => !a.assigned_to_name).length}</div>
          <div className="text-gray-500">Unassigned</div>
        </div>
        <div className="bg-base-100 p-4 rounded shadow">
          <div className="font-bold text-lg">{stats.expiring_soon ?? assets.filter(a => a.warranty_expiry && new Date(a.warranty_expiry) < new Date(Date.now() + 90*24*60*60*1000)).length}</div>
          <div className="text-gray-500">Warranty Expiring &lt; 90d</div>
        </div>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-2 mb-4">
        <select
          className="select select-bordered"
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Status</option>
          {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          className="select select-bordered"
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
        >
          <option value="">All Type</option>
          {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select
          className="select select-bordered"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
        >
          <option value="">All Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          type="date"
          className="input input-bordered"
          value={filters.from}
          onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
          placeholder="From Date"
        />
        <input
          type="date"
          className="input input-bordered"
          value={filters.to}
          onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
          placeholder="To Date"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleExport}
        >Export CSV</button>
      </form>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-base-100 rounded shadow p-4">
          <div className="font-semibold mb-2">By Type</div>
          <Bar data={chartDataByType} />
        </div>
        <div className="bg-base-100 rounded shadow p-4">
          <div className="font-semibold mb-2">By Status</div>
          <Pie data={chartDataByStatus} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Product</th>
              <th>Type</th>
              <th>Status</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Purchase</th>
              <th>Warranty</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(a => (
              <tr key={a.id}>
                <td>{a.serial_number}</td>
                <td>{a.product_name}</td>
                <td>{a.asset_type_name}</td>
                <td>{a.status_name}</td>
                <td>{a.category_name}</td>
                <td>{a.assigned_to_name}</td>
                <td>{a.purchase_date?.substring(0, 10)}</td>
                <td>{a.warranty_expiry?.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssets.length === 0 && (
          <div className="p-6 text-center text-gray-500">No assets found for filters.</div>
        )}
      </div>
    </div>
  );
}
