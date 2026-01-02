// // // 'use client';

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { API_BASE_URL } from '../config';
// // // import { useTheme } from '../components/ThemeProvider';
// // // import { useNotification } from '../hooks/useNotification';
// // // import { 
// // //   FaPlus, FaEdit, FaTrash, FaCopy, FaEye, FaEyeSlash,
// // //   FaCalendarAlt, FaTag, FaCog, FaInfoCircle, FaCheck, FaTimes
// // // } from 'react-icons/fa';

// // // interface LeaveType {
// // //   id: number;
// // //   leave_type_name: string;
// // //   code: string;
// // //   description: string;
// // //   max_days: number;
// // //   requires_approval: boolean;
// // //   requires_documentation: boolean;
// // //   is_active: boolean;
// // //   company_id?: string;
// // //   allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
// // //   eligibility_scope?: 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF' | 'UPON_JOIN';
// // //   accrual_frequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
// // //   accrual_rate?: number;
// // //   earn_prorate_join_month?: boolean;
// // //   renewal_period?: 'NONE' | 'YEARLY' | 'QUARTERLY' | 'MONTHLY';
// // //   expire_unused_at_period_end?: boolean;
// // //   carryover_max_days?: number;
// // //   is_unlimited?: boolean;
// // //   yos_brackets?: YearOfServiceBracket[];
// // //   created_at?: string;
// // //   updated_at?: string;
// // // }

// // // interface YearOfServiceBracket {
// // //   min_years: number;
// // //   max_years?: number | null;
// // //   days: number;
// // //   renewal_period?: string;
// // //   carryover_max_days?: number;
// // //   expire_unused_at_period_end?: boolean;
// // // }

// // // const LeaveTypesManagement = () => {
// // //   const { theme } = useTheme();
// // //   const { showNotification } = useNotification();
// // //   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [showAddModal, setShowAddModal] = useState(false);
// // //   const [showEditModal, setShowEditModal] = useState(false);
// // //   const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
// // //   const [companies, setCompanies] = useState<any[]>([]);
  
// // //   // Form states
// // //   const [addForm, setAddForm] = useState<Partial<LeaveType>>({
// // //     leave_type_name: '',
// // //     code: '',
// // //     description: '',
// // //     max_days: 0,
// // //     requires_approval: true,
// // //     requires_documentation: false,
// // //     is_active: true,
// // //     company_id: '0',
// // //     allocation_primary: 'YEAR_OF_SERVICE',
// // //     eligibility_scope: 'ALL_STAFF',
// // //     accrual_frequency: 'MONTHLY',
// // //     accrual_rate: 0,
// // //     earn_prorate_join_month: false,
// // //     renewal_period: 'YEARLY',
// // //     expire_unused_at_period_end: false,
// // //     carryover_max_days: 0,
// // //     is_unlimited: false,
// // //     yos_brackets: []
// // //   });
  
// // //   const [editForm, setEditForm] = useState<Partial<LeaveType>>({
// // //     leave_type_name: '',
// // //     code: '',
// // //     description: '',
// // //     max_days: 0,
// // //     requires_approval: true,
// // //     requires_documentation: false,
// // //     is_active: true,
// // //     company_id: '0',
// // //     allocation_primary: 'YEAR_OF_SERVICE',
// // //     eligibility_scope: 'ALL_STAFF',
// // //     accrual_frequency: 'MONTHLY',
// // //     accrual_rate: 0,
// // //     earn_prorate_join_month: false,
// // //     renewal_period: 'YEARLY',
// // //     expire_unused_at_period_end: false,
// // //     carryover_max_days: 0,
// // //     is_unlimited: false,
// // //     yos_brackets: []
// // //   });
  
// // //   // Fetch leave types
// // //   const fetchLeaveTypes = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
// // //       setLeaveTypes(response.data);
// // //     } catch (error) {
// // //       console.error('Error fetching leave types:', error);
// // //       showNotification('Error loading leave types', 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
  
// // //   // Fetch companies
// // //   const fetchCompanies = async () => {
// // //     try {
// // //       const response = await axios.get(`${API_BASE_URL}/api/companies`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
// // //       setCompanies(response.data);
// // //     } catch (error) {
// // //       console.error('Error fetching companies:', error);
// // //     }
// // //   };
  
// // //   useEffect(() => {
// // //     fetchLeaveTypes();
// // //     fetchCompanies();
// // //   }, []);
  
// // //   // Handle add form input changes
// // //   const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// // //     const { name, value, type } = e.target;
    
// // //     if (type === 'checkbox') {
// // //       const checked = (e.target as HTMLInputElement).checked;
// // //       setAddForm(prev => ({ ...prev, [name]: checked }));
// // //     } else if (type === 'number') {
// // //       setAddForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
// // //     } else {
// // //       setAddForm(prev => ({ ...prev, [name]: value }));
// // //     }
// // //   };
  
// // //   // Handle edit form input changes
// // //   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// // //     const { name, value, type } = e.target;
    
// // //     if (type === 'checkbox') {
// // //       const checked = (e.target as HTMLInputElement).checked;
// // //       setEditForm(prev => ({ ...prev, [name]: checked }));
// // //     } else if (type === 'number') {
// // //       setEditForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
// // //     } else {
// // //       setEditForm(prev => ({ ...prev, [name]: value }));
// // //     }
// // //   };
  
// // //   // Add YOS bracket to add form
// // //   const addYosRow = () => {
// // //     setAddForm(prev => ({
// // //       ...prev,
// // //       yos_brackets: [
// // //         ...(prev.yos_brackets || []),
// // //         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
// // //       ]
// // //     }));
// // //   };
  
// // //   // Update YOS bracket in add form
// // //   const updateYosBracket = (index: number, field: string, value: any) => {
// // //     setAddForm(prev => {
// // //       const updated = [...(prev.yos_brackets || [])];
// // //       updated[index] = { ...updated[index], [field]: value };
// // //       return { ...prev, yos_brackets: updated };
// // //     });
// // //   };
  
// // //   // Remove YOS row from add form
// // //   const removeYosRow = (index: number) => {
// // //     setAddForm(prev => ({
// // //       ...prev,
// // //       yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
// // //     }));
// // //   };
  
// // //   // Add YOS bracket to edit form
// // //   const addEditYosRow = () => {
// // //     setEditForm(prev => ({
// // //       ...prev,
// // //       yos_brackets: [
// // //         ...(prev.yos_brackets || []),
// // //         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
// // //       ]
// // //     }));
// // //   };
  
// // //   // Update YOS bracket in edit form
// // //   const updateEditYosBracket = (index: number, field: string, value: any) => {
// // //     setEditForm(prev => {
// // //       const updated = [...(prev.yos_brackets || [])];
// // //       updated[index] = { ...updated[index], [field]: value };
// // //       return { ...prev, yos_brackets: updated };
// // //     });
// // //   };
  
// // //   // Remove YOS row from edit form
// // //   const removeEditYosRow = (index: number) => {
// // //     setEditForm(prev => ({
// // //       ...prev,
// // //       yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
// // //     }));
// // //   };
  
// // //   // Submit add form
// // //   const handleAddSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     try {
// // //       await axios.post(`${API_BASE_URL}/api/v1/leave-types`, addForm, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
      
// // //       setShowAddModal(false);
// // //       setAddForm({
// // //         leave_type_name: '',
// // //         code: '',
// // //         description: '',
// // //         max_days: 0,
// // //         requires_approval: true,
// // //         requires_documentation: false,
// // //         is_active: true,
// // //         company_id: '0',
// // //         allocation_primary: 'YEAR_OF_SERVICE',
// // //         eligibility_scope: 'ALL_STAFF',
// // //         accrual_frequency: 'MONTHLY',
// // //         accrual_rate: 0,
// // //         earn_prorate_join_month: false,
// // //         renewal_period: 'YEARLY',
// // //         expire_unused_at_period_end: false,
// // //         carryover_max_days: 0,
// // //         is_unlimited: false,
// // //         yos_brackets: []
// // //       });
      
// // //       fetchLeaveTypes();
// // //       showNotification('Leave type created successfully', 'success');
// // //     } catch (error: any) {
// // //       console.error('Error creating leave type:', error);
// // //       showNotification(error.response?.data?.error || 'Error creating leave type', 'error');
// // //     }
// // //   };
  
// // //   // Submit edit form
// // //   const handleEditSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!selectedLeaveType) return;
    
// // //     try {
// // //       await axios.put(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, editForm, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
      
// // //       setShowEditModal(false);
// // //       setSelectedLeaveType(null);
// // //       fetchLeaveTypes();
// // //       showNotification('Leave type updated successfully', 'success');
// // //     } catch (error: any) {
// // //       console.error('Error updating leave type:', error);
// // //       showNotification(error.response?.data?.error || 'Error updating leave type', 'error');
// // //     }
// // //   };
  
// // //   // Delete leave type
// // //   const handleDelete = async (id: number) => {
// // //     if (!confirm('Are you sure you want to delete this leave type? This action cannot be undone.')) {
// // //       return;
// // //     }
    
// // //     try {
// // //       await axios.delete(`${API_BASE_URL}/api/v1/leave-types/${id}`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
      
// // //       fetchLeaveTypes();
// // //       showNotification('Leave type deleted successfully', 'success');
// // //     } catch (error: any) {
// // //       console.error('Error deleting leave type:', error);
// // //       showNotification(error.response?.data?.error || 'Error deleting leave type', 'error');
// // //     }
// // //   };
  
// // //   // Toggle active status
// // //   const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
// // //     try {
// // //       await axios.put(`${API_BASE_URL}/api/v1/leave-types/${id}/toggle-active`, {
// // //         is_active: !currentStatus
// // //       }, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
      
// // //       fetchLeaveTypes();
// // //       showNotification(`Leave type ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
// // //     } catch (error: any) {
// // //       console.error('Error toggling leave type status:', error);
// // //       showNotification(error.response?.data?.error || 'Error toggling status', 'error');
// // //     }
// // //   };
  
// // //   // Edit leave type
// // //   const handleEdit = (leaveType: LeaveType) => {
// // //     setSelectedLeaveType(leaveType);
// // //     setEditForm({
// // //       ...leaveType,
// // //       yos_brackets: leaveType.yos_brackets || [],
// // //       company_id: leaveType.company_id || '0'
// // //     });
// // //     setShowEditModal(true);
// // //   };
  
// // //   // Duplicate leave type
// // //   const handleDuplicate = async (leaveType: LeaveType) => {
// // //     try {
// // //       // Destructure to remove id and timestamps
// // //       const { id, created_at, updated_at, ...dataToDuplicate } = leaveType;
      
// // //       const duplicateData = {
// // //         ...dataToDuplicate,
// // //         leave_type_name: `${leaveType.leave_type_name} (Copy)`,
// // //         code: `${leaveType.code}_COPY`,
// // //         yos_brackets: leaveType.yos_brackets || []
// // //       };
      
// // //       await axios.post(`${API_BASE_URL}/api/v1/leave-types`, duplicateData, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
      
// // //       fetchLeaveTypes();
// // //       showNotification('Leave type duplicated successfully', 'success');
// // //     } catch (error: any) {
// // //       console.error('Error duplicating leave type:', error);
// // //       showNotification(error.response?.data?.error || 'Error duplicating leave type', 'error');
// // //     }
// // //   };
  
// // //   if (loading) {
// // //     return (
// // //       <div className="flex justify-center items-center h-64">
// // //         <span className="loading loading-spinner loading-lg"></span>
// // //       </div>
// // //     );
// // //   }
  
// // //   // Render form fields function (to avoid duplication)
// // //   const renderFormFields = (form: Partial<LeaveType>, isEdit: boolean, onChange: any, 
// // //                            updateYosBracketFn: any, removeYosRowFn: any, addYosRowFn: any) => {
// // //     return (
// // //       <>
// // //         {/* Basic Information */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //           <div>
// // //             <label className="label">
// // //               <span className="label-text">Leave Type Name</span>
// // //               <span className="label-text-alt text-red-500">*</span>
// // //             </label>
// // //             <input
// // //               type="text"
// // //               name="leave_type_name"
// // //               value={form.leave_type_name || ''}
// // //               onChange={onChange}
// // //               className="input input-bordered w-full"
// // //               placeholder="e.g., Annual Leave"
// // //               required
// // //             />
// // //           </div>
          
// // //           <div>
// // //             <label className="label">
// // //               <span className="label-text">Code</span>
// // //               <span className="label-text-alt text-red-500">*</span>
// // //             </label>
// // //             <input
// // //               type="text"
// // //               name="code"
// // //               value={form.code || ''}
// // //               onChange={onChange}
// // //               className="input input-bordered w-full"
// // //               placeholder="e.g., AL"
// // //               required
// // //             />
// // //           </div>
          
// // //           <div>
// // //             <label className="label">
// // //               <span className="label-text">Company</span>
// // //             </label>
// // //             <select
// // //               name="company_id"
// // //               value={form.company_id || '0'}
// // //               onChange={onChange}
// // //               className="select select-bordered w-full"
// // //             >
// // //               <option value="0">Global (All Companies)</option>
// // //               {companies.map(company => (
// // //                 <option key={company.id} value={company.id}>
// // //                   {company.name}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>
          
// // //           <div>
// // //             <label className="label">
// // //               <span className="label-text">Max Days</span>
// // //             </label>
// // //             <input
// // //               type="number"
// // //               name="max_days"
// // //               value={form.max_days || 0}
// // //               onChange={onChange}
// // //               className="input input-bordered w-full"
// // //               min="0"
// // //               disabled={form.is_unlimited}
// // //             />
// // //           </div>
// // //         </div>
        
// // //         {/* Description */}
// // //         <div>
// // //           <label className="label">
// // //             <span className="label-text">Description</span>
// // //           </label>
// // //           <textarea
// // //             name="description"
// // //             value={form.description || ''}
// // //             onChange={onChange}
// // //             className="textarea textarea-bordered w-full"
// // //             rows={3}
// // //             placeholder="Describe this leave type..."
// // //           />
// // //         </div>
        
// // //         {/* Requirements */}
// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //           <label className="flex items-center gap-2 cursor-pointer">
// // //             <input
// // //               type="checkbox"
// // //               name="requires_approval"
// // //               checked={!!form.requires_approval}
// // //               onChange={onChange}
// // //               className="checkbox checkbox-primary"
// // //             />
// // //             <span className="label-text">Requires Approval</span>
// // //           </label>
          
// // //           <label className="flex items-center gap-2 cursor-pointer">
// // //             <input
// // //               type="checkbox"
// // //               name="requires_documentation"
// // //               checked={!!form.requires_documentation}
// // //               onChange={onChange}
// // //               className="checkbox checkbox-primary"
// // //             />
// // //             <span className="label-text">Requires Documentation</span>
// // //           </label>
          
// // //           <label className="flex items-center gap-2 cursor-pointer">
// // //             <input
// // //               type="checkbox"
// // //               name="is_unlimited"
// // //               checked={!!form.is_unlimited}
// // //               onChange={(e) => {
// // //                 const checked = e.target.checked;
// // //                 if (isEdit) {
// // //                   setEditForm(prev => ({
// // //                     ...prev,
// // //                     is_unlimited: checked,
// // //                     max_days: checked ? 0 : prev.max_days,
// // //                     allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
// // //                   }));
// // //                 } else {
// // //                   setAddForm(prev => ({
// // //                     ...prev,
// // //                     is_unlimited: checked,
// // //                     max_days: checked ? 0 : prev.max_days,
// // //                     allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
// // //                   }));
// // //                 }
// // //               }}
// // //               className="checkbox checkbox-primary"
// // //             />
// // //             <span className="label-text">Unlimited Leave</span>
// // //           </label>
// // //         </div>
        
// // //         {/* Allocation & Eligibility - Only show if not unlimited */}
// // //         {!form.is_unlimited && (
// // //           <>
// // //             <div className="divider">Allocation & Eligibility</div>
            
// // //             {/* Allocation Method */}
// // //             <div>
// // //               <label className="label">
// // //                 <span className="label-text">Allocation Method</span>
// // //               </label>
// // //               <div className="flex gap-4">
// // //                 <label className="flex items-center gap-2 cursor-pointer">
// // //                   <input
// // //                     type="radio"
// // //                     name="allocation_primary"
// // //                     value="YEAR_OF_SERVICE"
// // //                     checked={form.allocation_primary === 'YEAR_OF_SERVICE'}
// // //                     onChange={onChange}
// // //                     className="radio radio-primary"
// // //                   />
// // //                   <span className="label-text">Year of Service</span>
// // //                 </label>
                
// // //                 <label className="flex items-center gap-2 cursor-pointer">
// // //                   <input
// // //                     type="radio"
// // //                     name="allocation_primary"
// // //                     value="EARN"
// // //                     checked={form.allocation_primary === 'EARN'}
// // //                     onChange={onChange}
// // //                     className="radio radio-primary"
// // //                   />
// // //                   <span className="label-text">Accrual (Earn)</span>
// // //                 </label>
// // //               </div>
// // //             </div>
            
// // //             {/* Year of Service Configuration */}
// // //             {form.allocation_primary === 'YEAR_OF_SERVICE' && (
// // //               <div className="border rounded-lg p-4">
// // //                 <div className="flex justify-between items-center mb-4">
// // //                   <label className="label">
// // //                     <span className="label-text font-semibold">Year of Service Brackets</span>
// // //                     <span className="label-text-alt">Define entitlement based on years of service</span>
// // //                   </label>
// // //                   <button
// // //                     type="button"
// // //                     onClick={addYosRowFn}
// // //                     className="btn btn-xs btn-primary"
// // //                   >
// // //                     Add Bracket
// // //                   </button>
// // //                 </div>
                
// // //                 <div className="space-y-4">
// // //                   {(form.yos_brackets || []).map((bracket, index) => (
// // //                     <div key={index} className="border rounded p-4">
// // //                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
// // //                         <div>
// // //                           <label className="label">
// // //                             <span className="label-text">Min Years</span>
// // //                           </label>
// // //                           <input
// // //                             type="number"
// // //                             min="0"
// // //                             value={bracket.min_years}
// // //                             onChange={(e) => updateYosBracketFn(index, 'min_years', parseInt(e.target.value) || 0)}
// // //                             className="input input-bordered w-full"
// // //                             required
// // //                           />
// // //                         </div>
                        
// // //                         <div>
// // //                           <label className="label">
// // //                             <span className="label-text">Max Years (blank for ∞)</span>
// // //                           </label>
// // //                           <input
// // //                             type="number"
// // //                             min="0"
// // //                             value={bracket.max_years || ''}
// // //                             onChange={(e) => updateYosBracketFn(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
// // //                             className="input input-bordered w-full"
// // //                             placeholder="∞"
// // //                           />
// // //                         </div>
                        
// // //                         <div>
// // //                           <label className="label">
// // //                             <span className="label-text">Days Allocation</span>
// // //                           </label>
// // //                           <input
// // //                             type="number"
// // //                             min="0"
// // //                             step="0.5"
// // //                             value={bracket.days}
// // //                             onChange={(e) => updateYosBracketFn(index, 'days', parseFloat(e.target.value) || 0)}
// // //                             className="input input-bordered w-full"
// // //                             required
// // //                           />
// // //                         </div>
// // //                       </div>
                      
// // //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                         <div>
// // //                           <label className="label">
// // //                             <span className="label-text">Renewal Period</span>
// // //                           </label>
// // //                           <select
// // //                             value={bracket.renewal_period || 'YEARLY'}
// // //                             onChange={(e) => updateYosBracketFn(index, 'renewal_period', e.target.value)}
// // //                             className="select select-bordered w-full"
// // //                           >
// // //                             <option value="YEARLY">Yearly</option>
// // //                             <option value="QUARTERLY">Quarterly</option>
// // //                             <option value="MONTHLY">Monthly</option>
// // //                             <option value="NONE">No automatic renewal</option>
// // //                           </select>
// // //                         </div>
                        
// // //                         <div>
// // //                           <label className="label">
// // //                             <span className="label-text">Max Carryover Days</span>
// // //                           </label>
// // //                           <input
// // //                             type="number"
// // //                             min="0"
// // //                             value={bracket.carryover_max_days || 0}
// // //                             onChange={(e) => updateYosBracketFn(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
// // //                             className="input input-bordered w-full"
// // //                             disabled={bracket.expire_unused_at_period_end}
// // //                           />
// // //                         </div>
// // //                       </div>
                      
// // //                       <div className="mt-4 flex items-center justify-between">
// // //                         <label className="flex items-center gap-2">
// // //                           <input
// // //                             type="checkbox"
// // //                             checked={!!bracket.expire_unused_at_period_end}
// // //                             onChange={(e) => {
// // //                               updateYosBracketFn(index, 'expire_unused_at_period_end', e.target.checked);
// // //                               if (e.target.checked) {
// // //                                 updateYosBracketFn(index, 'carryover_max_days', 0);
// // //                               }
// // //                             }}
// // //                             className="checkbox checkbox-primary"
// // //                           />
// // //                           <span className="label-text">Use-it-or-lose-it (no carryover)</span>
// // //                         </label>
                        
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => removeYosRowFn(index)}
// // //                           className="btn btn-xs btn-error"
// // //                         >
// // //                           Remove
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}
            
// // //             {/* Accrual Configuration */}
// // //             {form.allocation_primary === 'EARN' && (
// // //               <div className="border rounded-lg p-4">
// // //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                   <div>
// // //                     <label className="label">
// // //                       <span className="label-text">Accrual Frequency</span>
// // //                     </label>
// // //                     <select
// // //                       name="accrual_frequency"
// // //                       value={form.accrual_frequency || 'MONTHLY'}
// // //                       onChange={onChange}
// // //                       className="select select-bordered w-full"
// // //                     >
// // //                       <option value="MONTHLY">Monthly</option>
// // //                       <option value="QUARTERLY">Quarterly</option>
// // //                       <option value="YEARLY">Yearly</option>
// // //                     </select>
// // //                   </div>
                  
// // //                   <div>
// // //                     <label className="label">
// // //                       <span className="label-text">
// // //                         {form.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
// // //                          form.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
// // //                       </span>
// // //                     </label>
// // //                     <input
// // //                       type="number"
// // //                       step="0.1"
// // //                       min="0"
// // //                       name="accrual_rate"
// // //                       value={form.accrual_rate || 0}
// // //                       onChange={onChange}
// // //                       className="input input-bordered w-full"
// // //                     />
// // //                   </div>
                  
// // //                   <div className="flex items-end">
// // //                     <label className="flex items-center gap-2 cursor-pointer">
// // //                       <input
// // //                         type="checkbox"
// // //                         name="earn_prorate_join_month"
// // //                         checked={!!form.earn_prorate_join_month}
// // //                         onChange={onChange}
// // //                         className="checkbox checkbox-primary"
// // //                       />
// // //                       <span className="label-text">Prorate for new joiners</span>
// // //                     </label>
// // //                   </div>
// // //                 </div>
                
// // //                 {/* Renewal & Carryover Settings */}
// // //                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <div>
// // //                     <label className="label">
// // //                       <span className="label-text">Renewal Period</span>
// // //                     </label>
// // //                     <select
// // //                       name="renewal_period"
// // //                       value={form.renewal_period || 'YEARLY'}
// // //                       onChange={onChange}
// // //                       className="select select-bordered w-full"
// // //                     >
// // //                       <option value="YEARLY">Yearly</option>
// // //                       <option value="QUARTERLY">Quarterly</option>
// // //                       <option value="MONTHLY">Monthly</option>
// // //                       <option value="NONE">No automatic renewal</option>
// // //                     </select>
// // //                   </div>
                  
// // //                   <div>
// // //                     <label className="label">
// // //                       <span className="label-text">Max Carryover Days</span>
// // //                     </label>
// // //                     <input
// // //                       type="number"
// // //                       min="0"
// // //                       name="carryover_max_days"
// // //                       value={form.carryover_max_days || 0}
// // //                       onChange={onChange}
// // //                       className="input input-bordered w-full"
// // //                       disabled={form.expire_unused_at_period_end}
// // //                     />
// // //                   </div>
// // //                 </div>
                
