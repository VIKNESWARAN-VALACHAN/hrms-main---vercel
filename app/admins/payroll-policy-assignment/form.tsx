// 'use client';

// import React, { useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';
// import { toDateInputString } from '../../utils/formatters';


// export interface PayrollPolicyAssignment {
//   id?: number;
//   payroll_config_id?: number;
//   company_id?: number;
//   department_id?: number;
//   branch_id?: number;
//   start_date?: string;
//   end_date?: string;
//   is_active?: number;
//   // UI-only:
//   company_name?: string;
//   department_name?: string;
// }


// interface Props {
//   initialData?: Partial<PayrollPolicyAssignment>;
//   configs: { id: number; pay_interval: string }[];
//   companies: { id: number; name: string }[];
//   departments: { id: number; department_name: string }[];
//   mode?: 'add' | 'edit';
//   onSave: (data: Partial<PayrollPolicyAssignment>) => void | Promise<void>;
//   onCancel: () => void;
// }

// const PayrollPolicyAssignmentForm: React.FC<Props> = ({
//   initialData = {},
//   configs,
//   companies,
//   departments,
//   mode = 'add',
//   onSave,
//   onCancel,
// }) => {
//   const [form, setForm] = useState<Partial<PayrollPolicyAssignment>>({
//     payroll_config_id: initialData.payroll_config_id ?? undefined,
//     company_id: initialData.company_id ?? undefined,
//     department_id: initialData.department_id ?? undefined,
//     start_date: initialData.start_date ?? '',
//     end_date: initialData.end_date ?? '',
//     is_active: initialData.is_active ?? 1,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]:
//         name === 'is_active'
//           ? Number(value)
//           : name === 'company_id' || name === 'department_id' || name === 'payroll_config_id'
//           ? value === '' ? null : Number(value)
//           : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const body = JSON.stringify(form);
//       const res = await fetch(
//         mode === 'add'
//           ? `${API_BASE_URL}/api/payroll-policy-assignments`
//           : `${API_BASE_URL}/api/payroll-policy-assignments/${form.id}`,
//         {
//           method: mode === 'add' ? 'POST' : 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body,
//         }
//       );
//       if (!res.ok) {
//         const msg = await res.json();
//         throw new Error(msg?.error || 'Server error');
//       }
//       toast.success(mode === 'edit' ? 'Updated!' : 'Added!');
//       onSave(form); 
//     } catch (err: any) {
//       setError(err.message || 'Unknown error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow w-full max-w-md"
//         autoComplete="off"
//       >
//         <h2 className="text-xl font-bold mb-4">
//           {mode === 'edit' ? 'Edit' : 'Add'} Payroll Policy Assignment
//         </h2>
//         <div className="mb-3">
//           <label className="block mb-1">Payroll Config</label>
//           <select
//             name="payroll_config_id"
//             className="input input-bordered w-full"
//             value={form.payroll_config_id ?? ''}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Config</option>
//             {configs.map(c => (
//               <option value={c.id} key={c.id}>
//                 {c.pay_interval} (ID: {c.id})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Company</label>
//           <select
//             name="company_id"
//             className="input input-bordered w-full"
//             value={form.company_id ?? ''}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Company</option>
//             {companies.map(c => (
//               <option value={c.id} key={c.id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Department</label>
//           <select
//             name="department_id"
//             className="input input-bordered w-full"
//             value={form.department_id ?? ''}
//             onChange={handleChange}
//           >
//             <option value="">(Optional) Select Department</option>
//             {departments.map(d => (
//               <option value={d.id} key={d.id}>
//                 {d.department_name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">Start Date</label>
//           <input
//             type="date"
//             name="start_date"
//             className="input input-bordered w-full"
//             value={toDateInputString(form.start_date)}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1">End Date</label>
//           <input
//             type="date"
//             name="end_date"
//             className="input input-bordered w-full"
//             value={toDateInputString(form.end_date)}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1">Is Active?</label>
//           <select
//             name="is_active"
//             className="input input-bordered w-full"
//             value={form.is_active ?? 1}
//             onChange={handleChange}
//             required
//           >
//             <option value={1}>Yes</option>
//             <option value={0}>No</option>
//           </select>
//         </div>
//         {error && (
//           <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3">{error}</div>
//         )}
//         <div className="flex justify-end gap-2">
//           <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={loading}>
//             Cancel
//           </button>
//           <button className="btn btn-primary" type="submit" disabled={loading}>
//             {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PayrollPolicyAssignmentForm;
'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';
import { toDateInputString } from '../../utils/formatters';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


