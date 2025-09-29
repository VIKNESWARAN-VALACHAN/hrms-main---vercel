"use client";

import { ReactNode, useState } from "react";
import { Search, Filter } from "lucide-react";
import { useTheme } from '../components/ThemeProvider';

export interface TabComponentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: {
    fromDate: string;
    toDate: string;
    company: string;
    status: string;
  };
  setFilters: (filters: any) => void;
  companies: { id: string; name: string }[];
  statuses: { id: string; display_name: string }[];
  onApplyFilters: (filters: any) => void;
  onResetFilters: () => void;
  onFilterChange: (key: string, value: string) => void;
  activeQuickDate: string | null;
  setActiveQuickDate: (value: string | null) => void;
  handleQuickDateSelect: (option: string) => void;
  children: ReactNode;
}

const tabs = [
  { key: "overview", label: "Overview" },
  // { key: "amend", label: "Amendments" },
  // { key: "appeal", label: "Appeals" },
  // { key: "adjustments", label: "Post-Adjustments" },
  // { key: "detail", label: "Detail View" },
  { key: "generate", label: "Generate Payroll" },
  // { key: "jobconfig", label: "Job Config" },
  // { key: "joblogs", label: "Job Logs" }
  // { key: "Increment", label: "Increment" }
  
  {key : "post adjustment" ,label: "Generate Bank Slip"},
  { key: "generateslip", label: "Generate Payslip" }
];


export default function TabComponent({
  activeTab,
  onTabChange,
  searchTerm,
  setSearchTerm,
  filters,
  companies,
  statuses,
  onApplyFilters,
  onResetFilters,
  onFilterChange,
  activeQuickDate,
  handleQuickDateSelect,
  children,
}: TabComponentProps) {
  const { theme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`px-4 py-6 space-y-6 min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-gray-100'}`}>
      {/* Top: Tabs + Search + Filters */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-3 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-t-md font-medium transition-colors duration-200 focus:outline-none ${
                activeTab === tab.key
                  ? `${theme === 'light' ? 'bg-white text-blue-600 border border-gray-200' : 'bg-gray-800 text-blue-400 border border-gray-700'} border-b-transparent`
                  : `${theme === 'light' ? 'text-gray-500 hover:text-blue-500' : 'text-gray-400 hover:text-blue-400'}`
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        {/* <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className={`input w-64 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-100'}`}
          />
          <button
            className={`btn ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white`}
            onClick={() => onApplyFilters(filters)}
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            className={`btn ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Advanced Filters"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div> */}
      </div>

      {/* Filter Panel (Hidden by default) */}
      {showFilters && (
        <div className={`p-4 rounded-md shadow space-y-4 ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFilterChange("fromDate", e.target.value)}
              className={`input ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-100'}`}
            />
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFilterChange("toDate", e.target.value)}
              className={`input ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-100'}`}
            />
            <select
              value={filters.company}
              onChange={(e) => onFilterChange("company", e.target.value)}
              className={`select ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-100'}`}
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className={`select ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-100'}`}
            >
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.display_name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`btn btn-sm ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 hover:bg-blue-500'} text-white`}
              onClick={() => onApplyFilters(filters)}
            >
              Apply Filters
            </button>
            <button
              className={`btn btn-sm ${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
              onClick={onResetFilters}
            >
              Reset
            </button>
            {["today", "thisWeek", "thisMonth"].map((key) => (
              <button
                key={key}
                className={`btn btn-sm ${
                  activeQuickDate === key 
                    ? `${theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'}`
                    : `${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`
                }`}
                onClick={() => handleQuickDateSelect(key)}
              >
                {key === "today" ? "Today" : key === "thisWeek" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
        {children}
      </div>
    </div>
  );
}