// // //                 <div className="mt-4">
// // //                   <label className="flex items-center gap-2 cursor-pointer">
// // //                     <input
// // //                       type="checkbox"
// // //                       name="expire_unused_at_period_end"
// // //                       checked={!!form.expire_unused_at_period_end}
// // //                       onChange={(e) => {
// // //                         const checked = e.target.checked;
// // //                         if (isEdit) {
// // //                           setEditForm(prev => ({
// // //                             ...prev,
// // //                             expire_unused_at_period_end: checked,
// // //                             carryover_max_days: checked ? 0 : prev.carryover_max_days
// // //                           }));
// // //                         } else {
// // //                           setAddForm(prev => ({
// // //                             ...prev,
// // //                             expire_unused_at_period_end: checked,
// // //                             carryover_max_days: checked ? 0 : prev.carryover_max_days
// // //                           }));
// // //                         }
// // //                       }}
// // //                       className="checkbox checkbox-primary"
// // //                     />
// // //                     <span className="label-text">Use-it-or-lose-it (no carryover allowed)</span>
// // //                   </label>
// // //                 </div>
// // //               </div>
// // //             )}
            
// // //             {/* Eligibility Scope */}
// // //             <div>
// // //               <label className="label">
// // //                 <span className="label-text">Eligibility Scope</span>
// // //               </label>
// // //               <select
// // //                 name="eligibility_scope"
// // //                 value={form.eligibility_scope || 'ALL_STAFF'}
// // //                 onChange={onChange}
// // //                 className="select select-bordered w-full"
// // //               >
// // //                 <option value="ALL_STAFF">All Staff</option>
// // //                 <option value="UPON_CONFIRM">Upon Confirmation</option>
// // //                 <option value="UNDER_PROBATION">Under Probation</option>
// // //                 <option value="UPON_JOIN">Upon Joining</option>
// // //               </select>
// // //             </div>
// // //           </>
// // //         )}
        
// // //         {/* Active Status */}
// // //         <div className="flex items-center gap-2">
// // //           <input
// // //             type="checkbox"
// // //             name="is_active"
// // //             checked={!!form.is_active}
// // //             onChange={onChange}
// // //             className="checkbox checkbox-primary"
// // //           />
// // //           <span className="label-text">Active (available for use)</span>
// // //         </div>
// // //       </>
// // //     );
// // //   };
  
// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Header */}
// // //       <div className="flex justify-between items-center">
// // //         <div>
// // //           <h3 className="text-2xl font-bold">Leave Types Management</h3>
// // //           <p className="text-sm text-slate-500 mt-1">
// // //             Configure different types of leave with custom allocation rules
// // //           </p>
// // //         </div>
// // //         <button
// // //           onClick={() => setShowAddModal(true)}
// // //           className="btn btn-primary"
// // //         >
// // //           <FaPlus className="mr-2" />
// // //           Add Leave Type
// // //         </button>
// // //       </div>
      
// // //       {/* Leave Types Table */}
// // //       <div className="overflow-x-auto border rounded-lg">
// // //         <table className="table w-full">
// // //           <thead>
// // //             <tr>
// // //               <th>Leave Type</th>
// // //               <th>Code</th>
// // //               <th>Description</th>
// // //               <th>Allocation</th>
// // //               <th>Days</th>
// // //               <th>Status</th>
// // //               <th>Actions</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {leaveTypes.map(leaveType => (
// // //               <tr key={leaveType.id} className="hover">
// // //                 <td>
// // //                   <div className="font-medium">{leaveType.leave_type_name}</div>
// // //                   {leaveType.company_id && leaveType.company_id !== '0' && (
// // //                     <div className="text-xs text-slate-500">
// // //                       Company ID: {leaveType.company_id}
// // //                     </div>
// // //                   )}
// // //                 </td>
// // //                 <td>
// // //                   <span className="badge badge-outline font-mono">
// // //                     {leaveType.code}
// // //                   </span>
// // //                 </td>
// // //                 <td>
// // //                   <div className="max-w-xs truncate" title={leaveType.description}>
// // //                     {leaveType.description || '-'}
// // //                   </div>
// // //                 </td>
// // //                 <td>
// // //                   <div className="flex flex-col gap-1">
// // //                     <span className="badge badge-sm">
// // //                       {leaveType.allocation_primary || 'Standard'}
// // //                     </span>
// // //                     {leaveType.yos_brackets && leaveType.yos_brackets.length > 0 && (
// // //                       <span className="badge badge-sm badge-info">
// // //                         {leaveType.yos_brackets.length} YOS bracket(s)
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 </td>
// // //                 <td>
// // //                   {leaveType.is_unlimited ? (
// // //                     <span className="badge badge-warning">Unlimited</span>
// // //                   ) : (
// // //                     <span className="font-medium">{leaveType.max_days} days</span>
// // //                   )}
// // //                 </td>
// // //                 <td>
// // //                   <div className="flex items-center gap-2">
// // //                     <span className={`badge ${leaveType.is_active ? 'badge-success' : 'badge-error'}`}>
// // //                       {leaveType.is_active ? 'Active' : 'Inactive'}
// // //                     </span>
// // //                     <button
// // //                       onClick={() => toggleActiveStatus(leaveType.id, leaveType.is_active)}
// // //                       className="btn btn-xs btn-ghost"
// // //                       title={leaveType.is_active ? 'Deactivate' : 'Activate'}
// // //                     >
// // //                       {leaveType.is_active ? <FaEyeSlash /> : <FaEye />}
// // //                     </button>
// // //                   </div>
// // //                 </td>
// // //                 <td>
// // //                   <div className="flex gap-2">
// // //                     <button
// // //                       onClick={() => handleEdit(leaveType)}
// // //                       className="btn btn-xs btn-primary"
// // //                       title="Edit"
// // //                     >
// // //                       <FaEdit />
// // //                     </button>
// // //                     <button
// // //                       onClick={() => handleDuplicate(leaveType)}
// // //                       className="btn btn-xs btn-secondary"
// // //                       title="Duplicate"
// // //                     >
// // //                       <FaCopy />
// // //                     </button>
// // //                     <button
// // //                       onClick={() => handleDelete(leaveType.id)}
// // //                       className="btn btn-xs btn-error"
// // //                       title="Delete"
// // //                     >
// // //                       <FaTrash />
// // //                     </button>
// // //                   </div>
// // //                 </td>
// // //               </tr>
// // //             ))}
            
// // //             {leaveTypes.length === 0 && (
// // //               <tr>
// // //                 <td colSpan={7} className="text-center py-8">
// // //                   <div className="flex flex-col items-center justify-center gap-3">
// // //                     <FaCalendarAlt className="h-16 w-16 text-slate-400" />
// // //                     <div className="space-y-2">
// // //                       <h3 className="text-lg font-medium text-slate-600">
// // //                         No leave types configured
// // //                       </h3>
// // //                       <p className="text-sm text-slate-500">
// // //                         Create your first leave type to get started
// // //                       </p>
// // //                     </div>
// // //                     <button
// // //                       onClick={() => setShowAddModal(true)}
// // //                       className="btn btn-primary mt-4"
// // //                     >
// // //                       <FaPlus className="mr-2" />
// // //                       Create First Leave Type
// // //                     </button>
// // //                   </div>
// // //                 </td>
// // //               </tr>
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>
      
// // //       {/* Add Leave Type Modal */}
// // //       {showAddModal && (
// // //         <div className="modal modal-open">
// // //           <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
// // //             <h3 className="font-bold text-lg mb-4">Add New Leave Type</h3>
            
// // //             <form onSubmit={handleAddSubmit}>
// // //               {renderFormFields(addForm, false, handleAddInputChange, updateYosBracket, removeYosRow, addYosRow)}
              
// // //               <div className="modal-action mt-6">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowAddModal(false)}
// // //                   className="btn btn-ghost"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button type="submit" className="btn btn-primary">
// // //                   Create Leave Type
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //           <div className="modal-backdrop" onClick={() => setShowAddModal(false)}></div>
// // //         </div>
// // //       )}
      
// // //       {/* Edit Leave Type Modal */}
// // //       {showEditModal && selectedLeaveType && (
// // //         <div className="modal modal-open">
// // //           <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
// // //             <h3 className="font-bold text-lg mb-4">Edit Leave Type</h3>
            
// // //             <form onSubmit={handleEditSubmit}>
// // //               {renderFormFields(editForm, true, handleEditInputChange, updateEditYosBracket, removeEditYosRow, addEditYosRow)}
              
// // //               <div className="modal-action mt-6">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowEditModal(false)}
// // //                   className="btn btn-ghost"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button type="submit" className="btn btn-primary">
// // //                   Update Leave Type
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //           <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default LeaveTypesManagement;


// // 'use client';

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../config';
// // import { useTheme } from '../components/ThemeProvider';
// // import { useNotification } from '../hooks/useNotification';
// // import { 
// //   FaPlus, FaEdit, FaTrash, FaCopy, FaEye, FaEyeSlash,
// //   FaCalendarAlt, FaTag, FaCog, FaInfoCircle, FaCheck, FaTimes,
// //   FaSearch, FaFilter, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight
// // } from 'react-icons/fa';

// // interface LeaveType {
// //   id: number;
// //   leave_type_name: string;
// //   code: string;
// //   description: string;
// //   max_days: number;
// //   requires_approval: boolean;
// //   requires_documentation: boolean;
// //   is_active: boolean;
// //   company_id?: string;
// //   allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
// //   eligibility_scope?: 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF' | 'UPON_JOIN';
// //   accrual_frequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
// //   accrual_rate?: number;
// //   earn_prorate_join_month?: boolean;
// //   renewal_period?: 'NONE' | 'YEARLY' | 'QUARTERLY' | 'MONTHLY';
// //   expire_unused_at_period_end?: boolean;
// //   carryover_max_days?: number;
// //   is_unlimited?: boolean;
// //   yos_brackets?: YearOfServiceBracket[];
// //   created_at?: string;
// //   updated_at?: string;
// // }

// // interface YearOfServiceBracket {
// //   min_years: number;
// //   max_years?: number | null;
// //   days: number;
// //   renewal_period?: string;
// //   carryover_max_days?: number;
// //   expire_unused_at_period_end?: boolean;
// // }

// // const LeaveTypesManagement = () => {
// //   const { theme } = useTheme();
// //   const { showNotification } = useNotification();
// //   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
// //   const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<LeaveType[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [showEditModal, setShowEditModal] = useState(false);
// //   const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
// //   const [companies, setCompanies] = useState<any[]>([]);
  
// //   // Search and filter states
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'active', 'inactive'
// //   const [allocationFilter, setAllocationFilter] = useState<string>('all'); // 'all', 'yos', 'earn', 'immediate'
  
// //   // Pagination states
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(10);
  
// //   // Form states
// //   const [addForm, setAddForm] = useState<Partial<LeaveType>>({
// //     leave_type_name: '',
// //     code: '',
// //     description: '',
// //     max_days: 0,
// //     requires_approval: true,
// //     requires_documentation: false,
// //     is_active: true,
// //     company_id: '0',
// //     allocation_primary: 'YEAR_OF_SERVICE',
// //     eligibility_scope: 'ALL_STAFF',
// //     accrual_frequency: 'MONTHLY',
// //     accrual_rate: 0,
// //     earn_prorate_join_month: false,
// //     renewal_period: 'YEARLY',
// //     expire_unused_at_period_end: false,
// //     carryover_max_days: 0,
// //     is_unlimited: false,
// //     yos_brackets: []
// //   });
  
// //   const [editForm, setEditForm] = useState<Partial<LeaveType>>({
// //     leave_type_name: '',
// //     code: '',
// //     description: '',
// //     max_days: 0,
// //     requires_approval: true,
// //     requires_documentation: false,
// //     is_active: true,
// //     company_id: '0',
// //     allocation_primary: 'YEAR_OF_SERVICE',
// //     eligibility_scope: 'ALL_STAFF',
// //     accrual_frequency: 'MONTHLY',
// //     accrual_rate: 0,
// //     earn_prorate_join_month: false,
// //     renewal_period: 'YEARLY',
// //     expire_unused_at_period_end: false,
// //     carryover_max_days: 0,
// //     is_unlimited: false,
// //     yos_brackets: []
// //   });
  
// //   // Fetch leave types
// //   const fetchLeaveTypes = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       setLeaveTypes(response.data);
// //       setFilteredLeaveTypes(response.data);
// //     } catch (error) {
// //       console.error('Error fetching leave types:', error);
// //       showNotification('Error loading leave types', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   // Fetch companies
// //   const fetchCompanies = async () => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/api/companies`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       setCompanies(response.data);
// //     } catch (error) {
// //       console.error('Error fetching companies:', error);
// //     }
// //   };
  
// //   useEffect(() => {
// //     fetchLeaveTypes();
// //     fetchCompanies();
// //   }, []);
  
// //   // Apply filters
// //   useEffect(() => {
// //     let filtered = leaveTypes;
    
// //     // Apply search filter
// //     if (searchTerm.trim()) {
// //       const term = searchTerm.toLowerCase();
// //       filtered = filtered.filter(lt =>
// //         lt.leave_type_name.toLowerCase().includes(term) ||
// //         lt.code.toLowerCase().includes(term) ||
// //         lt.description?.toLowerCase().includes(term)
// //       );
// //     }
    
// //     // Apply status filter
// //     if (statusFilter !== 'all') {
// //       filtered = filtered.filter(lt => 
// //         statusFilter === 'active' ? lt.is_active : !lt.is_active
// //       );
// //     }
    
// //     // Apply allocation filter
// //     if (allocationFilter !== 'all') {
// //       filtered = filtered.filter(lt => 
// //         lt.allocation_primary === allocationFilter.toUpperCase()
// //       );
// //     }
    
// //     setFilteredLeaveTypes(filtered);
// //     setCurrentPage(1); // Reset to first page when filters change
// //   }, [searchTerm, statusFilter, allocationFilter, leaveTypes]);
  
// //   // Pagination calculations
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredLeaveTypes.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredLeaveTypes.length / itemsPerPage);
  
// //   // Pagination functions
// //   const goToPage = (page: number) => {
// //     if (page >= 1 && page <= totalPages) {
// //       setCurrentPage(page);
// //     }
// //   };
  
// //   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newLimit = parseInt(e.target.value);
// //     setItemsPerPage(newLimit);
// //     setCurrentPage(1);
// //   };
  
// //   // Handle add form input changes
// //   const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value, type } = e.target;
    
// //     if (type === 'checkbox') {
// //       const checked = (e.target as HTMLInputElement).checked;
// //       setAddForm(prev => ({ ...prev, [name]: checked }));
// //     } else if (type === 'number') {
// //       setAddForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
// //     } else {
// //       setAddForm(prev => ({ ...prev, [name]: value }));
// //     }
// //   };
  
// //   // Handle edit form input changes
// //   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value, type } = e.target;
    
// //     if (type === 'checkbox') {
// //       const checked = (e.target as HTMLInputElement).checked;
// //       setEditForm(prev => ({ ...prev, [name]: checked }));
// //     } else if (type === 'number') {
// //       setEditForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
// //     } else {
// //       setEditForm(prev => ({ ...prev, [name]: value }));
// //     }
// //   };
  
// //   // Add YOS bracket to add form
// //   const addYosRow = () => {
// //     setAddForm(prev => ({
// //       ...prev,
// //       yos_brackets: [
// //         ...(prev.yos_brackets || []),
// //         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
// //       ]
// //     }));
// //   };
  
// //   // Update YOS bracket in add form
// //   const updateYosBracket = (index: number, field: string, value: any) => {
// //     setAddForm(prev => {
// //       const updated = [...(prev.yos_brackets || [])];
// //       updated[index] = { ...updated[index], [field]: value };
// //       return { ...prev, yos_brackets: updated };
// //     });
// //   };
  
// //   // Remove YOS row from add form
// //   const removeYosRow = (index: number) => {
// //     setAddForm(prev => ({
// //       ...prev,
// //       yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
// //     }));
// //   };
  
// //   // Add YOS bracket to edit form
// //   const addEditYosRow = () => {
// //     setEditForm(prev => ({
// //       ...prev,
// //       yos_brackets: [
// //         ...(prev.yos_brackets || []),
// //         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
// //       ]
// //     }));
// //   };
  
// //   // Update YOS bracket in edit form
// //   const updateEditYosBracket = (index: number, field: string, value: any) => {
// //     setEditForm(prev => {
// //       const updated = [...(prev.yos_brackets || [])];
// //       updated[index] = { ...updated[index], [field]: value };
// //       return { ...prev, yos_brackets: updated };
// //     });
// //   };
  
// //   // Remove YOS row from edit form
// //   const removeEditYosRow = (index: number) => {
// //     setEditForm(prev => ({
// //       ...prev,
// //       yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
// //     }));
// //   };
  
// //   // Submit add form
// //   const handleAddSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(`${API_BASE_URL}/api/v1/leave-types`, addForm, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       setShowAddModal(false);
// //       setAddForm({
// //         leave_type_name: '',
// //         code: '',
// //         description: '',
// //         max_days: 0,
// //         requires_approval: true,
// //         requires_documentation: false,
// //         is_active: true,
// //         company_id: '0',
// //         allocation_primary: 'YEAR_OF_SERVICE',
// //         eligibility_scope: 'ALL_STAFF',
// //         accrual_frequency: 'MONTHLY',
// //         accrual_rate: 0,
// //         earn_prorate_join_month: false,
// //         renewal_period: 'YEARLY',
// //         expire_unused_at_period_end: false,
// //         carryover_max_days: 0,
// //         is_unlimited: false,
// //         yos_brackets: []
// //       });
      
// //       fetchLeaveTypes();
// //       showNotification('Leave type created successfully', 'success');
// //     } catch (error: any) {
// //       console.error('Error creating leave type:', error);
// //       showNotification(error.response?.data?.error || 'Error creating leave type', 'error');
// //     }
// //   };
  
// //   // Submit edit form
// //   const handleEditSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!selectedLeaveType) return;
    
// //     try {
// //       await axios.put(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, editForm, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       setShowEditModal(false);
// //       setSelectedLeaveType(null);
// //       fetchLeaveTypes();
// //       showNotification('Leave type updated successfully', 'success');
// //     } catch (error: any) {
// //       console.error('Error updating leave type:', error);
// //       showNotification(error.response?.data?.error || 'Error updating leave type', 'error');
// //     }
// //   };
  
// //   // Delete leave type
// //   const handleDelete = async (id: number) => {
// //     if (!confirm('Are you sure you want to delete this leave type? This action cannot be undone.')) {
// //       return;
// //     }
    
// //     try {
// //       await axios.delete(`${API_BASE_URL}/api/v1/leave-types/${id}`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       fetchLeaveTypes();
// //       showNotification('Leave type deleted successfully', 'success');
// //     } catch (error: any) {
// //       console.error('Error deleting leave type:', error);
// //       showNotification(error.response?.data?.error || 'Error deleting leave type', 'error');
// //     }
// //   };
  
// //   // Toggle active status
// //   const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
// //     try {
// //       await axios.put(`${API_BASE_URL}/api/v1/leave-types/${id}/toggle-active`, {
// //         is_active: !currentStatus
// //       }, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       fetchLeaveTypes();
// //       showNotification(`Leave type ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
// //     } catch (error: any) {
// //       console.error('Error toggling leave type status:', error);
// //       showNotification(error.response?.data?.error || 'Error toggling status', 'error');
// //     }
// //   };
  
// //   // Edit leave type
// //   const handleEdit = (leaveType: LeaveType) => {
// //     setSelectedLeaveType(leaveType);
// //     setEditForm({
// //       ...leaveType,
// //       yos_brackets: leaveType.yos_brackets || [],
// //       company_id: leaveType.company_id || '0'
// //     });
// //     setShowEditModal(true);
// //   };
  
// //   // Duplicate leave type
// //   const handleDuplicate = async (leaveType: LeaveType) => {
// //     try {
// //       // Destructure to remove id and timestamps
// //       const { id, created_at, updated_at, ...dataToDuplicate } = leaveType;
      
// //       const duplicateData = {
// //         ...dataToDuplicate,
// //         leave_type_name: `${leaveType.leave_type_name} (Copy)`,
// //         code: `${leaveType.code}_COPY`,
// //         yos_brackets: leaveType.yos_brackets || []
// //       };
      
// //       await axios.post(`${API_BASE_URL}/api/v1/leave-types`, duplicateData, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       fetchLeaveTypes();
// //       showNotification('Leave type duplicated successfully', 'success');
// //     } catch (error: any) {
// //       console.error('Error duplicating leave type:', error);
// //       showNotification(error.response?.data?.error || 'Error duplicating leave type', 'error');
// //     }
// //   };
  
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <span className="loading loading-spinner loading-lg"></span>
// //       </div>
// //     );
// //   }
  
// //   // Render form fields function (to avoid duplication)
// //   const renderFormFields = (form: Partial<LeaveType>, isEdit: boolean, onChange: any, 
// //                            updateYosBracketFn: any, removeYosRowFn: any, addYosRowFn: any) => {
// //     return (
// //       <>
// //         {/* Basic Information */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div>
// //             <label className="label">
// //               <span className="label-text">Leave Type Name</span>
// //               <span className="label-text-alt text-red-500">*</span>
// //             </label>
// //             <input
// //               type="text"
// //               name="leave_type_name"
// //               value={form.leave_type_name || ''}
// //               onChange={onChange}
// //               className="input input-bordered w-full"
// //               placeholder="e.g., Annual Leave"
// //               required
// //             />
// //           </div>
          
// //           <div>
// //             <label className="label">
// //               <span className="label-text">Code</span>
// //               <span className="label-text-alt text-red-500">*</span>
// //             </label>
// //             <input
// //               type="text"
// //               name="code"
// //               value={form.code || ''}
// //               onChange={onChange}
// //               className="input input-bordered w-full"
// //               placeholder="e.g., AL"
// //               required
// //             />
// //           </div>
          
// //           <div>
// //             <label className="label">
// //               <span className="label-text">Company</span>
// //             </label>
// //             <select
// //               name="company_id"
// //               value={form.company_id || '0'}
// //               onChange={onChange}
// //               className="select select-bordered w-full"
// //             >
// //               <option value="0">Global (All Companies)</option>
// //               {companies.map(company => (
// //                 <option key={company.id} value={company.id}>
// //                   {company.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
          
// //           <div>
// //             <label className="label">
// //               <span className="label-text">Max Days</span>
// //             </label>
// //             <input
// //               type="number"
// //               name="max_days"
// //               value={form.max_days || 0}
// //               onChange={onChange}
// //               className="input input-bordered w-full"
// //               min="0"
// //               disabled={form.is_unlimited}
// //             />
// //           </div>
// //         </div>
        
// //         {/* Description */}
// //         <div>
// //           <label className="label">
// //             <span className="label-text">Description</span>
// //           </label>
// //           <textarea
// //             name="description"
// //             value={form.description || ''}
// //             onChange={onChange}
// //             className="textarea textarea-bordered w-full"
// //             rows={3}
// //             placeholder="Describe this leave type..."
// //           />
// //         </div>
        
// //         {/* Requirements */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //           <label className="flex items-center gap-2 cursor-pointer">
// //             <input
// //               type="checkbox"
// //               name="requires_approval"
// //               checked={!!form.requires_approval}
// //               onChange={onChange}
// //               className="checkbox checkbox-primary"
// //             />
// //             <span className="label-text">Requires Approval</span>
// //           </label>
          
// //           <label className="flex items-center gap-2 cursor-pointer">
// //             <input
// //               type="checkbox"
// //               name="requires_documentation"
// //               checked={!!form.requires_documentation}
// //               onChange={onChange}
// //               className="checkbox checkbox-primary"
// //             />
// //             <span className="label-text">Requires Documentation</span>
// //           </label>
          
// //           <label className="flex items-center gap-2 cursor-pointer">
// //             <input
// //               type="checkbox"
// //               name="is_unlimited"
// //               checked={!!form.is_unlimited}
// //               onChange={(e) => {
// //                 const checked = e.target.checked;
// //                 if (isEdit) {
// //                   setEditForm(prev => ({
// //                     ...prev,
// //                     is_unlimited: checked,
// //                     max_days: checked ? 0 : prev.max_days,
// //                     allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
// //                   }));
// //                 } else {
// //                   setAddForm(prev => ({
// //                     ...prev,
// //                     is_unlimited: checked,
// //                     max_days: checked ? 0 : prev.max_days,
// //                     allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
// //                   }));
// //                 }
// //               }}
// //               className="checkbox checkbox-primary"
// //             />
// //             <span className="label-text">Unlimited Leave</span>
// //           </label>
// //         </div>
        
