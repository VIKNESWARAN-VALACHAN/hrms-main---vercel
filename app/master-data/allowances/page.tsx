
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { API_BASE_URL } from '../../config';

// // interface Allowance {
// //   id: number;
// //   name: string;
// //   is_taxable: boolean;
// //   max_limit: number;
// //   is_bonus: boolean;
// //   is_epf_eligible: boolean;
// //   is_socso_eligible: boolean;
// //   is_eis_eligible: boolean;
// //   created_at: string;
// //   updated_at: string;
// // }

// // export default function AllowancePage() {
// //   const [allowances, setAllowances] = useState<Allowance[]>([]);
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [editing, setEditing] = useState<Allowance | null>(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [filterType, setFilterType] = useState<'all' | 'taxable' | 'bonus' | 'statutory'>('all');
// //   const [formData, setFormData] = useState<Omit<Allowance, 'id' | 'created_at' | 'updated_at'>>({
// //     name: '',
// //     is_taxable: false,
// //     max_limit: 0,
// //     is_bonus: false,
// //     is_epf_eligible: false,
// //     is_socso_eligible: false,
// //     is_eis_eligible: false,
// //   });

// //   const itemsPerPage = 10;

// //   const fetchAllowances = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/allowances`);
// //       const data = await res.json();
// //       setAllowances(data || []);
// //     } catch (err) {
// //       toast.error('Failed to fetch allowances');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAllowances();
// //   }, []);

// //   const handleSave = async () => {
// //     if (!formData.name) return toast.error('Name is required');

// //     const method = editing ? 'PUT' : 'POST';
// //     const url = editing
// //       ? `${API_BASE_URL}/api/master-data/allowances/${editing.id}`
// //       : `${API_BASE_URL}/api/master-data/allowances`;

// //     try {
// //       const res = await fetch(url, {
// //         method,
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           ...formData,
// //           max_limit: formData.max_limit ? Number(formData.max_limit) : null,
// //         }),
// //       });
      
// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.error || 'Failed to save');
// //       }
      
// //       toast.success(`Allowance ${editing ? 'updated' : 'created'} successfully`);
// //       setShowModal(false);
// //       setEditing(null);
// //       resetForm();
// //       fetchAllowances();
// //     } catch (error: any) {
// //       toast.error(error.message || 'Failed to save allowance');
// //     }
// //   };

// //   const handleDelete = async (id: number, allowance: Allowance) => {
// //     if (!confirm('Are you sure you want to delete this allowance?')) return;
    
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/allowances/${id}`, {
// //         method: 'DELETE',
// //       });
      
// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.error || 'Failed to delete');
// //       }
      
// //       toast.success('Allowance deleted');
// //       fetchAllowances();
// //     } catch (error: any) {
// //       toast.error(error.message || 'Failed to delete');
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       name: '',
// //       is_taxable: false,
// //       max_limit: 0,
// //       is_bonus: false,
// //       is_epf_eligible: false,
// //       is_socso_eligible: false,
// //       is_eis_eligible: false,
// //     });
// //   };

// //   const getAllowanceType = (allowance: Allowance) => {
// //     const types = [];
// //     if (allowance.is_bonus) types.push('Bonus');
// //     if (allowance.is_taxable) types.push('Taxable');
// //     if (allowance.is_epf_eligible || allowance.is_socso_eligible || allowance.is_eis_eligible) {
// //       types.push('Statutory');
// //     }
// //     return types.length > 0 ? types.join(' • ') : 'Regular';
// //   };

// //   const getAllowanceBadgeClass = (allowance: Allowance) => {
// //     if (allowance.is_bonus) return 'badge badge-success';
// //     if (allowance.is_taxable) return 'badge badge-warning';
// //     if (allowance.is_epf_eligible || allowance.is_socso_eligible || allowance.is_eis_eligible) {
// //       return 'badge badge-info';
// //     }
// //     return 'badge badge-ghost';
// //   };

// //   const getStatutoryEligibility = (allowance: Allowance) => {
// //     const eligible = [];
// //     if (allowance.is_epf_eligible) eligible.push('EPF');
// //     if (allowance.is_socso_eligible) eligible.push('SOCSO');
// //     if (allowance.is_eis_eligible) eligible.push('EIS');
// //     return eligible.length > 0 ? eligible.join(', ') : 'None';
// //   };

// //   // Filter allowances based on selected filter
// //   const getFilteredAllowances = () => {
// //     let filtered = allowances.filter((a) =>
// //       a.name.toLowerCase().includes(search.toLowerCase())
// //     );

// //     if (filterType === 'taxable') {
// //       filtered = filtered.filter(a => a.is_taxable);
// //     } else if (filterType === 'bonus') {
// //       filtered = filtered.filter(a => a.is_bonus);
// //     } else if (filterType === 'statutory') {
// //       filtered = filtered.filter(a => a.is_epf_eligible || a.is_socso_eligible || a.is_eis_eligible);
// //     }

// //     return filtered;
// //   };

// //   const filtered = getFilteredAllowances();
// //   const totalPages = Math.ceil(filtered.length / itemsPerPage);
// //   const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-3xl font-bold">Allowances</h1>
// //         <button
// //           onClick={() => {
// //             setEditing(null);
// //             resetForm();
// //             setShowModal(true);
// //           }}
// //           className="btn btn bg-blue-600 text-white hover:bg-blue-700"
// //         >
// //           Add Allowance
// //         </button>
// //       </div>

// //       {/* Search and Filter Controls */}
// //       <div className="flex gap-4 mb-4">
// //         <input
// //           className="input input-bordered flex-1"
// //           placeholder="Search allowances..."
// //           value={search}
// //           onChange={(e) => {
// //             setSearch(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //         />
// //         <select
// //           className="select select-bordered"
// //           value={filterType}
// //           onChange={(e) => {
// //             setFilterType(e.target.value as 'all' | 'taxable' | 'bonus' | 'statutory');
// //             setCurrentPage(1);
// //           }}
// //         >
// //           <option value="all">All</option>
// //           <option value="taxable">Taxable Only</option>
// //           <option value="bonus">Bonus Only</option>
// //           <option value="statutory">Statutory Eligible</option>
// //         </select>
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">Total Allowances</div>
// //           <div className="stat-value text-primary">{allowances.length}</div>
// //         </div>
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">Taxable</div>
// //           <div className="stat-value text-sm">{allowances.filter(a => a.is_taxable).length}</div>
// //         </div>
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">Bonus</div>
// //           <div className="stat-value text-sm">{allowances.filter(a => a.is_bonus).length}</div>
// //         </div>
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">Statutory Eligible</div>
// //           <div className="stat-value text-sm">
// //             {allowances.filter(a => a.is_epf_eligible || a.is_socso_eligible || a.is_eis_eligible).length}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="overflow-x-auto bg-base-100 rounded shadow">
// //         <table className="table w-full">
// //           <thead>
// //             <tr>
// //               <th>Name</th>
// //               <th>Type</th>
// //               <th>Max Limit</th>
// //               <th>Statutory Eligible</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {loading ? (
// //               <tr>
// //                 <td colSpan={5} className="text-center py-6">
// //                   <span className="loading loading-spinner loading-md"></span>
// //                   Loading...
// //                 </td>
// //               </tr>
// //             ) : paged.length === 0 ? (
// //               <tr>
// //                 <td colSpan={5} className="text-center py-6">
// //                   No allowances found.
// //                 </td>
// //               </tr>
// //             ) : (
// //               paged.map((a) => (
// //                 <tr key={a.id}>
// //                   <td>
// //                 <div className="flex items-center gap-2">
// //                   {a.name}
// //                   {a.is_bonus === true && (
// //                     <div className="tooltip" data-tip="Bonus allowance">
// //                       <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
// //                         <path
// //                           fillRule="evenodd"
// //                           d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
// //                           clipRule="evenodd"
// //                         />
// //                       </svg>
// //                     </div>
// //                   )}
// //                 </div>
// //                   </td>
// //                   <td>
// //                     <span className={getAllowanceBadgeClass(a)}>
// //                       {getAllowanceType(a)}
// //                     </span>
// //                   </td>
// //                   <td>{a.max_limit ? `RM ${a.max_limit}` : 'N/A'}</td>
// //                   <td>
// //                   <div className="flex flex-wrap gap-1">
// //                     {Boolean(a.is_epf_eligible) && <span className="badge badge-primary badge-xs">EPF</span>}
// //                     {Boolean(a.is_socso_eligible) && <span className="badge badge-secondary badge-xs">SOCSO</span>}
// //                     {Boolean(a.is_eis_eligible) && <span className="badge badge-accent badge-xs">EIS</span>}
// //                     {!Boolean(a.is_epf_eligible) && !Boolean(a.is_socso_eligible) && !Boolean(a.is_eis_eligible) && (
// //                       <span className="text-gray-500 text-sm">None</span>
// //                     )}
// //                   </div>

// //                   </td>
// //                   <td>
// //                     <div className="flex gap-2">
// //                       <button
// //                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
// //                         //className="btn btn-sm btn-warning"
// //                         onClick={() => {
// //                           setEditing(a);
// //                           setFormData({
// //                             name: a.name,
// //                             is_taxable: a.is_taxable,
// //                             max_limit: a.max_limit || 0,
// //                             is_bonus: a.is_bonus,
// //                             is_epf_eligible: a.is_epf_eligible,
// //                             is_socso_eligible: a.is_socso_eligible,
// //                             is_eis_eligible: a.is_eis_eligible,
// //                           });
// //                           setShowModal(true);
// //                         }}
// //                       >
// //                         Edit
// //                       </button>
// //                       <button
// //                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
// //                         //className="btn btn-sm btn-error"
// //                         onClick={() => handleDelete(a.id, a)}
// //                       >
// //                         Delete
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {totalPages > 1 && (
// //         <div className="mt-4 flex justify-center gap-2">
// //           <button
// //             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
// //             className="btn btn-sm"
// //             disabled={currentPage === 1}
// //           >
// //             Previous
// //           </button>
// //           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //             <button
// //               key={page}
// //               onClick={() => setCurrentPage(page)}
// //               className={`btn btn-sm ${page === currentPage ? 'btn-primary' : ''}`}
// //             >
// //               {page}
// //             </button>
// //           ))}
// //           <button
// //             onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
// //             className="btn btn-sm"
// //             disabled={currentPage === totalPages}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       )}

// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
// //             <h2 className="text-2xl font-bold mb-6 text-black">
// //               {editing ? 'Edit' : 'Create'} Allowance
// //             </h2>
            
// //             <div className="space-y-6">
// //               {/* Basic Information */}
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <div>
// //                   <label className="label">
// //                     <span className="label-text text-black font-medium">Name *</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     placeholder="Enter allowance name"
// //                     className="input input-bordered w-full text-black"
// //                     value={formData.name}
// //                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                   />
// //                 </div>
                
// //                 <div>
// //                   <label className="label">
// //                     <span className="label-text text-black font-medium">Max Limit (RM)</span>
// //                   </label>
// //                   <input
// //                     type="number"
// //                     step="0.01"
// //                     placeholder="0.00"
// //                     className="input input-bordered w-full text-black"
// //                     value={formData.max_limit}
// //                     onChange={(e) =>
// //                       setFormData({ ...formData, max_limit: parseFloat(e.target.value) || 0 })
// //                     }
// //                   />
// //                   <div className="label">
// //                     <span className="label-text-alt text-gray-500">Leave empty for no limit</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Basic Properties */}
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-4">
// //                     <input
// //                       type="checkbox"
// //                       className="toggle toggle-primary"
// //                       checked={formData.is_taxable}
// //                       onChange={(e) => setFormData({ ...formData, is_taxable: e.target.checked })}
// //                     />
// //                     <span className="label-text text-black font-medium">Is Taxable?</span>
// //                   </label>
// //                 </div>

// //                 <div className="form-control">
// //                   <label className="label cursor-pointer justify-start gap-4">
// //                     <input
// //                       type="checkbox"
// //                       className="toggle toggle-success"
// //                       checked={formData.is_bonus}
// //                       onChange={(e) => setFormData({ ...formData, is_bonus: e.target.checked })}
// //                     />
// //                     <span className="label-text text-black font-medium">Is Bonus?</span>
// //                   </label>
// //                 </div>
// //               </div>

// // {/* Statutory Eligibility */}
// // <div className="border-t pt-4">
// //   <label className="label mb-4">
// //     <span className="label-text text-black font-semibold text-lg">Statutory Eligibility</span>
// //   </label>
  
// //   <div className="flex flex-wrap gap-4">
// //     {/* EPF */}
// //     <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50 flex-1 min-w-[200px]">
// //       <input
// //         type="checkbox"
// //         className="checkbox checkbox-primary checkbox-lg"
// //         checked={formData.is_epf_eligible}
// //         onChange={(e) => setFormData({ ...formData, is_epf_eligible: e.target.checked })}
// //       />
// //       <span className="label-text text-black font-medium text-base">EPF Eligible</span>
// //     </label>

// //     {/* SOCSO */}
// //     <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50 flex-1 min-w-[200px]">
// //       <input
// //         type="checkbox"
// //         className="checkbox checkbox-secondary checkbox-lg"
// //         checked={formData.is_socso_eligible}
// //         onChange={(e) => setFormData({ ...formData, is_socso_eligible: e.target.checked })}
// //       />
// //       <span className="label-text text-black font-medium text-base">SOCSO Eligible</span>
// //     </label>

// //     {/* EIS */}
// //     <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50 flex-1 min-w-[200px]">
// //       <input
// //         type="checkbox"
// //         className="checkbox checkbox-accent checkbox-lg"
// //         checked={formData.is_eis_eligible}
// //         onChange={(e) => setFormData({ ...formData, is_eis_eligible: e.target.checked })}
// //       />
// //       <span className="label-text text-black font-medium text-base">EIS Eligible</span>
// //     </label>
// //   </div>
// // </div>

// //             </div>
            
// //             <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
// //               <button 
// //                 className="btn btn-ghost" 
// //                 onClick={() => {
// //                   setShowModal(false);
// //                   setEditing(null);
// //                   resetForm();
// //                 }}
// //               >
// //                 Cancel
// //               </button>
// //               <button className="btn btn-primary px-6" onClick={handleSave}>
// //                 {editing ? 'Update' : 'Create'} Allowance
// //               </button>
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

// interface Allowance {
//   id: number;
//   name: string;
//   is_taxable: boolean | number;
//   max_limit: number | null;
//   is_bonus: boolean | number;
//   is_epf_eligible: boolean | number;
//   is_socso_eligible: boolean | number;
//   is_eis_eligible: boolean | number;
//   prorate_by_percentage: boolean | number; // NEW
//   created_at: string;
//   updated_at: string;
// }

// type FormAllowance = Omit<
//   Allowance,
//   'id' | 'created_at' | 'updated_at'
// >;

// export default function AllowancePage() {
//   const [allowances, setAllowances] = useState<Allowance[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editing, setEditing] = useState<Allowance | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [filterType, setFilterType] = useState<'all' | 'taxable' | 'bonus' | 'statutory'>('all');

//   const [formData, setFormData] = useState<FormAllowance>({
//     name: '',
//     is_taxable: false,
//     max_limit: 0,
//     is_bonus: false,
//     is_epf_eligible: false,
//     is_socso_eligible: false,
//     is_eis_eligible: false,
//     prorate_by_percentage: false, // NEW default
//   });

//   const itemsPerPage = 10;

//   const normalizeBool = (v: boolean | number | null | undefined) => Boolean(Number(v));

//   const fetchAllowances = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/master-data/allowances`);
//       if (!res.ok) throw new Error('Failed to fetch allowances');
//       const data: Allowance[] = await res.json();

