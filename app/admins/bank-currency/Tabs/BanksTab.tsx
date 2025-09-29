// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '@/app/config';

// interface Bank {
//   id: number;
//   name: string;
//   currency_code: string;
//   type: string;
//   status: 'Active' | 'Inactive';
// }

// interface Currency {
//   code: string;
//   name: string;
// }

// const PAGE_SIZE = 10;

// export default function BanksTab() {
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [currencies, setCurrencies] = useState<Currency[]>([]);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
//   const [currencyFilter, setCurrencyFilter] = useState<string>('All');
//   const [page, setPage] = useState(1);
//   const [showFilters, setShowFilters] = useState(false);

  
//   //delete
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [toDelete, setToDelete] = useState<Bank | null>(null);

  
// const openConfirmDelete = (bank: Bank) => {
//   setToDelete(bank);
//   setConfirmOpen(true);
// };

// const handleConfirmDelete = async () => {
//   if (!toDelete) return;
//   try {
//     const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks/${toDelete.id}`, {
//       method: 'DELETE',
//     });
//     if (!res.ok) throw new Error('Delete failed');
//     toast.success(`Deleted "${toDelete.name}"`);
//     setConfirmOpen(false);
//     setToDelete(null);
//     await fetchBanks();
//   } catch (e: any) {
//     toast.error(e.message || 'Delete failed');
//   }
// };

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [form, setForm] = useState<Bank>({ 
//     id: 0, 
//     name: '', 
//     currency_code: 'USD', 
//     type: 'Bank', 
//     status: 'Active' 
//   });

//   const fetchBanks = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks`);
//       const data = await res.json();
//       const normalized = (Array.isArray(data) ? data : []).map((b: any) => ({
//         id: b.id,
//         name: b.bank_name ?? b.name,
//         currency_code: b.currency_code,
//         type: b.type ?? 'Bank',
//         status: (b.status as 'Active' | 'Inactive') ?? 'Active',
//       }));
//       setBanks(normalized);
//     } catch {
//       toast.error('Failed to load banks');
//     }
//   };

//   const fetchCurrencies = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/bank-currency/currencies`);
//       const data = await res.json();
//       setCurrencies(Array.isArray(data) ? data.map((c: any) => ({
//         code: c.code,
//         name: c.name
//       })) : []);
//     } catch {
//       toast.error('Failed to load currencies');
//     }
//   };

//   useEffect(() => { 
//     fetchBanks();
//     fetchCurrencies();
//   }, []);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return banks.filter(b =>
//       (!q || b.name.toLowerCase().includes(q) || b.currency_code.toLowerCase().includes(q)) &&
//       (statusFilter === 'All' || b.status === statusFilter) &&
//       (currencyFilter === 'All' || b.currency_code === currencyFilter)
//     );
//   }, [banks, search, statusFilter, currencyFilter]);


// // 2) Then derive counts / paging helpers
// const totalRecords = banks.length;
// const filteredCount = filtered.length;
// const isFiltered = useMemo(
//   () => search.trim() !== '' || statusFilter !== 'All' || currencyFilter !== 'All',
//   [search, statusFilter, currencyFilter]
// );

// const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
// const pageItems = useMemo(
//   () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
//   [filtered, page]
// );

// const startIndex = filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0;
// const endIndex   = Math.min(page * PAGE_SIZE, filteredCount);


//   const openCreate = () => { 
//     setEditingId(null); 
//     setForm({ 
//       id: 0, 
//       name: '', 
//       currency_code: currencies[0]?.code || 'USD', 
//       type: 'Bank', 
//       status: 'Active' 
//     }); 
//     setShowModal(true); 
//   };

//   const openEdit = (b: Bank) => { 
//     setEditingId(b.id); 
//     setForm(b); 
//     setShowModal(true); 
//   };

//   const save = async () => {
//     try {
//       const payload = { 
//         name: form.name, 
//         currency_code: form.currency_code, 
//         type: form.type, 
//         status: form.status 
//       };
//       const url = editingId ? `${API_BASE_URL}/api/bank-currency/banks/${editingId}` : `${API_BASE_URL}/api/bank-currency/banks`;
//       const method = editingId ? 'PUT' : 'POST';
//       const res = await fetch(url, { 
//         method, 
//         headers: { 'Content-Type': 'application/json' }, 
//         body: JSON.stringify(payload) 
//       });
//       if (!res.ok) throw new Error('Save failed');
//       toast.success(editingId ? 'Bank updated successfully' : 'Bank created successfully');
//       setShowModal(false);
//       await fetchBanks();
//     } catch (e: any) {
//       toast.error(e.message || 'Save failed');
//     }
//   };

//   const remove = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this bank?')) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks/${id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error('Delete failed');
//       toast.success('Bank deleted successfully');
//       await fetchBanks();
//     } catch (e: any) { 
//       toast.error(e.message || 'Delete failed'); 
//     }
//   };

//   const resetFilters = () => {
//     setSearch('');
//     setStatusFilter('All');
//     setCurrencyFilter('All');
//     setPage(1);
//   };

//   return (
//     <div className="p-6">
//       {/* Header and Search */}
// {/* Header */}
// <div className="flex items-center justify-between mb-6">
//   <div>
//     <h1 className="text-2xl font-bold">Bank Management</h1>
//     <p className="text-gray-600">Manage bank accounts and their details</p>
//   </div>

//   <button
//     className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
//     onClick={openCreate}
//     aria-label="Add Bank"
//   >
//     + Add Bank
//   </button>
// </div>

// {/* Search + Filters row */}
// <div className="flex items-center gap-3 mb-6">
//   <div className="relative flex-1">
//     <input
//       className="input input-bordered w-full pl-10"
//       placeholder="Search by bank name or currency code..."
//       value={search}
//       onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//       aria-label="Search banks"
//     />
//     <svg
//       className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       aria-hidden="true"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//     </svg>
//   </div>

// <button
//   className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
//              hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
//   onClick={() => setShowFilters(!showFilters)}
// >
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//     <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
//   </svg>
//   Filters
// </button>

// </div>

// {/* Filters Section */}
// {showFilters && (
//   <div
//     id="bank-filters"
//     className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"
//   >
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="form-control">
//         <label className="label">
//           <span className="label-text font-medium">Status</span>
//         </label>
//         <select
//           className="select select-bordered select-sm w-full"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value as any)}
//         >
//           <option value="All">All Status</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//       </div>

//       <div className="form-control">
//         <label className="label">
//           <span className="label-text font-medium">Currency</span>
//         </label>
//         <select
//           className="select select-bordered select-sm w-full"
//           value={currencyFilter}
//           onChange={(e) => setCurrencyFilter(e.target.value)}
//         >
//           <option value="All">All Currencies</option>
//           {currencies.map((c) => (
//             <option key={c.code} value={c.code}>
//               {c.code} - {c.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>

//     <div className="flex justify-end mt-4">
//       <button
//         className="btn btn-sm btn-ghost text-blue-600"
//         onClick={resetFilters}
//       >
//         Reset Filters
//       </button>
//     </div>
//   </div>
// )}


// {filteredCount > 0 && (
//   <div className="text-sm mb-2">
//     {isFiltered ? (
//       <>
//         Showing <span className="font-medium">{filteredCount}</span> of{' '}
//         <span className="font-medium">{totalRecords}</span>{' '}
//         <span className="text-gray-500">(filtered)</span>
//       </>
//     ) : (
//       <>
//         Showing <span className="font-medium">{startIndex}</span> to{' '}
//         <span className="font-medium">{endIndex}</span> of{' '}
//         <span className="font-medium">{totalRecords}</span>
//       </>
//     )}
//   </div>
// )}

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
//         <div className="overflow-x-auto">
//           <table className="table">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="font-medium text-gray-700">Bank Name</th>
//                 <th className="font-medium text-gray-700">Currency</th>
//                 <th className="font-medium text-gray-700">Status</th>
//                 <th className="font-medium text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pageItems.length > 0 ? (
//                 pageItems.map(b => (
//                   <tr key={b.id}>
//                     <td className="font-medium text-gray-700">{b.name}</td>
//                     <td>
//                       <div className="flex items-center gap-2">
//                         <span className="font-mono text-gray-500">{b.currency_code}</span>
//                         <span className="text-xs text-gray-500">
//                           {currencies.find(c => c.code === b.currency_code)?.name}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <span className={`badge ${b.status === 'Active' ? 'badge-success' : 'badge-ghost'}`}>
//                         {b.status}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="flex gap-2">
//                         <button 
//                           className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0" //btn bg-blue-600 hover:bg-blue-700 text-white border-0
//                           onClick={() => openEdit(b)}
//                         >
//                           Edit
//                         </button>
//                         <button 
//                           className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" 
//                           onClick={() => openConfirmDelete(b)}//onClick={() => remove(b.id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="text-center py-8 text-gray-500">
//                     No banks found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>


// {/* Pagination */}
// {totalPages > 1 && (
//   <div className="flex justify-center mt-4">
//     <div className="join">
//       {/* First */}
//       <button
//         className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//         disabled={page === 1}
//         onClick={() => setPage(1)}
//       >
//         First
//       </button>

//       {/* Prev */}
//       <button
//         className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//         disabled={page === 1}
//         onClick={() => setPage(p => Math.max(1, p - 1))}
//       >
//         «
//       </button>

//       {/* Page numbers */}
//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//         <button
//           key={p}
//           className={`join-item btn btn-sm border border-gray-300 
//             ${p === page
//               ? 'bg-blue-600 text-white border-blue-600'
//               : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           onClick={() => setPage(p)}
//         >
//           {p}
//         </button>
//       ))}

//       {/* Next */}
//       <button
//         className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//         disabled={page === totalPages}
//         onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//       >
//         »
//       </button>

//       {/* Last */}
//       <button
//         className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//         disabled={page === totalPages}
//         onClick={() => setPage(totalPages)}
//       >
//         Last
//       </button>
//     </div>
//   </div>
// )}


// {/* Add/Edit Modal */}
// {showModal && (
//   <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
      
//       {/* Header */}
//       <div className="flex items-center justify-between border-b px-6 py-4">
//         <div className="flex items-center gap-2">
//           {/* Bank Icon */}
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 10V5h14v5M4 10v10h16V10" />
//           </svg>
//           <h3 className="text-lg font-semibold text-gray-800">
//             {editingId ? 'Edit Bank' : 'Add New Bank'}
//           </h3>
//         </div>
//         <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
//           ✕
//         </button>
//       </div>

//       {/* Body */}
//       <div className="px-6 py-5 space-y-5">
//         {/* Bank Name */}
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-medium">Bank Name</span>
//           </label>
//           <input
//             className="input input-bordered w-full"
//             placeholder="Enter bank name"
//             value={form.name}
//             onChange={e => setForm({ ...form, name: e.target.value })}
//           />
//         </div>

//         {/* Currency */}
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-medium">Currency</span>
//           </label>
//           <select
//             className="select select-bordered w-full"
//             value={form.currency_code}
//             onChange={e => setForm({ ...form, currency_code: e.target.value })}
//           >
//             {currencies.map(c => (
//               <option key={c.code} value={c.code}>
//                 {c.code} - {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Status */}
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-medium">Status</span>
//           </label>
//           <select
//             className="select select-bordered w-full"
//             value={form.status}
//             onChange={e => setForm({ ...form, status: e.target.value as any })}
//           >
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
//         <button
//           className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
//           onClick={() => setShowModal(false)}
//         >
//           Cancel
//         </button>
//         <button
//           className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
//           onClick={save}
//         >
//           {editingId ? 'Update Bank' : 'Add Bank'}
//         </button>
//       </div>
//     </div>
//   </div>
// )}
// {confirmOpen && (
//   <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
//       {/* Header */}
//       <div className="px-6 py-4 border-b">
//         <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
//       </div>

//       {/* Body */}
//       <div className="px-6 py-5 text-gray-700 space-y-3">
//         <p>
//           Are you sure you want to delete <span className="font-semibold">{toDelete?.name}</span>?
//           This action cannot be undone.
//         </p>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
//         <button
//           className="btn btn-outline"
//           onClick={() => { setConfirmOpen(false); setToDelete(null); }}
//         >
//           Cancel
//         </button>
//         <button
//           className="btn btn-error text-white"
//           onClick={handleConfirmDelete}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   </div>
// )}



//     </div>
//   );
// }

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface Bank {
  id: number;
  name: string;
  bank_code: string | null; // API may still return null for legacy rows
  currency_code: string;
  type: string;
  status: 'Active' | 'Inactive';
}

interface Currency {
  code: string;
  name: string;
}

const PAGE_SIZE = 10;
const MAX_CODE_LEN = 20;

export default function BanksTab() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [currencyFilter, setCurrencyFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Bank | null>(null);

  const openConfirmDelete = (bank: Bank) => {
    setToDelete(bank);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks/${toDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`Deleted "${toDelete.name}"`);
      setConfirmOpen(false);
      setToDelete(null);
      await fetchBanks();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  // modal / form
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{
    id: number;
    name: string;
    bank_code: string; // always a string in the input; required
    currency_code: string;
    type: string;
    status: 'Active' | 'Inactive';
  }>({
    id: 0,
    name: '',
    bank_code: '',
    currency_code: 'USD',
    type: 'Bank',
    status: 'Active',
  });

  const fetchBanks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks`);
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((b: any) => ({
        id: b.id,
        name: b.bank_name ?? b.name ?? '',
        bank_code: b.bank_code ?? null,
        currency_code: b.currency_code ?? 'MYR',
        type: b.type ?? 'Bank',
        status: (b.status as 'Active' | 'Inactive') ?? 'Active',
      })) as Bank[];
      setBanks(normalized);
    } catch {
      toast.error('Failed to load banks');
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/currencies`);
      const data = await res.json();
      setCurrencies(
        Array.isArray(data)
          ? data.map((c: any) => ({ code: c.code, name: c.name }))
          : []
      );
    } catch {
      toast.error('Failed to load currencies');
    }
  };

  useEffect(() => {
    fetchBanks();
    fetchCurrencies();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return banks.filter(
      (b) =>
        (!q ||
          b.name.toLowerCase().includes(q) ||
          b.currency_code.toLowerCase().includes(q) ||
          (b.bank_code ? b.bank_code.toLowerCase().includes(q) : false)) &&
        (statusFilter === 'All' || b.status === statusFilter) &&
        (currencyFilter === 'All' || b.currency_code === currencyFilter)
    );
  }, [banks, search, statusFilter, currencyFilter]);

  const totalRecords = banks.length;
  const filteredCount = filtered.length;
  const isFiltered = useMemo(
    () => search.trim() !== '' || statusFilter !== 'All' || currencyFilter !== 'All',
    [search, statusFilter, currencyFilter]
  );
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const pageItems = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const startIndex = filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(page * PAGE_SIZE, filteredCount);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      id: 0,
      name: '',
      bank_code: '',
      currency_code: currencies[0]?.code || 'USD',
      type: 'Bank',
      status: 'Active',
    });
    setShowModal(true);
  };

  const openEdit = (b: Bank) => {
    setEditingId(b.id);
    setForm({
      id: b.id,
      name: b.name,
      bank_code: (b.bank_code ?? '').toString(),
      currency_code: b.currency_code,
      type: b.type,
      status: b.status,
    });
    setShowModal(true);
  };

  const save = async () => {
    try {
      const name = form.name.trim();
      const code = form.bank_code.trim();

      if (!name) {
        toast.error('Bank name is required.');
        return;
      }
      if (!code) {
        toast.error('Bank code is required.');
        return;
      }
      if (code.length > MAX_CODE_LEN) {
        toast.error(`Bank code must be ≤ ${MAX_CODE_LEN} characters.`);
        return;
      }

      const payload = {
        name,
        bank_code: code, // required, non-empty
        currency_code: form.currency_code,
        type: form.type,
        status: form.status,
      };

      const url = editingId
        ? `${API_BASE_URL}/api/bank-currency/banks/${editingId}`
        : `${API_BASE_URL}/api/bank-currency/banks`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Save failed';
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }

      toast.success(editingId ? 'Bank updated successfully' : 'Bank created successfully');
      setShowModal(false);
      await fetchBanks();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bank?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/banks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Bank deleted successfully');
      await fetchBanks();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setCurrencyFilter('All');
    setPage(1);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bank Management</h1>
          <p className="text-gray-600">Manage bank records and codes</p>
        </div>

        <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openCreate} aria-label="Add Bank">
          + Add Bank
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search by bank name, code, or currency..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search banks"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
                     hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div id="bank-filters" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <select className="select select-bordered select-sm w-full" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Currency</span>
              </label>
              <select className="select select-bordered select-sm w-full" value={currencyFilter} onChange={(e) => setCurrencyFilter(e.target.value)}>
                <option value="All">All Currencies</option>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button className="btn btn-sm btn-ghost text-blue-600" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {filteredCount > 0 && (
        <div className="text-sm mb-2">
          {isFiltered ? (
            <>
              Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalRecords}</span> <span className="text-gray-500">(filtered)</span>
            </>
          ) : (
            <>
              Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalRecords}</span>
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-medium text-gray-700">Bank Name</th>
                <th className="font-medium text-gray-700">Bank Code</th>
                <th className="font-medium text-gray-700">Currency</th>
                <th className="font-medium text-gray-700">Status</th>
                <th className="font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? (
                pageItems.map((b) => (
                  <tr key={b.id}>
                    {[
                      <td key="name" className="font-medium text-gray-700">{b.name}</td>,
                      <td key="code" className="font-mono text-gray-700">{b.bank_code ?? '-'}</td>,
                      <td key="currency">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-500">{b.currency_code}</span>
                          <span className="text-xs text-gray-500">{currencies.find((c) => c.code === b.currency_code)?.name}</span>
                        </div>
                      </td>,
                      <td key="status">
                        <span className={`badge ${b.status === 'Active' ? 'badge-success' : 'badge-ghost'}`}>{b.status}</span>
                      </td>,
                      <td key="actions">
                        <div className="flex gap-2">
                          <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => openEdit(b)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => openConfirmDelete(b)}>
                            Delete
                          </button>
                        </div>
                      </td>,
                    ]}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">No banks found matching your criteria</td>
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
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === 1} onClick={() => setPage(1)}>
              First
            </button>
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`join-item btn btn-sm border border-gray-300 ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              »
            </button>
            <button className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
              Last
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 10V5h14v5M4 10v10h16V10" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">{editingId ? 'Edit Bank' : 'Add New Bank'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Bank Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Bank Name<span className="text-red-600">*</span></span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Enter bank name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Bank Code (required) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Bank Code<span className="text-red-600">*</span></span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="e.g., AMBANK, PBE, ALLIANCE"
                  value={form.bank_code}
                  maxLength={MAX_CODE_LEN}
                  onChange={(e) => setForm((prev) => ({ ...prev, bank_code: e.target.value }))}
                />
                <span className="text-xs text-gray-500 mt-1">Max {MAX_CODE_LEN} characters.</span>
              </div>

              {/* Currency */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Currency</span>
                </label>
                <select className="select select-bordered w-full" value={form.currency_code} onChange={(e) => setForm({ ...form, currency_code: e.target.value })}>
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Status</span>
                </label>
                <select className="select select-bordered w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={save}>
                {editingId ? 'Update Bank' : 'Add Bank'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <div className="px-6 py-5 text-gray-700 space-y-3">
              <p>Are you sure you want to delete <span className="font-semibold">{toDelete?.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button className="btn btn-outline" onClick={() => { setConfirmOpen(false); setToDelete(null); }}>
                Cancel
              </button>
              <button className="btn btn-error text-white" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
