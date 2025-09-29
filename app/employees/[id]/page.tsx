
// app/employees/[id]/page.tsx

'use client';
import { NATIONALITIES } from '@/app/utils/countryData';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DocumentManager, { EmployeeDocument as UploaderDocument } from '@/app/components/DocumentManager';
import { calculateAge ,hasRealDate} from '@/app/utils/utils';
import { useTheme } from '../../components/ThemeProvider';
import ConfirmationModal, { TrainingModal, RecordModal, TrainingRecord as ImportedTrainingRecord, DisciplinaryRecord as ImportedDisciplinaryRecord } from '@/app/components/Modal';
import RecordCard from '@/app/components/Card';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';
import SingleIncrementTab, { IncrementKind } from '@/app/components/payroll/SingleIncrementTab';
import { CalendarIcon, Edit3, FileText, Trash2 , DollarSign, Repeat } from 'lucide-react';
import PositionChangeConfirmModal from '@/app/components/PositionChangeConfirmModal';


// NEW: attendance/office related types
interface Office {
  id: string;
  company_id: string;
  name: string;
  address?: string;
  timezone?: string;
}

interface IpOverride {
  id: string;
  employee_id: string;
  ip_address: string;
  label?: string;
  created_at?: string;
}


interface AttendanceIpPolicy {
  mode: PolicyMode;
  trust_proxy: boolean;
  scope?: 'GLOBAL' | 'COMPANY' | 'EMPLOYEE';
  company_id?: number | null;
  employee_id?: number | null;
  allowed_proxy_ips?: string;
}


// put this near the component (or in a utils file)
type PolicyMode = 'FLAG_ONLY' | 'ENFORCE';
const toPolicyMode = (v: unknown): PolicyMode =>
  v === 'ENFORCE' ? 'ENFORCE' : 'FLAG_ONLY';



interface AllowanceMaster {
id: number;
name: string;
max_limit: number | null;
is_taxable?: boolean | number;
is_bonus?: boolean | number;
is_epf_eligible?: boolean | number;
is_socso_eligible?: boolean | number;
is_eis_eligible?: boolean | number;
prorate_by_percentage?: boolean | number;
}


interface EmployeeAllowanceRow {
id: number; // employee_allowances.id
allowance_id: number; // FK -> allowance_master.id
allowance_name: string; // joined from master
amount: number | null;
is_recurring: boolean | number; // 1/0 in DB, bool for UI
effective_date: string | null; // YYYY-MM-DD
end_date: string | null; // YYYY-MM-DD
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

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  password: string;
  salary: string;
  currency: string;
  company_id: string;
  manager_id: string;
  role: string;
  joined_date: string;
  current_position_start_date?: string | null;
  resigned_date: string | null;
  resignation_reason?: string | null;
  gender: string;
  employee_no: string;
  employment_type: string;
  job_level: string;
  department_id: string;
  position: string;
  position_id: string;
  superior: string;
  office: string;
  nationality: string;
  visa_expired_date: string | null;
  passport_expired_date: string | null;
  status: string;
  activation: string;
  ic_passport: string | null;
  confirmation_date: string | null;
  marital_status: string;
  dob: string;
  age: string;
  mobile_number: string;
  country_code: string | null;
  payment_company: string;
  pay_interval: string;
  payment_method: string;
  bank_name: string;
  bank_currency: string;
  bank_account_name: string;
  bank_account_no: string;
  income_tax_no: string | null;
  socso_account_no: string | null;
  epf_account_no: string | null;
  company: string | null;
  race: string | null;
  religion: string | null;
  education_level: string | null;
  qualification: string | null;
  training_remarks?: string | null;
  disciplinary_remarks?: string | null;
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relationship?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_email?: string | null;
  education?: Education[];
  documents?: APIDocument[];
  department_name?: string;
  showPassword?: boolean;
  //dependents?: Dependent[];
  benefit_group_id?: string | null;
  office_id?: string | null;
}

interface Education {
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  grade: string;
  location: string;
  description: string;
}

interface APIDocument {
  id: number;
  name: string;
  url?: string;
  key?: string;
  file_name: string;
  file_url: string;
  uploadDate: string;
  documentType: 'ID' | 'Passport' | 'Work_Permit' | 'Employment_Agreement' | 'Education' | 'Resume' | 'Other';
}

// Using TrainingRecord and DisciplinaryRecord types from Modal.tsx
type TrainingRecord = ImportedTrainingRecord;
type DisciplinaryRecord = ImportedDisciplinaryRecord;

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

interface PastPosition {
  company_name: string;
  department_name: string;
  position_title: string;
  job_level: string;
  start_date: string;
  end_date : string;
  created_at: string;
  is_current: number;
}

// Add this near the top of the file with other API functions
const getEmployeeById = async (id: string): Promise<EmployeeData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/employees/${id}`);
    if (!response.ok) throw new Error('Failed to fetch employee');
    return await response.json();
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
};

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

interface IncrementHistory {
  id: string;
  effectiveDate: string;
  type: 'PERCENT' | 'FIXED';
  previousSalary: number;
  newSalary: number;
  amount: number;
  percentage: number;
  reason: string;
  createdAt: string;
  createdBy: string;
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

interface BenefitGroup {
  id: number;
  name: string;
  description?: string;
  company_id?: string;
}

type CurrentGroupInfo = {
  group_id: number;
  group_name: string;
  description?: string;
  is_active: number;
  is_recurring: number;
  benefit_count: number;
  assigned_count: number;
  assigned_at: string;
  items?: BenefitItem[];
  employees?: GroupEmployee[];
};

type BenefitItem = {
  id: number;
  benefit_type_name: string;
  amount: string;
  frequency: string;
  start_date: string;
  end_date: string;
  is_active: number;
};

type GroupEmployee = {
  id: number;
  name: string;
  company_name: string;
  department_name: string;
  assigned_at: string;
};

export default function EmployeeDetails() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

const [policy, setPolicy] = useState<AttendanceIpPolicy>({
  mode: 'FLAG_ONLY',
  trust_proxy: false,
});


// NEW: Offices list & loading
const [offices, setOffices] = useState<Office[]>([]);
const [officesLoading, setOfficesLoading] = useState(false);

// NEW: Employee IP overrides
const [ipOverrides, setIpOverrides] = useState<IpOverride[]>([]);
const [ipSaving, setIpSaving] = useState(false);
const [ipForm, setIpForm] = useState<{ ip_address: string; label: string }>({
  ip_address: '',
  label: ''
});

// NEW: Policy

const [policySaving, setPolicySaving] = useState(false);


// NEW: fetch offices for a company


const fetchOffices = async (companyId: string | number) => {
  if (!companyId) {
    console.log('[fetchOffices] No companyId -> clearing offices');
    setOffices([]);
    return;
  }

  const url = `${API_BASE_URL}/api/attendance/offices`;
  const token = localStorage.getItem('hrms_token');
  const companyIdNum = Number(companyId);

  console.log(`[fetchOffices] START companyId=${companyId}`);
  console.time('[fetchOffices] total');

  try {
    setOfficesLoading(true);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    console.log('[fetchOffices] HTTP', res.status, res.statusText);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn('[fetchOffices] Non-OK body:', body.slice(0, 400));
      throw new Error(`Failed to load offices (${res.status})`);
    }

    const payload = await res.json();

    // Accept either: [ ... ]  OR  { ok: true, data: [ ... ] }
    const rawArray =
      Array.isArray(payload) ? payload :
      (payload && Array.isArray(payload.data)) ? payload.data :
      [];

    if (payload && payload.ok === false) {
      console.warn('[fetchOffices] Server ok=false, payload:', payload);
    }

    console.log('[fetchOffices] rawArray length:', rawArray.length);
    if (rawArray.length) console.log('[fetchOffices] sample:', rawArray.slice(0, 3));

    const distinctCompanyIds = [...new Set(rawArray.map((d: any) => String(d?.company_id)))];
    console.log('[fetchOffices] distinct company_ids:', distinctCompanyIds);

    const filtered = rawArray.filter((o: any) => Number(o?.company_id) === companyIdNum);

    console.log('[fetchOffices] filtered length:', filtered.length);
    if (filtered.length) {
      console.table(filtered.map((o: any) => ({ id: o.id, name: o.name, company_id: o.company_id })));
    } else {
      console.warn(`[fetchOffices] No matches for companyId=${companyIdNum}. Payload company_ids: ${distinctCompanyIds.join(', ')}`);
    }

    setOffices(filtered);

    // // Optional: log current selection to explain “Unassigned”
    // try {
    //   // @ts-ignore debug only – adjust to your state
    //   const selected = formData?.office_id ?? employee?.office_id ?? null;
    //   console.log('[fetchOffices] current selected office_id:', selected);
    //   if (selected != null) {
    //     const found = filtered.find((o: any) => String(o.id) === String(selected));
    //     console.log('[fetchOffices] selected exists in filtered?', Boolean(found), found || null);
    //   }
    // } catch {}

    try {

  const selected = formData?.office_id ?? employee?.office_id ?? null;

  console.log('[fetchOffices] current selected office_id:', selected);
  if (selected != null) {
    const found = filtered.find((o: any) => String(o.id) === String(selected));
    console.log('[fetchOffices] selected exists in filtered?', Boolean(found), found || null);
  }
} catch {}


  } catch (err) {
    console.error('[fetchOffices] ERROR:', err);
    setOffices([]);
  } finally {
    setOfficesLoading(false);
    console.timeEnd('[fetchOffices] total');
    console.log('[fetchOffices] END');
  }
};


const fetchPolicy = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/attendance/ip-policy?scope=EMPLOYEE&employee_id=${employeeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to load policy');

    const payload = await res.json();
    const p = payload?.data ?? payload ?? {};
    setPolicy({
      mode: p.mode === 'ENFORCE' ? 'ENFORCE' : 'FLAG_ONLY',
      trust_proxy: !!(p.trust_proxy ?? false),
    });
  } catch (e) {
    console.error(e);
    setPolicy({ mode: 'FLAG_ONLY', trust_proxy: false });
  }
};

const fetchIpOverrides = async () => {
  if (!employeeId) return;
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/attendance/employee-ip-overrides?employee_id=${employeeId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` } }
    );
    const payload = await res.json();
    setIpOverrides(payload?.data ?? []);
  } catch (e) {
    console.error(e);
    setIpOverrides([]);
  }
};

const fetchOfficeRanges = async () => {
  if (!employee?.office_id) {
    setOfficeRanges([]);
    return;
  }
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/attendance/office-ip-whitelists?office_id=${employee.office_id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` } }
    );
    const payload = await res.json();
    setOfficeRanges(payload?.data ?? []);
  } catch (e) {
    console.error(e);
    setOfficeRanges([]);
  }
};

const fetchOfficeRangesForEmployee = async () => {
  const oid = formData?.office_id ?? employee?.office_id;
  if (!oid) { setOfficeRanges([]); return; }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/attendance/office-ip-whitelists?office_id=${oid}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` } }
    );

    if (!res.ok) throw new Error(`Failed to load office IP ranges (${res.status})`);
    const payload = await res.json().catch(() => ({} as any));

    // Controller may return { ok, data: [] } or just []
    const rows = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
    setOfficeRanges(rows || []);
  } catch (e) {
    console.error(e);
    setOfficeRanges([]);
  }
};

const [officeRanges, setOfficeRanges] = useState<{ id:number; cidr:string; description?:string; is_active:boolean }[]>([]);


// master + employee allowance state
const [allowanceMasters, setAllowanceMasters] = useState<AllowanceMaster[]>([]);
const [empAllowances, setEmpAllowances] = useState<EmployeeAllowanceRow[]>([]);
const [allowancesLoading, setAllowancesLoading] = useState(false);
const [allowancesError, setAllowancesError] = useState<string>('');

// Allowance delete modal state
const [showDeleteAllowanceModal, setShowDeleteAllowanceModal] = useState(false);
const [allowanceToDelete, setAllowanceToDelete] = useState<EmployeeAllowanceRow | null>(null);
const [deletingAllowance, setDeletingAllowance] = useState(false);


// modal + form state
const [showAllowanceModal, setShowAllowanceModal] = useState(false);
const [editingAllowance, setEditingAllowance] = useState<EmployeeAllowanceRow | null>(null);
const [allowanceForm, setAllowanceForm] = useState<{
allowance_id: number | '';
amount: string; // string in form; parse on save
is_recurring: boolean;
effective_date: string; // YYYY-MM-DD
end_date: string; // YYYY-MM-DD
}>({ allowance_id: '', amount: '', is_recurring: true, effective_date: '', end_date: '' });


// inline quick-create of new allowance type (optional)
const [showQuickCreate, setShowQuickCreate] = useState(false);
const [creatingType, setCreatingType] = useState(false);
const [quickCreate, setQuickCreate] = useState({
name: '',
is_taxable: false,
max_limit: '', // '' or numeric string
is_bonus: false,
is_epf_eligible: true,
is_socso_eligible: true,
is_eis_eligible: true,
prorate_by_percentage: false,
});
  

const b = (v: any) => (typeof v === 'boolean' ? v : Boolean(Number(v)));


const fetchAllowanceMasters = useCallback(async () => {
try {
const res = await fetch(`${API_BASE_URL}/api/master-data/allowances`);
if (!res.ok) throw new Error('Failed');
const data: AllowanceMaster[] = await res.json();
setAllowanceMasters(
(data || []).map(a => ({
...a,
is_taxable: b(a.is_taxable),
is_bonus: b(a.is_bonus),
is_epf_eligible: b(a.is_epf_eligible),
is_socso_eligible: b(a.is_socso_eligible),
is_eis_eligible: b(a.is_eis_eligible),
prorate_by_percentage: b(a.prorate_by_percentage),
max_limit: a.max_limit === null ? null : Number(a.max_limit),
}))
);
} catch (e) {
setAllowancesError('Failed to load allowance types');
}
}, []);




const fetchEmployeeAllowances = useCallback(async () => {
if (!employeeId) return;
setAllowancesLoading(true);
setAllowancesError('');
try {
const res = await fetch(`${API_BASE_URL}/api/employee-allowances/${employeeId}/allowances`)
//fetch(`${API_BASE_URL}/api/employees/${employeeId}/allowances`);
if (!res.ok) throw new Error('Failed');
const rows: EmployeeAllowanceRow[] = await res.json();
setEmpAllowances(rows || []);
} catch (e) {
setAllowancesError('Failed to load employee allowances');
} finally {
setAllowancesLoading(false);
}
}, [employeeId]);



const fmt = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};


// Enhanced version with years and months
const calculateYearsOfService = (joinedDate: string | null) => {
  if (!joinedDate) return 'N/A';
  
  const startDate = new Date(joinedDate);
  const today = new Date();
  
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Adjust for day of month
  if (today.getDate() < startDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months = 11;
    }
  }
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  }
};

  //increment
  const [benefitGroups, setBenefitGroups] = useState<BenefitGroup[]>([]);
const [benefitGroupsLoading, setBenefitGroupsLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<EmployeeData & { dependents: Dependent[] } | null>(null);
  
  //const [formData, setFormData] = useState<EmployeeData | null>(null);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [documentData, setDocumentData] = useState<APIDocument | null>(null);
  const [educationIndex, setEducationIndex] = useState(-1);
  const [documentIndex, setDocumentIndex] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [user, setUser] = useState<{id: string; name: string; role: string} | null>(null);
  const [companies, setCompanies] = useState<{id: string; name: string}[]>([]);
  const [departments, setDepartments] = useState<{id: string; department_name: string}[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [filteredJobLevels, setFilteredJobLevels] = useState<Position[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferFormData, setTransferFormData] = useState<{
    company_id: string;
    department_id: string;
    position: string;
    job_level: string;
    position_id: string;
  }>({
    company_id: '',
    department_id: '',
    position: '',
    job_level: '',
    position_id: ''
  });
  const [showPastPositionsModal, setShowPastPositionsModal] = useState(false);
  const [pastPositions, setPastPositions] = useState<PastPosition[]>([]);
  const [pastPositionsLoading, setPastPositionsLoading] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);
  const [managers, setManagers] = useState<{id: string; name: string; employee_no: string}[]>([]);
  const [departmentEmployees, setDepartmentEmployees] = useState<{id: string; name: string; employee_no: string}[]>([]);
  const [employeeDocuments, setEmployeeDocuments] = useState<UploaderDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState('');
  const [documentUploadSuccess, setDocumentUploadSuccess] = useState(false);
  
  // Training Records State
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [originalTrainingRecords, setOriginalTrainingRecords] = useState<TrainingRecord[]>([]);
  const [deletedTrainingRecords, setDeletedTrainingRecords] = useState<string[]>([]);
  const [trainingRecordsLoading, setTrainingRecordsLoading] = useState(false);
  const [trainingRecordsError, setTrainingRecordsError] = useState('');
  
  // Disciplinary Records State
  const [disciplinaryRecords, setDisciplinaryRecords] = useState<DisciplinaryRecord[]>([]);
  const [originalDisciplinaryRecords, setOriginalDisciplinaryRecords] = useState<DisciplinaryRecord[]>([]);
  const [deletedDisciplinaryRecords, setDeletedDisciplinaryRecords] = useState<string[]>([]);
  const [disciplinaryRecordsLoading, setDisciplinaryRecordsLoading] = useState(false);
  const [disciplinaryRecordsError, setDisciplinaryRecordsError] = useState('');
  
  // Training Modal State
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [editingTrainingRecord, setEditingTrainingRecord] = useState<TrainingRecord | null>(null);
  
  // Disciplinary Modal State
  const [showDisciplinaryModal, setShowDisciplinaryModal] = useState(false);
  const [editingDisciplinaryRecord, setEditingDisciplinaryRecord] = useState<DisciplinaryRecord | null>(null);
  
  // Shared Modal State
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationTitle, setConfirmationTitle] = useState('');
  
  // File selection state for each tab (similar to add page)
  const [documentsTabFiles, setDocumentsTabFiles] = useState<UploaderDocument[]>([]);
  const [trainingTabFiles, setTrainingTabFiles] = useState<UploaderDocument[]>([]);
  const [disciplinaryTabFiles, setDisciplinaryTabFiles] = useState<UploaderDocument[]>([]);
  
  // Combined files from all tabs
  const allSelectedFiles = [
    ...employeeDocuments,
    ...documentsTabFiles,
    ...trainingTabFiles, 
    ...disciplinaryTabFiles
  ];
  const [uniquePositionTitles, setUniquePositionTitles] = useState<string[]>([]);
  const [jobLevels, setJobLevels] = useState<string[]>([]);
  const [groupedPositions, setGroupedPositions] = useState<{[title: string]: {[level: string]: string}}>({});
  
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
  const [originalEmployeeNo, setOriginalEmployeeNo] = useState<string>('');


  const [dependents, setDependents] = useState<Dependent[]>([]);
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

  const [originalDependents, setOriginalDependents] = useState<Dependent[]>([]);
  const [deletedDependents, setDeletedDependents] = useState<number[]>([]);
  const [dependentsLoading, setDependentsLoading] = useState(false);
  const [dependentsError, setDependentsError] = useState('');
  const [showDependentModal, setShowDependentModal] = useState(false);
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(null);
  

  //resign
  const [showResignModal, setShowResignModal] = useState(false);
  const [resignDate, setResignDate] = useState('');
  const [resignLoading, setResignLoading] = useState(false);

// Always produce "YYYY-MM-DD" or null
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

const toDateSafe = (v: unknown): Date | null => {
  if (!v) return null;
  // If it's already a Date and valid
  if (v instanceof Date && !isNaN(v.getTime())) return v;
  // If it's a string "YYYY-MM-DD" or ISO-like
  if (typeof v === 'string') {
    // Try parse as "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const d = new Date(`${v}T00:00:00Z`); // normalize to UTC midnight
      return isNaN(d.getTime()) ? null : d;
    }
    // Fallback: let Date parse ISO / RFC strings
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const fmtDateSafe = (d: Date | null): string => {
  if (!d || isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'UTC', // avoid TZ drift
    }).format(d);
  } catch {
    return '';
  }
};

const isAfterToday = (d: Date | null) => {
  if (!d) return false;
  const today = new Date();
  // compare by date only
  const t0 = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const d0 = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return d0 > t0;
};

const isBeforeOrOnToday = (d: Date | null) => {
  if (!d) return false;
  const today = new Date();
  const t0 = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const d0 = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return d0 <= t0;
};

