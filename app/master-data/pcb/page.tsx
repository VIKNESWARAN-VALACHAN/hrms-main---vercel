// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { useRouter } from 'next/navigation';
// // import { API_BASE_URL } from '../../config';

// // interface PCB {
// //   id: number;
// //   income_from: number;
// //   income_to: number;
// //   tax_rate: number;
// //   tax_amount: number;
// //   marital_status: string;
// //   num_children: number;
// // }

// // export default function PCBPage() {
// //   const [pcbs, setPcbs] = useState<PCB[]>([]);
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [showModal, setShowModal] = useState(false);
// //   const [form, setForm] = useState<Partial<PCB>>({
// //     income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0
// //   });
// //   const [editId, setEditId] = useState<number | null>(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 10;
// //   const router = useRouter();

// //   const fetchPCBs = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/pcb`);
// //       const data = await res.json();
// //       setPcbs(data || []);
// //     } catch {
// //       toast.error('Failed to load PCB tax slabs');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { fetchPCBs(); }, []);

// //   const handleSave = async () => {
// //     try {
// //       const method = editId ? 'PUT' : 'POST';
// //       const url = editId
// //         ? `${API_BASE_URL}/api/master-data/pcb/${editId}`
// //         : `${API_BASE_URL}/api/master-data/pcb`;
// //       const payload = {
// //         ...form,
// //         income_from: Number(form.income_from),
// //         income_to: Number(form.income_to),
// //         tax_rate: Number(form.tax_rate),
// //         tax_amount: Number(form.tax_amount),
// //         num_children: Number(form.num_children)
// //       };
// //       const res = await fetch(url, {
// //         method,
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload),
// //       });
// //       if (!res.ok) throw new Error();
// //       toast.success(`PCB ${editId ? 'updated' : 'created'}`);
// //       setShowModal(false);
// //       setForm({ income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0 });
// //       setEditId(null);
// //       fetchPCBs();
// //     } catch {
// //       toast.error('Failed to save PCB');
// //     }
// //   };

// //   const handleEdit = (pcb: PCB) => {
// //     setForm(pcb);
// //     setEditId(pcb.id);
// //     setShowModal(true);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Are you sure?')) return;
// //     try {
// //       await fetch(`${API_BASE_URL}/api/master-data/pcb/${id}`, { method: 'DELETE' });
// //       toast.success('Deleted successfully');
// //       fetchPCBs();
// //     } catch {
// //       toast.error('Failed to delete');
// //     }
// //   };

// //   const filtered = pcbs.filter(
// //     a =>
// //       a.marital_status?.toLowerCase().includes(search.toLowerCase()) ||
// //       String(a.income_from).includes(search) ||
// //       String(a.income_to).includes(search)
// //   );

// //   const totalPages = Math.ceil(filtered.length / itemsPerPage);
// //   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-3xl font-bold">PCB Tax</h1>
// //         <button className="btn btn-primary" onClick={() => { setEditId(null); setForm({ income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0 }); setShowModal(true); }}>
// //           + Add PCB Row
// //         </button>
// //       </div>

