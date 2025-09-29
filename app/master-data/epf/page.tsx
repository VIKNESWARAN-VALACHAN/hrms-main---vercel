// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';

// interface EpfRow {
//   id: number;
//   salary_from: number;
//   salary_to: number;
//   employee_percent: number;
//   employer_percent: number;
//   age_limit: number;
// }

// export default function EpfPage() {
//   const [epfRows, setEpfRows] = useState<EpfRow[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState<Partial<EpfRow>>({
//     salary_from: 0,
//     salary_to: 0,
//     employee_percent: 0,
//     employer_percent: 0,
//     age_limit: 60,
//   });
//   const [editId, setEditId] = useState<number | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const fetchEpfRows = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/api/master-data/epf`);
//       const data = await res.json();
//       setEpfRows(data || []);
//     } catch {
//       toast.error('Failed to load EPF contribution data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEpfRows();
//   }, []);

//   const handleSave = async () => {
//     try {
//       const method = editId ? 'PUT' : 'POST';
//       const url = editId
//         ? `${API_BASE_URL}/api/master-data/epf/${editId}`
//         : `${API_BASE_URL}/api/master-data/epf`;
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) throw new Error();
//       toast.success(`EPF record ${editId ? 'updated' : 'created'}`);
//       setShowModal(false);
//       setForm({
//         salary_from: 0,
//         salary_to: 0,
//         employee_percent: 0,
//         employer_percent: 0,
//         age_limit: 60,
//       });
//       setEditId(null);
//       fetchEpfRows();
//     } catch {
//       toast.error('Failed to save EPF data');
//     }
//   };

//   const handleEdit = (row: EpfRow) => {
//     setForm(row);
//     setEditId(row.id);
//     setShowModal(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await fetch(`${API_BASE_URL}/api/master-data/epf/${id}`, { method: 'DELETE' });
//       toast.success('Deleted successfully');
//       fetchEpfRows();
//     } catch {
//       toast.error('Failed to delete');
//     }
//   };

//   const filtered = epfRows.filter((a) =>
//     `${a.salary_from}-${a.salary_to}`.includes(search)
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">EPF Contributions</h1>
//         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//           + Add EPF
//         </button>
//       </div>

//       <input
//         type="text"
//         placeholder="Search by Salary..."
//         className="input input-bordered w-full mb-4"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th>Salary From</th>
//                 <th>Salary To</th>
//                 <th>Employee %</th>
//                 <th>Employer %</th>
//                 <th>Age Limit</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginated.map((item) => (
//                 <tr key={item.id}>
//                   <td>RM {item.salary_from}</td>
//                   <td>RM {item.salary_to}</td>
//                   <td>{item.employee_percent}%</td>
//                   <td>{item.employer_percent}%</td>
//                   <td>{item.age_limit}</td>
//                   <td>
//                     <button 
//                     className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                     //className="btn btn-sm btn-warning mr-2" 
//                     onClick={() => handleEdit(item)}>Edit</button>
                    
//                     <button 
//                     className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                     //className="btn btn-sm btn-error" 
//                     onClick={() => handleDelete(item.id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4 gap-2">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
//               onClick={() => setCurrentPage(page)}
//             >
//               {page}
//             </button>
//           ))}
//         </div>
//       )}

