// // 'use client';
// // import React, { useEffect, useMemo, useState } from 'react';
// // import { Plus, Calendar, DollarSign, TrendingUp, X } from 'lucide-react';
// // import DatePicker from 'react-datepicker';
// // import 'react-datepicker/dist/react-datepicker.css';
// // import { API_BASE_URL } from '../../config';

// // export type IncrementKind = 'PERCENT' | 'FIXED';

// // interface IncrementHistory {
// //   id: number;
// //   effectiveDate: string;   // date-only string: YYYY-MM-DD
// //   type: IncrementKind;
// //   previousSalary: number;
// //   newSalary: number;
// //   amount: number;
// //   percentage: number;
// //   reason: string;
// //   createdAt: string;       // ISO or date-only
// //   createdBy: string;
// // }

// // interface SingleIncrementProps {
// //   currentBasic: number;
// //   currentGrade?: string | null;
// //   currency?: string;
// //   employeeId: string | number;
// //   incrementHistory?: IncrementHistory[];
// //   onApply?: (result: {
// //     newBasic: number;
// //     delta: number;
// //     pct: number;
// //     type: IncrementKind;
// //     reason: string;
// //     effectiveDate: string;
// //   }) => void;
// //   onLoadHistory?: () => void;
// //   isEditing?: boolean;
// // }

// // /* -------------------- helpers -------------------- */
// // const normalizeBase = (base: string) => base.replace(/\/+$/, '');
// // const INCREMENTS_BASE = (() => {
// //   const base = normalizeBase(API_BASE_URL || '');
// //   return /\/api\/employee-salaries$/.test(base) ? base : `${base}/api/employee-salaries`;
// // })();

// // const toDateOnly = (val: string) => (val ? val.slice(0, 10) : ''); // handles 'YYYY-MM-DD...' and ISO
// // const formatDate = (dateOnly: string) =>
// //   new Date(`${dateOnly}T00:00:00`).toLocaleDateString('en-MY', {
// //     year: 'numeric',
// //     month: 'short',
// //     day: 'numeric',
// //   });
// // const isFutureDated = (dateOnly: string) => {
// //   const today = new Date();
// //   const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
// //   const d = new Date(`${dateOnly}T00:00:00`).getTime();
// //   return d > t;
// // };

// // /* -------------------- Confirm Delete Modal -------------------- */
// // function ConfirmDeleteModal({
// //   open,
// //   title = 'Delete Increment',
// //   message = 'Are you sure you want to delete this increment?',
// //   confirmText = 'Delete',
// //   cancelText = 'Cancel',
// //   onCancel,
// //   onConfirm,
// // }: {
// //   open: boolean;
// //   title?: string;
// //   message?: string;
// //   confirmText?: string;
// //   cancelText?: string;
// //   onCancel: () => void;
// //   onConfirm: () => void;
// // }) {
// //   if (!open) return null;
// //   return (
// //     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
// //       <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
// //       <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
// //         <div className="p-6 border-b">
// //           <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
// //         </div>
// //         <div className="p-6">
// //           <p className="text-gray-700">{message}</p>
// //           <div className="mt-6 flex items-center justify-end gap-4">
// //             <button
// //               type="button"
// //               className="text-gray-700 hover:underline"
// //               onClick={onCancel}
// //             >
// //               {cancelText}
// //             </button>
// //             <button
// //               type="button"
// //               className="px-4 py-2 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600"
// //               onClick={onConfirm}
// //             >
// //               {confirmText}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* -------------------- Add Increment Modal: input NEW SALARY -------------------- */
// // interface IncrementModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   currentBasic: number;
// //   currency: string;
// //   onSubmit: (increment: {
// //     newBasic: number;            // absolute new salary
// //     reason: string;
// //     effectiveDate: string;       // YYYY-MM-DD
// //   }) => void;
// // }

// // function IncrementModal({ isOpen, onClose, currentBasic, currency, onSubmit }: IncrementModalProps) {
// //   const [newBasic, setNewBasic] = useState<number>(currentBasic);
// //   const [reason, setReason] = useState<string>('');
// //   const [error, setError] = useState<string | null>(null);
// //   const [effectiveDate, setEffectiveDate] = useState<Date | null>(() => {
// //     const today = new Date();
// //     return new Date(today.getFullYear(), today.getMonth() + 1, 1);
// //   });

// //   const getFirstDayOfNextMonth = () => {
// //     const today = new Date();
// //     return new Date(today.getFullYear(), today.getMonth() + 1, 1);
// //   };
// //   const minDate = getFirstDayOfNextMonth();

// //   const preview = useMemo(() => {
// //     const delta = Math.round((newBasic - currentBasic) * 100) / 100;
// //     const pct = currentBasic ? (delta / currentBasic) * 100 : 0;
// //     return {
// //       newBasic: Math.round(newBasic * 100) / 100,
// //       delta: Math.round(delta * 100) / 100,
// //       pct: Math.round(pct * 10) / 10,
// //     };
// //   }, [newBasic, currentBasic]);

// //   useEffect(() => {
// //     // Reset newBasic if modal reopens for a different currentBasic
// //     if (isOpen) setNewBasic(currentBasic);
// //   }, [isOpen, currentBasic]);

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
// //       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
// //       <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl md:max-w-6xl">
// //         <div className="flex items-center justify-between p-6 border-b">
// //           <h3 className="text-lg font-semibold text-gray-900">Add Salary Increment</h3>
// //           <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
// //             <X size={20} />
// //           </button>
// //         </div>

// //         <div className="p-6 max-h-[70vh] overflow-y-auto pr-4 -mr-4 [scrollbar-gutter:stable] [scrollbar-width:thin]">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //             <div className="md:col-span-2 space-y-6">
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     New Salary ({currency})
// //                   </label>
// //                   <input
// //                     type="number"
// //                     value={Number.isFinite(newBasic) ? newBasic : ''}
// //                     onChange={(e) => setNewBasic(Number(e.target.value))}
// //                     min={currentBasic}
// //                     step={0.01}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                     placeholder={`${currency} ${currentBasic.toLocaleString()}`}
// //                     required
// //                   />
// //                   <p className="mt-1 text-xs text-gray-500">Enter the final basic salary after increment.</p>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
// //                   <DatePicker
// //                     selected={effectiveDate}
// //                     onChange={(date) => setEffectiveDate(date)}
// //                     minDate={minDate}
// //                     dateFormat="yyyy/MM/dd"
// //                     placeholderText="Select a date"
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                     wrapperClassName="w-full"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Reason <span className="text-red-500">*</span>
// //                 </label>
// //                 <textarea
// //                   value={reason}
// //                   onChange={(e) => setReason(e.target.value)}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                   rows={4}
// //                   placeholder="e.g., Annual performance increment, Market adjustment"
// //                   required
// //                 />
// //               </div>
// //             </div>

