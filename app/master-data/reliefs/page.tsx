// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { API_BASE_URL } from '@/app/config';

// // interface Relief {
// //   id: number;
// //   name: string | null;
// //   amount: number;
// // }

// // export default function ReliefPage() {
// //   const [reliefs, setReliefs] = useState<Relief[]>([]);
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [editing, setEditing] = useState<Relief | null>(null);
// //   const [modalOpen, setModalOpen] = useState(false);

// //   const itemsPerPage = 10;

// //   const fetchReliefs = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/reliefs`);
// //       const data = await res.json();
// //       setReliefs(data || []);
// //     } catch {
// //       toast.error('Failed to fetch reliefs');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchReliefs();
// //   }, []);

// //   const filtered = (reliefs || []).filter((r, index, self) =>
// //     index === self.findIndex(obj => obj.id === r.id)
// //   ).filter((r) =>
// //     `${r.name ?? ''}`.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const paginated = filtered.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   );

// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Delete this relief?')) return;
// //     try {
// //       await fetch(`${API_BASE_URL}/api/master-data/reliefs/${id}`, { method: 'DELETE' });
// //       toast.success('Deleted');
// //       fetchReliefs();
// //     } catch {
// //       toast.error('Delete failed');
// //     }
// //   };

// //   const handleSave = async () => {
// //     if (!editing) return;
// //     if (!editing.name || editing.amount === undefined || editing.amount === null) {
// //       toast.error('Name and amount required');
// //       return;
// //     }
// //     const method = editing.id ? 'PUT' : 'POST';
// //     const url = editing.id
// //       ? `${API_BASE_URL}/api/master-data/reliefs/${editing.id}`
// //       : `${API_BASE_URL}/api/master-data/reliefs`;

// //     try {
// //       const res = await fetch(url, {
// //         method,
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(editing),
// //       });
// //       if (!res.ok) throw new Error('Failed');
// //       toast.success('Saved');
// //       setModalOpen(false);
// //       fetchReliefs();
// //     } catch {
// //       toast.error('Save failed');
// //     }
// //   };

// //   return (
// //     <div className="p-4 max-w-5xl mx-auto">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-xl font-bold">Reliefs</h1>
// //         <button
// //           className="btn btn-primary"
// //           onClick={() => {
// //             setEditing({ id: 0, name: '', amount: 0 });
// //             setModalOpen(true);
// //           }}
// //         >
// //           Add Relief
// //         </button>
// //       </div>

// //       <input
// //         className="input input-bordered w-full mb-4"
// //         placeholder="Search by name..."
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
// //       />

// //       <div className="overflow-x-auto">
// //         <table className="table">
// //           <thead>
// //             <tr>
// //               <th>Name</th>
// //               <th>Amount</th>
// //               <th className="text-right">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {paginated.map((r) => (
// //               <tr key={r.id}>
// //                 <td>{r.name || '-'}</td>
// //                 <td>{r.amount}</td>
// //                 <td className="text-right space-x-2">
// //                   <button className="btn btn-sm btn-warning" onClick={() => { setEditing(r); setModalOpen(true); }}>Edit</button>
// //                   <button className="btn btn-sm btn-error" onClick={() => handleDelete(r.id)}>Delete</button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       <div className="mt-4 flex justify-center gap-2">
// //         {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
// //           <button
// //             key={page}
// //             onClick={() => setCurrentPage(page)}
// //             className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
// //           >
// //             {page}
// //           </button>
// //         ))}
// //       </div>

// //       {modalOpen && editing && (
// //         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
// //           <div className="bg-white p-6 rounded shadow w-full max-w-lg">
// //             <h2 className="text-lg font-bold mb-4 text-black">{editing.id ? 'Edit' : 'Add'} Relief</h2>
// //             <div className="grid gap-4">
// //               <input
// //                 className="input input-bordered"
// //                 placeholder="Name"
// //                 value={editing.name ?? ''}
// //                 onChange={(e) => setEditing({ ...editing, name: e.target.value })}
// //               />
// //               <input
// //                 className="input input-bordered"
// //                 type="number"
// //                 placeholder="Amount"
// //                 value={editing.amount}
// //                 onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })}
// //               />
// //               <div className="flex justify-end gap-2">
// //                 <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
// //                 <button className="btn btn-primary" onClick={handleSave}>Save</button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// 'use client';

// import { useEffect, useState } from 'react';
// import { API_BASE_URL } from '@/app/config';
// import { toast } from 'react-hot-toast';

// interface TaxRelief {
//   id: number;
//   name: string;
//   amount: number;
//   created_at: string;
//   updated_at: string;
// }

// export default function TaxReliefListPage() {
//   const [taxReliefs, setTaxReliefs] = useState<TaxRelief[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editing, setEditing] = useState<TaxRelief | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState<Omit<TaxRelief, 'id' | 'created_at' | 'updated_at'>>({
//     name: '',
//     amount: 0,
//   });

//   const itemsPerPage = 10;

