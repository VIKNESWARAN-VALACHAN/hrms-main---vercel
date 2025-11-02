import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../../../config';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { 
  ChevronRight, 
  Download, 
  Upload, 
  Save, 
  Eye, 
  MessageSquare, 
  Pin, 
  Undo2, 
  Redo2,
  Check,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  Users,
  Calendar,
  DollarSign,
  Edit3,
  Filter,
  ArrowUpDown,
  Settings,
  Trash2,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  CheckCircle
} from 'lucide-react';

interface PayslipItem {
  label: string;
  amount: number;
  type: 'Earning' | 'Deduction' | 'Statutory' | 'Claim';
}

interface EmployerContribution {
  label: string;
  amount: number;
  type: 'Employer Contribution';
}

interface PayrollRow {
  employee_id: number;
  employee_name: string;
  employee_no: string;
  position: string;
  department_name: string;
  employment_type: string;
  company_name: string;
  currency: string;
  gross_salary: number;
  net_salary: number;
  payslip_items: PayslipItem[];
  employer_contributions: EmployerContribution[];
  // Dynamic fields will be populated from payslip_items
  [key: string]: any;
}

type ColumnType = {
  key: string;
  label: string;
  width: number;
  pinnable?: boolean;
  editable: boolean;
  filterable: boolean;
  type?: 'currency';
};

interface UndoRedoAction {
  type: string;
  rowIndex?: number;
  columnKey?: string;
  oldValue?: any;
  newValue?: any;
  oldOrder?: any[];
  newOrder?: any[];
}

interface CellEdit {
  oldValue: any;
  newValue: any;
}

interface CurrentCell {
  rowIndex: number;
  columnKey: string;
  value?: any;
  newValue?: any;
  rowId?: number | string;
}

interface ColumnFilter {
  key: string;
  value: string;
}

interface ImportComment {
  field: string;
  comment: string;
}

interface ChangeItem {
  field: string;
  current: string;
  imported: string;
  difference: string;
}

interface ImportChange {
  employee_name: string;
  employee_no: string;
  changes: ChangeItem[];
  comments: ImportComment[];
}

interface PayslipAdjustment {
  payroll_id: number;
  label: string;
  amount: number;
  type: 'Earning' | 'Deduction' | 'Statutory' | 'Employer Contribution';
  operation?: 'add' | 'update' | 'delete';
}


interface Assignment {
  id: number;
  company_name: string;
  company_id: number; // Add this
  pay_interval: string;
}

const PayrollGenerationWizard = () => {

  //step 2 adjustment
  const [showAdjustmentModal, setShowAdjustmentModal] = useState<boolean>(false);
  const [currentAdjustment, setCurrentAdjustment] = useState<PayslipAdjustment | null>(null);
  const [selectedRowForAdjustment, setSelectedRowForAdjustment] = useState<PayrollRow | null>(null);

const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  //new
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [author, setAuthor] = useState('Admin');
  const step3FileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Step 1 state
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [claimType, setClaimType] = useState<string>('all');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  
  // Step 2 state
  const [payrollData, setPayrollData] = useState<PayrollRow[]>([]);
  const [editedCells, setEditedCells] = useState<Map<string, CellEdit>>(new Map());
  const [comments, setComments] = useState<Map<string, string>>(new Map());
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
  //const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [draggedRow, setDraggedRow] = useState<number | null>(null);
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set(['employee_name']));
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [undoStack, setUndoStack] = useState<UndoRedoAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoRedoAction[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<number | string>>(new Set());
  //const [unsavedChanges, setUnsavedChanges] = useState<Set<number>>(new Set());
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [currentCell, setCurrentCell] = useState<CurrentCell | null>(null);
  const [requireCommentOnEdit, setRequireCommentOnEdit] = useState<boolean>(true);
  const [showAllData, setShowAllData] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  // Step 3 state
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importChanges, setImportChanges] = useState<ImportChange[]>([]);
  
  // Step 4 state
  const [publishWarnings, setPublishWarnings] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Refs
  const gridRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  interface PendingAdjustment {
  payroll_id: number;
  label: string;
  amount: number;
  type: string;
  operation: 'add' | 'update';
}

interface PendingComment {
  payroll_id: number;
  payslip_item_id: number;
  column_name: string;
  comment: string;
}

const [pendingUpdates, setPendingUpdates] = useState<{
  adjustments: PendingAdjustment[];
  comments: PendingComment[];
}>({ adjustments: [], comments: [] });

const baseColumns = useMemo(() => {
  const columns: ColumnType[] = [
    // Fixed order columns
    { key: 'auto_no', label: 'No', width: 60, editable: false, filterable: false },
    { key: 'company_name', label: 'Company Name', width: 150, editable: false, filterable: true },
    { key: 'department_name', label: 'Department', width: 150, editable: false, filterable: true },
    { key: 'position', label: 'Position', width: 150, editable: false, filterable: true },
    { key: 'employee_no', label: 'Employee ID', width: 120, pinnable: true, editable: false, filterable: true },
    { key: 'employee_name', label: 'Employee Name', width: 200, pinnable: true, editable: false, filterable: true },
    { key: 'ic_passport_no', label: 'IC/Passport', width: 120, editable: false, filterable: true },
    { key: 'work_location', label: 'Work Location', width: 120, editable: false, filterable: true },
    { key: 'joined_date', label: 'Joined Date', width: 120, editable: false, filterable: true },
    { key: 'confirmation_date', label: 'Confirmation Date', width: 130, editable: false, filterable: true },
    { key: 'resigned_date', label: 'Resigned Date', width: 120, editable: false, filterable: true },
    { key: 'nationality', label: 'Nationality', width: 100, editable: false, filterable: true },
    { key: 'tax_no', label: 'Tax No', width: 100, editable: false, filterable: true },
    { key: 'dependents', label: 'Dependents', width: 80, editable: false, filterable: true },
    { key: 'marital_status', label: 'Marital Status', width: 100, editable: false, filterable: true },
    { key: 'currency', label: 'Currency', width: 80, editable: false, filterable: true },
    { key: 'gross_salary', label: 'Gross Salary', width: 120, editable: true, type: 'currency', filterable: true },
    { key: 'net_salary', label: 'Net Salary', width: 120, editable: true, type: 'currency', filterable: true },
    { key: 'bank_name', label: 'Bank Name', width: 120, editable: false, filterable: true },
    { key: 'bank_account_no', label: 'Account No', width: 120, editable: false, filterable: true },
    { key: 'bank_account_name', label: 'Account Name', width: 150, editable: false, filterable: true },
  ];

  // DEBUG: Log payroll data to see what we're working with
  console.log('🔍 Payroll Data for columns:', payrollData);
  if (payrollData.length > 0) {
    console.log('🔍 First row payslip_items:', payrollData[0].payslip_items);
    console.log('🔍 First row employer_contributions:', payrollData[0].employer_contributions);
  }

    // Dynamic payslip items columns - UPDATED LOGIC
  const earningItems = new Set<string>();
  const claimItems = new Set<string>(); // Separate set for claims
  const statutoryItems = new Set<string>();
  const deductionItems = new Set<string>();
  const employerItems = new Set<string>();

  if (payrollData.length > 0) {
    payrollData.forEach((row) => {
      console.log(`🔍 Processing row for ${row.employee_name}`);
      
      // Process payslip items
      row.payslip_items?.forEach((item) => {
        console.log(`🔍 Processing item: ${item.label} (${item.type})`);
        
        if (item.type === 'Earning') {
          earningItems.add(item.label);
          console.log(`✅ Added to earnings: ${item.label}`);
        } else if (item.type === 'Claim') { // NEW: Handle Claim type
          claimItems.add(item.label);
          console.log(`✅ Added to claims: ${item.label}`);
        } else if (item.type === 'Statutory') {
          statutoryItems.add(item.label);
          console.log(`✅ Added to statutory: ${item.label}`);
        } else if (item.type === 'Deduction') {
          deductionItems.add(item.label);
          console.log(`✅ Added to deductions: ${item.label}`);
        }
      });

      // Process employer contributions
      row.employer_contributions?.forEach((item) => {
        employerItems.add(item.label);
        console.log(`✅ Added to employer: ${item.label}`);
      });
    });

    console.log('🔍 Final column sets:', {
      earningItems: Array.from(earningItems),
      claimItems: Array.from(claimItems),
      statutoryItems: Array.from(statutoryItems),
      deductionItems: Array.from(deductionItems),
      employerItems: Array.from(employerItems)
    });

    // Add earning items (regular earnings, not claims)
    Array.from(earningItems).forEach((label) => {
      const key = `payslip_earning_${label.toLowerCase().replace(/\s+/g, '_')}`;
      columns.push({
        key,
        label: `Earning: ${label}`,
        width: 120,
        editable: true,
        type: 'currency',
        filterable: true,
      });
    });

    // Add claim items (separate section) - UPDATED
    Array.from(claimItems).forEach((label) => {
      const key = `payslip_claim_${label.toLowerCase().replace(/\s+/g, '_')}`;
      columns.push({
        key,
        label: `Claim: ${label}`,
        width: 120,
        editable: true,
        type: 'currency',
        filterable: true,
      });
    });

    // Add statutory items
    Array.from(statutoryItems).forEach((label) => {
      const key = `payslip_statutory_${label.toLowerCase().replace(/\s+/g, '_')}`;
      columns.push({
        key,
        label: `Statutory: ${label}`,
        width: 120,
        editable: true,
        type: 'currency',
        filterable: true,
      });
    });

    // Add deduction items
    Array.from(deductionItems).forEach((label) => {
      const key = `payslip_deduction_${label.toLowerCase().replace(/\s+/g, '_')}`;
      columns.push({
        key,
        label: `Deduction: ${label}`,
        width: 120,
        editable: true,
        type: 'currency',
        filterable: true,
      });
    });

    // Add employer contributions
    Array.from(employerItems).forEach((label) => {
      const key = `employer_${label.toLowerCase().replace(/\s+/g, '_')}`;
      columns.push({
        key,
        label: `Employer: ${label}`,
        width: 120,
        editable: true,
        type: 'currency',
        filterable: true,
      });
    });
  }

  console.log('🔍 Final columns:', columns.map(col => ({ key: col.key, label: col.label })));
  return columns;
}, [payrollData]);
  useEffect(() => {
  if (baseColumns.length > 0) {
    setColumnOrder(baseColumns.map(col => col.key));
  }
}, [baseColumns]);//}, [baseColumns]);, columnOrder.length