// //       <input
// //         type="text"
// //         placeholder="Search by status or amount..."
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
// //                 <th>Income From</th>
// //                 <th>Income To</th>
// //                 <th>Tax Rate (%)</th>
// //                 <th>Tax Amount (RM)</th>
// //                 <th>Marital Status</th>
// //                 <th>Children</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {paginated.map((item) => (
// //                 <tr key={item.id}>
// //                   <td>RM {item.income_from}</td>
// //                   <td>RM {item.income_to}</td>
// //                   <td>{item.tax_rate}</td>
// //                   <td>{item.tax_amount}</td>
// //                   <td>{item.marital_status}</td>
// //                   <td>{item.num_children}</td>
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
// //             <h2 className="text-xl font-bold mb-2 text-black">{editId ? 'Edit' : 'Add'} PCB Row</h2>
// //             <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-200 text-blue-900 text-sm">
// //               <b className="text-blue-800">About PCB Tax Table:</b>
// //               <ul className="list-disc pl-5">
// //                 <li>Set the income range, tax rate, fixed tax amount, marital status, and number of children.</li>
// //                 <li>PCB rules may vary for married/unmarried and with/without children.</li>
// //               </ul>
// //             </div>
// //             <input
// //               type="number"
// //               step="0.01"
// //               placeholder="Income From"
// //               className="input input-bordered w-full mb-3"
// //               value={form.income_from ?? ''}
// //               onChange={e => setForm(f => ({ ...f, income_from: Number(e.target.value) }))}
// //               required
// //             />
// //             <input
// //               type="number"
// //               step="0.01"
// //               placeholder="Income To"
// //               className="input input-bordered w-full mb-3"
// //               value={form.income_to ?? ''}
// //               onChange={e => setForm(f => ({ ...f, income_to: Number(e.target.value) }))}
// //               required
// //             />
// //             <input
// //               type="number"
// //               step="0.01"
// //               placeholder="Tax Rate (%)"
// //               className="input input-bordered w-full mb-3"
// //               value={form.tax_rate ?? ''}
// //               onChange={e => setForm(f => ({ ...f, tax_rate: Number(e.target.value) }))}
// //               required
// //             />
// //             <input
// //               type="number"
// //               step="0.01"
// //               placeholder="Tax Amount (RM)"
// //               className="input input-bordered w-full mb-3"
// //               value={form.tax_amount ?? ''}
// //               onChange={e => setForm(f => ({ ...f, tax_amount: Number(e.target.value) }))}
// //               required
// //             />
// //             <input
// //               type="text"
// //               placeholder="Marital Status"
// //               className="input input-bordered w-full mb-3"
// //               value={form.marital_status ?? ''}
// //               onChange={e => setForm(f => ({ ...f, marital_status: e.target.value }))}
// //               required
// //             />
// //             <input
// //               type="number"
// //               placeholder="Number of Children"
// //               className="input input-bordered w-full mb-4"
// //               value={form.num_children ?? ''}
// //               onChange={e => setForm(f => ({ ...f, num_children: Number(e.target.value) }))}
// //             />
// //             <div className="flex justify-end gap-2">
// //               <button className="btn btn-secondary" onClick={() => { setShowModal(false); setForm({ income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0 }); setEditId(null); }}>Cancel</button>
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

// interface PCB {
//   id: number;
//   income_from: number;
//   income_to: number;
//   tax_rate: number;
//   tax_amount: number;
//   marital_status: string;
//   num_children: number;
// }

// export default function PCBPage() {
//   const [pcbs, setPcbs] = useState<PCB[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState<Partial<PCB>>({
//     income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0
//   });
//   const [editId, setEditId] = useState<number | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const fetchPCBs = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/api/master-data/pcb`);
//       const data = await res.json();
//       setPcbs(data || []);
//     } catch {
//       toast.error('Failed to load PCB tax slabs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchPCBs(); }, []);

//   const handleSave = async () => {
//     try {
//       const method = editId ? 'PUT' : 'POST';
//       const url = editId
//         ? `${API_BASE_URL}/api/master-data/pcb/${editId}`
//         : `${API_BASE_URL}/api/master-data/pcb`;

//       const payload = {
//         ...form,
//         income_from: Number(form.income_from),
//         income_to: Number(form.income_to),
//         tax_rate: Number(form.tax_rate),
//         tax_amount: Number(form.tax_amount),
//         num_children: Number(form.num_children)
//       };

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error();
//       toast.success(`PCB ${editId ? 'updated' : 'created'}`);
//       setShowModal(false);
//       setForm({ income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0 });
//       setEditId(null);
//       fetchPCBs();
//     } catch {
//       toast.error('Failed to save PCB');
//     }
//   };

//   const handleEdit = (pcb: PCB) => {
//     setForm(pcb);
//     setEditId(pcb.id);
//     setShowModal(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await fetch(`${API_BASE_URL}/api/master-data/pcb/${id}`, { method: 'DELETE' });
//       toast.success('Deleted successfully');
//       fetchPCBs();
//     } catch {
//       toast.error('Failed to delete');
//     }
//   };

//   const filtered = pcbs.filter(
//     a =>
//       a.marital_status?.toLowerCase().includes(search.toLowerCase()) ||
//       String(a.income_from).includes(search) ||
//       String(a.income_to).includes(search)
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">PCB Tax Table</h1>
//         <button
//           className="btn btn-primary"
//           onClick={() => {
//             setEditId(null);
//             setForm({ income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0 });
//             setShowModal(true);
//           }}
//         >
//           + Add PCB Row
//         </button>
//       </div>

