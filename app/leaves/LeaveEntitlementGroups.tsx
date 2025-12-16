// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { useTheme } from '../components/ThemeProvider';
// import { useNotification } from '../hooks/useNotification';
// import { 
//   FaUsers, FaPlus, FaEdit, FaTrash, FaUserPlus, FaList, 
//   FaCalendarAlt, FaTag, FaCog, FaLayerGroup 
// } from 'react-icons/fa';

// // Import types
// import { 
//   LeaveEntitlementGroup, 
//   YearOfServiceBracket,
//   LeaveGroupEntitlement 
// } from './leave';

// // Import the EmployeeBulkAssignment component
// import EmployeeBulkAssignment from './EmployeeBulkAssignment';

// // Import Leave Types Management Component
// import LeaveTypesManagement from './LeaveTypesManagement';

// const LeaveEntitlementGroups = () => {
//   const { theme } = useTheme();
//   const { showNotification } = useNotification();
//   const [activeTab, setActiveTab] = useState('groups'); // 'groups', 'types', 'assignments'
//   const [groups, setGroups] = useState<LeaveEntitlementGroup[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [showEntitlementModal, setShowEntitlementModal] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState<LeaveEntitlementGroup | null>(null);
//   const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  
//   // Form states
//   const [groupForm, setGroupForm] = useState({
//     group_name: '',
//     description: '',
//     is_active: true
//   });
  
//   const [entitlementForm, setEntitlementForm] = useState({
//     leave_type_id: '',
//     yos_brackets: [] as YearOfServiceBracket[]
//   });
  
//   // Fetch all groups
//   const fetchGroups1612 = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setGroups(response.data);
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//       showNotification('Error loading entitlement groups', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all groups
// const fetchGroups = async () => {
//   try {
//     setLoading(true);
//     const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//       }
//     });
    
//     // Extract groups from the response object
//     const data = response.data;
//     const groupsArray = data.groups || data; // Support both old and new response formats
    
//     setGroups(groupsArray);
//   } catch (error) {
//     console.error('Error fetching groups:', error);
//     showNotification('Error loading entitlement groups', 'error');
//   } finally {
//     setLoading(false);
//   }
// };
  
//   // Fetch available leave types
//   const fetchLeaveTypes = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
//       setLeaveTypes(response.data);
//     } catch (error) {
//       console.error('Error fetching leave types:', error);
//     }
//   };
  
//   useEffect(() => {
//     if (activeTab === 'groups') {
//       fetchGroups();
//     }
//     if (activeTab === 'assignments') {
//       fetchLeaveTypes();
//     }
//   }, [activeTab]);
  
//   // Create new group
//   const handleCreateGroup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_BASE_URL}/api/leave-entitlement-groups`, groupForm, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       setShowCreateModal(false);
//       setGroupForm({ group_name: '', description: '', is_active: true });
//       fetchGroups();
//       showNotification('Leave entitlement group created successfully', 'success');
//     } catch (error: any) {
//       console.error('Error creating group:', error);
//       showNotification(error.response?.data?.error || 'Error creating group', 'error');
//     }
//   };
  
//   // Add leave type entitlement to group
//   const handleAddEntitlement = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedGroup) return;
    
//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/leave-entitlement-groups/${selectedGroup.id}/entitlements`,
//         entitlementForm,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         }
//       );
      
//       setShowEntitlementModal(false);
//       setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
//       fetchGroups(); // Refresh to show updated entitlements
//       showNotification('Leave entitlement added to group', 'success');
//     } catch (error: any) {
//       console.error('Error adding entitlement:', error);
//       showNotification(error.response?.data?.error || 'Error adding entitlement', 'error');
//     }
//   };
  
//   // Delete group
//   const handleDeleteGroup = async (groupId: number) => {
//     if (!confirm('Are you sure you want to delete this group? This will remove all employee assignments.')) {
//       return;
//     }
    
//     try {
//       await axios.delete(`${API_BASE_URL}/api/leave-entitlement-groups/${groupId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         }
//       });
      
//       fetchGroups();
//       showNotification('Group deleted successfully', 'success');
//     } catch (error: any) {
//       console.error('Error deleting group:', error);
//       showNotification(error.response?.data?.error || 'Error deleting group', 'error');
//     }
//   };
  
//   // Add YOS bracket to entitlement form
//   const addYosBracket = () => {
//     setEntitlementForm(prev => ({
//       ...prev,
//       yos_brackets: [
//         ...prev.yos_brackets,
//         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
//       ]
//     }));
//   };
  
//   // Update YOS bracket
//   const updateYosBracket = (index: number, field: string, value: any) => {
//     setEntitlementForm(prev => {
//       const updated = [...prev.yos_brackets];
//       updated[index] = { ...updated[index], [field]: value };
//       return { ...prev, yos_brackets: updated };
//     });
//   };
  
//   // Remove YOS bracket
//   const removeYosBracket = (index: number) => {
//     setEntitlementForm(prev => ({
//       ...prev,
//       yos_brackets: prev.yos_brackets.filter((_, i) => i !== index)
//     }));
//   };
  
