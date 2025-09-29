// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import { API_BASE_URL } from '../../config';
// // import { toast } from 'react-hot-toast';

// // interface Holiday {
// //   id: number;
// //   holiday_date: string;
// //   title: string;
// //   description: string;
// //   is_global: boolean;
// // }

// // export default function ManageHolidays() {
// //   const [holidays, setHolidays] = useState<Holiday[]>([]);
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [form, setForm] = useState({ title: '', holiday_date: '', description: '', is_global: true });
// //   const itemsPerPage = 10;
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const fetchHolidays = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await fetch(`${API_BASE_URL}/api/holiday/holidays`);
// //       const data = await res.json();
// //       setHolidays(data || []);
// //     } catch {
// //       toast.error('Failed to fetch holidays');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchHolidays();
// //   }, []);

// //   const handleSubmit = async () => {
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/holiday/holidays`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(form)
// //       });
// //       if (!res.ok) throw new Error();
// //       toast.success('Holiday added');
// //       fetchHolidays();
// //       setForm({ title: '', holiday_date: '', description: '', is_global: true });
// //     } catch {
// //       toast.error('Failed to add holiday');
// //     }
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Delete this holiday?')) return;
// //     try {
// //       await fetch(`${API_BASE_URL}/api/holiday/holidays/${id}`, { method: 'DELETE' });
// //       toast.success('Deleted');
// //       fetchHolidays();
// //     } catch {
// //       toast.error('Failed to delete');
// //     }
// //   };

// //   const handleImport = async () => {
// //     const file = fileInputRef.current?.files?.[0];
// //     if (!file) return;
// //     const formData = new FormData();
// //     formData.append('file', file);

// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/holiday/import`, {
// //         method: 'POST',
// //         body: formData
// //       });
// //       const data = await res.json();
// //       toast.success(data.message);
// //       fetchHolidays();
// //     } catch {
// //       toast.error('Import failed');
// //     }
// //   };

// //   const handleExport = () => {
// //     window.open(`${API_BASE_URL}/api/holiday/export`, '_blank');
// //   };

// //   const filtered = holidays.filter(h => (h.title + h.description).toLowerCase().includes(search.toLowerCase()));
// //   const totalPages = Math.ceil(filtered.length / itemsPerPage);
// //   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   return (
// //     <div className="container mx-auto px-4 py-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold">Public Holidays</h1>
// //         <div className="flex gap-2">
// //           <button className="btn btn-sm" onClick={handleExport}>Export</button>
// //           <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleImport} />
// //           <button className="btn btn-sm" onClick={() => fileInputRef.current?.click()}>Import</button>
// //         </div>
// //       </div>

// //       <div className="mb-4">
// //         <input type="text" className="input input-bordered w-full" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
// //       </div>

// //       <div className="mb-4 p-4 border rounded bg-base-200">
// //         <h2 className="font-semibold mb-2">Add New Holiday</h2>
// //         <div className="flex flex-col gap-2">
// //           <input type="date" className="input input-bordered" value={form.holiday_date} onChange={(e) => setForm({ ...form, holiday_date: e.target.value })} />
// //           <input type="text" className="input input-bordered" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
// //           <input type="text" className="input input-bordered" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
// //           <label className="label cursor-pointer">
// //             <span className="label-text">Is Global</span>
// //             <input type="checkbox" className="toggle" checked={form.is_global} onChange={(e) => setForm({ ...form, is_global: e.target.checked })} />
// //           </label>
// //           <button className="btn btn-primary" onClick={handleSubmit}>Add Holiday</button>
// //         </div>
// //       </div>

// //       {loading ? (
// //         <div className="text-center py-10">
// //           <span className="loading loading-spinner loading-lg"></span>
// //         </div>
// //       ) : (
// //         <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
// //           <table className="table w-full">
// //             <thead>
// //               <tr>
// //                 <th>Date</th>
// //                 <th>Title</th>
// //                 <th>Description</th>
// //                 <th>Global</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {paginated.length === 0 ? (
// //                 <tr><td colSpan={5} className="text-center py-6">No holidays found.</td></tr>
// //               ) : (
// //                 paginated.map(h => (
// //                   <tr key={h.id}>
// //                     <td>{new Date(h.holiday_date).toLocaleDateString()}</td>
// //                     <td>{h.title}</td>
// //                     <td>{h.description}</td>
// //                     <td>{h.is_global ? 'Yes' : 'No'}</td>
// //                     <td><button onClick={() => handleDelete(h.id)} className="btn btn-xs btn-error">Delete</button></td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {totalPages > 1 && (
// //         <div className="mt-4 flex justify-center gap-2">
// //           {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
// //             <button
// //               key={page}
// //               onClick={() => setCurrentPage(page)}
// //               className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
// //             >{page}</button>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';

// /** ===============================
//  * Types
//  * =============================== */
// interface Holiday {
//   id: number;
//   holiday_date: string; // can be 'YYYY-MM-DD' or ISO 'YYYY-MM-DDTHH:mm:ssZ'
//   title: string;
//   description: string | null;
//   is_global: boolean | number; // API may return 0/1
// }

// type ScopeFilter = 'All' | 'Global' | 'Local';

// type ConfirmState = {
//   open: boolean;
//   title?: string;
//   message?: string;
//   confirmText?: string;
//   cancelText?: string;
//   onConfirm?: () => Promise<void> | void;
// };

// type ModalState = {
//   open: boolean;
//   editingId: number | null;
//   form: {
//     holiday_date: string;
//     title: string;
//     description: string;
//     is_global: boolean;
//   };
// };

// /** ======================
//  * Utils
//  * ====================== */
// // Parse either 'YYYY-MM-DD' (as local) or ISO string (as Date)
// function toLocalDate(value?: string | null): Date | null {
//   if (!value) return null;
//   if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//     const [y, m, d] = value.split('-').map(Number);
//     return new Date(y, m - 1, d);
//   }
//   const d = new Date(value);
//   return Number.isNaN(d.getTime()) ? null : d;
// }

// function formatDisplayDate(value?: string | null, locale = 'en-MY'): string {
//   const d = toLocalDate(value);
//   if (!d) return value || '-';
//   return d.toLocaleDateString(locale, {
//     year: 'numeric',
//     month: 'short',
//     day: '2-digit',
//   });
// }

// function ymd(date: Date): string {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, '0');
//   const d = String(date.getDate()).padStart(2, '0');
//   return `${y}-${m}-${d}`;
// }

// /** =================
//  * Confirm Dialog
//  * ================= */
// function ConfirmDialog({
//   state,
//   setState,
//   z = 80,
// }: {
//   state: ConfirmState;
//   setState: React.Dispatch<React.SetStateAction<ConfirmState>>;
//   z?: number;
// }) {
//   const onCancel = () => setState(s => ({ ...s, open: false }));
//   const onConfirm = async () => {
//     try {
//       await state.onConfirm?.();
//     } finally {
//       setState(s => ({ ...s, open: false }));
//     }
//   };

//   if (!state.open) return null;
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: z }}>
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
//         <div className="px-6 py-4 border-b">
//           <h3 className="text-lg font-semibold">{state.title || 'Confirm'}</h3>
//         </div>
//         <div className="px-6 py-5">
//           <p className="text-gray-700">{state.message || 'Are you sure?'}</p>
//         </div>
//         <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
//           <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={onCancel}>
//             {state.cancelText || 'Cancel'}
//           </button>
//           <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={onConfirm}>
//             {state.confirmText || 'Confirm'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /** ==============
//  * Main Component
//  * ============== */
// const ITEMS_PER_PAGE = 10;

// export default function ManageHolidays() {
//   const [holidays, setHolidays] = useState<Holiday[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Search & filters
//   const [search, setSearch] = useState('');
//   const [scope, setScope] = useState<ScopeFilter>('All');
//   const [yearFilter, setYearFilter] = useState<string>('All');
//   const [monthFilter, setMonthFilter] = useState<string>('All');
//   const [showFilters, setShowFilters] = useState(false);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);

//   // Import
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Confirm dialog
//   const [confirm, setConfirm] = useState<ConfirmState>({ open: false });

//   // Add/Edit Modal
//   const [modal, setModal] = useState<ModalState>({
//     open: false,
//     editingId: null,
//     form: {
//       holiday_date: '',
//       title: '',
//       description: '',
//       is_global: true,
//     },
//   });

//   /** Fetch */
//   const fetchHolidays = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/api/holiday/holidays`);
//       if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//       const data: Holiday[] = await res.json();
//       setHolidays((data || []).map((h: any) => ({ ...h, is_global: !!h.is_global })));
//     } catch {
//       toast.error('Failed to fetch holidays');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHolidays();
//   }, []);

//   /** Derived lists */
//   const sorted = useMemo(() => {
//     // sort by date ascending
//     return [...holidays].sort((a, b) => (a.holiday_date > b.holiday_date ? 1 : -1));
//   }, [holidays]);

//   const yearsAvailable = useMemo(() => {
//     const set = new Set<string>();
//     sorted.forEach(h => {
//       const d = toLocalDate(h.holiday_date);
//       if (d) set.add(String(d.getFullYear()));
//     });
//     return ['All', ...Array.from(set).sort()];
//   }, [sorted]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return sorted.filter(h => {
//       const d = toLocalDate(h.holiday_date);
//       const y = d?.getFullYear();
//       const m = (d?.getMonth() ?? 0) + 1;

//       const matchesSearch =
//         !q ||
//         (h.title || '').toLowerCase().includes(q) ||
//         (h.description || '').toLowerCase().includes(q);

//       const matchesScope =
//         scope === 'All' ||
//         (scope === 'Global' && !!h.is_global) ||
//         (scope === 'Local' && !h.is_global);

//       const matchesYear = yearFilter === 'All' || String(y) === yearFilter;
//       const matchesMonth = monthFilter === 'All' || String(m) === monthFilter;

//       return matchesSearch && matchesScope && matchesYear && matchesMonth;
//     });
//   }, [sorted, search, scope, yearFilter, monthFilter]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const pageItems = useMemo(
//     () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
//     [filtered, currentPage]
//   );
//   const showingFrom = (currentPage - 1) * ITEMS_PER_PAGE + (filtered.length ? 1 : 0);
//   const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, scope, yearFilter, monthFilter, holidays]);

//   /** Dashboard helpers */
//   const today = new Date();
//   const cy = today.getFullYear();
//   const cm = today.getMonth() + 1;

