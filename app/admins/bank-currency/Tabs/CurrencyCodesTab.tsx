// ----------------------------------------------------------------------
// File: app/admins/bank-currency/Tabs/CurrencyCodesTab.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config';

interface CurrencyCode {
  id: number;
  code: string;
  name: string;
  status: 'Active' | 'Inactive';
}

const PAGE_SIZE = 10;

export default function CurrencyCodesTab() {
  const [rows, setRows] = useState<CurrencyCode[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Confirm delete modal (same UX as BanksTab)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<CurrencyCode | null>(null);

  // Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CurrencyCode>({ id: 0, code: '', name: '', status: 'Active' });

  // Code validation UX
  const [codeTouched, setCodeTouched] = useState(false);
  const isCodeValid = form.code.length === 3; // already sanitized to letters-only + max 3

  // Fetch
  const fetchRows = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/currencies`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load currency codes');
    }
  };

  useEffect(() => { fetchRows(); }, []);

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r =>
      (!q || r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || r.status === statusFilter)
    );
  }, [rows, search, statusFilter]);

  // Results info + paging helpers (same pattern as BanksTab)
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
    setForm({ id: 0, code: '', name: '', status: 'Active' });
    setCodeTouched(false);
    setShowModal(true);
  };

  const openEdit = (r: CurrencyCode) => {
    setEditingId(r.id);
    // sanitize existing incoming code to uppercase/letters-only/max-3 just in case
    const cleaned = (r.code || '').toString().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    setForm({ ...r, code: cleaned });
    setCodeTouched(false);
    setShowModal(true);
  };

  const save = async () => {
    if (!isCodeValid) {
      setCodeTouched(true);
      toast.error('Code must be exactly 3 letters (A–Z).');
      return;
    }
    try {
      const url = editingId
        ? `${API_BASE_URL}/api/bank-currency/currencies/${editingId}`
        : `${API_BASE_URL}/api/bank-currency/currencies`;
      const method = editingId ? 'PUT' : 'POST';
      const body = JSON.stringify({ code: form.code, name: form.name, status: form.status });
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
      if (!res.ok) throw new Error('Save failed');

      toast.success(editingId ? 'Currency code updated' : 'Currency code created');
      setShowModal(false);
      await fetchRows();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    }
  };

  // Confirm deletion flow (same UX as BanksTab)
  const openConfirmDelete = (row: CurrencyCode) => {
    setToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bank-currency/currencies/${toDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      toast.success(`Deleted "${toDelete.code}"`);
      setConfirmOpen(false);
      setToDelete(null);
      await fetchRows();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  // CSV import/export (wired into the header actions)
  const exportCsv = () => {
    const csv = ['Code,Name,Status', ...rows.map(r => `${r.code},${r.name},${r.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'currency-codes.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (file: File) => {
    try {
      const text = await file.text();
      const [header, ...lines] = text.split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        const [codeRaw, nameRaw, statusRaw] = line.split(',');
        const cleaned = (codeRaw || '')
          .toUpperCase()
          .replace(/[^A-Z]/g, '')
          .slice(0, 3);
        if (cleaned.length !== 3) continue; // skip invalid
        await fetch(`${API_BASE_URL}/api/bank-currency/currencies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: cleaned,
            name: (nameRaw || '').trim(),
            status: ((statusRaw || '').trim() as 'Active' | 'Inactive') || 'Active',
          }),
        });
      }
      toast.success('CSV imported');
      await fetchRows();
    } catch {
      toast.error('Failed to import CSV');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPage(1);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Currency Codes</h1>
          <p className="text-gray-600">Manage currency codes and their details</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Import */}
          {/* <label className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100">
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => e.target.files && importCsv(e.target.files[0])}
            />
          </label> */}
          {/* Export */}
          {/* <button className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100" onClick={exportCsv}>
            Export CSV
          </button> */}
          {/* Add */}
          <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={openCreate}>
            + Add Currency Code
          </button>
        </div>
      </div>

      {/* Search + Filters row (matches BanksTab) */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search by code or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search currency codes"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-md 
                     hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="cc-filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div id="cc-filters" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
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

      {/* Results info (same behavior as BanksTab) */}
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
                <th><h1 className="font-medium text-gray-700">Code</h1></th>
                <th className="font-medium text-gray-700">Name</th>
                <th className="font-medium text-gray-700">Status</th>
                <th className="font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? (
                pageItems.map(r => (
                  <tr key={r.id}>
                    <td className="font-mono font-medium">{r.code}</td>
                    <td className="font-medium">{r.name}</td>
                    <td>
                      <span className={`badge ${r.status === 'Active' ? 'badge-success' : 'badge-ghost'}`}>
                        {r.status}
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
                    No currency codes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (same style as BanksTab) */}
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

      {/* Add/Edit Modal (same UX shell as BanksTab) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                {/* Currency icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v2m0 8v2m-7 2h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? 'Edit Currency Code' : 'Add Currency Code'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Code with validation UI */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Code</span>
                    <span className={`text-xs ${isCodeValid ? 'text-gray-400' : 'text-red-500'}`}>
                      {form.code.length}/3
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      className={`input input-bordered w-full pr-16 ${codeTouched && !isCodeValid ? 'input-error' : ''}`}
                      placeholder="e.g., MYR"
                      value={form.code}
                      onChange={(e) => {
                        const next = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z]/g, '')
                          .slice(0, 3);
                        setForm({ ...form, code: next });
                      }}
                      onBlur={() => setCodeTouched(true)}
                      aria-invalid={codeTouched && !isCodeValid}
                      aria-describedby="code-help"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">3 letters</span>
                    </div>
                  </div>

                  <div id="code-help" className="mt-1 text-xs">
                    {codeTouched && !isCodeValid ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.594c.75 1.335-.213 2.992-1.743 2.992H3.482c-1.53 0-2.493-1.657-1.743-2.992L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z" clipRule="evenodd" />
                        </svg>
                        Code must be exactly 3 letters (A–Z).
                      </span>
                    ) : (
                      <span className="text-gray-500">Use 3-letter code (e.g., MYR).</span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Name</span></label>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Malaysian Ringgit"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Status</span></label>
                <select
                  className="select select-bordered w-full"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as any })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                className={`btn ${isCodeValid ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' : 'btn-disabled'}`}
                onClick={save}
                disabled={!isCodeValid}
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal (same as BanksTab style) */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>

            {/* Body */}
            <div className="px-6 py-5 text-gray-700 space-y-3">
              <p>
                Are you sure you want to delete{' '}
                <span className="font-semibold">{toDelete?.code}</span>?
                This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
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
