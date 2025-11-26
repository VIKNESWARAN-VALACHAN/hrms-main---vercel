'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import { useTheme } from '../../components/ThemeProvider';


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

interface Department {
  id: string;
  department_name: string;
  is_active?: number | boolean;
  description?: string | null;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  employee_no?: string;
  joined_date?: string;
  status?: string;
  is_active?: number | boolean;
  gender?: string;
}

interface NotificationState {
  show: boolean;
  type: 'info' | 'success' | 'error';
  message: string;
}

// Leave Type interface
interface LeaveType {
  id: string;
  leave_type_name: string;
  max_days: number;
  code: string;
  requires_approval: boolean;
  requires_documentation: boolean;
  description?: string;
  is_active: number | boolean;
  company_id: string;
}

// New department form interface
interface DepartmentForm {
  department_name: string;
  status: 'active' | 'inactive';
}

interface Office {
  office_id: number;
  company_id: number;
  name: string;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postcode?: string | null;
  lat?: number | null;
  lng?: number | null;
  timezone?: string | null;
  is_active: number | boolean;
  created_at?: string;
}

interface OfficeForm extends Partial<Office> {
  name: string;
  company_id: number;
  is_active?: number | boolean;
}

interface OfficeIpRange {
  id: number;
  office_id: number;
  cidr: string;                 // IPv4 or IPv6 in CIDR
  description?: string | null;
  is_active: number | boolean;
  created_at?: string;
}
const TIMEZONES: { label: string; value: string }[] = [
  // ========== ASIA ==========
  // Southeast Asia
  { label: 'Asia/Kuala_Lumpur (MYT, +08:00)', value: 'Asia/Kuala_Lumpur' },
  { label: 'Asia/Singapore (SGT, +08:00)', value: 'Asia/Singapore' },
  { label: 'Asia/Jakarta (WIB, +07:00)', value: 'Asia/Jakarta' },
  { label: 'Asia/Makassar (WITA, +08:00)', value: 'Asia/Makassar' },
  { label: 'Asia/Jayapura (WIT, +09:00)', value: 'Asia/Jayapura' },
  { label: 'Asia/Bangkok (ICT, +07:00)', value: 'Asia/Bangkok' },
  { label: 'Asia/Manila (PST, +08:00)', value: 'Asia/Manila' },
  { label: 'Asia/Ho_Chi_Minh (ICT, +07:00)', value: 'Asia/Ho_Chi_Minh' },
  { label: 'Asia/Brunei (BNT, +08:00)', value: 'Asia/Brunei' },
  { label: 'Asia/Yangon (MMT, +06:30)', value: 'Asia/Yangon' },
  { label: 'Asia/Phnom_Penh (ICT, +07:00)', value: 'Asia/Phnom_Penh' },
  { label: 'Asia/Vientiane (ICT, +07:00)', value: 'Asia/Vientiane' },
  { label: 'Asia/Dili (TLT, +09:00)', value: 'Asia/Dili' },

  // East Asia
  { label: 'Asia/Shanghai (CST, +08:00)', value: 'Asia/Shanghai' },
  { label: 'Asia/Beijing (CST, +08:00)', value: 'Asia/Beijing' },
  { label: 'Asia/Hong_Kong (HKT, +08:00)', value: 'Asia/Hong_Kong' },
  { label: 'Asia/Macau (CST, +08:00)', value: 'Asia/Macau' },
  { label: 'Asia/Taipei (CST, +08:00)', value: 'Asia/Taipei' },
  { label: 'Asia/Tokyo (JST, +09:00)', value: 'Asia/Tokyo' },
  { label: 'Asia/Seoul (KST, +09:00)', value: 'Asia/Seoul' },
  { label: 'Asia/Pyongyang (KST, +09:00)', value: 'Asia/Pyongyang' },
  { label: 'Asia/Ulaanbaatar (ULAT, +08:00)', value: 'Asia/Ulaanbaatar' },

  // South Asia
  { label: 'Asia/Kolkata (IST, +05:30)', value: 'Asia/Kolkata' },
  { label: 'Asia/Colombo (IST, +05:30)', value: 'Asia/Colombo' },
  { label: 'Asia/Kathmandu (NPT, +05:45)', value: 'Asia/Kathmandu' },
  { label: 'Asia/Dhaka (BDT, +06:00)', value: 'Asia/Dhaka' },
  { label: 'Asia/Thimphu (BTT, +06:00)', value: 'Asia/Thimphu' },
  { label: 'Asia/Karachi (PKT, +05:00)', value: 'Asia/Karachi' },
  { label: 'Asia/Kabul (AFT, +04:30)', value: 'Asia/Kabul' },

  // Central Asia & Middle East
  { label: 'Asia/Dubai (GST, +04:00)', value: 'Asia/Dubai' },
  { label: 'Asia/Muscat (GST, +04:00)', value: 'Asia/Muscat' },
  { label: 'Asia/Qatar (AST, +03:00)', value: 'Asia/Qatar' },
  { label: 'Asia/Riyadh (AST, +03:00)', value: 'Asia/Riyadh' },
  { label: 'Asia/Baghdad (AST, +03:00)', value: 'Asia/Baghdad' },
  { label: 'Asia/Kuwait (AST, +03:00)', value: 'Asia/Kuwait' },
  { label: 'Asia/Bahrain (AST, +03:00)', value: 'Asia/Bahrain' },
  { label: 'Asia/Tehran (IRST, +03:30)', value: 'Asia/Tehran' },
  { label: 'Asia/Baku (AZT, +04:00)', value: 'Asia/Baku' },
  { label: 'Asia/Tbilisi (GET, +04:00)', value: 'Asia/Tbilisi' },
  { label: 'Asia/Yerevan (AMT, +04:00)', value: 'Asia/Yerevan' },

  // ========== AUSTRALIA & OCEANIA ==========
  { label: 'Australia/Perth (AWST, +08:00)', value: 'Australia/Perth' },
  { label: 'Australia/Adelaide (ACST, +09:30)', value: 'Australia/Adelaide' },
  { label: 'Australia/Darwin (ACST, +09:30)', value: 'Australia/Darwin' },
  { label: 'Australia/Brisbane (AEST, +10:00)', value: 'Australia/Brisbane' },
  { label: 'Australia/Sydney (AEST/AEDT, +10:00/+11:00)', value: 'Australia/Sydney' },
  { label: 'Australia/Melbourne (AEST/AEDT, +10:00/+11:00)', value: 'Australia/Melbourne' },
  { label: 'Australia/Hobart (AEST/AEDT, +10:00/+11:00)', value: 'Australia/Hobart' },
  { label: 'Pacific/Auckland (NZST/NZDT, +12:00/+13:00)', value: 'Pacific/Auckland' },
  { label: 'Pacific/Fiji (FJT, +12:00)', value: 'Pacific/Fiji' },
  { label: 'Pacific/Guam (ChST, +10:00)', value: 'Pacific/Guam' },
  { label: 'Pacific/Port_Moresby (PGT, +10:00)', value: 'Pacific/Port_Moresby' },

  // ========== EUROPE ==========
  // Western Europe
  { label: 'Europe/London (GMT/BST, +00:00/+01:00)', value: 'Europe/London' },
  { label: 'Europe/Dublin (GMT/IST, +00:00/+01:00)', value: 'Europe/Dublin' },
  { label: 'Europe/Lisbon (WET, +00:00)', value: 'Europe/Lisbon' },
  { label: 'Europe/Madrid (CET/CEST, +01:00/+02:00)', value: 'Europe/Madrid' },
  { label: 'Europe/Paris (CET/CEST, +01:00/+02:00)', value: 'Europe/Paris' },
  { label: 'Europe/Brussels (CET/CEST, +01:00/+02:00)', value: 'Europe/Brussels' },
  { label: 'Europe/Amsterdam (CET/CEST, +01:00/+02:00)', value: 'Europe/Amsterdam' },
  { label: 'Europe/Berlin (CET/CEST, +01:00/+02:00)', value: 'Europe/Berlin' },
  { label: 'Europe/Rome (CET/CEST, +01:00/+02:00)', value: 'Europe/Rome' },
  { label: 'Europe/Vienna (CET/CEST, +01:00/+02:00)', value: 'Europe/Vienna' },
  { label: 'Europe/Zurich (CET/CEST, +01:00/+02:00)', value: 'Europe/Zurich' },

  // Northern Europe
  { label: 'Europe/Stockholm (CET/CEST, +01:00/+02:00)', value: 'Europe/Stockholm' },
  { label: 'Europe/Oslo (CET/CEST, +01:00/+02:00)', value: 'Europe/Oslo' },
  { label: 'Europe/Copenhagen (CET/CEST, +01:00/+02:00)', value: 'Europe/Copenhagen' },
  { label: 'Europe/Helsinki (EET/EEST, +02:00/+03:00)', value: 'Europe/Helsinki' },

  // Eastern Europe
  { label: 'Europe/Warsaw (CET/CEST, +01:00/+02:00)', value: 'Europe/Warsaw' },
  { label: 'Europe/Prague (CET/CEST, +01:00/+02:00)', value: 'Europe/Prague' },
  { label: 'Europe/Budapest (CET/CEST, +01:00/+02:00)', value: 'Europe/Budapest' },
  { label: 'Europe/Bucharest (EET/EEST, +02:00/+03:00)', value: 'Europe/Bucharest' },
  { label: 'Europe/Sofia (EET/EEST, +02:00/+03:00)', value: 'Europe/Sofia' },
  { label: 'Europe/Athens (EET/EEST, +02:00/+03:00)', value: 'Europe/Athens' },
  { label: 'Europe/Istanbul (TRT, +03:00)', value: 'Europe/Istanbul' },
  { label: 'Europe/Moscow (MSK, +03:00)', value: 'Europe/Moscow' },
  { label: 'Europe/Kiev (EET/EEST, +02:00/+03:00)', value: 'Europe/Kiev' },

  // ========== AFRICA ==========
  { label: 'Africa/Cairo (EET/EEST, +02:00/+03:00)', value: 'Africa/Cairo' },
  { label: 'Africa/Johannesburg (SAST, +02:00)', value: 'Africa/Johannesburg' },
  { label: 'Africa/Lagos (WAT, +01:00)', value: 'Africa/Lagos' },
  { label: 'Africa/Casablanca (WEST, +01:00)', value: 'Africa/Casablanca' },
  { label: 'Africa/Nairobi (EAT, +03:00)', value: 'Africa/Nairobi' },
  { label: 'Africa/Addis_Ababa (EAT, +03:00)', value: 'Africa/Addis_Ababa' },
  { label: 'Africa/Accra (GMT, +00:00)', value: 'Africa/Accra' },

  // ========== NORTH AMERICA ==========
  // United States
  { label: 'America/New_York (ET, -05:00/-04:00)', value: 'America/New_York' },
  { label: 'America/Chicago (CT, -06:00/-05:00)', value: 'America/Chicago' },
  { label: 'America/Denver (MT, -07:00/-06:00)', value: 'America/Denver' },
  { label: 'America/Los_Angeles (PT, -08:00/-07:00)', value: 'America/Los_Angeles' },
  { label: 'America/Phoenix (MST, -07:00)', value: 'America/Phoenix' },
  { label: 'America/Anchorage (AKST, -09:00)', value: 'America/Anchorage' },
  { label: 'America/Honolulu (HST, -10:00)', value: 'America/Honolulu' },

  // Canada
  { label: 'America/Toronto (ET, -05:00/-04:00)', value: 'America/Toronto' },
  { label: 'America/Vancouver (PT, -08:00/-07:00)', value: 'America/Vancouver' },
  { label: 'America/Edmonton (MT, -07:00/-06:00)', value: 'America/Edmonton' },
  { label: 'America/Winnipeg (CT, -06:00/-05:00)', value: 'America/Winnipeg' },
  { label: 'America/Halifax (AT, -04:00/-03:00)', value: 'America/Halifax' },

  // Mexico & Central America
  { label: 'America/Mexico_City (CST, -06:00)', value: 'America/Mexico_City' },
  { label: 'America/Cancun (EST, -05:00)', value: 'America/Cancun' },
  { label: 'America/Guatemala (CST, -06:00)', value: 'America/Guatemala' },
  { label: 'America/Costa_Rica (CST, -06:00)', value: 'America/Costa_Rica' },
  { label: 'America/Panama (EST, -05:00)', value: 'America/Panama' },

  // Caribbean
  { label: 'America/Havana (CST/CDT, -05:00/-04:00)', value: 'America/Havana' },
  { label: 'America/Jamaica (EST, -05:00)', value: 'America/Jamaica' },
  { label: 'America/Puerto_Rico (AST, -04:00)', value: 'America/Puerto_Rico' },
  { label: 'America/Port-au-Prince (EST, -05:00)', value: 'America/Port-au-Prince' },

  // ========== SOUTH AMERICA ==========
  { label: 'America/Sao_Paulo (BRT, -03:00)', value: 'America/Sao_Paulo' },
  { label: 'America/Buenos_Aires (ART, -03:00)', value: 'America/Buenos_Aires' },
  { label: 'America/Lima (PET, -05:00)', value: 'America/Lima' },
  { label: 'America/Bogota (COT, -05:00)', value: 'America/Bogota' },
  { label: 'America/Caracas (VET, -04:00)', value: 'America/Caracas' },
  { label: 'America/Santiago (CLT, -04:00)', value: 'America/Santiago' },

  // ========== PACIFIC & OTHERS ==========
  { label: 'Pacific/Honolulu (HST, -10:00)', value: 'Pacific/Honolulu' },
  { label: 'Pacific/Tahiti (TAHT, -10:00)', value: 'Pacific/Tahiti' },
  { label: 'Pacific/Majuro (MHT, +12:00)', value: 'Pacific/Majuro' },

  // ========== STANDARD & UTC ==========
  { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
  { label: 'GMT (Greenwich Mean Time)', value: 'GMT' },
  { label: 'Etc/UTC (UTC)', value: 'Etc/UTC' },
  { label: 'Etc/GMT (GMT)', value: 'Etc/GMT' },
];

export default function CompanyDetails() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  
  // Company data state
  const [company, setCompany] = useState<Company | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Employees state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Fixed page size
  const [totalEmployees, setTotalEmployees] = useState(0);
  
  // UI state
  const [activeTab, setActiveTab] = useState('company');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Subsidiaries state
  const [subsidiaries, setSubsidiaries] = useState<Company[]>([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(false);
  
  // Leave types state
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveTypesLoading, setLeaveTypesLoading] = useState(false);
  const [leaveTypeValues, setLeaveTypeValues] = useState<Record<string, number>>({});
  
  // Modal reference
  const subsidiariesModalRef = useRef<HTMLDialogElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  
  const [isDepartmentEditing, setIsDepartmentEditing] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState<string | null>(null);
  
  // Form data state (for editing)
  const [formData, setFormData] = useState<Company | null>(null);
  
  // Department modal state
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [departmentForm, setDepartmentForm] = useState<DepartmentForm>({
    department_name: '',
    status: 'active'
  });
  


  // Offices state
const [offices, setOffices] = useState<Office[]>([]);
const [officesLoading, setOfficesLoading] = useState(false);

// Office form & modal
const [showOfficeModal, setShowOfficeModal] = useState(false);
const [editingOfficeId, setEditingOfficeId] = useState<number | null>(null);
const [officeForm, setOfficeForm] = useState<OfficeForm>({
  name: '',
  company_id: Number(params.id),
  is_active: 1,
});

// IP whitelist modal state
const [showIpModal, setShowIpModal] = useState(false);
const [ipOfficeId, setIpOfficeId] = useState<number | null>(null);
const [ipRanges, setIpRanges] = useState<OfficeIpRange[]>([]);
const [ipLoading, setIpLoading] = useState(false);
const [ipForm, setIpForm] = useState<{ cidr: string; description?: string; is_active: boolean }>({
  cidr: '',
  description: '',
  is_active: true,
});


  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'info',
    message: ''
  });


  const fetchOffices = async () => {
  if (!company) return;
  try {
    setOfficesLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/attendance/offices?company_id=${company.id}`);
    if (!res.ok) throw new Error('Failed to load offices');
    const data = await res.json();
    setOffices(Array.isArray(data?.data) ? data.data : data); // support both shapes
  } catch (e) {
    showNotification('error', e instanceof Error ? e.message : 'Failed to load offices');
    setOffices([]);
  } finally {
    setOfficesLoading(false);
  }
};

const openCreateOffice = () => {
  setEditingOfficeId(null);
  setOfficeForm({
    name: '',
    company_id: Number(params.id),
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    lat: undefined,
    lng: undefined,
    timezone: 'Asia/Kuala_Lumpur',
    is_active: 1,
  });
  setShowOfficeModal(true);
};

const openEditOffice = (o: Office) => {
  setEditingOfficeId(o.office_id );
  setOfficeForm({
    company_id: o.company_id,
    name: o.name,
    address_line1: o.address_line1 || '',
    address_line2: o.address_line2 || '',
    city: o.city || '',
    state: o.state || '',
    country: o.country || '',
    postcode: o.postcode || '',
    lat: o.lat ?? undefined,
    lng: o.lng ?? undefined,
    timezone: o.timezone || 'Asia/Kuala_Lumpur',
    is_active: !!o.is_active,
  });
  setShowOfficeModal(true);
};

const saveOffice = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    const payload = { ...officeForm, is_active: officeForm.is_active ? 1 : 0 };
    // const url = editingOfficeId
    //   ? `${API_BASE_URL}/api/attendance/offices/${editingOfficeId}`
    //   : `${API_BASE_URL}/api/attendance/offices`;
    // const method = editingOfficeId ? 'PUT' : 'POST';
    const isEditingOffice = editingOfficeId !== null && editingOfficeId !== undefined;
    const url = isEditingOffice
      ? `${API_BASE_URL}/api/attendance/offices/${editingOfficeId}`
        : `${API_BASE_URL}/api/attendance/offices`;
    const method = isEditingOffice ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save office');
    }

    showNotification('success', editingOfficeId ? 'Office updated' : 'Office created');
    setShowOfficeModal(false);
    await fetchOffices();
  } catch (e) {
    showNotification('error', e instanceof Error ? e.message : 'Failed to save office');
  } finally {
    setLoading(false);
  }
};


const deleteOffice = async (id: number) => {
  try {
    setLoading(true);
    
    // First, delete all IP whitelist entries for this office
    const ipResponse = await fetch(`${API_BASE_URL}/api/attendance/office-ip-whitelists?office_id=${id}`);
    if (ipResponse.ok) {
      const ipData = await ipResponse.json();
      const ipRanges = Array.isArray(ipData?.data) ? ipData.data : ipData;
      
      // Delete each IP range
      for (const ipRange of ipRanges) {
        await fetch(`${API_BASE_URL}/api/attendance/office-ip-whitelists/${ipRange.id}`, { 
          method: 'DELETE' 
        });
      }
    }
    
    // Then delete the office
    const res = await fetch(`${API_BASE_URL}/api/attendance/offices/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete office');
    }
    showNotification('success', 'Office deleted');
    await fetchOffices();
  } catch (e) {
    showNotification('error', e instanceof Error ? e.message : 'Failed to delete office');
  } finally {
    setLoading(false);
  }
};


