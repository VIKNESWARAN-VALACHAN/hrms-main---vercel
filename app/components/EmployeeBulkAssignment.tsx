// // // components/EmployeeBulkAssignment.tsx
// // 'use client';

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../config';
// // import { useTheme } from '../components/ThemeProvider';
// // import { useNotification } from '../hooks/useNotification';
// // import { FaSearch, FaCheck, FaTimes, FaUsers } from 'react-icons/fa';

// // interface Employee {
// //   id: number;
// //   name: string;
// //   employee_code: string;
// //   department_name: string;
// //   current_group_id?: number | null;
// // }

// // interface EmployeeBulkAssignmentProps {
// //   groupId: number;
// //   onClose: () => void;
// //   onSuccess: () => void;
// // }

// // const EmployeeBulkAssignment: React.FC<EmployeeBulkAssignmentProps> = ({
// //   groupId,
// //   onClose,
// //   onSuccess
// // }) => {
// //   const { theme } = useTheme();
// //   const { showNotification } = useNotification();
// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
// //   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [assigning, setAssigning] = useState(false);
// //   const [effectiveDate, setEffectiveDate] = useState(
// //     new Date().toISOString().split('T')[0]
// //   );
  
// //   // Fetch employees
// //   const fetchEmployees = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups/employees/available`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         },
// //         params: { groupId }
// //       });
      
// //       setEmployees(response.data);
// //       setFilteredEmployees(response.data);
// //     } catch (error) {
// //       console.error('Error fetching employees:', error);
// //       showNotification('Error loading employees', 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   useEffect(() => {
// //     fetchEmployees();
// //   }, [groupId]);
  
// //   // Filter employees based on search
// //   useEffect(() => {
// //     if (!searchTerm.trim()) {
// //       setFilteredEmployees(employees);
// //     } else {
// //       const filtered = employees.filter(emp =>
// //         emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         emp.department_name.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //       setFilteredEmployees(filtered);
// //     }
// //   }, [searchTerm, employees]);
  
// //   // Select/deselect all
// // //   const toggleSelectAll = (checked: boolean) => {
// // //     if (checked) {
// // //       setSelectedEmployees(
// // //         filteredEmployees
// // //           .filter(emp => emp.current_group_id !== groupId)
// // //           .map(emp => emp.id)
// // //       );
// // //     } else {
// // //       setSelectedEmployees([]);
// // //     }
// // //   };

// // const toggleSelectAll = (checked: boolean) => {
// //   if (checked) {
// //     setSelectedEmployees(
// //       filteredEmployees
// //         .filter(emp => emp.current_group_id?.toString() !== groupId.toString())
// //         .map(emp => emp.id)
// //     );
// //   } else {
// //     setSelectedEmployees([]);
// //   }
// // };
  
// //   // Toggle single employee
// //   const toggleEmployee = (employeeId: number) => {
// //     setSelectedEmployees(prev =>
// //       prev.includes(employeeId)
// //         ? prev.filter(id => id !== employeeId)
// //         : [...prev, employeeId]
// //     );
// //   };
  
// //   // Assign selected employees to group
// //   const handleAssignEmployees = async () => {
// //     if (selectedEmployees.length === 0) {
// //       showNotification('Please select at least one employee', 'error');
// //       return;
// //     }
    
// //     try {
// //       setAssigning(true);
// //       await axios.post(
// //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign`,
// //         {
// //           employee_ids: selectedEmployees,
// //           effective_date: effectiveDate
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           }
// //         }
// //       );
      
// //       showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
// //       onSuccess();
// //     } catch (error: any) {
// //       console.error('Error assigning employees:', error);
// //       showNotification(error.response?.data?.error || 'Error assigning employees', 'error');
// //     } finally {
// //       setAssigning(false);
// //     }
// //   };
  
// //   // Remove employee from group
// //   const removeEmployeeFromGroup = async (employeeId: number) => {
// //     try {
// //       // End the assignment by setting end_date
// //       await axios.put(
// //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
// //         { end_date: new Date().toISOString().split('T')[0] },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //           }
// //         }
// //       );
      
// //       showNotification('Employee removed from group', 'success');
// //       fetchEmployees(); // Refresh list
// //     } catch (error: any) {
// //       console.error('Error removing employee:', error);
// //       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
// //     }
// //   };
  
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <span className="loading loading-spinner loading-lg"></span>
// //       </div>
// //     );
// //   }
  
