// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { API_BASE_URL } from '@/app/config';
// // import { toast } from 'react-hot-toast';

// // interface Deduction {
// //   id: number;
// //   name: string;
// //   is_recurring: number;
// //   max_limit: number;
// //   is_epf: number;
// //   is_socso: number;
// //   is_eis: number;
// //   created_at: string;
// //   updated_at: string;
// // }

// // export default function DeductionListPage() {
// //   const [deductions, setDeductions] = useState<Deduction[]>([]);
// //   const [search, setSearch] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [editing, setEditing] = useState<Deduction | null>(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [filterType, setFilterType] = useState<'all' | 'statutory' | 'regular'>('all');
// //   const [formData, setFormData] = useState<Omit<Deduction, 'id' | 'created_at' | 'updated_at'>>({
// //     name: '',
// //     is_recurring: 0,
// //     max_limit: 0,
// //     is_epf: 0,
// //     is_socso: 0,
// //     is_eis: 0,
// //   });

// //   const itemsPerPage = 10;

// //   const fetchDeductions = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/deductions`);
// //       const data = await res.json();
// //       setDeductions(data || []);
// //     } catch (err) {
// //       toast.error('Failed to fetch deductions');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchDeductions();
// //   }, []);

// //   const handleSave = async () => {
// //     if (!formData.name) return toast.error('Name is required');

// //     // Validation: Only one statutory flag can be true
// //     const statutoryFlags = [formData.is_epf, formData.is_socso, formData.is_eis];
// //     const activeFlags = statutoryFlags.filter(flag => flag === 1);
// //     if (activeFlags.length > 1) {
// //       return toast.error('A deduction can only be one type: EPF, SOCSO, or EIS');
// //     }

// //     const method = editing ? 'PUT' : 'POST';
// //     const url = editing
// //       ? `${API_BASE_URL}/api/master-data/deductions/${editing.id}`
// //       : `${API_BASE_URL}/api/master-data/deductions`;

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
      
// //       toast.success(`Deduction ${editing ? 'updated' : 'created'} successfully`);
// //       setShowModal(false);
// //       setEditing(null);
// //       resetForm();
// //       fetchDeductions();
// //     } catch (error: any) {
// //       toast.error(error.message || 'Failed to save deduction');
// //     }
// //   };

// //   const handleDelete = async (id: number, deduction: Deduction) => {
// //     // Check if it's a statutory deduction
// //     const isStatutory = deduction.is_epf || deduction.is_socso || deduction.is_eis;
// //     if (isStatutory) {
// //       const statutoryType = deduction.is_epf ? 'EPF' : deduction.is_socso ? 'SOCSO' : 'EIS';
// //       toast.error(`Cannot delete statutory deduction: ${statutoryType}`);
// //       return;
// //     }

// //     if (!confirm('Are you sure you want to delete this deduction?')) return;
    
// //     try {
// //       const res = await fetch(`${API_BASE_URL}/api/master-data/deductions/${id}`, {
// //         method: 'DELETE',
// //       });
      
// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.error || 'Failed to delete');
// //       }
      
// //       toast.success('Deduction deleted');
// //       fetchDeductions();
// //     } catch (error: any) {
// //       toast.error(error.message || 'Failed to delete');
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       name: '',
// //       is_recurring: 0,
// //       max_limit: 0,
// //       is_epf: 0,
// //       is_socso: 0,
// //       is_eis: 0,
// //     });
// //   };

// //   const handleStatutoryChange = (type: 'epf' | 'socso' | 'eis', checked: boolean) => {
// //     if (checked) {
// //       // If checking one, uncheck others
// //       setFormData({
// //         ...formData,
// //         is_epf: type === 'epf' ? 1 : 0,
// //         is_socso: type === 'socso' ? 1 : 0,
// //         is_eis: type === 'eis' ? 1 : 0,
// //       });
// //     } else {
// //       // If unchecking, just uncheck the specific one
// //       setFormData({
// //         ...formData,
// //         [`is_${type}`]: 0,
// //       });
// //     }
// //   };

// //   const getDeductionType = (deduction: Deduction) => {
// //     if (deduction.is_epf) return 'EPF';
// //     if (deduction.is_socso) return 'SOCSO';
// //     if (deduction.is_eis) return 'EIS';
// //     return 'Regular';
// //   };

// //   const getDeductionBadgeClass = (deduction: Deduction) => {
// //     if (deduction.is_epf) return 'badge badge-primary';
// //     if (deduction.is_socso) return 'badge badge-secondary';
// //     if (deduction.is_eis) return 'badge badge-accent';
// //     return 'badge badge-ghost';
// //   };

