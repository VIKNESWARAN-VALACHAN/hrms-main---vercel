
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

  // Available modules configuration
  const MODULES_CONFIG = [
    // Core Modules
    { name: 'Dashboard', description: 'Access main dashboard', category: 'Core' },
    { name: 'Announcement', description: 'View company announcements', category: 'Core' },
    { name: 'Leave', description: 'Access leave management system', category: 'Core' },
    { name: 'Attendance', description: 'Access attendance tracking', category: 'Core' },
    
    // Employee Management
    { name: 'Employee', description: 'Employee management system', category: 'Employee Management' },
    { name: 'Employee.View', description: 'View employee profiles', category: 'Employee Management' },
    { name: 'Employee.Create', description: 'Create new employees', category: 'Employee Management' },
    { name: 'Employee.Disciplinary', description: 'Manage disciplinary types', category: 'Employee Management' },
    
    // Company Management
    { name: 'Company', description: 'Company management system', category: 'Company Management' },
    { name: 'Company.View', description: 'View companies', category: 'Company Management' },
    { name: 'Company.Create', description: 'Create new companies', category: 'Company Management' },
    
    // Payroll System
    { name: 'Payroll', description: 'Payroll management system', category: 'Payroll' },
    { name: 'Payroll.Run', description: 'Run payroll processing', category: 'Payroll' },
    { name: 'Payroll.Setup', description: 'Payroll system setup', category: 'Payroll' },
    { name: 'Payroll.Allowances', description: 'Manage allowances', category: 'Payroll' },
    { name: 'Payroll.Deductions', description: 'Manage deductions', category: 'Payroll' },
    
    // Asset Management
    { name: 'AssetManagement', description: 'Asset management system', category: 'Assets' },
    { name: 'AssetManagement.View', description: 'View all assets', category: 'Assets' },
    { name: 'AssetManagement.Create', description: 'Create new assets', category: 'Assets' },
    { name: 'AssetManagement.Approve', description: 'Approve asset requests', category: 'Assets' },
    { name: 'AssetManagement.MyAssets', description: 'Access personal assets', category: 'Assets' },
    
    // Claims Management
    { name: 'Claims', description: 'Claims management system', category: 'Claims' },
    { name: 'Claims.View', description: 'View claims', category: 'Claims' },
    { name: 'Claims.Manage', description: 'Manage all claims', category: 'Claims' },
    
    // Other Modules
    { name: 'Scheduler', description: 'Schedule management', category: 'Other' },
    { name: 'Feedback', description: 'Feedback system', category: 'Other' },
    { name: 'MasterData', description: 'Master data management', category: 'Other' },
    { name: 'Configuration', description: 'System configuration', category: 'Other' }
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setUserPermissions(data.permissions.modules || []);
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

  const updatePermission = async (moduleName, permissionType, value) => {
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
            [permissionType]: value
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage(`Permission ${value ? 'granted' : 'revoked'} successfully`);
        // Refresh user permissions
        fetchUserPermissions(selectedUser.id);
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

  const bulkUpdatePermissions = async (moduleName, permissions) => {
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
          permissions
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage('Permissions updated successfully');
        fetchUserPermissions(selectedUser.id);
      } else {
        throw new Error(data.message || 'Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      showMessage('Failed to update permissions: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const revokeAllPermissions = async (userId) => {
    if (!confirm('Are you sure you want to revoke all custom permissions for this user? This will reset them to their role defaults.')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      // Revoke each permission individually
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
      fetchUserPermissions(selectedUser.id);
    } catch (error) {
      console.error('Error revoking permissions:', error);
      showMessage('Failed to revoke permissions: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionValue = (moduleName, permissionType) => {
    const userPerm = userPermissions.find(p => p.name === moduleName);
    return userPerm ? userPerm[permissionType] : false;
  };

  const getPermissionSource = (moduleName) => {
    const userPerm = userPermissions.find(p => p.name === moduleName);
    return userPerm ? userPerm.source : 'role';
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group modules by category
  const groupedModules = availableModules.reduce((groups, module) => {
    const category = module.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(module);
    return groups;
  }, {});

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Permissions</h1>
        <p className="text-gray-600">
          Manage individual user permissions. User-specific permissions override role defaults.
        </p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mb-6`}>
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* User List Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Users</h2>
              
              {/* Search */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && !users.length ? (
                <div className="p-8 text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'bg-blue-50 border-r-4 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {user.name}
                            </h3>
                            <span className={`badge badge-sm ${
                              user.role === 'admin' ? 'badge-error' :
                              user.role === 'manager' ? 'badge-warning' :
                              user.role === 'supervisor' ? 'badge-info' : 'badge-success'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {user.email}
                          </p>
                          {user.module_names && (
                            <p className="text-xs text-gray-500">
                              Custom permissions: {user.module_names.split(',').filter(Boolean).length}
                            </p>
                          )}
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* User Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Permissions for {selectedUser.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-gray-600">{selectedUser.email}</span>
                      <span className={`badge ${
                        selectedUser.role === 'admin' ? 'badge-error' :
                        selectedUser.role === 'manager' ? 'badge-warning' :
                        selectedUser.role === 'supervisor' ? 'badge-info' : 'badge-success'
                      }`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => revokeAllPermissions(selectedUser.id)}
                      className="btn btn-outline btn-error btn-sm"
                      disabled={loading}
                    >
                      Revoke All Custom
                    </button>
                    <button
                      onClick={() => fetchUserPermissions(selectedUser.id)}
                      className="btn btn-outline btn-sm"
                      disabled={loading}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>
                      <strong>User-specific permissions</strong> override role defaults. 
                      Gray checkboxes show role defaults, blue show custom permissions.
                    </span>
                  </div>
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-2 text-gray-500">Loading permissions...</p>
                  </div>
                ) : (
                  <div className="space-y-8 max-h-96 overflow-y-auto">
                    {Object.entries(groupedModules).map(([category, modules]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                          {category}
                        </h3>
                        
                        <div className="grid gap-4">
                          {modules.map(module => {
                            const source = getPermissionSource(module.name);
                            const isCustom = source === 'user';
                            
                            return (
                              <div key={module.name} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {module.name}
                                      {isCustom && (
                                        <span className="badge badge-sm badge-info ml-2">Custom</span>
                                      )}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {module.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2 mb-3">
                                  <button
                                    onClick={() => bulkUpdatePermissions(module.name, {
                                      can_view: true,
                                      can_create: true,
                                      can_edit: true,
                                      can_delete: true,
                                      can_approve: true
                                    })}
                                    className="btn btn-xs btn-outline btn-success"
                                    disabled={loading}
                                  >
                                    Grant All
                                  </button>
                                  <button
                                    onClick={() => bulkUpdatePermissions(module.name, {
                                      can_view: false,
                                      can_create: false,
                                      can_edit: false,
                                      can_delete: false,
                                      can_approve: false
                                    })}
                                    className="btn btn-xs btn-outline btn-error"
                                    disabled={loading}
                                  >
                                    Revoke All
                                  </button>
                                </div>

                                {/* Permission Toggles */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                  {['view', 'create', 'edit', 'delete', 'approve'].map(action => {
                                    const permissionType = `can_${action}`;
                                    const isChecked = getPermissionValue(module.name, permissionType);
                                    
                                    return (
                                      <label key={action} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => updatePermission(module.name, permissionType, e.target.checked)}
                                          disabled={loading}
                                          className={`checkbox checkbox-sm ${
                                            isCustom ? 'checkbox-primary' : 'checkbox-gray-300'
                                          }`}
                                        />
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium capitalize">
                                            {action}
                                          </span>
                                          {isCustom && (
                                            <span className="text-xs text-blue-600">Custom</span>
                                          )}
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Select a User</h3>
                <p>Choose a user from the list to manage their permissions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Permission Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
            <span>Role Default - Inherited from user's role</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 rounded"></div>
            <span>Custom Permission - Specifically granted to this user</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="badge badge-info badge-sm">Custom</div>
            <span>User has custom permissions for this module</span>
          </div>
        </div>
      </div>
    </div>
  );
}
