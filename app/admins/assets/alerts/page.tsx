// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { API_BASE_URL } from '../../../config';

// type Tab = 'low-stock' | 'warranty-expiry' | 'configs';

// const ALERT_TYPE_OPTIONS = [
//   { value: 'low_stock', label: 'Low Stock' },
//   { value: 'expiry', label: 'Warranty Expiry' }
// ];

// export default function AlertsDashboardPage() {
//   const [tab, setTab] = useState<Tab>('low-stock');

//   // LOW STOCK ALERT
//   const [lowStock, setLowStock] = useState<any[]>([]);
//   const [lowStockLoading, setLowStockLoading] = useState(false);

//   // WARRANTY EXPIRY ALERT
//   const [warranty, setWarranty] = useState<any[]>([]);
//   const [warrantyLoading, setWarrantyLoading] = useState(false);

//   // ALERT CONFIGS
//   const [configs, setConfigs] = useState<any[]>([]);
//   const [configsLoading, setConfigsLoading] = useState(false);
//   const [showConfigModal, setShowConfigModal] = useState(false);
//   const [configEdit, setConfigEdit] = useState<any | null>(null);
//   const [form, setForm] = useState({
//     alert_type: '',
//     product_id: '',
//     category: '',
//     threshold: '',
//     is_active: true
//   });
//   const [formError, setFormError] = useState<string | null>(null);

//   // Master Data for dropdowns
//   const [products, setProducts] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [masterLoading, setMasterLoading] = useState(true);

//   // Load master data at startup
//   useEffect(() => {
//     setMasterLoading(true);
//     Promise.all([
//       fetch(`${API_BASE_URL}/api/inventory/products`).then(res => res.json()).catch(() => []),
//       fetch(`${API_BASE_URL}/api/inventory/categories`).then(res => res.json()).catch(() => [])
//     ]).then(([prods, cats]) => {
//       setProducts(prods || []);
//       setCategories(cats || []);
//       setMasterLoading(false);
//     });
//   }, []);

//   // Tab data loaders
//   useEffect(() => {
//     if (tab === 'low-stock') {
//       setLowStockLoading(true);
//       fetch(`${API_BASE_URL}/api/inventory/stock/low-alert`)
//         .then(res => res.json())
//         .then(setLowStock)
//         .finally(() => setLowStockLoading(false));
//     } else if (tab === 'warranty-expiry') {
//       setWarrantyLoading(true);
//       fetch(`${API_BASE_URL}/api/inventory/assets/warranty-expiry`)
//         .then(res => res.json())
//         .then(setWarranty)
//         .finally(() => setWarrantyLoading(false));
//     } else if (tab === 'configs') {
//       setConfigsLoading(true);
//       fetch(`${API_BASE_URL}/api/inventory/alert-configs`)
//         .then(res => res.json())
//         .then(setConfigs)
//         .finally(() => setConfigsLoading(false));
//     }
//   }, [tab]);

//   // Config CRUD Handlers
//   const openAddConfig = () => {
//     setConfigEdit(null);
//     setForm({
//       alert_type: '',
//       product_id: '',
//       category: '',
//       threshold: '',
//       is_active: true
//     });
//     setFormError(null);
//     setShowConfigModal(true);
//   };
//   const openEditConfig = (cfg: any) => {
//     setConfigEdit(cfg);
//     setForm({
//       alert_type: cfg.alert_type || '',
//       product_id: cfg.product_id ? String(cfg.product_id) : '',
//       category: cfg.category || '',
//       threshold: cfg.threshold?.toString() || '',
//       is_active: !!cfg.is_active
//     });
//     setFormError(null);
//     setShowConfigModal(true);
//   };
//   const handleConfigSave = async (e: any) => {
//     e.preventDefault();
//     setFormError(null);
//     if (!form.alert_type || !form.threshold) {
//       setFormError('Alert type and threshold are required.');
//       return;
//     }
//     const body = {
//       alert_type: form.alert_type,
//       product_id: form.product_id ? Number(form.product_id) : null,
//       category: form.category || null,
//       threshold: Number(form.threshold),
//       is_active: !!form.is_active,
//     };
//     const url = configEdit
//       ? `${API_BASE_URL}/api/inventory/alert-configs/${configEdit.id}`
//       : `${API_BASE_URL}/api/inventory/alert-configs`;
//     const method = configEdit ? 'PUT' : 'POST';