// //   const isStatutoryDeduction = (deduction: Deduction): boolean => {
// //     return !!(deduction.is_epf || deduction.is_socso || deduction.is_eis);
// //   };

// //   // Filter deductions based on selected filter
// //   const getFilteredDeductions = () => {
// //     let filtered = deductions.filter((d) =>
// //       d.name.toLowerCase().includes(search.toLowerCase())
// //     );

// //     if (filterType === 'statutory') {
// //       filtered = filtered.filter(d => isStatutoryDeduction(d));
// //     } else if (filterType === 'regular') {
// //       filtered = filtered.filter(d => !isStatutoryDeduction(d));
// //     }

// //     return filtered;
// //   };

// //   const filtered = getFilteredDeductions();
// //   const totalPages = Math.ceil(filtered.length / itemsPerPage);
// //   const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between items-center mb-4">
// //         <h1 className="text-3xl font-bold">Deductions</h1>
// //         <button
// //           onClick={() => {
// //             setEditing(null);
// //             resetForm();
// //             setShowModal(true);
// //           }}
// //           className="btn btn-primary"
// //         >
// //           Add Deduction
// //         </button>
// //       </div>

// //       {/* Search and Filter Controls */}
// //       <div className="flex gap-4 mb-4">
// //         <input
// //           className="input input-bordered flex-1"
// //           placeholder="Search deductions..."
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
// //             setFilterType(e.target.value as 'all' | 'statutory' | 'regular');
// //             setCurrentPage(1);
// //           }}
// //         >
// //           <option value="all">All Deductions</option>
// //           <option value="statutory">Statutory Only (EPF/SOCSO/EIS)</option>
// //           <option value="regular">Regular Only</option>
// //         </select>
// //       </div>

// //       {/* Summary Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">Total Deductions</div>
// //           <div className="stat-value text-primary">{deductions.length}</div>
// //         </div>
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">EPF</div>
// //           <div className="stat-value text-sm">{deductions.filter(d => d.is_epf).length}</div>
// //         </div>
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">SOCSO</div>
// //           <div className="stat-value text-sm">{deductions.filter(d => d.is_socso).length}</div>
// //         </div>
// //         <div className="stat bg-base-100 rounded shadow">
// //           <div className="stat-title">EIS</div>
// //           <div className="stat-value text-sm">{deductions.filter(d => d.is_eis).length}</div>
// //         </div>
// //       </div>

// //       <div className="overflow-x-auto bg-base-100 rounded shadow">
// //         <table className="table w-full">
// //           <thead>
// //             <tr>
// //               <th>Name</th>
// //               <th>Type</th>
// //               <th>Recurring</th>
// //               <th>Max Limit</th>
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
// //                   No deductions found.
// //                 </td>
// //               </tr>
// //             ) : (
// //               paged.map((d) => (
// //                 <tr key={d.id} className={isStatutoryDeduction(d) ? 'bg-base-200' : ''}>
// //                   <td>
// //                     <div className="flex items-center gap-2">
// //                       {d.name}
// //                       {isStatutoryDeduction(d) && (
// //                         <div className="tooltip" data-tip="Statutory deduction - cannot be deleted">
// //                           <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
// //                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                           </svg>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </td>
// //                   <td>
// //                     <span className={getDeductionBadgeClass(d)}>
// //                       {getDeductionType(d)}
// //                     </span>
// //                   </td>
// //                   <td>{d.is_recurring ? 'Yes' : 'No'}</td>
// //                   <td>{d.max_limit ? `RM ${d.max_limit}` : 'N/A'}</td>
// //                   <td>
// //                     <div className="flex gap-2">
// //                       <button
// //                         className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
// //                         //className="btn btn-sm btn-warning"
// //                         onClick={() => {
// //                           setEditing(d);
// //                           setFormData({
// //                             name: d.name,
// //                             is_recurring: d.is_recurring,
// //                             max_limit: d.max_limit || 0,
// //                             is_epf: d.is_epf,
// //                             is_socso: d.is_socso,
// //                             is_eis: d.is_eis,
// //                           });
// //                           setShowModal(true);
// //                         }}
// //                       >
// //                         Edit
// //                       </button>
// //                       <button
// //                         className={`btn btn-sm bg-blue-600 text-white hover:bg-blue-700 ${isStatutoryDeduction(d) ? 'btn-disabled' : 'btn-error'}`}
// //                         //className={`btn btn-sm ${isStatutoryDeduction(d) ? 'btn-disabled' : 'btn-error'}`}
// //                         onClick={() => handleDelete(d.id, d)}
// //                         disabled={isStatutoryDeduction(d)}
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
// //               {editing ? 'Edit' : 'Create'} Deduction
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
// //                     placeholder="Enter deduction name"
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
// //                     <span className="label-text-alt text-gray-500">Leave empty for percentage-based deductions</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Recurring Toggle */}
// //               <div className="form-control">
// //                 <label className="label cursor-pointer justify-start gap-4">
// //                   <input
// //                     type="checkbox"
// //                     className="toggle toggle-primary"
// //                     checked={!!formData.is_recurring}
// //                     onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked ? 1 : 0 })}
// //                   />
// //                   <span className="label-text text-black font-medium">Is Recurring?</span>
// //                 </label>
// //               </div>

