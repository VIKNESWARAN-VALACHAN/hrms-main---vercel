// import React, { useState, useEffect, useCallback  } from 'react';
// import Link from 'next/link';
// import { FaRegCalendarTimes } from "react-icons/fa";
// import { MdFamilyRestroom } from "react-icons/md";
// import { BsBag } from "react-icons/bs";
// import { MdOutlineSick } from "react-icons/md";
// import { RiGraduationCapLine } from "react-icons/ri";
// import { FaHandHoldingHeart } from "react-icons/fa";
// import { LuPartyPopper } from "react-icons/lu";
// import { LiaBriefcaseMedicalSolid } from "react-icons/lia";
// import { BsAirplaneFill } from "react-icons/bs";
// import { BsPencil } from "react-icons/bs";
// import { BsEye } from "react-icons/bs";
// import { BsTrash } from "react-icons/bs";
// import { FaClockRotateLeft } from "react-icons/fa6";
// import { FaChevronDown } from "react-icons/fa";
// import { Toaster, toast } from 'react-hot-toast';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { pluralize } from '../utils/utils';
// import NotificationToast from '../components/NotificationToast';
// import { useNotification } from '../hooks/useNotification';
// import { useTheme } from '../components/ThemeProvider';

// // Year-of-service brackets already used by your table
// interface YearOfServiceBracket {
//   min_years: number;     // inclusive
//   max_years: number|null; // null = open-ended
//   days: number;          // allocation for this bracket
// }

// // New accrual/renewal support
// type AccrualFrequency = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
// type RenewalPeriod = 'NONE' | 'YEARLY' | 'QUARTERLY';

// /* ===== Add near the top of your component (types & helpers) ===== */
// type AllocationPrimary = 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
// type EligibilityScope = 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF';


// interface LeaveType {
//   id: number;
//   leave_type_name: string;
//   code: string;
//   description: string;
//   is_total: boolean;
//   total_type: string; // 'IMMEDIATE' | 'ONCE CONFIRMED'
//   is_divident: boolean;
//   increment_days: number;
//   max_increment_days: number;
//   carry_forward_days: number;
//   max_days: number;
//   company_id: string;
//   company_name: string | null;
//   requires_approval: boolean;
//   requires_documentation: boolean;
//   is_active: boolean;
//   isNewLeaveType: boolean;

//   earn_days_per_month?: number;
//   yos_brackets?: YearOfServiceBracket[];

//   // ... your existing fields ...
//   allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
//   eligibility_scope?:  'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF';

//   // EARN policy
//   accrual_frequency?: AccrualFrequency;  // MONTHLY | QUARTERLY | YEARLY
//   accrual_rate?: number | null;          // days per period
//   earn_prorate_join_month?: boolean;

//   // Renewal / cut-off
//   renewal_period?: RenewalPeriod;        // NONE | YEARLY | QUARTERLY
  
//   expire_unused_at_period_end?: boolean; // if true => use-it-or-lose-it per *accrual* period
//   carryover_max_days?: number;           // used when renewal is YEARLY/QUARTERLY and not expiring per period
//   carryover_expiry_months?: number | null; // optional expiry for carried days               // optional: prorate final period on exit
// }


// const LeaveType = () => {
//   const { theme } = useTheme();
//   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
//   const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<LeaveType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCompany, setSelectedCompany] = useState('all');
//   const [selectedDepartment, setSelectedDepartment] = useState('all');
//   const [selectedPosition, setSelectedPosition] = useState('all');
//   const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
//   const [editForm, setEditForm] = useState<Partial<LeaveType>>({});

// const [addForm, setAddForm] = useState<Partial<LeaveType>>({
//   // existing
//   leave_type_name: '',
//   code: '',
//   description: '',
//   max_days: 0,
//   is_total: true,
//   total_type: 'IMMEDIATE',
//   is_divident: false,
//   increment_days: 0,
//   max_increment_days: 0,
//   carry_forward_days: 0,
//   requires_approval: true,
//   requires_documentation: false,
//   is_active: true,
//   company_id: '0',
//   isNewLeaveType: true,

//   // ... your existing defaults ...
//   allocation_primary: 'IMMEDIATE',
//   eligibility_scope: 'ALL_STAFF',

//   // EARN defaults
//   accrual_frequency: 'MONTHLY',
//   accrual_rate: 1,                 // "Days earned per period"
//   earn_prorate_join_month: true,

//   // Renewal / cut-off defaults
//   // For “monthly accrual + quarterly refresh (use-it-or-lose-it)”
//   renewal_period: 'QUARTERLY',     // QUARTERLY reset at quarter end
//   expire_unused_at_period_end: false, // keep period rollover inside quarter
//   carryover_max_days: 0,              // quarter-end: forfeit all (0), or carry some if >0
//   carryover_expiry_months: null,
// });

  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
  
//   const { notification, showNotification } = useNotification();




// // YOS helpers
// const updateYosBracket = (idx: number, field: keyof YearOfServiceBracket, value: number | null) => {
//   setAddForm((prev: any) => {
//     const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
//     const row = { ...(list[idx] ?? { min_years: 0, max_years: null, days: 0 }) };
//     (row as any)[field] = value;
//     list[idx] = row;
//     return { ...prev, yos_brackets: list };
//   });
// };
// const addYosRow = () => {
//   setAddForm((prev: any) => ({
//     ...prev,
//     yos_brackets: [...(prev.yos_brackets ?? []), { min_years: 0, max_years: null, days: 0 }],
//   }));
// };
// const removeYosRow = (idx: number) => {
//   setAddForm((prev: any) => {
//     const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
//     list.splice(idx, 1);
//     return { ...prev, yos_brackets: list };
//   });
// };

//   const fetchLeaveTypes = useCallback(async () => {//async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveTypes(response.data);
//       let filtered = response.data.filter((type: LeaveType) => type.company_name === null);
//       setFilteredLeaveTypes(filtered);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch leave types');
//       showNotification('Failed to fetch leave types', 'error');
//       console.error('Error fetching leave types:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [showNotification]);
//     //};

//       useEffect(() => {
//     fetchLeaveTypes();
//   }, [fetchLeaveTypes]);

//   const companies1 = [...new Set(leaveTypes.filter(request => request.company_name !== null).map(request => request.company_name).sort())];

// // Build companies as string[]
// const companies: string[] = Array.from(
//   new Set(
//     leaveTypes
//       .map(t => t.company_name)               // (string | null)[]
//       .filter((c): c is string => !!c)        // -> string[]
//   )
// ).sort();


//   const handleApplyFilters = () => {
//     let filtered = [...leaveTypes];

//     if (selectedCompany !== 'all') {
//       filtered = filtered.filter(type => type.company_name === selectedCompany);
//     }
//     else {
//       filtered = filtered.filter(type => type.company_name === null);
//     }

//     setFilteredLeaveTypes(filtered);
//     setCurrentPage(1); // Reset to first page when filtering
//   };

//   const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newCompany = e.target.value;
//     setSelectedCompany(newCompany);

//     let filtered = [...leaveTypes];
//     if (newCompany !== 'all') {
//       filtered = filtered.filter(type => type.company_name === newCompany);
//     } else {
//       filtered = filtered.filter(type => type.company_name === null);
//     }
//     setFilteredLeaveTypes(filtered);
//     setCurrentPage(1); // Reset to first page when filtering
//   };

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredLeaveTypes.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = filteredLeaveTypes.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleViewLeaveType = (leaveType: LeaveType) => {
//     setSelectedLeaveType(leaveType);
//     setShowViewModal(true);
//   };

//   const handleEditLeaveType = (leaveType: LeaveType) => {
//     setSelectedLeaveType(leaveType);
//     setEditForm({
//       leave_type_name: leaveType.leave_type_name || '',
//       code: leaveType.code || '',
//       description: leaveType.description || '',
//       max_days: leaveType.max_days || 0,
//       is_total: leaveType.is_total || false,
//       total_type: leaveType.total_type || 'IMMEDIATE',
//       is_divident: leaveType.is_divident || false,
//       increment_days: leaveType.increment_days || 0,
//       max_increment_days: leaveType.max_increment_days || 0,
//       carry_forward_days: leaveType.carry_forward_days || 0,
//       requires_approval: leaveType.requires_approval || false,
//       requires_documentation: leaveType.requires_documentation || false,
//       is_active: leaveType.is_active || false,
//       company_id: leaveType.company_id || '0'
//     });
//     setShowEditModal(true);
//   };

//   const handleEditSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedLeaveType) return;

//     try {
//       await axios.put(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, editForm, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setShowEditModal(false);
//       showNotification('Leave type updated successfully', 'success');

//       // Fetch updated leave types
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveTypes(response.data);

//       // Apply the current company filter
//       let filtered = [...response.data];
//       if (selectedCompany !== 'all') {
//         filtered = filtered.filter(type => type.company_name === selectedCompany);
//       } else {
//         filtered = filtered.filter(type => type.company_name === null);
//       }
//       setFilteredLeaveTypes(filtered);

//     } catch (err) {
//       console.error('Error updating leave type:', err);
//       showNotification('Failed to update leave type', 'error');
//       setError('Failed to update leave type');
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
      
//       // Handle mutual exclusivity between total and divident
//       if (name === 'is_total' && checked) {
//         setEditForm(prev => ({
//           ...prev,
//           is_total: true,
//           is_divident: false
//         }));
//         return;
//       }
      
//       if (name === 'is_divident' && checked) {
//         setEditForm(prev => ({
//           ...prev,
//           is_divident: true,
//           is_total: false
//         }));
//         return;
//       }
      
//       // Handle unchecking
//       setEditForm(prev => ({
//         ...prev,
//         [name]: checked
//       }));
//       return;
//     }
    
//     setEditForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
      
//       // Handle mutual exclusivity between total and divident
//       if (name === 'is_total' && checked) {
//         setAddForm(prev => ({
//           ...prev,
//           is_total: true,
//           is_divident: false
//         }));
//         return;
//       }
      
//       if (name === 'is_divident' && checked) {
//         setAddForm(prev => ({
//           ...prev,
//           is_divident: true,
//           is_total: false
//         }));
//         return;
//       }
      
//       // Handle unchecking
//       setAddForm(prev => ({
//         ...prev,
//         [name]: checked
//       }));
//       return;
//     }
    
//     setAddForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddLeaveType = () => {
//     // Get the selected company's ID
//     const selectedCompanyData = leaveTypes.find(type => type.company_name === selectedCompany);
//     const companyId = selectedCompanyData?.company_id || '0';
    
//     setAddForm(prev => ({
//       ...prev,
//       company_id: companyId
//     }));
//     setShowAddModal(true);
//   };

//   const handleAddSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await axios.post(`${API_BASE_URL}/api/v1/leave-types`, addForm, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       setShowAddModal(false);
//       showNotification('Leave type created successfully', 'success');

//       // Reset form
//     setAddForm({
//   leave_type_name: '',
//   code: '',
//   description: '',
//   max_days: 0,
//   is_total: true,
//   total_type: 'IMMEDIATE',
//   is_divident: false,
//   increment_days: 0,
//   max_increment_days: 0,
//   carry_forward_days: 0,
//   requires_approval: true,
//   requires_documentation: false,
//   is_active: true,
//   company_id: '0',
//   isNewLeaveType: true,

//   // NEW
//   allocation_primary: 'IMMEDIATE',
//   eligibility_scope: 'ALL_STAFF',
//   earn_days_per_month: 1,
//   earn_prorate_join_month: true,
//   yos_brackets: [],
// });


//       // Fetch updated leave types
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveTypes(response.data);

//       // Apply the current company filter
//       let filtered = [...response.data];
//       if (selectedCompany !== 'all') {
//         filtered = filtered.filter(type => type.company_name === selectedCompany);
//       } else {
//         filtered = filtered.filter(type => type.company_name === null);
//       }
//       setFilteredLeaveTypes(filtered);

//     } catch (err) {
//       console.error('Error creating leave type:', err);
//       showNotification('Failed to create leave type', 'error');
//       setError('Failed to create leave type');
//     }
//   };

//   const handleDeleteLeaveType = () => {
//     if (!selectedLeaveType) return;

//     // Don't allow deletion of UNPAID leave type
//     if (selectedLeaveType.code === 'UNPAID') {
//       showNotification('Cannot delete UNPAID leave type', 'error');
//       return;
//     }

//     setShowDeleteConfirmModal(true);
//   };

//   const confirmDeleteLeaveType = async () => {
//     if (!selectedLeaveType) return;

//     try {
//       await axios.delete(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       setShowDeleteConfirmModal(false);
//       setShowViewModal(false);
//       showNotification('Leave type deleted successfully', 'success');

//       // Fetch updated leave types
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveTypes(response.data);

//       // Apply the current company filter
//       let filtered = [...response.data];
//       if (selectedCompany !== 'all') {
//         filtered = filtered.filter(type => type.company_name === selectedCompany);
//       } else {
//         filtered = filtered.filter(type => type.company_name === null);
//       }
//       setFilteredLeaveTypes(filtered);

//     } catch (err: any) {
//       console.error('Error deleting leave type:', err);
//       const errorMessage = err.response?.data?.error || 'Failed to delete leave type';
//       showNotification(errorMessage, 'error');
//     }
//   };

//   return (
//     <>    
//       {/* Notification Toast */}
//       <NotificationToast
//         show={notification.show}
//         message={notification.message}
//         type={notification.type}
//       />
      
//       <div className={`container mx-auto p-3 sm:p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
//         <div className="mt-4 sm:mt-8 flow-root">
//           <div className="mt-1">
//             <div>
//               <div>
//                 <label htmlFor="company" className={`block text-sm sm:text-base font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'} mb-2`}>
//                   Company
//                 </label>
//                 <div className="mt-2">
//                   <select
//                     id="company"
//                     name="company"
//                     value={selectedCompany}
//                     onChange={handleCompanyChange}
//                     className={`select select-bordered w-full sm:w-auto sm:max-w-xs text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                   >
//                     <option value="all">Default settings</option>
//                     {companies.map(company => (
//                       <option key={company} value={company}>{company}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Leave Type */}
//         <div className="mt-6 sm:mt-8 flow-root">
//           <div className={`card ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg`}>
//             <div className="card-body p-4 sm:p-6">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
//                 <h2 className={`card-title flex flex-col sm:flex-row items-start sm:items-center gap-2 text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span className="break-words">Standard Leave Types</span>
//                 </h2>
                
//                 {(
//                   <button
//                     onClick={handleAddLeaveType}
//                     className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-primary hover:bg-primary' : 'bg-primary-500 hover:bg-primary-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     <span className="hidden sm:inline">Add Leave Type</span>
//                     <span className="sm:hidden">Add</span>
//                   </button>
//                 )}
//               </div>

//               {isLoading ? (
//                 <div className="flex justify-center items-center h-32 sm:h-40">
//                   <div className={`loading loading-spinner loading-md sm:loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></div>
//                 </div>
//               ) : error ? (
//                 <div className={`text-center py-6 sm:py-8 px-4 text-sm sm:text-base ${theme === 'light' ? 'text-red-500' : 'text-red-400'}`}>
//                   <div className="break-words">{error}</div>
//                 </div>
//               ) : (
//                 <>
//                   {/* Mobile-first table design */}
//                   <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//                     {/* Desktop table */}
//                     <div className="hidden sm:block">
//                       <table className="table w-full">
//                         <thead>
//                           <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                             <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Type</th>
//                             <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Description</th>
//                             <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Days</th>
//                             <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {currentData.map((leaveType, index) => (
//                             <tr 
//                               key={leaveType.id} 
//                               className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentData.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
//                             >
//                               <td className={`px-2 lg:px-4 py-3`}>
//                                 <div className={`font-medium text-sm lg:text-base ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} break-words`}>{leaveType.leave_type_name}</div>
//                               </td>
//                               <td className={`px-2 lg:px-4 py-3 max-w-[200px] lg:max-w-[300px] ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-sm lg:text-base`}>
//                                 <div className="break-words line-clamp-3">{leaveType.description}</div>
//                               </td>
//                               <td className={`px-2 lg:px-4 py-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-sm lg:text-base`}>
//                                 {leaveType.code !== 'UNPAID' ? `${leaveType.max_days} days / year` : '-'}
//                               </td>
//                               <td className="text-center px-2 lg:px-4 py-3">
//                                 <div className="flex justify-center gap-1 lg:gap-2 min-w-[100px] lg:min-w-[120px]">
//                                   {leaveType?.code !== 'UNPAID' && (
//                                     <button
//                                       onClick={() => handleEditLeaveType(leaveType)}
//                                       className={`btn btn-xs sm:btn-sm lg:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm`}
//                                     >
//                                       Edit
//                                     </button>
//                                   )}
//                                   <button
//                                     onClick={() => handleViewLeaveType(leaveType)}
//                                     className={`btn btn-xs sm:btn-sm lg:btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 text-xs sm:text-sm`}
//                                   >
//                                     View
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile card layout */}
//                     <div className="sm:hidden space-y-3">
//                       {currentData.map((leaveType, index) => (
//                         <div 
//                           key={leaveType.id}
//                           className={`${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'} rounded-lg p-4 space-y-3`}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1 min-w-0">
//                               <h3 className={`font-medium text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} break-words`}>
//                                 {leaveType.leave_type_name}
//                               </h3>
//                               <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                                 {leaveType.code !== 'UNPAID' ? `${leaveType.max_days} days / year` : 'Unpaid Leave'}
//                               </p>
//                             </div>
//                             <div className="flex gap-1 ml-2 flex-shrink-0">
//                               {leaveType?.code !== 'UNPAID' && (
//                                 <button
//                                   onClick={() => handleEditLeaveType(leaveType)}
//                                   className={`btn btn-xs ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//                                 >
//                                   Edit
//                                 </button>
//                               )}
//                               <button
//                                 onClick={() => handleViewLeaveType(leaveType)}
//                                 className={`btn btn-xs ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
//                               >
//                                 View
//                               </button>
//                             </div>
//                           </div>
//                           <div>
//                             <p className={`text-xs ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} line-clamp-2`}>
//                               {leaveType.description}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Pagination */}
//                   {filteredLeaveTypes.length > 0 && (
//                     <>
//                       <div className={`mt-4 text-xs sm:text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} px-2 sm:px-0`}>
//                         <span className="hidden sm:inline">Showing {startIndex + 1} to {Math.min(endIndex, filteredLeaveTypes.length)} of {filteredLeaveTypes.length} leave types</span>
//                         <span className="sm:hidden">{startIndex + 1}-{Math.min(endIndex, filteredLeaveTypes.length)} of {filteredLeaveTypes.length}</span>
//                       </div>
                      
