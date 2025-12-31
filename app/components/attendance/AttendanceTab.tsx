// // // // // 'use client';

// // // // // import React, { useState, useCallback, useMemo } from 'react';
// // // // // import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
// // // // // import { useTheme } from '../../components/ThemeProvider';
// // // // // import type { Filters } from '../../utils/attendanceApi';
// // // // // import { format } from 'date-fns';

// // // // // interface AttendanceRecord {
// // // // //   id: number;
// // // // //   employee_name: string;
// // // // //   employee_no: string;
// // // // //   department_name: string;
// // // // //   company_name: string;
// // // // //   date: string;
// // // // //   checkIn: string;
// // // // //   checkOut: string;
// // // // //   status: string;
// // // // //   admin_comment?: string;
// // // // //   worked_hours?: string;
// // // // // }

// // // // // interface AttendanceTabProps {
// // // // //   filters: Filters;
// // // // //   onFilterChange: (filters: Partial<Filters>) => void;
// // // // //   onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
// // // // //   user: any;
// // // // // }

// // // // // export default function AttendanceTab({
// // // // //   filters,
// // // // //   onFilterChange,
// // // // //   onShowNotification,
// // // // //   user
// // // // // }: AttendanceTabProps) {
// // // // //   const { theme } = useTheme();
// // // // //   const [page, setPage] = useState(1);
// // // // //   const [limit] = useState(20);

// // // // //   // Fetch attendance data
// // // // //   const { data, total, isLoading, isFetching, error } = useAttendanceData<AttendanceRecord>(
// // // // //     'attendance',
// // // // //     filters,
// // // // //     page,
// // // // //     limit
// // // // //   );

// // // // //   // Fetch filter options
// // // // //   const { options: filterOptions } = useFilterOptions('all', filters.company_id, false);

// // // // //   // Handle filter changes
// // // // //   const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
// // // // //     onFilterChange({ [key]: value });
// // // // //     setPage(1);
// // // // //   }, [onFilterChange]);

// // // // //   // Get status badge color
// // // // //   const getStatusBadgeClass = (status: string) => {
// // // // //     switch (status?.toUpperCase()) {
// // // // //       case 'PRESENT':
// // // // //         return 'badge-success';
// // // // //       case 'ABSENT':
// // // // //         return 'badge-error';
// // // // //       case 'LATE':
// // // // //         return 'badge-warning';
// // // // //       case 'PARTIAL':
// // // // //         return 'badge-info';
// // // // //       case 'OFFDAY':
// // // // //         return 'badge-secondary';
// // // // //       default:
// // // // //         return 'badge-ghost';
// // // // //     }
// // // // //   };

// // // // //   if (error) {
// // // // //     return (
// // // // //       <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
// // // // //         <span>{error.message}</span>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div className="space-y-6">
// // // // //       {/* Header */}
// // // // //       <div className="flex flex-col gap-4">
// // // // //         <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
// // // // //           Attendance Records
// // // // //         </h2>
// // // // //         <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// // // // //           View and manage employee attendance records
// // // // //         </p>
// // // // //       </div>

// // // // //       {/* Filters */}
// // // // //       <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'}`}>
// // // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
// // // // //           {/* Company Filter */}
// // // // //           {filterOptions?.companies && (
// // // // //             <div>
// // // // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // // //                 Company
// // // // //               </label>
// // // // //               <select
// // // // //                 value={filters.company_id || ''}
// // // // //                 onChange={(e) => handleFilterChange('company_id', e.target.value || undefined)}
// // // // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // // //               >
// // // // //                 <option value="">All Companies</option>
// // // // //                 {filterOptions.companies.map(company => (
// // // // //                   <option key={company.id} value={company.id}>
// // // // //                     {company.name}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Department Filter */}
// // // // //           {filterOptions?.departments && (
// // // // //             <div>
// // // // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // // //                 Department
// // // // //               </label>
// // // // //               <select
// // // // //                 value={filters.department_id || ''}
// // // // //                 onChange={(e) => handleFilterChange('department_id', e.target.value || undefined)}
// // // // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // // //               >
// // // // //                 <option value="">All Departments</option>
// // // // //                 {filterOptions.departments.map(dept => (
// // // // //                   <option key={dept.id} value={dept.id}>
// // // // //                     {dept.department_name}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Status Filter */}
// // // // //           {filterOptions?.statuses && (
// // // // //             <div>
// // // // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // // //                 Status
// // // // //               </label>
// // // // //               <select
// // // // //                 value={filters.status || ''}
// // // // //                 onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
// // // // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // // //               >
// // // // //                 <option value="">All Statuses</option>
// // // // //                 {filterOptions.statuses.map(status => (
// // // // //                   <option key={status.id} value={status.id}>
// // // // //                     {status.name}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Start Date */}
// // // // //           <div>
// // // // //             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // // //               Start Date
// // // // //             </label>
// // // // //             <input
// // // // //               type="date"
// // // // //               value={filters.start_date || ''}
// // // // //               onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
// // // // //               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // // //             />
// // // // //           </div>

// // // // //           {/* End Date */}
// // // // //           <div>
// // // // //             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // // //               End Date
// // // // //             </label>
// // // // //             <input
// // // // //               type="date"
// // // // //               value={filters.end_date || ''}
// // // // //               onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
// // // // //               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // // //             />
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Attendance Table */}
// // // // //       <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // // // //         {isLoading ? (
// // // // //           <div className="p-8 text-center">
// // // // //             <div className="loading loading-spinner loading-lg mx-auto"></div>
// // // // //             <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// // // // //               Loading attendance records...
// // // // //             </p>
// // // // //           </div>
// // // // //         ) : data && data.length > 0 ? (
// // // // //           <>
// // // // //             <div className="overflow-x-auto">
// // // // //               <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // // // //                 <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
// // // // //                   <tr>
// // // // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Employee</th>
// // // // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
// // // // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Company</th>
// // // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
// // // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check In</th>
// // // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check Out</th>
// // // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
// // // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Worked Hours</th>
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {data.map((record) => (
// // // // //                     <tr
// // // // //                       key={record.id}
// // // // //                       className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
// // // // //                     >
// // // // //                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // // // //                         <div>
// // // // //                           <div className="font-medium">{record.employee_name}</div>
// // // // //                           <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
// // // // //                             {record.employee_no}
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       </td>
// // // // //                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // // // //                         {record.department_name}
// // // // //                       </td>
// // // // //                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // // // //                         {record.company_name}
// // // // //                       </td>
// // // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // // //                         {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A'}
// // // // //                       </td>
// // // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // // //                         {record.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '--'}
// // // // //                       </td>
// // // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // // //                         {record.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '--'}
// // // // //                       </td>
// // // // //                       <td className="text-center">
// // // // //                         <span className={`badge ${getStatusBadgeClass(record.status)}`}>
// // // // //                           {record.status}
// // // // //                         </span>
// // // // //                       </td>
// // // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // // //                         {record.worked_hours || '--'}
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                 </tbody>
// // // // //               </table>
// // // // //             </div>

// // // // //             {/* Pagination */}
// // // // //             {total > limit && (
// // // // //               <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-700'}`}>
// // // // //                 <div className="flex items-center justify-between">
// // // // //                   <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// // // // //                     Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
// // // // //                   </span>
// // // // //                   <div className="join">
// // // // //                     <button
// // // // //                       className="join-item btn btn-sm"
// // // // //                       onClick={() => setPage(Math.max(1, page - 1))}
// // // // //                       disabled={page === 1 || isFetching}
// // // // //                     >
// // // // //                       Previous
// // // // //                     </button>
// // // // //                     <button className="join-item btn btn-sm btn-disabled">
// // // // //                       Page {page}
// // // // //                     </button>
// // // // //                     <button
// // // // //                       className="join-item btn btn-sm"
// // // // //                       onClick={() => setPage(page + 1)}
// // // // //                       disabled={page * limit >= total || isFetching}
// // // // //                     >
// // // // //                       Next
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             )}
// // // // //           </>
// // // // //         ) : (
// // // // //           <div className="p-8 text-center">
// // // // //             <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// // // // //               No attendance records found for the selected filters.
// // // // //             </p>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // 'use client';

// // // // import React, { useState, useCallback, useMemo } from 'react';
// // // // import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
// // // // import { useTheme } from '../../components/ThemeProvider';
// // // // import type { Filters } from '../../utils/attendanceApi';
// // // // import { format } from 'date-fns';

// // // // interface AttendanceRecord {
// // // //   id: number;
// // // //   employee_name: string;
// // // //   employee_no: string;
// // // //   department_name: string;
// // // //   company_name: string;
// // // //   date: string;
// // // //   checkIn: string;
// // // //   checkOut: string;
// // // //   status: string;
// // // //   admin_comment?: string;
// // // //   worked_hours?: string;
// // // // }

// // // // type CompanyOption = {
// // // //   id: number;
// // // //   name: string;
// // // // };

// // // // type DepartmentOption = {
// // // //   id: number;
// // // //   department_name: string;
// // // // };

// // // // type StatusOption = {
// // // //   id: string | number;
// // // //   name: string;
// // // // };

// // // // interface AttendanceTabProps {
// // // //   filters: Filters;
// // // //   onFilterChange: (filters: Partial<Filters>) => void;
// // // //   onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
// // // //   user: any;
// // // // }

// // // // export default function AttendanceTab({
// // // //   filters,
// // // //   onFilterChange,
// // // //   onShowNotification,
// // // //   user
// // // // }: AttendanceTabProps) {
// // // //   const { theme } = useTheme();
// // // //   const [page, setPage] = useState(1);
// // // //   const [limit] = useState(20);

// // // //   // Fetch attendance data
// // // //   const { data, total, isLoading, isFetching, error } = useAttendanceData<AttendanceRecord>(
// // // //     'attendance',
// // // //     filters,
// // // //     page,
// // // //     limit
// // // //   );

// // // //   // Fetch filter options
// // // //   const { options: filterOptions } = useFilterOptions('all', filters.company_id, false);

// // // //   // ✅ Strongly-type options so `.map(company => ...)` / `.map(dept => ...)` / `.map(status => ...)` are not `any`
// // // //   const companies = useMemo<CompanyOption[]>(() => {
// // // //     const raw = (filterOptions as any)?.companies;
// // // //     if (!Array.isArray(raw)) return [];
// // // //     return raw as CompanyOption[];
// // // //   }, [filterOptions]);

// // // //   const departments = useMemo<DepartmentOption[]>(() => {
// // // //     const raw = (filterOptions as any)?.departments;
// // // //     if (!Array.isArray(raw)) return [];
// // // //     return raw as DepartmentOption[];
// // // //   }, [filterOptions]);

// // // //   const statuses = useMemo<StatusOption[]>(() => {
// // // //     const raw = (filterOptions as any)?.statuses;
// // // //     if (!Array.isArray(raw)) return [];
// // // //     return raw as StatusOption[];
// // // //   }, [filterOptions]);

// // // //   // Handle filter changes
// // // //   const handleFilterChange = useCallback(
// // // //     (key: keyof Filters, value: any) => {
// // // //       onFilterChange({ [key]: value });
// // // //       setPage(1);
// // // //     },
// // // //     [onFilterChange]
// // // //   );

// // // //   // Get status badge color
// // // //   const getStatusBadgeClass = (status: string) => {
// // // //     switch (status?.toUpperCase()) {
// // // //       case 'PRESENT':
// // // //         return 'badge-success';
// // // //       case 'ABSENT':
// // // //         return 'badge-error';
// // // //       case 'LATE':
// // // //         return 'badge-warning';
// // // //       case 'PARTIAL':
// // // //         return 'badge-info';
// // // //       case 'OFFDAY':
// // // //         return 'badge-secondary';
// // // //       default:
// // // //         return 'badge-ghost';
// // // //     }
// // // //   };

// // // //   if (error) {
// // // //     return (
// // // //       <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
// // // //         <span>{error.message}</span>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       {/* Header */}
// // // //       <div className="flex flex-col gap-4">
// // // //         <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
// // // //           Attendance Records
// // // //         </h2>
// // // //         <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// // // //           View and manage employee attendance records
// // // //         </p>
// // // //       </div>

// // // //       {/* Filters */}
// // // //       <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'}`}>
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
// // // //           {/* Company Filter */}
// // // //           {companies.length > 0 && (
// // // //             <div>
// // // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // //                 Company
// // // //               </label>
// // // //               <select
// // // //                 value={filters.company_id || ''}
// // // //                 onChange={(e) => handleFilterChange('company_id', e.target.value || undefined)}
// // // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // //               >
// // // //                 <option value="">All Companies</option>
// // // //                 {companies.map((company) => (
// // // //                   <option key={company.id} value={company.id}>
// // // //                     {company.name}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>
// // // //           )}

// // // //           {/* Department Filter */}
// // // //           {departments.length > 0 && (
// // // //             <div>
// // // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // //                 Department
// // // //               </label>
// // // //               <select
// // // //                 value={filters.department_id || ''}
// // // //                 onChange={(e) => handleFilterChange('department_id', e.target.value || undefined)}
// // // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // //               >
// // // //                 <option value="">All Departments</option>
// // // //                 {departments.map((dept) => (
// // // //                   <option key={dept.id} value={dept.id}>
// // // //                     {dept.department_name}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>
// // // //           )}

// // // //           {/* Status Filter */}
// // // //           {statuses.length > 0 && (
// // // //             <div>
// // // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // //                 Status
// // // //               </label>
// // // //               <select
// // // //                 value={filters.status || ''}
// // // //                 onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
// // // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // //               >
// // // //                 <option value="">All Statuses</option>
// // // //                 {statuses.map((status) => (
// // // //                   <option key={String(status.id)} value={status.id}>
// // // //                     {status.name}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>
// // // //           )}

// // // //           {/* Start Date */}
// // // //           <div>
// // // //             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // //               Start Date
// // // //             </label>
// // // //             <input
// // // //               type="date"
// // // //               value={filters.start_date || ''}
// // // //               onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
// // // //               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // //             />
// // // //           </div>

// // // //           {/* End Date */}
// // // //           <div>
// // // //             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // // //               End Date
// // // //             </label>
// // // //             <input
// // // //               type="date"
// // // //               value={filters.end_date || ''}
// // // //               onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
// // // //               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // //             />
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Attendance Table */}
// // // //       <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // // //         {isLoading ? (
// // // //           <div className="p-8 text-center">
// // // //             <div className="loading loading-spinner loading-lg mx-auto"></div>
// // // //             <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// // // //               Loading attendance records...
// // // //             </p>
// // // //           </div>
// // // //         ) : data && data.length > 0 ? (
// // // //           <>
// // // //             <div className="overflow-x-auto">
// // // //               <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // // //                 <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
// // // //                   <tr>
// // // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Employee</th>
// // // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
// // // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Company</th>
// // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
// // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check In</th>
// // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check Out</th>
// // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
// // // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Worked Hours</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {data.map((record) => (
// // // //                     <tr
// // // //                       key={record.id}
// // // //                       className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
// // // //                     >
// // // //                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // // //                         <div>
// // // //                           <div className="font-medium">{record.employee_name}</div>
// // // //                           <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
// // // //                             {record.employee_no}
// // // //                           </div>
// // // //                         </div>
// // // //                       </td>
// // // //                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // // //                         {record.department_name}
// // // //                       </td>
// // // //                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // // //                         {record.company_name}
// // // //                       </td>
// // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // //                         {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A'}
// // // //                       </td>
// // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // //                         {record.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '--'}
// // // //                       </td>
// // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // //                         {record.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '--'}
// // // //                       </td>
// // // //                       <td className="text-center">
// // // //                         <span className={`badge ${getStatusBadgeClass(record.status)}`}>
// // // //                           {record.status}
// // // //                         </span>
// // // //                       </td>
// // // //                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // // //                         {record.worked_hours || '--'}
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>

// // // //             {/* Pagination */}
// // // //             {total > limit && (
// // // //               <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-700'}`}>
// // // //                 <div className="flex items-center justify-between">
// // // //                   <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// // // //                     Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
// // // //                   </span>
// // // //                   <div className="join">
// // // //                     <button
// // // //                       className="join-item btn btn-sm"
// // // //                       onClick={() => setPage(Math.max(1, page - 1))}
// // // //                       disabled={page === 1 || isFetching}
// // // //                     >
// // // //                       Previous
// // // //                     </button>
// // // //                     <button className="join-item btn btn-sm btn-disabled">
// // // //                       Page {page}
// // // //                     </button>
// // // //                     <button
// // // //                       className="join-item btn btn-sm"
// // // //                       onClick={() => setPage(page + 1)}
// // // //                       disabled={page * limit >= total || isFetching}
// // // //                     >
// // // //                       Next
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </>
// // // //         ) : (
// // // //           <div className="p-8 text-center">
// // // //             <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// // // //               No attendance records found for the selected filters.
// // // //             </p>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }


// // // 'use client';

// // // import React, { useState, useCallback, useMemo } from 'react';
// // // import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
// // // import { useTheme } from '../../components/ThemeProvider';
// // // import type { Filters } from '../../utils/attendanceApi';
// // // import { format } from 'date-fns';

// // // type CompanyOption = {
// // //   id: number;
// // //   name: string;
// // // };

// // // type DepartmentOption = {
// // //   id: number;
// // //   department_name: string;
// // // };

// // // type StatusOption = {
// // //   id: string | number;
// // //   name: string;
// // // };

// // // interface AttendanceRecordFlat {
// // //   employee_name: string;
// // //   employee_no: string;
// // //   company_name: string;
// // //   department: string | null;
// // //   position: string | null;

// // //   attendance_date: string | null;

// // //   check_in_time: string | null;
// // //   check_out_time: string | null;

// // //   first_check_in_time_local_iso: string | null;
// // //   last_check_out_time_local_iso: string | null;

