
// // // frontend/app/admin/permissions/page.js
// // "use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import PermissionManager from "../../components/admin/PermissionManager";
// // import { API_BASE_URL } from "../../config";

// // export default function PermissionsPage() {
// //   const [isAuthorized, setIsAuthorized] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [authError, setAuthError] = useState("");
// //   const router = useRouter();

// //   useEffect(() => {
// //     let cancelled = false;

// //     const checkAuthorization = async () => {
// //       try {
// //         const token = localStorage.getItem("hrms_token");
// //         const user = localStorage.getItem("hrms_user");

// //         if (!token || !user) {
// //           if (!cancelled) {
// //             setAuthError("Session expired or not logged in.");
// //             router.push(`${API_BASE_URL}/auth/login`);
// //           }
// //           return;
// //         }

// //         let userData;
// //         try {
// //           userData = JSON.parse(user);
// //         } catch {
// //           userData = null;
// //         }

// //         if (!userData) {
// //           if (!cancelled) {
// //             setAuthError("Invalid user session.");
// //             router.push("/auth/login");
// //           }
// //           return;
// //         }

// //         if (userData.role !== "admin") {
// //           if (!cancelled) {
// //             setAuthError("You do not have permission to view this page.");
// //             router.push("/unauthorized");
// //           }
// //           return;
// //         }

// //         if (!cancelled) setIsAuthorized(true);
// //       } catch (error) {
// //         console.error("Authorization check failed:", error);
// //         if (!cancelled) {
// //           setAuthError("Authorization check failed. Please log in again.");
// //           router.push("/auth/login");
// //         }
// //       } finally {
// //         if (!cancelled) setLoading(false);
// //       }
// //     };

// //     checkAuthorization();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [router]);

// //   if (loading) {
// //     return (
// //       <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
// //         <div className="w-full max-w-xl">
// //           <div className="card bg-base-100 shadow-xl">
// //             <div className="card-body items-center text-center">
// //               <span className="loading loading-spinner loading-lg"></span>
// //               <h2 className="card-title mt-2">Checking permissions…</h2>
// //               <div className="w-full mt-4 space-y-2">
// //                 <div className="skeleton h-4 w-3/4 mx-auto"></div>
// //                 <div className="skeleton h-4 w-2/3 mx-auto"></div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     );
// //   }

// //   if (!isAuthorized) {
// //     return (
// //       <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
// //         <div className="w-full max-w-md">
// //           <div className="card bg-base-100 shadow-xl">
// //             <div className="card-body items-center text-center">
// //               <span className="loading loading-spinner loading-md"></span>
// //               <p className="mt-3 text-base-content/70">Redirecting…</p>
// //               {authError && (
// //                 <div role="alert" className="alert alert-error mt-4">
// //                   <span>{authError}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     );
// //   }

// //   return (
// //     <main className="min-h-screen bg-base-200 p-4 md:p-6">
// //       <div className="max-w-7xl mx-auto space-y-4">
// //         <div className="breadcrumbs text-sm">
// //           <ul>
// //             <li><a href="/admins" className="text-base-content/70 hover:text-primary">Admin</a></li>
// //             <li className="text-primary">Permissions</li>
// //           </ul>
// //         </div>

// //         <div className="card bg-base-100 shadow-xl">
// //           <div className="card-body p-4 md:p-6">
// //             <div className="flex items-center justify-between gap-3 mb-4">
// //               <div>
// //                 <h1 className="text-2xl md:text-3xl font-bold text-base-content">User Permissions</h1>
// //                 <p className="text-base-content/60 mt-1">Manage user access and module permissions across the system</p>
// //               </div>
// //             </div>

// //             <PermissionManager />
// //           </div>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }


// // // frontend/app/admin/permissions/page.js
// // "use client";

// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import PermissionManager from '../../components/admin/PermissionManager';
// // import { API_BASE_URL } from '../../config';

// // export default function PermissionsPage() {
// //   const [isAuthorized, setIsAuthorized] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   useEffect(() => {
// //     checkAuthorization();
// //   }, []);

// //   const checkAuthorization = async () => {
// //     try {
// //       const token = localStorage.getItem('hrms_token');
// //       const user = localStorage.getItem('hrms_user');
      
// //       if (!token || !user) {
// //         router.push(`${API_BASE_URL}/auth/login`);
// //         return;
// //       }

