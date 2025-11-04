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

// //   // Available modules configuration
// //   const MODULES_CONFIG = [
// //     // Core Modules
// //     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core' },
// //     { name: 'Announcement', description: 'View company announcements', category: 'Core' },
// //     { name: 'Leave', description: 'Access leave management system', category: 'Core' },
// //     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core' },
    
// //     // Employee Management
// //     { name: 'Employee', description: 'Employee management system', category: 'Employee Management' },
// //     { name: 'Employee.View', description: 'View employee profiles', category: 'Employee Management' },
// //     { name: 'Employee.Create', description: 'Create new employees', category: 'Employee Management' },
// //     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management' },
    
// //     // Company Management
// //     { name: 'Company', description: 'Company management system', category: 'Company Management' },
// //     { name: 'Company.View', description: 'View companies', category: 'Company Management' },
// //     { name: 'Company.Create', description: 'Create new companies', category: 'Company Management' },
    
// //     // Payroll System
// //     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll' },
// //     { name: 'Payroll.Run', description: 'Run payroll processing', category: 'Payroll' },
// //     { name: 'Payroll.Setup', description: 'Payroll system setup', category: 'Payroll' },
// //     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll' },
// //     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll' },
    
// //     // Asset Management
// //     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets' },
// //     { name: 'AssetManagement.View', description: 'View all assets', category: 'Assets' },
// //     { name: 'AssetManagement.Create', description: 'Create new assets', category: 'Assets' },
// //     { name: 'AssetManagement.Approve', description: 'Approve asset requests', category: 'Assets' },
// //     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets' },
    
// //     // Claims Management
// //     { name: 'Claims', description: 'Claims management system', category: 'Claims' },
// //     { name: 'Claims.View', description: 'View claims', category: 'Claims' },
// //     { name: 'Claims.Manage', description: 'Manage all claims', category: 'Claims' },
    
// //     // Other Modules
// //     { name: 'Scheduler', description: 'Schedule management', category: 'Other' },
// //     { name: 'Feedback', description: 'Feedback system', category: 'Other' },
// //     { name: 'MasterData', description: 'Master data management', category: 'Other' },
// //     { name: 'Configuration', description: 'System configuration', category: 'Other' }
// //   ];

// //   useEffect(() => {
// //     fetchUsers();
// //     setAvailableModules(MODULES_CONFIG);
// //   }, []);

// //   useEffect(() => {
// //     if (selectedUser) {
// //       fetchUserPermissions(selectedUser.id);
// //     }
// //   }, [selectedUser]);

// //   const showMessage = (text, type = 'success') => {
// //     setMessage({ type, text });
// //     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
// //   };

