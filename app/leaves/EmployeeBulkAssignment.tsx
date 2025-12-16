// // // // // 'use client';

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import axios from 'axios';
// // // // // import { API_BASE_URL } from '../config';
// // // // // import { useTheme } from '../components/ThemeProvider';
// // // // // import { useNotification } from '../hooks/useNotification';
// // // // // import { FaSearch, FaCheck, FaTimes } from 'react-icons/fa';

// // // // // interface Employee {
// // // // //   id: number;
// // // // //   name: string;
// // // // //   employee_code: string;
// // // // //   department_name: string;
// // // // //   current_group?: string;
// // // // // }

// // // // // interface EmployeeBulkAssignmentProps {
// // // // //   groupId: number;
// // // // //   onClose: () => void;
// // // // //   onSuccess: () => void;
// // // // // }

// // // // // const EmployeeBulkAssignment: React.FC<EmployeeBulkAssignmentProps> = ({
// // // // //   groupId,
// // // // //   onClose,
// // // // //   onSuccess
// // // // // }) => {
// // // // //   const { theme } = useTheme();
// // // // //   const { showNotification } = useNotification();
// // // // //   const [employees, setEmployees] = useState<Employee[]>([]);
// // // // //   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
// // // // //   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
// // // // //   const [searchTerm, setSearchTerm] = useState('');
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [assigning, setAssigning] = useState(false);
// // // // //   const [effectiveDate, setEffectiveDate] = useState(
// // // // //     new Date().toISOString().split('T')[0]
// // // // //   );
  
// // // // //   // Fetch employees
// // // // //   const fetchEmployees = async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const response = await axios.get(`${API_BASE_URL}/api/employees`, {
// // // // //         headers: {
// // // // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // // //         },
// // // // //         params: { with_groups: true }
// // // // //       });
      
// // // // //       setEmployees(response.data);
// // // // //       setFilteredEmployees(response.data);
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching employees:', error);
// // // // //       showNotification('Error loading employees', 'error');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };
  
// // // // //   useEffect(() => {
// // // // //     fetchEmployees();
// // // // //   }, []);
  
// // // // //   // Filter employees based on search
// // // // //   useEffect(() => {
// // // // //     if (!searchTerm.trim()) {
// // // // //       setFilteredEmployees(employees);
// // // // //     } else {
// // // // //       const filtered = employees.filter(emp =>
// // // // //         emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //         emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // // //         emp.department_name.toLowerCase().includes(searchTerm.toLowerCase())
// // // // //       );
// // // // //       setFilteredEmployees(filtered);
// // // // //     }
// // // // //   }, [searchTerm, employees]);
  
// // // // //   // Select/deselect all
// // // // //   const toggleSelectAll = (checked: boolean) => {
// // // // //     if (checked) {
// // // // //       setSelectedEmployees(filteredEmployees.map(emp => emp.id));
// // // // //     } else {
// // // // //       setSelectedEmployees([]);
// // // // //     }
// // // // //   };
  
// // // // //   // Toggle single employee
// // // // //   const toggleEmployee = (employeeId: number) => {
// // // // //     setSelectedEmployees(prev =>
// // // // //       prev.includes(employeeId)
// // // // //         ? prev.filter(id => id !== employeeId)
// // // // //         : [...prev, employeeId]
// // // // //     );
// // // // //   };
  
// // // // //   // Assign selected employees to group
// // // // //   const handleAssignEmployees = async () => {
// // // // //     if (selectedEmployees.length === 0) {
// // // // //       showNotification('Please select at least one employee', 'error');
// // // // //       return;
// // // // //     }
    
// // // // //     try {
// // // // //       setAssigning(true);
// // // // //       await axios.post(
// // // // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign`,
// // // // //         {
// // // // //           employee_ids: selectedEmployees,
// // // // //           effective_date: effectiveDate
// // // // //         },
// // // // //         {
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // // //           }
// // // // //         }
// // // // //       );
      
// // // // //       showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
// // // // //       onSuccess();
// // // // //     } catch (error: any) {
// // // // //       console.error('Error assigning employees:', error);
// // // // //       showNotification(error.response?.data?.error || 'Error assigning employees', 'error');
// // // // //     } finally {
// // // // //       setAssigning(false);
// // // // //     }
// // // // //   };
  
// // // // //   // Remove employee from group
// // // // //   const handleRemoveEmployee = async (employeeId: number) => {
// // // // //     try {
// // // // //       await axios.delete(
// // // // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}`,
// // // // //         {
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // // //           }
// // // // //         }
// // // // //       );
      
// // // // //       showNotification('Employee removed from group', 'success');
// // // // //       fetchEmployees(); // Refresh list
// // // // //     } catch (error: any) {
// // // // //       console.error('Error removing employee:', error);
// // // // //       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
// // // // //     }
// // // // //   };
  
// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="flex justify-center items-center h-64">
// // // // //         <span className="loading loading-spinner loading-lg"></span>
// // // // //       </div>
// // // // //     );
// // // // //   }
  
// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       {/* Search and Select All */}
// // // // //       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
// // // // //         <div className="flex items-center gap-2">
// // // // //           <div className="form-control">
// // // // //             <label className="label cursor-pointer gap-2">
// // // // //               <input
// // // // //                 type="checkbox"
// // // // //                 checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
// // // // //                 onChange={(e) => toggleSelectAll(e.target.checked)}
// // // // //                 className="checkbox checkbox-primary"
// // // // //                 disabled={filteredEmployees.length === 0}
// // // // //               />
// // // // //               <span className="label-text">Select All</span>
// // // // //             </label>
// // // // //           </div>
          
// // // // //           <div className="badge badge-primary">
// // // // //             {selectedEmployees.length} selected
// // // // //           </div>
// // // // //         </div>
        
// // // // //         <div className="join w-full sm:w-auto">
// // // // //           <input
// // // // //             type="text"
// // // // //             placeholder="Search employees..."
// // // // //             value={searchTerm}
// // // // //             onChange={(e) => setSearchTerm(e.target.value)}
// // // // //             className={`input input-bordered join-item w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // // //           />
// // // // //           <button className="btn join-item">
// // // // //             <FaSearch />
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
      
// // // // //       {/* Effective Date */}
// // // // //       <div>
// // // // //         <label className="label">
// // // // //           <span className="label-text">Effective Date</span>
// // // // //         </label>
// // // // //         <input
// // // // //           type="date"
// // // // //           value={effectiveDate}
// // // // //           onChange={(e) => setEffectiveDate(e.target.value)}
// // // // //           className="input input-bordered w-full"
// // // // //         />
// // // // //       </div>
      
// // // // //       {/* Employees Table */}
// // // // //       <div className="overflow-x-auto max-h-96">
// // // // //         <table className="table table-zebra">
// // // // //           <thead>
// // // // //             <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
// // // // //               <th></th>
// // // // //               <th>Employee</th>
// // // // //               <th>Employee Code</th>
// // // // //               <th>Department</th>
// // // // //               <th>Current Group</th>
// // // // //               <th>Action</th>
// // // // //             </tr>
// // // // //           </thead>
// // // // //           <tbody>
// // // // //             {filteredEmployees.map(employee => {
// // // // //               const isSelected = selectedEmployees.includes(employee.id);
// // // // //               const isInThisGroup = employee.current_group === groupId.toString();
              
// // // // //               return (
// // // // //                 <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
// // // // //                   <td>
// // // // //                     <input
// // // // //                       type="checkbox"
// // // // //                       checked={isSelected}
// // // // //                       onChange={() => toggleEmployee(employee.id)}
// // // // //                       className="checkbox checkbox-primary"
// // // // //                       disabled={isInThisGroup}
// // // // //                     />
// // // // //                   </td>
// // // // //                   <td>
// // // // //                     <div className="font-medium">{employee.name}</div>
// // // // //                     {isInThisGroup && (
// // // // //                       <div className="badge badge-success badge-xs mt-1">
// // // // //                         Already in group
// // // // //                       </div>
// // // // //                     )}
// // // // //                   </td>
// // // // //                   <td>{employee.employee_code}</td>
// // // // //                   <td>{employee.department_name}</td>
// // // // //                   <td>
// // // // //                     {employee.current_group ? (
// // // // //                       <span className="badge badge-outline">
// // // // //                         Group #{employee.current_group}
// // // // //                       </span>
// // // // //                     ) : (
// // // // //                       <span className="text-slate-500">No group</span>
// // // // //                     )}
// // // // //                   </td>
// // // // //                   <td>
// // // // //                     {isInThisGroup ? (
// // // // //                       <button
// // // // //                         onClick={() => handleRemoveEmployee(employee.id)}
// // // // //                         className="btn btn-xs btn-error flex items-center gap-1"
// // // // //                       >
// // // // //                         <FaTimes />
// // // // //                         Remove
// // // // //                       </button>
// // // // //                     ) : (
// // // // //                       <button
// // // // //                         onClick={() => toggleEmployee(employee.id)}
// // // // //                         className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
// // // // //                       >
// // // // //                         {isSelected ? (
// // // // //                           <>
// // // // //                             <FaTimes />
// // // // //                             Deselect
// // // // //                           </>
// // // // //                         ) : (
// // // // //                           <>
// // // // //                             <FaCheck />
// // // // //                             Select
// // // // //                           </>
// // // // //                         )}
// // // // //                       </button>
// // // // //                     )}
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               );
// // // // //             })}
            
// // // // //             {filteredEmployees.length === 0 && (
// // // // //               <tr>
// // // // //                 <td colSpan={6} className="text-center py-8">
// // // // //                   <div className="flex flex-col items-center justify-center gap-2">
// // // // //                     <FaSearch className="h-12 w-12 text-slate-400" />
// // // // //                     <p className={`text-lg ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // // // //                       No employees found
// // // // //                     </p>
// // // // //                     {searchTerm && (
// // // // //                       <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
// // // // //                         Try adjusting your search
// // // // //                       </p>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 </td>
// // // // //               </tr>
// // // // //             )}
// // // // //           </tbody>
// // // // //         </table>
// // // // //       </div>
      
// // // // //       {/* Actions */}
// // // // //       <div className="flex justify-between items-center pt-4 border-t">
// // // // //         <div className="text-sm">
// // // // //           <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // // // //             Selected: <strong>{selectedEmployees.length}</strong> employee(s)
// // // // //           </p>
// // // // //         </div>
        
// // // // //         <div className="flex gap-2">
// // // // //           <button onClick={onClose} className="btn btn-ghost">
// // // // //             Cancel
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={handleAssignEmployees}
// // // // //             disabled={selectedEmployees.length === 0 || assigning}
// // // // //             className="btn btn-primary"
// // // // //           >
// // // // //             {assigning ? (
// // // // //               <>
// // // // //                 <span className="loading loading-spinner loading-sm"></span>
// // // // //                 Assigning...
// // // // //               </>
// // // // //             ) : (
// // // // //               `Assign ${selectedEmployees.length} Employee(s)`
// // // // //             )}
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default EmployeeBulkAssignment;


// // // // // components/EmployeeBulkAssignment.tsx
// // // // 'use client';

// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import { API_BASE_URL } from '../config';
// // // // import { useTheme } from '../components/ThemeProvider';
// // // // import { useNotification } from '../hooks/useNotification';
// // // // import { FaSearch, FaCheck, FaTimes, FaUsers } from 'react-icons/fa';

// // // // interface Employee {
// // // //   id: number;
// // // //   name: string;
// // // //   employee_code: string;
// // // //   department_name: string;
// // // //   current_group_id?: number | null;
// // // // }

// // // // interface EmployeeBulkAssignmentProps {
// // // //   groupId: number;
// // // //   onClose: () => void;
// // // //   onSuccess: () => void;
// // // // }

// // // // const EmployeeBulkAssignment: React.FC<EmployeeBulkAssignmentProps> = ({
// // // //   groupId,
// // // //   onClose,
// // // //   onSuccess
// // // // }) => {
// // // //   const { theme } = useTheme();
// // // //   const { showNotification } = useNotification();
// // // //   const [employees, setEmployees] = useState<Employee[]>([]);
// // // //   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
// // // //   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
// // // //   const [searchTerm, setSearchTerm] = useState('');
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [assigning, setAssigning] = useState(false);
// // // //   const [effectiveDate, setEffectiveDate] = useState(
// // // //     new Date().toISOString().split('T')[0]
// // // //   );
  
// // // //   // Fetch employees
// // // //   const fetchEmployees = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups/employees/available`, {
// // // //         headers: {
// // // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // //         },
// // // //         params: { groupId }
// // // //       });
      
// // // //       setEmployees(response.data);
// // // //       setFilteredEmployees(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching employees:', error);
// // // //       showNotification('Error loading employees', 'error');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };
  
// // // //   useEffect(() => {
// // // //     fetchEmployees();
// // // //   }, [groupId]);
  
// // // //   // Filter employees based on search
// // // //   useEffect(() => {
// // // //     if (!searchTerm.trim()) {
// // // //       setFilteredEmployees(employees);
// // // //     } else {
// // // //       const filtered = employees.filter(emp =>
// // // //         emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //         emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //         emp.department_name.toLowerCase().includes(searchTerm.toLowerCase())
// // // //       );
// // // //       setFilteredEmployees(filtered);
// // // //     }
// // // //   }, [searchTerm, employees]);
  
// // // //   // Select/deselect all
// // // //   const toggleSelectAll = (checked: boolean) => {
// // // //     if (checked) {
// // // //       setSelectedEmployees(
// // // //         filteredEmployees
// // // //           .filter(emp => emp.current_group_id !== groupId)
// // // //           .map(emp => emp.id)
// // // //       );
// // // //     } else {
// // // //       setSelectedEmployees([]);
// // // //     }
// // // //   };
  
// // // //   // Toggle single employee
// // // //   const toggleEmployee = (employeeId: number) => {
// // // //     setSelectedEmployees(prev =>
// // // //       prev.includes(employeeId)
// // // //         ? prev.filter(id => id !== employeeId)
// // // //         : [...prev, employeeId]
// // // //     );
// // // //   };
  
// // // //   // Assign selected employees to group
// // // //   const handleAssignEmployees = async () => {
// // // //     if (selectedEmployees.length === 0) {
// // // //       showNotification('Please select at least one employee', 'error');
// // // //       return;
// // // //     }
    
// // // //     try {
// // // //       setAssigning(true);
// // // //       await axios.post(
// // // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign`,
// // // //         {
// // // //           employee_ids: selectedEmployees,
// // // //           effective_date: effectiveDate
// // // //         },
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // //           }
// // // //         }
// // // //       );
      
// // // //       showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
// // // //       onSuccess();
// // // //     } catch (error: any) {
// // // //       console.error('Error assigning employees:', error);
// // // //       showNotification(error.response?.data?.error || 'Error assigning employees', 'error');
// // // //     } finally {
// // // //       setAssigning(false);
// // // //     }
// // // //   };
  
// // // //   // Remove employee from group
// // // //   const handleRemoveEmployee = async (employeeId: number) => {
// // // //     try {
// // // //       // First get the assignment ID
// // // //       const assignmentResponse = await axios.get(
// // // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}`,
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // //           }
// // // //         }
// // // //       );
      
// // // //       const groupData = assignmentResponse.data;
// // // //       const employee = groupData.employees?.find((e: any) => e.id === employeeId);
      
// // // //       if (!employee) {
// // // //         showNotification('Employee not found in group', 'error');
// // // //         return;
// // // //       }
      
// // // //       // We need the assignment ID - for simplicity, we'll use a different endpoint
// // // //       await axios.delete(
// // // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}`,
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // //           }
// // // //         }
// // // //       );
      
// // // //       showNotification('Employee removed from group', 'success');
// // // //       fetchEmployees(); // Refresh list
// // // //     } catch (error: any) {
// // // //       console.error('Error removing employee:', error);
// // // //       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
// // // //     }
// // // //   };
  
// // // //   // Create a simple endpoint for removing employees
// // // //   const removeEmployeeFromGroup = async (employeeId: number) => {
// // // //     try {
// // // //       // End the assignment by setting end_date
// // // //       await axios.put(
// // // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
// // // //         { end_date: new Date().toISOString().split('T')[0] },
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // // //           }
// // // //         }
// // // //       );
      
// // // //       showNotification('Employee removed from group', 'success');
// // // //       fetchEmployees(); // Refresh list
// // // //     } catch (error: any) {
// // // //       console.error('Error removing employee:', error);
// // // //       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
// // // //     }
// // // //   };
  
// // // //   if (loading) {
// // // //     return (
// // // //       <div className="flex justify-center items-center h-64">
// // // //         <span className="loading loading-spinner loading-lg"></span>
// // // //       </div>
// // // //     );
// // // //   }
  
// // // //   return (
// // // //     <div className="space-y-6">
// // // //       {/* Search and Select All */}
// // // //       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
// // // //         <div className="flex items-center gap-3">
// // // //           <div className="form-control">
// // // //             <label className="label cursor-pointer gap-2">
// // // //               <input
// // // //                 type="checkbox"
// // // //                 checked={selectedEmployees.length === filteredEmployees.filter(e => e.current_group_id !== groupId).length && 
// // // //                         filteredEmployees.filter(e => e.current_group_id !== groupId).length > 0}
// // // //                 onChange={(e) => toggleSelectAll(e.target.checked)}
// // // //                 className="checkbox checkbox-primary"
// // // //                 disabled={filteredEmployees.filter(e => e.current_group_id !== groupId).length === 0}
// // // //               />
// // // //               <span className="label-text font-medium">Select All Available</span>
// // // //             </label>
// // // //           </div>
          
// // // //           <div className="badge badge-primary badge-lg">
// // // //             {selectedEmployees.length} selected
// // // //           </div>
// // // //         </div>
        
// // // //         <div className="join w-full sm:w-auto">
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search employees by name, code, or department..."
// // // //             value={searchTerm}
// // // //             onChange={(e) => setSearchTerm(e.target.value)}
// // // //             className={`input input-bordered join-item w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // // //           />
// // // //           <button className="btn join-item">
// // // //             <FaSearch />
// // // //           </button>
// // // //         </div>
// // // //       </div>
      
// // // //       {/* Effective Date */}
// // // //       <div className="bg-base-200 p-4 rounded-lg">
// // // //         <div className="flex items-center justify-between">
// // // //           <div>
// // // //             <label className="label">
// // // //               <span className="label-text font-semibold">Effective Date</span>
// // // //               <span className="label-text-alt">When should these assignments take effect?</span>
// // // //             </label>
// // // //           </div>
// // // //           <input
// // // //             type="date"
// // // //             value={effectiveDate}
// // // //             onChange={(e) => setEffectiveDate(e.target.value)}
// // // //             className="input input-bordered"
// // // //           />
// // // //         </div>
// // // //       </div>
      
// // // //       {/* Employees Table */}
// // // //       <div className="overflow-x-auto border rounded-lg">
// // // //         <table className="table">
// // // //           <thead>
// // // //             <tr className={`${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'}`}>
// // // //               <th className="w-12">
// // // //                 <input
// // // //                   type="checkbox"
// // // //                   checked={selectedEmployees.length === filteredEmployees.filter(e => e.current_group_id !== groupId).length && 
// // // //                           filteredEmployees.filter(e => e.current_group_id !== groupId).length > 0}
// // // //                   onChange={(e) => toggleSelectAll(e.target.checked)}
// // // //                   className="checkbox checkbox-primary checkbox-sm"
// // // //                   disabled={filteredEmployees.filter(e => e.current_group_id !== groupId).length === 0}
// // // //                 />
// // // //               </th>
// // // //               <th>Employee</th>
// // // //               <th>Employee Code</th>
// // // //               <th>Department</th>
// // // //               <th>Current Group</th>
// // // //               <th>Actions</th>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {filteredEmployees.map(employee => {
// // // //               const isSelected = selectedEmployees.includes(employee.id);
// // // //               const isInThisGroup = employee.current_group_id === groupId;
// // // //               const isInOtherGroup = employee.current_group_id && employee.current_group_id !== groupId;
              
// // // //               return (
// // // //                 <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
// // // //                   <td>
// // // //                     {!isInThisGroup && (
// // // //                       <input
// // // //                         type="checkbox"
// // // //                         checked={isSelected}
// // // //                         onChange={() => toggleEmployee(employee.id)}
// // // //                         className="checkbox checkbox-primary checkbox-sm"
// // // //                       />
// // // //                     )}
// // // //                   </td>
// // // //                   <td>
// // // //                     <div className="flex items-center gap-3">
// // // //                       <div className="avatar placeholder">
// // // //                         <div className="bg-neutral text-neutral-content rounded-full w-8">
// // // //                           <span className="text-xs">
// // // //                             {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
// // // //                           </span>
// // // //                         </div>
// // // //                       </div>
// // // //                       <div>
// // // //                         <div className="font-medium">{employee.name}</div>
// // // //                         {isInThisGroup && (
// // // //                           <div className="badge badge-success badge-xs mt-1">
// // // //                             Already in this group
// // // //                           </div>
// // // //                         )}
// // // //                         {isInOtherGroup && (
// // // //                           <div className="badge badge-warning badge-xs mt-1">
// // // //                             In another group
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                   </td>
// // // //                   <td className="font-mono">{employee.employee_code}</td>
// // // //                   <td>{employee.department_name || '-'}</td>
// // // //                   <td>
// // // //                     {isInThisGroup ? (
// // // //                       <span className="badge badge-success">This Group</span>
// // // //                     ) : isInOtherGroup ? (
// // // //                       <span className="badge badge-warning">Group #{employee.current_group_id}</span>
// // // //                     ) : (
// // // //                       <span className="text-slate-500">No group</span>
// // // //                     )}
// // // //                   </td>
// // // //                   <td>
// // // //                     {isInThisGroup ? (
// // // //                       <button
// // // //                         onClick={() => removeEmployeeFromGroup(employee.id)}
// // // //                         className="btn btn-xs btn-error flex items-center gap-1"
// // // //                       >
// // // //                         <FaTimes />
// // // //                         Remove
// // // //                       </button>
// // // //                     ) : (
// // // //                       <button
// // // //                         onClick={() => toggleEmployee(employee.id)}
// // // //                         className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
// // // //                       >
// // // //                         {isSelected ? (
// // // //                           <>
// // // //                             <FaTimes />
// // // //                             Deselect
// // // //                           </>
// // // //                         ) : (
// // // //                           <>
// // // //                             <FaCheck />
// // // //                             Select
// // // //                           </>
// // // //                         )}
// // // //                       </button>
// // // //                     )}
// // // //                   </td>
// // // //                 </tr>
// // // //               );
// // // //             })}
            
