
'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAttendanceData, useFilterOptions } from '../../hooks/useAttendanceData';
import { useTheme } from '../../components/ThemeProvider';
import type { Filters as BaseFilters } from '../../utils/attendanceApi';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import ConfirmationModal from '../../components/Modal';
import { API_BASE_URL } from '@/app/config';
const timeZone = 'Asia/Singapore';

interface AppealRecord {
  id: string;
  employee_name: string;
  employee_no: string;
  department_name: string;
  company_name: string;
  appeal_date: string;
  attendance_date: string;
  original_check_in: string;
  original_check_out: string;
  requested_check_in: string;
  requested_check_out: string;
  requested_status: string;
  appeal_status: 'pending' | 'approved' | 'rejected' | 'cancel';
  reason: string;
  admin_comment?: string;
  _justUpdated?: boolean;
  attendance_day_id: number;
}

type CompanyOption = {
  id: number;
  name: string;
};

type DepartmentOption = {
  id: number;
  department_name: string;
  name?: string;
};

type EmployeeOption = {
  id: number;
  employee_name: string;
  employee_no?: string;
  name?: string;
  department?: string;
  company?: string;
};

type PositionOption = {
  id: number;
  position_name: string;
  name?: string;
};

interface AppealTabProps {
  filters: BaseFilters;
  onFilterChange: (filters: Partial<BaseFilters>) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  user: any;
}

// --- Helper Interfaces and Functions ---

interface FilterOptionItem {
  id: string | number;
  name: string;
  employee_no?: string;
  department?: string;
  company?: string;
}

interface InternalFilters {
  company_id: string[];
  department_id: string[];
  employee_id: string[];
  position: string[];
  status: string[];
  start_date: string;
  end_date: string;
  search: string;
}

function normalizeStatusForFilter(status: string): string {
  if (!status) return status;
  
  const statusMap: Record<string, string> = {
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected',
    'cancel': 'cancel',
    'Pending': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected',
    'Cancel': 'cancel'
  };
  
  return statusMap[status] || status.toLowerCase();
}

// --- Professional Multi-Select Filter Component ---

