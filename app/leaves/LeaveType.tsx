import React, { useState, useEffect, useCallback  } from 'react';
import Link from 'next/link';
import { FaRegCalendarTimes } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { BsBag } from "react-icons/bs";
import { MdOutlineSick } from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { FaHandHoldingHeart } from "react-icons/fa";
import { LuPartyPopper } from "react-icons/lu";
import { LiaBriefcaseMedicalSolid } from "react-icons/lia";
import { BsAirplaneFill } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { pluralize } from '../utils/utils';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../hooks/useNotification';
import { useTheme } from '../components/ThemeProvider';

// Year-of-service brackets already used by your table
interface YearOfServiceBracket {
  min_years: number;
  max_years: number | null;
  days: number;
  renewal_period?: RenewalPeriod;
  carryover_max_days?: number;
  expire_unused_at_period_end?: boolean;
}

// New accrual/renewal support
type AccrualFrequency = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
type RenewalPeriod = 'NONE' | 'YEARLY' | 'QUARTERLY';

/* ===== Add near the top of your component (types & helpers) ===== */
type AllocationPrimary = 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
type EligibilityScope = 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF';

// Make sure this helper function is robust
const toBoolean = (value: boolean | number | string | undefined | null): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
  }
  return false;
};
const toApiPayload1 = (f: Partial<LeaveType>) => ({
  // required
  leave_type_name: (f.leave_type_name ?? '').trim(),
  code: (f.code ?? '').trim(),
  description: (f.description ?? null) || null,
  company_id: f.company_id ?? '0',

  // numbers
  max_days: Number(f.max_days ?? 0),
  increment_days: Number(f.increment_days ?? 0),
  max_increment_days: Number(f.max_increment_days ?? 0),
  carry_forward_days: Number(f.carry_forward_days ?? 0),

  // tinyint flags (0/1 expected by DB)
  requires_approval: f.requires_approval ? 1 : 0,
  requires_documentation: f.requires_documentation ? 1 : 0,
  is_active: f.is_active ? 1 : 0,

  // allocation model from UI (map to legacy flags)
  is_total: (f.allocation_primary ?? 'IMMEDIATE') === 'IMMEDIATE' ? 1 : (f.is_total ? 1 : 0),
  total_type: f.total_type ?? 'IMMEDIATE',
  is_divident: (f.allocation_primary ?? 'IMMEDIATE') === 'EARN' ? 1 : (f.is_divident ? 1 : 0),

  // new policy fields - FIX: Convert booleans to 1/0
  allocation_primary: f.allocation_primary ?? 'IMMEDIATE',
  eligibility_scope: f.eligibility_scope ?? 'ALL_STAFF',
  accrual_frequency: f.accrual_frequency ?? 'MONTHLY',
  accrual_rate: f.accrual_rate != null ? Number(f.accrual_rate) : null,
  earn_prorate_join_month: f.earn_prorate_join_month ? 1 : 0,
  renewal_period: f.renewal_period ?? 'NONE',
  expire_unused_at_period_end: f.expire_unused_at_period_end ? 1 : 0,
  carryover_max_days: f.carryover_max_days != null ? Number(f.carryover_max_days) : 0,
  carryover_expiry_months: f.carryover_expiry_months != null ? Number(f.carryover_expiry_months) : null,
  yos_brackets: f.yos_brackets ?? [],

  // seed balances flag
  isNewLeaveType: !!f.isNewLeaveType,
});

const toApiPayload2 = (f: Partial<LeaveType>) => ({
  // Required core fields
  leave_type_name: (f.leave_type_name ?? '').trim(),
  code: (f.code ?? '').trim(),
  description: (f.description ?? null) || null,
  company_id: f.company_id ?? '0',

  // Requirements
  requires_approval: f.requires_approval ? 1 : 0,
  requires_documentation: f.requires_documentation ? 1 : 0,
  is_active: f.is_active ? 1 : 0,

  // Allocation method
  allocation_primary: f.allocation_primary ?? 'YEAR_OF_SERVICE',
  eligibility_scope: f.eligibility_scope ?? 'ALL_STAFF',

  // EARN policy fields
  accrual_frequency: f.accrual_frequency ?? 'MONTHLY',
  accrual_rate: f.accrual_rate != null ? Number(f.accrual_rate) : null,
  earn_prorate_join_month: f.earn_prorate_join_month ? 1 : 0,

  // Renewal & carryover (for EARN allocation type)
  renewal_period: f.renewal_period ?? 'YEARLY',
  expire_unused_at_period_end: f.expire_unused_at_period_end ? 1 : 0,
  carryover_max_days: f.carryover_max_days != null ? Number(f.carryover_max_days) : 0,
  carryover_expiry_months: f.carryover_expiry_months != null ? Number(f.carryover_expiry_months) : null,

  // YOS brackets with all renewal settings
  yos_brackets: (f.yos_brackets ?? []).map(bracket => ({
    min_years: bracket.min_years,
    max_years: bracket.max_years,
    days: bracket.days,
    renewal_period: bracket.renewal_period ?? 'YEARLY',
    carryover_max_days: bracket.carryover_max_days ?? 0,
    expire_unused_at_period_end: bracket.expire_unused_at_period_end ? 1 : 0
  }))
});

const toApiPayload = (f: Partial<LeaveType>) => {
  const payload: any = {
    // Required core fields
    leave_type_name: (f.leave_type_name ?? '').trim(),
    code: (f.code ?? '').trim(),
    description: (f.description ?? null) || null,
    company_id: f.company_id ?? '0',

    // Requirements
    requires_approval: f.requires_approval ? 1 : 0,
    requires_documentation: f.requires_documentation ? 1 : 0,
    is_active: f.is_active ? 1 : 0,

    // Allocation method
    allocation_primary: f.allocation_primary ?? 'YEAR_OF_SERVICE',
    eligibility_scope: f.eligibility_scope ?? 'ALL_STAFF',
  };

  // Handle EARN allocation specific fields
  if (f.allocation_primary === 'EARN') {
    payload.accrual_frequency = f.accrual_frequency ?? 'MONTHLY';
    payload.accrual_rate = f.accrual_rate != null ? Number(f.accrual_rate) : null;
    payload.earn_prorate_join_month = f.earn_prorate_join_month ? 1 : 0;
    payload.renewal_period = f.renewal_period ?? 'YEARLY';
    payload.expire_unused_at_period_end = f.expire_unused_at_period_end ? 1 : 0;
    payload.carryover_max_days = f.carryover_max_days != null ? Number(f.carryover_max_days) : 0;
    payload.carryover_expiry_months = f.carryover_expiry_months != null ? Number(f.carryover_expiry_months) : null;
  }

  // Handle YOS allocation specific fields
  if (f.allocation_primary === 'YEAR_OF_SERVICE') {
    payload.yos_brackets = (f.yos_brackets ?? []).map(bracket => ({
      min_years: bracket.min_years,
      max_years: bracket.max_years,
      days: bracket.days,
      renewal_period: bracket.renewal_period ?? 'YEARLY',
      carryover_max_days: bracket.carryover_max_days ?? 0,
      expire_unused_at_period_end: bracket.expire_unused_at_period_end ? 1 : 0
    }));
  }

  return payload;
};

interface LeaveType {
  id: number;
  leave_type_name: string;
  code: string;
  description: string;
  is_total: boolean | number;
  total_type: string;
  is_divident: boolean | number;
  increment_days: number;
  max_increment_days: number;
  carry_forward_days: number;
  max_days: number;
  effectiveMaxDays?: number; // Add this for calculated display value
  company_id: string;
  company_name: string | null;
  requires_approval: boolean | number;
  requires_documentation: boolean | number;
  is_active: boolean | number;
  isNewLeaveType: boolean;

  earn_days_per_month?: number;
  yos_brackets?: YearOfServiceBracket[];

  allocation_primary?: 'IMMEDIATE' | 'EARN' | 'YEAR_OF_SERVICE';
  eligibility_scope?: 'UPON_CONFIRM' | 'UNDER_PROBATION' | 'ALL_STAFF';

  // EARN policy
  accrual_frequency?: AccrualFrequency;
  accrual_rate?: number | null;
  earn_prorate_join_month?: boolean | number;

  // Renewal / cut-off
  renewal_period?: RenewalPeriod;
  expire_unused_at_period_end?: boolean | number;
  carryover_max_days?: number;
  carryover_expiry_months?: number | null;

