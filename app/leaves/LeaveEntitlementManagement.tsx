// // 'use client';

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../config';
// // import { useTheme } from '../components/ThemeProvider';
// // import { useNotification } from '../hooks/useNotification';
// // import { 
// //   FaUsers, FaPlus, FaEdit, FaTrash, FaUserPlus, FaList, 
// //   FaCalendarAlt, FaTag, FaCog, FaLayerGroup, FaTable,
// //   FaSearch, FaCheck, FaTimes, FaEye, FaEyeSlash, FaCopy
// // } from 'react-icons/fa';

// // // Import the LeaveTypesManagement component
// // import LeaveTypesManagement from './LeaveTypesManagement';
// // import EmployeeBulkAssignment from './EmployeeBulkAssignment';

// // // Define interfaces
// // interface YearOfServiceBracket {
// //   min_years: number;
// //   max_years?: number | null;
// //   days: number;
// //   renewal_period?: string;
// //   carryover_max_days?: number;
// //   expire_unused_at_period_end?: boolean;
// // }

// // interface LeaveEntitlementGroup {
// //   id: number;
// //   group_name: string;
// //   description: string;
// //   is_active: boolean;
// //   employee_count?: number;
// //   leave_types?: LeaveGroupEntitlement[];
// //   created_at?: string;
// //   updated_at?: string;
// // }

// // interface LeaveGroupEntitlement {
// //   id: number;
// //   group_id: number;
// //   leave_type_id: number;
// //   leave_type_name: string;
// //   yos_brackets: YearOfServiceBracket[];
// // }

// // const LeaveEntitlementManagement = () => {
// //   const { theme } = useTheme();
// //   const { showNotification } = useNotification();
// //   const [activeTab, setActiveTab] = useState('leave-types'); // 'leave-types', 'groups', 'assignments'
// //   const [groups, setGroups] = useState<LeaveEntitlementGroup[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showCreateModal, setShowCreateModal] = useState(false);
// //   const [showAssignModal, setShowAssignModal] = useState(false);
// //   const [showEntitlementModal, setShowEntitlementModal] = useState(false);
// //   const [selectedGroup, setSelectedGroup] = useState<LeaveEntitlementGroup | null>(null);
// //   const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  
// //   // Form states
// //   const [groupForm, setGroupForm] = useState({
// //     group_name: '',
// //     description: '',
// //     is_active: true
// //   });
  
// //   const [entitlementForm, setEntitlementForm] = useState({
// //     leave_type_id: '',
// //     yos_brackets: [] as YearOfServiceBracket[]
// //   });
  
// //   // Fetch all groups
// //   const fetchGroups = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       setGroups(response.data);
// //     } catch (error) {
// //       console.error('Error fetching groups:', error);
// //       showNotification('Error loading entitlement groups', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   // Fetch available leave types
// //   const fetchLeaveTypes = async () => {
// //     try {
// //       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
// //       setLeaveTypes(response.data);
// //     } catch (error) {
// //       console.error('Error fetching leave types:', error);
// //     }
// //   };
  
// //   useEffect(() => {
// //     if (activeTab === 'groups' || activeTab === 'assignments') {
// //       fetchGroups();
// //     }
// //     if (activeTab === 'assignments') {
// //       fetchLeaveTypes();
// //     }
// //   }, [activeTab]);
  
// //   // Create new group
// //   const handleCreateGroup = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(`${API_BASE_URL}/api/leave-entitlement-groups`, groupForm, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       setShowCreateModal(false);
// //       setGroupForm({ group_name: '', description: '', is_active: true });
// //       fetchGroups();
// //       showNotification('Leave entitlement group created successfully', 'success');
// //     } catch (error: any) {
// //       console.error('Error creating group:', error);
// //       showNotification(error.response?.data?.error || 'Error creating group', 'error');
// //     }
// //   };
  

  
// //   // Delete group
// //   const handleDeleteGroup = async (groupId: number) => {
// //     if (!confirm('Are you sure you want to delete this group? This will remove all employee assignments.')) {
// //       return;
// //     }
    
// //     try {
// //       await axios.delete(`${API_BASE_URL}/api/leave-entitlement-groups/${groupId}`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       });
      
// //       fetchGroups();
// //       showNotification('Group deleted successfully', 'success');
// //     } catch (error: any) {
// //       console.error('Error deleting group:', error);
// //       showNotification(error.response?.data?.error || 'Error deleting group', 'error');
// //     }
// //   };
  
// //   // Toggle group active status
// //   const toggleGroupActive = async (groupId: number, currentStatus: boolean) => {
// //     try {
// //       await axios.put(
// //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/toggle-active`,
// //         { is_active: !currentStatus },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           }
// //         }
// //       );
      
// //       fetchGroups();
// //       showNotification(`Group ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
// //     } catch (error: any) {
// //       console.error('Error toggling group status:', error);
// //       showNotification(error.response?.data?.error || 'Error toggling group status', 'error');
// //     }
// //   };
  
// //   // Add YOS bracket to entitlement form
// //   const addYosBracket = () => {
// //     setEntitlementForm(prev => ({
// //       ...prev,
// //       yos_brackets: [
// //         ...prev.yos_brackets,
// //         { min_years: 0, days: 0, renewal_period: 'YEARLY', carryover_max_days: 0, expire_unused_at_period_end: false }
// //       ]
// //     }));
// //   };
  
// //   // Update YOS bracket
// //   const updateYosBracket = (index: number, field: string, value: any) => {
// //     setEntitlementForm(prev => {
// //       const updated = [...prev.yos_brackets];
// //       updated[index] = { ...updated[index], [field]: value };
// //       return { ...prev, yos_brackets: updated };
// //     });
// //   };
  
// //   // Remove YOS bracket
// //   const removeYosBracket = (index: number) => {
// //     setEntitlementForm(prev => ({
// //       ...prev,
// //       yos_brackets: prev.yos_brackets.filter((_, i) => i !== index)
// //     }));
// //   };
 
  
// //   // Add leave type entitlement to group
// // const handleAddEntitlement = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   if (!selectedGroup) return;
  
// //   try {
// //     // Prepare the data with proper types
// //     const requestData = {
// //       leave_type_id: parseInt(entitlementForm.leave_type_id),
// //       yos_brackets: entitlementForm.yos_brackets.map(bracket => {
// //         // Ensure all values are properly typed
// //         const processedBracket: any = {
// //           min_years: parseInt(String(bracket.min_years || 0)),
// //           days: parseFloat(String(bracket.days || 0)),
// //           renewal_period: bracket.renewal_period || 'YEARLY',
// //           carryover_max_days: parseInt(String(bracket.carryover_max_days || 0)),
// //           expire_unused_at_period_end: Boolean(bracket.expire_unused_at_period_end)
// //         };
        
// //         // Handle max_years (can be null for infinity)
// //         // FIXED: Compare with 0 instead of '' for empty number
// //         if (bracket.max_years !== undefined && bracket.max_years !== null && bracket.max_years !== 0) {
// //           processedBracket.max_years = parseInt(String(bracket.max_years));
// //         } else {
// //           processedBracket.max_years = null;
// //         }
        
// //         return processedBracket;
// //       })
// //     };
    
// //     console.log('Sending entitlement data:', JSON.stringify(requestData, null, 2));
    
// //     const response = await axios.post(
// //       `${API_BASE_URL}/api/leave-entitlement-groups/${selectedGroup.id}/entitlements`,
// //       requestData,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
// //           'Content-Type': 'application/json'
// //         }
// //       }
// //     );
    
// //     setShowEntitlementModal(false);
// //     setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
// //     fetchGroups(); // Refresh to show updated entitlements
// //     showNotification('Leave entitlement added to group', 'success');
// //   } catch (error: any) {
// //     console.error('Error adding entitlement:', error);
// //     console.error('Error response:', error.response?.data);
    
// //     // Show detailed error message
// //     const errorMessage = error.response?.data?.error || 
// //                         error.response?.data?.message || 
// //                         'Error adding entitlement';
// //     showNotification(errorMessage, 'error');
// //   }
// // };

// // // Get YOS brackets from selected leave type
// // const loadLeaveTypeYosBrackets = async (leaveTypeId: string) => {
// //   if (!leaveTypeId) return;
  
// //   try {
// //     const response = await axios.get(
// //       `${API_BASE_URL}/api/v1/leave-types/${leaveTypeId}/yos-brackets`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         }
// //       }
// //     );
    
// //     if (response.data && Array.isArray(response.data) && response.data.length > 0) {
// //       // Pre-populate with leave type's default brackets
// //       setEntitlementForm(prev => ({
// //         ...prev,
// //         yos_brackets: response.data.map((bracket: any) => ({
// //           min_years: parseInt(String(bracket.min_years || 0)),
// //           max_years: bracket.max_years ? parseInt(String(bracket.max_years)) : null,
// //           days: parseFloat(String(bracket.days || 0)),
// //           renewal_period: bracket.renewal_period || 'YEARLY',
// //           carryover_max_days: parseInt(String(bracket.carryover_max_days || 0)),
// //           expire_unused_at_period_end: Boolean(bracket.expire_unused_at_period_end)
// //         }))
// //       }));
// //     } else {
// //       // Start with one empty bracket
// //       setEntitlementForm(prev => ({
// //         ...prev,
// //         yos_brackets: [{ 
// //           min_years: 0, 
// //           max_years: null,
// //           days: 0, 
// //           renewal_period: 'YEARLY', 
// //           carryover_max_days: 0,
// //           expire_unused_at_period_end: false 
// //         }]
// //       }));
// //     }
// //   } catch (error) {
// //     console.error('Error loading YOS brackets:', error);
// //     // Start with one empty bracket
// //     setEntitlementForm(prev => ({
// //       ...prev,
// //       yos_brackets: [{ 
// //         min_years: 0, 
// //         max_years: null,
// //         days: 0, 
// //         renewal_period: 'YEARLY', 
// //         carryover_max_days: 0,
// //         expire_unused_at_period_end: false 
// //       }]
// //     }));
// //   }
// // };
  
// //   // Tab navigation
// //   const renderTabContent = () => {
// //     switch (activeTab) {
// //       case 'leave-types':
// //         return <LeaveTypesManagement />;
        
// //       case 'groups':
// //         return (
// //           <div className="space-y-6">
// //             <div className="flex justify-between items-center">
// //               <div>
// //                 <h3 className="text-xl font-bold">Leave Entitlement Groups</h3>
// //                 <p className="text-sm text-slate-500 mt-1">
// //                   Create groups and assign leave entitlements with custom YOS brackets
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => setShowCreateModal(true)}
// //                 className="btn btn-primary"
// //               >
// //                 <FaPlus className="mr-2" />
// //                 Create Group
// //               </button>
// //             </div>
            
