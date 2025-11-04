// // 'use client';

// // import { useEffect, useState, useMemo,useCallback  } from 'react';
// // import Link from 'next/link';
// // import { API_BASE_URL } from '../../config';
// // import { useTheme } from '../../components/ThemeProvider';

// // interface Asset {
// //   id: number;
// //   serial_number: string;
// //   product_name?: string;
// //   brand_name?: string;
// //   model_name?: string;
// //   type_name?: string;
// //   status_name?: string;
// //   location_name?: string;
// //   category_name?: string;
// //   unit_name?: string;
// //   purchase_date?: string;
// //   warranty_expiry?: string;
// //   description?: string;
// //   color?: string;
// //   supplier?: string;
// //   invoice_ref?: string;
// //   assigned_to?: number | null;
// //   assigned_to_name?: string | null;
// //   assigned_department?: number | null;
// //   assigned_department_name?: string | null;
// //   assignment_start_date?: string | null;
// //   qr_code_url?: string | null;
// // }

// // export default function AssetList() {
// //   const { theme } = useTheme();
// //   const [assets, setAssets] = useState<Asset[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage] = useState(15);
// //   const [importing, setImporting] = useState(false);
// //   const [exporting, setExporting] = useState(false);

// //   // Fetch assets
// //   const fetchAssets = useCallback(async () => {//async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       let url = `${API_BASE_URL}/api/inventory/assets`;
// //       if (searchTerm.trim().length >= 2) {
// //         url += `?keyword=${encodeURIComponent(searchTerm.trim())}`;
// //       }
// //       const res = await fetch(url);
// //       if (!res.ok) throw new Error('Failed to fetch assets');
// //       const data = await res.json();
// //       setAssets(Array.isArray(data) ? data : []);
// //     } catch (e: any) {
// //       setError(e?.message || 'Failed to fetch assets');
// //     } finally {
// //       setLoading(false);
// //     }
// //     }, [searchTerm]);

// //   //};

// //   useEffect(() => { fetchAssets(); }, [fetchAssets]);

// //   // Handle search
// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setCurrentPage(1);
// //     fetchAssets();
// //   };

// //   // Paging and filter logic
// //   const filteredAssets = useMemo(() => {
// //     const term = searchTerm.toLowerCase();
// //     return assets.filter(a =>
// //       (a.serial_number || '').toLowerCase().includes(term) ||
// //       (a.product_name || '').toLowerCase().includes(term) ||
// //       (a.brand_name || '').toLowerCase().includes(term) ||
// //       (a.model_name || '').toLowerCase().includes(term) ||
// //       (a.status_name || '').toLowerCase().includes(term) ||
// //       (a.location_name || '').toLowerCase().includes(term) ||
// //       (a.description || '').toLowerCase().includes(term) ||
// //       (a.assigned_to_name || '').toLowerCase().includes(term) ||
// //       (a.assigned_department_name || '').toLowerCase().includes(term)
// //     );
// //   }, [assets, searchTerm]);
// //   const sortedAssets = useMemo(() => [...filteredAssets], [filteredAssets]);
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentAssets = sortedAssets.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(sortedAssets.length / itemsPerPage);

// //   // Delete handler
// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Are you sure you want to delete this asset?')) return;
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${id}`, { method: 'DELETE' });
// //       if (!res.ok) throw new Error('Delete failed');
// //       fetchAssets();
// //     } catch (e: any) {
// //       setError(e?.message || 'Failed to delete asset');
// //     }
// //   };

// //   // Bulk Export (CSV)
// //   const handleExport = async () => {
// //     setExporting(true);
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/inventory/assets`);
// //       if (!res.ok) throw new Error('Failed to export');
// //       const data: Asset[] = await res.json();
// //       const csv = [
// //         [
// //           'ID','Serial No','Product','Brand','Model','Type','Status','Location','Category','Unit',
// //           'Purchase Date','Warranty Expiry','Description','Supplier','Color','Invoice Ref',
// //           'Assigned To','Assigned To Name','Assigned Dept','Assigned Dept Name','Assignment Start Date'
// //         ].join(','),
// //         ...data.map(a =>
// //           [
// //             a.id, a.serial_number, a.product_name, a.brand_name, a.model_name, a.type_name,
// //             a.status_name, a.location_name, a.category_name, a.unit_name,
// //             a.purchase_date?.slice(0, 10), a.warranty_expiry?.slice(0, 10), `"${a.description ?? ''}"`,
// //             a.supplier, a.color, a.invoice_ref,
// //             a.assigned_to, a.assigned_to_name, a.assigned_department, a.assigned_department_name, a.assignment_start_date?.slice(0, 10)
// //           ].map(x => (x ?? '').toString().replace(/"/g, '""')).join(',')
// //         )
// //       ].join('\r\n');
// //       const blob = new Blob([csv], { type: 'text/csv' });
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = `assets_${new Date().toISOString().slice(0,10)}.csv`;
// //       a.click();
// //       window.URL.revokeObjectURL(url);
// //     } catch (e) {
// //       alert('Failed to export');
// //     }
// //     setExporting(false);
// //   };

// //   // Bulk Import Placeholder (redirect to import page)
// //   const handleImport = () => {
// //     window.location.href = '/admins/assets/import';
// //   };

// //   if (loading) {
// //     return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
// //   }

// //   return (
// //     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
// //       {/* Header with all links */}
// //       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
// //         <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Asset Management</h1>
// //         <div className="flex gap-2 flex-wrap">
// //           <Link href="/admins/assets/add" className="btn btn-info">+ Add Asset</Link>
// //           <Link href="/admins/assets/import" className="btn btn-info">Bulk Import</Link>
// //           <Link href="/admins/assets/export" className="btn btn-info">Export Excel</Link>
// //           <Link href="/admins/assets/reports" className="btn btn-info">Reports</Link>
// //         </div>
// //       </div>

