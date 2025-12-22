// // // // // // frontend/components/admin/PermissionManager.js
// // // // // "use client";

// // // // // import { useState, useEffect } from 'react';
// // // // // import { API_BASE_URL } from '../../config';
// // // // // export default function PermissionManager() {
// // // // //   const [users, setUsers] = useState([]);
// // // // //   const [selectedUser, setSelectedUser] = useState(null);
// // // // //   const [userPermissions, setUserPermissions] = useState([]);
// // // // //   const [availableModules, setAvailableModules] = useState([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [message, setMessage] = useState({ type: '', text: '' });
// // // // //   const [searchTerm, setSearchTerm] = useState('');

// // // // //   // Available modules configuration
// // // // //   const MODULES_CONFIG = [
// // // // //     // Core Modules
// // // // //     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core' },
// // // // //     { name: 'Announcement', description: 'View company announcements', category: 'Core' },
// // // // //     { name: 'Leave', description: 'Access leave management system', category: 'Core' },
// // // // //     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core' },
    
// // // // //     // Employee Management
// // // // //     { name: 'Employee', description: 'Employee management system', category: 'Employee Management' },
// // // // //     { name: 'Employee.View', description: 'View employee profiles', category: 'Employee Management' },
// // // // //     { name: 'Employee.Create', description: 'Create new employees', category: 'Employee Management' },
// // // // //     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management' },
    
// // // // //     // Company Management
// // // // //     { name: 'Company', description: 'Company management system', category: 'Company Management' },
// // // // //     { name: 'Company.View', description: 'View companies', category: 'Company Management' },
// // // // //     { name: 'Company.Create', description: 'Create new companies', category: 'Company Management' },
    
// // // // //     // Payroll System
// // // // //     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll' },
// // // // //     { name: 'Payroll.Run', description: 'Run payroll processing', category: 'Payroll' },
// // // // //     { name: 'Payroll.Setup', description: 'Payroll system setup', category: 'Payroll' },
// // // // //     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll' },
// // // // //     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll' },
    
// // // // //     // Asset Management
// // // // //     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets' },
// // // // //     { name: 'AssetManagement.View', description: 'View all assets', category: 'Assets' },
// // // // //     { name: 'AssetManagement.Create', description: 'Create new assets', category: 'Assets' },
// // // // //     { name: 'AssetManagement.Approve', description: 'Approve asset requests', category: 'Assets' },
// // // // //     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets' },
    
// // // // //     // Claims Management
// // // // //     { name: 'Claims', description: 'Claims management system', category: 'Claims' },
// // // // //     { name: 'Claims.View', description: 'View claims', category: 'Claims' },
// // // // //     { name: 'Claims.Manage', description: 'Manage all claims', category: 'Claims' },
    
// // // // //     // Other Modules
// // // // //     { name: 'Scheduler', description: 'Schedule management', category: 'Other' },
// // // // //     { name: 'Feedback', description: 'Feedback system', category: 'Other' },
// // // // //     { name: 'MasterData', description: 'Master data management', category: 'Other' },
// // // // //     { name: 'Configuration', description: 'System configuration', category: 'Other' }
// // // // //   ];

// // // // //   useEffect(() => {
// // // // //     fetchUsers();
// // // // //     setAvailableModules(MODULES_CONFIG);
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (selectedUser) {
// // // // //       fetchUserPermissions(selectedUser.id);
// // // // //     }
// // // // //   }, [selectedUser]);

// // // // //   const showMessage = (text, type = 'success') => {
// // // // //     setMessage({ type, text });
// // // // //     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
// // // // //   };

// // // // //   const fetchUsers = async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const token = localStorage.getItem('hrms_token');
// // // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/users`, {
// // // // //         headers: { 
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });

// // // // //       if (!response.ok) {
// // // // //         throw new Error(`HTTP error! status: ${response.status}`);
// // // // //       }

// // // // //       const data = await response.json();
// // // // //       if (data.success) {
// // // // //         setUsers(data.users);
// // // // //       } else {
// // // // //         throw new Error(data.message || 'Failed to fetch users');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching users:', error);
// // // // //       showMessage('Failed to load users: ' + error.message, 'error');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const fetchUserPermissions = async (userId) => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const token = localStorage.getItem('hrms_token');
// // // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
// // // // //         headers: { 
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       });

// // // // //       if (!response.ok) {
// // // // //         throw new Error(`HTTP error! status: ${response.status}`);
// // // // //       }

// // // // //       const data = await response.json();
// // // // //       if (data.success) {
// // // // //         setUserPermissions(data.permissions.modules || []);
// // // // //       } else {
// // // // //         throw new Error(data.message || 'Failed to fetch user permissions');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching user permissions:', error);
// // // // //       showMessage('Failed to load user permissions: ' + error.message, 'error');
// // // // //       setUserPermissions([]);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const updatePermission = async (moduleName, permissionType, value) => {
// // // // //     if (!selectedUser) return;

// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const token = localStorage.getItem('hrms_token');
      
// // // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         },
// // // // //         body: JSON.stringify({
// // // // //           userId: selectedUser.id,
// // // // //           moduleName,
// // // // //           permissions: {
// // // // //             [permissionType]: value
// // // // //           }
// // // // //         })
// // // // //       });

// // // // //       const data = await response.json();
// // // // //       if (data.success) {
// // // // //         showMessage(`Permission ${value ? 'granted' : 'revoked'} successfully`);
// // // // //         // Refresh user permissions
// // // // //         fetchUserPermissions(selectedUser.id);
// // // // //       } else {
// // // // //         throw new Error(data.message || 'Failed to update permission');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error updating permission:', error);
// // // // //       showMessage('Failed to update permission: ' + error.message, 'error');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const bulkUpdatePermissions = async (moduleName, permissions) => {
// // // // //     if (!selectedUser) return;

// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const token = localStorage.getItem('hrms_token');
      
// // // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         },
// // // // //         body: JSON.stringify({
// // // // //           userId: selectedUser.id,
// // // // //           moduleName,
// // // // //           permissions
// // // // //         })
// // // // //       });

// // // // //       const data = await response.json();
// // // // //       if (data.success) {
// // // // //         showMessage('Permissions updated successfully');
// // // // //         fetchUserPermissions(selectedUser.id);
// // // // //       } else {
// // // // //         throw new Error(data.message || 'Failed to update permissions');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error updating permissions:', error);
// // // // //       showMessage('Failed to update permissions: ' + error.message, 'error');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const revokeAllPermissions = async (userId) => {
// // // // //     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const token = localStorage.getItem('hrms_token');
      
// // // // //       // Revoke each permission individually
// // // // //       const revokePromises = userPermissions
// // // // //         .filter(perm => perm.source === 'user')
// // // // //         .map(perm => 
// // // // //           fetch(`${API_BASE_URL}/api/permissions/revoke`, {
// // // // //             method: 'POST',
// // // // //             headers: {
// // // // //               'Authorization': `Bearer ${token}`,
// // // // //               'Content-Type': 'application/json'
// // // // //             },
// // // // //             body: JSON.stringify({
// // // // //               userId: selectedUser.id,
// // // // //               moduleName: perm.name
// // // // //             })
// // // // //           })
// // // // //         );

// // // // //       await Promise.all(revokePromises);
// // // // //       showMessage('All custom permissions revoked successfully');
// // // // //       fetchUserPermissions(selectedUser.id);
// // // // //     } catch (error) {
// // // // //       console.error('Error revoking permissions:', error);
// // // // //       showMessage('Failed to revoke permissions: ' + error.message, 'error');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const getPermissionValue = (moduleName, permissionType) => {
// // // // //     const userPerm = userPermissions.find(p => p.name === moduleName);
// // // // //     return userPerm ? userPerm[permissionType] : false;
// // // // //   };

// // // // //   const getPermissionSource = (moduleName) => {
// // // // //     const userPerm = userPermissions.find(p => p.name === moduleName);
// // // // //     return userPerm ? userPerm.source : 'role';
// // // // //   };

// // // // //   const filteredUsers = users.filter(user =>
// // // // //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //     user.role.toLowerCase().includes(searchTerm.toLowerCase())
// // // // //   );

// // // // //   // Group modules by category
// // // // //   const groupedModules = availableModules.reduce((groups, module) => {
// // // // //     const category = module.category;
// // // // //     if (!groups[category]) {
// // // // //       groups[category] = [];
// // // // //     }
// // // // //     groups[category].push(module);
// // // // //     return groups;
// // // // //   }, {});

// // // // //   return (
// // // // //     <div className="p-6 max-w-7xl mx-auto">
// // // // //       {/* Header */}
// // // // //       <div className="mb-8">
// // // // //         <h1 className="text-3xl font-bold text-gray-900 mb-2">User Permissions</h1>
// // // // //         <p className="text-gray-600">
// // // // //           Manage individual user permissions. User-specific permissions override role defaults.
// // // // //         </p>
// // // // //       </div>

// // // // //       {/* Message Alert */}
// // // // //       {message.text && (
// // // // //         <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mb-6`}>
// // // // //           <span>{message.text}</span>
// // // // //         </div>
// // // // //       )}

// // // // //       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
// // // // //         {/* User List Panel */}
// // // // //         <div className="xl:col-span-1">
// // // // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// // // // //             <div className="p-4 border-b border-gray-200">
// // // // //               <h2 className="text-lg font-semibold text-gray-800">Users</h2>
              
// // // // //               {/* Search */}
// // // // //               <div className="mt-3">
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   placeholder="Search users..."
// // // // //                   value={searchTerm}
// // // // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // // // //                   className="input input-bordered input-sm w-full"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>

// // // // //             <div className="max-h-96 overflow-y-auto">
// // // // //               {loading && !users.length ? (
// // // // //                 <div className="p-8 text-center">
// // // // //                   <span className="loading loading-spinner loading-lg"></span>
// // // // //                   <p className="mt-2 text-gray-500">Loading users...</p>
// // // // //                 </div>
// // // // //               ) : filteredUsers.length === 0 ? (
// // // // //                 <div className="p-8 text-center text-gray-500">
// // // // //                   No users found
// // // // //                 </div>
// // // // //               ) : (
// // // // //                 <div className="divide-y divide-gray-100">
// // // // //                   {filteredUsers.map(user => (
// // // // //                     <div
// // // // //                       key={user.id}
// // // // //                       className={`p-4 cursor-pointer transition-colors ${
// // // // //                         selectedUser?.id === user.id 
// // // // //                           ? 'bg-blue-50 border-r-4 border-blue-500' 
// // // // //                           : 'hover:bg-gray-50'
// // // // //                       }`}
// // // // //                       onClick={() => setSelectedUser(user)}
// // // // //                     >
// // // // //                       <div className="flex items-start justify-between">
// // // // //                         <div className="flex-1 min-w-0">
// // // // //                           <div className="flex items-center gap-2 mb-1">
// // // // //                             <h3 className="font-medium text-gray-900 truncate">
// // // // //                               {user.name}
// // // // //                             </h3>
// // // // //                             <span className={`badge badge-sm ${
// // // // //                               user.role === 'admin' ? 'badge-error' :
// // // // //                               user.role === 'manager' ? 'badge-warning' :
// // // // //                               user.role === 'supervisor' ? 'badge-info' : 'badge-success'
// // // // //                             }`}>
// // // // //                               {user.role}
// // // // //                             </span>
// // // // //                           </div>
// // // // //                           <p className="text-sm text-gray-600 truncate mb-1">
// // // // //                             {user.email}
// // // // //                           </p>
// // // // //                           {user.module_names && (
// // // // //                             <p className="text-xs text-gray-500">
// // // // //                               Custom permissions: {user.module_names.split(',').filter(Boolean).length}
// // // // //                             </p>
// // // // //                           )}
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   ))}
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Permission Management Panel */}
// // // // //         <div className="xl:col-span-3">
// // // // //           {selectedUser ? (
// // // // //             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// // // // //               {/* User Header */}
// // // // //               <div className="p-6 border-b border-gray-200">
// // // // //                 <div className="flex items-center justify-between">
// // // // //                   <div>
// // // // //                     <h2 className="text-xl font-semibold text-gray-800">
// // // // //                       Permissions for {selectedUser.name}
// // // // //                     </h2>
// // // // //                     <div className="flex items-center gap-4 mt-1">
// // // // //                       <span className="text-gray-600">{selectedUser.email}</span>
// // // // //                       <span className={`badge ${
// // // // //                         selectedUser.role === 'admin' ? 'badge-error' :
// // // // //                         selectedUser.role === 'manager' ? 'badge-warning' :
// // // // //                         selectedUser.role === 'supervisor' ? 'badge-info' : 'badge-success'
// // // // //                       }`}>
// // // // //                         {selectedUser.role}
// // // // //                       </span>
// // // // //                     </div>
// // // // //                   </div>
                  
// // // // //                   <div className="flex gap-2">
// // // // //                     <button
// // // // //                       onClick={() => revokeAllPermissions(selectedUser.id)}
// // // // //                       className="btn btn-outline btn-error btn-sm"
// // // // //                       disabled={loading}
// // // // //                     >
// // // // //                       Revoke All Custom
// // // // //                     </button>
// // // // //                     <button
// // // // //                       onClick={() => fetchUserPermissions(selectedUser.id)}
// // // // //                       className="btn btn-outline btn-sm"
// // // // //                       disabled={loading}
// // // // //                     >
// // // // //                       Refresh
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>
                
// // // // //                 <div className="mt-4 p-3 bg-blue-50 rounded-lg">
// // // // //                   <div className="flex items-center gap-2 text-sm text-blue-800">
// // // // //                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
// // // // //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// // // // //                     </svg>
// // // // //                     <span>
// // // // //                       <strong>User-specific permissions</strong> override role defaults. 
// // // // //                       Gray checkboxes show role defaults, blue show custom permissions.
// // // // //                     </span>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>

// // // // //               {/* Permissions Grid */}
// // // // //               <div className="p-6">
// // // // //                 {loading ? (
// // // // //                   <div className="text-center py-12">
// // // // //                     <span className="loading loading-spinner loading-lg"></span>
// // // // //                     <p className="mt-2 text-gray-500">Loading permissions...</p>
// // // // //                   </div>
// // // // //                 ) : (
// // // // //                   <div className="space-y-8 max-h-96 overflow-y-auto">
// // // // //                     {Object.entries(groupedModules).map(([category, modules]) => (
// // // // //                       <div key={category}>
// // // // //                         <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
// // // // //                           {category}
// // // // //                         </h3>
                        
// // // // //                         <div className="grid gap-4">
// // // // //                           {modules.map(module => {
// // // // //                             const source = getPermissionSource(module.name);
// // // // //                             const isCustom = source === 'user';
                            
// // // // //                             return (
// // // // //                               <div key={module.name} className="border rounded-lg p-4">
// // // // //                                 <div className="flex items-start justify-between mb-3">
// // // // //                                   <div>
// // // // //                                     <h4 className="font-medium text-gray-900">
// // // // //                                       {module.name}
// // // // //                                       {isCustom && (
// // // // //                                         <span className="badge badge-sm badge-info ml-2">Custom</span>
// // // // //                                       )}
// // // // //                                     </h4>
// // // // //                                     <p className="text-sm text-gray-600 mt-1">
// // // // //                                       {module.description}
// // // // //                                     </p>
// // // // //                                   </div>
// // // // //                                 </div>

// // // // //                                 {/* Quick Actions */}
// // // // //                                 <div className="flex gap-2 mb-3">
// // // // //                                   <button
// // // // //                                     onClick={() => bulkUpdatePermissions(module.name, {
// // // // //                                       can_view: true,
// // // // //                                       can_create: true,
// // // // //                                       can_edit: true,
// // // // //                                       can_delete: true,
// // // // //                                       can_approve: true
// // // // //                                     })}
// // // // //                                     className="btn btn-xs btn-outline btn-success"
// // // // //                                     disabled={loading}
// // // // //                                   >
// // // // //                                     Grant All
// // // // //                                   </button>
// // // // //                                   <button
// // // // //                                     onClick={() => bulkUpdatePermissions(module.name, {
// // // // //                                       can_view: false,
// // // // //                                       can_create: false,
// // // // //                                       can_edit: false,
// // // // //                                       can_delete: false,
// // // // //                                       can_approve: false
// // // // //                                     })}
// // // // //                                     className="btn btn-xs btn-outline btn-error"
// // // // //                                     disabled={loading}
// // // // //                                   >
// // // // //                                     Revoke All
// // // // //                                   </button>
// // // // //                                 </div>

// // // // //                                 {/* Permission Toggles */}
// // // // //                                 <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
// // // // //                                   {['view', 'create', 'edit', 'delete', 'approve'].map(action => {
// // // // //                                     const permissionType = `can_${action}`;
// // // // //                                     const isChecked = getPermissionValue(module.name, permissionType);
                                    
// // // // //                                     return (
// // // // //                                       <label key={action} className="flex items-center gap-2 cursor-pointer">
// // // // //                                         <input
// // // // //                                           type="checkbox"
// // // // //                                           checked={isChecked}
// // // // //                                           onChange={(e) => updatePermission(module.name, permissionType, e.target.checked)}
// // // // //                                           disabled={loading}
// // // // //                                           className={`checkbox checkbox-sm ${
// // // // //                                             isCustom ? 'checkbox-primary' : 'checkbox-gray-300'
// // // // //                                           }`}
// // // // //                                         />
// // // // //                                         <div className="flex flex-col">
// // // // //                                           <span className="text-sm font-medium capitalize">
// // // // //                                             {action}
// // // // //                                           </span>
// // // // //                                           {isCustom && (
// // // // //                                             <span className="text-xs text-blue-600">Custom</span>
// // // // //                                           )}
// // // // //                                         </div>
// // // // //                                       </label>
// // // // //                                     );
// // // // //                                   })}
// // // // //                                 </div>
// // // // //                               </div>
// // // // //                             );
// // // // //                           })}
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           ) : (
// // // // //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
// // // // //               <div className="text-center text-gray-500">
// // // // //                 <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// // // // //                 </svg>
// // // // //                 <h3 className="text-lg font-medium mb-2">Select a User</h3>
// // // // //                 <p>Choose a user from the list to manage their permissions</p>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Legend */}
// // // // //       <div className="mt-8 p-4 bg-gray-50 rounded-lg">
// // // // //         <h4 className="font-medium text-gray-800 mb-2">Permission Legend</h4>
// // // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
// // // // //           <div className="flex items-center gap-2">
// // // // //             <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
// // // // //             <span>Role Default - Inherited from user's role</span>
// // // // //           </div>
// // // // //           <div className="flex items-center gap-2">
// // // // //             <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 rounded"></div>
// // // // //             <span>Custom Permission - Specifically granted to this user</span>
// // // // //           </div>
// // // // //           <div className="flex items-center gap-2">
// // // // //             <div className="badge badge-info badge-sm">Custom</div>
// // // // //             <span>User has custom permissions for this module</span>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // frontend/components/admin/PermissionManager.js
// // // // "use client";

// // // // import { useState, useEffect } from 'react';
// // // // import { API_BASE_URL } from '../../config';

// // // // export default function PermissionManager() {
// // // //   const [users, setUsers] = useState([]);
// // // //   const [selectedUser, setSelectedUser] = useState(null);
// // // //   const [userPermissions, setUserPermissions] = useState([]);
// // // //   const [availableModules, setAvailableModules] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [message, setMessage] = useState({ type: '', text: '' });
// // // //   const [searchTerm, setSearchTerm] = useState('');
// // // //   const [activeCategory, setActiveCategory] = useState('All');

// // // //   // Simplified modules configuration - just access control
// // // //   const MODULES_CONFIG = [
// // // //     // Core Modules
// // // //     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
// // // //     { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
// // // //     { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
// // // //     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
    
// // // //     // Employee Management
// // // //     { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
// // // //     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
    
// // // //     // Company Management
// // // //     { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
    
// // // //     // Payroll System
// // // //     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
// // // //     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
// // // //     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
    
// // // //     // Asset Management
// // // //     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
// // // //     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
    
// // // //     // Claims Management
// // // //     { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
    
// // // //     // Other Modules
// // // //     { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
// // // //     { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
// // // //     { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
// // // //     { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
// // // //   ];

// // // //   useEffect(() => {
// // // //     fetchUsers();
// // // //     setAvailableModules(MODULES_CONFIG);
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     if (selectedUser) {
// // // //       fetchUserPermissions(selectedUser.id);
// // // //     }
// // // //   }, [selectedUser]);

// // // //   const showMessage = (text, type = 'success') => {
// // // //     setMessage({ type, text });
// // // //     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
// // // //   };

// // // //   const fetchUsers = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const token = localStorage.getItem('hrms_token');
// // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/users`, {
// // // //         headers: { 
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         }
// // // //       });

// // // //       if (!response.ok) {
// // // //         throw new Error(`HTTP error! status: ${response.status}`);
// // // //       }

// // // //       const data = await response.json();
// // // //       if (data.success) {
// // // //         setUsers(data.users);
// // // //       } else {
// // // //         throw new Error(data.message || 'Failed to fetch users');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error fetching users:', error);
// // // //       showMessage('Failed to load users: ' + error.message, 'error');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const fetchUserPermissions = async (userId) => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const token = localStorage.getItem('hrms_token');
// // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
// // // //         headers: { 
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         }
// // // //       });