    total_applications?: number;
  approved_applications?: number;
}

interface Company {
  id: string;
  name: string;
}


const LeaveType = () => {
  const { theme } = useTheme();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LeaveType>>({});
const [companies, setCompanies] = useState<Company[]>([]);
// Change state to store company ID
const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');

const [addForm, setAddForm] = useState<Partial<LeaveType>>({
  // existing
  leave_type_name: '',
  code: '',
  description: '',
  max_days: 0,
  is_total: true,
  total_type: 'IMMEDIATE',
  is_divident: false,
  increment_days: 0,
  max_increment_days: 0,
  carry_forward_days: 0,
  requires_approval: true,
  requires_documentation: false,
  is_active: true,
  company_id: '0',
  isNewLeaveType: true,

  // ... your existing defaults ...
  allocation_primary: 'IMMEDIATE',
  eligibility_scope: 'ALL_STAFF',

  // EARN defaults
  accrual_frequency: 'MONTHLY',
  accrual_rate: 1,                 // "Days earned per period"
  earn_prorate_join_month: true,

  // Renewal / cut-off defaults
  // For “monthly accrual + quarterly refresh (use-it-or-lose-it)”
  renewal_period: 'QUARTERLY',     // QUARTERLY reset at quarter end
  expire_unused_at_period_end: false, // keep period rollover inside quarter
  carryover_max_days: 0,              // quarter-end: forfeit all (0), or carry some if >0
  carryover_expiry_months: null,
});


  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { notification, showNotification } = useNotification();



// Simplified helper functions
// YOS helpers - Fixed TypeScript issues
const updateYosBracket = (idx: number, field: keyof YearOfServiceBracket, value: any) => {
  setAddForm((prev: any) => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    
    // Get existing row or create new one with defaults
    const existingRow = list[idx];
    const row: YearOfServiceBracket = {
      min_years: existingRow?.min_years ?? 0,
      max_years: existingRow?.max_years ?? null,
      days: existingRow?.days ?? 0,
      renewal_period: existingRow?.renewal_period ?? 'YEARLY',
      carryover_max_days: existingRow?.carryover_max_days ?? 0,
      expire_unused_at_period_end: existingRow?.expire_unused_at_period_end ?? false,
      [field]: value
    };
    
    // Auto-set carryover to 0 when use-it-or-lose-it is enabled
    if (field === 'expire_unused_at_period_end' && value === true) {
      row.carryover_max_days = 0;
    }
    
    // If carryover is set above 0, ensure use-it-or-lose-it is disabled
    if (field === 'carryover_max_days' && Number(value) > 0) {
      row.expire_unused_at_period_end = false;
    }
    
    list[idx] = row;
    return { ...prev, yos_brackets: list };
  });
};

const addYosRow = () => {
  setAddForm((prev: any) => ({
    ...prev,
    yos_brackets: [
      ...(prev.yos_brackets ?? []), 
      { 
        min_years: 0, 
        max_years: null, 
        days: 0,
        renewal_period: 'YEARLY' as RenewalPeriod,
        carryover_max_days: 0,
        expire_unused_at_period_end: false
      }
    ],
  }));
};

const removeYosRow = (idx: number) => {
  setAddForm((prev: any) => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    list.splice(idx, 1);
    return { ...prev, yos_brackets: list };
  });
};


const filterLeaveTypesByCompany = (types: LeaveType[], companyId: string) => {
  if (companyId !== 'all') {
    return types.filter(type => 
      type.company_id === companyId || 
      type.company_id?.toString() === companyId
    );
  } else {
    return types.filter(type => 
      type.company_id === '0' || 
      !type.company_id || 
      type.company_name === null
    );
  }
};

  const fetchLeaveTypes1 = useCallback(async () => {
  try {
    setIsLoading(true);
    const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    
    // Debug: Check if new fields are present
    console.log('Fetched leave types:', response.data);
    if (response.data.length > 0) {
      console.log('Sample leave type with new fields:', response.data[0]);
    }
    
    setLeaveTypes(response.data);
    //let filtered = response.data.filter((type: LeaveType) => type.company_name === null);
    //setFilteredLeaveTypes(filtered);
        // Apply current company filter
    const filtered = filterLeaveTypesByCompany(response.data, selectedCompanyId);
    setFilteredLeaveTypes(filtered);
    setError(null);
  } catch (err) {
    setError('Failed to fetch leave types');
    showNotification('Failed to fetch leave types', 'error');
    console.error('Error fetching leave types:', err);
  } finally {
    setIsLoading(false);
  }
}, [showNotification, selectedCompanyId]);//}, [showNotification]);


const fetchLeaveTypes = useCallback(async () => {
  try {
    setIsLoading(true);
    const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    
    // Enhanced debugging with allocation method analysis
    console.log('=== LEAVE TYPES API RESPONSE ===');
    
    const processedLeaveTypes = response.data.map((type: LeaveType) => {
      console.log(`Processing Leave Type:`, {
        id: type.id,
        name: type.leave_type_name,
        code: type.code,
        max_days: type.max_days,
        allocation_primary: type.allocation_primary,
        yos_brackets: type.yos_brackets,
        accrual_frequency: type.accrual_frequency,
        accrual_rate: type.accrual_rate,
        renewal_period: type.renewal_period,
        carryover_max_days: type.carryover_max_days
      });

      // Calculate effective max days based on allocation method
      let effectiveMaxDays = type.max_days || 0;
      
      if (type.allocation_primary === 'YEAR_OF_SERVICE' && type.yos_brackets && type.yos_brackets.length > 0) {
        // For YOS, use the highest days from brackets
        effectiveMaxDays = Math.max(...type.yos_brackets.map((bracket: YearOfServiceBracket) => bracket.days || 0));
      } else if (type.allocation_primary === 'EARN' && type.accrual_rate) {
        // For Accrual, calculate annual equivalent
        const rate = type.accrual_rate || 0;
        switch (type.accrual_frequency) {
          case 'MONTHLY':
            effectiveMaxDays = rate * 12;
            break;
          case 'QUARTERLY':
            effectiveMaxDays = rate * 4;
            break;
          case 'YEARLY':
            effectiveMaxDays = rate;
            break;
          default:
            effectiveMaxDays = rate * 12; // Default to monthly
        }
      }

      return {
        ...type,
        effectiveMaxDays, // Add calculated field for display
        // Ensure yos_brackets has all required fields with defaults
        yos_brackets: (type.yos_brackets || []).map((bracket: any) => ({
          min_years: bracket.min_years || 0,
          max_years: bracket.max_years ?? null,
          days: bracket.days || 0,
          renewal_period: bracket.renewal_period || 'YEARLY',
          carryover_max_days: bracket.carryover_max_days || 0,
          expire_unused_at_period_end: Boolean(bracket.expire_unused_at_period_end)
        }))
      };
    });

    console.log('Processed Leave Types:', processedLeaveTypes);
    
    setLeaveTypes(processedLeaveTypes);
    const filtered = filterLeaveTypesByCompany(processedLeaveTypes, selectedCompanyId);
    setFilteredLeaveTypes(filtered);
    setError(null);
  } catch (err) {
    setError('Failed to fetch leave types');
    showNotification('Failed to fetch leave types', 'error');
    console.error('Error fetching leave types:', err);
  } finally {
    setIsLoading(false);
  }
}, [showNotification, selectedCompanyId]);

      useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

// // Build companies as string[]
// const companies: string[] = Array.from(
//   new Set(
//     leaveTypes
//       .map(t => t.company_name)               // (string | null)[]
//       .filter((c): c is string => !!c)        // -> string[]
//   )
// ).sort();

// Add this useEffect to fetch companies



// Update the useEffect
useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/companies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      console.log('Companies API response:', response.data);
      
      // Map to proper company objects with id and name
      const companyList = response.data.map((company: any) => ({
        id: company.id.toString(),
        name: company.name
      })).sort((a: Company, b: Company) => a.name.localeCompare(b.name));
      
      setCompanies(companyList);
      
    } catch (err) {
      console.error('Error fetching companies:', err);
      // If API fails, use empty array
      setCompanies([]);
    }
  };

  fetchCompanies();
}, []);

  const handleCompanyChange1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCompany = e.target.value;
    setSelectedCompany(newCompany);

    let filtered = [...leaveTypes];
    if (newCompany !== 'all') {
      filtered = filtered.filter(type => type.company_name === newCompany);
    } else {
      filtered = filtered.filter(type => type.company_name === null);
    }
    setFilteredLeaveTypes(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };


const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const companyId = e.target.value;
  setSelectedCompanyId(companyId);

  let filtered = [...leaveTypes];
  
  if (companyId !== 'all') {
    filtered = filtered.filter(type => 
      type.company_id === companyId || 
      type.company_id?.toString() === companyId
    );
  } else {
    filtered = filtered.filter(type => 
      type.company_id === '0' || 
      !type.company_id || 
      type.company_name === null
    );
  }
  
  setFilteredLeaveTypes(filtered);
  setCurrentPage(1);
};
  // Calculate pagination
  const totalPages = Math.ceil(filteredLeaveTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredLeaveTypes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewLeaveType = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setShowViewModal(true);
  };

// Edit modal YOS helpers
const updateEditYosBracket = (idx: number, field: keyof YearOfServiceBracket, value: any) => {
  setEditForm((prev: any) => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    
    const existingRow = list[idx];
    const row: YearOfServiceBracket = {
      min_years: existingRow?.min_years ?? 0,
      max_years: existingRow?.max_years ?? null,
      days: existingRow?.days ?? 0,
      renewal_period: existingRow?.renewal_period ?? 'YEARLY',
      carryover_max_days: existingRow?.carryover_max_days ?? 0,
      expire_unused_at_period_end: existingRow?.expire_unused_at_period_end ?? false,
      [field]: value
    };
    
    // Auto-set carryover to 0 when use-it-or-lose-it is enabled
    if (field === 'expire_unused_at_period_end' && value === true) {
      row.carryover_max_days = 0;
    }
    
    // If carryover is set above 0, ensure use-it-or-lose-it is disabled
    if (field === 'carryover_max_days' && Number(value) > 0) {
      row.expire_unused_at_period_end = false;
    }
    
    list[idx] = row;
    return { ...prev, yos_brackets: list };
  });
};

const addEditYosRow = () => {
  setEditForm((prev: any) => ({
    ...prev,
    yos_brackets: [
      ...(prev.yos_brackets ?? []), 
      { 
        min_years: 0, 
        max_years: null, 
        days: 0,
        renewal_period: 'YEARLY' as RenewalPeriod,
        carryover_max_days: 0,
        expire_unused_at_period_end: false
      }
    ],
  }));
};

const removeEditYosRow = (idx: number) => {
  setEditForm((prev: any) => {
    const list: YearOfServiceBracket[] = [...(prev.yos_brackets ?? [])];
    list.splice(idx, 1);
    return { ...prev, yos_brackets: list };
  });
};

// quick setters for editForm
const setEdit = (patch: Partial<LeaveType>) =>
  setEditForm(prev => ({ ...prev, ...patch }));
const setEditNumber = (key: keyof LeaveType, val: number) =>
  setEditForm(prev => ({ ...prev, [key]: val }));


const handleEditLeaveType = (leaveType: LeaveType) => {
  setSelectedLeaveType(leaveType);

  // infer allocation_primary if not provided (from legacy flags)
  const inferredAllocation: AllocationPrimary =
    leaveType.allocation_primary ??
    (leaveType.is_total ? 'IMMEDIATE' : leaveType.is_divident ? 'EARN' : 'YEAR_OF_SERVICE');

  setEditForm({
    // existing
    leave_type_name: leaveType.leave_type_name || '',
    code: leaveType.code || '',
    description: leaveType.description || '',
    max_days: leaveType.max_days || 0,
    is_total: toBoolean(leaveType.is_total),//is_total: !!leaveType.is_total,
    total_type: leaveType.total_type || 'IMMEDIATE',
    is_divident: toBoolean(leaveType.is_divident),//is_divident: !!leaveType.is_divident,
    increment_days: leaveType.increment_days || 0,
    max_increment_days: leaveType.max_increment_days || 0,
    carry_forward_days: leaveType.carry_forward_days || 0,
    requires_approval: toBoolean(leaveType.requires_approval),//requires_approval: !!leaveType.requires_approval,
    requires_documentation: toBoolean(leaveType.requires_documentation),//requires_documentation: !!leaveType.requires_documentation,
    is_active: toBoolean(leaveType.is_active),//is_active: !!leaveType.is_active,
    company_id: leaveType.company_id || '0',

    // NEW - FIX: Convert database 0/1 to booleans
    allocation_primary: inferredAllocation,
    eligibility_scope: leaveType.eligibility_scope ?? 'ALL_STAFF',

    accrual_frequency: leaveType.accrual_frequency ?? 'MONTHLY',
    accrual_rate: leaveType.accrual_rate ?? 1,
    earn_prorate_join_month: toBoolean(leaveType.earn_prorate_join_month ?? true),//earn_prorate_join_month: leaveType.earn_prorate_join_month ?? true,

    renewal_period: leaveType.renewal_period ?? 'NONE',
    expire_unused_at_period_end: toBoolean(leaveType.expire_unused_at_period_end ?? false),//expire_unused_at_period_end: leaveType.expire_unused_at_period_end ?? false,
    carryover_max_days: leaveType.carryover_max_days ?? 0,
    carryover_expiry_months: leaveType.carryover_expiry_months ?? null,

    yos_brackets: leaveType.yos_brackets ?? [],
  });

  setShowEditModal(true);
};

