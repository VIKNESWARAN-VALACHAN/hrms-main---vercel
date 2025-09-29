
// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { API_BASE_URL } from '../../config';

// interface Deduction {
//   id: number;
//   name: string;
//   is_recurring: number;
//   max_limit: string;
//   is_epf: number;
//   is_socso: number;
//   is_eis: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface PayrollConfigDeductionRow {
//   id?: number;
//   payroll_config_id?: number;
//   deduction_id?: number;
//   is_default?: number;
//   amount?: number;
//   company_id?: number;
//   department_id?: number;
//   branch_id?: number;
//   remark: string | null | undefined; 
//   //remark?: string;
//   deduction_name?: string;
//   payroll_config_name?: string;
//   company_name?: string;
//   department_name?: string;
//   cycle_start_month?: string | null;
//   cycle_end_month?: string | null;
// }

// interface Props {
//   initialData?: Partial<PayrollConfigDeductionRow>;
//   mode: 'edit' | 'add';
//   onSave: (data: Partial<PayrollConfigDeductionRow>) => Promise<void> | void;
//   onCancel: () => void;
//   configs: any[];
//   companies: any[];
//   departments: any[];
// }

// const defaultData: Partial<PayrollConfigDeductionRow> = {
//   payroll_config_id: undefined,
//   deduction_id: undefined,
//   is_default: 1,
//   amount: undefined,
//   company_id: undefined,
//   department_id: undefined,
//   cycle_start_month: undefined,
//   cycle_end_month: undefined,
//   remark: '',
// };

// export default function PayrollConfigDeductionForm({
//   initialData = {},
//   mode,
//   onSave,
//   onCancel,
//   configs,
//   companies,
//   departments,
// }: Props) {
//   const cleanedInitialData = {
//     ...initialData,
//     amount: typeof initialData?.amount === 'string' ? parseFloat(initialData.amount) : initialData?.amount,
//   };

//   const [startDate, setStartDate] = useState<Date | null>(() => {
//     const d = initialData?.cycle_start_month ? new Date(initialData.cycle_start_month) : null;
//     return d && !isNaN(d.getTime()) ? d : null;
//   });

//   const [endDate, setEndDate] = useState<Date | null>(() => {
//     const d = initialData?.cycle_end_month ? new Date(initialData.cycle_end_month) : null;
//     return d && !isNaN(d.getTime()) ? d : null;
//   });

//   const [form, setForm] = useState<Partial<PayrollConfigDeductionRow>>({
//     ...defaultData,
//     ...cleanedInitialData,
//     cycle_start_month: cleanedInitialData?.cycle_start_month || null,
//     cycle_end_month: cleanedInitialData?.cycle_end_month || null,
//   });

//   const [deductions, setDeductions] = useState<Deduction[]>([]);
//   const [selectedDeduction, setSelectedDeduction] = useState<Deduction | null>(null);
//   const [amountError, setAmountError] = useState<string>('');

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/api/master-data/deductions`)
//       .then(r => r.json())
//       .then((data: Deduction[]) => {
//         setDeductions(data);
//         // Set selected deduction if editing
//         if (form.deduction_id) {
//           const selected = data.find(d => d.id === form.deduction_id);
//           setSelectedDeduction(selected || null);
//         }
//       })
//       .catch(error => console.error("Failed to fetch deductions:", error));
//   }, [form.deduction_id]);

//   const handleDateChange = (date: Date | null) => {
//     setStartDate(date);
//     setForm(prev => ({
//       ...prev,
//       cycle_start_month: date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01` : null,
//     }));
//   };

//   const handleEndDateChange = (date: Date | null) => {
//     setEndDate(date);
//     setForm(prev => ({
//       ...prev,
//       cycle_end_month: date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01` : null,
//     }));
//   };

//   const validateAmount = (amount: number, maxLimit: number): string => {
//     if (amount <= 0) {
//       return 'Amount must be greater than 0';
//     }
//     if (amount > maxLimit) {
//       return `Amount cannot exceed the maximum limit of RM ${maxLimit.toFixed(2)}`;
//     }
//     return '';
//   };

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
//     const { name, value } = e.target;
//     let parsedValue: any = value === '' ? undefined : value;

