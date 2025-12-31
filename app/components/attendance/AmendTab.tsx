// 'use client';

// import React, { useState, useCallback, useMemo } from 'react';
// import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
// import { useTheme } from '../../components/ThemeProvider';
// import type { Filters } from '../../utils/attendanceApi';
// import { format } from 'date-fns';

// interface AmendRecord {
//   id: number;
//   employee_name: string;
//   employee_no: string;
//   department_name: string;
//   company_name: string;
//   date: string;
//   checkIn: string;
//   checkOut: string;
//   new_check_in: string;
//   new_check_out: string;
//   old_status: string;
//   new_status: string;
//   amended_by: string;
//   amended_date: string;
//   reason: string;
// }

// interface AmendTabProps {
//   filters: Filters;
//   onFilterChange: (filters: Partial<Filters>) => void;
//   onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
//   user: any;
// }

// export default function AmendTab({
//   filters,
//   onFilterChange,
//   onShowNotification,
//   user
// }: AmendTabProps) {
//   const { theme } = useTheme();
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);

//   // Multi-select state
//   const [selectedCompanies, setSelectedCompanies] = useState<Set<number>>(new Set());
//   const [selectedDepartments, setSelectedDepartments] = useState<Set<number>>(new Set());
//   const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
//   const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
//   const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

//   // Fetch amend data
//   const { data, total, isLoading, isFetching, error } = useAttendanceData<AmendRecord>(
//     'amend',
//     filters,
//     page,
//     limit
//   );

//   // Fetch filter options
//   const { options: filterOptions } = useFilterOptions('all', filters.company_id, false);

//   // Handle multi-select for companies
//   const handleCompanyToggle = useCallback((companyId: number) => {
//     const newSelected = new Set(selectedCompanies);
//     if (newSelected.has(companyId)) {
//       newSelected.delete(companyId);
//     } else {
//       newSelected.add(companyId);
//     }
//     setSelectedCompanies(newSelected);
//     onFilterChange({ company_id: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined });
//     setPage(1);
//   }, [selectedCompanies, onFilterChange]);

//   // Handle multi-select for departments
//   const handleDepartmentToggle = useCallback((deptId: number) => {
//     const newSelected = new Set(selectedDepartments);
//     if (newSelected.has(deptId)) {
//       newSelected.delete(deptId);
//     } else {
//       newSelected.add(deptId);
//     }
//     setSelectedDepartments(newSelected);
//     onFilterChange({ department_id: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined });
//     setPage(1);
//   }, [selectedDepartments, onFilterChange]);

//   // Handle multi-select for employees
//   const handleEmployeeToggle = useCallback((empId: number) => {
//     const newSelected = new Set(selectedEmployees);
//     if (newSelected.has(empId)) {
//       newSelected.delete(empId);
//     } else {
//       newSelected.add(empId);
//     }
//     setSelectedEmployees(newSelected);
//     onFilterChange({ employee_id: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined });
//     setPage(1);
//   }, [selectedEmployees, onFilterChange]);

//   // Handle filter changes
//   const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
//     onFilterChange({ [key]: value });
//     setPage(1);
//   }, [onFilterChange]);

//   // Get status badge color
//   const getStatusBadgeClass = (status: string) => {
//     switch (status?.toUpperCase()) {
//       case 'PRESENT':
//         return 'badge-success';
//       case 'ABSENT':
//         return 'badge-error';
//       case 'LATE':
//         return 'badge-warning';
//       case 'PARTIAL':
//         return 'badge-info';
//       case 'OFFDAY':
//         return 'badge-secondary';
//       default:
//         return 'badge-ghost';
//     }
//   };

//   if (error) {
//     return (
//       <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
//         <span>{error.message}</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4">
//         <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
//           Attendance Amendments
//         </h2>
//         <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
//           Review and manage attendance record amendments
//         </p>
//       </div>