//                       {totalPages > 1 && (
//                         <div className="flex justify-center mt-4 sm:mt-6 px-2 sm:px-0">
//                           <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-0">
//                             <button 
//                               className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px] sm:min-w-[40px]`}
//                               onClick={() => handlePageChange(currentPage - 1)}
//                               disabled={currentPage === 1}
//                             >
//                               <span className="hidden sm:inline">«</span>
//                               <span className="sm:hidden">‹</span>
//                             </button>
                            
//                             {/* Mobile: Show only current page and adjacent pages */}
//                             <div className="flex sm:hidden">
//                               {currentPage > 1 && (
//                                 <button 
//                                   className={`btn btn-xs ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px]`}
//                                   onClick={() => handlePageChange(currentPage - 1)}
//                                 >
//                                   {currentPage - 1}
//                                 </button>
//                               )}
//                               <button 
//                                 className={`btn btn-xs bg-blue-600 text-white min-w-[32px]`}
//                               >
//                                 {currentPage}
//                               </button>
//                               {currentPage < totalPages && (
//                                 <button 
//                                   className={`btn btn-xs ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px]`}
//                                   onClick={() => handlePageChange(currentPage + 1)}
//                                 >
//                                   {currentPage + 1}
//                                 </button>
//                               )}
//                             </div>
                            
//                             {/* Desktop: Show all pages */}
//                             <div className="hidden sm:flex">
//                               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                                 <button 
//                                   key={page}
//                                   className={`btn btn-sm ${currentPage === page ? 
//                                     `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
//                                     `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
//                                   } min-w-[40px]`}
//                                   onClick={() => handlePageChange(page)}
//                                 >
//                                   {page}
//                                 </button>
//                               ))}
//                             </div>
                            
//                             <button 
//                               className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px] sm:min-w-[40px]`}
//                               onClick={() => handlePageChange(currentPage + 1)}
//                               disabled={currentPage === totalPages}
//                             >
//                               <span className="hidden sm:inline">»</span>
//                               <span className="sm:hidden">›</span>
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* View Modal */}
//         <dialog
//           id="view_modal"
//           className={`modal ${showViewModal ? 'modal-open' : ''}`}
//         >
//           <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
//             {/* Modal Header */}
//             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
//               {/* Background Pattern */}
//               <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}`} style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//               }}></div>
              
//               <div className="flex items-center gap-4 relative z-10">
//                 {/* Icon Container */}
//                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25' : 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-400/25'} transform hover:scale-105 transition-all duration-300`}>
//                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   {/* Glow Effect */}
//                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
//                 </div>
                
//                 {/* Title Section */}
//                 <div className="flex flex-col">
//                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
//                     Leave Type Details
//                   </h3>
//                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
//                     View comprehensive leave configuration
//                   </p>
//                 </div>
//               </div>
              
//               {/* Close Button */}
//               <button
//                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
//                 onClick={() => setShowViewModal(false)}
//               >
//                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
//                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal Content - Scrollable */}
//             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
//               <div className="space-y-4 sm:space-y-6">
//                 {/* Basic Information */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <div className="space-y-1">
//                     <label className="label p-0">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type Name</span>
//                     </label>
//                     <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>{selectedLeaveType?.leave_type_name}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="label p-0">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Code</span>
//                     </label>
//                     <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.code}</p>
//                   </div>
//                   {selectedLeaveType?.code !== 'UNPAID' && (
//                     <div className="space-y-1">
//                       <label className="label p-0">
//                         <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Maximum Days</span>
//                       </label>
//                       <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.max_days} days / year</p>
//                     </div>
//                   )}
//                   <div className="space-y-1">
//                     <label className="label p-0">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
//                     </label>
//                     <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>{selectedLeaveType?.company_name || 'Global'}</p>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-1">
//                   <label className="label p-0">
//                     <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Description</span>
//                   </label>
//                   <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>{selectedLeaveType?.description}</p>
//                 </div>

//                 {/* Requirements */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <div className="space-y-1">
//                     <label className="label p-0">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requires Documentation</span>
//                     </label>
//                     <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.requires_documentation ? 'Yes' : 'No'}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="label p-0">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Status</span>
//                     </label>
//                     <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.is_active ? 'Active' : 'Inactive'}</p>
//                   </div>
//                 </div>
                
//                 {selectedLeaveType?.code !== 'UNPAID' && (
//                   <>
//                     {/* Allocation Methods */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                       <div className="space-y-1">
//                         <label className="label p-0">
//                           <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Upfront Allocation</span>
//                         </label>
//                         <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.is_total ? 'Yes' : 'No'}</p>
//                         {selectedLeaveType?.is_total && (
//                           <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'} mt-1`}>
//                             Type: {selectedLeaveType?.total_type}
//                           </p>
//                         )}
//                       </div>
//                       <div className="space-y-1">
//                         <label className="label p-0">
//                           <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Gradual Accrual</span>
//                         </label>
//                         <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.is_divident ? 'Yes' : 'No'}</p>
//                       </div>
//                     </div>

// {/* Renewal / Carryover / Cut-off */}
// <div className={`p-3 sm:p-4 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//   <h4 className={`text-sm sm:text-base font-semibold mb-3 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//     Renewal & Carryover
//   </h4>

//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//     {/* Use-it-or-lose-it at the end of the accrual period */}
//     <div className="flex items-end">
//       <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}`}>
//         <input
//           type="checkbox"
//           name="expire_unused_at_period_end"
//           checked={addForm.expire_unused_at_period_end ?? false}
//           onChange={(e) => setAddForm(p => ({ ...p, expire_unused_at_period_end: e.target.checked }))}
//           className="checkbox checkbox-primary checkbox-sm"
//         />
//         <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
//           Use-it-or-lose-it at end of {(addForm.accrual_frequency ?? 'MONTHLY').toLowerCase()}
//         </span>
//       </label>
//     </div>

//     {/* Renewal cadence (reset) */}
//     <div>
//       <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//         Renewal period (reset cycle)
//       </label>
//       <select
//         name="renewal_period"
//         value={addForm.renewal_period ?? 'YEARLY'}
//         onChange={(e) => setAddForm(p => ({ ...p, renewal_period: e.target.value as RenewalPeriod }))}
//         className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//         disabled={addForm.expire_unused_at_period_end}
//       >
//         <option value="YEARLY">Yearly</option>
//         <option value="QUARTERLY">Quarterly</option>
//         <option value="NONE">No renewal/reset</option>
//       </select>
//     </div>

//     {/* Carryover settings (visible only if not expiring per period and renewal is active) */}
//     {(!addForm.expire_unused_at_period_end && addForm.renewal_period !== 'NONE') && (
//       <>
//         <div>
//           <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//             Carryover max days
//           </label>
//           <input
//             type="number"
//             min={0}
//             name="carryover_max_days"
//             value={addForm.carryover_max_days ?? 0}
//             onChange={(e) => setAddForm(p => ({ ...p, carryover_max_days: Number(e.target.value) }))}
//             className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//           />
//         </div>

//         <div>
//           <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//             Carryover expiry (months, optional)
//           </label>
//           <input
//             type="number"
//             min={1}
//             name="carryover_expiry_months"
//             value={addForm.carryover_expiry_months ?? ''}
//             onChange={(e) => setAddForm(p => ({ ...p, carryover_expiry_months: e.target.value === '' ? null : Number(e.target.value) }))}
//             placeholder="Leave blank for no expiry"
//             className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//           />
//         </div>
//       </>
//     )}
//   </div>
// </div>