//       // Normalize numeric 0/1 to booleans so UI toggles work reliably
//       const normalized = (data || []).map(a => ({
//         ...a,
//         is_taxable: normalizeBool(a.is_taxable),
//         is_bonus: normalizeBool(a.is_bonus),
//         is_epf_eligible: normalizeBool(a.is_epf_eligible),
//         is_socso_eligible: normalizeBool(a.is_socso_eligible),
//         is_eis_eligible: normalizeBool(a.is_eis_eligible),
//         prorate_by_percentage: normalizeBool(a.prorate_by_percentage), // NEW
//         max_limit: a.max_limit === null ? null : Number(a.max_limit),
//       }));
//       setAllowances(normalized);
//     } catch (err) {
//       toast.error('Failed to fetch allowances');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllowances();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleSave = async () => {
//     if (!formData.name?.trim()) return toast.error('Name is required');

//     const method = editing ? 'PUT' : 'POST';
//     const url = editing
//       ? `${API_BASE_URL}/api/master-data/allowances/${editing.id}`
//       : `${API_BASE_URL}/api/master-data/allowances`;

//     try {
//       const payload = {
//         ...formData,
//         // API expects null for "no limit", else numeric
//         max_limit:
//           formData.max_limit === undefined || formData.max_limit === null
//             ? null
//             : Number(formData.max_limit),
//         // Ensure booleans (server converts to tinyint)
//         is_taxable: Boolean(formData.is_taxable),
//         is_bonus: Boolean(formData.is_bonus),
//         is_epf_eligible: Boolean(formData.is_epf_eligible),
//         is_socso_eligible: Boolean(formData.is_socso_eligible),
//         is_eis_eligible: Boolean(formData.is_eis_eligible),
//         prorate_by_percentage: Boolean(formData.prorate_by_percentage), // NEW
//       };

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.error || 'Failed to save');
//       }