// // //   daily_worked_hours: string | null;
// // //   daily_worked_hours_decimal: string | null;
// // //   daily_worked_hours_minutes: number | null;

// // //   worked_hours: string | null;
// // //   worked_hours_decimal: string | null;
// // //   worked_hours_minutes: number | null;

// // //   status: string;

// // //   attendance_day_id: number;
// // //   employee_id: number;

// // //   amend_date: string | null;
// // //   amend_by: string | null;

// // //   employee_timezone: string | null;
// // //   pair_number: number | null;

// // //   check_in_ip: string | null;
// // //   check_in_public_ip: string | null;
// // //   check_in_ip_match_status: string | null;
// // //   check_in_ip_policy_mode: string | null;

// // //   check_out_ip: string | null;
// // //   check_out_public_ip: string | null;
// // //   check_out_ip_match_status: string | null;
// // //   check_out_ip_policy_mode: string | null;

// // //   has_issue: boolean | null;
// // //   office_name: string | null;
// // //   whitelisted_cidr: string | null;

// // //   // These are in your UI snippet but may not be returned yet.
// // //   // Keep them optional so UI won’t crash.
// // //   check_in_ip_used_override?: boolean | null;
// // //   check_in_ip_matched_rule?: string | null;

// // //   check_out_ip_used_override?: boolean | null;
// // //   check_out_ip_matched_rule?: string | null;

// // //   employee_override_ip?: string | null;
// // //   employee_override_active?: boolean | null;
// // //   employee_override_label?: string | null;
// // // }

// // // interface AttendanceTabProps {
// // //   filters: Filters;
// // //   onFilterChange: (filters: Partial<Filters>) => void;
// // //   onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
// // //   user: any;
// // // }

// // // function safeFormatDate(dateStr?: string | null, fmt: string = 'MMM dd, yyyy') {
// // //   if (!dateStr) return 'N/A';
// // //   const d = new Date(dateStr);
// // //   if (isNaN(d.getTime())) return 'N/A';
// // //   return format(d, fmt);
// // // }

// // // function safeFormatTime(dateStr?: string | null, fmt: string = 'HH:mm') {
// // //   if (!dateStr) return '--';
// // //   const d = new Date(dateStr);
// // //   if (isNaN(d.getTime())) return '--';
// // //   return format(d, fmt);
// // // }

// // // function getIPStatusDisplay(status?: string | null) {
// // //   if (!status) return 'Unknown';
// // //   switch (status) {
// // //     case 'IN_WHITELIST':
// // //       return 'In Whitelist';
// // //     case 'NOT_IN_WHITELIST':
// // //       return 'Not Whitelist';
// // //     case 'NO_IP':
// // //       return 'No IP';
// // //     case 'NO_EVENT':
// // //       return 'No Event';
// // //     default:
// // //       return status;
// // //   }
// // // }

// // // export default function AttendanceTab({
// // //   filters,
// // //   onFilterChange,
// // //   onShowNotification,
// // //   user
// // // }: AttendanceTabProps) {
// // //   const { theme } = useTheme();
// // //   const [page, setPage] = useState(1);
// // //   const [limit] = useState(20);

// // //   // Fetch attendance data
// // //   const { data, total, isLoading, isFetching, error } = useAttendanceData<AttendanceRecordFlat>(
// // //     'attendance',
// // //     filters,
// // //     page,
// // //     limit
// // //   );

// // //   // Fetch filter options
// // //   const { options: filterOptions } = useFilterOptions('all', filters.company_id, false);

// // //   const companies = useMemo<CompanyOption[]>(() => {
// // //     const raw = (filterOptions as any)?.companies;
// // //     if (!Array.isArray(raw)) return [];
// // //     return raw as CompanyOption[];
// // //   }, [filterOptions]);

// // //   const departments = useMemo<DepartmentOption[]>(() => {
// // //     const raw = (filterOptions as any)?.departments;
// // //     if (!Array.isArray(raw)) return [];
// // //     return raw as DepartmentOption[];
// // //   }, [filterOptions]);

// // //   const statuses = useMemo<StatusOption[]>(() => {
// // //     const raw = (filterOptions as any)?.statuses;
// // //     if (!Array.isArray(raw)) return [];
// // //     return raw as StatusOption[];
// // //   }, [filterOptions]);

// // //   const handleFilterChange = useCallback(
// // //     (key: keyof Filters, value: any) => {
// // //       onFilterChange({ [key]: value });
// // //       setPage(1);
// // //     },
// // //     [onFilterChange]
// // //   );

// // //   const getStatusBadgeClass = (status: string) => {
// // //     switch (status?.toUpperCase()) {
// // //       case 'PRESENT':
// // //         return 'badge-success';
// // //       case 'ABSENT':
// // //         return 'badge-error';
// // //       case 'LATE':
// // //         return 'badge-warning';
// // //       case 'PARTIAL':
// // //         return 'badge-info';
// // //       case 'OFFDAY':
// // //         return 'badge-secondary';
// // //       default:
// // //         return 'badge-ghost';
// // //     }
// // //   };

// // //   if (error) {
// // //     return (
// // //       <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
// // //         <span>{error.message}</span>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Header */}
// // //       <div className="flex flex-col gap-4">
// // //         <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
// // //           Attendance Records
// // //         </h2>
// // //         <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// // //           View and manage employee attendance records
// // //         </p>
// // //       </div>

// // //       {/* Filters */}
// // //       <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'}`}>
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
// // //           {/* Company Filter */}
// // //           {companies.length > 0 && (
// // //             <div>
// // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // //                 Company
// // //               </label>
// // //               <select
// // //                 value={filters.company_id || ''}
// // //                 onChange={(e) => handleFilterChange('company_id', e.target.value || undefined)}
// // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // //               >
// // //                 <option value="">All Companies</option>
// // //                 {companies.map((company) => (
// // //                   <option key={company.id} value={company.id}>
// // //                     {company.name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           )}

// // //           {/* Department Filter */}
// // //           {departments.length > 0 && (
// // //             <div>
// // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // //                 Department
// // //               </label>
// // //               <select
// // //                 value={filters.department_id || ''}
// // //                 onChange={(e) => handleFilterChange('department_id', e.target.value || undefined)}
// // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // //               >
// // //                 <option value="">All Departments</option>
// // //                 {departments.map((dept: any) => (
// // //                   <option key={dept.id} value={dept.id}>
// // //                     {dept.department_name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           )}

// // //           {/* Status Filter */}
// // //           {statuses.length > 0 && (
// // //             <div>
// // //               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // //                 Status
// // //               </label>
// // //               <select
// // //                 value={filters.status || ''}
// // //                 onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
// // //                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // //               >
// // //                 <option value="">All Statuses</option>
// // //                 {statuses.map((status) => (
// // //                   <option key={String(status.id)} value={status.id}>
// // //                     {status.name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           )}

// // //           {/* Start Date */}
// // //           <div>
// // //             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // //               Start Date
// // //             </label>
// // //             <input
// // //               type="date"
// // //               value={filters.start_date || ''}
// // //               onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
// // //               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // //             />
// // //           </div>

// // //           {/* End Date */}
// // //           <div>
// // //             <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// // //               End Date
// // //             </label>
// // //             <input
// // //               type="date"
// // //               value={filters.end_date || ''}
// // //               onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
// // //               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // //             />
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Attendance Table */}
// // //       <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // //         {isLoading ? (
// // //           <div className="p-8 text-center">
// // //             <div className="loading loading-spinner loading-lg mx-auto"></div>
// // //             <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// // //               Loading attendance records...
// // //             </p>
// // //           </div>
// // //         ) : data && data.length > 0 ? (
// // //           <>
// // //             <div className="overflow-x-auto">
// // //               <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// // //                 <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
// // //                   <tr>
// // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Employee</th>
// // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
// // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Position</th>
// // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Company</th>

// // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
// // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check In</th>
// // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check Out</th>

// // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
// // //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Worked Hours</th>

// // //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-in IP Details</th>
// // //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-out IP Details</th>

// // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Office</th>
// // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Whitelist CIDR</th>
// // //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Timezone</th>
// // //                   </tr>
// // //                 </thead>

// // //                 <tbody>
// // //                   {data.map((item) => {
// // //                     const checkInISO = item.first_check_in_time_local_iso || item.check_in_time;
// // //                     const checkOutISO = item.last_check_out_time_local_iso || item.check_out_time;

// // //                     const worked = item.daily_worked_hours || item.worked_hours || '--';

// // //                     return (
// // //                       <tr
// // //                         key={item.attendance_day_id || `${item.employee_id}-${item.attendance_date}-${item.pair_number || 1}`}
// // //                         className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
// // //                       >
// // //                         {/* Employee */}
// // //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // //                           <div>
// // //                             <div className="font-medium">{item.employee_name}</div>
// // //                             <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
// // //                               {item.employee_no}
// // //                             </div>
// // //                           </div>
// // //                         </td>

// // //                         {/* Department */}
// // //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // //                           {item.department || '--'}
// // //                         </td>

// // //                         {/* Position */}
// // //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // //                           {item.position || '--'}
// // //                         </td>

// // //                         {/* Company */}
// // //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // //                           {item.company_name}
// // //                         </td>

// // //                         {/* Date */}
// // //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // //                           {safeFormatDate(item.attendance_date)}
// // //                         </td>

// // //                         {/* Check In */}
// // //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // //                           {safeFormatTime(checkInISO)}
// // //                         </td>

// // //                         {/* Check Out */}
// // //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // //                           {safeFormatTime(checkOutISO)}
// // //                         </td>

// // //                         {/* Status */}
// // //                         <td className="text-center">
// // //                           <span className={`badge ${getStatusBadgeClass(item.status)}`}>
// // //                             {item.status}
// // //                           </span>
// // //                           {item.has_issue ? <div className="text-xs mt-1 text-warning">Issue</div> : null}
// // //                         </td>

// // //                         {/* Worked Hours */}
// // //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
// // //                           {worked}
// // //                         </td>

// // //                         {/* Check-in IP Details */}
// // //                         <td>
// // //                           {item.check_in_ip || item.check_in_public_ip ? (
// // //                             <div className="text-xs space-y-1">
// // //                               {item.check_in_public_ip && (
// // //                                 <div>
// // //                                   <span className="font-medium">Public: </span>
// // //                                   <span className="font-mono">{item.check_in_public_ip}</span>
// // //                                 </div>
// // //                               )}

// // //                               {item.check_in_ip_match_status && (
// // //                                 <div className="space-y-1 mt-1">
// // //                                   <div className="flex items-center gap-1 flex-wrap">
// // //                                     <span
// // //                                       className={`badge badge-xs ${
// // //                                         item.check_in_ip_match_status === 'IN_WHITELIST'
// // //                                           ? 'badge-success'
// // //                                           : item.check_in_ip_match_status === 'NOT_IN_WHITELIST'
// // //                                           ? 'badge-error'
// // //                                           : item.check_in_ip_match_status === 'NO_IP'
// // //                                           ? 'badge-warning'
// // //                                           : item.check_in_ip_match_status === 'NO_EVENT'
// // //                                           ? 'badge-neutral'
// // //                                           : 'badge-warning'
// // //                                       }`}
// // //                                     >
// // //                                       {getIPStatusDisplay(item.check_in_ip_match_status)}
// // //                                     </span>

// // //                                     {item.check_in_ip_used_override ? (
// // //                                       <span className="badge badge-xs badge-info">Override</span>
// // //                                     ) : null}
// // //                                   </div>

// // //                                   {item.check_in_ip_matched_rule ? (
// // //                                     <div
// // //                                       className="text-xs opacity-70 truncate cursor-help"
// // //                                       title={item.check_in_ip_matched_rule}
// // //                                     >
// // //                                       {item.check_in_ip_matched_rule}
// // //                                     </div>
// // //                                   ) : null}
// // //                                 </div>
// // //                               )}

// // //                               {item.check_in_ip_policy_mode && (
// // //                                 <div className="text-xs opacity-70">
// // //                                   Policy: {item.check_in_ip_policy_mode}
// // //                                 </div>
// // //                               )}

// // //                               {item.employee_override_ip && item.employee_override_active ? (
// // //                                 <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
// // //                                   Override: {item.employee_override_ip}
// // //                                   {item.employee_override_label ? ` (${item.employee_override_label})` : ''}
// // //                                 </div>
// // //                               ) : null}
// // //                             </div>
// // //                           ) : (
// // //                             <span className="text-xs text-gray-500">No IP data</span>
// // //                           )}
// // //                         </td>

// // //                         {/* Check-out IP Details */}
// // //                         <td>
// // //                           {item.check_out_ip || item.check_out_public_ip ? (
// // //                             <div className="text-xs space-y-1">
// // //                               {item.check_out_public_ip && (
// // //                                 <div>
// // //                                   <span className="font-medium">Public: </span>
// // //                                   <span className="font-mono">{item.check_out_public_ip}</span>
// // //                                 </div>
// // //                               )}

// // //                               {item.check_out_ip_match_status && (
// // //                                 <div className="space-y-1 mt-1">
// // //                                   <div className="flex items-center gap-1 flex-wrap">
// // //                                     <span
// // //                                       className={`badge badge-xs ${
// // //                                         item.check_out_ip_match_status === 'IN_WHITELIST'
// // //                                           ? 'badge-success'
// // //                                           : item.check_out_ip_match_status === 'NOT_IN_WHITELIST'
// // //                                           ? 'badge-error'
// // //                                           : item.check_out_ip_match_status === 'NO_IP'
// // //                                           ? 'badge-warning'
// // //                                           : item.check_out_ip_match_status === 'NO_EVENT'
// // //                                           ? 'badge-neutral'
// // //                                           : 'badge-warning'
// // //                                       }`}
// // //                                     >
// // //                                       {getIPStatusDisplay(item.check_out_ip_match_status)}
// // //                                     </span>

// // //                                     {item.check_out_ip_used_override ? (
// // //                                       <span className="badge badge-xs badge-info">Override</span>
// // //                                     ) : null}
// // //                                   </div>

// // //                                   {item.check_out_ip_matched_rule ? (
// // //                                     <div
// // //                                       className="text-xs opacity-70 truncate cursor-help"
// // //                                       title={item.check_out_ip_matched_rule}
// // //                                     >
// // //                                       {item.check_out_ip_matched_rule}
// // //                                     </div>
// // //                                   ) : null}
// // //                                 </div>
// // //                               )}

// // //                               {item.check_out_ip_policy_mode && (
// // //                                 <div className="text-xs opacity-70">
// // //                                   Policy: {item.check_out_ip_policy_mode}
// // //                                 </div>
// // //                               )}

// // //                               {item.employee_override_ip && item.employee_override_active ? (
// // //                                 <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
// // //                                   Override: {item.employee_override_ip}
// // //                                   {item.employee_override_label ? ` (${item.employee_override_label})` : ''}
// // //                                 </div>
// // //                               ) : null}
// // //                             </div>
// // //                           ) : (
// // //                             <span className="text-xs text-gray-500">No IP data</span>
// // //                           )}
// // //                         </td>

// // //                         {/* Office */}
// // //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // //                           {item.office_name || '--'}
// // //                         </td>

// // //                         {/* Whitelisted CIDR */}
// // //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // //                           {item.whitelisted_cidr || '--'}
// // //                         </td>

// // //                         {/* Timezone */}
// // //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// // //                           {item.employee_timezone || '--'}
// // //                         </td>
// // //                       </tr>
// // //                     );
// // //                   })}
// // //                 </tbody>
// // //               </table>
// // //             </div>

// // //             {/* Pagination */}
// // //             {total > limit && (
// // //               <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-700'}`}>
// // //                 <div className="flex items-center justify-between">
// // //                   <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// // //                     Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
// // //                   </span>
// // //                   <div className="join">
// // //                     <button
// // //                       className="join-item btn btn-sm"
// // //                       onClick={() => setPage(Math.max(1, page - 1))}
// // //                       disabled={page === 1 || isFetching}
// // //                     >
// // //                       Previous
// // //                     </button>
// // //                     <button className="join-item btn btn-sm btn-disabled">
// // //                       Page {page}
// // //                     </button>
// // //                     <button
// // //                       className="join-item btn btn-sm"
// // //                       onClick={() => setPage(page + 1)}
// // //                       disabled={page * limit >= total || isFetching}
// // //                     >
// // //                       Next
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </>
// // //         ) : (
// // //           <div className="p-8 text-center">
// // //             <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// // //               No attendance records found for the selected filters.
// // //             </p>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // 'use client';

// // import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
// // import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
// // import { useTheme } from '../../components/ThemeProvider';
// // import type { Filters as BaseFilters } from '../../utils/attendanceApi';
// // import { format } from 'date-fns';
// // import { FaChevronDown, FaRegCalendarTimes } from "react-icons/fa";
// // import { BsCheckCircle, BsXCircle, BsEye } from "react-icons/bs";
// // import { API_BASE_URL } from '@/app/config';

// // // --- Interfaces ---

// // interface FilterOptionItem {
// //   id: string | number;
// //   name: string;
// // }

// // interface Filters {
// //   employee_status: string[];
// //   company_id: string[];
// //   department_id: string[];
// //   position: string[];
// //   type: string[];
// //   nationality: string[];
// //   jobLevel: string[];
// //   employee_id: string[];
// //   status: string[];
// //   start_date: string;
// //   end_date: string;
// //   search: string;
// // }

// // type CompanyOption = {
// //   id: number;
// //   name: string;
// // };

// // type DepartmentOption = {
// //   id: number;
// //   department_name: string;
// // };

// // type StatusOption = {
// //   id: string | number;
// //   name: string;
// // };

// // interface AttendanceRecordFlat {
// //   employee_name: string;
// //   employee_no: string;
// //   company_name: string;
// //   department: string | null;
// //   position: string | null;

// //   attendance_date: string | null;