//   const currentMonthHolidays = useMemo(() => {
//     return holidays.filter(h => {
//       const d = toLocalDate(h.holiday_date);
//       if (!d) return false;
//       return d.getFullYear() === cy && d.getMonth() + 1 === cm;
//     });
//   }, [holidays, cy, cm]);

//   const upcomingIn60Days = useMemo(() => {
//     const start = new Date();
//     const end = new Date();
//     end.setDate(end.getDate() + 60);
//     return holidays
//       .map(h => ({ h, d: toLocalDate(h.holiday_date) }))
//       .filter(x => !!x.d && x.d! >= start && x.d! <= end)
//       .sort((a, b) => (a.d! > b.d! ? 1 : -1))
//       .map(x => x.h);
//   }, [holidays]);

//   /** Actions */
//   const openCreate = () => {
//     setModal({
//       open: true,
//       editingId: null,
//       form: {
//         holiday_date: '',
//         title: '',
//         description: '',
//         is_global: true,
//       },
//     });
//   };

//   const openEdit = (row: Holiday) => {
//     // normalize to YYYY-MM-DD for input[type=date]
//     const d = toLocalDate(row.holiday_date);
//     setModal({
//       open: true,
//       editingId: row.id,
//       form: {
//         holiday_date: d ? ymd(d) : '',
//         title: row.title || '',
//         description: row.description || '',
//         is_global: !!row.is_global,
//       },
//     });
//   };

//   const closeModal = () => {
//     setModal(prev => ({ ...prev, open: false }));
//   };

//   const saveHoliday = async () => {
//     const { holiday_date, title } = modal.form;
//     if (!holiday_date || !title.trim()) {
//       toast.error('Please fill date and title');
//       return;
//     }

//     const payload = {
//       holiday_date: modal.form.holiday_date,
//       title: modal.form.title.trim(),
//       description: modal.form.description.trim(),
//       is_global: modal.form.is_global,
//     };

//     try {
//       const url = modal.editingId
//         ? `${API_BASE_URL}/api/holiday/holidays/${modal.editingId}`
//         : `${API_BASE_URL}/api/holiday/holidays`;
//       const method = modal.editingId ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.message || 'Save failed');

//       toast.success(modal.editingId ? 'Holiday updated' : 'Holiday added');
//       closeModal();
//       await fetchHolidays();
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to save holiday');
//     }
//   };

//   const askDelete = (row: Holiday) => {
//     setConfirm({
//       open: true,
//       title: 'Delete Holiday',
//       message: `Delete "${row.title}" on ${formatDisplayDate(row.holiday_date)}? This action cannot be undone.`,
//       confirmText: 'Delete',
//       cancelText: 'Cancel',
//       onConfirm: async () => {
//         try {
//           const res = await fetch(`${API_BASE_URL}/api/holiday/holidays/${row.id}`, { method: 'DELETE' });
//           if (!res.ok) {
//             const t = await res.text().catch(() => '');
//             throw new Error(t || 'Delete failed');
//           }
//           toast.success('Deleted');
//           await fetchHolidays();
//         } catch (e: any) {
//           toast.error(e.message || 'Failed to delete');
//         }
//       },
//     });
//   };

//   const handleImport = async () => {
//     const file = fileInputRef.current?.files?.[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/holiday/import`, {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.message || 'Import failed');
//       toast.success(data?.message || 'Imported');
//       await fetchHolidays();
//     } catch (e: any) {
//       toast.error(e.message || 'Import failed');
//     } finally {
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     }
//   };

//   const handleExport = () => {
//     window.open(`${API_BASE_URL}/api/holiday/export`, '_blank');
//   };

//   /** Calendar (current month, Monday-start) */
//   const monthGrid = useMemo(() => {
//     const first = new Date(cy, cm - 1, 1);
//     const last = new Date(cy, cm, 0);
//     const daysInMonth = last.getDate();
//     const firstWeekdayMonStart = (first.getDay() + 6) % 7; // 0 = Monday
//     const totalCells = Math.ceil((firstWeekdayMonStart + daysInMonth) / 7) * 7;

//     const holidayMap = new Map<number, Holiday[]>();
//     currentMonthHolidays.forEach(h => {
//       const d = toLocalDate(h.holiday_date);
//       if (!d) return;
//       const day = d.getDate();
//       if (!holidayMap.has(day)) holidayMap.set(day, []);
//       holidayMap.get(day)!.push(h);
//     });

//     const cells: { day: number | null; items?: Holiday[] }[] = [];
//     for (let i = 0; i < totalCells; i++) {
//       const dayNumber = i - firstWeekdayMonStart + 1;
//       if (dayNumber < 1 || dayNumber > daysInMonth) {
//         cells.push({ day: null });
//       } else {
//         cells.push({ day: dayNumber, items: holidayMap.get(dayNumber) || [] });
//       }
//     }
//     return cells;
//   }, [cy, cm, currentMonthHolidays]);

//   return (
//     <div className="p-6">
//       {/* Confirm dialog */}
//       <ConfirmDialog state={confirm} setState={setConfirm} z={95} />

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Public Holidays</h1>
//           <p className="text-gray-600">Manage public holidays and visualize dates</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openCreate}>
//             + Add Holiday
//           </button>
//           <button className="btn" onClick={handleExport}>Export</button>
//           <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleImport} />
//           <button className="btn" onClick={() => fileInputRef.current?.click()}>Import</button>
//         </div>
//       </div>

//       {/* Dashboard: Calendar + Upcoming list */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         {/* Current month calendar */}
//         <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
//           <div className="px-5 py-4 border-b">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold">
//                 {new Date(cy, cm - 1, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
//               </h2>
//               <span className="text-sm text-gray-500">
//                 {currentMonthHolidays.length} holidays this month
//               </span>
//             </div>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
//               <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
//             </div>
//             <div className="grid grid-cols-7 gap-2">
//               {monthGrid.map((cell, idx) => (
//                 <div
//                   key={idx}
//                   className={`min-h-20 border rounded-md p-2 ${cell.day ? 'bg-white' : 'bg-gray-50'} relative`}
//                 >
//                   {cell.day && (
//                     <>
//                       <div className="text-xs text-right text-gray-500">{cell.day}</div>
//                       <div className="mt-1 space-y-1">
//                         {cell.items && cell.items.slice(0, 2).map(item => (
//                           <div key={item.id} className="text-xs px-1 py-0.5 rounded bg-blue-100 text-blue-700 truncate">
//                             {item.title}
//                           </div>
//                         ))}
//                         {cell.items && cell.items.length > 2 && (
//                           <div className="text-[10px] text-blue-700">+{cell.items.length - 2} more</div>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Upcoming list */}
//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//           <div className="px-5 py-4 border-b">
//             <h2 className="text-lg font-semibold">Upcoming (next 60 days)</h2>
//           </div>
//           <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
//             {upcomingIn60Days.length ? (
//               upcomingIn60Days.map(h => (
//                 <div key={h.id} className="flex items-start gap-3">
//                   <div className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium">
//                     {formatDisplayDate(h.holiday_date)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="font-medium leading-tight">{h.title}</div>
//                     {h.description ? (
//                       <div className="text-sm text-gray-600 leading-tight">{h.description}</div>
//                     ) : null}
//                     <div className="mt-1">
//                       <span className={`badge badge-sm ${h.is_global ? 'badge-success' : 'badge-ghost'}`}>
//                         {h.is_global ? 'Global' : 'Local'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-sm text-gray-500">No upcoming holidays in the next 60 days</div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Search + Filters row */}
//       <div className="flex items-center gap-3 mb-4">
//         <div className="relative flex-1">
//           <input
//             className="input input-bordered w-full pl-10"
//             placeholder="Search by title or description..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>

//         <button
//           className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
//                      hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
//           onClick={() => setShowFilters(!showFilters)}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Filters
//         </button>
//       </div>

//       {/* Filters panel */}
//       {showFilters && (
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Scope</span></label>
//               <select className="select select-bordered select-sm w-full" value={scope} onChange={(e) => setScope(e.target.value as ScopeFilter)}>
//                 <option value="All">All</option>
//                 <option value="Global">Global</option>
//                 <option value="Local">Local</option>
//               </select>
//             </div>
//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Year</span></label>
//               <select className="select select-bordered select-sm w-full" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
//                 {yearsAvailable.map(y => <option key={y} value={y}>{y}</option>)}
//               </select>
//             </div>
//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Month</span></label>
//               <select className="select select-bordered select-sm w-full" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
//                 <option value="All">All</option>
//                 {Array.from({ length: 12 }, (_, i) => (i + 1)).map(m => (
//                   <option key={m} value={String(m)}>{new Date(2000, m - 1, 1).toLocaleString('en-MY', { month: 'long' })}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-end">
//               <button
//                 className="btn btn-sm btn-ghost text-blue-600"
//                 onClick={() => { setScope('All'); setYearFilter('All'); setMonthFilter('All'); setSearch(''); }}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Results info */}
//       {filtered.length > 0 ? (
//         <div className="text-sm text-gray-600 mb-2">
//           Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of{' '}
//           <span className="font-medium">{filtered.length}</span>
//         </div>
//       ) : (
//         <div className="text-sm text-gray-600 mb-2">No results</div>
//       )}

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-10">
//           <span className="loading loading-spinner text-primary" />
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="font-medium text-gray-700">Date</th>
//                   <th className="font-medium text-gray-700">Title</th>
//                   <th className="font-medium text-gray-700">Description</th>
//                   <th className="font-medium text-gray-700 text-center">Scope</th>
//                   <th className="font-medium text-gray-700 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pageItems.length > 0 ? (
//                   pageItems.map(h => (
//                     <tr key={h.id}>
//                       <td className="whitespace-nowrap">{formatDisplayDate(h.holiday_date)}</td>
//                       <td className="font-medium">{h.title}</td>
//                       <td className="max-w-[50ch] truncate">{h.description}</td>
//                       <td className="text-center">
//                         <span className={`badge ${h.is_global ? 'badge-success' : 'badge-ghost'}`}>
//                           {h.is_global ? 'Global' : 'Local'}
//                         </span>
//                       </td>
//                       <td className="text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <button className="btn btn-xs btn-outline" onClick={() => openEdit(h)}>Edit</button>
//                           <button className="btn btn-xs btn-error" onClick={() => askDelete(h)}>Delete</button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="text-center py-8 text-gray-500">No holidays found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Pagination (centered) */}
//       {totalPages > 1 && (
//         <div className="mt-4 flex justify-center">
//           <div className="join">
//             <button
//               className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(1)}
//             >
//               First
//             </button>
//             <button
//               className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             >
//               «
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//               <button
//                 key={p}
//                 className={`join-item btn btn-sm border border-gray-300 ${p === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
//                 onClick={() => setCurrentPage(p)}
//               >
//                 {p}
//               </button>
//             ))}
//             <button
//               className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             >
//               »
//             </button>
//             <button
//               className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage(totalPages)}
//             >
//               Last
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Create/Edit Modal */}
//       {modal.open && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
//             <div className="flex items-center justify-between border-b px-6 py-4">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {modal.editingId ? 'Edit Holiday' : 'Add Holiday'}
//                 </h3>
//               </div>
//               <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
//             </div>