// //             {/* Preview */}
// //             <div className="md:col-span-1">
// //               <div className="md:sticky md:top-6">
// //                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
// //                   <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
// //                   <div className="grid grid-cols-2 gap-4 text-sm">
// //                     <div>
// //                       <p className="text-gray-500">Current Salary</p>
// //                       <p className="font-semibold">{currency} {currentBasic.toLocaleString()}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-gray-500">New Salary</p>
// //                       <p className="font-semibold text-green-600">{currency} {preview.newBasic.toLocaleString()}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-gray-500">Increase</p>
// //                       <p className="font-semibold text-green-600">+{currency} {preview.delta.toLocaleString()}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-gray-500">% Change</p>
// //                       <p className="font-semibold">
// //                         {currentBasic ? preview.pct.toFixed(1) : '0.0'}%
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Actions */}
// //             <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 pt-2">
// //               <button type="button" onClick={onClose}
// //                 className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   if (!reason.trim() || !effectiveDate) {
// //                     setError('Please provide a reason and select an effective date.');
// //                     return;
// //                   }
// //                   if (!(newBasic > currentBasic)) {
// //                     setError('New salary must be greater than current salary.');
// //                     return;
// //                   }
// //                   onSubmit({
// //                     newBasic: Math.round(newBasic * 100) / 100,
// //                     reason: reason.trim(),
// //                     effectiveDate: effectiveDate.toISOString().slice(0, 10),
// //                   });
// //                   // reset
// //                   setNewBasic(currentBasic);
// //                   setReason('');
// //                   setEffectiveDate(getFirstDayOfNextMonth());
// //                   onClose();
// //                 }}
// //                 className="flex-1 px-4 py-2 text-sm font-medium text-white btn btn-primary rounded-lg"
// //               >
// //                 Apply Increment
// //               </button>

// //               {error && (
// //                 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
// //                   <div className="absolute inset-0 bg-black/40" onClick={() => setError(null)} />
// //                   <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
// //                     <div className="flex items-center justify-between p-4 border-b">
// //                       <h4 className="text-sm font-semibold text-gray-900">Validation Required</h4>
// //                       <button
// //                         onClick={() => setError(null)}
// //                         aria-label="Close"
// //                         className="text-gray-400 hover:text-gray-600"
// //                       >
// //                         <X size={18} />
// //                       </button>
// //                     </div>
// //                     <div className="p-5">
// //                       <p className="text-sm text-gray-700">{error}</p>
// //                     </div>
// //                     <div className="flex justify-end gap-2 p-4 border-t">
// //                       <button
// //                         onClick={() => setError(null)}
// //                         className="px-4 py-2 text-sm font-medium text-white btn btn-primary rounded-lg"
// //                       >
// //                         OK
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* -------------------- Main -------------------- */
// // export default function SingleIncrementTab({
// //   currentBasic,
// //   currentGrade,
// //   currency = 'MYR',
// //   employeeId,
// //   incrementHistory: historyProp = [],
// //   onApply,
// //   onLoadHistory,
// //   isEditing = false
// // }: SingleIncrementProps) {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [confirmOpen, setConfirmOpen] = useState(false);
// //   const [deleteId, setDeleteId] = useState<number | null>(null);
// //   const [isProrated, setIsProrated] = useState(false);
// //   const [history, setHistory] = useState<IncrementHistory[]>(historyProp);
// //   const [loading, setLoading] = useState(false);
// //   const eid = Number(employeeId);

// //   const mapApiToHistory = (rows: any[]): IncrementHistory[] =>
// //     rows.map((r) => {
// //       const prev = Number(r.previous_salary ?? 0);
// //       const next = Number(r.new_salary ?? 0);
// //       const amt = +(next - prev).toFixed(2);
// //       const pct = r.type === 'PERCENT'
// //         ? Number(r.value)
// //         : prev > 0 ? +((amt / prev) * 100).toFixed(2) : 0;
// //       return {
// //         id: Number(r.id),
// //         effectiveDate: toDateOnly(String(r.effective_date)), // force date-only
// //         type: r.type,
// //         previousSalary: prev,
// //         newSalary: next,
// //         amount: amt,
// //         percentage: pct,
// //         reason: r.reason,
// //         createdAt: String(r.created_at),
// //         createdBy: String(r.created_by)
// //       };
// //     });

// //   const fetchHistory = async () => {
// //     setLoading(true);
// //     try {
// //       const resp = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments`, { cache: 'no-store' });
// //       if (!resp.ok) throw new Error(`Failed to load increments (${resp.status})`);
// //       const data = await resp.json();
// //       setHistory(mapApiToHistory(Array.isArray(data) ? data : []));
// //     } catch (e) {
// //       console.error(e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchHistory();
// //     if (onLoadHistory) {
// //       onLoadHistory();
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [eid]);

// //   // Receive absolute newBasic from modal, compute delta and persist with type='FIXED'
// //   const handleModalSubmit = async (payload: {
// //     newBasic: number;
// //     reason: string;
// //     effectiveDate: string; // YYYY-MM-DD
// //   }) => {
// //     const { newBasic, reason, effectiveDate } = payload;
// //     const delta = +(newBasic - currentBasic).toFixed(2);
// //     const pct = currentBasic ? +((delta / currentBasic) * 100).toFixed(1) : 0;

// //     if (onApply) {
// //       onApply({
// //         newBasic,
// //         delta,
// //         pct,
// //         type: 'FIXED',
// //         reason,
// //         effectiveDate
// //       });
// //     }

// //     try {
// //       const res = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           effective_date: effectiveDate,
// //           type: 'FIXED',
// //           value: delta,             // store the increment amount
// //           reason,
// //           created_by: 1
// //         })
// //       });

// //       if (!res.ok) {
// //         let msg = `Failed to create increment (${res.status})`;
// //         try {
// //           const err = await res.json();
// //           if (err?.error) msg = err.error;
// //         } catch {}
// //         alert(msg);
// //         return;
// //       }
// //       await fetchHistory();
// //     } catch (e) {
// //       console.error(e);
// //       alert('Network error while creating increment.');
// //     }
// //   };