const transformedPayrollData = useMemo(() => {
  console.log('🔄 Transforming payroll data...');
  
  return payrollData.map((row, index) => {
    const payrollId = row.payroll_id || (row as any).id || null;

    const transformed: any = {
      id: payrollId,
      payroll_id: payrollId,
      employee_id: row.employee_id,
      auto_no: index + 1,
      company_name: row.company_name || '',
      department_name: row.department_name || '',
      position: row.position || '',
      employee_no: row.employee_no || '',
      employee_name: row.employee_name || '',
      ic_passport_no: row.ic_passport_no || '',
      work_location: row.work_location || '',
      joined_date: row.joined_date ? new Date(row.joined_date).toLocaleDateString() : '',
      confirmation_date: row.confirmation_date ? new Date(row.confirmation_date).toLocaleDateString() : '',
      resigned_date: row.resigned_date ? new Date(row.resigned_date).toLocaleDateString() : '',
      nationality: row.nationality || '',
      tax_no: row.tax_no || '',
      dependents: row.dependents || 0,
      marital_status: row.marital_status || '',
      currency: row.currency || 'MYR',
      gross_salary: row.gross_salary || 0,
      net_salary: row.net_salary || 0,
      bank_name: row.bank_name || '',
      bank_account_no: row.bank_account_no || '',
      bank_account_name: row.bank_account_name || '',
    };

    console.log(`🔍 Transforming row ${index}:`, {
      employee: row.employee_name,
      payslip_items: row.payslip_items,
      employer_contributions: row.employer_contributions
    });

    // Transform payslip items - FIXED LOGIC
    row.payslip_items?.forEach((item) => {
      let key = '';
      const safeAmount = parseFloat((item.amount || 0).toFixed(2));
      
      if (item.type === 'Earning') {
        // Regular earning (not a claim)
        key = `payslip_earning_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
        console.log(`✅ Mapping earning: ${item.label} -> ${key} = ${safeAmount}`);
      } else if (item.type === 'Claim') { // NEW: Handle Claim type
        // This is a claim
        key = `payslip_claim_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
        console.log(`✅ Mapping claim: ${item.label} -> ${key} = ${safeAmount}`);
      } else if (item.type === 'Statutory') {
        key = `payslip_statutory_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
        console.log(`✅ Mapping statutory: ${item.label} -> ${key} = ${safeAmount}`);
      } else if (item.type === 'Deduction') {
        key = `payslip_deduction_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
        console.log(`✅ Mapping deduction: ${item.label} -> ${key} = ${safeAmount}`);
      }
      
      if (key) {
        transformed[key] = safeAmount;
      }
    });

    // Transform employer contributions
    row.employer_contributions?.forEach((item) => {
      const key = `employer_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
      transformed[key] = item.amount || 0;
      console.log(`✅ Set employer ${key} = ${item.amount}`);
    });

    console.log(`✅ Final transformed row ${index}:`, Object.keys(transformed).filter(k => k.includes('payslip_') || k.includes('employer_')));
    return transformed;
  });
}, [payrollData]);


// const transformedPayrollData = useMemo(() => {
//   return payrollData.map((row, index) => {
//     const payrollId = row.payroll_id || (row as any).id || null;

//     const transformed: any = {
//       id: payrollId,
//       payroll_id: payrollId,
//       employee_id: row.employee_id,
//       auto_no: index + 1,
//       company_name: row.company_name || '',
//       department_name: row.department_name || '',
//       position: row.position || '',
//       employee_no: row.employee_no || '',
//       employee_name: row.employee_name || '',
//       ic_passport_no: row.ic_passport_no || '',
//       work_location: row.work_location || '',
//       joined_date: row.joined_date ? new Date(row.joined_date).toLocaleDateString() : '',
//       confirmation_date: row.confirmation_date ? new Date(row.confirmation_date).toLocaleDateString() : '',
//       resigned_date: row.resigned_date ? new Date(row.resigned_date).toLocaleDateString() : '',
//       nationality: row.nationality || '',
//       tax_no: row.tax_no || '',
//       dependents: row.dependents || 0,
//       marital_status: row.marital_status || '',
//       currency: row.currency || 'MYR',
//       gross_salary: row.gross_salary || 0,
//       net_salary: row.net_salary || 0,
//       bank_name: row.bank_name || '',
//       bank_account_no: row.bank_account_no || '',
//       bank_account_name: row.bank_account_name || '',
//     };

//     // just populate values; no setState here
//     // row.payslip_items?.forEach(item => {
//     //   const prefix = item.type.toLowerCase();
//     //   const key = `payslip_${prefix}_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//     //   transformed[key] = item.amount || 0;
//     // });

//     // row.employer_contributions?.forEach(item => {
//     //   const key = `employer_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//     //   transformed[key] = item.amount || 0;
//     // });

//     // return transformed;

//      row.payslip_items?.forEach(item => {
//       let key = '';
      
//       if (item.type === 'Earning') {
//         // Check if it's a claim
//         if (item.label === 'Claim Reimbursement' || item.label.includes('Claim')) {
//           key = `payslip_claim_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//         } else {
//           key = `payslip_earning_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//         }
//       } else if (item.type === 'Statutory') {
//         key = `payslip_statutory_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//       } else if (item.type === 'Deduction') {
//         key = `payslip_deduction_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//       }
      
//       if (key) {
//         transformed[key] = item.amount || 0;
//       }
//     });

//     row.employer_contributions?.forEach(item => {
//       const key = `employer_${item.label.toLowerCase().replace(/\s+/g, '_')}`;
//       transformed[key] = item.amount || 0;
//     });

//     return transformed;
//   });
// }, [payrollData]);

// 2) INITIALIZE editedCells when payrollData changes (once per dataset)
useEffect(() => {
  const next = new Map<string, CellEdit>();

  payrollData.forEach((row, rowIndex) => {
    row.payslip_items?.forEach(item => {
      if (item.type.toLowerCase().includes('manual')) {
        const key = `payslip_${item.type.toLowerCase()}_${item.label.toLowerCase().replace(/\s+/g,'_')}`;
        const rowStable = String(
  row.payroll_id ?? (row as any).id ?? row.employee_id ?? row.employee_no ?? rowIndex
);
next.set(`${rowStable}-${key}`, { oldValue: null, newValue: item.amount });

        //next.set(`${rowIndex}-${key}`, { oldValue: null, newValue: item.amount });
      }
    });
    row.employer_contributions?.forEach(item => {
      if ((item as any).type?.toLowerCase?.().includes('manual')) {
        const key = `employer_${item.label.toLowerCase().replace(/\s+/g,'_')}`;
const rowStable = String(
  row.payroll_id ?? (row as any).id ?? row.employee_id ?? row.employee_no ?? rowIndex
);
next.set(`${rowStable}-${key}`, { oldValue: null, newValue: item.amount });


        //next.set(`${rowIndex}-${key}`, { oldValue: null, newValue: item.amount });
      }
    });
  });

  if (next.size) setEditedCells(next);
  else setEditedCells(new Map());
}, [payrollData, setEditedCells]);


// Filter data
const filteredData = useMemo(() => {
  // If no data, return an empty array
  if (transformedPayrollData.length === 0) return [];

  // Start with a copy of the original data to avoid mutating the state
  let result = [...transformedPayrollData];

  // 1. Apply all filters first
  columnFilters.forEach(filter => {
    // Skip if the filter value is empty
    if (filter.value.trim() === '') return;

    // Handle sort: filter values (e.g., sort:asc)
    if (filter.value.startsWith('sort:')) {
      const [_, direction] = filter.value.split(':');
      result.sort((a, b) => {
        const valA = parseFloat((a as any)[filter.key]?.toString().replace(/[^\d.-]/g, '') || '0');
        const valB = parseFloat((b as any)[filter.key]?.toString().replace(/[^\d.-]/g, '') || '0');
        return direction === 'asc' ? valA - valB : valB - valA;
      });
    } else {
      // Handle standard text filtering
      result = result.filter(row => {
        const rowValue = (row as any)[filter.key];
        if (rowValue === undefined || rowValue === null) return false;

        const value = rowValue.toString().toLowerCase();
        const filterValue = filter.value.toLowerCase();

        const column = baseColumns.find(col => col.key === filter.key);
        if (column?.type === 'currency') {
          const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
          const numFilter = parseFloat(filterValue.replace(/[^\d.-]/g, ''));
          if (!isNaN(numValue) && !isNaN(numFilter)) {
            return numValue === numFilter;
          }
        }

        // Return true if the row value includes the filter value
        return value.includes(filterValue);
      });
    }
  });
  
  // 2. Apply custom sorting to prioritize managers and assistant managers
  result.sort((a, b) => {
    const posA = (a as any).position?.toLowerCase() || '';
    const posB = (b as any).position?.toLowerCase() || '';

    // Assign a priority level to each position
    const getPriority = (position: string) => {
      // Highest priority for 'Manager' (but not 'Ass. Manager')
      if (position.includes('manager') && !position.includes('ass. manager')) {
        return 1;
      }
      // Second highest priority for 'Assistant Manager'
      if (position.includes('ass. manager')) {
        return 2;
      }
      // Lowest priority for all other positions
      return 3;
    };

    const priorityA = getPriority(posA);
    const priorityB = getPriority(posB);

    return priorityA - priorityB;
  });

  return result;
}, [transformedPayrollData, columnFilters, baseColumns]);

  // Step navigation configuration
  const steps = useMemo(() => [
    { id: 1, title: 'Generate', icon: Calendar, description: 'Select period and generate payroll data' },
    { id: 2, title: 'Pre-Adjustment', icon: Edit3, description: 'Review and adjust payroll entries' },
    { id: 3, title: 'Import/Export', icon: FileSpreadsheet, description: 'Export to Excel or import changes' },
    { id: 4, title: 'Publish', icon: Check, description: 'Review and publish final payroll' }
  ], []);

  // Load initial data
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/payroll-policy-assignments`);
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError('Failed to fetch policy assignments');
      }
    };

    fetchAssignments();
  }, []);

  

  // Handle payroll generation
  const handleGeneratePayroll = useCallback(async () => {//async () => {
    if (!selectedPolicyId || !selectedMonth) {
      setError('Please select both policy assignment and month');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const [year, month] = selectedMonth.split('-');
    const periodFrom = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const periodTo = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

    try {
      const response = await fetch(`${API_BASE_URL}/api/payroll/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_assignment_id: selectedPolicyId,
          company_id: selectedCompanyId, 
          period_from: periodFrom,
          period_to: periodTo,
          include_claims: true,
          commit: true
        })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to generate payroll');
      }

      if (data.total_generated > 0) {
        setSuccessMessage(
          `Successfully generated ${data.total_generated} payroll(s). ` +
          `${data.total_skipped} payroll(s) were already finalized.`
        );

        // In handleGeneratePayroll, verify the mapping is correct:
        const payrollEntries = data.details
          .filter((item: any) => !item.error)
          .map((item: any) => ({
            payroll_id: item.payroll_id || item.id,
            employee_id: item.employee_id,
            employee_name: item.employee_name,
            employee_no: item.employee_no,
            position: item.position,
            department_name: item.department_name,
            employment_type: item.employment_type,
            company_name: item.company_name,
            currency: item.currency || 'MYR',
            gross_salary: item.gross_salary || 0,
            net_salary: item.net_salary || 0,
            ic_passport_no: item.ic_passport_no,
            work_location: item.work_location,
            joined_date: item.joined_date,
            confirmation_date: item.confirmation_date,
            resigned_date: item.resigned_date,
            nationality: item.nationality,
            tax_no: item.tax_no,
            dependents: item.dependents,
            marital_status: item.marital_status,
            bank_name: item.bank_name,
            bank_account_no: item.bank_account_no,
            bank_account_name: item.bank_account_name,
            payslip_items: item.payslip_items || [],
            employer_contributions: item.employer_contributions || []
          }));  

        setPayrollData(payrollEntries);
        setCurrentStep(2);

        // Check David Williams specifically
      const david = data.details.find((item: any) => item.employee_name === 'David Williams');
      console.log('🎯 David Williams:', david);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate payroll data';
      setError(errorMessage);
      console.error('Payroll generation error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPolicyId, selectedMonth ,selectedCompanyId/* add claimType if you later use it to toggle include_claims */]);//};

  // Row selection functions
  const selectAllRows = useCallback(() => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(Array.from({ length: filteredData.length }, (_, i) => i)));
    }
  }, [filteredData.length, selectedRows.size]);

  const toggleRowSelection = useCallback((rowIndex: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowIndex)) {
      newSelection.delete(rowIndex);
    } else {
      newSelection.add(rowIndex);
    }
    setSelectedRows(newSelection);
  }, [selectedRows]);

  // Filter functions
  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = prev.filter(f => f.key !== columnKey);
      if (value) {
        newFilters.push({ key: columnKey, value });
      }
      return newFilters;
    });
  }, []);

  const handleNumberRangeFilter = useCallback((columnKey: string, direction: 'asc' | 'desc') => {
    setColumnFilters(prev => {
      const newFilters = prev.filter(f => 
        !(f.value.startsWith('sort:') && f.key === columnKey)
      );
      newFilters.push({ key: columnKey, value: `sort:${direction}` });
      return newFilters;
    });
    setShowFilterDropdown(null);
  }, []);

  const clearFilter = useCallback((columnKey: string) => {
    setColumnFilters(prev => prev.filter(f => f.key !== columnKey));
    if (filterInputRefs.current[columnKey]) {
      filterInputRefs.current[columnKey]!.value = '';
    }
    if (showFilterDropdown === columnKey) {
      setShowFilterDropdown(null);
    }
  }, [showFilterDropdown]);

  const clearAllFilters = useCallback(() => {
    setColumnFilters([]);
    Object.values(filterInputRefs.current).forEach(ref => {
      if (ref) ref.value = '';
    });
  }, []);

  // Row expansion functions
  const toggleRowExpansion = useCallback((rowIndex: number) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(rowIndex)) {
        newExpanded.delete(rowIndex);
      } else {
        newExpanded.add(rowIndex);
      }
      return newExpanded;
    });
  }, []);

  // Drag and Drop Handlers
  const handleColumnDragStart = useCallback((columnKey: string) => {
    setDraggedColumn(columnKey);
  }, []);

  const handleColumnDrop = useCallback((targetColumnKey: string) => {
    if (!draggedColumn) return;
    
    setColumnOrder(prev => {
      const newColumnOrder = [...prev];
      const draggedIndex = newColumnOrder.indexOf(draggedColumn);
      const targetIndex = newColumnOrder.indexOf(targetColumnKey);
      
      newColumnOrder.splice(draggedIndex, 1);
      newColumnOrder.splice(targetIndex, 0, draggedColumn);
      
      setUndoStack(prevStack => [...prevStack, {
        type: 'column-reorder',
        oldOrder: [...prev],
        newOrder: newColumnOrder
      }]);
      
      return newColumnOrder;
    });
    
    setDraggedColumn(null);
  }, [draggedColumn]);

  const handleRowDragStart = useCallback((rowIndex: number) => {
    setDraggedRow(rowIndex);
  }, []);

  const handleRowDrop = useCallback((targetRowIndex: number) => {
    if (draggedRow === null) return;
    
    setPayrollData(prev => {
      const newData = [...prev];
      const [draggedItem] = newData.splice(draggedRow, 1);
      newData.splice(targetRowIndex, 0, draggedItem);
      
      setUndoStack(prevStack => [...prevStack, {
        type: 'row-reorder',
        oldOrder: [...prev],
        newOrder: newData
      }]);
      
      return newData;
    });
    
    setDraggedRow(null);
  }, [draggedRow]);


  const updatePayrollDataWithNestedItems = useCallback((
  rowIndex: number, 
  columnKey: string, 
  newValue: any) => {
  const [prefix, type, ...labelParts] = columnKey.split('_');
  const label = labelParts.join('_').replace(/_/g, ' ');

  setPayrollData(prev => {
    const newData = [...prev];
    const row = newData[rowIndex];
    
    if (prefix === 'payslip') {
      const items = [...row.payslip_items];
      const itemIndex = items.findIndex(item => 
        item.type.toLowerCase() === type && 
        item.label.toLowerCase() === label.toLowerCase()
      );
      
      if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], amount: parseFloat(newValue) || 0 };
        newData[rowIndex] = { ...row, payslip_items: items };
      }
    } else if (prefix === 'employer') {
      const contributions = [...row.employer_contributions];
      const contribIndex = contributions.findIndex(contrib => 
        contrib.label.toLowerCase() === label.toLowerCase()
      );
      
      if (contribIndex !== -1) {
        contributions[contribIndex] = { ...contributions[contribIndex], amount: parseFloat(newValue) || 0 };
        newData[rowIndex] = { ...row, employer_contributions: contributions };
      }
    }
    
    return newData;
  });
  }, []);

  const applyCellEdit = useCallback((rowIndex: number, columnKey: string, newValue: any) => {
    const cellKey = getStableCellKey(payrollData[rowIndex], columnKey)//`${rowIndex}-${columnKey}`;
    
    setPayrollData(prev => {
      const oldValue = prev[rowIndex][columnKey as keyof PayrollRow];
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [columnKey]: newValue };
      
      setUndoStack(prevStack => [...prevStack, { 
        type: 'edit', 
        rowIndex, 
        columnKey, 
        oldValue, 
        newValue 
      }]);
      setRedoStack([]);
      
      setEditedCells(prev => new Map(prev).set(cellKey, { oldValue, newValue }));
      //setUnsavedChanges(prev => new Set(prev).add(rowIndex));
      // OLD
setUnsavedChanges(prev => new Set(prev).add(rowIndex));
// NEW
const stableId = String(payrollData[rowIndex].payroll_id ?? payrollData[rowIndex].id ?? payrollData[rowIndex].employee_id ?? rowIndex);
setUnsavedChanges(prev => new Set(prev).add(stableId));


      return newData;
    });
  }, []);


  const applyCellEdit11 = useCallback((filteredIndex: number, columnKey: string, newValue: any) => {
  // Get the row from filtered data
  const filteredRow = filteredData[filteredIndex];
  if (!filteredRow) {
    console.error('Filtered row not found at index:', filteredIndex);
    return;
  }
  
  // Find the corresponding row in payrollData
  const originalIndex = payrollData.findIndex(row => 
    (row.employee_id === filteredRow.employee_id) ||
    (row.payroll_id === filteredRow.payroll_id) ||
    (row.employee_no === filteredRow.employee_no)
  );
  
  if (originalIndex === -1) {
    console.error('Could not find original row for filtered row:', filteredRow);
    return;
  }
  
  const row = payrollData[originalIndex];
  const cellKey = getStableCellKey(row, columnKey);
  
  // Rest of your existing applyCellEdit logic...
  const oldValue = payrollData[originalIndex][columnKey as keyof PayrollRow];
  
  setPayrollData(prev => {
    const newData = [...prev];
    newData[originalIndex] = { ...newData[originalIndex], [columnKey]: newValue };
    
    setUndoStack(prevStack => [...prevStack, { 
      type: 'edit', 
      rowIndex: originalIndex, 
      columnKey, 
      oldValue, 
      newValue 
    }]);
    setRedoStack([]);
    
    setEditedCells(prev => new Map(prev).set(cellKey, { oldValue, newValue }));
    setUnsavedChanges(prev => new Set(prev).add(originalIndex));
    
    return newData;
  });
}, [payrollData, filteredData]);
  // Cell Editing Functions