//       toast.success(`Allowance ${editing ? 'updated' : 'created'} successfully`);
//       setShowModal(false);
//       setEditing(null);
//       resetForm();
//       fetchAllowances();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to save allowance');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this allowance?')) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/master-data/allowances/${id}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.error || 'Failed to delete');
//       }

//       toast.success('Allowance deleted');
//       fetchAllowances();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to delete');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       is_taxable: false,
//       max_limit: 0,
//       is_bonus: false,
//       is_epf_eligible: false,
//       is_socso_eligible: false,
//       is_eis_eligible: false,
//       prorate_by_percentage: false, // NEW
//     });
//   };

//   const getAllowanceType = (allowance: Allowance) => {
//     const types: string[] = [];
//     if (normalizeBool(allowance.is_bonus)) types.push('Bonus');
//     if (normalizeBool(allowance.is_taxable)) types.push('Taxable');
//     if (
//       normalizeBool(allowance.is_epf_eligible) ||
//       normalizeBool(allowance.is_socso_eligible) ||
//       normalizeBool(allowance.is_eis_eligible)
//     ) {
//       types.push('Statutory');
//     }
//     return types.length > 0 ? types.join(' • ') : 'Regular';
//   };

//   const getAllowanceBadgeClass = (allowance: Allowance) => {
//     if (normalizeBool(allowance.is_bonus)) return 'badge badge-success';
//     if (normalizeBool(allowance.is_taxable)) return 'badge badge-warning';
//     if (
//       normalizeBool(allowance.is_epf_eligible) ||
//       normalizeBool(allowance.is_socso_eligible) ||
//       normalizeBool(allowance.is_eis_eligible)
//     ) {
//       return 'badge badge-info';
//     }
//     return 'badge badge-ghost';
//   };

