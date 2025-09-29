'use client';
import React, { useMemo, useState } from 'react';
import { TrendingUp, CheckCircle2, X, Users, Filter, ChevronDown, ChevronRight, Search, PlusCircle } from "lucide-react";

/** ---- Types shared with your page (keep local here or move to a /types file) ---- */
export interface Employee {
  employee_id: string;
  employee_no: string;
  employee_name: string;
  company_id: string;
  company_name: string;
  department: string;
  position: string;
  currency: string;
  resigned_date: string | null;
  basic_salary: number;
  job_grade: string | null;
}

interface GradeBand { min:number; mid:number; max:number; currency:string }
interface EmployeePreview extends Employee { after:number; delta:number; pct:number }

type IncrementType = 'PERCENT' | 'FIXED' | 'PROMOTION';
type PromotionRule = 'min' | 'mid' | 'max' | 'percent_uplift';

export interface IncrementData {
  type: IncrementType;
  valuePercent: number | null;
  valueAmount: number | null;
  promotionToGrade: string | null;
  promotionRule: PromotionRule | null;
  promotionUplift: number | null;
  effectiveDate: string;
  reason: string;
  previewData: EmployeePreview[];
  overrides: Record<string, number | undefined>;
}

/** ---- Optional grade table (demo). Replace with server data if you have it. ---- */
const GRADE_TABLE: Record<string, GradeBand> = {
  G4: { min: 3500, mid: 4200, max: 5000, currency: 'MYR' },
  G5: { min: 6000, mid: 7000, max: 8000, currency: 'MYR' },
  G6: { min: 8000, mid: 9500, max: 11000, currency: 'MYR' },
  G7: { min: 11000, mid: 13000, max: 15000, currency: 'MYR' },
};