//     const res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body)
//     });
//     if (!res.ok) {
//       setFormError('Failed to save config');
//       return;
//     }
//     setShowConfigModal(false);
//     setTab('configs'); // reload
//   };
//   const handleConfigDelete = async (id: any) => {
//     if (!confirm('Delete this config?')) return;
//     await fetch(`${API_BASE_URL}/api/inventory/alert-configs/${id}`, { method: 'DELETE' });
//     setTab('configs'); // reload
//   };

//   // Render
//   return (
//     <div className="max-w-7xl mx-auto py-8 px-2">
//       <h1 className="text-2xl font-bold mb-6">Asset & Stock Alerts</h1>
//       <div className="tabs mb-4">
//         <button
//           className={`tab tab-lg ${tab === 'low-stock' ? 'tab-active' : ''}`}
//           onClick={() => setTab('low-stock')}
//         >Low Stock</button>
//         <button
//           className={`tab tab-lg ${tab === 'warranty-expiry' ? 'tab-active' : ''}`}
//           onClick={() => setTab('warranty-expiry')}
//         >Warranty Expiry</button>
//         <button
//           className={`tab tab-lg ${tab === 'configs' ? 'tab-active' : ''}`}
//           onClick={() => setTab('configs')}
//         >Alert Configs</button>
//       </div>

