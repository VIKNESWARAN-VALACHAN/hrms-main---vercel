'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import BulkTransfer from './bulkTransfer';
import { useTheme } from '../components/ThemeProvider';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department_id: string;
  company_id: string;
  status: string;
  activation: string;
  joined_date: string;
  employee_no: string;
  employment_type: string;
  gender: string;
  role: string;
  race: string | null;
  religion: string | null;
  job_level: string | null;
  department_name?: string;
  passport_expired_date?: string;
  visa_expired_date?: string;
  nationality?: string;
}

interface BulkResetResult {
  id: string;
  name: string;
  email: string | null;
  tempPassword: string;
  success: boolean;
  error?: string;
}

export default function ManageEmployees() {
  const { theme } = useTheme();

  const [bulkDone, setBulkDone] = useState(0);

  const TOAST_ROOT_ID = 'hrms-toast-root';
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTempPasswordModal, setShowTempPasswordModal] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [bulkResetMode, setBulkResetMode] = useState(false);
  const [showBulkResetConfirm, setShowBulkResetConfirm] = useState(false);
  const [bulkResetResults, setBulkResetResults] = useState<BulkResetResult[]>([]);
  const [showBulkResetResults, setShowBulkResetResults] = useState(false);
  const [bulkResetting, setBulkResetting] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkTransferMode, setIsBulkTransferMode] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showBulkTransferModal, setShowBulkTransferModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee | null;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending'
  });
  const [filters, setFilters] = useState({
    department_id: '',
    position: '',
    type: '',
    nationality: '',
    jobLevel: '',
    company_id: '',
    documentExpiry: '' 
  });
  const [companies, setCompanies] = useState<{id: string; name: string}[]>([]);
  const [departments, setDepartments] = useState<{id: string; department_name: string}[]>([]);
  const [allDepartments, setAllDepartments] = useState<{id: string; department_name: string}[]>([]);
  const [resettingEmployee, setResettingEmployee] = useState<Employee | null>(null);