// //             {loading ? (
// //               <div className="flex justify-center items-center h-64">
// //                 <span className="loading loading-spinner loading-lg"></span>
// //               </div>
// //             ) : (
// //               <div className="overflow-x-auto border rounded-lg">
// //                 <table className="table w-full">
// //                   <thead>
// //                     <tr>
// //                       <th>Group Name</th>
// //                       <th>Description</th>
// //                       <th>Employees</th>
// //                       <th>Leave Types</th>
// //                       <th>Status</th>
// //                       <th>Actions</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {groups.map(group => (
// //                       <tr key={group.id} className="hover">
// //                         <td className="font-medium">{group.group_name}</td>
// //                         <td>
// //                           <div className="max-w-xs truncate" title={group.description}>
// //                             {group.description || '-'}
// //                           </div>
// //                         </td>
// //                         <td>
// //                           <span className="badge badge-info">
// //                             {group.employee_count || 0} employees
// //                           </span>
// //                         </td>
// //                         <td>
// //                           {group.leave_types && group.leave_types.length > 0 ? (
// //                             <div className="flex flex-wrap gap-1">
// //                               {group.leave_types.slice(0, 3).map(entitlement => (
// //                                 <span key={entitlement.id} className="badge badge-outline">
// //                                   {entitlement.leave_type_name}
// //                                 </span>
// //                               ))}
// //                               {group.leave_types.length > 3 && (
// //                                 <span className="badge">+{group.leave_types.length - 3}</span>
// //                               )}
// //                             </div>
// //                           ) : (
// //                             <span className="text-slate-500">No entitlements</span>
// //                           )}
// //                         </td>
// //                         <td>
// //                           <div className="flex items-center gap-2">
// //                             <span className={`badge ${group.is_active ? 'badge-success' : 'badge-error'}`}>
// //                               {group.is_active ? 'Active' : 'Inactive'}
// //                             </span>
// //                             <button
// //                               onClick={() => toggleGroupActive(group.id, group.is_active)}
// //                               className="btn btn-xs btn-ghost"
// //                               title={group.is_active ? 'Deactivate' : 'Activate'}
// //                             >
// //                               {group.is_active ? <FaEyeSlash /> : <FaEye />}
// //                             </button>
// //                           </div>
// //                         </td>
// //                         <td>
// //                           <div className="flex gap-2">
// //                             <button
// //                               onClick={() => {
// //                                 setSelectedGroup(group);
// //                                 setShowAssignModal(true);
// //                               }}
// //                               className="btn btn-xs btn-primary flex items-center gap-1"
// //                               title="Assign Employees"
// //                             >
// //                               <FaUserPlus />
// //                               Assign
// //                             </button>
                            
// //                             <button
// //                               onClick={() => {
// //                                 setSelectedGroup(group);
// //                                 setShowEntitlementModal(true);
// //                               }}
// //                               className="btn btn-xs btn-secondary flex items-center gap-1"
// //                               title="Add Leave Entitlement"
// //                             >
// //                               <FaPlus />
// //                               Entitlement
// //                             </button>
                            
// //                             <button
// //                               onClick={() => handleDeleteGroup(group.id)}
// //                               className="btn btn-xs btn-error flex items-center gap-1"
// //                               title="Delete Group"
// //                             >
// //                               <FaTrash />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
                    
// //                     {groups.length === 0 && (
// //                       <tr>
// //                         <td colSpan={6} className="text-center py-8">
// //                           <div className="flex flex-col items-center justify-center gap-3">
// //                             <FaUsers className="h-16 w-16 text-slate-400" />
// //                             <div className="space-y-2">
// //                               <h3 className="text-lg font-medium text-slate-600">
// //                                 No entitlement groups
// //                               </h3>
// //                               <p className="text-sm text-slate-500">
// //                                 Create groups to assign leave entitlements in bulk
// //                               </p>
// //                             </div>
// //                             <button
// //                               onClick={() => setShowCreateModal(true)}
// //                               className="btn btn-primary mt-4"
// //                             >
// //                               <FaPlus className="mr-2" />
// //                               Create First Group
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         );
        