//             <div className="px-6 py-5 space-y-4">
//               <div className="form-control">
//                 <label className="label"><span className="label-text font-medium">Date *</span></label>
//                 <input
//                   type="date"
//                   className="input input-bordered w-full"
//                   value={modal.form.holiday_date}
//                   onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, holiday_date: e.target.value } }))}
//                 />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text font-medium">Title *</span></label>
//                 <input
//                   className="input input-bordered w-full"
//                   placeholder="e.g., National Day"
//                   value={modal.form.title}
//                   onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, title: e.target.value } }))}
//                 />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text font-medium">Description</span></label>
//                 <input
//                   className="input input-bordered w-full"
//                   placeholder="Optional"
//                   value={modal.form.description}
//                   onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, description: e.target.value } }))}
//                 />
//               </div>
//               <label className="label cursor-pointer justify-start gap-3">
//                 <input
//                   type="checkbox"
//                   className="toggle toggle-info"
//                   checked={modal.form.is_global}
//                   onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, is_global: e.target.checked } }))}
//                 />
//                 <span className="label-text">Global holiday</span>
//               </label>
//             </div>

//             <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
//               <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={closeModal}>Cancel</button>
//               <button
//                 className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
//                 onClick={saveHoliday}
//                 disabled={!modal.form.holiday_date || !modal.form.title.trim()}
//               >
//                 {modal.editingId ? 'Update' : 'Save'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';

// /* ===================== Types ===================== */
// interface Company { id: number; name: string; }

// type EventType = 'holiday' | 'event';

// interface Holiday {
//   id: number;
//   holiday_date: string;          // 'YYYY-MM-DD' or ISO
//   title: string;
//   description: string | null;
//   is_global: boolean | number;   
//   company_ids?: number[];       
//   company_names?: string;       
//   event_type?: EventType; // NEW
// }
// type ScopeFilter = 'All' | 'Global' | 'Local';

// type ConfirmState = {
//   open: boolean;
//   title?: string;
//   message?: string;
//   confirmText?: string;
//   cancelText?: string;
//   onConfirm?: () => Promise<void> | void;
// };

// type ModalState = {
//   open: boolean;
//   editingId: number | null;
//   form: {
//     holiday_date: string;
//     title: string;
//     description: string;
//     is_global: boolean;
//     company_ids: number[];
//   };
// };

// /* ===================== Utils ===================== */
// function toLocalDate(value?: string | null): Date | null {
//   if (!value) return null;
//   if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//     const [y, m, d] = value.split('-').map(Number);
//     return new Date(y, m - 1, d);
//   }
//   const d = new Date(value);
//   return Number.isNaN(d.getTime()) ? null : d;
// }
// function formatDisplayDate(value?: string | null, locale = 'en-MY'): string {
//   const d = toLocalDate(value);
//   if (!d) return value || '-';
//   return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: '2-digit' });
// }
// function ymd(date: Date): string {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, '0');
//   const d = String(date.getDate()).padStart(2, '0');
//   return `${y}-${m}-${d}`;
// }

// /* ================= Confirm Dialog ================= */
// function ConfirmDialog({ state, setState, z = 80 }: { state: ConfirmState; setState: any; z?: number; }) {
//   const onCancel = () => setState((s: ConfirmState) => ({ ...s, open: false }));
//   const onConfirm = async () => {
//     try { await state.onConfirm?.(); }
//     finally { setState((s: ConfirmState) => ({ ...s, open: false })); }
//   };
//   if (!state.open) return null;
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: z }}>
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
//         <div className="px-6 py-4 border-b">
//           <h3 className="text-lg font-semibold">{state.title || 'Confirm'}</h3>
//         </div>
//         <div className="px-6 py-5">
//           <p className="text-gray-700">{state.message || 'Are you sure?'}</p>
//         </div>
//         <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
//           <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={onCancel}>
//             {state.cancelText || 'Cancel'}
//           </button>
//           <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={onConfirm}>
//             {state.confirmText || 'Confirm'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============== Company Multi-Select ============== */
// function CompanyMultiSelect({
//   companies,
//   value,
//   onChange,
//   disabled = false,
// }: {
//   companies: Company[];
//   value: number[];
//   onChange: (ids: number[]) => void;
//   disabled?: boolean;
// }) {
//   const [query, setQuery] = useState('');
//   const [showSelectedOnly, setShowSelectedOnly] = useState(false);

//   const selectedSet = useMemo(() => new Set(value), [value]);