const showNotification = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  durationMs = 3000
) => {
  // Inline icon + class config
  const config: Record<'success' | 'error' | 'warning' | 'info', { alertClass: string; icon: string }> = {
    success: {
      alertClass: 'alert-success',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    error: {
      alertClass: 'alert-error',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    warning: {
      alertClass: 'alert-warning',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.334 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>`
    },
    info: {
      alertClass: 'alert-info',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    }
  };

  // Single centered root above modals
  const ROOT_ID = 'hrms-toast-root';
  let root = document.getElementById(ROOT_ID) as HTMLDivElement | null;
  if (!root) {
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'toast toast-center toast-middle fixed z-[10000] pointer-events-none gap-2';
    document.body.appendChild(root);
  }

  const { alertClass, icon } = config[type] ?? config.info;

  // Alert node (no X button)
  const alert = document.createElement('div');
  alert.className = `alert ${alertClass} shadow rounded-lg pointer-events-auto`;
  alert.setAttribute('role', 'status');
  alert.setAttribute('aria-live', 'polite');

  const row = document.createElement('div');
  row.className = 'flex items-center gap-2';

  const iconWrap = document.createElement('span');
  iconWrap.innerHTML = icon;
  row.appendChild(iconWrap);

  const msg = document.createElement('span');
  msg.textContent = message;
  row.appendChild(msg);

  alert.appendChild(row);
  root.appendChild(alert);

  // Remove helper
  const remove = () => {
    try {
      if (root && alert.parentElement === root) root.removeChild(alert);
      if (root && root.childElementCount === 0) root.remove();
    } catch { /* noop */ }
  };

  // Auto-dismiss + hover-to-pause; click-to-dismiss early
  let timer = window.setTimeout(remove, durationMs);
  alert.addEventListener('mouseenter', () => window.clearTimeout(timer));
  alert.addEventListener('mouseleave', () => (timer = window.setTimeout(remove, 800)));
  alert.addEventListener('click', remove);
};



  const handleResetPassword = async () => {
     if (!resettingEmployee) return;
  
  // Store the employee data before resetting
  const currentEmployee = { ...resettingEmployee };
  
  setResetting(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/employees/${resettingEmployee.id}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
    
    const data = await response.json();
    setTempPassword(data.tempPassword);
    setShowResetConfirm(false);
    setShowTempPasswordModal(true);
    
    // Use the stored employee data instead of resettingEmployee which might be null
/*     if (sendEmail && currentEmployee.email) {
      handleSendTempPasswordEmail(data.tempPassword, currentEmployee);
    } */
    } catch (error) {
      console.error('Error resetting password:', error);
      showNotification('Failed to reset password', 'error');
    } finally {
      setResetting(false);
      //setResettingEmployee(null);
    }
  };

  const handleSendTempPasswordEmail = async (password: string, employee: Employee) => {
    if (!employee.email) {
      showNotification('No email address available for this employee', 'warning');
      return;
    }
    
    setEmailSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
        to: employee.email,
        employeeName: employee.name,
        tempPassword: password,
        companyName : employee.company_id
      }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      showNotification('Temporary password sent to employee email', 'success');
    } catch (error) {
      console.error('Error sending email:', error);
      showNotification('Failed to send email', 'error');
    } finally {
      setEmailSending(false);
    }
  };


  const handleBulkResetPassword1 = async () => {
  if (selectedEmployees.length === 0) return;

  setBulkResetting(true);
  setShowBulkResetConfirm(false);

  const results: BulkResetResult[] = [];
  const emailResults: Array<{name:string; email:string|null; success:boolean; error?:string}> = [];

  for (const employeeId of selectedEmployees) {
    const employee = allEmployees.find(emp => emp.id === employeeId);
    if (!employee) continue;

    try {
      // 1) RESET PASSWORD (generate temp password)
      const resetRes = await fetch(
        `${API_BASE_URL}/api/admin/employees/${employeeId}/reset-password`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );

      if (!resetRes.ok) throw new Error('Failed to reset password');
      const data = await resetRes.json(); // -> { tempPassword: "..." }

      results.push({
        id: employeeId,
        name: employee.name,
        email: employee.email || null,
        tempPassword: data.tempPassword,
        success: true,
      });

      // 2) (optional) SEND EMAIL
      if (sendEmail && employee.email) {
        try {
          // if you want company name, resolve it; otherwise keep id
          const companyName = companies.find(c => c.id === employee.company_id)?.name || employee.company_id;

          const emailRes = await fetch(`${API_BASE_URL}/api/notifications/password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: employee.email,
              employeeName: employee.name,
              tempPassword: data.tempPassword,
              companyName,
            }),
          });

          if (!emailRes.ok) throw new Error(await emailRes.text().catch(() => 'Failed to send email'));

          emailResults.push({ name: employee.name, email: employee.email, success: true });
        } catch (emailError: any) {
          console.error(`Error sending email to ${employee.email}:`, emailError);
          emailResults.push({
            name: employee.name,
            email: employee.email,
            success: false,
            error: emailError?.message || 'Failed to send email',
          });
        }
      } else if (sendEmail && !employee.email) {
        emailResults.push({ name: employee.name, email: null, success: false, error: 'No email address available' });
      }

    } catch (error: any) {
      console.error(`Error resetting password for ${employee?.name}:`, error);
      results.push({
        id: employeeId,
        name: employee?.name || employeeId,
        email: employee?.email || null,
        tempPassword: '',
        success: false,
        error: error?.message || 'Unknown error',
      });
    }
  }

  setBulkResetResults(results);

  // Summary toast
  if (sendEmail) {
    const ok = emailResults.filter(r => r.success).length;
    const fail = emailResults.filter(r => !r.success && r.email).length;
    const none = emailResults.filter(r => !r.success && !r.email).length;

    let msg = '';
    if (ok) msg += `Emails sent to ${ok} employee(s). `;
    if (fail) msg += `Failed to send emails to ${fail} employee(s). `;
    if (none) msg += `${none} employee(s) have no email address.`;
    if (msg) showNotification(msg, ok ? 'info' : 'warning');
  }

  setShowBulkResetResults(true);
  setBulkResetting(false);
  setBulkResetMode(false);
  setSelectedEmployees([]);
};

