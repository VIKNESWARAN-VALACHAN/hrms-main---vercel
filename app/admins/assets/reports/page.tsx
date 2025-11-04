// 'use client';

// import { useEffect, useState, useMemo } from 'react';
// import { API_BASE_URL } from '../../../config';
// import { saveAs } from 'file-saver'; // npm i file-saver
// import { Bar, Pie } from 'react-chartjs-2'; // npm i chart.js react-chartjs-2
// import 'chart.js/auto';

// interface Asset {
//   id: number;
//   serial_number: string;
//   product_name?: string;
//   asset_type_name?: string;
//   status_name?: string;
//   category_name?: string;
//   assigned_to_name?: string;
//   purchase_date?: string;
//   warranty_expiry?: string;
//   [key: string]: any;
// }

// export default function AssetReportsPage() {
//   const [assets, setAssets] = useState<Asset[]>([]);
//   const [stats, setStats] = useState<any>({});
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: '',
//     type: '',
//     category: '',
//     from: '',
//     to: ''
//   });

//   // For dropdown filters
//   const [statuses, setStatuses] = useState<any[]>([]);
//   const [types, setTypes] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);

//   useEffect(() => {
//     async function loadAll() {
//       setLoading(true);
//       try {
//         // Load all assets
//         const [assetsRes, statsRes, statuses, types, categories] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/inventory/assets`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/assets/stats`).then(r => r.json()).catch(() => ({})),
//           fetch(`${API_BASE_URL}/api/inventory/statuses`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/types`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/categories`).then(r => r.json())
//         ]);
//         setAssets(Array.isArray(assetsRes) ? assetsRes : []);
//         setStats(statsRes || {});
//         setStatuses(Array.isArray(statuses) ? statuses : []);
//         setTypes(Array.isArray(types) ? types : []);
//         setCategories(Array.isArray(categories) ? categories : []);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadAll();
//   }, []);

//   // Filtered assets by filters
//   const filteredAssets = useMemo(() => {
//     return assets.filter(asset => {
//       if (filters.status && String(asset.status_id) !== filters.status) return false;
//       if (filters.type && String(asset.asset_type_id) !== filters.type) return false;
//       if (filters.category && String(asset.category_id) !== filters.category) return false;
//       if (filters.from && asset.purchase_date && asset.purchase_date < filters.from) return false;
//       if (filters.to && asset.purchase_date && asset.purchase_date > filters.to) return false;
//       return true;
//     });
//   }, [assets, filters]);

//   // Grouped for chart (by type)
//   const chartDataByType = useMemo(() => {
//     const group: Record<string, number> = {};
//     filteredAssets.forEach(a => {
//       const key = a.asset_type_name || 'Unknown';
//       group[key] = (group[key] || 0) + 1;
//     });
//     return {
//       labels: Object.keys(group),
//       datasets: [{ label: 'Count', data: Object.values(group) }]
//     };
//   }, [filteredAssets]);

//   // Pie by status
//   const chartDataByStatus = useMemo(() => {
//     const group: Record<string, number> = {};
//     filteredAssets.forEach(a => {
//       const key = a.status_name || 'Unknown';
//       group[key] = (group[key] || 0) + 1;
//     });
//     return {
//       labels: Object.keys(group),
//       datasets: [{ data: Object.values(group) }]
//     };
//   }, [filteredAssets]);

//   // CSV Export
//   const handleExport = () => {
//     const headers = [
//       'Serial Number',
//       'Product Name',
//       'Type',
//       'Status',
//       'Category',
//       'Assigned To',
//       'Purchase Date',
//       'Warranty Expiry'
//     ];
//     const rows = filteredAssets.map(a => [
//       a.serial_number,
//       a.product_name,
//       a.asset_type_name,
//       a.status_name,
//       a.category_name,
//       a.assigned_to_name,
//       a.purchase_date,
//       a.warranty_expiry
//     ]);
//     const csv =
//       [headers, ...rows]
//         .map(r => r.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(','))
//         .join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     saveAs(blob, 'asset_report.csv');
//   };

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-6">Asset Reports</h1>