// // // //       if (!response.ok) {
// // // //         throw new Error(`HTTP error! status: ${response.status}`);
// // // //       }

// // // //       const data = await response.json();
// // // //       if (data.success) {
// // // //         setUserPermissions(data.permissions?.modules || []);
// // // //       } else {
// // // //         throw new Error(data.message || 'Failed to fetch user permissions');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error fetching user permissions:', error);
// // // //       showMessage('Failed to load user permissions: ' + error.message, 'error');
// // // //       setUserPermissions([]);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const toggleModuleAccess = async (moduleName, hasAccess) => {
// // // //     if (!selectedUser) return;

// // // //     try {
// // // //       setLoading(true);
// // // //       const token = localStorage.getItem('hrms_token');
      
// // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         },
// // // //         body: JSON.stringify({
// // // //           userId: selectedUser.id,
// // // //           moduleName,
// // // //           permissions: {
// // // //             can_view: hasAccess,
// // // //             can_create: hasAccess,
// // // //             can_edit: hasAccess,
// // // //             can_delete: hasAccess,
// // // //             can_approve: hasAccess
// // // //           }
// // // //         })
// // // //       });

// // // //       const data = await response.json();
      
// // // //       if (data.success) {
// // // //         showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
        
// // // //         // Update local state immediately for better UX
// // // //         setUserPermissions(prev => {
// // // //           const existingIndex = prev.findIndex(p => p.name === moduleName);
// // // //           if (existingIndex >= 0) {
// // // //             const updated = [...prev];
// // // //             updated[existingIndex] = {
// // // //               ...updated[existingIndex],
// // // //               can_view: hasAccess,
// // // //               can_create: hasAccess,
// // // //               can_edit: hasAccess,
// // // //               can_delete: hasAccess,
// // // //               can_approve: hasAccess,
// // // //               source: 'user'
// // // //             };
// // // //             return updated;
// // // //           } else {
// // // //             return [...prev, {
// // // //               name: moduleName,
// // // //               can_view: hasAccess,
// // // //               can_create: hasAccess,
// // // //               can_edit: hasAccess,
// // // //               can_delete: hasAccess,
// // // //               can_approve: hasAccess,
// // // //               source: 'user'
// // // //             }];
// // // //           }
// // // //         });
        
// // // //       } else {
// // // //         throw new Error(data.message || 'Failed to update permission');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error updating permission:', error);
// // // //       showMessage('Failed to update permission: ' + error.message, 'error');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const bulkUpdatePermissions = async (modules, hasAccess) => {
// // // //     if (!selectedUser) return;

// // // //     try {
// // // //       setLoading(true);
// // // //       const token = localStorage.getItem('hrms_token');
      
// // // //       const updatePromises = modules.map(moduleName =>
// // // //         fetch(`${API_BASE_URL}/api/permissions/grant`, {
// // // //           method: 'POST',
// // // //           headers: {
// // // //             'Authorization': `Bearer ${token}`,
// // // //             'Content-Type': 'application/json'
// // // //           },
// // // //           body: JSON.stringify({
// // // //             userId: selectedUser.id,
// // // //             moduleName,
// // // //             permissions: {
// // // //               can_view: hasAccess,
// // // //               can_create: hasAccess,
// // // //               can_edit: hasAccess,
// // // //               can_delete: hasAccess,
// // // //               can_approve: hasAccess
// // // //             }
// // // //           })
// // // //         })
// // // //       );

// // // //       await Promise.all(updatePromises);
// // // //       showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
      
// // // //       setUserPermissions(prev => {
// // // //         const updated = [...prev];
// // // //         modules.forEach(moduleName => {
// // // //           const existingIndex = updated.findIndex(p => p.name === moduleName);
// // // //           if (existingIndex >= 0) {
// // // //             updated[existingIndex] = {
// // // //               ...updated[existingIndex],
// // // //               can_view: hasAccess,
// // // //               can_create: hasAccess,
// // // //               can_edit: hasAccess,
// // // //               can_delete: hasAccess,
// // // //               can_approve: hasAccess,
// // // //               source: 'user'
// // // //             };
// // // //           } else {
// // // //             updated.push({
// // // //               name: moduleName,
// // // //               can_view: hasAccess,
// // // //               can_create: hasAccess,
// // // //               can_edit: hasAccess,
// // // //               can_delete: hasAccess,
// // // //               can_approve: hasAccess,
// // // //               source: 'user'
// // // //             });
// // // //           }
// // // //         });
// // // //         return updated;
// // // //       });
      
// // // //     } catch (error) {
// // // //       console.error('Error bulk updating permissions:', error);
// // // //       showMessage('Failed to update permissions: ' + error.message, 'error');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const revokeAllPermissions = async () => {
// // // //     if (!selectedUser) return;
    
// // // //     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setLoading(true);
// // // //       const token = localStorage.getItem('hrms_token');
      
// // // //       const revokePromises = userPermissions
// // // //         .filter(perm => perm.source === 'user')
// // // //         .map(perm => 
// // // //           fetch(`${API_BASE_URL}/api/permissions/revoke`, {
// // // //             method: 'POST',
// // // //             headers: {
// // // //               'Authorization': `Bearer ${token}`,
// // // //               'Content-Type': 'application/json'
// // // //             },
// // // //             body: JSON.stringify({
// // // //               userId: selectedUser.id,
// // // //               moduleName: perm.name
// // // //             })
// // // //           })
// // // //         );

// // // //       await Promise.all(revokePromises);
// // // //       showMessage('All custom permissions revoked successfully');
// // // //       setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
      
// // // //     } catch (error) {
// // // //       console.error('Error revoking permissions:', error);
// // // //       showMessage('Failed to revoke permissions: ' + error.message, 'error');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const hasModuleAccess = (moduleName) => {
// // // //     const userPerm = userPermissions.find(p => p.name === moduleName);
// // // //     if (userPerm) {
// // // //       if (userPerm.can_access !== undefined) {
// // // //         return Boolean(userPerm.can_access);
// // // //       }
// // // //       const hasAnyPermission = userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve;
// // // //       return Boolean(hasAnyPermission);
// // // //     }
// // // //     return false;
// // // //   };

// // // //   const getPermissionSource = (moduleName) => {
// // // //     const userPerm = userPermissions.find(p => p.name === moduleName);
// // // //     return userPerm ? (userPerm.source || 'role') : 'role';
// // // //   };

// // // //   const filteredUsers = users.filter(user =>
// // // //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //     user.role.toLowerCase().includes(searchTerm.toLowerCase())
// // // //   );

// // // //   // Get unique categories for filter
// // // //   const categories = ['All', ...new Set(availableModules.map(module => module.category))];
  
// // // //   // Filter modules by active category
// // // //   const filteredModules = activeCategory === 'All' 
// // // //     ? availableModules 
// // // //     : availableModules.filter(module => module.category === activeCategory);

// // // //   // Group filtered modules by category
// // // //   const groupedModules = filteredModules.reduce((groups, module) => {
// // // //     const category = module.category;
// // // //     if (!groups[category]) {
// // // //       groups[category] = [];
// // // //     }
// // // //     groups[category].push(module);
// // // //     return groups;
// // // //   }, {});

// // // //   // Stats for selected user
// // // //   const customPermissionsCount = userPermissions.filter(perm => perm.source === 'user').length;
// // // //   const totalAccessCount = userPermissions.filter(perm => hasModuleAccess(perm.name)).length;

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50/30 p-6">
// // // //       {/* Header */}
// // // //       <div className="mb-8">
// // // //         <div className="flex items-center justify-between">
// // // //           <div>
// // // //             <h1 className="text-2xl font-bold text-gray-900 mb-2">User Permissions Management</h1>
// // // //             <p className="text-gray-600 text-sm">
// // // //               Manage individual user permissions and access controls across the system
// // // //             </p>
// // // //           </div>
// // // //           <div className="flex items-center gap-3">
// // // //             <div className="text-right">
// // // //               <div className="text-sm text-gray-500">Total Users</div>
// // // //               <div className="text-lg font-semibold text-gray-900">{users.length}</div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Message Alert */}
// // // //       {message.text && (
// // // //         <div className={`mb-6 transition-all duration-300 ${
// // // //           message.type === 'error' 
// // // //             ? 'bg-red-50 border border-red-200 text-red-700' 
// // // //             : 'bg-green-50 border border-green-200 text-green-700'
// // // //         } px-4 py-3 rounded-lg flex items-center gap-3`}>
// // // //           <div className={`w-2 h-2 rounded-full ${
// // // //             message.type === 'error' ? 'bg-red-500' : 'bg-green-500'
// // // //           }`}></div>
// // // //           <span className="text-sm font-medium">{message.text}</span>
// // // //         </div>
// // // //       )}

// // // //       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
// // // //         {/* User List Panel */}
// // // //         <div className="xl:col-span-1">
// // // //           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
// // // //             <div className="p-5 border-b border-gray-100">
// // // //               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
// // // //                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
// // // //                 </svg>
// // // //                 Users
// // // //               </h2>
              
// // // //               {/* Search */}
// // // //               <div className="mt-4">
// // // //                 <div className="relative">
// // // //                   <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// // // //                   </svg>
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="Search users..."
// // // //                     value={searchTerm}
// // // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // // //                     className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             <div className="max-h-[500px] overflow-y-auto">
// // // //               {loading && !users.length ? (
// // // //                 <div className="p-8 text-center">
// // // //                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
// // // //                   <p className="mt-3 text-sm text-gray-500">Loading users...</p>
// // // //                 </div>
// // // //               ) : filteredUsers.length === 0 ? (
// // // //                 <div className="p-8 text-center">
// // // //                   <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// // // //                   </svg>
// // // //                   <p className="text-gray-500 text-sm">No users found</p>
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="divide-y divide-gray-100">
// // // //                   {filteredUsers.map(user => (
// // // //                     <div
// // // //                       key={user.id}
// // // //                       className={`p-4 cursor-pointer transition-all duration-200 ${
// // // //                         selectedUser?.id === user.id 
// // // //                           ? 'bg-blue-50 border-r-2 border-blue-500' 
// // // //                           : 'hover:bg-gray-50'
// // // //                       }`}
// // // //                       onClick={() => setSelectedUser(user)}
// // // //                     >
// // // //                       <div className="flex items-start justify-between">
// // // //                         <div className="flex-1 min-w-0">
// // // //                           <div className="flex items-center gap-2 mb-2">
// // // //                             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
// // // //                               {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
// // // //                             </div>
// // // //                             <div className="flex-1 min-w-0">
// // // //                               <h3 className="font-medium text-gray-900 truncate text-sm">
// // // //                                 {user.name}
// // // //                               </h3>
// // // //                               <p className="text-xs text-gray-500 truncate">
// // // //                                 {user.email}
// // // //                               </p>
// // // //                             </div>
// // // //                           </div>
// // // //                           <div className="flex items-center justify-between">
// // // //                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
// // // //                               user.role === 'admin' ? 'bg-red-100 text-red-800' :
// // // //                               user.role === 'manager' ? 'bg-orange-100 text-orange-800' :
// // // //                               user.role === 'supervisor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
// // // //                             }`}>
// // // //                               {user.role}
// // // //                             </span>
// // // //                             {user.module_names && (
// // // //                               <span className="text-xs text-gray-400">
// // // //                                 {user.module_names.split(',').filter(Boolean).length} custom
// // // //                               </span>
// // // //                             )}
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Permission Management Panel */}
// // // //         <div className="xl:col-span-3">
// // // //           {selectedUser ? (
// // // //             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
// // // //               {/* User Header */}
// // // //               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
// // // //                 <div className="flex items-center justify-between">
// // // //                   <div className="flex items-center gap-4">
// // // //                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
// // // //                       {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
// // // //                     </div>
// // // //                     <div>
// // // //                       <h2 className="text-xl font-semibold text-gray-900">
// // // //                         {selectedUser.name}
// // // //                       </h2>
// // // //                       <div className="flex items-center gap-3 mt-1">
// // // //                         <span className="text-gray-600 text-sm">{selectedUser.email}</span>
// // // //                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// // // //                           selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' :
// // // //                           selectedUser.role === 'manager' ? 'bg-orange-100 text-orange-800' :
// // // //                           selectedUser.role === 'supervisor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
// // // //                         }`}>
// // // //                           {selectedUser.role}
// // // //                         </span>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
                  
// // // //                   <div className="flex gap-2">
// // // //                     <button
// // // //                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
// // // //                       className="btn btn-success btn-sm gap-2"
// // // //                       disabled={loading}
// // // //                     >
// // // //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// // // //                       </svg>
// // // //                       Grant All
// // // //                     </button>
// // // //                     <button
// // // //                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)}
// // // //                       className="btn btn-error btn-sm gap-2"
// // // //                       disabled={loading}
// // // //                     >
// // // //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // //                       </svg>
// // // //                       Revoke All
// // // //                     </button>
// // // //                     <button
// // // //                       onClick={revokeAllPermissions}
// // // //                       className="btn btn-warning btn-sm gap-2"
// // // //                       disabled={loading}
// // // //                     >
// // // //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// // // //                       </svg>
// // // //                       Reset to Role
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
                
// // // //                 {/* Stats */}
// // // //                 <div className="grid grid-cols-3 gap-4 mt-6">
// // // //                   <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
// // // //                     <div className="text-2xl font-bold text-gray-900">{totalAccessCount}</div>
// // // //                     <div className="text-xs text-gray-500">Modules Accessed</div>
// // // //                   </div>
// // // //                   <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
// // // //                     <div className="text-2xl font-bold text-blue-600">{customPermissionsCount}</div>
// // // //                     <div className="text-xs text-gray-500">Custom Permissions</div>
// // // //                   </div>
// // // //                   <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
// // // //                     <div className="text-2xl font-bold text-gray-900">{availableModules.length - totalAccessCount}</div>
// // // //                     <div className="text-xs text-gray-500">Modules Restricted</div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               {/* Category Filter */}
// // // //               <div className="p-4 border-b border-gray-100 bg-gray-50/50">
// // // //                 <div className="flex items-center gap-2 overflow-x-auto">
// // // //                   {categories.map(category => (
// // // //                     <button
// // // //                       key={category}
// // // //                       onClick={() => setActiveCategory(category)}
// // // //                       className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
// // // //                         activeCategory === category
// // // //                           ? 'bg-blue-500 text-white shadow-sm'
// // // //                           : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
// // // //                       }`}
// // // //                     >
// // // //                       {category}
// // // //                     </button>
// // // //                   ))}
// // // //                 </div>
// // // //               </div>

// // // //               {/* Permissions Grid */}
// // // //               <div className="p-6">
// // // //                 {loading ? (
// // // //                   <div className="text-center py-12">
// // // //                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
// // // //                     <p className="mt-3 text-sm text-gray-500">Loading permissions...</p>
// // // //                   </div>
// // // //                 ) : (
// // // //                   <div className="space-y-6 max-h-[500px] overflow-y-auto">
// // // //                     {Object.entries(groupedModules).map(([category, modules]) => (
// // // //                       <div key={category}>
// // // //                         <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
// // // //                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
// // // //                           {category}
// // // //                           <span className="text-sm text-gray-400 font-normal ml-2">
// // // //                             ({modules.length} modules)
// // // //                           </span>
// // // //                         </h3>
                        
// // // //                         <div className="grid gap-3">
// // // //                           {modules.map(module => {
// // // //                             const hasAccess = hasModuleAccess(module.name);
// // // //                             const source = getPermissionSource(module.name);
// // // //                             const isCustom = source === 'user';
                            
// // // //                             return (
// // // //                               <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
// // // //                                 hasAccess 
// // // //                                   ? 'bg-green-50 border-green-200' 
// // // //                                   : 'bg-gray-50/50 border-gray-200'
// // // //                               } ${isCustom ? 'ring-1 ring-blue-200' : ''}`}>
// // // //                                 <div className="flex items-center gap-4 flex-1">
// // // //                                   <div className="text-2xl">{module.icon}</div>
// // // //                                   <div className="flex-1">
// // // //                                     <div className="flex items-center gap-2">
// // // //                                       <h4 className="font-semibold text-gray-900">
// // // //                                         {module.name}
// // // //                                       </h4>
// // // //                                       {isCustom && (
// // // //                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
// // // //                                           Custom
// // // //                                         </span>
// // // //                                       )}
// // // //                                     </div>
// // // //                                     <p className="text-sm text-gray-600 mt-1">
// // // //                                       {module.description}
// // // //                                     </p>
// // // //                                   </div>
// // // //                                 </div>
                                
// // // //                                 <label className="relative inline-flex items-center cursor-pointer">
// // // //                                   <input
// // // //                                     type="checkbox"
// // // //                                     checked={hasAccess}
// // // //                                     onChange={(e) => toggleModuleAccess(module.name, e.target.checked)}
// // // //                                     disabled={loading}
// // // //                                     className="sr-only peer"
// // // //                                   />
// // // //                                   <div className={`w-11 h-6 rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-blue-300 ${
// // // //                                     hasAccess 
// // // //                                       ? 'bg-green-500 peer-checked:bg-green-500' 
// // // //                                       : 'bg-gray-300'
// // // //                                   }`}></div>
// // // //                                   <div className={`absolute left-0.5 top-0.5 bg-white border rounded-full transition-transform duration-200 ${
// // // //                                     hasAccess 
// // // //                                       ? 'transform translate-x-5 border-green-500' 
// // // //                                       : 'transform translate-x-0 border-gray-400'
// // // //                                   } w-5 h-5`}></div>
// // // //                                 </label>
// // // //                               </div>
// // // //                             );
// // // //                           })}
// // // //                         </div>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
// // // //               <div className="text-center">
// // // //                 <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
// // // //                   <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// // // //                   </svg>
// // // //                 </div>
// // // //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a User</h3>
// // // //                 <p className="text-gray-500 text-sm max-w-sm">
// // // //                   Choose a user from the list to view and manage their system permissions and access controls.
// // // //                 </p>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Legend */}
// // // //       <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
// // // //         <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// // // //           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// // // //           </svg>
// // // //           Permission Guide
// // // //         </h4>
// // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
// // // //           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// // // //             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
// // // //             <div>
// // // //               <div className="font-medium text-gray-900">Module Access Granted</div>
// // // //               <div className="text-gray-500 text-xs">User has access to this module</div>
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
// // // //             <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
// // // //             <div>
// // // //               <div className="font-medium text-gray-900">Module Access Restricted</div>
// // // //               <div className="text-gray-500 text-xs">User cannot access this module</div>
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
// // // //             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
// // // //             <div>
// // // //               <div className="font-medium text-gray-900">Custom Permission</div>
// // // //               <div className="text-gray-500 text-xs">Overrides role-based permissions</div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // frontend/components/admin/PermissionManager.js
// // // "use client";

// // // import { useState, useEffect } from 'react';
// // // import { API_BASE_URL } from '../../config';

// // // export default function PermissionManager() {
// // //   const [users, setUsers] = useState([]);
// // //   const [selectedUser, setSelectedUser] = useState(null);
// // //   const [userPermissions, setUserPermissions] = useState([]);
// // //   const [availableModules, setAvailableModules] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [message, setMessage] = useState({ type: '', text: '' });
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [activeCategory, setActiveCategory] = useState('All');