// //   const requestDelete = (incId: number) => {
// //     setDeleteId(incId);
// //     setConfirmOpen(true);
// //   };

// //   const confirmDelete = async () => {
// //     if (deleteId == null) return;
// //     try {
// //       const res = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments/${deleteId}`, {
// //         method: 'DELETE'
// //       });
// //       if (!res.ok) {
// //         let msg = `Failed to delete increment (${res.status})`;
// //         try {
// //           const err = await res.json();
// //           if (err?.error) msg = err.error;
// //         } catch {}
// //         alert(msg);
// //         return;
// //       }
// //       await fetchHistory();
// //     } catch (e) {
// //       console.error(e);
// //       alert('Network error while deleting increment.');
// //     } finally {
// //       setConfirmOpen(false);
// //       setDeleteId(null);
// //     }
// //   };

// //   const sortedHistory = [...history]
// //     .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime())
// //     .reverse();

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h2 className="text-2xl font-semibold text-gray-900">Increments</h2>
// //         </div>
// //         {isEditing && (
// //           <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
// //             <Plus className="h-5 w-5 mr-2" /> Add Increment
// //           </button>
// //         )}
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //         <div className="bg-white border border-gray-200 rounded-lg p-4">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-blue-100 rounded-lg">
// //               <DollarSign size={20} className="text-blue-600" />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-600">Current Salary</p>
// //               <p className="text-lg font-semibold text-gray-900">{currency} {currentBasic.toLocaleString()}</p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white border border-gray-200 rounded-lg p-4">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-green-100 rounded-lg">
// //               <TrendingUp size={20} className="text-green-600" />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-600">Total Increments</p>
// //               <p className="text-lg font-semibold text-gray-900">{history.length}</p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white border border-gray-200 rounded-lg p-4">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-purple-100 rounded-lg">
// //               <Calendar size={20} className="text-purple-600" />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-600">Last Increment</p>
// //               <p className="text-lg font-semibold text-gray-900">
// //                 {sortedHistory.length > 0 ? formatDate(sortedHistory[0].effectiveDate) : 'No increments'}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Increment History */}
// //       <div className="bg-white border border-gray-200 rounded-lg">
// //         <div className="px-6 py-4 border-b border-gray-200">
// //           <h3 className="text-lg font-medium text-gray-900">Increment History</h3>
// //         </div>

// //         {loading ? (
// //           <div className="p-6 text-sm text-gray-500">Loading…</div>
// //         ) : history.length === 0 ? (
// //           <div className="rounded-2xl bg-base-200 p-12 text-center">
// //             <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-base-100 flex items-center justify-center">
// //               <TrendingUp className="h-8 w-8 text-gray-400" />
// //             </div>
// //             <p className="text-gray-500 text-lg mb-2">No salary increments recorded yet</p>
// //             <p className="text-gray-400 text-sm">
// //               {isEditing ? 'Click "Add Increment" to get started.' : 'Increments will appear here once recorded.'}
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="divide-y divide-gray-200">
// //             {sortedHistory.map((inc) => (
// //               <div key={inc.id} className="p-6 hover:bg-gray-50 transition-colors">
// //                 <div className="flex items-center justify-between">
// //                   <div className="flex-1">
// //                     <div className="flex items-center gap-4 mb-2">
// //                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                         inc.type === 'PERCENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
// //                       }`}>
// //                         {inc.type === 'PERCENT' ? `${inc.percentage.toFixed(1)}%` : 'Fixed Amount'}
// //                       </span>
// //                       <span className="text-sm text-gray-600">Effective: {formatDate(inc.effectiveDate)}</span>
// //                     </div>
// //                     <p className="text-sm font-medium text-gray-900 mb-1">{inc.reason}</p>
// //                     <p className="text-xs text-gray-500">Added by {inc.createdBy} on {formatDate(toDateOnly(inc.createdAt))}</p>
// //                   </div>

// //                   <div className="text-right">
// //                     <div className="text-sm text-gray-600">
// //                       {currency} {inc.previousSalary.toLocaleString()} → {currency} {inc.newSalary.toLocaleString()}
// //                     </div>
// //                     <div className="text-lg font-semibold text-green-600">
// //                       +{currency} {inc.amount.toLocaleString()}
// //                     </div>

// //                     {isEditing && isFutureDated(inc.effectiveDate) && (
// //                       <div className="mt-2 flex justify-end gap-2">
// //                         <button
// //                           type="button"
// //                           onClick={() => requestDelete(inc.id)}
// //                           className="px-3 py-1 text-sm border border-rose-300 text-rose-700 rounded hover:bg-rose-50"
// //                         >
// //                           Delete
// //                         </button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Add Increment Modal */}
// //       <IncrementModal
// //         isOpen={isEditing && isModalOpen}
// //         onClose={() => setIsModalOpen(false)}
// //         currentBasic={currentBasic}
// //         currency={currency}
// //         onSubmit={handleModalSubmit}
// //       />

// //       {/* Confirm Delete Modal */}
// //       <ConfirmDeleteModal
// //         open={confirmOpen}
// //         title="Delete Increment"
// //         message="Are you sure you want to delete this increment?"
// //         confirmText="Delete"
// //         cancelText="Cancel"
// //         onCancel={() => {
// //           setConfirmOpen(false);
// //           setDeleteId(null);
// //         }}
// //         onConfirm={confirmDelete}
// //       />
// //     </div>
// //   );
// // }

// 'use client';
// import React, { useEffect, useMemo, useState } from 'react';
// import { Plus, Calendar, DollarSign, TrendingUp, X } from 'lucide-react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { API_BASE_URL } from '../../config';

// export type IncrementKind = 'PERCENT' | 'FIXED';

// interface IncrementHistory {
//   id: number;
//   effectiveDate: string;   // date-only string: YYYY-MM-DD
//   type: IncrementKind;
//   previousSalary: number;
//   newSalary: number;
//   amount: number;
//   percentage: number;
//   reason: string;
//   createdAt: string;       // ISO or date-only
//   createdBy: string;
// }

