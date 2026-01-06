
// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { X, ArrowRightLeft, Loader2 } from 'lucide-react';
// import { API_BASE_URL } from '../config';
// import { toast } from 'react-hot-toast';

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onConfirm?: (p: { effectiveDate: string }) => void;
//   currentPosition?: string | null;
//   currentLevel?: string | null;
//   newPosition?: string | null;
//   newLevel?: string | null;
//   employeeId: number;
//   newPositionId: number;
//   apiBaseUrl?: string;
//   joinedDate?: string | null;
//   currentPositionStartDate?: string | null;
//   promotionDraft?: {
//     effectiveDate?: string;
//   };
//   fmt?: (dateString: string) => string;
// };

// export default function PositionChangeConfirmModal({
//   open,
//   onClose,
//   onConfirm,
//   currentPosition,
//   currentLevel,
//   newPosition,
//   newLevel,
//   employeeId,
//   newPositionId,
//   apiBaseUrl = 'http://localhost:5001',
//   joinedDate,
//   currentPositionStartDate,
//   promotionDraft,
//   fmt = (dateString) => new Date(dateString).toLocaleDateString('en-MY'),
// }: Props) {
//   const [pastPositions, setPastPositions] = React.useState<any[]>([]);
//   const [pastPositionsLoading, setPastPositionsLoading] = React.useState(false);
//   const [date, setDate] = React.useState<Date | null>(null);
//   const [dateInitialized, setDateInitialized] = React.useState(false);
//   const [submitting, setSubmitting] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   // Fetch past positions when modal opens
//   // React.useEffect(() => {
//   //   if (open) {
//   //     fetchPastPositions();
//   //   }
//   // }, [open, employeeId]);

//   const fetchPastPositions = useCallback(async () => {//async () => {
//     if (!employeeId) return;
    
//     try {
//       setPastPositionsLoading(true);
//       const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/past-positions`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch past positions: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       setPastPositions(data);
      
//       // Initialize date after fetching past positions
//       const defaultDate = getDefaultEffectiveDate();
//       setDate(defaultDate);
//       setDateInitialized(true);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching past positions:', error);
//       toast.error('Failed to load past positions. Please try again.');
//     } finally {
//       setPastPositionsLoading(false);
//     }
//    }, [employeeId]); //};

//    useEffect(() => {
//     if (open) {
//       fetchPastPositions();
//     }
//   }, [open, fetchPastPositions]);

//   // Calculate min date (today or joined date or current position start date)
// const getMinDate = React.useCallback(() => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const dates = [today]; // Can't select dates before today
  
//   if (joinedDate) {
//     const jd = new Date(joinedDate);
//     jd.setHours(0, 0, 0, 0);
//     if (jd > today) dates.push(jd);
//   }
  
//   if (currentPositionStartDate) {
//     const psd = new Date(currentPositionStartDate);
//     psd.setHours(0, 0, 0, 0);
//     if (psd > today) dates.push(psd);
//   }
  
//   return new Date(Math.max(...dates.map(d => d.getTime())));
// }, [joinedDate, currentPositionStartDate]);

// // Update the getDefaultEffectiveDate function to ensure it's always in the future
// const getDefaultEffectiveDate = React.useCallback(() => {
//   const minDate = getMinDate();
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   // If minDate is in the future, use it directly
//   if (minDate > today) return minDate;
  
//   // Otherwise default to 1st of next month
//   const nextMonth = new Date(today);
//   nextMonth.setMonth(today.getMonth() + 1, 1);
//   nextMonth.setHours(0, 0, 0, 0);
  
//   return nextMonth;
// }, [getMinDate]);

//   // Check if this is a duplicate position change
//   const isDuplicatePositionChange = React.useMemo(() => {
//     if (!newPositionId || !pastPositions.length) return false;
    
//     // Check if the new position is the same as any past position (excluding current)
//     return pastPositions.some(pos => 
//       pos.position_id === newPositionId && 
//       pos.status === 'active' &&
//       (!pos.end_date || new Date(pos.end_date) > new Date())
//     );
//   }, [newPositionId, pastPositions]);