// // //   const MODULES_CONFIG = [
// // //     // Core Modules
// // //     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
// // //     { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
// // //     { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
// // //     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
    
// // //     // Employee Management
// // //     { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
// // //     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
    
// // //     // Company Management
// // //     { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
    
// // //     // Payroll System
// // //     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
// // //     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
// // //     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
    
// // //     // Asset Management
// // //     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
// // //     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
    
// // //     // Claims Management
// // //     { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
    
// // //     // Other Modules
// // //     { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
// // //     { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
// // //     { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
// // //     { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
// // //   ];

// // //   useEffect(() => {
// // //     fetchUsers();
// // //     setAvailableModules(MODULES_CONFIG);
// // //   }, []);

// // //   useEffect(() => {
// // //     if (selectedUser) {
// // //       fetchUserPermissions(selectedUser.id);
// // //     }
// // //   }, [selectedUser]);

// // //   const showMessage = (text, type = 'success') => {
// // //     setMessage({ type, text });
// // //     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
// // //   };

// // //   const fetchUsers = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('hrms_token');
// // //       const response = await fetch(`${API_BASE_URL}/api/permissions/users`, {
// // //         headers: { 
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       });

// // //       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
// // //       const data = await response.json();
// // //       if (data.success) {
// // //         setUsers(data.users);
// // //       } else {
// // //         throw new Error(data.message || 'Failed to fetch users');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching users:', error);
// // //       showMessage('Failed to load users: ' + error.message, 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchUserPermissions = async (userId) => {
// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('hrms_token');
// // //       const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
// // //         headers: { 
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       });

// // //       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
// // //       const data = await response.json();
// // //       if (data.success) {
// // //         setUserPermissions(data.permissions?.modules || []);
// // //       } else {
// // //         throw new Error(data.message || 'Failed to fetch user permissions');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching user permissions:', error);
// // //       showMessage('Failed to load user permissions: ' + error.message, 'error');
// // //       setUserPermissions([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const toggleModuleAccess = async (moduleName, hasAccess) => {
// // //     if (!selectedUser) return;

// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('hrms_token');
      
// // //       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //         body: JSON.stringify({
// // //           userId: selectedUser.id,
// // //           moduleName,
// // //           permissions: {
// // //             can_view: hasAccess,
// // //             can_create: hasAccess,
// // //             can_edit: hasAccess,
// // //             can_delete: hasAccess,
// // //             can_approve: hasAccess
// // //           }
// // //         })
// // //       });

// // //       const data = await response.json();
      
// // //       if (data.success) {
// // //         showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
        
// // //         setUserPermissions(prev => {
// // //           const existingIndex = prev.findIndex(p => p.name === moduleName);
// // //           if (existingIndex >= 0) {
// // //             const updated = [...prev];
// // //             updated[existingIndex] = {
// // //               ...updated[existingIndex],
// // //               can_view: hasAccess,
// // //               can_create: hasAccess,
// // //               can_edit: hasAccess,
// // //               can_delete: hasAccess,
// // //               can_approve: hasAccess,
// // //               source: 'user'
// // //             };
// // //             return updated;
// // //           } else {
// // //             return [...prev, {
// // //               name: moduleName,
// // //               can_view: hasAccess,
// // //               can_create: hasAccess,
// // //               can_edit: hasAccess,
// // //               can_delete: hasAccess,
// // //               can_approve: hasAccess,
// // //               source: 'user'
// // //             }];
// // //           }
// // //         });
// // //       } else {
// // //         throw new Error(data.message || 'Failed to update permission');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error updating permission:', error);
// // //       showMessage('Failed to update permission: ' + error.message, 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const bulkUpdatePermissions = async (modules, hasAccess) => {
// // //     if (!selectedUser) return;

// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('hrms_token');
      
// // //       const updatePromises = modules.map(moduleName =>
// // //         fetch(`${API_BASE_URL}/api/permissions/grant`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json'
// // //           },
// // //           body: JSON.stringify({
// // //             userId: selectedUser.id,
// // //             moduleName,
// // //             permissions: {
// // //               can_view: hasAccess,
// // //               can_create: hasAccess,
// // //               can_edit: hasAccess,
// // //               can_delete: hasAccess,
// // //               can_approve: hasAccess
// // //             }
// // //           })
// // //         })
// // //       );

// // //       await Promise.all(updatePromises);
// // //       showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
      
// // //       setUserPermissions(prev => {
// // //         const updated = [...prev];
// // //         modules.forEach(moduleName => {
// // //           const existingIndex = updated.findIndex(p => p.name === moduleName);
// // //           if (existingIndex >= 0) {
// // //             updated[existingIndex] = {
// // //               ...updated[existingIndex],
// // //               can_view: hasAccess,
// // //               can_create: hasAccess,
// // //               can_edit: hasAccess,
// // //               can_delete: hasAccess,
// // //               can_approve: hasAccess,
// // //               source: 'user'
// // //             };
// // //           } else {
// // //             updated.push({
// // //               name: moduleName,
// // //               can_view: hasAccess,
// // //               can_create: hasAccess,
// // //               can_edit: hasAccess,
// // //               can_delete: hasAccess,
// // //               can_approve: hasAccess,
// // //               source: 'user'
// // //             });
// // //           }
// // //         });
// // //         return updated;
// // //       });
// // //     } catch (error) {
// // //       console.error('Error bulk updating permissions:', error);
// // //       showMessage('Failed to update permissions: ' + error.message, 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const revokeAllPermissions = async () => {
// // //     if (!selectedUser) return;
    
// // //     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       const token = localStorage.getItem('hrms_token');
      
// // //       const revokePromises = userPermissions
// // //         .filter(perm => perm.source === 'user')
// // //         .map(perm => 
// // //           fetch(`${API_BASE_URL}/api/permissions/revoke`, {
// // //             method: 'POST',
// // //             headers: {
// // //               'Authorization': `Bearer ${token}`,
// // //               'Content-Type': 'application/json'
// // //             },
// // //             body: JSON.stringify({
// // //               userId: selectedUser.id,
// // //               moduleName: perm.name
// // //             })
// // //           })
// // //         );

// // //       await Promise.all(revokePromises);
// // //       showMessage('All custom permissions revoked successfully');
// // //       setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
// // //     } catch (error) {
// // //       console.error('Error revoking permissions:', error);
// // //       showMessage('Failed to revoke permissions: ' + error.message, 'error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const hasModuleAccess = (moduleName) => {
// // //     const userPerm = userPermissions.find(p => p.name === moduleName);
// // //     if (userPerm) {
// // //       if (userPerm.can_access !== undefined) return Boolean(userPerm.can_access);
// // //       const hasAnyPermission = userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve;
// // //       return Boolean(hasAnyPermission);
// // //     }
// // //     return false;
// // //   };

// // //   const getPermissionSource = (moduleName) => {
// // //     const userPerm = userPermissions.find(p => p.name === moduleName);
// // //     return userPerm ? (userPerm.source || 'role') : 'role';
// // //   };

// // //   const filteredUsers = users.filter(user =>
// // //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //     user.role.toLowerCase().includes(searchTerm.toLowerCase())
// // //   );

// // //   const categories = ['All', ...new Set(availableModules.map(module => module.category))];
// // //   const filteredModules = activeCategory === 'All' 
// // //     ? availableModules 
// // //     : availableModules.filter(module => module.category === activeCategory);

// // //   const groupedModules = filteredModules.reduce((groups, module) => {
// // //     const category = module.category;
// // //     if (!groups[category]) groups[category] = [];
// // //     groups[category].push(module);
// // //     return groups;
// // //   }, {});

// // //   const customPermissionsCount = userPermissions.filter(perm => perm.source === 'user').length;
// // //   const totalAccessCount = userPermissions.filter(perm => hasModuleAccess(perm.name)).length;

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Message Alert */}
// // //       {message.text && (
// // //         <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
// // //           <div>
// // //             {message.type === 'error' ? (
// // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //               </svg>
// // //             ) : (
// // //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //               </svg>
// // //             )}
// // //             <span>{message.text}</span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
// // //         {/* User List Panel */}
// // //         <div className="xl:col-span-1">
// // //           <div className="card bg-base-100 shadow-sm border">
// // //             <div className="card-body p-4">
// // //               <h2 className="card-title text-lg">
// // //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
// // //                 </svg>
// // //                 Users
// // //               </h2>
              
// // //               {/* Search */}
// // //               <div className="form-control mt-4">
// // //                 <div className="input-group input-group-sm">
// // //                   <span>
// // //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// // //                     </svg>
// // //                   </span>
// // //                   <input
// // //                     type="text"
// // //                     placeholder="Search users..."
// // //                     value={searchTerm}
// // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // //                     className="input input-bordered input-sm flex-1"
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <div className="max-h-96 overflow-y-auto">
// // //               {loading && !users.length ? (
// // //                 <div className="p-8 text-center">
// // //                   <span className="loading loading-spinner loading-md"></span>
// // //                   <p className="mt-3 text-sm text-base-content/60">Loading users...</p>
// // //                 </div>
// // //               ) : filteredUsers.length === 0 ? (
// // //                 <div className="p-8 text-center">
// // //                   <svg className="w-12 h-12 mx-auto text-base-content/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //                   </svg>
// // //                   <p className="text-base-content/60 text-sm">No users found</p>
// // //                 </div>
// // //               ) : (
// // //                 <div className="divide-y divide-base-200">
// // //                   {filteredUsers.map(user => (
// // //                     <div
// // //                       key={user.id}
// // //                       className={`p-4 cursor-pointer transition-all duration-200 ${
// // //                         selectedUser?.id === user.id 
// // //                           ? 'bg-primary/10 border-r-2 border-primary' 
// // //                           : 'hover:bg-base-200'
// // //                       }`}
// // //                       onClick={() => setSelectedUser(user)}
// // //                     >
// // //                       <div className="flex items-start justify-between">
// // //                         <div className="flex-1 min-w-0">
// // //                           <div className="flex items-center gap-3 mb-2">
// // //                             <div className="avatar placeholder">
// // //                               <div className="bg-primary text-primary-content rounded-full w-10 h-10">
// // //                                 <span className="text-sm font-bold">
// // //                                   {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
// // //                                 </span>
// // //                               </div>
// // //                             </div>
// // //                             <div className="flex-1 min-w-0">
// // //                               <h3 className="font-semibold text-base-content truncate text-sm">
// // //                                 {user.name}
// // //                               </h3>
// // //                               <p className="text-xs text-base-content/60 truncate">
// // //                                 {user.email}
// // //                               </p>
// // //                             </div>
// // //                           </div>
// // //                           <div className="flex items-center justify-between">
// // //                             <span className={`badge badge-sm ${
// // //                               user.role === 'admin' ? 'badge-error' :
// // //                               user.role === 'manager' ? 'badge-warning' :
// // //                               user.role === 'supervisor' ? 'badge-info' : 'badge-success'
// // //                             }`}>
// // //                               {user.role}
// // //                             </span>
// // //                             {user.module_names && (
// // //                               <span className="text-xs text-base-content/40">
// // //                                 {user.module_names.split(',').filter(Boolean).length} custom
// // //                               </span>
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Permission Management Panel */}
// // //         <div className="xl:col-span-3">
// // //           {selectedUser ? (
// // //             <div className="card bg-base-100 shadow-sm border">
// // //               {/* User Header */}
// // //               <div className="card-body p-6 bg-gradient-to-r from-base-100 to-base-200 border-b">
// // //                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
// // //                   <div className="flex items-center gap-4">
// // //                     <div className="avatar placeholder">
// // //                       <div className="bg-primary text-primary-content rounded-xl w-14 h-14">
// // //                         <span className="text-xl font-bold">
// // //                           {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                     <div>
// // //                       <h2 className="text-2xl font-bold text-base-content">
// // //                         {selectedUser.name}
// // //                       </h2>
// // //                       <div className="flex items-center gap-3 mt-1">
// // //                         <span className="text-base-content/60 text-sm">{selectedUser.email}</span>
// // //                         <span className={`badge ${
// // //                           selectedUser.role === 'admin' ? 'badge-error' :
// // //                           selectedUser.role === 'manager' ? 'badge-warning' :
// // //                           selectedUser.role === 'supervisor' ? 'badge-info' : 'badge-success'
// // //                         }`}>
// // //                           {selectedUser.role}
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                   </div>
                  
// // //                   <div className="flex flex-wrap gap-2">
// // //                     <button
// // //                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
// // //                       className="btn btn-success btn-sm gap-2"
// // //                       disabled={loading}
// // //                     >
// // //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// // //                       </svg>
// // //                       Grant All
// // //                     </button>
// // //                     <button
// // //                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)}
// // //                       className="btn btn-error btn-sm gap-2"
// // //                       disabled={loading}
// // //                     >
// // //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                       </svg>
// // //                       Revoke All
// // //                     </button>
// // //                     <button
// // //                       onClick={revokeAllPermissions}
// // //                       className="btn btn-warning btn-sm gap-2"
// // //                       disabled={loading}
// // //                     >
// // //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// // //                       </svg>
// // //                       Reset to Role
// // //                     </button>
// // //                   </div>
// // //                 </div>
                
// // //                 {/* Stats */}
// // //                 <div className="grid grid-cols-3 gap-4 mt-6">
// // //                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
// // //                     <div className="stat-value text-2xl text-base-content">{totalAccessCount}</div>
// // //                     <div className="stat-desc text-base-content/60">Modules Accessed</div>
// // //                   </div>
// // //                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
// // //                     <div className="stat-value text-2xl text-primary">{customPermissionsCount}</div>
// // //                     <div className="stat-desc text-base-content/60">Custom Permissions</div>
// // //                   </div>
// // //                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
// // //                     <div className="stat-value text-2xl text-base-content">{availableModules.length - totalAccessCount}</div>
// // //                     <div className="stat-desc text-base-content/60">Modules Restricted</div>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* Category Filter */}
// // //               <div className="p-4 border-b bg-base-200/50">
// // //                 <div className="flex items-center gap-2 overflow-x-auto">
// // //                   {categories.map(category => (
// // //                     <button
// // //                       key={category}
// // //                       onClick={() => setActiveCategory(category)}
// // //                       className={`btn btn-sm ${activeCategory === category ? 'btn-primary' : 'btn-ghost'}`}
// // //                     >
// // //                       {category}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //               </div>

// // //               {/* Permissions Grid */}
// // //               <div className="p-6">
// // //                 {loading ? (
// // //                   <div className="text-center py-12">
// // //                     <span className="loading loading-spinner loading-lg"></span>
// // //                     <p className="mt-3 text-base-content/60">Loading permissions...</p>
// // //                   </div>
// // //                 ) : (
// // //                   <div className="space-y-6 max-h-[500px] overflow-y-auto">
// // //                     {Object.entries(groupedModules).map(([category, modules]) => (
// // //                       <div key={category}>
// // //                         <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
// // //                           <div className="w-2 h-2 bg-primary rounded-full"></div>
// // //                           {category}
// // //                           <span className="text-sm text-base-content/40 font-normal">
// // //                             ({modules.length} modules)
// // //                           </span>
// // //                         </h3>
                        
// // //                         <div className="grid gap-3">
// // //                           {modules.map(module => {
// // //                             const hasAccess = hasModuleAccess(module.name);
// // //                             const source = getPermissionSource(module.name);
// // //                             const isCustom = source === 'user';
                            
// // //                             return (
// // //                               <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
// // //                                 hasAccess 
// // //                                   ? 'bg-success/10 border-success/20' 
// // //                                   : 'bg-base-200/50 border-base-300'
// // //                               } ${isCustom ? 'ring-1 ring-primary/20' : ''}`}>
// // //                                 <div className="flex items-center gap-4 flex-1">
// // //                                   <div className="text-2xl">{module.icon}</div>
// // //                                   <div className="flex-1">
// // //                                     <div className="flex items-center gap-2">
// // //                                       <h4 className="font-semibold text-base-content">
// // //                                         {module.name}
// // //                                       </h4>
// // //                                       {isCustom && (
// // //                                         <span className="badge badge-primary badge-sm">Custom</span>
// // //                                       )}
// // //                                     </div>
// // //                                     <p className="text-sm text-base-content/60 mt-1">
// // //                                       {module.description}
// // //                                     </p>
// // //                                   </div>
// // //                                 </div>
                                
// // //                                 <input
// // //                                   type="checkbox"
// // //                                   className="toggle toggle-success"
// // //                                   checked={hasAccess}
// // //                                   onChange={(e) => toggleModuleAccess(module.name, e.target.checked)}
// // //                                   disabled={loading}
// // //                                 />
// // //                               </div>
// // //                             );
// // //                           })}
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             <div className="card bg-base-100 shadow-sm border h-96 flex items-center justify-center">
// // //               <div className="text-center">
// // //                 <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
// // //                   <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// // //                   </svg>
// // //                 </div>
// // //                 <h3 className="text-lg font-semibold text-base-content mb-2">Select a User</h3>
// // //                 <p className="text-base-content/60 text-sm max-w-sm">
// // //                   Choose a user from the list to view and manage their system permissions and access controls.
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Legend */}
// // //       <div className="card bg-base-100 shadow-sm border">
// // //         <div className="card-body">
// // //           <h4 className="font-semibold text-base-content flex items-center gap-2">
// // //             <svg className="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// // //             </svg>
// // //             Permission Guide
// // //           </h4>
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
// // //             <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
// // //               <div className="w-3 h-3 bg-success rounded-full"></div>
// // //               <div>
// // //                 <div className="font-semibold text-base-content">Module Access Granted</div>
// // //                 <div className="text-base-content/60 text-xs">User has access to this module</div>
// // //               </div>
// // //             </div>
// // //             <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
// // //               <div className="w-3 h-3 bg-base-content/40 rounded-full"></div>
// // //               <div>
// // //                 <div className="font-semibold text-base-content">Module Access Restricted</div>
// // //                 <div className="text-base-content/60 text-xs">User cannot access this module</div>
// // //               </div>
// // //             </div>
// // //             <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
// // //               <div className="w-3 h-3 bg-primary rounded-full"></div>
// // //               <div>
// // //                 <div className="font-semibold text-base-content">Custom Permission</div>
// // //                 <div className="text-base-content/60 text-xs">Overrides role-based permissions</div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // frontend/components/admin/PermissionManager.js
// // "use client";

// // import { useState, useEffect } from 'react';
// // import { API_BASE_URL } from '../../config';

// // export default function PermissionManager() {
// //   const [users, setUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [userPermissions, setUserPermissions] = useState([]);
// //   const [availableModules, setAvailableModules] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState({ type: '', text: '' });
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [activeCategory, setActiveCategory] = useState('All');

// //   // Filter states
// //   const [companies, setCompanies] = useState([]);
// //   const [departments, setDepartments] = useState([]);
// //   const [selectedCompany, setSelectedCompany] = useState('');
// //   const [selectedDepartment, setSelectedDepartment] = useState('');
// //   const [filterLoading, setFilterLoading] = useState(false);

// //   const MODULES_CONFIG = [
// //     // Core Modules
// //     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
// //     { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
// //     { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
// //     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
    
// //     // Employee Management
// //     { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
// //     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
    
// //     // Company Management
// //     { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
    
// //     // Payroll System
// //     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
// //     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
// //     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
    
// //     // Asset Management
// //     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
// //     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
    
// //     // Claims Management
// //     { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
    
// //     // Other Modules
// //     { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
// //     { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
// //     { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
// //     { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
// //   ];

// //   // Initialize
// // useEffect(() => {
// //   console.log('PermissionManager mounted');
// //   fetchCompanies();
// //   setAvailableModules(MODULES_CONFIG);
  
// //   // Fetch initial users after a short delay to ensure token is available
// //   const timer = setTimeout(() => {
// //     fetchFilteredUsers();
// //   }, 100);
  
// //   return () => clearTimeout(timer);
// // }, []);

// // // Fetch departments when company changes - UPDATED
// // useEffect(() => {
// //   if (selectedCompany) {
// //     // Reset department filter when company changes
// //     setSelectedDepartment('');
// //     fetchDepartments(selectedCompany);
// //   } else {
// //     setDepartments([]);
// //     setSelectedDepartment('');
// //   }
// // }, [selectedCompany]);