const [payrollConfigs, setPayrollConfigs] = useState<PayrollConfig[]>([]);
const [showPromotionModal, setShowPromotionModal] = useState(false);
const [promotionDraft, setPromotionDraft] = useState<{ effectiveDate: string } | null>(null);

// auto-prompt guards
const [suppressPromotionPrompt, setSuppressPromotionPrompt] = useState(false);
const lastPromptKeyRef = useRef<string | null>(null);

const suppressPromptRef = useRef(false);

// did user change either position or job level?
const positionChanged = isEditing && formData?.position && formData?.position !== employee?.position;
const levelChanged    = isEditing && formData?.job_level && formData?.job_level !== employee?.job_level;
const promotionPending = Boolean(positionChanged || levelChanged);

const fmtDateTime = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '-' : d.toLocaleString();
};


/* ================== IPv4 Helpers ================== */
const isIPv4 = (s: string) =>
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(s);

const ipv4ToInt = (s: string): number => {
  const [a, b, c, d] = s.split('.').map(n => Number(n));
  return ((a << 24) >>> 0) + (b << 16) + (c << 8) + d;
};

const ipv4CidrToNetmask = (bits: number): number =>
  bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;

const ipv4InCidr = (ip: string, cidr: string): boolean => {
  const [netStr, maskStr] = cidr.split('/');
  const maskBits = Number(maskStr);
  if (!isIPv4(netStr) || !(maskBits >= 0 && maskBits <= 32) || !isIPv4(ip)) return false;
  const ipInt = ipv4ToInt(ip);
  const netInt = ipv4ToInt(netStr);
  const mask = ipv4CidrToNetmask(maskBits);
  return (ipInt & mask) === (netInt & mask);
};

/* ================== IPv6 Helpers (No BigInt) ================== */

// Loose but practical IPv6 validator (accepts :: shorthand)
const isIPv6 = (s: string) =>
  /^(([0-9a-f]{1,4}:){1,7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,7}:|:([0-9a-f]{1,4}:){1,7}|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:))$/i.test(s);

const expandIPv6 = (s: string): string[] => {
  // returns exactly 8 hextets (strings)
  const parts = s.split('::');
  if (parts.length > 2) return [];
  const left = parts[0] ? parts[0].split(':') : [];
  const right = parts[1] ? parts[1].split(':') : [];
  const leftCount = left.filter(Boolean).length;
  const rightCount = right.filter(Boolean).length;
  const missing = 8 - (leftCount + rightCount);
  if (missing < 0) return [];
  const zeros = Array(missing).fill('0');
  const out = [...left, ...zeros, ...right].map(h => h || '0');
  return out.length === 8 ? out : [];
};

const ipv6ToBytes = (s: string): Uint8Array => {
  const hextets = expandIPv6(s);
  if (hextets.length !== 8) return new Uint8Array(16);
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 8; i++) {
    const v = parseInt(hextets[i], 16);
    if (isNaN(v) || v < 0 || v > 0xFFFF) return new Uint8Array(16);
    bytes[i * 2] = (v >> 8) & 0xff;
    bytes[i * 2 + 1] = v & 0xff;
  }
  return bytes;
};

const bytesPrefixEqual = (a: Uint8Array, b: Uint8Array, prefixBits: number): boolean => {
  const fullBytes = Math.floor(prefixBits / 8);
  const remBits = prefixBits % 8;

  for (let i = 0; i < fullBytes; i++) {
    if (a[i] !== b[i]) return false;
  }
  if (remBits === 0) return true;

  const mask = (0xff << (8 - remBits)) & 0xff;
  return (a[fullBytes] & mask) === (b[fullBytes] & mask);
};

const ipv6InCidr = (ip: string, cidr: string): boolean => {
  const [netStr, maskStr] = cidr.split('/');
  const bits = Number(maskStr);
  if (!isIPv6(netStr) || !(bits >= 0 && bits <= 128) || !isIPv6(ip)) return false;
  const ipBytes = ipv6ToBytes(ip);
  const netBytes = ipv6ToBytes(netStr);
  return bytesPrefixEqual(ipBytes, netBytes, bits);
};

/* ================== Unified Checker ================== */
const ipMatchesAnyOfficeRange = (
  ip: string,
  officeRanges: Array<{ cidr: string; is_active?: boolean }>
): boolean => {
  // ✅ fix
const active = (officeRanges ?? []).filter(r => !!(r.is_active ?? true));
//const active = (officeRanges ?? []).filter(r => (r.is_active ?? 1) === 1);
  if (active.length === 0) return false;
  const v4 = isIPv4(ip);
  const v6 = !v4 && isIPv6(ip);
  if (!v4 && !v6) return false;
  return active.some(r => {
    const cidr = (r.cidr || '').trim();
    if (!cidr.includes('/')) return false;
    return v4 ? ipv4InCidr(ip, cidr) : ipv6InCidr(ip, cidr);
  });
};


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

useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${employee?.id}/benefit-group`);
      if (!res.ok) throw new Error('Failed to fetch current benefit group');
      const data: CurrentGroupInfo | null = await res.json();
      if (!mounted) return;

      setCurrentGroupInfo(data || null);

      if (data?.group_id) {
        try {
          const groupRes = await fetch(`${API_BASE_URL}/api/benefit-groups/${data.group_id}`);
          if (!groupRes.ok) throw new Error('Failed to fetch benefit group details');
          const groupData = await groupRes.json();
          if (!mounted) return;

          setCurrentGroupInfo(groupData);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (e) {
      console.error(e);
      setCurrentGroupInfo(null);
    }
  })();
  return () => { mounted = false; };
}, [employee?.id]); // Changed from formData?.id to employee?.id
  

  //get currenct api
const fetchBenefitGroups = async () => {
  try {
    setBenefitGroupsLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/benefit-groups`);
    if (!response.ok) throw new Error('Failed to fetch benefit groups');
    const data = await response.json();
    setBenefitGroups(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching benefit groups:', error);
    showNotification('Failed to load benefit groups', 'error');
  } finally {
    setBenefitGroupsLoading(false);
  }
};


const [savingGroup, setSavingGroup] = useState(false);
const [currentGroupInfo, setCurrentGroupInfo] = useState<CurrentGroupInfo | null>(null);
// Ensure the dropdown default reflects the server record on first load
useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${formData?.id}/benefit-group`);
      if (!res.ok) throw new Error('Failed to fetch current benefit group');
      const data: CurrentGroupInfo | null = await res.json();
      if (!mounted) return;

      // bind select to server truth
      const serverGroupIdStr = data?.group_id ? String(data.group_id) : '';
      if ((formData?.benefit_group_id || '') !== serverGroupIdStr) {
        setFormData(prev => (prev ? { ...prev, benefit_group_id: serverGroupIdStr } : prev));
      }

      // IMPORTANT: do NOT clear this when isEditing is false
      setCurrentGroupInfo(data || null);

      if (data?.group_id) {
        try {
          const groupRes = await fetch(`${API_BASE_URL}/api/benefit-groups/${data.group_id}`);
          if (!groupRes.ok) throw new Error('Failed to fetch benefit group details');
          const groupData = await groupRes.json();
          if (!mounted) return;

          setCurrentGroupInfo(groupData);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (e) {
      console.error(e);
      setCurrentGroupInfo(null);
    }
  })();
  return () => { mounted = false; };
}, [formData?.id, setFormData]);



useEffect(() => {
  if ((activeTab === 'position' || isEditing) && !benefitGroups.length) {
    fetchBenefitGroups();
  }
}, [activeTab, isEditing]);
  
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
  const [currencyLoading, setCurrencyLoading] = useState(true);
  const [currencyError, setCurrencyError] = useState<string | null>(null);

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
        setCurrencyError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setCurrencyLoading(false);
      }
    };

    fetchCurrencyRates();
  }, []);


  // get bank api
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [bankError, setBankError] = useState<string | null>(null);

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
      setBankError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoadingBanks(false);
    }
  };

  fetchBanks();
}, []);

  // Get user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('hrms_user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId) {
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch employee: ${response.statusText}`);
        }
        
        const data = await response.json();
        setEmployee({
          ...data, 
          age: String(calculateAge(data.dob))
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Failed to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, [employeeId]);

  // Fetch employee documents
  useEffect(() => {
    const fetchEmployeeDocuments = async () => {
      setDocumentsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/documents`);
        if (response.ok) {
          const data = await response.json();
          
          // Ensure we have an array to work with
          const documentsArray = Array.isArray(data) ? data : data.documents || [];
          
          // Transform the API response to match the UploaderDocument interface
          const formattedDocuments: UploaderDocument[] = documentsArray.map((doc: APIDocument) => ({
            id: doc.id,
            name: doc.file_name || doc.name,
            url: doc.file_url || doc.url,
            key: doc.key,
            uploadDate: doc.uploadDate,
            documentType: doc.documentType
          }));

          setEmployeeDocuments(formattedDocuments);
        }
      } catch (error) {
        console.error('Error refreshing documents:', error);
      } finally {
        setDocumentsLoading(false);
      }
    };
    
    if (activeTab === 'documents' || activeTab === 'training' || activeTab === 'disciplinary') {
      fetchEmployeeDocuments();
    }
  }, [employeeId, activeTab]);


  const openAddAllowance = () => {
setEditingAllowance(null);
setAllowanceForm({ allowance_id: '', amount: '', is_recurring: true, effective_date: '', end_date: '' });
setShowQuickCreate(false);
setShowAllowanceModal(true);
};


const openEditAllowance = (row: EmployeeAllowanceRow) => {
setEditingAllowance(row);
setAllowanceForm({
allowance_id: row.allowance_id,
amount: row.amount != null ? String(row.amount) : '',
is_recurring: b(row.is_recurring),
effective_date: row.effective_date || '',
end_date: row.end_date || '',
});
setShowQuickCreate(false);
setShowAllowanceModal(true);
};


const validateAmount = (amount: number, maxLimit: number | null) => {
if (!amount || amount <= 0) return 'Amount must be greater than 0';
if (maxLimit != null && amount > maxLimit) return `Amount cannot exceed RM ${maxLimit.toFixed(2)}`;
return '';
};


const saveAllowance = async () => {
  if (!allowanceForm.allowance_id) return toast.error('Choose an allowance type');

  // ✅ Effective Date required when creating a NEW allowance
  if (!editingAllowance && !allowanceForm.effective_date) {
    return toast.error('Effective Date is required for new allowances');
  }

  const selected = allowanceMasters.find(a => a.id === allowanceForm.allowance_id);
  const amt = parseFloat(allowanceForm.amount || '0');
  const err = validateAmount(amt, selected?.max_limit ?? null);
  if (err) return toast.error(err);

  const payload = {
    employee_id: Number(employeeId),
    allowance_id: Number(allowanceForm.allowance_id),
    amount: amt.toFixed(2),
    is_recurring: allowanceForm.is_recurring ? 1 : 0,
    effective_date: allowanceForm.effective_date,          // ← required for create; validated above
    end_date: allowanceForm.is_recurring ? (allowanceForm.end_date || null) : null, // one-time ⇒ null
  };

  try {
    if (editingAllowance) {
      const res = await fetch(`${API_BASE_URL}/api/employee-allowances/${editingAllowance.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Allowance updated');
    } else {
      const res = await fetch(`${API_BASE_URL}/api/employee-allowances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success('Allowance added');
    }
    setShowAllowanceModal(false);
    setEditingAllowance(null);
    await fetchEmployeeAllowances();
  } catch (e: any) {
    toast.error(e?.message || 'Save failed');
  }
};


const deleteAllowance = async (row: EmployeeAllowanceRow) => {
if (!confirm(`Delete ${row.allowance_name}?`)) return;
try {
const res = await fetch(`${API_BASE_URL}/api/employee-allowances/${row.id}`, { method: 'DELETE' });
if (!res.ok) throw new Error('Failed to delete');
toast.success('Deleted');
await fetchEmployeeAllowances();
} catch (e: any) {
toast.error(e?.message || 'Delete failed');
}
};

// Open the pretty delete modal
const openDeleteAllowance = (row: EmployeeAllowanceRow) => {
  setAllowanceToDelete(row);
  setShowDeleteAllowanceModal(true);
};

// Confirm delete (actual API call)
const confirmDeleteAllowance = async () => {
  if (!allowanceToDelete) return;
  try {
    setDeletingAllowance(true);
    const res = await fetch(
      `${API_BASE_URL}/api/employee-allowances/${allowanceToDelete.id}`,
      { method: 'DELETE' }
    );
    if (!res.ok) throw new Error('Failed to delete');
    toast.success('Allowance deleted');
    await fetchEmployeeAllowances();
    setShowDeleteAllowanceModal(false);
    setAllowanceToDelete(null);
  } catch (e: any) {
    toast.error(e?.message || 'Delete failed');
  } finally {
    setDeletingAllowance(false);
  }
};

// Close without deleting
const closeDeleteAllowanceModal = () => {
  setShowDeleteAllowanceModal(false);
  setAllowanceToDelete(null);
};


const quickCreateType = async () => {
if (!quickCreate.name.trim()) return toast.error('Name is required');
setCreatingType(true);
try {
const payload = {
name: quickCreate.name.trim(),
max_limit: quickCreate.max_limit === '' ? null : Number(quickCreate.max_limit),
is_taxable: !!quickCreate.is_taxable,
is_bonus: !!quickCreate.is_bonus,
is_epf_eligible: !!quickCreate.is_epf_eligible,
is_socso_eligible: !!quickCreate.is_socso_eligible,
is_eis_eligible: !!quickCreate.is_eis_eligible,
prorate_by_percentage: !!quickCreate.prorate_by_percentage,
};
const res = await fetch(`${API_BASE_URL}/api/master-data/allowances`, {
method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
});
if (!res.ok) throw new Error('Failed to create type');
toast.success('Allowance type created');
await fetchAllowanceMasters();
// try to preselect by name
const created = (allowanceMasters.find(a => a.name === payload.name));
setShowQuickCreate(false);
if (created) setAllowanceForm(prev => ({ ...prev, allowance_id: created.id }));
} catch (e: any) {
toast.error(e?.message || 'Create failed');
} finally {
setCreatingType(false);
}
};

function formatLong(dateStr?: string | null) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatus(row: {
  effective_date: string | null;
  end_date: string | null;
  is_recurring: boolean | number;
}) {
  const now = new Date();
  const eff = row.effective_date ? new Date(row.effective_date) : null;
  const end = row.end_date ? new Date(row.end_date) : null;

  let label = '';
  let badge = 'badge-ghost';

  if (eff && end) {
    if (now >= eff && now <= end) {
      label = 'Active';
      badge = 'badge-success';
    } else if (now < eff) {
      label = 'Upcoming';
      badge = 'badge-warning';
    } else {
      label = 'Expired';
      badge = 'badge-error';
    }
  } else if (Number(row.is_recurring)) {
    // Recurring with no end -> ongoing/permanent
    if (eff && now < eff) {
      label = 'Upcoming';
      badge = 'badge-warning';
    } else {
      label = 'Ongoing';
      badge = 'badge-neutral';
    }
  } else {
    // One-time (usually only an effective date)
    label = 'One\u2011time'; // non-breaking hyphen
    badge = 'badge-info';
  }

  return { label, badge };
}

function AllowanceCard({
  row,
  onEdit,
  onDelete,
  canManage = false,
}: {
  row: {
    id: number;
    allowance_name: string;
    amount: number | string | null;
    is_recurring: boolean | number;
    effective_date: string | null;
    end_date: string | null;
  };
  onEdit: (r: any) => void;
  onDelete: (r: any) => void;
  canManage?: boolean;
}) {
  const { label, badge } = getStatus(row);

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100 p-4 md:p-5 shadow-sm hover:shadow-md transition">
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base md:text-lg font-semibold">{row.allowance_name}</h4>
            <span className={`badge ${badge}`}>{label}</span>
          </div>

          {/* Amount + recurring */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Amount:</span>{' '}
            RM {row.amount == null ? '—' : Number(row.amount).toFixed(2)}{' '}
            <span className="ml-2 text-xs opacity-70">
              {Number(row.is_recurring) ? 'Every pay cycle' : 'One-time'}
            </span>
          </div>
        </div>

        {/* Only show when edit mode is ON */}
        {canManage && (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(row)}
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              className="btn btn-ghost btn-sm text-rose-600 hover:text-rose-700"
              onClick={() => onDelete(row)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <CalendarIcon className="h-4 w-4 opacity-70 mt-0.5" />
          <div>
            <div className="text-gray-500">Effective</div>
            <div className="font-medium">{formatLong(row.effective_date)}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CalendarIcon className="h-4 w-4 opacity-70 mt-0.5" />
          <div>
            <div className="text-gray-500">End</div>
            <div className="font-medium">
              {row.end_date ? formatLong(row.end_date) : '— (ongoing)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fetch employee training records
  useEffect(() => {
    const fetchTrainingRecords = async () => {
      if (activeTab !== 'training') return;
      
      setTrainingRecordsLoading(true);
      setTrainingRecordsError('');
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/training-records`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch training records: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          const records = data.training_records || [];
          console.log("training records", records);
          setTrainingRecords(records);
          setOriginalTrainingRecords(records);
        } else {
          throw new Error(data.error || 'Failed to fetch training records');
        }
      } catch (error) {
        console.error('Error fetching training records:', error);
        setTrainingRecordsError('Failed to load training records');
        setTrainingRecords([]);
      } finally {
        setTrainingRecordsLoading(false);
      }
    };
    
    fetchTrainingRecords();
  }, [employeeId, activeTab]);

  useEffect(() => {
  if (activeTab === 'position') {
  fetchAllowanceMasters();
  fetchEmployeeAllowances();
  }
  }, [activeTab, fetchAllowanceMasters, fetchEmployeeAllowances]);

  // Fetch employee disciplinary records
  useEffect(() => {
    const fetchDisciplinaryRecords = async () => {
      try {
        setDisciplinaryRecordsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/disciplinary-records`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch disciplinary records');
        }
        
        const data = await response.json();
        
        if (data.success) {
          const records = data.disciplinary_records || [];
          setDisciplinaryRecords(records);
          setOriginalDisciplinaryRecords([...records]);
        } else {
          console.error('Error fetching disciplinary records:', data.error);
          setDisciplinaryRecords([]);
          setOriginalDisciplinaryRecords([]);
        }
      } catch (error) {
        console.error('Error fetching disciplinary records:', error);
        setDisciplinaryRecords([]);
        setOriginalDisciplinaryRecords([]);
      } finally {
        setDisciplinaryRecordsLoading(false);
      }
    };
    
    fetchDisciplinaryRecords();
  }, [employeeId]);
  


  // Handle document upload success
  const handleDocumentsUploaded = () => {
    // Clear selected files after upload
    setDocumentsTabFiles([]);
    setTrainingTabFiles([]);
    setDisciplinaryTabFiles([]);
    
    // Refresh documents list after upload
    if (employeeId) {
      const fetchEmployeeDocuments = async () => {
        setDocumentsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/documents`);
          if (response.ok) {
            const data = await response.json();
            const documentsArray = Array.isArray(data) ? data : data.documents || [];
            const formattedDocuments: UploaderDocument[] = documentsArray.map((doc: APIDocument) => ({
              id: doc.id,
              name: doc.file_name || doc.name,
              url: doc.file_url || doc.url,
              key: doc.key,
              uploadDate: doc.uploadDate,
              documentType: doc.documentType
            }));
            setEmployeeDocuments(formattedDocuments);
          }
        } catch (error) {
          console.error('Error refreshing documents:', error);
        } finally {
          setDocumentsLoading(false);
        }
      };
      fetchEmployeeDocuments();
    }
  };
  
const handleDependentChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const target = e.target as HTMLInputElement;
  const { name, type } = target;
  const raw = target.value;

  setDependentForm(prev => {
    let next: any;

    if (type === 'checkbox') {
      next = target.checked; // for is_disabled, is_studying
    } else if (name === 'birth_date') {
      next = toDateOnly(raw); // ← normalize here
    } else if (name === 'child_relief_percent') {
      next = raw === '' ? 0 : Number(raw);
    } else {
      next = raw;
    }

    return { ...prev, [name]: next };
  });
};