//   // Get YOS brackets from selected leave type
//   const loadLeaveTypeYosBrackets = async (leaveTypeId: string) => {
//     if (!leaveTypeId) return;
    
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/v1/leave-types/${leaveTypeId}/yos-brackets`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         }
//       );
      
//       if (response.data.length > 0) {
//         // Pre-populate with leave type's default brackets
//         setEntitlementForm(prev => ({
//           ...prev,
//           yos_brackets: response.data.map((bracket: any) => ({
//             min_years: bracket.min_years,
//             max_years: bracket.max_years,
//             days: bracket.days,
//             renewal_period: bracket.renewal_period || 'YEARLY',
//             carryover_max_days: bracket.carryover_max_days || 0,
//             expire_unused_at_period_end: !!bracket.expire_unused_at_period_end
//           }))
//         }));
//       } else {
//         // Start with one empty bracket
//         setEntitlementForm(prev => ({
//           ...prev,
//           yos_brackets: [{ min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }]
//         }));
//       }
//     } catch (error) {
//       console.error('Error loading YOS brackets:', error);
//       // Start with one empty bracket
//       setEntitlementForm(prev => ({
//         ...prev,
//         yos_brackets: [{ min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }]
//       }));
//     }
//   };
  
//   // Tab navigation
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'types':
//         return <LeaveTypesManagement />;
        
//       case 'assignments':
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-bold">Bulk Employee Assignments</h3>
//               <button
//                 onClick={() => setShowAssignModal(true)}
//                 className="btn btn-primary"
//                 disabled={groups.length === 0}
//               >
//                 <FaUserPlus className="mr-2" />
//                 Assign Employees
//               </button>
//             </div>
            
//             {groups.length === 0 ? (
//               <div className="alert alert-warning">
//                 <FaUsers className="h-6 w-6" />
//                 <div>
//                   <h3 className="font-bold">No Groups Available</h3>
//                   <div className="text-sm">Create entitlement groups first to assign employees</div>
//                 </div>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="table w-full">
//                   <thead>
//                     <tr>
//                       <th>Group Name</th>
//                       <th>Description</th>
//                       <th>Employees Assigned</th>
//                       <th>Leave Types</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {groups.map(group => (
//                       <tr key={group.id}>
//                         <td className="font-medium">{group.group_name}</td>
//                         <td>{group.description || '-'}</td>
//                         <td>
//                           <span className="badge badge-info">
//                             {group.employee_count || 0} employees
//                           </span>
//                         </td>
//                         <td>
//                           {group.leave_types && group.leave_types.length > 0 ? (
//                             <div className="flex flex-wrap gap-1">
//                               {group.leave_types.slice(0, 3).map(entitlement => (
//                                 <span key={entitlement.id} className="badge badge-outline">
//                                   {entitlement.leave_type_name}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             <span className="text-slate-500">No entitlements</span>
//                           )}
//                         </td>
//                         <td>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => {
//                                 setSelectedGroup(group);
//                                 setShowAssignModal(true);
//                               }}
//                               className="btn btn-xs btn-primary"
//                             >
//                               Assign Employees
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setSelectedGroup(group);
//                                 setShowEntitlementModal(true);
//                               }}
//                               className="btn btn-xs btn-secondary"
//                             >
//                               Add Entitlement
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         );
        
//       default: // 'groups'
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-bold">Leave Entitlement Groups</h3>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="btn btn-primary"
//               >
//                 <FaPlus className="mr-2" />
//                 Create Group1
//               </button>
//             </div>
            
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <span className="loading loading-spinner loading-lg"></span>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="table w-full">
//                   <thead>
//                     <tr>
//                       <th>Group Name</th>
//                       <th>Description</th>
//                       <th>Employees</th>
//                       <th>Leave Types</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {groups.map(group => (
//                       <tr key={group.id}>
//                         <td className="font-medium">{group.group_name}</td>
//                         <td>{group.description || '-'}</td>
//                         <td>
//                           <span className="badge badge-info">
//                             {group.employee_count || 0} employees
//                           </span>
//                         </td>
//                         <td>
//                           {group.leave_types && group.leave_types.length > 0 ? (
//                             <div className="flex flex-wrap gap-1">
//                               {group.leave_types.slice(0, 3).map(entitlement => (
//                                 <span key={entitlement.id} className="badge badge-outline">
//                                   {entitlement.leave_type_name}
//                                 </span>
//                               ))}
//                               {group.leave_types.length > 3 && (
//                                 <span className="badge">+{group.leave_types.length - 3}</span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-slate-500">No entitlements</span>
//                           )}
//                         </td>
//                         <td>
//                           <span className={`badge ${group.is_active ? 'badge-success' : 'badge-error'}`}>
//                             {group.is_active ? 'Active' : 'Inactive'}
//                           </span>
//                         </td>
//                         <td>
//                           <div className="flex flex-wrap gap-2">
//                             <button
//                               onClick={() => {
//                                 setSelectedGroup(group);
//                                 setShowAssignModal(true);
//                               }}
//                               className="btn btn-xs btn-primary flex items-center gap-1"
//                               title="Assign Employees"
//                             >
//                               <FaUserPlus />
//                               Assign
//                             </button>
                            
//                             <button
//                               onClick={() => {
//                                 setSelectedGroup(group);
//                                 setShowEntitlementModal(true);
//                               }}
//                               className="btn btn-xs btn-secondary flex items-center gap-1"
//                               title="Add Leave Entitlement"
//                             >
//                               <FaPlus />
//                               Add Entitlement
//                             </button>
                            
//                             <button
//                               onClick={() => handleDeleteGroup(group.id)}
//                               className="btn btn-xs btn-error flex items-center gap-1"
//                               title="Delete Group"
//                             >
//                               <FaTrash />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
                    
//                     {groups.length === 0 && (
//                       <tr>
//                         <td colSpan={6} className="text-center py-8">
//                           <div className="flex flex-col items-center justify-center gap-2">
//                             <FaUsers className="h-12 w-12 text-slate-400" />
//                             <p className="text-lg text-slate-600">
//                               No entitlement groups created yet
//                             </p>
//                             <p className="text-sm text-slate-500">
//                               Create your first group to start assigning leave entitlements in bulk
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         );
//     }
//   };
  
//   return (
//     <div className={`container mx-auto p-4 sm:p-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg`}>
//       {/* Header with Tabs */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//           <div>
//             <h2 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
//               <FaLayerGroup className="h-6 w-6 text-blue-500" />
//               Leave Entitlement Management
//             </h2>
//             <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//               Manage leave types, entitlement groups, and bulk employee assignments
//             </p>
//           </div>
//         </div>
        
//         {/* Tabs Navigation */}
//         <div className="tabs tabs-boxed bg-base-200 p-1">
//           <button
//             className={`tab tab-lg ${activeTab === 'groups' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('groups')}
//           >
//             <FaUsers className="mr-2" />
//             Entitlement Groups
//           </button>
//           <button
//             className={`tab tab-lg ${activeTab === 'types' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('types')}
//           >
//             <FaTag className="mr-2" />
//             Leave Types
//           </button>
//           <button
//             className={`tab tab-lg ${activeTab === 'assignments' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('assignments')}
//           >
//             <FaUserPlus className="mr-2" />
//             Bulk Assignments
//           </button>
//         </div>
//       </div>
      