// //       {/* Search */}
// //       <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search assets by serial, product, brand, model, etc."
// //           className="input input-bordered w-full"
// //           value={searchTerm}
// //           onChange={e => setSearchTerm(e.target.value)}
// //         />
// //         <button type="submit" className="btn btn-info" disabled={loading}>Search</button>
// //       </form>

// //       {error && <div className="alert alert-error mb-4">{error}</div>}

// //       <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
// //         <table className="table w-full">
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>Serial No</th>
// //               <th>Product</th>
// //               <th>Brand</th>
// //               <th>Model</th>
// //               <th>Type</th>
// //               <th>Status</th>
// //               <th>Location</th>
// //               <th>Category</th>
// //               <th>Unit</th>
// //               <th>Purchase Date</th>
// //               <th>Warranty Expiry</th>
// //               <th>Description</th>
// //               <th>Supplier</th>
// //               <th>Color</th>
// //               <th>Invoice Ref</th>
// //               <th>Assigned To</th>
// //               <th>Assigned To Name</th>
// //               <th>Assigned Dept</th>
// //               <th>Assigned Dept Name</th>
// //               <th>Assignment Start</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {currentAssets.length > 0 ? currentAssets.map(asset => (
// //               <tr key={asset.id}>
// //                 <td>{asset.id}</td>
// //                 <td>{asset.serial_number}</td>
// //                 <td>{asset.product_name}</td>
// //                 <td>{asset.brand_name}</td>
// //                 <td>{asset.model_name}</td>
// //                 <td>{asset.type_name}</td>
// //                 <td>{asset.status_name}</td>
// //                 <td>{asset.location_name}</td>
// //                 <td>{asset.category_name}</td>
// //                 <td>{asset.unit_name}</td>
// //                 <td>{asset.purchase_date?.slice(0,10)}</td>
// //                 <td>{asset.warranty_expiry?.slice(0,10)}</td>
// //                 <td>{asset.description}</td>
// //                 <td>{asset.supplier}</td>
// //                 <td>{asset.color}</td>
// //                 <td>{asset.invoice_ref}</td>
// //                 <td>{asset.assigned_to ?? '-'}</td>
// //                 <td>{asset.assigned_to_name ?? '-'}</td>
// //                 <td>{asset.assigned_department ?? '-'}</td>
// //                 <td>{asset.assigned_department_name ?? '-'}</td>
// //                 <td>{asset.assignment_start_date ? asset.assignment_start_date.slice(0, 10) : '-'}</td>
// //                 {/* <td className="flex flex-wrap gap-1">
// //                   <Link href={`/admins/assets/${asset.id}`} className="btn btn-xs btn-primary">Edit</Link>
// //                   <Link href={`/admins/assets/${asset.id}/assign`} className="btn btn-xs btn-info">Assign</Link>
// //                   <Link href={`/admins/assets/${asset.id}/return`} className="btn btn-xs btn-warning">Return</Link>
// //                   <Link href={`/admins/assets/${asset.id}/transfer`} className="btn btn-xs btn-accent">Transfer</Link>
// //                   <Link href={`/admins/assets/${asset.id}/history`} className="btn btn-xs btn-neutral">History</Link>
// //                   <Link href={`/admins/assets/barcode?id=${asset.id}`} className="btn btn-xs btn-success">Barcode</Link>
// //                   <button onClick={() => handleDelete(asset.id)} className="btn btn-xs btn-error">Delete</button>
// //                 </td> */}
// //                   <td>
// //                     <div className="dropdown dropdown-end">
// //                       <label tabIndex={0} className="btn btn-xs btn-info">Actions</label>
// //                       <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// //                         <li><Link href={`/admins/assets/${asset.id}`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Edit</Link></li>
// //                         <li><Link href={`/admins/assets/${asset.id}/assign`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Assign</Link></li>
// //                         <li><Link href={`/admins/assets/${asset.id}/return`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Return</Link></li>
// //                         <li><Link href={`/admins/assets/${asset.id}/transfer`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Transfer</Link></li>
// //                         <li><Link href={`/admins/assets/${asset.id}/history`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">History</Link></li>
// //                         <li><Link href={`/admins/assets/barcode?id=${asset.id}`} className="btn btn-xs btn-warninfoing w-full text-left justify-start mb-1">Barcode</Link></li>
// //                         <li><button onClick={() => handleDelete(asset.id)} className="btn btn-xs btn-warninfoing w-full text-left justify-start">Delete</button></li>
// //                       </ul>
// //                     </div>
// //                 </td>
// //               </tr>
// //             )) : (
// //               <tr>
// //                 <td colSpan={22} className="text-center py-8">
// //                   {searchTerm ? 'No matching assets found' : 'No assets available'}
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //       {totalPages > 1 && (
// //         <div className="flex justify-center mt-6">
// //           <div className="join">
// //             <button className="join-item btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>«</button>
// //             {Array.from({ length: totalPages }, (_, i) => (
// //               <button
// //                 key={i + 1}
// //                 className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
// //                 onClick={() => setCurrentPage(i + 1)}
// //               >{i + 1}</button>
// //             ))}
// //             <button className="join-item btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>»</button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// 'use client';

// import { useEffect, useState, useMemo, useCallback } from 'react';
// import Link from 'next/link';
// import { API_BASE_URL } from '../../config';
// import { useTheme } from '../../components/ThemeProvider';

