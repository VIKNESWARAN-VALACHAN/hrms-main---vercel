// 'use client';

// import React, { useState, useCallback, useMemo } from 'react';
// import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
// import { useTheme } from '../../components/ThemeProvider';
// import type { Filters } from '../../utils/attendanceApi';
// import { format } from 'date-fns';

// interface DepartmentStat {
//   department_id: number;
//   department_name: string;
//   total_employees: number;
//   present_days: number;
//   late_days: number;
//   total_attendance_records: number;
//   attendance_percentage: number;
// }

// interface OverviewTabProps {
//   filters: Filters;
//   onFilterChange: (filters: Partial<Filters>) => void;
//   onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
//   user: any;
// }

// export default function OverviewTab({
//   filters,
//   onFilterChange,
//   onShowNotification,
//   user
// }: OverviewTabProps) {
//   const { theme } = useTheme();
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [selectedCompany, setSelectedCompany] = useState<number | undefined>(user.company_id);

//   // Fetch overview data
//   const { data, total, isLoading, isFetching, error } = useAttendanceData<DepartmentStat>(
//     'overview',
//     {
//       ...filters,
//       company_id: selectedCompany
//     },
//     page,
//     limit
//   );

//   // Fetch filter options
//   const { options: filterOptions } = useFilterOptions('companies', undefined, false);

//   // Handle company change
//   const handleCompanyChange = useCallback((companyId: number) => {
//     setSelectedCompany(companyId);
//     setPage(1);
//     onFilterChange({ company_id: companyId });
//   }, [onFilterChange]);

//   // Handle date range change
//   const handleDateChange = useCallback((startDate: string, endDate: string) => {
//     onFilterChange({ start_date: startDate, end_date: endDate });
//     setPage(1);
//   }, [onFilterChange]);

//   // Calculate totals
//   const totals = useMemo(() => {
//     if (!data) return { employees: 0, present: 0, late: 0, records: 0, percentage: 0 };

//     return {
//       employees: data.reduce((sum, d) => sum + d.total_employees, 0),
//       present: data.reduce((sum, d) => sum + d.present_days, 0),
//       late: data.reduce((sum, d) => sum + d.late_days, 0),
//       records: data.reduce((sum, d) => sum + d.total_attendance_records, 0),
//       percentage: data.length > 0
//         ? (data.reduce((sum, d) => sum + d.attendance_percentage, 0) / data.length)
//         : 0
//     };
//   }, [data]);

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
//           Attendance Overview
//         </h2>
//         <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
//           View department-level attendance statistics and trends
//         </p>
//       </div>

//       {/* Filters */}
//       <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'}`}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Company Filter */}
//           {user.role === 'admin' && filterOptions?.companies && (
//             <div>
//               <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
//                 Company
//               </label>
//               <select
//                 value={selectedCompany || ''}
//                 onChange={(e) => handleCompanyChange(Number(e.target.value))}
//                 className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//               >
//                 <option value="">All Companies</option>
//                 {filterOptions.companies.map(company => (
//                   <option key={company.id} value={company.id}>
//                     {company.name}
//                   </option>
//                 ))}
//               </select>
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
//               onChange={(e) => handleDateChange(e.target.value, filters.end_date || '')}
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
//               onChange={(e) => handleDateChange(filters.start_date || '', e.target.value)}
//               className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//           <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//             Total Employees
//           </div>
//           <div className={`stat-value ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//             {totals.employees}
//           </div>
//         </div>

//         <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//           <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//             Present Days
//           </div>
//           <div className={`stat-value text-success`}>
//             {totals.present}
//           </div>
//         </div>

//         <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//           <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//             Late Days
//           </div>
//           <div className={`stat-value text-warning`}>
//             {totals.late}
//           </div>
//         </div>

//         <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
//           <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//             Avg Attendance %
//           </div>
//           <div className={`stat-value text-info`}>
//             {totals.percentage.toFixed(1)}%
//           </div>
//         </div>
//       </div>

//       {/* Department Statistics Table */}
//       <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//         {isLoading ? (
//           <div className="p-8 text-center">
//             <div className="loading loading-spinner loading-lg mx-auto"></div>
//             <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
//               Loading department statistics...
//             </p>
//           </div>
//         ) : data && data.length > 0 ? (
//           <>
//             <div className="overflow-x-auto">
//               <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
//                 <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
//                   <tr>
//                     <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                       Total Employees
//                     </th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                       Present Days
//                     </th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                       Late Days
//                     </th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                       Total Records
//                     </th>
//                     <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                       Attendance %
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((dept) => (
//                     <tr
//                       key={dept.department_id}
//                       className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
//                     >
//                       <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
//                         {dept.department_name}
//                       </td>
//                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {dept.total_employees}
//                       </td>
//                       <td className={`text-center text-success font-medium`}>
//                         {dept.present_days}
//                       </td>
//                       <td className={`text-center text-warning font-medium`}>
//                         {dept.late_days}
//                       </td>
//                       <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
//                         {dept.total_attendance_records}
//                       </td>
//                       <td className={`text-center font-medium`}>
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="w-16 bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-blue-600 h-2 rounded-full"
//                               style={{ width: `${Math.min(100, dept.attendance_percentage)}%` }}
//                             ></div>
//                           </div>
//                           <span className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
//                             {dept.attendance_percentage.toFixed(1)}%
//                           </span>
//                         </div>
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
//                     Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} departments
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
//               No department data available for the selected filters.
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

interface DepartmentStat {
  department_id: number;
  department_name: string;
  total_employees: number;
  present_days: number;
  late_days: number;
  total_attendance_records: number;
  attendance_percentage: number;
}

type CompanyOption = {
  id: number;
  name: string;
};

interface OverviewTabProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  user: any;
}

export default function OverviewTab({
  filters,
  onFilterChange,
  onShowNotification,
  user
}: OverviewTabProps) {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedCompany, setSelectedCompany] = useState<number | undefined>(user.company_id);

  // Fetch overview data
  const { data, total, isLoading, isFetching, error } = useAttendanceData<DepartmentStat>(
    'overview',
    {
      ...filters,
      company_id: selectedCompany
    },
    page,
    limit
  );

  // Fetch filter options
  const { options: filterOptions } = useFilterOptions('companies', undefined, false);

  // ✅ Strongly-type companies so `.map(company => ...)` is not `any`
  const companies = useMemo<CompanyOption[]>(() => {
    const raw = (filterOptions as any)?.companies;
    if (!Array.isArray(raw)) return [];
    return raw as CompanyOption[];
  }, [filterOptions]);

  // Handle company change
  const handleCompanyChange = useCallback(
    (companyId: number) => {
      setSelectedCompany(companyId);
      setPage(1);
      onFilterChange({ company_id: companyId });
    },
    [onFilterChange]
  );

  // Handle date range change
  const handleDateChange = useCallback(
    (startDate: string, endDate: string) => {
      onFilterChange({ start_date: startDate, end_date: endDate });
      setPage(1);
    },
    [onFilterChange]
  );

  // Calculate totals
  const totals = useMemo(() => {
    if (!data) return { employees: 0, present: 0, late: 0, records: 0, percentage: 0 };

    return {
      employees: data.reduce((sum, d) => sum + d.total_employees, 0),
      present: data.reduce((sum, d) => sum + d.present_days, 0),
      late: data.reduce((sum, d) => sum + d.late_days, 0),
      records: data.reduce((sum, d) => sum + d.total_attendance_records, 0),
      percentage:
        data.length > 0 ? data.reduce((sum, d) => sum + d.attendance_percentage, 0) / data.length : 0
    };
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
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
          Attendance Overview
        </h2>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
          View department-level attendance statistics and trends
        </p>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Company Filter */}
          {user.role === 'admin' && companies.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                Company
              </label>
              <select
                value={selectedCompany || ''}
                onChange={(e) => handleCompanyChange(Number(e.target.value))}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
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
              onChange={(e) => handleDateChange(e.target.value, filters.end_date || '')}
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
              onChange={(e) => handleDateChange(filters.start_date || '', e.target.value)}
              className={`input input-bordered w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
          <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Total Employees</div>
          <div className={`stat-value ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{totals.employees}</div>
        </div>

        <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
          <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Present Days</div>
          <div className={`stat-value text-success`}>{totals.present}</div>
        </div>

        <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
          <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Late Days</div>
          <div className={`stat-value text-warning`}>{totals.late}</div>
        </div>

        <div className={`stat ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
          <div className={`stat-title ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Avg Attendance %</div>
          <div className={`stat-value text-info`}>{totals.percentage.toFixed(1)}%</div>
        </div>
      </div>

      {/* Department Statistics Table */}
      <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="loading loading-spinner loading-lg mx-auto"></div>
            <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
              Loading department statistics...
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
                  <tr>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Total Employees</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Present Days</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Late Days</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Total Records</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((dept) => (
                    <tr
                      key={dept.department_id}
                      className={theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}
                    >
                      <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>{dept.department_name}</td>
                      <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{dept.total_employees}</td>
                      <td className={`text-center text-success font-medium`}>{dept.present_days}</td>
                      <td className={`text-center text-warning font-medium`}>{dept.late_days}</td>
                      <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>{dept.total_attendance_records}</td>
                      <td className={`text-center font-medium`}>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(100, dept.attendance_percentage)}%` }}
                            ></div>
                          </div>
                          <span className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
                            {dept.attendance_percentage.toFixed(1)}%
                          </span>
                        </div>
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
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} departments
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
              No department data available for the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
