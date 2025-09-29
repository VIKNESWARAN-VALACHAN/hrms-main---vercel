'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';
import { api } from '../../../utils/api';

interface MappingRow {
  id: number;
  employee_id: number;
  employee_name: string;
  department_name: string;
  company_name: string;
  benefit_type: string;
  benefit_type_id: number;
  is_active: number;
  claimed: number;
  balance: number;
  amount: number;
  frequency: string;
  effective_from: string;
  effective_to: string;
}

interface Option {
  id: number;
  name: string;
}

const PAGE_SIZE = 10;

// Debounce helper
function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function BenefitMappingTab() {
  const [rows, setRows] = useState<MappingRow[]>([]);
  const [loading, setLoading] = useState(true);

  // filters + paging
  //const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // UI
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // --- replace your search state with two states ---
const [term, setTerm] = useState('');         // immediate keystrokes
const search = useDebounced(term, 300);       // debounced value used for fetch


  // form state
  const [formData, setFormData] = useState({
    employee_id: '',
    benefit_type_id: '',
    is_active: '1',
    amount: '0.00',
    frequency: 'Yearly',
    effective_from: '',
    effective_to: ''
  });

  const [groupData, setGroupData] = useState({
    company_id: '',
    benefit_type_id: '',
    amount: '0.00',
    frequency: 'Yearly',
    effective_from: '',
    effective_to: '',
    is_active: '1'
  });

  // dropdowns
  const [employees, setEmployees] = useState<Option[]>([]);
  const [benefitTypes, setBenefitTypes] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ---- FETCHERS ----

  // Mapping list (server-side pagination)
  const fetchMappingData1 = async (pageArg = page, searchArg = search, statusArg = statusFilter) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        page: String(pageArg),
        limit: String(PAGE_SIZE),
      });
      const q = (searchArg || '').trim();
      if (q) qs.set('q', q);
      if (statusArg !== 'All') qs.set('status', String(statusArg === 'Active' ? 1 : 0));

      const payload = await api.get(`/api/employee-benefits?${qs.toString()}`);

      // Accept both array-only and { data, pagination } shapes
      const list: any[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      const pg = payload?.pagination ?? null;
      setTotalPages(pg?.totalPages || 1);
      setTotal(pg?.total ?? list.length);
      setLimit(pg?.limit || PAGE_SIZE);

      const toYmd = (d: any) => {
        if (!d) return '-';
        const dt = new Date(d);
        return Number.isFinite(dt.getTime()) ? dt.toISOString().split('T')[0] : '-';
      };

      const enriched: MappingRow[] = list.map((item: any) => {
        const amount  = Number(item.amount ?? item.entitled) || 0;
        const claimed = Number(item.claimed) || 0;
        const balance = Number(item.balance ?? amount - claimed) || 0;

        return {
          id: item.id,
          employee_id: item.employee_id,
          employee_name: item.employee_name,
          department_name: item.department_name || '-',
          company_name: item.company_name || '-',
          benefit_type: item.benefit_name,
          benefit_type_id: Number(item.benefit_type_id ?? item.benefit_id) || 0,
          is_active: Number(item.is_active) || 0,
          amount,
          claimed,
          balance,
          frequency: item.frequency || '-',
          effective_from: toYmd(item.effective_from),
          effective_to: toYmd(item.effective_to),
        };
      });

      setRows(enriched);
    } catch (err: any) {
      console.error('Error fetching mapping data:', err);
      toast.error(err?.message || 'Failed to fetch mapping data.');
      setRows([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // --- in your Mapping list fetcher, add a stale-response guard + send both param names ---
const requestSeq = useRef(0);
const fetchMappingData = async (pageArg = page, searchArg = search, statusArg = statusFilter) => {
  setLoading(true);
  const mySeq = ++requestSeq.current;

  try {
    const qs = new URLSearchParams({
      page: String(pageArg),
      limit: String(PAGE_SIZE),
      // Always include search params; some servers require explicit empty
      q: (searchArg || '').trim(),
      search: (searchArg || '').trim(),
    });

    if (statusArg !== 'All') {
      const active = statusArg === 'Active' ? '1' : '0';
      qs.set('status', active);
      qs.set('is_active', active);
    }

    const payload = await api.get(`/api/employee-benefits?${qs.toString()}`);

    // ignore stale responses
    if (mySeq !== requestSeq.current) return;

    const list: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
      ? payload.data
      : [];

    const pg = payload?.pagination ?? null;
    setTotalPages(pg?.totalPages || 1);
    setTotal(pg?.total ?? list.length);
    setLimit(pg?.limit || PAGE_SIZE);

    const toYmd = (d: any) => {
      if (!d) return '-';
      const dt = new Date(d);
      return Number.isFinite(dt.getTime()) ? dt.toISOString().split('T')[0] : '-';
    };

    const enriched: MappingRow[] = list.map((item: any) => {
      const amount  = Number(item.amount ?? item.entitled) || 0;
      const claimed = Number(item.claimed) || 0;
      const balance = Number(item.balance ?? amount - claimed) || 0;

      return {
        id: item.id,
        employee_id: item.employee_id,
        employee_name: item.employee_name,
        department_name: item.department_name || '-',
        company_name: item.company_name || '-',
        benefit_type: item.benefit_name,
        benefit_type_id: Number(item.benefit_type_id ?? item.benefit_id) || 0,
        is_active: Number(item.is_active) || 0,
        amount,
        claimed,
        balance,
        frequency: item.frequency || '-',
        effective_from: toYmd(item.effective_from),
        effective_to: toYmd(item.effective_to),
      };
    });

    setRows(enriched);
  } catch (err: any) {
    if (mySeq !== requestSeq.current) return; // ignore stale errors too
    console.error('Error fetching mapping data:', err);
    toast.error(err?.message || 'Failed to fetch mapping data.');
    setRows([]);
    setTotalPages(1);
    setTotal(0);
  } finally {
    if (mySeq === requestSeq.current) setLoading(false);
  }
};


  // Dropdowns
  const fetchDropdowns = async () => {
    try {
      const empRes     = await api.get('/api/admin/employees');
      const benefitRes = await api.get('/api/benefits');
      const companyRes = await api.get('/api/companies');

      const mappedCompanies = (companyRes || []).map((c: any) => ({
        id: c.id ?? c.company_id,
        name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
      }));

      setEmployees(empRes || []);
      setBenefitTypes(benefitRes || []);
      setCompanies(mappedCompanies);
    } catch (err: any) {
      toast.error('Failed to fetch dropdown data');
    }
  };

  // initial load
//   useEffect(() => {
//     fetchMappingData(1);
//     fetchDropdowns();
//   }, []);

useEffect(() => {
  fetchMappingData(1, search, statusFilter);
  fetchDropdowns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // refetch when page / filters change
//   useEffect(() => {
//     fetchMappingData(page, search, statusFilter);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, search, statusFilter]);
useEffect(() => {
  fetchMappingData(page, search, statusFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [page, search, statusFilter]);

  // reset to page 1 when filters change
//   useEffect(() => {
//     setPage(1);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, statusFilter]);

  // ---- HANDLERS ----
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.employee_id || !formData.benefit_type_id) {
      toast.error('Employee and Benefit Type are required');
      return;
    }

    try {
      const payload = {
        ...formData,
        is_active: parseInt(formData.is_active),
        amount: parseFloat(formData.amount),
        effective_from: formData.effective_from || null,
        effective_to: formData.effective_to || null
      };

      const url = editingId 
        ? `${API_BASE_URL}/api/employee-benefits/${editingId}`
        : `${API_BASE_URL}/api/employee-benefits`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Save failed');
      }

      toast.success(editingId ? 'Mapping updated successfully' : 'Mapping added successfully');
      setShowAddModal(false);
      setEditingId(null);
      await fetchMappingData(page, search, statusFilter);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save mapping');
    }
  };

  const handleGroupSave = async () => {
    if (!groupData.company_id || !groupData.benefit_type_id) {
      toast.error('Company and Benefit Type are required');
      return;
    }

    try {
      const payload = {
        ...groupData,
        amount: parseFloat(groupData.amount),
        is_active: parseInt(groupData.is_active),
        effective_from: groupData.effective_from || null,
        effective_to: groupData.effective_to || null
      };

      const res = await fetch(`${API_BASE_URL}/api/employee-benefits/group-by-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Save failed');
      }

      toast.success('Group mapping added successfully');
      setShowGroupModal(false);
      await fetchMappingData(page, search, statusFilter);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save group mapping');
    }
  };

  const handleEdit = (row: MappingRow) => {
    setFormData({
      employee_id: row.employee_id.toString(),
      benefit_type_id: row.benefit_type_id.toString(),
      is_active: row.is_active.toString(),
      amount: row.amount.toFixed(2),
      frequency: row.frequency,
      effective_from: row.effective_from !== '-' ? row.effective_from : '',
      effective_to: row.effective_to !== '-' ? row.effective_to : ''
    });
    setEditingId(row.id);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mapping?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/employee-benefits/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Delete failed');
      }

      toast.success('Mapping deleted successfully');

      // refetch current page; if page is now empty and page>1, go back one page
      await fetchMappingData(page, search, statusFilter);
      if (rows.length === 1 && page > 1) setPage(p => p - 1);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete mapping');
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      benefit_type_id: '',
      is_active: '1',
      amount: '0.00',
      frequency: 'Yearly',
      effective_from: '',
      effective_to: ''
    });
    setEditingId(null);
  };

  const resetFilters = () => {
    setTerm(''); //setSearch('');
    setStatusFilter('All');
    setPage(1);
  };

  // ---- RENDER ----

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center py-10">
          <span className="loading loading-spinner text-primary"></span>
          <p className="mt-2">Loading mappings...</p>
        </div>
      </div>
    );
  }

  const startIndex = rows.length ? (page - 1) * limit + 1 : 0;
  const endIndex   = Math.min(page * limit, total);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employee Benefit Mapping</h1>
          <p className="text-gray-600">Manage employee benefit entitlements and mappings</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" 
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            + Add Mapping
          </button>
          <button 
            className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" 
            onClick={() => setShowGroupModal(true)}
          >
            + Group Mapping
          </button>
        </div>
      </div>

      {/* Search + Filters row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
<input
  className="input input-bordered w-full pl-10"
  placeholder="Search by employee, benefit type, or company..."
  value={term}
  onChange={(e) => {
    setTerm(e.target.value);
    setPage(1);
  }}
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
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Status</span>
              </label>
<select
  className="select select-bordered select-sm w-full"
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(e.target.value as any);
    setPage(1);
  }}
>
  <option value="All">All</option>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
</select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button className="btn btn-sm btn-ghost text-blue-600" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Results info */}
      {total > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          Showing <span className="font-medium">{startIndex}</span> to{' '}
          <span className="font-medium">{endIndex}</span> of{' '}
          <span className="font-medium">{total}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-medium text-gray-700">Employee</th>
                <th className="font-medium text-gray-700">Benefit Type</th>
                <th className="font-medium text-gray-700">Status</th>
                <th className="font-medium text-gray-700">Amount</th>
                <th className="font-medium text-gray-700">Claimed</th>
                <th className="font-medium text-gray-700">Balance</th>
                <th className="font-medium text-gray-700">Frequency</th>
                <th className="font-medium text-gray-700">Effective From</th>
                <th className="font-medium text-gray-700">Effective To</th>
                <th className="font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map(row => (
                  <tr key={row.id}>
                    <td className="font-medium">{row.employee_name}</td>
                    <td>{row.benefit_type}</td>
                    <td>
                      <span className={`badge ${row.is_active ? 'badge-success' : 'badge-ghost'}`}>
                        {row.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>RM {row.amount.toFixed(2)}</td>
                    <td>RM {row.claimed.toFixed(2)}</td>
                    <td className="font-bold text-green-600">
                      RM {!isNaN(row.balance) ? row.balance.toFixed(2) : '0.00'}
                    </td>
                    <td>{row.frequency}</td>
                    <td>{row.effective_from}</td>
                    <td>{row.effective_to}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
                          onClick={() => handleEdit(row)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-500">
                    No mappings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

{/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center mt-4">
    <div className="join">

      {/* First */}
      <button
        className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={page === 1}
        onClick={() => setPage(1)}
      >
        First
      </button>

      {/* Prev */}
      <button
        className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
      >
        «
      </button>

      {/* Page numbers (adaptive, no ellipsis) */}
      {(() => {
        const MAX_VISIBLE = 5;
        let start = 1;
        let end = totalPages;

        if (totalPages > 7) {
          // Center a 5-page window around current page
          start = Math.max(1, page - 2);
          end = Math.min(totalPages, start + (MAX_VISIBLE - 1));
          // If near the end, shift window left so we still show 5 items
          start = Math.max(1, end - (MAX_VISIBLE - 1));
        }

        const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

        return pages.map((p) => (
          <button
            key={p}
            className={`join-item btn btn-sm border border-gray-300
              ${p === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ));
      })()}

      {/* Next */}
      <button
        className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={page === totalPages}
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      >
        »
      </button>

      {/* Last */}
      <button
        className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={page === totalPages}
        onClick={() => setPage(totalPages)}
      >
        Last
      </button>

    </div>
  </div>
)}



      {/* Add/Edit Mapping Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? 'Edit Mapping' : 'Add Mapping'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Employee</span></label>
                  <select 
                    name="employee_id" 
                    value={formData.employee_id} 
                    onChange={handleInputChange} 
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Benefit Type</span></label>
                  <select 
                    name="benefit_type_id" 
                    value={formData.benefit_type_id} 
                    onChange={handleInputChange} 
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Benefit Type</option>
                    {benefitTypes.map(bt => (
                      <option key={bt.id} value={bt.id}>{bt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Amount</span></label>
                  <input 
                    type="number" 
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleInputChange} 
                    placeholder="0.00" 
                    className="input input-bordered w-full" 
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Frequency</span></label>
                  <select 
                    name="frequency" 
                    value={formData.frequency} 
                    onChange={handleInputChange} 
                    className="select select-bordered w-full"
                  >
                    <option value="Yearly">Yearly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Effective From</span></label>
                  <input 
                    type="date" 
                    name="effective_from" 
                    value={formData.effective_from} 
                    onChange={handleInputChange} 
                    className="input input-bordered w-full" 
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Effective To</span></label>
                  <input 
                    type="date" 
                    name="effective_to" 
                    value={formData.effective_to} 
                    onChange={handleInputChange} 
                    className="input input-bordered w-full" 
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Status</span></label>
                <select 
                  name="is_active" 
                  value={formData.is_active} 
                  onChange={handleInputChange} 
                  className="select select-bordered w-full"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button
                className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Mapping Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Group Mapping by Company</h3>
              </div>
              <button onClick={() => setShowGroupModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Company</span></label>
                  <select 
                    name="company_id" 
                    value={groupData.company_id} 
                    onChange={handleGroupChange} 
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Company</option>
                    {companies.map((comp, index) => (
                      <option key={comp.id ? `company-${comp.id}` : `company-fallback-${index}`} value={comp.id}>
                        {comp.name ?? `Unnamed Company ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Benefit Type</span></label>
                  <select 
                    name="benefit_type_id" 
                    value={groupData.benefit_type_id} 
                    onChange={handleGroupChange} 
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Benefit Type</option>
                    {benefitTypes.map((bt) => (
                      <option key={`bt-${bt.id}`} value={bt.id}>{bt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Amount</span></label>
                  <input 
                    name="amount" 
                    type="number" 
                    value={groupData.amount} 
                    onChange={handleGroupChange} 
                    placeholder="0.00" 
                    className="input input-bordered w-full" 
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Frequency</span></label>
                  <select 
                    name="frequency" 
                    value={groupData.frequency} 
                    onChange={handleGroupChange} 
                    className="select select-bordered w-full"
                  >
                    <option value="Yearly">Yearly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Effective From</span></label>
                  <input 
                    type="date" 
                    name="effective_from" 
                    value={groupData.effective_from} 
                    onChange={(e) => setGroupData(prev => ({ ...prev, effective_from: e.target.value }))} 
                    className="input input-bordered w-full" 
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Effective To</span></label>
                  <input 
                    type="date" 
                    name="effective_to" 
                    value={groupData.effective_to} 
                    onChange={(e) => setGroupData(prev => ({ ...prev, effective_to: e.target.value }))} 
                    className="input input-bordered w-full" 
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Status</span></label>
                <select 
                  name="is_active" 
                  value={groupData.is_active} 
                  onChange={handleGroupChange} 
                  className="select select-bordered w-full"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button
                className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => setShowGroupModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={handleGroupSave}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
