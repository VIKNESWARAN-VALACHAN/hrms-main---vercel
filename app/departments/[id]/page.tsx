"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../components/ThemeProvider';

interface Department {
  id: number;
  department_name: string;
  description: string | null;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  name: string;
  company_name?: string;
  register_number?: string;
  address: string;
  email: string;
  phone: string;
  is_active: number | boolean;
  status?: string;
  parent_id?: string | null;
  parentCompany?: string | null;
  income_tax_no?: string;
  socso_account_no?: string;
  epf_account_no?: string;
  website?: string;
  description?: string;
  created_at?: string;
  hasSubcompanies?: boolean;
}

interface Position {
  id: number;
  title: string;
  start_work_time: string;
  end_work_time: string;
  department_id: number;
  job_description: string | null;
  job_level: string;
  created_at: string;
  updated_at: string;
  employee_count: number;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  employee_no?: string;
  department?: string;
  position?: string;
  status?: string;
  gender?: string;
  joined_date?: string;
  phone?: string;
}

/* 
interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department_id: number;
  position_id: number;
  created_at: string;
  updated_at: string;
}
*/

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DepartmentFormData {
  name: string;
  description: string | null;
  is_active: number;
}

interface PositionFormData {
  title: string;
  start_work_time: string;
  end_work_time: string;
  job_description: string | null;
  job_level: string;
  department_id?: number;
}