// interface SingleIncrementProps {
//   currentBasic: number;
//   currentGrade?: string | null;
//   currency?: string;
//   employeeId: string | number;
//   incrementHistory?: IncrementHistory[];
//   onApply?: (result: {
//     newBasic: number;
//     delta: number;
//     pct: number;
//     type: IncrementKind;
//     reason: string;
//     effectiveDate: string;
//     isProrated?: boolean;
//   }) => void;
//   onLoadHistory?: () => void;
//   isEditing?: boolean;
// }

// /* -------------------- helpers -------------------- */
// const normalizeBase = (base: string) => base.replace(/\/+$/, '');
// const INCREMENTS_BASE = (() => {
//   const base = normalizeBase(API_BASE_URL || '');
//   return /\/api\/employee-salaries$/.test(base) ? base : `${base}/api/employee-salaries`;
// })();

// const toDateOnly = (val: string) => (val ? val.slice(0, 10) : ''); // handles 'YYYY-MM-DD...' and ISO
// const formatDate = (dateOnly: string) =>
//   new Date(`${dateOnly}T00:00:00`).toLocaleDateString('en-MY', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// const isFutureDated = (dateOnly: string) => {
//   const today = new Date();
//   const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
//   const d = new Date(`${dateOnly}T00:00:00`).getTime();
//   return d > t;
// };

// /* -------------------- Confirm Delete Modal -------------------- */
// function ConfirmDeleteModal({
//   open,
//   title = 'Delete Increment',
//   message = 'Are you sure you want to delete this increment?',
//   confirmText = 'Delete',
//   cancelText = 'Cancel',
//   onCancel,
//   onConfirm,
// }: {
//   open: boolean;
//   title?: string;
//   message?: string;
//   confirmText?: string;
//   cancelText?: string;
//   onCancel: () => void;
//   onConfirm: () => void;
// }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
//       <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
//       <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
//         <div className="p-6 border-b">
//           <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//         </div>
//         <div className="p-6">
//           <p className="text-gray-700">{message}</p>
//           <div className="mt-6 flex items-center justify-end gap-4">
//             <button
//               type="button"
//               className="text-gray-700 hover:underline"
//               onClick={onCancel}
//             >
//               {cancelText}
//             </button>
//             <button
//               type="button"
//               className="px-4 py-2 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600"
//               onClick={onConfirm}
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------- Add Increment Modal: input NEW SALARY -------------------- */
// interface IncrementModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   currentBasic: number;
//   currency: string;
//   onSubmit: (increment: {
//     newBasic: number;            // absolute new salary
//     reason: string;
//     effectiveDate: string;       // YYYY-MM-DD
//     isProrated?: boolean;
//   }) => void;
// }

// function IncrementModal({ isOpen, onClose, currentBasic, currency, onSubmit }: IncrementModalProps) {
//   const [newBasic, setNewBasic] = useState<number>(currentBasic);
//   const [reason, setReason] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);
//   const [effectiveDate, setEffectiveDate] = useState<Date | null>(() => {
//     const today = new Date();
//     return new Date(today.getFullYear(), today.getMonth() + 1, 1);
//   });
//   const [isProrated, setIsProrated] = useState<boolean>(false);

//   const getFirstDayOfNextMonth = () => {
//     const today = new Date();
//     return new Date(today.getFullYear(), today.getMonth() + 1, 1);
//   };
//   const minDate = getFirstDayOfNextMonth();

//   const preview = useMemo(() => {
//     const delta = Math.round((newBasic - currentBasic) * 100) / 100;
//     const pct = currentBasic ? (delta / currentBasic) * 100 : 0;
//     return {
//       newBasic: Math.round(newBasic * 100) / 100,
//       delta: Math.round(delta * 100) / 100,
//       pct: Math.round(pct * 10) / 10,
//     };
//   }, [newBasic, currentBasic]);

//   useEffect(() => {
//     // Reset newBasic if modal reopens for a different currentBasic
//     if (isOpen) setNewBasic(currentBasic);
//   }, [isOpen, currentBasic]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl md:max-w-6xl">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h3 className="text-lg font-semibold text-gray-900">Add Salary Increment</h3>
//           <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6 max-h-[70vh] overflow-y-auto pr-4 -mr-4 [scrollbar-gutter:stable] [scrollbar-width:thin]">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Salary ({currency})
//                   </label>
//                   <input
//                     type="number"
//                     value={Number.isFinite(newBasic) ? newBasic : ''}
//                     onChange={(e) => setNewBasic(Number(e.target.value))}
//                     min={currentBasic}
//                     step={0.01}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder={`${currency} ${currentBasic.toLocaleString()}`}
//                     required
//                   />
//                   <p className="mt-1 text-xs text-gray-500">Enter the final basic salary after increment.</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
//                   <DatePicker
//                     selected={effectiveDate}
//                     onChange={(date) => setEffectiveDate(date)}
//                     minDate={minDate}
//                     dateFormat="yyyy/MM/dd"
//                     placeholderText="Select a date"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     wrapperClassName="w-full"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Prorated Checkbox */}
//               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                 <div className="form-control">
//                   <label className="flex items-center gap-3 cursor-pointer group">
//                     <input 
//                       type="checkbox" 
//                       className="checkbox checkbox-primary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all" 
//                       checked={isProrated}
//                       onChange={(e) => setIsProrated(e.target.checked)}
//                     />
//                     <div className="flex flex-col">
//                       <span className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors">Prorated Increment</span>
//                       <span className="text-sm text-gray-500 mt-1">
//                         Calculate increment amount based on actual service duration for partial periods
//                       </span>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Reason <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   rows={4}
//                   placeholder="e.g., Annual performance increment, Market adjustment"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Preview */}
//             <div className="md:col-span-1">
//               <div className="md:sticky md:top-6">
//                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
//                   <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-500">Current Salary</p>
//                       <p className="font-semibold">{currency} {currentBasic.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">New Salary</p>
//                       <p className="font-semibold text-green-600">{currency} {preview.newBasic.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Increase</p>
//                       <p className="font-semibold text-green-600">+{currency} {preview.delta.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">% Change</p>
//                       <p className="font-semibold">
//                         {currentBasic ? preview.pct.toFixed(1) : '0.0'}%
//                       </p>
//                     </div>
//                     {isProrated && (
//                       <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
//                         <p className="text-gray-500">Prorated</p>
//                         <p className="font-semibold text-blue-600 text-xs">Yes - Amount will be adjusted based on service duration</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 pt-2">
//               <button type="button" onClick={onClose}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (!reason.trim() || !effectiveDate) {
//                     setError('Please provide a reason and select an effective date.');
//                     return;
//                   }
//                   if (!(newBasic > currentBasic)) {
//                     setError('New salary must be greater than current salary.');
//                     return;
//                   }
//                   onSubmit({
//                     newBasic: Math.round(newBasic * 100) / 100,
//                     reason: reason.trim(),
//                     effectiveDate: effectiveDate.toISOString().slice(0, 10),
//                     isProrated,
//                   });
//                   // reset
//                   setNewBasic(currentBasic);
//                   setReason('');
//                   setEffectiveDate(getFirstDayOfNextMonth());
//                   setIsProrated(false);
//                   onClose();
//                 }}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-white btn btn-primary rounded-lg"
//               >
//                 Apply Increment
//               </button>