// //         {/* Allocation & Eligibility - Only show if not unlimited */}
// //         {!form.is_unlimited && (
// //           <>
// //             <div className="divider">Allocation & Eligibility</div>
            
// //             {/* Allocation Method */}
// //             <div>
// //               <label className="label">
// //                 <span className="label-text">Allocation Method</span>
// //               </label>
// //               <div className="flex gap-4">
// //                 <label className="flex items-center gap-2 cursor-pointer">
// //                   <input
// //                     type="radio"
// //                     name="allocation_primary"
// //                     value="YEAR_OF_SERVICE"
// //                     checked={form.allocation_primary === 'YEAR_OF_SERVICE'}
// //                     onChange={onChange}
// //                     className="radio radio-primary"
// //                   />
// //                   <span className="label-text">Year of Service</span>
// //                 </label>
                
// //                 <label className="flex items-center gap-2 cursor-pointer">
// //                   <input
// //                     type="radio"
// //                     name="allocation_primary"
// //                     value="EARN"
// //                     checked={form.allocation_primary === 'EARN'}
// //                     onChange={onChange}
// //                     className="radio radio-primary"
// //                   />
// //                   <span className="label-text">Accrual (Earn)</span>
// //                 </label>
// //               </div>
// //             </div>
            
// //             {/* Year of Service Configuration */}
// //             {form.allocation_primary === 'YEAR_OF_SERVICE' && (
// //               <div className="border rounded-lg p-4">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <label className="label">
// //                     <span className="label-text font-semibold">Year of Service Brackets</span>
// //                     <span className="label-text-alt">Define entitlement based on years of service</span>
// //                   </label>
// //                   <button
// //                     type="button"
// //                     onClick={addYosRowFn}
// //                     className="btn btn-xs btn-primary"
// //                   >
// //                     Add Bracket
// //                   </button>
// //                 </div>
                
// //                 <div className="space-y-4">
// //                   {(form.yos_brackets || []).map((bracket, index) => (
// //                     <div key={index} className="border rounded p-4">
// //                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
// //                         <div>
// //                           <label className="label">
// //                             <span className="label-text">Min Years</span>
// //                           </label>
// //                           <input
// //                             type="number"
// //                             min="0"
// //                             value={bracket.min_years}
// //                             onChange={(e) => updateYosBracketFn(index, 'min_years', parseInt(e.target.value) || 0)}
// //                             className="input input-bordered w-full"
// //                             required
// //                           />
// //                         </div>
                        
// //                         <div>
// //                           <label className="label">
// //                             <span className="label-text">Max Years (blank for ∞)</span>
// //                           </label>
// //                           <input
// //                             type="number"
// //                             min="0"
// //                             value={bracket.max_years || ''}
// //                             onChange={(e) => updateYosBracketFn(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
// //                             className="input input-bordered w-full"
// //                             placeholder="∞"
// //                           />
// //                         </div>
                        
// //                         <div>
// //                           <label className="label">
// //                             <span className="label-text">Days Allocation</span>
// //                           </label>
// //                           <input
// //                             type="number"
// //                             min="0"
// //                             step="0.5"
// //                             value={bracket.days}
// //                             onChange={(e) => updateYosBracketFn(index, 'days', parseFloat(e.target.value) || 0)}
// //                             className="input input-bordered w-full"
// //                             required
// //                           />
// //                         </div>
// //                       </div>
                      
// //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                         <div>
// //                           <label className="label">
// //                             <span className="label-text">Renewal Period</span>
// //                           </label>
// //                           <select
// //                             value={bracket.renewal_period || 'YEARLY'}
// //                             onChange={(e) => updateYosBracketFn(index, 'renewal_period', e.target.value)}
// //                             className="select select-bordered w-full"
// //                           >
// //                             <option value="YEARLY">Yearly</option>
// //                             <option value="QUARTERLY">Quarterly</option>
// //                             <option value="MONTHLY">Monthly</option>
// //                             <option value="NONE">No automatic renewal</option>
// //                           </select>
// //                         </div>
                        
// //                         <div>
// //                           <label className="label">
// //                             <span className="label-text">Max Carryover Days</span>
// //                           </label>
// //                           <input
// //                             type="number"
// //                             min="0"
// //                             value={bracket.carryover_max_days || 0}
// //                             onChange={(e) => updateYosBracketFn(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
// //                             className="input input-bordered w-full"
// //                             disabled={bracket.expire_unused_at_period_end}
// //                           />
// //                         </div>
// //                       </div>
                      
// //                       <div className="mt-4 flex items-center justify-between">
// //                         <label className="flex items-center gap-2">
// //                           <input
// //                             type="checkbox"
// //                             checked={!!bracket.expire_unused_at_period_end}
// //                             onChange={(e) => {
// //                               updateYosBracketFn(index, 'expire_unused_at_period_end', e.target.checked);
// //                               if (e.target.checked) {
// //                                 updateYosBracketFn(index, 'carryover_max_days', 0);
// //                               }
// //                             }}
// //                             className="checkbox checkbox-primary"
// //                           />
// //                           <span className="label-text">Use-it-or-lose-it (no carryover)</span>
// //                         </label>
                        
// //                         <button
// //                           type="button"
// //                           onClick={() => removeYosRowFn(index)}
// //                           className="btn btn-xs btn-error"
// //                         >
// //                           Remove
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
            
// //             {/* Accrual Configuration */}
// //             {form.allocation_primary === 'EARN' && (
// //               <div className="border rounded-lg p-4">
// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                   <div>
// //                     <label className="label">
// //                       <span className="label-text">Accrual Frequency</span>
// //                     </label>
// //                     <select
// //                       name="accrual_frequency"
// //                       value={form.accrual_frequency || 'MONTHLY'}
// //                       onChange={onChange}
// //                       className="select select-bordered w-full"
// //                     >
// //                       <option value="MONTHLY">Monthly</option>
// //                       <option value="QUARTERLY">Quarterly</option>
// //                       <option value="YEARLY">Yearly</option>
// //                     </select>
// //                   </div>
                  
// //                   <div>
// //                     <label className="label">
// //                       <span className="label-text">
// //                         {form.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
// //                          form.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
// //                       </span>
// //                     </label>
// //                     <input
// //                       type="number"
// //                       step="0.1"
// //                       min="0"
// //                       name="accrual_rate"
// //                       value={form.accrual_rate || 0}
// //                       onChange={onChange}
// //                       className="input input-bordered w-full"
// //                     />
// //                   </div>
                  
// //                   <div className="flex items-end">
// //                     <label className="flex items-center gap-2 cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         name="earn_prorate_join_month"
// //                         checked={!!form.earn_prorate_join_month}
// //                         onChange={onChange}
// //                         className="checkbox checkbox-primary"
// //                       />
// //                       <span className="label-text">Prorate for new joiners</span>
// //                     </label>
// //                   </div>
// //                 </div>
                
// //                 {/* Renewal & Carryover Settings */}
// //                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="label">
// //                       <span className="label-text">Renewal Period</span>
// //                     </label>
// //                     <select
// //                       name="renewal_period"
// //                       value={form.renewal_period || 'YEARLY'}
// //                       onChange={onChange}
// //                       className="select select-bordered w-full"
// //                     >
// //                       <option value="YEARLY">Yearly</option>
// //                       <option value="QUARTERLY">Quarterly</option>
// //                       <option value="MONTHLY">Monthly</option>
// //                       <option value="NONE">No automatic renewal</option>
// //                     </select>
// //                   </div>
                  
// //                   <div>
// //                     <label className="label">
// //                       <span className="label-text">Max Carryover Days</span>
// //                     </label>
// //                     <input
// //                       type="number"
// //                       min="0"
// //                       name="carryover_max_days"
// //                       value={form.carryover_max_days || 0}
// //                       onChange={onChange}
// //                       className="input input-bordered w-full"
// //                       disabled={form.expire_unused_at_period_end}
// //                     />
// //                   </div>
// //                 </div>
                
// //                 <div className="mt-4">
// //                   <label className="flex items-center gap-2 cursor-pointer">
// //                     <input
// //                       type="checkbox"
// //                       name="expire_unused_at_period_end"
// //                       checked={!!form.expire_unused_at_period_end}
// //                       onChange={(e) => {
// //                         const checked = e.target.checked;
// //                         if (isEdit) {
// //                           setEditForm(prev => ({
// //                             ...prev,
// //                             expire_unused_at_period_end: checked,
// //                             carryover_max_days: checked ? 0 : prev.carryover_max_days
// //                           }));
// //                         } else {
// //                           setAddForm(prev => ({
// //                             ...prev,
// //                             expire_unused_at_period_end: checked,
// //                             carryover_max_days: checked ? 0 : prev.carryover_max_days
// //                           }));
// //                         }
// //                       }}
// //                       className="checkbox checkbox-primary"
// //                     />
// //                     <span className="label-text">Use-it-or-lose-it (no carryover allowed)</span>
// //                   </label>
// //                 </div>
// //               </div>
// //             )}
            
// //             {/* Eligibility Scope */}
// //             <div>
// //               <label className="label">
// //                 <span className="label-text">Eligibility Scope</span>
// //               </label>
// //               <select
// //                 name="eligibility_scope"
// //                 value={form.eligibility_scope || 'ALL_STAFF'}
// //                 onChange={onChange}
// //                 className="select select-bordered w-full"
// //               >
// //                 <option value="ALL_STAFF">All Staff</option>
// //                 <option value="UPON_CONFIRM">Upon Confirmation</option>
// //                 <option value="UNDER_PROBATION">Under Probation</option>
// //                 <option value="UPON_JOIN">Upon Joining</option>
// //               </select>
// //             </div>
// //           </>
// //         )}
        
// //         {/* Active Status */}
// //         <div className="flex items-center gap-2">
// //           <input
// //             type="checkbox"
// //             name="is_active"
// //             checked={!!form.is_active}
// //             onChange={onChange}
// //             className="checkbox checkbox-primary"
// //           />
// //           <span className="label-text">Active (available for use)</span>
// //         </div>
// //       </>
// //     );
// //   };
  
// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h3 className="text-2xl font-bold">Leave Types Management</h3>
// //           <p className="text-sm text-slate-500 mt-1">
// //             Configure different types of leave with custom allocation rules
// //           </p>
// //         </div>
// //         <button
// //           onClick={() => setShowAddModal(true)}
// //           className="btn btn-primary"
// //         >
// //           <FaPlus className="mr-2" />
// //           Add Leave Type
// //         </button>
// //       </div>
      
// //       {/* Search and Filter Controls */}
// //       <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
// //         <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
// //           <div className="join">
// //             <input
// //               type="text"
// //               placeholder="Search leave types..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="input input-bordered join-item w-full sm:w-64"
// //             />
// //             <button className="btn join-item">
// //               <FaSearch />
// //             </button>
// //           </div>
          
// //           <div className="flex gap-2">
// //             <select
// //               value={statusFilter}
// //               onChange={(e) => setStatusFilter(e.target.value)}
// //               className="select select-bordered"
// //             >
// //               <option value="all">All Status</option>
// //               <option value="active">Active</option>
// //               <option value="inactive">Inactive</option>
// //             </select>
            
// //             <select
// //               value={allocationFilter}
// //               onChange={(e) => setAllocationFilter(e.target.value)}
// //               className="select select-bordered"
// //             >
// //               <option value="all">All Allocation</option>
// //               <option value="yos">Year of Service</option>
// //               <option value="earn">Accrual (Earn)</option>
// //               <option value="immediate">Immediate</option>
// //             </select>
// //           </div>
// //         </div>
        
// //         <div className="flex items-center gap-2">
// //           <span className="text-sm">Show:</span>
// //           <select
// //             value={itemsPerPage}
// //             onChange={handleItemsPerPageChange}
// //             className="select select-bordered select-sm"
// //           >
// //             <option value="5">5</option>
// //             <option value="10">10</option>
// //             <option value="20">20</option>
// //             <option value="50">50</option>
// //           </select>
// //           <span className="text-sm">entries</span>
// //         </div>
// //       </div>
      
// //       {/* Info Summary */}
// //       <div className="text-sm text-slate-600">
// //         Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaveTypes.length)} of {filteredLeaveTypes.length} entries
// //         {searchTerm && ` • Searching: "${searchTerm}"`}
// //         {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
// //         {allocationFilter !== 'all' && ` • Allocation: ${allocationFilter}`}
// //       </div>
      
// //       {/* Leave Types Table */}
// //       <div className="overflow-x-auto border rounded-lg">
// //         <table className="table w-full">
// //           <thead>
// //             <tr>
// //               <th>Leave Type</th>
// //               <th>Code</th>
// //               <th>Description</th>
// //               <th>Allocation</th>
// //               <th>Days</th>
// //               <th>Status</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {currentItems.map(leaveType => (
// //               <tr key={leaveType.id} className="hover">
// //                 <td>
// //                   <div className="font-medium">{leaveType.leave_type_name}</div>
// //                   {leaveType.company_id && leaveType.company_id !== '0' && (
// //                     <div className="text-xs text-slate-500">
// //                       Company ID: {leaveType.company_id}
// //                     </div>
// //                   )}
// //                 </td>
// //                 <td>
// //                   <span className="badge badge-outline font-mono">
// //                     {leaveType.code}
// //                   </span>
// //                 </td>
// //                 <td>
// //                   <div className="max-w-xs truncate" title={leaveType.description}>
// //                     {leaveType.description || '-'}
// //                   </div>
// //                 </td>
// //                 <td>
// //                   <div className="flex flex-col gap-1">
// //                     <span className="badge badge-sm">
// //                       {leaveType.allocation_primary || 'Standard'}
// //                     </span>
// //                     {leaveType.yos_brackets && leaveType.yos_brackets.length > 0 && (
// //                       <span className="badge badge-sm badge-info">
// //                         {leaveType.yos_brackets.length} YOS bracket(s)
// //                       </span>
// //                     )}
// //                   </div>
// //                 </td>
// //                 <td>
// //                   {leaveType.is_unlimited ? (
// //                     <span className="badge badge-warning">Unlimited</span>
// //                   ) : (
// //                     <span className="font-medium">{leaveType.max_days} days</span>
// //                   )}
// //                 </td>
// //                 <td>
// //                   <div className="flex items-center gap-2">
// //                     <span className={`badge ${leaveType.is_active ? 'badge-success' : 'badge-error'}`}>
// //                       {leaveType.is_active ? 'Active' : 'Inactive'}
// //                     </span>
// //                     <button
// //                       onClick={() => toggleActiveStatus(leaveType.id, leaveType.is_active)}
// //                       className="btn btn-xs btn-ghost"
// //                       title={leaveType.is_active ? 'Deactivate' : 'Activate'}
// //                     >
// //                       {leaveType.is_active ? <FaEyeSlash /> : <FaEye />}
// //                     </button>
// //                   </div>
// //                 </td>
// //                 <td>
// //                   <div className="flex gap-2">
// //                     <button
// //                       onClick={() => handleEdit(leaveType)}
// //                       className="btn btn-xs btn-primary"
// //                       title="Edit"
// //                     >
// //                       <FaEdit />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDuplicate(leaveType)}
// //                       className="btn btn-xs btn-secondary"
// //                       title="Duplicate"
// //                     >
// //                       <FaCopy />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(leaveType.id)}
// //                       className="btn btn-xs btn-error"
// //                       title="Delete"
// //                     >
// //                       <FaTrash />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
            
// //             {currentItems.length === 0 && (
// //               <tr>
// //                 <td colSpan={7} className="text-center py-8">
// //                   <div className="flex flex-col items-center justify-center gap-3">
// //                     <FaCalendarAlt className="h-16 w-16 text-slate-400" />
// //                     <div className="space-y-2">
// //                       <h3 className="text-lg font-medium text-slate-600">
// //                         No leave types found
// //                       </h3>
// //                       <p className="text-sm text-slate-500">
// //                         {searchTerm || statusFilter !== 'all' || allocationFilter !== 'all' 
// //                           ? 'Try adjusting your search or filters'
// //                           : 'Create your first leave type to get started'}
// //                       </p>
// //                     </div>
// //                     {!searchTerm && statusFilter === 'all' && allocationFilter === 'all' && (
// //                       <button
// //                         onClick={() => setShowAddModal(true)}
// //                         className="btn btn-primary mt-4"
// //                       >
// //                         <FaPlus className="mr-2" />
// //                         Create First Leave Type
// //                       </button>
// //                     )}
// //                   </div>
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
      
// //       {/* Pagination Controls */}
// //       {totalPages > 1 && (
// //         <div className="flex justify-center items-center gap-2 mt-6">
// //           <button
// //             onClick={() => goToPage(1)}
// //             disabled={currentPage === 1}
// //             className="btn btn-sm btn-ghost"
// //           >
// //             <FaAngleDoubleLeft />
// //           </button>
// //           <button
// //             onClick={() => goToPage(currentPage - 1)}
// //             disabled={currentPage === 1}
// //             className="btn btn-sm btn-ghost"
// //           >
// //             <FaAngleLeft />
// //             Previous
// //           </button>
          
// //           <div className="flex items-center gap-1">
// //             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //               let pageNum;
// //               if (totalPages <= 5) {
// //                 pageNum = i + 1;
// //               } else if (currentPage <= 3) {
// //                 pageNum = i + 1;
// //               } else if (currentPage >= totalPages - 2) {
// //                 pageNum = totalPages - 4 + i;
// //               } else {
// //                 pageNum = currentPage - 2 + i;
// //               }
              
// //               return (
// //                 <button
// //                   key={pageNum}
// //                   onClick={() => goToPage(pageNum)}
// //                   className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
// //                 >
// //                   {pageNum}
// //                 </button>
// //               );
// //             })}
// //           </div>
          
// //           <button
// //             onClick={() => goToPage(currentPage + 1)}
// //             disabled={currentPage === totalPages}
// //             className="btn btn-sm btn-ghost"
// //           >
// //             Next
// //             <FaAngleRight />
// //           </button>
// //           <button
// //             onClick={() => goToPage(totalPages)}
// //             disabled={currentPage === totalPages}
// //             className="btn btn-sm btn-ghost"
// //           >
// //             <FaAngleDoubleRight />
// //           </button>
// //         </div>
// //       )}
      
// //       {/* Add Leave Type Modal */}
// //       {/* {showAddModal && (
// //         <div className="modal modal-open">
// //           <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
// //             <h3 className="font-bold text-lg mb-4">Add New Leave Type</h3>
            
// //             <form onSubmit={handleAddSubmit}>
// //               {renderFormFields(addForm, false, handleAddInputChange, updateYosBracket, removeYosRow, addYosRow)}
              
// //               <div className="modal-action mt-6">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowAddModal(false)}
// //                   className="btn btn-ghost"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button type="submit" className="btn btn-primary">
// //                   Create Leave Type
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //           <div className="modal-backdrop" onClick={() => setShowAddModal(false)}></div>
// //         </div>
// //       )} */}
// //       {/* Add Leave Type Modal */}
// // {showAddModal && (
// //   <div className="modal modal-open">
// //     <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h3 className="font-bold text-xl">Create New Leave Type</h3>
// //           <p className="text-sm text-slate-500 mt-1">Configure leave type rules and allocation methods</p>
// //         </div>
// //         <button
// //           onClick={() => setShowAddModal(false)}
// //           className="btn btn-sm btn-circle btn-ghost"
// //         >
// //           <FaTimes />
// //         </button>
// //       </div>

// //       <form onSubmit={handleAddSubmit} className="space-y-6">
// //         {/* Basic Information Card */}
// //         <div className="card bg-base-100 shadow">
// //           <div className="card-body p-6">
// //             <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
// //               <FaTag className="text-primary" />
// //               Basic Information
// //             </h4>
            
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div className="space-y-2">
// //                 <label className="label">
// //                   <span className="label-text font-medium">Leave Type Name</span>
// //                   <span className="label-text-alt text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="leave_type_name"
// //                   value={addForm.leave_type_name || ''}
// //                   onChange={handleAddInputChange}
// //                   className="input input-bordered w-full focus:input-primary"
// //                   placeholder="e.g., Annual Leave, Medical Leave"
// //                   required
// //                 />
// //                 <div className="text-xs text-slate-500">
// //                   Display name for this leave type
// //                 </div>
// //               </div>
              
// //               <div className="space-y-2">
// //                 <label className="label">
// //                   <span className="label-text font-medium">Code</span>
// //                   <span className="label-text-alt text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="code"
// //                   value={addForm.code || ''}
// //                   onChange={handleAddInputChange}
// //                   className="input input-bordered w-full focus:input-primary font-mono"
// //                   placeholder="AL, ML, SL"
// //                   required
// //                 />
// //                 <div className="text-xs text-slate-500">
// //                   Short code used in reports and systems
// //                 </div>
// //               </div>
              
// //               <div className="md:col-span-2 space-y-2">
// //                 <label className="label">
// //                   <span className="label-text font-medium">Description</span>
// //                 </label>
// //                 <textarea
// //                   name="description"
// //                   value={addForm.description || ''}
// //                   onChange={handleAddInputChange}
// //                   className="textarea textarea-bordered w-full focus:textarea-primary"
// //                   rows={3}
// //                   placeholder="Describe the purpose and usage of this leave type..."
// //                 />
// //                 <div className="text-xs text-slate-500">
// //                   Optional description to help users understand when to use this leave
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Leave Configuration Card */}
// //         <div className="card bg-base-100 shadow">
// //           <div className="card-body p-6">
// //             <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
// //               <FaCog className="text-primary" />
// //               Configuration
// //             </h4>
            
// //             {/* Global Scope Notice */}
// //             <div className="alert alert-info mb-6">
// //               <FaInfoCircle className="text-lg" />
// //               <div>
// //                 <span className="font-medium">Global Leave Type</span>
// //                 <div className="text-xs">
// //                   This leave type will be available to all companies in the system
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div className="space-y-4">
// //               {/* Max Days */}
// //               <div className="form-control">
// //                 <label className="label cursor-pointer justify-start gap-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={!!addForm.is_unlimited}
// //                     onChange={(e) => {
// //                       const checked = e.target.checked;
// //                       setAddForm(prev => ({
// //                         ...prev,
// //                         is_unlimited: checked,
// //                         max_days: checked ? 0 : prev.max_days,
// //                         allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
// //                       }));
// //                     }}
// //                     className="checkbox checkbox-primary"
// //                   />
// //                   <div>
// //                     <span className="label-text font-medium">Unlimited Leave</span>
// //                     <div className="text-xs text-slate-500">
// //                       Employees can take this leave without day limits
// //                     </div>
// //                   </div>
// //                 </label>
// //               </div>
              
// //               {!addForm.is_unlimited && (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   <div className="space-y-2">
// //                     <label className="label">
// //                       <span className="label-text font-medium">Maximum Days</span>
// //                     </label>
// //                     <input
// //                       type="number"
// //                       name="max_days"
// //                       value={addForm.max_days || 0}
// //                       onChange={handleAddInputChange}
// //                       className="input input-bordered w-full focus:input-primary"
// //                       min="0"
// //                       step="0.5"
// //                       placeholder="e.g., 14, 21, 30"
// //                     />
// //                     <div className="text-xs text-slate-500">
// //                       Maximum days allowed per period
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Requirements */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
// //                 <div className="space-y-3">
// //                   <h5 className="font-medium text-sm">Requirements</h5>
// //                   <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                     <input
// //                       type="checkbox"
// //                       name="requires_approval"
// //                       checked={!!addForm.requires_approval}
// //                       onChange={handleAddInputChange}
// //                       className="checkbox checkbox-primary mt-1"
// //                     />
// //                     <div>
// //                       <div className="font-medium">Requires Approval</div>
// //                       <div className="text-xs text-slate-500">
// //                         Leave requests need manager approval
// //                       </div>
// //                     </div>
// //                   </label>
                  