//       {showModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded shadow w-full max-w-md">
//       <h2 className="text-xl font-bold mb-2 text-black">
//         {editId ? 'Edit' : 'Add'} EPF Row
//       </h2>
//             {/* Info Panel */}
//         <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-200 text-blue-900 text-sm">
//         <b className="text-blue-800">About EPF Contributions:</b>
//         <div className="mt-1">
//             Fill in the correct <span className="font-semibold text-blue-700">salary range</span> and <span className="font-semibold text-blue-700">percentages</span>.<br />
//             For most Malaysian employees under <span className="font-semibold text-blue-700">60</span>,
//             Employee = <span className="font-semibold text-green-700">11%</span> and Employer = <span className="font-semibold text-purple-700">13%</span>.<br />
//             <span className="text-blue-700">Over 60, contributions may differ.</span>
//         </div>
//         <ul className="list-disc ml-5 mt-2">
//             <li>
//             <span className="font-medium text-blue-900">Example:</span>
//             <span className="ml-1 text-gray-800">
//                 For salary <b>RM5,000</b>, Employee pays <b>11%</b> (<span className="text-green-700">RM550</span>), Employer pays <b>13%</b> (<span className="text-purple-700">RM650</span>).
//             </span>
//             </li>
//             <li>
//             <span className="text-blue-700">Set <b>Age Limit</b> if contribution rates differ for senior employees.</span>
//             </li>
//         </ul>
//         </div>
//       <input
//         type="number"
//         placeholder="Salary From"
//         className="input input-bordered w-full mb-1"
//         value={form.salary_from ?? ''}
//         onChange={(e) => setForm({ ...form, salary_from: Number(e.target.value) })}
//       />
//       <div className="text-xs text-gray-500 mb-2">
//         Minimum salary (RM) for this range. E.g. <b>0</b>.
//       </div>
//       <input
//         type="number"
//         placeholder="Salary To"
//         className="input input-bordered w-full mb-1"
//         value={form.salary_to ?? ''}
//         onChange={(e) => setForm({ ...form, salary_to: Number(e.target.value) })}
//       />
//       <div className="text-xs text-gray-500 mb-2">
//         Maximum salary (RM) for this range. E.g. <b>5000</b>.
//       </div>
//       <input
//         type="number"
//         placeholder="Employee %"
//         className="input input-bordered w-full mb-1"
//         value={form.employee_percent ?? ''}
//         onChange={(e) => setForm({ ...form, employee_percent: Number(e.target.value) })}
//       />
//       <div className="text-xs text-gray-500 mb-2">
//         Employee deduction percentage. Standard: <b>11</b>
//       </div>
//       <input
//         type="number"
//         placeholder="Employer %"
//         className="input input-bordered w-full mb-1"
//         value={form.employer_percent ?? ''}
//         onChange={(e) => setForm({ ...form, employer_percent: Number(e.target.value) })}
//       />
//       <div className="text-xs text-gray-500 mb-2">
//         Employer contribution percentage. Standard: <b>13</b>
//       </div>
//       <input
//         type="number"
//         placeholder="Age Limit"
//         className="input input-bordered w-full mb-1"
//         value={form.age_limit ?? ''}
//         onChange={(e) => setForm({ ...form, age_limit: Number(e.target.value) })}
//       />
//       <div className="text-xs text-gray-500 mb-4">
//         Maximum employee age this row applies to (commonly <b>60</b>).
//       </div>
//       <div className="flex justify-end gap-2">
//         <button
//           className="btn btn-secondary"
//           onClick={() => {
//             setShowModal(false);
//             setForm({ salary_from: 0, salary_to: 0, employee_percent: 0, employer_percent: 0, age_limit: 60 });
//             setEditId(null);
//           }}>
//           Cancel
//         </button>
//         <button className="btn btn-primary" onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// }


'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

interface EpfRow {
  id: number;
  salary_from: number;
  salary_to: number;
  employee_percent: number;
  employer_percent: number;
  age_limit: number;
}

type FormEpf = Omit<EpfRow, 'id'>;

const itemsPerPage = 10;

// Helpers
const safeNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const formatRM = (v: unknown) => `RM ${safeNum(v).toFixed(2)}`;
const formatPct = (v: unknown) => `${safeNum(v).toFixed(2)}%`;