//       {/* Tab Content */}
//       {renderTabContent()}
      
//       {/* Create Group Modal */}
//       <dialog id="create_group_modal" className={`modal ${showCreateModal ? 'modal-open' : ''}`}>
//         <div className={`modal-box ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <h3 className="font-bold text-lg mb-4">Create Leave Entitlement Group</h3>
          
//           <form onSubmit={handleCreateGroup}>
//             <div className="space-y-4">
//               <div>
//                 <label className="label">
//                   <span className="label-text">Group Name</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={groupForm.group_name}
//                   onChange={(e) => setGroupForm({ ...groupForm, group_name: e.target.value })}
//                   className="input input-bordered w-full"
//                   placeholder="e.g., Senior Staff, Contract Employees"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="label">
//                   <span className="label-text">Description</span>
//                 </label>
//                 <textarea
//                   value={groupForm.description}
//                   onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
//                   className="textarea textarea-bordered w-full"
//                   rows={3}
//                   placeholder="Describe this group..."
//                 />
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={groupForm.is_active}
//                   onChange={(e) => setGroupForm({ ...groupForm, is_active: e.target.checked })}
//                   className="checkbox checkbox-primary"
//                 />
//                 <span className="label-text">Active</span>
//               </div>
//             </div>
            
//             <div className="modal-action">
//               <button
//                 type="button"
//                 onClick={() => setShowCreateModal(false)}
//                 className="btn btn-ghost"
//               >
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary">
//                 Create Group
//               </button>
//             </div>
//           </form>
//         </div>
        
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setShowCreateModal(false)}>close</button>
//         </form>
//       </dialog>
      
//       {/* Assign Employees Modal */}
//       <dialog id="assign_employees_modal" className={`modal ${showAssignModal ? 'modal-open' : ''}`}>
//         <div className={`modal-box w-11/12 max-w-5xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <h3 className="font-bold text-lg mb-4">
//             {selectedGroup ? `Assign Employees to ${selectedGroup.group_name}` : 'Assign Employees'}
//           </h3>
          
//           {selectedGroup && (
//             <EmployeeBulkAssignment 
//               groupId={selectedGroup.id}
//               onClose={() => setShowAssignModal(false)}
//               onSuccess={() => {
//                 setShowAssignModal(false);
//                 fetchGroups();
//               }}
//             />
//           )}
//         </div>
        
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => setShowAssignModal(false)}>close</button>
//         </form>
//       </dialog>
      
