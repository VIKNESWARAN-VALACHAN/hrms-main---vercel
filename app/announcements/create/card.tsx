// 'use client';

// import { useState, useEffect, ChangeEvent } from 'react';
// import { useTheme } from '../../components/ThemeProvider';

// interface Company {
//   id: string;
//   name: string;
// }

// interface LoadingStates {
//   companies: boolean;
//   departments: boolean;
//   positions: boolean;
//   employees: boolean;
//   allData: boolean;
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
// }

// export function CompaniesSelection({
//   rowId,
//   selectedItems,
//   companies,
//   searchTerm,
//   onToggleItem,
//   onSearchChange
// }: CompaniesSelectionProps) {
//   const { theme } = useTheme();
//   const filteredCompanies = companies.filter(company =>
//     company && company.name && company.name.toLowerCase().includes((searchTerm || '').toLowerCase())
//   );

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Select Companies</h3>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search companies..."
//             className={`input input-sm w-64 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded px-3 py-2`}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e, 'company')}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//         {filteredCompanies.map(company => (
//           <div
//             key={company.id}
//             className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedItems.includes(company.id)
//                 ? theme === 'light' 
//                   ? 'bg-blue-50 border-blue-600 text-blue-900'
//                   : 'bg-blue-900 border-blue-400 text-blue-100'
//                 : theme === 'light'
//                   ? 'border-slate-300 hover:border-blue-500 bg-white'
//                   : 'border-slate-600 hover:border-blue-400 bg-slate-800'
//               }`}
//             onClick={() => onToggleItem(rowId, company.id)}
//           >
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 className={`checkbox checkbox-sm mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                 checked={selectedItems.includes(company.id)}
//                 onChange={() => { }} // Handled by parent div click
//                 onClick={(e) => e.stopPropagation()} // Prevent double-triggering
//               />
//               <span className="font-medium">{company.name}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredCompanies.length === 0 && (
//         <div className="text-center py-8">
//           <div className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>No companies found</div>
//         </div>
//       )}
//     </div>
//   );
// }

// interface DepartmentsSelectionProps {
//   rowId: string;
//   selectedItems: string[];
//   departments: Department[];
//   searchTerm: string;
//   targetRows: TargetRow[];
//   isAnyCompanySelected: () => boolean;
//   onToggleItem: (rowId: string, itemId: string) => void;
//   onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
// }

// export function DepartmentsSelection({
//   rowId,
//   selectedItems,
//   departments,
//   searchTerm,
//   targetRows,
//   isAnyCompanySelected,
//   onToggleItem,
//   onSearchChange
// }: DepartmentsSelectionProps) {
//   const { theme } = useTheme();
//   const filteredDepartments = departments.filter(dept =>
//     dept && dept.department_name && dept.department_name.toLowerCase().includes((searchTerm || '').toLowerCase())
//   );

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Select Departments</h3>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search departments..."
//             className={`input input-sm w-64 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded px-3 py-2`}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e, 'department')}
//           />
//         </div>
//       </div>

//       {!isAnyCompanySelected() && (
//         <div className={`alert ${theme === 'light' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-yellow-900 border-yellow-700 text-yellow-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <span>Please select at least one company first.</span>
//         </div>
//       )}

//       {isAnyCompanySelected() && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {filteredDepartments
//               .filter(dept =>
//                 // Only show departments from selected companies
//                 targetRows.some(targetRow =>
//                   targetRow.type === 'companies' &&
//                   targetRow.selectedCompanies.some(companyId => companyId === dept.company_id)
//                 )
//               )
//               .map(dept => (
//                 <div
//                   key={dept.id}
//                   className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedItems.includes(dept.id)
//                       ? theme === 'light' 
//                         ? 'bg-blue-50 border-blue-600 text-blue-900'
//                         : 'bg-blue-900 border-blue-400 text-blue-100'
//                       : theme === 'light'
//                         ? 'border-slate-300 hover:border-blue-500 bg-white'
//                         : 'border-slate-600 hover:border-blue-400 bg-slate-800'
//                     }`}
//                   onClick={() => onToggleItem(rowId, dept.id)}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className={`checkbox checkbox-sm mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                       checked={selectedItems.includes(dept.id)}
//                       onChange={() => { }} // Handled by parent div click
//                       onClick={(e) => e.stopPropagation()} // Prevent double-triggering
//                     />
//                     <div>
//                       <div className="w-full">
//                         <div className="font-medium">{dept.department_name}</div>
//                         <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                           {dept.company_name}
//                         </div>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               ))}
//           </div>

//           {filteredDepartments.filter(dept =>
//             targetRows.some(targetRow =>
//               targetRow.type === 'companies' &&
//               targetRow.selectedCompanies.some(companyId => companyId === dept.company_id)
//             )
//           ).length === 0 && (
//               <div className="text-center py-8">
//                 <div className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>No departments found for selected companies</div>
//               </div>
//             )}
//         </>
//       )}
//     </div>
//   );
// }

// interface PositionsSelectionProps {
//   rowId: string;
//   selectedItems: string[];
//   positions: Position[];
//   searchTerm: string;
//   targetRows: TargetRow[];
//   isAnyDepartmentSelected: () => boolean;
//   onToggleItem: (rowId: string, itemId: string) => void;
//   onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
// }

// export function PositionsSelection({
//   rowId,
//   selectedItems,
//   positions,
//   searchTerm,
//   targetRows,
//   isAnyDepartmentSelected,
//   onToggleItem,
//   onSearchChange
// }: PositionsSelectionProps) {
//   const { theme } = useTheme();
//   const filteredPositions = positions.filter(position =>
//     position && position.title && position.title.toLowerCase().includes((searchTerm || '').toLowerCase())
//   );


//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Select Positions</h3>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search positions..."
//             className={`input input-sm w-64 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded px-3 py-2`}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e, 'position')}
//           />
//         </div>
//       </div>

//       {!isAnyDepartmentSelected() && (
//         <div className={`alert ${theme === 'light' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-yellow-900 border-yellow-700 text-yellow-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <span>Please select at least one department first.</span>
//         </div>
//       )}

//       {isAnyDepartmentSelected() && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {filteredPositions
//               .filter(position =>
//                 // Only show positions from selected departments
//                 targetRows.some(targetRow =>
//                   targetRow.parentType === 'departments' &&
//                   targetRow.selectedDepartments.some(deptId => deptId === position.department_id)
//                 )
//               )
//               .map(position => (
//                 <div
//                   key={position.id}
//                   className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedItems.includes(position.id)
//                       ? theme === 'light' 
//                         ? 'bg-blue-50 border-blue-600 text-blue-900'
//                         : 'bg-blue-900 border-blue-400 text-blue-100'
//                       : theme === 'light'
//                         ? 'border-slate-300 hover:border-blue-500 bg-white'
//                         : 'border-slate-600 hover:border-blue-400 bg-slate-800'
//                     }`}
//                   onClick={() => onToggleItem(rowId, position.id)}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className={`checkbox checkbox-sm mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                       checked={selectedItems.includes(position.id)}
//                       onChange={() => { }} // Handled by parent div click
//                       onClick={(e) => e.stopPropagation()} // Prevent double-triggering
//                     />
//                     <div className="w-full">
//                       <div className="font-medium">{position.title}</div>
//                       <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         {position.company_name} • {position.department_name}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>

//           {filteredPositions.filter(position =>
//             targetRows.some(targetRow =>
//               targetRow.parentType === 'departments' &&
//               targetRow.selectedDepartments.some(deptId => deptId === position.department_id)
//             )
//           ).length === 0 && (
//               <div className="text-center py-8">
//                 <div className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>No positions found for selected departments</div>
//               </div>
//             )}
//         </>
//       )}
//     </div>
//   );
// }

// interface EmployeesSelectionProps {
//   rowId: string;
//   selectedItems: string[];
//   employees: Employee[];
//   searchTerm: string;
//   targetRows: TargetRow[];
//   isAnyPositionSelected: () => boolean;
//   onToggleItem: (rowId: string, itemId: string) => void;
//   onSearchChange: (e: ChangeEvent<HTMLInputElement>, type: 'company' | 'department' | 'position' | 'employee') => void;
// }

// export function EmployeesSelection({
//   rowId,
//   selectedItems,
//   employees,
//   searchTerm,
//   targetRows,
//   isAnyPositionSelected,
//   onToggleItem,
//   onSearchChange
// }: EmployeesSelectionProps) {
//   const { theme } = useTheme();
//   const filteredEmployees = employees.filter(employee =>
//     employee && employee.name && employee.name.toLowerCase().includes((searchTerm || '').toLowerCase())
//   );

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Select Employees</h3>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search employees..."
//             className={`input input-sm w-64 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded px-3 py-2`}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e, 'employee')}
//           />
//         </div>
//       </div>

//       {!isAnyPositionSelected() && (
//         <div className={`alert ${theme === 'light' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-yellow-900 border-yellow-700 text-yellow-200'} border rounded-lg`}>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <span>Please select at least one position first.</span>
//         </div>
//       )}

//       {isAnyPositionSelected() && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {filteredEmployees
//               .filter(employee =>
//                 // Only show employees from selected positions
//                 targetRows.some(targetRow =>
//                   targetRow.type === 'positions' &&
//                   targetRow.selectedPositions.some(posId => posId === employee.position_id)
//                 )
//               )
//               .map(employee => (
//                 <div
//                   key={employee.id}
//                   className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedItems.includes(employee.id)
//                       ? theme === 'light' 
//                         ? 'bg-blue-50 border-blue-600 text-blue-900'
//                         : 'bg-blue-900 border-blue-400 text-blue-100'
//                       : theme === 'light'
//                         ? 'border-slate-300 hover:border-blue-500 bg-white'
//                         : 'border-slate-600 hover:border-blue-400 bg-slate-800'
//                     }`}
//                   onClick={() => onToggleItem(rowId, employee.id)}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className={`checkbox checkbox-sm mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                       checked={selectedItems.includes(employee.id)}
//                       onChange={() => { }} // Handled by parent div click
//                       onClick={(e) => e.stopPropagation()} // Prevent double-triggering
//                     />
//                     <div className="w-full">
//                       <div className="font-medium">{employee.name}</div>
//                       <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         {employee.company_name} • {employee.department_name} • {employee.position_title} • {employee.job_level}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>

//           {filteredEmployees.filter(employee =>
//             targetRows.some(targetRow =>
//               targetRow.type === 'positions' &&
//               targetRow.selectedPositions.some(posId => posId === employee.position_id)
//             )
//           ).length === 0 && (
//               <div className="text-center py-8">
//                 <div className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>No employees found for selected positions</div>
//               </div>
//             )}
//         </>
//       )}
//     </div>
//   );
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
// }

// interface CompanyTabConfig {
//   title: string;
//   placeholder: string;
//   searchType: string;
//   nameField: string;
//   warningMessage: null;
//   checkDependency: null;
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
//   onSearchChange
// }: SelectionProps) {
//   const { theme } = useTheme();
//   // Change from a single boolean to an object that tracks selectAll state per tab
//   const [selectAllStates, setSelectAllStates] = useState<Record<string, boolean>>({
//     companies: false,
//     departments: false,
//     positions: false,
//     employees: false
//   });

//   // Get the current tab's selectAll state
//   const isSelectAllActive = selectAllStates[activeTab];

//   // Reset selectAll state for the tab when switching tabs
//   useEffect(() => {
//     // No need to reset - each tab has its own state now
//   }, [activeTab]);

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
//   let filteredItems = dataItems.filter(item =>
//     item && item[nameField] && String(item[nameField]).toLowerCase().includes((searchTerm || '').toLowerCase())
//   );

      


//   // Apply parent dependency filtering for departments, positions, employees
//   if (activeTab !== 'companies') {
//     // Type guard to ensure we're dealing with the right config type

//     const dependentConfig = config as DependentTabConfig;
//     const filterProperty = dependentConfig.filterProperty as keyof (Department | Position | Employee);
//     const parentType = dependentConfig.parentType;

//     if (parentType === 'companies') {
//       filteredItems = filteredItems.filter(item =>
//         targetRows.some(targetRow =>
//           targetRow.parentType === parentType &&
//           targetRow.selectedCompanies.some(parentId => parentId === (item as Department).company_id)
//         )
//       );
//     }
//     else if (parentType === 'departments') {
//       filteredItems = filteredItems.filter(item =>
//         targetRows.some(targetRow =>
//           targetRow.parentType === parentType &&
//           targetRow.selectedDepartments.some(parentId => parentId === (item as Position).department_id)
//         )
//       );
//     }
//     else if (parentType === 'positions') {
//       filteredItems = filteredItems.filter(item =>
//         targetRows.some(targetRow =>
//           targetRow.parentType === parentType &&
//           targetRow.selectedPositions.some(parentId => parentId === (item as Employee).position_id)
//         )
//       );
//     }
//   }

//   // Handle "Select All" functionality for the current tab only
//   const handleSelectAll = () => {
//     if (filteredItems.length === 0) return;


//     const willSelectAll = selectedItems.length !== filteredItems.length;

//     // Update only the current tab's selectAll state
//     setSelectAllStates(prev => ({
//       ...prev,
//       [activeTab]: willSelectAll
//     }));

//     if (willSelectAll) {
//       // If not all are selected, select all that aren't already selected
//       filteredItems.forEach(item => {
//         if (!selectedItems.includes(item.id)) {
//           onToggleItem(rowId, item.id);
//         }
//       });
//     } else {
//       // If all are selected, deselect all
//       filteredItems.forEach(item => {
//         if (selectedItems.includes(item.id)) {
//           onToggleItem(rowId, item.id);
//         }
//       });
//     }
//   };

//   // Determine checkbox state (checked, unchecked, or indeterminate)
//   const allSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;
//   const someSelected = selectedItems.length > 0 && selectedItems.length < filteredItems.length;

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
//         <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{config.title}</h3>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder={config.placeholder}
//             className={`input input-sm w-64 border ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} rounded px-3 py-2`}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e, searchType)}
//           />
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
//               className={`border rounded-lg p-3 mb-3 cursor-pointer transition-colors ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600'}`}
//               onClick={handleSelectAll}
//             >
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className={`checkbox checkbox-md mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                   checked={allSelected}
//                   ref={checkbox => {
//                     if (checkbox) {
//                       checkbox.indeterminate = someSelected;
//                     }
//                   }}
//                   onChange={() => { }}
//                   onClick={(e) => e.stopPropagation()}
//                 />
//                 <span className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Select All {filteredItems.length > 0 ? `(${filteredItems.length})` : ""}</span>
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {filteredItems.map(item => (
//               <div
//                 key={item.id}
//                 className={`border rounded-lg p-3 transition-colors ${selectAllStates[activeTab] ? 'cursor-not-allowed' : 'cursor-pointer'
//                   } ${selectedItems.includes(item.id)
//                     ? selectAllStates[activeTab]
//                       ? theme === 'light'
//                         ? 'bg-gray-100 border-blue-600 text-gray-400'
//                         : 'bg-gray-800 border-blue-400 text-gray-500'
//                       : theme === 'light'
//                         ? 'bg-blue-50 border-blue-600 text-blue-900'
//                         : 'bg-blue-900 border-blue-400 text-blue-100'
//                     : theme === 'light'
//                       ? 'border-slate-300 hover:border-blue-500 bg-white'
//                       : 'border-slate-600 hover:border-blue-400 bg-slate-800'
//                   }`}
//                 onClick={() => selectAllStates[activeTab] ? null : onToggleItem(rowId, item.id)}
//               >
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     className={`checkbox checkbox-sm mr-3 ${theme === 'light' ? 'checkbox-primary' : 'checkbox-accent'}`}
//                     checked={selectedItems.includes(item.id)}
//                     disabled={selectAllStates[activeTab]}
//                     onChange={() => { }} // Handled by parent div click
//                     onClick={(e) => e.stopPropagation()} // Prevent double-triggering
//                   />
//                   <div className="w-full">
//                     <div className="font-medium">{String(item[nameField])}</div>
//                     {activeTab === 'departments' ? (
//                       <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         {(item as Department).company_name}
//                       </div>
//                     ) : activeTab === 'positions' ? (
//                       <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         {(item as Position).company_name} • {(item as Position).department_name}
//                       </div>
//                     ) : activeTab === 'employees' ? (
//                       <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                         {(item as Employee).company_name} • {(item as Employee).department_name} • {(item as Employee).position_title} • {(item as Employee).job_level}
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredItems.length === 0 && (
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
//   isAnyPositionSelected
// }: TargetRowCardProps) {
//   const { theme } = useTheme();
//   return (
//     <div className={`border rounded-lg ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-800'}`}>
//       {/* Target Row Header */}
//       <div
//         className={`p-3 rounded-t-lg flex items-center justify-between ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}
//       >
//         <div className="flex items-center gap-3">
//           <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//             {row.selectedCompanies.length + row.selectedDepartments.length + row.selectedPositions.length + row.selectedEmployees.length} selected
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           {/* Toggle Collapse button removed */}
//         </div>
//       </div>

//       {/* Target Row Content - always visible now since we removed toggle */}
//       <div className="block">
//         {/* Tab Navigation */}
//         <div className={`tabs tabs-boxed border-b ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'companies' ? 'tab-active' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => onChangeTab(row.id, 'companies', '')}
//           >
//             Companies
//           </a>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'departments' ? 'tab-active' : ''} ${!isAnyCompanySelected() ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => onChangeTab(row.id, 'departments', 'companies')}
//             title={!isAnyCompanySelected() ? 'Select a company first' : ''}
//           >
//             Departments
//           </a>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'positions' ? 'tab-active' : ''} ${isAnyDepartmentSelected() || isAnyPositionSelected() ? '' : 'opacity-50 cursor-not-allowed'} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => onChangeTab(row.id, 'positions', 'departments')}
//             title={!isAnyDepartmentSelected() ? 'Select a department first' : ''}
//           >
//             Positions
//           </a>
//           <a
//             className={`tab tab-sm ${row.activeTab === 'employees' ? 'tab-active' : ''} ${!isAnyPositionSelected() ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}
//             onClick={() => onChangeTab(row.id, 'employees', 'positions')}
//             title={!isAnyPositionSelected() ? 'Select a position first' : ''}
//           >
//             Employees
//           </a>
//         </div>

//         <div className="p-4">
//           <Selection
//             rowId={row.id}
//             selectedItems={
//               row.activeTab === 'companies'
//                 ? row.selectedCompanies
//                 : row.activeTab === 'departments'
//                   ? row.selectedDepartments
//                   : row.activeTab === 'positions'
//                     ? row.selectedPositions
//                     : row.selectedEmployees
//             }
//             dataItems={
//               row.activeTab === 'companies'
//                 ? companies
//                 : row.activeTab === 'departments'
//                   ? departments
//                   : row.activeTab === 'positions'
//                     ? positions
//                     : employees
//             }
//             searchTerm={
//               row.activeTab === 'companies'
//                 ? companySearchTerm
//                 : row.activeTab === 'departments'
//                   ? departmentSearchTerm
//                   : row.activeTab === 'positions'
//                     ? positionSearchTerm
//                     : employeeSearchTerm
//             }
//             targetRows={targetRows}
//             activeTab={row.activeTab}
//             isAnyCompanySelected={isAnyCompanySelected}
//             isAnyDepartmentSelected={isAnyDepartmentSelected}
//             isAnyPositionSelected={isAnyPositionSelected}
//             onToggleItem={onToggleItem}
//             onSearchChange={onSearchChange}
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

    // Get the current row
    const currentRow = targetRows.find(row => row.id === rowId);
    if (!currentRow) return null;

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

  // Update selectAll state when items change
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