//   const getStatutoryEligibility = (allowance: Allowance) => {
//     const eligible: string[] = [];
//     if (normalizeBool(allowance.is_epf_eligible)) eligible.push('EPF');
//     if (normalizeBool(allowance.is_socso_eligible)) eligible.push('SOCSO');
//     if (normalizeBool(allowance.is_eis_eligible)) eligible.push('EIS');
//     return eligible.length > 0 ? eligible.join(', ') : 'None';
//   };

//   // Filter allowances based on selected filter
//   const getFilteredAllowances = () => {
//     let filtered = allowances.filter((a) =>
//       a.name.toLowerCase().includes(search.toLowerCase())
//     );

//     if (filterType === 'taxable') {
//       filtered = filtered.filter(a => normalizeBool(a.is_taxable));
//     } else if (filterType === 'bonus') {
//       filtered = filtered.filter(a => normalizeBool(a.is_bonus));
//     } else if (filterType === 'statutory') {
//       filtered = filtered.filter(
//         a =>
//           normalizeBool(a.is_epf_eligible) ||
//           normalizeBool(a.is_socso_eligible) ||
//           normalizeBool(a.is_eis_eligible)
//       );
//     }

//     return filtered;
//   };

//   const filtered = getFilteredAllowances();
//   const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
//   const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Allowances</h1>
//         <button
//           onClick={() => {
//             setEditing(null);
//             resetForm();
//             setShowModal(true);
//           }}
//           className="btn bg-blue-600 text-white hover:bg-blue-700"
//         >
//           Add Allowance
//         </button>
//       </div>