//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by marital status or income..."
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
//               <th>Income From</th>
//               <th>Income To</th>
//               <th>Tax Rate (%)</th>
//               <th>Tax Amount (RM)</th>
//               <th>Marital Status</th>
//               <th>Children</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-6">
//                   <span className="loading loading-spinner loading-md"></span>
//                   Loading...
//                 </td>
//               </tr>
//             ) : paginated.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-6">
//                   No PCB rows found.
//                 </td>
//               </tr>
//             ) : (
//               paginated.map((item) => (
//                 <tr key={item.id}>
//                   <td>RM {item.income_from}</td>
//                   <td>RM {item.income_to}</td>
//                   <td>{item.tax_rate}</td>
//                   <td>{item.tax_amount}</td>
//                   <td>{item.marital_status}</td>
//                   <td>{item.num_children}</td>
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
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6 text-black">
//               {editId ? 'Edit' : 'Create'} PCB Row
//             </h2>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {[
//                 { label: 'Income From', field: 'income_from' },
//                 { label: 'Income To', field: 'income_to' },
//                 { label: 'Tax Rate (%)', field: 'tax_rate' },
//                 { label: 'Tax Amount (RM)', field: 'tax_amount' },
//                 { label: 'Marital Status', field: 'marital_status' },
//                 { label: 'Number of Children', field: 'num_children' },
//               ].map(({ label, field }) => (
//                 <div key={field}>
//                   <label className="label">
//                     <span className="label-text text-black font-medium">{label}</span>
//                   </label>
//                   <input
//                     type={field === 'marital_status' ? 'text' : 'number'}
//                     step="0.01"
//                     placeholder={label}
//                     className="input input-bordered w-full text-black"
//                     value={form[field as keyof PCB] ?? ''}
//                     onChange={(e) => setForm((prev) => ({
//                       ...prev,
//                       [field]: field === 'marital_status' ? e.target.value : Number(e.target.value)
//                     }))}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   setShowModal(false);
//                   setForm({ income_from: 0, income_to: 0, tax_rate: 0, tax_amount: 0, marital_status: '', num_children: 0 });
//                   setEditId(null);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button className="btn btn-primary px-6" onClick={handleSave}>
//                 {editId ? 'Update' : 'Create'} PCB Row
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

interface PCB {
  id: number;
  income_from: number;
  income_to: number;
  tax_rate: number;      // %
  tax_amount: number;    // RM
  marital_status: string;
  num_children: number;
}

// Default options for marital status
const DEFAULT_MARITAL_OPTIONS = [
  'Single',
  'Married',
  'Widowed',
  'Divorced',
];


type FormPCB = Omit<PCB, 'id'>;

const itemsPerPage = 10;

// Safe formatters (won’t throw on null/undefined/NaN)
const safeNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const formatRM = (v: unknown) => `RM ${safeNum(v).toFixed(2)}`;
const formatPct = (v: unknown) => `${safeNum(v).toFixed(2)}%`;