// // // //             {filteredEmployees.length === 0 && (
// // // //               <tr>
// // // //                 <td colSpan={6} className="text-center py-8">
// // // //                   <div className="flex flex-col items-center justify-center gap-3">
// // // //                     <FaUsers className="h-16 w-16 text-slate-400" />
// // // //                     <div className="space-y-2">
// // // //                       <p className={`text-lg font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // // //                         {searchTerm ? 'No employees found' : 'No employees available'}
// // // //                       </p>
// // // //                       {searchTerm ? (
// // // //                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
// // // //                           Try adjusting your search criteria
// // // //                         </p>
// // // //                       ) : (
// // // //                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
// // // //                           All employees might already be assigned to groups
// // // //                         </p>
// // // //                       )}
// // // //                     </div>
// // // //                   </div>
// // // //                 </td>
// // // //               </tr>
// // // //             )}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>
      
// // // //       {/* Summary and Actions */}
// // // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
// // // //         <div className="space-y-2">
// // // //           <div className="flex items-center gap-4">
// // // //             <div className="stat py-0 px-4">
// // // //               <div className="stat-title">Total Available</div>
// // // //               <div className="stat-value text-lg">{employees.length}</div>
// // // //             </div>
// // // //             <div className="stat py-0 px-4">
// // // //               <div className="stat-title">Filtered</div>
// // // //               <div className="stat-value text-lg">{filteredEmployees.length}</div>
// // // //             </div>
// // // //             <div className="stat py-0 px-4">
// // // //               <div className="stat-title">Selected</div>
// // // //               <div className="stat-value text-lg text-primary">{selectedEmployees.length}</div>
// // // //             </div>
// // // //           </div>
// // // //           {selectedEmployees.length > 0 && (
// // // //             <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // // //               Ready to assign <strong>{selectedEmployees.length}</strong> employee(s) to this group
// // // //             </p>
// // // //           )}
// // // //         </div>
        
// // // //         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
// // // //           <button 
// // // //             onClick={onClose} 
// // // //             className="btn btn-ghost flex-1 sm:flex-none"
// // // //           >
// // // //             Cancel
// // // //           </button>
// // // //           <button
// // // //             onClick={handleAssignEmployees}
// // // //             disabled={selectedEmployees.length === 0 || assigning}
// // // //             className="btn btn-primary flex-1 sm:flex-none"
// // // //           >
// // // //             {assigning ? (
// // // //               <>
// // // //                 <span className="loading loading-spinner loading-sm"></span>
// // // //                 Assigning...
// // // //               </>
// // // //             ) : (
// // // //               <>
// // // //                 <FaUsers className="mr-2" />
// // // //                 Assign {selectedEmployees.length} Employee(s)
// // // //               </>
// // // //             )}
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default EmployeeBulkAssignment;

// // // // components/EmployeeBulkAssignment.tsx
// // // 'use client';

// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import axios from 'axios';
// // // import { API_BASE_URL } from '../config';
// // // import { useTheme } from '../components/ThemeProvider';
// // // import { useNotification } from '../hooks/useNotification';
// // // import { FaSearch, FaCheck, FaTimes, FaUsers } from 'react-icons/fa';

// // // interface Employee {
// // //   id: number;
// // //   name: string;
// // //   employee_code: string;
// // //   department_name: string;
// // //   current_group_id?: number | null;
// // // }

// // // interface EmployeeBulkAssignmentProps {
// // //   groupId: number;
// // //   onClose: () => void;
// // //   onSuccess: () => void;
// // // }

// // // const EmployeeBulkAssignment: React.FC<EmployeeBulkAssignmentProps> = ({
// // //   groupId,
// // //   onClose,
// // //   onSuccess
// // // }) => {
// // //   const { theme } = useTheme();
// // //   const { showNotification } = useNotification();
// // //   const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
// // //   const [displayEmployees, setDisplayEmployees] = useState<Employee[]>([]);
// // //   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
// // //   const [searchText, setSearchText] = useState('');
// // //   const [loading, setLoading] = useState(true);
// // //   const [assigning, setAssigning] = useState(false);
// // //   const [effectiveDate, setEffectiveDate] = useState(
// // //     new Date().toISOString().split('T')[0]
// // //   );
  
// // //   // Fetch employees
// // //   const fetchEmployees = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups/employees/available`, {
// // //         headers: {
// // //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //         },
// // //         params: { groupId }
// // //       });
      
// // //       // Handle different response formats
// // //       let employeesData: Employee[] = [];
      
// // //       if (Array.isArray(response.data)) {
// // //         employeesData = response.data;
// // //       } else if (response.data && typeof response.data === 'object') {
// // //         if (Array.isArray(response.data.employees)) {
// // //           employeesData = response.data.employees;
// // //         } else if (Array.isArray(response.data.data)) {
// // //           employeesData = response.data.data;
// // //         }
// // //       }
      
// // //       setAllEmployees(employeesData);
// // //       setDisplayEmployees(employeesData); // Initially show all employees
// // //     } catch (error) {
// // //       console.error('Error fetching employees:', error);
// // //       showNotification('Error loading employees', 'error');
// // //       setAllEmployees([]);
// // //       setDisplayEmployees([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
  
// // //   useEffect(() => {
// // //     fetchEmployees();
// // //   }, [groupId]);
  
// // //   // SIMPLE SEARCH FUNCTION - NO COMPLEX FILTERING
// // //   const performSearch = useCallback(() => {
// // //     const searchTerm = searchText.toLowerCase().trim();
    
// // //     if (!searchTerm) {
// // //       setDisplayEmployees(allEmployees);
// // //       return;
// // //     }
    
// // //     // SIMPLE LOOP - NO .filter() CHAIN
// // //     const matchingEmployees: Employee[] = [];
    
// // //     for (let i = 0; i < allEmployees.length; i++) {
// // //       const emp = allEmployees[i];
// // //       const nameMatch = emp.name?.toLowerCase().includes(searchTerm) || false;
// // //       const codeMatch = emp.employee_code?.toLowerCase().includes(searchTerm) || false;
// // //       const deptMatch = emp.department_name?.toLowerCase().includes(searchTerm) || false;
      
// // //       if (nameMatch || codeMatch || deptMatch) {
// // //         matchingEmployees.push(emp);
// // //       }
// // //     }
    
// // //     setDisplayEmployees(matchingEmployees);
// // //   }, [searchText, allEmployees]);
  
// // //   // Use a simple timer for search instead of useEffect
// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       performSearch();
// // //     }, 300); // 300ms debounce
    
// // //     return () => clearTimeout(timer);
// // //   }, [performSearch]);
  
// // //   // Select/deselect all
// // //   const toggleSelectAll = (checked: boolean) => {
// // //     if (checked) {
// // //       const availableIds: number[] = [];
// // //       for (let i = 0; i < displayEmployees.length; i++) {
// // //         const emp = displayEmployees[i];
// // //         if (emp.current_group_id !== groupId) {
// // //           availableIds.push(emp.id);
// // //         }
// // //       }
// // //       setSelectedEmployees(availableIds);
// // //     } else {
// // //       setSelectedEmployees([]);
// // //     }
// // //   };
  
// // //   // Toggle single employee
// // //   const toggleEmployee = (employeeId: number) => {
// // //     const newSelected = [...selectedEmployees];
// // //     const index = newSelected.indexOf(employeeId);
    
// // //     if (index > -1) {
// // //       newSelected.splice(index, 1);
// // //     } else {
// // //       newSelected.push(employeeId);
// // //     }
    
// // //     setSelectedEmployees(newSelected);
// // //   };
  
// // //   // Calculate if all are selected
// // //   const getAllAvailableCount = () => {
// // //     let count = 0;
// // //     for (let i = 0; i < displayEmployees.length; i++) {
// // //       if (displayEmployees[i].current_group_id !== groupId) {
// // //         count++;
// // //       }
// // //     }
// // //     return count;
// // //   };
  
// // //   const getAllSelectedCount = () => {
// // //     let count = 0;
// // //     for (let i = 0; i < selectedEmployees.length; i++) {
// // //       const empId = selectedEmployees[i];
// // //       const emp = displayEmployees.find(e => e.id === empId);
// // //       if (emp && emp.current_group_id !== groupId) {
// // //         count++;
// // //       }
// // //     }
// // //     return count;
// // //   };
  
// // //   const isAllSelected = () => {
// // //     const availableCount = getAllAvailableCount();
// // //     if (availableCount === 0) return false;
// // //     return getAllSelectedCount() === availableCount;
// // //   };
  
// // //   // Assign selected employees to group
// // //   const handleAssignEmployees = async () => {
// // //     if (selectedEmployees.length === 0) {
// // //       showNotification('Please select at least one employee', 'error');
// // //       return;
// // //     }
    
// // //     try {
// // //       setAssigning(true);
// // //       await axios.post(
// // //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign-employees`,
// // //         {
// // //           employee_ids: selectedEmployees,
// // //           effective_date: effectiveDate
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //           }
// // //         }
// // //       );
      
// // //       showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
// // //       onSuccess();
// // //     } catch (error: any) {
// // //       console.error('Error assigning employees:', error);
// // //       showNotification(error.response?.data?.error || 'Error assigning employees', 'error');
// // //     } finally {
// // //       setAssigning(false);
// // //     }
// // //   };
  
// // //   // Remove employee from group
// // //   const removeEmployeeFromGroup = async (employeeId: number) => {
// // //     try {
// // //       // Try to remove using different endpoint patterns
// // //       try {
// // //         await axios.delete(
// // //           `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}`,
// // //           {
// // //             headers: {
// // //               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //             }
// // //           }
// // //         );
// // //       } catch (deleteError) {
// // //         // Try alternative endpoint
// // //         await axios.put(
// // //           `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
// // //           { end_date: new Date().toISOString().split('T')[0] },
// // //           {
// // //             headers: {
// // //               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// // //             }
// // //           }
// // //         );
// // //       }
      
// // //       showNotification('Employee removed from group', 'success');
// // //       fetchEmployees(); // Refresh list
// // //     } catch (error: any) {
// // //       console.error('Error removing employee:', error);
// // //       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
// // //     }
// // //   };
  
// // //   if (loading) {
// // //     return (
// // //       <div className="flex justify-center items-center h-64">
// // //         <span className="loading loading-spinner loading-lg"></span>
// // //       </div>
// // //     );
// // //   }
  
// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Search and Select All */}
// // //       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
// // //         <div className="flex items-center gap-3">
// // //           <div className="form-control">
// // //             <label className="label cursor-pointer gap-2">
// // //               <input
// // //                 type="checkbox"
// // //                 checked={isAllSelected()}
// // //                 onChange={(e) => toggleSelectAll(e.target.checked)}
// // //                 className="checkbox checkbox-primary"
// // //                 disabled={getAllAvailableCount() === 0}
// // //               />
// // //               <span className="label-text font-medium">Select All Available</span>
// // //             </label>
// // //           </div>
          