//       {/* Add Leave Entitlement Modal */}
//       <dialog id="add_entitlement_modal" className={`modal ${showEntitlementModal ? 'modal-open' : ''}`}>
//         <div className={`modal-box w-11/12 max-w-4xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//           <h3 className="font-bold text-lg mb-4">
//             Add Leave Entitlement to {selectedGroup?.group_name}
//           </h3>
          
//           <form onSubmit={handleAddEntitlement}>
//             <div className="space-y-6">
//               {/* Leave Type Selection */}
//               <div>
//                 <label className="label">
//                   <span className="label-text">Select Leave Type</span>
//                 </label>
//                 <select
//                   value={entitlementForm.leave_type_id}
//                   onChange={(e) => {
//                     setEntitlementForm({ ...entitlementForm, leave_type_id: e.target.value });
//                     loadLeaveTypeYosBrackets(e.target.value);
//                   }}
//                   className="select select-bordered w-full"
//                   required
//                 >
//                   <option value="">Choose a leave type</option>
//                   {leaveTypes
//                     .filter((lt: any) => lt.is_active)
//                     .map((leaveType: any) => (
//                       <option key={leaveType.id} value={leaveType.id}>
//                         {leaveType.leave_type_name} ({leaveType.code})
//                       </option>
//                     ))
//                   }
//                 </select>
//               </div>
              
//               {/* YOS Brackets Configuration */}
//               {entitlementForm.leave_type_id && (
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <label className="label">
//                       <span className="label-text font-semibold">Year of Service Brackets</span>
//                       <span className="label-text-alt">Customize for this group</span>
//                     </label>
//                     <button
//                       type="button"
//                       onClick={addYosBracket}
//                       className="btn btn-xs btn-primary"
//                     >
//                       Add Bracket
//                     </button>
//                   </div>
                  
//                   <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                     {entitlementForm.yos_brackets.map((bracket, index) => (
//                       <div key={index} className={`p-4 rounded-lg border ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'}`}>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                           <div>
//                             <label className="label">
//                               <span className="label-text">Min Years</span>
//                             </label>
//                             <input
//                               type="number"
//                               min="0"
//                               value={bracket.min_years}
//                               onChange={(e) => updateYosBracket(index, 'min_years', parseInt(e.target.value) || 0)}
//                               className="input input-bordered w-full"
//                               required
//                             />
//                           </div>
                          
//                           <div>
//                             <label className="label">
//                               <span className="label-text">Max Years (blank for ∞)</span>
//                             </label>
//                             <input
//                               type="number"
//                               min="0"
//                               value={bracket.max_years || ''}
//                               onChange={(e) => updateYosBracket(index, 'max_years', e.target.value ? parseInt(e.target.value) : null)}
//                               className="input input-bordered w-full"
//                               placeholder="∞"
//                             />
//                           </div>
                          
//                           <div>
//                             <label className="label">
//                               <span className="label-text">Days Allocation</span>
//                             </label>
//                             <input
//                               type="number"
//                               min="0"
//                               step="0.5"
//                               value={bracket.days}
//                               onChange={(e) => updateYosBracket(index, 'days', parseFloat(e.target.value) || 0)}
//                               className="input input-bordered w-full"
//                               required
//                             />
//                           </div>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                           <div>
//                             <label className="label">
//                               <span className="label-text">Renewal Period</span>
//                             </label>
//                             <select
//                               value={bracket.renewal_period || 'YEARLY'}
//                               onChange={(e) => updateYosBracket(index, 'renewal_period', e.target.value)}
//                               className="select select-bordered w-full"
//                             >
//                               <option value="YEARLY">Yearly</option>
//                               <option value="QUARTERLY">Quarterly</option>
//                               <option value="MONTHLY">Monthly</option>
//                               <option value="NONE">No automatic renewal</option>
//                             </select>
//                           </div>
                          
//                           <div>
//                             <label className="label">
//                               <span className="label-text">Max Carryover Days</span>
//                             </label>
//                             <input
//                               type="number"
//                               min="0"
//                               value={bracket.carryover_max_days || 0}
//                               onChange={(e) => updateYosBracket(index, 'carryover_max_days', parseInt(e.target.value) || 0)}
//                               className="input input-bordered w-full"
//                               disabled={bracket.expire_unused_at_period_end}
//                             />
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center justify-between">
//                           <label className="flex items-center gap-2">
//                             <input
//                               type="checkbox"
//                               checked={!!bracket.expire_unused_at_period_end}
//                               onChange={(e) => {
//                                 updateYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
//                                 if (e.target.checked) {
//                                   updateYosBracket(index, 'carryover_max_days', 0);
//                                 }
//                               }}
//                               className="checkbox checkbox-primary"
//                             />
//                             <span className="label-text">Use-it-or-lose-it (no carryover)</span>
//                           </label>
                          
//                           <button
//                             type="button"
//                             onClick={() => removeYosBracket(index)}
//                             className="btn btn-xs btn-error"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="modal-action">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowEntitlementModal(false);
//                   setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
//                 }}
//                 className="btn btn-ghost"
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit" 
//                 className="btn btn-primary"
//                 disabled={!entitlementForm.leave_type_id || entitlementForm.yos_brackets.length === 0}
//               >
//                 Add Entitlement
//               </button>
//             </div>
//           </form>
//         </div>
        