// //   return (
// //     <div className="space-y-4">
// //       {/* Search and Select All */}
// //       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
// //         <div className="flex items-center gap-2">
// //           <div className="form-control">
// //             <label className="label cursor-pointer gap-2">
// //               <input
// //                 type="checkbox"
// //                 checked={selectedEmployees.length === filteredEmployees.filter(e => e.current_group_id !== groupId).length && 
// //                         filteredEmployees.filter(e => e.current_group_id !== groupId).length > 0}
// //                 onChange={(e) => toggleSelectAll(e.target.checked)}
// //                 className="checkbox checkbox-primary"
// //                 disabled={filteredEmployees.filter(e => e.current_group_id !== groupId).length === 0}
// //               />
// //               <span className="label-text">Select All Available</span>
// //             </label>
// //           </div>
          
// //           <div className="badge badge-primary">
// //             {selectedEmployees.length} selected
// //           </div>
// //         </div>
        
// //         <div className="join w-full sm:w-auto">
// //           <input
// //             type="text"
// //             placeholder="Search employees..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="input input-bordered join-item w-full"
// //           />
// //           <button className="btn join-item">
// //             <FaSearch />
// //           </button>
// //         </div>
// //       </div>
      
// //       {/* Effective Date */}
// //       <div>
// //         <label className="label">
// //           <span className="label-text">Effective Date</span>
// //         </label>
// //         <input
// //           type="date"
// //           value={effectiveDate}
// //           onChange={(e) => setEffectiveDate(e.target.value)}
// //           className="input input-bordered w-full"
// //         />
// //       </div>
      
// //       {/* Employees Table */}
// //       <div className="overflow-x-auto max-h-96">
// //         <table className="table">
// //           <thead>
// //             <tr>
// //               <th></th>
// //               <th>Employee</th>
// //               <th>Employee Code</th>
// //               <th>Department</th>
// //               <th>Current Group</th>
// //               <th>Action</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredEmployees.map(employee => {
// //               const isSelected = selectedEmployees.includes(employee.id);
// //               const isInThisGroup = employee.current_group_id?.toString() === groupId.toString();
// //               //const isInThisGroup = employee.current_group_id === groupId;
// //               const isInOtherGroup = employee.current_group_id && employee.current_group_id !== groupId;
              
// //               return (
// //                 <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
// //                   <td>
// //                     {!isInThisGroup && (
// //                       <input
// //                         type="checkbox"
// //                         checked={isSelected}
// //                         onChange={() => toggleEmployee(employee.id)}
// //                         className="checkbox checkbox-primary checkbox-sm"
// //                       />
// //                     )}
// //                   </td>
// //                   <td>
// //                     <div className="font-medium">{employee.name}</div>
// //                     {isInThisGroup && (
// //                       <div className="badge badge-success badge-xs mt-1">
// //                         Already in group
// //                       </div>
// //                     )}
// //                     {isInOtherGroup && (
// //                       <div className="badge badge-warning badge-xs mt-1">
// //                         In another group
// //                       </div>
// //                     )}
// //                   </td>
// //                   <td>{employee.employee_code}</td>
// //                   <td>{employee.department_name}</td>
// //                   <td>
// //                     {isInThisGroup ? (
// //                       <span className="badge badge-success">This Group</span>
// //                     ) : isInOtherGroup ? (
// //                       <span className="badge badge-warning">Group #{employee.current_group_id}</span>
// //                     ) : (
// //                       <span className="text-slate-500">No group</span>
// //                     )}
// //                   </td>
// //                   <td>
// //                     {isInThisGroup ? (
// //                       <button
// //                         onClick={() => removeEmployeeFromGroup(employee.id)}
// //                         className="btn btn-xs btn-error flex items-center gap-1"
// //                       >
// //                         <FaTimes />
// //                         Remove
// //                       </button>
// //                     ) : (
// //                       <button
// //                         onClick={() => toggleEmployee(employee.id)}
// //                         className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
// //                       >
// //                         {isSelected ? (
// //                           <>
// //                             <FaTimes />
// //                             Deselect
// //                           </>
// //                         ) : (
// //                           <>
// //                             <FaCheck />
// //                             Select
// //                           </>
// //                         )}
// //                       </button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               );
// //             })}
            