// // //           <div className="badge badge-primary badge-lg">
// // //             {selectedEmployees.length} selected
// // //           </div>
// // //         </div>
        
// // //         <div className="join w-full sm:w-auto">
// // //           <input
// // //             type="text"
// // //             placeholder="Search employees by name, code, or department..."
// // //             value={searchText}
// // //             onChange={(e) => setSearchText(e.target.value)}
// // //             className={`input input-bordered join-item w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// // //           />
// // //           <button className="btn join-item">
// // //             <FaSearch />
// // //           </button>
// // //         </div>
// // //       </div>
      
// // //       {/* Effective Date */}
// // //       <div className="bg-base-200 p-4 rounded-lg">
// // //         <div className="flex items-center justify-between">
// // //           <div>
// // //             <label className="label">
// // //               <span className="label-text font-semibold">Effective Date</span>
// // //               <span className="label-text-alt">When should these assignments take effect?</span>
// // //             </label>
// // //           </div>
// // //           <input
// // //             type="date"
// // //             value={effectiveDate}
// // //             onChange={(e) => setEffectiveDate(e.target.value)}
// // //             className="input input-bordered"
// // //           />
// // //         </div>
// // //       </div>
      
// // //       {/* Employees Table */}
// // //       <div className="overflow-x-auto border rounded-lg">
// // //         <table className="table">
// // //           <thead>
// // //             <tr className={`${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'}`}>
// // //               <th className="w-12">
// // //                 <input
// // //                   type="checkbox"
// // //                   checked={isAllSelected()}
// // //                   onChange={(e) => toggleSelectAll(e.target.checked)}
// // //                   className="checkbox checkbox-primary checkbox-sm"
// // //                   disabled={getAllAvailableCount() === 0}
// // //                 />
// // //               </th>
// // //               <th>Employee</th>
// // //               <th>Employee Code</th>
// // //               <th>Department</th>
// // //               <th>Current Group</th>
// // //               <th>Actions</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {displayEmployees.length === 0 ? (
// // //               <tr>
// // //                 <td colSpan={6} className="text-center py-8">
// // //                   <div className="flex flex-col items-center justify-center gap-3">
// // //                     <FaUsers className="h-16 w-16 text-slate-400" />
// // //                     <div className="space-y-2">
// // //                       <p className={`text-lg font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // //                         {searchText ? 'No employees found' : 'No employees available'}
// // //                       </p>
// // //                       {searchText ? (
// // //                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
// // //                           Try adjusting your search criteria
// // //                         </p>
// // //                       ) : (
// // //                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
// // //                           All employees might already be assigned to groups
// // //                         </p>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 </td>
// // //               </tr>
// // //             ) : (
// // //               displayEmployees.map(employee => {
// // //                 const isSelected = selectedEmployees.includes(employee.id);
// // //                 const isInThisGroup = employee.current_group_id === groupId;
// // //                 const isInOtherGroup = employee.current_group_id && employee.current_group_id !== groupId;
                
// // //                 return (
// // //                   <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
// // //                     <td>
// // //                       {!isInThisGroup && (
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={isSelected}
// // //                           onChange={() => toggleEmployee(employee.id)}
// // //                           className="checkbox checkbox-primary checkbox-sm"
// // //                         />
// // //                       )}
// // //                     </td>
// // //                     <td>
// // //                       <div className="flex items-center gap-3">
// // //                         <div className="avatar placeholder">
// // //                           <div className="bg-neutral text-neutral-content rounded-full w-8">
// // //                             <span className="text-xs">
// // //                               {employee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
// // //                             </span>
// // //                           </div>
// // //                         </div>
// // //                         <div>
// // //                           <div className="font-medium">{employee.name || 'Unknown'}</div>
// // //                           {isInThisGroup && (
// // //                             <div className="badge badge-success badge-xs mt-1">
// // //                               Already in this group
// // //                             </div>
// // //                           )}
// // //                           {isInOtherGroup && (
// // //                             <div className="badge badge-warning badge-xs mt-1">
// // //                               In another group
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                       </div>
// // //                     </td>
// // //                     <td className="font-mono">{employee.employee_code || 'N/A'}</td>
// // //                     <td>{employee.department_name || '-'}</td>
// // //                     <td>
// // //                       {isInThisGroup ? (
// // //                         <span className="badge badge-success">This Group</span>
// // //                       ) : isInOtherGroup ? (
// // //                         <span className="badge badge-warning">Group #{employee.current_group_id}</span>
// // //                       ) : (
// // //                         <span className="text-slate-500">No group</span>
// // //                       )}
// // //                     </td>
// // //                     <td>
// // //                       {isInThisGroup ? (
// // //                         <button
// // //                           onClick={() => removeEmployeeFromGroup(employee.id)}
// // //                           className="btn btn-xs btn-error flex items-center gap-1"
// // //                         >
// // //                           <FaTimes />
// // //                           Remove
// // //                         </button>
// // //                       ) : (
// // //                         <button
// // //                           onClick={() => toggleEmployee(employee.id)}
// // //                           className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
// // //                         >
// // //                           {isSelected ? (
// // //                             <>
// // //                               <FaTimes />
// // //                               Deselect
// // //                             </>
// // //                           ) : (
// // //                             <>
// // //                               <FaCheck />
// // //                               Select
// // //                             </>
// // //                           )}
// // //                         </button>
// // //                       )}
// // //                     </td>
// // //                   </tr>
// // //                 );
// // //               })
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>
      
// // //       {/* Summary and Actions */}
// // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
// // //         <div className="space-y-2">
// // //           <div className="flex items-center gap-4">
// // //             <div className="stat py-0 px-4">
// // //               <div className="stat-title">Total Available</div>
// // //               <div className="stat-value text-lg">{allEmployees.length}</div>
// // //             </div>
// // //             <div className="stat py-0 px-4">
// // //               <div className="stat-title">Showing</div>
// // //               <div className="stat-value text-lg">{displayEmployees.length}</div>
// // //             </div>
// // //             <div className="stat py-0 px-4">
// // //               <div className="stat-title">Selected</div>
// // //               <div className="stat-value text-lg text-primary">{selectedEmployees.length}</div>
// // //             </div>
// // //           </div>
// // //           {selectedEmployees.length > 0 && (
// // //             <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// // //               Ready to assign <strong>{selectedEmployees.length}</strong> employee(s) to this group
// // //             </p>
// // //           )}
// // //         </div>
        
// // //         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
// // //           <button 
// // //             onClick={onClose} 
// // //             className="btn btn-ghost flex-1 sm:flex-none"
// // //           >
// // //             Cancel
// // //           </button>
// // //           <button
// // //             onClick={handleAssignEmployees}
// // //             disabled={selectedEmployees.length === 0 || assigning}
// // //             className="btn btn-primary flex-1 sm:flex-none"
// // //           >
// // //             {assigning ? (
// // //               <>
// // //                 <span className="loading loading-spinner loading-sm"></span>
// // //                 Assigning...
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <FaUsers className="mr-2" />
// // //                 Assign {selectedEmployees.length} Employee(s)
// // //               </>
// // //             )}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeBulkAssignment;

// // // components/EmployeeBulkAssignment.tsx
// // 'use client';

// // import React, { useState, useEffect, useCallback } from 'react';
// // import axios from 'axios';
// // import { API_BASE_URL } from '../config';
// // import { useTheme } from '../components/ThemeProvider';
// // import { useNotification } from '../hooks/useNotification';
// // import { FaSearch, FaCheck, FaTimes, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// // interface Employee {
// //   id: number;
// //   name: string;
// //   employee_code: string;
// //   department_name: string;
// //   current_group_id?: number | null;
// // }

// // interface PaginationInfo {
// //   current_page: number;
// //   per_page: number;
// //   total: number;
// //   total_pages: number;
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
// //   const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
// //   const [displayEmployees, setDisplayEmployees] = useState<Employee[]>([]);
// //   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
// //   const [searchText, setSearchText] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [assigning, setAssigning] = useState(false);
// //   const [effectiveDate, setEffectiveDate] = useState(
// //     new Date().toISOString().split('T')[0]
// //   );
  
// //   // Pagination states
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(20);
// //   const [pagination, setPagination] = useState<PaginationInfo>({
// //     current_page: 1,
// //     per_page: 20,
// //     total: 0,
// //     total_pages: 1
// //   });
  
// //   // Fetch employees with pagination
// //   const fetchEmployees = async (page: number = 1, search: string = '') => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API_BASE_URL}/api/leave-entitlement-groups/employees/available`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //         },
// //         params: { 
// //           groupId,
// //           page,
// //           limit: itemsPerPage,
// //           search: search || undefined
// //         }
// //       });
      
// //       // Handle different response formats
// //       let employeesData: Employee[] = [];
// //       let paginationData: PaginationInfo = {
// //         current_page: page,
// //         per_page: itemsPerPage,
// //         total: 0,
// //         total_pages: 1
// //       };
      
// //       if (Array.isArray(response.data)) {
// //         employeesData = response.data;
// //         paginationData.total = response.data.length;
// //         paginationData.total_pages = Math.ceil(response.data.length / itemsPerPage);
// //       } else if (response.data && typeof response.data === 'object') {
// //         if (Array.isArray(response.data.employees)) {
// //           employeesData = response.data.employees;
          
// //           if (response.data.pagination) {
// //             paginationData = {
// //               current_page: response.data.pagination.current_page || page,
// //               per_page: response.data.pagination.per_page || itemsPerPage,
// //               total: response.data.pagination.total || response.data.employees.length,
// //               total_pages: response.data.pagination.total_pages || Math.ceil(response.data.employees.length / itemsPerPage)
// //             };
// //           } else {
// //             paginationData.total = response.data.employees.length;
// //             paginationData.total_pages = Math.ceil(response.data.employees.length / itemsPerPage);
// //           }
// //         } else if (Array.isArray(response.data.data)) {
// //           employeesData = response.data.data;
// //           paginationData.total = response.data.data.length;
// //           paginationData.total_pages = Math.ceil(response.data.data.length / itemsPerPage);
// //         }
// //       }
      
// //       // If backend doesn't support search, we need to filter locally
// //       if (search && employeesData.length > 0) {
// //         const searchTerm = search.toLowerCase().trim();
// //         const filteredEmployees: Employee[] = [];
        
// //         for (let i = 0; i < employeesData.length; i++) {
// //           const emp = employeesData[i];
// //           const nameMatch = emp.name?.toLowerCase().includes(searchTerm) || false;
// //           const codeMatch = emp.employee_code?.toLowerCase().includes(searchTerm) || false;
// //           const deptMatch = emp.department_name?.toLowerCase().includes(searchTerm) || false;
          
// //           if (nameMatch || codeMatch || deptMatch) {
// //             filteredEmployees.push(emp);
// //           }
// //         }
        
// //         setDisplayEmployees(filteredEmployees);
// //         paginationData.total = filteredEmployees.length;
// //         paginationData.total_pages = Math.ceil(filteredEmployees.length / itemsPerPage);
// //       } else {
// //         setDisplayEmployees(employeesData);
// //       }
      