export default function EpfPage() {
  const [rows, setRows] = useState<EpfRow[]>([]);
  const [loading, setLoading] = useState(false);

  // search
  const [search, setSearch] = useState('');

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const setPage = setCurrentPage;

  // modals
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EpfRow | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EpfRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<FormEpf>({
    salary_from: 0,
    salary_to: 0,
    employee_percent: 0,
    employer_percent: 0,
    age_limit: 60,
  });

  // Fetch + normalize
  const fetchEpfRows = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/master-data/epf`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: any[] = await res.json();
      const normalized: EpfRow[] = (data || []).map((r) => ({
        id: safeNum(r.id) as number,
        salary_from: safeNum(r.salary_from),
        salary_to: safeNum(r.salary_to),
        employee_percent: safeNum(r.employee_percent),
        employer_percent: safeNum(r.employer_percent),
        age_limit: safeNum(r.age_limit, 60),
      }));
      setRows(normalized);
    } catch {
      toast.error('Failed to load EPF contribution data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpfRows();
  }, []);

  const resetForm = () => {
    setForm({
      salary_from: 0,
      salary_to: 0,
      employee_percent: 0,
      employer_percent: 0,
      age_limit: 60,
    });
    setEditing(null);
  };

  // Filter
  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return rows;
    return rows.filter((a) =>
      `${a.salary_from}-${a.salary_to}`.toLowerCase().includes(s)
      || String(a.employee_percent).includes(s)
      || String(a.employer_percent).includes(s)
      || String(a.age_limit).includes(s)
    );
  }, [rows, search]);

  // Paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Summary
  const total = rows.length;
  const under60 = rows.filter(r => r.age_limit <= 60).length;
  const maxEmpPct = rows.length ? Math.max(...rows.map(r => safeNum(r.employee_percent))) : 0;
  const maxErPct = rows.length ? Math.max(...rows.map(r => safeNum(r.employer_percent))) : 0;

  // Save
  const handleSave = async () => {
    if (safeNum(form.salary_from) > safeNum(form.salary_to)) {
      toast.error('Salary From cannot be greater than Salary To');
      return;
    }
    if (safeNum(form.employee_percent) < 0 || safeNum(form.employee_percent) > 100) {
      toast.error('Employee % must be between 0 and 100');
      return;
    }
    if (safeNum(form.employer_percent) < 0 || safeNum(form.employer_percent) > 100) {
      toast.error('Employer % must be between 0 and 100');
      return;
    }

    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing
        ? `${API_BASE_URL}/api/master-data/epf/${editing.id}`
        : `${API_BASE_URL}/api/master-data/epf`;

      const payload: FormEpf = {
        salary_from: safeNum(form.salary_from),
        salary_to: safeNum(form.salary_to),
        employee_percent: safeNum(form.employee_percent),
        employer_percent: safeNum(form.employer_percent),
        age_limit: Math.max(0, safeNum(form.age_limit, 60)),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');

      toast.success(`EPF record ${editing ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      resetForm();
      fetchEpfRows();
    } catch {
      toast.error('Failed to save EPF data');
    }
  };

  // Edit
  const handleEdit = (row: EpfRow) => {
    setEditing(row);
    setForm({
      salary_from: safeNum(row.salary_from),
      salary_to: safeNum(row.salary_to),
      employee_percent: safeNum(row.employee_percent),
      employer_percent: safeNum(row.employer_percent),
      age_limit: Math.max(0, safeNum(row.age_limit, 60)),
    });
    setShowModal(true);
  };

  // Delete
  const askDelete = (row: EpfRow) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/epf/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('EPF row deleted');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchEpfRows();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">EPF Contributions</h1>
        <button
          className="btn bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
        >
          Add EPF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by salary range, %, or age…"
          className="input input-bordered flex-1"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total Rows</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Age ≤ 60</div>
          <div className="stat-value text-sm">{under60}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Max Employee %</div>
          <div className="stat-value text-sm">{formatPct(maxEmpPct)}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Max Employer %</div>
          <div className="stat-value text-sm">{formatPct(maxErPct)}</div>
        </div>
        {/* <div className="stat bg-base-100 rounded shadow">
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
                <th>Employee %</th>
                <th>Employer %</th>
                <th>Age Limit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <span className="loading loading-spinner loading-md"></span> Loading...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">No records found</td>
                </tr>
              ) : (
                paged.map((item) => (
                  <tr key={item.id}>
                    <td className="align-top whitespace-nowrap">{formatRM(item.salary_from)}</td>
                    <td className="align-top whitespace-nowrap">{formatRM(item.salary_to)}</td>
                    <td className="align-top">{formatPct(item.employee_percent)}</td>
                    <td className="align-top">{formatPct(item.employer_percent)}</td>
                    <td className="align-top">
                      <span className="badge bg-blue-200 text-blue-900">{safeNum(item.age_limit)}</span>
                    </td>
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
                <div className="text-gray-500">Employee %</div>
                <div>{formatPct(item.employee_percent)}</div>

                <div className="text-gray-500">Employer %</div>
                <div>{formatPct(item.employer_percent)}</div>

                <div className="text-gray-500">Age Limit</div>
                <div><span className="badge bg-blue-200 text-blue-900">{safeNum(item.age_limit)}</span></div>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {editing ? 'Edit' : 'Add'} EPF Row
            </h2>

            {/* Info Panel */}
            <div className="mb-6 p-4 rounded bg-blue-50 border border-blue-200 text-blue-900 text-sm">
              <b className="text-blue-800">About EPF Contributions:</b>
              <div className="mt-1">
                Fill in the <span className="font-semibold text-blue-700">salary range</span> and
                <span className="font-semibold text-blue-700"> percentages</span>.<br />
                Typical under <span className="font-semibold text-blue-700">60</span>:
                Employee <span className="font-semibold text-green-700">11%</span>, Employer
                <span className="font-semibold text-purple-700">13%</span>.
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
                  className="input input-bordered w-full text-black"
                  value={form.salary_from}
                  onChange={(e) => setForm({ ...form, salary_from: Number(e.target.value) || 0 })}
                  placeholder="0.00"
                />
                <div className="label">
                  <span className="label-text-alt text-gray-500">Minimum salary for this range.</span>
                </div>
              </div>

              {/* Salary To */}
              <div>
                <label className="label">
                  <span className="label-text text-black font-medium">Salary To (RM)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full text-black"
                  value={form.salary_to}
                  onChange={(e) => setForm({ ...form, salary_to: Number(e.target.value) || 0 })}
                  placeholder="0.00"
                />
                <div className="label">
                  <span className="label-text-alt text-gray-500">Must be ≥ Salary From.</span>
                </div>
              </div>

              {/* Employee % */}
              <div>
                <label className="label">
                  <span className="label-text text-black font-medium">Employee %</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full text-black"
                  value={form.employee_percent}
                  onChange={(e) => setForm({ ...form, employee_percent: Number(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              {/* Employer % */}
              <div>
                <label className="label">
                  <span className="label-text text-black font-medium">Employer %</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full text-black"
                  value={form.employer_percent}
                  onChange={(e) => setForm({ ...form, employer_percent: Number(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              {/* Age Limit */}
              <div>
                <label className="label">
                  <span className="label-text text-black font-medium">Age Limit</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full text-black"
                  value={form.age_limit}
                  min={0}
                  onChange={(e) => setForm({ ...form, age_limit: Math.max(0, Number(e.target.value) || 0) })}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowModal(false);
                  setForm({ salary_from: 0, salary_to: 0, employee_percent: 0, employer_percent: 0, age_limit: 60 });
                  setEditing(null);
                }}
              >
                Cancel
              </button>
              <button className="btn bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>
                Save
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
              <h3 className="text-xl font-semibold mb-2">Delete EPF Row</h3>
              <p className="text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                  {formatRM(deleteTarget.salary_from)}–{formatRM(deleteTarget.salary_to)} (Age ≤ {safeNum(deleteTarget.age_limit)})
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