//     if (name === 'amount') {
//       parsedValue = parseFloat(value);
//       if (isNaN(parsedValue)) {
//         parsedValue = undefined;
//         setAmountError('Please enter a valid number');
//       } else if (selectedDeduction) {
//         const maxLimit = parseFloat(selectedDeduction.max_limit);
//         const error = validateAmount(parsedValue, maxLimit);
//         setAmountError(error);
//       }
//     } else if (name.endsWith('_id') || name === 'is_default') {
//       parsedValue = parseInt(value, 10);
//       if (isNaN(parsedValue)) parsedValue = undefined;
//     }

//     const newForm = { ...form, [name]: parsedValue };

//     if (name === 'deduction_id' && parsedValue) {
//       const selected = deductions.find(d => d.id === parsedValue);
//       setSelectedDeduction(selected || null);
//       if (selected && !isNaN(parseFloat(selected.max_limit))) {
//         // Reset amount when changing deduction
//         newForm.amount = undefined;
//         setAmountError('');
//       }
//     }

//     setForm(newForm);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!form.payroll_config_id || !form.deduction_id || form.amount === undefined || isNaN(form.amount)) {
//       toast.error('Please fill all required fields.');
//       return;
//     }

//     // Validate amount against max limit
//     if (selectedDeduction) {
//       const maxLimit = parseFloat(selectedDeduction.max_limit);
//       const error = validateAmount(form.amount, maxLimit);
//       if (error) {
//         toast.error(error);
//         return;
//       }
//     }

//     const dataToSend = {
//       ...form,
//       ...(mode === 'edit' && initialData?.id && { id: initialData.id })
//     };

//     await onSave(dataToSend);
//   }

//   const getRecurringText = (isRecurring: number) => {
//     return isRecurring === 1 ? 'Yes' : 'No';
//   };

//   const getStatusBadge = (value: number, label: string) => {
//     return (
//       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//         value === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//       }`}>
//         {label}: {value === 1 ? 'Yes' : 'No'}
//       </span>
//     );
//   };


//     // Add state for filtered departments
//   const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);

//   // Update filtered departments when company selection changes
//   useEffect(() => {
//     if (form.company_id) {
//       const filtered = departments.filter(dept => dept.company_id === form.company_id);
//       setFilteredDepartments(filtered);
      
//       // If the current department doesn't belong to the selected company, clear it
//       if (form.department_id && !filtered.some(dept => dept.id === form.department_id)) {
//         setForm(prev => ({ ...prev, department_id: undefined }));
//       }
//     } else {
//       setFilteredDepartments([]);
//       setForm(prev => ({ ...prev, department_id: undefined }));
//     }
//   }, [form.company_id, departments]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">{mode === 'edit' ? 'Edit' : 'Add'} Deduction Mapping</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">Payroll Config *</label>
//             <select 
//               name="payroll_config_id" 
//               className="input input-bordered w-full" 
//               value={form.payroll_config_id ?? ''} 
//               onChange={handleChange} 
//               required
//             >
//               <option value="">-- Select --</option>
//               {configs.map(cfg => <option key={cfg.id} value={cfg.id}>{cfg.pay_interval} (ID {cfg.id})</option>)}
//             </select>
//           </div>

//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">Deduction *</label>
//             <select 
//               name="deduction_id" 
//               className="input input-bordered w-full" 
//               value={form.deduction_id ?? ''} 
//               onChange={handleChange} 
//               required
//             >
//               <option value="">-- Select --</option>
//               {deductions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* Deduction Information Card */}
//         {selectedDeduction && (
//           <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
//             <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Deduction Information
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div className="bg-white p-4 rounded-lg border border-gray-200">
//                 <div className="text-sm text-gray-600 mb-1">Deduction Name</div>
//                 <div className="font-semibold text-gray-900">{selectedDeduction.name}</div>
//               </div>
              
//               <div className="bg-white p-4 rounded-lg border border-gray-200">
//                 <div className="text-sm text-gray-600 mb-1">Maximum Limit</div>
//                 <div className="font-semibold text-green-600 text-lg">RM {parseFloat(selectedDeduction.max_limit).toFixed(2)}</div>
//               </div>
              