// //       setAllEmployees(employeesData);
// //       setPagination(paginationData);
// //       setCurrentPage(paginationData.current_page);
// //     } catch (error) {
// //       console.error('Error fetching employees:', error);
// //       showNotification('Error loading employees', 'error');
// //       setAllEmployees([]);
// //       setDisplayEmployees([]);
// //       setPagination({
// //         current_page: 1,
// //         per_page: itemsPerPage,
// //         total: 0,
// //         total_pages: 1
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   // Initial fetch
// //   useEffect(() => {
// //     fetchEmployees(1, '');
// //   }, [groupId]);
  
// //   // Handle search with debouncing
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setCurrentPage(1); // Reset to first page when searching
// //       fetchEmployees(1, searchText);
// //     }, 300);
    
// //     return () => clearTimeout(timer);
// //   }, [searchText]);
  
// //   // Handle page change
// //   const handlePageChange = (page: number) => {
// //     if (page >= 1 && page <= pagination.total_pages) {
// //       setCurrentPage(page);
// //       fetchEmployees(page, searchText);
// //     }
// //   };
  
// //   // Select/deselect all on current page
// //   const toggleSelectAll = (checked: boolean) => {
// //     if (checked) {
// //       const availableIds: number[] = [];
// //       for (let i = 0; i < displayEmployees.length; i++) {
// //         const emp = displayEmployees[i];
// //         if (emp.current_group_id !== groupId) {
// //           availableIds.push(emp.id);
// //         }
// //       }
      
// //       // Add to selectedEmployees, avoiding duplicates
// //       setSelectedEmployees(prev => {
// //         const newSelected = [...prev];
// //         for (let i = 0; i < availableIds.length; i++) {
// //           if (!newSelected.includes(availableIds[i])) {
// //             newSelected.push(availableIds[i]);
// //           }
// //         }
// //         return newSelected;
// //       });
// //     } else {
// //       // Remove only employees on current page
// //       const currentPageIds = displayEmployees.map(emp => emp.id);
// //       setSelectedEmployees(prev => prev.filter(id => !currentPageIds.includes(id)));
// //     }
// //   };
  
// //   // Toggle single employee
// //   const toggleEmployee = (employeeId: number) => {
// //     const newSelected = [...selectedEmployees];
// //     const index = newSelected.indexOf(employeeId);
    
// //     if (index > -1) {
// //       newSelected.splice(index, 1);
// //     } else {
// //       newSelected.push(employeeId);
// //     }
    
// //     setSelectedEmployees(newSelected);
// //   };
  
// //   // Calculate if all on current page are selected
// //   const isAllSelectedOnPage = () => {
// //     const availableOnPage = displayEmployees.filter(emp => emp.current_group_id !== groupId);
// //     if (availableOnPage.length === 0) return false;
    
// //     return availableOnPage.every(emp => selectedEmployees.includes(emp.id));
// //   };
  
// //   // Get counts
// //   const getSelectedCountOnPage = () => {
// //     return displayEmployees.filter(emp => selectedEmployees.includes(emp.id)).length;
// //   };
  
// //   const getAvailableCountOnPage = () => {
// //     return displayEmployees.filter(emp => emp.current_group_id !== groupId).length;
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
// //         `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign-employees`,
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
// //       // Try to remove using different endpoint patterns
// //       try {
// //         await axios.delete(
// //           `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //             }
// //           }
// //         );
// //       } catch (deleteError) {
// //         // Try alternative endpoint
// //         await axios.put(
// //           `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
// //           { end_date: new Date().toISOString().split('T')[0] },
// //           {
// //             headers: {
// //               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
// //             }
// //           }
// //         );
// //       }
      
// //       showNotification('Employee removed from group', 'success');
// //       fetchEmployees(currentPage, searchText); // Refresh current page
// //     } catch (error: any) {
// //       console.error('Error removing employee:', error);
// //       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
// //     }
// //   };
  
// //   // Generate page numbers for pagination
// //   const getPageNumbers = () => {
// //     const pages = [];
// //     const maxVisiblePages = 5;
    
// //     if (pagination.total_pages <= maxVisiblePages) {
// //       for (let i = 1; i <= pagination.total_pages; i++) {
// //         pages.push(i);
// //       }
// //     } else {
// //       let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
// //       let endPage = Math.min(pagination.total_pages, startPage + maxVisiblePages - 1);
      
// //       if (endPage - startPage + 1 < maxVisiblePages) {
// //         startPage = Math.max(1, endPage - maxVisiblePages + 1);
// //       }
      
// //       for (let i = startPage; i <= endPage; i++) {
// //         pages.push(i);
// //       }
// //     }
    
// //     return pages;
// //   };
  
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <span className="loading loading-spinner loading-lg"></span>
// //       </div>
// //     );
// //   }
  
// //   return (
// //     <div className="space-y-6">
// //       {/* Search and Select All */}
// //       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
// //         <div className="flex items-center gap-3">
// //           <div className="form-control">
// //             <label className="label cursor-pointer gap-2">
// //               <input
// //                 type="checkbox"
// //                 checked={isAllSelectedOnPage()}
// //                 onChange={(e) => toggleSelectAll(e.target.checked)}
// //                 className="checkbox checkbox-primary"
// //                 disabled={getAvailableCountOnPage() === 0}
// //               />
// //               <span className="label-text font-medium">Select All on Page</span>
// //             </label>
// //           </div>
          
// //           <div className="badge badge-primary badge-lg">
// //             {selectedEmployees.length} total selected
// //           </div>
// //         </div>
        
// //         <div className="join w-full sm:w-auto">
// //           <input
// //             type="text"
// //             placeholder="Search employees by name, code, or department..."
// //             value={searchText}
// //             onChange={(e) => setSearchText(e.target.value)}
// //             className={`input input-bordered join-item w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
// //           />
// //           <button className="btn join-item">
// //             <FaSearch />
// //           </button>
// //         </div>
// //       </div>
      
// //       {/* Effective Date */}
// //       <div className="bg-base-200 p-4 rounded-lg">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <label className="label">
// //               <span className="label-text font-semibold">Effective Date</span>
// //               <span className="label-text-alt">When should these assignments take effect?</span>
// //             </label>
// //           </div>
// //           <input
// //             type="date"
// //             value={effectiveDate}
// //             onChange={(e) => setEffectiveDate(e.target.value)}
// //             className="input input-bordered"
// //           />
// //         </div>
// //       </div>
      
// //       {/* Employees Table */}
// //       <div className="overflow-x-auto border rounded-lg">
// //         <table className="table">
// //           <thead>
// //             <tr className={`${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'}`}>
// //               <th className="w-12">
// //                 <input
// //                   type="checkbox"
// //                   checked={isAllSelectedOnPage()}
// //                   onChange={(e) => toggleSelectAll(e.target.checked)}
// //                   className="checkbox checkbox-primary checkbox-sm"
// //                   disabled={getAvailableCountOnPage() === 0}
// //                 />
// //               </th>
// //               <th>Employee</th>
// //               <th>Employee Code</th>
// //               <th>Department</th>
// //               <th>Current Group</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {displayEmployees.length === 0 ? (
// //               <tr>
// //                 <td colSpan={6} className="text-center py-8">
// //                   <div className="flex flex-col items-center justify-center gap-3">
// //                     <FaUsers className="h-16 w-16 text-slate-400" />
// //                     <div className="space-y-2">
// //                       <p className={`text-lg font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //                         {searchText ? 'No employees found' : 'No employees available'}
// //                       </p>
// //                       {searchText ? (
// //                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
// //                           Try adjusting your search criteria
// //                         </p>
// //                       ) : (
// //                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
// //                           All employees might already be assigned to groups
// //                         </p>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ) : (
// //               displayEmployees.map(employee => {
// //                 const isSelected = selectedEmployees.includes(employee.id);
// //                 const isInThisGroup = employee.current_group_id === groupId;
// //                 const isInOtherGroup = employee.current_group_id && employee.current_group_id !== groupId;
                
// //                 return (
// //                   <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
// //                     <td>
// //                       {!isInThisGroup && (
// //                         <input
// //                           type="checkbox"
// //                           checked={isSelected}
// //                           onChange={() => toggleEmployee(employee.id)}
// //                           className="checkbox checkbox-primary checkbox-sm"
// //                         />
// //                       )}
// //                     </td>
// //                     <td>
// //                       <div className="flex items-center gap-3">
// //                         <div className="avatar placeholder">
// //                           <div className="bg-neutral text-neutral-content rounded-full w-8">
// //                             <span className="text-xs">
// //                               {employee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
// //                             </span>
// //                           </div>
// //                         </div>
// //                         <div>
// //                           <div className="font-medium">{employee.name || 'Unknown'}</div>
// //                           {isInThisGroup && (
// //                             <div className="badge badge-success badge-xs mt-1">
// //                               Already in this group
// //                             </div>
// //                           )}
// //                           {isInOtherGroup && (
// //                             <div className="badge badge-warning badge-xs mt-1">
// //                               In another group
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td className="font-mono">{employee.employee_code || 'N/A'}</td>
// //                     <td>{employee.department_name || '-'}</td>
// //                     <td>
// //                       {isInThisGroup ? (
// //                         <span className="badge badge-success">This Group</span>
// //                       ) : isInOtherGroup ? (
// //                         <span className="badge badge-warning">Group #{employee.current_group_id}</span>
// //                       ) : (
// //                         <span className="text-slate-500">No group</span>
// //                       )}
// //                     </td>
// //                     <td>
// //                       {isInThisGroup ? (
// //                         <button
// //                           onClick={() => removeEmployeeFromGroup(employee.id)}
// //                           className="btn btn-xs btn-error flex items-center gap-1"
// //                         >
// //                           <FaTimes />
// //                           Remove
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={() => toggleEmployee(employee.id)}
// //                           className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
// //                         >
// //                           {isSelected ? (
// //                             <>
// //                               <FaTimes />
// //                               Deselect
// //                             </>
// //                           ) : (
// //                             <>
// //                               <FaCheck />
// //                               Select
// //                             </>
// //                           )}
// //                         </button>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 );
// //               })
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
      
// //       {/* Pagination Controls */}
// //       {pagination.total_pages > 1 && (
// //         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t">
// //           <div className="text-sm text-slate-500">
// //             Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} employees
// //           </div>
          
// //           <div className="join">
// //             {/* First page button */}
// //             <button
// //               onClick={() => handlePageChange(1)}
// //               disabled={currentPage === 1}
// //               className="join-item btn btn-sm"
// //             >
// //               «
// //             </button>
            
// //             {/* Previous page button */}
// //             <button
// //               onClick={() => handlePageChange(currentPage - 1)}
// //               disabled={currentPage === 1}
// //               className="join-item btn btn-sm"
// //             >
// //               <FaChevronLeft />
// //             </button>
            
// //             {/* Page numbers */}
// //             {getPageNumbers().map(page => (
// //               <button
// //                 key={page}
// //                 onClick={() => handlePageChange(page)}
// //                 className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
// //               >
// //                 {page}
// //               </button>
// //             ))}
            