// //   // Fetch users when filters change
// // useEffect(() => {
// //   // Only fetch if we have valid filters OR no filters (to get all users)
// //   fetchFilteredUsers();
// // }, [selectedCompany, selectedDepartment]);

// //   // Fetch permissions when user is selected
// //   useEffect(() => {
// //     if (selectedUser && selectedUser.id) {
// //       fetchUserPermissions(selectedUser.id);
// //     }
// //   }, [selectedUser]);

// //   const showMessage = (text, type = 'success') => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
// //   };

// //   const fetchCompanies = async () => {
// //     try {
// //       setFilterLoading(true);
// //       const token = localStorage.getItem('hrms_token');
// //       if (!token) {
// //         showMessage('Authentication token not found', 'error');
// //         return;
// //       }

// //       const response = await fetch(`${API_BASE_URL}/api/admin/companies`, {
// //         headers: { 
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const data = await response.json();
// //       setCompanies(Array.isArray(data) ? data : []);
// //     } catch (error) {
// //       console.error('Error fetching companies:', error);
// //       showMessage('Failed to load companies: ' + error.message, 'error');
// //     } finally {
// //       setFilterLoading(false);
// //     }
// //   };

// // const fetchDepartments = async (companyId) => {
// //   try {
// //     setFilterLoading(true);
// //     const token = localStorage.getItem('hrms_token');
// //     if (!token) {
// //       showMessage('Authentication token not found', 'error');
// //       return;
// //     }

// //     // Try this alternative endpoint that exists in your routes
// //     const url = `${API_BASE_URL}/api/admin/employees/companies/${companyId}/departments`;
// //     console.log('🔄 Fetching departments from:', url);

// //     const response = await fetch(url, {
// //       headers: { 
// //         'Authorization': `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //       }
// //     });

// //     if (!response.ok) {
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }
    
// //     const data = await response.json();
// //     console.log('✅ Departments data:', data);
    
// //     const departmentsArray = Array.isArray(data) ? data : [];
// //     setDepartments(departmentsArray);
// //   } catch (error) {
// //     console.error('❌ Error fetching departments:', error);
// //     showMessage('Failed to load departments: ' + error.message, 'error');
// //     setDepartments([]);
// //   } finally {
// //     setFilterLoading(false);
// //   }
// // };

// // const fetchFilteredUsers = async () => {
// //   try {
// //     setLoading(true);
// //     const token = localStorage.getItem('hrms_token');
// //     if (!token) {
// //       showMessage('Authentication token not found', 'error');
// //       return;
// //     }
    
// //     let url = `${API_BASE_URL}/api/permissions/users`;
// //     const params = new URLSearchParams();
    
// //     // Only add company_id if a company is selected
// //     if (selectedCompany) params.append('company_id', selectedCompany);
    
// //     // Only add department_id if a specific department is selected (not "All Departments")
// //     if (selectedDepartment) params.append('department_id', selectedDepartment);
    
// //     if (params.toString()) {
// //       url += `?${params.toString()}`;
// //     }

// //     console.log('Fetching users from:', url);

// //     const response = await fetch(url, {
// //       headers: { 
// //         'Authorization': `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //       }
// //     });

// //     if (!response.ok) {
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }
    
// //     const data = await response.json();
// //     console.log('Users API response:', data);
    
// //     if (data && data.success) {
// //       const usersArray = Array.isArray(data.users) ? data.users : 
// //                         Array.isArray(data) ? data : [];
      
// //       console.log('Setting users:', usersArray.length, 'users');
// //       setUsers(usersArray);
// //       setSelectedUser(null);
// //     } else {
// //       throw new Error(data?.message || 'Failed to fetch users');
// //     }
// //   } catch (error) {
// //     console.error('Error fetching filtered users:', error);
// //     showMessage('Failed to load users: ' + error.message, 'error');
// //     setUsers([]);
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// //   const fetchUserPermissions = async (userId) => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
// //       if (!token) {
// //         showMessage('Authentication token not found', 'error');
// //         return;
// //       }

// //       const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
// //         headers: { 
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const data = await response.json();
// //       if (data && data.success) {
// //         const modules = data.permissions?.modules || data.permissions || [];
// //         setUserPermissions(Array.isArray(modules) ? modules : []);
// //       } else {
// //         throw new Error(data?.message || 'Failed to fetch user permissions');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching user permissions:', error);
// //       showMessage('Failed to load user permissions: ' + error.message, 'error');
// //       setUserPermissions([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const toggleModuleAccess = async (moduleName, hasAccess) => {
// //     if (!selectedUser || !selectedUser.id) {
// //       showMessage('No user selected', 'error');
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
// //       if (!token) {
// //         showMessage('Authentication token not found', 'error');
// //         return;
// //       }

// //       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           userId: selectedUser.id,
// //           moduleName,
// //           permissions: {
// //             can_view: hasAccess,
// //             can_create: hasAccess,
// //             can_edit: hasAccess,
// //             can_delete: hasAccess,
// //             can_approve: hasAccess
// //           }
// //         })
// //       });

// //       const data = await response.json();
      
// //       if (data && data.success) {
// //         showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
        
// //         setUserPermissions(prev => {
// //           const existingIndex = prev.findIndex(p => p.name === moduleName);
// //           if (existingIndex >= 0) {
// //             const updated = [...prev];
// //             updated[existingIndex] = {
// //               ...updated[existingIndex],
// //               can_view: hasAccess,
// //               can_create: hasAccess,
// //               can_edit: hasAccess,
// //               can_delete: hasAccess,
// //               can_approve: hasAccess,
// //               source: 'user'
// //             };
// //             return updated;
// //           } else {
// //             return [...prev, {
// //               name: moduleName,
// //               can_view: hasAccess,
// //               can_create: hasAccess,
// //               can_edit: hasAccess,
// //               can_delete: hasAccess,
// //               can_approve: hasAccess,
// //               source: 'user'
// //             }];
// //           }
// //         });
// //       } else {
// //         throw new Error(data?.message || 'Failed to update permission');
// //       }
// //     } catch (error) {
// //       console.error('Error updating permission:', error);
// //       showMessage('Failed to update permission: ' + error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const bulkUpdatePermissions = async (modules, hasAccess) => {
// //     if (!selectedUser || !selectedUser.id) {
// //       showMessage('No user selected', 'error');
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
// //       if (!token) {
// //         showMessage('Authentication token not found', 'error');
// //         return;
// //       }

// //       const bulkPermissions = {};
// //       modules.forEach(moduleName => {
// //         bulkPermissions[moduleName] = {
// //           can_view: hasAccess,
// //           can_create: hasAccess,
// //           can_edit: hasAccess,
// //           can_delete: hasAccess,
// //           can_approve: hasAccess
// //         };
// //       });

// //       const response = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           userId: selectedUser.id,
// //           permissions: bulkPermissions
// //         })
// //       });

// //       const data = await response.json();
      
// //       if (data && data.success) {
// //         showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
        
// //         setUserPermissions(prev => {
// //           const updatedPermissions = [...prev];
// //           modules.forEach(moduleName => {
// //             const existingIndex = updatedPermissions.findIndex(p => p.name === moduleName);
// //             if (existingIndex >= 0) {
// //               updatedPermissions[existingIndex] = {
// //                 ...updatedPermissions[existingIndex],
// //                 can_view: hasAccess,
// //                 can_create: hasAccess,
// //                 can_edit: hasAccess,
// //                 can_delete: hasAccess,
// //                 can_approve: hasAccess,
// //                 source: 'user'
// //               };
// //             } else {
// //               updatedPermissions.push({
// //                 name: moduleName,
// //                 can_view: hasAccess,
// //                 can_create: hasAccess,
// //                 can_edit: hasAccess,
// //                 can_delete: hasAccess,
// //                 can_approve: hasAccess,
// //                 source: 'user'
// //               });
// //             }
// //           });
// //           return updatedPermissions;
// //         });
// //       } else {
// //         throw new Error(data?.message || 'Failed to update permissions');
// //       }
// //     } catch (error) {
// //       console.error('Error bulk updating permissions:', error);
// //       showMessage('Failed to update permissions: ' + error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const revokeAllPermissions = async () => {
// //     if (!selectedUser || !selectedUser.id) {
// //       showMessage('No user selected', 'error');
// //       return;
// //     }
    
// //     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
// //       if (!token) {
// //         showMessage('Authentication token not found', 'error');
// //         return;
// //       }

// //       const customPermissions = userPermissions.filter(perm => perm.source === 'user');
      
// //       if (customPermissions.length === 0) {
// //         showMessage('No custom permissions to revoke', 'info');
// //         return;
// //       }

// //       const bulkPermissions = {};
// //       customPermissions.forEach(perm => {
// //         bulkPermissions[perm.name] = {
// //           can_view: false,
// //           can_create: false,
// //           can_edit: false,
// //           can_delete: false,
// //           can_approve: false
// //         };
// //       });

// //       const response = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           userId: selectedUser.id,
// //           permissions: bulkPermissions
// //         })
// //       });

// //       const data = await response.json();
      
// //       if (data && data.success) {
// //         showMessage('All custom permissions revoked successfully');
// //         setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
// //       } else {
// //         throw new Error(data?.message || 'Failed to revoke permissions');
// //       }
// //     } catch (error) {
// //       console.error('Error revoking permissions:', error);
// //       showMessage('Failed to revoke permissions: ' + error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const hasModuleAccess = (moduleName) => {
// //     if (!moduleName) return false;
    
// //     const userPerm = userPermissions.find(p => p.name === moduleName);
// //     if (userPerm) {
// //       const hasAnyPermission = userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve;
// //       return Boolean(hasAnyPermission);
// //     }
// //     return false;
// //   };

// //   const getPermissionSource = (moduleName) => {
// //     if (!moduleName) return 'role';
    
// //     const userPerm = userPermissions.find(p => p.name === moduleName);
// //     return userPerm ? (userPerm.source || 'role') : 'role';
// //   };

// //   const getAvatarText = (name) => {
// //     if (!name || typeof name !== 'string') return 'U';
// //     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
// //   };

// // const clearFilters = () => {
// //   setSelectedCompany('');
// //   setSelectedDepartment('');
// //   setSearchTerm('');
// //   // Don't clear users - let the useEffect handle fetching all users
// //   setSelectedUser(null);
// // };

// //   // Safe data filtering and processing
// //   const filteredUsers = Array.isArray(users) ? users.filter(user => {
// //     const name = user?.name || '';
// //     const email = user?.email || '';
// //     const role = user?.role || '';
// //     const search = searchTerm.toLowerCase();
    
// //     return name.toLowerCase().includes(search) ||
// //            email.toLowerCase().includes(search) ||
// //            role.toLowerCase().includes(search);
// //   }) : [];

// //   const categories = ['All', ...new Set(availableModules.map(module => module.category))];
// //   const filteredModules = activeCategory === 'All' 
// //     ? availableModules 
// //     : availableModules.filter(module => module.category === activeCategory);

// //   const groupedModules = filteredModules.reduce((groups, module) => {
// //     const category = module.category;
// //     if (!groups[category]) groups[category] = [];
// //     groups[category].push(module);
// //     return groups;
// //   }, {});

// //   const customPermissionsCount = userPermissions.filter(perm => perm.source === 'user').length;
// //   const totalAccessCount = userPermissions.filter(perm => hasModuleAccess(perm.name)).length;

// //   return (
// //     <div className="space-y-6">
// //       {/* Message Alert */}
// //       {message.text && (
// //         <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
// //           <div>
// //             {message.type === 'error' ? (
// //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //             ) : (
// //               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //             )}
// //             <span>{message.text}</span>
// //           </div>
// //         </div>
// //       )}

// //       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
// //         {/* User List Panel */}
// //         <div className="xl:col-span-1">
// //           <div className="card bg-base-100 shadow-sm border">
// //             <div className="card-body p-4">
// //               <h2 className="card-title text-lg">
// //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
// //                 </svg>
// //                 Users
// //               </h2>
              
// //               {/* Filter Section */}
// //               <div className="space-y-3 mt-4">
// //                 {/* Company Filter */}
// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className="label-text text-sm font-medium">Company</span>
// //                   </label>
// //                   <select
// //                     value={selectedCompany}
// //                     onChange={(e) => setSelectedCompany(e.target.value)}
// //                     className="select select-bordered select-sm"
// //                     disabled={filterLoading}
// //                   >
// //                     <option value="">All Companies</option>
// //                     {Array.isArray(companies) && companies.map(company => (
// //                       <option key={company.id} value={company.id}>
// //                         {company.name}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {/* Department Filter */}
// //                 <div className="form-control">
// //                   <label className="label">
// //                     <span className="label-text text-sm font-medium">Department</span>
// //                   </label>
// //                   <select
// //                     value={selectedDepartment}
// //                     onChange={(e) => setSelectedDepartment(e.target.value)}
// //                     className="select select-bordered select-sm"
// //                     disabled={!selectedCompany || filterLoading}
// //                   >
// //                     <option value="">All Departments</option>
// //                     {Array.isArray(departments) && departments.map(dept => (
// //                       <option key={dept.id} value={dept.id}>
// //                         {dept.department_name}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {/* Clear Filters */}
// //                 {(selectedCompany || selectedDepartment) && (
// //                   <button
// //                     onClick={clearFilters}
// //                     className="btn btn-outline btn-sm w-full gap-2"
// //                   >
// //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                     </svg>
// //                     Clear Filters
// //                   </button>
// //                 )}

// //                 {/* Search */}
// //                 <div className="form-control">
// //                   <div className="input-group input-group-sm">
// //                     <span>
// //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //                       </svg>
// //                     </span>
// //                     <input
// //                       type="text"
// //                       placeholder="Search users..."
// //                       value={searchTerm}
// //                       onChange={(e) => setSearchTerm(e.target.value)}
// //                       className="input input-bordered input-sm flex-1"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //           <div className="max-h-96 overflow-y-auto">
// //   {loading ? (
// //     <div className="p-8 text-center">
// //       <span className="loading loading-spinner loading-md"></span>
// //       <p className="mt-3 text-sm text-base-content/60">Loading users...</p>
// //     </div>
// //   ) : filteredUsers.length === 0 ? (
// //     <div className="p-8 text-center">
// //       <svg className="w-12 h-12 mx-auto text-base-content/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //       </svg>
// //       <p className="text-base-content/60 text-sm">
// //         {selectedCompany 
// //           ? (selectedDepartment 
// //               ? 'No users found in selected department' 
// //               : 'No users found in selected company')
// //           : 'Select a company to load users'
// //         }
// //       </p>
// //     </div>
// //   ) : (
// //                 <div className="divide-y divide-base-200">
// //                   {filteredUsers.map(user => (
// //                     <div
// //                       key={user.id}
// //                       className={`p-4 cursor-pointer transition-all duration-200 ${
// //                         selectedUser?.id === user.id 
// //                           ? 'bg-primary/10 border-r-2 border-primary' 
// //                           : 'hover:bg-base-200'
// //                       }`}
// //                       onClick={() => setSelectedUser(user)}
// //                     >
// //                       <div className="flex items-start justify-between">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-3 mb-2">
// //                             <div className="avatar placeholder">
// //                               <div className="bg-primary text-primary-content rounded-full w-10 h-10">
// //                                 <span className="text-sm font-bold">
// //                                   {getAvatarText(user.name)}
// //                                 </span>
// //                               </div>
// //                             </div>
// //                             <div className="flex-1 min-w-0">
// //                               <h3 className="font-semibold text-base-content truncate text-sm">
// //                                 {user.name || 'Unknown User'}
// //                               </h3>
// //                               <p className="text-xs text-base-content/60 truncate">
// //                                 {user.email || 'No email'}
// //                               </p>
// //                             </div>
// //                           </div>
// //                           <div className="flex items-center justify-between">
// //                             <span className={`badge badge-sm ${
// //                               user.role === 'admin' ? 'badge-error' :
// //                               user.role === 'manager' ? 'badge-warning' :
// //                               user.role === 'supervisor' ? 'badge-info' : 'badge-success'
// //                             }`}>
// //                               {user.role || 'employee'}
// //                             </span>
// //                             {user.module_names && (
// //                               <span className="text-xs text-base-content/40">
// //                                 {user.module_names.split(',').filter(Boolean).length} custom
// //                               </span>
// //                             )}
// //                           </div>
// //                           {(user.company_name || user.department_name) && (
// //                             <div className="mt-2 flex flex-wrap gap-1">
// //                               {user.company_name && (
// //                                 <span className="badge badge-outline badge-xs">{user.company_name}</span>
// //                               )}
// //                               {user.department_name && (
// //                                 <span className="badge badge-outline badge-xs">{user.department_name}</span>
// //                               )}
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Permission Management Panel */}
// //         <div className="xl:col-span-3">
// //           {selectedUser ? (
// //             <div className="card bg-base-100 shadow-sm border">
// //               {/* User Header */}
// //               <div className="card-body p-6 bg-gradient-to-r from-base-100 to-base-200 border-b">
// //                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
// //                   <div className="flex items-center gap-4">
// //                     <div className="avatar placeholder">
// //                       <div className="bg-primary text-primary-content rounded-xl w-14 h-14">
// //                         <span className="text-xl font-bold">
// //                           {getAvatarText(selectedUser.name)}
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <h2 className="text-2xl font-bold text-base-content">
// //                         {selectedUser.name}
// //                       </h2>
// //                       <div className="flex items-center gap-3 mt-1">
// //                         <span className="text-base-content/60 text-sm">{selectedUser.email}</span>
// //                         <span className={`badge ${
// //                           selectedUser.role === 'admin' ? 'badge-error' :
// //                           selectedUser.role === 'manager' ? 'badge-warning' :
// //                           selectedUser.role === 'supervisor' ? 'badge-info' : 'badge-success'
// //                         }`}>
// //                           {selectedUser.role}
// //                         </span>
// //                       </div>
// //                       {(selectedUser.company_name || selectedUser.department_name) && (
// //                         <div className="flex items-center gap-2 mt-2">
// //                           {selectedUser.company_name && (
// //                             <span className="badge badge-outline badge-sm">{selectedUser.company_name}</span>
// //                           )}
// //                           {selectedUser.department_name && (
// //                             <span className="badge badge-outline badge-sm">{selectedUser.department_name}</span>
// //                           )}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
                  
// //                   <div className="flex flex-wrap gap-2">
// //                     <button
// //                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
// //                       className="btn btn-success btn-sm gap-2"
// //                       disabled={loading}
// //                     >
// //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                       </svg>
// //                       Grant All
// //                     </button>
// //                     <button
// //                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)}
// //                       className="btn btn-error btn-sm gap-2"
// //                       disabled={loading}
// //                     >
// //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                       </svg>
// //                       Revoke All
// //                     </button>
// //                     <button
// //                       onClick={revokeAllPermissions}
// //                       className="btn btn-warning btn-sm gap-2"
// //                       disabled={loading}
// //                     >
// //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// //                       </svg>
// //                       Reset to Role
// //                     </button>
// //                   </div>
// //                 </div>
                
// //                 {/* Stats */}
// //                 <div className="grid grid-cols-3 gap-4 mt-6">
// //                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
// //                     <div className="stat-value text-2xl text-base-content">{totalAccessCount}</div>
// //                     <div className="stat-desc text-base-content/60">Modules Accessed</div>
// //                   </div>
// //                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
// //                     <div className="stat-value text-2xl text-primary">{customPermissionsCount}</div>
// //                     <div className="stat-desc text-base-content/60">Custom Permissions</div>
// //                   </div>
// //                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
// //                     <div className="stat-value text-2xl text-base-content">{availableModules.length - totalAccessCount}</div>
// //                     <div className="stat-desc text-base-content/60">Modules Restricted</div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Category Filter */}
// //               <div className="p-4 border-b bg-base-200/50">
// //                 <div className="flex items-center gap-2 overflow-x-auto">
// //                   {categories.map(category => (
// //                     <button
// //                       key={category}
// //                       onClick={() => setActiveCategory(category)}
// //                       className={`btn btn-sm ${activeCategory === category ? 'btn-primary' : 'btn-ghost'}`}
// //                     >
// //                       {category}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Permissions Grid */}
// //               <div className="p-6">
// //                 {loading ? (
// //                   <div className="text-center py-12">
// //                     <span className="loading loading-spinner loading-lg"></span>
// //                     <p className="mt-3 text-base-content/60">Loading permissions...</p>
// //                   </div>
// //                 ) : (
// //                   <div className="space-y-6 max-h-[500px] overflow-y-auto">
// //                     {Object.entries(groupedModules).map(([category, modules]) => (
// //                       <div key={category}>
// //                         <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
// //                           <div className="w-2 h-2 bg-primary rounded-full"></div>
// //                           {category}
// //                           <span className="text-sm text-base-content/40 font-normal">
// //                             ({modules.length} modules)
// //                           </span>
// //                         </h3>
                        