// //             {filteredEmployees.length === 0 && (
// //               <tr>
// //                 <td colSpan={6} className="text-center py-8">
// //                   <div className="flex flex-col items-center justify-center gap-2">
// //                     <FaUsers className="h-12 w-12 text-slate-400" />
// //                     <p className="text-lg text-slate-600">
// //                       No employees found
// //                     </p>
// //                     {searchTerm && (
// //                       <p className="text-sm text-slate-500">
// //                         Try adjusting your search
// //                       </p>
// //                     )}
// //                   </div>
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
      
// //       {/* Actions */}
// //       <div className="flex justify-between items-center pt-4 border-t">
// //         <div className="text-sm">
// //           <p className="text-slate-600">
// //             Selected: <strong>{selectedEmployees.length}</strong> employee(s)
// //           </p>
// //         </div>
        
// //         <div className="flex gap-2">
// //           <button onClick={onClose} className="btn btn-ghost">
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleAssignEmployees}
// //             disabled={selectedEmployees.length === 0 || assigning}
// //             className="btn btn-primary"
// //           >
// //             {assigning ? (
// //               <>
// //                 <span className="loading loading-spinner loading-sm"></span>
// //                 Assigning...
// //               </>
// //             ) : (
// //               `Assign ${selectedEmployees.length} Employee(s)`
// //             )}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeeBulkAssignment;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { useTheme } from '../components/ThemeProvider';
// import { useNotification } from '../hooks/useNotification';
// import { FaSearch, FaCheck, FaTimes, FaUsers, FaFilter } from 'react-icons/fa';

// interface Employee {
//   id: number;
//   name: string;
//   employee_code: string;
//   department_name: string;
//   current_group_id?: number | null;
// }

// interface EmployeeBulkAssignmentProps {
//   groupId: number;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const EmployeeBulkAssignment: React.FC<EmployeeBulkAssignmentProps> = ({
//   groupId,
//   onClose,
//   onSuccess
// }) => {
//   const { theme } = useTheme();
//   const { showNotification } = useNotification();
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
//   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [assigning, setAssigning] = useState(false);
//   const [effectiveDate, setEffectiveDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );
//   const [departmentFilter, setDepartmentFilter] = useState<string>('all');
//   const [departments, setDepartments] = useState<string[]>([]);
  
//   // Fetch employees
//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups/employees/available`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//         },
//         params: { groupId }
//       });
      
//       setEmployees(response.data);
      
//       // Extract unique departments
//       const uniqueDepartments = [...new Set(response.data
//         .map((emp: Employee) => emp.department_name)
//         .filter(Boolean))] as string[];
//       setDepartments(['all', ...uniqueDepartments]);
      
//       // Initial filtered employees
//       setFilteredEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       showNotification('Error loading employees', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchEmployees();
//   }, [groupId]);
  
//   // Filter employees based on search and filters
//   useEffect(() => {
//     let filtered = employees;
    
//     // Apply search filter
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(emp =>
//         emp.name.toLowerCase().includes(term) ||
//         emp.employee_code.toLowerCase().includes(term) ||
//         emp.department_name?.toLowerCase().includes(term)
//       );
//     }
    
//     // Apply department filter
//     if (departmentFilter !== 'all') {
//       filtered = filtered.filter(emp => 
//         emp.department_name === departmentFilter
//       );
//     }
    
//     setFilteredEmployees(filtered);
//   }, [searchTerm, departmentFilter, employees]);
  
//   // Select/deselect all
//   const toggleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedEmployees(
//         filteredEmployees
//           .filter(emp => emp.current_group_id?.toString() !== groupId.toString())
//           .map(emp => emp.id)
//       );
//     } else {
//       setSelectedEmployees([]);
//     }
//   };
  
//   // Toggle single employee
//   const toggleEmployee = (employeeId: number) => {
//     setSelectedEmployees(prev =>
//       prev.includes(employeeId)
//         ? prev.filter(id => id !== employeeId)
//         : [...prev, employeeId]
//     );
//   };
  
//   // Assign selected employees to group
//   const handleAssignEmployees = async () => {
//     if (selectedEmployees.length === 0) {
//       showNotification('Please select at least one employee', 'error');
//       return;
//     }
    
//     try {
//       setAssigning(true);
//       await axios.post(
//         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign`,
//         {
//           employee_ids: selectedEmployees,
//           effective_date: effectiveDate
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         }
//       );
      