// //             {/* Next page button */}
// //             <button
// //               onClick={() => handlePageChange(currentPage + 1)}
// //               disabled={currentPage === pagination.total_pages}
// //               className="join-item btn btn-sm"
// //             >
// //               <FaChevronRight />
// //             </button>
            
// //             {/* Last page button */}
// //             <button
// //               onClick={() => handlePageChange(pagination.total_pages)}
// //               disabled={currentPage === pagination.total_pages}
// //               className="join-item btn btn-sm"
// //             >
// //               »
// //             </button>
// //           </div>
          
// //           {/* Items per page selector */}
// //           <div className="flex items-center gap-2">
// //             <span className="text-sm text-slate-500">Show:</span>
// //             <select
// //               value={itemsPerPage}
// //               onChange={(e) => {
// //                 setItemsPerPage(Number(e.target.value));
// //                 setCurrentPage(1);
// //                 fetchEmployees(1, searchText);
// //               }}
// //               className="select select-bordered select-sm"
// //             >
// //               <option value={10}>10</option>
// //               <option value={20}>20</option>
// //               <option value={50}>50</option>
// //               <option value={100}>100</option>
// //             </select>
// //           </div>
// //         </div>
// //       )}
      
// //       {/* Summary and Actions */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
// //         <div className="space-y-2">
// //           <div className="flex items-center gap-4">
// //             <div className="stat py-0 px-4">
// //               <div className="stat-title">Total Employees</div>
// //               <div className="stat-value text-lg">{pagination.total}</div>
// //             </div>
// //             <div className="stat py-0 px-4">
// //               <div className="stat-title">Showing</div>
// //               <div className="stat-value text-lg">{displayEmployees.length}</div>
// //             </div>
// //             <div className="stat py-0 px-4">
// //               <div className="stat-title">Selected</div>
// //               <div className="stat-value text-lg text-primary">{selectedEmployees.length}</div>
// //             </div>
// //           </div>
// //           {selectedEmployees.length > 0 && (
// //             <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
// //               Ready to assign <strong>{selectedEmployees.length}</strong> employee(s) to this group
// //             </p>
// //           )}
// //         </div>
        
// //         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
// //           <button 
// //             onClick={onClose} 
// //             className="btn btn-ghost flex-1 sm:flex-none"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleAssignEmployees}
// //             disabled={selectedEmployees.length === 0 || assigning}
// //             className="btn btn-primary flex-1 sm:flex-none"
// //           >
// //             {assigning ? (
// //               <>
// //                 <span className="loading loading-spinner loading-sm"></span>
// //                 Assigning...
// //               </>
// //             ) : (
// //               <>
// //                 <FaUsers className="mr-2" />
// //                 Assign {selectedEmployees.length} Employee(s)
// //               </>
// //             )}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeeBulkAssignment;

// // components/EmployeeBulkAssignment.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { useTheme } from '../components/ThemeProvider';
// import { useNotification } from '../hooks/useNotification';
// import { FaSearch, FaCheck, FaTimes, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// interface Employee {
//   id: number;
//   name: string;
//   employee_code: string;
//   employee_no?: string;
//   department_name: string | null;
//   department?: string | null;
//   company_name?: string | null;
//   position?: string | null;
//   status?: string | null;
//   joined_date: string | null;
//   current_group_id: number | null;
//   assignment_id: number | null;
//   effective_date: string | null;
//   end_date: string | null;
//   is_assigned: number;
// }

// interface PaginationInfo {
//   current_page: number;
//   per_page: number;
//   total: number;
//   total_pages: number;
// }

// interface ApiResponse {
//   employees: Employee[];
//   pagination: PaginationInfo;
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
//   const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
//   const [searchText, setSearchText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [assigning, setAssigning] = useState(false);
//   const [effectiveDate, setEffectiveDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20);
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     current_page: 1,
//     per_page: 20,
//     total: 0,
//     total_pages: 1
//   });
  
//   // Fetch employees with pagination
//   const fetchEmployees = async (page: number = 1, search: string = '') => {
//     try {
//       setLoading(true);
//       const response = await axios.get<ApiResponse>(
//         `${API_BASE_URL}/api/leave-entitlement-groups/employees/available`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//           },
//           params: { 
//             groupId,
//             page,
//             limit: itemsPerPage,
//             search: search || undefined
//           }
//         }
//       );
      
//       const { employees: employeesData, pagination: paginationData } = response.data;
      
//       setEmployees(employeesData);
//       setPagination(paginationData);
//       setCurrentPage(paginationData.current_page);
      
//       // Also fetch already assigned employees for this group to pre-select them
//       if (page === 1) {
//         await fetchAssignedEmployees(employeesData);
//       }
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       showNotification('Error loading employees', 'error');
//       setEmployees([]);
//       setPagination({
//         current_page: 1,
//         per_page: itemsPerPage,
//         total: 0,
//         total_pages: 1
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Fetch assigned employees to pre-select them
//   const fetchAssignedEmployees = async (currentEmployees: Employee[]) => {
//     try {
//       // Use the is_assigned field from the API response
//       const assignedIds = currentEmployees
//         .filter(emp => emp.is_assigned === 1)
//         .map(emp => emp.id);
      
//       setSelectedEmployees(assignedIds);
//     } catch (error) {
//       console.log('Error fetching assigned employees:', error);
//     }
//   };
  
//   // Initial fetch
//   useEffect(() => {
//     fetchEmployees(1, '');
//   }, [groupId]);
  
//   // Handle search button click
//   const handleSearch = () => {
//     setCurrentPage(1); // Reset to first page when searching
//     fetchEmployees(1, searchText);
//   };
  
//   // Clear search
//   const handleClearSearch = () => {
//     setSearchText('');
//     setCurrentPage(1);
//     fetchEmployees(1, '');
//   };
  
//   // Handle page change
//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= pagination.total_pages) {
//       setCurrentPage(page);
//       fetchEmployees(page, searchText);
//     }
//   };
  
//   // Select/deselect all on current page
//   const toggleSelectAll = (checked: boolean) => {
//     if (checked) {
//       const availableIds: number[] = [];
//       for (let i = 0; i < employees.length; i++) {
//         const emp = employees[i];
//         if (emp.is_assigned === 0) { // Only select employees not already assigned
//           availableIds.push(emp.id);
//         }
//       }
      
//       // Add to selectedEmployees, avoiding duplicates
//       setSelectedEmployees(prev => {
//         const newSelected = [...prev];
//         for (let i = 0; i < availableIds.length; i++) {
//           if (!newSelected.includes(availableIds[i])) {
//             newSelected.push(availableIds[i]);
//           }
//         }
//         return newSelected;
//       });
//     } else {
//       // Remove only employees on current page
//       const currentPageIds = employees.map(emp => emp.id);
//       setSelectedEmployees(prev => prev.filter(id => !currentPageIds.includes(id)));
//     }
//   };
  
//   // Toggle single employee
//   const toggleEmployee = (employeeId: number) => {
//     const newSelected = [...selectedEmployees];
//     const index = newSelected.indexOf(employeeId);
    
//     if (index > -1) {
//       newSelected.splice(index, 1);
//     } else {
//       newSelected.push(employeeId);
//     }
    
//     setSelectedEmployees(newSelected);
//   };
  
//   // Calculate if all available employees on current page are selected
//   const isAllSelectedOnPage = () => {
//     const availableOnPage = employees.filter(emp => emp.is_assigned === 0);
//     if (availableOnPage.length === 0) return false;
    
//     return availableOnPage.every(emp => selectedEmployees.includes(emp.id));
//   };
  
//   // Get counts for current page
//   const getSelectedCountOnPage = () => {
//     return employees.filter(emp => selectedEmployees.includes(emp.id)).length;
//   };
  
//   const getAvailableCountOnPage = () => {
//     return employees.filter(emp => emp.is_assigned === 0).length;
//   };
  
//   // Format date for display
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (e) {
//       return 'Invalid Date';
//     }
//   };
  
//   // Get status badge color
//   const getStatusBadge = (status: string | null | undefined) => {
//     if (!status) return 'badge-ghost';
    
//     const statusLower = status.toLowerCase();
//     if (statusLower.includes('active')) return 'badge-success';
//     if (statusLower.includes('inactive')) return 'badge-error';
//     if (statusLower.includes('pending')) return 'badge-warning';
//     if (statusLower.includes('terminated')) return 'badge-error';
//     if (statusLower.includes('resigned')) return 'badge-error';
//     return 'badge-ghost';
//   };
  
//   // Get assignment status badge
//   const getAssignmentBadge = (isAssigned: number) => {
//     return isAssigned === 1 ? 'badge-success' : 'badge-ghost';
//   };
  
//   // Assign selected employees to group
//   const handleAssignEmployees = async () => {
//     if (selectedEmployees.length === 0) {
//       showNotification('Please select at least one employee', 'error');
//       return;
//     }
    
//     try {
//       setAssigning(true);
      
//       // Try different endpoint patterns
//       let endpoint = `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign-employees`;
      
//       try {
//         const response = await axios.post(
//           endpoint,
//           {
//             employee_ids: selectedEmployees,
//             effective_date: effectiveDate
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//             }
//           }
//         );
        
//         showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
//         onSuccess();
//       } catch (firstError: any) {
//         console.log('First endpoint failed, trying alternative...', firstError);
        
//         // Try alternative endpoint
//         endpoint = `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign`;
        
//         const response = await axios.post(
//           endpoint,
//           {
//             employee_ids: selectedEmployees,
//             effective_date: effectiveDate
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//             }
//           }
//         );
        
//         showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
//         onSuccess();
//       }
//     } catch (error: any) {
//       console.error('Error assigning employees:', error);
      
//       // Try one more endpoint pattern
//       try {
//         const finalEndpoint = `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/assign`;
//         await axios.post(
//           finalEndpoint,
//           {
//             employee_ids: selectedEmployees,
//             effective_date: effectiveDate
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//             }
//           }
//         );
        
//         showNotification(`${selectedEmployees.length} employee(s) assigned successfully`, 'success');
//         onSuccess();
//       } catch (finalError: any) {
//         console.error('All endpoints failed:', finalError);
//         showNotification(
//           finalError.response?.data?.error || 'Error assigning employees. Please check API endpoints.',
//           'error'
//         );
//       }
//     } finally {
//       setAssigning(false);
//     }
//   };
  
//   // Remove employee from group
//   const removeEmployeeFromGroup = async (employeeId: number) => {
//     try {
//       // Try different endpoint patterns for removing
//       try {
//         // First try: delete endpoint
//         await axios.delete(
//           `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//             }
//           }
//         );
//       } catch (deleteError) {
//         console.log('Delete endpoint failed, trying put endpoint...');
        
//         // Second try: put endpoint to end assignment
//         await axios.put(
//           `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
//           { end_date: new Date().toISOString().split('T')[0] },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
//             }
//           }
//         );
//       }
      
//       showNotification('Employee removed from group', 'success');
      
//       // Refresh the current page
//       fetchEmployees(currentPage, searchText);
      
//       // Also remove from selected employees if present
//       setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
//     } catch (error: any) {
//       console.error('Error removing employee:', error);
//       showNotification(error.response?.data?.error || 'Error removing employee', 'error');
//     }
//   };
  
//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (pagination.total_pages <= maxVisiblePages) {
//       for (let i = 1; i <= pagination.total_pages; i++) {
//         pages.push(i);
//       }
//     } else {
//       let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//       let endPage = Math.min(pagination.total_pages, startPage + maxVisiblePages - 1);
      
//       if (endPage - startPage + 1 < maxVisiblePages) {
//         startPage = Math.max(1, endPage - maxVisiblePages + 1);
//       }
      
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }
//     }
    