// //                   <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                     <input
// //                       type="checkbox"
// //                       name="requires_documentation"
// //                       checked={!!addForm.requires_documentation}
// //                       onChange={handleAddInputChange}
// //                       className="checkbox checkbox-primary mt-1"
// //                     />
// //                     <div>
// //                       <div className="font-medium">Requires Documentation</div>
// //                       <div className="text-xs text-slate-500">
// //                         Medical certificate or supporting documents required
// //                       </div>
// //                     </div>
// //                   </label>
// //                 </div>
                
// //                 <div className="space-y-3">
// //                   <h5 className="font-medium text-sm">Status</h5>
// //                   <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                     <input
// //                       type="checkbox"
// //                       name="is_active"
// //                       checked={!!addForm.is_active}
// //                       onChange={handleAddInputChange}
// //                       className="checkbox checkbox-primary mt-1"
// //                     />
// //                     <div>
// //                       <div className="font-medium">Active</div>
// //                       <div className="text-xs text-slate-500">
// //                         Available for employees to use
// //                       </div>
// //                     </div>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Allocation & Eligibility Card - Only show if not unlimited */}
// //         {!addForm.is_unlimited && (
// //           <div className="card bg-base-100 shadow">
// //             <div className="card-body p-6">
// //               <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
// //                 <FaCalendarAlt className="text-primary" />
// //                 Allocation & Eligibility
// //               </h4>
              
// //               <div className="space-y-6">
// //                 {/* Allocation Method Selection */}
// //                 <div className="space-y-4">
// //                   <h5 className="font-medium">Allocation Method</h5>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'YEAR_OF_SERVICE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
// //                       <div className="card-body p-4">
// //                         <div className="flex items-center gap-3">
// //                           <input
// //                             type="radio"
// //                             name="allocation_primary"
// //                             value="YEAR_OF_SERVICE"
// //                             checked={addForm.allocation_primary === 'YEAR_OF_SERVICE'}
// //                             onChange={handleAddInputChange}
// //                             className="radio radio-primary"
// //                           />
// //                           <div>
// //                             <div className="font-medium">Year of Service</div>
// //                             <div className="text-xs text-slate-500">
// //                               Days based on years worked
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </label>
                    
// //                     <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'EARN' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
// //                       <div className="card-body p-4">
// //                         <div className="flex items-center gap-3">
// //                           <input
// //                             type="radio"
// //                             name="allocation_primary"
// //                             value="EARN"
// //                             checked={addForm.allocation_primary === 'EARN'}
// //                             onChange={handleAddInputChange}
// //                             className="radio radio-primary"
// //                           />
// //                           <div>
// //                             <div className="font-medium">Accrual (Earn)</div>
// //                             <div className="text-xs text-slate-500">
// //                               Days earned over time (monthly, quarterly)
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </label>
// //                   </div>
// //                 </div>

// //                 {/* Year of Service Configuration */}
// //                 {addForm.allocation_primary === 'YEAR_OF_SERVICE' && (
// //                   <div className="border rounded-lg p-4 bg-base-50">
// //                     <div className="flex justify-between items-center mb-4">
// //                       <div>
// //                         <h6 className="font-medium">Year of Service Brackets</h6>
// //                         <div className="text-xs text-slate-500">
// //                           Define entitlement based on employee's years of service
// //                         </div>
// //                       </div>
// //                       <button
// //                         type="button"
// //                         onClick={addYosRow}
// //                         className="btn btn-primary btn-sm"
// //                       >
// //                         <FaPlus className="mr-1" />
// //                         Add Bracket
// //                       </button>
// //                     </div>
                    
// //                     <div className="space-y-4">
// //                       {(addForm.yos_brackets || []).map((bracket, index) => (
// //                         <div key={index} className="border rounded p-4 bg-white">
// //                           <div className="flex justify-between items-center mb-3">
// //                             <h6 className="font-medium">Bracket {index + 1}</h6>
// //                             <button
// //                               type="button"
// //                               onClick={() => removeYosRow(index)}
// //                               className="btn btn-xs btn-error"
// //                             >
// //                               Remove
// //                             </button>
// //                           </div>
                          
// //                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Min Years</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 value={bracket.min_years}
// //                                 onChange={(e) => updateYosBracket(index, 'min_years', parseInt(e.target.value) || 0)}
// //                                 className="input input-bordered w-full"
// //                                 required
// //                               />
// //                             </div>
                            
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Max Years</span>
// //                                 <span className="label-text-alt">(blank for ∞)</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 value={bracket.max_years || ''}
// //                                 onChange={(e) => updateYosBracket(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
// //                                 className="input input-bordered w-full"
// //                                 placeholder="∞"
// //                               />
// //                             </div>
                            
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Days Allocation</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 step="0.5"
// //                                 value={bracket.days}
// //                                 onChange={(e) => updateYosBracket(index, 'days', parseFloat(e.target.value) || 0)}
// //                                 className="input input-bordered w-full"
// //                                 required
// //                               />
// //                             </div>
// //                           </div>
                          
// //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Renewal Period</span>
// //                               </label>
// //                               <select
// //                                 value={bracket.renewal_period || 'YEARLY'}
// //                                 onChange={(e) => updateYosBracket(index, 'renewal_period', e.target.value)}
// //                                 className="select select-bordered w-full"
// //                               >
// //                                 <option value="YEARLY">Yearly</option>
// //                                 <option value="QUARTERLY">Quarterly</option>
// //                                 <option value="MONTHLY">Monthly</option>
// //                                 <option value="NONE">No automatic renewal</option>
// //                               </select>
// //                             </div>
                            
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Max Carryover Days</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 value={bracket.carryover_max_days || 0}
// //                                 onChange={(e) => updateYosBracket(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
// //                                 className="input input-bordered w-full"
// //                                 disabled={bracket.expire_unused_at_period_end}
// //                               />
// //                             </div>
// //                           </div>
                          
// //                           <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                             <input
// //                               type="checkbox"
// //                               checked={!!bracket.expire_unused_at_period_end}
// //                               onChange={(e) => {
// //                                 updateYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
// //                                 if (e.target.checked) {
// //                                   updateYosBracket(index, 'carryover_max_days', 0);
// //                                 }
// //                               }}
// //                               className="checkbox checkbox-primary"
// //                             />
// //                             <div>
// //                               <div className="font-medium">Use-it-or-lose-it</div>
// //                               <div className="text-xs text-slate-500">
// //                                 No carryover allowed, unused days expire
// //                               </div>
// //                             </div>
// //                           </label>
// //                         </div>
// //                       ))}
                      
// //                       {(addForm.yos_brackets || []).length === 0 && (
// //                         <div className="text-center py-8 border-2 border-dashed rounded-lg">
// //                           <FaCalendarAlt className="h-12 w-12 text-slate-400 mx-auto mb-3" />
// //                           <p className="text-slate-500">
// //                             No brackets configured. Add your first bracket to define year-of-service rules.
// //                           </p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Accrual Configuration */}
// //                 {addForm.allocation_primary === 'EARN' && (
// //                   <div className="border rounded-lg p-4 bg-base-50">
// //                     <h6 className="font-medium mb-4">Accrual Settings</h6>
                    
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">Accrual Frequency</span>
// //                         </label>
// //                         <select
// //                           name="accrual_frequency"
// //                           value={addForm.accrual_frequency || 'MONTHLY'}
// //                           onChange={handleAddInputChange}
// //                           className="select select-bordered w-full"
// //                         >
// //                           <option value="MONTHLY">Monthly</option>
// //                           <option value="QUARTERLY">Quarterly</option>
// //                           <option value="YEARLY">Yearly</option>
// //                         </select>
// //                       </div>
                      
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">
// //                             {addForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
// //                              addForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
// //                           </span>
// //                         </label>
// //                         <input
// //                           type="number"
// //                           step="0.1"
// //                           min="0"
// //                           name="accrual_rate"
// //                           value={addForm.accrual_rate || 0}
// //                           onChange={handleAddInputChange}
// //                           className="input input-bordered w-full"
// //                           placeholder="e.g., 1.25, 2.5"
// //                         />
// //                       </div>
                      
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">New Joiner Prorate</span>
// //                         </label>
// //                         <label className="flex items-center gap-3 cursor-pointer">
// //                           <input
// //                             type="checkbox"
// //                             name="earn_prorate_join_month"
// //                             checked={!!addForm.earn_prorate_join_month}
// //                             onChange={handleAddInputChange}
// //                             className="checkbox checkbox-primary"
// //                           />
// //                           <span className="label-text">Prorate first month</span>
// //                         </label>
// //                       </div>
// //                     </div>
                    
// //                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">Renewal Period</span>
// //                         </label>
// //                         <select
// //                           name="renewal_period"
// //                           value={addForm.renewal_period || 'YEARLY'}
// //                           onChange={handleAddInputChange}
// //                           className="select select-bordered w-full"
// //                         >
// //                           <option value="YEARLY">Yearly</option>
// //                           <option value="QUARTERLY">Quarterly</option>
// //                           <option value="MONTHLY">Monthly</option>
// //                           <option value="NONE">No automatic renewal</option>
// //                         </select>
// //                       </div>
                      
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">Max Carryover Days</span>
// //                         </label>
// //                         <input
// //                           type="number"
// //                           min="0"
// //                           name="carryover_max_days"
// //                           value={addForm.carryover_max_days || 0}
// //                           onChange={handleAddInputChange}
// //                           className="input input-bordered w-full"
// //                           disabled={addForm.expire_unused_at_period_end}
// //                         />
// //                       </div>
// //                     </div>
                    
// //                     <div className="mt-4">
// //                       <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                         <input
// //                           type="checkbox"
// //                           name="expire_unused_at_period_end"
// //                           checked={!!addForm.expire_unused_at_period_end}
// //                           onChange={(e) => {
// //                             const checked = e.target.checked;
// //                             setAddForm(prev => ({
// //                               ...prev,
// //                               expire_unused_at_period_end: checked,
// //                               carryover_max_days: checked ? 0 : prev.carryover_max_days
// //                             }));
// //                           }}
// //                           className="checkbox checkbox-primary"
// //                         />
// //                         <div>
// //                           <div className="font-medium">Use-it-or-lose-it</div>
// //                           <div className="text-xs text-slate-500">
// //                             No carryover allowed, unused days expire at period end
// //                           </div>
// //                         </div>
// //                       </label>
// //                     </div>
// //                   </div>
// //                 )}
                
// //                 {/* Eligibility Scope */}
// //                 <div className="space-y-2">
// //                   <label className="label">
// //                     <span className="label-text font-medium">Eligibility Scope</span>
// //                   </label>
// //                   <select
// //                     name="eligibility_scope"
// //                     value={addForm.eligibility_scope || 'ALL_STAFF'}
// //                     onChange={handleAddInputChange}
// //                     className="select select-bordered w-full"
// //                   >
// //                     <option value="ALL_STAFF">All Staff</option>
// //                     <option value="UPON_CONFIRM">Upon Confirmation</option>
// //                     <option value="UNDER_PROBATION">Under Probation</option>
// //                     <option value="UPON_JOIN">Upon Joining</option>
// //                   </select>
// //                   <div className="text-xs text-slate-500">
// //                     Determines which employees are eligible for this leave type
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Modal Actions */}
// //         <div className="modal-action">
// //           <button
// //             type="button"
// //             onClick={() => setShowAddModal(false)}
// //             className="btn btn-ghost"
// //           >
// //             Cancel
// //           </button>
// //           <button type="submit" className="btn btn-primary">
// //             <FaCheck className="mr-2" />
// //             Create Leave Type
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //     <div className="modal-backdrop" onClick={() => setShowAddModal(false)}></div>
// //   </div>
// // )}
      
// //       {/* Edit Leave Type Modal
// //       {showEditModal && selectedLeaveType && (
// //         <div className="modal modal-open">
// //           <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
// //             <h3 className="font-bold text-lg mb-4">Edit Leave Type</h3>
            
// //             <form onSubmit={handleEditSubmit}>
// //               {renderFormFields(editForm, true, handleEditInputChange, updateEditYosBracket, removeEditYosRow, addEditYosRow)}
              
// //               <div className="modal-action mt-6">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowEditModal(false)}
// //                   className="btn btn-ghost"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button type="submit" className="btn btn-primary">
// //                   Update Leave Type
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //           <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
// //         </div>
// //       )} */}

// //       {showEditModal && selectedLeaveType && (
// //   <div className="modal modal-open">
// //     <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h3 className="font-bold text-xl">Edit Leave Type</h3>
// //           <p className="text-sm text-slate-500 mt-1">
// //             Editing: <span className="font-medium">{selectedLeaveType.leave_type_name}</span> ({selectedLeaveType.code})
// //           </p>
// //         </div>
// //         <button
// //           onClick={() => setShowEditModal(false)}
// //           className="btn btn-sm btn-circle btn-ghost"
// //         >
// //           <FaTimes />
// //         </button>
// //       </div>

// //       <form onSubmit={handleEditSubmit} className="space-y-6">
// //         {/* Basic Information Card */}
// //         <div className="card bg-base-100 shadow">
// //           <div className="card-body p-6">
// //             <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
// //               <FaTag className="text-primary" />
// //               Basic Information
// //             </h4>
            
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div className="space-y-2">
// //                 <label className="label">
// //                   <span className="label-text font-medium">Leave Type Name</span>
// //                   <span className="label-text-alt text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="leave_type_name"
// //                   value={editForm.leave_type_name || ''}
// //                   onChange={handleEditInputChange}
// //                   className="input input-bordered w-full focus:input-primary"
// //                   placeholder="e.g., Annual Leave, Medical Leave"
// //                   required
// //                 />
// //                 <div className="text-xs text-slate-500">
// //                   Display name for this leave type
// //                 </div>
// //               </div>
              
// //               <div className="space-y-2">
// //                 <label className="label">
// //                   <span className="label-text font-medium">Code</span>
// //                   <span className="label-text-alt text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="code"
// //                   value={editForm.code || ''}
// //                   onChange={handleEditInputChange}
// //                   className="input input-bordered w-full focus:input-primary font-mono"
// //                   placeholder="AL, ML, SL"
// //                   required
// //                 />
// //                 <div className="text-xs text-slate-500">
// //                   Short code used in reports and systems
// //                 </div>
// //               </div>
              
// //               <div className="md:col-span-2 space-y-2">
// //                 <label className="label">
// //                   <span className="label-text font-medium">Description</span>
// //                 </label>
// //                 <textarea
// //                   name="description"
// //                   value={editForm.description || ''}
// //                   onChange={handleEditInputChange}
// //                   className="textarea textarea-bordered w-full focus:textarea-primary"
// //                   rows={3}
// //                   placeholder="Describe the purpose and usage of this leave type..."
// //                 />
// //                 <div className="text-xs text-slate-500">
// //                   Optional description to help users understand when to use this leave
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Leave Configuration Card */}
// //         <div className="card bg-base-100 shadow">
// //           <div className="card-body p-6">
// //             <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
// //               <FaCog className="text-primary" />
// //               Configuration
// //             </h4>
            
// //             {/* Scope Information */}
// //             <div className={`alert mb-6 ${selectedLeaveType.company_id && selectedLeaveType.company_id !== '0' ? 'alert-warning' : 'alert-info'}`}>
// //               <FaInfoCircle className="text-lg" />
// //               <div>
// //                 <span className="font-medium">
// //                   {selectedLeaveType.company_id && selectedLeaveType.company_id !== '0' 
// //                     ? 'Company-Specific Leave Type' 
// //                     : 'Global Leave Type'}
// //                 </span>
// //                 <div className="text-xs">
// //                   {selectedLeaveType.company_id && selectedLeaveType.company_id !== '0'
// //                     ? `This leave type is assigned to a specific company and cannot be changed to global.`
// //                     : 'This leave type is available to all companies in the system.'}
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div className="space-y-4">
// //               {/* Max Days */}
// //               <div className="form-control">
// //                 <label className="label cursor-pointer justify-start gap-4">
// //                   <input
// //                     type="checkbox"
// //                     checked={!!editForm.is_unlimited}
// //                     onChange={(e) => {
// //                       const checked = e.target.checked;
// //                       setEditForm(prev => ({
// //                         ...prev,
// //                         is_unlimited: checked,
// //                         max_days: checked ? 0 : prev.max_days,
// //                         allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
// //                       }));
// //                     }}
// //                     className="checkbox checkbox-primary"
// //                   />
// //                   <div>
// //                     <span className="label-text font-medium">Unlimited Leave</span>
// //                     <div className="text-xs text-slate-500">
// //                       Employees can take this leave without day limits
// //                     </div>
// //                   </div>
// //                 </label>
// //               </div>
              
// //               {!editForm.is_unlimited && (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   <div className="space-y-2">
// //                     <label className="label">
// //                       <span className="label-text font-medium">Maximum Days</span>
// //                     </label>
// //                     <input
// //                       type="number"
// //                       name="max_days"
// //                       value={editForm.max_days || 0}
// //                       onChange={handleEditInputChange}
// //                       className="input input-bordered w-full focus:input-primary"
// //                       min="0"
// //                       step="0.5"
// //                       placeholder="e.g., 14, 21, 30"
// //                     />
// //                     <div className="text-xs text-slate-500">
// //                       Maximum days allowed per period
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Requirements */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
// //                 <div className="space-y-3">
// //                   <h5 className="font-medium text-sm">Requirements</h5>
// //                   <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                     <input
// //                       type="checkbox"
// //                       name="requires_approval"
// //                       checked={!!editForm.requires_approval}
// //                       onChange={handleEditInputChange}
// //                       className="checkbox checkbox-primary mt-1"
// //                     />
// //                     <div>
// //                       <div className="font-medium">Requires Approval</div>
// //                       <div className="text-xs text-slate-500">
// //                         Leave requests need manager approval
// //                       </div>
// //                     </div>
// //                   </label>
                  
// //                   <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                     <input
// //                       type="checkbox"
// //                       name="requires_documentation"
// //                       checked={!!editForm.requires_documentation}
// //                       onChange={handleEditInputChange}
// //                       className="checkbox checkbox-primary mt-1"
// //                     />
// //                     <div>
// //                       <div className="font-medium">Requires Documentation</div>
// //                       <div className="text-xs text-slate-500">
// //                         Medical certificate or supporting documents required
// //                       </div>
// //                     </div>
// //                   </label>
// //                 </div>
                
// //                 <div className="space-y-3">
// //                   <h5 className="font-medium text-sm">Status</h5>
// //                   <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                     <input
// //                       type="checkbox"
// //                       name="is_active"
// //                       checked={!!editForm.is_active}
// //                       onChange={handleEditInputChange}
// //                       className="checkbox checkbox-primary mt-1"
// //                     />
// //                     <div>
// //                       <div className="font-medium">Active</div>
// //                       <div className="text-xs text-slate-500">
// //                         Available for employees to use
// //                       </div>
// //                     </div>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Allocation & Eligibility Card - Only show if not unlimited */}
// //         {!editForm.is_unlimited && (
// //           <div className="card bg-base-100 shadow">
// //             <div className="card-body p-6">
// //               <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
// //                 <FaCalendarAlt className="text-primary" />
// //                 Allocation & Eligibility
// //               </h4>
              
// //               <div className="space-y-6">
// //                 {/* Allocation Method Selection */}
// //                 <div className="space-y-4">
// //                   <h5 className="font-medium">Allocation Method</h5>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'YEAR_OF_SERVICE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
// //                       <div className="card-body p-4">
// //                         <div className="flex items-center gap-3">
// //                           <input
// //                             type="radio"
// //                             name="allocation_primary"
// //                             value="YEAR_OF_SERVICE"
// //                             checked={editForm.allocation_primary === 'YEAR_OF_SERVICE'}
// //                             onChange={handleEditInputChange}
// //                             className="radio radio-primary"
// //                           />
// //                           <div>
// //                             <div className="font-medium">Year of Service</div>
// //                             <div className="text-xs text-slate-500">
// //                               Days based on years worked
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </label>
                    
// //                     <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'EARN' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
// //                       <div className="card-body p-4">
// //                         <div className="flex items-center gap-3">
// //                           <input
// //                             type="radio"
// //                             name="allocation_primary"
// //                             value="EARN"
// //                             checked={editForm.allocation_primary === 'EARN'}
// //                             onChange={handleEditInputChange}
// //                             className="radio radio-primary"
// //                           />
// //                           <div>
// //                             <div className="font-medium">Accrual (Earn)</div>
// //                             <div className="text-xs text-slate-500">
// //                               Days earned over time (monthly, quarterly)
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </label>
// //                   </div>
// //                 </div>

// //                 {/* Year of Service Configuration */}
// //                 {editForm.allocation_primary === 'YEAR_OF_SERVICE' && (
// //                   <div className="border rounded-lg p-4 bg-base-50">
// //                     <div className="flex justify-between items-center mb-4">
// //                       <div>
// //                         <h6 className="font-medium">Year of Service Brackets</h6>
// //                         <div className="text-xs text-slate-500">
// //                           Define entitlement based on employee's years of service
// //                         </div>
// //                       </div>
// //                       <button
// //                         type="button"
// //                         onClick={addEditYosRow}
// //                         className="btn btn-primary btn-sm"
// //                       >
// //                         <FaPlus className="mr-1" />
// //                         Add Bracket
// //                       </button>
// //                     </div>
                    
// //                     <div className="space-y-4">
// //                       {(editForm.yos_brackets || []).map((bracket, index) => (
// //                         <div key={index} className="border rounded p-4 bg-white">
// //                           <div className="flex justify-between items-center mb-3">
// //                             <h6 className="font-medium">Bracket {index + 1}</h6>
// //                             <button
// //                               type="button"
// //                               onClick={() => removeEditYosRow(index)}
// //                               className="btn btn-xs btn-error"
// //                             >
// //                               Remove
// //                             </button>
// //                           </div>
                          
// //                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Min Years</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 value={bracket.min_years}
// //                                 onChange={(e) => updateEditYosBracket(index, 'min_years', parseInt(e.target.value) || 0)}
// //                                 className="input input-bordered w-full"
// //                                 required
// //                               />
// //                             </div>
                            
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Max Years</span>
// //                                 <span className="label-text-alt">(blank for ∞)</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 value={bracket.max_years || ''}
// //                                 onChange={(e) => updateEditYosBracket(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
// //                                 className="input input-bordered w-full"
// //                                 placeholder="∞"
// //                               />
// //                             </div>
                            
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Days Allocation</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 step="0.5"
// //                                 value={bracket.days}
// //                                 onChange={(e) => updateEditYosBracket(index, 'days', parseFloat(e.target.value) || 0)}
// //                                 className="input input-bordered w-full"
// //                                 required
// //                               />
// //                             </div>
// //                           </div>
                          
// //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Renewal Period</span>
// //                               </label>
// //                               <select
// //                                 value={bracket.renewal_period || 'YEARLY'}
// //                                 onChange={(e) => updateEditYosBracket(index, 'renewal_period', e.target.value)}
// //                                 className="select select-bordered w-full"
// //                               >
// //                                 <option value="YEARLY">Yearly</option>
// //                                 <option value="QUARTERLY">Quarterly</option>
// //                                 <option value="MONTHLY">Monthly</option>
// //                                 <option value="NONE">No automatic renewal</option>
// //                               </select>
// //                             </div>
                            
// //                             <div className="space-y-2">
// //                               <label className="label">
// //                                 <span className="label-text">Max Carryover Days</span>
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 min="0"
// //                                 value={bracket.carryover_max_days || 0}
// //                                 onChange={(e) => updateEditYosBracket(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
// //                                 className="input input-bordered w-full"
// //                                 disabled={bracket.expire_unused_at_period_end}
// //                               />
// //                             </div>
// //                           </div>
                          
// //                           <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                             <input
// //                               type="checkbox"
// //                               checked={!!bracket.expire_unused_at_period_end}
// //                               onChange={(e) => {
// //                                 updateEditYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
// //                                 if (e.target.checked) {
// //                                   updateEditYosBracket(index, 'carryover_max_days', 0);
// //                                 }
// //                               }}
// //                               className="checkbox checkbox-primary"
// //                             />
// //                             <div>
// //                               <div className="font-medium">Use-it-or-lose-it</div>
// //                               <div className="text-xs text-slate-500">
// //                                 No carryover allowed, unused days expire
// //                               </div>
// //                             </div>
// //                           </label>
// //                         </div>
// //                       ))}
                      
