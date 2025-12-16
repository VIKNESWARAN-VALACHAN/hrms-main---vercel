'use client';

import { useState, useEffect , useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import EmployeeDocumentManager, { EmployeeDocument } from '@/app/components/DocumentManager';
import { API_BASE_URL } from '../../config';
import { toast } from 'react-hot-toast';
import { calculateAge } from '@/app/utils/utils';
import ConfirmationModal, { TrainingModal, RecordModal, TrainingRecord, DisciplinaryRecord as ImportedDisciplinaryRecord } from '@/app/components/Modal';
import RecordCard from '@/app/components/Card';
import axios from 'axios';
import { COUNTRY_CODES, NATIONALITIES } from '../../utils/countryData';
import { InputMask } from '@react-input/mask';
import IncrementsTab, { IncrementData } from '@/app/components/payroll/IncrementsTab';
// in app/employees/add/page.tsx
import SingleIncrementTab from '../../components/payroll/SingleIncrementTab';

interface FormData {
  name: string;
  email: string;
  password: string;
  salary: string;
  currency: string;
  company_id: string;
  manager_id: string;
  role: string;
  joined_date: string;
  resigned_date: string;
  confirmation_date: string;
  gender: string;
  employee_no: string;
  employment_type: string;
  job_level: string;
  department: string;
  position: string;
  superior: string;
  office: string;
  nationality: string;
  visa_expired_date: string;
  passport_expired_date: string;
  ic_passport: string;
  marital_status: string;
  dob: string;
  age: string;
  mobile_number: string;
  country_code: string;
  payment_company: string;
  pay_interval: string;
  payment_method: string;
  bank_name: string;
  bank_currency: string;
  bank_account_name: string;
  bank_account_no: string;
  income_tax_no: string;
  socso_account_no: string;
  epf_account_no: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  emergency_contact_email: string;
  race: string;
  religion: string;
  department_id: string;
  position_id: string;
  education_level: string;
  qualification: string;
  benefit_group_id: string; // Add this line
}


// Add interfaces for department and position data
interface Department {
  id: string;
  department_name: string;
  company_id: string;
  is_active: number | boolean;
}

interface Dependent {
  id?: number | string; // Allow string for temporary IDs
  employee_id?: number;
  full_name: string;
  relationship: string;
  birth_date: string;
  gender?: string;
  is_disabled?: boolean;
  is_studying?: boolean;
  nationality?: string;
  identification_no?: string;
  notes?: string;
  child_relief_percent?: number;
  is_temp?: boolean; // Flag for temporary records
}


interface Position {
  id: string;
  title: string;
  department_id: string | number;
  job_level: string;
  start_work_time?: string;
  end_work_time?: string;
  job_description?: string;
  created_at?: string;
  updated_at?: string;
  employee_count?: number;
}

// Add a new interface for Company
interface Company {
  id: string;
  name?: string;
  company_name?: string;
  is_active: number | boolean;
}

interface JobLevel {
  job_level: string;
}


interface CurrencyRate {
  id: number;
  bank_id: number;
  from_code: string;
  to_code: string;
  rate: string;
  effective_date: string;
  expiry_date: string;
  updated_by: string;
  updated_at: string;
  is_expired: number;
  bank_name: string;
  to_currency_name: string;
}


interface Bank {
  id: number;
  bank_name: string;
  currency_code: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PayrollConfig {
  id: number;
  pay_interval: string;
  cutoff_day: number;
  payment_day: number;
  late_penalty_type: string;
  late_penalty_amount: string;
  ot_multiplier: string;
  default_currency: string;
  auto_carry_forward: number;
  created_at: string;
  updated_at: string;
}
interface BenefitGroupOption {
  id: number;
  name: string;
  company_id?: number | null;
}

interface CurrentGroupInfo {
  group_id: number;
  group_name: string;
  description?: string | null;
  is_active: boolean;
  is_recurring?: boolean;
  assigned_at?: string | null; // optional for create
  benefit_count?: number;
  items?: {
    id: number;
    benefit_type_name: string;
    frequency: string;
    amount: string | number;
    start_date: string;
    end_date: string;
    is_active: boolean;
  }[];
}

// Using DisciplinaryRecord type from Modal.tsx
type DisciplinaryRecord = ImportedDisciplinaryRecord;

// Add document types configuration
const EMPLOYEE_DOCUMENT_TYPES = [
  {
    type: 'ID',
    label: 'Identity Document',
    description: 'Upload a scan of ID card'
  },
  {
    type: 'Passport',
    label: 'Passport',
    description: 'Upload a scan of passport'
  },
  {
    type: 'Work_Permit',
    label: 'Work Permit',
    description: 'Upload visa or work permit documents'
  },
  {
    type: 'Employment_Agreement',
    label: 'Employment Agreement',
    description: 'Upload signed employment contract'
  },
  {
    type: 'Education',
    label: 'Education',
    description: 'Upload education certificates'
  },
  {
    type: 'Resume',
    label: 'Resume',
    description: 'Upload latest resume or CV'
  },
  {
    type: 'Other',
    label: 'Other Documents',
    description: 'Upload other documents'
  }
];

const EMPLOYEE_TRAINING_RECORDS_DOCUMENT = [
  {
    type: 'Training_Records',
    label: 'Training Records',
    description: 'Upload training records'
  }
];

const EMPLOYEE_DISCIPLINARY_RECORDS_DOCUMENT = [
  {
    type: 'Disciplinary_Records',
    label: 'Disciplinary Records',
    description: 'Upload disciplinary records'
  }
];

export default function AddEmployee() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiConnectionMessage, setApiConnectionMessage] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);
  const [useMockApi, setUseMockApi] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [newEmployeeId, setNewEmployeeId] = useState<number | null>(null);
  const [documentUploadSuccess, setDocumentUploadSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [tabValidationError, setTabValidationError] = useState<string>('');
  
  // Training Records State
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [editingTrainingRecord, setEditingTrainingRecord] = useState<TrainingRecord | null>(null);

  // Disciplinary Records State
  const [disciplinaryRecords, setDisciplinaryRecords] = useState<DisciplinaryRecord[]>([]);
  const [showDisciplinaryModal, setShowDisciplinaryModal] = useState(false);
  const [editingDisciplinaryRecord, setEditingDisciplinaryRecord] = useState<DisciplinaryRecord | null>(null);
  
  // Confirmation Modal State
const [showConfirmationModal, setShowConfirmationModal] = useState(false);
const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
const [confirmationMessage, setConfirmationMessage] = useState('');
const [confirmationTitle, setConfirmationTitle] = useState('');
  
  // Define tabs array
  //const tabs = ['personal', 'employment', 'position', 'compensation', 'documents', 'training', 'dependents','disciplinary'];
  const tabs = ['personal', 'employment', 'position', 'compensation', 'dependents', 'documents', 'training', 'disciplinary', 'Increments'];

//new
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bank-currency/rates/active`);
        if (!response.ok) {
          throw new Error('Failed to fetch currency rates');
        }
        const data: CurrencyRate[] = await response.json();
        setCurrencyRates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyRates();
  }, []);

  const [payrollConfigs, setPayrollConfigs] = useState<PayrollConfig[]>([]);
  

  //get pay interval api
    useEffect(() => {
      const fetchPayrollConfigs = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/payroll-config/configs`);
          if (!response.ok) {
            throw new Error('Failed to fetch payroll configurations');
          }
          const configsData: PayrollConfig[] = await response.json();
          setPayrollConfigs(configsData);
        } catch (err) {
          setError('Error fetching payroll interval config:');
          console.error('Error fetching payroll configs:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPayrollConfigs();
    }, []);

    // get bank api
    const [banks, setBanks] = useState<Bank[]>([]);

  
    useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bank-currency/banks`);
        if (!response.ok) {
          throw new Error('Failed to fetch banks');
        }
        const data: Bank[] = await response.json();
        // Filter only active banks if needed
        const activeBanks = data.filter(bank => bank.status === 'Active');
        setBanks(activeBanks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBanks();
  }, []);


  //auto generate emp num
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);


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
    const response = await fetch(
      `${API_BASE_URL}/api/admin/employees/validate/employee-number?employee_no=${encodeURIComponent(employeeNo.trim())}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to validate employee number');
    }

    const data = await response.json();
    
    if (data.success && data.available) {
      setEmployeeNoValidation({
        isValidating: false,
        isValid: true,
        message: data.message || '✓ Employee number is valid and available'
      });
    } else {
      setEmployeeNoValidation({
        isValidating: false,
        isValid: false,
        message: data.message || '✗ Employee number is already taken. Click "Generate" to get a new one.'
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




const generateEmployeeNumber = async () => {

  

   const joinedDate = formData.joined_date || new Date().toISOString().split('T')[0];

  setIsAutoGenerating(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/employees/generate-employee-number`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        joined_date: formData.joined_date,
        current_employee_no: formData.employee_no // Send current number
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate employee number');
    }

    if (data.success) {
      setFormData(prev => ({
        ...prev,
        employee_no: data.employee_no
      }));
      
      // Validate the generated number
      validateEmployeeNumber(data.employee_no);
      
      if (data.is_new) {
        toast.success('New employee number generated successfully');
      } else {
        toast.success('Using existing valid employee number');
      }
    } else {
      throw new Error(data.message || 'Failed to generate employee number');
    }
  } catch (error: any) {
    console.error('Error generating employee number:', error);
    toast.error(error.message || 'Failed to generate employee number');
  } finally {
    setIsAutoGenerating(false);
  }
};





// Add these state variables
// State for dependents management
const [dependents, setDependents] = useState<Dependent[]>([]);
const [editingDependent, setEditingDependent] = useState<Dependent | null>(null);
const [showDependentModal, setShowDependentModal] = useState(false);
const [dependentForm, setDependentForm] = useState<Dependent>({
  full_name: '',
  relationship: 'Child',
  birth_date: '',
  gender: '',
  is_disabled: false,
  is_studying: false,
  nationality: '',
  identification_no: '',
  notes: '',
  child_relief_percent: 0
});

// Helper function to format date for display
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Always produce "YYYY-MM-DD" or empty string
const toDateOnly = (val?: string | null) => {
  if (!val) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Handle dependent form changes
const handleDependentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const target = e.target as HTMLInputElement;
  const { name, type } = target;
  const raw = target.value;

  setDependentForm(prev => {
    let next: any;

    if (type === 'checkbox') {
      next = target.checked;
    } else if (name === 'birth_date') {
      next = toDateOnly(raw);
    } else if (name === 'child_relief_percent') {
      next = raw === '' ? 0 : Number(raw);
    } else {
      next = raw;
    }

    return { ...prev, [name]: next };
  });
};

// Generate a unique key for each dependent
const depKey = (dep: Partial<Dependent>) =>
  String(dep?.id ?? `${dep?.full_name ?? ''}|${dep?.birth_date ?? ''}`);

// Save dependent to local state
const handleSaveDependent = (dependent: Dependent) => {
  if (!dependent.full_name || !dependent.relationship || !dependent.birth_date) {
    toast.error('Name, Relationship and Date of Birth are required');
    return;
  }

  

  const newDependent = editingDependent
    ? { ...dependent, id: editingDependent.id }
    : { ...dependent, id: `temp_${Date.now()}`, is_temp: true };

  const updateList = (list: Dependent[]) =>
    editingDependent
      ? list.map(d => depKey(d) === depKey(editingDependent) ? newDependent : d)
      : [...list, newDependent];

  setDependents(prev => updateList(prev ?? []));

  // Reset form
  setDependentForm({
    full_name: '',
    relationship: 'Child',
    birth_date: '',
    gender: '',
    is_disabled: false,
    is_studying: false,
    nationality: '',
    identification_no: '',
    notes: '',
    child_relief_percent: 0
  });
  setEditingDependent(null);
  setShowDependentModal(false);
};

const handleDeleteDependent = (keyToDelete: number | string | undefined) => {
  setConfirmationTitle('Delete Dependent');
  setConfirmationMessage('Are you sure you want to delete this dependent?');
  setConfirmationAction(() => () => {
    const keyStr = String(keyToDelete ?? '');
    
    setDependents(prev => (prev ?? []).filter(dep => {
      // Check both the ID and the full key for matching
      const depId = String(dep.id ?? '');
      const fullKey = depKey(dep);
      
      return depId !== keyStr && fullKey !== keyStr;
    }));
    
    setShowConfirmationModal(false);
  });
  setShowConfirmationModal(true);
};

  // Add role check to redirect non-admin users
  useEffect(() => {
    // Check if user is admin
    const checkUserRole = () => {
      const user = localStorage.getItem('hrms_user');
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        
        // If user is not admin, redirect to employees list
        if (userData.role !== 'admin') {
          router.push('/employees');
        }
      } else {
        // If no user data, redirect to login
        router.push('/auth/login');
      }
    };
    
    checkUserRole();
  }, [router]);
  
  // Add state for departments and positions
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [filteredJobLevels, setFilteredJobLevels] = useState<JobLevel[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [departmentEmployees, setDepartmentEmployees] = useState<{id: string; name: string; employee_no: string}[]>([]);
  
  // Add state for companies
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  
  // Add state for managers
  const [managers, setManagers] = useState<{id: string; name: string; employee_no: string}[]>([]);
  const [managersLoading, setManagersLoading] = useState(false);
  
  // State for document uploads
  const [passportDocument, setPassportDocument] = useState<{url: string; key: string; name: string} | null>(null);
  
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
  

  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    salary: '',
    currency: 'MYR',
    company_id: '',
    manager_id: '',
    role: 'employee',
    joined_date: '',
    resigned_date: '',
    confirmation_date: '',
    gender: '',
    employee_no: '',
    employment_type: '',
    job_level: '',
    department: '',
    position: '',
    superior: '',
    office: '',
    nationality: '',
    visa_expired_date: '',
    passport_expired_date: '',
    ic_passport: '',
    marital_status: '',
    dob: '',
    age: '',
    mobile_number: '',
    country_code: '',
    payment_company: '',
    pay_interval: '',
    payment_method: '',
    bank_name: '',
    bank_currency: '',
    bank_account_name: '',
    bank_account_no: '',
    income_tax_no: '',
    socso_account_no: '',
    epf_account_no: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    emergency_contact_email: '',
    race: '',
    religion: '',
    department_id: '',
    position_id: '',
    education_level: '',
    qualification: '',
    benefit_group_id: '', 
  });

  const [phoneMask, setPhoneMask] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<EmployeeDocument[]>([]);

  // Add separate state for each tab's selected files
  const [documentsTabFiles, setDocumentsTabFiles] = useState<EmployeeDocument[]>([]);
  const [disciplinaryTabFiles, setDisciplinaryTabFiles] = useState<EmployeeDocument[]>([]);

  // Computed value for combined files across all tabs (excluding training since it's handled separately now)
  const allSelectedFiles = [...documentsTabFiles, ...disciplinaryTabFiles];

  // Custom handlers for merging files instead of replacing them
  const handleDocumentsTabFilesSelected = (allFiles: EmployeeDocument[]) => {
    // Filter out files that already exist in the state
    const newFiles = allFiles.filter(newFile => 
      !documentsTabFiles.some(existingFile => 
        existingFile.name === newFile.name && 
        existingFile.documentType === newFile.documentType
      )
    );
    
    setDocumentsTabFiles(prev => [...prev, ...newFiles]);
  };


  const handleDisciplinaryTabFilesSelected = (allFiles: EmployeeDocument[]) => {
    // Filter out files that already exist in the state
    const newFiles = allFiles.filter(newFile => 
      !disciplinaryTabFiles.some(existingFile => 
        existingFile.name === newFile.name && 
        existingFile.documentType === newFile.documentType
      )
    );
    
    setDisciplinaryTabFiles(prev => [...prev, ...newFiles]);
  };

  // Custom handlers for removing files from state when deleted
  const handleDocumentsTabDocumentDeleted = (removedFile?: EmployeeDocument) => {
    if (removedFile) {
      setDocumentsTabFiles(prev => 
        prev.filter(file => 
          !(file.name === removedFile.name && file.documentType === removedFile.documentType)
        )
      );
    }
  };



  const handleDisciplinaryTabDocumentDeleted = (removedFile?: EmployeeDocument) => {
    if (removedFile) {
      setDisciplinaryTabFiles(prev => 
        prev.filter(file => 
          !(file.name === removedFile.name && file.documentType === removedFile.documentType)
        )
      );
    }
  };

  // Training Records Management Functions
  const handleOpenTrainingModal = (record?: TrainingRecord) => {
    if (record) {
      setEditingTrainingRecord(record);
    } else {
      setEditingTrainingRecord(null);
    }
    setShowTrainingModal(true);
  };

  const handleCloseTrainingModal = () => {
    setShowTrainingModal(false);
    setEditingTrainingRecord(null);
  };

  const handleSaveTrainingRecord = (trainingRecord: TrainingRecord) => {
    if (editingTrainingRecord) {
      // Update existing record
      setTrainingRecords(prev =>
        prev.map(record =>
          record.id === editingTrainingRecord.id
            ? { ...trainingRecord, id: editingTrainingRecord.id }
            : record
        )
      );
    } else {
      // Add new record
      const newRecord: TrainingRecord = {
        ...trainingRecord,
        id: `training_${Date.now()}` // Temporary ID for frontend
      };
      setTrainingRecords(prev => [...prev, newRecord]);
    }

    // Always clear the editing record state before closing modal
    setEditingTrainingRecord(null);
    handleCloseTrainingModal();
  };

  const handleDeleteTrainingRecord = (recordId: string) => {
    setConfirmationTitle('Delete Training Record');
    setConfirmationMessage('Are you sure you want to delete this training record? This action cannot be undone.');
    setConfirmationAction(() => () => confirmDeleteTrainingRecord(recordId));
    setShowConfirmationModal(true);
  };

  const confirmDeleteTrainingRecord = (recordId: string) => {
    setTrainingRecords(prev => prev.filter(record => record.id !== recordId));
    setShowConfirmationModal(false);
  };

  // Disciplinary Records Management Functions
  const handleOpenDisciplinaryModal = (record?: DisciplinaryRecord) => {
    if (record) {
      setEditingDisciplinaryRecord(record);
    } else {
      setEditingDisciplinaryRecord(null);
    }
    setShowDisciplinaryModal(true);
  };

  const handleCloseDisciplinaryModal = () => {
    setShowDisciplinaryModal(false);
    setEditingDisciplinaryRecord(null);
  };

  const handleSaveDisciplinaryRecord = (disciplinaryRecord: DisciplinaryRecord) => {
    if (editingDisciplinaryRecord) {
      // Update existing record
      setDisciplinaryRecords(prev =>
        prev.map(record =>
          record.id === editingDisciplinaryRecord.id
            ? { ...disciplinaryRecord, id: editingDisciplinaryRecord.id }
            : record
        )
      );
    } else {
      // Add new record
      const newRecord: DisciplinaryRecord = {
        ...disciplinaryRecord,
        id: `disciplinary_${Date.now()}` // Temporary ID for frontend
      };
      setDisciplinaryRecords(prev => [...prev, newRecord]);
    }

    // Always clear the editing record state before closing modal
    setEditingDisciplinaryRecord(null);
    handleCloseDisciplinaryModal();
  };

  const handleDeleteDisciplinaryRecord = (recordId: string) => {
    setConfirmationTitle('Delete Disciplinary Record');
    setConfirmationMessage('Are you sure you want to delete this disciplinary record? This action cannot be undone.');
    setConfirmationAction(() => () => confirmDeleteDisciplinaryRecord(recordId));
    setShowConfirmationModal(true);
  };

  const confirmDeleteDisciplinaryRecord = (recordId: string) => {
    setDisciplinaryRecords(prev => prev.filter(record => record.id !== recordId));
    setShowConfirmationModal(false);
  };

  const handleConfirmDelete = () => {
    confirmationAction();
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(() => {});
    setConfirmationMessage('');
    setConfirmationTitle('');
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  // Add groupedPositions state
  const [groupedPositions, setGroupedPositions] = useState<{[title: string]: {[level: string]: string}}>({});
  const [uniquePositionTitles, setUniquePositionTitles] = useState<string[]>([]);
  const [availableJobLevels, setAvailableJobLevels] = useState<string[]>([]);
  
const isTabComplete = (tabName: 'personal' | 'employment' | 'compensation' | 'documents' | 'position' | 'dependents'): boolean => {
  if (tabName === 'personal') {
    return Boolean(formData.name && formData.email && formData.gender && formData.dob && formData.ic_passport);
  } else if (tabName === 'employment') {
    return Boolean(formData.employee_no && formData.joined_date && formData.company_id && formData.department_id);
  } else if (tabName === 'position') {
    return Boolean(formData.position_id && formData.job_level);
  } else if (tabName === 'compensation') {
    return Boolean(formData.salary && formData.currency && formData.payment_method);
  } else if (tabName === 'dependents') {
   // Ensure dependents is always treated as an array
    const deps = Array.isArray(dependents) ? dependents : [];
    if (deps.length === 0) return true;
    return deps.every(dep => (
      dep?.full_name?.trim() && 
      dep?.relationship?.trim() && 
      dep?.birth_date?.trim()
    ));
  } else {
    return true; // Documents tab is optional
  }
};
  const validateCurrentTab = (currentTab: string): boolean => {
  setTabValidationError('');
  
  if (currentTab === 'personal') {
    const requiredFields = [
      'name', 'email', 'password', 'country_code', 'mobile_number', 
      'nationality', 'dob', 'gender', 'marital_status', 
      'address','ic_passport' //'race', 'religion', 
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setTabValidationError('Please fill in all required fields');
        return false;
      }
    }
  } else if (currentTab === 'employment') {
    const requiredFields = [
      'employee_no', 'joined_date', 'employment_type', 'company_id', 
      'department_id'//, 'education_level'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setTabValidationError('Please fill in all required fields');
        return false;
      }
    }
  } else if (currentTab === 'position') {
    const requiredFields = ['position_id', 'job_level'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setTabValidationError('Please fill in all required fields');
        return false;
      }
    }
  } else if (currentTab === 'compensation') {
    const requiredFields = [
      'salary', 'currency', 'payment_company', 'pay_interval', 
      'payment_method', 'bank_name', 'bank_currency', 
      'bank_account_name', 'bank_account_no'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setTabValidationError('Please fill in all required fields');
        return false;
      }
    }
  } else if (currentTab === 'dependents') {
     // Validate dependents if any exist
    const deps = Array.isArray(dependents) ? dependents : [];
    if (deps.length > 0) {
      const invalidDependents = deps.filter(dep => 
        !dep?.full_name || !dep?.relationship || !dep?.birth_date
      );
      
      if (invalidDependents.length > 0) {
        setTabValidationError('Please fill all required fields for dependents (Name, Relationship, and Date of Birth)');
        return false;
      }
    }
  }
  
  return true;
};

  // Check API availability on component mount
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        // Attempt to fetch from the API - use a health endpoint if available
        const response = await fetch(`${API_BASE_URL}/api/admin/employees`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        // Even if we get a 404, it means the server is running but endpoint might be wrong
        setApiAvailable(true);
        setApiConnectionMessage('');
      } catch (error) {
        console.error('API connection failed:', error);
        setApiAvailable(false);
        setApiConnectionMessage('Unable to connect to the API server. Please make sure the backend server is running.');
      }
    };

    checkApiAvailability();

    // Fetch companies
    const fetchCompanies = async () => {
      try {
        // Check API health first
        const apiUrl = API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/admin/companies`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to load companies. Please check your connection.');
      }
    };
    
    fetchCompanies();

    // Add option to use mock API if the real one isn't available
    if (process.env.NODE_ENV === 'development') {
      // Default to mock API if we can't connect to the real one
      const mockApiEnabled = localStorage.getItem('useMockApi') === 'true';
      setUseMockApi(mockApiEnabled || !apiAvailable);
    }
  }, [apiAvailable]);

  // Fetch positions when department_id changes (but only if API is available)
  useEffect(() => {
    if (formData.department_id && apiAvailable && !useMockApi) {
      const fetchDepartmentPositions = async () => {
        try {
          setPositionsLoading(true);
          const response = await fetch(`${API_BASE_URL}/api/admin/departments/${formData.department_id}/positions`);
          
          if (!response.ok) {
            console.warn(`Failed to fetch positions for department ID ${formData.department_id}: ${response.status}`);
            // Set empty positions array on error
            fallbackToMockPositions();
            return;
          }
          
          const data = await response.json();
          
          // Extract positions from the response - handle both array and object with positions property
          let positionsData: Position[] = [];
          
          if (Array.isArray(data)) {
            positionsData = data;
          } else if (data && typeof data === 'object') {
            // Check if data has a positions property that is an array
            if (data.positions && Array.isArray(data.positions)) {
              positionsData = data.positions;
            } else {
              console.warn('API response does not contain positions in expected format:', data);
            }
          }
          
          
          if (positionsData.length === 0) {
            // Fallback to mock data if we get empty results
            fallbackToMockPositions();
            return;
          }
          
          // Ensure department_id is compared as string to handle string/number mismatches
          const processedPositions = positionsData.map(pos => ({
            ...pos,
            department_id: String(pos.department_id)
          }));
          
          
          // Set both positions arrays
          setPositions(processedPositions);
          setFilteredPositions(processedPositions);
          setPositionsLoading(false);
          
        } catch (error) {
          console.error('Error fetching positions:', error);
          // Fallback to mock data if API fails
          fallbackToMockPositions();
        }
      };
      
      // Function to create mock positions when API fails
      const fallbackToMockPositions = () => {
        
        const mockPositionsByDepartment: {[key: string]: Position[]} = {
          // Add mock positions for common departments
          'IT': [
            { id: 'it-1', title: 'Software Engineer', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'it-2', title: 'UI/UX Designer', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'it-3', title: 'QA Engineer', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'it-4', title: 'DevOps Engineer', department_id: formData.department_id, job_level: 'Senior' },
            { id: 'it-5', title: 'IT Manager', department_id: formData.department_id, job_level: 'Manager' },
            // Add duplicate title with different job level for testing
            { id: 'it-6', title: 'Software Engineer', department_id: formData.department_id, job_level: 'Senior' },
            { id: 'it-7', title: 'Software Engineer', department_id: formData.department_id, job_level: 'Junior' }
          ],
          'HR': [
            { id: 'hr-1', title: 'HR Manager', department_id: formData.department_id, job_level: 'Manager' },
            { id: 'hr-2', title: 'Recruiter', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'hr-3', title: 'HR Assistant', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'hr-4', title: 'Training Coordinator', department_id: formData.department_id, job_level: 'Mid' }
          ],
          'Finance': [
            { id: 'fin-1', title: 'Accountant', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'fin-2', title: 'Financial Analyst', department_id: formData.department_id, job_level: 'Senior' },
            { id: 'fin-3', title: 'Payroll Specialist', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'fin-4', title: 'Finance Manager', department_id: formData.department_id, job_level: 'Manager' }
          ],
          'Marketing': [
            { id: 'mkt-1', title: 'Marketing Specialist', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'mkt-2', title: 'Content Writer', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'mkt-3', title: 'SEO Specialist', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'mkt-4', title: 'Marketing Manager', department_id: formData.department_id, job_level: 'Manager' }
          ],
          'Sales': [
            { id: 'sls-1', title: 'Sales Representative', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'sls-2', title: 'Account Manager', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'sls-3', title: 'Sales Manager', department_id: formData.department_id, job_level: 'Manager' }
          ]
        };
        
        // Try to get positions based on department name
        const departmentObj = departments.find((dept: Department) => dept.id === formData.department_id);
        const departmentName = departmentObj?.department_name || '';
        
        // Use department-specific positions or generic ones
        let mockPositions = mockPositionsByDepartment[departmentName] || [];
        
        // If no department-specific positions are found, use generic positions
        if (mockPositions.length === 0) {
          mockPositions = [
            { id: 'gen-1', title: 'Manager', department_id: formData.department_id, job_level: 'Manager' },
            { id: 'gen-2', title: 'Assistant', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'gen-3', title: 'Coordinator', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'gen-4', title: 'Specialist', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'gen-5', title: 'Officer', department_id: formData.department_id, job_level: 'Junior' },
            // Add duplicate title with different job level for testing
            { id: 'gen-6', title: 'Specialist', department_id: formData.department_id, job_level: 'Senior' },
            { id: 'gen-7', title: 'Specialist', department_id: formData.department_id, job_level: 'Junior' }
          ];
        }
        
        setPositions(mockPositions);
        setFilteredPositions(mockPositions);
        setPositionsLoading(false);
      };
      
      fetchDepartmentPositions();
    } else if (!formData.department_id) {
      // Clear positions when no department is selected
      setPositions([]);
      setFilteredPositions([]);
      setFilteredJobLevels([]);
      setGroupedPositions({});
      setUniquePositionTitles([]);
      setAvailableJobLevels([]);
    } else if (useMockApi) {
      // Even in mock API mode, we need positions data
      setPositionsLoading(true);
      
      // Generic mock positions for any department
      const mockPositions = [
        { id: 'gen-1', title: 'Manager', department_id: formData.department_id, job_level: 'Manager' },
        { id: 'gen-2', title: 'Assistant', department_id: formData.department_id, job_level: 'Junior' },
        { id: 'gen-3', title: 'Coordinator', department_id: formData.department_id, job_level: 'Mid' },
        { id: 'gen-4', title: 'Specialist', department_id: formData.department_id, job_level: 'Mid' },
        { id: 'gen-5', title: 'Officer', department_id: formData.department_id, job_level: 'Junior' },
        // Add duplicate title with different job level for testing
        { id: 'gen-6', title: 'Specialist', department_id: formData.department_id, job_level: 'Senior' },
        { id: 'gen-7', title: 'Officer', department_id: formData.department_id, job_level: 'Senior' }
      ];
      
      setPositions(mockPositions);
      setFilteredPositions(mockPositions);
      setPositionsLoading(false);
    }
  }, [formData.department_id, apiAvailable, useMockApi, departments]);

  // Organize positions by title and job level when positions data changes
  useEffect(() => {
    if (Array.isArray(positions) && positions.length > 0) {
      // Create a map of positions by title and job level
      const grouped: {[title: string]: {[level: string]: string}} = {};
      const titles = new Set<string>();
      
      positions.forEach(position => {
        const { title, job_level, id } = position;
        
        // Add title to unique titles set
        titles.add(title);
        
        // Initialize title in grouped if it doesn't exist
        if (!grouped[title]) {
          grouped[title] = {};
        }
        
        // Add position ID by job level
        grouped[title][job_level] = id;
      });
      
      setGroupedPositions(grouped);
      setUniquePositionTitles(Array.from(titles).sort());
      
      // Reset position and job level in formData if they don't exist in new positions
      if (formData.position && !titles.has(formData.position)) {
        setFormData(prev => ({
          ...prev,
          position: '',
          position_id: '',
          job_level: ''
        }));
      }
    } else {
      setGroupedPositions({});
      setUniquePositionTitles([]);
    }
  }, [positions]);

  // Update available job levels when position title changes
  useEffect(() => {
    if (formData.position && groupedPositions[formData.position]) {
      const jobLevels = Object.keys(groupedPositions[formData.position]);
      setAvailableJobLevels(jobLevels.sort());
      
      // Reset job level if current one isn't available
      if (formData.job_level && !jobLevels.includes(formData.job_level)) {
        setFormData(prev => ({
          ...prev,
          job_level: '',
          position_id: ''
        }));
      }
    } else {
      setAvailableJobLevels([]);
      
      // Clear job level when position is cleared
      if (formData.job_level && !formData.position) {
        setFormData(prev => ({
          ...prev,
          job_level: '',
          position_id: ''
        }));
      }
    }
  }, [formData.position, groupedPositions]);

  // Update position_id when both position title and job level are selected
  useEffect(() => {
    if (formData.position && formData.job_level && 
        groupedPositions[formData.position] && 
        groupedPositions[formData.position][formData.job_level]) {
      
      const positionId = groupedPositions[formData.position][formData.job_level];
      
      // Only update if different from current value
      if (formData.position_id !== positionId) {
        setFormData(prev => ({
          ...prev,
          position_id: positionId
        }));
      }
    }
  }, [formData.position, formData.job_level, groupedPositions]);

  // Handle position ID selection to update job level
  useEffect(() => {
    if (formData.position_id) {
      // Ensure positions is always an array before filtering
      const positionsArray = Array.isArray(positions) ? positions : [];
      
      // Normalize position ID and cast to string for consistent comparison
      const filteredPosition = positionsArray.filter((position: Position) => 
        String(position.id) === String(formData.position_id)
      );

      setFilteredJobLevels(filteredPosition);
    }
    else {
      setFilteredJobLevels([]);
    }
  }, [formData.position_id, positions]);

  useEffect(() => {
    const fetchDepartmentEmployees = async (departmentId: string) => {
      if (!departmentId) {
        setDepartmentEmployees([]);
        return;
      };
      try {
        setDepartmentEmployees([]); // Clear employees while loading
        const response = await fetch(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`);
        
        if (response.status === 404) {
          setDepartmentEmployees([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch department employees: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDepartmentEmployees(data);
      } catch (error) {
        console.error('Error fetching department employees:', error);
        setDepartmentEmployees([]);
      }
    };
    fetchDepartmentEmployees(formData.department_id);
  },[formData.department_id]);

  // Toggle mock API usage
  const toggleMockApi = () => {
    const newValue = !useMockApi;
    setUseMockApi(newValue);
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('useMockApi', String(newValue));
    }
  };

const handleChange =(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;



  if (name === 'country_code') {
    const selected = COUNTRY_CODES.find(c => c.code === value);
    setPhoneMask(selected?.mask || '9999999999');
    setFormData(prev => ({
      ...prev,
      country_code: value
    }));
  }
  else if (name === 'department_id') {
    const selectedDept = departments.find(dept => dept.id === value);
    setFormData(prev => ({
      ...prev,
      department_id: value,
      department: selectedDept?.department_name || value,
      position: '',
      position_id: '',
      job_level: ''
    }));
  }
  else if (name === 'position') {
    setFormData(prev => ({
      ...prev,
      position: value,
      job_level: '',
      position_id: ''
    }));
  }
  else if (name === 'job_level') {
    setFormData(prev => ({
      ...prev,
      job_level: value
    }));
  }
  else if (name === 'position_id') {
    const selectedPos = filteredPositions.find(pos => String(pos.id) === value);
    if (selectedPos) {
      setFormData(prev => ({
        ...prev,
        position_id: value,
        position: selectedPos.title,
        job_level: selectedPos.job_level || prev.job_level
      }));
    } else {
      console.warn('Position not found for ID:', value);
      setFormData(prev => ({
        ...prev,
        position_id: value,
        position: value
      }));
    }
  }
  else if (name === 'dob') {
    setFormData(prev => ({
      ...prev,
      dob: value,
      age: String(calculateAge(value))
    }));
  }
  else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  
};


// TEMP: stub type to satisfy TS while wiring tabs.
// Delete this when you import the real type from IncrementsTab.
type IncrEmployee = {
  employee_id: string;
  employee_no: string;
  employee_name: string;
  company_id: string;
  company_name: string;
  department: string;
  position: string;
  currency: string;
  resigned_date: string | null;
  basic_salary: number;
  job_grade: string | null;
};


  // You already have employees elsewhere in your system. For this AddEmployee flow you might
// not have a list handy; if you do, map it into IncrementsTab's Employee shape:
const employeesForIncrements: IncrEmployee[] = useMemo(() => {
  // TODO: supply real employees here (or keep [])
  return [];
}, []);


// Optional: handle apply (persist to API)
function handleApplyIncrementFromTab(data: IncrementData) {
  // POST to your increments endpoint if you have one
  // await fetch('/api/increments', { method: 'POST', body: JSON.stringify(data) })
  console.log('Increment payload from tab:', data);
}

  // For demo mode - to show success message
  const [demoSuccess, setDemoSuccess] = useState(false);

  // // Employee number validation function
  // const validateEmployeeNumber = async (employeeNo: string) => {
  //   if (!employeeNo.trim()) {
  //     setEmployeeNoValidation({
  //       isValidating: false,
  //       isValid: null,
  //       message: ''
  //     });
  //     return;
  //   }

  //   setEmployeeNoValidation({
  //     isValidating: true,
  //     isValid: null,
  //     message: 'Validating...'
  //   });

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/admin/employees/validate/employee-number?employee_no=${encodeURIComponent(employeeNo.trim())}`);
      
  //     if (!response.ok) {
  //       throw new Error('Failed to validate employee number');
  //     }

  //     const data = await response.json();
      
  //     if (data.success && data.available) {
  //       setEmployeeNoValidation({
  //         isValidating: false,
  //         isValid: true,
  //         message: 'Employee number is available'
  //       });
  //     } else {
  //       setEmployeeNoValidation({
  //         isValidating: false,
  //         isValid: false,
  //         message: data.message || 'Employee number already exists'
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error validating employee number:', error);
  //     setEmployeeNoValidation({
  //       isValidating: false,
  //       isValid: false,
  //       message: 'Failed to validate employee number'
  //     });
  //   }
  // };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setApiConnectionMessage('');
  setDemoSuccess(false);
  
  // Validation checks
  if (!apiAvailable && !useMockApi) {
    setLoading(false);
    setApiConnectionMessage('Cannot submit form: API server appears to be offline. Please ensure the backend server is running or enable mock API for testing.');
    return;
  }
  
  if (formData.employee_no && employeeNoValidation.isValid === false) {
    setLoading(false);
    setError('Please fix the employee number validation errors before submitting.');
    return;
  }
  
  if (formData.employee_no && employeeNoValidation.isValid === null) {
    setLoading(false);
    setError('Please wait for employee number validation to complete before submitting.');
    return;
  }
  
  try {
    // Prepare employee data
    const employeeData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      salary: formData.salary,
      currency: formData.currency,
      company_id: formData.company_id,
      manager_id: formData.job_level === 'Manager' ? null : formData.manager_id,
      role: formData.role,
      joined_date: formData.joined_date,
      resigned_date: formData.resigned_date || null,
      confirmation_date: formData.confirmation_date || null,
      gender: formData.gender,
      employee_no: formData.employee_no,
      employment_type: formData.employment_type,
      job_level: formData.job_level,
      department: formData.department,
      position: formData.position,
      superior: formData.job_level === 'Manager' ? null : formData.superior,
      office: formData.office,
      nationality: formData.nationality,
      visa_expired_date: formData.visa_expired_date,
      passport_expired_date: formData.passport_expired_date,
      ic_passport: formData.ic_passport,
      marital_status: formData.marital_status,
      dob: formData.dob,
      age: formData.age,
      mobile_number: `${formData.country_code}${formData.mobile_number.replace(/\s|-/g, '')}`,//formData.mobile_number,
      country_code: formData.country_code,
      payment_company: formData.payment_company,
      pay_interval: formData.pay_interval,
      payment_method: formData.payment_method,
      bank_name: formData.bank_name,
      bank_currency: formData.bank_currency,
      bank_account_name: formData.bank_account_name,
      bank_account_no: formData.bank_account_no,
      income_tax_no: formData.income_tax_no,
      socso_account_no: formData.socso_account_no,
      epf_account_no: formData.epf_account_no,
      race: formData.race,
      religion: formData.religion,
      position_id: formData.position_id,
      department_id: formData.department_id,
      education_level: formData.education_level || null,
      qualification: formData.qualification || null,
      //benefit_group_id: formData.benefit_group_id ? parseInt(formData.benefit_group_id) : null,
      training_records: trainingRecords,
      disciplinary_records: disciplinaryRecords
    };

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(employeeData));

    // Add attachments to form data
    trainingRecords.forEach((record, index) => {
      record.attachments?.forEach(doc => {
        if (doc.file) {
          formDataToSend.append(
            `employee-data|${EMPLOYEE_TRAINING_RECORDS_DOCUMENT[0].type}|${index}`, 
            doc.file
          );
        }
      });
    });

    disciplinaryRecords.forEach((record, index) => {
      record.attachments?.forEach(doc => {
        if (doc.file) {
          formDataToSend.append(
            `employee-data|${EMPLOYEE_DISCIPLINARY_RECORDS_DOCUMENT[0].type}|${index}`, 
            doc.file
          );
        }
      });
    });

    // Make API call based on mode
    let response;
    if (useMockApi) {
      response = await fetch(`${API_BASE_URL}/api/admin/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });
    } else {
      response = await fetch(`${API_BASE_URL}/api/admin/employees`, {
        method: 'POST',
        body: formDataToSend,
      });
    }

    // Handle response
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to create employee');
      } else {
        const text = await response.text();
        if (text.includes('<!DOCTYPE html>')) {
          setApiConnectionMessage(
            `API endpoint not found (${response.status}). ` +
            `Please ensure you have a working API endpoint for employee creation.`
          );
          throw new Error(`API endpoint not found (${response.status})`);
        }
        throw new Error(`Server error: ${response.status}`);
      }
    }

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
      setApiResponse(data);
    } else {
      console.warn('Server returned non-JSON response');
      data = { id: 'temp-id' };
      setApiResponse(data);
    }

    // Set new employee ID
    const newId = Number(data.id || data.employee_id);
    if (!newId) throw new Error('No employee ID returned from server');
    setNewEmployeeId(newId);

    // Save dependents if any exist
    if (dependents.length > 0) {
      try {
        const dependentResponse = await fetch(`${API_BASE_URL}/api/dependents/${newId}/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dependents: dependents.map(d => ({
              full_name: d.full_name,
              relationship: d.relationship,
              birth_date: d.birth_date,
              gender: d.gender,
              is_disabled: d.is_disabled,
              is_studying: d.is_studying,
              nationality: d.nationality,
              identification_no: d.identification_no,
              notes: d.notes,
              child_relief_percent: d.child_relief_percent || 0
            }))
          })
        });

        if (!dependentResponse.ok) {
          const errorData = await dependentResponse.json();
          throw new Error(errorData.error || 'Failed to save dependents');
        }

        const result = await dependentResponse.json();
        toast.success(result.message || 'Dependents saved successfully');
      } catch (err) {
        console.error("Error saving dependents:", err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to save dependents';
        toast.error(errorMessage);
      }
    }

    if (formData.benefit_group_id) {
      try {
        const benefitGroupResponse = await fetch(
          `${API_BASE_URL}/api/employees/${newId}/benefit-group`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              group_id: parseInt(formData.benefit_group_id) 
            }),
          }
        );

        if (!benefitGroupResponse.ok) {
          throw new Error('Failed to assign benefit group');
        }

        const benefitGroupData = await benefitGroupResponse.json();
        
        // Optional: Update form data with server response if needed
        const serverGroupIdStr = benefitGroupData?.group?.group_id
          ? String(benefitGroupData.group.group_id)
          : '';
        
        if (serverGroupIdStr !== formData.benefit_group_id) {
          setFormData(prev => prev ? { 
            ...prev, 
            benefit_group_id: serverGroupIdStr 
          } : prev);
        }

        // Fetch full details to update the info panel
        const detailResponse = await fetch(
          `${API_BASE_URL}/api/benefit-groups/${formData.benefit_group_id}`
        );
        
        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          setCurrentGroupInfo(detailData);
        }

      } catch (benefitError) {
        console.error('Error assigning benefit group:', benefitError);
        // Don't fail the entire submission for benefit group error
        toast.error('Employee created but benefit group assignment failed');
      }
    }

    // Show success message
    if (useMockApi) {
      setDemoSuccess(true);
      showSuccessToast(`Employee ${formData.name} added successfully!`);
    } else {
      toast.success(`Employee ${formData.name} added successfully!`);
      router.push('/employees');
    }

  } catch (error) {
    console.error('Error:', error);
    setError(error instanceof Error ? error.message : 'An error occurred while adding the employee');
    
    // Scroll to top to show error message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    setLoading(false);
  }
};


  // Function to show success toast
  const showSuccessToast = (message: string) => {
    const successMsg = document.createElement('div');
    successMsg.className = 'toast toast-middle toast-center';
    successMsg.innerHTML = `
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(successMsg);
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 5000);
  };

  // Add useEffect for fetching active companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const apiUrl = API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/admin/companies?status=active`);
        
        if (!response.ok) {
          console.warn('Failed to fetch companies');
          
        } else {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        
        
      } finally {
        setCompaniesLoading(false);
      }
    };

    fetchCompanies();
  }, [useMockApi]);

  // Update the departments fetch to only get active departments
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.company_id) return;
      
      setDepartmentsLoading(true);
      try {
        const apiUrl = API_BASE_URL;
        const id = formData.company_id;
        const response = await fetch(`${apiUrl}/api/admin/companies/${id}/departments`);
        setDepartmentEmployees([]);
        setFormData(prev => prev ? {...prev, department_id: '', superior: '', manager_id: '', job_level: ''} : prev);
        
        if (!response.ok) {
          console.warn(`Failed to fetch departments for company ID ${id}: ${response.status}`);
          // Set empty departments array on error
          setDepartments([]);
        } else {
          const data = await response.json();
          // Filter to include only active departments
          const activeDepartments = data.departments ? data.departments.filter((dept: Department) => dept.is_active) : [];
          setDepartments(activeDepartments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Set empty departments array on error
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, [formData.company_id, useMockApi]);

  // Fetch managers when company_id changes
  useEffect(() => {
    const fetchManagers = async (companyId: string) => {
      try {
        setManagersLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/admin/companies/${companyId}/managers`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch managers: ${response.statusText}`);
        }
        
        const data = await response.json();
        setManagers(data.managers);
      } catch (error) {
        console.error('Error fetching managers for company:', error);
        // Fallback to empty managers list
        setManagers([]);
      } finally {
        setManagersLoading(false);
      }
    };
    
    if (formData.company_id && apiAvailable && !useMockApi) {
      fetchManagers(formData.company_id);
    } else {
      setManagers([]); // Reset managers when department changes or if API is not available
    }
  }, [formData.company_id, apiAvailable, useMockApi]);

  // Handle document upload success
  const handleDocumentsUploaded = () => {
    setDocumentUploadSuccess(true);
    // showSuccessToast('Employee documents uploaded successfully!');
    
    // Redirect to employees list after successful document upload
    setTimeout(() => {
      router.push('/employees');
    }, 2000);
  };