//       showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
//       onSuccess();
//     } catch (error: any) {
//       console.error('Error assigning employees:', error);
//       showNotification(error.response?.data?.error || 'Error assigning employees', 'error');
//     } finally {
//       setAssigning(false);
//     }
//   };
  
//   // Remove employee from group
//   const removeEmployeeFromGroup = async (employeeId: number) => {
//     try {
//       // End the assignment
//       await axios.put(
//         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
//         { end_date: new Date().toISOString().split('T')[0] },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           }
//         }
//       );
      
//       showNotification('Employee removed from group', 'success');
//       fetchEmployees(); // Refresh list
//     } catch (error: any) {
//       console.error('Error removing employee:', error);
//       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }
  
//   return (
//     <div className="space-y-4">
//       {/* Search and Filter Controls */}
//       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
//         <div className="flex items-center gap-2">
//           <div className="form-control">
//             <label className="label cursor-pointer gap-2">
//               <input
//                 type="checkbox"
//                 checked={selectedEmployees.length === filteredEmployees.filter(e => e.current_group_id?.toString() !== groupId.toString()).length && 
//                         filteredEmployees.filter(e => e.current_group_id?.toString() !== groupId.toString()).length > 0}
//                 onChange={(e) => toggleSelectAll(e.target.checked)}
//                 className="checkbox checkbox-primary"
//                 disabled={filteredEmployees.filter(e => e.current_group_id?.toString() !== groupId.toString()).length === 0}
//               />
//               <span className="label-text">Select All Available</span>
//             </label>
//           </div>
          
//           <div className="badge badge-primary">
//             {selectedEmployees.length} selected
//           </div>
//         </div>
        
//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//           <div className="join">
//             <input
//               type="text"
//               placeholder="Search employees..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input input-bordered join-item w-full sm:w-64"
//             />
//             <button className="btn join-item">
//               <FaSearch />
//             </button>
//           </div>
          
//           <select
//             value={departmentFilter}
//             onChange={(e) => setDepartmentFilter(e.target.value)}
//             className="select select-bordered"
//           >
//             <option value="all">All Departments</option>
//             {departments
//               .filter(dept => dept !== 'all')
//               .map(dept => (
//                 <option key={dept} value={dept}>{dept}</option>
//               ))
//             }
//           </select>
//         </div>
//       </div>
      
//       {/* Effective Date */}
//       <div>
//         <label className="label">
//           <span className="label-text">Effective Date</span>
//         </label>
//         <input
//           type="date"
//           value={effectiveDate}
//           onChange={(e) => setEffectiveDate(e.target.value)}
//           className="input input-bordered w-full"
//         />
//       </div>
      
//       {/* Employees Table */}
//       <div className="overflow-x-auto max-h-96 border rounded-lg">
//         <table className="table table-zebra">
//           <thead>
//             <tr>
//               <th></th>
//               <th>Employee</th>
//               <th>Employee Code</th>
//               <th>Department</th>
//               <th>Current Group</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEmployees.map(employee => {
//               const isSelected = selectedEmployees.includes(employee.id);
//               const isInThisGroup = employee.current_group_id?.toString() === groupId.toString();
//               const isInOtherGroup = employee.current_group_id && employee.current_group_id.toString() !== groupId.toString();
              