// //       case 'assignments':
// //         return (
// //           <div className="space-y-6">
// //             <div className="flex justify-between items-center">
// //               <div>
// //                 <h3 className="text-xl font-bold">Bulk Employee Assignments</h3>
// //                 <p className="text-sm text-slate-500 mt-1">
// //                   Assign employees to entitlement groups in bulk
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => {
// //                   if (groups.length === 0) {
// //                     showNotification('Please create groups first', 'error');
// //                     return;
// //                   }
// //                   setShowAssignModal(true);
// //                 }}
// //                 className="btn btn-primary"
// //                 disabled={groups.length === 0}
// //               >
// //                 <FaUserPlus className="mr-2" />
// //                 Assign Employees
// //               </button>
// //             </div>
            
// //             {groups.length === 0 ? (
// //               <div className="alert alert-warning">
// //                 <FaUsers className="h-6 w-6" />
// //                 <div>
// //                   <h3 className="font-bold">No Groups Available</h3>
// //                   <div className="text-sm">
// //                     Create entitlement groups first to assign employees. Go to the "Groups" tab.
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={() => setActiveTab('groups')}
// //                   className="btn btn-sm btn-warning"
// //                 >
// //                   Create Groups
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 {groups.map(group => (
// //                   <div key={group.id} className="card bg-base-100 shadow-sm border">
// //                     <div className="card-body">
// //                       <div className="flex justify-between items-start">
// //                         <div>
// //                           <h4 className="card-title text-lg">{group.group_name}</h4>
// //                           <p className="text-sm text-slate-500 mt-1">
// //                             {group.description || 'No description'}
// //                           </p>
// //                         </div>
// //                         <span className={`badge ${group.is_active ? 'badge-success' : 'badge-error'}`}>
// //                           {group.is_active ? 'Active' : 'Inactive'}
// //                         </span>
// //                       </div>
                      
// //                       <div className="mt-4 space-y-3">
// //                         <div className="flex items-center justify-between">
// //                           <span className="text-sm font-medium">Employees Assigned:</span>
// //                           <span className="badge badge-info">{group.employee_count || 0}</span>
// //                         </div>
                        
// //                         <div>
// //                           <span className="text-sm font-medium">Leave Entitlements:</span>
// //                           <div className="mt-2 flex flex-wrap gap-2">
// //                             {group.leave_types && group.leave_types.length > 0 ? (
// //                               group.leave_types.slice(0, 3).map(entitlement => (
// //                                 <span key={entitlement.id} className="badge badge-outline">
// //                                   {entitlement.leave_type_name}
// //                                 </span>
// //                               ))
// //                             ) : (
// //                               <span className="text-sm text-slate-500">No entitlements</span>
// //                             )}
// //                             {group.leave_types && group.leave_types.length > 3 && (
// //                               <span className="badge">+{group.leave_types.length - 3}</span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>
                      
// //                       <div className="card-actions justify-end mt-4">
// //                         <button
// //                           onClick={() => {
// //                             setSelectedGroup(group);
// //                             setShowAssignModal(true);
// //                           }}
// //                           className="btn btn-sm btn-primary"
// //                         >
// //                           <FaUserPlus className="mr-1" />
// //                           Assign Employees
// //                         </button>
// //                         <button
// //                           onClick={() => {
// //                             setSelectedGroup(group);
// //                             setShowEntitlementModal(true);
// //                           }}
// //                           className="btn btn-sm btn-secondary"
// //                         >
// //                           <FaPlus className="mr-1" />
// //                           Add Entitlement
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         );
// //     }
// //   };
  
// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className="text-2xl font-bold">Leave Entitlement Management</h2>
// //           <p className="text-sm text-slate-500 mt-1">
// //             Configure leave types, entitlement groups, and bulk assignments
// //           </p>
// //         </div>
// //       </div>
      
// //       {/* Tabs Navigation */}
// //       <div className="tabs tabs-boxed bg-base-200 p-1">
// //         <button
// //           className={`tab tab-lg flex items-center gap-2 ${activeTab === 'leave-types' ? 'tab-active' : ''}`}
// //           onClick={() => setActiveTab('leave-types')}
// //         >
// //           <FaCalendarAlt />
// //           Leave Types
// //         </button>
// //         <button
// //           className={`tab tab-lg flex items-center gap-2 ${activeTab === 'groups' ? 'tab-active' : ''}`}
// //           onClick={() => setActiveTab('groups')}
// //         >
// //           <FaUsers />
// //           Entitlement Groups
// //         </button>
// //         <button
// //           className={`tab tab-lg flex items-center gap-2 ${activeTab === 'assignments' ? 'tab-active' : ''}`}
// //           onClick={() => setActiveTab('assignments')}
// //         >
// //           <FaUserPlus />
// //           Bulk Assignments
// //         </button>
// //       </div>
      
// //       {/* Tab Content */}
// //       <div className="mt-6">
// //         {renderTabContent()}
// //       </div>
      
// //       {/* Create Group Modal */}
// //       {showCreateModal && (
// //         <div className="modal modal-open">
// //           <div className="modal-box">
// //             <h3 className="font-bold text-lg mb-4">Create Leave Entitlement Group</h3>
            
// //             <form onSubmit={handleCreateGroup}>
// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="label">
// //                     <span className="label-text">Group Name</span>
// //                     <span className="label-text-alt text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={groupForm.group_name}
// //                     onChange={(e) => setGroupForm({ ...groupForm, group_name: e.target.value })}
// //                     className="input input-bordered w-full"
// //                     placeholder="e.g., Senior Staff, Contract Employees"
// //                     required
// //                   />
// //                 </div>
                
// //                 <div>
// //                   <label className="label">
// //                     <span className="label-text">Description</span>
// //                   </label>
// //                   <textarea
// //                     value={groupForm.description}
// //                     onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
// //                     className="textarea textarea-bordered w-full"
// //                     rows={3}
// //                     placeholder="Describe this group..."
// //                   />
// //                 </div>
                
// //                 <div className="flex items-center gap-2">
// //                   <input
// //                     type="checkbox"
// //                     checked={groupForm.is_active}
// //                     onChange={(e) => setGroupForm({ ...groupForm, is_active: e.target.checked })}
// //                     className="checkbox checkbox-primary"
// //                   />
// //                   <span className="label-text">Active</span>
// //                 </div>
// //               </div>
              
// //               <div className="modal-action">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowCreateModal(false)}
// //                   className="btn btn-ghost"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button type="submit" className="btn btn-primary">
// //                   Create Group
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //           <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}></div>
// //         </div>
// //       )}
      
// //       {/* Assign Employees Modal */}
// //       {showAssignModal && selectedGroup && (
// //         <div className="modal modal-open">
// //           <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
// //             <h3 className="font-bold text-lg mb-4">
// //               Assign Employees to {selectedGroup.group_name}
// //             </h3>
            
// //             <EmployeeBulkAssignment 
// //               groupId={selectedGroup.id}
// //               onClose={() => setShowAssignModal(false)}
// //               onSuccess={() => {
// //                 setShowAssignModal(false);
// //                 fetchGroups();
// //               }}
// //             />
// //           </div>
// //           <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}></div>
// //         </div>
// //       )}
      
// //       {/* Add Leave Entitlement Modal */}
// //       {showEntitlementModal && selectedGroup && (
// //         <div className="modal modal-open">
// //           <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
// //             <h3 className="font-bold text-lg mb-4">
// //               Add Leave Entitlement to {selectedGroup.group_name}
// //             </h3>
            
// //             <form onSubmit={handleAddEntitlement}>
// //               <div className="space-y-6">
// //                 {/* Leave Type Selection */}
// //                 <div>
// //                   <label className="label">
// //                     <span className="label-text">Select Leave Type</span>
// //                     <span className="label-text-alt text-red-500">*</span>
// //                   </label>
// //                   <select
// //                     value={entitlementForm.leave_type_id}
// //                     onChange={(e) => {
// //                       setEntitlementForm({ ...entitlementForm, leave_type_id: e.target.value });
// //                       loadLeaveTypeYosBrackets(e.target.value);
// //                     }}
// //                     className="select select-bordered w-full"
// //                     required
// //                   >
// //                     <option value="">Choose a leave type</option>
// //                     {leaveTypes
// //                       .filter((lt: any) => lt.is_active)
// //                       .map((leaveType: any) => (
// //                         <option key={leaveType.id} value={leaveType.id.toString()}>
// //                           {leaveType.leave_type_name} ({leaveType.code})
// //                         </option>
// //                       ))
// //                     }
// //                   </select>
// //                 </div>
                
// //                 {/* YOS Brackets Configuration */}
// //                 {entitlementForm.leave_type_id && (
// //                   <div>
// //                     <div className="flex justify-between items-center mb-4">
// //                       <label className="label">
// //                         <span className="label-text font-semibold">Year of Service Brackets</span>
// //                         <span className="label-text-alt">Customize for this group</span>
// //                       </label>
// //                       <button
// //                         type="button"
// //                         onClick={addYosBracket}
// //                         className="btn btn-xs btn-primary"
// //                       >
// //                         Add Bracket
// //                       </button>
// //                     </div>
                    
// //                     <div className="space-y-4">
// //                       {entitlementForm.yos_brackets.map((bracket, index) => (
// //                         <div key={index} className="border rounded p-4">
// //                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
// //                             <div>
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
                            
// //                             <div>
// //                               <label className="label">
// //                                 <span className="label-text">Max Years (blank for ∞)</span>
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
                            
// //                             <div>
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
                          
// //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                             <div>
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
                            
// //                             <div>
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
                          
// //                           <div className="mt-4 flex items-center justify-between">
// //                             <label className="flex items-center gap-2">
// //                               <input
// //                                 type="checkbox"
// //                                 checked={!!bracket.expire_unused_at_period_end}
// //                                 onChange={(e) => {
// //                                   updateYosBracket(index, 'expire_unused_at_period_end', e.target.checked);
// //                                   if (e.target.checked) {
// //                                     updateYosBracket(index, 'carryover_max_days', 0);
// //                                   }
// //                                 }}
// //                                 className="checkbox checkbox-primary"
// //                               />
// //                               <span className="label-text">Use-it-or-lose-it (no carryover)</span>
// //                             </label>
                            
// //                             <button
// //                               type="button"
// //                               onClick={() => removeYosBracket(index)}
// //                               className="btn btn-xs btn-error"
// //                             >
// //                               Remove
// //                             </button>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
              
// //               <div className="modal-action mt-6">
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setShowEntitlementModal(false);
// //                     setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
// //                   }}
// //                   className="btn btn-ghost"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button 
// //                   type="submit" 
// //                   className="btn btn-primary"
// //                   disabled={!entitlementForm.leave_type_id || entitlementForm.yos_brackets.length === 0}
// //                 >
// //                   Add Entitlement
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //           <div className="modal-backdrop" onClick={() => {
// //             setShowEntitlementModal(false);
// //             setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
// //           }}></div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default LeaveEntitlementManagement;


// // // 'use client';

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { API_BASE_URL } from '../config';
// // // import { useTheme } from '../components/ThemeProvider';
// // // import { useNotification } from '../hooks/useNotification';
// // // import { 
// // //   FaUsers, FaPlus, FaEdit, FaTrash, FaUserPlus, FaList, 
// // //   FaCalendarAlt, FaTag, FaCog, FaLayerGroup, FaTable,
// // //   FaSearch, FaCheck, FaTimes, FaEye, FaEyeSlash, FaCopy,
// // //   FaChevronDown, FaChevronUp, FaInfoCircle, FaUser,
// // //   FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight
// // // } from 'react-icons/fa';

// // // // Import the LeaveTypesManagement component
// // // import LeaveTypesManagement from './LeaveTypesManagement';
// // // import EmployeeBulkAssignment from './EmployeeBulkAssignment';

// // // // Define interfaces
// // // interface YearOfServiceBracket {
// // //   min_years: number;
// // //   max_years?: number | null;
// // //   days: number;
// // //   renewal_period?: string;
// // //   carryover_max_days?: number;
// // //   expire_unused_at_period_end?: boolean;
// // // }

// // // interface LeaveEntitlementGroup {
// // //   id: number;
// // //   group_name: string;
// // //   description: string;
// // //   is_active: boolean;
// // //   employee_count?: number;
// // //   leave_types?: LeaveGroupEntitlement[];
// // //   assigned_employees?: AssignedEmployee[];
// // //   created_at?: string;
// // //   updated_at?: string;
// // // }

// // // interface LeaveGroupEntitlement {
// // //   id: number;
// // //   group_id: number;
// // //   leave_type_id: number;
// // //   leave_type_name: string;
// // //   leave_type_code?: string;
// // //   yos_brackets: YearOfServiceBracket[];
// // // }

// // // interface AssignedEmployee {
// // //   id: number;
// // //   employee_name: string;
// // //   employee_code: string;
// // //   department_name: string;
// // //   effective_date: string;
// // //   end_date: string | null;
// // // }

// // // interface LeaveType {
// // //   id: number;
// // //   leave_type_name: string;
// // //   code: string;
// // //   description: string;
// // //   max_days: number;
// // //   requires_approval: boolean;
// // //   requires_documentation: boolean;
// // //   is_active: boolean;
// // //   allocation_primary?: string;
// // //   yos_brackets?: YearOfServiceBracket[];
// // // }

// // // const LeaveEntitlementManagement = () => {
// // //   const { theme } = useTheme();
// // //   const { showNotification } = useNotification();
// // //   const [activeTab, setActiveTab] = useState('leave-types'); // 'leave-types', 'groups', 'assignments'
// // //   const [groups, setGroups] = useState<LeaveEntitlementGroup[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [showCreateModal, setShowCreateModal] = useState(false);
// // //   const [showAssignModal, setShowAssignModal] = useState(false);
// // //   const [showEntitlementModal, setShowEntitlementModal] = useState(false);
// // //   const [showEntitlementDetails, setShowEntitlementDetails] = useState<number | null>(null);
// // //   const [showEmployeeDetails, setShowEmployeeDetails] = useState<number | null>(null);
// // //   const [selectedGroup, setSelectedGroup] = useState<LeaveEntitlementGroup | null>(null);
// // //   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  
// // //   // Pagination states
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [itemsPerPage, setItemsPerPage] = useState(10);
// // //   const [totalItems, setTotalItems] = useState(0);
  
// // //   // Form states
// // //   const [groupForm, setGroupForm] = useState({
// // //     group_name: '',
// // //     description: '',
// // //     is_active: true
// // //   });
  
// // //   const [entitlementForm, setEntitlementForm] = useState({
// // //     leave_type_id: '',
// // //     yos_brackets: [] as YearOfServiceBracket[]
// // //   });
  
// // //   // Fetch all groups with pagination
// // //   const fetchGroups = async (page = 1, limit = itemsPerPage) => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         },
// // //         params: {
// // //           page,
// // //           limit,
// // //           include_employees: true
// // //         }
// // //       });
      
// // //       setGroups(response.data.groups || response.data);
// // //       setTotalItems(response.data.total || response.data.length);
// // //       setCurrentPage(response.data.page || page);
// // //     } catch (error) {
// // //       console.error('Error fetching groups:', error);
// // //       showNotification('Error loading entitlement groups', 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
  
// // //   // Fetch available leave types with YOS brackets
// // //   const fetchLeaveTypes = async () => {
// // //     try {
// // //       const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
// // //       setLeaveTypes(response.data);
// // //     } catch (error) {
// // //       console.error('Error fetching leave types:', error);
// // //     }
// // //   };
  
// // //   useEffect(() => {
// // //     if (activeTab === 'groups') {
// // //       fetchGroups(currentPage, itemsPerPage);
// // //     }
// // //     if (activeTab === 'groups') {
// // //       fetchLeaveTypes();
// // //     }
// // //   }, [activeTab, currentPage, itemsPerPage]);
  
// // //   // Create new group
// // //   const handleCreateGroup = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     try {
// // //       await axios.post(`${API_BASE_URL}/api/leave-entitlement-groups`, groupForm, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
      
// // //       setShowCreateModal(false);
// // //       setGroupForm({ group_name: '', description: '', is_active: true });
// // //       fetchGroups(1, itemsPerPage);
// // //       showNotification('Leave entitlement group created successfully', 'success');
// // //     } catch (error: any) {
// // //       console.error('Error creating group:', error);
// // //       showNotification(error.response?.data?.error || 'Error creating group', 'error');
// // //     }
// // //   };
  
// // //   // Add leave type entitlement to group - FIXED
// // //   const handleAddEntitlement = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!selectedGroup) return;
    
// // //     try {
// // //       console.log('Adding entitlement for group:', selectedGroup.id);
// // //       console.log('Leave type ID:', entitlementForm.leave_type_id);
      
// // //       const response = await axios.post(
// // //         `${API_BASE_URL}/api/leave-entitlement-groups/${selectedGroup.id}/entitlements`,
// // //         {
// // //           leave_type_id: parseInt(entitlementForm.leave_type_id)
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
// // //             'Content-Type': 'application/json'
// // //           }
// // //         }
// // //       );
      
// // //       console.log('Entitlement added successfully:', response.data);
      
// // //       setShowEntitlementModal(false);
// // //       setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
// // //       fetchGroups(currentPage, itemsPerPage);
// // //       showNotification('Leave entitlement added to group', 'success');
// // //     } catch (error: any) {
// // //       console.error('Error adding entitlement:', error);
// // //       console.error('Error response:', error.response?.data);
      
// // //       const errorMessage = error.response?.data?.error || 
// // //                           error.response?.data?.message || 
// // //                           'Error adding entitlement';
// // //       showNotification(errorMessage, 'error');
// // //     }
// // //   };
  
// // //   // Delete group
// // //   const handleDeleteGroup = async (groupId: number) => {
// // //     if (!confirm('Are you sure you want to delete this group? This will remove all employee assignments.')) {
// // //       return;
// // //     }
    
// // //     try {
// // //       await axios.delete(`${API_BASE_URL}/api/leave-entitlement-groups/${groupId}`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         }
// // //       });
      
// // //       fetchGroups(currentPage, itemsPerPage);
// // //       showNotification('Group deleted successfully', 'success');
// // //     } catch (error: any) {
// // //       console.error('Error deleting group:', error);
// // //       showNotification(error.response?.data?.error || 'Error deleting group', 'error');
// // //     }
// // //   };
  
// // //   // Toggle group active status - FIXED
// // //   const toggleGroupActive = async (groupId: number, currentStatus: boolean) => {
// // //     try {
// // //       const response = await axios.put(
// // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/toggle-active`,
// // //         { 
// // //           is_active: !currentStatus
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //           }
// // //         }
// // //       );
      
// // //       fetchGroups(currentPage, itemsPerPage);
// // //       showNotification(`Group ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
// // //     } catch (error: any) {
// // //       console.error('Error toggling group status:', error);
// // //       showNotification(error.response?.data?.error || 'Error toggling group status', 'error');
// // //     }
// // //   };
  
// // //   // Toggle entitlement details view
// // //   const toggleEntitlementDetails = (groupId: number) => {
// // //     if (showEntitlementDetails === groupId) {
// // //       setShowEntitlementDetails(null);
// // //     } else {
// // //       setShowEntitlementDetails(groupId);
// // //     }
// // //   };
  
// // //   // Toggle employee details view
// // //   const toggleEmployeeDetails = (groupId: number) => {
// // //     if (showEmployeeDetails === groupId) {
// // //       setShowEmployeeDetails(null);
// // //     } else {
// // //       setShowEmployeeDetails(groupId);
// // //     }
// // //   };
  
// // //   // Get YOS brackets summary for display
// // //   const getYosSummary = (yosBrackets: YearOfServiceBracket[]) => {
// // //     if (!yosBrackets || yosBrackets.length === 0) {
// // //       return 'Using leave type defaults';
// // //     }
    
// // //     return `${yosBrackets.length} bracket(s) configured`;
// // //   };
  
// // //   // Format YOS bracket for display
// // //   const formatYosBracket = (bracket: YearOfServiceBracket) => {
// // //     const maxYears = bracket.max_years === null ? '∞' : bracket.max_years;
// // //     return `${bracket.min_years}-${maxYears} years: ${bracket.days} days`;
// // //   };
  
// // //   // Format date for display
// // //   const formatDate = (dateString: string) => {
// // //     if (!dateString) return 'N/A';
// // //     return new Date(dateString).toLocaleDateString('en-US', {
// // //       year: 'numeric',
// // //       month: 'short',
// // //       day: 'numeric'
// // //     });
// // //   };
  
// // //   // Pagination controls
// // //   const totalPages = Math.ceil(totalItems / itemsPerPage);
  
// // //   const goToPage = (page: number) => {
// // //     if (page >= 1 && page <= totalPages) {
// // //       setCurrentPage(page);
// // //     }
// // //   };
  
// // //   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// // //     const newLimit = parseInt(e.target.value);
// // //     setItemsPerPage(newLimit);
// // //     setCurrentPage(1); // Reset to first page when changing items per page
// // //   };
  
// // //   // Tab navigation
// // //   const renderTabContent = () => {
// // //     switch (activeTab) {
// // //       case 'leave-types':
// // //         return <LeaveTypesManagement />;
        
// // //       case 'groups':
// // //         return (
// // //           <div className="space-y-6">
// // //             <div className="flex justify-between items-center">
// // //               <div>
// // //                 <h3 className="text-xl font-bold">Leave Entitlement Groups</h3>
// // //                 <p className="text-sm text-slate-500 mt-1">
// // //                   Create groups, assign leave entitlements, and manage employee assignments
// // //                 </p>
// // //               </div>
// // //               <button
// // //                 onClick={() => setShowCreateModal(true)}
// // //                 className="btn btn-primary"
// // //               >
// // //                 <FaPlus className="mr-2" />
// // //                 Create Group
// // //               </button>
// // //             </div>
            
// // //             {/* Items Per Page Selector */}
// // //             <div className="flex justify-between items-center">
// // //               <div className="flex items-center gap-2">
// // //                 <span className="text-sm">Show:</span>
// // //                 <select
// // //                   value={itemsPerPage}
// // //                   onChange={handleItemsPerPageChange}
// // //                   className="select select-bordered select-sm"
// // //                 >
// // //                   <option value="5">5</option>
// // //                   <option value="10">10</option>
// // //                   <option value="20">20</option>
// // //                   <option value="50">50</option>
// // //                 </select>
// // //                 <span className="text-sm">entries</span>
// // //               </div>
              
// // //               <div className="text-sm">
// // //                 Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
// // //               </div>
// // //             </div>
            
// // //             {loading ? (
// // //               <div className="flex justify-center items-center h-64">
// // //                 <span className="loading loading-spinner loading-lg"></span>
// // //               </div>
// // //             ) : (
// // //               <div className="space-y-4">
// // //                 {groups.map(group => (
// // //                   <div key={group.id} className="card bg-base-100 shadow-sm border">
// // //                     <div className="card-body">
// // //                       <div className="flex justify-between items-start">
// // //                         <div>
// // //                           <h4 className="card-title text-lg">{group.group_name}</h4>
// // //                           <p className="text-sm text-slate-500 mt-1">
// // //                             {group.description || 'No description'}
// // //                           </p>
// // //                         </div>
// // //                         <div className="flex items-center gap-2">
// // //                           <span className={`badge ${group.is_active ? 'badge-success' : 'badge-error'}`}>
// // //                             {group.is_active ? 'Active' : 'Inactive'}
// // //                           </span>
// // //                           <button
// // //                             onClick={() => toggleGroupActive(group.id, group.is_active)}
// // //                             className="btn btn-xs btn-ghost"
// // //                             title={group.is_active ? 'Deactivate' : 'Activate'}
// // //                           >
// // //                             {group.is_active ? <FaEyeSlash /> : <FaEye />}
// // //                           </button>
// // //                         </div>
// // //                       </div>
                      
// // //                       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                         <div className="stat p-4 bg-base-200 rounded-lg">
// // //                           <div className="stat-title">Employees</div>
// // //                           <div className="stat-value text-lg">{group.employee_count || 0}</div>
// // //                           <div className="stat-desc">
// // //                             {group.assigned_employees && group.assigned_employees.length > 0 && (
// // //                               <button
// // //                                 onClick={() => toggleEmployeeDetails(group.id)}
// // //                                 className="link link-primary text-xs"
// // //                               >
// // //                                 {showEmployeeDetails === group.id ? 'Hide list' : 'View employees'}
// // //                               </button>
// // //                             )}
// // //                           </div>
// // //                         </div>
                        
// // //                         <div className="stat p-4 bg-base-200 rounded-lg">
// // //                           <div className="stat-title">Leave Types</div>
// // //                           <div className="stat-value text-lg">{group.leave_types?.length || 0}</div>
// // //                           <div className="stat-desc">
// // //                             {group.leave_types && group.leave_types.length > 0 && (
// // //                               <button
// // //                                 onClick={() => toggleEntitlementDetails(group.id)}
// // //                                 className="link link-primary text-xs"
// // //                               >
// // //                                 {showEntitlementDetails === group.id ? 'Hide details' : 'View details'}
// // //                               </button>
// // //                             )}
// // //                           </div>
// // //                         </div>
                        
// // //                         <div className="stat p-4 bg-base-200 rounded-lg">
// // //                           <div className="stat-title">Created</div>
// // //                           <div className="stat-value text-sm">
// // //                             {group.created_at ? formatDate(group.created_at) : 'N/A'}
// // //                           </div>
// // //                         </div>
// // //                       </div>
                      
// // //                       {/* Assigned Employees Section */}
// // //                       {showEmployeeDetails === group.id && group.assigned_employees && group.assigned_employees.length > 0 && (
// // //                         <div className="mt-4 border rounded-lg p-4">
// // //                           <h5 className="font-semibold mb-3">Assigned Employees ({group.assigned_employees.length})</h5>
// // //                           <div className="space-y-2 max-h-60 overflow-y-auto">
// // //                             {group.assigned_employees.map(employee => (
// // //                               <div key={employee.id} className="flex justify-between items-center p-2 bg-base-200 rounded">
// // //                                 <div>
// // //                                   <div className="font-medium">{employee.employee_name}</div>
// // //                                   <div className="text-xs text-slate-500">
// // //                                     {employee.employee_code} • {employee.department_name}
// // //                                   </div>
// // //                                 </div>
// // //                                 <div className="text-xs text-slate-500">
// // //                                   Since: {formatDate(employee.effective_date)}
// // //                                 </div>
// // //                               </div>
// // //                             ))}
// // //                           </div>
// // //                         </div>
// // //                       )}
                      
// // //                       {/* Leave Types Section */}
// // //                       {showEntitlementDetails === group.id && group.leave_types && group.leave_types.length > 0 && (
// // //                         <div className="mt-4 border rounded-lg p-4">
// // //                           <h5 className="font-semibold mb-3">Leave Entitlements ({group.leave_types.length})</h5>
// // //                           <div className="space-y-3">
// // //                             {group.leave_types.map(entitlement => (
// // //                               <div key={entitlement.id} className="border-b pb-3 last:border-0">
// // //                                 <div className="flex justify-between items-start">
// // //                                   <div>
// // //                                     <div className="font-medium">{entitlement.leave_type_name}</div>
// // //                                     <div className="text-sm text-slate-500">
// // //                                       {getYosSummary(entitlement.yos_brackets)}
// // //                                     </div>
// // //                                   </div>
// // //                                   <button
// // //                                     onClick={() => {
// // //                                       if (confirm(`Remove ${entitlement.leave_type_name} from group?`)) {
// // //                                         axios.delete(
// // //                                           `${API_BASE_URL}/api/leave-entitlement-groups/${group.id}/entitlements/${entitlement.id}`,
// // //                                           {
// // //                                             headers: {
// // //                                               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //                                             }
// // //                                           }
// // //                                         ).then(() => {
// // //                                           fetchGroups(currentPage, itemsPerPage);
// // //                                           showNotification('Entitlement removed', 'success');
// // //                                         }).catch(error => {
// // //                                           console.error('Error removing entitlement:', error);
// // //                                           showNotification('Error removing entitlement', 'error');
// // //                                         });
// // //                                       }
// // //                                     }}
// // //                                     className="btn btn-xs btn-error"
// // //                                   >
// // //                                     <FaTrash />
// // //                                   </button>
// // //                                 </div>
                                
// // //                                 {/* Show YOS brackets if they exist */}
// // //                                 {entitlement.yos_brackets && entitlement.yos_brackets.length > 0 && (
// // //                                   <div className="mt-2 ml-4">
// // //                                     <div className="text-sm font-medium mb-1">YOS Brackets:</div>
// // //                                     <div className="space-y-1">
// // //                                       {entitlement.yos_brackets.map((bracket, index) => (
// // //                                         <div key={index} className="text-sm bg-base-200 p-2 rounded">
// // //                                           {formatYosBracket(bracket)}
// // //                                           {bracket.renewal_period && bracket.renewal_period !== 'YEARLY' && (
// // //                                             <span className="text-xs text-slate-500 ml-2">
// // //                                               ({bracket.renewal_period.toLowerCase()} renewal)
// // //                                             </span>
// // //                                           )}
// // //                                         </div>
// // //                                       ))}
// // //                                     </div>
// // //                                   </div>
// // //                                 )}
// // //                               </div>
// // //                             ))}
// // //                           </div>
// // //                         </div>
// // //                       )}
                      
// // //                       <div className="card-actions justify-end mt-4">
// // //                         <button
// // //                           onClick={() => {
// // //                             setSelectedGroup(group);
// // //                             setShowAssignModal(true);
// // //                           }}
// // //                           className="btn btn-sm btn-primary"
// // //                         >
// // //                           <FaUserPlus className="mr-1" />
// // //                           Assign Employees
// // //                         </button>
// // //                         <button
// // //                           onClick={() => {
// // //                             setSelectedGroup(group);
// // //                             setShowEntitlementModal(true);
// // //                           }}
// // //                           className="btn btn-sm btn-secondary"
// // //                         >
// // //                           <FaPlus className="mr-1" />
// // //                           Add Entitlement
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleDeleteGroup(group.id)}
// // //                           className="btn btn-sm btn-error"
// // //                         >
// // //                           <FaTrash className="mr-1" />
// // //                           Delete
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 ))}
                