// //                         <div className="grid gap-3">
// //                           {modules.map(module => {
// //                             const hasAccess = hasModuleAccess(module.name);
// //                             const source = getPermissionSource(module.name);
// //                             const isCustom = source === 'user';
                            
// //                             return (
// //                               <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
// //                                 hasAccess 
// //                                   ? 'bg-success/10 border-success/20' 
// //                                   : 'bg-base-200/50 border-base-300'
// //                               } ${isCustom ? 'ring-1 ring-primary/20' : ''}`}>
// //                                 <div className="flex items-center gap-4 flex-1">
// //                                   <div className="text-2xl">{module.icon}</div>
// //                                   <div className="flex-1">
// //                                     <div className="flex items-center gap-2">
// //                                       <h4 className="font-semibold text-base-content">
// //                                         {module.name}
// //                                       </h4>
// //                                       {isCustom && (
// //                                         <span className="badge badge-primary badge-sm">Custom</span>
// //                                       )}
// //                                     </div>
// //                                     <p className="text-sm text-base-content/60 mt-1">
// //                                       {module.description}
// //                                     </p>
// //                                   </div>
// //                                 </div>
                                
// //                                 <input
// //                                   type="checkbox"
// //                                   className="toggle toggle-success"
// //                                   checked={hasAccess}
// //                                   onChange={(e) => toggleModuleAccess(module.name, e.target.checked)}
// //                                   disabled={loading}
// //                                 />
// //                               </div>
// //                             );
// //                           })}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="card bg-base-100 shadow-sm border h-96 flex items-center justify-center">
// //               <div className="text-center">
// //                 <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
// //                   <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// //                   </svg>
// //                 </div>
// //                 <h3 className="text-lg font-semibold text-base-content mb-2">
// //                   {selectedCompany ? 'Select a User' : 'Filter Users'}
// //                 </h3>
// //                 <p className="text-base-content/60 text-sm max-w-sm">
// //                   {selectedCompany 
// //                     ? 'Choose a user from the list to view and manage their system permissions and access controls.'
// //                     : 'Select a company to start browsing users and manage their permissions.'
// //                   }
// //                 </p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Legend */}
// //       <div className="card bg-base-100 shadow-sm border">
// //         <div className="card-body">
// //           <h4 className="font-semibold text-base-content flex items-center gap-2">
// //             <svg className="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //             Permission Guide
// //           </h4>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
// //             <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
// //               <div className="w-3 h-3 bg-success rounded-full"></div>
// //               <div>
// //                 <div className="font-semibold text-base-content">Module Access Granted</div>
// //                 <div className="text-base-content/60 text-xs">User has access to this module</div>
// //               </div>
// //             </div>
// //             <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
// //               <div className="w-3 h-3 bg-base-content/40 rounded-full"></div>
// //               <div>
// //                 <div className="font-semibold text-base-content">Module Access Restricted</div>
// //                 <div className="text-base-content/60 text-xs">User cannot access this module</div>
// //               </div>
// //             </div>
// //             <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
// //               <div className="w-3 h-3 bg-primary rounded-full"></div>
// //               <div>
// //                 <div className="font-semibold text-base-content">Custom Permission</div>
// //                 <div className="text-base-content/60 text-xs">Overrides role-based permissions</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // frontend/components/admin/PermissionManager.js
// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { API_BASE_URL } from '../../config';

// export default function PermissionManager() {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [availableModules, setAvailableModules] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeCategory, setActiveCategory] = useState('All');

//   const [companies, setCompanies] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [filterLoading, setFilterLoading] = useState(false);

//   const [showUserDropdown, setShowUserDropdown] = useState(false);
//   const [showPermissionGuide, setShowPermissionGuide] = useState(false);

//   const [userSearchTerm, setUserSearchTerm] = useState('');
//   const dropdownRef = useRef(null);

//   const MODULES_CONFIG = [
//     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
//     { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
//     { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
//     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
//     { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
//     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
//     { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
//     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
//     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
//     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
//     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
//     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
//     { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
//     { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
//     { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
//     { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
//     { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
//   ];

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowUserDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     fetchCompanies();
//     setAvailableModules(MODULES_CONFIG);
//     const timer = setTimeout(() => fetchFilteredUsers(), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (selectedCompany) {
//       setSelectedDepartment('');
//       fetchDepartments(selectedCompany);
//     } else {
//       setDepartments([]);
//       setSelectedDepartment('');
//     }
//   }, [selectedCompany]);

//   useEffect(() => {
//     fetchFilteredUsers();
//   }, [selectedCompany, selectedDepartment]);

//   useEffect(() => {
//     if (selectedUser && selectedUser.id) {
//       fetchUserPermissions(selectedUser.id);
//       setShowUserDropdown(false);
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     if (selectedUser && !showPermissionGuide) {
//       setShowPermissionGuide(true);
//     }
//   }, [selectedUser]);

//   const showMessage = (text, type = 'success') => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//   };

//   const fetchCompanies = async () => {
//     try {
//       setFilterLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const response = await fetch(`${API_BASE_URL}/api/admin/companies`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       let companiesArray = [];
//       if (Array.isArray(data)) companiesArray = data;
//       else if (data?.data && Array.isArray(data.data)) companiesArray = data.data;
//       else if (data?.companies && Array.isArray(data.companies)) companiesArray = data.companies;
//       setCompanies(companiesArray);
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load companies: ' + e.message, 'error');
//     } finally {
//       setFilterLoading(false);
//     }
//   };

//   const fetchDepartments = async (companyId) => {
//     try {
//       setFilterLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const url = `${API_BASE_URL}/api/admin/employees/companies/${companyId}/departments`;
//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       let departmentsArray = [];
//       if (Array.isArray(data)) departmentsArray = data;
//       else if (data?.data && Array.isArray(data.data)) departmentsArray = data.data;
//       else if (data?.departments && Array.isArray(data.departments)) departmentsArray = data.departments;
//       setDepartments(departmentsArray);
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load departments: ' + e.message, 'error');
//       setDepartments([]);
//     } finally {
//       setFilterLoading(false);
//     }
//   };

//   const fetchFilteredUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       let url = `${API_BASE_URL}/api/permissions/users`;
//       const params = new URLSearchParams();
//       if (selectedCompany) params.append('company_id', selectedCompany);
//       if (selectedDepartment) params.append('department_id', selectedDepartment);
//       if (params.toString()) url += `?${params.toString()}`;

//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();

//       let usersArray = [];
//       if (Array.isArray(data)) usersArray = data;
//       else if (data?.data && Array.isArray(data.data)) usersArray = data.data;
//       else if (data?.users && Array.isArray(data.users)) usersArray = data.users;
//       else if (data?.success && Array.isArray(data.data)) usersArray = data.data;
//       else if (data?.success && Array.isArray(data.users)) usersArray = data.users;

//       const normalizedUsers = usersArray.map(user => ({
//         id: user.id || user.user_id || user.employee_id,
//         name: user.name || user.full_name || user.employee_name || 'Unknown User',
//         email: user.email || user.email_address || 'No email',
//         role: user.role || user.user_role || 'employee',
//         company_name: user.company_name || user.company?.name,
//         department_name: user.department_name || user.department?.name
//       }));

//       setUsers(normalizedUsers);
//       setSelectedUser(null);
//       setUserSearchTerm(searchTerm || '');
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load users: ' + e.message, 'error');
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserPermissions = async (userId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       if (data && data.success) {
//         const modules = data.permissions?.modules || data.permissions || data.data || [];
//         setUserPermissions(Array.isArray(modules) ? modules : []);
//       } else {
//         throw new Error(data?.message || 'Failed to fetch user permissions');
//       }
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load user permissions: ' + e.message, 'error');
//       setUserPermissions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleModuleAccess = async (moduleName, hasAccess) => {
//     if (!selectedUser?.id) return showMessage('No user selected', 'error');
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: selectedUser.id,
//           moduleName,
//           permissions: {
//             can_view: hasAccess,
//             can_create: hasAccess,
//             can_edit: hasAccess,
//             can_delete: hasAccess,
//             can_approve: hasAccess
//           }
//         })
//       });
//       const data = await response.json();
//       if (!data?.success) throw new Error(data?.message || 'Failed to update permission');

//       showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
//       setUserPermissions(prev => {
//         const idx = prev.findIndex(p => p.name === moduleName);
//         if (idx >= 0) {
//           const updated = [...prev];
//           updated[idx] = { ...updated[idx], can_view: hasAccess, can_create: hasAccess, can_edit: hasAccess, can_delete: hasAccess, can_approve: hasAccess, source: 'user' };
//           return updated;
//         }
//         return [...prev, { name: moduleName, can_view: hasAccess, can_create: hasAccess, can_edit: hasAccess, can_delete: hasAccess, can_approve: hasAccess, source: 'user' }];
//       });
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to update permission: ' + e.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

// // Tries bulk-update; if partial/failed, falls back to per-module /grant calls
// const bulkUpdatePermissions = async (modules, hasAccess) => {
//   if (!selectedUser?.id) return showMessage('No user selected', 'error');

//   const token = localStorage.getItem('hrms_token');
//   if (!token) return showMessage('Authentication token not found', 'error');

//   setLoading(true);
//   try {
//     // Build both object-map and array payloads to be compatible with different backends
//     const bulkMap = {};
//     const bulkArray = modules.map(m => ({
//       moduleName: m,
//       permissions: {
//         can_view: hasAccess,
//         can_create: hasAccess,
//         can_edit: hasAccess,
//         can_delete: hasAccess,
//         can_approve: hasAccess
//       }
//     }));
//     modules.forEach(m => {
//       bulkMap[m] = {
//         can_view: hasAccess,
//         can_create: hasAccess,
//         can_edit: hasAccess,
//         can_delete: hasAccess,
//         can_approve: hasAccess
//       };
//     });

//     // Attempt bulk endpoint first
//     let bulkWorked = false;
//     try {
//       const r = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: selectedUser.id,
//           // Provide both shapes; your backend can pick either
//           permissions: bulkMap,
//           permissionsArray: bulkArray
//         })
//       });
//       const data = await r.json();

//       // Heuristics for success across backends
//       const updatedCount =
//         (Array.isArray(data?.updated) && data.updated.length) ||
//         (typeof data?.updatedCount === 'number' && data.updatedCount) ||
//         (data?.success ? modules.length : 0);

//       if (data?.success && updatedCount >= modules.length) {
//         bulkWorked = true;
//       }
//     } catch (e) {
//       // ignore and fall through to per-module
//       console.warn('bulk-update failed, falling back to per-module:', e);
//     }

//     // Fallback: call /grant for each module in parallel
//     if (!bulkWorked) {
//       const results = await Promise.allSettled(
//         modules.map(m =>
//           fetch(`${API_BASE_URL}/api/permissions/grant`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               userId: selectedUser.id,
//               moduleName: m,
//               permissions: {
//                 can_view: hasAccess,
//                 can_create: hasAccess,
//                 can_edit: hasAccess,
//                 can_delete: hasAccess,
//                 can_approve: hasAccess
//               }
//             })
//           }).then(res => res.json())
//         )
//       );

//       const ok = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
//       if (ok === 0) throw new Error('Failed to update any modules via fallback');
//     }

//     // Local state update for ALL modules
//     setUserPermissions(prev => {
//       const next = [...prev];
//       modules.forEach(m => {
//         const i = next.findIndex(p => p.name === m);
//         if (i >= 0) {
//           next[i] = {
//             ...next[i],
//             can_view: hasAccess,
//             can_create: hasAccess,
//             can_edit: hasAccess,
//             can_delete: hasAccess,
//             can_approve: hasAccess,
//             source: 'user'
//           };
//         } else {
//           next.push({
//             name: m,
//             can_view: hasAccess,
//             can_create: hasAccess,
//             can_edit: hasAccess,
//             can_delete: hasAccess,
//             can_approve: hasAccess,
//             source: 'user'
//           });
//         }
//       });
//       return next;
//     });

//     showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
//   } catch (e) {
//     console.error(e);
//     showMessage('Failed to update permissions: ' + e.message, 'error');
//   } finally {
//     setLoading(false);
//   }
// };


//   const revokeAllPermissions = async () => {
//     if (!selectedUser?.id) return showMessage('No user selected', 'error');
//     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) return;
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const customPermissions = userPermissions.filter(p => p.source === 'user');
//       if (customPermissions.length === 0) return showMessage('No custom permissions to revoke', 'info');

//       const bulkPermissions = {};
//       customPermissions.forEach(perm => {
//         bulkPermissions[perm.name] = { can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false };
//       });

//       const response = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: selectedUser.id, permissions: bulkPermissions })
//       });
//       const data = await response.json();
//       if (!data?.success) throw new Error(data?.message || 'Failed to revoke permissions');

//       showMessage('All custom permissions revoked successfully');
//       setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to revoke permissions: ' + e.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasModuleAccess = (moduleName) => {
//     if (!moduleName) return false;
//     const userPerm = userPermissions.find(p => p.name === moduleName);
//     if (!userPerm) return false;
//     return Boolean(userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve);
//   };

//   const getPermissionSource = (moduleName) => {
//     if (!moduleName) return 'role';
//     const userPerm = userPermissions.find(p => p.name === moduleName);
//     return userPerm ? (userPerm.source || 'role') : 'role';
//   };

//   const getAvatarText = (name) => {
//     if (!name || typeof name !== 'string') return 'U';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const clearFilters = () => {
//     setSelectedCompany('');
//     setSelectedDepartment('');
//     setSearchTerm('');
//     setUserSearchTerm('');
//     setSelectedUser(null);
//     setShowUserDropdown(false);
//   };

//   const handleUserSelect = (user) => {
//     setSelectedUser(user);
//     setShowUserDropdown(false);
//     setUserSearchTerm('');
//   };

//   const toggleUserDropdown = () => {
//     setShowUserDropdown(!showUserDropdown);
//     if (!showUserDropdown) setUserSearchTerm(searchTerm || '');
//   };

//   const getFilteredUsersForDropdown = () => {
//     const term = (userSearchTerm || '').toLowerCase().trim();
//     if (!term) return users;
//     return users.filter(user => {
//       const name = (user?.name || '').toLowerCase();
//       const role = (user?.role || '').toLowerCase();
//       return name.includes(term) || role.includes(term);
//     });
//   };

//   const categories = ['All', ...new Set(availableModules.map(m => m.category))];
//   const filteredModules = activeCategory === 'All' ? availableModules : availableModules.filter(m => m.category === activeCategory);
//   const groupedModules = filteredModules.reduce((g, m) => ((g[m.category] ||= []).push(m), g), {});
//   const customPermissionsCount = userPermissions.filter(p => p.source === 'user').length;
//   const totalAccessCount = userPermissions.filter(p => hasModuleAccess(p.name)).length;
//   const filteredUsersForDropdown = getFilteredUsersForDropdown();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <button onClick={() => setShowPermissionGuide(!showPermissionGuide)} className="btn btn-ghost btn-sm gap-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             {showPermissionGuide ? 'Hide Guide' : 'Show Guide'}
//           </button>
//           <div className="text-sm text-gray-500 flex items-center gap-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
//             <span>{users.length} users</span>
//           </div>
//         </div>
//       </div>

//       {/* Alert */}
//       {message.text && (
//         <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
//           <div className="flex items-center gap-2">
//             {message.type === 'error' ? (
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             ) : (
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             )}
//             <span>{message.text}</span>
//           </div>
//         </div>
//       )}

//       {/* Filters Card */}
//       <div className="card bg-base-100 shadow-sm border overflow-visible">
//         <div className="card-body p-6 overflow-visible">
//           {/* Full-width Search on top */}
//           <div className="form-control w-full mb-4">
//             <label className="label">
//               <span className="label-text font-medium">Search</span>
//             </label>
//             <input
//               type="text"
//               className="input input-bordered w-full"
//               placeholder="Search employees by name or role..."
//               value={searchTerm}
//               onChange={(e) => { setSearchTerm(e.target.value); setUserSearchTerm(e.target.value); }}
//             />
//           </div>

//           {/* Row: Company / Department / Select Employees / Actions */}
//           <div className="flex flex-col lg:flex-row lg:items-end gap-4">
//             {/* Company */}
//             <div className="form-control flex-1">
//               <label className="label"><span className="label-text font-medium">Company</span></label>
//               <select
//                 value={selectedCompany}
//                 onChange={(e) => setSelectedCompany(e.target.value)}
//                 className="select select-bordered"
//                 disabled={filterLoading}
//               >
//                 <option value="">All Companies</option>
//                 {Array.isArray(companies) && companies.map(c => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Department */}
//             <div className="form-control flex-1">
//               <label className="label"><span className="label-text font-medium">Department</span></label>
//               <select
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 className="select select-bordered"
//                 disabled={!selectedCompany || filterLoading}
//               >
//                 <option value="">All Departments</option>
//                 {Array.isArray(departments) && departments.map(d => (
//                   <option key={d.id} value={d.id}>{d.department_name || d.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Select Employees (auto-sized with limits) */}
//             <div className="form-control" ref={dropdownRef} style={{ width: 'max-content' }}>
//               <label className="label">
//                 <span className="label-text font-medium">Select Employees</span>
//                 {users.length > 0 && (
//                   <span className="label-text-alt text-gray-500">
//                     {filteredUsersForDropdown.length} of {users.length}
//                   </span>
//                 )}
//               </label>

//               <div
//                 className={`dropdown dropdown-bottom relative overflow-visible ${showUserDropdown ? 'dropdown-open' : ''}`}
//                 style={{ width: 'max-content' }}
//               >
//                 <div
//                   tabIndex={0}
//                   role="button"
//                   className="btn btn-outline justify-between text-left"
//                   onClick={toggleUserDropdown}
//                   style={{ width: 'max-content', minWidth: '16rem', maxWidth: '28rem' }}
//                 >
//                   <span className="truncate">
//                     {selectedUser ? (
//                       <div className="flex items-center gap-2">
//                         <div className="avatar placeholder">
//                           <div className="bg-primary text-primary-content rounded-full w-6 h-6">
//                             <span className="text-xs font-bold">{getAvatarText(selectedUser.name)}</span>
//                           </div>
//                         </div>
//                         <span className="truncate">{selectedUser.name}</span>
//                       </div>
//                     ) : (
//                       'Choose an employee...'
//                     )}
//                   </span>
//                   <svg className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>

//                 <ul
//                   tabIndex={0}
//                   className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box max-h-96 overflow-y-auto z-[999] mt-2"
//                   style={{ minWidth: '16rem', maxWidth: '28rem' }}
//                 >
//                   {/* In-dropdown quick filter */}
//                   <div className="p-2 border-b">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Filter by name or role..."
//                         value={userSearchTerm}
//                         onChange={(e) => { setUserSearchTerm(e.target.value); setSearchTerm(e.target.value); }}
//                         className="input input-bordered input-sm w-full"
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     </div>
//                   </div>

//                   {/* Employees list (name + role only) */}
//                   <div className="max-h-64 overflow-y-auto">
//                     {loading ? (
//                       <div className="p-4 text-center">
//                         <span className="loading loading-spinner loading-sm"></span>
//                         <p className="text-sm text-gray-500 mt-1">Loading employees...</p>
//                       </div>
//                     ) : filteredUsersForDropdown.length === 0 ? (
//                       <div className="p-4 text-center text-gray-500">
//                         {userSearchTerm ? 'No employees match your search' : 'No employees found with current filters'}
//                       </div>
//                     ) : (
//                       filteredUsersForDropdown.map((u) => (
//                         <li key={u.id} className="border-b last:border-b-0">
//                           <button
//                             type="button"
//                             className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer w-full text-left"
//                             onClick={() => handleUserSelect(u)}
//                           >
//                             <div className="avatar placeholder">
//                               <div className="bg-primary text-primary-content rounded-full w-8 h-8">
//                                 <span className="text-xs font-bold">{getAvatarText(u.name)}</span>
//                               </div>
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="font-medium text-sm truncate">{u.name || 'Unknown User'}</div>
//                             </div>
//                             <span className={`badge badge-sm ${
//                               (u.role || '').toLowerCase() === 'admin' ? 'badge-error'
//                               : (u.role || '').toLowerCase() === 'manager' ? 'badge-warning'
//                               : (u.role || '').toLowerCase() === 'supervisor' ? 'badge-info'
//                               : 'badge-success'
//                             }`}>
//                               {u.role || 'employee'}
//                             </span>
//                           </button>
//                         </li>
//                       ))
//                     )}
//                   </div>
//                 </ul>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="form-control">
//               <label className="label invisible"><span className="label-text">Actions</span></label>
//               <div className="flex gap-2">
//                 {(selectedCompany || selectedDepartment || selectedUser || searchTerm) && (
//                   <button onClick={clearFilters} className="btn btn-outline gap-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                     Clear
//                   </button>
//                 )}
//                 <button onClick={fetchFilteredUsers} className="btn btn-primary gap-2" disabled={filterLoading}>
//                   {filterLoading ? (
//                     <span className="loading loading-spinner loading-sm"></span>
//                   ) : (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
//                   )}
//                   Refresh
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Permission Guide (only rules actually used) */}
//       {showPermissionGuide && (
//         <div className="sticky top-4 z-40">
//           <div className="card bg-base-100 shadow-lg border border-primary/20">
//             <div className="card-body p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-base-content">Permission Guide</h3>
//                     <p className="text-sm text-base-content/60">How permissions are determined</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setShowPermissionGuide(false)} className="btn btn-ghost btn-sm btn-circle">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
//                 <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-2 h-2 bg-primary rounded-full"></div>
//                     <span className="font-semibold text-primary text-sm">Custom Permission</span>
//                   </div>
//                   <p className="text-xs text-base-content/70">
//                     Explicit per-user override (source = <code>user</code>). Takes precedence over role defaults.
//                   </p>
//                 </div>