//               return (
//                 <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
//                   <td>
//                     {!isInThisGroup && (
//                       <input
//                         type="checkbox"
//                         checked={isSelected}
//                         onChange={() => toggleEmployee(employee.id)}
//                         className="checkbox checkbox-primary checkbox-sm"
//                       />
//                     )}
//                   </td>
//                   <td>
//                     <div className="font-medium">{employee.name}</div>
//                     {isInThisGroup && (
//                       <div className="badge badge-success badge-xs mt-1">
//                         Already in group
//                       </div>
//                     )}
//                     {isInOtherGroup && (
//                       <div className="badge badge-warning badge-xs mt-1">
//                         In another group
//                       </div>
//                     )}
//                   </td>
//                   <td className="font-mono">{employee.employee_code}</td>
//                   <td>{employee.department_name || '-'}</td>
//                   <td>
//                     {isInThisGroup ? (
//                       <span className="badge badge-success">This Group</span>
//                     ) : isInOtherGroup ? (
//                       <span className="badge badge-warning">Group #{employee.current_group_id}</span>
//                     ) : (
//                       <span className="text-slate-500">No group</span>
//                     )}
//                   </td>
//                   <td>
//                     {isInThisGroup ? (
//                       <button
//                         onClick={() => removeEmployeeFromGroup(employee.id)}
//                         className="btn btn-xs btn-error flex items-center gap-1"
//                       >
//                         <FaTimes />
//                         Remove
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => toggleEmployee(employee.id)}
//                         className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
//                       >
//                         {isSelected ? (
//                           <>
//                             <FaTimes />
//                             Deselect
//                           </>
//                         ) : (
//                           <>
//                             <FaCheck />
//                             Select
//                           </>
//                         )}
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
            
//             {filteredEmployees.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="text-center py-8">
//                   <div className="flex flex-col items-center justify-center gap-2">
//                     <FaUsers className="h-12 w-12 text-slate-400" />
//                     <p className="text-lg text-slate-600">
//                       No employees found
//                     </p>
//                     {searchTerm || departmentFilter !== 'all' ? (
//                       <p className="text-sm text-slate-500">
//                         Try adjusting your search or filters
//                       </p>
//                     ) : (
//                       <p className="text-sm text-slate-500">
//                         No employees available for assignment
//                       </p>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Actions */}
//       <div className="flex justify-between items-center pt-4 border-t">
//         <div className="text-sm">
//           <p className="text-slate-600">
//             Showing {filteredEmployees.length} of {employees.length} employees
//             {searchTerm && ` • Searching: "${searchTerm}"`}
//             {departmentFilter !== 'all' && ` • Department: ${departmentFilter}`}
//           </p>
//         </div>
        
//         <div className="flex gap-2">
//           <button onClick={onClose} className="btn btn-ghost">
//             Cancel
//           </button>
//           <button
//             onClick={handleAssignEmployees}
//             disabled={selectedEmployees.length === 0 || assigning}
//             className="btn btn-primary"
//           >
//             {assigning ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 Assigning...
//               </>
//             ) : (
//               `Assign ${selectedEmployees.length} Employee(s)`
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeBulkAssignment;

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNotification } from '../hooks/useNotification';
import { 
  FaSearch, FaUserPlus, FaTimes, FaUser, 
  FaUndo, FaAngleLeft, FaAngleRight, 
  FaAngleDoubleLeft, FaAngleDoubleRight,
  FaUsers, FaCheckCircle
} from 'react-icons/fa';

interface Employee {
  id: number;
  name: string;
  employee_code: string;
  department_name: string | null;
  department: string | null;
  joined_date: string | null;
  current_group_id: number | null;
  assignment_id: number | null;
  effective_date: string | null;
  end_date: string | null;
  is_assigned: number; // 0 or 1
}