// //   check_in_time: string | null;
// //   check_out_time: string | null;

// //   first_check_in_time_local_iso: string | null;
// //   last_check_out_time_local_iso: string | null;

// //   daily_worked_hours: string | null;
// //   daily_worked_hours_decimal: string | null;
// //   daily_worked_hours_minutes: number | null;

// //   worked_hours: string | null;
// //   worked_hours_decimal: string | null;
// //   worked_hours_minutes: number | null;

// //   status: string;

// //   attendance_day_id: number;
// //   employee_id: number;

// //   amend_date: string | null;
// //   amend_by: string | null;

// //   employee_timezone: string | null;
// //   pair_number: number | null;

// //   check_in_ip: string | null;
// //   check_in_public_ip: string | null;
// //   check_in_ip_match_status: string | null;
// //   check_in_ip_policy_mode: string | null;

// //   check_out_ip: string | null;
// //   check_out_public_ip: string | null;
// //   check_out_ip_match_status: string | null;
// //   check_out_ip_policy_mode: string | null;

// //   has_issue: boolean | null;
// //   office_name: string | null;
// //   whitelisted_cidr: string | null;

// //   check_in_ip_used_override?: boolean | null;
// //   check_in_ip_matched_rule?: string | null;

// //   check_out_ip_used_override?: boolean | null;
// //   check_out_ip_matched_rule?: string | null;

// //   employee_override_ip?: string | null;
// //   employee_override_active?: boolean | null;
// //   employee_override_label?: string | null;
// // }

// // interface AttendanceTabProps {
// //   filters: BaseFilters;
// //   onFilterChange: (filters: Partial<BaseFilters>) => void;
// //   onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
// //   user: any;
// // }

// // // --- Helper Components ---

// // const ProfessionalMultiSelectFilter = ({ 
// //   name, 
// //   value, 
// //   options, 
// //   onChange, 
// //   placeholder,
// //   displayTransform = (item: string | FilterOptionItem) => typeof item === 'string' ? item : item.name,
// //   theme = 'light'
// // }: { 
// //   name: keyof Filters;
// //   value: string[];
// //   options: (string | FilterOptionItem | undefined | null)[];
// //   onChange: (name: keyof Filters, value: string[]) => void;
// //   placeholder: string;
// //   displayTransform?: (item: string | FilterOptionItem) => string;
// //   theme?: 'light' | 'dark';
// // }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [clickedFromBottom, setClickedFromBottom] = useState<string | null>(null);
// //   const searchInputRef = useRef<HTMLInputElement>(null);
// //   const modalRef = useRef<HTMLDivElement>(null);
// //   const optionsContainerRef = useRef<HTMLDivElement>(null);

// //   const validOptions = useMemo(() => {
// //     return options
// //       .filter((option): option is string | FilterOptionItem => 
// //         option !== undefined && option !== null && option !== ''
// //       )
// //       .map(option => {
// //         if (typeof option === 'string') {
// //           return { id: option, name: option };
// //         }
// //         return {
// //           id: String(option.id),
// //           name: String(option.name || option.id)
// //         };
// //       });
// //   }, [options]);

// //   const optionMap = useMemo(() => {
// //     const map = new Map<string, string>();
// //     validOptions.forEach(option => {
// //       const displayName = displayTransform({ id: option.id, name: option.name });
// //       map.set(option.id, displayName);
// //     });
// //     return map;
// //   }, [validOptions, displayTransform]);

// //   const filteredOptions = useMemo(() => {
// //     if (!searchTerm) return validOptions;
// //     return validOptions.filter(option => {
// //       const displayName = optionMap.get(option.id) || option.name;
// //       return displayName.toLowerCase().includes(searchTerm.toLowerCase());
// //     });
// //   }, [validOptions, searchTerm, optionMap]);

// //   const handleToggle = useCallback((optionId: string, event: React.MouseEvent) => {
// //     event.preventDefault();
// //     event.stopPropagation();
    
// //     const newValue = value.includes(optionId)
// //       ? value.filter(v => v !== optionId)
// //       : [...value, optionId];
    
// //     onChange(name, newValue);
// //     setClickedFromBottom(optionId);
// //   }, [value, name, onChange]);

// //   const handleSelectAll = useCallback(() => {
// //     const allIds = validOptions.map(option => option.id);
// //     onChange(name, allIds);
// //   }, [validOptions, name, onChange]);

// //   const handleClear = useCallback(() => {
// //     onChange(name, []);
// //   }, [name, onChange]);

// //   const selectedPercentage = validOptions.length > 0 
// //     ? Math.round((value.length / validOptions.length) * 100) 
// //     : 0;

// //   const handleApply = useCallback(() => {
// //     setIsOpen(false);
// //     setSearchTerm('');
// //     setClickedFromBottom(null);
// //   }, []);

// //   useEffect(() => {
// //     if (isOpen && searchInputRef.current) {
// //       setTimeout(() => {
// //         searchInputRef.current?.focus();
// //       }, 100);
// //     }
// //   }, [isOpen]);

// //   useEffect(() => {
// //     if (isOpen) {
// //       document.body.style.overflow = 'hidden';
// //     } else {
// //       document.body.style.overflow = 'unset';
// //     }
    
// //     return () => {
// //       document.body.style.overflow = 'unset';
// //     };
// //   }, [isOpen]);

// //   useEffect(() => {
// //     if (clickedFromBottom && optionsContainerRef.current) {
// //       const clickedElement = document.getElementById(`option-${clickedFromBottom}`);
// //       if (clickedElement) {
// //         clickedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
// //       }
// //     }
// //   }, [clickedFromBottom]);

// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
// //         handleApply();
// //       }
// //     };

// //     if (isOpen) {
// //       document.addEventListener('mousedown', handleClickOutside);
// //       return () => {
// //         document.removeEventListener('mousedown', handleClickOutside);
// //       };
// //     }
// //   }, [isOpen, handleApply]);

// //   const renderSelectedItems = () => {
// //     if (value.length === 0) {
// //       return (
// //         <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
// //           Select {placeholder.toLowerCase()}...
// //         </span>
// //       );
// //     }

// //     return (
// //       <div className="flex flex-wrap gap-2">
// //         {value.slice(0, 2).map(val => {
// //           const displayName = optionMap.get(val) || val;
// //           return (
// //             <span 
// //               key={`selected-${val}`}
// //               className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
// //             >
// //               {displayName}
// //             </span>
// //           );
// //         })}
// //         {value.length > 2 && (
// //           <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
// //             +{value.length - 2} more
// //           </span>
// //         )}
// //       </div>
// //     );
// //   };

// //   return (
// //     <>
// //       <div className="form-control w-full">
// //         <label className="label pb-3">
// //           <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //             {placeholder}
// //           </span>
// //         </label>
        
// //         <button
// //           onClick={() => setIsOpen(true)}
// //           className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
// //             theme === 'light' 
// //               ? 'bg-white border-slate-200 hover:border-slate-300' 
// //               : 'bg-slate-800 border-slate-600 hover:border-slate-500'
// //           } ${
// //             value.length > 0 
// //               ? 'border-blue-500 bg-blue-50 shadow-sm' 
// //               : ''
// //           }`}
// //           type="button"
// //           aria-haspopup="dialog"
// //           aria-expanded={isOpen}
// //         >
// //           <div className="flex flex-col items-start flex-1 min-w-0">
// //             {renderSelectedItems()}
// //           </div>
          
// //           <div className="flex items-center gap-3 flex-shrink-0 ml-4">
// //             {value.length > 0 && (
// //               <div className="flex flex-col items-end">
// //                 <span className="text-sm font-semibold text-blue-600">{value.length} selected</span>
// //                 <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
// //                   <div 
// //                     className="h-full bg-blue-500 transition-all duration-300"
// //                     style={{ width: `${selectedPercentage}%` }}
// //                   />
// //                 </div>
// //               </div>
// //             )}
// //             <div className={`w-2 h-2 border-r-2 border-b-2 border-slate-400 transform transition-transform duration-200 ${
// //               isOpen ? 'rotate-45 -translate-y-0.5' : '-rotate-45 translate-y-0.5'
// //             }`} />
// //           </div>
// //         </button>
// //       </div>

// //       {isOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
// //           <div 
// //             className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
// //             onClick={handleApply}
// //             aria-hidden="true"
// //           />
          
// //           <div 
// //             ref={modalRef}
// //             className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden z-10"
// //           >
// //             <div className="flex items-center justify-between p-6 border-b bg-white">
// //               <div>
// //                 <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
// //                 <p className="text-sm text-slate-600 mt-1">
// //                   Choose multiple options to filter your results
// //                 </p>
// //               </div>
// //               <button 
// //                 onClick={handleApply}
// //                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
// //                 type="button"
// //                 aria-label="Close modal"
// //               >
// //                 <div className="w-4 h-4 relative">
// //                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform -rotate-45" />
// //                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform rotate-45" />
// //                 </div>
// //               </button>
// //             </div>

// //             <div className="p-4 border-b bg-slate-50">
// //               <div className="flex items-center gap-3 mb-3">
// //                 <div className="form-control flex-1">
// //                   <input
// //                     ref={searchInputRef}
// //                     type="text"
// //                     placeholder={`Search ${placeholder.toLowerCase()}...`}
// //                     className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     aria-label={`Search ${placeholder}`}
// //                   />
// //                 </div>
// //               </div>

// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-3">
// //                   <div className="text-sm text-slate-600">
// //                     <span className="font-semibold">{value.length}</span> of{' '}
// //                     <span className="font-semibold">{validOptions.length}</span> selected
// //                   </div>
// //                   <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
// //                     <div 
// //                       className="h-full bg-green-500 transition-all duration-500"
// //                       style={{ width: `${selectedPercentage}%` }}
// //                     />
// //                   </div>
// //                 </div>
                
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={handleSelectAll}
// //                     className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                     disabled={value.length === validOptions.length}
// //                     type="button"
// //                   >
// //                     Select All
// //                   </button>
// //                   {value.length > 0 && (
// //                     <button
// //                       onClick={handleClear}
// //                       className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
// //                       type="button"
// //                     >
// //                       Clear All
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             <div 
// //               ref={optionsContainerRef}
// //               className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] bg-white"
// //               onScroll={() => setClickedFromBottom(null)}
// //             >
// //               {filteredOptions.length === 0 ? (
// //                 <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
// //                   <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
// //                     <div className="w-6 h-0.5 bg-slate-400 rotate-45 absolute" />
// //                     <div className="w-6 h-0.5 bg-slate-400 -rotate-45 absolute" />
// //                   </div>
// //                   <h4 className="font-semibold text-slate-700 mb-2">No options found</h4>
// //                   <p className="text-slate-500 text-sm">
// //                     {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
// //                   </p>
// //                 </div>
// //               ) : (
// //                 <div className="p-4 space-y-2">
// //                   {filteredOptions.map((option) => {
// //                     const displayName = optionMap.get(option.id) || option.name;
// //                     const isSelected = value.includes(option.id);
                    
// //                     return (
// //                       <div
// //                         key={`${name}-${option.id}`}
// //                         id={`option-${option.id}`}
// //                         className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
// //                           isSelected
// //                             ? 'bg-blue-50 border-blue-200 shadow-sm'
// //                             : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
// //                         }`}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           handleToggle(option.id, e);
// //                         }}
// //                         role="checkbox"
// //                         aria-checked={isSelected}
// //                         tabIndex={0}
// //                       >
// //                         <div 
// //                           className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
// //                             isSelected 
// //                               ? 'bg-blue-600 border-blue-600' 
// //                               : 'border-slate-300 bg-white'
// //                           }`}
// //                         >
// //                           {isSelected && (
// //                             <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
// //                             </svg>
// //                           )}
// //                         </div>
// //                         <div className="flex-1 min-w-0">
// //                           <span className="font-medium text-slate-800 break-words">
// //                             {displayName}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     );
// //                   })}
// //                   <div className="h-4" />
// //                 </div>
// //               )}
// //             </div>

// //             <div className="p-4 border-t bg-white">
// //               <div className="flex items-center justify-between">
// //                 <div className="text-sm text-slate-600">
// //                   <span className="font-medium">{value.length}</span> options selected
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={handleApply}
// //                     className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
// //                     type="button"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     onClick={handleApply}
// //                     className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
// //                     type="button"
// //                   >
// //                     Apply
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // const DateRangeFilter = ({
// //   title,
// //   startDate,
// //   endDate,
// //   onStartChange,
// //   onEndChange,
// //   onClear,
// //   theme = 'light'
// // }: {
// //   title: string;
// //   startDate: string;
// //   endDate: string;
// //   onStartChange: (date: string) => void;
// //   onEndChange: (date: string) => void;
// //   onClear: () => void;
// //   theme?: 'light' | 'dark';
// // }) => {
// //   return (
// //     <div className="form-control w-full">
// //       <label className="label pb-3">
// //         <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //           {title}
// //         </span>
// //       </label>
// //       <div className="flex gap-2 items-center">
// //         <input
// //           type="date"
// //           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
// //           value={startDate}
// //           onChange={(e) => onStartChange(e.target.value)}
// //         />
// //         <span className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>to</span>
// //         <input
// //           type="date"
// //           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
// //           value={endDate}
// //           onChange={(e) => onEndChange(e.target.value)}
// //           disabled={!startDate}
// //         />
// //         {(startDate || endDate) && (
// //           <button
// //             type="button"
// //             onClick={onClear}
// //             className={`btn btn-sm ${theme === 'light' ? 'btn-ghost' : 'btn-outline'}`}
// //           >
// //             ✕
// //           </button>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // // --- Main Component ---

// // function safeFormatDate(dateStr?: string | null, fmt: string = 'MMM dd, yyyy') {
// //   if (!dateStr) return 'N/A';
// //   const d = new Date(dateStr);
// //   if (isNaN(d.getTime())) return 'N/A';
// //   return format(d, fmt);
// // }

// // function safeFormatTime(dateStr?: string | null, fmt: string = 'HH:mm') {
// //   if (!dateStr) return '--';
// //   const d = new Date(dateStr);
// //   if (isNaN(d.getTime())) return '--';
// //   return format(d, fmt);
// // }

// // function getIPStatusDisplay(status?: string | null) {
// //   if (!status) return 'Unknown';
// //   switch (status) {
// //     case 'IN_WHITELIST':
// //       return 'In Whitelist';
// //     case 'NOT_IN_WHITELIST':
// //       return 'Not Whitelist';
// //     case 'NO_IP':
// //       return 'No IP';
// //     case 'NO_EVENT':
// //       return 'No Event';
// //     default:
// //       return status;
// //   }
// // }

// // export default function AttendanceTab({
// //   filters: baseFilters,
// //   onFilterChange,
// //   onShowNotification,
// //   user
// // }: AttendanceTabProps) {
// //   const { theme } = useTheme();
// //   const [page, setPage] = useState(1);
// //   const [limit] = useState(20);
// //   const [isFilterOpen, setIsFilterOpen] = useState(false);
// //   const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);
// //   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
// //   const [isExporting, setIsExporting] = useState(false);
// //   const [exportScope, setExportScope] = useState<'filtered' | 'current'>('filtered');
// //   const [selectedColumns, setSelectedColumns] = useState<string[]>([
// //     'employee_name', 'employee_no', 'company_name', 'department', 'position', 
// //     'attendance_date', 'check_in_time', 'check_out_time', 'status', 'worked_hours'
// //   ]);

// //   const exportColumns = [
// //     { id: 'employee_name', label: 'Employee Name' },
// //     { id: 'employee_no', label: 'Employee No' },
// //     { id: 'company_name', label: 'Company' },
// //     { id: 'department', label: 'Department' },
// //     { id: 'position', label: 'Position' },
// //     { id: 'attendance_date', label: 'Date' },
// //     { id: 'check_in_time', label: 'Check In' },
// //     { id: 'check_out_time', label: 'Check Out' },
// //     { id: 'status', label: 'Status' },
// //     { id: 'worked_hours', label: 'Worked Hours' },
// //     { id: 'check_in_ip', label: 'Check-in IP' },
// //     { id: 'check_out_ip', label: 'Check-out IP' },
// //     { id: 'office_name', label: 'Office' }
// //   ];

// //   // Initialize internal filters state from baseFilters
// //   const [filters, setFilters] = useState<Filters>({
// //     employee_status: [],
// //     company_id: baseFilters.company_id ? [String(baseFilters.company_id)] : [],
// //     department_id: baseFilters.department_id ? [String(baseFilters.department_id)] : [],
// //     position: [],
// //     type: [],
// //     nationality: [],
// //     jobLevel: [],
// //     employee_id: baseFilters.employee_id ? [String(baseFilters.employee_id)] : [],
// //     status: baseFilters.status ? [String(baseFilters.status)] : [],
// //     start_date: baseFilters.start_date || '',
// //     end_date: baseFilters.end_date || '',
// //     search: ''
// //   });

// //   // Sync internal filters to parent on change
// //   useEffect(() => {
// //     const updatedBaseFilters: Partial<BaseFilters> = {
// //       company_id: filters.company_id.length > 0 ? filters.company_id.join(',') : undefined,
// //       department_id: filters.department_id.length > 0 ? filters.department_id.join(',') : undefined,
// //       employee_id: filters.employee_id.length > 0 ? filters.employee_id.join(',') : undefined,
// //       status: filters.status.length > 0 ? filters.status.join(',') : undefined,
// //       start_date: filters.start_date || undefined,
// //       end_date: filters.end_date || undefined,
// //       ...({
// //         employee_status: filters.employee_status.length > 0 ? filters.employee_status.join(',') : undefined,
// //         position: filters.position.length > 0 ? filters.position.join(',') : undefined,
// //         employment_type: filters.type.length > 0 ? filters.type.join(',') : undefined,
// //         nationality: filters.nationality.length > 0 ? filters.nationality.join(',') : undefined,
// //         job_level: filters.jobLevel.length > 0 ? filters.jobLevel.join(',') : undefined,
// //         search: filters.search || undefined
// //       } as any)
// //     };
// //     onFilterChange(updatedBaseFilters);
// //     setPage(1);
// //   }, [filters, onFilterChange]);