// interface Asset {
//   id: number;
//   serial_number: string;
//   product_name?: string;
//   brand_name?: string;
//   model_name?: string;
//   type_name?: string;
//   status_name?: string;
//   location_name?: string;
//   category_name?: string;
//   unit_name?: string;
//   purchase_date?: string;
//   warranty_expiry?: string;
//   description?: string;
//   color?: string;
//   supplier?: string;
//   invoice_ref?: string;
//   assigned_to?: number | null;
//   assigned_to_name?: string | null;
//   assigned_department?: number | null;
//   assigned_department_name?: string | null;
//   assignment_start_date?: string | null;
//   qr_code_url?: string | null;
// }

// interface FilterOptions {
//   status: string;
//   location: string;
//   category: string;
//   assigned: string;
// }

// interface PaginationConfig {
//   currentPage: number;
//   itemsPerPage: number;
//   totalItems: number;
//   totalPages: number;
// }

// export default function AssetList() {
//   const { theme } = useTheme();
//   const [assets, setAssets] = useState<Asset[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState<keyof Asset>('id');
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//   const [filters, setFilters] = useState<FilterOptions>({
//     status: '',
//     location: '',
//     category: '',
//     assigned: ''
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
//   const [exporting, setExporting] = useState(false);
//   const [importing, setImporting] = useState(false);
//   const [pagination, setPagination] = useState<PaginationConfig>({
//     currentPage: 1,
//     itemsPerPage: 15,
//     totalItems: 0,
//     totalPages: 0
//   });

//   // Fetch assets
//   const fetchAssets = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url = `${API_BASE_URL}/api/inventory/assets`;
//       const res = await fetch(url);
//       if (!res.ok) throw new Error('Failed to fetch assets');
//       const data = await res.json();
//       setAssets(Array.isArray(data) ? data : []);
//     } catch (e: any) {
//       setError(e?.message || 'Failed to fetch assets');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAssets();
//   }, [fetchAssets]);

//   // Get unique filter values
//   const filterOptions = useMemo(() => {
//     const statuses = [...new Set(assets.map(a => a.status_name).filter(Boolean))] as string[];
//     const locations = [...new Set(assets.map(a => a.location_name).filter(Boolean))] as string[];
//     const categories = [...new Set(assets.map(a => a.category_name).filter(Boolean))] as string[];
    
//     return { statuses, locations, categories };
//   }, [assets]);

//   // Filter and sort logic
//   const filteredAndSortedAssets = useMemo(() => {
//     let filtered = assets.filter(asset => {
//       const matchesSearch = !searchTerm || 
//         (asset.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (asset.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (asset.brand_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (asset.model_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (asset.assigned_to_name || '').toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesStatus = !filters.status || asset.status_name === filters.status;
//       const matchesLocation = !filters.location || asset.location_name === filters.location;
//       const matchesCategory = !filters.category || asset.category_name === filters.category;
//       const matchesAssigned = !filters.assigned || 
//         (filters.assigned === 'assigned' && asset.assigned_to) ||
//         (filters.assigned === 'unassigned' && !asset.assigned_to);

//       return matchesSearch && matchesStatus && matchesLocation && matchesCategory && matchesAssigned;
//     });

//     // Sorting
//     filtered.sort((a, b) => {
//       const aVal = a[sortField] || '';
//       const bVal = b[sortField] || '';
      
//       if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
//       if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
//       return 0;
//     });

//     return filtered;
//   }, [assets, searchTerm, filters, sortField, sortDirection]);

//   // Update pagination when filtered assets change
//   useEffect(() => {
//     const totalItems = filteredAndSortedAssets.length;
//     const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    
//     setPagination(prev => ({
//       ...prev,
//       totalItems,
//       totalPages,
//       currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage
//     }));
//   }, [filteredAndSortedAssets, pagination.itemsPerPage]);

//   // Get current page assets
//   const currentAssets = useMemo(() => {
//     const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
//     return filteredAndSortedAssets.slice(startIndex, startIndex + pagination.itemsPerPage);
//   }, [filteredAndSortedAssets, pagination.currentPage, pagination.itemsPerPage]);

//   // Handle sort
//   const handleSort = (field: keyof Asset) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   // Handle filter change
//   const handleFilterChange = (key: keyof FilterOptions, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setFilters({ status: '', location: '', category: '', assigned: '' });
//     setSearchTerm('');
//     setPagination(prev => ({ ...prev, currentPage: 1 }));
//   };

//   // Pagination handlers
//   const goToPage = (page: number) => {
//     setPagination(prev => ({ ...prev, currentPage: page }));
//   };

//   const handleItemsPerPageChange = (newItemsPerPage: number) => {
//     setPagination(prev => ({
//       ...prev,
//       itemsPerPage: newItemsPerPage,
//       currentPage: 1
//     }));
//   };

//   // Selection handlers
//   const toggleSelectAll = () => {
//     setSelectedAssets(
//       selectedAssets.length === currentAssets.length 
//         ? [] 
//         : currentAssets.map(asset => asset.id)
//     );
//   };

//   const toggleSelectAsset = (id: number) => {
//     setSelectedAssets(prev =>
//       prev.includes(id) 
//         ? prev.filter(assetId => assetId !== id)
//         : [...prev, id]
//     );
//   };

//   // Bulk actions
//   const handleBulkDelete = async () => {
//     if (!selectedAssets.length || !confirm(`Delete ${selectedAssets.length} selected assets?`)) return;
    