const handleSaveDependent = (dependent: Dependent) => {
  if (!formData) return;

  if (!dependent.full_name || !dependent.relationship || !dependent.birth_date) {
    showNotification('Name, Relationship and Date of Birth are required', 'error');
    return;
  }

  const newDependent = editingDependent
    ? { ...dependent, id: editingDependent.id }
    : { ...dependent, id: `temp_${Date.now()}`, is_temp: true };

  const updateList = (list: Dependent[]) =>
    editingDependent
      ? list.map(d => depKey(d) === depKey(editingDependent) ? newDependent : d)
      : [...list, newDependent];

  setFormData(prev => prev ? { ...prev, dependents: updateList(prev.dependents ?? []) } : prev);
  setDependents(prev => updateList(prev ?? []));

  // reset form
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
};



const depKey1 = (dep: Partial<Dependent>) =>
  String(dep?.id ?? `${dep?.full_name ?? ''}|${dep?.birth_date ?? ''}`);
// Fix the key generation to handle all cases properly
const depKey = (dep: Partial<Dependent>) => {
  if (dep?.id && typeof dep.id === 'number') {
    return `perm_${dep.id}`;
  }
  if (dep?.id && typeof dep.id === 'string') {
    return dep.id;
  }
  // For temporary records without ID, use a combination of name and birth date
  return `temp_${dep?.full_name || ''}_${dep?.birth_date || ''}`;
};

const handleDeleteDependent11 = (keyToDelete: number | string | undefined) => {
  setConfirmationTitle('Delete Dependent');
  setConfirmationMessage('Are you sure you want to delete this dependent?');
  setConfirmationAction(() => () => {
    const keyStr = String(keyToDelete ?? '');

    setDependents(prev => (prev ?? []).filter(dep => depKey(dep) !== keyStr));
    setFormData(prev => !prev ? prev : ({
      ...prev,
      dependents: (prev.dependents ?? []).filter(dep => depKey(dep) !== keyStr),
    }));

    if (typeof keyToDelete === 'number') {
      setDeletedDependents(prev => Array.from(new Set([...(prev ?? []), keyToDelete])));
    }
    setShowConfirmationModal(false);
  });
  setShowConfirmationModal(true);
};

const handleDeleteDependent = (keyToDelete: number | string | undefined) => {
  setConfirmationTitle('Delete Dependent');
  setConfirmationMessage('Are you sure you want to delete this dependent?');
  setConfirmationAction(() => () => {
    const keyStr = String(keyToDelete ?? '');

    // Update both states consistently
    setDependents(prev => (prev ?? []).filter(dep => depKey(dep) !== keyStr));
    
    // Also update formData.dependents
    setFormData(prev => {
      if (!prev) return prev;
      const updatedDependents = (prev.dependents ?? []).filter(dep => depKey(dep) !== keyStr);
      return { ...prev, dependents: updatedDependents };
    });

    // Track deleted permanent records (only for numeric IDs)
    if (typeof keyToDelete === 'number' || (typeof keyToDelete === 'string' && keyToDelete.startsWith('perm_'))) {
      const idToDelete = typeof keyToDelete === 'number' ? keyToDelete : parseInt(keyToDelete.replace('perm_', ''));
      if (!isNaN(idToDelete)) {
        setDeletedDependents(prev => Array.from(new Set([...(prev ?? []), idToDelete])));
      }
    }
    
    setShowConfirmationModal(false);
  });
  setShowConfirmationModal(true);
};


  // File selection handlers for each tab (similar to add page)
  const handleDocumentsTabFilesSelected = (files: UploaderDocument[]) => {
    setDocumentsTabFiles(files);
  };

  const handleTrainingTabFilesSelected = (files: UploaderDocument[]) => {
    setTrainingTabFiles(files);
  };

  const handleDisciplinaryTabFilesSelected = (files: UploaderDocument[]) => {
    setDisciplinaryTabFiles(files);
  };

  // Document deletion handlers for each tab
  const handleDocumentsTabDocumentDeleted = (removedFile?: UploaderDocument) => {
    if (removedFile) {
      setDocumentsTabFiles(prev => prev.filter(file => file !== removedFile));
    }
  };

  const handleTrainingTabDocumentDeleted = (removedFile?: UploaderDocument) => {
    if (removedFile) {
      setTrainingTabFiles(prev => prev.filter(file => file !== removedFile));
    }
  };

  const handleDisciplinaryTabDocumentDeleted = (removedFile?: UploaderDocument) => {
    if (removedFile) {
      setDisciplinaryTabFiles(prev => prev.filter(file => file !== removedFile));
    }
  };

  // Training Modal Management Functions
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
      // Update existing record in local state only
      setTrainingRecords(prev =>
        prev.map(record =>
          record.id === editingTrainingRecord.id
            ? { ...trainingRecord, id: editingTrainingRecord.id }
            : record
        )
      );

      setEditingTrainingRecord(trainingRecord);

      console.log("training records after update", trainingRecords);
    } else {
      // Add new record to local state only with temporary ID
      const newRecord: TrainingRecord = {
        ...trainingRecord,
        id: `temp_${Date.now()}` // Temporary ID for frontend
      };
      setTrainingRecords(prev => [newRecord, ...prev]); // New record at the beginning
    }

    handleCloseTrainingModal();
    
    // Show info message that changes need to be saved
    const infoMsg = document.createElement('div');
    infoMsg.className = 'toast toast-middle toast-center z-[9999]';
    infoMsg.innerHTML = `
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Training record changes saved locally. Click "Save Changes" to update the database.</span>
      </div>
    `;
    document.body.appendChild(infoMsg);
    setTimeout(() => {
      document.body.removeChild(infoMsg);
    }, 4000);
  };

  const handleDeleteTrainingRecord = (recordId: string) => {
    setConfirmationTitle('Delete Training Record');
    setConfirmationMessage('Are you sure you want to delete this training record? Changes will be applied when you save.');
    setConfirmationAction(() => () => confirmDeleteTrainingRecord(recordId));
    setShowConfirmationModal(true);
  };

  const confirmDeleteTrainingRecord = (recordId: string) => {
    // Remove from local state
    setTrainingRecords(prev => prev.filter(record => record.id !== recordId));
    
    // Track deleted record if it's not a temporary record (has numeric ID)
    if (!recordId.startsWith('temp_')) {
      setDeletedTrainingRecords(prev => [...prev, recordId]);
    }
    
    setShowConfirmationModal(false);
    
    // Show info message that changes need to be saved
    const infoMsg = document.createElement('div');
    infoMsg.className = 'toast toast-middle toast-center z-[9999]';
    infoMsg.innerHTML = `
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Training record marked for deletion. Click "Save Changes" to update the database.</span>
      </div>
    `;
    document.body.appendChild(infoMsg);
    setTimeout(() => {
      document.body.removeChild(infoMsg);
    }, 4000);
  };

  // Disciplinary Modal Management Functions
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
      // Update existing record in local state only
      setDisciplinaryRecords(prev =>
        prev.map(record =>
          record.id === editingDisciplinaryRecord.id
            ? { ...disciplinaryRecord, id: editingDisciplinaryRecord.id }
            : record
        )
      );

      setEditingDisciplinaryRecord(disciplinaryRecord);

      console.log("disciplinary records after update", disciplinaryRecords);
    } else {
      // Add new record to local state only with temporary ID
      const newRecord: DisciplinaryRecord = {
        ...disciplinaryRecord,
        id: `temp_${Date.now()}` // Temporary ID for frontend
      };
      setDisciplinaryRecords(prev => [newRecord, ...prev]); // New record at the beginning
    }

    handleCloseDisciplinaryModal();
    
    // Show info message that changes need to be saved
    const infoMsg = document.createElement('div');
    infoMsg.className = 'toast toast-middle toast-center z-[9999]';
    infoMsg.innerHTML = `
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Disciplinary record changes saved locally. Click "Save Changes" to update the database.</span>
      </div>
    `;
    document.body.appendChild(infoMsg);
    setTimeout(() => {
      document.body.removeChild(infoMsg);
    }, 4000);
  };
  

  const handleDeleteDisciplinaryRecord = (recordId: string) => {
    setConfirmationTitle('Delete Disciplinary Record');
    setConfirmationMessage('Are you sure you want to delete this disciplinary record? Changes will be applied when you save.');
    setConfirmationAction(() => () => confirmDeleteDisciplinaryRecord(recordId));
    setShowConfirmationModal(true);
  };

  const confirmDeleteDisciplinaryRecord = (recordId: string) => {
    // Remove from local state
    setDisciplinaryRecords(prev => prev.filter(record => record.id !== recordId));
    
    // Track deleted record if it's not a temporary record (has numeric ID)
    if (!recordId.startsWith('temp_')) {
      setDeletedDisciplinaryRecords(prev => [...prev, recordId]);
    }
    
    setShowConfirmationModal(false);
    
    // Show info message that changes need to be saved
    const infoMsg = document.createElement('div');
    infoMsg.className = 'toast toast-middle toast-center z-[9999]';
    infoMsg.innerHTML = `
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Disciplinary record marked for deletion. Click "Save Changes" to update the database.</span>
      </div>
    `;
    document.body.appendChild(infoMsg);
    setTimeout(() => {
      document.body.removeChild(infoMsg);
    }, 4000);
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
  
  // Fetch companies
  useEffect(() => {
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
    
    fetchCompanies();
  }, []);
  
  // Fetch all departments on initial load
  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/departments`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching all departments:', error);
      }
    };
    
    fetchAllDepartments();
  }, []);
  
  // Fetch departments when company changes and in edit mode (for filtering)
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData?.company_id) return;
      
      try {
        setDepartments([]); // Clear departments while loading
        const response = await fetch(`${API_BASE_URL}/api/admin/employees/companies/${formData.company_id}/departments`);
        
        if (response.status === 404) {
          setDepartments([]);
          // Clear department selection if there are no departments
          setFormData(prev => prev ? {...prev, department_id: '', position: '', position_id: '', superior: '', manager_id: '', job_level: ''} : null);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // In edit mode, we only want to show departments for the selected company
        if (isEditing) {
          setDepartments(data);
        }
        
        // Clear the department selection if the current department isn't in the new list
        if (formData.department_id && !data.some((dept: any) => dept.id === formData.department_id)) {
          setFormData(prev => prev ? {...prev, department_id: '', position: '', position_id: '', superior: '', manager_id: '', job_level: ''} : null);
        }
      } catch (error) {
        console.error('Error fetching departments for company:', error);
        setDepartments([]);
      }
    };
    
    if (isEditing) {
      fetchDepartments();
    }
  }, [formData?.company_id, formData?.department_id, isEditing]);
//}, [formData?.company_id, isEditing]);

  useEffect(() => {
    const fetchManagers = async (companyId: string) => {
      try {
        setManagers([]); // Clear managers while loading
        const response = await fetch(`${API_BASE_URL}/api/admin/companies/${companyId}/managers`);
        
        if (response.status === 404) {
          setManagers([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch managers: ${response.statusText}`);
        }
        
        const data = await response.json();
        setManagers(data.managers);
      } catch (error) {
        console.error('Error fetching managers:', error);
        setManagers([]);
      }
    };
    
    if (isEditing && formData?.company_id) {
      fetchManagers(formData.company_id);
    } else if (!isEditing && employee?.company_id) {
      fetchManagers(employee.company_id);
    }
  }, [formData?.company_id, employee?.company_id, isEditing, employeeId]);

  // Fetch department employees for superior dropdown
  useEffect(() => {
    const fetchDepartmentEmployees = async (departmentId: string) => {
      try {
      if (!formData?.department_id) {
        setDepartmentEmployees([]);
        return;
      }

        //setDepartmentEmployees([]); // Clear employees while loading
        const response = await fetch(`${API_BASE_URL}/api/admin/departments/${departmentId}/employees`);
        
        if (response.status === 404) {
          setDepartmentEmployees([]);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch department employees: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Filter out the current employee
        const filteredEmployees = data.filter((emp: any) => emp.id !== employeeId);
        setDepartmentEmployees(filteredEmployees);
      } catch (error) {
        console.error('Error fetching department employees:', error);
        setDepartmentEmployees([]);
      }
    };
    
    if (isEditing && formData?.department_id) {
      fetchDepartmentEmployees(formData.department_id);
    } else if (!isEditing && employee?.department_id) {
      fetchDepartmentEmployees(employee.department_id);
    }
   }, [formData?.department_id, employee?.department_id, isEditing, employeeId]);
//}, [formData?.department_id, isEditing, employeeId]);//}, [formData?.department_id, employee?.department_id, isEditing, employeeId]);

  // Add useEffect for fetching positions when department changes
  useEffect(() => {
    if (formData?.department_id) {
      const fetchDepartmentPositions = async () => {
        try {
          setPositionsLoading(true);
          const response = await fetch(`${API_BASE_URL}/api/admin/departments/${formData.department_id}/positions`);
          
          if (!response.ok) {
            console.warn(`Failed to fetch positions for department ID ${formData.department_id}: ${response.status}`);
            fallbackToMockPositions();
            return;
          }
          
          const data = await response.json();
          
          let positionsData: Position[] = [];
          
          if (Array.isArray(data)) {
            positionsData = data;
          } else if (data && typeof data === 'object') {
            if (data.positions && Array.isArray(data.positions)) {
              positionsData = data.positions;
            } else {
              console.warn('API response does not contain positions in expected format:', data);
            }
          }
          
          if (positionsData.length === 0) {
            fallbackToMockPositions();
            return;
          }
          
          const processedPositions = positionsData.map(pos => ({
            ...pos,
            department_id: String(pos.department_id)
          }));
          
          setPositions(processedPositions);
          setFilteredPositions(processedPositions);
          setPositionsLoading(false);
          
        } catch (error) {
          console.error('Error fetching positions:', error);
          fallbackToMockPositions();
        }
      };
      
      const fallbackToMockPositions = () => {
        
        const mockPositionsByDepartment: {[key: string]: Position[]} = {
          'IT': [
            { id: 'it-1', title: 'Software Engineer', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'it-2', title: 'UI/UX Designer', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'it-3', title: 'QA Engineer', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'it-4', title: 'DevOps Engineer', department_id: formData.department_id, job_level: 'Senior' },
            { id: 'it-5', title: 'IT Manager', department_id: formData.department_id, job_level: 'Manager' }
          ],
          'HR': [
            { id: 'hr-1', title: 'HR Manager', department_id: formData.department_id, job_level: 'Manager' },
            { id: 'hr-2', title: 'Recruiter', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'hr-3', title: 'HR Assistant', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'hr-4', title: 'Training Coordinator', department_id: formData.department_id, job_level: 'Mid' }
          ],
          // ... Add more mock positions for other departments
        };
        
        const departmentObj = departments.find(dept => dept.id === formData.department_id);
        const departmentName = departmentObj?.department_name || '';
        
        let mockPositions = mockPositionsByDepartment[departmentName] || [];
        
        if (mockPositions.length === 0) {
          mockPositions = [
            { id: 'gen-1', title: 'Manager', department_id: formData.department_id, job_level: 'Manager' },
            { id: 'gen-2', title: 'Assistant', department_id: formData.department_id, job_level: 'Junior' },
            { id: 'gen-3', title: 'Coordinator', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'gen-4', title: 'Specialist', department_id: formData.department_id, job_level: 'Mid' },
            { id: 'gen-5', title: 'Officer', department_id: formData.department_id, job_level: 'Junior' }
          ];
        }
        
        setPositions(mockPositions);
        setFilteredPositions(mockPositions);
        setPositionsLoading(false);
      };
      
      fetchDepartmentPositions();
    } else {
      setPositions([]);
      setFilteredPositions([]);
      setFilteredJobLevels([]);
      setJobLevels([]);
    }
  }, [formData?.department_id, departments]);

  

  useEffect(() => {
  if (!formData?.position_id) return;
  const selected = positions.find(p => p.id === formData.position_id);
  if (!selected) return;

  setFormData(prev => {
    if (!prev) return prev;
    let next = prev;

    if (selected.job_level && selected.job_level !== prev.job_level) {
      next = { ...next, job_level: selected.job_level, position: selected.title ?? next.position };
    } else if (!prev.position && selected.title) {
      next = { ...next, position: selected.title };
    }
    return next;
  });
}, [formData?.position_id, positions]);


const formatDateForInput = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const parts = (dateStr.split('T')[0] || '').split('-');
  return parts.length === 3 ? parts.join('-') : date.toISOString().split('T')[0];
};