//               <div className="bg-white p-4 rounded-lg border border-gray-200">
//                 <div className="text-sm text-gray-600 mb-1">Recurring</div>
//                 <div className="font-semibold text-gray-900">{getRecurringText(selectedDeduction.is_recurring)}</div>
//               </div>
//             </div>

//             <div className="mt-4 flex flex-wrap gap-2">
//               {getStatusBadge(selectedDeduction.is_epf, 'EPF')}
//               {getStatusBadge(selectedDeduction.is_socso, 'SOCSO')}
//               {getStatusBadge(selectedDeduction.is_eis, 'EIS')}
//             </div>

//             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <div className="text-sm text-gray-600">Created</div>
//                 <div className="text-sm font-medium">{new Date(selectedDeduction.created_at).toLocaleDateString()}</div>
//               </div>
//               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                 <div className="text-sm text-gray-600">Last Updated</div>
//                 <div className="text-sm font-medium">{new Date(selectedDeduction.updated_at).toLocaleDateString()}</div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">Default?</label>
//             <select 
//               name="is_default" 
//               className="input input-bordered w-full" 
//               value={form.is_default ?? 1} 
//               onChange={handleChange}
//             >
//               <option value={1}>Yes</option>
//               <option value={0}>No</option>
//             </select>
//           </div>

//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">
//               Amount (RM) *
//               {selectedDeduction && (
//                 <span className="text-xs text-gray-500 ml-2">
//                   (Max: RM {parseFloat(selectedDeduction.max_limit).toFixed(2)})
//                 </span>
//               )}
//             </label>
//             <input
//               type="number"
//               name="amount"
//               step="0.01"
//               min="0"
//               max={selectedDeduction ? parseFloat(selectedDeduction.max_limit) : undefined}
//               className={`input input-bordered w-full ${amountError ? 'border-red-500' : ''}`}
//               value={form.amount ?? ''}
//               onChange={handleChange}
//               placeholder={selectedDeduction ? `Enter amount (Max: RM ${parseFloat(selectedDeduction.max_limit).toFixed(2)})` : 'Select a deduction first'}
//               disabled={!selectedDeduction}
//               required
//             />
//             {amountError && (
//               <p className="text-red-500 text-xs mt-1">{amountError}</p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">Company</label>
//             <select 
//               name="company_id" 
//               className="input input-bordered w-full" 
//               value={form.company_id ?? ''} 
//               onChange={handleChange}
//             >
//               <option value="">-- None --</option>
//               {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//           </div>

//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">Department</label>
//             <select 
//               name="department_id" 
//               className="input input-bordered w-full" 
//               value={form.department_id ?? ''} 
//               onChange={handleChange}
//               disabled={!form.company_id}
//             >
//               <option value="">-- None --</option>
//               {filteredDepartments.map(d => (
//                 <option key={d.id} value={d.id}>{d.department_name}</option>
//               ))}
//             </select>
//             {!form.company_id && (
//               <p className="text-xs text-gray-500 mt-1">Please select a company first</p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">Start Month</label>
//             <DatePicker
//               selected={startDate}
//               onChange={handleDateChange}
//               dateFormat="MMMM yyyy"
//               showMonthYearPicker
//               className="input input-bordered w-full"
//               placeholderText="Select start month"
//               isClearable
//             />
//           </div>

//           <div className="mb-3">
//             <label className="block text-sm font-medium mb-1">End Month</label>
//             <DatePicker
//               selected={endDate}
//               onChange={handleEndDateChange}
//               dateFormat="MMMM yyyy"
//               showMonthYearPicker
//               className="input input-bordered w-full"
//               placeholderText="Select end month"
//               isClearable
//             />
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Remark</label>
//           <textarea
//             name="remark"
//             className="textarea textarea-bordered w-full"
//             placeholder="Optional remark for this mapping"
//             value={form.remark ?? ''}
//             onChange={handleChange}
//             rows={3}
//           />
//         </div>

//         <div className="flex justify-end gap-2">
//           <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
//           <button 
//             type="submit" 
//             className="btn btn-primary"
//             disabled={!!amountError || !selectedDeduction || form.amount === undefined}
//           >
//             {mode === 'edit' ? 'Update' : 'Add'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

'use client';

import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