//     return pages;
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }
  
//   return (
//     <div className="space-y-6">
//       {/* Search and Select All */}
//       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
//         <div className="flex items-center gap-3">
//           <div className="form-control">
//             <label className="label cursor-pointer gap-2">
//               <input
//                 type="checkbox"
//                 checked={isAllSelectedOnPage()}
//                 onChange={(e) => toggleSelectAll(e.target.checked)}
//                 className="checkbox checkbox-primary"
//                 disabled={getAvailableCountOnPage() === 0}
//               />
//               <span className="label-text font-medium">Select All on Page</span>
//             </label>
//           </div>
          
//           <div className="badge badge-primary badge-lg">
//             {selectedEmployees.length} total selected
//           </div>
//         </div>
        
//         <div className="join w-full sm:w-auto">
//           <input
//             type="text"
//             placeholder="Search employees by name, code, department, company, or position..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             className={`input input-bordered join-item w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//           />
//           <button 
//             onClick={handleSearch}
//             className="btn join-item btn-primary"
//           >
//             <FaSearch />
//             Search
//           </button>
//           {searchText && (
//             <button 
//               onClick={handleClearSearch}
//               className="btn join-item btn-error"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>
      
//       {/* Effective Date */}
//       <div className="bg-base-200 p-4 rounded-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <label className="label">
//               <span className="label-text font-semibold">Effective Date</span>
//               <span className="label-text-alt">When should these assignments take effect?</span>
//             </label>
//           </div>
//           <input
//             type="date"
//             value={effectiveDate}
//             onChange={(e) => setEffectiveDate(e.target.value)}
//             className="input input-bordered"
//           />
//         </div>
//       </div>
      
//       {/* Employees Table */}
//       <div className="overflow-x-auto border rounded-lg">
//         <table className="table">
//           <thead>
//             <tr className={`${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'}`}>
//               <th className="w-12">
//                 <input
//                   type="checkbox"
//                   checked={isAllSelectedOnPage()}
//                   onChange={(e) => toggleSelectAll(e.target.checked)}
//                   className="checkbox checkbox-primary checkbox-sm"
//                   disabled={getAvailableCountOnPage() === 0}
//                 />
//               </th>
//               <th>Employee</th>
//               {/* <th>Employee Code</th> */}
//               <th>Company</th>
//               <th>Department</th>
//               <th>Position</th>
//               {/* <th>Status</th> */}
//               <th>Assignment</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.length === 0 ? (
//               <tr>
//                 <td colSpan={9} className="text-center py-8">
//                   <div className="flex flex-col items-center justify-center gap-3">
//                     <FaUsers className="h-16 w-16 text-slate-400" />
//                     <div className="space-y-2">
//                       <p className={`text-lg font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//                         {searchText ? 'No employees found' : 'No employees available'}
//                       </p>
//                       {searchText ? (
//                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
//                           Try adjusting your search criteria
//                         </p>
//                       ) : (
//                         <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
//                           All employees might already be assigned to groups
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               employees.map(employee => {
//                 const isSelected = selectedEmployees.includes(employee.id);
//                 const isAssigned = employee.is_assigned === 1;
                
//                 return (
//                   <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
//                     <td>
//                       {!isAssigned && (
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onChange={() => toggleEmployee(employee.id)}
//                           className="checkbox checkbox-primary checkbox-sm"
//                         />
//                       )}
//                     </td>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div className="avatar placeholder">
//                           <div className="bg-neutral text-neutral-content rounded-full w-8">
//                             <span className="text-xs">
//                               {employee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
//                             </span>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="font-medium">{employee.name || 'Unknown'}</div>
//                           <div className="text-xs text-slate-500">
//                             Joined: {formatDate(employee.joined_date)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     {/* <td className="font-mono">{employee.employee_code || 'N/A'}</td> */}
//                     <td>
//                       <span className="text-sm">
//                         {employee.company_name || '-'}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="badge badge-outline">
//                         {employee.department_name || employee.department || 'Not specified'}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="text-sm">
//                         {employee.position || '-'}
//                       </span>
//                     </td>
//                     {/* <td>
//                       <span className={`badge ${getStatusBadge(employee.status)}`}>
//                         {employee.status || 'Unknown'}
//                       </span>
//                     </td> */}
//                     <td>
//                       <span className={`badge ${getAssignmentBadge(employee.is_assigned)}`}>
//                         {isAssigned ? 'Assigned' : 'Available'}
//                       </span>
//                     </td>
//                     <td>
//                       {isAssigned ? (
//                         <button
//                           onClick={() => removeEmployeeFromGroup(employee.id)}
//                           className="btn btn-xs btn-error flex items-center gap-1"
//                         >
//                           <FaTimes />
//                           Remove
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => toggleEmployee(employee.id)}
//                           className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
//                         >
//                           {isSelected ? (
//                             <>
//                               <FaTimes />
//                               Deselect
//                             </>
//                           ) : (
//                             <>
//                               <FaCheck />
//                               Select
//                             </>
//                           )}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination Controls */}
//       {pagination.total_pages > 1 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t">
//           <div className="text-sm text-slate-500">
//             Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} employees
//           </div>
          
//           <div className="join">
//             {/* First page button */}
//             <button
//               onClick={() => handlePageChange(1)}
//               disabled={currentPage === 1}
//               className="join-item btn btn-sm"
//             >
//               «
//             </button>
            
//             {/* Previous page button */}
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="join-item btn btn-sm"
//             >
//               <FaChevronLeft />
//             </button>
            
//             {/* Page numbers */}
//             {getPageNumbers().map(page => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
//               >
//                 {page}
//               </button>
//             ))}
            
//             {/* Next page button */}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === pagination.total_pages}
//               className="join-item btn btn-sm"
//             >
//               <FaChevronRight />
//             </button>
            
//             {/* Last page button */}
//             <button
//               onClick={() => handlePageChange(pagination.total_pages)}
//               disabled={currentPage === pagination.total_pages}
//               className="join-item btn btn-sm"
//             >
//               »
//             </button>
//           </div>
          
//           {/* Items per page selector */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-slate-500">Show:</span>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//                 fetchEmployees(1, searchText);
//               }}
//               className="select select-bordered select-sm"
//             >
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//           </div>
//         </div>
//       )}
      
//       {/* Summary and Actions */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
//         <div className="space-y-2">
//           <div className="flex items-center gap-4">
//             <div className="stat py-0 px-4">
//               <div className="stat-title">Total Employees</div>
//               <div className="stat-value text-lg">{pagination.total}</div>
//             </div>
//             <div className="stat py-0 px-4">
//               <div className="stat-title">On This Page</div>
//               <div className="stat-value text-lg">{employees.length}</div>
//             </div>
//             <div className="stat py-0 px-4">
//               <div className="stat-title">Selected</div>
//               <div className="stat-value text-lg text-primary">{selectedEmployees.length}</div>
//             </div>
//           </div>
//           {selectedEmployees.length > 0 && (
//             <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
//               Ready to assign <strong>{selectedEmployees.length}</strong> employee(s) to this group
//             </p>
//           )}
//         </div>
        
//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//           <button 
//             onClick={onClose} 
//             className="btn btn-ghost flex-1 sm:flex-none"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAssignEmployees}
//             disabled={selectedEmployees.length === 0 || assigning}
//             className="btn btn-primary flex-1 sm:flex-none"
//           >
//             {assigning ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 Assigning...
//               </>
//             ) : (
//               <>
//                 <FaUsers className="mr-2" />
//                 Assign {selectedEmployees.length} Employee(s)
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeBulkAssignment;

// components/EmployeeBulkAssignment.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useTheme } from '../components/ThemeProvider';
import { useNotification } from '../hooks/useNotification';
import { FaSearch, FaCheck, FaTimes, FaUsers, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

interface Employee {
  id: number;
  name: string;
  employee_code: string;
  employee_no?: string;
  department_name: string | null;
  department?: string | null;
  company_name?: string | null;
  position?: string | null;
  status?: string | null;
  joined_date: string | null;
  current_group_id: number | null;
  assignment_id: number | null;
  effective_date: string | null;
  end_date: string | null;
  is_assigned: number;
  is_assigned_to_current_group: number;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiResponse {
  employees: Employee[];
  pagination: PaginationInfo;
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
  const { theme } = useTheme();
  const { showNotification } = useNotification();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 1
  });
  
  // Fetch employees with pagination
  const fetchEmployees = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/api/leave-entitlement-groups/employees/available`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          },
          params: { 
            groupId,
            page,
            limit: itemsPerPage,
            search: search || undefined
          }
        }
      );
      
      const { employees: employeesData, pagination: paginationData } = response.data;
      
      setEmployees(employeesData);
      setPagination(paginationData);
      setCurrentPage(paginationData.current_page);
      
      // Pre-select employees already assigned to THIS group
      const assignedToThisGroup = employeesData
        .filter(emp => emp.is_assigned_to_current_group === 1)
        .map(emp => emp.id);
      
      setSelectedEmployees(assignedToThisGroup);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showNotification('Error loading employees', 'error');
      setEmployees([]);
      setPagination({
        current_page: 1,
        per_page: itemsPerPage,
        total: 0,
        total_pages: 1
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchEmployees(1, '');
  }, [groupId]);
  
  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1);
    fetchEmployees(1, searchText);
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchText('');
    setCurrentPage(1);
    fetchEmployees(1, '');
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setCurrentPage(page);
      fetchEmployees(page, searchText);
    }
  };
  
  // Select/deselect all on current page
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const availableIds: number[] = [];
      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        // Only select employees not already assigned to ANY group
        if (emp.is_assigned === 0) {
          availableIds.push(emp.id);
        }
      }
      
      setSelectedEmployees(prev => {
        const newSelected = [...prev];
        for (let i = 0; i < availableIds.length; i++) {
          if (!newSelected.includes(availableIds[i])) {
            newSelected.push(availableIds[i]);
          }
        }
        return newSelected;
      });
    } else {
      // Remove only employees on current page
      const currentPageIds = employees.map(emp => emp.id);
      setSelectedEmployees(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };
  
  // Toggle single employee
  const toggleEmployee = (employeeId: number) => {
    const newSelected = [...selectedEmployees];
    const index = newSelected.indexOf(employeeId);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(employeeId);
    }
    
    setSelectedEmployees(newSelected);
  };
  
  // Calculate if all available employees on current page are selected
  const isAllSelectedOnPage = () => {
    const availableOnPage = employees.filter(emp => emp.is_assigned === 0);
    if (availableOnPage.length === 0) return false;
    
    return availableOnPage.every(emp => selectedEmployees.includes(emp.id));
  };
  
  // Get counts for current page
  const getSelectedCountOnPage = () => {
    return employees.filter(emp => selectedEmployees.includes(emp.id)).length;
  };
  
  const getAvailableCountOnPage = () => {
    return employees.filter(emp => emp.is_assigned === 0).length;
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  // Get assignment badge - UPDATED LOGIC
  const getAssignmentBadge = (employee: Employee) => {
    if (employee.is_assigned_to_current_group === 1) {
      return { text: 'In This Group', class: 'badge-success' };
    }
    if (employee.is_assigned === 1 && employee.current_group_id) {
      return { text: `Assigned to Group ${employee.current_group_id}`, class: 'badge-warning' };
    }
    return { text: 'Available', class: 'badge-ghost' };
  };

  const handleAssignEmployees = async () => {
  // Filter out employees who are already assigned to this group or other groups
  const employeesToAssign = selectedEmployees.filter(id => {
    const employee = employees.find(emp => emp.id === id);
    // Only include employees who are not assigned to ANY group
    return employee && employee.is_assigned === 0;
  });
  
  if (employeesToAssign.length === 0) {
    showNotification('Please select at least one available employee', 'error');
    return;
  }
  
  try {
    setAssigning(true);
    
    // Use the correct endpoint: /assign (not /assign-employees)
    const response = await axios.post(
      `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign`,
      {
        employee_ids: employeesToAssign,
        effective_date: effectiveDate
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      }
    );
    
    showNotification(`${employeesToAssign.length} employee(s) assigned successfully`, 'success');
    onSuccess();
  } catch (error: any) {
    console.error('Error assigning employees:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      // Try alternative endpoint if the first one fails
      try {
        const altResponse = await axios.post(
          `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assign-employees`,
          {
            employee_ids: employeesToAssign,
            effective_date: effectiveDate
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
            }
          }
        );
        
        showNotification(`${employeesToAssign.length} employee(s) assigned successfully`, 'success');
        onSuccess();
      } catch (altError: any) {
        showNotification(
          altError.response?.data?.error || 'Error assigning employees. Please check API endpoints.',
          'error'
        );
      }
    } else if (error.response?.data?.code === 'ER_DUP_ENTRY') {
      // Handle duplicate entry error
      showNotification(
        'One or more employees are already assigned to this group. Please refresh the page and try again.',
        'error'
      );
    } else {
      showNotification(error.response?.data?.error || 'Error assigning employees', 'error');
    }
  } finally {
    setAssigning(false);
  }
};
  
  // Remove employee from group
  const removeEmployeeFromGroup1712 = async (employeeId: number) => {
    try {
      // First check if the employee is actually in this group
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee || employee.is_assigned_to_current_group !== 1) {
        showNotification('Employee is not assigned to this group', 'error');
        return;
      }
      
      // Use the correct endpoint
      await axios.put(
        `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
        { end_date: new Date().toISOString().split('T')[0] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
          }
        }
      );
      
      showNotification('Employee removed from group', 'success');
      
      // Refresh the current page
      fetchEmployees(currentPage, searchText);
      
      // Remove from selected employees
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    } catch (error: any) {
      console.error('Error removing employee:', error);
      showNotification(error.response?.data?.error || 'Error removing employee', 'error');
    }
  };

