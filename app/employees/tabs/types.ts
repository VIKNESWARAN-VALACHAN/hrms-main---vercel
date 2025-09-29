
export interface EmployeeDocument {
  id?: number;
  name: string;
  url?: string;
  key?: string;
  file?: File;
  uploadDate?: string;
  documentType: string;
}

export interface Dependent {
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

export interface TrainingRecord {
  id?: string;
  training_course: string;
  venue: string;
  start_datetime: string;
  end_datetime: string;
  status: 'pending' | 'completed' | 'cancelled';
  attachments?: EmployeeDocument[];
  has_bond: boolean;
  bond_period_days?: number;
  bond_start_date?: string;
  bond_end_date?: string;
  bond_status?: 'active' | 'fulfilled' | 'breached';
  bond_agreement_document?: EmployeeDocument[] | null;
}

export interface DisciplinaryRecord {
  id?: string;
  issue_date: string;
  type_of_letter: string;
  reason: string;
  attachments?: EmployeeDocument[];
}

export type IncrementType = 'Percent' | 'Fixed';

export interface IncrementItem {
  id?: number;           // DB id if existing
  tempId?: string;       // client temp id for new rows
  type: IncrementType;   // 'Percent' | 'Fixed'
  value: number;         // % (e.g., 5) or amount (e.g., 300)
  effective_date: string; // 'YYYY-MM-DD'
  remarks?: string;
  created_at?: string;   // for history display
  created_by_name?: string;
}

export interface Department {
  id: string;
  department_name: string;
  company_id: string;
  is_active: number | boolean;
}

export interface Position {
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

export interface Company {
  id: string;
  name?: string;
  company_name?: string;
  is_active: number | boolean;
}

export interface JobLevel {
  job_level: string;
}

export interface EmployeeData {
  name: string;
  email: string;
  password?: string;
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
  // Add fields for promotion flow
  promotion_effective_date?: string;
}