// //               {/* Statutory Type Selection */}
// //               <div className="border-t pt-4">
// //                 <label className="label mb-4">
// //                   <span className="label-text text-black font-semibold text-lg">Statutory Type</span>
// //                 </label>
                
// //                 <div className="space-y-4">
// //                   <div className="form-control">
// //                     <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
// //                       <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-primary checkbox-lg"
// //                         checked={!!formData.is_epf}
// //                         onChange={(e) => handleStatutoryChange('epf', e.target.checked)}
// //                       />
// //                       <div className="flex-1">
// //                         <span className="label-text text-black font-medium text-base">EPF</span>
// //                         <div className="text-sm text-gray-600">Employees Provident Fund</div>
// //                       </div>
// //                     </label>
// //                   </div>
                  
// //                   <div className="form-control">
// //                     <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
// //                       <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-secondary checkbox-lg"
// //                         checked={!!formData.is_socso}
// //                         onChange={(e) => handleStatutoryChange('socso', e.target.checked)}
// //                       />
// //                       <div className="flex-1">
// //                         <span className="label-text text-black font-medium text-base">SOCSO</span>
// //                         <div className="text-sm text-gray-600">Social Security Organisation</div>
// //                       </div>
// //                     </label>
// //                   </div>
                  
// //                   <div className="form-control">
// //                     <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
// //                       <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-accent checkbox-lg"
// //                         checked={!!formData.is_eis}
// //                         onChange={(e) => handleStatutoryChange('eis', e.target.checked)}
// //                       />
// //                       <div className="flex-1">
// //                         <span className="label-text text-black font-medium text-base">EIS</span>
// //                         <div className="text-sm text-gray-600">Employment Insurance System</div>
// //                       </div>
// //                     </label>
// //                   </div>
// //                 </div>
                
// //                 <div className="mt-4 p-3 bg-blue-50 rounded-lg">
// //                   <div className="flex items-start gap-2">
// //                     <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                     </svg>
// //                     <div>
// //                       <p className="text-sm font-medium text-blue-800">Statutory Type Selection</p>
// //                       <p className="text-sm text-blue-700">Select only one statutory type, or leave all unchecked for regular deductions.</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
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
// //                 {editing ? 'Update' : 'Create'} Deduction
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is installed and configured
// import { API_BASE_URL } from '../../config';

// // Define the interface for a Deduction, including the new fields
// interface Deduction {
//   id: number;
//   name: string;
//   max_limit: number | null;
//   is_recurring: number; // Added is_recurring based on backend
//   is_epf: number;
//   is_socso: number;
//   is_eis: number;
//   prorate_by_percentage: number; // New column
//   is_bonus: number;              // New column
//   is_taxable: number;            // New column
//   created_at: string;
//   updated_at: string;
// }

// export default function DeductionListPage() {
//   const [deductions, setDeductions] = useState<Deduction[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editing, setEditing] = useState<Deduction | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // State for delete confirmation modal
//   const [deductionToDelete, setDeductionToDelete] = useState<{ id: number; data: Deduction } | null>(null); // State to hold deduction to delete
//   //const [filterType, setFilterType] = useState<'all' | 'statutory' | 'regular'>('all');
//   const [filterType, setFilterType] = useState<'all' | 'taxable' | 'bonus' | 'statutory'>('all');

//   // Initialize formData with all fields, including the new ones
//   const [formData, setFormData] = useState<Omit<Deduction, 'id' | 'created_at' | 'updated_at'>>({
//     name: '',
//     max_limit: 0,
//     is_recurring: 0, // Added is_recurring to formData
//     is_epf: 0,
//     is_socso: 0,
//     is_eis: 0,
//     prorate_by_percentage: 0, // New field
//     is_bonus: 0,              // New field
//     is_taxable: 0,            // New field
//   });

//   const itemsPerPage = 10;