// // //                 {groups.length === 0 && (
// // //                   <div className="text-center py-12">
// // //                     <div className="flex flex-col items-center justify-center gap-3">
// // //                       <FaUsers className="h-16 w-16 text-slate-400" />
// // //                       <div className="space-y-2">
// // //                         <h3 className="text-lg font-medium text-slate-600">
// // //                           No entitlement groups
// // //                         </h3>
// // //                         <p className="text-sm text-slate-500">
// // //                           Create groups to assign leave entitlements and employees
// // //                         </p>
// // //                       </div>
// // //                       <button
// // //                         onClick={() => setShowCreateModal(true)}
// // //                         className="btn btn-primary mt-4"
// // //                       >
// // //                         <FaPlus className="mr-2" />
// // //                         Create First Group
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             )}
            
// // //             {/* Pagination Controls */}
// // //             {totalPages > 1 && (
// // //               <div className="flex justify-center items-center gap-2 mt-6">
// // //                 <button
// // //                   onClick={() => goToPage(1)}
// // //                   disabled={currentPage === 1}
// // //                   className="btn btn-sm btn-ghost"
// // //                 >
// // //                   <FaAngleDoubleLeft />
// // //                 </button>
// // //                 <button
// // //                   onClick={() => goToPage(currentPage - 1)}
// // //                   disabled={currentPage === 1}
// // //                   className="btn btn-sm btn-ghost"
// // //                 >
// // //                   <FaAngleLeft />
// // //                   Previous
// // //                 </button>
                
