'use client'
import React, { useMemo, useState } from 'react'
import { Search, PlusCircle, CheckCircle2, CalendarDays, Filter, X, Users, TrendingUp, Settings, Eye, History, ChevronDown, ChevronRight } from "lucide-react";

// Type definitions
interface PayrollData {
  payroll_id: string;
  period_year: string;
  period_month: string;
  employee_id: string;
  basic_salary: string;
  total_allowance: string;
  gross_salary: string;
  total_deduction: string;
  net_salary: string;
  status_code: string;
  generated_at: string;
  created_at: string;
  employee_name: string;
  employee_no: string;
  department: string;
  position: string;
  company_id: string;
  company_name: string;
  currency: string;
  resigned_date: string | null;
}

interface Employee {
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

interface GradeBand {
  min: number;
  mid: number;
  max: number;
  currency: string;
}

interface EmployeePreview extends Employee {
  after: number;
  delta: number;
  pct: number;
}

interface IncrementBatch {
  id: string;
  type: 'PERCENT' | 'FIXED' | 'PROMOTION';
  reason: string;
  effective_date: string;
  created_at: string;
  employee_count: number;
  total_cost: number;
}

interface IncrementLine {
  id: string;
  batch_id: string;
  employee_id: string;
  employee_name: string;
  employee_no: string;
  old_basic: number;
  new_basic: number;
  delta_amount: number;
  delta_percent: number;
  currency: string;
}

interface IncrementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployees: Employee[];
  onApply: (data: IncrementData) => void;
}

interface IncrementData {
  type: 'PERCENT' | 'FIXED' | 'PROMOTION';
  valuePercent: number | null;
  valueAmount: number | null;
  promotionToGrade: string | null;
  promotionRule: 'min' | 'mid' | 'max' | 'percent_uplift' | null;
  promotionUplift: number | null;
  effectiveDate: string;
  reason: string;
  previewData: EmployeePreview[];
  overrides: Record<string, number | undefined>;
}

// Mock data and constants
const RAW_DATA: PayrollData[] = [
  {
    payroll_id: '1', period_year: '2025', period_month: '1', employee_id: '215',
    basic_salary: '15000.00', total_allowance: '1150.00', gross_salary: '16150.00', total_deduction: '185.00', net_salary: '11798.50',
    status_code: 'FINAL', generated_at: '2025-07-08 16:25:11', created_at: '2025-08-03 03:12:52',
    employee_name: 'Stephen Curry', employee_no: 'EMP-2025-8346', department: 'IT', position: 'Senior Developer',
    company_id: '1', company_name: 'TechCorp Solutions', currency: 'MYR', resigned_date: null
  },
  {
    payroll_id: '3', period_year: '2025', period_month: '1', employee_id: '217',
    basic_salary: '8000.00', total_allowance: '950.00', gross_salary: '8950.00', total_deduction: '210.00', net_salary: '6912.22',
    status_code: 'FINAL', generated_at: '2025-07-08 16:25:11', created_at: '2025-08-03 03:12:52',
    employee_name: 'Cristiano Ronaldo', employee_no: 'EMP-2025-7777', department: 'IT', position: 'Software Engineer',
    company_id: '1', company_name: 'TechCorp Solutions', currency: 'MYR', resigned_date: null
  },
  {
    payroll_id: '10', period_year: '2025', period_month: '2', employee_id: '227',
    basic_salary: '3500.00', total_allowance: '200.00', gross_salary: '3700.00', total_deduction: '10.00', net_salary: '3003.11',
    status_code: 'FINAL', generated_at: '2025-07-11 11:20:55', created_at: '2025-08-05 02:00:00',
    employee_name: 'Sarah Johnson', employee_no: 'EMP-2025-5923', department: 'HR', position: 'Junior Analyst',
    company_id: '1', company_name: 'TechCorp Solutions', currency: 'MYR', resigned_date: null
  },
  {
    payroll_id: '11', period_year: '2025', period_month: '2', employee_id: '228',
    basic_salary: '12000.00', total_allowance: '800.00', gross_salary: '12800.00', total_deduction: '150.00', net_salary: '10240.00',
    status_code: 'FINAL', generated_at: '2025-07-11 11:20:55', created_at: '2025-08-05 02:00:00',
    employee_name: 'Michael Chen', employee_no: 'EMP-2025-6001', department: 'Finance', position: 'Senior Analyst',
    company_id: '1', company_name: 'TechCorp Solutions', currency: 'MYR', resigned_date: null
  }
]

const EMPLOYEE_GRADES: Record<string, { grade: string }> = {
  '215': { grade: 'G6' },
  '217': { grade: 'G5' },
  '227': { grade: 'G4' },
  '228': { grade: 'G6' },
}