//   const fetchTaxReliefs = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/master-data/reliefs`);
//       const data = await res.json();
//       setTaxReliefs(data || []);
//     } catch (err) {
//       toast.error('Failed to fetch tax reliefs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTaxReliefs();
//   }, []);

//   const handleSave = async () => {
//     if (!formData.name) return toast.error('Name is required');

//     const method = editing ? 'PUT' : 'POST';
//     const url = editing
//       ? `${API_BASE_URL}/api/master-data/reliefs/${editing.id}`
//       : `${API_BASE_URL}/api/master-data/reliefs`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           amount: formData.amount ? Number(formData.amount) : null,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to save');
//       }

//       toast.success(`Tax relief ${editing ? 'updated' : 'created'} successfully`);
//       setShowModal(false);
//       setEditing(null);
//       resetForm();
//       fetchTaxReliefs();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to save tax relief');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this tax relief?')) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/master-data/reliefs/${id}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to delete');
//       }

//       toast.success('Tax relief deleted');
//       fetchTaxReliefs();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to delete');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       amount: 0,
//     });
//   };

//   const getTaxReliefType = () => 'General';
//   const getTaxReliefBadgeClass = () => 'badge badge-ghost';

//   const getFilteredTaxReliefs = () => {
//     return taxReliefs.filter((tr) =>
//       tr.name.toLowerCase().includes(search.toLowerCase())
//     );
//   };

//   const filtered = getFilteredTaxReliefs();
//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Tax Reliefs</h1>
//         <button
//           onClick={() => {
//             setEditing(null);
//             resetForm();
//             setShowModal(true);
//           }}
//           className="btn btn-primary"
//         >
//           Add Tax Relief
//         </button>
//       </div>

//       <div className="flex gap-4 mb-4">
//         <input
//           className="input input-bordered flex-1"
//           placeholder="Search tax reliefs..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div className="stat bg-base-100 rounded shadow">
//           <div className="stat-title">Total Tax Reliefs</div>
//           <div className="stat-value text-primary">{taxReliefs.length}</div>
//         </div>
//       </div>

//       <div className="overflow-x-auto bg-base-100 rounded shadow">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Type</th>
//               <th>Amount</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={4} className="text-center py-6">
//                   <span className="loading loading-spinner loading-md"></span>
//                   Loading...
//                 </td>
//               </tr>
//             ) : paged.length === 0 ? (
//               <tr>
//                 <td colSpan={4} className="text-center py-6">
//                   No tax reliefs found.
//                 </td>
//               </tr>
//             ) : (
//               paged.map((tr) => (
//                 <tr key={tr.id}>
//                   <td>{tr.name}</td>
//                   <td>
//                     <span className={getTaxReliefBadgeClass()}>
//                       {getTaxReliefType()}
//                     </span>
//                   </td>
//                   <td>{tr.amount ? `RM ${tr.amount}` : 'N/A'}</td>
//                   <td>
//                     <div className="flex gap-2">
//                       <button
//                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                         //className="btn btn-sm btn-warning"
//                         onClick={() => {
//                           setEditing(tr);
//                           setFormData({
//                             name: tr.name,
//                             amount: tr.amount || 0,
//                           });
//                           setShowModal(true);
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                         //className="btn btn-sm btn-error"
//                         onClick={() => handleDelete(tr.id)}
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
//           <button
//             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//             className="btn btn-sm"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`btn btn-sm ${page === currentPage ? 'btn-primary' : ''}`}
//             >
//               {page}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//             className="btn btn-sm"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6 text-black">
//               {editing ? 'Edit' : 'Create'} Tax Relief
//             </h2>

//             <div className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label className="label">
//                     <span className="label-text text-black font-medium">Name *</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter tax relief name"
//                     className="input input-bordered w-full text-black"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   />
//                 </div>

//                 <div>
//                   <label className="label">
//                     <span className="label-text text-black font-medium">Amount (RM)</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     className="input input-bordered w-full text-black"
//                     value={formData.amount}
//                     onChange={(e) =>
//                       setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
//                     }
//                   />
//                   <div className="label">
//                     <span className="label-text-alt text-gray-500">
//                       Enter maximum relief amount or leave empty for unlimited
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
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
//               <button className="btn btn-primary px-6" onClick={handleSave}>
//                 {editing ? 'Update' : 'Create'} Tax Relief
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';

interface TaxRelief {
  id: number;
  name: string;
  amount: number | null;
  created_at: string;
  updated_at: string;
}

type FormTaxRelief = Omit<TaxRelief, 'id' | 'created_at' | 'updated_at'>;

const itemsPerPage = 10;

// Safe helpers
const safeNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const formatRM = (v: unknown) => `RM ${safeNum(v).toFixed(2)}`;