//   // Function to reset the form data
//   const resetForm = useCallback(() => {
//     setFormData({ 
//       name: '', 
//       max_limit: 0, 
//       is_recurring: 0, // Reset is_recurring
//       is_epf: 0, 
//       is_socso: 0, 
//       is_eis: 0,
//       prorate_by_percentage: 0, // Reset new field
//       is_bonus: 0,              // Reset new field
//       is_taxable: 0,            // Reset new field
//     });
//   }, []);

//   // Function to fetch deductions based on filter type
//   const fetchDeductions = useCallback(async () => {
//     setLoading(true);
//     try {
//       let url = `${API_BASE_URL}/api/master-data/deductions`; // Default to all deductions
//       if (filterType !== 'all') {
//         url += `?filter=${filterType}`;
//       }
//       const res = await fetch(url);
//       const data = await res.json();
//       setDeductions(data || []);
//     } catch (err) {
//       console.error('Failed to fetch deductions:', err);
//       toast.error('Failed to fetch deductions');
//     } finally {
//       setLoading(false);
//     }
//   }, [filterType]); // Re-run when filterType changes


//   useEffect(() => {
//   fetchDeductions();
// }, [fetchDeductions]); 

//   const getTypeLabel = (d: Deduction) => {
//     const labels = [];
//     if (d.is_taxable) labels.push('Taxable');
//     if (d.is_epf || d.is_socso || d.is_eis) labels.push('Statutory');
//     return labels.join(' • ') || 'Regular';
//   };

//   const renderStatutoryEligibility = (d: Deduction) => {
//     const eligibility: string[] = [];
//     if (d.is_epf) eligibility.push('EPF');
//     if (d.is_socso) eligibility.push('SOCSO');
//     if (d.is_eis) eligibility.push('EIS');
//     if (eligibility.length === 0) return <span className="text-gray-400 text-sm">None</span>;
//     return (
//       <div className="flex flex-wrap gap-1">
//         {eligibility.includes('EPF') && <span className="badge badge-primary badge-xs">EPF</span>}
//         {eligibility.includes('SOCSO') && <span className="badge badge-secondary badge-xs">SOCSO</span>}
//         {eligibility.includes('EIS') && <span className="badge badge-accent badge-xs">EIS</span>}
//       </div>
//     );
//   };

//   // Handle saving (creating or updating) a deduction
//   const handleSave = async () => {
//     if (!formData.name) {
//       toast.error('Name is required');
//       return;
//     }
//     const method = editing ? 'PUT' : 'POST';
//     const url = editing
//       ? `${API_BASE_URL}/api/master-data/deductions/${editing.id}`
//       : `${API_BASE_URL}/api/master-data/deductions`;

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData), // formData now includes new fields
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to save');
//       }

//       toast.success(`Deduction ${editing ? 'updated' : 'created'} successfully`);
//       setShowModal(false);
//       setEditing(null);
//       resetForm();
//       fetchDeductions(); // Re-fetch deductions to update the list
//     } catch (error: any) {
//       console.error('Save error:', error);
//       toast.error(error.message || 'Save error');
//     }
//   };

//   // Prepare for deletion by showing confirmation modal
//   const confirmDelete = (id: number, d: Deduction) => {
//     setDeductionToDelete({ id, data: d });
//     setShowDeleteConfirmModal(true);
//   };

//   // Handle actual deletion after confirmation
//   const handleDelete = async () => {
//     if (!deductionToDelete) return; // Should not happen if modal is shown correctly