const getStableCellKey = (row: any, columnKey: string) => {
  if (!row) {
    console.error('Row is undefined in getStableCellKey');
    return `unknown-${columnKey}`;
  }
  
  // Use the same identifier everywhere: employee_id or payroll_id
  const stableId = row.employee_id || row.payroll_id || row.id || row.employee_no || 'unknown';
  
  return `${stableId}-${columnKey}`;
};

const handleCellEdit2610 = useCallback(
  (rowKey: number | string, columnKey: string, newValue: any) => {
    // Try to resolve the actual row index using known identifiers
    const tryIdMatch = (rk: number | string) => {
      const rkStr = String(rk);
      for (let i = 0; i < payrollData.length; i++) {
        const r: any = payrollData[i];
        const candidates = [
          r?.payroll_id,
          r?.id,
          r?.employee_id,
          r?.employee_no,   // some datasets use strings like EMP-001
        ].filter(v => v !== null && v !== undefined);
        if (candidates.some(v => String(v) === rkStr)) return i;
      }
      return -1;
    };

    let actualRowIndex = tryIdMatch(rowKey);

    // If not found by ID, treat numeric rowKey as a zero-based index fallback
    if (actualRowIndex === -1 && typeof rowKey === 'number') {
      if (rowKey >= 0 && rowKey < payrollData.length) {
        actualRowIndex = rowKey;
      }
    }

    if (actualRowIndex === -1) {
      console.error("Could not find row with ID or index:", rowKey);
      setError("An error occurred while saving the cell. Could not find the employee record.");
      return;
    }

    // Compute a stable ID for logging/unsaved tracking
    const row: any = payrollData[actualRowIndex];
    const stableId =
      row?.payroll_id ??
      row?.id ??
      row?.employee_id ??
      actualRowIndex; // last resort

    const cellKey = `${row.employee_id || row.payroll_id || row.id}-${columnKey}`;
    //const cellKey = `${actualRowIndex}-${columnKey}`;

    if (requireCommentOnEdit && !comments.has(cellKey)) {
      // Ensure CurrentCell type allows rowId?: number|string
      setCurrentCell({ rowIndex: actualRowIndex, columnKey, newValue, rowId: stableId });
      setShowCommentModal(true);
      return;
    }

    const oldValue = (payrollData[actualRowIndex] as any)[columnKey];

    setPayrollData(prevData => {
      const newData = [...prevData];
      const targetRow: any = { ...newData[actualRowIndex] };

      if (columnKey.startsWith('payslip_') || columnKey.startsWith('employer_')) {
        const [prefix, type, ...labelParts] = columnKey.split('_');
        const rawLabel = labelParts.join('_');
        const normalizedLabel = rawLabel.replace(/_/g, ' ').trim();
        const amount = Number.parseFloat(newValue) || 0;

        if (prefix === 'payslip') {
          const items = [...(targetRow.payslip_items || [])];
          const idx = items.findIndex(
            (it: any) =>
              it?.type?.toLowerCase?.() === type.toLowerCase() &&
              it?.label?.toLowerCase?.() === normalizedLabel.toLowerCase()
          );
          if (idx > -1) {
            items[idx] = { ...items[idx], amount };
          } else {
            items.push({
              label: normalizedLabel,
              amount,
              type: (type.charAt(0).toUpperCase() + type.slice(1)) as any,
            });
          }
          targetRow.payslip_items = items;
        } else if (prefix === 'employer') {
          const contributions = [...(targetRow.employer_contributions || [])];
          const idx = contributions.findIndex(
            (c: any) => c?.label?.toLowerCase?.() === normalizedLabel.toLowerCase()
          );
          if (idx > -1) {
            contributions[idx] = { ...contributions[idx], amount };
          } else {
            contributions.push({
              label: normalizedLabel,
              amount,
              type: 'Employer Contribution',
            });
          }
          targetRow.employer_contributions = contributions;
        }
      } else {
        targetRow[columnKey] = newValue;
      }

      newData[actualRowIndex] = targetRow;
      return newData;
    });

    setUndoStack(prev => [...prev, { type: 'edit', rowIndex: actualRowIndex, columnKey, oldValue, newValue }]);
    setRedoStack([]);
    setEditedCells(prev => new Map(prev).set(cellKey, { oldValue, newValue }));
    setUnsavedChanges(prev => new Set(prev).add(stableId));
  },
  [payrollData, comments, requireCommentOnEdit]
);