//     try {
//       await Promise.all(
//         selectedAssets.map(id =>
//           fetch(`${API_BASE_URL}/api/inventory/assets/${id}`, { method: 'DELETE' })
//         )
//       );
//       setSelectedAssets([]);
//       fetchAssets();
//     } catch (e: any) {
//       setError(e?.message || 'Failed to delete assets');
//     }
//   };

//   // Delete single asset
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this asset?')) return;
//     try {
//       await fetch(`${API_BASE_URL}/api/inventory/assets/${id}`, { method: 'DELETE' });
//       fetchAssets();
//     } catch (e: any) {
//       setError(e?.message || 'Failed to delete asset');
//     }
//   };

//   // Export functionality
//   const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
//     setExporting(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/inventory/assets`);
//       if (!res.ok) throw new Error('Failed to export');
//       const data: Asset[] = await res.json();
      
//       if (format === 'csv') {
//         const csv = [
//           [
//             'ID', 'Serial No', 'Product', 'Brand', 'Model', 'Type', 'Status', 'Location', 'Category', 'Unit',
//             'Purchase Date', 'Warranty Expiry', 'Description', 'Supplier', 'Color', 'Invoice Ref',
//             'Assigned To', 'Assigned To Name', 'Assigned Dept', 'Assigned Dept Name', 'Assignment Start Date'
//           ].join(','),
//           ...data.map(a =>
//             [
//               a.id, a.serial_number, a.product_name, a.brand_name, a.model_name, a.type_name,
//               a.status_name, a.location_name, a.category_name, a.unit_name,
//               a.purchase_date?.slice(0, 10), a.warranty_expiry?.slice(0, 10), `"${a.description ?? ''}"`,
//               a.supplier, a.color, a.invoice_ref,
//               a.assigned_to, a.assigned_to_name, a.assigned_department, a.assigned_department_name, a.assignment_start_date?.slice(0, 10)
//             ].map(x => (x ?? '').toString().replace(/"/g, '""')).join(',')
//           )
//         ].join('\r\n');
        
//         const blob = new Blob([csv], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `assets_${new Date().toISOString().slice(0,10)}.csv`;
//         a.click();
//         window.URL.revokeObjectURL(url);
//       } else {
//         // For Excel export, you would typically use a library like xlsx
//         // This is a placeholder for Excel export functionality
//         console.log('Excel export would be implemented here');
//         alert('Excel export feature would be implemented with a library like xlsx');
//       }
//     } catch (e) {
//       alert('Failed to export');
//     }
//     setExporting(false);
//   };

//   // Import functionality
//   const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setImporting(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const res = await fetch(`${API_BASE_URL}/api/inventory/assets/import`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!res.ok) throw new Error('Import failed');
      
//       const result = await res.json();
//       alert(`Successfully imported ${result.importedCount} assets`);
//       fetchAssets();
//     } catch (e: any) {
//       setError(e?.message || 'Failed to import assets');
//     } finally {
//       setImporting(false);
//       // Reset file input
//       event.target.value = '';
//     }
//   };

//   // Generate pagination range
// const getPaginationRange = () => {
//   const { currentPage, totalPages } = pagination;
  
//   if (totalPages <= 1) return [1];
//   if (totalPages <= 7) {
//     return Array.from({ length: totalPages }, (_, i) => i + 1);
//   }

//   const range = [];
//   const delta = 2; // Number of pages to show on each side of current page
  
//   range.push(1);
  
//   let start = Math.max(2, currentPage - delta);
//   let end = Math.min(totalPages - 1, currentPage + delta);
  
//   if (currentPage - delta > 2) {
//     range.push('...');
//   }
  
//   for (let i = start; i <= end; i++) {
//     range.push(i);
//   }
  
//   if (currentPage + delta < totalPages - 1) {
//     range.push('...');
//   }
  
//   if (totalPages > 1) {
//     range.push(totalPages);
//   }
  
//   return range;
// };
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
//         <div>
//           <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
//             Asset Management
//           </h1>
//           <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
//             {pagination.totalItems} assets found
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <Link href="/admins/assets/add" className="btn btn-primary btn-sm">
//             + Add Asset
//           </Link>
          
//           {/* Import Button with File Input */}
//           <div className="dropdown dropdown-end">
//             <label tabIndex={0} className="btn btn-outline btn-sm">
//               {importing ? 'Importing...' : 'Bulk Import'}
//             </label>
//             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
//               <li>
//                 <label htmlFor="file-import" className="cursor-pointer">
//                   Upload CSV/Excel
//                 </label>
//                 <input
//                   id="file-import"
//                   type="file"
//                   accept=".csv,.xlsx,.xls"
//                   className="hidden"
//                   onChange={handleImport}
//                   disabled={importing}
//                 />
//               </li>
//               <li><Link href="/admins/assets/import-template">Download Template</Link></li>
//             </ul>
//           </div>

//           {/* Export Dropdown */}
//           <div className="dropdown dropdown-end">
//             <label tabIndex={0} className="btn btn-outline btn-sm">
//               {exporting ? 'Exporting...' : 'Export'}
//             </label>
//             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
//               <li><button onClick={() => handleExport('csv')}>Export as CSV</button></li>
//               <li><button onClick={() => handleExport('excel')}>Export as Excel</button></li>
//               <li><button onClick={() => handleExport('csv')}>Export Selected ({selectedAssets.length})</button></li>
//             </ul>
//           </div>

//           {/* Reports Dropdown */}
//           <div className="dropdown dropdown-end">
//             <label tabIndex={0} className="btn btn-outline btn-sm">Reports</label>
//             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
//               <li><Link href="/admins/assets/reports/inventory">Inventory Report</Link></li>
//               <li><Link href="/admins/assets/reports/assigned">Assigned Assets</Link></li>
//               <li><Link href="/admins/assets/reports/warranty">Warranty Expiry</Link></li>
//               <li><Link href="/admins/assets/reports/maintenance">Maintenance Schedule</Link></li>
//               <li><Link href="/admins/assets/reports/depreciation">Depreciation Report</Link></li>
//             </ul>
//           </div>