//                     {/* Increment Section */}
//                     <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
//                       <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Increment Details</h4>
//                       <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
//                         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                           <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} font-medium`}>Allocate Days:</span>
//                           <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{selectedLeaveType?.increment_days ?? 0} day{pluralize(selectedLeaveType?.increment_days)}</span>
//                         </div>
//                         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//                           <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} font-medium`}>Maximum Allocate Days:</span>
//                           <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{selectedLeaveType?.max_increment_days ?? 0} day{pluralize(selectedLeaveType?.max_increment_days)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex justify-end items-center gap-3 mt-auto z-10`}>
//               {/* Delete Button - Only show if not UNPAID leave type */}
//               {selectedLeaveType?.code !== 'UNPAID' && (
//                 <button
//                   className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
//                   onClick={handleDeleteLeaveType}
//                 >
//                   <BsTrash className="w-3 h-3" />
//                   Delete
//                 </button>
//               )}
              
//               {/* Close Button */}
//               <button
//                 className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm`}
//                 onClick={() => setShowViewModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//           <form method="dialog" className="modal-backdrop">
//             <button onClick={() => setShowViewModal(false)}>close</button>
//           </form>
//         </dialog>

//         {/* Edit Modal */}
//         <dialog id="edit_modal" className={`modal ${showEditModal ? 'modal-open' : ''}`}>
//           <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
//             {/* Modal Header */}
//             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
//               {/* Background Pattern */}
//               <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//               }}></div>
              
//               <div className="flex items-center gap-4 relative z-10">
//                 {/* Icon Container */}
//                 <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25' : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/25'} transform hover:scale-105 transition-all duration-300`}>
//                   <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                   {/* Glow Effect */}
//                   <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400'}`}></div>
//                 </div>
                
//                 {/* Title Section */}
//                 <div className="flex flex-col">
//                   <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
//                     Edit Leave Type
//                   </h3>
//                   <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
//                     Modify leave configuration settings
//                   </p>
//                 </div>
//               </div>
              
//               {/* Close Button */}
//               <button
//                 className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
//                 onClick={() => setShowEditModal(false)}
//               >
//                 <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
//                 <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal Content - Scrollable */}
//             <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
//               <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
//                 {/* Basic Information */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="label p-0 pb-1">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type Name</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="leave_type_name"
//                       name="leave_type_name"
//                       value={editForm.leave_type_name ?? ''}
//                       onChange={handleInputChange}
//                       className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
//                       required
//                       readOnly
//                     />
//                   </div>

//                   <div>
//                     <label className="label p-0 pb-1">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Code</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="code"
//                       name="code"
//                       value={editForm.code ?? ''}
//                       onChange={handleInputChange}
//                       className={`input input-bordered w-full text-sm sm:text-base ${editForm.code === 'UNPAID' ? 
//                         theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100' :
//                         theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'
//                       }`}
//                       required
//                       readOnly={editForm.code === 'UNPAID'}
//                     />
//                   </div>

//                   {editForm.code !== 'UNPAID' && (
//                     <div>
//                       <label className="label p-0 pb-1">
//                         <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Maximum Days</span>
//                       </label>
//                       <input
//                         type="number"
//                         id="max_days"
//                         name="max_days"
//                         value={editForm.max_days ?? 0}
//                         onChange={handleInputChange}
//                         className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                         required
//                       />
//                     </div>
//                   )}

//                   <div>
//                     <label className="label p-0 pb-1">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="company_name"
//                       value={selectedLeaveType?.company_name ?? ''}
//                       className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
//                       readOnly
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="label p-0 pb-1">
//                     <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Description</span>
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={editForm.description ?? ''}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className={`textarea textarea-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                     required
//                   />
//                 </div>

//                 {/* Requirements - Mobile: Stack vertically, Desktop: Grid */}
//                 <div className="space-y-3 sm:space-y-4">
//                   <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requirements</h4>
                  
//                   <div className="space-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-2 sm:gap-4 sm:space-y-0">

//                     <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
//                       <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requires Documentation</span>
//                       <input
//                         type="checkbox"
//                         id="requires_documentation"
//                         name="requires_documentation"
//                         checked={editForm.requires_documentation ?? false}
//                         onChange={handleInputChange}
//                         className={`checkbox checkbox-sm sm:checkbox-md ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//                       />
//                     </div>

//                     <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
//                       <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Active</span>
//                       <input
//                         type="checkbox"
//                         id="is_active"
//                         name="is_active"
//                         checked={editForm.is_active ?? false}
//                         onChange={handleInputChange}
//                         className={`checkbox checkbox-sm sm:checkbox-md ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Allocation Methods */}
//                 <div className="space-y-3 sm:space-y-4">
//                   <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Allocation Methods</h4>
                  
//                   <div className="space-y-3">
//                     <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//                       <label className="flex items-start gap-3 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           id="is_total"
//                           name="is_total"
//                           checked={editForm.is_total ?? false}
//                           onChange={handleInputChange}
//                           className={`checkbox checkbox-sm sm:checkbox-md mt-0.5 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//                         />
//                         <div className="flex-1">
//                           <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} block`}>Upfront Allocation</span>
//                           <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Total leave days given at once</span>
//                         </div>
//                       </label>
                      
//                       {editForm.is_total && (
//                         <div className="mt-3 pl-6 sm:pl-8">
//                           <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
//                             Allocation Type
//                           </label>
//                           <div className="relative">
//                             <select
//                               id="total_type"
//                               name="total_type"
//                               value={editForm.total_type ?? 'IMMEDIATE'}
//                               onChange={handleInputChange}
//                               className={`w-full appearance-none rounded-md py-2 pr-8 pl-3 text-sm sm:text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${
//                                 theme === 'light' 
//                                   ? 'bg-white text-gray-900 outline-gray-300 focus:outline-blue-600' 
//                                   : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-400'
//                               }`}
//                             >
//                               <option value="IMMEDIATE">Immediate</option>
//                               <option value="ONCE CONFIRMED">Once Confirmed</option>
//                             </select>
//                             <FaChevronDown
//                               aria-hidden="true"
//                               className={`pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//                       <label className="flex items-start gap-3 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           id="is_divident"
//                           name="is_divident"
//                           checked={editForm.is_divident ?? false}
//                           onChange={handleInputChange}
//                           className={`checkbox checkbox-sm sm:checkbox-md mt-0.5 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//                         />
//                         <div className="flex-1">
//                           <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} block`}>Gradual Accrual</span>
//                           <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Leave earned monthly</span>
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Carry Forward */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="label p-0 pb-1">
//                       <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Carry Forward Days</span>
//                     </label>
//                     <input
//                       type="number"
//                       id="carry_forward_days"
//                       name="carry_forward_days"
//                       value={editForm.carry_forward_days ?? 0}
//                       onChange={handleInputChange}
//                       className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Increment Section */}
//                 <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
//                   <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Increment Details</h4>
//                   <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       <div>
//                         <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
//                           Allocate Days
//                         </label>
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="number"
//                             id="increment_days"
//                             name="increment_days"
//                             value={editForm.increment_days ?? 0}
//                             onChange={handleInputChange}
//                             className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                             required
//                           />
//                           <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                             day{pluralize(editForm?.increment_days)}
//                           </span>
//                         </div>
//                       </div>
                      
//                       <div>
//                         <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
//                           Maximum Allocate Days
//                         </label>
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="number"
//                             id="max_increment_days"
//                             name="max_increment_days"
//                             value={editForm.max_increment_days ?? 0}
//                             onChange={handleInputChange}
//                             className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                             required
//                           />
//                           <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                             day{pluralize(editForm?.max_increment_days)} max
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Modal Footer */}
//             <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex flex-col sm:flex-row justify-end gap-2 mt-auto z-10`}>
//               <button
//                 type="button"
//                 onClick={() => setShowEditModal(false)}
//                 className={`btn btn-sm sm:btn-md btn-ghost w-full sm:w-auto ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'} text-xs sm:text-sm order-2 sm:order-1`}
//               >
//                 Cancel
//               </button>
//               {selectedLeaveType?.code !== 'UNPAID' && (
//                 <button
//                   type="submit"
//                   onClick={handleEditSubmit}
//                   className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm order-1 sm:order-2`}
//                 >
//                   Save Changes
//                 </button>
//               )}
//             </div>
//           </div>
//           <form method="dialog" className="modal-backdrop">
//             <button onClick={() => setShowEditModal(false)}>close</button>
//           </form>
//         </dialog>

//         {/* Add Modal */}


//         {/* Add Modal */}
// <dialog id="add_modal" className={`modal ${showAddModal ? 'modal-open' : ''}`}>
//   <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
//     {/* Modal Header */}
//     <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
//       {/* Background Pattern */}
//       <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-green-500' : 'bg-green-400'}`} style={{
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//       }}></div>
      
//       <div className="flex items-center gap-4 relative z-10">
//         {/* Icon Container */}
//         <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25' : 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-400/25'} transform hover:scale-105 transition-all duration-300`}>
//           <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           {/* Glow Effect */}
//           <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-green-500' : 'bg-green-400'}`}></div>
//         </div>
        
//         {/* Title Section */}
//         <div className="flex flex-col">
//           <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
//             Add New Leave Type
//           </h3>
//           <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
//             Create a new leave configuration
//           </p>
//         </div>
//       </div>
      
//       {/* Close Button */}
//       <button
//         className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
//         onClick={() => setShowAddModal(false)}
//       >
//         <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
//         <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//         </svg>
//       </button>
//     </div>

//     {/* Modal Content - Scrollable */}
//     <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
//       <form onSubmit={handleAddSubmit} className="space-y-4 sm:space-y-6">
//         {/* Basic Information */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//           <div>
//             <label className="label p-0 pb-1">
//               <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type Name <span className="text-red-500">*</span></span>
//             </label>
//             <input
//               type="text"
//               id="leave_type_name"
//               name="leave_type_name"
//               value={addForm.leave_type_name ?? ''}
//               onChange={handleAddInputChange}
//               className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//               placeholder="e.g., Annual Leave"
//               required
//             />
//           </div>

//           <div>
//             <label className="label p-0 pb-1">
//               <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Code <span className="text-red-500">*</span></span>
//             </label>
//             <input
//               type="text"
//               id="code"
//               name="code"
//               value={addForm.code ?? ''}
//               onChange={handleAddInputChange}
//               className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//               placeholder="e.g., AL"
//               required
//             />
//           </div>

//           <div>
//             <label className="label p-0 pb-1">
//               <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Maximum Days <span className="text-red-500">*</span></span>
//             </label>
//             <input
//               type="number"
//               id="max_days"
//               name="max_days"
//               value={addForm.max_days ?? 0}
//               onChange={handleAddInputChange}
//               className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//               min="0"
//               placeholder="e.g., 14"
//               required
//             />
//           </div>

//           <div>
//             <label className="label p-0 pb-1">
//               <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
//             </label>
//             <input
//               type="text"
//               value={selectedCompany == 'all' ? 'All Companies' : selectedCompany}
//               className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
//               readOnly
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <label className="label p-0 pb-1">
//             <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Description <span className="text-red-500">*</span></span>
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={addForm.description ?? ''}
//             onChange={handleAddInputChange}
//             rows={3}
//             className={`textarea textarea-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//             placeholder="Describe the leave type..."
//             required
//           />
//         </div>

//         {/* Requirements */}
//         <div className="space-y-3 sm:space-y-4">
//           <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requirements</h4>
          
//           <div className="space-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-2 sm:gap-4 sm:space-y-0">
//             <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
//               <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requires Documentation</span>
//               <input
//                 type="checkbox"
//                 id="requires_documentation"
//                 name="requires_documentation"
//                 checked={addForm.requires_documentation ?? false}
//                 onChange={handleAddInputChange}
//                 className={`checkbox checkbox-sm sm:checkbox-md ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//               />
//             </div>

//             <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
//               <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Active</span>
//               <input
//                 type="checkbox"
//                 id="is_active"
//                 name="is_active"
//                 checked={addForm.is_active ?? false}
//                 onChange={handleAddInputChange}
//                 className={`checkbox checkbox-sm sm:checkbox-md ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Allocation Methods (existing) */}
//         {/* <div className="space-y-3 sm:space-y-4">
//           <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Allocation Methods</h4>
          
//           <div className="space-y-3">
//             <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//               <label className="flex items-start gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   id="is_total"
//                   name="is_total"
//                   checked={addForm.is_total ?? false}
//                   onChange={handleAddInputChange}
//                   className={`checkbox checkbox-sm sm:checkbox-md mt-0.5 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//                 />
//                 <div className="flex-1">
//                   <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} block`}>Upfront Allocation</span>
//                   <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Total leave days given at once</span>
//                 </div>
//               </label>
              
//               {addForm.is_total && (
//                 <div className="mt-3 pl-6 sm:pl-8">
//                   <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
//                     Allocation Type
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="total_type"
//                       name="total_type"
//                       value={addForm.total_type ?? 'IMMEDIATE'}
//                       onChange={handleAddInputChange}
//                       className={`w-full appearance-none rounded-md py-2 pr-8 pl-3 text-sm sm:text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${
//                         theme === 'light' 
//                           ? 'bg-white text-gray-900 outline-gray-300 focus:outline-blue-600' 
//                           : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-400'
//                       }`}
//                     >
//                       <option value="IMMEDIATE">Immediate</option>
//                       <option value="ONCE CONFIRMED">Once Confirmed</option>
//                     </select></div>
//                 </div>
//               )}
//             </div>