//               {error && (
//                 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//                   <div className="absolute inset-0 bg-black/40" onClick={() => setError(null)} />
//                   <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
//                     <div className="flex items-center justify-between p-4 border-b">
//                       <h4 className="text-sm font-semibold text-gray-900">Validation Required</h4>
//                       <button
//                         onClick={() => setError(null)}
//                         aria-label="Close"
//                         className="text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={18} />
//                       </button>
//                     </div>
//                     <div className="p-5">
//                       <p className="text-sm text-gray-700">{error}</p>
//                     </div>
//                     <div className="flex justify-end gap-2 p-4 border-t">
//                       <button
//                         onClick={() => setError(null)}
//                         className="px-4 py-2 text-sm font-medium text-white btn btn-primary rounded-lg"
//                       >
//                         OK
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------- Main -------------------- */
// export default function SingleIncrementTab({
//   currentBasic,
//   currentGrade,
//   currency = 'MYR',
//   employeeId,
//   incrementHistory: historyProp = [],
//   onApply,
//   onLoadHistory,
//   isEditing = false
// }: SingleIncrementProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [history, setHistory] = useState<IncrementHistory[]>(historyProp);
//   const [loading, setLoading] = useState(false);
//   const eid = Number(employeeId);

//   const mapApiToHistory = (rows: any[]): IncrementHistory[] =>
//     rows.map((r) => {
//       const prev = Number(r.previous_salary ?? 0);
//       const next = Number(r.new_salary ?? 0);
//       const amt = +(next - prev).toFixed(2);
//       const pct = r.type === 'PERCENT'
//         ? Number(r.value)
//         : prev > 0 ? +((amt / prev) * 100).toFixed(2) : 0;
//       return {
//         id: Number(r.id),
//         effectiveDate: toDateOnly(String(r.effective_date)), // force date-only
//         type: r.type,
//         previousSalary: prev,
//         newSalary: next,
//         amount: amt,
//         percentage: pct,
//         reason: r.reason,
//         createdAt: String(r.created_at),
//         createdBy: String(r.created_by)
//       };
//     });

//   const fetchHistory = async () => {
//     setLoading(true);
//     try {
//       const resp = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments`, { cache: 'no-store' });
//       if (!resp.ok) throw new Error(`Failed to load increments (${resp.status})`);
//       const data = await resp.json();
//       setHistory(mapApiToHistory(Array.isArray(data) ? data : []));
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//     if (onLoadHistory) {
//       onLoadHistory();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [eid]);

//   // Receive absolute newBasic from modal, compute delta and persist with type='FIXED'
//   const handleModalSubmit = async (payload: {
//     newBasic: number;
//     reason: string;
//     effectiveDate: string; // YYYY-MM-DD
//     isProrated?: boolean;
//   }) => {
//     const { newBasic, reason, effectiveDate, isProrated } = payload;
//     const delta = +(newBasic - currentBasic).toFixed(2);
//     const pct = currentBasic ? +((delta / currentBasic) * 100).toFixed(1) : 0;

//     if (onApply) {
//       onApply({
//         newBasic,
//         delta,
//         pct,
//         type: 'FIXED',
//         reason,
//         effectiveDate,
//         isProrated
//       });
//     }

//     try {
//       const res = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           effective_date: effectiveDate,
//           type: 'FIXED',
//           value: delta,             // store the increment amount
//           reason,
//           is_prorated: isProrated || false,
//           created_by: 1
//         })
//       });

//       if (!res.ok) {
//         let msg = `Failed to create increment (${res.status})`;
//         try {
//           const err = await res.json();
//           if (err?.error) msg = err.error;
//         } catch {}
//         alert(msg);
//         return;
//       }
//       await fetchHistory();
//     } catch (e) {
//       console.error(e);
//       alert('Network error while creating increment.');
//     }
//   };

//   const requestDelete = (incId: number) => {
//     setDeleteId(incId);
//     setConfirmOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (deleteId == null) return;
//     try {
//       const res = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments/${deleteId}`, {
//         method: 'DELETE'
//       });
//       if (!res.ok) {
//         let msg = `Failed to delete increment (${res.status})`;
//         try {
//           const err = await res.json();
//           if (err?.error) msg = err.error;
//         } catch {}
//         alert(msg);
//         return;
//       }
//       await fetchHistory();
//     } catch (e) {
//       console.error(e);
//       alert('Network error while deleting increment.');
//     } finally {
//       setConfirmOpen(false);
//       setDeleteId(null);
//     }
//   };

//   const sortedHistory = [...history]
//     .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime())
//     .reverse();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-900">Increments</h2>
//         </div>
//         {isEditing && (
//           <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
//             <Plus className="h-5 w-5 mr-2" /> Add Increment
//           </button>
//         )}
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <DollarSign size={20} className="text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Current Salary</p>
//               <p className="text-lg font-semibold text-gray-900">{currency} {currentBasic.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <TrendingUp size={20} className="text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Increments</p>
//               <p className="text-lg font-semibold text-gray-900">{history.length}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <Calendar size={20} className="text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Last Increment</p>
//               <p className="text-lg font-semibold text-gray-900">
//                 {sortedHistory.length > 0 ? formatDate(sortedHistory[0].effectiveDate) : 'No increments'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Increment History */}
//       <div className="bg-white border border-gray-200 rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900">Increment History</h3>
//         </div>

