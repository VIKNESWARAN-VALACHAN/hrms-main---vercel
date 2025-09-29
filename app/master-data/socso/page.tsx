
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { API_BASE_URL } from '../../config';

// // interface Socso {
// //   id: number;
// //   salary_from: string;
// //   salary_to: string;
// //   employee_fixed_amount: string;
// //   employer_fixed_amount: string;
// //   act_type: string;
// // }

// // export default function SocsoPage() {
// //   const [socsoList, setSocsoList] = useState<Socso[]>([]);
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [form, setForm] = useState<Partial<Socso>>({
// //     salary_from: '',
// //     salary_to: '',
// //     employee_fixed_amount: '',
// //     employer_fixed_amount: '',
// //     act_type: '',
// //   });
// //   const [editId, setEditId] = useState<number | null>(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;

// //   const fetchSocso = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/socso`);
// //       const data = await res.json();
// //       setSocsoList(data || []);
// //     } catch {
// //       toast.error('Failed to load SOCSO data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSocso();
// //   }, []);

// //   const handleSave = async () => {
// //     try {
// //       const method = editId ? 'PUT' : 'POST';
// //       const url = editId
// //         ? `${API_BASE_URL}/api/master-data/socso/${editId}`
// //         : `${API_BASE_URL}/api/master-data/socso`;
// //       const res = await fetch(url, {
// //         method,
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(form),
// //       });
// //       if (!res.ok) throw new Error();
// //       toast.success(`SOCSO ${editId ? 'updated' : 'created'}`);
// //       setShowModal(false);
// //       setForm({ salary_from: '', salary_to: '', employee_fixed_amount: '', employer_fixed_amount: '', act_type: '' });
// //       setEditId(null);
// //       fetchSocso();
// //     } catch {
// //       toast.error('Failed to save SOCSO');
// //     }
// //   };

// //   const handleEdit = (socso: Socso) => {
// //     setForm(socso);
// //     setEditId(socso.id);
// //     setShowModal(true);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Are you sure?')) return;
// //     try {
// //       await fetch(`${API_BASE_URL}/api/master-data/socso/${id}`, { method: 'DELETE' });
// //       toast.success('Deleted successfully');
// //       fetchSocso();
// //     } catch {
// //       toast.error('Failed to delete');
// //     }
// //   };

// //   const filtered = socsoList.filter((a) =>
// //     (a.salary_from + '-' + a.salary_to).includes(search) ||
// //     (a.act_type ?? '').toLowerCase().includes(search.toLowerCase())
// //   );

// //   const totalPages = Math.ceil(filtered.length / itemsPerPage);
// //   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   function getBadgeColor(type: string) {
// //     switch (type) {
// //       case 'Act4': return 'bg-green-100 text-green-700 border-green-400';
// //       case 'Act800': return 'bg-yellow-100 text-yellow-700 border-yellow-400';
// //       case 'Foreign': return 'bg-blue-100 text-blue-700 border-blue-400';
// //       default: return 'bg-gray-200 text-gray-700 border-gray-400';
// //     }
// //   }

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-3xl font-bold">SOCSO Contributions</h1>
// //         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
// //           + Add SOCSO Row
// //         </button>
// //       </div>

// //       <input
// //         type="text"
// //         placeholder="Search by Salary or Type..."
// //         className="input input-bordered w-full mb-4"
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
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
// //                 <th>Employee Fixed</th>
// //                 <th>Employer Fixed</th>
// //                 <th>Category</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {paginated.map((item) => (
// //                 <tr key={item.id}>
// //                   <td>RM {item.salary_from}</td>
// //                   <td>RM {item.salary_to}</td>
// //                   <td>RM {item.employee_fixed_amount}</td>
// //                   <td>RM {item.employer_fixed_amount}</td>
// //                   <td>
// //                     <span
// //                       className={`inline-block border rounded px-2 py-0.5 text-xs font-semibold ${getBadgeColor(item.act_type)}`}
// //                     >
// //                       {item.act_type || 'Default'}
// //                     </span>
// //                   </td>
// //                   <td>
// //                     <button className="btn btn-sm btn-warning mr-2" onClick={() => handleEdit(item)}>Edit</button>
// //                     <button className="btn btn-sm btn-error" onClick={() => handleDelete(item.id)}>Delete</button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {totalPages > 1 && (
// //         <div className="flex justify-center mt-4 gap-2">
// //           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //             <button
// //               key={page}
// //               className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
// //               onClick={() => setCurrentPage(page)}
// //             >
// //               {page}
// //             </button>
// //           ))}
// //         </div>
// //       )}

// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
// //           <div className="bg-white p-6 rounded shadow w-full max-w-md">
// //             <h2 className="text-xl font-bold mb-2 text-black">{editId ? 'Edit' : 'Add'} SOCSO Row</h2>
// //             <input
// //               type="number"
// //               placeholder="Salary From"
// //               className="input input-bordered w-full mb-1"
// //               value={form.salary_from ?? ''}
// //               onChange={(e) => setForm({ ...form, salary_from: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Salary To"
// //               className="input input-bordered w-full mb-1"
// //               value={form.salary_to ?? ''}
// //               onChange={(e) => setForm({ ...form, salary_to: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Employee Fixed Amount"
// //               className="input input-bordered w-full mb-1"
// //               value={form.employee_fixed_amount ?? ''}
// //               onChange={(e) => setForm({ ...form, employee_fixed_amount: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Employer Fixed Amount"
// //               className="input input-bordered w-full mb-1"
// //               value={form.employer_fixed_amount ?? ''}
// //               onChange={(e) => setForm({ ...form, employer_fixed_amount: e.target.value })}
// //             />
// //             <select
// //               className="input input-bordered w-full mb-4"
// //               value={form.act_type ?? ''}
// //               onChange={e => setForm({ ...form, act_type: e.target.value })}
// //             >
// //               <option value="">Select Category</option>
// //               <option value="Act4">Act4 (Normal)</option>
// //               <option value="Act800">Act800 (&gt;60)</option>
// //               <option value="Foreign">Foreign Worker</option>
// //             </select>
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="btn btn-secondary"
// //                 onClick={() => {
// //                   setShowModal(false);
// //                   setForm({ salary_from: '', salary_to: '', employee_fixed_amount: '', employer_fixed_amount: '', act_type: '' });
// //                   setEditId(null);
// //                 }}>
// //                 Cancel
// //               </button>
// //               <button className="btn btn-primary" onClick={handleSave}>Save</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// 'use client';

// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { API_BASE_URL } from '../../config';

// interface Socso {
//   id: number;
//   salary_from: string;
//   salary_to: string;
//   employee_fixed_amount: string;
//   employer_fixed_amount: string;
//   act_type: string;
// }

// export default function SocsoPage() {
//   const [socsoList, setSocsoList] = useState<Socso[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState<Partial<Socso>>({
//     salary_from: '',
//     salary_to: '',
//     employee_fixed_amount: '',
//     employer_fixed_amount: '',
//     act_type: '',
//   });
//   const [editId, setEditId] = useState<number | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const fetchSocso = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/api/master-data/socso`);
//       const data = await res.json();
//       setSocsoList(data || []);
//     } catch {
//       toast.error('Failed to load SOCSO data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSocso();
//   }, []);

//   const handleSave = async () => {
//     try {
//       const method = editId ? 'PUT' : 'POST';
//       const url = editId
//         ? `${API_BASE_URL}/api/master-data/socso/${editId}`
//         : `${API_BASE_URL}/api/master-data/socso`;

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) throw new Error();
//       toast.success(`SOCSO ${editId ? 'updated' : 'created'}`);
//       setShowModal(false);
//       resetForm();
//       fetchSocso();
//     } catch {
//       toast.error('Failed to save SOCSO');
//     }
//   };

//   const handleEdit = (socso: Socso) => {
//     setForm(socso);
//     setEditId(socso.id);
//     setShowModal(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await fetch(`${API_BASE_URL}/api/master-data/socso/${id}`, { method: 'DELETE' });
//       toast.success('Deleted successfully');
//       fetchSocso();
//     } catch {
//       toast.error('Failed to delete');
//     }
//   };

//   const resetForm = () => {
//     setForm({ salary_from: '', salary_to: '', employee_fixed_amount: '', employer_fixed_amount: '', act_type: '' });
//     setEditId(null);
//   };

//   const filtered = socsoList.filter((a) =>
//     (a.salary_from + '-' + a.salary_to).includes(search) ||
//     (a.act_type ?? '').toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const getBadgeColor = (type: string) => {
//     switch (type) {
//       case 'Act4': return 'bg-green-100 text-green-700 border-green-400';
//       case 'Act800': return 'bg-yellow-100 text-yellow-700 border-yellow-400';
//       case 'Foreign': return 'bg-blue-100 text-blue-700 border-blue-400';
//       default: return 'bg-gray-200 text-gray-700 border-gray-400';
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">SOCSO Contributions</h1>
//         <button className="btn btn-primary" onClick={() => { setShowModal(true); resetForm(); }}>
//           + Add SOCSO Row
//         </button>
//       </div>

//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by Salary or Type..."
//           className="input input-bordered flex-1"
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
//               <th>Salary From</th>
//               <th>Salary To</th>
//               <th>Employee Fixed</th>
//               <th>Employer Fixed</th>
//               <th>Category</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6">
//                   <span className="loading loading-spinner loading-md"></span> Loading...
//                 </td>
//               </tr>
//             ) : paginated.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6">No records found</td>
//               </tr>
//             ) : (
//               paginated.map((item) => (
//                 <tr key={item.id}>
//                   <td>RM {item.salary_from}</td>
//                   <td>RM {item.salary_to}</td>
//                   <td>RM {item.employee_fixed_amount}</td>
//                   <td>RM {item.employer_fixed_amount}</td>
//                   <td>
//                     <span
//                       className={`inline-block border rounded px-2 py-0.5 text-xs font-semibold ${getBadgeColor(item.act_type)}`}
//                     >
//                       {item.act_type || 'Default'}
//                     </span>
//                   </td>
//                   {/* <td>
//                     <div className="flex gap-2">
//                       <button className="btn btn-sm btn-warning" onClick={() => handleEdit(item)}>Edit</button>
//                       <button className="btn btn-sm btn-error" onClick={() => handleDelete(item.id)}>Delete</button>
//                     </div>
//                   </td> */}
//                   <td>
//   <div className="flex gap-2">
//     <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleEdit(item)}>Edit</button>
//     <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleDelete(item.id)}>Delete</button>
//   </div>
// </td>

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
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6 text-black">
//               {editId ? 'Edit' : 'Add'} SOCSO Row
//             </h2>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {[
//                 { label: 'Salary From', field: 'salary_from' },
//                 { label: 'Salary To', field: 'salary_to' },
//                 { label: 'Employee Fixed Amount', field: 'employee_fixed_amount' },
//                 { label: 'Employer Fixed Amount', field: 'employer_fixed_amount' },
//               ].map(({ label, field }) => (
//                 <div key={field}>
//                   <label className="label">
//                     <span className="label-text text-black font-medium">{label}</span>
//                   </label>
//                   <input
//                     type="number"
//                     placeholder={label}
//                     className="input input-bordered w-full text-black"
//                     value={form[field as keyof Socso] ?? ''}
//                     onChange={(e) => setForm(prev => ({
//                       ...prev,
//                       [field]: e.target.value
//                     }))}
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label className="label">
//                   <span className="label-text text-black font-medium">Category</span>
//                 </label>
//                 <select
//                   className="input input-bordered w-full text-black"
//                   value={form.act_type ?? ''}
//                   onChange={(e) => setForm({ ...form, act_type: e.target.value })}
//                 >
//                   <option value="">Select Category</option>
//                   <option value="Act4">Act4 (Normal)</option>
//                   <option value="Act800">Act800 (&gt;60)</option>
//                   <option value="Foreign">Foreign Worker</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowModal(false);
//                   resetForm();
//                 }}
//               >
//                 Cancel
//               </button>
//               <button className="btn btn-primary px-6" onClick={handleSave}>
//                 Save
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
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

interface Socso {
  id: number;
  salary_from: number;
  salary_to: number;
  employee_fixed_amount: number;
  employer_fixed_amount: number;
  act_type: string;
}

type FormSocso = Omit<Socso, 'id'>;

const itemsPerPage = 10;

// Helpers
const safeNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const formatRM = (v: unknown) => `RM ${safeNum(v).toFixed(2)}`;

const getBadgeColor = (type: string) => {
  switch (type) {
    case 'Act4':
      return 'bg-blue-600 text-white'; // solid blue
    case 'Act800':
      return 'bg-blue-200 text-blue-900'; // light blue
    case 'Foreign':
      return 'bg-blue-100 text-blue-800'; // softer blue
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

export default function SocsoPage() {
  const [socsoList, setSocsoList] = useState<Socso[]>([]);
  const [loading, setLoading] = useState(false);

  // search
  const [search, setSearch] = useState('');

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const setPage = setCurrentPage;

  // modal: create/edit
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Socso | null>(null);

  // delete confirm modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Socso | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<FormSocso>({
    salary_from: 0,
    salary_to: 0,
    employee_fixed_amount: 0,
    employer_fixed_amount: 0,
    act_type: '',
  });

  const fetchSocso = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/master-data/socso`);
      if (!res.ok) throw new Error('Failed to load');
      const data: any[] = await res.json();
      const normalized: Socso[] = (data || []).map((r) => ({
        id: safeNum(r.id) as number,
        salary_from: safeNum(r.salary_from),
        salary_to: safeNum(r.salary_to),
        employee_fixed_amount: safeNum(r.employee_fixed_amount),
        employer_fixed_amount: safeNum(r.employer_fixed_amount),
        act_type: (r.act_type ?? '').toString(),
      }));
      setSocsoList(normalized);
    } catch {
      toast.error('Failed to load SOCSO data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocso();
  }, []);

  const resetForm = () => {
    setForm({
      salary_from: 0,
      salary_to: 0,
      employee_fixed_amount: 0,
      employer_fixed_amount: 0,
      act_type: '',
    });
    setEditing(null);
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return socsoList;
    return socsoList.filter(
      (a) =>
        `${a.salary_from}-${a.salary_to}`.toLowerCase().includes(s) ||
        (a.act_type ?? '').toLowerCase().includes(s)
    );
  }, [socsoList, search]);

  // paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // summary
  const total = socsoList.length;
  const byAct4 = socsoList.filter((x) => x.act_type === 'Act4').length;
  const byAct800 = socsoList.filter((x) => x.act_type === 'Act800').length;
  const byForeign = socsoList.filter((x) => x.act_type === 'Foreign').length;

  const handleSave = async () => {
    try {
      if (form.salary_from > form.salary_to) {
        toast.error('Salary From cannot be greater than Salary To');
        return;
      }
      const method = editing ? 'PUT' : 'POST';
      const url = editing
        ? `${API_BASE_URL}/api/master-data/socso/${editing.id}`
        : `${API_BASE_URL}/api/master-data/socso`;

      const payload: FormSocso = {
        salary_from: safeNum(form.salary_from),
        salary_to: safeNum(form.salary_to),
        employee_fixed_amount: safeNum(form.employee_fixed_amount),
        employer_fixed_amount: safeNum(form.employer_fixed_amount),
        act_type: (form.act_type ?? '').toString(),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');
      toast.success(`SOCSO ${editing ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      resetForm();
      fetchSocso();
    } catch {
      toast.error('Failed to save SOCSO');
    }
  };

  const handleEdit = (socso: Socso) => {
    setEditing(socso);
    setForm({
      salary_from: safeNum(socso.salary_from),
      salary_to: safeNum(socso.salary_to),
      employee_fixed_amount: safeNum(socso.employee_fixed_amount),
      employer_fixed_amount: safeNum(socso.employer_fixed_amount),
      act_type: socso.act_type ?? '',
    });
    setShowModal(true);
  };

  const askDelete = (row: Socso) => {
    setDeleteTarget(row);
    setShowDelete(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/socso/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('SOCSO row deleted');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchSocso();
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
        <h1 className="text-3xl font-bold">SOCSO Contributions</h1>
        <button
          className="btn bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
        >
          Add SOCSO Row
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by salary range or category…"
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
          <div className="stat-title">Act4</div>
          <div className="stat-value text-sm">{byAct4}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Act800</div>
          <div className="stat-value text-sm">{byAct800}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Foreign</div>
          <div className="stat-value text-sm">{byForeign}</div>
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
                <th>Employee Fixed</th>
                <th>Employer Fixed</th>
                <th>Category</th>
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
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">No records found</td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id}>
                    <td className="align-top whitespace-nowrap">{formatRM(item.salary_from)}</td>
                    <td className="align-top whitespace-nowrap">{formatRM(item.salary_to)}</td>
                    <td className="align-top whitespace-nowrap">{formatRM(item.employee_fixed_amount)}</td>
                    <td className="align-top whitespace-nowrap">{formatRM(item.employer_fixed_amount)}</td>
                    <td className="align-top">
                      <span className={`badge ${getBadgeColor(item.act_type)}`}>
                        {item.act_type || 'Default'}
                      </span>
                    </td>
                    <td className="align-top">
                      <div className="flex gap-2">
                        <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => askDelete(item)}>
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
        ) : paginated.length === 0 ? (
          <div className="p-6 bg-base-100 rounded shadow text-center">No records found</div>
        ) : (
          paginated.map((item) => (
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

                <div className="text-gray-500">Category</div>
                <div>
                  <span className={`badge ${getBadgeColor(item.act_type)}`}>{item.act_type || 'Default'}</span>
                </div>
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
                    ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}
                  `}
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

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">{editing ? 'Edit' : 'Add'} SOCSO Row</h2>

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
                  onChange={(e) => setForm({ ...form, salary_from: safeNum(e.target.value) })}
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
                  className="input input-bordered w-full text-black"
                  value={form.salary_to}
                  onChange={(e) => setForm({ ...form, salary_to: safeNum(e.target.value) })}
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
                  className="input input-bordered w-full text-black"
                  value={form.employee_fixed_amount}
                  onChange={(e) => setForm({ ...form, employee_fixed_amount: safeNum(e.target.value) })}
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
                  className="input input-bordered w-full text-black"
                  value={form.employer_fixed_amount}
                  onChange={(e) => setForm({ ...form, employer_fixed_amount: safeNum(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              {/* Category */}
              <div>
                <label className="label">
                  <span className="label-text text-black font-medium">Category</span>
                </label>
                <select
                  className="select select-bordered w-full text-black"
                  value={form.act_type ?? ''}
                  onChange={(e) => setForm({ ...form, act_type: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="Act4">Act4 (Normal)</option>
                  <option value="Act800">Act800 (&gt;60)</option>
                  <option value="Foreign">Foreign Worker</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
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
              <h3 className="text-xl font-semibold mb-2">Delete SOCSO Row</h3>
              <p className="text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                  {formatRM(deleteTarget.salary_from)}–{formatRM(deleteTarget.salary_to)} ({deleteTarget.act_type || 'Default'})
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
              <button className="btn btn-error text-white" onClick={doDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