//   const normalized = useMemo(
//     () => [...companies].sort((a, b) => a.name.localeCompare(b.name)),
//     [companies]
//   );

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return normalized.filter((c) => {
//       const matches = !q || c.name.toLowerCase().includes(q);
//       const picked = selectedSet.has(c.id);
//       return matches && (!showSelectedOnly || picked);
//     });
//   }, [normalized, query, showSelectedOnly, selectedSet]);

//   const total = companies.length;
//   const selectedCount = value.length;
//   const filteredSelectedCount = filtered.reduce(
//     (acc, c) => acc + (selectedSet.has(c.id) ? 1 : 0),
//     0
//   );

//   // Tri-state for "Select shown"
//   const masterRef = useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     if (!masterRef.current) return;
//     masterRef.current.indeterminate =
//       filteredSelectedCount > 0 && filteredSelectedCount < filtered.length;
//   }, [filteredSelectedCount, filtered.length]);

//   const selectAllAcrossAll = () => onChange(normalized.map((c) => c.id));
//   const clearAll = () => onChange([]);
//   const toggleOne = (id: number, checked: boolean) => {
//     const set = new Set(value);
//     if (checked) set.add(id); else set.delete(id);
//     onChange(Array.from(set));
//   };
//   const toggleShown = (checked: boolean) => {
//     const set = new Set(value);
//     if (checked) filtered.forEach((c) => set.add(c.id));
//     else filtered.forEach((c) => set.delete(c.id));
//     onChange(Array.from(set));
//   };

//   const containerClass = disabled ? 'opacity-50 pointer-events-none' : '';

//   return (
//     <div className={`border rounded-lg bg-white ${containerClass}`}>
//       {/* Toolbar */}
//       <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-3 py-3 border-b">
//         <div className="flex flex-col md:flex-row md:items-center gap-3">
//           <div className="relative md:flex-1">
//             <input
//               className="input input-bordered w-full pl-10"
//               placeholder="Search companies..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//             <svg
//               className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>

//           <div className="flex items-center gap-3">
//             <label className="label cursor-pointer gap-2 m-0">
//               <input
//                 type="checkbox"
//                 ref={masterRef}
//                 className="checkbox checkbox-sm"
//                 checked={filtered.length > 0 && filteredSelectedCount === filtered.length}
//                 onChange={(e) => toggleShown(e.target.checked)}
//               />
//               <span className="label-text">Select shown</span>
//             </label>

//             <button type="button" className="btn btn-sm" onClick={selectAllAcrossAll}>
//               Select all
//             </button>
//             <button type="button" className="btn btn-sm btn-ghost" onClick={clearAll}>
//               Clear all
//             </button>
//           </div>
//         </div>

//         <div className="mt-2 flex items-center justify-between">
//           <div className="text-sm text-gray-600">
//             Selected <span className="font-medium">{selectedCount}</span> of <span className="font-medium">{total}</span>
//             {query && (
//               <span className="ml-2 text-gray-500">
//                 • Shown: {filteredSelectedCount}/{filtered.length}
//               </span>
//             )}
//           </div>

//           <label className="label cursor-pointer gap-2 m-0">
//             <input
//               type="checkbox"
//               className="checkbox checkbox-xs"
//               checked={showSelectedOnly}
//               onChange={(e) => setShowSelectedOnly(e.target.checked)}
//             />
//             <span className="label-text text-xs">Show selected only</span>
//           </label>
//         </div>

//         {/* Selected preview badges */}
//         {selectedCount > 0 && (
//           <div className="mt-2 flex flex-wrap gap-1">
//             {normalized
//               .filter((c) => selectedSet.has(c.id))
//               .slice(0, 6)
//               .map((c) => (
//                 <span key={c.id} className="badge badge-ghost">
//                   {c.name}
//                 </span>
//               ))}
//             {selectedCount > 6 && (
//               <span className="text-xs text-gray-500">+{selectedCount - 6} more</span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* List */}
//       <div className="max-h-48 overflow-auto px-2 py-2">
//         {filtered.length === 0 ? (
//           <div className="text-sm text-gray-500 px-1 py-2">No companies</div>
//         ) : (
//           <ul className="space-y-1">
//             {filtered.map((c) => {
//               const checked = selectedSet.has(c.id);
//               return (
//                 <li key={c.id}>
//                   <label className="flex items-center gap-3 py-1 px-2 rounded hover:bg-gray-50">
//                     <input
//                       type="checkbox"
//                       className="checkbox checkbox-sm"
//                       checked={checked}
//                       onChange={(e) => toggleOne(c.id, e.target.checked)}
//                     />
//                     <span className="truncate">{c.name}</span>
//                   </label>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ===== Compact chips + “+N more” ===== */
// function CompanyPillsCompact({
//   namesCSV,
//   max = 6,
//   onShowAll,
//   size = 'sm', // 'sm' | 'xs'
// }: {
//   namesCSV?: string;
//   max?: number;
//   onShowAll?: () => void;
//   size?: 'sm' | 'xs';
// }) {
//   const names = (namesCSV || '').split(',').map(s => s.trim()).filter(Boolean);
//   if (!names.length) return null;
//   const shown = names.slice(0, max);
//   const remaining = names.length - shown.length;
//   const badgeSize = size === 'xs' ? 'badge-xs' : 'badge-sm';

//   return (
//     <div className="flex flex-wrap gap-1">
//       {shown.map((n, i) => (
//         <span key={i} className={`badge badge-ghost ${badgeSize}`}>{n}</span>
//       ))}
//       {remaining > 0 && (
//         <button
//           type="button"
//           className={`badge ${badgeSize} border-dashed cursor-pointer`}
//           onClick={onShowAll}
//           title="Show all companies"
//         >
//           +{remaining} more
//         </button>
//       )}
//     </div>
//   );
// }

// /* ===== Simple list modal ===== */
// function ListModal({
//   open,
//   title,
//   items,
//   onClose,
// }: {
//   open: boolean;
//   title: string;
//   items: string[];
//   onClose: () => void;
// }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden">
//         <div className="flex items-center justify-between border-b px-6 py-4">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
//         </div>
//         <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
//           {items.length ? (
//             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//               {items.map((t, i) => (
//                 <li key={i} className="truncate">
//                   <span className="badge badge-ghost">{t}</span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="text-sm text-gray-500">No items</div>
//           )}
//         </div>
//         <div className="border-t px-6 py-3 bg-gray-50 text-right">
//           <button className="btn btn-sm" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===== Day details modal (all holidays for that date) ===== */
// function DayDetailsModal({
//   open,
//   dateLabel,
//   items,
//   onClose,
//   onShowCompanies,
// }: {
//   open: boolean;
//   dateLabel: string;
//   items: Array<{
//     id: number; title: string; description?: string | null;
//     is_global: boolean; company_names?: string;
//   }>;
//   onClose: () => void;
//   onShowCompanies: (title: string, namesCSV?: string) => void;
// }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
//         <div className="flex items-center justify-between border-b px-6 py-4">
//           <h3 className="text-lg font-semibold">Holidays · {dateLabel}</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
//         </div>
//         <div className="px-6 py-5 max-h-[65vh] overflow-y-auto space-y-4">
//           {items.map(h => {
//             const companyNames = (h.company_names || '')
//               .split(',').map(s => s.trim()).filter(Boolean);
//             return (
//               <div key={h.id} className="border rounded-lg p-4">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <div className="font-medium">{h.title}</div>
//                     {h.description ? (
//                       <div className="text-sm text-gray-600">{h.description}</div>
//                     ) : null}
//                   </div>
//                   {h.is_global ? (
//                     <span className="badge badge-success">Global</span>
//                   ) : (
//                     <span className="badge">{companyNames.length} companies</span>
//                   )}
//                 </div>
//                 {!h.is_global && (
//                   <div className="mt-2">
//                     <CompanyPillsCompact
//                       namesCSV={h.company_names}
//                       max={8}
//                       onShowAll={() => onShowCompanies(h.title, h.company_names)}
//                     />
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         <div className="border-t px-6 py-3 bg-gray-50 text-right">
//           <button className="btn btn-sm" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================== Page Component ================== */
// const ITEMS_PER_PAGE = 10;

// export default function ManageHolidays() {
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [holidays, setHolidays] = useState<Holiday[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Filters
//   const [search, setSearch] = useState('');
//   const [scope, setScope] = useState<ScopeFilter>('All');
//   const [yearFilter, setYearFilter] = useState<string>('All');
//   const [monthFilter, setMonthFilter] = useState<string>('All');
//   const [showFilters, setShowFilters] = useState(false);

//   // Moved into Filters panel:
//   const [companyFilter, setCompanyFilter] = useState<string>('All'); // id or 'All'
//   const [includeGlobal, setIncludeGlobal] = useState<boolean>(true);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);

//   // Import
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Confirm
//   const [confirm, setConfirm] = useState<ConfirmState>({ open: false });

//   // Calendar controls (start at current month)
//   const today = new Date();
//   const [calYear, setCalYear] = useState<number>(today.getFullYear());
//   const [calMonth, setCalMonth] = useState<number>(today.getMonth() + 1); // 1..12

//   // Modal (Add/Edit)
//   const [modal, setModal] = useState<ModalState>({
//     open: false,
//     editingId: null,
//     form: { holiday_date: '', title: '', description: '', is_global: true, company_ids: [] },
//   });

//   // Company list modal (from upcoming & day details)
//   const [companyModal, setCompanyModal] = useState<{open:boolean; title:string; items:string[]}>({
//     open: false, title: '', items: []
//   });

//   // Day details modal
//   const [dayModal, setDayModal] = useState<{open:boolean; dateLabel:string; items:Holiday[]}>({
//     open: false, dateLabel: '', items: []
//   });

//   const openCompanyList = (title: string, namesCSV?: string) => {
//     const items = (namesCSV || '').split(',').map(s => s.trim()).filter(Boolean);
//     setCompanyModal({ open: true, title: `Companies · ${title}`, items });
//   };

//   /* ===== Fetchers ===== */
//   const fetchCompanies = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/holiday/companies`);
//       if (!res.ok) throw new Error('Failed companies');
//       const data: Company[] = await res.json();
//       setCompanies(data);
//     } catch {
//       toast.error('Failed to load companies');
//     }
//   };

//   const fetchHolidays = async () => {
//     try {
//       setLoading(true);
//       const q = new URLSearchParams();
//       if (companyFilter !== 'All') q.set('company_id', companyFilter);
//       if (!includeGlobal) q.set('include_global', '0');
//       if (yearFilter !== 'All') q.set('year', yearFilter);
//       if (monthFilter !== 'All') q.set('month', monthFilter);

//       const res = await fetch(`${API_BASE_URL}/api/holiday/holidays?${q.toString()}`);
//       if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//       const data: Holiday[] = await res.json();

//       setHolidays((data || []).map((h: any) => ({
//         ...h,
//         is_global: !!h.is_global,
//         company_ids: Array.isArray(h.company_ids) ? h.company_ids : (h.company_ids ?? []),
//         company_names: h.company_names || '',
//       })));
//     } catch {
//       toast.error('Failed to fetch holidays');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCompanies(); }, []);
//   useEffect(() => { fetchHolidays(); }, [companyFilter, includeGlobal, yearFilter, monthFilter]);

//   /* ===== Derived ===== */
//   const sorted = useMemo(() => {
//     return [...holidays].sort((a, b) => {
//       const da = toLocalDate(a.holiday_date)?.getTime() ?? 0;
//       const db = toLocalDate(b.holiday_date)?.getTime() ?? 0;
//       return da - db || a.id - b.id;
//     });
//   }, [holidays]);

//   const yearsAvailable = useMemo(() => {
//     const set = new Set<string>();
//     holidays.forEach(h => {
//       const d = toLocalDate(h.holiday_date);
//       if (d) set.add(String(d.getFullYear()));
//     });
//     return ['All', ...Array.from(set).sort()];
//   }, [holidays]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     const scopeTest = (h: Holiday) => {
//       if (scope === 'All') return true;
//       if (scope === 'Global') return !!h.is_global;
//       return !h.is_global;
//     };
//     return sorted.filter(h =>
//       scopeTest(h) &&
//       (
//         !q ||
//         (h.title || '').toLowerCase().includes(q) ||
//         (h.description || '').toLowerCase().includes(q) ||
//         (h.company_names || '').toLowerCase().includes(q)
//       )
//     );
//   }, [sorted, search, scope]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const pageItems = useMemo(
//     () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
//     [filtered, currentPage]
//   );
//   const showingFrom = (currentPage - 1) * ITEMS_PER_PAGE + (filtered.length ? 1 : 0);
//   const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

//   useEffect(() => { setCurrentPage(1); }, [search, scope, holidays]);

//   /* ===== Calendar ===== */
//   const currentMonthHolidays = useMemo(() => {
//     return holidays.filter(h => {
//       const d = toLocalDate(h.holiday_date);
//       if (!d) return false;
//       return d.getFullYear() === calYear && d.getMonth() + 1 === calMonth;
//     });
//   }, [holidays, calYear, calMonth]);

//   // Monday-start grid of day numbers (or null for blanks)
//   const monthGrid = useMemo(() => {
//     const first = new Date(calYear, calMonth - 1, 1);
//     const last = new Date(calYear, calMonth, 0);
//     const daysInMonth = last.getDate();
//     const firstWeekdayMonStart = (first.getDay() + 6) % 7; // 0 = Monday
//     const totalCells = Math.ceil((firstWeekdayMonStart + daysInMonth) / 7) * 7;

//     const cells: (number | null)[] = [];
//     for (let i = 0; i < totalCells; i++) {
//       const dayNumber = i - firstWeekdayMonStart + 1;
//       cells.push(dayNumber < 1 || dayNumber > daysInMonth ? null : dayNumber);
//     }
//     return cells;
//   }, [calYear, calMonth]);

//   const prevMonth = () => {
//     if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); }
//     else setCalMonth(m => m - 1);
//   };
//   const nextMonth = () => {
//     if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); }
//     else setCalMonth(m => m + 1);
//   };

//   /* ===== Actions ===== */
//   const openCreate = () => {
//     setModal({
//       open: true,
//       editingId: null,
//       form: { holiday_date: '', title: '', description: '', is_global: true, company_ids: [] },
//     });
//   };
//   const openEdit = (row: Holiday) => {
//     const d = toLocalDate(row.holiday_date);
//     setModal({
//       open: true,
//       editingId: row.id,
//       form: {
//         holiday_date: d ? ymd(d) : '',
//         title: row.title || '',
//         description: row.description || '',
//         is_global: !!row.is_global,
//         company_ids: Array.isArray(row.company_ids) ? row.company_ids : [],
//       },
//     });
//   };
//   const closeModal = () => setModal(prev => ({ ...prev, open: false }));

//   const saveHoliday = async () => {
//     const { holiday_date, title, is_global, company_ids } = modal.form;
//     if (!holiday_date || !title.trim()) {
//       toast.error('Please fill date and title');
//       return;
//     }
//     if (!is_global && (!company_ids || company_ids.length === 0)) {
//       toast.error('Select at least one company for non-global holiday');
//       return;
//     }

//     const payload = {
//       holiday_date: modal.form.holiday_date,
//       title: modal.form.title.trim(),
//       description: modal.form.description.trim(),
//       is_global: modal.form.is_global,
//       company_ids: modal.form.is_global ? [] : modal.form.company_ids,
//     };

//     try {
//       const url = modal.editingId
//         ? `${API_BASE_URL}/api/holiday/holidays/${modal.editingId}`
//         : `${API_BASE_URL}/api/holiday/holidays`;
//       const method = modal.editingId ? 'PUT' : 'POST';

//       const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.message || 'Save failed');

//       toast.success(modal.editingId ? 'Holiday updated' : 'Holiday added');
//       closeModal();
//       await fetchHolidays();
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to save holiday');
//     }
//   };

//   const askDelete = (row: Holiday) => {
//     setConfirm({
//       open: true,
//       title: 'Delete Holiday',
//       message: `Delete "${row.title}" on ${formatDisplayDate(row.holiday_date)}? This action cannot be undone.`,
//       confirmText: 'Delete',
//       cancelText: 'Cancel',
//       onConfirm: async () => {
//         try {
//           const res = await fetch(`${API_BASE_URL}/api/holiday/holidays/${row.id}`, { method: 'DELETE' });
//           if (!res.ok) {
//             const t = await res.text().catch(() => '');
//             throw new Error(t || 'Delete failed');
//           }
//           toast.success('Deleted');
//           await fetchHolidays();
//         } catch (e: any) {
//           toast.error(e.message || 'Failed to delete');
//         }
//       },
//     });
//   };

//   const handleImport = async () => {
//     const file = fileInputRef.current?.files?.[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('file', file);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/holiday/holidays/import`, { method: 'POST', body: formData });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.message || 'Import failed');
//       toast.success(data?.message || 'Imported');
//       await fetchHolidays();
//     } catch (e: any) {
//       toast.error(e.message || 'Import failed');
//     } finally {
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     }
//   };
//   const handleExport = () => window.open(`${API_BASE_URL}/api/holiday/holidays/export`, '_blank');

//   /* ================= Render ================= */
//   return (
//     <div className="p-6">
//       <ConfirmDialog state={confirm} setState={setConfirm} z={95} />

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Public Holidays</h1>
//           <p className="text-gray-600">Global and company-specific holidays</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openCreate}>+ Add Holiday</button>
//           <button className="btn" onClick={handleExport}>Export</button>
//           <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleImport} />
//           <button className="btn" onClick={() => fileInputRef.current?.click()}>Import</button>
//         </div>
//       </div>

//       {/* Search + Filters row */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="relative flex-1">
//           <input
//             className="input input-bordered w-full pl-10"
//             placeholder="Search by title, description, company..."
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//           />
//           <svg
//             className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>

//         <button
//           className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
//                      hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
//           onClick={() => setShowFilters(!showFilters)}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
//           </svg>
//           Filters
//         </button>

//         <button
//           className="btn btn-ghost"
//           onClick={() => {
//             setSearch(''); setScope('All'); setYearFilter('All'); setMonthFilter('All');
//             setCompanyFilter('All'); setIncludeGlobal(true);
//           }}
//         >
//           Reset
//         </button>
//       </div>

//       {/* Filters panel (includes Company + Include global) */}
//       {showFilters && (
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Scope</span></label>
//               <select className="select select-bordered select-sm w-full" value={scope} onChange={(e) => setScope(e.target.value as ScopeFilter)}>
//                 <option>All</option>
//                 <option>Global</option>
//                 <option>Local</option>
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Year</span></label>
//               <select className="select select-bordered select-sm w-full" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
//                 {yearsAvailable.map(y => <option key={y} value={y}>{y}</option>)}
//               </select>
//             </div>

//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Month</span></label>
//               <select className="select select-bordered select-sm w-full" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
//                 <option value="All">All</option>
//                 {Array.from({ length: 12 }, (_, i) => (i + 1)).map(m => (
//                   <option key={m} value={String(m)}>{new Date(2000, m - 1, 1).toLocaleString('en-MY', { month: 'long' })}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Company filter */}
//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Company</span></label>
//               <select className="select select-bordered select-sm w-full" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
//                 <option value="All">All companies</option>
//                 {companies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
//               </select>
//             </div>

//             {/* Include Global */}
//             <div className="form-control">
//               <label className="label"><span className="label-text font-medium">Include global</span></label>
//               <label className="label cursor-pointer justify-start gap-2">
//                 <input
//                   type="checkbox"
//                   className="checkbox checkbox-sm"
//                   checked={includeGlobal}
//                   onChange={(e) => setIncludeGlobal(e.target.checked)}
//                 />
//                 <span className="label-text">Show global holidays</span>
//               </label>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Calendar + Upcoming */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
//           <div className="px-5 py-4 border-b flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <button className="btn btn-sm" onClick={prevMonth}>‹</button>
//               <h2 className="text-lg font-semibold">
//                 {new Date(calYear, calMonth - 1, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
//               </h2>
//               <button className="btn btn-sm" onClick={nextMonth}>›</button>
//             </div>
//             <span className="text-sm text-gray-500">
//               {currentMonthHolidays.length} {currentMonthHolidays.length === 1 ? 'holiday' : 'holidays'}
//             </span>
//           </div>
//           <div className="p-4">
//             <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
//               <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
//             </div>
//             <div className="grid grid-cols-7 gap-2">
//               {monthGrid.map((dayNum, idx) => {
//                 if (!dayNum) {
//                   return <div key={idx} className="min-h-20 border rounded-md p-2 bg-gray-50" />;
//                 }
//                 const dayDate = new Date(calYear, calMonth - 1, dayNum);
//                 const dayIso = ymd(dayDate);
//                 const dayItems = currentMonthHolidays.filter(h => {
//                   const d = toLocalDate(h.holiday_date);
//                   return d && ymd(d) === dayIso;
//                 });

//                 const openDay = () => {
//                   setDayModal({
//                     open: true,
//                     dateLabel: dayDate.toLocaleDateString('en-MY', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' }),
//                     items: dayItems,
//                   });
//                 };

//                 return (
//                   <div key={idx} className="min-h-20 border rounded-md p-2 bg-white relative">
//                     <div className="text-xs text-right text-gray-500">{dayNum}</div>
//                     <div className="mt-1 space-y-1">
//                       {dayItems.slice(0, 2).map(item => {
//                         const count = item.is_global ? 0 :
//                           (item.company_names || '').split(',').map(s => s.trim()).filter(Boolean).length;
//                         return (
//                           <button
//                             key={item.id}
//                             className="text-[11px] px-1 py-0.5 rounded bg-blue-100 text-blue-700 truncate w-full text-left"
//                             title={item.title}
//                             onClick={openDay}
//                           >
//                             {item.title}
//                             {!item.is_global && (count > 0) ? ` — ${count} co.` : ''}
//                           </button>
//                         );
//                       })}
//                       {dayItems.length > 2 && (
//                         <button className="text-[10px] text-blue-700 underline" onClick={openDay}>
//                           +{dayItems.length - 2} more
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Upcoming (next 60 days) */}
//         <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//           <div className="px-5 py-4 border-b">
//             <h2 className="text-lg font-semibold">Upcoming (next 60 days)</h2>
//           </div>
//           <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
//             {holidays
//               .map(h => ({ h, d: toLocalDate(h.holiday_date) }))
//               .filter(x => x.d && x.d >= new Date() && x.d <= new Date(Date.now() + 60 * 86400e3))
//               .sort((a, b) => (a.d!.getTime() - b.d!.getTime()))
//               .map(({ h }) => {
//                 const namesCSV = h.company_names || '';
//                 const companyCount = namesCSV ? namesCSV.split(',').map(s => s.trim()).filter(Boolean).length : 0;
//                 return (
//                   <div key={h.id} className="flex items-start gap-3">
//                     <div className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium">
//                       {formatDisplayDate(h.holiday_date)}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="font-medium leading-tight">{h.title}</div>
//                       {h.description ? (
//                         <div className="text-sm text-gray-600 leading-tight">{h.description}</div>
//                       ) : null}

//                       <div className="mt-1">
//                         {h.is_global ? (
//                           <span className="badge badge-success badge-sm">Global</span>
//                         ) : (
//                           <>
//                             <div className="text-xs text-gray-600 mb-1">
//                               Applies to <span className="font-medium">{companyCount}</span> {companyCount === 1 ? 'company' : 'companies'}
//                             </div>
//                             <CompanyPillsCompact
//                               namesCSV={namesCSV}
//                               max={8}
//                               size="xs"
//                               onShowAll={() => openCompanyList(h.title, namesCSV)}
//                             />
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             }
//           </div>
//         </div>
//       </div>

