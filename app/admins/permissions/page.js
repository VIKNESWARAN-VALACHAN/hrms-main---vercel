// // frontend/app/admin/permissions/page.js
// "use client";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import PermissionManager from '../../components/admin/PermissionManager';
// import { API_BASE_URL } from '../../config';

// export default function PermissionsPage() {
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     checkAuthorization();
//   }, []);

//   const checkAuthorization = async () => {
//     try {
//       const token = localStorage.getItem('hrms_token');
//       const user = localStorage.getItem('hrms_user');
      
//       if (!token || !user) {
//         router.push(`${API_BASE_URL}/auth/login`);
//         return;
//       }

//       const userData = JSON.parse(user);
//       if (userData.role !== 'admin') {
//         router.push('/unauthorized');
//         return;
//       }

//       setIsAuthorized(true);
//     } catch (error) {
//       console.error('Authorization check failed:', error);
//       router.push('/auth/login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <span className="loading loading-spinner loading-lg"></span>
//           <p className="mt-4 text-gray-600">Checking permissions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthorized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <span className="loading loading-spinner loading-lg"></span>
//           <p className="mt-4 text-gray-600">Redirecting...</p>
//         </div>
//       </div>
//     );
//   }

//   return <PermissionManager />;
// }

// frontend/app/admin/permissions/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PermissionManager from "../../components/admin/PermissionManager";
import { API_BASE_URL } from "../../config";

export default function PermissionsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("hrms_token");
        const user = localStorage.getItem("hrms_user");

        if (!token || !user) {
          if (!cancelled) {
            setAuthError("Session expired or not logged in.");
            router.push(`${API_BASE_URL}/auth/login`);
          }
          return;
        }

        let userData;
        try {
          userData = JSON.parse(user);
        } catch {
          userData = null;
        }

        if (!userData) {
          if (!cancelled) {
            setAuthError("Invalid user session.");
            router.push("/auth/login");
          }
          return;
        }

        if (userData.role !== "admin") {
          if (!cancelled) {
            setAuthError("You do not have permission to view this page.");
            router.push("/unauthorized");
          }
          return;
        }

        if (!cancelled) setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization check failed:", error);
        if (!cancelled) {
          setAuthError("Authorization check failed. Please log in again.");
          router.push("/auth/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuthorization();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <span className="loading loading-spinner loading-lg"></span>
              <h2 className="card-title mt-2">Checking permissions…</h2>
              <div className="w-full mt-4 space-y-2">
                <div className="skeleton h-4 w-3/4 mx-auto"></div>
                <div className="skeleton h-4 w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <span className="loading loading-spinner loading-md"></span>
              <p className="mt-3 text-base-content/70">Redirecting…</p>
              {authError && (
                <div role="alert" className="alert alert-error mt-4">
                  <span>{authError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="breadcrumbs text-sm">
          <ul>
            <li><a href="/admin" className="text-base-content/70 hover:text-primary">Admin</a></li>
            <li className="text-primary">Permissions</li>
          </ul>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-base-content">Permissions Management</h1>
                <p className="text-base-content/60 mt-1">Manage user access and module permissions across the system</p>
              </div>
            </div>

            <PermissionManager />
          </div>
        </div>
      </div>
    </main>
  );
}