export default function TaxReliefListPage() {
  const [taxReliefs, setTaxReliefs] = useState<TaxRelief[]>([]);
  const [loading, setLoading] = useState(false);

  // filters/search
  const [search, setSearch] = useState('');

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const setPage = setCurrentPage; // alias for the pager snippet

  // modals
  const [editing, setEditing] = useState<TaxRelief | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TaxRelief | null>(null);
  const [deleting, setDeleting] = useState(false);

  // form
  const [formData, setFormData] = useState<FormTaxRelief>({
    name: '',
    amount: 0,
  });

  const fetchTaxReliefs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/reliefs`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: any[] = await res.json();
      // normalize
      const normalized: TaxRelief[] = (data || []).map((r) => ({
        id: safeNum(r.id) as number,
        name: (r.name ?? '').toString(),
        amount: r.amount == null ? null : safeNum(r.amount),
        created_at: r.created_at ?? '',
        updated_at: r.updated_at ?? '',
      }));
      setTaxReliefs(normalized);
    } catch (err) {
      toast.error('Failed to fetch tax reliefs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxReliefs();
  }, []);

  const resetForm = () => setFormData({ name: '', amount: 0 });

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return taxReliefs;
    return taxReliefs.filter((tr) => tr.name.toLowerCase().includes(s));
  }, [taxReliefs, search]);

  // paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // summary
  const total = taxReliefs.length;
  const withAmount = taxReliefs.filter((t) => t.amount != null && safeNum(t.amount) > 0).length;
  const maxAmount = taxReliefs.length
    ? Math.max(...taxReliefs.map((t) => (t.amount == null ? 0 : safeNum(t.amount))))
    : 0;

  const handleSave = async () => {
    if (!formData.name?.trim()) return toast.error('Name is required');

    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API_BASE_URL}/api/master-data/reliefs/${editing.id}`
      : `${API_BASE_URL}/api/master-data/reliefs`;

    try {
      const payload: FormTaxRelief = {
        name: formData.name.trim(),
        amount:
          formData.amount === null || formData.amount === undefined
            ? null
            : safeNum(formData.amount),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save');
      }

      toast.success(`Tax relief ${editing ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchTaxReliefs();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save tax relief');
    }
  };

  const askDelete = (tr: TaxRelief) => {
    setDeleteTarget(tr);
    setShowDelete(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/reliefs/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete');
      }
      toast.success('Tax relief deleted');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchTaxReliefs();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Tax Reliefs</h1>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Tax Relief
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder="Search tax reliefs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Summary cards (consistent with other pages) */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
        {/* <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">With Amount</div>
          <div className="stat-value text-sm">{withAmount}</div>
        </div> */}
        {/* <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Max Amount</div>
          <div className="stat-value text-sm">{formatRM(maxAmount)}</div>
        </div> */}
        {/* <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Search Term</div>
          <div className="stat-value text-sm">{search ? search : '-'}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Per Page</div>
          <div className="stat-value text-sm">{itemsPerPage}</div>
        </div> */}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto bg-base-100 rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6">
                    <span className="loading loading-spinner loading-md"></span> Loading...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6">No tax reliefs found.</td>
                </tr>
              ) : (
                paged.map((tr) => (
                  <tr key={tr.id}>
                    <td className="align-top">{tr.name}</td>
                    <td className="align-top">
                      <span className="badge bg-blue-600 text-white">General</span>
                    </td>
                    <td className="align-top whitespace-nowrap">
                      {tr.amount == null ? 'N/A' : formatRM(tr.amount)}
                    </td>
                    <td className="align-top">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => {
                            setEditing(tr);
                            setFormData({
                              name: tr.name,
                              amount: tr.amount ?? 0,
                            });
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => askDelete(tr)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-6 bg-base-100 rounded shadow text-center">Loading…</div>
        ) : paged.length === 0 ? (
          <div className="p-6 bg-base-100 rounded shadow text-center">No tax reliefs found.</div>
        ) : (
          paged.map((tr) => (
            <div key={tr.id} className="bg-base-100 rounded shadow p-4">
              <div className="flex items-start justify-between">
                <div className="font-semibold">{tr.name}</div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      setEditing(tr);
                      setFormData({ name: tr.name, amount: tr.amount ?? 0 });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => askDelete(tr)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Type</div>
                <div><span className="badge bg-blue-600 text-white">General</span></div>

                <div className="text-gray-500">Amount</div>
                <div>{tr.amount == null ? 'N/A' : formatRM(tr.amount)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (First/Prev/Adaptive/Next/Last) */}
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
                start = Math.max(1, page - 2);
                end = Math.min(totalPages, start + (MAX_VISIBLE - 1));
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

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {editing ? 'Edit' : 'Create'} Tax Relief
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tax relief name"
                    className="input input-bordered w-full text-black"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Amount (RM)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full text-black"
                    value={formData.amount ?? 0}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData({ ...formData, amount: v === '' ? null : safeNum(v) });
                    }}
                  />
                  <div className="label">
                    <span className="label-text-alt text-gray-500">
                      Enter maximum relief amount or leave empty for unlimited
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button className="btn bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>
                {editing ? 'Update' : 'Create'} Tax Relief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDelete && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Delete Tax Relief</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>?
              </p>
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                className="btn"
                onClick={() => {
                  setShowDelete(false);
                  setDeleteTarget(null);
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={doDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
