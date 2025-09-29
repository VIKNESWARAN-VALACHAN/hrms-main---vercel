'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../utils/api';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';

interface AllowanceRow {
  id: number;
  employee_id: number;
  allowance_id: number;
  allowance_name: string;
  amount: string;
  is_recurring: number;
  effective_date?: string | null;
  end_date?: string | null;
  employee_name?: string;
  company_name?: string;
  department_name?: string;
}

interface GroupedAllowance {
  employee_id: number;
  employee_name: string;
  company_name: string;
  department_name: string;
  allowances: AllowanceRow[];
}

export default function EmployeeAllowanceListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<AllowanceRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<GroupedAllowance[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Get unique companies and departments for filter dropdowns
  const uniqueCompanies = Array.from(new Set(rows.map(row => row.company_name).filter(Boolean)));
  const uniqueDepartments = Array.from(new Set(rows.map(row => row.department_name).filter(Boolean)));

  const fetchData = async () => {
    try {
      const data: AllowanceRow[] = await api.get(`${API_BASE_URL}/api/employee-allowances`);
      setRows(data);
    } catch (err: any) {
      toast.error('Failed to fetch allowance data');
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
          allowances: [],
        };
      }
      acc[curr.employee_id].allowances.push(curr);
      return acc;
    }, {});

    let groupedArray: GroupedAllowance[] = Object.values(grouped);

    // Apply search filter
    if (search) {
      const keyword = search.toLowerCase();
      groupedArray = groupedArray.filter(g =>
        g.employee_name.toLowerCase().includes(keyword) ||
        g.company_name.toLowerCase().includes(keyword) ||
        g.department_name.toLowerCase().includes(keyword) ||
        g.allowances.some(a => a.allowance_name.toLowerCase().includes(keyword))
      );
    }

    // Apply company filter
    if (selectedCompany !== 'all') {
      groupedArray = groupedArray.filter(g => g.company_name === selectedCompany);
    }

    // Apply department filter
    if (selectedDepartment !== 'all') {
      groupedArray = groupedArray.filter(g => g.department_name === selectedDepartment);
    }

    setFilteredRows(groupedArray);
  }, [search, selectedCompany, selectedDepartment, rows]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure to delete this allowance?')) return;
    try {
      await api.delete(`${API_BASE_URL}/api/employee-allowances/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err: any) {
      toast.error('Delete failed');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCompany('all');
    setSelectedDepartment('all');
  };

  const hasActiveFilters = search || selectedCompany !== 'all' || selectedDepartment !== 'all';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee Allowances</h1>
        <button className="btn btn-primary" onClick={() => router.push('/admins/employee-allowances/new')}>
          + New
        </button>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by employee, company, department, or allowance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="select select-bordered min-w-[200px]"
          >
            <option value="all">All Companies</option>
            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="select select-bordered min-w-[200px]"
          >
            <option value="all">All Departments</option>
            {uniqueDepartments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn btn-outline btn-sm"
              title="Clear all filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total Employees</div>
          <div className="stat-value text-primary">{filteredRows.length}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Companies</div>
          <div className="stat-value text-sm">
            {selectedCompany === 'all' ? uniqueCompanies.length : 1}
          </div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Departments</div>
          <div className="stat-value text-sm">
            {selectedDepartment === 'all' ? uniqueDepartments.length : 1}
          </div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total Allowances</div>
          <div className="stat-value text-sm">
            {filteredRows.reduce((total, group) => total + group.allowances.length, 0)}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-base-200 rounded-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Active filters:</span>
            {search && (
              <span className="badge badge-primary">
                Search: "{search}"
              </span>
            )}
            {selectedCompany !== 'all' && (
              <span className="badge badge-secondary">
                Company: {selectedCompany}
              </span>
            )}
            {selectedDepartment !== 'all' && (
              <span className="badge badge-accent">
                Department: {selectedDepartment}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Company</th>
              <th>Department</th>
              <th>Allowances</th>
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
                  {group.allowances.map((a) => {
                    const now = new Date();
                    const effective = a.effective_date ? new Date(a.effective_date) : null;
                    const end = a.end_date ? new Date(a.end_date) : null;
                    let status = '';
                    let badgeClass = '';

                    if (effective && end) {
                      if (now >= effective && now <= end) {
                        status = 'Active';
                        badgeClass = 'bg-green-100 text-green-800';
                      } else if (now > end) {
                        status = 'Expired';
                        badgeClass = 'bg-red-100 text-red-800';
                      } else if (now < effective) {
                        status = 'Upcoming';
                        badgeClass = 'bg-yellow-100 text-yellow-800';
                      }
                    } else {
                      status = 'Ongoing';
                      badgeClass = 'bg-gray-100 text-gray-800';
                    }

                    return (
                      <div key={a.id} className="mb-2">
                        <div className="font-medium">
                          {a.allowance_name} (RM {a.amount}){' '}
                          <span className="text-xs text-gray-500">
                            {a.is_recurring ? 'Recurring' : 'One-Time'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {a.effective_date && (
                            <span className="mr-2">Start: {new Date(a.effective_date).toLocaleDateString('en-GB')}</span>
                          )}
                          {a.end_date && (
                            <span className="mr-2">End: {new Date(a.end_date).toLocaleDateString('en-GB')}</span>
                          )}
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${badgeClass}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </td>
                <td>
                  {group.allowances.map((a) => (
                    <div key={a.id} className="mb-1 flex gap-2">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => router.push(`/admins/employee-allowances/${a.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  {hasActiveFilters ? 'No records match the current filters.' : 'No records found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