//       {/* Summary Widgets */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-base-100 p-4 rounded shadow">
//           <div className="font-bold text-lg">{stats.total_assets ?? assets.length}</div>
//           <div className="text-gray-500">Total Assets</div>
//         </div>
//         <div className="bg-base-100 p-4 rounded shadow">
//           <div className="font-bold text-lg">{stats.assigned_assets ?? assets.filter(a => a.assigned_to_name).length}</div>
//           <div className="text-gray-500">Assigned</div>
//         </div>
//         <div className="bg-base-100 p-4 rounded shadow">
//           <div className="font-bold text-lg">{stats.unassigned_assets ?? assets.filter(a => !a.assigned_to_name).length}</div>
//           <div className="text-gray-500">Unassigned</div>
//         </div>
//         <div className="bg-base-100 p-4 rounded shadow">
//           <div className="font-bold text-lg">{stats.expiring_soon ?? assets.filter(a => a.warranty_expiry && new Date(a.warranty_expiry) < new Date(Date.now() + 90*24*60*60*1000)).length}</div>
//           <div className="text-gray-500">Warranty Expiring &lt; 90d</div>
//         </div>
//       </div>

//       {/* Filters */}
//       <form className="flex flex-wrap gap-2 mb-4">
//         <select
//           className="select select-bordered"
//           value={filters.status}
//           onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
//         >
//           <option value="">All Status</option>
//           {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//         </select>
//         <select
//           className="select select-bordered"
//           value={filters.type}
//           onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
//         >
//           <option value="">All Type</option>
//           {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//         </select>
//         <select
//           className="select select-bordered"
//           value={filters.category}
//           onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
//         >
//           <option value="">All Category</option>
//           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>
//         <input
//           type="date"
//           className="input input-bordered"
//           value={filters.from}
//           onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
//           placeholder="From Date"
//         />
//         <input
//           type="date"
//           className="input input-bordered"
//           value={filters.to}
//           onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
//           placeholder="To Date"
//         />
//         <button
//           type="button"
//           className="btn btn-secondary"
//           onClick={handleExport}
//         >Export CSV</button>
//       </form>

