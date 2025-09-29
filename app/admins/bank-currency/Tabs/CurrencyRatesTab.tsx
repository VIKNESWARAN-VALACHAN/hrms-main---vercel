// // ----------------------------------------------------------------------
// // File: app/admins/bank-currency/Tabs/CurrencyRatesTab.tsx
// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import moment from 'moment';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '@/app/config';

// interface Rate {
//   id: number;
//   bank_id: number;
//   bank_name: string;
//   from_code: string;
//   to_code: string;
//   rate: string;
//   effective_date: string; // ISO or YYYY-MM-DD
//   expiry_date: string;    // ISO or YYYY-MM-DD
//   is_expired: number;     // server-provided flag (we'll ignore for filtering)
// }

// interface RateHistory {
//   id: number;
//   currency_rate_id: number;
//   bank_id: number;
//   from_code: string;
//   to_code: string;
//   old_rate: string;
//   new_rate: string;
//   effective_date: string;
//   expiry_date: string;
//   updated_by: string | null;
//   updated_at: string;
// }

// interface Bank { id: number; bank_name: string; }
// interface Currency { code: string; name: string; }
// interface User { id: number; name: string; email: string; role: string; }

// const PAGE_SIZE = 10;
// const BASE_FROM_CODE = 'MYR';

// export default function CurrencyRatesTab() {
//   // Data
//   const [rates, setRates] = useState<Rate[]>([]);
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [codes, setCodes] = useState<Currency[]>([]);

//   // Logged-in user
//   const [user, setUser] = useState<User | null>(null);
//   useEffect(() => {
//     const raw = localStorage.getItem('hrms_user');
//     if (raw) { try { setUser(JSON.parse(raw)); } catch {} }
//   }, []);

//   // Filters / columns / paging
//   const [filters, setFilters] = useState({
//     bank: '',
//     currency: '',
//     status: 'All' as 'All' | 'Active' | 'Expired' | 'Expiring',
//   });
//   const [amount, setAmount] = useState(1);
//   const [search, setSearch] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
//     bank: true, conv: true, rate: true, converted: true, eff: true, exp: true, actions: true,
//   });
//   const [page, setPage] = useState(1);

//   // Modals & selection
//   const [showNew, setShowNew] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [showHistory, setShowHistory] = useState(false);
//   const [selected, setSelected] = useState<Rate | null>(null);
//   const [history, setHistory] = useState<RateHistory[]>([]);

//   // Forms + errors
//   const [newForm, setNewForm] = useState({
//     bank_id: 0,
//     from_code: BASE_FROM_CODE,
//     to_code: '',
//     rate: '',
//     effective_date: moment().format('YYYY-MM-DD'),
//     expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
//   });
//   const [editForm, setEditForm] = useState({
//     rate: '',
//     effective_date: moment().format('YYYY-MM-DD'),
//     expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
//   });
//   const [newErrors, setNewErrors] = useState<Record<string, string>>({});
//   const [editErrors, setEditErrors] = useState<Record<string, string>>({});

//   // Fetch all (prefer ALL rates; fallback to /active if needed)
//   const fetchAll = async () => {
//     try {
//       const ratesResp = await fetch(`${API_BASE_URL}/api/bank-currency/rates`);
//       const r = ratesResp.ok ? await ratesResp.json() : await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`).then(res => res.json());
//       const [b, c] = await Promise.all([
//         fetch(`${API_BASE_URL}/api/bank-currency/banks`).then(r => r.json()),
//         fetch(`${API_BASE_URL}/api/bank-currency/currencies`).then(r => r.json()),
//       ]);
//       setRates(Array.isArray(r) ? r : []);
//       setBanks(Array.isArray(b) ? b : []);
//       setCodes(Array.isArray(c) ? c : []);
//     } catch {
//       toast.error('Failed to load rates');
//     }
//   };
//   useEffect(() => { fetchAll(); }, []);

//   // Map code -> friendly name
//   const codeNameMap = useMemo(() => {
//     const m: Record<string, string> = {};
//     for (const c of codes) m[c.code] = c.name;
//     return m;
//   }, [codes]);

//   const label = (code: string) => `${code}${codeNameMap[code] ? ` — ${codeNameMap[code]}` : ''}`;

//   // Status calculation based on dates (so edited items remain visible)
//   const now = moment();
//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return rates.filter(r => {
//       const eff = moment(r.effective_date);
//       const exp = moment(r.expiry_date);
//       const isActive = now.isSameOrAfter(eff, 'day') && now.isSameOrBefore(exp, 'day');
//       const daysToExp = exp.diff(now, 'days');
//       const isExpiring = isActive && daysToExp >= 0 && daysToExp <= 7;
//       const isExpired = now.isAfter(exp, 'day');

//       const statusOk =
//         filters.status === 'All' ||
//         (filters.status === 'Active' && isActive) ||
//         (filters.status === 'Expired' && isExpired) ||
//         (filters.status === 'Expiring' && isExpiring);

//       return (
//         (!q ||
//           r.bank_name.toLowerCase().includes(q) ||
//           r.to_code.toLowerCase().includes(q) ||
//           r.from_code.toLowerCase().includes(q) ||
//           (codeNameMap[r.to_code]?.toLowerCase().includes(q)) ||
//           (codeNameMap[r.from_code]?.toLowerCase().includes(q))
//         ) &&
//         (!filters.bank || r.bank_name === filters.bank) &&
//         (!filters.currency || r.to_code === filters.currency) &&
//         statusOk
//       );
//     });
//   }, [rates, search, filters, now, codeNameMap]);

//   // Paging helpers
//   const totalRecords = rates.length;
//   const filteredCount = filtered.length;
//   const isFiltered = useMemo(
//     () => search.trim() !== '' || filters.bank !== '' || filters.currency !== '' || filters.status !== 'All',
//     [search, filters]
//   );
//   const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
//   const pageItems = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
//   const startIndex = filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0;
//   const endIndex = Math.min(page * PAGE_SIZE, filteredCount);

//   // UI helpers
//   const expiryBadge = (exp: string) => {
//     const days = moment(exp).diff(moment(), 'days');
//     if (days < 0) return <span className="badge badge-error">Expired</span>;
//     if (days <= 3) return <span className="badge badge-error">Expires in {days}d</span>;
//     if (days <= 7) return <span className="badge badge-warning">Expires in {days}d</span>;
//     return null;
//   };

