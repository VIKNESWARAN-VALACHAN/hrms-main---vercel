'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../config';
import defaultLeaveTypes from '../../components/leaveTypesDefaultConfig';
interface Company {
  id: string;
  name: string;
}

// Validation state interface
interface ValidationErrors {
  email?: string;
  website?: string;
}

// Add Department interface
interface Department {
  department_name: string;
  status: 'active' | 'inactive';
  positions?: Position[];
  id?: string;
}

interface Position {
  title: string;
  start_work_time: string;
  end_work_time: string;
  job_level: string;
  job_description: string;
}

// Form data interface
interface CompanyFormData {
  name: string;
  register_number?: string;
  address: string;
  email: string;
  phone: string;
  status: string;
  parent_id: string;
  income_tax_no: string;
  socso_account_no: string;
  epf_account_no: string;
  website: string;
  description: string;
  departments: string[]; // Array of department names for API
}

// Define LeaveType interface for typing
interface LeaveType {
  leave_type_name: string;
  code: string;
  description?: string;
  max_days: number;
  requires_approval: 0 | 1;
  requires_documentation: 0 | 1;
  is_active: 0 | 1;
  company_id?: number | string;
  is_total:0 | 1;
  total_type: string;
  is_divident: 0 | 1;
  carry_forward_days: number;
  increment_days: number;
  max_increment_days: number;
}