interface EmployeeBulkAssignmentProps {
  groupId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EmployeeBulkAssignment: React.FC<EmployeeBulkAssignmentProps> = ({
  groupId,
  onClose,
  onSuccess
}) => {
  const { showNotification } = useNotification();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [showAssigned, setShowAssigned] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Helper function to safely get employees array
  const getEmployeesArray = (data: any): Employee[] => {
    if (!data) return [];
    
    // Check if data has employees array (with pagination)
    if (data.employees && Array.isArray(data.employees)) {
      return data.employees;
    }
    
    // Check if data is directly an array (without pagination)
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  };

  // Helper function to get pagination info
  const getPaginationInfo = (data: any) => {
    if (!data) return { total: 0, totalPages: 1 };
    
    // If data has pagination info
    if (data.pagination) {
      return {
        total: data.pagination.total || 0,
        totalPages: data.pagination.total_pages || 1
      };
    }
    
    // If data is an array without pagination
    if (Array.isArray(data)) {
      return {
        total: data.length,
        totalPages: 1
      };
    }
    
    return { total: 0, totalPages: 1 };
  };
  
  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/leave-entitlement-groups/employees/available`,
        {
          params: { 
            groupId: groupId,
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm || undefined
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }
      );
      
      console.log('API Response:', response.data);
      
      const responseData = response.data;
      
      // Get employees array safely - FIXED THIS LINE
      const employeesArray = getEmployeesArray(responseData); // REMOVED THE TERNARY OPERATOR
      const paginationInfo = getPaginationInfo(responseData);
      
      console.log('Employees array:', employeesArray);
      console.log('Pagination info:', paginationInfo);
      
      setEmployees(employeesArray);
      setTotalItems(paginationInfo.total);
      setTotalPages(paginationInfo.totalPages);
      
      // Clear selections when data changes and not showing assigned
      if (!showAssigned) {
        setSelectedEmployees([]);
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      showNotification('Error loading employees', 'error');
      setEmployees([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch employees when dependencies change
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, itemsPerPage, searchTerm, groupId]);
  
  // Filter employees based on assigned status - ADDED SAFETY CHECK
  const displayEmployees = useMemo(() => {
    // Always ensure we have an array
    if (!Array.isArray(employees)) {
      console.warn('employees is not an array:', employees);
      return [];
    }
    
    if (showAssigned) {
      return employees.filter(emp => emp.is_assigned === 1);
    }
    
    return employees.filter(emp => emp.is_assigned === 0);
  }, [employees, showAssigned]);
  
  // Calculate counts safely
  const assignedCount = useMemo(() => {
    if (!Array.isArray(employees)) {
      console.warn('employees is not an array in assignedCount:', employees);
      return 0;
    }
    return employees.filter(emp => emp.is_assigned === 1).length;
  }, [employees]);
  
  const availableCount = useMemo(() => {
    if (!Array.isArray(employees)) {
      console.warn('employees is not an array in availableCount:', employees);
      return 0;
    }
    return employees.filter(emp => emp.is_assigned === 0).length;
  }, [employees]);
  
  // Toggle employee selection
  const toggleEmployeeSelection = (employeeId: number) => {
    if (showAssigned) return;
    
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };
  
  // Select all available employees on current page
  const selectAllCurrentPage = () => {
    if (showAssigned || !Array.isArray(displayEmployees)) return;
    
    const currentPageAvailable = displayEmployees.filter(emp => emp.is_assigned === 0);
    const allIds = currentPageAvailable.map(emp => emp.id);
    setSelectedEmployees(allIds);
  };
  
  // Clear all selections
  const clearSelections = () => {
    setSelectedEmployees([]);
  };
  
  // Assign selected employees
  const assignEmployees = async () => {
    if (selectedEmployees.length === 0) {
      showNotification('Please select at least one employee', 'error');
      return;
    }
    
    try {
      setAssigning(true);
      await axios.post(
        `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign`,
        {
          employee_ids: selectedEmployees,
          effective_date: new Date().toISOString().split('T')[0]
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
      setSelectedEmployees([]);
      fetchEmployees(); // Refresh the list
      onSuccess();
    } catch (error: any) {
      console.error('Error assigning employees:', error);
      const errorMsg = error.response?.data?.error || 'Error assigning employees';
      showNotification(errorMsg, 'error');
    } finally {
      setAssigning(false);
    }
  };
  
  // Remove employee assignment
  const removeAssignment = async (assignmentId: number | null, employeeName: string) => {
    if (!assignmentId || !confirm(`Remove ${employeeName} from this group?`)) {
      return;
    }
    
    try {
      await axios.delete(
        `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }
      );
      
      showNotification('Employee removed from group', 'success');
      fetchEmployees(); // Refresh the list
    } catch (error: any) {
      console.error('Error removing assignment:', error);
      showNotification(error.response?.data?.error || 'Error removing assignment', 'error');
    }
  };
  
  // Toggle show assigned employees
  const toggleShowAssigned = () => {
    setShowAssigned(!showAssigned);
    setCurrentPage(1);
    setSelectedEmployees([]);
  };
  
  // Go to page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Reset search when switching modes
  useEffect(() => {
    setCurrentPage(1);
  }, [showAssigned]);
  
  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Get a safe array for rendering
  const safeDisplayEmployees = Array.isArray(displayEmployees) ? displayEmployees : [];
  
  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={
                showAssigned 
                  ? "Search assigned employees..." 
                  : "Search available employees by name, ID, or department..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={toggleShowAssigned}
            className={`btn ${showAssigned ? 'btn-primary' : 'btn-outline'}`}
          >
            {showAssigned ? 'Show Available' : 'Show Assigned'}
          </button>
          <button
            onClick={fetchEmployees}
            className="btn btn-ghost"
            title="Refresh"
          >
            <FaUndo />
          </button>
        </div>
      </div>
      
      {/* Selection Controls - Only for available employees */}
      {!showAssigned && (
        <div className="flex justify-between items-center mb-4 p-3 bg-base-200 rounded-lg">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium">{selectedEmployees.length}</span> employees selected
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAllCurrentPage}
                className="btn btn-xs btn-outline"
                disabled={availableCount === 0}
              >
                Select All on Page
              </button>
              <button
                onClick={clearSelections}
                className="btn btn-xs btn-outline"
                disabled={selectedEmployees.length === 0}
              >
                Clear All
              </button>
            </div>
          </div>
          
          <button
            onClick={assignEmployees}
            disabled={selectedEmployees.length === 0 || assigning}
            className="btn btn-primary"
          >
            {assigning ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Assigning...
              </>
            ) : (
              <>
                <FaUserPlus className="mr-2" />
                Assign Selected ({selectedEmployees.length})
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Items Per Page Selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="select select-bordered select-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm">entries</span>
        </div>
        
        <div className="text-sm">
          Showing {safeDisplayEmployees.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          {showAssigned && ` (${assignedCount} assigned)`}
          {!showAssigned && ` (${availableCount} available)`}
        </div>
      </div>
      
      {/* Employees Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {!showAssigned && <th className="w-12"></th>}
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={showAssigned ? 5 : 6} className="text-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-2">
                    {showAssigned ? 'Loading assigned employees...' : 'Loading available employees...'}
                  </p>
                </td>
              </tr>
            ) : safeDisplayEmployees.length === 0 ? (
              <tr>
                <td colSpan={showAssigned ? 5 : 6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FaUsers className="h-12 w-12 text-slate-400" />
                    <p className="font-medium">
                      {showAssigned ? 'No assigned employees' : 'No employees found'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {searchTerm 
                        ? 'Try a different search term' 
                        : showAssigned 
                          ? 'No employees are assigned to this group yet'
                          : 'All employees are already assigned to this group'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              safeDisplayEmployees.map((employee) => (
                <tr key={employee.id} className="hover">
                  {!showAssigned && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="checkbox checkbox-primary"
                        disabled={employee.is_assigned === 1}
                      />
                    </td>
                  )}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <FaUser />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{employee.name || 'Unnamed'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{employee.employee_code || 'N/A'}</td>
                  <td>{employee.department_name || employee.department || 'N/A'}</td>
                  <td>
                    {employee.is_assigned === 1 ? (
                      <span className="badge badge-success gap-1">
                        <FaCheckCircle />
                        Assigned
                      </span>
                    ) : (
                      <span className="badge badge-outline">Available</span>
                    )}
                  </td>
                  <td className="text-right">
                    {showAssigned && employee.assignment_id ? (
                      <button
                        onClick={() => removeAssignment(employee.assignment_id, employee.name || 'employee')}
                        className="btn btn-xs btn-error"
                      >
                        Remove
                      </button>
                    ) : !showAssigned && employee.is_assigned === 0 ? (
                      <button
                        onClick={() => toggleEmployeeSelection(employee.id)}
                        className={`btn btn-xs ${selectedEmployees.includes(employee.id) ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {selectedEmployees.includes(employee.id) ? 'Selected' : 'Select'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-ghost"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-ghost"
          >
            <FaAngleLeft />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-ghost"
          >
            Next
            <FaAngleRight />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-ghost"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      )}
      
      {/* Summary */}
      <div className="mt-6 p-4 border rounded-lg bg-base-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{assignedCount}</div>
            <div className="text-sm text-slate-500">Currently Assigned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{availableCount}</div>
            <div className="text-sm text-slate-500">Available to Assign</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{selectedEmployees.length}</div>
            <div className="text-sm text-slate-500">Selected for Assignment</div>
          </div>
        </div>
      </div>
      
      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="btn btn-ghost"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmployeeBulkAssignment;
