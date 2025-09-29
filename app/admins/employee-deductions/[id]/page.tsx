'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api } from '../../../utils/api';
import { API_BASE_URL } from '../../../config';

interface DeductionRow {
  id?: number;
  employee_id: number;
  deduction_id: number;
  amount: string;
  is_recurring: number;
  effective_date?: string | null;
  end_date?: string | null;
}

export default function EmployeeDeductionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [row, setRow] = useState<DeductionRow>({
    employee_id: 0,
    deduction_id: 0,
    amount: '0.00',
    is_recurring: 1,
    effective_date: null,
    end_date: null,
  });

  const [employees, setEmployees] = useState<any[]>([]);
  const [deductions, setDeductions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`${API_BASE_URL}/api/admin/employees`).then(setEmployees);
    api.get(`${API_BASE_URL}/api/master-data/deductions`).then(setDeductions);
  }, []);

  useEffect(() => {
    if (!isNew) {
      api.get(`${API_BASE_URL}/api/employee-deductions/${id}`)
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
        })
        .catch(() => toast.error('Failed to load'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const handleDeductionChange = (deduction_id: number) => {
    const selected = deductions.find((d) => d.id === deduction_id);
    setRow({
      ...row,
      deduction_id,
      amount: selected?.amount || '0.00',
    });
  };

  const handleSave = async () => {
    try {
      const selected = deductions.find((d) => d.id === row.deduction_id);
      const payload = {
        ...row,
        amount: selected?.amount || '0.00',
      };
      if (isNew) {
        await api.post(`${API_BASE_URL}/api/employee-deductions`, payload);
        toast.success('Created successfully');
      } else {
        await api.put(`${API_BASE_URL}/api/employee-deductions/${id}`, payload);
        toast.success('Updated successfully');
      }
      router.push('/admins/employee-deductions');
    } catch (err) {
      toast.error('Save failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-6">
        {isNew ? 'Add Employee Deduction' : 'Edit Employee Deduction'}
      </h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Employee</label>
        <select
          className="input input-bordered w-full"
          value={row.employee_id}
          onChange={(e) => setRow({ ...row, employee_id: parseInt(e.target.value) })}
          disabled={!isNew}
        >
          <option value={0}>-- Select Employee --</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.company_name} - {e.department_name})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Deduction</label>
        <select
          className="input input-bordered w-full"
          value={row.deduction_id}
          onChange={(e) => handleDeductionChange(parseInt(e.target.value))}
        >
          <option value={0}>-- Select Deduction --</option>
          {deductions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} (RM {d.amount})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Amount (Read-only)</label>
        <input
          type="text"
          value={row.amount}
          readOnly
          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Recurring?</label>
        <select
          className="input input-bordered w-full"
          value={row.is_recurring}
          onChange={(e) => setRow({ ...row, is_recurring: parseInt(e.target.value) })}
        >
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Effective Date</label>
        <input
          type="date"
          value={row.effective_date ?? ''}
          onChange={(e) => setRow({ ...row, effective_date: e.target.value })}
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">End Date</label>
        <input
          type="date"
          value={row.end_date ?? ''}
          onChange={(e) => setRow({ ...row, end_date: e.target.value })}
          className="input input-bordered w-full"
        />
      </div>

      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
        <button className="btn btn-secondary" onClick={() => router.push('/admins/employee-deductions')}>Back</button>
      </div>
    </div>
  );
}