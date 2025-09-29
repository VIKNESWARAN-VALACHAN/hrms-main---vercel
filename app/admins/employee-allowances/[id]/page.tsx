// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { api } from '../../../utils/api';
// import { API_BASE_URL } from '../../../config';
// import { toast } from 'react-hot-toast';

// interface AllowanceRow {
//   id?: number;
//   employee_id: number;
//   allowance_id: number;
//   amount: string;
//   is_recurring: number;
//   effective_date?: string | null;
//   end_date?: string | null;
// }

// export default function EmployeeAllowanceDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id as string;

//   const isNew = id === 'new';

//   const [row, setRow] = useState<AllowanceRow>({
//     employee_id: 0,
//     allowance_id: 0,
//     amount: '0.00',
//     is_recurring: 1,
//     effective_date: null,
//     end_date: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [allowances, setAllowances] = useState<any[]>([]);

//   useEffect(() => {
//     api.get(`${API_BASE_URL}/api/admin/employees`).then(setEmployees);
//     api.get(`${API_BASE_URL}/api/master-data/allowances`).then(setAllowances);
//   }, []);

//   useEffect(() => {
//     if (!isNew) {
//       api.get(`${API_BASE_URL}/api/employee-allowances/${id}`)
//         .then((res) => {
//           setRow({
//             ...res,
//             effective_date: res.effective_date
//               ? new Date(res.effective_date).toISOString().substring(0, 10)
//               : '',
//             end_date: res.end_date
//               ? new Date(res.end_date).toISOString().substring(0, 10)
//               : '',
//           });
//         })
//         .catch(() => toast.error('Failed to load'))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [id, isNew]);

//   const handleAllowanceChange = (allowance_id: number) => {
//     const selected = allowances.find((a) => a.id === allowance_id);
//     setRow({
//       ...row,
//       allowance_id,
//       amount: selected?.max_limit || '0.00',
//     });
//   };

//   const handleSave = async () => {
//     try {
//       if (isNew) {
//         await api.post(`${API_BASE_URL}/api/employee-allowances`, row);
//         toast.success('Created successfully');
//       } else {
//         await api.put(`${API_BASE_URL}/api/employee-allowances/${id}`, row);
//         toast.success('Updated successfully');
//       }
//       router.push('/admins/employee-allowances');
//     } catch (err: any) {
//       toast.error('Save failed');
//     }
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-screen">
//       <span className="loading loading-spinner loading-lg"></span>
//     </div>
//   );

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Fixed Header */}
//       <div className="bg-base-100 p-4 border-b sticky top-0 z-10 shadow-sm">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-xl md:text-2xl font-bold">
//             {isNew ? 'Add Employee Allowance' : 'Edit Employee Allowance'}
//           </h1>
//         </div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Employee Section */}
//             <div className="space-y-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium">Employee</span>
//                 </label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={row.employee_id}
//                   onChange={(e) => setRow({ ...row, employee_id: parseInt(e.target.value) })}
//                   disabled={!isNew}
//                 >
//                   <option value={0}>-- Select Employee --</option>
//                   {employees.map((e) => (
//                     <option key={e.id} value={e.id}>
//                       {e.name} ({e.company_name})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium">Allowance</span>
//                 </label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={row.allowance_id}
//                   onChange={(e) => handleAllowanceChange(parseInt(e.target.value))}
//                 >
//                   <option value={0}>-- Select Allowance --</option>
//                   {allowances.map((a) => (
//                     <option key={a.id} value={a.id}>
//                       {a.name} (RM {a.max_limit})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Amount & Recurring Section */}
//             <div className="space-y-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium">Amount</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={row.amount}
//                   readOnly
//                   className="input input-bordered w-full bg-gray-100"
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium">Recurring?</span>
//                 </label>
//                 <select
//                   className="select select-bordered w-full"
//                   value={row.is_recurring}
//                   onChange={(e) => setRow({ ...row, is_recurring: parseInt(e.target.value) })}
//                 >
//                   <option value={1}>Yes</option>
//                   <option value={0}>No</option>
//                 </select>
//               </div>
//             </div>

//             {/* Date Section */}
//             <div className="space-y-4">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium">Effective Date</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={row.effective_date ?? ''}
//                   onChange={(e) => setRow({ ...row, effective_date: e.target.value })}
//                   className="input input-bordered w-full"
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-medium">End Date</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={row.end_date ?? ''}
//                   onChange={(e) => setRow({ ...row, end_date: e.target.value })}
//                   className="input input-bordered w-full"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Fixed Footer */}
//       <div className="bg-base-100 p-4 border-t sticky bottom-0 z-10 shadow-sm">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-col sm:flex-row gap-2 justify-end">
//             <button 
//               className="btn btn-outline btn-secondary w-full sm:w-auto"
//               onClick={() => router.push('/admins/employee-allowances')}
//             >
//               Back
//             </button>
//             <button 
//               className="btn btn-primary w-full sm:w-auto"
//               onClick={handleSave}
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';

interface AllowanceRow {
  id?: number;
  employee_id: number;
  allowance_id: number;
  amount: string;
  is_recurring: number;
  effective_date?: string | null;
  end_date?: string | null;
}

interface Allowance {
  id: number;
  name: string;
  max_limit: string;
  description?: string;
}

