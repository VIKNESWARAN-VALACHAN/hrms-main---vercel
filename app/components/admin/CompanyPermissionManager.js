// frontend/components/admin/CompanyPermissionManager.js
"use client";

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function CompanyPermissionManager() {
  // States
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyModules, setCompanyModules] = useState([]);
  const [companyConfigModules, setCompanyConfigModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeView, setActiveView] = useState('user-permissions'); // 'user-permissions' or 'company-config'
  const [configCompany, setConfigCompany] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  
  // Initial data loading
  useEffect(() => {
    fetchUsers();
    fetchAllCompanies();
  }, []);

  // Fetch user companies when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserCompanies(selectedUser.id);
      setSelectedCompany(null);
      setCompanyModules([]);
    }
  }, [selectedUser]);

  // Fetch company modules when company is selected
  useEffect(() => {
    if (selectedUser && selectedCompany) {
      fetchCompanyModules(selectedUser.id, selectedCompany.id);
    }
  }, [selectedUser, selectedCompany]);

  // Helper functions
  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // API Functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/permissions/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCompanies = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/permissions/companies/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchUserCompanies = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_BASE_URL}/api/company-permissions/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        // Enhance companies with permission data
        const enhancedCompanies = data.companies.map(company => ({
          ...company,
          is_own_company: company.id === selectedUser?.company_id,
          permissions: {
            can_view: company.can_view || company.id === selectedUser?.company_id,
            can_edit: company.can_edit || false,
            can_manage_employees: company.can_manage_employees || false,
            can_manage_permissions: company.can_manage_permissions || false
          }
        }));
        
        setUserPermissions(enhancedCompanies);
        
        // Auto-select first company if available
        if (enhancedCompanies.length > 0 && !selectedCompany) {
          const accessibleCompany = enhancedCompanies.find(c => c.can_view || c.id === selectedUser?.company_id);
          if (accessibleCompany) {
            setSelectedCompany(accessibleCompany);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user companies:', error);
      showMessage('Failed to load company permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyModules = async (userId, companyId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(
        `${API_BASE_URL}/api/company-permissions/${userId}/company/${companyId}/modules`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setCompanyModules(data.modules || []);
      }
    } catch (error) {
      console.error('Error fetching company modules:', error);
      showMessage('Failed to load company modules', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyConfigModules = async (companyId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(
        `${API_BASE_URL}/api/company-permissions/company/${companyId}/modules`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setCompanyConfigModules(data.modules || []);
      }
    } catch (error) {
      console.error('Error fetching company config modules:', error);
      showMessage('Failed to load company configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Permission Management Functions
  const updateCompanyPermission = async (companyId, permissionType) => {
    try {
      if (!selectedUser) return;
      
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      const company = userPermissions.find(c => c.id === companyId);
      if (!company) return;

      const currentValue = company[permissionType] || false;
      const newValue = !currentValue;

      const permissions = {
        can_view: permissionType === 'can_view' ? newValue : company.can_view,
        can_edit: permissionType === 'can_edit' ? newValue : company.can_edit,
        can_manage_employees: permissionType === 'can_manage_employees' ? newValue : company.can_manage_employees,
        can_manage_permissions: permissionType === 'can_manage_permissions' ? newValue : company.can_manage_permissions
      };

      const response = await fetch(`${API_BASE_URL}/api/company-permissions/grant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          companyId,
          permissions
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage('Company permission updated successfully');
        
        // Update local state
        setUserPermissions(prev => prev.map(c => {
          if (c.id === companyId) {
            return { ...c, [permissionType]: newValue };
          }
          return c;
        }));
      }
    } catch (error) {
      console.error('Error updating company permission:', error);
      showMessage('Failed to update permission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateModulePermission = async (moduleId, permissionType) => {
    try {
      console.log('Updating module permission:', { moduleId, permissionType });
      if (!selectedUser || !selectedCompany) return;
      
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      const foundModule  = companyModules.find(m => m.id === moduleId);
      if (!foundModule ) return;

      const currentValue = foundModule [permissionType] || false;
      const newValue = !currentValue;

      const permissions = {
        can_view: permissionType === 'can_view' ? newValue : foundModule .can_view,
        can_create: permissionType === 'can_create' ? newValue : foundModule .can_create,
        can_edit: permissionType === 'can_edit' ? newValue : foundModule .can_edit,
        can_delete: permissionType === 'can_delete' ? newValue : foundModule .can_delete,
        can_approve: permissionType === 'can_approve' ? newValue : foundModule.can_approve
      };

      const response = await fetch(`${API_BASE_URL}/api/company-permissions/module/permission`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          companyId: selectedCompany.id,
          moduleId,
          permissions
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage('Module permission updated successfully');
        
        // Update local state
        setCompanyModules(prev => prev.map(m => {
          if (m.id === moduleId) {
            return { ...m, [permissionType]: newValue, is_inherited: 0 };
          }
          return m;
        }));
      }
    } catch (error) {
      console.error('Error updating module permission:', error);
      showMessage('Failed to update module permission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetModulePermission = async (moduleId) => {
    try {
      if (!selectedUser || !selectedCompany) return;
      
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      const response = await fetch(`${API_BASE_URL}/api/company-permissions/module/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          companyId: selectedCompany.id,
          moduleId
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage('Module permission reset to inherited');
        fetchCompanyModules(selectedUser.id, selectedCompany.id); // Refresh
      }
    } catch (error) {
      console.error('Error resetting module permission:', error);
      showMessage('Failed to reset permission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateCompanyPermissions = async (permissionType, value) => {
    try {
      if (!selectedUser) return;
      
      if (!confirm(`Are you sure you want to ${value ? 'grant' : 'revoke'} ${permissionType} access for all companies?`)) {
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      
      const companyPermissions = {};
      userPermissions.forEach(company => {
        companyPermissions[company.id] = {
          can_view: permissionType === 'can_view' ? value : company.can_view,
          can_edit: permissionType === 'can_edit' ? value : company.can_edit,
          can_manage_employees: permissionType === 'can_manage_employees' ? value : company.can_manage_employees,
          can_manage_permissions: permissionType === 'can_manage_permissions' ? value : company.can_manage_permissions
        };
      });

      const response = await fetch(`${API_BASE_URL}/api/company-permissions/bulk-update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          companyPermissions
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage('Bulk update completed successfully');
        fetchUserCompanies(selectedUser.id); // Refresh
      }
    } catch (error) {
      console.error('Error bulk updating permissions:', error);
      showMessage('Failed to bulk update permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Company Configuration Functions
  const toggleCompanyModule = async (moduleId, isEnabled) => {
    try {
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(
        `${API_BASE_URL}/api/company-permissions/company/${configCompany.id}/toggle-module`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            moduleId,
            isEnabled
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        showMessage(data.message);
        fetchCompanyConfigModules(configCompany.id);
      }
    } catch (error) {
      console.error('Error toggling company module:', error);
      showMessage('Failed to update company module', 'error');
    }
  };

  const openCompanyConfig = (company) => {
    setActiveView('company-config');
    setConfigCompany(company);
    fetchCompanyConfigModules(company.id);
  };

  const closeCompanyConfig = () => {
    setActiveView('user-permissions');
    setConfigCompany(null);
    setCompanyConfigModules([]);
  };

  // Helper Functions
  const getPermissionLevel = (company) => {
    if (company.can_manage_permissions) return { label: 'Full Admin', color: 'badge-secondary' };
    if (company.can_manage_employees) return { label: 'HR Manager', color: 'badge-info' };
    if (company.can_edit) return { label: 'Editor', color: 'badge-warning' };
    if (company.can_view || company.is_own_company) return { label: 'Viewer', color: 'badge-success' };
    return { label: 'No Access', color: 'badge-error' };
  };

  const getAvatarText = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getModuleCategories = () => {
    const categories = {};
    companyModules.forEach(module => {
      if (!categories[module.category]) {
        categories[module.category] = [];
      }
      categories[module.category].push(module);
    });
    return categories;
  };

  const getFilteredUsers = () => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  };

  const getFilteredCompanies = () => {
    if (!companySearchTerm) return userPermissions;
    const term = companySearchTerm.toLowerCase();
    return userPermissions.filter(company => 
      company.name.toLowerCase().includes(term) ||
      company.email?.toLowerCase().includes(term)
    );
  };

  // Render Functions
  const renderUserPermissionsView = () => (
    <>
      {/* Alert Message */}
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg mb-6`}>
          <div className="flex items-center gap-2">
            {message.type === 'error' ? '❌' : '✅'}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* User Selection Card */}
      <div className="card bg-base-100 shadow-sm border mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="card-title mb-4">Select User</h2>
              <div className="form-control">
                <div className="relative">
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select from List</span>
              </label>
              <select
                className="select select-bordered w-full lg:w-64"
                value={selectedUser?.id || ''}
                onChange={(e) => {
                  const user = users.find(u => u.id === parseInt(e.target.value));
                  setSelectedUser(user || null);
                }}
                disabled={loading}
              >
                <option value="">Choose a user...</option>
                {getFilteredUsers().map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role}) - {user.company_name || 'No Company'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <>
          {/* User Info Card */}
          <div className="card bg-base-100 shadow-sm border mb-6">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-xl w-14 h-14">
                      <span className="text-xl font-bold">
                        {getAvatarText(selectedUser.name)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${
                        selectedUser.role === 'admin' ? 'badge-error' :
                        selectedUser.role === 'manager' ? 'badge-warning' :
                        selectedUser.role === 'supervisor' ? 'badge-info' : 'badge-success'
                      }`}>
                        {selectedUser.role || 'employee'}
                      </span>
                      <span className="badge badge-neutral">
                        {selectedUser.company_name || 'No Company'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openCompanyConfig({ id: selectedUser.company_id, name: selectedUser.company_name })}
                    className="btn btn-sm btn-outline"
                    title="Configure User's Company Modules"
                  >
                    ⚙️ Configure Company
                  </button>
                  <button
                    onClick={fetchUsers}
                    className="btn btn-sm btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      '↻ Refresh'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="tabs tabs-boxed bg-base-200 mb-6">
            <button
              className={`tab ${!selectedCompany ? 'tab-active' : ''}`}
              onClick={() => setSelectedCompany(null)}
            >
              Company Access
            </button>
            <button
              className={`tab ${selectedCompany ? 'tab-active' : ''}`}
              onClick={() => {
                if (userPermissions.find(c => c.can_view)) {
                  setSelectedCompany(userPermissions.find(c => c.can_view));
                }
              }}
              disabled={!userPermissions.find(c => c.can_view)}
            >
              Module Permissions
            </button>
          </div>

          {!selectedCompany ? (
            /* Company Access View */
            <div className="card bg-base-100 shadow-sm border">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Company Access Control</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => bulkUpdateCompanyPermissions('can_view', true)}
                      className="btn btn-success btn-sm"
                      disabled={loading}
                    >
                      Grant All View
                    </button>
                    <button
                      onClick={() => bulkUpdateCompanyPermissions('can_view', false)}
                      className="btn btn-error btn-sm"
                      disabled={loading}
                    >
                      Revoke All
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-3 text-base-content/60">Loading company permissions...</p>
                  </div>
                ) : userPermissions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏢</div>
                    <p className="text-base-content/60">No company permissions found</p>
                    <button
                      onClick={() => fetchUserCompanies(selectedUser.id)}
                      className="btn btn-primary btn-sm mt-2"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-control mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          className="input input-bordered w-full pl-10"
                          placeholder="Search companies..."
                          value={companySearchTerm}
                          onChange={(e) => setCompanySearchTerm(e.target.value)}
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Company</th>
                            <th>Status</th>
                            <th>View</th>
                            <th>Edit</th>
                            <th>Manage Employees</th>
                            <th>Manage Permissions</th>
                            <th>Access Level</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredCompanies().map(company => {
                            const permissionLevel = getPermissionLevel(company);
                            const isOwnCompany = company.is_own_company;
                            
                            return (
                              <tr key={company.id} className={isOwnCompany ? 'bg-base-200' : ''}>
                                <td>
                                  <div className="flex items-center gap-3">
                                    <div className="avatar placeholder">
                                      <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                                        <span>{company.name?.charAt(0)}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="font-bold">{company.name}</div>
                                      <div className="text-sm opacity-50">
                                        {company.module_count || 0} modules available
                                      </div>
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
                                    checked={company.can_view || isOwnCompany}
                                    onChange={() => updateCompanyPermission(company.id, 'can_view')}
                                    disabled={loading || isOwnCompany}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="toggle toggle-warning"
                                    checked={company.can_edit}
                                    onChange={() => updateCompanyPermission(company.id, 'can_edit')}
                                    disabled={loading || !(company.can_view || isOwnCompany)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="toggle toggle-info"
                                    checked={company.can_manage_employees}
                                    onChange={() => updateCompanyPermission(company.id, 'can_manage_employees')}
                                    disabled={loading || !(company.can_view || isOwnCompany)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="toggle toggle-secondary"
                                    checked={company.can_manage_permissions}
                                    onChange={() => updateCompanyPermission(company.id, 'can_manage_permissions')}
                                    disabled={loading || !(company.can_view || isOwnCompany)}
                                  />
                                </td>
                                <td>
                                  <span className={`badge ${permissionLevel.color}`}>
                                    {permissionLevel.label}
                                  </span>
                                </td>
                                <td>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedCompany(company);
                                      }}
                                      className="btn btn-xs btn-primary"
                                      disabled={!(company.can_view || isOwnCompany)}
                                    >
                                      Manage Modules
                                    </button>
                                    <button
                                      onClick={() => openCompanyConfig(company)}
                                      className="btn btn-xs btn-ghost"
                                      title="Configure Company Modules"
                                    >
                                      ⚙️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Company Selection for Module Permissions */}
                    {userPermissions.filter(c => c.can_view || c.is_own_company).length > 0 && (
                      <div className="mt-6 p-4 bg-base-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Select Company for Module Permissions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {userPermissions
                            .filter(company => company.can_view || company.is_own_company)
                            .map(company => (
                              <button
                                key={company.id}
                                onClick={() => setSelectedCompany(company)}
                                className={`btn btn-sm ${selectedCompany?.id === company.id ? 'btn-primary' : 'btn-outline'}`}
                              >
                                {company.name}
                                {company.is_own_company && ' (Own)'}
                              </button>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Module Permissions View */
            <div className="card bg-base-100 shadow-sm border">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Module Permissions for {selectedCompany?.name}</h3>
                    <p className="text-sm text-base-content/60">
                      {selectedCompany?.is_own_company && '(Own Company) • '}
                      Manage module access for this specific company
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCompany(null)}
                      className="btn btn-sm btn-ghost"
                    >
                      ← Back to Companies
                    </button>
                    <button
                      onClick={() => openCompanyConfig(selectedCompany)}
                      className="btn btn-sm btn-outline"
                      title="Configure Company Modules"
                    >
                      ⚙️ Configure
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-3 text-base-content/60">Loading modules...</p>
                  </div>
                ) : companyModules.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="text-base-content/60">No modules available for this company</p>
                    <button
                      onClick={() => openCompanyConfig(selectedCompany)}
                      className="btn btn-primary btn-sm mt-2"
                    >
                      Configure Modules
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(getModuleCategories()).map(([category, modules]) => (
                      <div key={category}>
                        <h4 className="text-md font-semibold mb-3 text-base-content/80">
                          {category} ({modules.length} modules)
                        </h4>
                        <div className="space-y-3">
                          {modules.map(module => (
                            <div
                              key={module.id}
                              className={`p-4 rounded-lg border ${
                                module.can_view ? 'bg-success/10 border-success/20' : 'bg-base-200'
                              } ${module.is_inherited ? '' : 'ring-1 ring-primary/20'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="text-2xl">{module.icon || '📄'}</div>
                                  <div>
                                    <h4 className="font-semibold">{module.name}</h4>
                                    <p className="text-sm text-base-content/60">{module.description}</p>
                                    {!module.is_inherited && (
                                      <span className="badge badge-primary badge-xs mt-1">Custom</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <label className="label cursor-pointer gap-2">
                                      <span className="label-text text-sm">View</span>
                                      <input
                                        type="checkbox"
                                        className="toggle toggle-sm toggle-success"
                                        checked={module.can_view}
                                        onChange={() => updateModulePermission(module.id, 'can_view')}
                                        disabled={loading}
                                      />
                                    </label>
                                    {module.can_view && (
                                      <>
                                        <label className="label cursor-pointer gap-2">
                                          <span className="label-text text-sm">Create</span>
                                          <input
                                            type="checkbox"
                                            className="toggle toggle-sm toggle-warning"
                                            checked={module.can_create}
                                            onChange={() => updateModulePermission(module.id, 'can_create')}
                                            disabled={loading}
                                          />
                                        </label>
                                        <label className="label cursor-pointer gap-2">
                                          <span className="label-text text-sm">Edit</span>
                                          <input
                                            type="checkbox"
                                            className="toggle toggle-sm toggle-info"
                                            checked={module.can_edit}
                                            onChange={() => updateModulePermission(module.id, 'can_edit')}
                                            disabled={loading}
                                          />
                                        </label>
                                      </>
                                    )}
                                  </div>
                                  {!module.is_inherited && (
                                    <button
                                      onClick={() => resetModulePermission(module.id)}
                                      className="btn btn-xs btn-ghost"
                                      disabled={loading}
                                      title="Reset to inherited"
                                    >
                                      ↩️ Reset
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

  const renderCompanyConfigView = () => (
    <div className="card bg-base-100 shadow-sm border">
      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Company Module Configuration</h3>
            <p className="text-sm text-base-content/60">
              Enable or disable modules for {configCompany?.name}
            </p>
          </div>
          <button onClick={closeCompanyConfig} className="btn btn-sm btn-ghost">
            ← Back to User Permissions
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-3 text-base-content/60">Loading company modules...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companyConfigModules.map(module => (
              <div
                key={module.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  module.is_enabled ? 'bg-success/10 border-success/20' : 'bg-base-200 border-base-300'
                } hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{module.icon || '📄'}</div>
                    <div>
                      <h4 className="font-semibold">{module.name}</h4>
                      <p className="text-xs text-base-content/60">{module.category}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={module.is_enabled}
                    onChange={(e) => toggleCompanyModule(module.id, e.target.checked)}
                    disabled={loading}
                  />
                </div>
                <p className="text-sm text-base-content/70">{module.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Alert Message */}
      {message.text && activeView === 'user-permissions' && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
          <div className="flex items-center gap-2">
            {message.type === 'error' ? '❌' : '✅'}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeView === 'user-permissions' 
        ? renderUserPermissionsView()
        : renderCompanyConfigView()
      }
    </div>
  );
}
