'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

interface FilterOptionItem {
  id: string;
  name: string;
}

interface ProfessionalMultiSelectFilterProps {
  name: string;
  value: string[];
  options: (string | FilterOptionItem | undefined | null)[];
  onChange: (name: string, value: string[]) => void;
  placeholder: string;
  displayTransform?: (item: string | FilterOptionItem) => string;
  theme?: 'light' | 'dark';
}

const ProfessionalMultiSelectFilter = ({
  name,
  value,
  options,
  onChange,
  placeholder,
  displayTransform = (item: string | FilterOptionItem) => typeof item === 'string' ? item : item.name,
  theme = 'light'
}: ProfessionalMultiSelectFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedFromBottom, setClickedFromBottom] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  // Clean and normalize options
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

  // Create a stable mapping for display
  const optionMap = useMemo(() => {
    const map = new Map<string, string>();
    validOptions.forEach(option => {
      const displayName = displayTransform({ id: option.id, name: option.name });
      map.set(option.id, displayName);
    });
    return map;
  }, [validOptions, displayTransform]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return validOptions;
    return validOptions.filter(option => {
      const displayName = optionMap.get(option.id) || option.name;
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [validOptions, searchTerm, optionMap]);

  // Handle toggle
  const handleToggle = useCallback((optionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setTimeout(() => {
      const newValue = value.includes(optionId)
        ? value.filter(v => v !== optionId)
        : [...value, optionId];
      
      onChange(name, newValue);
      setClickedFromBottom(optionId);
    }, 10);
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

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (optionsContainerRef.current) {
          optionsContainerRef.current.scrollTop = 0;
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Ensure clicked items from bottom are visible
  useEffect(() => {
    if (clickedFromBottom && optionsContainerRef.current) {
      const clickedElement = document.getElementById(`option-${clickedFromBottom}`);
      if (clickedElement) {
        clickedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [clickedFromBottom]);

  // Handle click outside to close modal
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

  // Render selected items in trigger button
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
      {/* Professional Trigger Button */}
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

      {/* Professional Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Select ${placeholder}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleApply}
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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

            {/* Search and Stats Bar */}
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
                    className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-white rounded border border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={value.length === validOptions.length}
                    type="button"
                    aria-label="Select all options"
                  >
                    Select All
                  </button>
                  {value.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-white rounded border border-red-300 transition-colors"
                      type="button"
                      aria-label="Clear all selections"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Options List */}
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
                  {filteredOptions.map((option, index) => {
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
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggle(option.id, e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggle(option.id, e as any);
                          }
                        }}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        aria-label={`${displayName} ${isSelected ? 'selected' : 'not selected'}`}
                      >
                        {/* Custom checkbox */}
                        <div 
                          className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-slate-300 bg-white'
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected && (
                            <svg 
                              className="w-3 h-3 text-white" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="3" 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </div>
                        
                        {/* Option label */}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-slate-800 break-words">
                            {displayName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Add some padding at the bottom for better scrolling */}
                  <div className="h-4" />
                </div>
              )}
            </div>

            {/* Footer */}
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
                    aria-label="Apply selections"
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

export default ProfessionalMultiSelectFilter;