// //                       {(editForm.yos_brackets || []).length === 0 && (
// //                         <div className="text-center py-8 border-2 border-dashed rounded-lg">
// //                           <FaCalendarAlt className="h-12 w-12 text-slate-400 mx-auto mb-3" />
// //                           <p className="text-slate-500">
// //                             No brackets configured. Add your first bracket to define year-of-service rules.
// //                           </p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Accrual Configuration */}
// //                 {editForm.allocation_primary === 'EARN' && (
// //                   <div className="border rounded-lg p-4 bg-base-50">
// //                     <h6 className="font-medium mb-4">Accrual Settings</h6>
                    
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">Accrual Frequency</span>
// //                         </label>
// //                         <select
// //                           name="accrual_frequency"
// //                           value={editForm.accrual_frequency || 'MONTHLY'}
// //                           onChange={handleEditInputChange}
// //                           className="select select-bordered w-full"
// //                         >
// //                           <option value="MONTHLY">Monthly</option>
// //                           <option value="QUARTERLY">Quarterly</option>
// //                           <option value="YEARLY">Yearly</option>
// //                         </select>
// //                       </div>
                      
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">
// //                             {editForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
// //                              editForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
// //                           </span>
// //                         </label>
// //                         <input
// //                           type="number"
// //                           step="0.1"
// //                           min="0"
// //                           name="accrual_rate"
// //                           value={editForm.accrual_rate || 0}
// //                           onChange={handleEditInputChange}
// //                           className="input input-bordered w-full"
// //                           placeholder="e.g., 1.25, 2.5"
// //                         />
// //                       </div>
                      
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">New Joiner Prorate</span>
// //                         </label>
// //                         <label className="flex items-center gap-3 cursor-pointer">
// //                           <input
// //                             type="checkbox"
// //                             name="earn_prorate_join_month"
// //                             checked={!!editForm.earn_prorate_join_month}
// //                             onChange={handleEditInputChange}
// //                             className="checkbox checkbox-primary"
// //                           />
// //                           <span className="label-text">Prorate first month</span>
// //                         </label>
// //                       </div>
// //                     </div>
                    
// //                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">Renewal Period</span>
// //                         </label>
// //                         <select
// //                           name="renewal_period"
// //                           value={editForm.renewal_period || 'YEARLY'}
// //                           onChange={handleEditInputChange}
// //                           className="select select-bordered w-full"
// //                         >
// //                           <option value="YEARLY">Yearly</option>
// //                           <option value="QUARTERLY">Quarterly</option>
// //                           <option value="MONTHLY">Monthly</option>
// //                           <option value="NONE">No automatic renewal</option>
// //                         </select>
// //                       </div>
                      
// //                       <div className="space-y-2">
// //                         <label className="label">
// //                           <span className="label-text">Max Carryover Days</span>
// //                         </label>
// //                         <input
// //                           type="number"
// //                           min="0"
// //                           name="carryover_max_days"
// //                           value={editForm.carryover_max_days || 0}
// //                           onChange={handleEditInputChange}
// //                           className="input input-bordered w-full"
// //                           disabled={editForm.expire_unused_at_period_end}
// //                         />
// //                       </div>
// //                     </div>
                    
// //                     <div className="mt-4">
// //                       <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
// //                         <input
// //                           type="checkbox"
// //                           name="expire_unused_at_period_end"
// //                           checked={!!editForm.expire_unused_at_period_end}
// //                           onChange={(e) => {
// //                             const checked = e.target.checked;
// //                             setEditForm(prev => ({
// //                               ...prev,
// //                               expire_unused_at_period_end: checked,
// //                               carryover_max_days: checked ? 0 : prev.carryover_max_days
// //                             }));
// //                           }}
// //                           className="checkbox checkbox-primary"
// //                         />
// //                         <div>
// //                           <div className="font-medium">Use-it-or-lose-it</div>
// //                           <div className="text-xs text-slate-500">
// //                             No carryover allowed, unused days expire at period end
// //                           </div>
// //                         </div>
// //                       </label>
// //                     </div>
// //                   </div>
// //                 )}
                
// //                 {/* Eligibility Scope */}
// //                 <div className="space-y-2">
// //                   <label className="label">
// //                     <span className="label-text font-medium">Eligibility Scope</span>
// //                   </label>
// //                   <select
// //                     name="eligibility_scope"
// //                     value={editForm.eligibility_scope || 'ALL_STAFF'}
// //                     onChange={handleEditInputChange}
// //                     className="select select-bordered w-full"
// //                   >
// //                     <option value="ALL_STAFF">All Staff</option>
// //                     <option value="UPON_CONFIRM">Upon Confirmation</option>
// //                     <option value="UNDER_PROBATION">Under Probation</option>
// //                     <option value="UPON_JOIN">Upon Joining</option>
// //                   </select>
// //                   <div className="text-xs text-slate-500">
// //                     Determines which employees are eligible for this leave type
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Modal Actions */}
// //         <div className="modal-action">
// //           <button
// //             type="button"
// //             onClick={() => setShowEditModal(false)}
// //             className="btn btn-ghost"
// //           >
// //             Cancel
// //           </button>
// //           <button type="submit" className="btn btn-primary">
// //             <FaCheck className="mr-2" />
// //             Update Leave Type
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //     <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
// //   </div>
// // )}
// //     </div>
// //   );
// // };

// // export default LeaveTypesManagement;


// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { useTheme } from '../components/ThemeProvider';
// import { useNotification } from '../hooks/useNotification';
// import { 
//   FaPlus, FaEdit, FaTrash, FaCopy, FaEye, FaEyeSlash,
//   FaCalendarAlt, FaTag, FaCog, FaInfoCircle, FaCheck, FaTimes,
//   FaSearch, FaFilter, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight
// } from 'react-icons/fa';

// interface LeaveType {
//   id: number;
//   leave_type_name: string;
//   code: string;
//   description: string;
//   max_days: number;
//   requires_approval: boolean;
//   requires_documentation: boolean;
//   is_active: boolean;
//   company_id?: string;
//   allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
//   eligibility_scope?: 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF' | 'UPON_JOIN';
//   accrual_frequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
//   accrual_rate?: number;
//   earn_prorate_join_month?: boolean;
//   renewal_period?: 'NONE' | 'YEARLY' | 'QUARTERLY' | 'MONTHLY';
//   expire_unused_at_period_end?: boolean;
//   carryover_max_days?: number;
//   is_unlimited?: boolean;
//   yos_brackets?: YearOfServiceBracket[];
//   created_at?: string;
//   updated_at?: string;
// }

// interface YearOfServiceBracket {
//   min_years: number;
//   max_years?: number | null;
//   days: number;
//   renewal_period?: string;
//   carryover_max_days?: number;
//   expire_unused_at_period_end?: boolean;
// }

// const LeaveTypesManagement = () => {
//   const { theme } = useTheme();
//   const { showNotification } = useNotification();
//   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
//   const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<LeaveType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
//   const [companies, setCompanies] = useState<any[]>([]);
  
//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'active', 'inactive'
//   const [allocationFilter, setAllocationFilter] = useState<string>('all'); // 'all', 'yos', 'earn', 'immediate'
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
  
//   // Form states
//   const [addForm, setAddForm] = useState<Partial<LeaveType>>({
//     leave_type_name: '',
//     code: '',
//     description: '',
//     max_days: 14,
//     requires_approval: true,
//     requires_documentation: false,
//     is_active: true,
//     company_id: '0',
//     allocation_primary: 'IMMEDIATE',
//     eligibility_scope: 'ALL_STAFF',
//     accrual_frequency: 'MONTHLY',
//     accrual_rate: 0,
//     earn_prorate_join_month: false,
//     renewal_period: 'YEARLY',
//     expire_unused_at_period_end: false,
//     carryover_max_days: 0,
//     is_unlimited: false,
//     yos_brackets: []
//   });
  
//   const [editForm, setEditForm] = useState<Partial<LeaveType>>({
//     leave_type_name: '',
//     code: '',
//     description: '',
//     max_days: 0,
//     requires_approval: true,
//     requires_documentation: false,
//     is_active: true,
//     company_id: '0',
//     allocation_primary: 'YEAR_OF_SERVICE',
//     eligibility_scope: 'ALL_STAFF',
//     accrual_frequency: 'MONTHLY',
//     accrual_rate: 0,
//     earn_prorate_join_month: false,
//     renewal_period: 'YEARLY',
//     expire_unused_at_period_end: false,
//     carryover_max_days: 0,
//     is_unlimited: false,
//     yos_brackets: []
//   });
  
//   // Fetch leave types
//   const fetchLeaveTypes = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveTypes(response.data);
//       setFilteredLeaveTypes(response.data);
//     } catch (error) {
//       console.error('Error fetching leave types:', error);
//       showNotification('Error loading leave types', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Fetch companies
//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/companies`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setCompanies(response.data);
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//     }
//   };
  
//   useEffect(() => {
//     fetchLeaveTypes();
//     fetchCompanies();
//   }, []);
  
//   // Apply filters
//   useEffect(() => {
//     let filtered = leaveTypes;
    
//     // Apply search filter
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(lt =>
//         lt.leave_type_name.toLowerCase().includes(term) ||
//         lt.code.toLowerCase().includes(term) ||
//         lt.description?.toLowerCase().includes(term)
//       );
//     }
    
//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(lt => 
//         statusFilter === 'active' ? lt.is_active : !lt.is_active
//       );
//     }
    
//     // Apply allocation filter
//     if (allocationFilter !== 'all') {
//       filtered = filtered.filter(lt => 
//         lt.allocation_primary === allocationFilter.toUpperCase()
//       );
//     }
    
//     setFilteredLeaveTypes(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [searchTerm, statusFilter, allocationFilter, leaveTypes]);
  
//   // Pagination calculations
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredLeaveTypes.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredLeaveTypes.length / itemsPerPage);
  
//   // Pagination functions
//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };
  
//   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLimit = parseInt(e.target.value);
//     setItemsPerPage(newLimit);
//     setCurrentPage(1);
//   };
  
//   // Handle add form input changes
//   const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setAddForm(prev => ({ ...prev, [name]: checked }));
//     } else if (type === 'number') {
//       setAddForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
//     } else {
//       setAddForm(prev => ({ ...prev, [name]: value }));
//     }
//   };
  
//   // Handle edit form input changes
//   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setEditForm(prev => ({ ...prev, [name]: checked }));
//     } else if (type === 'number') {
//       setEditForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
//     } else {
//       setEditForm(prev => ({ ...prev, [name]: value }));
//     }
//   };
  
//   // Add YOS bracket to add form
//   const addYosRow = () => {
//     setAddForm(prev => ({
//       ...prev,
//       yos_brackets: [
//         ...(prev.yos_brackets || []),
//         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
//       ]
//     }));
//   };
  
//   // Update YOS bracket in add form
//   const updateYosBracket = (index: number, field: string, value: any) => {
//     setAddForm(prev => {
//       const updated = [...(prev.yos_brackets || [])];
//       updated[index] = { ...updated[index], [field]: value };
//       return { ...prev, yos_brackets: updated };
//     });
//   };
  
//   // Remove YOS row from add form
//   const removeYosRow = (index: number) => {
//     setAddForm(prev => ({
//       ...prev,
//       yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
//     }));
//   };
  
//   // Add YOS bracket to edit form
//   const addEditYosRow = () => {
//     setEditForm(prev => ({
//       ...prev,
//       yos_brackets: [
//         ...(prev.yos_brackets || []),
//         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
//       ]
//     }));
//   };
  
//   // Update YOS bracket in edit form
//   const updateEditYosBracket = (index: number, field: string, value: any) => {
//     setEditForm(prev => {
//       const updated = [...(prev.yos_brackets || [])];
//       updated[index] = { ...updated[index], [field]: value };
//       return { ...prev, yos_brackets: updated };
//     });
//   };
  
//   // Remove YOS row from edit form
//   const removeEditYosRow = (index: number) => {
//     setEditForm(prev => ({
//       ...prev,
//       yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
//     }));
//   };
  
//   // Submit add form
//   const handleAddSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_BASE_URL}/api/v1/leave-types`, addForm, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       setShowAddModal(false);
//       setAddForm({
//         leave_type_name: '',
//         code: '',
//         description: '',
//         max_days: 14,
//         requires_approval: true,
//         requires_documentation: false,
//         is_active: true,
//         company_id: '0',
//         allocation_primary: 'IMMEDIATE',
//         eligibility_scope: 'ALL_STAFF',
//         accrual_frequency: 'MONTHLY',
//         accrual_rate: 0,
//         earn_prorate_join_month: false,
//         renewal_period: 'YEARLY',
//         expire_unused_at_period_end: false,
//         carryover_max_days: 0,
//         is_unlimited: false,
//         yos_brackets: []
//       });
      
//       fetchLeaveTypes();
//       showNotification('Leave type created successfully', 'success');
//     } catch (error: any) {
//       console.error('Error creating leave type:', error);
//       showNotification(error.response?.data?.error || 'Error creating leave type', 'error');
//     }
//   };
  
//   // Submit edit form
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
//       setSelectedLeaveType(null);
//       fetchLeaveTypes();
//       showNotification('Leave type updated successfully', 'success');
//     } catch (error: any) {
//       console.error('Error updating leave type:', error);
//       showNotification(error.response?.data?.error || 'Error updating leave type', 'error');
//     }
//   };
  
//   // Delete leave type
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this leave type? This action cannot be undone.')) {
//       return;
//     }
    
//     try {
//       await axios.delete(`${API_BASE_URL}/api/v1/leave-types/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       fetchLeaveTypes();
//       showNotification('Leave type deleted successfully', 'success');
//     } catch (error: any) {
//       console.error('Error deleting leave type:', error);
//       showNotification(error.response?.data?.error || 'Error deleting leave type', 'error');
//     }
//   };
  
//   // Toggle active status
//   const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
//     try {
//       await axios.put(`${API_BASE_URL}/api/v1/leave-types/${id}/toggle-active`, {
//         is_active: !currentStatus
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       fetchLeaveTypes();
//       showNotification(`Leave type ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
//     } catch (error: any) {
//       console.error('Error toggling leave type status:', error);
//       showNotification(error.response?.data?.error || 'Error toggling status', 'error');
//     }
//   };
  
//   // Edit leave type
//   const handleEdit = (leaveType: LeaveType) => {
//     setSelectedLeaveType(leaveType);
//     setEditForm({
//       ...leaveType,
//       yos_brackets: leaveType.yos_brackets || [],
//       company_id: leaveType.company_id || '0'
//     });
//     setShowEditModal(true);
//   };
  
//   // Duplicate leave type
//   const handleDuplicate = async (leaveType: LeaveType) => {
//     try {
//       // Destructure to remove id and timestamps
//       const { id, created_at, updated_at, ...dataToDuplicate } = leaveType;
      
//       const duplicateData = {
//         ...dataToDuplicate,
//         leave_type_name: `${leaveType.leave_type_name} (Copy)`,
//         code: `${leaveType.code}_COPY`,
//         yos_brackets: leaveType.yos_brackets || []
//       };
      
//       await axios.post(`${API_BASE_URL}/api/v1/leave-types`, duplicateData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       fetchLeaveTypes();
//       showNotification('Leave type duplicated successfully', 'success');
//     } catch (error: any) {
//       console.error('Error duplicating leave type:', error);
//       showNotification(error.response?.data?.error || 'Error duplicating leave type', 'error');
//     }
//   };
  
//   // Function to calculate display days based on allocation method
//   const getDisplayDays = (leaveType: LeaveType) => {
//     if (leaveType.is_unlimited) {
//       return { type: 'unlimited', value: 'Unlimited' };
//     }
    
//     switch (leaveType.allocation_primary) {
//       case 'YEAR_OF_SERVICE':
//         if (leaveType.yos_brackets && leaveType.yos_brackets.length > 0) {
//           return { 
//             type: 'yos', 
//             value: `${leaveType.yos_brackets.length} bracket(s)`,
//             brackets: leaveType.yos_brackets
//           };
//         }
//         return { type: 'not_configured', value: 'Not configured' };
        
//       case 'EARN':
//         if (leaveType.accrual_rate && leaveType.accrual_rate > 0) {
//           const frequency = leaveType.accrual_frequency === 'QUARTERLY' ? 'quarter' :
//                            leaveType.accrual_frequency === 'YEARLY' ? 'year' : 'month';
//           return { 
//             type: 'earn', 
//             value: `${leaveType.accrual_rate} days/${frequency}`,
//             maxDays: leaveType.max_days
//           };
//         }
//         return { type: 'not_configured', value: 'Not configured' };
        
//       case 'IMMEDIATE':
//       default:
//         if (leaveType.max_days > 0) {
//           return { type: 'immediate', value: `${leaveType.max_days} days` };
//         }
//         return { type: 'not_configured', value: 'Not configured' };
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }
  
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h3 className="text-2xl font-bold">Leave Types Management</h3>
//           <p className="text-sm text-slate-500 mt-1">
//             Configure different types of leave with custom allocation rules
//           </p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="btn btn-primary"
//         >
//           <FaPlus className="mr-2" />
//           Add Leave Type
//         </button>
//       </div>
      
//       {/* Search and Filter Controls */}
//       <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
//         <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
//           <div className="join">
//             <input
//               type="text"
//               placeholder="Search leave types..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input input-bordered join-item w-full sm:w-64"
//             />
//             <button className="btn join-item">
//               <FaSearch />
//             </button>
//           </div>
          
//           <div className="flex gap-2">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="select select-bordered"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
            
//             <select
//               value={allocationFilter}
//               onChange={(e) => setAllocationFilter(e.target.value)}
//               className="select select-bordered"
//             >
//               <option value="all">All Allocation</option>
//               <option value="yos">Year of Service</option>
//               <option value="earn">Accrual (Earn)</option>
//               <option value="immediate">Immediate</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <span className="text-sm">Show:</span>
//           <select
//             value={itemsPerPage}
//             onChange={handleItemsPerPageChange}
//             className="select select-bordered select-sm"
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="20">20</option>
//             <option value="50">50</option>
//           </select>
//           <span className="text-sm">entries</span>
//         </div>
//       </div>
      
//       {/* Info Summary */}
//       <div className="text-sm text-slate-600">
//         Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaveTypes.length)} of {filteredLeaveTypes.length} entries
//         {searchTerm && ` • Searching: "${searchTerm}"`}
//         {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
//         {allocationFilter !== 'all' && ` • Allocation: ${allocationFilter}`}
//       </div>
      
//       {/* Leave Types Table */}
//       <div className="overflow-x-auto border rounded-lg">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Leave Type</th>
//               <th>Code</th>
//               <th>Description</th>
//               <th>Allocation</th>
//               <th>Days</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.map(leaveType => {
//               const displayDays = getDisplayDays(leaveType);
              
//               return (
//                 <tr key={leaveType.id} className="hover">
//                   <td>
//                     <div className="font-medium">{leaveType.leave_type_name}</div>
//                     {leaveType.company_id && leaveType.company_id !== '0' && (
//                       <div className="text-xs text-slate-500">
//                         Company ID: {leaveType.company_id}
//                       </div>
//                     )}
//                   </td>
//                   <td>
//                     <span className="badge badge-outline font-mono">
//                       {leaveType.code}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="max-w-xs truncate" title={leaveType.description}>
//                       {leaveType.description || '-'}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex flex-col gap-1">
//                       <span className="badge badge-sm">
//                         {leaveType.allocation_primary || 'Standard'}
//                       </span>
//                       {leaveType.yos_brackets && leaveType.yos_brackets.length > 0 && (
//                         <span className="badge badge-sm badge-info">
//                           {leaveType.yos_brackets.length} YOS bracket(s)
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td>
//                     {displayDays.type === 'unlimited' ? (
//                       <span className="badge badge-warning">Unlimited</span>
//                     ) : displayDays.type === 'yos' ? (
//                       <div className="space-y-1">
//                         <div className="font-medium">{displayDays.value}</div>
//                         <div className="text-xs text-slate-500 max-w-[150px]">
//                           {displayDays.brackets!.slice(0, 2).map((bracket, idx) => (
//                             <div key={idx} className="truncate">
//                               {bracket.min_years}{bracket.max_years ? `-${bracket.max_years}` : '+'} yrs: {bracket.days} days
//                             </div>
//                           ))}
//                           {displayDays.brackets!.length > 2 && (
//                             <div className="text-primary">+{displayDays.brackets!.length - 2} more</div>
//                           )}
//                         </div>
//                       </div>
//                     ) : displayDays.type === 'earn' ? (
//                       <div className="space-y-1">
//                         <div className="font-medium">{displayDays.value}</div>
//                         {displayDays.maxDays && displayDays.maxDays > 0 && (
//                           <div className="text-xs text-slate-500">
//                             Max: {displayDays.maxDays} days
//                           </div>
//                         )}
//                       </div>
//                     ) : displayDays.type === 'immediate' ? (
//                       <span className="font-medium">{displayDays.value}</span>
//                     ) : (
//                       <span className="text-slate-400 text-sm">Not configured</span>
//                     )}
//                   </td>
//                   <td>
//                     <div className="flex items-center gap-2">
//                       <span className={`badge ${leaveType.is_active ? 'badge-success' : 'badge-error'}`}>
//                         {leaveType.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                       <button
//                         onClick={() => toggleActiveStatus(leaveType.id, leaveType.is_active)}
//                         className="btn btn-xs btn-ghost"
//                         title={leaveType.is_active ? 'Deactivate' : 'Activate'}
//                       >
//                         {leaveType.is_active ? <FaEyeSlash /> : <FaEye />}
//                       </button>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleEdit(leaveType)}
//                         className="btn btn-xs btn-primary"
//                         title="Edit"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDuplicate(leaveType)}
//                         className="btn btn-xs btn-secondary"
//                         title="Duplicate"
//                       >
//                         <FaCopy />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(leaveType.id)}
//                         className="btn btn-xs btn-error"
//                         title="Delete"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
            
//             {currentItems.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="text-center py-8">
//                   <div className="flex flex-col items-center justify-center gap-3">
//                     <FaCalendarAlt className="h-16 w-16 text-slate-400" />
//                     <div className="space-y-2">
//                       <h3 className="text-lg font-medium text-slate-600">
//                         No leave types found
//                       </h3>
//                       <p className="text-sm text-slate-500">
//                         {searchTerm || statusFilter !== 'all' || allocationFilter !== 'all' 
//                           ? 'Try adjusting your search or filters'
//                           : 'Create your first leave type to get started'}
//                       </p>
//                     </div>
//                     {!searchTerm && statusFilter === 'all' && allocationFilter === 'all' && (
//                       <button
//                         onClick={() => setShowAddModal(true)}
//                         className="btn btn-primary mt-4"
//                       >
//                         <FaPlus className="mr-2" />
//                         Create First Leave Type
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button
//             onClick={() => goToPage(1)}
//             disabled={currentPage === 1}
//             className="btn btn-sm btn-ghost"
//           >
//             <FaAngleDoubleLeft />
//           </button>
//           <button
//             onClick={() => goToPage(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="btn btn-sm btn-ghost"
//           >
//             <FaAngleLeft />
//             Previous
//           </button>
          
//           <div className="flex items-center gap-1">
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               let pageNum;
//               if (totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (currentPage >= totalPages - 2) {
//                 pageNum = totalPages - 4 + i;
//               } else {
//                 pageNum = currentPage - 2 + i;
//               }
              
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => goToPage(pageNum)}
//                   className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </div>
          
//           <button
//             onClick={() => goToPage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="btn btn-sm btn-ghost"
//           >
//             Next
//             <FaAngleRight />
//           </button>
//           <button
//             onClick={() => goToPage(totalPages)}
//             disabled={currentPage === totalPages}
//             className="btn btn-sm btn-ghost"
//           >
//             <FaAngleDoubleRight />
//           </button>
//         </div>
//       )}
      