//             <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//               <label className="flex items-start gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   id="is_divident"
//                   name="is_divident"
//                   checked={addForm.is_divident ?? false}
//                   onChange={handleAddInputChange}
//                   className={`checkbox checkbox-sm sm:checkbox-md mt-0.5 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
//                 />
//                 <div className="flex-1">
//                   <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} block`}>Gradual Accrual</span>
//                   <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Leave earned monthly</span>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div> */}

//         {/* ===== NEW: Allocation & Eligibility (mock) ===== */}
//         <div className="space-y-3 sm:space-y-4">
//           <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//             Allocation & Eligibility
//           </h4>

//           {/* Primary Allocation */}
//           <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//             <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//               Primary Allocation
//             </label>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//               {[
//                 { val: 'IMMEDIATE', label: 'Immediate' },
//                 { val: 'EARN', label: 'Earn (accrual)' },
//                 { val: 'YEAR_OF_SERVICE', label: 'Year of service' },
//               ].map((opt) => (
//                 <label key={opt.val} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'}`}>
//                   <input
//                     type="radio"
//                     name="allocation_primary"
//                     value={opt.val}
//                     checked={(addForm.allocation_primary ?? 'IMMEDIATE') === opt.val}
//                     onChange={(e) => setAddForm((p: any) => ({ ...p, allocation_primary: e.target.value as AllocationPrimary }))}
//                     className="radio radio-primary radio-sm"
//                   />
//                   <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{opt.label}</span>
//                 </label>
//               ))}
//             </div>

//             {/* If EARN (accrual), show rate inputs */}
// {/* If EARN (accrual), show frequency, rate, proration, and carryover in one block */}
// {addForm.allocation_primary === 'EARN' && (
//   <div className="mt-3 space-y-4">
//     {/* Frequency / Rate / Prorate */}
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//       {/* Frequency */}
//       <div>
//         <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//           Accrual frequency
//         </label>
//         <select
//           name="accrual_frequency"
//           value={addForm.accrual_frequency ?? 'MONTHLY'}
//           onChange={(e) => setAddForm(p => ({ ...p, accrual_frequency: e.target.value as AccrualFrequency }))}
//           className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//         >
//           <option value="MONTHLY">Monthly</option>
//           <option value="QUARTERLY">Quarterly</option>
//           <option value="YEARLY">Yearly</option>
//         </select>
//       </div>

//       {/* Rate (days per period) */}
//       <div>
//         <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//           {addForm.accrual_frequency === 'QUARTERLY'
//             ? 'Days earned per quarter'
//             : addForm.accrual_frequency === 'YEARLY'
//             ? 'Days earned per year'
//             : 'Days earned per month'}
//         </label>
//         <input
//           type="number"
//           step="0.1"
//           min={0}
//           name="accrual_rate"
//           value={addForm.accrual_rate ?? 0}
//           onChange={(e) => setAddForm(p => ({ ...p, accrual_rate: Number(e.target.value) }))}
//           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//         />
//       </div>

//       {/* Prorate join period */}
//       <div className="flex items-end">
//         <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}`}>
//           <input
//             type="checkbox"
//             name="earn_prorate_join_month"
//             checked={addForm.earn_prorate_join_month ?? false}
//             onChange={(e) => setAddForm(p => ({ ...p, earn_prorate_join_month: e.target.checked }))}
//             className="checkbox checkbox-primary checkbox-sm"
//           />
//           <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
//             Prorate join { (addForm.accrual_frequency ?? 'MONTHLY').toLowerCase() }
//           </span>
//         </label>
//       </div>
//     </div>

//     {/* Carryover & Reset (inside Earn) */}
//     <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//         {/* Use-it-or-lose-it at end of accrual period */}
//         <div className="flex items-end">
//           <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
//             <input
//               type="checkbox"
//               name="expire_unused_at_period_end"
//               checked={addForm.expire_unused_at_period_end ?? false}
//               onChange={(e) => setAddForm(p => ({ ...p, expire_unused_at_period_end: e.target.checked }))}
//               className="checkbox checkbox-primary checkbox-sm"
//             />
//             <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
//               Use-it-or-lose-it at end of {(addForm.accrual_frequency ?? 'MONTHLY').toLowerCase()}
//             </span>
//           </label>
//         </div>

//         {/* Renewal cadence (reset cycle) */}
//         <div>
//           <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//             Renewal period (reset cycle)
//           </label>
//           <select
//             name="renewal_period"
//             value={addForm.renewal_period ?? 'YEARLY'}
//             onChange={(e) => setAddForm(p => ({ ...p, renewal_period: e.target.value as RenewalPeriod }))}
//             className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//             disabled={addForm.expire_unused_at_period_end}
//           >
//             <option value="YEARLY">Yearly</option>
//             <option value="QUARTERLY">Quarterly</option>
//             <option value="NONE">No renewal/reset</option>
//           </select>
//         </div>

//         {/* Carryover controls (only when not expiring per period and renewal is active) */}
//         {(!addForm.expire_unused_at_period_end && addForm.renewal_period !== 'NONE') && (
//           <>
//             <div>
//               <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                 Carryover max days
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 name="carryover_max_days"
//                 value={addForm.carryover_max_days ?? 0}
//                 onChange={(e) => setAddForm(p => ({ ...p, carryover_max_days: Number(e.target.value) }))}
//                 className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//               />
//             </div>

//             <div>
//               <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                 Carryover expiry (months, optional)
//               </label>
//               <input
//                 type="number"
//                 min={1}
//                 name="carryover_expiry_months"
//                 value={addForm.carryover_expiry_months ?? ''}
//                 onChange={(e) => setAddForm(p => ({ ...p, carryover_expiry_months: e.target.value === '' ? null : Number(e.target.value) }))}
//                 placeholder="Leave blank for no expiry"
//                 className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// )}



//             {/* If YEAR_OF_SERVICE, show brackets */}
//             {(addForm.allocation_primary === 'YEAR_OF_SERVICE') && (
//               <div className="mt-3">
//                 <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                   Year-of-Service Brackets
//                 </label>

//                 <div className="overflow-auto rounded-md border border-slate-200 dark:border-slate-600">
//                   <table className="table table-sm">
//                     <thead>
//                       <tr>
//                         <th className="text-xs">Min years</th>
//                         <th className="text-xs">Max years (blank = ∞)</th>
//                         <th className="text-xs">Days</th>
//                         <th></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(addForm.yos_brackets ?? []).map((row: YearOfServiceBracket, idx: number) => (
//                         <tr key={idx}>
//                           <td>
//                             <input
//                               type="number"
//                               min={0}
//                               value={row.min_years ?? 0}
//                               onChange={(e) => updateYosBracket(idx, 'min_years', Number(e.target.value))}
//                               className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                             />
//                           </td>
//                           <td>
//                             <input
//                               type="number"
//                               min={0}
//                               placeholder="∞"
//                               value={row.max_years ?? ''}
//                               onChange={(e) => updateYosBracket(idx, 'max_years', e.target.value === '' ? null : Number(e.target.value))}
//                               className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                             />
//                           </td>
//                           <td>
//                             <input
//                               type="number"
//                               min={0}
//                               value={row.days ?? 0}
//                               onChange={(e) => updateYosBracket(idx, 'days', Number(e.target.value))}
//                               className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                             />
//                           </td>
//                           <td>
//                             <button
//                               type="button"
//                               onClick={() => removeYosRow(idx)}
//                               className="btn btn-xs btn-ghost text-red-600"
//                             >
//                               Remove
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="mt-2">
//                   <button type="button" onClick={addYosRow} className={`btn btn-sm ${theme === 'light' ? 'btn-outline' : 'btn-outline'}`}>
//                     Add bracket
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Eligibility */}
//           <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
//             <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//               Eligibility Scope
//             </label>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//               {[
//                 { val: 'UPON_CONFIRM', label: 'Upon confirmation' },
//                 { val: 'UNDER_PROBATION', label: 'Under probation' },
//                 { val: 'ALL_STAFF', label: 'All staff' },
//               ].map((opt) => (
//                 <label key={opt.val} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'}`}>
//                   <input
//                     type="radio"
//                     name="eligibility_scope"
//                     value={opt.val}
//                     checked={(addForm.eligibility_scope ?? 'ALL_STAFF') === opt.val}
//                     onChange={(e) => setAddForm((p: any) => ({ ...p, eligibility_scope: e.target.value as EligibilityScope }))}
//                     className="radio radio-primary radio-sm"
//                   />
//                   <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{opt.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Carry Forward */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//           <div>
//             <label className="label p-0 pb-1">
//               <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Carry Forward Days</span>
//             </label>
//             <input
//               type="number"
//               id="carry_forward_days"
//               name="carry_forward_days"
//               value={addForm.carry_forward_days ?? 0}
//               onChange={handleAddInputChange}
//               className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//               min="0"
//               placeholder="0"
//             />
//           </div>
//         </div>

//         {/* Increment Section */}
//         <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
//           <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Increment Details</h4>
//           <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//               <div>
//                 <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
//                   Allocate Days
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="number"
//                     id="increment_days"
//                     name="increment_days"
//                     value={addForm.increment_days ?? 0}
//                     onChange={handleAddInputChange}
//                     className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                     min="0"
//                     placeholder="0"
//                   />
//                   <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                     day{pluralize(addForm?.increment_days)}
//                   </span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
//                   Maximum Allocate Days
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="number"
//                     id="max_increment_days"
//                     name="max_increment_days"
//                     value={addForm.max_increment_days ?? 0}
//                     onChange={handleAddInputChange}
//                     className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//                     min="0"
//                     placeholder="0"
//                   />
//                   <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                     day{pluralize(addForm?.max_increment_days)} max
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>

//     {/* Modal Footer */}
//     <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex flex-col sm:flex-row justify-end gap-2 mt-auto z-10`}>
//       <button
//         type="button"
//         onClick={() => setShowAddModal(false)}
//         className={`btn btn-sm sm:btn-md btn-ghost w-full sm:w-auto ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'} text-xs sm:text-sm order-2 sm:order-1`}
//       >
//         Cancel
//       </button>
//       <button
//         type="submit"
//         onClick={handleAddSubmit}
//         className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 text-xs sm:text-sm order-1 sm:order-2`}
//       >
//         Create Leave Type
//       </button>
//     </div>
//   </div>
//   <form method="dialog" className="modal-backdrop">
//     <button onClick={() => setShowAddModal(false)}>close</button>
//   </form>
// </dialog>

//         {/* Delete Confirmation Modal */}
//         <dialog id="delete_confirm_modal" className={`modal ${showDeleteConfirmModal ? 'modal-open' : ''}`}>
//           <div className={`modal-box w-[95%] sm:w-11/12 max-w-md p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto`}>
//             {/* Modal Header */}
//             <div className={`${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700'} px-4 sm:px-6 py-4 border-b backdrop-blur-sm flex items-center gap-3`}>
//               {/* Icon Container */}
//               <div className={`relative p-2 rounded-xl ${theme === 'light' ? 'bg-red-500 shadow-lg shadow-red-500/25' : 'bg-red-400 shadow-lg shadow-red-400/25'}`}>
//                 <BsTrash className="h-4 w-4 text-white" />
//               </div>
              
//               {/* Title */}
//               <div>
//                 <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-red-900' : 'text-red-100'}`}>
//                   Delete Leave Type
//                 </h3>
//                 <p className={`text-sm ${theme === 'light' ? 'text-red-700' : 'text-red-300'} mt-0.5`}>
//                   This action cannot be undone
//                 </p>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-4 sm:p-6">
//               <div className="space-y-4">
//                 <p className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                   Are you sure you want to delete the leave type <strong>"{selectedLeaveType?.leave_type_name}"</strong>?
//                 </p>
                
//                 <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-700'}`}>
//                   <p className={`text-xs ${theme === 'light' ? 'text-red-700' : 'text-red-300'}`}>
//                     <strong>Warning:</strong> This will permanently delete the leave type and all associated configurations. 
//                     This action cannot be undone.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-4 sm:px-6 py-3 border-t flex justify-end gap-3`}>
//               <button
//                 className={`btn btn-sm ${theme === 'light' ? 'btn-ghost text-slate-600 hover:bg-slate-200' : 'btn-ghost text-slate-400 hover:bg-slate-600'}`}
//                 onClick={() => setShowDeleteConfirmModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
//                 onClick={confirmDeleteLeaveType}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//           <form method="dialog" className="modal-backdrop">
//             <button onClick={() => setShowDeleteConfirmModal(false)}>close</button>
//           </form>
//         </dialog>
//       </div>
//     </>
//   )
// }

// export default LeaveType




import React, { useState, useEffect, useCallback  } from 'react';
import Link from 'next/link';
import { FaRegCalendarTimes } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { BsBag } from "react-icons/bs";
import { MdOutlineSick } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { FaHandHoldingHeart } from "react-icons/fa";
import { LuPartyPopper } from "react-icons/lu";
import { LiaBriefcaseMedicalSolid } from "react-icons/lia";
import { BsAirplaneFill } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { pluralize } from '../utils/utils';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../hooks/useNotification';
import { useTheme } from '../components/ThemeProvider';

