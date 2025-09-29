// 'use client';

// import React, { useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';

// export interface PayrollPolicyAssignment {
//   id?: number;
//   payroll_config_id?: number;
//   company_id?: number;
//   department_id?: number;
//   branch_id?: number;
//   start_date?: string;
//   end_date?: string;
//   is_active?: number;
//   // For table display:
//   company_name?: string;
//   department_name?: string;
// }

// interface Props {
//   initialData?: Partial<PayrollPolicyAssignment>;
//   configs: { id: number; pay_interval: string }[];
//   companies: { id: number; name: string }[];
//   departments: { id: number; department_name: string }[];
//   mode?: 'add' | 'edit';
//   editId?: number | string; // Pass this for edit mode
//   onSave: (data: Partial<PayrollPolicyAssignment>) => void | Promise<void>;
//   onCancel: () => void;
// }

// const PayrollPolicyAssignmentForm: React.FC<Props> = ({
//   initialData = {},
//   configs,
//   companies,
//   departments,
//   mode = 'add',
//   editId,
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
//           ? Number(value)
//           : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const body = JSON.stringify(form);
//       const url =
//         mode === 'add'
//           ? `${API_BASE_URL}/api/payroll-policy-assignments`
//           : `${API_BASE_URL}/api/payroll-policy-assignments/${editId}`;

//       const method = mode === 'add' ? 'POST' : 'PUT';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body,
//       });
//       if (!res.ok) {
//         const msg = await res.json().catch(() => ({}));
//         throw new Error(msg?.error || 'Server error');
//       }
//       toast.success(mode === 'edit' ? 'Updated!' : 'Added!');
//       await onSave(form);
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
//             value={form.start_date ?? ''}
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
//             value={form.end_date ?? ''}
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

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../config';

// Interfaces from PayrollPolicyAssignmentPage (copied for self-containment)
export interface Company { id: number; name: string; }
export interface Department { id: number; department_name: string; }
export interface PayrollConfig { id: number; pay_interval: string; }

// Main interface for PayrollPolicyAssignment
export interface PayrollPolicyAssignment {
  id?: number;
  payroll_config_id: number;
  company_id: number;
  department_id: number | null;
  branch_id: number | null; // Assuming branch_id can be null
  start_date: string; // Will be YYYY-MM-DD
  end_date: string | null; // Will be YYYY-MM-DD or null
  is_active: number; // 0 or 1
  // Joined fields (not sent to backend for create/update, but useful for initialData)
  company_name?: string;
  department_name?: string;
  payroll_config_name?: string;
}

interface Props {
  mode: 'edit' | 'add';
  initialData?: Partial<PayrollPolicyAssignment>;
  configs: PayrollConfig[];
  companies: Company[];
  departments: Department[];
  onSave: () => void; // Callback to refresh parent table/details
  onCancel: () => void; // Callback to close modal
}

const defaultFormData: Partial<PayrollPolicyAssignment> = {
  payroll_config_id: 0, // Use 0 for initial selection in dropdowns
  company_id: 0,
  department_id: null,
  branch_id: null,
  start_date: '',
  end_date: null,
  is_active: 1, // Default to active
};