const handleCellEdit = useCallback(
  (rowKey: number | string, columnKey: string, newValue: any) => {
    console.log(`✏️ Cell edit: ${rowKey}, ${columnKey}, ${newValue}`);
    
    // Try to resolve the actual row index using known identifiers
    const tryIdMatch = (rk: number | string) => {
      const rkStr = String(rk);
      for (let i = 0; i < payrollData.length; i++) {
        const r: any = payrollData[i];
        const candidates = [
          r?.payroll_id,
          r?.id,
          r?.employee_id,
          r?.employee_no,
        ].filter(v => v !== null && v !== undefined);
        if (candidates.some(v => String(v) === rkStr)) return i;
      }
      return -1;
    };

    let actualRowIndex = tryIdMatch(rowKey);

    // If not found by ID, treat numeric rowKey as a zero-based index fallback
    if (actualRowIndex === -1 && typeof rowKey === 'number') {
      if (rowKey >= 0 && rowKey < payrollData.length) {
        actualRowIndex = rowKey;
      }
    }

    if (actualRowIndex === -1) {
      console.error("Could not find row with ID or index:", rowKey);
      setError("An error occurred while saving the cell. Could not find the employee record.");
      return;
    }

    // Compute a stable ID for logging/unsaved tracking
    const row: any = payrollData[actualRowIndex];
    const stableId = row?.payroll_id ?? row?.id ?? row?.employee_id ?? actualRowIndex;

    const cellKey = `${row.employee_id || row.payroll_id || row.id}-${columnKey}`;

    if (requireCommentOnEdit && !comments.has(cellKey)) {
      setCurrentCell({ rowIndex: actualRowIndex, columnKey, newValue, rowId: stableId });
      setShowCommentModal(true);
      return;
    }

    const oldValue = (payrollData[actualRowIndex] as any)[columnKey];

    setPayrollData(prevData => {
      const newData = [...prevData];
      const targetRow: any = { ...newData[actualRowIndex] };

      console.log(`🔄 Updating payroll data for row ${actualRowIndex}, column ${columnKey}`);

      if (columnKey.startsWith('payslip_') || columnKey.startsWith('employer_')) {
      const [prefix, type, ...labelParts] = columnKey.split('_');
      const rawLabel = labelParts.join('_');
      const normalizedLabel = rawLabel.replace(/_/g, ' ').trim();
      const amount = Number.parseFloat(newValue) || 0;

      if (prefix === 'payslip') {
        const items = [...(targetRow.payslip_items || [])];
        let itemType = '';
        let searchLabel = normalizedLabel;

        // Determine the actual item type based on column prefix
        if (type === 'claim') {
          itemType = 'Claim'; // NEW: Use 'Claim' type
          searchLabel = normalizedLabel;
        } else if (type === 'earning') {
          itemType = 'Earning';
          searchLabel = normalizedLabel;
        } else if (type === 'statutory') {
          itemType = 'Statutory';
          searchLabel = normalizedLabel;
        } else if (type === 'deduction') {
          itemType = 'Deduction';
          searchLabel = normalizedLabel;
        }

        console.log(`🔍 Looking for item: type=${itemType}, label=${searchLabel}`);

        const idx = items.findIndex(
          (it: any) => {
            const typeMatch = it?.type?.toLowerCase?.() === itemType.toLowerCase();
            const labelMatch = it?.label?.toLowerCase?.() === searchLabel.toLowerCase();
            return typeMatch && labelMatch;
          }
        );

        if (idx > -1) {
          console.log(`✅ Updating existing item at index ${idx}`);
          items[idx] = { ...items[idx], amount };
        } else {
          console.log(`✅ Creating new item: ${searchLabel} (${itemType})`);
          items.push({
            label: searchLabel,
            amount,
            type: itemType as any,
          });
        }
        targetRow.payslip_items = items;
          
        } else if (prefix === 'employer') {
          const contributions = [...(targetRow.employer_contributions || [])];
          const idx = contributions.findIndex(
            (c: any) => c?.label?.toLowerCase?.() === normalizedLabel.toLowerCase()
          );
          if (idx > -1) {
            contributions[idx] = { ...contributions[idx], amount };
          } else {
            contributions.push({
              label: normalizedLabel,
              amount,
              type: 'Employer Contribution',
            });
          }
          targetRow.employer_contributions = contributions;
        }
      } else {
        // Handle flat fields
        targetRow[columnKey] = newValue;
      }

      newData[actualRowIndex] = targetRow;
      console.log(`✅ Updated row data:`, targetRow);
      return newData;
    });

    setUndoStack(prev => [...prev, { type: 'edit', rowIndex: actualRowIndex, columnKey, oldValue, newValue }]);
    setRedoStack([]);
    setEditedCells(prev => new Map(prev).set(cellKey, { oldValue, newValue }));
    setUnsavedChanges(prev => new Set(prev).add(stableId));
  },
  [payrollData, comments, requireCommentOnEdit]
);

  // Undo/Redo Functions
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const lastAction = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, lastAction]);
    setUndoStack(prev => prev.slice(0, -1));

    switch (lastAction.type) {
      case 'edit':
        setPayrollData(prev => {
          const newData = [...prev];
          (newData[lastAction.rowIndex!] as any)[lastAction.columnKey!] = lastAction.oldValue;
          return newData;
        });
        break;
      case 'column-reorder':
        setColumnOrder(lastAction.oldOrder!);
        break;
      case 'row-reorder':
        setPayrollData(lastAction.oldOrder!);
        break;
    }
  }, [undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextAction = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, nextAction]);
    setRedoStack(prev => prev.slice(0, -1));

    switch (nextAction.type) {
      case 'edit':
        setPayrollData(prev => {
          const newData = [...prev];
          (newData[nextAction.rowIndex!] as any)[nextAction.columnKey!] = nextAction.newValue;
          return newData;
        });
        break;
      case 'column-reorder':
        setColumnOrder(nextAction.newOrder!);
        break;
      case 'row-reorder':
        setPayrollData(nextAction.newOrder!);
        break;
    }
  }, [redoStack]);


const handleSaveChanges = useCallback(async (saveAll = true) => {
  setLoading(true);

  // rowsToSave can be stable IDs (string|number) or plain indices (number)
  const rowKeys: Array<number | string> = saveAll
    ? Array.from(unsavedChanges as Set<number | string>)
    : Array.from(selectedRows as Set<number | string>);

  // Helper: convert a key (id or index) to a numeric row index
const resolveRowIndex = (key: number | string): number => {
  // If key is already a valid index (0, 1, 2, etc.), return it
  if (typeof key === 'number' && Number.isInteger(key) && key >= 0 && key < payrollData.length) {
    return key;
  }
  
  // Otherwise, treat it as a stable ID and search for the matching row
  const idx = payrollData.findIndex((r: any) =>
    String(r?.payroll_id) === String(key) ||
    String(r?.id) === String(key) ||
    String(r?.employee_id) === String(key) ||
    String(r?.employee_no) === String(key)
  );
  
  if (idx === -1) {
    console.warn('Could not resolve row index for key:', key, 'Available payroll IDs:', payrollData.map(r => r.payroll_id));
  }
  
  return idx;
};
  try {
    for (const rowKey of rowKeys) {
      const rowIndex = resolveRowIndex(rowKey);
      if (rowIndex < 0 || rowIndex >= payrollData.length) {
        console.error('Could not resolve row index for key:', rowKey);
        // You can `continue` or `throw` depending on your UX preference:
        continue;
      }

      const row = payrollData[rowIndex] as any;
      const payrollId = row.payroll_id ?? row.id ?? null;

      if (!payrollId) {
        throw new Error(`No payroll ID found for ${row.employee_name}`);
      }

      const payslipItems = row.payslip_items || [];
      const employerContributions = row.employer_contributions || [];
      const existingItems = [...payslipItems, ...employerContributions];

      // Edited cells for this rowIndex only
      for (const [cellKey, edit] of editedCells) {
        //const [editRowIndexStr, columnKey] = cellKey.split('-');
        //const editRowIndex = Number.parseInt(editRowIndexStr, 10);
        //if (editRowIndex !== rowIndex) continue;

        const [cellRowKey, columnKey] = cellKey.split('-', 2);
const currentStableId = String(row.payroll_id ?? row.id ?? row.employee_id ?? row.employee_no ?? rowIndex);
if (String(cellRowKey) !== currentStableId) continue;


        if (columnKey.startsWith('payslip_') || columnKey.startsWith('employer_')) {
          const [prefix, type, ...labelParts] = columnKey.split('_');
          const rawLabel = labelParts.join('_');
          const label = rawLabel.replace(/_/g, ' ');
          const itemType =
            prefix === 'employer'
              ? 'Employer Contribution'
              : (type.charAt(0).toUpperCase() + type.slice(1));

          const existingItem = existingItems.find((item: any) =>
            item?.label?.toLowerCase?.() === label.toLowerCase() &&
            (prefix === 'employer' || item?.type?.toLowerCase?.() === type.toLowerCase())
          );

          const operation = existingItem ? 'update' : 'add';

          await fetch(`${API_BASE_URL}/api/payroll/adjustments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payroll_id: payrollId,
              label,
              amount: Number.parseFloat(edit.newValue?.toString() || '0'),
              type: itemType,
              operation
            })
          });
        }
      }

      // Comments for this rowIndex
      for (const [cellKey, comment] of comments) {
        const [commentRowIndexStr, columnKey] = cellKey.split('-');
        const commentRowIndex = Number.parseInt(commentRowIndexStr, 10);
        if (commentRowIndex !== rowIndex) continue;

        await fetch(`${API_BASE_URL}/api/payroll/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payroll_id: payrollId,
            // If your API expects a payslip item id, replace this with the real id
            payslip_item_id: row.employee_id,
            column_name: columnKey,
            comment
          })
        });
      }
    }

    setUnsavedChanges(new Set());
    setError(null);
    setSuccessMessage('Changes saved successfully!');

    // Refresh data after save - but preserve filter state
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      const response = await fetch(
        `${API_BASE_URL}/api/payroll/adjustments/?period_month=${month}&period_year=${year}&all_data=true&status=DRAFT${selectedCompanyId ? `&company_id=${selectedCompanyId}` : ''}`
      );
      if (response.ok) {
        const adjustmentsData = await response.json();
        console.log('🔍 API Response Structure:', adjustmentsData);

        if (adjustmentsData.data && Array.isArray(adjustmentsData.data)) {
          const payrollEntries = adjustmentsData.data.map((item: any) => {
            const payroll = item.payroll || {};
            return {
              payroll_id: payroll.payroll_id,
              employee_id: payroll.employee_id,
              employee_name: payroll.employee_name,
              employee_no: payroll.employee_no,
              position: payroll.position,
              department_name: payroll.department_name,
              employment_type: payroll.employment_type,
              company_name: payroll.company_name,
              currency: payroll.currency || 'MYR',
              gross_salary: Number.parseFloat(payroll.gross_salary) || 0,
              net_salary: Number.parseFloat(payroll.net_salary) || 0,
              ic_passport_no: payroll.ic_passport_no,
              work_location: payroll.work_location,
              joined_date: payroll.joined_date,
              confirmation_date: payroll.confirmation_date,
              resigned_date: payroll.resigned_date,
              nationality: payroll.nationality,
              tax_no: payroll.tax_no,
              dependents: payroll.dependents,
              marital_status: payroll.marital_status,
              bank_name: payroll.bank_name,
              bank_account_no: payroll.bank_account_no,
              bank_account_name: payroll.bank_account_name,
              // payslip_items: (item.payslip_items || []).map((i: any) => ({
              //   ...i,
              //   amount: Number.parseFloat(i.amount) || 0
              // })),
              // employer_contributions: (item.employer_contributions || []).map((i: any) => ({
              //   ...i,
              //   amount: Number.parseFloat(i.amount) || 0
              // }))
              payslip_items: (item.payslip_items || []).map((i: any) => ({
  id: i.id,
  label: i.label,
  type: i.type,
  amount: Number.parseFloat(i.amount) || 0
})),
employer_contributions: (item.employer_contributions || []).map((i: any) => ({
  id: i.id,
  label: i.label,
  type: i.type,
  amount: Number.parseFloat(i.amount) || 0
})),

            };
          });

          console.log('✅ Fixed payrollEntries:', payrollEntries);
          setPayrollData(payrollEntries);
          setEditedCells(new Map());
        }
      }
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to save changes');
  } finally {
    setLoading(false);
  }
}, [API_BASE_URL, comments, payrollData, selectedRows, unsavedChanges, selectedMonth, editedCells,selectedCompanyId]);