//       {/* LOW STOCK TAB */}
//       {tab === 'low-stock' && (
//         <div>
//           {lowStockLoading ? <div>Loading...</div> : (
//             <div className="overflow-x-auto rounded shadow">
//               <table className="table w-full">
//                 <thead>
//                   <tr>
//                     <th>SKU</th>
//                     <th>Product</th>
//                     <th>Brand</th>
//                     <th>Category</th>
//                     <th>Unit</th>
//                     <th>Location</th>
//                     <th className="text-center">Stock</th>
//                     <th className="text-center">Min</th>
//                     <th className="text-center">Max</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {lowStock.length === 0 ? (
//                     <tr>
//                       <td colSpan={11} className="text-center py-8">No low stock products</td>
//                     </tr>
//                   ) : lowStock.map((item: any) => (
//                     <tr key={item.product_id}>
//                       <td>{item.sku}</td>
//                       <td>{item.product_name}</td>
//                       <td>{item.brand_name}</td>
//                       <td>{item.category_name}</td>
//                       <td>{item.unit_name}</td>
//                       <td>{item.location_name}</td>
//                       <td className={`text-center font-bold ${item.stock_balance <= 0 ? 'text-red-500' : item.stock_balance <= item.min_stock ? 'text-yellow-600' : 'text-black'}`}>
//                         {item.stock_balance}
//                       </td>
//                       <td className="text-center">{item.min_stock}</td>
//                       <td className="text-center">{item.max_stock}</td>
//                       <td>
//                         {item.stock_balance <= 0 ? (
//                           <span className="badge badge-error">Out of Stock</span>
//                         ) : item.stock_balance <= item.min_stock ? (
//                           <span className="badge badge-warning">Low</span>
//                         ) : (
//                           <span className="badge badge-ghost">OK</span>
//                         )}
//                       </td>
//                       <td>
//                         <Link href={`/admins/products/${item.product_id}`} className="btn btn-xs btn-info mr-2">Product</Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* WARRANTY EXPIRY TAB */}
//       {tab === 'warranty-expiry' && (
//         <div>
//           {warrantyLoading ? <div>Loading...</div> : (
//             <div className="overflow-x-auto rounded shadow">
//               <table className="table w-full">
//                 <thead>
//                   <tr>
//                     <th>Serial No</th>
//                     <th>Product</th>
//                     <th>Brand</th>
//                     <th>Location</th>
//                     <th>Assigned To</th>
//                     <th>Expiry Date</th>
//                     <th>Days Left</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {warranty.length === 0 ? (
//                     <tr>
//                       <td colSpan={9} className="text-center py-8">No assets nearing warranty expiry</td>
//                     </tr>
//                   ) : warranty.map((asset: any) => {
//                     const expiry = asset.warranty_expiry ? new Date(asset.warranty_expiry) : null;
//                     const now = new Date();
//                     const days = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24)) : null;
//                     return (
//                       <tr key={asset.id}>
//                         <td>{asset.serial_number}</td>
//                         <td>{asset.product_name}</td>
//                         <td>{asset.brand_name}</td>
//                         <td>{asset.location_name}</td>
//                         <td>{asset.assigned_to_name}</td>
//                         <td>{asset.warranty_expiry?.slice(0, 10)}</td>
//                         <td className={days !== null && days < 0 ? 'text-red-600 font-bold' : days !== null && days < 30 ? 'text-yellow-700 font-bold' : ''}>
//                           {days !== null ? days : '-'}
//                         </td>
//                         <td>
//                           {days !== null && days < 0 ? (
//                             <span className="badge badge-error">Expired</span>
//                           ) : days !== null && days < 30 ? (
//                             <span className="badge badge-warning">Expiring</span>
//                           ) : (
//                             <span className="badge badge-ghost">OK</span>
//                           )}
//                         </td>
//                         <td>
//                           <Link href={`/admins/assets/${asset.id}`} className="btn btn-xs btn-primary">View</Link>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ALERT CONFIGS TAB */}
//       {tab === 'configs' && (
//         <div>
//           <div className="mb-4 flex justify-between">
//             <h2 className="text-xl font-bold">Alert Configurations</h2>
//             <button className="btn btn-sm btn-info" onClick={openAddConfig}>+ Add Config</button>
//           </div>
//           {configsLoading ? <div>Loading...</div> : (
//             <div className="overflow-x-auto rounded shadow">
//               <table className="table w-full">
//                 <thead>
//                   <tr>
//                     <th>Alert Type</th>
//                     <th>Product</th>
//                     <th>Category</th>
//                     <th>Threshold</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {configs.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="text-center py-8">No alert configs found</td>
//                     </tr>
//                   ) : configs.map((cfg: any) => (
//                     <tr key={cfg.id}>
//                       <td>
//                         {ALERT_TYPE_OPTIONS.find(a => a.value === cfg.alert_type)?.label || cfg.alert_type}
//                       </td>
//                       <td>
//                         {products.find(p => String(p.id) === String(cfg.product_id))?.name ||
//                           (cfg.product_id ? cfg.product_id : <span className="text-gray-400">(All)</span>)}
//                       </td>
//                       <td>
//                         {categories.find(c => c.name === cfg.category)?.name ||
//                           (cfg.category ? cfg.category : <span className="text-gray-400">(All)</span>)}
//                       </td>
//                       <td>{cfg.threshold}</td>
//                       <td>
//                         {cfg.is_active ? <span className="badge badge-success">Enabled</span> : <span className="badge badge-ghost">Disabled</span>}
//                       </td>
//                       <td>
//                         <button className="btn btn-xs btn-info mr-1" onClick={() => openEditConfig(cfg)}>Edit</button>
//                         <button className="btn btn-xs btn-error" onClick={() => handleConfigDelete(cfg.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Modal */}
//           {showConfigModal && (
//             <div className="fixed z-10 left-0 top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20">
//               <div className="bg-white p-6 rounded shadow-xl min-w-[350px] max-w-md">
//                 <h3 className="font-bold mb-4">{configEdit ? 'Edit Alert Config' : 'Add Alert Config'}</h3>
//                 {masterLoading ? (
//                   <div>Loading master data...</div>
//                 ) : (
//                   <form onSubmit={handleConfigSave} className="space-y-3">
//                     <div>
//                       <label className="block font-semibold">Alert Type</label>
//                       <select
//                         className="select select-bordered w-full"
//                         value={form.alert_type}
//                         onChange={e => setForm(f => ({ ...f, alert_type: e.target.value }))}
//                         required
//                       >
//                         <option value="">Select Alert Type</option>
//                         {ALERT_TYPE_OPTIONS.map(opt => (
//                           <option key={opt.value} value={opt.value}>{opt.label}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Product</label>
//                       <select
//                         className="select select-bordered w-full"
//                         value={form.product_id}
//                         onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
//                       >
//                         <option value="">(All Products)</option>
//                         {products.map((prod: any) => (
//                           <option key={prod.id} value={prod.id}>
//                             {prod.name} {prod.sku ? `(${prod.sku})` : ''}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Category</label>
//                       <select
//                         className="select select-bordered w-full"
//                         value={form.category}
//                         onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
//                       >
//                         <option value="">(All Categories)</option>
//                         {categories.map((cat: any) => (
//                           <option key={cat.id} value={cat.name}>{cat.name}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Threshold</label>
//                       <input
//                         className="input input-bordered w-full"
//                         type="number"
//                         value={form.threshold}
//                         onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
//                         required
//                         min={0}
//                         placeholder="E.g. 5"
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-semibold">Active</label>
//                       <select
//                         className="select select-bordered w-full"
//                         value={form.is_active ? '1' : '0'}
//                         onChange={e => setForm(f => ({ ...f, is_active: e.target.value === '1' }))}
//                       >
//                         <option value="1">Yes</option>
//                         <option value="0">No</option>
//                       </select>
//                     </div>
//                     {formError && <div className="alert alert-error py-1">{formError}</div>}
//                     <div className="flex gap-2 justify-end">
//                       <button type="button" className="btn btn-secondary" onClick={() => setShowConfigModal(false)}>Cancel</button>
//                       <button type="submit" className="btn btn-primary">{configEdit ? 'Save' : 'Add'}</button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../../config';