// //   const fetchUsers = async () => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
// //       const response = await fetch(`${API_BASE_URL}/api/permissions/users`, {
// //         headers: { 
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       if (data.success) {
// //         setUsers(data.users);
// //       } else {
// //         throw new Error(data.message || 'Failed to fetch users');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching users:', error);
// //       showMessage('Failed to load users: ' + error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchUserPermissions = async (userId) => {
// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
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
// //       if (data.success) {
// //         setUserPermissions(data.permissions.modules || []);
// //       } else {
// //         throw new Error(data.message || 'Failed to fetch user permissions');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching user permissions:', error);
// //       showMessage('Failed to load user permissions: ' + error.message, 'error');
// //       setUserPermissions([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const updatePermission = async (moduleName, permissionType, value) => {
// //     if (!selectedUser) return;

// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
      
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
// //             [permissionType]: value
// //           }
// //         })
// //       });

// //       const data = await response.json();
// //       if (data.success) {
// //         showMessage(`Permission ${value ? 'granted' : 'revoked'} successfully`);
// //         // Refresh user permissions
// //         fetchUserPermissions(selectedUser.id);
// //       } else {
// //         throw new Error(data.message || 'Failed to update permission');
// //       }
// //     } catch (error) {
// //       console.error('Error updating permission:', error);
// //       showMessage('Failed to update permission: ' + error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const bulkUpdatePermissions = async (moduleName, permissions) => {
// //     if (!selectedUser) return;

// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
      
// //       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({
// //           userId: selectedUser.id,
// //           moduleName,
// //           permissions
// //         })
// //       });

// //       const data = await response.json();
// //       if (data.success) {
// //         showMessage('Permissions updated successfully');
// //         fetchUserPermissions(selectedUser.id);
// //       } else {
// //         throw new Error(data.message || 'Failed to update permissions');
// //       }
// //     } catch (error) {
// //       console.error('Error updating permissions:', error);
// //       showMessage('Failed to update permissions: ' + error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const revokeAllPermissions = async (userId) => {
// //     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem('hrms_token');
      
// //       // Revoke each permission individually
// //       const revokePromises = userPermissions
// //         .filter(perm => perm.source === 'user')
// //         .map(perm => 
// //           fetch(`${API_BASE_URL}/api/permissions/revoke`, {
// //             method: 'POST',
// //             headers: {
// //               'Authorization': `Bearer ${token}`,
// //               'Content-Type': 'application/json'
// //             },
// //             body: JSON.stringify({
// //               userId: selectedUser.id,
// //               moduleName: perm.name
// //             })
// //           })
// //         );

// //       await Promise.all(revokePromises);
// //       showMessage('All custom permissions revoked successfully');
// //       fetchUserPermissions(selectedUser.id);
// //     } catch (error) {
// //       console.error('Error revoking permissions:', error);
// //       showMessage('Failed to revoke permissions: ' + error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getPermissionValue = (moduleName, permissionType) => {
// //     const userPerm = userPermissions.find(p => p.name === moduleName);
// //     return userPerm ? userPerm[permissionType] : false;
// //   };

// //   const getPermissionSource = (moduleName) => {
// //     const userPerm = userPermissions.find(p => p.name === moduleName);
// //     return userPerm ? userPerm.source : 'role';
// //   };

// //   const filteredUsers = users.filter(user =>
// //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     user.role.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   // Group modules by category
// //   const groupedModules = availableModules.reduce((groups, module) => {
// //     const category = module.category;
// //     if (!groups[category]) {
// //       groups[category] = [];
// //     }
// //     groups[category].push(module);
// //     return groups;
// //   }, {});

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto">
// //       {/* Header */}
// //       <div className="mb-8">
// //         <h1 className="text-3xl font-bold text-gray-900 mb-2">User Permissions</h1>
// //         <p className="text-gray-600">
// //           Manage individual user permissions. User-specific permissions override role defaults.
// //         </p>
// //       </div>

// //       {/* Message Alert */}
// //       {message.text && (
// //         <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mb-6`}>
// //           <span>{message.text}</span>
// //         </div>
// //       )}

// //       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
// //         {/* User List Panel */}
// //         <div className="xl:col-span-1">
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //             <div className="p-4 border-b border-gray-200">
// //               <h2 className="text-lg font-semibold text-gray-800">Users</h2>
              
// //               {/* Search */}
// //               <div className="mt-3">
// //                 <input
// //                   type="text"
// //                   placeholder="Search users..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="input input-bordered input-sm w-full"
// //                 />
// //               </div>
// //             </div>

// //             <div className="max-h-96 overflow-y-auto">
// //               {loading && !users.length ? (
// //                 <div className="p-8 text-center">
// //                   <span className="loading loading-spinner loading-lg"></span>
// //                   <p className="mt-2 text-gray-500">Loading users...</p>
// //                 </div>
// //               ) : filteredUsers.length === 0 ? (
// //                 <div className="p-8 text-center text-gray-500">
// //                   No users found
// //                 </div>
// //               ) : (
// //                 <div className="divide-y divide-gray-100">
// //                   {filteredUsers.map(user => (
// //                     <div
// //                       key={user.id}
// //                       className={`p-4 cursor-pointer transition-colors ${
// //                         selectedUser?.id === user.id 
// //                           ? 'bg-blue-50 border-r-4 border-blue-500' 
// //                           : 'hover:bg-gray-50'
// //                       }`}
// //                       onClick={() => setSelectedUser(user)}
// //                     >
// //                       <div className="flex items-start justify-between">
// //                         <div className="flex-1 min-w-0">
// //                           <div className="flex items-center gap-2 mb-1">
// //                             <h3 className="font-medium text-gray-900 truncate">
// //                               {user.name}
// //                             </h3>
// //                             <span className={`badge badge-sm ${
// //                               user.role === 'admin' ? 'badge-error' :
// //                               user.role === 'manager' ? 'badge-warning' :
// //                               user.role === 'supervisor' ? 'badge-info' : 'badge-success'
// //                             }`}>
// //                               {user.role}
// //                             </span>
// //                           </div>
// //                           <p className="text-sm text-gray-600 truncate mb-1">
// //                             {user.email}
// //                           </p>
// //                           {user.module_names && (
// //                             <p className="text-xs text-gray-500">
// //                               Custom permissions: {user.module_names.split(',').filter(Boolean).length}
// //                             </p>
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
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //               {/* User Header */}
// //               <div className="p-6 border-b border-gray-200">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <h2 className="text-xl font-semibold text-gray-800">
// //                       Permissions for {selectedUser.name}
// //                     </h2>
// //                     <div className="flex items-center gap-4 mt-1">
// //                       <span className="text-gray-600">{selectedUser.email}</span>
// //                       <span className={`badge ${
// //                         selectedUser.role === 'admin' ? 'badge-error' :
// //                         selectedUser.role === 'manager' ? 'badge-warning' :
// //                         selectedUser.role === 'supervisor' ? 'badge-info' : 'badge-success'
// //                       }`}>
// //                         {selectedUser.role}
// //                       </span>
// //                     </div>
// //                   </div>
                  
// //                   <div className="flex gap-2">
// //                     <button
// //                       onClick={() => revokeAllPermissions(selectedUser.id)}
// //                       className="btn btn-outline btn-error btn-sm"
// //                       disabled={loading}
// //                     >
// //                       Revoke All Custom
// //                     </button>
// //                     <button
// //                       onClick={() => fetchUserPermissions(selectedUser.id)}
// //                       className="btn btn-outline btn-sm"
// //                       disabled={loading}
// //                     >
// //                       Refresh
// //                     </button>
// //                   </div>
// //                 </div>
                
// //                 <div className="mt-4 p-3 bg-blue-50 rounded-lg">
// //                   <div className="flex items-center gap-2 text-sm text-blue-800">
// //                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
// //                     </svg>
// //                     <span>
// //                       <strong>User-specific permissions</strong> override role defaults. 
// //                       Gray checkboxes show role defaults, blue show custom permissions.
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Permissions Grid */}
// //               <div className="p-6">
// //                 {loading ? (
// //                   <div className="text-center py-12">
// //                     <span className="loading loading-spinner loading-lg"></span>
// //                     <p className="mt-2 text-gray-500">Loading permissions...</p>
// //                   </div>
// //                 ) : (
// //                   <div className="space-y-8 max-h-96 overflow-y-auto">
// //                     {Object.entries(groupedModules).map(([category, modules]) => (
// //                       <div key={category}>
// //                         <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
// //                           {category}
// //                         </h3>
                        