/* ================== Types ================== */
interface Deduction {
  id: number;
  name: string;
  max_limit: string;
  prorate_by_percentage: number; // 1 = true, 0 = false
  // other fields exist but we won't show them in the info card per request
  description?: string;
}

export interface PayrollConfigDeductionRow {
  id?: number;
  payroll_config_id?: number;
  deduction_id?: number;
  is_default?: number; // 0/1
  amount?: number;
  percentage?: number;
  company_id?: number;
  department_id?: number;
  branch_id?: number;
  remark?: string | null;
  deduction_name?: string;
  payroll_config_name?: string;
  company_name?: string;
  department_name?: string;
  cycle_start_month?: string | null;
  cycle_end_month?: string | null;
}

type Company = { id: number; name: string };
type Department = {
  id: number;
  department_name: string;
  company_id: number;
  company_name?: string;
};

interface Props {
  initialData?: Partial<PayrollConfigDeductionRow>;
  mode: 'edit' | 'add';
  onSave: (data: Partial<PayrollConfigDeductionRow>) => Promise<void> | void;
  onCancel: () => void;
  configs: any[];
  companies: Company[];
  departments: Department[];
}

/* ================== Helpers ================== */
const toNum = (v: any, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};
const fmtRM = (v: any) => `RM ${toNum(v).toFixed(2)}`;
const monthISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;

/* Default form baseline */
const defaultData: Partial<PayrollConfigDeductionRow> = {
  payroll_config_id: undefined,
  deduction_id: undefined,
  is_default: 1,
  amount: undefined,
  percentage: undefined,
  company_id: undefined,
  department_id: undefined,
  cycle_start_month: null,
  cycle_end_month: null,
  remark: '',
};

