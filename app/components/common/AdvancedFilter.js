// frontend/components/common/AdvancedFilter.js
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { API_BASE_URL } from '../../config';

// Professional MultiSelectFilter Component
const ProfessionalMultiSelectFilter = ({ 
  name, 
  value, 
  options, 
  onChange, 
  placeholder,
  displayTransform = (val) => val,
  theme = 'light',
  disabled = false,
  enableSearch = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  const validOptions = options.filter((option) => 
    option !== undefined && option !== null && option !== ''
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm || !enableSearch) return validOptions;
    return validOptions.filter(option => 
      displayTransform(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [validOptions, searchTerm, displayTransform, enableSearch]);

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(name, newValue);
  };

  const handleSelectAll = () => {
    onChange(name, [...validOptions]);
  };

  const handleClear = () => {
    onChange(name, []);
  };

  const selectedPercentage = validOptions.length > 0 
    ? Math.round((value.length / validOptions.length) * 100) 
    : 0;

  useEffect(() => {
    if (isOpen && searchInputRef.current && enableSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, enableSearch]);

  return (
    <>
      {/* Professional Trigger Button */}
      <div className="form-control w-full">
        <label className="label pb-3">
          <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {placeholder}
          </span>
        </label>
        
        <button
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className={`group relative flex items-center justify-between w-full p-4 text-left transition-all duration-200 border-2 rounded-lg ${
            disabled 
              ? 'cursor-not-allowed opacity-50' 
              : 'cursor-pointer'
          } ${
            theme === 'light' 
              ? 'bg-white border-slate-200 hover:border-slate-300' 
              : 'bg-slate-800 border-slate-600 hover:border-slate-500'
          } ${
            value.length > 0 
              ? 'border-blue-500 bg-blue-50 shadow-sm' 
              : ''
          }`}
        >
          <div className="flex flex-col items-start flex-1 min-w-0">
            {value.length === 0 ? (
              <span className={`text-base ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Select {placeholder.toLowerCase()}...
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {value.slice(0, 2).map(val => (
                  <span 
                    key={val} 
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200"
                  >
                    {displayTransform(val)}
                  </span>
                ))}
                {value.length > 2 && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-300">
                    +{value.length - 2} more
                  </span>
                )}
              </div>
            )}
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

      {/* Professional Modal */}
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Select {placeholder}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Choose multiple options to filter your results
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-4 h-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform -rotate-45" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-500 transform rotate-45" />
              </div>
            </button>
          </div>

          {/* Search and Stats Bar */}
          <div className="p-4 border-b bg-slate-50">
            {enableSearch && (
              <div className="flex items-center gap-3 mb-3">
                <div className="form-control flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={`Search ${placeholder.toLowerCase()}...`}
                    className="input input-bordered w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Progress and Actions */}
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
                  className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors"
                  disabled={value.length === validOptions.length}
                >
                  Select All
                </button>
                {value.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto bg-white">
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
                {filteredOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                      value.includes(option)
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={value.includes(option)}
                        onChange={() => handleToggle(option)}
                        className="opacity-0 absolute w-5 h-5 cursor-pointer"
                      />
                      {value.includes(option) && (
                        <div className="w-2 h-2 bg-blue-600 rounded-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-800">
                        {displayTransform(option)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {value.length} options selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Backdrop */}
        <div className="modal-backdrop bg-black/40" onClick={() => setIsOpen(false)}></div>
      </div>
    </>
  );
};

// Main AdvancedFilter Component
export default function AdvancedFilter({
  theme = 'light',
  filters,
  onFilterChange,
  onResetFilters,
  onClose,
  filterOptions,
  user,
  userPermissions = [],
  loading = false,
  customFilters = {},
  showStatusFilter = true,
  showSearch = true,
  searchTerm = '',
  onSearchChange = () => {},
  title = 'Advanced Filters',
  description = 'Refine your database with precision filters'
}) {
  // Default filter structure
  const defaultFilters = {
    company_id: [],
    department_id: [],
    position: [],
    employment_type: [],
    type: [],
    nationality: [],
    jobLevel: [],
    status: 'active',
    documentExpiry: ''
  };

  // Merge with custom filters
  const activeFilters = { ...defaultFilters, ...filters };

  // Calculate active filter count
  const activeFilterCount = Object.entries(activeFilters).reduce((count, [key, value]) => {
    if (key === 'status' && value !== 'active') return count + 1;
    if (Array.isArray(value)) return count + value.length;
    if (value && value !== '' && key !== 'status') return count + 1;
    return count;
  }, 0);

  // Handle filter changes
  const handleMultiFilterChange = (name, value) => {
    onFilterChange({ ...activeFilters, [name]: value });
  };

  const handleSingleFilterChange = (name, value) => {
    onFilterChange({ ...activeFilters, [name]: value });
  };

  // Reset all filters
  const handleReset = () => {
    onResetFilters();
  };

  // Get user's accessible companies based on permissions
  const getAccessibleCompanies = () => {
    if (!user || !userPermissions) return [];
    
    // If user is admin, show all companies
    if (user.role === 'admin') {
      return filterOptions?.companies || [];
    }
    
    // Get user's accessible companies from permissions
    const accessibleCompanyIds = userPermissions
      .filter(perm => perm.can_view)
      .map(perm => perm.company_id);
    
    // Include user's own company
    if (user.company_id && !accessibleCompanyIds.includes(user.company_id)) {
      accessibleCompanyIds.push(user.company_id);
    }
    
    // Filter companies
    return (filterOptions?.companies || []).filter(company => 
      accessibleCompanyIds.includes(company.id)
    );
  };

  // Get user's accessible departments based on selected companies
  const getAccessibleDepartments = () => {
    if (!filterOptions?.departments) return [];
    
    const accessibleCompanies = getAccessibleCompanies();
    const accessibleCompanyIds = accessibleCompanies.map(c => c.id);
    
    // If no company filter, return departments from accessible companies
    if (activeFilters.company_id.length === 0) {
      return filterOptions.departments.filter(dept => 
        accessibleCompanyIds.includes(dept.company_id)
      );
    }
    
    // If company filter applied, return departments only from selected companies
    return filterOptions.departments.filter(dept => 
      activeFilters.company_id.includes(dept.company_id)
    );
  };

  // Get available positions based on selected departments
  const getAvailablePositions = () => {
    if (!filterOptions?.positions) return [];
    
    const accessibleDepartments = getAccessibleDepartments();
    const accessibleDeptIds = accessibleDepartments.map(d => d.id);
    
    if (activeFilters.department_id.length === 0) {
      return filterOptions.positions.filter(pos => 
        accessibleDeptIds.includes(pos.department_id)
      );
    }
    
    return filterOptions.positions.filter(pos => 
      activeFilters.department_id.includes(pos.department_id)
    );
  };

  // Get available filter options
  const getAvailableOptions = (type) => {
    switch (type) {
      case 'companies':
        return getAccessibleCompanies().map(c => c.id);
      case 'departments':
        return getAccessibleDepartments().map(d => d.id);
      case 'positions':
        return getAvailablePositions().map(p => p.title);
      case 'employmentTypes':
        return filterOptions?.employmentTypes || [];
      case 'nationalities':
        return filterOptions?.nationalities || [];
      case 'jobLevels':
        return filterOptions?.jobLevels || [];
      default:
        return [];
    }
  };

  // Get display transform for different filter types
  const getDisplayTransform = (type) => {
    switch (type) {
      case 'companies':
        return (id) => filterOptions?.companies?.find(c => c.id === id)?.name || id;
      case 'departments':
        return (id) => filterOptions?.departments?.find(d => d.id === id)?.department_name || id;
      case 'positions':
        return (title) => title;
      case 'employmentTypes':
        return (type) => type;
      case 'nationalities':
        return (nationality) => nationality;
      case 'jobLevels':
        return (level) => level;
      default:
        return (val) => val;
    }
  };

  return (
    <div className={`relative rounded-xl shadow-lg mb-8 border ${
      theme === 'light' 
        ? 'bg-white border-slate-200' 
        : 'bg-slate-800 border-slate-700'
    }`}>
      
      {/* Header */}
      <div className="px-6 py-5 border-b bg-slate-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            <p className="text-slate-600 text-sm mt-1">
              {description}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-300 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
            <button 
              className="px-4 py-2 text-sm bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors font-medium"
              onClick={handleReset}
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Panel */}
      {activeFilterCount > 0 && (
        <div className="px-6 py-4 border-b bg-blue-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Active Filters</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                {activeFilterCount}
              </span>
            </div>
            <button 
              onClick={handleReset}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeFilters.company_id.map(companyId => (
              <span key={companyId} className="inline-flex items-center px-3 py-1.5 text-sm bg-white text-slate-700 rounded-md border border-slate-300 shadow-sm">
                {getDisplayTransform('companies')(companyId)}
                <button 
                  onClick={() => handleMultiFilterChange('company_id', activeFilters.company_id.filter(id => id !== companyId))}
                  className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-slate-100 rounded transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            
            {activeFilters.status !== 'active' && (
              <span className="inline-flex items-center px-3 py-1.5 text-sm bg-white text-slate-700 rounded-md border border-slate-300 shadow-sm">
                {activeFilters.status.charAt(0).toUpperCase() + activeFilters.status.slice(1)}
                <button onClick={() => handleSingleFilterChange('status', 'active')} className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-slate-100 rounded transition-colors">×</button>
              </span>
            )}
            
            {activeFilters.documentExpiry && (
              <span className="inline-flex items-center px-3 py-1.5 text-sm bg-white text-slate-700 rounded-md border border-slate-300 shadow-sm">
                {activeFilters.documentExpiry.replace(/_/g, ' ')}
                <button onClick={() => handleSingleFilterChange('documentExpiry', '')} className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-slate-100 rounded transition-colors">×</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="p-6 border-b">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Search</span>
            </label>
            <input
              type="text"
              placeholder="Search..."
              className={`input input-bordered w-full ${
                theme === 'light' 
                  ? 'bg-white border-slate-300' 
                  : 'bg-slate-700 border-slate-600'
              }`}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main Filters Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Status Filter */}
          {showStatusFilter && (
            <div className="form-control w-full">
              <label className="label pb-3">
                <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Status
                </span>
              </label>
              <div className="relative">
                <select 
                  className={`w-full p-4 border-2 rounded-lg appearance-none cursor-pointer transition-all ${
                    theme === 'light' 
                      ? 'bg-white border-slate-200 hover:border-slate-300' 
                      : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                  } ${
                    activeFilters.status !== 'active' 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : ''
                  } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                  value={activeFilters.status} 
                  onChange={(e) => handleSingleFilterChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="resigned">Resigned</option>
                  <option value="all">All</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 transform rotate-45" />
                </div>
              </div>
            </div>
          )}

          {/* Company Filter (based on user permissions) */}
          <ProfessionalMultiSelectFilter
            name="company_id"
            value={activeFilters.company_id}
            options={getAvailableOptions('companies')}
            onChange={handleMultiFilterChange}
            placeholder="Company"
            displayTransform={getDisplayTransform('companies')}
            theme={theme}
            disabled={loading || getAvailableOptions('companies').length === 0}
          />

          {/* Department Filter */}
          <ProfessionalMultiSelectFilter
            name="department_id"
            value={activeFilters.department_id}
            options={getAvailableOptions('departments')}
            onChange={handleMultiFilterChange}
            placeholder="Department"
            displayTransform={getDisplayTransform('departments')}
            theme={theme}
            disabled={loading || getAvailableOptions('departments').length === 0}
          />

          {/* Position Filter */}
          <ProfessionalMultiSelectFilter
            name="position"
            value={activeFilters.position}
            options={getAvailableOptions('positions')}
            onChange={handleMultiFilterChange}
            placeholder="Position"
            displayTransform={getDisplayTransform('positions')}
            theme={theme}
            disabled={loading || getAvailableOptions('positions').length === 0}
          />

          {/* Employment Type Filter */}
          <ProfessionalMultiSelectFilter
            name="employment_type"
            value={activeFilters.employment_type}
            options={getAvailableOptions('employmentTypes')}
            onChange={handleMultiFilterChange}
            placeholder="Employment Type"
            displayTransform={getDisplayTransform('employmentTypes')}
            theme={theme}
            disabled={loading || getAvailableOptions('employmentTypes').length === 0}
          />

          {/* Nationality Filter */}
          <ProfessionalMultiSelectFilter
            name="nationality"
            value={activeFilters.nationality}
            options={getAvailableOptions('nationalities')}
            onChange={handleMultiFilterChange}
            placeholder="Nationality"
            displayTransform={getDisplayTransform('nationalities')}
            theme={theme}
            disabled={loading || getAvailableOptions('nationalities').length === 0}
          />

          {/* Job Level Filter */}
          <ProfessionalMultiSelectFilter
            name="jobLevel"
            value={activeFilters.jobLevel}
            options={getAvailableOptions('jobLevels')}
            onChange={handleMultiFilterChange}
            placeholder="Job Level"
            displayTransform={getDisplayTransform('jobLevels')}
            theme={theme}
            disabled={loading || getAvailableOptions('jobLevels').length === 0}
          />

          {/* Document Expiry Filter */}
          <div className="form-control w-full">
            <label className="label pb-3">
              <span className={`label-text font-semibold tracking-wide text-sm uppercase ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                Document Status
              </span>
            </label>
            <div className="relative">
              <select
                name="documentExpiry"
                value={activeFilters.documentExpiry}
                onChange={(e) => handleSingleFilterChange('documentExpiry', e.target.value)}
                className={`w-full p-4 border-2 rounded-lg appearance-none cursor-pointer transition-all ${
                  theme === 'light' 
                    ? 'bg-white border-slate-200 hover:border-slate-300' 
                    : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                } ${
                  activeFilters.documentExpiry 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : ''
                } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="">All Document Status</option>
                <option value="passport_expired">Passport Expired</option>
                <option value="visa_expired">Visa Expired</option>
                <option value="passport_expiring_soon">Passport Expiring Soon</option>
                <option value="visa_expiring_soon">Visa Expiring Soon</option>
                <option value="any_expiring_soon">Any Document Expiring Soon</option>
                <option value="any_expired">Any Document Expired</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 transform rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Permission Info */}
        {user && user.role !== 'admin' && (
          <div className={`mt-6 p-4 rounded-lg border ${
            theme === 'light' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-blue-900/30 border-blue-700'
          }`}>
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-800">Filtering Information</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You can only filter data from companies you have permission to access.
                  {getAvailableOptions('companies').length === 0 && (
                    <span className="block mt-1 font-medium">No companies available for filtering.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