// //   // Fetch attendance data
// //   const { data, total, isLoading, isFetching, error } = useAttendanceData<AttendanceRecordFlat>(
// //     'attendance',
// //     baseFilters,
// //     page,
// //     limit
// //   );

// //   // Fetch filter options
// //   const { options: filterOptions } = useFilterOptions('all', baseFilters.company_id, false);

// //   const companies = useMemo(() => (filterOptions as any)?.companies || [], [filterOptions]);
// //   const departments = useMemo(() => (filterOptions as any)?.departments || [], [filterOptions]);
// //   const statuses = useMemo(() => (filterOptions as any)?.statuses || [], [filterOptions]);
// //   const employees = useMemo(() => (filterOptions as any)?.employees || [], [filterOptions]);
  
// //   const employeeStatuses = ['Active', 'Inactive', 'Resigned'];
// //   const positions = useMemo(() => (filterOptions as any)?.positions || [], [filterOptions]);
// //   const employmentTypes = useMemo(() => (filterOptions as any)?.employment_types || [], [filterOptions]);
// //   //const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
// //   const nationalities = useMemo(() => (filterOptions as any)?.nationalities || [], [filterOptions]);
// //   //const nationalities = ['Malaysian', 'Foreigner'];
// //   const jobLevels = useMemo(() => (filterOptions as any)?.job_levels || [], [filterOptions]);
// //   //const jobLevels = ['Junior', 'Senior', 'Manager', 'Director'];

// //   const handleFilterChange = useCallback((name: keyof Filters, value: any) => {
// //     setFilters(prev => ({ ...prev, [name]: value }));
// //   }, []);

// //   const handleQuickDateSelect = (option: string) => {
// //     const today = new Date();
// //     let startDate = new Date();
// //     let endDate = new Date();
    
// //     switch (option) {
// //       case 'today':
// //         startDate = new Date(today.setHours(0, 0, 0, 0));
// //         endDate = new Date(new Date().setHours(23, 59, 59, 999));
// //         break;
// //       case 'yesterday':
// //         startDate = new Date(today);
// //         startDate.setDate(startDate.getDate() - 1);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate = new Date(today);
// //         endDate.setDate(endDate.getDate() - 1);
// //         endDate.setHours(23, 59, 59, 999);
// //         break;
// //       case 'thisWeek':
// //         const dayOfWeek = today.getDay();
// //         startDate = new Date(today);
// //         startDate.setDate(today.getDate() - dayOfWeek);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate = new Date(today.setHours(23, 59, 59, 999));
// //         break;
// //       case 'lastWeek':
// //         const lastWeekEnd = new Date(today);
// //         lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
// //         lastWeekEnd.setHours(23, 59, 59, 999);
// //         startDate = new Date(lastWeekEnd);
// //         startDate.setDate(lastWeekEnd.getDate() - 6);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate = lastWeekEnd;
// //         break;
// //       case 'thisMonth':
// //         startDate = new Date(today.getFullYear(), today.getMonth(), 1);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate = new Date(today.setHours(23, 59, 59, 999));
// //         break;
// //       case 'lastMonth':
// //         startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
// //         startDate.setHours(0, 0, 0, 0);
// //         endDate = new Date(today.getFullYear(), today.getMonth(), 0);
// //         endDate.setHours(23, 59, 59, 999);
// //         break;
// //       default:
// //         setActiveQuickDate(null);
// //         return;
// //     }
    
// //     const formattedStartDate = startDate.toISOString().split('T')[0];
// //     const formattedEndDate = endDate.toISOString().split('T')[0];
    
// //     setFilters(prev => ({
// //       ...prev,
// //       start_date: formattedStartDate,
// //       end_date: formattedEndDate
// //     }));
    
// //     setActiveQuickDate(option);
// //   };

// //   const resetFilters = () => {
// //     setFilters({
// //       employee_status: [],
// //       company_id: [],
// //       department_id: [],
// //       position: [],
// //       type: [],
// //       nationality: [],
// //       jobLevel: [],
// //       employee_id: [],
// //       status: [],
// //       start_date: '',
// //       end_date: '',
// //       search: ''
// //     });
// //     setActiveQuickDate(null);
// //   };

// //   const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
// //     if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
// //     if (value && key !== 'search') return count + 1;
// //     return count;
// //   }, 0);

// //   const getStatusBadgeClass = (status: string) => {
// //     switch (status?.toUpperCase()) {
// //       case 'PRESENT': return 'badge-success';
// //       case 'ABSENT': return 'badge-error';
// //       case 'LATE': return 'badge-warning';
// //       case 'PARTIAL': return 'badge-info';
// //       case 'OFFDAY': return 'badge-secondary';
// //       default: return 'badge-ghost';
// //     }
// //   };

// //   if (error) {
// //     return (
// //       <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
// //         <span>{error.message}</span>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
// //             Attendance Records
// //           </h2>
// //           <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// //             View and manage employee attendance records
// //           </p>
// //         </div>
        
// //         <div className="flex gap-2 w-full sm:w-auto">
// //           <button
// //             onClick={() => setIsFilterOpen(!isFilterOpen)}
// //             className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${
// //               isFilterOpen 
// //                 ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') 
// //                 : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')
// //             }`}
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
// //             </svg>
// //             Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
// //           </button>
// //           <button
// //             onClick={() => setIsExportModalOpen(true)}
// //             className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${theme === 'light' ? 'btn-outline btn-primary' : 'btn-outline btn-info'}`}
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
// //             </svg>
// //             Export
// //           </button>
// //         </div>
// //       </div>

// //       {/* Quick Navigation */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
// //         <div className="join shadow-sm overflow-x-auto w-full sm:w-auto">
// //           <div className="flex gap-1 sm:gap-0">
// //             {['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth'].map((opt) => (
// //               <button 
// //                 key={opt}
// //                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === opt ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
// //                 onClick={() => handleQuickDateSelect(opt)}
// //               >
// //                 {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/([A-Z])/g, ' $1')}
// //               </button>
// //             ))}
// //             {activeQuickDate && (
// //               <button 
// //                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${theme === 'light' ? 'btn-error text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
// //                 onClick={() => {
// //                   setFilters(prev => ({ ...prev, start_date: '', end_date: '' }));
// //                   setActiveQuickDate(null);
// //                 }}
// //               >
// //                 Clear Dates
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //         <div className="relative w-full sm:w-64">
// //           <input
// //             type="text"
// //             placeholder="Search employee..."
// //             className={`input input-sm sm:input-md input-bordered w-full pl-10 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// //             value={filters.search}
// //             onChange={(e) => handleFilterChange('search', e.target.value)}
// //           />
// //           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //           </svg>
// //         </div>
// //       </div>

// //       {/* Advanced Filters */}
// //       {isFilterOpen && (
// //         <div className={`relative rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
// //           <div className="px-6 py-5 border-b bg-slate-50">
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //               <div>
// //                 <h2 className="text-lg font-semibold text-slate-800">Advanced Filters</h2>
// //                 <p className="text-slate-600 text-sm mt-1">Refine your attendance records with precision filters</p>
// //               </div>
// //               <div className="flex gap-2">
// //                 <button 
// //                   className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-300 transition-colors"
// //                   onClick={() => setIsFilterOpen(false)}
// //                 >
// //                   Close
// //                 </button>
// //                 <button 
// //                   className="px-4 py-2 text-sm bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors font-medium"
// //                   onClick={resetFilters}
// //                 >
// //                   Reset All
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="p-6">
// //             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
// //               <ProfessionalMultiSelectFilter
// //                 name="employee_status"
// //                 value={filters.employee_status}
// //                 options={employeeStatuses}
// //                 onChange={handleFilterChange}
// //                 placeholder="Employee Status"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="company_id"
// //                 value={filters.company_id}
// //                 options={companies}
// //                 onChange={handleFilterChange}
// //                 placeholder="Company"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="department_id"
// //                 value={filters.department_id}
// //                 options={departments}
// //                 displayTransform={(item: any) => item.department_name || item.name}
// //                 onChange={handleFilterChange}
// //                 placeholder="Department"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="position"
// //                 value={filters.position}
// //                 options={positions}
// //                 onChange={handleFilterChange}
// //                 placeholder="Position"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="type"
// //                 value={filters.type}
// //                 options={employmentTypes}
// //                 onChange={handleFilterChange}
// //                 placeholder="Employment Type"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="nationality"
// //                 value={filters.nationality}
// //                 options={nationalities}
// //                 onChange={handleFilterChange}
// //                 placeholder="Nationality"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="jobLevel"
// //                 value={filters.jobLevel}
// //                 options={jobLevels}
// //                 onChange={handleFilterChange}
// //                 placeholder="Job Level"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="employee_id"
// //                 value={filters.employee_id}
// //                 options={employees}
// //                 onChange={handleFilterChange}
// //                 placeholder="Employee"
// //                 theme={theme}
// //               />
// //               <ProfessionalMultiSelectFilter
// //                 name="status"
// //                 value={filters.status}
// //                 options={statuses}
// //                 onChange={handleFilterChange}
// //                 placeholder="Attendance Status"
// //                 theme={theme}
// //               />
// //               <DateRangeFilter
// //                 title="Attendance Date Range"
// //                 startDate={filters.start_date}
// //                 endDate={filters.end_date}
// //                 onStartChange={(date) => handleFilterChange('start_date', date)}
// //                 onEndChange={(date) => handleFilterChange('end_date', date)}
// //                 onClear={() => {
// //                   handleFilterChange('start_date', '');
// //                   handleFilterChange('end_date', '');
// //                 }}
// //                 theme={theme}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Attendance Table */}
// //       <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //         {isLoading ? (
// //           <div className="p-8 text-center">
// //             <div className="loading loading-spinner loading-lg mx-auto"></div>
// //             <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// //               Loading attendance records...
// //             </p>
// //           </div>
// //         ) : data && data.length > 0 ? (
// //           <>
// //             <div className="overflow-x-auto">
// //               <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //                 <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
// //                   <tr>
// //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Employee</th>
// //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
// //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Position</th>
// //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Company</th>
// //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
// //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check In</th>
// //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check Out</th>
// //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
// //                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Worked Hours</th>
// //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-in IP Details</th>
// //                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-out IP Details</th>
// //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Office</th>
// //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Whitelist CIDR</th>
// //                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Timezone</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {data.map((item) => {
// //                     const checkInISO = item.first_check_in_time_local_iso || item.check_in_time;
// //                     const checkOutISO = item.last_check_out_time_local_iso || item.check_out_time;
// //                     const worked = item.daily_worked_hours || item.worked_hours || '--';

// //                     return (
// //                       <tr
// //                         key={item.attendance_day_id || `${item.employee_id}-${item.attendance_date}-${item.pair_number || 1}`}
// //                         className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
// //                       >
// //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
// //                           <div>
// //                             <div className="font-medium">{item.employee_name}</div>
// //                             <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
// //                               {item.employee_no}
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.department || '--'}</td>
// //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.position || '--'}</td>
// //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.company_name}</td>
// //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatDate(item.attendance_date)}</td>
// //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatTime(checkInISO)}</td>
// //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatTime(checkOutISO)}</td>
// //                         <td className="text-center">
// //                           <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
// //                           {item.has_issue ? <div className="text-xs mt-1 text-warning">Issue</div> : null}
// //                         </td>
// //                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{worked}</td>
// //                         <td>
// //                           {item.check_in_ip || item.check_in_public_ip ? (
// //                             <div className="text-xs space-y-1">
// //                               {item.check_in_public_ip && (
// //                                 <div><span className="font-medium">Public: </span><span className="font-mono">{item.check_in_public_ip}</span></div>
// //                               )}
// //                               {item.check_in_ip_match_status && (
// //                                 <div className="space-y-1 mt-1">
// //                                   <div className="flex items-center gap-1 flex-wrap">
// //                                     <span className={`badge badge-xs ${
// //                                       item.check_in_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
// //                                       item.check_in_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
// //                                       item.check_in_ip_match_status === 'NO_IP' ? 'badge-warning' : 
// //                                       item.check_in_ip_match_status === 'NO_EVENT' ? 'badge-neutral' : 'badge-warning'
// //                                     }`}>
// //                                       {getIPStatusDisplay(item.check_in_ip_match_status)}
// //                                     </span>
// //                                     {item.check_in_ip_used_override ? <span className="badge badge-xs badge-info">Override</span> : null}
// //                                   </div>
// //                                   {item.check_in_ip_matched_rule ? (
// //                                     <div className="text-xs opacity-70 truncate cursor-help" title={item.check_in_ip_matched_rule}>{item.check_in_ip_matched_rule}</div>
// //                                   ) : null}
// //                                 </div>
// //                               )}
// //                               {item.check_in_ip_policy_mode && <div className="text-xs opacity-70">Policy: {item.check_in_ip_policy_mode}</div>}
// //                               {item.employee_override_ip && item.employee_override_active ? (
// //                                 <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
// //                                   Override: {item.employee_override_ip}{item.employee_override_label ? ` (${item.employee_override_label})` : ''}
// //                                 </div>
// //                               ) : null}
// //                             </div>
// //                           ) : <span className="text-xs text-gray-500">No IP data</span>}
// //                         </td>
// //                         <td>
// //                           {item.check_out_ip || item.check_out_public_ip ? (
// //                             <div className="text-xs space-y-1">
// //                               {item.check_out_public_ip && (
// //                                 <div><span className="font-medium">Public: </span><span className="font-mono">{item.check_out_public_ip}</span></div>
// //                               )}
// //                               {item.check_out_ip_match_status && (
// //                                 <div className="space-y-1 mt-1">
// //                                   <div className="flex items-center gap-1 flex-wrap">
// //                                     <span className={`badge badge-xs ${
// //                                       item.check_out_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
// //                                       item.check_out_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
// //                                       item.check_out_ip_match_status === 'NO_IP' ? 'badge-warning' : 
// //                                       item.check_out_ip_match_status === 'NO_EVENT' ? 'badge-neutral' : 'badge-warning'
// //                                     }`}>
// //                                       {getIPStatusDisplay(item.check_out_ip_match_status)}
// //                                     </span>
// //                                     {item.check_out_ip_used_override ? <span className="badge badge-xs badge-info">Override</span> : null}
// //                                   </div>
// //                                   {item.check_out_ip_matched_rule ? (
// //                                     <div className="text-xs opacity-70 truncate cursor-help" title={item.check_out_ip_matched_rule}>{item.check_out_ip_matched_rule}</div>
// //                                   ) : null}
// //                                 </div>
// //                               )}
// //                               {item.check_out_ip_policy_mode && <div className="text-xs opacity-70">Policy: {item.check_out_ip_policy_mode}</div>}
// //                               {item.employee_override_ip && item.employee_override_active ? (
// //                                 <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
// //                                   Override: {item.employee_override_ip}{item.employee_override_label ? ` (${item.employee_override_label})` : ''}
// //                                 </div>
// //                               ) : null}
// //                             </div>
// //                           ) : <span className="text-xs text-gray-500">No IP data</span>}
// //                         </td>
// //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.office_name || '--'}</td>
// //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.whitelisted_cidr || '--'}</td>
// //                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.employee_timezone || '--'}</td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* Pagination */}
// //             {total > limit && (
// //               <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-700'}`}>
// //                 <div className="flex items-center justify-between">
// //                   <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// //                     Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
// //                   </span>
// //                   <div className="join">
// //                     <button
// //                       className="join-item btn btn-sm"
// //                       onClick={() => setPage(Math.max(1, page - 1))}
// //                       disabled={page === 1 || isFetching}
// //                     >
// //                       Previous
// //                     </button>
// //                     <button className="join-item btn btn-sm btn-disabled">
// //                       Page {page}
// //                     </button>
// //                     <button
// //                       className="join-item btn btn-sm"
// //                       onClick={() => setPage(page + 1)}
// //                       disabled={page * limit >= total || isFetching}
// //                     >
// //                       Next
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         ) : (
// //           <div className="p-8 text-center">
// //             <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
// //               No attendance records found for the selected filters.
// //             </p>
// //           </div>
// //         )}
// //       </div>

// //       {/* Export Modal */}
// //       {isExportModalOpen && (
// //         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
// //           <div 
// //             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
// //             onClick={() => !isExporting && setIsExportModalOpen(false)}
// //           />
// //           <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
// //             <div className="px-6 py-4 border-b flex items-center justify-between">
// //               <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Export Attendance Records</h3>
// //               <button 
// //                 onClick={() => setIsExportModalOpen(false)}
// //                 disabled={isExporting}
// //                 className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
// //               >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             <div className="p-6 space-y-6">
// //               {/* Export Scope */}
// //               <div>
// //                 <label className={`block text-sm font-semibold mb-3 uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// //                   Export Scope
// //                 </label>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <button
// //                     onClick={() => setExportScope('filtered')}
// //                     className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
// //                       exportScope === 'filtered'
// //                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
// //                         : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
// //                     }`}
// //                   >
// //                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'filtered' ? 'border-blue-500' : 'border-gray-300'}`}>
// //                       {exportScope === 'filtered' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
// //                     </div>
// //                     <div className="text-left">
// //                       <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>All Filtered Results</div>
// //                       <div className="text-xs text-gray-500">Export all {total} records matching filters</div>
// //                     </div>
// //                   </button>
// //                   <button
// //                     onClick={() => setExportScope('current')}
// //                     className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
// //                       exportScope === 'current'
// //                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
// //                         : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
// //                     }`}
// //                   >
// //                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'current' ? 'border-blue-500' : 'border-gray-300'}`}>
// //                       {exportScope === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
// //                     </div>
// //                     <div className="text-left">
// //                       <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Current Page Only</div>
// //                       <div className="text-xs text-gray-500">Export only the {data?.length || 0} records on this page</div>
// //                     </div>
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Column Selection */}
// //               <div>
// //                 <div className="flex items-center justify-between mb-3">
// //                   <label className={`text-sm font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
// //                     Select Columns
// //                   </label>
// //                   <div className="flex gap-3">
// //                     <button 
// //                       onClick={() => setSelectedColumns(exportColumns.map(c => c.id))}
// //                       className="text-xs text-blue-600 hover:underline font-medium"
// //                     >
// //                       Select All
// //                     </button>
// //                     <button 
// //                       onClick={() => setSelectedColumns(['employee_name', 'attendance_date', 'status'])}
// //                       className="text-xs text-gray-500 hover:underline font-medium"
// //                     >
// //                       Reset
// //                     </button>
// //                   </div>
// //                 </div>
// //                 <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-900/50 border-slate-700'}`}>
// //                   {exportColumns.map(col => (
// //                     <label key={col.id} className="flex items-center gap-2 cursor-pointer group">
// //                       <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-sm checkbox-primary"
// //                         checked={selectedColumns.includes(col.id)}
// //                         onChange={(e) => {
// //                           if (e.target.checked) {
// //                             setSelectedColumns([...selectedColumns, col.id]);
// //                           } else {
// //                             setSelectedColumns(selectedColumns.filter(id => id !== col.id));
// //                           }
// //                         }}
// //                       />
// //                       <span className={`text-sm group-hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
// //                         {col.label}
// //                       </span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className={`px-6 py-4 border-t flex justify-end gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800/50'}`}>
// //               <button
// //                 onClick={() => setIsExportModalOpen(false)}
// //                 disabled={isExporting}
// //                 className={`btn btn-ghost ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={async () => {
// //                   setIsExporting(true);
// //                   try {
// //                     const queryParams = new URLSearchParams();
// //                     Object.entries(baseFilters).forEach(([key, value]) => {
// //                       if (value) queryParams.append(key, String(value));
// //                     });
                    