// //                         <div className="grid gap-4">
// //                           {modules.map(module => {
// //                             const source = getPermissionSource(module.name);
// //                             const isCustom = source === 'user';
                            
// //                             return (
// //                               <div key={module.name} className="border rounded-lg p-4">
// //                                 <div className="flex items-start justify-between mb-3">
// //                                   <div>
// //                                     <h4 className="font-medium text-gray-900">
// //                                       {module.name}
// //                                       {isCustom && (
// //                                         <span className="badge badge-sm badge-info ml-2">Custom</span>
// //                                       )}
// //                                     </h4>
// //                                     <p className="text-sm text-gray-600 mt-1">
// //                                       {module.description}
// //                                     </p>
// //                                   </div>
// //                                 </div>

// //                                 {/* Quick Actions */}
// //                                 <div className="flex gap-2 mb-3">
// //                                   <button
// //                                     onClick={() => bulkUpdatePermissions(module.name, {
// //                                       can_view: true,
// //                                       can_create: true,
// //                                       can_edit: true,
// //                                       can_delete: true,
// //                                       can_approve: true
// //                                     })}
// //                                     className="btn btn-xs btn-outline btn-success"
// //                                     disabled={loading}
// //                                   >
// //                                     Grant All
// //                                   </button>
// //                                   <button
// //                                     onClick={() => bulkUpdatePermissions(module.name, {
// //                                       can_view: false,
// //                                       can_create: false,
// //                                       can_edit: false,
// //                                       can_delete: false,
// //                                       can_approve: false
// //                                     })}
// //                                     className="btn btn-xs btn-outline btn-error"
// //                                     disabled={loading}
// //                                   >
// //                                     Revoke All
// //                                   </button>
// //                                 </div>

// //                                 {/* Permission Toggles */}
// //                                 <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
// //                                   {['view', 'create', 'edit', 'delete', 'approve'].map(action => {
// //                                     const permissionType = `can_${action}`;
// //                                     const isChecked = getPermissionValue(module.name, permissionType);
                                    
// //                                     return (
// //                                       <label key={action} className="flex items-center gap-2 cursor-pointer">
// //                                         <input
// //                                           type="checkbox"
// //                                           checked={isChecked}
// //                                           onChange={(e) => updatePermission(module.name, permissionType, e.target.checked)}
// //                                           disabled={loading}
// //                                           className={`checkbox checkbox-sm ${
// //                                             isCustom ? 'checkbox-primary' : 'checkbox-gray-300'
// //                                           }`}
// //                                         />
// //                                         <div className="flex flex-col">
// //                                           <span className="text-sm font-medium capitalize">
// //                                             {action}
// //                                           </span>
// //                                           {isCustom && (
// //                                             <span className="text-xs text-blue-600">Custom</span>
// //                                           )}
// //                                         </div>
// //                                       </label>
// //                                     );
// //                                   })}
// //                                 </div>
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
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
// //               <div className="text-center text-gray-500">
// //                 <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
// //                 </svg>
// //                 <h3 className="text-lg font-medium mb-2">Select a User</h3>
// //                 <p>Choose a user from the list to manage their permissions</p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Legend */}
// //       <div className="mt-8 p-4 bg-gray-50 rounded-lg">
// //         <h4 className="font-medium text-gray-800 mb-2">Permission Legend</h4>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
// //           <div className="flex items-center gap-2">
// //             <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
// //             <span>Role Default - Inherited from user's role</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 rounded"></div>
// //             <span>Custom Permission - Specifically granted to this user</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="badge badge-info badge-sm">Custom</div>
// //             <span>User has custom permissions for this module</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // frontend/components/admin/PermissionManager.js
// "use client";

// import { useState, useEffect } from 'react';
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

