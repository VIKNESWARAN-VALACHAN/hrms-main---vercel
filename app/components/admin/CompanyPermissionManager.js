// frontend/components/admin/CompanyPermissionManager.js
"use client";

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function CompanyPermissionManager({ userId, userName, userRole }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const fetchCompaniesWithPermissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const response = await fetch(`${API_BASE_URL}/api/permissions/company/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        setCompanies(data.companies || []);
      } else {
        throw new Error(data.message || 'Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      showMessage('Failed to load companies: ' + error.message, 'error');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompanyPermission = async (companyId, permissionType) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      const company = companies.find(c => c.id === companyId);
      if (!company) return;

      const currentValue = company.permissions[permissionType];
      const newValue = !currentValue;

      // Prepare permissions object with all permissions
      const permissions = {
        can_view: permissionType === 'can_view' ? newValue : company.permissions.can_view,
        can_edit: permissionType === 'can_edit' ? newValue : company.permissions.can_edit,
        can_manage_employees: permissionType === 'can_manage_employees' ? newValue : company.permissions.can_manage_employees,
        can_manage_permissions: permissionType === 'can_manage_permissions' ? newValue : company.permissions.can_manage_permissions
      };

      const response = await fetch(`${API_BASE_URL}/api/permissions/company/grant`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          companyId,
          permissions
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to update permission');

      showMessage(`Company permission ${newValue ? 'granted' : 'revoked'} successfully`);
      
      // Update local state
      setCompanies(prev => prev.map(company => {
        if (company.id === companyId) {
          return {
            ...company,
            permissions: {
              ...company.permissions,
              [permissionType]: newValue
            }
          };
        }
        return company;
      }));
    } catch (error) {
      console.error('Error updating company permission:', error);
      showMessage('Failed to update permission: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateCompanyPermissions = async (hasAccess) => {
    if (!confirm(`Are you sure you want to ${hasAccess ? 'grant' : 'revoke'} all company permissions for this user?`)) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('hrms_token');
      if (!token) return showMessage('Authentication token not found', 'error');

      // Prepare bulk permissions object
      const companyPermissions = {};
      companies.forEach(company => {
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
          userId,
          companyPermissions
        })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to update permissions');

      showMessage(`All company permissions ${hasAccess ? 'granted' : 'revoked'} successfully`);
      
      // Update local state
      setCompanies(prev => prev.map(company => ({
        ...company,
        permissions: {
          can_view: hasAccess,
          can_edit: false,
          can_manage_employees: false,
          can_manage_permissions: false
        }
      })));
    } catch (error) {
      console.error('Error bulk updating company permissions:', error);
      showMessage('Failed to update permissions: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCompaniesWithPermissions();
    }
  }, [userId]);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionBadge = (company) => {
    const perms = company.permissions || {};
    if (perms.can_manage_permissions) return 'bg-purple-100 text-purple-800';
    if (perms.can_manage_employees) return 'bg-blue-100 text-blue-800';
    if (perms.can_edit) return 'bg-yellow-100 text-yellow-800';
    if (perms.can_view) return 'bg-green-100 text-green-800';
    if (perms.is_own_company) return 'bg-gray-100 text-gray-800';
    return 'bg-red-100 text-red-800';
  };

  const getPermissionText = (company) => {
    const perms = company.permissions || {};
    if (perms.can_manage_permissions) return 'Full Admin';
    if (perms.can_manage_employees) return 'HR Manager';
    if (perms.can_edit) return 'Editor';
    if (perms.can_view) return 'Viewer';
    if (perms.is_own_company) return 'Own Company';
    return 'No Access';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-base-content">Company Permissions</h3>
          <p className="text-sm text-base-content/60">
            Control which companies {userName} can access and their level of access
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => bulkUpdateCompanyPermissions(true)}
            className="btn btn-success btn-sm gap-2"
            disabled={loading || companies.length === 0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Grant All View
          </button>
          <button
            onClick={() => bulkUpdateCompanyPermissions(false)}
            className="btn btn-error btn-sm gap-2"
            disabled={loading || companies.length === 0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Revoke All
          </button>
        </div>
      </div>

      {/* Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
          <div className="flex items-center gap-2">
            {message.type === 'error' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="form-control">
        <div className="relative">
          <input
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Companies Table */}
      <div className="card bg-base-100 shadow-sm border">
        <div className="card-body p-0">
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
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map(company => (
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
                            {company.is_own_company && (
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
                          checked={company.permissions?.can_view || company.permissions?.is_own_company}
                          onChange={() => toggleCompanyPermission(company.id, 'can_view')}
                          disabled={loading || company.permissions?.is_own_company}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          className="toggle toggle-warning"
                          checked={company.permissions?.can_edit}
                          onChange={() => toggleCompanyPermission(company.id, 'can_edit')}
                          disabled={loading || !company.permissions?.can_view}
                        />
                      </td>
                      <td>
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
                      </td>
                      <td>
                        <span className={`badge ${getPermissionBadge(company)}`}>
                          {getPermissionText(company)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Permission Levels:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Viewer: Can view company data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Editor: Can edit company data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">HR Manager: Can manage employees</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm">Full Admin: Can manage permissions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
