// frontend/app/admin/permissions/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PermissionManager from '../../components/admin/PermissionManager';
import { API_BASE_URL } from '../../config';

export default function PermissionsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
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

  return <PermissionManager />;
}