const openIpModal = async (officeId: number) => {
  setIpOfficeId(officeId);
  setIpForm({ cidr: '', description: '', is_active: true });
  setShowIpModal(true);
  await fetchIpRanges(officeId);
};

const fetchIpRanges = async (officeId: number) => {
  try {
    setIpLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/attendance/office-ip-whitelists?office_id=${officeId}`);
    if (!res.ok) throw new Error('Failed to load IP whitelist');
    const data = await res.json();
    setIpRanges(Array.isArray(data?.data) ? data.data : data);
  } catch (e) {
    showNotification('error', e instanceof Error ? e.message : 'Failed to load IP whitelist');
    setIpRanges([]);
  } finally {
    setIpLoading(false);
  }
};

const addIpRange = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!ipOfficeId) return;

  // Confirm before adding
  const ok = window.confirm(
    `Add IP whitelist?\n\nCIDR: ${ipForm.cidr}\nDescription: ${ipForm.description || '-'}\nStatus: ${ipForm.is_active ? 'Active' : 'Inactive'}`
  );
  if (!ok) return;

  try {
    setIpLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/attendance/office-ip-whitelists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        office_id: ipOfficeId,
        cidr: ipForm.cidr.trim(),
        description: ipForm.description || '',
        is_active: ipForm.is_active ? 1 : 0,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add CIDR');
    }
    setIpForm({ cidr: '', description: '', is_active: true });
    await fetchIpRanges(ipOfficeId);
    showNotification('success', 'CIDR added');
  } catch (e) {
    showNotification('error', e instanceof Error ? e.message : 'Failed to add CIDR');
  } finally {
    setIpLoading(false);
  }
};


const updateIpRange = async (id: number, updates: Partial<OfficeIpRange>) => {
  try {
    setIpLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/attendance/office-ip-whitelists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cidr: updates.cidr,
        description: updates.description,
        is_active: updates.is_active !== undefined ? (updates.is_active ? 1 : 0) : undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update CIDR');
    }
    if (ipOfficeId) await fetchIpRanges(ipOfficeId);
    showNotification('success', 'CIDR updated');
  } catch (e) {
    showNotification('error', e instanceof Error ? e.message : 'Failed to update CIDR');
  } finally {
    setIpLoading(false);
  }
};

const removeIpRange = async (id: number) => {
  const ok = window.confirm('Delete this IP whitelist entry? This cannot be undone.');
  if (!ok) return;

  try {
    setIpLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/attendance/office-ip-whitelists/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete CIDR');
    }
    if (ipOfficeId) await fetchIpRanges(ipOfficeId);
    showNotification('success', 'CIDR deleted');
  } catch (e) {
    showNotification('error', e instanceof Error ? e.message : 'Failed to delete CIDR');
  } finally {
    setIpLoading(false);
  }
};


// Office delete confirm
const [confirmOfficeDelete, setConfirmOfficeDelete] = useState<{ open: boolean; id: number | null; name?: string }>({
  open: false,
  id: null,
  name: '',
});

// IP add/delete confirms
const [confirmIpAdd, setConfirmIpAdd] = useState(false);
const [confirmIpDelete, setConfirmIpDelete] = useState<{ open: boolean; id: number | null }>({
  open: false,
  id: null,
});


// IP edit modal state
const [showIpEditModal, setShowIpEditModal] = useState(false);
const [editingIpId, setEditingIpId] = useState<number | null>(null);
const [ipEditForm, setIpEditForm] = useState<{ cidr: string; description?: string; is_active: boolean }>({
  cidr: '',
  description: '',
  is_active: true,
});

const openEditIpModal = (r: OfficeIpRange) => {
  setEditingIpId(r.id);
  setIpEditForm({
    cidr: r.cidr,
    description: r.description || '',
    is_active: !!r.is_active,
  });
  setShowIpEditModal(true);
};

const closeEditIpModal = () => {
  setShowIpEditModal(false);
  setEditingIpId(null);
};

function buildMapQueryFromOffice(o: {
  lat?: number | null;
  lng?: number | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postcode?: string | null;
}) {
  const hasFiniteCoords =
    typeof o.lat === 'number' &&
    typeof o.lng === 'number' &&
    Number.isFinite(o.lat) &&
    Number.isFinite(o.lng);

  if (hasFiniteCoords) {
    return `${o.lat},${o.lng}`;
  }

  const parts = [
    o.address_line1, o.address_line2, o.postcode, o.city, o.state, o.country
  ]
    .filter(v => typeof v === 'string' && v.trim().length > 0)
    .map(v => (v as string).trim());

  const addr = parts.join(', ');
  return addr.length > 0 ? addr : '';
}

function hasUsableMapQuery(q: string) {
  return typeof q === 'string' && q.trim().length > 0;
}


useEffect(() => {
  if (activeTab === 'offices') {
    fetchOffices();
  }
}, [activeTab, company]);


  // Function to show notifications
  const showNotification = (type: 'info' | 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Revert changes by resetting form data to company data
      setFormData(company);
      
      // Reset leave type values when cancelling
      const initialValues: Record<string, number> = {};
      leaveTypes.forEach(lt => {
        initialValues[lt.id] = lt.max_days;
      });
      setLeaveTypeValues(initialValues);
    } else {
      // Initialize leave values when starting to edit
      const initialValues: Record<string, number> = {};
      leaveTypes.forEach(lt => {
        initialValues[lt.id] = lt.max_days;
      });
      setLeaveTypeValues(initialValues);
    }
    setIsEditing(!isEditing);
  };

  // Handle input changes when editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Department form handlers
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDepartmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openDepartmentModal = (dept: Department) => {
    if(dept.id !== ''){
      setIsDepartmentEditing(true);
      setEditDepartmentId(dept.id);
    }
    setDepartmentForm({
      department_name: dept.department_name || '',
      status: dept.is_active ? 'active' : 'inactive'
    });
    setShowDepartmentModal(true);
  };

  const closeDepartmentModal = () => {
    setShowDepartmentModal(false);
    setIsDepartmentEditing(false);
    setEditDepartmentId(null);
  };

  // Handle department form submission
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departmentForm.department_name.trim()) {
      showNotification('error', 'Department name is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/companies/${params.id}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: params.id,
          department_name: departmentForm.department_name,
          status: departmentForm.status
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add department');
      }
      
      const newDept = await response.json();
      
      // Add the new department to the list
      setDepartments(prev => [...prev, {
        id: newDept.department.id.toString(),
        department_name: newDept.department.department_name,
        description: newDept.department.description,
        is_active: newDept.department.is_active === 1
      }]);
      
      showNotification('success', 'Department added successfully');
      closeDepartmentModal();
    } catch (error) {
      console.error('Error adding department:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to add department');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for company edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
      setSaveLoading(true);
      showNotification('info', 'Saving changes...');
      
      // First, update the company data
      const response = await fetch(`${API_BASE_URL}/api/admin/companies/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          registration_number: formData.register_number,
          address: formData.address,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          website: formData.website,
          description: formData.description,
          income_tax_no: formData.income_tax_no,
          socso_account_no: formData.socso_account_no,
          epf_account_no: formData.epf_account_no
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update company');
      }
      
      // Update the company data with the form data
      setCompany({...formData});
      
      // Now update the leave types if we're on the leaves tab and have leave types
      if (activeTab === 'leaves' && leaveTypes.length > 0) {
        const leaveTypesToUpdate = leaveTypes.map(leaveType => ({
          id: leaveType.id,
          leave_type_name: leaveType.leave_type_name,
          code: leaveType.code,
          description: leaveType.description || '',
          max_days: leaveTypeValues[leaveType.id] ?? leaveType.max_days,
          requires_approval: leaveType.requires_approval,
          requires_documentation: leaveType.requires_documentation,
          is_active: leaveType.is_active,
          company_id: leaveType.company_id
        }));
        
        const leaveResponse = await fetch(`${API_BASE_URL}/api/v1/leave-types/bulk/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ leaveTypes: leaveTypesToUpdate }),
        });
        
        if (!leaveResponse.ok) {
          const errorData = await leaveResponse.json();
          throw new Error(errorData.error || 'Failed to update leave configuration');
        }
        
        // Update the leave types with new values
        setLeaveTypes(prev => 
          prev.map(leaveType => ({
            ...leaveType,
            max_days: leaveTypeValues[leaveType.id] ?? leaveType.max_days
          }))
        );
      }
      
      setIsEditing(false);
      showNotification('success', 'Company updated successfully');
      
    } catch (error) {
      console.error('Error updating company:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to update company');
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete company
  const handleDelete = async () => {
    try {
      // Show loading notification
      showNotification('info', 'Deleting company...');
      const response = await fetch(`${API_BASE_URL}/api/admin/companies/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete company');
      }
      
      // Show success notification
      showNotification('success', 'Company deleted successfully');
      
      // Short delay before redirecting
      setTimeout(() => {
        router.push('/companies');
      }, 1000);
    } catch (err) {
      console.error('Error deleting company:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete company. Please try again later.';
      showNotification('error', errorMessage);
      setError(errorMessage);
    }
  };

  // Fetch subsidiaries
  const fetchSubsidiaries = async () => {
    if (!company) return;
    
    try {
      setLoadingSubsidiaries(true);
      // Open modal first for better UX
      subsidiariesModalRef.current?.showModal();
      
      const response = await fetch(`${API_BASE_URL}/api/companies?parent_id=${company.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map the data to our Company interface
      setSubsidiaries(data.map((comp: any) => ({
        id: comp.id.toString(),
        name: comp.company_name || '',
        address: comp.address || '',
        phone: comp.phone || '',
        email: comp.email || '',
        register_number: comp.register_number || '',
        is_active: comp.is_active === 1 || comp.is_active === true,
        status: comp.is_active === 1 || comp.is_active === true ? 'active' : 'inactive',
      })));
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
      setSubsidiaries([]);
      showNotification('error', 'Failed to load subsidiaries. Please try again later.');
    } finally {
      setLoadingSubsidiaries(false);
    }
  };




  // Fetch leave types for the company
  const fetchLeaveTypes = async () => {
    if (!params.id) return;
    
    try {
      setLeaveTypesLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/leave-types/company/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leave types');
      }
      
      const data = await response.json();
      setLeaveTypes(data);
      
      // Initialize leave type values
      const initialValues: Record<string, number> = {};
      data.forEach((lt: LeaveType) => {
        initialValues[lt.id] = lt.max_days;
      });
      setLeaveTypeValues(initialValues);
      
    } catch (error) {
      console.error('Error fetching leave types:', error);
      showNotification('error', 'Failed to load leave types');
    } finally {
      setLeaveTypesLoading(false);
    }
  };

  // Handle department update
  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editDepartmentId) return;
    
    if (!departmentForm.department_name.trim()) {
      showNotification('error', 'Department name is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/departments/${editDepartmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department_name: departmentForm.department_name,
          is_active: departmentForm.status === 'active' ? 1 : 0
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update department');
      }
      

      // setDepartments(prev => [...prev, {
      //   id: newDept.department.id.toString(),
      //   department_name: newDept.department.department_name,
      //   description: newDept.department.description,
      //   is_active: newDept.department.is_active === 1
      // }]);

      // Update the department in the list
      setDepartments(prev => 
        prev.map(dept => 
          dept.id === editDepartmentId 
            ? {
                ...dept,
                department_name: departmentForm.department_name,
                is_active: departmentForm.status === 'active'
              }
            : dept
        )
      );
      
      // Get fresh data from the server to ensure consistency
      const deptApiUrl = `${API_BASE_URL}/api/admin/companies/${params.id}/departments`;
      const deptResponse = await fetch(deptApiUrl);
      
      if (deptResponse.ok) {
        const deptData = await deptResponse.json();
        if (deptData.success && Array.isArray(deptData.departments)) {
          setDepartments(deptData.departments);
        } else if (Array.isArray(deptData)) {
          setDepartments(deptData.map((dept: any) => ({
            id: dept.id.toString(),
            department_name: dept.department_name || '',
            description: dept.description || '',
            is_active: dept.is_active === 1 || dept.is_active === true
          })));
        }
      }

      showNotification('success', 'Department updated successfully');
    } catch (error) {
      console.error('Error updating department:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to update department');
    } finally {
      closeDepartmentModal();
      setLoading(false);
    }
  };

  // Function to fetch employees for the company
  const fetchEmployees = async () => {
    if (!company) return;
    
    try {
      setEmployeesLoading(true);
      setEmployeesError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/employees?company_id=${company.id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching employees: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store all employees and set pagination data
      const allEmployees = Array.isArray(data) ? data : [];
      setEmployees(allEmployees);
      setTotalEmployees(allEmployees.length);
      setTotalPages(Math.ceil(allEmployees.length / pageSize));
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployeesError('Failed to load employees');
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Smart pagination functions
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;

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
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fetch company data
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setLoading(true);
      try {
        // Call the backend API endpoint directly instead of through Next.js API routes
        const response = await fetch(`${API_BASE_URL}/api/companies/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching company: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map the backend data to our Company interface
        const companyData = {
          id: data.id.toString(),
          name: data.company_name || '',
          company_name: data.company_name || '',
          register_number: data.register_number || '',
          address: data.address || '',
          email: data.email || '',
          phone: data.phone || '',
          is_active: data.is_active === 1 || data.is_active === true,
          status: data.is_active === 1 || data.is_active === true ? 'active' : 'inactive',
          parent_id: data.parent_id ? data.parent_id.toString() : null,
          parentCompany: data.parent_company_name || null,
          income_tax_no: data.income_tax_no || '',
          socso_account_no: data.socso_account_no || '',
          epf_account_no: data.epf_account_no || '',
          website: data.website || '',
          description: data.description || '',
          created_at: data.created_at || null,
          hasSubcompanies: data.has_subcompanies || false,
        };
        
        setCompany(companyData);
        // Initialize form data for edit mode
        setFormData(companyData);
        
        // Also fetch departments directly
        const deptResponse = await fetch(`${API_BASE_URL}/api/admin/companies/${params.id}/departments`);
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          if (deptData.success && Array.isArray(deptData.departments)) {
            setDepartments(deptData.departments);
          } else {
            // Handle older API format
            if (Array.isArray(deptData)) {
              setDepartments(deptData.map((dept: any) => ({
                id: dept.id.toString(),
                department_name: dept.department_name || '',
                description: dept.description || '',
                is_active: dept.is_active === 1 || dept.is_active === true
              })));
            } else {
              // If response is not in expected format
              console.error('Unexpected department data format:', deptData);
              setDepartments([]);
            }
          }
        } else {
          setDepartments([]);
          //showNotification('error', 'Failed to load departments');
        }
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError('Failed to load company details. Please try again later.');
        
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchCompanyDetails();
    }
  }, [params.id]);
  
  useEffect(() => {
    // Load employees when tab changes to employees
    if (activeTab === 'employees' && company) {
      setCurrentPage(1); // Reset to first page when tab changes
      fetchEmployees();
    }
  }, [activeTab, company]);
  
  // Fetch leave types when leaves tab is active
  useEffect(() => {
    if (activeTab === 'leaves') {
      fetchLeaveTypes();
    }
  }, [activeTab, params.id]);
  
  // Handle leave type changes
  const handleLeaveTypeChange = (id: string, value: number) => {
    setLeaveTypeValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (error || !company) {
    return (
      <div className="container mx-auto p-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error || 'Company not found'}</span>
        </div>
        <div className="mt-4">
          <Link href="/companies" className="btn btn-primary">Back to Companies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Notification Alert */}
      {notification.show && (
        <div className={`alert ${
          notification.type === 'success' ? 'alert-success' :
          notification.type === 'error' ? 'alert-error' : 'alert-info'
        } shadow-lg ${
          notification.type === 'success' 
            ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' 
            : 'fixed top-4 right-4'
        } z-50 w-auto max-w-md`}>
          <div className='flex items-center gap-2'>
            {notification.type === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            {notification.type === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            {notification.type === 'info' && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      {/* Header with actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <nav className="text-sm breadcrumbs">
          <ul>
            <li><Link href="/">Dashboard</Link></li>
            <li><Link href="/companies">Companies</Link></li>
            <li className="font-semibold">{company.name || company.company_name}</li>
          </ul>
        </nav>
        
        <div className="flex gap-2 justify-end">
          <button 
            className={`btn ${isEditing ? 'btn-ghost' : 'btn-primary'}`}
            onClick={toggleEditMode}
             type="button"
          >
            {isEditing ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Edit</span>
              </>
            )}
          </button>
          
          {!isEditing && (
            <button 
              className="btn btn-error" 
              onClick={() => deleteModalRef.current?.showModal()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
          
          <Link href="/companies" className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </div>
      
      {/* Company header with status */}
      <div className="bg-base-100 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{company.name || company.company_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {company.register_number && (
                  <span className="text-gray-600 font-medium">Reg: {company.register_number}</span>
                )}
                {company.parentCompany && (
                  <>
                    {company.register_number && <span className="text-gray-400">•</span>}
                    <span className="text-gray-600">Subsidiary of {company.parentCompany}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`badge ${company.status === 'active' ? 'badge-success' : 'badge-error'} py-3 px-4`}>
                {company.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              {company.created_at && (
                <span className="text-sm font-medium">Registered: {formatDate(company.created_at)}</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-base-200 rounded-lg mt-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Email</span>
              <span className="font-medium">{company.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Phone</span>
              <span className="font-medium">{company.phone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Website</span>
              <span className="font-medium">
                {company.website ? (
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    {company.website}
                  </a>
                ) : 'N/A'}
              </span>
            </div>
            {company.hasSubcompanies && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Subsidiaries</span>
                <Link href="#" onClick={fetchSubsidiaries} className="link link-primary text-left">
                  View Subsidiaries
                </Link>
              </div>
            )}
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
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'company' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('company')}
              >
                Company Information
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'departments' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'employees' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('employees')}
              >
                Employees
              </button>
              <button 
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'leaves' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('leaves')}
              >
                Leaves
              </button>
              <button
                className={`py-2 px-1 cursor-pointer whitespace-nowrap ${activeTab === 'offices' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('offices')}
              >
                Offices
              </button>

            </div>
          </div>
        </div>
      </div>
      
      {/* Form or View based on edit mode */}
      <form onSubmit={handleSubmit}>
        {/* Company Information Tab */}
        {activeTab === 'company' && (
          <div className="bg-base-100 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Company Name */}
              <div>
                <label className="label">Company Name</label>
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
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">{company.name || company.company_name}</div>
                )}
              </div>
              
              {/* Registration Number */}
              <div>
                <label className="label">Registration Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="register_number" 
                    value={formData?.register_number || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full" 
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">{company.register_number || 'N/A'}</div>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label className="label">Email</label>
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
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">
                    {company.email ? (
                      <a href={`mailto:${company.email}`} className="link link-primary">
                        {company.email}
                      </a>
                    ) : 'N/A'}
                  </div>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label className="label">Phone</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData?.phone || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required 
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">
                    {company.phone ? (
                      <a href={`tel:${company.phone}`} className="link link-primary">
                        {company.phone}
                      </a>
                    ) : 'N/A'}
                  </div>
                )}
              </div>
              
              {/* Website */}
              <div>
                <label className="label">Website</label>
                {isEditing ? (
                  <input 
                    type="url" 
                    name="website" 
                    value={formData?.website || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full" 
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">
                    {company.website ? (
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                        className="link link-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {company.website}
                      </a>
                    ) : 'N/A'}
                  </div>
                )}
              </div>
              
              {/* Status */}
              <div>
                <label className="label">Status</label>
                {isEditing ? (
                  <select 
                    name="status" 
                    value={formData?.status || 'active'}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">
                    <span >
                      {company.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Address - Full width */}
              <div className="md:col-span-2">
                <label className="label">Address</label>
                {isEditing ? (
                  <textarea 
                    name="address" 
                    value={formData?.address || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full h-24" 
                    required
                  ></textarea>
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">{company.address}</div>
                )}
              </div>
              
              {/* Description - Full width */}
              <div className="md:col-span-2">
                <label className="label">Description</label>
                {isEditing ? (
                  <textarea 
                    name="description" 
                    value={formData?.description || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full h-24" 
                  ></textarea>
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">{company.description || 'No description provided'}</div>
                )}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Income Tax Number */}
              <div>
                <label className="label">Income Tax No.</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="income_tax_no" 
                    value={formData?.income_tax_no || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full" 
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">{company.income_tax_no || 'N/A'}</div>
                )}
              </div>
              
              {/* SOCSO Account Number */}
              <div>
                <label className="label">SOCSO Account No.</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="socso_account_no" 
                    value={formData?.socso_account_no || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full" 
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">{company.socso_account_no || 'N/A'}</div>
                )}
              </div>
              
              {/* EPF Account Number */}
              <div>
                <label className="label">EPF Account No.</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="epf_account_no" 
                    value={formData?.epf_account_no || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full" 
                  />
                ) : (
                  <div className="p-3 bg-base-200 rounded min-h-[42px]">{company.epf_account_no || 'N/A'}</div>
                )}
              </div>
            </div>
            
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
          </div>
        )}
        
        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="bg-base-100 rounded-lg shadow p-6">
            <div className="flex flex-row justify-between mb-6">
              <h2 className="text-xl font-semibold">Departments</h2>
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openDepartmentModal({
                    id: '',
                    department_name: '',
                    description: '',
                    is_active: true
                  })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
            
            {departments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-center">No</th>
                      <th>Department Name</th>
                      <th>Department Code</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept, index) => (
                      <tr key={dept.id}>
                        <td className="text-center">{index + 1}</td>
                        <td>{dept.department_name}</td>
                        <td>{dept.id}</td>
                        <td>
                          <span className={`badge ${dept.is_active ? 'badge-success' : 'badge-error'}`}>
                            {dept.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{dept.description || 'No description'}</td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link 
                              href={`/departments/${dept.id}`}
                              className="btn btn-sm btn-info"
                            >
                              View
                            </Link>
                            {/*Temporary disabled*/}
                            {/* <button
                              type="button"
                              onClick={() => openDepartmentModal({
                                id: dept.id,
                                department_name: dept.department_name || '',
                                description: dept.description || '',
                                is_active: dept.is_active || true
                              })}
                              className="btn btn-square btn-sm btn-warning"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>No departments found for this company. Click "Add Department" to create one.</span>
              </div>
            )}
          </div>
        )}
        
        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-base-100 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Employees</h2>
              <Link 
                href={`/employees/add?companyId=${company.id}`}
                className="btn btn-primary btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Employee
              </Link>
            </div>
            
            {employeesLoading ? (
              <div className="flex justify-center items-center p-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : employeesError ? (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{employeesError}</span>
              </div>
            ) : employees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="text-center">No</th>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Joined Date</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((employee, index) => (
                      <tr key={employee.id}>
                        <td className="text-center">{((currentPage - 1) * pageSize) + index + 1}</td>
                        <td>{employee.employee_no || '-'}</td>
                        <td>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs opacity-60">{employee.gender || '-'}</div>
                        </td>
                        <td>{employee.email}</td>
                        <td>{employee.department || '-'}</td>
                        <td>{employee.position || '-'}</td>
                        <td>{employee.joined_date ? new Date(employee.joined_date).toLocaleDateString() : '-'}</td>
                        <td className="text-center">
                          <div className={`badge ${employee.status?.toLowerCase() === 'active' ? 'badge-success' : 'badge-error'}`}>
                            {employee.status || 'Active'}
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <Link href={`/employees/${employee.id}`} className="btn btn-sm btn-info">
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4 p-4 border-t text-sm text-gray-500">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalEmployees)} of {totalEmployees} employees
                </div>
                
                {/* Pagination */}
                {!employeesLoading && employees.length > 0 && (
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
                        type='button' 
                        className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1 || employeesLoading}
                      >
                        «
                      </button>
                      {getPageNumbers().map(page => (
                        <button
                          type='button' 
                          key={page}
                          className={`btn btn-sm ${currentPage === page ? 
                            `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                            `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                          }`}
                          onClick={() => goToPage(page)}
                          disabled={employeesLoading}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type='button'  
                        className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages || employeesLoading}
                      >
                        »
                      </button>
                      <button 
                        className={`btn btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>No employees found for this company.</span>
              </div>
            )}
            
            <div className="mt-6">
              <Link href={`/employees?companyId=${company?.id}`} className="btn btn-outline w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View All Employees
              </Link>
            </div>
          </div>
        )}
        
        {/* Leaves Tab */}
        {activeTab === 'leaves' && (
          <div className="bg-base-100 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Company Leave Configuration</h2>
            </div>
            
            {leaveTypesLoading ? (
              <div className="flex justify-center items-center p-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {leaveTypes.length > 0 ? (
                  leaveTypes.map((leaveType) => (
                    <div key={leaveType.id} className=" p-4 rounded-lg">
                      <label className="label">
                        {leaveType.leave_type_name}
                      </label>
                      {isEditing ? (
                        <input 
                          type="number" 
                          className="input input-bordered w-full" 
                          placeholder="Enter days"
                          value={leaveTypeValues[leaveType.id] ?? leaveType.max_days}
                          onChange={(e) => handleLeaveTypeChange(leaveType.id, parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      ) : (
                        <div className="p-3 bg-base-200 rounded">{leaveType.max_days} days</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="alert alert-info md:col-span-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>No leave types found for this company.</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Save/Cancel buttons for edit mode */}
            {isEditing && leaveTypes.length > 0 && (
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
          </div>
        )}


        {activeTab === 'offices' && (
  <div className="bg-base-100 rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Offices</h2>
      <button className="btn btn-primary btn-sm" onClick={openCreateOffice}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M12 6v12m6-6H6"/></svg>
        Add Office
      </button>
    </div>

    {officesLoading ? (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    ) : offices.length ? (
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Address</th>
              <th>Timezone</th>
              <th>Lat/Lng</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offices.map((o, idx) => (
              <tr key={o.office_id }>
                <td>{idx + 1}</td>
                <td className="font-medium">{o.name}</td>
                <td className="text-sm">
                  {[o.address_line1, o.address_line2, o.postcode, o.city, o.state, o.country]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </td>
                <td>{o.timezone || '—'}</td>
                <td>{(o.lat ?? '') && (o.lng ?? '') ? `${o.lat}, ${o.lng}` : '—'}</td>
                <td>
                  <span className={`badge ${o.is_active ? 'badge-success' : 'badge-error'}`}>
                    {o.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-outline btn-primary btn-sm"
                    onClick={() => openEditOffice(o)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline btn-primary btn-sm"
                    onClick={() => openIpModal(o.office_id)}
                    type="button"
                  >
                    Manage IPs
                  </button>
                  <button
                    className="btn btn-outline btn-primary btn-sm"
                    onClick={() => setConfirmOfficeDelete({ open: true, id: o.office_id , name: o.name })}
                    type="button"
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
    ) : (
      <div className="alert">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-info w-6 h-6" viewBox="0 0 24 24" fill="none"><path strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"/></svg>
        <span>No offices yet. Click “Add Office”.</span>
      </div>
    )}
  </div>
        )}


      </form>
      
      {/* Department Modal */}
      <dialog id="department_modal" className={`modal ${showDepartmentModal ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{isDepartmentEditing ? 'Edit Department' : 'Add New Department'}</h3>
            <button 
              type="button"
              className="btn btn-sm btn-circle"
              onClick={closeDepartmentModal}
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={isDepartmentEditing ? handleUpdateDepartment : handleAddDepartment}>
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Department Name*</span>
              </label>
              <input 
                type="text" 
                name="department_name"
                value={departmentForm.department_name}
                onChange={handleDepartmentChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            

            
            <div className="mb-6">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select 
                name="status"
                value={departmentForm.status}
                onChange={handleDepartmentChange}
                className="select select-bordered w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="modal-action">
              <button 
                type="button"
                className="btn btn-outline"
                onClick={closeDepartmentModal}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : isDepartmentEditing ? 'Update Department' : 'Add Department'}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={closeDepartmentModal}></div>
      </dialog>
      
      {/* Subsidiaries Modal */}
      <dialog ref={subsidiariesModalRef} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-xl mb-6">
            {company?.name} - Subsidiaries
          </h3>
          
          {loadingSubsidiaries ? (
            <div className="flex justify-center items-center p-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <>
              {subsidiaries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-center">No</th>
                        <th>Company Name</th>
                        <th>Company ID</th>
                        <th>Registration Number</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subsidiaries.map((subsidiary, index) => (
                        <tr key={subsidiary.id}>
                          <td className="text-center">{index + 1}</td>
                          <td>{subsidiary.name}</td>
                          <td>{subsidiary.id}</td>
                          <td>{subsidiary.register_number || 'N/A'}</td>
                          <td>{subsidiary.email}</td>
                          <td>{subsidiary.phone}</td>
                          <td className="text-center">
                            <div 
                              className={`badge badge-lg ${
                                subsidiary.status === 'active' 
                                  ? 'badge-success text-success-content' 
                                  : 'badge-error text-error-content'
                              }`}
                            >
                              {subsidiary.status === 'active' ? 'Active' : 'Inactive'}
                            </div>
                          </td>
                          <td className="text-center">
                            <Link href={`/companies/${subsidiary.id}`} className="btn btn-sm btn-info">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>No subsidiaries found for this company.</span>
                </div>
              )}
            </>
          )}
          
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      
      {/* Delete Confirmation Modal */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete <span className="font-semibold">{company?.name || company?.company_name}</span>? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Cancel</button>
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

      {/* Office Modal */}
      <dialog className={`modal ${showOfficeModal ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{editingOfficeId ? 'Edit Office' : 'Add Office'}</h3>
            <button className="btn btn-sm btn-circle" onClick={() => setShowOfficeModal(false)} type="button">✕</button>
          </div>

          <form onSubmit={saveOffice} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Name*</label>
              <input className="input input-bordered w-full" required
                value={officeForm.name}
                onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Address Line 1</label>
              <input className="input input-bordered w-full"
                value={officeForm.address_line1 || ''}
                onChange={(e) => setOfficeForm({ ...officeForm, address_line1: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Address Line 2</label>
              <input className="input input-bordered w-full"
                value={officeForm.address_line2 || ''}
                onChange={(e) => setOfficeForm({ ...officeForm, address_line2: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Postcode</label>
              <input className="input input-bordered w-full"
                value={officeForm.postcode || ''}
                onChange={(e) => setOfficeForm({ ...officeForm, postcode: e.target.value })}
              />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input input-bordered w-full"
                value={officeForm.city || ''}
                onChange={(e) => setOfficeForm({ ...officeForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="label">State</label>
              <input className="input input-bordered w-full"
                value={officeForm.state || ''}
                onChange={(e) => setOfficeForm({ ...officeForm, state: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input input-bordered w-full"
                value={officeForm.country || ''}
                onChange={(e) => setOfficeForm({ ...officeForm, country: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Latitude</label>
              <input type="number" step="any" className="input input-bordered w-full"
                value={officeForm.lat ?? ''}
                onChange={(e) => setOfficeForm({ ...officeForm, lat: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input type="number" step="any" className="input input-bordered w-full"
                value={officeForm.lng ?? ''}
                onChange={(e) => setOfficeForm({ ...officeForm, lng: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>

            <div>
              <label className="label">Timezone</label>
              <select
                className="select select-bordered w-full"
                value={officeForm.timezone || 'Asia/Kuala_Lumpur'}
                onChange={(e) => setOfficeForm({ ...officeForm, timezone: e.target.value })}
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>



            <div>
              <label className="label">Status</label>
              <select className="select select-bordered w-full"
                value={officeForm.is_active ? 'active' : 'inactive'}
                onChange={(e) => setOfficeForm({ ...officeForm, is_active: e.target.value === 'active' })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Map preview */}
            <div className="md:col-span-2 space-y-2">
              {(() => {
                const q = buildMapQueryFromOffice(officeForm);
                const disabled = !hasUsableMapQuery(q);
                const linkHref = disabled
                  ? undefined
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
                const iframeSrc = disabled
                  ? ''
                  : `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;

                return (
                  <>
                    <div className="flex items-center gap-3">
                      <a
                        className={`link link-primary ${disabled ? 'pointer-events-none opacity-50' : ''}`}
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={disabled ? 'Enter address or coordinates to enable preview' : 'Open in Google Maps'}
                      >
                        Preview on Google Maps
                      </a>
                      {disabled && (
                        <span className="text-sm text-gray-500">
                          Enter latitude/longitude or address to enable preview
                        </span>
                      )}
                    </div>

                    {/* Inline map (no API key needed). Only render if query is available */}
                    {hasUsableMapQuery(q) && (
                      <div className="w-full rounded-lg overflow-hidden border border-base-300">
                        <iframe
                          key={q} // re-render when query changes
                          title="Office Map Preview"
                          src={iframeSrc}
                          style={{ width: '100%', height: 280, border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    )}
                  </>
                );
              })()}
            </div>


            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" className="btn btn-outline" onClick={() => setShowOfficeModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (<><span className="loading loading-spinner loading-sm"></span>Saving...</>) : 'Save'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Office IP Whitelist Modal */}
      <dialog className={`modal ${showIpModal ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Office IP Whitelist</h3>
            <button className="btn btn-sm btn-circle" onClick={() => setShowIpModal(false)} type="button">✕</button>
          </div>

          {/* Add form */}
          <form onSubmit={addIpRange} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="md:col-span-1">
              <label className="label">CIDR*</label>
              <input className="input input-bordered w-full" placeholder="e.g. 203.0.113.0/24"
                value={ipForm.cidr}
                onChange={(e) => setIpForm({ ...ipForm, cidr: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="label">Description</label>
              <input className="input input-bordered w-full" placeholder="HQ LAN / Guest Wifi"
                value={ipForm.description || ''}
                onChange={(e) => setIpForm({ ...ipForm, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-1">
              <label className="label">Status</label>
              <select className="select select-bordered w-full"
                value={ipForm.is_active ? 'active' : 'inactive'}
                onChange={(e) => setIpForm({ ...ipForm, is_active: e.target.value === 'active' })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button className="btn btn-primary" type="submit" disabled={ipLoading}>
                {ipLoading ? (<><span className="loading loading-spinner loading-sm"></span>Adding...</>) : 'Add CIDR'}
              </button>
            </div>
          </form>

          {/* List */}
          {ipLoading ? (
            <div className="flex justify-center py-8"><span className="loading loading-spinner loading-lg"></span></div>
          ) : ipRanges.length ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CIDR</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ipRanges.map((r, idx) => (
                    <tr key={r.id}>
                      <td>{idx + 1}</td>
                      <td>{r.cidr}</td>
                      <td>{r.description || '—'}</td>
                      <td>
                        <span className={`badge ${r.is_active ? 'badge-success' : 'badge-ghost'}`}>
                          {r.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => updateIpRange(r.id, { is_active: !r.is_active })}
                      >
                        {r.is_active ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => openEditIpModal(r)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => setConfirmIpDelete({ open: true, id: r.id })}
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
          ) : (
            <div className="alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-info w-6 h-6" viewBox="0 0 24 24" fill="none"><path strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"/></svg>
              <span>No CIDRs yet. Add one above.</span>
            </div>
          )}

          <div className="modal-action">
            <button className="btn" onClick={() => setShowIpModal(false)}>Close</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <dialog className={`modal ${showIpEditModal ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Edit IP Whitelist</h3>
            <button className="btn btn-sm btn-circle" onClick={closeEditIpModal} type="button">✕</button>
          </div>

          {/* "Console" header */}
          <div className="bg-base-200 rounded p-3 text-xs mb-3">
            <div className="font-mono opacity-80">
              <div>id: {editingIpId ?? '—'}</div>
              <div>office_id: {ipOfficeId ?? '—'}</div>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editingIpId) return;

              // Console-style log (optional)
              console.log('[IP-WHITELIST] update', {
                id: editingIpId,
                ...ipEditForm,
              });

              try {
                await updateIpRange(editingIpId, {
                  cidr: ipEditForm.cidr.trim(),
                  description: ipEditForm.description || '',
                  is_active: ipEditForm.is_active,
                });
                closeEditIpModal();
              } catch {
                // updateIpRange already notifies; keep modal open on error
              }
            }}
            className="space-y-3"
          >
            <div>
              <label className="label">CIDR</label>
              <input
                className="input input-bordered w-full"
                value={ipEditForm.cidr}
                onChange={(e) => setIpEditForm({ ...ipEditForm, cidr: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <input
                className="input input-bordered w-full"
                value={ipEditForm.description || ''}
                onChange={(e) => setIpEditForm({ ...ipEditForm, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="label-text">Active</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={ipEditForm.is_active}
                onChange={(e) => setIpEditForm({ ...ipEditForm, is_active: e.target.checked })}
              />
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={closeEditIpModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={ipLoading}>
                {ipLoading ? (<><span className="loading loading-spinner loading-sm"></span>Saving...</>) : 'Save'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>


      <dialog className={`modal ${confirmOfficeDelete.open ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Office</h3>
          <p className="py-4">
            Are you sure you want to delete <span className="font-semibold">{confirmOfficeDelete.name}</span>? This cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-outline"
              onClick={() => setConfirmOfficeDelete({ open: false, id: null, name: '' })}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (confirmOfficeDelete.id != null) {
                  await deleteOffice(confirmOfficeDelete.id);
                }
                setConfirmOfficeDelete({ open: false, id: null, name: '' });
              }}
              disabled={loading}
            >
              {loading ? (<><span className="loading loading-spinner loading-sm"></span>Deleting...</>) : 'Confirm'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setConfirmOfficeDelete({ open: false, id: null, name: '' })}>close</button>
        </form>
      </dialog>


      <dialog className={`modal ${confirmIpAdd ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg">Add IP Whitelist</h3>
          <div className="bg-base-200 rounded p-3 my-3 text-sm">
            <div><span className="opacity-60">CIDR:</span> {ipForm.cidr || '—'}</div>
            <div><span className="opacity-60">Description:</span> {ipForm.description || '—'}</div>
            <div><span className="opacity-60">Status:</span> {ipForm.is_active ? 'Active' : 'Inactive'}</div>
          </div>
          <div className="modal-action">
            <button className="btn btn-outline" onClick={() => setConfirmIpAdd(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                // call the same addIpRange you already have, but without native confirm
                // emulate a submit event for addIpRange:
                const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                await addIpRange(fakeEvent);
                setConfirmIpAdd(false);
              }}
              disabled={ipLoading}
            >
              {ipLoading ? (<><span className="loading loading-spinner loading-sm"></span>Adding...</>) : 'Confirm'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setConfirmIpAdd(false)}>close</button>
        </form>
      </dialog>

<dialog className={`modal ${confirmIpDelete.open ? 'modal-open' : ''}`}>
  <div className="modal-box max-w-md">
    <h3 className="font-bold text-lg">Delete IP Whitelist</h3>
    <p className="py-4">Are you sure you want to delete this IP whitelist entry? This cannot be undone.</p>
    <div className="modal-action">
      <button className="btn btn-outline" onClick={() => setConfirmIpDelete({ open: false, id: null })}>
        Cancel
      </button>
      <button
        className="btn btn-primary"
        onClick={async () => {
          if (confirmIpDelete.id != null) {
            await removeIpRange(confirmIpDelete.id);
          }
          setConfirmIpDelete({ open: false, id: null });
        }}
        disabled={ipLoading}
      >
        {ipLoading ? (<><span className="loading loading-spinner loading-sm"></span>Deleting...</>) : 'Confirm'}
      </button>
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button onClick={() => setConfirmIpDelete({ open: false, id: null })}>close</button>
  </form>
</dialog>


    </div>
  );
} 