//       {/* Add Leave Type Modal */}
//       {showAddModal && (
//         <div className="modal modal-open">
//           <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h3 className="font-bold text-xl">Create New Leave Type</h3>
//                 <p className="text-sm text-slate-500 mt-1">Configure leave type rules and allocation methods</p>
//               </div>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="btn btn-sm btn-circle btn-ghost"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <form onSubmit={handleAddSubmit} className="space-y-6">
//               {/* Basic Information Card */}
//               <div className="card bg-base-100 shadow">
//                 <div className="card-body p-6">
//                   <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaTag className="text-primary" />
//                     Basic Information
//                   </h4>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="label">
//                         <span className="label-text font-medium">Leave Type Name</span>
//                         <span className="label-text-alt text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="leave_type_name"
//                         value={addForm.leave_type_name || ''}
//                         onChange={handleAddInputChange}
//                         className="input input-bordered w-full focus:input-primary"
//                         placeholder="e.g., Annual Leave, Medical Leave"
//                         required
//                       />
//                       <div className="text-xs text-slate-500">
//                         Display name for this leave type
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <label className="label">
//                         <span className="label-text font-medium">Code</span>
//                         <span className="label-text-alt text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="code"
//                         value={addForm.code || ''}
//                         onChange={handleAddInputChange}
//                         className="input input-bordered w-full focus:input-primary font-mono"
//                         placeholder="AL, ML, SL"
//                         required
//                       />
//                       <div className="text-xs text-slate-500">
//                         Short code used in reports and systems
//                       </div>
//                     </div>
                    
//                     <div className="md:col-span-2 space-y-2">
//                       <label className="label">
//                         <span className="label-text font-medium">Description</span>
//                       </label>
//                       <textarea
//                         name="description"
//                         value={addForm.description || ''}
//                         onChange={handleAddInputChange}
//                         className="textarea textarea-bordered w-full focus:textarea-primary"
//                         rows={3}
//                         placeholder="Describe the purpose and usage of this leave type..."
//                       />
//                       <div className="text-xs text-slate-500">
//                         Optional description to help users understand when to use this leave
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Leave Configuration Card */}
//               <div className="card bg-base-100 shadow">
//                 <div className="card-body p-6">
//                   <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaCog className="text-primary" />
//                     Configuration
//                   </h4>
                  
//                   {/* Global Scope Notice */}
//                   <div className="alert alert-info mb-6">
//                     <FaInfoCircle className="text-lg" />
//                     <div>
//                       <span className="font-medium">Global Leave Type</span>
//                       <div className="text-xs">
//                         This leave type will be available to all companies in the system
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     {/* Max Days */}
//                     <div className="form-control">
//                       <label className="label cursor-pointer justify-start gap-4">
//                         <input
//                           type="checkbox"
//                           checked={!!addForm.is_unlimited}
//                           onChange={(e) => {
//                             const checked = e.target.checked;
//                             setAddForm(prev => ({
//                               ...prev,
//                               is_unlimited: checked,
//                               max_days: checked ? 0 : prev.max_days,
//                               allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
//                             }));
//                           }}
//                           className="checkbox checkbox-primary"
//                         />
//                         <div>
//                           <span className="label-text font-medium">Unlimited Leave</span>
//                           <div className="text-xs text-slate-500">
//                             Employees can take this leave without day limits
//                           </div>
//                         </div>
//                       </label>
//                     </div>
                    
//                     {/* Requirements */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
//                       <div className="space-y-3">
//                         <h5 className="font-medium text-sm">Requirements</h5>
//                         <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                           <input
//                             type="checkbox"
//                             name="requires_approval"
//                             checked={!!addForm.requires_approval}
//                             onChange={handleAddInputChange}
//                             className="checkbox checkbox-primary mt-1"
//                           />
//                           <div>
//                             <div className="font-medium">Requires Approval</div>
//                             <div className="text-xs text-slate-500">
//                               Leave requests need manager approval
//                             </div>
//                           </div>
//                         </label>
                        
//                         <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                           <input
//                             type="checkbox"
//                             name="requires_documentation"
//                             checked={!!addForm.requires_documentation}
//                             onChange={handleAddInputChange}
//                             className="checkbox checkbox-primary mt-1"
//                           />
//                           <div>
//                             <div className="font-medium">Requires Documentation</div>
//                             <div className="text-xs text-slate-500">
//                               Medical certificate or supporting documents required
//                             </div>
//                           </div>
//                         </label>
//                       </div>
                      
//                       <div className="space-y-3">
//                         <h5 className="font-medium text-sm">Status</h5>
//                         <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                           <input
//                             type="checkbox"
//                             name="is_active"
//                             checked={!!addForm.is_active}
//                             onChange={handleAddInputChange}
//                             className="checkbox checkbox-primary mt-1"
//                           />
//                           <div>
//                             <div className="font-medium">Active</div>
//                             <div className="text-xs text-slate-500">
//                               Available for employees to use
//                             </div>
//                           </div>
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Allocation & Eligibility Card - Only show if not unlimited */}
//               {!addForm.is_unlimited && (
//                 <div className="card bg-base-100 shadow">
//                   <div className="card-body p-6">
//                     <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
//                       <FaCalendarAlt className="text-primary" />
//                       Allocation & Eligibility
//                     </h4>
                    
//                     <div className="space-y-6">
//                       {/* Allocation Method Selection */}
//                       <div className="space-y-4">
//                         <h5 className="font-medium">Allocation Method</h5>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'IMMEDIATE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
//                             <div className="card-body p-4">
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="radio"
//                                   name="allocation_primary"
//                                   value="IMMEDIATE"
//                                   checked={addForm.allocation_primary === 'IMMEDIATE'}
//                                   onChange={handleAddInputChange}
//                                   className="radio radio-primary"
//                                 />
//                                 <div>
//                                   <div className="font-medium">Immediate</div>
//                                   <div className="text-xs text-slate-500">
//                                     Fixed days allocation
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </label>
                          
//                           <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'YEAR_OF_SERVICE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
//                             <div className="card-body p-4">
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="radio"
//                                   name="allocation_primary"
//                                   value="YEAR_OF_SERVICE"
//                                   checked={addForm.allocation_primary === 'YEAR_OF_SERVICE'}
//                                   onChange={handleAddInputChange}
//                                   className="radio radio-primary"
//                                 />
//                                 <div>
//                                   <div className="font-medium">Year of Service</div>
//                                   <div className="text-xs text-slate-500">
//                                     Days based on years worked
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </label>
                          
//                           <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'EARN' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
//                             <div className="card-body p-4">
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="radio"
//                                   name="allocation_primary"
//                                   value="EARN"
//                                   checked={addForm.allocation_primary === 'EARN'}
//                                   onChange={handleAddInputChange}
//                                   className="radio radio-primary"
//                                 />
//                                 <div>
//                                   <div className="font-medium">Accrual (Earn)</div>
//                                   <div className="text-xs text-slate-500">
//                                     Days earned over time
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </label>
//                         </div>
//                       </div>

//                       {/* Max Days for Immediate Allocation */}
//                       {addForm.allocation_primary === 'IMMEDIATE' && (
//                         <div className="border rounded-lg p-4 bg-base-50">
//                           <h6 className="font-medium mb-4">Days Allocation</h6>
//                           <div className="space-y-2">
//                             <label className="label">
//                               <span className="label-text font-medium">Total Days</span>
//                             </label>
//                             <input
//                               type="number"
//                               name="max_days"
//                               value={addForm.max_days || 0}
//                               onChange={handleAddInputChange}
//                               className="input input-bordered w-full focus:input-primary"
//                               min="0"
//                               step="0.5"
//                               placeholder="e.g., 14, 21, 30"
//                             />
//                             <div className="text-xs text-slate-500">
//                               Total days available for this leave type
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Year of Service Configuration */}
//                       {addForm.allocation_primary === 'YEAR_OF_SERVICE' && (
//                         <div className="border rounded-lg p-4 bg-base-50">
//                           <div className="flex justify-between items-center mb-4">
//                             <div>
//                               <h6 className="font-medium">Year of Service Brackets</h6>
//                               <div className="text-xs text-slate-500">
//                                 Define entitlement based on employee's years of service
//                               </div>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={addYosRow}
//                               className="btn btn-primary btn-sm"
//                             >
//                               <FaPlus className="mr-1" />
//                               Add Bracket
//                             </button>
//                           </div>
                          
//                           <div className="space-y-4">
//                             {(addForm.yos_brackets || []).map((bracket, index) => (
//                               <div key={index} className="border rounded p-4 bg-white">
//                                 <div className="flex justify-between items-center mb-3">
//                                   <h6 className="font-medium">Bracket {index + 1}</h6>
//                                   <button
//                                     type="button"
//                                     onClick={() => removeYosRow(index)}
//                                     className="btn btn-xs btn-error"
//                                   >
//                                     Remove
//                                   </button>
//                                 </div>
                                
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Min Years</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       value={bracket.min_years}
//                                       onChange={(e) => updateYosBracket(index, 'min_years', parseInt(e.target.value) || 0)}
//                                       className="input input-bordered w-full"
//                                       required
//                                     />
//                                   </div>
                                  
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Max Years</span>
//                                       <span className="label-text-alt">(blank for ∞)</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       value={bracket.max_years || ''}
//                                       onChange={(e) => updateYosBracket(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
//                                       className="input input-bordered w-full"
//                                       placeholder="∞"
//                                     />
//                                   </div>
                                  
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Days Allocation</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       step="0.5"
//                                       value={bracket.days}
//                                       onChange={(e) => updateYosBracket(index, 'days', parseFloat(e.target.value) || 0)}
//                                       className="input input-bordered w-full"
//                                       required
//                                     />
//                                   </div>
//                                 </div>
                                
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Renewal Period</span>
//                                     </label>
//                                     <select
//                                       value={bracket.renewal_period || 'YEARLY'}
//                                       onChange={(e) => updateYosBracket(index, 'renewal_period', e.target.value)}
//                                       className="select select-bordered w-full"
//                                     >
//                                       <option value="YEARLY">Yearly</option>
//                                       <option value="QUARTERLY">Quarterly</option>
//                                       <option value="MONTHLY">Monthly</option>
//                                       <option value="NONE">No automatic renewal</option>
//                                     </select>
//                                   </div>
                                  
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Max Carryover Days</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       value={bracket.carryover_max_days || 0}
//                                       onChange={(e) => updateYosBracket(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
//                                       className="input input-bordered w-full"
//                                       disabled={bracket.expire_unused_at_period_end}
//                                     />
//                                   </div>
//                                 </div>
                                
//                                 <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                                   <input
//                                     type="checkbox"
//                                     checked={!!bracket.expire_unused_at_period_end}
//                                     onChange={(e) => {
//                                       updateYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
//                                       if (e.target.checked) {
//                                         updateYosBracket(index, 'carryover_max_days', 0);
//                                       }
//                                     }}
//                                     className="checkbox checkbox-primary"
//                                   />
//                                   <div>
//                                     <div className="font-medium">Use-it-or-lose-it</div>
//                                     <div className="text-xs text-slate-500">
//                                       No carryover allowed, unused days expire
//                                     </div>
//                                   </div>
//                                 </label>
//                               </div>
//                             ))}
                            
//                             {(addForm.yos_brackets || []).length === 0 && (
//                               <div className="text-center py-8 border-2 border-dashed rounded-lg">
//                                 <FaCalendarAlt className="h-12 w-12 text-slate-400 mx-auto mb-3" />
//                                 <p className="text-slate-500">
//                                   No brackets configured. Add your first bracket to define year-of-service rules.
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* Accrual Configuration */}
//                       {addForm.allocation_primary === 'EARN' && (
//                         <div className="border rounded-lg p-4 bg-base-50">
//                           <h6 className="font-medium mb-4">Accrual Settings</h6>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Accrual Frequency</span>
//                               </label>
//                               <select
//                                 name="accrual_frequency"
//                                 value={addForm.accrual_frequency || 'MONTHLY'}
//                                 onChange={handleAddInputChange}
//                                 className="select select-bordered w-full"
//                               >
//                                 <option value="MONTHLY">Monthly</option>
//                                 <option value="QUARTERLY">Quarterly</option>
//                                 <option value="YEARLY">Yearly</option>
//                               </select>
//                             </div>
                            
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">
//                                   {addForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
//                                    addForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
//                                 </span>
//                               </label>
//                               <input
//                                 type="number"
//                                 step="0.1"
//                                 min="0"
//                                 name="accrual_rate"
//                                 value={addForm.accrual_rate || 0}
//                                 onChange={handleAddInputChange}
//                                 className="input input-bordered w-full"
//                                 placeholder="e.g., 1.25, 2.5"
//                               />
//                             </div>
                            
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">New Joiner Prorate</span>
//                               </label>
//                               <label className="flex items-center gap-3 cursor-pointer">
//                                 <input
//                                   type="checkbox"
//                                   name="earn_prorate_join_month"
//                                   checked={!!addForm.earn_prorate_join_month}
//                                   onChange={handleAddInputChange}
//                                   className="checkbox checkbox-primary"
//                                 />
//                                 <span className="label-text">Prorate first month</span>
//                               </label>
//                             </div>
//                           </div>
                          
//                           {/* Max Days Cap for Earn Allocation */}
//                           <div className="mt-6">
//                             <h6 className="font-medium mb-2">Maximum Days Cap (Optional)</h6>
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Maximum Accumulated Days</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 min="0"
//                                 name="max_days"
//                                 value={addForm.max_days || 0}
//                                 onChange={handleAddInputChange}
//                                 className="input input-bordered w-full"
//                                 placeholder="0 for no limit"
//                               />
//                               <div className="text-xs text-slate-500">
//                                 Maximum total days that can be accumulated (0 = no limit)
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Renewal Period</span>
//                               </label>
//                               <select
//                                 name="renewal_period"
//                                 value={addForm.renewal_period || 'YEARLY'}
//                                 onChange={handleAddInputChange}
//                                 className="select select-bordered w-full"
//                               >
//                                 <option value="YEARLY">Yearly</option>
//                                 <option value="QUARTERLY">Quarterly</option>
//                                 <option value="MONTHLY">Monthly</option>
//                                 <option value="NONE">No automatic renewal</option>
//                               </select>
//                             </div>
                            
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Max Carryover Days</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 min="0"
//                                 name="carryover_max_days"
//                                 value={addForm.carryover_max_days || 0}
//                                 onChange={handleAddInputChange}
//                                 className="input input-bordered w-full"
//                                 disabled={addForm.expire_unused_at_period_end}
//                               />
//                             </div>
//                           </div>
                          
//                           <div className="mt-4">
//                             <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                               <input
//                                 type="checkbox"
//                                 name="expire_unused_at_period_end"
//                                 checked={!!addForm.expire_unused_at_period_end}
//                                 onChange={(e) => {
//                                   const checked = e.target.checked;
//                                   setAddForm(prev => ({
//                                     ...prev,
//                                     expire_unused_at_period_end: checked,
//                                     carryover_max_days: checked ? 0 : prev.carryover_max_days
//                                   }));
//                                 }}
//                                 className="checkbox checkbox-primary"
//                               />
//                               <div>
//                                 <div className="font-medium">Use-it-or-lose-it</div>
//                                 <div className="text-xs text-slate-500">
//                                   No carryover allowed, unused days expire at period end
//                                 </div>
//                               </div>
//                             </label>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Eligibility Scope */}
//                       <div className="space-y-2">
//                         <label className="label">
//                           <span className="label-text font-medium">Eligibility Scope</span>
//                         </label>
//                         <select
//                           name="eligibility_scope"
//                           value={addForm.eligibility_scope || 'ALL_STAFF'}
//                           onChange={handleAddInputChange}
//                           className="select select-bordered w-full"
//                         >
//                           <option value="ALL_STAFF">All Staff</option>
//                           <option value="UPON_CONFIRM">Upon Confirmation</option>
//                           <option value="UNDER_PROBATION">Under Probation</option>
//                           <option value="UPON_JOIN">Upon Joining</option>
//                         </select>
//                         <div className="text-xs text-slate-500">
//                           Determines which employees are eligible for this leave type
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Modal Actions */}
//               <div className="modal-action">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="btn btn-ghost"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   <FaCheck className="mr-2" />
//                   Create Leave Type
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div className="modal-backdrop" onClick={() => setShowAddModal(false)}></div>
//         </div>
//       )}
      
//       {/* Edit Leave Type Modal */}
//       {showEditModal && selectedLeaveType && (
//         <div className="modal modal-open">
//           <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h3 className="font-bold text-xl">Edit Leave Type</h3>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Editing: <span className="font-medium">{selectedLeaveType.leave_type_name}</span> ({selectedLeaveType.code})
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="btn btn-sm btn-circle btn-ghost"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <form onSubmit={handleEditSubmit} className="space-y-6">
//               {/* Basic Information Card */}
//               <div className="card bg-base-100 shadow">
//                 <div className="card-body p-6">
//                   <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaTag className="text-primary" />
//                     Basic Information
//                   </h4>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="label">
//                         <span className="label-text font-medium">Leave Type Name</span>
//                         <span className="label-text-alt text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="leave_type_name"
//                         value={editForm.leave_type_name || ''}
//                         onChange={handleEditInputChange}
//                         className="input input-bordered w-full focus:input-primary"
//                         placeholder="e.g., Annual Leave, Medical Leave"
//                         required
//                       />
//                       <div className="text-xs text-slate-500">
//                         Display name for this leave type
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <label className="label">
//                         <span className="label-text font-medium">Code</span>
//                         <span className="label-text-alt text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="code"
//                         value={editForm.code || ''}
//                         onChange={handleEditInputChange}
//                         className="input input-bordered w-full focus:input-primary font-mono"
//                         placeholder="AL, ML, SL"
//                         required
//                       />
//                       <div className="text-xs text-slate-500">
//                         Short code used in reports and systems
//                       </div>
//                     </div>
                    
//                     <div className="md:col-span-2 space-y-2">
//                       <label className="label">
//                         <span className="label-text font-medium">Description</span>
//                       </label>
//                       <textarea
//                         name="description"
//                         value={editForm.description || ''}
//                         onChange={handleEditInputChange}
//                         className="textarea textarea-bordered w-full focus:textarea-primary"
//                         rows={3}
//                         placeholder="Describe the purpose and usage of this leave type..."
//                       />
//                       <div className="text-xs text-slate-500">
//                         Optional description to help users understand when to use this leave
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Leave Configuration Card */}
//               <div className="card bg-base-100 shadow">
//                 <div className="card-body p-6">
//                   <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
//                     <FaCog className="text-primary" />
//                     Configuration
//                   </h4>
                  
//                   {/* Scope Information */}
//                   <div className={`alert mb-6 ${selectedLeaveType.company_id && selectedLeaveType.company_id !== '0' ? 'alert-warning' : 'alert-info'}`}>
//                     <FaInfoCircle className="text-lg" />
//                     <div>
//                       <span className="font-medium">
//                         {selectedLeaveType.company_id && selectedLeaveType.company_id !== '0' 
//                           ? 'Company-Specific Leave Type' 
//                           : 'Global Leave Type'}
//                       </span>
//                       <div className="text-xs">
//                         {selectedLeaveType.company_id && selectedLeaveType.company_id !== '0'
//                           ? `This leave type is assigned to a specific company and cannot be changed to global.`
//                           : 'This leave type is available to all companies in the system.'}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     {/* Max Days */}
//                     <div className="form-control">
//                       <label className="label cursor-pointer justify-start gap-4">
//                         <input
//                           type="checkbox"
//                           checked={!!editForm.is_unlimited}
//                           onChange={(e) => {
//                             const checked = e.target.checked;
//                             setEditForm(prev => ({
//                               ...prev,
//                               is_unlimited: checked,
//                               max_days: checked ? 0 : prev.max_days,
//                               allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
//                             }));
//                           }}
//                           className="checkbox checkbox-primary"
//                         />
//                         <div>
//                           <span className="label-text font-medium">Unlimited Leave</span>
//                           <div className="text-xs text-slate-500">
//                             Employees can take this leave without day limits
//                           </div>
//                         </div>
//                       </label>
//                     </div>
                    
//                     {/* Requirements */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
//                       <div className="space-y-3">
//                         <h5 className="font-medium text-sm">Requirements</h5>
//                         <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                           <input
//                             type="checkbox"
//                             name="requires_approval"
//                             checked={!!editForm.requires_approval}
//                             onChange={handleEditInputChange}
//                             className="checkbox checkbox-primary mt-1"
//                           />
//                           <div>
//                             <div className="font-medium">Requires Approval</div>
//                             <div className="text-xs text-slate-500">
//                               Leave requests need manager approval
//                             </div>
//                           </div>
//                         </label>
                        
//                         <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                           <input
//                             type="checkbox"
//                             name="requires_documentation"
//                             checked={!!editForm.requires_documentation}
//                             onChange={handleEditInputChange}
//                             className="checkbox checkbox-primary mt-1"
//                           />
//                           <div>
//                             <div className="font-medium">Requires Documentation</div>
//                             <div className="text-xs text-slate-500">
//                               Medical certificate or supporting documents required
//                             </div>
//                           </div>
//                         </label>
//                       </div>
                      
//                       <div className="space-y-3">
//                         <h5 className="font-medium text-sm">Status</h5>
//                         <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                           <input
//                             type="checkbox"
//                             name="is_active"
//                             checked={!!editForm.is_active}
//                             onChange={handleEditInputChange}
//                             className="checkbox checkbox-primary mt-1"
//                           />
//                           <div>
//                             <div className="font-medium">Active</div>
//                             <div className="text-xs text-slate-500">
//                               Available for employees to use
//                             </div>
//                           </div>
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Allocation & Eligibility Card - Only show if not unlimited */}
//               {!editForm.is_unlimited && (
//                 <div className="card bg-base-100 shadow">
//                   <div className="card-body p-6">
//                     <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
//                       <FaCalendarAlt className="text-primary" />
//                       Allocation & Eligibility
//                     </h4>
                    
//                     <div className="space-y-6">
//                       {/* Allocation Method Selection */}
//                       <div className="space-y-4">
//                         <h5 className="font-medium">Allocation Method</h5>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'IMMEDIATE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
//                             <div className="card-body p-4">
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="radio"
//                                   name="allocation_primary"
//                                   value="IMMEDIATE"
//                                   checked={editForm.allocation_primary === 'IMMEDIATE'}
//                                   onChange={handleEditInputChange}
//                                   className="radio radio-primary"
//                                 />
//                                 <div>
//                                   <div className="font-medium">Immediate</div>
//                                   <div className="text-xs text-slate-500">
//                                     Fixed days allocation
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </label>
                          
//                           <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'YEAR_OF_SERVICE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
//                             <div className="card-body p-4">
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="radio"
//                                   name="allocation_primary"
//                                   value="YEAR_OF_SERVICE"
//                                   checked={editForm.allocation_primary === 'YEAR_OF_SERVICE'}
//                                   onChange={handleEditInputChange}
//                                   className="radio radio-primary"
//                                 />
//                                 <div>
//                                   <div className="font-medium">Year of Service</div>
//                                   <div className="text-xs text-slate-500">
//                                     Days based on years worked
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </label>
                          
//                           <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'EARN' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
//                             <div className="card-body p-4">
//                               <div className="flex items-center gap-3">
//                                 <input
//                                   type="radio"
//                                   name="allocation_primary"
//                                   value="EARN"
//                                   checked={editForm.allocation_primary === 'EARN'}
//                                   onChange={handleEditInputChange}
//                                   className="radio radio-primary"
//                                 />
//                                 <div>
//                                   <div className="font-medium">Accrual (Earn)</div>
//                                   <div className="text-xs text-slate-500">
//                                     Days earned over time
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </label>
//                         </div>
//                       </div>