//         {loading ? (
//           <div className="p-6 text-sm text-gray-500">Loading…</div>
//         ) : history.length === 0 ? (
//           <div className="rounded-2xl bg-base-200 p-12 text-center">
//             <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-base-100 flex items-center justify-center">
//               <TrendingUp className="h-8 w-8 text-gray-400" />
//             </div>
//             <p className="text-gray-500 text-lg mb-2">No salary increments recorded yet</p>
//             <p className="text-gray-400 text-sm">
//               {isEditing ? 'Click "Add Increment" to get started.' : 'Increments will appear here once recorded.'}
//             </p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-200">
//             {sortedHistory.map((inc) => (
//               <div key={inc.id} className="p-6 hover:bg-gray-50 transition-colors">
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-4 mb-2">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         inc.type === 'PERCENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                       }`}>
//                         {inc.type === 'PERCENT' ? `${inc.percentage.toFixed(1)}%` : 'Fixed Amount'}
//                       </span>
//                       <span className="text-sm text-gray-600">Effective: {formatDate(inc.effectiveDate)}</span>
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 mb-1">{inc.reason}</p>
//                     <p className="text-xs text-gray-500">Added by {inc.createdBy} on {formatDate(toDateOnly(inc.createdAt))}</p>
//                   </div>

//                   <div className="text-right">
//                     <div className="text-sm text-gray-600">
//                       {currency} {inc.previousSalary.toLocaleString()} → {currency} {inc.newSalary.toLocaleString()}
//                     </div>
//                     <div className="text-lg font-semibold text-green-600">
//                       +{currency} {inc.amount.toLocaleString()}
//                     </div>

//                     {isEditing && isFutureDated(inc.effectiveDate) && (
//                       <div className="mt-2 flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => requestDelete(inc.id)}
//                           className="px-3 py-1 text-sm border border-rose-300 text-rose-700 rounded hover:bg-rose-50"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add Increment Modal */}
//       <IncrementModal
//         isOpen={isEditing && isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         currentBasic={currentBasic}
//         currency={currency}
//         onSubmit={handleModalSubmit}
//       />

//       {/* Confirm Delete Modal */}
//       <ConfirmDeleteModal
//         open={confirmOpen}
//         title="Delete Increment"
//         message="Are you sure you want to delete this increment?"
//         confirmText="Delete"
//         cancelText="Cancel"
//         onCancel={() => {
//           setConfirmOpen(false);
//           setDeleteId(null);
//         }}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// }



'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Calendar, DollarSign, TrendingUp, X, AlertTriangle, Info } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE_URL } from '../../config';

export type IncrementKind = 'PERCENT' | 'FIXED';

interface IncrementHistory {
  id: number;
  effectiveDate: string;   // date-only string: YYYY-MM-DD
  type: IncrementKind;
  previousSalary: number;
  newSalary: number;
  amount: number;
  percentage: number;
  reason: string;
  createdAt: string;       // ISO or date-only
  createdBy: string;
  isLocked?: boolean;
}

interface SingleIncrementProps {
  currentBasic: number;
  currentGrade?: string | null;
  currency?: string;
  employeeId: string | number;
  incrementHistory?: IncrementHistory[];
  onApply?: (result: {
    newBasic: number;
    delta: number;
    pct: number;
    type: IncrementKind;
    reason: string;
    effectiveDate: string;
    isProrated?: boolean;
  }) => void;
  onLoadHistory?: () => void;
  isEditing?: boolean;
  joinedDate?: string;
}

/* -------------------- helpers -------------------- */
const normalizeBase = (base: string) => base.replace(/\/+$/, '');
const INCREMENTS_BASE = (() => {
  const base = normalizeBase(API_BASE_URL || '');
  return /\/api\/employee-salaries$/.test(base) ? base : `${base}/api/employee-salaries`;
})();

const toDateOnly = (val: string) => (val ? val.slice(0, 10) : '');
const formatDate = (dateOnly: string) =>
  new Date(`${dateOnly}T00:00:00`).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const isFutureDated = (dateOnly: string) => {
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const d = new Date(`${dateOnly}T00:00:00`).getTime();
  return d > t;
};

const isBeforeJoinedDate = (dateOnly: string, joinedDate?: string) => {
  if (!joinedDate) return false;
  const joined = new Date(`${joinedDate}T00:00:00`).getTime();
  const d = new Date(`${dateOnly}T00:00:00`).getTime();
  return d < joined;
};