//   // Simplified modules configuration - just access control
//   const MODULES_CONFIG = [
//     // Core Modules
//     { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
//     { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
//     { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
//     { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
    
//     // Employee Management
//     { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
//     { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
    
//     // Company Management
//     { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
    
//     // Payroll System
//     { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
//     { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
//     { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
    
//     // Asset Management
//     { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
//     { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
    
//     // Claims Management
//     { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
    
//     // Other Modules
//     { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
//     { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
//     { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
//     { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
//   ];

//   useEffect(() => {
//     fetchUsers();
//     setAvailableModules(MODULES_CONFIG);
//   }, []);

//   useEffect(() => {
//     if (selectedUser) {
//       fetchUserPermissions(selectedUser.id);
//     }
//   }, [selectedUser]);

//   const showMessage = (text, type = 'success') => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//   };

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       const response = await fetch(`${API_BASE_URL}/api/permissions/users`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         setUsers(data.users);
//       } else {
//         throw new Error(data.message || 'Failed to fetch users');
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       showMessage('Failed to load users: ' + error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserPermissions = async (userId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
//       const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         setUserPermissions(data.permissions?.modules || []);
//       } else {
//         throw new Error(data.message || 'Failed to fetch user permissions');
//       }
//     } catch (error) {
//       console.error('Error fetching user permissions:', error);
//       showMessage('Failed to load user permissions: ' + error.message, 'error');
//       setUserPermissions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleModuleAccess = async (moduleName, hasAccess) => {
//     if (!selectedUser) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
      
//       const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
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
      
//       if (data.success) {
//         showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
        
//         // Update local state immediately for better UX
//         setUserPermissions(prev => {
//           const existingIndex = prev.findIndex(p => p.name === moduleName);
//           if (existingIndex >= 0) {
//             const updated = [...prev];
//             updated[existingIndex] = {
//               ...updated[existingIndex],
//               can_view: hasAccess,
//               can_create: hasAccess,
//               can_edit: hasAccess,
//               can_delete: hasAccess,
//               can_approve: hasAccess,
//               source: 'user'
//             };
//             return updated;
//           } else {
//             return [...prev, {
//               name: moduleName,
//               can_view: hasAccess,
//               can_create: hasAccess,
//               can_edit: hasAccess,
//               can_delete: hasAccess,
//               can_approve: hasAccess,
//               source: 'user'
//             }];
//           }
//         });
        
//       } else {
//         throw new Error(data.message || 'Failed to update permission');
//       }
//     } catch (error) {
//       console.error('Error updating permission:', error);
//       showMessage('Failed to update permission: ' + error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const bulkUpdatePermissions = async (modules, hasAccess) => {
//     if (!selectedUser) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
      
//       const updatePromises = modules.map(moduleName =>
//         fetch(`${API_BASE_URL}/api/permissions/grant`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             userId: selectedUser.id,
//             moduleName,
//             permissions: {
//               can_view: hasAccess,
//               can_create: hasAccess,
//               can_edit: hasAccess,
//               can_delete: hasAccess,
//               can_approve: hasAccess
//             }
//           })
//         })
//       );

//       await Promise.all(updatePromises);
//       showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
      
//       setUserPermissions(prev => {
//         const updated = [...prev];
//         modules.forEach(moduleName => {
//           const existingIndex = updated.findIndex(p => p.name === moduleName);
//           if (existingIndex >= 0) {
//             updated[existingIndex] = {
//               ...updated[existingIndex],
//               can_view: hasAccess,
//               can_create: hasAccess,
//               can_edit: hasAccess,
//               can_delete: hasAccess,
//               can_approve: hasAccess,
//               source: 'user'
//             };
//           } else {
//             updated.push({
//               name: moduleName,
//               can_view: hasAccess,
//               can_create: hasAccess,
//               can_edit: hasAccess,
//               can_delete: hasAccess,
//               can_approve: hasAccess,
//               source: 'user'
//             });
//           }
//         });
//         return updated;
//       });
      
//     } catch (error) {
//       console.error('Error bulk updating permissions:', error);
//       showMessage('Failed to update permissions: ' + error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const revokeAllPermissions = async () => {
//     if (!selectedUser) return;
    
//     if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('hrms_token');
      
//       const revokePromises = userPermissions
//         .filter(perm => perm.source === 'user')
//         .map(perm => 
//           fetch(`${API_BASE_URL}/api/permissions/revoke`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               userId: selectedUser.id,
//               moduleName: perm.name
//             })
//           })
//         );

//       await Promise.all(revokePromises);
//       showMessage('All custom permissions revoked successfully');
//       setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
      
//     } catch (error) {
//       console.error('Error revoking permissions:', error);
//       showMessage('Failed to revoke permissions: ' + error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasModuleAccess = (moduleName) => {
//     const userPerm = userPermissions.find(p => p.name === moduleName);
//     if (userPerm) {
//       if (userPerm.can_access !== undefined) {
//         return Boolean(userPerm.can_access);
//       }
//       const hasAnyPermission = userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve;
//       return Boolean(hasAnyPermission);
//     }
//     return false;
//   };

//   const getPermissionSource = (moduleName) => {
//     const userPerm = userPermissions.find(p => p.name === moduleName);
//     return userPerm ? (userPerm.source || 'role') : 'role';
//   };

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Get unique categories for filter
//   const categories = ['All', ...new Set(availableModules.map(module => module.category))];
  
//   // Filter modules by active category
//   const filteredModules = activeCategory === 'All' 
//     ? availableModules 
//     : availableModules.filter(module => module.category === activeCategory);

//   // Group filtered modules by category
//   const groupedModules = filteredModules.reduce((groups, module) => {
//     const category = module.category;
//     if (!groups[category]) {
//       groups[category] = [];
//     }
//     groups[category].push(module);
//     return groups;
//   }, {});

//   // Stats for selected user
//   const customPermissionsCount = userPermissions.filter(perm => perm.source === 'user').length;
//   const totalAccessCount = userPermissions.filter(perm => hasModuleAccess(perm.name)).length;

//   return (
//     <div className="min-h-screen bg-gray-50/30 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">User Permissions Management</h1>
//             <p className="text-gray-600 text-sm">
//               Manage individual user permissions and access controls across the system
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="text-right">
//               <div className="text-sm text-gray-500">Total Users</div>
//               <div className="text-lg font-semibold text-gray-900">{users.length}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Message Alert */}
//       {message.text && (
//         <div className={`mb-6 transition-all duration-300 ${
//           message.type === 'error' 
//             ? 'bg-red-50 border border-red-200 text-red-700' 
//             : 'bg-green-50 border border-green-200 text-green-700'
//         } px-4 py-3 rounded-lg flex items-center gap-3`}>
//           <div className={`w-2 h-2 rounded-full ${
//             message.type === 'error' ? 'bg-red-500' : 'bg-green-500'
//           }`}></div>
//           <span className="text-sm font-medium">{message.text}</span>
//         </div>
//       )}

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//         {/* User List Panel */}
//         <div className="xl:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-5 border-b border-gray-100">
//               <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//                 </svg>
//                 Users
//               </h2>
              
//               {/* Search */}
//               <div className="mt-4">
//                 <div className="relative">
//                   <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="Search users..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="max-h-[500px] overflow-y-auto">
//               {loading && !users.length ? (
//                 <div className="p-8 text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-3 text-sm text-gray-500">Loading users...</p>
//                 </div>
//               ) : filteredUsers.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <p className="text-gray-500 text-sm">No users found</p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-100">
//                   {filteredUsers.map(user => (
//                     <div
//                       key={user.id}
//                       className={`p-4 cursor-pointer transition-all duration-200 ${
//                         selectedUser?.id === user.id 
//                           ? 'bg-blue-50 border-r-2 border-blue-500' 
//                           : 'hover:bg-gray-50'
//                       }`}
//                       onClick={() => setSelectedUser(user)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2">
//                             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                               {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <h3 className="font-medium text-gray-900 truncate text-sm">
//                                 {user.name}
//                               </h3>
//                               <p className="text-xs text-gray-500 truncate">
//                                 {user.email}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                               user.role === 'admin' ? 'bg-red-100 text-red-800' :
//                               user.role === 'manager' ? 'bg-orange-100 text-orange-800' :
//                               user.role === 'supervisor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                             }`}>
//                               {user.role}
//                             </span>
//                             {user.module_names && (
//                               <span className="text-xs text-gray-400">
//                                 {user.module_names.split(',').filter(Boolean).length} custom
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Permission Management Panel */}
//         <div className="xl:col-span-3">
//           {selectedUser ? (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               {/* User Header */}
//               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
//                       {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold text-gray-900">
//                         {selectedUser.name}
//                       </h2>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-gray-600 text-sm">{selectedUser.email}</span>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' :
//                           selectedUser.role === 'manager' ? 'bg-orange-100 text-orange-800' :
//                           selectedUser.role === 'supervisor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                         }`}>
//                           {selectedUser.role}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
//                       className="btn btn-success btn-sm gap-2"
//                       disabled={loading}
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                       Grant All
//                     </button>
//                     <button
//                       onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)}
//                       className="btn btn-error btn-sm gap-2"
//                       disabled={loading}
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                       Revoke All
//                     </button>
//                     <button
//                       onClick={revokeAllPermissions}
//                       className="btn btn-warning btn-sm gap-2"
//                       disabled={loading}
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                       </svg>
//                       Reset to Role
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Stats */}
//                 <div className="grid grid-cols-3 gap-4 mt-6">
//                   <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
//                     <div className="text-2xl font-bold text-gray-900">{totalAccessCount}</div>
//                     <div className="text-xs text-gray-500">Modules Accessed</div>
//                   </div>
//                   <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
//                     <div className="text-2xl font-bold text-blue-600">{customPermissionsCount}</div>
//                     <div className="text-xs text-gray-500">Custom Permissions</div>
//                   </div>
//                   <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
//                     <div className="text-2xl font-bold text-gray-900">{availableModules.length - totalAccessCount}</div>
//                     <div className="text-xs text-gray-500">Modules Restricted</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Category Filter */}
//               <div className="p-4 border-b border-gray-100 bg-gray-50/50">
//                 <div className="flex items-center gap-2 overflow-x-auto">
//                   {categories.map(category => (
//                     <button
//                       key={category}
//                       onClick={() => setActiveCategory(category)}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
//                         activeCategory === category
//                           ? 'bg-blue-500 text-white shadow-sm'
//                           : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
//                       }`}
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Permissions Grid */}
//               <div className="p-6">
//                 {loading ? (
//                   <div className="text-center py-12">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="mt-3 text-sm text-gray-500">Loading permissions...</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6 max-h-[500px] overflow-y-auto">
//                     {Object.entries(groupedModules).map(([category, modules]) => (
//                       <div key={category}>
//                         <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
//                           {category}
//                           <span className="text-sm text-gray-400 font-normal ml-2">
//                             ({modules.length} modules)
//                           </span>
//                         </h3>
                        