//                       {/* Max Days for Immediate Allocation */}
//                       {editForm.allocation_primary === 'IMMEDIATE' && (
//                         <div className="border rounded-lg p-4 bg-base-50">
//                           <h6 className="font-medium mb-4">Days Allocation</h6>
//                           <div className="space-y-2">
//                             <label className="label">
//                               <span className="label-text font-medium">Total Days</span>
//                             </label>
//                             <input
//                               type="number"
//                               name="max_days"
//                               value={editForm.max_days || 0}
//                               onChange={handleEditInputChange}
//                               className="input input-bordered w-full focus:input-primary"
//                               min="0"
//                               step="0.5"
//                               placeholder="e.g., 14, 21, 30"
//                             />
//                             <div className="text-xs text-slate-500">
//                               Total days available for this leave type
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Year of Service Configuration */}
//                       {editForm.allocation_primary === 'YEAR_OF_SERVICE' && (
//                         <div className="border rounded-lg p-4 bg-base-50">
//                           <div className="flex justify-between items-center mb-4">
//                             <div>
//                               <h6 className="font-medium">Year of Service Brackets</h6>
//                               <div className="text-xs text-slate-500">
//                                 Define entitlement based on employee's years of service
//                               </div>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={addEditYosRow}
//                               className="btn btn-primary btn-sm"
//                             >
//                               <FaPlus className="mr-1" />
//                               Add Bracket
//                             </button>
//                           </div>
                          
//                           <div className="space-y-4">
//                             {(editForm.yos_brackets || []).map((bracket, index) => (
//                               <div key={index} className="border rounded p-4 bg-white">
//                                 <div className="flex justify-between items-center mb-3">
//                                   <h6 className="font-medium">Bracket {index + 1}</h6>
//                                   <button
//                                     type="button"
//                                     onClick={() => removeEditYosRow(index)}
//                                     className="btn btn-xs btn-error"
//                                   >
//                                     Remove
//                                   </button>
//                                 </div>
                                
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Min Years</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       value={bracket.min_years}
//                                       onChange={(e) => updateEditYosBracket(index, 'min_years', parseInt(e.target.value) || 0)}
//                                       className="input input-bordered w-full"
//                                       required
//                                     />
//                                   </div>
                                  
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Max Years</span>
//                                       <span className="label-text-alt">(blank for ∞)</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       value={bracket.max_years || ''}
//                                       onChange={(e) => updateEditYosBracket(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
//                                       className="input input-bordered w-full"
//                                       placeholder="∞"
//                                     />
//                                   </div>
                                  
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Days Allocation</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       step="0.5"
//                                       value={bracket.days}
//                                       onChange={(e) => updateEditYosBracket(index, 'days', parseFloat(e.target.value) || 0)}
//                                       className="input input-bordered w-full"
//                                       required
//                                     />
//                                   </div>
//                                 </div>
                                
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Renewal Period</span>
//                                     </label>
//                                     <select
//                                       value={bracket.renewal_period || 'YEARLY'}
//                                       onChange={(e) => updateEditYosBracket(index, 'renewal_period', e.target.value)}
//                                       className="select select-bordered w-full"
//                                     >
//                                       <option value="YEARLY">Yearly</option>
//                                       <option value="QUARTERLY">Quarterly</option>
//                                       <option value="MONTHLY">Monthly</option>
//                                       <option value="NONE">No automatic renewal</option>
//                                     </select>
//                                   </div>
                                  
//                                   <div className="space-y-2">
//                                     <label className="label">
//                                       <span className="label-text">Max Carryover Days</span>
//                                     </label>
//                                     <input
//                                       type="number"
//                                       min="0"
//                                       value={bracket.carryover_max_days || 0}
//                                       onChange={(e) => updateEditYosBracket(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
//                                       className="input input-bordered w-full"
//                                       disabled={bracket.expire_unused_at_period_end}
//                                     />
//                                   </div>
//                                 </div>
                                
//                                 <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                                   <input
//                                     type="checkbox"
//                                     checked={!!bracket.expire_unused_at_period_end}
//                                     onChange={(e) => {
//                                       updateEditYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
//                                       if (e.target.checked) {
//                                         updateEditYosBracket(index, 'carryover_max_days', 0);
//                                       }
//                                     }}
//                                     className="checkbox checkbox-primary"
//                                   />
//                                   <div>
//                                     <div className="font-medium">Use-it-or-lose-it</div>
//                                     <div className="text-xs text-slate-500">
//                                       No carryover allowed, unused days expire
//                                     </div>
//                                   </div>
//                                 </label>
//                               </div>
//                             ))}
                            
//                             {(editForm.yos_brackets || []).length === 0 && (
//                               <div className="text-center py-8 border-2 border-dashed rounded-lg">
//                                 <FaCalendarAlt className="h-12 w-12 text-slate-400 mx-auto mb-3" />
//                                 <p className="text-slate-500">
//                                   No brackets configured. Add your first bracket to define year-of-service rules.
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* Accrual Configuration */}
//                       {editForm.allocation_primary === 'EARN' && (
//                         <div className="border rounded-lg p-4 bg-base-50">
//                           <h6 className="font-medium mb-4">Accrual Settings</h6>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Accrual Frequency</span>
//                               </label>
//                               <select
//                                 name="accrual_frequency"
//                                 value={editForm.accrual_frequency || 'MONTHLY'}
//                                 onChange={handleEditInputChange}
//                                 className="select select-bordered w-full"
//                               >
//                                 <option value="MONTHLY">Monthly</option>
//                                 <option value="QUARTERLY">Quarterly</option>
//                                 <option value="YEARLY">Yearly</option>
//                               </select>
//                             </div>
                            
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">
//                                   {editForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
//                                    editForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
//                                 </span>
//                               </label>
//                               <input
//                                 type="number"
//                                 step="0.1"
//                                 min="0"
//                                 name="accrual_rate"
//                                 value={editForm.accrual_rate || 0}
//                                 onChange={handleEditInputChange}
//                                 className="input input-bordered w-full"
//                                 placeholder="e.g., 1.25, 2.5"
//                               />
//                             </div>
                            
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">New Joiner Prorate</span>
//                               </label>
//                               <label className="flex items-center gap-3 cursor-pointer">
//                                 <input
//                                   type="checkbox"
//                                   name="earn_prorate_join_month"
//                                   checked={!!editForm.earn_prorate_join_month}
//                                   onChange={handleEditInputChange}
//                                   className="checkbox checkbox-primary"
//                                 />
//                                 <span className="label-text">Prorate first month</span>
//                               </label>
//                             </div>
//                           </div>
                          
//                           {/* Max Days Cap for Earn Allocation */}
//                           <div className="mt-6">
//                             <h6 className="font-medium mb-2">Maximum Days Cap (Optional)</h6>
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Maximum Accumulated Days</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 min="0"
//                                 name="max_days"
//                                 value={editForm.max_days || 0}
//                                 onChange={handleEditInputChange}
//                                 className="input input-bordered w-full"
//                                 placeholder="0 for no limit"
//                               />
//                               <div className="text-xs text-slate-500">
//                                 Maximum total days that can be accumulated (0 = no limit)
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Renewal Period</span>
//                               </label>
//                               <select
//                                 name="renewal_period"
//                                 value={editForm.renewal_period || 'YEARLY'}
//                                 onChange={handleEditInputChange}
//                                 className="select select-bordered w-full"
//                               >
//                                 <option value="YEARLY">Yearly</option>
//                                 <option value="QUARTERLY">Quarterly</option>
//                                 <option value="MONTHLY">Monthly</option>
//                                 <option value="NONE">No automatic renewal</option>
//                               </select>
//                             </div>
                            
//                             <div className="space-y-2">
//                               <label className="label">
//                                 <span className="label-text">Max Carryover Days</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 min="0"
//                                 name="carryover_max_days"
//                                 value={editForm.carryover_max_days || 0}
//                                 onChange={handleEditInputChange}
//                                 className="input input-bordered w-full"
//                                 disabled={editForm.expire_unused_at_period_end}
//                               />
//                             </div>
//                           </div>
                          
//                           <div className="mt-4">
//                             <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
//                               <input
//                                 type="checkbox"
//                                 name="expire_unused_at_period_end"
//                                 checked={!!editForm.expire_unused_at_period_end}
//                                 onChange={(e) => {
//                                   const checked = e.target.checked;
//                                   setEditForm(prev => ({
//                                     ...prev,
//                                     expire_unused_at_period_end: checked,
//                                     carryover_max_days: checked ? 0 : prev.carryover_max_days
//                                   }));
//                                 }}
//                                 className="checkbox checkbox-primary"
//                               />
//                               <div>
//                                 <div className="font-medium">Use-it-or-lose-it</div>
//                                 <div className="text-xs text-slate-500">
//                                   No carryover allowed, unused days expire at period end
//                                 </div>
//                               </div>
//                             </label>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Eligibility Scope */}
//                       <div className="space-y-2">
//                         <label className="label">
//                           <span className="label-text font-medium">Eligibility Scope</span>
//                         </label>
//                         <select
//                           name="eligibility_scope"
//                           value={editForm.eligibility_scope || 'ALL_STAFF'}
//                           onChange={handleEditInputChange}
//                           className="select select-bordered w-full"
//                         >
//                           <option value="ALL_STAFF">All Staff</option>
//                           <option value="UPON_CONFIRM">Upon Confirmation</option>
//                           <option value="UNDER_PROBATION">Under Probation</option>
//                           <option value="UPON_JOIN">Upon Joining</option>
//                         </select>
//                         <div className="text-xs text-slate-500">
//                           Determines which employees are eligible for this leave type
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Modal Actions */}
//               <div className="modal-action">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="btn btn-ghost"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   <FaCheck className="mr-2" />
//                   Update Leave Type
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeaveTypesManagement;