//                 <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-2 h-2 bg-warning rounded-full"></div>
//                     <span className="font-semibold text-warning text-sm">Role-Based</span>
//                   </div>
//                   <p className="text-xs text-base-content/70">
//                     Inherited from the user’s role when no custom override exists (source = <code>role</code>).
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="grid grid-cols-1 gap-6">
//         <div>
//           {selectedUser ? (
//             <div className="card bg-base-100 shadow-sm border">
//               <div className="card-body p-6 bg-gradient-to-r from-base-100 to-base-200 border-b">
//                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <div className="avatar placeholder">
//                       <div className="bg-primary text-primary-content rounded-xl w-14 h-14">
//                         <span className="text-xl font-bold">{getAvatarText(selectedUser.name)}</span>
//                       </div>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-base-content">{selectedUser.name}</h2>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className={`badge ${
//                           (selectedUser.role || '').toLowerCase() === 'admin' ? 'badge-error' :
//                           (selectedUser.role || '').toLowerCase() === 'manager' ? 'badge-warning' :
//                           (selectedUser.role || '').toLowerCase() === 'supervisor' ? 'badge-info' : 'badge-success'
//                         }`}>
//                           {selectedUser.role || 'employee'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
// <button
//   onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
//   className="btn btn-success btn-sm gap-2"
//   disabled={loading}
// >
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//   </svg>
//   Grant All
// </button>

//                     <button onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)} className="btn btn-error btn-sm gap-2" disabled={loading}>
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                       Revoke All
//                     </button>
//                     <button onClick={revokeAllPermissions} className="btn btn-warning btn-sm gap-2" disabled={loading}>
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
//                       Reset to Role
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 mt-6">
//                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
//                     <div className="stat-value text-2xl text-base-content">{totalAccessCount}</div>
//                     <div className="stat-desc text-base-content/60">Modules Accessed</div>
//                   </div>
//                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
//                     <div className="stat-value text-2xl text-primary">{customPermissionsCount}</div>
//                     <div className="stat-desc text-base-content/60">Custom Permissions</div>
//                   </div>
//                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
//                     <div className="stat-value text-2xl text-base-content">{availableModules.length - totalAccessCount}</div>
//                     <div className="stat-desc text-base-content/60">Modules Restricted</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 border-b bg-base-200/50">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
//                   <div className="flex items-center gap-2 overflow-x-auto">
//                     {['All', ...new Set(availableModules.map(m => m.category))].map(c => (
//                       <button key={c} onClick={() => setActiveCategory(c)} className={`btn btn-sm ${activeCategory === c ? 'btn-primary' : 'btn-ghost'}`}>{c}</button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {loading ? (
//                   <div className="text-center py-12">
//                     <span className="loading loading-spinner loading-lg"></span>
//                     <p className="mt-3 text-base-content/60">Loading permissions...</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6 max-h-[600px] overflow-y-auto">
//                     {Object.entries(groupedModules).map(([category, modules]) => (
//                       <div key={category}>
//                         <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
//                           <div className="w-2 h-2 bg-primary rounded-full"></div>
//                           {category}
//                           <span className="text-sm text-base-content/40 font-normal">({modules.length} modules)</span>
//                         </h3>

//                         <div className="grid gap-3">
//                           {modules.map(module => {
//                             const hasAccess = hasModuleAccess(module.name);
//                             const isCustom = getPermissionSource(module.name) === 'user';
//                             return (
//                               <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${hasAccess ? 'bg-success/10 border-success/20' : 'bg-base-200/50 border-base-300'} ${isCustom ? 'ring-1 ring-primary/20' : ''}`}>
//                                 <div className="flex items-center gap-4 flex-1">
//                                   <div className="text-2xl">{module.icon}</div>
//                                   <div className="flex-1">
//                                     <div className="flex items-center gap-2">
//                                       <h4 className="font-semibold text-base-content">{module.name}</h4>
//                                       {isCustom && <span className="badge badge-primary badge-sm">Custom</span>}
//                                     </div>
//                                     <p className="text-sm text-base-content/60 mt-1">{module.description}</p>
//                                   </div>
//                                 </div>
//                                 <input
//                                   type="checkbox"
//                                   className="toggle toggle-success toggle-lg"
//                                   checked={hasAccess}
//                                   onChange={(e) => toggleModuleAccess(module.name, e.target.checked)}
//                                   disabled={loading}
//                                 />
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="card bg-base-100 shadow-sm border h-96 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
//                 </div>
//                 <h3 className="text-lg font-semibold text-base-content mb-2">Select an Employee to Manage Permissions</h3>
//                 <p className="text-base-content/60 text-sm max-w-sm">Use the filters above to find and select an employee. Once selected, you can manage their module permissions and access controls.</p>
//                 <button onClick={() => setShowPermissionGuide(true)} className="btn btn-primary btn-sm mt-4 gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                   Show Permission Guide
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// // frontend/components/admin/PermissionManager.js
// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { API_BASE_URL } from '../../config';

// export default function PermissionManager() {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [availableModules, setAvailableModules] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeCategory, setActiveCategory] = useState('All');

//   const [companies, setCompanies] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [filterLoading, setFilterLoading] = useState(false);

//   const [showUserDropdown, setShowUserDropdown] = useState(false);
//   const [showPermissionGuide, setShowPermissionGuide] = useState(false);

//   const [userSearchTerm, setUserSearchTerm] = useState('');
//   const dropdownRef = useRef(null);

//   const MODULES_CONFIG = [
//     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
//     { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
//     { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
//     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
//     { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
//     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
//     { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
//     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
//     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
//     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
//     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
//     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
//     { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
//     { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
//     { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
//     { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
//     { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
//   ];

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowUserDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     fetchCompanies();
//     setAvailableModules(MODULES_CONFIG);
//     const timer = setTimeout(() => fetchFilteredUsers(), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (selectedCompany) {
//       setSelectedDepartment('');
//       fetchDepartments(selectedCompany);
//     } else {
//       setDepartments([]);
//       setSelectedDepartment('');
//     }
//   }, [selectedCompany]);

//   useEffect(() => {
//     fetchFilteredUsers();
//   }, [selectedCompany, selectedDepartment]);

//   useEffect(() => {
//     if (selectedUser && selectedUser.id) {
//       fetchUserPermissions(selectedUser.id);
//       setShowUserDropdown(false);
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     if (selectedUser && !showPermissionGuide) {
//       setShowPermissionGuide(true);
//     }
//   }, [selectedUser]);

//   const showMessage = (text, type = 'success') => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//   };

//   const fetchCompanies = async () => {
//     try {
//       setFilterLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const response = await fetch(`${API_BASE_URL}/api/admin/companies`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       let companiesArray = [];
//       if (Array.isArray(data)) companiesArray = data;
//       else if (data?.data && Array.isArray(data.data)) companiesArray = data.data;
//       else if (data?.companies && Array.isArray(data.companies)) companiesArray = data.companies;
//       setCompanies(companiesArray);
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load companies: ' + e.message, 'error');
//     } finally {
//       setFilterLoading(false);
//     }
//   };

//   const fetchDepartments = async (companyId) => {
//     try {
//       setFilterLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const url = `${API_BASE_URL}/api/admin/employees/companies/${companyId}/departments`;
//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       let departmentsArray = [];
//       if (Array.isArray(data)) departmentsArray = data;
//       else if (data?.data && Array.isArray(data.data)) departmentsArray = data.data;
//       else if (data?.departments && Array.isArray(data.departments)) departmentsArray = data.departments;
//       setDepartments(departmentsArray);
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load departments: ' + e.message, 'error');
//       setDepartments([]);
//     } finally {
//       setFilterLoading(false);
//     }
//   };

//   const fetchFilteredUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       let url = `${API_BASE_URL}/api/permissions/users`;
//       const params = new URLSearchParams();
//       if (selectedCompany) params.append('company_id', selectedCompany);
//       if (selectedDepartment) params.append('department_id', selectedDepartment);
//       if (params.toString()) url += `?${params.toString()}`;

//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();

//       let usersArray = [];
//       if (Array.isArray(data)) usersArray = data;
//       else if (data?.data && Array.isArray(data.data)) usersArray = data.data;
//       else if (data?.users && Array.isArray(data.users)) usersArray = data.users;
//       else if (data?.success && Array.isArray(data.data)) usersArray = data.data;
//       else if (data?.success && Array.isArray(data.users)) usersArray = data.users;

//       const normalizedUsers = usersArray.map(user => ({
//         id: user.id || user.user_id || user.employee_id,
//         name: user.name || user.full_name || user.employee_name || 'Unknown User',
//         email: user.email || user.email_address || 'No email',
//         role: user.role || user.user_role || 'employee',
//         company_name: user.company_name || user.company?.name,
//         department_name: user.department_name || user.department?.name
//       }));

//       setUsers(normalizedUsers);
//       setSelectedUser(null);
//       setUserSearchTerm(searchTerm || '');
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load users: ' + e.message, 'error');
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserPermissions = async (userId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       if (data && data.success) {
//         const modules = data.permissions?.modules || data.permissions || data.data || [];
//         setUserPermissions(Array.isArray(modules) ? modules : []);
//       } else {
//         throw new Error(data?.message || 'Failed to fetch user permissions');
//       }
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to load user permissions: ' + e.message, 'error');
//       setUserPermissions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleModuleAccess = async (moduleName, hasAccess) => {
//     if (!selectedUser?.id) return showMessage('No user selected', 'error');
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: selectedUser.id,
//           moduleName,
//           permissions: {
//             can_view: hasAccess,
//             can_create: hasAccess,
//             can_edit: hasAccess,
//             can_delete: hasAccess,
//             can_approve: hasAccess
//           }
//         })
//       });
//       const data = await response.json();
//       if (!data?.success) throw new Error(data?.message || 'Failed to update permission');

//       showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
//       setUserPermissions(prev => {
//         const idx = prev.findIndex(p => p.name === moduleName);
//         if (idx >= 0) {
//           const updated = [...prev];
//           updated[idx] = { ...updated[idx], can_view: hasAccess, can_create: hasAccess, can_edit: hasAccess, can_delete: hasAccess, can_approve: hasAccess, source: 'user' };
//           return updated;
//         }
//         return [...prev, { name: moduleName, can_view: hasAccess, can_create: hasAccess, can_edit: hasAccess, can_delete: hasAccess, can_approve: hasAccess, source: 'user' }];
//       });
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to update permission: ' + e.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

// // Tries bulk-update; if partial/failed, falls back to per-module /grant calls
// const bulkUpdatePermissions = async (modules, hasAccess) => {
//   if (!selectedUser?.id) return showMessage('No user selected', 'error');

//   const token = localStorage.getItem('hrms_token');
//   if (!token) return showMessage('Authentication token not found', 'error');

//   setLoading(true);
//   try {
//     // Build both object-map and array payloads to be compatible with different backends
//     const bulkMap = {};
//     const bulkArray = modules.map(m => ({
//       moduleName: m,
//       permissions: {
//         can_view: hasAccess,
//         can_create: hasAccess,
//         can_edit: hasAccess,
//         can_delete: hasAccess,
//         can_approve: hasAccess
//       }
//     }));
//     modules.forEach(m => {
//       bulkMap[m] = {
//         can_view: hasAccess,
//         can_create: hasAccess,
//         can_edit: hasAccess,
//         can_delete: hasAccess,
//         can_approve: hasAccess
//       };
//     });

//     // Attempt bulk endpoint first
//     let bulkWorked = false;
//     try {
//       const r = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: selectedUser.id,
//           // Provide both shapes; your backend can pick either
//           permissions: bulkMap,
//           permissionsArray: bulkArray
//         })
//       });
//       const data = await r.json();

//       // Heuristics for success across backends
//       const updatedCount =
//         (Array.isArray(data?.updated) && data.updated.length) ||
//         (typeof data?.updatedCount === 'number' && data.updatedCount) ||
//         (data?.success ? modules.length : 0);

//       if (data?.success && updatedCount >= modules.length) {
//         bulkWorked = true;
//       }
//     } catch (e) {
//       // ignore and fall through to per-module
//       console.warn('bulk-update failed, falling back to per-module:', e);
//     }

//     // Fallback: call /grant for each module in parallel
//     if (!bulkWorked) {
//       const results = await Promise.allSettled(
//         modules.map(m =>
//           fetch(`${API_BASE_URL}/api/permissions/grant`, {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               userId: selectedUser.id,
//               moduleName: m,
//               permissions: {
//                 can_view: hasAccess,
//                 can_create: hasAccess,
//                 can_edit: hasAccess,
//                 can_delete: hasAccess,
//                 can_approve: hasAccess
//               }
//             })
//           }).then(res => res.json())
//         )
//       );

//       const ok = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
//       if (ok === 0) throw new Error('Failed to update any modules via fallback');
//     }

//     // Local state update for ALL modules
//     setUserPermissions(prev => {
//       const next = [...prev];
//       modules.forEach(m => {
//         const i = next.findIndex(p => p.name === m);
//         if (i >= 0) {
//           next[i] = {
//             ...next[i],
//             can_view: hasAccess,
//             can_create: hasAccess,
//             can_edit: hasAccess,
//             can_delete: hasAccess,
//             can_approve: hasAccess,
//             source: 'user'
//           };
//         } else {
//           next.push({
//             name: m,
//             can_view: hasAccess,
//             can_create: hasAccess,
//             can_edit: hasAccess,
//             can_delete: hasAccess,
//             can_approve: hasAccess,
//             source: 'user'
//           });
//         }
//       });
//       return next;
//     });

//     showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
//   } catch (e) {
//     console.error(e);
//     showMessage('Failed to update permissions: ' + e.message, 'error');
//   } finally {
//     setLoading(false);
//   }
// };


//   const revokeAllPermissions = async () => {
//     if (!selectedUser?.id) return showMessage('No user selected', 'error');
//     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) return;
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       if (!token) return showMessage('Authentication token not found', 'error');

//       const customPermissions = userPermissions.filter(p => p.source === 'user');
//       if (customPermissions.length === 0) return showMessage('No custom permissions to revoke', 'info');

//       const bulkPermissions = {};
//       customPermissions.forEach(perm => {
//         bulkPermissions[perm.name] = { can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false };
//       });

//       const response = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: selectedUser.id, permissions: bulkPermissions })
//       });
//       const data = await response.json();
//       if (!data?.success) throw new Error(data?.message || 'Failed to revoke permissions');

//       showMessage('All custom permissions revoked successfully');
//       setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
//     } catch (e) {
//       console.error(e);
//       showMessage('Failed to revoke permissions: ' + e.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasModuleAccess = (moduleName) => {
//     if (!moduleName) return false;
//     const userPerm = userPermissions.find(p => p.name === moduleName);
//     if (!userPerm) return false;
//     return Boolean(userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve);
//   };

//   const getPermissionSource = (moduleName) => {
//     if (!moduleName) return 'role';
//     const userPerm = userPermissions.find(p => p.name === moduleName);
//     return userPerm ? (userPerm.source || 'role') : 'role';
//   };

//   const getAvatarText = (name) => {
//     if (!name || typeof name !== 'string') return 'U';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const clearFilters = () => {
//     setSelectedCompany('');
//     setSelectedDepartment('');
//     setSearchTerm('');
//     setUserSearchTerm('');
//     setSelectedUser(null);
//     setShowUserDropdown(false);
//   };

//   const handleUserSelect = (user) => {
//     setSelectedUser(user);
//     setShowUserDropdown(false);
//     setUserSearchTerm('');
//   };

//   const toggleUserDropdown = () => {
//     setShowUserDropdown(!showUserDropdown);
//     if (!showUserDropdown) setUserSearchTerm(searchTerm || '');
//   };

//   const getFilteredUsersForDropdown = () => {
//     const term = (userSearchTerm || '').toLowerCase().trim();
//     if (!term) return users;
//     return users.filter(user => {
//       const name = (user?.name || '').toLowerCase();
//       const role = (user?.role || '').toLowerCase();
//       return name.includes(term) || role.includes(term);
//     });
//   };

//   const categories = ['All', ...new Set(availableModules.map(m => m.category))];
//   const filteredModules = activeCategory === 'All' ? availableModules : availableModules.filter(m => m.category === activeCategory);
//   const groupedModules = filteredModules.reduce((g, m) => ((g[m.category] ||= []).push(m), g), {});
//   const customPermissionsCount = userPermissions.filter(p => p.source === 'user').length;
//   const totalAccessCount = userPermissions.filter(p => hasModuleAccess(p.name)).length;
//   const filteredUsersForDropdown = getFilteredUsersForDropdown();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <button onClick={() => setShowPermissionGuide(!showPermissionGuide)} className="btn btn-ghost btn-sm gap-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             {showPermissionGuide ? 'Hide Guide' : 'Show Guide'}
//           </button>
//           <div className="text-sm text-gray-500 flex items-center gap-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
//             <span>{users.length} users</span>
//           </div>
//         </div>
//       </div>

//       {/* Alert */}
//       {message.text && (
//         <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
//           <div className="flex items-center gap-2">
//             {message.type === 'error' ? (
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             ) : (
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             )}
//             <span>{message.text}</span>
//           </div>
//         </div>
//       )}

//       {/* Filters Card */}
//       <div className="card bg-base-100 shadow-sm border overflow-visible">
//         <div className="card-body p-6 overflow-visible">
//           {/* Full-width Search on top */}
//           <div className="form-control w-full mb-4">
//             <label className="label">
//               <span className="label-text font-medium">Search</span>
//             </label>
//             <input
//               type="text"
//               className="input input-bordered w-full"
//               placeholder="Search employees by name or role..."
//               value={searchTerm}
//               onChange={(e) => { setSearchTerm(e.target.value); setUserSearchTerm(e.target.value); }}
//             />
//           </div>

//           {/* Row: Company / Department / Select Employees / Actions */}
//           <div className="flex flex-col lg:flex-row lg:items-end gap-4">
//             {/* Company */}
//             <div className="form-control flex-1">
//               <label className="label"><span className="label-text font-medium">Company</span></label>
//               <select
//                 value={selectedCompany}
//                 onChange={(e) => setSelectedCompany(e.target.value)}
//                 className="select select-bordered"
//                 disabled={filterLoading}
//               >
//                 <option value="">All Companies</option>
//                 {Array.isArray(companies) && companies.map(c => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Department */}
//             <div className="form-control flex-1">
//               <label className="label"><span className="label-text font-medium">Department</span></label>
//               <select
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 className="select select-bordered"
//                 disabled={!selectedCompany || filterLoading}
//               >
//                 <option value="">All Departments</option>
//                 {Array.isArray(departments) && departments.map(d => (
//                   <option key={d.id} value={d.id}>{d.department_name || d.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Select Employees (auto-sized with limits) */}
//             <div className="form-control" ref={dropdownRef} style={{ width: 'max-content' }}>
//               <label className="label">
//                 <span className="label-text font-medium">Select Employees</span>
//                 {users.length > 0 && (
//                   <span className="label-text-alt text-gray-500">
//                     {filteredUsersForDropdown.length} of {users.length}
//                   </span>
//                 )}
//               </label>

//               <div
//                 className={`dropdown dropdown-bottom relative overflow-visible ${showUserDropdown ? 'dropdown-open' : ''}`}
//                 style={{ width: 'max-content' }}
//               >
//                 <div
//                   tabIndex={0}
//                   role="button"
//                   className="btn btn-outline justify-between text-left"
//                   onClick={toggleUserDropdown}
//                   style={{ width: 'max-content', minWidth: '16rem', maxWidth: '28rem' }}
//                 >
//                   <span className="truncate">
//                     {selectedUser ? (
//                       <div className="flex items-center gap-2">
//                         <div className="avatar placeholder">
//                           <div className="bg-primary text-primary-content rounded-full w-6 h-6">
//                             <span className="text-xs font-bold">{getAvatarText(selectedUser.name)}</span>
//                           </div>
//                         </div>
//                         <span className="truncate">{selectedUser.name}</span>
//                       </div>
//                     ) : (
//                       'Choose an employee...'
//                     )}
//                   </span>
//                   <svg className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>

//                 <ul
//                   tabIndex={0}
//                   className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box max-h-96 overflow-y-auto z-[999] mt-2"
//                   style={{ minWidth: '16rem', maxWidth: '28rem' }}
//                 >
//                   {/* In-dropdown quick filter */}
//                   <div className="p-2 border-b">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Filter by name or role..."
//                         value={userSearchTerm}
//                         onChange={(e) => { setUserSearchTerm(e.target.value); setSearchTerm(e.target.value); }}
//                         className="input input-bordered input-sm w-full"
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     </div>
//                   </div>

//                   {/* Employees list (name + role only) */}
//                   <div className="max-h-64 overflow-y-auto">
//                     {loading ? (
//                       <div className="p-4 text-center">
//                         <span className="loading loading-spinner loading-sm"></span>
//                         <p className="text-sm text-gray-500 mt-1">Loading employees...</p>
//                       </div>
//                     ) : filteredUsersForDropdown.length === 0 ? (
//                       <div className="p-4 text-center text-gray-500">
//                         {userSearchTerm ? 'No employees match your search' : 'No employees found with current filters'}
//                       </div>
//                     ) : (
//                       filteredUsersForDropdown.map((u) => (
//                         <li key={u.id} className="border-b last:border-b-0">
//                           <button
//                             type="button"
//                             className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer w-full text-left"
//                             onClick={() => handleUserSelect(u)}
//                           >
//                             <div className="avatar placeholder">
//                               <div className="bg-primary text-primary-content rounded-full w-8 h-8">
//                                 <span className="text-xs font-bold">{getAvatarText(u.name)}</span>
//                               </div>
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="font-medium text-sm truncate">{u.name || 'Unknown User'}</div>
//                             </div>
//                             <span className={`badge badge-sm ${
//                               (u.role || '').toLowerCase() === 'admin' ? 'badge-error'
//                               : (u.role || '').toLowerCase() === 'manager' ? 'badge-warning'
//                               : (u.role || '').toLowerCase() === 'supervisor' ? 'badge-info'
//                               : 'badge-success'
//                             }`}>
//                               {u.role || 'employee'}
//                             </span>
//                           </button>
//                         </li>
//                       ))
//                     )}
//                   </div>
//                 </ul>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="form-control">
//               <label className="label invisible"><span className="label-text">Actions</span></label>
//               <div className="flex gap-2">
//                 {(selectedCompany || selectedDepartment || selectedUser || searchTerm) && (
//                   <button onClick={clearFilters} className="btn btn-outline gap-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                     Clear
//                   </button>
//                 )}
//                 <button onClick={fetchFilteredUsers} className="btn btn-primary gap-2" disabled={filterLoading}>
//                   {filterLoading ? (
//                     <span className="loading loading-spinner loading-sm"></span>
//                   ) : (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
//                   )}
//                   Refresh
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Permission Guide (only rules actually used) */}
//       {showPermissionGuide && (
//         <div className="sticky top-4 z-40">
//           <div className="card bg-base-100 shadow-lg border border-primary/20">
//             <div className="card-body p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-base-content">Permission Guide</h3>
//                     <p className="text-sm text-base-content/60">How permissions are determined</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setShowPermissionGuide(false)} className="btn btn-ghost btn-sm btn-circle">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
//                 <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-2 h-2 bg-primary rounded-full"></div>
//                     <span className="font-semibold text-primary text-sm">Custom Permission</span>
//                   </div>
//                   <p className="text-xs text-base-content/70">
//                     Explicit per-user override (source = <code>user</code>). Takes precedence over role defaults.
//                   </p>
//                 </div>