//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-base-100 rounded shadow p-4">
//           <div className="font-semibold mb-2">By Type</div>
//           <Bar data={chartDataByType} />
//         </div>
//         <div className="bg-base-100 rounded shadow p-4">
//           <div className="font-semibold mb-2">By Status</div>
//           <Pie data={chartDataByStatus} />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-base-100 rounded shadow">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Serial</th>
//               <th>Product</th>
//               <th>Type</th>
//               <th>Status</th>
//               <th>Category</th>
//               <th>Assigned To</th>
//               <th>Purchase</th>
//               <th>Warranty</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAssets.map(a => (
//               <tr key={a.id}>
//                 <td>{a.serial_number}</td>
//                 <td>{a.product_name}</td>
//                 <td>{a.asset_type_name}</td>
//                 <td>{a.status_name}</td>
//                 <td>{a.category_name}</td>
//                 <td>{a.assigned_to_name}</td>
//                 <td>{a.purchase_date?.substring(0, 10)}</td>
//                 <td>{a.warranty_expiry?.substring(0, 10)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {filteredAssets.length === 0 && (
//           <div className="p-6 text-center text-gray-500">No assets found for filters.</div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '../../../config';
import { saveAs } from 'file-saver';
import { Bar, Pie } from 'react-chartjs-2';
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
      datasets: [{
        label: 'Assets by Type',
        data: Object.values(group),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
          '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#EC4899'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
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
      datasets: [{
        data: Object.values(group),
        backgroundColor: [
          '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6',
          '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#EC4899'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [filteredAssets]);

  // Chart options for better styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          }
        }
      }
    }
  };

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
    saveAs(blob, `asset_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      type: '',
      category: '',
      from: '',
      to: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-base-content/70">Loading asset reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Asset Reports & Analytics</h1>
              <p className="mt-2 text-base-content/70">
                Comprehensive overview of your asset inventory with detailed analytics
              </p>
            </div>
            <button
              onClick={handleExport}
              className="btn btn-primary btn-sm sm:btn-md"
              disabled={filteredAssets.length === 0}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-primary text-primary-content shadow-lg">
            <div className="card-body p-4 text-center">
              <div className="text-3xl font-bold">{stats.total_assets ?? assets.length}</div>
              <div className="text-primary-content/80">Total Assets</div>
            </div>
          </div>
          
          <div className="card bg-success text-success-content shadow-lg">
            <div className="card-body p-4 text-center">
              <div className="text-3xl font-bold">{stats.assigned_assets ?? assets.filter(a => a.assigned_to_name).length}</div>
              <div className="text-success-content/80">Assigned</div>
            </div>
          </div>
          
          <div className="card bg-warning text-warning-content shadow-lg">
            <div className="card-body p-4 text-center">
              <div className="text-3xl font-bold">{stats.unassigned_assets ?? assets.filter(a => !a.assigned_to_name).length}</div>
              <div className="text-warning-content/80">Unassigned</div>
            </div>
          </div>
          
          <div className="card bg-error text-error-content shadow-lg">
            <div className="card-body p-4 text-center">
              <div className="text-3xl font-bold">{stats.expiring_soon ?? assets.filter(a => a.warranty_expiry && new Date(a.warranty_expiry) < new Date(Date.now() + 90*24*60*60*1000)).length}</div>
              <div className="text-error-content/80">Warranty Expiring Soon</div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Filter Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={filters.status}
                  onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="">All Status</option>
                  {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Type</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={filters.type}
                  onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="">All Types</option>
                  {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={filters.category}
                  onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">From Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={filters.from}
                  onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">To Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={filters.to}
                  onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* By Type Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Assets by Type</h3>
              <div className="h-80">
                <Bar data={chartDataByType} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* By Status Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Assets by Status</h3>
              <div className="h-80">
                <Pie data={chartDataByStatus} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="card-title text-lg">Asset Details</h2>
              <div className="text-sm text-base-content/70 mt-2 sm:mt-0">
                Showing {filteredAssets.length} of {assets.length} assets
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm lg:table-md">
                <thead>
                  <tr className="bg-base-200">
                    <th className="font-semibold">Serial No.</th>
                    <th className="font-semibold">Product</th>
                    <th className="font-semibold">Type</th>
                    <th className="font-semibold">Status</th>
                    <th className="font-semibold">Category</th>
                    <th className="font-semibold">Assigned To</th>
                    <th className="font-semibold">Purchase Date</th>
                    <th className="font-semibold">Warranty Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map(a => (
                    <tr key={a.id} className="hover">
                      <td className="font-mono text-sm">{a.serial_number}</td>
                      <td>{a.product_name || '-'}</td>
                      <td>
                        <span className="badge badge-outline badge-sm">
                          {a.asset_type_name || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${
                          a.status_name?.toLowerCase().includes('active') ? 'badge-success' :
                          a.status_name?.toLowerCase().includes('broken') ? 'badge-error' :
                          a.status_name?.toLowerCase().includes('maintenance') ? 'badge-warning' :
                          'badge-neutral'
                        }`}>
                          {a.status_name || '-'}
                        </span>
                      </td>
                      <td>{a.category_name || '-'}</td>
                      <td>
                        {a.assigned_to_name ? (
                          <span className="badge badge-primary badge-sm">{a.assigned_to_name}</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">Unassigned</span>
                        )}
                      </td>
                      <td className="text-xs">{a.purchase_date?.substring(0, 10) || '-'}</td>
                      <td className="text-xs">
                        {a.warranty_expiry ? (
                          new Date(a.warranty_expiry) < new Date() ? (
                            <span className="text-error font-semibold">{a.warranty_expiry.substring(0, 10)}</span>
                          ) : (
                            a.warranty_expiry.substring(0, 10)
                          )
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredAssets.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-base-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-base-content/70">No assets found matching your filters</p>
                  <button onClick={clearFilters} className="btn btn-outline btn-sm mt-2">
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
