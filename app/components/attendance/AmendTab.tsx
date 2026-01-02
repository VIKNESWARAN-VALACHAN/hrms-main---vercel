
'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
import { useTheme } from '../../components/ThemeProvider';
import type { Filters as BaseFilters } from '../../utils/attendanceApi';
import { format } from 'date-fns';
import { FaChevronDown, FaRegCalendarTimes } from "react-icons/fa";
import { BsCheckCircle, BsXCircle, BsEye, BsPencilSquare } from "react-icons/bs";
import { API_BASE_URL } from '@/app/config';

// --- Interfaces ---

interface FilterOptionItem {
  id: string | number;
  name: string;
}

interface Filters {
  // KEEP ONLY REQUIRED FILTERS (same as AttendanceTab)
  company_id: string[];
  department_id: string[];
  position: string[];
  employee_id: string[];
  status: string[];
  start_date: string;
  end_date: string;
  search: string;
  
  // REMOVED FILTERS (commented out)
  // employee_status: string[];
  // type: string[];
  // nationality: string[];
  // jobLevel: string[];
}

type CompanyOption = {
  id: number;
  name: string;
};

type DepartmentOption = {
  id: number;
  department_name: string;
};

interface StatusOption {
  id: string | number;
  name: string;
  code?: string;
  display_name?: string;
}

// Based on old code structure
interface AmendRecord {
  id: number;
  employee_name: string;
  employee_no?: string;
  company_name: string;
  department_name: string;
  department?: string;
  attendance_date: string;
  status: string;
  attendance_day_id: number;
  employee_id: number;
  amend_date: string | null;
  amend_by: string | null;
  date?: string; // For backward compatibility
  _justAmended?: boolean;
}

interface AmendEmployeeData {
  id: number;
  employee_name: string;
  company_name: string;
  department_name: string;
  status: string;
  attendance_date: string;
  attendance_day_id: number;
  employee_id: number;
}

interface AmendTabProps {
  filters: BaseFilters;
  onFilterChange: (filters: Partial<BaseFilters>) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  user: any;
}

// --- Helper Functions ---

function normalizeStatusForFilter(status: string): string {
  if (!status) return status;
  
  const statusMap: Record<string, string> = {
    'Present': 'PRESENT',
    'Absent': 'ABSENT',
    'Late': 'LATE',
    'Partial': 'PARTIAL',
    'Off Day': 'OFFDAY',
    'Off-Day': 'OFFDAY',
    'Partial/Incomplete': 'PARTIAL',
    'Early Departure': 'PARTIAL',
    'Half Day': 'PARTIAL'
  };
  
  return statusMap[status] || status.toUpperCase();
}

function normalizeStatusForDisplay(status: string): string {
  if (!status) return 'Unknown';
  
  const statusUpper = status.toUpperCase();
  
  switch (statusUpper) {
    case 'PRESENT':
      return 'Present';
    case 'ABSENT':
      return 'Absent';
    case 'LATE':
      return 'Late';
    case 'PARTIAL':
      return 'Partial';
    case 'OFFDAY':
      return 'Off Day';
    case 'EARLY_DEPARTURE':
      return 'Early Departure';
    case 'HALF_DAY':
      return 'Half Day';
    default:
      return status;
  }
}

// --- Helper Components ---