//       {/* Results info */}
//       {filtered.length > 0 ? (
//         <div className="text-sm text-gray-600 mb-2">
//           Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of{' '}
//           <span className="font-medium">{filtered.length}</span>
//         </div>
//       ) : <div className="text-sm text-gray-600 mb-2">No results</div>}

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-10"><span className="loading loading-spinner text-primary" /></div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="font-medium text-gray-700">Date</th>
//                   <th className="font-medium text-gray-700">Title</th>
//                   <th className="font-medium text-gray-700">Description</th>
//                   <th className="font-medium text-gray-700">Companies / Scope</th>
//                   <th className="font-medium text-gray-700 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pageItems.length ? pageItems.map(h => {
//                   const names = (h.company_names || '').split(',').map(s => s.trim()).filter(Boolean);
//                   return (
//                     <tr key={h.id}>
//                       <td className="whitespace-nowrap">{formatDisplayDate(h.holiday_date)}</td>
//                       <td className="font-medium">{h.title}</td>
//                       <td className="max-w-[50ch] truncate">{h.description}</td>
//                       <td className="whitespace-normal">
//                         {h.is_global ? (
//                           <span className="badge badge-success">Global</span>
//                         ) : (
//                           <div className="flex flex-wrap gap-1">
//                             <CompanyPillsCompact
//                               namesCSV={h.company_names}
//                               max={6}
//                               onShowAll={() => openCompanyList(h.title, h.company_names)}
//                             />
//                           </div>
//                         )}
//                       </td>
//                       <td className="text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <button className="btn btn-xs btn-outline" onClick={() => openEdit(h)}>Edit</button>
//                           <button className="btn btn-xs btn-error" onClick={() => askDelete(h)}>Delete</button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 }) : (
//                   <tr><td colSpan={5} className="text-center py-8 text-gray-500">No holidays found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="mt-4 flex justify-center">
//           <div className="join">
//             <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</button>
//             <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>«</button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//               <button key={p}
//                 className={`join-item btn btn-sm ${p === currentPage ? 'bg-blue-600 text-white' : ''}`}
//                 onClick={() => setCurrentPage(p)}
//               >{p}</button>
//             ))}
//             <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>»</button>
//             <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</button>
//           </div>
//         </div>
//       )}