//       {/* Filters */}
//       <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'}`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           {/* Multi-select Company Filter */}
//           {filterOptions?.companies && (
//             <div className="relative">
//               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
//                 Companies
//               </label>
//               <div
//                 className={`border rounded-lg p-2 cursor-pointer ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}
//                 onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className={`text-sm ${selectedCompanies.size > 0 ? (theme === 'light' ? 'text-gray-900' : 'text-slate-100') : (theme === 'light' ? 'text-gray-500' : 'text-slate-400')}`}>
//                     {selectedCompanies.size > 0 ? `${selectedCompanies.size} selected` : 'All Companies'}
//                   </span>
//                   <svg className={`w-4 h-4 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                   </svg>
//                 </div>
//               </div>

//               {showCompanyDropdown && (
//                 <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}>
//                   <div className="max-h-48 overflow-y-auto p-2">
//                     {filterOptions.companies.map(company => (
//                       <label key={company.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer rounded">
//                         <input
//                           type="checkbox"
//                           checked={selectedCompanies.has(company.id)}
//                           onChange={() => handleCompanyToggle(company.id)}
//                           className="checkbox checkbox-sm"
//                         />
//                         <span className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {company.name}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Multi-select Department Filter */}
//           {filterOptions?.departments && (
//             <div className="relative">
//               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
//                 Departments
//               </label>
//               <div
//                 className={`border rounded-lg p-2 cursor-pointer ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}
//                 onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className={`text-sm ${selectedDepartments.size > 0 ? (theme === 'light' ? 'text-gray-900' : 'text-slate-100') : (theme === 'light' ? 'text-gray-500' : 'text-slate-400')}`}>
//                     {selectedDepartments.size > 0 ? `${selectedDepartments.size} selected` : 'All Departments'}
//                   </span>
//                   <svg className={`w-4 h-4 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                   </svg>
//                 </div>
//               </div>

//               {showDepartmentDropdown && (
//                 <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}>
//                   <div className="max-h-48 overflow-y-auto p-2">
//                     {filterOptions.departments.map(dept => (
//                       <label key={dept.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer rounded">
//                         <input
//                           type="checkbox"
//                           checked={selectedDepartments.has(dept.id)}
//                           onChange={() => handleDepartmentToggle(dept.id)}
//                           className="checkbox checkbox-sm"
//                         />
//                         <span className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                           {dept.department_name}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Start Date */}
//           <div>
//             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
//               Start Date
//             </label>
//             <input
//               type="date"
//               value={filters.start_date || ''}
//               onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
//               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//             />
//           </div>

//           {/* End Date */}
//           <div>
//             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
//               End Date
//             </label>
//             <input
//               type="date"
//               value={filters.end_date || ''}
//               onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
//               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Amend Table */}
//       <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//         {isLoading ? (
//           <div className="p-8 text-center">
//             <div className="loading loading-spinner loading-lg mx-auto"></div>
//             <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//               Loading amendment records...
//             </p>
//           </div>
//         ) : data && data.length > 0 ? (
//           <>
//             <div className="overflow-x-auto">
//               <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//                 <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
//                   <tr>
//                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Employee</th>
//                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Original</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Amended</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Reason</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((record) => (
//                     <tr
//                       key={record.id}
//                       className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
//                     >
//                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
//                         <div>
//                           <div className="font-medium">{record.employee_name}</div>
//                           <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
//                             {record.employee_no}
//                           </div>
//                         </div>
//                       </td>
//                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
//                         {record.department_name}
//                       </td>
//                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A'}
//                       </td>
//                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         <div className="text-xs">
//                           <div>{record.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '--'}</div>
//                           <div>{record.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '--'}</div>
//                         </div>
//                       </td>
//                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         <div className="text-xs">
//                           <div>{record.new_check_in ? format(new Date(record.new_check_in), 'HH:mm') : '--'}</div>
//                           <div>{record.new_check_out ? format(new Date(record.new_check_out), 'HH:mm') : '--'}</div>
//                         </div>
//                       </td>
//                       <td className="text-center">
//                         <div className="flex flex-col gap-1 items-center">
//                           <span className={`badge badge-sm ${getStatusBadgeClass(record.old_status)}`}>
//                             {record.old_status}
//                           </span>
//                           <span className="text-xs">→</span>
//                           <span className={`badge badge-sm ${getStatusBadgeClass(record.new_status)}`}>
//                             {record.new_status}
//                           </span>
//                         </div>
//                       </td>
//                       <td className={`text-center text-xs ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//                         {record.reason || '--'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {total > limit && (
//               <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-700'}`}>
//                 <div className="flex items-center justify-between">
//                   <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//                     Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
//                   </span>
//                   <div className="join">
//                     <button
//                       className="join-item btn btn-sm"
//                       onClick={() => setPage(Math.max(1, page - 1))}
//                       disabled={page === 1 || isFetching}
//                     >
//                       Previous
//                     </button>
//                     <button className="join-item btn btn-sm btn-disabled">
//                       Page {page}
//                     </button>
//                     <button
//                       className="join-item btn btn-sm"
//                       onClick={() => setPage(page + 1)}
//                       disabled={page * limit >= total || isFetching}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="p-8 text-center">
//             <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
//               No amendment records found for the selected filters.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
import { useTheme } from '../../components/ThemeProvider';
import type { Filters } from '../../utils/attendanceApi';
import { format } from 'date-fns';