const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedLeaveType) return;

  try {
    const payload = toApiPayload(editForm);
    console.log('Sending update payload:', payload); // Debug log
    
    await axios.put(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` }
    });

    setShowEditModal(false);
    showNotification('Leave type updated successfully', 'success');
    fetchLeaveTypes();
    
  } catch (err: any) {
    console.error('Error updating leave type:', err);
    showNotification('Failed to update leave type: ' + (err.response?.data?.error || 'Unknown error'), 'error');
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Handle mutual exclusivity between total and divident
      if (name === 'is_total' && checked) {
        setEditForm(prev => ({
          ...prev,
          is_total: true,
          is_divident: false
        }));
        return;
      }
      
      if (name === 'is_divident' && checked) {
        setEditForm(prev => ({
          ...prev,
          is_divident: true,
          is_total: false
        }));
        return;
      }
      
      // Handle unchecking
      setEditForm(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Handle mutual exclusivity between total and divident
      if (name === 'is_total' && checked) {
        setAddForm(prev => ({
          ...prev,
          is_total: true,
          is_divident: false
        }));
        return;
      }
      
      if (name === 'is_divident' && checked) {
        setAddForm(prev => ({
          ...prev,
          is_divident: true,
          is_total: false
        }));
        return;
      }
      
      // Handle unchecking
      setAddForm(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    setAddForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Unique company options with id + name (ignore null/global)
// const companyOptions: { id: string; name: string }[] = Array.from(
//   new Map(
//     leaveTypes
//       .filter(t => t.company_id && t.company_name) // keep only company-specific
//       .map(t => [t.company_id, t.company_name as string]) // [id, name]
//   ).entries()
// ).map(([id, name]) => ({ id, name }))
//  .sort((a, b) => a.name.localeCompare(b.name));



//   const handleAddLeaveType = () => {
//   // If page filter shows a specific company, preselect it; otherwise use '0' for Global
//   let companyId = '0';
//   if (selectedCompany !== 'all') {
//     const found = companyOptions.find(c => c.name === selectedCompany);
//     if (found) companyId = found.id;
//   }

//   setAddForm(prev => ({
//     ...prev,
//     company_id: companyId
//   }));
//   setShowAddModal(true);
// };


const handleAddLeaveType = () => {
  // If page filter shows a specific company, preselect it; otherwise use '0' for Global
 const companyId = selectedCompanyId !== 'all' ? selectedCompanyId : '0'; //let companyId = '0';
  // if (selectedCompany !== 'all') {
  //   const found = companies.find(c => c.name === selectedCompany);
  //   if (found) companyId = found.id;
  // }

  setAddForm(prev => ({
    ...prev,
    company_id: companyId
  }));
  setShowAddModal(true);
};

  const handleAddSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = toApiPayload(addForm);
    const { data: created } = await axios.post(`${API_BASE_URL}/api/v1/leave-types`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('hrms_token')}` }
    });

    // Close modal + toast
    setShowAddModal(false);
    showNotification('Leave type created successfully', 'success');

    //fetchLeaveTypes();
    // // Add to local list (so UI updates instantly)
    // setLeaveTypes(prev => {
    //   const next = [created, ...prev];
    //   // Respect current company filter
    //   const filtered = (selectedCompany !== 'all')
    //     ? next.filter(t => t.company_name === selectedCompany)
    //     : next.filter(t => t.company_name === null);
    //   setFilteredLeaveTypes(filtered);
    //   return next;
    // });
    //  setLeaveTypes(prev => {
    //   const next = [created, ...prev];
      
    //   // Apply current company filter to the updated list
    //   const filtered = filterLeaveTypesByCompany(next, selectedCompanyId);
    //   setFilteredLeaveTypes(filtered);
      
    //   return next;
    // });

    await fetchLeaveTypes();
    // Reset form
    setAddForm({
      leave_type_name: '',
      code: '',
      description: '',
      max_days: 0,
      is_total: true,
      total_type: 'IMMEDIATE',
      is_divident: false,
      increment_days: 0,
      max_increment_days: 0,
      carry_forward_days: 0,
      requires_approval: true,
      requires_documentation: false,
      is_active: true,
      company_id: '0',
      isNewLeaveType: true,

      allocation_primary: 'IMMEDIATE',
      eligibility_scope: 'ALL_STAFF',

      accrual_frequency: 'MONTHLY',
      accrual_rate: 1,
      earn_prorate_join_month: true,

      renewal_period: 'QUARTERLY',
      expire_unused_at_period_end: false,
      carryover_max_days: 0,
      carryover_expiry_months: null,

      yos_brackets: [],
    });
  } catch (err) {
    console.error('Error creating leave type:', err);
    showNotification('Failed to create leave type', 'error');
    setError('Failed to create leave type');
  }
};


  const handleDeleteLeaveType = () => {
    if (!selectedLeaveType) return;

    // Don't allow deletion of UNPAID leave type
    if (selectedLeaveType.code === 'UNPAID') {
      showNotification('Cannot delete UNPAID leave type', 'error');
      return;
    }

    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteLeaveType = async () => {
    if (!selectedLeaveType) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/leave-types/${selectedLeaveType.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
        }
      });
      
      setShowDeleteConfirmModal(false);
      setShowViewModal(false);
      showNotification('Leave type deleted successfully', 'success');

      await fetchLeaveTypes();
      // // Fetch updated leave types
      // const response = await axios.get(`${API_BASE_URL}/api/v1/leave-types`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('hrms_token')}`
      //   }
      // });
      // setLeaveTypes(response.data);

      // // Apply the current company filter
      // let filtered = [...response.data];
      // if (selectedCompany !== 'all') {
      //   filtered = filtered.filter(type => type.company_name === selectedCompany);
      // } else {
      //   filtered = filtered.filter(type => type.company_name === null);
      // }
      // setFilteredLeaveTypes(filtered);

    } catch (err: any) {
      console.error('Error deleting leave type:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete leave type';
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <>    
      {/* Notification Toast */}
      <NotificationToast
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      
      <div className={`container mx-auto p-3 sm:p-6 min-h-full ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
        <div className="mt-4 sm:mt-8 flow-root">
          <div className="mt-1">
            <div>
              {/* <div>
                <label htmlFor="company" className={`block text-sm sm:text-base font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'} mb-2`}>
                  Company
                </label>
                <div className="mt-2">
                  <select
                    id="company"
                    name="company"
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    className={`select select-bordered w-full sm:w-auto sm:max-w-xs text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                  >
                    <option value="all">Default settings</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
              </div> */}

{/* Company Filter */}
<div>
  <label htmlFor="company" className={`block text-sm sm:text-base font-medium ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'} mb-2`}>
    Company
  </label>
  <div className="mt-2">
    <select
      id="company"
      name="company"
      value={selectedCompanyId}
      onChange={handleCompanyChange}
      className={`select select-bordered w-full sm:w-auto sm:max-w-xs text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
    >
      <option value="all">Default settings</option>
      {companies.map(company => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  </div>
</div>
            </div>
          </div>
        </div>

        {/* Leave Type */}
        <div className="mt-6 sm:mt-8 flow-root">
          <div className={`card ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg`}>
            <div className="card-body p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <h2 className={`card-title flex flex-col sm:flex-row items-start sm:items-center gap-2 text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">Standard Leave Types</span>
                </h2>
                
                {(
                  <button
                    onClick={handleAddLeaveType}
                    className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-primary hover:bg-primary' : 'bg-primary-500 hover:bg-primary-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Add Leave Type</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-32 sm:h-40">
                  <div className={`loading loading-spinner loading-md sm:loading-lg ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}></div>
                </div>
              ) : error ? (
                <div className={`text-center py-6 sm:py-8 px-4 text-sm sm:text-base ${theme === 'light' ? 'text-red-500' : 'text-red-400'}`}>
                  <div className="break-words">{error}</div>
                </div>
              ) : (
                <>
                  {/* Mobile-first table design */}
                  <div className={`overflow-x-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow`}>
                    {/* Desktop table */}
                    <div className="hidden sm:block">
                      <table className="table w-full">
                        <thead>
                          <tr className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                            <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Type</th>
                            <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Description</th>
                            <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Days</th>
                            <th className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'} text-sm lg:text-base px-2 lg:px-4`}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((leaveType, index) => (
                            <tr 
                              key={leaveType.id} 
                              className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${index !== currentData.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''}`}
                            >
                              <td className={`px-2 lg:px-4 py-3`}>
                                <div className={`font-medium text-sm lg:text-base ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} break-words`}>{leaveType.leave_type_name}</div>
                              </td>
                              <td className={`px-2 lg:px-4 py-3 max-w-[200px] lg:max-w-[300px] ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-sm lg:text-base`}>
                                <div className="break-words line-clamp-3">{leaveType.description}</div>
                              </td>
{/* In your table - update the days column */}
<td className={`px-2 lg:px-4 py-3 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} text-sm lg:text-base`}>
  {leaveType.code !== 'UNPAID' ? `${leaveType.effectiveMaxDays || leaveType.max_days} days / year` : '-'}
</td>
                              <td className="text-center px-2 lg:px-4 py-3">
                                <div className="flex justify-center gap-1 lg:gap-2 min-w-[100px] lg:min-w-[120px]">
                                  {leaveType?.code !== 'UNPAID' && (
                                    <button
                                      onClick={() => handleEditLeaveType(leaveType)}
                                      className={`btn btn-xs sm:btn-sm lg:btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm`}
                                    >
                                      Edit
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleViewLeaveType(leaveType)}
                                    className={`btn btn-xs sm:btn-sm lg:btn-sm ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 text-xs sm:text-sm`}
                                  >
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile card layout */}
                    <div className="sm:hidden space-y-3">
                      {currentData.map((leaveType, index) => (
                        <div 
                          key={leaveType.id}
                          className={`${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'} rounded-lg p-4 space-y-3`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'} break-words`}>
                                {leaveType.leave_type_name}
                              </h3>
                              <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                {/* {leaveType.code !== 'UNPAID' ? `${leaveType.max_days} days / year` : 'Unpaid Leave'} */}
                                 {leaveType.code !== 'UNPAID' ? `${leaveType.effectiveMaxDays || leaveType.max_days} days / year` : '-'}
                              </p>
                            </div>
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              {leaveType?.code !== 'UNPAID' && (
                                <button
                                  onClick={() => handleEditLeaveType(leaveType)}
                                  className={`btn btn-xs ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0`}
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                onClick={() => handleViewLeaveType(leaveType)}
                                className={`btn btn-xs ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                              >
                                View
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className={`text-xs ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} line-clamp-2`}>
                              {leaveType.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {filteredLeaveTypes.length > 0 && (
                    <>
                      <div className={`mt-4 text-xs sm:text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} px-2 sm:px-0`}>
                        <span className="hidden sm:inline">Showing {startIndex + 1} to {Math.min(endIndex, filteredLeaveTypes.length)} of {filteredLeaveTypes.length} leave types</span>
                        <span className="sm:hidden">{startIndex + 1}-{Math.min(endIndex, filteredLeaveTypes.length)} of {filteredLeaveTypes.length}</span>
                      </div>
                      
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-4 sm:mt-6 px-2 sm:px-0">
                          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-0">
                            <button 
                              className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px] sm:min-w-[40px]`}
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <span className="hidden sm:inline">«</span>
                              <span className="sm:hidden">‹</span>
                            </button>
                            
                            {/* Mobile: Show only current page and adjacent pages */}
                            <div className="flex sm:hidden">
                              {currentPage > 1 && (
                                <button 
                                  className={`btn btn-xs ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px]`}
                                  onClick={() => handlePageChange(currentPage - 1)}
                                >
                                  {currentPage - 1}
                                </button>
                              )}
                              <button 
                                className={`btn btn-xs bg-blue-600 text-white min-w-[32px]`}
                              >
                                {currentPage}
                              </button>
                              {currentPage < totalPages && (
                                <button 
                                  className={`btn btn-xs ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px]`}
                                  onClick={() => handlePageChange(currentPage + 1)}
                                >
                                  {currentPage + 1}
                                </button>
                              )}
                            </div>
                            
                            {/* Desktop: Show all pages */}
                            <div className="hidden sm:flex">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button 
                                  key={page}
                                  className={`btn btn-sm ${currentPage === page ? 
                                    `${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}` : 
                                    `${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`
                                  } min-w-[40px]`}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>
                            
                            <button 
                              className={`btn btn-xs sm:btn-sm ${theme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'} min-w-[32px] sm:min-w-[40px]`}
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <span className="hidden sm:inline">»</span>
                              <span className="sm:hidden">›</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

{/* View Modal */}
<dialog
  id="view_modal"
  className={`modal ${showViewModal ? 'modal-open' : ''}`}
>
  <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
    {/* Modal Header */}
    <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}`} style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="flex items-center gap-4 relative z-10">
        {/* Icon Container */}
        <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25' : 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-400/25'} transform hover:scale-105 transition-all duration-300`}>
          <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`}></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
        </div>
        
        {/* Title Section */}
        <div className="flex flex-col">
          <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
            Leave Type Details
          </h3>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
            View comprehensive leave configuration
          </p>
        </div>
      </div>
      
      {/* Close Button */}
      <button
        className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
        onClick={() => setShowViewModal(false)}
      >
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`}></div>
        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Modal Content - Scrollable */}
    <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
      <div className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1">
            <label className="label p-0">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Leave Type Name</span>
            </label>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>{selectedLeaveType?.leave_type_name}</p>
          </div>
          <div className="space-y-1">
            <label className="label p-0">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Code</span>
            </label>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>{selectedLeaveType?.code}</p>
          </div>
{selectedLeaveType?.code !== 'UNPAID' && (
  <div className="space-y-1">
    <label className="label p-0">
      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Maximum Days</span>
    </label>
    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>
      {selectedLeaveType?.effectiveMaxDays || selectedLeaveType?.max_days || 0} days / year
      {selectedLeaveType?.effectiveMaxDays !== selectedLeaveType?.max_days && selectedLeaveType?.max_days && (
        <span className={`text-xs ml-2 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          (calculated from allocation method)
        </span>
      )}
    </p>
  </div>
)}
          <div className="space-y-1">
            <label className="label p-0">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Company</span>
            </label>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>
              {selectedLeaveType?.company_name || 'Global'}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="label p-0">
            <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Description</span>
          </label>
          <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base break-words`}>
            {selectedLeaveType?.description || 'No description provided'}
          </p>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1">
            <label className="label p-0">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Requires Documentation</span>
            </label>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>
              {selectedLeaveType?.requires_documentation ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="space-y-1">
            <label className="label p-0">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Status</span>
            </label>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>
              {selectedLeaveType?.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
        
        {/* Allocation Configuration - Only show for non-UNPAID leave types */}
        {selectedLeaveType?.code !== 'UNPAID' && (
          <div className={`border ${theme === 'light' ? 'border-slate-300' : 'border-slate-600'} rounded-lg`}>
            <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-700 text-slate-100'} px-3 sm:px-4 py-2 rounded-t-lg`}>
              Allocation Configuration
            </h4>
            <div className="p-3 sm:p-4 space-y-4">
              {/* Allocation Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="label p-0">
                    <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Allocation Method</span>
                  </label>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>
                    {selectedLeaveType?.allocation_primary === 'YEAR_OF_SERVICE' && 'Year of Service'}
                    {selectedLeaveType?.allocation_primary === 'EARN' && 'Accrual'}
                    {selectedLeaveType?.allocation_primary === 'IMMEDIATE' && 'Immediate'}
                    {!selectedLeaveType?.allocation_primary && 'Not specified'}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="label p-0">
                    <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Eligibility Scope</span>
                  </label>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-slate-100'} text-sm sm:text-base`}>
                    {selectedLeaveType?.eligibility_scope === 'ALL_STAFF' && 'All Staff'}
                    {selectedLeaveType?.eligibility_scope === 'UPON_CONFIRM' && 'Upon Confirmation'}
                    {selectedLeaveType?.eligibility_scope === 'UNDER_PROBATION' && 'Under Probation'}
                    {!selectedLeaveType?.eligibility_scope && 'All Staff'}
                  </p>
                </div>
              </div>

              {/* Year of Service Allocation Details */}
{/* Year of Service Allocation Details */}
{selectedLeaveType?.allocation_primary === 'YEAR_OF_SERVICE' && selectedLeaveType?.yos_brackets && selectedLeaveType.yos_brackets.length > 0 && (
  <div className="space-y-3">
    <label className="label p-0">
      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Service-Based Entitlements</span>
    </label>
    <div className="space-y-2">
      {selectedLeaveType.yos_brackets.map((bracket, index) => (
        <div key={index} className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex-1">
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                {bracket.min_years} - {bracket.max_years ?? '∞'} years: 
                <span className="ml-2 font-bold">{bracket.days} days</span>
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {bracket.renewal_period && (
                <span className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'}`}>
                  Renews: {bracket.renewal_period.toLowerCase()}
                </span>
              )}
              {/* FIX: Add null check for carryover_max_days */}
              {(bracket.carryover_max_days ?? 0) > 0 && (
                <span className={`ml-2 px-2 py-1 rounded ${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'}`}>
                  Carryover: {bracket.carryover_max_days} days
                </span>
              )}
              {bracket.expire_unused_at_period_end && (
                <span className={`ml-2 px-2 py-1 rounded ${theme === 'light' ? 'bg-orange-100 text-orange-800' : 'bg-orange-900 text-orange-200'}`}>
                  Use-it-or-lose-it
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

              {/* Accrual Allocation Details */}
              {selectedLeaveType?.allocation_primary === 'EARN' && (
                <div className="space-y-3">
                  <label className="label p-0">
                    <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Accrual Details</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Accrual Frequency</span>
                      <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                        {selectedLeaveType?.accrual_frequency ? selectedLeaveType.accrual_frequency.toLowerCase() : 'Not specified'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Accrual Rate</span>
                      <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                        {selectedLeaveType?.accrual_rate || 0} days per {selectedLeaveType?.accrual_frequency ? selectedLeaveType.accrual_frequency.toLowerCase().slice(0, -2) : 'period'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Prorate Join Month</span>
                      <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                        {selectedLeaveType?.earn_prorate_join_month ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  {/* Renewal & Carryover for Accrual */}
{/* Renewal & Carryover for Accrual */}
{(selectedLeaveType?.renewal_period || selectedLeaveType?.carryover_max_days) && (
  <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
    <label className="label p-0">
      <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Renewal & Carryover</span>
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
      {selectedLeaveType?.renewal_period && (
        <div className="space-y-1">
          <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Renewal Period</span>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
            {selectedLeaveType.renewal_period.toLowerCase()}
          </p>
        </div>
      )}
      {/* FIX: Add null check for carryover_max_days */}
      {(selectedLeaveType?.carryover_max_days ?? 0) > 0 && (
        <div className="space-y-1">
          <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Max Carryover</span>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
            {selectedLeaveType.carryover_max_days} days
          </p>
        </div>
      )}
      {selectedLeaveType?.expire_unused_at_period_end && (
        <div className="space-y-1">
          <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Carryover Policy</span>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
            Use-it-or-lose-it
          </p>
        </div>
      )}
    </div>
  </div>
)}
                </div>
              )}

              {/* Legacy Allocation Display (for backward compatibility) */}
              {!selectedLeaveType?.allocation_primary && (
                <div className="space-y-3">
                  <label className="label p-0">
                    <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Legacy Allocation</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Upfront Allocation</span>
                      <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                        {selectedLeaveType?.is_total ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Gradual Accrual</span>
                      <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                        {selectedLeaveType?.is_divident ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Modal Footer */}
    <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex justify-end items-center gap-3 mt-auto z-10`}>
      {/* Delete Button - Only show if not UNPAID leave type */}
      {selectedLeaveType?.code !== 'UNPAID' && (
        <button
          className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
          onClick={handleDeleteLeaveType}
        >
          <BsTrash className="w-3 h-3" />
          Delete
        </button>
      )}
      
      {/* Edit Button */}
      {selectedLeaveType?.code !== 'UNPAID' && (
        <button
          className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm flex items-center gap-2`}
          onClick={() => {
            setShowViewModal(false);
            handleEditLeaveType(selectedLeaveType!);
          }}
        >
          <BsPencil className="w-3 h-3" />
          Edit
        </button>
      )}
      
      {/* Close Button */}
      <button
        className={`btn btn-sm sm:btn-md ${theme === 'light' ? 'bg-slate-600 hover:bg-slate-700' : 'bg-slate-500 hover:bg-slate-600'} text-white border-0 text-xs sm:text-sm`}
        onClick={() => setShowViewModal(false)}
      >
        Close
      </button>
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button onClick={() => setShowViewModal(false)}>close</button>
  </form>
</dialog>

{/* Edit Modal */}
<dialog id="edit_modal" className={`modal ${showEditModal ? 'modal-open' : ''}`}>
  <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
    {/* Modal Header */}
    <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
      <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25' : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/25'} transform hover:scale-105 transition-all duration-300`}>
          <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`} />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
        </div>
        
        <div className="flex flex-col">
          <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
            Edit Leave Type
          </h3>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
            Modify leave configuration settings
          </p>
        </div>
      </div>

      <button
        className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
        onClick={() => setShowEditModal(false)}
      >
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`} />
        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Modal Content - Scrollable */}
    <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
      <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Leave Type Name <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              name="leave_type_name"
              value={editForm.leave_type_name ?? ''}
              onChange={handleInputChange}
              className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              required
            />
          </div>

          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Code <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              name="code"
              value={editForm.code ?? ''}
              onChange={handleInputChange}
              className={`input input-bordered w-full text-sm sm:text-base ${editForm.code === 'UNPAID'
                ? (theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100')
                : (theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100')
              }`}
              required
              readOnly={editForm.code === 'UNPAID'}
            />
          </div>

          {/* Company Selection */}
          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Company
              </span>
            </label>
            <input
              type="text"
              value={selectedLeaveType?.company_name || 'Global'}
              className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-gray-50 border-slate-300 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-100'}`}
              readOnly
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label p-0 pb-1">
            <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              Description <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            name="description"
            value={editForm.description ?? ''}
            onChange={handleInputChange}
            rows={3}
            className={`textarea textarea-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
            required
          />
        </div>

        {/* Requirements */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            Requirements
          </h4>
          
          <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
            <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
              <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Requires Documentation
              </span>
              <input
                type="checkbox"
                name="requires_documentation"
                checked={!!editForm.requires_documentation}
                onChange={handleInputChange}
                className="checkbox checkbox-sm sm:checkbox-md checkbox-primary"
              />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
              <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Active
              </span>
              <input
                type="checkbox"
                name="is_active"
                checked={!!editForm.is_active}
                onChange={handleInputChange}
                className="checkbox checkbox-sm sm:checkbox-md checkbox-primary"
              />
            </div>
          </div>
        </div>

        {/* ===== Allocation & Eligibility ===== */}
        {editForm.code !== 'UNPAID' && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              Allocation & Eligibility
            </h4>

            {/* Primary Allocation */}
            <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Allocation Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { val: 'YEAR_OF_SERVICE', label: 'Year of Service', description: 'Full allocation based on service years' },
                  { val: 'EARN', label: 'Accrual', description: 'Gradual earning over time' },
                ].map((opt) => (
                  <label key={opt.val} className={`flex items-start gap-2 p-3 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'} ${(editForm.allocation_primary ?? 'YEAR_OF_SERVICE') === opt.val ? 'ring-2 ring-primary' : ''}`}>
                    <input
                      type="radio"
                      name="allocation_primary"
                      value={opt.val}
                      checked={(editForm.allocation_primary ?? 'YEAR_OF_SERVICE') === opt.val}
                      onChange={(e) => setEdit({ allocation_primary: e.target.value as AllocationPrimary })}
                      className="radio radio-primary radio-sm mt-0.5"
                    />
                    <div className="flex-1">
                      <span className={`text-xs sm:text-sm font-medium block ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                        {opt.label}
                      </span>
                      <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 block`}>
                        {opt.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Year of Service Configuration */}
              {editForm.allocation_primary === 'YEAR_OF_SERVICE' && (
                <div className="mt-4 space-y-4">
                  {/* Service Brackets */}
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Service-Based Entitlement
                    </label>
                    
                    <div className="space-y-3">
                      {(editForm.yos_brackets ?? []).map((row, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-600 border-slate-500'}`}>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                Min Years
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={row.min_years}
                                onChange={(e) => updateEditYosBracket(idx, 'min_years', Number(e.target.value))}
                                className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                              />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                Max Years (blank = ∞)
                              </label>
                              <input
                                type="number"
                                min={0}
                                placeholder="∞"
                                value={row.max_years ?? ''}
                                onChange={(e) => updateEditYosBracket(idx, 'max_years', e.target.value ? Number(e.target.value) : null)}
                                className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                              />
                            </div>
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                Days Allocation
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={row.days}
                                onChange={(e) => updateEditYosBracket(idx, 'days', Number(e.target.value))}
                                className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                              />
                            </div>
                          </div>

                          {/* Renewal & Carryover Settings for this bracket */}
                          <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                            <h6 className={`text-xs font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                              Renewal & Carryover Settings for this bracket
                            </h6>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                  Renewal Period
                                </label>
                                <select
                                  value={row.renewal_period ?? 'YEARLY'}
                                  onChange={(e) => updateEditYosBracket(idx, 'renewal_period', e.target.value)}
                                  className={`select select-bordered select-sm w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                                >
                                  <option value="YEARLY">Yearly</option>
                                  <option value="QUARTERLY">Quarterly</option>
                                  <option value="MONTHLY">Monthly</option>
                                  <option value="NONE">No automatic renewal</option>
                                </select>
                              </div>

                              <div>
                                <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                  Max Carryover Days
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  value={row.carryover_max_days ?? 0}
                                  onChange={(e) => updateEditYosBracket(idx, 'carryover_max_days', Number(e.target.value))}
                                  className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                                  placeholder="Days that can carry over"
                                  disabled={!!row.expire_unused_at_period_end}
                                />
                              </div>
                            </div>

                            <div className="mt-2">
                              <label className={`flex items-center gap-2 p-1 rounded-md ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
                                <input
                                  type="checkbox"
                                  checked={!!row.expire_unused_at_period_end}
                                  onChange={(e) => {
                                    updateEditYosBracket(idx, 'expire_unused_at_period_end', e.target.checked);
                                    if (e.target.checked) {
                                      updateEditYosBracket(idx, 'carryover_max_days', 0);
                                    }
                                  }}
                                  className="checkbox checkbox-primary checkbox-xs"
                                />
                                <span className={`text-xs ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                                  Use-it-or-lose-it (no carryover allowed)
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => removeEditYosRow(idx)}
                              className="btn btn-xs btn-ghost text-red-600"
                            >
                              Remove Bracket
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={addEditYosRow}
                      className={`btn btn-sm btn-outline mt-2 ${theme === 'light' ? '' : 'btn-ghost'}`}
                    >
                      Add Service Bracket
                    </button>
                  </div>
                </div>
              )}

              {/* Earn (Accrual) Configuration */}
              {editForm.allocation_primary === 'EARN' && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        Accrual Frequency
                      </label>
                      <select
                        name="accrual_frequency"
                        value={editForm.accrual_frequency ?? 'MONTHLY'}
                        onChange={(e) => setEdit({ accrual_frequency: e.target.value as AccrualFrequency })}
                        className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      >
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        {editForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
                         editForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        name="accrual_rate"
                        value={editForm.accrual_rate ?? 0}
                        onChange={(e) => setEditNumber('accrual_rate', Number(e.target.value))}
                        className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      />
                    </div>

                    <div className="flex items-end">
                      <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}`}>
                        <input
                          type="checkbox"
                          name="earn_prorate_join_month"
                          checked={!!editForm.earn_prorate_join_month}
                          onChange={(e) => setEdit({ earn_prorate_join_month: e.target.checked })}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                          Prorate for new joiners
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Renewal & Carryover Settings for Earn Type */}
                  <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                    <h5 className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Renewal & Carryover Settings
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Renewal Period
                        </label>
                        <select
                          value={editForm.renewal_period ?? 'YEARLY'}
                          onChange={(e) => setEdit({ renewal_period: e.target.value as RenewalPeriod })}
                          className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                        >
                          <option value="YEARLY">Yearly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="NONE">No automatic renewal</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                          Max Carryover Days
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={editForm.carryover_max_days ?? 0}
                          onChange={(e) => setEditNumber('carryover_max_days', Number(e.target.value))}
                          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                          placeholder="Days that can carry over"
                          disabled={!!editForm.expire_unused_at_period_end}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
                        <input
                          type="checkbox"
                          checked={!!editForm.expire_unused_at_period_end}
                          onChange={(e) => setEdit({ 
                            expire_unused_at_period_end: e.target.checked,
                            carryover_max_days: e.target.checked ? 0 : editForm.carryover_max_days
                          })}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                          Use-it-or-lose-it (no carryover allowed)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Eligibility Scope */}
            <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Eligibility Scope
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { val: 'ALL_STAFF', label: 'All Staff', description: 'Available to all employees' },
                  { val: 'UPON_CONFIRM', label: 'Upon Confirmation', description: 'After probation period' },
                  { val: 'UNDER_PROBATION', label: 'Under Probation', description: 'During probation only' },
                ].map((opt) => (
                  <label key={opt.val} className={`flex items-start gap-2 p-3 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'} ${(editForm.eligibility_scope ?? 'ALL_STAFF') === opt.val ? 'ring-2 ring-primary' : ''}`}>
                    <input
                      type="radio"
                      name="eligibility_scope"
                      value={opt.val}
                      checked={(editForm.eligibility_scope ?? 'ALL_STAFF') === opt.val}
                      onChange={(e) => setEdit({ eligibility_scope: e.target.value as EligibilityScope })}
                      className="radio radio-primary radio-sm mt-0.5"
                    />
                    <div className="flex-1">
                      <span className={`text-xs sm:text-sm font-medium block ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                        {opt.label}
                      </span>
                      <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 block`}>
                        {opt.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>

    {/* Modal Footer */}
    <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex flex-col sm:flex-row justify-end gap-2 mt-auto z-10`}>
      <button
        type="button"
        onClick={() => setShowEditModal(false)}
        className={`btn btn-sm sm:btn-md btn-ghost w-full sm:w-auto ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'} text-xs sm:text-sm order-2 sm:order-1`}
      >
        Cancel
      </button>
      {selectedLeaveType?.code !== 'UNPAID' && (
        <button
          type="submit"
          onClick={handleEditSubmit}
          className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white border-0 text-xs sm:text-sm order-1 sm:order-2`}
        >
          Save Changes
        </button>
      )}
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button onClick={() => setShowEditModal(false)}>close</button>
  </form>
</dialog>


{/* Add Modal */}
<dialog id="add_modal" className={`modal ${showAddModal ? 'modal-open' : ''}`}>
  <div className={`modal-box w-[95%] sm:w-11/12 max-w-5xl p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto h-auto max-h-[90vh] flex flex-col`}>
    {/* Modal Header */}
    <div className={`${theme === 'light' ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200/60' : 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/60'} px-4 sm:px-8 py-4 sm:py-6 border-b backdrop-blur-sm flex justify-between items-center relative overflow-hidden`}>
      <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-green-500' : 'bg-green-400'}`} style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={`relative p-3 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25' : 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-400/25'} transform hover:scale-105 transition-all duration-300`}>
          <div className={`absolute inset-0 rounded-2xl ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm`} />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${theme === 'light' ? 'bg-green-500' : 'bg-green-400'}`} />
        </div>
        
        <div className="flex flex-col">
          <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>
            Add New Leave Type
          </h3>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 font-medium`}>
            Create a new leave configuration
          </p>
        </div>
      </div>
      
      <button
        className={`relative group p-2 rounded-xl transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'text-slate-400 hover:text-slate-600 hover:bg-white/80 hover:shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-600/80 hover:shadow-lg'} backdrop-blur-sm border ${theme === 'light' ? 'border-transparent hover:border-slate-200' : 'border-transparent hover:border-slate-500'}`}
        onClick={() => setShowAddModal(false)}
      >
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20'}`} />
        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Modal Content - Scrollable */}
    <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
      <form onSubmit={handleAddSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Leave Type Name <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              name="leave_type_name"
              value={addForm.leave_type_name ?? ''}
              onChange={handleAddInputChange}
              className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              placeholder="e.g., Annual Leave"
              required
            />
          </div>

          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Code <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              name="code"
              value={addForm.code ?? ''}
              onChange={handleAddInputChange}
              className={`input input-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
              placeholder="e.g., AL"
              required
            />
          </div>

          {/* Company Selection */}
          <div>
            <label className="label p-0 pb-1">
              <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Company
              </span>
            </label>
            <select
              name="company_id"
              value={addForm.company_id ?? '0'}
              onChange={(e) => setAddForm(p => ({ ...p, company_id: e.target.value }))}
              className={`select select-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
            >
              <option value="0">Default settings (Global)</option>
              {companies.map(company => (
                <option key={`add-company-${company.id}`} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label p-0 pb-1">
            <span className={`label-text font-semibold text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              Description <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            name="description"
            value={addForm.description ?? ''}
            onChange={handleAddInputChange}
            rows={3}
            className={`textarea textarea-bordered w-full text-sm sm:text-base ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
            placeholder="Describe the leave type..."
            required
          />
        </div>

        {/* Requirements */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            Requirements
          </h4>
          
          <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
            <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
              <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Requires Documentation
              </span>
              <input
                type="checkbox"
                name="requires_documentation"
                checked={!!addForm.requires_documentation}
                onChange={handleAddInputChange}
                className="checkbox checkbox-sm sm:checkbox-md checkbox-primary"
              />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-700'}`}>
              <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Active
              </span>
              <input
                type="checkbox"
                name="is_active"
                checked={!!addForm.is_active}
                onChange={handleAddInputChange}
                className="checkbox checkbox-sm sm:checkbox-md checkbox-primary"
              />
            </div>
          </div>
        </div>

        {/* ===== Allocation & Eligibility ===== */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            Allocation & Eligibility
          </h4>

          {/* Primary Allocation */}
          <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
            <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              Allocation Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { val: 'YEAR_OF_SERVICE', label: 'Year of Service', description: 'Full allocation based on service years' },
                { val: 'EARN', label: 'Accrual', description: 'Gradual earning over time' },
              ].map((opt) => (
                <label key={opt.val} className={`flex items-start gap-2 p-3 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'} ${(addForm.allocation_primary ?? 'YEAR_OF_SERVICE') === opt.val ? 'ring-2 ring-primary' : ''}`}>
                  <input
                    type="radio"
                    name="allocation_primary"
                    value={opt.val}
                    checked={(addForm.allocation_primary ?? 'YEAR_OF_SERVICE') === opt.val}
                    onChange={(e) => setAddForm(p => ({ ...p, allocation_primary: e.target.value as AllocationPrimary }))}
                    className="radio radio-primary radio-sm mt-0.5"
                  />
                  <div className="flex-1">
                    <span className={`text-xs sm:text-sm font-medium block ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                      {opt.label}
                    </span>
                    <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 block`}>
                      {opt.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Year of Service Configuration */}
            {addForm.allocation_primary === 'YEAR_OF_SERVICE' && (
              <div className="mt-4 space-y-4">
                {/* Service Brackets */}
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Service-Based Entitlement
                  </label>
                  
                  <div className="space-y-3">
                    {(addForm.yos_brackets ?? []).map((row, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-600 border-slate-500'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                              Min Years
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={row.min_years}
                              onChange={(e) => updateYosBracket(idx, 'min_years', Number(e.target.value))}
                              className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                              Max Years (blank = ∞)
                            </label>
                            <input
                              type="number"
                              min={0}
                              placeholder="∞"
                              value={row.max_years ?? ''}
                              onChange={(e) => updateYosBracket(idx, 'max_years', e.target.value ? Number(e.target.value) : null)}
                              className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                              Days Allocation
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={row.days}
                              onChange={(e) => updateYosBracket(idx, 'days', Number(e.target.value))}
                              className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                            />
                          </div>
                        </div>

                        {/* Renewal & Carryover Settings for this bracket */}
                        <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                          <h6 className={`text-xs font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                            Renewal & Carryover Settings for this bracket
                          </h6>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                Renewal Period
                              </label>
                              <select
                                value={row.renewal_period ?? 'YEARLY'}
                                onChange={(e) => updateYosBracket(idx, 'renewal_period', e.target.value)}
                                className={`select select-bordered select-sm w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                              >
                                <option value="YEARLY">Yearly</option>
                                <option value="QUARTERLY">Quarterly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="NONE">No automatic renewal</option>
                              </select>
                            </div>

                            <div>
                              <label className={`block text-xs font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                Max Carryover Days
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={row.carryover_max_days ?? 0}
                                onChange={(e) => updateYosBracket(idx, 'carryover_max_days', Number(e.target.value))}
                                className={`input input-bordered input-sm w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                                placeholder="Days that can carry over"
                                disabled={!!row.expire_unused_at_period_end}
                              />
                            </div>
                          </div>

                          <div className="mt-2">
                            <label className={`flex items-center gap-2 p-1 rounded-md ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
                              <input
                                type="checkbox"
                                checked={!!row.expire_unused_at_period_end}
                                onChange={(e) => {
                                  updateYosBracket(idx, 'expire_unused_at_period_end', e.target.checked);
                                  if (e.target.checked) {
                                    updateYosBracket(idx, 'carryover_max_days', 0);
                                  }
                                }}
                                className="checkbox checkbox-primary checkbox-xs"
                              />
                              <span className={`text-xs ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                                Use-it-or-lose-it (no carryover allowed)
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={() => removeYosRow(idx)}
                            className="btn btn-xs btn-ghost text-red-600"
                          >
                            Remove Bracket
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={addYosRow}
                    className={`btn btn-sm btn-outline mt-2 ${theme === 'light' ? '' : 'btn-ghost'}`}
                  >
                    Add Service Bracket
                  </button>
                </div>
              </div>
            )}

            {/* Earn (Accrual) Configuration */}
            {addForm.allocation_primary === 'EARN' && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Accrual Frequency
                    </label>
                    <select
                      name="accrual_frequency"
                      value={addForm.accrual_frequency ?? 'MONTHLY'}
                      onChange={(e) => setAddForm(p => ({ ...p, accrual_frequency: e.target.value as AccrualFrequency }))}
                      className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      {addForm.accrual_frequency === 'QUARTERLY' ? 'Days per Quarter' :
                       addForm.accrual_frequency === 'YEARLY' ? 'Days per Year' : 'Days per Month'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      name="accrual_rate"
                      value={addForm.accrual_rate ?? 0}
                      onChange={(e) => setAddForm(p => ({ ...p, accrual_rate: Number(e.target.value) }))}
                      className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                    />
                  </div>

                  <div className="flex items-end">
                    <label className={`flex items-center gap-2 p-2 rounded-md w-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'}`}>
                      <input
                        type="checkbox"
                        name="earn_prorate_join_month"
                        checked={!!addForm.earn_prorate_join_month}
                        onChange={(e) => setAddForm(p => ({ ...p, earn_prorate_join_month: e.target.checked }))}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                        Prorate for new joiners
                      </span>
                    </label>
                  </div>
                </div>

                {/* Renewal & Carryover Settings for Earn Type */}
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700 border border-slate-600'}`}>
                  <h5 className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                    Renewal & Carryover Settings
                  </h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        Renewal Period
                      </label>
                      <select
                        value={addForm.renewal_period ?? 'YEARLY'}
                        onChange={(e) => setAddForm(p => ({ ...p, renewal_period: e.target.value as RenewalPeriod }))}
                        className={`select select-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                      >
                        <option value="YEARLY">Yearly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="NONE">No automatic renewal</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        Max Carryover Days
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={addForm.carryover_max_days ?? 0}
                        onChange={(e) => setAddForm(p => ({ ...p, carryover_max_days: Number(e.target.value) }))}
                        className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
                        placeholder="Days that can carry over"
                        disabled={!!addForm.expire_unused_at_period_end}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className={`flex items-center gap-2 p-2 rounded-md ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`}>
                      <input
                        type="checkbox"
                        checked={!!addForm.expire_unused_at_period_end}
                        onChange={(e) => setAddForm(p => ({ 
                          ...p, 
                          expire_unused_at_period_end: e.target.checked,
                          carryover_max_days: e.target.checked ? 0 : p.carryover_max_days
                        }))}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                        Use-it-or-lose-it (no carryover allowed)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Eligibility Scope */}
          <div className={`p-3 rounded-lg border ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-600 bg-slate-700'}`}>
            <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
              Eligibility Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 'ALL_STAFF', label: 'All Staff', description: 'Available to all employees' },
                { val: 'UPON_CONFIRM', label: 'Upon Confirmation', description: 'After probation period' },
                { val: 'UNDER_PROBATION', label: 'Under Probation', description: 'During probation only' },
              ].map((opt) => (
                <label key={opt.val} className={`flex items-start gap-2 p-3 rounded-md cursor-pointer ${theme === 'light' ? 'bg-white border border-slate-200' : 'bg-slate-600 border border-slate-500'} ${(addForm.eligibility_scope ?? 'ALL_STAFF') === opt.val ? 'ring-2 ring-primary' : ''}`}>
                  <input
                    type="radio"
                    name="eligibility_scope"
                    value={opt.val}
                    checked={(addForm.eligibility_scope ?? 'ALL_STAFF') === opt.val}
                    onChange={(e) => setAddForm(p => ({ ...p, eligibility_scope: e.target.value as EligibilityScope }))}
                    className="radio radio-primary radio-sm mt-0.5"
                  />
                  <div className="flex-1">
                    <span className={`text-xs sm:text-sm font-medium block ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                      {opt.label}
                    </span>
                    <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-0.5 block`}>
                      {opt.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>

    {/* Modal Footer */}
    <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-3 sm:px-6 py-2 sm:py-3 border-t flex flex-col sm:flex-row justify-end gap-2 mt-auto z-10`}>
      <button
        type="button"
        onClick={() => setShowAddModal(false)}
        className={`btn btn-sm sm:btn-md btn-ghost w-full sm:w-auto ${theme === 'light' ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-600'} text-xs sm:text-sm order-2 sm:order-1`}
      >
        Cancel
      </button>
      <button
        type="submit"
        onClick={handleAddSubmit}
        className={`btn btn-sm sm:btn-md w-full sm:w-auto ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white border-0 text-xs sm:text-sm order-1 sm:order-2`}
      >
        Create Leave Type
      </button>
    </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button onClick={() => setShowAddModal(false)}>close</button>
  </form>
</dialog>


        {/* Delete Confirmation Modal */}
        <dialog id="delete_confirm_modal" className={`modal ${showDeleteConfirmModal ? 'modal-open' : ''}`}>
          <div className={`modal-box w-[95%] sm:w-11/12 max-w-md p-0 overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-lg mx-auto`}>
            {/* Modal Header */}
            <div className={`${theme === 'light' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700'} px-4 sm:px-6 py-4 border-b backdrop-blur-sm flex items-center gap-3`}>
              {/* Icon Container */}
              <div className={`relative p-2 rounded-xl ${theme === 'light' ? 'bg-red-500 shadow-lg shadow-red-500/25' : 'bg-red-400 shadow-lg shadow-red-400/25'}`}>
                <BsTrash className="h-4 w-4 text-white" />
              </div>
              
              {/* Title */}
              <div>
                <h3 className={`font-bold text-lg ${theme === 'light' ? 'text-red-900' : 'text-red-100'}`}>
                  Delete Leave Type
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-red-700' : 'text-red-300'} mt-0.5`}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <p className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Are you sure you want to delete the leave type <strong>"{selectedLeaveType?.leave_type_name}"</strong>?
                </p>
                
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-700'}`}>
                  <p className={`text-xs ${theme === 'light' ? 'text-red-700' : 'text-red-300'}`}>
                    <strong>Warning:</strong> This will permanently delete the leave type and all associated configurations. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-700 border-slate-600'} px-4 sm:px-6 py-3 border-t flex justify-end gap-3`}>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'btn-ghost text-slate-600 hover:bg-slate-200' : 'btn-ghost text-slate-400 hover:bg-slate-600'}`}
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white border-0`}
                onClick={confirmDeleteLeaveType}
              >
                Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowDeleteConfirmModal(false)}>close</button>
          </form>
        </dialog>


        
      </div>
    </>
  )
}

export default LeaveType
