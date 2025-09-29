'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../components/ThemeProvider';

interface Company {
  id: number;
  company_name: string;
  is_active: number;
}

interface Department {
  id: number;
  department_name: string;
  company_id: number;
}

interface Employee {
  id: number;
  name: string;
  employee_no: string;
  email: string;
  position: string;
  department_name: string;
  status: string;
  is_superadmin: boolean;
  role?: string;
}

export default function AddAdmin() {
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    employee_id: '',
    is_superadmin: false,
    company_id: '',
    department_id: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState({
    companies: false,
    departments: false,
    employees: false
  });

  // Fetch active companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(prev => ({ ...prev, companies: true }));
        const token = localStorage.getItem('hrms_token');
        const response = await fetch(`${API_BASE_URL}/api/admin/getallcompanies`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(prev => ({ ...prev, companies: false }));
      }
    };

    fetchCompanies();
  }, []);

  // Fetch departments when company changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.company_id) return;
      
      try {
        setLoading(prev => ({ ...prev, departments: true }));
        setDepartments([]);
        setEmployees([]);
        setSelectedEmployee(null);
        
        const token = localStorage.getItem('hrms_token');
        const response = await fetch(
          `${API_BASE_URL}/api/admin/companies/${formData.company_id}/departments`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.ok) {
          const data = await response.json();
          setDepartments(data.departments);
          setFormData(prev => ({ ...prev, department_id: '', employee_id: '' }));
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(prev => ({ ...prev, departments: false }));
      }
    };

    fetchDepartments();
  }, [formData.company_id]);

  // Fetch employees when department changes
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!formData.department_id) return;
      
      try {
        setLoading(prev => ({ ...prev, employees: true }));
        setEmployees([]);
        setSelectedEmployee(null);
        
        const token = localStorage.getItem('hrms_token');
        const response = await fetch(
          `${API_BASE_URL}/api/admin/${formData.company_id}/departments/${formData.department_id}/employees?is_active=1`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.ok) {
          const data = await response.json();
          setEmployees(data.employees);
          setFormData(prev => ({ ...prev, employee_id: '' }));
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(prev => ({ ...prev, employees: false }));
      }
    };

    fetchEmployees();
  }, [formData.department_id, formData.company_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update selected employee when employee_id changes
    if (name === 'employee_id' && value) {
      const emp = employees.find(e => e.id.toString() === value);
      setSelectedEmployee(emp || null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.company_id) newErrors.company_id = 'Company is required';
    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setErrors(prev => ({ ...prev, form: '' }));
      
      const token = localStorage.getItem('hrms_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/${formData.employee_id}/superadmin`, 
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            is_superadmin: formData.is_superadmin
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update admin status');
      }

      router.push('/admins?success=Admin status updated successfully');
    } catch (error) {
      console.error('Error updating admin status:', error);
      setErrors(prev => ({
        ...prev,
        form: (error as Error).message || 'Failed to update admin status. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`container mx-auto p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
          {formData.is_superadmin ? 'Promote to Super Admin' : 'Set Admin Privileges'}
        </h1>
        <Link href="/admins" className={`btn ${theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-slate-100'} border-0`}>
          Back to Admin List
        </Link>
      </div>
      
      <div className={`card ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'} shadow-md rounded-lg p-6 mb-6`}>
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Error updating admin status</h3>
                <div className="text-xs">{errors.form}</div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <section>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Employee Selection</h2>
              
              <div className="space-y-4">
                {/* Company Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Company <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    name="company_id"
                    className={`select select-bordered w-full ${errors.company_id ? 'select-error' : ''} ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
                    value={formData.company_id}
                    onChange={handleChange}
                    disabled={loading.companies}
                  >
                    <option value="">Select company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                  {loading.companies && (
                    <span className="loading loading-spinner loading-xs ml-2"></span>
                  )}
                  {errors.company_id && (
                    <label className="label">
                      <span className="label-text-alt text-red-500">{errors.company_id}</span>
                    </label>
                  )}
                </div>

                {/* Department Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Department <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    name="department_id"
                    className={`select select-bordered w-full ${errors.department_id ? 'select-error' : ''} ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
                    value={formData.department_id}
                    onChange={handleChange}
                    disabled={!formData.company_id || loading.departments}
                  >
                    <option value="">{departments.length ? 'Select department' : 'No departments available'}</option>
                    {departments.map(department => (
                      <option key={department.id} value={department.id}>
                        {department.department_name}
                      </option>
                    ))}
                  </select>
                  {loading.departments && (
                    <span className="loading loading-spinner loading-xs ml-2"></span>
                  )}
                  {errors.department_id && (
                    <label className="label">
                      <span className="label-text-alt text-red-500">{errors.department_id}</span>
                    </label>
                  )}
                </div>

                {/* Employee Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Employee <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    name="employee_id"
                    className={`select select-bordered w-full ${errors.employee_id ? 'select-error' : ''} ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
                    value={formData.employee_id}
                    onChange={handleChange}
                    disabled={!formData.department_id || loading.employees}
                  >
                    <option value="">{employees.length ? 'Select employee' : 'No employees available'}</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.employee_no})
                      </option>
                    ))}
                  </select>
                  {loading.employees && (
                    <span className="loading loading-spinner loading-xs ml-2"></span>
                  )}
                  {errors.employee_id && (
                    <label className="label">
                      <span className="label-text-alt text-red-500">{errors.employee_id}</span>
                    </label>
                  )}
                </div>

                {/* Selected Employee Details */}
                {selectedEmployee && (
                  <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                    <h3 className="font-semibold mb-2">Employee Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><span className="font-medium">Name:</span> {selectedEmployee.name}</p>
                        <p><span className="font-medium">Employee ID:</span> {selectedEmployee.employee_no}</p>
                        <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Position:</span> {selectedEmployee.position}</p>
                        <p><span className="font-medium">Department:</span> {selectedEmployee.department_name}</p>
                        <p><span className="font-medium">Status:</span> {selectedEmployee.status}</p>
                        <p><span className="font-medium">Current Admin Status:</span> 
                        {selectedEmployee.is_superadmin 
                            ? ' Super Admin' 
                            : (selectedEmployee.role || '').toLowerCase() === 'admin' 
                            ? ' Admin' 
                            : ' Regular User'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
            
            <section>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Admin Privileges</h2>
              
              <div className="form-control">
                <label className="cursor-pointer label justify-start gap-4">
                  <input
                    type="checkbox"
                    name="is_superadmin"
                    checked={formData.is_superadmin}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Grant super admin privileges (full system access)
                  </span>
                </label>
                <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Super admins have unrestricted access to all system features and settings.
                </p>
              </div>
            </section>
            
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admins" className={`btn ${theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-slate-700 hover:bg-slate-600 text-slate-100'} border-0`}>
                Cancel
              </Link>
              <button 
                type="submit" 
                className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                disabled={isSubmitting || !selectedEmployee}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    {formData.is_superadmin ? 'Promoting...' : 'Updating...'}
                  </>
                ) : formData.is_superadmin ? 'Promote to Super Admin' : 'Update Admin Status'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}