// Create a client component that uses useSearchParams
function AddCompanyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parentId');

  // Tab state
  const [activeTab, setActiveTab] = useState('company');

  // Form state
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    register_number: '',
    address: '',
    email: '',
    phone: '',
    status: 'active',
    parent_id: parentId || '',
    income_tax_no: '',
    socso_account_no: '',
    epf_account_no: '',
    website: '',
    description: '',
    departments: [], // Initialize as empty array
  });

  // Department state - separate from main form for better organization
  const [departments, setDepartments] = useState<Department[]>([{
    department_name: '',
    status: 'active'
  }]);

  // State for parent companies list
  const [parentCompanies, setParentCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentCompanyName, setParentCompanyName] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [departmentErrors, setDepartmentErrors] = useState<string[]>([]);
  const [isParentCompanySelected, setIsParentCompanySelected] = useState(false);

  // Fetch parent companies for dropdown
  useEffect(() => {
    const fetchParentCompanies = async () => {
      try {
        const apiUrl = API_BASE_URL;
        // In a real app, fetch from your API
        const response = await fetch(`${apiUrl}/api/admin/companies`);
        if (!response.ok) {
          throw new Error('Failed to fetch parent companies');
        }

        const data = await response.json();
        // Filter to only include parent companies (those with no parent_id)
        const parentCompaniesOnly = data.filter((company: any) => !company.parent_id);
        setParentCompanies(parentCompaniesOnly.map((company: any) => ({
          id: company.id.toString(),
          name: company.company_name || company.name
        })));

        // If parentId is provided, find and set the parent company name
        if (parentId) {
          const parent = data.find((company: any) => company.id.toString() === parentId);
          if (parent) {
            setParentCompanyName(parent.company_name || parent.name);
          }
        }
      } catch (error) {
        console.error('Error fetching parent companies:', error);
        setError('Failed to load parent companies. Please try again later.');
      }
    };

    fetchParentCompanies();
  }, [parentId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation errors when user types
    if (name === 'email' || name === 'website') {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleParentCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (value !== '') {
      setIsParentCompanySelected(true);
    } else {
      setIsParentCompanySelected(false);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle department field changes
  const handleDepartmentChange = (index: number, field: keyof Department, value: string) => {
    const updatedDepartments = [...departments];
    updatedDepartments[index] = {
      ...updatedDepartments[index],
      [field]: value
    };

    setDepartments(updatedDepartments);

    // Clear validation error for this department if exists
    if (departmentErrors[index]) {
      const newErrors = [...departmentErrors];
      newErrors[index] = '';
      setDepartmentErrors(newErrors);
    }
  };

  // Add new department field
  const addDepartment = () => {
    setDepartments([
      ...departments,
      { department_name: '', status: 'active' }
    ]);
    // Add a placeholder for this department's error
    setDepartmentErrors([...departmentErrors, '']);
  };

  // Remove department field
  const removeDepartment = (index: number) => {
    const updatedDepartments = [...departments];
    updatedDepartments.splice(index, 1);
    setDepartments(updatedDepartments);

    // Also remove this department's error
    const newErrors = [...departmentErrors];
    newErrors.splice(index, 1);
    setDepartmentErrors(newErrors);
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // Website validation function
  const validateWebsite = (website: string): boolean => {
    if (!website) return true; // Allow empty website
    const websiteRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return websiteRegex.test(website);
  };

  // Validate departments
  const validateDepartments = (): boolean => {
    let isValid = true;
    const errors: string[] = departments.map(() => '');

    departments.forEach((dept, index) => {
      if (!dept.department_name.trim()) {
        errors[index] = 'Department name is required';
        isValid = false;
      }
    });

    setDepartmentErrors(errors);
    return isValid;
  };

  // Handle Next button click to move to departments tab
  const handleNextClick = () => {
    // Validate company information before proceeding
    const newValidationErrors: ValidationErrors = {};

    // Validate email
    if (formData.email && !validateEmail(formData.email)) {//if (!validateEmail(formData.email)) {
      newValidationErrors.email = 'Please enter a valid email address';
    }

    // Validate website if provided
    if (formData.website && !validateWebsite(formData.website)) {
      newValidationErrors.website = 'Please enter a valid website URL';
    }

    // If there are validation errors, show them and stop
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    // Validate departments if any exist
    const validDepartments = departments.filter(dept => dept.department_name.trim() !== '');
    if (validDepartments.length > 0 && !validateDepartments()) {
      setActiveTab('departments'); // Switch to departments tab to show errors
      return;
    }

    // If everything is valid, switch to departments tab
    setActiveTab('departments');
  };

  const fetchParentCompanyDepartments = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/companies/${id}/departments`);
    const data = await response.json();

    if(!response.ok && !data.departments) {
      throw new Error('Failed to fetch parent company departments');
    }

    return data.departments;
  };

  const fetchParentCompanyPositions = async (id: string | undefined) => {
    if (!id) {
      throw new Error('Department ID is required');
    }
    const response = await fetch(`${API_BASE_URL}/api/admin/departments/${id}/positions`);
    if (response.status === 404) {
      return []; // Return empty array if department not found
    }
    const data = await response.json();

    if(!response.ok && !data.positions) {
      throw new Error('Failed to fetch parent company positions');
    }
    return data.positions;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate company information
    const newValidationErrors: ValidationErrors = {};

    // Validate email
    if (formData.email && !validateEmail(formData.email)) {//(formData.email)) {
      newValidationErrors.email = 'Please enter a valid email address';
    }

    // Validate website if provided
    if (formData.website && !validateWebsite(formData.website)) {
      newValidationErrors.website = 'Please enter a valid website URL';
    }

    // If there are validation errors, show them and stop form submission
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      setActiveTab('company'); // Go back to company tab to show errors
      return;
    }

    let inheritedDepartments: Department[] = [];
    if(isParentCompanySelected) {
      const parentCompanyDepartments = await fetchParentCompanyDepartments(formData.parent_id);
      
      // Use Promise.all with map instead of forEach to properly wait for all async operations
      inheritedDepartments = await Promise.all(
        parentCompanyDepartments.map(async (dept: any) => {
          const parentCompanyPositions = await fetchParentCompanyPositions(dept.id);
          
          return {
            department_name: dept.department_name,
            status: dept.is_active ? 'active' : 'inactive',
            positions: parentCompanyPositions.length > 0 ? parentCompanyPositions : []
          };
        })
      );
    }

    // Validate departments if any exist
    const validDepartments = isParentCompanySelected ? inheritedDepartments.filter(dept => dept.department_name.trim() !== '') : departments.filter(dept => dept.department_name.trim() !== '');
    if (validDepartments.length > 0 && !validateDepartments() && !isParentCompanySelected) {
      setActiveTab('departments'); // Switch to departments tab to show errors
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for the API - extract department names
      const dataToSubmit = {
        ...formData,
        // Extract just the department names for the API
        departments: validDepartments.map((dept: any) => ({
          department_name: dept.department_name,
          is_active: dept.status === 'active' ? 1 : 0,
          positions: dept.positions
        }))
      };
      
      const apiUrl = API_BASE_URL;
      // Create company with departments in a single API call
      const response = await fetch(`${apiUrl}/api/admin/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create company');
      }

      // Get the newly created company ID from the response
      const createdCompany = await response.json();
      const newCompanyId = createdCompany.id || createdCompany.company?.id;
      
      if (newCompanyId) {
        try {
          // Create leave types for the new company
          if (isParentCompanySelected && formData.parent_id) {
            // For companies with a parent, fetch parent company's leave types
            const parentLeaveTypesResponse = await fetch(`${apiUrl}/api/v1/leave-types/company/${formData.parent_id}`);
            
            if (parentLeaveTypesResponse.ok) {
              const parentLeaveTypes = await parentLeaveTypesResponse.json();
              
              if (parentLeaveTypes.length > 0) {
                // Create the same leave types for the new company
                const leaveTypesToCreate = parentLeaveTypes.map((leaveType: any) => ({
                  leave_type_name: leaveType.leave_type_name,
                  code: leaveType.code,
                  description: leaveType.description || '',
                  max_days: leaveType.max_days,
                  requires_approval: leaveType.requires_approval,
                  requires_documentation: leaveType.requires_documentation,
                  is_active: leaveType.is_active,
                  company_id: newCompanyId,
                  is_total: leaveType.is_total,
                  total_type: leaveType.total_type,
                  is_divident: leaveType.is_divident,
                  carry_forward_days: leaveType.carry_forward_days,
                  increment_days: leaveType.increment_days,
                  max_increment_days: leaveType.max_increment_days
                }));

                leaveTypesToCreate.forEach(async (leaveType: LeaveType) => {
                  await createLeaveTypes(leaveType);
                });
              }
            }
          } else {                   
              const leaveTypesToCreate = defaultLeaveTypes.map((leaveType: any) => ({
                ...leaveType,
                company_id: newCompanyId
              }));
              leaveTypesToCreate.forEach(async (leaveType: LeaveType) => {
                await createLeaveTypes(leaveType);
              });

          }
        } catch (leaveError) {
          console.error('Error creating leave types:', leaveError);
          // Continue with redirect even if leave type creation fails
        }
      }

      // Redirect to companies list on success
      router.push('/companies');
    } catch (error) {
      //console.error('Error creating company:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  // Function to create leave types using bulk create endpoint
  const createLeaveTypes = async (leaveTypes: LeaveType) => {
    if (!leaveTypes) return;
    
    const response = await fetch(`${API_BASE_URL}/api/v1/leave-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leave_type_name: leaveTypes.leave_type_name,
        code: leaveTypes.code,
        description: leaveTypes.description,
        max_days: leaveTypes.max_days,
        requires_approval: leaveTypes.requires_approval,
        requires_documentation: leaveTypes.requires_documentation,
        is_active: leaveTypes.is_active,
        company_id: leaveTypes.company_id,
        is_total: leaveTypes.is_total,
        total_type: leaveTypes.total_type,
        is_divident: leaveTypes.is_divident,
        carry_forward_days: leaveTypes.carry_forward_days,
        increment_days: leaveTypes.increment_days,
        max_increment_days: leaveTypes.max_increment_days
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create leave types:', errorData);
      // We don't throw an error here to avoid blocking company creation
    }
    
    return response.ok;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm breadcrumbs">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/companies">Companies</Link></li>
          <li className="font-semibold">Add Companies</li>
        </ul>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">

        <h1 className="text-3xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {parentId ? `Add Sub-Company to ${parentCompanyName}` : 'Add New Company'}
        </h1>

        <div className="flex justify-end">
          <Link href="/companies" className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Companies
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
          {/* Tab Navigation */}
          <div className="tabs tabs-boxed mb-6">
            <a
              className={`tab ${activeTab === 'company' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              Company Information
            </a>

            {!isParentCompanySelected && (
              <a
                className={`tab ${activeTab === 'departments' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </a>
            )}
          </div>

          <div className="card-body p-0">
            {/* Company Information Tab */}
            {activeTab === 'company' && (
              <div>
                <h2 className="card-title text-xl mb-4">Company Information</h2>

                {/* Company Information - Two fields per row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name and Registration Number */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Name <span className="text-error">*</span></span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter company name"
                      className="input input-bordered w-full"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Registration Number</span>
                    </label>
                    <input
                      type="text"
                      name="register_number"
                      placeholder="Enter registration number"
                      className="input input-bordered w-full"
                      value={formData.register_number}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Description - Full width */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Company Description</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter company description or additional information"
                      className="textarea textarea-bordered h-24 w-full"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Status and Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      name="status"
                      className="select select-bordered w-full"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Address <span className="text-error"></span></span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      className={`input input-bordered w-full ${validationErrors.email ? 'input-error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      //required
                    />
                    {validationErrors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{validationErrors.email}</span>
                      </label>
                    )}
                  </div>

                  {/* Phone number and Parent Company or Income Tax */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number <span className="text-error"></span></span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      className="input input-bordered w-full"
                      value={formData.phone}
                      onChange={handleChange}
                      //required
                    />
                  </div>

                  {/* Parent Company (if not a sub-company) or Income Tax No. (if a sub-company) */}
                  {!parentId ? (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Parent Company (Optional)</span>
                      </label>
                      <select
                        name="parent_id"
                        className="select select-bordered w-full"
                        value={formData.parent_id}
                        onChange={handleParentCompanyChange}
                      >
                        <option value="">None (This is a Parent Company)</option>
                        {parentCompanies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Income Tax No.</span>
                      </label>
                      <input
                        type="text"
                        name="income_tax_no"
                        placeholder="Enter income tax number"
                        className="input input-bordered w-full"
                        value={formData.income_tax_no}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {/* Income Tax No. (if not a sub-company) and SOCSO Account */}
                  {!parentId && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Income Tax No.</span>
                      </label>
                      <input
                        type="text"
                        name="income_tax_no"
                        placeholder="Enter income tax number"
                        className="input input-bordered w-full"
                        value={formData.income_tax_no}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {/* SOCSO Account Number */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">SOCSO Account No.</span>
                    </label>
                    <input
                      type="text"
                      name="socso_account_no"
                      placeholder="Enter SOCSO account number"
                      className="input input-bordered w-full"
                      value={formData.socso_account_no}
                      onChange={handleChange}
                    />
                  </div>

                  {/* EPF Account Number */}
                  {/* Only show this field as a pair with SOCSO if we're a sub-company */}
                  {/* Otherwise, it will be paired with Income Tax No. */}
                  {parentId && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">EPF Account No.</span>
                      </label>
                      <input
                        type="text"
                        name="epf_account_no"
                        placeholder="Enter EPF account number"
                        className="input input-bordered w-full"
                        value={formData.epf_account_no}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {/* EPF Account Number (if not a sub-company) */}
                  {!parentId && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">EPF Account No.</span>
                      </label>
                      <input
                        type="text"
                        name="epf_account_no"
                        placeholder="Enter EPF account number"
                        className="input input-bordered w-full"
                        value={formData.epf_account_no}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {/* Website */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Website</span>
                    </label>
                    <input
                      type="url"
                      name="website"
                      placeholder="https://example.com"
                      className={`input input-bordered w-full ${validationErrors.website ? 'input-error' : ''}`}
                      value={formData.website}
                      onChange={handleChange}
                    />
                    {validationErrors.website && (
                      <label className="label">
                        <span className="label-text-alt text-error">{validationErrors.website}</span>
                      </label>
                    )}
                  </div>

                  {/* Address - Full width */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Company Address <span className="text-error"></span></span>
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter company address"
                      className="textarea textarea-bordered h-24 w-full"
                      value={formData.address}
                      onChange={handleChange}
                      //required
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end mt-8 space-x-3">
                <Link href="/companies" className="btn btn-ghost">
                      Cancel
                    </Link>
                {!isParentCompanySelected ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextClick}
                    >
                      Next: Departments
                    </button>
                ) : (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        disabled={loading}
                      >
                        {loading ? 'Creating...' : 'Create Company'}
                      </button>
                    </div>
                )}
                </div>
              </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && !isParentCompanySelected && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-xl">Departments</h2>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={addDepartment}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </button>
                </div>

                <p className="text-base-content/70 mb-6">
                  Add departments for your company. You can add multiple departments or leave this section empty and add departments later.
                </p>

                {departments.map((department, index) => (
                  <div key={index} className="card bg-base-100 border border-base-300 mb-4 shadow-sm">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">Department {index + 1}</h3>
                        {departments.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-square btn-sm btn-outline btn-error"
                            onClick={() => removeDepartment(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Department Name*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter department name"
                            className={`input input-bordered w-full ${departmentErrors[index] ? 'input-error' : ''}`}
                            value={department.department_name}
                            onChange={(e) => handleDepartmentChange(index, 'department_name', e.target.value)}
                          />
                          {departmentErrors[index] && (
                            <label className="label">
                              <span className="label-text-alt text-error">{departmentErrors[index]}</span>
                            </label>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Status</span>
                          </label>
                          <select
                            className="select select-bordered w-full"
                            value={department.status}
                            onChange={(e) => handleDepartmentChange(index, 'status', e.target.value as 'active' | 'inactive')}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>


                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col space-y-4 sm:flex-row justify-between mt-8 space-x-3">
                  <div className="flex flex-row justify-between">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setActiveTab('company')}
                    >
                      Back
                    </button>
                    <Link href="/companies" className="btn btn-ghost">
                      Cancel
                    </Link>
                  </div>
                  <div className="flex">
                    <button
                      type="submit"
                      className={`btn btn-primary ${loading ? 'loading' : ''} w-full`}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Company'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Main component that wraps the form with Suspense
export default function AddCompany() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>}>
      <AddCompanyForm />
    </Suspense>
  );
}