//   // Validation
//   const validateNew = (f = newForm) => {
//     const e: Record<string,string> = {};
//     if (!f.bank_id) e.bank_id = 'Bank is required';
//     if (!f.to_code) e.to_code = 'To currency is required';
//     const rateNum = parseFloat(f.rate);
//     if (!f.rate || !Number.isFinite(rateNum) || rateNum <= 0) e.rate = 'Rate must be a positive number';
//     if (!f.effective_date) e.effective_date = 'Valid From is required';
//     if (!f.expiry_date) e.expiry_date = 'Until is required';
//     if (f.effective_date && f.expiry_date && moment(f.effective_date).isAfter(moment(f.expiry_date))) {
//       e.expiry_date = 'Until must be after Valid From';
//     }
//     if (f.to_code && f.to_code === BASE_FROM_CODE) e.to_code = `To currency must be different from ${BASE_FROM_CODE}`;
//     return e;
//   };
//   const validateEdit = (f = editForm) => {
//     const e: Record<string,string> = {};
//     const rateNum = parseFloat(f.rate);
//     if (!f.rate || !Number.isFinite(rateNum) || rateNum <= 0) e.rate = 'Rate must be a positive number';
//     if (!f.effective_date) e.effective_date = 'Valid From is required';
//     if (!f.expiry_date) e.expiry_date = 'Until is required';
//     if (f.effective_date && f.expiry_date && moment(f.effective_date).isAfter(moment(f.expiry_date))) {
//       e.expiry_date = 'Until must be after Valid From';
//     }
//     return e;
//   };

//   // Open Add
//   const openNew = () => {
//     setConfirmOpen(false);
//     setShowEdit(false);
//     setSelected(null);
//     setNewForm({
//       bank_id: 0,
//       from_code: BASE_FROM_CODE,
//       to_code: '',
//       rate: '',
//       effective_date: moment().format('YYYY-MM-DD'),
//       expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
//     });
//     setNewErrors({});
//     setShowNew(true);
//   };

//   // Open Edit
//   const openEditModal = (r: Rate) => {
//     setConfirmOpen(false);
//     setSelected(r);
//     setEditForm({
//       rate: String(r.rate),
//       effective_date: moment(r.effective_date).format('YYYY-MM-DD'),
//       expiry_date: moment(r.expiry_date).format('YYYY-MM-DD'),
//     });
//     setEditErrors({});
//     setShowEdit(true);
//   };

//   // Create
//   const addRate = async () => {
//     const errs = validateNew();
//     setNewErrors(errs);
//     if (Object.keys(errs).length) return toast.error('Please fix the highlighted fields.');

//     // prevent active-window overlap for same (bank, pair)
//     const overlap = rates.some(r =>
//       r.bank_id === newForm.bank_id &&
//       r.from_code === BASE_FROM_CODE &&
//       r.to_code === newForm.to_code &&
//       moment(newForm.effective_date).isBefore(r.expiry_date) &&
//       moment(newForm.expiry_date).isAfter(r.effective_date)
//     );
//     if (overlap) return toast.error('Active window overlaps for the same bank & pair');

//     const payload = {
//       bank_id: newForm.bank_id,
//       from_code: BASE_FROM_CODE,
//       to_code: newForm.to_code,
//       rate: parseFloat(newForm.rate),
//       effective_date: newForm.effective_date,
//       expiry_date: newForm.expiry_date,
//       updated_by: user?.email || 'system',
//     };

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         let msg = 'Create failed';
//         try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
//         return toast.error(msg);
//       }
//       toast.success('Created');
//       setShowNew(false);
//       fetchAll();
//     } catch {
//       toast.error('Network error creating rate');
//     }
//   };

//   // UPDATE — send full object (from_code fixed to MYR per requirement)
//   const updateRate = async () => {
//     if (!selected) return;

//     const errs = validateEdit();
//     setEditErrors(errs);
//     if (Object.keys(errs).length) return toast.error('Please fix the highlighted fields.');