export default function PayrollPolicyAssignmentForm({
  mode,
  initialData,
  configs,
  companies,
  departments,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState<Partial<PayrollPolicyAssignment>>({
    ...defaultFormData,
    ...initialData,
    // Ensure dates are correctly handled on initial load:
    // If initialData.start_date is null/undefined, default to empty string for required field.
    // If initialData.end_date is null/undefined, default to null.
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || null,
  });

  // States for DatePicker components (they require Date objects)
  const [startDatePicker, setStartDatePicker] = useState<Date | null>(
    initialData?.start_date ? new Date(initialData.start_date) : null
  );
  const [endDatePicker, setEndDatePicker] = useState<Date | null>(
    initialData?.end_date ? new Date(initialData.end_date) : null
  );

  // Sync DatePicker state with form state when initialData changes (e.g., on edit)
  useEffect(() => {
    setStartDatePicker(initialData?.start_date ? new Date(initialData.start_date) : null);
    setEndDatePicker(initialData?.end_date ? new Date(initialData.end_date) : null);
    setForm({
      ...defaultFormData,
      ...initialData,
      start_date: initialData?.start_date || '',
      end_date: initialData?.end_date || null,
    });
  }, [initialData]);

  // Handle changes for text inputs and selects
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    if (name === 'company_id' || name === 'payroll_config_id') {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) parsedValue = 0; // Set to 0 for invalid selection
    } else if (name === 'department_id' || name === 'branch_id') {
      parsedValue = value === '' ? null : parseInt(value, 10); // Allow null for optional IDs
      if (isNaN(parsedValue)) parsedValue = null;
    } else if (name === 'is_active') {
      parsedValue = parseInt(value, 10);
    }

    setForm(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Handle changes for Start DatePicker
  const handleStartDateChange = (date: Date | null) => {
    setStartDatePicker(date);
    setForm(prev => ({
      ...prev,
      // Format date to YYYY-MM-DD string. If null, set to empty string as it's required.
      start_date: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  // Handle changes for End DatePicker
  const handleEndDateChange = (date: Date | null) => {
    setEndDatePicker(date);
    setForm(prev => ({
      ...prev,
      // Format date to YYYY-MM-DD string. If null, set to null (for optional field).
      end_date: date ? date.toISOString().split('T')[0] : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.payroll_config_id || form.payroll_config_id === 0) {
      toast.error('Please select a Payroll Config.');
      return;
    }
    if (!form.company_id || form.company_id === 0) {
      toast.error('Please select a Company.');
      return;
    }
    if (!form.start_date) { // Check if start_date is empty string
      toast.error('Please select a Start Date.');
      return;
    }

    // Prepare data for API call
    const dataToSend: Partial<PayrollPolicyAssignment> = {
      payroll_config_id: form.payroll_config_id,
      company_id: form.company_id,
      department_id: form.department_id,
      branch_id: form.branch_id,
      start_date: form.start_date,
      end_date: form.end_date, // This will be YYYY-MM-DD string or null
      is_active: form.is_active,
    };

    try {
      if (mode === 'edit' && initialData?.id) {
        // Ensure ID is present for update
        await api.put(`${API_BASE_URL}/api/payroll-policy-assignments/${initialData.id}`, dataToSend);
        toast.success('Assignment updated successfully!');
      } else {
        await api.post(`${API_BASE_URL}/api/payroll-policy-assignments`, dataToSend);
        toast.success('Assignment added successfully!');
      }
      onSave(); // Trigger parent to refresh data and close modal
    } catch (err: any) {
      toast.error(err.message || 'Failed to save assignment.');
      console.error('Save error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{mode === 'edit' ? 'Edit' : 'Add'} Payroll Policy Assignment</h2>

        {/* Payroll Config */}
        <div className="mb-3">
          <label htmlFor="payroll_config_id" className="block font-medium mb-1">Payroll Config</label>
          <select
            id="payroll_config_id"
            name="payroll_config_id"
            className="input input-bordered w-full"
            value={form.payroll_config_id ?? ''}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Payroll Config --</option>
            {configs.map(cfg => (
              <option key={cfg.id} value={cfg.id}>{cfg.pay_interval} (ID: {cfg.id})</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="mb-3">
          <label htmlFor="company_id" className="block font-medium mb-1">Company</label>
          <select
            id="company_id"
            name="company_id"
            className="input input-bordered w-full"
            value={form.company_id ?? ''}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Company --</option>
            {companies.map(comp => (
              <option key={comp.id} value={comp.id}>{comp.name}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div className="mb-3">
          <label htmlFor="department_id" className="block font-medium mb-1">Department (Optional)</label>
          <select
            id="department_id"
            name="department_id"
            className="input input-bordered w-full"
            value={form.department_id ?? ''}
            onChange={handleChange}
          >
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}
          </select>
        </div>

        {/* Branch (Optional - assuming it exists in your DB and data) */}
        {/* You might need to fetch branches based on company_id if they are hierarchical */}
        <div className="mb-3">
          <label htmlFor="branch_id" className="block font-medium mb-1">Branch (Optional)</label>
          <select
            id="branch_id"
            name="branch_id"
            className="input input-bordered w-full"
            value={form.branch_id ?? ''}
            onChange={handleChange}
          >
            <option value="">-- Select Branch --</option>
            {/* Replace with actual branch data if available */}
            {/* Example: {branches.map(branch => (<option key={branch.id} value={branch.id}>{branch.name}</option>))} */}
            <option value="1">Main Branch</option>
            <option value="2">North Branch</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="mb-3">
          <label htmlFor="start_date" className="block font-medium mb-1">Start Date</label>
          <DatePicker
            id="start_date"
            selected={startDatePicker}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            className="input input-bordered w-full"
            placeholderText="Select start date"
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-3">
          <label htmlFor="end_date" className="block font-medium mb-1">End Date (Optional)</label>
          <DatePicker
            id="end_date"
            selected={endDatePicker}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            className="input input-bordered w-full"
            placeholderText="Select end date"
            isClearable // Allows clearing the date, which will send null
          />
        </div>

        {/* Is Active */}
        <div className="mb-4">
          <label htmlFor="is_active" className="block font-medium mb-1">Is Active?</label>
          <select
            id="is_active"
            name="is_active"
            className="input input-bordered w-full"
            value={form.is_active ?? 1}
            onChange={handleChange}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">{mode === 'edit' ? 'Update' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
}