function DepartmentDetails() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  
  // Fix: Extract department ID properly from params
  const departmentId = params.id as string;
  
  // We'll get the company ID from the department data when it loads
  const [companyId, setCompanyId] = useState<string | null>(null);
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Department | null>(null);
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const [positionForm, setPositionForm] = useState<PositionFormData>({
    title: '',
    start_work_time: '09:00',
    end_work_time: '17:00',
    job_description: null,
    job_level: 'Junior'
  });

  const [isPositionEditing, setIsPositionEditing] = useState(false);
  const [editPositionId, setEditPositionId] = useState<number | null>(null);
  
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [positionEmployees, setPositionEmployees] = useState<Employee[]>([]);
  const [loadingPositionEmployees, setLoadingPositionEmployees] = useState(false);
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const deletePositionModalRef = useRef<HTMLDialogElement>(null);
  const [deletePositionId, setDeletePositionId] = useState<number | null>(null);
  const [deletePositionTitle, setDeletePositionTitle] = useState<string>('');

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'is_active' ? parseInt(value) : value
      };
    });
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPositionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openPositionModal = (pos: Position) => { 
    if(pos && pos.id && pos.id.toString() !== ''){
      setIsPositionEditing(true);
      setEditPositionId(pos.id);
    }
    else{
      setIsPositionEditing(false);
    }

    setPositionForm({
      title: pos.title || '',
      start_work_time: pos.start_work_time || '09:00',
      end_work_time: pos.end_work_time || '17:00',
      job_description: pos.job_description || null,
      job_level: pos.job_level || 'Junior'
    });
    
    // Show DaisyUI modal using ID reference
    (document.getElementById('position_modal') as HTMLDialogElement)?.showModal();
  };

  const closePositionModal = () => {
    // Close DaisyUI modal using ID reference
    (document.getElementById('position_modal') as HTMLDialogElement)?.close();
    setIsPositionEditing(false);
  };

   // Function to open employees modal for a position
   const openEmployeesModal = (position: Position) => {
    if(position && position.id && position.id.toString() !== ''){
      //setSelectedPosition(position);
      setEditPositionId(position.id);
      // Modal will open immediately after state is set
      (document.getElementById('employees_modal') as HTMLDialogElement)?.showModal();
      setSelectedPosition(position);
    }
    else{
      setSelectedPosition(null);
      setEditPositionId(0);
    }

  };

  const closeEmployeesModal = () => {
    (document.getElementById('employees_modal') as HTMLDialogElement)?.close();
    setSelectedPosition(null);
    setPositionEmployees([]);
    setEditPositionId(0);
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyId) {
      showNotification('Company ID is missing', 'error');
      return;
    }
    
    setSaveLoading(true);
    try {
      const apiUrl = API_BASE_URL;
      
      const response = await fetch(`${apiUrl}/api/admin/departments/${departmentId}/positions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...positionForm,
          department_id: parseInt(departmentId)
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if(response.status === 409){
          showNotification('Position with this title already exists in this department', 'error');
          setIsPositionEditing(false);
          closePositionModal();
          return;
        }
        else{
          throw new Error(data.message || data.error || 'Failed to add position');
        }
      }

      // Add the new position to the positions array
      setPositions(prev => [...prev, data.position]);
      showNotification('Position added successfully', 'success');
      closePositionModal();
      
    } catch (err: any) {
      console.error('Error adding position:', err);
      showNotification(err.message || 'Failed to add position', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaveLoading(true);
    if (!editPositionId) {
      showNotification('Position ID is missing', 'error');
      return;
    };

    try {
      const apiUrl = API_BASE_URL;
      
      const id = editPositionId.toString();
      const response = await fetch(`${apiUrl}/api/admin/positions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(positionForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update position');
      }

      // Add the new department to the list
      // Update the department in the list
      setPositions(prev => 
        prev.map(pos => 
          pos.id === editPositionId 
            ? {
                ...pos,
                title: positionForm.title,
                start_work_time: positionForm.start_work_time,
                end_work_time: positionForm.end_work_time,
                job_description: positionForm.job_description || null,
                job_level: positionForm.job_level
              }
            : pos
        )
      );

      // Get fresh data from the server to ensure consistency
      const posApiUrl = `${apiUrl}/api/admin/departments/${departmentId}/positions`;
      const posResponse = await fetch(posApiUrl);
      
      if (posResponse.ok) {
        const posData = await posResponse.json();
        if (posData.success && Array.isArray(posData.positions)) {
          setPositions(posData.positions);
          setSelectedPosition(posData.positions[0]);
        } else if (Array.isArray(posData)) {
          setPositions(posData.map((pos: any) => ({
            id: pos.id.toString(),
            title: pos.title || '',
            start_work_time: pos.start_work_time || '',
            end_work_time: pos.end_work_time || '',
            job_description: pos.job_description || null,
            job_level: pos.job_level || '',
            department_id: pos.department_id || 0,
            created_at: pos.created_at || '',
            updated_at: pos.updated_at || '',
            employee_count: pos.employee_count || 0
          })));
        }
      }

      showNotification('Position updated successfully', 'success');
      closePositionModal();
    } catch (err: any) {
      console.error('Error updating position:', err);
      showNotification(err.message || 'Failed to update position', 'error');
    } finally {
      setSaveLoading(false);
      setIsPositionEditing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData || !companyId) return;
    
    setSaveLoading(true);
    try {   
      const apiUrl = API_BASE_URL;
      
      const response = await fetch(`${apiUrl}/api/admin/departments/${departmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update department');
      }

      // Update the department state with the updated data
      setDepartment(data.department || formData);
      setIsEditing(false);
      showNotification('Department updated successfully', 'success');
      
    } catch (err: any) {
      console.error('Error updating department:', err);
      showNotification(err.message || 'Failed to update department', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!companyId) {
      showNotification('Company ID is missing', 'error');
      return;
    }
    
    setSaveLoading(true);
    try { 
      const apiUrl = API_BASE_URL;

      const id = departmentId.toString();
      
      const response = await fetch(`${apiUrl}/api/admin/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete department');
      }

      showNotification('Department deleted successfully', 'success');
      router.push(`/companies/${companyId}`);
      
    } catch (err: any) {
      console.error('Error deleting department:', err);
      showNotification(err.message || 'Failed to delete department', 'error');
      setConfirmDelete(false);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeletePosition = async () => {
    if (!deletePositionId) {
      showNotification('Position ID is missing', 'error');
      return;
    }
    
    setSaveLoading(true);
    try { 
      const apiUrl = API_BASE_URL;
      const id = deletePositionId.toString();
      const response = await fetch(`${apiUrl}/api/admin/positions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete position');
      }

      // Remove the deleted position from the positions array
      setPositions(positions.filter(pos => pos.id !== deletePositionId));
      showNotification('Position deleted successfully', 'success');
      
    } catch (err: any) {
      console.error('Error deleting position:', err);
      showNotification(err.message || 'Failed to delete position', 'error');
    } finally {
      setSaveLoading(false);
      setDeletePositionId(null);
      setDeletePositionTitle('');
    }
  };

  const openDeletePositionModal = (position: Position) => {
    setDeletePositionId(position.id);
    setDeletePositionTitle(position.title);
    deletePositionModalRef.current?.showModal();
  };

  // Remove mock data and implement proper data fetching
  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      if (!departmentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Use a reliable default URL - Update this to match your actual API endpoint
        const apiUrl = API_BASE_URL;
        
        // Fetch department details - trying different endpoint patterns
        // Try the /admin/departments/[id] pattern
        const departmentEndpoint = `${apiUrl}/api/admin/departments/${departmentId}`;
        
        try {
          const departmentResponse = await fetch(departmentEndpoint);
          if (!departmentResponse.ok) {
            console.warn(`Failed to fetch from ${departmentEndpoint}: ${departmentResponse.status}`);
            
            // Try alternative endpoint pattern
            const altEndpoint = `${apiUrl}/api/admin/departments/${departmentId}`;
            
            const altResponse = await fetch(altEndpoint);
            if (!altResponse.ok) {
              throw new Error(`Failed to fetch department details: ${altResponse.status} - Please check the API endpoint URL`);
            }
            
            const departmentData = await altResponse.json();
            handleDepartmentData(departmentData);
          } else {
            const departmentData = await departmentResponse.json();
            handleDepartmentData(departmentData);
          }
        } catch (err) {
          console.error('Error fetching department:', err);
        }
        
      } catch (err: any) {
        console.error('Error fetching department details:', err);
        setError(err.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };
    
    // Helper function to process department data
    const handleDepartmentData = (departmentData: any) => {
      
      // Handle both formats - single object or array of departments
      const deptData = Array.isArray(departmentData) ? departmentData[0] : 
                      departmentData.departments ? departmentData.departments[0] : 
                      departmentData;
      

      if (!deptData) {
        throw new Error('Department data is empty or in unexpected format');
      }
      
      setDepartment(deptData);
      setFormData(deptData);
      
      // Get company ID from department data
      if (deptData?.company_id) {
        const compId = deptData.company_id.toString();
        setCompanyId(compId);
        
        // Fetch company details
        fetchCompanyDetails(compId);
      } else {
        console.error('No company ID found in department data:', deptData);
      }
      
      // Fetch positions and employees
      fetchPositions(departmentId);
      // Comment out fetching employees
      // fetchEmployees(departmentId);
      
      setLoading(false);
    };
    
    // Helper function to fetch company details
    const fetchCompanyDetails = async (companyId: string) => {
      try {
        const apiUrl = API_BASE_URL;
        const companyEndpoint = `${apiUrl}/api/companies/${companyId}`;
        
        const companyResponse = await fetch(companyEndpoint);
        if (!companyResponse.ok) {
          console.warn(`Failed to fetch company details: ${companyResponse.status}`);
          return;
        }
        
        const companyData = await companyResponse.json();
        setCompany(companyData);
      } catch (err) {
        console.warn('Error fetching company details:', err);
      }
    };
    
    // Helper function to fetch positions
    const fetchPositions = async (departmentId: string) => {
      try {
        const apiUrl = API_BASE_URL;
        const id = departmentId.toString();
        const positionsEndpoint = `${apiUrl}/api/admin/departments/${id}/positions`;
        
        const positionsResponse = await fetch(positionsEndpoint);
        if (positionsResponse.ok) {
          const positionsData = await positionsResponse.json();
          setPositions(positionsData.positions);
        } else {
          console.warn('Failed to fetch positions:', await positionsResponse.text());
        }
      } catch (posErr) {
        console.warn('Error fetching positions:', posErr);
      }
    };
    
    // Comment out the employee fetching function
    /*
    // Helper function to fetch employees
    const fetchEmployees = async (departmentId: string) => {
      try {
        const employeesEndpoint = `${rootApi}/api/admin/departments/${departmentId}/employees`;
        
        const employeesResponse = await fetch(employeesEndpoint);
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
        } else {
          console.warn('Failed to fetch employees:', await employeesResponse.text());
        }
      } catch (empErr) {
        console.warn('Error fetching employees:', empErr);
      }
    };
    */
    
    fetchDepartmentDetails();
  }, [departmentId]);

  useEffect(() => {
    // Function to fetch employees for a specific position
    const fetchPositionEmployees = async (positionId: number) => {
      if (!positionId || positionId === 0) return;
      
      try {
        setLoadingPositionEmployees(true);
        const apiUrl = API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/admin/employees?position_id=${positionId}&department_id=${departmentId}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching employees: ${response.status}`);
        }
        
        const data = await response.json();
        setPositionEmployees(Array.isArray(data) ? data : data.employees || []);
      } catch (err: any) {
        console.error('Error fetching position employees:', err);
        showNotification(`Failed to load employees: ${err.message}`, 'error');
      } finally {
        setLoadingPositionEmployees(false);
      }
    };

    // Fetch employees when editPositionId changes
    if (editPositionId && editPositionId > 0) {
      fetchPositionEmployees(editPositionId);
    }
  },[editPositionId, departmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => router.push('/companies')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Companies
        </button>
      </div>
    );
  }

  if (!department || !company) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-gray-500 text-xl mb-4">Department or company not found</div>
        <button 
          onClick={() => router.push('/companies')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Notification using DaisyUI */}
      {notification.show && (
        <div className={`toast toast-middle toast-center z-50`}>
          <div className={`alert ${
            notification.type === 'success' ? 'alert-success' : 
            notification.type === 'error' ? 'alert-error' : 'alert-info'
          }`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <Link href="/companies" className="hover:text-blue-500">Companies</Link>
        <span className="mx-2">/</span>
        <Link href={`/companies/${company.id}`} className="hover:text-blue-500">{company.company_name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-semibold">{department.department_name}</span>
      </div>

      {/* Department Details */}
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg rounded-lg overflow-hidden mb-8`}>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Department Details</h1>
            <div className="flex justify-end space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                    disabled={saveLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => deleteModalRef.current?.showModal()}
                    className={`btn ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                    disabled={saveLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                  <Link 
                    href={`/companies/${company.id}`}
                    className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white flex items-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden sm:inline">Back</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSubmit}
                    className={`btn ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                    disabled={saveLoading}
                  >
                    {saveLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(department);
                    }}
                    className={`btn btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-700'}`}
                    disabled={saveLoading}
                  >
                    Cancel
                  </button>
                  <Link 
                    href={`/companies/${company.id}`}
                    className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white flex items-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Name:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department_name"
                    value={formData?.department_name || ''}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    required
                  />
                ) : (
                  <div className={`p-3 rounded-md min-h-[42px] ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'}`}>
                    {department.department_name}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Description:
                </label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData?.description || ''}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    rows={3}
                  />
                ) : (
                  <div className={`p-3 rounded-md min-h-[80px] ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'}`}>
                    {department.description || 'No description available'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Company:
                </label>
                <div className={`p-3 rounded-md min-h-[42px] ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'}`}>
                  {company.company_name}
                </div>
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Status:
                </label>
                {isEditing ? (
                  <select
                    name="is_active"
                    value={formData?.is_active ? '1' : '0'}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-400'} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                ) : (
                  <div className={`p-3 rounded-md min-h-[42px] ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      department.is_active 
                        ? `${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/20 text-green-400'}` 
                        : `${theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900/20 text-red-400'}`
                    }`}>
                      {department.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Section */}
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg overflow-hidden mb-8`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              Positions ({positions.length})
            </h2>
            <button
              onClick={() => openPositionModal({
                id: 0,
                title: '',
                start_work_time: '09:00',
                end_work_time: '17:00',
                job_description: null,
                job_level: 'Junior',
                department_id: parseInt(departmentId),
                created_at: '',
                updated_at: '',
                employee_count: 0
              })}
              className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Position
            </button>
          </div>

          {positions.length > 0 ? (
            <>
              <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
                <table className="table w-full">
                  <thead>
                    <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                      <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Position Title</th>
                      <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Work Hours</th>
                      <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Job Level</th>
                      <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employees</th>
                      <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position, index) => (
                      <tr 
                        key={position.id} 
                        className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== positions.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                      >
                        <td className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {position.title}
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {position.start_work_time} - {position.end_work_time}
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            position.job_level.toLowerCase() === 'senior' 
                              ? `${theme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900/20 text-purple-400'}` :
                            position.job_level.toLowerCase() === 'mid' 
                              ? `${theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/20 text-blue-400'}` :
                            position.job_level.toLowerCase() === 'junior' 
                              ? `${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/20 text-green-400'}` :
                            position.job_level.toLowerCase() === 'manager' 
                              ? `${theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900/20 text-red-400'}` :
                              `${theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-slate-700 text-slate-300'}`
                          }`}>
                            {position.job_level.charAt(0).toUpperCase() + position.job_level.slice(1)}
                          </span>
                        </td>
                        <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          <button
                            type="button"
                            onClick={() => openEmployeesModal(position)}
                            className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'} underline cursor-pointer font-medium`}
                          >
                            {position.employee_count || 0} employee{(position.employee_count || 0) !== 1 ? 's' : ''}
                          </button>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                              onClick={() => openPositionModal({
                                id: position.id,
                                title: position.title || '',
                                start_work_time: position.start_work_time || '',
                                end_work_time: position.end_work_time || '',
                                job_description: position.job_description || null,
                                job_level: position.job_level || '',
                                department_id: position.department_id || 0,
                                created_at: position.created_at || '',
                                updated_at: position.updated_at || '',
                                employee_count: position.employee_count || 0
                              })}
                            >
                              Edit
                            </button>
                            <button 
                              className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                              onClick={() => openDeletePositionModal(position)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Results Counter */}
              <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Showing all {positions.length} position{positions.length !== 1 ? 's' : ''}
              </div>

              {/* Pagination - placeholder for future implementation */}
              {positions.length > 10 && (
                <div className="flex justify-center mt-6">
                  <div className="btn-group">
                    <button 
                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                      disabled
                    >
                      «
                    </button>
                    <button 
                      className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}`}
                    >
                      1
                    </button>
                    <button 
                      className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                      disabled
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294A7.43 7.43 0 0116 6z" />
              </svg>
              <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>No positions found</h3>
              <p className={`mt-1 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                No positions have been added to this department yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Employees Section */}
      {/* 
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Employees</h2>
          </div>

          {employees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => {
                    const position = positions.find(p => p.id === employee.position_id);
                    return (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {position ? position.title : 'Unknown Position'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href={`/employees/${employee.id}`} className="text-blue-600 hover:text-blue-900">
                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No employees are assigned to this department yet.
            </div>
          )}
        </div>
      </div>
      */}

      {/* Delete Confirmation Modal */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete the department "{department.department_name}"? 
            This action cannot be undone and will remove all positions associated with this department.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">Cancel</button>
              <button 
                className="btn btn-error" 
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                  deleteModalRef.current?.close();
                }}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Add/Edit Position Modal - Using DaisyUI */}
      <dialog id="position_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {isPositionEditing ? 'Edit Position' : 'Add New Position'}
          </h3>
            <form onSubmit={isPositionEditing ? handleUpdatePosition : handleAddPosition}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                className="input input-bordered w-full"
                  value={positionForm.title}
                  onChange={handlePositionChange}
                  required
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Start Time (Working Hours)</span>
                </label>
                <input
                  type="time"
                  name="start_work_time"
                  className="input input-bordered w-full"
                  value={positionForm.start_work_time}
                  onChange={handlePositionChange}
                  required
                />
              </div>
                
              <div className="form-control">
                <label className="label">
                  <span className="label-text">End Time (Working Hours)</span>
                  </label>
                  <input
                    type="time"
                    name="end_work_time"
                  className="input input-bordered w-full"
                    value={positionForm.end_work_time}
                    onChange={handlePositionChange}
                    required
                  />
                </div>
              </div>
              
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Job Level</span>
                </label>
                <select
                  name="job_level"
                className="select select-bordered w-full"
                  value={positionForm.job_level}
                  onChange={handlePositionChange}
                  required
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                <option value="Manager">Manager</option>
                </select>
              </div>
              
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Job Description</span>
                </label>
                <textarea
                  name="job_description"
                className="textarea textarea-bordered w-full"
                  rows={3}
                  value={positionForm.job_description || ''}
                  onChange={handlePositionChange}
              ></textarea>
              </div>
              
            <div className="modal-action">
                <button
                  type="button"
                className="btn btn-outline"
                  onClick={closePositionModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                className="btn btn-primary"
                  disabled={saveLoading}
                >
                {saveLoading ? 
                  <span className="loading loading-spinner loading-sm"></span> : 
                  isPositionEditing ? 'Update Position' : 'Add Position'
                }
                </button>
              </div>
            </form>
          </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Employees Modal */}
        <dialog id="employees_modal" className="modal">
          <div className={`modal-box w-11/12 max-w-5xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <h3 className={`font-bold text-xl mb-6 flex items-center gap-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              Employees for {selectedPosition?.title} ({positionEmployees.length})
            </h3>
            {loadingPositionEmployees ? (
              <div className="flex justify-center items-center py-8">
                <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
              </div>
            ) : positionEmployees.length > 0 ? (
              <>
                <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
                  <table className="table w-full">
                    <thead>
                      <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                        <th className={`w-16 ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>No</th>
                        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee Name</th>
                        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee No</th>
                        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Email</th>
                        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Phone</th>
                        <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                        <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positionEmployees.map((employee, index) => (
                        <tr 
                          key={employee.id} 
                          className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== positionEmployees.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                        >
                          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{index + 1}</td>
                          <td className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.name}</td>
                          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.employee_no || '-'}</td>
                          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.email}</td>
                          <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.phone || '-'}</td>
                          <td>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              employee.status?.toLowerCase() === 'active' 
                                ? `${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/20 text-green-400'}` 
                                : `${theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900/20 text-red-400'}`
                            }`}>
                              {employee.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="text-center">
                            <Link 
                              href={`/employees/${employee.id}`} 
                              className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Results Counter */}
                <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Showing all {positionEmployees.length} employee{positionEmployees.length !== 1 ? 's' : ''}
                </div>

                {/* Pagination - placeholder for future implementation */}
                {positionEmployees.length > 10 && (
                  <div className="flex justify-center mt-6">
                    <div className="btn-group">
                      <button 
                        className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                        disabled
                      >
                        «
                      </button>
                      <button 
                        className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}`}
                      >
                        1
                      </button>
                      <button 
                        className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                        disabled
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>No employees found</h3>
                <p className={`mt-1 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  No employees found for this position.
                </p>
              </div>
            )}
            <div className="modal-action">
              <button
                type="button"
                className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                onClick={closeEmployeesModal}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>

      {/* Delete Position Confirmation Modal */}
      <dialog ref={deletePositionModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Position Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete the position "{deletePositionTitle}"? 
            This action cannot be undone.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">Cancel</button>
              <button 
                className="btn btn-error" 
                onClick={(e) => {
                  e.preventDefault();
                  handleDeletePosition();
                  deletePositionModalRef.current?.close();
                }}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default DepartmentDetails;