//     const payload = {
//       bank_id: selected.bank_id,
//       from_code: BASE_FROM_CODE,       // fixed base currency
//       to_code: selected.to_code,
//       rate: parseFloat(editForm.rate),
//       effective_date: editForm.effective_date,
//       expiry_date: editForm.expiry_date,
//       updated_by: user?.email || 'system',
//     };

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/${selected.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         let msg = 'Update failed';
//         try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
//         throw new Error(msg);
//       }

//       toast.success('Updated');
//       setShowEdit(false);
//       fetchAll();
//     } catch (e: any) {
//       toast.error(e.message || 'Update failed');
//     }
//   };

//   // Delete
//   const openConfirmDelete = (row: Rate) => { setSelected(row); setConfirmOpen(true); };
//   const handleConfirmDelete = async () => {
//     if (!selected) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/${selected.id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error('Delete failed');
//       toast.success('Deleted');
//       setConfirmOpen(false);
//       setSelected(null);
//       fetchAll();
//     } catch (e: any) {
//       toast.error(e.message || 'Delete failed');
//     }
//   };

//   // History
//   const openHistory = async (bankId: number, code: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/history?bank_id=${bankId}&to_code=${code}`);
//       if (!res.ok) return toast.error('Failed to fetch history');
//       const data = await res.json();
//       const rows: RateHistory[] = Array.isArray(data) ? data : [];
//       rows.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
//       setHistory(rows);
//       setShowHistory(true);
//     } catch {
//       toast.error('Failed to fetch history');
//     }
//   };

//   const resetFilters = () => {
//     setSearch('');
//     setFilters({ bank: '', currency: '', status: 'All' });
//     setAmount(1);
//     setPage(1);
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Currency Rates</h1>
//           <p className="text-gray-600">Manage conversion rates and validity windows</p>
//         </div>

//         <div className="flex items-center gap-2">
//           {/* Optional import/export controls can be restored here */}
//           <button type="button" className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openNew}>
//             + Add Rate
//           </button>
//         </div>
//       </div>

//       {/* Info bar explaining conversion math */}
//       {/* <div className="mb-4 text-sm bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3">
//         Converted = <span className="font-mono">Amount × Rate</span>. Base currency is {label(BASE_FROM_CODE)}.
//         Example:&nbsp;
//         <span className="font-mono">
//           Amount {BASE_FROM_CODE} × Rate (1 {BASE_FROM_CODE} → TO) = Converted TO
//         </span>.
//       </div> */}

//       {/* Search + Filters */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="relative flex-1">
//           <input
//             className="input input-bordered w-full pl-10"
//             placeholder="Search by bank, currency code, or currency name..."
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//           />
//           <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
//                fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>

//         <button
//           type="button"
//           className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
//                      hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
//           onClick={() => setShowFilters(!showFilters)}
//           aria-expanded={showFilters}
//           aria-controls="rates-filters"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
//           </svg>
//           Filters
//         </button>
//       </div>

//       {showFilters && (
//         <div id="rates-filters" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Bank</span></label>
//               <select className="select select-bordered select-sm w-full"
//                       value={filters.bank}
//                       onChange={e => { setFilters(p => ({ ...p, bank: e.target.value })); setPage(1); }}>
//                 <option value="">All</option>
//                 {banks.map(b => <option key={b.id}>{b.bank_name}</option>)}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Currency</span></label>
//               <select className="select select-bordered select-sm w-full"
//                       value={filters.currency}
//                       onChange={e => { setFilters(p => ({ ...p, currency: e.target.value })); setPage(1); }}>
//                 <option value="">All</option>
//                 {codes.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Status</span></label>
//               <select className="select select-bordered select-sm w-full"
//                       value={filters.status}
//                       onChange={e => { setFilters(p => ({ ...p, status: e.target.value as any })); setPage(1); }}>
//                 <option>All</option>
//                 <option>Active</option>
//                 <option>Expired</option>
//                 <option>Expiring</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Amount (RM)</span></label>
//               <input type="number" min={1} className="input input-bordered input-sm"
//                      value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 1)} />
//             </div>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button type="button" className="btn btn-sm btn-ghost text-blue-600" onClick={resetFilters}>
//               Reset Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Result info */}
//       {filteredCount > 0 && (
//         <div className="text-sm text-gray-600 mb-2">
//           {isFiltered ? (
//             <>Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalRecords}</span> <span className="text-gray-500">(filtered)</span></>
//           ) : (
//             <>Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalRecords}</span></>
//           )}
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
//         <div className="overflow-x-auto">
//           <table className="table">
//             <thead className="bg-gray-50">
//               <tr>
//                 {visibleCols.bank && <th className="font-medium text-gray-700">Bank</th>}
//                 {visibleCols.conv && <th className="font-medium text-gray-700">Conversion</th>}
//                 {visibleCols.rate && <th className="font-medium text-gray-700">Rate</th>}
//                 {visibleCols.converted && <th className="font-medium text-gray-700">Converted</th>}
//                 {visibleCols.eff && <th className="font-medium text-gray-700">Valid From</th>}
//                 {visibleCols.exp && <th className="font-medium text-gray-700">Until</th>}
//                 {visibleCols.actions && <th className="font-medium text-gray-700">Actions</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {pageItems.length ? pageItems.map(r => {
//                 const rateNum = parseFloat(r.rate);
//                 const converted = (Number.isFinite(rateNum) ? rateNum : 0) * amount;
//                 return (
//                   <tr key={r.id}>
//                     {/* Bank */}
//                     {visibleCols.bank && <td className="font-medium">{r.bank_name}</td>}

//                     {/* Conversion (codes + friendly names + base line) */}
//                     {/* {visibleCols.conv && (
//                       <td>
//                         <div className="font-medium">
//                           {amount} {label(r.from_code)} → {label(r.to_code)}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           1 {r.from_code} = {Number.isFinite(rateNum) ? rateNum.toFixed(4) : '—'} {r.to_code}
//                         </div>
//                       </td>
//                     )} */}
//                     {/* Conversion (clear From/To layout) */}
// {visibleCols.conv && (
//   <td>
//     <div className="flex items-start gap-4">
//       {/* From */}
//       <div>
//         <div className="text-xs text-gray-500">From</div>
//         <div className="font-mono font-semibold">{r.from_code}</div>
//         <div className="text-xs text-gray-600">{codeNameMap[r.from_code] ?? ''}</div>
//       </div>

//       <div className="pt-5 text-gray-400">→</div>

//       {/* To */}
//       <div>
//         <div className="text-xs text-gray-500">To</div>
//         <div className="font-mono font-semibold">{r.to_code}</div>
//         <div className="text-xs text-gray-600">{codeNameMap[r.to_code] ?? ''}</div>
//       </div>
//     </div>

//     {/* Base rate line */}
//     {/* <div className="mt-1 text-xs text-gray-500">
//       1 {r.from_code} = {parseFloat(r.rate).toFixed(4)} {r.to_code}
//     </div> */}
//   </td>
// )}


//                     {/* Rate */}
//                     {visibleCols.rate && (
//                       <td className="font-mono">
//                         {Number.isFinite(rateNum) ? rateNum.toFixed(4) : '—'}
//                       </td>
//                     )}

//                     {/* Converted (explicit formula shown) */}
//                     {visibleCols.converted && (
//                       <td
//                         title={
//                           Number.isFinite(rateNum)
//                             ? `${amount} × ${rateNum.toFixed(4)} = ${converted.toFixed(4)}`
//                             : 'n/a'
//                         }
//                       >
//                         <div className="font-mono">
//                           {Number.isFinite(rateNum) ? `${converted.toFixed(4)} ${r.to_code}` : '—'}
//                         </div>
//                         {Number.isFinite(rateNum) && (
//                           <div className="text-xs text-gray-500">
//                             = {amount} × {rateNum.toFixed(4)}
//                           </div>
//                         )}
//                       </td>
//                     )}

//                     {/* Dates */}
//                     {visibleCols.eff && <td>{moment(r.effective_date).format('DD MMM YYYY')}</td>}
//                     {visibleCols.exp && (
//                       <td className="space-x-2">
//                         {moment(r.expiry_date).format('DD MMM YYYY')} {expiryBadge(r.expiry_date)}
//                       </td>
//                     )}

//                     {/* Actions */}
//                     {visibleCols.actions && (
//                       <td>
//                         <div className="flex gap-2">
//                           <button
//                             type="button"
//                             className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
//                             onClick={() => openEditModal(r)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
//                             onClick={() => openHistory(r.bank_id, r.to_code)}
//                           >
//                             History
//                           </button>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
//                             onClick={() => openConfirmDelete(r)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan={Object.values(visibleCols).filter(Boolean).length} className="text-center py-8 text-gray-500">
//                     No rates found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4">
//           <div className="join">
//             <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//                     disabled={page === 1} onClick={() => setPage(1)}>First</button>
//             <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//                     disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>«</button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
//               <button type="button" key={pn}
//                 className={`join-item btn btn-sm border border-gray-300 ${pn === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setPage(pn)}>{pn}</button>
//             ))}
//             <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//                     disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>»</button>
//             <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//                     disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</button>
//           </div>
//         </div>
//       )}

//       {/* Add Modal (responsive) */}
//       {showNew && (
//         <div
//           className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="add-rate-title"
//         >
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-screen-sm md:max-w-2xl lg:max-w-3xl">
//             {/* Header */}
//             <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
//               <div className="flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                 </svg>
//                 <h3 id="add-rate-title" className="text-lg font-semibold text-gray-800">
//                   Add Currency Rate
//                 </h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setShowNew(false)}
//                 className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Body */}
//             <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[70vh]">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Bank */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Bank <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <select
//                     className={`select select-bordered w-full ${newErrors.bank_id ? 'select-error' : ''}`}
//                     value={newForm.bank_id}
//                     onChange={(e) =>
//                       setNewForm({ ...newForm, bank_id: parseInt(e.target.value || '0', 10) })
//                     }
//                   >
//                     <option value={0}>Select Bank</option>
//                     {banks.map((b) => (
//                       <option key={b.id} value={b.id}>
//                         {b.bank_name}
//                       </option>
//                     ))}
//                   </select>
//                   {newErrors.bank_id && (
//                     <p className="mt-1 text-xs text-red-600">{newErrors.bank_id}</p>
//                   )}
//                 </div>

//                 {/* From */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">From Currency</span>
//                   </label>
//                   <input
//                     className="input input-bordered bg-gray-50 w-full"
//                     value={label(BASE_FROM_CODE)}
//                     readOnly
//                     disabled
//                   />
//                 </div>

//                 {/* To */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       To Currency <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <select
//                     className={`select select-bordered w-full ${newErrors.to_code ? 'select-error' : ''}`}
//                     value={newForm.to_code}
//                     onChange={(e) => setNewForm({ ...newForm, to_code: e.target.value })}
//                   >
//                     <option value="">Select currency</option>
//                     {codes.map((c) => (
//                       <option key={c.code} value={c.code}>
//                         {c.code} — {c.name}
//                       </option>
//                     ))}
//                   </select>
//                   {newErrors.to_code && (
//                     <p className="mt-1 text-xs text-red-600">{newErrors.to_code}</p>
//                   )}
//                 </div>

//                 {/* Rate */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Rate <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <input
//                     className={`input input-bordered w-full ${newErrors.rate ? 'input-error' : ''}`}
//                     type="number"
//                     step="0.0001"
//                     inputMode="decimal"
//                     placeholder="0.0000"
//                     value={newForm.rate}
//                     onChange={(e) => setNewForm({ ...newForm, rate: e.target.value })}
//                   />
//                   {newErrors.rate && (
//                     <p className="mt-1 text-xs text-red-600">{newErrors.rate}</p>
//                   )}
//                 </div>

//                 {/* Dates */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Valid From <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <input
//                     className={`input input-bordered w-full ${newErrors.effective_date ? 'input-error' : ''}`}
//                     type="date"
//                     value={newForm.effective_date}
//                     onChange={(e) => setNewForm({ ...newForm, effective_date: e.target.value })}
//                   />
//                   {newErrors.effective_date && (
//                     <p className="mt-1 text-xs text-red-600">{newErrors.effective_date}</p>
//                   )}
//                 </div>

//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Until <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <input
//                     className={`input input-bordered w-full ${newErrors.expiry_date ? 'input-error' : ''}`}
//                     type="date"
//                     value={newForm.expiry_date}
//                     onChange={(e) => setNewForm({ ...newForm, expiry_date: e.target.value })}
//                   />
//                   {newErrors.expiry_date && (
//                     <p className="mt-1 text-xs text-red-600">{newErrors.expiry_date}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
//               <button
//                 type="button"
//                 className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
//                 onClick={() => setShowNew(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="btn bg-blue-600 hover:bg-blue-700 text-white border-0 w-full sm:w-auto"
//                 onClick={addRate}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal (responsive) */}
//       {showEdit && selected && (
//         <div
//           className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="edit-rate-title"
//         >
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-screen-sm md:max-w-2xl lg:max-w-3xl">
//             {/* Header */}
//             <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
//               <div className="flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2M5 11h14M12 5v14" />
//                 </svg>
//                 <h3 id="edit-rate-title" className="text-lg font-semibold text-gray-800">
//                   Edit Currency Rate
//                 </h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setShowEdit(false)}
//                 className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Body */}
//             <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[70vh]">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {/* Bank (read-only) */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">Bank</span>
//                   </label>
//                   <input
//                     className="input input-bordered bg-gray-50 w-full"
//                     value={selected.bank_name}
//                     readOnly
//                   />
//                 </div>

//                 {/* From Currency (read-only) */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">From Currency</span>
//                   </label>
//                   <input
//                     className="input input-bordered bg-gray-50 w-full"
//                     value={label(BASE_FROM_CODE)}
//                     readOnly
//                   />
//                 </div>

//                 {/* To Currency (read-only) */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">To Currency</span>
//                   </label>
//                   <input
//                     className="input input-bordered bg-gray-50 w-full"
//                     value={label(selected.to_code)}
//                     readOnly
//                   />
//                 </div>

//                 {/* Rate */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Rate <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <input
//                     className={`input input-bordered w-full ${editErrors.rate ? 'input-error' : ''}`}
//                     type="number"
//                     step="0.0001"
//                     inputMode="decimal"
//                     value={editForm.rate}
//                     onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
//                   />
//                   {editErrors.rate && (
//                     <p className="mt-1 text-xs text-red-600">{editErrors.rate}</p>
//                   )}
//                 </div>

//                 {/* Valid From */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Valid From <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <input
//                     className={`input input-bordered w-full ${editErrors.effective_date ? 'input-error' : ''}`}
//                     type="date"
//                     value={editForm.effective_date}
//                     onChange={(e) => setEditForm({ ...editForm, effective_date: e.target.value })}
//                   />
//                   {editErrors.effective_date && (
//                     <p className="mt-1 text-xs text-red-600">{editErrors.effective_date}</p>
//                   )}
//                 </div>

//                 {/* Until */}
//                 <div className="form-control min-w-0">
//                   <label className="label">
//                     <span className="label-text font-medium">
//                       Until <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <input
//                     className={`input input-bordered w-full ${editErrors.expiry_date ? 'input-error' : ''}`}
//                     type="date"
//                     value={editForm.expiry_date}
//                     onChange={(e) => setEditForm({ ...editForm, expiry_date: e.target.value })}
//                   />
//                   {editErrors.expiry_date && (
//                     <p className="mt-1 text-xs text-red-600">{editErrors.expiry_date}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
//               <button
//                 type="button"
//                 className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
//                 onClick={() => setShowEdit(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="btn bg-blue-600 hover:bg-blue-700 text-white border-0 w-full sm:w-auto"
//                 onClick={updateRate}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Delete */}
//       {confirmOpen && selected && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
//             <div className="px-6 py-4 border-b">
//               <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
//             </div>
//             <div className="px-6 py-5 text-gray-700 space-y-3">
//               <p>Delete rate for <b>{selected.bank_name}</b> ({BASE_FROM_CODE} → {selected.to_code})? This action cannot be undone.</p>
//             </div>
//             <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
//               <button type="button" className="btn btn-outline" onClick={() => { setConfirmOpen(false); setSelected(null); }}>Cancel</button>
//               <button type="button" className="btn btn-error text-white" onClick={handleConfirmDelete}>Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* History */}
//       {showHistory && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-100">
//             <div className="flex items-center justify-between border-b px-6 py-4 rounded-t-2xl">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Rate History
//                   {selected && (
//                     <span className="ml-2 text-sm font-normal text-gray-500">
//                       — {selected.bank_name} ({label(BASE_FROM_CODE)} → {label(selected.to_code)})
//                     </span>
//                   )}
//                 </h3>
//                 <p className="text-xs text-gray-500 mt-0.5">Showing the last changes with deltas, who updated, and validity window</p>
//               </div>
//               <button type="button" className="btn btn-sm btn-ghost hover:bg-gray-100" onClick={() => setShowHistory(false)}>✕</button>
//             </div>

//             <div className="max-h-[70vh] overflow-y-auto rounded-b-2xl">
//               <table className="table table-zebra">
//                 <thead className="sticky top-0 bg-gray-50 z-10 border-b">
//                   <tr className="text-gray-700">
//                     <th className="font-medium">Old → New</th>
//                     <th className="font-medium w-48">Change</th>
//                     <th className="font-medium">Updated By</th>
//                     <th className="font-medium">Updated At</th>
//                     <th className="font-medium">Valid From</th>
//                     <th className="font-medium">Until</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.length ? history.map(h => {
//                     const oldNum = parseFloat(h.old_rate ?? '');
//                     const newNum = parseFloat(h.new_rate ?? '');
//                     const hasBoth = Number.isFinite(oldNum) && Number.isFinite(newNum) && oldNum > 0;
//                     const diff = hasBoth ? newNum - oldNum : 0;
//                     const pct = hasBoth ? (diff / oldNum) * 100 : 0;
//                     const arrow = !hasBoth ? '→' : diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
//                     const color = !hasBoth ? 'text-gray-500' : diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500';
//                     const chipClass = !hasBoth ? 'bg-gray-100 text-gray-700'
//                       : diff > 0 ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
//                       : diff < 0 ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
//                       : 'bg-gray-100 text-gray-700';

//                     return (
//                       <tr key={h.id}>
//                         <td className="align-middle">
//                           <div className="flex items-center gap-2">
//                             <span className="font-mono tabular-nums">{Number.isFinite(oldNum) ? oldNum.toFixed(4) : '—'}</span>
//                             <span className="text-gray-400">→</span>
//                             <span className="font-mono tabular-nums">{Number.isFinite(newNum) ? newNum.toFixed(4) : '—'}</span>
//                           </div>
//                         </td>
//                         <td className="align-middle">
//                           <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm ${chipClass}`}>
//                             <span className={`text-base leading-none ${color}`}>{arrow}</span>
//                             {hasBoth ? (
//                               <div className="flex items-baseline gap-2">
//                                 <span className="font-mono tabular-nums">{Math.abs(diff).toFixed(4)}</span>
//                                 <span className="text-xs font-medium text-gray-500">
//                                   (<span className="font-mono tabular-nums">{Math.abs(pct).toFixed(2)}%</span>)
//                                 </span>
//                               </div>
//                             ) : <span className="text-xs text-gray-500">n/a</span>}
//                           </div>
//                         </td>
//                         <td className="align-middle">{h.updated_by ?? <span className="text-gray-400">—</span>}</td>
//                         <td className="align-middle whitespace-nowrap"><span className="font-mono tabular-nums">{moment(h.updated_at).format('DD MMM YYYY, HH:mm')}</span></td>
//                         <td className="align-middle whitespace-nowrap"><span className="font-mono tabular-nums">{moment(h.effective_date).format('DD MMM YYYY')}</span></td>
//                         <td className="align-middle whitespace-nowrap"><span className="font-mono tabular-nums">{moment(h.expiry_date).format('DD MMM YYYY')}</span></td>
//                       </tr>
//                     );
//                   }) : (
//                     <tr>
//                       <td colSpan={6} className="py-12">
//                         <div className="flex flex-col items-center justify-center text-center">
//                           <div className="rounded-full bg-gray-100 p-3 mb-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                           </div>
//                           <p className="text-sm text-gray-600">No history to display</p>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // ---------- helpers (inside component) ----------
//   async function importCsv(file: File) {
//     const text = await file.text();
//     const [_, ...lines] = text.split(/\r?\n/).filter(Boolean);
//     for (const line of lines) {
//       const [bankName, _fromIgnored, to, rate, eff, exp] = line.split(',');
//       const bank = banks.find(b => b.bank_name === bankName?.trim());
//       if (!bank || !to) continue;
//       await fetch(`${API_BASE_URL}/api/bank-currency/rates`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           bank_id: bank.id,
//           from_code: BASE_FROM_CODE, // force MYR for imports
//           to_code: to.trim().toUpperCase().slice(0, 3),
//           rate: parseFloat(rate || '0'),
//           effective_date: eff || moment().format('YYYY-MM-DD'),
//           expiry_date: exp || moment().add(1, 'month').format('YYYY-MM-DD'),
//           updated_by: user?.email || 'system',
//         }),
//       });
//     }
//     toast.success('CSV imported');
//     fetchAll();
//   }

//   function exportCsv() {
//     const header = 'Bank,From,To,Rate,EffectiveDate,ExpiryDate,Status';
//     const rows = rates.map(r =>
//       [r.bank_name, r.from_code, r.to_code, r.rate, r.effective_date, r.expiry_date, moment().isAfter(moment(r.expiry_date), 'day') ? 'Expired' : 'Active'].join(',')
//     );
//     const csv = [header, ...rows].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url; a.download = 'currency-rates.csv'; a.click();
//     URL.revokeObjectURL(url);
//   }
// }

// ----------------------------------------------------------------------
// File: app/admins/bank-currency/Tabs/CurrencyRatesTab.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface Rate {
  id: number;
  bank_id: number | null;           // now nullable
  bank_name?: string | null;        // may be null/undefined; UI no longer uses it
  from_code: string;
  to_code: string;
  rate: string;
  effective_date: string;
  expiry_date: string;
  is_expired: number;
}

