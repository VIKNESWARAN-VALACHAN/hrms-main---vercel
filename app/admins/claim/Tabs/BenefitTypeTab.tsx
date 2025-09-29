'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface BenefitType {
  id: number;
  name: string;
  description: string;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

const PAGE_SIZE = 10;

export default function BenefitTypeTab() {
  const [rows, setRows] = useState<BenefitType[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Confirm delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<BenefitType | null>(null);

  // Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BenefitType>({ 
    id: 0, 
    name: '', 
    description: '', 
    is_active: 1 
  });

  // Fetch benefit types
  const fetchRows = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/benefits`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load benefit types');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRows(); 
  }, []);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      const matchesSearch = !q || 
        r.name.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter === 'Active' && r.is_active === 1) ||
        (statusFilter === 'Inactive' && r.is_active === 0);
      
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  // Results info + paging helpers
  const totalRecords = rows.length;
  const filteredCount = filtered.length;
  const isFiltered = useMemo(
    () => search.trim() !== '' || statusFilter !== 'All',
    [search, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const startIndex = filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(page * PAGE_SIZE, filteredCount);

  // Handlers
  const openCreate = () => {
    setEditingId(null);
    setForm({ id: 0, name: '', description: '', is_active: 1 });
    setShowModal(true);
  };

  const openEdit = (r: BenefitType) => {
    setEditingId(r.id);
    setForm({ ...r });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required.');
      return;
    }

    try {
      const url = editingId
        ? `${API_BASE_URL}/api/benefits/${editingId}`
        : `${API_BASE_URL}/api/benefits`;
      const method = editingId ? 'PUT' : 'POST';
      const body = JSON.stringify({ 
        name: form.name.trim(), 
        description: form.description.trim(), 
        is_active: form.is_active 
      });
      
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body 
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Save failed');
      }

      toast.success(editingId ? 'Benefit type updated' : 'Benefit type created');
      setShowModal(false);
      await fetchRows();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    }
  };

  // Confirm deletion flow
  const openConfirmDelete = (row: BenefitType) => {
    setToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/benefits/${toDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Delete failed');
      }

      toast.success(`Deleted "${toDelete.name}"`);
      setConfirmOpen(false);
      setToDelete(null);
      await fetchRows();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center py-10">
          <span className="loading loading-spinner text-primary"></span>
          <p className="mt-2">Loading benefit types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Benefit Types</h1>
          <p className="text-gray-600">Manage benefit types and their details</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" 
            onClick={openCreate}
          >
            + Add Benefit Type
          </button>
        </div>
      </div>

      {/* Search + Filters row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
                onChange={(e) => setStatusFilter(e.target.value as any)}
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
      {filteredCount > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          {isFiltered ? (
            <>
              Showing <span className="font-medium">{filteredCount}</span> of{' '}
              <span className="font-medium">{totalRecords}</span>{' '}
              <span className="text-gray-500">(filtered)</span>
            </>
          ) : (
            <>
              Showing <span className="font-medium">{startIndex}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{totalRecords}</span>
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-medium text-gray-700">Name</th>
                <th className="font-medium text-gray-700">Description</th>
                <th className="font-medium text-gray-700">Status</th>
                <th className="font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? (
                pageItems.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.name}</td>
                    <td>{r.description}</td>
                    <td>
                      <span className={`badge ${r.is_active ? 'badge-success' : 'badge-ghost'}`}>
                        {r.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
                          onClick={() => openEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => openConfirmDelete(r)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No benefit types found
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
            <button
              className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              First
            </button>

            <button
              className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
            ))}

            <button
              className="join-item btn btn-sm border border-gray-300 bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              »
            </button>

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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? 'Edit Benefit Type' : 'Add Benefit Type'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Name</span></label>
                <input
                  className="input input-bordered w-full"
                  placeholder="e.g., Medical Benefits"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Description</span></label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Description of the benefit type..."
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Status</span></label>
                <select
                  className="select select-bordered w-full"
                  value={form.is_active}
                  onChange={e => setForm({ ...form, is_active: parseInt(e.target.value) })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
              <button
                className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={save}
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>

            <div className="px-6 py-5 text-gray-700 space-y-3">
              <p>
                Are you sure you want to delete{' '}
                <span className="font-semibold">{toDelete?.name}</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                className="btn btn-outline"
                onClick={() => { setConfirmOpen(false); setToDelete(null); }}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}