export default function PayrollConfigDeductionForm({
  initialData = {},
  mode,
  onSave,
  onCancel,
  configs,
  companies,
  departments,
}: Props) {
  // sanitize incoming amount/percentage (strings -> numbers)
  const cleanedInitial = useMemo(
    () => ({
      ...initialData,
      amount:
        typeof initialData?.amount === 'string'
          ? parseFloat(initialData.amount as any)
          : initialData?.amount,
      percentage:
        typeof initialData?.percentage === 'string'
          ? parseFloat(initialData.percentage as any)
          : initialData?.percentage,
    }),
    [initialData]
  );

  /* Dates (month pickers) */
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const d = cleanedInitial?.cycle_start_month ? new Date(cleanedInitial.cycle_start_month) : null;
    return d && !isNaN(d.getTime()) ? d : null;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const d = cleanedInitial?.cycle_end_month ? new Date(cleanedInitial.cycle_end_month) : null;
    return d && !isNaN(d.getTime()) ? d : null;
  });

  /* Form state */
  const [form, setForm] = useState<Partial<PayrollConfigDeductionRow>>({
    ...defaultData,
    ...cleanedInitial,
  });

  /* Deductions + selected */
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [selectedDeduction, setSelectedDeduction] = useState<Deduction | null>(null);

  /* UI state */
  const [fieldError, setFieldError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  /* Fetch deductions */
  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE_URL}/api/master-data/deductions`)
      .then((r) => r.json())
      .then((data: Deduction[]) => {
        if (!alive) return;
        setDeductions(data || []);
      })
      .catch(() => {
        toast.error('Failed to load deductions');
      });
    return () => {
      alive = false;
    };
  }, []);

  /* Keep selectedDeduction in sync */
  useEffect(() => {
    if (!deductions?.length) return;
    if (form.deduction_id) {
      const sel = deductions.find((d) => d.id === form.deduction_id) || null;
      setSelectedDeduction(sel);
    } else {
      setSelectedDeduction(null);
    }
  }, [deductions, form.deduction_id]);

  /* EDIT mode: if department_id exists but company_id is missing, derive company_id from department */
  useEffect(() => {
    if (mode !== 'edit') return;
    if (form.department_id && !form.company_id) {
      const d = departments.find((x) => Number(x.id) === Number(form.department_id));
      if (d?.company_id) {
        setForm((p) => ({ ...p, company_id: Number(d.company_id) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, form.department_id, departments]);

  /* Company options (already unique) */
  const companyOptions = useMemo(
    () =>
      (companies || [])
        .map((c) => ({ id: Number(c.id), label: c.name ?? `Company #${c.id}` }))
        .filter((x) => Number.isFinite(x.id)),
    [companies]
  );

  /* All departments (carry company_id for filtering) */
  const departmentOptionsAll = useMemo(
    () =>
      (departments || [])
        .map((d) => ({
          id: Number(d.id),
          label: d.department_name ?? `Department #${d.id}`,
          company_id: Number(d.company_id),
        }))
        .filter((x) => Number.isFinite(x.id)),
    [departments]
  );

  /* Filtered departments by selected company */
  const filteredDeptOptions = useMemo(() => {
    if (!form.company_id) return [];
    return departmentOptionsAll
      .filter((d) => d.company_id === Number(form.company_id))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [departmentOptionsAll, form.company_id]);

  /* Date handlers (keep range sane) */
  const handleStartDate = (d: Date | null) => {
    setStartDate(d);
    setForm((p) => ({ ...p, cycle_start_month: d ? monthISO(d) : null }));

    if (endDate && d && endDate < d) {
      setEndDate(d);
      setForm((p) => ({ ...p, cycle_end_month: monthISO(d) }));
    }
  };
  const handleEndDate = (d: Date | null) => {
    setEndDate(d);
    setForm((p) => ({ ...p, cycle_end_month: d ? monthISO(d) : null }));
  };

  /* Validation helpers */
  const validateFixedAmount = (amt: number, maxLimit: number) => {
    if (!(amt > 0)) return 'Amount must be greater than 0';
    if (maxLimit > 0 && amt > maxLimit) return `Amount cannot exceed ${fmtRM(maxLimit)}`;
    return '';
  };
  const validatePercentage = (pct: number) => {
    if (!Number.isFinite(pct)) return 'Please enter a valid percentage';
    if (pct < 0 || pct > 100) return 'Percentage must be between 0 and 100';
    return '';
  };

  /* Field change */
  const onField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsed: any = value === '' ? undefined : value;
    let next = { ...form };

    if (name === 'is_default') {
      parsed = parseInt(value, 10);
      if (!Number.isFinite(parsed)) parsed = 0;
      next.is_default = parsed;
    } else if (name.endsWith('_id')) {
      parsed = parseInt(value, 10);
      if (!Number.isFinite(parsed)) parsed = undefined;
      (next as any)[name] = parsed;

      // If company changes, clear department selection (cascading)
      if (name === 'company_id') {
        next.department_id = undefined;
      }
    } else if (name === 'amount') {
      parsed = parseFloat(value);
      (next as any)[name] = Number.isFinite(parsed) ? parsed : undefined;

      if (selectedDeduction && selectedDeduction.prorate_by_percentage !== 1) {
        const err = validateFixedAmount(
          toNum(parsed),
          toNum(selectedDeduction.max_limit)
        );
        setFieldError(err);
      } else {
        setFieldError('');
      }
    } else if (name === 'percentage') {
      parsed = parseFloat(value);
      (next as any)[name] = Number.isFinite(parsed) ? parsed : undefined;

      const err = validatePercentage(toNum(parsed, NaN));
      setFieldError(err || '');
    } else {
      (next as any)[name] = parsed;
    }

    // When deduction changes → preset fields
    if (name === 'deduction_id') {
      const oldId = form.deduction_id;
      const sel = deductions.find((d) => d.id === parsed);
      setSelectedDeduction(sel || null);

      if (sel && (mode === 'add' || parsed !== oldId)) {
        if (sel.prorate_by_percentage === 1) {
          next.amount = undefined;
          next.percentage = undefined;
          setFieldError('');
        } else {
          next.amount = toNum(sel.max_limit);
          next.percentage = undefined;
          setFieldError('');
        }
      }
    }

    // If prorated and we have percentage → compute amount
    if (
      (selectedDeduction?.prorate_by_percentage === 1 ||
        (name === 'deduction_id' &&
          deductions.find((d) => d.id === parsed)?.prorate_by_percentage === 1)) &&
      typeof next.percentage === 'number'
    ) {
      const base =
        name === 'deduction_id'
          ? toNum(deductions.find((d) => d.id === parsed)?.max_limit)
          : toNum(selectedDeduction?.max_limit);
      next.amount = Number(((next.percentage / 100) * base).toFixed(2));
    }

    setForm(next);
  };

  // Pick the active deduction
  const activeDeduction = useMemo(() => {
    if (selectedDeduction) return selectedDeduction;
    if (form.deduction_id && deductions.length) {
      return deductions.find((d) => d.id === form.deduction_id) || null;
    }
    return null;
  }, [selectedDeduction, deductions, form.deduction_id]);

  // Use this flag everywhere you decide between % vs Amount
  const isProrated = !!activeDeduction && activeDeduction.prorate_by_percentage === 1;

  // When editing a prorated deduction and we already have an amount, derive the percentage.
  useEffect(() => {
    if (mode !== 'edit') return;
    if (!isProrated) return;

    const base = Number(activeDeduction?.max_limit);
    const amt = Number(form.amount);

    if (Number.isFinite(base) && base > 0 && Number.isFinite(amt)) {
      const pct = (amt / base) * 100;
      if (!Number.isFinite(Number(form.percentage)) || Math.abs((form.percentage ?? 0) - pct) > 0.01) {
        setForm((prev) => ({ ...prev, percentage: Number(pct.toFixed(2)) }));
      }
    }
  }, [mode, isProrated, activeDeduction?.max_limit, form.amount]); 

  /* Submit */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.payroll_config_id || !form.deduction_id) {
      toast.error('Please select Payroll Config and Deduction.');
      return;
    }
    // Enforce company -> department flow
    if (form.department_id && !form.company_id) {
      toast.error('Please select Company first.');
      return;
    }

    if (isProrated) {
      const err = validatePercentage(toNum(form.percentage, NaN));
      if (err) {
        toast.error(err);
        return;
      }
      if (!Number.isFinite(form.amount as number)) {
        toast.error('Calculated amount is invalid.');
        return;
      }
    } else {
      const amt = toNum(form.amount, NaN);
      if (!Number.isFinite(amt)) {
        toast.error('Please enter a valid amount.');
        return;
      }
      const err = validateFixedAmount(amt, toNum(activeDeduction?.max_limit));
      if (err) {
        toast.error(err);
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload: Partial<PayrollConfigDeductionRow> = {
        ...form,
        // Only send percentage if the deduction is prorated
        percentage: isProrated ? form.percentage : undefined,
        ...(mode === 'edit' && initialData?.id ? { id: initialData.id } : {}),
      };
      await onSave(payload);
    } finally {
      setSubmitting(false);
    }
  };

  /* Missing-value guards (for edit mode when options change) */
  const companyValueMissing =
    !!form.company_id && !companyOptions.some((o) => o.id === form.company_id);
  const currentDept = form.department_id
    ? departments.find((d) => Number(d.id) === Number(form.department_id))
    : undefined;
  const deptInFiltered = form.department_id
    ? filteredDeptOptions.some((d) => d.id === form.department_id)
    : true;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Mapping details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <span className="label-text text-black font-medium">Payroll Config *</span>
          </label>
          <select
            name="payroll_config_id"
            className="select select-bordered w-full text-black"
            value={form.payroll_config_id ?? ''}
            onChange={onField}
            required
          >
            <option value="">-- Select --</option>
            {configs.map((cfg: any) => (
              <option key={cfg.id} value={cfg.id}>
                {(cfg.pay_interval ?? cfg.name ?? `Config #${cfg.id}`)} (ID {cfg.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text text-black font-medium">Deduction *</span>
          </label>
          <select
            name="deduction_id"
            className="select select-bordered w-full text-black"
            value={form.deduction_id ?? ''}
            onChange={onField}
            required
          >
            <option value="">-- Select --</option>
            {deductions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Deduction Information (limited fields as requested) */}
      {activeDeduction && (
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Deduction Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-medium">{activeDeduction.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Maximum Limit</div>
              <div className="font-medium text-green-700">
                {fmtRM(activeDeduction.max_limit)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Prorated by %</div>
              <div className="font-medium">
                {activeDeduction.prorate_by_percentage === 1 ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amount / Percentage + Calculated preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: percentage or amount */}
        <div className={isProrated ? '' : 'lg:col-span-2'}>
          {isProrated ? (
            <>
              <label className="label">
                <span className="label-text text-black font-medium">
                  Percentage (%) *
                  {activeDeduction && (
                    <span className="text-xs text-gray-500 ml-2">
                      Base: {fmtRM(activeDeduction.max_limit)}
                    </span>
                  )}
                </span>
              </label>
              <input
                type="number"
                name="percentage"
                step="0.01"
                min={0}
                max={100}
                className={`input input-bordered w-full text-black ${fieldError ? 'border-red-500' : ''}`}
                value={form.percentage ?? ''}
                onChange={onField}
                placeholder="Enter percentage (0–100)"
                required
              />
              {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
            </>
          ) : (
            <>
              <label className="label">
                <span className="label-text text-black font-medium">
                  Amount (RM) *
                  {activeDeduction && (
                    <span className="text-xs text-gray-500 ml-2">
                      Max: {fmtRM(activeDeduction.max_limit)}
                    </span>
                  )}
                </span>
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                min={0}
                className={`input input-bordered w-full text-black ${fieldError ? 'border-red-500' : ''}`}
                value={form.amount ?? ''}
                onChange={onField}
                placeholder={
                  activeDeduction
                    ? `Enter amount (≤ ${fmtRM(activeDeduction.max_limit)})`
                    : 'Select a deduction first'
                }
                disabled={!activeDeduction}
                required
              />
              {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
            </>
          )}
        </div>

        {/* Right column: calculated preview only when prorated */}
        {isProrated && (
          <div>
            <label className="label">
              <span className="label-text text-black font-medium">Calculated Deduction Amount</span>
            </label>
            <div className="p-3 border rounded bg-gray-50 font-semibold">
              {Number.isFinite(form.amount as number)
                ? fmtRM(form.amount)
                : 'Enter percentage to calculate'}
            </div>
          </div>
        )}
      </div>

      {/* Scope (cascading) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label className="label">
            <span className="label-text text-black font-medium">Company</span>
          </label>
          <select
            name="company_id"
            className="select select-bordered w-full text-black"
            value={form.company_id ?? ''}
            onChange={onField}
          >
            <option value="">-- None --</option>
            {companyValueMissing && form.company_id && (
              <option value={form.company_id}>
                {initialData?.company_name || `Company #${form.company_id}`}
              </option>
            )}
            {companyOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Department (filtered by company) */}
        <div>
          <label className="label">
            <span className="label-text text-black font-medium">Department</span>
          </label>
          <select
            name="department_id"
            className="select select-bordered w-full text-black"
            value={form.department_id ?? ''}
            onChange={onField}
            disabled={!form.company_id}
          >
            {!form.company_id ? (
              <option value="">Select company first</option>
            ) : (
              <>
                <option value="">-- None --</option>
                {filteredDeptOptions.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
                {form.department_id && !deptInFiltered && currentDept && (
                  <option value={currentDept.id}>{currentDept.department_name}</option>
                )}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Effective Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Start Month</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDate}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="input input-bordered w-full text-gray-800 bg-white h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select start month"
            isClearable
            maxDate={endDate ?? undefined}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">End Month</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDate}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="input input-bordered w-full text-gray-800 bg-white h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select end month"
            isClearable
            minDate={startDate ?? undefined}
          />
        </div>
      </div>

      {/* Remark */}
      <div>
        <label className="label">
          <span className="label-text text-black font-medium">Remark</span>
        </label>
        <textarea
          name="remark"
          className="textarea textarea-bordered w-full text-black"
          placeholder="Optional remark for this mapping"
          value={form.remark ?? ''}
          onChange={onField}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 bg-white pt-4 border-t -mx-6 px-6 flex justify-end gap-3">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn bg-blue-600 text-white hover:bg-blue-700"
          disabled={
            submitting ||
            !!fieldError ||
            !activeDeduction ||
            (isProrated
              ? !Number.isFinite(form.percentage as number)
              : !Number.isFinite(form.amount as number))
          }
        >
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-xs mr-2" /> Saving…
            </>
          ) : (
            mode === 'edit' ? 'Update' : 'Add'
          )}
        </button>
      </div>
    </form>
  );
}