//                         <div className="grid gap-3">
//                           {modules.map(module => {
//                             const hasAccess = hasModuleAccess(module.name);
//                             const source = getPermissionSource(module.name);
//                             const isCustom = source === 'user';
                            
//                             return (
//                               <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
//                                 hasAccess 
//                                   ? 'bg-green-50 border-green-200' 
//                                   : 'bg-gray-50/50 border-gray-200'
//                               } ${isCustom ? 'ring-1 ring-blue-200' : ''}`}>
//                                 <div className="flex items-center gap-4 flex-1">
//                                   <div className="text-2xl">{module.icon}</div>
//                                   <div className="flex-1">
//                                     <div className="flex items-center gap-2">
//                                       <h4 className="font-semibold text-gray-900">
//                                         {module.name}
//                                       </h4>
//                                       {isCustom && (
//                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                           Custom
//                                         </span>
//                                       )}
//                                     </div>
//                                     <p className="text-sm text-gray-600 mt-1">
//                                       {module.description}
//                                     </p>
//                                   </div>
//                                 </div>
                                
//                                 <label className="relative inline-flex items-center cursor-pointer">
//                                   <input
//                                     type="checkbox"
//                                     checked={hasAccess}
//                                     onChange={(e) => toggleModuleAccess(module.name, e.target.checked)}
//                                     disabled={loading}
//                                     className="sr-only peer"
//                                   />
//                                   <div className={`w-11 h-6 rounded-full transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-blue-300 ${
//                                     hasAccess 
//                                       ? 'bg-green-500 peer-checked:bg-green-500' 
//                                       : 'bg-gray-300'
//                                   }`}></div>
//                                   <div className={`absolute left-0.5 top-0.5 bg-white border rounded-full transition-transform duration-200 ${
//                                     hasAccess 
//                                       ? 'transform translate-x-5 border-green-500' 
//                                       : 'transform translate-x-0 border-gray-400'
//                                   } w-5 h-5`}></div>
//                                 </label>
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
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a User</h3>
//                 <p className="text-gray-500 text-sm max-w-sm">
//                   Choose a user from the list to view and manage their system permissions and access controls.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
//         <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           Permission Guide
//         </h4>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//             <div>
//               <div className="font-medium text-gray-900">Module Access Granted</div>
//               <div className="text-gray-500 text-xs">User has access to this module</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//             <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//             <div>
//               <div className="font-medium text-gray-900">Module Access Restricted</div>
//               <div className="text-gray-500 text-xs">User cannot access this module</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
//             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//             <div>
//               <div className="font-medium text-gray-900">Custom Permission</div>
//               <div className="text-gray-500 text-xs">Overrides role-based permissions</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// frontend/components/admin/PermissionManager.js
"use client";

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function PermissionManager() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const MODULES_CONFIG = [
    // Core Modules
    { name: 'Dashboard', description: 'Access main dashboard', category: 'Core', icon: '📊' },
    { name: 'Announcement', description: 'View company announcements', category: 'Core', icon: '📢' },
    { name: 'Leave', description: 'Access leave management system', category: 'Core', icon: '🏖️' },
    { name: 'Attendance', description: 'Access attendance tracking', category: 'Core', icon: '⏰' },
    
    // Employee Management
    { name: 'Employee', description: 'Employee management system', category: 'Employee Management', icon: '👥' },
    { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management', icon: '⚖️' },
    
    // Company Management
    { name: 'Company', description: 'Company management system', category: 'Company Management', icon: '🏢' },
    
    // Payroll System
    { name: 'Payroll', description: 'Payroll management system', category: 'Payroll', icon: '💰' },
    { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll', icon: '💸' },
    { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll', icon: '📉' },
    
    // Asset Management
    { name: 'AssetManagement', description: 'Asset management system', category: 'Assets', icon: '💼' },
    { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets', icon: '🎒' },
    
    // Claims Management
    { name: 'Claims', description: 'Claims management system', category: 'Claims', icon: '🧾' },
    
    // Other Modules
    { name: 'Scheduler', description: 'Schedule management', category: 'Other', icon: '📅' },
    { name: 'Feedback', description: 'Feedback system', category: 'Other', icon: '💬' },
    { name: 'MasterData', description: 'Master data management', category: 'Other', icon: '🗃️' },
    { name: 'Configuration', description: 'System configuration', category: 'Other', icon: '⚙️' }
  ];

  useEffect(() => {
    fetchUsers();
    setAvailableModules(MODULES_CONFIG);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserPermissions(selectedUser.id);
    }
  }, [selectedUser]);

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/permissions/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('Failed to load users: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPermissions = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/permissions/user/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setUserPermissions(data.permissions?.modules || []);
      } else {
        throw new Error(data.message || 'Failed to fetch user permissions');
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      showMessage('Failed to load user permissions: ' + error.message, 'error');
      setUserPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleModuleAccess = async (moduleName, hasAccess) => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      const response = await fetch(`${API_BASE_URL}/api/permissions/grant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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
      
      if (data.success) {
        showMessage(`Module access ${hasAccess ? 'granted' : 'revoked'} successfully`);
        
        setUserPermissions(prev => {
          const existingIndex = prev.findIndex(p => p.name === moduleName);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              can_view: hasAccess,
              can_create: hasAccess,
              can_edit: hasAccess,
              can_delete: hasAccess,
              can_approve: hasAccess,
              source: 'user'
            };
            return updated;
          } else {
            return [...prev, {
              name: moduleName,
              can_view: hasAccess,
              can_create: hasAccess,
              can_edit: hasAccess,
              can_delete: hasAccess,
              can_approve: hasAccess,
              source: 'user'
            }];
          }
        });
      } else {
        throw new Error(data.message || 'Failed to update permission');
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      showMessage('Failed to update permission: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdatePermissions = async (modules, hasAccess) => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      const updatePromises = modules.map(moduleName =>
        fetch(`${API_BASE_URL}/api/permissions/grant`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
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
        })
      );

      await Promise.all(updatePromises);
      showMessage(`All modules ${hasAccess ? 'granted' : 'revoked'} successfully`);
      
      setUserPermissions(prev => {
        const updated = [...prev];
        modules.forEach(moduleName => {
          const existingIndex = updated.findIndex(p => p.name === moduleName);
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              can_view: hasAccess,
              can_create: hasAccess,
              can_edit: hasAccess,
              can_delete: hasAccess,
              can_approve: hasAccess,
              source: 'user'
            };
          } else {
            updated.push({
              name: moduleName,
              can_view: hasAccess,
              can_create: hasAccess,
              can_edit: hasAccess,
              can_delete: hasAccess,
              can_approve: hasAccess,
              source: 'user'
            });
          }
        });
        return updated;
      });
    } catch (error) {
      console.error('Error bulk updating permissions:', error);
      showMessage('Failed to update permissions: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const revokeAllPermissions = async () => {
    if (!selectedUser) return;
    
    if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      const revokePromises = userPermissions
        .filter(perm => perm.source === 'user')
        .map(perm => 
          fetch(`${API_BASE_URL}/api/permissions/revoke`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: selectedUser.id,
              moduleName: perm.name
            })
          })
        );

      await Promise.all(revokePromises);
      showMessage('All custom permissions revoked successfully');
      setUserPermissions(prev => prev.filter(perm => perm.source !== 'user'));
    } catch (error) {
      console.error('Error revoking permissions:', error);
      showMessage('Failed to revoke permissions: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const hasModuleAccess = (moduleName) => {
    const userPerm = userPermissions.find(p => p.name === moduleName);
    if (userPerm) {
      if (userPerm.can_access !== undefined) return Boolean(userPerm.can_access);
      const hasAnyPermission = userPerm.can_view || userPerm.can_create || userPerm.can_edit || userPerm.can_delete || userPerm.can_approve;
      return Boolean(hasAnyPermission);
    }
    return false;
  };

  const getPermissionSource = (moduleName) => {
    const userPerm = userPermissions.find(p => p.name === moduleName);
    return userPerm ? (userPerm.source || 'role') : 'role';
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['All', ...new Set(availableModules.map(module => module.category))];
  const filteredModules = activeCategory === 'All' 
    ? availableModules 
    : availableModules.filter(module => module.category === activeCategory);

  const groupedModules = filteredModules.reduce((groups, module) => {
    const category = module.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(module);
    return groups;
  }, {});

  const customPermissionsCount = userPermissions.filter(perm => perm.source === 'user').length;
  const totalAccessCount = userPermissions.filter(perm => hasModuleAccess(perm.name)).length;

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
          <div>
            {message.type === 'error' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* User List Panel */}
        <div className="xl:col-span-1">
          <div className="card bg-base-100 shadow-sm border">
            <div className="card-body p-4">
              <h2 className="card-title text-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Users
              </h2>
              
              {/* Search */}
              <div className="form-control mt-4">
                <div className="input-group input-group-sm">
                  <span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered input-sm flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && !users.length ? (
                <div className="p-8 text-center">
                  <span className="loading loading-spinner loading-md"></span>
                  <p className="mt-3 text-sm text-base-content/60">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-base-content/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-base-content/60 text-sm">No users found</p>
                </div>
              ) : (
                <div className="divide-y divide-base-200">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        selectedUser?.id === user.id 
                          ? 'bg-primary/10 border-r-2 border-primary' 
                          : 'hover:bg-base-200'
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                                <span className="text-sm font-bold">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base-content truncate text-sm">
                                {user.name}
                              </h3>
                              <p className="text-xs text-base-content/60 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`badge badge-sm ${
                              user.role === 'admin' ? 'badge-error' :
                              user.role === 'manager' ? 'badge-warning' :
                              user.role === 'supervisor' ? 'badge-info' : 'badge-success'
                            }`}>
                              {user.role}
                            </span>
                            {user.module_names && (
                              <span className="text-xs text-base-content/40">
                                {user.module_names.split(',').filter(Boolean).length} custom
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permission Management Panel */}
        <div className="xl:col-span-3">
          {selectedUser ? (
            <div className="card bg-base-100 shadow-sm border">
              {/* User Header */}
              <div className="card-body p-6 bg-gradient-to-r from-base-100 to-base-200 border-b">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-xl w-14 h-14">
                        <span className="text-xl font-bold">
                          {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-base-content">
                        {selectedUser.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-base-content/60 text-sm">{selectedUser.email}</span>
                        <span className={`badge ${
                          selectedUser.role === 'admin' ? 'badge-error' :
                          selectedUser.role === 'manager' ? 'badge-warning' :
                          selectedUser.role === 'supervisor' ? 'badge-info' : 'badge-success'
                        }`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), true)}
                      className="btn btn-success btn-sm gap-2"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Grant All
                    </button>
                    <button
                      onClick={() => bulkUpdatePermissions(availableModules.map(m => m.name), false)}
                      className="btn btn-error btn-sm gap-2"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Revoke All
                    </button>
                    <button
                      onClick={revokeAllPermissions}
                      className="btn btn-warning btn-sm gap-2"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset to Role
                    </button>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="stat p-4 bg-base-100 rounded-lg border text-center">
                    <div className="stat-value text-2xl text-base-content">{totalAccessCount}</div>
                    <div className="stat-desc text-base-content/60">Modules Accessed</div>
                  </div>
                  <div className="stat p-4 bg-base-100 rounded-lg border text-center">
                    <div className="stat-value text-2xl text-primary">{customPermissionsCount}</div>
                    <div className="stat-desc text-base-content/60">Custom Permissions</div>
                  </div>
                  <div className="stat p-4 bg-base-100 rounded-lg border text-center">
                    <div className="stat-value text-2xl text-base-content">{availableModules.length - totalAccessCount}</div>
                    <div className="stat-desc text-base-content/60">Modules Restricted</div>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="p-4 border-b bg-base-200/50">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`btn btn-sm ${activeCategory === category ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-3 text-base-content/60">Loading permissions...</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[500px] overflow-y-auto">
                    {Object.entries(groupedModules).map(([category, modules]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {category}
                          <span className="text-sm text-base-content/40 font-normal">
                            ({modules.length} modules)
                          </span>
                        </h3>
                        
                        <div className="grid gap-3">
                          {modules.map(module => {
                            const hasAccess = hasModuleAccess(module.name);
                            const source = getPermissionSource(module.name);
                            const isCustom = source === 'user';
                            
                            return (
                              <div key={module.name} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                hasAccess 
                                  ? 'bg-success/10 border-success/20' 
                                  : 'bg-base-200/50 border-base-300'
                              } ${isCustom ? 'ring-1 ring-primary/20' : ''}`}>
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="text-2xl">{module.icon}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-base-content">
                                        {module.name}
                                      </h4>
                                      {isCustom && (
                                        <span className="badge badge-primary badge-sm">Custom</span>
                                      )}
                                    </div>
                                    <p className="text-sm text-base-content/60 mt-1">
                                      {module.description}
                                    </p>
                                  </div>
                                </div>
                                
                                <input
                                  type="checkbox"
                                  className="toggle toggle-success"
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
                )}
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-sm border h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">Select a User</h3>
                <p className="text-base-content/60 text-sm max-w-sm">
                  Choose a user from the list to view and manage their system permissions and access controls.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h4 className="font-semibold text-base-content flex items-center gap-2">
            <svg className="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Permission Guide
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div>
                <div className="font-semibold text-base-content">Module Access Granted</div>
                <div className="text-base-content/60 text-xs">User has access to this module</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="w-3 h-3 bg-base-content/40 rounded-full"></div>
              <div>
                <div className="font-semibold text-base-content">Module Access Restricted</div>
                <div className="text-base-content/60 text-xs">User cannot access this module</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div>
                <div className="font-semibold text-base-content">Custom Permission</div>
                <div className="text-base-content/60 text-xs">Overrides role-based permissions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