/* -------------------- Confirm Delete Modal -------------------- */
function ConfirmDeleteModal({
  open,
  title = 'Delete Increment',
  message = 'Are you sure you want to delete this increment?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
          <div className="mt-6 flex items-center justify-end gap-4">
            <button
              type="button"
              className="text-gray-700 hover:underline"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Increment Modal -------------------- */
interface IncrementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBasic: number;
  currency: string;
  onSubmit: (increment: {
    newBasic: number;
    reason: string;
    effectiveDate: string;
    isProrated?: boolean;
  }) => void;
  joinedDate?: string;
  incrementHistory?: IncrementHistory[];
}

function IncrementModal({ 
  isOpen, 
  onClose, 
  currentBasic, 
  currency, 
  onSubmit, 
  joinedDate,
  incrementHistory = [] 
}: IncrementModalProps) {
  const [newBasic, setNewBasic] = useState<number>(currentBasic);
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(() => new Date());
  const [isProrated, setIsProrated] = useState<boolean>(false);
  const [isPastDate, setIsPastDate] = useState<boolean>(false);
  const [previousSalaryAtDate, setPreviousSalaryAtDate] = useState<number | null>(null);

  // Get min date (joined date or 10 years ago)
  const getMinDate = () => {
    if (joinedDate) {
      return new Date(joinedDate);
    }
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 10);
    return minDate;
  };

  const minDate = getMinDate();
  
  // Get max date (today + 1 year)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    return maxDate;
  };

  const maxDate = getMaxDate();

  // Calculate what the salary was at the selected effective date
  const calculatePreviousSalaryAtDate = (date: Date): number => {
    const dateStr = date.toISOString().slice(0, 10);
    
    // Sort increments by date (ascending)
    const sortedHistory = [...incrementHistory].sort(
      (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
    );
    
    // Find the latest increment before or on the selected date
    let previousSalary = currentBasic;
    
    for (const inc of sortedHistory.reverse()) {
      if (inc.effectiveDate <= dateStr) {
        // For the exact date, we need to check if we're inserting before or after existing increment
        if (inc.effectiveDate === dateStr) {
          // If there's already an increment on this date, use its previous salary
          return inc.previousSalary;
        } else {
          // Use the newSalary of the increment before our date
          return inc.newSalary;
        }
      }
      // Keep track of the latest newSalary we've seen
      previousSalary = inc.newSalary;
    }
    
    return currentBasic;
  };

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setEffectiveDate(today);
      setNewBasic(currentBasic);
      setPreviousSalaryAtDate(currentBasic);
      
      if (effectiveDate) {
        const isPast = effectiveDate < today;
        setIsPastDate(isPast);
        if (isPast) {
          const prevSalary = calculatePreviousSalaryAtDate(effectiveDate);
          setPreviousSalaryAtDate(prevSalary);
        }
      }
    }
  }, [isOpen, currentBasic]);

  useEffect(() => {
    if (effectiveDate) {
      const today = new Date();
      const isPast = effectiveDate < today;
      setIsPastDate(isPast);
      
      if (isPast) {
        const prevSalary = calculatePreviousSalaryAtDate(effectiveDate);
        setPreviousSalaryAtDate(prevSalary);
      } else {
        // For future dates, compare with current salary
        setPreviousSalaryAtDate(currentBasic);
      }
    }
  }, [effectiveDate, incrementHistory, currentBasic]);

  const handleDateChange = (date: Date | null) => {
    setEffectiveDate(date);
    if (date) {
      const today = new Date();
      const isPast = date < today;
      setIsPastDate(isPast);
      
      if (isPast) {
        const prevSalary = calculatePreviousSalaryAtDate(date);
        setPreviousSalaryAtDate(prevSalary);
      } else {
        setPreviousSalaryAtDate(currentBasic);
      }
    }
  };

  const preview = useMemo(() => {
    const previousSalary = previousSalaryAtDate || currentBasic;
    const delta = Math.round((newBasic - previousSalary) * 100) / 100;
    const pct = previousSalary ? (delta / previousSalary) * 100 : 0;
    
    return {
      newBasic: Math.round(newBasic * 100) / 100,
      delta: Math.round(delta * 100) / 100,
      pct: Math.round(pct * 10) / 10,
      previousSalary: previousSalary
    };
  }, [newBasic, previousSalaryAtDate, currentBasic]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim() || !effectiveDate) {
      setError('Please provide a reason and select an effective date.');
      return;
    }
    
    // Check if date is before joined date
    if (joinedDate && isBeforeJoinedDate(effectiveDate.toISOString().slice(0, 10), joinedDate)) {
      setError(`Effective date cannot be before joined date: ${formatDate(joinedDate)}`);
      return;
    }
    
    // VALIDATION: New salary must be greater than previous salary AT THAT TIME
    const previousSalary = previousSalaryAtDate || currentBasic;
    if (!(newBasic > previousSalary)) {
      setError(`New salary must be greater than the salary at that time (${currency} ${previousSalary.toLocaleString()})`);
      return;
    }
    
    // Check for duplicate date in existing increments
    const dateStr = effectiveDate.toISOString().slice(0, 10);
    const hasDuplicate = incrementHistory.some(inc => inc.effectiveDate === dateStr);
    if (hasDuplicate) {
      setError(`An increment already exists for ${formatDate(dateStr)}. Please choose a different date.`);
      return;
    }

    onSubmit({
      newBasic: Math.round(newBasic * 100) / 100,
      reason: reason.trim(),
      effectiveDate: dateStr,
      isProrated,
    });
    
    // Reset form
    setNewBasic(currentBasic);
    setReason('');
    setEffectiveDate(new Date());
    setIsProrated(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl md:max-w-6xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add Salary Increment</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto pr-4 -mr-4 [scrollbar-gutter:stable] [scrollbar-width:thin]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Context Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Context Information</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-blue-600">Current Salary:</span>{' '}
                        <span className="font-medium">{currency} {currentBasic.toLocaleString()}</span>
                      </div>
                      {previousSalaryAtDate !== null && previousSalaryAtDate !== currentBasic && (
                        <div>
                          <span className="text-blue-600">Salary at selected date:</span>{' '}
                          <span className="font-medium">{currency} {previousSalaryAtDate.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning for past dates */}
              {isPastDate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Adding a backdated increment</p>
                      <p className="mt-1">
                        This increment will be inserted into the historical timeline. 
                        The validation compares against the salary at the selected date, not the current salary.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Salary ({currency}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={Number.isFinite(newBasic) ? newBasic : ''}
                    onChange={(e) => setNewBasic(Number(e.target.value))}
                    min={0.01}
                    step={0.01}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`${currency} ${(previousSalaryAtDate || currentBasic).toLocaleString()}`}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be greater than {currency} {(previousSalaryAtDate || currentBasic).toLocaleString()}
                    {previousSalaryAtDate !== currentBasic && (
                      <span className="text-blue-600 ml-1">(salary at selected date)</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={effectiveDate}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Select a date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    wrapperClassName="w-full"
                    required
                  />
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    {joinedDate && (
                      <p>Cannot be before joined date: {formatDate(joinedDate)}</p>
                    )}
                    {isPastDate && (
                      <p className="text-yellow-600">Backdated increment - will be inserted historically</p>
                    )}
                    {!isPastDate && (
                      <p className="text-green-600">Future-dated increment - will take effect later</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Prorated Checkbox */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="form-control">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all" 
                      checked={isProrated}
                      onChange={(e) => setIsProrated(e.target.checked)}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors">Prorated Increment</span>
                      <span className="text-sm text-gray-500 mt-1">
                        Calculate increment amount based on actual service duration for partial periods
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="e.g., Annual performance increment, Market adjustment"
                  required
                />
              </div>
            </div>

            {/* Preview */}
            <div className="md:col-span-1">
              <div className="md:sticky md:top-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Salary at date</p>
                      <p className="font-semibold">{currency} {preview.previousSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">New Salary</p>
                      <p className="font-semibold text-green-600">{currency} {preview.newBasic.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Increase</p>
                      <p className="font-semibold text-green-600">+{currency} {preview.delta.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">% Change</p>
                      <p className="font-semibold">
                        {preview.previousSalary ? preview.pct.toFixed(1) : '0.0'}%
                      </p>
                    </div>
                    {isProrated && (
                      <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                        <p className="text-gray-500">Prorated</p>
                        <p className="font-semibold text-blue-600 text-xs">Yes - Amount will be adjusted based on service duration</p>
                      </div>
                    )}
                    {isPastDate && (
                      <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                        <p className="text-gray-500">Effective Date</p>
                        <p className="font-semibold text-yellow-600 text-xs">Backdated - Historical insertion</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 text-sm font-medium text-white btn btn-primary rounded-lg"
              >
                Apply Increment
              </button>

              {error && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setError(null)} />
                  <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h4 className="text-sm font-semibold text-gray-900">Validation Required</h4>
                      <button
                        onClick={() => setError(null)}
                        aria-label="Close"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-700">{error}</p>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t">
                      <button
                        onClick={() => setError(null)}
                        className="px-4 py-2 text-sm font-medium text-white btn btn-primary rounded-lg"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */
export default function SingleIncrementTab({
  currentBasic,
  currentGrade,
  currency = 'MYR',
  employeeId,
  incrementHistory: historyProp = [],
  onApply,
  onLoadHistory,
  isEditing = false,
  joinedDate
}: SingleIncrementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [history, setHistory] = useState<IncrementHistory[]>(historyProp);
  const [loading, setLoading] = useState(false);
  const eid = Number(employeeId);

  const mapApiToHistory = (rows: any[]): IncrementHistory[] =>
    rows.map((r) => {
      const prev = Number(r.previous_salary ?? 0);
      const next = Number(r.new_salary ?? 0);
      const amt = +(next - prev).toFixed(2);
      const pct = r.type === 'PERCENT'
        ? Number(r.value)
        : prev > 0 ? +((amt / prev) * 100).toFixed(2) : 0;
      return {
        id: Number(r.id),
        effectiveDate: toDateOnly(String(r.effective_date)),
        type: r.type,
        previousSalary: prev,
        newSalary: next,
        amount: amt,
        percentage: pct,
        reason: r.reason,
        createdAt: String(r.created_at),
        createdBy: String(r.created_by),
        isLocked: r.is_locked || false
      };
    });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments`, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`Failed to load increments (${resp.status})`);
      const data = await resp.json();
      setHistory(mapApiToHistory(Array.isArray(data) ? data : []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (onLoadHistory) {
      onLoadHistory();
    }
  }, [eid, onLoadHistory]);

  const handleModalSubmit = async (payload: {
    newBasic: number;
    reason: string;
    effectiveDate: string;
    isProrated?: boolean;
  }) => {
    const { newBasic, reason, effectiveDate, isProrated } = payload;
    
    // Calculate delta based on historical context
    const dateObj = new Date(effectiveDate);
    const today = new Date();
    const isPast = dateObj < today;
    
    // Find the salary at the effective date
    let previousSalary = currentBasic;
    if (isPast) {
      const sortedHistory = [...history].sort(
        (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
      );
      
      for (const inc of sortedHistory.reverse()) {
        if (inc.effectiveDate <= effectiveDate) {
          if (inc.effectiveDate === effectiveDate) {
            previousSalary = inc.previousSalary;
          } else {
            previousSalary = inc.newSalary;
          }
          break;
        }
      }
    }
    
    const delta = +(newBasic - previousSalary).toFixed(2);
    const pct = previousSalary ? +((delta / previousSalary) * 100).toFixed(1) : 0;

    if (onApply) {
      onApply({
        newBasic,
        delta,
        pct,
        type: 'FIXED',
        reason,
        effectiveDate,
        isProrated
      });
    }

    try {
      const res = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effective_date: effectiveDate,
          type: 'FIXED',
          value: delta,
          reason,
          is_prorated: isProrated || false,
          created_by: 1
        })
      });

      if (!res.ok) {
        let msg = `Failed to create increment (${res.status})`;
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        alert(msg);
        return;
      }
      await fetchHistory();
    } catch (e) {
      console.error(e);
      alert('Network error while creating increment.');
    }
  };

  const requestDelete = (incId: number) => {
    setDeleteId(incId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      const res = await fetch(`${INCREMENTS_BASE}/employees/${eid}/increments/${deleteId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        let msg = `Failed to delete increment (${res.status})`;
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        alert(msg);
        return;
      }
      await fetchHistory();
    } catch (e) {
      console.error(e);
      alert('Network error while deleting increment.');
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const sortedHistory = [...history]
    .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime())
    .reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Increments</h2>
          {joinedDate && (
            <p className="text-sm text-gray-500 mt-1">
              Employee joined: {formatDate(joinedDate)}
            </p>
          )}
        </div>
        {isEditing && (
          <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" /> Add Increment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Salary</p>
              <p className="text-lg font-semibold text-gray-900">{currency} {currentBasic.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Increments</p>
              <p className="text-lg font-semibold text-gray-900">{history.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Increment</p>
              <p className="text-lg font-semibold text-gray-900">
                {sortedHistory.length > 0 ? formatDate(sortedHistory[0].effectiveDate) : 'No increments'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Increment History</h3>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading…</div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl bg-base-200 p-12 text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-base-100 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No salary increments recorded yet</p>
            <p className="text-gray-400 text-sm">
              {isEditing ? 'Click "Add Increment" to get started.' : 'Increments will appear here once recorded.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedHistory.map((inc) => (
              <div key={inc.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inc.type === 'PERCENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {inc.type === 'PERCENT' ? `${inc.percentage.toFixed(1)}%` : 'Fixed Amount'}
                      </span>
                      <span className="text-sm text-gray-600">Effective: {formatDate(inc.effectiveDate)}</span>
                      {inc.isLocked && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          <AlertTriangle size={10} />
                          Locked (Payroll Finalized)
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{inc.reason}</p>
                    <p className="text-xs text-gray-500">Added by {inc.createdBy} on {formatDate(toDateOnly(inc.createdAt))}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {currency} {inc.previousSalary.toLocaleString()} → {currency} {inc.newSalary.toLocaleString()}
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      +{currency} {inc.amount.toLocaleString()}
                    </div>

                    {isEditing && isFutureDated(inc.effectiveDate) && !inc.isLocked && (
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => requestDelete(inc.id)}
                          className="px-3 py-1 text-sm border border-rose-300 text-rose-700 rounded hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <IncrementModal
        isOpen={isEditing && isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentBasic={currentBasic}
        currency={currency}
        onSubmit={handleModalSubmit}
        joinedDate={joinedDate}
        incrementHistory={history}
      />

      <ConfirmDeleteModal
        open={confirmOpen}
        title="Delete Increment"
        message="Are you sure you want to delete this increment?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