//   const positionSelected = 
//     typeof newPositionId === 'number' &&
//     Number.isInteger(newPositionId) &&
//     newPositionId > 0;

//   const levelSelected = newLevel !== undefined && newLevel !== null && newLevel !== '';
//   const canConfirm = dateInitialized && !!date && positionSelected && levelSelected && !submitting && !isDuplicatePositionChange;

//   const handleConfirm = async () => {
//     if (!date) {
//       setError('Please select a valid effective date');
//       return;
//     }

//     if (!positionSelected || !levelSelected) {
//       setError('Please select both a position and job level');
//       return;
//     }

//     if (isDuplicatePositionChange) {
//       setError('This position change has already been applied');
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const payload = {
//         employee_id: employeeId,
//         position_id: newPositionId,
//         start_date: date.toISOString().split('T')[0], // YYYY-MM-DD
//       };

//       const resp = await fetch(`${API_BASE_URL}/api/admin/employees/past-positions`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!resp.ok) {
//         const data = await resp.json().catch(() => ({}));
//         throw new Error(data?.error || 'Failed to update position');
//       }

//       toast.success('Please click "Save Changes" button to complete this transaction.', {
//         duration: 5000,
//       });

//       onConfirm?.({ effectiveDate: payload.start_date });
//       onClose();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unexpected error');
//       toast.error(err instanceof Error ? err.message : 'Failed to update position');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-2xl ring-1 ring-black/5">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b bg-white/60 px-6 py-5">
//           <div className="flex items-center gap-2">
//             <ArrowRightLeft className="h-5 w-5 text-blue-600" />
//             <h3 className="text-lg font-semibold text-gray-900">Confirm Position Change</h3>
//           </div>
//           <button
//             onClick={onClose}
//             aria-label="Close"
//             className="text-gray-400 hover:text-gray-600"
//             disabled={submitting}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-6">
//           {/* Pending change notice */}
//           {promotionDraft?.effectiveDate && (
//             <div className="mb-4 rounded-lg bg-blue-50 p-3">
//               <div className="text-sm text-blue-900">
//                 <span className="font-medium">Pending position/level change.</span>{' '}
//                 Set an <span className="font-medium">Effective Date</span> before confirming.
//                 <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                   Effective: {fmt(promotionDraft.effectiveDate)}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Summary card */}
//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//               <div>
//                 <div className="text-xs uppercase tracking-wide text-gray-500">From</div>
//                 <div className="mt-1 text-sm text-gray-600">Position</div>
//                 <div className="font-medium text-gray-900">{currentPosition || '-'}</div>
//                 <div className="mt-2 text-sm text-gray-600">Job Level</div>
//                 <div className="font-medium text-gray-900">{currentLevel || '-'}</div>
//               </div>
//               <div>
//                 <div className="text-xs uppercase tracking-wide text-gray-500">To</div>
//                 <div className="mt-1 text-sm text-gray-600">Position</div>
//                 <div className="font-medium text-gray-900">{newPosition || '-'}</div>
//                 <div className="mt-2 text-sm text-gray-600">Job Level</div>
//                 <div className="font-medium text-gray-900">{newLevel || '-'}</div>
//               </div>
//             </div>
//           </div>

//           {/* Effective date */}
//           <div className="mt-6">
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Effective Date <span className="text-red-500">*</span>
//             </label>
//             {dateInitialized ? (
//               <DatePicker
//                 selected={date}
//                 onChange={(date) => setDate(date)}
//                 minDate={getMinDate()}
//                 dateFormat="yyyy/MM/dd"
//                 placeholderText="Select effective date"
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                 wrapperClassName="w-full"
//                 required
//                 disabled={submitting || pastPositionsLoading}
//                 startDate={date}
//                 endDate={date}
//                 selectsStart
//                 selectsEnd
//                 popperPlacement="bottom-start"
//               />
//             ) : (
//               <div className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 animate-pulse">
//                 Loading date picker...
//               </div>
//             )}
// {joinedDate && (
//   <p className="mt-1 text-xs text-gray-500">
//     Joined on {new Date(joinedDate).toLocaleDateString('en-MY')}. 
//     {currentPositionStartDate && (
//       <> Current position started on {new Date(currentPositionStartDate).toLocaleDateString('en-MY')}.</>
//     )}
//     Effective date will default to the 1st of next month and cannot be before these dates or today's date.
//   </p>
// )}
//           </div>

//           {/* Validation messages */}
//           {isDuplicatePositionChange && (
//             <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               This position has already been assigned to the employee. Please select a different position or level.
//             </div>
//           )}

//           {!positionSelected && (
//             <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
//               Please select a valid Position
//             </div>
//           )}

//           {!levelSelected && (
//             <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
//               Please select a valid Job Level
//             </div>
//           )}

//           {error && (
//             <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {error}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="mt-6 flex items-center justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
//               onClick={handleConfirm}
//               disabled={!canConfirm}
//             >
//               {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
//               Confirm
//             </button>
//           </div>

//           <p className="mt-3 text-[11px] text-gray-500">Back-end may block dates in finalized payroll months.</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import React, { useCallback, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { X, ArrowRightLeft, Loader2 } from 'lucide-react';
// import { API_BASE_URL } from '../config';
// import { toast } from 'react-hot-toast';

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onConfirm?: (p: { effectiveDate: string }) => void;
//   currentPosition?: string | null;
//   currentLevel?: string | null;
//   newPosition?: string | null;
//   newLevel?: string | null;
//   employeeId: number;
//   newPositionId: number;
//   apiBaseUrl?: string;
//   joinedDate?: string | null;
//   currentPositionStartDate?: string | null;
//   promotionDraft?: {
//     effectiveDate?: string;
//   };
//   fmt?: (dateString: string) => string;
// };

// export default function PositionChangeConfirmModal({
//   open,
//   onClose,
//   onConfirm,
//   currentPosition,
//   currentLevel,
//   newPosition,
//   newLevel,
//   employeeId,
//   newPositionId,
//   apiBaseUrl = 'http://localhost:5001',
//   joinedDate,
//   currentPositionStartDate,
//   promotionDraft,
//   fmt = (dateString) => new Date(dateString).toLocaleDateString('en-MY'),
// }: Props) {
//   const [pastPositions, setPastPositions] = React.useState<any[]>([]);
//   const [pastPositionsLoading, setPastPositionsLoading] = React.useState(false);
//   const [date, setDate] = React.useState<Date | null>(null);
//   const [dateInitialized, setDateInitialized] = React.useState(false);
//   const [submitting, setSubmitting] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   // Fetch past positions when modal opens
//   // React.useEffect(() => {
//   //   if (open) {
//   //     fetchPastPositions();
//   //   }
//   // }, [open, employeeId]);

//   const fetchPastPositions = useCallback(async () => {//async () => {
//     if (!employeeId) return;
    
//     try {
//       setPastPositionsLoading(true);
//       const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/past-positions`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch past positions: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       setPastPositions(data);
      
//       // Initialize date after fetching past positions
//       const defaultDate = getDefaultEffectiveDate();
//       setDate(defaultDate);
//       setDateInitialized(true);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching past positions:', error);
//       toast.error('Failed to load past positions. Please try again.');
//     } finally {
//       setPastPositionsLoading(false);
//     }
//    }, [employeeId]); //};

//    useEffect(() => {
//     if (open) {
//       fetchPastPositions();
//     }
//   }, [open, fetchPastPositions]);

//   // Calculate min date (today or joined date or current position start date)
// const getMinDate = React.useCallback(() => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const dates = [today]; // Can't select dates before today
  
//   if (joinedDate) {
//     const jd = new Date(joinedDate);
//     jd.setHours(0, 0, 0, 0);
//     if (jd > today) dates.push(jd);
//   }
  
//   if (currentPositionStartDate) {
//     const psd = new Date(currentPositionStartDate);
//     psd.setHours(0, 0, 0, 0);
//     if (psd > today) dates.push(psd);
//   }
  
//   return new Date(Math.max(...dates.map(d => d.getTime())));
// }, [joinedDate, currentPositionStartDate]);

// // Update the getDefaultEffectiveDate function to ensure it's always in the future
// const getDefaultEffectiveDate = React.useCallback(() => {
//   const minDate = getMinDate();
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   // If minDate is in the future, use it directly
//   if (minDate > today) return minDate;
  
//   // Otherwise default to 1st of next month
//   const nextMonth = new Date(today);
//   nextMonth.setMonth(today.getMonth() + 1, 1);
//   nextMonth.setHours(0, 0, 0, 0);
  
//   return nextMonth;
// }, [getMinDate]);

//   // Check if this is a duplicate position change
//   const isDuplicatePositionChange = React.useMemo(() => {
//     if (!newPositionId || !pastPositions.length) return false;
    
//     // Check if the new position is the same as any past position (excluding current)
//     return pastPositions.some(pos => 
//       pos.position_id === newPositionId && 
//       pos.status === 'active' &&
//       (!pos.end_date || new Date(pos.end_date) > new Date())
//     );
//   }, [newPositionId, pastPositions]);

//   const positionSelected = 
//     typeof newPositionId === 'number' &&
//     Number.isInteger(newPositionId) &&
//     newPositionId > 0;

//   const levelSelected = newLevel !== undefined && newLevel !== null && newLevel !== '';
//   const canConfirm = dateInitialized && !!date && positionSelected && levelSelected && !submitting && !isDuplicatePositionChange;

//   const handleConfirm = async () => {
//     if (!date) {
//       setError('Please select a valid effective date');
//       return;
//     }

//     if (!positionSelected || !levelSelected) {
//       setError('Please select both a position and job level');
//       return;
//     }

//     if (isDuplicatePositionChange) {
//       setError('This position change has already been applied');
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       const payload = {
//         employee_id: employeeId,
//         position_id: newPositionId,
//         start_date: date.toISOString().split('T')[0], // YYYY-MM-DD
//       };

//       const resp = await fetch(`${API_BASE_URL}/api/admin/employees/past-positions`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!resp.ok) {
//         const data = await resp.json().catch(() => ({}));
//         throw new Error(data?.error || 'Failed to update position');
//       }

//       toast.success('Please click "Save Changes" button to complete this transaction.', {
//         duration: 5000,
//       });

//       onConfirm?.({ effectiveDate: payload.start_date });
//       onClose();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unexpected error');
//       toast.error(err instanceof Error ? err.message : 'Failed to update position');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-2xl ring-1 ring-black/5">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b bg-white/60 px-6 py-5">
//           <div className="flex items-center gap-2">
//             <ArrowRightLeft className="h-5 w-5 text-blue-600" />
//             <h3 className="text-lg font-semibold text-gray-900">Confirm Position Change</h3>
//           </div>
//           <button
//             onClick={onClose}
//             aria-label="Close"
//             className="text-gray-400 hover:text-gray-600"
//             disabled={submitting}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-6">
//           {/* Pending change notice */}
//           {promotionDraft?.effectiveDate && (
//             <div className="mb-4 rounded-lg bg-blue-50 p-3">
//               <div className="text-sm text-blue-900">
//                 <span className="font-medium">Pending position/level change.</span>{' '}
//                 Set an <span className="font-medium">Effective Date</span> before confirming.
//                 <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                   Effective: {fmt(promotionDraft.effectiveDate)}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Summary card */}
//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//               <div>
//                 <div className="text-xs uppercase tracking-wide text-gray-500">From</div>
//                 <div className="mt-1 text-sm text-gray-600">Position</div>
//                 <div className="font-medium text-gray-900">{currentPosition || '-'}</div>
//                 <div className="mt-2 text-sm text-gray-600">Job Level</div>
//                 <div className="font-medium text-gray-900">{currentLevel || '-'}</div>
//               </div>
//               <div>
//                 <div className="text-xs uppercase tracking-wide text-gray-500">To</div>
//                 <div className="mt-1 text-sm text-gray-600">Position</div>
//                 <div className="font-medium text-gray-900">{newPosition || '-'}</div>
//                 <div className="mt-2 text-sm text-gray-600">Job Level</div>
//                 <div className="font-medium text-gray-900">{newLevel || '-'}</div>
//               </div>
//             </div>
//           </div>

//           {/* Effective date */}
//           <div className="mt-6">
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Effective Date <span className="text-red-500">*</span>
//             </label>
//             {dateInitialized ? (
//               <DatePicker
//                 selected={date}
//                 onChange={(date) => setDate(date)}
//                 minDate={getMinDate()}
//                 dateFormat="yyyy/MM/dd"
//                 placeholderText="Select effective date"
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                 wrapperClassName="w-full"
//                 required
//                 disabled={submitting || pastPositionsLoading}
//                 startDate={date}
//                 endDate={date}
//                 selectsStart
//                 selectsEnd
//                 popperPlacement="bottom-start"
//               />
//             ) : (
//               <div className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 animate-pulse">
//                 Loading date picker...
//               </div>
//             )}
// {joinedDate && (
//   <p className="mt-1 text-xs text-gray-500">
//     Joined on {new Date(joinedDate).toLocaleDateString('en-MY')}. 
//     {currentPositionStartDate && (
//       <> Current position started on {new Date(currentPositionStartDate).toLocaleDateString('en-MY')}.</>
//     )}
//     Effective date will default to the 1st of next month and cannot be before these dates or today's date.
//   </p>
// )}
//           </div>

//           {/* Validation messages */}
//           {isDuplicatePositionChange && (
//             <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               This position has already been assigned to the employee. Please select a different position or level.
//             </div>
//           )}

//           {!positionSelected && (
//             <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
//               Please select a valid Position
//             </div>
//           )}

//           {!levelSelected && (
//             <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
//               Please select a valid Job Level
//             </div>
//           )}

//           {error && (
//             <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {error}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="mt-6 flex items-center justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
//               onClick={handleConfirm}
//               disabled={!canConfirm}
//             >
//               {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
//               Confirm
//             </button>
//           </div>

//           <p className="mt-3 text-[11px] text-gray-500">Back-end may block dates in finalized payroll months.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useCallback, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, ArrowRightLeft, Loader2, AlertCircle, Calendar, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (p: { effectiveDate: string }) => void;
  currentPosition?: string | null;
  currentLevel?: string | null;
  newPosition?: string | null;
  newLevel?: string | null;
  employeeId: number;
  newPositionId: number;
  apiBaseUrl?: string;
  joinedDate?: string | null;
  currentPositionStartDate?: string | null;
  promotionDraft?: {
    effectiveDate?: string;
  };
  fmt?: (dateString: string) => string;
};

export default function PositionChangeConfirmModal({
  open,
  onClose,
  onConfirm,
  currentPosition,
  currentLevel,
  newPosition,
  newLevel,
  employeeId,
  newPositionId,
  apiBaseUrl = 'http://localhost:5001',
  joinedDate,
  currentPositionStartDate,
  promotionDraft,
  fmt = (dateString) => new Date(dateString).toLocaleDateString('en-MY'),
}: Props) {
  const [pastPositions, setPastPositions] = React.useState<any[]>([]);
  const [pastPositionsLoading, setPastPositionsLoading] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(null);
  const [dateInitialized, setDateInitialized] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dateWarnings, setDateWarnings] = React.useState<string[]>([]);
  const [dateErrors, setDateErrors] = React.useState<string[]>([]);
  const [isPastDateSelected, setIsPastDateSelected] = React.useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);

  const fetchPastPositions = useCallback(async () => {
    if (!employeeId) return;
    
    try {
      setPastPositionsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/past-positions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch past positions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPastPositions(data);
      
      // Initialize date after fetching past positions
      const defaultDate = getDefaultEffectiveDate();
      setDate(defaultDate);
      setIsPastDateSelected(defaultDate < new Date());
      setDateInitialized(true);
      setError(null);
    } catch (error) {
      console.error('Error fetching past positions:', error);
      toast.error('Failed to load past positions. Please try again.');
    } finally {
      setPastPositionsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (open) {
      fetchPastPositions();
    }
  }, [open, fetchPastPositions]);

  // Validate selected date against important dates
  const validateDate = useCallback((selectedDate: Date): { warnings: string[], errors: string[] } => {
    const warnings: string[] = [];
    const errors: string[] = [];
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if it's a future date (warning, not error)
    if (selected > today) {
      warnings.push(`Future date selected. This will create a pending position change effective from ${selected.toLocaleDateString('en-MY')}`);
    }
    
    // Check if it's a past date - we'll track this separately, no warning needed
    if (selected < today) {
      setIsPastDateSelected(true);
    } else {
      setIsPastDateSelected(false);
    }
    
    // Check against joined date (ERROR - cannot be before join date)
    if (joinedDate) {
      const joinDate = new Date(joinedDate);
      joinDate.setHours(0, 0, 0, 0);
      
      if (selected < joinDate) {
        errors.push(`Cannot be before employee's join date (${joinDate.toLocaleDateString('en-MY')})`);
      }
    }
    
    // Check against current position start date (WARNING if before, ERROR if overlaps)
    if (currentPositionStartDate) {
      const currentStartDate = new Date(currentPositionStartDate);
      currentStartDate.setHours(0, 0, 0, 0);
      
      if (selected < currentStartDate) {
        warnings.push(`Date is before current position start date (${currentStartDate.toLocaleDateString('en-MY')}). Ensure chronological order.`);
      }
      
      // If date equals current position start date, it's an error
      if (selected.getTime() === currentStartDate.getTime()) {
        errors.push(`Cannot be the same as current position start date`);
      }
    }
    
    // Check against existing past positions for overlaps (ERROR)
    if (pastPositions.length > 0) {
      const sortedPositions = [...pastPositions].sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
      
      // Find if selected date falls within any existing position period
      for (const position of sortedPositions) {
        const startDate = new Date(position.start_date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = position.end_date ? new Date(position.end_date) : new Date();
        endDate.setHours(0, 0, 0, 0);
        
        if (selected >= startDate && selected <= endDate) {
          errors.push(`Overlaps with position "${position.position_name}" (${startDate.toLocaleDateString('en-MY')} - ${endDate.toLocaleDateString('en-MY')})`);
          break;
        }
      }
      
      // Check if date is before earliest position (WARNING)
      const earliestPosition = sortedPositions[0];
      if (earliestPosition) {
        const earliestDate = new Date(earliestPosition.start_date);
        earliestDate.setHours(0, 0, 0, 0);
        
        if (selected < earliestDate) {
          warnings.push(`Date is before employee's first recorded position (${earliestDate.toLocaleDateString('en-MY')}). Verify historical accuracy.`);
        }
      }
    }
    
    return { warnings, errors };
  }, [joinedDate, currentPositionStartDate, pastPositions]);

  // Handle date change with validation
  const handleDateChange = useCallback((newDate: Date | null) => {
    setDate(newDate);
    
    if (newDate) {
      const { warnings, errors } = validateDate(newDate);
      setDateWarnings(warnings);
      setDateErrors(errors);
      
      // Clear any existing error if no blocking errors
      if (errors.length === 0) {
        setError(null);
      }
    } else {
      setDateWarnings([]);
      setDateErrors([]);
      setIsPastDateSelected(false);
    }
  }, [validateDate]);

  // Get minimum allowed date (cannot be before join date)
  const getMinDate = React.useCallback((): Date | undefined => {
    if (joinedDate) {
      const joinDate = new Date(joinedDate);
      joinDate.setHours(0, 0, 0, 0);
      return joinDate;
    }
    
    return undefined; // No restrictions
  }, [joinedDate]);

  // No maximum date restriction - allow future dates
  const getMaxDate = React.useCallback((): Date | undefined => {
    return undefined; // No restriction on future dates
  }, []);

  // Get default effective date
  const getDefaultEffectiveDate = React.useCallback((): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Default to 1st of next month for future changes
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1, 1);
    nextMonth.setHours(0, 0, 0, 0);
    
    return nextMonth;
  }, []);

  // Check if this is a duplicate position change
  const isDuplicatePositionChange = React.useMemo(() => {
    if (!newPositionId || !pastPositions.length) return false;
    
    // Check if the new position is the same as any past position
    return pastPositions.some(pos => 
      pos.position_id === newPositionId
    );
  }, [newPositionId, pastPositions]);

  const positionSelected = 
    typeof newPositionId === 'number' &&
    Number.isInteger(newPositionId) &&
    newPositionId > 0;

  const levelSelected = newLevel !== undefined && newLevel !== null && newLevel !== '';
  
  // Can confirm if date is selected and there are no blocking errors (warnings are OK)
  const canConfirm = dateInitialized && 
    !!date && 
    positionSelected && 
    levelSelected && 
    !submitting && 
    !isDuplicatePositionChange && 
    dateErrors.length === 0;

  const proceedWithConfirmation = async () => {
    setShowConfirmationModal(false);
    
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        employee_id: employeeId,
        position_id: newPositionId,
        start_date: date!.toISOString().split('T')[0], // YYYY-MM-DD
        is_backdated: true,
      };

      const resp = await fetch(`${API_BASE_URL}/api/admin/employees/past-positions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Backdated-Change-Acknowledged': 'true'
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to update position');
      }

      toast.success('Position change submitted successfully.', {
        duration: 5000,
      });

      onConfirm?.({ effectiveDate: payload.start_date });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      toast.error(err instanceof Error ? err.message : 'Failed to update position');
    } finally {
      setSubmitting(false);
    }
  };

  const proceedWithoutConfirmation = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date!);
      selectedDate.setHours(0, 0, 0, 0);
      
      const payload = {
        employee_id: employeeId,
        position_id: newPositionId,
        start_date: date!.toISOString().split('T')[0], // YYYY-MM-DD
        is_backdated: selectedDate < today,
      };

      const resp = await fetch(`${API_BASE_URL}/api/admin/employees/past-positions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to update position');
      }

      toast.success('Position change submitted successfully.', {
        duration: 5000,
      });

      onConfirm?.({ effectiveDate: payload.start_date });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      toast.error(err instanceof Error ? err.message : 'Failed to update position');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!date) {
      setError('Please select a valid effective date');
      return;
    }

    if (!positionSelected || !levelSelected) {
      setError('Please select both a position and job level');
      return;
    }

    if (isDuplicatePositionChange) {
      setError('This position has already been assigned to the employee. Please select a different position.');
      return;
    }

    if (dateErrors.length > 0) {
      setError('Please resolve date conflicts before confirming');
      return;
    }

    // Check if it's a past date and show confirmation modal
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setShowConfirmationModal(true);
    } else {
      await proceedWithoutConfirmation();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-2xl ring-1 ring-black/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-white/60 px-6 py-5">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Position Change</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-gray-600"
              disabled={submitting}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {/* Pending change notice */}
            {promotionDraft?.effectiveDate && (
              <div className="mb-4 rounded-lg bg-blue-50 p-3">
                <div className="text-sm text-blue-900">
                  <span className="font-medium">Pending position/level change.</span>{' '}
                  Set an <span className="font-medium">Effective Date</span> before confirming.
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Effective: {fmt(promotionDraft.effectiveDate)}
                  </span>
                </div>
              </div>
            )}

            {/* Summary card */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">From</div>
                  <div className="mt-1 text-sm text-gray-600">Position</div>
                  <div className="font-medium text-gray-900">{currentPosition || '-'}</div>
                  <div className="mt-2 text-sm text-gray-600">Job Level</div>
                  <div className="font-medium text-gray-900">{currentLevel || '-'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">To</div>
                  <div className="mt-1 text-sm text-gray-600">Position</div>
                  <div className="font-medium text-gray-900">{newPosition || '-'}</div>
                  <div className="mt-2 text-sm text-gray-600">Job Level</div>
                  <div className="font-medium text-gray-900">{newLevel || '-'}</div>
                </div>
              </div>
            </div>

            {/* Effective date */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Effective Date <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (Past & future dates allowed with validation)
                  </span>
                </label>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Today: {new Date().toLocaleDateString('en-MY')}</span>
                </div>
              </div>
              
              {dateInitialized ? (
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  minDate={getMinDate()}
                  maxDate={getMaxDate()}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="Select effective date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  wrapperClassName="w-full"
                  required
                  disabled={submitting || pastPositionsLoading}
                  popperPlacement="bottom-start"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  adjustDateOnChange
                  todayButton="Today"
                />
              ) : (
                <div className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 animate-pulse">
                  Loading date picker...
                </div>
              )}
              
              {/* Date constraints info */}
              <div className="mt-2 space-y-1">
                {joinedDate && (
                  <p className="text-xs text-gray-500">
                    • Earliest allowed: {new Date(joinedDate).toLocaleDateString('en-MY')} (join date)
                  </p>
                )}
                {currentPositionStartDate && (
                  <p className="text-xs text-gray-500">
                    • Current position started: {new Date(currentPositionStartDate).toLocaleDateString('en-MY')}
                  </p>
                )}
              </div>

              {/* Date errors (blocking) */}
              {dateErrors.length > 0 && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                    <div className="text-xs text-red-800">
                      <p className="font-medium mb-1">Date Conflicts (Must Resolve):</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {dateErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Date warnings (non-blocking) */}
              {dateWarnings.length > 0 && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                    <div className="text-xs text-amber-800">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {dateWarnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Important notice - HIGHLIGHTED (only for past dates) */}
            {isPastDateSelected && (
              <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50/80 px-4 py-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-sm mb-1">Important Notice for Back-Dated Changes</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <span className="font-medium">I understand that finalized payroll periods cannot be changed by the system.</span>{' '}
                      Any back-dated changes may affect payroll results, and I accept responsibility for reviewing and applying any required manual adjustments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General important notice (shown always) */}
            {!isPastDateSelected && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 text-sm mb-1">Important Information</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Future date changes will create pending position changes effective from the selected date.
                      All changes are subject to system validation and approval workflows.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation messages */}
            {isDuplicatePositionChange && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                This position has already been assigned to the employee. Please select a different position.
              </div>
            )}

            {!positionSelected && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Please select a valid Position
              </div>
            )}

            {!levelSelected && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Please select a valid Job Level
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleConfirm}
                disabled={!canConfirm}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Back-Dated Changes */}
      {showConfirmationModal && date && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConfirmationModal(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-white to-slate-50 shadow-2xl ring-1 ring-black/10">
            {/* Header */}
            <div className="border-b bg-gradient-to-r from-amber-50 to-orange-50/50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Back-Dated Change</h3>
                  <p className="text-sm text-amber-700 mt-0.5">
                    Effective: {date.toLocaleDateString('en-MY')}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {/* Warning icon and message */}
              <div className="mb-5 rounded-lg bg-amber-50 p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-sm mb-2">Payroll Impact Warning</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      You are making a change that is back-dated to {date.toLocaleDateString('en-MY')}. 
                      This may affect finalized payroll periods.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acknowledgment checklist */}
              <div className="mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 mt-0.5 flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">I understand</span> that finalized payroll periods cannot be changed by the system.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 mt-0.5 flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">I accept responsibility</span> for reviewing and applying any required manual adjustments.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 mt-0.5 flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">I confirm</span> this back-dated change is accurate and necessary.
                  </p>
                </div>
              </div>

              {/* Change summary */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Change Summary:</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">From: {currentPosition} ({currentLevel})</span>
                  <ArrowRightLeft className="h-4 w-4 text-gray-400 mx-2" />
                  <span className="text-gray-800 font-medium">To: {newPosition} ({newLevel})</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Effective: <span className="font-medium">{date.toLocaleDateString('en-MY')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmationModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-2.5 font-medium text-white hover:from-amber-700 hover:to-orange-700 transition-all shadow-md disabled:opacity-50"
                  onClick={proceedWithConfirmation}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Proceed with Back-Dated Change
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