// // //                 <div className="flex items-center gap-1">
// // //                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// // //                     let pageNum;
// // //                     if (totalPages <= 5) {
// // //                       pageNum = i + 1;
// // //                     } else if (currentPage <= 3) {
// // //                       pageNum = i + 1;
// // //                     } else if (currentPage >= totalPages - 2) {
// // //                       pageNum = totalPages - 4 + i;
// // //                     } else {
// // //                       pageNum = currentPage - 2 + i;
// // //                     }
                    
// // //                     return (
// // //                       <button
// // //                         key={pageNum}
// // //                         onClick={() => goToPage(pageNum)}
// // //                         className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
// // //                       >
// // //                         {pageNum}
// // //                       </button>
// // //                     );
// // //                   })}
// // //                 </div>
                
// // //                 <button
// // //                   onClick={() => goToPage(currentPage + 1)}
// // //                   disabled={currentPage === totalPages}
// // //                   className="btn btn-sm btn-ghost"
// // //                 >
// // //                   Next
// // //                   <FaAngleRight />
// // //                 </button>
// // //                 <button
// // //                   onClick={() => goToPage(totalPages)}
// // //                   disabled={currentPage === totalPages}
// // //                   className="btn btn-sm btn-ghost"
// // //                 >
// // //                   <FaAngleDoubleRight />
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         );
// // //     }
// // //   };
  
// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Header */}
// // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // //         <div>
// // //           <h2 className="text-2xl font-bold">Leave Entitlement Management</h2>
// // //           <p className="text-sm text-slate-500 mt-1">
// // //             Configure leave types and manage entitlement groups with employee assignments
// // //           </p>
// // //         </div>
// // //       </div>
      
// // //       {/* Tabs Navigation - Simplified to 2 tabs */}
// // //       <div className="tabs tabs-boxed bg-base-200 p-1">
// // //         <button
// // //           className={`tab tab-lg flex items-center gap-2 ${activeTab === 'leave-types' ? 'tab-active' : ''}`}
// // //           onClick={() => setActiveTab('leave-types')}
// // //         >
// // //           <FaCalendarAlt />
// // //           Leave Types
// // //         </button>
// // //         <button
// // //           className={`tab tab-lg flex items-center gap-2 ${activeTab === 'groups' ? 'tab-active' : ''}`}
// // //           onClick={() => setActiveTab('groups')}
// // //         >
// // //           <FaUsers />
// // //           Entitlement Groups
// // //         </button>
// // //       </div>
      
// // //       {/* Tab Content */}
// // //       <div className="mt-6">
// // //         {renderTabContent()}
// // //       </div>
      
// // //       {/* Create Group Modal */}
// // //       {showCreateModal && (
// // //         <div className="modal modal-open">
// // //           <div className="modal-box">
// // //             <h3 className="font-bold text-lg mb-4">Create Leave Entitlement Group</h3>
            
// // //             <form onSubmit={handleCreateGroup}>
// // //               <div className="space-y-4">
// // //                 <div>
// // //                   <label className="label">
// // //                     <span className="label-text">Group Name</span>
// // //                     <span className="label-text-alt text-red-500">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     value={groupForm.group_name}
// // //                     onChange={(e) => setGroupForm({ ...groupForm, group_name: e.target.value })}
// // //                     className="input input-bordered w-full"
// // //                     placeholder="e.g., Senior Staff, Contract Employees"
// // //                     required
// // //                   />
// // //                 </div>
                
// // //                 <div>
// // //                   <label className="label">
// // //                     <span className="label-text">Description</span>
// // //                   </label>
// // //                   <textarea
// // //                     value={groupForm.description}
// // //                     onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
// // //                     className="textarea textarea-bordered w-full"
// // //                     rows={3}
// // //                     placeholder="Describe this group..."
// // //                   />
// // //                 </div>
                
// // //                 <div className="flex items-center gap-2">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={groupForm.is_active}
// // //                     onChange={(e) => setGroupForm({ ...groupForm, is_active: e.target.checked })}
// // //                     className="checkbox checkbox-primary"
// // //                   />
// // //                   <span className="label-text">Active</span>
// // //                 </div>
// // //               </div>
              
// // //               <div className="modal-action">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowCreateModal(false)}
// // //                   className="btn btn-ghost"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button type="submit" className="btn btn-primary">
// // //                   Create Group
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //           <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}></div>
// // //         </div>
// // //       )}
      
// // //       {/* Assign Employees Modal */}
// // //       {showAssignModal && selectedGroup && (
// // //         <div className="modal modal-open">
// // //           <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
// // //             <h3 className="font-bold text-lg mb-4">
// // //               Assign Employees to {selectedGroup.group_name}
// // //             </h3>
            
// // //             <EmployeeBulkAssignment 
// // //               groupId={selectedGroup.id}
// // //               onClose={() => setShowAssignModal(false)}
// // //               onSuccess={() => {
// // //                 setShowAssignModal(false);
// // //                 fetchGroups(currentPage, itemsPerPage);
// // //               }}
// // //             />
// // //           </div>
// // //           <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}></div>
// // //         </div>
// // //       )}
      
// // //       {/* Add Leave Entitlement Modal - SIMPLIFIED */}
// // //       {showEntitlementModal && selectedGroup && (
// // //         <div className="modal modal-open">
// // //           <div className="modal-box">
// // //             <h3 className="font-bold text-lg mb-4">
// // //               Add Leave Entitlement to {selectedGroup.group_name}
// // //             </h3>
            
// // //             <form onSubmit={handleAddEntitlement}>
// // //               <div className="space-y-6">
// // //                 {/* Leave Type Selection */}
// // //                 <div>
// // //                   <label className="label">
// // //                     <span className="label-text">Select Leave Type</span>
// // //                     <span className="label-text-alt text-red-500">*</span>
// // //                   </label>
// // //                   <select
// // //                     value={entitlementForm.leave_type_id}
// // //                     onChange={(e) => {
// // //                       setEntitlementForm({ 
// // //                         ...entitlementForm, 
// // //                         leave_type_id: e.target.value 
// // //                       });
// // //                     }}
// // //                     className="select select-bordered w-full"
// // //                     required
// // //                   >
// // //                     <option value="">Choose a leave type</option>
// // //                     {leaveTypes
// // //                       .filter((lt: LeaveType) => lt.is_active)
// // //                       .map((leaveType: LeaveType) => (
// // //                         <option key={leaveType.id} value={leaveType.id.toString()}>
// // //                           {leaveType.leave_type_name} ({leaveType.code})
// // //                         </option>
// // //                       ))
// // //                     }
// // //                   </select>
// // //                 </div>
                
// // //                 {/* Preview of selected leave type */}
// // //                 {entitlementForm.leave_type_id && (
// // //                   <div className="bg-base-200 p-4 rounded-lg">
// // //                     <div className="font-medium mb-2">Leave Type Preview:</div>
// // //                     {(() => {
// // //                       const selectedLeaveType = leaveTypes.find(
// // //                         lt => lt.id.toString() === entitlementForm.leave_type_id
// // //                       );
                      
// // //                       if (!selectedLeaveType) return null;
                      
// // //                       return (
// // //                         <div className="space-y-2">
// // //                           <div className="text-sm">
// // //                             <span className="font-medium">Name:</span> {selectedLeaveType.leave_type_name}
// // //                           </div>
// // //                           <div className="text-sm">
// // //                             <span className="font-medium">Code:</span> {selectedLeaveType.code}
// // //                           </div>
// // //                           <div className="text-sm">
// // //                             <span className="font-medium">Max Days:</span> {selectedLeaveType.max_days}
// // //                           </div>
// // //                           <div className="text-sm">
// // //                             <span className="font-medium">Status:</span> 
// // //                             <span className={`badge ml-2 ${selectedLeaveType.is_active ? 'badge-success' : 'badge-error'}`}>
// // //                               {selectedLeaveType.is_active ? 'Active' : 'Inactive'}
// // //                             </span>
// // //                           </div>
// // //                           {selectedLeaveType.yos_brackets && selectedLeaveType.yos_brackets.length > 0 && (
// // //                             <div className="mt-2">
// // //                               <div className="text-sm font-medium">YOS Brackets (will be inherited):</div>
// // //                               <div className="space-y-1 mt-1">
// // //                                 {selectedLeaveType.yos_brackets.map((bracket, index) => (
// // //                                   <div key={index} className="text-sm bg-base-100 p-2 rounded">
// // //                                     {formatYosBracket(bracket)}
// // //                                   </div>
// // //                                 ))}
// // //                               </div>
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                       );
// // //                     })()}
// // //                   </div>
// // //                 )}
                
// // //                 <div className="alert alert-info">
// // //                   <FaInfoCircle />
// // //                   <div>
// // //                     <span className="font-medium">Note:</span> This group will inherit the leave type's Year of Service brackets.
// // //                   </div>
// // //                 </div>
// // //               </div>
              
// // //               <div className="modal-action mt-6">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => {
// // //                     setShowEntitlementModal(false);
// // //                     setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
// // //                   }}
// // //                   className="btn btn-ghost"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button 
// // //                   type="submit" 
// // //                   className="btn btn-primary"
// // //                   disabled={!entitlementForm.leave_type_id}
// // //                 >
// // //                   Add Entitlement
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //           <div className="modal-backdrop" onClick={() => {
// // //             setShowEntitlementModal(false);
// // //             setEntitlementForm({ leave_type_id: '', yos_brackets: [] });
// // //           }}></div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default LeaveEntitlementManagement;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { useTheme } from '../components/ThemeProvider';
// import { useNotification } from '../hooks/useNotification';
// import { 
//   FaUsers, FaPlus, FaEdit, FaTrash, FaUserPlus, FaList, 
//   FaCalendarAlt, FaTag, FaCog, FaLayerGroup, FaTable,
//   FaSearch, FaCheck, FaTimes, FaEye, FaEyeSlash, FaCopy,
//   FaChevronDown, FaChevronUp, FaInfoCircle, FaUser,
//   FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight
// } from 'react-icons/fa';

// // Import the LeaveTypesManagement component
// import LeaveTypesManagement from './LeaveTypesManagement';
// import EmployeeBulkAssignment from './EmployeeBulkAssignment';

// // Define interfaces
// interface YearOfServiceBracket {
//   min_years: number;
//   max_years?: number | null;
//   days: number;
//   renewal_period?: string;
//   carryover_max_days?: number;
//   expire_unused_at_period_end?: boolean;
// }

// interface LeaveEntitlementGroup {
//   id: number;
//   group_name: string;
//   description: string;
//   is_active: boolean;
//   employee_count?: number;
//   leave_types?: LeaveGroupEntitlement[];
//   assigned_employees?: AssignedEmployee[];
//   created_at?: string;
//   updated_at?: string;
// }

// interface LeaveGroupEntitlement {
//   id: number;
//   group_id: number;
//   leave_type_id: number;
//   leave_type_name: string;
//   leave_type_code?: string;
//   yos_brackets: YearOfServiceBracket[];
// }

// interface AssignedEmployee {
//   id: number;
//   employee_name: string;
//   employee_code: string;
//   department_name: string;
//   effective_date: string;
//   end_date: string | null;
// }

// interface LeaveType {
//   id: number;
//   leave_type_name: string;
//   code: string;
//   description: string;
//   max_days: number;
//   requires_approval: boolean;
//   requires_documentation: boolean;
//   is_active: boolean;
//   allocation_primary?: string;
//   yos_brackets?: YearOfServiceBracket[];
// }

