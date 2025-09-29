// File: app/admins/payroll/page.tsx
"use client";

import { useState } from "react";
import TabComponent from "../../components/TabComponent";
import OverviewTab from "./tabs/OverviewTab";
import AmendTab from "./tabs/AmendTab.tsx";
import JobLogsTab from "./tabs/JobLogsTab";
import JobConfigTab from "./tabs/JobConfigTab";
import GenerateTab from "./tabs/GenerateTab";
import { FaRegCalendarTimes, FaRegMoneyBillAlt } from "react-icons/fa";
import { useTheme } from '../../components/ThemeProvider';
import { FaRegMoneyBill1 } from "react-icons/fa6";
import AppealTab from "./tabs/AppealTab.tsx";
import AdjustmentsTab from "./tabs/AdjustmentsTab";
import DetailTab from "./tabs/DetailTab";
import IncrementTab from "./tabs/IncrementTab";
import PayrollGenerationWizard from "./tabs/PayrollGenerationWizard.tsx";
import PayrollAdjustmentRelease from "./tabs/AdjustmentRelease.tsx";
import GeneratePayslipsTab from "./tabs/GeneratePayslipsTab.tsx";


export default function PayrollMainPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    company: "",
    status: ""
  });
  const [activeQuickDate, setActiveQuickDate] = useState<string | null>(null);

  const companies = [
    { id: "1", name: "ABC Corporation" },
    { id: "2", name: "XYZ Enterprises" }
  ];

  const statuses = [
    { id: "DRAFT", display_name: "Draft" },
    { id: "FINAL", display_name: "Finalized" },
    { id: "PAID", display_name: "Paid" },
    { id: "VOID", display_name: "Voided" },
    { id: "HOLD", display_name: "On Hold" },
    { id: "ADJUST", display_name: "Under Adjustment" }
  ];

  const handleQuickDateSelect = (option: string) => {
    setActiveQuickDate(option);
    // Set actual fromDate/toDate based on option
    // e.g. today, thisWeek, etc.
  };

  const onApplyFilters = (filters: any) => {
    // Use filters in tab content if needed
  };

  const onResetFilters = () => {
    setFilters({ fromDate: "", toDate: "", company: "", status: "" });
    setSearchTerm("");
    setActiveQuickDate(null);
  };

  const onFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
        <div className={`container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 min-h-screen ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
              <FaRegMoneyBill1 className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 inline mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
              <span className="truncate">Payroll</span>
            </h1>
          </div>
    <TabComponent
      activeTab={activeTab}
      onTabChange={setActiveTab}
      role="admin"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filters={filters}
      setFilters={setFilters}
      companies={companies}
      statuses={statuses}
      onApplyFilters={onApplyFilters}
      onResetFilters={onResetFilters}
      onFilterChange={onFilterChange}
      activeQuickDate={activeQuickDate}
      setActiveQuickDate={setActiveQuickDate}
      handleQuickDateSelect={handleQuickDateSelect}
    >
      {activeTab === "overview" && <OverviewTab filters={filters} searchTerm={searchTerm} />}
      {activeTab === "amend" && <AmendTab filters={filters} searchTerm={searchTerm} />}
      {activeTab === "appeal" && <AppealTab />}
      {activeTab === "adjustments" && <AdjustmentsTab />}
      {activeTab === "detail" && <DetailTab />}
      {activeTab === "generate" && <PayrollGenerationWizard />}
      {activeTab === "jobconfig" && <JobConfigTab />}
      {activeTab === "joblogs" && <JobLogsTab />}
      {activeTab === "Increment" && <IncrementTab />}
      {activeTab === "post adjustment" && <PayrollAdjustmentRelease/>}
      {activeTab === "generateslip" && <GeneratePayslipsTab/>}
    </TabComponent>

    ,</div>
  );
}