const GRADE_TABLE: Record<string, GradeBand> = {
  G4: { min: 3500, mid: 4200, max: 5000, currency: 'MYR' },
  G5: { min: 6000, mid: 7000, max: 8000, currency: 'MYR' },
  G6: { min: 8000, mid: 9500, max: 11000, currency: 'MYR' },
  G7: { min: 11000, mid: 13000, max: 15000, currency: 'MYR' },
}

const PAYROLL_CALENDAR = { cutoffDay: 25 }

// Utility functions
function parseNumber(x: any, def: number = 0): number { 
  const n = Number(x); 
  return Number.isFinite(n) ? n : def 
}

function yyyymm(row: PayrollData): number { 
  const y = parseInt(row.period_year, 10); 
  const m = parseInt(row.period_month, 10); 
  return y * 100 + m 
}

function dateStrToDate(s?: string | null): Date | null { 
  if (!s) return null; 
  const d = new Date(String(s).replace(/\s/, 'T')); 
  return isNaN(d.getTime()) ? null : d 
}

function buildEmployeeMaster(rows: PayrollData[]): Employee[] {
  const byEmp: Record<string, PayrollData> = {}
  for (const r of rows) {
    const k = String(r.employee_id)
    if (!byEmp[k]) {
      byEmp[k] = r;
    } else {
      const aa = yyyymm(byEmp[k]); 
      const rr = yyyymm(r)
      if (rr > aa) {
        byEmp[k] = r;
      } else if (rr === aa) {
        const ag = dateStrToDate(byEmp[k].generated_at)?.getTime() || 0
        const rg = dateStrToDate(r.generated_at)?.getTime() || 0
        if (rg > ag) byEmp[k] = r
      }
    }
  }
  return Object.values(byEmp).map((r: PayrollData): Employee => ({
    employee_id: String(r.employee_id), 
    employee_no: r.employee_no, 
    employee_name: r.employee_name,
    company_id: r.company_id, 
    company_name: r.company_name, 
    department: r.department, 
    position: r.position,
    currency: r.currency || 'MYR', 
    resigned_date: r.resigned_date || null, 
    basic_salary: parseNumber(r.basic_salary),
    job_grade: EMPLOYEE_GRADES[String(r.employee_id)]?.grade || null,
  }))
}

