
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { API_BASE_URL } from '../../config';

// // interface EisSlab {
// //   id: number;
// //   salary_from: number;
// //   salary_to: number;
// //   employee_fixed_amount: number;
// //   employer_fixed_amount: number;
// // }

// // export default function EisPage() {
// //   const [eis, setEis] = useState<EisSlab[]>([]);
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [showModal, setShowModal] = useState(false);
// //   const [editId, setEditId] = useState<number | null>(null);
// //   const [form, setForm] = useState<Partial<EisSlab>>({ salary_from: 0, salary_to: 0, employee_fixed_amount: 0, employer_fixed_amount: 0 });

// //   const fetchEis = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/eis`);
// //       const data = await res.json();
// //       setEis(data || []);
// //     } catch {
// //       toast.error('Failed to load EIS records');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { fetchEis(); }, []);

// //   const handleEdit = (slab: EisSlab) => {
// //     setForm(slab);
// //     setEditId(slab.id);
// //     setShowModal(true);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Delete this EIS entry?')) return;
// //     try {
// //       await fetch(`${API_BASE_URL}/api/master-data/eis/${id}`, { method: 'DELETE' });
// //       toast.success('Deleted successfully');
// //       fetchEis();
// //     } catch {
// //       toast.error('Failed to delete');
// //     }
// //   };

// //   const filtered = eis.filter(item =>
// //     String(item.salary_from).includes(search) ||
// //     String(item.salary_to).includes(search)
// //   );

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-2xl font-bold">EIS Contribution Table</h1>
// //         <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditId(null); setForm({ salary_from: 0, salary_to: 0, employee_fixed_amount: 0, employer_fixed_amount: 0 }); }}>
// //           + Add EIS Row
// //         </button>
// //       </div>

// //       <input
// //         type="text"
// //         placeholder="Search by salary..."
// //         className="input input-bordered w-full mb-4"
// //         value={search}
// //         onChange={e => setSearch(e.target.value)}
// //       />