//         <form method="dialog" className="modal-backdrop">
//           <button onClick={() => {
//             setShowEntitlementModal(false);
//             setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
//           }}>close</button>
//         </form>
//       </dialog>
//     </div>
//   );
// };

// export default LeaveEntitlementGroups;

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useTheme } from '../components/ThemeProvider';
import { useNotification } from '../hooks/useNotification';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaUserPlus, FaList, 
  FaCalendarAlt, FaTag, FaCog, FaLayerGroup, FaSearch, FaTimes 
} from 'react-icons/fa';

// Import types
import { 
  LeaveEntitlementGroup, 
  YearOfServiceBracket,
  LeaveGroupEntitlement 
} from './leave';

// Import Leave Types Management Component
import LeaveTypesManagement from './LeaveTypesManagement';

interface AvailableEmployee {
  id: number;
  name: string;
  employee_code: string;
  employee_no?: string;
  department_name: string | null;
  department?: string;
  joined_date: string | null;
  current_group_id: number | null;
  assignment_id?: number | null;
  effective_date?: string | null;
  end_date?: string | null;
  is_assigned?: number;
}

interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface EmployeeBulkAssignmentProps {
  groupId: number;
  onClose: () => void;
  onSuccess: () => void;
}

// New EmployeeBulkAssignment component with paginated API calls
const EmployeeBulkAssignment: React.FC<EmployeeBulkAssignmentProps> = ({ 
  groupId, 
  onClose, 
  onSuccess 
}) => {
  const { theme } = useTheme();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState<AvailableEmployee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const itemsPerPage = 10;

  // Fetch employees with pagination
  const fetchEmployees = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${API_BASE_URL}/api/leave-entitlement-groups/employees/available`,
        {
          params: {
            groupId,
            page,
            limit: itemsPerPage,
            search: search || undefined
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }
      );
      
      const data = response.data;
      
      // Handle both response formats
      let employeesArray: AvailableEmployee[] = [];
      let paginationData: PaginationData = {
        current_page: page,
        per_page: itemsPerPage,
        total: 0,
        total_pages: 1
      };
      
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          employeesArray = data;
          paginationData.total = data.length;
          paginationData.total_pages = Math.ceil(data.length / itemsPerPage);
        } else if (data.employees && Array.isArray(data.employees)) {
          employeesArray = data.employees;
          
          if (data.pagination) {
            paginationData = {
              current_page: data.pagination.current_page || page,
              per_page: data.pagination.per_page || itemsPerPage,
              total: data.pagination.total || data.employees.length,
              total_pages: data.pagination.total_pages || Math.ceil(data.employees.length / itemsPerPage)
            };
          }
        }
      }
      
      setEmployees(employeesArray);
      setTotalPages(paginationData.total_pages);
      setTotalEmployees(paginationData.total);
      
      // Also fetch currently assigned employees to pre-select them
      if (page === 1) {
        await fetchAssignedEmployees(employeesArray);
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      showNotification(
        error.response?.data?.error || error.message || 'Error loading employees', 
        'error'
      );
      setEmployees([]);
      setTotalPages(1);
      setTotalEmployees(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch already assigned employees from this group
  const fetchAssignedEmployees = async (availableEmployees?: AvailableEmployee[]) => {
    try {
      // If we have employees data with is_assigned field, use that
      if (availableEmployees && availableEmployees.length > 0) {
        const assignedIds = availableEmployees
          .filter(emp => emp.is_assigned === 1)
          .map(emp => emp.id);
        setSelectedEmployees(assignedIds);
        return;
      }
      
      // Otherwise, try to fetch from assignments endpoint
      const response = await axios.get(
        `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        const assignedIds = response.data
          .map((assignment: any) => assignment.employee_id || assignment.employee?.id)
          .filter((id: number) => id);
        setSelectedEmployees(assignedIds);
      }
    } catch (error) {
      console.error('Error fetching assigned employees:', error);
      // If endpoint doesn't exist or fails, just don't pre-select
    }
  };

  useEffect(() => {
    // Add a small delay to prevent rapid API calls during typing
    const timer = setTimeout(() => {
      fetchEmployees(1, searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, groupId]);

  // Handle page change
  useEffect(() => {
    fetchEmployees(currentPage, searchTerm);
  }, [currentPage]);

  // Handle employee selection
  const handleEmployeeSelect = (employeeId: number) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Handle select all on current page
  const handleSelectAll = () => {
    const currentPageIds = employees.map(emp => emp.id);
    const allSelected = currentPageIds.every(id => selectedEmployees.includes(id));
    
    if (allSelected) {
      // Deselect all on current page
      setSelectedEmployees(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      // Select all on current page
      const newSelected = [...selectedEmployees];
      currentPageIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelectedEmployees(newSelected);
    }
  };

  // Handle save assignments
  const handleSaveAssignments = async () => {
    try {
      setSaving(true);
      
      // Remove existing assignments first
      try {
        await axios.delete(
          `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
            }
          }
        );
      } catch (error) {
        // Ignore if endpoint doesn't exist or fails
        console.log('No existing assignments to remove or endpoint not found');
      }
      
      // Add new assignments
      if (selectedEmployees.length > 0) {
        await axios.post(
          `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign-employees`,
          { employee_ids: selectedEmployees },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
            }
          }
        );
      }
      
      showNotification('Employees assigned successfully', 'success');
      onSuccess();
    } catch (error: any) {
      console.error('Error assigning employees:', error);
      showNotification(
        error.response?.data?.error || 'Error assigning employees',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Reset search
  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-lg">Assign Employees to Group</h4>
        <button onClick={onClose} className="btn btn-ghost btn-sm">
          <FaTimes />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, employee code..."
            className="input input-bordered w-full pl-10"
          />
          {searchTerm && (
            <button
              onClick={resetSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <FaTimes className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
        <div className="text-sm text-slate-500 mt-2">
          Showing {employees.length} of {totalEmployees} employees
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>

      {/* Selected Employees Summary */}
      {selectedEmployees.length > 0 && (
        <div className="alert alert-info mb-6">
          <FaUsers className="h-5 w-5" />
          <div>
            <span className="font-medium">{selectedEmployees.length} employees selected</span>
            <div className="text-sm">
              {selectedEmployees.length} out of {totalEmployees} total employees
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          {/* Employees Table */}
          <div className="overflow-x-auto mb-6">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={employees.length > 0 && 
                        employees.every(emp => selectedEmployees.includes(emp.id))}
                      onChange={handleSelectAll}
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                  </th>
                  <th>Employee Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FaUsers className="h-12 w-12 text-slate-400" />
                        {searchTerm ? (
                          <>
                            <p className="text-lg text-slate-600">No employees found</p>
                            <p className="text-sm text-slate-500">
                              No employees match "{searchTerm}". Try a different search term.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg text-slate-600">No employees available</p>
                            <p className="text-sm text-slate-500">
                              All employees are already assigned or no employees exist in the system.
                            </p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map(employee => (
                    <tr key={employee.id} className="hover">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleEmployeeSelect(employee.id)}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                      </td>
                      <td className="font-mono text-sm">{employee.employee_code}</td>
                      <td>
                        <div className="font-medium">
                          {employee.name}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {employee.department_name || employee.department || 'Not specified'}
                        </span>
                      </td>
                      <td>{formatDate(employee.joined_date)}</td>
                      <td>
                        <span className={`badge ${employee.current_group_id ? 'badge-warning' : 'badge-success'}`}>
                          {employee.current_group_id ? 'Already in group' : 'Available'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-6">
              <div className="join">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="join-item btn btn-sm"
                >
                  «
                </button>
                <span className="join-item btn btn-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="join-item btn btn-sm"
                >
                  »
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="btn btn-ghost" disabled={saving}>
              Cancel
            </button>
            <button
              onClick={handleSaveAssignments}
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                `Save Assignments (${selectedEmployees.length})`
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Main LeaveEntitlementGroups component
const LeaveEntitlementGroups = () => {
  const { theme } = useTheme();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState<LeaveEntitlementGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEntitlementModal, setShowEntitlementModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<LeaveEntitlementGroup | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  
  // Form states
  const [groupForm, setGroupForm] = useState({
    group_name: '',
    description: '',
    is_active: true
  });
  
  const [entitlementForm, setEntitlementForm] = useState({
    leave_type_id: '',
    yos_brackets: [] as YearOfServiceBracket[]
  });
  
  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      // Extract groups from the response object
      const data = response.data;
      let groupsArray: LeaveEntitlementGroup[] = [];
      
      if (Array.isArray(data)) {
        groupsArray = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.groups)) {
          groupsArray = data.groups;
        } else if (Array.isArray(data.data)) {
          groupsArray = data.data;
        } else if (Array.isArray(data)) {
          groupsArray = data;
        }
      }
      
      setGroups(groupsArray);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      showNotification(
        error.response?.data?.error || error.message || 'Error loading entitlement groups', 
        'error'
      );
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch available leave types
  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      let leaveTypesArray: any[] = [];
      
      if (Array.isArray(response.data)) {
        leaveTypesArray = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        leaveTypesArray = response.data.data;
      }
      
      setLeaveTypes(leaveTypesArray);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      setLeaveTypes([]);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'groups' || activeTab === 'assignments') {
      fetchGroups();
    }
    if (activeTab === 'assignments') {
      fetchLeaveTypes();
    }
  }, [activeTab]);
  
  // Create new group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/leave-entitlement-groups`, groupForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      setShowCreateModal(false);
      setGroupForm({ group_name: '', description: '', is_active: true });
      fetchGroups();
      showNotification('Leave entitlement group created successfully', 'success');
    } catch (error: any) {
      console.error('Error creating group:', error);
      showNotification(error.response?.data?.error || 'Error creating group', 'error');
    }
  };
  
  // Add leave type entitlement to group
  const handleAddEntitlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;
    
    try {
      await axios.post(
        `${API_BASE_URL}/api/leave-entitlement-groups/${selectedGroup.id}/entitlements`,
        entitlementForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }
      );
      
      setShowEntitlementModal(false);
      setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
      fetchGroups();
      showNotification('Leave entitlement added to group', 'success');
    } catch (error: any) {
      console.error('Error adding entitlement:', error);
      showNotification(error.response?.data?.error || 'Error adding entitlement', 'error');
    }
  };
  
  // Delete group
  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm('Are you sure you want to delete this group? This will remove all employee assignments.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/api/leave-entitlement-groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      fetchGroups();
      showNotification('Group deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting group:', error);
      showNotification(error.response?.data?.error || 'Error deleting group', 'error');
    }
  };
  
  // Add YOS bracket to entitlement form
  const addYosBracket = () => {
    setEntitlementForm(prev => ({
      ...prev,
      yos_brackets: [
        ...prev.yos_brackets,
        { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0 }
      ]
    }));
  };
  
  // Update YOS bracket
  const updateYosBracket = (index: number, field: string, value: any) => {
    setEntitlementForm(prev => {
      const updated = [...prev.yos_brackets];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, yos_brackets: updated };
    });
  };
  
  // Remove YOS bracket
  const removeYosBracket = (index: number) => {
    setEntitlementForm(prev => ({
      ...prev,
      yos_brackets: prev.yos_brackets.filter((_, i) => i !== index)
    }));
  };
  
  // Tab navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case 'types':
        return <LeaveTypesManagement />;
        
      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Bulk Employee Assignments</h3>
              <button
                onClick={() => setShowAssignModal(true)}
                className="btn btn-primary"
                disabled={groups.length === 0}
              >
                <FaUserPlus className="mr-2" />
                Assign Employees
              </button>
            </div>
            
            {groups.length === 0 ? (
              <div className="alert alert-warning">
                <FaUsers className="h-6 w-6" />
                <div>
                  <h3 className="font-bold">No Groups Available</h3>
                  <div className="text-sm">Create entitlement groups first to assign employees</div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Group Name</th>
                      <th>Description</th>
                      <th>Employees Assigned</th>
                      <th>Leave Types</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map(group => (
                      <tr key={group.id}>
                        <td className="font-medium">{group.group_name}</td>
                        <td>{group.description || '-'}</td>
                        <td>
                          <span className="badge badge-info">
                            {group.employee_count || 0} employees
                          </span>
                        </td>
                        <td>
                          {group.leave_types && group.leave_types.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {group.leave_types.slice(0, 3).map((entitlement: any, index: number) => (
                                <span key={entitlement.id || index} className="badge badge-outline">
                                  {entitlement.leave_type_name || entitlement.name || 'Unknown'}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">No entitlements</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedGroup(group);
                                setShowAssignModal(true);
                              }}
                              className="btn btn-xs btn-primary"
                              disabled={!group.id}
                            >
                              Assign Employees
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Leave Entitlement Groups</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <FaPlus className="mr-2" />
                Create Group
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Group Name</th>
                      <th>Description</th>
                      <th>Employees</th>
                      <th>Leave Types</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map(group => (
                      <tr key={group.id}>
                        <td className="font-medium">{group.group_name}</td>
                        <td>{group.description || '-'}</td>
                        <td>
                          <span className="badge badge-info">
                            {group.employee_count || 0} employees
                          </span>
                        </td>
                        <td>
                          {group.leave_types && group.leave_types.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {group.leave_types.slice(0, 3).map((entitlement: any, index: number) => (
                                <span key={entitlement.id || index} className="badge badge-outline">
                                  {entitlement.leave_type_name || entitlement.name || 'Unknown'}
                                </span>
                              ))}
                              {group.leave_types.length > 3 && (
                                <span className="badge">+{group.leave_types.length - 3}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500">No entitlements</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${group.is_active ? 'badge-success' : 'badge-error'}`}>
                            {group.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setSelectedGroup(group);
                                setShowAssignModal(true);
                              }}
                              className="btn btn-xs btn-primary flex items-center gap-1"
                              title="Assign Employees"
                              disabled={!group.id}
                            >
                              <FaUserPlus />
                              Assign
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedGroup(group);
                                setShowEntitlementModal(true);
                              }}
                              className="btn btn-xs btn-secondary flex items-center gap-1"
                              title="Add Leave Entitlement"
                              disabled={!group.id}
                            >
                              <FaPlus />
                              Add Entitlement
                            </button>
                            
                            <button
                              onClick={() => handleDeleteGroup(group.id)}
                              className="btn btn-xs btn-error flex items-center gap-1"
                              title="Delete Group"
                              disabled={!group.id}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {groups.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FaUsers className="h-12 w-12 text-slate-400" />
                            <p className="text-lg text-slate-600">
                              No entitlement groups created yet
                            </p>
                            <p className="text-sm text-slate-500">
                              Create your first group to start assigning leave entitlements in bulk
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
    }
  };
  
  return (
    <div className={`container mx-auto p-4 sm:p-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg`}>
      {/* Header with Tabs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              <FaLayerGroup className="h-6 w-6 text-blue-500" />
              Leave Entitlement Management
            </h2>
            <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Manage leave types, entitlement groups, and bulk employee assignments
            </p>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="tabs tabs-boxed bg-base-200 p-1">
          <button
            className={`tab tab-lg ${activeTab === 'groups' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            <FaUsers className="mr-2" />
            Entitlement Groups
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'types' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('types')}
          >
            <FaTag className="mr-2" />
            Leave Types
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'assignments' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <FaUserPlus className="mr-2" />
            Bulk Assignments
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      {renderTabContent()}
      
      {/* Create Group Modal */}
      <dialog id="create_group_modal" className={`modal ${showCreateModal ? 'modal-open' : ''}`}>
        <div className={`modal-box ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <h3 className="font-bold text-lg mb-4">Create Leave Entitlement Group</h3>
          
          <form onSubmit={handleCreateGroup}>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Group Name</span>
                </label>
                <input
                  type="text"
                  value={groupForm.group_name}
                  onChange={(e) => setGroupForm({ ...groupForm, group_name: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="e.g., Senior Staff, Contract Employees"
                  required
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  placeholder="Describe this group..."
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={groupForm.is_active}
                  onChange={(e) => setGroupForm({ ...groupForm, is_active: e.target.checked })}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Active</span>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Group
              </button>
            </div>
          </form>
        </div>
        
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowCreateModal(false)}>close</button>
        </form>
      </dialog>
      
      {/* Assign Employees Modal */}
      <dialog id="assign_employees_modal" className={`modal ${showAssignModal ? 'modal-open' : ''}`}>
        <div className={`modal-box w-11/12 max-w-5xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <h3 className="font-bold text-lg mb-4">
            {selectedGroup ? `Assign Employees to ${selectedGroup.group_name}` : 'Assign Employees'}
          </h3>
          
          {selectedGroup && selectedGroup.id && (
            <EmployeeBulkAssignment 
              groupId={selectedGroup.id}
              onClose={() => setShowAssignModal(false)}
              onSuccess={() => {
                setShowAssignModal(false);
                fetchGroups();
              }}
            />
          )}
        </div>
        
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowAssignModal(false)}>close</button>
        </form>
      </dialog>
      
      {/* Add Leave Entitlement Modal */}
      <dialog id="add_entitlement_modal" className={`modal ${showEntitlementModal ? 'modal-open' : ''}`}>
        <div className={`modal-box w-11/12 max-w-4xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
          <h3 className="font-bold text-lg mb-4">
            Add Leave Entitlement to {selectedGroup?.group_name}
          </h3>
          
          <form onSubmit={handleAddEntitlement}>
            <div className="space-y-6">
              {/* Leave Type Selection */}
              <div>
                <label className="label">
                  <span className="label-text">Select Leave Type</span>
                </label>
                <select
                  value={entitlementForm.leave_type_id}
                  onChange={(e) => setEntitlementForm({ ...entitlementForm, leave_type_id: e.target.value })}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Choose a leave type</option>
                  {leaveTypes
                    .filter((lt: any) => lt.is_active !== false)
                    .map((leaveType: any) => (
                      <option key={leaveType.id} value={leaveType.id}>
                        {leaveType.leave_type_name || leaveType.name} ({leaveType.code || leaveType.leave_type_code || 'N/A'})
                      </option>
                    ))
                  }
                </select>
              </div>
              
              {/* YOS Brackets Configuration */}
              {entitlementForm.leave_type_id && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Year of Service Brackets</span>
                      <span className="label-text-alt">Customize for this group</span>
                    </label>
                    <button
                      type="button"
                      onClick={addYosBracket}
                      className="btn btn-xs btn-primary"
                    >
                      Add Bracket
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {entitlementForm.yos_brackets.map((bracket, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${theme === 'light' ? 'border-slate-200' : 'border-slate-600'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
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
                          
                          <div>
                            <label className="label">
                              <span className="label-text">Max Years (blank for ∞)</span>
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
                          
                          <div>
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
                          <div>
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
                          
                          <div>
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
                        
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2">
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
                            <span className="label-text">Use-it-or-lose-it (no carryover)</span>
                          </label>
                          
                          <button
                            type="button"
                            onClick={() => removeYosBracket(index)}
                            className="btn btn-xs btn-error"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-action">
              <button
                type="button"
                onClick={() => {
                  setShowEntitlementModal(false);
                  setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!entitlementForm.leave_type_id || entitlementForm.yos_brackets.length === 0}
              >
                Add Entitlement
              </button>
            </div>
          </form>
        </div>
        
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {
            setShowEntitlementModal(false);
            setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
          }}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default LeaveEntitlementGroups;