//       {/* Search and Filter Controls */}
//       <div className="flex gap-4 mb-4">
//         <input
//           className="input input-bordered flex-1"
//           placeholder="Search allowances..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//         <select
//           className="select select-bordered"
//           value={filterType}
//           onChange={(e) => {
//             setFilterType(e.target.value as 'all' | 'taxable' | 'bonus' | 'statutory');
//             setCurrentPage(1);
//           }}
//         >
//           <option value="all">All</option>
//           <option value="taxable">Taxable Only</option>
//           <option value="bonus">Bonus Only</option>
//           <option value="statutory">Statutory Eligible</option>
//         </select>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//         <div className="stat bg-base-100 rounded shadow">
//           <div className="stat-title">Total Allowances</div>
//           <div className="stat-value text-primary">{allowances.length}</div>
//         </div>
//         <div className="stat bg-base-100 rounded shadow">
//           <div className="stat-title">Taxable</div>
//           <div className="stat-value text-sm">
//             {allowances.filter(a => normalizeBool(a.is_taxable)).length}
//           </div>
//         </div>
//         <div className="stat bg-base-100 rounded shadow">
//           <div className="stat-title">Bonus</div>
//           <div className="stat-value text-sm">
//             {allowances.filter(a => normalizeBool(a.is_bonus)).length}
//           </div>
//         </div>
//         <div className="stat bg-base-100 rounded shadow">
//           <div className="stat-title">Statutory Eligible</div>
//           <div className="stat-value text-sm">
//             {
//               allowances.filter(
//                 a =>
//                   normalizeBool(a.is_epf_eligible) ||
//                   normalizeBool(a.is_socso_eligible) ||
//                   normalizeBool(a.is_eis_eligible)
//               ).length
//             }
//           </div>
//         </div>
//         {/* NEW: Prorated */}
//         <div className="stat bg-base-100 rounded shadow">
//           <div className="stat-title">Prorated (%)</div>
//           <div className="stat-value text-sm">
//             {allowances.filter(a => normalizeBool(a.prorate_by_percentage)).length}
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto bg-base-100 rounded shadow">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Type</th>
//               <th>Max Limit</th>
//               <th>Statutory Eligible</th>
//               <th>Prorate</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6">
//                   <span className="loading loading-spinner loading-md"></span>
//                   Loading...
//                 </td>
//               </tr>
//             ) : paged.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6">
//                   No allowances found.
//                 </td>
//               </tr>
//             ) : (
//               paged.map((a) => (
//                 <tr key={a.id}>
//                   <td>
//                     <div className="flex items-center gap-2">
//                       {a.name}
//                       {normalizeBool(a.is_bonus) && (
//                         <div className="tooltip" data-tip="Bonus allowance">
//                           <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
//                             <path
//                               fillRule="evenodd"
//                               d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td>
//                     <span className={getAllowanceBadgeClass(a)}>{getAllowanceType(a)}</span>
//                   </td>
//                   <td>{a.max_limit ? `RM ${Number(a.max_limit).toFixed(2)}` : 'N/A'}</td>
//                   <td>
//                     <div className="flex flex-wrap gap-1">
//                       {normalizeBool(a.is_epf_eligible) && (
//                         <span className="badge badge-primary badge-xs">EPF</span>
//                       )}
//                       {normalizeBool(a.is_socso_eligible) && (
//                         <span className="badge badge-secondary badge-xs">SOCSO</span>
//                       )}
//                       {normalizeBool(a.is_eis_eligible) && (
//                         <span className="badge badge-accent badge-xs">EIS</span>
//                       )}
//                       {!normalizeBool(a.is_epf_eligible) &&
//                         !normalizeBool(a.is_socso_eligible) &&
//                         !normalizeBool(a.is_eis_eligible) && (
//                           <span className="text-gray-500 text-sm">None</span>
//                         )}
//                     </div>
//                   </td>
//                   {/* NEW: Prorate indicator */}
//                   <td>
//                     {normalizeBool(a.prorate_by_percentage) ? (
//                       <span className="badge badge-outline badge-success">Yes (%)</span>
//                     ) : (
//                       <span className="badge badge-ghost">No</span>
//                     )}
//                   </td>
//                   <td>
//                     <div className="flex gap-2">
//                       <button
//                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                         onClick={() => {
//                           setEditing(a);
//                           setFormData({
//                             name: a.name,
//                             is_taxable: normalizeBool(a.is_taxable),
//                             max_limit: a.max_limit ?? 0,
//                             is_bonus: normalizeBool(a.is_bonus),
//                             is_epf_eligible: normalizeBool(a.is_epf_eligible),
//                             is_socso_eligible: normalizeBool(a.is_socso_eligible),
//                             is_eis_eligible: normalizeBool(a.is_eis_eligible),
//                             prorate_by_percentage: normalizeBool(a.prorate_by_percentage), // NEW
//                           });
//                           setShowModal(true);
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                         onClick={() => handleDelete(a.id)}
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

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6 text-black">
//               {editing ? 'Edit' : 'Create'} Allowance
//             </h2>

//             <div className="space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label className="label">
//                     <span className="label-text text-black font-medium">Name *</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter allowance name"
//                     className="input input-bordered w-full text-black"
//                     value={formData.name as string}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   />
//                 </div>

//                 <div>
//                   <label className="label">
//                     <span className="label-text text-black font-medium">Max Limit (RM)</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     placeholder="0.00"
//                     className="input input-bordered w-full text-black"
//                     value={(formData.max_limit ?? 0) as number}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         max_limit: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
//                       })
//                     }
//                   />
//                   <div className="label">
//                     <span className="label-text-alt text-gray-500">Leave empty for no limit</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Basic Properties */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-4">
//                     <input
//                       type="checkbox"
//                       className="toggle toggle-primary"
//                       checked={Boolean(formData.is_taxable)}
//                       onChange={(e) => setFormData({ ...formData, is_taxable: e.target.checked })}
//                     />
//                     <span className="label-text text-black font-medium">Is Taxable?</span>
//                   </label>
//                 </div>