useEffect(() => {
  if (!employee) return;

  if (!isEditing) return;

  setFormData({
    ...employee,
    dob: formatDateForInput(employee.dob),
    joined_date: formatDateForInput(employee.joined_date),
    passport_expired_date: formatDateForInput(employee.passport_expired_date),
    visa_expired_date: formatDateForInput(employee.visa_expired_date),
    confirmation_date: formatDateForInput(employee.confirmation_date),
    resigned_date: formatDateForInput(employee.resigned_date),
    dependents,
  });

  if (employee.employee_no) setOriginalEmployeeNo(employee.employee_no);
}, [employee, isEditing, dependents]);

  
  // Format date for display in view mode (dd-MM-yyyy)
  const formatDateForDisplay = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Not provided';
    try {
      // Use direct string manipulation for consistent date representation
      const displayDate = new Date(dateStr);
      const parts = displayDate.toLocaleDateString('en-MY').split('/');
      if (parts.length === 3) {
        // Extract year, month, day from the string parts
        const [day, month, year] = parts;
        return `${day}-${month}-${year}`; // Return DD-MM-YYYY
      }
      
      // Fallback to Date object if the string can't be parsed
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      // Format as dd-MM-yyyy
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Handle input changes when editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    
    // Special handling for department selection
    if (name === 'department_id') {
      setFormData({
        ...formData,
        department_id: value,
        job_level: '', // Clear job level when department changes
        position_id: '', // Clear position_id when department changes
        manager_id: '', // Clear manager_id when department changes
        superior: '', // Clear superior when department changes
        position: '' // Clear position when department changes
      });
    }
    // Special handling for position selection (now by title)
    else if (name === 'position') {
      setFormData({
        ...formData,
        position: value,
        job_level: '', // Reset job level when position changes
        position_id: '' // Reset position_id when position changes
      });

      // Find available job levels for this position title
      const availableLevels = [...new Set(
        positions
          .filter(pos => pos.title === value)
          .map(pos => pos.job_level)
      )].filter(Boolean);
      
      setJobLevels(availableLevels as string[]);
    }
    // Special handling for job level selection
else if (name === 'job_level') {
  const title = formData.position;
  const level = value;

  // Try groupedPositions first
  let positionId = title && level
    ? groupedPositions[title]?.[level] ?? ''
    : '';

  // Fallback: search the positions array
  if (!positionId) {
    const match = positions.find(p => p.title === title && p.job_level === level);
    if (match) positionId = String(match.id);
  }

  setFormData({
    ...formData,
    job_level: level,
    position_id: positionId // '' if not resolvable
  });
}
else if (name === 'dob') {
      setFormData({
        ...formData,
        dob: value,
        age: String(calculateAge(value))
      });
    }
    else if (name === 'benefit_group_id') {
  setFormData({
    ...formData,
    [name]: value
  });
}
else if (name === 'office_id') {
  const selectedOffice = offices.find(o => o.id === value);
  setFormData({
    ...formData,
    office_id: value,
    office: selectedOffice ? selectedOffice.name : '' // Update both fields
  });
}

    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Employee number validation function
  const validateEmployeeNumber = async (employeeNo: string) => {
    // If empty or same as original, reset validation state
    if (!employeeNo.trim() || employeeNo.trim() === originalEmployeeNo) {
      setEmployeeNoValidation({
        isValidating: false,
        isValid: employeeNo.trim() === originalEmployeeNo ? true : null,
        message: employeeNo.trim() === originalEmployeeNo ? 'Current employee number' : ''
      });
      return;
    }

    setEmployeeNoValidation({
      isValidating: true,
      isValid: null,
      message: 'Validating...'
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/validate/employee-number?employee_no=${encodeURIComponent(employeeNo.trim())}&excludeEmployeeId=${employeeId}`);
      
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

  
  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData) return;
  
  // Check if employee number is valid before submitting (only if changed from original)
  if (formData.employee_no !== originalEmployeeNo && employeeNoValidation.isValid === false) {
    setSaveLoading(false);
    setError('Please fix the employee number validation errors before submitting.');
    return;
  }
  
  // If employee number has been changed but not validated yet, validate it now
  if (formData.employee_no !== originalEmployeeNo && employeeNoValidation.isValid === null) {
    setSaveLoading(false);
    setError('Please wait for employee number validation to complete before submitting.');
    return;
  }

  // If resigned_date is set, resignation_reason must be provided.
  if (formData.resigned_date && !formData.resignation_reason?.trim()) {
    setSaveLoading(false);
    showNotification('Please provide a resignation reason when Resigned Date is set.', 'error');
    return;
  }


  // Validate all required fields
  const missingFields = validateRequiredFields(formData);
  
  // If there are missing fields, show error and stop submission
  if (missingFields.length > 0) {
    setSaveLoading(false);
    const fieldList = missingFields.length === 1 
      ? missingFields[0] 
      : missingFields.slice(0, -1).join(', ') + ' and ' + missingFields[missingFields.length - 1];
    
    showNotification(`Please fill in the following required fields: ${fieldList}`, 'error');
    return;
  }

  try {
    setSaveLoading(true);
    
    // Create an object with only the fields we want to update
    const updateData = {
      name: formData.name,
      email: formData.email,
      salary: formData.salary,
      currency: formData.currency,
      company_id: formData.company_id,
      manager_id: formData.job_level === 'Manager' ? null : formData.manager_id,
      role: formData.role,
      gender: formData.gender,
      employee_no: formData.employee_no,
      employment_type: formData.employment_type,
      job_level: formData.job_level,
      department_id: formData.department_id,
      position: formData.position,
      position_id: formData.position_id,
      superior: formData.job_level === 'Manager' ? null : formData.superior,
      office: formData.office,
      office_id: formData.office_id ?? null,
      nationality: formData.nationality,
      joined_date: formData.joined_date,
      resigned_date: formData.resigned_date ? toDateOnly(formData.resigned_date) : null,//: formData.resigned_date || null,
      resignation_reason: formData.resignation_reason || null,
      visa_expired_date: formData.visa_expired_date ? toDateOnly(formData.visa_expired_date) : null,//visa_expired_date: formData.visa_expired_date || '',//null,
      passport_expired_date: formData.passport_expired_date ? toDateOnly(formData.passport_expired_date) : null,//passport_expired_date: formData.passport_expired_date || '',//null,
      ic_passport: formData.ic_passport || null,
      confirmation_date: formData.confirmation_date ? toDateOnly(formData.confirmation_date) : null,//confirmation_date: formData.confirmation_date || null,
      marital_status: formData.marital_status,
      dob: toDateOnly(formData.dob),//dob: formData.dob || '',//,
      age: formData.age,
      mobile_number: formData.mobile_number,
      country_code: formData.country_code || null,
      payment_company: formData.payment_company,
      pay_interval: formData.pay_interval,
      payment_method: formData.payment_method,
      bank_name: formData.bank_name,
      bank_currency: formData.bank_currency,
      bank_account_name: formData.bank_account_name,
      bank_account_no: formData.bank_account_no,
      income_tax_no: formData.income_tax_no || null,
      socso_account_no: formData.socso_account_no || null,
      epf_account_no: formData.epf_account_no || null,
      status: formData.status,
      activation: formData.activation,
      race: formData.race || null,
      religion: formData.religion || null,
      education_level: formData.education_level || null,
      qualification: formData.qualification || null,
      training_remarks: formData.training_remarks || null,
      disciplinary_remarks: formData.disciplinary_remarks || null,
      address: formData.address || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_relationship: formData.emergency_contact_relationship || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      emergency_contact_email: formData.emergency_contact_email || null,
      password: formData.password || null
    };

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(updateData));
    formDataToSend.append('office_id', formData.office_id ? String(formData.office_id) : '');
    formDataToSend.append('office', formData.office || '');


    // Add training records data
    const trainingRecordsData = {
      trainingRecords: trainingRecords.map(record => ({
        id: record.id,
        training_course: record.training_course,
        venue: record.venue,
        start_datetime: record.start_datetime,
        end_datetime: record.end_datetime,
        status: record.status,
        isNew: record.id?.startsWith('temp_') || false,
        // ✅ ADDED: Bond-related fields that backend expects
        has_bond: record.has_bond || false,
        bond_period_months: record.bond_period_days || null,
        bond_start_date: record.bond_start_date || null,
        bond_end_date: record.bond_end_date || null,
        bond_status: record.bond_status || null,
      })),
      deletedTrainingRecords: deletedTrainingRecords
    };
    
    formDataToSend.append('trainingRecordsData', JSON.stringify(trainingRecordsData));

    // Add disciplinary records data
    const disciplinaryRecordsData = {
      disciplinaryRecords: disciplinaryRecords.map(record => ({
        id: record.id,
        issue_date: record.issue_date,
        type_of_letter: record.type_of_letter,
        reason: record.reason,
        isNew: record.id?.startsWith('temp_') || false
      })),
      deletedDisciplinaryRecords: deletedDisciplinaryRecords
    };
    
    formDataToSend.append('disciplinaryRecordsData', JSON.stringify(disciplinaryRecordsData));
    
    // formDataToSend.append('dependentsData', JSON.stringify(dependentsData));

    // Add dependents data (robust)
    const dependentsPayload = (formData.dependents ?? []).map(dep => {
      const isPersisted = typeof dep.id === 'number' && Number.isFinite(dep.id);
      const isChild = dep.relationship === 'Child';

      return {
        id: isPersisted ? dep.id : null,            // ← never send "temp_*" to backend
        isNew: !isPersisted,

        full_name: (dep.full_name || '').trim(),
        relationship: dep.relationship || null,
        birth_date: toDateOnly(dep.birth_date),         // ensure YYYY-MM-DD if your API requires it
        gender: dep.gender || null,
        nationality: dep.nationality || null,
        identification_no: dep.identification_no || null,
        notes: dep.notes || null,

        is_disabled: !!dep.is_disabled,
        is_studying: !!dep.is_studying,

        // Only for children; otherwise null to avoid polluting data
        child_relief_percent: isChild && typeof dep.child_relief_percent === 'number'
          ? dep.child_relief_percent
          : 0,
      };
    });

    const dependentsData = {
      dependents: dependentsPayload,
      deletedDependents: deletedDependents, // numbers only
    };

    //formDataToSend.append('dependentsData', JSON.stringify(dependentsData));


    // Add training record attachments (only new files, exclude existing ones)
    trainingRecords.forEach((record, recordIndex) => {
      if (record.attachments && record.attachments.length > 0) {
        const newAttachments = record.attachments.filter(doc => 
          doc.file && !doc.id && !doc.url // Only new files without existing ID or URL
        );
        
        newAttachments.forEach((doc) => {
          if(doc.file) {
            const isEditMode = record.id?.startsWith('temp_') ? 0 : 1;
            formDataToSend.append(`employee-data|${EMPLOYEE_TRAINING_RECORDS_DOCUMENT[0].type}|${isEditMode ? record.id : recordIndex}|${isEditMode}`, doc.file);
          }
        });
      }
    });

    // Add disciplinary record attachments (only new files, exclude existing ones)
    disciplinaryRecords.forEach((record, recordIndex) => {
      if (record.attachments && record.attachments.length > 0) {
        const newAttachments = record.attachments.filter(doc => 
          doc.file && !doc.id && !doc.url // Only new files without existing ID or URL
        );
        
        newAttachments.forEach((doc) => {
          if(doc.file) {
            const isEditMode = record.id?.startsWith('temp_') ? 0 : 1;
            formDataToSend.append(`employee-data|${EMPLOYEE_DISCIPLINARY_RECORDS_DOCUMENT[0].type}|${isEditMode ? record.id : recordIndex}|${isEditMode}`, doc.file);
          }
        });
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}`, {
      method: 'PUT',
      body: formDataToSend
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update employee: ${response.statusText}`);
    }
    
    // Fetch the updated employee data instead of just updating the state
    const updatedEmployee = await getEmployeeById(employeeId);
    setEmployee(updatedEmployee);
    setIsEditing(false);
    
    // Clear local state
    setDeletedTrainingRecords([]);
    setDeletedDisciplinaryRecords([]);
    setDeletedDependents([]);
    
    // Refresh training records from database
    try {
      const trainingResponse = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/training-records`);
      if (trainingResponse.ok) {
        const trainingData = await trainingResponse.json();
        if (trainingData.success) {
          const records = trainingData.training_records || [];
          setTrainingRecords(records);
          setOriginalTrainingRecords(records);
        }
      }
    } catch (error) {
      console.error('Error refreshing training records:', error);
    }

    // Refresh disciplinary records from database
    try {
      const disciplinaryResponse = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/disciplinary-records`);
      if (disciplinaryResponse.ok) {
        const disciplinaryData = await disciplinaryResponse.json();
        if (disciplinaryData.success) {
          const records = disciplinaryData.disciplinary_records || [];
          setDisciplinaryRecords(records);
          setOriginalDisciplinaryRecords(records);
        }
      }
    } catch (error) {
      console.error('Error refreshing disciplinary records:', error);
    }

    await persistDependentChanges(
      employeeId,
      originalDependents,
      formData.dependents ?? dependents, // use the most up-to-date list
      deletedDependents
    );
    setDeletedDependents([]);
    // Refresh dependents from database
    try {
      const dependentsResponse = await fetch(`${API_BASE_URL}/api/dependents/${employeeId}`);
      if (dependentsResponse.ok) {
        const dependentsData = await dependentsResponse.json();
        if (dependentsData.success) {
          const records = dependentsData.data || [];
          setDependents(records);
          setOriginalDependents([...records]);
          setDeletedDependents([]);

          setFormData(prev => prev ? { ...prev, dependents: records } : prev);
        }
      }
    } catch (error) {
      console.error('Error refreshing dependents:', error);
    }
    
    // Show success notification
    showNotification('Employee updated successfully!', 'success');
    
  } catch (error) {
    console.error('Error updating employee:', error);
    setError('Failed to update employee. Please try again.');
    
    // Show error notification
    showNotification(error instanceof Error ? error.message : 'Failed to update employee.', 'error');
  } finally {
    setSaveLoading(false);
  }
};
  
const [emailSending, setEmailSending] = useState(false);
const [showPw, setShowPw] = useState(false);

async function handleSendTempPasswordEmail() {
  if (!employee?.id) return showNotification('Missing employee ID', 'error');
  if (!employee?.email) return showNotification('Employee has no email on file', 'warning');

  try {
    setEmailSending(true);
    const res = await fetch(`${API_BASE_URL}/api/employees/${employee.id}/send-temp-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempPassword }),
    });
    if (!res.ok) throw new Error(await res.text());
    showNotification('Temporary password emailed to the employee', 'success');
  } catch (err) {
    showNotification('Failed to send email', 'error');
  } finally {
    setEmailSending(false);
  }
}

async function handleClose() {
  setShowTempPasswordModal(false);
}


const [resetting, setResetting] = useState(false);
const [showResetConfirm, setShowResetConfirm] = useState(false);
const [showTempPasswordModal, setShowTempPasswordModal] = useState(false);
const [tempPassword, setTempPassword] = useState('');


  const toggleEditMode1 = () => {
  if (isEditing) {
    
    //setFormData(employee);
    //setFormData(employee as EmployeeData & { dependents: Dependent[] });

    setFormData(prev => ({
  ...(employee as EmployeeData),
  dependents: originalDependents, // source of truth from last fetch
}));

    
    setTrainingRecords([...originalTrainingRecords]);
    setDeletedTrainingRecords([]);

    // Reset disciplinary records state to original
    setDisciplinaryRecords([...originalDisciplinaryRecords]);
    setDeletedDisciplinaryRecords([]);

    // Reset dependents state to original
    setDependents([...originalDependents]);
    setDeletedDependents([]);
  }
  else
  {
     setFormData(prev => prev ? { ...prev, dependents: dependents } : prev);
  }
  setIsEditing(!isEditing);
};

const toggleEditMode = () => {
  const next = !isEditing;

  if (next) {
    // ENTER edit mode
    setFormData(prev => {
      const seededCompany: string =
        String(prev?.company_id ?? employee?.company_id ?? '');

      const seededOffice: string | null =
        (prev?.office_id ?? employee?.office_id ?? '') || null;

      // load offices for the seeded company so the office select is populated
      if (seededCompany) fetchOffices(seededCompany);

      if (prev) {
        return {
          ...prev,
          company_id: seededCompany,     // string ('' when none)
          office_id: seededOffice,       // string | null
          dependents,
        };
      }

      // when there was no prev formData, build from employee
      return {
        ...(employee as EmployeeData),
        company_id: seededCompany,       // coerce to string
        office_id: seededOffice,         // keep nullable
        dependents,
      };
    });
  } else {
    // EXIT edit mode -> restore snapshot
    setFormData(() => ({
      ...(employee as EmployeeData),
      company_id: String(employee?.company_id ?? ''),   // ensure string
      office_id: (employee?.office_id ?? '') || null,   // back to null if empty
      dependents: originalDependents,
    }));

    setTrainingRecords([...originalTrainingRecords]);
    setDeletedTrainingRecords([]);
    setDisciplinaryRecords([...originalDisciplinaryRecords]);
    setDeletedDisciplinaryRecords([]);
    setDependents([...originalDependents]);
    setDeletedDependents([]);
  }

  setIsEditing(next);
};


const isPersisted = (d: Dependent) => {
  const idStr = String(d?.id ?? '');
  // numeric ID and not a temp_ string
  return Number.isFinite(Number(idStr)) && !idStr.startsWith('temp_');
};

const normalizeDependent = (d: Dependent) => ({
  full_name: (d.full_name || '').trim(),
  relationship: d.relationship || null,
  birth_date: toDateOnly(d.birth_date),  // <- ensures 'YYYY-MM-DD'
  gender: d.gender || null,
  nationality: d.nationality || null,
  identification_no: d.identification_no || null,
  notes: d.notes || null,
  is_disabled: !!d.is_disabled,
  is_studying: !!d.is_studying,
  child_relief_percent:
    d.relationship === 'Child' && typeof d.child_relief_percent === 'number'
      ? d.child_relief_percent
      : 0,
});


const equalDependents = (a: Dependent, b: Dependent) =>
  JSON.stringify(normalizeDependent(a)) === JSON.stringify(normalizeDependent(b));

const diffDependents = (original: Dependent[], current: Dependent[], deletedIds: number[]) => {
  const creates = (current || []).filter(d => !isPersisted(d));
  const updates = (current || [])
    .filter(d => isPersisted(d))
    .filter(d => {
      const prev = original.find(o => String(o.id) === String(d.id));
      return !prev || !equalDependents(prev, d);
    });
  const deletes = [...new Set((deletedIds || []).filter(n => Number.isFinite(n)))];
  return { creates, updates, deletes };
};

