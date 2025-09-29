'use client';

import React, { useState, useMemo, useEffect, useCallback, JSX } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, Download, Upload, Copy, RotateCcw, Plus, Edit, Trash2, Moon,
  Settings, Filter, Search, Save, X, Users, CalendarDays, Timer, ChevronLeft, ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

/* =========================== Types =========================== */
type ShiftStatus = 'working' | 'off' | 'leave';

interface User {
  id: number;
  role: 'admin' | 'manager' | 'employee' | string;
  [k: string]: unknown;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department_id: string | number | null;
  company_id: string | number | null;
  status: string;
  activation: string;
  joined_date: string;
  employee_no: string;
  employment_type: string;
  gender: string;
  role: string;
  race: string | null;
  religion: string | null;
  job_level: string | null;
  department_name: string | null;
  passport_expired_date: string;
  visa_expired_date: string;
  nationality: string;
}

interface Company { id: number; name: string }
interface Department { id: number; name: string }

interface ShiftTemplate {
  id: number;
  name: string;
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
  color: string; // tailwind classes
  label: string;
  break_mins: number;
  overnight?: boolean;
  description?: string;
}

interface PatternStepWork { type: 'work'; template: number }
interface PatternStepOff  { type: 'off' }
type PatternStep = PatternStepWork | PatternStepOff;

interface WorkPattern {
  id: number;
  name: string;
  description: string;
  sequence: PatternStep[];
}

interface CellSchedule {
  status: ShiftStatus;
  start: string;
  end: string;
  template: number | null;
  isCustom: boolean;
  notes: string;
  break_mins?: number;
  overnight?: boolean;
}

interface EditingCell { employeeId: number; day: number }

interface EmployeeStats {
  totalHours: number;
  workingDays: number;
  nightHours: number;
  offDays: number;
  averageDaily: number;
}

interface SchedulePayloadItem {
  employee_id: number;
  year: number;
  month: number; // 0-based month in UI; convert to 1-based for API if needed
  day: number;
  status: ShiftStatus;
  start: string;
  end: string;
  break_mins: number;
  overnight: boolean;
  template_id: number | null;
  notes: string;
}

/* =========================== Helpers =========================== */
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

const calculateHours = (start: string, end: string, overnight = false): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let s = sh * 60 + sm, e = eh * 60 + em;
  if (overnight && e < s) e += 24 * 60;
  return Math.max(0, (e - s) / 60);
};

const calcNetHours = (start: string, end: string, overnight: boolean | undefined, breakMins: number | undefined) => {
  const gross = calculateHours(start, end, !!overnight);
  const net = Math.max(0, gross - (breakMins ?? 0) / 60);
  return net;
};