//     const { id } = deductionToDelete;
    
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/master-data/deductions/${id}`, {
//         method: 'DELETE',
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Delete error');
//       }

//       toast.success('Deduction deleted');
//       setShowDeleteConfirmModal(false); // Close confirmation modal
//       setDeductionToDelete(null); // Clear deduction to delete
//       fetchDeductions(); // Re-fetch deductions to update the list
//     } catch (error: any) {
//       console.error('Delete failed:', error);
//       toast.error(error.message || 'Delete failed');
//     }
//   };


//   const getTypeBadgeClass = (d: Deduction) => {
//     if (d.is_bonus) return 'badge badge-success';
//     if (d.is_taxable) return 'badge badge-warning';
//     if (d.is_epf || d.is_socso || d.is_eis) return 'badge badge-info';
//     return 'badge badge-ghost';
//   };

//   // Filter deductions based on search term and filter type
// const filteredDeductions = deductions.filter((d) => {
//   const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
//   const isStatutory = d.is_epf || d.is_socso || d.is_eis;

//   if (filterType === 'taxable' && d.is_taxable !== 1) return false;
//   if (filterType === 'bonus' && d.is_bonus !== 1) return false;
//   if (filterType === 'statutory' && !isStatutory) return false;

//   return matchesSearch;
// });



//   const totalPages = Math.ceil(filteredDeductions.length / itemsPerPage);
//   const pagedDeductions = filteredDeductions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Deductions</h1>
//         <button
//           onClick={() => {
//             setEditing(null);
//             resetForm();
//             setShowModal(true);
//           }}
//           className="btn btn bg-blue-600 text-white hover:bg-blue-700"
//         >
//           Add Deduction
//         </button>
//       </div>

//   {/* Search and Filter Controls */}
//   <div className="flex gap-4 mb-4">
//     <input
//       className="input input-bordered flex-1"
//       placeholder="Search deductions..."
//       value={search}
//       onChange={(e) => {
//         setSearch(e.target.value);
//         setCurrentPage(1);
//       }}
//     />
//     <select
//       className="select select-bordered"
//       value={filterType}
//       onChange={(e) => {
//         setFilterType(e.target.value as 'all' | 'taxable' | 'bonus' | 'statutory');
//         setCurrentPage(1);
//       }}
//     >
//       <option value="all">All</option>
//       <option value="taxable">Taxable Only</option>
//       <option value="bonus">Bonus Only</option>
//       <option value="statutory">Statutory Eligible</option>
//     </select>
//   </div>



// {/* Summary Cards */}
// <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//   <div className="stat bg-base-100 rounded shadow">
//     <div className="stat-title">Total Deductions</div>
//     <div className="stat-value text-primary">{deductions.length}</div>
//   </div>
//   <div className="stat bg-base-100 rounded shadow">
//     <div className="stat-title">Taxable</div>
//     <div className="stat-value text-sm">{deductions.filter(d => d.is_taxable).length}</div>
//   </div>
//   <div className="stat bg-base-100 rounded shadow">
//     <div className="stat-title">Bonus</div>
//     <div className="stat-value text-sm">{deductions.filter(d => d.is_bonus).length}</div>
//   </div>
//   <div className="stat bg-base-100 rounded shadow">
//     <div className="stat-title">Statutory Eligible</div>
//     <div className="stat-value text-sm">
//       {deductions.filter(d => d.is_epf || d.is_socso || d.is_eis).length}
//     </div>
//   </div>
// </div>


//       {/* Table View */}
//       <div className="overflow-x-auto bg-base-100 rounded shadow">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Type</th>
//               <th>Max Limit</th>
//               <th>Statutory Eligible</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={5} className="text-center">Loading...</td></tr>
//             ) : pagedDeductions.length === 0 ? (
//               <tr><td colSpan={5} className="text-center">No deductions found.</td></tr>
//             ) : 
//             (
//               pagedDeductions
//                 .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
//                 .map(d => (
//                   <tr key={d.id}>
//                     <td>{d.name}</td>
//                     <td><span className={getTypeBadgeClass(d)}>{getTypeLabel(d)}</span></td>
//                     <td>{d.max_limit ? `RM ${d.max_limit}` : 'N/A'}</td>
//                     <td>{renderStatutoryEligibility(d)}</td>
//                     <td>
//                       <div className="flex gap-2">
//                       <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
//                         setEditing(d);
//                         setFormData({
//                           name: d.name,
//                           max_limit: d.max_limit || 0,
//                           is_recurring: d.is_recurring,
//                           is_epf: d.is_epf,
//                           is_socso: d.is_socso,
//                           is_eis: d.is_eis,
//                           prorate_by_percentage: d.prorate_by_percentage,
//                           is_bonus: d.is_bonus,
//                           is_taxable: d.is_taxable,
//                         });
//                         setShowModal(true);
//                       }}>Edit</button>
//                         <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => confirmDelete(d.id, d)}>Delete</button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6">
//           <div className="join">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
//                 onClick={() => setCurrentPage(page)}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//        {/* Modal Form for Add/Edit */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-6 text-black">
//               {editing ? 'Edit' : 'Create'} Deduction
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
//                     placeholder="Enter deduction name"
//                     className="input input-bordered w-full text-black"
//                     value={formData.name}
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
//                     value={formData.max_limit ?? ''} // Use nullish coalescing for empty string
//                     onChange={(e) =>
//                       setFormData({ ...formData, max_limit: parseFloat(e.target.value) || 0 })
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
//                       className="toggle toggle-success" // Changed to success for consistency
//                       checked={formData.is_taxable === 1} // Check against 1
//                       onChange={(e) => setFormData({ ...formData, is_taxable: e.target.checked ? 1 : 0 })} // Set 1 or 0
//                     />
//                     <span className="label-text text-black font-medium">Is Taxable?</span>
//                   </label>
//                 </div>

//                 <div className="form-control">
//                   <label className="label cursor-pointer justify-start gap-4">
//                     <input
//                       type="checkbox"
//                       className="toggle toggle-success"
//                       checked={formData.is_bonus === 1} // Check against 1
//                       onChange={(e) => setFormData({ ...formData, is_bonus: e.target.checked ? 1 : 0 })} // Set 1 or 0
//                     />
//                     <span className="label-text text-black font-medium">Is Bonus?</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Statutory Eligibility */}
// {/* Statutory Eligibility */}
// <div className="border-t pt-4">
//   <label className="label mb-4">
//     <span className="label-text text-black font-semibold text-lg">Statutory Eligibility</span>
//   </label>

//   <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
//     {/* EPF */}
//     <label className="cursor-pointer flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
//       <input
//         type="checkbox"
//         className="checkbox checkbox-primary checkbox-lg"
//         checked={formData.is_epf === 1}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             is_epf: e.target.checked ? 1 : 0,
//           })
//         }
//       />
//       <span className="label-text text-black font-medium text-base">EPF Eligible</span>
//     </label>

//     {/* SOCSO */}
//     <label className="cursor-pointer flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
//       <input
//         type="checkbox"
//         className="checkbox checkbox-secondary checkbox-lg"
//         checked={formData.is_socso === 1}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             is_socso: e.target.checked ? 1 : 0,
//           })
//         }
//       />
//       <span className="label-text text-black font-medium text-base">SOCSO Eligible</span>
//     </label>

//     {/* EIS */}
//     <label className="cursor-pointer flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
//       <input
//         type="checkbox"
//         className="checkbox checkbox-accent checkbox-lg"
//         checked={formData.is_eis === 1}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             is_eis: e.target.checked ? 1 : 0,
//           })
//         }
//       />
//       <span className="label-text text-black font-medium text-base">EIS Eligible</span>
//     </label>
//   </div>
// </div>

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
//                 {editing ? 'Update' : 'Create'} Deduction
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirmModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
//             <p className="mb-6 text-black">Are you sure you want to delete the deduction "{deductionToDelete?.data.name}"?</p>
//             <div className="flex justify-end gap-2">
//               <button 
//                 className="btn btn-ghost" 
//                 onClick={() => { 
//                   setShowDeleteConfirmModal(false); 
//                   setDeductionToDelete(null); 
//                 }}
//               >
//                 Cancel
//               </button>
//               <button className="btn btn-error" onClick={handleDelete}>Delete</button>
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

interface Deduction {
  id: number;
  name: string;
  max_limit: number | null;
  is_recurring: number;         // kept for future use (not shown in UI here)
  is_epf: number;
  is_socso: number;
  is_eis: number;
  prorate_by_percentage: number; // 0/1 from backend
  is_bonus: number;              // 0/1 from backend
  is_taxable: number;            // 0/1 from backend
  created_at: string;
  updated_at: string;
}

type FormDeduction = Omit<Deduction, 'id' | 'created_at' | 'updated_at'>;

export default function DeductionListPage() {
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState<Deduction | null>(null);
  const [showModal, setShowModal] = useState(false);

  // delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Deduction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [filterType, setFilterType] = useState<'all' | 'taxable' | 'bonus' | 'statutory'>('all');

  const [formData, setFormData] = useState<FormDeduction>({
    name: '',
    max_limit: 0,
    is_recurring: 0,
    is_epf: 0,
    is_socso: 0,
    is_eis: 0,
    prorate_by_percentage: 0,
    is_bonus: 0,
    is_taxable: 0,
  });

  const itemsPerPage = 10;

  const normalizeBool = (v: number | boolean | null | undefined) => Boolean(Number(v));

  const fetchDeductions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/deductions`);
      if (!res.ok) throw new Error('Failed to fetch deductions');
      const data: Deduction[] = await res.json();
      const normalized = (data || []).map((d) => ({
        ...d,
        max_limit: d.max_limit === null ? null : Number(d.max_limit),
        // keep flags as numbers for save, but we’ll render via normalizeBool()
      }));
      setDeductions(normalized);
    } catch {
      toast.error('Failed to fetch deductions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeductions();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      max_limit: 0,
      is_recurring: 0,
      is_epf: 0,
      is_socso: 0,
      is_eis: 0,
      prorate_by_percentage: 0,
      is_bonus: 0,
      is_taxable: 0,
    });
  };

  // Compact “type” badges like the allowance page
  const getTypeBadges = (d: Deduction) => {
    const arr: { label: string; cls: string }[] = [];
    if (normalizeBool(d.is_bonus)) arr.push({ label: 'Bonus', cls: 'badge-success' });
    if (normalizeBool(d.is_taxable)) arr.push({ label: 'Taxable', cls: 'badge-warning' });
    if (normalizeBool(d.is_epf) || normalizeBool(d.is_socso) || normalizeBool(d.is_eis)) {
      arr.push({ label: 'Statutory', cls: 'badge-info' });
    }
    if (arr.length === 0) arr.push({ label: 'Regular', cls: 'badge-ghost' });
    return arr;
  };

  const filtered = useMemo(() => {
    let list = deductions.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    if (filterType === 'taxable') list = list.filter((d) => normalizeBool(d.is_taxable));
    if (filterType === 'bonus') list = list.filter((d) => normalizeBool(d.is_bonus));
    if (filterType === 'statutory')
      list = list.filter(
        (d) =>
          normalizeBool(d.is_epf) ||
          normalizeBool(d.is_socso) ||
          normalizeBool(d.is_eis)
      );
    return list;
  }, [deductions, search, filterType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const askDelete = (d: Deduction) => {
    setDeleteTarget(d);
    setShowDelete(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/master-data/deductions/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.error || 'Failed to delete');
      }
      toast.success('Deduction deleted');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchDeductions();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Name is required');
      return;
    }

    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API_BASE_URL}/api/master-data/deductions/${editing.id}`
      : `${API_BASE_URL}/api/master-data/deductions`;

    try {
      // convert booleans -> 0/1 explicitly (formData holds numbers, but ensure safe)
      const payload = {
        ...formData,
        max_limit:
          formData.max_limit === undefined || formData.max_limit === null
            ? null
            : Number(formData.max_limit),
        is_recurring: Number(Boolean(formData.is_recurring)),
        is_epf: Number(Boolean(formData.is_epf)),
        is_socso: Number(Boolean(formData.is_socso)),
        is_eis: Number(Boolean(formData.is_eis)),
        prorate_by_percentage: Number(Boolean(formData.prorate_by_percentage)),
        is_bonus: Number(Boolean(formData.is_bonus)),
        is_taxable: Number(Boolean(formData.is_taxable)),
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
      toast.success(`Deduction ${editing ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchDeductions();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save deduction');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Deductions</h1>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Deduction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder="Search deductions..."
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

      {/* Summary cards (mirror allowance) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{deductions.length}</div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Taxable</div>
          <div className="stat-value text-sm">
            {deductions.filter((d) => normalizeBool(d.is_taxable)).length}
          </div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Bonus</div>
          <div className="stat-value text-sm">
            {deductions.filter((d) => normalizeBool(d.is_bonus)).length}
          </div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Statutory</div>
          <div className="stat-value text-sm">
            {
              deductions.filter(
                (d) => normalizeBool(d.is_epf) || normalizeBool(d.is_socso) || normalizeBool(d.is_eis)
              ).length
            }
          </div>
        </div>
        <div className="stat bg-base-100 rounded shadow">
          <div className="stat-title">Prorated (%)</div>
          <div className="stat-value text-sm">
            {deductions.filter((d) => normalizeBool(d.prorate_by_percentage)).length}
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
                  <td colSpan={6} className="text-center py-6">No deductions found.</td>
                </tr>
              ) : (
                paged.map((d) => (
                  <tr key={d.id}>
                    <td className="align-top">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{d.name}</span>
                        {normalizeBool(d.is_bonus) && (
                          <svg className="w-4 h-4 text-success" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </td>

                    <td className="align-top">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {getTypeBadges(d).map((t, i) => (
                          <span key={i} className={`badge ${t.cls} whitespace-nowrap`}>{t.label}</span>
                        ))}
                      </div>
                    </td>

                    <td className="align-top whitespace-nowrap">
                      {d.max_limit ? `RM ${Number(d.max_limit).toFixed(2)}` : 'N/A'}
                    </td>

                    <td className="align-top">
                      <div className="flex flex-wrap gap-1">
                        {normalizeBool(d.is_epf) && <span className="badge badge-primary badge-xs whitespace-nowrap">EPF</span>}
                        {normalizeBool(d.is_socso) && <span className="badge badge-secondary badge-xs whitespace-nowrap">SOCSO</span>}
                        {normalizeBool(d.is_eis) && <span className="badge badge-accent badge-xs whitespace-nowrap">EIS</span>}
                        {!normalizeBool(d.is_epf) && !normalizeBool(d.is_socso) && !normalizeBool(d.is_eis) && (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </div>
                    </td>

                    <td className="align-top">
                      {normalizeBool(d.prorate_by_percentage) ? (
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
                            setEditing(d);
                            setFormData({
                              name: d.name,
                              max_limit: d.max_limit ?? 0,
                              is_recurring: d.is_recurring,
                              is_epf: d.is_epf,
                              is_socso: d.is_socso,
                              is_eis: d.is_eis,
                              prorate_by_percentage: d.prorate_by_percentage,
                              is_bonus: d.is_bonus,
                              is_taxable: d.is_taxable,
                            });
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => askDelete(d)}
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
          <div className="p-6 bg-base-100 rounded shadow text-center">No deductions found.</div>
        ) : (
          paged.map((d) => (
            <div key={d.id} className="bg-base-100 rounded shadow p-4">
              <div className="flex items-start justify-between">
                <div className="font-semibold">{d.name}</div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      setEditing(d);
                      setFormData({
                        name: d.name,
                        max_limit: d.max_limit ?? 0,
                        is_recurring: d.is_recurring,
                        is_epf: d.is_epf,
                        is_socso: d.is_socso,
                        is_eis: d.is_eis,
                        prorate_by_percentage: d.prorate_by_percentage,
                        is_bonus: d.is_bonus,
                        is_taxable: d.is_taxable,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => askDelete(d)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Type</div>
                <div className="flex flex-wrap gap-2">
                  {getTypeBadges(d).map((t, i) => (
                    <span key={i} className={`badge ${t.cls} whitespace-nowrap`}>{t.label}</span>
                  ))}
                </div>

                <div className="text-gray-500">Max Limit</div>
                <div className="whitespace-nowrap">
                  {d.max_limit ? `RM ${Number(d.max_limit).toFixed(2)}` : 'N/A'}
                </div>

                <div className="text-gray-500">Statutory</div>
                <div className="flex flex-wrap gap-1">
                  {normalizeBool(d.is_epf) && <span className="badge badge-primary badge-xs whitespace-nowrap">EPF</span>}
                  {normalizeBool(d.is_socso) && <span className="badge badge-secondary badge-xs whitespace-nowrap">SOCSO</span>}
                  {normalizeBool(d.is_eis) && <span className="badge badge-accent badge-xs whitespace-nowrap">EIS</span>}
                  {!normalizeBool(d.is_epf) &&
                    !normalizeBool(d.is_socso) &&
                    !normalizeBool(d.is_eis) && <span className="text-gray-500">None</span>}
                </div>

                <div className="text-gray-500">Prorate</div>
                <div>
                  {normalizeBool(d.prorate_by_percentage) ? (
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="btn btn-sm"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {editing ? 'Edit' : 'Create'} Deduction
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text text-black font-medium">Name *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full text-black"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter deduction name"
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
                    onChange={(e) => setFormData({ ...formData, is_taxable: e.target.checked ? 1 : 0 })}
                  />
                  <span className="label-text text-black font-medium">Is Taxable?</span>
                </label>
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={Boolean(formData.is_bonus)}
                    onChange={(e) => setFormData({ ...formData, is_bonus: e.target.checked ? 1 : 0 })}
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
                      checked={Boolean(formData.is_epf)}
                      onChange={(e) => setFormData({ ...formData, is_epf: e.target.checked ? 1 : 0 })}
                    />
                    <span className="label-text text-black font-medium">EPF Eligible</span>
                  </label>
                  <label className="label cursor-pointer justify-start gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      checked={Boolean(formData.is_socso)}
                      onChange={(e) => setFormData({ ...formData, is_socso: e.target.checked ? 1 : 0 })}
                    />
                    <span className="label-text text-black font-medium">SOCSO Eligible</span>
                  </label>
                  <label className="label cursor-pointer justify-start gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent"
                      checked={Boolean(formData.is_eis)}
                      onChange={(e) => setFormData({ ...formData, is_eis: e.target.checked ? 1 : 0 })}
                    />
                    <span className="label-text text-black font-medium">EIS Eligible</span>
                  </label>
                </div>
              </div>

              {/* Prorate block – same as allowance wording */}
              <div className="border-t pt-4">
                <label className="label cursor-pointer items-start gap-4">
                  <input
                    type="checkbox"
                    className="toggle toggle-info mt-1"
                    checked={Boolean(formData.prorate_by_percentage)}
                    onChange={(e) =>
                      setFormData({ ...formData, prorate_by_percentage: e.target.checked ? 1 : 0 })
                    }
                  />
                  <div className="flex flex-col">
                    <span className="label-text text-black font-medium">Prorate (%)</span>
                    <span className="label-text-alt text-gray-500">
                      Adjust allowance for partial months
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
                {editing ? 'Update' : 'Create'} Deduction
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
              <h3 className="text-xl font-semibold mb-2">Delete Deduction</h3>
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