export default function PCBPage() {
  const [rows, setRows] = useState<PCB[]>([]);
  const [loading, setLoading] = useState(false);

  // filters/search
  const [search, setSearch] = useState('');
  const [maritalFilter, setMaritalFilter] = useState<'all' | string>('all');
  const [childFilter, setChildFilter] = useState<'all' | '0' | '1+' | '2+' | '3+'>('all');

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const setPage = setCurrentPage;
  // modals
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PCB | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PCB | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<FormPCB>({
    income_from: 0,
    income_to: 0,
    tax_rate: 0,
    tax_amount: 0,
    marital_status: '',
    num_children: 0,
  });

  // Load + normalize
  const fetchPCBs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/master-data/pcb`);
      if (!res.ok) throw new Error('Fetch failed');
      const data: any[] = await res.json();

      // Normalize every field so render never receives null/undefined for numbers
      const normalized: PCB[] = (data || []).map((r) => ({
        id: safeNum(r.id) as number,
        income_from: safeNum(r.income_from),
        income_to: safeNum(r.income_to),
        tax_rate: safeNum(r.tax_rate),
        tax_amount: safeNum(r.tax_amount),
        marital_status: (r.marital_status ?? '').toString(),
        num_children: Math.max(0, safeNum(r.num_children)),
      }));
      setRows(normalized);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load PCB tax slabs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCBs();
  }, []);

  // unique marital statuses for filter
  // Existing unique statuses from data (you likely already have this)
  const maritalOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => r.marital_status && set.add(r.marital_status));
    return Array.from(set).sort();
  }, [rows]);

  // Options shown in the modal select (defaults + existing + current)
  const modalMaritalOptions = useMemo(() => {
    const set = new Set<string>(DEFAULT_MARITAL_OPTIONS);
    maritalOptions.forEach(m => set.add(m));
    if (form.marital_status) set.add(form.marital_status); // ensure current value is selectable
    return Array.from(set);
  }, [maritalOptions, form.marital_status]);

  // filter + search
  const filtered = useMemo(() => {
    let list = rows;

    if (maritalFilter !== 'all') {
      list = list.filter((r) => r.marital_status === maritalFilter);
    }

    if (childFilter !== 'all') {
      if (childFilter === '0') list = list.filter((r) => r.num_children === 0);
      if (childFilter === '1+') list = list.filter((r) => r.num_children >= 1);
      if (childFilter === '2+') list = list.filter((r) => r.num_children >= 2);
      if (childFilter === '3+') list = list.filter((r) => r.num_children >= 3);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.marital_status.toLowerCase().includes(s) ||
          String(r.income_from).includes(s) ||
          String(r.income_to).includes(s) ||
          String(r.tax_rate).includes(s) ||
          String(r.tax_amount).includes(s)
      );
    }

    return list;
  }, [rows, maritalFilter, childFilter, search]);

  // paging
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // summary cards
  const total = rows.length;
  const childrenZero = rows.filter((r) => r.num_children === 0).length;
  const childrenOnePlus = rows.filter((r) => r.num_children >= 1).length;
  const maxRate = rows.length ? Math.max(...rows.map((r) => safeNum(r.tax_rate))) : 0;

  const resetForm = () => {
    setForm({
      income_from: 0,
      income_to: 0,
      tax_rate: 0,
      tax_amount: 0,
      marital_status: '',
      num_children: 0,
    });
  };

  // save
  const handleSave = async () => {
    if (!form.marital_status?.trim()) {
      toast.error('Marital status is required');
      return;
    }
    if (safeNum(form.income_from) > safeNum(form.income_to)) {
      toast.error('Income From cannot be greater than Income To');
      return;
    }

    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing
        ? `${API_BASE_URL}/api/master-data/pcb/${editing.id}`
        : `${API_BASE_URL}/api/master-data/pcb`;

      const payload: FormPCB = {
        income_from: safeNum(form.income_from),
        income_to: safeNum(form.income_to),
        tax_rate: safeNum(form.tax_rate),
        tax_amount: safeNum(form.tax_amount),
        marital_status: String(form.marital_status).trim(),
        num_children: Math.max(0, safeNum(form.num_children)),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');

      toast.success(`PCB ${editing ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchPCBs();
    } catch (e) {
      console.error(e);
      toast.error('Failed to save PCB');
    }
  };

  // edit
  const handleEdit = (r: PCB) => {
    setEditing(r);
    setForm({
      income_from: safeNum(r.income_from),
      income_to: safeNum(r.income_to),
      tax_rate: safeNum(r.tax_rate),
      tax_amount: safeNum(r.tax_amount),
      marital_status: r.marital_status ?? '',
      num_children: Math.max(0, safeNum(r.num_children)),
    });
    setShowModal(true);
  };

  // delete
  const askDelete = (r: PCB) => {
    setDeleteTarget(r);
    setShowDelete(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/pcb/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('PCB row deleted');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchPCBs();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">PCB Tax Table</h1>
        <button
          className="btn bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Add PCB Row
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder="Search by marital status, income, rate or amount..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="select select-bordered"
          value={maritalFilter}
          onChange={(e) => {
            setMaritalFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Marital Status</option>
          {maritalOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered"
          value={childFilter}
          onChange={(e) => {
            setChildFilter(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Children</option>
          <option value="0">0</option>
          <option value="1+">≥ 1</option>
          <option value="2+">≥ 2</option>
          <option value="3+">≥ 3</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total Rows</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Marital Types</div>
          <div className="stat-value text-sm">{maritalOptions.length}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Children = 0</div>
          <div className="stat-value text-sm">{childrenZero}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Children ≥ 1</div>
          <div className="stat-value text-sm">{childrenOnePlus}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Max Tax Rate</div>
          <div className="stat-value text-sm">{formatPct(maxRate)}</div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto bg-base-100 rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Income Range</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Marital Status</th>
                <th>Children</th>
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
                  <td colSpan={6} className="text-center py-6">
                    No PCB rows found.
                  </td>
                </tr>
              ) : (
                paged.map((r) => (
                  <tr key={r.id}>
                    <td className="align-top whitespace-nowrap">
                      {formatRM(r.income_from)} – {formatRM(r.income_to)}
                    </td>
                    <td className="align-top">{formatPct(r.tax_rate)}</td>
                    <td className="align-top">{formatRM(r.tax_amount)}</td>
                    <td className="align-top">
                      <span className="badge bg-blue-600 text-white">
                        {r.marital_status || 'N/A'}
                      </span>
                    </td>
                  <td className="align-top">
                    <span className="badge bg-blue-200 text-blue-900">
                      {safeNum(r.num_children)}
                    </span>
                  </td>
                    <td className="align-top">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => handleEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => askDelete(r)}
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
          <div className="p-6 bg-base-100 rounded shadow text-center">No PCB rows found.</div>
        ) : (
          paged.map((r) => (
            <div key={r.id} className="bg-base-100 rounded shadow p-4">
              <div className="flex items-start justify-between">
                <div className="font-semibold">
                  {formatRM(r.income_from)} – {formatRM(r.income_to)}
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => askDelete(r)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Rate</div>
                <div>{formatPct(r.tax_rate)}</div>

                <div className="text-gray-500">Amount</div>
                <div>{formatRM(r.tax_amount)}</div>

                <div className="text-gray-500">Marital</div>
                <div>
                  <span className="badge bg-blue-600 text-white">
                    {r.marital_status || 'N/A'}
                  </span>
                </div>

                <div className="text-gray-500">Children</div>
                <div>
                  <span className="badge bg-blue-200 text-blue-900">
                    {safeNum(r.num_children)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
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


      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {editing ? 'Edit' : 'Create'} PCB Row
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income From */}
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Income From (RM)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full text-black"
                    value={form.income_from}
                    onChange={(e) => setForm({ ...form, income_from: safeNum(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                {/* Income To */}
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Income To (RM)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full text-black"
                    value={form.income_to}
                    onChange={(e) => setForm({ ...form, income_to: safeNum(e.target.value) })}
                    placeholder="0.00"
                  />
                  <div className="label">
                    <span className="label-text-alt text-gray-500">Must be ≥ Income From</span>
                  </div>
                </div>

                {/* Tax Rate */}
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Tax Rate (%)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full text-black"
                    value={form.tax_rate}
                    onChange={(e) => setForm({ ...form, tax_rate: safeNum(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                {/* Tax Amount */}
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Tax Amount (RM)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full text-black"
                    value={form.tax_amount}
                    onChange={(e) => setForm({ ...form, tax_amount: safeNum(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>

                {/* Marital Status */}
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Marital Status *</span>
                  </label>
                  <select
                    className="select select-bordered w-full text-black"
                    value={form.marital_status || ''}
                    onChange={(e) => setForm({ ...form, marital_status: e.target.value })}
                  >
                    <option value="" disabled>Select marital status</option>
                    {modalMaritalOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="label">
                    <span className="label-text-alt text-gray-500">
                      Pick from common options. Existing custom values are included automatically.
                    </span>
                  </div>
                </div>



                {/* Number of Children */}
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Number of Children</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full text-black"
                    value={form.num_children}
                    min={0}
                    onChange={(e) => setForm({ ...form, num_children: Math.max(0, safeNum(e.target.value)) })}
                    placeholder="0"
                  />
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
                {editing ? 'Update' : 'Create'} PCB Row
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
              <h3 className="text-xl font-semibold mb-2">Delete PCB Row</h3>
              <p className="text-gray-600">
                Are you sure you want to delete the row for{' '}
                <span className="font-semibold">
                  {deleteTarget.marital_status || 'N/A'} – {formatRM(deleteTarget.income_from)} to {formatRM(deleteTarget.income_to)}
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