const ProfessionalMultiSelectFilter = ({ 
  name, 
  value, 
  options, 
  onChange, 
  placeholder,
  displayTransform = (item: string | FilterOptionItem) => {
    if (typeof item === 'string') return item;
    // Show only name for employees
    return item.name;
  },
  theme = 'light'
}: { 
  name: keyof InternalFilters;
  value: string[];
  options: (string | FilterOptionItem | undefined | null)[];
  onChange: (name: keyof InternalFilters, value: string[]) => void;
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
      const displayName = displayTransform({ 
        id: option.id, 
        name: option.name
      });
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

export default function AppealTab({
  filters: baseFilters,
  onFilterChange,
  onShowNotification,
  user
}: AppealTabProps) {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);

  // Multi-select state with internal filters
  const [filters, setFilters] = useState<InternalFilters>({
    company_id: baseFilters.company_id ? [String(baseFilters.company_id)] : [],
    department_id: baseFilters.department_id ? [String(baseFilters.department_id)] : [],
    employee_id: baseFilters.employee_id ? [String(baseFilters.employee_id)] : [],
    position: baseFilters.position ? [String(baseFilters.position)] : [],
    status: baseFilters.status ? [String(baseFilters.status)] : [],
    start_date: baseFilters.start_date || '',
    end_date: baseFilters.end_date || '',
    search: baseFilters.search || ''
  });

  // Bulk edit states
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedAppeals, setSelectedAppeals] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [confirmReason, setConfirmReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [appealToAction, setAppealToAction] = useState<AppealRecord | null>(null);

  // Appeal detail modal
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealRecord | null>(null);

  // Bulk confirmation modal
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);
  const [pendingBulkAction, setPendingBulkAction] = useState<'approve' | 'reject' | null>(null);

  // Fetch appeal data
  const { data, total, isLoading, isFetching, error, refetch } = useAttendanceData<AppealRecord>(
    'appeal',
    baseFilters,
    page,
    limit
  );

  // Fetch filter options
  const { options: filterOptions } = useFilterOptions('all', baseFilters.company_id, false);

  // ✅ SIMPLIFIED: Department options
  const departments = useMemo<FilterOptionItem[]>(() => {
    const raw = (filterOptions as any)?.departments;
    if (!Array.isArray(raw)) return [];
    
    return raw.map((dept: DepartmentOption) => {
      // Extract just the department name (before any dash)
      const fullName = dept.department_name || dept.name || `Department ${dept.id}`;
      const cleanName = fullName.split(' - ')[0].trim();
      return {
        id: dept.id,
        name: cleanName
      };
    });
  }, [filterOptions]);

  // ✅ SIMPLIFIED: Employee options - Extract only the name part
  const employees = useMemo<FilterOptionItem[]>(() => {
    const raw = (filterOptions as any)?.employees;
    if (!Array.isArray(raw)) return [];
    
    return raw.map((employee: EmployeeOption) => {
      // Extract just the employee name (before any dash)
      const fullName = employee.employee_name || employee.name || `Employee ${employee.id}`;
      const cleanName = fullName.split(' - ')[0].trim();
      return {
        id: employee.id,
        name: cleanName
      };
    });
  }, [filterOptions]);

  // ✅ Company options
  const companies = useMemo<FilterOptionItem[]>(() => {
    const raw = (filterOptions as any)?.companies;
    if (!Array.isArray(raw)) return [];
    
    return raw.map((company: CompanyOption) => {
      const fullName = company.name || `Company ${company.id}`;
      const cleanName = fullName.split(' - ')[0].trim();
      return {
        id: company.id,
        name: cleanName
      };
    });
  }, [filterOptions]);

  // ✅ Position options
  const positions = useMemo<FilterOptionItem[]>(() => {
    const raw = (filterOptions as any)?.positions;
    if (!Array.isArray(raw)) return [];
    
    return raw.map((position: PositionOption) => {
      const fullName = position.position_name || position.name || `Position ${position.id}`;
      const cleanName = fullName.split(' - ')[0].trim();
      return {
        id: position.id,
        name: cleanName
      };
    });
  }, [filterOptions]);

  // ✅ Status options
  const statusOptions = useMemo<FilterOptionItem[]>(() => {
    return ['pending', 'approved', 'rejected', 'cancel'].map(status => ({
      id: status,
      name: status.charAt(0).toUpperCase() + status.slice(1)
    }));
  }, []);

  // Enhanced filter change handler
  const enhancedFilterChange = useCallback((name: keyof InternalFilters, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // Sync internal filters to parent on change
  useEffect(() => {
    const updatedBaseFilters: Partial<BaseFilters> = {
      company_id: filters.company_id.length > 0 ? filters.company_id.join(',') : undefined,
      department_id: filters.department_id.length > 0 ? filters.department_id.join(',') : undefined,
      employee_id: filters.employee_id.length > 0 ? filters.employee_id.join(',') : undefined,
      position: filters.position.length > 0 ? filters.position.join(',') : undefined,
      status: filters.status.length > 0 ? filters.status.map(s => normalizeStatusForFilter(s)).join(',') : undefined,
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      search: filters.search || undefined
    };
    
    onFilterChange(updatedBaseFilters);
    setPage(1);
  }, [filters, onFilterChange]);

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

  // Reset filters
  const resetFilters = () => {
    setFilters({
      company_id: [],
      department_id: [],
      employee_id: [],
      position: [],
      status: [],
      start_date: '',
      end_date: '',
      search: ''
    });
    setActiveQuickDate(null);
  };

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search') return count;
    if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
    if (value) return count + 1;
    return count;
  }, 0);

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      case 'cancel':
        return 'badge-neutral';
      default:
        return 'badge-ghost';
    }
  };

  // Get requested status badge color
  const getRequestedStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'badge-success';
      case 'late':
        return 'badge-warning';
      case 'absent':
        return 'badge-error';
      case 'offday':
        return 'badge-neutral';
      case 'partial':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  // Format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--';
    try {
      const date = toZonedTime(new Date(dateString), timeZone);
      return format(date, 'hh:mm a');
    } catch {
      return '--:--';
    }
  };

  // Format appeal date
  const formatAppealDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  // Toggle bulk mode
  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedAppeals([]);
  };

  // Handle select all appeals
  const handleSelectAllAppeals = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data) {
      const allAppealIds = data.map(appeal => appeal.id);
      setSelectedAppeals(allAppealIds);
    } else {
      setSelectedAppeals([]);
    }
  };

  // Handle select individual appeal
  const handleSelectAppeal = (appealId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppeals(prev => [...prev, appealId]);
    } else {
      setSelectedAppeals(prev => prev.filter(id => id !== appealId));
    }
  };

  // Open appeal detail modal
  const openAppealModal = (appeal: AppealRecord) => {
    setSelectedAppeal(appeal);
    setIsAppealModalOpen(true);
  };

  // Handle single appeal action
  const handleAppealAction = (appeal: AppealRecord, action: 'approve' | 'reject') => {
    setAppealToAction(appeal);
    setConfirmAction(action);
    setConfirmReason('');
    setReasonError('');
    setShowConfirmModal(true);
  };

  // Execute single appeal action - REMOVED VALIDATION
  const executeAppealAction = async () => {
    if (!appealToAction || !confirmAction) return;

    // Validate reason for rejection
    if (confirmAction === 'reject' && !confirmReason.trim()) {
      setReasonError('Reason is required for rejection');
      return;
    }

    try {
      // Get admin ID from localStorage
      const userString = localStorage.getItem('hrms_user');
      const adminId = userString ? JSON.parse(userString).id : null;

      if (!adminId) {
        throw new Error('Admin ID not found. Please refresh the page or log in again.');
      }

      // Make API call to update appeal
      const response = await fetch(`${API_BASE_URL}/api/attendance/appeal`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appeal_id: appealToAction.id,
          status: confirmAction === 'approve' ? 'APPROVED' : 'REJECTED',
          admin_comment: confirmReason,
          admin_employee_id: adminId,
          original_check_in: appealToAction.original_check_in,
          original_check_out: appealToAction.original_check_out,
          original_status: appealToAction.requested_status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appeal');
      }

      const result = await response.json();

      // Show success message
      onShowNotification(
        `Successfully ${confirmAction === 'approve' ? 'approved' : 'rejected'} appeal for ${appealToAction.employee_name}`,
        'success'
      );

      // Refresh data
      refetch();

      // Close modals
      setShowConfirmModal(false);
      setIsAppealModalOpen(false);
      setSelectedAppeal(null);

    } catch (error) {
      console.error('Error updating appeal:', error);
      onShowNotification(
        error instanceof Error ? error.message : 'Failed to update appeal status',
        'error'
      );
    }
  };

  // ✅ SIMPLIFIED: Handle bulk action - NO VALIDATION
  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedAppeals.length === 0) {
      onShowNotification('Please select at least one appeal', 'error');
      return;
    }

    // No validation - allow any appeal to be processed
    setPendingBulkAction(action);
    setShowBulkConfirmModal(true);
  };

  // ✅ SIMPLIFIED: Execute bulk action - NO VALIDATION
  const executeBulkAction = async () => {
    if (!pendingBulkAction) return;

    setBulkLoading(true);
    setShowBulkConfirmModal(false);

    try {
      // Process ALL selected appeals regardless of status
      const userString = localStorage.getItem('hrms_user');
      const adminId = userString ? JSON.parse(userString).id : null;

      if (!adminId) {
        throw new Error('Admin ID not found. Please refresh the page or log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/api/attendance/appeals/bulk`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appeal_ids: selectedAppeals, // Send all selected IDs
          status: pendingBulkAction.toUpperCase() === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          admin_comment: `Bulk ${pendingBulkAction} by admin`,
          admin_employee_id: adminId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to bulk ${pendingBulkAction} appeals`);
      }

      const result = await response.json();

      // Show success message
      const successMessage = `Successfully ${pendingBulkAction === 'approve' ? 'approved' : 'rejected'} ${result.processed || selectedAppeals.length} appeal(s)`;
      if (result.failed > 0) {
        onShowNotification(`${successMessage}. ${result.failed} appeals failed to process.`, 'info');
      } else {
        onShowNotification(successMessage, 'success');
      }

      // Refresh data
      refetch();

      // Clear selections and exit bulk mode
      setSelectedAppeals([]);
      setIsBulkMode(false);

    } catch (error) {
      console.error(`Error during bulk ${pendingBulkAction}:`, error);
      onShowNotification(
        error instanceof Error ? error.message : `Failed to bulk ${pendingBulkAction} appeals`,
        'error'
      );
    } finally {
      setBulkLoading(false);
      setPendingBulkAction(null);
    }
  };

  // Cancel bulk action
  const cancelBulkAction = () => {
    setShowBulkConfirmModal(false);
    setPendingBulkAction(null);
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
      {/* Global Loading Overlay */}
      {isFetching && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className={`p-6 rounded-xl shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                {isLoading ? 'Loading appeal records...' : 'Updating appeal records...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header with bulk edit controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-slate-100'}`}>
            Attendance Appeals
          </h2>
          <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
            Review and manage employee attendance appeals
          </p>
        </div>

        {/* Filter and Export buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`btn btn-sm sm:btn-md flex items-center gap-2 ${
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

          {/* Bulk edit controls */}
          <button
            className={`btn btn-sm sm:btn-md flex items-center gap-2 ${isBulkMode ? 'btn-primary' : 'btn-outline'}`}
            onClick={toggleBulkMode}
            disabled={isFetching}
          >
            {isBulkMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Bulk Edit
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Bulk Edit
              </>
            )}
          </button>
          
          {isBulkMode && selectedAppeals.length > 0 && (
            <>
              <div className={`text-sm self-center mx-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                {selectedAppeals.length} appeal(s) selected
              </div>
              <button
                className={`btn btn-success btn-sm ${bulkLoading ? 'loading' : ''}`}
                onClick={() => handleBulkAction('approve')}
                disabled={bulkLoading || isFetching}
              >
                {bulkLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve Selected
                  </>
                )}
              </button>
              <button
                className={`btn btn-error btn-sm ${bulkLoading ? 'loading' : ''}`}
                onClick={() => handleBulkAction('reject')}
                disabled={bulkLoading || isFetching}
              >
                {bulkLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Selected
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Date Navigation */}
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

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className={`relative rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
          <div className="px-6 py-5 border-b bg-slate-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Advanced Filters</h2>
                <p className="text-slate-600 text-sm mt-1">Refine your appeal records with precision filters</p>
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
              {/* Company Filter */}
              <ProfessionalMultiSelectFilter
                name="company_id"
                value={filters.company_id}
                options={companies}
                onChange={enhancedFilterChange}
                placeholder="Company"
                theme={theme}
              />

              {/* Department Filter */}
              <ProfessionalMultiSelectFilter
                name="department_id"
                value={filters.department_id}
                options={departments}
                onChange={enhancedFilterChange}
                placeholder="Department"
                theme={theme}
              />

              {/* Position Filter */}
              <ProfessionalMultiSelectFilter
                name="position"
                value={filters.position}
                options={positions}
                onChange={enhancedFilterChange}
                placeholder="Position"
                theme={theme}
              />

              {/* Employee Filter */}
              <ProfessionalMultiSelectFilter
                name="employee_id"
                value={filters.employee_id}
                options={employees}
                onChange={enhancedFilterChange}
                placeholder="Employee"
                theme={theme}
              />

              {/* Status Filter */}
              <ProfessionalMultiSelectFilter
                name="status"
                value={filters.status}
                options={statusOptions}
                onChange={enhancedFilterChange}
                placeholder="Appeal Status"
                theme={theme}
              />

              {/* Date Range Filter */}
              <DateRangeFilter
                title="Appeal Date Range"
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
            </div>
          </div>
        </div>
      )}

      {/* Appeal Table */}
      <div className={`rounded-lg shadow overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="loading loading-spinner loading-lg mx-auto"></div>
            <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
              Loading appeal records...
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className={`table w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                <thead className={theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}>
                  <tr>
                    {isBulkMode && (
                      <th className="w-12">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          onChange={handleSelectAllAppeals}
                          checked={selectedAppeals.length > 0 && 
                            selectedAppeals.length === data.length}
                        />
                      </th>
                    )}
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Employee</th>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Company</th>
                    <th className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>Department</th>
                    {/* <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Appeal Date</th> */}
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Attendance Date</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Requested Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Appeal Status</th>
                    <th className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((record) => (
                    <tr
                      key={record.id}
                      className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'} ${
                        record._justUpdated ? `${theme === 'light' ? 'bg-green-100' : 'bg-green-900'} animate-pulse` : ''
                      }`}
                    >
                      {isBulkMode && (
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedAppeals.includes(record.id)}
                            onChange={(e) => handleSelectAppeal(record.id, e.target.checked)}
                          />
                        </td>
                      )}
                      <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
                        <div>
                          <div className="font-medium">{record.employee_name}</div>
                          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>
                            {record.employee_no || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
                        {record.company_name || 'N/A'}
                      </td>
                      <td className={theme === 'light' ? 'text-gray-900' : 'text-slate-100'}>
                        {record.department_name || 'N/A'}
                      </td>
                      {/* <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {formatAppealDate(record.appeal_date)}
                      </td> */}
                      <td className={`text-center ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}>
                        {formatAppealDate(record.attendance_date)}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getRequestedStatusBadgeClass(record.requested_status)}`}>
                          {record.requested_status || 'N/A'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${getStatusBadgeClass(record.appeal_status)}`}>
                          {record.appeal_status || 'N/A'}
                        </span>
                      </td>
                      <td className="text-center">
                        {!isBulkMode && record.appeal_status === 'pending' ? (
                          <div className="flex gap-1 justify-center">
                            <button
                              className="btn btn-xs btn-success"
                              onClick={() => handleAppealAction(record, 'approve')}
                              disabled={isFetching}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => handleAppealAction(record, 'reject')}
                              disabled={isFetching}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-xs btn-info"
                              onClick={() => openAppealModal(record)}
                              disabled={isFetching}
                            >
                              View
                            </button>
                          </div>
                        ) : !isBulkMode ? (
                          <button
                            className="btn btn-xs btn-info"
                            onClick={() => openAppealModal(record)}
                            disabled={isFetching}
                          >
                            View
                          </button>
                        ) : (
                          <div className="text-xs text-gray-500">
                            {record.appeal_status === 'pending' ? 'Pending' : record.appeal_status}
                          </div>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
                  </span>
                  <div className="join">
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1 || isFetching}
                    >
                      {isFetching ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : 'Previous'}
                    </button>
                    <button className="join-item btn btn-sm btn-disabled">
                      Page {page} of {Math.ceil(total / limit)}
                    </button>
                    <button
                      className="join-item btn btn-sm"
                      onClick={() => setPage(page + 1)}
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
              No appeal records found for the selected filters.
            </p>
          </div>
        )}
      </div>

      {/* Appeal Detail Modal */}
      {isAppealModalOpen && selectedAppeal && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box w-11/12 max-w-4xl p-0 overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b bg-base-100">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold">Appeal Details</h3>
                  <span className={`badge ${getStatusBadgeClass(selectedAppeal.appeal_status)}`}>
                    {selectedAppeal.appeal_status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm opacity-70 mt-1">
                  Review the request and take action if needed.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setIsAppealModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 bg-base-100 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Employee Summary */}
              <div className="rounded-2xl bg-base-200 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-xl font-bold">{selectedAppeal.employee_name}</div>
                    <div className="text-sm opacity-70 mt-1">
                      Employee No: <span className="font-medium">{selectedAppeal.employee_no || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <div className="text-xs uppercase opacity-60">Company</div>
                      <div className="font-medium">{selectedAppeal.company_name || 'N/A'}</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase opacity-60">Department</div>
                      <div className="font-medium">{selectedAppeal.department_name || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <span className="badge badge-outline">
                      Attendance: {formatAppealDate(selectedAppeal.attendance_date)}
                    </span>
                    <span className="badge badge-outline">
                      Submitted: {formatAppealDate(selectedAppeal.appeal_date)}
                    </span>
                    <span className={`badge badge-outline ${getRequestedStatusBadgeClass(selectedAppeal.requested_status)}`}>
                      Requested: {selectedAppeal.requested_status || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-base-300 p-4">
                  <div className="text-sm font-semibold">Original</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Check-in</span>
                      <span className={`${selectedAppeal.original_check_in ? 'font-medium' : 'text-error font-medium'}`}>
                        {formatTime(selectedAppeal.original_check_in)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Check-out</span>
                      <span className={`${selectedAppeal.original_check_out ? 'font-medium' : 'text-error font-medium'}`}>
                        {formatTime(selectedAppeal.original_check_out)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-base-300 p-4 bg-success/5">
                  <div className="text-sm font-semibold">Requested</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Check-in</span>
                      <span className="font-medium text-success">
                        {formatTime(selectedAppeal.requested_check_in)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Check-out</span>
                      <span className="font-medium text-success">
                        {formatTime(selectedAppeal.requested_check_out)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="rounded-2xl border border-base-300 p-4">
                <div className="text-sm font-semibold">Reason</div>
                <div className="mt-2 text-sm whitespace-pre-wrap leading-relaxed opacity-90">
                  {selectedAppeal.reason || 'No reason provided'}
                </div>
              </div>

              {/* Admin comment (optional) */}
              {selectedAppeal.admin_comment && (
                <div className="rounded-2xl border border-base-300 p-4">
                  <div className="text-sm font-semibold">Admin Response</div>
                  <div className="mt-2 text-sm whitespace-pre-wrap leading-relaxed opacity-90">
                    {selectedAppeal.admin_comment}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-base-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs opacity-60">
                  Timezone: {timeZone}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsAppealModalOpen(false)}
                  >
                    Close
                  </button>

                  {selectedAppeal.appeal_status.toLowerCase() === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline btn-error btn-sm"
                        onClick={() => handleAppealAction(selectedAppeal, 'reject')}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleAppealAction(selectedAppeal, 'approve')}
                      >
                        Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setIsAppealModalOpen(false)}>close</button>
            </form>
          </div>
        </dialog>
      )}

      {/* Confirmation Modal for Single Appeal */}
      {showConfirmModal && appealToAction && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box w-11/12 max-w-2xl p-0 overflow-hidden">
            <div className="px-6 py-5 border-b bg-base-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {confirmAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </h3>
                  <p className="text-sm opacity-70 mt-1">
                    {confirmAction === 'approve'
                      ? 'This will update the attendance record.'
                      : 'Rejection requires a reason.'}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 py-5 bg-base-100 space-y-4">
              {/* Compact summary */}
              <div className="rounded-2xl bg-base-200 p-4">
                <div className="font-semibold">{appealToAction.employee_name}</div>
                <div className="text-sm opacity-70">Employee No: {appealToAction.employee_no || 'N/A'}</div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-base-100/60 p-3">
                    <div className="text-xs opacity-60">Original</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="opacity-70">In</span>
                      <span className={`${appealToAction.original_check_in ? 'font-medium' : 'text-error font-medium'}`}>
                        {formatTime(appealToAction.original_check_in)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="opacity-70">Out</span>
                      <span className={`${appealToAction.original_check_out ? 'font-medium' : 'text-error font-medium'}`}>
                        {formatTime(appealToAction.original_check_out)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-success/10 p-3">
                    <div className="text-xs opacity-60">Requested</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="opacity-70">In</span>
                      <span className="font-medium text-success">
                        {formatTime(appealToAction.requested_check_in)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="opacity-70">Out</span>
                      <span className="font-medium text-success">
                        {formatTime(appealToAction.requested_check_out)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment / Reason */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">
                    {confirmAction === 'approve' ? 'Comments (Optional)' : 'Rejection Reason'}
                  </span>
                  {confirmAction === 'reject' && (
                    <span className="label-text-alt text-error">Required</span>
                  )}
                </label>

                <textarea
                  className={`textarea textarea-bordered w-full ${reasonError ? 'textarea-error' : ''}`}
                  rows={4}
                  placeholder={
                    confirmAction === 'approve'
                      ? 'Optional comments for approval.'
                      : 'Explain why the appeal is rejected.'
                  }
                  value={confirmReason}
                  onChange={(e) => {
                    setConfirmReason(e.target.value);
                    if (e.target.value.trim()) setReasonError('');
                  }}
                />

                {reasonError && <div className="mt-2 text-sm text-error">{reasonError}</div>}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-base-100 flex items-center justify-end gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>

              <button
                className={`btn btn-sm ${confirmAction === 'approve' ? 'btn-success' : 'btn-error'}`}
                onClick={executeAppealAction}
              >
                {confirmAction === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
              </button>
            </div>

            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setShowConfirmModal(false)}>close</button>
            </form>
          </div>
        </dialog>
      )}

      {/* Bulk Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkConfirmModal}
        title={`Bulk ${pendingBulkAction === 'approve' ? 'Approve' : 'Reject'} Appeals`}
        message={`Are you sure you want to ${pendingBulkAction} ${selectedAppeals.length} appeal(s)? This action cannot be undone.`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={executeBulkAction}
        onCancel={cancelBulkAction}
        isLoading={bulkLoading}
        confirmButtonClass={pendingBulkAction === 'approve' ? 'btn-success' : 'btn-error'}
      />
    </div>
  );
}