// const LeaveEntitlementManagement = () => {
//   const { theme } = useTheme();
//   const { showNotification } = useNotification();
//   const [activeTab, setActiveTab] = useState('leave-types'); // 'leave-types', 'groups'
//   const [groups, setGroups] = useState<LeaveEntitlementGroup[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [showEntitlementModal, setShowEntitlementModal] = useState(false);
//   const [showEntitlementDetails, setShowEntitlementDetails] = useState<number | null>(null);
//   const [showEmployeeDetails, setShowEmployeeDetails] = useState<number | null>(null);
//   const [selectedGroup, setSelectedGroup] = useState<LeaveEntitlementGroup | null>(null);
//   const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
  
//   // Form states
//   const [groupForm, setGroupForm] = useState({
//     group_name: '',
//     description: '',
//     is_active: true
//   });
  
//   const [entitlementForm, setEntitlementForm] = useState({
//     leave_type_id: '',
//   });
  
//   // Fetch all groups with pagination
//   const fetchGroups = async (page = 1, limit = itemsPerPage) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         },
//         params: {
//           page,
//           limit,
//           include_employees: true
//         }
//       });
      
//       // Handle both response formats
//       if (response.data.groups) {
//         setGroups(response.data.groups);
//         setTotalItems(response.data.total || response.data.groups.length);
//         setCurrentPage(response.data.page || page);
//       } else {
//         setGroups(response.data);
//         setTotalItems(response.data.length);
//         setCurrentPage(page);
//       }
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//       showNotification('Error loading entitlement groups', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
  
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
//       fetchGroups(currentPage, itemsPerPage);
//       fetchLeaveTypes();
//     }
//   }, [activeTab, currentPage, itemsPerPage]);
  
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
//       fetchGroups(1, itemsPerPage);
//       showNotification('Leave entitlement group created successfully', 'success');
//     } catch (error: any) {
//       console.error('Error creating group:', error);
//       showNotification(error.response?.data?.error || 'Error creating group', 'error');
//     }
//   };
  
//   // Add leave type entitlement to group - FIXED (No yos_brackets sent)
//   const handleAddEntitlement = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedGroup) return;
    
//     try {
//       console.log('Adding entitlement for group:', selectedGroup.id);
//       console.log('Leave type ID:', entitlementForm.leave_type_id);
      
//       // Send ONLY leave_type_id
//       const requestData = {
//         leave_type_id: parseInt(entitlementForm.leave_type_id)
//         // DO NOT send yos_brackets - let backend handle it
//       };
      
//       console.log('Sending request data:', requestData);
      
//       const response = await axios.post(
//         `${API_BASE_URL}/api/leave-entitlement-groups/${selectedGroup.id}/entitlements`,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('Entitlement added successfully:', response.data);
      
//       setShowEntitlementModal(false);
//       setEntitlementForm({ leave_type_id: '' });
//       fetchGroups(currentPage, itemsPerPage);
//       showNotification('Leave entitlement added to group', 'success');
//     } catch (error: any) {
//       console.error('Error adding entitlement:', error);
//       console.error('Error response data:', error.response?.data);
//       console.error('Error response status:', error.response?.status);
      
//       const errorMessage = error.response?.data?.error || 
//                           error.response?.data?.message || 
//                           error.message || 
//                           'Error adding entitlement';
//       showNotification(errorMessage, 'error');
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
      
//       fetchGroups(currentPage, itemsPerPage);
//       showNotification('Group deleted successfully', 'success');
//     } catch (error: any) {
//       console.error('Error deleting group:', error);
//       showNotification(error.response?.data?.error || 'Error deleting group', 'error');
//     }
//   };
  
//   // Toggle group active status
//   const toggleGroupActive = async (groupId: number, currentStatus: boolean) => {
//     try {
//       const response = await axios.put(
//         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/toggle-active`,
//         { 
//           is_active: !currentStatus
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         }
//       );
      
//       fetchGroups(currentPage, itemsPerPage);
//       showNotification(`Group ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
//     } catch (error: any) {
//       console.error('Error toggling group status:', error);
//       showNotification(error.response?.data?.error || 'Error toggling group status', 'error');
//     }
//   };
  
//   // Toggle entitlement details view
//   const toggleEntitlementDetails = (groupId: number) => {
//     if (showEntitlementDetails === groupId) {
//       setShowEntitlementDetails(null);
//     } else {
//       setShowEntitlementDetails(groupId);
//     }
//   };
  
//   // Toggle employee details view
//   const toggleEmployeeDetails = (groupId: number) => {
//     if (showEmployeeDetails === groupId) {
//       setShowEmployeeDetails(null);
//     } else {
//       setShowEmployeeDetails(groupId);
//     }
//   };
  
//   // Get YOS brackets summary for display
//   const getYosSummary = (yosBrackets: YearOfServiceBracket[]) => {
//     if (!yosBrackets || yosBrackets.length === 0) {
//       return 'Using leave type defaults';
//     }
    
//     return `${yosBrackets.length} bracket(s)`;
//   };
  
//   // Format YOS bracket for display
//   const formatYosBracket = (bracket: YearOfServiceBracket) => {
//     const maxYears = bracket.max_years === null ? '∞' : bracket.max_years;
//     return `${bracket.min_years}-${maxYears} years: ${bracket.days} days`;
//   };
  
//   // Format date for display
//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };
  
//   // Pagination controls
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
  
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
  
//   // Tab navigation
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'leave-types':
//         return <LeaveTypesManagement />;
        
//       case 'groups':
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-xl font-bold">Leave Entitlement Groups</h3>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Create groups, assign leave entitlements, and manage employee assignments
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="btn btn-primary"
//               >
//                 <FaPlus className="mr-2" />
//                 Create Group
//               </button>
//             </div>
            
//             {/* Items Per Page Selector */}
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm">Show:</span>
//                 <select
//                   value={itemsPerPage}
//                   onChange={handleItemsPerPageChange}
//                   className="select select-bordered select-sm"
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="50">50</option>
//                 </select>
//                 <span className="text-sm">entries</span>
//               </div>
              
//               <div className="text-sm">
//                 Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
//               </div>
//             </div>
            
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <span className="loading loading-spinner loading-lg"></span>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {groups.map(group => (
//                   <div key={group.id} className="card bg-base-100 shadow-sm border">
//                     <div className="card-body">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="card-title text-lg">{group.group_name}</h4>
//                           <p className="text-sm text-slate-500 mt-1">
//                             {group.description || 'No description'}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span className={`badge ${group.is_active ? 'badge-success' : 'badge-error'}`}>
//                             {group.is_active ? 'Active' : 'Inactive'}
//                           </span>
//                           <button
//                             onClick={() => toggleGroupActive(group.id, group.is_active)}
//                             className="btn btn-xs btn-ghost"
//                             title={group.is_active ? 'Deactivate' : 'Activate'}
//                           >
//                             {group.is_active ? <FaEyeSlash /> : <FaEye />}
//                           </button>
//                         </div>
//                       </div>
                      
//                       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="stat p-4 bg-base-200 rounded-lg">
//                           <div className="stat-title">Employees</div>
//                           <div className="stat-value text-lg">{group.employee_count || 0}</div>
//                           <div className="stat-desc">
//                             {group.employee_count && group.employee_count > 0 && (
//                               <button
//                                 onClick={() => toggleEmployeeDetails(group.id)}
//                                 className="link link-primary text-xs"
//                               >
//                                 {showEmployeeDetails === group.id ? 'Hide list' : 'View employees'}
//                               </button>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div className="stat p-4 bg-base-200 rounded-lg">
//                           <div className="stat-title">Leave Types</div>
//                           <div className="stat-value text-lg">{group.leave_types?.length || 0}</div>
//                           <div className="stat-desc">
//                             {group.leave_types && group.leave_types.length > 0 && (
//                               <button
//                                 onClick={() => toggleEntitlementDetails(group.id)}
//                                 className="link link-primary text-xs"
//                               >
//                                 {showEntitlementDetails === group.id ? 'Hide details' : 'View details'}
//                               </button>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div className="stat p-4 bg-base-200 rounded-lg">
//                           <div className="stat-title">Created</div>
//                           <div className="stat-value text-sm">
//                             {group.created_at ? formatDate(group.created_at) : 'N/A'}
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Assigned Employees Section */}
//                       {showEmployeeDetails === group.id && group.assigned_employees && group.assigned_employees.length > 0 && (
//                         <div className="mt-4 border rounded-lg p-4">
//                           <h5 className="font-semibold mb-3">Assigned Employees ({group.assigned_employees.length})</h5>
//                           <div className="space-y-2 max-h-60 overflow-y-auto">
//                             {group.assigned_employees.map(employee => (
//                               <div key={employee.id} className="flex justify-between items-center p-2 bg-base-200 rounded">
//                                 <div>
//                                   <div className="font-medium">{employee.employee_name}</div>
//                                   <div className="text-xs text-slate-500">
//                                     {employee.employee_code} • {employee.department_name}
//                                   </div>
//                                 </div>
//                                 <div className="text-xs text-slate-500">
//                                   Since: {formatDate(employee.effective_date)}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Leave Types Section */}
//                       {showEntitlementDetails === group.id && group.leave_types && group.leave_types.length > 0 && (
//                         <div className="mt-4 border rounded-lg p-4">
//                           <h5 className="font-semibold mb-3">Leave Entitlements ({group.leave_types.length})</h5>
//                           <div className="space-y-3">
//                             {group.leave_types.map(entitlement => (
//                               <div key={entitlement.id} className="border-b pb-3 last:border-0">
//                                 <div className="flex justify-between items-start">
//                                   <div>
//                                     <div className="font-medium">{entitlement.leave_type_name}</div>
//                                     <div className="text-sm text-slate-500">
//                                       {getYosSummary(entitlement.yos_brackets)}
//                                     </div>
//                                   </div>
//                                   <button
//                                     onClick={() => {
//                                       if (confirm(`Remove ${entitlement.leave_type_name} from group?`)) {
//                                         axios.delete(
//                                           `${API_BASE_URL}/api/leave-entitlement-groups/${group.id}/entitlements/${entitlement.id}`,
//                                           {
//                                             headers: {
//                                               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//                                             }
//                                           }
//                                         ).then(() => {
//                                           fetchGroups(currentPage, itemsPerPage);
//                                           showNotification('Entitlement removed', 'success');
//                                         }).catch(error => {
//                                           console.error('Error removing entitlement:', error);
//                                           showNotification('Error removing entitlement', 'error');
//                                         });
//                                       }
//                                     }}
//                                     className="btn btn-xs btn-error"
//                                   >
//                                     <FaTrash />
//                                   </button>
//                                 </div>
                                
//                                 {/* Show YOS brackets if they exist */}
//                                 {entitlement.yos_brackets && entitlement.yos_brackets.length > 0 && (
//                                   <div className="mt-2 ml-4">
//                                     <div className="text-sm font-medium mb-1">YOS Brackets:</div>
//                                     <div className="space-y-1">
//                                       {entitlement.yos_brackets.map((bracket, index) => (
//                                         <div key={index} className="text-sm bg-base-200 p-2 rounded">
//                                           {formatYosBracket(bracket)}
//                                           {bracket.renewal_period && bracket.renewal_period !== 'YEARLY' && (
//                                             <span className="text-xs text-slate-500 ml-2">
//                                               ({bracket.renewal_period.toLowerCase()} renewal)
//                                             </span>
//                                           )}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
                      
//                       <div className="card-actions justify-end mt-4">
//                         <button
//                           onClick={() => {
//                             setSelectedGroup(group);
//                             setShowAssignModal(true);
//                           }}
//                           className="btn btn-sm btn-primary"
//                         >
//                           <FaUserPlus className="mr-1" />
//                           Assign Employees
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedGroup(group);
//                             setShowEntitlementModal(true);
//                           }}
//                           className="btn btn-sm btn-secondary"
//                         >
//                           <FaPlus className="mr-1" />
//                           Add Entitlement
//                         </button>
//                         <button
//                           onClick={() => handleDeleteGroup(group.id)}
//                           className="btn btn-sm btn-error"
//                         >
//                           <FaTrash className="mr-1" />
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {groups.length === 0 && (
//                   <div className="text-center py-12">
//                     <div className="flex flex-col items-center justify-center gap-3">
//                       <FaUsers className="h-16 w-16 text-slate-400" />
//                       <div className="space-y-2">
//                         <h3 className="text-lg font-medium text-slate-600">
//                           No entitlement groups
//                         </h3>
//                         <p className="text-sm text-slate-500">
//                           Create groups to assign leave entitlements and employees
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => setShowCreateModal(true)}
//                         className="btn btn-primary mt-4"
//                       >
//                         <FaPlus className="mr-2" />
//                         Create First Group
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center gap-2 mt-6">
//                 <button
//                   onClick={() => goToPage(1)}
//                   disabled={currentPage === 1}
//                   className="btn btn-sm btn-ghost"
//                 >
//                   <FaAngleDoubleLeft />
//                 </button>
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="btn btn-sm btn-ghost"
//                 >
//                   <FaAngleLeft />
//                   Previous
//                 </button>
                
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => goToPage(pageNum)}
//                         className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="btn btn-sm btn-ghost"
//                 >
//                   Next
//                   <FaAngleRight />
//                 </button>
//                 <button
//                   onClick={() => goToPage(totalPages)}
//                   disabled={currentPage === totalPages}
//                   className="btn btn-sm btn-ghost"
//                 >
//                   <FaAngleDoubleRight />
//                 </button>
//               </div>
//             )}
//           </div>
//         );
//     }
//   };
  
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold">Leave Entitlement Management</h2>
//           <p className="text-sm text-slate-500 mt-1">
//             Configure leave types and manage entitlement groups with employee assignments
//           </p>
//         </div>
//       </div>
      
//       {/* Tabs Navigation */}
//       <div className="tabs tabs-boxed bg-base-200 p-1">
//         <button
//           className={`tab tab-lg flex items-center gap-2 ${activeTab === 'leave-types' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('leave-types')}
//         >
//           <FaCalendarAlt />
//           Leave Types
//         </button>
//         <button
//           className={`tab tab-lg flex items-center gap-2 ${activeTab === 'groups' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('groups')}
//         >
//           <FaUsers />
//           Entitlement Groups
//         </button>
//       </div>
      
//       {/* Tab Content */}
//       <div className="mt-6">
//         {renderTabContent()}
//       </div>
      
//       {/* Create Group Modal */}
//       {showCreateModal && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg mb-4">Create Leave Entitlement Group</h3>
            
//             <form onSubmit={handleCreateGroup}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="label">
//                     <span className="label-text">Group Name</span>
//                     <span className="label-text-alt text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={groupForm.group_name}
//                     onChange={(e) => setGroupForm({ ...groupForm, group_name: e.target.value })}
//                     className="input input-bordered w-full"
//                     placeholder="e.g., Senior Staff, Contract Employees"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="label">
//                     <span className="label-text">Description</span>
//                   </label>
//                   <textarea
//                     value={groupForm.description}
//                     onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
//                     className="textarea textarea-bordered w-full"
//                     rows={3}
//                     placeholder="Describe this group..."
//                   />
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={groupForm.is_active}
//                     onChange={(e) => setGroupForm({ ...groupForm, is_active: e.target.checked })}
//                     className="checkbox checkbox-primary"
//                   />
//                   <span className="label-text">Active</span>
//                 </div>
//               </div>
              
//               <div className="modal-action">
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateModal(false)}
//                   className="btn btn-ghost"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   Create Group
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}></div>
//         </div>
//       )}
      