interface AmendRecord {
  id: number;
  employee_name: string;
  employee_no: string;
  department_name: string;
  company_name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  new_check_in: string;
  new_check_out: string;
  old_status: string;
  new_status: string;
  amended_by: string;
  amended_date: string;
  reason: string;
}

type CompanyOption = {
  id: number;
  name: string;
};

type DepartmentOption = {
  id: number;
  department_name: string;
};

interface AmendTabProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  user: any;
}

export default function AmendTab({
  filters,
  onFilterChange,
  onShowNotification,
  user
}: AmendTabProps) {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Multi-select state
  const [selectedCompanies, setSelectedCompanies] = useState<Set<number>>(new Set());
  const [selectedDepartments, setSelectedDepartments] = useState<Set<number>>(new Set());
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Fetch amend data
  const { data, total, isLoading, isFetching, error } = useAttendanceData<AmendRecord>(
    'amend',
    filters,
    page,
    limit
  );

  // Fetch filter options
  const { options: filterOptions } = useFilterOptions('all', filters.company_id, false);

  // ✅ Strongly-type options so `.map(company => ...)` / `.map(dept => ...)` are not `any`
  const companies = useMemo<CompanyOption[]>(() => {
    const raw = (filterOptions as any)?.companies;
    if (!Array.isArray(raw)) return [];
    return raw as CompanyOption[];
  }, [filterOptions]);

  const departments = useMemo<DepartmentOption[]>(() => {
    const raw = (filterOptions as any)?.departments;
    if (!Array.isArray(raw)) return [];
    return raw as DepartmentOption[];
  }, [filterOptions]);

  // Handle multi-select for companies
  const handleCompanyToggle = useCallback(
    (companyId: number) => {
      const newSelected = new Set(selectedCompanies);
      if (newSelected.has(companyId)) {
        newSelected.delete(companyId);
      } else {
        newSelected.add(companyId);
      }
      setSelectedCompanies(newSelected);
      onFilterChange({ company_id: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined });
      setPage(1);
    },
    [selectedCompanies, onFilterChange]
  );

  // Handle multi-select for departments
  const handleDepartmentToggle = useCallback(
    (deptId: number) => {
      const newSelected = new Set(selectedDepartments);
      if (newSelected.has(deptId)) {
        newSelected.delete(deptId);
      } else {
        newSelected.add(deptId);
      }
      setSelectedDepartments(newSelected);
      onFilterChange({ department_id: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined });
      setPage(1);
    },
    [selectedDepartments, onFilterChange]
  );

  // Handle multi-select for employees
  const handleEmployeeToggle = useCallback(
    (empId: number) => {
      const newSelected = new Set(selectedEmployees);
      if (newSelected.has(empId)) {
        newSelected.delete(empId);
      } else {
        newSelected.add(empId);
      }
      setSelectedEmployees(newSelected);
      onFilterChange({ employee_id: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined });
      setPage(1);
    },
    [selectedEmployees, onFilterChange]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: keyof Filters, value: any) => {
      onFilterChange({ [key]: value });
      setPage(1);
    },
    [onFilterChange]
  );

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return 'badge-success';
      case 'ABSENT':
        return 'badge-error';
      case 'LATE':
        return 'badge-warning';
      case 'PARTIAL':
        return 'badge-info';
      case 'OFFDAY':
        return 'badge-secondary';
      default:
        return 'badge-ghost';
    }
  };

  if (error) {
    return (
      <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
          Attendance Amendments
        </h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
          Review and manage attendance record amendments
        </p>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Multi-select Company Filter */}
          {companies.length > 0 && (
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                Companies
              </label>
              <div
                className={`border rounded-lg p-2 cursor-pointer ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      selectedCompanies.size > 0
                        ? theme === 'light'
                          ? 'text-gray-900'
                          : 'text-slate-100'
                        : theme === 'light'
                          ? 'text-gray-500'
                          : 'text-slate-400'
                    }`}
                  >
                    {selectedCompanies.size > 0 ? `${selectedCompanies.size} selected` : 'All Companies'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {showCompanyDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}>
                  <div className="max-h-48 overflow-y-auto p-2">
                    {companies.map((company) => (
                      <label key={company.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer rounded">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.has(company.id)}
                          onChange={() => handleCompanyToggle(company.id)}
                          className="checkbox checkbox-sm"
                        />
                        <span className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {company.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Multi-select Department Filter */}
          {departments.length > 0 && (
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                Departments
              </label>
              <div
                className={`border rounded-lg p-2 cursor-pointer ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}
                onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      selectedDepartments.size > 0
                        ? theme === 'light'
                          ? 'text-gray-900'
                          : 'text-slate-100'
                        : theme === 'light'
                          ? 'text-gray-500'
                          : 'text-slate-400'
                    }`}
                  >
                    {selectedDepartments.size > 0 ? `${selectedDepartments.size} selected` : 'All Departments'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {showDepartmentDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-700 border-slate-600'}`}>
                  <div className="max-h-48 overflow-y-auto p-2">
                    {departments.map((dept) => (
                      <label key={dept.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer rounded">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.has(dept.id)}
                          onChange={() => handleDepartmentToggle(dept.id)}
                          className="checkbox checkbox-sm"
                        />
                        <span className={`text-sm ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                          {dept.department_name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Start Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
              Start Date
            </label>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
              className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
            />
          </div>

          {/* End Date */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
              End Date
            </label>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
              className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
            />
          </div>
        </div>
      </div>

      {/* Amend Table */}
      <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="loading loading-spinner loading-lg mx-auto"></div>
            <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
              Loading amendment records...
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
                  <tr>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Employee</th>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Original</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Amended</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((record) => (
                    <tr
                      key={record.id}
                      className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
                    >
                      <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
                        <div>
                          <div className="font-medium">{record.employee_name}</div>
                          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                            {record.employee_no}
                          </div>
                        </div>
                      </td>
                      <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
                        {record.department_name}
                      </td>
                      <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        <div className="text-xs">
                          <div>{record.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '--'}</div>
                          <div>{record.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '--'}</div>
                        </div>
                      </td>
                      <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        <div className="text-xs">
                          <div>{record.new_check_in ? format(new Date(record.new_check_in), 'HH:mm') : '--'}</div>
                          <div>{record.new_check_out ? format(new Date(record.new_check_out), 'HH:mm') : '--'}</div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex flex-col gap-1 items-center">
                          <span className={`badge badge-sm ${getStatusBadgeClass(record.old_status)}`}>
                            {record.old_status}
                          </span>
                          <span className="text-xs">→</span>
                          <span className={`badge badge-sm ${getStatusBadgeClass(record.new_status)}`}>
                            {record.new_status}
                          </span>
                        </div>
                      </td>
                      <td className={`text-center text-xs ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                        {record.reason || '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
                  </span>
                  <div className="join">
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1 || isFetching}
                    >
                      Previous
                    </button>
                    <button className="join-item btn btn-sm btn-disabled">Page {page}</button>
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page * limit >= total || isFetching}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
              No amendment records found for the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