const [benefitGroups, setBenefitGroups] = useState<BenefitGroupOption[]>([]);
const [benefitGroupsLoading, setBenefitGroupsLoading] = useState(false);
const [currentGroupInfo, setCurrentGroupInfo] = useState<CurrentGroupInfo | null>(null);
const [savingGroup, setSavingGroup] = useState(false); // only to show spinner during detail fetch

// formData should already exist in your parent form
// Ensure it has a benefit_group_id field (string or number)
const isCreateMode = true; // or derive from route/props (no employee id)

  useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      setBenefitGroupsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/benefit-groups`);
      if (!res.ok) throw new Error('Failed to fetch benefit groups');
      const data = await res.json();
      if (!mounted) return;
      setBenefitGroups(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setBenefitGroupsLoading(false);
    }
  })();
  return () => { mounted = false; };
}, []);

// 2) When the user picks a group, just update form state and fetch details to display
const handleBenefitGroupChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newGroupIdStr = e.target.value;
  
  // Update form state
  setFormData(prev => (prev ? { ...prev, benefit_group_id: newGroupIdStr } : prev));

  // If nothing selected, clear the info panel
  if (!newGroupIdStr) {
    setCurrentGroupInfo(null);
    return;
  }

  const newGroupId = Number(newGroupIdStr);
  
  // Fetch detail for info panel only
  setSavingGroup(true);
  try {
    const detailRes = await fetch(`${API_BASE_URL}/api/benefit-groups/${newGroupId}`);
    if (!detailRes.ok) throw new Error('Failed to fetch benefit group details');
    const detailJson = await detailRes.json();
    setCurrentGroupInfo(detailJson);
  } catch (err) {
    console.error(err);
    setCurrentGroupInfo(null);
  } finally {
    setSavingGroup(false);
  }
};
  

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <nav className="text-sm breadcrumbs">
          <ul>
            <li><Link href="/">Dashboard</Link></li>
            <li><Link href="/employees">Employees</Link></li>
            <li className="font-semibold">Add Employee</li>
          </ul>
        </nav>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Add New Employee</h1>
      
      {/* Tab Progress */}
      <div className="mb-4 text-center">
        <div className="overflow-x-auto">
          <ul className="steps steps-horizontal min-w-max">
            <li 
              className={`step ${isTabComplete('personal') ? 'step-primary' : ''}`}
              data-content={isTabComplete('personal') ? '✓' : '1'}
            >
              Personal
            </li>
            <li 
              className={`step ${isTabComplete('employment') ? 'step-primary' : ''}`}
              data-content={isTabComplete('employment') ? '✓' : '2'}
            >
              Employment
            </li>
            <li 
              className={`step ${isTabComplete('position') ? 'step-primary' : ''}`}
              data-content={isTabComplete('position') ? '✓' : '3'}
            >
              Position
            </li>
            <li 
              className={`step ${isTabComplete('compensation') ? 'step-primary' : ''}`}
              data-content={isTabComplete('compensation') ? '✓' : '4'}
            >
              Compensation
            </li>
            <li 
              className={`step ${isTabComplete('dependents') ? 'step-primary' : ''}`}
              data-content={isTabComplete('dependents') ? '✓' : '5'}
            >
              Dependents
              {dependents.length > 0 && !isTabComplete('dependents') && (
                <div className="badge badge-error badge-sm absolute -top-2 -right-2" title="Incomplete dependents">!</div>
              )}
            </li>
            <li 
              className={`step ${isTabComplete('documents') ? 'step-primary' : ''} relative`}
              data-content={isTabComplete('documents') ? '✓' : '6'}
            >
              Documents
              {passportDocument && (
                <div className="badge badge-success badge-sm absolute -top-2 -right-2" title="Document uploaded">1</div>
              )}
            </li>
          </ul>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="relative">
          {/* Left fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none opacity-0 transition-opacity duration-300" id="left-fade-add"></div>
          
          {/* Right fade effect */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-base-100 to-transparent z-10 pointer-events-none opacity-0 transition-opacity duration-300" id="right-fade-add"></div>
          
          {/* Scrollable tabs container */}
          <div 
            className="overflow-x-auto scroll-smooth"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgb(209 213 219) transparent'
            }}
            onScroll={(e) => {
              const container = e.target as HTMLElement;
              const leftFade = document.getElementById('left-fade-add');
              const rightFade = document.getElementById('right-fade-add');
              
              if (leftFade && rightFade) {
                // Show left fade if scrolled right
                leftFade.style.opacity = container.scrollLeft > 0 ? '1' : '0';
                
                // Show right fade if can scroll more to the right
                const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);
                rightFade.style.opacity = canScrollRight ? '1' : '0';
              }
            }}
          >
        
            {/* In your JSX, update the tab buttons to this order: */}
            <div className="flex space-x-8 min-w-max px-1">
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'personal' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal Info
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'employment' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('employment')}
              >
                Employment
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'position' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('position')}
              >
                Position & Level
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'compensation' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('compensation')}
              >
                Compensation
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'dependents' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('dependents')}
              >
                Dependents
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'documents' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'training' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('training')}
              >
                Training
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'disciplinary' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('disciplinary')}
              >
                Disciplinary
              </button>
              {/* <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'increments' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('increments')}
              >
                Increments
              </button> */}

            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-lg shadow">


        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="mb-2">Full Name <span className="text-error">*</span></div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter full name"
                  value={formData.name} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                <div className="mb-2">Email Address <span className="text-error">*</span></div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter email address"
                  value={formData.email} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                <div className="mb-2">Password <span className="text-error">*</span></div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    placeholder="Enter password"
                    autoComplete="new-password"
                    value={formData.password} 
                    onChange={handleChange} 
                    className="input input-bordered w-full pr-10 validator" 
                    required 
                  />
                    <p className="validator-hint absolute">Required</p>
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
              </div>
  
<div>
  <div className="mb-2">Country Code <span className="text-error">*</span></div>
  <select 
    name="country_code" 
    value={formData.country_code} 
    onChange={handleChange} 
    className="select select-bordered w-full validator"
    required
  >
    <option value="" disabled>Select country code</option>
{COUNTRY_CODES
  .sort((a, b) => a.label.localeCompare(b.label)) // Sorts alphabetically by label
  .map((c, idx) => (
    <option key={idx} value={c.code}>
      {c.label} ({c.code})
    </option>
  ))}
  </select>
  <p className="validator-hint mt-0">Required</p>
</div>


<div>
  <div className="mb-2">Mobile Number <span className="text-error">*</span></div>
  <div className="flex">
    <span className="px-3 flex items-center border border-r-0 rounded-l-md bg-base-200 text-sm text-gray-600">
      {formData.country_code || '+60'}
    </span>
    <input
      type="tel"
      name="mobile_number"
      placeholder="Enter mobile number"
      value={formData.mobile_number}
      onChange={(e) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
        const selectedCountry = COUNTRY_CODES.find(c => c.code === formData.country_code);

        let formattedValue = rawValue;
        if (selectedCountry?.code === '+60') {
          if (rawValue.length <= 2) {
            formattedValue = rawValue;
          } else if (rawValue.length <= 5) {
            formattedValue = `${rawValue.slice(0, 2)}-${rawValue.slice(2)}`;
          } else {
            formattedValue = `${rawValue.slice(0, 2)}-${rawValue.slice(2, 5)} ${rawValue.slice(5, 9)}`;
          }
        } else if (selectedCountry?.code === '+1') {
          if (rawValue.length <= 3) {
            formattedValue = rawValue;
          } else if (rawValue.length <= 6) {
            formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
          } else {
            formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3, 6)}-${rawValue.slice(6, 10)}`;
          }
        }

        setFormData(prev => ({
          ...prev,
          mobile_number: formattedValue
        }));
      }}
      className="input input-bordered w-full rounded-l-none validator"
      maxLength={15}
      required
    />
  </div>
  <p className="validator-hint mt-0">Required</p>