//       {/* Assign Employees Modal */}
//       {showAssignModal && selectedGroup && (
//         <div className="modal modal-open">
//           <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
//             <h3 className="font-bold text-lg mb-4">
//               Assign Employees to {selectedGroup.group_name}
//             </h3>
            
//             <EmployeeBulkAssignment 
//               groupId={selectedGroup.id}
//               onClose={() => setShowAssignModal(false)}
//               onSuccess={() => {
//                 setShowAssignModal(false);
//                 fetchGroups(currentPage, itemsPerPage);
//               }}
//             />
//           </div>
//           <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}></div>
//         </div>
//       )}
      
//       {/* Add Leave Entitlement Modal - SIMPLIFIED */}
//       {showEntitlementModal && selectedGroup && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg mb-4">
//               Add Leave Entitlement to {selectedGroup.group_name}
//             </h3>
            
//             <form onSubmit={handleAddEntitlement}>
//               <div className="space-y-6">
//                 {/* Leave Type Selection */}
//                 <div>
//                   <label className="label">
//                     <span className="label-text">Select Leave Type</span>
//                     <span className="label-text-alt text-red-500">*</span>
//                   </label>
//                   <select
//                     value={entitlementForm.leave_type_id}
//                     onChange={(e) => {
//                       setEntitlementForm({ 
//                         ...entitlementForm, 
//                         leave_type_id: e.target.value 
//                       });
//                     }}
//                     className="select select-bordered w-full"
//                     required
//                   >
//                     <option value="">Choose a leave type</option>
//                     {leaveTypes
//                       .filter((lt: LeaveType) => lt.is_active)
//                       .map((leaveType: LeaveType) => (
//                         <option key={leaveType.id} value={leaveType.id.toString()}>
//                           {leaveType.leave_type_name} ({leaveType.code})
//                         </option>
//                       ))
//                     }
//                   </select>
//                 </div>
                
//                 {/* Preview of selected leave type */}
//                 {entitlementForm.leave_type_id && (
//                   <div className="bg-base-200 p-4 rounded-lg">
//                     <div className="font-medium mb-2">Leave Type Preview:</div>
//                     {(() => {
//                       const selectedLeaveType = leaveTypes.find(
//                         lt => lt.id.toString() === entitlementForm.leave_type_id
//                       );
                      
//                       if (!selectedLeaveType) return null;
                      
//                       return (
//                         <div className="space-y-2">
//                           <div className="text-sm">
//                             <span className="font-medium">Name:</span> {selectedLeaveType.leave_type_name}
//                           </div>
//                           <div className="text-sm">
//                             <span className="font-medium">Code:</span> {selectedLeaveType.code}
//                           </div>
//                           <div className="text-sm">
//                             <span className="font-medium">Max Days:</span> {selectedLeaveType.max_days}
//                           </div>
//                           <div className="text-sm">
//                             <span className="font-medium">Status:</span> 
//                             <span className={`badge ml-2 ${selectedLeaveType.is_active ? 'badge-success' : 'badge-error'}`}>
//                               {selectedLeaveType.is_active ? 'Active' : 'Inactive'}
//                             </span>
//                           </div>
//                           {selectedLeaveType.yos_brackets && selectedLeaveType.yos_brackets.length > 0 && (
//                             <div className="mt-2">
//                               <div className="text-sm font-medium">YOS Brackets (will be inherited):</div>
//                               <div className="space-y-1 mt-1">
//                                 {selectedLeaveType.yos_brackets.map((bracket, index) => (
//                                   <div key={index} className="text-sm bg-base-100 p-2 rounded">
//                                     {formatYosBracket(bracket)}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 )}
                
//                 <div className="alert alert-info">
//                   <FaInfoCircle />
//                   <div>
//                     <span className="font-medium">Note:</span> This group will inherit the leave type's Year of Service brackets.
//                   </div>
//                 </div>
//               </div>
              
//               <div className="modal-action mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEntitlementModal(false);
//                     setEntitlementForm({ leave_type_id: '' });
//                   }}
//                   className="btn btn-ghost"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="btn btn-primary"
//                   disabled={!entitlementForm.leave_type_id}
//                 >
//                   Add Entitlement
//                 </button>
//               </div>
//             </form>
//           </div>
//           <div className="modal-backdrop" onClick={() => {
//             setShowEntitlementModal(false);
//             setEntitlementForm({ leave_type_id: '' });
//           }}></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeaveEntitlementManagement;

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useTheme } from '../components/ThemeProvider';
import { useNotification } from '../hooks/useNotification';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaUserPlus, FaList, 
  FaCalendarAlt, FaTag, FaCog, FaLayerGroup, FaTable,
  FaSearch, FaCheck, FaTimes, FaEye, FaEyeSlash, FaCopy,
  FaChevronDown, FaChevronUp, FaInfoCircle, FaUser,
  FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';

// Import the LeaveTypesManagement component
import LeaveTypesManagement from './LeaveTypesManagement';
import EmployeeBulkAssignment from './EmployeeBulkAssignment';

// Define interfaces
interface YearOfServiceBracket {
  min_years: number;
  max_years?: number | null;
  days: number;
  renewal_period?: string;
  carryover_max_days?: number;
  expire_unused_at_period_end?: boolean;
}

interface LeaveEntitlementGroup {
  id: number;
  group_name: string;
  description: string;
  is_active: boolean;
  employee_count?: number;
  leave_types?: LeaveGroupEntitlement[];
  assigned_employees?: AssignedEmployee[];
  created_at?: string;
  updated_at?: string;
}

interface LeaveGroupEntitlement {
  id: number;
  group_id: number;
  leave_type_id: number;
  leave_type_name: string;
  leave_type_code?: string;
  yos_brackets: YearOfServiceBracket[];
}

interface AssignedEmployee {
  id: number;
  employee_name: string;
  employee_code: string;
  department_name: string;
  effective_date: string;
  end_date: string | null;
}

interface LeaveType {
  id: number;
  leave_type_name: string;
  code: string;
  description: string;
  max_days: number;
  requires_approval: boolean;
  requires_documentation: boolean;
  is_active: boolean;
  allocation_primary?: string;
  yos_brackets?: YearOfServiceBracket[];
}