//       {/* Wide Create/Edit Modal */}
//       {modal.open && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
//             <div className="flex items-center justify-between border-b px-6 py-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {modal.editingId ? 'Edit Holiday' : 'Add Holiday'}
//               </h3>
//               <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
//             </div>

//             <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Left column */}
//               <div className="space-y-4">
//                 <div className="form-control">
//                   <label className="label"><span className="label-text font-medium">Date *</span></label>
//                   <input
//                     type="date"
//                     className="input input-bordered w-full"
//                     value={modal.form.holiday_date}
//                     onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, holiday_date: e.target.value } }))}
//                   />
//                 </div>
//                 <div className="form-control">
//                   <label className="label"><span className="label-text font-medium">Title *</span></label>
//                   <input
//                     className="input input-bordered w-full"
//                     placeholder="e.g., National Day"
//                     value={modal.form.title}
//                     onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, title: e.target.value } }))}
//                   />
//                 </div>
//                 <div className="form-control">
//                   <label className="label"><span className="label-text font-medium">Description</span></label>
//                   <textarea
//                     className="textarea textarea-bordered w-full min-h-[96px]"
//                     placeholder="Optional"
//                     value={modal.form.description}
//                     onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, description: e.target.value } }))}
//                   />
//                 </div>
//                 <label className="label cursor-pointer justify-start gap-3">
//                   <input
//                     type="checkbox"
//                     className="toggle toggle-info"
//                     checked={modal.form.is_global}
//                     onChange={(e) => setModal(prev => ({
//                       ...prev,
//                       form: { ...prev.form, is_global: e.target.checked, company_ids: e.target.checked ? [] : prev.form.company_ids }
//                     }))}
//                   />
//                   <span className="label-text">Global holiday</span>
//                 </label>
//               </div>

//               {/* Right column */}
//               <div className={`${modal.form.is_global ? 'opacity-50 pointer-events-none' : ''}`}>
//                 <div className="flex items-center justify-between">
//                   <div className="label"><span className="label-text font-medium">Companies</span></div>
//                   {!modal.form.is_global && (
//                     <div className="text-xs text-gray-500">
//                       Selected <span className="font-medium">{modal.form.company_ids.length}</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="h-[360px]">
//                   <CompanyMultiSelect
//                     companies={companies}
//                     value={modal.form.company_ids}
//                     onChange={(ids) => setModal((prev) => ({ ...prev, form: { ...prev.form, company_ids: ids } }))}
//                     disabled={modal.form.is_global}
//                   />
//                 </div>
//                 {!modal.form.is_global && modal.form.company_ids.length === 0 && (
//                   <div className="text-xs text-red-600 mt-1">Select at least one company.</div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
//               <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={closeModal}>Cancel</button>
//               <button
//                 className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
//                 onClick={saveHoliday}
//                 disabled={!modal.form.holiday_date || !modal.form.title.trim() || (!modal.form.is_global && modal.form.company_ids.length === 0)}
//               >
//                 {modal.editingId ? 'Update' : 'Save'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Company pills "show all" modal */}
//       <ListModal
//         open={companyModal.open}
//         title={companyModal.title}
//         items={companyModal.items}
//         onClose={() => setCompanyModal(s => ({ ...s, open: false }))}
//       />

//       {/* Day details modal */}
//       <DayDetailsModal
//         open={dayModal.open}
//         dateLabel={dayModal.dateLabel}
//         items={dayModal.items.map(h => ({
//           id: h.id,
//           title: h.title,
//           description: h.description,
//           is_global: !!h.is_global,
//           company_names: h.company_names,
//         }))}
//         onClose={() => setDayModal(s => ({ ...s, open: false }))}
//         onShowCompanies={(title, namesCSV) => openCompanyList(title, namesCSV)}
//       />
//     </div>
//   );
// }


'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

/* ===================== Types ===================== */
interface Company { id: number; name: string; }

type EventType = 'holiday' | 'event'; // already present

interface Holiday {
  id: number;
  holiday_date: string;          // 'YYYY-MM-DD' or ISO
  title: string;
  description: string | null;
  is_global: boolean | number;   
  company_ids?: number[];       
  company_names?: string;       
  event_type?: EventType; // NEW
}
type ScopeFilter = 'All' | 'Global' | 'Local';
type TypeFilter = 'All' | 'Holiday' | 'Event'; // NEW

type ConfirmState = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<void> | void;
};

type ModalState = {
  open: boolean;
  editingId: number | null;
  form: {
    holiday_date: string;
    title: string;
    description: string;
    is_global: boolean;
    company_ids: number[];
    event_type?: EventType; // NEW
  };
};