type Tab = 'low-stock' | 'warranty-expiry' | 'configs';

const ALERT_TYPE_OPTIONS = [
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'expiry', label: 'Warranty Expiry' }
];

/** Reusable responsive, non-wrapping badge */
function Pill({
  label,
  tone = 'ghost', // 'success' | 'error' | 'warning' | 'info' | 'ghost'
  className = '',
}: {
  label: string;
  tone?: 'success' | 'error' | 'warning' | 'info' | 'ghost';
  className?: string;
}) {
  const toneClass =
    tone === 'success'
      ? 'badge-success'
      : tone === 'error'
      ? 'badge-error'
      : tone === 'warning'
      ? 'badge-warning'
      : tone === 'info'
      ? 'badge-info'
      : 'badge-ghost';

  const base =
    'badge whitespace-nowrap inline-flex items-center justify-center rounded-full ' +
    'text-[11px] sm:text-xs px-2 py-1 sm:px-3';

  return <span className={`${base} ${toneClass} ${className}`}>{label}</span>;
}

export default function AlertsDashboardPage() {
  const [tab, setTab] = useState<Tab>('low-stock');

  // LOW STOCK ALERT
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [lowStockLoading, setLowStockLoading] = useState(false);

  // WARRANTY EXPIRY ALERT
  const [warranty, setWarranty] = useState<any[]>([]);
  const [warrantyLoading, setWarrantyLoading] = useState(false);

  // ALERT CONFIGS
  const [configs, setConfigs] = useState<any[]>([]);
  const [configsLoading, setConfigsLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configEdit, setConfigEdit] = useState<any | null>(null);
  const [form, setForm] = useState({
    alert_type: '',
    product_id: '',
    category: '',
    threshold: '',
    is_active: true
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Master Data for dropdowns
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [masterLoading, setMasterLoading] = useState(true);

  // Load master data at startup
  useEffect(() => {
    setMasterLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/inventory/products`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/inventory/categories`).then(res => res.json()).catch(() => [])
    ]).then(([prods, cats]) => {
      setProducts(prods || []);
      setCategories(cats || []);
      setMasterLoading(false);
    });
  }, []);

  // Tab data loaders
  useEffect(() => {
    if (tab === 'low-stock') {
      setLowStockLoading(true);
      fetch(`${API_BASE_URL}/api/inventory/stock/low-alert`)
        .then(res => res.json())
        .then(setLowStock)
        .finally(() => setLowStockLoading(false));
    } else if (tab === 'warranty-expiry') {
      setWarrantyLoading(true);
      fetch(`${API_BASE_URL}/api/inventory/assets/warranty-expiry`)
        .then(res => res.json())
        .then(setWarranty)
        .finally(() => setWarrantyLoading(false));
    } else if (tab === 'configs') {
      setConfigsLoading(true);
      fetch(`${API_BASE_URL}/api/inventory/alert-configs`)
        .then(res => res.json())
        .then(setConfigs)
        .finally(() => setConfigsLoading(false));
    }
  }, [tab]);

  // Config CRUD Handlers
  const openAddConfig = () => {
    setConfigEdit(null);
    setForm({
      alert_type: '',
      product_id: '',
      category: '',
      threshold: '',
      is_active: true
    });
    setFormError(null);
    setShowConfigModal(true);
  };
  const openEditConfig = (cfg: any) => {
    setConfigEdit(cfg);
    setForm({
      alert_type: cfg.alert_type || '',
      product_id: cfg.product_id ? String(cfg.product_id) : '',
      category: cfg.category || '',
      threshold: cfg.threshold?.toString() || '',
      is_active: !!cfg.is_active
    });
    setFormError(null);
    setShowConfigModal(true);
  };
  const handleConfigSave = async (e: any) => {
    e.preventDefault();
    setFormError(null);
    if (!form.alert_type || !form.threshold) {
      setFormError('Alert type and threshold are required.');
      return;
    }
    const body = {
      alert_type: form.alert_type,
      product_id: form.product_id ? Number(form.product_id) : null,
      category: form.category || null,
      threshold: Number(form.threshold),
      is_active: !!form.is_active,
    };
    const url = configEdit
      ? `${API_BASE_URL}/api/inventory/alert-configs/${configEdit.id}`
      : `${API_BASE_URL}/api/inventory/alert-configs`;
    const method = configEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      setFormError('Failed to save config');
      return;
    }
    setShowConfigModal(false);
    setTab('configs'); // reload
  };
  const handleConfigDelete = async (id: any) => {
    if (!confirm('Delete this config?')) return;
    await fetch(`${API_BASE_URL}/api/inventory/alert-configs/${id}`, { method: 'DELETE' });
    setTab('configs'); // reload
  };

  // Render
  return (
    <div className="max-w-7xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Asset & Stock Alerts</h1>
      <div className="tabs mb-4">
        <button
          className={`tab tab-lg ${tab === 'low-stock' ? 'tab-active' : ''}`}
          onClick={() => setTab('low-stock')}
        >Low Stock</button>
        <button
          className={`tab tab-lg ${tab === 'warranty-expiry' ? 'tab-active' : ''}`}
          onClick={() => setTab('warranty-expiry')}
        >Warranty Expiry</button>
        <button
          className={`tab tab-lg ${tab === 'configs' ? 'tab-active' : ''}`}
          onClick={() => setTab('configs')}
        >Alert Configs</button>
      </div>

      {/* LOW STOCK TAB */}
      {tab === 'low-stock' && (
        <div>
          {lowStockLoading ? <div>Loading...</div> : (
            <div className="overflow-x-auto rounded shadow">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Location</th>
                    <th className="text-center whitespace-nowrap">Stock</th>
                    <th className="text-center whitespace-nowrap">Min</th>
                    <th className="text-center whitespace-nowrap">Max</th>
                    <th className="w-28 md:w-36">Status</th>
                    <th className="w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8">No low stock products</td>
                    </tr>
                  ) : lowStock.map((item: any) => (
                    <tr key={item.product_id}>
                      <td className="whitespace-nowrap">{item.sku}</td>
                      <td>{item.product_name}</td>
                      <td className="whitespace-nowrap">{item.brand_name}</td>
                      <td className="whitespace-nowrap">{item.category_name}</td>
                      <td className="whitespace-nowrap">{item.unit_name}</td>
                      <td className="whitespace-nowrap">{item.location_name}</td>
                      <td className={`text-center font-bold whitespace-nowrap ${
                        item.stock_balance <= 0
                          ? 'text-red-600'
                          : item.stock_balance <= item.min_stock
                          ? 'text-yellow-700'
                          : 'text-black'
                      }`}>
                        {item.stock_balance}
                      </td>
                      <td className="text-center whitespace-nowrap">{item.min_stock}</td>
                      <td className="text-center whitespace-nowrap">{item.max_stock}</td>
                      <td className="whitespace-nowrap">
                        {item.stock_balance <= 0 ? (
                          <Pill tone="error" label="Out of Stock" />
                        ) : item.stock_balance <= item.min_stock ? (
                          <Pill tone="warning" label="Low" />
                        ) : (
                          <Pill tone="ghost" label="OK" />
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <Link href={`/admins/products/${item.product_id}`} className="btn btn-xs btn-info mr-2">
                          Product
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* WARRANTY EXPIRY TAB */}
      {tab === 'warranty-expiry' && (
        <div>
          {warrantyLoading ? <div>Loading...</div> : (
            <div className="overflow-x-auto rounded shadow">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Location</th>
                    <th>Assigned To</th>
                    <th>Expiry Date</th>
                    <th>Days Left</th>
                    <th className="w-28 md:w-36">Status</th>
                    <th className="w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warranty.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8">No assets nearing warranty expiry</td>
                    </tr>
                  ) : warranty.map((asset: any) => {
                    const expiry = asset.warranty_expiry ? new Date(asset.warranty_expiry) : null;
                    const now = new Date();
                    const days =
                      expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24)) : null;
                    return (
                      <tr key={asset.id}>
                        <td className="whitespace-nowrap">{asset.serial_number}</td>
                        <td>{asset.product_name}</td>
                        <td className="whitespace-nowrap">{asset.brand_name}</td>
                        <td className="whitespace-nowrap">{asset.location_name}</td>
                        <td className="whitespace-nowrap">{asset.assigned_to_name}</td>
                        <td className="whitespace-nowrap">{asset.warranty_expiry?.slice(0, 10)}</td>
                        <td
                          className={
                            days !== null && days < 0
                              ? 'text-red-600 font-bold whitespace-nowrap'
                              : days !== null && days < 30
                              ? 'text-yellow-700 font-bold whitespace-nowrap'
                              : 'whitespace-nowrap'
                          }
                        >
                          {days !== null ? days : '-'}
                        </td>
                        <td className="whitespace-nowrap">
                          {days !== null && days < 0 ? (
                            <Pill tone="error" label="Expired" />
                          ) : days !== null && days < 30 ? (
                            <Pill tone="warning" label="Expiring" />
                          ) : (
                            <Pill tone="ghost" label="OK" />
                          )}
                        </td>
                        <td className="whitespace-nowrap">
                          <Link href={`/admins/assets/${asset.id}`} className="btn btn-xs btn-primary">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ALERT CONFIGS TAB */}
      {tab === 'configs' && (
        <div>
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-bold">Alert Configurations</h2>
            <button className="btn btn-sm btn-info" onClick={openAddConfig}>+ Add Config</button>
          </div>
          {configsLoading ? <div>Loading...</div> : (
            <div className="overflow-x-auto rounded shadow">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Alert Type</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Threshold</th>
                    <th className="w-28 md:w-36">Status</th>
                    <th className="w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">No alert configs found</td>
                    </tr>
                  ) : configs.map((cfg: any) => (
                    <tr key={cfg.id}>
                      <td className="whitespace-nowrap">
                        {ALERT_TYPE_OPTIONS.find(a => a.value === cfg.alert_type)?.label || cfg.alert_type}
                      </td>
                      <td>
                        {products.find(p => String(p.id) === String(cfg.product_id))?.name ||
                          (cfg.product_id ? cfg.product_id : <span className="text-gray-400">(All)</span>)}
                      </td>
                      <td className="whitespace-nowrap">
                        {categories.find(c => c.name === cfg.category)?.name ||
                          (cfg.category ? cfg.category : <span className="text-gray-400">(All)</span>)}
                      </td>
                      <td className="whitespace-nowrap">{cfg.threshold}</td>
                      <td className="whitespace-nowrap">
                        {cfg.is_active ? (
                          <Pill tone="success" label="Enabled" />
                        ) : (
                          <Pill tone="ghost" label="Disabled" />
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <button className="btn btn-xs btn-info mr-1" onClick={() => openEditConfig(cfg)}>
                          Edit
                        </button>
                        <button className="btn btn-xs btn-error" onClick={() => handleConfigDelete(cfg.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {showConfigModal && (
            <div className="fixed z-10 left-0 top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20">
              <div className="bg-white p-6 rounded shadow-xl min-w-[350px] max-w-md">
                <h3 className="font-bold mb-4">{configEdit ? 'Edit Alert Config' : 'Add Alert Config'}</h3>
                {masterLoading ? (
                  <div>Loading master data...</div>
                ) : (
                  <form onSubmit={handleConfigSave} className="space-y-3">
                    <div>
                      <label className="block font-semibold">Alert Type</label>
                      <select
                        className="select select-bordered w-full"
                        value={form.alert_type}
                        onChange={e => setForm(f => ({ ...f, alert_type: e.target.value }))}
                        required
                      >
                        <option value="">Select Alert Type</option>
                        {ALERT_TYPE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold">Product</label>
                      <select
                        className="select select-bordered w-full"
                        value={form.product_id}
                        onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
                      >
                        <option value="">(All Products)</option>
                        {products.map((prod: any) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} {prod.sku ? `(${prod.sku})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold">Category</label>
                      <select
                        className="select select-bordered w-full"
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      >
                        <option value="">(All Categories)</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold">Threshold</label>
                      <input
                        className="input input-bordered w-full"
                        type="number"
                        value={form.threshold}
                        onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
                        required
                        min={0}
                        placeholder="E.g. 5"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">Active</label>
                      <select
                        className="select select-bordered w-full"
                        value={form.is_active ? '1' : '0'}
                        onChange={e => setForm(f => ({ ...f, is_active: e.target.value === '1' }))}
                      >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    </div>
                    {formError && <div className="alert alert-error py-1">{formError}</div>}
                    <div className="flex gap-2 justify-end">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowConfigModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {configEdit ? 'Save' : 'Add'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
