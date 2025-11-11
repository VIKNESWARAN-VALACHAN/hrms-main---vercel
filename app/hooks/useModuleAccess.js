// // // // // frontend/hooks/useModuleAccess.js
// // // // import { useState, useEffect } from 'react';
// // // // import { API_BASE_URL } from '../config';
// // // // export function useModuleAccess() {
// // // //   const [permissions, setPermissions] = useState(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     fetchPermissions();
// // // //   }, []);

// // // //   const fetchPermissions = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);
      
// // // //       const token = localStorage.getItem('hrms_token');
// // // //       if (!token) {
// // // //         throw new Error('No authentication token found');
// // // //       }

// // // //       const response = await fetch(`${API_BASE_URL}/api/permissions/my-permissions`, {
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
// // // //         setPermissions(data.permissions);
// // // //       } else {
// // // //         throw new Error(data.message || 'Failed to load permissions');
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('Error fetching permissions:', err);
// // // //       setError(err.message);
// // // //       // Fallback to empty permissions to avoid breaking UI
// // // //       setPermissions({
// // // //         modules: [],
// // // //         user: { role: 'employee' }
// // // //       });
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const hasAccess = (moduleName) => {
// // // //     if (!permissions || !permissions.modules) return false;
// // // //     const module = permissions.modules.find(m => m.name === moduleName);
// // // //     return module ? module.can_view : false;
// // // //   };

// // // //   const can = (moduleName, action = 'view') => {
// // // //     if (!permissions || !permissions.modules) return false;
// // // //     const module = permissions.modules.find(m => m.name === moduleName);
// // // //     if (!module) return false;
    
// // // //     const actionKey = `can_${action}`;
// // // //     return module[actionKey] || false;
// // // //   };

// // // //   const getModule = (moduleName) => {
// // // //     if (!permissions || !permissions.modules) return null;
// // // //     return permissions.modules.find(m => m.name === moduleName);
// // // //   };

// // // //   return {
// // // //     permissions,
// // // //     loading,
// // // //     error,
// // // //     hasAccess,
// // // //     can,
// // // //     getModule,
// // // //     refetch: fetchPermissions
// // // //   };
// // // // }

// // // // frontend/hooks/useModuleAccess.js
// // // import { useState, useEffect } from 'react';
// // // import { API_BASE_URL } from '../config';

// // // export function useModuleAccess() {
// // //   const [permissions, setPermissions] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   useEffect(() => {
// // //     fetchPermissions();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   const fetchPermissions = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const token = localStorage.getItem('hrms_token');
// // //       if (!token) {
// // //         throw new Error('No authentication token found');
// // //       }

// // //       const response = await fetch(`${API_BASE_URL}/api/permissions/my-permissions`, {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error(`HTTP error! status: ${response.status}`);
// // //       }

// // //       const data = await response.json();

// // //       if (data.success) {
// // //         setPermissions(data.permissions);
// // //       } else {
// // //         throw new Error(data.message || 'Failed to load permissions');
// // //       }
// // //     } catch (err) {
// // //       console.error('Error fetching permissions:', err);
// // //       setError(err.message);
// // //       // Fallback to empty permissions to avoid breaking UI
// // //       setPermissions({
// // //         modules: [],
// // //         user: { role: 'employee' },
// // //         meta: { hasCustomPermissions: false },
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const hasAccess = (moduleName) => {
// // //     if (!permissions || !permissions.modules) return false;
// // //     const module = permissions.modules.find((m) => m.name === moduleName);
// // //     return module ? module.can_view : false;
// // //   };

// // //   const can = (moduleName, action = 'view') => {
// // //     if (!permissions || !permissions.modules) return false;
// // //     const module = permissions.modules.find((m) => m.name === moduleName);
// // //     if (!module) return false;

// // //     const actionKey = `can_${action}`;
// // //     return !!module[actionKey];
// // //   };

// // //   const getModule = (moduleName) => {
// // //     if (!permissions || !permissions.modules) return null;
// // //     return permissions.modules.find((m) => m.name === moduleName);
// // //   };

// // //   // New: expose hasCustomPermissions so Sidebar.tsx can read it
// // //   const hasCustomPermissions = () => {
// // //     // Prefer an explicit meta flag if your API provides it
// // //     if (permissions?.meta && typeof permissions.meta.hasCustomPermissions === 'boolean') {
// // //       return permissions.meta.hasCustomPermissions;
// // //     }
// // //     // Fallback heuristic: true if there is at least one module permission defined
// // //     return Array.isArray(permissions?.modules) && permissions.modules.length > 0;
// // //   };

// // //   return {
// // //     permissions,
// // //     loading,
// // //     error,
// // //     hasAccess,
// // //     can,
// // //     getModule,
// // //     hasCustomPermissions, // <-- add to returned shape
// // //     refetch: fetchPermissions,
// // //   };
// // // }


// // // frontend/hooks/useModuleAccess.js
// // import { useState, useEffect } from 'react';
// // import { API_BASE_URL } from '../config';

// // export function useModuleAccess() {
// //   const [permissions, setPermissions] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     fetchPermissions();
// //   }, []);

// //   const fetchPermissions = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const token = localStorage.getItem('hrms_token');
// //       if (!token) {
// //         throw new Error('No authentication token found');
// //       }

// //       const response = await fetch(`${API_BASE_URL}/api/permissions/my-permissions`, {
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
// //         setPermissions(data.permissions);
// //       } else {
// //         throw new Error(data.message || 'Failed to load permissions');
// //       }
// //     } catch (err) {
// //       console.error('Error fetching permissions:', err);
// //       setError(err.message);
// //       // Fallback to empty permissions to avoid breaking UI
// //       setPermissions({
// //         modules: [],
// //         user: { role: 'employee' },
// //         has_custom_permissions: false
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const hasAccess = (moduleName) => {
// //     if (!permissions || !permissions.modules) return false;
// //     const module = permissions.modules.find(m => m.name === moduleName);
// //     return module ? module.can_view : false;
// //   };

// //   const can = (moduleName, action = 'view') => {
// //     if (!permissions || !permissions.modules) return false;
// //     const module = permissions.modules.find(m => m.name === moduleName);
// //     if (!module) return false;
    
// //     const actionKey = `can_${action}`;
// //     return module[actionKey] || false;
// //   };

// //   const getModule = (moduleName) => {
// //     if (!permissions || !permissions.modules) return null;
// //     return permissions.modules.find(m => m.name === moduleName);
// //   };

// //   // Check if user has custom permissions (not just role-based)
// //   const hasCustomPermissions = permissions?.has_custom_permissions || false;

// //   return {
// //     permissions,
// //     loading,
// //     error,
// //     hasAccess,
// //     can,
// //     getModule,
// //     hasCustomPermissions, // Add this property
// //     refetch: fetchPermissions
// //   };
// // }

// // frontend/hooks/useModuleAccess.js
// import { useState, useEffect } from 'react';
// import { API_BASE_URL } from '../config';

// export function useModuleAccess() {
//   const [permissions, setPermissions] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchPermissions();
//   }, []);

//   const fetchPermissions = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = localStorage.getItem('hrms_token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await fetch(`${API_BASE_URL}/api/permissions/my-permissions`, {
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
//         setPermissions(data.permissions);
//       } else {
//         throw new Error(data.message || 'Failed to load permissions');
//       }
//     } catch (err) {
//       console.error('Error fetching permissions:', err);
//       setError(err.message);
//       // Fallback to empty permissions to avoid breaking UI
//       setPermissions({
//         modules: [],
//         user: { role: 'employee' },
//         has_custom_permissions: false
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasAccess = (moduleName) => {
//     if (!permissions || !permissions.modules) return false;
//     const moduleData = permissions.modules.find(m => m.name === moduleName);
//     return moduleData ? moduleData.can_view : false;
//   };

//   const can = (moduleName, action = 'view') => {
//     if (!permissions || !permissions.modules) return false;
//     const moduleData = permissions.modules.find(m => m.name === moduleName);
//     if (!moduleData) return false;
    
//     const actionKey = `can_${action}`;
//     return moduleData[actionKey] || false;
//   };

//   const getModule = (moduleName) => {
//     if (!permissions || !permissions.modules) return null;
//     return permissions.modules.find(m => m.name === moduleName);
//   };

//   // Check if user has custom permissions (not just role-based)
//   const hasCustomPermissions = permissions?.has_custom_permissions || false;

//   return {
//     permissions,
//     loading,
//     error,
//     hasAccess,
//     can,
//     getModule,
//     hasCustomPermissions,
//     refetch: fetchPermissions
//   };
// }

// frontend/hooks/useModuleAccess.js
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export function useModuleAccess() {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('hrms_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/permissions/my-permissions`, {
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
        setPermissions(data.permissions);
      } else {
        throw new Error(data.message || 'Failed to load permissions');
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError(err.message);
      // Fallback to empty permissions to avoid breaking UI
      setPermissions({
        modules: [],
        user: { role: 'employee' },
        has_custom_permissions: false
      });
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (moduleName) => {
    if (!permissions || !permissions.modules) return undefined; // Return undefined for no custom permissions
    
    const moduleData = permissions.modules.find(m => m.name === moduleName);
    
    // If module not found in custom permissions, return undefined (fallback to role)
    if (!moduleData) return undefined;
    
    // If module exists but source is not 'user', it's role-based, so return undefined
    if (moduleData.source !== 'user') return undefined;
    
    // Only return true/false if we have an explicit user custom permission
    return moduleData.can_view === 1;
  };

  const can = (moduleName, action = 'view') => {
    if (!permissions || !permissions.modules) return undefined; // Return undefined for no custom permissions
    
    const moduleData = permissions.modules.find(m => m.name === moduleName);
    
    // If module not found in custom permissions, return undefined (fallback to role)
    if (!moduleData) return undefined;
    
    // If module exists but source is not 'user', it's role-based, so return undefined
    if (moduleData.source !== 'user') return undefined;
    
    const actionKey = `can_${action}`;
    
    // Only return true/false if we have an explicit user custom permission
    return moduleData[actionKey] === 1;
  };

  const getModule = (moduleName) => {
    if (!permissions || !permissions.modules) return null;
    return permissions.modules.find(m => m.name === moduleName);
  };

  // Check if user has ANY custom permissions (modules with source = 'user' and at least one permission = 1)
  const hasCustomPermissions = permissions?.modules?.some(module => 
    module.source === 'user' && (
      module.can_view === 1 || 
      module.can_create === 1 || 
      module.can_edit === 1 || 
      module.can_delete === 1 || 
      module.can_approve === 1
    )
  ) || false;

  return {
    permissions,
    loading,
    error,
    hasAccess,
    can,
    getModule,
    hasCustomPermissions,
    refetch: fetchPermissions
  };
}