// //       const userData = JSON.parse(user);
// //       if (userData.role !== 'admin') {
// //         router.push('/unauthorized');
// //         return;
// //       }

// //       setIsAuthorized(true);
// //     } catch (error) {
// //       console.error('Authorization check failed:', error);
// //       router.push('/auth/login');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <span className="loading loading-spinner loading-lg"></span>
// //           <p className="mt-4 text-gray-600">Checking permissions...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!isAuthorized) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <span className="loading loading-spinner loading-lg"></span>
// //           <p className="mt-4 text-gray-600">Redirecting...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return <PermissionManager />;
// // }

// // frontend/app/admin/permissions/page.js
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import PermissionManager from "../../components/admin/PermissionManager";
// import { API_BASE_URL } from "../../config";

// export default function PermissionsPage() {
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [authError, setAuthError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     let cancelled = false;

//     const checkAuthorization = async () => {
//       try {
//         const token = localStorage.getItem("hrms_token");
//         const user = localStorage.getItem("hrms_user");

//         if (!token || !user) {
//           if (!cancelled) {
//             setAuthError("Session expired or not logged in.");
//             router.push(`${API_BASE_URL}/auth/login`);
//           }
//           return;
//         }

//         let userData;
//         try {
//           userData = JSON.parse(user);
//         } catch {
//           userData = null;
//         }

//         if (!userData) {
//           if (!cancelled) {
//             setAuthError("Invalid user session.");
//             router.push("/auth/login");
//           }
//           return;
//         }

//         if (userData.role !== "admin") {
//           if (!cancelled) {
//             setAuthError("You do not have permission to view this page.");
//             router.push("/unauthorized");
//           }
//           return;
//         }

//         if (!cancelled) setIsAuthorized(true);
//       } catch (error) {
//         console.error("Authorization check failed:", error);
//         if (!cancelled) {
//           setAuthError("Authorization check failed. Please log in again.");
//           router.push("/auth/login");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     checkAuthorization();
//     return () => {
//       cancelled = true;
//     };
//   }, [router]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
//         <div className="w-full max-w-xl">
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body items-center text-center">
//               <span className="loading loading-spinner loading-lg"></span>
//               <h2 className="card-title mt-2">Checking permissions…</h2>
//               <div className="w-full mt-4 space-y-2">
//                 <div className="skeleton h-4 w-3/4 mx-auto"></div>
//                 <div className="skeleton h-4 w-2/3 mx-auto"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (!isAuthorized) {
//     return (
//       <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
//         <div className="w-full max-w-md">
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body items-center text-center">
//               <span className="loading loading-spinner loading-md"></span>
//               <p className="mt-3 text-base-content/70">Redirecting…</p>
//               {authError && (
//                 <div role="alert" className="alert alert-error mt-4">
//                   <span>{authError}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-base-200 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto space-y-4">
//         <div className="breadcrumbs text-sm">
//           <ul>
//             <li><a href="/admins" className="text-base-content/70 hover:text-primary">Admin</a></li>
//             <li className="text-primary">Permissions</li>
//           </ul>
//         </div>

//         <div className="card bg-base-100 shadow-xl">
//           <div className="card-body p-4 md:p-6">
//             <div className="flex items-center justify-between gap-3 mb-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-base-content">User Permissions</h1>
//                 <p className="text-base-content/60 mt-1">Manage user access and module permissions across the system</p>
//               </div>
//             </div>

//             <PermissionManager />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



// frontend/app/admin/permissions/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PermissionManager from '../../components/admin/PermissionManager';
import CompanyPermissionManager from '../../components/admin/CompanyPermissionManager';
import { API_BASE_URL } from '../../config';

export default function PermissionsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' or 'companies'
  const router = useRouter();

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      const user = localStorage.getItem('hrms_user');
      
      if (!token || !user) {
        router.push(`${API_BASE_URL}/auth/login`);
        return;
      }

      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        router.push('/unauthorized');
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Authorization check failed:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header with Tabs */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Permission Management</h1>
        <p className="text-base-content/60 mb-6">Manage user permissions across modules and companies</p>
        
        {/* Tab Navigation */}
        <div className="tabs tabs-boxed bg-base-200 inline-flex">
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

      {/* Content based on active tab */}
      {activeTab === 'modules' ? <PermissionManager /> : <CompanyPermissionManager />}
    </div>
  );
}