interface RateHistory {
  id: number;
  currency_rate_id: number;
  bank_id: number | null;
  from_code: string;
  to_code: string;
  old_rate: string;
  new_rate: string;
  effective_date: string;
  expiry_date: string;
  updated_by: string | null;
  updated_at: string;
}

interface Currency { code: string; name: string; }
interface User { id: number; name: string; email: string; role: string; }

const PAGE_SIZE = 10;
const BASE_FROM_CODE = 'MYR';

export default function CurrencyRatesTab() {
  // Data
  const [rates, setRates] = useState<Rate[]>([]);
  const [codes, setCodes] = useState<Currency[]>([]);

  // Logged-in user
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem('hrms_user');
    if (raw) { try { setUser(JSON.parse(raw)); } catch {} }
  }, []);

  // Filters / columns / paging
  const [filters, setFilters] = useState({
    currency: '',
    status: 'All' as 'All' | 'Active' | 'Expired' | 'Expiring',
  });
  const [amount, setAmount] = useState(1);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    conv: true, rate: true, converted: true, eff: true, exp: true, actions: true,
  });
  const [page, setPage] = useState(1);

  // Modals & selection
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selected, setSelected] = useState<Rate | null>(null);
  const [history, setHistory] = useState<RateHistory[]>([]);

  // Forms + errors
  const [newForm, setNewForm] = useState({
    to_code: '',
    rate: '',
    effective_date: moment().format('YYYY-MM-DD'),
    expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
  });
  const [editForm, setEditForm] = useState({
    rate: '',
    effective_date: moment().format('YYYY-MM-DD'),
    expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
  });
  const [newErrors, setNewErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Fetch rates + currencies
  const fetchAll = async () => {
    try {
      const ratesResp = await fetch(`${API_BASE_URL}/api/bank-currency/rates`);
      const r = ratesResp.ok
        ? await ratesResp.json()
        : await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`).then(res => res.json());

      const c = await fetch(`${API_BASE_URL}/api/bank-currency/currencies`).then(r => r.json());

      setRates(Array.isArray(r) ? r : []);
      setCodes(Array.isArray(c) ? c : []);
    } catch {
      toast.error('Failed to load rates');
    }
  };
  useEffect(() => { fetchAll(); }, []);

  // Map code -> friendly name
  const codeNameMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of codes) m[c.code] = c.name;
    return m;
  }, [codes]);

  const label = (code: string) =>
    `${code}${codeNameMap[code] ? ` — ${codeNameMap[code]}` : ''}`;

  // Status calculation based on dates
  const now = moment();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rates.filter(r => {
      const eff = moment(r.effective_date);
      const exp = moment(r.expiry_date);
      const isActive = now.isSameOrAfter(eff, 'day') && now.isSameOrBefore(exp, 'day');
      const daysToExp = exp.diff(now, 'days');
      const isExpiring = isActive && daysToExp >= 0 && daysToExp <= 7;
      const isExpired = now.isAfter(exp, 'day');

      const statusOk =
        filters.status === 'All' ||
        (filters.status === 'Active' && isActive) ||
        (filters.status === 'Expired' && isExpired) ||
        (filters.status === 'Expiring' && isExpiring);

      return (
        (!q ||
          r.to_code.toLowerCase().includes(q) ||
          r.from_code.toLowerCase().includes(q) ||
          (codeNameMap[r.to_code]?.toLowerCase().includes(q)) ||
          (codeNameMap[r.from_code]?.toLowerCase().includes(q))
        ) &&
        (!filters.currency || r.to_code === filters.currency) &&
        statusOk
      );
    });
  }, [rates, search, filters, now, codeNameMap]);

  // Paging helpers
  const totalRecords = rates.length;
  const filteredCount = filtered.length;
  const isFiltered = useMemo(
    () => search.trim() !== '' || filters.currency !== '' || filters.status !== 'All',
    [search, filters]
  );
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );
  const startIndex = filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(page * PAGE_SIZE, filteredCount);

  // UI helpers
  const expiryBadge = (exp: string) => {
    const days = moment(exp).diff(moment(), 'days');
    if (days < 0) return <span className="badge badge-error">Expired</span>;
    if (days <= 3) return <span className="badge badge-error">Expires in {days}d</span>;
    if (days <= 7) return <span className="badge badge-warning">Expires in {days}d</span>;
    return null;
  };

  // Validation
  const validateNew = (f = newForm) => {
    const e: Record<string,string> = {};
    if (!f.to_code) e.to_code = 'To currency is required';
    const rateNum = parseFloat(f.rate);
    if (!f.rate || !Number.isFinite(rateNum) || rateNum <= 0) e.rate = 'Rate must be a positive number';
    if (!f.effective_date) e.effective_date = 'Valid From is required';
    if (!f.expiry_date) e.expiry_date = 'Until is required';
    if (f.effective_date && f.expiry_date && moment(f.effective_date).isAfter(moment(f.expiry_date))) {
      e.expiry_date = 'Until must be after Valid From';
    }
    if (f.to_code && f.to_code === BASE_FROM_CODE) e.to_code = `To currency must be different from ${BASE_FROM_CODE}`;
    return e;
  };
  const validateEdit = (f = editForm) => {
    const e: Record<string,string> = {};
    const rateNum = parseFloat(f.rate);
    if (!f.rate || !Number.isFinite(rateNum) || rateNum <= 0) e.rate = 'Rate must be a positive number';
    if (!f.effective_date) e.effective_date = 'Valid From is required';
    if (!f.expiry_date) e.expiry_date = 'Until is required';
    if (f.effective_date && f.expiry_date && moment(f.effective_date).isAfter(moment(f.expiry_date))) {
      e.expiry_date = 'Until must be after Valid From';
    }
    return e;
  };

  // Open Add
  const openNew = () => {
    setConfirmOpen(false);
    setShowEdit(false);
    setSelected(null);
    setNewForm({
      to_code: '',
      rate: '',
      effective_date: moment().format('YYYY-MM-DD'),
      expiry_date: moment().add(1, 'month').format('YYYY-MM-DD'),
    });
    setNewErrors({});
    setShowNew(true);
  };

  // Open Edit
  const openEditModal = (r: Rate) => {
    setConfirmOpen(false);
    setSelected(r);
    setEditForm({
      rate: String(r.rate),
      effective_date: moment(r.effective_date).format('YYYY-MM-DD'),
      expiry_date: moment(r.expiry_date).format('YYYY-MM-DD'),
    });
    setEditErrors({});
    setShowEdit(true);
  };

  // Create
  const addRate = async () => {
    const errs = validateNew();
    setNewErrors(errs);
    if (Object.keys(errs).length) return toast.error('Please fix the highlighted fields.');

    // prevent active-window overlap for the same pair (from=MYR, to=selected)
    const overlap = rates.some(r =>
      r.from_code === BASE_FROM_CODE &&
      r.to_code === newForm.to_code &&
      moment(newForm.effective_date).isBefore(r.expiry_date) &&
      moment(newForm.expiry_date).isAfter(r.effective_date)
    );
    if (overlap) return toast.error('Active window overlaps for the same currency pair');

    const payload = {
      bank_id: null,                        // << removed bank, always null
      from_code: BASE_FROM_CODE,
      to_code: newForm.to_code,
      rate: parseFloat(newForm.rate),
      effective_date: newForm.effective_date,
      expiry_date: newForm.expiry_date,
      updated_by: user?.email || 'system',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = 'Create failed';
        try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
        return toast.error(msg);
      }
      toast.success('Created');
      setShowNew(false);
      fetchAll();
    } catch {
      toast.error('Network error creating rate');
    }
  };

  // UPDATE — bank_id stays null
  const updateRate = async () => {
    if (!selected) return;

    const errs = validateEdit();
    setEditErrors(errs);
    if (Object.keys(errs).length) return toast.error('Please fix the highlighted fields.');

    const payload = {
      bank_id: null,                        // << keep null
      from_code: BASE_FROM_CODE,
      to_code: selected.to_code,
      rate: parseFloat(editForm.rate),
      effective_date: editForm.effective_date,
      expiry_date: editForm.expiry_date,
      updated_by: user?.email || 'system',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = 'Update failed';
        try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
        throw new Error(msg);
      }

      toast.success('Updated');
      setShowEdit(false);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    }
  };

  // Delete
  const openConfirmDelete = (row: Rate) => { setSelected(row); setConfirmOpen(true); };
  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/rates/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      setConfirmOpen(false);
      setSelected(null);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  // History (no bank)
  const openHistory = async (code: string) => {
    try {
      const url = `${API_BASE_URL}/api/bank-currency/rates/history?to_code=${encodeURIComponent(code)}&from_code=${BASE_FROM_CODE}`;
      const res = await fetch(url);
      if (!res.ok) return toast.error('Failed to fetch history');
      const data = await res.json();
      const rows: RateHistory[] = Array.isArray(data) ? data : [];
      rows.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setHistory(rows);
      setShowHistory(true);
    } catch {
      toast.error('Failed to fetch history');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({ currency: '', status: 'All' });
    setAmount(1);
    setPage(1);
  };

  const visibleCount = Object.values(visibleCols).filter(Boolean).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Currency Rates</h1>
          <p className="text-gray-600">Manage conversion rates and validity windows</p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openNew}>
            + Add Rate
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search by currency code or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
                     hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="rates-filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
        </button>
      </div>

      {showFilters && (
        <div id="rates-filters" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Currency</span></label>
              <select className="select select-bordered select-sm w-full"
                      value={filters.currency}
                      onChange={e => { setFilters(p => ({ ...p, currency: e.target.value })); setPage(1); }}>
                <option value="">All</option>
                {codes.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Status</span></label>
              <select className="select select-bordered select-sm w-full"
                      value={filters.status}
                      onChange={e => { setFilters(p => ({ ...p, status: e.target.value as any })); setPage(1); }}>
                <option>All</option>
                <option>Active</option>
                <option>Expired</option>
                <option>Expiring</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Amount (RM)</span></label>
              <input type="number" min={1} className="input input-bordered input-sm"
                     value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 1)} />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button type="button" className="btn btn-sm btn-ghost text-blue-600" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Result info */}
      {filteredCount > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          {isFiltered ? (
            <>Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalRecords}</span> <span className="text-gray-500">(filtered)</span></>
          ) : (
            <>Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalRecords}</span></>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                {visibleCols.conv && <th className="font-medium text-gray-700">Conversion</th>}
                {visibleCols.rate && <th className="font-medium text-gray-700">Rate</th>}
                {visibleCols.converted && <th className="font-medium text-gray-700">Converted</th>}
                {visibleCols.eff && <th className="font-medium text-gray-700">Valid From</th>}
                {visibleCols.exp && <th className="font-medium text-gray-700">Until</th>}
                {visibleCols.actions && <th className="font-medium text-gray-700">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageItems.length ? pageItems.map(r => {
                const rateNum = parseFloat(r.rate);
                const converted = (Number.isFinite(rateNum) ? rateNum : 0) * amount;
                return (
                  <tr key={r.id}>
                    {/* Conversion */}
                    {visibleCols.conv && (
                      <td>
                        <div className="flex items-start gap-4">
                          {/* From */}
                          <div>
                            <div className="text-xs text-gray-500">From</div>
                            <div className="font-mono font-semibold">{r.from_code}</div>
                            <div className="text-xs text-gray-600">{codeNameMap[r.from_code] ?? ''}</div>
                          </div>

                          <div className="pt-5 text-gray-400">→</div>

                          {/* To */}
                          <div>
                            <div className="text-xs text-gray-500">To</div>
                            <div className="font-mono font-semibold">{r.to_code}</div>
                            <div className="text-xs text-gray-600">{codeNameMap[r.to_code] ?? ''}</div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Rate */}
                    {visibleCols.rate && (
                      <td className="font-mono">
                        {Number.isFinite(rateNum) ? rateNum.toFixed(4) : '—'}
                      </td>
                    )}

                    {/* Converted */}
                    {visibleCols.converted && (
                      <td
                        title={
                          Number.isFinite(rateNum)
                            ? `${amount} × ${rateNum.toFixed(4)} = ${converted.toFixed(4)}`
                            : 'n/a'
                        }
                      >
                        <div className="font-mono">
                          {Number.isFinite(rateNum) ? `${converted.toFixed(4)} ${r.to_code}` : '—'}
                        </div>
                        {Number.isFinite(rateNum) && (
                          <div className="text-xs text-gray-500">
                            = {amount} × {rateNum.toFixed(4)}
                          </div>
                        )}
                      </td>
                    )}

                    {/* Dates */}
                    {visibleCols.eff && <td>{moment(r.effective_date).format('DD MMM YYYY')}</td>}
                    {visibleCols.exp && (
                      <td className="space-x-2">
                        {moment(r.expiry_date).format('DD MMM YYYY')} {expiryBadge(r.expiry_date)}
                      </td>
                    )}

                    {/* Actions */}
                    {visibleCols.actions && (
                      <td>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
                            onClick={() => openEditModal(r)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                            onClick={() => openHistory(r.to_code)}
                          >
                            History
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                            onClick={() => openConfirmDelete(r)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={visibleCount} className="text-center py-8 text-gray-500">
                    No rates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={page === 1} onClick={() => setPage(1)}>First</button>
            <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>«</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
              <button type="button" key={pn}
                className={`join-item btn btn-sm border border-gray-300 ${pn === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setPage(pn)}>{pn}</button>
            ))}
            <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>»</button>
            <button type="button" className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</button>
          </div>
        </div>
      )}

      {/* Add Modal (no Bank field) */}
      {showNew && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-rate-title">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-screen-sm md:max-w-2xl lg:max-w-3xl">
            <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
              <h3 id="add-rate-title" className="text-lg font-semibold text-gray-800">Add Currency Rate</h3>
              <button type="button" onClick={() => setShowNew(false)} className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
            </div>

            <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From (read-only) */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">From Currency</span></label>
                  <input className="input input-bordered bg-gray-50 w-full" value={label(BASE_FROM_CODE)} readOnly disabled />
                </div>

                {/* To */}
                <div className="form-control min-w-0">
                  <label className="label">
                    <span className="label-text font-medium">To Currency <span className="text-red-500">*</span></span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${newErrors.to_code ? 'select-error' : ''}`}
                    value={newForm.to_code}
                    onChange={(e) => setNewForm({ ...newForm, to_code: e.target.value })}
                  >
                    <option value="">Select currency</option>
                    {codes.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                  {newErrors.to_code && <p className="mt-1 text-xs text-red-600">{newErrors.to_code}</p>}
                </div>

                {/* Rate */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">Rate <span className="text-red-500">*</span></span></label>
                  <input
                    className={`input input-bordered w-full ${newErrors.rate ? 'input-error' : ''}`}
                    type="number" step="0.0001" inputMode="decimal" placeholder="0.0000"
                    value={newForm.rate} onChange={(e) => setNewForm({ ...newForm, rate: e.target.value })}
                  />
                  {newErrors.rate && <p className="mt-1 text-xs text-red-600">{newErrors.rate}</p>}
                </div>

                {/* Dates */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">Valid From <span className="text-red-500">*</span></span></label>
                  <input
                    className={`input input-bordered w-full ${newErrors.effective_date ? 'input-error' : ''}`}
                    type="date" value={newForm.effective_date}
                    onChange={(e) => setNewForm({ ...newForm, effective_date: e.target.value })}
                  />
                  {newErrors.effective_date && <p className="mt-1 text-xs text-red-600">{newErrors.effective_date}</p>}
                </div>

                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">Until <span className="text-red-500">*</span></span></label>
                  <input
                    className={`input input-bordered w-full ${newErrors.expiry_date ? 'input-error' : ''}`}
                    type="date" value={newForm.expiry_date}
                    onChange={(e) => setNewForm({ ...newForm, expiry_date: e.target.value })}
                  />
                  {newErrors.expiry_date && <p className="mt-1 text-xs text-red-600">{newErrors.expiry_date}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <button type="button" className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto" onClick={() => setShowNew(false)}>Cancel</button>
              <button type="button" className="btn bg-blue-600 hover:bg-blue-700 text-white border-0 w-full sm:w-auto" onClick={addRate}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (no Bank field) */}
      {showEdit && selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-rate-title">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-screen-sm md:max-w-2xl lg:max-w-3xl">
            <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
              <h3 id="edit-rate-title" className="text-lg font-semibold text-gray-800">Edit Currency Rate</h3>
              <button type="button" onClick={() => setShowEdit(false)} className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
            </div>

            <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Currency (read-only) */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">From Currency</span></label>
                  <input className="input input-bordered bg-gray-50 w-full" value={label(BASE_FROM_CODE)} readOnly />
                </div>

                {/* To Currency (read-only) */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">To Currency</span></label>
                  <input className="input input-bordered bg-gray-50 w-full" value={label(selected.to_code)} readOnly />
                </div>

                {/* Rate */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">Rate <span className="text-red-500">*</span></span></label>
                  <input
                    className={`input input-bordered w-full ${editErrors.rate ? 'input-error' : ''}`}
                    type="number" step="0.0001" inputMode="decimal"
                    value={editForm.rate} onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
                  />
                  {editErrors.rate && <p className="mt-1 text-xs text-red-600">{editErrors.rate}</p>}
                </div>

                {/* Valid From */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">Valid From <span className="text-red-500">*</span></span></label>
                  <input
                    className={`input input-bordered w-full ${editErrors.effective_date ? 'input-error' : ''}`}
                    type="date" value={editForm.effective_date}
                    onChange={(e) => setEditForm({ ...editForm, effective_date: e.target.value })}
                  />
                  {editErrors.effective_date && <p className="mt-1 text-xs text-red-600">{editErrors.effective_date}</p>}
                </div>

                {/* Until */}
                <div className="form-control min-w-0">
                  <label className="label"><span className="label-text font-medium">Until <span className="text-red-500">*</span></span></label>
                  <input
                    className={`input input-bordered w-full ${editErrors.expiry_date ? 'input-error' : ''}`}
                    type="date" value={editForm.expiry_date}
                    onChange={(e) => setEditForm({ ...editForm, expiry_date: e.target.value })}
                  />
                  {editErrors.expiry_date && <p className="mt-1 text-xs text-red-600">{editErrors.expiry_date}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <button type="button" className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto" onClick={() => setShowEdit(false)}>Cancel</button>
              <button type="button" className="btn bg-blue-600 hover:bg-blue-700 text-white border-0 w-full sm:w-auto" onClick={updateRate}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmOpen && selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <div className="px-6 py-5 text-gray-700 space-y-3">
              <p>Delete rate for <b>{BASE_FROM_CODE} → {selected.to_code}</b>? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button type="button" className="btn btn-outline" onClick={() => { setConfirmOpen(false); setSelected(null); }}>Cancel</button>
              <button type="button" className="btn btn-error text-white" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-100">
            <div className="flex items-center justify-between border-b px-6 py-4 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Rate History
                  {selected && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      — {label(BASE_FROM_CODE)} → {label(selected.to_code)}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Showing the last changes with deltas, who updated, and validity window</p>
              </div>
              <button type="button" className="btn btn-sm btn-ghost hover:bg-gray-100" onClick={() => setShowHistory(false)}>✕</button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto rounded-b-2xl">
              <table className="table table-zebra">
                <thead className="sticky top-0 bg-gray-50 z-10 border-b">
                  <tr className="text-gray-700">
                    <th className="font-medium">Old → New</th>
                    <th className="font-medium w-48">Change</th>
                    <th className="font-medium">Updated By</th>
                    <th className="font-medium">Updated At</th>
                    <th className="font-medium">Valid From</th>
                    <th className="font-medium">Until</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length ? history.map(h => {
                    const oldNum = parseFloat(h.old_rate ?? '');
                    const newNum = parseFloat(h.new_rate ?? '');
                    const hasBoth = Number.isFinite(oldNum) && Number.isFinite(newNum) && oldNum > 0;
                    const diff = hasBoth ? newNum - oldNum : 0;
                    const pct = hasBoth ? (diff / oldNum) * 100 : 0;
                    const arrow = !hasBoth ? '→' : diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
                    const color = !hasBoth ? 'text-gray-500' : diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500';
                    const chipClass = !hasBoth ? 'bg-gray-100 text-gray-700'
                      : diff > 0 ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                      : diff < 0 ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                      : 'bg-gray-100 text-gray-700';

                    return (
                      <tr key={h.id}>
                        <td className="align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-mono tabular-nums">{Number.isFinite(oldNum) ? oldNum.toFixed(4) : '—'}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-mono tabular-nums">{Number.isFinite(newNum) ? newNum.toFixed(4) : '—'}</span>
                          </div>
                        </td>
                        <td className="align-middle">
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm ${chipClass}`}>
                            <span className={`text-base leading-none ${color}`}>{arrow}</span>
                            {hasBoth ? (
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono tabular-nums">{Math.abs(diff).toFixed(4)}</span>
                                <span className="text-xs font-medium text-gray-500">
                                  (<span className="font-mono tabular-nums">{Math.abs(pct).toFixed(2)}%</span>)
                                </span>
                              </div>
                            ) : <span className="text-xs text-gray-500">n/a</span>}
                          </div>
                        </td>
                        <td className="align-middle">{h.updated_by ?? <span className="text-gray-400">—</span>}</td>
                        <td className="align-middle whitespace-nowrap"><span className="font-mono tabular-nums">{moment(h.updated_at).format('DD MMM YYYY, HH:mm')}</span></td>
                        <td className="align-middle whitespace-nowrap"><span className="font-mono tabular-nums">{moment(h.effective_date).format('DD MMM YYYY')}</span></td>
                        <td className="align-middle whitespace-nowrap"><span className="font-mono tabular-nums">{moment(h.expiry_date).format('DD MMM YYYY')}</span></td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="rounded-full bg-gray-100 p-3 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">No history to display</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ---------- helpers (inside component) ----------
  async function importCsv(file: File) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const [header, ...rows] = lines;

    // Support both old (with Bank) and new (without Bank) CSVs
    // Old header: Bank,From,To,Rate,EffectiveDate,ExpiryDate,Status
    // New header: From,To,Rate,EffectiveDate,ExpiryDate,Status
    const hasBank = /^bank/i.test(header?.split(',')[0] || '');

    for (const line of rows) {
      const parts = line.split(',');
      const from = hasBank ? parts[1] : parts[0];
      const to = hasBank ? parts[2] : parts[1];
      const rate = hasBank ? parts[3] : parts[2];
      const eff = hasBank ? parts[4] : parts[3];
      const exp = hasBank ? parts[5] : parts[4];

      if (!to) continue;

      await fetch(`${API_BASE_URL}/api/bank-currency/rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bank_id: null,                                 // << no bank
          from_code: (from || BASE_FROM_CODE).trim().toUpperCase().slice(0, 3),
          to_code: to.trim().toUpperCase().slice(0, 3),
          rate: parseFloat(rate || '0'),
          effective_date: eff || moment().format('YYYY-MM-DD'),
          expiry_date: exp || moment().add(1, 'month').format('YYYY-MM-DD'),
          updated_by: user?.email || 'system',
        }),
      });
    }
    toast.success('CSV imported');
    fetchAll();
  }

  function exportCsv() {
    // New export (no Bank column)
    const header = 'From,To,Rate,EffectiveDate,ExpiryDate,Status';
    const rows = rates.map(r =>
      [r.from_code, r.to_code, r.rate, r.effective_date, r.expiry_date,
       moment().isAfter(moment(r.expiry_date), 'day') ? 'Expired' : 'Active'].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'currency-rates.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