function IncrementModal({ isOpen, onClose, selectedEmployees, onApply }: IncrementModalProps) {
  const [type, setType] = useState<'PERCENT' | 'FIXED' | 'PROMOTION'>('PERCENT')
  const [valuePercent, setValuePercent] = useState<number>(5)
  const [valueAmount, setValueAmount] = useState<number>(500)
  const [promotionToGrade, setPromotionToGrade] = useState<string>('')
  const [promotionRule, setPromotionRule] = useState<'min' | 'mid' | 'max' | 'percent_uplift'>('mid')
  const [promotionUplift, setPromotionUplift] = useState<number>(10)
  const [effectiveDateStr, setEffectiveDateStr] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [reason, setReason] = useState<string>('Annual merit increase')
  const [overrides, setOverrides] = useState<Record<string, number | undefined>>({})

  if (!isOpen) return null

  function calcNewBasic(emp: Employee): number {
    const cur = Number(emp.basic_salary)
    const override = overrides[emp.employee_id]
    if (override != null && isFinite(override)) return Number(override)
    
    if (type === 'PERCENT') return Math.round(cur * (1 + valuePercent / 100) * 100) / 100
    if (type === 'FIXED') return Math.round((cur + valueAmount) * 100) / 100
    if (type === 'PROMOTION' && promotionToGrade) {
      const target = GRADE_TABLE[promotionToGrade]
      if (!target) return cur
      if (promotionRule === 'min') return target.min
      if (promotionRule === 'mid') return target.mid
      if (promotionRule === 'max') return target.max
      if (promotionRule === 'percent_uplift') return Math.round(cur * (1 + (promotionUplift || 0) / 100) * 100) / 100
    }
    return cur
  }

  const previewData: EmployeePreview[] = selectedEmployees.map(emp => {
    const after = calcNewBasic(emp)
    const delta = Math.round((after - emp.basic_salary) * 100) / 100
    const pct = emp.basic_salary ? Math.round((delta / emp.basic_salary) * 10000) / 100 : 0
    return { ...emp, after, delta, pct }
  })

  const totalCost = previewData.reduce((sum: number, emp: EmployeePreview) => sum + emp.delta, 0)

  const handleApply = () => {
    const incrementData: IncrementData = {
      type,
      valuePercent: type === 'PERCENT' ? valuePercent : null,
      valueAmount: type === 'FIXED' ? valueAmount : null,
      promotionToGrade: type === 'PROMOTION' ? promotionToGrade : null,
      promotionRule: type === 'PROMOTION' ? promotionRule : null,
      promotionUplift: type === 'PROMOTION' && promotionRule === 'percent_uplift' ? promotionUplift : null,
      effectiveDate: effectiveDateStr,
      reason,
      previewData,
      overrides
    }
    onApply(incrementData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Increment</h2>
              <p className="text-sm text-gray-500">{selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Configuration */}
          <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Increment Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'PERCENT' as const, label: 'Percentage Increase', icon: '%' },
                    { value: 'FIXED' as const, label: 'Fixed Amount', icon: 'RM' },
                    { value: 'PROMOTION' as const, label: 'Promotion', icon: '↑' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setType(option.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        type === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {option.icon}
                      </span>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {type === 'PERCENT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
                  <input
                    type="number"
                    value={valuePercent}
                    onChange={e => setValuePercent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>
              )}

              {type === 'FIXED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Amount (MYR)</label>
                  <input
                    type="number"
                    value={valueAmount}
                    onChange={e => setValueAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              )}

              {type === 'PROMOTION' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Promotion to Grade</label>
                    <select
                      value={promotionToGrade}
                      onChange={e => setPromotionToGrade(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select grade...</option>
                      {Object.keys(GRADE_TABLE).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Mapping Rule</label>
                    <select
                      value={promotionRule}
                      onChange={e => setPromotionRule(e.target.value as 'min' | 'mid' | 'max' | 'percent_uplift')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="min">Band Minimum</option>
                      <option value="mid">Band Midpoint</option>
                      <option value="max">Band Maximum</option>
                      <option value="percent_uplift">Percentage Uplift</option>
                    </select>
                  </div>

                  {promotionRule === 'percent_uplift' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Uplift Percentage (%)</label>
                      <input
                        type="number"
                        value={promotionUplift}
                        onChange={e => setPromotionUplift(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        step="0.1"
                        min="0"
                      />
                    </div>
                  )}

                  {promotionToGrade && GRADE_TABLE[promotionToGrade] && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>{promotionToGrade} Band:</strong> MYR {GRADE_TABLE[promotionToGrade].min.toLocaleString()} - {GRADE_TABLE[promotionToGrade].max.toLocaleString()}
                        <br />
                        <span className="text-gray-500">Midpoint: MYR {GRADE_TABLE[promotionToGrade].mid.toLocaleString()}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                <input
                  type="date"
                  value={effectiveDateStr}
                  onChange={e => setEffectiveDateStr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cutoff: {PAYROLL_CALENDAR.cutoffDay}th of each month
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Annual merit increase, Market adjustment"
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Impact Preview</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Cost Impact</p>
                  <p className="text-2xl font-bold text-green-600">
                    MYR {totalCost.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                  <tbody className="divide-y divide-gray-200">
                    {previewData.map(emp => (
                      <tr key={emp.employee_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{emp.employee_name}</p>
                            <p className="text-xs text-gray-500">{emp.employee_no} • {emp.position}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          MYR {emp.basic_salary.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          MYR {emp.after.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="text-sm font-medium text-green-600">
                            +MYR {emp.delta.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            +{emp.pct.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            placeholder="Override"
                            value={overrides[emp.employee_id] || ''}
                            onChange={e => setOverrides(prev => ({
                              ...prev,
                              [emp.employee_id]: e.target.value === '' ? undefined : Number(e.target.value)
                            }))}
                            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Ready to apply increment to {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Apply Increment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const employees = useMemo(() => buildEmployeeMaster(RAW_DATA), [])
  
  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [companyId, setCompanyId] = useState<string>('')
  const [department, setDepartment] = useState<string>('')
  const [position, setPosition] = useState<string>('')
  const [activeOnly, setActiveOnly] = useState<boolean>(true)
  
  // Selection and modal
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showIncrementModal, setShowIncrementModal] = useState<boolean>(false)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  
  // History
  const [batches, setBatches] = useState<IncrementBatch[]>([])
  const [lines, setLines] = useState<IncrementLine[]>([])

  const companies = Array.from(new Set(employees.map(e => `${e.company_id}:::${e.company_name || 'Company'}`)))
  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)))
  const positions = Array.from(new Set(employees.map(e => e.position).filter(Boolean)))

  const filtered = employees.filter(emp => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchesName = emp.employee_name.toLowerCase().includes(term)
      const matchesNo = emp.employee_no.toLowerCase().includes(term)
      if (!matchesName && !matchesNo) return false
    }
    
    // Other filters
    if (companyId) {
      const [id] = companyId.split(':::')
      if (String(emp.company_id) !== id) return false
    }
    if (department && emp.department !== department) return false
    if (position && emp.position !== position) return false
    if (activeOnly && emp.resigned_date) return false
    return true
  })

  const selectedEmployees = filtered.filter(emp => selectedIds.includes(emp.employee_id))

  function toggleSelectAll() {
    setSelectedIds(prev => 
      prev.length === filtered.length ? [] : filtered.map(e => e.employee_id)
    )
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleApplyIncrement(incrementData: IncrementData) {
    const batchId = `B${String(batches.length + 1).padStart(4, '0')}`
    const batch: IncrementBatch = {
      id: batchId,
      type: incrementData.type,
      reason: incrementData.reason,
      effective_date: incrementData.effectiveDate,
      created_at: new Date().toISOString(),
      employee_count: incrementData.previewData.length,
      total_cost: incrementData.previewData.reduce((sum: number, emp: EmployeePreview) => sum + emp.delta, 0)
    }
    
    const newLines: IncrementLine[] = incrementData.previewData.map((emp: EmployeePreview, i: number) => ({
      id: `${batchId}-L${i + 1}`,
      batch_id: batchId,
      employee_id: emp.employee_id,
      employee_name: emp.employee_name,
      employee_no: emp.employee_no,
      old_basic: emp.basic_salary,
      new_basic: emp.after,
      delta_amount: emp.delta,
      delta_percent: emp.pct,
      currency: emp.currency
    }))

    setBatches(prev => [batch, ...prev])
    setLines(prev => [...newLines, ...prev])
    setSelectedIds([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Increments & Promotions</h1>
              <p className="text-sm text-gray-600 mt-1">Manage salary increments and promotions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <History className="w-4 h-4" />
                History
                {showHistory ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowIncrementModal(true)}
                disabled={selectedIds.length === 0}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                  selectedIds.length > 0
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
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
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees by name or employee number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg ${
                showFilters || companyId || department || position
                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All companies</option>
                  {companies.map(c => {
                    const [id, name] = c.split(':::')
                    return <option key={c} value={c}>{name}</option>
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All positions</option>
                  {positions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={activeOnly}
                    onChange={(e) => setActiveOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active employees only</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
                  <p className="text-sm text-gray-500">
                    {filtered.length} employee{filtered.length !== 1 ? 's' : ''} found
                    {selectedIds.length > 0 && ` • ${selectedIds.length} selected`}
                  </p>
                </div>
              </div>
              {filtered.length > 0 && (
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedIds.length === filtered.length ? 'Clear selection' : 'Select all'}
                </button>
              )}
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
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Basic
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((emp) => (
                  <tr
                    key={emp.employee_id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedIds.includes(emp.employee_id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(emp.employee_id)}
                        onChange={() => toggleSelect(emp.employee_id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {emp.employee_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{emp.employee_name}</div>
                          <div className="text-sm text-gray-500">{emp.employee_no}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{emp.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{emp.position}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      MYR {emp.basic_salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {emp.job_grade ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {emp.job_grade}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.resigned_date 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>

        {/* History Section */}
        {showHistory && (
          <div className="mt-6 space-y-6">
            {/* Applied Batches */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Applied Batches</h3>
                <p className="text-sm text-gray-500">{batches.length} batch{batches.length !== 1 ? 'es' : ''} applied</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Employees</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.map((batch) => (
                      <tr key={batch.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{batch.id}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            batch.type === 'PERCENT' ? 'bg-green-100 text-green-800' :
                            batch.type === 'FIXED' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {batch.type === 'PERCENT' ? 'Percentage' : 
                             batch.type === 'FIXED' ? 'Fixed Amount' : 'Promotion'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{batch.reason}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{batch.effective_date}</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">{batch.employee_count}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                          MYR {batch.total_cost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(batch.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {batches.length === 0 && (
                <div className="text-center py-8">
                  <History className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No increment batches applied yet</p>
                </div>
              )}
            </div>

            {/* Detailed Lines */}
            {lines.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Increment Details</h3>
                  <p className="text-sm text-gray-500">{lines.length} individual increment{lines.length !== 1 ? 's' : ''}</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch/Line</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Old Basic</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">New Basic</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Increase</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lines.slice(0, 10).map((line) => (
                        <tr key={line.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{line.id}</td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{line.employee_name}</div>
                              <div className="text-sm text-gray-500">{line.employee_no}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">
                            MYR {Number(line.old_basic).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                            MYR {Number(line.new_basic).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                            +MYR {Number(line.delta_amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">
                            +{Number(line.delta_percent).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {lines.length > 10 && (
                  <div className="px-6 py-3 bg-gray-50 text-center">
                    <p className="text-sm text-gray-500">
                      Showing first 10 of {lines.length} records
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Increment Modal */}
      <IncrementModal
        isOpen={showIncrementModal}
        onClose={() => setShowIncrementModal(false)}
        selectedEmployees={selectedEmployees}
        onApply={handleApplyIncrement}
      />
    </div>
  )
}