// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';

// interface DisciplinaryType {
//   id: number;
//   name: string;
//   description: string;
//   created_by: number | null;
//   updated_by: number | null;
//   created_at: string;
//   updated_at: string;
// }

// export default function DisciplinaryTypesPage() {
//   const [types, setTypes] = useState<DisciplinaryType[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editing, setEditing] = useState<DisciplinaryType | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState<Omit<DisciplinaryType, 'id' | 'created_at' | 'updated_at'>>({
//     name: '',
//     description: '',
//     created_by: 1,
//     updated_by: 1,
//   });

//   const itemsPerPage = 10;

//   const fetchTypes = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/disciplinary-types`);
//       const data = await res.json();
//       setTypes(data || []);
//     } catch (err) {
//       toast.error('Failed to fetch types');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTypes();
//   }, []);

//   const handleSave = async () => {
//     if (!formData.name) return toast.error('Name is required');

//     const method = editing ? 'PUT' : 'POST';
//     const url = editing
//       ? `${API_BASE_URL}/api/disciplinary-types/${editing.id}`
//       : `${API_BASE_URL}/api/disciplinary-types`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error((await res.json()).error || 'Save failed');

//       toast.success(`Type ${editing ? 'updated' : 'created'} successfully`);
//       setShowModal(false);
//       setEditing(null);
//       resetForm();
//       fetchTypes();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to save type');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this disciplinary type?')) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/disciplinary-types/${id}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');

//       toast.success('Deleted successfully');
//       fetchTypes();
//     } catch (err: any) {
//       toast.error(err.message || 'Delete failed');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       created_by: 1,
//       updated_by: 1,
//     });
//   };

//   const filtered = types.filter((t) =>
//     t.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Disciplinary Types</h1>
//         <button
//           className="btn btn-info"
//           onClick={() => {
//             setEditing(null);
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           Add Type
//         </button>
//       </div>

//       <div className="mb-4">
//         <input
//           className="input input-bordered w-full"
//           placeholder="Search types..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       </div>

//       <div className="overflow-x-auto bg-base-100 rounded shadow">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Description</th>
//               <th>Created</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={4} className="text-center py-6">Loading...</td></tr>
//             ) : paged.length === 0 ? (
//               <tr><td colSpan={4} className="text-center py-6">No data found</td></tr>
//             ) : (
//               paged.map((type) => (
//                 <tr key={type.id}>
//                   <td>{type.name}</td>
//                   <td>{type.description}</td>
//                   <td>{new Date(type.created_at).toLocaleDateString()}</td>
//                   <td>
//                     <div className="flex gap-2">
//                       <button
//                         className="btn btn-sm btn-info"
//                         onClick={() => {
//                           setEditing(type);
//                           setFormData({
//                             name: type.name,
//                             description: type.description,
//                             created_by: type.created_by || 1,
//                             updated_by: 1,
//                           });
//                           setShowModal(true);
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-sm btn-info"
//                         onClick={() => handleDelete(type.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <div className="mt-4 flex justify-center gap-2">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               className={`btn btn-sm ${page === currentPage ? 'btn-primary' : ''}`}
//               onClick={() => setCurrentPage(page)}
//             >
//               {page}
//             </button>
//           ))}
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-2xl">
//             <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit' : 'Create'} Disciplinary Type</h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="label text-black font-medium">Name *</label>
//                 <input
//                   type="text"
//                   className="input input-bordered w-full"
//                   placeholder="Enter type name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <label className="label text-black font-medium">Description</label>
//                 <textarea
//                   className="textarea textarea-bordered w-full"
//                   placeholder="Enter description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowModal(false);
//                   setEditing(null);
//                   resetForm();
//                 }}
//               >
//                 Cancel
//               </button>
//               <button className="btn btn-info" onClick={handleSave}>
//                 {editing ? 'Update' : 'Create'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

interface DisciplinaryType {
  id: number;
  name: string;
  description: string;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

type SortOrder = 'desc' | 'asc';
const PAGE_SIZE = 10;

export default function DisciplinaryTypesPage() {
  const [rows, setRows] = useState<DisciplinaryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Search + filters + sort
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Paging
  const [page, setPage] = useState(1);

  // Confirm delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DisciplinaryType | null>(null);

  // Modal (add/edit)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  const fetchRows = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/disciplinary-types`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load disciplinary types');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? rows.filter((r) => {
          const n = r.name?.toLowerCase() || '';
          const d = r.description?.toLowerCase() || '';
          return n.includes(q) || d.includes(q);
        })
      : rows.slice();

    base.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? db - da : da - db;
    });

    return base;
  }, [rows, search, sortOrder]);

  // Results info + paging
  const totalRecords = rows.length;
  const filteredCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );
  const startIndex = filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(page * PAGE_SIZE, filteredCount);
  const isFiltered = search.trim() !== '' || sortOrder !== 'desc';

  // Handlers
  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (r: DisciplinaryType) => {
    setEditingId(r.id);
    setForm({ name: r.name || '', description: r.description || '' });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      ...(editingId
        ? { updated_by: 1 }
        : { created_by: 1, updated_by: 1 }),
    };

    try {
      const url = editingId
        ? `${API_BASE_URL}/api/disciplinary-types/${editingId}`
        : `${API_BASE_URL}/api/disciplinary-types`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Save failed');
      }

      toast.success(editingId ? 'Disciplinary type updated' : 'Disciplinary type created');
      setShowModal(false);
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.message || 'Save failed');
    }
  };

  const openConfirmDelete = (row: DisciplinaryType) => {
    setToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/disciplinary-types/${toDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Delete failed');
      }
      toast.success(`Deleted "${toDelete.name}"`);
      setConfirmOpen(false);
      setToDelete(null);
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.message || 'Delete failed');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSortOrder('desc');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center py-10">
          <span className="loading loading-spinner text-primary"></span>
          <p className="mt-2">Loading disciplinary types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Disciplinary Types</h1>
          <p className="text-gray-600">Manage disciplinary type names and descriptions</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
            onClick={openCreate}
          >
            + Add Disciplinary Type
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
            onChange={(e) => {
              setSearch(e.target.value);
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
          onClick={() => setShowFilters((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Filters panel (Sort only, to mirror BenefitType UX) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Sort by Created</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
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
                <th className="font-medium text-gray-700">Created</th>
                <th className="font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? (
                pageItems.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.name}</td>
                    <td>{r.description}</td>
                    <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
                          onClick={() => openEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
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
                    No disciplinary types found
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
                  {editingId ? 'Edit Disciplinary Type' : 'Add Disciplinary Type'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="e.g., Misconduct"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Description of the disciplinary type..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
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
              <button className="btn btn-error text-white" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