//                 <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-2 h-2 bg-warning rounded-full"></div>
//                     <span className="font-semibold text-warning text-sm">Role-Based</span>
//                   </div>
//                   <p className="text-xs text-base-content/70">
//                     Inherited from the user’s role when no custom override exists (source = <code>role</code>).
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="grid grid-cols-1 gap-6">
//         <div>
//           {selectedUser ? (
//             <div className="card bg-base-100 shadow-sm border">
//               <div className="card-body p-6 bg-gradient-to-r from-base-100 to-base-200 border-b">
//                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <div className="avatar placeholder">
//                       <div className="bg-primary text-primary-content rounded-xl w-14 h-14">
//                         <span className="text-xl font-bold">{getAvatarText(selectedUser.name)}</span>
//                       </div>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-base-content">{selectedUser.name}</h2>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className={`badge ${
//                           (selectedUser.role || '').toLowerCase() === 'admin' ? 'badge-error' :
//                           (selectedUser.role || '').toLowerCase() === 'manager' ? 'badge-warning' :
//                           (selectedUser.role || '').toLowerCase() === 'supervisor' ? 'badge-info' : 'badge-success'
//                         }`}>
//                           {selectedUser.role || 'employee'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
// <button
//   onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
//   className="btn btn-success btn-sm gap-2"
//   disabled={loading}
// >
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//   </svg>
//   Grant All
// </button>

//                     <button onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)} className="btn btn-error btn-sm gap-2" disabled={loading}>
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                       Revoke All
//                     </button>
//                     <button onClick={revokeAllPermissions} className="btn btn-warning btn-sm gap-2" disabled={loading}>
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
//                       Reset to Role
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 mt-6">
//                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
//                     <div className="stat-value text-2xl text-base-content">{totalAccessCount}</div>
//                     <div className="stat-desc text-base-content/60">Modules Accessed</div>
//                   </div>
//                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
//                     <div className="stat-value text-2xl text-primary">{customPermissionsCount}</div>
//                     <div className="stat-desc text-base-content/60">Custom Permissions</div>
//                   </div>
//                   <div className="stat p-4 bg-base-100 rounded-lg border text-center">
//                     <div className="stat-value text-2xl text-base-content">{availableModules.length - totalAccessCount}</div>
//                     <div className="stat-desc text-base-content/60">Modules Restricted</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 border-b bg-base-200/50">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
//                   <div className="flex items-center gap-2 overflow-x-auto">
//                     {['All', ...new Set(availableModules.map(m => m.category))].map(c => (
//                       <button key={c} onClick={() => setActiveCategory(c)} className={`btn btn-sm ${activeCategory === c ? 'btn-primary' : 'btn-ghost'}`}>{c}</button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {loading ? (
//                   <div className="text-center py-12">
//                     <span className="loading loading-spinner loading-lg"></span>
//                     <p className="mt-3 text-base-content/60">Loading permissions...</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6 max-h-[600px] overflow-y-auto">
//                     {Object.entries(groupedModules).map(([category, modules]) => (
//                       <div key={category}>
//                         <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
//                           <div className="w-2 h-2 bg-primary rounded-full"></div>
//                           {category}
//                           <span className="text-sm text-base-content/40 font-normal">({modules.length} modules)</span>
//                         </h3>

//                         <div className="grid gap-3">
//                           {modules.map(module => {
//                             const hasAccess = hasModuleAccess(module.name);
//                             const isCustom = getPermissionSource(module.name) === 'user';
//                             return (
//                               <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${hasAccess ? 'bg-success/10 border-success/20' : 'bg-base-200/50 border-base-300'} ${isCustom ? 'ring-1 ring-primary/20' : ''}`}>
//                                 <div className="flex items-center gap-4 flex-1">
//                                   <div className="text-2xl">{module.icon}</div>
//                                   <div className="flex-1">
//                                     <div className="flex items-center gap-2">
//                                       <h4 className="font-semibold text-base-content">{module.name}</h4>
//                                       {isCustom && <span className="badge badge-primary badge-sm">Custom</span>}
//                                     </div>
//                                     <p className="text-sm text-base-content/60 mt-1">{module.description}</p>
//                                   </div>
//                                 </div>
//                                 <input
//                                   type="checkbox"
//                                   className="toggle toggle-success toggle-lg"
//                                   checked={hasAccess}
//                                   onChange={(e) => toggleModuleAccess(module.name, e.target.checked)}
//                                   disabled={loading}
//                                 />
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="card bg-base-100 shadow-sm border h-96 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
//                 </div>
//                 <h3 className="text-lg font-semibold text-base-content mb-2">Select an Employee to Manage Permissions</h3>
//                 <p className="text-base-content/60 text-sm max-w-sm">Use the filters above to find and select an employee. Once selected, you can manage their module permissions and access controls.</p>
//                 <button onClick={() => setShowPermissionGuide(true)} className="btn btn-primary btn-sm mt-4 gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                   Show Permission Guide
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// frontend/components/admin/PermissionManager.js
"use client";

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../config';