/** ---- Increment Modal (inline for simplicity) ---- */
function IncrementModal({
  isOpen,
  onClose,
  selectedEmployees,
  onApply,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployees: Employee[];
  onApply: (data: IncrementData) => void;
}) {
  const [type, setType] = useState<IncrementType>('PERCENT');
  const [valuePercent, setValuePercent] = useState<number>(5);
  const [valueAmount, setValueAmount] = useState<number>(500);
  const [promotionToGrade, setPromotionToGrade] = useState<string>('');
  const [promotionRule, setPromotionRule] = useState<PromotionRule>('mid');
  const [promotionUplift, setPromotionUplift] = useState<number>(10);
  const [effectiveDateStr, setEffectiveDateStr] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState<string>('Annual merit increase');
  const [overrides, setOverrides] = useState<Record<string, number | undefined>>({});

  if (!isOpen) return null;

  function calcNewBasic(emp: Employee): number {
    const cur = Number(emp.basic_salary);
    const override = overrides[emp.employee_id];
    if (override != null && isFinite(override)) return Number(override);
    if (type === 'PERCENT') return Math.round(cur * (1 + valuePercent / 100) * 100) / 100;
    if (type === 'FIXED')   return Math.round((cur + valueAmount) * 100) / 100;
    if (type === 'PROMOTION' && promotionToGrade) {
      const target = GRADE_TABLE[promotionToGrade];
      if (!target) return cur;
      if (promotionRule === 'min') return target.min;
      if (promotionRule === 'mid') return target.mid;
      if (promotionRule === 'max') return target.max;
      if (promotionRule === 'percent_uplift') return Math.round(cur * (1 + (promotionUplift || 0) / 100) * 100) / 100;
    }
    return cur;
  }

  const previewData: EmployeePreview[] = selectedEmployees.map(emp => {
    const after = calcNewBasic(emp);
    const delta = Math.round((after - emp.basic_salary) * 100) / 100;
    const pct   = emp.basic_salary ? Math.round((delta / emp.basic_salary) * 10000) / 100 : 0;
    return { ...emp, after, delta, pct };
  });

  const totalCost = previewData.reduce((sum, e) => sum + e.delta, 0);

  const handleApply = () => {
    onApply({
      type,
      valuePercent: type === 'PERCENT' ? valuePercent : null,
      valueAmount:  type === 'FIXED' ? valueAmount : null,
      promotionToGrade: type === 'PROMOTION' ? promotionToGrade : null,
      promotionRule:    type === 'PROMOTION' ? promotionRule : null,
      promotionUplift:  type === 'PROMOTION' && promotionRule === 'percent_uplift' ? promotionUplift : null,
      effectiveDate: effectiveDateStr,
      reason,
      previewData,
      overrides,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create Increment</h2>
              <p className="text-sm text-gray-500">{selectedEmployees.length} selected</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Left – Config */}
          <div className="w-1/3 p-6 border-r overflow-y-auto">
            <div className="space-y-6">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-3">Increment Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'PERCENT' as const, label: 'Percentage Increase', icon: '%' },
                    { value: 'FIXED'   as const, label: 'Fixed Amount',         icon: 'RM' },
                    { value: 'PROMOTION' as const, label: 'Promotion',         icon: '↑'  },
                  ].map(o => (
                    <button
                      key={o.value}
                      onClick={() => setType(o.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left ${
                        type === o.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm font-medium">{o.icon}</span>
                      <span className="font-medium">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {type === 'PERCENT' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Percentage (%)</label>
                  <input type="number" step="0.1" min="0"
                    value={valuePercent} onChange={e => setValuePercent(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {type === 'FIXED' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Fixed Amount (MYR)</label>
                  <input type="number" min="0"
                    value={valueAmount} onChange={e => setValueAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {type === 'PROMOTION' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Promotion to Grade</label>
                    <select
                      value={promotionToGrade}
                      onChange={e => setPromotionToGrade(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select grade...</option>
                      {Object.keys(GRADE_TABLE).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Salary Mapping Rule</label>
                    <select
                      value={promotionRule}
                      onChange={e => setPromotionRule(e.target.value as PromotionRule)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="min">Band Minimum</option>
                      <option value="mid">Band Midpoint</option>
                      <option value="max">Band Maximum</option>
                      <option value="percent_uplift">Percentage Uplift</option>
                    </select>
                  </div>

                  {promotionRule === 'percent_uplift' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Uplift Percentage (%)</label>
                      <input type="number" step="0.1" min="0"
                        value={promotionUplift} onChange={e => setPromotionUplift(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Effective Date</label>
                <input type="date"
                  value={effectiveDateStr} onChange={e => setEffectiveDateStr(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-500 mt-1">Cutoff: 25th of each month</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <input type="text" placeholder="e.g., Annual merit increase"
                  value={reason} onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Right – Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Impact Preview</h3>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Cost Impact</p>
                <p className="text-2xl font-bold text-green-600">MYR {totalCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">New</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Increase</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedEmployees.map(emp => {
                    const after = Math.round((Number(emp.basic_salary)) * 100) / 100; // just to show row shape if modal opened w/o previewData
                    return (
                      <tr key={emp.employee_id}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{emp.employee_name}</p>
                            <p className="text-xs text-gray-500">{emp.employee_no} • {emp.position}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">MYR {emp.basic_salary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm font-medium">MYR {after.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-green-600">—</td>
                        <td className="px-4 py-3 text-right text-sm">—</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">Ready to apply increment to {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''}</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border rounded-lg">Cancel</button>
            <button onClick={handleApply} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Apply Increment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ---- The Tab itself (table + open modal) ---- */
export default function IncrementsTab({
  employees,
  onApply,
}: {
  /** Provide employees from parent (recommended). If omitted, render an empty state. */
  employees?: Employee[];
  /** Optional: bubble up the increment payload to parent if you want to persist it. */
  onApply?: (data: IncrementData) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showIncrementModal, setShowIncrementModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const rows = employees || [];
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter(emp =>
      emp.employee_name.toLowerCase().includes(term) ||
      emp.employee_no.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  const selectedEmployees = filtered.filter(e => selectedIds.includes(e.employee_id));

  function toggleSelectAll() {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(e => e.employee_id));
  }
  function toggleSelect(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-6">
      {/* Actions / Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or employee no…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-72 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg ${
              showFilters ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={() => setShowIncrementModal(true)}
          disabled={selectedIds.length === 0}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
            selectedIds.length > 0 ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Create Increment
          {selectedIds.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-blue-500 rounded-full">
              {selectedIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold">Employees</h3>
            <p className="text-sm text-gray-500">{filtered.length} employee{filtered.length !== 1 ? 's' : ''} found{selectedIds.length > 0 ? ` • ${selectedIds.length} selected` : ''}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Basic</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filtered.map(emp => (
                <tr key={emp.employee_id} className={`hover:bg-gray-50 ${selectedIds.includes(emp.employee_id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(emp.employee_id)}
                      onChange={() => toggleSelect(emp.employee_id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {emp.employee_name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{emp.employee_name}</div>
                        <div className="text-xs text-gray-500">{emp.employee_no}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{emp.department}</td>
                  <td className="px-6 py-4 text-sm">{emp.position}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">MYR {emp.basic_salary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    {emp.job_grade
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{emp.job_grade}</span>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emp.resigned_date ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {emp.resigned_date ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-2 text-sm font-medium">No employees found</h4>
            <p className="mt-1 text-sm text-gray-500">Try changing your search.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <IncrementModal
        isOpen={showIncrementModal}
        onClose={() => setShowIncrementModal(false)}
        selectedEmployees={selectedEmployees}
        onApply={(data) => {
          onApply?.(data); // bubble up if parent wants it
        }}
      />
    </div>
  );
}