const persistDependentChanges = async (
  employeeId: string,
  original: Dependent[],
  current: Dependent[],
  deletedIds: number[]
) => {
  const { creates, updates, deletes } = diffDependents(original, current, deletedIds);

  const depBase = `${API_BASE_URL}/api/dependents`;
  const collectionUrl = `${depBase}/${employeeId}`;        // GET/POST (single)
  const bulkUrl = `${depBase}/${employeeId}/bulk`;         // POST (bulk)
  const itemUrl = (id: number | string) => `${depBase}/${id}`; // PUT/DELETE

  // build requests
  const reqs: Promise<Response>[] = [];

  // CREATE
  if (creates.length === 1) {
    reqs.push(
      fetch(collectionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...normalizeDependent(creates[0]), employee_id: Number(employeeId) }),
      })
    );
  } else if (creates.length > 1) {
    reqs.push(
      fetch(bulkUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dependents: creates.map(d => normalizeDependent(d)),
        }),
      })
    );
  }

  // UPDATE
  for (const d of updates) {
    reqs.push(
      fetch(itemUrl(d.id as number), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizeDependent(d)),
      })
    );
  }

  // DELETE
  for (const id of deletes) {
    reqs.push(fetch(itemUrl(id), { method: 'DELETE' }));
  }

  if (reqs.length === 0) return;

  const results = await Promise.allSettled(reqs);
  const failures = results.filter(
    r => r.status === 'rejected' || (r.status === 'fulfilled' && !(r.value as Response).ok)
  );

  if (failures.length) {
    // optional: surface details to help debug quickly
    const msgs = await Promise.all(
      results.map(async r => {
        if (r.status === 'fulfilled') {
          const res = r.value as Response;
          if (!res.ok) {
            let msg = '';
            try { msg = (await res.json()).error || ''; } catch {}
            return `${res.url} → ${res.status} ${res.statusText} ${msg}`;
          }
        } else {
          return String(r.reason);
        }
        return '';
      })
    );
    throw new Error(`Some dependents failed to save:\n${msgs.filter(Boolean).join('\n')}`);
  }
};



  // Handle employee soft delete (set status to inactive)
  const handleSoftDelete = async () => {
    // Prevent non-admin users from deactivating employees
    if (user?.role !== 'admin') {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Unauthorized: Only admin users can deactivate employees.</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
      return;
    }
    
    setShowDeleteModal(true);
  };
  
  // Confirm soft delete
  const confirmSoftDelete = async () => {
    if (!employee) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      
      // Make API call to update the employee status to inactive
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'inactive' })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to deactivate employee: ${response.statusText}`);
      }
      
      // Update the employee data locally
      setEmployee({
        ...employee,
        status: 'Inactive'
      });
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'toast toast-middle toast-center';
      successMsg.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Employee deactivated successfully!</span>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deactivating employee:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>${error instanceof Error ? error.message : 'Failed to deactivate employee.'}</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle employee reactivation (set status to active)
  const handleReactivate = async () => {
    // Prevent non-admin users from reactivating employees
    if (user?.role !== 'admin') {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Unauthorized: Only admin users can reactivate employees.</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
      return;
    }
    
    setShowReactivateModal(true);
  };
  
  // Confirm reactivation
  const confirmReactivate = async () => {
    if (!employee) {
      return;
    }
    
    try {
      setReactivateLoading(true);
      
      // Make API call to update the employee status to active
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Active' })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to reactivate employee: ${response.statusText}`);
      }
      
      // Update the employee data locally
      setEmployee({
        ...employee,
        status: 'Active'
      });
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'toast toast-middle toast-center';
      successMsg.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Employee reactivated successfully!</span>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
      
      setShowReactivateModal(false);
    } catch (error) {
      console.error('Error reactivating employee:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>${error instanceof Error ? error.message : 'Failed to reactivate employee.'}</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
    } finally {
      setReactivateLoading(false);
    }
  };

  // Handle transfer form department changes
  useEffect(() => {
    if (!transferFormData.department_id) {
      setPositions([]);
      setUniquePositionTitles([]);
      setJobLevels([]);
      return;
    }
    
    const fetchPositionsForTransfer = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/departments/${transferFormData.department_id}/positions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch positions: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // If we get positions from the API
        if (data && data.success && Array.isArray(data.positions)) {
          // Store full position data
          const positionsList = data.positions.map((pos: Position) => ({
            id: pos.id,
            title: pos.title || '',
            job_level: pos.job_level || '',
            department_id: pos.department_id
          }));
          setPositions(positionsList);
          
          // Extract unique position titles
          const uniqueTitles: string[] = [...new Set(positionsList.map((p: Position) => p.title))].filter((title): title is string => Boolean(title));
          setUniquePositionTitles(uniqueTitles);
          
          // Reset position and job level when department changes
          setTransferFormData(prev => ({...prev, position: '', job_level: '', position_id: ''}));
          setJobLevels([]);
          
          return;
        }
        
        // Fallback if API returns unexpected data structure
        fallbackToMockPositionsForTransfer();
      } catch (error) {
        console.error('Error fetching positions for transfer:', error);
        fallbackToMockPositionsForTransfer();
      }
    };
    
    const fallbackToMockPositionsForTransfer = () => {
      // Fallback mock data with job levels
      const mockPositions = [
        { id: '1', title: 'Software Engineer', job_level: 'Junior' },
        { id: '2', title: 'Software Engineer', job_level: 'Mid' },
        { id: '3', title: 'Software Engineer', job_level: 'Senior' },
        { id: '4', title: 'Project Manager', job_level: 'Manager' },
        { id: '5', title: 'Designer', job_level: 'Mid' },
        { id: '6', title: 'Designer', job_level: 'Senior' },
      ];
      
      setPositions([]);
      
      // Extract unique position titles
      const uniqueTitles = [...new Set(mockPositions.map(p => p.title))];
      setUniquePositionTitles(uniqueTitles);
      
      // Reset position and job level
      setTransferFormData(prev => ({...prev, position: '', job_level: '', position_id: ''}));
      setJobLevels([]);
    };
    
    fetchPositionsForTransfer();
  }, [transferFormData.department_id]);

  // Handle transfer form changes
  const handleTransferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransferFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle position selection (now by title instead of id)
    if (name === 'position') {
      // Reset job level when position changes
      setTransferFormData(prev => ({
        ...prev,
        position: value,
        job_level: '', 
        position_id: '' // Reset position_id until job level is selected
      }));
      
      // Update job levels based on selected position title
      const relevantJobLevels: string[] = positions
        .filter((p: Position) => p.title === value)
        .map((p: Position) => p.job_level)
        .filter((level): level is string => Boolean(level));
        
      setJobLevels([...new Set(relevantJobLevels)]); // Remove duplicates
    }

    // When job level is selected, update the position_id
    if (name === 'job_level') {
      // Find matching position with the selected title and job level
      const matchingPosition = positions.find(
        (p: Position) => p.title === transferFormData.position && p.job_level === value
      );
      
      if (matchingPosition) {
        setTransferFormData(prev => ({
          ...prev,
          position_id: matchingPosition.id,
          job_level: value
        }));
      }
    }
  };

  // Fetch departments for transfer when company changes
  useEffect(() => {
    const fetchDepartmentsForTransfer = async () => {
      if (!transferFormData.company_id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/employees/companies/${transferFormData.company_id}/departments`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // For transfer we only want departments from the selected company
        setDepartments(data);
        
        // Clear the department selection when company changes
        setTransferFormData(prev => ({...prev, department_id: '', position: ''}));
      } catch (error) {
        console.error('Error fetching departments for transfer:', error);
      }
    };
    
    fetchDepartmentsForTransfer();
  }, [transferFormData.company_id]);

  // Fetch employee past positions
  const fetchPastPositions = async () => {
    if (!employee?.id) return;
    
    try {
      setPastPositionsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employee.id}/past-positions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch past positions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPastPositions(data);
    } catch (error) {
      console.error('Error fetching past positions:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Failed to load past positions. Please try again.</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
    } finally {
      setPastPositionsLoading(false);
    }
  };

  // Handle opening past positions modal
  const handleViewPastPositions = () => {
    setShowPastPositionsModal(true);
    fetchPastPositions();
  };

  // Handle transfer submission
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee?.id) return;
    
    // Prevent non-admin users from submitting transfers
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
    
    try {
      setTransferLoading(true);
      
      // Create transfer data object with all needed fields
      const transferData = {
        company_id: transferFormData.company_id,
        department_id: transferFormData.department_id,
        position: transferFormData.position,
        job_level: transferFormData.job_level,
        position_id: transferFormData.position_id
      };
      
      const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employee.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transferData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to transfer employee: ${response.statusText}`);
      }
      
      // Success! Reload the employee data
      const updatedEmployee = await getEmployeeById(employee.id);
      setEmployee(updatedEmployee);
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'toast toast-middle toast-center';
      successMsg.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Employee transferred successfully!</span>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
      
      // Close the modal
      setShowTransferModal(false);
    } catch (error: any) {
      console.error('Error transferring employee:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'toast toast-middle toast-center';
      errorMsg.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Failed to transfer employee. Please try again.</span>
        </div>
      `;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
    } finally {
      setTransferLoading(false);
    }
  };

  // Update groupedPositions whenever positions change
  useEffect(() => {
    if (positions.length > 0) {
      const grouped: {[title: string]: {[level: string]: string}} = {};
      
      positions.forEach((position: Position) => {
        if (position.title && position.job_level) {
          if (!grouped[position.title]) {
            grouped[position.title] = {};
          }
          
          grouped[position.title][position.job_level] = position.id;
        }
      });
      
      setGroupedPositions(grouped);
    }
  }, [positions]);


  const parsedNewPositionId = useMemo(() => {
  const raw = formData?.position_id;
  if (!raw) return 0;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return n;

  // Fallback: try to find by (position, job_level)
  const m = positions.find(
    p => (String(p.id) === String(raw)) ||
         (p.title === formData?.position && p.job_level === formData?.job_level)
  );
  const n2 = Number(m?.id);
  return Number.isFinite(n2) && n2 > 0 ? n2 : 0;
}, [formData?.position_id, formData?.position, formData?.job_level, positions]);


  useEffect(() => {
  if (!formData?.position || !formData?.job_level) return;

  const computed = groupedPositions[formData.position]?.[formData.job_level];
  if (!computed) return;

  // only set when changed to avoid loops
  if (formData.position_id === computed) return;

  //setFormData(prev => (prev ? { ...prev, position_id: computed } : prev));
    setFormData(prev => (prev && prev.position_id !== computed)
    ? { ...prev, position_id: computed }
    : prev
  );
}, [formData?.position, formData?.job_level, groupedPositions]);

useEffect(() => {
  if (!isEditing || !formData || !employee) {
    lastPromptKeyRef.current = null;
    suppressPromptRef.current = false;
    return;
  }

  if (!showPromotionModal) {
    const newPid = String(formData.position_id ?? '');
    const newLvl = String(formData.job_level ?? '');
    const curPid = String(employee.position_id ?? '');
    const curLvl = String(employee.job_level ?? '');

    const bothSelected = newPid !== '' && newLvl !== '';
    const changed = bothSelected && (newPid !== curPid || newLvl !== curLvl);
    const pidOk = Number.isFinite(Number(newPid)) && Number(newPid) > 0;

    const key = `${newPid}|${newLvl}`;

    if (changed && pidOk) {
      if (!suppressPromptRef.current && lastPromptKeyRef.current !== key) {
        lastPromptKeyRef.current = key;
        setShowPromotionModal(true);
      }
    } else {
      lastPromptKeyRef.current = null;
      suppressPromptRef.current = false;
    }
  }
}, [
  isEditing,
  showPromotionModal,
  formData,   // ← add
  employee    // ← add
]);

useEffect(() => {
  if (!formData || !formData.position || !formData.job_level) return;

  const computed = groupedPositions[formData.position]?.[formData.job_level];
  if (!computed) return;
  if (formData.position_id === computed) return; // prevents loops

  setFormData(prev => (prev ? { ...prev, position_id: computed } : prev));
}, [
  formData,          // ← add (covers position, job_level, position_id reads)
  groupedPositions
]);



  // Add useEffect to extract unique position titles
  useEffect(() => {
    if (positions.length > 0) {
      const uniqueTitles = [...new Set(positions.map(pos => pos.title))].filter(Boolean);
      setUniquePositionTitles(uniqueTitles);
    }
  }, [positions]);

  // Populate job levels when formData changes or edit mode is toggled
  useEffect(() => {
    if (isEditing && formData?.position && positions.length > 0) {
      // Find available job levels for this position title
      const availableLevels = [...new Set(
        positions
          .filter(pos => pos.title === formData.position)
          .map(pos => pos.job_level)
      )].filter(Boolean);
      
      setJobLevels(availableLevels as string[]);
    }
  }, [isEditing, formData?.position, positions]);

  // Reset employee number validation state when edit mode is toggled
  useEffect(() => {
    if (!isEditing) {
      setEmployeeNoValidation({
        isValidating: false,
        isValid: null,
        message: ''
      });
    }
  }, [isEditing]);

// when company changes, refresh offices
// 1) When company changes, refresh offices (you already have this)
useEffect(() => {
  const cid = formData?.company_id ?? employee?.company_id;
  if (cid) {
    fetchOffices(String(cid));
  } else {
    setOffices([]);
  }
}, [formData?.company_id, employee?.company_id]);

// 2) After offices load, if no formData.office_id set yet,
//    but employee has an office that exists in the filtered list, set it.
useEffect(() => {
  const currentFormOfficeId = formData?.office_id;
  const employeeOfficeId = employee?.office_id;

  if (
    (currentFormOfficeId == null || currentFormOfficeId === '') &&
    employeeOfficeId != null &&
    offices.some(o => String(o.id) === String(employeeOfficeId))
  ) {
    // Keep types consistent: store number if you use numbers
    setFormData((f: any) => ({ ...f, office_id: Number(employeeOfficeId) }));
  }
}, [offices, formData?.office_id, employee?.office_id]);

// 3) If company changes and the currently selected office is not in the new list, clear it.
// 3) Only clear the office when the *company actually changed* from the employee's original.
//    Prevents wiping office_id when entering edit mode or just refetching offices.
useEffect(() => {
  const selectedOfficeId = formData?.office_id ?? employee?.office_id ?? null;

  // Did user change company from the employee's original company?
  const originalCompanyId = employee?.company_id ?? null;
  const currentCompanyId  = formData?.company_id ?? employee?.company_id ?? null;
  const companyChanged =
    String(currentCompanyId ?? '') !== String(originalCompanyId ?? '');

  if (
    companyChanged &&                           // only when company actually changed
    selectedOfficeId != null &&
    !offices.some(o => String(o.id) === String(selectedOfficeId))
  ) {
    setFormData((f: any) => ({ ...f, office_id: null }));
  }
}, [offices, formData?.company_id, employee?.company_id, formData?.office_id, employee?.office_id]);


// Treat DB 0/1 or true/false as boolean
const asActive = (v: unknown) => (typeof v === 'number' ? v === 1 : !!v);


const hasOffice = Boolean(formData?.office_id ?? employee?.office_id);
const hasActiveRanges = (officeRanges ?? []).some(r => asActive(r.is_active));
const canAddIpOverride = hasOffice && hasActiveRanges;
const canSavePolicy = hasActiveRanges;


// when user opens IP Overrides tab, load overrides + policy
useEffect(() => {
  if (activeTab === 'ip-overrides') {
    fetchIpOverrides();
    fetchPolicy();
    fetchOfficeRangesForEmployee();
  //fetchOfficeRanges();
  }
}, [activeTab, formData?.office_id, employee?.office_id,, employeeId]);

useEffect(() => {
  // (re)load ranges whenever office changes
  fetchOfficeRangesForEmployee();
}, [formData?.office_id, employee?.office_id]);


//new 
const [resignReason, setResignReason] = useState('');
const [bondingError, setBondingError] = useState<{
  message: string;
  bonds: Array<{training_course: string; bond_end_date: string}>;
} | null>(null);

// Update the handleConfirmResign function
const handleConfirmResign = async () => {
  if (!resignDate || !employeeId) return;

  try {
    setResignLoading(true);

    const response = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/resign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        resigned_date: resignDate,
        resignation_reason: resignReason 
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle bonding error with a nice popup
      if (data?.error && data?.bonds) {
        setBondingError({
          message: data.error,
          bonds: data.bonds
        });
        return;
      }
      showNotification(data?.error || 'Failed to process resignation', 'error');
      return;
    }

    // Success case
    if (employee) {
      setEmployee({
        ...employee,
        status: 'Resigned',
        resigned_date: resignDate
      });
    }

    showNotification('Employee resignation processed successfully!', 'success');
    setShowResignModal(false);
    setResignDate('');
    setResignReason('');
  } catch (error) {
    console.error('Error processing resignation:', error);
    showNotification(error instanceof Error ? error.message : 'Failed to process resignation', 'error');
  } finally {
    setResignLoading(false);
  }
};


useEffect(() => {
  const fetchDependents = async () => {
    setDependentsLoading(true);
    setDependentsError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/dependents/${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dependents: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const records = data.data || [];
        setDependents(records);
        setOriginalDependents(records);
        setFormData(prev => prev ? { ...prev, dependents: records } : prev);
      } else {
        throw new Error(data.error || 'Failed to fetch dependents');
      }
    } catch (error) {
      console.error('Error fetching dependents:', error);
      setDependentsError('Failed to load dependents');
      setDependents([]);
    } finally {
      setDependentsLoading(false);
    }
  };
  
  if (activeTab === 'dependents') {
    fetchDependents();
  }
}, [employeeId, activeTab]);





const BondingErrorModal = () => {
  if (!bondingError) return null;
  
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg text-error">Cannot Process Resignation</h3>
        <div className="py-4">
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{bondingError.message}</span>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Active Bonding Periods:</h4>
            <div className="space-y-3">
              {bondingError.bonds.map((bond, index) => (
                <div key={index} className="flex items-start p-3 bg-white rounded border border-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-600">{bond.training_course}</div>
                    <div className="text-sm text-gray-600">
                      Bond ends: {new Date(bond.bond_end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>The employee cannot resign until all bonding periods have ended or have been resolved.</p>
          </div>
        </div>
        <div className="modal-action">
          <button 
            className="btn" 
            onClick={() => setBondingError(null)}
          >
            Understand
          </button>
        </div>
      </div>
    </div>
  );
};

  // DRY notification function using DaisyUI toast
  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) => {
    const toast = document.createElement('div');
    toast.className = 'toast toast-middle toast-center z-[9999]';
    
    // Define icons and alert classes for different types
    const config = {
      success: {
        alertClass: 'alert-success',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
      },
      error: {
        alertClass: 'alert-error',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
      },
      warning: {
        alertClass: 'alert-warning',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.334 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>`
      },
      info: {
        alertClass: 'alert-info',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
      }
    };

    const selectedConfig = config[type];
    
    toast.innerHTML = `
      <div class="alert ${selectedConfig.alertClass}">
        ${selectedConfig.icon}
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after specified duration
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, duration);
  };

  // Required fields configuration
  const requiredFields = [
    { field: 'name', label: 'Full Name' },
    { field: 'email', label: 'Email' },
    { field: 'country_code', label: 'Country Code' },
    { field: 'nationality', label: 'Nationality' },
    { field: 'mobile_number', label: 'Mobile Number' },
    { field: 'race', label: 'Race' },
    { field: 'religion', label: 'Religion' },
    { field: 'dob', label: 'Date of Birth' },
    { field: 'gender', label: 'Gender' },
    { field: 'marital_status', label: 'Marital Status' },
    { field: 'visa_expired_date', label: 'Visa Expiry Date' },
    { field: 'employee_no', label: 'Employee Number' },
    { field: 'company_id', label: 'Company' },
    { field: 'education_level', label: 'Education Level' },
    { field: 'salary', label: 'Salary' },
    { field: 'payment_company', label: 'Payment Company' },
    { field: 'pay_interval', label: 'Pay Interval' },
    { field: 'bank_name', label: 'Bank Name' },
    { field: 'bank_currency', label: 'Bank Currency' },
    { field: 'bank_account_name', label: 'Bank Account Name' },
    { field: 'bank_account_no', label: 'Bank Account Number' },
    { field: 'department_id', label: 'Department' },
    { field: 'position_id', label: 'Position' },
    { field: 'job_level', label: 'Job Level' }
  ];

  // Validate required fields and return missing field names
  const validateRequiredFields = (formData: any): string[] => {
    const missingFields: string[] = [];
    
    requiredFields.forEach(({ field, label }) => {
      const value = formData[field];
      if (!value || value.toString().trim() === '') {
        missingFields.push(label);
      }
    });
    
    return missingFields;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (error || !employee) {
    return (
      <div className="container mx-auto p-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error || 'Employee not found'}</span>
        </div>
        <div className="mt-4">
          <Link href="/employees" className="btn btn-primary">Back to Employees</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
        <nav className="text-sm breadcrumbs">
          <ul>
            <li><Link href="/">Dashboard</Link></li>
            <li><Link href="/employees">Employees</Link></li>
            <li className="font-semibold">{employee.name}</li>
          </ul>
        </nav>
        
        <div className="flex gap-2 justify-end">
          {user?.role === 'admin' && (
            <button 
              className={`btn ${isEditing ? 'btn-ghost' : 'btn-info'}`}
              onClick={toggleEditMode}
            >
              {isEditing ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">Cancel</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Edit</span>
                </>
              )}
            </button>
          )}


          {/* Add this button next to the edit button */}
          {employee?.status.toLowerCase() === 'active' && (
            <button 
              className={`btn  ${isEditing ? 'btn-ghost' : 'btn-info'}`}
              onClick={() => setShowResignModal(true)}
              disabled={isEditing}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
            </svg>
              <span className="hidden sm:inline">Resign</span>
            </button>
          )}
          
          {!isEditing && (
            <>
              {user?.role === 'admin' && (
                <button 
                  className="btn btn-info"//accent
                  onClick={() => setShowTransferModal(true)}
                  disabled={employee.status.toLowerCase() === 'inactive'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="hidden sm:inline">Transfer</span>
                </button>
              )}

              {employee.status.toLowerCase() === 'inactive' ? (
                user?.role === 'admin' && (
                  <button 
                    className="btn btn-success"
                    onClick={handleReactivate}
                    disabled={reactivateLoading}
                  >
                    {reactivateLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="hidden sm:inline">{reactivateLoading ? 'Reactivating...' : 'Reactivate'}</span>
                  </button>
                )
              ) : (
                user?.role === 'admin' && (
                  <button 
                    className="btn btn-info"
                    onClick={handleSoftDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    <span className="hidden sm:inline">{deleteLoading ? 'Deactivating...' : 'Deactivate'}</span>
                  </button>
                )
              )}
              
              <Link 
                href={`/employees`}
                className="btn btn-outline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-base-100 rounded-lg shadow p-6">
        {/* Restructured employee header without avatar */}
        <div className="">
          <div className="">
            <div>
              {loading ? (
                <>
                  <div className="h-8 bg-base-300 rounded w-48 animate-pulse"></div>
                  <div className="h-5 bg-base-300 rounded w-32 mt-1 animate-pulse"></div>
                </>
              ) : (
                <div className="">
                <div className="flex flex-row items-center justify-between gap-2">
                  <h1 className="text-3xl font-bold">{employee?.name}</h1>
                  <div className={`badge py-3 px-4
                    ${employee?.status === 'Active' ? 'badge-success' : employee?.status === 'Resigned' ? 'badge-warning' : 'badge-error'}`}>
                    {employee?.status || 'Active'}
                  </div>
                </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="text-sm font-medium">{employee?.employee_no}</div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-gray-600 font-medium">{employee?.position}</div>
                      <div className="text-gray-400">•</div>
                      <div className="text-gray-600">{employee?.department_name || employee?.department_id}</div>
                    </div>
                      <div className="text-sm text-gray-500">
                        Years of Service: {calculateYearsOfService(employee?.joined_date)}
                      </div>
                      <div>
                        <button 
                          className="btn btn-xs btn-info"
                          onClick={handleViewPastPositions}
                          title="View Past Positions"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Past Positions
                        </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 p-3 bg-base-200 rounded-lg mt-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Email</span>
              <span className="font-medium">{employee?.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Department</span>
              <span className="font-medium">{employee?.department_name || employee?.department_id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Joined Date</span>
              <span className="font-medium">{formatDateForDisplay(employee?.joined_date)}</span>
            </div>
            {/* <div className="flex flex-col">
              <span className="text-xs text-gray-500">Position Start Date</span>
              <span className="font-medium">{formatDateForDisplay(employee?.current_position_start_date || employee?.joined_date)}</span>
            </div> */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Confirmation Date</span>
              <span className="font-medium">
                {hasRealDate(employee?.confirmation_date)
                  ? formatDateForDisplay(employee!.confirmation_date!)
                  : <span className="font-medium">-</span>}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Phone</span>
              <span className="font-medium">{employee?.mobile_number}</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="relative">
            {/* Left fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none opacity-0 transition-opacity duration-300" id="left-fade"></div>
            
            {/* Right fade effect */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-base-100 to-transparent z-10 pointer-events-none opacity-0 transition-opacity duration-300" id="right-fade"></div>
            
            {/* Scrollable tabs container */}
            <div 
              className="overflow-x-auto scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(209 213 219) transparent'
              }}
              onScroll={(e) => {
                const container = e.target as HTMLElement;
                const leftFade = document.getElementById('left-fade');
                const rightFade = document.getElementById('right-fade');
                
                if (leftFade && rightFade) {
                  // Show left fade if scrolled right
                  leftFade.style.opacity = container.scrollLeft > 0 ? '1' : '0';
                  
                  // Show right fade if can scroll more to the right
                  const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);
                  rightFade.style.opacity = canScrollRight ? '1' : '0';
                }
              }}
            >
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
                <button 
                  className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'documents' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('documents')}
                >
                  Documents
                </button>
                <button 
                  className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'increments' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('increments')}
                >
                  Increments
                </button>
                <button
                  className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'ip-overrides' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('ip-overrides')}
                >
                  IP Overrides
                </button>

              </div>
            </div>
          </div>
        </div>
        
        {/* Form or View based on edit mode */}
        <form onSubmit={handleSubmit}>
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name field */}
                <div>
                  <div className="mb-2">Full Name <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name" 
                      value={formData?.name || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.name}</div>
                  )}
                </div>
                
                {/* Email field */}
                <div>
                  <div className="mb-2">Email <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="email" 
                      value={formData?.email || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.email}</div>
                  )}
                </div>


                {user?.role === 'admin' && (
                <div className="mb-6">
                  <label className="flex items-center gap-1 text-sm font-semibold mb-2 text-gray-700">
                    Password
                    <div className="tooltip tooltip-right" data-tip="Password is hidden for security. Click Reset to generate a new one.">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                    </div>
                  </label>

                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="password"
                      disabled
                      className="input input-bordered flex-1 truncate"
                      value={'*'.repeat(formData?.password?.length || 12)}
                      readOnly
                    />

                    <button
                      type="button"
                      className="btn btn-info btn-sm whitespace-nowrap"
                      onClick={() => setShowResetConfirm(true)}
                      disabled={resetting}
                    >
                      {resetting ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9A3.75 3.75 0 1112 5.25m3.75 3.75L21 14.25M21 14.25h-2.25M21 14.25v2.25" />
                          </svg>
                          Reset
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}


                {/* Country Code field */}
                <div>
                  <div className="mb-2">Country Code <span className="text-error">*</span></div>
                  {isEditing ? (
                    <select 
                    name="country_code" 
                    value={formData?.country_code || ''} 
                    onChange={handleChange} 
                    className="select select-bordered w-full" 
                    >
                      <option value="" disabled>Select country code</option>
                      <option value="+60">Malaysia (+60)</option>
                      <option value="+65">Singapore (+65)</option>
                      <option value="+61">Australia (+61)</option>
                      <option value="+880">Bangladesh (+880)</option>
                      <option value="+55">Brazil (+55)</option>
                      <option value="+673">Brunei (+673)</option>
                      <option value="+855">Cambodia (+855)</option>
                      <option value="+86">China (+86)</option>
                      <option value="+20">Egypt (+20)</option>
                      <option value="+33">France (+33)</option>
                      <option value="+49">Germany (+49)</option>
                      <option value="+91">India (+91)</option>
                      <option value="+62">Indonesia (+62)</option>
                      <option value="+39">Italy (+39)</option>
                      <option value="+81">Japan (+81)</option>
                      <option value="+856">Laos (+856)</option>
                      <option value="+95">Myanmar (+95)</option>
                      <option value="+31">Netherlands (+31)</option>
                      <option value="+64">New Zealand (+64)</option>
                      <option value="+92">Pakistan (+92)</option>
                      <option value="+63">Philippines (+63)</option>
                      <option value="+7">Russia (+7)</option>
                      <option value="+34">Spain (+34)</option>
                      <option value="+27">South Africa (+27)</option>
                      <option value="+82">South Korea (+82)</option>
                      <option value="+66">Thailand (+66)</option>
                      <option value="+670">Timor-Leste (+670)</option>
                      <option value="+90">Turkey (+90)</option>
                      <option value="+44">United Kingdom (+44)</option>
                      <option value="+1">United States (+1)</option>
                      <option value="+84">Vietnam (+84)</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.country_code || 'Not provided'}</div>
                  )}
                </div>
                
                  {/* Mobile Number field */}
                  <div>
                    <div className="mb-2">Mobile Number <span className="text-error">*</span></div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="mobile_number" 
                        value={formData?.mobile_number || ''} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required 
                      />
                    ) : (
                      <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.mobile_number}</div>
                    )}
                  </div>
                  
                {/* Gender field */}
                <div>
                  <div className="mb-2">Gender <span className="text-error">*</span></div>
                  {isEditing ? (
                    <select 
                      name="gender" 
                      value={formData?.gender || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.gender}</div>
                  )}
                </div>
                
                {/* Date of Birth field */}
                <div>
                  <div className="mb-2">Date of Birth <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="date" 
                      name="dob" 
                      value={formData?.dob || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {formatDateForDisplay(employee.dob)}
                    </div>
                  )}
                </div>
                
                {/* Age field */}
                <div>
                  <div className="mb-2">Age</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="age" 
                      value={formData?.age || ''}
                      className="input input-bordered w-full"
                      readOnly
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.age}</div>
                  )}
                </div>
                
                {/* Nationality field */}
                <div>
                  <div className="mb-2">Nationality <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="nationality" 
                      value={formData?.nationality || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.nationality}</div>
                  )}
                </div>
                
                {/* Marital Status field */}
                <div>
                  <div className="mb-2">Marital Status <span className="text-error">*</span></div>
                  {isEditing ? (
                    <select 
                      name="marital_status" 
                      value={formData?.marital_status || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select marital status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.marital_status}</div>
                  )}
                </div>
                
                {/* Status field */}
                <div>
                  <div className="mb-2">Status</div>
                  {isEditing ? (
                    <select 
                      name="status" 
                      value={formData?.status || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Resigned">Resigned</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.status}</div>
                  )}
                </div>
                
                {/* Activation field */}
                <div>
                  <div className="mb-2">Activation</div>
                  {isEditing ? (
                    <select 
                      name="activation" 
                      value={formData?.activation || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select activation status</option>
                      <option value="Activated">Activated</option>
                      <option value="Deactivated">Deactivated</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.activation}</div>
                  )}
                </div>
                
                {/* Race field */}
                <div>
                  <div className="mb-2">Race <span className="text-error">*</span></div>
                  {isEditing ? (
                    <select 
                      name="race" 
                      value={formData?.race || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full"
                    >
                      <option value="" disabled>Select race</option>
                      <option value="Malay">Malay</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Indian">Indian</option>
                      <option value="Others">Others</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.race || 'Not provided'}</div>
                  )}
                </div>
                
                {/* Religion field */}
                <div>
                  <div className="mb-2">Religion <span className="text-error">*</span></div>
                  {isEditing ? (
                    <select 
                      name="religion" 
                      value={formData?.religion || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full"
                    >
                      <option value="" disabled>Select religion</option>
                      <option value="Islam">Islam</option>
                      <option value="Buddhist">Buddhist</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Christian">Christian</option>
                      <option value="Others">Others</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.religion || 'Not provided'}</div>
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Identity Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* IC/Passport field */}
                <div>
                  <div className="mb-2">IC/Passport Number</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="ic_passport" 
                      value={formData?.ic_passport || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.ic_passport || 'Not provided'}</div>
                  )}
                </div>
                
                {/* Passport Expiry Date field */}
                <div>
                  <div className="mb-2">Passport Expiry Date</div>
                  {isEditing ? (
                    <input 
                      type="date" 
                      name="passport_expired_date" 
                      value={formData?.passport_expired_date || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {formatDateForDisplay(employee.passport_expired_date)}
                    </div>
                  )}
                </div>
                
                {/* Visa Expiry Date field */}
                <div>
                  <div className="mb-2">Visa Expiry Date <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="date" 
                      name="visa_expired_date" 
                      value={formData?.visa_expired_date || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {formatDateForDisplay(employee.visa_expired_date)}
                    </div>
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-6 mb-8">
                <div>
                  <div className="mb-2">Address</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="address" 
                      placeholder="Enter full address"
                      value={formData?.address || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.address || 'Not provided'}</div>
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="mb-2">Contact Name</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="emergency_contact_name" 
                      placeholder="Enter contact name"
                      value={formData?.emergency_contact_name || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.emergency_contact_name || 'Not provided'}</div>
                  )}
                </div>
                
                <div>
                  <div className="mb-2">Relationship</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="emergency_contact_relationship" 
                      placeholder="Enter relationship"
                      value={formData?.emergency_contact_relationship || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.emergency_contact_relationship || 'Not provided'}</div>
                  )}
                </div>
                
                <div>
                  <div className="mb-2">Phone Number</div>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      name="emergency_contact_phone" 
                      placeholder="Enter phone number"
                      value={formData?.emergency_contact_phone || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.emergency_contact_phone || 'Not provided'}</div>
                  )}
                </div>
                
                <div>
                  <div className="mb-2">Email Address</div>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="emergency_contact_email" 
                      placeholder="Enter email address"
                      value={formData?.emergency_contact_email || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.emergency_contact_email || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Employment Tab */}
          {activeTab === 'employment' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Employment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Employee Number field */}
                <div>
                  <div className="mb-2">Employee Number <span className="text-error">*</span></div>
                  {isEditing ? (
                    <div className="relative">
                      <input 
                        type="text" 
                        name="employee_no" 
                        value={formData?.employee_no || ''} 
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
                      {employeeNoValidation.isValidating && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <div className="loading loading-spinner loading-xs"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.employee_no}</div>
                  )}
                  {isEditing && employeeNoValidation.message && (
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
                </div>
                
                {/* Company ID field */}
                <div>
                  <div className="mb-2">Company <span className="text-error">*</span></div>
                  {isEditing ? (
                    <select 
                      name="company_id" 
                      value={formData?.company_id || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select company</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {companies.find(c => c.id === employee?.company_id)?.name || `Company ID: ${employee?.company_id}`}
                    </div>
                  )}
                </div>


{/* Office field */}
<div>
  <div className="mb-2">Office</div>
  {isEditing ? (
    <div>
      <select
        name="office_id"
        // Normalize to string so it matches <option value="...">
        value={
          formData?.office_id != null
            ? String(formData.office_id)
            : ''
        }
        onChange={(e) => {
          // If your backend expects numbers, convert here.
          const val = e.target.value === '' ? null : Number(e.target.value);
          handleChange({
            target: { name: 'office_id', value: val }
          } as any);
        }}
        className="select select-bordered w-full"
        disabled={officesLoading}
      >
        <option value="">Unassigned</option>
        {offices.map((o) => (
          <option key={o.id} value={String(o.id)}>
            {o.name}
          </option>
        ))}
      </select>

      {officesLoading && (
        <div className="text-xs text-gray-500 mt-1">Loading offices…</div>
      )}
      <div className="text-xs text-gray-500 mt-1">
        Changing company will refresh this list.
      </div>
    </div>
  ) : (
    <div className="p-3 bg-base-200 rounded min-h-[42px]">
      {(() => {
        const id =
          formData?.office_id ??
          employee?.office_id ??
          null;

        const name = id
          ? offices.find(o => String(o.id) === String(id))?.name
          : null;

        // Fallback to whatever label your API gives for employee's office
        return name ?? employee?.office ?? 'Unassigned';
      })()}
    </div>
  )}
</div>





                {/* Department field */}
                <div>
                  <div className="mb-2">Department <span className="text-red-500">*</span></div>
                  {isEditing ? (
                    <select 
                      name="department_id" 
                      value={formData?.department_id || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {employee?.department_name || departments.find(d => d.id === employee?.department_id)?.department_name || employee?.department_id}
                    </div>
                  )}
                </div>

                {/* Superior/supervisor field */}
                <div>
                  <div className="mb-2">Supervisor</div>
                  {isEditing ? (
                    <select
                      name="superior"
                      value={formData?.superior || ''}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      disabled={!formData?.department_id}
                    >
                      <option value="" disabled>{formData?.department_id ? 'Select supervisor' : 'Select department first'}</option>
                      {departmentEmployees
                      .filter(emp => emp.id !== employee?.id)
                      .map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.employee_no})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {departmentEmployees.find(emp => emp.id == employee?.superior)?.name || employee?.superior}
                    </div>
                  )}
                </div>
                
                {/* Manager field */}
                <div>
                  <div className="mb-2">Manager</div>
                  {isEditing ? (
                    <select 
                      name="manager_id" 
                      value={formData?.manager_id || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full"
                      disabled={!formData?.company_id}
                    >
                      <option value="" disabled>
                        {formData?.company_id 
                        ? managers.filter(manager => manager.id !== employee?.id).length > 0 
                          ? 'Select manager' 
                          : 'No managers found for this company' 
                        : 'Select company first'}
                      </option>
                      {managers
                      .filter(manager => manager.id !== employee?.id)
                      .map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} ({manager.employee_no})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {employee?.manager_id && managers.length > 0 
                        ? managers.find(m => m.id === employee?.manager_id)?.name || 'Manager not found'
                        : 'No manager assigned'}
                    </div>
                  )}
                </div>
                
                {/* Employment Type field */}
                <div>
                  <div className="mb-2">Employment Type</div>
                  {isEditing ? (
                    <select 
                      name="employment_type" 
                      value={formData?.employment_type || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select employment type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Intern">Intern</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.employment_type}</div>
                  )}
                </div>
                
                {/* Joined Date field */}
                <div>
                  <div className="mb-2">Joined Date</div>
                  {isEditing ? (
                    <input 
                      type="date" 
                      name="joined_date" 
                      value={formData?.joined_date || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {formatDateForDisplay(employee.joined_date)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-2">Employment Status</div>
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">
                    {formData?.resigned_date ? 'Resigned' :
                     formData?.confirmation_date ? 'Confirmed' :
                     'Under Probation'}
                  </div>
                </div>

                <div>
                  <div className="mb-2">Confirmation Date</div>
                  {isEditing ? (
                    <input 
                      type="date" 
                      name="confirmation_date" 
                      value={formData?.confirmation_date || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {formatDateForDisplay(employee.confirmation_date)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-2">Resigned Date</div>
                  {isEditing ? (
                    <input 
                      type="date" 
                      name="resigned_date" 
                      value={formData?.resigned_date || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {formatDateForDisplay(employee.resigned_date)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-2">Resignation Reason</div>
                  {isEditing ? (
                    <textarea
                      name="resignation_reason"
                      placeholder="e.g., Career change, relocation, personal reasons"
                      value={formData?.resignation_reason || ''}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      // Optional: only allow typing if a resigned date exists
                      disabled={!formData?.resigned_date}
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {employee?.resignation_reason || '—'}
                    </div>
                  )}
                </div>

                {/* Office field */}
                <div>
                  <div className="mb-2">Office Location</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="office" 
                      placeholder="Enter office location"
                      value={formData?.office || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.office || 'Not provided'}</div>
                  )}
                </div>

                <div>
                  <div className="mb-2">Education Level <span className="text-error">*</span></div>
                  {isEditing ? (
                    <select 
                      name="education_level" 
                      value={formData?.education_level || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
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
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.education_level || 'Not provided'}</div>
                  )}
                </div>

                <div>
                  <div className="mb-2">Qualification</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="qualification" 
                      placeholder="Enter qualification"
                      value={formData?.qualification || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.qualification || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Position & Level Tab */}
          {activeTab === 'position' && (
            <section aria-labelledby="position-title" className="space-y-6">
              <h2 id="position-title" className="text-xl font-semibold">
                Position & Level Information
              </h2>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Position */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="position" className="mb-0">
                    Position <span className="text-red-500">*</span>
                  </label>

                  {isEditing ? (
                    <div className="relative">
                      <select
                        id="position"
                        name="position"
                        value={formData?.position || ''}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        required
                        disabled={!formData?.department_id || positionsLoading}
                        aria-busy={positionsLoading}
                        aria-disabled={!formData?.department_id || positionsLoading}
                      >
                        <option value="" disabled>
                          {formData?.department_id ? 'Select position' : 'Select department first'}
                        </option>
                        {uniquePositionTitles.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>

                      {positionsLoading && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee?.position}</div>
                  )}
                </div>

                {/* Job Level */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="job_level" className="mb-0">
                    Job Level <span className="text-red-500">*</span>
                  </label>

                  {isEditing ? (
                    <select
                      id="job_level"
                      name="job_level"
                      value={formData?.job_level || ''}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                      disabled={!formData?.position}
                      aria-disabled={!formData?.position}
                    >
                      <option value="" disabled>
                        {formData?.position ? 'Select job level' : 'Select position first'}
                      </option>

                      {jobLevels.length > 0 ? (
                        jobLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No levels available for this position
                        </option>
                      )}
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee?.job_level}</div>
                  )}
                </div>

{/* Benefit Group */}
<div className="flex flex-col gap-2 md:col-span-2">
  <label htmlFor="benefit_group_id" className="mb-0">
    Claim Benefit Group <span className="text-red-500">*</span>
  </label>

  {/* View Mode - Always show the current benefit group info */}
  {!isEditing ? (
    <div className="p-3 bg-base-200 rounded min-h-[42px]">
      {currentGroupInfo ? (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{currentGroupInfo.group_name}</span>
          {currentGroupInfo.description && (
            <span className="text-sm text-gray-600">{currentGroupInfo.description}</span>
          )}
        </div>
      ) : (
        <span className="text-gray-500">Not assigned</span>
      )}
    </div>
  ) : (
    /* Edit Mode - Dropdown */
    <div className="relative">
      <select
        id="benefit_group_id"
        name="benefit_group_id"
        value={formData?.benefit_group_id || ""}
        onChange={async (e) => {
          if (!isEditing) return;

          const newGroupIdStr = e.target.value;
          const newGroupId = newGroupIdStr ? Number(newGroupIdStr) : null;
          const prevGroupIdStr = formData?.benefit_group_id || "";

          handleChange(e); // optimistic update
          setSavingGroup(true);

          try {
            // Update group assignment
            const res = await fetch(
              `${API_BASE_URL}/api/employees/${formData?.id}/benefit-group`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ group_id: newGroupId }),
              }
            );
            if (!res.ok) throw new Error("Failed to update group");
            const json = await res.json();

            // lock select to server truth
            const serverGroupIdStr = json?.group?.group_id
              ? String(json.group.group_id)
              : "";
            if (serverGroupIdStr !== (formData?.benefit_group_id || "")) {
              setFormData((prev) =>
                prev ? { ...prev, benefit_group_id: serverGroupIdStr } : prev
              );
            }

            // Always fetch full details to get items + benefit_count
            if (newGroupId) {
              const detailRes = await fetch(
                `${API_BASE_URL}/api/benefit-groups/${newGroupId}`
              );
              if (!detailRes.ok) throw new Error("Failed to fetch group details");
              const detailJson = await detailRes.json();

              setCurrentGroupInfo(detailJson);
            } else {
              setCurrentGroupInfo(null);
            }
          } catch (err) {
            console.error(err);
            setFormData((prev) =>
              prev ? { ...prev, benefit_group_id: prevGroupIdStr } : prev
            );
          } finally {
            setSavingGroup(false);
          }
        }}
        className="select select-bordered w-full"
        disabled={!isEditing || benefitGroupsLoading || savingGroup}
        aria-busy={benefitGroupsLoading || savingGroup}
        aria-disabled={!isEditing || benefitGroupsLoading || savingGroup}
        title={!isEditing ? "Switch to Edit to change" : undefined}
      >
        <option value="">
          {benefitGroupsLoading ? "Loading benefit groups…" : "Select Benefit Group"}
        </option>
        {!benefitGroupsLoading &&
          benefitGroups
            .filter(
              (group) => !group.company_id || group.company_id === formData?.company_id
            )
            .map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
                {group.company_id
                  ? ` (Company: ${
                      companies.find((c) => c.id === group.company_id)?.name ||
                      group.company_id
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
  )}

  {/* Info panel: ALWAYS visible with full details */}
  {currentGroupInfo && (
    <div className="mt-3 rounded-lg border border-gray-200 p-5 bg-white shadow-sm">
      {/* ... rest of your currentGroupInfo display code remains the same ... */}
      <>
        {/* Group Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-500">Current Group</div>
            <div className="text-lg font-semibold text-gray-900">
              {currentGroupInfo.group_name}
            </div>
            {currentGroupInfo.description && (
              <div className="text-sm text-gray-600 mt-1">
                {currentGroupInfo.description}
              </div>
            )}
            {currentGroupInfo.assigned_at ? (
              <div className="text-xs text-gray-400 mt-2">
                Assigned on{" "}
                <span className="font-medium text-gray-700">
                  {new Date(currentGroupInfo.assigned_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <span
              className={`badge ${
                currentGroupInfo.is_active ? "badge-success" : "badge-ghost"
              }`}
            >
              {currentGroupInfo.is_active ? "Active" : "Inactive"}
            </span>
            {currentGroupInfo.is_recurring && (
              <span className="badge badge-info">Recurring</span>
            )}
          </div>
        </div>

        {/* Benefit Items */}
        {currentGroupInfo.items && currentGroupInfo.items.length > 0 ? (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-700">Benefit Items</div>
              </div>
              <div className="text-xs text-gray-500">
                Total:{" "}
                <span className="font-semibold text-gray-800">
                  {currentGroupInfo.benefit_count ?? 0}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {currentGroupInfo.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.benefit_type_name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.frequency} • {item.amount}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(item.start_date).toLocaleDateString()} –{" "}
                        {new Date(item.end_date).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`badge ${
                        item.is_active ? "badge-success" : "badge-ghost"
                      }`}
                    >
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
      </>
    </div>
  )}
</div>


              </div>

              {/* Promotion / Position change notice */}
              {isEditing && promotionPending && (
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-blue-900">
                      <span className="font-medium">Pending position/level change.</span> Set an{' '}
                      <span className="font-medium">Effective Date</span> before confirming.
                      {promotionDraft?.effectiveDate && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Effective: {fmt(promotionDraft.effectiveDate)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <button
                        type="button"
                        className="btn btn-primary w-full sm:w-auto"
                        onClick={() => setShowPromotionModal(true)}
                      >
                        Review & Set Effective Date
                      </button>

                      {promotionDraft?.effectiveDate && (
                        <button
                          type="button"
                          className="btn btn-ghost w-full sm:w-auto"
                          onClick={() => setPromotionDraft(null)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal */}
              <PositionChangeConfirmModal
                open={showPromotionModal}
                onClose={() => setShowPromotionModal(false)}
                onConfirm={({ effectiveDate }) => {
                  setFormData((prev) => (prev ? { ...prev, position_effective_date: effectiveDate } : prev));
                  setShowPromotionModal(false);
                  suppressPromptRef.current = true;
                }}
                currentPosition={employee?.position}
                currentLevel={employee?.job_level}
                newPosition={formData?.position}
                newLevel={formData?.job_level}
                employeeId={Number(employeeId)}
                newPositionId={parsedNewPositionId} // numeric id
                joinedDate={employee?.joined_date}
                currentPositionStartDate={employee?.current_position_start_date}
              />

<section className="bg-base-100 rounded-lg shadow p-4 md:p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Employee Allowances</h3>

    {/* Only show actions in edit mode */}
    {isEditing && (
      <div className="flex gap-2">
        <Link
          href="/master-data/allowances"
          className="btn btn-ghost btn-sm"
          title="Open Allowance Types (master data)"
        >
          Manage Types
        </Link>
        <button type="button" className="btn btn-primary btn-sm" onClick={openAddAllowance}>
          + Assign Allowance
        </button>
      </div>
    )}
  </div>

  {allowancesLoading ? (
    <div className="py-10 text-center">
      <span className="loading loading-spinner loading-md" />
    </div>
  ) : empAllowances.length === 0 ? (
    <div className="p-4 bg-base-200 rounded text-sm text-gray-600">
      {isEditing ? (
        <>
          No allowances yet. Click <span className="font-medium">Assign Allowance</span> to add one.
        </>
      ) : (
        'No allowances.'
      )}
    </div>
  ) : (
<div className="grid auto-rows-[1fr] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">   {empAllowances.map((a) => (
        <AllowanceCard
          key={a.id}
          row={a}
          canManage={isEditing}
          onEdit={openEditAllowance}
          onDelete={openDeleteAllowance}
        />
      ))}
    </div>
  )}

  {!isEditing && (
    <p className="mt-3 text-xs text-gray-500">
      Switch to <span className="font-medium">Edit</span> to add, edit, or delete allowances.
    </p>
  )}

  {/* Delete confirmation modal */}
  {showDeleteAllowanceModal && allowanceToDelete && (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-base-100 w-full max-w-md rounded-2xl shadow-xl">
        <div className="p-6">
          <h3 className="text-xl font-semibold">Delete Allowance</h3>
          <p className="mt-4 text-sm text-gray-600">
            Are you sure you want to delete&nbsp;
            <span className="font-medium">{allowanceToDelete.allowance_name}</span>? This action
            cannot be undone.
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button className="btn btn-ghost" onClick={closeDeleteAllowanceModal}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDeleteAllowance}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</section>


            </section>
          )}

          {/* Compensation Tab */}
          {activeTab === 'compensation' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Compensation Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Salary field */}
                <div>
                  <div className="mb-2">Salary <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="salary" 
                      value={formData?.salary || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required 
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {employee.currency} {parseFloat(employee.salary).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Currency field */}
                <div>
                  <div className="mb-2">Currency</div>
                  {isEditing ? (
                    <select 
                      name="currency" 
                      value={formData?.currency || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select currency</option>
                      {currencyLoading ? (
                        <option disabled>Loading currencies...</option>
                      ) : currencyError ? (
                        <option disabled>Error loading currencies</option>
                      ) : (
                        <>
                          {/* Default currencies that should always be available */}
                          <option value="MYR">Malaysian Ringgit (MYR)</option>

                          {/* Dynamic currencies from API */}
                          {currencyRates.map(rate => (
                            <option 
                              key={`${rate.to_code}-${rate.bank_id}`} 
                              value={rate.to_code}
                            >
                              {rate.to_currency_name} ({rate.to_code}) 
                            </option>//- {rate.bank_name}
                          ))}
                        </>
                      )}
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      {employee.currency}
                      {currencyRates.find(c => c.to_code === employee.currency) && (
                        <span className="text-sm text-gray-500 ml-2">
                          {currencyRates.find(c => c.to_code === employee.currency)?.to_currency_name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Payment Method field */}
                <div>
                  <div className="mb-2">Payment Method</div>
                  {isEditing ? (
                    <select 
                      name="payment_method" 
                      value={formData?.payment_method || ''} 
                      onChange={handleChange} 
                      className="select select-bordered w-full" 
                      required
                    >
                      <option value="" disabled>Select payment method</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.payment_method}</div>
                  )}
                </div>
                
                {/* Payment Company field */}
                <div>
                  <div className="mb-2">Payment Company <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="payment_company" 
                      value={formData?.payment_company || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.payment_company}</div>
                  )}
                </div>
                
{/* Pay Interval field */}
{/* Pay Interval field */}
<div>
  <div className="mb-2">Pay Interval <span className="text-error">*</span></div>

  {isEditing ? (
    <select
      name="pay_interval"
      value={String(formData?.pay_interval ?? '')}
      onChange={handleChange}
      className="select select-bordered w-full"
      required
    >
      <option value="" disabled>Select pay interval</option>

      {/* Temporary options */}
      <option value="25">25</option>
      <option value="26">26</option>

      {/* Existing config options, skip 25/26 to avoid duplicates */}
      {(payrollConfigs || [])
        .filter(c => ![25, 26].includes(Number(c?.pay_interval)))
        .map(c => (
          <option key={c.id} value={String(c.pay_interval)}>
            {c.pay_interval}
          </option>
        ))}
    </select>
  ) : (
    <div className="p-3 bg-base-200 rounded min-h-[42px]">
      {employee?.pay_interval ?? '-'}
    </div>
  )}
</div>

              </div>
              
              <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">


                {/* Bank Name field */}
              <div>
                <div className="mb-2">Bank Name <span className="text-error">*</span></div>
                {isEditing ? (
                  loadingBanks ? (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">
                      Loading banks...
                    </div>
                  ) : bankError ? (
                    <div className="p-3 bg-base-200 rounded min-h-[42px] text-error">
                      Error loading banks
                    </div>
                  ) : (
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
                  )
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">
                    {employee.bank_name}
                  </div>
                )}
              </div>
                
                {/* Bank Account Name field */}
                <div>
                  <div className="mb-2">Bank Account Name <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="bank_account_name" 
                      value={formData?.bank_account_name || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.bank_account_name}</div>
                  )}
                </div>
                
                {/* Bank Account Number field */}
                <div>
                  <div className="mb-2">Bank Account Number <span className="text-error">*</span></div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="bank_account_no" 
                      value={formData?.bank_account_no || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full" 
                      required
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.bank_account_no}</div>
                  )}
                </div>
                
              {/* Bank Currency field */}
              <div>
                <div className="mb-2">Bank Currency <span className="text-error">*</span></div>
                {isEditing ? (
                  <select 
                    name="bank_currency" 
                    value={formData?.bank_currency || ''} 
                    onChange={handleChange} 
                    className="select select-bordered w-full" 
                    required
                  >
                    <option value="" disabled>Select currency</option>
                    
                    {/* Show loading state */}
                    {currencyLoading && <option disabled>Loading currencies...</option>}
                    
                    {/* Show error state */}
                    {currencyError && <option disabled>Error loading currencies</option>}
                    
                    {/* Always include MYR as base currency */}
                    <option value="MYR">Malaysian Ringgit (MYR)</option>
                    
                    {/* Dynamic currencies from API */}
                    {currencyRates
                      // Remove duplicates by currency code
                      .filter((rate, index, self) => 
                        index === self.findIndex(r => r.to_code === rate.to_code)
                      )
                      .map(rate => (
                        <option key={rate.to_code} value={rate.to_code}>
                          {rate.to_currency_name} ({rate.to_code})
                        </option>
                      ))
                    }
                  </select>
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">
                    {employee.bank_currency}
                    {/* Show currency name if available */}
                    {currencyRates.find(c => c.to_code === employee.bank_currency) && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({currencyRates.find(c => c.to_code === employee.bank_currency)?.to_currency_name})
                      </span>
                    )}
                  </div>
                )}
              </div>

                
                {/* Income Tax Number field */}
                <div>
                  <div className="mb-2">Income Tax Number</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="income_tax_no" 
                      value={formData?.income_tax_no || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.income_tax_no || 'Not provided'}</div>
                  )}
                </div>
                
                {/* SOCSO Account Number field */}
                <div>
                  <div className="mb-2">SOCSO Account Number</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="socso_account_no" 
                      value={formData?.socso_account_no || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.socso_account_no || 'Not provided'}</div>
                  )}
                </div>
                
                {/* EPF Account Number field */}
                <div>
                  <div className="mb-2">EPF Account Number</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="epf_account_no" 
                      value={formData?.epf_account_no || ''} 
                      onChange={handleChange} 
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <div className="p-3 bg-base-200 rounded min-h-[42px]">{employee.epf_account_no || 'Not provided'}</div>
                  )}
                </div>
              </div>



            </div>
          )}

          {/*Dependents Tab */}
          {activeTab === 'dependents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
     <h2 className="text-xl font-semibold">Dependents</h2>
    <p className="text-gray-600 mt-1">
      {employeeId
        ? 'View and manage dependents for this employee.'
        : 'Add dependents now; they will be saved when you submit the employee.'}
    </p>
  </div>

  {isEditing && (
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
  )}
</div>



{/* List */}
{dependentsLoading ? (
  <div className="flex justify-center py-10">
    <span className="loading loading-spinner loading-lg" />
  </div>
) : dependentsError ? (
  <div className="alert alert-error">
    <span>{dependentsError}</span>
  </div>
) : dependents.length === 0 ? (
  <div className="rounded-2xl bg-base-200 p-12 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p className="text-gray-500 text-lg mb-2">No dependents yet</p>
    <p className="text-gray-400 text-sm">
      {isEditing ? 'Click "Add Dependent" to get started.' : 'Dependents will appear here when available.'}
    </p>
  </div>
) : (
<div className="space-y-4">
  {dependents.map((d) => {
    const dob = d.birth_date ? new Date(d.birth_date) : null;
    const age =
      dob
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
        key={String(d.id ?? `${d.full_name}-${d.birth_date}`)}
        className="rounded-2xl border border-base-300 bg-base-100 shadow-sm"
      >
        {/* Header: name + age + actions */}
        <div className="p-5 flex items-start justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold truncate">{d.full_name}</h3>
              {age !== null && <span className="badge badge-ghost">{age} yrs</span>}
              {isEditing && d.is_temp && (
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

          {isEditing && (
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
                <Edit3 className="w-4 h-4" />
              </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm text-error"
                  title="Remove"
                  onClick={() => handleDeleteDependent(depKey(d))}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>
          )}
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

            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Employee Documents</h2>
              <p className="text-gray-600 mb-6">View and manage documents for this employee.</p>
              
              {documentsLoading ? (
                <div className="flex justify-center my-8">
                  <div className="loading loading-spinner loading-lg"></div>
                </div>
              ) : documentsError ? (
                <div className="alert alert-error mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{documentsError}</span>
                </div>
              ) : isEditing ? (
                <DocumentManager 
                  employeeId={Number(employeeId)}
                  mode="edit"
                  initialDocuments={allSelectedFiles}
                  onDocumentsUploaded={handleDocumentsUploaded}
                  onDocumentDeleted={handleDocumentsTabDocumentDeleted}
                  documentTypes={EMPLOYEE_DOCUMENT_TYPES}
                  moduleName="employee-data"
                  onFilesSelected={handleDocumentsTabFilesSelected}
                />
              ) : (
                <DocumentManager 
                  employeeId={Number(employeeId)}
                  mode="view"
                  initialDocuments={employeeDocuments.filter(doc => 
                    EMPLOYEE_DOCUMENT_TYPES.some(type => type.type === doc.documentType)
                  )}
                  documentTypes={EMPLOYEE_DOCUMENT_TYPES}
                  moduleName="employee-data"
                />
              )}
              
              {documentUploadSuccess && (
                <div className="alert alert-success mt-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Documents uploaded successfully!</span>
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
                  <p className="text-gray-600 mt-1">View and manage training records for this employee.</p>
                </div>
                {isEditing && (
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
                )}
              </div>
              
              {trainingRecordsLoading ? (
                <div className="flex justify-center my-8">
                  <div className="loading loading-spinner loading-lg"></div>
                </div>
              ) : trainingRecordsError ? (
                <div className="alert alert-error mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{trainingRecordsError}</span>
                </div>
              ) : trainingRecords.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No training records yet</p>
                  <p className="text-gray-400 text-sm">
                    {isEditing ? 'Click "Add Training Record" to get started.' : 'Training records will appear here when available.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trainingRecords.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record as any}
                      type="training"
                      isEditing={isEditing}
                      onEdit={(rec) => handleOpenTrainingModal(rec as TrainingRecord)}
                      onDelete={handleDeleteTrainingRecord}
                    />
                  ))}
                </div>
              )}

              {/* Training Modal */}
              <TrainingModal
                isOpen={showTrainingModal}
                record={editingTrainingRecord}
                onSave={handleSaveTrainingRecord}
                onCancel={handleCloseTrainingModal}
                employeeId={Number(employeeId)}
                documentTypes={EMPLOYEE_TRAINING_RECORDS_DOCUMENT}
                moduleName="employee-data"
              />
            </div>
          )}
          
          {/* Disciplinary Tab */}
          {activeTab === 'disciplinary' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Disciplinary Records</h2>
                  <p className="text-gray-600 mt-1">View and manage disciplinary records for this employee.</p>
                </div>
                {isEditing && (
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
                )}
              </div>
              
              {disciplinaryRecordsLoading ? (
                <div className="flex justify-center my-8">
                  <div className="loading loading-spinner loading-lg"></div>
                </div>
              ) : disciplinaryRecordsError ? (
                <div className="alert alert-error mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{disciplinaryRecordsError}</span>
                </div>
              ) : disciplinaryRecords.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No disciplinary records yet</p>
                  <p className="text-gray-400 text-sm">
                    {isEditing ? 'Click "Add Disciplinary Record" to get started.' : 'Disciplinary records will appear here when available.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {disciplinaryRecords.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record as any}
                      type="disciplinary"
                      isEditing={isEditing}
                      onEdit={(rec) => handleOpenDisciplinaryModal(rec as DisciplinaryRecord)}
                      onDelete={handleDeleteDisciplinaryRecord}
                    />
                  ))}
                </div>
              )}

              {/* Disciplinary Modal */}
              <RecordModal
                type="disciplinary"
                isOpen={showDisciplinaryModal}
                record={editingDisciplinaryRecord}
                onSave={(record) => handleSaveDisciplinaryRecord(record as DisciplinaryRecord)}
                onCancel={handleCloseDisciplinaryModal}
                employeeId={Number(employeeId)}
                documentTypes={EMPLOYEE_DISCIPLINARY_RECORDS_DOCUMENT}
                moduleName="employee-data"
              />
            </div>
          )}

          {activeTab === 'increments' && (
            <div className="space-y-4">
              {!employeeId ? (
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Please save the employee record first to manage salary increments.</span>
                </div>
              ) : (
                <SingleIncrementTab
                  currentBasic={Number(formData?.salary) || 0}
                  currentGrade={formData?.job_level || null}
                  currency={formData?.currency || 'MYR'}
                  employeeId={employeeId}
                  // These three are optional now; keep if you already have them:
                  isEditing={isEditing}
                />
              )}
            </div>
          )}


{/* IP Overrides Tab */}
{activeTab === 'ip-overrides' && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Left: overrides list & add form */}
    <div className="lg:col-span-2 bg-base-100 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Fixed IPs for {employee?.name}</h2>
      </div>

      <div className="rounded border p-4 mb-6">
        <div className="font-medium mb-2">Office IP Ranges</div>
        {officeRanges.length ? (
          <ul className="list-disc pl-5 text-sm">
            {officeRanges.map((r) => (
              <li key={r.id} className="flex justify-between">
                <span className="font-mono">{r.cidr}</span>
                {(() => {
                  const active = asActive(r.is_active);
                  return (
                    <span className={`badge ${active ? 'badge-success' : 'badge-ghost'}`}>
                      {active ? 'Active' : 'Inactive'}
                    </span>
                  );
                })()}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">
            No ranges for this office (or office not assigned).
          </div>
        )}
      </div>

      {/* Add form */}
      <div className="rounded border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">
              <span className="label-text">IP Address (IPv4/IPv6)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. 192.168.1.10"
              disabled={!canAddIpOverride}
              value={ipForm.ip_address}
              onChange={(e) => setIpForm({ ...ipForm, ip_address: e.target.value })}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Label (optional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Label (optional)"
              disabled={!canAddIpOverride}
              value={ipForm.label}
              onChange={(e) => setIpForm({ ...ipForm, label: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={!canAddIpOverride || ipSaving}
onClick={async () => {
  const ip = (ipForm.ip_address || '').trim();

  // 1) Basic sanity: must be valid IPv4 or IPv6
  const v4 = isIPv4(ip);
  const v6 = isIPv6(ip);
  if (!v4 && !v6) {
    showNotification('Please enter a valid IPv4 or IPv6 address.', 'error');
    return;
  }

  // 2) Enforce membership in ACTIVE Office IP Ranges
  if (!ipMatchesAnyOfficeRange(ip, officeRanges)) {
// ✅ fix
const allowed = (officeRanges ?? [])
  .filter(r => !!(r.is_active ?? true))
  .map(r => r.cidr)
  .join(', ');


    showNotification(
      allowed
        ? `IP must be inside an active Office IP Range. Allowed ranges: ${allowed}`
        : 'No active Office IP Ranges. Add one before adding fixed IPs.',
      'error'
    );
    return;
  }

  // 3) Submit
  try {
    setIpSaving(true);
    const res = await fetch(`${API_BASE_URL}/api/attendance/employee-ip-overrides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`,
      },
      body: JSON.stringify({
        employee_id: Number(employeeId),
        ip_address: ip,
        label: (ipForm.label ?? '').trim(),
      }),
    });

    if (!res.ok) throw new Error('Failed to add IP override');

    setIpForm({ ip_address: '', label: '' });
    await fetchIpOverrides();
    showNotification('IP override added', 'success');
  } catch (e) {
    console.error(e);
    showNotification('Unable to add IP override', 'error');
  } finally {
    setIpSaving(false);
  }
}}

            >
              {ipSaving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving…
                </>
              ) : 'Add'}
            </button>
          </div>
        </div>

        {!hasOffice && (
          <p className="mt-1 text-sm text-red-600">
            Employee isn’t assigned to an office. Assign an office to add fixed IPs.
          </p>
        )}
        {hasOffice && !hasActiveRanges && (
          <p className="mt-1 text-sm text-red-600">
            No IP ranges for this office. Add at least one Office IP Range first.
          </p>
        )}
      </div>

      {/* List */}
      {ipOverrides.length === 0 ? (
        <div className="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-info shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>No IP overrides yet.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>IP Address</th>
                <th>Label</th>
                <th>Added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ipOverrides.map((o, idx) => (
                <tr key={o.id}>
                  <td>{idx + 1}</td>
                  <td className="font-mono">{o.ip_address}</td>
                  <td>{o.label || '-'}</td>
                  <td>{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={async () => {
                        if (confirm(`Remove IP override ${o.ip_address}?`)) {
                          try {
                            const res = await fetch(
                              `${API_BASE_URL}/api/attendance/employee-ip-overrides/${o.id}`,
                              {
                                method: 'DELETE',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
                                }
                              }
                            );
                            if (res.ok) {
                              await fetchIpOverrides();
                              showNotification('IP override removed', 'success');
                            }
                          } catch {
                            showNotification('Failed to remove override', 'error');
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Right: global policy panel */}
    <div className="bg-base-100 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Attendance IP Policy</h3>
      </div>

      {policy ? (
        <>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Mode</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={policy.mode}
              onChange={(e) => setPolicy(p => ({ ...p, mode: toPolicyMode(e.target.value) }))}
              disabled={user?.role !== 'admin'}
            >
              <option value="FLAG_ONLY">FLAG_ONLY (allow, but flag)</option>
              <option value="ENFORCE">ENFORCE (block outside whitelist)</option>
            </select>
          </div>

          {user?.role === 'admin' ? (
            <>
              <button
                className="btn btn-primary"
                disabled={!canSavePolicy || policySaving}
                onClick={async () => {
                  if (!canSavePolicy) {
                    showNotification('Add at least one Office IP Range before saving policy.', 'error');
                    return;
                  }
                  setPolicySaving(true);
                  try {
                      const body = {
                        scope: 'EMPLOYEE',
                        employee_id: Number(employeeId),
                        mode: toPolicyMode(policy.mode),
                        trust_proxy: !!policy.trust_proxy,
                      };

                      const res = await fetch(`${API_BASE_URL}/api/attendance/policy`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`,
                        },
                        body: JSON.stringify({
                          scope: 'EMPLOYEE',
                          employee_id: Number(employeeId),
                          mode: policy.mode,          // or toPolicyMode(policy.mode)
                          trust_proxy: policy.trust_proxy,
                        }),
                      });


                    const payload = await res.json().catch(() => ({} as any));
                    if (!res.ok || payload?.ok === false) {
                      showNotification(payload?.error || `HTTP ${res.status}`, 'error');
                      return;
                    }

                    const saved = payload?.data ?? {};
                    setPolicy(p => ({
                      ...p,
                      mode: toPolicyMode(saved?.mode ?? body.mode),
                      trust_proxy:
                        typeof saved?.trust_proxy === 'number'
                          ? saved.trust_proxy === 1
                          : !!(saved?.trust_proxy ?? body.trust_proxy),
                    }));

                    showNotification('Policy updated', 'success');
                  } catch (e) {
                    console.error(e);
                    showNotification('Failed to update policy', 'error');
                  } finally {
                    setPolicySaving(false);
                  }
                }}
              >
                Save Policy
              </button>

              {!canSavePolicy && (
                <p className="mt-1 text-sm text-red-600">
                  Attendance IP Policy is disabled until an Office IP Range exists.
                </p>
              )}
            </>
          ) : (
            <div className="alert alert-info">
              <span>Read-only: admin only</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center p-6">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  </div>
)}


          
          {/* Save/Cancel buttons for edit mode */}
          {isEditing && (
            <div className="flex justify-end gap-4 mt-8">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={toggleEditMode}
                disabled={saveLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </form>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setShowDeleteModal(false)}></div>
          <dialog open className="modal modal-open z-50">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deactivation</h3>
              <p className="py-4">
                Are you sure you want to deactivate <span className="font-semibold">{employee?.name}</span>? 
                Their status will be changed to inactive.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                This action does not delete the employee data from the system.
              </p>
              <div className="modal-action">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-error" 
                  onClick={confirmSoftDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Deactivating...
                    </>
                  ) : (
                    'Deactivate'
                  )}
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}

      {showResetConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Reset</h3>
            <p className="py-4">Are you sure you want to reset the employee's password? A new temporary password will be generated and shown.</p>
            <div className="modal-action">
              <button className="btn btn-outline" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button
                type="button" 
                className="btn btn-primary"
                onClick={async () => {
                  setResetting(true);
                  setShowResetConfirm(false);
                  try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/employees/${employeeId}/reset-password`, {
                      method: 'POST'
                    });
                    const data = await res.json();
                    setTempPassword(data.tempPassword);
                    setShowTempPasswordModal(true);
                  } catch (error) {
                    console.error('Failed to reset password');
                  } finally {
                    setResetting(false);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showTempPasswordModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-lg p-0 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white p-3 shadow-sm border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" 
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2l-2 2m-7.5 7.5L7 16l1 1-4 4-1-1 4-4-1-1 4.5-4.5M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Temporary Password Created</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Share this temporary password with the employee. They'll be required to change it after first login.
                  </p>
                  {employee?.name && (
                    <div className="mt-3 text-sm text-gray-700 bg-white/50 p-2 rounded-lg">
                      For: <span className="font-medium">{employee.name}</span>
                      {employee?.email && (
                        <>
                          {' '}· <span className="text-gray-500">Email:</span>{' '}
                          <span className="font-medium">{employee.email}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Password panel */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Temporary Password</label>

                <div className="flex items-stretch rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={tempPassword}
                    readOnly
                    className="flex-grow px-4 py-3 font-mono text-lg tracking-widest border-0 focus:ring-0"
                  />
                  <div className="flex">
                    {/* Copy button */}
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
                    {/* Show/Hide button */}
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

              {/* Email delivery section - simplified and standardized */}
              {employee?.email ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 flex-shrink-0"
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
                      Send to: <span className="font-medium text-indigo-700">{employee.email}</span>
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                      disabled={emailSending}
                      onClick={handleSendTempPasswordEmail}
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
                            <path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" />
                          </svg>
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-6">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v4m0 4h.01" />
                      <path d="M10.29 3.86l-8.18 14.14A2 2 0 003.82 21h16.36a2 2 0 001.71-2.99L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-amber-800">Email unavailable</div>
                      <div className="text-sm text-amber-700 mt-1">No email address is on file for this employee.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="modal-action bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-0 text-white min-w-24"
                onClick={handleClose}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Confirmation Modal */}
      {showReactivateModal && (
        <>
          <div className="fixed inset-0 bg-opacity-50 z-40" onClick={() => setShowReactivateModal(false)}></div>
          <dialog open className="modal modal-open z-50">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Reactivation</h3>
              <p className="py-4">
                Are you sure you want to reactivate <span className="font-semibold">{employee?.name}</span>? 
                Their status will be changed to active.
              </p>
              <div className="modal-action">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowReactivateModal(false)}
                  disabled={reactivateLoading}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={confirmReactivate}
                  disabled={reactivateLoading}
                >
                  {reactivateLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Reactivating...
                    </>
                  ) : (
                    'Reactivate'
                  )}
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
      
      {/* Transfer Modal */}
      {showTransferModal && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Transfer Employee</h3>
            <form onSubmit={handleTransferSubmit}>
              <div className="space-y-4">
                <div>
                  <div className="mb-2">Company</div>
                  <select 
                    name="company_id" 
                    value={transferFormData.company_id} 
                    onChange={handleTransferChange} 
                    className="select select-bordered w-full" 
                    required
                  >
                    <option value="" disabled>Select company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="mb-2">Department</div>
                  <select 
                    name="department_id" 
                    value={transferFormData.department_id} 
                    onChange={handleTransferChange} 
                    className="select select-bordered w-full" 
                    required
                    disabled={!transferFormData.company_id}
                  >
                    <option value="" disabled>Select department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="mb-2">Position</div>
                  <select 
                    name="position" 
                    value={transferFormData.position} 
                    onChange={handleTransferChange} 
                    className="select select-bordered w-full" 
                    required
                    disabled={!transferFormData.department_id}
                  >
                    <option value="" disabled>Select position</option>
                    {uniquePositionTitles.map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-2">Job Level</div>
                  <select 
                    name="job_level" 
                    value={transferFormData.job_level} 
                    onChange={handleTransferChange} 
                    className="select select-bordered w-full" 
                    required
                    disabled={!transferFormData.position}
                  >
                    <option value="" disabled>Select Job Level</option>
                    {jobLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setShowTransferModal(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={transferLoading || !transferFormData.company_id || !transferFormData.department_id || !transferFormData.position || !transferFormData.job_level}
                >
                  {transferLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Transferring...
                    </>
                  ) : (
                    'Transfer'
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowTransferModal(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Past Positions Modal */}
      {showPastPositionsModal && (
        <dialog open className="modal">
          <div className="modal-box w-3/4 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Employment History</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setShowPastPositionsModal(false)}
              >
                ✕
              </button>
            </div>

            {pastPositionsLoading ? (
              <div className="flex justify-center items-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
      <div className="overflow-x-auto">
        {pastPositions.length === 0 ? (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No past positions found for this employee.</p>
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Company</th>
                <th>Department</th>
                <th>Position</th>
                <th>Job Level</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
      <tbody>
        {pastPositions
          .slice()
          .sort((a: any, b: any) => {
            const as = toDateSafe(a.start_date)?.getTime() ?? 0;
            const bs = toDateSafe(b.start_date)?.getTime() ?? 0;
            return as - bs;
          })
          .map((position: any, idx: number) => {
            const startDate = toDateSafe(position.start_date);
            const endDate = toDateSafe(position.end_date);

            const isCurrent = Number(position.is_current) === 1;
            const isUpcoming = !isCurrent && isAfterToday(startDate);
            const isPast = !isCurrent && !isUpcoming && !!endDate && isBeforeOrOnToday(endDate);

            return (
              <tr
                key={position.id ?? idx}
                className={isCurrent ? 'bg-green-50' : 'hover:bg-base-100'}
              >
                <td className="font-medium">{position.company_name}</td>
                <td>{position.department_name}</td>
                <td>{position.position_title}</td>
                <td>
                  <span className="badge badge-outline">{position.job_level}</span>
                </td>
                <td>{fmtDateSafe(startDate)}</td>
                <td>{isCurrent ? 'Present' : fmtDateSafe(endDate)}</td>
                <td>
                  {isCurrent ? (
                    <span className="badge badge-success">Current</span>
                  ) : isUpcoming ? (
                    <span className="badge">Upcoming</span>
                  ) : isPast ? (
                    <span className="badge badge-ghost">Past</span>
                  ) : (
                    <span className="badge badge-ghost">—</span>
                  )}
                </td>
              </tr>
            );
          })}
      </tbody>

          </table>
        )}
      </div>

            )}

            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setShowPastPositionsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowPastPositionsModal(false)}>close</button>
          </form>
        </dialog>
      )}

      {/* Resign Confirmation Modal */}
      {showResignModal && (
  <dialog open className="modal modal-bottom sm:modal-middle">
    <div className="modal-box">
      <h3 className="font-bold text-lg">Confirm Resignation</h3>
      <div className="space-y-4 py-4">
        <p>
          Are you sure you want to mark <span className="font-semibold">{employee?.name}</span> as resigned?
        </p>
        
        <div>
          <label className="label">
            <span className="label-text">Resignation Date <span className="text-error">*</span></span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={resignDate}
            onChange={(e) => setResignDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="label">
            <span className="label-text">Resignation Reason <span className="text-error">*</span></span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Please provide the reason for resignation"
            value={resignReason}
            onChange={(e) => setResignReason(e.target.value)}
            rows={3}
            required
          />
        </div>
      </div>
      
      <div className="modal-action">
        <button 
          className="btn btn-outline" 
          onClick={() => {
            setShowResignModal(false);
            setResignDate('');
            setResignReason('');
          }}
          disabled={resignLoading}
        >
          Cancel
        </button>
        <button 
          className="btn btn-warning" 
          onClick={handleConfirmResign}
          disabled={resignLoading || !resignDate || !resignReason}
        >
          {resignLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing...
            </>
          ) : (
            'Confirm Resignation'
          )}
        </button>
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button onClick={() => {
        setShowResignModal(false);
        setResignDate('');
        setResignReason('');
      }}>close</button>
    </form>
  </dialog>
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
                      className="input input-bordered w-full"
                      placeholder="Enter full name"
                      value={dependentForm.full_name}
                      onChange={handleDependentChange}
                      required
                      autoFocus
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <div className="mb-2">
                      Relationship <span className="text-error">*</span>
                    </div>
                    <select
                      name="relationship"
                      className="select select-bordered w-full"
                      value={dependentForm.relationship}
                      onChange={handleDependentChange}
                      required
                    >
                      <option value="" disabled>
                        Select relationship
                      </option>
                      <option value="Child">Child</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div>
                    <div className="mb-2">
                      Date of Birth <span className="text-error">*</span>
                    </div>
                    <input
                      type="date"
                      name="birth_date"
                      className="input input-bordered w-full"
                      value={dependentForm.birth_date}
                      onChange={handleDependentChange}
                      required
                    />
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
                onClick={() => {
                  handleSaveDependent(dependentForm);
                  setShowDependentModal(false);
                }}
              >
                {editingDependent ? 'Update Dependent' : 'Add Dependent'}
              </button>
            </div>
          </div>
        </div>
      )}

            
      {showAllowanceModal && (() => {
        const rawInterval =
          (employee?.pay_interval || payrollConfigs?.[0]?.pay_interval || '') as string;
        const cycleLabel = rawInterval
          ? `every ${rawInterval.toLowerCase().replace(/_/g, ' ')}`
          : 'every pay cycle';

        return (
          <div className="fixed inset-0 z-50 bg-black/40">
            {/* Centering wrapper with responsive padding */}
            <div className="min-h-screen w-full flex items-start md:items-center justify-center p-3 sm:p-4 md:p-6">
              {/* Modal panel */}
              <div
                role="dialog"
                aria-modal="true"
                className="
                  bg-base-100 text-base-content w-full
                  max-w-[min(1000px,calc(100vw-1.5rem))]
                  sm:max-w-[min(1024px,calc(100vw-2rem))]
                  md:max-w-3xl lg:max-w-4xl
                  rounded-none md:rounded-xl shadow-xl ring-1 ring-base-200
                  flex flex-col
                  max-h-[85vh]
                "
              >
                {/* Header (sticky) */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-base-100 sticky top-0 z-10">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-bold">
                      {editingAllowance ? 'Edit Employee Allowance' : 'Assign Employee Allowance'}
                    </h3>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setShowAllowanceModal(false);
                        setEditingAllowance(null);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Body (scrollable) */}
                <div className="px-4 sm:px-6 py-4 overflow-y-auto overscroll-contain flex-1">
                  {/* Choose existing type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Allowance Type *</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={allowanceForm.allowance_id || ''}
                        onChange={(e) =>
                          setAllowanceForm((prev) => ({
                            ...prev,
                            allowance_id: e.target.value ? Number(e.target.value) : '',
                          }))
                        }
                        disabled={showQuickCreate}
                      >
                        <option value="">-- Select Allowance --</option>
                        {allowanceMasters.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                            {m.max_limit != null ? ` (Max RM ${Number(m.max_limit).toFixed(2)})` : ''}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => setShowQuickCreate((s) => !s)}
                        >
                          {showQuickCreate ? 'Use existing type' : 'Quick create a new type'}
                        </button>
                        <Link href="/master-data/allowances" className="btn btn-link btn-xs">
                          Open Allowance Types
                        </Link>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Amount (RM) *</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="input input-bordered w-full"
                        value={allowanceForm.amount}
                        onChange={(e) => setAllowanceForm((p) => ({ ...p, amount: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>

                    {/* Recurring */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Apply every pay cycle?</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={allowanceForm.is_recurring ? '1' : '0'}
                        onChange={(e) =>
                          setAllowanceForm((p) => ({
                            ...p,
                            is_recurring: e.target.value === '1',
                            end_date: e.target.value === '1' ? p.end_date : '',
                          }))
                        }
                      >
                        <option value="1">{`Yes — ${cycleLabel}`}</option>
                        <option value="0">No — one-time</option>
                      </select>
                    </div>

                    {/* Effective Date */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Effective Date</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={allowanceForm.effective_date}
                        onChange={(e) => setAllowanceForm((p) => ({ ...p, effective_date: e.target.value }))}
                      />
                    </div>

                    {/* End Date (only when recurring) */}
                    {allowanceForm.is_recurring && (
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">End Date (optional)</span>
                        </label>
                        <input
                          type="date"
                          className="input input-bordered w-full"
                          value={allowanceForm.end_date}
                          onChange={(e) => setAllowanceForm((p) => ({ ...p, end_date: e.target.value }))}
                        />
                        <small className="text-xs text-gray-500 block mt-1">
                          Leave blank for ongoing (permanent) allowance.
                        </small>
                      </div>
                    )}
                  </div>

                  {/* Quick-create a new type (kept inside scroll area) */}
                  {showQuickCreate && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-semibold mb-3">Quick Create Allowance Type</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">Name *</span>
                          </label>
                          <input
                            className="input input-bordered w-full"
                            value={quickCreate.name}
                            onChange={(e) =>
                              setQuickCreate((p) => ({ ...p, name: e.target.value }))
                            }
                          />
                        </div>

                        {/* Max Limit */}
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">Max Limit (RM)</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            className="input input-bordered w-full"
                            value={quickCreate.max_limit}
                            onChange={(e) =>
                              setQuickCreate((p) => ({ ...p, max_limit: e.target.value }))
                            }
                            placeholder="Leave blank for no limit"
                          />
                        </div>

                        {/* Group 1: Tax & Proration */}
                        <div className="col-span-1 md:col-span-2">
                          <div className="bg-base-200 rounded-lg p-4 border">
                            <h5 className="font-semibold mb-3">Tax & Proration</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  className="toggle toggle-primary"
                                  checked={!!quickCreate.is_taxable}
                                  onChange={(e) =>
                                    setQuickCreate((p) => ({
                                      ...p,
                                      is_taxable: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="label-text">Taxable</span>
                              </label>

                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  className="toggle toggle-success"
                                  checked={!!quickCreate.is_bonus}
                                  onChange={(e) =>
                                    setQuickCreate((p) => ({
                                      ...p,
                                      is_bonus: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="label-text">Bonus</span>
                              </label>

                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  className="toggle toggle-info"
                                  checked={!!quickCreate.prorate_by_percentage}
                                  onChange={(e) =>
                                    setQuickCreate((p) => ({
                                      ...p,
                                      prorate_by_percentage: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="label-text">Prorate by %</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Group 2: Statutory Eligibility */}
                        <div className="col-span-1 md:col-span-2">
                          <div className="bg-base-200 rounded-lg p-4 border">
                            <h5 className="font-semibold mb-3">Statutory Eligibility</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-secondary"
                                  checked={!!quickCreate.is_socso_eligible}
                                  onChange={(e) =>
                                    setQuickCreate((p) => ({
                                      ...p,
                                      is_socso_eligible: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="label-text">SOCSO Eligible</span>
                              </label>

                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-accent"
                                  checked={!!quickCreate.is_eis_eligible}
                                  onChange={(e) =>
                                    setQuickCreate((p) => ({
                                      ...p,
                                      is_eis_eligible: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="label-text">EIS Eligible</span>
                              </label>

                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-primary"
                                  checked={!!quickCreate.is_epf_eligible}
                                  onChange={(e) =>
                                    setQuickCreate((p) => ({
                                      ...p,
                                      is_epf_eligible: e.target.checked,
                                    }))
                                  }
                                />
                                <span className="label-text">EPF Eligible</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          className="btn btn-outline"
                          onClick={quickCreateType}
                          disabled={creatingType}
                        >
                          {creatingType ? 'Creating…' : 'Create Type'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer (sticky) */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-base-100 sticky bottom-0 z-10">
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn"
                      onClick={() => {
                        setShowAllowanceModal(false);
                        setEditingAllowance(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveAllowance}>
                      {editingAllowance ? 'Update' : 'Assign'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}


      {/* Delete Allowance – pretty confirmation modal */}
      {showDeleteAllowanceModal && allowanceToDelete && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg">Delete Allowance</h3>

            <div className="py-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-medium">{allowanceToDelete.allowance_name}</span>?
                This action can’t be undone.
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={closeDeleteAllowanceModal}
                disabled={deletingAllowance}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={confirmDeleteAllowance}
                disabled={deletingAllowance}
              >
                {deletingAllowance && (
                  <span className="loading loading-spinner loading-xs mr-2" />
                )}
                Delete
              </button>
            </div>
          </div>

          {/* Click backdrop to close */}
          <form method="dialog" className="modal-backdrop" onClick={closeDeleteAllowanceModal}>
            <button>close</button>
          </form>
        </div>
      )}



      <BondingErrorModal />

      {/* Training Confirmation Modal */}
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
    </div>
  );
} 