const ProfessionalMultiSelectFilter = ({ 
  name, 
  value, 
  options, 
  onChange, 
  placeholder,
  displayTransform = (item: string | FilterOptionItem) => typeof item === 'string' ? item : item.name,
  theme = 'light'
}: { 
  name: keyof Filters;
  value: string[];
  options: (string | FilterOptionItem | undefined | null)[];
  onChange: (name: keyof Filters, value: string[]) => void;
  placeholder: string;
  displayTransform?: (item: string | FilterOptionItem) => string;
  theme?: 'light' | 'dark';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedFromBottom, setClickedFromBottom] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const validOptions = useMemo(() => {
    return options
      .filter((option): option is string | FilterOptionItem => 
        option !== undefined && option !== null && option !== ''
      )
      .map(option => {
        if (typeof option === 'string') {
          return { id: option, name: option };
        }
        return {
          id: String(option.id),
          name: String(option.name || option.id)
        };
      });
  }, [options]);

  const optionMap = useMemo(() => {
    const map = new Map<string, string>();
    validOptions.forEach(option => {
      const displayName = displayTransform({ id: option.id, name: option.name });
      map.set(option.id, displayName);
    });
    return map;
  }, [validOptions, displayTransform]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return validOptions;
    return validOptions.filter(option => {
      const displayName = optionMap.get(option.id) || option.name;
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [validOptions, searchTerm, optionMap]);

  const handleToggle = useCallback((optionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const newValue = value.includes(optionId)
      ? value.filter(v => v !== optionId)
      : [...value, optionId];
    
    onChange(name, newValue);
    setClickedFromBottom(optionId);
  }, [value, name, onChange]);

  const handleSelectAll = useCallback(() => {
    const allIds = validOptions.map(option => option.id);
    onChange(name, allIds);
  }, [validOptions, name, onChange]);

  const handleClear = useCallback(() => {
    onChange(name, []);
  }, [name, onChange]);

  const selectedPercentage = validOptions.length > 0 
    ? Math.round((value.length / validOptions.length) * 100) 
    : 0;

  const handleApply = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setClickedFromBottom(null);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (clickedFromBottom && optionsContainerRef.current) {
      const clickedElement = document.getElementById(`option-${clickedFromBottom}`);
      if (clickedElement) {
        clickedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [clickedFromBottom]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleApply();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleApply]);

  const renderSelectedItems = () => {
    if (value.length === 0) {
      return (
        <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Select {placeholder.toLowerCase()}...
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {value.slice(0, 2).map(val => {
          const displayName = optionMap.get(val) || val;
          return (
            <span 
              key={`selected-${val}`}
              className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
            >
              {displayName}
            </span>
          );
        })}
        {value.length > 2 && (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
            +{value.length - 2} more
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="form-control w-full">
        <label className="label pb-3">
          <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {placeholder}
          </span>
        </label>
        
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
            theme === 'light' 
              ? 'bg-white border-slate-200 hover:border-slate-300' 
              : 'bg-slate-800 border-slate-600 hover:border-slate-500'
          } ${
            value.length > 0 
              ? 'border-blue-500 bg-blue-50 shadow-sm' 
              : ''
          }`}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <div className="flex flex-col items-start flex-1 min-w-0">
            {renderSelectedItems()}
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {value.length > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-blue-600">{value.length} selected</span>
                <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${selectedPercentage}%` }}
                  />
                </div>
              </div>
            )}
            <div className={`w-2 h-2 border-r-2 border-b-2 border-slate-400 transform transition-transform duration-200 ${
              isOpen ? 'rotate-45 -translate-y-0.5' : '-rotate-45 translate-y-0.5'
            }`} />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleApply}
            aria-hidden="true"
          />
          
          <div 
            ref={modalRef}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden z-10"
          >
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Choose multiple options to filter your results
                </p>
              </div>
              <button 
                onClick={handleApply}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                type="button"
                aria-label="Close modal"
              >
                <div className="w-4 h-4 relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform -rotate-45" />
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform rotate-45" />
                </div>
              </button>
            </div>

            <div className="p-4 border-b bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="form-control flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={`Search ${placeholder.toLowerCase()}...`}
                    className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={`Search ${placeholder}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold">{value.length}</span> of{' '}
                    <span className="font-semibold">{validOptions.length}</span> selected
                  </div>
                  <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${selectedPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={value.length === validOptions.length}
                    type="button"
                  >
                    Select All
                  </button>
                  {value.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
                      type="button"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div 
              ref={optionsContainerRef}
              className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] bg-white"
              onScroll={() => setClickedFromBottom(null)}
            >
              {filteredOptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-0.5 bg-slate-400 rotate-45 absolute" />
                    <div className="w-6 h-0.5 bg-slate-400 -rotate-45 absolute" />
                  </div>
                  <h4 className="font-semibold text-slate-700 mb-2">No options found</h4>
                  <p className="text-slate-500 text-sm">
                    {searchTerm ? `No matches for "${searchTerm}"` : 'No options available'}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredOptions.map((option) => {
                    const displayName = optionMap.get(option.id) || option.name;
                    const isSelected = value.includes(option.id);
                    
                    return (
                      <div
                        key={`${name}-${option.id}`}
                        id={`option-${option.id}`}
                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(option.id, e);
                        }}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                      >
                        <div 
                          className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-slate-800 break-words">
                            {displayName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="h-4" />
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{value.length}</span> options selected
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                    type="button"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DateRangeFilter = ({
  title,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onClear,
  theme = 'light'
}: {
  title: string;
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  onClear: () => void;
  theme?: 'light' | 'dark';
}) => {
  return (
    <div className="form-control w-full">
      <label className="label pb-3">
        <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
          {title}
        </span>
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="date"
          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
        />
        <span className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>to</span>
        <input
          type="date"
          className={`input input-bordered w-full ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-slate-100'}`}
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          disabled={!startDate}
        />
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={onClear}
            className={`btn btn-sm ${theme === 'light' ? 'btn-ghost' : 'btn-outline'}`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

function safeFormatDate(dateStr?: string | null, fmt: string = 'MMM dd, yyyy') {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return format(d, fmt);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}

function formatSingaporeTime(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    // Convert to Singapore time (UTC+8)
    const singaporeTime = new Date(date.getTime() + (8 * 60 * 60 * 1000));
    return format(singaporeTime, 'MM/dd/yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

export default function AmendTab({
  filters: baseFilters,
  onFilterChange,
  onShowNotification,
  user
}: AmendTabProps) {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportScope, setExportScope] = useState<'filtered' | 'current'>('filtered');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'employee_name', 'employee_no', 'company_name', 'department', 
    'attendance_date', 'status', 'amend_by', 'amend_date'
  ]);
  
  // Amend modal state
  const [isAmendModalOpen, setIsAmendModalOpen] = useState(false);
  const [amendEmployee, setAmendEmployee] = useState<AmendEmployeeData | null>(null);
  const [newStatus, setNewStatus] = useState<string>('absent');
  const [isSaving, setIsSaving] = useState(false);

  const exportColumns = [
    { id: 'employee_name', label: 'Employee Name' },
    { id: 'employee_no', label: 'Employee No' },
    { id: 'company_name', label: 'Company' },
    { id: 'department', label: 'Department' },
    { id: 'attendance_date', label: 'Date' },
    { id: 'status', label: 'Status' },
    { id: 'amend_by', label: 'Amended By' },
    { id: 'amend_date', label: 'Amended Date' }
  ];

  // Initialize internal filters state from baseFilters - SIMPLIFIED VERSION
  const [filters, setFilters] = useState<Filters>({
    // KEPT FILTERS (same as AttendanceTab)
    company_id: baseFilters.company_id ? [String(baseFilters.company_id)] : [],
    department_id: baseFilters.department_id ? [String(baseFilters.department_id)] : [],
    position: [],
    employee_id: baseFilters.employee_id ? [String(baseFilters.employee_id)] : [],
    status: baseFilters.status ? [String(baseFilters.status)] : [],
    start_date: baseFilters.start_date || '',
    end_date: baseFilters.end_date || '',
    search: ''
    
    // REMOVED FILTERS (no longer included)
    // employee_status: [],
    // type: [],
    // nationality: [],
    // jobLevel: [],
  });

  // Fetch amend data - using 'amend' endpoint
  const { data, total, isLoading, isFetching, error, refetch } = useAttendanceData<AmendRecord>(
    'amend',
    baseFilters,
    page,
    limit
  );

  // Fetch filter options
  const { options: filterOptions } = useFilterOptions('all', baseFilters.company_id, false);

  const companies = useMemo(() => (filterOptions as any)?.companies || [], [filterOptions]);
  const departments = useMemo(() => (filterOptions as any)?.departments || [], [filterOptions]);
  const employees = useMemo(() => (filterOptions as any)?.employees || [], [filterOptions]);
  
  // REMOVED: No longer fetching these options
  // const employeeStatuses = ['Active', 'Inactive', 'Resigned'];
  const positions = useMemo(() => (filterOptions as any)?.positions || [], [filterOptions]);
  
  // FIXED: Only show Absent and Off-day in status filter
  const statusOptions = useMemo(() => {
    const allStatuses = (filterOptions as any)?.statuses || [];
    console.log('🔍 All statuses from API:', allStatuses);
    
    // Filter to only show "Absent" and "Off-day" (case-insensitive)
    const filteredStatuses = allStatuses.filter((status: any) => {
      if (!status) return false;
      
      // Check if status is string or object
      const statusName = typeof status === 'string' 
        ? status 
        : (status.name || status.code || String(status.id));
      
      const statusNameLower = statusName.toString().toLowerCase();
      
      return statusNameLower.includes('absent') || 
             statusNameLower.includes('offday') ||
             statusNameLower.includes('off-day') ||
             statusNameLower.includes('off day');
    });
    
    console.log('🔍 Filtered statuses:', filteredStatuses);
    return filteredStatuses;
  }, [filterOptions]);

  // Debug: Log current filters and data
  useEffect(() => {
    console.log('🔍 AmendTab - Current Filters State:', {
      filters: filters,
      baseFilters: baseFilters,
      isFetching: isFetching,
      isLoading: isLoading,
      dataCount: data?.length || 0,
      sampleData: data?.[0],
      filterOptions: filterOptions,
      departments: departments,
      statusOptions: statusOptions
    });
  }, [filters, baseFilters, isFetching, isLoading, data, filterOptions, departments, statusOptions]);

  const handleFilterChange = useCallback((name: keyof Filters, value: any) => {
    console.log(`🔄 AmendTab - Filter Change: ${name} =`, value);
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle quick date selection
  const handleQuickDateSelect = (option: string) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (option) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(new Date().setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        const dayOfWeek = today.getDay();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastWeek':
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        lastWeekEnd.setHours(23, 59, 59, 999);
        startDate = new Date(lastWeekEnd);
        startDate.setDate(lastWeekEnd.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = lastWeekEnd;
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        setActiveQuickDate(null);
        return;
    }
    
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    setFilters(prev => ({
      ...prev,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    }));
    
    setActiveQuickDate(option);
  };

  // Enhanced filter change handler
  const enhancedFilterChange = useCallback((name: keyof Filters, value: any) => {
    console.log(`🎯 AmendTab - Enhanced Filter Change: ${name} =`, value);
    
    if (name === 'status') {
      console.log('🎯 Status filter change details:', {
        rawValue: value,
        normalizedValue: Array.isArray(value) 
          ? value.map(v => normalizeStatusForFilter(v))
          : normalizeStatusForFilter(value),
        statusOptions: statusOptions
      });
    }
    
    handleFilterChange(name, value);
  }, [handleFilterChange, statusOptions]);

  // Enhanced page change handler
  const enhancedPageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetFilters = () => {
    setFilters({
      // KEPT FILTERS (same as AttendanceTab)
      company_id: [],
      department_id: [],
      position: [],
      employee_id: [],
      status: [],
      start_date: '',
      end_date: '',
      search: ''
      
      // REMOVED FILTERS
      // employee_status: [],
      // type: [],
      // nationality: [],
      // jobLevel: [],
    });
    setActiveQuickDate(null);
  };

  // Sync internal filters to parent on change - SIMPLIFIED VERSION
  useEffect(() => {
    console.log('🔄 AmendTab - Syncing filters to parent:', {
      currentFilters: filters,
      isFetching: isFetching
    });
    
    // Normalize status values before sending to API
    const normalizedStatus = filters.status.length > 0 
      ? filters.status.map(s => normalizeStatusForFilter(s))
      : [];
    
    // Simplified filter mapping - only include filters that exist in both components
    const updatedBaseFilters: Partial<BaseFilters> = {
      // Convert arrays to comma-separated strings for API
      company_id: filters.company_id.length > 0 ? filters.company_id.join(',') : undefined,
      department_id: filters.department_id.length > 0 ? filters.department_id.join(',') : undefined,
      employee_id: filters.employee_id.length > 0 ? filters.employee_id.join(',') : undefined,
      status: normalizedStatus.length > 0 ? normalizedStatus.join(',') : undefined,
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      position: filters.position.length > 0 ? filters.position.join(',') : undefined,
      search: filters.search || undefined
    };
    
    console.log('📤 AmendTab - Sending to API:', updatedBaseFilters);
    
    onFilterChange(updatedBaseFilters);
    setPage(1);
  }, [filters, onFilterChange]);

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search') return count; // Don't count search in active filter count
    if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
    if (value) return count + 1;
    return count;
  }, 0);

  const getStatusBadgeClass = (status: string) => {
    const normalizedStatus = normalizeStatusForFilter(status);
    switch (normalizedStatus) {
      case 'PRESENT': return 'badge-success';
      case 'ABSENT': return 'badge-error';
      case 'LATE': return 'badge-warning';
      case 'PARTIAL': return 'badge-info';
      case 'OFFDAY': return 'badge-secondary';
      default: return 'badge-ghost';
    }
  };

  // Handle amend button click
  const openAmendModal = (record: AmendRecord) => {
    const amendEmployeeData: AmendEmployeeData = {
      id: record.id,
      employee_name: record.employee_name,
      company_name: record.company_name,
      department_name: record.department_name || record.department || '',
      status: record.status,
      attendance_date: record.attendance_date || record.date || '',
      attendance_day_id: record.attendance_day_id,
      employee_id: record.employee_id
    };
    
    setAmendEmployee(amendEmployeeData);
    // Set opposite status
    setNewStatus(record.status.toLowerCase() === 'offday' ? 'absent' : 'offday');
    setIsAmendModalOpen(true);
  };

  // Handle amendment submission
  const handleAmendment = async (employee: AmendEmployeeData, status: string) => {
    if (!employee) return;
    
    setIsSaving(true);
    try {
      // Add detailed debug logging
      console.log('🔍 Amendment Debug:', {
        employee,
        selectedStatus: status,
        currentStatus: employee.status,
        statusLower: employee.status?.toLowerCase(),
        newStatus: status.toLowerCase() === 'offday' ? 'offday' : 'absent'
      });
      
      // Get status ID based on status
      const statusId = status.toLowerCase() === 'absent' ? 2 : 
                      status.toLowerCase() === 'offday' ? 5 : 0;
      
      console.log('📊 Status ID Mapping:', {
        inputStatus: status,
        statusId: statusId,
        expected: status.toLowerCase() === 'offday' ? 'OFFDAY (5)' : 'ABSENT (2)'
      });
      
      if (statusId === 0) {
        throw new Error('Invalid status selected');
      }

      // Get user ID
      const userId = user?.id || localStorage.getItem('user_id') || 'unknown';
      
      const payload = {
        attendance_day_id: employee.attendance_day_id,
        employee_id: employee.employee_id,
        status_id: statusId,
        amended_by: userId
      };
      
      console.log('📤 Sending payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/api/attendance/amendment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error('Failed to update attendance status');
      }
      
      const result = await response.json();
      console.log('✅ Amendment successful:', result);
      
      // Show success notification
      onShowNotification('Attendance amendment submitted successfully!', 'success');
      
      // Close modal
      setIsAmendModalOpen(false);
      setAmendEmployee(null);
      
      // Force refresh data immediately
      console.log('🔄 Refreshing data...');
      await refetch();
      
    } catch (err: any) {
      console.error('❌ Error submitting amendment:', err);
      onShowNotification(err.message || 'Failed to submit amendment. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

// FIXED: Handle export for both current page and all filtered results
const handleExport = async () => {
  setIsExporting(true);
  try {
    const queryParams = new URLSearchParams();
    
    console.log('🔍 [FRONTEND EXPORT DEBUG] Starting export with:', {
      exportScope,
      currentPage: page,
      limit: limit,
      dataCount: data?.length || 0,
      totalRecords: total,
      baseFilters
    });
    
    // Add current filters
    Object.entries(baseFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    // CRITICAL FIX: Send different parameters based on exportScope
    if (exportScope === 'current') {
      // For current page only - send page and limit
      queryParams.append('page', String(page));
      queryParams.append('limit', String(limit));
      queryParams.append('current_page_only', 'true');
      console.log(`📄 Exporting current page: Page ${page}, Limit ${limit}`);
    } else {
      // For all filtered results - send limit=0 (or don't send page/limit)
      queryParams.append('page', '1'); // Always page 1 for all results
      queryParams.append('limit', '0'); // Limit 0 means "get all records"
      queryParams.append('current_page_only', 'false');
      console.log('📄 Exporting all filtered results (limit=0)');
    }
    
    // Add selected columns
    queryParams.append('columns', selectedColumns.join(','));
    
    // Add export type identifier for backend
    queryParams.append('export_type', 'amend');
    
    const url = `${API_BASE_URL}/api/attendance/export/amend?${queryParams.toString()}`;
    console.log('📤 Export URL:', url);
    console.log('📤 Export Query Params:', Object.fromEntries(queryParams));
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('hrms_token')}`
      }
    });
    
    console.log('📥 Export response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Export failed with response:', errorText);
      throw new Error(`Export failed: ${response.status} ${errorText}`);
    }
    
    const blob = await response.blob();
    const urlObject = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlObject;
    
    // Generate filename based on export scope
    let filename;
    if (exportScope === 'current') {
      filename = `amend_export_page${page}_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    } else {
      filename = `amend_export_all_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    }
    
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(urlObject);
    document.body.removeChild(a);
    
    // Show appropriate success message
    if (exportScope === 'current') {
      onShowNotification(`Exported ${data?.length || 0} records from current page`, 'success');
    } else {
      onShowNotification(`Exporting all filtered results...`, 'success');
    }
    
    setIsExportModalOpen(false);
    
  } catch (err: any) {
    console.error('❌ Export error details:', err);
    onShowNotification(`Export failed: ${err.message}`, 'error');
  } finally {
    setIsExporting(false);
  }
};

  // Get department display name
  const getDepartmentDisplay = (item: AmendRecord) => {
    // Try department_name first, then department, then fallback
    return item.department_name || item.department || '--';
  };

  if (error) {
    return (
      <div className={`alert alert-error mb-4 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-800'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${theme === 'light' ? 'text-yellow-800' : 'text-yellow-300'}`}>
              🐛 AmendTab Debug Panel
            </h3>
          </div>
          <div className="text-xs space-y-1">
            <div><strong>Data Count:</strong> {data?.length || 0}</div>
            <div><strong>Current Page:</strong> {page}</div>
            <div><strong>Status Options (Filtered):</strong> {statusOptions.length}</div>
            <div><strong>Export Scope:</strong> {exportScope}</div>
            <div><strong>Current Status Filter:</strong> {JSON.stringify(filters.status)}</div>
          </div>
        </div>
      )}

      {/* Global Loading Overlay */}
      {isFetching && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className={`p-6 rounded-xl shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                {isLoading ? 'Loading amend records...' : 'Updating amend records...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
            Attendance Amendment
          </h2>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
            View and amend attendance records
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${
              isFilterOpen 
                ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') 
                : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')
            }`}
            disabled={isFetching}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            {isFetching && (
              <div className="loading loading-spinner loading-xs ml-2"></div>
            )}
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className={`btn btn-sm sm:btn-md flex-1 sm:flex-none flex items-center gap-2 ${theme === 'light' ? 'btn-outline btn-primary' : 'btn-outline btn-info'}`}
            disabled={isFetching}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="join shadow-sm overflow-x-auto w-full sm:w-auto">
          <div className="flex gap-1 sm:gap-0">
            {['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth'].map((opt) => (
              <button 
                key={opt}
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${activeQuickDate === opt ? (theme === 'light' ? 'btn-primary' : 'bg-blue-600 text-white') : (theme === 'light' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600')}`}
                onClick={() => handleQuickDateSelect(opt)}
                disabled={isFetching}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
            {activeQuickDate && (
              <button 
                className={`join-item btn btn-xs sm:btn-sm whitespace-nowrap ${theme === 'light' ? 'btn-error text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                onClick={() => {
                  setFilters(prev => ({ ...prev, start_date: '', end_date: '' }));
                  setActiveQuickDate(null);
                }}
                disabled={isFetching}
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search employee..."
            className={`input input-sm sm:input-md input-bordered w-full pl-10 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
            value={filters.search}
            onChange={(e) => enhancedFilterChange('search', e.target.value)}
            disabled={isFetching}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-spinner loading-xs"></div>
          )}
        </div>
      </div>

      {/* Advanced Filters - ONLY SHOW REQUIRED FILTERS (same as AttendanceTab) */}
      {isFilterOpen && (
        <div className={`relative rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
          <div className="px-6 py-5 border-b bg-slate-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Advanced Filters</h2>
                <p className="text-slate-600 text-sm mt-1">Refine your amend records with precision filters</p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-300 transition-colors"
                  onClick={() => setIsFilterOpen(false)}
                  disabled={isFetching}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 text-sm bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors font-medium"
                  onClick={resetFilters}
                  disabled={isFetching}
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* KEPT FILTERS (same as AttendanceTab) */}
              <ProfessionalMultiSelectFilter
                name="company_id"
                value={filters.company_id}
                options={companies}
                onChange={enhancedFilterChange}
                placeholder="Company"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="department_id"
                value={filters.department_id}
                options={departments}
                displayTransform={(item: any) => item.department_name || item.name}
                onChange={enhancedFilterChange}
                placeholder="Department"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="position"
                value={filters.position}
                options={positions}
                onChange={enhancedFilterChange}
                placeholder="Position"
                theme={theme}
              />
              <ProfessionalMultiSelectFilter
                name="employee_id"
                value={filters.employee_id}
                options={employees}
                onChange={enhancedFilterChange}
                placeholder="Employee"
                theme={theme}
              />
              
              {/* FIXED: Status filter - ONLY Absent and Off-day */}
              <ProfessionalMultiSelectFilter
                name="status"
                value={filters.status}
                options={statusOptions}
                displayTransform={(item: any) => {
                  // Prioritize code if available, otherwise use name
                  if (item && typeof item === 'object') {
                    return item.code || item.name || String(item.id);
                  }
                  return String(item);
                }}
                onChange={enhancedFilterChange}
                placeholder="Attendance Status"
                theme={theme}
              />
              
              <DateRangeFilter
                title="Attendance Date Range"
                startDate={filters.start_date}
                endDate={filters.end_date}
                onStartChange={(date) => enhancedFilterChange('start_date', date)}
                onEndChange={(date) => enhancedFilterChange('end_date', date)}
                onClear={() => {
                  enhancedFilterChange('start_date', '');
                  enhancedFilterChange('end_date', '');
                }}
                theme={theme}
              />

              {/* REMOVED FILTERS: 
                  - Employee Status (employee_status)
                  - Employment Type (type)
                  - Nationality (nationality)
                  - Job Level (jobLevel)
              */}
            </div>
          </div>
        </div>
      )}

      {/* Amend Records Table */}
      <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="loading loading-spinner loading-lg mx-auto"></div>
            <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
              Loading amend records...
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
                  <tr>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Employee</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Company</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Department</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Date</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Status</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Amended By</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Amended Date</th>
                    <th className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr
                      key={`${item.id}-${idx}`}
                      className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'} ${idx !== data.length - 1 ? `${theme === 'light' ? 'border-b border-slate-200' : 'border-b border-slate-600'}` : ''} ${item._justAmended ? `${theme === 'light' ? 'bg-green-100' : 'bg-green-900'} animate-pulse` : ''}`}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                              {item.employee_name}
                            </div>
                            {item.employee_no && (
                              <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                                {item.employee_no}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {item.company_name || '--'}
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {getDepartmentDisplay(item)}
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {safeFormatDate(item.attendance_date || item.date)}
                      </td>
                      <td>
                        <span className={`badge ${
                          item.status?.toLowerCase() === 'present' ? 'badge-success' :
                          item.status?.toLowerCase() === 'late' ? 'badge-warning' :
                          item.status?.toLowerCase() === 'absent' ? 'badge-error' :
                          item.status?.toLowerCase() === 'partial' ? 'badge-info' :
                          item.status?.toLowerCase() === 'offday' ? 'badge-neutral' :
                          'badge-ghost'
                        }`}>
                          {normalizeStatusForDisplay(item.status)}
                        </span>
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {item.amend_by || '--'}
                      </td>
                      <td className={`${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {/* Only show Amended Date if Amended By exists */}
                        {item.amend_by ? (item.amend_date ? formatSingaporeTime(item.amend_date) : '--') : '--'}
                      </td>
                      <td>
                        {(item.status?.toLowerCase() === 'offday' ||
                          item.status?.toLowerCase() === 'absent') && (
                            <button
                              className={`btn btn-sm btn-outline ${theme === 'light' ? 'border-slate-600 text-slate-600 hover:bg-slate-600' : 'border-slate-400 text-slate-400 hover:bg-slate-400'} hover:text-white`}
                              onClick={() => openAmendModal(item)}
                              disabled={isFetching || isSaving}
                            >
                              Amend
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm"
                      onClick={() => enhancedPageChange(Math.max(1, page - 1))}
                      disabled={page === 1 || isFetching}
                    >
                      {isFetching ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : 'Previous'}
                    </button>
                    <button className="btn btn-sm btn-disabled">
                      Page {page}
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => enhancedPageChange(page + 1)}
                      disabled={page * limit >= total || isFetching}
                    >
                      {isFetching ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : 'Next'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <p className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>
              No amend records found for the selected filters.
            </p>
          </div>
        )}
      </div>

      {/* Amendment Modal */}
      {isAmendModalOpen && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative">
            <div className="card bg-base-100">
              <div className="card-body p-0">
                <h3 className="card-title font-bold text-lg border-b pb-3">
                  Amend Attendance Status
                </h3>

                <div className="py-4">
                  {/* Employee Info with Avatar */}
                  <div className="flex items-center mb-4">
                    <div>
                      <div className="font-semibold text-lg">{amendEmployee?.employee_name}</div>
                      {amendEmployee?.employee_id && (
                        <div className="text-sm opacity-75">ID: {amendEmployee.employee_id}</div>
                      )}
                      <div className="text-sm opacity-75 flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {amendEmployee?.company_name}
                      </div>
                      <div className="text-sm opacity-75 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {amendEmployee?.department_name || '--'}
                      </div>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Current Status */}
                  <div className="mb-4">
                    <span className="text-sm font-medium opacity-75">Current Status</span>
                    <div className="mt-1">
                      <span className={`badge ${
                          amendEmployee?.status?.toLowerCase() === 'absent' ? 'badge-error' :
                          amendEmployee?.status?.toLowerCase() === 'offday' ? 'badge-neutral' :
                          'badge-ghost'
                        }`}>
                        {amendEmployee?.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* New Status Selection */}
                  <div>
                    <span className="text-sm font-medium opacity-75 block mb-3">Select New Status</span>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex flex-col items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                          newStatus === 'absent' ? 'border-primary bg-primary/10' : 'border-base-300 hover:bg-base-200'
                        }`}>
                        <input
                          type="radio"
                          className="radio radio-primary radio-sm"
                          name="status"
                          checked={newStatus === 'absent'}
                          onChange={() => setNewStatus('absent')}
                        />
                        <div className="flex items-center gap-2 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="font-medium">Absent</span>
                        </div>
                      </label>
                      <label className={`flex flex-col items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                          newStatus === 'offday' ? 'border-primary bg-primary/10' : 'border-base-300 hover:bg-base-200'
                        }`}>
                        <input
                          type="radio"
                          className="radio radio-primary radio-sm"
                          name="status"
                          checked={newStatus === 'offday'}
                          onChange={() => setNewStatus('offday')}
                        />
                        <div className="flex items-center gap-2 ">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Off-day</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-action border-t pt-3">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsAmendModalOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => amendEmployee && handleAmendment(amendEmployee, newStatus)}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Submitting...' : 'Submit Amendment'}
                  </button>
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setIsAmendModalOpen(false)}>close</button>
            </form>
          </div>
        </dialog>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isExporting && setIsExportModalOpen(false)}
          />
          <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Export Amend Records</h3>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                disabled={isExporting}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Export Scope */}
              <div>
                <label className={`block text-sm font-semibold mb-3 uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                  Export Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setExportScope('filtered')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      exportScope === 'filtered'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'filtered' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {exportScope === 'filtered' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>All Filtered Results</div>
                      <div className="text-xs text-gray-500">Export all {total} records matching filters</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setExportScope('current')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      exportScope === 'current'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportScope === 'current' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {exportScope === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Current Page Only</div>
                      <div className="text-xs text-gray-500">
                        Export only the {data?.length || 0} records on this page (Page {page})
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Column Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                    Select Columns
                  </label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedColumns(exportColumns.map(c => c.id))}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Select All
                    </button>
                    <button 
                      onClick={() => setSelectedColumns(['employee_name', 'attendance_date', 'status', 'amend_by'])}
                      className="text-xs text-gray-500 hover:underline font-medium"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-900/50 border-slate-700'}`}>
                  {exportColumns.map(col => (
                    <label key={col.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary"
                        checked={selectedColumns.includes(col.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColumns([...selectedColumns, col.id]);
                          } else {
                            setSelectedColumns(selectedColumns.filter(id => id !== col.id));
                          }
                        }}
                      />
                      <span className={`text-sm group-hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                        {col.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex justify-end gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800/50'}`}>
              <button
                onClick={() => setIsExportModalOpen(false)}
                disabled={isExporting}
                className={`btn btn-ghost ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || selectedColumns.length === 0}
                className={[
                  'btn btn-primary',
                  'min-w-[160px]',
                  'h-11',
                  'px-5',
                  'relative inline-flex items-center justify-center gap-2',
                  'disabled:opacity-60 disabled:cursor-not-allowed'
                ].join(' ')}
              >
                {isExporting && (
                  <span
                    className="absolute left-4 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                )}
                <span className="inline-block">
                  {isExporting ? 'Exporting...' : 'Download XLSX'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
