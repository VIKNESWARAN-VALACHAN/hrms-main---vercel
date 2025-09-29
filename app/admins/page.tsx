'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import { useTheme } from '../components/ThemeProvider';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  employee_no: string;
  status: string;
  is_superadmin: boolean | number;
  role: string;
}

export default function ManageAdmins() {
  const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Sort state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Admin | null;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending'
  });

  // Check for authenticated user
  useEffect(() => {
    const userStr = localStorage.getItem('hrms_user');
    const isAuthenticated = localStorage.getItem('hrms_authenticated');

    if (!userStr || isAuthenticated !== 'true') {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      
      // Only allow admin users to access this page
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
      
      setUser(userData);
    } catch (e) {
      console.error('Error parsing user data');
      router.push('/auth/login');
    }
  }, [router]);

  // Fetch admins
  const fetchAdmins = useCallback(async () => {//async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      let queryParams = new URLSearchParams();
      
      // Filter by admin role
      queryParams.append('role', 'admin');
      
      if (searchTerm.length >= 2) {
        queryParams.append('nameEmail', searchTerm);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '?role=admin';
      const response = await fetch(`${API_BASE_URL}/api/admin/employees${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Map and filter admin users only
      const mappedAdmins = data
        .filter((emp: any) => emp.role === 'admin')
        .map((emp: any) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          employee_no: emp.employee_no || '',
          status: emp.status?.toLowerCase() || 'active',
          is_superadmin: emp.is_superadmin || false
        }));
      
      setAdmins(mappedAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
    }, [searchTerm]);

  //};
  
  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchAdmins();
    }
  }, [user,fetchAdmins]);

  // Filter admins based on search term and status
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.employee_no.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle sorting
  const handleSort = (key: keyof Admin) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    let newKey: keyof Admin | null = key;
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else {
        newKey = 'id';
      }
    }
    
    setSortConfig({ key: newKey, direction });
  };
  
  // Sort icon rendering
  const getSortIcon = (key: keyof Admin) => {
    if (sortConfig.key !== key) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === 'ascending') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Calculate pagination and apply sorting
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredAdmins];
    
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Admin] || '';
        const bValue = b[sortConfig.key as keyof Admin] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [filteredAdmins, sortConfig]);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Render admin table
  const renderAdminTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
        </div>
      );
    }

    if (!filteredAdmins.length) {
      return (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>No admins found</h3>
          <p className={`mt-1 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      );
    }

    return (
      <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
        <table className="table w-full">
          <thead>
            <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
              <th className={`w-36 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('employee_no')}>
                Employee No {getSortIcon('employee_no')}
              </th>
              <th className={`w-48 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </th>
              <th className={`w-64 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th className={`w-28 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('status')}>
                Status {getSortIcon('status')}
              </th>
              <th className={`w-32 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('is_superadmin')}>
                Super Admin {getSortIcon('is_superadmin')}
              </th>
              <th className={`w-24 text-right ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.map((admin, index) => (
              <tr 
                key={admin.id} 
                className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentAdmins.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
              >
                <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{admin.employee_no}</td>
                <td className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{admin.name}</td>
                <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{admin.email}</td>
                <td>
                  <div className={`${admin.status === 'active' ? 'text-green-500' : 
                    'text-red-500'}`}>
                    {admin.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </td>
                <td>
                  <div className={`${admin.is_superadmin ? 'badge badge-outline border-blue-600 text-blue-600' : 'text-gray-500'}`}>
                    {admin.is_superadmin ? 'Yes' : '—'}
                  </div>
                </td>
                <td className="text-right">
                  <Link href={`/employees/${admin.id}`} className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`container mx-auto p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Manage Admins
        </h1>
        
        <div className="flex gap-2 w-full sm:w-auto justify-start md:justify-end flex-row md:flex-col lg:flex-row">
          <Link href="/admins/add" className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Admin
          </Link>
        </div>
      </div>
      
      {/* Basic Search and Status Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group flex space-x-2">
            <input 
              type="text" 
              placeholder="Search by name, email, or employee number..." 
              className={`input input-bordered flex-1 ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button className={`btn btn-square ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`} onClick={fetchAdmins}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="form-control w-full md:w-48">
          <select 
            className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {renderAdminTable()}
      
      <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAdmins.length)} of {filteredAdmins.length} admins
      </div>
      
      {/* Pagination */}
      {!loading && filteredAdmins.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`btn btn-sm ${currentPage === page ? 
                  `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                  `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