</div>




<div>
  <div className="mb-2">Nationality <span className="text-error">*</span></div>
  <select 
    name="nationality" 
    value={formData.nationality} 
    onChange={handleChange} 
    className="select select-bordered w-full validator" 
    required
  >
    <option value="" disabled>Select nationality</option>
    {NATIONALITIES.map((n, idx) => (
      <option key={idx} value={n}>{n}</option>
    ))}
  </select>
  <p className="validator-hint mt-0">Required</p>
</div>


              {/* Race field */}
              <div>
                <div className="mb-2">Race </div>
                {/* <span className="text-error">*</span> */}
                
                <select 
                  name="race" 
                  value={formData.race} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator"
                  //required
                >
                  <option value="" disabled>Select race</option>
                  <option value="Malay">Malay</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Others">Others</option>
                </select>
                {/* <p className="validator-hint mt-0">Required</p> */}
              </div>

              {/* Religion field */}
              <div>
                <div className="mb-2">Religion </div>
                {/* <span className="text-error">*</span> */}
                <select 
                  name="religion" 
                  value={formData.religion} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator"
                  //required
                >
                  <option value="" disabled>Select religion</option>
                  <option value="Islam">Islam</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Christian">Christian</option>
                  <option value="Others">Others</option>
                </select>
                {/* <p className="validator-hint mt-0">Required</p> */}
              </div>
              
              <div>
                <div className="mb-2">Date of Birth <span className="text-error">*</span></div>
                <input 
                  type="date" 
                  name="dob" 
                  value={formData.dob} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                <div className="mb-2">Age</div>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age}
                  className="input input-bordered w-full" 
                  readOnly
                />
              </div>
              
              <div>
                <div className="mb-2">Gender <span className="text-error">*</span></div>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator" 
                  required
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                <div className="mb-2">Marital Status <span className="text-error">*</span></div>
                <select 
                  name="marital_status" 
                  value={formData.marital_status} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator" 
                  required
                >
                  <option value="" disabled>Select marital status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                <p className="validator-hint mt-0">Required</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Identity Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="mb-2">IC/Passport Number<span className="text-error">*</span></div>
                  <input 
                    type="text" 
                    name="ic_passport" 
                    placeholder="Enter IC or passport number"
                    value={formData.ic_passport} 
                    onChange={handleChange} 
                    className="input input-bordered w-full validator" 
                    required
                  />
                  <p className={`validator-hint mt-0 ${formData.ic_passport ? 'hidden' : ''}`}>Required</p>
                </div>
              
              <div>
                <div className="mb-2">Passport Expiry Date</div>
                <input 
                  type="date" 
                  name="passport_expired_date" 
                  value={formData.passport_expired_date} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
              
              <div>
                <div className="mb-2">Visa Expiry Date</div>
                <input 
                  type="date" 
                  name="visa_expired_date" 
                  value={formData.visa_expired_date} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-6 mb-8">
              <div>
                <div className="mb-2">Address <span className="text-error">*</span></div>
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Enter full address"
                  value={formData.address} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="mb-2">Contact Name</div>
                <input 
                  type="text" 
                  name="emergency_contact_name" 
                  placeholder="Enter contact name"
                  value={formData.emergency_contact_name} 
                  onChange={handleChange} 
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <div className="mb-2">Relationship</div>
                <input 
                  type="text" 
                  name="emergency_contact_relationship" 
                  placeholder="Enter relationship"
                  value={formData.emergency_contact_relationship} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
              
              <div>
                <div className="mb-2">Phone Number</div>
                <input 
                  type="tel" 
                  name="emergency_contact_phone" 
                  placeholder="Enter phone number"
                  value={formData.emergency_contact_phone} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
              
              <div>
                <div className="mb-2">Email Address</div>
                <input 
                  type="email" 
                  name="emergency_contact_email" 
                  placeholder="Enter email address"
                  value={formData.emergency_contact_email} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Employment Tab */}
        {activeTab === 'employment' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Employment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           
<div>
  <div className="mb-2">Employee Number <span className="text-error">*</span></div>
  <div className="flex gap-2">
    <div className="flex-1 relative">
      <input 
        type="text" 
        name="employee_no" 
        placeholder="Employee number will be auto-generated"
        value={formData.employee_no} 
        onChange={handleChange}
        onBlur={(e) => validateEmployeeNumber(e.target.value)}
        className={`input input-bordered w-full ${
          employeeNoValidation.isValid === false 
            ? 'input-error border-red-500' 
            : employeeNoValidation.isValid === true 
            ? 'input-success border-green-500' 
            : ''
        }`}
        required 
      />
      {(employeeNoValidation.isValidating || isAutoGenerating) && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <div className="loading loading-spinner loading-xs"></div>
        </div>
      )}
    </div>
    <button
      type="button"
      onClick={generateEmployeeNumber}
      disabled={!formData.joined_date || isAutoGenerating}
      className="btn btn-outline btn-primary whitespace-nowrap disabled:opacity-50"
    >
      {isAutoGenerating ? (
        <>
          <span className="loading loading-spinner loading-xs mr-2"></span>
          Generating...
        </>
      ) : (
        'Generate'
      )}
    </button>
  </div>
  {employeeNoValidation.message && (
    <p className={`text-xs mt-1 ${
      employeeNoValidation.isValid === false 
        ? 'text-red-500' 
        : employeeNoValidation.isValid === true 
        ? 'text-green-500' 
        : 'text-gray-500'
    }`}>
      {employeeNoValidation.message}
    </p>
  )}
  {!formData.employee_no && formData.joined_date && (
    <p className="text-xs text-blue-500 mt-1">
      Click "Generate" to create an employee number
    </p>
  )}