//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-4">
//                     <input
//                       type="checkbox"
//                       className="toggle toggle-success"
//                       checked={Boolean(formData.is_bonus)}
//                       onChange={(e) => setFormData({ ...formData, is_bonus: e.target.checked })}
//                     />
//                     <span className="label-text text-black font-medium">Is Bonus?</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Statutory Eligibility */}
//               <div className="border-t pt-4">
//                 <label className="label mb-4">
//                   <span className="label-text text-black font-semibold text-lg">Statutory Eligibility</span>
//                 </label>

//                 <div className="flex flex-wrap gap-4">
//                   {/* EPF */}
//                   <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50 flex-1 min-w-[200px]">
//                     <input
//                       type="checkbox"
//                       className="checkbox checkbox-primary checkbox-lg"
//                       checked={Boolean(formData.is_epf_eligible)}
//                       onChange={(e) => setFormData({ ...formData, is_epf_eligible: e.target.checked })}
//                     />
//                     <span className="label-text text-black font-medium text-base">EPF Eligible</span>
//                   </label>

//                   {/* SOCSO */}
//                   <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50 flex-1 min-w-[200px]">
//                     <input
//                       type="checkbox"
//                       className="checkbox checkbox-secondary checkbox-lg"
//                       checked={Boolean(formData.is_socso_eligible)}
//                       onChange={(e) => setFormData({ ...formData, is_socso_eligible: e.target.checked })}
//                     />
//                     <span className="label-text text-black font-medium text-base">SOCSO Eligible</span>
//                   </label>

//                   {/* EIS */}
//                   <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50 flex-1 min-w-[200px]">
//                     <input
//                       type="checkbox"
//                       className="checkbox checkbox-accent checkbox-lg"
//                       checked={Boolean(formData.is_eis_eligible)}
//                       onChange={(e) => setFormData({ ...formData, is_eis_eligible: e.target.checked })}
//                     />
//                     <span className="label-text text-black font-medium text-base">EIS Eligible</span>
//                   </label>
//                 </div>
//               </div>

//               {/* NEW: Prorate by Percentage */}
//               <div className="border-t pt-4">
//                 <label className="label cursor-pointer justify-start gap-4">
//                   <input
//                     type="checkbox"
//                     className="toggle toggle-info"
//                     checked={Boolean(formData.prorate_by_percentage)}
//                     onChange={(e) =>
//                       setFormData({ ...formData, prorate_by_percentage: e.target.checked })
//                     }
//                   />
//                   <span className="label-text text-black font-medium">
//                     Prorate by Percentage (apply % for partial months)
//                   </span>
//                 </label>
//                 <div className="label">
//                   <span className="label-text-alt text-gray-500">
//                     Enable this if the allowance should be prorated based on worked days in a month.
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end gap-3 pt-4 border-top border-t">
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
//                 {editing ? 'Update' : 'Create'} Allowance
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

interface Allowance {
  id: number;
  name: string;
  is_taxable: boolean | number;
  max_limit: number | null;
  is_bonus: boolean | number;
  is_epf_eligible: boolean | number;
  is_socso_eligible: boolean | number;
  is_eis_eligible: boolean | number;
  prorate_by_percentage: boolean | number;
  created_at: string;
  updated_at: string;
}

type FormAllowance = Omit<Allowance, 'id' | 'created_at' | 'updated_at'>;

