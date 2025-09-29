import React, { useState, useEffect } from 'react';

// Types for the filter data
interface FilterState {
  fromDate: string;
  toDate: string;
  company: string;
  status: string;
  [key: string]: string; // Allow for additional filter properties
}

// Types for active tab
type TabType = 'overview' | 'amend' | 'appeal';

// Company interface
interface Company {
  id: string;
  name: string;
}

// Status interface
interface Status {
  id: string;
  display_name: string;
}

// Props for the Tab Component
interface TabComponentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  role: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  companies: Company[];
  statuses: Status[];
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  onFilterChange: (key: string, value: string) => void;
  children: React.ReactNode;
  activeQuickDate: string | null;
  setActiveQuickDate: (date: string | null) => void;
  handleQuickDateSelect: (option: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({
  activeTab,
  onTabChange,
  role,
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  companies,
  statuses,
  onApplyFilters,
  onResetFilters,
  onFilterChange,
  children,
  activeQuickDate,
  setActiveQuickDate,
  handleQuickDateSelect
}) => {
  
  // Handle tab change
  const handleActiveTabChange = (tab: TabType) => {
    onTabChange(tab);
    setActiveQuickDate(null);
    setFilters({
      ...filters,
      fromDate: '',
      toDate: ''
    });
  };

  return (
    <div className="container mx-auto bg-white">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleActiveTabChange('overview')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'overview'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Overview
        </button>
        {role === 'admin' && (
          <>
            <button
              onClick={() => handleActiveTabChange('amend')}
              className={`py-3 px-6 font-medium text-sm ${activeTab === 'amend'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Amend
            </button>
            <button
              onClick={() => handleActiveTabChange('appeal')}
              className={`py-3 px-6 font-medium text-sm ${activeTab === 'appeal'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appeal
            </button>
          </>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab !== 'overview' && (
        <div className="mb-6">
          {/* Filter Controls */}
          <div className="card bg-white shadow-lg mb-6">
            <div className="card-body">
              <h3 className="card-title mb-4 text-xl">Filter {activeTab === 'amend' ? 'Amendments' : 'Appeals'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Search box */}
                <div className="form-control col-span-full">
                  <label className="label">
                    <span className="label-text font-medium">Search Employee</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search by employee name..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Quick date filters for amend and appeal tabs */}
                <div className="form-control col-span-full mb-2">
                  <label className="label">
                    <span className="label-text font-medium">Quick Date Filters</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`btn btn-sm ${activeQuickDate === 'today' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleQuickDateSelect('today')}
                    >
                      Today
                    </button>
                    <button
                      className={`btn btn-sm ${activeQuickDate === 'yesterday' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleQuickDateSelect('yesterday')}
                    >
                      Yesterday
                    </button>
                    <button
                      className={`btn btn-sm ${activeQuickDate === 'thisWeek' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleQuickDateSelect('thisWeek')}
                    >
                      This Week
                    </button>
                    <button
                      className={`btn btn-sm ${activeQuickDate === 'lastWeek' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleQuickDateSelect('lastWeek')}
                    >
                      Last Week
                    </button>
                    <button
                      className={`btn btn-sm ${activeQuickDate === 'thisMonth' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleQuickDateSelect('thisMonth')}
                    >
                      This Month
                    </button>
                    <button
                      className={`btn btn-sm ${activeQuickDate === 'lastMonth' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleQuickDateSelect('lastMonth')}
                    >
                      Last Month
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Company filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Company</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.company || ''}
                    onChange={(e) => onFilterChange('company', e.target.value)}
                  >
                    <option value="">All Companies</option>
                    {companies.length > 0 ? (
                      companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="ABC Corporation">ABC Corporation</option>
                        <option value="XYZ Enterprises">XYZ Enterprises</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Status filter - dynamically changes based on the active tab */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      {activeTab === 'appeal' ? 'Appeal Status' : 'Status'}
                    </span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={filters.status || ''}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    {activeTab === 'appeal' ? (
                      <>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </>
                    ) : (
                      <>
                        <option value="Absent">Absent</option>
                        <option value="Offday">Offday</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Date Range filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">From Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={filters.fromDate || ''}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">To Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={filters.toDate || ''}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  />
                </div>

                {/* Filter action buttons */}
                <div className="form-control flex items-end">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => onApplyFilters(filters)}
                    >
                      Apply Filter
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={onResetFilters}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {children}
        </div>
      )}

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="overview-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default TabComponent;