const LeaveEntitlementManagement = () => {
  const { theme } = useTheme();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('leave-types'); // 'leave-types', 'groups'
  const [groups, setGroups] = useState<LeaveEntitlementGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEntitlementModal, setShowEntitlementModal] = useState(false);
  const [showEntitlementDetails, setShowEntitlementDetails] = useState<number | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<LeaveEntitlementGroup | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Form states
  const [groupForm, setGroupForm] = useState({
    group_name: '',
    description: '',
    is_active: true
  });
  
  const [entitlementForm, setEntitlementForm] = useState({
    leave_type_id: '',
  });
  
  // Fetch all groups with pagination
  const fetchGroups = async (page = 1, limit = itemsPerPage) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        },
        params: {
          page,
          limit,
          include_employees: true
        }
      });
      
      // Handle both response formats
      const responseData = response.data;
      if (responseData && responseData.groups) {
        setGroups(responseData.groups || []);
        setTotalItems(responseData.pagination?.total || responseData.groups?.length || 0);
        setCurrentPage(responseData.pagination?.current_page || page);
      } else if (Array.isArray(responseData)) {
        setGroups(responseData);
        setTotalItems(responseData.length);
        setCurrentPage(page);
      } else {
        setGroups([]);
        setTotalItems(0);
        console.error('Unexpected API response format:', responseData);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      showNotification('Error loading entitlement groups', 'error');
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
      setLeaveTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      setLeaveTypes([]);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'groups') {
      fetchGroups(currentPage, itemsPerPage);
      fetchLeaveTypes();
    }
  }, [activeTab, currentPage, itemsPerPage]);
  
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
      fetchGroups(1, itemsPerPage);
      showNotification('Leave entitlement group created successfully', 'success');
    } catch (error: any) {
      console.error('Error creating group:', error);
      showNotification(error.response?.data?.error || 'Error creating group', 'error');
    }
  };
  
  // Add leave type entitlement to group - FIXED (No yos_brackets sent)
  const handleAddEntitlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;
    
    try {
      // Send ONLY leave_type_id
      const requestData = {
        leave_type_id: parseInt(entitlementForm.leave_type_id)
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/api/leave-entitlement-groups/${selectedGroup.id}/entitlements`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setShowEntitlementModal(false);
      setEntitlementForm({ leave_type_id: '' });
      fetchGroups(currentPage, itemsPerPage);
      showNotification('Leave entitlement added to group', 'success');
    } catch (error: any) {
      console.error('Error adding entitlement:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Error adding entitlement';
      showNotification(errorMessage, 'error');
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
      
      fetchGroups(currentPage, itemsPerPage);
      showNotification('Group deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting group:', error);
      showNotification(error.response?.data?.error || 'Error deleting group', 'error');
    }
  };
  
  // Toggle group active status
  const toggleGroupActive = async (groupId: number, currentStatus: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/toggle-active`,
        { 
          is_active: !currentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }
      );
      
      fetchGroups(currentPage, itemsPerPage);
      showNotification(`Group ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
    } catch (error: any) {
      console.error('Error toggling group status:', error);
      showNotification(error.response?.data?.error || 'Error toggling group status', 'error');
    }
  };
  
  // Toggle entitlement details view
  const toggleEntitlementDetails = (groupId: number) => {
    if (showEntitlementDetails === groupId) {
      setShowEntitlementDetails(null);
    } else {
      setShowEntitlementDetails(groupId);
    }
  };
  
  // Toggle employee details view
  const toggleEmployeeDetails = (groupId: number) => {
    if (showEmployeeDetails === groupId) {
      setShowEmployeeDetails(null);
    } else {
      setShowEmployeeDetails(groupId);
    }
  };
  
  // Get YOS brackets summary for display
  const getYosSummary = (yosBrackets: YearOfServiceBracket[] = []) => {
    if (!yosBrackets || yosBrackets.length === 0) {
      return 'Using leave type defaults';
    }
    
    return `${yosBrackets.length} bracket(s)`;
  };
  
  // Format YOS bracket for display
  const formatYosBracket = (bracket: YearOfServiceBracket) => {
    const maxYears = bracket.max_years === null || bracket.max_years === undefined ? '∞' : bracket.max_years;
    return `${bracket.min_years}-${maxYears} years: ${bracket.days} days`;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Pagination controls
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
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
  
  // Tab navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case 'leave-types':
        return <LeaveTypesManagement />;
        
      case 'groups':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Leave Entitlement Groups</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Create groups, assign leave entitlements, and manage employee assignments
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <FaPlus className="mr-2" />
                Create Group
              </button>
            </div>
            
            {/* Items Per Page Selector */}
            <div className="flex justify-between items-center">
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
              
              <div className="text-sm">
                Showing {groups.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(groups) && groups.map(group => (
                  <div key={group.id} className="card bg-base-100 shadow-sm border">
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="card-title text-lg">{group.group_name}</h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {group.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${group.is_active ? 'badge-success' : 'badge-error'}`}>
                            {group.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => toggleGroupActive(group.id, group.is_active)}
                            className="btn btn-xs btn-ghost"
                            title={group.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {group.is_active ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="stat p-4 bg-base-200 rounded-lg">
                          <div className="stat-title">Employees</div>
                          <div className="stat-value text-lg">{group.employee_count || 0}</div>
                          <div className="stat-desc">
                            {group.employee_count && group.employee_count > 0 && (
                              <button
                                onClick={() => toggleEmployeeDetails(group.id)}
                                className="link link-primary text-xs"
                              >
                                {showEmployeeDetails === group.id ? 'Hide list' : 'View employees'}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="stat p-4 bg-base-200 rounded-lg">
                          <div className="stat-title">Leave Types</div>
                          <div className="stat-value text-lg">{group.leave_types?.length || 0}</div>
                          <div className="stat-desc">
                            {group.leave_types && group.leave_types.length > 0 && (
                              <button
                                onClick={() => toggleEntitlementDetails(group.id)}
                                className="link link-primary text-xs"
                              >
                                {showEntitlementDetails === group.id ? 'Hide details' : 'View details'}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="stat p-4 bg-base-200 rounded-lg">
                          <div className="stat-title">Created</div>
                          <div className="stat-value text-sm">
                            {group.created_at ? formatDate(group.created_at) : 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Assigned Employees Section */}
                      {showEmployeeDetails === group.id && group.assigned_employees && group.assigned_employees.length > 0 && (
                        <div className="mt-4 border rounded-lg p-4">
                          <h5 className="font-semibold mb-3">Assigned Employees ({group.assigned_employees.length})</h5>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {group.assigned_employees.map(employee => (
                              <div key={employee.id} className="flex justify-between items-center p-2 bg-base-200 rounded">
                                <div>
                                  <div className="font-medium">{employee.employee_name || 'Unnamed'}</div>
                                  <div className="text-xs text-slate-500">
                                    {employee.employee_code || 'No code'} • {employee.department_name || 'No department'}
                                  </div>
                                </div>
                                <div className="text-xs text-slate-500">
                                  Since: {formatDate(employee.effective_date)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Leave Types Section */}
                      {showEntitlementDetails === group.id && group.leave_types && group.leave_types.length > 0 && (
                        <div className="mt-4 border rounded-lg p-4">
                          <h5 className="font-semibold mb-3">Leave Entitlements ({group.leave_types.length})</h5>
                          <div className="space-y-3">
                            {group.leave_types.map(entitlement => (
                              <div key={entitlement.id} className="border-b pb-3 last:border-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{entitlement.leave_type_name || 'Unknown'}</div>
                                    <div className="text-sm text-slate-500">
                                      {getYosSummary(entitlement.yos_brackets)}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Remove ${entitlement.leave_type_name} from group?`)) {
                                        axios.delete(
                                          `${API_BASE_URL}/api/leave-entitlement-groups/${group.id}/entitlements/${entitlement.id}`,
                                          {
                                            headers: {
                                              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
                                            }
                                          }
                                        ).then(() => {
                                          fetchGroups(currentPage, itemsPerPage);
                                          showNotification('Entitlement removed', 'success');
                                        }).catch(error => {
                                          console.error('Error removing entitlement:', error);
                                          showNotification('Error removing entitlement', 'error');
                                        });
                                      }
                                    }}
                                    className="btn btn-xs btn-error"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                                
                                {/* Show YOS brackets if they exist */}
                                {entitlement.yos_brackets && entitlement.yos_brackets.length > 0 && (
                                  <div className="mt-2 ml-4">
                                    <div className="text-sm font-medium mb-1">YOS Brackets:</div>
                                    <div className="space-y-1">
                                      {entitlement.yos_brackets.map((bracket, index) => (
                                        <div key={index} className="text-sm bg-base-200 p-2 rounded">
                                          {formatYosBracket(bracket)}
                                          {bracket.renewal_period && bracket.renewal_period !== 'YEARLY' && (
                                            <span className="text-xs text-slate-500 ml-2">
                                              ({bracket.renewal_period.toLowerCase()} renewal)
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="card-actions justify-end mt-4">
                        <button
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowAssignModal(true);
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          <FaUserPlus className="mr-1" />
                          Assign Employees
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowEntitlementModal(true);
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          <FaPlus className="mr-1" />
                          Add Entitlement
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="btn btn-sm btn-error"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!Array.isArray(groups) || groups.length === 0) && (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FaUsers className="h-16 w-16 text-slate-400" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-slate-600">
                          No entitlement groups
                        </h3>
                        <p className="text-sm text-slate-500">
                          Create groups to assign leave entitlements and employees
                        </p>
                      </div>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary mt-4"
                      >
                        <FaPlus className="mr-2" />
                        Create First Group
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
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
          </div>
        );
        
      default:
        return <LeaveTypesManagement />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Leave Entitlement Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure leave types and manage entitlement groups with employee assignments
          </p>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed bg-base-200 p-1">
        <button
          className={`tab tab-lg flex items-center gap-2 ${activeTab === 'leave-types' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('leave-types')}
        >
          <FaCalendarAlt />
          Leave Types
        </button>
        <button
          className={`tab tab-lg flex items-center gap-2 ${activeTab === 'groups' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          <FaUsers />
          Entitlement Groups
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
      
      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create Leave Entitlement Group</h3>
            
            <form onSubmit={handleCreateGroup}>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Group Name</span>
                    <span className="label-text-alt text-red-500">*</span>
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
          <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}></div>
        </div>
      )}
      
      {/* Assign Employees Modal */}
      {showAssignModal && selectedGroup && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                Assign Employees  to {selectedGroup.group_name}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-sm btn-ghost"
              >
                <FaTimes />
              </button>
            </div>
            
            <EmployeeBulkAssignment 
              groupId={selectedGroup.id}
              onClose={() => setShowAssignModal(false)}
              onSuccess={() => {
                setShowAssignModal(false);
                fetchGroups(currentPage, itemsPerPage);
              }}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}></div>
        </div>
      )}
      
      {/* Add Leave Entitlement Modal - SIMPLIFIED */}
      {showEntitlementModal && selectedGroup && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Add Leave Entitlement to {selectedGroup.group_name}
            </h3>
            
            <form onSubmit={handleAddEntitlement}>
              <div className="space-y-6">
                {/* Leave Type Selection */}
                <div>
                  <label className="label">
                    <span className="label-text">Select Leave Type</span>
                    <span className="label-text-alt text-red-500">*</span>
                  </label>
                  <select
                    value={entitlementForm.leave_type_id}
                    onChange={(e) => {
                      setEntitlementForm({ 
                        ...entitlementForm, 
                        leave_type_id: e.target.value 
                      });
                    }}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Choose a leave type</option>
                    {leaveTypes
                      .filter((lt: LeaveType) => lt.is_active)
                      .map((leaveType: LeaveType) => (
                        <option key={leaveType.id} value={leaveType.id.toString()}>
                          {leaveType.leave_type_name} ({leaveType.code})
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                {/* Preview of selected leave type */}
                {entitlementForm.leave_type_id && (
                  <div className="bg-base-200 p-4 rounded-lg">
                    <div className="font-medium mb-2">Leave Type Preview:</div>
                    {(() => {
                      const selectedLeaveType = leaveTypes.find(
                        lt => lt.id.toString() === entitlementForm.leave_type_id
                      );
                      
                      if (!selectedLeaveType) return null;
                      
                      return (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Name:</span> {selectedLeaveType.leave_type_name}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Code:</span> {selectedLeaveType.code}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Max Days:</span> {selectedLeaveType.max_days}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Status:</span> 
                            <span className={`badge ml-2 ${selectedLeaveType.is_active ? 'badge-success' : 'badge-error'}`}>
                              {selectedLeaveType.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {selectedLeaveType.yos_brackets && selectedLeaveType.yos_brackets.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm font-medium">YOS Brackets (will be inherited):</div>
                              <div className="space-y-1 mt-1">
                                {selectedLeaveType.yos_brackets.map((bracket, index) => (
                                  <div key={index} className="text-sm bg-base-100 p-2 rounded">
                                    {formatYosBracket(bracket)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                <div className="alert alert-info">
                  <FaInfoCircle />
                  <div>
                    <span className="font-medium">Note:</span> This group will inherit the leave type's Year of Service brackets.
                  </div>
                </div>
              </div>
              
              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEntitlementModal(false);
                    setEntitlementForm({ leave_type_id: '' });
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!entitlementForm.leave_type_id}
                >
                  Add Entitlement
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => {
            setShowEntitlementModal(false);
            setEntitlementForm({ leave_type_id: '' });
          }}></div>
        </div>
      )}
    </div>
  );
};

export default LeaveEntitlementManagement;