export default function AllowancePage() {
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState<Allowance | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'taxable' | 'bonus' | 'statutory'>('all');

  // delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Allowance | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<FormAllowance>({
    name: '',
    is_taxable: false,
    max_limit: 0,
    is_bonus: false,
    is_epf_eligible: false,
    is_socso_eligible: false,
    is_eis_eligible: false,
    prorate_by_percentage: false,
  });

  const itemsPerPage = 10;
  const normalizeBool = (v: boolean | number | null | undefined) => Boolean(Number(v));

  const fetchAllowances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/allowances`);
      if (!res.ok) throw new Error('Failed to fetch allowances');
      const data: Allowance[] = await res.json();
      const normalized = (data || []).map(a => ({
        ...a,
        is_taxable: normalizeBool(a.is_taxable),
        is_bonus: normalizeBool(a.is_bonus),
        is_epf_eligible: normalizeBool(a.is_epf_eligible),
        is_socso_eligible: normalizeBool(a.is_socso_eligible),
        is_eis_eligible: normalizeBool(a.is_eis_eligible),
        prorate_by_percentage: normalizeBool(a.prorate_by_percentage),
        max_limit: a.max_limit === null ? null : Number(a.max_limit),
      }));
      setAllowances(normalized);
    } catch {
      toast.error('Failed to fetch allowances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowances();
  }, []);

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API_BASE_URL}/api/master-data/allowances/${editing.id}`
      : `${API_BASE_URL}/api/master-data/allowances`;

    try {
      const payload = {
        ...formData,
        max_limit:
          formData.max_limit === undefined || formData.max_limit === null
            ? null
            : Number(formData.max_limit),
        is_taxable: Boolean(formData.is_taxable),
        is_bonus: Boolean(formData.is_bonus),
        is_epf_eligible: Boolean(formData.is_epf_eligible),
        is_socso_eligible: Boolean(formData.is_socso_eligible),
        is_eis_eligible: Boolean(formData.is_eis_eligible),
        prorate_by_percentage: Boolean(formData.prorate_by_percentage),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.error || 'Failed to save');
      }
      toast.success(`Allowance ${editing ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchAllowances();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save allowance');
    }
  };

  // opens confirmation modal
  const askDelete = (a: Allowance) => {
    setDeleteTarget(a);
    setShowDelete(true);
  };

  // called by modal confirm
  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/allowances/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.error || 'Failed to delete');
      }
      toast.success('Allowance deleted');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchAllowances();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      is_taxable: false,
      max_limit: 0,
      is_bonus: false,
      is_epf_eligible: false,
      is_socso_eligible: false,
      is_eis_eligible: false,
      prorate_by_percentage: false,
    });
  };

  // Type badges as array (prevents long “Bonus • Taxable” string wrapping badly)
  const getTypeBadges = (a: Allowance) => {
    const arr: { label: string; cls: string }[] = [];
    if (normalizeBool(a.is_bonus)) arr.push({ label: 'Bonus', cls: 'badge-success' });
    if (normalizeBool(a.is_taxable)) arr.push({ label: 'Taxable', cls: 'badge-warning' });
    if (
      normalizeBool(a.is_epf_eligible) ||
      normalizeBool(a.is_socso_eligible) ||
      normalizeBool(a.is_eis_eligible)
    ) {
      arr.push({ label: 'Statutory', cls: 'badge-info' });
    }
    if (arr.length === 0) arr.push({ label: 'Regular', cls: 'badge-ghost' });
    return arr;
  };

  const filtered = useMemo(() => {
    let list = allowances.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
    if (filterType === 'taxable') list = list.filter(a => normalizeBool(a.is_taxable));
    if (filterType === 'bonus') list = list.filter(a => normalizeBool(a.is_bonus));
    if (filterType === 'statutory')
      list = list.filter(
        a =>
          normalizeBool(a.is_epf_eligible) ||
          normalizeBool(a.is_socso_eligible) ||
          normalizeBool(a.is_eis_eligible)
      );
    return list;
  }, [allowances, search, filterType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Allowances</h1>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Allowance
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder="Search allowances..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="select select-bordered"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="all">All</option>
          <option value="taxable">Taxable Only</option>
          <option value="bonus">Bonus Only</option>
          <option value="statutory">Statutory Eligible</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{allowances.length}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Taxable</div>
          <div className="stat-value text-sm">{allowances.filter(a => normalizeBool(a.is_taxable)).length}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Bonus</div>
          <div className="stat-value text-sm">{allowances.filter(a => normalizeBool(a.is_bonus)).length}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Statutory</div>
          <div className="stat-value text-sm">
            {
              allowances.filter(a =>
                normalizeBool(a.is_epf_eligible) ||
                normalizeBool(a.is_socso_eligible) ||
                normalizeBool(a.is_eis_eligible)
              ).length
            }
          </div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Prorated (%)</div>
          <div className="stat-value text-sm">
            {allowances.filter(a => normalizeBool(a.prorate_by_percentage)).length}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto bg-base-100 rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Max Limit</th>
                <th>Statutory Eligible</th>
                <th>Prorate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <span className="loading loading-spinner loading-md"></span>
                    Loading...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">No allowances found.</td>
                </tr>
              ) : (
                paged.map(a => (
                  <tr key={a.id}>
                    <td className="align-top">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{a.name}</span>
                        {normalizeBool(a.is_bonus) && (
                          <svg className="w-4 h-4 text-success" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* Type -> multiple compact badges that wrap nicely */}
                    <td className="align-top">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {getTypeBadges(a).map((t, i) => (
                          <span key={i} className={`badge ${t.cls} whitespace-nowrap`}>
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="align-top whitespace-nowrap">
                      {a.max_limit ? `RM ${Number(a.max_limit).toFixed(2)}` : 'N/A'}
                    </td>

                    {/* Statutory badges */}
                    <td className="align-top">
                      <div className="flex flex-wrap gap-1">
                        {normalizeBool(a.is_epf_eligible) && <span className="badge badge-primary badge-xs whitespace-nowrap">EPF</span>}
                        {normalizeBool(a.is_socso_eligible) && <span className="badge badge-secondary badge-xs whitespace-nowrap">SOCSO</span>}
                        {normalizeBool(a.is_eis_eligible) && <span className="badge badge-accent badge-xs whitespace-nowrap">EIS</span>}
                        {!normalizeBool(a.is_epf_eligible) &&
                          !normalizeBool(a.is_socso_eligible) &&
                          !normalizeBool(a.is_eis_eligible) && (
                            <span className="text-gray-500 text-sm">None</span>
                          )}
                      </div>
                    </td>

                    {/* Prorate badge – compact + no weird wrap */}
                    <td className="align-top">
                      {normalizeBool(a.prorate_by_percentage) ? (
                        <span className="badge badge-outline badge-success whitespace-nowrap">Yes (%)</span>
                      ) : (
                        <span className="badge badge-ghost whitespace-nowrap">No</span>
                      )}
                    </td>

                    <td className="align-top">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => {
                            setEditing(a);
                            setFormData({
                              name: a.name,
                              is_taxable: normalizeBool(a.is_taxable),
                              max_limit: a.max_limit ?? 0,
                              is_bonus: normalizeBool(a.is_bonus),
                              is_epf_eligible: normalizeBool(a.is_epf_eligible),
                              is_socso_eligible: normalizeBool(a.is_socso_eligible),
                              is_eis_eligible: normalizeBool(a.is_eis_eligible),
                              prorate_by_percentage: normalizeBool(a.prorate_by_percentage),
                            });
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => askDelete(a)}
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
          <div className="p-6 bg-base-100 rounded shadow text-center">No allowances found.</div>
        ) : (
          paged.map(a => (
            <div key={a.id} className="bg-base-100 rounded shadow p-4">
              <div className="flex items-start justify-between">
                <div className="font-semibold">{a.name}</div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      setEditing(a);
                      setFormData({
                        name: a.name,
                        is_taxable: normalizeBool(a.is_taxable),
                        max_limit: a.max_limit ?? 0,
                        is_bonus: normalizeBool(a.is_bonus),
                        is_epf_eligible: normalizeBool(a.is_epf_eligible),
                        is_socso_eligible: normalizeBool(a.is_socso_eligible),
                        is_eis_eligible: normalizeBool(a.is_eis_eligible),
                        prorate_by_percentage: normalizeBool(a.prorate_by_percentage),
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => askDelete(a)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Type</div>
                <div className="flex flex-wrap gap-2">
                  {getTypeBadges(a).map((t, i) => (
                    <span key={i} className={`badge ${t.cls} whitespace-nowrap`}>{t.label}</span>
                  ))}
                </div>

                <div className="text-gray-500">Max Limit</div>
                <div className="whitespace-nowrap">{a.max_limit ? `RM ${Number(a.max_limit).toFixed(2)}` : 'N/A'}</div>

                <div className="text-gray-500">Statutory</div>
                <div className="flex flex-wrap gap-1">
                  {normalizeBool(a.is_epf_eligible) && <span className="badge badge-primary badge-xs whitespace-nowrap">EPF</span>}
                  {normalizeBool(a.is_socso_eligible) && <span className="badge badge-secondary badge-xs whitespace-nowrap">SOCSO</span>}
                  {normalizeBool(a.is_eis_eligible) && <span className="badge badge-accent badge-xs whitespace-nowrap">EIS</span>}
                  {!normalizeBool(a.is_epf_eligible) &&
                    !normalizeBool(a.is_socso_eligible) &&
                    !normalizeBool(a.is_eis_eligible) && <span className="text-gray-500">None</span>}
                </div>

                <div className="text-gray-500">Prorate</div>
                <div>
                  {normalizeBool(a.prorate_by_percentage) ? (
                    <span className="badge badge-outline badge-success whitespace-nowrap">Yes (%)</span>
                  ) : (
                    <span className="badge badge-ghost whitespace-nowrap">No</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="btn btn-sm"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`btn btn-sm ${p === currentPage ? 'btn-primary' : ''}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="btn btn-sm"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit modal (unchanged from your version, keep it) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">{editing ? 'Edit' : 'Create'} Allowance</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Name *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full text-black"
                    value={formData.name as string}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter allowance name"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Max Limit (RM)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full text-black"
                    value={(formData.max_limit ?? 0) as number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_limit: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                  <div className="label">
                    <span className="label-text-alt text-gray-500">Leave empty for no limit</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={Boolean(formData.is_taxable)}
                    onChange={(e) => setFormData({ ...formData, is_taxable: e.target.checked })}
                  />
                  <span className="label-text text-black font-medium">Is Taxable?</span>
                </label>
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={Boolean(formData.is_bonus)}
                    onChange={(e) => setFormData({ ...formData, is_bonus: e.target.checked })}
                  />
                  <span className="label-text text-black font-medium">Is Bonus?</span>
                </label>
              </div>

              <div className="border-t pt-4">
                <label className="label mb-2">
                  <span className="label-text text-black font-semibold text-lg">Statutory Eligibility</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="label cursor-pointer justify-start gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={Boolean(formData.is_epf_eligible)}
                      onChange={(e) => setFormData({ ...formData, is_epf_eligible: e.target.checked })}
                    />
                    <span className="label-text text-black font-medium">EPF Eligible</span>
                  </label>
                  <label className="label cursor-pointer justify-start gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      checked={Boolean(formData.is_socso_eligible)}
                      onChange={(e) => setFormData({ ...formData, is_socso_eligible: e.target.checked })}
                    />
                    <span className="label-text text-black font-medium">SOCSO Eligible</span>
                  </label>
                  <label className="label cursor-pointer justify-start gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent"
                      checked={Boolean(formData.is_eis_eligible)}
                      onChange={(e) => setFormData({ ...formData, is_eis_eligible: e.target.checked })}
                    />
                    <span className="label-text text-black font-medium">EIS Eligible</span>
                  </label>
                </div>
              </div>

            <div className="border-t pt-4">
              <label className="label cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-info mt-1"
                  checked={Boolean(formData.prorate_by_percentage)}
                  onChange={(e) =>
                    setFormData({ ...formData, prorate_by_percentage: e.target.checked })
                  }
                />
                <div className="flex flex-col">
                  <span className="label-text text-black font-medium">Prorate (%)</span>
                  <span className="label-text-alt text-gray-500">
                    Enable to scale allowance for partial months.
                  </span>
                </div>
              </label>
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
                {editing ? 'Update' : 'Create'} Allowance
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
              <h3 className="text-xl font-semibold mb-2">Delete Allowance</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>? This action cannot be undone.
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