export default function PermissionManager() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userCompanyPermissions, setUserCompanyPermissions] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' or 'companies'
  
  const dropdownRef = useRef(null);

  const MODULES_CONFIG = [
    { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
    { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
    { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
    { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
    { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
    { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
    { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
    { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
    { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
    { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
    { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
    { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
    { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
    { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
    { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
    { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
    { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCompanies();
    fetchAllCompanies(); // Fetch all companies for permissions
    setAvailableModules(MODULES_CONFIG);
    const timer = setTimeout(() => fetchFilteredUsers(), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      setSelectedDepartment('');
      fetchDepartments(selectedCompany);
    } else {
      setDepartments([]);
      setSelectedDepartment('');
    }
  }, [selectedCompany]);

  useEffect(() => {
    fetchFilteredUsers();
  }, [selectedCompany, selectedDepartment]);

  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      fetchUserPermissions(selectedUser.id);
      fetchUserCompanyPermissions(selectedUser.id);
      setShowUserDropdown(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser && !showPermissionGuide) {
      setShowPermissionGuide(true);
    }
  }, [selectedUser]);

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const fetchCompanies = async () => {
    try {
      setFilterLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const response = await fetch(`${API_BASE_URL}/api/admin/companies`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let companiesArray = [];
      if (Array.isArray(data)) companiesArray = data;
      else if (data?.data && Array.isArray(data.data)) companiesArray = data.data;
      else if (data?.companies && Array.isArray(data.companies)) companiesArray = data.companies;
      setCompanies(companiesArray);
    } catch (e) {
      console.error(e);
      showMessage('Failed to load companies: ' + e.message, 'error');
    } finally {
      setFilterLoading(false);
    }
  };

  const fetchAllCompanies = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/permissions/companies/all`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setAvailableCompanies(data.companies || []);
      }
    } catch (e) {
      console.error('Failed to load all companies:', e);
    }
  };

  const fetchDepartments = async (companyId) => {
    try {
      setFilterLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const url = `${API_BASE_URL}/api/admin/employees/companies/${companyId}/departments`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let departmentsArray = [];
      if (Array.isArray(data)) departmentsArray = data;
      else if (data?.data && Array.isArray(data.data)) departmentsArray = data.data;
      else if (data?.departments && Array.isArray(data.departments)) departmentsArray = data.departments;
      setDepartments(departmentsArray);
    } catch (e) {
      console.error(e);
      showMessage('Failed to load departments: ' + e.message, 'error');
      setDepartments([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const fetchFilteredUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      let url = `${API_BASE_URL}/api/permissions/users`;
      const params = new URLSearchParams();
      if (selectedCompany) params.append('company_id', selectedCompany);
      if (selectedDepartment) params.append('department_id', selectedDepartment);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      let usersArray = [];
      if (Array.isArray(data)) usersArray = data;
      else if (data?.data && Array.isArray(data.data)) usersArray = data.data;
      else if (data?.users && Array.isArray(data.users)) usersArray = data.users;
      else if (data?.success && Array.isArray(data.data)) usersArray = data.data;
      else if (data?.success && Array.isArray(data.users)) usersArray = data.users;

      const normalizedUsers = usersArray.map(user => ({
        id: user.id || user.user_id || user.employee_id,
        name: user.name || user.full_name || user.employee_name || 'Unknown User',
        email: user.email || user.email_address || 'No email',
        role: user.role || user.user_role || 'employee',
        company_name: user.company_name || user.company?.name,
        department_name: user.department_name || user.department?.name
      }));

      setUsers(normalizedUsers);
      setSelectedUser(null);
      setUserSearchTerm(searchTerm || '');
    } catch (e) {
      console.error(e);
      showMessage('Failed to load users: ' + e.message, 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPermissions = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data && data.success) {
        const modules = data.permissions?.modules || data.permissions || data.data || [];
        setUserPermissions(Array.isArray(modules) ? modules : []);
      } else {
        throw new Error(data?.message || 'Failed to fetch user permissions');
      }
    } catch (e) {
      console.error(e);
      showMessage('Failed to load user permissions: ' + e.message, 'error');
      setUserPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCompanyPermissions = async (userId) => {
    try {
      const token = localStorage.getItem('hrms_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/permissions/company/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setUserCompanyPermissions(data.companies || []);
      }
    } catch (e) {
      console.error('Failed to load company permissions:', e);
      setUserCompanyPermissions([]);
    }
  };

  const toggleModuleAccess = async (moduleName, hasAccess) => {
    if (!selectedUser?.id) return showMessage('No user selected', 'error');
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          moduleName,
          permissions: {
            can_view: hasAccess,
            can_create: hasAccess,
            can_edit: hasAccess,
            can_delete: hasAccess,
            can_approve: hasAccess
          }
        })
      });
      const data = await response.json();
      if (!data?.success) throw new Error(data?.message || 'Failed to update permission');

      showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
      setUserPermissions(prev => {
        const idx = prev.findIndex(p => p.name === moduleName);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], can_view: hasAccess, can_create: hasAccess, can_edit: hasAccess, can_delete: hasAccess, can_approve: hasAccess, source: 'user' };
          return updated;
        }
        return [...prev, { name: moduleName, can_view: hasAccess, can_create: hasAccess, can_edit: hasAccess, can_delete: hasAccess, can_approve: hasAccess, source: 'user' }];
      });
    } catch (e) {
      console.error(e);
      showMessage('Failed to update permission: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanyPermission = async (companyId, permissionType) => {
    if (!selectedUser?.id) return showMessage('No user selected', 'error');
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const company = userCompanyPermissions.find(c => c.id === companyId);
      if (!company) return;

      const currentValue = company.permissions?.[permissionType] || false;
      const newValue = !currentValue;

      // Prepare permissions object
      const permissions = {
        can_view: permissionType === 'can_view' ? newValue : (company.permissions?.can_view || false),
        can_edit: permissionType === 'can_edit' ? newValue : (company.permissions?.can_edit || false),
        can_manage_employees: permissionType === 'can_manage_employees' ? newValue : (company.permissions?.can_manage_employees || false),
        can_manage_permissions: permissionType === 'can_manage_permissions' ? newValue : (company.permissions?.can_manage_permissions || false)
      };

      const response = await fetch(`${API_BASE_URL}/api/permissions/company/grant`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          companyId,
          permissions
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to update permission');

      showMessage(`Company permission ${newValue ? 'granted' : 'revoked'} successfully`);
      
      // Update local state
      setUserCompanyPermissions(prev => prev.map(comp => {
        if (comp.id === companyId) {
          return {
            ...comp,
            permissions: {
              ...comp.permissions,
              [permissionType]: newValue
            }
          };
        }
        return comp;
      }));
    } catch (e) {
      console.error('Error updating company permission:', e);
      showMessage('Failed to update permission: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdatePermissions = async (modules, hasAccess) => {
    if (!selectedUser?.id) return showMessage('No user selected', 'error');

    const token = localStorage.getItem('hrms_token');
    if (!token) return showMessage('Authentication token not found', 'error');

    setLoading(true);
    try {
      const bulkMap = {};
      const bulkArray = modules.map(m => ({
        moduleName: m,
        permissions: {
          can_view: hasAccess,
          can_create: hasAccess,
          can_edit: hasAccess,
          can_delete: hasAccess,
          can_approve: hasAccess
        }
      }));
      modules.forEach(m => {
        bulkMap[m] = {
          can_view: hasAccess,
          can_create: hasAccess,
          can_edit: hasAccess,
          can_delete: hasAccess,
          can_approve: hasAccess
        };
      });

      let bulkWorked = false;
      try {
        const r = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedUser.id,
            permissions: bulkMap,
            permissionsArray: bulkArray
          })
        });
        const data = await r.json();

        const updatedCount =
          (Array.isArray(data?.updated) && data.updated.length) ||
          (typeof data?.updatedCount === 'number' && data.updatedCount) ||
          (data?.success ? modules.length : 0);

        if (data?.success && updatedCount >= modules.length) {
          bulkWorked = true;
        }
      } catch (e) {
        console.warn('bulk-update failed, falling back to per-module:', e);
      }

      if (!bulkWorked) {
        const results = await Promise.allSettled(
          modules.map(m =>
            fetch(`${API_BASE_URL}/api/permissions/grant`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: selectedUser.id,
                moduleName: m,
                permissions: {
                  can_view: hasAccess,
                  can_create: hasAccess,
                  can_edit: hasAccess,
                  can_delete: hasAccess,
                  can_approve: hasAccess
                }
              })
            }).then(res => res.json())
          )
        );

        const ok = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
        if (ok === 0) throw new Error('Failed to update any modules via fallback');
      }

      setUserPermissions(prev => {
        const next = [...prev];
        modules.forEach(m => {
          const i = next.findIndex(p => p.name === m);
          if (i >= 0) {
            next[i] = {
              ...next[i],
              can_view: hasAccess,
              can_create: hasAccess,
              can_edit: hasAccess,
              can_delete: hasAccess,
              can_approve: hasAccess,
              source: 'user'
            };
          } else {
            next.push({
              name: m,
              can_view: hasAccess,
              can_create: hasAccess,
              can_edit: hasAccess,
              can_delete: hasAccess,
              can_approve: hasAccess,
              source: 'user'
            });
          }
        });
        return next;
      });

      showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
    } catch (e) {
      console.error(e);
      showMessage('Failed to update permissions: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateCompanyPermissions = async (hasAccess) => {
    if (!selectedUser?.id) return showMessage('No user selected', 'error');
    
    if (!confirm(`Are you sure you want to ${hasAccess ? 'grant view access to' : 'revoke all access from'} all companies for this user?`)) return;

    const token = localStorage.getItem('hrms_token');
    if (!token) return showMessage('Authentication token not found', 'error');

    setLoading(true);
    try {
      const companyPermissions = {};
      availableCompanies.forEach(company => {
        companyPermissions[company.id] = {
          can_view: hasAccess,
          can_edit: false,
          can_manage_employees: false,
          can_manage_permissions: false
        };
      });

      const response = await fetch(`${API_BASE_URL}/api/permissions/company/bulk-update`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          companyPermissions
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to update permissions');

      showMessage(`All company permissions ${hasAccess ? 'granted' : 'revoked'} successfully`);
      
      // Update local state
      setUserCompanyPermissions(prev => prev.map(company => ({
        ...company,
        permissions: {
          can_view: hasAccess,
          can_edit: false,
          can_manage_employees: false,
          can_manage_permissions: false
        }
      })));
    } catch (e) {
      console.error('Error bulk updating company permissions:', e);
      showMessage('Failed to update permissions: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const revokeAllPermissions = async () => {
    if (!selectedUser?.id) return showMessage('No user selected', 'error');
    if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const customPermissions = userPermissions.filter(p => p.source === 'user');
      if (customPermissions.length === 0) return showMessage('No custom permissions to revoke', 'info');

      const bulkPermissions = {};
      customPermissions.forEach(perm => {
        bulkPermissions[perm.name] = { can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false };
      });

      const response = await fetch(`${API_BASE_URL}/api/permissions/bulk-update`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, permissions: bulkPermissions })
      });
      const data = await response.json();
      if (!data?.success) throw new Error(data?.message || 'Failed to revoke permissions');

      showMessage('All custom permissions revoked successfully');
      setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
    } catch (e) {
      console.error(e);
      showMessage('Failed to revoke permissions: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const revokeAllCompanyPermissions = async () => {
    if (!selectedUser?.id) return showMessage('No user selected', 'error');
    if (!confirm('Are you sure you want to revoke all company permissions for this user? This will leave them with access only to their own company.')) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      // Prepare to revoke all company permissions
      const companyPermissions = {};
      userCompanyPermissions.forEach(company => {
        // Don't revoke access to their own company
        if (company.id !== selectedUser.company_id) {
          companyPermissions[company.id] = {
            can_view: false,
            can_edit: false,
            can_manage_employees: false,
            can_manage_permissions: false
          };
        }
      });

      if (Object.keys(companyPermissions).length === 0) {
        return showMessage('No company permissions to revoke', 'info');
      }

      const response = await fetch(`${API_BASE_URL}/api/permissions/company/bulk-update`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          companyPermissions
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to revoke permissions');

      showMessage('All company permissions revoked successfully');
      
      // Update local state - keep only their own company
      setUserCompanyPermissions(prev => prev.map(company => {
        if (company.id === selectedUser.company_id) {
          return company; // Keep own company
        }
        return {
          ...company,
          permissions: {
            can_view: false,
            can_edit: false,
            can_manage_employees: false,
            can_manage_permissions: false
          }
        };
      }));
    } catch (e) {
      console.error(e);
      showMessage('Failed to revoke company permissions: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const hasModuleAccess = (moduleName) => {
    if (!moduleName) return false;
    const userPerm = userPermissions.find(p => p.name === moduleName);
    if (!userPerm) return false;
    return Boolean(userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve);
  };

  const hasCompanyAccess = (companyId) => {
    if (!companyId) return false;
    const companyPerm = userCompanyPermissions.find(c => c.id === companyId);
    if (!companyPerm) return false;
    return companyPerm.permissions?.can_view || false;
  };

  const getPermissionSource = (moduleName) => {
    if (!moduleName) return 'role';
    const userPerm = userPermissions.find(p => p.name === moduleName);
    return userPerm ? (userPerm.source || 'role') : 'role';
  };

  const getAvatarText = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const clearFilters = () => {
    setSelectedCompany('');
    setSelectedDepartment('');
    setSearchTerm('');
    setUserSearchTerm('');
    setSelectedUser(null);
    setShowUserDropdown(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowUserDropdown(false);
    setUserSearchTerm('');
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    if (!showUserDropdown) setUserSearchTerm(searchTerm || '');
  };

  const getFilteredUsersForDropdown = () => {
    const term = (userSearchTerm || '').toLowerCase().trim();
    if (!term) return users;
    return users.filter(user => {
      const name = (user?.name || '').toLowerCase();
      const role = (user?.role || '').toLowerCase();
      return name.includes(term) || role.includes(term);
    });
  };

  const getFilteredCompanies = () => {
    const term = (companySearchTerm || '').toLowerCase().trim();
    if (!term) return userCompanyPermissions;
    return userCompanyPermissions.filter(company => 
      company.name.toLowerCase().includes(term) ||
      company.email?.toLowerCase().includes(term)
    );
  };

  const getPermissionLevel = (company) => {
    const perms = company.permissions || {};
    if (perms.can_manage_permissions) return { label: 'Full Admin', color: 'badge-secondary' };
    if (perms.can_manage_employees) return { label: 'HR Manager', color: 'badge-info' };
    if (perms.can_edit) return { label: 'Editor', color: 'badge-warning' };
    if (perms.can_view) return { label: 'Viewer', color: 'badge-success' };
    if (company.is_own_company) return { label: 'Own Company', color: 'badge-neutral' };
    return { label: 'No Access', color: 'badge-error' };
  };

  const categories = ['All', ...new Set(availableModules.map(m => m.category))];
  const filteredModules = activeCategory === 'All' ? availableModules : availableModules.filter(m => m.category === activeCategory);
  const groupedModules = filteredModules.reduce((g, m) => ((g[m.category] ||= []).push(m), g), {});
  const customPermissionsCount = userPermissions.filter(p => p.source === 'user').length;
  const totalAccessCount = userPermissions.filter(p => hasModuleAccess(p.name)).length;
  const filteredUsersForDropdown = getFilteredUsersForDropdown();
  const filteredCompanies = getFilteredCompanies();
  const companyAccessCount = userCompanyPermissions.filter(c => c.permissions?.can_view).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPermissionGuide(!showPermissionGuide)} className="btn btn-ghost btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {showPermissionGuide ? 'Hide Guide' : 'Show Guide'}
          </button>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
            <span>{users.length} users</span>
          </div>
        </div>
      </div>

      {/* Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
          <div className="flex items-center gap-2">
            {message.type === 'error' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Filters Card */}
      <div className="card bg-base-100 shadow-sm border overflow-visible">
        <div className="card-body p-6 overflow-visible">
          {/* Full-width Search on top */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-medium">Search</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Search employees by name or role..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setUserSearchTerm(e.target.value); }}
            />
          </div>

          {/* Row: Company / Department / Select Employees / Actions */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            {/* Company */}
            <div className="form-control flex-1">
              <label className="label"><span className="label-text font-medium">Company</span></label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="select select-bordered"
                disabled={filterLoading}
              >
                <option value="">All Companies</option>
                {Array.isArray(companies) && companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="form-control flex-1">
              <label className="label"><span className="label-text font-medium">Department</span></label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="select select-bordered"
                disabled={!selectedCompany || filterLoading}
              >
                <option value="">All Departments</option>
                {Array.isArray(departments) && departments.map(d => (
                  <option key={d.id} value={d.id}>{d.department_name || d.name}</option>
                ))}
              </select>
            </div>

            {/* Select Employees (auto-sized with limits) */}
            <div className="form-control" ref={dropdownRef} style={{ width: 'max-content' }}>
              <label className="label">
                <span className="label-text font-medium">Select Employees</span>
                {users.length > 0 && (
                  <span className="label-text-alt text-gray-500">
                    {filteredUsersForDropdown.length} of {users.length}
                  </span>
                )}
              </label>

              <div
                className={`dropdown dropdown-bottom relative overflow-visible ${showUserDropdown ? 'dropdown-open' : ''}`}
                style={{ width: 'max-content' }}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-outline justify-between text-left"
                  onClick={toggleUserDropdown}
                  style={{ width: 'max-content', minWidth: '16rem', maxWidth: '28rem' }}
                >
                  <span className="truncate">
                    {selectedUser ? (
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-6 h-6">
                            <span className="text-xs font-bold">{getAvatarText(selectedUser.name)}</span>
                          </div>
                        </div>
                        <span className="truncate">{selectedUser.name}</span>
                      </div>
                    ) : (
                      'Choose an employee...'
                    )}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box max-h-96 overflow-y-auto z-[999] mt-2"
                  style={{ minWidth: '16rem', maxWidth: '28rem' }}
                >
                  {/* In-dropdown quick filter */}
                  <div className="p-2 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter by name or role..."
                        value={userSearchTerm}
                        onChange={(e) => { setUserSearchTerm(e.target.value); setSearchTerm(e.target.value); }}
                        className="input input-bordered input-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Employees list (name + role only) */}
                  <div className="max-h-64 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center">
                        <span className="loading loading-spinner loading-sm"></span>
                        <p className="text-sm text-gray-500 mt-1">Loading employees...</p>
                      </div>
                    ) : filteredUsersForDropdown.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {userSearchTerm ? 'No employees match your search' : 'No employees found with current filters'}
                      </div>
                    ) : (
                      filteredUsersForDropdown.map((u) => (
                        <li key={u.id} className="border-b last:border-b-0">
                          <button
                            type="button"
                            className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer w-full text-left"
                            onClick={() => handleUserSelect(u)}
                          >
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                                <span className="text-xs font-bold">{getAvatarText(u.name)}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{u.name || 'Unknown User'}</div>
                            </div>
                            <span className={`badge badge-sm ${
                              (u.role || '').toLowerCase() === 'admin' ? 'badge-error'
                              : (u.role || '').toLowerCase() === 'manager' ? 'badge-warning'
                              : (u.role || '').toLowerCase() === 'supervisor' ? 'badge-info'
                              : 'badge-success'
                            }`}>
                              {u.role || 'employee'}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </div>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="form-control">
              <label className="label invisible"><span className="label-text">Actions</span></label>
              <div className="flex gap-2">
                {(selectedCompany || selectedDepartment || selectedUser || searchTerm) && (
                  <button onClick={clearFilters} className="btn btn-outline gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Clear
                  </button>
                )}
                <button onClick={fetchFilteredUsers} className="btn btn-primary gap-2" disabled={filterLoading}>
                  {filterLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  )}
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Guide (only rules actually used) */}
      {showPermissionGuide && (
        <div className="sticky top-4 z-40">
          <div className="card bg-base-100 shadow-lg border border-primary/20">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">Permission Guide</h3>
                    <p className="text-sm text-base-content/60">How permissions are determined</p>
                  </div>
                </div>
                <button onClick={() => setShowPermissionGuide(false)} className="btn btn-ghost btn-sm btn-circle">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold text-primary text-sm">Custom Permission</span>
                  </div>
                  <p className="text-xs text-base-content/70">
                    Explicit per-user override (source = <code>user</code>). Takes precedence over role defaults.
                  </p>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="font-semibold text-warning text-sm">Role-Based</span>
                  </div>
                  <p className="text-xs text-base-content/70">
                    Inherited from the user's role when no custom override exists (source = <code>role</code>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          {selectedUser ? (
            <div className="card bg-base-100 shadow-sm border">
              <div className="card-body p-6 bg-gradient-to-r from-base-100 to-base-200 border-b">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-xl w-14 h-14">
                        <span className="text-xl font-bold">{getAvatarText(selectedUser.name)}</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-base-content">{selectedUser.name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`badge ${
                          (selectedUser.role || '').toLowerCase() === 'admin' ? 'badge-error' :
                          (selectedUser.role || '').toLowerCase() === 'manager' ? 'badge-warning' :
                          (selectedUser.role || '').toLowerCase() === 'supervisor' ? 'badge-info' : 'badge-success'
                        }`}>
                          {selectedUser.role || 'employee'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="tabs tabs-boxed bg-base-200 p-1 rounded-lg">
                    <button
                      className={`tab tab-lg ${activeTab === 'modules' ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab('modules')}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Module Permissions
                    </button>
                    <button
                      className={`tab tab-lg ${activeTab === 'companies' ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab('companies')}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Company Permissions
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="stat p-4 bg-base-100 rounded-lg border text-center">
                    <div className="stat-value text-2xl text-base-content">
                      {activeTab === 'modules' ? totalAccessCount : companyAccessCount}
                    </div>
                    <div className="stat-desc text-base-content/60">
                      {activeTab === 'modules' ? 'Modules Accessed' : 'Companies Accessed'}
                    </div>
                  </div>
                  <div className="stat p-4 bg-base-100 rounded-lg border text-center">
                    <div className="stat-value text-2xl text-primary">
                      {activeTab === 'modules' ? customPermissionsCount : userCompanyPermissions.filter(c => c.permissions?.can_edit).length}
                    </div>
                    <div className="stat-desc text-base-content/60">
                      {activeTab === 'modules' ? 'Custom Permissions' : 'Edit Access'}
                    </div>
                  </div>
                  <div className="stat p-4 bg-base-100 rounded-lg border text-center">
                    <div className="stat-value text-2xl text-base-content">
                      {activeTab === 'modules' ? availableModules.length - totalAccessCount : userCompanyPermissions.filter(c => c.permissions?.can_manage_employees).length}
                    </div>
                    <div className="stat-desc text-base-content/60">
                      {activeTab === 'modules' ? 'Modules Restricted' : 'HR Managers'}
                    </div>
                  </div>
                  <div className="stat p-4 bg-base-100 rounded-lg border text-center">
                    <div className="stat-value text-2xl text-base-content">
                      {activeTab === 'modules' ? userPermissions.length : userCompanyPermissions.filter(c => c.permissions?.can_manage_permissions).length}
                    </div>
                    <div className="stat-desc text-base-content/60">
                      {activeTab === 'modules' ? 'Total Permissions' : 'Full Admins'}
                    </div>
                  </div>
                </div>
              </div>

              {activeTab === 'modules' ? (
                <>
                  <div className="p-4 border-b bg-base-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {['All', ...new Set(availableModules.map(m => m.category))].map(c => (
                          <button key={c} onClick={() => setActiveCategory(c)} className={`btn btn-sm ${activeCategory === c ? 'btn-primary' : 'btn-ghost'}`}>{c}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {loading ? (
                      <div className="text-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="mt-3 text-base-content/60">Loading permissions...</p>
                      </div>
                    ) : (
                      <>
                        {/* Module Permission Actions */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          <button
                            onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
                            className="btn btn-success btn-sm gap-2"
                            disabled={loading}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Grant All Modules
                          </button>
                          <button onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)} className="btn btn-error btn-sm gap-2" disabled={loading}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Revoke All Modules
                          </button>
                          <button onClick={revokeAllPermissions} className="btn btn-warning btn-sm gap-2" disabled={loading}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Reset to Role
                          </button>
                        </div>

                        {/* Modules List */}
                        <div className="space-y-6 max-h-[600px] overflow-y-auto">
                          {Object.entries(groupedModules).map(([category, modules]) => (
                            <div key={category}>
                              <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                {category}
                                <span className="text-sm text-base-content/40 font-normal">({modules.length} modules)</span>
                              </h3>

                              <div className="grid gap-3">
                                {modules.map(module => {
                                  const hasAccess = hasModuleAccess(module.name);
                                  const isCustom = getPermissionSource(module.name) === 'user';
                                  return (
                                    <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${hasAccess ? 'bg-success/10 border-success/20' : 'bg-base-200/50 border-base-300'} ${isCustom ? 'ring-1 ring-primary/20' : ''}`}>
                                      <div className="flex items-center gap-4 flex-1">
                                        <div className="text-2xl">{module.icon}</div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-base-content">{module.name}</h4>
                                            {isCustom && <span className="badge badge-primary badge-sm">Custom</span>}
                                          </div>
                                          <p className="text-sm text-base-content/60 mt-1">{module.description}</p>
                                        </div>
                                      </div>
                                      <input
                                        type="checkbox"
                                        className="toggle toggle-success toggle-lg"
                                        checked={hasAccess}
                                        onChange={(e) => toggleModuleAccess(module.name, e.target.checked)}
                                        disabled={loading}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border-b bg-base-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Company Permissions</span>
                        <div className="form-control">
                          <div className="relative">
                            <input
                              type="text"
                              className="input input-bordered input-sm w-64 pl-9"
                              placeholder="Search companies..."
                              value={companySearchTerm}
                              onChange={(e) => setCompanySearchTerm(e.target.value)}
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => bulkUpdateCompanyPermissions(true)} className="btn btn-success btn-sm gap-2" disabled={loading}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Grant All View
                        </button>
                        <button onClick={revokeAllCompanyPermissions} className="btn btn-error btn-sm gap-2" disabled={loading}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Revoke All
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {loading ? (
                      <div className="text-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="mt-3 text-base-content/60">Loading company permissions...</p>
                      </div>
                    ) : filteredCompanies.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-base-content/60">No companies found</p>
                      </div>
                    ) : (
                      <>
                        {/* Company Permissions Table */}
                        <div className="overflow-x-auto">
                          <table className="table table-zebra">
                            <thead>
                              <tr>
                                <th>Company</th>
                                <th>Status</th>
                                <th>View</th>
                                {/* <th>Edit</th> */}
                                {/* <th>Manage Employees</th>
                                <th>Manage Permissions</th> */}
                                <th>Access Level</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCompanies.map(company => {
                                const permissionLevel = getPermissionLevel(company);
                                const isOwnCompany = company.is_own_company || company.id === selectedUser.company_id;
                                return (
                                  <tr key={company.id}>
                                    <td>
                                      <div className="flex items-center gap-3">
                                        <div className="avatar">
                                          <div className="mask mask-squircle w-10 h-10 bg-primary text-primary-content flex items-center justify-center">
                                            <span className="font-bold">{company.name.charAt(0)}</span>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-bold">{company.name}</div>
                                          <div className="text-sm opacity-50">{company.email || 'No email'}</div>
                                          {isOwnCompany && (
                                            <span className="badge badge-sm badge-info mt-1">Own Company</span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`badge ${company.is_active ? 'badge-success' : 'badge-error'}`}>
                                        {company.is_active ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        className="toggle toggle-success"
                                        checked={company.permissions?.can_view || isOwnCompany}
                                        onChange={() => toggleCompanyPermission(company.id, 'can_view')}
                                        disabled={loading || isOwnCompany}
                                      />
                                    </td>
                                    {/* <td>
                                      <input
                                        type="checkbox"
                                        className="toggle toggle-warning"
                                        checked={company.permissions?.can_edit}
                                        onChange={() => toggleCompanyPermission(company.id, 'can_edit')}
                                        disabled={loading || !company.permissions?.can_view}
                                      />
                                    </td> */}
                                    {/* <td>
                                      <input
                                        type="checkbox"
                                        className="toggle toggle-info"
                                        checked={company.permissions?.can_manage_employees}
                                        onChange={() => toggleCompanyPermission(company.id, 'can_manage_employees')}
                                        disabled={loading || !company.permissions?.can_view}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        className="toggle toggle-secondary"
                                        checked={company.permissions?.can_manage_permissions}
                                        onChange={() => toggleCompanyPermission(company.id, 'can_manage_permissions')}
                                        disabled={loading || !company.permissions?.can_view}
                                      />
                                    </td> */}
                                    <td>
                                      <span className={`badge ${permissionLevel.color}`}>
                                        {permissionLevel.label}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Permission Legend */}
                        <div className="bg-base-200 p-4 rounded-lg mt-6">
                          <h4 className="font-semibold mb-2">Permission Levels:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-success rounded-full"></div>
                              <span className="text-sm">Viewer: Can view company data</span>
                            </div>
                            {/* <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-warning rounded-full"></div>
                              <span className="text-sm">Editor: Can edit company data</span>
                            </div> */}
                            {/* <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-info rounded-full"></div>
                              <span className="text-sm">HR Manager: Can manage employees</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-secondary rounded-full"></div>
                              <span className="text-sm">Full Admin: Can manage permissions</span>
                            </div> */}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="card bg-base-100 shadow-sm border h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">Select an Employee to Manage Permissions</h3>
                <p className="text-base-content/60 text-sm max-w-sm">Use the filters above to find and select an employee. Once selected, you can manage their module permissions and company access controls.</p>
                <button onClick={() => setShowPermissionGuide(true)} className="btn btn-primary btn-sm mt-4 gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Show Permission Guide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