// Year-of-service brackets already used by your table
interface YearOfServiceBracket {
  min_years: number;     // inclusive
  max_years: number|null; // null = open-ended
  days: number;          // allocation for this bracket
}

// New accrual/renewal support
type AccrualFrequency = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
type RenewalPeriod = 'NONE' | 'YEARLY' | 'QUARTERLY';

/* ===== Add near the top of your component (types & helpers) ===== */
type AllocationPrimary = 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
type EligibilityScope = 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF';


// put near your component top
const toApiPayload1 = (f: Partial<LeaveType>) => ({
  leave_type_name: (f.leave_type_name ?? '').trim(),
  code: (f.code ?? '').trim(),
  description: (f.description ?? null) || null,

  // numbers: coerce
  max_days: Number(f.max_days ?? 0),
  increment_days: Number(f.increment_days ?? 0),
  max_increment_days: Number(f.max_increment_days ?? 0),
  carry_forward_days: Number(f.carry_forward_days ?? 0),
  carryover_max_days: f.carryover_max_days != null ? Number(f.carryover_max_days) : 0,
  carryover_expiry_months: f.carryover_expiry_months != null ? Number(f.carryover_expiry_months) : null,
  accrual_rate: f.accrual_rate != null ? Number(f.accrual_rate) : null,

  // tinyint flags: 0/1
  requires_approval: f.requires_approval ? 1 : 0,
  requires_documentation: f.requires_documentation ? 1 : 0,
  is_active: f.is_active ? 1 : 0,
  is_total: f.allocation_primary === 'IMMEDIATE' ? 1 : (f.is_total ? 1 : 0),
  is_divident: f.allocation_primary === 'EARN' ? 1 : 0,

  // enums/strings
  total_type: f.total_type ?? null,
  company_id: f.company_id ?? '0',

  // NEW policy fields (your backend must accept these)
  allocation_primary: f.allocation_primary ?? 'IMMEDIATE',
  eligibility_scope: f.eligibility_scope ?? 'ALL_STAFF',
  accrual_frequency: f.accrual_frequency ?? 'MONTHLY',
  earn_prorate_join_month: !!f.earn_prorate_join_month,
  renewal_period: f.renewal_period ?? 'NONE',
  expire_unused_at_period_end: !!f.expire_unused_at_period_end,

  // YOS
  yos_brackets: f.yos_brackets ?? [],

  // seed balances if desired
  isNewLeaveType: f.isNewLeaveType ?? false,
});


// put near top
const toApiPayload = (f: Partial<LeaveType>) => ({
  // required
  leave_type_name: (f.leave_type_name ?? '').trim(),
  code: (f.code ?? '').trim(),
  description: (f.description ?? null) || null,
  company_id: f.company_id ?? '0',

  // numbers
  max_days: Number(f.max_days ?? 0),
  increment_days: Number(f.increment_days ?? 0),
  max_increment_days: Number(f.max_increment_days ?? 0),
  carry_forward_days: Number(f.carry_forward_days ?? 0),

  // tinyint flags (0/1 expected by DB)
  requires_approval: f.requires_approval ? 1 : 0,
  requires_documentation: f.requires_documentation ? 1 : 0,
  is_active: f.is_active ? 1 : 0,

  // allocation model from UI (map to legacy flags)
  is_total: (f.allocation_primary ?? 'IMMEDIATE') === 'IMMEDIATE' ? 1 : (f.is_total ? 1 : 0),
  total_type: f.total_type ?? 'IMMEDIATE',
  is_divident: (f.allocation_primary ?? 'IMMEDIATE') === 'EARN' ? 1 : (f.is_divident ? 1 : 0),

  // new policy fields you surface in UI (send to backend; you’ll store them in JSON
  // column or companion tables, or ignore for now if backend isn't ready)
  allocation_primary: f.allocation_primary ?? 'IMMEDIATE',
  eligibility_scope: f.eligibility_scope ?? 'ALL_STAFF',
  accrual_frequency: f.accrual_frequency ?? 'MONTHLY',
  accrual_rate: f.accrual_rate != null ? Number(f.accrual_rate) : null,
  earn_prorate_join_month: !!f.earn_prorate_join_month,
  renewal_period: f.renewal_period ?? 'NONE',
  expire_unused_at_period_end: !!f.expire_unused_at_period_end,
  carryover_max_days: f.carryover_max_days != null ? Number(f.carryover_max_days) : 0,
  carryover_expiry_months: f.carryover_expiry_months != null ? Number(f.carryover_expiry_months) : null,
  yos_brackets: f.yos_brackets ?? [],

  // seed balances flag
  isNewLeaveType: !!f.isNewLeaveType,
});


interface LeaveType {
  id: number;
  leave_type_name: string;
  code: string;
  description: string;
  is_total: boolean;
  total_type: string; // 'IMMEDIATE' | 'ONCE CONFIRMED'
  is_divident: boolean;
  increment_days: number;
  max_increment_days: number;
  carry_forward_days: number;
  max_days: number;
  company_id: string;
  company_name: string | null;
  requires_approval: boolean;
  requires_documentation: boolean;
  is_active: boolean;
  isNewLeaveType: boolean;

  earn_days_per_month?: number;
  yos_brackets?: YearOfServiceBracket[];

  // ... your existing fields ...
  allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
  eligibility_scope?:  'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF';

  // EARN policy
  accrual_frequency?: AccrualFrequency;  // MONTHLY | QUARTERLY | YEARLY
  accrual_rate?: number | null;          // days per period
  earn_prorate_join_month?: boolean;

  // Renewal / cut-off
  renewal_period?: RenewalPeriod;        // NONE | YEARLY | QUARTERLY
  
  expire_unused_at_period_end?: boolean; // if true => use-it-or-lose-it per *accrual* period
  carryover_max_days?: number;           // used when renewal is YEARLY/QUARTERLY and not expiring per period
  carryover_expiry_months?: number | null; // optional expiry for carried days               // optional: prorate final period on exit
}


const LeaveType = () => {
  const { theme } = useTheme();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LeaveType>>({});

const [addForm, setAddForm] = useState<Partial<LeaveType>>({
  // existing
  leave_type_name: '',
  code: '',
  description: '',
  max_days: 0,
  is_total: true,
  total_type: 'IMMEDIATE',
  is_divident: false,
  increment_days: 0,
  max_increment_days: 0,
  carry_forward_days: 0,
  requires_approval: true,
  requires_documentation: false,
  is_active: true,
  company_id: '0',
  isNewLeaveType: true,

  // ... your existing defaults ...
  allocation_primary: 'IMMEDIATE',
  eligibility_scope: 'ALL_STAFF',

  // EARN defaults
  accrual_frequency: 'MONTHLY',
  accrual_rate: 1,                 // "Days earned per period"
  earn_prorate_join_month: true,

  // Renewal / cut-off defaults
  // For “monthly accrual + quarterly refresh (use-it-or-lose-it)”
  renewal_period: 'QUARTERLY',     // QUARTERLY reset at quarter end
  expire_unused_at_period_end: false, // keep period rollover inside quarter
  carryover_max_days: 0,              // quarter-end: forfeit all (0), or carry some if >0
  carryover_expiry_months: null,
});

  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { notification, showNotification } = useNotification();




// YOS helpers
const updateYosBracket = (idx: number, field: keyof YearOfServiceBracket, value: number | null) => {
  setAddForm((prev: any) => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    const row = { ...(list[idx] ?? { min_years: 0, max_years: null, days: 0 }) };
    (row as any)[field] = value;
    list[idx] = row;
    return { ...prev, yos_brackets: list };
  });
};
const addYosRow = () => {
  setAddForm((prev: any) => ({
    ...prev,
    yos_brackets: [...(prev.yos_brackets ?? []), { min_years: 0, max_years: null, days: 0 }],
  }));
};
const removeYosRow = (idx: number) => {
  setAddForm((prev: any) => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    list.splice(idx, 1);
    return { ...prev, yos_brackets: list };
  });
};

  const fetchLeaveTypes = useCallback(async () => {//async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setLeaveTypes(response.data);
      let filtered = response.data.filter((type: LeaveType) => type.company_name === null);
      setFilteredLeaveTypes(filtered);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leave types');
      showNotification('Failed to fetch leave types', 'error');
      console.error('Error fetching leave types:', err);
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);
    //};

      useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  const companies1 = [...new Set(leaveTypes.filter(request => request.company_name !== null).map(request => request.company_name).sort())];

// Build companies as string[]
const companies: string[] = Array.from(
  new Set(
    leaveTypes
      .map(t => t.company_name)               // (string | null)[]
      .filter((c): c is string => !!c)        // -> string[]
  )
).sort();


  const handleApplyFilters = () => {
    let filtered = [...leaveTypes];

    if (selectedCompany !== 'all') {
      filtered = filtered.filter(type => type.company_name === selectedCompany);
    }
    else {
      filtered = filtered.filter(type => type.company_name === null);
    }

    setFilteredLeaveTypes(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCompany = e.target.value;
    setSelectedCompany(newCompany);

    let filtered = [...leaveTypes];
    if (newCompany !== 'all') {
      filtered = filtered.filter(type => type.company_name === newCompany);
    } else {
      filtered = filtered.filter(type => type.company_name === null);
    }
    setFilteredLeaveTypes(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeaveTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredLeaveTypes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewLeaveType = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setShowViewModal(true);
  };

// --- YOS helpers (EDIT) ---
const updateEditYosBracket = (idx: number, field: keyof YearOfServiceBracket, value: number | null) => {
  setEditForm(prev => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    const row = { ...(list[idx] ?? { min_years: 0, max_years: null, days: 0 }) };
    (row as any)[field] = value;
    list[idx] = row;
    return { ...prev, yos_brackets: list };
  });
};
const addEditYosRow = () => {
  setEditForm(prev => ({
    ...prev,
    yos_brackets: [...(prev.yos_brackets ?? []), { min_years: 0, max_years: null, days: 0 }],
  }));
};
const removeEditYosRow = (idx: number) => {
  setEditForm(prev => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    list.splice(idx, 1);
    return { ...prev, yos_brackets: list };
  });
};

// quick setters for editForm
const setEdit = (patch: Partial<LeaveType>) =>
  setEditForm(prev => ({ ...prev, ...patch }));
const setEditNumber = (key: keyof LeaveType, val: number) =>
  setEditForm(prev => ({ ...prev, [key]: val }));

  const handleEditLeaveType1 = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setEditForm({
      leave_type_name: leaveType.leave_type_name || '',
      code: leaveType.code || '',
      description: leaveType.description || '',
      max_days: leaveType.max_days || 0,
      is_total: leaveType.is_total || false,
      total_type: leaveType.total_type || 'IMMEDIATE',
      is_divident: leaveType.is_divident || false,
      increment_days: leaveType.increment_days || 0,
      max_increment_days: leaveType.max_increment_days || 0,
      carry_forward_days: leaveType.carry_forward_days || 0,
      requires_approval: leaveType.requires_approval || false,
      requires_documentation: leaveType.requires_documentation || false,
      is_active: leaveType.is_active || false,
      company_id: leaveType.company_id || '0'
    });
    setShowEditModal(true);
  };

const handleEditLeaveType = (leaveType: LeaveType) => {
  setSelectedLeaveType(leaveType);

  // infer allocation_primary if not provided (from legacy flags)
  const inferredAllocation: AllocationPrimary =
    leaveType.allocation_primary ??
    (leaveType.is_total ? 'IMMEDIATE' : leaveType.is_divident ? 'EARN' : 'YEAR_OF_SERVICE');

  setEditForm({
    // existing
    leave_type_name: leaveType.leave_type_name || '',
    code: leaveType.code || '',
    description: leaveType.description || '',
    max_days: leaveType.max_days || 0,
    is_total: !!leaveType.is_total,
    total_type: leaveType.total_type || 'IMMEDIATE',
    is_divident: !!leaveType.is_divident,
    increment_days: leaveType.increment_days || 0,
    max_increment_days: leaveType.max_increment_days || 0,
    carry_forward_days: leaveType.carry_forward_days || 0,
    requires_approval: !!leaveType.requires_approval,
    requires_documentation: !!leaveType.requires_documentation,
    is_active: !!leaveType.is_active,
    company_id: leaveType.company_id || '0',

    // NEW
    allocation_primary: inferredAllocation,
    eligibility_scope: leaveType.eligibility_scope ?? 'ALL_STAFF',

    accrual_frequency: leaveType.accrual_frequency ?? 'MONTHLY',
    accrual_rate: leaveType.accrual_rate ?? 1,
    earn_prorate_join_month: leaveType.earn_prorate_join_month ?? true,

    renewal_period: leaveType.renewal_period ?? 'NONE',
    expire_unused_at_period_end: !!leaveType.expire_unused_at_period_end,
    carryover_max_days: leaveType.carryover_max_days ?? 0,
    carryover_expiry_months: leaveType.carryover_expiry_months ?? null,

    yos_brackets: leaveType.yos_brackets ?? [],
  });

  setShowEditModal(true);
};