</div>
              
              <div>
                <div className="mb-2">Joined Date <span className="text-error">*</span></div>
                <input 
                  type="date" 
                  name="joined_date" 
                  value={formData.joined_date} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                <div className="mb-2">Employment Type <span className="text-error">*</span></div>
                <select 
                  name="employment_type" 
                  value={formData.employment_type} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator" 
                  required
                >
                  <option value="" disabled>Select employment type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Intern">Intern</option>
                </select>
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                <div className="mb-2">Company <span className="text-error">*</span></div>
                <div className="relative">
                  <select 
                    name="company_id" 
                    value={formData.company_id} 
                    onChange={handleChange} 
                    className="select select-bordered w-full validator" 
                    required
                    disabled={companiesLoading}
                  >
                    <option value="" disabled>Select company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.company_name || company.name}
                      </option>
                    ))}
                  </select>
                  <p className="validator-hint mt-0">Required</p>
                  {companiesLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="loading loading-spinner loading-xs"></div>
                    </div>
                  )}
                </div>
                {companies.length === 0 && !companiesLoading && (
                  <p className="text-xs text-amber-500 mt-1">No active companies found</p>
                )}
              </div>
              
              <div>
                <div className="mb-2">Department <span className="text-error">*</span></div>
                <div className="relative">
                  <select 
                    name="department_id" 
                    value={formData.department_id} 
                    onChange={handleChange} 
                    className="select select-bordered w-full validator" 
                    required
                    disabled={!formData.company_id || departmentsLoading}
                  >
                    <option value="" disabled>{!formData.company_id ? 'Select company first' : 'Select department'}</option>
                    {Array.isArray(departments) && departments.length > 0 ? departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                    )) : (
                      <option value="" disabled>No departments available</option>
                    )}
                  </select>
                  <p className="validator-hint mt-0">Required</p>
                  {departmentsLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="loading loading-spinner loading-xs"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="mb-2">Supervisor</div>
                <select 
                  name="superior" 
                  value={formData.superior} 
                  onChange={handleChange} 
                  className="select select-bordered w-full"
                  disabled={!formData.department_id}
                >
                  <option value="" disabled>{formData.department_id ? 'Select supervisor' : 'Select department first'}</option>
                  {departmentEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employee_no})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <div className="mb-2">Manager</div>
                <select 
                  name="manager_id" 
                  value={formData.manager_id} 
                  onChange={handleChange} 
                  className="select select-bordered w-full"
                  disabled={!formData.company_id || managersLoading}
                >
                  <option value="" disabled>
                    {managersLoading 
                      ? 'Loading managers...' 
                      : formData.company_id 
                        ? managers.length > 0 
                          ? 'Select manager' 
                          : 'No managers found for this company'
                        : 'Select company first'}
                  </option>
                  {Array.isArray(managers) && managers.length > 0 && managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.employee_no})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <div className="mb-2">Office Location</div>
                <input 
                  type="text" 
                  name="office" 
                  placeholder="Enter office location"
                  value={formData.office} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>

              <div>
                <div className="mb-2">Education Level </div>
                {/* <span className="text-error">*</span> */}
                <select 
                  name="education_level" 
                  value={formData.education_level} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator" 
                  //required
                >
                  <option value="" disabled>Select education level</option>
                  <option value="No Formal Education">No Formal Education</option>
                  <option value="Primary Education">Primary Education</option>
                  <option value="Lower Secondary Education">Lower Secondary Education</option>
                  <option value="Upper Secondary Education">Upper Secondary Education</option>
                  <option value="Post-Secondary Non-Tertiary Education">Post-Secondary Non-Tertiary Education</option>
                  <option value="Vocational/Technical Certificate or Diploma">Vocational/Technical Certificate or Diploma</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate (PhD or equivalent)</option>
                </select>
                {/* <p className="validator-hint mt-0">Required</p> */}
              </div>

              <div>
                <div className="mb-2">Qualification</div>
                <input 
                  type="text" 
                  name="qualification" 
                  placeholder="Enter qualification"
                  value={formData.qualification} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Position & job level tab */}
        {activeTab === 'position' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Position & Job Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="mb-2">Position <span className="text-error">*</span></div>
                <div className="relative">
                  <select 
                    name="position" 
                    value={formData.position} 
                    onChange={handleChange} 
                    className="select select-bordered w-full validator" 
                    required
                    disabled={!formData.department_id || positionsLoading || 
                             (!!formData.department_id && uniquePositionTitles.length === 0)}
                  >
                    <option value="" disabled>
                      {!formData.department_id
                        ? 'Select department first'
                        : positionsLoading
                        ? 'Loading positions...'
                        : 'Select position'}
                    </option>
                    {formData.department_id &&
                      !positionsLoading &&
                      uniquePositionTitles.map(title => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                  </select>
                  <p className="validator-hint mt-0">Required</p>
                  {positionsLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="loading loading-spinner loading-xs"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="mb-2">Job Level <span className="text-error">*</span></div>
                <select 
                  name="job_level" 
                  value={formData.job_level} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator" 
                  required
                  disabled={!formData.position || availableJobLevels.length === 0}
                >
                  <option value="" disabled>{formData.position ? 'Select job level' : 'Select position first'}</option>
                  {availableJobLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <p className="validator-hint mt-0">Required</p>
              </div>
            </div>
            {/* Benefit Group */}
<div className="flex flex-col gap-2 md:col-span-2">
  <label htmlFor="benefit_group_id" className="mb-0">
    Claim Benefit Group <span className="text-red-500">*</span>
  </label>

  {/* Create Mode - Dropdown only */}
  <div className="relative">
<select
  id="benefit_group_id"
  name="benefit_group_id"
  value={formData?.benefit_group_id || ""}
  onChange={handleBenefitGroupChange}
  className="select select-bordered w-full"
  disabled={benefitGroupsLoading || savingGroup}
  aria-busy={benefitGroupsLoading || savingGroup}
>
  <option value="">
    {benefitGroupsLoading ? "Loading benefit groups…" : "Select Benefit Group"}
  </option>
  
  {/* Updated filter logic with proper type conversion */}
  {!benefitGroupsLoading &&
    benefitGroups
      .filter(group => {
        const groupCompanyId = group.company_id ? String(group.company_id) : null;
        const formCompanyId = formData?.company_id ? String(formData.company_id) : null;
        
        if (!group.company_id) return true;
        return groupCompanyId === formCompanyId;
      })
      .map(group => (
        <option key={group.id} value={String(group.id)}> {/* Convert to string */}
          {group.name}
          {group.company_id
            ? ` (Company: ${
                companies.find((c) => c.id === String(group.company_id))?.name || group.company_id
              })`
            : ""}
        </option>
      ))}
</select>
    {(benefitGroupsLoading || savingGroup) && (
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <span className="loading loading-spinner loading-xs" aria-hidden="true" />
      </div>
    )}
  </div>

  {/* Info panel: show details for the selected group */}
  {currentGroupInfo && (
    <div className="mt-3 rounded-lg border border-gray-200 p-5 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">Selected Group</div>
          <div className="text-lg font-semibold text-gray-900">
            {currentGroupInfo.group_name}
          </div>
          {currentGroupInfo.description && (
            <div className="text-sm text-gray-600 mt-1">
              {currentGroupInfo.description}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <span className={`badge ${currentGroupInfo.is_active ? "badge-success" : "badge-ghost"}`}>
            {currentGroupInfo.is_active ? "Active" : "Inactive"}
          </span>
          {currentGroupInfo.is_recurring && (
            <span className="badge badge-info">Recurring</span>
          )}
        </div>
      </div>

      {currentGroupInfo.items && currentGroupInfo.items.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700">Benefit Items</div>
            <div className="text-xs text-gray-500">
              Total: <span className="font-semibold text-gray-800">
                {currentGroupInfo.benefit_count ?? currentGroupInfo.items.length}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {currentGroupInfo.items.map(item => (
              <div key={item.id} className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.benefit_type_name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.frequency} • {item.amount}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(item.start_date).toLocaleDateString()} – {new Date(item.end_date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge ${item.is_active ? "badge-success" : "badge-ghost"}`}>
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 mt-4">No benefit items found.</div>
      )}
    </div>
  )}
</div>
</div>
        )}

        {/* Compensation Tab */}
        {activeTab === 'compensation' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Salary Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="mb-2">Salary <span className="text-error">*</span></div>
                <input 
                  type="number" 
                  name="salary" 
                  placeholder="Enter salary amount"
                  value={formData.salary} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                   <div className="mb-2">Currency <span className="text-error">*</span></div>
                    <select 
                      name="currency" 
                      value={formData?.currency || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select currency</option>
                      {loading ? (
                        <option disabled>Loading currencies...</option>
                      ) : error ? (
                        <option disabled>Error loading currencies</option>
                      ) : (
                        <>
                          {/* Default currencies that should always be available */}
                          {/* <option value="MYR">Malaysian Ringgit (MYR)</option> */}

                          {/* Dynamic currencies from API - Ensure unique keys */}
                              {currencyRates
      // Remove duplicates by currency code AND ensure unique keys
      .filter((rate, index, self) => 
        index === self.findIndex(r => 
          r.from_code === rate.from_code && r.bank_id === rate.bank_id
        )
      )
      .map(rate => (
        <option 
          key={`bank-${rate.from_code}-${rate.bank_id}`} // Unique key
          value={rate.from_code}
        >
          {rate.to_currency_name} ({rate.from_code})</option>
      ))
    }
                        </>
                      )}
                    </select>
                </div>

<div>
  <div className="mb-2">Payment Company <span className="text-error">*</span></div>
  <div className="relative">
    <select 
      name="payment_company" 
      value={formData.payment_company} 
      onChange={handleChange} 
      className="select select-bordered w-full validator" 
      required
      disabled={companiesLoading}
    >
      <option value="" disabled>Select payment company</option>
      {companies.map(company => (
        <option key={company.id} value={company.company_name || company.name}>
          {company.company_name || company.name}
        </option>
      ))}
    </select>
    <p className="validator-hint mt-0">Required</p>
    {companiesLoading && (
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div className="loading loading-spinner loading-xs"></div>
      </div>
    )}
  </div>
  {companies.length === 0 && !companiesLoading && (
    <p className="text-xs text-amber-500 mt-1">No active companies found</p>
  )}
</div>

              
               {/* Pay Interval field */}
                <div>
                  <div className="mb-2">Pay Interval <span className="text-error">*</span></div>
                    <select 
                      name="pay_interval" 
                      value={formData?.pay_interval || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select pay interval</option>
                      {payrollConfigs.map(config => (
                        <option key={config.id} value={config.pay_interval}>
                          {config.pay_interval}
                        </option>
                      ))}
                    </select>
                </div>


              <div>
                <div className="mb-2">Payment Method <span className="text-error">*</span></div>
                <select 
                  name="payment_method" 
                  value={formData.payment_method} 
                  onChange={handleChange} 
                  className="select select-bordered w-full validator" 
                  required
                >
                  <option value="" disabled>Select payment method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
                <p className="validator-hint mt-0">Required</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

               <div>
                <div className="mb-2">Bank Name <span className="text-error">*</span></div>

                    <select
                      name="bank_name"
                      value={formData?.bank_name || ''}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="" disabled>Select bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.bank_name}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </select>
                </div>
              
              
              {/* Bank Currency field */}
              <div>
                <div className="mb-2">Bank Currency <span className="text-error">*</span></div>
 <select 
    name="bank_currency" 
    value={formData?.bank_currency || ''} 
    onChange={handleChange} 
    className="select select-bordered w-full" 
    required
  >
    <option value="" disabled>Select currency</option>
    
    {/* Show loading state */}
    {loading && <option disabled>Loading currencies...</option>}
    
    {/* Show error state */}
    {error && <option disabled>Error loading currencies</option>}
    
    {/* Always include MYR as base currency */}
    {/* <option value="MYR">Malaysian Ringgit (MYR)</option> */}
    
    {/* Dynamic currencies from API */}
    {currencyRates
      // Remove duplicates by currency code AND ensure unique keys
      .filter((rate, index, self) => 
        index === self.findIndex(r => 
          r.from_code === rate.from_code && r.bank_id === rate.bank_id
        )
      )
      .map(rate => (
        <option 
          key={`bank-${rate.from_code}-${rate.bank_id}`} // Unique key
          value={rate.from_code}
        >
          {rate.to_currency_name} ({rate.from_code})</option>
      ))
    }
  </select>
              </div>
              
              <div>
                <div className="mb-2">Bank Account Name <span className="text-error">*</span></div>
                <input 
                  type="text" 
                  name="bank_account_name" 
                  placeholder="Enter account holder name"
                  value={formData.bank_account_name} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
              
              <div>
                <div className="mb-2">Bank Account Number <span className="text-error">*</span></div>
                <input 
                  type="text" 
                  name="bank_account_no" 
                  placeholder="Enter account number"
                  value={formData.bank_account_no} 
                  onChange={handleChange} 
                  className="input input-bordered w-full validator" 
                  required 
                />
                <p className="validator-hint mt-0">Required</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Tax Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="mb-2">Income Tax Number</div>
                <input 
                  type="text" 
                  name="income_tax_no" 
                  placeholder="Enter income tax number"
                  value={formData.income_tax_no} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
              
              <div>
                <div className="mb-2">SOCSO Account Number</div>
                <input 
                  type="text" 
                  name="socso_account_no" 
                  placeholder="Enter SOCSO account number"
                  value={formData.socso_account_no} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
              
              <div>
                <div className="mb-2">EPF Account Number</div>
                <input 
                  type="text" 
                  name="epf_account_no" 
                  placeholder="Enter EPF account number"
                  value={formData.epf_account_no} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Dependents Tab */}
        {activeTab === 'dependents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Dependents Records</h2>
                <p className="text-gray-600 mt-1">
                  Manage employee dependents records.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditingDependent(null);
                  setDependentForm({
                    full_name: '',
                    relationship: 'Child',
                    birth_date: '',
                    gender: '',
                    is_disabled: false,
                    is_studying: false,
                    nationality: '',
                    identification_no: '',
                    notes: '',
                    child_relief_percent: 0
                  });
                  setShowDependentModal(true);
                }}
              >
                + Add Dependent
              </button>
            </div>

            {/* List */}
            {dependents.length === 0 ? (
              // <div className="rounded-2xl bg-base-200 p-12 text-center">
              //   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              //   </svg>
              //   <p className="text-gray-500 text-lg mb-2">No dependents yet</p>
              //   <p className="text-gray-400 text-sm">
              //     Click "Add Dependent" to get started.
              //   </p>
              // </div>
              <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500">No dependents records yet. Click "Add dependents" to get started.</p>
                </div>
            ) : (
              <div className="space-y-4">
                {dependents.map((d) => {
                  const dob = d.birth_date ? new Date(d.birth_date) : null;
                  const age = dob
                    ? Math.max(
                        0,
                        new Date().getFullYear() -
                          dob.getFullYear() -
                          (new Date() <
                          new Date(new Date().getFullYear(), dob.getMonth(), dob.getDate())
                            ? 1
                            : 0)
                      )
                    : null;

                  const isDisabled = !!d.is_disabled;
                  const isStudying = !!d.is_studying;

                  // Relief badge: show only for Children; include 0%
                  const isChild = d.relationship === "Child";
                  const hasReliefValue = d.child_relief_percent !== undefined && d.child_relief_percent !== null;
                  const showRelief = isChild && hasReliefValue;
                  const reliefPct = hasReliefValue ? Number(d.child_relief_percent) : 0;

                  return (
                    <div
                      key={depKey(d)}
                      className="rounded-2xl border border-base-300 bg-base-100 shadow-sm"
                    >
                      {/* Header: name + age + actions */}
                      <div className="p-5 flex items-start justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold truncate">{d.full_name}</h3>
                            {age !== null && <span className="badge badge-ghost">{age} yrs</span>}
                            {d.is_temp && (
                              <span className="badge badge-warning badge-sm">Not Saved</span>
                            )}
                          </div>

                          {/* Wide, readable info strip */}
                          <div className="mt-3 flex flex-wrap gap-x-10 gap-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">Relationship:</span>{" "}
                              <span className="font-medium text-gray-800">{d.relationship || "-"}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Nationality:</span>{" "}
                              <span className="font-medium text-gray-800">{d.nationality || "-"}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Gender:</span>{" "}
                              <span className="font-medium text-gray-800">{d.gender || "-"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            title="Edit"
                            onClick={() => {
                              setDependentForm({
                                ...d,
                                is_disabled: d.is_disabled || false,
                                is_studying: d.is_studying || false,
                                child_relief_percent: d.child_relief_percent ?? 0,
                                birth_date: toDateOnly(d.birth_date) || '',
                              });
                              setEditingDependent(d);
                              setShowDependentModal(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm text-error"
                            title="Remove"
                            onClick={() => handleDeleteDependent(depKey(d))}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Details band */}
                      <div className="px-5 pb-5">
                        <div className="rounded-xl border border-base-200 bg-base-200 p-4">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {isDisabled && <span className="badge badge-success">Disabled</span>}
                            {isStudying && <span className="badge badge-info">Studying</span>}
                            {showRelief && <span className="badge">{Math.round(reliefPct)}% Relief</span>}
                            {!isDisabled && !isStudying && !showRelief && (
                              <span className="text-sm text-gray-500">No special flags.</span>
                            )}
                          </div>

                          {/* Key facts */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Date of Birth</div>
                              <div className="font-medium">
                                {d.birth_date ? formatDateForDisplay(d.birth_date) : "-"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">ID/Passport</div>
                              <div className="font-medium">{d.identification_no || "-"}</div>
                            </div>
                          </div>

                          {d.notes && (
                            <div className="mt-4">
                              <div className="text-gray-500 text-sm mb-1">Notes</div>
                              <div className="text-sm">{d.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add/Edit Dependent Modal */}
            {showDependentModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dep-modal-title"
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowDependentModal(false)} />

                {/* Dialog */}
                <div className="relative bg-base-100 rounded-xl shadow-2xl w-full max-w-5xl md:max-w-6xl">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <h3 id="dep-modal-title" className="text-lg font-semibold">
                      {editingDependent ? 'Edit Dependent' : 'Add Dependent'}
                    </h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => setShowDependentModal(false)}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body: scrollable, with gutter so scrollbar doesn't overlap fields */}
                  <div className="px-6 pt-6">
                    <div className="max-h-[70vh] overflow-y-auto pr-6 -mr-6 [scrollbar-gutter:stable] [scrollbar-width:thin]">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Full Name */}
                        <div>
                          <div className="mb-2">
                            Full Name <span className="text-error">*</span>
                          </div>
                          <input
                            type="text"
                            name="full_name"
                            className="input input-bordered w-full validator"
                            placeholder="Enter full name"
                            value={dependentForm.full_name}
                            onChange={handleDependentChange}
                            required
                            autoFocus
                          />
                          <p className={`validator-hint mt-0 ${dependentForm.full_name ? 'hidden' : ''}`}>Required</p>
                        </div>

                        {/* Relationship */}
                        <div>
                          <div className="mb-2">
                            Relationship <span className="text-error">*</span>
                          </div>
                          <select
                            name="relationship"
                            className="select select-bordered w-full validator"
                            value={dependentForm.relationship}
                            onChange={handleDependentChange}
                            required
                          >
                            <option value="" disabled>Select relationship</option>
                            <option value="Child">Child</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Parent">Parent</option>
                            <option value="Other">Other</option>
                          </select>
                          <p className={`validator-hint mt-0 ${dependentForm.relationship ? 'hidden' : ''}`}>Required</p>
                        </div>

                        {/* DOB */}
                        <div>
                          <div className="mb-2">
                            Date of Birth <span className="text-error">*</span>
                          </div>
                          <input
                            type="date"
                            name="birth_date"
                            className="input input-bordered w-full validator"
                            value={dependentForm.birth_date}
                            onChange={handleDependentChange}
                            required
                          />
                          <p className={`validator-hint mt-0 ${dependentForm.birth_date ? 'hidden' : ''}`}>Required</p>
                        </div>

                        {/* Gender */}
                        <div>
                          <div className="mb-2">Gender</div>
                          <select
                            name="gender"
                            className="select select-bordered w-full"
                            value={dependentForm.gender || ''}
                            onChange={handleDependentChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Nationality */}
                        <div>
                          <div className="mb-2">Nationality</div>
                          <select
                            name="nationality"
                            className="select select-bordered w-full"
                            value={dependentForm.nationality || ''}
                            onChange={handleDependentChange}
                          >
                            <option value="" disabled>Select nationality</option>
                            {[...new Set(NATIONALITIES)].sort().map((nat) => (
                              <option key={nat} value={nat}>
                                {nat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* ID/Passport */}
                        <div>
                          <div className="mb-2">ID/Passport Number</div>
                          <input
                            type="text"
                            name="identification_no"
                            className="input input-bordered w-full"
                            placeholder="Enter ID/Passport number"
                            value={dependentForm.identification_no || ''}
                            onChange={handleDependentChange}
                          />
                        </div>

                        {/* Child-only fields */}
                        {dependentForm.relationship === 'Child' && (
                          <>
                            <div className="form-control">
                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  name="is_disabled"
                                  checked={dependentForm.is_disabled || false}
                                  onChange={handleDependentChange}
                                  className="checkbox checkbox-sm"
                                />
                                <span>Disabled</span>
                              </label>
                            </div>

                            <div className="form-control">
                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  name="is_studying"
                                  checked={dependentForm.is_studying || false}
                                  onChange={handleDependentChange}
                                  className="checkbox checkbox-sm"
                                />
                                <span>Studying</span>
                              </label>
                            </div>

                            <div>
                              <div className="mb-2">Child Relief Percent</div>
                              <select
                                name="child_relief_percent"
                                className="select select-bordered w-full"
                                value={dependentForm.child_relief_percent || 0}
                                onChange={handleDependentChange}
                              >
                                <option value={0}>0%</option>
                                <option value={50}>50%</option>
                                <option value={100}>100%</option>
                              </select>
                            </div>
                          </>
                        )}

                        {/* Notes spans full width on all breakpoints */}
                        <div className="xl:col-span-3 md:col-span-2 col-span-1">
                          <div className="mb-2">Additional Notes</div>
                          <textarea
                            name="notes"
                            className="textarea textarea-bordered w-full"
                            placeholder="Enter any additional notes"
                            value={dependentForm.notes || ''}
                            onChange={handleDependentChange}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer (outside scroll, stays visible) */}
                  <div className="p-6 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowDependentModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSaveDependent(dependentForm)}
                    >
                      {editingDependent ? 'Update Dependent' : 'Add Dependent'}
                    </button>
                  </div>


                </div>
              </div>
            )}
          </div>
        )}

        
        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Document Uploads</h2>
            <p className="text-gray-600 mb-6">Upload important employee documents for record keeping.</p>
            
            <EmployeeDocumentManager 
              employeeId={newEmployeeId}
              mode="add"
              onDocumentsUploaded={handleDocumentsUploaded}
              documentTypes={EMPLOYEE_DOCUMENT_TYPES}
              moduleName="employee-data"
              onFilesSelected={handleDocumentsTabFilesSelected}
              initialDocuments={allSelectedFiles}
              onDocumentDeleted={handleDocumentsTabDocumentDeleted}
            />
            
            {allSelectedFiles.length > 0 && (
              <div className="alert alert-info mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-medium">{allSelectedFiles.length} document(s) selected across all tabs</p>
                  <p>These documents will be uploaded when you submit the employee record.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Training Records</h2>
                <p className="text-gray-600">Manage employee training records and certifications.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleOpenTrainingModal()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Training Record
              </button>
            </div>

            {/* Training Records List */}
            <div className="space-y-4">
              {trainingRecords.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500">No training records yet. Click "Add Training Record" to get started.</p>
                </div>
              ) : (
                trainingRecords.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    type="training"
                    isEditing={true}
                    onEdit={(record) => handleOpenTrainingModal(record as TrainingRecord)}
                    onDelete={handleDeleteTrainingRecord}
                  />
                ))
              )}
            </div>

            {/* Training Modal */}
            <TrainingModal
              isOpen={showTrainingModal}
              record={editingTrainingRecord}
              onSave={handleSaveTrainingRecord}
              onCancel={handleCloseTrainingModal}
              employeeId={newEmployeeId}
              documentTypes={EMPLOYEE_TRAINING_RECORDS_DOCUMENT}
              moduleName="employee-data"
            />

            {/* Training Confirmation Modal */}
            {showConfirmationModal && (
              <ConfirmationModal
                isOpen={showConfirmationModal}
                title={confirmationTitle}
                message={confirmationMessage}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonClass="btn-error"
              />
            )}
          </div>
        )}

        {/* Disciplinary Tab */}
        {activeTab === 'disciplinary' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Disciplinary Records</h2>
                <p className="text-gray-600">Manage employee disciplinary records and actions.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleOpenDisciplinaryModal()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Disciplinary Record
              </button>
            </div>

            {/* Disciplinary Records List */}
            <div className="space-y-4">
              {disciplinaryRecords.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No disciplinary records yet. Click "Add Disciplinary Record" to get started.</p>
                </div>
              ) : (
                disciplinaryRecords.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    type="disciplinary"
                    isEditing={true}
                    onEdit={(record) => handleOpenDisciplinaryModal(record as DisciplinaryRecord)}
                    onDelete={handleDeleteDisciplinaryRecord}
                  />
                ))
              )}
            </div>

            {/* Disciplinary Modal */}
            <RecordModal
              type="disciplinary"
              isOpen={showDisciplinaryModal}
              record={editingDisciplinaryRecord}
              onSave={(record) => handleSaveDisciplinaryRecord(record as DisciplinaryRecord)}
              onCancel={handleCloseDisciplinaryModal}
              employeeId={newEmployeeId}
              documentTypes={EMPLOYEE_DISCIPLINARY_RECORDS_DOCUMENT}
              moduleName="employee-data"
            />

            {/* Confirmation Modal */}
            {showConfirmationModal && (
              <ConfirmationModal
                isOpen={showConfirmationModal}
                title={confirmationTitle}
                message={confirmationMessage}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonClass="btn-error"
              />
            )}
          </div>
        )}


        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">{confirmationTitle}</h3>
              <p className="py-4">{confirmationMessage}</p>
              <div className="modal-action">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-error" 
                  onClick={confirmationAction}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
       
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        
        
        {apiConnectionMessage && (
          <div className="alert alert-warning mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <span className="font-medium">API Connection Issue:</span> {apiConnectionMessage}
              <p className="text-sm mt-1">Make sure your backend server is running and API routes are configured properly.</p>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2">
                  <label className="flex items-center cursor-pointer gap-2">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm" 
                      checked={useMockApi}
                      onChange={toggleMockApi}
                    />
                    <span className="label-text">Use mock API for testing (will simulate successful submissions)</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            {activeTab !== 'personal' && (
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => {
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1]);
                  }
                }}
              >
                Previous
              </button>
            )}
            
            <Link href="/employees" className="btn btn-outline">
              Cancel
            </Link>
            
            {activeTab !== 'documents' ? (
              <div className="flex flex-col">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (validateCurrentTab(activeTab)) {
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }
                  }}
                >
                  Next
                </button>
              </div>
            ) : (
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                  'Submit Employee'
              )}
            </button>
            )}
          </div>
          {tabValidationError && (
            <p className="text-error text-sm mt-2 text-right">{tabValidationError}</p>
          )}
        </div>

        
      </form>
    </div>
  );
}