// //                     if (exportScope === 'current') {
// //                       queryParams.append('page', String(page));
// //                       queryParams.append('limit', String(limit));
// //                     }
                    
// //                     queryParams.append('columns', selectedColumns.join(','));
                    
// //                     const response = await fetch(`${API_BASE_URL}/api/attendance/export?${queryParams.toString()}`, {
// //                       headers: {
// //                         'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
// //                       }
// //                     });
                    
// //                     if (!response.ok) throw new Error('Export failed');
                    
// //                     const blob = await response.blob();
// //                     const url = window.URL.createObjectURL(blob);
// //                     const a = document.createElement('a');
// //                     a.href = url;
// //                     a.download = `attendance_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
// //                     document.body.appendChild(a);
// //                     a.click();
// //                     window.URL.revokeObjectURL(url);
// //                     document.body.removeChild(a);
                    
// //                     onShowNotification('Export successful', 'success');
// //                     setIsExportModalOpen(false);
// //                   } catch (err) {
// //                     onShowNotification('Export failed. Please try again.', 'error');
// //                   } finally {
// //                     setIsExporting(false);
// //                   }
// //                 }}
// //                 disabled={isExporting || selectedColumns.length === 0}
// //                 className={`btn btn-primary min-w-[120px] ${isExporting ? 'loading' : ''}`}
// //               >
// //                 {isExporting ? 'Exporting...' : 'Download XLSX'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// 'use client';

// import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
// import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
// import { useTheme } from '../../components/ThemeProvider';
// import type { Filters as BaseFilters } from '../../utils/attendanceApi';
// import { format } from 'date-fns';
// import { FaChevronDown, FaRegCalendarTimes } from "react-icons/fa";
// import { BsCheckCircle, BsXCircle, BsEye } from "react-icons/bs";
// import { API_BASE_URL } from '@/app/config';

// // --- Interfaces ---

// interface FilterOptionItem {
//   id: string | number;
//   name: string;
// }

// interface Filters {
//   employee_status: string[];
//   company_id: string[];
//   department_id: string[];
//   position: string[];
//   type: string[];
//   nationality: string[];
//   jobLevel: string[];
//   employee_id: string[];
//   status: string[];
//   start_date: string;
//   end_date: string;
//   search: string;
// }

// type CompanyOption = {
//   id: number;
//   name: string;
// };

// type DepartmentOption = {
//   id: number;
//   department_name: string;
// };

// type StatusOption = {
//   id: string | number;
//   name: string;
// };

// interface AttendanceRecordFlat {
//   employee_name: string;
//   employee_no: string;
//   company_name: string;
//   department: string | null;
//   position: string | null;

//   attendance_date: string | null;

//   check_in_time: string | null;
//   check_out_time: string | null;

//   first_check_in_time_local_iso: string | null;
//   last_check_out_time_local_iso: string | null;

//   daily_worked_hours: string | null;
//   daily_worked_hours_decimal: string | null;
//   daily_worked_hours_minutes: number | null;

//   worked_hours: string | null;
//   worked_hours_decimal: string | null;
//   worked_hours_minutes: number | null;

//   status: string;

//   attendance_day_id: number;
//   employee_id: number;

//   amend_date: string | null;
//   amend_by: string | null;

//   employee_timezone: string | null;
//   pair_number: number | null;

//   check_in_ip: string | null;
//   check_in_public_ip: string | null;
//   check_in_ip_match_status: string | null;
//   check_in_ip_policy_mode: string | null;

//   check_out_ip: string | null;
//   check_out_public_ip: string | null;
//   check_out_ip_match_status: string | null;
//   check_out_ip_policy_mode: string | null;

//   has_issue: boolean | null;
//   office_name: string | null;
//   whitelisted_cidr: string | null;

//   check_in_ip_used_override?: boolean | null;
//   check_in_ip_matched_rule?: string | null;

//   check_out_ip_used_override?: boolean | null;
//   check_out_ip_matched_rule?: string | null;

//   employee_override_ip?: string | null;
//   employee_override_active?: boolean | null;
//   employee_override_label?: string | null;
// }

// interface AttendanceTabProps {
//   filters: BaseFilters;
//   onFilterChange: (filters: Partial<BaseFilters>) => void;
//   onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
//   user: any;
// }

// // --- Helper Components ---

// const ProfessionalMultiSelectFilter = ({ 
//   name, 
//   value, 
//   options, 
//   onChange, 
//   placeholder,
//   displayTransform = (item: string | FilterOptionItem) => typeof item === 'string' ? item : item.name,
//   theme = 'light'
// }: { 
//   name: keyof Filters;
//   value: string[];
//   options: (string | FilterOptionItem | undefined | null)[];
//   onChange: (name: keyof Filters, value: string[]) => void;
//   placeholder: string;
//   displayTransform?: (item: string | FilterOptionItem) => string;
//   theme?: 'light' | 'dark';
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [clickedFromBottom, setClickedFromBottom] = useState<string | null>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const optionsContainerRef = useRef<HTMLDivElement>(null);

//   const validOptions = useMemo(() => {
//     return options
//       .filter((option): option is string | FilterOptionItem => 
//         option !== undefined && option !== null && option !== ''
//       )
//       .map(option => {
//         if (typeof option === 'string') {
//           return { id: option, name: option };
//         }
//         return {
//           id: String(option.id),
//           name: String(option.name || option.id)
//         };
//       });
//   }, [options]);

//   const optionMap = useMemo(() => {
//     const map = new Map<string, string>();
//     validOptions.forEach(option => {
//       const displayName = displayTransform({ id: option.id, name: option.name });
//       map.set(option.id, displayName);
//     });
//     return map;
//   }, [validOptions, displayTransform]);

//   const filteredOptions = useMemo(() => {
//     if (!searchTerm) return validOptions;
//     return validOptions.filter(option => {
//       const displayName = optionMap.get(option.id) || option.name;
//       return displayName.toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   }, [validOptions, searchTerm, optionMap]);

//   const handleToggle = useCallback((optionId: string, event: React.MouseEvent) => {
//     event.preventDefault();
//     event.stopPropagation();
    
//     const newValue = value.includes(optionId)
//       ? value.filter(v => v !== optionId)
//       : [...value, optionId];
    
//     onChange(name, newValue);
//     setClickedFromBottom(optionId);
//   }, [value, name, onChange]);

//   const handleSelectAll = useCallback(() => {
//     const allIds = validOptions.map(option => option.id);
//     onChange(name, allIds);
//   }, [validOptions, name, onChange]);

//   const handleClear = useCallback(() => {
//     onChange(name, []);
//   }, [name, onChange]);

//   const selectedPercentage = validOptions.length > 0 
//     ? Math.round((value.length / validOptions.length) * 100) 
//     : 0;

//   const handleApply = useCallback(() => {
//     setIsOpen(false);
//     setSearchTerm('');
//     setClickedFromBottom(null);
//   }, []);

//   useEffect(() => {
//     if (isOpen && searchInputRef.current) {
//       setTimeout(() => {
//         searchInputRef.current?.focus();
//       }, 100);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     if (clickedFromBottom && optionsContainerRef.current) {
//       const clickedElement = document.getElementById(`option-${clickedFromBottom}`);
//       if (clickedElement) {
//         clickedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//       }
//     }
//   }, [clickedFromBottom]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         handleApply();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }
//   }, [isOpen, handleApply]);

//   const renderSelectedItems = () => {
//     if (value.length === 0) {
//       return (
//         <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//           Select {placeholder.toLowerCase()}...
//         </span>
//       );
//     }

//     return (
//       <div className="flex flex-wrap gap-2">
//         {value.slice(0, 2).map(val => {
//           const displayName = optionMap.get(val) || val;
//           return (
//             <span 
//               key={`selected-${val}`}
//               className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
//             >
//               {displayName}
//             </span>
//           );
//         })}
//         {value.length > 2 && (
//           <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
//             +{value.length - 2} more
//           </span>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="form-control w-full">
//         <label className="label pb-3">
//           <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//             {placeholder}
//           </span>
//         </label>
        
//         <button
//           onClick={() => setIsOpen(true)}
//           className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
//             theme === 'light' 
//               ? 'bg-white border-slate-200 hover:border-slate-300' 
//               : 'bg-slate-800 border-slate-600 hover:border-slate-500'
//           } ${
//             value.length > 0 
//               ? 'border-blue-500 bg-blue-50 shadow-sm' 
//               : ''
//           }`}
//           type="button"
//           aria-haspopup="dialog"
//           aria-expanded={isOpen}
//         >
//           <div className="flex flex-col items-start flex-1 min-w-0">
//             {renderSelectedItems()}
//           </div>
          
//           <div className="flex items-center gap-3 flex-shrink-0 ml-4">
//             {value.length > 0 && (
//               <div className="flex flex-col items-end">
//                 <span className="text-sm font-semibold text-blue-600">{value.length} selected</span>
//                 <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-blue-500 transition-all duration-300"
//                     style={{ width: `${selectedPercentage}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//             <div className={`w-2 h-2 border-r-2 border-b-2 border-slate-400 transform transition-transform duration-200 ${
//               isOpen ? 'rotate-45 -translate-y-0.5' : '-rotate-45 translate-y-0.5'
//             }`} />
//           </div>
//         </button>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
//           <div 
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
//             onClick={handleApply}
//             aria-hidden="true"
//           />
          
//           <div 
//             ref={modalRef}
//             className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden z-10"
//           >
//             <div className="flex items-center justify-between p-6 border-b bg-white">
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Choose multiple options to filter your results
//                 </p>
//               </div>
//               <button 
//                 onClick={handleApply}
//                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
//                 type="button"
//                 aria-label="Close modal"
//               >
//                 <div className="w-4 h-4 relative">
//                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform -rotate-45" />
//                   <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform rotate-45" />
//                 </div>
//               </button>
//             </div>

//             <div className="p-4 border-b bg-slate-50">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="form-control flex-1">
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     placeholder={`Search ${placeholder.toLowerCase()}...`}
//                     className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     aria-label={`Search ${placeholder}`}
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="text-sm text-slate-600">
//                     <span className="font-semibold">{value.length}</span> of{' '}
//                     <span className="font-semibold">{validOptions.length}</span> selected
//                   </div>
//                   <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full bg-green-500 transition-all duration-500"
//                       style={{ width: `${selectedPercentage}%` }}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleSelectAll}
//                     className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={value.length === validOptions.length}
//                     type="button"
//                   >
//                     Select All
//                   </button>
//                   {value.length > 0 && (
//                     <button
//                       onClick={handleClear}
//                       className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
//                       type="button"
//                     >
//                       Clear All
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div 
//               ref={optionsContainerRef}
//               className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] bg-white"
//               onScroll={() => setClickedFromBottom(null)}
//             >
//               {filteredOptions.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
//                   <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
//                     <div className="w-6 h-0.5 bg-slate-400 rotate-45 absolute" />
//                     <div className="w-6 h-0.5 bg-slate-400 -rotate-45 absolute" />
//                   </div>
//                   <h4 className="font-semibold text-slate-700 mb-2">No options found</h4>
//                   <p className="text-slate-500 text-sm">
//                     {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="p-4 space-y-2">
//                   {filteredOptions.map((option) => {
//                     const displayName = optionMap.get(option.id) || option.name;
//                     const isSelected = value.includes(option.id);
                    
//                     return (
//                       <div
//                         key={`${name}-${option.id}`}
//                         id={`option-${option.id}`}
//                         className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
//                           isSelected
//                             ? 'bg-blue-50 border-blue-200 shadow-sm'
//                             : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
//                         }`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleToggle(option.id, e);
//                         }}
//                         role="checkbox"
//                         aria-checked={isSelected}
//                         tabIndex={0}
//                       >
//                         <div 
//                           className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
//                             isSelected 
//                               ? 'bg-blue-600 border-blue-600' 
//                               : 'border-slate-300 bg-white'
//                           }`}
//                         >
//                           {isSelected && (
//                             <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
//                             </svg>
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <span className="font-medium text-slate-800 break-words">
//                             {displayName}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                   <div className="h-4" />
//                 </div>
//               )}
//             </div>

//             <div className="p-4 border-t bg-white">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-slate-600">
//                   <span className="font-medium">{value.length}</span> options selected
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleApply}
//                     className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
//                     type="button"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleApply}
//                     className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
//                     type="button"
//                   >
//                     Apply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const DateRangeFilter = ({
//   title,
//   startDate,
//   endDate,
//   onStartChange,
//   onEndChange,
//   onClear,
//   theme = 'light'
// }: {
//   title: string;
//   startDate: string;
//   endDate: string;
//   onStartChange: (date: string) => void;
//   onEndChange: (date: string) => void;
//   onClear: () => void;
//   theme?: 'light' | 'dark';
// }) => {
//   return (
//     <div className="form-control w-full">
//       <label className="label pb-3">
//         <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//           {title}
//         </span>
//       </label>
//       <div className="flex gap-2 items-center">
//         <input
//           type="date"
//           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//           value={startDate}
//           onChange={(e) => onStartChange(e.target.value)}
//         />
//         <span className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>to</span>
//         <input
//           type="date"
//           className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
//           value={endDate}
//           onChange={(e) => onEndChange(e.target.value)}
//           disabled={!startDate}
//         />
//         {(startDate || endDate) && (
//           <button
//             type="button"
//             onClick={onClear}
//             className={`btn btn-sm ${theme === 'light' ? 'btn-ghost' : 'btn-outline'}`}
//           >
//             ✕
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- Main Component ---

// function safeFormatDate(dateStr?: string | null, fmt: string = 'MMM dd, yyyy') {
//   if (!dateStr) return 'N/A';
//   const d = new Date(dateStr);
//   if (isNaN(d.getTime())) return 'N/A';
//   return format(d, fmt);
// }

// function safeFormatTime(dateStr?: string | null, fmt: string = 'HH:mm') {
//   if (!dateStr) return '--';
//   const d = new Date(dateStr);
//   if (isNaN(d.getTime())) return '--';
//   return format(d, fmt);
// }

// function getIPStatusDisplay(status?: string | null) {
//   if (!status) return 'Unknown';
//   switch (status) {
//     case 'IN_WHITELIST':
//       return 'In Whitelist';
//     case 'NOT_IN_WHITELIST':
//       return 'Not Whitelist';
//     case 'NO_IP':
//       return 'No IP';
//     case 'NO_EVENT':
//       return 'No Event';
//     default:
//       return status;
//   }
// }

// // Function to duplicate FLAG_ONLY policy mode for display
// function getPolicyDisplay(policyMode: string | null, ipMatchStatus: string | null) {
//   if (policyMode === 'FLAG_ONLY' && ipMatchStatus === 'NOT_IN_WHITELIST') {
//     return 'FLAG_ONLY';
//   }
//   return policyMode || '--';
// }

// export default function AttendanceTab({
//   filters: baseFilters,
//   onFilterChange,
//   onShowNotification,
//   user
// }: AttendanceTabProps) {
//   const { theme } = useTheme();
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportScope, setExportScope] = useState<'filtered' | 'current'>('filtered');
//   const [selectedColumns, setSelectedColumns] = useState<string[]>([
//     'employee_name', 'employee_no', 'company_name', 'department', 'position', 
//     'attendance_date', 'check_in_time', 'check_out_time', 'status', 'worked_hours'
//   ]);

//   // State for loading indicators
//   const [isFiltering, setIsFiltering] = useState(false);
//   const [isPaging, setIsPaging] = useState(false);