//           <button 
//             onClick={() => setShowFilters(!showFilters)}
//             className="btn btn-outline btn-sm"
//           >
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedAssets.length > 0 && (
//         <div className="bg-info/20 border border-info rounded-lg p-3 mb-4">
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">
//               {selectedAssets.length} assets selected
//             </span>
//             <div className="flex gap-2">
//               <button 
//                 onClick={handleBulkDelete}
//                 className="btn btn-error btn-sm"
//               >
//                 Delete Selected
//               </button>
//               <button 
//                 onClick={() => setSelectedAssets([])}
//                 className="btn btn-outline btn-sm"
//               >
//                 Clear Selection
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       {showFilters && (
//         <div className="bg-base-200 rounded-lg p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             <div>
//               <label className="label label-text font-medium">Status</label>
//               <select 
//                 className="select select-bordered w-full select-sm"
//                 value={filters.status}
//                 onChange={(e) => handleFilterChange('status', e.target.value)}
//               >
//                 <option value="">All Statuses</option>
//                 {filterOptions.statuses.map(status => (
//                   <option key={status} value={status}>{status}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="label label-text font-medium">Location</label>
//               <select 
//                 className="select select-bordered w-full select-sm"
//                 value={filters.location}
//                 onChange={(e) => handleFilterChange('location', e.target.value)}
//               >
//                 <option value="">All Locations</option>
//                 {filterOptions.locations.map(location => (
//                   <option key={location} value={location}>{location}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="label label-text font-medium">Category</label>
//               <select 
//                 className="select select-bordered w-full select-sm"
//                 value={filters.category}
//                 onChange={(e) => handleFilterChange('category', e.target.value)}
//               >
//                 <option value="">All Categories</option>
//                 {filterOptions.categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="label label-text font-medium">Assignment</label>
//               <select 
//                 className="select select-bordered w-full select-sm"
//                 value={filters.assigned}
//                 onChange={(e) => handleFilterChange('assigned', e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="assigned">Assigned</option>
//                 <option value="unassigned">Unassigned</option>
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button 
//                 onClick={clearFilters}
//                 className="btn btn-outline btn-sm w-full"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search and Controls */}
//       <div className="flex flex-col md:flex-row gap-2 mb-6">
//         <div className="flex-1">
//           <input
//             type="text"
//             placeholder="Search by serial, product, brand, model, assigned user..."
//             className="input input-bordered w-full"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setPagination(prev => ({ ...prev, currentPage: 1 }));
//             }}
//           />
//         </div>
//         <div className="flex gap-2">
//           <select 
//             className="select select-bordered"
//             value={pagination.itemsPerPage}
//             onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//           >
//             <option value={10}>10 per page</option>
//             <option value={15}>15 per page</option>
//             <option value={25}>25 per page</option>
//             <option value={50}>50 per page</option>
//             <option value={100}>100 per page</option>
//           </select>
//         </div>
//       </div>

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="btn btn-ghost btn-sm">×</button>
//         </div>
//       )}

//       {/* Table */}
//       <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
//         <table className="table table-zebra w-full">
//           <thead>
//             <tr>
//               <th>
//                 <input
//                   type="checkbox"
//                   className="checkbox checkbox-sm"
//                   checked={selectedAssets.length === currentAssets.length && currentAssets.length > 0}
//                   onChange={toggleSelectAll}
//                 />
//               </th>
//               <th 
//                 className="cursor-pointer hover:bg-base-200"
//                 onClick={() => handleSort('id')}
//               >
//                 ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
//               </th>
//               <th 
//                 className="cursor-pointer hover:bg-base-200"
//                 onClick={() => handleSort('serial_number')}
//               >
//                 Serial No {sortField === 'serial_number' && (sortDirection === 'asc' ? '↑' : '↓')}
//               </th>
//               <th>Product</th>
//               <th>Brand</th>
//               <th>Status</th>
//               <th>Location</th>
//               <th>Assigned To</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentAssets.length > 0 ? currentAssets.map(asset => (
//               <tr key={asset.id} className="hover">
//                 <td>
//                   <input
//                     type="checkbox"
//                     className="checkbox checkbox-sm"
//                     checked={selectedAssets.includes(asset.id)}
//                     onChange={() => toggleSelectAsset(asset.id)}
//                   />
//                 </td>
//                 <td>{asset.id}</td>
//                 <td className="font-mono text-sm">{asset.serial_number}</td>
//                 <td>
//                   <div className="max-w-[150px]">
//                     <div className="font-medium truncate">{asset.product_name}</div>
//                     <div className="text-xs text-gray-500">{asset.model_name}</div>
//                   </div>
//                 </td>
//                 <td>{asset.brand_name}</td>
//                 <td>
//                   <span className={`badge badge-sm ${
//                     asset.status_name?.toLowerCase().includes('active') ? 'badge-success' :
//                     asset.status_name?.toLowerCase().includes('inactive') ? 'badge-error' :
//                     'badge-warning'
//                   }`}>
//                     {asset.status_name}
//                   </span>
//                 </td>
//                 <td>{asset.location_name}</td>
//                 <td>
//                   {asset.assigned_to_name ? (
//                     <div>
//                       <div className="font-medium">{asset.assigned_to_name}</div>
//                       <div className="text-xs text-gray-500">{asset.assigned_department_name}</div>
//                     </div>
//                   ) : (
//                     <span className="text-gray-400">Unassigned</span>
//                   )}
//                 </td>
//                 <td>
//                   <div className="dropdown dropdown-end">
//                     <label tabIndex={0} className="btn btn-ghost btn-sm btn-square">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//                       </svg>
//                     </label>
//                     <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
//                       <li><Link href={`/admins/assets/${asset.id}`}>Edit Details</Link></li>
//                       <li><Link href={`/admins/assets/${asset.id}/assign`}>Assign Asset</Link></li>
//                       <li><Link href={`/admins/assets/${asset.id}/return`}>Return Asset</Link></li>
//                       <li><Link href={`/admins/assets/${asset.id}/transfer`}>Transfer</Link></li>
//                       <li><Link href={`/admins/assets/${asset.id}/history`}>View History</Link></li>
//                       <li><Link href={`/admins/assets/barcode?id=${asset.id}`}>Generate Barcode</Link></li>
//                       <li><hr className="my-1" /></li>
//                       <li>
//                         <button 
//                           onClick={() => handleDelete(asset.id)}
//                           className="text-error font-medium"
//                         >
//                           Delete Asset
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan={9} className="text-center py-8">
//                   <div className="text-gray-500">
//                     {searchTerm || Object.values(filters).some(f => f) 
//                       ? 'No matching assets found' 
//                       : 'No assets available'
//                     }
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Enhanced Pagination */}
//       {pagination.totalPages > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
//           <div className="text-sm text-gray-600">
//             Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
//             {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
//             {pagination.totalItems} assets
//           </div>
          
//           <div className="join">
//             {/* First Page */}
//             <button 
//               className="join-item btn btn-sm" 
//               onClick={() => goToPage(1)}
//               disabled={pagination.currentPage === 1}
//             >
//               «
//             </button>
            
//             {/* Previous Page */}
//             <button 
//               className="join-item btn btn-sm" 
//               onClick={() => goToPage(pagination.currentPage - 1)}
//               disabled={pagination.currentPage === 1}
//             >
//               ‹
//             </button>
            
//             {/* Page Numbers */}
//             {getPaginationRange().map((page, index) => (
//               <button
//                 key={index}
//                 className={`join-item btn btn-sm ${
//                   page === pagination.currentPage ? 'btn-active' : ''
//                 } ${page === '...' ? 'btn-disabled' : ''}`}
//                 onClick={() => typeof page === 'number' && goToPage(page)}
//                 disabled={page === '...'}
//               >
//                 {page}
//               </button>
//             ))}
            
//             {/* Next Page */}
//             <button 
//               className="join-item btn btn-sm" 
//               onClick={() => goToPage(pagination.currentPage + 1)}
//               disabled={pagination.currentPage === pagination.totalPages}
//             >
//               ›
//             </button>
            
//             {/* Last Page */}
//             <button 
//               className="join-item btn btn-sm" 
//               onClick={() => goToPage(pagination.totalPages)}
//               disabled={pagination.currentPage === pagination.totalPages}
//             >
//               »
//             </button>
//           </div>
          
//           <div className="text-sm text-gray-600">
//             Page {pagination.currentPage} of {pagination.totalPages}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
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

interface FilterOptions {
  status: string;
  location: string;
  category: string;
  assigned: string;
}

interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface CategoryStats {
  total: number;
  inStock: number;
  allocated: number;
  damageOrLoss: number;
  underRepair: number;
  vacant: number;
}

export default function AssetList() {
  const { theme } = useTheme();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Asset>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    location: '',
    category: '',
    assigned: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [pagination, setPagination] = useState<PaginationConfig>({
    currentPage: 1,
    itemsPerPage: 15,
    totalItems: 0,
    totalPages: 0
  });

  // Fetch assets
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/inventory/assets`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch assets');
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Calculate dashboard stats - Simple like the image
  const dashboardStats = useMemo(() => {
    const categories: { [key: string]: CategoryStats } = {};
    
    // Initialize with common categories
    const defaultCategories = ['Laptop', 'Monitor', 'CPU', 'Phone', 'Tablet', 'Accessories', 'Access Card'];
    
    defaultCategories.forEach(category => {
      categories[category] = {
        total: 0,
        inStock: 0,
        allocated: 0,
        damageOrLoss: 0,
        underRepair: 0,
        vacant: 0
      };
    });

    // Also include any other categories found in the data
    assets.forEach(asset => {
      const category = asset.category_name || 'Other';
      const status = asset.status_name?.toLowerCase() || '';
      const isAssigned = !!asset.assigned_to;

      if (!categories[category]) {
        categories[category] = {
          total: 0,
          inStock: 0,
          allocated: 0,
          damageOrLoss: 0,
          underRepair: 0,
          vacant: 0
        };
      }

      categories[category].total++;

      if (status.includes('damage') || status.includes('loss') || status.includes('broken')) {
        categories[category].damageOrLoss++;
      } else if (status.includes('repair') || status.includes('maintenance')) {
        categories[category].underRepair++;
      } else if (isAssigned) {
        categories[category].allocated++;
      } else {
        categories[category].inStock++;
        categories[category].vacant++;
      }
    });

    return categories;
  }, [assets]);

  // Get unique filter values
  const filterOptions = useMemo(() => {
    const statuses = [...new Set(assets.map(a => a.status_name).filter(Boolean))] as string[];
    const locations = [...new Set(assets.map(a => a.location_name).filter(Boolean))] as string[];
    const categories = [...new Set(assets.map(a => a.category_name).filter(Boolean))] as string[];
    
    return { statuses, locations, categories };
  }, [assets]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== '').length;
  }, [filters]);

  // Filter and sort logic
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      const matchesSearch = !searchTerm || 
        (asset.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.brand_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.model_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.assigned_to_name || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || asset.status_name === filters.status;
      const matchesLocation = !filters.location || asset.location_name === filters.location;
      const matchesCategory = !filters.category || asset.category_name === filters.category;
      const matchesAssigned = !filters.assigned || 
        (filters.assigned === 'assigned' && asset.assigned_to) ||
        (filters.assigned === 'unassigned' && !asset.assigned_to);

      return matchesSearch && matchesStatus && matchesLocation && matchesCategory && matchesAssigned;
    });

    // Sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [assets, searchTerm, filters, sortField, sortDirection]);

  // Update pagination when filtered assets change
  useEffect(() => {
    const totalItems = filteredAndSortedAssets.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage
    }));
  }, [filteredAndSortedAssets, pagination.itemsPerPage]);

  // Get current page assets
  const currentAssets = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return filteredAndSortedAssets.slice(startIndex, startIndex + pagination.itemsPerPage);
  }, [filteredAndSortedAssets, pagination.currentPage, pagination.itemsPerPage]);

  // Handle sort
  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ status: '', location: '', category: '', assigned: '' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    }));
  };

  // Fixed pagination range function
  const getPaginationRange = () => {
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= 1) return [1];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range: (number | string)[] = [];
    const delta = 1;
    
    range.push(1);
    
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);
    
    if (currentPage - delta > 2) {
      range.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }
    
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  // Selection handlers
  const toggleSelectAll = () => {
    setSelectedAssets(
      selectedAssets.length === currentAssets.length 
        ? [] 
        : currentAssets.map(asset => asset.id)
    );
  };

  const toggleSelectAsset = (id: number) => {
    setSelectedAssets(prev =>
      prev.includes(id) 
        ? prev.filter(assetId => assetId !== id)
        : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (!selectedAssets.length || !confirm(`Delete ${selectedAssets.length} selected assets?`)) return;
    
    try {
      await Promise.all(
        selectedAssets.map(id =>
          fetch(`${API_BASE_URL}/api/inventory/assets/${id}`, { method: 'DELETE' })
        )
      );
      setSelectedAssets([]);
      fetchAssets();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete assets');
    }
  };

  // Delete single asset
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/inventory/assets/${id}`, { method: 'DELETE' });
      fetchAssets();
    } catch (e: any) {
      setError(e?.message || 'Failed to delete asset');
    }
  };

  // Export functionality
  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory/assets`);
      if (!res.ok) throw new Error('Failed to export');
      const data: Asset[] = await res.json();
      
      if (format === 'csv') {
        const csv = [
          [
            'ID', 'Serial No', 'Product', 'Brand', 'Model', 'Type', 'Status', 'Location', 'Category', 'Unit',
            'Purchase Date', 'Warranty Expiry', 'Description', 'Supplier', 'Color', 'Invoice Ref',
            'Assigned To', 'Assigned To Name', 'Assigned Dept', 'Assigned Dept Name', 'Assignment Start Date'
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
      } else {
        alert('Excel export feature would be implemented with a library like xlsx');
      }
    } catch (e) {
      alert('Failed to export');
    }
    setExporting(false);
  };

  // Import functionality
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/api/inventory/assets/import`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Import failed');
      
      const result = await res.json();
      alert(`Successfully imported ${result.importedCount} assets`);
      fetchAssets();
    } catch (e: any) {
      setError(e?.message || 'Failed to import assets');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Asset Management
          </h1>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {pagination.totalItems} assets found
          </p>
        </div>
        
<div className="flex flex-wrap gap-2">
  <Link href="/admins/assets/add" className="btn btn-primary btn-sm">
    + Add Asset
  </Link>
  
  {/* Import Button - Fixed to direct link */}
  <Link href="/admins/assets/import" className="btn btn-outline btn-sm">
    {importing ? <span className="loading loading-spinner loading-xs"></span> : 'Import'}
  </Link>

  {/* Export Dropdown */}
  <div className="dropdown dropdown-end">
    <label tabIndex={0} className="btn btn-outline btn-sm">
      {exporting ? <span className="loading loading-spinner loading-xs"></span> : 'Export'}
    </label>
    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
      <li><button onClick={() => handleExport('csv')}>Export as CSV</button></li>
      <li><button onClick={() => handleExport('excel')}>Export as Excel</button></li>
      {selectedAssets.length > 0 && (
        <li><button onClick={() => handleExport('csv')}>Export Selected ({selectedAssets.length})</button></li>
      )}
    </ul>
  </div>
</div>
      </div>

      {/* SIMPLE DASHBOARD - Exactly like the image */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Asset Overview
        </h2>
        
        {/* Categories Grid - Simple like the image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(dashboardStats).map(([category, stats]) => (
            stats.total > 0 && (
              <div key={category} className="bg-base-100 rounded-lg shadow border">
                <div className="bg-primary text-primary-content p-3 rounded-t-lg">
                  <h3 className="font-bold text-lg text-center">{category}</h3>
                </div>
                <div className="p-0">
                  <table className="table table-sm w-full">
                    <tbody>
                      <tr>
                        <td className="font-semibold border-r">All</td>
                        <td className="text-right font-bold">{stats.total}</td>
                      </tr>
                      <tr>
                        <td className="border-r">In Stock</td>
                        <td className="text-right">{stats.inStock}</td>
                      </tr>
                      <tr>
                        <td className="border-r">Allocated</td>
                        <td className="text-right">{stats.allocated}</td>
                      </tr>
                      <tr>
                        <td className="border-r">Damage/Loss</td>
                        <td className="text-right">{stats.damageOrLoss}</td>
                      </tr>
                      <tr>
                        <td className="border-r">Under Repair</td>
                        <td className="text-right">{stats.underRepair}</td>
                      </tr>
                      <tr>
                        <td className="border-r">Vacant</td>
                        <td className="text-right">{stats.vacant}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* LIST VIEW SECTION */}
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Asset List
        </h2>

        {/* Bulk Actions */}
        {selectedAssets.length > 0 && (
          <div className="bg-info/20 border border-info rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedAssets.length} assets selected
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleBulkDelete}
                  className="btn btn-error btn-sm"
                >
                  Delete Selected
                </button>
                <button 
                  onClick={() => setSelectedAssets([])}
                  className="btn btn-outline btn-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar - Professional Layout */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="join w-full">
              <input
                type="text"
                placeholder="Search assets by serial, product, brand, model, etc."
                className="input input-bordered join-item w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
              />
              
              {/* Filter Button with Badge */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`btn join-item ${activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                {activeFilterCount > 0 && (
                  <span className="badge badge-primary badge-sm ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Items Per Page Selector */}
          <div className="flex gap-2">
            <select 
              className="select select-bordered"
              value={pagination.itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-base-200 rounded-lg p-4 mb-6 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="badge badge-primary badge-sm">
                    {activeFilterCount} active
                  </span>
                )}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm"
                  disabled={activeFilterCount === 0}
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="btn btn-ghost btn-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label label-text font-medium">Status</label>
                <select 
                  className="select select-bordered w-full select-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label label-text font-medium">Location</label>
                <select 
                  className="select select-bordered w-full select-sm"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">All Locations</option>
                  {filterOptions.locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label label-text font-medium">Category</label>
                <select 
                  className="select select-bordered w-full select-sm"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label label-text font-medium">Assignment</label>
                <select 
                  className="select select-bordered w-full select-sm"
                  value={filters.assigned}
                  onChange={(e) => handleFilterChange('assigned', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="assigned">Assigned</option>
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-ghost btn-sm">×</button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedAssets.length === currentAssets.length && currentAssets.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th 
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => handleSort('id')}
                >
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => handleSort('serial_number')}
                >
                  Serial No {sortField === 'serial_number' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Product</th>
                <th>Brand</th>
                <th>Status</th>
                <th>Location</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAssets.length > 0 ? currentAssets.map(asset => (
                <tr key={asset.id} className="hover">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => toggleSelectAsset(asset.id)}
                    />
                  </td>
                  <td>{asset.id}</td>
                  <td className="font-mono text-sm">{asset.serial_number}</td>
                  <td>
                    <div className="max-w-[150px]">
                      <div className="font-medium truncate">{asset.product_name}</div>
                      <div className="text-xs text-gray-500">{asset.model_name}</div>
                    </div>
                  </td>
                  <td>{asset.brand_name}</td>
                  <td>
                    <span className={`badge badge-sm ${
                      asset.status_name?.toLowerCase().includes('active') || !asset.assigned_to ? 'badge-success' :
                      asset.status_name?.toLowerCase().includes('inactive') ? 'badge-error' :
                      asset.status_name?.toLowerCase().includes('repair') ? 'badge-warning' :
                      asset.status_name?.toLowerCase().includes('lost') || asset.status_name?.toLowerCase().includes('missing') ? 'badge-error' :
                      asset.status_name?.toLowerCase().includes('damage') ? 'badge-error' :
                      'badge-info'
                    }`}>
                      {asset.status_name}
                    </span>
                  </td>
                  <td>{asset.location_name}</td>
                  <td>
                    {asset.assigned_to_name ? (
                      <div>
                        <div className="font-medium">{asset.assigned_to_name}</div>
                        <div className="text-xs text-gray-500">{asset.assigned_department_name}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-sm btn-square">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </label>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href={`/admins/assets/${asset.id}`}>Edit Details</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/assign`}>Assign Asset</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/return`}>Return Asset</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/transfer`}>Transfer</Link></li>
                        <li><Link href={`/admins/assets/${asset.id}/history`}>View History</Link></li>
                        <li><Link href={`/admins/assets/barcode?id=${asset.id}`}>Generate Barcode</Link></li>
                        <li><hr className="my-1" /></li>
                        <li>
                          <button 
                            onClick={() => handleDelete(asset.id)}
                            className="text-error font-medium"
                          >
                            Delete Asset
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchTerm || Object.values(filters).some(f => f) 
                        ? 'No matching assets found' 
                        : 'No assets available'
                      }
                    </div>
                    <div className="mt-2">
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          clearFilters();
                        }}
                        className="btn btn-sm btn-outline"
                      >
                        Clear Search & Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {pagination.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} assets
            </div>
            
            <div className="join">
              {/* First Page */}
              <button 
                className="join-item btn btn-sm" 
                onClick={() => goToPage(1)}
                disabled={pagination.currentPage === 1}
              >
                «
              </button>
              
              {/* Previous Page */}
              <button 
                className="join-item btn btn-sm" 
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                ‹
              </button>
              
              {/* Page Numbers */}
              {getPaginationRange().map((page, index) => (
                <button
                  key={index}
                  className={`join-item btn btn-sm ${
                    page === pagination.currentPage ? 'btn-active' : ''
                  } ${page === '...' ? 'btn-disabled' : ''}`}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
              
              {/* Next Page */}
              <button 
                className="join-item btn btn-sm" 
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                ›
              </button>
              
              {/* Last Page */}
              <button 
                className="join-item btn btn-sm" 
                onClick={() => goToPage(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                »
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