/* =========================== Page =========================== */
export default function HRMSScheduler(): JSX.Element {
  const router = useRouter();

  /* ---- Auth/User ---- */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ---- Master data ---- */
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  /* ---- Scheduler state ---- */
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  // Selected employees (checkboxes) for bulk actions; NOT used to hide others anymore.
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const [activeView, setActiveView] = useState<'scheduler'|'templates'|'patterns'>('scheduler');
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [scheduleData, setScheduleData] = useState<Record<string, CellSchedule>>({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'month'|'week'|'day'>('month');
  const [isCompact, setIsCompact] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [dragStart, setDragStart] = useState<EditingCell | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Pagination (employees list)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Save state
  const [dirty, setDirty] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  const [lastSavedAt, setLastSavedAt] = useState<string>('');

  /* ---- Template & Pattern state (editable) ---- */
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([
    { id: 1, name: 'Morning', start: '09:00', end: '17:00', color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Office', break_mins: 60, description: 'Standard office with lunch' },
    { id: 2, name: 'Night',   start: '23:00', end: '07:00', color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Night Ops', break_mins: 60, overnight: true, description: 'Overnight support' },
    { id: 3, name: 'Evening', start: '15:00', end: '23:00', color: 'bg-green-50 text-green-700 border-green-200', label: 'Evening', break_mins: 45, description: 'Afternoon to late' },
    { id: 4, name: 'Split AM', start: '09:00', end: '13:00', color: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Part Time', break_mins: 30, description: 'Morning part-time' },
  ]);

  const [patterns, setPatterns] = useState<WorkPattern[]>([
    {
      id: 1, name: '5-on / 2-off', description: '5 work, 2 off',
      sequence: [{type:'work',template:1},{type:'work',template:1},{type:'work',template:1},{type:'work',template:1},{type:'work',template:1},{type:'off'},{type:'off'}]
    },
    {
      id: 2, name: '4 Morning → 2 Off → 4 Eve → 2 Off', description: 'Rotating',
      sequence: [
        {type:'work',template:1},{type:'work',template:1},{type:'work',template:1},{type:'work',template:1},
        {type:'off'},{type:'off'},
        {type:'work',template:3},{type:'work',template:3},{type:'work',template:3},{type:'work',template:3},
        {type:'off'},{type:'off'}
      ]
    },
    {
      id: 3, name: '24/7 Mix', description: 'Morning→Evening→Night→Off',
      sequence: [
        {type:'work',template:1},{type:'work',template:3},{type:'work',template:2},{type:'off'}
      ]
    }
  ]);

  const [newTemplate, setNewTemplate] = useState<ShiftTemplate>({
    id: 0, name: '', start: '09:00', end: '17:00', color: 'bg-blue-50 text-blue-700 border-blue-200', label: '', break_mins: 60, overnight: false, description: ''
  });

  const [newPattern, setNewPattern] = useState<WorkPattern>({
    id: 0, name: '', description: '', sequence: [{ type: 'work', template: 1 }]
  });

  /* ================= Auth bootstrap ================= */
  useEffect(() => {
    const userStr = localStorage.getItem('hrms_user');
    const isAuthenticated = localStorage.getItem('hrms_authenticated');
    if (!userStr || isAuthenticated !== 'true') {
      router.push('/auth/login');
      return;
    }
    try {
      setUser(JSON.parse(userStr));
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  /* ================= Fetchers ================= */
  const fetchAllEmployees = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (user?.role === 'manager') queryParams.append('manager_id', String(user.id));
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const token = localStorage.getItem('hrms_token');

      const response = await fetch(`${API_BASE_URL}/api/admin/employees${queryString}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: any[] = await response.json();

      const mapped: Employee[] = data
        .filter((emp: any) => emp.role !== 'admin')
        .map((emp: any): Employee => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          position: emp.position || '',
          department_id: emp.department_id ?? '',
          company_id: emp.company_id ?? '',
          status: (emp.status?.toLowerCase() || 'active'),
          activation: emp.activation || 'Activated',
          joined_date: emp.joined_date || '',
          employee_no: emp.employee_no || '',
          employment_type: emp.employment_type || '',
          gender: emp.gender || '',
          role: emp.role || 'employee',
          race: emp.race ?? null,
          religion: emp.religion ?? null,
          job_level: emp.job_level ?? null,
          department_name: emp.department_name ?? null,
          passport_expired_date: emp.passport_expired_date || '',
          visa_expired_date: emp.visa_expired_date || '',
          nationality: emp.nationality || '',
        }));

      setAllEmployees(mapped);
      // Preselect none; selection is for bulk actions only.
      setSelectedEmployees([]);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchAllEmployees();

    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/companies`);
        if (!res.ok) throw new Error(`Failed to fetch companies: ${res.statusText}`);
        const data = await res.json();
        setCompanies(
          (Array.isArray(data) ? data : data?.data ?? []).map((c: any) => ({
            id: c.id ?? c.company_id,
            name: c.name ?? c.company_name ?? `Company ${c.id || c.company_id}`,
          }))
        );
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchAllDepartments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/departments`);
        if (!res.ok) throw new Error(`Failed to fetch departments: ${res.statusText}`);
        const data = await res.json();
        const normalized: Department[] = (Array.isArray(data) ? data : data?.data ?? []).map((d: any) => ({
          id: d.id ?? d.department_id,
          name: d.name ?? d.department_name ?? `Dept ${d.id || d.department_id}`,
        }));
        setAllDepartments(normalized);
        setDepartments(normalized);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchCompanies();
    fetchAllDepartments();
  }, [user, fetchAllEmployees]);

  /* ================= Calendar & Filtering ================= */
  const totalDays = useMemo(() => daysInMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  const dowLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const filteredEmployees: Employee[] = useMemo(() => {
    let out = allEmployees;
    if (selectedDepartment !== 'All') {
      out = out.filter(e => (e.department_name || '').toLowerCase() === selectedDepartment.toLowerCase());
    }
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      out = out.filter(e =>
        e.name.toLowerCase().includes(t) ||
        (e.employee_no || '').toLowerCase().includes(t) ||
        (e.department_name || '').toLowerCase().includes(t)
      );
    }
    return out; // IMPORTANT: show all; do NOT filter by selectedEmployees anymore
  }, [allEmployees, selectedDepartment, searchTerm]);

  // Pagination slices
  const totalEmployees = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalEmployees / pageSize));
  const pageStartIdx = (currentPage - 1) * pageSize;
  const pageEndIdx = Math.min(pageStartIdx + pageSize, totalEmployees);
  const pagedEmployees = filteredEmployees.slice(pageStartIdx, pageEndIdx);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [selectedDepartment, searchTerm, selectedYear, selectedMonth]);

  /* ================= Schedule helpers ================= */
  const getScheduleKey = (employeeId: number, day: number) => `${employeeId}-${selectedYear}-${selectedMonth}-${day}`;

  const getCellSchedule = (employeeId: number, day: number): CellSchedule => {
    const key = getScheduleKey(employeeId, day);
    return scheduleData[key] ?? { status: 'off', start: '', end: '', template: null, isCustom: false, notes: '' };
  };

  const setCellSchedule = (employeeId: number, day: number, patch: Partial<CellSchedule>) => {
    const key = getScheduleKey(employeeId, day);
    setScheduleData(prev => {
      const merged = { ...(prev[key] ?? getCellSchedule(employeeId, day)), ...patch };
      return { ...prev, [key]: merged };
    });
    setDirty(true);
  };

  const getEmployeeStats = (employeeId: number): EmployeeStats => {
    let totalHours = 0, working = 0, night = 0, off = 0;
    for (let d = 1; d <= totalDays; d++) {
      const sch = getCellSchedule(employeeId, d);
      if (sch.status === 'working') {
        const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;
        const net = calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins);
        totalHours += net;
        working++;
        if (sch.overnight ?? tpl?.overnight) night += net;
      } else {
        off++;
      }
    }
    return { totalHours, workingDays: working, nightHours: night, offDays: off, averageDaily: totalDays ? totalHours / totalDays : 0 };
  };

  const applyPatternToEmployee = (employeeId: number, patternId: number, startDate: number = 1) => {
    const pat = patterns.find(p => p.id === patternId);
    if (!pat) return;
    for (let d = startDate; d <= totalDays; d++) {
      const step = pat.sequence[(d - startDate) % pat.sequence.length];
      if (step.type === 'work') {
        const tpl = shiftTemplates.find(t => t.id === (step as PatternStepWork).template);
        if (!tpl) continue;
        setCellSchedule(employeeId, d, {
          status: 'working',
          start: tpl.start,
          end: tpl.end,
          template: tpl.id,
          isCustom: false,
          break_mins: tpl.break_mins,
          overnight: tpl.overnight
        });
      } else {
        setCellSchedule(employeeId, d, { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false });
      }
    }
  };

  /* ================= Drag select ================= */
  const handleMouseDown = (employeeId: number, day: number) => { setDragStart({ employeeId, day }); setIsDragging(true); };
  const handleMouseOver = (employeeId: number, day: number) => {
    if (!isDragging || !dragStart || dragStart.employeeId !== employeeId) return;
    const start = Math.min(dragStart.day, day), end = Math.max(dragStart.day, day);
    const s = new Set<string>();
    for (let d = start; d <= end; d++) s.add(`${employeeId}-${d}`);
    setSelectedCells(s);
  };
  useEffect(() => {
    const up = () => { setIsDragging(false); setDragStart(null); };
    document.addEventListener('mouseup', up);
    return () => document.removeEventListener('mouseup', up);
  }, []);

  /* ================= Save ================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError('');

      // Build payload for current month
      const items: SchedulePayloadItem[] = [];
      const token = localStorage.getItem('hrms_token');

      Object.entries(scheduleData).forEach(([key, sch]) => {
        const [empIdStr, yStr, mStr, dStr] = key.split('-');
        const empId = parseInt(empIdStr, 10);
        const y = parseInt(yStr, 10);
        const m = parseInt(mStr, 10); // 0-based in UI
        const d = parseInt(dStr, 10);

        if (y === selectedYear && m === selectedMonth) {
          items.push({
            employee_id: empId,
            year: y,
            month: m + 1, // convert to 1-based month for backend (common pattern)
            day: d,
            status: sch.status,
            start: sch.start || '',
            end: sch.end || '',
            break_mins: sch.break_mins ?? (sch.template ? (shiftTemplates.find(t => t.id === sch.template)?.break_mins ?? 0) : 0),
            overnight: sch.overnight ?? (sch.template ? !!(shiftTemplates.find(t => t.id === sch.template)?.overnight) : false),
            template_id: sch.template ?? null,
            notes: sch.notes || ''
          });
        }
      });

      // TODO: adjust API endpoint/payload here to match your backend
      const res = await fetch(`${API_BASE_URL}/api/schedules/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth + 1,
          items
        })
      });

      //if (!res.ok) throw new Error(`Failed to save (status ${res.status})`);

      setDirty(false);
      setLastSavedAt(new Date().toLocaleString());
    } catch (err: any) {
      console.error(err);
      setSaveError(err?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  /* ================= Modals ================= */

  // Custom Time Modal
  const CustomTimeModal = () => {
    const [start, setStart] = useState<string>('09:00');
    const [end, setEnd] = useState<string>('17:00');
    const [breakMins, setBreakMins] = useState<number>(60);
    const [overnight, setOvernight] = useState<boolean>(false);
    const [notes, setNotes] = useState<string>('');

    useEffect(() => {
      if (!editingCell) return;
      const sch = getCellSchedule(editingCell.employeeId, editingCell.day);
      if (sch.status === 'working') {
        setStart(sch.start || '09:00');
        setEnd(sch.end || '17:00');
        setBreakMins(sch.break_mins ?? 60);
        setOvernight(!!sch.overnight);
        setNotes(sch.notes || '');
      } else {
        setStart('09:00'); setEnd('17:00'); setBreakMins(60); setOvernight(false); setNotes('');
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingCell?.employeeId, editingCell?.day, showCustomTimeModal]);

    if (!showCustomTimeModal || !editingCell) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
              <div>
                <h3 className="text-lg font-semibold">Custom Time</h3>
                <p className="text-sm text-gray-500">Set custom hours</p>
              </div>
            </div>
            <button onClick={() => setShowCustomTimeModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <input type="time" className="input input-bordered w-full" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input type="time" className="input input-bordered w-full" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Break (mins)</label>
              <input type="number" className="input input-bordered w-full" min={0} step={15} value={breakMins} onChange={(e) => setBreakMins(parseInt(e.target.value || '0', 10))} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea className="textarea textarea-bordered w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex items-center gap-3">
              <input id="overnight" type="checkbox" className="checkbox checkbox-primary" checked={overnight} onChange={(e) => setOvernight(e.target.checked)} />
              <label htmlFor="overnight" className="text-sm">Overnight shift</label>
            </div>

            <div className="text-sm text-gray-600">
              Net hours:&nbsp;<span className="font-semibold">{formatHours(calcNetHours(start, end, overnight, breakMins))}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
            <button className="btn btn-ghost" onClick={() => setShowCustomTimeModal(false)}>Cancel</button>
            <button
              className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => {
                const targets = selectedCells.size > 0
                  ? Array.from(selectedCells).map(k => {
                      const [eid, d] = k.split('-').map(Number);
                      return { employeeId: eid, day: d };
                    })
                  : [editingCell];

                targets.forEach(({ employeeId, day }) => {
                  setCellSchedule(employeeId, day, {
                    status: 'working',
                    start, end, isCustom: true, notes, template: null,
                    break_mins: breakMins, overnight
                  });
                });

                setSelectedCells(new Set());
                setShowCustomTimeModal(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Template Modal
  const TemplateModal = () => {
    if (!showTemplateModal) return null;

    const total = calculateHours(newTemplate.start, newTemplate.end, !!newTemplate.overnight);
    const net = Math.max(0, total - (newTemplate.break_mins ?? 0) / 60);

    const createTemplate = () => {
      const id = shiftTemplates.length ? Math.max(...shiftTemplates.map(t => t.id)) + 1 : 1;
      setShiftTemplates(prev => [...prev, { ...newTemplate, id }]);
      setNewTemplate({ id: 0, name: '', start: '09:00', end: '17:00', color: 'bg-blue-50 text-blue-700 border-blue-200', label: '', break_mins: 60, overnight: false, description: '' });
      setShowTemplateModal(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><Clock className="w-5 h-5 text-green-600" /></div>
              <div>
                <h3 className="text-lg font-semibold">Create Shift Template</h3>
                <p className="text-sm text-gray-500">Define reusable shift schedules</p>
              </div>
            </div>
            <button onClick={() => setShowTemplateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template Name</label>
                <input className="input input-bordered w-full"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekend Shift" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Label/Category</label>
                <input className="input input-bordered w-full"
                  value={newTemplate.label}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Weekend, Holiday" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea className="textarea textarea-bordered w-full" rows={2}
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start</label>
                <input type="time" className="input input-bordered w-full"
                  value={newTemplate.start}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, start: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End</label>
                <input type="time" className="input input-bordered w-full"
                  value={newTemplate.end}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, end: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Break (mins)</label>
                <input type="number" className="input input-bordered w-full" min={0} step={15}
                  value={newTemplate.break_mins}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, break_mins: parseInt(e.target.value || '0', 10) }))} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <input id="tpl-overnight" type="checkbox" className="checkbox checkbox-primary"
                  checked={!!newTemplate.overnight}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, overnight: e.target.checked }))} />
                <label htmlFor="tpl-overnight" className="text-sm font-medium">Overnight Shift</label>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Gross: {formatHours(total)}</div>
                <div className="text-xs text-gray-500">Net: {formatHours(net)}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
            <button className="btn btn-ghost" onClick={() => setShowTemplateModal(false)}>Cancel</button>
            <button className="btn bg-green-600 hover:bg-green-700 text-white border-0" onClick={createTemplate}>
              <Save className="w-4 h-4 mr-2" /> Create Template
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pattern Builder Modal
  const PatternBuilderModal = () => {
    if (!showPatternBuilder) return null;

    const addDay = () => setNewPattern(prev => ({ ...prev, sequence: [...prev.sequence, { type: 'work', template: shiftTemplates[0]?.id ?? 1 }] }));
    const removeDay = (index: number) => setNewPattern(prev => ({ ...prev, sequence: prev.sequence.filter((_, i) => i !== index) }));
    const changeType = (index: number, val: 'work' | 'off') => {
      setNewPattern(prev => {
        const seq = [...prev.sequence];
        if (val === 'off') seq[index] = { type: 'off' };
        else {
          const current = seq[index];
          const tplId = (current as PatternStepWork).template ?? (shiftTemplates[0]?.id ?? 1);
          seq[index] = { type: 'work', template: tplId };
        }
        return { ...prev, sequence: seq };
      });
    };
    const changeTemplate = (index: number, tplId: number) => {
      setNewPattern(prev => {
        const seq = [...prev.sequence];
        seq[index] = { type: 'work', template: tplId };
        return { ...prev, sequence: seq };
      });
    };

    const savePattern = () => {
      const id = patterns.length ? Math.max(...patterns.map(p => p.id)) + 1 : 1;
      setPatterns(prev => [...prev, { ...newPattern, id }]);
      setNewPattern({ id: 0, name: '', description: '', sequence: [{ type: 'work', template: 1 }] });
      setShowPatternBuilder(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Settings className="w-5 h-5 text-purple-600" /></div>
              <div>
                <h3 className="text-lg font-semibold">Pattern Builder</h3>
                <p className="text-sm text-gray-500">Create custom work patterns</p>
              </div>
            </div>
            <button onClick={() => setShowPatternBuilder(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Left - config */}
            <div className="w-1/3 border-r p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Pattern Name</label>
                  <input className="input input-bordered w-full" placeholder="e.g., Flexible 4-3"
                    value={newPattern.name} onChange={(e) => setNewPattern(prev => ({ ...prev, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea className="textarea textarea-bordered w-full" rows={3}
                    value={newPattern.description} onChange={(e) => setNewPattern(prev => ({ ...prev, description: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Pattern Sequence</label>
                  <div className="space-y-2">
                    {newPattern.sequence.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                        <span className="text-sm font-medium text-gray-600 w-14">Day {index + 1}</span>
                        <select className="select select-bordered select-sm flex-1" value={step.type}
                          onChange={(e) => changeType(index, e.target.value as 'work' | 'off')}>
                          <option value="work">Work</option>
                          <option value="off">Off</option>
                        </select>
                        {step.type === 'work' && (
                          <select className="select select-bordered select-sm flex-1"
                            value={(step as PatternStepWork).template}
                            onChange={(e) => changeTemplate(index, parseInt(e.target.value, 10))}>
                            {shiftTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        )}
                        <button className="btn btn-sm btn-ghost text-red-600" onClick={() => removeDay(index)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-sm btn-outline w-full" onClick={addDay}>
                      <Plus className="w-4 h-4" /> Add Day
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - preview */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h4 className="text-lg font-semibold mb-4">Pattern Preview (28 days)</h4>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }, (_, i) => {
                  const step = newPattern.sequence[i % newPattern.sequence.length];
                  const tpl = step.type === 'work'
                    ? shiftTemplates.find(t => t.id === (step as PatternStepWork).template)
                    : undefined;
                  return (
                    <div key={i} className="aspect-square border rounded p-2">
                      <div className="text-xs font-medium text-gray-600 mb-1">{i + 1}</div>
                      {step.type === 'work' && tpl ? (
                        <div className={`text-xs p-1 rounded ${tpl.color} truncate`}>
                          <div className="font-medium">{tpl.start}</div>
                          <div>{tpl.end}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 text-center p-1">Off</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4 bg-gray-50">
            <button className="btn btn-ghost" onClick={() => setShowPatternBuilder(false)}>Cancel</button>
            <button className="btn bg-purple-600 hover:bg-purple-700 text-white border-0" onClick={savePattern}>
              <Save className="w-4 h-4 mr-2" /> Save Pattern
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ================= Main Scheduler Table ================= */
  const HeaderRow = () => (
    <thead className="sticky top-0 z-10 bg-white">
      <tr className="border-b">
        <th className="px-4 py-3 text-left w-[280px] bg-gray-50 border-r">
          <div className="flex items-center justify-between">
            <span>Employee</span>
            {/* Select all on this page */}
            <label className="flex items-center gap-2 text-xs font-normal text-gray-600">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                checked={pagedEmployees.length > 0 && pagedEmployees.every(e => selectedEmployees.includes(e.id))}
                onChange={(e) => {
                  const ids = pagedEmployees.map(e => e.id);
                  setSelectedEmployees(prev => {
                    if (e.target.checked) {
                      const set = new Set([...prev, ...ids]);
                      return Array.from(set);
                    } else {
                      return prev.filter(id => !ids.includes(id));
                    }
                  });
                }}
              />
              <span>Select page</span>
            </label>
          </div>
        </th>
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const date = new Date(selectedYear, selectedMonth, day);
          const isToday = day === new Date().getDate()
            && selectedMonth === new Date().getMonth()
            && selectedYear === new Date().getFullYear();
          const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
          return (
            <th key={day} className={`px-2 py-2 min-w-[88px] text-center border-r ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="text-xs text-gray-500">{dow}</div>
              <div className={`text-sm font-semibold ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>{day}</div>
            </th>
          );
        })}
      </tr>
    </thead>
  );

  const Row = ({ emp }: { emp: Employee }) => {
    const stats = getEmployeeStats(emp.id);
    const isSelected = selectedEmployees.includes(emp.id);

    return (
      <tr className="border-b hover:bg-gray-50/40">
        {/* Left fixed cell */}
        <td className="align-top border-r w-[280px]">
          <div className="p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900 truncate">{emp.name}</div>
                <div className="text-xs text-gray-500 truncate">{emp.employee_no || emp.email} • {emp.department_name ?? '-'}</div>
                {!isCompact && <div className="text-xs text-blue-600 font-medium mt-1">{formatHours(stats.totalHours)} • {stats.workingDays} days</div>}
              </div>
              <input
                type="checkbox"
                className="checkbox checkbox-sm mt-1"
                checked={isSelected}
                onChange={(e) => {
                  setSelectedEmployees(prev => {
                    if (e.target.checked) return Array.from(new Set([...prev, emp.id]));
                    return prev.filter(id => id !== emp.id);
                  });
                }}
              />
            </div>

            {/* Quick Pattern Apply for just this employee */}
            <div className="mt-2">
              <select
                className="select select-xs border-gray-300 text-xs bg-white"
                onChange={(e) => { if (e.target.value) { applyPatternToEmployee(emp.id, parseInt(e.target.value,10)); e.target.value=''; } }}
                value=""
              >
                <option value="">Apply Pattern</option>
                {patterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </td>

        {/* Day cells */}
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const sch = getCellSchedule(emp.id, day);
          const key = `${emp.id}-${day}`;
          const sel = selectedCells.has(key);
          const tpl = sch.template ? shiftTemplates.find(t => t.id === sch.template) : undefined;

          const displayNet = sch.status === 'working'
            ? calcNetHours(sch.start, sch.end, sch.overnight ?? tpl?.overnight, sch.break_mins ?? tpl?.break_mins)
            : 0;

          const isToday = day === new Date().getDate()
            && selectedMonth === new Date().getMonth()
            && selectedYear === new Date().getFullYear();

          return (
            <td
              key={key}
              className={`align-top border-r cursor-pointer ${sel ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''} ${isToday ? 'bg-blue-50/30' : ''}`}
onClick={() => setSelectedCells(prev => {
  const next = new Set(prev);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  return next;
})}
              //onClick={() => setSelectedCells(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; })}
              onDoubleClick={() => { setEditingCell({ employeeId: emp.id, day }); setShowCustomTimeModal(true); }}
              onMouseDown={() => handleMouseDown(emp.id, day)}
              onMouseOver={() => handleMouseOver(emp.id, day)}
            >
              <div className={`p-2 ${isCompact ? '' : 'p-3'}`}>
                {sch.status === 'working' ? (
                  <div className={`rounded-lg border text-xs ${tpl?.color || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    <div className="p-1.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {(sch.overnight ?? tpl?.overnight) && <Moon className="w-3 h-3" />}
                          <span className="font-medium">{sch.start}</span>
                        </div>
                      </div>
                      <div className="text-gray-700">{sch.end}</div>
                      {!isCompact && (
                        <div className="flex items-center justify-between text-[11px] mt-0.5">
                          <span className="font-semibold">{formatHours(displayNet)}</span>
                          {sch.isCustom && <span className="px-1.5 py-0.5 rounded bg-yellow-200 text-yellow-900">Custom</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ) : sch.status === 'leave' ? (
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 h-full flex items-center justify-center">
                    <div className="text-center p-2 text-xs font-medium">Leave</div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-xs">Off</div>
                  </div>
                )}
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  const SchedulerTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Controls row */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          {/* Showing X–Y of N */}
          <span>
            Showing <strong>{totalEmployees ? pageStartIdx + 1 : 0}-{pageEndIdx}</strong> of <strong>{totalEmployees}</strong> employees {loading && '(loading...)'}
          </span>
          {/* Page size */}
          <label className="flex items-center gap-2">
            <span className="text-gray-500">Rows:</span>
            <select
              className="select select-xs"
              value={pageSize}
              onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setCurrentPage(1); }}
            >
              {[10, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          {/* Pagination */}
          <div className="flex items-center gap-1">
            <button
              className="btn btn-xs"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-gray-600 text-xs">Page {currentPage} / {totalPages}</span>
            <button
              className="btn btn-xs"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`badge ${dirty ? 'badge-warning' : 'badge-ghost'} text-xs`}>{dirty ? 'Unsaved changes' : lastSavedAt ? `Saved ${lastSavedAt}` : ''}</div>
          <button
            className={`btn btn-sm ${dirty ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' : 'btn-ghost border border-gray-300 text-gray-700'}`}
            onClick={handleSave}
            disabled={!dirty || saving}
            title="Save schedules for this month"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Bulk selection toolbar */}
      {(selectedCells.size > 0 || selectedEmployees.length > 0) && (
        <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedCells.size > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">{selectedCells.size}</div>
                <div>
                  <div className="font-medium text-blue-900">{selectedCells.size} cells selected</div>
                  <div className="text-sm text-blue-700">Choose an action</div>
                </div>
              </div>
            )}
            {selectedEmployees.length > 0 && (
              <div className="text-sm text-blue-900">
                <strong>{selectedEmployees.length}</strong> employees selected (bulk apply)
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Quick apply templates to selected cells (if any), else to selected employees for whole month */}
            {shiftTemplates.map(tpl => (
              <button
                key={tpl.id}
                className={`btn btn-xs border ${tpl.color}`}
                onClick={() => {
                  if (selectedCells.size > 0) {
                    selectedCells.forEach(k => {
                      const [eid, d] = k.split('-').map(Number);
                      setCellSchedule(eid, d, { status: 'working', start: tpl.start, end: tpl.end, template: tpl.id, isCustom: false, break_mins: tpl.break_mins, overnight: tpl.overnight });
                    });
                    setSelectedCells(new Set());
                  } else if (selectedEmployees.length > 0) {
                    for (const eid of selectedEmployees) {
                      for (let d = 1; d <= totalDays; d++) {
                        setCellSchedule(eid, d, { status: 'working', start: tpl.start, end: tpl.end, template: tpl.id, isCustom: false, break_mins: tpl.break_mins, overnight: tpl.overnight });
                      }
                    }
                  }
                }}
              >
                {tpl.name}
              </button>
            ))}

            <button
              className="btn btn-xs bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                // Open custom modal focused on the first selected cell or first selected employee/day 1
                if (selectedCells.size > 0) {
                  const [first] = Array.from(selectedCells);
                  const [eid, d] = first.split('-').map(Number);
                  setEditingCell({ employeeId: eid, day: d });
                } else if (selectedEmployees.length > 0) {
                  setEditingCell({ employeeId: selectedEmployees[0], day: 1 });
                } else if (pagedEmployees.length > 0) {
                  setEditingCell({ employeeId: pagedEmployees[0].id, day: 1 });
                }
                setShowCustomTimeModal(true);
              }}
            >
              <Clock className="w-3 h-3 mr-1" /> Custom Time
            </button>

            <button
              className="btn btn-xs btn-outline border-red-300 text-red-600"
              onClick={() => {
                if (selectedCells.size > 0) {
                  selectedCells.forEach(k => {
                    const [eid, d] = k.split('-').map(Number);
                    setCellSchedule(eid, d, { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false });
                  });
                  setSelectedCells(new Set());
                } else if (selectedEmployees.length > 0) {
                  for (const eid of selectedEmployees) {
                    for (let d = 1; d <= totalDays; d++) {
                      setCellSchedule(eid, d, { status: 'off', start: '', end: '', template: null, isCustom: false, break_mins: 0, overnight: false });
                    }
                  }
                }
              }}
            >
              Set Off
            </button>

            <button className="btn btn-xs" onClick={() => { setSelectedCells(new Set()); setSelectedEmployees([]); }}>
              <X className="w-3 h-3 mr-1" /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Error / success bar */}
      {(saveError || (!dirty && lastSavedAt)) && (
        <div className={`px-4 py-2 border-b ${saveError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {saveError ? saveError : `Saved successfully at ${lastSavedAt}`}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <HeaderRow />
          <tbody>
            {pagedEmployees.map(emp => <Row key={emp.id} emp={emp} />)}
          </tbody>
        </table>
      </div>

      {/* Daily totals row */}
      <div className="border-t bg-gray-50">
        <div className="flex">
          <div className="w-[280px] px-4 py-3 border-r font-medium text-gray-700">Daily Total (All Visible Employees)</div>
          <div className="flex overflow-x-auto">
            {Array.from({ length: totalDays }, (_, i) => {
              const day = i + 1;
              const total = pagedEmployees.reduce((sum, e) => {
                const sch = getCellSchedule(e.id, day);
                if (sch.status !== 'working') return sum;
                return sum + calcNetHours(sch.start, sch.end, sch.overnight, sch.break_mins);
              }, 0);
              return (
                <div key={day} className="min-w-[88px] px-3 py-3 border-r text-center">
                  <span className="text-sm font-semibold text-blue-600">{formatHours(total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  /* ================= Render ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Scheduler</h1>
              <p className="text-gray-600 mt-1">Dynamic per-employee or bulk scheduling.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-ghost border border-gray-300 text-gray-700">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="btn btn-ghost border border-gray-300 text-gray-700">
                <Upload className="w-4 h-4" /> Import
              </button>
              {/* <button className="btn btn-ghost border border-gray-300 text-gray-700">
                <Copy className="w-4 h-4" /> Copy Week
              </button> */}
              <div className="divider divider-horizontal mx-2" />
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => setShowTemplateModal(true)}>
                <Plus className="w-4 h-4" /> New Template
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="tabs tabs-boxed bg-white border border-gray-200 shadow-sm">
              <button className={`tab gap-2 ${activeView==='scheduler' ? 'tab-active bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('scheduler')}>
                <Calendar className="w-4 h-4" /> Scheduler
              </button>
              <button className={`tab gap-2 ${activeView==='templates' ? 'tab-active bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('templates')}>
                <Clock className="w-4 h-4" /> Templates
              </button>
              <button className={`tab gap-2 ${activeView==='patterns' ? 'tab-active bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => setActiveView('patterns')}>
                <Settings className="w-4 h-4" /> Patterns
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button onClick={() => setShowFilters(s => !s)} className={`btn btn-sm border border-gray-300 ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white text-gray-700'}`}>
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </div>

        {activeView === 'scheduler' && (
          <>
            {/* Filters */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Month & Year</label>
                      <select
                        className="select select-bordered select-sm w-full"
                        value={`${selectedYear}-${selectedMonth}`}
                        onChange={(e) => {
                          const [y, m] = e.target.value.split('-').map(Number);
                          setSelectedYear(y); setSelectedMonth(m); setCurrentPage(1);
                        }}
                      >
                        <option value={`${selectedYear}-${selectedMonth}`}>{new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</option>
                        {/* quick nav examples */}
                        <option value="2025-0">January 2025</option>
                        <option value="2025-1">February 2025</option>
                        <option value="2025-2">March 2025</option>
                        <option value="2025-3">April 2025</option>
                        <option value="2025-4">May 2025</option>
                        <option value="2025-5">June 2025</option>
                        <option value="2025-6">July 2025</option>
                        <option value="2025-7">August 2025</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Department</label>
                      <select
                        className="select select-bordered select-sm w-full"
                        value={selectedDepartment}
                        onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="All">All Departments</option>
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium mb-2">Search Employee</label>
                      <div className="relative">
                        <input className="input input-bordered input-sm w-full pl-8"
                          placeholder="Name, ID, or dept..."
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Apply Pattern (Bulk)</label>
                      <select
                        className="select select-bordered select-sm w-full"
                        onChange={(e) => {
                          if (!e.target.value) return;
                          const pid = parseInt(e.target.value, 10);
                          const targets = selectedEmployees.length > 0
                            ? allEmployees.filter(e => selectedEmployees.includes(e.id))
                            : pagedEmployees; // apply to current page if none selected
                          targets.forEach(emp => applyPatternToEmployee(emp.id, pid));
                          e.target.value = '';
                        }}
                        value=""
                      >
                        <option value="">Select Pattern</option>
                        {patterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">View Mode</label>
                      <select className="select select-bordered select-sm w-full" value={viewMode} onChange={(e) => setViewMode(e.target.value as 'month'|'week'|'day')}>
                        <option value="month">Month</option>
                        <option value="week">Week</option>
                        <option value="day">Day</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Showing {pageEndIdx - pageStartIdx} of {totalEmployees} employees on this page {loading && '(loading...)'}
                    </div>
                    <button className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50" onClick={() => { setSearchTerm(''); setSelectedDepartment('All'); setViewMode('month'); setCurrentPage(1); }}>
                      <RotateCcw className="w-4 h-4 mr-1" /> Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Scheduler */}
            <SchedulerTable />

            {/* Summary cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-blue-100 text-sm font-medium">Total Hours (Net) — This Page</div>
                    <div className="text-3xl font-bold mt-1">
                      {formatHours(pagedEmployees.reduce((sum, emp) => sum + getEmployeeStats(emp.id).totalHours, 0))}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-400/30 rounded-lg flex items-center justify-center"><Timer className="w-6 h-6" /></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-green-100 text-sm font-medium">Working Days — This Page</div>
                    <div className="text-3xl font-bold mt-1">
                      {pagedEmployees.reduce((s, e) => s + getEmployeeStats(e.id).workingDays, 0)}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-400/30 rounded-lg flex items-center justify-center"><CalendarDays className="w-6 h-6" /></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-purple-100 text-sm font-medium">Night Hours — This Page</div>
                    <div className="text-3xl font-bold mt-1">
                      {formatHours(pagedEmployees.reduce((s, e) => s + getEmployeeStats(e.id).nightHours, 0))}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-400/30 rounded-lg flex items-center justify-center"><Moon className="w-6 h-6" /></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-100 text-sm font-medium">Employees on Page</div>
                    <div className="text-3xl font-bold mt-1">{pagedEmployees.length}</div>
                  </div>
                  <div className="w-12 h-12 bg-orange-400/30 rounded-lg flex items-center justify-center"><Users className="w-6 h-6" /></div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Shift Templates</h2>
                <p className="text-gray-600">Reusable shift schedules</p>
              </div>
              <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-0" onClick={() => setShowTemplateModal(true)}>
                <Plus className="w-4 h-4" /> New Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shiftTemplates.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${t.color}`}>{t.name}</div>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                        <button className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50" onClick={() => setShiftTemplates(prev => prev.filter(x => x.id !== t.id))}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Start</span><span className="font-medium">{t.start}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">End</span><span className="font-medium">{t.end}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Break</span><span className="font-medium">{t.break_mins} mins</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Net</span><span className="font-medium text-blue-600">{formatHours(calcNetHours(t.start,t.end,!!t.overnight,t.break_mins))}</span></div>
                      {t.overnight && <div className="flex items-center gap-1 text-purple-600"><Moon className="w-4 h-4" /><span>Overnight</span></div>}
                    </div>

                    {t.description && <div className="mt-4 pt-4 border-t text-gray-600 text-sm">{t.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'patterns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Work Patterns</h2>
                <p className="text-gray-600">Rotate shifts like 5/2, 4/2, night cycles</p>
              </div>
              <button className="btn bg-purple-600 hover:bg-purple-700 text-white border-0" onClick={() => setShowPatternBuilder(true)}>
                <Plus className="w-4 h-4" /> Build Pattern
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patterns.map(p => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        <p className="text-sm text-gray-600">{p.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                        <button className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50" onClick={() => setPatterns(prev => prev.filter(x => x.id !== p.id))}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
                      <div className="grid grid-cols-7 gap-1">
                        {p.sequence.slice(0,7).map((s, i) => {
                          const tpl = s.type==='work' ? shiftTemplates.find(t => t.id === (s as PatternStepWork).template) : undefined;
                          return (
                            <div key={i} className="aspect-square border border-gray-200 rounded text-xs">
                              {s.type==='work' && tpl
                                ? <div className={`w-full h-full rounded text-center flex flex-col justify-center ${tpl.color}`}>
                                    <div className="font-medium text-xs">{tpl.start}</div>
                                    <div className="text-xs">{tpl.end}</div>
                                  </div>
                                : <div className="w-full h-full flex items-center justify-center text-gray-400">Off</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {p.sequence.filter(s=>s.type==='work').length} work days, {p.sequence.filter(s=>s.type==='off').length} off days
                      </div>
                      <button className="btn btn-sm bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"
                        onClick={() => {
                          const targets = selectedEmployees.length > 0
                            ? allEmployees.filter(e => selectedEmployees.includes(e.id))
                            : pagedEmployees;
                          targets.forEach(e => applyPatternToEmployee(e.id, p.id));
                        }}>
                        Apply Pattern
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        <CustomTimeModal />
        <PatternBuilderModal />
        <TemplateModal />
      </div>
    </div>
  );
}
