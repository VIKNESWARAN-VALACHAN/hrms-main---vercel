// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { API_BASE_URL } from '../../config';
// import { useTheme } from '../../components/ThemeProvider';

// interface Company {
//   id: number;
//   company_name: string;
//   is_active: number;
// }

// interface Department {
//   id: number;
//   department_name: string;
//   company_id: number;
// }

// interface Employee {
//   id: number;
//   name: string;
//   employee_no: string;
//   email: string;
//   position: string;
//   department_name: string;
//   status: string;
//   is_superadmin: boolean;
//   role?: string;
// }

// export default function AddAdmin() {
//   const { theme } = useTheme();
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     employee_id: '',
//     is_superadmin: false,
//     company_id: '',
//     department_id: ''
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [loading, setLoading] = useState({
//     companies: false,
//     departments: false,
//     employees: false
//   });

//   // Fetch active companies
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         setLoading(prev => ({ ...prev, companies: true }));
//         const token = localStorage.getItem('hrms_token');
//         const response = await fetch(`${API_BASE_URL}/api/admin/getallcompanies`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setCompanies(data);
//         }
//       } catch (error) {
//         console.error('Error fetching companies:', error);
//       } finally {
//         setLoading(prev => ({ ...prev, companies: false }));
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // Fetch departments when company changes
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       if (!formData.company_id) return;
      
//       try {
//         setLoading(prev => ({ ...prev, departments: true }));
//         setDepartments([]);
//         setEmployees([]);
//         setSelectedEmployee(null);
        
//         const token = localStorage.getItem('hrms_token');
//         const response = await fetch(
//           `${API_BASE_URL}/api/admin/companies/${formData.company_id}/departments`, 
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         if (response.ok) {
//           const data = await response.json();
//           setDepartments(data.departments);
//           setFormData(prev => ({ ...prev, department_id: '', employee_id: '' }));
//         }
//       } catch (error) {
//         console.error('Error fetching departments:', error);
//       } finally {
//         setLoading(prev => ({ ...prev, departments: false }));
//       }
//     };

//     fetchDepartments();
//   }, [formData.company_id]);

//   // Fetch employees when department changes
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       if (!formData.department_id) return;
      
//       try {
//         setLoading(prev => ({ ...prev, employees: true }));
//         setEmployees([]);
//         setSelectedEmployee(null);
        
//         const token = localStorage.getItem('hrms_token');
//         const response = await fetch(
//           `${API_BASE_URL}/api/admin/${formData.company_id}/departments/${formData.department_id}/employees?is_active=1`, 
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         if (response.ok) {
//           const data = await response.json();
//           setEmployees(data.employees);
//           setFormData(prev => ({ ...prev, employee_id: '' }));
//         }
//       } catch (error) {
//         console.error('Error fetching employees:', error);
//       } finally {
//         setLoading(prev => ({ ...prev, employees: false }));
//       }
//     };

//     fetchEmployees();
//   }, [formData.department_id, formData.company_id]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }

//     // Update selected employee when employee_id changes
//     if (name === 'employee_id' && value) {
//       const emp = employees.find(e => e.id.toString() === value);
//       setSelectedEmployee(emp || null);
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.company_id) newErrors.company_id = 'Company is required';
//     if (!formData.department_id) newErrors.department_id = 'Department is required';
//     if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     try {
//       setIsSubmitting(true);
//       setErrors(prev => ({ ...prev, form: '' }));
      
//       const token = localStorage.getItem('hrms_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/api/admin/${formData.employee_id}/superadmin`, 
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             is_superadmin: formData.is_superadmin
//           })
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Failed to update admin status');
//       }

//       router.push('/admins?success=Admin status updated successfully');
//     } catch (error) {
//       console.error('Error updating admin status:', error);
//       setErrors(prev => ({
//         ...prev,
//         form: (error as Error).message || 'Failed to update admin status. Please try again.'
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className={`container mx-auto p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
//           {formData.is_superadmin ? 'Promote to Super Admin' : 'Set Admin Privileges'}
//         </h1>
//         <Link href="/admins" className={`btn ${theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-slate-100'} border-0`}>
//           Back to Admin List
//         </Link>
//       </div>
      
//       <div className={`card ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'} shadow-md rounded-lg p-6 mb-6`}>
//         <form onSubmit={handleSubmit}>
//           {errors.form && (
//             <div className="alert alert-error mb-6">
//               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <div>
//                 <h3 className="font-bold">Error updating admin status</h3>
//                 <div className="text-xs">{errors.form}</div>
//               </div>
//             </div>
//           )}
          
//           <div className="space-y-6">
//             <section>
//               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Employee Selection</h2>
              
//               <div className="space-y-4">
//                 {/* Company Selection */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                       Company <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <select
//                     name="company_id"
//                     className={`select select-bordered w-full ${errors.company_id ? 'select-error' : ''} ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//                     value={formData.company_id}
//                     onChange={handleChange}
//                     disabled={loading.companies}
//                   >
//                     <option value="">Select company</option>
//                     {companies.map(company => (
//                       <option key={company.id} value={company.id}>
//                         {company.company_name}
//                       </option>
//                     ))}
//                   </select>
//                   {loading.companies && (
//                     <span className="loading loading-spinner loading-xs ml-2"></span>
//                   )}
//                   {errors.company_id && (
//                     <label className="label">
//                       <span className="label-text-alt text-red-500">{errors.company_id}</span>
//                     </label>
//                   )}
//                 </div>

//                 {/* Department Selection */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                       Department <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <select
//                     name="department_id"
//                     className={`select select-bordered w-full ${errors.department_id ? 'select-error' : ''} ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//                     value={formData.department_id}
//                     onChange={handleChange}
//                     disabled={!formData.company_id || loading.departments}
//                   >
//                     <option value="">{departments.length ? 'Select department' : 'No departments available'}</option>
//                     {departments.map(department => (
//                       <option key={department.id} value={department.id}>
//                         {department.department_name}
//                       </option>
//                     ))}
//                   </select>
//                   {loading.departments && (
//                     <span className="loading loading-spinner loading-xs ml-2"></span>
//                   )}
//                   {errors.department_id && (
//                     <label className="label">
//                       <span className="label-text-alt text-red-500">{errors.department_id}</span>
//                     </label>
//                   )}
//                 </div>

//                 {/* Employee Selection */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                       Employee <span className="text-red-500">*</span>
//                     </span>
//                   </label>
//                   <select
//                     name="employee_id"
//                     className={`select select-bordered w-full ${errors.employee_id ? 'select-error' : ''} ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
//                     value={formData.employee_id}
//                     onChange={handleChange}
//                     disabled={!formData.department_id || loading.employees}
//                   >
//                     <option value="">{employees.length ? 'Select employee' : 'No employees available'}</option>
//                     {employees.map(employee => (
//                       <option key={employee.id} value={employee.id}>
//                         {employee.name} ({employee.employee_no})
//                       </option>
//                     ))}
//                   </select>
//                   {loading.employees && (
//                     <span className="loading loading-spinner loading-xs ml-2"></span>
//                   )}
//                   {errors.employee_id && (
//                     <label className="label">
//                       <span className="label-text-alt text-red-500">{errors.employee_id}</span>
//                     </label>
//                   )}
//                 </div>

//                 {/* Selected Employee Details */}
//                 {selectedEmployee && (
//                   <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
//                     <h3 className="font-semibold mb-2">Employee Details</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p><span className="font-medium">Name:</span> {selectedEmployee.name}</p>
//                         <p><span className="font-medium">Employee ID:</span> {selectedEmployee.employee_no}</p>
//                         <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
//                       </div>
//                       <div>
//                         <p><span className="font-medium">Position:</span> {selectedEmployee.position}</p>
//                         <p><span className="font-medium">Department:</span> {selectedEmployee.department_name}</p>
//                         <p><span className="font-medium">Status:</span> {selectedEmployee.status}</p>
//                         <p><span className="font-medium">Current Admin Status:</span> 
//                         {selectedEmployee.is_superadmin 
//                             ? ' Super Admin' 
//                             : (selectedEmployee.role || '').toLowerCase() === 'admin' 
//                             ? ' Admin' 
//                             : ' Regular User'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>
            
//             <section>
//               <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Admin Privileges</h2>
              
//               <div className="form-control">
//                 <label className="cursor-pointer label justify-start gap-4">
//                   <input
//                     type="checkbox"
//                     name="is_superadmin"
//                     checked={formData.is_superadmin}
//                     onChange={handleChange}
//                     className="checkbox checkbox-primary"
//                   />
//                   <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
//                     Grant super admin privileges (full system access)
//                   </span>
//                 </label>
//                 <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
//                   Super admins have unrestricted access to all system features and settings.
//                 </p>
//               </div>
//             </section>
            
//             <div className="flex justify-end gap-4 pt-4">
//               <Link href="/admins" className={`btn ${theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-slate-100'} border-0`}>
//                 Cancel
//               </Link>
//               <button 
//                 type="submit" 
//                 className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
//                 disabled={isSubmitting || !selectedEmployee}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span className="loading loading-spinner"></span>
//                     {formData.is_superadmin ? 'Promoting...' : 'Updating...'}
//                   </>
//                 ) : formData.is_superadmin ? 'Promote to Super Admin' : 'Update Admin Status'}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/app/components/ThemeProvider';

export default function AddAdmin() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string>('');

  // Employee number validation state
  const [employeeNoValidation, setEmployeeNoValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  }>({
    isValidating: false,
    isValid: null,
    message: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employee_no: '',
    is_superadmin: false
  });

  const [showPassword, setShowPassword] = useState(false);

  // Add role check to redirect non-admin users
  useEffect(() => {
    const checkUserRole = () => {
      const user = localStorage.getItem('hrms_user');
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);

        // If user is not admin, redirect to dashboard
        if (userData.role !== 'admin') {
          router.push('/');
        }
      } else {
        // If no user data, redirect to login
        router.push('/auth/login');
      }
    };

    checkUserRole();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Employee number validation function
  const validateEmployeeNumber = async (employeeNo: string) => {
    if (!employeeNo.trim()) {
      setEmployeeNoValidation({
        isValidating: false,
        isValid: null,
        message: ''
      });
      return;
    }

    setEmployeeNoValidation({
      isValidating: true,
      isValid: null,
      message: 'Validating...'
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/validate/employee-number?employee_no=${encodeURIComponent(employeeNo.trim())}`);

      if (!response.ok) {
        throw new Error('Failed to validate employee number');
      }

      const data = await response.json();

      if (data.success && data.available) {
        setEmployeeNoValidation({
          isValidating: false,
          isValid: true,
          message: 'Employee number is available'
        });
      } else {
        setEmployeeNoValidation({
          isValidating: false,
          isValid: false,
          message: data.message || 'Employee number already exists'
        });
      }
    } catch (error) {
      console.error('Error validating employee number:', error);
      setEmployeeNoValidation({
        isValidating: false,
        isValid: false,
        message: 'Failed to validate employee number'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if employee number is valid before submitting
    if (formData.employee_no && employeeNoValidation.isValid === false) {
      setLoading(false);
      setError('Please fix the employee number validation errors before submitting.');
      return;
    }

    // If employee number hasn't been validated yet, validate it now
    if (formData.employee_no && employeeNoValidation.isValid === null) {
      setLoading(false);
      setError('Please wait for employee number validation to complete before submitting.');
      return;
    }

    try {
      // Prepare the data for the API - using minimal required fields for admin
      const adminData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        employee_no: formData.employee_no,
        role: 'admin',
        is_superadmin: formData.is_superadmin ? 1 : 0,
        superior: '',
      };

      const response = await fetch(`${API_BASE_URL}/api/admin/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to create admin');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();

      // Show success toast
      toast.success(`Admin ${formData.name} created successfully!`, {
        duration: 3000,
        position: 'top-center',
      });

      // Redirect to admins or admin management page
      router.push('/admins');

    } catch (error) {
      //console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating the admin');
      setLoading(false);

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm breadcrumbs">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/admins">Admins</Link></li>
          <li className="font-semibold">Add Admin</li>
        </ul>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Add New Admin
        </h1>

        <div className="flex justify-end">
          <Link href="/admins" className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="p-0">
            <h2 className="card-title text-xl mb-4">Admin Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Employee No */}
              <div className="form-control">
                <div className="mb-2">Employee No <span className="text-error">*</span></div>
                <div className="relative">
                  <input
                    type="text"
                    name="employee_no"
                    placeholder="Enter employee ID/number"
                    value={formData.employee_no}
                    onChange={handleChange}
                    onBlur={(e) => validateEmployeeNumber(e.target.value)}
                    className={`input input-bordered w-full ${employeeNoValidation.isValid === false
                        ? 'input-error border-red-500'
                        : employeeNoValidation.isValid === true
                          ? 'input-success border-green-500'
                          : ''
                      }`}
                    required
                  />
                  {employeeNoValidation.isValidating && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="loading loading-spinner loading-xs"></div>
                    </div>
                  )}
                </div>
                {employeeNoValidation.message && (
                  <label className="label">
                    <span className={`label-text-alt ${employeeNoValidation.isValid === false
                        ? 'text-red-500'
                        : employeeNoValidation.isValid === true
                          ? 'text-green-500'
                          : 'text-gray-500'
                      }`}>
                      {employeeNoValidation.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Full Name */}
              <div className="form-control">
                <div className="mb-2">Full Name <span className="text-error">*</span></div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              {/* Email */}
              <div className="form-control">
                <div className="mb-2">Email Address <span className="text-error">*</span></div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              {/* Password */}
              <div className="form-control">
                <div className="mb-2">Password <span className="text-error">*</span></div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-bordered w-full pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt text-gray-500">Minimum 6 characters</span>
                </label>
              </div>

              {/* Super Admin checkbox - Full width */}
              <div className="form-control md:col-span-2">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="is_superadmin"
                    className="checkbox checkbox-primary"
                    checked={formData.is_superadmin}
                    onChange={handleChange}
                  />
                  <span className="label-text">
                    <span className={`font-medium ${theme === 'light' ? '' : 'text-white'}`}>Super Admin</span>
                    <span className="block text-sm text-gray-500">Grant super admin privileges (full system access)</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-8 space-x-3">
              <Link href="/admins" className="btn btn-ghost">
                Cancel
              </Link>

              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading || employeeNoValidation.isValid === false}
              >
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