export default function EmployeeAllowanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const isNew = id === 'new';

  const [row, setRow] = useState<AllowanceRow>({
    employee_id: 0,
    allowance_id: 0,
    amount: '0.00',
    is_recurring: 1,
    effective_date: null,
    end_date: null,
  });
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [selectedAllowance, setSelectedAllowance] = useState<Allowance | null>(null);
  const [amountError, setAmountError] = useState<string>('');

  useEffect(() => {
    Promise.all([
      api.get(`${API_BASE_URL}/api/admin/employees`),
      api.get(`${API_BASE_URL}/api/master-data/allowances`)
    ]).then(([employeesData, allowancesData]) => {
      setEmployees(employeesData);
      setAllowances(allowancesData);
    });
  }, []);

  useEffect(() => {
    if (!isNew) {
      api.get(`${API_BASE_URL}/api/employee-allowances/${id}`)
        .then((res) => {
          setRow({
            ...res,
            effective_date: res.effective_date
              ? new Date(res.effective_date).toISOString().substring(0, 10)
              : '',
            end_date: res.end_date
              ? new Date(res.end_date).toISOString().substring(0, 10)
              : '',
          });
          
          // Set selected allowance for editing
          if (res.allowance_id && allowances.length > 0) {
            const selected = allowances.find((a) => a.id === res.allowance_id);
            setSelectedAllowance(selected || null);
          }
        })
        .catch(() => toast.error('Failed to load'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isNew, allowances]);

  const validateAmount = (amount: number, maxLimit: number): string => {
    if (amount <= 0) {
      return 'Amount must be greater than 0';
    }
    if (amount > maxLimit) {
      return `Amount cannot exceed the maximum limit of RM ${maxLimit.toFixed(2)}`;
    }
    return '';
  };

  const handleAllowanceChange = (allowance_id: number) => {
    const selected = allowances.find((a) => a.id === allowance_id);
    setSelectedAllowance(selected || null);
    setRow({
      ...row,
      allowance_id,
      amount: '0.00', // Reset amount when changing allowance
    });
    setAmountError(''); // Clear any previous error
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value);
    
    if (value === '' || isNaN(numericValue)) {
      setRow({ ...row, amount: value });
      setAmountError(value === '' ? '' : 'Please enter a valid number');
      return;
    }

    if (selectedAllowance) {
      const maxLimit = parseFloat(selectedAllowance.max_limit);
      const error = validateAmount(numericValue, maxLimit);
      setAmountError(error);
    }

    setRow({ ...row, amount: value });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!row.employee_id || !row.allowance_id || !row.amount || parseFloat(row.amount) <= 0) {
      toast.error('Please fill all required fields with valid values.');
      return;
    }

    // Validate amount against max limit
    if (selectedAllowance) {
      const maxLimit = parseFloat(selectedAllowance.max_limit);
      const amount = parseFloat(row.amount);
      const error = validateAmount(amount, maxLimit);
      if (error) {
        toast.error(error);
        return;
      }
    }

    try {
      if (isNew) {
        await api.post(`${API_BASE_URL}/api/employee-allowances`, row);
        toast.success('Created successfully');
      } else {
        await api.put(`${API_BASE_URL}/api/employee-allowances/${id}`, row);
        toast.success('Updated successfully');
      }
      router.push('/admins/employee-allowances');
    } catch (err: any) {
      toast.error('Save failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="bg-base-100 p-4 border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold">
            {isNew ? 'Add Employee Allowance' : 'Edit Employee Allowance'}
          </h1>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Employee Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Employee *</label>
                <select
                  className="input input-bordered w-full"
                  value={row.employee_id}
                  onChange={(e) => setRow({ ...row, employee_id: parseInt(e.target.value) })}
                  disabled={!isNew}
                  required
                >
                  <option value={0}>-- Select Employee --</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.company_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Allowance Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Allowance *</label>
                <select
                  className="input input-bordered w-full"
                  value={row.allowance_id}
                  onChange={(e) => handleAllowanceChange(parseInt(e.target.value))}
                  required
                >
                  <option value={0}>-- Select Allowance --</option>
                  {allowances.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Allowance Information Card */}
            {selectedAllowance && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Allowance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Allowance Name</p>
                    <p className="font-medium">{selectedAllowance.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Maximum Limit</p>
                    <p className="font-medium text-green-600">RM {parseFloat(selectedAllowance.max_limit).toFixed(2)}</p>
                  </div>
                  {selectedAllowance.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-sm">{selectedAllowance.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Amount Input */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Amount (RM) *
                  {selectedAllowance && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Max: RM {parseFloat(selectedAllowance.max_limit).toFixed(2)})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedAllowance ? parseFloat(selectedAllowance.max_limit) : undefined}
                  className={`input input-bordered w-full ${amountError ? 'border-red-500' : ''}`}
                  value={row.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={selectedAllowance ? `Enter amount (Max: RM ${parseFloat(selectedAllowance.max_limit).toFixed(2)})` : 'Select an allowance first'}
                  disabled={!selectedAllowance}
                  required
                />
                {amountError && (
                  <p className="text-red-500 text-xs mt-1">{amountError}</p>
                )}
              </div>

              {/* Recurring Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Recurring?</label>
                <select
                  className="input input-bordered w-full"
                  value={row.is_recurring}
                  onChange={(e) => setRow({ ...row, is_recurring: parseInt(e.target.value) })}
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Effective Date */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Effective Date</label>
                <input
                  type="date"
                  value={row.effective_date ?? ''}
                  onChange={(e) => setRow({ ...row, effective_date: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>

              {/* End Date */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={row.end_date ?? ''}
                  onChange={(e) => setRow({ ...row, end_date: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="bg-base-100 p-4 border-t sticky bottom-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button 
              className="btn btn-secondary w-full sm:w-auto"
              onClick={() => router.push('/admins/employee-allowances')}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary w-full sm:w-auto"
              onClick={handleSave}
              disabled={!!amountError || !selectedAllowance || !row.amount || parseFloat(row.amount) <= 0}
            >
              {isNew ? 'Add' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}