// ✅ Fix: handler uses proper spread and pulls totals from data.payroll
const handleAdjustPayslipItem = async (adjustment: PayslipAdjustment) => {
  setLoading(true);
  try {
    const resp = await fetch(`${API_BASE_URL}/api/payroll/adjustments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adjustment),
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.error || 'Failed to adjust payslip item');
    }

    setPayrollData(prev =>
      prev.map(row => {
        if (row.payroll_id !== adjustment.payroll_id) return row;
        return {
          ...row, // <-- was ".row"
          payslip_items: data.payslip_items ?? row.payslip_items,
          employer_contributions: data.employer_contributions ?? row.employer_contributions,
          gross_salary: data.payroll?.gross_salary ?? row.gross_salary,
          net_salary: data.payroll?.net_salary ?? row.net_salary,
        };
      })
    );

    setSuccessMessage(`Payslip item ${adjustment.operation}d successfully`);
    setShowAdjustmentModal(false);
    setCurrentAdjustment(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to adjust payslip item');
  } finally {
    setLoading(false);
  }
};



const confirmImport = useCallback(async () => {
  if (pendingUpdates.adjustments.length === 0 && pendingUpdates.comments.length === 0) {
    setImportErrors(['No changes to import']);
    return;
  }

  setLoading(true);
  try {
    // First, create a map to track all cell edits from the import
    const importedCellEdits = new Map<string, CellEdit>();

    // Process adjustments in batches and track edits
    const BATCH_SIZE = 10;
    for (let i = 0; i < pendingUpdates.adjustments.length; i += BATCH_SIZE) {
      const batch = pendingUpdates.adjustments.slice(i, i + BATCH_SIZE);
      
      // Process batch and track edits
      await Promise.all(batch.map(adjustment => {
        // Find the row index for this adjustment
        const rowIndex = payrollData.findIndex(row => 
          (row.payroll_id || row.id) === adjustment.payroll_id
        );
        
        if (rowIndex === -1) return Promise.resolve();

        // Determine the column key based on adjustment type
        let columnKey: string;
        if (adjustment.type === 'Employer Contribution') {
          columnKey = `employer_${adjustment.label.toLowerCase().replace(/\s+/g, '_')}`;
        } else {
          columnKey = `payslip_${adjustment.type.toLowerCase()}_${adjustment.label.toLowerCase().replace(/\s+/g, '_')}`;
        }

        // Get the old value from the current data
        let oldValue: any = 0;
        if (columnKey.startsWith('payslip_')) {
          const [_, type, ...labelParts] = columnKey.split('_');
          const label = labelParts.join('_').replace(/_/g, ' ');
          const item = payrollData[rowIndex].payslip_items?.find(i => 
            i.type.toLowerCase() === type.toLowerCase() && 
            i.label.toLowerCase() === label.toLowerCase()
          );
          oldValue = item?.amount || 0;
        } else if (columnKey.startsWith('employer_')) {
          const label = columnKey.replace('employer_', '').replace(/_/g, ' ');
          const item = payrollData[rowIndex].employer_contributions?.find(i => 
            i.label.toLowerCase() === label.toLowerCase()
          );
          oldValue = item?.amount || 0;
        } else {
          oldValue = (payrollData[rowIndex] as any)[columnKey] || 0;
        }

        // Track this edit
        importedCellEdits.set(getStableCellKey(payrollData[rowIndex], columnKey),{//`${rowIndex}-${columnKey}`, {
          oldValue,
          newValue: adjustment.amount
        });

        // Send the API request
        return fetch(`${API_BASE_URL}/api/payroll/adjustments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adjustment)
        });
      }));
    }

    // Process comments in batches
    for (let i = 0; i < pendingUpdates.comments.length; i += BATCH_SIZE) {
      const batch = pendingUpdates.comments.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(comment =>
        fetch(`${API_BASE_URL}/api/payroll/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comment)
        })
      ));
    }

    // Update editedCells with all the imported changes
    setEditedCells(prev => {
      const newEditedCells = new Map(prev);
      importedCellEdits.forEach((edit, key) => {
        newEditedCells.set(key, edit);
      });
      return newEditedCells;
    });

    // Refresh data from server
    const [year, month] = selectedMonth.split('-');
    const response = await fetch(
      `${API_BASE_URL}/api/payroll/adjustments/?period_month=${month}&period_year=${year}&all_data=true&status=DRAFT`
    );
    

    if (response.ok) {
      const adjustmentsData = await response.json();
      if (adjustmentsData.data && Array.isArray(adjustmentsData.data)) {
        const transformedData = adjustmentsData.data.map((item: any) => {
          const payroll = item.payroll || {};
          return {
            payroll_id: payroll.payroll_id,
            employee_id: payroll.employee_id,
            employee_name: payroll.employee_name,
            employee_no: payroll.employee_no,
            position: payroll.position,
            department_name: payroll.department_name,
            employment_type: payroll.employment_type,
            company_name: payroll.company_name,
            currency: payroll.currency || 'MYR',
            gross_salary: parseFloat(payroll.gross_salary) || 0,
            net_salary: parseFloat(payroll.net_salary) || 0,
            ic_passport_no: payroll.ic_passport_no,
            work_location: payroll.work_location,
            joined_date: payroll.joined_date,
            confirmation_date: payroll.confirmation_date,
            resigned_date: payroll.resigned_date,
            nationality: payroll.nationality,
            tax_no: payroll.tax_no,
            dependents: payroll.dependents,
            marital_status: payroll.marital_status,
            bank_name: payroll.bank_name,
            bank_account_no: payroll.bank_account_no,
            bank_account_name: payroll.bank_account_name,
            // payslip_items: (item.payslip_items || []).map((i: any) => ({
            //   ...i,
            //   amount: parseFloat(i.amount) || 0
            // })),
            // employer_contributions: (item.employer_contributions || []).map((i: any) => ({
            //   ...i,
            //   amount: parseFloat(i.amount) || 0
            // }))
            payslip_items: (item.payslip_items || []).map((i: any) => ({
  id: i.id,
  label: i.label,
  type: i.type,
  amount: Number.parseFloat(i.amount) || 0
})),
employer_contributions: (item.employer_contributions || []).map((i: any) => ({
  id: i.id,
  label: i.label,
  type: i.type,
  amount: Number.parseFloat(i.amount) || 0
})),

          };
        });
        setPayrollData(transformedData);
      }
    }

    setSuccessMessage(
      `Successfully imported ${pendingUpdates.adjustments.length} adjustments ` +
      `and ${pendingUpdates.comments.length} comments`
    );
    setPendingUpdates({ adjustments: [], comments: [] });
    setImportChanges([]);
    setImportFile(null);
    setCurrentStep(4);

  } catch (err) {
    setImportErrors([err instanceof Error ? err.message : 'Failed to apply changes']);
  } finally {
    setLoading(false);
  }
}, [pendingUpdates, selectedMonth, payrollData,selectedCompanyId]);


  // Publish Functions
  const validateForPublish = useCallback(() => {
    const warnings: string[] = [];
    
    if (unsavedChanges.size > 0) {
      warnings.push('You have unsaved changes');
    }

    if (requireCommentOnEdit) {
      editedCells.forEach((edit, cellKey) => {
        if (!comments.has(cellKey)) {
          warnings.push(`Comment required for edited cell: ${cellKey}`);
        }
      });
    }

    setPublishWarnings(warnings);
    return warnings.length === 0;
  }, [comments, editedCells, requireCommentOnEdit, unsavedChanges]); //}, [comments, editedCells, requireCommentOnEdit, unsavedChanges.size]);

  const handlePublish = useCallback(async () => {
    if (!validateForPublish()) {
      return;
    }

    setIsPublishing(true);
    try {
      const payrollIds = payrollData.map(row => row.employee_id);
      await fetch(`${API_BASE_URL}/api/payroll/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payroll_ids: payrollIds,
          status_code: 'FINAL'
        })
      });

      // Reset wizard
      setCurrentStep(1);
      setPayrollData([]);
      setEditedCells(new Map());
      setComments(new Map());
      setUnsavedChanges(new Set());
    } catch (err) {
      setError('Failed to publish payroll');
    } finally {
      setIsPublishing(false);
    }
  }, [payrollData, validateForPublish]);

  // Step Validation
  const validateStepChange = useCallback((targetStep: number): boolean => {
    if (targetStep === 2 && payrollData.length === 0) {
      setError('Please generate payroll data first');
      return false;
    }
    
    if (targetStep === 3 && unsavedChanges.size > 0) {
      setError('Please save all changes before proceeding');
      return false;
    }
    
    if (targetStep === 4 && (unsavedChanges.size > 0 || publishWarnings.length > 0)) {
      setError('Please resolve all issues before publishing');
      return false;
    }
    
    return true;
  }, [payrollData.length, publishWarnings.length, unsavedChanges.size]);