const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedLeaveType) return;

  const payload = toApiPayload(editForm);
  await axios.put(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` }
  });

  setShowEditModal(false);
  showNotification('Leave type updated successfully', 'success');
  fetchLeaveTypes();
  // either re-fetch (your current code) or patch local list like in create A.
  const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` }
  });
  setLeaveTypes(response.data);
  setFilteredLeaveTypes(
    selectedCompany !== 'all'
      ? response.data.filter((t: LeaveType) => t.company_name === selectedCompany)
      : response.data.filter((t: LeaveType) => t.company_name === null)
  );
};


  const handleEditSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeaveType) return;

    try {
      await axios.put(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setShowEditModal(false);
      showNotification('Leave type updated successfully', 'success');

      // Fetch updated leave types
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setLeaveTypes(response.data);

      // Apply the current company filter
      let filtered = [...response.data];
      if (selectedCompany !== 'all') {
        filtered = filtered.filter(type => type.company_name === selectedCompany);
      } else {
        filtered = filtered.filter(type => type.company_name === null);
      }
      setFilteredLeaveTypes(filtered);

    } catch (err) {
      console.error('Error updating leave type:', err);
      showNotification('Failed to update leave type', 'error');
      setError('Failed to update leave type');
    }
  };


  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Handle mutual exclusivity between total and divident
      if (name === 'is_total' && checked) {
        setEditForm(prev => ({
          ...prev,
          is_total: true,
          is_divident: false
        }));
        return;
      }
      
      if (name === 'is_divident' && checked) {
        setEditForm(prev => ({
          ...prev,
          is_divident: true,
          is_total: false
        }));
        return;
      }
      
      // Handle unchecking
      setEditForm(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Handle mutual exclusivity between total and divident
      if (name === 'is_total' && checked) {
        setAddForm(prev => ({
          ...prev,
          is_total: true,
          is_divident: false
        }));
        return;
      }
      
      if (name === 'is_divident' && checked) {
        setAddForm(prev => ({
          ...prev,
          is_divident: true,
          is_total: false
        }));
        return;
      }
      
      // Handle unchecking
      setAddForm(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    setAddForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Unique company options with id + name (ignore null/global)
const companyOptions: { id: string; name: string }[] = Array.from(
  new Map(
    leaveTypes
      .filter(t => t.company_id && t.company_name) // keep only company-specific
      .map(t => [t.company_id, t.company_name as string]) // [id, name]
  ).entries()
).map(([id, name]) => ({ id, name }))
 .sort((a, b) => a.name.localeCompare(b.name));



  const handleAddLeaveType = () => {
  // If page filter shows a specific company, preselect it; otherwise use '0' for Global
  let companyId = '0';
  if (selectedCompany !== 'all') {
    const found = companyOptions.find(c => c.name === selectedCompany);
    if (found) companyId = found.id;
  }

  setAddForm(prev => ({
    ...prev,
    company_id: companyId
  }));
  setShowAddModal(true);
};


  const handleAddLeaveType1 = () => {
    // Get the selected company's ID
    const selectedCompanyData = leaveTypes.find(type => type.company_name === selectedCompany);
    const companyId = selectedCompanyData?.company_id || '0';
    
    setAddForm(prev => ({
      ...prev,
      company_id: companyId
    }));
    setShowAddModal(true);
  };

  const handleAddSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/v1/leave-types`, addForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      setShowAddModal(false);
      showNotification('Leave type created successfully', 'success');

      // Reset form
    setAddForm({
  leave_type_name: '',
  code: '',
  description: '',
  max_days: 0,
  is_total: true,
  total_type: 'IMMEDIATE',
  is_divident: false,
  increment_days: 0,
  max_increment_days: 0,
  carry_forward_days: 0,
  requires_approval: true,
  requires_documentation: false,
  is_active: true,
  company_id: '0',
  isNewLeaveType: true,

  // NEW
  allocation_primary: 'IMMEDIATE',
  eligibility_scope: 'ALL_STAFF',
  earn_days_per_month: 1,
  earn_prorate_join_month: true,
  yos_brackets: [],
});


      // Fetch updated leave types
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setLeaveTypes(response.data);

      // Apply the current company filter
      let filtered = [...response.data];
      if (selectedCompany !== 'all') {
        filtered = filtered.filter(type => type.company_name === selectedCompany);
      } else {
        filtered = filtered.filter(type => type.company_name === null);
      }
      setFilteredLeaveTypes(filtered);

    } catch (err) {
      console.error('Error creating leave type:', err);
      showNotification('Failed to create leave type', 'error');
      setError('Failed to create leave type');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = toApiPayload(addForm);
    const { data: created } = await axios.post(`${API_BASE_URL}/api/v1/leave-types`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` }
    });

    // Close modal + toast
    setShowAddModal(false);
    showNotification('Leave type created successfully', 'success');

    fetchLeaveTypes();
    // Add to local list (so UI updates instantly)
    setLeaveTypes(prev => {
      const next = [created, ...prev];
      // Respect current company filter
      const filtered = (selectedCompany !== 'all')
        ? next.filter(t => t.company_name === selectedCompany)
        : next.filter(t => t.company_name === null);
      setFilteredLeaveTypes(filtered);
      return next;
    });

    // Reset form
    setAddForm({
      leave_type_name: '',
      code: '',
      description: '',
      max_days: 0,
      is_total: true,
      total_type: 'IMMEDIATE',
      is_divident: false,
      increment_days: 0,
      max_increment_days: 0,
      carry_forward_days: 0,
      requires_approval: true,
      requires_documentation: false,
      is_active: true,
      company_id: '0',
      isNewLeaveType: true,

      allocation_primary: 'IMMEDIATE',
      eligibility_scope: 'ALL_STAFF',

      accrual_frequency: 'MONTHLY',
      accrual_rate: 1,
      earn_prorate_join_month: true,

      renewal_period: 'QUARTERLY',
      expire_unused_at_period_end: false,
      carryover_max_days: 0,
      carryover_expiry_months: null,

      yos_brackets: [],
    });
  } catch (err) {
    console.error('Error creating leave type:', err);
    showNotification('Failed to create leave type', 'error');
    setError('Failed to create leave type');
  }
};


  const handleDeleteLeaveType = () => {
    if (!selectedLeaveType) return;

    // Don't allow deletion of UNPAID leave type
    if (selectedLeaveType.code === 'UNPAID') {
      showNotification('Cannot delete UNPAID leave type', 'error');
      return;
    }

    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteLeaveType = async () => {
    if (!selectedLeaveType) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      setShowDeleteConfirmModal(false);
      setShowViewModal(false);
      showNotification('Leave type deleted successfully', 'success');

      // Fetch updated leave types
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setLeaveTypes(response.data);

      // Apply the current company filter
      let filtered = [...response.data];
      if (selectedCompany !== 'all') {
        filtered = filtered.filter(type => type.company_name === selectedCompany);
      } else {
        filtered = filtered.filter(type => type.company_name === null);
      }
      setFilteredLeaveTypes(filtered);

    } catch (err: any) {
      console.error('Error deleting leave type:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete leave type';
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <>    
      {/* Notification Toast */}
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      
      <div className={`container mx-auto p-3 sm:p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
        <div className="mt-4 sm:mt-8 flow-root">
          <div className="mt-1">
            <div>
              <div>
                <label htmlFor="company" className={`block text-sm sm:text-base font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'} mb-2`}>
                  Company
                </label>
                <div className="mt-2">
                  <select
                    id="company"
                    name="company"
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    className={`select select-bordered w-full sm:w-auto sm:max-w-xs text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="all">Default settings</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Type */}
        <div className="mt-6 sm:mt-8 flow-root">
          <div className={`card ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg`}>
            <div className="card-body p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <h2 className={`card-title flex flex-col sm:flex-row items-start sm:items-center gap-2 text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">Standard Leave Types</span>
                </h2>
                
                {(
                  <button
                    onClick={handleAddLeaveType}
                    className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-primary hover:bg-primary' : 'bg-primary-500 hover:bg-primary-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Add Leave Type</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-32 sm:h-40">
                  <div className={`loading loading-spinner loading-md sm:loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></div>
                </div>
              ) : error ? (
                <div className={`text-center py-6 sm:py-8 px-4 text-sm sm:text-base ${theme === 'light' ? 'text-red-500' : 'text-red-400'}`}>
                  <div className="break-words">{error}</div>
                </div>
              ) : (
                <>
                  {/* Mobile-first table design */}
                  <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
                    {/* Desktop table */}
                    <div className="hidden sm:block">
                      <table className="table w-full">
                        <thead>
                          <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                            <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Type</th>
                            <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Description</th>
                            <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Days</th>
                            <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((leaveType, index) => (
                            <tr 
                              key={leaveType.id} 
                              className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentData.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                            >
                              <td className={`px-2 lg:px-4 py-3`}>
                                <div className={`font-medium text-sm lg:text-base ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} break-words`}>{leaveType.leave_type_name}</div>
                              </td>
                              <td className={`px-2 lg:px-4 py-3 max-w-[200px] lg:max-w-[300px] ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-sm lg:text-base`}>
                                <div className="break-words line-clamp-3">{leaveType.description}</div>
                              </td>
                              <td className={`px-2 lg:px-4 py-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-sm lg:text-base`}>
                                {leaveType.code !== 'UNPAID' ? `${leaveType.max_days} days / year` : '-'}
                              </td>
                              <td className="text-center px-2 lg:px-4 py-3">
                                <div className="flex justify-center gap-1 lg:gap-2 min-w-[100px] lg:min-w-[120px]">
                                  {leaveType?.code !== 'UNPAID' && (
                                    <button
                                      onClick={() => handleEditLeaveType(leaveType)}
                                      className={`btn btn-xs sm:btn-sm lg:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm`}
                                    >
                                      Edit
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleViewLeaveType(leaveType)}
                                    className={`btn btn-xs sm:btn-sm lg:btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 text-xs sm:text-sm`}
                                  >
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile card layout */}
                    <div className="sm:hidden space-y-3">
                      {currentData.map((leaveType, index) => (
                        <div 
                          key={leaveType.id}
                          className={`${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'} rounded-lg p-4 space-y-3`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} break-words`}>
                                {leaveType.leave_type_name}
                              </h3>
                              <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                {leaveType.code !== 'UNPAID' ? `${leaveType.max_days} days / year` : 'Unpaid Leave'}
                              </p>
                            </div>
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              {leaveType?.code !== 'UNPAID' && (
                                <button
                                  onClick={() => handleEditLeaveType(leaveType)}
                                  className={`btn btn-xs ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                onClick={() => handleViewLeaveType(leaveType)}
                                className={`btn btn-xs ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                              >
                                View
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className={`text-xs ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} line-clamp-2`}>
                              {leaveType.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {filteredLeaveTypes.length > 0 && (
                    <>
                      <div className={`mt-4 text-xs sm:text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} px-2 sm:px-0`}>
                        <span className="hidden sm:inline">Showing {startIndex + 1} to {Math.min(endIndex, filteredLeaveTypes.length)} of {filteredLeaveTypes.length} leave types</span>
                        <span className="sm:hidden">{startIndex + 1}-{Math.min(endIndex, filteredLeaveTypes.length)} of {filteredLeaveTypes.length}</span>
                      </div>
                      
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-4 sm:mt-6 px-2 sm:px-0">
                          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-0">
                            <button 
                              className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px] sm:min-w-[40px]`}
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <span className="hidden sm:inline">«</span>
                              <span className="sm:hidden">‹</span>
                            </button>
                            
                            {/* Mobile: Show only current page and adjacent pages */}
                            <div className="flex sm:hidden">
                              {currentPage > 1 && (
                                <button 
                                  className={`btn btn-xs ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px]`}
                                  onClick={() => handlePageChange(currentPage - 1)}
                                >
                                  {currentPage - 1}
                                </button>
                              )}
                              <button 
                                className={`btn btn-xs bg-blue-600 text-white min-w-[32px]`}
                              >
                                {currentPage}
                              </button>
                              {currentPage < totalPages && (
                                <button 
                                  className={`btn btn-xs ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px]`}
                                  onClick={() => handlePageChange(currentPage + 1)}
                                >
                                  {currentPage + 1}
                                </button>
                              )}
                            </div>
                            
                            {/* Desktop: Show all pages */}
                            <div className="hidden sm:flex">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button 
                                  key={page}
                                  className={`btn btn-sm ${currentPage === page ? 
                                    `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                                    `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                                  } min-w-[40px]`}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>
                            
                            <button 
                              className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px] sm:min-w-[40px]`}
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <span className="hidden sm:inline">»</span>
                              <span className="sm:hidden">›</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* View Modal */}
        <dialog
          id="view_modal"
          className={`modal ${showViewModal ? 'modal-open' : ''}`}
        >
          <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
            {/* Modal Header */}
            <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}`} style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              
              <div className="flex items-center gap-4 relative z-10">
                {/* Icon Container */}
                <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25' : 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-400/25'} transform hover:scale-105 transition-all duration-300`}>
                  <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
                </div>
                
                {/* Title Section */}
                <div className="flex flex-col">
                  <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
                    Leave Type Details
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
                    View comprehensive leave configuration
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
                onClick={() => setShowViewModal(false)}
              >
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <label className="label p-0">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type Name</span>
                    </label>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>{selectedLeaveType?.leave_type_name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="label p-0">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Code</span>
                    </label>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.code}</p>
                  </div>
                  {selectedLeaveType?.code !== 'UNPAID' && (
                    <div className="space-y-1">
                      <label className="label p-0">
                        <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Maximum Days</span>
                      </label>
                      <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.max_days} days / year</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="label p-0">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
                    </label>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>{selectedLeaveType?.company_name || 'Global'}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="label p-0">
                    <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Description</span>
                  </label>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>{selectedLeaveType?.description}</p>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <label className="label p-0">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requires Documentation</span>
                    </label>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.requires_documentation ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="label p-0">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Status</span>
                    </label>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                
                {selectedLeaveType?.code !== 'UNPAID' && (
                  <>
                    {/* Allocation Methods */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1">
                        <label className="label p-0">
                          <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Upfront Allocation</span>
                        </label>
                        <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.is_total ? 'Yes' : 'No'}</p>
                        {selectedLeaveType?.is_total && (
                          <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'} mt-1`}>
                            Type: {selectedLeaveType?.total_type}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="label p-0">
                          <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Gradual Accrual</span>
                        </label>
                        <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.is_divident ? 'Yes' : 'No'}</p>
                      </div>
                    </div>





                    {/* Increment Section */}
                    <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
                      <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Increment Details</h4>
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} font-medium`}>Allocate Days:</span>
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{selectedLeaveType?.increment_days ?? 0} day{pluralize(selectedLeaveType?.increment_days)}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} font-medium`}>Maximum Allocate Days:</span>
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>{selectedLeaveType?.max_increment_days ?? 0} day{pluralize(selectedLeaveType?.max_increment_days)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex justify-end items-center gap-3 mt-auto z-10`}>
              {/* Delete Button - Only show if not UNPAID leave type */}
              {selectedLeaveType?.code !== 'UNPAID' && (
                <button
                  className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
                  onClick={handleDeleteLeaveType}
                >
                  <BsTrash className="w-3 h-3" />
                  Delete
                </button>
              )}
              
              {/* Close Button */}
              <button
                className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm`}
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowViewModal(false)}>close</button>
          </form>
        </dialog>

{/* Edit Modal */}
<dialog id="edit_modal" className={`modal ${showEditModal ? 'modal-open' : ''}`}>
  <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
    {/* Modal Header */}
    <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
      <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25' : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/25'} transform hover:scale-105 transition-all duration-300`}>
          <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`} />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
        </div>
        <div className="flex flex-col">
          <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
            Edit Leave Type
          </h3>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
            Modify leave configuration settings
          </p>
        </div>
      </div>

      <button
        className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
        onClick={() => setShowEditModal(false)}
      >
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`} />
        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Modal Content - Scrollable */}
    <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
      <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type Name</span>
            </label>
            <input
              type="text"
              id="leave_type_name"
              name="leave_type_name"
              value={editForm.leave_type_name ?? ''}
              onChange={handleInputChange}
              className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
              required
              readOnly
            />
          </div>

          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Code</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={editForm.code ?? ''}
              onChange={handleInputChange}
              className={`input input-bordered w-full text-sm sm:text-base ${editForm.code === 'UNPAID'
                ? (theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100')
                : (theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100')
              }`}
              required
              readOnly={editForm.code === 'UNPAID'}
            />
          </div>

          {editForm.code !== 'UNPAID' && (
            <div>
              <label className="label p-0 pb-1">
                <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Maximum Days</span>
              </label>
              <input
                type="number"
                id="max_days"
                name="max_days"
                value={editForm.max_days ?? 0}
                onChange={handleInputChange}
                className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                required
              />
            </div>
          )}

          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
            </label>
            <input
              type="text"
              id="company_name"
              value={selectedLeaveType?.company_name ?? ''}
              className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
              readOnly
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label p-0 pb-1">
            <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Description</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={editForm.description ?? ''}
            onChange={handleInputChange}
            rows={3}
            className={`textarea textarea-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
            required
          />
        </div>

        {/* Requirements */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requirements</h4>
          <div className="space-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-2 sm:gap-4 sm:space-y-0">
            <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
              <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requires Documentation</span>
              <input
                type="checkbox"
                id="requires_documentation"
                name="requires_documentation"
                checked={editForm.requires_documentation ?? false}
                onChange={handleInputChange}
                className="checkbox checkbox-sm sm:checkbox-md checkbox-primary"
              />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
              <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Active</span>
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={editForm.is_active ?? false}
                onChange={handleInputChange}
                className="checkbox checkbox-sm sm:checkbox-md checkbox-primary"
              />
            </div>
          </div>
        </div>

        {/* ===== NEW: Allocation & Eligibility (EDIT) ===== */}
        {editForm.code !== 'UNPAID' && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              Allocation & Eligibility
            </h4>

            {/* Primary Allocation */}
            <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Primary Allocation
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { val: 'IMMEDIATE', label: 'Immediate' },
                  { val: 'EARN', label: 'Earn (accrual)' },
                  { val: 'YEAR_OF_SERVICE', label: 'Year of service' },
                ].map(opt => (
                  <label key={opt.val} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'}`}>
                    <input
                      type="radio"
                      name="allocation_primary_edit"
                      value={opt.val}
                      checked={(editForm.allocation_primary ?? 'IMMEDIATE') === opt.val}
                      onChange={(e) => setEdit({ allocation_primary: e.target.value as AllocationPrimary })}
                      className="radio radio-primary radio-sm"
                    />
                    <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* If EARN (accrual) */}
              {editForm.allocation_primary === 'EARN' && (
                <div className="mt-3 space-y-4">
                  {/* Frequency / Rate / Prorate */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        Accrual frequency
                      </label>
                      <select
                        name="accrual_frequency_edit"
                        value={editForm.accrual_frequency ?? 'MONTHLY'}
                        onChange={(e) => setEdit({ accrual_frequency: e.target.value as AccrualFrequency })}
                        className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      >
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        {editForm.accrual_frequency === 'QUARTERLY'
                          ? 'Days earned per quarter'
                          : editForm.accrual_frequency === 'YEARLY'
                          ? 'Days earned per year'
                          : 'Days earned per month'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        name="accrual_rate_edit"
                        value={editForm.accrual_rate ?? 0}
                        onChange={(e) => setEditNumber('accrual_rate', Number(e.target.value))}
                        className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      />
                    </div>

                    <div className="flex items-end">
                      <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}`}>
                        <input
                          type="checkbox"
                          name="earn_prorate_join_month_edit"
                          checked={!!editForm.earn_prorate_join_month}
                          onChange={(e) => setEdit({ earn_prorate_join_month: e.target.checked })}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                          Prorate join {(editForm.accrual_frequency ?? 'MONTHLY').toLowerCase()}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Carryover & Reset */}
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex items-end">
                        <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
                          <input
                            type="checkbox"
                            name="expire_unused_at_period_end_edit"
                            checked={!!editForm.expire_unused_at_period_end}
                            onChange={(e) => setEdit({ expire_unused_at_period_end: e.target.checked })}
                            className="checkbox checkbox-primary checkbox-sm"
                          />
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                            Use-it-or-lose-it at end of {(editForm.accrual_frequency ?? 'MONTHLY').toLowerCase()}
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Renewal period (reset cycle)
                        </label>
                        <select
                          name="renewal_period_edit"
                          value={editForm.renewal_period ?? 'YEARLY'}
                          onChange={(e) => setEdit({ renewal_period: e.target.value as RenewalPeriod })}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                          disabled={!!editForm.expire_unused_at_period_end}
                        >
                          <option value="YEARLY">Yearly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="NONE">No renewal/reset</option>
                        </select>
                      </div>

                      {!editForm.expire_unused_at_period_end && editForm.renewal_period !== 'NONE' && (
                        <div>
                          <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                            Carryover max days
                          </label>
                          <input
                            type="number"
                            min={0}
                            name="carryover_max_days_edit"
                            value={editForm.carryover_max_days ?? 0}
                            onChange={(e) => setEditNumber('carryover_max_days', Number(e.target.value))}
                            className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* YEAR_OF_SERVICE brackets */}
              {editForm.allocation_primary === 'YEAR_OF_SERVICE' && (
                <div className="mt-3">
                  <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Year-of-Service Brackets
                  </label>

                  <div className="overflow-auto rounded-md border border-slate-200 dark:border-slate-600">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th className="text-xs">Min years</th>
                          <th className="text-xs">Max years (blank = ∞)</th>
                          <th className="text-xs">Days</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(editForm.yos_brackets ?? []).map((row: YearOfServiceBracket, idx: number) => (
                          <tr key={idx}>
                            <td>
                              <input
                                type="number"
                                min={0}
                                value={row.min_years ?? 0}
                                onChange={(e) => updateEditYosBracket(idx, 'min_years', Number(e.target.value))}
                                className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min={0}
                                placeholder="∞"
                                value={row.max_years ?? ''}
                                onChange={(e) => updateEditYosBracket(idx, 'max_years', e.target.value === '' ? null : Number(e.target.value))}
                                className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min={0}
                                value={row.days ?? 0}
                                onChange={(e) => updateEditYosBracket(idx, 'days', Number(e.target.value))}
                                className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                              />
                            </td>
                            <td>
                              <button type="button" onClick={() => removeEditYosRow(idx)} className="btn btn-xs btn-ghost text-red-600">
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-2">
                    <button type="button" onClick={addEditYosRow} className={`btn btn-sm ${theme === 'light' ? 'btn-outline' : 'btn-outline'}`}>
                      Add bracket
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Eligibility */}
            <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Eligibility Scope
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { val: 'UPON_CONFIRM', label: 'Upon confirmation' },
                  { val: 'UNDER_PROBATION', label: 'Under probation' },
                  { val: 'ALL_STAFF', label: 'All staff' },
                ].map(opt => (
                  <label key={opt.val} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'}`}>
                    <input
                      type="radio"
                      name="eligibility_scope_edit"
                      value={opt.val}
                      checked={(editForm.eligibility_scope ?? 'ALL_STAFF') === opt.val}
                      onChange={(e) => setEdit({ eligibility_scope: e.target.value as EligibilityScope })}
                      className="radio radio-primary radio-sm"
                    />
                    <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Carry Forward */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Carry Forward Days</span>
            </label>
            <input
              type="number"
              id="carry_forward_days"
              name="carry_forward_days"
              value={editForm.carry_forward_days ?? 0}
              onChange={handleInputChange}
              className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              required
            />
          </div>
        </div>

        {/* Increment Section */}
        <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
          <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Increment Details</h4>
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
                  Allocate Days
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="increment_days"
                    name="increment_days"
                    value={editForm.increment_days ?? 0}
                    onChange={handleInputChange}
                    className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                    required
                  />
                  <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    day{pluralize(editForm?.increment_days)}
                  </span>
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
                  Maximum Allocate Days
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="max_increment_days"
                    name="max_increment_days"
                    value={editForm.max_increment_days ?? 0}
                    onChange={handleInputChange}
                    className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                    required
                  />
                  <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    day{pluralize(editForm?.max_increment_days)} max
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    {/* Modal Footer */}
    <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex flex-col sm:flex-row justify-end gap-2 mt-auto z-10`}>
      <button
        type="button"
        onClick={() => setShowEditModal(false)}
        className={`btn btn-sm sm:btn-md btn-ghost w-full sm:w-auto ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'} text-xs sm:text-sm order-2 sm:order-1`}
      >
        Cancel
      </button>
      {selectedLeaveType?.code !== 'UNPAID' && (
        <button
          type="submit"
          onClick={handleEditSubmit}
          className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm order-1 sm:order-2`}
        >
          Save Changes
        </button>
      )}
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button onClick={() => setShowEditModal(false)}>close</button>
  </form>
</dialog>



        {/* Add Modal */}
        <dialog id="add_modal" className={`modal ${showAddModal ? 'modal-open' : ''}`}>
          <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
            {/* Modal Header */}
            <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-green-500' : 'bg-green-400'}`} style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              
              <div className="flex items-center gap-4 relative z-10">
                {/* Icon Container */}
                <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25' : 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-400/25'} transform hover:scale-105 transition-all duration-300`}>
                  <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-green-500' : 'bg-green-400'}`}></div>
                </div>
                
                {/* Title Section */}
                <div className="flex flex-col">
                  <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
                    Add New Leave Type
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
                    Create a new leave configuration
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
                onClick={() => setShowAddModal(false)}
              >
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
              <form onSubmit={handleAddSubmit} className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="label p-0 pb-1">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type Name <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      id="leave_type_name"
                      name="leave_type_name"
                      value={addForm.leave_type_name ?? ''}
                      onChange={handleAddInputChange}
                      className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      placeholder="e.g., Annual Leave"
                      required
                    />
                  </div>

                  <div>
                    <label className="label p-0 pb-1">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Code <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={addForm.code ?? ''}
                      onChange={handleAddInputChange}
                      className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      placeholder="e.g., AL"
                      required
                    />
                  </div>

                  <div>
                    <label className="label p-0 pb-1">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Maximum Days <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="number"
                      id="max_days"
                      name="max_days"
                      value={addForm.max_days ?? 0}
                      onChange={handleAddInputChange}
                      className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      min="0"
                      placeholder="e.g., 14"
                      required
                    />
                  </div>

                  {/* <div>
                    <label className="label p-0 pb-1">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
                    </label>
                    <input
                      type="text"
                      value={selectedCompany == 'all' ? 'All Companies' : selectedCompany}
                      className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
                      readOnly
                    />
                  </div> */}

                  <div>
          <label className="label p-0 pb-1">
            <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              Company
            </span>
          </label>
          <select
            name="company_id"
            value={addForm.company_id ?? '0'}
            onChange={(e) => setAddForm(p => ({ ...p, company_id: e.target.value }))}
            className={`select select-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
          >
            {/* Global/default option */}
            <option value="0">Default settings (Global)</option>

            {/* Company-specific options */}
            {companyOptions.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

                </div>

                {/* Description */}
                <div>
                  <label className="label p-0 pb-1">
                    <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Description <span className="text-red-500">*</span></span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={addForm.description ?? ''}
                    onChange={handleAddInputChange}
                    rows={3}
                    className={`textarea textarea-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                    placeholder="Describe the leave type..."
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requirements</h4>
                  
                  <div className="space-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-2 sm:gap-4 sm:space-y-0">
                    <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
                      <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requires Documentation</span>
                      <input
                        type="checkbox"
                        id="requires_documentation"
                        name="requires_documentation"
                        checked={addForm.requires_documentation ?? false}
                        onChange={handleAddInputChange}
                        className={`checkbox checkbox-sm sm:checkbox-md ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
                      />
                    </div>

                    <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
                      <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Active</span>
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={addForm.is_active ?? false}
                        onChange={handleAddInputChange}
                        className={`checkbox checkbox-sm sm:checkbox-md ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Allocation Methods (existing) */}
                {/* <div className="space-y-3 sm:space-y-4">
                  <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Allocation Methods</h4>
                  
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          id="is_total"
                          name="is_total"
                          checked={addForm.is_total ?? false}
                          onChange={handleAddInputChange}
                          className={`checkbox checkbox-sm sm:checkbox-md mt-0.5 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
                        />
                        <div className="flex-1">
                          <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} block`}>Upfront Allocation</span>
                          <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Total leave days given at once</span>
                        </div>
                      </label>
                      
                      {addForm.is_total && (
                        <div className="mt-3 pl-6 sm:pl-8">
                          <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
                            Allocation Type
                          </label>
                          <div className="relative">
                            <select
                              id="total_type"
                              name="total_type"
                              value={addForm.total_type ?? 'IMMEDIATE'}
                              onChange={handleAddInputChange}
                              className={`w-full appearance-none rounded-md py-2 pr-8 pl-3 text-sm sm:text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 ${
                                theme === 'light' 
                                  ? 'bg-white text-gray-900 outline-gray-300 focus:outline-blue-600' 
                                  : 'bg-slate-700 text-slate-100 outline-slate-600 focus:outline-blue-400'
                              }`}
                            >
                              <option value="IMMEDIATE">Immediate</option>
                              <option value="ONCE CONFIRMED">Once Confirmed</option>
                            </select></div>
                        </div>
                      )}
                    </div>

                    <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          id="is_divident"
                          name="is_divident"
                          checked={addForm.is_divident ?? false}
                          onChange={handleAddInputChange}
                          className={`checkbox checkbox-sm sm:checkbox-md mt-0.5 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-primary'}`}
                        />
                        <div className="flex-1">
                          <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} block`}>Gradual Accrual</span>
                          <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Leave earned monthly</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div> */}

                {/* ===== NEW: Allocation & Eligibility (mock) ===== */}
                <div className="space-y-3 sm:space-y-4">
                  <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Allocation & Eligibility
                  </h4>

                  {/* Primary Allocation */}
                  <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Primary Allocation
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { val: 'IMMEDIATE', label: 'Immediate' },
                        { val: 'EARN', label: 'Earn (accrual)' },
                        { val: 'YEAR_OF_SERVICE', label: 'Year of service' },
                      ].map((opt) => (
                        <label key={opt.val} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'}`}>
                          <input
                            type="radio"
                            name="allocation_primary"
                            value={opt.val}
                            checked={(addForm.allocation_primary ?? 'IMMEDIATE') === opt.val}
                            onChange={(e) => setAddForm((p: any) => ({ ...p, allocation_primary: e.target.value as AllocationPrimary }))}
                            className="radio radio-primary radio-sm"
                          />
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* If EARN (accrual), show rate inputs */}
        {/* If EARN (accrual), show frequency, rate, proration, and carryover in one block */}
        {addForm.allocation_primary === 'EARN' && (
          <div className="mt-3 space-y-4">
            {/* Frequency / Rate / Prorate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Frequency */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Accrual frequency
                </label>
                <select
                  name="accrual_frequency"
                  value={addForm.accrual_frequency ?? 'MONTHLY'}
                  onChange={(e) => setAddForm(p => ({ ...p, accrual_frequency: e.target.value as AccrualFrequency }))}
                  className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              {/* Rate (days per period) */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  {addForm.accrual_frequency === 'QUARTERLY'
                    ? 'Days earned per quarter'
                    : addForm.accrual_frequency === 'YEARLY'
                    ? 'Days earned per year'
                    : 'Days earned per month'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  name="accrual_rate"
                  value={addForm.accrual_rate ?? 0}
                  onChange={(e) => setAddForm(p => ({ ...p, accrual_rate: Number(e.target.value) }))}
                  className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                />
              </div>

              {/* Prorate join period */}
              <div className="flex items-end">
                <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}`}>
                  <input
                    type="checkbox"
                    name="earn_prorate_join_month"
                    checked={addForm.earn_prorate_join_month ?? false}
                    onChange={(e) => setAddForm(p => ({ ...p, earn_prorate_join_month: e.target.checked }))}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                    Prorate join { (addForm.accrual_frequency ?? 'MONTHLY').toLowerCase() }
                  </span>
                </label>
              </div>
            </div>

            {/* Carryover & Reset (inside Earn) */}
            <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Use-it-or-lose-it at end of accrual period */}
                <div className="flex items-end">
                  <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
                    <input
                      type="checkbox"
                      name="expire_unused_at_period_end"
                      checked={addForm.expire_unused_at_period_end ?? false}
                      onChange={(e) => setAddForm(p => ({ ...p, expire_unused_at_period_end: e.target.checked }))}
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                      Use-it-or-lose-it at end of {(addForm.accrual_frequency ?? 'MONTHLY').toLowerCase()}
                    </span>
                  </label>
                </div>

                {/* Renewal cadence (reset cycle) */}
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Renewal period (reset cycle)
                  </label>
                  <select
                    name="renewal_period"
                    value={addForm.renewal_period ?? 'YEARLY'}
                    onChange={(e) => setAddForm(p => ({ ...p, renewal_period: e.target.value as RenewalPeriod }))}
                    className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                    disabled={addForm.expire_unused_at_period_end}
                  >
                    <option value="YEARLY">Yearly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="NONE">No renewal/reset</option>
                  </select>
                </div>

                {/* Carryover controls (only when not expiring per period and renewal is active) */}
                {(!addForm.expire_unused_at_period_end && addForm.renewal_period !== 'NONE') && (
                  <>
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        Carryover max days
                      </label>
                      <input
                        type="number"
                        min={0}
                        name="carryover_max_days"
                        value={addForm.carryover_max_days ?? 0}
                        onChange={(e) => setAddForm(p => ({ ...p, carryover_max_days: Number(e.target.value) }))}
                        className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}



                    {/* If YEAR_OF_SERVICE, show brackets */}
                    {(addForm.allocation_primary === 'YEAR_OF_SERVICE') && (
                      <div className="mt-3">
                        <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Year-of-Service Brackets
                        </label>

                        <div className="overflow-auto rounded-md border border-slate-200 dark:border-slate-600">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th className="text-xs">Min years</th>
                                <th className="text-xs">Max years (blank = ∞)</th>
                                <th className="text-xs">Days</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {(addForm.yos_brackets ?? []).map((row: YearOfServiceBracket, idx: number) => (
                                <tr key={idx}>
                                  <td>
                                    <input
                                      type="number"
                                      min={0}
                                      value={row.min_years ?? 0}
                                      onChange={(e) => updateYosBracket(idx, 'min_years', Number(e.target.value))}
                                      className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      min={0}
                                      placeholder="∞"
                                      value={row.max_years ?? ''}
                                      onChange={(e) => updateYosBracket(idx, 'max_years', e.target.value === '' ? null : Number(e.target.value))}
                                      className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      min={0}
                                      value={row.days ?? 0}
                                      onChange={(e) => updateYosBracket(idx, 'days', Number(e.target.value))}
                                      className={`input input-bordered input-xs w-24 ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                                    />
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      onClick={() => removeYosRow(idx)}
                                      className="btn btn-xs btn-ghost text-red-600"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-2">
                          <button type="button" onClick={addYosRow} className={`btn btn-sm ${theme === 'light' ? 'btn-outline' : 'btn-outline'}`}>
                            Add bracket
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Eligibility */}
                  <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Eligibility Scope
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { val: 'UPON_CONFIRM', label: 'Upon confirmation' },
                        { val: 'UNDER_PROBATION', label: 'Under probation' },
                        { val: 'ALL_STAFF', label: 'All staff' },
                      ].map((opt) => (
                        <label key={opt.val} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'}`}>
                          <input
                            type="radio"
                            name="eligibility_scope"
                            value={opt.val}
                            checked={(addForm.eligibility_scope ?? 'ALL_STAFF') === opt.val}
                            onChange={(e) => setAddForm((p: any) => ({ ...p, eligibility_scope: e.target.value as EligibilityScope }))}
                            className="radio radio-primary radio-sm"
                          />
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Carry Forward */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="label p-0 pb-1">
                      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Carry Forward Days</span>
                    </label>
                    <input
                      type="number"
                      id="carry_forward_days"
                      name="carry_forward_days"
                      value={addForm.carry_forward_days ?? 0}
                      onChange={handleAddInputChange}
                      className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Increment Section */}
                <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
                  <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>Increment Details</h4>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
                          Allocate Days
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            id="increment_days"
                            name="increment_days"
                            value={addForm.increment_days ?? 0}
                            onChange={handleAddInputChange}
                            className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                            min="0"
                            placeholder="0"
                          />
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                            day{pluralize(addForm?.increment_days)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-2`}>
                          Maximum Allocate Days
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            id="max_increment_days"
                            name="max_increment_days"
                            value={addForm.max_increment_days ?? 0}
                            onChange={handleAddInputChange}
                            className={`input input-bordered w-20 sm:w-24 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                            min="0"
                            placeholder="0"
                          />
                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                            day{pluralize(addForm?.max_increment_days)} max
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex flex-col sm:flex-row justify-end gap-2 mt-auto z-10`}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`btn btn-sm sm:btn-md btn-ghost w-full sm:w-auto ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'} text-xs sm:text-sm order-2 sm:order-1`}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleAddSubmit}
                className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 text-xs sm:text-sm order-1 sm:order-2`}
              >
                Create Leave Type
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowAddModal(false)}>close</button>
          </form>
        </dialog>

        {/* Delete Confirmation Modal */}
        <dialog id="delete_confirm_modal" className={`modal ${showDeleteConfirmModal ? 'modal-open' : ''}`}>
          <div className={`modal-box w-[95%] sm:w-11/12 max-w-md p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto`}>
            {/* Modal Header */}
            <div className={`${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700'} px-4 sm:px-6 py-4 border-b backdrop-blur-sm flex items-center gap-3`}>
              {/* Icon Container */}
              <div className={`relative p-2 rounded-xl ${theme === 'light' ? 'bg-red-500 shadow-lg shadow-red-500/25' : 'bg-red-400 shadow-lg shadow-red-400/25'}`}>
                <BsTrash className="h-4 w-4 text-white" />
              </div>
              
              {/* Title */}
              <div>
                <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-red-900' : 'text-red-100'}`}>
                  Delete Leave Type
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-red-700' : 'text-red-300'} mt-0.5`}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <p className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Are you sure you want to delete the leave type <strong>"{selectedLeaveType?.leave_type_name}"</strong>?
                </p>
                
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-700'}`}>
                  <p className={`text-xs ${theme === 'light' ? 'text-red-700' : 'text-red-300'}`}>
                    <strong>Warning:</strong> This will permanently delete the leave type and all associated configurations. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-4 sm:px-6 py-3 border-t flex justify-end gap-3`}>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'btn-ghost text-slate-600 hover:bg-slate-200' : 'btn-ghost text-slate-400 hover:bg-slate-600'}`}
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                onClick={confirmDeleteLeaveType}
              >
                Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowDeleteConfirmModal(false)}>close</button>
          </form>
        </dialog>


        
      </div>
    </>
  )
}

export default LeaveType