// //       {loading ? (
// //         <div className="text-center">Loading...</div>
// //       ) : (
// //         <div className="overflow-x-auto">
// //           <table className="table w-full">
// //             <thead>
// //               <tr>
// //                 <th>Salary From</th>
// //                 <th>Salary To</th>
// //                 <th>Employee Amount</th>
// //                 <th>Employer Amount</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filtered.map(item => (
// //                 <tr key={item.id}>
// //                   <td>{item.salary_from}</td>
// //                   <td>{item.salary_to}</td>
// //                   <td>{item.employee_fixed_amount}</td>
// //                   <td>{item.employer_fixed_amount}</td>
// //                   <td>
// //                     <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEdit(item)}>Edit</button>
// //                     <button className="btn btn-sm btn-error" onClick={() => handleDelete(item.id)}>Delete</button>
// //                   </td>
// //                 </tr>
// //               ))}
// //               {!filtered.length && (
// //                 <tr>
// //                   <td colSpan={5} className="text-center">No records found</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {showModal && (
// //         <EisModal
// //           form={form}
// //           setForm={setForm}
// //           onClose={() => { setShowModal(false); setEditId(null); }}
// //           onSave={async () => {
// //             try {
// //               const method = editId ? 'PUT' : 'POST';
// //               const url = editId
// //                 ? `${API_BASE_URL}/api/master-data/eis/${editId}`
// //                 : `${API_BASE_URL}/api/master-data/eis`;
// //               const res = await fetch(url, {
// //                 method,
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({
// //                   salary_from: form.salary_from,
// //                   salary_to: form.salary_to,
// //                   employee_fixed_amount: form.employee_fixed_amount,
// //                   employer_fixed_amount: form.employer_fixed_amount,
// //                 }),
// //               });
// //               if (!res.ok) throw new Error();
// //               toast.success(`EIS ${editId ? 'updated' : 'created'}`);
// //               setShowModal(false);
// //               setForm({ salary_from: 0, salary_to: 0, employee_fixed_amount: 0, employer_fixed_amount: 0 });
// //               setEditId(null);
// //               fetchEis();
// //             } catch {
// //               toast.error('Failed to save');
// //             }
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // function EisModal({ form, setForm, onClose, onSave }: any) {
// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
// //       <div className="bg-white p-6 rounded shadow w-full max-w-md">
// //         <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-200 text-blue-900 text-sm">
// //           <b className="text-blue-800">About EIS Contributions:</b>
// //           <div className="mt-1">
// //             For most employees, EIS rates are fixed amounts based on salary slab.<br />
// //             Reference: <a href="https://www.perkeso.gov.my/en/eis/" target="_blank" rel="noopener" className="underline text-blue-700">SOCSO EIS Portal</a>
// //           </div>
// //         </div>
// //         <input
// //           type="number"
// //           placeholder="Salary From"
// //           className="input input-bordered w-full mb-2"
// //           value={form.salary_from || ''}
// //           onChange={e => setForm((f: any) => ({ ...f, salary_from: parseFloat(e.target.value) }))}
// //         />
// //         <input
// //           type="number"
// //           placeholder="Salary To"
// //           className="input input-bordered w-full mb-2"
// //           value={form.salary_to || ''}
// //           onChange={e => setForm((f: any) => ({ ...f, salary_to: parseFloat(e.target.value) }))}
// //         />
// //         <input
// //           type="number"
// //           step="0.01"
// //           placeholder="Employee Amount"
// //           className="input input-bordered w-full mb-2"
// //           value={form.employee_fixed_amount || ''}
// //           onChange={e => setForm((f: any) => ({ ...f, employee_fixed_amount: parseFloat(e.target.value) }))}
// //         />
// //         <input
// //           type="number"
// //           step="0.01"
// //           placeholder="Employer Amount"
// //           className="input input-bordered w-full mb-4"
// //           value={form.employer_fixed_amount || ''}
// //           onChange={e => setForm((f: any) => ({ ...f, employer_fixed_amount: parseFloat(e.target.value) }))}
// //         />
// //         <div className="flex justify-end gap-2">
// //           <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
// //           <button className="btn btn-primary" onClick={onSave}>Save</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';

// interface EisSlab {
//   id: number;
//   salary_from: number;
//   salary_to: number;
//   employee_fixed_amount: number;
//   employer_fixed_amount: number;
// }

// export default function EisPage() {
//   const [eis, setEis] = useState<EisSlab[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form, setForm] = useState<Partial<EisSlab>>({ salary_from: 0, salary_to: 0, employee_fixed_amount: 0, employer_fixed_amount: 0 });
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const fetchEis = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/master-data/eis`);
//       const data = await res.json();
//       setEis(data || []);
//     } catch {
//       toast.error('Failed to load EIS records');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchEis(); }, []);

//   const handleEdit = (slab: EisSlab) => {
//     setForm(slab);
//     setEditId(slab.id);
//     setShowModal(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Delete this EIS entry?')) return;
//     try {
//       await fetch(`${API_BASE_URL}/api/master-data/eis/${id}`, { method: 'DELETE' });
//       toast.success('Deleted successfully');
//       fetchEis();
//     } catch {
//       toast.error('Failed to delete');
//     }
//   };

//   const filtered = eis.filter(item =>
//     String(item.salary_from).includes(search) ||
//     String(item.salary_to).includes(search)
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">EIS Contribution Table</h1>
//         <button className="btn btn-primary" onClick={() => {
//           setShowModal(true);
//           setEditId(null);
//           setForm({ salary_from: 0, salary_to: 0, employee_fixed_amount: 0, employer_fixed_amount: 0 });
//         }}>
//           + Add EIS Row
//         </button>
//       </div>

//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by salary..."
//           className="input input-bordered flex-1"
//           value={search}
//           onChange={e => {
//             setSearch(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       </div>

//       <div className="overflow-x-auto bg-base-100 rounded shadow">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Salary From</th>
//               <th>Salary To</th>
//               <th>Employee Amount</th>
//               <th>Employer Amount</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-6">
//                   <span className="loading loading-spinner loading-md"></span> Loading...
//                 </td>
//               </tr>
//             ) : paginated.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-6">No records found</td>
//               </tr>
//             ) : (
//               paginated.map(item => (
//                 <tr key={item.id}>
//                   <td>{item.salary_from}</td>
//                   <td>{item.salary_to}</td>
//                   <td>{item.employee_fixed_amount}</td>
//                   <td>{item.employer_fixed_amount}</td>
//                   <td>
//                     <div className="flex gap-2">

//                       <button 
//                       className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                       //className="btn btn-sm btn-warning" 
//                       onClick={() => handleEdit(item)}>Edit</button>
//                       <button 
//                       className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                       //className="btn btn-sm btn-error" 
//                       onClick={() => handleDelete(item.id)}>Delete</button>
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
//               className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
//               onClick={() => setCurrentPage(page)}
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
//         <EisModal
//           form={form}
//           setForm={setForm}
//           onClose={() => {
//             setShowModal(false);
//             setEditId(null);
//           }}
//           onSave={async () => {
//             try {
//               const method = editId ? 'PUT' : 'POST';
//               const url = editId
//                 ? `${API_BASE_URL}/api/master-data/eis/${editId}`
//                 : `${API_BASE_URL}/api/master-data/eis`;

//               const res = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                   salary_from: form.salary_from,
//                   salary_to: form.salary_to,
//                   employee_fixed_amount: form.employee_fixed_amount,
//                   employer_fixed_amount: form.employer_fixed_amount,
//                 }),
//               });

//               if (!res.ok) throw new Error();
//               toast.success(`EIS ${editId ? 'updated' : 'created'}`);
//               setShowModal(false);
//               setForm({ salary_from: 0, salary_to: 0, employee_fixed_amount: 0, employer_fixed_amount: 0 });
//               setEditId(null);
//               fetchEis();
//             } catch {
//               toast.error('Failed to save');
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// }

// function EisModal({ form, setForm, onClose, onSave }: any) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-6 text-black">EIS Entry</h2>

//         <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-200 text-blue-900 text-sm">
//           <b className="text-blue-800">About EIS Contributions:</b>
//           <div className="mt-1">
//             For most employees, EIS rates are fixed amounts based on salary slab.<br />
//             Reference: <a href="https://www.perkeso.gov.my/en/eis/" target="_blank" rel="noopener" className="underline text-blue-700">SOCSO EIS Portal</a>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {[
//             { label: 'Salary From', field: 'salary_from' },
//             { label: 'Salary To', field: 'salary_to' },
//             { label: 'Employee Fixed Amount', field: 'employee_fixed_amount' },
//             { label: 'Employer Fixed Amount', field: 'employer_fixed_amount' },
//           ].map(({ label, field }) => (
//             <div key={field}>
//               <label className="label">
//                 <span className="label-text text-black font-medium">{label}</span>
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 placeholder={label}
//                 className="input input-bordered w-full text-black"
//                 value={form[field] ?? ''}
//                 onChange={(e) => setForm((prev: any) => ({
//                   ...prev,
//                   [field]: parseFloat(e.target.value) || 0
//                 }))}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
//           <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
//           <button className="btn btn-primary px-6" onClick={onSave}>Save</button>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

interface EisSlab {
  id: number;
  salary_from: number;
  salary_to: number;
  employee_fixed_amount: number;
  employer_fixed_amount: number;
}

type FormEis = Omit<EisSlab, 'id'>;

const itemsPerPage = 10;

// Helpers
const safeNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const formatRM = (v: unknown) => `RM ${safeNum(v).toFixed(2)}`;

export default function EisPage() {
  const [rows, setRows] = useState<EisSlab[]>([]);
  const [loading, setLoading] = useState(false);

  // search
  const [search, setSearch] = useState('');

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const setPage = setCurrentPage;

  // modal: create/edit
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EisSlab | null>(null);

  // delete confirm modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EisSlab | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<FormEis>({
    salary_from: 0,
    salary_to: 0,
    employee_fixed_amount: 0,
    employer_fixed_amount: 0,
  });

  // Fetch + normalize
  const fetchEis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/eis`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: any[] = await res.json();
      const normalized: EisSlab[] = (data || []).map((r) => ({
        id: safeNum(r.id) as number,
        salary_from: safeNum(r.salary_from),
        salary_to: safeNum(r.salary_to),
        employee_fixed_amount: safeNum(r.employee_fixed_amount),
        employer_fixed_amount: safeNum(r.employer_fixed_amount),
      }));
      setRows(normalized);
    } catch {
      toast.error('Failed to load EIS records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEis();
  }, []);

  const resetForm = () => {
    setForm({
      salary_from: 0,
      salary_to: 0,
      employee_fixed_amount: 0,
      employer_fixed_amount: 0,
    });
    setEditing(null);
  };

  const handleEdit = (slab: EisSlab) => {
    setEditing(slab);
    setForm({
      salary_from: safeNum(slab.salary_from),
      salary_to: safeNum(slab.salary_to),
      employee_fixed_amount: safeNum(slab.employee_fixed_amount),
      employer_fixed_amount: safeNum(slab.employer_fixed_amount),
    });
    setShowModal(true);
  };

  // Delete flow
  const askDelete = (slab: EisSlab) => {
    setDeleteTarget(slab);
    setShowDelete(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/eis/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('EIS row deleted');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchEis();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  // Filter
  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return rows;
    return rows.filter((item) =>
      `${item.salary_from}-${item.salary_to}`.toLowerCase().includes(s) ||
      String(item.employee_fixed_amount).includes(s) ||
      String(item.employer_fixed_amount).includes(s)
    );
  }, [rows, search]);

  // Paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Summary
  const total = rows.length;
  const maxTo = rows.length ? Math.max(...rows.map(r => safeNum(r.salary_to))) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">EIS Contribution Table</h1>
        <button
          className="btn bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
        >
          Add EIS Row
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by salary range or amount…"
          className="input input-bordered flex-1"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total Rows</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
        {/* <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Max Salary To</div>
          <div className="stat-value text-sm">{formatRM(maxTo)}</div>
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
                <th>Salary From</th>
                <th>Salary To</th>
                <th>Employee Amount</th>
                <th>Employer Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    <span className="loading loading-spinner loading-md"></span> Loading...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">No records found</td>
                </tr>
              ) : (
                paged.map((item) => (
                  <tr key={item.id}>
                    <td className="align-top whitespace-nowrap">{formatRM(item.salary_from)}</td>
                    <td className="align-top whitespace-nowrap">{formatRM(item.salary_to)}</td>
                    <td className="align-top whitespace-nowrap">{formatRM(item.employee_fixed_amount)}</td>
                    <td className="align-top whitespace-nowrap">{formatRM(item.employer_fixed_amount)}</td>
                    <td className="align-top">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => askDelete(item)}
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
          <div className="p-6 bg-base-100 rounded shadow text-center">No records found</div>
        ) : (
          paged.map((item) => (
            <div key={item.id} className="bg-base-100 rounded shadow p-4">
              <div className="flex items-start justify-between">
                <div className="font-semibold">
                  {formatRM(item.salary_from)} – {formatRM(item.salary_to)}
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700" onClick={() => askDelete(item)}>
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Employee</div>
                <div>{formatRM(item.employee_fixed_amount)}</div>

                <div className="text-gray-500">Employer</div>
                <div>{formatRM(item.employer_fixed_amount)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination: First / Prev / adaptive numbers / Next / Last */}
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  className={`join-item btn btn-sm border border-gray-300 ${
                    p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Create/Edit modal (WIDE) */}
      {showModal && (
        <EisModal
          form={form}
          setForm={setForm}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          onSave={async () => {
            try {
              if (safeNum(form.salary_from) > safeNum(form.salary_to)) {
                toast.error('Salary From cannot be greater than Salary To');
                return;
              }
              const method = editing ? 'PUT' : 'POST';
              const url = editing
                ? `${API_BASE_URL}/api/master-data/eis/${editing.id}`
                : `${API_BASE_URL}/api/master-data/eis`;

              const payload: FormEis = {
                salary_from: safeNum(form.salary_from),
                salary_to: safeNum(form.salary_to),
                employee_fixed_amount: safeNum(form.employee_fixed_amount),
                employer_fixed_amount: safeNum(form.employer_fixed_amount),
              };

              const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              if (!res.ok) throw new Error('Save failed');

              toast.success(`EIS ${editing ? 'updated' : 'created'} successfully`);
              setShowModal(false);
              resetForm();
              fetchEis();
            } catch {
              toast.error('Failed to save');
            }
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {showDelete && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Delete EIS Row</h3>
              <p className="text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                  {formatRM(deleteTarget.salary_from)}–{formatRM(deleteTarget.salary_to)}
                </span>
                ?
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

type EisModalProps = {
  form: FormEis;
  setForm: React.Dispatch<React.SetStateAction<FormEis>>;
  onClose: () => void;
  onSave: () => void;
};

function EisModal({ form, setForm, onClose, onSave }: EisModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-black">EIS Entry</h2>

        <div className="mb-6 p-4 rounded bg-blue-50 border border-blue-200 text-blue-900 text-sm">
          <b className="text-blue-800">About EIS Contributions:</b>
          <div className="mt-1">
            EIS uses fixed contribution amounts based on salary slabs. Ensure the range and fixed amounts are correct.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary From */}
          <div>
            <label className="label">
              <span className="label-text text-black font-medium">Salary From (RM)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="input input-bordered w-full text-black"
              value={form.salary_from}
              onChange={(e) => setForm((p) => ({ ...p, salary_from: safeNum(e.target.value) }))}
              placeholder="0.00"
            />
          </div>

          {/* Salary To */}
          <div>
            <label className="label">
              <span className="label-text text-black font-medium">Salary To (RM)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="input input-bordered w-full text-black"
              value={form.salary_to}
              onChange={(e) => setForm((p) => ({ ...p, salary_to: safeNum(e.target.value) }))}
              placeholder="0.00"
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">Must be ≥ Salary From</span>
            </div>
          </div>

          {/* Employee Fixed Amount */}
          <div>
            <label className="label">
              <span className="label-text text-black font-medium">Employee Fixed Amount (RM)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="input input-bordered w-full text-black"
              value={form.employee_fixed_amount}
              onChange={(e) => setForm((p) => ({ ...p, employee_fixed_amount: safeNum(e.target.value) }))}
              placeholder="0.00"
            />
          </div>

          {/* Employer Fixed Amount */}
          <div>
            <label className="label">
              <span className="label-text text-black font-medium">Employer Fixed Amount (RM)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="input input-bordered w-full text-black"
              value={form.employer_fixed_amount}
              onChange={(e) => setForm((p) => ({ ...p, employer_fixed_amount: safeNum(e.target.value) }))}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn bg-blue-600 text-white hover:bg-blue-700" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