// Interfaces for props (copied for self-containment, ideally from a shared types file)
export interface Company { id: number; name: string; }
export interface Department { id: number; department_name: string; }
export interface PayrollConfig { id: number; pay_interval: string; }

// FIX: Added 'export' keyword to make PayrollPolicyAssignment a named export
export interface PayrollPolicyAssignment {
  id?: number;
  payroll_config_id: number | null;
  company_id: number | null;
  department_id: number | null;
  branch_id: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: number;
  // UI-only:
  company_name?: string;
  department_name?: string;
}


interface Props {
  initialData?: Partial<PayrollPolicyAssignment>;
  configs: { id: number; pay_interval: string }[];
  companies: { id: number; name: string }[];
  departments: { id: number; department_name: string }[];
  mode?: 'add' | 'edit'; // Ensure mode is explicitly 'add' or 'edit'
  onSave: (data: Partial<PayrollPolicyAssignment>) => void | Promise<void>;
  onCancel: () => void;
}

// Helper to format an ISO string or Date object to YYYY-MM-DD
const formatToYYYYMMDD = (dateValue: string | Date | null | undefined): string | null => {
  if (!dateValue) return null;
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null; // Invalid date
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error formatting date:", e);
    return null;
  }
};


const PayrollPolicyAssignmentForm: React.FC<Props> = ({
  initialData = {},
  configs,
  companies,
  departments,
  mode = 'add',
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState<Partial<PayrollPolicyAssignment>>({
    id: initialData.id,
    payroll_config_id: initialData.payroll_config_id ?? null,
    company_id: initialData.company_id ?? null,
    department_id: initialData.department_id ?? null,
    branch_id: initialData.branch_id ?? null,
    start_date: formatToYYYYMMDD(initialData.start_date) || '',
    end_date: formatToYYYYMMDD(initialData.end_date),
    is_active: initialData.is_active ?? 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDatePicker, setStartDatePicker] = useState<Date | null>(
    initialData?.start_date ? new Date(initialData.start_date) : null
  );
  const [endDatePicker, setEndDatePicker] = useState<Date | null>(
    initialData?.end_date ? new Date(initialData.end_date) : null
  );

  // Re-initialize form and date pickers when initialData changes (e.g., when modal opens for edit)
  // This useEffect is crucial for resetting the form when the 'key' prop changes in the parent.
  // It ensures the form correctly reflects the initialData provided.
React.useEffect(() => {
  if (!initialData?.id) return; // Prevent endless loop during 'add' mode or undefined

  setForm({
    id: initialData.id,
    payroll_config_id: initialData.payroll_config_id ?? null,
    company_id: initialData.company_id ?? null,
    department_id: initialData.department_id ?? null,
    branch_id: initialData.branch_id ?? null,
    start_date: formatToYYYYMMDD(initialData.start_date) || '',
    end_date: formatToYYYYMMDD(initialData.end_date),
    is_active: initialData.is_active ?? 1,
  });

  setStartDatePicker(initialData?.start_date ? new Date(initialData.start_date) : null);
  setEndDatePicker(initialData?.end_date ? new Date(initialData.end_date) : null);
}, [
  initialData?.id,
  initialData.payroll_config_id,
  initialData.company_id,
  initialData.department_id,
  initialData.branch_id,
  initialData.start_date,
  initialData.end_date,
  initialData.is_active
]);
  //}, [initialData?.id]); 



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number | null = value;

    if (name === 'is_active') {
      parsedValue = Number(value);
    } else if (['payroll_config_id', 'company_id', 'department_id', 'branch_id'].includes(name)) {
      parsedValue = value === '' ? null : Number(value);
      if (isNaN(parsedValue as number)) parsedValue = null;
    }
    if (name === 'end_date' && value === '') {
      parsedValue = null;
    }

    setForm(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDatePicker(date);
    setForm(prev => ({
      ...prev,
      start_date: formatToYYYYMMDD(date) || '',
    }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDatePicker(date);
    setForm(prev => ({
      ...prev,
      end_date: formatToYYYYMMDD(date),
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.payroll_config_id === null || form.payroll_config_id === undefined) {
      setError('Please select a Payroll Config.');
      setLoading(false);
      return;
    }
    if (form.company_id === null || form.company_id === undefined) {
      setError('Please select a Company.');
      setLoading(false);
      return;
    }
    if (!form.start_date || form.start_date === '') {
      setError('Please select a Start Date.');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...form,
        payroll_config_id: form.payroll_config_id ?? null,
        company_id: form.company_id ?? null,
        department_id: form.department_id ?? null,
        branch_id: form.branch_id ?? null,
        start_date: form.start_date,
        end_date: form.end_date,
        is_active: form.is_active ?? 1,
      };

      const res = await fetch(
        mode === 'add'
          ? `${API_BASE_URL}/api/payroll-policy-assignments`
          : `${API_BASE_URL}/api/payroll-policy-assignments/${form.id}`,
        {
          method: mode === 'add' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg?.error || msg?.details || 'Server error');
      }
      toast.success(mode === 'edit' ? 'Updated!' : 'Added!');
      onSave(form);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      toast.error(err.message || 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
        autoComplete="off"
      >
        <h2 className="text-xl font-bold mb-4">
          {mode === 'edit' ? 'Edit' : 'Add'} Payroll Policy Assignment
        </h2>
        <div className="mb-3">
          <label className="block mb-1">Payroll Config</label>
          <select
            name="payroll_config_id"
            className="input input-bordered w-full"
            value={form.payroll_config_id ?? ''}
            onChange={handleChange}
            required
          >
            <option value="">Select Config</option>
            {configs.map(c => (
              <option value={c.id} key={c.id}>
                {c.pay_interval} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Company</label>
          <select
            name="company_id"
            className="input input-bordered w-full"
            value={form.company_id ?? ''}
            onChange={handleChange}
            required
          >
            <option value="">Select Company</option>
            {companies.map(c => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Department</label>
          <select
            name="department_id"
            className="input input-bordered w-full"
            value={form.department_id ?? ''}
            onChange={handleChange}
          >
            <option value="">(Optional) Select Department</option>
            {departments.map(d => (
              <option value={d.id} key={d.id}>
                {d.department_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Branch</label>
          <select
            name="branch_id"
            className="input input-bordered w-full"
            value={form.branch_id ?? ''}
            onChange={handleChange}
          >
            <option value="">(Optional) Select Branch</option>
            <option value="1">Branch A</option>
            <option value="2">Branch B</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Start Date</label>
          <DatePicker
            selected={startDatePicker}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            className="input input-bordered w-full"
            placeholderText="Select start date"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">End Date</label>
          <DatePicker
            selected={endDatePicker}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            className="input input-bordered w-full"
            placeholderText="Select end date"
            isClearable
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Is Active?</label>
          <select
            name="is_active"
            className="input input-bordered w-full"
            value={form.is_active ?? 1}
            onChange={handleChange}
            required
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3">{error}</div>
        )}
        <div className="flex justify-end gap-2">
          <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollPolicyAssignmentForm;