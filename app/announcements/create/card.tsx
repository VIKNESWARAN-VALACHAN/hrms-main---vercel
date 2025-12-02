

// 'use client';

// import { useState, useEffect, ChangeEvent } from 'react';
// import { useTheme } from '../../components/ThemeProvider';

// interface Company {
//   id: string;
//   name: string;
// }

// interface Department {
//   id: string;
//   department_name: string;
//   company_id: string;
//   company_name: string;
// }

// interface Position {
//   id: string;
//   title: string;
//   department_id: string;
//   company_name: string;
//   department_name: string;
// }

// interface Employee {
//   id: string;
//   name: string;
//   position_id: string;
//   department_id: string;
//   company_id: string;
//   company_name: string;
//   department_name: string;
//   position_title: string;
//   job_level: string;
// }

// interface CompaniesSelectionProps {
//   rowId: string;
//   selectedItems: string[];
//   companies: Company[];
//   searchTerm: string;
//   onToggleItem: (rowId: string, itemId: string) => void;
//   onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
//   totalCount: number;
//   isLoading?: boolean;
// }

// export interface TargetRow {
//   id: string;
//   type: 'companies' | 'departments' | 'positions' | 'employees';
//   selectedCompanies: string[];
//   selectedDepartments: string[];
//   selectedPositions: string[];
//   selectedEmployees: string[];
//   isOpen: boolean;
//   activeTab: 'companies' | 'departments' | 'positions' | 'employees';
//   parentType?: '' | 'companies' | 'departments' | 'positions';
//   selectedAll?: boolean;
// }

// interface TargetRowCardProps {
//   row: TargetRow;
//   index: number;
//   companies: Company[];
//   departments: Department[];
//   positions: Position[];
//   employees: Employee[];
//   companySearchTerm: string;
//   departmentSearchTerm: string;
//   positionSearchTerm: string;
//   employeeSearchTerm: string;
//   targetRows: TargetRow[];
//   onChangeTab: (rowId: string, newTab: 'companies' | 'departments' | 'positions' | 'employees', parentType: '' | 'companies' | 'departments' | 'positions') => void;
//   onToggleItem: (rowId: string, itemId: string) => void;
//   onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
//   isAnyCompanySelected: () => boolean;
//   isAnyDepartmentSelected: () => boolean;
//   isAnyPositionSelected: () => boolean;
//   totalCounts?: {
//     companies: number;
//     departments: number;
//     positions: number;
//     employees: number;
//   };
//   isLoadingData?: boolean;
// }

// interface SelectionProps {
//   rowId: string;
//   selectedItems: string[];
//   dataItems: Company[] | Department[] | Position[] | Employee[];
//   searchTerm: string;
//   targetRows: TargetRow[];
//   activeTab: 'companies' | 'departments' | 'positions' | 'employees';
//   isAnyCompanySelected?: () => boolean;
//   isAnyDepartmentSelected?: () => boolean;
//   isAnyPositionSelected?: () => boolean;
//   onToggleItem: (rowId: string, itemId: string) => void;
//   onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
//   totalCount: number;
//   isLoading?: boolean;
// }

// interface CompanyTabConfig {
//   title: string;
//   placeholder: string;
//   searchType: string;
//   nameField: string;
//   warningMessage: null;
//   checkDependency: null;
//   filterProperty?: string;
//   parentType?: string;
// }

// interface DependentTabConfig {
//   title: string;
//   placeholder: string;
//   searchType: string;
//   nameField: string;
//   warningMessage: string;
//   checkDependency: (() => boolean) | undefined;
//   filterProperty: string;
//   parentType: string;
// }

// type TabConfig = {
//   companies: CompanyTabConfig;
//   departments: DependentTabConfig;
//   positions: DependentTabConfig;
//   employees: DependentTabConfig;
// };

// export function Selection({
//   rowId,
//   selectedItems,
//   dataItems,
//   searchTerm,
//   targetRows,
//   activeTab,
//   isAnyCompanySelected,
//   isAnyDepartmentSelected,
//   isAnyPositionSelected,
//   onToggleItem,
//   onSearchChange,
//   totalCount,
//   isLoading = false
// }: SelectionProps) {
//   const { theme } = useTheme();
  
//   // Track selectAll state per row per tab
//   const [selectAllState, setSelectAllState] = useState(false);
//   const [selectingAll, setSelectingAll] = useState(false);

//   // Map tab types to their corresponding properties
//   const tabConfig: TabConfig = {
//     companies: {
//       title: "Select Companies",
//       placeholder: "Search companies...",
//       searchType: "company",
//       nameField: "name",
//       warningMessage: null,
//       checkDependency: null
//     },
//     departments: {
//       title: "Select Departments",
//       placeholder: "Search departments...",
//       searchType: "department",
//       nameField: "department_name",
//       warningMessage: "Please select at least one company first.",
//       checkDependency: isAnyCompanySelected,
//       filterProperty: "company_id",
//       parentType: "companies"
//     },
//     positions: {
//       title: "Select Positions",
//       placeholder: "Search positions...",
//       searchType: "position",
//       nameField: "title",
//       warningMessage: "Please select at least one department first.",
//       checkDependency: isAnyDepartmentSelected,
//       filterProperty: "department_id",
//       parentType: "departments"
//     },
//     employees: {
//       title: "Select Employees",
//       placeholder: "Search employees...",
//       searchType: "employee",
//       nameField: "name",
//       warningMessage: "Please select at least one position first.",
//       checkDependency: isAnyPositionSelected,
//       filterProperty: "position_id",
//       parentType: "positions"
//     }
//   };

//   const config = tabConfig[activeTab];
//   const nameField = config.nameField as keyof (Company | Department | Position | Employee);
//   const searchType = config.searchType as 'company' | 'department' | 'position' | 'employee';

//   // Filter items based on search term
//   let filteredItems = (dataItems as any[]).filter(item =>
//     item && item[nameField] && String(item[nameField]).toLowerCase().includes((searchTerm || '').toLowerCase())
//   );

//   // Apply parent dependency filtering for departments, positions, employees
//   if (activeTab !== 'companies') {
//     const dependentConfig = config as DependentTabConfig;
//     const filterProperty = dependentConfig.filterProperty;
//     const parentType = dependentConfig.parentType;

//     // Get the current row
//     const currentRow = targetRows.find(row => row.id === rowId);
//     if (!currentRow) return null;

//     if (parentType === 'companies') {
//       // Filter departments for selected companies
//       const selectedCompanies = currentRow.selectedCompanies;
//       if (selectedCompanies.length > 0) {
//         filteredItems = filteredItems.filter(item =>
//           selectedCompanies.includes((item as Department).company_id)
//         );
//       }
//     } else if (parentType === 'departments') {
//       // Filter positions for selected departments
//       const selectedDepartments = currentRow.selectedDepartments;
//       if (selectedDepartments.length > 0) {
//         filteredItems = filteredItems.filter(item =>
//           selectedDepartments.includes((item as Position).department_id)
//         );
//       }
//     } else if (parentType === 'positions') {
//       // Filter employees for selected positions
//       const selectedPositions = currentRow.selectedPositions;
//       if (selectedPositions.length > 0) {
//         filteredItems = filteredItems.filter(item =>
//           selectedPositions.includes((item as Employee).position_id)
//         );
//       }
//     }
//   }

//   // Handle "Select All" functionality with count display
//   const handleSelectAll = async () => {
//     if (filteredItems.length === 0 || isLoading) return;

//     const willSelectAll = !selectAllState;
//     setSelectAllState(willSelectAll);
//     setSelectingAll(true);

//     try {
//       if (willSelectAll) {
//         // Select all filtered items
//         filteredItems.forEach(item => {
//           if (!selectedItems.includes(item.id)) {
//             onToggleItem(rowId, item.id);
//           }
//         });
//       } else {
//         // Deselect all filtered items
//         filteredItems.forEach(item => {
//           if (selectedItems.includes(item.id)) {
//             onToggleItem(rowId, item.id);
//           }
//         });
//       }
//     } finally {
//       setSelectingAll(false);
//     }
//   };

//   // Update selectAll state when items change
//   useEffect(() => {
//     if (filteredItems.length > 0) {
//       const allSelected = filteredItems.every(item => selectedItems.includes(item.id));
//       setSelectAllState(allSelected);
//     } else {
//       setSelectAllState(false);
//     }
//   }, [selectedItems, filteredItems]);

//   // Determine checkbox state
//   const allSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;
//   const someSelected = selectedItems.length > 0 && selectedItems.length < filteredItems.length;

//   // Get total count message
//   const getTotalCountMessage = () => {
//     if (isLoading) return "Loading...";
    
//     const displayedCount = filteredItems.length;
//     const total = totalCount || 0;
    
//     if (displayedCount < total) {
//       return `Showing ${displayedCount} of ${total} items`;
//     }
//     return `${total} items`;
//   };

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
//         <div>
//           <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{config.title}</h3>
//           <div className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//             {getTotalCountMessage()}
//           </div>
//         </div>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder={config.placeholder}
//             className={`input input-sm w-64 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded px-3 py-2`}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e, searchType)}
//             disabled={isLoading}
//           />
//           {isLoading && (
//             <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//               <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//             </div>
//           )}
//         </div>
//       </div>

//       {config.checkDependency && !config.checkDependency() && (
//         <div className={`alert ${theme === 'light' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-yellow-900 border-yellow-700 text-yellow-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <span>{config.warningMessage}</span>
//         </div>
//       )}

//       {(!config.checkDependency || config.checkDependency()) && (
//         <>
//           {/* Select All Checkbox */}
//           {filteredItems.length > 0 && (
//             <div
//               className={`border rounded-lg p-3 mb-3 cursor-pointer transition-colors ${isLoading || selectingAll ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600'}`}
//               onClick={isLoading || selectingAll ? undefined : handleSelectAll}
//             >
//               <div className="flex items-center">
//                 {(isLoading || selectingAll) && (
//                   <div className="mr-3">
//                     <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//                   </div>
//                 )}
//                 {!isLoading && !selectingAll && (
//                   <input
//                     type="checkbox"
//                     className={`checkbox checkbox-md mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                     checked={allSelected}
//                     ref={checkbox => {
//                       if (checkbox) {
//                         checkbox.indeterminate = someSelected;
//                       }
//                     }}
//                     onChange={() => { }}
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                 )}
//                 <span className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//                   {selectingAll ? 'Processing...' : `Select All (${filteredItems.length} shown)`}
//                 </span>
//                 {totalCount > filteredItems.length && (
//                   <span className={`ml-2 text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                     of {totalCount} total
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Loading Skeleton */}
//           {isLoading && filteredItems.length === 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//               {[1, 2, 3, 4, 5, 6].map((i) => (
//                 <div
//                   key={i}
//                   className={`border rounded-lg p-3 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}
//                 >
//                   <div className="flex items-center">
//                     <div className={`w-5 h-5 mr-3 rounded ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-600'} animate-pulse`}></div>
//                     <div className="w-full">
//                       <div className={`h-4 rounded ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-600'} animate-pulse mb-2`}></div>
//                       <div className={`h-3 w-3/4 rounded ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-500'} animate-pulse`}></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Results Grid */}
//           {!isLoading && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//               {filteredItems.map(item => (
//                 <div
//                   key={item.id}
//                   className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedItems.includes(item.id)
//                       ? theme === 'light'
//                         ? 'bg-blue-50 border-blue-600 text-blue-900'
//                         : 'bg-blue-900 border-blue-400 text-blue-100'
//                       : theme === 'light'
//                         ? 'border-slate-300 hover:border-blue-500 bg-white'
//                         : 'border-slate-600 hover:border-blue-400 bg-slate-800'
//                     }`}
//                   onClick={() => onToggleItem(rowId, item.id)}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className={`checkbox checkbox-sm mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                       checked={selectedItems.includes(item.id)}
//                       onChange={() => { }}
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                     <div className="w-full">
//                       <div className="font-medium truncate">{String(item[nameField])}</div>
//                       {activeTab === 'departments' ? (
//                         <div className={`text-xs truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                           {(item as Department).company_name}
//                         </div>
//                       ) : activeTab === 'positions' ? (
//                         <div className={`text-xs truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                           {(item as Position).company_name} • {(item as Position).department_name}
//                         </div>
//                       ) : activeTab === 'employees' ? (
//                         <div className={`text-xs truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                           {(item as Employee).company_name} • {(item as Employee).department_name} • {(item as Employee).position_title}
//                         </div>
//                       ) : null}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {!isLoading && filteredItems.length === 0 && (
//             <div className="text-center py-8">
//               <div className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                 {activeTab === 'companies'
//                   ? 'No companies found'
//                   : activeTab === 'departments'
//                     ? 'No departments found for selected companies'
//                     : activeTab === 'positions'
//                       ? 'No positions found for selected departments'
//                       : 'No employees found for selected positions'
//                 }
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default function TargetRowCard({
//   row,
//   index,
//   companies,
//   departments,
//   positions,
//   employees,
//   companySearchTerm,
//   departmentSearchTerm,
//   positionSearchTerm,
//   employeeSearchTerm,
//   targetRows,
//   onChangeTab,
//   onToggleItem,
//   onSearchChange,
//   isAnyCompanySelected,
//   isAnyDepartmentSelected,
//   isAnyPositionSelected,
//   totalCounts = { companies: 0, departments: 0, positions: 0, employees: 0 },
//   isLoadingData = false
// }: TargetRowCardProps) {
//   const { theme } = useTheme();

//   // Get total count for current tab
//   const getCurrentTotalCount = () => {
//     switch (row.activeTab) {
//       case 'companies': return totalCounts.companies;
//       case 'departments': return totalCounts.departments;
//       case 'positions': return totalCounts.positions;
//       case 'employees': return totalCounts.employees;
//       default: return 0;
//     }
//   };

//   // Get data items for current tab
//   const getCurrentDataItems = () => {
//     switch (row.activeTab) {
//       case 'companies': return companies;
//       case 'departments': return departments;
//       case 'positions': return positions;
//       case 'employees': return employees;
//       default: return [];
//     }
//   };

//   // Get search term for current tab
//   const getCurrentSearchTerm = () => {
//     switch (row.activeTab) {
//       case 'companies': return companySearchTerm;
//       case 'departments': return departmentSearchTerm;
//       case 'positions': return positionSearchTerm;
//       case 'employees': return employeeSearchTerm;
//       default: return '';
//     }
//   };

//   // Get selected items for current tab
//   const getCurrentSelectedItems = () => {
//     switch (row.activeTab) {
//       case 'companies': return row.selectedCompanies;
//       case 'departments': return row.selectedDepartments;
//       case 'positions': return row.selectedPositions;
//       case 'employees': return row.selectedEmployees;
//       default: return [];
//     }
//   };

//   return (
//     <div className={`border rounded-lg ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'}`}>
//       {/* Target Row Header */}
//       <div
//         className={`p-3 rounded-t-lg flex items-center justify-between ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}
//       >
//         <div className="flex items-center gap-3">
//           <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//             Target Group {index + 1}
//           </span>
//           <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//             ({getCurrentSelectedItems().length} selected)
//           </span>
//           {isLoadingData && (
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
//               <span className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Updating...</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Target Row Content */}
//       <div className="block">
//         {/* Tab Navigation */}
//         <div className={`tabs tabs-boxed border-b ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'companies' ? 'tab-active' : ''} ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => !isLoadingData && onChangeTab(row.id, 'companies', '')}
//             title={isLoadingData ? 'Please wait...' : ''}
//           >
//             Companies
//           </a>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'departments' ? 'tab-active' : ''} ${!isAnyCompanySelected() || isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => !isLoadingData && isAnyCompanySelected() && onChangeTab(row.id, 'departments', 'companies')}
//             title={isLoadingData ? 'Please wait...' : !isAnyCompanySelected() ? 'Select a company first' : ''}
//           >
//             Departments
//           </a>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'positions' ? 'tab-active' : ''} ${!isAnyDepartmentSelected() || isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => !isLoadingData && isAnyDepartmentSelected() && onChangeTab(row.id, 'positions', 'departments')}
//             title={isLoadingData ? 'Please wait...' : !isAnyDepartmentSelected() ? 'Select a department first' : ''}
//           >
//             Positions
//           </a>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'employees' ? 'tab-active' : ''} ${!isAnyPositionSelected() || isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => !isLoadingData && isAnyPositionSelected() && onChangeTab(row.id, 'employees', 'positions')}
//             title={isLoadingData ? 'Please wait...' : !isAnyPositionSelected() ? 'Select a position first' : ''}
//           >
//             Employees
//           </a>
//         </div>

//         <div className="p-4">
//           <Selection
//             rowId={row.id}
//             selectedItems={getCurrentSelectedItems()}
//             dataItems={getCurrentDataItems()}
//             searchTerm={getCurrentSearchTerm()}
//             targetRows={targetRows}
//             activeTab={row.activeTab}
//             isAnyCompanySelected={isAnyCompanySelected}
//             isAnyDepartmentSelected={isAnyDepartmentSelected}
//             isAnyPositionSelected={isAnyPositionSelected}
//             onToggleItem={onToggleItem}
//             onSearchChange={onSearchChange}
//             totalCount={getCurrentTotalCount()}
//             isLoading={isLoadingData}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useTheme } from '../../components/ThemeProvider';

interface Company {
  id: string;
  name: string;
}

interface Department {
  id: string;
  department_name: string;
  company_id: string;
  company_name: string;
}

interface Position {
  id: string;
  title: string;
  department_id: string;
  company_name: string;
  department_name: string;
}

interface Employee {
  id: string;
  name: string;
  position_id: string;
  department_id: string;
  company_id: string;
  company_name: string;
  department_name: string;
  position_title: string;
  job_level: string;
}

interface CompaniesSelectionProps {
  rowId: string;
  selectedItems: string[];
  companies: Company[];
  searchTerm: string;
  onToggleItem: (rowId: string, itemId: string) => void;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
  totalCount: number;
  isLoading?: boolean;
}

export interface TargetRow {
  id: string;
  type: 'companies' | 'departments' | 'positions' | 'employees';
  selectedCompanies: string[];
  selectedDepartments: string[];
  selectedPositions: string[];
  selectedEmployees: string[];
  isOpen: boolean;
  activeTab: 'companies' | 'departments' | 'positions' | 'employees';
  parentType?: '' | 'companies' | 'departments' | 'positions';
  selectedAll?: boolean;
}

interface TargetRowCardProps {
  row: TargetRow;
  index: number;
  companies: Company[];
  departments: Department[];
  positions: Position[];
  employees: Employee[];
  companySearchTerm: string;
  departmentSearchTerm: string;
  positionSearchTerm: string;
  employeeSearchTerm: string;
  targetRows: TargetRow[];
  onChangeTab: (rowId: string, newTab: 'companies' | 'departments' | 'positions' | 'employees', parentType: '' | 'companies' | 'departments' | 'positions') => void;
  onToggleItem: (rowId: string, itemId: string) => void;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
  isAnyCompanySelected: () => boolean;
  isAnyDepartmentSelected: () => boolean;
  isAnyPositionSelected: () => boolean;
  totalCounts?: {
    companies: number;
    departments: number;
    positions: number;
    employees: number;
  };
  isLoadingData?: boolean;
}

interface SelectionProps {
  rowId: string;
  selectedItems: string[];
  dataItems: Company[] | Department[] | Position[] | Employee[];
  searchTerm: string;
  targetRows: TargetRow[];
  activeTab: 'companies' | 'departments' | 'positions' | 'employees';
  isAnyCompanySelected?: () => boolean;
  isAnyDepartmentSelected?: () => boolean;
  isAnyPositionSelected?: () => boolean;
  onToggleItem: (rowId: string, itemId: string) => void;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
  totalCount: number;
  isLoading?: boolean;
}

interface CompanyTabConfig {
  title: string;
  placeholder: string;
  searchType: string;
  nameField: string;
  warningMessage: null;
  checkDependency: null;
  filterProperty?: string;
  parentType?: string;
}

interface DependentTabConfig {
  title: string;
  placeholder: string;
  searchType: string;
  nameField: string;
  warningMessage: string;
  checkDependency: (() => boolean) | undefined;
  filterProperty: string;
  parentType: string;
}

type TabConfig = {
  companies: CompanyTabConfig;
  departments: DependentTabConfig;
  positions: DependentTabConfig;
  employees: DependentTabConfig;
};

export function Selection({
  rowId,
  selectedItems,
  dataItems,
  searchTerm,
  targetRows,
  activeTab,
  isAnyCompanySelected,
  isAnyDepartmentSelected,
  isAnyPositionSelected,
  onToggleItem,
  onSearchChange,
  totalCount,
  isLoading = false
}: SelectionProps) {
  const { theme } = useTheme();
  
  // Track selectAll state per row per tab
  const [selectAllState, setSelectAllState] = useState(false);
  const [selectingAll, setSelectingAll] = useState(false);
  const [currentRow, setCurrentRow] = useState<TargetRow | null>(null);

  // Set current row - move this logic outside of conditional
  useEffect(() => {
    const row = targetRows.find(row => row.id === rowId);
    setCurrentRow(row || null);
  }, [targetRows, rowId]);

  // Map tab types to their corresponding properties
  const tabConfig: TabConfig = {
    companies: {
      title: "Select Companies",
      placeholder: "Search companies...",
      searchType: "company",
      nameField: "name",
      warningMessage: null,
      checkDependency: null
    },
    departments: {
      title: "Select Departments",
      placeholder: "Search departments...",
      searchType: "department",
      nameField: "department_name",
      warningMessage: "Please select at least one company first.",
      checkDependency: isAnyCompanySelected,
      filterProperty: "company_id",
      parentType: "companies"
    },
    positions: {
      title: "Select Positions",
      placeholder: "Search positions...",
      searchType: "position",
      nameField: "title",
      warningMessage: "Please select at least one department first.",
      checkDependency: isAnyDepartmentSelected,
      filterProperty: "department_id",
      parentType: "departments"
    },
    employees: {
      title: "Select Employees",
      placeholder: "Search employees...",
      searchType: "employee",
      nameField: "name",
      warningMessage: "Please select at least one position first.",
      checkDependency: isAnyPositionSelected,
      filterProperty: "position_id",
      parentType: "positions"
    }
  };

  const config = tabConfig[activeTab];
  const nameField = config.nameField as keyof (Company | Department | Position | Employee);
  const searchType = config.searchType as 'company' | 'department' | 'position' | 'employee';

  // Filter items based on search term
  let filteredItems = (dataItems as any[]).filter(item =>
    item && item[nameField] && String(item[nameField]).toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Apply parent dependency filtering for departments, positions, employees
  if (activeTab !== 'companies') {
    const dependentConfig = config as DependentTabConfig;
    const filterProperty = dependentConfig.filterProperty;
    const parentType = dependentConfig.parentType;

    // Use currentRow from state instead of finding it conditionally
    if (currentRow) {
      if (parentType === 'companies') {
        // Filter departments for selected companies
        const selectedCompanies = currentRow.selectedCompanies;
        if (selectedCompanies.length > 0) {
          filteredItems = filteredItems.filter(item =>
            selectedCompanies.includes((item as Department).company_id)
          );
        }
      } else if (parentType === 'departments') {
        // Filter positions for selected departments
        const selectedDepartments = currentRow.selectedDepartments;
        if (selectedDepartments.length > 0) {
          filteredItems = filteredItems.filter(item =>
            selectedDepartments.includes((item as Position).department_id)
          );
        }
      } else if (parentType === 'positions') {
        // Filter employees for selected positions
        const selectedPositions = currentRow.selectedPositions;
        if (selectedPositions.length > 0) {
          filteredItems = filteredItems.filter(item =>
            selectedPositions.includes((item as Employee).position_id)
          );
        }
      }
    }
  }

  // Handle "Select All" functionality with count display
  const handleSelectAll = async () => {
    if (filteredItems.length === 0 || isLoading) return;

    const willSelectAll = !selectAllState;
    setSelectAllState(willSelectAll);
    setSelectingAll(true);

    try {
      if (willSelectAll) {
        // Select all filtered items
        filteredItems.forEach(item => {
          if (!selectedItems.includes(item.id)) {
            onToggleItem(rowId, item.id);
          }
        });
      } else {
        // Deselect all filtered items
        filteredItems.forEach(item => {
          if (selectedItems.includes(item.id)) {
            onToggleItem(rowId, item.id);
          }
        });
      }
    } finally {
      setSelectingAll(false);
    }
  };

  // Update selectAll state when items change - FIXED: This useEffect should always run
  useEffect(() => {
    if (filteredItems.length > 0) {
      const allSelected = filteredItems.every(item => selectedItems.includes(item.id));
      setSelectAllState(allSelected);
    } else {
      setSelectAllState(false);
    }
  }, [selectedItems, filteredItems]);

  // Determine checkbox state
  const allSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < filteredItems.length;

  // Get total count message
  const getTotalCountMessage = () => {
    if (isLoading) return "Loading...";
    
    const displayedCount = filteredItems.length;
    const total = totalCount || 0;
    
    if (displayedCount < total) {
      return `Showing ${displayedCount} of ${total} items`;
    }
    return `${total} items`;
  };

  // Early return if no current row (for departments, positions, employees tabs)
  if (activeTab !== 'companies' && !currentRow) {
    return (
      <div className="text-center py-8">
        <div className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Loading row data...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div>
          <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{config.title}</h3>
          <div className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
            {getTotalCountMessage()}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={config.placeholder}
            className={`input input-sm w-64 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded px-3 py-2`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e, searchType)}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {config.checkDependency && !config.checkDependency() && (
        <div className={`alert ${theme === 'light' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-yellow-900 border-yellow-700 text-yellow-200'} border rounded-lg`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{config.warningMessage}</span>
        </div>
      )}

      {(!config.checkDependency || config.checkDependency()) && (
        <>
          {/* Select All Checkbox */}
          {filteredItems.length > 0 && (
            <div
              className={`border rounded-lg p-3 mb-3 cursor-pointer transition-colors ${isLoading || selectingAll ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600'}`}
              onClick={isLoading || selectingAll ? undefined : handleSelectAll}
            >
              <div className="flex items-center">
                {(isLoading || selectingAll) && (
                  <div className="mr-3">
                    <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
                {!isLoading && !selectingAll && (
                  <input
                    type="checkbox"
                    className={`checkbox checkbox-md mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
                    checked={allSelected}
                    ref={checkbox => {
                      if (checkbox) {
                        checkbox.indeterminate = someSelected;
                      }
                    }}
                    onChange={() => { }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                  {selectingAll ? 'Processing...' : `Select All (${filteredItems.length} shown)`}
                </span>
                {totalCount > filteredItems.length && (
                  <span className={`ml-2 text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    of {totalCount} total
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && filteredItems.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-3 ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 mr-3 rounded ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-600'} animate-pulse`}></div>
                    <div className="w-full">
                      <div className={`h-4 rounded ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-600'} animate-pulse mb-2`}></div>
                      <div className={`h-3 w-3/4 rounded ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-500'} animate-pulse`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedItems.includes(item.id)
                      ? theme === 'light'
                        ? 'bg-blue-50 border-blue-600 text-blue-900'
                        : 'bg-blue-900 border-blue-400 text-blue-100'
                      : theme === 'light'
                        ? 'border-slate-300 hover:border-blue-500 bg-white'
                        : 'border-slate-600 hover:border-blue-400 bg-slate-800'
                    }`}
                  onClick={() => onToggleItem(rowId, item.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className={`checkbox checkbox-sm mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
                      checked={selectedItems.includes(item.id)}
                      onChange={() => { }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="w-full">
                      <div className="font-medium truncate">{String(item[nameField])}</div>
                      {activeTab === 'departments' ? (
                        <div className={`text-xs truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          {(item as Department).company_name}
                        </div>
                      ) : activeTab === 'positions' ? (
                        <div className={`text-xs truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          {(item as Position).company_name} • {(item as Position).department_name}
                        </div>
                      ) : activeTab === 'employees' ? (
                        <div className={`text-xs truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          {(item as Employee).company_name} • {(item as Employee).department_name} • {(item as Employee).position_title}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-8">
              <div className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                {activeTab === 'companies'
                  ? 'No companies found'
                  : activeTab === 'departments'
                    ? 'No departments found for selected companies'
                    : activeTab === 'positions'
                      ? 'No positions found for selected departments'
                      : 'No employees found for selected positions'
                }
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function TargetRowCard({
  row,
  index,
  companies,
  departments,
  positions,
  employees,
  companySearchTerm,
  departmentSearchTerm,
  positionSearchTerm,
  employeeSearchTerm,
  targetRows,
  onChangeTab,
  onToggleItem,
  onSearchChange,
  isAnyCompanySelected,
  isAnyDepartmentSelected,
  isAnyPositionSelected,
  totalCounts = { companies: 0, departments: 0, positions: 0, employees: 0 },
  isLoadingData = false
}: TargetRowCardProps) {
  const { theme } = useTheme();

  // Get total count for current tab
  const getCurrentTotalCount = () => {
    switch (row.activeTab) {
      case 'companies': return totalCounts.companies;
      case 'departments': return totalCounts.departments;
      case 'positions': return totalCounts.positions;
      case 'employees': return totalCounts.employees;
      default: return 0;
    }
  };

  // Get data items for current tab
  const getCurrentDataItems = () => {
    switch (row.activeTab) {
      case 'companies': return companies;
      case 'departments': return departments;
      case 'positions': return positions;
      case 'employees': return employees;
      default: return [];
    }
  };

  // Get search term for current tab
  const getCurrentSearchTerm = () => {
    switch (row.activeTab) {
      case 'companies': return companySearchTerm;
      case 'departments': return departmentSearchTerm;
      case 'positions': return positionSearchTerm;
      case 'employees': return employeeSearchTerm;
      default: return '';
    }
  };

  // Get selected items for current tab
  const getCurrentSelectedItems = () => {
    switch (row.activeTab) {
      case 'companies': return row.selectedCompanies;
      case 'departments': return row.selectedDepartments;
      case 'positions': return row.selectedPositions;
      case 'employees': return row.selectedEmployees;
      default: return [];
    }
  };

  return (
    <div className={`border rounded-lg ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'}`}>
      {/* Target Row Header */}
      <div
        className={`p-3 rounded-t-lg flex items-center justify-between ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
            Target Group {index + 1}
          </span>
          <span className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            ({getCurrentSelectedItems().length} selected)
          </span>
          {isLoadingData && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              <span className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Target Row Content */}
      <div className="block">
        {/* Tab Navigation */}
        <div className={`tabs tabs-boxed border-b ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
          <a
            className={`tab tab-sm ${row.activeTab === 'companies' ? 'tab-active' : ''} ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
            onClick={() => !isLoadingData && onChangeTab(row.id, 'companies', '')}
            title={isLoadingData ? 'Please wait...' : ''}
          >
            Companies
          </a>
          <a
            className={`tab tab-sm ${row.activeTab === 'departments' ? 'tab-active' : ''} ${!isAnyCompanySelected() || isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
            onClick={() => !isLoadingData && isAnyCompanySelected() && onChangeTab(row.id, 'departments', 'companies')}
            title={isLoadingData ? 'Please wait...' : !isAnyCompanySelected() ? 'Select a company first' : ''}
          >
            Departments
          </a>
          <a
            className={`tab tab-sm ${row.activeTab === 'positions' ? 'tab-active' : ''} ${!isAnyDepartmentSelected() || isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
            onClick={() => !isLoadingData && isAnyDepartmentSelected() && onChangeTab(row.id, 'positions', 'departments')}
            title={isLoadingData ? 'Please wait...' : !isAnyDepartmentSelected() ? 'Select a department first' : ''}
          >
            Positions
          </a>
          <a
            className={`tab tab-sm ${row.activeTab === 'employees' ? 'tab-active' : ''} ${!isAnyPositionSelected() || isLoadingData ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
            onClick={() => !isLoadingData && isAnyPositionSelected() && onChangeTab(row.id, 'employees', 'positions')}
            title={isLoadingData ? 'Please wait...' : !isAnyPositionSelected() ? 'Select a position first' : ''}
          >
            Employees
          </a>
        </div>

        <div className="p-4">
          <Selection
            rowId={row.id}
            selectedItems={getCurrentSelectedItems()}
            dataItems={getCurrentDataItems()}
            searchTerm={getCurrentSearchTerm()}
            targetRows={targetRows}
            activeTab={row.activeTab}
            isAnyCompanySelected={isAnyCompanySelected}
            isAnyDepartmentSelected={isAnyDepartmentSelected}
            isAnyPositionSelected={isAnyPositionSelected}
            onToggleItem={onToggleItem}
            onSearchChange={onSearchChange}
            totalCount={getCurrentTotalCount()}
            isLoading={isLoadingData}
          />
        </div>
      </div>
    </div>
  );
}