/* ===================== Utils ===================== */
function toLocalDate(value?: string | null): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
function formatDisplayDate(value?: string | null, locale = 'en-MY'): string {
  const d = toLocalDate(value);
  if (!d) return value || '-';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: '2-digit' });
}
function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ================= Confirm Dialog ================= */
function ConfirmDialog({ state, setState, z = 80 }: { state: ConfirmState; setState: any; z?: number; }) {
  const onCancel = () => setState((s: ConfirmState) => ({ ...s, open: false }));
  const onConfirm = async () => {
    try { await state.onConfirm?.(); }
    finally { setState((s: ConfirmState) => ({ ...s, open: false })); }
  };
  if (!state.open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: z }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{state.title || 'Confirm'}</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-700">{state.message || 'Are you sure?'}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={onCancel}>
            {state.cancelText || 'Cancel'}
          </button>
          <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={onConfirm}>
            {state.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== Company Multi-Select ============== */
function CompanyMultiSelect({
  companies,
  value,
  onChange,
  disabled = false,
}: {
  companies: Company[];
  value: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const normalized = useMemo(
    () => [...companies].sort((a, b) => a.name.localeCompare(b.name)),
    [companies]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalized.filter((c) => {
      const matches = !q || c.name.toLowerCase().includes(q);
      const picked = selectedSet.has(c.id);
      return matches && (!showSelectedOnly || picked);
    });
  }, [normalized, query, showSelectedOnly, selectedSet]);

  const total = companies.length;
  const selectedCount = value.length;
  const filteredSelectedCount = filtered.reduce(
    (acc, c) => acc + (selectedSet.has(c.id) ? 1 : 0),
    0
  );

  // Tri-state for "Select shown"
  const masterRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!masterRef.current) return;
    masterRef.current.indeterminate =
      filteredSelectedCount > 0 && filteredSelectedCount < filtered.length;
  }, [filteredSelectedCount, filtered.length]);

  const selectAllAcrossAll = () => onChange(normalized.map((c) => c.id));
  const clearAll = () => onChange([]);
  const toggleOne = (id: number, checked: boolean) => {
    const set = new Set(value);
    if (checked) set.add(id); else set.delete(id);
    onChange(Array.from(set));
  };
  const toggleShown = (checked: boolean) => {
    const set = new Set(value);
    if (checked) filtered.forEach((c) => set.add(c.id));
    else filtered.forEach((c) => set.delete(c.id));
    onChange(Array.from(set));
  };

  const containerClass = disabled ? 'opacity-50 pointer-events-none' : '';

  return (
    <div className={`border rounded-lg bg-white ${containerClass}`}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-3 py-3 border-b">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative md:flex-1">
            <input
              className="input input-bordered w-full pl-10"
              placeholder="Search companies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <label className="label cursor-pointer gap-2 m-0">
              <input
                type="checkbox"
                ref={masterRef}
                className="checkbox checkbox-sm"
                checked={filtered.length > 0 && filteredSelectedCount === filtered.length}
                onChange={(e) => toggleShown(e.target.checked)}
              />
              <span className="label-text">Select shown</span>
            </label>

            <button type="button" className="btn btn-sm" onClick={selectAllAcrossAll}>
              Select all
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={clearAll}>
              Clear all
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Selected <span className="font-medium">{selectedCount}</span> of <span className="font-medium">{total}</span>
            {query && (
              <span className="ml-2 text-gray-500">
                • Shown: {filteredSelectedCount}/{filtered.length}
              </span>
            )}
          </div>

          <label className="label cursor-pointer gap-2 m-0">
            <input
              type="checkbox"
              className="checkbox checkbox-xs"
              checked={showSelectedOnly}
              onChange={(e) => setShowSelectedOnly(e.target.checked)}
            />
            <span className="label-text text-xs">Show selected only</span>
          </label>
        </div>

        {/* Selected preview badges */}
        {selectedCount > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {normalized
              .filter((c) => selectedSet.has(c.id))
              .slice(0, 6)
              .map((c) => (
                <span key={c.id} className="badge badge-ghost">
                  {c.name}
                </span>
              ))}
            {selectedCount > 6 && (
              <span className="text-xs text-gray-500">+{selectedCount - 6} more</span>
            )}
          </div>
        )}
      </div>

      {/* List */}
      <div className="max-h-48 overflow-auto px-2 py-2">
        {filtered.length === 0 ? (
          <div className="text-sm text-gray-500 px-1 py-2">No companies</div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((c) => {
              const checked = selectedSet.has(c.id);
              return (
                <li key={c.id}>
                  <label className="flex items-center gap-3 py-1 px-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={checked}
                      onChange={(e) => toggleOne(c.id, e.target.checked)}
                    />
                    <span className="truncate">{c.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ===== Compact chips + “+N more” ===== */
function CompanyPillsCompact({
  namesCSV,
  max = 6,
  onShowAll,
  size = 'sm', // 'sm' | 'xs'
}: {
  namesCSV?: string;
  max?: number;
  onShowAll?: () => void;
  size?: 'sm' | 'xs';
}) {
  const names = (namesCSV || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!names.length) return null;
  const shown = names.slice(0, max);
  const remaining = names.length - shown.length;
  const badgeSize = size === 'xs' ? 'badge-xs' : 'badge-sm';

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((n, i) => (
        <span key={i} className={`badge badge-ghost ${badgeSize}`}>{n}</span>
      ))}
      {remaining > 0 && (
        <button
          type="button"
          className={`badge ${badgeSize} border-dashed cursor-pointer`}
          onClick={onShowAll}
          title="Show all companies"
        >
          +{remaining} more
        </button>
      )}
    </div>
  );
}

/* ===== Simple list modal ===== */
function ListModal({
  open,
  title,
  items,
  onClose,
}: {
  open: boolean;
  title: string;
  items: string[];
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {items.length ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((t, i) => (
                <li key={i} className="truncate">
                  <span className="badge badge-ghost">{t}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No items</div>
          )}
        </div>
        <div className="border-t px-6 py-3 bg-gray-50 text-right">
          <button className="btn btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Day details modal (all holidays for that date) ===== */
function DayDetailsModal({
  open,
  dateLabel,
  items,
  onClose,
  onShowCompanies,
}: {
  open: boolean;
  dateLabel: string;
  items: Array<{
    id: number; title: string; description?: string | null;
    is_global: boolean; company_names?: string;
  }>;
  onClose: () => void;
  onShowCompanies: (title: string, namesCSV?: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Holidays · {dateLabel}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto space-y-4">
          {items.map(h => {
            const companyNames = (h.company_names || '')
              .split(',').map(s => s.trim()).filter(Boolean);
            return (
              <div key={h.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{h.title}</div>
                    {h.description ? (
                      <div className="text-sm text-gray-600">{h.description}</div>
                    ) : null}
                  </div>
                  {h.is_global ? (
                    <span className="badge badge-success">Global</span>
                  ) : (
                    <span className="badge">{companyNames.length} companies</span>
                  )}
                </div>
                {!h.is_global && (
                  <div className="mt-2">
                    <CompanyPillsCompact
                      namesCSV={h.company_names}
                      max={8}
                      onShowAll={() => onShowCompanies(h.title, h.company_names)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="border-t px-6 py-3 bg-gray-50 text-right">
          <button className="btn btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ================== Page Component ================== */
const ITEMS_PER_PAGE = 10;

export default function ManageHolidays() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [scope, setScope] = useState<ScopeFilter>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [monthFilter, setMonthFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Moved into Filters panel:
  const [companyFilter, setCompanyFilter] = useState<string>('All'); // id or 'All'
  const [includeGlobal, setIncludeGlobal] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All'); // NEW

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirm
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });

  // Calendar controls (start at current month)
  const today = new Date();
  const [calYear, setCalYear] = useState<number>(today.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(today.getMonth() + 1); // 1..12

  // Modal (Add/Edit)
  const [modal, setModal] = useState<ModalState>({
    open: false,
    editingId: null,
    form: { holiday_date: '', title: '', description: '', is_global: true, company_ids: [], event_type: 'holiday' }, // NEW default
  });

  // Company list modal (from upcoming & day details)
  const [companyModal, setCompanyModal] = useState<{open:boolean; title:string; items:string[]}>({
    open: false, title: '', items: []
  });

  // Day details modal
  const [dayModal, setDayModal] = useState<{open:boolean; dateLabel:string; items:Holiday[]}>({
    open: false, dateLabel: '', items: []
  });

  const openCompanyList = (title: string, namesCSV?: string) => {
    const items = (namesCSV || '').split(',').map(s => s.trim()).filter(Boolean);
    setCompanyModal({ open: true, title: `Companies · ${title}`, items });
  };

  /* ===== Fetchers ===== */
  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/holiday/companies`);
      if (!res.ok) throw new Error('Failed companies');
      const data: Company[] = await res.json();
      setCompanies(data);
    } catch {
      toast.error('Failed to load companies');
    }
  };

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams();
      if (companyFilter !== 'All') q.set('company_id', companyFilter);
      if (!includeGlobal) q.set('include_global', '0');
      if (yearFilter !== 'All') q.set('year', yearFilter);
      if (monthFilter !== 'All') q.set('month', monthFilter);
      if (typeFilter !== 'All') q.set('event_type', typeFilter.toLowerCase()); // NEW

      const res = await fetch(`${API_BASE_URL}/api/holiday/holidays?${q.toString()}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data: Holiday[] = await res.json();

      setHolidays((data || []).map((h: any) => ({
        ...h,
        is_global: !!h.is_global,
        event_type: (h.event_type as EventType) || 'holiday', // NEW
        company_ids: Array.isArray(h.company_ids) ? h.company_ids : (h.company_ids ?? []),
        company_names: h.company_names || '',
      })));
    } catch {
      toast.error('Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);
  useEffect(() => { fetchHolidays(); }, [companyFilter, includeGlobal, yearFilter, monthFilter, typeFilter]); // UPDATED

  /* ===== Derived ===== */
  const sorted = useMemo(() => {
    return [...holidays].sort((a, b) => {
      const da = toLocalDate(a.holiday_date)?.getTime() ?? 0;
      const db = toLocalDate(b.holiday_date)?.getTime() ?? 0;
      return da - db || a.id - b.id;
    });
  }, [holidays]);

  const yearsAvailable = useMemo(() => {
    const set = new Set<string>();
    holidays.forEach(h => {
      const d = toLocalDate(h.holiday_date);
      if (d) set.add(String(d.getFullYear()));
    });
    return ['All', ...Array.from(set).sort()];
  }, [holidays]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const scopeTest = (h: Holiday) => {
      if (scope === 'All') return true;
      if (scope === 'Global') return !!h.is_global;
      return !h.is_global;
    };
    const typeTest = (h: Holiday) => { // NEW
      if (typeFilter === 'All') return true;
      return (h.event_type || 'holiday') === typeFilter.toLowerCase();
    };
    return sorted.filter(h =>
      scopeTest(h) &&
      typeTest(h) && // NEW
      (
        !q ||
        (h.title || '').toLowerCase().includes(q) ||
        (h.description || '').toLowerCase().includes(q) ||
        (h.company_names || '').toLowerCase().includes(q)
      )
    );
  }, [sorted, search, scope, typeFilter]); // UPDATED

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  );
  const showingFrom = (currentPage - 1) * ITEMS_PER_PAGE + (filtered.length ? 1 : 0);
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  useEffect(() => { setCurrentPage(1); }, [search, scope, holidays, typeFilter]); // UPDATED

  /* ===== Calendar ===== */
  const currentMonthHolidays = useMemo(() => {
    return holidays.filter(h => {
      const d = toLocalDate(h.holiday_date);
      if (!d) return false;
      return d.getFullYear() === calYear && d.getMonth() + 1 === calMonth;
    });
  }, [holidays, calYear, calMonth]);

  // Monday-start grid of day numbers (or null for blanks)
  const monthGrid = useMemo(() => {
    const first = new Date(calYear, calMonth - 1, 1);
    const last = new Date(calYear, calMonth, 0);
    const daysInMonth = last.getDate();
    const firstWeekdayMonStart = (first.getDay() + 6) % 7; // 0 = Monday
    const totalCells = Math.ceil((firstWeekdayMonStart + daysInMonth) / 7) * 7;

    const cells: (number | null)[] = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstWeekdayMonStart + 1;
      cells.push(dayNumber < 1 || dayNumber > daysInMonth ? null : dayNumber);
    }
    return cells;
  }, [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  /* ===== Actions ===== */
  const openCreate = () => {
    setModal({
      open: true,
      editingId: null,
      form: { holiday_date: '', title: '', description: '', is_global: true, company_ids: [], event_type: 'holiday' }, // NEW
    });
  };
  const openEdit = (row: Holiday) => {
    const d = toLocalDate(row.holiday_date);
    setModal({
      open: true,
      editingId: row.id,
      form: {
        holiday_date: d ? ymd(d) : '',
        title: row.title || '',
        description: row.description || '',
        is_global: !!row.is_global,
        company_ids: Array.isArray(row.company_ids) ? row.company_ids : [],
        event_type: (row.event_type as EventType) || 'holiday', // NEW
      },
    });
  };
  const closeModal = () => setModal(prev => ({ ...prev, open: false }));

  const saveHoliday = async () => {
    const { holiday_date, title, is_global, company_ids } = modal.form;
    if (!holiday_date || !title.trim()) {
      toast.error('Please fill date and title');
      return;
    }
    if (!is_global && (!company_ids || company_ids.length === 0)) {
      toast.error('Select at least one company for non-global holiday');
      return;
    }

    const payload = {
      holiday_date: modal.form.holiday_date,
      title: modal.form.title.trim(),
      description: modal.form.description.trim(),
      is_global: modal.form.is_global,
      company_ids: modal.form.is_global ? [] : modal.form.company_ids,
      event_type: modal.form.event_type || 'holiday', // NEW
    };

    try {
      const url = modal.editingId
        ? `${API_BASE_URL}/api/holiday/holidays/${modal.editingId}`
        : `${API_BASE_URL}/api/holiday/holidays`;
      const method = modal.editingId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Save failed');

      toast.success(modal.editingId ? 'Holiday updated' : 'Holiday added');
      closeModal();
      await fetchHolidays();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save holiday');
    }
  };

  const askDelete = (row: Holiday) => {
    setConfirm({
      open: true,
      title: 'Delete Holiday',
      message: `Delete "${row.title}" on ${formatDisplayDate(row.holiday_date)}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/holiday/holidays/${row.id}`, { method: 'DELETE' });
          if (!res.ok) {
            const t = await res.text().catch(() => '');
            throw new Error(t || 'Delete failed');
          }
          toast.success('Deleted');
          await fetchHolidays();
        } catch (e: any) {
          toast.error(e.message || 'Failed to delete');
        }
      },
    });
  };

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/holiday/holidays/import`, { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Import failed');
      toast.success(data?.message || 'Imported');
      await fetchHolidays();
    } catch (e: any) {
      toast.error(e.message || 'Import failed');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const handleExport = () => window.open(`${API_BASE_URL}/api/holiday/holidays/export`, '_blank');

  /* ================= Render ================= */
  return (
    <div className="p-6">
      <ConfirmDialog state={confirm} setState={setConfirm} z={95} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Public Holidays</h1>
          <p className="text-gray-600">Global and company-specific holidays</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openCreate}>+ Add Holiday</button>
          <button className="btn" onClick={handleExport}>Export</button>
          <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleImport} />
          <button className="btn" onClick={() => fileInputRef.current?.click()}>Import</button>
        </div>
      </div>

      {/* Search + Filters row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search by title, description, company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
                     hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => {
            setSearch(''); setScope('All'); setYearFilter('All'); setMonthFilter('All');
            setCompanyFilter('All'); setIncludeGlobal(true); setTypeFilter('All'); // NEW
          }}
        >
          Reset
        </button>
      </div>

      {/* Filters panel (includes Company + Include global) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4"> {/* UPDATED: 5 -> 6 */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Scope</span></label>
              <select className="select select-bordered select-sm w-full" value={scope} onChange={(e) => setScope(e.target.value as ScopeFilter)}>
                <option>All</option>
                <option>Global</option>
                <option>Local</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Year</span></label>
              <select className="select select-bordered select-sm w-full" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                {yearsAvailable.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Month</span></label>
              <select className="select select-bordered select-sm w-full" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                <option value="All">All</option>
                {Array.from({ length: 12 }, (_, i) => (i + 1)).map(m => (
                  <option key={m} value={String(m)}>{new Date(2000, m - 1, 1).toLocaleString('en-MY', { month: 'long' })}</option>
                ))}
              </select>
            </div>

            {/* Company filter */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Company</span></label>
              <select className="select select-bordered select-sm w-full" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
                <option value="All">All companies</option>
                {companies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
            </div>

            {/* Include Global */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Include global</span></label>
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={includeGlobal}
                  onChange={(e) => setIncludeGlobal(e.target.checked)}
                />
                <span className="label-text">Show global holidays</span>
              </label>
            </div>

            {/* NEW: Type */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Type</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              >
                <option>All</option>
                <option>Holiday</option>
                <option>Event</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Calendar + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="btn btn-sm" onClick={prevMonth}>‹</button>
              <h2 className="text-lg font-semibold">
                {new Date(calYear, calMonth - 1, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
              </h2>
              <button className="btn btn-sm" onClick={nextMonth}>›</button>
            </div>
            <span className="text-sm text-gray-500">
              {currentMonthHolidays.length} {currentMonthHolidays.length === 1 ? 'holiday' : 'holidays'}
            </span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
              <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthGrid.map((dayNum, idx) => {
                if (!dayNum) {
                  return <div key={idx} className="min-h-20 border rounded-md p-2 bg-gray-50" />;
                }
                const dayDate = new Date(calYear, calMonth - 1, dayNum);
                const dayIso = ymd(dayDate);
                const dayItems = currentMonthHolidays.filter(h => {
                  const d = toLocalDate(h.holiday_date);
                  return d && ymd(d) === dayIso;
                });

                const openDay = () => {
                  setDayModal({
                    open: true,
                    dateLabel: dayDate.toLocaleDateString('en-MY', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' }),
                    items: dayItems,
                  });
                };

                return (
                  <div key={idx} className="min-h-20 border rounded-md p-2 bg-white relative">
                    <div className="text-xs text-right text-gray-500">{dayNum}</div>
                    <div className="mt-1 space-y-1">
                      {dayItems.slice(0, 2).map(item => {
                        const count = item.is_global ? 0 :
                          (item.company_names || '').split(',').map(s => s.trim()).filter(Boolean).length;
                        return (
                          <button
                            key={item.id}
                            className="text-[11px] px-1 py-0.5 rounded bg-blue-100 text-blue-700 truncate w-full text-left"
                            title={item.title}
                            onClick={openDay}
                          >
                            {/* NEW: tiny prefix for events */}
                            {(item.event_type || 'holiday') === 'event' ? '[E] ' : ''}
                            {item.title}
                            {!item.is_global && (count > 0) ? ` — ${count} co.` : ''}
                          </button>
                        );
                      })}
                      {dayItems.length > 2 && (
                        <button className="text-[10px] text-blue-700 underline" onClick={openDay}>
                          +{dayItems.length - 2} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming (next 60 days) */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-semibold">Upcoming (next 60 days)</h2>
          </div>
          <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
            {holidays
              .map(h => ({ h, d: toLocalDate(h.holiday_date) }))
              .filter(x => x.d && x.d >= new Date() && x.d <= new Date(Date.now() + 60 * 86400e3))
              .sort((a, b) => (a.d!.getTime() - b.d!.getTime()))
              .map(({ h }) => {
                const namesCSV = h.company_names || '';
                const companyCount = namesCSV ? namesCSV.split(',').map(s => s.trim()).filter(Boolean).length : 0;
                return (
                  <div key={h.id} className="flex items-start gap-3">
                    <div className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium">
                      {formatDisplayDate(h.holiday_date)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium leading-tight flex items-center gap-2">
                        {h.title}
                        {/* NEW: small badge */}
                        {(h.event_type || 'holiday') === 'event'
                          ? <span className="badge badge-warning badge-sm">Event</span>
                          : <span className="badge badge-primary badge-sm">Holiday</span>}
                      </div>
                      {h.description ? (
                        <div className="text-sm text-gray-600 leading-tight">{h.description}</div>
                      ) : null}

                      <div className="mt-1">
                        {h.is_global ? (
                          <span className="badge badge-success badge-sm">Global</span>
                        ) : (
                          <>
                            <div className="text-xs text-gray-600 mb-1">
                              Applies to <span className="font-medium">{companyCount}</span> {companyCount === 1 ? 'company' : 'companies'}
                            </div>
                            <CompanyPillsCompact
                              namesCSV={namesCSV}
                              max={8}
                              size="xs"
                              onShowAll={() => openCompanyList(h.title, namesCSV)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* Results info */}
      {filtered.length > 0 ? (
        <div className="text-sm text-gray-600 mb-2">
          Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of{' '}
          <span className="font-medium">{filtered.length}</span>
        </div>
      ) : <div className="text-sm text-gray-600 mb-2">No results</div>}

      {/* Table */}
      {loading ? (
        <div className="text-center py-10"><span className="loading loading-spinner text-primary" /></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-medium text-gray-700">Date</th>
                  <th className="font-medium text-gray-700">Title</th>
                  <th className="font-medium text-gray-700">Description</th>
                  <th className="font-medium text-gray-700">Companies / Scope</th>
                  <th className="font-medium text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length ? pageItems.map(h => {
                  const names = (h.company_names || '').split(',').map(s => s.trim()).filter(Boolean);
                  return (
                    <tr key={h.id}>
                      <td className="whitespace-nowrap">{formatDisplayDate(h.holiday_date)}</td>
                      <td className="font-medium">
                        <div className="flex items-center gap-2">
                          {h.title}
                          {/* NEW: badge inline without adding a column */}
                          {(h.event_type || 'holiday') === 'event'
                            ? <span className="badge badge-warning badge-xs">Event</span>
                            : <span className="badge badge-primary badge-xs">Holiday</span>}
                        </div>
                      </td>
                      <td className="max-w-[50ch] truncate">{h.description}</td>
                      <td className="whitespace-normal">
                        {h.is_global ? (
                          <span className="badge badge-success">Global</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            <CompanyPillsCompact
                              namesCSV={h.company_names}
                              max={6}
                              onShowAll={() => openCompanyList(h.title, h.company_names)}
                            />
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => openEdit(h)}>Edit</button>
                          <button className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => askDelete(h)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">No holidays found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="join">
            <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</button>
            <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>«</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p}
                className={`join-item btn btn-sm ${p === currentPage ? 'bg-blue-600 text-white' : ''}`}
                onClick={() => setCurrentPage(p)}
              >{p}</button>
            ))}
            <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>»</button>
            <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</button>
          </div>
        </div>
      )}

      {/* Wide Create/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {modal.editingId ? 'Edit Holiday' : 'Add Holiday'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Date *</span></label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={modal.form.holiday_date}
                    onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, holiday_date: e.target.value } }))}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Title *</span></label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="e.g., National Day"
                    value={modal.form.title}
                    onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, title: e.target.value } }))}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Description</span></label>
                  <textarea
                    className="textarea textarea-bordered w-full min-h-[96px]"
                    placeholder="Optional"
                    value={modal.form.description}
                    onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, description: e.target.value } }))}
                  />
                </div>

                {/* NEW: Type selector */}
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Type *</span></label>
                  <select
                    className="select select-bordered w-full"
                    value={modal.form.event_type || 'holiday'}
                    onChange={(e) => setModal(prev => ({ ...prev, form: { ...prev.form, event_type: e.target.value as EventType } }))}
                  >
                    <option value="holiday">Holiday</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-info"
                    checked={modal.form.is_global}
                    onChange={(e) => setModal(prev => ({
                      ...prev,
                      form: { ...prev.form, is_global: e.target.checked, company_ids: e.target.checked ? [] : prev.form.company_ids }
                    }))}
                  />
                  <span className="label-text">Global holiday</span>
                </label>
              </div>

              {/* Right column */}
              <div className={`${modal.form.is_global ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="label"><span className="label-text font-medium">Companies</span></div>
                  {!modal.form.is_global && (
                    <div className="text-xs text-gray-500">
                      Selected <span className="font-medium">{modal.form.company_ids.length}</span>
                    </div>
                  )}
                </div>
                <div className="h-[360px]">
                  <CompanyMultiSelect
                    companies={companies}
                    value={modal.form.company_ids}
                    onChange={(ids) => setModal((prev) => ({ ...prev, form: { ...prev.form, company_ids: ids } }))}
                    disabled={modal.form.is_global}
                  />
                </div>
                {!modal.form.is_global && modal.form.company_ids.length === 0 && (
                  <div className="text-xs text-red-600 mt-1">Select at least one company.</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" onClick={closeModal}>Cancel</button>
              <button
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={saveHoliday}
                disabled={!modal.form.holiday_date || !modal.form.title.trim() || (!modal.form.is_global && modal.form.company_ids.length === 0)}
              >
                {modal.editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company pills "show all" modal */}
      <ListModal
        open={companyModal.open}
        title={companyModal.title}
        items={companyModal.items}
        onClose={() => setCompanyModal(s => ({ ...s, open: false }))}
      />

      {/* Day details modal */}
      <DayDetailsModal
        open={dayModal.open}
        dateLabel={dayModal.dateLabel}
        items={dayModal.items.map(h => ({
          id: h.id,
          title: h.title,
          description: h.description,
          is_global: !!h.is_global,
          company_names: h.company_names,
        }))}
        onClose={() => setDayModal(s => ({ ...s, open: false }))}
        onShowCompanies={(title, namesCSV) => openCompanyList(title, namesCSV)}
      />
    </div>
  );
}