//   const exportColumns = [
//     { id: 'employee_name', label: 'Employee Name' },
//     { id: 'employee_no', label: 'Employee No' },
//     { id: 'company_name', label: 'Company' },
//     { id: 'department', label: 'Department' },
//     { id: 'position', label: 'Position' },
//     { id: 'attendance_date', label: 'Date' },
//     { id: 'check_in_time', label: 'Check In' },
//     { id: 'check_out_time', label: 'Check Out' },
//     { id: 'status', label: 'Status' },
//     { id: 'worked_hours', label: 'Worked Hours' },
//     { id: 'check_in_ip', label: 'Check-in IP' },
//     { id: 'check_out_ip', label: 'Check-out IP' },
//     { id: 'office_name', label: 'Office' }
//   ];

//   // Initialize internal filters state from baseFilters
//   const [filters, setFilters] = useState<Filters>({
//     employee_status: [],
//     company_id: baseFilters.company_id ? [String(baseFilters.company_id)] : [],
//     department_id: baseFilters.department_id ? [String(baseFilters.department_id)] : [],
//     position: [],
//     type: [],
//     nationality: [],
//     jobLevel: [],
//     employee_id: baseFilters.employee_id ? [String(baseFilters.employee_id)] : [],
//     status: baseFilters.status ? [String(baseFilters.status)] : [],
//     start_date: baseFilters.start_date || '',
//     end_date: baseFilters.end_date || '',
//     search: ''
//   });

//   // Fetch attendance data
//   const { data, total, isLoading, isFetching, error } = useAttendanceData<AttendanceRecordFlat>(
//     'attendance',
//     baseFilters,
//     page,
//     limit
//   );

//   // Fetch filter options
//   const { options: filterOptions } = useFilterOptions('all', baseFilters.company_id, false);

//   const companies = useMemo(() => (filterOptions as any)?.companies || [], [filterOptions]);
//   const departments = useMemo(() => (filterOptions as any)?.departments || [], [filterOptions]);
//   const statuses = useMemo(() => (filterOptions as any)?.statuses || [], [filterOptions]);
//   const employees = useMemo(() => (filterOptions as any)?.employees || [], [filterOptions]);
  
//   const employeeStatuses = ['Active', 'Inactive', 'Resigned'];
//   const positions = useMemo(() => (filterOptions as any)?.positions || [], [filterOptions]);
//   const employmentTypes = useMemo(() => (filterOptions as any)?.employment_types || [], [filterOptions]);
//   const nationalities = useMemo(() => (filterOptions as any)?.nationalities || [], [filterOptions]);
//   const jobLevels = useMemo(() => (filterOptions as any)?.job_levels || [], [filterOptions]);

//   const handleFilterChange = useCallback((name: keyof Filters, value: any) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//   }, []);

//   // Handle quick date selection with loading indicator
//   const handleQuickDateSelect = (option: string) => {
//     setIsFiltering(true);
//     const today = new Date();
//     let startDate = new Date();
//     let endDate = new Date();
    
//     switch (option) {
//       case 'today':
//         startDate = new Date(today.setHours(0, 0, 0, 0));
//         endDate = new Date(new Date().setHours(23, 59, 59, 999));
//         break;
//       case 'yesterday':
//         startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 1);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(today);
//         endDate.setDate(endDate.getDate() - 1);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'thisWeek':
//         const dayOfWeek = today.getDay();
//         startDate = new Date(today);
//         startDate.setDate(today.getDate() - dayOfWeek);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(today.setHours(23, 59, 59, 999));
//         break;
//       case 'lastWeek':
//         const lastWeekEnd = new Date(today);
//         lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
//         lastWeekEnd.setHours(23, 59, 59, 999);
//         startDate = new Date(lastWeekEnd);
//         startDate.setDate(lastWeekEnd.getDate() - 6);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = lastWeekEnd;
//         break;
//       case 'thisMonth':
//         startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(today.setHours(23, 59, 59, 999));
//         break;
//       case 'lastMonth':
//         startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(today.getFullYear(), today.getMonth(), 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       default:
//         setActiveQuickDate(null);
//         setIsFiltering(false);
//         return;
//     }
    
//     const formattedStartDate = startDate.toISOString().split('T')[0];
//     const formattedEndDate = endDate.toISOString().split('T')[0];
    
//     setFilters(prev => ({
//       ...prev,
//       start_date: formattedStartDate,
//       end_date: formattedEndDate
//     }));
    
//     setActiveQuickDate(option);
//     setTimeout(() => setIsFiltering(false), 500); // Simulate filtering delay
//   };

//   // Enhanced filter change handler with loading indicator
//   const enhancedFilterChange = useCallback((name: keyof Filters, value: any) => {
//     setIsFiltering(true);
//     handleFilterChange(name, value);
//     setTimeout(() => setIsFiltering(false), 300); // Simulate filtering delay
//   }, [handleFilterChange]);

//   // Enhanced page change handler with loading indicator
//   const enhancedPageChange = useCallback((newPage: number) => {
//     setIsPaging(true);
//     setPage(newPage);
//     // Scroll to top of table
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     setTimeout(() => setIsPaging(false), 300); // Simulate paging delay
//   }, []);

//   const resetFilters = () => {
//     setIsFiltering(true);
//     setFilters({
//       employee_status: [],
//       company_id: [],
//       department_id: [],
//       position: [],
//       type: [],
//       nationality: [],
//       jobLevel: [],
//       employee_id: [],
//       status: [],
//       start_date: '',
//       end_date: '',
//       search: ''
//     });
//     setActiveQuickDate(null);
//     setTimeout(() => setIsFiltering(false), 300);
//   };

//   // Sync internal filters to parent on change with loading indicator
//   useEffect(() => {
//     const updatedBaseFilters: Partial<BaseFilters> = {
//       company_id: filters.company_id.length > 0 ? filters.company_id.join(',') : undefined,
//       department_id: filters.department_id.length > 0 ? filters.department_id.join(',') : undefined,
//       employee_id: filters.employee_id.length > 0 ? filters.employee_id.join(',') : undefined,
//       status: filters.status.length > 0 ? filters.status.join(',') : undefined,
//       start_date: filters.start_date || undefined,
//       end_date: filters.end_date || undefined,
//       ...({
//         employee_status: filters.employee_status.length > 0 ? filters.employee_status.join(',') : undefined,
//         position: filters.position.length > 0 ? filters.position.join(',') : undefined,
//         employment_type: filters.type.length > 0 ? filters.type.join(',') : undefined,
//         nationality: filters.nationality.length > 0 ? filters.nationality.join(',') : undefined,
//         job_level: filters.jobLevel.length > 0 ? filters.jobLevel.join(',') : undefined,
//         search: filters.search || undefined
//       } as any)
//     };
//     onFilterChange(updatedBaseFilters);
//     setPage(1);
//   }, [filters, onFilterChange]);

//   const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
//     if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
//     if (value && key !== 'search') return count + 1;
//     return count;
//   }, 0);

//   const getStatusBadgeClass = (status: string) => {
//     switch (status?.toUpperCase()) {
//       case 'PRESENT': return 'badge-success';
//       case 'ABSENT': return 'badge-error';
//       case 'LATE': return 'badge-warning';
//       case 'PARTIAL': return 'badge-info';
//       case 'OFFDAY': return 'badge-secondary';
//       default: return 'badge-ghost';
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
//       {/* Global Loading Overlay */}
//       {(isFiltering || isPaging) && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
//           <div className={`p-6 rounded-xl shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//             <div className="flex flex-col items-center gap-4">
//               <div className="loading loading-spinner loading-lg text-primary"></div>
//               <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
//                 {isFiltering ? 'Applying filters...' : 'Loading page...'}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
//             Attendance Records
//           </h2>
//           <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
//             View and manage employee attendance records
//           </p>
//         </div>
        
//         <div className="flex gap-2 w-full sm:w-auto">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${
//               isFilterOpen 
//                 ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') 
//                 : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')
//             }`}
//             disabled={isFiltering}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//             </svg>
//             Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
//             {isFiltering && (
//               <div className="loading loading-spinner loading-xs ml-2"></div>
//             )}
//           </button>
//           <button
//             onClick={() => setIsExportModalOpen(true)}
//             className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${theme === 'light' ? 'btn-outline btn-primary' : 'btn-outline btn-info'}`}
//             disabled={isFiltering}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//             </svg>
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Quick Navigation */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
//         <div className="join shadow-sm overflow-x-auto w-full sm:w-auto">
//           <div className="flex gap-1 sm:gap-0">
//             {['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth'].map((opt) => (
//               <button 
//                 key={opt}
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === opt ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
//                 onClick={() => handleQuickDateSelect(opt)}
//                 disabled={isFiltering}
//               >
//                 {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/([A-Z])/g, ' $1')}
//               </button>
//             ))}
//             {activeQuickDate && (
//               <button 
//                 className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${theme === 'light' ? 'btn-error text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
//                 onClick={() => {
//                   setIsFiltering(true);
//                   setFilters(prev => ({ ...prev, start_date: '', end_date: '' }));
//                   setActiveQuickDate(null);
//                   setTimeout(() => setIsFiltering(false), 300);
//                 }}
//                 disabled={isFiltering}
//               >
//                 Clear Dates
//               </button>
//             )}
//           </div>
//         </div>
//         <div className="relative w-full sm:w-64">
//           <input
//             type="text"
//             placeholder="Search employee..."
//             className={`input input-sm sm:input-md input-bordered w-full pl-10 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//             value={filters.search}
//             onChange={(e) => enhancedFilterChange('search', e.target.value)}
//             disabled={isFiltering}
//           />
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//           {isFiltering && (
//             <div className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-spinner loading-xs"></div>
//           )}
//         </div>
//       </div>

//       {/* Advanced Filters */}
//       {isFilterOpen && (
//         <div className={`relative rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
//           <div className="px-6 py-5 border-b bg-slate-50">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-800">Advanced Filters</h2>
//                 <p className="text-slate-600 text-sm mt-1">Refine your attendance records with precision filters</p>
//               </div>
//               <div className="flex gap-2">
//                 <button 
//                   className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-300 transition-colors"
//                   onClick={() => setIsFilterOpen(false)}
//                   disabled={isFiltering}
//                 >
//                   Close
//                 </button>
//                 <button 
//                   className="px-4 py-2 text-sm bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors font-medium"
//                   onClick={resetFilters}
//                   disabled={isFiltering}
//                 >
//                   Reset All
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//               <ProfessionalMultiSelectFilter
//                 name="employee_status"
//                 value={filters.employee_status}
//                 options={employeeStatuses}
//                 onChange={enhancedFilterChange}
//                 placeholder="Employee Status"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="company_id"
//                 value={filters.company_id}
//                 options={companies}
//                 onChange={enhancedFilterChange}
//                 placeholder="Company"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="department_id"
//                 value={filters.department_id}
//                 options={departments}
//                 displayTransform={(item: any) => item.department_name || item.name}
//                 onChange={enhancedFilterChange}
//                 placeholder="Department"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="position"
//                 value={filters.position}
//                 options={positions}
//                 onChange={enhancedFilterChange}
//                 placeholder="Position"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="type"
//                 value={filters.type}
//                 options={employmentTypes}
//                 onChange={enhancedFilterChange}
//                 placeholder="Employment Type"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="nationality"
//                 value={filters.nationality}
//                 options={nationalities}
//                 onChange={enhancedFilterChange}
//                 placeholder="Nationality"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="jobLevel"
//                 value={filters.jobLevel}
//                 options={jobLevels}
//                 onChange={enhancedFilterChange}
//                 placeholder="Job Level"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="employee_id"
//                 value={filters.employee_id}
//                 options={employees}
//                 onChange={enhancedFilterChange}
//                 placeholder="Employee"
//                 theme={theme}
//               />
//               <ProfessionalMultiSelectFilter
//                 name="status"
//                 value={filters.status}
//                 options={statuses}
//                 onChange={enhancedFilterChange}
//                 placeholder="Attendance Status"
//                 theme={theme}
//               />
//               <DateRangeFilter
//                 title="Attendance Date Range"
//                 startDate={filters.start_date}
//                 endDate={filters.end_date}
//                 onStartChange={(date) => enhancedFilterChange('start_date', date)}
//                 onEndChange={(date) => enhancedFilterChange('end_date', date)}
//                 onClear={() => {
//                   enhancedFilterChange('start_date', '');
//                   enhancedFilterChange('end_date', '');
//                 }}
//                 theme={theme}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Attendance Table */}
//       <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//         {isLoading || isFiltering || isPaging ? (
//           <div className="p-8 text-center">
//             <div className="loading loading-spinner loading-lg mx-auto"></div>
//             <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//               {isLoading ? 'Loading attendance records...' : 
//                isFiltering ? 'Applying filters...' : 
//                'Loading page...'}
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
//                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Position</th>
//                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Company</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check In</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check Out</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Worked Hours</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-in IP Details</th>
//                     <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-out IP Details</th>
//                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Office</th>
//                     {/* Whitelist CIDR column removed from UI as requested */}
//                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Timezone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((item) => {
//                     const checkInISO = item.first_check_in_time_local_iso || item.check_in_time;
//                     const checkOutISO = item.last_check_out_time_local_iso || item.check_out_time;
//                     const worked = item.daily_worked_hours || item.worked_hours || '--';

//                     return (
//                       <tr
//                         key={item.attendance_day_id || `${item.employee_id}-${item.attendance_date}-${item.pair_number || 1}`}
//                         className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
//                       >
//                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
//                           <div>
//                             <div className="font-medium">{item.employee_name}</div>
//                             <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
//                               {item.employee_no}
//                             </div>
//                           </div>
//                         </td>
//                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.department || '--'}</td>
//                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.position || '--'}</td>
//                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.company_name}</td>
//                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatDate(item.attendance_date)}</td>
//                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatTime(checkInISO)}</td>
//                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatTime(checkOutISO)}</td>
//                         <td className="text-center">
//                           <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
//                           {item.has_issue ? <div className="text-xs mt-1 text-warning">Issue</div> : null}
//                         </td>
//                         <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{worked}</td>
//                         <td>
//                           {item.check_in_ip || item.check_in_public_ip ? (
//                             <div className="text-xs space-y-1">
//                               {item.check_in_public_ip && (
//                                 <div><span className="font-medium">Public: </span><span className="font-mono">{item.check_in_public_ip}</span></div>
//                               )}
//                               {item.check_in_ip_match_status && (
//                                 <div className="space-y-1 mt-1">
//                                   <div className="flex items-center gap-1 flex-wrap">
//                                     <span className={`badge badge-xs ${
//                                       item.check_in_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
//                                       item.check_in_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
//                                       item.check_in_ip_match_status === 'NO_IP' ? 'badge-warning' : 
//                                       item.check_in_ip_match_status === 'NO_EVENT' ? 'badge-neutral' : 'badge-warning'
//                                     }`}>
//                                       {getIPStatusDisplay(item.check_in_ip_match_status)}
//                                     </span>
//                                     {item.check_in_ip_used_override ? <span className="badge badge-xs badge-info">Override</span> : null}
//                                   </div>
//                                   {item.check_in_ip_matched_rule ? (
//                                     <div className="text-xs opacity-70 truncate cursor-help" title={item.check_in_ip_matched_rule}>{item.check_in_ip_matched_rule}</div>
//                                   ) : null}
//                                 </div>
//                               )}
//                               {/* {item.check_in_ip_policy_mode && (
//                                 <div className="text-xs opacity-70">
//                                   Policy: {getPolicyDisplay(item.check_in_ip_policy_mode, item.check_in_ip_match_status)}
//                                 </div>
//                               )} */}
//                               {item.employee_override_ip && item.employee_override_active ? (
//                                 <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
//                                   Override: {item.employee_override_ip}{item.employee_override_label ? ` (${item.employee_override_label})` : ''}
//                                 </div>
//                               ) : null}
//                             </div>
//                           ) : <span className="text-xs text-gray-500">No IP data</span>}
//                         </td>
//                         <td>
//                           {item.check_out_ip || item.check_out_public_ip ? (
//                             <div className="text-xs space-y-1">
//                               {item.check_out_public_ip && (
//                                 <div><span className="font-medium">Public: </span><span className="font-mono">{item.check_out_public_ip}</span></div>
//                               )}
//                               {item.check_out_ip_match_status && (
//                                 <div className="space-y-1 mt-1">
//                                   <div className="flex items-center gap-1 flex-wrap">
//                                     <span className={`badge badge-xs ${
//                                       item.check_out_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
//                                       item.check_out_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
//                                       item.check_out_ip_match_status === 'NO_IP' ? 'badge-warning' : 
//                                       item.check_out_ip_match_status === 'NO_EVENT' ? 'badge-neutral' : 'badge-warning'
//                                     }`}>
//                                       {getIPStatusDisplay(item.check_out_ip_match_status)}
//                                     </span>
//                                     {item.check_out_ip_used_override ? <span className="badge badge-xs badge-info">Override</span> : null}
//                                   </div>
//                                   {item.check_out_ip_matched_rule ? (
//                                     <div className="text-xs opacity-70 truncate cursor-help" title={item.check_out_ip_matched_rule}>{item.check_out_ip_matched_rule}</div>
//                                   ) : null}
//                                 </div>
//                               )}
//                               {/* {item.check_out_ip_policy_mode && (
//                                 <div className="text-xs opacity-70">
//                                   Policy: {getPolicyDisplay(item.check_out_ip_policy_mode, item.check_out_ip_match_status)}
//                                 </div>
//                               )} */}
//                               {item.employee_override_ip && item.employee_override_active ? (
//                                 <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
//                                   Override: {item.employee_override_ip}{item.employee_override_label ? ` (${item.employee_override_label})` : ''}
//                                 </div>
//                               ) : null}
//                             </div>
//                           ) : <span className="text-xs text-gray-500">No IP data</span>}
//                         </td>
//                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.office_name || '--'}</td>
//                         {/* Whitelist CIDR cell removed from UI as requested */}
//                         <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.employee_timezone || '--'}</td>
//                       </tr>
//                     );
//                   })}
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
//                       onClick={() => enhancedPageChange(Math.max(1, page - 1))}
//                       disabled={page === 1 || isPaging || isFiltering}
//                     >
//                       {isPaging && page === 1 ? (
//                         <div className="loading loading-spinner loading-xs"></div>
//                       ) : 'Previous'}
//                     </button>
//                     <button className="join-item btn btn-sm btn-disabled">
//                       Page {page}
//                     </button>
//                     <button
//                       className="join-item btn btn-sm"
//                       onClick={() => enhancedPageChange(page + 1)}
//                       disabled={page * limit >= total || isPaging || isFiltering}
//                     >
//                       {isPaging ? (
//                         <div className="loading loading-spinner loading-xs"></div>
//                       ) : 'Next'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="p-8 text-center">
//             <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
//               No attendance records found for the selected filters.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Export Modal */}
//       {isExportModalOpen && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => !isExporting && setIsExportModalOpen(false)}
//           />
//           <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//             <div className="px-6 py-4 border-b flex items-center justify-between">
//               <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Export Attendance Records</h3>
//               <button 
//                 onClick={() => setIsExportModalOpen(false)}
//                 disabled={isExporting}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Export Scope */}
//               <div>
//                 <label className={`block text-sm font-semibold mb-3 uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//                   Export Scope
//                 </label>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <button
//                     onClick={() => setExportScope('filtered')}
//                     className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
//                       exportScope === 'filtered'
//                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                         : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'filtered' ? 'border-blue-500' : 'border-gray-300'}`}>
//                       {exportScope === 'filtered' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
//                     </div>
//                     <div className="text-left">
//                       <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>All Filtered Results</div>
//                       <div className="text-xs text-gray-500">Export all {total} records matching filters</div>
//                     </div>
//                   </button>
//                   <button
//                     onClick={() => setExportScope('current')}
//                     className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
//                       exportScope === 'current'
//                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                         : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'current' ? 'border-blue-500' : 'border-gray-300'}`}>
//                       {exportScope === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
//                     </div>
//                     <div className="text-left">
//                       <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Current Page Only</div>
//                       <div className="text-xs text-gray-500">Export only the {data?.length || 0} records on this page</div>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Column Selection */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className={`text-sm font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//                     Select Columns
//                   </label>
//                   <div className="flex gap-3">
//                     <button 
//                       onClick={() => setSelectedColumns(exportColumns.map(c => c.id))}
//                       className="text-xs text-blue-600 hover:underline font-medium"
//                     >
//                       Select All
//                     </button>
//                     <button 
//                       onClick={() => setSelectedColumns(['employee_name', 'attendance_date', 'status'])}
//                       className="text-xs text-gray-500 hover:underline font-medium"
//                     >
//                       Reset
//                     </button>
//                   </div>
//                 </div>
//                 <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-900/50 border-slate-700'}`}>
//                   {exportColumns.map(col => (
//                     <label key={col.id} className="flex items-center gap-2 cursor-pointer group">
//                       <input
//                         type="checkbox"
//                         className="checkbox checkbox-sm checkbox-primary"
//                         checked={selectedColumns.includes(col.id)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setSelectedColumns([...selectedColumns, col.id]);
//                           } else {
//                             setSelectedColumns(selectedColumns.filter(id => id !== col.id));
//                           }
//                         }}
//                       />
//                       <span className={`text-sm group-hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
//                         {col.label}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className={`px-6 py-4 border-t flex justify-end gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800/50'}`}>
//               <button
//                 onClick={() => setIsExportModalOpen(false)}
//                 disabled={isExporting}
//                 className={`btn btn-ghost ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={async () => {
//                   setIsExporting(true);
//                   try {
//                     const queryParams = new URLSearchParams();
//                     Object.entries(baseFilters).forEach(([key, value]) => {
//                       if (value) queryParams.append(key, String(value));
//                     });
                    
