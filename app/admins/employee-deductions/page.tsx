'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';

interface DeductionRow {
  id: number;
  employee_id: number;
  deduction_id: number;
  deduction_name: string;
  amount: string;
  is_recurring: number;
  effective_date?: string | null;
  end_date?: string | null;
  employee_name?: string;
  company_name?: string;
  department_name?: string;
}

interface GroupedDeduction {
  employee_id: number;
  employee_name: string;
  company_name: string;
  department_name: string;
  deductions: DeductionRow[];
}

export default function EmployeeDeductionListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<DeductionRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<GroupedDeduction[]>([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const data: DeductionRow[] = await api.get(`${API_BASE_URL}/api/employee-deductions`);
      setRows(data);
    } catch (err) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const grouped = rows.reduce((acc: any, curr) => {
      if (!acc[curr.employee_id]) {
        acc[curr.employee_id] = {
          employee_id: curr.employee_id,
          employee_name: curr.employee_name || '-',
          company_name: curr.company_name || '-',
          department_name: curr.department_name || '-',
          deductions: [],
        };
      }
      acc[curr.employee_id].deductions.push(curr);
      return acc;
    }, {});
    let groupedArray: GroupedDeduction[] = Object.values(grouped);

    if (search) {
      const keyword = search.toLowerCase();
      groupedArray = groupedArray.filter(g =>
        g.employee_name.toLowerCase().includes(keyword) ||
        g.company_name.toLowerCase().includes(keyword) ||
        g.department_name.toLowerCase().includes(keyword) ||
        g.deductions.some(d => d.deduction_name.toLowerCase().includes(keyword))
      );
    }

    setFilteredRows(groupedArray);
  }, [search, rows]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`${API_BASE_URL}/api/employee-deductions/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB');
  };

  const isActive = (start?: string | null, end?: string | null) => {
    const now = new Date();
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;
    if (startDate && endDate) return startDate <= now && endDate >= now;
    if (startDate && !endDate) return startDate <= now;
    return false;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Employee Deductions</h1>
        <div className="flex gap-2">
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => router.push('/admins/employee-deductions/new')}>
            + New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Company</th>
              <th>Department</th>
              <th>Deductions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((group) => (
              <tr key={group.employee_id}>
                <td>{group.employee_name}</td>
                <td>{group.company_name}</td>
                <td>{group.department_name}</td>
                <td>
                  {group.deductions.map((d) => (
                    <div key={d.id} className="mb-3">
                      <div className="font-medium">
                        {d.deduction_name} (RM {d.amount}){' '}
                        <span className="text-xs text-gray-500">
                          {d.is_recurring ? 'Recurring' : 'One-Time'}
                        </span>
                      </div>
                      {d.effective_date ? (
                        <div className="text-sm text-gray-600">
                          Start: {formatDate(d.effective_date)}{' '}
                          {d.end_date && ` End: ${formatDate(d.end_date)} `}
                          {isActive(d.effective_date, d.end_date) ? (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800 ml-2">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-800 ml-2">
                              Expired
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                            Ongoing
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </td>
                <td>
                  {group.deductions.map((d) => (
                    <div key={d.id} className="mb-1 flex gap-2">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => router.push(`/admins/employee-deductions/${d.id}`)}
                      >
                        Edit
                      </button>
                      <button className="btn btn-xs btn-error" onClick={() => handleDelete(d.id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