const handleBulkResetPassword = async () => {
  if (selectedEmployees.length === 0) return;

  setBulkDone(0);
  setBulkResetting(true);
  setShowBulkResetConfirm(false);

  const results: BulkResetResult[] = [];
  const emailResults: Array<{name: string; email: string | null; success: boolean; error?: string}> = [];

  for (const employeeId of selectedEmployees) {
    const employee = allEmployees.find(emp => emp.id === employeeId);
    if (!employee) { setBulkDone(d => d + 1); continue; }

    try {
      // 1) generate temp password
      const resetRes = await fetch(
        `${API_BASE_URL}/api/admin/employees/${employeeId}/reset-password`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      if (!resetRes.ok) throw new Error('Failed to reset password');

      const data = await resetRes.json(); // { tempPassword }

      results.push({
        id: employeeId,
        name: employee.name,
        email: employee.email || null,
        tempPassword: data.tempPassword,
        success: true,
      });

      // 2) optionally email it
      if (sendEmail && employee.email) {
        try {
          const companyName = companies.find(c => c.id === employee.company_id)?.name || employee.company_id;
          const emailRes = await fetch(`${API_BASE_URL}/api/notifications/password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: employee.email,
              employeeName: employee.name,
              tempPassword: data.tempPassword,
              companyName,
            }),
          });
          if (!emailRes.ok) throw new Error(await emailRes.text().catch(() => 'Failed to send email'));
          emailResults.push({ name: employee.name, email: employee.email, success: true });
        } catch (emailError: any) {
          emailResults.push({
            name: employee.name,
            email: employee.email,
            success: false,
            error: emailError?.message || 'Failed to send email',
          });
        }
      } else if (sendEmail && !employee.email) {
        emailResults.push({ name: employee.name, email: null, success: false, error: 'No email address available' });
      }
    } catch (error: any) {
      results.push({
        id: employeeId,
        name: employee?.name || employeeId,
        email: employee?.email || null,
        tempPassword: '',
        success: false,
        error: error?.message || 'Unknown error',
      });
    } finally {
      setBulkDone(d => d + 1); // ✅ progress tick
    }
  }

  setBulkResetResults(results);

  if (sendEmail) {
    const ok = emailResults.filter(r => r.success).length;
    const fail = emailResults.filter(r => !r.success && r.email).length;
    const none = emailResults.filter(r => !r.success && !r.email).length;

    let msg = '';
    if (ok) msg += `Emails sent to ${ok} employee(s). `;
    if (fail) msg += `Failed to send emails to ${fail} employee(s). `;
    if (none) msg += `${none} employee(s) have no email address.`;
    if (msg) showNotification(msg, ok ? 'info' : 'warning');
  }

  setShowBulkResetResults(true);
  setBulkResetting(false); // ✅ hide overlay
  setBulkResetMode(false);
  setSelectedEmployees([]);
  setBulkDone(0);
};



  const startBulkReset = () => {
    if (selectedEmployees.length === 0) {
      showNotification('Please select at least one employee for password reset', 'warning');
      return;
    }
    
    const inactiveEmployees = selectedEmployees.filter(id => {
      const emp = allEmployees.find(e => e.id === id);
      return emp && emp.status !== 'active';
    });
    
    if (inactiveEmployees.length > 0) {
      showNotification('Cannot reset passwords for inactive employees', 'warning');
      return;
    }
    
    setShowBulkResetConfirm(true);
  };

  const cancelBulkReset = () => {
    setBulkResetMode(false);
    setSelectedEmployees([]);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
    
    if (name === 'company_id') {
      setFilters(prev => ({ ...prev, [name]: value, department_id: '', position: '' }));
    }
    
    if (name === 'department_id') {
      setFilters(prev => ({ ...prev, [name]: value, position: '' }));
    }
  };

  const resetFilters = () => {
    setFilters({
      department_id: '',
      position: '',
      type: '',
      nationality: '',
      jobLevel: '',
      company_id: '',
      documentExpiry: '' 
    });
    setFilterStatus('active');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const fetchAllEmployees = useCallback(async () => {
    try {
      setLoading(true);
      
      let queryParams = new URLSearchParams();
      
      if (user?.role === 'manager') {
        queryParams.append('manager_id', user.id);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/api/admin/employees${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const mappedEmployees = data.filter((emp: any) => emp.role !== 'admin').map((emp: any) => {
        return {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          position: emp.position || '',
          department_id: emp.department_id || '',
          company_id: emp.company_id || '',
          status: emp.status?.toLowerCase() || 'active',
          activation: emp.activation || 'Activated',
          joined_date: emp.joined_date || '',
          employee_no: emp.employee_no || '',
          employment_type: emp.employment_type || '',
          gender: emp.gender || '',
          role: emp.role || 'employee',
          race: emp.race || null,
          religion: emp.religion || null,
          job_level: emp.job_level || null,
          department_name: emp.department_name || null,
          passport_expired_date: emp.passport_expired_date || '',
          visa_expired_date: emp.visa_expired_date || '',
          nationality: emp.nationality || '',
        };
      });
      
      setAllEmployees(mappedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchAllEmployees();
    }
    
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/companies`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    
    const fetchAllDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/departments`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAllDepartments(data);
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    
    fetchCompanies();
    fetchAllDepartments();
  }, [user, fetchAllEmployees]);

  useEffect(() => {
    const userStr = localStorage.getItem('hrms_user');
    const isAuthenticated = localStorage.getItem('hrms_authenticated');

    if (!userStr || isAuthenticated !== 'true') {
      router.push('/auth/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (e) {
      console.error('Error parsing user data');
      router.push('/auth/login');
    }
  }, [router]);

  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(employee => {
      // const matchesSearch = !searchTerm || (
      //   employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   employee.employee_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (departments.find(d => d.id === employee.department_id)?.department_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (companies.find(c => c.id === employee.company_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      // );
      const s = searchTerm.toLowerCase();
      const matchesSearch = !s || (
        (employee.name || '').toLowerCase().includes(s) ||
        (employee.email || '').toLowerCase().includes(s) ||
        (employee.employee_no || '').toLowerCase().includes(s) ||
        (employee.position || '').toLowerCase().includes(s) ||
        ((departments.find(d => d.id === employee.department_id)?.department_name) || '').toLowerCase().includes(s) ||
        ((companies.find(c => c.id === employee.company_id)?.name) || '').toLowerCase().includes(s)
      );

      
      const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
      const matchesCompany = !filters.company_id || employee.company_id === filters.company_id;
      const matchesDepartment = !filters.department_id || employee.department_id === filters.department_id;
      const matchesPosition = !filters.position || employee.position === filters.position;
      const matchesEmploymentType = !filters.type || employee.employment_type === filters.type;
      const matchesNationality = !filters.nationality || employee.nationality === filters.nationality;
      const matchesJobLevel = !filters.jobLevel || employee.job_level === filters.jobLevel;
      
      const matchesDocumentFilter = () => {
        if (!filters.documentExpiry) return true;
        
        const today = new Date();
        const soon = new Date();
        soon.setDate(today.getDate() + 30);
        
        const passportExpiry = (employee.passport_expired_date && employee.passport_expired_date.trim()) 
          ? new Date(employee.passport_expired_date) : null;
        const visaExpiry = (employee.visa_expired_date && employee.visa_expired_date.trim()) 
          ? new Date(employee.visa_expired_date) : null;
        
        switch(filters.documentExpiry) {
          case 'passport_expired':
            return passportExpiry !== null && passportExpiry < today;
          case 'visa_expired':
            return visaExpiry !== null && visaExpiry < today;
          case 'passport_expiring_soon':
            return passportExpiry !== null && passportExpiry >= today && passportExpiry <= soon;
          case 'visa_expiring_soon':
            return visaExpiry !== null && visaExpiry >= today && visaExpiry <= soon;
          case 'any_expiring_soon':
            return (passportExpiry !== null && passportExpiry >= today && passportExpiry <= soon) || 
                  (visaExpiry !== null && visaExpiry >= today && visaExpiry <= soon);
          case 'any_expired':
            return (passportExpiry !== null && passportExpiry < today) || 
                  (visaExpiry !== null && visaExpiry < today);
          default:
            return true;
        }
      };
      
      return matchesSearch && matchesStatus && matchesCompany && matchesDepartment && 
             matchesPosition && matchesEmploymentType && matchesNationality && 
             matchesJobLevel && matchesDocumentFilter();
    });
  }, [allEmployees, searchTerm, filterStatus, filters, departments, companies]);

  const filterOptions = useMemo(() => {
    return {
      departments: [...new Set(allEmployees.map(emp => emp.department_id).filter(Boolean))],
      positions: [...new Set(allEmployees.map(emp => emp.position).filter(Boolean))],
      employmentTypes: [...new Set(allEmployees.map(emp => emp.employment_type).filter(Boolean))],
      nationalities: [...new Set(allEmployees.map(emp => emp.nationality).filter(Boolean))],
      companies: [...new Set(allEmployees.map(emp => emp.company_id).filter(Boolean))],
      jobLevels: [...new Set(allEmployees.map(emp => emp.job_level).filter(Boolean))]
    };
  }, [allEmployees]);

  const availablePositions = useMemo(() => {
    let filteredEmployees = allEmployees;
    
    if (filters.company_id) {
      filteredEmployees = filteredEmployees.filter(emp => emp.company_id === filters.company_id);
    }
    
    if (filters.department_id) {
      filteredEmployees = filteredEmployees.filter(emp => emp.department_id === filters.department_id);
    }
    
    return [...new Set(filteredEmployees.map(emp => emp.position).filter(Boolean))];
  }, [allEmployees, filters.company_id, filters.department_id]);

  const availableDepartments = useMemo(() => {
    if (!filters.company_id) {
      return allDepartments;
    }
    
    const companyEmployees = allEmployees.filter(emp => emp.company_id === filters.company_id);
    const departmentIds = [...new Set(companyEmployees.map(emp => emp.department_id).filter(Boolean))];
    
    return allDepartments.filter(dept => departmentIds.includes(dept.id));
  }, [allEmployees, filters.company_id, allDepartments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filters]);

  const handleSort = (key: keyof Employee) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    let newKey: keyof Employee | null = key;
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else {
        newKey = 'id';
      }
    }
    
    setSortConfig({ key: newKey, direction });
  };
  
  const getSortIcon = (key: keyof Employee) => {
    if (sortConfig.key !== key) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === 'ascending') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const sortedEmployees = useMemo(() => {
    if (!sortConfig.key) return filteredEmployees;
    
    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Employee] || '';
      const bValue = b[sortConfig.key as keyof Employee] || '';
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'ascending' 
        ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
        : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
    });
  }, [filteredEmployees, sortConfig.key, sortConfig.direction]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;
    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const goToPage = (pageNumber: number) => {
    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleStatusChange = async (employeeId: string, newStatus: string) => {
    try {
      setAllEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );
    } catch (error) {
      console.error('Error updating employee status:', error);
      alert('An error occurred while updating the employee status');
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    
    try {
      setAllEmployees(prevEmployees => 
        prevEmployees.filter(emp => emp.id !== employeeId)
      );
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('An error occurred while deleting the employee');
    }
  };

  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleSelectAllEmployees = () => {
    const selectableEmployees = sortedEmployees
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .filter(emp => emp.status === 'active')
      .map(emp => emp.id);
    
    if (selectableEmployees.every(id => selectedEmployees.includes(id))) {
      setSelectedEmployees(prev => prev.filter(id => !selectableEmployees.includes(id)));
    } else {
      setSelectedEmployees(prev => [...new Set([...prev, ...selectableEmployees])]);
    }
  };

  const startBulkTransfer = () => {
    if (user?.role !== 'admin') {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Unauthorized: Only admin users can transfer employees.</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
      return;
    }
    
    if (selectedEmployees.length === 0) {
      const warningMsg = document.createElement('div');
      warningMsg.className = 'toast toast-middle toast-center';
      warningMsg.innerHTML = `
        <div class="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Please select at least one employee for transfer.</span>
        </div>
      `;
      document.body.appendChild(warningMsg);
      setTimeout(() => {
        document.body.removeChild(warningMsg);
      }, 3000);
      return;
    }
    
    setShowBulkTransferModal(true);
  };

  const cancelBulkTransfer = () => {
    setIsBulkTransferMode(false);
    setSelectedEmployees([]);
  };

  const closeBulkTransferModal = () => {
    setShowBulkTransferModal(false);
  };

  const renderEmployeeTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <span className={`loading loading-spinner loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></span>
        </div>
      );
    }

    if (!sortedEmployees.length) {
      return (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>No employees found</h3>
          <p className={`mt-1 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      );
    }

    const isManager = user?.role === 'manager';
    const isAdmin = user?.role === 'admin';
    const currentPageEmployees = sortedEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <>
        {isManager && (
          <div className={`alert mb-4 ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900 border-blue-700 text-blue-200'} border rounded-lg`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>You are viewing employees as a manager. Only employees assigned under your management are shown here.</span>
          </div>
        )}
        
        {(isAdmin && (isBulkTransferMode || bulkResetMode)) && (
          <div className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'} p-3 rounded-lg mb-4 flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{selectedEmployees.length} employee(s) selected</span>
            </div>
          </div>
        )}
        
        <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
          <table className="table w-full">
            <thead>
              <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                {isAdmin && (isBulkTransferMode || bulkResetMode) && (
                  <th className="w-10">
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={currentPageEmployees.filter(emp => emp.status === 'active').length > 0 && 
                               currentPageEmployees.filter(emp => emp.status === 'active').every(emp => selectedEmployees.includes(emp.id))}
                      onChange={handleSelectAllEmployees}
                    />
                  </th>
                )}
                <th className={`w-36 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('employee_no')}>
                  Employee No {getSortIcon('employee_no')}
                </th>
                <th className={`w-48 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th className={`w-44 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('company_id')}>
                  Company {getSortIcon('company_id')}
                </th>
                <th className={`w-44 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('department_id')}>
                  Department {getSortIcon('department_id')}
                </th>
                <th className={`w-44 cursor-pointer ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`} onClick={() => handleSort('position')}>
                  Position {getSortIcon('position')}
                </th>
                <th className={`w-28 ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                <th className={`w-24 text-right ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageEmployees.map((employee, index) => {
                const isSelectable = employee.status === 'active';
                
                return (
                  <tr 
                    key={employee.id} 
                    className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentPageEmployees.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''} ${!isSelectable && isAdmin && (isBulkTransferMode || bulkResetMode) ? 'opacity-60' : ''}`}
                  >
                    {isAdmin && (isBulkTransferMode || bulkResetMode) && (
                      <td>
                        <input 
                          type="checkbox" 
                          className="checkbox" 
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => isSelectable && handleEmployeeSelection(employee.id)}
                          disabled={!isSelectable}
                        />
                      </td>
                    )}
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.employee_no}</td>
                    <td className={`font-medium ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.name}</td>
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{companies.find(c => c.id === employee.company_id)?.name || employee.company_id || '-'}</td>
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.department_name || employee.department_id || '-'}</td>
                    <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>{employee.position || '-'}</td>
                    <td>
                      <div className={`${employee.status === 'active' ? 'text-green-500' : 
                        employee.status === 'inactive' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {employee.status === 'active' ? 'Active' : 
                         employee.status === 'inactive' ? 'Inactive' : 'Resigned'}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex gap-1 justify-end">
                        {user?.role === 'admin' && employee?.status.toLowerCase() === 'active' && (
                          <button
                            type="button"
                            title="Reset password"
                            aria-label="Reset password"
                            className={`btn btn-sm btn-circle btn-outline transition-colors ${
                              theme === 'light'
                                ? 'border-blue-600 text-blue-600 hover:bg-slate-600 hover:text-white hover:border-slate-600'
                                : 'border-blue-400 text-blue-400 hover:bg-slate-400 hover:text-white hover:border-slate-400'
                            }`}
                            onClick={() => {
                              setResettingEmployee({
                                id: employee.id,
                                name: employee.name,
                                email: employee.email,
                                position: employee.position,
                                department_id: employee.department_id,
                                company_id: employee.company_id,
                                status: employee.status,
                                activation: employee.activation,
                                joined_date: employee.joined_date,
                                employee_no: employee.employee_no,
                                employment_type: employee.employment_type,
                                gender: employee.gender,
                                role: employee.role,
                                race: employee.race,
                                religion: employee.religion,
                                job_level: employee.job_level,
                                department_name: employee.department_name,
                                passport_expired_date: employee.passport_expired_date,
                                visa_expired_date: employee.visa_expired_date,
                                nationality: employee.nationality
                              });
                              setShowResetConfirm(true);
                            }}
                            disabled={resetting && resettingEmployee?.id === employee.id}
                          >
                            {resetting && resettingEmployee?.id === employee.id ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {/* lock icon */}
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2m10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            )}
                          </button>
                        )}
                        <Link 
                          href={`/employees/${employee.id}`} 
                          className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className={`container mx-auto p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {user?.role === 'manager' ? 'My Team' : 'Manage Employees'}
        </h1>
        
        <div className="flex gap-2 w-full sm:w-auto justify-start md:justify-end flex-row md:flex-col lg:flex-row">
          {user?.role === 'admin' && (
            <>
              {!isBulkTransferMode && !bulkResetMode ? (
                <>
                  <button
                      className={`btn btn-outline transition-colors ${
                      theme === 'light'
                        ? 'border-blue-600 text-blue-600 hover:bg-slate-600 hover:text-white hover:border-slate-600'
                        : 'border-blue-400 text-blue-400 hover:bg-slate-400 hover:text-white hover:border-slate-400'
                    }`}
                    onClick={() => setIsBulkTransferMode(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Bulk Transfer
                  </button>
<button
  className={`btn btn-outline transition-colors ${
    theme === 'light'
      ? 'border-blue-600 text-blue-600 hover:bg-slate-600 hover:text-white hover:border-slate-600'
      : 'border-blue-400 text-blue-400 hover:bg-slate-400 hover:text-white hover:border-slate-400'
  }`}
  onClick={() => setBulkResetMode(true)}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
  Bulk Reset
</button>
                </>
              ) : isBulkTransferMode ? (
                <div className="flex gap-2">
                  <button 
                    className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                    onClick={startBulkTransfer}
                    disabled={selectedEmployees.length === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Transfer Selected
                  </button>
                  <button 
                    className={`btn btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                    onClick={cancelBulkTransfer}
                  >
                    Cancel
                  </button>
                </div>
              ) : bulkResetMode ? (
                <div className="flex gap-2">
                  <button 
                    className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-amber-500'} text-white border-0`}
                    onClick={startBulkReset}
                    disabled={selectedEmployees.length === 0 || bulkResetting}
                  >
                    {bulkResetting ? (
                      <>
                        <span className="loading loading-spinner loading-xs mr-1"></span>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Reset Selected ({selectedEmployees.length})
                      </>
                    )}
                  </button>
                  <button 
                    className={`btn btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                    onClick={cancelBulkReset}
                    disabled={bulkResetting}
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
              {user?.role === 'admin' && (
                <Link href="/employees/add" className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group flex space-x-2">
            <input 
              type="text" 
              placeholder="Search by name, email, employee no, position..." 
              className={`input input-bordered flex-1 ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button
              className={`btn btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters {Object.values(filters).filter(Boolean).length > 0 || filterStatus !== 'active' ? `(${Object.values(filters).filter(Boolean).length + (filterStatus !== 'active' ? 1 : 0)})` : ''}
            </button>
          </div>
        </div>
      </div>
      
      {isFilterOpen && (
        <div className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'} p-4 rounded-lg mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>Advanced Filters</h3>
            <button 
              className={`btn btn-sm btn-ghost ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-700'}`}
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Status</span>
              </label>
              <select 
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="resigned">Resigned</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
              </label>
              <select
                name="company_id"
                value={filters.company_id}
                onChange={handleFilterChange}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Department</span>
              </label>
              <select
                name="department_id"
                value={filters.department_id}
                onChange={handleFilterChange}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              >
                <option value="">All Departments</option>
                {availableDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Position</span>
              </label>
              <select
                name="position"
                value={filters.position}
                onChange={handleFilterChange}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              >
                <option value="">All Positions</option>
                {availablePositions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Employment Type</span>
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              >
                <option value="">All Types</option>
                {filterOptions.employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Nationality</span>
              </label>
              <select
                name="nationality"
                value={filters.nationality}
                onChange={handleFilterChange}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              >
                <option value="">All Nationalities</option>
                {filterOptions.nationalities.map(nationality => (
                  <option key={nationality} value={nationality}>{nationality}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Job Level</span>
              </label>
              <select
                name="jobLevel"
                value={filters.jobLevel}
                onChange={handleFilterChange}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              >
                <option value="">All Job Levels</option>
                {filterOptions.jobLevels.map(level => (
                  <option key={level} value={level || ''}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className={`label-text ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Document Expiry</span>
              </label>
              <select
                name="documentExpiry"
                value={filters.documentExpiry}
                onChange={handleFilterChange}
                className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              >
                <option value="">All Documents</option>
                <option value="passport_expired">Passport Expired</option>
                <option value="visa_expired">Visa Expired</option>
                <option value="passport_expiring_soon">Passport Expiring Soon (30 days)</option>
                <option value="visa_expiring_soon">Visa Expiring Soon (30 days)</option>
                <option value="any_expiring_soon">Any Document Expiring Soon</option>
                <option value="any_expired">Any Document Expired</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className={`mb-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
        {sortedEmployees.length !== allEmployees.length && (
          <span>Showing {sortedEmployees.length} of {allEmployees.length} employees </span>
        )}
        {sortedEmployees.length === allEmployees.length && (
          <span>Showing all {allEmployees.length} employees </span>
        )}
        {(searchTerm || Object.values(filters).some(Boolean) || filterStatus !== 'active') && (
          <span className={`${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
            (filtered)
          </span>
        )}
      </div>
      
      {renderEmployeeTable()}
      
      <div className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedEmployees.length)} of {sortedEmployees.length} employees on this page
      </div>
      
      {Math.ceil(sortedEmployees.length / itemsPerPage) > 1 && (
        <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {getPageNumbers().map(page => (
              <button 
                key={page}
                className={`btn btn-sm ${currentPage === page ? 
                  `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                  `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(sortedEmployees.length / itemsPerPage)}
            >
              »
            </button>
            <button 
              className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
              onClick={() => goToPage(Math.ceil(sortedEmployees.length / itemsPerPage))}
              disabled={currentPage === Math.ceil(sortedEmployees.length / itemsPerPage)}
            >
              Last
            </button>
          </div>
        </div>
      )}

      {user?.role === 'admin' && showBulkTransferModal && (
        <BulkTransfer
          employees={allEmployees}
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          companies={companies}
          fetchEmployees={fetchAllEmployees}
          onClose={() => {
            setShowBulkTransferModal(false);
            setIsBulkTransferMode(false);
            setSelectedEmployees([]);
          }}
        />
      )}

      {showResetConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Reset</h3>
            <p className="py-4">Are you sure you want to reset the employee's password? A new temporary password will be generated and shown.</p>
            <div className="modal-action">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowResetConfirm(false)}
                disabled={resetting}
              >
                Cancel
              </button>
              <button 
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={handleResetPassword}
                disabled={resetting}
              >
                {resetting ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Resetting...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTempPasswordModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-lg p-0 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white p-3 shadow-sm border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 2l-2 2m-7.5 7.5L7 16l1 1-4 4-1-1 4-4-1-1 4.5-4.5M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Temporary Password Created</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Share this temporary password with the employee. They'll be required to change it after first login.
                  </p>

                  {(resettingEmployee?.name || resettingEmployee?.email) && (
                    <div className="mt-3 text-sm text-gray-700 bg-white/50 p-2 rounded-lg">
                      For: <span className="font-medium">{resettingEmployee?.name ?? 'Selected Employee'}</span>
                      {typeof resettingEmployee?.email === 'string' && resettingEmployee.email.trim() ? (
                        <>
                          {' '}· <span className="text-gray-500">Email:</span>{' '}
                          <span className="font-medium">{resettingEmployee.email}</span>
                        </>
                      ) : (
                        ' · No email available'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Password panel */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Temporary Password</label>

                <div className="flex items-stretch rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-indigo-500">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={tempPassword}
                    readOnly
                    className="flex-grow px-4 py-3 font-mono text-lg tracking-widest border-0 focus:ring-0"
                  />
                  <div className="flex">
                    {/* Copy */}
                    <button
                      type="button"
                      aria-label="Copy password"
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 border-l border-gray-300 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(tempPassword)
                          .then(() => showNotification('Copied to clipboard', 'success'))
                          .catch(() => showNotification('Copy failed', 'error'));
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                    {/* Show/Hide */}
                    <button
                      type="button"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 border-l border-gray-300 transition-colors"
                      onClick={() => setShowPw(v => !v)}
                    >
                      {showPw ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.94 10.94 0 0112 20C6.477 20 2 15.523 2 12c0-1.21.39-2.343 1.06-3.34M9.9 4.24A10.94 10.94 0 0112 4c5.523 0 10 4.477 10 8 0 1.21-.39 2.343-1.06 3.34"/>
                          <path d="M1 1l22 22"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  One-time use only; employee must change after login
                </div>
              </div>

              {/* Email delivery */}
              {typeof resettingEmployee?.email === 'string' && resettingEmployee.email.trim() ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 flex-shrink-0"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Email Delivery</h4>
                      <p className="text-xs text-gray-600 mt-1">Send this temporary password to the employee's email address</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Send to: <span className="font-medium text-blue-700">{resettingEmployee.email}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0"
                      disabled={emailSending}
                      onClick={() => handleSendTempPasswordEmail(tempPassword, resettingEmployee!)}
                    >
                      {emailSending ? (
                        <>
                          <span className="loading loading-spinner loading-xs mr-2"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16v16H4z" />
                            <path d="M22 6l-10 7L2 6" />
                          </svg>
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-blue-600-50 border border-amber-200 p-4 mb-6">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v4m0 4h.01" />
                      <path d="M10.29 3.86l-8.18 14.14A2 2 0 003.82 21h16.36a2 2 0 001.71-2.99L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-amber-800">Email unavailable</div>
                      <div className="text-sm text-blue-600 mt-1">No email address is on file for this employee.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-action bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={() => {
                  setShowTempPasswordModal(false);
                  setTempPassword('');
                  setShowPw(false);
                  setSendEmail(true); // keep prior behavior
                  setResettingEmployee(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkResetConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Bulk Password Reset</h3>
            <p className="py-4">
              Are you sure you want to reset passwords for {selectedEmployees.length} employee(s)? 
              New temporary passwords will be generated for each employee.
            </p>
            
            <div className="bg-yellow-50 p-3 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> {selectedEmployees.filter(id => {
                  const emp = allEmployees.find(e => e.id === id);
                  return emp && !emp.email;
                }).length} of the selected employees do not have email addresses.
              </p>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  checked={sendEmail} 
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="checkbox checkbox-sm" 
                />
                <span className="label-text">
                  <strong>Email Delivery</strong><br />
                  Send temporary passwords to employees' email addresses
                  {!sendEmail && <span className="text-sm text-gray-500 block">(Passwords will still be generated)</span>}
                </span>
              </label>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowBulkResetConfirm(false)}
                disabled={bulkResetting}
              >
                Cancel
              </button>
              <button 
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={handleBulkResetPassword}
                disabled={bulkResetting}
              >
                {bulkResetting ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Resetting...
                  </>
                ) : (
                  'Confirm Reset'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkResetResults && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Bulk Password Reset Results</h3>
            
            <div className="mb-4 p-4 bg-base-200 rounded-lg">
              <h4 className="font-semibold mb-2">Summary:</h4>
              <p>
                Successfully reset {bulkResetResults.filter(r => r.success).length} of {bulkResetResults.length} passwords.
                {sendEmail && (
                  <span className="block mt-1">
                    {bulkResetResults.filter(r => r.success && r.email).length} employees received emails.
                  </span>
                )}
              </p>
            </div>
            
            <div className="overflow-x-auto max-h-96">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Temporary Password</th>
                    <th>Email Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkResetResults.map((result) => (
                    <tr key={result.id}>
                      <td>{result.name}</td>
                      <td>{result.email || 'No email'}</td>
                      <td>
                        {result.success ? (
                          <span className="text-green-600">✓ Success</span>
                        ) : (
                          <span className="text-red-600">✗ Failed: {result.error}</span>
                        )}
                      </td>
                      <td className="font-mono">
                        {result.success ? result.tempPassword : '-'}
                      </td>
                      <td>
                        {result.success && sendEmail ? (
                          result.email ? (
                            <span className="text-green-600">✓ Sent</span>
                          ) : (
                            <span className="text-orange-600">No email</span>
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                onClick={() => {
                  setShowBulkResetResults(false);
                  setBulkResetResults([]);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {(resetting || bulkResetting) && (
        <div
          className="fixed inset-0 z-[11000] bg-black/40 backdrop-blur-sm flex items-center justify-center"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={`rounded-xl shadow-xl p-5 ${theme === 'light' ? 'bg-white text-slate-800' : 'bg-slate-800 text-slate-100'}`}>
            <div className="flex items-center gap-4">
              <span className="loading loading-spinner loading-lg" />
              <div>
                <div className="font-semibold">
                  {bulkResetting ? 'Resetting passwords…' : 'Resetting password…'}
                </div>
                {bulkResetting && (
                  <div className="text-sm opacity-70 mt-1">
                    {bulkDone} / {selectedEmployees.length} processed. Please keep this tab open.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    
  );
}