const removeEmployeeFromGroup = async (employeeId: number) => {
  try {
    // First check if the employee is actually in this group
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee || employee.is_assigned_to_current_group !== 1) {
      showNotification('Employee is not assigned to this group', 'error');
      return;
    }
    
    // Check if we have assignment_id
    if (!employee.assignment_id) {
      showNotification('Cannot remove: Assignment ID not found', 'error');
      return;
    }
    
    console.log(`Removing assignment ${employee.assignment_id} for employee ${employeeId} from group ${groupId}`);
    
    // Use the correct DELETE endpoint with assignment_id
    await axios.delete(
      `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/assignments/${employee.assignment_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      }
    );
    
    showNotification('Employee removed from group', 'success');
    
    // Refresh the current page
    fetchEmployees(currentPage, searchText);
    
    // Remove from selected employees
    setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    
  } catch (error: any) {
    console.error('Error removing employee:', error);
    
    // Try alternative endpoint if DELETE fails
    if (error.response?.status === 404 || error.response?.status === 400) {
      console.log('DELETE endpoint failed, trying PUT endpoint...');
      try {
        // Try the PUT endpoint as fallback
        await axios.put(
          `${API_BASE_URL}/api/leave-entitlement-groups/${groupId}/employees/${employeeId}/end`,
          { end_date: new Date().toISOString().split('T')[0] },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
            }
          }
        );
        
        showNotification('Employee removed from group', 'success');
        fetchEmployees(currentPage, searchText);
        setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
        
      } catch (secondError: any) {
        console.error('PUT endpoint also failed:', secondError);
        showNotification(
          secondError.response?.data?.error || 'Error removing employee',
          'error'
        );
      }
    } else {
      showNotification(error.response?.data?.error || 'Error removing employee', 'error');
    }
  }
};
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (pagination.total_pages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.total_pages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(pagination.total_pages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };
  
  // Warning message for employees assigned to other groups
  const getAssignmentWarning = (employee: Employee) => {
    if (employee.is_assigned === 1 && employee.current_group_id && employee.is_assigned_to_current_group === 0) {
      return `Already assigned to Group ${employee.current_group_id}`;
    }
    return null;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Search and Select All */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={isAllSelectedOnPage()}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="checkbox checkbox-primary"
                disabled={getAvailableCountOnPage() === 0}
              />
              <span className="label-text font-medium">Select All Available</span>
            </label>
          </div>
          
          <div className="badge badge-primary badge-lg">
            {selectedEmployees.length} total selected
          </div>
        </div>
        
        <div className="join w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search employees by name, code, department, company, or position..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={`input input-bordered join-item w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
          />
          <button 
            onClick={handleSearch}
            className="btn join-item btn-primary"
          >
            <FaSearch />
            Search
          </button>
          {searchText && (
            <button 
              onClick={handleClearSearch}
              className="btn join-item btn-error"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* Effective Date */}
      <div className="bg-base-200 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Effective Date</span>
              <span className="label-text-alt">When should these assignments take effect?</span>
            </label>
          </div>
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
      </div>
      
      {/* Employees Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="table">
          <thead>
            <tr className={`${theme === 'light' ? 'bg-base-200' : 'bg-slate-700'}`}>
              <th className="w-12">
                <input
                  type="checkbox"
                  checked={isAllSelectedOnPage()}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-sm"
                  disabled={getAvailableCountOnPage() === 0}
                />
              </th>
              <th>Employee</th>
              <th>Company</th>
              <th>Department</th>
              <th>Position</th>
              <th>Assignment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <FaUsers className="h-16 w-16 text-slate-400" />
                    <div className="space-y-2">
                      <p className={`text-lg font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {searchText ? 'No employees found' : 'No employees available'}
                      </p>
                      {searchText ? (
                        <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                          Try adjusting your search criteria
                        </p>
                      ) : (
                        <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                          All employees might already be assigned to groups
                        </p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map(employee => {
                const isSelected = selectedEmployees.includes(employee.id);
                const isAssignedToAnyGroup = employee.is_assigned === 1;
                const isAssignedToThisGroup = employee.is_assigned_to_current_group === 1;
                const assignmentBadge = getAssignmentBadge(employee);
                const warningMessage = getAssignmentWarning(employee);
                
                return (
                  <tr key={employee.id} className={isSelected ? 'bg-primary/10' : ''}>
                    <td>
                      {/* Only show checkbox for employees NOT assigned to ANY group */}
                      {!isAssignedToAnyGroup && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEmployee(employee.id)}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span className="text-xs">
                              {employee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{employee.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500 space-y-1">
                            <div>Code: {employee.employee_code || 'N/A'}</div>
                            <div>Joined: {formatDate(employee.joined_date)}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">
                        {employee.company_name || '-'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-outline">
                        {employee.department_name || employee.department || 'Not specified'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">
                        {employee.position || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className={`badge ${assignmentBadge.class}`}>
                          {assignmentBadge.text}
                        </span>
                        {warningMessage && (
                          <div className="text-xs text-warning flex items-center gap-1">
                            <FaExclamationTriangle className="text-xs" />
                            {warningMessage}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {isAssignedToThisGroup ? (
                        <button
                          onClick={() => removeEmployeeFromGroup(employee.id)}
                          className="btn btn-xs btn-error flex items-center gap-1"
                        >
                          <FaTimes />
                          Remove from Group
                        </button>
                      ) : isAssignedToAnyGroup ? (
                        <button
                          className="btn btn-xs btn-disabled flex items-center gap-1"
                          title="Employee is already assigned to another group"
                        >
                          <FaInfoCircle />
                          Assigned Elsewhere
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleEmployee(employee.id)}
                          className={`btn btn-xs flex items-center gap-1 ${isSelected ? 'btn-error' : 'btn-primary'}`}
                        >
                          {isSelected ? (
                            <>
                              <FaTimes />
                              Deselect
                            </>
                          ) : (
                            <>
                              <FaCheck />
                              Select
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-t">
          <div className="text-sm text-slate-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} employees
          </div>
          
          <div className="join">
            {/* First page button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="join-item btn btn-sm"
            >
              «
            </button>
            
            {/* Previous page button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="join-item btn btn-sm"
            >
              <FaChevronLeft />
            </button>
            
            {/* Page numbers */}
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            {/* Next page button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
              className="join-item btn btn-sm"
            >
              <FaChevronRight />
            </button>
            
            {/* Last page button */}
            <button
              onClick={() => handlePageChange(pagination.total_pages)}
              disabled={currentPage === pagination.total_pages}
              className="join-item btn btn-sm"
            >
              »
            </button>
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
                fetchEmployees(1, searchText);
              }}
              className="select select-bordered select-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Summary and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="stat py-0 px-4">
              <div className="stat-title">Total Employees</div>
              <div className="stat-value text-lg">{pagination.total}</div>
            </div>
            <div className="stat py-0 px-4">
              <div className="stat-title">Available</div>
              <div className="stat-value text-lg">
                {employees.filter(emp => emp.is_assigned === 0).length}
              </div>
            </div>
            <div className="stat py-0 px-4">
              <div className="stat-title">Selected</div>
              <div className="stat-value text-lg text-primary">{selectedEmployees.length}</div>
            </div>
          </div>
          {selectedEmployees.length > 0 && (
            <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Ready to assign <strong>{selectedEmployees.filter(id => {
                const emp = employees.find(e => e.id === id);
                return emp && emp.is_assigned === 0;
              }).length}</strong> available employee(s) to this group
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={onClose} 
            className="btn btn-ghost flex-1 sm:flex-none"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignEmployees}
            disabled={selectedEmployees.filter(id => {
              const emp = employees.find(e => e.id === id);
              return emp && emp.is_assigned === 0;
            }).length === 0 || assigning}
            className="btn btn-primary flex-1 sm:flex-none"
          >
            {assigning ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Assigning...
              </>
            ) : (
              <>
                <FaUsers className="mr-2" />
                Assign {selectedEmployees.filter(id => {
                  const emp = employees.find(e => e.id === id);
                  return emp && emp.is_assigned === 0;
                }).length} Employee(s)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBulkAssignment;