//                     if (exportScope === 'current') {
//                       queryParams.append('page', String(page));
//                       queryParams.append('limit', String(limit));
//                     }
                    
//                     queryParams.append('columns', selectedColumns.join(','));
                    
//                     const response = await fetch(`${API_BASE_URL}/api/attendance/export?${queryParams.toString()}`, {
//                       headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
//                       }
//                     });
                    
//                     if (!response.ok) throw new Error('Export failed');
                    
//                     const blob = await response.blob();
//                     const url = window.URL.createObjectURL(blob);
//                     const a = document.createElement('a');
//                     a.href = url;
//                     a.download = `attendance_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
//                     document.body.appendChild(a);
//                     a.click();
//                     window.URL.revokeObjectURL(url);
//                     document.body.removeChild(a);
                    
//                     onShowNotification('Export successful', 'success');
//                     setIsExportModalOpen(false);
//                   } catch (err) {
//                     onShowNotification('Export failed. Please try again.', 'error');
//                   } finally {
//                     setIsExporting(false);
//                   }
//                 }}
//                 disabled={isExporting || selectedColumns.length === 0}
//                 className={`btn btn-primary min-w-[120px] ${isExporting ? 'loading' : ''}`}
//               >
//                 {isExporting ? 'Exporting...' : 'Download XLSX'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
import { useTheme } from '../../components/ThemeProvider';
import type { Filters as BaseFilters } from '../../utils/attendanceApi';
import { format } from 'date-fns';
import { FaChevronDown, FaRegCalendarTimes } from "react-icons/fa";
import { BsCheckCircle, BsXCircle, BsEye } from "react-icons/bs";
import { API_BASE_URL } from '@/app/config';

// --- Interfaces ---

interface FilterOptionItem {
  id: string | number;
  name: string;
}

interface Filters {
  employee_status: string[];
  company_id: string[];
  department_id: string[];
  position: string[];
  type: string[];
  nationality: string[];
  jobLevel: string[];
  employee_id: string[];
  status: string[];
  start_date: string;
  end_date: string;
  search: string;
}

type CompanyOption = {
  id: number;
  name: string;
};

type DepartmentOption = {
  id: number;
  department_name: string;
};

interface StatusOption {
  id: string | number;
  name: string;
  code?: string;
  display_name?: string;
}

interface AttendanceRecordFlat {
  employee_name: string;
  employee_no: string;
  company_name: string;
  department: string | null;
  position: string | null;

  attendance_date: string | null;

  check_in_time: string | null;
  check_out_time: string | null;

  first_check_in_time_local_iso: string | null;
  last_check_out_time_local_iso: string | null;

  daily_worked_hours: string | null;
  daily_worked_hours_decimal: string | null;
  daily_worked_hours_minutes: number | null;

  worked_hours: string | null;
  worked_hours_decimal: string | null;
  worked_hours_minutes: number | null;

  status: string;

  attendance_day_id: number;
  employee_id: number;

  amend_date: string | null;
  amend_by: string | null;

  employee_timezone: string | null;
  pair_number: number | null;

  check_in_ip: string | null;
  check_in_public_ip: string | null;
  check_in_ip_match_status: string | null;
  check_in_ip_policy_mode: string | null;

  check_out_ip: string | null;
  check_out_public_ip: string | null;
  check_out_ip_match_status: string | null;
  check_out_ip_policy_mode: string | null;

  has_issue: boolean | null;
  office_name: string | null;
  whitelisted_cidr: string | null;

  check_in_ip_used_override?: boolean | null;
  check_in_ip_matched_rule?: string | null;

  check_out_ip_used_override?: boolean | null;
  check_out_ip_matched_rule?: string | null;

  employee_override_ip?: string | null;
  employee_override_active?: boolean | null;
  employee_override_label?: string | null;
}

interface AttendanceTabProps {
  filters: BaseFilters;
  onFilterChange: (filters: Partial<BaseFilters>) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  user: any;
}

// --- Helper Functions ---

function normalizeStatusForFilter(status: string): string {
  if (!status) return status;
  
  const statusMap: Record<string, string> = {
    'Present': 'PRESENT',
    'Absent': 'ABSENT',
    'Late': 'LATE',
    'Partial': 'PARTIAL',
    'Off Day': 'OFFDAY',
    'Off-Day': 'OFFDAY',
    'Partial/Incomplete': 'PARTIAL',
    'Early Departure': 'PARTIAL',
    'Half Day': 'PARTIAL'
  };
  
  return statusMap[status] || status.toUpperCase();
}

function normalizeStatusForDisplay(status: string): string {
  if (!status) return 'Unknown';
  
  const statusUpper = status.toUpperCase();
  
  switch (statusUpper) {
    case 'PRESENT':
      return 'Present';
    case 'ABSENT':
      return 'Absent';
    case 'LATE':
      return 'Late';
    case 'PARTIAL':
      return 'Partial';
    case 'OFFDAY':
      return 'Off Day';
    case 'EARLY_DEPARTURE':
      return 'Early Departure';
    case 'HALF_DAY':
      return 'Half Day';
    default:
      return status;
  }
}

// --- Helper Components ---