// Step Navigation (responsive + sticky + scrollable on mobile)
const renderStepNavigation = useCallback(() => (
  <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="relative py-3">
        {/* soft edge fades on mobile */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent sm:hidden" />

        <ol
          role="list"
          className="
            flex gap-3 overflow-x-auto snap-x snap-mandatory
            sm:grid sm:grid-cols-4 sm:gap-6 sm:overflow-visible sm:snap-none
          "
          aria-label="Payroll steps"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isDisabled = currentStep < step.id; // visual state
            const canNavigate = currentStep >= step.id - 1; // same guard you had

            const baseRing =
              isActive
                ? 'ring-2 ring-blue-300'
                : isCompleted
                  ? 'ring-1 ring-green-200'
                  : 'ring-1 ring-gray-200';

            return (
              <li
                key={step.id}
                className="
                  snap-start flex-shrink-0 w-[240px]
                  sm:w-auto sm:flex-shrink
                "
              >
                <button
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  aria-disabled={!canNavigate}
                  onClick={() => {
                    if (!canNavigate) return;
                    if (step.id > 1 && currentStep < step.id - 1) {
                      setError(`Please complete step ${step.id - 1} first`);
                      return;
                    }
                    if (step.id === 2 && payrollData.length === 0) {
                      setError('Please generate payroll data first');
                      return;
                    }
                    if (step.id === 3 && unsavedChanges.size > 0) {
                      setError('Please save all changes before proceeding');
                      return;
                    }
                    setCurrentStep(step.id);
                  }}
                  className={[
                    'group relative w-full text-left rounded-xl px-4 py-3 transition',
                    'bg-white hover:bg-gray-50',
                    baseRing,
                    !canNavigate ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  ].join(' ')}
                >
                  {/* connector on md+ */}
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="
                        hidden sm:block absolute top-1/2 right-[-12px] h-px w-6
                        translate-y-[-50%]
                        bg-gray-200
                      "
                    />
                  )}

                  <span className="flex items-center gap-3">
                    <span
                      className={[
                        'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
                        isActive ? 'bg-blue-600 text-white' :
                        isCompleted ? 'bg-green-600 text-white' :
                        'bg-gray-200 text-gray-600'
                      ].join(' ')}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          'block truncate font-medium',
                          isActive ? 'text-blue-700' :
                          isCompleted ? 'text-green-700' :
                          'text-gray-800'
                        ].join(' ')}
                      >
                        {step.title}
                      </span>
                      <span className="hidden sm:block text-xs text-gray-500 truncate">
                        {step.description}
                      </span>
                    </span>

                    <Icon className="hidden sm:block h-4 w-4 text-gray-400 shrink-0" />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  </div>
), [currentStep, payrollData.length, steps, unsavedChanges.size]);


  // Render Step 1: Generate
  const renderStep1 = useCallback(() => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-blue-600" />
          Generate Payroll Data
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Policy Assignment
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedPolicyId || ''}
               onChange={(e) => {
    const assignmentId = Number(e.target.value);
    const selectedAssignment = assignments.find(a => a.id === assignmentId);
    setSelectedPolicyId(assignmentId);
    setSelectedCompanyId(selectedAssignment?.company_id || null);
  }}
              //onChange={(e) => setSelectedPolicyId(Number(e.target.value))}
              disabled={loading}
            >
              <option value="">Select Policy Assignment</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.company_name} - {assignment.pay_interval}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month & Year
            </label>
            <input
              type="month"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="included">Only Claims</option>
              <option value="excluded">Exclude Claims</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGeneratePayroll}
            disabled={loading || !selectedPolicyId || !selectedMonth}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Users className="w-4 h-4" />
            )}
            <span>{loading ? 'Generating...' : 'Generate Payroll'}</span>
          </button>
        </div>
      </div>
    </div>
  ), [assignments, claimType, handleGeneratePayroll, loading, selectedMonth, selectedPolicyId]);

  // Render Step 2: Adjust
  const renderStep2 = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayData = showAllData ? filteredData : filteredData.slice(startIndex, endIndex);

  if (isRefreshing) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Refreshing data...</p>
        </div>
      </div>
    );
  }
    

    return (
      <div className="p-6">
        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                Payroll Adjustment
              </h2>
              {unsavedChanges.size > 0 && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {unsavedChanges.size} unsaved changes
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">


              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
              
              <label className="flex items-center ml-4 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showAllData}
                  onChange={() => setShowAllData(!showAllData)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                Show All Data
              </label>

              <div className="relative">
                <button
                  onClick={() => handleSaveChanges(false)}
                  disabled={selectedRows.size === 0}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  <span>Save Selected</span>
                </button>
                {selectedRows.size > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {selectedRows.size}
                  </span>
                )}
              </div>
              
              <div className="relative">
                <button
  onClick={() => handleSaveChanges(true)}
  disabled={unsavedChanges.size === 0 || loading}
  className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
>
  {loading ? (
    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
  ) : (
    <Save className="w-4 h-4 mr-1" />
  )}
  <span>{loading ? 'Saving...' : 'Save All'}</span>
  {unsavedChanges.size > 0 && !loading && (
    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {unsavedChanges.size}
    </span>
  )}
</button>
                {unsavedChanges.size > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unsavedChanges.size}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  if (selectedRows.size === 0) {
                    setError('Please select at least one row to add comment');
                    return;
                  }
                  setShowCommentModal(true);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>Add Comment</span>
              </button>
            </div>
          </div>
        </div>

{/* Color Legend for Column Types */}
<div className="mb-3 text-sm text-gray-600 flex items-center space-x-4">
  <span className="flex items-center">
    <span className="inline-block w-3 h-3 bg-green-100 rounded mr-1"></span>
    <span>Earnings</span>
  </span>
  <span className="flex items-center">
    <span className="inline-block w-3 h-3 bg-purple-100 rounded mr-1"></span>
    <span>Claims</span>
  </span>
  <span className="flex items-center">
    <span className="inline-block w-3 h-3 bg-orange-100 rounded mr-1"></span>
    <span>Statutory</span>
  </span>
  <span className="flex items-center">
    <span className="inline-block w-3 h-3 bg-red-100 rounded mr-1"></span>
    <span>Deductions</span>
  </span>
  <span className="flex items-center">
    <span className="inline-block w-3 h-3 bg-blue-100 rounded mr-1"></span>
    <span>Employer Contributions</span>
  </span>
</div>

        {/* Excel-like Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto" ref={gridRef}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedRows.size > 0 && selectedRows.size === filteredData.length}
                      onChange={selectAllRows}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  {columnOrder.map((columnKey) => {
                    const column = baseColumns.find(col => col.key === columnKey);
                    if (!column) return null;
                    
                    const filter = columnFilters.find(f => f.key === column.key);
                    const isFiltered = !!filter;
                    
                    return (
                      <th
                        key={column.key}
                        className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${
                          pinnedColumns.has(column.key) ? 'bg-blue-50' : ''
                        }`}
                        style={{ minWidth: column.width }}
                        draggable
                        onDragStart={() => handleColumnDragStart(column.key)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleColumnDrop(column.key)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{column.label}</span>
                          <div className="flex items-center space-x-1">
                            {column.filterable && (
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFilterDropdown(showFilterDropdown === column.key ? null : column.key);
                                  }}
                                  className={`p-1 rounded hover:bg-gray-200 ${
                                    isFiltered ? 'text-blue-600' : 'text-gray-400'
                                  }`}
                                >
                                  <Filter className="w-3 h-3" />
                                </button>
                                {showFilterDropdown === column.key && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 p-2">
                                    <input
                                      ref={(el) => {
                                        if (el) {
                                          filterInputRefs.current[column.key] = el;
                                        }
                                      }}
                                      type="text"
                                      defaultValue={filter?.value || ''}
                                      placeholder={`Filter ${column.label}`}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      onChange={(e) => handleFilterChange(column.key, e.target.value)}
                                    />
                                    {column.type === 'currency' && (
                                      <div className="mt-2 space-y-1">
                                        <button
                                          onClick={() => handleNumberRangeFilter(column.key, 'asc')}
                                          className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded flex items-center"
                                        >
                                          <ChevronUp className="w-3 h-3 mr-1" />
                                          Sort: Low to High
                                        </button>
                                        <button
                                          onClick={() => handleNumberRangeFilter(column.key, 'desc')}
                                          className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded flex items-center"
                                        >
                                          <ChevronDown className="w-3 h-3 mr-1" />
                                          Sort: High to Low
                                        </button>
                                      </div>
                                    )}
                                    <div className="flex justify-between mt-2">
                                      <button
                                        onClick={() => clearFilter(column.key)}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                      >
                                        Clear
                                      </button>
                                      {columnFilters.length > 1 && (
                                        <button
                                          onClick={clearAllFilters}
                                          className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                          Clear All
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {column.pinnable && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newPinned = new Set(pinnedColumns);
                                  if (newPinned.has(column.key)) {
                                    newPinned.delete(column.key);
                                  } else {
                                    newPinned.add(column.key);
                                  }
                                  setPinnedColumns(newPinned);
                                }}
                                className={`p-1 rounded hover:bg-gray-200 ${
                                  pinnedColumns.has(column.key) ? 'text-blue-600' : 'text-gray-400'
                                }`}
                              >
                                <Pin className="w-3 h-3" />
                              </button>
                            )}
                            <GripVertical className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((row, rowIndex) => {
                  const actualRowIndex = showAllData ? rowIndex : startIndex + rowIndex;
                  const hasUnsavedChanges = unsavedChanges.has(actualRowIndex);
                  const isSelected = selectedRows.has(actualRowIndex);
                  
                  return (
                    <tr
                      key={row.employee_id || rowIndex}
                      className={`hover:bg-gray-50 ${hasUnsavedChanges ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''} ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      draggable
                      onDragStart={() => handleRowDragStart(actualRowIndex)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleRowDrop(actualRowIndex)}
                    >
                      <td className="px-3 py-2 text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(actualRowIndex)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      {columnOrder.map((columnKey) => {
                        const column = baseColumns.find(col => col.key === columnKey);
                        if (!column) return null;
                        
                        const row = transformedPayrollData[actualRowIndex];
const rowId = row.employee_id || row.payroll_id || row.id || row.employee_no;
const cellKey = `${rowId}-${column.key}`;

                        //const cellKey = `${actualRowIndex}-${column.key}`;
                        const isEdited = editedCells.has(cellKey);
                        const hasComment = comments.has(cellKey);
                        const value = (row as any)[column.key];




                        return (
//                           <td
//   key={column.key}
//   className={`px-3 py-2 text-sm ${
//     column.editable ? 'cursor-text' : 'cursor-default'
//   } ${
//     isEdited ? 'bg-yellow-50' : '' // Highlight edited cells in yellow
//   } ${
//     hasComment ? 'relative' : ''
//   } ${
//     column.key.startsWith('payslip_') ? 'bg-green-50' : ''
//   } ${
//     column.key.startsWith('employer_') ? 'bg-blue-50' : ''
//   }`}
//   onClick={() => column.editable && setCurrentCell({ rowIndex: actualRowIndex, columnKey: column.key, value })}
// >
<td
  key={column.key}
  className={`px-3 py-2 text-sm ${
    column.editable ? 'cursor-text' : 'cursor-default'
  } ${
    isEdited ? 'bg-yellow-50' : ''
  } ${
    hasComment ? 'relative' : ''
  } ${
    column.key.startsWith('payslip_earning_') ? 'bg-green-50' :
    column.key.startsWith('payslip_claim_') ? 'bg-purple-50' : // Claims in purple
    column.key.startsWith('payslip_statutory_') ? 'bg-orange-50' :
    column.key.startsWith('payslip_deduction_') ? 'bg-red-50' :
    column.key.startsWith('employer_') ? 'bg-blue-50' : ''
  }`}
  onClick={() => column.editable && setCurrentCell({ rowIndex: actualRowIndex, columnKey: column.key, value })}
>
                            {column.editable ? (
                              <input
                                type={column.type === 'currency' ? 'number' : 'text'}
                                value={value || ''}
                                onChange={(e) => handleCellEdit(actualRowIndex, column.key, e.target.value)}
                                className="w-full border-none outline-none bg-transparent"
                                step={column.type === 'currency' ? '0.01' : undefined}
                              />
                            ) : (
                              <span>
                                {column.type === 'currency' && value ? `RM ${parseFloat(value.toString()).toFixed(2)}` : value}
                              </span>
                            )}
                             
{hasComment && (
  <div
    className="absolute top-1 right-1"
    onMouseEnter={() => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      setHoveredCell(cellKey);
    }}
    onMouseLeave={() => {
      hideTimeout.current = setTimeout(() => {
        setHoveredCell(null);
      }, 200);
    }}
  >
    <div className="relative">
      <MessageSquare 
        className="w-3 h-3 text-blue-600 cursor-pointer" 
        onClick={(e) => {
          e.stopPropagation();
          setCurrentCell({ 
            rowIndex: actualRowIndex, 
            columnKey: column.key,
            rowId // Pass the stable ID
          });
          setShowCommentModal(true);
        }} 
      />
      {hoveredCell === cellKey && (
        <div className="absolute z-10 right-0 top-4 w-64 p-2 bg-white border border-gray-200 shadow-lg rounded-md">
          <div className="text-xs text-gray-700 break-words">
            {comments.get(cellKey)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setComments(prev => {
                const newComments = new Map(prev);
                newComments.delete(cellKey);
                return newComments;
              });
              setHoveredCell(null);
            }}
            className="mt-1 text-xs text-red-600 hover:text-red-800"
          >
            Remove Comment
          </button>
        </div>
      )}
    </div>
  </div>
)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!showAllData && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                {columnFilters.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    (Filtered from {payrollData.length})
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredData.length / rowsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Generate
          </button>
          <button
            onClick={() => {
              if (!validateStepChange(3)) return;
              setCurrentStep(3);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue to Export/Import
          </button>
        </div>
      </div>
    );
  };
  // Render Step 3: Import/Export
  const renderStep3 = () => {
    const exportExcelWithComments = async () => {
      setLoading(true);
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Payroll Data');

        if (!filteredData || filteredData.length === 0) {
          throw new Error('No payroll data available to export');
        }

        // Add headers (no extra checkbox column)
        const headers = baseColumns.map(col => col.label);
        worksheet.addRow(headers);

        // Style headers
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
          cell.font = { bold: true };
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
          };
        });

        // Add data rows (no leading blank). If the column is "No", fill with row index.
        filteredData.forEach((employee, rowIndex) => {
          const rowData = baseColumns.map(col => {
            const isNoCol =
              (col.key && String(col.key).toLowerCase() === 'no') ||
              (col.label && String(col.label).toLowerCase() === 'no');

            if (isNoCol) return rowIndex + 1; // 1,2,3,...

            const value = (employee as any)[col.key];
            if (value === null || value === undefined) return '';

            if (col.type === 'currency') {
              const numValue = Number(value);
              return isNaN(numValue) ? 0 : numValue;
            }
            return value;
          });

          worksheet.addRow(rowData);
        });

        // Map column keys to their positions (1-indexed, no checkbox offset)
        const columnPositionMap: Record<string, number> = {};
        baseColumns.forEach((col, index) => {
          columnPositionMap[col.key] = index + 1;
        });

        // Add comments
        filteredData.forEach((employee, rowIndex) => {
          const row = payrollData.find(r =>
            (r.employee_id === employee.employee_id) ||
            (r.payroll_id === employee.payroll_id) ||
            (r.employee_no === employee.employee_no)
          );
          if (!row) return;

          const rowId = row.employee_id || row.payroll_id || row.id || row.employee_no;

          baseColumns.forEach(col => {
            const cellKey = `${rowId}-${col.key}`;
            if (comments.has(cellKey)) {
              const excelColumnIndex = columnPositionMap[col.key];
              if (excelColumnIndex) {
                const commentText = comments.get(cellKey);
                const dataRow = worksheet.getRow(rowIndex + 2); // header + 1
                try {
                  dataRow.getCell(excelColumnIndex).note = {
                    texts: [
                      { text: `${author}: `, font: { bold: true } },
                      { text: commentText || '' }
                    ]
                  };
                } catch (error) {
                  console.error('Error adding comment to cell:', error);
                }
              }
            }
          });
        });

        // Auto-size columns
        worksheet.columns.forEach((column, i) => {
          const headerCell = worksheet.getRow(1).getCell(i + 1);
          const headerLength = (headerCell?.value?.toString() ?? '').length;
          const valueLengths = (column.values || []).slice(1).map(v => (v?.toString() ?? '').length);
          const calculatedWidth = Math.max(headerLength, ...valueLengths) + 2;
          column.width = Math.min(Math.max(calculatedWidth, 10), 30);
        });

        // Download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Payroll_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } catch (error) {
        console.error('Export failed:', error);
        setError(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };




const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setLoading(true);
  setUploadProgress(0);
  setImportErrors([]);
  setImportChanges([]);
  setPendingUpdates({ adjustments: [], comments: [] });

  try {
    // Validate payrollData exists
    if (!payrollData || payrollData.length === 0) {
      throw new Error('No payroll data available for comparison');
    }

    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    const changes: ImportChange[] = [];
    const newPendingUpdates = {
      adjustments: [] as PendingAdjustment[],
      comments: [] as PendingComment[]
    };

    // Process Headers
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    const headerMapping: Record<string, string> = {};
    
    headerRow.eachCell((cell, colNumber) => {
      const headerText = cell.text.toString().trim();
      headers.push(headerText);
      const matchingColumn = baseColumns.find(col => col.label === headerText);
      if (matchingColumn) {
        headerMapping[colNumber.toString()] = matchingColumn.key;
      }
    });

    // Validate Excel Format
    const requiredHeaders = baseColumns.map(col => col.label);
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    // Process Data Rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData: Record<string, any> = {};
      const commentsInRow: Record<string, string> = {};

      // Extract cell values and comments
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const columnKey = headerMapping[colNumber.toString()];
        if (!columnKey) return;

        let value: any = cell.value;
        if (typeof value === 'number') {
          value = value.toString();
        } else if (typeof value === 'object' && value !== null) {
          value = cell.text;
        } else {
          value = value?.toString() || '';
        }

        // Clean currency values
        const column = baseColumns.find(col => col.key === columnKey);
        if (column?.type === 'currency') {
          value = value.replace(/[^\d.-]/g, '');
        }

        rowData[columnKey] = value;

        // Extract comments
        if (cell.note) {
          let commentText = '';
          if (typeof cell.note === 'string') {
            commentText = cell.note;
          } else if (Array.isArray((cell as any).note.texts)) {
            commentText = (cell as any).note.texts.map((t: { text: string }) => t.text).join('');
          }
          
          if (commentText.trim()) {
            commentsInRow[columnKey] = commentText;
          }
        }
      });

      // Find Matching Employee
      const existingRow = payrollData.find(row => 
        (row.employee_no?.toString().trim() === rowData.employee_no?.toString().trim()) ||
        (row.employee_name?.toString().trim().toLowerCase() === rowData.employee_name?.toString().trim().toLowerCase())
      );

      if (!existingRow) {
        changes.push({
          employee_name: rowData.employee_name,
          employee_no: rowData.employee_no,
          changes: [{
            field: 'New Employee',
            current: 'N/A',
            imported: 'New record',
            difference: 'N/A'
          }],
          comments: Object.entries(commentsInRow).map(([columnKey, comment]) => ({
            field: baseColumns.find(col => col.key === columnKey)?.label || columnKey,
            comment
          }))
        });
        return;
      }

      const payrollId = existingRow.payroll_id || existingRow.id;
      const columnChanges: ChangeItem[] = [];

      // Compare each editable column
      baseColumns.forEach(col => {
        if (!col.editable) return;

        const cellKey = `${rowNumber-2}-${col.key}`; // rowNumber-2 because header is row 1 and we're 0-indexed

        const importValue = parseFloat(rowData[col.key]?.toString().replace(/[^\d.-]/g, '') || '0');
        let existingValue = 0;
        let itemType = '';
        let operation: 'add' | 'update' = 'update';
        let label = col.label;

        if (col.key.startsWith('payslip_')) {
          const [_, type, ...labelParts] = col.key.split('_');
          label = labelParts.join('_').replace(/_/g, ' ');
          itemType = type.charAt(0).toUpperCase() + type.slice(1);
          
          const item = existingRow.payslip_items?.find(i => 
            i.type.toLowerCase() === type.toLowerCase() && 
            i.label.toLowerCase() === label.toLowerCase()
          );
          existingValue = item?.amount || 0;
          operation = item ? 'update' : 'add';
        } 
        else if (col.key.startsWith('employer_')) {
          label = col.key.replace('employer_', '').replace(/_/g, ' ');
          itemType = 'Employer Contribution';
          
          const item = existingRow.employer_contributions?.find(i => 
            i.label.toLowerCase() === label.toLowerCase()
          );
          existingValue = item?.amount || 0;
          operation = item ? 'update' : 'add';
        }
        else {
          // Flat field
          existingValue = parseFloat((existingRow as any)[col.key]?.toString().replace(/[^\d.-]/g, '') || '0');
          itemType = 'FlatField';
        }

        if (Math.abs(importValue - existingValue) > 0.009) {
          if (itemType !== 'FlatField') {
            newPendingUpdates.adjustments.push({
              payroll_id: payrollId, // Corrected from payroll_id
              label,
              amount: importValue,
              type: itemType,
              operation
            });
          }

          columnChanges.push({
            field: col.label,
            current: existingValue.toFixed(2),
            imported: importValue.toFixed(2),
            difference: (importValue - existingValue).toFixed(2)
          });
        }

         // Update editedCells if there's a change
        if (Math.abs(importValue - existingValue) > 0.009) {
          setEditedCells(prev => new Map(prev).set(cellKey, {
            oldValue: existingValue,
            newValue: importValue
          }));
        }
        
      });

      // Store comments
      Object.entries(commentsInRow).forEach(([columnKey, comment]) => {
          const rowId = existingRow.employee_id || existingRow.payroll_id || existingRow.id || existingRow.employee_no;
          const cellKey = `${rowId}-${columnKey}`;
  
          // Store the comment using the consistent key format
          setComments(prev => new Map(prev).set(cellKey, comment));
        
        newPendingUpdates.comments.push({
          payroll_id: payrollId, // Corrected from payroll_id
          payslip_item_id: existingRow.employee_id,
          column_name: columnKey,
          comment
        });
      });

      if (columnChanges.length > 0 || Object.keys(commentsInRow).length > 0) {
        changes.push({
          employee_name: existingRow.employee_name,
          employee_no: existingRow.employee_no,
          changes: columnChanges,
          comments: Object.entries(commentsInRow).map(([columnKey, comment]) => ({
            field: baseColumns.find(col => col.key === columnKey)?.label || columnKey,
            comment
          }))
        });
      }
    });

    setPendingUpdates(newPendingUpdates);
    setImportChanges(changes.length > 0 ? changes : [{
      employee_name: "No changes detected",
      employee_no: "",
      changes: [{
        field: "All records",
        current: "No differences found",
        imported: "Data matches exactly",
        difference: "0.00"
      }],
      comments: []
    }]);
    setImportFile(file);

    

  } catch (err) {
    setImportErrors([err instanceof Error ? err.message : 'Failed to process import file']);
  } finally {
    setLoading(false);
  }
};

const renderChangesDetected = () => {
  if (importChanges.length === 0) return null;

  const isNoChanges = importChanges[0].employee_name === "No changes detected";

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">
          {isNoChanges ? "Import Results" : "Changes Detected"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {isNoChanges
            ? "The imported file matches your current payroll data exactly"
            : `${importChanges.length} record${importChanges.length !== 1 ? 's' : ''} with changes found`}
        </p>
      </div>

      {isNoChanges ? (
        <div className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Changes Required
          </h4>
          <p className="text-gray-600 mb-6">
            All payroll records match between the imported file and current data.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Changes Summary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {importChanges.map((change, index) => {
                  const rowIndex = payrollData.findIndex(row => 
                    row.employee_no === change.employee_no || 
                    row.employee_name === change.employee_name
                  );
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{change.employee_name}</div>
                        <div className="text-sm text-gray-500">{change.employee_no}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          {/* Changes */}
                          {change.changes.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-1">Data Changes:</div>
                              <div className="space-y-1">
                                {change.changes.map((item, itemIndex) => {
                                  const column = baseColumns.find(col => col.label === item.field);
                                  const columnKey = column?.key || '';
                                  const cellKey = getStableCellKey(payrollData[rowIndex], columnKey);//`${rowIndex}-${columnKey}`;
                                  const isEdited = editedCells.has(cellKey);
                                  
                                  return (
                                    <div key={itemIndex} className="grid grid-cols-4 gap-2 text-sm">
                                      <div className="font-medium text-gray-700">{item.field}:</div>
                                      <div className="text-gray-600">Current: {item.current}</div>
                                      <div className="text-gray-600">→ Import: {item.imported}</div>
                                      <div className="flex items-center">
                                        <span className={`${
                                          item.field !== 'New Employee' && parseFloat(item.difference) > 0
                                            ? 'text-green-600'
                                            : item.field !== 'New Employee'
                                              ? 'text-red-600'
                                              : 'text-gray-600'
                                        }`}>
                                          {item.field === 'New Employee' ? '' : `(${parseFloat(item.difference) > 0 ? '+' : ''}${item.difference})`}
                                        </span>
                                        {isEdited && (
                                          <span className="ml-2 text-xs text-blue-600">(Edited)</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {/* Comments */}
                          {change.comments.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-1">Comments:</div>
                              <div className="space-y-1">
                                {change.comments.map((comment, commentIndex) => (
                                  <div key={commentIndex} className="text-sm">
                                    <span className="font-medium text-gray-700">{comment.field}:</span>
                                    <span className="ml-2 text-gray-600">{comment.comment}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {change.changes[0]?.field === 'New Employee' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            New Employee
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Modified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total changes: {importChanges.reduce((sum, change) => sum + change.changes.length, 0)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setImportFile(null);
                  setImportChanges([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Confirm Import
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FileSpreadsheet className="w-6 h-6 mr-3 text-blue-600" />
            Export & Import
          </h2>

          {/* Author input for comments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment Author Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter author name for comments"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Export Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2 text-blue-600" />
                Export to Excel
              </h3>
              <p className="text-gray-600 mb-4">
                Export current payroll data with comments to Excel format. This will include all adjustments made in Step 2.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 mr-2 text-blue-600" />
                  All payroll data included
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 mr-2 text-blue-600" />
                  Comments preserved
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 mr-2 text-blue-600" />
                  Excel format (.xlsx)
                </div>
              </div>
              <button
                onClick={exportExcelWithComments}
                disabled={loading}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{loading ? 'Exporting...' : 'Export to Excel'}</span>
              </button>
            </div>

            {/* Import Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Import from Excel
              </h3>
              <p className="text-gray-600 mb-4">
                Import payroll data from Excel. File must match the exported template format.
              </p>
              
              <div className="space-y-4">
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImportExcel}
        className="hidden"
        id="excel-upload"
        ref={fileInputRef}
      />
      <label
        htmlFor="excel-upload"
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer flex justify-center"
      >
        {importFile ? importFile.name : 'Select Excel file to import'}
      </label>
    </div>
    
    {importFile && (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            setImportFile(null);
            setImportPreview([]);
            setImportChanges([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Clear File
        </button>
      </div>
    )}
                
                {importErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-red-800">Import Errors:</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {importErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>


        {/* Changes detected section */}
        {renderChangesDetected()}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Adjust
            </button>
            <button
              onClick={() => {
                if (!validateStepChange(4)) return;
                setCurrentStep(4);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continue to Publish
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Step 4: Publish
  const renderStep4 = () => {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Check className="w-6 h-6 mr-3 text-blue-600" />
            Publish Payroll
          </h2>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Employees</p>
                  <p className="text-2xl font-bold text-blue-900">{payrollData.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Gross</p>
                  <p className="text-2xl font-bold text-green-900">
                    RM {payrollData.reduce((sum, row) => sum + parseFloat(row.gross_salary?.toString() || '0'), 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Net</p>
                  <p className="text-2xl font-bold text-purple-900">
                    RM {payrollData.reduce((sum, row) => sum + parseFloat(row.net_salary?.toString() || '0'), 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Adjustments</p>
                  <p className="text-2xl font-bold text-orange-900">{editedCells.size}</p>
                </div>
                <Edit3 className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Warnings */}
          {publishWarnings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-red-800">Warnings</h3>
              </div>
              <ul className="space-y-2">
                {publishWarnings.map((warning, index) => (
                  <li key={index} className="flex items-center text-red-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-4">Payroll Summary Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gross Salary</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollData.slice(0, 5).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">{row.employee_name}</td>
                      <td className="px-3 py-2 text-sm text-gray-600">RM {parseFloat(row.gross_salary?.toString() || '0').toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">RM {parseFloat(row.net_salary?.toString() || '0').toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          DRAFT
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payrollData.length > 5 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  ... and {payrollData.length - 5} more employees
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          {/* <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Publish Settings
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={requireCommentOnEdit}
                  onChange={(e) => setRequireCommentOnEdit(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require comments for all edited cells</span>
              </label>
            </div>
          </div> */}

          {/* Navigation and Publish */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Export/Import
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50"
              >
                Back to Adjust
              </button>
              <button
                onClick={handlePublish}
                disabled={publishWarnings.length > 0 || isPublishing}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isPublishing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isPublishing ? 'Publishing...' : 'Publish Payroll'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Comment Modal Component
const CommentModal = () => {
  const [comment, setComment] = useState<string>("");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_LEN = 1000;

  // Prefill comment when opening for current cell
  useEffect(() => {
    if (currentCell && showCommentModal) {
      const row = payrollData[currentCell.rowIndex];
      const cellKey = `${row.employee_id || row.payroll_id || row.id}-${currentCell.columnKey}`;
      setComment(comments.get(cellKey) || "");
    }
  }, [currentCell, comments, showCommentModal]);

  const closeModal = useCallback(() => {
    setShowCommentModal(false);
    setCurrentCell(null);
    setComment('');
  }, []);

  const handleSaveComment = useCallback(() => {
    if (!currentCell) return;
    
    const row = payrollData[currentCell.rowIndex];
    const cellKey = `${row.employee_id || row.payroll_id || row.id}-${currentCell.columnKey}`;
    setComments((prev) => new Map(prev).set(cellKey, comment.trim()));

    if (currentCell.newValue !== undefined) {
      const rowIndex = payrollData.findIndex(row => 
        (row.employee_id || row.payroll_id || row.id || row.employee_no) === currentCell.rowId
      );
      
      if (rowIndex !== -1) {
        applyCellEdit(rowIndex, currentCell.columnKey, currentCell.newValue);
      }
    }
    closeModal();
  }, [applyCellEdit, currentCell, payrollData, setComments, comment, closeModal]);

  // Focus textarea on open + lock body scroll
  useEffect(() => {
    if (!showCommentModal) return;
    
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    textareaRef.current?.focus();
    
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showCommentModal]);

  // Keyboard: ESC to close, Ctrl/Cmd+Enter to save
  useEffect(() => {
    if (!showCommentModal) return;
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      if (cmdOrCtrl && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        if (!requireCommentOnEdit || comment.trim()) handleSaveComment();
      }
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCommentModal, comment, handleSaveComment, closeModal, requireCommentOnEdit]);

  // Close on outside click
  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const savingDisabled = requireCommentOnEdit && !comment.trim();

  // Early return must be at the very end, after all hooks
  if (!showCommentModal || !currentCell) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={handleBackdropMouseDown}
      aria-modal="true"
      role="dialog"
      aria-labelledby="comment-modal-title"
    >
      <div
        ref={panelRef}
        className="w-full max-w-lg rounded-2xl bg-white text-gray-900 shadow-xl ring-1 ring-black/10"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h3 id="comment-modal-title" className="text-xl font-semibold tracking-tight">
              Add Comment
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Column: <span className="font-medium">{String(currentCell.columnKey)}</span> &middot; Row{" "}
              <span className="font-medium">{currentCell.rowIndex + 1}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-4">
          <label htmlFor="comment-textarea" className="sr-only">
            Comment
          </label>
          <textarea
            id="comment-textarea"
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={MAX_LEN}
            rows={6}
            placeholder="Enter your comment..."
            className="block w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm leading-6 outline-none transition
                       placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            {requireCommentOnEdit ? (
              <span>Comment is required to save this edit.</span>
            ) : (
              <span>&nbsp;</span>
            )}
            <span>
              {comment.length}/{MAX_LEN}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 active:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveComment}
            disabled={savingDisabled}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white
                       ${savingDisabled ? "bg-blue-400 cursor-not-allowed opacity-70" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"}
                       focus:outline-none focus:ring-4 focus:ring-blue-100`}
            title="Ctrl/Cmd + Enter"
          >
            Save Comment
          </button>
        </div>
      </div>
    </div>
  );
};


  // Error display
  const ErrorAlert = useCallback(() => {
    if (!error) return null;

    return (
      <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-md p-4 z-50 max-w-md">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <div>
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }, [error]);

  const AdjustmentModal = () => {
  if (!showAdjustmentModal || !selectedRowForAdjustment) return null;


  // ✅ Fix: modal submit builds a clean object (no ".currentAdjustment")
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentAdjustment) return;

  const payload: PayslipAdjustment = {
    payroll_id: selectedRowForAdjustment.payroll_id || selectedRowForAdjustment.id,
    label: currentAdjustment.label,
    amount: currentAdjustment.amount,
    type: currentAdjustment.type,          // 'Earning' | 'Deduction' | 'Statutory' | 'Employer Contribution'
    operation: currentAdjustment.operation // 'add' | 'update' | 'delete'
  };

  handleAdjustPayslipItem(payload);
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium mb-4">
          {currentAdjustment?.operation === 'delete' ? 'Delete' : currentAdjustment?.operation === 'update' ? 'Update' : 'Add'} Payslip Item
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {currentAdjustment?.operation !== 'delete' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={currentAdjustment?.label || ''}
                    onChange={(e) => setCurrentAdjustment(prev => ({
                      ...prev!,
                      label: e.target.value
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentAdjustment?.amount || ''}
                    onChange={(e) => setCurrentAdjustment(prev => ({
                      ...prev!,
                      amount: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={currentAdjustment?.type || ''}
                onChange={(e) => setCurrentAdjustment(prev => ({
                  ...prev!,
                  type: e.target.value as any
                }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Type</option>
                <option value="Earning">Earning</option>
                <option value="Deduction">Deduction</option>
                <option value="Statutory">Statutory</option>
                <option value="Employer Contribution">Employer Contribution</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowAdjustmentModal(false);
                setCurrentAdjustment(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md ${
                currentAdjustment?.operation === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {currentAdjustment?.operation === 'delete' ? 'Delete' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
  
  // Main render
  return (
    <div className="min-h-screen bg-gray-100">
      {renderStepNavigation()}
      
      <div className="py-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      <CommentModal />
      {showAdjustmentModal && <AdjustmentModal />}
      {error && <ErrorAlert />}
    </div>
  );
};

export default PayrollGenerationWizard;