'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useTheme } from '../components/ThemeProvider';
import { useNotification } from '../hooks/useNotification';
import { 
  FaPlus, FaEdit, FaTrash, FaCopy, FaEye, FaEyeSlash,
  FaCalendarAlt, FaTag, FaCog, FaInfoCircle, FaCheck, FaTimes,
  FaSearch, FaFilter, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';

interface LeaveType {
  id: number;
  leave_type_name: string;
  code: string;
  description: string;
  max_days: number;
  requires_approval: boolean;
  requires_documentation: boolean;
  is_active: boolean;
  company_id?: string;
  allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
  eligibility_scope?: 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF' | 'UPON_JOIN';
  accrual_frequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  accrual_rate?: number;
  earn_prorate_join_month?: boolean;
  renewal_period?: 'NONE' | 'YEARLY' | 'QUARTERLY' | 'MONTHLY';
  expire_unused_at_period_end?: boolean;
  carryover_max_days?: number;
  is_unlimited?: boolean;
  yos_brackets?: YearOfServiceBracket[];
  created_at?: string;
  updated_at?: string;
}

interface YearOfServiceBracket {
  min_years: number;
  max_years?: number | null;
  days: number;
  renewal_period?: string;
  carryover_max_days?: number;
  expire_unused_at_period_end?: boolean;
  prorate_first_year?: boolean; // NEW: Individual prorate per bracket
}

const LeaveTypesManagement = () => {
  const { theme } = useTheme();
  const { showNotification } = useNotification();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'active', 'inactive'
  const [allocationFilter, setAllocationFilter] = useState<string>('all'); // 'all', 'yos', 'earn', 'immediate'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Form states
  const [addForm, setAddForm] = useState<Partial<LeaveType>>({
    leave_type_name: '',
    code: '',
    description: '',
    max_days: 14,
    requires_approval: true,
    requires_documentation: false,
    is_active: true,
    company_id: '0',
    allocation_primary: 'IMMEDIATE',
    eligibility_scope: 'ALL_STAFF',
    accrual_frequency: 'MONTHLY',
    accrual_rate: 0,
    earn_prorate_join_month: false,
    renewal_period: 'YEARLY',
    expire_unused_at_period_end: false,
    carryover_max_days: 0,
    is_unlimited: false,
    yos_brackets: []
  });
  
  const [editForm, setEditForm] = useState<Partial<LeaveType>>({
    leave_type_name: '',
    code: '',
    description: '',
    max_days: 0,
    requires_approval: true,
    requires_documentation: false,
    is_active: true,
    company_id: '0',
    allocation_primary: 'YEAR_OF_SERVICE',
    eligibility_scope: 'ALL_STAFF',
    accrual_frequency: 'MONTHLY',
    accrual_rate: 0,
    earn_prorate_join_month: false,
    renewal_period: 'YEARLY',
    expire_unused_at_period_end: false,
    carryover_max_days: 0,
    is_unlimited: false,
    yos_brackets: []
  });
  
  // Fetch leave types
  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setLeaveTypes(response.data);
      setFilteredLeaveTypes(response.data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      showNotification('Error loading leave types', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/companies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };
  
  useEffect(() => {
    fetchLeaveTypes();
    fetchCompanies();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let filtered = leaveTypes;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lt =>
        lt.leave_type_name.toLowerCase().includes(term) ||
        lt.code.toLowerCase().includes(term) ||
        lt.description?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lt => 
        statusFilter === 'active' ? lt.is_active : !lt.is_active
      );
    }
    
    // Apply allocation filter
    if (allocationFilter !== 'all') {
      filtered = filtered.filter(lt => 
        lt.allocation_primary === allocationFilter.toUpperCase()
      );
    }
    
    setFilteredLeaveTypes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, allocationFilter, leaveTypes]);
  
  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeaveTypes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaveTypes.length / itemsPerPage);
  
  // Pagination functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };
  
  // Handle add form input changes
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setAddForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setAddForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setAddForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setEditForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Add YOS bracket to add form
  const addYosRow = () => {

  const newBracket = {
    min_years: 0,
    max_years: null,
    days: 0,
    renewal_period: 'YEARLY',
    carryover_max_days: 0,
    expire_unused_at_period_end: false,
    prorate_first_year: false, // ADD THIS
  };

    setAddForm(prev => ({
      ...prev,
       yos_brackets: [...(prev.yos_brackets || []), newBracket]
      // yos_brackets: [
      //   ...(prev.yos_brackets || []),
      //   { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
      // ]
    }));
  };
  
  // Update YOS bracket in add form
  const updateYosBracket = (index: number, field: string, value: any) => {
    setAddForm(prev => {
      const updated = [...(prev.yos_brackets || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, yos_brackets: updated };
    });
  };
  
  // Remove YOS row from add form
  const removeYosRow = (index: number) => {
    setAddForm(prev => ({
      ...prev,
      yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
    }));
  };
  
  // Add YOS bracket to edit form
  const addEditYosRow = () => {

  const newBracket = {
    min_years: 0,
    max_years: null,
    days: 0,
    renewal_period: 'YEARLY',
    carryover_max_days: 0,
    expire_unused_at_period_end: false,
    prorate_first_year: false, // ADD THIS
  };

    setEditForm(prev => ({
      ...prev,
      yos_brackets: [...(prev.yos_brackets || []), newBracket]
      // yos_brackets: [
      //   ...(prev.yos_brackets || []),
      //   { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
      // ]
    }));
  };
  
  // Update YOS bracket in edit form
  const updateEditYosBracket = (index: number, field: string, value: any) => {
    setEditForm(prev => {
      const updated = [...(prev.yos_brackets || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, yos_brackets: updated };
    });
  };
  
  // Remove YOS row from edit form
  const removeEditYosRow = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      yos_brackets: (prev.yos_brackets || []).filter((_, i) => i !== index)
    }));
  };
  
  // Submit add form
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/v1/leave-types`, addForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      setShowAddModal(false);
      setAddForm({
        leave_type_name: '',
        code: '',
        description: '',
        max_days: 14,
        requires_approval: true,
        requires_documentation: false,
        is_active: true,
        company_id: '0',
        allocation_primary: 'IMMEDIATE',
        eligibility_scope: 'ALL_STAFF',
        accrual_frequency: 'MONTHLY',
        accrual_rate: 0,
        earn_prorate_join_month: false,
        renewal_period: 'YEARLY',
        expire_unused_at_period_end: false,
        carryover_max_days: 0,
        is_unlimited: false,
        yos_brackets: []
      });
      
      fetchLeaveTypes();
      showNotification('Leave type created successfully', 'success');
    } catch (error: any) {
      console.error('Error creating leave type:', error);
      showNotification(error.response?.data?.error || 'Error creating leave type', 'error');
    }
  };
  
  // Submit edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeaveType) return;
    
    try {
      await axios.put(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      setShowEditModal(false);
      setSelectedLeaveType(null);
      fetchLeaveTypes();
      showNotification('Leave type updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating leave type:', error);
      showNotification(error.response?.data?.error || 'Error updating leave type', 'error');
    }
  };
  
  // Delete leave type
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this leave type? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/leave-types/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      fetchLeaveTypes();
      showNotification('Leave type deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting leave type:', error);
      showNotification(error.response?.data?.error || 'Error deleting leave type', 'error');
    }
  };
  
  // Toggle active status
  const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
    try {
      await axios.put(`${API_BASE_URL}/api/v1/leave-types/${id}/toggle-active`, {
        is_active: !currentStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      fetchLeaveTypes();
      showNotification(`Leave type ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
    } catch (error: any) {
      console.error('Error toggling leave type status:', error);
      showNotification(error.response?.data?.error || 'Error toggling status', 'error');
    }
  };
  
  // Edit leave type
  const handleEdit = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setEditForm({
      ...leaveType,
      yos_brackets: leaveType.yos_brackets || [],
      company_id: leaveType.company_id || '0'
    });
    setShowEditModal(true);
  };
  
  // Duplicate leave type
  const handleDuplicate = async (leaveType: LeaveType) => {
    try {
      // Destructure to remove id and timestamps
      const { id, created_at, updated_at, ...dataToDuplicate } = leaveType;
      
      const duplicateData = {
        ...dataToDuplicate,
        leave_type_name: `${leaveType.leave_type_name} (Copy)`,
        code: `${leaveType.code}_COPY`,
        yos_brackets: leaveType.yos_brackets || []
      };
      
      await axios.post(`${API_BASE_URL}/api/v1/leave-types`, duplicateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      fetchLeaveTypes();
      showNotification('Leave type duplicated successfully', 'success');
    } catch (error: any) {
      console.error('Error duplicating leave type:', error);
      showNotification(error.response?.data?.error || 'Error duplicating leave type', 'error');
    }
  };
  
  // Function to calculate display days based on allocation method
  const getDisplayDays = (leaveType: LeaveType) => {
    if (leaveType.is_unlimited) {
      return { type: 'unlimited', value: 'Unlimited' };
    }
    
    switch (leaveType.allocation_primary) {
      case 'YEAR_OF_SERVICE':
        if (leaveType.yos_brackets && leaveType.yos_brackets.length > 0) {
          return { 
            type: 'yos', 
            value: `${leaveType.yos_brackets.length} bracket(s)`,
            brackets: leaveType.yos_brackets
          };
        }
        return { type: 'not_configured', value: 'Not configured' };
        
      case 'EARN':
        if (leaveType.accrual_rate && leaveType.accrual_rate > 0) {
          const frequency = leaveType.accrual_frequency === 'QUARTERLY' ? 'quarter' :
                           leaveType.accrual_frequency === 'YEARLY' ? 'year' : 'month';
          return { 
            type: 'earn', 
            value: `${leaveType.accrual_rate} days/${frequency}`,
            maxDays: leaveType.max_days
          };
        }
        return { type: 'not_configured', value: 'Not configured' };
        
      case 'IMMEDIATE':
      default:
        if (leaveType.max_days > 0) {
          return { type: 'immediate', value: `${leaveType.max_days} days` };
        }
        return { type: 'not_configured', value: 'Not configured' };
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Leave Types Management</h3>
          <p className="text-sm text-slate-500 mt-1">
            Configure different types of leave with custom allocation rules
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <FaPlus className="mr-2" />
          Add Leave Type
        </button>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="join">
            <input
              type="text"
              placeholder="Search leave types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered join-item w-full sm:w-64"
            />
            <button className="btn join-item">
              <FaSearch />
            </button>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={allocationFilter}
              onChange={(e) => setAllocationFilter(e.target.value)}
              className="select select-bordered"
            >
              <option value="all">All Allocation</option>
              <option value="yos">Year of Service</option>
              <option value="earn">Accrual (Earn)</option>
              <option value="immediate">Immediate</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Show:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="select select-bordered select-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm">entries</span>
        </div>
      </div>
      
      {/* Info Summary */}
      <div className="text-sm text-slate-600">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaveTypes.length)} of {filteredLeaveTypes.length} entries
        {searchTerm && ` • Searching: "${searchTerm}"`}
        {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
        {allocationFilter !== 'all' && ` • Allocation: ${allocationFilter}`}
      </div>
      
      {/* Leave Types Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Code</th>
              <th>Description</th>
              <th>Allocation</th>
              <th>Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(leaveType => {
              const displayDays = getDisplayDays(leaveType);
              
              return (
                <tr key={leaveType.id} className="hover">
                  <td>
                    <div className="font-medium">{leaveType.leave_type_name}</div>
                    {leaveType.company_id && leaveType.company_id !== '0' && (
                      <div className="text-xs text-slate-500">
                        Company ID: {leaveType.company_id}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-outline font-mono">
                      {leaveType.code}
                    </span>
                  </td>
                  <td>
                    <div className="max-w-xs truncate" title={leaveType.description}>
                      {leaveType.description || '-'}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className="badge badge-sm">
                        {leaveType.allocation_primary || 'Standard'}
                      </span>
                      {leaveType.yos_brackets && leaveType.yos_brackets.length > 0 && (
                        <span className="badge badge-sm badge-info">
                          {leaveType.yos_brackets.length} YOS bracket(s)
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {displayDays.type === 'unlimited' ? (
                      <span className="badge badge-warning">Unlimited</span>
                    ) : displayDays.type === 'yos' ? (
                      <div className="space-y-1">
                        <div className="font-medium">{displayDays.value}</div>
                        <div className="text-xs text-slate-500 max-w-[150px]">
                          {displayDays.brackets!.slice(0, 2).map((bracket, idx) => (
                            <div key={idx} className="truncate">
                              {bracket.min_years}{bracket.max_years ? `-${bracket.max_years}` : '+'} yrs: {bracket.days} days
                            </div>
                          ))}
                          {displayDays.brackets!.length > 2 && (
                            <div className="text-primary">+{displayDays.brackets!.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    ) : displayDays.type === 'earn' ? (
                      <div className="space-y-1">
                        <div className="font-medium">{displayDays.value}</div>
                        {displayDays.maxDays && displayDays.maxDays > 0 && (
                          <div className="text-xs text-slate-500">
                            Max: {displayDays.maxDays} days
                          </div>
                        )}
                      </div>
                    ) : displayDays.type === 'immediate' ? (
                      <span className="font-medium">{displayDays.value}</span>
                    ) : (
                      <span className="text-slate-400 text-sm">Not configured</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${leaveType.is_active ? 'badge-success' : 'badge-error'}`}>
                        {leaveType.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => toggleActiveStatus(leaveType.id, leaveType.is_active)}
                        className="btn btn-xs btn-ghost"
                        title={leaveType.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {leaveType.is_active ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(leaveType)}
                        className="btn btn-xs btn-primary"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDuplicate(leaveType)}
                        className="btn btn-xs btn-secondary"
                        title="Duplicate"
                      >
                        <FaCopy />
                      </button>
                      <button
                        onClick={() => handleDelete(leaveType.id)}
                        className="btn btn-xs btn-error"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <FaCalendarAlt className="h-16 w-16 text-slate-400" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-slate-600">
                        No leave types found
                      </h3>
                      <p className="text-sm text-slate-500">
                        {searchTerm || statusFilter !== 'all' || allocationFilter !== 'all' 
                          ? 'Try adjusting your search or filters'
                          : 'Create your first leave type to get started'}
                      </p>
                    </div>
                    {!searchTerm && statusFilter === 'all' && allocationFilter === 'all' && (
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary mt-4"
                      >
                        <FaPlus className="mr-2" />
                        Create First Leave Type
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-ghost"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-ghost"
          >
            <FaAngleLeft />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-ghost"
          >
            Next
            <FaAngleRight />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-ghost"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      )}
      
{/* Add Leave Type Modal */}
{showAddModal && (
  <div className="modal modal-open">
    <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-xl">Create New Leave Type</h3>
          <p className="text-sm text-slate-500 mt-1">Configure leave type rules and allocation methods</p>
        </div>
        <button
          onClick={() => setShowAddModal(false)}
          className="btn btn-sm btn-circle btn-ghost"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleAddSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-6">
            <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
              <FaTag className="text-primary" />
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Leave Type Name</span>
                  <span className="label-text-alt text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="leave_type_name"
                  value={addForm.leave_type_name || ''}
                  onChange={handleAddInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Annual Leave, Medical Leave"
                  required
                />
                <div className="text-xs text-slate-500">
                  Display name for this leave type
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Code</span>
                  <span className="label-text-alt text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={addForm.code || ''}
                  onChange={handleAddInputChange}
                  className="input input-bordered w-full focus:input-primary font-mono"
                  placeholder="AL, ML, SL"
                  required
                />
                <div className="text-xs text-slate-500">
                  Short code used in reports and systems
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  name="description"
                  value={addForm.description || ''}
                  onChange={handleAddInputChange}
                  className="textarea textarea-bordered w-full focus:textarea-primary"
                  rows={3}
                  placeholder="Describe the purpose and usage of this leave type..."
                />
                <div className="text-xs text-slate-500">
                  Optional description to help users understand when to use this leave
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Configuration Card */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-6">
            <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCog className="text-primary" />
              Configuration
            </h4>
            
            {/* Global Scope Notice */}
            <div className="alert alert-info mb-6">
              <FaInfoCircle className="text-lg" />
              <div>
                <span className="font-medium">Global Leave Type</span>
                <div className="text-xs">
                  This leave type will be available to all companies in the system
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Max Days */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    checked={!!addForm.is_unlimited}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAddForm(prev => ({
                        ...prev,
                        is_unlimited: checked,
                        max_days: checked ? 0 : prev.max_days,
                        allocation_primary: checked ? 'IMMEDIATE' : prev.allocation_primary
                      }));
                    }}
                    className="checkbox checkbox-primary"
                  />
                  <div>
                    <span className="label-text font-medium">Unlimited Leave</span>
                    <div className="text-xs text-slate-500">
                      Employees can take this leave without day limits
                    </div>
                  </div>
                </label>
              </div>
              
              {/* Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Requirements</h5>
                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                    <input
                      type="checkbox"
                      name="requires_approval"
                      checked={!!addForm.requires_approval}
                      onChange={handleAddInputChange}
                      className="checkbox checkbox-primary mt-1"
                    />
                    <div>
                      <div className="font-medium">Requires Approval</div>
                      <div className="text-xs text-slate-500">
                        Leave requests need manager approval
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                    <input
                      type="checkbox"
                      name="requires_documentation"
                      checked={!!addForm.requires_documentation}
                      onChange={handleAddInputChange}
                      className="checkbox checkbox-primary mt-1"
                    />
                    <div>
                      <div className="font-medium">Requires Documentation</div>
                      <div className="text-xs text-slate-500">
                        Medical certificate or supporting documents required
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Status</h5>
                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={!!addForm.is_active}
                      onChange={handleAddInputChange}
                      className="checkbox checkbox-primary mt-1"
                    />
                    <div>
                      <div className="font-medium">Active</div>
                      <div className="text-xs text-slate-500">
                        Available for employees to use
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation & Eligibility Card - Only show if not unlimited */}
        {!addForm.is_unlimited && (
          <div className="card bg-base-100 shadow">
            <div className="card-body p-6">
              <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                Allocation & Eligibility
              </h4>
              
              <div className="space-y-6">
                {/* Allocation Method Selection */}
                <div className="space-y-4">
                  <h5 className="font-medium">Allocation Method</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'IMMEDIATE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="allocation_primary"
                            value="IMMEDIATE"
                            checked={addForm.allocation_primary === 'IMMEDIATE'}
                            onChange={handleAddInputChange}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">Immediate</div>
                            <div className="text-xs text-slate-500">
                              Fixed days allocation
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'YEAR_OF_SERVICE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="allocation_primary"
                            value="YEAR_OF_SERVICE"
                            checked={addForm.allocation_primary === 'YEAR_OF_SERVICE'}
                            onChange={handleAddInputChange}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">Year of Service</div>
                            <div className="text-xs text-slate-500">
                              Days based on years worked
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`card cursor-pointer border-2 ${addForm.allocation_primary === 'EARN' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="allocation_primary"
                            value="EARN"
                            checked={addForm.allocation_primary === 'EARN'}
                            onChange={handleAddInputChange}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">Accrual (Earn)</div>
                            <div className="text-xs text-slate-500">
                              Days earned over time
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Max Days for Immediate Allocation */}
                {addForm.allocation_primary === 'IMMEDIATE' && (
                  <div className="border rounded-lg p-4 bg-base-50">
                    <h6 className="font-medium mb-4">Days Allocation</h6>
                    <div className="space-y-2">
                      <label className="label">
                        <span className="label-text font-medium">Total Days</span>
                      </label>
                      <input
                        type="number"
                        name="max_days"
                        value={addForm.max_days || 0}
                        onChange={handleAddInputChange}
                        className="input input-bordered w-full focus:input-primary"
                        min="0"
                        step="0.5"
                        placeholder="e.g., 14, 21, 30"
                      />
                      <div className="text-xs text-slate-500">
                        Total days available for this leave type
                      </div>
                    </div>
                  </div>
                )}

                {/* Year of Service Configuration */}
                {addForm.allocation_primary === 'YEAR_OF_SERVICE' && (
                  <div className="border rounded-lg p-4 bg-base-50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h6 className="font-medium">Year of Service Brackets</h6>
                        <div className="text-xs text-slate-500">
                          Define entitlement based on employee's years of service
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addYosRow}
                        className="btn btn-primary btn-sm"
                      >
                        <FaPlus className="mr-1" />
                        Add Bracket
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(addForm.yos_brackets || []).map((bracket, index) => (
                        <div key={index} className="border rounded p-4 bg-white">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium">Bracket {index + 1}</h6>
                            <button
                              type="button"
                              onClick={() => removeYosRow(index)}
                              className="btn btn-xs btn-error"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Min Years</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={bracket.min_years}
                                onChange={(e) => updateYosBracket(index, 'min_years', parseInt(e.target.value) || 0)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Max Years</span>
                                <span className="label-text-alt">(blank for ∞)</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={bracket.max_years || ''}
                                onChange={(e) => updateYosBracket(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
                                className="input input-bordered w-full"
                                placeholder="∞"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Days Allocation</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={bracket.days}
                                onChange={(e) => updateYosBracket(index, 'days', parseFloat(e.target.value) || 0)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Renewal Period</span>
                              </label>
                              <select
                                value={bracket.renewal_period || 'YEARLY'}
                                onChange={(e) => updateYosBracket(index, 'renewal_period', e.target.value)}
                                className="select select-bordered w-full"
                              >
                                <option value="YEARLY">Yearly</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="NONE">No automatic renewal</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Max Carryover Days</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={bracket.carryover_max_days || 0}
                                onChange={(e) => updateYosBracket(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
                                className="input input-bordered w-full"
                                disabled={bracket.expire_unused_at_period_end}
                              />
                            </div>
                          </div>
                          
                          {/* NEW: Prorate per Bracket - Standardized with Accrual */}
                          <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label className="label">
                                  <span className="label-text">New Joiner Prorate</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!bracket.prorate_first_year}
                                    onChange={(e) => updateYosBracket(index, 'prorate_first_year', e.target.checked)}
                                    className="checkbox checkbox-primary"
                                  />
                                  <div>
                                    <span className="label-text">Prorate based on join date</span>
                                    <div className="text-xs text-slate-500">
                                      Prorate for employees joining mid-year
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                            <input
                              type="checkbox"
                              checked={!!bracket.expire_unused_at_period_end}
                              onChange={(e) => {
                                updateYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
                                if (e.target.checked) {
                                  updateYosBracket(index, 'carryover_max_days', 0);
                                }
                              }}
                              className="checkbox checkbox-primary"
                            />
                            <div>
                              <div className="font-medium">Use-it-or-lose-it</div>
                              <div className="text-xs text-slate-500">
                                No carryover allowed, unused days expire
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                      
                      {(addForm.yos_brackets || []).length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <FaCalendarAlt className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-500">
                            No brackets configured. Add your first bracket to define year-of-service rules.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accrual Configuration */}
                {addForm.allocation_primary === 'EARN' && (
                  <div className="border rounded-lg p-4 bg-base-50">
                    <h6 className="font-medium mb-4">Accrual Settings</h6>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Accrual Frequency</span>
                        </label>
                        <select
                          name="accrual_frequency"
                          value={addForm.accrual_frequency || 'MONTHLY'}
                          onChange={handleAddInputChange}
                          className="select select-bordered w-full"
                        >
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="YEARLY">Yearly</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">
                            {addForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
                              addForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
                          </span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          name="accrual_rate"
                          value={addForm.accrual_rate || 0}
                          onChange={handleAddInputChange}
                          className="input input-bordered w-full"
                          placeholder="e.g., 1.25, 2.5"
                        />
                      </div>
                      
                      {/* Standardized Prorate Checkbox */}
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">New Joiner Prorate</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="earn_prorate_join_month"
                            checked={!!addForm.earn_prorate_join_month}
                            onChange={handleAddInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <div>
                            <span className="label-text">Prorate based on join date</span>
                            <div className="text-xs text-slate-500">
                              Prorate for employees joining mid-year
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {/* Max Days Cap for Earn Allocation */}
                    <div className="mt-6">
                      <h6 className="font-medium mb-2">Maximum Days Cap (Optional)</h6>
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Maximum Accumulated Days</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="max_days"
                          value={addForm.max_days || 0}
                          onChange={handleAddInputChange}
                          className="input input-bordered w-full"
                          placeholder="0 for no limit"
                        />
                        <div className="text-xs text-slate-500">
                          Maximum total days that can be accumulated (0 = no limit)
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Renewal Period</span>
                        </label>
                        <select
                          name="renewal_period"
                          value={addForm.renewal_period || 'YEARLY'}
                          onChange={handleAddInputChange}
                          className="select select-bordered w-full"
                        >
                          <option value="YEARLY">Yearly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="NONE">No automatic renewal</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Max Carryover Days</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="carryover_max_days"
                          value={addForm.carryover_max_days || 0}
                          onChange={handleAddInputChange}
                          className="input input-bordered w-full"
                          disabled={addForm.expire_unused_at_period_end}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                        <input
                          type="checkbox"
                          name="expire_unused_at_period_end"
                          checked={!!addForm.expire_unused_at_period_end}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setAddForm(prev => ({
                              ...prev,
                              expire_unused_at_period_end: checked,
                              carryover_max_days: checked ? 0 : prev.carryover_max_days
                            }));
                          }}
                          className="checkbox checkbox-primary"
                        />
                        <div>
                          <div className="font-medium">Use-it-or-lose-it</div>
                          <div className="text-xs text-slate-500">
                            No carryover allowed, unused days expire at period end
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Eligibility Scope */}
                <div className="space-y-2">
                  <label className="label">
                    <span className="label-text font-medium">Eligibility Scope</span>
                  </label>
                  <select
                    name="eligibility_scope"
                    value={addForm.eligibility_scope || 'ALL_STAFF'}
                    onChange={handleAddInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="ALL_STAFF">All Staff</option>
                    <option value="UPON_CONFIRM">Upon Confirmation</option>
                    <option value="UNDER_PROBATION">Under Probation</option>
                    <option value="UPON_JOIN">Upon Joining</option>
                  </select>
                  <div className="text-xs text-slate-500">
                    Determines which employees are eligible for this leave type
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-action">
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FaCheck className="mr-2" />
            Create Leave Type
          </button>
        </div>
      </form>
    </div>
    <div className="modal-backdrop" onClick={() => setShowAddModal(false)}></div>
  </div>
)}

{/* Edit Leave Type Modal */}
{showEditModal && selectedLeaveType && (
  <div className="modal modal-open">
    <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-xl">Edit Leave Type</h3>
          <p className="text-sm text-slate-500 mt-1">
            Editing: <span className="font-medium">{selectedLeaveType.leave_type_name}</span> ({selectedLeaveType.code})
          </p>
        </div>
        <button
          onClick={() => setShowEditModal(false)}
          className="btn btn-sm btn-circle btn-ghost"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleEditSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-6">
            <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
              <FaTag className="text-primary" />
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Leave Type Name</span>
                  <span className="label-text-alt text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="leave_type_name"
                  value={editForm.leave_type_name || ''}
                  onChange={handleEditInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Annual Leave, Medical Leave"
                  required
                />
                <div className="text-xs text-slate-500">
                  Display name for this leave type
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Code</span>
                  <span className="label-text-alt text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={editForm.code || ''}
                  onChange={handleEditInputChange}
                  className="input input-bordered w-full focus:input-primary font-mono"
                  placeholder="AL, ML, SL"
                  required
                />
                <div className="text-xs text-slate-500">
                  Short code used in reports and systems
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  name="description"
                  value={editForm.description || ''}
                  onChange={handleEditInputChange}
                  className="textarea textarea-bordered w-full focus:textarea-primary"
                  rows={3}
                  placeholder="Describe the purpose and usage of this leave type..."
                />
                <div className="text-xs text-slate-500">
                  Optional description to help users understand when to use this leave
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Configuration Card */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-6">
            <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCog className="text-primary" />
              Configuration
            </h4>
            
            {/* Scope Information */}
            <div className={`alert mb-6 ${selectedLeaveType.company_id && selectedLeaveType.company_id !== '0' ? 'alert-warning' : 'alert-info'}`}>
              <FaInfoCircle className="text-lg" />
              <div>
                <span className="font-medium">
                  {selectedLeaveType.company_id && selectedLeaveType.company_id !== '0' 
                    ? 'Company-Specific Leave Type' 
                    : 'Global Leave Type'}
                </span>
                <div className="text-xs">
                  {selectedLeaveType.company_id && selectedLeaveType.company_id !== '0'
                    ? `This leave type is assigned to a specific company and cannot be changed to global.`
                    : 'This leave type is available to all companies in the system.'}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Max Days */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    checked={!!editForm.is_unlimited}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEditForm(prev => ({
                        ...prev,
                        is_unlimited: checked,
                        max_days: checked ? 0 : prev.max_days || 14,
                        allocation_primary: checked ? 'IMMEDIATE' : (prev.allocation_primary || 'YEAR_OF_SERVICE'),
                        ...(checked ? {
                          yos_brackets: [],
                          accrual_rate: 0,
                          renewal_period: 'YEARLY',
                          carryover_max_days: 0,
                          expire_unused_at_period_end: false
                        } : {})
                      }));
                    }}
                    className="checkbox checkbox-primary"
                  />
                  <div>
                    <span className="label-text font-medium">Unlimited Leave</span>
                    <div className="text-xs text-slate-500">
                      Employees can take this leave without day limits
                    </div>
                  </div>
                </label>
              </div>
              
              {/* Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Requirements</h5>
                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                    <input
                      type="checkbox"
                      name="requires_approval"
                      checked={!!editForm.requires_approval}
                      onChange={handleEditInputChange}
                      className="checkbox checkbox-primary mt-1"
                    />
                    <div>
                      <div className="font-medium">Requires Approval</div>
                      <div className="text-xs text-slate-500">
                        Leave requests need manager approval
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                    <input
                      type="checkbox"
                      name="requires_documentation"
                      checked={!!editForm.requires_documentation}
                      onChange={handleEditInputChange}
                      className="checkbox checkbox-primary mt-1"
                    />
                    <div>
                      <div className="font-medium">Requires Documentation</div>
                      <div className="text-xs text-slate-500">
                        Medical certificate or supporting documents required
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Status</h5>
                  <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={!!editForm.is_active}
                      onChange={handleEditInputChange}
                      className="checkbox checkbox-primary mt-1"
                    />
                    <div>
                      <div className="font-medium">Active</div>
                      <div className="text-xs text-slate-500">
                        Available for employees to use
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation & Eligibility Card - Only show if not unlimited */}
        {!editForm.is_unlimited && (
          <div key={editForm.is_unlimited ? 'limited' : 'unlimited'} className="card bg-base-100 shadow">
            <div className="card-body p-6">
              <h4 className="card-title text-lg font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                Allocation & Eligibility
              </h4>
              
              <div className="space-y-6">
                {/* Allocation Method Selection */}
                <div className="space-y-4">
                  <h5 className="font-medium">Allocation Method</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'IMMEDIATE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="allocation_primary"
                            value="IMMEDIATE"
                            checked={editForm.allocation_primary === 'IMMEDIATE'}
                            onChange={handleEditInputChange}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">Immediate</div>
                            <div className="text-xs text-slate-500">
                              Fixed days allocation
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'YEAR_OF_SERVICE' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="allocation_primary"
                            value="YEAR_OF_SERVICE"
                            checked={editForm.allocation_primary === 'YEAR_OF_SERVICE'}
                            onChange={handleEditInputChange}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">Year of Service</div>
                            <div className="text-xs text-slate-500">
                              Days based on years worked
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`card cursor-pointer border-2 ${editForm.allocation_primary === 'EARN' ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="allocation_primary"
                            value="EARN"
                            checked={editForm.allocation_primary === 'EARN'}
                            onChange={handleEditInputChange}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">Accrual (Earn)</div>
                            <div className="text-xs text-slate-500">
                              Days earned over time
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Max Days for Immediate Allocation */}
                {editForm.allocation_primary === 'IMMEDIATE' && (
                  <div className="border rounded-lg p-4 bg-base-50">
                    <h6 className="font-medium mb-4">Days Allocation</h6>
                    <div className="space-y-2">
                      <label className="label">
                        <span className="label-text font-medium">Total Days</span>
                      </label>
                      <input
                        type="number"
                        name="max_days"
                        value={editForm.max_days || 0}
                        onChange={handleEditInputChange}
                        className="input input-bordered w-full focus:input-primary"
                        min="0"
                        step="0.5"
                        placeholder="e.g., 14, 21, 30"
                      />
                      <div className="text-xs text-slate-500">
                        Total days available for this leave type
                      </div>
                    </div>
                  </div>
                )}

                {/* Year of Service Configuration */}
                {editForm.allocation_primary === 'YEAR_OF_SERVICE' && (
                  <div className="border rounded-lg p-4 bg-base-50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h6 className="font-medium">Year of Service Brackets</h6>
                        <div className="text-xs text-slate-500">
                          Define entitlement based on employee's years of service
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addEditYosRow}
                        className="btn btn-primary btn-sm"
                      >
                        <FaPlus className="mr-1" />
                        Add Bracket
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(editForm.yos_brackets || []).map((bracket, index) => (
                        <div key={index} className="border rounded p-4 bg-white">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium">Bracket {index + 1}</h6>
                            <button
                              type="button"
                              onClick={() => removeEditYosRow(index)}
                              className="btn btn-xs btn-error"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Min Years</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={bracket.min_years}
                                onChange={(e) => updateEditYosBracket(index, 'min_years', parseInt(e.target.value) || 0)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Max Years</span>
                                <span className="label-text-alt">(blank for ∞)</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={bracket.max_years || ''}
                                onChange={(e) => updateEditYosBracket(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
                                className="input input-bordered w-full"
                                placeholder="∞"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Days Allocation</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={bracket.days}
                                onChange={(e) => updateEditYosBracket(index, 'days', parseFloat(e.target.value) || 0)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Renewal Period</span>
                              </label>
                              <select
                                value={bracket.renewal_period || 'YEARLY'}
                                onChange={(e) => updateEditYosBracket(index, 'renewal_period', e.target.value)}
                                className="select select-bordered w-full"
                              >
                                <option value="YEARLY">Yearly</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="NONE">No automatic renewal</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="label">
                                <span className="label-text">Max Carryover Days</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={bracket.carryover_max_days || 0}
                                onChange={(e) => updateEditYosBracket(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
                                className="input input-bordered w-full"
                                disabled={bracket.expire_unused_at_period_end}
                              />
                            </div>
                          </div>
                          
                          {/* NEW: Prorate per Bracket - Standardized with Accrual */}
                          <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label className="label">
                                  <span className="label-text">New Joiner Prorate</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!bracket.prorate_first_year}
                                    onChange={(e) => updateEditYosBracket(index, 'prorate_first_year', e.target.checked)}
                                    className="checkbox checkbox-primary"
                                  />
                                  <div>
                                    <span className="label-text">Prorate based on join date</span>
                                    <div className="text-xs text-slate-500">
                                      Prorate for employees joining mid-year
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                            <input
                              type="checkbox"
                              checked={!!bracket.expire_unused_at_period_end}
                              onChange={(e) => {
                                updateEditYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
                                if (e.target.checked) {
                                  updateEditYosBracket(index, 'carryover_max_days', 0);
                                }
                              }}
                              className="checkbox checkbox-primary"
                            />
                            <div>
                              <div className="font-medium">Use-it-or-lose-it</div>
                              <div className="text-xs text-slate-500">
                                No carryover allowed, unused days expire
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                      
                      {(editForm.yos_brackets || []).length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <FaCalendarAlt className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-500">
                            No brackets configured. Add your first bracket to define year-of-service rules.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accrual Configuration */}
                {editForm.allocation_primary === 'EARN' && (
                  <div className="border rounded-lg p-4 bg-base-50">
                    <h6 className="font-medium mb-4">Accrual Settings</h6>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Accrual Frequency</span>
                        </label>
                        <select
                          name="accrual_frequency"
                          value={editForm.accrual_frequency || 'MONTHLY'}
                          onChange={handleEditInputChange}
                          className="select select-bordered w-full"
                        >
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="YEARLY">Yearly</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">
                            {editForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
                              editForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
                          </span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          name="accrual_rate"
                          value={editForm.accrual_rate || 0}
                          onChange={handleEditInputChange}
                          className="input input-bordered w-full"
                          placeholder="e.g., 1.25, 2.5"
                        />
                      </div>
                      
                      {/* Standardized Prorate Checkbox */}
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">New Joiner Prorate</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="earn_prorate_join_month"
                            checked={!!editForm.earn_prorate_join_month}
                            onChange={handleEditInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <div>
                            <span className="label-text">Prorate based on join date</span>
                            <div className="text-xs text-slate-500">
                              Prorate for employees joining mid-year
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {/* Max Days Cap for Earn Allocation */}
                    <div className="mt-6">
                      <h6 className="font-medium mb-2">Maximum Days Cap (Optional)</h6>
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Maximum Accumulated Days</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="max_days"
                          value={editForm.max_days || 0}
                          onChange={handleEditInputChange}
                          className="input input-bordered w-full"
                          placeholder="0 for no limit"
                        />
                        <div className="text-xs text-slate-500">
                          Maximum total days that can be accumulated (0 = no limit)
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Renewal Period</span>
                        </label>
                        <select
                          name="renewal_period"
                          value={editForm.renewal_period || 'YEARLY'}
                          onChange={handleEditInputChange}
                          className="select select-bordered w-full"
                        >
                          <option value="YEARLY">Yearly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="NONE">No automatic renewal</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="label">
                          <span className="label-text">Max Carryover Days</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          name="carryover_max_days"
                          value={editForm.carryover_max_days || 0}
                          onChange={handleEditInputChange}
                          className="input input-bordered w-full"
                          disabled={editForm.expire_unused_at_period_end}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-base-200 rounded">
                        <input
                          type="checkbox"
                          name="expire_unused_at_period_end"
                          checked={!!editForm.expire_unused_at_period_end}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setEditForm(prev => ({
                              ...prev,
                              expire_unused_at_period_end: checked,
                              carryover_max_days: checked ? 0 : prev.carryover_max_days
                            }));
                          }}
                          className="checkbox checkbox-primary"
                        />
                        <div>
                          <div className="font-medium">Use-it-or-lose-it</div>
                          <div className="text-xs text-slate-500">
                            No carryover allowed, unused days expire at period end
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Eligibility Scope */}
                <div className="space-y-2">
                  <label className="label">
                    <span className="label-text font-medium">Eligibility Scope</span>
                  </label>
                  <select
                    name="eligibility_scope"
                    value={editForm.eligibility_scope || 'ALL_STAFF'}
                    onChange={handleEditInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="ALL_STAFF">All Staff</option>
                    <option value="UPON_CONFIRM">Upon Confirmation</option>
                    <option value="UNDER_PROBATION">Under Probation</option>
                    <option value="UPON_JOIN">Upon Joining</option>
                  </select>
                  <div className="text-xs text-slate-500">
                    Determines which employees are eligible for this leave type
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-action">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FaCheck className="mr-2" />
            Update Leave Type
          </button>
        </div>
      </form>
    </div>
    <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
  </div>
)}
    </div>
  );
};

export default LeaveTypesManagement;