const ProfessionalMultiSelectFilter = ({ 
  name, 
  value, 
  options, 
  onChange, 
  placeholder,
  displayTransform = (item: string | FilterOptionItem) => typeof item === 'string' ? item : item.name,
  theme = 'light'
}: { 
  name: keyof Filters;
  value: string[];
  options: (string | FilterOptionItem | undefined | null)[];
  onChange: (name: keyof Filters, value: string[]) => void;
  placeholder: string;
  displayTransform?: (item: string | FilterOptionItem) => string;
  theme?: 'light' | 'dark';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedFromBottom, setClickedFromBottom] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const validOptions = useMemo(() => {
    return options
      .filter((option): option is string | FilterOptionItem => 
        option !== undefined && option !== null && option !== ''
      )
      .map(option => {
        if (typeof option === 'string') {
          return { id: option, name: option };
        }
        return {
          id: String(option.id),
          name: String(option.name || option.id)
        };
      });
  }, [options]);

  const optionMap = useMemo(() => {
    const map = new Map<string, string>();
    validOptions.forEach(option => {
      const displayName = displayTransform({ id: option.id, name: option.name });
      map.set(option.id, displayName);
    });
    return map;
  }, [validOptions, displayTransform]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return validOptions;
    return validOptions.filter(option => {
      const displayName = optionMap.get(option.id) || option.name;
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [validOptions, searchTerm, optionMap]);

  const handleToggle = useCallback((optionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const newValue = value.includes(optionId)
      ? value.filter(v => v !== optionId)
      : [...value, optionId];
    
    onChange(name, newValue);
    setClickedFromBottom(optionId);
  }, [value, name, onChange]);

  const handleSelectAll = useCallback(() => {
    const allIds = validOptions.map(option => option.id);
    onChange(name, allIds);
  }, [validOptions, name, onChange]);

  const handleClear = useCallback(() => {
    onChange(name, []);
  }, [name, onChange]);

  const selectedPercentage = validOptions.length > 0 
    ? Math.round((value.length / validOptions.length) * 100) 
    : 0;

  const handleApply = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setClickedFromBottom(null);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (clickedFromBottom && optionsContainerRef.current) {
      const clickedElement = document.getElementById(`option-${clickedFromBottom}`);
      if (clickedElement) {
        clickedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [clickedFromBottom]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleApply();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleApply]);

  const renderSelectedItems = () => {
    if (value.length === 0) {
      return (
        <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Select {placeholder.toLowerCase()}...
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {value.slice(0, 2).map(val => {
          const displayName = optionMap.get(val) || val;
          return (
            <span 
              key={`selected-${val}`}
              className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
            >
              {displayName}
            </span>
          );
        })}
        {value.length > 2 && (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
            +{value.length - 2} more
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="form-control w-full">
        <label className="label pb-3">
          <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {placeholder}
          </span>
        </label>
        
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
            theme === 'light' 
              ? 'bg-white border-slate-200 hover:border-slate-300' 
              : 'bg-slate-800 border-slate-600 hover:border-slate-500'
          } ${
            value.length > 0 
              ? 'border-blue-500 bg-blue-50 shadow-sm' 
              : ''
          }`}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <div className="flex flex-col items-start flex-1 min-w-0">
            {renderSelectedItems()}
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {value.length > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-blue-600">{value.length} selected</span>
                <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${selectedPercentage}%` }}
                  />
                </div>
              </div>
            )}
            <div className={`w-2 h-2 border-r-2 border-b-2 border-slate-400 transform transition-transform duration-200 ${
              isOpen ? 'rotate-45 -translate-y-0.5' : '-rotate-45 translate-y-0.5'
            }`} />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleApply}
            aria-hidden="true"
          />
          
          <div 
            ref={modalRef}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden z-10"
          >
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Choose multiple options to filter your results
                </p>
              </div>
              <button 
                onClick={handleApply}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                type="button"
                aria-label="Close modal"
              >
                <div className="w-4 h-4 relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform -rotate-45" />
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform rotate-45" />
                </div>
              </button>
            </div>

            <div className="p-4 border-b bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="form-control flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={`Search ${placeholder.toLowerCase()}...`}
                    className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={`Search ${placeholder}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold">{value.length}</span> of{' '}
                    <span className="font-semibold">{validOptions.length}</span> selected
                  </div>
                  <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${selectedPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={value.length === validOptions.length}
                    type="button"
                  >
                    Select All
                  </button>
                  {value.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
                      type="button"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div 
              ref={optionsContainerRef}
              className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] bg-white"
              onScroll={() => setClickedFromBottom(null)}
            >
              {filteredOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-0.5 bg-slate-400 rotate-45 absolute" />
                    <div className="w-6 h-0.5 bg-slate-400 -rotate-45 absolute" />
                  </div>
                  <h4 className="font-semibold text-slate-700 mb-2">No options found</h4>
                  <p className="text-slate-500 text-sm">
                    {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredOptions.map((option) => {
                    const displayName = optionMap.get(option.id) || option.name;
                    const isSelected = value.includes(option.id);
                    
                    return (
                      <div
                        key={`${name}-${option.id}`}
                        id={`option-${option.id}`}
                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(option.id, e);
                        }}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                      >
                        <div 
                          className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-slate-800 break-words">
                            {displayName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="h-4" />
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{value.length}</span> options selected
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                    type="button"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DateRangeFilter = ({
  title,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onClear,
  theme = 'light'
}: {
  title: string;
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  onClear: () => void;
  theme?: 'light' | 'dark';
}) => {
  return (
    <div className="form-control w-full">
      <label className="label pb-3">
        <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
          {title}
        </span>
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="date"
          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
        />
        <span className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>to</span>
        <input
          type="date"
          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          disabled={!startDate}
        />
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={onClear}
            className={`btn btn-sm ${theme === 'light' ? 'btn-ghost' : 'btn-outline'}`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

function safeFormatDate(dateStr?: string | null, fmt: string = 'MMM dd, yyyy') {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return format(d, fmt);
}

function safeFormatTime(dateStr?: string | null, fmt: string = 'HH:mm') {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '--';
  return format(d, fmt);
}

function getIPStatusDisplay(status?: string | null) {
  if (!status) return 'Unknown';
  switch (status) {
    case 'IN_WHITELIST':
      return 'In Whitelist';
    case 'NOT_IN_WHITELIST':
      return 'Not Whitelist';
    case 'NO_IP':
      return 'No IP';
    case 'NO_EVENT':
      return 'No Event';
    default:
      return status;
  }
}

export default function AttendanceTab({
  filters: baseFilters,
  onFilterChange,
  onShowNotification,
  user
}: AttendanceTabProps) {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportScope, setExportScope] = useState<'filtered' | 'current'>('filtered');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'employee_name', 'employee_no', 'company_name', 'department', 'position', 
    'attendance_date', 'check_in_time', 'check_out_time', 'status', 'worked_hours'
  ]);

  // State for loading indicators
  const [isFiltering, setIsFiltering] = useState(false);
  const [isPaging, setIsPaging] = useState(false);

  const exportColumns = [
    { id: 'employee_name', label: 'Employee Name' },
    { id: 'employee_no', label: 'Employee No' },
    { id: 'company_name', label: 'Company' },
    { id: 'department', label: 'Department' },
    { id: 'position', label: 'Position' },
    { id: 'attendance_date', label: 'Date' },
    { id: 'check_in_time', label: 'Check In' },
    { id: 'check_out_time', label: 'Check Out' },
    { id: 'status', label: 'Status' },
    { id: 'worked_hours', label: 'Worked Hours' },
    { id: 'check_in_ip', label: 'Check-in IP' },
    { id: 'check_out_ip', label: 'Check-out IP' },
    { id: 'office_name', label: 'Office' }
  ];

  // Initialize internal filters state from baseFilters
  const [filters, setFilters] = useState<Filters>({
    employee_status: [],
    company_id: baseFilters.company_id ? [String(baseFilters.company_id)] : [],
    department_id: baseFilters.department_id ? [String(baseFilters.department_id)] : [],
    position: [],
    type: [],
    nationality: [],
    jobLevel: [],
    employee_id: baseFilters.employee_id ? [String(baseFilters.employee_id)] : [],
    status: baseFilters.status ? [String(baseFilters.status)] : [],
    start_date: baseFilters.start_date || '',
    end_date: baseFilters.end_date || '',
    search: ''
  });

  // Fetch attendance data
  const { data, total, isLoading, isFetching, error } = useAttendanceData<AttendanceRecordFlat>(
    'attendance',
    baseFilters,
    page,
    limit
  );

  // Fetch filter options
  const { options: filterOptions } = useFilterOptions('all', baseFilters.company_id, false);

  const companies = useMemo(() => (filterOptions as any)?.companies || [], [filterOptions]);
  const departments = useMemo(() => (filterOptions as any)?.departments || [], [filterOptions]);
  const statuses = useMemo(() => (filterOptions as any)?.statuses || [], [filterOptions]);
  const employees = useMemo(() => (filterOptions as any)?.employees || [], [filterOptions]);
  
  const employeeStatuses = ['Active', 'Inactive', 'Resigned'];
  const positions = useMemo(() => (filterOptions as any)?.positions || [], [filterOptions]);
  const employmentTypes = useMemo(() => (filterOptions as any)?.employment_types || [], [filterOptions]);
  const nationalities = useMemo(() => (filterOptions as any)?.nationalities || [], [filterOptions]);
  const jobLevels = useMemo(() => (filterOptions as any)?.job_levels || [], [filterOptions]);

// Then update the useEffect:
useEffect(() => {
  console.log('🔍 Status Options from API:', {
    rawStatuses: statuses,
    statusCount: statuses.length,
    firstStatus: statuses[0],
    allStatuses: statuses.map((s: StatusOption) => ({
      id: s.id,
      name: s.name,
      code: s.code || 'No code'
    }))
  });
}, [statuses]);

  // Debug: Log current filters
  useEffect(() => {
    console.log('🔍 Current Filters State:', {
      filters: filters,
      statusFilter: filters.status,
      statusFilterLength: filters.status.length,
      baseFilters: baseFilters
    });
  }, [filters, baseFilters]);

  const handleFilterChange = useCallback((name: keyof Filters, value: any) => {
    console.log(`🔄 Filter Change: ${name} =`, value);
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle quick date selection
  const handleQuickDateSelect = (option: string) => {
    setIsFiltering(true);
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (option) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(new Date().setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        const dayOfWeek = today.getDay();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastWeek':
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        startDate = new Date(lastWeekEnd);
        startDate.setDate(lastWeekEnd.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = lastWeekEnd;
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        setActiveQuickDate(null);
        setIsFiltering(false);
        return;
    }
    
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    setFilters(prev => ({
      ...prev,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    }));
    
    setActiveQuickDate(option);
    setTimeout(() => setIsFiltering(false), 500);
  };

  // Enhanced filter change handler
  const enhancedFilterChange = useCallback((name: keyof Filters, value: any) => {
    console.log(`🎯 Enhanced Filter Change: ${name} =`, value);
    
    if (name === 'status') {
      console.log('🎯 Status filter change details:', {
        rawValue: value,
        normalizedValue: Array.isArray(value) 
          ? value.map(v => normalizeStatusForFilter(v))
          : normalizeStatusForFilter(value),
        statusOptions: statuses
      });
    }
    
    setIsFiltering(true);
    handleFilterChange(name, value);
    setTimeout(() => setIsFiltering(false), 300);
  }, [handleFilterChange, statuses]);

  // Enhanced page change handler
  const enhancedPageChange = useCallback((newPage: number) => {
    setIsPaging(true);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsPaging(false), 300);
  }, []);

  const resetFilters = () => {
    setIsFiltering(true);
    setFilters({
      employee_status: [],
      company_id: [],
      department_id: [],
      position: [],
      type: [],
      nationality: [],
      jobLevel: [],
      employee_id: [],
      status: [],
      start_date: '',
      end_date: '',
      search: ''
    });
    setActiveQuickDate(null);
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Sync internal filters to parent on change
  useEffect(() => {
    console.log('🔄 Syncing filters to parent:', {
      currentFilters: filters,
      statusFilter: filters.status
    });
    
    // Normalize status values before sending to API
    const normalizedStatus = filters.status.length > 0 
      ? filters.status.map(s => normalizeStatusForFilter(s))
      : [];
    
    const updatedBaseFilters: Partial<BaseFilters> = {
      company_id: filters.company_id.length > 0 ? filters.company_id.join(',') : undefined,
      department_id: filters.department_id.length > 0 ? filters.department_id.join(',') : undefined,
      employee_id: filters.employee_id.length > 0 ? filters.employee_id.join(',') : undefined,
      status: normalizedStatus.length > 0 ? normalizedStatus.join(',') : undefined,
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      ...({
        employee_status: filters.employee_status.length > 0 ? filters.employee_status.join(',') : undefined,
        position: filters.position.length > 0 ? filters.position.join(',') : undefined,
        employment_type: filters.type.length > 0 ? filters.type.join(',') : undefined,
        nationality: filters.nationality.length > 0 ? filters.nationality.join(',') : undefined,
        job_level: filters.jobLevel.length > 0 ? filters.jobLevel.join(',') : undefined,
        search: filters.search || undefined
      } as any)
    };
    
    console.log('📤 Sending to API:', updatedBaseFilters);
    
    onFilterChange(updatedBaseFilters);
    setPage(1);
  }, [filters, onFilterChange]);

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
    if (value && key !== 'search') return count + 1;
    return count;
  }, 0);

  const getStatusBadgeClass = (status: string) => {
    const normalizedStatus = normalizeStatusForFilter(status);
    switch (normalizedStatus) {
      case 'PRESENT': return 'badge-success';
      case 'ABSENT': return 'badge-error';
      case 'LATE': return 'badge-warning';
      case 'PARTIAL': return 'badge-info';
      case 'OFFDAY': return 'badge-secondary';
      default: return 'badge-ghost';
    }
  };

  // Debug: Log data received from API
  useEffect(() => {
    if (data && data.length > 0) {
      console.log('📊 Data from API:', {
        recordCount: data.length,
        sampleRecord: data[0],
        allStatuses: [...new Set(data.map(d => d.status))],
        statusCounts: data.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
    }
  }, [data]);

  if (error) {
    return (
      <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-800'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${theme === 'light' ? 'text-yellow-800' : 'text-yellow-300'}`}>
              🐛 Debug Panel
            </h3>
          </div>
          <div className="text-xs space-y-1">
            <div><strong>Status Options:</strong> {statuses.length}</div>
            <div><strong>Current Status Filter:</strong> {JSON.stringify(filters.status)}</div>
            <div><strong>Base Filters Status:</strong> {baseFilters.status || 'None'}</div>
            <div><strong>Data Count:</strong> {data?.length || 0}</div>
            <div><strong>Unique Statuses in Data:</strong> 
              {data ? [...new Set(data.map(d => d.status))].join(', ') : 'No data'}
            </div>
          </div>
        </div>
      )}

      {/* Global Loading Overlay */}
      {(isFiltering || isPaging) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className={`p-6 rounded-xl shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                {isFiltering ? 'Applying filters...' : 'Loading page...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
            Attendance Records
          </h2>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
            View and manage employee attendance records
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${
              isFilterOpen 
                ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') 
                : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')
            }`}
            disabled={isFiltering}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            {isFiltering && (
              <div className="loading loading-spinner loading-xs ml-2"></div>
            )}
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${theme === 'light' ? 'btn-outline btn-primary' : 'btn-outline btn-info'}`}
            disabled={isFiltering}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="join shadow-sm overflow-x-auto w-full sm:w-auto">
          <div className="flex gap-1 sm:gap-0">
            {['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth'].map((opt) => (
              <button 
                key={opt}
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === opt ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect(opt)}
                disabled={isFiltering}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
            {activeQuickDate && (
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${theme === 'light' ? 'btn-error text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                onClick={() => {
                  setIsFiltering(true);
                  setFilters(prev => ({ ...prev, start_date: '', end_date: '' }));
                  setActiveQuickDate(null);
                  setTimeout(() => setIsFiltering(false), 300);
                }}
                disabled={isFiltering}
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search employee..."
            className={`input input-sm sm:input-md input-bordered w-full pl-10 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
            value={filters.search}
            onChange={(e) => enhancedFilterChange('search', e.target.value)}
            disabled={isFiltering}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {isFiltering && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-spinner loading-xs"></div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className={`relative rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
          <div className="px-6 py-5 border-b bg-slate-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Advanced Filters</h2>
                <p className="text-slate-600 text-sm mt-1">Refine your attendance records with precision filters</p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-300 transition-colors"
                  onClick={() => setIsFilterOpen(false)}
                  disabled={isFiltering}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 text-sm bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors font-medium"
                  onClick={resetFilters}
                  disabled={isFiltering}
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <ProfessionalMultiSelectFilter
                name="employee_status"
                value={filters.employee_status}
                options={employeeStatuses}
                onChange={enhancedFilterChange}
                placeholder="Employee Status"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="company_id"
                value={filters.company_id}
                options={companies}
                onChange={enhancedFilterChange}
                placeholder="Company"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="department_id"
                value={filters.department_id}
                options={departments}
                displayTransform={(item: any) => item.department_name || item.name}
                onChange={enhancedFilterChange}
                placeholder="Department"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="position"
                value={filters.position}
                options={positions}
                onChange={enhancedFilterChange}
                placeholder="Position"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="type"
                value={filters.type}
                options={employmentTypes}
                onChange={enhancedFilterChange}
                placeholder="Employment Type"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="nationality"
                value={filters.nationality}
                options={nationalities}
                onChange={enhancedFilterChange}
                placeholder="Nationality"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="jobLevel"
                value={filters.jobLevel}
                options={jobLevels}
                onChange={enhancedFilterChange}
                placeholder="Job Level"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="employee_id"
                value={filters.employee_id}
                options={employees}
                onChange={enhancedFilterChange}
                placeholder="Employee"
                theme={theme}
              />
              {/* Fixed Status Filter */}
              <ProfessionalMultiSelectFilter
                name="status"
                value={filters.status}
                options={statuses}
                displayTransform={(item: any) => {
                  // Prioritize code if available, otherwise use name
                  if (item && typeof item === 'object') {
                    return item.code || item.name || String(item.id);
                  }
                  return String(item);
                }}
                onChange={enhancedFilterChange}
                placeholder="Attendance Status"
                theme={theme}
              />
              <DateRangeFilter
                title="Attendance Date Range"
                startDate={filters.start_date}
                endDate={filters.end_date}
                onStartChange={(date) => enhancedFilterChange('start_date', date)}
                onEndChange={(date) => enhancedFilterChange('end_date', date)}
                onClear={() => {
                  enhancedFilterChange('start_date', '');
                  enhancedFilterChange('end_date', '');
                }}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        {isLoading || isFiltering || isPaging ? (
          <div className="p-8 text-center">
            <div className="loading loading-spinner loading-lg mx-auto"></div>
            <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
              {isLoading ? 'Loading attendance records...' : 
               isFiltering ? 'Applying filters...' : 
               'Loading page...'}
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
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Position</th>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Company</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Date</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check In</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Check Out</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Worked Hours</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-in IP Details</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Check-out IP Details</th>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Office</th>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Timezone</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    const checkInISO = item.first_check_in_time_local_iso || item.check_in_time;
                    const checkOutISO = item.last_check_out_time_local_iso || item.check_out_time;
                    const worked = item.daily_worked_hours || item.worked_hours || '--';

                    return (
                      <tr
                        key={item.attendance_day_id || `${item.employee_id}-${item.attendance_date}-${item.pair_number || 1}`}
                        className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
                      >
                        <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
                          <div>
                            <div className="font-medium">{item.employee_name}</div>
                            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                              {item.employee_no}
                            </div>
                          </div>
                        </td>
                        <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.department || '--'}</td>
                        <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.position || '--'}</td>
                        <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.company_name}</td>
                        <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatDate(item.attendance_date)}</td>
                        <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatTime(checkInISO)}</td>
                        <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{safeFormatTime(checkOutISO)}</td>
                        <td className="text-center">
                          <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                            {normalizeStatusForDisplay(item.status)}
                          </span>
                          {item.has_issue ? <div className="text-xs mt-1 text-warning">Issue</div> : null}
                        </td>
                        <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{worked}</td>
                        <td>
                          {item.check_in_ip || item.check_in_public_ip ? (
                            <div className="text-xs space-y-1">
                              {item.check_in_public_ip && (
                                <div><span className="font-medium">Public: </span><span className="font-mono">{item.check_in_public_ip}</span></div>
                              )}
                              {item.check_in_ip_match_status && (
                                <div className="space-y-1 mt-1">
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className={`badge badge-xs ${
                                      item.check_in_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
                                      item.check_in_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
                                      item.check_in_ip_match_status === 'NO_IP' ? 'badge-warning' : 
                                      item.check_in_ip_match_status === 'NO_EVENT' ? 'badge-neutral' : 'badge-warning'
                                    }`}>
                                      {getIPStatusDisplay(item.check_in_ip_match_status)}
                                    </span>
                                    {item.check_in_ip_used_override ? <span className="badge badge-xs badge-info">Override</span> : null}
                                  </div>
                                  {item.check_in_ip_matched_rule ? (
                                    <div className="text-xs opacity-70 truncate cursor-help" title={item.check_in_ip_matched_rule}>{item.check_in_ip_matched_rule}</div>
                                  ) : null}
                                </div>
                              )}
                              {item.employee_override_ip && item.employee_override_active ? (
                                <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
                                  Override: {item.employee_override_ip}{item.employee_override_label ? ` (${item.employee_override_label})` : ''}
                                </div>
                              ) : null}
                            </div>
                          ) : <span className="text-xs text-gray-500">No IP data</span>}
                        </td>
                        <td>
                          {item.check_out_ip || item.check_out_public_ip ? (
                            <div className="text-xs space-y-1">
                              {item.check_out_public_ip && (
                                <div><span className="font-medium">Public: </span><span className="font-mono">{item.check_out_public_ip}</span></div>
                              )}
                              {item.check_out_ip_match_status && (
                                <div className="space-y-1 mt-1">
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className={`badge badge-xs ${
                                      item.check_out_ip_match_status === 'IN_WHITELIST' ? 'badge-success' : 
                                      item.check_out_ip_match_status === 'NOT_IN_WHITELIST' ? 'badge-error' : 
                                      item.check_out_ip_match_status === 'NO_IP' ? 'badge-warning' : 
                                      item.check_out_ip_match_status === 'NO_EVENT' ? 'badge-neutral' : 'badge-warning'
                                    }`}>
                                      {getIPStatusDisplay(item.check_out_ip_match_status)}
                                    </span>
                                    {item.check_out_ip_used_override ? <span className="badge badge-xs badge-info">Override</span> : null}
                                  </div>
                                  {item.check_out_ip_matched_rule ? (
                                    <div className="text-xs opacity-70 truncate cursor-help" title={item.check_out_ip_matched_rule}>{item.check_out_ip_matched_rule}</div>
                                  ) : null}
                                </div>
                              )}
                              {item.employee_override_ip && item.employee_override_active ? (
                                <div className="text-xs opacity-70 mt-1 p-1 bg-blue-50 dark:bg-blue-900 rounded">
                                  Override: {item.employee_override_ip}{item.employee_override_label ? ` (${item.employee_override_label})` : ''}
                                </div>
                              ) : null}
                            </div>
                          ) : <span className="text-xs text-gray-500">No IP data</span>}
                        </td>
                        <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.office_name || '--'}</td>
                        <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{item.employee_timezone || '--'}</td>
                      </tr>
                    );
                  })}
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
                      onClick={() => enhancedPageChange(Math.max(1, page - 1))}
                      disabled={page === 1 || isPaging || isFiltering}
                    >
                      {isPaging && page === 1 ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : 'Previous'}
                    </button>
                    <button className="join-item btn btn-sm btn-disabled">
                      Page {page}
                    </button>
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => enhancedPageChange(page + 1)}
                      disabled={page * limit >= total || isPaging || isFiltering}
                    >
                      {isPaging ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : 'Next'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
              No attendance records found for the selected filters.
            </p>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isExporting && setIsExportModalOpen(false)}
          />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Export Attendance Records</h3>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                disabled={isExporting}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Export Scope */}
              <div>
                <label className={`block text-sm font-semibold mb-3 uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                  Export Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setExportScope('filtered')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      exportScope === 'filtered'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'filtered' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {exportScope === 'filtered' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>All Filtered Results</div>
                      <div className="text-xs text-gray-500">Export all {total} records matching filters</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setExportScope('current')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      exportScope === 'current'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'current' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {exportScope === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Current Page Only</div>
                      <div className="text-xs text-gray-500">Export only the {data?.length || 0} records on this page</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Column Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                    Select Columns
                  </label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedColumns(exportColumns.map(c => c.id))}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Select All
                    </button>
                    <button 
                      onClick={() => setSelectedColumns(['employee_name', 'attendance_date', 'status'])}
                      className="text-xs text-gray-500 hover:underline font-medium"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-900/50 border-slate-700'}`}>
                  {exportColumns.map(col => (
                    <label key={col.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary"
                        checked={selectedColumns.includes(col.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColumns([...selectedColumns, col.id]);
                          } else {
                            setSelectedColumns(selectedColumns.filter(id => id !== col.id));
                          }
                        }}
                      />
                      <span className={`text-sm group-hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                        {col.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex justify-end gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800/50'}`}>
              <button
                onClick={() => setIsExportModalOpen(false)}
                disabled={isExporting}
                className={`btn btn-ghost ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsExporting(true);
                  try {
                    const queryParams = new URLSearchParams();
                    Object.entries(baseFilters).forEach(([key, value]) => {
                      if (value) queryParams.append(key, String(value));
                    });
                    
                    if (exportScope === 'current') {
                      queryParams.append('page', String(page));
                      queryParams.append('limit', String(limit));
                    }
                    
                    queryParams.append('columns', selectedColumns.join(','));
                    
                    const response = await fetch(`${API_BASE_URL}/api/attendance/export?${queryParams.toString()}`, {
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
                      }
                    });
                    
                    if (!response.ok) throw new Error('Export failed');
                    
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `attendance_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    onShowNotification('Export successful', 'success');
                    setIsExportModalOpen(false);
                  } catch (err) {
                    onShowNotification('Export failed. Please try again.', 'error');
                  } finally {
                    setIsExporting(false);
                  }
                }}
                disabled={isExporting || selectedColumns.length === 0}
                className={`btn btn-primary min-w-[120px] ${isExporting ? 'loading' : ''}`}
              >
                {isExporting ? 'Exporting...' : 'Download XLSX'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
